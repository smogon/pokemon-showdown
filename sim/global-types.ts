type Battle = import('./battle').Battle;
type BattleQueue = import('./battle-queue').BattleQueue;
type Field = import('./field').Field;
type Action = import('./battle-queue').Action;
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
type Nonstandard = 'Past' | 'Future' | 'Unobtainable' | 'CAP' | 'LGPE' | 'Custom';
/**
 * Describes the acceptable target(s) of a move.
 * adjacentAlly - Only relevant to Doubles or Triples, the move only targets an ally of the user.
 * adjacentAllyOrSelf - The move can target the user or its ally.
 * adjacentFoe - The move can target a foe, but not (in Triples) a distant foe.
 * all - The move targets the field or all Pokémon at once.
 * allAdjacent - The move is a spread move that also hits the user's ally.
 * allAdjacentFoes - The move is a spread move.
 * allies - The move affects all active Pokémon on the user's team.
 * allySide - The move adds a side condition on the user's side.
 * allyTeam - The move affects all unfainted Pokémon on the user's team.
 * any - The move can hit any other active Pokémon, not just those adjacent.
 * foeSide - The move adds a side condition on the foe's side.
 * normal - The move can hit one adjacent Pokémon of your choice.
 * randomNormal - The move targets an adjacent foe at random.
 * scripted - The move targets the foe that damaged the user.
 * self - The move affects the user of the move.
 */
type MoveTarget =
	'adjacentAlly' | 'adjacentAllyOrSelf' | 'adjacentFoe' | 'all' | 'allAdjacent' | 'allAdjacentFoes' |
	'allies' | 'allySide' | 'allyTeam' | 'any' | 'foeSide' | 'normal' | 'randomNormal' | 'scripted' | 'self';

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
}

type Effect = Ability | Item | ActiveMove | Species | PureEffect | Format;

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

interface AbilityEventMethods {
	onCheckShow?: (this: Battle, pokemon: Pokemon) => void;
	onEnd?: (this: Battle, target: Pokemon & Side & Field) => void;
	onPreStart?: (this: Battle, pokemon: Pokemon) => void;
	onStart?: (this: Battle, target: Pokemon) => void;
}

interface ItemEventMethods {
	onEat?: ((this: Battle, pokemon: Pokemon) => void) | false;
	onPrimal?: (this: Battle, pokemon: Pokemon) => void;
	onStart?: (this: Battle, target: Pokemon) => void;
	onTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
}

interface MoveEventMethods {
	basePowerCallback?: (this: Battle, pokemon: Pokemon, target: Pokemon, move: ActiveMove) => number | false | null;
	/** Return true to stop the move from being used */
	beforeMoveCallback?: (this: Battle, pokemon: Pokemon, target: Pokemon | null, move: ActiveMove) => boolean | void;
	beforeTurnCallback?: (this: Battle, pokemon: Pokemon, target: Pokemon) => void;
	damageCallback?: (this: Battle, pokemon: Pokemon, target: Pokemon) => number | false;

	onAfterHit?: CommonHandlers['VoidSourceMove'];
	onAfterSubDamage?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onAfterMoveSecondarySelf?: CommonHandlers['VoidSourceMove'];
	onAfterMoveSecondary?: CommonHandlers['VoidMove'];
	onAfterMove?: CommonHandlers['VoidSourceMove'];

	/* Invoked by the global BasePower event (onEffect = true) */
	onBasePower?: CommonHandlers['ModifierSourceMove'];

	onEffectiveness?: (
		this: Battle, typeMod: number, target: Pokemon | null, type: string, move: ActiveMove
	) => number | void;
	onHit?: CommonHandlers['ResultMove'];
	onHitField?: CommonHandlers['ResultMove'];
	onHitSide?: (this: Battle, side: Side, source: Pokemon, move: ActiveMove) => boolean | null | "" | void;
	onModifyMove?: (this: Battle, move: ActiveMove, pokemon: Pokemon, target: Pokemon) => void;
	onModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onMoveFail?: CommonHandlers['VoidMove'];
	onModifyType?: (this: Battle, move: ActiveMove, pokemon: Pokemon, target: Pokemon) => void;
	onPrepareHit?: CommonHandlers['ResultMove'];
	onTry?: CommonHandlers['ResultSourceMove'];
	onTryHit?: CommonHandlers['ExtResultSourceMove'];
	onTryHitField?: CommonHandlers['ResultMove'];
	onTryHitSide?: (this: Battle, side: Side, source: Pokemon, move: ActiveMove) => boolean | null | "" | void;
	onTryImmunity?: CommonHandlers['ResultMove'];
	onTryMove?: CommonHandlers['ResultSourceMove'];
	onUseMoveMessage?: CommonHandlers['VoidSourceMove'];
}

interface PureEffectEventMethods {
	durationCallback?: (this: Battle, target: Pokemon, source: Pokemon, effect: Effect | null) => number;
	onCopy?: (this: Battle, pokemon: Pokemon) => void;
	onEnd?: (this: Battle, target: Pokemon & Side & Field) => void;
	onRestart?: (this: Battle, target: Pokemon & Side & Field, source: Pokemon, sourceEffect: Effect) => void;
	onStart?: (this: Battle, target: Pokemon & Side & Field, source: Pokemon, sourceEffect: Effect) => void;
}

