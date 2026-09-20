import { execSync } from 'node:child_process';
import http from 'node:http';
import { type Battle, extractChannelMessages } from '../sim/battle';
import { PRNG, type PRNGSeed } from '../sim/prng';
import { Dex, TeamValidator, Teams } from '../sim';
import {
	groupSimulationResults, runSimulationBatch, validateBatchRequest,
	type AnalysisBatchRequest,
} from './analysis-batch';
import { getAnalysisCalcs } from './analysis-calc';
import { getFieldEffectOptions } from './analysis-edits';
import { getPlaceholderTeams } from './analysis-setup';
import {
	applyInputLog, createAnalysisBattle, getAnalysisSnapshot, replayAnalysisRecords,
	type AnalysisReplayRecord,
} from './analysis-state';

type StartRequest = {
	format: string,
	team1: string,
	team2: string,
	seed?: PRNGSeed,
	/** path from the root to the target node, each with optional edits, seed, and inputs */
	replayNodes?: AnalysisReplayRecord[],
	/** choices to execute from the reconstructed position under a fresh seed */
	inputLog?: string[],
	autoTurn?: boolean,
	/**
	 * Skip team validation. Set by a Set Up Position tab, whose placeholder team is deliberately illegal
	 * (too small for a VGC format, no moves, two of a species); see tools/analysis-setup.ts. The tool is a
	 * sandbox and mid-battle team edits already bypass the validator, so this only extends that to the
	 * team the battle is built from.
	 */
	sandbox?: boolean,
	/** /analysis/calc: draft choices (`>p1 move 1 +2`) for choice-dependent calc flags and targets */
	choices?: string[],
};

/**
 * The commit this API is running, recorded in an exported analysis so an import can say whether the sim
 * has moved since (docs/analysis/plan.md, Phase 6).
 *
 * An exported node is a *recipe* — a seed plus edits and choices — not a saved position, so it only
 * replays the same way under the same sim and mod code. An upstream merge or a fakemon change can make
 * the same seed produce a different turn, silently. This is what lets the import warn about that.
 *
 * Read once at startup, as `server/room-battle.ts` does for `__version`. A checkout without git, or an
 * export from a server that had none, simply has no commit to compare, and the import says nothing.
 */
