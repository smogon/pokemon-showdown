/* eslint-disable @typescript-eslint/no-unused-vars */

type Battle = import('./battle').Battle;
type BattleQueue = import('./battle-queue').BattleQueue;
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

type ID = '' | string & {__isID: true};
interface AnyObject {[k: string]: any}
interface DexTable<T> {
	[key: string]: T;
}

type GenderName = 'M' | 'F' | 'N' | '';
type StatNameExceptHP = 'atk' | 'def' | 'spa' | 'spd' | 'spe';
type StatName = 'hp' | StatNameExceptHP;
type StatsExceptHPTable = {[stat in StatNameExceptHP]: number};
type StatsTable = {[stat in StatName]: number };
type SparseStatsTable = Partial<StatsTable>;
type BoostName = StatNameExceptHP | 'accuracy' | 'evasion';
type BoostsTable = {[boost in BoostName]: number };
type SparseBoostsTable = Partial<BoostsTable>;
type Nonstandard = 'Past' | 'Future' | 'Unobtainable' | 'CAP' | 'LGPE' | 'Custom' | 'Gigantamax';

interface PokemonSet {
	name: string;
	species: string;
	item: string;
	ability: string;
	moves: string[];
	nature: string;
	gender: string;
	evs: StatsTable;
	ivs: StatsTable;
	level: number;
	shiny?: boolean;
	happiness?: number;
	pokeball?: string;
	hpType?: string;
	gigantamax?: boolean;
}

/**
 * Describes a possible way to get a move onto a pokemon.
 *
 * First character is a generation number, 1-7.
 * Second character is a source ID, one of:
 *
 * - M = TM/HM
 * - T = tutor
 * - L = start or level-up, 3rd char+ is the level
 * - R = restricted (special moves like Rotom moves)
 * - E = egg
 * - D = Dream World, only 5D is valid
 * - S = event, 3rd char+ is the index in .eventData
 * - V = Virtual Console or Let's Go transfer, only 7V/8V is valid
 * - C = NOT A REAL SOURCE, see note, only 3C/4C is valid
 *
 * C marks certain moves learned by a pokemon's prevo. It's used to
 * work around the chainbreeding checker's shortcuts for performance;
 * it lets the pokemon be a valid father for teaching the move, but
 * is otherwise ignored by the learnset checker (which will actually
 * check prevos for compatibility).
 */
type MoveSource = string;

