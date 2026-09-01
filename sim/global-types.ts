/* eslint-disable @typescript-eslint/no-unused-vars */

type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
};

type MethodsOf<T> = {
	[K in keyof T as NonNullable<T[K]> extends (...args: any[]) => any ? K : never]: T[K];
};

type Battle = import('./battle').Battle;
type BattleQueue = import('./battle-queue').BattleQueue;
type BattleActions = import('./battle-actions').BattleActions;
type Field = import('./field').Field;
type Action = import('./battle-queue').Action;
type MoveAction = import('./battle-queue').MoveAction;
type ActionChoice = import('./battle-queue').ActionChoice;
type ModdedDex = import('./dex').ModdedDex;
type Pokemon = import('./pokemon').Pokemon;
type PRNGSeed = import('./prng').PRNGSeed;
type Side = import('./side').Side;
type TeamValidator = import('./team-validator').TeamValidator;
type PokemonSources = import('./team-validator').PokemonSources;

/** An ID must be lowercase alphanumeric. */
type ID = '' | Lowercase<string> & { __isID: true };
/** Like ID, but doesn't require you to type `as ID` to define it. For data files and object keys. */
type IDEntry = Lowercase<string>;
type PokemonSlot = '' | IDEntry & { __isSlot: true };
interface AnyObject { [k: string]: any }

type GenderName = 'M' | 'F' | 'N' | '';
type StatIDExceptHP = 'atk' | 'def' | 'spa' | 'spd' | 'spe';
type StatID = 'hp' | StatIDExceptHP;
type StatsExceptHPTable = { [stat in StatIDExceptHP]: number };
type StatsTable = { [stat in StatID]: number };
type SparseStatsTable = Partial<StatsTable>;
type BoostID = StatIDExceptHP | 'accuracy' | 'evasion';
type BoostsTable = { [boost in BoostID]: number };
type SparseBoostsTable = Partial<BoostsTable>;
type Nonstandard = 'Past' | 'Future' | 'Unobtainable' | 'CAP' | 'LGPE' | 'Custom';

type PokemonSet = import('./teams').PokemonSet;

declare namespace TierTypes {
	export type Singles = "AG" | "Uber" | "(AG)" | "OU" | "(OU)" | "UUBL" | "UU" | "RUBL" | "RU" | "NUBL" | "NU" |
		"PUBL" | "PU" | "ZUBL" | "ZU" | "NFE" | "LC";
	export type Doubles = "DUber" | "(DUber)" | "DOU" | "(DOU)" | "DBL" | "DUU" | "(DUU)" | "NFE" | "LC";
	export type Other = "Unreleased" | "Illegal" | "CAP" | "CAP NFE" | "CAP LC";
}

interface EventInfo {
	generation: number;
	level?: number;
	/** true: always shiny, 1: sometimes shiny, false | undefined: never shiny */
	shiny?: boolean | 1;
	gender?: GenderName;
	nature?: string;
	ivs?: SparseStatsTable;
	perfectIVs?: number;
	/** true: has hidden ability, false | undefined: never has hidden ability */
	isHidden?: boolean;
	abilities?: IDEntry[];
	maxEggMoves?: number;
	moves?: IDEntry[];
	pokeball?: IDEntry;
	from?: string;
	/** Japan-only events can't be transferred to international games in Gen 1 */
	japan?: boolean;
	/** For Emerald event eggs to allow Pomeg glitched moves */
	emeraldEventEgg?: boolean;
	source?: string;
}

type Effect = Ability | Item | ActiveMove | Species | Condition | Format;

