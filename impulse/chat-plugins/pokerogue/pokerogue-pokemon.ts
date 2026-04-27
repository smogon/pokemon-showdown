/*
 * =======================================================================
 *
 *    ___ __  __ ___ _   _ _    ___ ___
 *   |_ _|  \/  | _ \ | | | |  / __| __|
 *    | || |\/| |  _/ |_| | |__\__ \ __|
 *   |___|_|  |_|_|  \___/|____|___/___|
 *
 *   Server: Impulse
 *   Plugin: PokéRogue Pokemon
 *   Made by: @TurboRx
 *
 * =======================================================================
 */

import { FS } from '../../../lib';
import { LEGENDARY_TAGS, type PokemonEntry, type PokeRogueState } from './pokerogue-types';

// ---------------------------------------------------------------------------
// exp.json types & loader
// ---------------------------------------------------------------------------

interface ExpEntry {
	expYield: number;
	expType: string;
	evYield: {
		hp: number;
		atk: number;
		def: number;
		spa: number;
		spd: number;
		spe: number;
	};
}

type ExpData = Record<string, ExpEntry>;

let expData: ExpData = {};

export async function loadExpData(): Promise<void> {
	try {
		const raw = await FS('impulse/chat-plugins/pokerogue/exp.json').readIfExists();
		if (raw) expData = JSON.parse(raw) as ExpData;
	} catch {
		expData = {};
	}
}

void loadExpData();

/**
 * Returns the base expYield for a species from exp.json, falling back to a
 * BST-derived estimate when the species is not in exp.json.
 */
export function getExpYield(speciesId: string): number {
	const id = toID(speciesId);
	if (expData[id]) return expData[id].expYield;

	const sp = Dex.species.get(id);
	if (!sp.exists) return 70;
	const bs = sp.baseStats ?? { hp: 45, atk: 45, def: 45, spa: 45, spd: 45, spe: 45 };
	const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
	return Math.round(bst / 3.5);
}

/**
 * Returns the expType for a species from exp.json.
 * Falls back to 'Slow' for high-BST species, 'Medium Fast' otherwise.
 */
export function getExpType(speciesId: string): string {
	const id = toID(speciesId);
	if (expData[id]) return expData[id].expType;

	const sp = Dex.species.get(id);
	if (sp.exists) {
		const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
		if (bst >= 580) return 'Slow';
	}
	return 'Medium Fast';
}

// ---------------------------------------------------------------------------
// EXP formula — exact Game Freak curves (matches poketest.ts getMinExpForMonAtLevel)
// ---------------------------------------------------------------------------

/**
 * Returns the TOTAL EXP required to reach `level` from level 1.
 * Uses the exact official formulas for each growth rate curve.
 * This replaces the previous simplified linear approximation.
 *
 * Curves matched to poketest.ts:
 *   Erratic, Fast, Medium Fast, Medium Slow, Slow, Fluctuating
 */
export function expForLevel(level: number, expType = 'Medium Fast'): number {
	if (level <= 1) return 0;
	const n = level;

	switch (expType) {
	case 'Erratic':
		if (n < 50)  return Math.floor((n ** 3 * (100 - n)) / 50);
		if (n < 68)  return Math.floor((n ** 3 * (150 - n)) / 100);
		if (n < 90)  return Math.floor((n ** 3 * ((1911 - (10 * n)) / 3)) / 500);
		/* n >= 90 */ return Math.floor((n ** 3 * (160 - n)) / 100);

	case 'Fast':
		return Math.floor((4 * n ** 3) / 5);

	case 'Medium Fast':
		return Math.floor(n ** 3);

	case 'Medium Slow': {
		const val = Math.floor((6 / 5) * n ** 3 - 15 * n ** 2 + 100 * n - 140);
		return Math.max(0, val);
	}

	case 'Slow':
		return Math.floor((5 * n ** 3) / 4);

	case 'Fluctuating':
		if (n < 15)  return Math.floor((n ** 3 * (((n + 1) / 3) + 24)) / 50);
		if (n < 36)  return Math.floor((n ** 3 * (n + 14)) / 50);
		/* n >= 36 */ return Math.floor((n ** 3 * ((n / 2) + 32)) / 50);

	default:
		return Math.floor(n ** 3); // Medium Fast fallback
	}
}

