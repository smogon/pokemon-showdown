import { FS } from '../../../lib';
import { LEGENDARY_TAGS, type PokemonEntry, type PokeRogueState } from './pokerogue-types';

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

export function getExpYield(speciesId: string): number {
	const id = toID(speciesId);
	if (expData[id]) return expData[id].expYield;

	const sp = Dex.species.get(id);
	if (!sp.exists) return 70;
	const bs = sp.baseStats ?? { hp: 45, atk: 45, def: 45, spa: 45, spd: 45, spe: 45 };
	const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
	return Math.round(bst / 3.5);
}

export function getExpType(speciesId: string): string {
	const id = toID(speciesId);

	// 1. Direct hit in exp.json
	if (expData[id]) return expData[id].expType;

	// 2. Forme/regional: try the base species entry in exp.json
	const sp = Dex.species.get(id);
	if (sp.exists && sp.baseSpecies) {
		const baseId = toID(sp.baseSpecies);
		if (baseId !== id && expData[baseId]) return expData[baseId].expType;
	}

	// 3. BST heuristic fallback (same as before)
	if (sp.exists) {
		const bs = sp.baseStats ?? { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
		const bst = bs.hp + bs.atk + bs.def + bs.spa + bs.spd + bs.spe;
		if (bst >= 580) return 'Slow';
	}
	return 'Medium Fast';
}

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
		const val = Math.floor((6 / 5) * n ** 3 - 15 * n ** 2 + 100 * n - 140);
		return Math.max(0, val);
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

const EVO_TYPE_FALLBACK_LEVEL: Partial<Record<string, number>> = {
	trade: 36,
	useItem: 36,
	levelFriendship: 20,
	levelMove: 30,
	levelExtra: 20,
	levelHold: 30,
};

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
		if (s.prevo) return false;
		if (s.tags.includes('Mythical') ||
			s.tags.includes('Restricted Legendary') ||
			s.tags.includes('Sub-Legendary')) return false;
		if (s.tags.includes('Paradox')) return false;
		if (PARADOX_EDGE_CASES.has(s.baseSpecies)) return false;
		if (s.tags.includes('Ultra Beast') && s.name !== 'Poipole') return false;
		if (NAME_BLOCKLIST.has(s.name)) return false;
		return true;
	});

	const midpoint = 315;
	const range = 65;
	const weightcap = 100;

	const pool: Array<{ id: string, weight: number }> = [];
	for (const s of candidates) {
		const effectiveBST = toID(s.name) === 'shedinja' ? 500 : (s.bst ?? getBST(s));
		const w = bstWeight(effectiveBST, midpoint, range, weightcap);
		if (w > 0) pool.push({ id: toID(s.name), weight: w });
	}

	const picks: string[] = [];
	const remaining = pool.slice();

	while (picks.length < 3 && remaining.length > 0) {
		const weights = remaining.map(p => p.weight);
		const idx = weightedPickIndex(weights);
		if (idx === -1) break;
		picks.push(remaining[idx].id);
		remaining.splice(idx, 1);
	}

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

