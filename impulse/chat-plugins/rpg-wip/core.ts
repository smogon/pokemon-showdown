/*
* Pokemon Showdown
* RPG Core
*
* This is the main entry point for the RPG.
* It manages global state (playerData, activeBattles)
* and exports core, non-battle functions.
* It also exports the commands from commands.ts to be used by Showdown.
*/

import { MANUAL_LEARNSETS } from './MANUAL_LEARNSETS';
import { Dex, toID } from '../../../sim/dex';
import { calculateTotalExpForLevel, calculateStats, getMove, NATURE_LIST } from './utils';
import type { PlayerData, RPGPokemon, Stats, BattleState } from './interface';
import { addItemToInventory } from './items';
import { getStartingLocation } from './locations';
import { ImpulseDB } from '../../impulse-db';
import { TOTAL_BADGES } from './badges';

export const playerData = new Map<string, PlayerData>();
export const activeBattles = new Map<string, BattleState>();

export function generateUniqueId(): string {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getPlayerData(userid: string): PlayerData {
	if (!playerData.has(userid)) {
		const startingLocation = getStartingLocation();
		const newPlayer: PlayerData = {
			id: userid,
			name: userid,
			level: 1,
			experience: 0,
			badges: 0,
			party: [],
			location: startingLocation.name,
			money: 5000000,
			inventory: new Map(),
			pc: new Map(),
			storyFlags: new Set(),
			defeatedTrainers: new Set(),
			obtainedBadges: [],
			visitedLocations: new Set([startingLocation.name]),
			lastPokemonCenter: startingLocation.id,
			completedNPCActions: new Set(),
		};
		addItemToInventory(newPlayer, 'pokeball', 5);
		addItemToInventory(newPlayer, 'potion', 3);
		playerData.set(userid, newPlayer);
	}
	return playerData.get(userid)!;
}

export function getInitialMoves(speciesId: string, level: number): { id: string, pp: number }[] {
	let availableMoves: string[] = ['tackle', 'growl'];
	const species = Dex.species.get(speciesId);

	const manualLearnset = MANUAL_LEARNSETS[toID(speciesId)];
	if (manualLearnset?.levelup) {
		const learnedMoves: string[] = [];
		for (const learnableMove of manualLearnset.levelup) {
			if (learnableMove.level <= level) {
				learnedMoves.push(toID(learnableMove.move));
			}
		}
		if (learnedMoves.length > 0) {
			availableMoves = [...new Set(learnedMoves)].slice(-4);
		}
	} else {
		try {
			const learnset = species.learnset;
			if (learnset) {
				const learnedMoves: { move: string, level: number }[] = [];
				for (const moveId in learnset) {
					for (const learnMethod of learnset[moveId]) {
						if (learnMethod.startsWith('9L')) { // Changed from '8L' to '9L' for Gen 9
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

	return movesWithPP;
}

export function createPokemon(speciesId: string, level = 5): RPGPokemon {
	const species = Dex.species.get(speciesId);
	if (!species.exists) throw new Error('Pokemon ' + speciesId + ' not found');

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

	const movesWithPP = getInitialMoves(speciesId, level);

	const abilities = Object.values(species.abilities);
	const randomAbility = abilities.length ? abilities[Math.floor(Math.random() * abilities.length)] : 'No Ability';

	let heldItem: string | undefined = undefined;
	const possibleItems = ['oranberry', 'sitrusberry', 'leftovers', 'rockyhelmet', 'chopleberry', 'yacheberry', 'keberry', 'marangaberry', 'stickybarb', 'toxicorb'];
	if (Math.random() < 0.1) {
		heldItem = possibleItems[Math.floor(Math.random() * possibleItems.length)];
	}

	const growthRate = species.growthRate;
	const teraType = species.types[0];
	return {
		species: species.name,
		nickname: species.name,
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
		caughtIn: 'pokeball',
		form: species.forme,
		teraType,
		...stats,
	};
}

export function storePokemonInPC(player: PlayerData, pokemon: RPGPokemon): void {
	player.pc.set(pokemon.id, pokemon);
}

export function withdrawPokemonFromPC(player: PlayerData, pokemonId: string): RPGPokemon | null {
	const pokemon = player.pc.get(pokemonId);
	if (pokemon) {
		player.pc.delete(pokemonId);
		return pokemon;
	}
	return null;
}

/**
 * Serialize player data to JSON-compatible format
 * Converts Maps and Sets to arrays for storage
 */
export function serializePlayerData(player: PlayerData): any {
	return {
		id: player.id,
		name: player.name,
		level: player.level,
		experience: player.experience,
		badges: player.badges,
		party: player.party,
		location: player.location,
		money: player.money,
		inventory: Array.from(player.inventory.entries()),
		pc: Array.from(player.pc.entries()),
		storyFlags: Array.from(player.storyFlags),
		defeatedTrainers: Array.from(player.defeatedTrainers),
		obtainedBadges: player.obtainedBadges,
		visitedLocations: Array.from(player.visitedLocations),
		pendingMoveLearnQueue: player.pendingMoveLearnQueue,
		lastPokemonCenter: player.lastPokemonCenter,
		completedNPCActions: Array.from(player.completedNPCActions),
	};
}

/**
 * Deserialize player data from JSON format
 * Converts arrays back to Maps and Sets
 */
export function deserializePlayerData(data: any): PlayerData {
	// Validate required fields exist
	if (!data || typeof data !== 'object') {
		throw new Error('Invalid save data format');
	}
	if (!data.id || typeof data.id !== 'string') {
		throw new Error('Invalid save data: missing or invalid user ID');
	}
	if (!data.name || typeof data.name !== 'string') {
		throw new Error('Invalid save data: missing or invalid name');
	}
	if (typeof data.level !== 'number' || data.level < 1 || data.level > 100) {
		throw new Error('Invalid save data: level must be between 1 and 100');
	}
	if (typeof data.badges !== 'number' || data.badges < 0 || data.badges > TOTAL_BADGES) {
		throw new Error(`Invalid save data: badges must be between 0 and ${TOTAL_BADGES}`);
	}
	if (!Array.isArray(data.party)) {
		throw new Error('Invalid save data: party must be an array');
	}
	if (data.party.length > 6) {
		throw new Error('Invalid save data: party cannot have more than 6 Pokemon');
	}
	if (typeof data.money !== 'number' || data.money < 0 || data.money > 999999999) {
		throw new Error('Invalid save data: money must be between 0 and 999999999');
	}

	// Validate inventory
	if (!Array.isArray(data.inventory)) {
		throw new Error('Invalid save data: inventory must be an array');
	}
	for (const [itemId, itemData] of data.inventory) {
		if (typeof itemId !== 'string') {
			throw new Error('Invalid save data: item ID must be a string');
		}
		if (!itemData || typeof itemData !== 'object') {
			throw new Error('Invalid save data: invalid item data');
		}
		if (typeof itemData.quantity !== 'number' || itemData.quantity < 0 || itemData.quantity > 999) {
			throw new Error('Invalid save data: item quantity must be between 0 and 999');
		}
	}

	// Validate PC storage
	if (!Array.isArray(data.pc)) {
		throw new Error('Invalid save data: PC must be an array');
	}
	if (data.pc.length > 100) {
		throw new Error('Invalid save data: PC cannot have more than 100 Pokemon');
	}

	// Validate obtainedBadges
	if (!Array.isArray(data.obtainedBadges)) {
		throw new Error('Invalid save data: obtainedBadges must be an array');
	}
	if (data.obtainedBadges.length !== data.badges) {
		throw new Error('Invalid save data: obtainedBadges length must match badges count');
	}
	if (data.obtainedBadges.length > TOTAL_BADGES) {
		throw new Error(`Invalid save data: cannot have more than ${TOTAL_BADGES} badges`);
	}

	// Validate Pokemon in party
	for (const pokemon of data.party) {
		if (!pokemon || typeof pokemon !== 'object') {
			throw new Error('Invalid save data: invalid Pokemon in party');
		}
		if (!pokemon.species || typeof pokemon.species !== 'string') {
			throw new Error('Invalid save data: Pokemon missing species');
		}
		// Check if species exists in the Dex
		const species = Dex.species.get(pokemon.species);
		if (!species.exists) {
			throw new Error(`Invalid save data: Pokemon species "${pokemon.species}" does not exist`);
		}
		if (typeof pokemon.level !== 'number' || pokemon.level < 1 || pokemon.level > 100) {
			throw new Error('Invalid save data: Pokemon level must be between 1 and 100');
		}
		if (typeof pokemon.hp !== 'number' || pokemon.hp < 0) {
			throw new Error('Invalid save data: Pokemon HP cannot be negative');
		}
		if (typeof pokemon.maxHp !== 'number' || pokemon.maxHp < 1 || pokemon.maxHp > 9999) {
			throw new Error('Invalid save data: Pokemon maxHp must be between 1 and 9999');
		}
		if (pokemon.hp > pokemon.maxHp) {
			throw new Error('Invalid save data: Pokemon HP cannot exceed maxHp');
		}
		// Validate stats are within reasonable bounds
		if (pokemon.stats) {
			const statKeys = ['atk', 'def', 'spa', 'spd', 'spe'];
			for (const stat of statKeys) {
				if (pokemon.stats[stat] !== undefined) {
					if (typeof pokemon.stats[stat] !== 'number' || pokemon.stats[stat] < 1 || pokemon.stats[stat] > 9999) {
						throw new Error(`Invalid save data: Pokemon ${stat} stat must be between 1 and 9999`);
					}
				}
			}
		}
		// Validate IVs
		if (pokemon.ivs) {
			const ivKeys = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
			for (const iv of ivKeys) {
				if (pokemon.ivs[iv] !== undefined) {
					if (typeof pokemon.ivs[iv] !== 'number' || pokemon.ivs[iv] < 0 || pokemon.ivs[iv] > 31) {
						throw new Error(`Invalid save data: Pokemon ${iv} IV must be between 0 and 31`);
					}
				}
			}
		}
		// Validate EVs
		if (pokemon.evs) {
			const evKeys = ['hp', 'atk', 'def', 'spa', 'spd', 'spe'];
			let totalEVs = 0;
			for (const ev of evKeys) {
				if (pokemon.evs[ev] !== undefined) {
					if (typeof pokemon.evs[ev] !== 'number' || pokemon.evs[ev] < 0 || pokemon.evs[ev] > 252) {
						throw new Error(`Invalid save data: Pokemon ${ev} EV must be between 0 and 252`);
					}
					totalEVs += pokemon.evs[ev];
				}
			}
			if (totalEVs > 510) {
				throw new Error('Invalid save data: Pokemon total EVs cannot exceed 510');
			}
		}
		// Validate moves
		if (!Array.isArray(pokemon.moves)) {
			throw new Error('Invalid save data: Pokemon moves must be an array');
		}
		if (pokemon.moves.length > 4) {
			throw new Error('Invalid save data: Pokemon cannot have more than 4 moves');
		}
		for (const move of pokemon.moves) {
			if (!move || typeof move !== 'object') {
				throw new Error('Invalid save data: invalid move data');
			}
			if (!move.id || typeof move.id !== 'string') {
				throw new Error('Invalid save data: move missing ID');
			}
			// Check if move exists
			const moveData = getMove(move.id);
			if (!moveData.exists) {
				throw new Error(`Invalid save data: Move "${move.id}" does not exist`);
			}
			if (typeof move.pp !== 'number' || move.pp < 0 || move.pp > 64) {
				throw new Error('Invalid save data: move PP must be between 0 and 64');
			}
		}
		// Validate held item if present
		if (pokemon.item) {
			if (typeof pokemon.item !== 'string') {
				throw new Error('Invalid save data: Pokemon held item must be a string');
			}
		}
		// Validate ability if present
		if (pokemon.ability) {
			if (typeof pokemon.ability !== 'string') {
				throw new Error('Invalid save data: Pokemon ability must be a string');
			}
		}
		// Validate nature if present
		if (pokemon.nature) {
			if (typeof pokemon.nature !== 'string') {
				throw new Error('Invalid save data: Pokemon nature must be a string');
			}
		}
	}

	// Validate Pokemon in PC
	for (const [pcId, pokemon] of data.pc) {
		if (!pokemon || typeof pokemon !== 'object') {
			throw new Error('Invalid save data: invalid Pokemon in PC');
		}
		// Apply same validations as party Pokemon
		if (!pokemon.species || typeof pokemon.species !== 'string') {
			throw new Error('Invalid save data: PC Pokemon missing species');
		}
		const species = Dex.species.get(pokemon.species);
		if (!species.exists) {
			throw new Error(`Invalid save data: PC Pokemon species "${pokemon.species}" does not exist`);
		}
		if (typeof pokemon.level !== 'number' || pokemon.level < 1 || pokemon.level > 100) {
			throw new Error('Invalid save data: PC Pokemon level must be between 1 and 100');
		}
		if (typeof pokemon.maxHp !== 'number' || pokemon.maxHp < 1 || pokemon.maxHp > 9999) {
			throw new Error('Invalid save data: PC Pokemon maxHp must be between 1 and 9999');
		}
	}

	return {
		id: data.id,
		name: data.name,
		level: data.level,
		experience: data.experience,
		badges: data.badges,
		party: data.party,
		location: data.location,
		money: data.money,
		inventory: new Map(data.inventory),
		pc: new Map(data.pc),
		storyFlags: new Set(data.storyFlags || []),
		defeatedTrainers: new Set(data.defeatedTrainers || []),
		obtainedBadges: data.obtainedBadges || [],
		visitedLocations: new Set(data.visitedLocations || [data.location]),
		// Migrate old single-object format to new array format
		pendingMoveLearnQueue: data.pendingMoveLearnQueue ?
			(Array.isArray(data.pendingMoveLearnQueue) ?
				data.pendingMoveLearnQueue :
				[data.pendingMoveLearnQueue]) :
			undefined,
		lastPokemonCenter: data.lastPokemonCenter || 'startertown',
		completedNPCActions: new Set(data.completedNPCActions || []),
	};
}

/**
 * Save player data to a JSON string
 * Can be stored in a database or file
 */
export function savePlayerToString(player: PlayerData): string {
	const serialized = serializePlayerData(player);
	return JSON.stringify(serialized);
}

/**
 * Load player data from a JSON string
 * Returns the deserialized PlayerData
 */
export function loadPlayerFromString(jsonString: string): PlayerData {
	const data = JSON.parse(jsonString);
	return deserializePlayerData(data);
}

/**
 * Load player data into the game
 * Replaces existing data for the user
 */
export function loadPlayer(userid: string, savedData: string): PlayerData {
	const player = loadPlayerFromString(savedData);
	player.id = userid; // Ensure ID matches current user
	playerData.set(userid, player);
	return player;
}

/**
 * Save player data to ImpulseDB (MongoDB)
 * @param player - Player data to save
 * @returns Promise that resolves when save is complete
 */
export async function savePlayerToDB(player: PlayerData): Promise<void> {
	const collection = ImpulseDB('rpg_saves');
	const serialized = serializePlayerData(player);

	// Add timestamp for tracking
	const saveDocument = {
		...serialized,
		lastSaved: new Date(),
	};

	// Upsert: update if exists, insert if doesn't
	await collection.upsert(
		{ id: player.id },
		saveDocument
	);
}

/**
 * Load player data from ImpulseDB (MongoDB)
 * @param userid - User ID to load data for
 * @returns Promise that resolves to PlayerData or null if not found
 */
export async function loadPlayerFromDB(userid: string): Promise<PlayerData | null> {
	const collection = ImpulseDB('rpg_saves');
	const savedData = await collection.findOne({ id: userid });

	if (!savedData) {
		return null;
	}

	const player = deserializePlayerData(savedData);
	playerData.set(userid, player);
	return player;
}

/**
 * Delete player data from ImpulseDB (MongoDB)
 * @param userid - User ID to delete data for
 * @returns Promise that resolves when deletion is complete
 */
export async function deletePlayerFromDB(userid: string): Promise<boolean> {
	const collection = ImpulseDB('rpg_saves');
	const result = await collection.deleteOne({ id: userid });
	return result.deletedCount > 0;
}

/**
 * Check if a save exists in ImpulseDB for a user
 * @param userid - User ID to check
 * @returns Promise that resolves to true if save exists
 */
export async function hasSaveInDB(userid: string): Promise<boolean> {
	const collection = ImpulseDB('rpg_saves');
	return await collection.exists({ id: userid });
}

// Export the commands from the new commands.ts file
// This is what the Showdown server will import.
import { commands } from './commands';
export { commands };