interface CommonHandlers {
	ModifierEffect: (this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | void;
	ModifierMove: (this: Battle, relayVar: number, target: Pokemon, source: Pokemon, move: ActiveMove) => number | void;
	ResultMove: boolean | (
		(this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove) => boolean | null | "" | void
	);
	ExtResultMove: boolean | (
		(this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove) => boolean | null | number | "" | void
	);
	VoidEffect: (this: Battle, target: Pokemon, source: Pokemon, effect: Effect) => void;
	VoidMove: (this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	ModifierSourceEffect: (
		this: Battle, relayVar: number, source: Pokemon, target: Pokemon, effect: Effect
	) => number | void;
	ModifierSourceMove: (
		this: Battle, relayVar: number, source: Pokemon, target: Pokemon, move: ActiveMove
	) => number | void;
	ResultSourceMove: boolean | (
		(this: Battle, source: Pokemon, target: Pokemon, move: ActiveMove) => boolean | null | "" | void
	);
	ExtResultSourceMove: boolean | (
		(this: Battle, source: Pokemon, target: Pokemon, move: ActiveMove) => boolean | null | number | "" | void
	);
	VoidSourceEffect: (this: Battle, source: Pokemon, target: Pokemon, effect: Effect) => void;
	VoidSourceMove: (this: Battle, source: Pokemon, target: Pokemon, move: ActiveMove) => void;
}

type TableGenericTag = "True Past" | "Past Unobtainable";
type TableSpeciesTag = "Mythical" | "Restricted Legendary" | "Sub-Legendary" | "Ultra Beast" | "Paradox" | "Pokestar";
type TableTag = TableGenericTag | TableSpeciesTag;

interface EffectData {
	name?: string;
	duration?: number;
	durationCallback?: (this: Battle, target: Pokemon, source: Pokemon, effect: Effect | null) => number;
	effectType?: string;
	infiltrates?: boolean;
	placeholderFor?: string;
	isNonstandard?: Nonstandard | null;
	/** "Are you or are you not on this list" data. */
	tags?: TableTag[];
}

type ModdedEffectData = EffectData | Partial<EffectData> & { inherit: true };

type EffectType =
	'Condition' | 'Pokemon' | 'Move' | 'Item' | 'Ability' | 'Format' |
	'Nature' | 'Ruleset' | 'Weather' | 'Status' | 'Terrain' | 'Rule' | 'ValidatorRule';

interface BasicEffect extends EffectData {
	id: ID;
	effectType: EffectType;
	exists: boolean;
	fullname: string;
	gen: number;
	sourceEffect: string;
	toString: () => string;
}

type Condition = import('./dex-conditions').Condition;

type ActiveMove = import('./dex-moves').ActiveMove;
type Move = import('./dex-moves').Move;
type MoveTarget = import('./dex-moves').MoveTarget;

type Item = import('./dex-items').Item;

type Ability = import('./dex-abilities').Ability;

type Species = import('./dex-species').Species;

type Format = import('./dex-formats').Format;

type Nature = import('./dex-data').Nature;

type GameType = 'singles' | 'doubles' | 'triples' | 'rotation' | 'multi' | 'freeforall';
type SideID = 'p1' | 'p2' | 'p3' | 'p4';

type SpreadMoveTargets = (Pokemon | false | null)[];
type SpreadMoveDamage = (number | boolean | undefined)[];
type ZMoveOptions = ({ move: string, target: MoveTarget } | null)[];

interface BattleScriptsData {
	gen: number;
}

type ModdedBattleActions = Partial<MethodsOf<BattleActions>> & {
	inherit?: true,

	// OM
	mutateOriginalSpecies?: (species: Species, deltas: AnyObject) => Species,
	getFormeChangeDeltas?: (formeChangeSpecies: Species, pokemon?: Pokemon) => AnyObject,
	getMixedSpecies?: (originalName: string, megaName: string, pokemon?: Pokemon) => Species,
} & ThisType<BattleActions>;

type ModdedBattleSide = Partial<MethodsOf<Side>> & {
	inherit?: true,
} & ThisType<Side>;

type ModdedBattlePokemon = Partial<MethodsOf<Pokemon>> & {
	inherit?: true,

	// OM
	lostItemForDelibird?: Item | null,
	getLinkedMoves?: (this: Pokemon, ignoreDisabled?: boolean) => [ActiveMove, ActiveMove] | [],
	hasLinkedMove?: (this: Pokemon, move: ActiveMove) => boolean,
	getIsMoveLocked?: (this: Pokemon) => boolean,
	getWillLockMove?: (this: Pokemon) => boolean,
	getCanLinkMove?: (this: Pokemon, move: ActiveMove) => boolean,
	queryLinkMove?: (
		this: Pokemon, move: ActiveMove, ignoreDisabled?: boolean
	) => { linkIndex: number, linkedMoves: [ActiveMove, ActiveMove] },
} & ThisType<Pokemon>;

type ModdedBattleQueue = Partial<MethodsOf<BattleQueue>> & {
	inherit?: true,
} & ThisType<BattleQueue>;

type ModdedField = Partial<MethodsOf<Field>> & {
	inherit?: true,
} & ThisType<Field>;

type ModdedBattleScriptsData = Partial<BattleScriptsData> & Partial<MethodsOf<Battle>> & {
	inherit?: string,
	init?: (this: ModdedDex) => void,
	actions?: ModdedBattleActions,
	pokemon?: ModdedBattlePokemon,
	queue?: ModdedBattleQueue,
	field?: ModdedField,
	side?: ModdedBattleSide,

	// OM
	resolveTargetLoc?: (targetLoc: number, action: Action, move: ActiveMove) => number,
} & ThisType<Battle>;

type TypeInfo = import('./dex-data').TypeInfo;

interface PlayerOptions {
	name?: string;
	avatar?: string;
	rating?: number;
	team?: PokemonSet[] | string | null;
	seed?: PRNGSeed;
}

type TranslationString = string | null;

interface BasicTextData {
	desc?: TranslationString;
	shortDesc?: TranslationString;
	grammar?: TranslationString;
	articleRule?: 'stressed-a';
	classified?: {
		name: string,
		grammar: string,
		articleRule?: 'stressed-a',
	};
}
interface ConditionTextData extends BasicTextData {
	activate?: TranslationString;
	addItem?: TranslationString;
	block?: TranslationString;
	boost?: TranslationString;
	cant?: TranslationString;
	changeAbility?: TranslationString;
	damage?: TranslationString;
	end?: TranslationString;
	heal?: TranslationString;
	move?: TranslationString;
	start?: TranslationString;
	transform?: TranslationString;
}

interface MoveTextData extends ConditionTextData {
	alreadyStarted?: TranslationString;
	blockSelf?: TranslationString;
	clearBoost?: TranslationString;
	endFromItem?: TranslationString;
	fail?: TranslationString;
	failSelect?: TranslationString;
	failTooHeavy?: TranslationString;
	failWrongForme?: TranslationString;
	megaNoItem?: TranslationString;
	prepare?: TranslationString;
	removeItem?: TranslationString;
	startFromItem?: TranslationString;
	startFromZEffect?: TranslationString;
	switchOut?: TranslationString;
	takeItem?: TranslationString;
	typeChange?: TranslationString;
	upkeep?: TranslationString;
}

type TextFile<T> = T & {
	name: TranslationString,
	gen1?: T,
	gen2?: T,
	gen3?: T,
	gen4?: T,
	gen5?: T,
	gen6?: T,
	gen7?: T,
	gen8?: T,
	champions?: T,
};

type AbilityText = TextFile<ConditionTextData & {
	activateFromItem?: TranslationString,
	activateNoTarget?: TranslationString,
	copyBoost?: TranslationString,
	transformEnd?: TranslationString,
}>;
type MoveText = TextFile<MoveTextData>;
type ItemText = TextFile<ConditionTextData>;
interface SpeciesText {
	/**
	 * Full species + short forme name - "Wormadam-Plant"
	 *
	 * Not the actual full official name, but the one Showdown uses that's
	 * reasonably concise and mostly fits into teambuilder. Includes formes for
	 * many but not all base formes. Can't contain parentheses because it's
	 * designed to be used like "Go! Planty (Wormadam-Plant)".
	 */
	name?: TranslationString;
	/** Species name by itself, without forme - "Wormadam" */
	baseSpecies?: TranslationString;
	/** Official forme name - "Plant Cloak" */
	forme?: TranslationString;
	grammar?: TranslationString;
}
type DefaultText = AnyObject;
interface TagText {
	name?: TranslationString;
	/** used in move tooltips */
	hint?: TranslationString;
	desc?: TranslationString;
}

type ResolvedText<T extends BasicTextData> = T & { name: string, desc: string, shortDesc: string };
type ResolvedAbilityText = ResolvedText<AbilityText>;
type ResolvedItemText = ResolvedText<ItemText>;
type ResolvedMoveText = ResolvedText<MoveText>;
type ResolvedNameText = { name: string };
type ResolvedTagText = { name: string, hint?: string, desc?: string };
type ResolvedSpeciesText = { name: string, baseSpecies: string, forme?: string, grammar?: string };

declare namespace RandomTeamsTypes {
	export interface TeamDetails {
		megaStone?: number;
		zMove?: number;
		snow?: number;
		hail?: number;
		rain?: number;
		sand?: number;
		sun?: number;
		stealthRock?: number;
		spikes?: number;
		toxicSpikes?: number;
		stickyWeb?: number;
		rapidSpin?: number;
		defog?: number;
		screens?: number;
		illusion?: number;
		statusCure?: number;
		teraBlast?: number;
		imprison?: number;
		dynamaxUser?: number;
	}
	export interface FactoryTeamDetails {
		megaCount?: number;
		zCount?: number;
		wantsTeraCount?: number;
		forceResult: boolean;
		weather?: string;
		terrain?: string[];
		typeCount: { [k: string]: number };
		typeComboCount: { [k: string]: number };
		baseFormes: { [k: string]: number };
		has: { [k: string]: number };
		weaknesses: { [k: string]: number };
		resistances: { [k: string]: number };
		gigantamax?: boolean;
	}
	export interface RandomSet {
		name: string;
		species: string;
		speciesId?: string;
		gender: string | boolean;
		moves: string[];
		ability: string;
		evs: SparseStatsTable;
		ivs: SparseStatsTable;
		item: string;
		level: number;
		shiny: boolean;
		nature?: string;
		happiness?: number;
		dynamaxLevel?: number;
		gigantamax?: boolean;
		teraType?: string;
		role?: Role;
	}
	export interface RandomFactorySet {
		name: string;
		species: string;
		gender: string;
		item: string;
		ability: string;
		shiny: boolean;
		level: number;
		happiness: number;
		evs: SparseStatsTable;
		ivs: SparseStatsTable;
		nature: string;
		moves: string[];
		dynamaxLevel?: number;
		gigantamax?: boolean;
		wantsTera?: boolean;
		teraType?: string;
	}
	export interface RandomDraftFactorySet {
		name: string;
		species: string;
		gender: string;
		moves: string[];
		ability: string;
		evs: SparseStatsTable;
		ivs: SparseStatsTable;
		item: string;
		level: number;
		shiny: boolean;
		nature?: string;
		happiness?: number;
		dynamaxLevel?: number;
		gigantamax?: boolean;
		teraType?: string;
		teraCaptain?: boolean;
	}
	export interface RandomSetData {
		role: Role;
		movepool: string[];
		abilities?: string[];
		teraTypes?: string[];
		preferredTypes?: string[];
	}
	export interface RandomSpeciesData {
		level?: number;
		sets: RandomSetData[];
	}
	export type Role = '' | 'Fast Attacker' | 'Setup Sweeper' | 'Wallbreaker' | 'Tera Blast user' |
		'Bulky Attacker' | 'Bulky Setup' | 'Fast Bulky Setup' | 'Bulky Support' | 'Fast Support' | 'AV Pivot' |
		'Doubles Fast Attacker' | 'Doubles Setup Sweeper' | 'Doubles Wallbreaker' | 'Doubles Bulky Attacker' |
		'Doubles Bulky Setup' | 'Offensive Protect' | 'Bulky Protect' | 'Doubles Support' | 'Choice Item user' |
		'Z-Move user' | 'Staller' | 'Spinner' | 'Generalist' | 'Berry Sweeper' | 'Thief user' | 'Imprisoner' |
		'Dynamax User';
}
