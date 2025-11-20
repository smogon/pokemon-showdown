/*
* Pokemon Showdown
* RPG Interface & Types
*/
export type Status = 'psn' | 'tox' | 'brn' | 'par' | 'slp' | 'frz';

// [NEW] Generic Item Effects Interface
// This allows items to define their behavior data, removing hardcoded switch statements from the engine.
export interface ItemEffects {
	// Healing
	healAmount?: number;        // Flat HP amount (e.g., 20)
	healPercent?: number;       // Percentage of Max HP (e.g., 1.0 for full)
	statusCure?: Status | 'all'; // specific status or 'all'

	// Revival
	revive?: boolean;           // Triggers revival logic
	reviveHealthPercent?: number; // 0.5 for half HP, 1.0 for max HP
	
	// Sentiment / Friendship
	// Positive values for happiness items, negative for bitter herbs
	friendshipChange?: number;

	// PP Restoration
	ppRestore?: number;         // Amount to restore (e.g., 10), or -1 for Max
	ppRestoreAll?: boolean;     // If true, applies to all moves (Elixir)

	// Stat Boosts (Vitamins/Feathers)
	evBoost?: {
		stat: keyof Stats;
		amount: number;
	};

	// Leveling & Exp
	levelBoost?: number;        // Rare Candy = 1
	expBoost?: number;          // Exp Candy amount

	// Evolution & Form Change
	evolutionItem?: boolean;    // Stone or Held Item trigger
	
	// Battle Mechanics
	canTerastallize?: boolean;  // For Tera Shard
}

export interface InventoryItem {
	id: string;
	name: string;
	category: 'pokeball' | 'medicine' | 'berry' | 'tm' | 'key' | 'misc' | 'held';
	description: string;
	quantity: number;
	effects?: ItemEffects;      // [NEW] Linked effects object
	price?: number;             // [NEW] Base shop price
}

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
	teraType: string;
}

export type Stats = Pick<RPGPokemon, 'atk' | 'def' | 'spa' | 'spd' | 'spe' | 'maxHp'>;

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
	isLoafing: boolean;
	isTrapped: { turns: number } | null;
	partiallyTrapped?: { turns: number, moveId: string, damage: number } | null;
	tauntTurns: number;
	isSeeded: boolean;
	hasNightmare: boolean;
	isCursed: boolean;
	chargingMove?: string;
	activeTurns: number;
	lockedMove?: string;
	lockedMoveCounter?: number; // For rampage moves (Outrage, Thrash, Petal Dance) - counts down from 2-3
	mustRecharge?: boolean; // For recharge moves (Hyper Beam, Giga Impact, etc.)
	uproarTurns?: number; // For Uproar move - lasts 3 turns, prevents sleep
	isRedirecting?: boolean;
	isHelped?: boolean;
	lastDamageTaken?: { amount: number, category: 'Physical' | 'Special', from: string };
	yawnCounter?: number;

	substitute?: { hp: number };
	disabledMove?: { moveId: string, turns: number };
	encoreMove?: { moveId: string, turns: number };
	isIngrained?: boolean;
	hasAquaRing?: boolean;
	focusEnergy?: boolean;
	magnetRiseTurns?: number;
	telekinesisCounter?: number;
	isSmackedDown?: boolean;
	lastMoveUsed?: string;
	tormentActive?: boolean;
	embargoTurns?: number;
	healBlockTurns?: number;
	isCharged?: boolean;
	stockpileCount?: number;
	flashFireBoost?: boolean;
	unburdenActive?: boolean;
	analyticBoost?: boolean;
	slowStartTurns?: number;
	volatileTypes?: string[];
	isDisguised?: boolean;
	lastMoveThatHitMe?: Move;
	terastallized?: string;
	perishSongCounter?: number;
	wishTurns?: number; // For Wish move - heals after 2 turns
	consumedBerry?: string; // Track the last berry consumed for Harvest
	harvestUsedThisTurn?: boolean; // Prevent multiple Harvest triggers per turn
	cudChewBerry?: string; // Track berry for Cud Chew to consume again

	boosterEnergyActive?: boolean; // Track if Booster Energy has been consumed for Protosynthesis/Quark Drive
	gulpMissileForm?: 'gulping' | 'gorging' | null; // Track Cramorant's Gulp Missile form
	commanderActive?: boolean; // Track if Tatsugiri is inside Dondozo
	commanderBoost?: boolean; // Track if Dondozo has Commander boost
	hasSwitchedOut?: boolean; // Track if Pokemon has switched out (for Zero to Hero)
}

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
	}[];
	// Story progression tracking
	storyFlags: Set<string>;
	defeatedTrainers: Set<string>;
	obtainedBadges: string[];
	visitedLocations: Set<string>;
	lastPokemonCenter?: string; // Track the last Pokemon Center visited for respawn
	completedNPCActions: Set<string>; // Track NPCs that have completed one-time actions
	battleTowerFloor: number; // [NEW] Added for Battle Tower mode
}

