/**
 * Simulator Field
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */

import { State } from './state';
import { type EffectState } from './pokemon';
import { toID } from './dex';

export class Field {
	readonly battle: Battle;
	readonly id: ID;

	climateWeather: ID;
	climateWeatherState: EffectState;
	irritantWeather: ID;
	irritantWeatherState: EffectState;
	energyWeather: ID;
	energyWeatherState: EffectState;
	clearingWeather: ID;
	clearingWeatherState: EffectState;
	cataclysmWeather: ID;
	cataclysmWeatherState: EffectState;
	activeWeathers: ID[];
	terrain: ID;
	terrainState: EffectState;
	pseudoWeather: { [id: string]: EffectState };

	constructor(battle: Battle) {
		this.battle = battle;
		const fieldScripts = this.battle.format.field || this.battle.dex.data.Scripts.field;
		if (fieldScripts) Object.assign(this, fieldScripts);
		this.id = '';

		this.climateWeather = '';
		this.climateWeatherState = this.battle.initEffectState({ id: '' });
		this.irritantWeather = '';
		this.irritantWeatherState = this.battle.initEffectState({ id: '' });
		this.energyWeather = '';
		this.energyWeatherState = this.battle.initEffectState({ id: '' });
		this.clearingWeather = '';
		this.clearingWeatherState = this.battle.initEffectState({ id: '' });
		this.cataclysmWeather = '';
		this.cataclysmWeatherState = this.battle.initEffectState({ id: '' });
		this.activeWeathers = [];
		this.terrain = '';
		this.terrainState = this.battle.initEffectState({ id: '' });
		this.pseudoWeather = {};
	}

	toJSON(): AnyObject {
		return State.serializeField(this);
	}