/**
 * Calculate the EXP earned for defeating one AI Pokémon.
 *
 * Mirrors main-series Gen-5+ formula (no trade/Exp.Share bonus):
 *   exp = floor(baseYield * enemyLevel / 5)
 * Then applies boss-floor bonus and Lucky Charm multiplier.
 */
export function calcKillExp(
	enemySpeciesId: string,
	enemyLevel: number,
	luckyCharmActive: boolean,
	isBossFloor: boolean,
): number {
	const baseYield = getExpYield(enemySpeciesId);
	let exp = Math.floor((baseYield * enemyLevel) / 5);
	if (isBossFloor) exp = Math.floor(exp * 1.5);
	if (luckyCharmActive) exp *= 2;
	return Math.max(1, exp);
}

// ---------------------------------------------------------------------------
// EVO type fallback levels
// ---------------------------------------------------------------------------

const EVO_TYPE_FALLBACK_LEVEL: Partial<Record<string, number>> = {
	trade: 36,
	useItem: 36,
	levelFriendship: 20,
	levelMove: 30,
	levelExtra: 20,
	levelHold: 30,
};

// ---------------------------------------------------------------------------
// Legacy tier caches (kept for starter-picking & player new-pokemon offers)
// ---------------------------------------------------------------------------

let t1Cache: string[] | null = null;
let t2Cache: string[] | null = null;
let t3Cache: string[] | null = null;
let t4Cache: string[] | null = null;

function getBST(species: Species): number {
	const bs = species.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	return bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
}

export function getTier1Pokemon(): string[] {
	if (t1Cache?.length) return t1Cache;
	const all = Dex.species.all();
	t1Cache = all.filter(s => {
		if (!s.exists || s.num <= 0 || s.isNonstandard || s.baseSpecies !== s.name) return false;
		if (s.tags.some(tag => LEGENDARY_TAGS.has(tag))) return false;
		return (s.tier === 'LC' && getBST(s) < 480) || (s.evos && s.evos.length > 0 && getBST(s) < 350);
	}).map(s => toID(s.name));
	return t1Cache;
}

export function getTier2Pokemon(): string[] {
	if (t2Cache?.length) return t2Cache;
	const all = Dex.species.all();
	t2Cache = all.filter(s => {
		if (!s.exists || s.num <= 0 || s.isNonstandard || s.baseSpecies !== s.name) return false;
		if (s.tags.some(tag => LEGENDARY_TAGS.has(tag))) return false;
		if (s.evos && s.evos.length > 0) return false;
		const bst = getBST(s);
		return bst >= 350 && bst <= 490;
	}).map(s => toID(s.name));
	return t2Cache;
}

export function getTier3Pokemon(): string[] {
	if (t3Cache?.length) return t3Cache;
	const all = Dex.species.all();
	t3Cache = all.filter(s => {
		if (!s.exists || s.num <= 0 || s.isNonstandard || s.baseSpecies !== s.name) return false;
		if (s.tags.some(tag => LEGENDARY_TAGS.has(tag))) return false;
		if (s.evos && s.evos.length > 0) return false;
		const bst = getBST(s);
		return (bst >= 491 && bst <= 579) || ['OU', 'UU', 'RU'].includes(s.tier);
	}).map(s => toID(s.name));
	return t3Cache;
}

export function getTier4Pokemon(): string[] {
	if (t4Cache?.length) return t4Cache;
	const all = Dex.species.all();
	t4Cache = all.filter(s => {
		if (!s.exists || s.num <= 0 || s.isNonstandard || s.baseSpecies !== s.name) return false;
		return s.tags.some(tag => LEGENDARY_TAGS.has(tag)) || getBST(s) >= 580;
	}).map(s => toID(s.name));
	return t4Cache;
}

