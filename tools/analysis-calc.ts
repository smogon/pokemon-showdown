/**
 * Damage calculations for the analysis tool, using the vendored @smogon/calc
 * (tools/analysis-vendor/smogon-calc) over this battle's own dex, so mod data
 * (DigiPen, FNAF, Champions) is used. See docs/analysis/plan.md, Phase 1.
 *
 * The calc applies abilities/items/move effects by *name*: custom species stats, types,
 * and move numbers are exact, but custom effects (and vanilla effects a mod changed) are not.
 */
import type { Battle } from '../sim/battle';
import type { ModdedDex } from '../sim/dex';
import type { Pokemon } from '../sim/pokemon';
import type { Side } from '../sim/side';
import {
	calculate, Field as CalcField, Move as CalcMove, Pokemon as CalcPokemon, Side as CalcSide,
} from './analysis-vendor/smogon-calc/adaptable';
import type * as I from './analysis-vendor/smogon-calc/data/interface';
import type { State } from './analysis-vendor/smogon-calc/state';

/** Placeholders the client replaces with `<icon> (side number)`. */
export const ATTACKER_TOKEN = '[[ATTACKER]]';
export const DEFENDER_TOKEN = '[[DEFENDER]]';

export interface AnalysisCalcPokemonRef {
	side: SideID;
	/** index in side.pokemon (request order) */
	index: number;
	/** active slot */
	slot: number;
}

export interface AnalysisCalcTargetResult {
	target: AnalysisCalcPokemonRef;
	relation: 'foe' | 'ally';
	/** show when hovering the move button: foes for single-target moves, everything hit for spread moves */
	onMoveHover: boolean;
	/** hit by the attacker's current draft choice (if it chose this move) */
	selected: boolean;
	damage?: [number, number];
	percent?: [number, number];
	/** calc main result sentence without EVs, with ATTACKER_TOKEN/DEFENDER_TOKEN for the names */
	text?: string;
	error?: string;
}

/**
 * The attacker's own transformation this turn: '' (as it is now), or terastallizing / mega evolving.
 * Results are computed for every mode the attacker can still use, so the client can match the
 * move menu's Mega/Tera checkboxes (or the chosen move's modifier) without refetching.
 */
export type AnalysisCalcMode = '' | 'tera' | 'mega' | 'megax' | 'megay';

export interface AnalysisCalcMoveResult {
	attacker: AnalysisCalcPokemonRef;
	mode: AnalysisCalcMode;
	/** 0-based move slot, matching request move order */
	moveSlot: number;
	moveId: string;
	moveName: string;
	targets: AnalysisCalcTargetResult[];
}

/*********************************************************
 * Generation adapter over the sim dex
 *********************************************************/

const DAMAGE_TAKEN_TO_EFFECTIVENESS: { [code: number]: I.TypeEffectiveness } = { 0: 1, 1: 2, 2: 0.5, 3: 0 };

interface DexTable {
	get(name: string): AnyObject;
	all(): readonly AnyObject[];
}

function wrapTable<T>(table: DexTable, kind: I.DataKind) {
	const wrap = (entry: AnyObject) => Object.assign(Object.create(entry), { kind }) as T;
	return {
		get(id: I.ID) {
			const entry = table.get(id);
			return entry?.exists ? wrap(entry) : undefined;
		},
		* [Symbol.iterator]() {
			for (const entry of table.all()) {
				if (entry.exists) yield wrap(entry);
			}
		},
	};
}

function wrapTypes(dex: ModdedDex): I.Types {
	const get = (id: I.ID): I.Type | undefined => {
		const attacking = dex.types.get(id);
		if (!attacking.exists) return undefined;
		const effectiveness: { [type in I.TypeName]?: I.TypeEffectiveness } = { '???': 1, 'Stellar': 1 };
		for (const defending of dex.types.all()) {
			const code = defending.damageTaken[attacking.name];
			effectiveness[defending.name as I.TypeName] = DAMAGE_TAKEN_TO_EFFECTIVENESS[code] ?? 1;
		}
		return { id: attacking.id as I.ID, name: attacking.name as I.TypeName, kind: 'Type', effectiveness };
	};
	return {
		get,
		* [Symbol.iterator]() {
			for (const type of dex.types.all()) {
				const wrapped = get(type.id as I.ID);
				if (wrapped) yield wrapped;
			}
		},
	};
}

const generations = new Map<string, I.Generation>();

