/*
* Pokemon Showdown
* RPG Interface & Types
*/
export type Status = 'psn' | 'tox' | 'brn' | 'par' | 'slp' | 'frz';

/**
 * @typedef {Object} InventoryItem
 * @property {string} id
 * @property {string} name
 * @property {'pokeball' | 'medicine' | 'berry' | 'tm' | 'key' | 'misc' | 'held'} category
 * @property {string} description
 * @property {number} quantity
 */
export interface InventoryItem {
	id: string;
	name: string;
	category: 'pokeball' | 'medicine' | 'berry' | 'tm' | 'key' | 'misc' | 'held';
	description: string;
	quantity: number;
}

/**
 * @typedef {Object} Move
 * @property {string} id
 * @property {string} name
 * @property {string} type
 * @property {'Physical' | 'Special' | 'Status'} category
 * @property {number} basePower
 * @property {Record<string, boolean>} flags
 * @property {any} [secondary]
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

/**
 * @typedef {Object} RPGPokemon
 * @property {string} species
 * @property {number} level
 * @property {number} hp
 * @property {number} maxHp
 * @property {number} atk
 * @property {number} def
 * @property {number} spa
 * @property {number} spd
 * @property {number} spe
 * @property {Record<keyof Stats, number>} ivs
 * @property {Record<keyof Stats, number>} evs
 * @property {number} weightkg
 * @property {number} heightm
 * @property {number} friendship
 * @property {string} growthRate
 * @property {number} experience
 * @property {number} expToNextLevel
 * @property {{ id: string, pp: number }[]} moves
 * @property {string} nature
 * @property {Status | null} status
 * @property {string} [ability]
 * @property {string} [item]
 * @property {string} id
 * @property {string} nickname
 * @property {'M' | 'F' | 'N'} gender
 * @property {boolean} shiny
 * @property {string} caughtIn
 * @property {string} [form]
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

export type Stats = Omit<RPGPokemon, 'species' | 'level' | 'experience' | 'moves' | 'id' | 'expToNextLevel' | 'hp' | 'ability' | 'item' | 'nature' | 'growthRate' | 'ivs' | 'evs' | 'status'>;

/**
 * @typedef {Object} ActivePokemonSlot
 * @property {RPGPokemon} pokemon
 * @property {Record<keyof Omit<Stats, 'maxHp'> | 'accuracy' | 'evasion', number>} statStages
 * @property {Status | null} status
 * @property {number} sleepCounter
 * @property {boolean} isConfused
 * @property {number} confusionCounter
 * @property {boolean} isProtected
 * @property {number} protectSuccessCounter
 * @property {boolean} willFlinch
 * @property {{ turns: number } | null} isTrapped
 * @property {number} tauntTurns
 * @property {boolean} isSeeded
 * @property {boolean} hasNightmare
 * @property {boolean} isCursed
 * @property {string} [chargingMove]
 * @property {number} activeTurns
 * @property {string} [lockedMove]
 * @property {boolean} [isRedirecting]
 * @property {boolean} [isHelped]
 * @property {{ amount: number, category: 'Physical' | 'Special', from: string }} [lastDamageTaken]
 * @property {number} [yawnCounter]
 * @property {{ hp: number }} [substitute]
 * @property {{ moveId: string, turns: number }} [disabledMove]
 * @property {{ moveId: string, turns: number }} [encoreMove]
 * @property {boolean} [isIngrained]
 * @property {boolean} [hasAquaRing]
 * @property {boolean} [focusEnergy]
 * @property {number} [magnetRiseTurns]
 * @property {number} [telekinesisCounter]
 * @property {boolean} [isSmackedDown]
 * @property {string} [lastMoveUsed]
 * @property {boolean} [tormentActive]
 * @property {number} [embargoTurns]
 * @property {number} [healBlockTurns]
 * @property {boolean} [isCharged]
 * @property {number} [stockpileCount]
 * @property {boolean} [flashFireBoost]
 * @property {boolean} [unburdenActive]
 * @property {boolean} [analyticBoost]
 * @property {boolean} [slowStartTurn]
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
	volatileTypes?: string[]; // (For Protean/Libero - Not Implemented yet)
	isDisguised?: boolean; // (For Disguise)
	lastMoveThatHitMe?: Move;
}

/**
 * @typedef {Object} PlayerData
 * @property {string} id
 * @property {string} name
 * @property {number} level
 * @property {number} experience
 * @property {number} badges
 * @property {RPGPokemon[]} party
 * @property {string} location
 * @property {number} money
 * @property {Map<string, InventoryItem>} inventory
 * @property {Map<string, RPGPokemon>} pc
 * @property {{ pokemonId: string, moveIds: string[] }} [pendingMoveLearnQueue]
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
	currentView: string;
	viewContext?: any;
	lastAction: number;
}

/**
 * @typedef {Object} BattleState
 * @property {string} playerId
 * @property {number} turn
 * @property {string} zoneId
 * @property {string[]} playerHazards
 * @property {string[]} opponentHazards
 * @property {{ type: 'sun' | 'rain' | 'sand' | 'hail', turns: number }} [weather]
 * @property {number} trickRoomTurns
 * @property {number} magicRoomTurns
 * @property {number} wonderRoomTurns
 * @property {{ type: 'electric' | 'grassy' | 'misty' | 'psychic', turns: number }} [terrain]
 * @property {boolean} playerQuickGuard
 * @property {boolean} opponentQuickGuard
 * @property {boolean} playerWideGuard
 * @property {boolean} opponentWideGuard
 * @property {boolean} playerCraftyShield
 * @property {boolean} opponentCraftyShield
 * @property {number} playerReflectTurns
 * @property {number} opponentReflectTurns
 * @property {number} playerLightScreenTurns
 * @property {number} opponentLightScreenTurns
 * @property {number} playerAuroraVeilTurns
 * @property {number} opponentAuroraVeilTurns
 * @property {number} gravityTurns
 * @property {number} mudSportTurns
 * @property {number} waterSportTurns
 * @property {boolean} [forceEnd]
 * @property {'wild' | 'trainer' | 'wild_double' | 'trainer_double'} battleType
 * @property {string} opponentName
 * @property {RPGPokemon[]} opponentParty
 * @property {number} opponentMoney
 * @property {boolean | 'copyvolatile'} [playerShouldSwitch]
 * @property {{ slotIndex: number, slot: ActivePokemonSlot, isBatonPass: boolean }} [pendingPivot]
 * @property {{ slotIndex: number, slot: ActivePokemonSlot, isBatonPass: boolean }} [aiPendingPivot]
 * @property {[ActivePokemonSlot | null, ActivePokemonSlot | null]} playerSlots
 * @property {[ActivePokemonSlot | null, ActivePokemonSlot | null]} opponentSlots
 * @property {{ [slotIndex: number]: { actionType: 'move' | 'switch', moveId?: string, targetSlot?: number, switchToPokemonId?: string, pokemonId: string } | null }} pendingActions
 * @property {{ slotIndex: number, moveId: 'futuresight' | 'doomdesire', turnsLeft: number, attackerSlotIndex: number, attackerStats: { atk: number, spa: number } }[]} playerFutureMoves
 * @property {{ slotIndex: number, moveId: 'futuresight' | 'doomdesire', turnsLeft: number, attackerSlotIndex: number, attackerStats: { atk: number, spa: number } }[]} opponentFutureMoves
 */
