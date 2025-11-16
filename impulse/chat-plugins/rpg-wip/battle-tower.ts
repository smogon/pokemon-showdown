/*
* Pokemon Showdown
* RPG Battle Tower Module
*
* This file contains all Battle Tower related logic including:
* - Format configuration
* - Team generation functions
* - Battle Tower specific types and interfaces
*/

import { Dex, toID } from '../../../sim/dex';
import { FS } from '../../../lib';
import type { RPGPokemon } from './interface';
import { getMove, calculateStats, generateRandomTeam } from './utils';
import { createPokemon } from './core';

/**
 * Battle Tower Format Configuration
 * Defines the rules and settings for different Battle Tower formats
 */
export interface BattleTowerFormatConfig {
	id: string;
	name: string;
	description: string;
	level: number; // Pokemon level for this format (may be overridden by set data)
	teamSize: number;
	teamGeneration: 'bss' | 'random' | 'baby'; // Team generation method
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

/**
 * Type definitions for BSS Factory Sets
 */
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

// Cache for BSS factory sets to avoid reading the file multiple times
let bssFactorySetsCache: BSSFactoryData | null = null;

/**
 * Loads the BSS Factory Sets from the JSON file.
 * @returns The BSS Factory Sets data
 */
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

/**
 * Weighted random selection helper
 */
function weightedRandom<T extends { weight: number }>(items: T[]): T {
	const totalWeight = items.reduce((sum, item) => sum + item.weight, 0);
	let random = Math.random() * totalWeight;

	for (const item of items) {
		random -= item.weight;
		if (random <= 0) return item;
	}

	return items[items.length - 1]; // Fallback
}

/**
 * Generates a random team using BSS Factory Sets for the Battle Tower.
 * This provides competitive, battle-tested movesets and spreads.
 *
 * @param count The number of Pokémon in the team.
 * @param level The level for all Pokémon in the team.
 * @returns An array of randomly generated RPGPokemon using BSS factory sets.
 */
export function generateRandomTeamFromBSS(count: number, level: number): RPGPokemon[] {
	const bssData = loadBSSFactorySets();

	// Fallback to old method if BSS data is unavailable
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

	// Track selected species to avoid duplicates
	const usedSpecies = new Set<string>();

	while (team.length < count) {
		// Select a random species using weighted selection
		const availableSpecies = speciesEntries.filter(([speciesId]) => !usedSpecies.has(speciesId));

		if (availableSpecies.length === 0) {
			// If we've used all species, allow duplicates for larger teams
			usedSpecies.clear();
		}

		const speciesWeights = availableSpecies.map(([_, data]) => ({
			entry: _,
			weight: data.weight,
		}));

		const selectedSpecies = weightedRandom(speciesWeights);
		const [speciesId, speciesData] = availableSpecies.find(([id]) => id === selectedSpecies.entry)!;

		// Select a random set from this species using weighted selection
		const selectedSet = weightedRandom(speciesData.sets);

		// Create the Pokémon
		const pokemon = createPokemon(speciesId, level);

		// Apply EVs from the set
		pokemon.evs = {
			hp: selectedSet.evs.hp || 0,
			atk: selectedSet.evs.atk || 0,
			def: selectedSet.evs.def || 0,
			spa: selectedSet.evs.spa || 0,
			spd: selectedSet.evs.spd || 0,
			spe: selectedSet.evs.spe || 0,
		};

		// Apply nature
		pokemon.nature = selectedSet.nature;

		// Apply ability (randomly select from available abilities)
		if (selectedSet.ability.length > 0) {
			pokemon.ability = selectedSet.ability[Math.floor(Math.random() * selectedSet.ability.length)];
		}

		// Apply item (randomly select from available items)
		if (selectedSet.item.length > 0) {
			pokemon.item = selectedSet.item[Math.floor(Math.random() * selectedSet.item.length)].toLowerCase().replace(/[^a-z0-9]/g, '');
		}

		// Apply moves (randomly select one move from each slot)
		const moves: { id: string, pp: number }[] = [];
		for (const moveSlot of selectedSet.moves) {
			if (moveSlot.length > 0) {
				const selectedMove = moveSlot[Math.floor(Math.random() * moveSlot.length)];
				const moveId = toID(selectedMove);
				const moveData = getMove(moveId);
				if (moveData?.exists) {
					moves.push({ id: moveId, pp: moveData.pp || 10 });
				}
			}
		}

		// Ensure at least one move
		if (moves.length === 0) {
			const tackle = getMove('tackle');
			moves.push({ id: 'tackle', pp: tackle.pp || 35 });
		}

		pokemon.moves = moves;

		// Apply Tera Type (randomly select from available types)
		if (selectedSet.teraType.length > 0) {
			pokemon.teraType = selectedSet.teraType[Math.floor(Math.random() * selectedSet.teraType.length)];
		}

		// Recalculate stats with new EVs and nature
		const dexSpecies = Dex.species.get(pokemon.species);
		const newStats = calculateStats(dexSpecies, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

		pokemon.maxHp = newStats.maxHp;
		pokemon.hp = newStats.maxHp;
		pokemon.atk = newStats.atk;
		pokemon.def = newStats.def;
		pokemon.spa = newStats.spa;
		pokemon.spd = newStats.spd;
		pokemon.spe = newStats.spe;

		// Add to team and mark species as used
		team.push(pokemon);
		usedSpecies.add(speciesId);
	}

	return team;
}

/**
 * Type definitions for Gen9 Baby (Little Cup) Sets
 */
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

// Cache for gen9baby sets to avoid reading the file multiple times
let babySetsCache: BabyData | null = null;

/**
 * Loads the Gen9 Baby Sets from the JSON file.
 * @returns The Gen9 Baby Sets data
 */
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

/**
 * Generates a random team using Gen9 Baby Sets for the Battle Tower Little Cup format.
 * This provides Little Cup-viable Pokémon with appropriate movesets.
 * Each Pokemon uses the level specified in its set data from gen9baby/sets.json.
 *
 * @param count The number of Pokémon in the team.
 * @returns An array of randomly generated RPGPokemon using Baby sets.
 */
export function generateRandomTeamFromBaby(count: number): RPGPokemon[] {
	const babyData = loadBabySets();

	// Fallback to old method if Baby data is unavailable
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

	// Track selected species to avoid duplicates
	const usedSpecies = new Set<string>();

	while (team.length < count) {
		// Select a random species
		const availableSpecies = speciesEntries.filter(([speciesId]) => !usedSpecies.has(speciesId));

		if (availableSpecies.length === 0) {
			// If we've used all species, allow duplicates for larger teams
			usedSpecies.clear();
		}

		const [speciesId, speciesData] = availableSpecies[Math.floor(Math.random() * availableSpecies.length)];

		// Select a random set from this species
		const selectedSet = speciesData.sets[Math.floor(Math.random() * speciesData.sets.length)];

		// Create the Pokémon using the level from the set data
		const pokemon = createPokemon(speciesId, speciesData.level);

		// Apply ability (randomly select from available abilities)
		if (selectedSet.abilities.length > 0) {
			pokemon.ability = selectedSet.abilities[Math.floor(Math.random() * selectedSet.abilities.length)];
		}

		// Apply moves (randomly select 4 moves from the movepool)
		const moves: { id: string, pp: number }[] = [];
		const movepool = [...selectedSet.movepool]; // Copy movepool

		// Shuffle and select up to 4 moves
		for (let i = 0; i < Math.min(4, movepool.length); i++) {
			const randomIndex = Math.floor(Math.random() * movepool.length);
			const selectedMove = movepool.splice(randomIndex, 1)[0];
			const moveId = toID(selectedMove);
			const moveData = getMove(moveId);
			if (moveData?.exists) {
				moves.push({ id: moveId, pp: moveData.pp || 10 });
			}
		}

		// Ensure at least one move
		if (moves.length === 0) {
			const tackle = getMove('tackle');
			moves.push({ id: 'tackle', pp: tackle.pp || 35 });
		}

		pokemon.moves = moves;

		// Apply Tera Type (randomly select from available types)
		if (selectedSet.teraTypes.length > 0) {
			pokemon.teraType = selectedSet.teraTypes[Math.floor(Math.random() * selectedSet.teraTypes.length)];
		}

		// Little Cup typically uses basic stats, so we keep default EVs/IVs/nature
		// Recalculate stats in case createPokemon modified anything
		const dexSpecies = Dex.species.get(pokemon.species);
		const newStats = calculateStats(dexSpecies, pokemon.level, pokemon.nature, pokemon.ivs, pokemon.evs);

		pokemon.maxHp = newStats.maxHp;
		pokemon.hp = newStats.maxHp;
		pokemon.atk = newStats.atk;
		pokemon.def = newStats.def;
		pokemon.spa = newStats.spa;
		pokemon.spd = newStats.spd;
		pokemon.spe = newStats.spe;

		// Add to team and mark species as used
		team.push(pokemon);
		usedSpecies.add(speciesId);
	}

	return team;
}