/** Champions formats use the calc's Champions mechanics (generation 0: level 50, stat points). */
export function getCalcGeneration(battle: Battle): I.Generation {
	const dex = battle.dex;
	const num = (dex.currentMod.startsWith('champions') ? 0 : battle.gen) as I.GenerationNum;
	const key = `${dex.currentMod}:${num}`;
	let generation = generations.get(key);
	if (!generation) {
		generation = {
			num,
			abilities: wrapTable<I.Ability>(dex.abilities as DexTable, 'Ability'),
			items: wrapTable<I.Item>(dex.items as DexTable, 'Item'),
			moves: wrapTable<I.Move>(dex.moves as DexTable, 'Move'),
			species: wrapTable<I.Specie>(dex.species as DexTable, 'Species'),
			types: wrapTypes(dex),
			natures: wrapTable<I.Nature>(dex.natures as DexTable, 'Nature'),
		};
		generations.set(key, generation);
	}
	return generation;
}

/*********************************************************
 * Draft choices
 *********************************************************/

interface SlotChoice {
	kind: 'move' | 'switch' | 'pass';
	moveSlot?: number;
	targetLoc?: number;
	mode: AnalysisCalcMode;
}

const PROTECT_MOVES = new Set([
	'protect', 'detect', 'kingsshield', 'spikyshield', 'banefulbunker', 'silktrap', 'burningbulwark', 'obstruct',
	'maxguard',
]);

/** Parses draft input lines (`>p1 move 1 +2, switch 3`) into per-side, per-slot choices. */
export function parseDraftChoices(inputLog: string[] | undefined) {
	const choices: { [side: string]: SlotChoice[] } = {};
	for (const line of inputLog || []) {
		const match = /^>(p[1-4])\s+(.+)$/.exec(line);
		if (!match) continue;
		choices[match[1]] = match[2].split(',').map(part => {
			const tokens = part.trim().split(/\s+/);
			if (tokens[0] === 'switch') return { kind: 'switch', mode: '' };
			if (tokens[0] !== 'move') return { kind: 'pass', mode: '' };
			const choice: SlotChoice = { kind: 'move', moveSlot: Number(tokens[1]) - 1, mode: '' };
			for (const token of tokens.slice(2)) {
				if (/^[+-]?\d+$/.test(token)) choice.targetLoc = Number(token);
				if (token === 'terastallize') choice.mode = 'tera';
				if (token === 'mega' || token === 'megax' || token === 'megay') choice.mode = token;
			}
			return choice;
		});
	}
	return choices;
}

/*********************************************************
 * Building calc objects from the sim
 *********************************************************/

const WEATHER: { [id: string]: I.Weather } = {
	sunnyday: 'Sun', desolateland: 'Harsh Sunshine', raindance: 'Rain', primordialsea: 'Heavy Rain',
	sandstorm: 'Sand', hail: 'Hail', snowscape: 'Snow', snow: 'Snow', deltastream: 'Strong Winds',
};
const TERRAIN: { [id: string]: I.Terrain } = {
	electricterrain: 'Electric', grassyterrain: 'Grassy', psychicterrain: 'Psychic', mistyterrain: 'Misty',
};

/** Abilities that set weather/terrain when they start, e.g. on Mega Evolving before moves this turn. */
const WEATHER_ABILITIES: { [id: string]: I.Weather } = {
	drought: 'Sun', drizzle: 'Rain', sandstream: 'Sand', snowwarning: 'Snow',
	desolateland: 'Harsh Sunshine', primordialsea: 'Heavy Rain', deltastream: 'Strong Winds',
};
const TERRAIN_ABILITIES: { [id: string]: I.Terrain } = {
	electricsurge: 'Electric', grassysurge: 'Grassy', psychicsurge: 'Psychic', mistysurge: 'Misty',
};

function activePokemon(battle: Battle) {
	return battle.sides.flatMap(side => side.active).filter(pokemon => pokemon && !pokemon.fainted && pokemon.hp);
}

function choiceFor(choices: ReturnType<typeof parseDraftChoices>, pokemon: Pokemon) {
	return choices[pokemon.side.id]?.[pokemon.position];
}

/** Transformations `pokemon` can still use this turn (the same flags that drive the request's checkboxes). */
function availableModes(pokemon: Pokemon): AnalysisCalcMode[] {
	const modes: AnalysisCalcMode[] = [''];
	if (pokemon.canTerastallize && !pokemon.terastallized) modes.push('tera');
	if (pokemon.canMegaEvo) modes.push('mega');
	if (pokemon.canMegaEvoX) modes.push('megax');
	if (pokemon.canMegaEvoY) modes.push('megay');
	return modes;
}

