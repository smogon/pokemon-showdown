/*
* Pokemon Showdown
* RPG Interface & Types
*/
export type Status = 'psn' | 'tox' | 'brn' | 'par' | 'slp' | 'frz';

export interface InventoryItem {
	id: string;
	name: string;
	category: 'pokeball' | 'medicine' | 'berry' | 'tm' | 'key' | 'misc' | 'held';
	description: string;
	quantity: number;
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
	isTrapped: { turns: number } | null;
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
	};
	// Story progression tracking
	storyFlags: Set<string>;
	defeatedTrainers: Set<string>;
	obtainedBadges: string[];
	visitedLocations: Set<string>;
	lastPokemonCenter?: string; // Track the last Pokemon Center visited for respawn
}

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
	fairyLockTurns: number;
	ionDelugeTurns: number;

	forceEnd?: boolean;

	playerTerastallizeUsed: boolean;
	opponentTerastallizeUsed: boolean;

	battleType: 'wild' | 'trainer' | 'wild_double' | 'trainer_double';
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
export type AbilityOnKOHandler = (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void;
export type AbilityEndOfTurnHandler = (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void;
export type AbilityStatDropResponseHandler = (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[], sourceSlot?: ActivePokemonSlot) => void;
export type AbilityStatChangeModifierHandler = (value: number, ability: string) => number;