const SERVER_COMMIT = (() => {
	try {
		return execSync('git rev-parse HEAD', { stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
	} catch {
		return '';
	}
})();

/**
 * Every format an analysis can be started in, in the order `formats.ts` declares them, so the client can
 * group them by section the way the play client's own format menu does.
 *
 * **Team-generating formats are left out.** A random format has no teambuilder, so New Analysis From Teams
 * has nothing to offer for it, and Set Up Position's random path is untested (see
 * docs/analysis/replay-import-audit.md, QI). Listing a format the pickers cannot honour is worse than
 * leaving it out; this is where to relax that if the random path is ever tested.
 *
 * Read fresh rather than cached: the list is small, the call is rare, and a cached copy would go stale
 * against a mod reload.
 */
function getBuildableFormats() {
	return Dex.formats.all()
		.filter(format => format.effectType === 'Format' && !format.team)
		// `column` is what lets the client lay the menu out in columns the way the play client's does
		.map(format => ({
			id: format.id, name: format.name, section: format.section || 'Other', column: format.column || 0,
		}));
}

/*********************************************************
 * Hardening
 *
 * The API runs an unauthenticated simulator, so every limit here exists to stop one caller costing the
 * whole box. The VPS has ~2 GB of RAM and also runs the game server (docs/hosting/overview.md).
 *
 * **These mirror `server/`'s own patterns rather than importing them**, which was deliberate and is worth
 * recording, because importing looks obviously better until you read what the imports do:
 * - `TimedCounter` (`server/monitor.ts`) is exactly the counter below, but its module installs a two-hour
 *   `setInterval` calling `Monitor.clean()`, which reads the `IPTools` **global** — absent in this
 *   standalone process, so it would throw every two hours in production.
 * - `IPTools.checker` (`server/ip-tools.ts`) parses CIDR ranges properly, but importing that module fires
 *   `IPTools.updateTorRanges()`, an outbound fetch, at startup. A hardening change should not add one.
 *
 * So the shapes are copied and the dependencies are not. Every knob is an environment variable, like
 * `ANALYSIS_PORT`, because this process does not load `config/config.js`.
 *********************************************************/

/**
 * Origins allowed to call the API from a browser, or `*` to allow any.
 *
 * The default is local development only. **Production needs nothing set**: the deployment plan proxies
 * the API under the page's own origin (`location /analysis/`), and a browser sends no `Origin` header on
 * a same-origin request, so there is nothing to grant. A separate API host is what this is for.
 */
const ALLOWED_ORIGINS = (process.env.ANALYSIS_ALLOWED_ORIGINS || '')
	.split(',').map(origin => origin.trim()).filter(Boolean);

/**
 * The largest request body accepted, in bytes.
 *
 * Not a guess at what a request "should" be: a `/analysis/start` for an imported replay carries every
 * node's edits, and an analysis file of a long game runs to a few hundred KB. This is roomy enough for
 * that and small enough that a body cannot exhaust memory. `server/sockets.ts` caps a socket message at
 * 100KB the same way, with a message rather than a silent drop.
 */
const MAX_BODY_BYTES = Number(process.env.ANALYSIS_MAX_BODY_BYTES) || 4 * 1024 * 1024;

/** Requests per IP per window, and the window. Generous: one page-load makes several calls. */
const RATE_LIMIT = Number(process.env.ANALYSIS_RATE_LIMIT) || 240;
const RATE_WINDOW_MS = Number(process.env.ANALYSIS_RATE_WINDOW_MS) || 60 * 1000;

/**
 * How many Monte Carlo batches may run at once, across all callers.
 *
 * `validateBatchRequest` already bounds `count` (1–10,000) and `ANALYSIS_SIMULATION_WORKERS` bounds the
 * workers **within** one batch — neither bounds how many batches are in flight, which is the one that
 * actually costs the box its memory.
 */
const MAX_CONCURRENT_SIMULATIONS = Number(process.env.ANALYSIS_MAX_CONCURRENT_SIMULATIONS) || 2;

/**
 * Proxies whose `X-Forwarded-For` is believed, as exact addresses.
 *
 * The default is the loopback, because the deployment is an nginx proxy on the same host; `Config.proxyip`
 * is the game server's equivalent and production sets it to `127.0.0.1` too. Exact matching rather than
 * `IPTools.checker`'s CIDR parsing is enough for that, and avoids the import described above. **Without
 * this the rate limit would see every request as coming from the proxy** and throttle the whole site as
 * one caller.
 */
const TRUSTED_PROXIES = new Set(
	(process.env.ANALYSIS_TRUSTED_PROXIES || '127.0.0.1,::1,::ffff:127.0.0.1')
		.split(',').map(ip => ip.trim()).filter(Boolean)
);

/**
 * A fixed-window counter per key, after `TimedCounter` in `server/monitor.ts`.
 *
 * Fixed window, not sliding: it is two numbers per key and it is what the game server uses. The edge case
 * (twice the limit across a window boundary) does not matter for a limit whose job is to stop a script,
 * not to be exact.
 */
class AnalysisCounter extends Map<string, [count: number, windowStart: number]> {
	increment(key: string, timeLimit: number) {
		const entry = this.get(key);
		const now = Date.now();
		if (!entry || now > entry[1] + timeLimit) {
			this.set(key, [1, now]);
			return 1;
		}
		entry[0]++;
		return entry[0];
	}
}

const requestCounts = new AnalysisCounter();
let runningSimulations = 0;

/**
 * The caller's address, reading `X-Forwarded-For` only from a trusted proxy.
 *
 * Right to left, as `server/sockets.ts` does: the rightmost entry is the one *our* proxy added and so the
 * only one that cannot be forged. Walking left past further trusted proxies handles a chain; stopping at
 * the first untrusted address is what makes a spoofed header harmless — a caller can prepend anything,
 * but it stays to the left of the entry nginx wrote.
 */
function getClientIp(req: http.IncomingMessage) {
	const socketIp = req.socket.remoteAddress || '';
	if (!TRUSTED_PROXIES.has(socketIp)) return socketIp;
	const forwarded = String(req.headers['x-forwarded-for'] || '').split(',').map(ip => ip.trim()).reverse();
	for (const ip of forwarded) {
		if (ip && !TRUSTED_PROXIES.has(ip)) return ip;
	}
	return socketIp;
}

/**
 * The CORS headers for a request, or `null` when its origin is not allowed.
 *
 * A request with no `Origin` is same-origin or not a browser, and is allowed with no CORS headers at all —
 * which is the production path. `Vary: Origin` because the answer now depends on the request, so a cache
 * in front must not serve one origin's response to another.
 */
function corsHeaders(req: http.IncomingMessage): Record<string, string> | null {
	const origin = req.headers.origin;
	if (!origin) return {};
	const allowed = ALLOWED_ORIGINS.includes('*') || ALLOWED_ORIGINS.includes(origin) ||
		(!ALLOWED_ORIGINS.length && /^https?:\/\/(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(origin));
	if (!allowed) return null;
	return {
		'Access-Control-Allow-Origin': origin,
		'Access-Control-Allow-Headers': 'Content-Type',
		'Access-Control-Max-Age': '86400',
		Vary: 'Origin',
	};
}

function sendJson(
	res: http.ServerResponse, status: number, data: Record<string, any>, cors: Record<string, string> = {}
) {
	res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...cors });
	res.end(JSON.stringify(data));
}

function validateTeam(format: string, packedTeam: string) {
	const team = Teams.unpack(packedTeam) || [];
	if (!team.length) return ['Team is empty.'];
	const problems = new TeamValidator(format).validateTeam(team);
	return problems || [];
}

/** An empty team still breaks the sim, so a sandbox request is checked for that and nothing else. */
function validateTeams(request: StartRequest) {
	const team1Problems = request.sandbox ?
		(Teams.unpack(request.team1)?.length ? [] : ['Team is empty.']) :
		validateTeam(request.format, request.team1);
	const team2Problems = request.sandbox ?
		(Teams.unpack(request.team2)?.length ? [] : ['Team is empty.']) :
		validateTeam(request.format, request.team2);
	if (!team1Problems.length && !team2Problems.length) return null;
	return { team1: team1Problems, team2: team2Problems };
}

function getPendingMidTurnSwitches(battle: Battle) {
	if (battle.requestState !== 'switch') return [];
	return battle.sides.flatMap(side => side.active.flatMap(pokemon => {
		if (!pokemon?.switchFlag) return [];
		let reason = typeof pokemon.switchFlag === 'string' ? pokemon.switchFlag : '';
		if (!reason && pokemon.usedItemThisTurn && ['ejectbutton', 'ejectpack'].includes(pokemon.lastItem)) {
			reason = pokemon.lastItem;
		}
		if (!reason) return [];
		const effect = Dex.moves.get(reason).exists ? Dex.moves.get(reason) : Dex.items.get(reason);
		return [{
			side: side.id,
			pokemonIndex: side.pokemon.indexOf(pokemon),
			pokemon: pokemon.name,
			reason,
			reasonName: effect.name,
		}];
	}));
}

function getAnalysisRequests(battle: Battle) {
	const requests = battle.getRequests(battle.requestState);
	for (const request of requests) {
		for (const active of (request as AnyObject)?.active || []) {
			for (const move of active?.moves || []) {
				move.selfSwitch = !!battle.dex.moves.get(move.id).selfSwitch;
			}
		}
	}
	return requests;
}

function startBattle(request: StartRequest) {
	const teamProblems = validateTeams(request);
	if (teamProblems) return { error: teamProblems };

	const output: string[] = [];
	const battle = createAnalysisBattle(request, output);
	const { droppedEdits, appliedEdits } = replayAnalysisRecords(battle, request.replayNodes);
	battle.sendUpdates();
	let actionSeed: PRNGSeed | undefined;
	if (request.inputLog?.length) {
		actionSeed = PRNG.generateSeed();
		battle.resetRNG(actionSeed);
		applyInputLog(battle, request.inputLog);
		battle.sendUpdates();
	}
	if (request.autoTurn) {
		battle.makeChoices();
		if (battle.requestState === 'move') battle.makeChoices();
		battle.sendUpdates();
	}
	const log = extractChannelMessages(output.join('\n'), [-1])[-1];

	return {
		format: battle.format.id,
		gameType: battle.gameType,
		seed: battle.prngSeed,
		currentSeed: battle.prng.getSeed(),
		actionSeed,
		log,
		snapshot: getAnalysisSnapshot(battle),
		droppedEdits,
		appliedEdits,
		editOptions: { field: getFieldEffectOptions(battle) },
		requestState: battle.requestState,
		requests: getAnalysisRequests(battle),
		pendingMidTurnSwitches: getPendingMidTurnSwitches(battle),
	};
}

async function handleRequest(
	pathname: string, body: string, res: http.ServerResponse, signal: AbortSignal,
	cors: Record<string, string> = {}
) {
	try {
		// Take no body, so they answer before the parse below: an empty POST is the natural way to ask.
		if (pathname === '/analysis/version') {
			sendJson(res, 200, { serverCommit: SERVER_COMMIT }, cors);
			return;
		}
		if (pathname === '/analysis/formats') {
			sendJson(res, 200, { formats: getBuildableFormats() }, cors);
			return;
		}
		const request = JSON.parse(body) as StartRequest & AnalysisBatchRequest;
		if (pathname === '/analysis/setup') {
			// the only route that builds its own teams, so it runs before the team check below
			sendJson(res, 200, getPlaceholderTeams(request.format), cors);
			return;
		}
		if (!request.format || !request.team1 || !request.team2) {
			sendJson(res, 400, { error: 'format, team1, and team2 are required.' }, cors);
			return;
		}
		if (pathname === '/analysis/simulate') {
			const error = validateBatchRequest(request);
			if (error) {
				sendJson(res, 400, { error }, cors);
				return;
			}
			/*
			 * The concurrency gate, held across the batch and released in `finally` so an abort — which the
			 * client does on every re-simulate — cannot leak a slot and shrink the cap to nothing over time.
			 * Refused rather than queued: a caller who waits in a queue still holds a connection, and the
			 * client can simply be told to try again.
			 */
			if (runningSimulations >= MAX_CONCURRENT_SIMULATIONS) {
				res.setHeader('Retry-After', '5');
				sendJson(res, 503, {
					error: 'The analysis server is busy simulating. Try again in a moment.',
				}, cors);
				return;
			}
			runningSimulations++;
			let simulations;
			try {
				simulations = await runSimulationBatch(request, signal);
			} finally {
				runningSimulations--;
			}
			if (signal.aborted) return;
			sendJson(res, 200, {
				simulationCount: simulations.length,
				turnGroups: groupSimulationResults(simulations, 'turn'),
				stateGroups: groupSimulationResults(simulations, 'state'),
			}, cors);
			return;
		}
		if (pathname === '/analysis/calc') {
			const calcResult = calcBattle(request);
			sendJson(res, calcResult.error ? 400 : 200, calcResult, cors);
			return;
		}
		const result = startBattle(request);
		sendJson(res, result.error ? 400 : 200, result, cors);
	} catch (error: any) {
		sendJson(res, 400, { error: error.message || 'Invalid analysis request.' }, cors);
	}
}

/** Damage calcs at the reconstructed decision point (docs/analysis/plan.md, Phase 1). */
function calcBattle(request: StartRequest) {
	const teamProblems = validateTeams(request);
	if (teamProblems) return { error: teamProblems };
	const battle = createAnalysisBattle(request);
	replayAnalysisRecords(battle, request.replayNodes);
	return { results: getAnalysisCalcs(battle, request.choices) };
}

const ROUTES = new Set([
	'/analysis/start', '/analysis/simulate', '/analysis/calc', '/analysis/setup', '/analysis/version',
	'/analysis/formats',
]);

export const server = http.createServer((req, res) => {
	const cors = corsHeaders(req);
	if (!cors) {
		// No CORS headers on the refusal, so the browser reports it as blocked rather than as a server error
		sendJson(res, 403, { error: 'This origin is not allowed to use this analysis API.' });
		return;
	}
	if (req.method === 'OPTIONS') {
		res.writeHead(204, cors);
		res.end();
		return;
	}
	const pathname = new URL(req.url || '/', 'http://localhost').pathname;
	if (req.method !== 'POST' || !ROUTES.has(pathname)) {
		sendJson(res, 404, { error: 'Not found' }, cors);
		return;
	}
	if (requestCounts.increment(getClientIp(req), RATE_WINDOW_MS) > RATE_LIMIT) {
		res.setHeader('Retry-After', String(Math.ceil(RATE_WINDOW_MS / 1000)));
		sendJson(res, 429, { error: 'Too many requests to the analysis API. Try again shortly.' }, cors);
		return;
	}

	let body = '';
	let bodyBytes = 0;
	const abortController = new AbortController();
	req.once('aborted', () => abortController.abort());
	res.once('close', () => {
		if (!res.writableEnded) abortController.abort();
	});
	req.setEncoding('utf8');
	req.on('data', chunk => {
		/*
		 * Counted in bytes and destroyed at the cap, rather than appended and checked at the end: the
		 * whole point is that an unbounded body must never be held in memory, and `req.destroy()` after
		 * the response stops the sender pushing more. `Buffer.byteLength` because `setEncoding('utf8')`
		 * hands over a string, whose `.length` is code units, not the bytes on the wire.
		 */
		if (bodyBytes > MAX_BODY_BYTES) return;
		bodyBytes += Buffer.byteLength(chunk, 'utf8');
		if (bodyBytes > MAX_BODY_BYTES) {
			body = '';
			sendJson(res, 413, {
				error: `That request is too large (over ${Math.floor(MAX_BODY_BYTES / 1024)}KB).`,
			}, cors);
			req.destroy();
			return;
		}
		body += chunk;
	});
	req.on('end', () => {
		if (res.writableEnded) return;
		void handleRequest(pathname, body, res, abortController.signal, cors);
	});
});

/**
 * Drops counters for callers that have gone quiet, so the map cannot grow without bound — `Monitor.clean`
 * does the same for the game server's. Unreferenced so it never by itself keeps the process alive.
 */
const cleanInterval = setInterval(() => {
	const cutoff = Date.now() - RATE_WINDOW_MS;
	for (const [ip, [, windowStart]] of requestCounts) {
		if (windowStart < cutoff) requestCounts.delete(ip);
	}
}, 10 * RATE_WINDOW_MS);
cleanInterval.unref();

// Only when run directly, so a test can start the server on its own port (test/tools/analysis/server.js).
if (require.main === module) {
	const port = Number(process.env.ANALYSIS_PORT || 8001);
	// Localhost by default: hosted, this sits behind an nginx proxy on the same box, and the VPS has no
	// firewall in front of it, so anything bound on 0.0.0.0 is public (docs/hosting/overview.md). Set
	// ANALYSIS_BIND_IP=0.0.0.0 only to reach the API from another machine.
	const host = process.env.ANALYSIS_BIND_IP || '127.0.0.1';
	server.listen(port, host, () => console.log(`Analysis API listening on http://${host}:${port}`));
}
