export type Status = 'psn' | 'tox' | 'brn' | 'par' | 'slp' | 'frz';

export interface ItemEffects {

	healAmount?: number;
	healPercent?: number;
	statusCure?: Status | 'all';

	revive?: boolean;
	reviveHealthPercent?: number;

	friendshipChange?: number;

	ppRestore?: number;
	ppRestoreAll?: boolean;

	evBoost?: {
		stat: keyof Stats,
		amount: number,
	};

	// Battle-only stat boost (temporary during battle, like X Attack, X Defense, etc.)
	battleStatBoost?: {
		stat: 'atk' | 'def' | 'spa' | 'spd' | 'spe' | 'accuracy' | 'evasion',
		stages: number,
	};

	levelBoost?: number;
	expBoost?: number;

	evolutionItem?: boolean;

	canTerastallize?: boolean;
}

export interface InventoryItem {
	id: string;
	name: string;
	category: 'pokeball' | 'medicine' | 'berry' | 'tm' | 'key' | 'misc' | 'held' | 'stone';
	description: string;
	quantity: number;
	effects?: ItemEffects;
	price?: number;
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
	hasActedThisTurn?: boolean;
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
	consecutiveMoveCount?: number;
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
	toxicCounter?: number;

	// Tier 1 move additions
	isAttracted?: boolean;
	destinyBondActive?: boolean;
	grudgeActive?: boolean;
	sleepTalkMove?: string;
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
	battleTowerHighestFloor?: number;
	pokedex?: { seen: Set<string>, caught: Set<string> };
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
	playerMistTurns: number;
	opponentMistTurns: number;
	playerTailwindTurns: number;
	opponentTailwindTurns: number;
	gravityTurns: number;
	mudSportTurns: 0;
	waterSportTurns: number;
	fairyLockTurns: number;
	ionDelugeTurns: number;

	forceEnd?: boolean;
	battleEnded?: boolean;
	battleResult?: 'victory' | 'defeat';

	playerTerastallizeUsed: boolean;
	opponentTerastallizeUsed: boolean;

	// Simplified battle types
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

	battleLog: string[];

	persistentPokemonState: Record<string, {
		terastallized?: string,
		sleepCounter?: number,
		toxicCounter?: number,
	}>;

	floor: number;
	overridePlayerParty: RPGPokemon[] | null;
	battleTowerFormat?: string;
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

	// Access Control
	requiredFlag?: string | string[];
	preventIfFlag?: string | string[];
	requiredBadge?: string | string[];
	blockMessage?: string; // NEW: Message to show if access is denied

	// Rewards / State Change
	setFlag?: string | string[];
	removeFlag?: string | string[];
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

export interface NPCAction {
	type: 'heal' | 'giveitem' | 'givepokemon' | 'takeitem' | 'exchangeitems' | 'choosestarter' |
	'battlerequest' | 'questchain' | 'delivery' | 'conditionaldialogue' | 'escort' |
	'rivalbattle' | 'moverelearner';

	// Generic / Shared properties
	onceOnly?: boolean;
	requiredFlag?: string;
	itemId?: string;
	quantity?: number;
	cost?: number;

	// Specific properties
	pokemon?: { species: string, level: number };
	requiredItem?: string;
	requiredQuantity?: number;
	trainerId?: string;
	battleCooldown?: number; // hours
	questId?: string;
	questStages?: any[];
	starterLevel?: number;
	relearnerCost?: number;
	rivalTeam?: any[];
	rivalDialogue?: any;
	targetNpcId?: string;
	deliveryItem?: { itemId: string, quantity: number };
	defaultDialogue?: string;
	dialogueConditions?: { dialogue: string, minBadges?: number, maxBadges?: number, requiredFlag?: string, preventIfFlag?: string }[];
	escortDestination?: string;
}

export interface NPCData {
	id: string;
	name: string;
	location: string;
	dialogue: string;
	flags?: string[];
	action?: NPCAction;
	npcType?: 'normal' | 'movetutor' | 'movedeleter' | 'namerater' | 'nurse' | 'shopkeeper' | 'gymleader' | 'elitefoura' | 'champion' | 'rival';
}

export interface ScriptedEvent {
	id: string;
	name: string;
	type: string;
	triggerOnce?: boolean;
	
	requiredFlag?: string | string[]; // Supports single or multiple flags
	setFlag?: string | string[]; // Supports single or multiple flags
	removeFlag?: string | string[]; // Supports single or multiple flags
	preventIfFlag?: string | string[]; // Supports single or multiple flags

	requiredBadgeCount?: number;
	maxBadgeCount?: number;

	// Event specific data
	cutsceneScript?: string[];
	choices?: { text: string, resultFlag?: string, resultDialogue?: string }[];
	question?: string;
	answers?: string[];
	correctAnswer?: number;
	pathOptions?: { name: string, pathFlag: string, description?: string }[];
	exclusivePaths?: boolean;
	bossTrainerId?: string;
	bossPhases?: number;
	weatherDuration?: number;
	newWeather?: string;
	itemBallContents?: { itemId: string, quantity: number };
	pokemon?: { species: string, level?: number, moves?: string[], shiny?: boolean };
	warpDestination?: string;
	warpType?: string;
	gymLeaderId?: string;
	gymTrainers?: string[];
	eliteFourOrder?: string[];
	championId?: string;
	hallOfFameEntry?: boolean;
	flashbackText?: string;
	flashbackCharacters?: string[];
	dreamText?: string;
	isNightmare?: boolean;
	loreTitle?: string;
	loreText?: string;
	epilogueText?: string;
	epilogueCharacters?: string[];
	chapterNumber?: number;
	chapterTitle?: string;
	nextOpponent?: string; // Runtime property
}

export interface LocationConnection {
	id: string;
	name: string;
	requiredBadge?: string | string[]; // Supports single or multiple badges
	requiredFlag?: string | string[]; // Supports single or multiple flags
	preventIfFlag?: string | string[]; // Supports single or multiple flags
	blockMessage?: string;
}

export interface Building {
	id: string;
	type: 'pokecenter' | 'pokemart' | 'gym' | 'lab' | 'department' | 'gameCorner' | 'misc';
	name: string;
	description: string;
	npcs?: string[];
	accessible?: boolean;
	
	requiredFlag?: string | string[]; // Supports single or multiple flags
	requiredBadge?: string | string[]; // Supports single or multiple badges
	preventIfFlag?: string | string[]; // Supports single or multiple flags
	blockMessage?: string;
	
	setFlag?: string | string[]; // Supports single or multiple flags
	removeFlag?: string | string[]; // Supports single or multiple flags
	
	gymLeaderId?: string;
	trainers?: string[]; // NEW: List of trainer IDs in this building
}

export interface Location {
	id?: string;
	name: string;
	description?: string;
	connectedLocations: LocationConnection[];
	buildings?: Building[];
	encounterZones?: string[];
	scriptedEvents?: ScriptedEvent[];
	
	setFlag?: string | string[]; // Supports single or multiple flags
	removeFlag?: string | string[]; // Supports single or multiple flags
}

export interface EncounterZone {
	name: string;
	pokemon: string[];
	levelRange: [number, number];
	battleType?: 'single' | 'double';
	
	requiredFlag?: string | string[];
	requiredBadge?: string | string[];
	preventIfFlag?: string | string[];
	blockMessage?: string;
}
