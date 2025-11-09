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
	completedNPCActions: Set<string>; // Track NPCs that have completed one-time actions
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
	locationWeather?: {
		type: 'sun' | 'rain' | 'sand' | 'hail',
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
export type AbilityStatModifierHandler = (
	pokemon: RPGPokemon, stat: string, value: number, slot?: ActivePokemonSlot, battle?: BattleState
) => number;
export type AbilityTypeModifierHandler = (ctx: AbilityContext, moveType: string) => string;
export type AbilityOnSwitchInHandler = (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void;
export type AbilityOnDamageHandler = (ctx: AbilityContext, damage: number) => void;
export type AbilityOnMoveHandler = (ctx: AbilityContext) => void;
export type AbilityOnKOHandler = (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void;
export type AbilityEndOfTurnHandler = (slot: ActivePokemonSlot, battle: BattleState, messageLog: string[]) => void;
export type AbilityStatDropResponseHandler = (
	slot: ActivePokemonSlot, battle: BattleState, messageLog: string[], sourceSlot?: ActivePokemonSlot
) => void;
export type AbilityStatChangeModifierHandler = (value: number, ability: string) => number;

export interface NPCAction {
	type: 'giveitem' | 'givepokemon' | 'exchangeitems' | 'takeitem' | 'movetutor' | 'movedeleter' | 'namerater' | 'tradepokemon' |
		'fossilrevival' | 'dailyreward' | 'battlerequest' | 'questchain' | 'itemcraft' | 'berryplant' | 'pokemongrooming' |
		'fortuneteller' | 'pokemonbreeder' | 'moverelearner' | 'abilitycapsule' | 'evtrainer' | 'ivchecker' |
		'mysterygift' | 'lottery' | 'masseuse' | 'haircutter' | 'photographer' |
		'fishing' | 'bikeshop' | 'coinexchange' | 'tutorcombo' | 'apricorncrafter' | 'pokeathlon' | 'musicalprops' |
		'berryblender' | 'pokeblockmixer' | 'poffincooking' | 'rivalbattle' | 'gymrematch' | 'shardtrader' |
		'wingcollector' | 'scalecollector' | 'opower' | 'heal';
	itemId?: string;
	quantity?: number;
	pokemon?: { species: string, level: number, moves?: string[] };
	requiredItem?: string;
	requiredQuantity?: number;
	onceOnly?: boolean;
	// Move tutor
	moveId?: string; // Move to teach
	cost?: number; // Cost in money
	// Trade pokemon
	wantedSpecies?: string; // Pokemon player must give
	offeredPokemon?: { species: string, level: number, moves?: string[] }; // Pokemon NPC offers
	// Fossil revival
	fossils?: string[]; // List of accepted fossil items
	revivalCost?: number; // Cost to revive fossil
	// Daily reward
	rewards?: { itemId: string, quantity: number, days?: number }[]; // Daily login rewards
	lastClaimTime?: number; // Timestamp of last claim
	// Battle request
	trainerId?: string; // Trainer to battle
	battleCooldown?: number; // Hours between battles
	battleReward?: { itemId?: string, money?: number }; // Reward for winning
	// Quest chain
	questId?: string; // Quest identifier
	questStages?: { stage: number, description: string, requiredFlag?: string, reward?: any }[];
	currentStage?: number; // Current stage of quest
	// Item craft
	recipes?: { inputs: { itemId: string, quantity: number }[], output: { itemId: string, quantity: number } }[];
	// Berry planting
	berryId?: string; // Berry to plant
	growthTime?: number; // Hours to grow
	yieldQuantity?: number; // Number of berries harvested
	// Pokemon grooming
	groomingCost?: number; // Cost to groom
	friendshipBoost?: number; // Friendship increase
	// Fortune teller
	fortuneTypes?: string[]; // Types of fortunes (luck, battle, catch)
	fortuneDuration?: number; // Hours fortune lasts
	// Pokemon breeder
	breedingCost?: number; // Cost per breeding
	eggGroupCompatibility?: boolean; // Check egg group
	// Move relearner
	relearnerCost?: number; // Cost per move
	allowEggMoves?: boolean; // Can relearn egg moves
	// Ability capsule
	capsuleCost?: number; // Cost to change ability
	// EV trainer
	evStat?: string; // Stat to train (atk, def, etc.)
	evCost?: number; // Cost per EV point
	evAmount?: number; // EVs to add
	// IV checker
	showIVs?: boolean; // Display exact IVs
	// Mystery gift
	mysteryGiftId?: string; // Gift identifier
	giftContents?: { pokemon?: any, item?: any }; // Contents of gift
	// Lottery
	lotteryTicketCost?: number; // Cost per ticket
	lotteryPrizes?: { itemId: string, chance: number }[]; // Possible prizes
	// Masseuse
	massageCost?: number; // Cost for massage
	massageFriendshipBoost?: number; // Friendship increase
	// Hair cutter
	haircutCost?: number; // Cost for haircut
	haircutFriendshipBoost?: number; // Friendship increase
	// Photographer
	photographyCost?: number; // Cost to take photo
	photoReward?: { itemId: string, quantity: number }; // Reward for photo
	// Fishing
	fishingRodType?: 'old' | 'good' | 'super'; // Type of fishing rod
	fishingRodCost?: number; // Cost to purchase fishing rod
	// Bike shop
	bikeCost?: number; // Cost to purchase bike
	bikeType?: 'regular' | 'mach' | 'acro'; // Type of bike
	// Coin exchange
	coinRate?: number; // Coins per money unit
	prizeList?: { itemId: string, coinCost: number }[]; // Items purchasable with coins
	// Tutor combo
	comboMoves?: string[]; // Multiple moves that can be taught
	comboMoveCost?: number; // Cost per move
	// Apricorn crafter
	apricornRecipes?: { apricorn: string, resultBall: string }[]; // Apricorn to Pokeball recipes
	craftingCost?: number; // Cost to craft
	// Pokeathlon
	pokeathlonEvents?: string[]; // Available events
	pokeathlonRewards?: { itemId: string, score: number }[]; // Rewards for scores
	// Musical props
	musicalPropsList?: string[]; // Available props
	musicalPropCost?: number; // Cost per prop
	// Berry blender
	berryBlenderRecipes?: { berries: string[], result: string }[]; // Berry blend recipes
	// Pokeblock mixer
	pokeblockRecipes?: { berries: string[], result: string, stats: string[] }[]; // Pokeblock recipes
	// Poffin cooking
	poffinRecipes?: { berries: string[], result: string, quality: number }[]; // Poffin recipes
	// Rival battle
	rivalTeam?: { species: string, level: number, moves?: string[] }[]; // Rival's team
	rivalDialogue?: { pre: string, win: string, lose: string }; // Rival dialogue
	// Gym rematch
	rematchTeam?: { species: string, level: number, moves?: string[] }[]; // Rematch team (higher level)
	rematchAvailable?: boolean; // Whether rematch is available
	// Shard trader
	shardTrades?: { shardColor: string, moveId?: string, itemId?: string }[]; // Shard trade options
	// Wing collector
	wingTypes?: string[]; // Types of wings accepted
	wingReward?: { itemId: string, quantity: number }; // Reward for wings
	// Scale collector
	scaleType?: string; // Type of scale (heart, etc.)
	scaleReward?: { itemId: string, quantity: number }; // Reward for scales
	// O-Power
	opowerType?: string; // Type of O-Power (attack, defense, capture, etc.)
	opowerDuration?: number; // Duration in minutes
	opowerCooldown?: number; // Cooldown in minutes
}

export interface NPCData {
	id: string;
	name: string;
	location: string;
	dialogue: string;
	flags?: string[];
	action?: NPCAction;
	npcType?: 'normal' | 'movetutor' | 'movedeleter' | 'namerater' | 'nurse' | 'shopkeeper' | 'gymleader' |
		'elitefoura' | 'champion' | 'rival' | 'professor' | 'scientist' | 'fossildiscoverer' | 'daycareworker' |
		'battlefacilityhost' | 'contestjudge' | 'trader' | 'questgiver' | 'storyteller' | 'gymtrainer' |
		'cooltrainer' | 'veteran' | 'collector' | 'breeder' | 'ranger' | 'sage' | 'mystic' | 'fortuneteller' |
		'artist' | 'musician' | 'chef' | 'fashiondesigner' | 'photographer' | 'journalist' | 'athlete' |
		'teamrocket' | 'teamadmin' | 'teamboss' | 'policeOfficer' | 'detective' | 'guard' | 'gatekeeper' |
		'fisherman' | 'hiker' | 'swimmer' | 'biker' | 'camper' | 'picnicker' | 'pokefan' | 'juggler' |
		'tamer' | 'birdkeeper' | 'tuber' | 'waiter' | 'waitress' | 'clown' | 'burglar' | 'ruinmaniac' |
		'dragontamer' | 'hexmaniac' | 'medium' | 'channeler' | 'aromalady' | 'parasollady' | 'skier' |
		'snowboarder' | 'twins' | 'sisters' | 'brothers' | 'pkmntrainer' | 'acetrainer' | 'youngster' |
		'lass' | 'bugcatcher' | 'blackbelt' | 'psychic' | 'beauty' | 'gentleman' |
		'schoolboy' | 'schoolgirl' | 'preschooler'; // Identifies special NPCs
}

export type BuildingType = 'pokecenter' | 'pokemart' | 'gym' | 'house' | 'lab' | 'museum' |
	'gameCorner' | 'department' |
	'daycare' | 'battlefacility' | 'battletower' | 'battlefrontier' | 'contesthall' | 'secretbase' | 'cafe' |
	'restaurant' | 'hotel' | 'library' | 'school' | 'dojo' | 'temple' | 'shrine' | 'lighthouse' | 'windmill' |
	'powerplant' | 'factory' | 'warehouse' | 'radio' | 'tvstation' | 'theater' | 'arcade' | 'casino' |
	'pokemonfancyclub' | 'namereater' | 'movedeleterhouse' | 'movetutorshop' | 'salon' | 'spa' | 'gym_training' |
	'fossillab' | 'pokemoncenter_mega' | 'tradestation' | 'berry_shop' | 'incubator' |
	'pokeathalon' | 'ranchhouse' | 'hideout' | 'abandonedbuilding' | 'ruins' | 'tower';

export interface Building {
	id: string;
	name: string;
	type: BuildingType;
	description: string;
	npcs?: string[]; // NPC IDs that are in this building
	gymLeaderId?: string; // For gyms
	shopTier?: number; // For pokemarts
	accessible?: boolean; // Default true, can be locked behind flags
	requiredFlag?: string;
}

export interface Location {
	id: string;
	name: string;
	type: 'town' | 'city' | 'route' | 'special' | 'cave' | 'forest' | 'mountain' | 'beach' | 'island' | 'desert' |
		'volcano' | 'lake' | 'river' | 'ocean' | 'underwater' | 'sky' | 'space' | 'distortionworld' | 'dreamworld' |
		'safari' | 'park' | 'ruins' | 'dungeon' | 'tower' | 'powerplant' | 'factory' | 'mansion' | 'castle' |
		'bridge' | 'tunnel' | 'pathway' | 'meadow' | 'swamp' | 'tundra' | 'glacier' | 'ravine' | 'plateau' |
		'canyon' | 'oasis' | 'graveyard' | 'battlefield' | 'colosseum' | 'stadium';
	description: string;
	connectedLocations: { id: string, name: string, requiredBadge?: string, requiredFlag?: string }[];
	buildings?: Building[]; // Only for towns/cities
	encounterZones?: string[]; // IDs of encounter zones available here
	scriptedEvents?: ScriptedEvent[]; // Events that trigger when entering this location
	weather?: 'sun' | 'rain' | 'sandstorm' | 'hail' | 'fog'; // Permanent weather in this location
	music?: string; // Background music theme
}

export interface ScriptedEvent {
	id: string;
	name: string;
	triggerOnce?: boolean; // If true, only triggers the first time (sets 'scripted_<id>' flag)
	requiredFlag?: string; // Only triggers if player has this flag
	requiredBadgeCount?: number; // Only triggers if player has at least this many badges
	maxBadgeCount?: number; // Only triggers if player has at most this many badges
	preventIfFlag?: string; // Won't trigger if player has this flag
	type: 'trainer' | 'dialogue' | 'item' | 'pokemon' | 'wildbattle' | 'cutscene' | 'choice' |
		'quiz' | 'puzzle' | 'riddle' | 'minigame' | 'weather_change' | 'earthquake' | 'explosion' | 'flood' |
		'meteor' | 'eclipse' | 'timewarp' | 'dimensionrift' | 'pokemonswarm' |
		'bossbattle' | 'tournament' | 'contest' | 'race' | 'scavengerhunt' | 'investigation' | 'stealth' |
		'escape' | 'rescue' | 'defense' | 'ambush' | 'betrayal' | 'alliance' | 'negotiation' |
		'discovery' | 'revelation' | 'transformation' | 'evolution_ceremony' | 'legendary_awakening' |
		'ancient_seal' | 'portal_opening' | 'dimension_merge' | 'timeloop' | 'prophecy' |
		'fishing' | 'surfing' | 'diving' | 'itemball' | 'hiddenitem' | 'roaming' | 'multibattle' |
		'photoop' | 'festival' | 'secretarea' | 'warp' | 'gymchallenge' | 'elitefourchallenge' |
		'halloffame' | 'safarizone' | 'bugcatchingcontest' | 'battlefrontier';
	trainerId?: string; // For trainer battles
	dialogue?: string; // Text to display
	itemId?: string; // Item to give
	itemQuantity?: number;
	// For 'pokemon' (gift) or 'wildbattle' types
	pokemon?: { species: string, level: number, moves?: string[], shiny?: boolean };
	setFlag?: string; // Flag to set after event completes
	// Cutscene
	cutsceneScript?: string[]; // Array of dialogue/actions
	cinematicMode?: boolean; // Full screen cutscene
	// Choice events
	choices?: { text: string, resultFlag?: string, resultDialogue?: string }[];
	// Quiz/Puzzle
	question?: string;
	answers?: string[];
	correctAnswer?: number; // Index of correct answer
	// Weather change
	newWeather?: 'sun' | 'rain' | 'sandstorm' | 'hail' | 'fog' | 'clear';
	weatherDuration?: number; // Turns or minutes
	// Pokemon swarm
	swarmSpecies?: string; // Pokemon that swarms
	swarmDuration?: number; // How long swarm lasts
	// Boss battle
	bossTrainerId?: string; // Special boss trainer
	bossPhases?: number; // Number of phases in boss battle
	// Tournament
	tournamentRounds?: number;
	tournamentOpponents?: string[]; // Trainer IDs (single-player tournament)
	// Contest
	contestType?: 'cool' | 'beauty' | 'cute' | 'smart' | 'tough';
	contestRounds?: number;
	// Investigation
	clues?: string[]; // Clues to find
	mysteryToSolve?: string; // Mystery description
	// Transformation
	transformationType?: 'mega' | 'dynamax' | 'zmove' | 'terastal' | 'fusion';
	// Fishing
	fishingEncounters?: { species: string, level: number, rarity: number }[]; // Pokemon available when fishing
	fishingRodRequired?: 'old' | 'good' | 'super'; // Required fishing rod
	// Surfing
	surfingEncounters?: { species: string, level: number, rarity: number }[]; // Pokemon available when surfing
	// Diving
	divingEncounters?: { species: string, level: number, rarity: number }[]; // Pokemon available when diving
	divingDepth?: number; // Depth level for diving
	// Item ball
	itemBallContents?: { itemId: string, quantity: number }; // Item found in pokeball
	// Hidden item
	hiddenItemLocation?: string; // Description of hidden item location
	hiddenItemRequirement?: string; // Item finder or specific ability needed
	// Roaming
	roamingPokemon?: { species: string, level: number, shiny?: boolean }; // Roaming Pokemon
	roamingLocations?: string[]; // Locations where Pokemon can appear
	// Multi battle
	partnerTrainerId?: string; // Partner trainer for tag battle
	opponentTrainerIds?: string[]; // Multiple opponents
	// Photo op
	photoSubject?: string; // What is being photographed
	photoReward?: { itemId: string, quantity: number }; // Reward for photo
	// Festival
	festivalName?: string; // Name of festival
	festivalActivities?: string[]; // Activities available
	festivalRewards?: { itemId: string, quantity: number }[]; // Festival rewards
	// Secret area
	secretAreaId?: string; // ID of secret area to unlock
	secretAreaRequirement?: string; // Requirement to unlock (item, Pokemon, etc.)
	// Warp
	warpDestination?: string; // Location ID to warp to
	warpType?: 'teleport' | 'fly' | 'dig' | 'escape rope'; // Type of warp
	// Gym challenge
	gymLeaderId?: string; // Gym leader to challenge
	gymTrainers?: string[]; // Trainers to defeat before leader
	// Elite Four challenge
	eliteFourOrder?: string[]; // Order of Elite Four members
	championId?: string; // Champion trainer ID
	// Hall of Fame
	hallOfFameEntry?: boolean; // Whether to create Hall of Fame entry
	// Safari zone
	safariSteps?: number; // Number of steps allowed
	safariBallCount?: number; // Number of Safari Balls given
	safariEncounters?: { species: string, level: number, rarity: number }[]; // Pokemon in Safari Zone
	// Bug catching contest
	contestDuration?: number; // Contest duration in minutes
	contestPrizes?: { itemId: string, rank: number }[]; // Prizes by rank
	// Battle Frontier
	frontierFacility?: string; // Facility name (Tower, Factory, etc.)
	frontierRules?: string[]; // Special rules for facility
	frontierRewards?: { itemId: string, winStreak: number }[]; // Rewards by win streak
}
