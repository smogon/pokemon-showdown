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

export type StatusCondition = 'brn' | 'psn' | 'tox' | 'par' | 'slp' | 'frz';

export interface PokemonEntry {
	species: string;
	level: number;
	exp: number;
	/** PS item ID of held item, empty string or undefined for none. */
	heldItem?: string;
	moves: string[];
	/** 0–100 percentage; undefined means 100 %. */
	currentHp?: number;
	/** PP remaining per move slot (index-matched to moves[]). Undefined = full PP. */
	ppLeft?: number[];
	/** Persistent status condition carried between battles. */
	status?: StatusCondition;
}

export interface PokeRogueState {
	floor: number;
	team: PokemonEntry[];
	/** Battle Points — the currency used for all purchases. */
	battlePoints: number;
	/** How many times the rotational shop has been rerolled this floor (resets each win). */
	timesRerolled: number;
	/** Keys from ROTATIONAL_ITEM_POOL that are currently in the rotational shop. */
	rotationalShop: string[];
	/** Key items the player has permanently unlocked (from shopdb 'key' type). */
	keyItems: string[];

	// --- Flags / pending states ---
	/** Pending Pokémon options presented to the player (starter pick or pack). */
	pendingChoice?: string[];
	pendingChoiceType?: 'starter' | 'add';
	/** When team is full and a new Pokémon was chosen, this is the new mon awaiting a swap. */
	pendingSwap?: PokemonEntry;
	/** Move-learning queue. */
	pendingMoves?: { pokemonIndex: number; move: string; speciesName: string }[];

	// --- Shop flags (mirrors poketest.ts userData.flags) ---
	/** The item/rotational-item the player just paid for and is awaiting to redeem. */
	purchasedItem?: string; // key into SHOP_ITEMS or ROTATIONAL_ITEM_POOL
	/** The PS item name pending assignment to a Pokémon (from 'item' / 'itemPack' / 'evolveItem' types). */
	pendingItemName?: string;
	/** When true, pendingItemName is an evolution item — applying it evolves the target Pokémon. */
	pendingItemIsEvo?: boolean;
	/** Whether purchasedItem came from the rotational shop (vs. permanent shop). */
	isRotationalItem?: boolean;
	/** The move ID the player is trying to teach via a TM purchase. */
	moveToLearn?: string;
	/** Team index of the Pokémon that is learning the TM move. */
	pokemonForTM?: number;
	/** Move name forgotten during TM teaching (for display). */
	moveForgotten?: string;
	/** Item options shown to player after buying an item pack. */
	itemOptions?: string[];

	// --- Battle ---
	battleRoomId?: string;

	// --- Progression ---
	streaksWon?: number;
	highestFloor?: number;
	displayName?: string;
	recordTeam?: PokemonEntry[];

	// --- Game over ---
	gameOver?: boolean;
	lastRunFloor?: number;
	lastRunStreaks?: number;

	notification?: string;
}

export type SavedData = Record<string, PokeRogueState>;