export function pickRandom(pool: string[], n: number, exclude: string[] = []): string[] {
	const filtered = pool.filter(id => !exclude.includes(id));
	const shuffled = filtered.slice();
	for (let i = shuffled.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
	}
	return shuffled.slice(0, n);
}

export function rollGachaPokemon(gachaType: 'master' | 'ultra' | 'great', exclude: string[] = []): { species: string, isFeatured: boolean } {
	const rand = Math.random();
	let pool: string[];
	let isFeatured = false;

	if (gachaType === 'master') {
		if (rand <= 0.30) { pool = getTier4Pokemon(); isFeatured = true; }
		else { pool = getTier3Pokemon(); }
	} else if (gachaType === 'ultra') {
		if (rand <= 0.75) { pool = getTier3Pokemon(); isFeatured = true; }
		else { pool = getTier2Pokemon(); }
	} else {
		if (rand <= 0.70) { pool = getTier2Pokemon(); isFeatured = true; }
		else { pool = getTier3Pokemon(); }
	}

	const picks = pickRandom(pool, 1, exclude);
	const species = picks.length ? picks[0] : (pickRandom(getTier1Pokemon(), 1)[0] ?? 'bulbasaur');
	return { species, isFeatured };
}

/**
 * Generates 3 starter options using the same BST-weighted pool and filters
 * as poketest.ts genPokemon() with starter=true.
 *
 * Filters applied (matching poketest.ts exactly):
 *   - No prevo (must be a base-form species)
 *   - No Mythical, Restricted Legendary, Sub-Legendary tags
 *   - No Paradox tag, and no specific paradox mons by base species name
 *   - No Ultra Beasts EXCEPT Poipole
 *   - No Ursaluna-Bloodmoon or Floette-Eternal edge cases
 *   - No Gmax, Totem, Dusk, Bond formes
 *   - No nonstandard mons (Past-tag allowed)
 *
 * Weighting: midpoint=250, range=50, weightcap=100 (floor-1/tier-0 defaults)
 * so weak unevolved mons cluster around BST 250 appear most often.
 */
export function pickStarterOptions(): string[] {
	const PARADOX_EDGE_CASES = new Set([
		'Gouging Fire', 'Raging Bolt', 'Iron Crown', 'Iron Boulder',
	]);
	const NAME_BLOCKLIST = new Set(['Ursaluna-Bloodmoon', 'Floette-Eternal']);

	const candidates = Dex.species.all().filter(s => {
		if (!s.exists || s.num <= 0) return false;
		if (s.battleOnly) return false;
		if (s.requiredItems?.length) return false;
		if (s.forme === 'Gmax' || s.forme.includes('Totem') ||
			s.forme === 'Dusk' || s.forme === 'Bond') return false;
		if (s.isNonstandard && s.isNonstandard !== 'Past') return false;

		// Must be a base form — no prevo
		if (s.prevo) return false;

		// No legendary/mythical categories
		if (s.tags.includes('Mythical') ||
			s.tags.includes('Restricted Legendary') ||
			s.tags.includes('Sub-Legendary')) return false;

		// No Paradox (by tag or known paradox base species)
		if (s.tags.includes('Paradox')) return false;
		if (PARADOX_EDGE_CASES.has(s.baseSpecies)) return false;

		// No Ultra Beasts except Poipole
		if (s.tags.includes('Ultra Beast') && s.name !== 'Poipole') return false;

		// Edge-case name blocklist
		if (NAME_BLOCKLIST.has(s.name)) return false;

		return true;
	});

	// Build BST-weighted pool at tier-0 defaults (midpoint=250, range=50, weightcap=100)
	const midpoint = 250;
	const range = 50;
	const weightcap = 100;

	const pool: Array<{ id: string, weight: number }> = [];
	for (const s of candidates) {
		const effectiveBST = toID(s.name) === 'shedinja' ? 500 : (s.bst ?? getBST(s));
		const w = bstWeight(effectiveBST, midpoint, range, weightcap);
		if (w > 0) pool.push({ id: toID(s.name), weight: w });
	}

	// Pick 3 unique starters via weighted selection
	const picks: string[] = [];
	const remaining = pool.slice();

	while (picks.length < 3 && remaining.length > 0) {
		const weights = remaining.map(p => p.weight);
		const idx = weightedPickIndex(weights);
		if (idx === -1) break;
		picks.push(remaining[idx].id);
		remaining.splice(idx, 1);
	}

	// Fallback to uniform random from Tier 1 if weighted pool came up short
	if (picks.length < 3) {
		const extras = pickRandom(getTier1Pokemon(), 3 - picks.length, picks);
		picks.push(...extras);
	}

	return picks;
}

