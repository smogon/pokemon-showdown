/**
 * Shared battle reconstruction and state snapshots for the analysis API.
 *
 * A position is rebuilt from the root seed plus an ordered list of replay
 * records (one per node on the path). See docs/analysis/overview.md
 * ("Determinism model") and docs/analysis/plan.md (D2, D3).
 */
import { Battle } from '../sim/battle';
import { Dex, toID } from '../sim/dex';
import type { PRNGSeed } from '../sim/prng';
import type { Pokemon } from '../sim/pokemon';
import { applyAnalysisEdits, type AnalysisAppliedEdits } from './analysis-edits';

/**
 * Manual state edits stored on a node. Values are absolute ("set to"); missing
 * fields are left unchanged. Applied in layers: teams -> active -> pokemon -> field
 * (tools/analysis-team-edits.ts, tools/analysis-pokemon-edits.ts, tools/analysis-edits.ts).
 */
/**
 * A side's whole roster at this node, in `side.pokemon` order. `from[i]` is the team slot entry `i` came
 * from, so a set keeps its identity (and its slot) through a reorder; `null` means the entry is new.
 */
export interface AnalysisTeamEdit {
	sets: PokemonSet[];
	from: (number | null)[];
}

export interface AnalysisEdits {
	teams?: { [side in AnalysisSideEditsID]?: AnalysisTeamEdit };
	/** team slot per active position; `null` leaves that position alone */
	active?: { [side in AnalysisSideEditsID]?: (number | null)[] };
	/** keyed `p1:<teamSlot>`, the Pokémon's slot in the original team (see AnalysisPokemonSnapshot) */
	pokemon?: { [sideAndTeamSlot: string]: AnalysisPokemonStateEdit };
	/** per-side state that isn't a side condition; side conditions live under `field.sides` */
	sides?: { [side in AnalysisSideEditsID]?: AnalysisSideStateEdit };
	field?: AnalysisFieldStateEdit;
}

export type AnalysisSideEditsID = 'p1' | 'p2';

/** One protocol line, as passed to `battle.add` (strings, or Pokémon and other sim objects). */
export type AnalysisEditLine = Parameters<Battle['add']>;

/**
 * Marks a line the **sim** already serialized, to be re-added verbatim instead of through `battle.add`.
 *
 * Edit lines are collected and added only once every layer has run, but a sim call made by an edit (adding
 * a volatile, say) writes its own line into `battle.log` immediately — so the two channels came out in the
 * wrong order relative to each other. `AnalysisPokemonEditor.logging` moves the sim's lines into the edit
 * channel and tags them with this, so there is one ordered stream. See its comment for what that fixed.
 */
export const ANALYSIS_RAW_LINE = '\0analysisraw';

/**
 * Summary lines for the Lines tooltip and the log, e.g. `Rain (3 Turns)`, `Rotom-Wash: HP (75%)`:
 * field-wide effects, then each team's.
 */
export interface AnalysisEditSummary {
	field: string[];
	p1: string[];
	p2: string[];
}

export interface AnalysisPokemonStateEdit {
	hp?: number;
	/**
	 * HP as a percentage of max HP, resolved against the Pokémon's live max HP when the edit applies.
	 * A replay only ever shows percentages, and the real max HP depends on EVs and IVs it never reveals,
	 * so an imported position stores this instead of `hp` and stays correct however the user later edits
	 * the team. The team layer runs first, so max HP has already settled by the time this resolves.
	 * `hp` wins if both are given.
	 */
	hpPercent?: number;
	/**
	 * Current item and ability, as opposed to the set's. A Pokémon that ate its berry still holds it on
	 * its team, and Trace, Skill Swap or a Mega Evolution changes the ability without changing the set.
	 * `''` removes. Editing the *set's* item or ability is the team layer's job.
	 */
	item?: string;
	ability?: string;
	/**
	 * PP by move id, not by slot: a slot's move can change, and an edit naming a move that is no longer
	 * there is simply irrelevant rather than something to invalidate.
	 */
	pp?: { [moveid: string]: number };
	/**
	 * PP **spent**, resolved against the move's real max PP when the edit applies — the same trick as
	 * `hpPercent`, and for the same reason. A replay says how many times a move was used, never how many
	 * uses it started with, and only the sim knows that: a mod is free to replace the formula outright, as
	 * Champions does (`(pp / 5 + 1) * 4` rather than `pp * 8 / 5`), so a client that subtracts for itself
	 * gets every value wrong and the clamp below quietly rounds it back up to full.
	 *
	 * `pp` wins where both name the same move, being the more specific statement.
	 */
	ppUsed?: { [moveid: string]: number };
	status?: '' | 'brn' | 'par' | 'slp' | 'frz' | 'psn' | 'tox';
	toxicStage?: number;
	sleepTurns?: number;
	/** current types, which moves like Soak and Reflect Type change mid-battle */
	types?: string[];
	/** setting these is one-way: the protocol can't undo a Terastallization or Mega Evolution */
	terastallized?: boolean;
	megaEvolved?: boolean;
	boosts?: Partial<BoostsTable>;
	volatiles?: { [id: string]: null | { [param: string]: number | string | boolean } };
	/**
	 * History the protocol can't express and a rebuilt battle has no way to know. A reconstructed position
	 * is a fresh battle at turn 1, so without these every Pokémon looks like it just switched in: Fake Out
	 * succeeds from one that has been out all game, Stakeout doubles against everything, and partial
	 * trapping removes itself. See docs/analysis/replay-import-audit.md.
	 */
	activeTurns?: number;
	activeMoveActions?: number;
	/** Hits taken, for Rage Fist. Unlike the others this survives switching out. */
	timesAttacked?: number;
	/** Move id, for Encore, Disable, Torment, Instruct and the Gigaton Hammer / Blood Moon lockout. */
	lastMove?: string;
	/**
	 * Consecutive successful Protect-likes, **not** the sim's counter: the sim stores 3, 9, 27… and the
	 * conversion is done here so there is one authority on it. 0 removes the volatile.
	 */
	stallCount?: number;
}

