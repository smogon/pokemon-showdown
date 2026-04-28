import { FS } from '../../../lib';
import { type PokemonEntry } from './pokerogue-types';

// ─── Exp data ────────────────────────────────────────────────────────────────

interface ExpEntry {
	expYield: number;
	expType: string;
	evYield: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
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

export function getExpYield(speciesId: string): number {
	const id = toID(speciesId);
	if (expData[id]) return expData[id].expYield;
	const sp = Dex.species.get(id);
	if (!sp.exists) return 70;
	const bs = sp.baseStats ?? { hp: 45, atk: 45, def: 45, spa: 45, spd: 45, spe: 45 };
	return Math.round((bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe) / 3.5);
}

export function getExpType(speciesId: string): string {
	const id = toID(speciesId);
	if (expData[id]) return expData[id].expType;
	const sp = Dex.species.get(id);
	if (sp.exists && sp.baseSpecies) {
		const baseId = toID(sp.baseSpecies);
		if (baseId !== id && expData[baseId]) return expData[baseId].expType;
	}
	if (sp.exists) {
		const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		if (bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe >= 580) return 'Slow';
	}
	return 'Medium Fast';
}

// ─── Exp formula (from poketest.ts) ──────────────────────────────────────────

export function expForLevel(level: number, expType = 'Medium Fast'): number {
	if (level <= 1) return 0;
	const n = level;
	switch (expType) {
	case 'Erratic':
		if (n < 50)  return Math.floor((n ** 3 * (100 - n)) / 50);
		if (n < 68)  return Math.floor((n ** 3 * (150 - n)) / 100);
		if (n < 90)  return Math.floor((n ** 3 * ((1911 - (10 * n)) / 3)) / 500);
		return Math.floor((n ** 3 * (160 - n)) / 100);
	case 'Fast':
		return Math.floor((4 * n ** 3) / 5);
	case 'Medium Fast':
		return Math.floor(n ** 3);
	case 'Medium Slow': {
		const a = (6 / 5) * n ** 3;
		const b = 15 * n ** 2;
		const c = 100 * n;
		return Math.max(0, Math.floor(a - b + c - 140));
	}
	case 'Slow':
		return Math.floor((5 * n ** 3) / 4);
	case 'Fluctuating':
		if (n < 15)  return Math.floor((n ** 3 * (((n + 1) / 3) + 24)) / 50);
		if (n < 36)  return Math.floor((n ** 3 * (n + 14)) / 50);
		return Math.floor((n ** 3 * ((n / 2) + 32)) / 50);
	default:
		return Math.floor(n ** 3);
	}
}

// ─── Kill exp ─────────────────────────────────────────────────────────────────

export function calcKillExp(
	enemySpeciesId: string,
	enemyLevel: number,
	playerLevel: number,
	luckyCharmActive: boolean,
	isBossFloor: boolean,
): number {
	const baseYield = getExpYield(enemySpeciesId);
	const base = Math.floor((baseYield * enemyLevel) / 5);
	const scalingNumer = Math.pow(2 * enemyLevel + 10, 1.5);
	const scalingDenom = Math.pow(enemyLevel + playerLevel + 10, 1.5);
	let exp = Math.floor(base * (scalingNumer / scalingDenom)) + 1;
	if (isBossFloor) exp = Math.floor(exp * 1.5);
	if (luckyCharmActive) exp *= 2;
	return Math.max(1, exp);
}

// ─── Move learning (from poketest.ts getMovesAtTarget) ────────────────────────

type MoveLearnCategory = 'M' | 'T' | 'L' | 'R' | 'E' | 'D' | 'S' | 'V' | 'C' | 'any';

function getMovesAtTarget(pokemon: string, target: MoveLearnCategory, level?: number): string[] {
	let genNumber = 9;
	while (genNumber > 1) {
		if (Dex.mod(`gen${genNumber}`).species.get(toID(pokemon)).isNonstandard) {
			genNumber--;
			continue;
		}
		break;
	}
	if (toID(pokemon) === 'floetteeternal') genNumber = 6;
	else if (toID(pokemon) === 'eternatuseternamax') genNumber = 8;

	const prevoList: string[] = [];
	let dexSpecies = Dex.species.get(pokemon);
	while (dexSpecies.prevo) {
		prevoList.push(dexSpecies.prevo);
		dexSpecies = Dex.species.get(dexSpecies.prevo);
	}

	const fullLearn = Dex.species.getFullLearnset(toID(pokemon));
	const movesAtLevel: string[] = [];

	for (const learnsetIndex of fullLearn) {
		if (prevoList.length && prevoList.includes(learnsetIndex.species.name)) continue;
		const learnset = learnsetIndex.learnset;
		for (const move in learnset) {
			if (target === 'any') {
				if (!movesAtLevel.includes(move)) movesAtLevel.push(move);
				continue;
			}
			const learnSetString = target === 'L'
				? `${genNumber}${target}${level}`
				: `${genNumber}${target}`;
			if (learnset[move].some(src => src === learnSetString)) {
				if (!movesAtLevel.includes(move)) movesAtLevel.push(move);
			}
		}
	}

	for (let i = movesAtLevel.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[movesAtLevel[i], movesAtLevel[j]] = [movesAtLevel[j], movesAtLevel[i]];
	}
	return movesAtLevel;
}

// ─── Level-up move building (poketest.ts style) ───────────────────────────────

export function getLevelUpMoves(speciesId: string, level: number): string[] {
	let viableMoves: string[] = [];
	for (let lvl = 0; lvl <= level; lvl++) {
		const atLevel = getMovesAtTarget(speciesId, 'L', lvl);
		for (const m of atLevel) {
			if (!viableMoves.includes(m)) viableMoves.push(m);
		}
	}
	viableMoves = [...new Set(viableMoves)];
	if (!viableMoves.length) return ['tackle'];
	viableMoves = viableMoves.reverse();
	const result = viableMoves.slice(0, Math.min(viableMoves.length, 4));
	result.reverse();
	return result;
}

// ─── Moves learned between two levels ────────────────────────────────────────

export function getMovesLearnedBetween(speciesId: string, oldLevel: number, newLevel: number, isEvolution = false): string[] {
	const id = toID(speciesId);
	const sp = Dex.species.get(id);
	const learnsetData = Dex.species.getLearnsetData(id);
	const baseLearnsetData = (sp.baseSpecies && toID(sp.baseSpecies) !== id)
		? Dex.species.getLearnsetData(toID(sp.baseSpecies))
		: null;
	const learnset = learnsetData?.learnset ?? baseLearnsetData?.learnset;
	if (!learnset) return [];

	const learned: string[] = [];
	for (const [moveid, sources] of Object.entries(learnset)) {
		for (const src of sources) {
			const match = /^9L(\d+)$/.exec(src);
			if (match) {
				const learnLvl = parseInt(match[1]);
				if (learnLvl > oldLevel && learnLvl <= newLevel) learned.push(moveid);
				else if (isEvolution && learnLvl === 0) learned.push(moveid);
				break;
			}
		}
	}
	return Array.from(new Set(learned));
}

// ─── Ability selection (from poketest.ts) ─────────────────────────────────────

function pickRandomAbility(species: Species): string {
	const abilities = species.abilities as Record<string, string>;
	if (abilities['S'] && Math.floor(Math.random() * 50) === 1) return abilities['S'];
	if (abilities['H'] && Math.floor(Math.random() * 20) === 1) return abilities['H'];
	if (abilities['1'] && Math.floor(Math.random() * 2) === 1) return abilities['1'];
	return abilities['0'] ?? '';
}

// ─── BST weighting (from poketest.ts) ─────────────────────────────────────────

interface PokePackWeighting {
	range: number;
	midpoint: number;
	weightcap: number;
}

function getBST(species: Species): number {
	const bs = species.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	return bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
}

function bstWeight(bst: number, midpoint: number, range: number, weightcap: number): number {
	const raw = (-1 / range) * (bst - midpoint) ** 2 + (weightcap + range);
	return Math.max(0, Math.min(weightcap, Math.trunc(raw)));
}

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

// ─── Held item ────────────────────────────────────────────────────────────────

function pickRandomHeldItem(speciesName: string): string {
	if (Math.floor(Math.random() * 20) !== 0) return '';
	const allItems = Dex.items.all().filter(i => {
		if (i.isNonstandard && i.isNonstandard !== 'Past') return false;
		if (i.zMove) return true;
		if (i.itemUser) return i.itemUser.some(u => toID(u) === toID(speciesName));
		return Object.keys(i).some(k => typeof (i as any)[k] === 'function');
	});
	if (!allItems.length) return '';
	return allItems[Math.floor(Math.random() * allItems.length)].id;
}

// ─── Core genPokemon (ported from poketest.ts) ────────────────────────────────

export interface AIPokemonSet {
	species: string;
	name: string;
	level: number;
	ability: string;
	nature: string;
	ivs: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
	evs: { hp: number; atk: number; def: number; spa: number; spd: number; spe: number };
	item: string;
	shiny: boolean;
	teraType: string;
	moves: string[];
	gender: string;
}

/**
 * Core weighted species + moveset generator, ported directly from poketest.ts genPokemon.
 * `level` may be a single number or [min, max] range.
 * `weighting` controls BST probability curve; omit for uniform sampling.
 * `starter` filters to stage-1, non-legendary species.
 */
export function genPokemon(
	quantity: number,
	level: number | number[],
	weighting?: PokePackWeighting,
	starter?: boolean,
): AIPokemonSet[] {
	let minLevel: number;
	let maxLevel: number;
	if (typeof level === 'number') {
		minLevel = level;
		maxLevel = level;
	} else {
		minLevel = level[0];
		maxLevel = level[1] ?? level[0];
	}

	let all = Dex.species.all().filter(s =>
		!s.battleOnly &&
		!s.requiredItems &&
		s.forme !== 'Gmax' &&
		!s.forme.includes('Totem') &&
		s.forme !== 'Dusk' &&
		s.forme !== 'Bond' &&
		!(s.isNonstandard && s.isNonstandard !== 'Past')
	);

	if (starter) {
		all = all.filter(s => !s.prevo);
		all = all.filter(s => !(
			s.tags.includes('Mythical') ||
			s.tags.includes('Restricted Legendary') ||
			s.tags.includes('Sub-Legendary')
		));
		all = all.filter(s => !(
			s.tags.includes('Paradox') ||
			['Gouging Fire', 'Raging Bolt', 'Iron Crown', 'Iron Boulder'].includes(s.baseSpecies)
		));
		all = all.filter(s => !s.tags.includes('Ultra Beast') || s.name === 'Poipole');
		all = all.filter(s => !['Ursaluna-Bloodmoon', 'Floette-Eternal'].includes(s.name));
	}

	// Build weighted pool
	let pokePool: Array<{ specie: Species; score: number }> = [];
	for (const contender of all) {
		let score = 1;
		if (weighting) {
			let bst = contender.bst ?? getBST(contender);
			if (toID(contender.name) === 'shedinja') bst = 500;
			score = bstWeight(bst, weighting.midpoint, weighting.range, weighting.weightcap);
		}
		if (score > 0) pokePool.push({ specie: contender, score });
	}

	const natures = Dex.natures.all().map(n => n.name);
	const allTypes = Dex.types.all().map(t => t.name);
	const gennedMons: AIPokemonSet[] = [];
	let depth = 0;

	while (gennedMons.length < quantity) {
		if (!pokePool.length) break;

		const idx = weightedPickIndex(pokePool.map(p => p.score));
		if (idx === -1) break;
		const { specie } = pokePool[idx];
		pokePool.splice(idx, 1);

		// Remove same base species from pool (poketest.ts behaviour)
		pokePool = pokePool.filter(p => p.specie.baseSpecies !== specie.baseSpecies);

		const ability = pickRandomAbility(specie);
		const nature = natures[Math.floor(Math.random() * natures.length)] ?? 'Hardy';
		const ivs = {
			hp:  Math.floor(Math.random() * 32),
			atk: Math.floor(Math.random() * 32),
			def: Math.floor(Math.random() * 32),
			spa: Math.floor(Math.random() * 32),
			spd: Math.floor(Math.random() * 32),
			spe: Math.floor(Math.random() * 32),
		};
		const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const shiny = Math.floor(Math.random() * 1024) === 69;
		const item = pickRandomHeldItem(specie.name);
		const teraType = Math.floor(Math.random() * 20) === 0
			? allTypes[Math.floor(Math.random() * allTypes.length)]
			: specie.types[Math.floor(Math.random() * specie.types.length)];

		// Level selection: biased toward lower via poketest.ts pattern, no validator
		let chosenLevel: number;
		if (depth > 500) {
			chosenLevel = Math.floor(Math.random() * (maxLevel - minLevel)) + minLevel;
		} else {
			chosenLevel = maxLevel;
			for (let curLevel = minLevel; curLevel <= maxLevel; curLevel++) {
				const gap = maxLevel - curLevel;
				if (gap === 0 || Math.floor(Math.random() * gap) === 0) {
					chosenLevel = curLevel;
					break;
				}
			}
		}

		// Build moveset: collect all level-up moves up to chosenLevel, take last 4
		let viableMoves: string[] = [];
		for (let lvl = 0; lvl <= chosenLevel; lvl++) {
			const atLevel = getMovesAtTarget(specie.name, 'L', lvl);
			for (const m of atLevel) {
				if (!viableMoves.includes(m)) viableMoves.push(m);
			}
		}
		viableMoves = [...new Set(viableMoves)];
		if (!viableMoves.length) viableMoves = ['tackle'];
		viableMoves = viableMoves.reverse();
		const moves = viableMoves.slice(0, Math.min(viableMoves.length, 4)).reverse()
			.map(m => Dex.moves.get(m).id || toID(m));

		gennedMons.push({
			species: toID(specie.name),
			name: specie.baseSpecies,
			level: chosenLevel,
			ability,
			nature,
			ivs,
			evs,
			item,
			shiny,
			teraType,
			moves,
			gender: specie.gender || (Math.random() < 0.5 ? 'M' : 'F'),
		});

		depth++;
	}

	return gennedMons;
}

// ─── Level/floor scaling (from poketest.ts win()) ────────────────────────────

/**
 * Returns the [min, max] level scale for a given streak, matching poketest.ts win():
 *   base = [5, 10], each value += streak * 5, clamped to [1, 100].
 */
export function levelScaleForStreak(streak: number): [number, number] {
	const min = Math.min(100, Math.max(1, 5 + streak * 5));
	const max = Math.min(100, Math.max(1, 10 + streak * 5));
	return [min, max];
}

// ─── Public-facing generators ─────────────────────────────────────────────────

/**
 * Starter options: stage-1, non-legendary, BST-weighted around 315 (poketest.ts values).
 */
export function pickStarterOptions(): string[] {
	const mons = genPokemon(3, 5, { midpoint: 315, range: 65, weightcap: 100 }, true);
	return mons.map(m => m.species);
}

/**
 * New pokemon options for a pack purchase, using the same default weighting as poketest.ts win().
 * `streak` is the current streaks-won count (used to scale level range).
 */
export function pickNewPokemonOptions(currentTeam: PokemonEntry[], floor: number, streak = 0): string[] {
	const scale = levelScaleForStreak(streak);
	const weighting: PokePackWeighting = { midpoint: 250, range: 50, weightcap: 100 };
	const mons = genPokemon(3, scale, weighting);
	return mons.map(m => m.species);
}

/**
 * Generate pokemon for a named pack, matching poketest.ts buy() case 'pokemonPack' exactly.
 * Returns 3 AIPokemonSet options.
 */
export function genPackPokemon(packName: string, streak: number): AIPokemonSet[] {
	const scale = levelScaleForStreak(streak);

	let weighting: PokePackWeighting;
	switch (packName) {
	case 'Poke Ball Pack':
		weighting = { range: 100, midpoint: 263, weightcap: 100 };
		break;
	case 'Great Ball Pack':
		weighting = { range: 35, midpoint: 450, weightcap: 100 };
		break;
	case 'Ultra Ball Pack':
		weighting = { range: 30, midpoint: 540, weightcap: 100 };
		break;
	case 'Master Ball Pack':
		weighting = { range: 50, midpoint: 640, weightcap: 100 };
		break;
	default:
		// Fallback: same as poketest.ts else branch (no weighting override)
		return genPokemon(3, scale);
	}

	return genPokemon(3, scale, weighting);
}

/**
 * AI opponent team, using same weighting curve as poketest.ts win().
 * `streak` drives both level scale and BST midpoint.
 */
export function genAIPokemon(quantity: number, streak = 0): AIPokemonSet[] {
	const scale = levelScaleForStreak(streak);
	const midpoint = Math.min(650, 250 + streak * 50);
	const weighting: PokePackWeighting = { midpoint, range: 50, weightcap: 100 };
	const mons = genPokemon(quantity, scale, weighting);
	mons.sort((a, b) => a.level - b.level);
	return mons;
}

// ─── Evolution helpers ────────────────────────────────────────────────────────

const EVO_TYPE_FALLBACK_LEVEL: Partial<Record<string, number>> = {
	trade: 36, useItem: 36, levelFriendship: 20,
	levelMove: 30, levelExtra: 20, levelHold: 30,
};

export function getLevelUpEvo(speciesId: string): { evoTo: string; evoLevel: number } | null {
	const species = Dex.species.get(toID(speciesId));
	if (!species.exists || !species.evos.length) return null;
	const validEvos: { evoTo: string; evoLevel: number }[] = [];
	for (const evoName of species.evos) {
		const evo = Dex.species.get(toID(evoName));
		if (evo.evoType === 'other') continue;
		const fallback = evo.evoType ? (EVO_TYPE_FALLBACK_LEVEL[evo.evoType] ?? 36) : 36;
		const evoLevel = evo.evoLevel ?? fallback;
		if (evoLevel > 0) validEvos.push({ evoTo: toID(evoName), evoLevel });
	}
	if (!validEvos.length) return null;
	return validEvos[Math.floor(Math.random() * validEvos.length)];
}

export function applyExpAndLevelUp(mon: PokemonEntry, expGained: number): { evolved: boolean; oldLevel: number } {
	const oldLevel = mon.level;
	mon.exp += expGained;
	const expType = mon.expType ?? getExpType(mon.species);
	while (mon.level < 100 && mon.exp >= expForLevel(mon.level + 1, expType)) {
		mon.level++;
	}
	let evolved = false;
	while (true) {
		const evo = getLevelUpEvo(mon.species);
		if (!evo || mon.level < evo.evoLevel) break;
		mon.expType = getExpType(evo.evoTo);
		mon.species = evo.evoTo;
		evolved = true;
	}
	return { evolved, oldLevel };
}

// ─── Floor/level helpers ──────────────────────────────────────────────────────

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
	return Math.floor(
		(expForLevel(nextTarget, 'Medium Fast') - expForLevel(currentTarget, 'Medium Fast')) * 1.15
	);
}

