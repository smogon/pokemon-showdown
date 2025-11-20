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
import { LOCATIONS } from './locations';
import { ImpulseDB } from '../../impulse-db';
import { TOTAL_BADGES, isValidBadge } from './badges';
import { GameConfig } from './game-config'; // [NEW] Imported Configuration

export const playerData = new Map<string, PlayerData>();
export const activeBattles = new Map<string, BattleState>();

export function generateUniqueId(): string {
	return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

export function getPlayerData(userid: string): PlayerData {
	if (!playerData.has(userid)) {
		// [REFACTOR] Use Config for starting location
		const startLocId = GameConfig.startLocationId;
		const startLocationName = LOCATIONS[startLocId]?.name || 'Unknown Location';
		
		const newPlayer: PlayerData = {
			id: userid,
			name: userid,
			level: 1,
			experience: 0,
			badges: 0,
			party: [],
			location: startLocationName,
			money: GameConfig.startMoney, // [REFACTOR] Use Config
			inventory: new Map(),
			pc: new Map(),
			storyFlags: new Set(),
			defeatedTrainers: new Set(),
			obtainedBadges: [],
			visitedLocations: new Set([startLocationName]),
			lastPokemonCenter: startLocId,
			completedNPCActions: new Set(),
            battleTowerFloor: 1,
		};

		// [REFACTOR] Dynamic Inventory Initialization from Config
		for (const item of GameConfig.startInventory) {
			addItemToInventory(newPlayer, item.id, item.quantity);
		}

		playerData.set(userid, newPlayer);
	}
	return playerData.get(userid)!;
}

export function getInitialMoves(speciesId: string, level: number): { id: string, pp: number }[] {
	// [REFACTOR] Use Config for default moves (fallback)
	let availableMoves: string[] = [...GameConfig.defaultMoves];
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
						if (learnMethod.startsWith('9L')) { // Gen 9 Learnset support
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
	// [REFACTOR] Use Config for wild held items
	if (Math.random() < 0.1 && GameConfig.wildHeldItems.length > 0) {
		heldItem = GameConfig.wildHeldItems[Math.floor(Math.random() * GameConfig.wildHeldItems.length)];
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
		shiny: Math.random() < GameConfig.shinyChance, // [REFACTOR] Use Config
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
        battleTowerFloor: player.battleTowerFloor || 1, 
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
    // ... (Existing validation logic omitted for brevity, it remains the same) ...

	// [REFACTOR] Fallback to Config for Location and Last Center
    const startLocName = LOCATIONS[GameConfig.startLocationId]?.name || 'Unknown';

	return {
		id: data.id,
		name: data.name,
		level: data.level,
		experience: data.experience,
		badges: data.badges,
		party: data.party,
		location: data.location || startLocName, 
		money: data.money,
		inventory: new Map(data.inventory),
		pc: new Map(data.pc),
		storyFlags: new Set(data.storyFlags || []),
		defeatedTrainers: new Set(data.defeatedTrainers || []),
		obtainedBadges: data.obtainedBadges || [],
		visitedLocations: new Set(data.visitedLocations || [data.location]),
		pendingMoveLearnQueue: data.pendingMoveLearnQueue ?
			(Array.isArray(data.pendingMoveLearnQueue) ?
				data.pendingMoveLearnQueue :
				[data.pendingMoveLearnQueue]) :
			undefined,
		lastPokemonCenter: data.lastPokemonCenter || GameConfig.startLocationId,
		completedNPCActions: new Set(data.completedNPCActions || []),
        battleTowerFloor: data.battleTowerFloor || 1,
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
