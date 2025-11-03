/**
 * Type alias for status conditions
 */
export type Status = 'psn' | 'tox' | 'brn' | 'par' | 'slp' | 'frz';

/**
 * Interface for inventory items
 */
export interface InventoryItem {
	id: string;
	name: string;
	category: 'pokeball' | 'medicine' | 'berry' | 'tm' | 'key' | 'misc' | 'held';
	description: string;
	quantity: number;
}

/**
 * Interface for Move data (from abilities.ts)
 */
export interface Move {
	id: string;
	name: string;
	type: string;
	category: 'Physical' | 'Special' | 'Status';
	basePower: number;
	flags: Record<string, boolean>;
	secondary?: any;
	[key: string]: any;
}

// --- Pokemon & Player Types (from rpg-refactor.ts) ---

/**
 * Interface for RPG Pokemon data
 * Depends on `Stats` and `Status`
 */
export interface RPGPokemon {
	species: string;
	level: number;
	hp: number;
	maxHp: number;
	atk: number;
	def: number;
	spa: number;
	spd: number;
	spe: number;
	ivs: Record<keyof Stats, number>;
	evs: Record<keyof Stats, number>;
	weightkg: number;
	heightm: number;
	friendship: number;
	growthRate: string;
	experience: number;
	expToNextLevel: number;
	moves: { id: string, pp: number }[];
	nature: string;
	status: Status | null;
	ability?: string;
	item?: string;
	id: string;
	nickname: string;
	gender: 'M' | 'F' | 'N';
	shiny: boolean;
	caughtIn: string;
	form?: string;
}

/**
 * Type alias for Stats, derived from RPGPokemon
 * (Note: This definition from rpg-refactor.ts is dependent on RPGPokemon)
 */
export type Stats = Omit<RPGPokemon, 'species' | 'level' | 'experience' | 'moves' | 'id' | 'expToNextLevel' | 'hp' | 'ability' | 'item' | 'nature' | 'growthRate' | 'ivs' | 'evs' | 'status'>;

/**
 * Interface for active battle slots
 * Depends on `RPGPokemon`, `Status`, and `Stats`
 */
export interface ActivePokemonSlot {
	pokemon: RPGPokemon;
	statStages: Record<keyof Omit<Stats, 'maxHp'> | 'accuracy' | 'evasion', number>;
	status: Status | null;
	sleepCounter: number;
	isConfused: boolean;
	confusionCounter: number;
	isProtected: boolean;
	protectSuccessCounter: number;
	willFlinch: boolean;
	isTrapped: { turns: number } | null;
	tauntTurns: number;
	isSeeded: boolean;
	hasNightmare: boolean;
	isCursed: boolean;
	chargingMove?: string;
	activeTurns: number;
	lockedMove?: string;
	isRedirecting?: boolean; // For Follow Me
	isHelped?: boolean; // For Helping Hand
	lastDamageTaken?: { amount: number, category: 'Physical' | 'Special', from: string }; // For Counter/Mirror Coat
	yawnCounter?: number; // For Yawn - inflicts sleep after counter reaches 0

	// High-priority volatile statuses
	substitute?: { hp: number }; // Substitute HP
	disabledMove?: { moveId: string, turns: number }; // Disabled move and turns remaining
	encoreMove?: { moveId: string, turns: number }; // Encored move and turns remaining
	isIngrained?: boolean; // Ingrain - restores HP but prevents switching
	hasAquaRing?: boolean; // Aqua Ring - restores 1/16 HP each turn
	focusEnergy?: boolean; // Focus Energy - increases critical hit ratio
	magnetRiseTurns?: number; // Magnet Rise - levitates (Ground immunity)
	telekinesisCounter?: number; // Telekinesis - moves cannot miss
	isSmackedDown?: boolean; // Smackdown - grounded (loses Flying/Levitate)
	lastMoveUsed?: string; // For Torment, Disable, Encore tracking
	tormentActive?: boolean; // Torment - cannot use same move twice
	embargoTurns?: number; // Embargo - cannot use items
	healBlockTurns?: number; // Heal Block - cannot heal
	isCharged?: boolean; // Charge - next Electric move deals 2x damage
	stockpileCount?: number; // Stockpile - stores energy (0-3)
	flashFireBoost?: boolean; // (For Flash Fire ability)
	unburdenActive?: boolean; // (For Unburden ability)
}

/**
 * Interface for player data
 * Depends on `RPGPokemon` and `InventoryItem`
 */
export interface PlayerData {
	id: string;
	name: string;
	level: number;
	experience: number;
	badges: number;
	party: RPGPokemon[];
	location: string;
	money: number;
	inventory: Map<string, InventoryItem>;
	pc: Map<string, RPGPokemon>;
	pendingMoveLearnQueue?: {
		pokemonId: string,
		moveIds: string[],
	};
}

// --- Battle Types (from rpg-refactor.ts & abilities.ts) ---