function megaSpeciesFor(pokemon: Pokemon, mode: AnalysisCalcMode) {
	const forme = mode === 'mega' ? pokemon.canMegaEvo : mode === 'megax' ? pokemon.canMegaEvoX :
		mode === 'megay' ? pokemon.canMegaEvoY : null;
	return typeof forme === 'string' ? forme : null;
}

function toCalcPokemon(generation: I.Generation, pokemon: Pokemon, mode: AnalysisCalcMode) {
	const battle = pokemon.battle;
	const megaSpecies = megaSpeciesFor(pokemon, mode);
	const species = megaSpecies ? battle.dex.species.get(megaSpecies) : pokemon.species;
	const terastallized = pokemon.terastallized || (mode === 'tera' ? pokemon.teraType : undefined);
	const types = megaSpecies ? species.types : pokemon.getTypes(false, true);
	const overrides: { types?: [I.TypeName] | [I.TypeName, I.TypeName] } = {};
	if (types.join('/') !== species.types.join('/')) {
		overrides.types = types as [I.TypeName] | [I.TypeName, I.TypeName];
	}
	const ability = megaSpecies ? species.abilities[0] : pokemon.getAbility().name;
	const boostedStat = (pokemon.volatiles['protosynthesis'] || pokemon.volatiles['quarkdrive'])?.bestStat;
	const options: Partial<State.Pokemon> & { curHP: number } = {
		level: pokemon.level,
		gender: (pokemon.gender || 'N') as I.GenderName,
		ability: ability as I.AbilityName,
		abilityOn: !!(pokemon.volatiles['flashfire'] || pokemon.volatiles['slowstart'] || boostedStat),
		boostedStat,
		item: (pokemon.getItem().name || undefined) as I.ItemName | undefined,
		nature: (pokemon.set.nature || 'Serious') as I.NatureName,
		evs: pokemon.set.evs,
		ivs: pokemon.set.ivs,
		boosts: {
			atk: pokemon.boosts.atk, def: pokemon.boosts.def, spa: pokemon.boosts.spa,
			spd: pokemon.boosts.spd, spe: pokemon.boosts.spe,
		},
		curHP: pokemon.hp,
		status: pokemon.status as I.StatusName | '',
		toxicCounter: pokemon.status === 'tox' ? pokemon.statusState.stage || 0 : 0,
		teraType: terastallized as I.TypeName | undefined,
		isDynamaxed: !!pokemon.volatiles['dynamax'],
		alliesFainted: pokemon.side.totalFainted,
		overrides: Object.keys(overrides).length ? overrides as I.Specie : undefined,
	};
	return new CalcPokemon(generation, species.name, options);
}

/** Side flags from the point of view of `pokemon` ("this Pokémon" in the calc's field panel). */
function toCalcSide(pokemon: Pokemon, opponent: Pokemon, choices: ReturnType<typeof parseDraftChoices>) {
	const side: Side = pokemon.side;
	const allies = pokemon.allies().filter(ally => !ally.fainted && ally.hp);
	const allyHasAbility = (id: string) => allies.some(ally => ally.getAbility().id === id);
	const choice = choiceFor(choices, pokemon);
	const leechSeed = pokemon.volatiles['leechseed'];
	return new CalcSide({
		// hazards are ignored: the calc treats them as if the defender were switching in
		spikes: 0,
		isSR: false,
		isReflect: !!side.sideConditions['reflect'],
		isLightScreen: !!side.sideConditions['lightscreen'],
		isAuroraVeil: !!side.sideConditions['auroraveil'],
		isTailwind: !!side.sideConditions['tailwind'],
		// the calc models attacker-side Leech Seed as healing the defender, so only set it when the defender seeded it
		isSeeded: !!leechSeed && (pokemon === opponent ? true : !leechSeed.sourceSlot ||
			leechSeed.sourceSlot === opponent.getSlot()),
		isNightmared: !!pokemon.volatiles['nightmare'],
		isSaltCured: !!pokemon.volatiles['saltcure'],
		isForesight: !!pokemon.volatiles['foresight'],
		isCharge: !!pokemon.volatiles['charge'],
		isPowerTrick: !!pokemon.volatiles['powertrick'],
		isFlowerGift: allyHasAbility('flowergift'),
		isSteelySpirit: allyHasAbility('steelyspirit'),
		isFriendGuard: allyHasAbility('friendguard'),
		isBattery: allyHasAbility('battery'),
		isPowerSpot: allyHasAbility('powerspot'),
		// from the draft choices rather than battle state
		isProtected: choice?.kind === 'move' && PROTECT_MOVES.has(pokemon.moveSlots[choice.moveSlot!]?.id),
		isSwitching: choice?.kind === 'switch' ? 'out' : undefined,
		isHelpingHand: allies.some(ally => {
			const allyChoice = choiceFor(choices, ally);
			return allyChoice?.kind === 'move' && ally.moveSlots[allyChoice.moveSlot!]?.id === 'helpinghand';
		}),
	});
}

