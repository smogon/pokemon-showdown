// Pokemon RPG Type Definitions

// Type alias for status conditions
export type Status = 'psn' | 'brn' | 'par' | 'slp' | 'frz';

// Type alias for stat names
export type StatID = 'hp' | 'atk' | 'def' | 'spa' | 'spd' | 'spe';

// Interface for Pokemon stats
export interface Stats {
	maxHp: number;
	atk: number;
	def: number;
	spa: number;
	spd: number;
	spe: number;
}

// Interface for RPG Pokemon data
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
	ivs: { hp: number, atk: number, def: number, spa: number, spd: number, spe: number };
	evs: { hp: number, atk: number, def: number, spa: number, spd: number, spe: number };
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

// Interface for inventory items
export interface InventoryItem {
	id: string;
	name: string;
	category: 'pokeball' | 'medicine' | 'berry' | 'tm' | 'key' | 'misc' | 'held';
	description: string;
	quantity: number;
}

// Interface for Double Battles - Holds a Pokemon and all its volatile, in-battle statuses
export interface ActivePokemonSlot {
	pokemon: RPGPokemon;
	statStages: { atk: number, def: number, spa: number, spd: number, spe: number, accuracy: number, evasion: number };
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
}

// Interface for player data
export interface PlayerData {
	id: string;
	name: string;
	level: number;
	experience: number;
	badges: number;
	party: RPGPokemon[];
	location: string;
	money: number;
	inventory: any; // Map<string, InventoryItem>
	pc: any; // Map<string, RPGPokemon>
	pendingMoveLearnQueue?: {
		pokemonId: string,
		moveIds: string[],
	};
}

// Interface for battle state
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
	playerFutureMoves: Array<{
		slotIndex: number, // Which slot will be hit (0 or 1)
		moveId: 'futuresight' | 'doomdesire',
		turnsLeft: number, // Hits when this reaches 0
		attackerSlotIndex: number, // Who used it (for stat calculations)
		attackerStats: { atk: number, spa: number }, // Stats when used
	}>;
	opponentFutureMoves: Array<{
		slotIndex: number,
		moveId: 'futuresight' | 'doomdesire',
		turnsLeft: number,
		attackerSlotIndex: number,
		attackerStats: { atk: number, spa: number },
	}>;
}

// Interface for defining a trainer in the database
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
	battleType?: 'single' | 'double';
}

// Interface for encounter zones
export interface EncounterZone {
	name: string;
	pokemon: string[];
	levelRange: [number, number];
	battleType?: 'single' | 'double';
}
