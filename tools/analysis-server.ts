import http from 'node:http';
import { Battle, extractChannelMessages } from '../sim/battle';
import { PRNG, type PRNGSeed } from '../sim/prng';
import { Dex, TeamValidator, Teams } from '../sim';
import {
	groupSimulationResults, runSimulationBatch, validateBatchRequest,
	type AnalysisBatchRequest,
} from './analysis-batch';

type StartRequest = {
	format: string;
	team1: string;
	team2: string;
	seed?: PRNGSeed;
	replayNodes?: { seed: PRNGSeed, inputLog: string[] }[];
	inputLog?: string[];
	autoTurn?: boolean;
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
		for (const active of request?.active || []) {
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
	const battle = new Battle({
		formatid: Dex.toID(request.format),
		seed: request.seed as any,
		p1: { name: 'Analysis 1', team: request.team1 },
		p2: { name: 'Analysis 2', team: request.team2 },
		send(type, data) {
			if (type === 'update') output.push(...(Array.isArray(data) ? data : [data]));
		},
	});
	const applyInput = (inputLog: string[]) => {
		for (const line of inputLog) {
			const match = /^>p([12])\s+(.+)$/.exec(line);
			if (match) battle.choose(`p${match[1]}` as 'p1' | 'p2', match[2]);
		}
	};
	if (request.replayNodes?.length) {
		for (const node of request.replayNodes) {
			battle.resetRNG(node.seed);
			applyInput(node.inputLog);
		}
	}
	battle.sendUpdates();
	let actionSeed: PRNGSeed | undefined;
	if (request.inputLog?.length) {
		actionSeed = PRNG.generateSeed();
		battle.resetRNG(actionSeed);
		applyInput(request.inputLog);
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
		state: battle.toJSON(),
		requestState: battle.requestState,
		requests: getAnalysisRequests(battle),
		pendingMidTurnSwitches: getPendingMidTurnSwitches(battle),
	};
}

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
	if (req.method !== 'POST' || (pathname !== '/analysis/start' && pathname !== '/analysis/simulate')) {
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
	req.on('data', chunk => body += chunk);
	req.on('end', async () => {
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
				const simulations = await runSimulationBatch(request, abortController.signal);
				if (abortController.signal.aborted) return;
				sendJson(res, 200, {
					simulationCount: simulations.length,
					turnGroups: groupSimulationResults(simulations, 'turn'),
					stateGroups: groupSimulationResults(simulations, 'state'),
				});
				return;
			}
			const result = startBattle(request);
			sendJson(res, result.error ? 400 : 200, result);
		} catch (error: any) {
			sendJson(res, 400, { error: error.message || 'Invalid analysis request.' });
		}
	});
});

const port = Number(process.env.ANALYSIS_PORT || 8001);
server.listen(port, () => console.log(`Analysis API listening on http://localhost:${port}`));
