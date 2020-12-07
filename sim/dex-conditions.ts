import {BasicEffect} from './dex-data';
import type {SecondaryEffect, MoveEventMethods} from './dex-moves';

export interface EventMethods {
	onDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onEmergencyExit?: (this: Battle, pokemon: Pokemon) => void;
	onAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAfterHit?: MoveEventMethods['onAfterHit'];
	onAfterSetStatus?: (this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect) => void;
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
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | null | void;
	onSetWeather?: (this: Battle, target: Pokemon, source: Pokemon, weather: Condition) => boolean | void;
	onStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onSwap?: (this: Battle, target: Pokemon, source: Pokemon) => void;
	onTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
	onTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onTerrainStart?: (this: Battle, target: Pokemon, source: Pokemon, terrain: Condition) => void;
	onWeatherStart?: (this: Battle, target: Pokemon, source: Pokemon, weather: Condition) => void;
	onTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onTryAddVolatile?: (
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, sourceEffect: Effect
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
	onWeather?: (this: Battle, target: Pokemon, source: null, effect: Condition) => void;
	onWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];
	onAllyDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onAllyAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon) => void;
	onAllyAfterHit?: MoveEventMethods['onAfterHit'];
	onAllyAfterSetStatus?: (this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect) => void;
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
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | null | void;
	onAllySetWeather?: (this: Battle, target: Pokemon, source: Pokemon, weather: Condition) => boolean | void;
	onAllyStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onAllySwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onAllySwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onAllyTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
	onAllyTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onAllyTerrainStart?: (this: Battle, target: Pokemon, source: Pokemon, terrain: Condition) => void;
	onAllyWeatherStart?: (this: Battle, target: Pokemon, source: Pokemon, weather: Condition) => void;
	onAllyTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onAllyTryAddVolatile?: (
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, sourceEffect: Effect
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
	onAllyWeather?: (this: Battle, target: Pokemon, source: null, effect: Condition) => void;
	onAllyWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];
	onFoeDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onFoeAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon) => void;
	onFoeAfterHit?: MoveEventMethods['onAfterHit'];
	onFoeAfterSetStatus?: (this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect) => void;
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
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | null | void;
	onFoeSetWeather?: (this: Battle, target: Pokemon, source: Pokemon, weather: Condition) => boolean | void;
	onFoeStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onFoeSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onFoeSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onFoeTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
	onFoeTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onFoeTerrainStart?: (this: Battle, target: Pokemon, source: Pokemon, terrain: Condition) => void;
	onFoeWeatherStart?: (this: Battle, target: Pokemon, source: Pokemon, weather: Condition) => void;
	onFoeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onFoeTryAddVolatile?: (
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, sourceEffect: Effect
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
	onFoeWeather?: (this: Battle, target: Pokemon, source: null, effect: Condition) => void;
	onFoeWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onFoeModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onFoeModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];
	onSourceDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onSourceAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon) => void;
	onSourceAfterHit?: MoveEventMethods['onAfterHit'];
	onSourceAfterSetStatus?: (this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect) => void;
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
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | null | void;
	onSourceSetWeather?: (this: Battle, target: Pokemon, source: Pokemon, weather: Condition) => boolean | void;
	onSourceStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onSourceSwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onSourceSwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onSourceTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
	onSourceTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onSourceTerrainStart?: (this: Battle, target: Pokemon, source: Pokemon, terrain: Condition) => void;
	onSourceWeatherStart?: (this: Battle, target: Pokemon, source: Pokemon, weather: Condition) => void;
	onSourceTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onSourceTryAddVolatile?: (
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, sourceEffect: Effect
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
	onSourceWeather?: (this: Battle, target: Pokemon, source: null, effect: Condition) => void;
	onSourceWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onSourceModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onSourceModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];
	onAnyDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onAnyAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon) => void;
	onAnyAfterHit?: MoveEventMethods['onAfterHit'];
	onAnyAfterSetStatus?: (this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect) => void;
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
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect
	) => boolean | null | void;
	onAnySetWeather?: (this: Battle, target: Pokemon, source: Pokemon, weather: Condition) => boolean | void;
	onAnyStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onAnySwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onAnySwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onAnyTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | boolean;
	onAnyTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onAnyTerrainStart?: (this: Battle, target: Pokemon, source: Pokemon, terrain: Condition) => void;
	onAnyWeatherStart?: (this: Battle, target: Pokemon, source: Pokemon, weather: Condition) => void;
	onAnyTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onAnyTryAddVolatile?: (
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, sourceEffect: Effect
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
	onAnyWeather?: (this: Battle, target: Pokemon, source: null, effect: Condition) => void;
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
	onAnyPrepareHitPriority?: number;
	onAllyBasePowerPriority?: number;
	onAllyModifyAtkPriority?: number;
	onAllyModifySpAPriority?: number;
	onAllyModifySpDPriority?: number;
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
	onSourceModifyAccuracyPriority?: number;
	onSourceModifyAtkPriority?: number;
	onSourceModifyDamagePriority?: number;
	onSourceModifySpAPriority?: number;
	onSwitchInPriority?: number;
	onTrapPokemonPriority?: number;
	onTryEatItemPriority?: number;
	onTryHealPriority?: number;
	onTryHitPriority?: number;
	onTryMovePriority?: number;
	onTryPrimaryHitPriority?: number;
	onTypePriority?: number;
}

export interface ConditionData extends Partial<Condition>, EventMethods {}

export type ModdedConditionData = ConditionData | Partial<ConditionData> & {inherit: true};

export class Condition extends BasicEffect implements Readonly<BasicEffect & ConditionData> {
	readonly effectType: 'Condition' | 'Weather' | 'Status';
	readonly counterMax?: number;

	readonly durationCallback?: (this: Battle, target: Pokemon, source: Pokemon, effect: Effect | null) => number;
	readonly onCopy?: (this: Battle, pokemon: Pokemon) => void;
	readonly onEnd?: (this: Battle, target: Pokemon & Side & Field) => void;
	readonly onRestart?: (this: Battle, target: Pokemon & Side & Field, source: Pokemon, sourceEffect: Effect) => void;
	readonly onStart?: (this: Battle, target: Pokemon & Side & Field, source: Pokemon, sourceEffect: Effect) => void;

	constructor(data: AnyObject, ...moreData: (AnyObject | null)[]) {
		super(data, ...moreData);
		data = this;
		this.effectType = (['Weather', 'Status'].includes(data.effectType) ? data.effectType : 'Condition');
	}
}