function toCalcField(
	battle: Battle, attacker: Pokemon, defender: Pokemon, choices: ReturnType<typeof parseDraftChoices>,
	attackerMode: AnalysisCalcMode, defenderMode: AnalysisCalcMode
) {
	const abilities = new Set<string>(activePokemon(battle).map(pokemon => pokemon.getAbility().id));
	const { field } = battle;
	let weather = WEATHER[field.weather];
	let terrain = TERRAIN[field.terrain];
	// a Mega's ability starts when it Mega Evolves, before moves (defender first, then attacker if both do)
	for (const [pokemon, mode] of [[defender, defenderMode], [attacker, attackerMode]] as const) {
		const megaSpecies = megaSpeciesFor(pokemon, mode);
		if (!megaSpecies) continue;
		const megaAbility = battle.dex.toID(battle.dex.species.get(megaSpecies).abilities[0]);
		abilities.add(megaAbility);
		weather = WEATHER_ABILITIES[megaAbility] || weather;
		terrain = TERRAIN_ABILITIES[megaAbility] || terrain;
	}
	return new CalcField({
		gameType: battle.gameType === 'singles' ? 'Singles' : 'Doubles',
		weather,
		terrain,
		isMagicRoom: !!field.pseudoWeather['magicroom'],
		isWonderRoom: !!field.pseudoWeather['wonderroom'],
		isGravity: !!field.pseudoWeather['gravity'],
		isAuraBreak: abilities.has('aurabreak'),
		isFairyAura: abilities.has('fairyaura'),
		isDarkAura: abilities.has('darkaura'),
		isBeadsOfRuin: abilities.has('beadsofruin'),
		isSwordOfRuin: abilities.has('swordofruin'),
		isTabletsOfRuin: abilities.has('tabletsofruin'),
		isVesselOfRuin: abilities.has('vesselofruin'),
		attackerSide: toCalcSide(attacker, defender, choices),
		defenderSide: toCalcSide(defender, defender, choices),
	});
}

/*********************************************************
 * Targets
 *********************************************************/

const SPREAD_TARGETS = new Set(['allAdjacent', 'allAdjacentFoes']);
const SINGLE_TARGETS = new Set(['normal', 'any', 'adjacentFoe', 'randomNormal', 'adjacentAlly', 'adjacentAllyOrSelf']);

interface TargetCandidate { pokemon: Pokemon; relation: 'foe' | 'ally' }

function getTargetCandidates(attacker: Pokemon, target: string): TargetCandidate[] {
	const foes = attacker.foes().filter(foe => target === 'any' || attacker.isAdjacent(foe));
	const ally = target === 'allAdjacentFoes' || target === 'adjacentFoe' || target === 'randomNormal' ? [] :
		attacker.allies().filter(candidate => attacker.isAdjacent(candidate) || target === 'any');
	return [
		...foes.map(pokemon => ({ pokemon, relation: 'foe' as const })),
		...ally.map(pokemon => ({ pokemon, relation: 'ally' as const })),
	];
}

function isSelectedTarget(
	attacker: Pokemon, candidate: TargetCandidate, choice: SlotChoice | undefined, moveSlot: number, spread: boolean
) {
	if (choice?.kind !== 'move' || choice.moveSlot !== moveSlot) return false;
	if (spread || attacker.battle.gameType === 'singles') return true;
	if (choice.targetLoc === undefined) return candidate.relation === 'foe';
	return attacker.getAtLoc(choice.targetLoc) === candidate.pokemon;
}

/*********************************************************
 * Entry point
 *********************************************************/

