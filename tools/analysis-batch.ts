import { cpus } from 'node:os';
import { isMainThread, parentPort, Worker, workerData } from 'node:worker_threads';
import { type Battle, extractChannelMessages } from '../sim/battle';
import { PRNG, TeamValidator, Teams } from '../sim';
import type { PRNGSeed } from '../sim/prng';
import type { Pokemon } from '../sim/pokemon';
import {
	applyInputLog, createAnalysisBattle, replayAnalysisRecords, type AnalysisReplayRecord,
} from './analysis-state';

export interface AnalysisBatchRequest {
	format: string;
	team1: string;
	team2: string;
	seed?: PRNGSeed;
	replayNodes?: AnalysisReplayRecord[];
	inputLog: string[];
	midTurnSwitchChoices?: AnalysisMidTurnSwitchChoice[];
	count: number;
}

export interface AnalysisMidTurnSwitchChoice {
	side: 'p1' | 'p2';
	pokemonIndex: number;
	reason: string;
	replacementIndex: number;
}

export interface AnalysisSimulationResult {
	index: number;
	seed: PRNGSeed;
	log: string[];
	turnLog: string[];
	switchInputLog: string[];
	totalDamage: number;
	protectedMisses: string[];
	brokenProtections: string[];
}

export interface AnalysisSimulationGroup {
	count: number;
	percentage: number;
	min: AnalysisSimulationResult;
	median: AnalysisSimulationResult;
	max: AnalysisSimulationResult;
	executions: AnalysisSimulationResult[];
	requiredCritMoves: string[];
	requiredMissMoves: string[];
}

export type AnalysisGroupingMode = 'turn' | 'state';

interface SimulationJob extends AnalysisBatchRequest {
	seeds: PRNGSeed[];
	startIndex: number;
}

interface ResolvedMidTurnSwitchChoice extends AnalysisMidTurnSwitchChoice {
	pokemon?: Pokemon;
	replacement?: Pokemon;
}

function getMidTurnSwitchReason(pokemon: Pokemon) {
	if (typeof pokemon.switchFlag === 'string') return pokemon.switchFlag;
	if (pokemon.usedItemThisTurn && ['ejectbutton', 'ejectpack'].includes(pokemon.lastItem)) return pokemon.lastItem;
	return '';
}

function applyMidTurnSwitchChoices(
	battle: Battle, configuredChoices: ResolvedMidTurnSwitchChoice[], switchInputLog: string[]
) {
	if (battle.requestState !== 'switch') return false;
	const choicesBySide = new Map<'p1' | 'p2', string>();
	for (const side of battle.sides) {
		if (!side.active.some(pokemon => pokemon?.switchFlag)) continue;
		const chosen = new Set<Pokemon>();
		const sideChoices: string[] = [];
		for (const pokemon of side.active) {
			if (!pokemon?.switchFlag) {
				sideChoices.push('pass');
				continue;
			}
			const reason = getMidTurnSwitchReason(pokemon);
			const configured = configuredChoices.find(choice => choice.pokemon === pokemon && choice.reason === reason);
			if (!configured) return false;
			const available = side.pokemon.filter(candidate =>
				candidate.hp && !candidate.isActive && !chosen.has(candidate)
			);
			const replacement = available.includes(configured.replacement!) ? configured.replacement! : available[0];
			if (!replacement) {
				sideChoices.push('pass');
				continue;
			}
			chosen.add(replacement);
			sideChoices.push(`switch ${replacement.position + 1}`);
		}
		choicesBySide.set(side.id as 'p1' | 'p2', sideChoices.join(', '));
	}
	if (!choicesBySide.size) return false;
	for (const [side, choices] of choicesBySide) {
		if (battle.choose(side, choices)) switchInputLog.push(`>${side} ${choices}`);
	}
	return true;
}

function extractLog(output: string[]) {
	return extractChannelMessages(output.join('\n'), [-1])[-1];
}

function parseHP(hpText: string) {
	const match = /^(\d+)\/(\d+)/.exec(hpText);
	return match ? Number(match[1]) : null;
}

