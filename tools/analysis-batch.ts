import { cpus } from 'node:os';
import { isMainThread, parentPort, Worker, workerData } from 'node:worker_threads';
import { Battle, extractChannelMessages } from '../sim/battle';
import { Dex, PRNG, TeamValidator, Teams } from '../sim';
import type { PRNGSeed } from '../sim/prng';

export interface AnalysisReplayNode {
	seed: PRNGSeed;
	inputLog: string[];
}

export interface AnalysisBatchRequest {
	format: string;
	team1: string;
	team2: string;
	seed?: PRNGSeed;
	replayNodes?: AnalysisReplayNode[];
	inputLog: string[];
	count: number;
}

export interface AnalysisSimulationResult {
	index: number;
	seed: PRNGSeed;
	log: string[];
	turnLog: string[];
	totalDamage: number;
}

export interface AnalysisSimulationGroup {
	count: number;
	percentage: number;
	min: AnalysisSimulationResult;
	median: AnalysisSimulationResult;
	max: AnalysisSimulationResult;
}

interface SimulationJob extends AnalysisBatchRequest {
	seeds: PRNGSeed[];
	startIndex: number;
}

function applyInput(battle: Battle, inputLog: string[]) {
	for (const line of inputLog) {
		const match = /^>p([12])\s+(.+)$/.exec(line);
		if (match) battle.choose(`p${match[1]}` as 'p1' | 'p2', match[2]);
	}
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

export function getSimulationGroupKey(turnLog: string[]) {
	return turnLog.filter(line => line.split('|')[1] !== 't:').map(line => {
		const parts = line.split('|');
		const event = parts[1];
		const hpIndex = event === 'switch' || event === 'drag' || event === 'replace' ? 4 :
			['-damage', '-heal', '-sethp'].includes(event) ? 3 : -1;
		if (hpIndex < 0 || !parts[hpIndex]) return line;
		parts[hpIndex] = parts[hpIndex].replace(/^\d+\/\d+/, '<hp>');
		return parts.join('|');
	}).join('\n');
}

export function groupSimulationResults(simulations: AnalysisSimulationResult[]): AnalysisSimulationGroup[] {
	const grouped = new Map<string, AnalysisSimulationResult[]>();
	for (const simulation of simulations) {
		const key = getSimulationGroupKey(simulation.turnLog);
		const group = grouped.get(key);
		if (group) group.push(simulation);
		else grouped.set(key, [simulation]);
	}
	return [...grouped.values()].map(group => {
		group.sort((left, right) => left.totalDamage - right.totalDamage || left.index - right.index);
		return {
			count: group.length,
			percentage: group.length / simulations.length * 100,
			min: group[0],
			median: group[Math.floor((group.length - 1) / 2)],
			max: group[group.length - 1],
		};
	}).sort((left, right) => right.count - left.count || left.min.index - right.min.index);
}

function simulate(job: SimulationJob, seed: PRNGSeed, offset: number): AnalysisSimulationResult {
	const output: string[] = [];
	const battle = new Battle({
		formatid: Dex.toID(job.format),
		seed: job.seed as any,
		p1: { name: 'Analysis 1', team: job.team1 },
		p2: { name: 'Analysis 2', team: job.team2 },
		send(type, data) {
			if (type === 'update') output.push(...(Array.isArray(data) ? data : [data]));
		},
	});
	for (const node of job.replayNodes || []) {
		battle.resetRNG(node.seed);
		applyInput(battle, node.inputLog);
	}
	battle.sendUpdates();
	const prefixLog = extractLog(output);
	const turnOutputStart = output.length;
	battle.resetRNG(seed);
	applyInput(battle, job.inputLog);
	battle.sendUpdates();
	const turnLog = extractLog(output.slice(turnOutputStart));
	return {
		index: job.startIndex + offset,
		seed,
		log: extractLog(output),
		turnLog,
		totalDamage: calculateTotalDamage(prefixLog, turnLog),
	};
}

function runChunk(job: SimulationJob) {
	return job.seeds.map((seed, offset) => simulate(job, seed, offset));
}

function runWorker(job: SimulationJob) {
	return new Promise<AnalysisSimulationResult[]>((resolve, reject) => {
		const worker = new Worker(__filename, { workerData: job });
		worker.once('message', resolve);
		worker.once('error', reject);
		worker.once('exit', code => {
			if (code) reject(new Error(`Analysis simulation worker exited with code ${code}.`));
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

export async function runSimulationBatch(request: AnalysisBatchRequest) {
	const seeds = Array.from({ length: request.count }, () => PRNG.generateSeed());
	const configuredWorkers = Number(process.env.ANALYSIS_SIMULATION_WORKERS);
	const workerLimit = Number.isSafeInteger(configuredWorkers) && configuredWorkers > 0 ? configuredWorkers : cpus().length - 1;
	const workerCount = Math.max(1, Math.min(request.count, workerLimit));
	const chunkSize = Math.ceil(request.count / workerCount);
	const jobs: SimulationJob[] = [];
	for (let startIndex = 0; startIndex < request.count; startIndex += chunkSize) {
		jobs.push({ ...request, seeds: seeds.slice(startIndex, startIndex + chunkSize), startIndex });
	}
	const chunks = workerCount === 1 ? [runChunk(jobs[0])] : await Promise.all(jobs.map(runWorker));
	return chunks.flat().sort((left, right) => left.index - right.index);
}

if (!isMainThread) {
	try {
		parentPort!.postMessage(runChunk(workerData as SimulationJob));
	} catch (error: any) {
		throw new Error(error?.message || 'Analysis simulation worker failed.');
	}
}