export function floorCoinReward(floor: number): number {
	return 30 + floor * 10;
}

// ─── Pack helpers ─────────────────────────────────────────────────────────────

export function packPokemon(mon: PokemonEntry): string {
	const sp = Dex.species.get(toID(mon.species));
	const name = sp.exists ? sp.name : mon.species;
	const ability = (sp.abilities as any)['0'] || '';
	if (!mon.moves) mon.moves = getLevelUpMoves(toID(mon.species), mon.level);
	if ((mon.currentHp ?? 100) <= 0) {
		return `${name}||${mon.heldItem ?? ''}|${ability}|${mon.moves.join(',')}|Hardy||M|||${mon.level}|`;
	}
	const hp = mon.currentHp ?? 100;
	const status = mon.status ?? '';
	let tail = '';
	if (hp !== 100 || status) {
		tail = `,,,,,,${hp !== 100 ? hp : ''},${status}`;
		if (!status) tail = tail.replace(/,$/, '');
	}
	return `${name}||${mon.heldItem ?? ''}|${ability}|${mon.moves.join(',')}|Hardy||M|||${mon.level}|${tail}`;
}

export function packAIPokemon(set: AIPokemonSet): string {
	const sp = Dex.species.get(toID(set.species));
	const name = sp.exists ? sp.name : set.species;
	const ivStr = `${set.ivs.hp},${set.ivs.atk},${set.ivs.def},${set.ivs.spa},${set.ivs.spd},${set.ivs.spe}`;
	const evStr = `${set.evs.hp},${set.evs.atk},${set.evs.def},${set.evs.spa},${set.evs.spd},${set.evs.spe}`;
	const movesStr = set.moves.map(m => Dex.moves.get(m).name || m).join(',');
	const shinyStr = set.shiny ? 'S' : '';
	return `${name}||${set.item}|${set.ability}|${movesStr}|${set.nature}|${evStr}|${set.gender}|${ivStr}|${shinyStr}|${set.level}|,,,${set.teraType}`;
}

export function packTeam(mons: PokemonEntry[]): string {
	return mons.map(m => packPokemon(m)).join(']');
}

export function packAITeam(sets: AIPokemonSet[]): string {
	return sets.map(s => packAIPokemon(s)).join(']');
}