export function pickNewPokemonOptions(currentTeam: PokemonEntry[], floor: number): string[] {
	const existing = currentTeam.map(m => m.species);
	let poolA: string[];
	let poolB: string[];
	let chanceA: number;

	if (floor < 20) {
		poolA = getTier1Pokemon(); poolB = getTier2Pokemon(); chanceA = 0.7;
	} else if (floor < 35) {
		poolA = getTier2Pokemon(); poolB = getTier3Pokemon(); chanceA = 0.6;
	} else {
		poolA = getTier3Pokemon(); poolB = getTier4Pokemon(); chanceA = 0.7;
	}

	const options: string[] = [];
	for (let i = 0; i < 3; i++) {
		const activePool = Math.random() < chanceA ? poolA : poolB;
		const pick = pickRandom(activePool, 1, [...existing, ...options]);
		if (pick.length) options.push(pick[0]);
	}

	return options.length === 3 ? options : pickRandom([...getTier1Pokemon(), ...getTier2Pokemon()], 3, existing);
}

export function getLevelUpEvo(speciesId: string): { evoTo: string, evoLevel: number } | null {
	const species = Dex.species.get(toID(speciesId));
	if (!species.exists || !species.evos.length) return null;

	const validEvos: { evoTo: string, evoLevel: number }[] = [];

	for (const evoName of species.evos) {
		const evo = Dex.species.get(toID(evoName));
		if (evo.evoType === 'other') continue;

		const fallback = evo.evoType ? (EVO_TYPE_FALLBACK_LEVEL[evo.evoType] ?? 36) : 36;
		const evoLevel = evo.evoLevel ?? fallback;

		if (evoLevel > 0) {
			validEvos.push({ evoTo: toID(evoName), evoLevel });
		}
	}

	if (!validEvos.length) return null;
	return validEvos[Math.floor(Math.random() * validEvos.length)];
}

// ---------------------------------------------------------------------------
// Level / EXP helpers
// ---------------------------------------------------------------------------

export function botLevel(floor: number): number {
	let level = 1;
	if (floor <= 20) {
		level += (floor - 1) * 2;
	} else if (floor <= 50) {
		level = 39 + ((floor - 20) * 4);
	} else {
		level = 159 + ((floor - 50) * 8);
	}
	return Math.min(100, level);
}

export function floorExpReward(floor: number): number {
	const currentTarget = botLevel(floor);
	const nextTarget = botLevel(floor + 1);

	if (currentTarget === 100) return 500000;

	const expGap = expForLevel(nextTarget, 'Medium Fast') - expForLevel(currentTarget, 'Medium Fast');
	return Math.floor(expGap * 1.15);
}

export function floorCoinReward(floor: number): number {
	return 30 + floor * 10;
}

/**
 * Applies gained EXP to a Pokémon and handles level-ups and evolution.
 * Uses the species' own expType curve for accurate level thresholds.
 */
export function applyExpAndLevelUp(mon: PokemonEntry, expGained: number): { evolved: boolean, oldLevel: number } {
	const oldLevel = mon.level;
	mon.exp += expGained;

	const expType = getExpType(mon.species);
	while (mon.level < 100 && mon.exp >= expForLevel(mon.level + 1, expType)) {
		mon.level++;
	}

	let evolved = false;
	while (true) {
		const evo = getLevelUpEvo(mon.species);
		if (!evo || mon.level < evo.evoLevel) break;
		mon.species = evo.evoTo;
		evolved = true;
	}
	return { evolved, oldLevel };
}

