import {BasicEffect, toID} from './dex-data';
import type {SecondaryEffect, MoveSpecificEventMethods} from './dex-moves';

type GenericEvent = 'DamagingHit' | 'EmergencyExit' | 'AfterEachBoost' | 'AfterHit' | 'AfterMega' | 'AfterSetStatus' |
'AfterSubDamage' | 'AfterSwitchInSelf' | 'AfterTerastallization' | 'AfterUseItem' | 'AfterBoost' | 'AfterFaint' |
'AfterMoveSecondarySelf' | 'AfterMoveSecondary' | 'AfterMove' | 'AfterMoveSelf' | 'Attract' | 'Accuracy' | 'BasePower' |
'BeforeFaint' | 'BeforeMove' | 'BeforeSwitchIn' | 'BeforeSwitchOut' | 'BeforeTurn' | 'Boost' | 'ChargeMove' |
'CriticalHit' | 'Damage' | 'DeductPP' | 'DisableMove' | 'DragOut' | 'EatItem' | 'Effectiveness' | 'EntryHazard' |
'Faint' | 'Flinch' | 'FractionalPriority' | 'Hit' | 'Immunity' | 'LockMove' | 'MaybeTrapPokemon' | 'ModifyAccuracy' |
'ModifyAtk' | 'ModifyBoost' | 'ModifyCritRatio' | 'ModifyDamage' | 'ModifyDef' | 'ModifyMove' | 'ModifyPriority' |
'ModifySecondaries' | 'ModifyType' | 'ModifyTarget' | 'ModifySpA' | 'ModifySpD' | 'ModifySpe' | 'ModifyWeight' |
'MoveAborted' | 'NegateImmunity' | 'OverrideAction' | 'PrepareHit' | 'PseudoWeatherChange' | 'RedirectTarget' |
'Residual' | 'SetAbility' | 'SetStatus' | 'SetWeather' | 'StallMove' | 'SwitchIn' | 'SwitchOut' | 'Swap' | 'TakeItem' | 'TerrainChange' | 'WeatherChange' | 'TrapPokemon' | 'TryAddVolatile' | 'TryEatItem' | 'TryHeal' | 'TryHit' |
'TryHitField' | 'TryHitSide' | 'Invulnerability' | 'TryMove' | 'TryPrimaryHit' | 'Type' | 'Update' | 'Weather' | 'WeatherModifyDamage' | 'ModifyDamagePhase1' | 'ModifyDamagePhase2';
type PokemonEvent = GenericEvent | 'SideConditionStart';
type ConditionEvent = GenericEvent | 'Start' | 'Restart' | 'End' | 'Copy';
type PokemonConditionEvent = PokemonEvent | ConditionEvent;
type SideConditionEvent = ConditionEvent | 'Residual';
type FieldConditionEvent = SideConditionEvent;
type MoveEvent = 'AfterHit' | 'AfterSubDamage' | 'AfterMoveSecondarySelf' | 'AfterMoveSecondary' | 'AfterMove' |
'Damage' | 'BasePower' | 'Effectiveness' | 'Hit' | 'HitField' | 'HitSide' | 'ModifyMove' | 'ModifyPriority' |
'MoveFail' | 'ModifyType' | 'ModifyTarget' | 'PrepareHit' | 'Try' | 'TryHit' | 'TryHitField' | 'TryHitSide' |
'TryImmunity' | 'TryMove' | 'UseMoveMessage';
type ItemEvent = PokemonEvent | 'Plate' | 'Drive' | 'Memory' | 'Primal' | 'Eat' | 'Start';
type AbilityEvent = PokemonEvent | 'CheckShow' | 'End' | 'PreStart' | 'Start';
type FormatEvent = GenericEvent | 'Begin' | 'ModifySpecies' | 'BattleStart' | 'TeamPreview';
type UnusedEvent = 'UseItem' | 'Use' | 'Heal' | 'SubDamage' | 'TryTerrain' | 'Terrain' | 'TrySecondaryHit' |
'TryFieldHit';

