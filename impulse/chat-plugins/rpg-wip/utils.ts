// Pokemon RPG Utility Functions
import type { RPGPokemon, PlayerData, InventoryItem, Stats } from './types';
import { ITEMS_DATABASE, NATURES, NATURE_LIST } from './constants';
import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import { isCustomMove, getCustomMove } from './CUSTOM_MOVES';

/**
 * Calculate total experience required for a Pokemon to reach a specific level
 */
export function calculateTotalExpForLevel(growthRate: string, level: number): number {
	const n = level;
	switch (growthRate) {
	case 'Slow':
		return Math.floor((5 * n ** 3) / 4);
	case 'Medium Fast':
		return Math.floor(n ** 3);
	case 'Fast':
		return Math.floor((4 * n ** 3) / 5);
	case 'Medium Slow':
		return Math.floor(((6 / 5) * n ** 3) - (15 * n ** 2) + (100 * n) - 140);
	case 'Erratic':
		if (n <= 50) return Math.floor((n ** 3 * (100 - n)) / 50);
		if (n <= 68) return Math.floor((n ** 3 * (150 - n)) / 100);
		if (n <= 98) return Math.floor((n ** 3 * Math.floor((1911 - 10 * n) / 3)) / 500);
		return Math.floor((n ** 3 * (160 - n)) / 100);
	case 'Fluctuating':
		if (n <= 15) return Math.floor(n ** 3 * ((Math.floor((n + 1) / 3) + 24) / 50));
		if (n <= 36) return Math.floor(n ** 3 * ((n + 14) / 50));
		return Math.floor(n ** 3 * ((Math.floor(n / 2) + 32) / 50));
	default:
		return Math.floor(n ** 3);
	}
}

/**
 * Generate a unique ID for Pokemon, items, etc.
 */