export function getLevelUpMoves(speciesId: string, level: number): string[] {
	const learnsetData = Dex.species.getLearnsetData(toID(speciesId));
	const learnset = learnsetData?.learnset;
	if (!learnset) return ['tackle'];

	const available: { move: string, learnLevel: number }[] = [];

	for (const [moveid, sources] of Object.entries(learnset)) {
		for (const src of sources) {
			const match = /^9L(\d+)$/.exec(src);
			if (match) {
				const learnLvl = parseInt(match[1]);
				if (learnLvl <= level) {
					available.push({ move: moveid, learnLevel: learnLvl });
				}
				break;
			}
		}
	}

	if (!available.length) return ['tackle'];

	available.sort((a, b) => b.learnLevel - a.learnLevel);
	return available.slice(0, 4).map(m => m.move);
}

export function getMovesLearnedBetween(speciesId: string, oldLevel: number, newLevel: number, isEvolution = false): string[] {
	const learnset = Dex.species.getLearnsetData(toID(speciesId))?.learnset;
	if (!learnset) return [];

	const learned: string[] = [];
	for (const [moveid, sources] of Object.entries(learnset)) {
		for (const src of sources) {
			const match = /^9L(\d+)$/.exec(src);
			if (match) {
				const learnLvl = parseInt(match[1]);
				if (learnLvl > oldLevel && learnLvl <= newLevel) {
					learned.push(moveid);
				} else if (isEvolution && learnLvl === 0) {
					learned.push(moveid);
				}
				break;
			}
		}
	}
	return Array.from(new Set(learned));
}

// ---------------------------------------------------------------------------
// AI Pokémon generation — BST-weighted pool (mirrors poketest.ts genPokemon)
// ---------------------------------------------------------------------------

/**
 * Maps a floor number to a difficulty tier (0–6), same scale as poketest.ts
 * streak index. Every 10 floors ≈ one streak tier.
 */
function floorToDifficultyTier(floor: number): number {
	return Math.min(6, Math.floor((floor - 1) / 10));
}

/**
 * Builds a parabolic BST weight for a species.
 *
 *   weight = (-1/range) * (bst - midpoint)² + (weightcap + range)
 *
 * Clamped to [0, weightcap]. Species whose BST is too far from midpoint
 * get weight 0 and are excluded.
 *
 * Matches the formula in poketest.ts genPokemon().
 */
/**
 * Utils.clampIntRange in PS truncates toward zero (same as Math.trunc for
 * positive numbers), not Math.round. Match that exactly.
 */
function bstWeight(bst: number, midpoint: number, range: number, weightcap: number): number {
	const raw = (-1 / range) * (bst - midpoint) ** 2 + (weightcap + range);
	return Math.max(0, Math.min(weightcap, Math.trunc(raw)));
}

/**
 * Chooses a random item from a weighted pool using cumulative-sum selection.
 * Returns the chosen index, or -1 if the pool is empty.
 */
function weightedPickIndex(weights: number[]): number {
	const total = weights.reduce((a, b) => a + b, 0);
	if (total <= 0) return -1;
	let rnd = Math.floor(Math.random() * total);
	for (let i = 0; i < weights.length; i++) {
		rnd -= weights[i];
		if (rnd < 0) return i;
	}
	return weights.length - 1;
}

/**
 * Picks a random functional held item for an AI Pokémon (1-in-20 chance).
 * Mirrors poketest.ts genItem() — only picks items that do something in battle.
 */
function pickRandomHeldItem(speciesName: string): string {
	if (Math.random() >= 0.05) return ''; // 1/20 chance

	const allItems = Dex.items.all().filter(i => {
		if (i.isNonstandard && i.isNonstandard !== 'Past') return false;
		// Must have battle utility: z-move crystal, species-specific, or functional
		if (i.zMove) return true;
		if (i.itemUser) return i.itemUser.some(u => toID(u) === toID(speciesName));
		return Object.keys(i).some(k => typeof (i as any)[k] === 'function');
	});

	if (!allItems.length) return '';
	return allItems[Math.floor(Math.random() * allItems.length)].id;
}