/** Per-side state that isn't a side condition. */
export interface AnalysisSideStateEdit {
	/** Pokémon fainted on this side, for Last Respects and Supreme Overlord. */
	totalFainted?: number;
}

/** Turns remaining (including the current turn) and layers; each defaults to the condition's standard value. */
export interface AnalysisConditionEdit {
	duration?: number;
	layers?: number;
}

export interface AnalysisWeatherEdit extends AnalysisConditionEdit {
	id: string;
}

/** `null` removes the effect; a missing key leaves it as is. Applied by tools/analysis-edits.ts. */
export interface AnalysisFieldStateEdit {
	weather?: AnalysisWeatherEdit | null;
	terrain?: AnalysisWeatherEdit | null;
	pseudoWeather?: { [id: string]: AnalysisConditionEdit | null };
	sides?: { [side in AnalysisSideEditsID]?: { [id: string]: AnalysisConditionEdit | null } };
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
	/** the position of the Pokémon this effect hangs off (`p2a`), for Leech Seed and partial trapping */
	sourceSlot?: string;
}

export interface AnalysisPokemonSnapshot {
	/** current position in `side.pokemon` (request order); changes when Pokémon switch */
	index: number;
	/** position in the original team, which never changes: edits use it to name a Pokémon */
	teamSlot: number;
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
	/** hits taken, which Rage Fist reads; restored by a replay import and editable in the panel */
	timesAttacked: number;
	megaEvolved: boolean;
	canMegaEvo: boolean;
	stats: StatsExceptHPTable;
}

export interface AnalysisSideSnapshot {
	id: SideID;
	name: string;
	/** Pokémon fainted on this side, which Last Respects and Supreme Overlord read */
	totalFainted: number;
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
	/*
	 * The sim does **not** reject a format it doesn't have: `new Battle` falls back to a singles gen 9
	 * game, so an unknown format fails silently and catastrophically — a doubles replay would import with
	 * half the field missing and no error anywhere. This fork is routinely behind upstream on new formats
	 * (it has Champions VGC Reg M-A and M-B but not M-C), so that is a live case, not a hypothetical.
	 * Refusing here rather than substituting a near relative is the user's decision (audit, QA).
	 */
	const formatId = toID(options.format);
	if (!Dex.formats.get(formatId).exists) {
		throw new Error(`Unknown format: ${options.format}. This server doesn't have that format installed.`);
	}
	return new Battle({
		formatid: formatId,
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
 * Replays records in order: edits first (they must not consume RNG), then reseed and apply that
 * node's choices. `appliedEdits` has one entry per record: what its edits actually changed.
 */
export function replayAnalysisRecords(battle: Battle, records: AnalysisReplayRecord[] | undefined) {
	const droppedEdits: string[] = [];
	const appliedEdits: (AnalysisAppliedEdits | null)[] = [];
	for (const record of records || []) {
		const result = applyAnalysisEdits(battle, record.edits);
		droppedEdits.push(...result.droppedEdits);
		appliedEdits.push(result.applied);
		if (record.seed) battle.resetRNG(record.seed);
		applyInputLog(battle, record.inputLog);
	}
	return { droppedEdits, appliedEdits };
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
		sourceSlot: typeof state.sourceSlot === 'string' ? state.sourceSlot : undefined,
	};
}

function snapshotPokemon(pokemon: Pokemon, index: number): AnalysisPokemonSnapshot {
	const battle = pokemon.battle;
	return {
		index,
		teamSlot: pokemon.side.team.indexOf(pokemon.set),
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
		timesAttacked: pokemon.timesAttacked,
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
			totalFainted: side.totalFainted,
			sideConditions: Object.values(side.sideConditions).map(snapshotEffectState),
			active: side.active.map(pokemon => pokemon ? side.pokemon.indexOf(pokemon) : null),
			pokemon: side.pokemon.map(snapshotPokemon),
		})),
	};
}
