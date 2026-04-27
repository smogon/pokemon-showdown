/*
 * =======================================================================
 *
 * ___ __  __ ___ _   _ _    ___ ___
 * |_ _|  \/  | _ \ | | | |  / __| __|
 * | || |\/| |  _/ |_| | |__\__ \ _|
 * |___|_|  |_|_|  \___/|____|___/___|
 *
 * Server: Impulse
 * Plugin: PokéRogue Types
 * Made by: @TurboRx
 *
 * =======================================================================
 */

export const LEGENDARY_TAGS = new Set<string>([
	'Sub-Legendary', 'Restricted Legendary', 'Mythical', 'Ultra Beast', 'Paradox',
]);

export type StatusCondition = 'brn' | 'psn' | 'tox' | 'par' | 'slp' | 'frz';

export interface PokemonEntry {
	species: string;
	level: number;
	exp: number;
	heldItem?: string;
	moves: string[];
	currentHp?: number;
	ppLeft?: number[];
	status?: StatusCondition;
}

export interface PokeRogueState {
	floor: number;
	team: PokemonEntry[];
	battlePoints: number;
	timesRerolled: number;
	rotationalShop: string[];
	keyItems: string[];
	pendingChoice?: string[];
	pendingChoiceType?: 'starter' | 'add';
	pendingSwap?: PokemonEntry;
	pendingMoves?: { pokemonIndex: number; move: string; speciesName: string }[];
	purchasedItem?: string;
	pendingConsumableType?: 'healHP' | 'healPP' | 'revive' | 'cureStatus';
	pendingItemName?: string;
	pendingItemIsEvo?: boolean;
	isRotationalItem?: boolean;
	moveToLearn?: string;
	pokemonForTM?: number;
	moveForgotten?: string;
	itemOptions?: string[];
	battleRoomId?: string;
	streaksWon?: number;
	highestFloor?: number;
	displayName?: string;
	recordTeam?: PokemonEntry[];
	gameOver?: boolean;
	lastRunFloor?: number;
	lastRunStreaks?: number;
	notification?: string;
}

export type SavedData = Record<string, PokeRogueState>;