export function calculateTotalDamage(prefixLog: string[], turnLog: string[]) {
	const hp = new Map<string, number>();
	const trackHP = (line: string, countDamage: boolean) => {
		const parts = line.split('|');
		const event = parts[1];
		if (!['switch', 'drag', 'replace', '-damage', '-heal', '-sethp'].includes(event)) return 0;
		const ident = parts[2];
		const currentHP = parseHP(parts[event === 'switch' || event === 'drag' || event === 'replace' ? 4 : 3] || '');
		if (!ident || currentHP === null) return 0;
		const previousHP = hp.get(ident);
		hp.set(ident, currentHP);
		return countDamage && event === '-damage' && previousHP !== undefined ? Math.max(0, previousHP - currentHP) : 0;
	};
	for (const line of prefixLog) trackHP(line, false);
	let totalDamage = 0;
	for (const line of turnLog) totalDamage += trackHP(line, true);
	return totalDamage;
}

function normalizeSimulationLine(
	line: string, mode: AnalysisGroupingMode, protectedMisses: Set<string>, preserveExecution = false
) {
	const parts = line.split('|');
	const event = parts[1];
	if (event === 't:') return null;
	if (mode === 'state') {
		if (event === '-damage' && parts.slice(4).includes('[from] confusion')) {
			return preserveExecution ? `|cant|${parts[2]}|confusion` : `|move|${parts[2]}`;
		}
		if (['-crit', '-damage', '-heal', '-hitcount', '-resisted', '-supereffective'].includes(event)) return null;
		if (event === '-activate' && ['confusion', 'item: Quick Claw'].includes(parts[3])) return null;
		if (event === '-status') return parts.slice(0, 4).join('|');
		if (event === '-miss') return preserveExecution && protectedMisses.has(line) ? line : null;
		if (event === 'cant') return preserveExecution ? line : `|move|${parts[2]}`;
	}
	if (event === 'move') return parts.slice(0, 3).join('|');
	const hpIndex = event === 'switch' || event === 'drag' || event === 'replace' ? 4 :
		['-damage', '-heal', '-sethp'].includes(event) ? 3 : -1;
	if (hpIndex < 0 || !parts[hpIndex]) return line;
	parts[hpIndex] = parts[hpIndex].replace(/^\d+\/\d+/, '<hp>');
	return parts.join('|');
}

export function getSimulationGroupKey(
	simulation: AnalysisSimulationResult, mode: AnalysisGroupingMode, sort = false, preserveExecution = false
) {
	const protectedMisses = new Set(simulation.protectedMisses);
	const fainted = new Set(simulation.turnLog.flatMap(line => {
		const parts = line.split('|');
		return parts[1] === 'faint' && parts[2] ? [parts[2]] : [];
	}));
	const lines = simulation.turnLog.map(line => {
		const parts = line.split('|');
		if (mode === 'state' && !preserveExecution && parts[1]?.startsWith('-') && fainted.has(parts[2])) return null;
		return normalizeSimulationLine(line, mode, protectedMisses, preserveExecution);
	})
		.filter((line): line is string => line !== null);
	if (mode === 'state') {
		lines.push(...simulation.brokenProtections.map(ident => `|protected-hp-lost|${ident}`));
	}
	if (sort) lines.sort();
	return lines.join('\n');
}

function chooseRepresentatives(group: AnalysisSimulationResult[]) {
	const rolls = [...group];
	rolls.sort((left, right) => left.totalDamage - right.totalDamage || left.index - right.index);
	return {
		min: rolls[0],
		median: rolls[Math.floor((rolls.length - 1) / 2)],
		max: rolls[rolls.length - 1],
	};
}

