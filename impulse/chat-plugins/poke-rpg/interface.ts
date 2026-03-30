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

	commanderActive?: boolean;
	commanderBoost?: boolean;
	gulpMissileForm?: 'gulping' | 'gorging' | null;
	boosterEnergyActive?: boolean;

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

/**
 * SideState groups all side-specific battle state (screens, guards, etc.)
 * This unified structure reduces duplication between player and opponent sides.
 */
export interface SideState {
	hazards: string[];
	slots: [ActivePokemonSlot | null, ActivePokemonSlot | null];
	futureMoves: {
		slotIndex: number,
		moveId: 'futuresight' | 'doomdesire',
		turnsLeft: number,
		attackerSlotIndex: number,
		attackerStats: { atk: number, spa: number },
	}[];
	quickGuard: boolean;
	wideGuard: boolean;
	craftyShield: boolean;
	reflectTurns: number;
	lightScreenTurns: number;
	auroraVeilTurns: number;
	mistTurns: number;
	tailwindTurns: number;
	terastallizeUsed: boolean;
}

/**
 * Default values for creating a new SideState
 */
export function createSideState(): SideState {
	return {
		hazards: [],
		slots: [null, null],
		futureMoves: [],
		quickGuard: false,
		wideGuard: false,
		craftyShield: false,
		reflectTurns: 0,
		lightScreenTurns: 0,
		auroraVeilTurns: 0,
		mistTurns: 0,
		tailwindTurns: 0,
		terastallizeUsed: false,
	};
}

export interface BattleState {
	playerId: string;
	turn: number;
	zoneId: string;

	playerSide: SideState;
	opponentSide: SideState;

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

	gravityTurns: number;
	mudSportTurns: number;
	waterSportTurns: number;
	fairyLockTurns: number;
	ionDelugeTurns: number;

	forceEnd?: boolean;
	battleEnded?: boolean;
	battleResult?: 'victory' | 'defeat';

	battleType: 'wild' | 'trainer' | 'wild_double' | 'trainer_double' | 'battletower';
	opponentName: string;
	opponentParty: RPGPokemon[];
	opponentMoney: number;
	trainerId?: string;

	playerShouldSwitch?: boolean | 'copyvolatile';
	pendingPivot?: { slotIndex: number, slot: ActivePokemonSlot, isBatonPass: boolean };
	aiPendingPivot?: { slotIndex: number, slot: ActivePokemonSlot, isBatonPass: boolean };

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

/**
 * Time-based availability configuration for trainers/NPCs.
 * Allows trainers to only appear during specific times of day.
 */
export interface TimeAvailability {
	morning?: boolean;
	afternoon?: boolean;
	evening?: boolean;
	night?: boolean;
}

export interface TrainerSpec {
	name: string;
	party: {
		species: string,
		level: number,
		moves?: string[],
		item?: string,
		evs?: Partial<{ hp: number, atk: number, def: number, spa: number, spd: number, spe: number }>,
		ivs?: Partial<{ hp: number, atk: number, def: number, spa: number, spd: number, spe: number }>,
		teraType?: string,
	}[];
	money: number;
	dialogue?: {
		start: string,
		win: string,
		lose: string,
	};
	battleType?: 'single' | 'double';

	requiredFlag?: string | string[];
	preventIfFlag?: string | string[];
	requiredBadge?: string | string[];
	blockMessage?: string;

	/**
	 * Time-based availability. If defined, trainer only appears during specified times.
	 * If not defined, trainer is always available (fallback behavior).
	 */
	availableByTime?: TimeAvailability;

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

	onceOnly?: boolean;
	requiredFlag?: string;
	itemId?: string;
	quantity?: number;
	cost?: number;

	pokemon?: { species: string, level: number };
	requiredItem?: string;
	requiredQuantity?: number;
	trainerId?: string;
	battleCooldown?: number;
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

	/**
	 * Time-based availability. If defined, NPC only appears during specified times.
	 * If not defined, NPC is always available (fallback behavior).
	 */
	availableByTime?: TimeAvailability;
}

export interface ScriptedEvent {
	id: string;
	name: string;
	type: string;
	triggerOnce?: boolean;

	requiredFlag?: string | string[];
	setFlag?: string | string[];
	removeFlag?: string | string[];
	preventIfFlag?: string | string[];

	requiredBadgeCount?: number;
	maxBadgeCount?: number;

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
	nextOpponent?: string;
}

export interface LocationConnection {
	id: string;
	name: string;
	requiredBadge?: string | string[];
	requiredFlag?: string | string[];
	preventIfFlag?: string | string[];
	blockMessage?: string;
}

export interface BuildingRoom {
	id: string;
	name: string;
	description: string;
	npcs?: string[];
	trainers?: string[];

	requiredFlag?: string | string[];
	requiredBadge?: string | string[];
	preventIfFlag?: string | string[];
	blockMessage?: string;

	setFlag?: string | string[];
	removeFlag?: string | string[];

	connectedRooms?: string[];
	isEntrance?: boolean;

	type?: 'pokecenter' | 'pokemart' | 'gym' | 'lab' | 'department' | 'gameCorner' | 'misc';
	gymLeaderId?: string;
	encounterZones?: string[];
}

export interface Building {
	id: string;
	type: 'pokecenter' | 'pokemart' | 'gym' | 'lab' | 'department' | 'gameCorner' | 'misc';
	name: string;
	description: string;
	accessible?: boolean;

	requiredFlag?: string | string[];
	requiredBadge?: string | string[];
	preventIfFlag?: string | string[];
	blockMessage?: string;

	setFlag?: string | string[];
	removeFlag?: string | string[];

	rooms?: BuildingRoom[];
}

export interface Location {
	id?: string;
	name: string;
	description?: string;
	connectedLocations: LocationConnection[];
	buildings?: Building[];
	encounterZones?: string[];
	scriptedEvents?: ScriptedEvent[];

	setFlag?: string | string[];
	removeFlag?: string | string[];
}

/**
 * Time-based Pokemon encounter configuration.
 * Allows different Pokemon to appear at different times of day.
 */
export interface TimePokemon {
	morning?: string[];
	afternoon?: string[];
	evening?: string[];
	night?: string[];
}

export interface EncounterZone {
	name: string;
	/** Default Pokemon list (used if no time-based entries match or as fallback) */
	pokemon: string[];
	/** Optional time-based Pokemon lists that override the default */
	pokemonByTime?: TimePokemon;
	levelRange: [number, number];
	battleType?: 'single' | 'double';

	requiredFlag?: string | string[];
	requiredBadge?: string | string[];
	preventIfFlag?: string | string[];
	blockMessage?: string;
}
