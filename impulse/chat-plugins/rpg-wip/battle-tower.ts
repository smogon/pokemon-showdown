import { Dex, toID } from '../../../sim/dex';
import { FS } from '../../../lib';
import type { RPGPokemon } from './interface';
import { getMove, calculateStats, generateRandomTeam } from './utils';
import { createPokemon } from './core';

export interface BattleTowerFormatConfig {
	id: string;
	name: string;
	description: string;
	level: number;
	teamSize: number;
	teamGeneration: 'bss' | 'random' | 'baby';
}

export const BATTLE_TOWER_FORMATS: Record<string, BattleTowerFormatConfig> = {
	battlefactory: {
		id: 'battlefactory',
		name: 'Battle Factory',
		description: 'Random team of 3 Level 50 Pokémon with competitive sets',
		level: 50,
		teamSize: 3,
		teamGeneration: 'bss',
	},
	littlecup: {
		id: 'littlecup',
		name: 'Little Cup',
		description: 'Random team of LC-viable Pokémon at their specified levels',
		level: 5,
		teamSize: 3,
		teamGeneration: 'baby',
	},
};

interface BSSFactorySet {
	species: string;
	weight: number;
	moves: string[][];
	item: string[];
	nature: string;
	evs: {
		hp?: number,
		atk?: number,
		def?: number,
		spa?: number,
		spd?: number,
		spe?: number,
	};
	teraType: string[];
	ability: string[];
	wantsTera?: boolean;
}

interface BSSFactorySpecies {
	weight: number;
	sets: BSSFactorySet[];
}

interface BSSFactoryData {
	[speciesId: string]: BSSFactorySpecies;
}

let bssFactorySetsCache: BSSFactoryData | null = null;

function loadBSSFactorySets(): BSSFactoryData | null {
	if (bssFactorySetsCache) return bssFactorySetsCache;

	try {
		const json = FS('data/random-battles/gen9/bss-factory-sets.json').readIfExistsSync();
		if (!json) {
			console.error('[RPG Battle Tower] BSS Factory Sets file not found');
			return null;
		}
		bssFactorySetsCache = JSON.parse(json);
		return bssFactorySetsCache;
	} catch (e: any) {
		console.error('[RPG Battle Tower] Error loading BSS Factory Sets:', e);
		return null;
	}
}

function weightedRandom<T extends { weight: number }>(items: T[]): T {
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
	let random = Math.random() * totalWeight;

	for (const item of items) {
		random -= item.weight;
		if (random <= 0) return item;
	}

	return items[items.length - 1];
}