function getMoveResults(turnLog: string[]) {
	const results = new Map<string, { crit: boolean, miss: boolean }>();
	const moveCounts = new Map<string, number>();
	let currentKey = '';
	let currentMove = '';
	for (const line of turnLog) {
		const parts = line.split('|');
		const event = parts[1];
		if (event === 'move') {
			const actor = parts[2] || '';
			const move = parts[3] || '';
			if (currentKey && currentMove === `${actor}|${move}` && parts.slice(5).some(part => part.startsWith('[spread]'))) {
				continue;
			}
			const occurrence = (moveCounts.get(actor) || 0) + 1;
			moveCounts.set(actor, occurrence);
			currentKey = `${actor}|${occurrence}`;
			currentMove = `${actor}|${move}`;
			results.set(currentKey, { crit: false, miss: false });
			continue;
		}
		if (!event?.startsWith('-')) {
			currentKey = '';
			currentMove = '';
			continue;
		}
		const result = results.get(currentKey);
		if (!result) continue;
		if (event === '-crit') result.crit = true;
		if (event === '-miss') result.miss = true;
	}
	return results;
}

function getRequiredMoveResults(group: AnalysisSimulationResult[]) {
	const requiredCritMoves = new Set<string>();
	const missByMove = new Map<string, boolean>();
	const firstResults = getMoveResults(group[0].turnLog);
	for (const [key, result] of firstResults) {
		if (result.crit) requiredCritMoves.add(key);
	}
	for (const simulation of group) {
		const results = getMoveResults(simulation.turnLog);
		for (const [key, result] of results) {
			missByMove.set(key, (missByMove.get(key) ?? true) && result.miss);
		}
		if (simulation === group[0]) continue;
		for (const key of requiredCritMoves) {
			if (!results.get(key)?.crit) requiredCritMoves.delete(key);
		}
	}
	const requiredMissMoves = [...missByMove].filter(([, missed]) => missed).map(([key]) => key);
	return { requiredCritMoves: [...requiredCritMoves], requiredMissMoves };
}

export function groupSimulationResults(
	simulations: AnalysisSimulationResult[], mode: AnalysisGroupingMode = 'turn'
): AnalysisSimulationGroup[] {
	const grouped = new Map<string, AnalysisSimulationResult[]>();
	for (const simulation of simulations) {
		const key = getSimulationGroupKey(simulation, mode, mode === 'state');
		const group = grouped.get(key);
		if (group) group.push(simulation);
		else grouped.set(key, [simulation]);
	}
	return [...grouped.values()].map(group => {
		const executions = new Map<string, AnalysisSimulationResult>();
		for (const simulation of group) {
			const key = getSimulationGroupKey(simulation, 'state', false, true);
			const current = executions.get(key);
			if (!current || (current.turnLog.some(line => line.startsWith('|-miss|') || line.startsWith('|-crit|')) &&
				!simulation.turnLog.some(line => line.startsWith('|-miss|') || line.startsWith('|-crit|')))) {
				executions.set(key, simulation);
			}
		}
		const representatives = chooseRepresentatives(group);
		return {
			count: group.length,
			percentage: group.length / simulations.length * 100,
			...representatives,
			executions: [...executions.values()].sort((left, right) => left.index - right.index),
			...getRequiredMoveResults(group),
		};
	}).sort((left, right) => right.count - left.count || left.min.index - right.min.index);
}

function simulate(job: SimulationJob, seed: PRNGSeed, offset: number): AnalysisSimulationResult {
	const output: string[] = [];
	const battle = createAnalysisBattle(job, output);
	replayAnalysisRecords(battle, job.replayNodes);
	battle.sendUpdates();
	const midTurnSwitchChoices: ResolvedMidTurnSwitchChoice[] = (job.midTurnSwitchChoices || []).map(choice => {
		const side = battle.sides[choice.side === 'p1' ? 0 : 1];
		return {
			...choice,
			pokemon: side.pokemon[choice.pokemonIndex],
			replacement: side.pokemon[choice.replacementIndex],
		};
	});
	const prefixLog = extractLog(output);
	const turnOutputStart = output.length;
	const protectedAtTurnStart = new Map(battle.getAllPokemon().filter(pokemon =>
		pokemon.hp === pokemon.maxhp && (pokemon.item === 'focussash' || [
			'sturdy', 'multiscale', 'shadowshield', 'terashell',
		].includes(pokemon.ability))
	).map(pokemon => [pokemon.toString(), pokemon]));
	battle.resetRNG(seed);
	applyInputLog(battle, job.inputLog);
	battle.sendUpdates();
	const switchInputLog: string[] = [];
	let switchCount = 0;
	while (applyMidTurnSwitchChoices(battle, midTurnSwitchChoices, switchInputLog)) {
		battle.sendUpdates();
		if (++switchCount > midTurnSwitchChoices.length) {
			throw new Error('Analysis simulation exceeded its configured mid-turn switches.');
		}
	}
	const turnLog = extractLog(output.slice(turnOutputStart));
	const protectedMisses = turnLog.filter(line => {
		const parts = line.split('|');
		if (parts[1] !== '-miss' || !parts[3]) return false;
		const target = protectedAtTurnStart.get(parts[3]);
		return !!target && target.hp === target.maxhp;
	});
	const brokenProtections = [...protectedAtTurnStart].filter(([, pokemon]) =>
		pokemon.hp !== pokemon.maxhp
	).map(([ident]) => ident);
	return {
		index: job.startIndex + offset,
		seed,
		log: extractLog(output),
		turnLog,
		switchInputLog,
		totalDamage: calculateTotalDamage(prefixLog, turnLog),
		protectedMisses,
		brokenProtections,
	};
}

