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
	/** /analysis/calc: draft choices (`>p1 move 1 +2`) for choice-dependent calc flags and targets */
	choices?: string[],
};

function sendJson(res: http.ServerResponse, status: number, data: Record<string, any>) {
	res.writeHead(status, {
		'Content-Type': 'application/json; charset=utf-8',
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Headers': 'Content-Type',
	});
	res.end(JSON.stringify(data));
}

function validateTeam(format: string, packedTeam: string) {
	const team = Teams.unpack(packedTeam) || [];
	if (!team.length) return ['Team is empty.'];
	const problems = new TeamValidator(format).validateTeam(team);
	return problems || [];
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
	const team1Problems = validateTeam(request.format, request.team1);
	const team2Problems = validateTeam(request.format, request.team2);
	if (team1Problems.length || team2Problems.length) {
		return {
			error: {
				team1: team1Problems,
				team2: team2Problems,
			},
		};
	}

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

async function handleRequest(pathname: string, body: string, res: http.ServerResponse, signal: AbortSignal) {
	try {
		const request = JSON.parse(body) as StartRequest & AnalysisBatchRequest;
		if (!request.format || !request.team1 || !request.team2) {
			sendJson(res, 400, { error: 'format, team1, and team2 are required.' });
			return;
		}
		if (pathname === '/analysis/simulate') {
			const error = validateBatchRequest(request);
			if (error) {
				sendJson(res, 400, { error });
				return;
			}
			const simulations = await runSimulationBatch(request, signal);
			if (signal.aborted) return;
			sendJson(res, 200, {
				simulationCount: simulations.length,
				turnGroups: groupSimulationResults(simulations, 'turn'),
				stateGroups: groupSimulationResults(simulations, 'state'),
			});
			return;
		}
		if (pathname === '/analysis/calc') {
			const calcResult = calcBattle(request);
			sendJson(res, calcResult.error ? 400 : 200, calcResult);
			return;
		}
		const result = startBattle(request);
		sendJson(res, result.error ? 400 : 200, result);
	} catch (error: any) {
		sendJson(res, 400, { error: error.message || 'Invalid analysis request.' });
	}
}

/** Damage calcs at the reconstructed decision point (docs/analysis/plan.md, Phase 1). */
function calcBattle(request: StartRequest) {
	const team1Problems = validateTeam(request.format, request.team1);
	const team2Problems = validateTeam(request.format, request.team2);
	if (team1Problems.length || team2Problems.length) {
		return { error: { team1: team1Problems, team2: team2Problems } };
	}
	const battle = createAnalysisBattle(request);
	replayAnalysisRecords(battle, request.replayNodes);
	return { results: getAnalysisCalcs(battle, request.choices) };
}

const ROUTES = new Set(['/analysis/start', '/analysis/simulate', '/analysis/calc']);

const server = http.createServer((req, res) => {
	if (req.method === 'OPTIONS') {
		res.writeHead(204, {
			'Access-Control-Allow-Origin': '*',
			'Access-Control-Allow-Headers': 'Content-Type',
		});
		res.end();
		return;
	}
	const pathname = new URL(req.url || '/', 'http://localhost').pathname;
	if (req.method !== 'POST' || !ROUTES.has(pathname)) {
		sendJson(res, 404, { error: 'Not found' });
		return;
	}

	let body = '';
	const abortController = new AbortController();
	req.once('aborted', () => abortController.abort());
	res.once('close', () => {
		if (!res.writableEnded) abortController.abort();
	});
	req.setEncoding('utf8');
	req.on('data', chunk => {
		body += chunk;
	});
	req.on('end', () => void handleRequest(pathname, body, res, abortController.signal));
});

const port = Number(process.env.ANALYSIS_PORT || 8001);
server.listen(port, () => console.log(`Analysis API listening on http://localhost:${port}`));
