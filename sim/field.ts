/**
 * Simulator Field
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT
 */
import {Pokemon} from './pokemon';
import {Side} from './side';

export class Field {
	readonly battle: Battle;
	readonly width: number;
	readonly length: number;

	weather: string;
	weatherData: AnyObject;
	terrain: string;
	terrainData: AnyObject;
	pseudoWeather: AnyObject;
	fieldConditions: AnyObject[];
	fieldConditionGrid: AnyObject[][];

	constructor(battle: Battle) {
		this.battle = battle;
		this.width = 2;
		switch (battle.gameType) {
		case 'doubles': case 'multi':
			this.length = 2;
			break;
		case 'triples': case 'rotation':
			this.length = 3;
			break;
		case 'free-for-all':
			this.width = 4;
			// falls through
		default:
			this.length = 1;
			break;
		}

		this.weather = '';
		this.weatherData = {id: ''};
		this.terrain = '';
		this.terrainData = {id: ''};
		this.pseudoWeather = {};
		this.fieldConditions = [];

		this.fieldConditionGrid = [];
		for (let i = 0; i < this.width; i++) {
			this.fieldConditionGrid.push(new Array(this.length).fill({}));
		}
	}

	setWeather(status: string | PureEffect, source: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null) {
		status = this.battle.getEffect(status);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
		if (source === 'debug') source = this.battle.sides[0].active[0];

		if (this.weather === status.id) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				if (this.battle.gen > 5 || this.weatherData.duration === 0) {
					return false;
				}
			} else if (this.battle.gen > 2 || status.id === 'sandstorm') {
				return false;
			}
		}
		if (source) {
			const result = this.battle.runEvent('SetWeather', source, source, status);
			if (!result) {
				if (result === false) {
					if (sourceEffect && sourceEffect.weather) {
						this.battle.add('-fail', source, sourceEffect, '[from] ' + this.weather);
					} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
						this.battle.add('-ability', source, sourceEffect, '[from] ' + this.weather, '[fail]');
					}
				}
				return null;
			}
		}
		const prevWeather = this.weather;
		const prevWeatherData = this.weatherData;
		this.weather = status.id;
		this.weatherData = {id: status.id};
		if (source) {
			this.weatherData.source = source;
			this.weatherData.sourcePosition = source.position;
		}
		if (status.duration) {
			this.weatherData.duration = status.duration;
		}
		if (status.durationCallback) {
			if (!source) throw new Error(`setting weather without a source`);
			this.weatherData.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
		}
		if (!this.battle.singleEvent('Start', status, this.weatherData, this, source, sourceEffect)) {
			this.weather = prevWeather;
			this.weatherData = prevWeatherData;
			return false;
		}
		return true;
	}

	clearWeather() {
		if (!this.weather) return false;
		const prevWeather = this.getWeather();
		this.battle.singleEvent('End', prevWeather, this.weatherData, this);
		this.weather = '';
		this.weatherData = {id: ''};
		return true;
	}

	effectiveWeather() {
		if (this.suppressingWeather()) return '';
		return this.weather;
	}

	suppressingWeather() {
		for (const side of this.battle.sides) {
			for (const pokemon of side.active) {
				if (pokemon && !pokemon.ignoringAbility() && pokemon.getAbility().suppressWeather) {
					return true;
				}
			}
		}
		return false;
	}

	isWeather(weather: string | string[]) {
		const ourWeather = this.effectiveWeather();
		if (!Array.isArray(weather)) {
			return ourWeather === toId(weather);
		}
		return weather.map(toId).includes(ourWeather);
	}

	getWeather() {
		return this.battle.getEffect(this.weather);
	}

	setTerrain(status: string | Effect, source: Pokemon | 'debug' | null = null, sourceEffect: Effect | null = null) {
		status = this.battle.getEffect(status);
		if (!sourceEffect && this.battle.effect) sourceEffect = this.battle.effect;
		if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
		if (source === 'debug') source = this.battle.sides[0].active[0];
		if (!source) throw new Error(`setting terrain without a source`);

		if (this.terrain === status.id) return false;
		const prevTerrain = this.terrain;
		const prevTerrainData = this.terrainData;
		this.terrain = status.id;
		this.terrainData = {
			id: status.id,
			source,
			sourcePosition: source.position,
			duration: status.duration,
		};
		if (status.durationCallback) {
			this.terrainData.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
		}
		if (!this.battle.singleEvent('Start', status, this.terrainData, this, source, sourceEffect)) {
			this.terrain = prevTerrain;
			this.terrainData = prevTerrainData;
			return false;
		}
		this.battle.runEvent('TerrainStart', source, source, status);
		return true;
	}

	clearTerrain() {
		if (!this.terrain) return false;
		const prevTerrain = this.getTerrain();
		this.battle.singleEvent('End', prevTerrain, this.terrainData, this);
		this.terrain = '';
		this.terrainData = {id: ''};
		return true;
	}

	effectiveTerrain(target?: Pokemon | Side | Battle) {
		if (this.battle.event && !target) target = this.battle.event.target;
		return this.battle.runEvent('TryTerrain', target) ? this.terrain : '';
	}

	isTerrain(terrain: string | string[], target?: Pokemon | Side | Battle) {
		const ourTerrain = this.effectiveTerrain(target);
		if (!Array.isArray(terrain)) {
			return ourTerrain === toId(terrain);
		}
		return terrain.map(toId).includes(ourTerrain);
	}

	getTerrain() {
		return this.battle.getEffect(this.terrain);
	}

	getCoordinatesInField(position: Pokemon | Side | Battle): [number, number] {
		let x = 0;
		let y = 0;
		if (position instanceof Side) {
			x = position.n % this.width;
			y = 0;
		} else if (position instanceof Pokemon) {
			x = position.side.n % this.width;
			y = position.position + this.battle.gameType === 'multi' ? x : 0;
		}
		return [x, y];
	}

	addFieldCondition(
		status: string | PureEffect,
		source: Pokemon | 'debug' | null = null,
		sourceEffect: Effect | null = null,
		target: Pokemon | null = null
	): boolean {
		if (!source && this.battle.event && this.battle.event.target) source = this.battle.event.target;
		if (source === 'debug') source = this.battle.sides[0].active[0];
		status = this.battle.getEffect(status);
		const effectData = {
			id: status.id,
			source,
			sourcePosition: source && source.position,
			duration: status.duration,
		};
		if (status.durationCallback) {
			if (!source) throw new Error(`setting fieldcond without a source`);
			effectData.duration = status.durationCallback.call(this.battle, source, source, sourceEffect);
		}

		const moveTarget = sourceEffect && (sourceEffect as Move).target || 'all';
		/** @type {(AnyObject | undefined)[][]} */
		let targets = new Array(this.width);
		if (moveTarget === 'all') {
			targets.fill(new Array(this.length).fill(effectData));
		} else if (target) {
			const [targetx, targety] = this.getCoordinatesInField(target);
			if (moveTarget === 'foeSide') {
				targets[targetx] = new Array(this.length).fill(effectData);
			} else {
				targets[targetx][targety] = effectData;
			}
		} else if (source) {
			const [sourcex, sourcey] = this.getCoordinatesInField(source);
			switch (moveTarget) {
			case 'foeSide':
			// case 'allAdjacentFoes': // Not supported
				targets = targets.map((side, i) => new Array(this.length).fill(i === sourcex ? undefined : effectData));
				break;
			case 'allySide':
			case 'allyTeam':
			// case 'allAdjacent': // Not supported
				targets[sourcex] = new Array(this.length).fill(effectData);
				break;
			case 'self':
				targets[sourcex][sourcey] = effectData;
				break;
			}
		}

		let didSomething = false;
		for (const [x, side] of this.fieldConditionGrid.entries()) {
			if (!this.battle.singleEvent('Start', status, effectData, this, source, sourceEffect)) continue;

			for (const [y, slot] of side.entries()) {
				if (!targets[x][y]) continue;
				if (slot[effectData.id]) {
					// already active for this position
					if (!status.onRestart) continue;
					didSomething = this.battle.singleEvent(
						'Restart', status, slot[effectData.id], this, source, sourceEffect
					) || didSomething;
				} else {
					slot[effectData.id] = targets[x][y];
					didSomething = true;
				}
			}
		}
		return didSomething;
	}

	getFieldCondition(status: string | Effect, position?: Pokemon | Side | Battle) {
		status = this.battle.getEffect(status);
		const [x, y] = position ? this.getCoordinatesInField(position) : [0, 0];
		return this.fieldConditionGrid[x][y][status.id] ? status : null;
	}

	removeFieldCondition(status: string | Effect, position?: Pokemon | Side | Battle) {
		status = this.battle.getEffect(status);
		const [x, y] = position ? this.getCoordinatesInField(position) : [0, 0];
		const effectData = this.fieldConditionGrid[x][y][status.id];
		if (!effectData) return false;
		this.battle.singleEvent('End', status, effectData, this);
		for (const [i, side] of this.fieldConditionGrid.entries()) {
			for (const [j] of side.entries()) {
				if (this.fieldConditionGrid[i][j][status.id] === effectData) delete this.fieldConditionGrid[i][j][status.id];
			}
		}
		return true;
	}

	destroy() {
		// deallocate ourself

		// get rid of some possibly-circular references
		// @ts-ignore - readonly
		this.battle = null!;
	}
}
