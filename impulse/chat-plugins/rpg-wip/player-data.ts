// Pokemon RPG Player Data Management
import type { PlayerData, BattleState } from './types';
import { addItemToInventory } from './utils';
import { createPokemon, createActivePokemonSlot } from './utils';

// In-memory storage for player data (in production, use a database)
export const playerData = new Map<string, PlayerData>();
export const activeBattles = new Map<string, BattleState>();

/**
 * Get or create player data
 */
export function getPlayerData(userid: string): PlayerData {
	if (!playerData.has(userid)) {
		const newPlayer: PlayerData = {
			id: userid,
			name: userid,
			level: 1,
			experience: 0,
			badges: 0,
			party: [],
			location: 'Starter Town',
			money: 5000000,
			inventory: new Map(),
			pc: new Map(),
		};
		addItemToInventory(newPlayer, 'pokeball', 5);
		addItemToInventory(newPlayer, 'potion', 3);
		playerData.set(userid, newPlayer);
	}
	return playerData.get(userid)!;
}

/**
 * Save battle status (placeholder for future persistence)
 */
export function saveBattleStatus(battle: BattleState): void {
	// In the future, this could save to a database
	// For now, just update the player's party from the battle
	const player = getPlayerData(battle.playerId);

	// Update player party Pokemon HP and status from battle slots
	for (const slot of battle.playerSlots) {
		if (slot) {
			const partyPokemon = player.party.find(p => p.id === slot.pokemon.id);
			if (partyPokemon) {
				partyPokemon.hp = slot.pokemon.hp;
				partyPokemon.status = slot.status;
			}
		}
	}
}

/**
 * Clear player data (for testing)
 */
export function clearPlayerData(userid?: string): void {
	if (userid) {
		playerData.delete(userid);
		activeBattles.delete(userid);
	} else {
		playerData.clear();
		activeBattles.clear();
	}
}