export interface BattleState {
	playerId: string;
	turn: number;
	zoneId: string;
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

	battleType: 'wild' | 'trainer' | 'wild_double' | 'trainer_double';
	opponentName: string;
	opponentParty: RPGPokemon[];
	opponentMoney: number;

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

	messageLog: string[];
	currentView: string;
	viewContext?: any;
	battleResult: 'pending' | 'win' | 'loss' | 'run' | 'catch';
}

/**
 * @typedef {Object} TrainerSpec
 * @property {string} name
 * @property {{ species: string, level: number, moves?: string[], item?: string }[]} party
 * @property {number} money
 * @property {{ start: string, win: string, lose: string }} [dialogue]
 * @property {'single' | 'double'} [battleType]
 */
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

/**
 * @typedef {Object} AbilityContext
 * @property {RPGPokemon} attacker
 * @property {RPGPokemon} defender
 * @property {ActivePokemonSlot} attackerSlot
 * @property {ActivePokemonSlot} defenderSlot
 * @property {Move} move
 * @property {BattleState} battle
 * @property {string[]} messageLog
 * @property {number} [effectiveness]
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

export type AbilityImmunityHandler = (ctx: AbilityContext) => { immune: boolean, message?: string } | null;
export type AbilityPowerModifierHandler = (ctx: AbilityContext, basePower: number) => number;
export type AbilityDamageModifierHandler = (ctx: AbilityContext, damage: number) => number;
export type AbilityStatModifierHandler = (pokemon: RPGPokemon, stat: string, value: number, slot?: ActivePokemonSlot, battle?: BattleState) => number;
export type AbilityTypeModifierHandler = (ctx: AbilityContext, moveType: string) => string;
export type AbilityOnSwitchInHandler = (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void;
export type AbilityOnDamageHandler = (ctx: AbilityContext, damage: number) => void;
export type AbilityOnMoveHandler = (ctx: AbilityContext) => void;