/**
 * Picks moves for an AI Pokémon matching poketest.ts getMovesAtTarget() exactly:
 *
 * 1. Uses getFullLearnset (full chain) not just getLearnsetData
 * 2. Builds prevo list and SKIPS prevo learnset entries (only species' own moves)
 * 3. Collects all level-up moves learned at or below `level`
 * 4. Deduplicates (Set), shuffles (randomises equal-level ties)
 * 5. Reverses (most recent first), takes top 4, reverses back to chronological
 */
function pickAIMoves(speciesId: string, level: number): string[] {
	const id = toID(speciesId);

	// Build prevo list (same walk as poketest.ts)
	const prevoList: string[] = [];
	let dexSpecies = Dex.species.get(id);
	while (dexSpecies.prevo) {
		prevoList.push(toID(dexSpecies.prevo));
		dexSpecies = Dex.species.get(dexSpecies.prevo);
	}

	// getFullLearnset includes the full inheritance chain
	const fullLearn = Dex.species.getFullLearnset(id);
	let viableMoves: string[] = [];

	for (const learnsetIndex of fullLearn) {
		// Skip prevo learnset entries — only use the species' own entry
		// (mirrors poketest.ts: if prevoList.includes(learnsetIndex.species.name) continue)
		if (prevoList.includes(toID(learnsetIndex.species.name))) continue;

		const learnset = learnsetIndex.learnset ?? {};
		for (const moveid in learnset) {
			// Match gen9 level-up source strings: "9L5", "9L20", etc.
			if (learnset[moveid].some((src: string) => src === `9L${level}` ||
				(/^9L(\d+)$/.test(src) && parseInt(src.slice(2)) <= level))) {
				if (!viableMoves.includes(moveid)) viableMoves.push(moveid);
			}
		}
	}

	if (!viableMoves.length) return ['tackle'];

	// Shuffle (mirrors Utils.shuffle for equal-level tiebreaking)
	for (let i = viableMoves.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[viableMoves[i], viableMoves[j]] = [viableMoves[j], viableMoves[i]];
	}

	// Reverse (most recently learned first), take top 4, reverse back to order
	viableMoves = viableMoves.reverse();
	const top4 = viableMoves.slice(0, 4);
	top4.reverse();
	return top4.map(m => Dex.moves.get(m).id || m);
}

/**
 * Picks a random ability for an AI Pokémon.
 * Weights match poketest.ts exactly (=== 1, not === 0 — same probability,
 * verbatim source match):
 *   special (S): 1/50, hidden (H): 1/20, ability[1]: 1/2, else ability[0].
 */
function pickRandomAbility(species: Species): string {
	const abilities = species.abilities as Record<string, string>;
	if (abilities['S'] && Math.floor(Math.random() * 50) === 1) return abilities['S'];
	if (abilities['H'] && Math.floor(Math.random() * 20) === 1) return abilities['H'];
	if (abilities['1'] && Math.floor(Math.random() * 2) === 1) return abilities['1'];
	return abilities['0'] ?? '';
}

/**
 * Generates `quantity` AI Pokémon using a BST-weighted probability pool,
 * scaled by floor difficulty. Mirrors poketest.ts genPokemon().
 *
 * Difficulty scaling (floor → streak mapping):
 *   - midpoint starts at 250 (weak unevolved mons) and rises +50 per tier
 *   - level range starts [5,10] and scales +5 per tier on each end
 *   - legendaries/Gmax/Totem forms excluded
 */