interface EventMethods {
	onDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onEmergencyExit?: (this: Battle, pokemon: Pokemon) => void;
	onAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAfterHit?: MoveEventMethods['onAfterHit'];
	onAfterSetStatus?: (this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAfterSubDamage?: MoveEventMethods['onAfterSubDamage'];
	onAfterSwitchInSelf?: (this: Battle, pokemon: Pokemon) => void;
	onAfterUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onAfterBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAfterFaint?: (this: Battle, length: number, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAfterMoveSecondarySelf?: MoveEventMethods['onAfterMoveSecondarySelf'];
	onAfterMoveSecondary?: MoveEventMethods['onAfterMoveSecondary'];
	onAfterMove?: MoveEventMethods['onAfterMove'];
	onAfterMoveSelf?: CommonHandlers['VoidSourceMove'];
	onAttract?: (this: Battle, target: Pokemon, source: Pokemon) => void;
	onAccuracy?: (
		this: Battle, accuracy: number, target: Pokemon, source: Pokemon, move: ActiveMove
	) => number | boolean | null | void;
	onBasePower?: CommonHandlers['ModifierSourceMove'];
	onBeforeFaint?: (this: Battle, pokemon: Pokemon, effect: Effect) => void;
	onBeforeMove?: CommonHandlers['VoidSourceMove'];
	onBeforeSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onBeforeSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onBeforeTurn?: (this: Battle, pokemon: Pokemon) => void;
	onBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onChargeMove?: CommonHandlers['VoidSourceMove'];
	onCriticalHit?: ((this: Battle, pokemon: Pokemon, source: null, move: ActiveMove) => boolean | void) | boolean;
	onDamage?: (
		this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect
	) => number | boolean | null | void;
	onDeductPP?: (this: Battle, target: Pokemon, source: Pokemon) => number | void;
	onDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onDragOut?: (this: Battle, pokemon: Pokemon, source?: Pokemon, move?: ActiveMove) => void;
	onEatItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onEffectiveness?: MoveEventMethods['onEffectiveness'];
	onFaint?: CommonHandlers['VoidEffect'];
	onFlinch?: ((this: Battle, pokemon: Pokemon) => boolean | void) | boolean;
	onFractionalPriority?: CommonHandlers['ModifierSourceMove'] | -0.1;
	onHit?: MoveEventMethods['onHit'];
	onImmunity?: (this: Battle, type: string, pokemon: Pokemon) => void;
	onLockMove?: string | ((this: Battle, pokemon: Pokemon) => void | string);
	onMaybeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onModifyAccuracy?: CommonHandlers['ModifierMove'];
	onModifyAtk?: CommonHandlers['ModifierSourceMove'];
	onModifyBoost?: (this: Battle, boosts: SparseBoostsTable, pokemon: Pokemon) => SparseBoostsTable | void;
	onModifyCritRatio?: CommonHandlers['ModifierSourceMove'];
	onModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onModifyDef?: CommonHandlers['ModifierMove'];
	onModifyMove?: MoveEventMethods['onModifyMove'];
	onModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onModifySecondaries?: (
		this: Battle, secondaries: SecondaryEffect[], target: Pokemon, source: Pokemon, move: ActiveMove
	) => void;
	onModifyType?: MoveEventMethods['onModifyType'];
	onModifySpA?: CommonHandlers['ModifierSourceMove'];
	onModifySpD?: CommonHandlers['ModifierMove'];
	onModifySpe?: (this: Battle, spe: number, pokemon: Pokemon) => number | void;
	onModifyWeight?: (this: Battle, weighthg: number, pokemon: Pokemon) => number | void;
	onMoveAborted?: CommonHandlers['VoidMove'];
	onNegateImmunity?: ((this: Battle, pokemon: Pokemon, type: string) => boolean | void) | boolean;
	onOverrideAction?: (this: Battle, pokemon: Pokemon, target: Pokemon, move: ActiveMove) => string | void;
	onPrepareHit?: CommonHandlers['ResultSourceMove'];
	onRedirectTarget?: (
		this: Battle, target: Pokemon, source: Pokemon, source2: Effect, move: ActiveMove
	) => Pokemon | void;
	onResidual?: (this: Battle, target: Pokemon & Side, source: Pokemon, effect: Effect) => void;
	onSetAbility?: (this: Battle, ability: string, target: Pokemon, source: Pokemon, effect: Effect) => boolean | void;
	onSetStatus?: (
		this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | null | void;
	onSetWeather?: (this: Battle, target: Pokemon, source: Pokemon, weather: PureEffect) => boolean | void;
	onStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onSwap?: (this: Battle, target: Pokemon, source: Pokemon) => void;
	onTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
	onTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onTerrainStart?: (this: Battle, target: Pokemon, source: Pokemon, terrain: PureEffect) => void;
	onWeatherStart?: (this: Battle, target: Pokemon, source: Pokemon, weather: PureEffect) => void;
	onTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onTryAddVolatile?: (
		this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, sourceEffect: Effect
	) => boolean | null | void;
	onTryEatItem?: boolean | ((this: Battle, item: Item, pokemon: Pokemon) => boolean | void);
	/* FIXME: onTryHeal() is run with two different sets of arguments */
	onTryHeal?: (
		((this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | void) |
		((this: Battle, pokemon: Pokemon) => boolean | void) | boolean
	);
	onTryHit?: MoveEventMethods['onTryHit'];
	onTryHitField?: MoveEventMethods['onTryHitField'];
	onTryHitSide?: CommonHandlers['ResultMove'];
	onInvulnerability?: CommonHandlers['ExtResultMove'];
	onTryMove?: MoveEventMethods['onTryMove'];
	onTryPrimaryHit?: (this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove) => boolean | null | number | void;
	onType?: (this: Battle, types: string[], pokemon: Pokemon) => string[] | void;
	onUpdate?: (this: Battle, pokemon: Pokemon) => void;
	onWeather?: (this: Battle, target: Pokemon, source: null, effect: PureEffect) => void;
	onWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];
	onAllyDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onAllyAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon) => void;
	onAllyAfterHit?: MoveEventMethods['onAfterHit'];
	onAllyAfterSetStatus?: (this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAllyAfterSubDamage?: MoveEventMethods['onAfterSubDamage'];
	onAllyAfterSwitchInSelf?: (this: Battle, pokemon: Pokemon) => void;
	onAllyAfterUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onAllyAfterBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAllyAfterFaint?: (this: Battle, length: number, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAllyAfterMoveSecondarySelf?: MoveEventMethods['onAfterMoveSecondarySelf'];
	onAllyAfterMoveSecondary?: MoveEventMethods['onAfterMoveSecondary'];
	onAllyAfterMove?: MoveEventMethods['onAfterMove'];
	onAllyAfterMoveSelf?: CommonHandlers['VoidSourceMove'];
	onAllyAttract?: (this: Battle, target: Pokemon, source: Pokemon) => void;
	onAllyAccuracy?: (
		this: Battle, accuracy: number, target: Pokemon, source: Pokemon, move: ActiveMove
	) => number | boolean | null | void;
	onAllyBasePower?: CommonHandlers['ModifierSourceMove'];
	onAllyBeforeFaint?: (this: Battle, pokemon: Pokemon, effect: Effect) => void;
	onAllyBeforeMove?: CommonHandlers['VoidSourceMove'];
	onAllyBeforeSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onAllyBeforeSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onAllyBeforeTurn?: (this: Battle, pokemon: Pokemon) => void;
	onAllyBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAllyChargeMove?: CommonHandlers['VoidSourceMove'];
	onAllyCriticalHit?: ((this: Battle, pokemon: Pokemon, source: null, move: ActiveMove) => boolean | void) | boolean;
	onAllyDamage?: (
		this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect
	) => number | boolean | null | void;
	onAllyDeductPP?: (this: Battle, target: Pokemon, source: Pokemon) => number | void;
	onAllyDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onAllyDragOut?: (this: Battle, pokemon: Pokemon, source?: Pokemon, move?: ActiveMove) => void;
	onAllyEatItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onAllyEffectiveness?: MoveEventMethods['onEffectiveness'];
	onAllyFaint?: CommonHandlers['VoidEffect'];
	onAllyFlinch?: ((this: Battle, pokemon: Pokemon) => boolean | void) | boolean;
	onAllyHit?: MoveEventMethods['onHit'];
	onAllyImmunity?: (this: Battle, type: string, pokemon: Pokemon) => void;
	onAllyLockMove?: string | ((this: Battle, pokemon: Pokemon) => void | string);
	onAllyMaybeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onAllyModifyAccuracy?: CommonHandlers['ModifierMove'];
	onAllyModifyAtk?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyBoost?: (this: Battle, boosts: SparseBoostsTable, pokemon: Pokemon) => SparseBoostsTable | void;
	onAllyModifyCritRatio?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyDef?: CommonHandlers['ModifierMove'];
	onAllyModifyMove?: MoveEventMethods['onModifyMove'];
	onAllyModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onAllyModifySecondaries?: (
		this: Battle, secondaries: SecondaryEffect[], target: Pokemon, source: Pokemon, move: ActiveMove
	) => void;
	onAllyModifySpA?: CommonHandlers['ModifierSourceMove'];
	onAllyModifySpD?: CommonHandlers['ModifierMove'];
	onAllyModifySpe?: (this: Battle, spe: number, pokemon: Pokemon) => number | void;
	onAllyModifyType?: MoveEventMethods['onModifyType'];
	onAllyModifyWeight?: (this: Battle, weighthg: number, pokemon: Pokemon) => number | void;
	onAllyMoveAborted?: CommonHandlers['VoidMove'];
	onAllyNegateImmunity?: ((this: Battle, pokemon: Pokemon, type: string) => boolean | void) | boolean;
	onAllyOverrideAction?: (this: Battle, pokemon: Pokemon, target: Pokemon, move: ActiveMove) => string | void;
	onAllyPrepareHit?: CommonHandlers['ResultSourceMove'];
	onAllyRedirectTarget?: (
		this: Battle, target: Pokemon, source: Pokemon, source2: Effect, move: ActiveMove
	) => Pokemon | void;
	onAllyResidual?: (this: Battle, target: Pokemon & Side, source: Pokemon, effect: Effect) => void;
	onAllySetAbility?: (this: Battle, ability: string, target: Pokemon, source: Pokemon, effect: Effect) => boolean | void;
	onAllySetStatus?: (
		this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | null | void;
	onAllySetWeather?: (this: Battle, target: Pokemon, source: Pokemon, weather: PureEffect) => boolean | void;
	onAllyStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onAllySwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onAllySwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onAllyTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
	onAllyTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onAllyTerrainStart?: (this: Battle, target: Pokemon, source: Pokemon, terrain: PureEffect) => void;
	onAllyWeatherStart?: (this: Battle, target: Pokemon, source: Pokemon, weather: PureEffect) => void;
	onAllyTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onAllyTryAddVolatile?: (
		this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, sourceEffect: Effect
	) => boolean | null | void;
	onAllyTryEatItem?: boolean | ((this: Battle, item: Item, pokemon: Pokemon) => boolean | void);
	/* FIXME: onAllyTryHeal() is run with two different sets of arguments */
	onAllyTryHeal?: (
		((this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | void) |
		((this: Battle, pokemon: Pokemon) => boolean | void) | boolean
	);
	onAllyTryHit?: MoveEventMethods['onTryHit'];
	onAllyTryHitField?: MoveEventMethods['onTryHitField'];
	onAllyTryHitSide?: CommonHandlers['ResultMove'];
	onAllyInvulnerability?: CommonHandlers['ExtResultMove'];
	onAllyTryMove?: MoveEventMethods['onTryMove'];
	onAllyTryPrimaryHit?: (
		this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove
	) => boolean | null | number | void;
	onAllyType?: (this: Battle, types: string[], pokemon: Pokemon) => string[] | void;
	onAllyUpdate?: (this: Battle, pokemon: Pokemon) => void;
	onAllyWeather?: (this: Battle, target: Pokemon, source: null, effect: PureEffect) => void;
	onAllyWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];
	onFoeDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onFoeAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon) => void;
	onFoeAfterHit?: MoveEventMethods['onAfterHit'];
	onFoeAfterSetStatus?: (this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onFoeAfterSubDamage?: MoveEventMethods['onAfterSubDamage'];
	onFoeAfterSwitchInSelf?: (this: Battle, pokemon: Pokemon) => void;
	onFoeAfterUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onFoeAfterBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onFoeAfterFaint?: (this: Battle, length: number, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onFoeAfterMoveSecondarySelf?: MoveEventMethods['onAfterMoveSecondarySelf'];
	onFoeAfterMoveSecondary?: MoveEventMethods['onAfterMoveSecondary'];
	onFoeAfterMove?: MoveEventMethods['onAfterMove'];
	onFoeAfterMoveSelf?: CommonHandlers['VoidSourceMove'];
	onFoeAttract?: (this: Battle, target: Pokemon, source: Pokemon) => void;
	onFoeAccuracy?: (
		this: Battle, accuracy: number, target: Pokemon, source: Pokemon, move: ActiveMove
	) => number | boolean | null | void;
	onFoeBasePower?: CommonHandlers['ModifierSourceMove'];
	onFoeBeforeFaint?: (this: Battle, pokemon: Pokemon, effect: Effect) => void;
	onFoeBeforeMove?: CommonHandlers['VoidSourceMove'];
	onFoeBeforeSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onFoeBeforeSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onFoeBeforeTurn?: (this: Battle, pokemon: Pokemon) => void;
	onFoeBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onFoeChargeMove?: CommonHandlers['VoidSourceMove'];
	onFoeCriticalHit?: ((this: Battle, pokemon: Pokemon, source: null, move: ActiveMove) => boolean | void) | boolean;
	onFoeDamage?: (
		this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect
	) => number | boolean | null | void;
	onFoeDeductPP?: (this: Battle, target: Pokemon, source: Pokemon) => number | void;
	onFoeDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onFoeDragOut?: (this: Battle, pokemon: Pokemon, source?: Pokemon, move?: ActiveMove) => void;
	onFoeEatItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onFoeEffectiveness?: MoveEventMethods['onEffectiveness'];
	onFoeFaint?: CommonHandlers['VoidEffect'];
	onFoeFlinch?: ((this: Battle, pokemon: Pokemon) => boolean | void) | boolean;
	onFoeHit?: MoveEventMethods['onHit'];
	onFoeImmunity?: (this: Battle, type: string, pokemon: Pokemon) => void;
	onFoeLockMove?: string | ((this: Battle, pokemon: Pokemon) => void | string);
	onFoeMaybeTrapPokemon?: (this: Battle, pokemon: Pokemon, source?: Pokemon) => void;
	onFoeModifyAccuracy?: CommonHandlers['ModifierMove'];
	onFoeModifyAtk?: CommonHandlers['ModifierSourceMove'];
	onFoeModifyBoost?: (this: Battle, boosts: SparseBoostsTable, pokemon: Pokemon) => SparseBoostsTable | void;
	onFoeModifyCritRatio?: CommonHandlers['ModifierSourceMove'];
	onFoeModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onFoeModifyDef?: CommonHandlers['ModifierMove'];
	onFoeModifyMove?: MoveEventMethods['onModifyMove'];
	onFoeModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onFoeModifySecondaries?: (
		this: Battle, secondaries: SecondaryEffect[], target: Pokemon, source: Pokemon, move: ActiveMove
	) => void;
	onFoeModifySpA?: CommonHandlers['ModifierSourceMove'];
	onFoeModifySpD?: CommonHandlers['ModifierMove'];
	onFoeModifySpe?: (this: Battle, spe: number, pokemon: Pokemon) => number | void;
	onFoeModifyType?: MoveEventMethods['onModifyType'];
	onFoeModifyWeight?: (this: Battle, weighthg: number, pokemon: Pokemon) => number | void;
	onFoeMoveAborted?: CommonHandlers['VoidMove'];
	onFoeNegateImmunity?: ((this: Battle, pokemon: Pokemon, type: string) => boolean | void) | boolean;
	onFoeOverrideAction?: (this: Battle, pokemon: Pokemon, target: Pokemon, move: ActiveMove) => string | void;
	onFoePrepareHit?: CommonHandlers['ResultSourceMove'];
	onFoeRedirectTarget?: (
		this: Battle, target: Pokemon, source: Pokemon, source2: Effect, move: ActiveMove
	) => Pokemon | void;
	onFoeResidual?: (this: Battle, target: Pokemon & Side, source: Pokemon, effect: Effect) => void;
	onFoeSetAbility?: (this: Battle, ability: string, target: Pokemon, source: Pokemon, effect: Effect) => boolean | void;
	onFoeSetStatus?: (
		this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | null | void;
	onFoeSetWeather?: (this: Battle, target: Pokemon, source: Pokemon, weather: PureEffect) => boolean | void;
	onFoeStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onFoeSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onFoeSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onFoeTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
	onFoeTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onFoeTerrainStart?: (this: Battle, target: Pokemon, source: Pokemon, terrain: PureEffect) => void;
	onFoeWeatherStart?: (this: Battle, target: Pokemon, source: Pokemon, weather: PureEffect) => void;
	onFoeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onFoeTryAddVolatile?: (
		this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, sourceEffect: Effect
	) => boolean | null | void;
	onFoeTryEatItem?: boolean | ((this: Battle, item: Item, pokemon: Pokemon) => boolean | void);
	/* FIXME: onFoeTryHeal() is run with two different sets of arguments */
	onFoeTryHeal?: (
		((this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | void) |
		((this: Battle, pokemon: Pokemon) => boolean | void) | boolean
	);
	onFoeTryHit?: MoveEventMethods['onTryHit'];
	onFoeTryHitField?: MoveEventMethods['onTryHitField'];
	onFoeTryHitSide?: CommonHandlers['ResultMove'];
	onFoeInvulnerability?: CommonHandlers['ExtResultMove'];
	onFoeTryMove?: MoveEventMethods['onTryMove'];
	onFoeTryPrimaryHit?: (
		this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove
	) => boolean | null | number | void;
	onFoeType?: (this: Battle, types: string[], pokemon: Pokemon) => string[] | void;
	onFoeUpdate?: (this: Battle, pokemon: Pokemon) => void;
	onFoeWeather?: (this: Battle, target: Pokemon, source: null, effect: PureEffect) => void;
	onFoeWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onFoeModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onFoeModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];
	onSourceDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onSourceAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon) => void;
	onSourceAfterHit?: MoveEventMethods['onAfterHit'];
	onSourceAfterSetStatus?: (this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onSourceAfterSubDamage?: MoveEventMethods['onAfterSubDamage'];
	onSourceAfterSwitchInSelf?: (this: Battle, pokemon: Pokemon) => void;
	onSourceAfterUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onSourceAfterBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onSourceAfterFaint?: (this: Battle, length: number, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onSourceAfterMoveSecondarySelf?: MoveEventMethods['onAfterMoveSecondarySelf'];
	onSourceAfterMoveSecondary?: MoveEventMethods['onAfterMoveSecondary'];
	onSourceAfterMove?: MoveEventMethods['onAfterMove'];
	onSourceAfterMoveSelf?: CommonHandlers['VoidSourceMove'];
	onSourceAttract?: (this: Battle, target: Pokemon, source: Pokemon) => void;
	onSourceAccuracy?: (
		this: Battle, accuracy: number, target: Pokemon, source: Pokemon, move: ActiveMove
	) => number | boolean | null | void;
	onSourceBasePower?: CommonHandlers['ModifierSourceMove'];
	onSourceBeforeFaint?: (this: Battle, pokemon: Pokemon, effect: Effect) => void;
	onSourceBeforeMove?: CommonHandlers['VoidSourceMove'];
	onSourceBeforeSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onSourceBeforeSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onSourceBeforeTurn?: (this: Battle, pokemon: Pokemon) => void;
	onSourceBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onSourceChargeMove?: CommonHandlers['VoidSourceMove'];
	onSourceCriticalHit?: ((this: Battle, pokemon: Pokemon, source: null, move: ActiveMove) => boolean | void) | boolean;
	onSourceDamage?: (
		this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect
	) => number | boolean | null | void;
	onSourceDeductPP?: (this: Battle, target: Pokemon, source: Pokemon) => number | void;
	onSourceDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onSourceDragOut?: (this: Battle, pokemon: Pokemon, source?: Pokemon, move?: ActiveMove) => void;
	onSourceEatItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onSourceEffectiveness?: MoveEventMethods['onEffectiveness'];
	onSourceFaint?: CommonHandlers['VoidEffect'];
	onSourceFlinch?: ((this: Battle, pokemon: Pokemon) => boolean | void) | boolean;
	onSourceHit?: MoveEventMethods['onHit'];
	onSourceImmunity?: (this: Battle, type: string, pokemon: Pokemon) => void;
	onSourceLockMove?: string | ((this: Battle, pokemon: Pokemon) => void | string);
	onSourceMaybeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onSourceModifyAccuracy?: CommonHandlers['ModifierMove'];
	onSourceModifyAtk?: CommonHandlers['ModifierSourceMove'];
	onSourceModifyBoost?: (this: Battle, boosts: SparseBoostsTable, pokemon: Pokemon) => SparseBoostsTable | void;
	onSourceModifyCritRatio?: CommonHandlers['ModifierSourceMove'];
	onSourceModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onSourceModifyDef?: CommonHandlers['ModifierMove'];
	onSourceModifyMove?: MoveEventMethods['onModifyMove'];
	onSourceModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onSourceModifySecondaries?: (
		this: Battle, secondaries: SecondaryEffect[], target: Pokemon, source: Pokemon, move: ActiveMove
	) => void;
	onSourceModifySpA?: CommonHandlers['ModifierSourceMove'];
	onSourceModifySpD?: CommonHandlers['ModifierMove'];
	onSourceModifySpe?: (this: Battle, spe: number, pokemon: Pokemon) => number | void;
	onSourceModifyType?: MoveEventMethods['onModifyType'];
	onSourceModifyWeight?: (this: Battle, weighthg: number, pokemon: Pokemon) => number | void;
	onSourceMoveAborted?: CommonHandlers['VoidMove'];
	onSourceNegateImmunity?: ((this: Battle, pokemon: Pokemon, type: string) => boolean | void) | boolean;
	onSourceOverrideAction?: (this: Battle, pokemon: Pokemon, target: Pokemon, move: ActiveMove) => string | void;
	onSourcePrepareHit?: CommonHandlers['ResultSourceMove'];
	onSourceRedirectTarget?: (
		this: Battle, target: Pokemon, source: Pokemon, source2: Effect, move: ActiveMove
	) => Pokemon | void;
	onSourceResidual?: (this: Battle, target: Pokemon & Side, source: Pokemon, effect: Effect) => void;
	onSourceSetAbility?: (
		this: Battle, ability: string, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | void;
	onSourceSetStatus?: (
		this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | null | void;
	onSourceSetWeather?: (this: Battle, target: Pokemon, source: Pokemon, weather: PureEffect) => boolean | void;
	onSourceStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onSourceSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onSourceSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onSourceTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
	onSourceTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onSourceTerrainStart?: (this: Battle, target: Pokemon, source: Pokemon, terrain: PureEffect) => void;
	onSourceWeatherStart?: (this: Battle, target: Pokemon, source: Pokemon, weather: PureEffect) => void;
	onSourceTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onSourceTryAddVolatile?: (
		this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, sourceEffect: Effect
	) => boolean | null | void;
	onSourceTryEatItem?: boolean | ((this: Battle, item: Item, pokemon: Pokemon) => boolean | void);
	/* FIXME: onSourceTryHeal() is run with two different sets of arguments */
	onSourceTryHeal?: (
		((this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | void) |
		((this: Battle, pokemon: Pokemon) => boolean | void) | boolean
	);
	onSourceTryHit?: MoveEventMethods['onTryHit'];
	onSourceTryHitField?: MoveEventMethods['onTryHitField'];
	onSourceTryHitSide?: CommonHandlers['ResultMove'];
	onSourceInvulnerability?: CommonHandlers['ExtResultMove'];
	onSourceTryMove?: MoveEventMethods['onTryMove'];
	onSourceTryPrimaryHit?: (
		this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove
	) => boolean | null | number | void;
	onSourceType?: (this: Battle, types: string[], pokemon: Pokemon) => string[] | void;
	onSourceUpdate?: (this: Battle, pokemon: Pokemon) => void;
	onSourceWeather?: (this: Battle, target: Pokemon, source: null, effect: PureEffect) => void;
	onSourceWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onSourceModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onSourceModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];
	onAnyDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onAnyAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon) => void;
	onAnyAfterHit?: MoveEventMethods['onAfterHit'];
	onAnyAfterSetStatus?: (this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAnyAfterSubDamage?: MoveEventMethods['onAfterSubDamage'];
	onAnyAfterSwitchInSelf?: (this: Battle, pokemon: Pokemon) => void;
	onAnyAfterUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onAnyAfterBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAnyAfterFaint?: (this: Battle, length: number, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAnyAfterMoveSecondarySelf?: MoveEventMethods['onAfterMoveSecondarySelf'];
	onAnyAfterMoveSecondary?: MoveEventMethods['onAfterMoveSecondary'];
	onAnyAfterMove?: MoveEventMethods['onAfterMove'];
	onAnyAfterMoveSelf?: CommonHandlers['VoidSourceMove'];
	onAnyAttract?: (this: Battle, target: Pokemon, source: Pokemon) => void;
	onAnyAccuracy?: (
		this: Battle, accuracy: number, target: Pokemon, source: Pokemon, move: ActiveMove
	) => number | boolean | null | void;
	onAnyBasePower?: CommonHandlers['ModifierSourceMove'];
	onAnyBeforeFaint?: (this: Battle, pokemon: Pokemon, effect: Effect) => void;
	onAnyBeforeMove?: CommonHandlers['VoidSourceMove'];
	onAnyBeforeSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onAnyBeforeSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onAnyBeforeTurn?: (this: Battle, pokemon: Pokemon) => void;
	onAnyBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAnyChargeMove?: CommonHandlers['VoidSourceMove'];
	onAnyCriticalHit?: ((this: Battle, pokemon: Pokemon, source: null, move: ActiveMove) => boolean | void) | boolean;
	onAnyDamage?: (
		this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect
	) => number | boolean | null | void;
	onAnyDeductPP?: (this: Battle, target: Pokemon, source: Pokemon) => number | void;
	onAnyDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onAnyDragOut?: (this: Battle, pokemon: Pokemon, source?: Pokemon, move?: ActiveMove) => void;
	onAnyEatItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onAnyEffectiveness?: MoveEventMethods['onEffectiveness'];
	onAnyFaint?: CommonHandlers['VoidEffect'];
	onAnyFlinch?: ((this: Battle, pokemon: Pokemon) => boolean | void) | boolean;
	onAnyHit?: MoveEventMethods['onHit'];
	onAnyImmunity?: (this: Battle, type: string, pokemon: Pokemon) => void;
	onAnyLockMove?: string | ((this: Battle, pokemon: Pokemon) => void | string);
	onAnyMaybeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onAnyModifyAccuracy?: CommonHandlers['ModifierMove'];
	onAnyModifyAtk?: CommonHandlers['ModifierSourceMove'];
	onAnyModifyBoost?: (this: Battle, boosts: SparseBoostsTable, pokemon: Pokemon) => SparseBoostsTable | void;
	onAnyModifyCritRatio?: CommonHandlers['ModifierSourceMove'];
	onAnyModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onAnyModifyDef?: CommonHandlers['ModifierMove'];
	onAnyModifyMove?: MoveEventMethods['onModifyMove'];
	onAnyModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onAnyModifySecondaries?: (
		this: Battle, secondaries: SecondaryEffect[], target: Pokemon, source: Pokemon, move: ActiveMove
	) => void;
	onAnyModifySpA?: CommonHandlers['ModifierSourceMove'];
	onAnyModifySpD?: CommonHandlers['ModifierMove'];
	onAnyModifySpe?: (this: Battle, spe: number, pokemon: Pokemon) => number | void;
	onAnyModifyType?: MoveEventMethods['onModifyType'];
	onAnyModifyWeight?: (this: Battle, weighthg: number, pokemon: Pokemon) => number | void;
	onAnyMoveAborted?: CommonHandlers['VoidMove'];
	onAnyNegateImmunity?: ((this: Battle, pokemon: Pokemon, type: string) => boolean | void) | boolean;
	onAnyOverrideAction?: (this: Battle, pokemon: Pokemon, target: Pokemon, move: ActiveMove) => string | void;
	onAnyPrepareHit?: CommonHandlers['ResultSourceMove'];
	onAnyRedirectTarget?: (
		this: Battle, target: Pokemon, source: Pokemon, source2: Effect, move: ActiveMove
	) => Pokemon | void;
	onAnyResidual?: (this: Battle, target: Pokemon & Side, source: Pokemon, effect: Effect) => void;
	onAnySetAbility?: (this: Battle, ability: string, target: Pokemon, source: Pokemon, effect: Effect) => boolean | void;
	onAnySetStatus?: (
		this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | null | void;
	onAnySetWeather?: (this: Battle, target: Pokemon, source: Pokemon, weather: PureEffect) => boolean | void;
	onAnyStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onAnySwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onAnySwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onAnyTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
	onAnyTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onAnyTerrainStart?: (this: Battle, target: Pokemon, source: Pokemon, terrain: PureEffect) => void;
	onAnyWeatherStart?: (this: Battle, target: Pokemon, source: Pokemon, weather: PureEffect) => void;
	onAnyTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onAnyTryAddVolatile?: (
		this: Battle, status: PureEffect, target: Pokemon, source: Pokemon, sourceEffect: Effect
	) => boolean | null | void;
	onAnyTryEatItem?: boolean | ((this: Battle, item: Item, pokemon: Pokemon) => boolean | void);
	/* FIXME: onAnyTryHeal() is run with two different sets of arguments */
	onAnyTryHeal?: (
		((this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | void) |
		((this: Battle, pokemon: Pokemon) => boolean | void) | boolean
	);
	onAnyTryHit?: MoveEventMethods['onTryHit'];
	onAnyTryHitField?: MoveEventMethods['onTryHitField'];
	onAnyTryHitSide?: CommonHandlers['ResultMove'];
	onAnyInvulnerability?: CommonHandlers['ExtResultMove'];
	onAnyTryMove?: MoveEventMethods['onTryMove'];
	onAnyTryPrimaryHit?: (
		this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove
	) => boolean | null | number | void;
	onAnyType?: (this: Battle, types: string[], pokemon: Pokemon) => string[] | void;
	onAnyUpdate?: (this: Battle, pokemon: Pokemon) => void;
	onAnyWeather?: (this: Battle, target: Pokemon, source: null, effect: PureEffect) => void;
	onAnyWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onAnyModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onAnyModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];

	// Priorities (incomplete list)
	onAccuracyPriority?: number;
	onDamagingHitOrder?: number;
	onAfterMoveSecondaryPriority?: number;
	onAfterMoveSecondarySelfPriority?: number;
	onAfterMoveSelfPriority?: number;
	onAnyBasePowerPriority?: number;
	onAnyInvulnerabilityPriority?: number;
	onAnyFaintPriority?: number;
	onAllyBasePowerPriority?: number;
	onAllyModifyAtkPriority?: number;
	onAttractPriority?: number;
	onBasePowerPriority?: number;
	onBeforeMovePriority?: number;
	onBeforeSwitchOutPriority?: number;
	onBoostPriority?: number;
	onDamagePriority?: number;
	onDragOutPriority?: number;
	onEffectivenessPriority?: number;
	onFoeBasePowerPriority?: number;
	onFoeBeforeMovePriority?: number;
	onFoeModifyDefPriority?: number;
	onFoeRedirectTargetPriority?: number;
	onFoeTrapPokemonPriority?: number;
	onFractionalPriorityPriority?: number;
	onHitPriority?: number;
	onModifyAccuracyPriority?: number;
	onModifyAtkPriority?: number;
	onModifyCritRatioPriority?: number;
	onModifyDefPriority?: number;
	onModifyMovePriority?: number;
	onModifyPriorityPriority?: number;
	onModifySpAPriority?: number;
	onModifySpDPriority?: number;
	onModifyTypePriority?: number;
	onModifyWeightPriority?: number;
	onRedirectTargetPriority?: number;
	onResidualOrder?: number;
	onResidualPriority?: number;
	onResidualSubOrder?: number;
	onSourceBasePowerPriority?: number;
	onSourceInvulnerabilityPriority?: number;
	onSourceModifyAtkPriority?: number;
	onSourceModifySpAPriority?: number;
	onSwitchInPriority?: number;
	onTrapPokemonPriority?: number;
	onTryHealPriority?: number;
	onTryHitPriority?: number;
	onTryMovePriority?: number;
	onTryPrimaryHitPriority?: number;
	onTypePriority?: number;
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
	'Effect' | 'Pokemon' | 'Move' | 'Item' | 'Ability' | 'Format' |
	'Ruleset' | 'Weather' | 'Status' | 'Rule' | 'ValidatorRule';

interface BasicEffect extends EffectData {
	id: ID;
	effectType: EffectType;
	exists: boolean;
	fullname: string;
	gen: number;
	sourceEffect: string;
	toString: () => string;
}

interface PureEffectData extends EffectData, PureEffectEventMethods, EventMethods {
	noCopy?: boolean;
	affectsFainted?: boolean;
	counterMax?: number;
}

type ModdedPureEffectData = PureEffectData | Partial<PureEffectData> & {inherit: true};

interface PureEffect extends Readonly<BasicEffect & PureEffectData> {
	readonly effectType: 'Status' | 'Effect' | 'Weather';
}

interface AbilityData extends EffectData, AbilityEventMethods, EventMethods {
	name: string;
	/** internal index number */
	num?: number;
	effect?: Partial<PureEffectData>;
	rating?: number;
	isUnbreakable?: boolean;
	suppressWeather?: boolean;
}

type ModdedAbilityData = AbilityData | Partial<AbilityData> & {inherit: true};

interface Ability extends Readonly<BasicEffect & AbilityData> {
	readonly effectType: 'Ability';
	rating: number;
}

interface FlingData {
	basePower: number;
	status?: string;
	volatileStatus?: string;
	effect?: MoveEventMethods['onHit'];
}

interface ItemData extends EffectData, ItemEventMethods, EventMethods {
	name: string;
	/** just controls location on the item spritesheet */
	num?: number;
	effect?: Partial<PureEffectData>;
	gen: number;
	fling?: FlingData;
	forcedForme?: string;
	ignoreKlutz?: boolean;
	isBerry?: boolean;
	isChoice?: boolean;
	isGem?: boolean;
	isPokeball?: boolean;
	megaStone?: string;
	megaEvolves?: string;
	naturalGift?: {basePower: number, type: string};
	onDrive?: string;
	onMemory?: string;
	onPlate?: string;
	spritenum?: number;
	zMove?: string | true;
	zMoveFrom?: string;
	zMoveType?: string;
	itemUser?: string[];
	boosts?: SparseBoostsTable | false;
}

type ModdedItemData = ItemData | Partial<Omit<ItemData, 'name'>> & {
	inherit: true,
	onCustap?: (this: Battle, pokemon: Pokemon) => void,
};

interface Item extends Readonly<BasicEffect & ItemData> {
	readonly effectType: 'Item';
}

interface HitEffect {
	onHit?: MoveEventMethods['onHit'];

	// set pokemon conditions
	boosts?: SparseBoostsTable | null;
	status?: string;
	volatileStatus?: string;

	// set side/slot conditions
	sideCondition?: string;
	slotCondition?: string;

	// set field conditions
	pseudoWeather?: string;
	terrain?: string;
	weather?: string;
}

interface SecondaryEffect extends HitEffect {
	chance?: number;
	/** Used to flag a secondary effect as added by Poison Touch */
	ability?: Ability;
	/**
	 * Applies to Sparkling Aria's secondary effect: Affected by
	 * Sheer Force but not Shield Dust.
	 */
	dustproof?: boolean;
	/**
	 * Gen 2 specific mechanics: Bypasses Substitute only on Twineedle,
	 * and allows it to flinch sleeping/frozen targets
	 */
	kingsrock?: boolean;
	self?: HitEffect;
}

interface MoveData extends EffectData, MoveEventMethods, HitEffect {
	name: string;
	/** move index number, used for Metronome rolls */
	num?: number;
	effect?: Partial<PureEffectData>;
	basePower: number;
	accuracy: true | number;
	pp: number;
	category: 'Physical' | 'Special' | 'Status';
	type: string;
	priority: number;
	target: MoveTarget;
	flags: AnyObject;
	/** Hidden Power */
	realMove?: string;

	damage?: number | 'level' | false | null;
	contestType?: string;
	noPPBoosts?: boolean;

	// Z-move data
	// -----------
	/**
	 * ID of the Z-Crystal that calls the move.
	 * `true` for Z-Powered status moves like Z-Encore.
	 */
	isZ?: boolean | string;
	zMove?: {
		basePower?: number,
		effect?: string,
		boost?: SparseBoostsTable,
	};

	// Max move data
	// -------------
	/**
	 * `true` for Max moves like Max Airstream. If its a G-Max moves, this is
	 * the species ID of the Gigantamax Pokemon that can use this G-Max move.
	 */
	isMax?: boolean | string;
	maxMove?: {
		basePower: number,
	};

	// Hit effects
	// -----------
	ohko?: boolean | string;
	thawsTarget?: boolean;
	heal?: number[] | null;
	forceSwitch?: boolean;
	selfSwitch?: string | boolean;
	selfBoost?: {boosts?: SparseBoostsTable};
	selfdestruct?: string | boolean;
	breaksProtect?: boolean;
	/**
	 * Note that this is only "true" recoil. Other self-damage, like Struggle,
	 * crash (High Jump Kick), Mind Blown, Life Orb, and even Substitute and
	 * Healing Wish, are sometimes called "recoil" by the community, but don't
	 * count as "real" recoil.
	 */
	recoil?: [number, number];
	drain?: [number, number];
	mindBlownRecoil?: boolean;
	stealsBoosts?: boolean;
	struggleRecoil?: boolean;
	secondary?: SecondaryEffect | null;
	secondaries?: SecondaryEffect[] | null;
	self?: HitEffect | null;

	// Hit effect modifiers
	// --------------------
	alwaysHit?: boolean; // currently unused
	baseMoveType?: string;
	basePowerModifier?: number;
	critModifier?: number;
	critRatio?: number;
	defensiveCategory?: 'Physical' | 'Special' | 'Status';
	forceSTAB?: boolean;
	ignoreAbility?: boolean;
	ignoreAccuracy?: boolean;
	ignoreDefensive?: boolean;
	ignoreEvasion?: boolean;
	ignoreImmunity?: boolean | {[k: string]: boolean};
	ignoreNegativeOffensive?: boolean;
	ignoreOffensive?: boolean;
	ignorePositiveDefensive?: boolean;
	ignorePositiveEvasion?: boolean;
	multiaccuracy?: boolean;
	multihit?: number | number[];
	multihitType?: string;
	noDamageVariance?: boolean;
	/** False Swipe */
	noFaint?: boolean;
	nonGhostTarget?: string;
	pressureTarget?: string;
	spreadModifier?: number;
	sleepUsable?: boolean;
	/**
	 * Will change target if current target is unavailable. (Dragon Darts)
	 */
	smartTarget?: boolean;
	/**
	 * Tracks the original target through Ally Switch and other switch-out-and-back-in
	 * situations, rather than just targeting a slot. (Stalwart, Snipe Shot)
	 */
	tracksTarget?: boolean;
	useTargetOffensive?: boolean;
	useSourceDefensiveAsOffensive?: boolean;
	willCrit?: boolean;

	// Mechanics flags
	// ---------------
	hasCrashDamage?: boolean;
	isConfusionSelfHit?: boolean;
	isFutureMove?: boolean;
	noMetronome?: string[];
	noSketch?: boolean;
	stallingMove?: boolean;
	baseMove?: string;
}

type ModdedMoveData = MoveData | Partial<Omit<MoveData, 'name'>> & {inherit: true};

interface Move extends Readonly<BasicEffect & MoveData> {
	readonly effectType: 'Move';
}

interface MoveHitData {
	[targetSlotid: string]: {
		/** Did this move crit against the target? */
		crit: boolean,
		/** The type effectiveness of this move against the target */
		typeMod: number,
		/**
		 * Is this move a Z-Move that broke the target's protection?
		 * (does 0.25x regular damage)
		 */
		zBrokeProtect: boolean,
	};
}

interface ActiveMove extends BasicEffect, MoveData {
	readonly name: string;
	readonly effectType: 'Move';
	readonly id: ID;
	num: number;
	weather?: ID;
	status?: ID;
	hit: number;
	moveHitData?: MoveHitData;
	ability?: Ability;
	aerilateBoosted?: boolean;
	allies?: Pokemon[];
	auraBooster?: Pokemon;
	causedCrashDamage?: boolean;
	forceStatus?: ID;
	galvanizeBoosted?: boolean;
	hasAuraBreak?: boolean;
	hasBounced?: boolean;
	hasSheerForce?: boolean;
	/** Is the move called by Dancer? Used to prevent infinite Dancer recursion. */
	isExternal?: boolean;
	lastHit?: boolean;
	magnitude?: number;
	negateSecondary?: boolean;
	normalizeBoosted?: boolean;
	pixilateBoosted?: boolean;
	pranksterBoosted?: boolean;
	refrigerateBoosted?: boolean;
	selfDropped?: boolean;
	selfSwitch?: ID | boolean;
	spreadHit?: boolean;
	stab?: number;
	statusRoll?: string;
	totalDamage?: number | false;
	willChangeForme?: boolean;
	infiltrates?: boolean;

	/**
	 * Has this move been boosted by a Z-crystal or used by a Dynamax Pokemon? Usually the same as
	 * `isZ` or `isMax`, but hacked moves will have this be `false` and `isZ` / `isMax` be truthy.
	 */
	isZOrMaxPowered?: boolean;
}

interface SpeciesAbility {
	0: string;
	1?: string;
	H?: string;
	S?: string;
}

interface SpeciesData {
	name: string;
	/** National Dex number */
	num: number;

	types: string[];
	abilities: SpeciesAbility;
	baseStats: StatsTable;
	eggGroups: string[];
	weightkg: number;
	color?: string;
	heightm?: number;

	canHatch?: boolean;
	baseForme?: string;
	baseSpecies?: string;
	evoLevel?: number;
	evoMove?: string;
	evoCondition?: string;
	evoItem?: string;
	evos?: string[];
	evoType?: 'trade' | 'useItem' | 'levelMove' | 'levelExtra' | 'levelFriendship' | 'levelHold' | 'other';
	forme?: string;
	gender?: GenderName;
	genderRatio?: {[k: string]: number};
	maxHP?: number;
	cosmeticFormes?: string[];
	otherFormes?: string[];
	formeOrder?: string[];
	prevo?: string;
	gen?: number;
	requiredAbility?: string;
	requiredItem?: string;
	requiredItems?: string[];
	requiredMove?: string;
	battleOnly?: string | string[];
	isGigantamax?: string;
	changesFrom?: string;
	maleOnlyHidden?: boolean;
	unreleasedHidden?: boolean | 'Past';
}

type ModdedSpeciesData = SpeciesData | Partial<Omit<SpeciesData, 'name'>> & {inherit: true};

interface SpeciesFormatsData {
	comboMoves?: readonly string[];
	doublesTier?: string;
	essentialMove?: string;
	exclusiveMoves?: readonly string[];
	isNonstandard?: Nonstandard | null;
	randomBattleMoves?: readonly string[];
	randomBattleLevel?: number;
	randomDoubleBattleMoves?: readonly string[];
	randomSets?: readonly RandomTeamsTypes.Gen2RandomSet[];
	tier?: string;
}

type ModdedSpeciesFormatsData = SpeciesFormatsData & {inherit?: true};

interface LearnsetData {
	learnset?: {[moveid: string]: MoveSource[]};
	eventData?: EventInfo[];
	eventOnly?: boolean;
	encounters?: EventInfo[];
	exists?: boolean;
}

type ModdedLearnsetData = LearnsetData & {inherit?: true};

type Species = import('./dex-data').Species;

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

interface FormatsData extends EventMethods {
	name: string;

	banlist?: string[];
	battle?: ModdedBattleScriptsData;
	pokemon?: ModdedBattlePokemon;
	queue?: ModdedBattleQueue;
	field?: ModdedField;
	cannotMega?: string[];
	challengeShow?: boolean;
	debug?: boolean;
	defaultLevel?: number;
	desc?: string;
	effectType?: string;
	forcedLevel?: number;
	gameType?: GameType;
	maxForcedLevel?: number;
	maxLevel?: number;
	mod?: string;
	onBasePowerPriority?: number;
	onModifyMovePriority?: number;
	onModifyTypePriority?: number;
	onSwitchInPriority?: number;
	rated?: boolean;
	minSourceGen?: number;
	restricted?: string[];
	ruleset?: string[];
	searchShow?: boolean;
	team?: string;
	teamLength?: {validate?: [number, number], battle?: number};
	threads?: string[];
	timer?: Partial<GameTimerSettings>;
	tournamentShow?: boolean;
	unbanlist?: string[];
	checkLearnset?: (
		this: TeamValidator, move: Move, species: Species, setSources: PokemonSources, set: PokemonSet
	) => {type: string, [any: string]: any} | null;
	getSharedPower?: (this: Format, pokemon: Pokemon) => Set<string>;
	onAfterMega?: (this: Battle, pokemon: Pokemon) => void;
	onBegin?: (this: Battle) => void;
	onChangeSet?: (
		this: TeamValidator, set: PokemonSet, format: Format, setHas?: AnyObject, teamHas?: AnyObject
	) => string[] | void;
	onModifySpecies?: (
		this: Battle, species: Species, target?: Pokemon, source?: Pokemon, effect?: Effect
	) => Species | void;
	onStart?: (this: Battle) => void;
	onTeamPreview?: (this: Battle) => void;
	onValidateSet?: (
		this: TeamValidator, set: PokemonSet, format: Format, setHas: AnyObject, teamHas: AnyObject
	) => string[] | void;
	onValidateTeam?: (this: TeamValidator, team: PokemonSet[], format: Format, teamHas: AnyObject) => string[] | void;
	validateSet?: (this: TeamValidator, set: PokemonSet, teamHas: AnyObject) => string[] | null;
	validateTeam?: (this: TeamValidator, team: PokemonSet[], options?: {
		removeNicknames?: boolean,
		skipSets?: {[name: string]: {[key: string]: boolean}},
	}) => string[] | void;
	section?: string;
	column?: number;
}

type ModdedFormatsData = FormatsData | Omit<FormatsData, 'name'> & {inherit: true};

interface Format extends Readonly<BasicEffect & FormatsData> {
	readonly effectType: 'Format' | 'Ruleset' | 'Rule' | 'ValidatorRule';
	readonly baseRuleset: string[];
	readonly banlist: string[];
	readonly customRules: string[] | null;
	readonly defaultLevel: number;
	readonly maxLevel: number;
	readonly noLog: boolean;
	readonly ruleset: string[];
	readonly unbanlist: string[];
	ruleTable: import('./dex-data').RuleTable | null;
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
		this: Pokemon, status: string | PureEffect, source: Pokemon | null,
		sourceEffect: Effect | null, ignoreImmunities: boolean
	) => boolean;
	ignoringAbility?: (this: Pokemon) => boolean;

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
		moveset?: RandomTeamsTypes.RandomSet;
		other?: {discard: boolean, restrictMoves: {[k: string]: number}};
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
	export interface Gen2RandomSet {
		chance: number;
		item?: string[];
		baseMove1?: string;
		baseMove2?: string;
		baseMove3?: string;
		baseMove4?: string;
		fillerMoves1?: string[];
		fillerMoves2?: string[];
		fillerMoves3?: string[];
		fillerMoves4?: string[];
	}
}

interface PokemonModData {
	gluttonyFlag?: boolean; // Gen-NEXT
	innate?: string; // Partners in Crime
	originalSpecies?: string; // Mix and Mega
	[key: string]: any;
}