namespace TierTypes {
	export type Singles = "AG" | "Uber" | "(Uber)" | "OU" | "(OU)" | "UUBL" | "UU" | "RUBL" | "RU" | "NUBL" | "NU" |
	"(NU)" | "PUBL" | "PU" | "(PU)" | "NFE" | "LC Uber" | "LC";
	export type Doubles = "DUber" | "(DUber)" | "DOU" | "(DOU)" | "DBL" | "DUU" | "(DUU)" | "NFE" | "LC Uber" | "LC";
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
	abilities?: string[];
	maxEggMoves?: number;
	moves?: string[];
	pokeball?: string;
	from?: string;
	/** Japan-only events can't be transferred to international games in Gen 1 */
	japan?: boolean;
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

type ModdedEffectData = EffectData | Partial<EffectData> & {inherit: true};

type EffectType =
	'Condition' | 'Pokemon' | 'Move' | 'Item' | 'Ability' | 'Format' |
	'Nature' | 'Ruleset' | 'Weather' | 'Status' | 'Rule' | 'ValidatorRule';

interface BasicEffect extends EffectData {
	id: ID;
	effectType: EffectType;
	exists: boolean;
	fullname: string;
	gen: number;
	sourceEffect: string;
	toString: () => string;
}

type ConditionData = import('./dex-conditions').ConditionData;
type ModdedConditionData = import('./dex-conditions').ModdedConditionData;
type Condition = import('./dex-conditions').Condition;

type MoveData = import('./dex-moves').MoveData;
type ModdedMoveData = import('./dex-moves').ModdedMoveData;
type ActiveMove = import('./dex-moves').ActiveMove;
type Move = import('./dex-moves').Move;
type MoveTarget = import('./dex-moves').MoveTarget;

type ItemData = import('./dex-items').ItemData;
type ModdedItemData = import('./dex-items').ModdedItemData;
type Item = import('./dex-items').Item;

type AbilityData = import('./dex-abilities').AbilityData;
type ModdedAbilityData = import('./dex-abilities').ModdedAbilityData;
type Ability = import('./dex-abilities').Ability;

type SpeciesData = import('./dex-species').SpeciesData;
type ModdedSpeciesData = import('./dex-species').ModdedSpeciesData;
type SpeciesFormatsData = import('./dex-species').SpeciesFormatsData;
type ModdedSpeciesFormatsData = import('./dex-species').ModdedSpeciesFormatsData;
type Species = import('./dex-species').Species;

type FormatData = import('./dex-formats').FormatData;
type FormatList = import('./dex-formats').FormatList;
type ModdedFormatData = import('./dex-formats').ModdedFormatData;
type Format = import('./dex-formats').Format;

interface LearnsetData {
	learnset?: {[moveid: string]: MoveSource[]};
	eventData?: EventInfo[];
	eventOnly?: boolean;
	encounters?: EventInfo[];
	exists?: boolean;
}

type ModdedLearnsetData = LearnsetData & {inherit?: true};

interface NatureData {
	name: string;
	plus?: StatNameExceptHP;
	minus?: StatNameExceptHP;
}

type ModdedNatureData = NatureData | Partial<Omit<NatureData, 'name'>> & {inherit: true};

type Nature = import('./dex-data').Nature;

type GameType = 'singles' | 'doubles' | 'triples' | 'rotation' | 'multi' | 'free-for-all';
type SideID = 'p1' | 'p2' | 'p3' | 'p4';

interface GameTimerSettings {
	dcTimer: boolean;
	dcTimerBank: boolean;
	starting: number;
	grace: number;
	addPerTurn: number;
	maxPerTurn: number;
	maxFirstTurn: number;
	timeoutAutoChoose: boolean;
	accelerate: boolean;
}

type SpreadMoveTargets = (Pokemon | false | null)[];
type SpreadMoveDamage = (number | boolean | undefined)[];
type ZMoveOptions = ({move: string, target: MoveTarget} | null)[];
interface DynamaxOptions {
	maxMoves: ({move: string, target: MoveTarget, disabled?: boolean})[];
	gigantamax?: string;
}

interface BattleScriptsData {
	gen: number;
	zMoveTable?: {[k: string]: string};
	maxMoveTable?: {[k: string]: string};
	afterMoveSecondaryEvent?: (this: Battle, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => undefined;
	calcRecoilDamage?: (this: Battle, damageDealt: number, move: Move) => number;
	canMegaEvo?: (this: Battle, pokemon: Pokemon) => string | undefined | null;
	canUltraBurst?: (this: Battle, pokemon: Pokemon) => string | null;
	canZMove?: (this: Battle, pokemon: Pokemon) => ZMoveOptions | void;
	canDynamax?: (this: Battle, pokemon: Pokemon, skipChecks?: boolean) => DynamaxOptions | void;
	forceSwitch?: (
		this: Battle, damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => SpreadMoveDamage;
	getActiveMaxMove?: (this: Battle, move: Move, pokemon: Pokemon) => ActiveMove;
	getActiveZMove?: (this: Battle, move: Move, pokemon: Pokemon) => ActiveMove;
	getMaxMove?: (this: Battle, move: Move, pokemon: Pokemon) => Move | undefined;
	getSpreadDamage?: (
		this: Battle, damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => SpreadMoveDamage;
	getZMove?: (this: Battle, move: Move, pokemon: Pokemon, skipChecks?: boolean) => string | true | undefined;
	hitStepAccuracy?: (this: Battle, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean[];
	hitStepBreakProtect?: (this: Battle, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => undefined;
	hitStepMoveHitLoop?: (this: Battle, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => SpreadMoveDamage;
	hitStepTryImmunity?: (this: Battle, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean[];
	hitStepStealBoosts?: (this: Battle, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => undefined;
	hitStepTryHitEvent?: (this: Battle, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => (boolean | '')[];
	hitStepInvulnerabilityEvent?: (this: Battle, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean[];
	hitStepTypeImmunity?: (this: Battle, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean[];
	isAdjacent?: (this: Battle, pokemon1: Pokemon, pokemon2: Pokemon) => boolean;
	moveHit?: (
		this: Battle, target: Pokemon | null, pokemon: Pokemon, move: ActiveMove,
		moveData?: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => number | undefined | false;
	runAction?: (this: Battle, action: Action) => void;
	runMegaEvo?: (this: Battle, pokemon: Pokemon) => boolean;
	runMove?: (
		this: Battle, moveOrMoveName: Move | string, pokemon: Pokemon, targetLoc: number, sourceEffect?: Effect | null,
		zMove?: string, externalMove?: boolean, maxMove?: string, originalTarget?: Pokemon
	) => void;
	runMoveEffects?: (
		this: Battle, damage: SpreadMoveDamage, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => SpreadMoveDamage;
	runZPower?: (this: Battle, move: ActiveMove, pokemon: Pokemon) => void;
	secondaries?: (
		this: Battle, targets: SpreadMoveTargets, source: Pokemon, move: ActiveMove, moveData: ActiveMove, isSelf?: boolean
	) => void;
	selfDrops?: (
		this: Battle, targets: SpreadMoveTargets, source: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean
	) => void;
	spreadMoveHit?: (
		this: Battle, targets: SpreadMoveTargets, pokemon: Pokemon, move: ActiveMove,
		moveData?: ActiveMove, isSecondary?: boolean, isSelf?: boolean
	) => [SpreadMoveDamage, SpreadMoveTargets];
	targetTypeChoices?: (this: Battle, targetType: string) => boolean;
	tryMoveHit?: (this: Battle, target: Pokemon, pokemon: Pokemon, move: ActiveMove) => number | undefined | false | '';
	tryPrimaryHitEvent?: (
		this: Battle, damage: SpreadMoveDamage, targets: SpreadMoveTargets, pokemon: Pokemon,
		move: ActiveMove, moveData: ActiveMove, isSecondary?: boolean
	) => SpreadMoveDamage;
	trySpreadMoveHit?: (this: Battle, targets: Pokemon[], pokemon: Pokemon, move: ActiveMove) => boolean;
	useMove?: (
		this: Battle, move: Move, pokemon: Pokemon, target?: Pokemon | null,
		sourceEffect?: Effect | null, zMove?: string, maxMove?: string
	) => boolean;
	useMoveInner?: (
		this: Battle, move: Move, pokemon: Pokemon, target?: Pokemon | null,
		sourceEffect?: Effect | null, zMove?: string, maxMove?: string
	) => boolean;
}

interface ModdedBattleSide {
	lastMove?: Move | null;
}

interface ModdedBattlePokemon {
	/** TODO: remove, completely meaningless */
	inherit?: true;
	boostBy?: (this: Pokemon, boost: SparseBoostsTable) => boolean | number;
	calculateStat?: (this: Pokemon, statName: StatNameExceptHP, boost: number, modifier?: number) => number;
	getAbility?: (this: Pokemon) => Ability;
	getActionSpeed?: (this: Pokemon) => number;
	getMoveRequestData?: (this: Pokemon) => {
		moves: {move: string, id: ID, target?: string, disabled?: boolean}[],
		maybeDisabled?: boolean, trapped?: boolean, maybeTrapped?: boolean,
		canMegaEvo?: boolean, canUltraBurst?: boolean, canZMove?: ZMoveOptions,
	};
	getStat?: (
		this: Pokemon, statName: StatNameExceptHP, unboosted?: boolean, unmodified?: boolean, fastReturn?: boolean
	) => number;
	getWeight?: (this: Pokemon) => number;
	hasAbility?: (this: Pokemon, ability: string | string[]) => boolean;
	isGrounded?: (this: Pokemon, negateImmunity: boolean | undefined) => boolean | null;
	modifyStat?: (this: Pokemon, statName: StatNameExceptHP, modifier: number) => void;
	moveUsed?: (this: Pokemon, move: ActiveMove, targetLoc?: number) => void;
	recalculateStats?: (this: Pokemon) => void;
	setAbility?: (
		this: Pokemon, ability: string | Ability, source: Pokemon | null, isFromFormeChange: boolean
	) => string | false;
	transformInto?: (this: Pokemon, pokemon: Pokemon, effect: Effect | null) => boolean;
	setStatus?: (
		this: Pokemon, status: string | Condition, source: Pokemon | null,
		sourceEffect: Effect | null, ignoreImmunities: boolean
	) => boolean;
	ignoringAbility?: (this: Pokemon) => boolean;
	ignoringItem?: (this: Pokemon) => boolean;

	// OM
	getLinkedMoves?: (this: Pokemon, ignoreDisabled?: boolean) => string[];
	hasLinkedMove?: (this: Pokemon, moveid: string) => boolean;
}

interface ModdedBattleQueue extends Partial<BattleQueue> {
	resolveAction?: (this: BattleQueue, action: ActionChoice, midTurn?: boolean) => Action[];
}

interface ModdedField extends Partial<Field> {
	suppressingWeather?: (this: Field) => boolean;
}

interface ModdedBattleScriptsData extends Partial<BattleScriptsData> {
	inherit?: string;
	lastDamage?: number;
	pokemon?: ModdedBattlePokemon;
	queue?: ModdedBattleQueue;
	field?: ModdedField;
	side?: ModdedBattleSide;
	boost?: (
		this: Battle, boost: SparseBoostsTable, target: Pokemon, source?: Pokemon | null,
		effect?: Effect | string | null, isSecondary?: boolean, isSelf?: boolean
	) => boolean | null | 0;
	debug?: (this: Battle, activity: string) => void;
	getDamage?: (
		this: Battle, pokemon: Pokemon, target: Pokemon, move: string | number | ActiveMove, suppressMessages: boolean
	) => number | undefined | null | false;
	getActionSpeed?: (this: Battle, action: AnyObject) => void;
	getEffect?: (this: Battle, name: string | Effect | null) => Effect;
	init?: (this: ModdedDex) => void;
	modifyDamage?: (
		this: Battle, baseDamage: number, pokemon: Pokemon, target: Pokemon, move: ActiveMove, suppressMessages?: boolean
	) => void;
	natureModify?: (this: Battle, stats: StatsTable, set: PokemonSet) => StatsTable;
	nextTurn?: (this: Battle) => void;
	runMove?: (
		this: Battle, moveOrMoveName: Move | string, pokemon: Pokemon, targetLoc: number, sourceEffect?: Effect | null,
		zMove?: string, externalMove?: boolean, maxMove?: string, originalTarget?: Pokemon
	) => void;
	spreadModify?: (this: Battle, baseStats: StatsTable, set: PokemonSet) => StatsTable;
	suppressingWeather?: (this: Battle) => boolean;
	trunc?: (n: number) => number;

	// oms
	doGetMixedSpecies?: (this: Battle, species: Species, deltas: AnyObject) => Species;
	getMegaDeltas?: (this: Battle, megaSpecies: Species) => AnyObject;
	getMixedSpecies?: (this: Battle, originalName: string, megaName: string) => Species;
	getAbility?: (this: Battle, name: string | Ability) => Ability;
	getZMove?: (this: Battle, move: Move, pokemon: Pokemon, skipChecks?: boolean) => string | undefined;
	getActiveZMove?: (this: Battle, move: Move, pokemon: Pokemon) => ActiveMove;
	canZMove?: (this: Battle, pokemon: Pokemon) => ZMoveOptions | void;
}

interface TypeData {
	damageTaken: {[attackingTypeNameOrEffectid: string]: number};
	HPdvs?: SparseStatsTable;
	HPivs?: SparseStatsTable;
}

type ModdedTypeData = TypeData | Partial<Omit<TypeData, 'name'>> & {inherit: true};

interface TypeInfo extends Readonly<TypeData> {
	readonly effectType: 'Type' | 'EffectType';
	readonly exists: boolean;
	readonly gen: number;
	readonly HPdvs: SparseStatsTable;
	readonly HPivs: SparseStatsTable;
	readonly id: ID;
	readonly name: string;
	readonly toString: () => string;
}

interface PlayerOptions {
	name?: string;
	avatar?: string;
	rating?: number;
	team?: PokemonSet[] | string | null;
	seed?: PRNGSeed;
}

interface TextObject {
	desc?: string;
	shortDesc?: string;
}
interface Plines {
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

interface TextFile extends TextObject {
	name: string;
	gen1?: ModdedTextObject;
	gen2?: ModdedTextObject;
	gen3?: ModdedTextObject;
	gen4?: ModdedTextObject;
	gen5?: ModdedTextObject;
	gen6?: ModdedTextObject;
	gen7?: ModdedTextObject;
}

interface MovePlines extends Plines {
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

interface AbilityText extends TextFile, Plines {
	activateNoTarget?: string;
	transformEnd?: string;
}

/* eslint-disable @typescript-eslint/no-empty-interface */
interface MoveText extends TextFile, MovePlines {}

interface ItemText extends TextFile, Plines {}

interface PokedexText extends TextFile {}

interface DefaultText extends AnyObject {}

interface ModdedTextObject extends TextObject, Plines {}
/* eslint-enable @typescript-eslint/no-empty-interface */

namespace RandomTeamsTypes {
	export interface TeamDetails {
		megaStone?: number;
		zMove?: number;
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
	}
	export interface FactoryTeamDetails {
		megaCount: number;
		zCount?: number;
		forceResult: boolean;
		weather?: string;
		typeCount: {[k: string]: number};
		typeComboCount: {[k: string]: number};
		baseFormes: {[k: string]: number};
		has: {[k: string]: number};
		weaknesses: {[k: string]: number};
		resistances: {[k: string]: number};
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
		gigantamax?: boolean;
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
	}
}