export function genAIPokemon(quantity: number, floor: number): AIPokemonSet[] {
	const tier = floorToDifficultyTier(floor);

	// BST weighting parameters — scaled with tier exactly as in poketest.ts
	const midpoint = Math.min(650, 250 + tier * 50);
	const range = 50;
	const weightcap = 100;

	// Level range — each endpoint scales +5 per tier
	const minLevel = Math.min(100, 5 + tier * 5);
	const maxLevel = Math.min(100, 10 + tier * 5);

	// Filter candidates — same exclusions as poketest.ts
	const allSpecies = Dex.species.all().filter(s =>
		s.exists &&
		s.num > 0 &&
		!s.battleOnly &&
		!s.requiredItems?.length &&
		s.forme !== 'Gmax' &&
		!s.forme.includes('Totem') &&
		s.forme !== 'Dusk' &&
		s.forme !== 'Bond' &&
		!(s.isNonstandard && s.isNonstandard !== 'Past')
	);

	// Build weighted pool
	let pool: Array<{ species: Species, weight: number }> = [];
	for (const s of allSpecies) {
		// Shedinja special case (mirrors poketest.ts)
		const effectiveBST = toID(s.name) === 'shedinja' ? 500 : (s.bst ?? getBST(s));
		const w = bstWeight(effectiveBST, midpoint, range, weightcap);
		if (w > 0) pool.push({ species: s, weight: w });
	}

	const natures = Dex.natures.all().map(n => n.name);
	const allTypes = Dex.types.all().map(t => t.name);
	const result: AIPokemonSet[] = [];
	const usedBaseSpecies = new Set<string>();

	let attempts = 0;

	while (result.length < quantity && attempts < 2000) {
		attempts++;

		if (!pool.length) break;

		const weights = pool.map(p => p.weight);
		const idx = weightedPickIndex(weights);
		if (idx === -1) break;

		const { species: sp } = pool[idx];
		pool.splice(idx, 1); // Remove to avoid duplicates (mirrors pokePool.splice in poketest.ts)

		// Skip if another mon from the same base species was already picked
		if (usedBaseSpecies.has(sp.baseSpecies)) continue;
		usedBaseSpecies.add(sp.baseSpecies);

		// Pick level in range matching poketest.ts exactly:
		// Walk from minLevel to maxLevel; at each step roll random*(maxLevel-curLevel).
		// If the roll is 0 (probability 1/(maxLevel-curLevel)), lock in that level.
		// At maxLevel the range is 0, so the mon is always accepted there.
		// After 500 total pool attempts use a flat random fallback (depth guard).
		let level = maxLevel; // default if loop doesn't break early
		if (attempts <= 500) {
			for (let curLevel = minLevel; curLevel <= maxLevel; curLevel++) {
				const gap = maxLevel - curLevel;
				// Skip levels where the species hasn't met its minimum level requirement
				// (mirrors poketest.ts TeamValidator check for "must be at least level")
				const sp2 = Dex.species.get(finalSpecies);
				if (sp2.evoLevel && curLevel < sp2.evoLevel) continue;

				if (gap === 0 || Math.floor(Math.random() * gap) === 0) {
					level = curLevel;
					break;
				}
			}
		} else {
			// Depth > 500 fallback: flat random in [minLevel, maxLevel)
			level = Math.floor(Math.random() * (maxLevel - minLevel)) + minLevel;
		}

		// Apply evolution based on level (same as existing buildBotTeam logic)
		let finalSpecies = sp.id;
		let evo = getLevelUpEvo(finalSpecies);
		while (evo && level >= evo.evoLevel) {
			finalSpecies = evo.evoTo;
			evo = getLevelUpEvo(finalSpecies);
		}

		const finalSp = Dex.species.get(finalSpecies);

		// Ability
		const ability = pickRandomAbility(finalSp.exists ? finalSp : sp);

		// Nature — random
		const nature = natures[Math.floor(Math.random() * natures.length)] ?? 'Hardy';

		// IVs — random 0–31 per stat (mirrors poketest.ts)
		const ivs = {
			hp:  Math.floor(Math.random() * 32),
			atk: Math.floor(Math.random() * 32),
			def: Math.floor(Math.random() * 32),
			spa: Math.floor(Math.random() * 32),
			spd: Math.floor(Math.random() * 32),
			spe: Math.floor(Math.random() * 32),
		};

		// EVs — all 0 (mirrors poketest.ts)
		const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };

		// Held item — 1/20 chance of functional item
		const item = pickRandomHeldItem(finalSp.name);

		// Shiny — 1/1024 (mirrors poketest.ts)
		const shiny = Math.floor(Math.random() * 1024) === 69;

		// TeraType — 1/20 any type, else random from species' types (mirrors poketest.ts)
		const speciesTypes = finalSp.exists ? (finalSp.types ?? ['Normal']) : ['Normal'];
		const teraType = (Math.floor(Math.random() * 20) === 0)
			? allTypes[Math.floor(Math.random() * allTypes.length)]
			: speciesTypes[Math.floor(Math.random() * speciesTypes.length)];

		// Moves — most recent 4 level-up moves (mirrors poketest.ts)
		const moves = pickAIMoves(finalSpecies, level);

		result.push({
			species: finalSpecies,
			name: finalSp.baseSpecies || finalSp.name,
			level,
			ability,
			nature,
			ivs,
			evs,
			item,
			shiny,
			teraType,
			moves,
			gender: sp.gender || (Math.random() < 0.5 ? 'M' : 'F'),
		});
	}

	// Sort ascending by level (mirrors poketest.ts's opponentTeam sort)
	result.sort((a, b) => a.level - b.level);

	return result;
}

