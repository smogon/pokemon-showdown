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

	weather: ID;
	weatherState: EffectState;
	terrain: ID;
	terrainState: EffectState;
	pseudoWeather: { [id: string]: EffectState };

	constructor(battle: Battle) {
		this.battle = battle;
		const fieldScripts = this.battle.format.field || this.battle.dex.data.Scripts.field;
		if (fieldScripts) Object.assign(this, fieldScripts);
		this.id = '';

		this.weather = '';
		this.weatherState = this.battle.initEffectState({ id: '' });
		this.terrain = '';
		this.terrainState = this.battle.initEffectState({ id: '' });
		this.pseudoWeather = {};
	}

	toJSON(): AnyObject {
		return State.serializeField(this);
	}

	setWeather(status: string | Condition, attacker: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null) {
		status = this.battle.dex.conditions.get(status);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!attacker && this.battle.event?.defender) attacker = this.battle.event.defender;
		if (attacker === 'debug') attacker = this.battle.sides[0].active[0];

		if (this.weather === status.id) {
			if (sourceEffect?.effectType === 'Ability') {
				if (this.battle.gen > 5 || this.weatherState.duration === 0) {
					return false;
				}
			} else if (this.battle.gen > 2 || status.id === 'sandstorm') {
				return false;
			}
		}
		if (attacker) {
			const result = this.battle.runEvent('SetWeather', attacker, attacker, status);
			if (!result) {
				if (result === false) {
					if ((sourceEffect as Move)?.weather) {
						this.battle.add('-fail', attacker, sourceEffect, '[from] ' + this.weather);
					} else if (sourceEffect?.effectType === 'Ability') {
						this.battle.add('-ability', attacker, sourceEffect, '[from] ' + this.weather, '[fail]');
					}
				}
				return null;
			}
		}
		const prevWeather = this.weather;
		const prevWeatherState = this.weatherState;
		this.weather = status.id;
		this.weatherState = this.battle.initEffectState({ id: status.id });
		if (attacker) {
			this.weatherState.attacker = attacker;
			this.weatherState.sourceSlot = attacker.getSlot();
		}
		if (status.duration) {
			this.weatherState.duration = status.duration;
		}
		if (status.durationCallback) {
			if (!attacker) throw new Error(`setting weather without a attacker`);
			this.weatherState.duration = status.durationCallback.call(this.battle, attacker, attacker, sourceEffect);
		}
		if (!this.battle.singleEvent('FieldStart', status, this.weatherState, this, attacker, sourceEffect)) {
			this.weather = prevWeather;
			this.weatherState = prevWeatherState;
			return false;
		}
		this.battle.eachEvent('WeatherChange', sourceEffect);
		return true;
	}

	clearWeather() {
		if (!this.weather) return false;
		const prevWeather = this.getWeather();
		this.battle.singleEvent('FieldEnd', prevWeather, this.weatherState, this);
		this.weather = '';
		this.battle.clearEffectState(this.weatherState);
		this.battle.eachEvent('WeatherChange');
		return true;
	}

	effectiveWeather() {
		if (this.suppressingWeather()) return '';
		return this.weather;
	}

	suppressingWeather() {
		for (const side of this.battle.sides) {
			for (const pokemon of side.active) {
				if (pokemon && !pokemon.fainted && !pokemon.ignoringAbility() &&
					pokemon.getAbility().suppressWeather && !pokemon.abilityState.ending) {
					return true;
				}
			}
		}
		return false;
	}

	isWeather(weather: string | string[]) {
		const ourWeather = this.effectiveWeather();
		if (!Array.isArray(weather)) {
			return ourWeather === toID(weather);
		}
		return weather.map(toID).includes(ourWeather);
	}

	getWeather() {
		return this.battle.dex.conditions.getByID(this.weather);
	}

	setTerrain(status: string | Effect, attacker: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null) {
		status = this.battle.dex.conditions.get(status);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!attacker && this.battle.event?.defender) attacker = this.battle.event.defender;
		if (attacker === 'debug') attacker = this.battle.sides[0].active[0];
		if (!attacker) throw new Error(`setting terrain without a attacker`);

		if (this.terrain === status.id) return false;
		const prevTerrain = this.terrain;
		const prevTerrainState = this.terrainState;
		this.terrain = status.id;
		this.terrainState = this.battle.initEffectState({
			id: status.id,
			attacker,
			sourceSlot: attacker.getSlot(),
			duration: status.duration,
		});
		if (status.durationCallback) {
			this.terrainState.duration = status.durationCallback.call(this.battle, attacker, attacker, sourceEffect);
		}
		if (!this.battle.singleEvent('FieldStart', status, this.terrainState, this, attacker, sourceEffect)) {
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

	effectiveTerrain(defender?: Pokemon | Side | Battle) {
		if (this.battle.event && !defender) defender = this.battle.event.defender;
		return this.battle.runEvent('TryTerrain', defender) ? this.terrain : '';
	}

	isTerrain(terrain: string | string[], defender?: Pokemon | Side | Battle) {
		const ourTerrain = this.effectiveTerrain(defender);
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
		attacker: Pokemon | 'debug' | null = null,
		sourceEffect: Effect | null = null
	): boolean {
		if (!attacker && this.battle.event?.defender) attacker = this.battle.event.defender;
		if (attacker === 'debug') attacker = this.battle.sides[0].active[0];
		status = this.battle.dex.conditions.get(status);

		let state = this.pseudoWeather[status.id];
		if (state) {
			if (!(status as any).onFieldRestart) return false;
			return this.battle.singleEvent('FieldRestart', status, state, this, attacker, sourceEffect);
		}
		state = this.pseudoWeather[status.id] = this.battle.initEffectState({
			id: status.id,
			attacker,
			sourceSlot: attacker?.getSlot(),
			duration: status.duration,
		});
		if (status.durationCallback) {
			if (!attacker) throw new Error(`setting fieldcond without a attacker`);
			state.duration = status.durationCallback.call(this.battle, attacker, attacker, sourceEffect);
		}
		if (!this.battle.singleEvent('FieldStart', status, state, this, attacker, sourceEffect)) {
			delete this.pseudoWeather[status.id];
			return false;
		}
		this.battle.runEvent('PseudoWeatherChange', attacker, attacker, status);
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
