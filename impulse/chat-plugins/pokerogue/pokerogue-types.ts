/*
 * =======================================================================
 *
 *    ___ __  __ ___ _   _ _    ___ ___
 *   |_ _|  \/  | _ \ | | | |  / __| __|
 *    | || |\/| |  _/ |_| | |__\__ \ _|
 *   |___|_|  |_|_|  \___/|____|___/___|
 *
 *   Server: Impulse
 *   Plugin: PokéRogue Types
 *   Made by: @TurboRx
 *
 * =======================================================================
 */

export const LEGENDARY_TAGS = new Set<string>([
	'Sub-Legendary', 'Restricted Legendary', 'Mythical', 'Ultra Beast', 'Paradox',
]);

export interface ShopItem {
	id: string;
	name: string;
	description: string;
	cost: number;
	heldItem?: string;
	icon?: string;
	gachaType?: 'master' | 'ultra' | 'great';
	gachaChance?: number;
	isConsumable?: boolean;
	healHp?: number; // if set, restores this many HP % points when used from the bag
}

export interface PokemonEntry {
	species: string;
	level: number;
	exp: number;
	heldItem?: string;
	moves: string[];
	currentHp?: number; // 0-100 percentage; undefined means 100%
}

export interface PokeRogueState {
	floor: number;
	team: PokemonEntry[];
	pendingChoice?: string[];
	pendingChoiceType?: 'starter' | 'add';
	battleRoomId?: string;
	coins?: number;
	items?: Record<string, number>;
	doubleExpFloors?: number;
	hasRevive?: boolean;
	highestFloor?: number;
	displayName?: string;
	streaksWon?: number;
	shopInventory?: string[];
	notification?: string;
	gameOver?: boolean;
	lastRunFloor?: number;
	lastRunStreaks?: number;
	recordTeam?: PokemonEntry[];
	pendingGachaOffer?: { species: string, sourceItemId: string, isFeatured: boolean };
	pendingMoves?: { pokemonIndex: number, move: string, speciesName: string }[];
	pendingSwap?: PokemonEntry;
}

export type SavedData = Record<string, PokeRogueState>;