// ---------------------------------------------------------------------------
// AI Pokémon set type
// ---------------------------------------------------------------------------

export interface AIPokemonSet {
	species: string;
	name: string;
	level: number;
	ability: string;
	nature: string;
	ivs: { hp: number, atk: number, def: number, spa: number, spd: number, spe: number };
	evs: { hp: number, atk: number, def: number, spa: number, spd: number, spe: number };
	item: string;
	shiny: boolean;
	teraType: string;
	moves: string[];
	gender: string;
}

// ---------------------------------------------------------------------------
// Pack helpers
// ---------------------------------------------------------------------------

/**
 * Packs a PLAYER Pokémon for the battle format string.
 * Player mons retain their existing item/moves from state.
 */
export function packPokemon(mon: PokemonEntry): string {
	const speciesData = Dex.species.get(toID(mon.species));
	const name = speciesData.exists ? speciesData.name : mon.species;

	const abilities = speciesData.abilities ?? {};
	const ability = (abilities as unknown as Record<string, string>)['0'] || '';

	if (!mon.moves) mon.moves = getLevelUpMoves(toID(mon.species), mon.level);
	const movesStr = mon.moves.join(',');

	const item = mon.heldItem ?? '';
	return `${name}||${item}|${ability}|${movesStr}|Hardy||M|||${mon.level}|`;
}

/**
 * Packs an AI Pokémon set (from genAIPokemon) into PS team format string.
 * Includes full nature/IV/ability/item/tera for realistic battles.
 */
export function packAIPokemon(set: AIPokemonSet): string {
	const speciesData = Dex.species.get(toID(set.species));
	const name = speciesData.exists ? speciesData.name : set.species;

	const ivStr = `${set.ivs.hp},${set.ivs.atk},${set.ivs.def},${set.ivs.spa},${set.ivs.spd},${set.ivs.spe}`;
	const evStr = `${set.evs.hp},${set.evs.atk},${set.evs.def},${set.evs.spa},${set.evs.spd},${set.evs.spe}`;
	const movesStr = set.moves.join(',');
	const shinyStr = set.shiny ? 'S' : '';

	// Format: name|nickname|item|ability|moves|nature|evs|gender|ivs|shiny|level|happiness,dynamaxLevel,gigantamax,teraType
	return `${name}||${set.item}|${set.ability}|${movesStr}|${set.nature}|${evStr}|${set.gender}|${ivStr}|${shinyStr}|${set.level}|,,,${set.teraType}`;
}

export function packTeam(mons: PokemonEntry[]): string {
	return mons.map(m => packPokemon(m)).join(']');
}

export function packAITeam(sets: AIPokemonSet[]): string {
	return sets.map(s => packAIPokemon(s)).join(']');
}