function runChunk(job: SimulationJob) {
	return job.seeds.map((seed, offset) => simulate(job, seed, offset));
}

function runWorker(job: SimulationJob, signal?: AbortSignal) {
	return new Promise<AnalysisSimulationResult[]>((resolve, reject) => {
		const worker = new Worker(__filename, { workerData: job });
		let settled = false;
		const finish = (callback: () => void) => {
			if (settled) return;
			settled = true;
			signal?.removeEventListener('abort', abort);
			callback();
		};
		const abort = () => {
			void worker.terminate();
			finish(() => reject(new Error('Analysis simulation cancelled.')));
		};
		if (signal?.aborted) {
			abort();
			return;
		}
		signal?.addEventListener('abort', abort, { once: true });
		worker.once('message', result => finish(() => resolve(result)));
		worker.once('error', error => finish(() => reject(error)));
		worker.once('exit', code => {
			if (code) finish(() => reject(new Error(`Analysis simulation worker exited with code ${code}.`)));
		});
	});
}

export function validateBatchRequest(request: AnalysisBatchRequest) {
	if (!Number.isSafeInteger(request.count) || request.count < 1 || request.count > 10_000) {
		return 'count must be an integer between 1 and 10000.';
	}
	if (!Array.isArray(request.inputLog) || !request.inputLog.length) {
		return 'inputLog must contain the choices for both players.';
	}
	const team1 = Teams.unpack(request.team1) || [];
	const team2 = Teams.unpack(request.team2) || [];
	const team1Problems = team1.length ? new TeamValidator(request.format).validateTeam(team1) : ['Team is empty.'];
	const team2Problems = team2.length ? new TeamValidator(request.format).validateTeam(team2) : ['Team is empty.'];
	if (team1Problems?.length || team2Problems?.length) {
		return { team1: team1Problems || [], team2: team2Problems || [] };
	}
	return null;
}

export async function runSimulationBatch(request: AnalysisBatchRequest, signal?: AbortSignal) {
	const seeds = Array.from({ length: request.count }, () => PRNG.generateSeed());
	const configuredWorkers = Number(process.env.ANALYSIS_SIMULATION_WORKERS);
	const workerLimit = Number.isSafeInteger(configuredWorkers) && configuredWorkers > 0 ?
		configuredWorkers : cpus().length - 1;
	const workerCount = Math.max(1, Math.min(request.count, workerLimit));
	const chunkSize = Math.ceil(request.count / workerCount);
	const jobs: SimulationJob[] = [];
	for (let startIndex = 0; startIndex < request.count; startIndex += chunkSize) {
		jobs.push({ ...request, seeds: seeds.slice(startIndex, startIndex + chunkSize), startIndex });
	}
	const chunks = await Promise.all(jobs.map(job => runWorker(job, signal)));
	return chunks.flat().sort((left, right) => left.index - right.index);
}

if (!isMainThread) {
	try {
		parentPort!.postMessage(runChunk(workerData as SimulationJob));
	} catch (error: any) {
		throw new Error(error?.message || 'Analysis simulation worker failed.');
	}
}
