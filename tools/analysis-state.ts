/**
 * Shared battle reconstruction and state snapshots for the analysis API.
 *
 * A position is rebuilt from the root seed plus an ordered list of replay
 * records (one per node on the path). See docs/analysis/overview.md
 * ("Determinism model") and docs/analysis/plan.md (D2, D3).
 */
import { Battle } from '../sim/battle';
import { toID } from '../sim/dex';
import type { PRNGSeed } from '../sim/prng';
import type { Pokemon } from '../sim/pokemon';

/**
 * Manual state edits stored on a node. Values are absolute ("set to"); missing
 * fields are left unchanged. Applied in layers: teams -> active -> pokemon -> field.
 * Not implemented yet (plan.md Phase 2/3); the shape is fixed here so records
 * can already carry it.
 */
export interface AnalysisEdits {
	teams?: { p1?: PokemonSet[], p2?: PokemonSet[] };
	active?: { p1?: (number | null)[], p2?: (number | null)[] };
	pokemon?: { [sideAndIndex: string]: AnalysisPokemonStateEdit };
	field?: AnalysisFieldStateEdit;
}

export interface AnalysisPokemonStateEdit {
	hp?: number;
	pp?: (number | null)[];
	status?: '' | 'brn' | 'par' | 'slp' | 'frz' | 'psn' | 'tox';
	toxicStage?: number;
	sleepTurns?: number;
	terastallized?: boolean;
	megaEvolved?: boolean;
	boosts?: Partial<BoostsTable>;
	volatiles?: { [id: string]: false | { [param: string]: number | string | boolean } };
}

export interface AnalysisFieldStateEdit {
	weather?: string;
	terrain?: string;
	pseudoWeather?: { [id: string]: boolean };
	sides?: { p1?: { [id: string]: boolean | number }, p2?: { [id: string]: boolean | number } };
}

/** One node on the path from the root. A record may carry only edits (no seed yet). */
export interface AnalysisReplayRecord {
	edits?: AnalysisEdits;
	seed?: PRNGSeed | null;
	inputLog?: string[];
}

export interface AnalysisBattleOptions {
	format: string;
	team1: string;
	team2: string;
	seed?: PRNGSeed;
}

export interface AnalysisEffectSnapshot {
	id: string;
	duration?: number;
	/** primitive fields of the effect state, e.g. layers, stage, hp */
	data?: { [key: string]: number | string | boolean };
}

export interface AnalysisPokemonSnapshot {
	index: number;
	ident: string;
	name: string;
	species: string;
	baseSpecies: string;
	set: PokemonSet;
	item: string;
	ability: string;
	level: number;
	hp: number;
	maxhp: number;
	fainted: boolean;
	status: string;
	toxicStage?: number;
	sleepTurns?: number;
	moves: { id: string, name: string, pp: number, maxpp: number, disabled: boolean }[];
	isActive: boolean;
	slot: number | null;
	boosts: BoostsTable;
	volatiles: AnalysisEffectSnapshot[];
	types: string[];
	teraType: string;
	terastallized: string | null;
	canTerastallize: boolean;
	megaEvolved: boolean;
	canMegaEvo: boolean;
	stats: StatsExceptHPTable;
}

export interface AnalysisSideSnapshot {
	id: SideID;
	name: string;
	sideConditions: AnalysisEffectSnapshot[];
	/** index into `pokemon` for each active slot */
	active: (number | null)[];
	/** in `side.pokemon` order, which matches request order */
	pokemon: AnalysisPokemonSnapshot[];
}

export interface AnalysisSnapshot {
	turn: number;
	gen: number;
	gameType: GameType;
	formatId: string;
	rules: { terastallization: boolean, dynamax: boolean };
	field: {
		weather: AnalysisEffectSnapshot | null,
		terrain: AnalysisEffectSnapshot | null,
		pseudoWeather: AnalysisEffectSnapshot[],
	};
	sides: AnalysisSideSnapshot[];
}

const INPUT_LINE = /^>(p[1-4])\s+(.+)$/;

export function createAnalysisBattle(options: AnalysisBattleOptions, output?: string[]) {
	return new Battle({
		formatid: toID(options.format),
		seed: options.seed,
		p1: { name: 'Analysis 1', team: options.team1 },
		p2: { name: 'Analysis 2', team: options.team2 },
		send(type, data) {
			if (type === 'update' && output) output.push(...(Array.isArray(data) ? data : [data]));
		},
	});
}

