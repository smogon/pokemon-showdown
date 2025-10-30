/**
 * Battle State Persistence
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This module handles persistence of Pokemon state (HP, PP, status)
 * between consecutive battles for custom formats.
 *
 * @license MIT
 */

// PlayerID is defined as a type in global-types.ts
type PlayerID = 'p1' | 'p2' | 'p3' | 'p4';

export interface PersistentPokemonState {
	/** Pokemon identifier (usually species name or set name) */
	identifier: string;
	/** Current HP */
	hp: number;
	/** Maximum HP */
	maxhp: number;
	/** Status condition ('' for no status) */
	status: ID;
	/** Move PP remaining for each move */
	movepp: number[];
	/** Move max PP for each move (for validation) */
	movemaxpp: number[];
	/** Move IDs (for validation) */
	moveids: ID[];
}

export interface PersistentBattleState {
	/** Format ID this state belongs to */
	formatid: ID;
	/** Player ID (p1, p2, etc.) */
	playerid: PlayerID;
	/** Player name */
	playername: string;
	/** Array of Pokemon states */
	pokemon: PersistentPokemonState[];
	/** Timestamp of last battle */
	timestamp: number;
}

/**
 * Battle State Persistence Manager
 *
 * Manages persistent state for Pokemon across multiple battles.
 * Can be used for gauntlet-style battles where HP, PP, and status
 * conditions carry over from one battle to the next.
 */
export class BattlePersistenceManager {
	/** Storage for persistent battle states, keyed by a unique identifier */
	private states: Map<string, PersistentBattleState>;

	constructor() {
		this.states = new Map();
	}

	/**
	 * Generate a unique key for storing battle state
	 */
	private getKey(formatid: ID, playerid: PlayerID, playername: string): string {
		return `${formatid}:${playerid}:${playername}`;
	}

	/**
	 * Capture Pokemon state from a battle
	 */
	capturePokemonState(pokemon: Pokemon): PersistentPokemonState {
		const movepp: number[] = [];
		const movemaxpp: number[] = [];
		const moveids: ID[] = [];

		for (const moveSlot of pokemon.moveSlots) {
			movepp.push(moveSlot.pp);
			movemaxpp.push(moveSlot.maxpp);
			moveids.push(moveSlot.id);
		}

		return {
			identifier: pokemon.name,
			hp: pokemon.hp,
			maxhp: pokemon.maxhp,
			status: pokemon.status,
			movepp,
			movemaxpp,
			moveids,
		};
	}

	/**
	 * Save battle state for a player
	 */
	saveBattleState(battle: Battle, side: Side): void {
		const pokemon: PersistentPokemonState[] = [];

		for (const mon of side.pokemon) {
			pokemon.push(this.capturePokemonState(mon));
		}

		const state: PersistentBattleState = {
			formatid: battle.format.id,
			playerid: side.id,
			playername: side.name,
			pokemon,
			timestamp: Date.now(),
		};

		const key = this.getKey(battle.format.id, side.id, side.name);
		this.states.set(key, state);
	}

	/**
	 * Load battle state for a player
	 */
	loadBattleState(formatid: ID, playerid: PlayerID, playername: string): PersistentBattleState | null {
		const key = this.getKey(formatid, playerid, playername);
		return this.states.get(key) || null;
	}

	/**
	 * Restore Pokemon state to a Pokemon instance
	 */
	restorePokemonState(pokemon: Pokemon, state: PersistentPokemonState): boolean {
		// Verify Pokemon matches
		if (pokemon.name !== state.identifier) {
			return false;
		}

		// Verify moves match (at least by count)
		if (pokemon.moveSlots.length !== state.moveids.length) {
			return false;
		}

		// Restore HP (ensure it doesn't exceed maxhp)
		pokemon.hp = Math.min(state.hp, pokemon.maxhp);

		// Restore status
		if (state.status) {
			pokemon.setStatus(state.status, null, null, true);
		}

		// Restore PP for each move
		for (let i = 0; i < pokemon.moveSlots.length; i++) {
			const moveSlot = pokemon.moveSlots[i];
			// Verify move matches
			if (moveSlot.id === state.moveids[i]) {
				// Restore PP (ensure it doesn't exceed maxpp)
				moveSlot.pp = Math.min(state.movepp[i], moveSlot.maxpp);
			}
		}

		return true;
	}

	/**
	 * Restore battle state to a side
	 */
	restoreBattleState(side: Side, state: PersistentBattleState): void {
		// Match Pokemon by position and name
		for (let i = 0; i < side.pokemon.length && i < state.pokemon.length; i++) {
			const pokemon = side.pokemon[i];
			const pokemonState = state.pokemon[i];

			this.restorePokemonState(pokemon, pokemonState);
		}
	}

	/**
	 * Clear battle state for a player
	 */
	clearBattleState(formatid: ID, playerid: PlayerID, playername: string): void {
		const key = this.getKey(formatid, playerid, playername);
		this.states.delete(key);
	}

	/**
	 * Clear all states
	 */
	clearAll(): void {
		this.states.clear();
	}

	/**
	 * Get all states (for debugging/testing)
	 */
	getAllStates(): Map<string, PersistentBattleState> {
		return new Map(this.states);
	}
}

// Global singleton instance for persistence across battles
export const globalPersistenceManager = new BattlePersistenceManager();