/**
 * Interface for battle state
 * Depends on `ActivePokemonSlot`
 */
export interface BattleState {
	playerId: string;
	turn: number;
	zoneId: string; // Still useful for tracking location / return point
	playerHazards: string[];
	opponentHazards: string[];

	weather?: {
		type: 'sun' | 'rain' | 'sand' | 'hail',
		turns: number,
	};
	trickRoomTurns: number;
	magicRoomTurns: number;
	wonderRoomTurns: number;
	terrain?: {
		type: 'electric' | 'grassy' | 'misty' | 'psychic',
		turns: number,
	};

	// --- Fields for side-wide guards ---
	playerQuickGuard: boolean;
	opponentQuickGuard: boolean;
	playerWideGuard: boolean;
	opponentWideGuard: boolean;
	playerCraftyShield: boolean;
	opponentCraftyShield: boolean;
	playerReflectTurns: number;
	opponentReflectTurns: number;
	playerLightScreenTurns: number;
	opponentLightScreenTurns: number;
	playerAuroraVeilTurns: number;
	opponentAuroraVeilTurns: number;
	gravityTurns: number;
	mudSportTurns: number;
	waterSportTurns: number;

	forceEnd?: boolean;

	// --- NEW FIELDS FOR TRAINER BATTLES ---
	battleType: 'wild' | 'trainer' | 'wild_double' | 'trainer_double';
	opponentName: string; // e.g., "Wild Pikachu" or "Rival"
	opponentParty: RPGPokemon[];
	opponentMoney: number; // Money to win (0 for wild)

	// --- Pivot/Switch Flags ---
	playerShouldSwitch?: boolean | 'copyvolatile'; // <-- This is now DEPRECATED by pendingPivot
	pendingPivot?: { slotIndex: number, slot: ActivePokemonSlot, isBatonPass: boolean };
	aiPendingPivot?: { slotIndex: number, slot: ActivePokemonSlot, isBatonPass: boolean };

	// --- NEW FIELDS FOR DOUBLE BATTLES ---
	playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null];
	opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null];

	// New field to store player/AI commands before the turn executes
	pendingActions: {
		[slotIndex: number]: { // 0, 1 for player; 2, 3 for opponent
			actionType: 'move' | 'switch',
			moveId?: string,
			targetSlot?: number, // 0-3
			switchToPokemonId?: string,
			pokemonId: string, // To track who is acting
		} | null,
	};

	// --- FIELDS FOR DELAYED MOVE EFFECTS ---
	// Future Sight and Doom Desire - attacks that hit after 2 turns
	playerFutureMoves: {
		slotIndex: number, // Which slot will be hit (0 or 1)
		moveId: 'futuresight' | 'doomdesire',
		turnsLeft: number, // Hits when this reaches 0
		attackerSlotIndex: number, // Who used it (for stat calculations)
		attackerStats: { atk: number, spa: number }, // Stats when used
	}[];
	opponentFutureMoves: {
		slotIndex: number,
		moveId: 'futuresight' | 'doomdesire',
		turnsLeft: number,
		attackerSlotIndex: number,
		attackerStats: { atk: number, spa: number },
	}[];
}

/**
 * Interface for defining a trainer in the database
 */
export interface TrainerSpec {
	name: string;
	party: {
		species: string,
		level: number,
		moves?: string[], // Optional: if not provided, uses default learnset
		item?: string, // Optional: specify a held item
	}[];
	money: number; // Prize money for winning
	dialogue?: {
		start: string,
		win: string, // Dialogue if player wins
		lose: string, // Dialogue if opponent wins
	};
	battleType?: 'single' | 'double'; // <-- NEW FIELD
}

// --- Ability Handler Types (from abilities.ts) ---

/**
 * Context for ability functions
 * Depends on `RPGPokemon`, `ActivePokemonSlot`, `Move`, `BattleState`
 */
export interface AbilityContext {
	attacker: RPGPokemon;
	defender: RPGPokemon;
	attackerSlot: ActivePokemonSlot;
	defenderSlot: ActivePokemonSlot;
	move: Move;
	battle: BattleState;
	messageLog: string[];
	effectiveness?: number;
}

/**
 * Ability Handler Types
 */
export type AbilityImmunityHandler = (ctx: AbilityContext) => { immune: boolean, message?: string } | null;
export type AbilityPowerModifierHandler = (ctx: AbilityContext, basePower: number) => number;
export type AbilityDamageModifierHandler = (ctx: AbilityContext, damage: number) => number;
export type AbilityStatModifierHandler = (pokemon: RPGPokemon, stat: string, value: number) => number;
export type AbilityTypeModifierHandler = (ctx: AbilityContext, moveType: string) => string;
export type AbilityOnSwitchInHandler = (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void;
export type AbilityOnDamageHandler = (ctx: AbilityContext, damage: number) => void;
export type AbilityOnMoveHandler = (ctx: AbilityContext) => void;