export function generateUniqueId(): string {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

/**
 * Calculate Pokemon stats based on base stats, level, nature, IVs, and EVs
 */
export function calculateStats(species: any, level: number, nature: string, ivs: any, evs: any): Stats {
	const stats: Stats = { maxHp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	stats.maxHp = Math.floor(((2 * species.baseStats.hp + ivs.hp + Math.floor(evs.hp / 4)) * level) / 100) + level + 10;
	stats.atk = Math.floor(((2 * species.baseStats.atk + ivs.atk + Math.floor(evs.atk / 4)) * level) / 100) + 5;
	stats.def = Math.floor(((2 * species.baseStats.def + ivs.def + Math.floor(evs.def / 4)) * level) / 100) + 5;
	stats.spa = Math.floor(((2 * species.baseStats.spa + ivs.spa + Math.floor(evs.spa / 4)) * level) / 100) + 5;
	stats.spd = Math.floor(((2 * species.baseStats.spd + ivs.spd + Math.floor(evs.spd / 4)) * level) / 100) + 5;
	stats.spe = Math.floor(((2 * species.baseStats.spe + ivs.spe + Math.floor(evs.spe / 4)) * level) / 100) + 5;
	const natureEffect = NATURES[nature];
	if (natureEffect) {
		stats[natureEffect.plus] = Math.floor(stats[natureEffect.plus] * 1.1);
		stats[natureEffect.minus] = Math.floor(stats[natureEffect.minus] * 0.9);
	}
	return stats;
}

/**
 * Create a new Pokemon with random IVs, nature, and learned moves
 */
export function createPokemon(speciesId: string, level = 5): RPGPokemon {
	const species = Dex.species.get(speciesId);
	if (!species.exists) throw new Error('Pokemon ' + speciesId + ' not found');

	// Determine Gender
	let gender: 'M' | 'F' | 'N' = 'N';
	if (species.genderRatio) {
		gender = Math.random() < species.genderRatio.M ? 'M' : 'F';
	} else if (species.gender === 'M' || species.gender === 'F' || species.gender === 'N') {
		gender = species.gender;
	}

	const randomNature = NATURE_LIST[Math.floor(Math.random() * NATURE_LIST.length)];
	const ivs = { hp: Math.floor(Math.random() * 32), atk: Math.floor(Math.random() * 32), def: Math.floor(Math.random() * 32), spa: Math.floor(Math.random() * 32), spd: Math.floor(Math.random() * 32), spe: Math.floor(Math.random() * 32) };
	const evs = { hp: 0, atk: 0, def: 0, spa: 0, spd: 0, spe: 0 };
	const stats = calculateStats(species, level, randomNature, ivs, evs);
	let availableMoves: string[] = ['tackle', 'growl'];
	const manualLearnset = MANUAL_LEARNSETS[toID(speciesId)];

	if (manualLearnset?.levelup) {
		const learnedMoves: string[] = [];
		for (const learnableMove of manualLearnset.levelup) {
			if (learnableMove.level <= level) {
				learnedMoves.push(toID(learnableMove.move));
			}
		}
		if (learnedMoves.length > 0) availableMoves = [...new Set(learnedMoves)].slice(-4);
	} else {
		try {
			const learnset = species.learnset;
			if (learnset) {
				const learnedMoves: { move: string, level: number }[] = [];
				for (const moveId in learnset) {
					// @ts-expect-error - PS learnset format can be complex
					for (const learnMethod of learnset[moveId]) {
						if (learnMethod.startsWith('8L')) {
							const learnLevel = parseInt(learnMethod.substring(2));
							if (learnLevel > 0 && learnLevel <= level) {
								learnedMoves.push({ move: moveId, level: learnLevel });
							}
						}
					}
				}

				if (learnedMoves.length > 0) {
					learnedMoves.sort((a, b) => a.level - b.level);
					availableMoves = [...new Set(learnedMoves.map(m => m.move))].slice(-4);
				}
			}
		} catch (e) {
			console.error(`Error processing learnset for ${speciesId}:`, e);
		}
	}

	const movesWithPP = availableMoves.map(moveId => {
		const moveData = getMove(moveId);
		return { id: moveId, pp: moveData.pp || 5 };
	});

	let heldItem: string | undefined = undefined;
	const possibleItems = ['oranberry', 'sitrusberry', 'leftovers', 'rockyhelmet', 'chopleberry', 'yacheberry', 'keberry', 'marangaberry', 'stickybarb', 'toxicorb'];
	if (Math.random() < 0.1) {
		heldItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
	}

	const abilities = Object.values(species.abilities);
	const randomAbility = abilities.length ? abilities[Math.floor(Math.random() * abilities.length)] : 'No Ability';
	const growthRate = species.growthRate;
	return {
		species: species.name,
		nickname: species.name, // Defaults to species name
		level,
		hp: stats.maxHp,
		growthRate,
		experience: calculateTotalExpForLevel(growthRate, level),
		expToNextLevel: calculateTotalExpForLevel(growthRate, level + 1),
		moves: movesWithPP,
		ability: randomAbility,
		nature: randomNature,
		item: heldItem,
		id: generateUniqueId(),
		ivs,
		evs,
		status: null,
		weightkg: species.weightkg,
		heightm: species.heightm,
		friendship: species.baseFriendship || 70,
		gender,
		shiny: Math.random() < 1 / 4096,
		caughtIn: 'pokeball', // Default for starters/gifts, will be overwritten for wild catches
		form: species.forme,
		...stats,
	};
}

/**
 * Add an item to the player's inventory
 */
export function addItemToInventory(player: PlayerData, itemId: string, quantity: number): boolean {
	const itemData = ITEMS_DATABASE[itemId];
	if (!itemData) return false;
	if (player.inventory.has(itemId)) {
		player.inventory.get(itemId)!.quantity += quantity;
	} else {
		player.inventory.set(itemId, { ...itemData, quantity });
	}
	return true;
}

/**
 * Remove an item from the player's inventory
 */
export function removeItemFromInventory(player: PlayerData, itemId: string, quantity: number): boolean {
	if (!player.inventory.has(itemId)) return false;
	const item = player.inventory.get(itemId)!;
	if (item.quantity < quantity) return false;
	item.quantity -= quantity;
	if (item.quantity === 0) {
		player.inventory.delete(itemId);
	}
	return true;
}

/**
 * Store a Pokemon in the PC
 */
export function storePokemonInPC(player: PlayerData, pokemon: RPGPokemon): void {
	player.pc.set(pokemon.id, pokemon);
}

/**
 * Withdraw a Pokemon from the PC
 */
export function withdrawPokemonFromPC(player: PlayerData, pokemonId: string): RPGPokemon | null {
	const pokemon = player.pc.get(pokemonId);
	if (pokemon) {
		player.pc.delete(pokemonId);
		return pokemon;
	}
	return null;
}

/**
 * Get the stat multiplier for a given stat stage
 */
export function getStatMultiplier(stage: number): number {
	if (stage >= 0) {
		return (2 + stage) / 2;
	} else {
		return 2 / (2 - Math.abs(stage));
	}
}

/**
 * Get a move from either Dex or Custom Moves
 * This wrapper function checks custom moves first, then falls back to Dex
 */
export function getMove(moveId: string): any {
	// Check if it's a custom move
	if (isCustomMove(moveId)) {
		const customMove = getCustomMove(moveId);
		// Add exists property for compatibility
		return { ...customMove, exists: true };
	}

	// Otherwise get from Dex
	return Dex.moves.get(moveId);
}