	setClimateWeather(
		status: string | Condition, source: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null
	) {
		status = this.battle.dex.conditions.get(status);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		if (source === 'debug') source = this.battle.sides[0].active[0];

		if (this.climateWeather === status.id) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				if (this.battle.gen > 5 || this.climateWeatherState.duration === 0) {
					return false;
				}
			} else if (this.battle.gen > 2 || status.id === 'sandstorm') {
				return false;
			}
		}
		if (source) {
			const result = this.battle.runEvent('SetClimateWeather', source, source, status);
			if (!result) {
				if (result === false) {
					if ((sourceEffect as Move)?.climateWeather) {
						this.battle.add('-fail', source, sourceEffect, '[from] ' + this.climateWeather);
					} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
						this.battle.add('-ability', source, sourceEffect, '[from] ' + this.climateWeather, '[fail]');
					}
				}
				return null;
			}
		}
		const prevClimateWeather = this.climateWeather;
		const prevClimateWeatherState = this.climateWeatherState;
		this.climateWeather = status.id;
		this.climateWeatherState = this.battle.initEffectState({ id: status.id });
		if (source) {
			this.climateWeatherState.source = source;
			this.climateWeatherState.sourceSlot = source.getSlot();
		}
		if (status.duration) {
			this.climateWeatherState.duration = status.duration;
		}
		if (status.durationCallback) {
			if (!source) throw new Error(`setting climateWeather without a source`);
			this.climateWeatherState.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
		}
		if (!this.battle.singleEvent('FieldStart', status, this.climateWeatherState, this, source, sourceEffect)) {
			this.climateWeather = prevClimateWeather;
			this.climateWeatherState = prevClimateWeatherState;
			return false;
		}
		const indexToRemove = this.activeWeathers.indexOf(prevClimateWeather);
		if (indexToRemove !== -1) {
			this.activeWeathers.splice(indexToRemove, 1);
		}
		this.activeWeathers.push(this.climateWeather);
		this.battle.eachEvent('ClimateWeatherChange', sourceEffect);
		return true;
	}

	setIrritantWeather(
		status: string | Condition, source: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null
	) {
		status = this.battle.dex.conditions.get(status);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		if (source === 'debug') source = this.battle.sides[0].active[0];

		if (this.irritantWeather === status.id) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				if (this.battle.gen > 5 || this.irritantWeatherState.duration === 0) {
					return false;
				}
			} else if (this.battle.gen > 2 || status.id === 'sandstorm') {
				return false;
			}
		}
		if (source) {
			const result = this.battle.runEvent('SetIrritantWeather', source, source, status);
			if (!result) {
				if (result === false) {
					if ((sourceEffect as Move)?.irritantWeather) {
						this.battle.add('-fail', source, sourceEffect, '[from] ' + this.irritantWeather);
					} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
						this.battle.add('-ability', source, sourceEffect, '[from] ' + this.irritantWeather, '[fail]');
					}
				}
				return null;
			}
		}
		const prevIrritantWeather = this.irritantWeather;
		const prevIrritantWeatherState = this.irritantWeatherState;
		this.irritantWeather = status.id;
		this.irritantWeatherState = this.battle.initEffectState({ id: '' });
		if (source) {
			this.irritantWeatherState.source = source;
			this.irritantWeatherState.sourceSlot = source.getSlot();
		}
		if (status.duration) {
			this.irritantWeatherState.duration = status.duration;
		}
		if (status.durationCallback) {
			if (!source) throw new Error(`setting irritantWeather without a source`);
			this.irritantWeatherState.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
		}
		if (!this.battle.singleEvent('FieldStart', status, this.irritantWeatherState, this, source, sourceEffect)) {
			this.irritantWeather = prevIrritantWeather;
			this.irritantWeatherState = prevIrritantWeatherState;
			return false;
		}
		const indexToRemove = this.activeWeathers.indexOf(prevIrritantWeather);
		if (indexToRemove !== -1) {
			this.activeWeathers.splice(indexToRemove, 1);
		}
		this.activeWeathers.push(this.irritantWeather);
		this.battle.eachEvent('IrritantWeatherChange', sourceEffect);
		return true;
	}

	setEnergyWeather(
		status: string | Condition, source: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null
	) {
		status = this.battle.dex.conditions.get(status);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		if (source === 'debug') source = this.battle.sides[0].active[0];

		if (this.energyWeather === status.id) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				if (this.battle.gen > 5 || this.energyWeatherState.duration === 0) {
					return false;
				}
			} else if (this.battle.gen > 2 || status.id === 'sandstorm') {
				return false;
			}
		}
		if (source) {
			const result = this.battle.runEvent('SetEnergyWeather', source, source, status);
			if (!result) {
				if (result === false) {
					if ((sourceEffect as Move)?.energyWeather) {
						this.battle.add('-fail', source, sourceEffect, '[from] ' + this.energyWeather);
					} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
						this.battle.add('-ability', source, sourceEffect, '[from] ' + this.energyWeather, '[fail]');
					}
				}
				return null;
			}
		}
		const prevEnergyWeather = this.energyWeather;
		const prevEnergyWeatherState = this.energyWeatherState;
		this.energyWeather = status.id;
		this.energyWeatherState = this.battle.initEffectState({ id: '' });
		if (source) {
			this.energyWeatherState.source = source;
			this.energyWeatherState.sourceSlot = source.getSlot();
		}
		if (status.duration) {
			this.energyWeatherState.duration = status.duration;
		}
		if (status.durationCallback) {
			if (!source) throw new Error(`setting energyWeather without a source`);
			this.energyWeatherState.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
		}
		if (!this.battle.singleEvent('FieldStart', status, this.energyWeatherState, this, source, sourceEffect)) {
			this.energyWeather = prevEnergyWeather;
			this.energyWeatherState = prevEnergyWeatherState;
			return false;
		}
		const indexToRemove = this.activeWeathers.indexOf(prevEnergyWeather);
		if (indexToRemove !== -1) {
			this.activeWeathers.splice(indexToRemove, 1);
		}
		this.activeWeathers.push(this.energyWeather);
		this.battle.eachEvent('EnergyWeatherChange', sourceEffect);
		return true;
	}

	setClearingWeather(
		status: string | Condition, source: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null
	) {
		status = this.battle.dex.conditions.get(status);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		if (source === 'debug') source = this.battle.sides[0].active[0];

		if (this.clearingWeather === status.id) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				if (this.battle.gen > 5 || this.clearingWeatherState.duration === 0) {
					return false;
				}
			} else if (this.battle.gen > 2 || status.id === 'sandstorm') {
				return false;
			}
		}
		if (source) {
			const result = this.battle.runEvent('SetClearingWeather', source, source, status);
			if (!result) {
				if (result === false) {
					if ((sourceEffect as Move)?.clearingWeather) {
						this.battle.add('-fail', source, sourceEffect, '[from] ' + this.clearingWeather);
					} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
						this.battle.add('-ability', source, sourceEffect, '[from] ' + this.clearingWeather, '[fail]');
					}
				}
				return null;
			}
		}
		const prevClearingWeather = this.clearingWeather;
		const prevClearingWeatherState = this.clearingWeatherState;
		this.clearingWeather = status.id;
		this.clearingWeatherState = this.battle.initEffectState({ id: '' });
		if (source) {
			this.clearingWeatherState.source = source;
			this.clearingWeatherState.sourceSlot = source.getSlot();
		}
		if (status.duration) {
			this.clearingWeatherState.duration = status.duration;
		}
		if (status.durationCallback) {
			if (!source) throw new Error(`setting clearingWeather without a source`);
			this.clearingWeatherState.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
		}
		if (!this.battle.singleEvent('FieldStart', status, this.clearingWeatherState, this, source, sourceEffect)) {
			this.clearingWeather = prevClearingWeather;
			this.clearingWeatherState = prevClearingWeatherState;
			return false;
		}
		const indexToRemove = this.activeWeathers.indexOf(prevClearingWeather);
		if (indexToRemove !== -1) {
			this.activeWeathers.splice(indexToRemove, 1);
		}
		this.activeWeathers.push(this.clearingWeather);
		this.battle.eachEvent('ClearingWeatherChange', sourceEffect);
		return true;
	}

	setCataclysmWeather(
		status: string | Condition, source: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null
	) {
		status = this.battle.dex.conditions.get(status);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		if (source === 'debug') source = this.battle.sides[0].active[0];

		if (this.cataclysmWeather === status.id) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				if (this.battle.gen > 5 || this.cataclysmWeatherState.duration === 0) {
					return false;
				}
			} else if (this.battle.gen > 2 || status.id === 'sandstorm') {
				return false;
			}
		}
		if (source) {
			const result = this.battle.runEvent('SetCataclysmWeather', source, source, status);
			if (!result) {
				if (result === false) {
					if ((sourceEffect as Move)?.cataclysmWeather) {
						this.battle.add('-fail', source, sourceEffect, '[from] ' + this.cataclysmWeather);
					} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
						this.battle.add('-ability', source, sourceEffect, '[from] ' + this.cataclysmWeather, '[fail]');
					}
				}
				return null;
			}
		}
		const prevCataclysmWeather = this.cataclysmWeather;
		const prevCataclysmWeatherState = this.cataclysmWeatherState;
		this.cataclysmWeather = status.id;
		this.cataclysmWeatherState = this.battle.initEffectState({ id: '' });
		if (source) {
			this.cataclysmWeatherState.source = source;
			this.cataclysmWeatherState.sourceSlot = source.getSlot();
		}
		if (status.duration) {
			this.cataclysmWeatherState.duration = status.duration;
		}
		if (status.durationCallback) {
			if (!source) throw new Error(`setting cataclysmWeather without a source`);
			this.cataclysmWeatherState.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
		}
		if (!this.battle.singleEvent('FieldStart', status, this.cataclysmWeatherState, this, source, sourceEffect)) {
			this.cataclysmWeather = prevCataclysmWeather;
			this.cataclysmWeatherState = prevCataclysmWeatherState;
			return false;
		}
		const indexToRemove = this.activeWeathers.indexOf(prevCataclysmWeather);
		if (indexToRemove !== -1) {
			this.activeWeathers.splice(indexToRemove, 1);
		}
		this.activeWeathers.push(this.cataclysmWeather);
		this.battle.eachEvent('CataclysmWeatherChange', sourceEffect);
		return true;
	}

	clearClimateWeather() {
		if (!this.climateWeather) return false;
		const indexToRemove = this.activeWeathers.indexOf(this.climateWeather);
		if (indexToRemove !== -1) {
			this.activeWeathers.splice(indexToRemove, 1);
		}
		const prevClimateWeather = this.getClimateWeather();
		this.battle.singleEvent('FieldEnd', prevClimateWeather, this.climateWeatherState, this);
		this.climateWeather = '';
		this.battle.clearEffectState(this.climateWeatherState);
		this.battle.eachEvent('ClimateWeatherChange');
		return true;
	}

	clearIrritantWeather() {
		if (!this.irritantWeather) return false;
		const indexToRemove = this.activeWeathers.indexOf(this.irritantWeather);
		if (indexToRemove !== -1) {
			this.activeWeathers.splice(indexToRemove, 1);
		}
		const prevIrritantWeather = this.getIrritantWeather();
		this.battle.singleEvent('FieldEnd', prevIrritantWeather, this.irritantWeatherState, this);
		this.irritantWeather = '';
		this.battle.clearEffectState(this.irritantWeatherState);
		this.battle.eachEvent('IrritantWeatherChange');
		return true;
	}

	clearEnergyWeather() {
		if (!this.energyWeather) return false;
		const indexToRemove = this.activeWeathers.indexOf(this.energyWeather);
		if (indexToRemove !== -1) {
			this.activeWeathers.splice(indexToRemove, 1);
		}
		const prevEnergyWeather = this.getEnergyWeather();
		this.battle.singleEvent('FieldEnd', prevEnergyWeather, this.energyWeatherState, this);
		this.energyWeather = '';
		this.battle.clearEffectState(this.energyWeatherState);
		this.battle.eachEvent('EnergyWeatherChange');
		return true;
	}

	clearClearingWeather() {
		if (!this.clearingWeather) return false;
		const indexToRemove = this.activeWeathers.indexOf(this.clearingWeather);
		if (indexToRemove !== -1) {
			this.activeWeathers.splice(indexToRemove, 1);
		}
		const prevClearingWeather = this.getClearingWeather();
		this.battle.singleEvent('FieldEnd', prevClearingWeather, this.clearingWeatherState, this);
		this.clearingWeather = '';
		this.battle.clearEffectState(this.clearingWeatherState);
		this.battle.eachEvent('ClearingWeatherChange');
		return true;
	}

	clearCataclysmWeather() {
		if (!this.cataclysmWeather) return false;
		const indexToRemove = this.activeWeathers.indexOf(this.cataclysmWeather);
		if (indexToRemove !== -1) {
			this.activeWeathers.splice(indexToRemove, 1);
		}
		const prevCataclysmWeather = this.getCataclysmWeather();
		this.battle.singleEvent('FieldEnd', prevCataclysmWeather, this.cataclysmWeatherState, this);
		this.cataclysmWeather = '';
		this.battle.clearEffectState(this.cataclysmWeatherState);
		this.battle.eachEvent('CataclysmWeatherChange');
		return true;
	}

	effectiveClimateWeather() {
		if (this.suppressingClimateWeather()) return '';
		return this.climateWeather;
	}

	effectiveIrritantWeather() {
		if (this.suppressingIrritantWeather()) return '';
		return this.irritantWeather;
	}

	effectiveEnergyWeather() {
		if (this.suppressingEnergyWeather()) return '';
		return this.energyWeather;
	}

	effectiveClearingWeather() {
		if (this.suppressingClearingWeather()) return '';
		return this.clearingWeather;
	}

	effectiveCataclysmWeather() {
		if (this.suppressingCataclysmWeather()) return '';
		return this.cataclysmWeather;
	}

	suppressingClimateWeather() {
		for (const side of this.battle.sides) {
			for (const pokemon of side.active) {
				if (pokemon && !pokemon.fainted && !pokemon.ignoringAbility() &&
					pokemon.getAbility().suppressClimateWeather && !pokemon.abilityState.ending) {
					return true;
				}
			}
		}
		return false;
	}

	suppressingIrritantWeather() {
		for (const side of this.battle.sides) {
			for (const pokemon of side.active) {
				if (pokemon && !pokemon.fainted && !pokemon.ignoringAbility() &&
					pokemon.getAbility().suppressIrritantWeather && !pokemon.abilityState.ending) {
					return true;
				}
			}
		}
		return false;
	}

	suppressingEnergyWeather() {
		for (const side of this.battle.sides) {
			for (const pokemon of side.active) {
				if (pokemon && !pokemon.fainted && !pokemon.ignoringAbility() &&
					pokemon.getAbility().suppressEnergyWeather && !pokemon.abilityState.ending) {
					return true;
				}
			}
		}
		return false;
	}

	suppressingClearingWeather() {
		for (const side of this.battle.sides) {
			for (const pokemon of side.active) {
				if (pokemon && !pokemon.fainted && !pokemon.ignoringAbility() &&
					pokemon.getAbility().suppressClearingWeather && !pokemon.abilityState.ending) {
					return true;
				}
			}
		}
		return false;
	}

	suppressingCataclysmWeather() {
		for (const side of this.battle.sides) {
			for (const pokemon of side.active) {
				if (pokemon && !pokemon.fainted && !pokemon.ignoringAbility() &&
					pokemon.getAbility().suppressCataclysmWeather && !pokemon.abilityState.ending) {
					return true;
				}
			}
		}
		return false;
	}

	isClimateWeather(climateWeather: string | string[]) {
		const ourClimateWeather = this.effectiveClimateWeather();
		if (!Array.isArray(climateWeather)) {
			return ourClimateWeather === toID(climateWeather);
		}
		return climateWeather.map(toID).includes(ourClimateWeather);
	}

	isIrritantWeather(irritantWeather: string | string[]) {
		const ourIrritantWeather = this.effectiveIrritantWeather();
		if (!Array.isArray(irritantWeather)) {
			return ourIrritantWeather === toID(irritantWeather);
		}
		return irritantWeather.map(toID).includes(ourIrritantWeather);
	}

	isEnergyWeather(energyWeather: string | string[]) {
		const ourEnergyWeather = this.effectiveEnergyWeather();
		if (!Array.isArray(energyWeather)) {
			return ourEnergyWeather === toID(energyWeather);
		}
		return energyWeather.map(toID).includes(ourEnergyWeather);
	}

	isClearingWeather(clearingWeather: string | string[]) {
		const ourClearingWeather = this.effectiveClearingWeather();
		if (!Array.isArray(clearingWeather)) {
			return ourClearingWeather === toID(clearingWeather);
		}
		return clearingWeather.map(toID).includes(ourClearingWeather);
	}

	isCataclysmWeather(cataclysmWeather: string | string[]) {
		const ourCataclysmWeather = this.effectiveCataclysmWeather();
		if (!Array.isArray(cataclysmWeather)) {
			return ourCataclysmWeather === toID(cataclysmWeather);
		}
		return cataclysmWeather.map(toID).includes(ourCataclysmWeather);
	}

	getClimateWeather() {
		return this.battle.dex.conditions.getByID(this.climateWeather);
	}

	getIrritantWeather() {
		return this.battle.dex.conditions.getByID(this.irritantWeather);
	}

	getEnergyWeather() {
		return this.battle.dex.conditions.getByID(this.energyWeather);
	}

	getClearingWeather() {
		return this.battle.dex.conditions.getByID(this.clearingWeather);
	}

	getCataclysmWeather() {
		return this.battle.dex.conditions.getByID(this.cataclysmWeather);
	}

	getRecentWeather(exclude: string | string[] | null = null, pokemon: Pokemon | null = null): ID {
		if (this.activeWeathers.length <= 0) return '';
		for (let i = this.activeWeathers.length; i > 0; i--) {
			const recentWeather = this.activeWeathers[i - 1];
			if (!exclude?.includes(recentWeather) &&
				(pokemon && (recentWeather === pokemon.effectiveClimateWeather() ||
					recentWeather === pokemon.effectiveIrritantWeather() ||
					recentWeather === pokemon.effectiveEnergyWeather() ||
					recentWeather === pokemon.effectiveClearingWeather() ||
					recentWeather === pokemon.effectiveCataclysmWeather()))) {
				return recentWeather;
			}
		}
		return '';
	}

	setTerrain(status: string | Effect, source: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null) {
		status = this.battle.dex.conditions.get(status);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		if (source === 'debug') source = this.battle.sides[0].active[0];
		if (!source) throw new Error(`setting terrain without a source`);

		if (this.terrain === status.id) return false;
		const prevTerrain = this.terrain;
		const prevTerrainState = this.terrainState;
		this.terrain = status.id;
		this.terrainState = this.battle.initEffectState({
			id: status.id,
			source,
			sourceSlot: source.getSlot(),
			duration: status.duration,
		});
		if (status.durationCallback) {
			this.terrainState.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
		}
		if (!this.battle.singleEvent('FieldStart', status, this.terrainState, this, source, sourceEffect)) {
			this.terrain = prevTerrain;
			this.terrainState = prevTerrainState;
			return false;
		}
		this.battle.eachEvent('TerrainChange', sourceEffect);
		return true;
	}

	clearTerrain() {
		if (!this.terrain) return false;
		const prevTerrain = this.getTerrain();
		this.battle.singleEvent('FieldEnd', prevTerrain, this.terrainState, this);
		this.terrain = '';
		this.battle.clearEffectState(this.terrainState);
		this.battle.eachEvent('TerrainChange');
		return true;
	}

	effectiveTerrain(target?: Pokemon | Side | Battle) {
		if (this.battle.event && !target) target = this.battle.event.target;
		return this.battle.runEvent('TryTerrain', target) ? this.terrain : '';
	}

	isTerrain(terrain: string | string[], target?: Pokemon | Side | Battle) {
		const ourTerrain = this.effectiveTerrain(target);
		if (!Array.isArray(terrain)) {
			return ourTerrain === toID(terrain);
		}
		return terrain.map(toID).includes(ourTerrain);
	}

	getTerrain() {
		return this.battle.dex.conditions.getByID(this.terrain);
	}

	addPseudoWeather(
		status: string | Condition,
		source: Pokemon | 'debug' | null = null,
		sourceEffect: Effect | null = null
	): boolean {
		if (!source && this.battle.event?.target) source = this.battle.event.target;
		if (source === 'debug') source = this.battle.sides[0].active[0];
		status = this.battle.dex.conditions.get(status);

		let state = this.pseudoWeather[status.id];
		if (state) {
			if (!(status as any).onFieldRestart) return false;
			return this.battle.singleEvent('FieldRestart', status, state, this, source, sourceEffect);
		}
		state = this.pseudoWeather[status.id] = this.battle.initEffectState({
			id: status.id,
			source,
			sourceSlot: source?.getSlot(),
			duration: status.duration,
		});
		if (status.durationCallback) {
			if (!source) throw new Error(`setting fieldcond without a source`);
			state.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
		}
		if (!this.battle.singleEvent('FieldStart', status, state, this, source, sourceEffect)) {
			delete this.pseudoWeather[status.id];
			return false;
		}
		this.battle.runEvent('PseudoWeatherChange', source, source, status);
		return true;
	}

	getPseudoWeather(status: string | Effect) {
		status = this.battle.dex.conditions.get(status);
		return this.pseudoWeather[status.id] ? status : null;
	}

	removePseudoWeather(status: string | Effect) {
		status = this.battle.dex.conditions.get(status);
		const state = this.pseudoWeather[status.id];
		if (!state) return false;
		this.battle.singleEvent('FieldEnd', status, state, this);
		delete this.pseudoWeather[status.id];
		return true;
	}

	destroy() {
		// deallocate ourself

		// get rid of some possibly-circular references
		(this as any).battle = null!;
	}
}