export interface BattleState {
	playerId: string;
	turn: number;
	zoneId: string;
	playerHazards: string[];
	opponentHazards: string[];

	weather?: {
		type: 'sun' | 'rain' | 'sand' | 'hail' | 'harsh-sun' | 'heavy-rain' | 'strong-winds',
		turns: number,
	};
	locationWeather?: {
		type: 'sun' | 'rain' | 'sand' | 'hail' | 'harsh-sun' | 'heavy-rain' | 'strong-winds',
	}; // Original location weather for restoration after temporary weather expires
	trickRoomTurns: number;
	magicRoomTurns: number;
	wonderRoomTurns: number;
	terrain?: {
		type: 'electric' | 'grassy' | 'misty' | 'psychic',
		turns: number,
	};

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
	fairyLockTurns: number;
	ionDelugeTurns: number;

	forceEnd?: boolean;
	battleEnded?: boolean;
	battleResult?: 'victory' | 'defeat';

	playerTerastallizeUsed: boolean;
	opponentTerastallizeUsed: boolean;

	battleType: 'wild' | 'trainer' | 'wild_double' | 'trainer_double' | 'battletower';
	opponentName: string;
	opponentParty: RPGPokemon[];
	opponentMoney: number;
	trainerId?: string; // For tracking which trainer was defeated (for badges/story)

	playerShouldSwitch?: boolean | 'copyvolatile';
	pendingPivot?: { slotIndex: number, slot: ActivePokemonSlot, isBatonPass: boolean };
	aiPendingPivot?: { slotIndex: number, slot: ActivePokemonSlot, isBatonPass: boolean };

	playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null];
	opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null];

	pendingActions: {
		[slotIndex: number]: {
			actionType: 'move' | 'switch',
			moveId?: string,
			targetSlot?: number,
			switchToPokemonId?: string,
			pokemonId: string,
			terastallize?: boolean,
		} | null,
	};

	playerFutureMoves: {
		slotIndex: number,
		moveId: 'futuresight' | 'doomdesire',
		turnsLeft: number,
		attackerSlotIndex: number,
		attackerStats: { atk: number, spa: number },
	}[];
	opponentFutureMoves: {
		slotIndex: number,
		moveId: 'futuresight' | 'doomdesire',
		turnsLeft: number,
		attackerSlotIndex: number,
		attackerStats: { atk: number, spa: number },
	}[];

	// Cumulative battle log for all turns
	battleLog: string[];

	floor: number;
	overridePlayerParty: RPGPokemon[] | null;
	battleTowerFormat?: string; // Format used in Battle Tower (e.g., 'battlefactory')
}

export interface TrainerSpec {
	name: string;
	party: {
		species: string,
		level: number,
		moves?: string[],
		item?: string,
	}[];
	money: number;
	dialogue?: {
		start: string,
		win: string,
		lose: string,
	};
	battleType?: 'single' | 'double';
}

// (Ability interfaces omitted as they were not modified but are required for context)
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

export interface NPCData {
	id: string;
	name: string;
	location: string;
	dialogue: string;
	flags?: string[];
	action?: any; // Simplified for this file, full definition in npc-actions.ts or commands
	npcType?: 'normal' | 'movetutor' | 'movedeleter' | 'namerater' | 'nurse' | 'shopkeeper' | 'gymleader' | 'elitefoura' | 'champion' | 'rival';
}

export interface ScriptedEvent {
	id: string;
	name: string;
	type: string;
    [key: string]: any; // Flexible signature
	}
