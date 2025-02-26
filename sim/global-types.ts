/* eslint-disable @typescript-eslint/no-unused-vars */

type Mutable<T> = {
	-readonly [P in keyof T]: T[P];
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
type Nonstandard = 'Past' | 'Future' | 'Unobtainable' | 'CAP' | 'LGPE' | 'Custom' | 'Gigantamax';

type PokemonSet = import('./teams').PokemonSet;

declare namespace TierTypes {
	export type Singles = "AG" | "Uber" | "(Uber)" | "OU" | "(OU)" | "UUBL" | "UU" | "RUBL" | "RU" | "NUBL" | "NU" |
		"(NU)" | "PUBL" | "PU" | "(PU)" | "ZUBL" | "ZU" | "NFE" | "LC";
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

interface EffectData {
	name?: string;
	desc?: string;
	duration?: number;
	durationCallback?: (this: Battle, target: Pokemon, source: Pokemon, effect: Effect | null) => number;
	effectType?: string;
	infiltrates?: boolean;
	isNonstandard?: Nonstandard | null;
	shortDesc?: string;
}

type ModdedEffectData = EffectData | Partial<EffectData> & { inherit: true };

type EffectType =
	'Condition' | 'Pokemon' | 'Move' | 'Item' | 'Ability' | 'Format' |
	'Nature' | 'Ruleset' | 'Weather' | 'Status' | 'Terastal' | 'Rule' | 'ValidatorRule';

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

interface ModdedBattleActions {
	inherit?: true;
	afterMoveSecondaryEvent?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => undefined;
	calcRecoilDamage?: (this: BattleActions, damageDealt: number, move: Move, pokemon: Pokemon) => number;
	canMegaEvo?: (this: BattleActions, pokemon: Pokemon) => string | undefined | null;
	canMegaEvoX?: (this: BattleActions, pokemon: Pokemon) => string | undefined | null;
	canMegaEvoY?: (this: BattleActions, pokemon: Pokemon) => string | undefined | null;
	canTerastallize?: (this: BattleActions, pokemon: Pokemon) => string | null;
	canUltraBurst?: (this: BattleActions, pokemon: Pokemon) => string | null;
	canZMove?: (this: BattleActions, pokemon: Pokemon) => ZMoveOptions | void;
	canDynamax?: (this: BattleActions, pokemon: Pokemon, skipChecks?: boolean) => import('./side').DynamaxOptions | void;
	forceSwitch?: (
		this: BattleActions, damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => SpreadMoveDamage;
	getActiveMaxMove?: (this: BattleActions, move: Move, pokemon: Pokemon) => ActiveMove;
	getActiveZMove?: (this: BattleActions, move: Move, pokemon: Pokemon) => ActiveMove;
	getMaxMove?: (this: BattleActions, move: Move, pokemon: Pokemon) => Move | undefined;
	getSpreadDamage?: (
		this: BattleActions, damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => SpreadMoveDamage;
	getZMove?: (this: BattleActions, move: Move, pokemon: Pokemon, skipChecks?: boolean) => string | true | undefined;
	hitStepAccuracy?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean[];
	hitStepBreakProtect?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => undefined;
	hitStepMoveHitLoop?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => SpreadMoveDamage;
	hitStepTryImmunity?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean[];
	hitStepStealBoosts?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => undefined;
	hitStepTryHitEvent?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => (boolean | '')[];
	hitStepInvulnerabilityEvent?: (
		this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove
	) => boolean[];
	hitStepTypeImmunity?: (this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean[];
	moveHit?: (
		this: BattleActions, target: Pokemon | null, pokemon: Pokemon, move: ActiveMove,
		moveData?: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => number | undefined | false;
	runAction?: (this: BattleActions, action: Action) => void;
	runMegaEvo?: (this: BattleActions, pokemon: Pokemon) => boolean;
	runMegaEvoX?: (this: BattleActions, pokemon: Pokemon) => boolean;
	runMegaEvoY?: (this: BattleActions, pokemon: Pokemon) => boolean;
	runMove?: (
		this: BattleActions, moveOrMoveName: Move | string, pokemon: Pokemon, targetLoc: number, options?: {
			sourceEffect?: Effect | null, zMove?: string, externalMove?: boolean,
			maxMove?: string, originalTarget?: Pokemon,
		}
	) => void;
	runMoveEffects?: (
		this: BattleActions, damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => SpreadMoveDamage;
	runSwitch?: (this: BattleActions, pokemon: Pokemon) => boolean;
	runZPower?: (this: BattleActions, move: ActiveMove, pokemon: Pokemon) => void;
	secondaries?: (
		this: BattleActions, targets: SpreadMoveTargets, source: Pokemon, move: ActiveMove,
		moveData: ActiveMove, isSelf?: boolean
	) => void;
	selfDrops?: (
		this: BattleActions, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean
	) => void;
	spreadMoveHit?: (
		this: BattleActions, targets: SpreadMoveTargets, pokemon: Pokemon, move: ActiveMove,
		moveData?: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => [SpreadMoveDamage, SpreadMoveTargets];
	switchIn?: (
		this: BattleActions, pokemon: Pokemon, pos: number, sourceEffect: Effect | null, isDrag?: boolean
	) => boolean | "pursuitfaint";
	targetTypeChoices?: (this: BattleActions, targetType: string) => boolean;
	terastallize?: (this: BattleActions, pokemon: Pokemon) => void;
	tryMoveHit?: (
		this: BattleActions, target: Pokemon, pokemon: Pokemon, move: ActiveMove
	) => number | undefined | false | '';
	tryPrimaryHitEvent?: (
		this: BattleActions, damage: SpreadMoveDamage, targets: SpreadMoveTargets, pokemon: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean
	) => SpreadMoveDamage;
	trySpreadMoveHit?: (
		this: BattleActions, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove, notActive?: boolean
	) => boolean;
	useMove?: (
		this: BattleActions, move: Move, pokemon: Pokemon, options?: {
			target?: Pokemon | null, sourceEffect?: Effect | null,
			zMove?: string, maxMove?: string,
		}
	) => boolean;
	useMoveInner?: (
		this: BattleActions, move: Move, pokemon: Pokemon, options?: {
			target?: Pokemon | null, sourceEffect?: Effect | null,
			zMove?: string, maxMove?: string,
		}
	) => boolean;
	getDamage?: (
		this: BattleActions, pokemon: Pokemon, target: Pokemon, move: string | number | ActiveMove, suppressMessages: boolean
	) => number | undefined | null | false;
	modifyDamage?: (
		this: BattleActions, baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages?: boolean
	) => void;

	// oms
	mutateOriginalSpecies?: (this: BattleActions, species: Species, deltas: AnyObject) => Species;
	getFormeChangeDeltas?: (this: BattleActions, formeChangeSpecies: Species, pokemon?: Pokemon) => AnyObject;
	getMixedSpecies?: (this: BattleActions, originalName: string, megaName: string, pokemon?: Pokemon) => Species;
}

interface ModdedBattleSide {
	inherit?: true;
	allies?: (this: Side, all?: boolean) => Pokemon[];
	canDynamaxNow?: (this: Side) => boolean;
	chooseSwitch?: (this: Side, slotText?: string) => any;
	getChoice?: (this: Side) => string;
	getRequestData?: (this: Side, forAlly?: boolean) => { name: string, id: ID, pokemon: AnyObject[] };
}

interface ModdedBattlePokemon {
	inherit?: true;
	lostItemForDelibird?: Item | null;
	boostBy?: (this: Pokemon, boost: SparseBoostsTable) => boolean | number;
	clearBoosts?: (this: Pokemon) => void;
	calculateStat?: (this: Pokemon, statName: StatIDExceptHP, boost: number, modifier?: number) => number;
	cureStatus?: (this: Pokemon, silent?: boolean) => boolean;
	deductPP?: (
		this: Pokemon, move: string | Move, amount?: number | null, target?: Pokemon | null | false
	) => number;
	eatItem?: (this: Pokemon, force?: boolean, source?: Pokemon, sourceEffect?: Effect) => boolean;
	effectiveWeather?: (this: Pokemon) => ID;
	formeChange?: (
		this: Pokemon, speciesId: string | Species, source: Effect, isPermanent?: boolean, message?: string
	) => boolean;
	hasType?: (this: Pokemon, type: string | string[]) => boolean;
	getAbility?: (this: Pokemon) => Ability;
	getActionSpeed?: (this: Pokemon) => number;
	getItem?: (this: Pokemon) => Item;
	getMoveRequestData?: (this: Pokemon) => {
		moves: { move: string, id: ID, target?: string, disabled?: boolean }[],
		maybeDisabled?: boolean, trapped?: boolean, maybeTrapped?: boolean,
		canMegaEvo?: boolean, canUltraBurst?: boolean, canZMove?: ZMoveOptions,
	};
	getMoves?: (this: Pokemon, lockedMove?: string | null, restrictData?: boolean) => {
		move: string, id: string, disabled?: string | boolean, disabledSource?: string,
		target?: string, pp?: number, maxpp?: number,
	}[];
	getMoveTargets?: (this: Pokemon, move: ActiveMove, target: Pokemon) => {
		targets: Pokemon[], pressureTargets: Pokemon[],
	};
	getStat?: (
		this: Pokemon, statName: StatIDExceptHP, unboosted?: boolean, unmodified?: boolean, fastReturn?: boolean
	) => number;
	getTypes?: (this: Pokemon, excludeAdded?: boolean, preterastallized?: boolean) => string[];
	getWeight?: (this: Pokemon) => number;
	hasAbility?: (this: Pokemon, ability: string | string[]) => boolean;
	hasItem?: (this: Pokemon, item: string | string[]) => boolean;
	isGrounded?: (this: Pokemon, negateImmunity: boolean | undefined) => boolean | null;
	modifyStat?: (this: Pokemon, statName: StatIDExceptHP, modifier: number) => void;
	moveUsed?: (this: Pokemon, move: ActiveMove, targetLoc?: number) => void;
	recalculateStats?: (this: Pokemon) => void;
	runEffectiveness?: (this: Pokemon, move: ActiveMove) => number;
	runImmunity?: (this: Pokemon, type: string, message?: string | boolean) => boolean;
	setAbility?: (
		this: Pokemon, ability: string | Ability, source: Pokemon | null, isFromFormeChange: boolean
	) => string | false;
	setItem?: (this: Pokemon, item: string | Item, source?: Pokemon, effect?: Effect) => boolean;
	setStatus?: (
		this: Pokemon, status: string | Condition, source: Pokemon | null,
		sourceEffect: Effect | null, ignoreImmunities: boolean
	) => boolean;
	takeItem?: (this: Pokemon, source: Pokemon | undefined) => boolean | Item;
	transformInto?: (this: Pokemon, pokemon: Pokemon, effect: Effect | null) => boolean;
	useItem?: (this: Pokemon, source?: Pokemon, sourceEffect?: Effect) => boolean;
	ignoringAbility?: (this: Pokemon) => boolean;
	ignoringItem?: (this: Pokemon) => boolean;

	// OM
	getLinkedMoves?: (this: Pokemon, ignoreDisabled?: boolean) => string[];
	hasLinkedMove?: (this: Pokemon, moveid: string) => boolean;
}

interface ModdedBattleQueue extends Partial<BattleQueue> {
	inherit?: true;
	resolveAction?: (this: BattleQueue, action: ActionChoice, midTurn?: boolean) => Action[];
}

interface ModdedField extends Partial<Field> {
	inherit?: true;
	suppressingWeather?: (this: Field) => boolean;
}

interface ModdedBattleScriptsData extends Partial<BattleScriptsData> {
	inherit?: string;
	actions?: ModdedBattleActions;
	pokemon?: ModdedBattlePokemon;
	queue?: ModdedBattleQueue;
	field?: ModdedField;
	side?: ModdedBattleSide;
	boost?: (
		this: Battle, boost: SparseBoostsTable, target: Pokemon, source?: Pokemon | null,
		effect?: Effect | null, isSecondary?: boolean, isSelf?: boolean
	) => boolean | null | 0;
	debug?: (this: Battle, activity: string) => void;
	getActionSpeed?: (this: Battle, action: AnyObject) => void;
	init?: (this: ModdedDex) => void;
	maybeTriggerEndlessBattleClause?: (
		this: Battle, trappedBySide: boolean[], stalenessBySide: ('internal' | 'external' | undefined)[]
	) => boolean | undefined;
	natureModify?: (this: Battle, stats: StatsTable, set: PokemonSet) => StatsTable;
	endTurn?: (this: Battle) => void;
	runAction?: (this: Battle, action: Action) => void;
	spreadModify?: (this: Battle, baseStats: StatsTable, set: PokemonSet) => StatsTable;
	start?: (this: Battle) => void;
	suppressingWeather?: (this: Battle) => boolean;
	trunc?: (n: number) => number;
	win?: (this: Battle, side?: SideID | '' | Side | null) => boolean;
	faintMessages?: (this: Battle, lastFirst?: boolean, forceCheck?: boolean, checkWin?: boolean) => boolean | undefined;
	tiebreak?: (this: Battle) => boolean;
	checkMoveMakesContact?: (
		this: Battle, move: ActiveMove, attacker: Pokemon, defender: Pokemon, announcePads?: boolean
	) => boolean;
	checkWin?: (this: Battle, faintQueue?: Battle['faintQueue'][0]) => true | undefined;
	fieldEvent?: (this: Battle, eventid: string, targets?: Pokemon[]) => void;
	getAllActive?: (this: Battle, includeFainted?: boolean, includeCommanding?: boolean) => Pokemon[];
}

type TypeInfo = import('./dex-data').TypeInfo;

interface PlayerOptions {
	name?: string;
	avatar?: string;
	rating?: number;
	team?: PokemonSet[] | string | null;
	seed?: PRNGSeed;
}

interface BasicTextData {
	desc?: string;
	shortDesc?: string;
}
interface ConditionTextData extends BasicTextData {
	activate?: string;
	addItem?: string;
	block?: string;
	boost?: string;
	cant?: string;
	changeAbility?: string;
	damage?: string;
	end?: string;
	heal?: string;
	move?: string;
	start?: string;
	transform?: string;
}

interface MoveTextData extends ConditionTextData {
	alreadyStarted?: string;
	blockSelf?: string;
	clearBoost?: string;
	endFromItem?: string;
	fail?: string;
	failSelect?: string;
	failTooHeavy?: string;
	failWrongForme?: string;
	megaNoItem?: string;
	prepare?: string;
	removeItem?: string;
	startFromItem?: string;
	startFromZEffect?: string;
	switchOut?: string;
	takeItem?: string;
	typeChange?: string;
	upkeep?: string;
}

type TextFile<T> = T & {
	name: string,
	gen1?: T,
	gen2?: T,
	gen3?: T,
	gen4?: T,
	gen5?: T,
	gen6?: T,
	gen7?: T,
	gen8?: T,
};

type AbilityText = TextFile<ConditionTextData & {
	activateFromItem?: string,
	activateNoTarget?: string,
	copyBoost?: string,
	transformEnd?: string,
}>;
type MoveText = TextFile<MoveTextData>;
type ItemText = TextFile<ConditionTextData>;
type PokedexText = TextFile<BasicTextData>;
type DefaultText = AnyObject;

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
		'Z-Move user' | 'Staller' | 'Spinner' | 'Generalist' | 'Berry Sweeper' | 'Thief user';
}
