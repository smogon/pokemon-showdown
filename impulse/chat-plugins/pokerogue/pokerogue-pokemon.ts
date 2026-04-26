/*
 * =======================================================================
 *
 *    ___ __  __ ___ _   _ _    ___ ___
 *   |_ _|  \/  | _ \ | | | |  / __| __|
 *    | || |\/| |  _/ |_| | |__\__ \ _|
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

/**
 * Load exp.json once at startup.  The file lives at
 * `impulse/db/exp.json` (same folder as pokerogue.json).
 */
export async function loadExpData(): Promise<void> {
	try {
		const raw = await FS('impulse/db/exp.json').readIfExists();
		if (raw) expData = JSON.parse(raw) as ExpData;
	} catch {
		expData = {};
	}
}

void loadExpData();

/**
 * Returns the base expYield for a species, falling back to a BST-derived
 * estimate when the species is not in exp.json (regional forms, fakemons…).
 */
export function getExpYield(speciesId: string): number {
	const id = toID(speciesId);
	if (expData[id]) return expData[id].expYield;

	// Fallback: estimate from BST (roughly mirrors official yields)
	const sp = Dex.species.get(id);
	if (!sp.exists) return 70;
	const bs = sp.baseStats ?? { hp: 45, atk: 45, def: 45, spa: 45, spd: 45, spe: 45 };
	const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
	return Math.round(bst / 3.5);
}

/**
 * Calculate the EXP a player's Pokémon earns for defeating an AI Pokémon.
 *
 * Formula mirrors the main-series Gen-5+ traded-Pokémon formula
 * (without trade bonus since it doesn't apply here):
 *
 *   exp = floor(baseYield * enemyLevel / 5)
 *
 * Then we apply the Lucky Charm multiplier and a boss-floor bonus.
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
// Existing code below – unchanged except for removing the old flat EXP
// helper exports that are no longer used by the battle handler
// (floorExpReward kept for any references elsewhere, but the handler no
// longer calls it for per-Pokémon exp distribution).
// ---------------------------------------------------------------------------

const EVO_TYPE_FALLBACK_LEVEL: Partial<Record<string, number>> = {
	trade: 36,
	useItem: 36,
	levelFriendship: 20,
	levelMove: 30,
	levelExtra: 20,
	levelHold: 30,
};

// --- TIERING SYSTEM ---

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
		if (rand <= 0.30) {
			pool = getTier4Pokemon();
			isFeatured = true;
		} else {
			pool = getTier3Pokemon();
		}
	} else if (gachaType === 'ultra') {
		if (rand <= 0.75) {
			pool = getTier3Pokemon();
			isFeatured = true;
		} else {
			pool = getTier2Pokemon();
		}
	} else { // great
		if (rand <= 0.70) {
			pool = getTier2Pokemon();
			isFeatured = true;
		} else {
			pool = getTier3Pokemon();
		}
	}

	const picks = pickRandom(pool, 1, exclude);
	const species = picks.length ? picks[0] : (pickRandom(getTier1Pokemon(), 1)[0] ?? 'bulbasaur');
	return { species, isFeatured };
}

export function pickStarterOptions(): string[] {
	return pickRandom(getTier1Pokemon(), 3);
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

// --- LEVEL 999 MATH & EXP ---

export function botLevel(floor: number): number {
	let level = 1;
	if (floor <= 20) {
		level += (floor - 1) * 2;
	} else if (floor <= 50) {
		level = 39 + ((floor - 20) * 4);
	} else {
		level = 159 + ((floor - 50) * 8);
	}
	return Math.min(999, level);
}

export function expForLevel(level: number): number {
	return 15 * level * (level - 1);
}

/**
 * Kept for backwards-compat (shop reroll cost display, etc.) but no longer
 * used to calculate per-battle EXP distribution.
 */
export function floorExpReward(floor: number): number {
	const currentTarget = botLevel(floor);
	const nextTarget = botLevel(floor + 1);

	if (currentTarget === 999) return 500000;

	const expGap = expForLevel(nextTarget) - expForLevel(currentTarget);
	return Math.floor(expGap * 1.15);
}

export function floorCoinReward(floor: number): number {
	return 30 + floor * 10;
}

export function applyExpAndLevelUp(mon: PokemonEntry, expGained: number): { evolved: boolean, oldLevel: number } {
	const oldLevel = mon.level;
	mon.exp += expGained;

	while (mon.level < 999 && mon.exp >= expForLevel(mon.level + 1)) {
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

export function packTeam(mons: PokemonEntry[]): string {
	return mons.map(m => packPokemon(m)).join(']');
}
