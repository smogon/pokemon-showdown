import { PlayerData, BattleState, InventoryPockets } from './interfaces';

// These Maps are the in-memory "database" for your game.
const playerDataStore: Map<string, PlayerData> = new Map();
const activeBattlesStore: Map<string, BattleState> = new Map();

/**
 * Fetches a player's data. If the player doesn't exist, it creates a new entry.
 * @param userid The user's unique ID.
 * @param name The user's name.
 * @returns The player's data object.
 */
export function getPlayerData(userid: string, name: string): PlayerData {
	if (!playerDataStore.has(userid)) {
		return createNewPlayer(userid, name);
	}
	return playerDataStore.get(userid)!;
}

/**
 * Saves a player's data object back to the store.
 * @param player The player data object to save.
 */
export function savePlayer(player: PlayerData): void {
	playerDataStore.set(player.id, player);
}

/**
 * Creates a brand-new player object with default values.
 * @param userid The new player's unique ID.
 * @param name The new player's name.
 * @returns The newly created player data object.
 */
function createNewPlayer(userid: string, name: string): PlayerData {
	const newPlayer: PlayerData = {
		id: userid,
		name: name,
		trainerId: Math.floor(Math.random() * 65535),
		secretId: Math.floor(Math.random() * 65535),
		party: [],
		pc: [],
		inventory: {
			medicine: new Map(),
			pokeballs: new Map(),
			battleItems: new Map(),
			heldItems: new Map(),
			keyItems: new Map(),
			misc: new Map(),
		},
		pokedex: {},
		money: 3000, // Starting money
		location: { mapId: 'starter-town', x: 0, y: 0 },
		storyFlags: {},
		gymBadges: [],
        questLog: {},
		timePlayedInSeconds: 0,
	};
	
	playerDataStore.set(userid, newPlayer);
	return newPlayer;
}

// === Battle Management Functions ===

export function getBattle(userid: string): BattleState | undefined {
	return activeBattlesStore.get(userid);
}

export function saveBattle(battle: BattleState): void {
	activeBattlesStore.set(battle.sides[0].trainerId, battle); // Assumes side 0 is the player
}

export function deleteBattle(userid: string): void {
	activeBattlesStore.delete(userid);
}