export function generateRandomTeamFromBSS(count: number, level: number): RPGPokemon[] {
	const bssData = loadBSSFactorySets();

	if (!bssData) {
		console.log('[RPG Battle Tower] BSS Factory Sets not available, falling back to random generation');
		return generateRandomTeam(count, level);
	}

	const team: RPGPokemon[] = [];
	const speciesEntries = Object.entries(bssData);

	if (speciesEntries.length === 0) {
		console.error('[RPG Battle Tower] BSS Factory Sets is empty');
		return generateRandomTeam(count, level);
	}

	const usedSpecies = new Set<string>();

	while (team.length < count) {
		const availableSpecies = speciesEntries.filter(([speciesId]) => !usedSpecies.has(speciesId));

		if (availableSpecies.length === 0) {
			usedSpecies.clear();
		}

		const speciesWeights = availableSpecies.map(([_, data]) => ({
			entry: _,
			weight: data.weight,
		}));

		const selectedSpecies = weightedRandom(speciesWeights);
		const [speciesId, speciesData] = availableSpecies.find(([id]) => id === selectedSpecies.entry)!;

		const selectedSet = weightedRandom(speciesData.sets);

		const pokemon = createPokemon(speciesId, level);

		pokemon.evs = {
			hp: selectedSet.evs.hp || 0,
			atk: selectedSet.evs.atk || 0,
			def: selectedSet.evs.def || 0,
			spa: selectedSet.evs.spa || 0,
			spd: selectedSet.evs.spd || 0,
			spe: selectedSet.evs.spe || 0,
		};

		pokemon.nature = selectedSet.nature;

		if (selectedSet.ability.length > 0) {
			pokemon.ability = selectedSet.ability[Math.floor(Math.random() * selectedSet.ability.length)];
		}

		if (selectedSet.item.length > 0) {
			const randomItem = selectedSet.item[Math.floor(Math.random() * selectedSet.item.length)];
			pokemon.item = randomItem.toLowerCase().replace(/[^a-z0-9]/g, '');
		}

		const moves: { id: string, pp: number }[] = [];
		for (const moveSlot of selectedSet.moves) {
			if (moveSlot.length > 0) {
				const shuffledMoves = [...moveSlot].sort(() => Math.random() - 0.5);
				let addedMove = false;
				for (const moveOption of shuffledMoves) {
					const moveId = toID(moveOption);
					const moveData = getMove(moveId);
					if (moveData?.exists) {
						moves.push({ id: moveId, pp: moveData.pp || 10 });
						addedMove = true;
						break;
					}
				}

				if (!addedMove) {
					const tackle = getMove('tackle');
					moves.push({ id: 'tackle', pp: tackle.pp || 35 });
				}
			}
		}

		if (moves.length === 0) {
			const tackle = getMove('tackle');
			moves.push({ id: 'tackle', pp: tackle.pp || 35 });
		}

		pokemon.moves = moves;

		if (selectedSet.teraType.length > 0) {
			pokemon.teraType = selectedSet.teraType[Math.floor(Math.random() * selectedSet.teraType.length)];
		}

		const dexSpecies = Dex.species.get(pokemon.species);
		const newStats = calculateStats(dexSpecies, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

		pokemon.maxHp = newStats.maxHp;
		pokemon.hp = newStats.maxHp;
		pokemon.atk = newStats.atk;
		pokemon.def = newStats.def;
		pokemon.spa = newStats.spa;
		pokemon.spd = newStats.spd;
		pokemon.spe = newStats.spe;

		team.push(pokemon);
		usedSpecies.add(speciesId);
	}

	return team;
}

interface BabySet {
	role: string;
	movepool: string[];
	abilities: string[];
	teraTypes: string[];
}

interface BabySpecies {
	level: number;
	sets: BabySet[];
}

interface BabyData {
	[speciesId: string]: BabySpecies;
}

let babySetsCache: BabyData | null = null;

function loadBabySets(): BabyData | null {
	if (babySetsCache) return babySetsCache;

	try {
		const json = FS('data/random-battles/gen9baby/sets.json').readIfExistsSync();
		if (!json) {
			console.error('[RPG Battle Tower] Gen9 Baby Sets file not found');
			return null;
		}
		babySetsCache = JSON.parse(json);
		return babySetsCache;
	} catch (e: any) {
		console.error('[RPG Battle Tower] Error loading Gen9 Baby Sets:', e);
		return null;
	}
}

export function generateRandomTeamFromBaby(count: number): RPGPokemon[] {
	const babyData = loadBabySets();

	if (!babyData) {
		console.log('[RPG Battle Tower] Gen9 Baby Sets not available, falling back to random generation');
		return generateRandomTeam(count, 5);
	}

	const team: RPGPokemon[] = [];
	const speciesEntries = Object.entries(babyData);

	if (speciesEntries.length === 0) {
		console.error('[RPG Battle Tower] Gen9 Baby Sets is empty');
		return generateRandomTeam(count, 5);
	}

	const usedSpecies = new Set<string>();

	while (team.length < count) {
		const availableSpecies = speciesEntries.filter(([speciesId]) => !usedSpecies.has(speciesId));

		if (availableSpecies.length === 0) {
			usedSpecies.clear();
		}

		const [speciesId, speciesData] = availableSpecies[Math.floor(Math.random() * availableSpecies.length)];

		const selectedSet = speciesData.sets[Math.floor(Math.random() * speciesData.sets.length)];

		const pokemon = createPokemon(speciesId, speciesData.level);

		if (selectedSet.abilities.length > 0) {
			pokemon.ability = selectedSet.abilities[Math.floor(Math.random() * selectedSet.abilities.length)];
		}

		const moves: { id: string, pp: number }[] = [];
		const movepool = [...selectedSet.movepool];

		while (moves.length < 4 && movepool.length > 0) {
			const randomIndex = Math.floor(Math.random() * movepool.length);
			const selectedMove = movepool.splice(randomIndex, 1)[0];
			const moveId = toID(selectedMove);
			const moveData = getMove(moveId);
			if (moveData?.exists) {
				moves.push({ id: moveId, pp: moveData.pp || 10 });
			}
		}

		if (moves.length === 0) {
			const tackle = getMove('tackle');
			moves.push({ id: 'tackle', pp: tackle.pp || 35 });
		}

		pokemon.moves = moves;

		if (selectedSet.teraTypes.length > 0) {
			pokemon.teraType = selectedSet.teraTypes[Math.floor(Math.random() * selectedSet.teraTypes.length)];
		}

		const dexSpecies = Dex.species.get(pokemon.species);
		const newStats = calculateStats(dexSpecies, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

		pokemon.maxHp = newStats.maxHp;
		pokemon.hp = newStats.maxHp;
		pokemon.atk = newStats.atk;
		pokemon.def = newStats.def;
		pokemon.spa = newStats.spa;
		pokemon.spd = newStats.spd;
		pokemon.spe = newStats.spe;

		team.push(pokemon);
		usedSpecies.add(speciesId);
	}

	return team;
}