export type EventName = PokemonConditionEvent | SideConditionEvent | FieldConditionEvent | MoveEvent | ItemEvent |
AbilityEvent | FormatEvent | UnusedEvent;
export type EventNamePrefix = '' | 'Ally' | 'Foe' | 'Source' | 'Any' | 'Side' | 'Field';
export type EventMethodName = `on${EventNamePrefix}${EventName}`;
export interface EventMethods {
	onDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onEmergencyExit?: (this: Battle, pokemon: Pokemon) => void;
	onAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAfterHit?: MoveSpecificEventMethods['onAfterHit'];
	onAfterMega?: (this: Battle, pokemon: Pokemon) => void;
	onAfterSetStatus?: (this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAfterSubDamage?: MoveSpecificEventMethods['onAfterSubDamage'];
	onAfterSwitchInSelf?: (this: Battle, pokemon: Pokemon) => void;
	onAfterTerastallization?: (this: Battle, pokemon: Pokemon) => void;
	onAfterUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onAfterBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAfterFaint?: (this: Battle, length: number, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAfterMoveSecondarySelf?: MoveSpecificEventMethods['onAfterMoveSecondarySelf'];
	onAfterMoveSecondary?: MoveSpecificEventMethods['onAfterMoveSecondary'];
	onAfterMove?: MoveSpecificEventMethods['onAfterMove'];
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
	onCriticalHit?: ((this: Battle, pokemon: Pokemon, source: null, move: ActiveMove) => boolean | void) | false;
	onDamage?: (
		this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect
	) => number | boolean | null | void;
	onDeductPP?: (this: Battle, target: Pokemon, source: Pokemon) => number | void;
	onDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onDragOut?: (this: Battle, pokemon: Pokemon, source?: Pokemon, move?: ActiveMove) => void;
	onEatItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onEffectiveness?: MoveSpecificEventMethods['onEffectiveness'];
	onEntryHazard?: (this: Battle, pokemon: Pokemon) => void;
	onFaint?: CommonHandlers['VoidEffect'];
	onFlinch?: ((this: Battle, pokemon: Pokemon) => boolean | void) | false;
	onFractionalPriority?: CommonHandlers['ModifierSourceMove'] | -0.1;
	onHit?: MoveSpecificEventMethods['onHit'];
	onImmunity?: (this: Battle, type: string, pokemon: Pokemon) => void;
	onLockMove?: string | ((this: Battle, pokemon: Pokemon) => void | string);
	onMaybeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onModifyAccuracy?: CommonHandlers['ModifierMove'];
	onModifyAtk?: CommonHandlers['ModifierSourceMove'];
	onModifyBoost?: (this: Battle, boosts: SparseBoostsTable, pokemon: Pokemon) => SparseBoostsTable | void;
	onModifyCritRatio?: CommonHandlers['ModifierSourceMove'];
	onModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onModifyDef?: CommonHandlers['ModifierMove'];
	onModifyMove?: MoveSpecificEventMethods['onModifyMove'];
	onModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onModifySecondaries?: (
		this: Battle, secondaries: SecondaryEffect[], target: Pokemon, source: Pokemon, move: ActiveMove
	) => void;
	onModifyType?: MoveSpecificEventMethods['onModifyType'];
	onModifyTarget?: MoveSpecificEventMethods['onModifyTarget'];
	onModifySpA?: CommonHandlers['ModifierSourceMove'];
	onModifySpD?: CommonHandlers['ModifierMove'];
	onModifySpe?: (this: Battle, spe: number, pokemon: Pokemon) => number | void;
	onModifyWeight?: (this: Battle, weighthg: number, pokemon: Pokemon) => number | void;
	onMoveAborted?: CommonHandlers['VoidMove'];
	onNegateImmunity?: ((this: Battle, pokemon: Pokemon, type: string) => boolean | void) | false;
	onOverrideAction?: (this: Battle, pokemon: Pokemon, target: Pokemon, move: ActiveMove) => string | void;
	onPrepareHit?: CommonHandlers['ResultSourceMove'];
	onRedirectTarget?: (
		this: Battle, target: Pokemon, source: Pokemon, source2: Effect, move: ActiveMove
	) => Pokemon | void;
	onResidual?: (this: Battle, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onSetAbility?: (
		this: Battle, ability: string, target: Pokemon, source: Pokemon, effect: Effect
	) => null | void;
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
	) | false;
	onWeatherChange?: (this: Battle, target: Pokemon, source: Pokemon, sourceEffect: Effect) => void;
	onTerrainChange?: (this: Battle, target: Pokemon, source: Pokemon, sourceEffect: Effect) => void;
	onTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onTryAddVolatile?: (
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, sourceEffect: Effect
	) => boolean | null | void;
	onTryEatItem?: false | ((this: Battle, item: Item, pokemon: Pokemon) => boolean | void);
	onTryHeal?: (
		(this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | void
	) | false;
	onTryHit?: MoveSpecificEventMethods['onTryHit'];
	onTryHitField?: MoveSpecificEventMethods['onTryHitField'];
	onTryHitSide?: MoveSpecificEventMethods['onTryHitSide'];
	onInvulnerability?: CommonHandlers['ExtResultMove'];
	onTryMove?: MoveSpecificEventMethods['onTryMove'];
	onTryPrimaryHit?: (this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove) => boolean | null | number | void;
	onType?: (this: Battle, types: string[], pokemon: Pokemon) => string[] | void;
	onUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onUpdate?: (this: Battle, pokemon: Pokemon) => void;
	onWeather?: (this: Battle, target: Pokemon, source: null, effect: Condition) => void;
	onWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];
	onFoeDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onFoeAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon) => void;
	onFoeAfterHit?: MoveSpecificEventMethods['onAfterHit'];
	onFoeAfterSetStatus?: (this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onFoeAfterSubDamage?: MoveSpecificEventMethods['onAfterSubDamage'];
	onFoeAfterSwitchInSelf?: (this: Battle, pokemon: Pokemon) => void;
	onFoeAfterUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onFoeAfterBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onFoeAfterFaint?: (this: Battle, length: number, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onFoeAfterMoveSecondarySelf?: MoveSpecificEventMethods['onAfterMoveSecondarySelf'];
	onFoeAfterMoveSecondary?: MoveSpecificEventMethods['onAfterMoveSecondary'];
	onFoeAfterMove?: MoveSpecificEventMethods['onAfterMove'];
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
	onFoeCriticalHit?: ((this: Battle, pokemon: Pokemon, source: null, move: ActiveMove) => boolean | void) | false;
	onFoeDamage?: (
		this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect
	) => number | boolean | null | void;
	onFoeDeductPP?: (this: Battle, target: Pokemon, source: Pokemon) => number | void;
	onFoeDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onFoeDragOut?: (this: Battle, pokemon: Pokemon, source?: Pokemon, move?: ActiveMove) => void;
	onFoeEatItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onFoeEffectiveness?: MoveSpecificEventMethods['onEffectiveness'];
	onFoeFaint?: CommonHandlers['VoidEffect'];
	onFoeFlinch?: ((this: Battle, pokemon: Pokemon) => boolean | void) | false;
	onFoeHit?: MoveSpecificEventMethods['onHit'];
	onFoeImmunity?: (this: Battle, type: string, pokemon: Pokemon) => void;
	onFoeLockMove?: string | ((this: Battle, pokemon: Pokemon) => void | string);
	onFoeMaybeTrapPokemon?: (this: Battle, pokemon: Pokemon, source?: Pokemon) => void;
	onFoeModifyAccuracy?: CommonHandlers['ModifierMove'];
	onFoeModifyAtk?: CommonHandlers['ModifierSourceMove'];
	onFoeModifyBoost?: (this: Battle, boosts: SparseBoostsTable, pokemon: Pokemon) => SparseBoostsTable | void;
	onFoeModifyCritRatio?: CommonHandlers['ModifierSourceMove'];
	onFoeModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onFoeModifyDef?: CommonHandlers['ModifierMove'];
	onFoeModifyMove?: MoveSpecificEventMethods['onModifyMove'];
	onFoeModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onFoeModifySecondaries?: (
		this: Battle, secondaries: SecondaryEffect[], target: Pokemon, source: Pokemon, move: ActiveMove
	) => void;
	onFoeModifySpA?: CommonHandlers['ModifierSourceMove'];
	onFoeModifySpD?: CommonHandlers['ModifierMove'];
	onFoeModifySpe?: (this: Battle, spe: number, pokemon: Pokemon) => number | void;
	onFoeModifyType?: MoveSpecificEventMethods['onModifyType'];
	onFoeModifyTarget?: MoveSpecificEventMethods['onModifyTarget'];
	onFoeModifyWeight?: (this: Battle, weighthg: number, pokemon: Pokemon) => number | void;
	onFoeMoveAborted?: CommonHandlers['VoidMove'];
	onFoeNegateImmunity?: ((this: Battle, pokemon: Pokemon, type: string) => boolean | void) | false;
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
	) | false;
	onFoeTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onFoeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onFoeTryAddVolatile?: (
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, sourceEffect: Effect
	) => boolean | null | void;
	onFoeTryEatItem?: false | ((this: Battle, item: Item, pokemon: Pokemon) => boolean | void);
	onFoeTryHeal?: (
		(this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | void
	) | false;
	onFoeTryHit?: MoveSpecificEventMethods['onTryHit'];
	onFoeTryHitField?: MoveSpecificEventMethods['onTryHitField'];
	onFoeTryHitSide?: CommonHandlers['ResultMove'];
	onFoeInvulnerability?: CommonHandlers['ExtResultMove'];
	onFoeTryMove?: MoveSpecificEventMethods['onTryMove'];
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
	onSourceAfterHit?: MoveSpecificEventMethods['onAfterHit'];
	onSourceAfterSetStatus?: (this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onSourceAfterSubDamage?: MoveSpecificEventMethods['onAfterSubDamage'];
	onSourceAfterSwitchInSelf?: (this: Battle, pokemon: Pokemon) => void;
	onSourceAfterUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onSourceAfterBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onSourceAfterFaint?: (this: Battle, length: number, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onSourceAfterMoveSecondarySelf?: MoveSpecificEventMethods['onAfterMoveSecondarySelf'];
	onSourceAfterMoveSecondary?: MoveSpecificEventMethods['onAfterMoveSecondary'];
	onSourceAfterMove?: MoveSpecificEventMethods['onAfterMove'];
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
	onSourceCriticalHit?: ((this: Battle, pokemon: Pokemon, source: null, move: ActiveMove) => boolean | void) | false;
	onSourceDamage?: (
		this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect
	) => number | boolean | null | void;
	onSourceDeductPP?: (this: Battle, target: Pokemon, source: Pokemon) => number | void;
	onSourceDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onSourceDragOut?: (this: Battle, pokemon: Pokemon, source?: Pokemon, move?: ActiveMove) => void;
	onSourceEatItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onSourceEffectiveness?: MoveSpecificEventMethods['onEffectiveness'];
	onSourceFaint?: CommonHandlers['VoidEffect'];
	onSourceFlinch?: ((this: Battle, pokemon: Pokemon) => boolean | void) | false;
	onSourceHit?: MoveSpecificEventMethods['onHit'];
	onSourceImmunity?: (this: Battle, type: string, pokemon: Pokemon) => void;
	onSourceLockMove?: string | ((this: Battle, pokemon: Pokemon) => void | string);
	onSourceMaybeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onSourceModifyAccuracy?: CommonHandlers['ModifierMove'];
	onSourceModifyAtk?: CommonHandlers['ModifierSourceMove'];
	onSourceModifyBoost?: (this: Battle, boosts: SparseBoostsTable, pokemon: Pokemon) => SparseBoostsTable | void;
	onSourceModifyCritRatio?: CommonHandlers['ModifierSourceMove'];
	onSourceModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onSourceModifyDef?: CommonHandlers['ModifierMove'];
	onSourceModifyMove?: MoveSpecificEventMethods['onModifyMove'];
	onSourceModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onSourceModifySecondaries?: (
		this: Battle, secondaries: SecondaryEffect[], target: Pokemon, source: Pokemon, move: ActiveMove
	) => void;
	onSourceModifySpA?: CommonHandlers['ModifierSourceMove'];
	onSourceModifySpD?: CommonHandlers['ModifierMove'];
	onSourceModifySpe?: (this: Battle, spe: number, pokemon: Pokemon) => number | void;
	onSourceModifyType?: MoveSpecificEventMethods['onModifyType'];
	onSourceModifyTarget?: MoveSpecificEventMethods['onModifyTarget'];
	onSourceModifyWeight?: (this: Battle, weighthg: number, pokemon: Pokemon) => number | void;
	onSourceMoveAborted?: CommonHandlers['VoidMove'];
	onSourceNegateImmunity?: ((this: Battle, pokemon: Pokemon, type: string) => boolean | void) | false;
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
	) | false;
	onSourceTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onSourceTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onSourceTryAddVolatile?: (
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, sourceEffect: Effect
	) => boolean | null | void;
	onSourceTryEatItem?: false | ((this: Battle, item: Item, pokemon: Pokemon) => boolean | void);
	onSourceTryHeal?: (
		(this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | void
	) | false;
	onSourceTryHit?: MoveSpecificEventMethods['onTryHit'];
	onSourceTryHitField?: MoveSpecificEventMethods['onTryHitField'];
	onSourceTryHitSide?: CommonHandlers['ResultMove'];
	onSourceInvulnerability?: CommonHandlers['ExtResultMove'];
	onSourceTryMove?: MoveSpecificEventMethods['onTryMove'];
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
	onAnyAfterHit?: MoveSpecificEventMethods['onAfterHit'];
	onAnyAfterSetStatus?: (this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAnyAfterSubDamage?: MoveSpecificEventMethods['onAfterSubDamage'];
	onAnyAfterSwitchInSelf?: (this: Battle, pokemon: Pokemon) => void;
	onAnyAfterUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onAnyAfterBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAnyAfterFaint?: (this: Battle, length: number, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAnyAfterMoveSecondarySelf?: MoveSpecificEventMethods['onAfterMoveSecondarySelf'];
	onAnyAfterMoveSecondary?: MoveSpecificEventMethods['onAfterMoveSecondary'];
	onAnyAfterMove?: MoveSpecificEventMethods['onAfterMove'];
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
	onAnyCriticalHit?: ((this: Battle, pokemon: Pokemon, source: null, move: ActiveMove) => boolean | void) | false;
	onAnyDamage?: (
		this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect
	) => number | boolean | null | void;
	onAnyDeductPP?: (this: Battle, target: Pokemon, source: Pokemon) => number | void;
	onAnyDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onAnyDragOut?: (this: Battle, pokemon: Pokemon, source?: Pokemon, move?: ActiveMove) => void;
	onAnyEatItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onAnyEffectiveness?: MoveSpecificEventMethods['onEffectiveness'];
	onAnyFaint?: CommonHandlers['VoidEffect'];
	onAnyFlinch?: ((this: Battle, pokemon: Pokemon) => boolean | void) | false;
	onAnyHit?: MoveSpecificEventMethods['onHit'];
	onAnyImmunity?: (this: Battle, type: string, pokemon: Pokemon) => void;
	onAnyLockMove?: string | ((this: Battle, pokemon: Pokemon) => void | string);
	onAnyMaybeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onAnyModifyAccuracy?: CommonHandlers['ModifierMove'];
	onAnyModifyAtk?: CommonHandlers['ModifierSourceMove'];
	onAnyModifyBoost?: (this: Battle, boosts: SparseBoostsTable, pokemon: Pokemon) => SparseBoostsTable | void;
	onAnyModifyCritRatio?: CommonHandlers['ModifierSourceMove'];
	onAnyModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onAnyModifyDef?: CommonHandlers['ModifierMove'];
	onAnyModifyMove?: MoveSpecificEventMethods['onModifyMove'];
	onAnyModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onAnyModifySecondaries?: (
		this: Battle, secondaries: SecondaryEffect[], target: Pokemon, source: Pokemon, move: ActiveMove
	) => void;
	onAnyModifySpA?: CommonHandlers['ModifierSourceMove'];
	onAnyModifySpD?: CommonHandlers['ModifierMove'];
	onAnyModifySpe?: (this: Battle, spe: number, pokemon: Pokemon) => number | void;
	onAnyModifyType?: MoveSpecificEventMethods['onModifyType'];
	onAnyModifyTarget?: MoveSpecificEventMethods['onModifyTarget'];
	onAnyModifyWeight?: (this: Battle, weighthg: number, pokemon: Pokemon) => number | void;
	onAnyMoveAborted?: CommonHandlers['VoidMove'];
	onAnyNegateImmunity?: ((this: Battle, pokemon: Pokemon, type: string) => boolean | void) | false;
	onAnyOverrideAction?: (this: Battle, pokemon: Pokemon, target: Pokemon, move: ActiveMove) => string | void;
	onAnyPrepareHit?: CommonHandlers['ResultSourceMove'];
	onAnyPseudoWeatherChange?: (this: Battle, target: Pokemon, source: Pokemon, pseudoWeather: Condition) => void;
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
	) | false;
	onAnyTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onAnyTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onAnyTryAddVolatile?: (
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, sourceEffect: Effect
	) => boolean | null | void;
	onAnyTryEatItem?: false | ((this: Battle, item: Item, pokemon: Pokemon) => boolean | void);
	onAnyTryHeal?: (
		(this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | void
	) | false;
	onAnyTryHit?: MoveSpecificEventMethods['onTryHit'];
	onAnyTryHitField?: MoveSpecificEventMethods['onTryHitField'];
	onAnyTryHitSide?: CommonHandlers['ResultMove'];
	onAnyInvulnerability?: CommonHandlers['ExtResultMove'];
	onAnyTryMove?: MoveSpecificEventMethods['onTryMove'];
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
	onAfterSetStatusPriority?: number;
	onAnyBasePowerPriority?: number;
	onAnyInvulnerabilityPriority?: number;
	onAnyModifyAccuracyPriority?: number;
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
	onFoeModifySpDPriority?: number;
	onFoeRedirectTargetPriority?: number;
	onFoeTrapPokemonPriority?: number;
	onFractionalPriorityPriority?: number;
	onHitPriority?: number;
	onInvulnerabilityPriority?: number;
	onModifyAccuracyPriority?: number;
	onModifyAtkPriority?: number;
	onModifyCritRatioPriority?: number;
	onModifyDefPriority?: number;
	onModifyMovePriority?: number;
	onModifyPriorityPriority?: number;
	onModifySpAPriority?: number;
	onModifySpDPriority?: number;
	onModifySpePriority?: number;
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

export interface PokemonSpecificEventMethods {
	onAllyDamagingHit?: (this: Battle, damage: number, target: Pokemon, source: Pokemon, move: ActiveMove) => void;
	onAllyAfterEachBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon) => void;
	onAllyAfterHit?: MoveSpecificEventMethods['onAfterHit'];
	onAllyAfterSetStatus?: (this: Battle, status: Condition, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAllyAfterSubDamage?: MoveSpecificEventMethods['onAfterSubDamage'];
	onAllyAfterSwitchInSelf?: (this: Battle, pokemon: Pokemon) => void;
	onAllyAfterUseItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onAllyAfterBoost?: (this: Battle, boost: SparseBoostsTable, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAllyAfterFaint?: (this: Battle, length: number, target: Pokemon, source: Pokemon, effect: Effect) => void;
	onAllyAfterMoveSecondarySelf?: MoveSpecificEventMethods['onAfterMoveSecondarySelf'];
	onAllyAfterMoveSecondary?: MoveSpecificEventMethods['onAfterMoveSecondary'];
	onAllyAfterMove?: MoveSpecificEventMethods['onAfterMove'];
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
	onAllyCriticalHit?: ((this: Battle, pokemon: Pokemon, source: null, move: ActiveMove) => boolean | void) | false;
	onAllyDamage?: (
		this: Battle, damage: number, target: Pokemon, source: Pokemon, effect: Effect
	) => number | boolean | null | void;
	onAllyDeductPP?: (this: Battle, target: Pokemon, source: Pokemon) => number | void;
	onAllyDisableMove?: (this: Battle, pokemon: Pokemon) => void;
	onAllyDragOut?: (this: Battle, pokemon: Pokemon, source?: Pokemon, move?: ActiveMove) => void;
	onAllyEatItem?: (this: Battle, item: Item, pokemon: Pokemon) => void;
	onAllyEffectiveness?: MoveSpecificEventMethods['onEffectiveness'];
	onAllyFaint?: CommonHandlers['VoidEffect'];
	onAllyFlinch?: ((this: Battle, pokemon: Pokemon) => boolean | void) | false;
	onAllyHit?: MoveSpecificEventMethods['onHit'];
	onAllyImmunity?: (this: Battle, type: string, pokemon: Pokemon) => void;
	onAllyLockMove?: string | ((this: Battle, pokemon: Pokemon) => void | string);
	onAllyMaybeTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onAllyModifyAccuracy?: CommonHandlers['ModifierMove'];
	onAllyModifyAtk?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyBoost?: (this: Battle, boosts: SparseBoostsTable, pokemon: Pokemon) => SparseBoostsTable | void;
	onAllyModifyCritRatio?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyDef?: CommonHandlers['ModifierMove'];
	onAllyModifyMove?: MoveSpecificEventMethods['onModifyMove'];
	onAllyModifyPriority?: CommonHandlers['ModifierSourceMove'];
	onAllyModifySecondaries?: (
		this: Battle, secondaries: SecondaryEffect[], target: Pokemon, source: Pokemon, move: ActiveMove
	) => void;
	onAllyModifySpA?: CommonHandlers['ModifierSourceMove'];
	onAllyModifySpD?: CommonHandlers['ModifierMove'];
	onAllyModifySpe?: (this: Battle, spe: number, pokemon: Pokemon) => number | void;
	onAllyModifyType?: MoveSpecificEventMethods['onModifyType'];
	onAllyModifyTarget?: MoveSpecificEventMethods['onModifyTarget'];
	onAllyModifyWeight?: (this: Battle, weighthg: number, pokemon: Pokemon) => number | void;
	onAllyMoveAborted?: CommonHandlers['VoidMove'];
	onAllyNegateImmunity?: ((this: Battle, pokemon: Pokemon, type: string) => boolean | void) | false;
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
	onAllySideConditionStart?: (this: Battle, target: Pokemon, source: Pokemon, sideCondition: Condition) => void;
	onAllyStallMove?: (this: Battle, pokemon: Pokemon) => boolean | void;
	onAllySwitchIn?: (this: Battle, pokemon: Pokemon) => void;
	onAllySwitchOut?: (this: Battle, pokemon: Pokemon) => void;
	onAllyTakeItem?: (
		(this: Battle, item: Item, pokemon: Pokemon, source: Pokemon, move?: ActiveMove) => boolean | void
	) | false;
	onAllyTerrain?: (this: Battle, pokemon: Pokemon) => void;
	onAllyTrapPokemon?: (this: Battle, pokemon: Pokemon) => void;
	onAllyTryAddVolatile?: (
		this: Battle, status: Condition, target: Pokemon, source: Pokemon, sourceEffect: Effect
	) => boolean | null | void;
	onAllyTryEatItem?: false | ((this: Battle, item: Item, pokemon: Pokemon) => boolean | void);
	onAllyTryHeal?: (
		(this: Battle, relayVar: number, target: Pokemon, source: Pokemon, effect: Effect) => number | boolean | void
	) | false;
	onAllyTryHit?: MoveSpecificEventMethods['onTryHit'];
	onAllyTryHitField?: MoveSpecificEventMethods['onTryHitField'];
	onAllyTryHitSide?: CommonHandlers['ResultMove'];
	onAllyInvulnerability?: CommonHandlers['ExtResultMove'];
	onAllyTryMove?: MoveSpecificEventMethods['onTryMove'];
	onAllyTryPrimaryHit?: (
		this: Battle, target: Pokemon, source: Pokemon, move: ActiveMove
	) => boolean | null | number | void;
	onAllyType?: (this: Battle, types: string[], pokemon: Pokemon) => string[] | void;
	onAllyUpdate?: (this: Battle, pokemon: Pokemon) => void;
	onAllyWeather?: (this: Battle, target: Pokemon, source: null, effect: Condition) => void;
	onAllyWeatherModifyDamage?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyDamagePhase1?: CommonHandlers['ModifierSourceMove'];
	onAllyModifyDamagePhase2?: CommonHandlers['ModifierSourceMove'];
}

export type PokemonEventMethods = EventHandlers<PokemonSpecificEventMethods>;

interface SideSpecificEventMethods {
	onSideStart?: (this: Battle, target: Side, source: Pokemon, sourceEffect: Effect | null) => void;
	onSideRestart?: (this: Battle, target: Side, source: Pokemon, sourceEffect: Effect | null) => void;
	onSideResidual?: (this: Battle, target: Side, source: Pokemon, effect: Effect) => void;
	onSideEnd?: (this: Battle, target: Side) => void;
	onSideResidualOrder?: number;
	onSideResidualPriority?: number;
	onSideResidualSubOrder?: number;
}
export type SideEventMethods = EventHandlers<SideSpecificEventMethods & ConditionEventMethods>;

interface FieldSpecificEventMethods {
	onFieldStart?: (this: Battle, target: Field, source: Pokemon | null, sourceEffect: Effect | null) => void;
	onFieldRestart?: (this: Battle, target: Field, source: Pokemon | null, sourceEffect: Effect | null) => void;
	onFieldResidual?: (this: Battle, target: Field, source: Pokemon, effect: Effect) => void;
	onFieldEnd?: (this: Battle, target: Field) => void;
	onFieldResidualOrder?: number;
	onFieldResidualPriority?: number;
	onFieldResidualSubOrder?: number;
}
export type FieldEventMethods = EventHandlers<FieldSpecificEventMethods & ConditionEventMethods>;

interface PokemonConditionSpecificEventMethods {
	onEnd?: (this: Battle, target: Pokemon) => void;
	onRestart?: (this: Battle, target: Pokemon, source: Pokemon, sourceEffect: Effect | null) => boolean | null | void;
	onStart?: (this: Battle, target: Pokemon, source: Pokemon, sourceEffect: Effect | null) => boolean | null | void;
}
type PokemonConditionEventMethods = EventHandlers<PokemonSpecificEventMethods & PokemonConditionSpecificEventMethods &
ConditionEventMethods>;

export type ForbidDefinedProperties<T extends PropertyKey> = {[_ in T]?: undefined};
export type EventHandlers<T> = ForbidDefinedProperties<Exclude<EventMethodName, keyof T | keyof EventMethods>> &
EventMethods & T;
export type NoEventMethods = ForbidDefinedProperties<EventMethodName>;

export interface PokemonConditionData extends Partial<ConditionEffect>, PokemonConditionEventMethods {}
export interface SideConditionData extends Partial<ConditionEffect>, SideEventMethods {}
export interface FieldConditionData extends Partial<ConditionEffect>, FieldEventMethods {}
export type ConditionData = PokemonConditionData | SideConditionData | FieldConditionData;
export type ConditionEventHandlers = EventHandlers<PokemonConditionEventMethods | SideEventMethods | FieldEventMethods>;

export type ModdedConditionData = ConditionData & {inherit?: true};

interface ConditionEventMethods {
	onCopy?: (this: Battle, pokemon: Pokemon) => void;
}
export type Condition = ConditionEffect & ModdedConditionData;
export class ConditionEffect extends BasicEffect implements Readonly<BasicEffect> {
	declare readonly effectType: 'Condition' | 'Weather' | 'Status' | 'Terastal';
	declare readonly counterMax?: number;

	declare readonly durationCallback?: (this: Battle, target: Pokemon, source: Pokemon, effect: Effect | null) => number;

	constructor(data: AnyObject) {
		super(data);
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		data = this;
		this.effectType = (['Weather', 'Status'].includes(data.effectType) ? data.effectType : 'Condition');
	}
}
export type PokemonCondition = Condition & PokemonConditionData;

const EMPTY_CONDITION: Condition = new ConditionEffect({name: '', exists: false});

export class DexConditions {
	readonly dex: ModdedDex;
	readonly conditionCache = new Map<ID, Condition>();

	durationCallback?: (this: Battle, target: Pokemon, source: Pokemon, effect: Effect | null) => number;

	constructor(dex: ModdedDex) {
		this.dex = dex;
	}

	get(name?: string | Effect | null): Condition {
		if (!name) return EMPTY_CONDITION;
		if (typeof name !== 'string') return name as Condition;

		return this.getByID(name.startsWith('item:') || name.startsWith('ability:') ? name as ID : toID(name));
	}

	getByID(id: ID): Condition {
		if (!id) return EMPTY_CONDITION;

		let condition = this.conditionCache.get(id);
		if (condition) return condition;

		let found;
		if (id.startsWith('item:')) {
			const item = this.dex.items.getByID(id.slice(5) as ID);
			condition = {...item, id: 'item:' + item.id as ID} as any as Condition;
		} else if (id.startsWith('ability:')) {
			const ability = this.dex.abilities.getByID(id.slice(8) as ID);
			condition = {...ability, id: 'ability:' + ability.id as ID} as any as Condition;
		} else if (this.dex.data.Rulesets.hasOwnProperty(id)) {
			condition = this.dex.formats.get(id) as any as Condition;
		} else if (this.dex.data.Conditions.hasOwnProperty(id)) {
			condition = new ConditionEffect({name: id, ...this.dex.data.Conditions[id]});
		} else if (
			(this.dex.data.Moves.hasOwnProperty(id) && (found = this.dex.data.Moves[id]).condition) ||
			(this.dex.data.Abilities.hasOwnProperty(id) && (found = this.dex.data.Abilities[id]).condition) ||
			(this.dex.data.Items.hasOwnProperty(id) && (found = this.dex.data.Items[id]).condition)
		) {
			condition = new ConditionEffect({name: found.name || id, ...found.condition});
		} else if (id === 'recoil') {
			condition = new ConditionEffect({name: 'Recoil', effectType: 'Recoil'});
		} else if (id === 'drain') {
			condition = new ConditionEffect({name: 'Drain', effectType: 'Drain'});
		} else {
			condition = new ConditionEffect({name: id, exists: false});
		}

		this.conditionCache.set(id, condition);
		return condition;
	}
}