function describe(result: ReturnType<typeof calculate>) {
	const rawDesc = result.rawDesc;
	rawDesc.attackerName = ATTACKER_TOKEN as I.SpeciesName;
	rawDesc.defenderName = DEFENDER_TOKEN as I.SpeciesName;
	delete rawDesc.attackEVs;
	delete rawDesc.defenseEVs;
	delete rawDesc.HPEVs;
	// same text as calc.pokemonshowdown.com's main result (index_randoms_controls.js)
	let description;
	if (result.range()[1] === 0) {
		// the KO-chance step console.logs for zero damage; the calc skips it for status moves, so borrow that path
		const category = result.move.category;
		result.move.category = 'Status';
		description = result.fullDesc('%', false);
		result.move.category = category;
	} else {
		description = result.fullDesc('%', false);
	}
	if (!description.includes('--')) description += ' -- possibly the worst move ever';
	return description;
}

function calcMove(
	battle: Battle, generation: I.Generation, choices: ReturnType<typeof parseDraftChoices>,
	attacker: Pokemon, attackerChoice: SlotChoice | undefined, mode: AnalysisCalcMode, moveSlot: number, moveId: string
): AnalysisCalcMoveResult | null {
	const move = battle.dex.moves.get(moveId);
	if (!move.exists || move.category === 'Status') return null;
	const spread = SPREAD_TARGETS.has(move.target);
	if (!spread && !SINGLE_TARGETS.has(move.target)) return null;
	const presentTargets = getTargetCandidates(attacker, move.target)
		.filter(candidate => !candidate.pokemon.fainted && candidate.pokemon.hp);
	if (!presentTargets.length) return null;
	const ref = (pokemon: Pokemon): AnalysisCalcPokemonRef => ({
		side: pokemon.side.id, index: pokemon.side.pokemon.indexOf(pokemon), slot: pokemon.position,
	});
	const targets = presentTargets.map(candidate => {
		const defender = candidate.pokemon;
		const entry: AnalysisCalcTargetResult = {
			target: ref(defender),
			relation: candidate.relation,
			onMoveHover: spread || candidate.relation === 'foe',
			selected: isSelectedTarget(attacker, candidate, attackerChoice, moveSlot, spread),
		};
		try {
			const calcAttacker = toCalcPokemon(generation, attacker, mode);
			const defenderMode = choiceFor(choices, defender)?.mode || '';
			const calcDefender = toCalcPokemon(generation, defender, defenderMode);
			const calcMoveData = new CalcMove(generation, move.name, {
				ability: calcAttacker.ability,
				item: calcAttacker.item,
				useMax: !!attacker.volatiles['dynamax'],
				// the spread modifier only applies when more than one target is actually present
				overrides: spread && presentTargets.length < 2 ? { target: 'normal' } : undefined,
			});
			const result = calculate(
				generation, calcAttacker, calcDefender, calcMoveData,
				toCalcField(battle, attacker, defender, choices, mode, defenderMode)
			);
			const [min, max] = result.range();
			const maxHP = calcDefender.maxHP();
			entry.damage = [min, max];
			entry.percent = [Math.floor(min * 1000 / maxHP) / 10, Math.floor(max * 1000 / maxHP) / 10];
			entry.text = describe(result);
		} catch (error: any) {
			entry.error = error?.message || String(error);
		}
		return entry;
	});
	return { attacker: ref(attacker), mode, moveSlot, moveId: move.id, moveName: move.name, targets };
}

/**
 * Calcs for every active attacker's damaging moves against their potential targets, at the
 * battle's current decision point, once per transformation mode each attacker can still use.
 * `draftInputLog` supplies choice-dependent flags (Protect, switching out, Helping Hand, defenders
 * terastallizing/mega evolving this turn) and the selected targets.
 */
export function getAnalysisCalcs(battle: Battle, draftInputLog?: string[]): AnalysisCalcMoveResult[] {
	if (battle.requestState !== 'move') return [];
	const generation = getCalcGeneration(battle);
	const choices = parseDraftChoices(draftInputLog);
	const results: AnalysisCalcMoveResult[] = [];
	for (const attacker of activePokemon(battle)) {
		const attackerChoice = choiceFor(choices, attacker);
		for (const mode of availableModes(attacker)) {
			for (const [moveSlot, slot] of attacker.moveSlots.entries()) {
				const result = calcMove(battle, generation, choices, attacker, attackerChoice, mode, moveSlot, slot.id);
				if (result) results.push(result);
			}
		}
	}
	return results;
}
