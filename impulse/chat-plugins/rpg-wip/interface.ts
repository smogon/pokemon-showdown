/*
* Pokemon Showdown
* RPG Interface & Types
*/
export type Status = 'psn' | 'tox' | 'brn' | 'par' | 'slp' | 'frz';

// [NEW] Define generic effects for items to remove hardcoding
export interface ItemEffects {
	// Healing
	healAmount?: number;      // Flat HP (e.g., 20)
	healPercent?: number;     // Percent HP (e.g., 1.0 for full)
	statusCure?: Status | 'all'; // Cure specific status or all
	
	// Revival
	revive?: boolean;         // Is this a revival item?
	reviveHealthPercent?: number; // 0.5 for half, 1.0 for full
	
	// Friendship / Sentiment
	// Used for bitter items (negative) or happiness items (positive)
	friendshipChange?: number; 

	// PP
	ppRestore?: number;       // Amount to restore (10) or -1 for Max
	ppRestoreAll?: boolean;   // Apply to all moves?

	// Stats (Vitamins/Feathers)
	evBoost?: { stat: keyof Stats, amount: number };
	
	// Leveling
	levelBoost?: number;      // Rare Candy = 1
	expBoost?: number;        // Exp Candy
	
	// Evolution
	evolutionItem?: boolean;  // Stone or Held Item
	
	// Battle Properties
	canTerastallize?: boolean; // Tera Shard
}

export interface InventoryItem {
	id: string;
	name: string;
	category: 'pokeball' | 'medicine' | 'berry' | 'tm' | 'key' | 'misc' | 'held';
	description: string;
	quantity: number;
	effects?: ItemEffects; // [NEW] Linked effects object
	price?: number;        // [NEW] Price defined on the item itself
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
	lockedMoveCounter?: number;
	mustRecharge?: boolean;
	uproarTurns?: number;
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
	wishTurns?: number;
	consumedBerry?: string;
	harvestUsedThisTurn?: boolean;
	cudChewBerry?: string;

	boosterEnergyActive?: boolean;
	gulpMissileForm?: 'gulping' | 'gorging' | null;
	commanderActive?: boolean;
	commanderBoost?: boolean;
	hasSwitchedOut?: boolean;
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
	storyFlags: Set<string>;
	defeatedTrainers: Set<string>;
	obtainedBadges: string[];
	visitedLocations: Set<string>;
	lastPokemonCenter?: string;
	completedNPCActions: Set<string>;
	battleTowerFloor: number;
}

export interface BattleState {
	playerId: string;
	turn: number;
	zoneId: string;
	playerHazards: string[];
	opponentHazards: string[];
	weather?: { type: string, turns: number };
	locationWeather?: { type: string };
	trickRoomTurns: number;
	magicRoomTurns: number;
	wonderRoomTurns: number;
	terrain?: { type: string, turns: number };
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
	trainerId?: string;
	playerShouldSwitch?: boolean | 'copyvolatile';
	pendingPivot?: { slotIndex: number, slot: ActivePokemonSlot, isBatonPass: boolean };
	aiPendingPivot?: { slotIndex: number, slot: ActivePokemonSlot, isBatonPass: boolean };
	playerSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null];
	opponentSlots: [ActivePokemonSlot | null, ActivePokemonSlot | null];
	pendingActions: { [slotIndex: number]: any };
	playerFutureMoves: any[];
	opponentFutureMoves: any[];
	battleLog: string[];
	floor: number;
	overridePlayerParty: RPGPokemon[] | null;
	battleTowerFormat?: string;
}

export interface NPCData {
	id: string;
	name: string;
	location: string;
	dialogue: string;
	flags?: string[];
	action?: any;
	npcType?: string;
}

export interface ScriptedEvent {
	id: string;
	name: string;
	type: string;
	[key: string]: any;
}