export function applyExpAndLevelUp(mon: PokemonEntry, expGained: number): { evolved: boolean, oldLevel: number } {
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

export function getLevelUpMoves(speciesId: string, level: number): string[] {
	const id = toID(speciesId);
	const sp = Dex.species.get(id);

	const learnsetData = Dex.species.getLearnsetData(id);
	const baseLearnsetData = (sp.baseSpecies && toID(sp.baseSpecies) !== id)
		? Dex.species.getLearnsetData(toID(sp.baseSpecies))
		: null;

	const learnset = learnsetData?.learnset ?? baseLearnsetData?.learnset;
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
	const top4 = available.slice(0, 4);

	const hasAttack = top4.some(m => (Dex.moves.get(m.move).basePower ?? 0) > 0);
	if (!hasAttack) {
		const attackingMove = available.slice(4).find(m => (Dex.moves.get(m.move).basePower ?? 0) > 0);
		if (attackingMove) {
			top4[top4.length - 1] = attackingMove;
		} else {
			top4[top4.length - 1] = { move: 'tackle', learnLevel: 0 };
		}
	}

	return top4.map(m => m.move);
}

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

function floorToDifficultyTier(floor: number): number {
	return Math.min(6, Math.floor((floor - 1) / 10));
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

function pickRandomHeldItem(speciesName: string): string {
	if (Math.random() >= 0.05) return '';

	const allItems = Dex.items.all().filter(i => {
		if (i.isNonstandard && i.isNonstandard !== 'Past') return false;
		if (i.zMove) return true;
		if (i.itemUser) return i.itemUser.some(u => toID(u) === toID(speciesName));
		return Object.keys(i).some(k => typeof (i as any)[k] === 'function');
	});

	if (!allItems.length) return '';
	return allItems[Math.floor(Math.random() * allItems.length)].id;
}

function pickAIMoves(speciesId: string, level: number): string[] {
	const id = toID(speciesId);
	const sp = Dex.species.get(id);

	const prevoList: string[] = [];
	let dexSpecies = sp;
	while (dexSpecies.prevo) {
		prevoList.push(toID(dexSpecies.prevo));
		dexSpecies = Dex.species.get(dexSpecies.prevo);
	}

	const baseSpeciesId = sp.baseSpecies ? toID(sp.baseSpecies) : id;

	const fullLearn = Dex.species.getFullLearnset(id);
	let viableMoves: string[] = [];

	for (const learnsetIndex of fullLearn) {
		const entryId = toID(learnsetIndex.species.name);

		if (prevoList.includes(entryId) && entryId !== baseSpeciesId) continue;

		const learnset = learnsetIndex.learnset ?? {};
		for (const moveid in learnset) {
			for (const src of learnset[moveid]) {
				const match = /^9L(\d+)$/.exec(src);
				if (match) {
					if (parseInt(match[1]) <= level) {
						if (!viableMoves.includes(moveid)) viableMoves.push(moveid);
					}
					break;
				}
			}
		}
	}

	if (!viableMoves.length) return ['tackle'];

	for (let i = viableMoves.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[viableMoves[i], viableMoves[j]] = [viableMoves[j], viableMoves[i]];
	}

	viableMoves = viableMoves.reverse();
	const top4 = viableMoves.slice(0, 4);
	top4.reverse();

	const hasAttack = top4.some(m => (Dex.moves.get(m).basePower ?? 0) > 0);
	if (!hasAttack) {
		const attackingMove = viableMoves.slice(4).find(m => (Dex.moves.get(m).basePower ?? 0) > 0);
		if (attackingMove) {
			top4[top4.length - 1] = attackingMove;
		} else {
			top4[top4.length - 1] = 'tackle';
		}
	}

	return top4.map(m => Dex.moves.get(m).id || m);
}


function pickRandomAbility(species: Species): string {
	const abilities = species.abilities as Record<string, string>;
	if (abilities['S'] && Math.floor(Math.random() * 50) === 1) return abilities['S'];
	if (abilities['H'] && Math.floor(Math.random() * 20) === 1) return abilities['H'];
	if (abilities['1'] && Math.floor(Math.random() * 2) === 1) return abilities['1'];
	return abilities['0'] ?? '';
}

export function genAIPokemon(quantity: number, floor: number): AIPokemonSet[] {
	const tier = floorToDifficultyTier(floor);

	const midpoint = Math.min(650, 250 + tier * 50);
	const range = 50;
	const weightcap = 100;

	const minLevel = Math.min(100, 5 + tier * 5);
	const maxLevel = Math.min(100, 10 + tier * 5);

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

	let pool: Array<{ species: Species, weight: number }> = [];
	for (const s of allSpecies) {
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
		pool.splice(idx, 1);

		if (usedBaseSpecies.has(sp.baseSpecies)) continue;
		usedBaseSpecies.add(sp.baseSpecies);

		let level = maxLevel;
		if (attempts <= 500) {
			for (let curLevel = minLevel; curLevel <= maxLevel; curLevel++) {
				const gap = maxLevel - curLevel;
				if (sp.evoLevel && curLevel < sp.evoLevel) continue;
				if (gap === 0 || Math.floor(Math.random() * gap) === 0) {
					level = curLevel;
					break;
				}
			}
		} else {
			level = Math.floor(Math.random() * (maxLevel - minLevel)) + minLevel;
		}

		let finalSpecies = sp.id;
		let evo = getLevelUpEvo(finalSpecies);
		while (evo && level >= evo.evoLevel) {
			finalSpecies = evo.evoTo;
			evo = getLevelUpEvo(finalSpecies);
		}

		const finalSp = Dex.species.get(finalSpecies);
		const ability = pickRandomAbility(finalSp.exists ? finalSp : sp);
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
		const item = pickRandomHeldItem(finalSp.name);
		const shiny = Math.floor(Math.random() * 1024) === 69;

		const speciesTypes = finalSp.exists ? (finalSp.types ?? ['Normal']) : ['Normal'];
		const teraType = (Math.floor(Math.random() * 20) === 0)
			? allTypes[Math.floor(Math.random() * allTypes.length)]
			: speciesTypes[Math.floor(Math.random() * speciesTypes.length)];

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

	result.sort((a, b) => a.level - b.level);
	return result;
}

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

export function packPokemon(mon: PokemonEntry): string {
	if ((mon.currentHp ?? 100) <= 0) {
		const speciesDataFainted = Dex.species.get(toID(mon.species));
		const nameFainted = speciesDataFainted.exists ? speciesDataFainted.name : mon.species;
		const abilitiesFainted = speciesDataFainted.abilities ?? {};
		const abilityFainted = (abilitiesFainted as unknown as Record<string, string>)['0'] || '';
		if (!mon.moves) mon.moves = getLevelUpMoves(toID(mon.species), mon.level);
		const movesFainted = mon.moves.join(',');
		const itemFainted = mon.heldItem ?? '';
		return `${nameFainted}||${itemFainted}|${abilityFainted}|${movesFainted}|Hardy||M|||${mon.level}|`;
	}

	const speciesData = Dex.species.get(toID(mon.species));
	const name = speciesData.exists ? speciesData.name : mon.species;

	const abilities = speciesData.abilities ?? {};
	const ability = (abilities as unknown as Record<string, string>)['0'] || '';

	if (!mon.moves) mon.moves = getLevelUpMoves(toID(mon.species), mon.level);
	const movesStr = mon.moves.join(',');

	const item = mon.heldItem ?? '';

	const hp = mon.currentHp ?? 100;
	const status = mon.status ?? '';

	let tail = '';
	if (hp !== 100 || status) {
		tail = `,,,,,,${hp !== 100 ? hp : ''},${status}`;
		if (!status) tail = tail.replace(/,$/, '');
	}

	return `${name}||${item}|${ability}|${movesStr}|Hardy||M|||${mon.level}|${tail}`;
}

export function packAIPokemon(set: AIPokemonSet): string {
	const speciesData = Dex.species.get(toID(set.species));
	const name = speciesData.exists ? speciesData.name : set.species;

	const ivStr = `${set.ivs.hp},${set.ivs.atk},${set.ivs.def},${set.ivs.spa},${set.ivs.spd},${set.ivs.spe}`;
	const evStr = `${set.evs.hp},${set.evs.atk},${set.evs.def},${set.evs.spa},${set.evs.spd},${set.evs.spe}`;
	const movesStr = set.moves.join(',');
	const shinyStr = set.shiny ? 'S' : '';

	return `${name}||${set.item}|${set.ability}|${movesStr}|${set.nature}|${evStr}|${set.gender}|${ivStr}|${shinyStr}|${set.level}|,,,${set.teraType}`;
}

export function packTeam(mons: PokemonEntry[]): string {
	return mons.map(m => packPokemon(m)).join(']');
}

export function packAITeam(sets: AIPokemonSet[]): string {
	return sets.map(s => packAIPokemon(s)).join(']');
}