export function applyInputLog(battle: Battle, inputLog: string[] | undefined) {
	for (const line of inputLog || []) {
		const match = INPUT_LINE.exec(line);
		if (match) battle.choose(match[1] as SideID, match[2]);
	}
}

/**
 * Applies a node's manual edits at the start of its turn. Edits must not consume
 * RNG (write state directly), so replays stay deterministic.
 * Not implemented yet: plan.md Phase 2 (field/pokemon) and Phase 3 (teams).
 */
export function applyAnalysisEdits(battle: Battle, edits: AnalysisEdits | undefined) {
	if (!edits) return { droppedEdits: [] as string[] };
	return { droppedEdits: [] as string[] };
}

/** Replays records in order: edits first, then reseed and apply that node's choices. */
export function replayAnalysisRecords(battle: Battle, records: AnalysisReplayRecord[] | undefined) {
	const droppedEdits: string[] = [];
	for (const record of records || []) {
		droppedEdits.push(...applyAnalysisEdits(battle, record.edits).droppedEdits);
		if (record.seed) battle.resetRNG(record.seed);
		applyInputLog(battle, record.inputLog);
	}
	return { droppedEdits };
}

function snapshotEffectState(state: AnyObject): AnalysisEffectSnapshot {
	const data: { [key: string]: number | string | boolean } = {};
	for (const [key, value] of Object.entries(state)) {
		if (['id', 'duration', 'effectOrder', 'target', 'source', 'sourceSlot', 'sourceEffect'].includes(key)) continue;
		if (typeof value === 'number' || typeof value === 'string' || typeof value === 'boolean') data[key] = value;
	}
	return {
		id: state.id,
		duration: state.duration,
		data: Object.keys(data).length ? data : undefined,
	};
}

function snapshotPokemon(pokemon: Pokemon, index: number): AnalysisPokemonSnapshot {
	const battle = pokemon.battle;
	return {
		index,
		ident: pokemon.fullname,
		name: pokemon.name,
		species: pokemon.species.name,
		baseSpecies: pokemon.baseSpecies.name,
		set: pokemon.set,
		item: pokemon.item,
		ability: pokemon.ability,
		level: pokemon.level,
		hp: pokemon.hp,
		maxhp: pokemon.maxhp,
		fainted: pokemon.fainted,
		status: pokemon.status,
		toxicStage: pokemon.status === 'tox' ? pokemon.statusState.stage : undefined,
		sleepTurns: pokemon.status === 'slp' ? pokemon.statusState.time : undefined,
		moves: pokemon.moveSlots.map(slot => ({
			id: slot.id, name: slot.move, pp: slot.pp, maxpp: slot.maxpp, disabled: !!slot.disabled,
		})),
		isActive: pokemon.isActive,
		slot: pokemon.isActive ? pokemon.position : null,
		boosts: { ...pokemon.boosts },
		volatiles: Object.values(pokemon.volatiles).map(snapshotEffectState),
		types: pokemon.getTypes(),
		teraType: pokemon.teraType,
		terastallized: pokemon.terastallized || null,
		canTerastallize: !!pokemon.canTerastallize,
		megaEvolved: !!pokemon.species.isMega,
		canMegaEvo: !!battle.actions.canMegaEvo(pokemon),
		stats: { ...pokemon.storedStats },
	};
}

export function getAnalysisSnapshot(battle: Battle): AnalysisSnapshot {
	const { field } = battle;
	return {
		turn: battle.turn,
		gen: battle.gen,
		gameType: battle.gameType,
		formatId: battle.format.id,
		rules: {
			terastallization: battle.gen === 9 && !battle.ruleTable.has('terastalclause'),
			dynamax: battle.gen === 8 && !battle.ruleTable.has('dynamaxclause'),
		},
		field: {
			weather: field.weather ? snapshotEffectState(field.weatherState) : null,
			terrain: field.terrain ? snapshotEffectState(field.terrainState) : null,
			pseudoWeather: Object.values(field.pseudoWeather).map(snapshotEffectState),
		},
		sides: battle.sides.map(side => ({
			id: side.id,
			name: side.name,
			sideConditions: Object.values(side.sideConditions).map(snapshotEffectState),
			active: side.active.map(pokemon => pokemon ? side.pokemon.indexOf(pokemon) : null),
			pokemon: side.pokemon.map(snapshotPokemon),
		})),
	};
}
