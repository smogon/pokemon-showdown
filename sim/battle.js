/**
 * Simulator Battle
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * @license MIT license
 */
'use strict';

const Dex = require('./dex');
const PRNG = require('./prng');
const Sim = require('./');

class Battle extends Dex.ModdedDex {
	/**
	 * @param {object} format
	 * @param {boolean} rated
	 * @param {Function} send
	 * @param {PRNG} [maybePrng]
	 */
	constructor(format, rated = false, send = (() => {}), prng = new PRNG()) {
		super(format.mod);
		Object.assign(this, this.data.Scripts);

		this.log = [];
		/** @type {Sim.Side[]} */
		this.sides = [null, null];
		this.rated = rated;
		this.weatherData = {id:''};
		this.terrainData = {id:''};
		this.pseudoWeather = {};

		this.format = toId(format);
		this.formatData = {id:this.format};

		this.effect = {id:''};
		this.effectData = {id:''};
		this.event = {id:''};

		this.gameType = (format.gameType || 'singles');
		this.reportExactHP = !!format.debug;
		this.replayExactHP = !format.team;

		this.queue = [];
		this.faintQueue = [];
		this.messageLog = [];

		this.send = send;

		this.turn = 0;
		/** @type {Sim.Side} */
		this.p1 = null;
		/** @type {Sim.Side} */
		this.p2 = null;
		this.lastUpdate = 0;
		this.weather = '';
		this.terrain = '';
		this.ended = false;
		this.started = false;
		this.active = false;
		this.eventDepth = 0;
		this.lastMove = '';
		this.activeMove = null;
		this.activePokemon = null;
		this.activeTarget = null;
		this.midTurn = false;
		this.currentRequest = '';
		this.lastMoveLine = 0;
		this.reportPercentages = false;
		this.supportCancel = false;
		this.events = null;

		this.abilityOrder = 0;

		this.prng = prng;
		this.prngSeed = this.prng.startingSeed.slice();
		this.teamGenerator = null;
	}

	static logReplay(data, isReplay) {
		if (isReplay === true) return data;
		return '';
	}

	toString() {
		return 'Battle: ' + this.format;
	}

	random(m, n) {
		return this.prng.next(m, n);
	}
	resetRNG() {
		this.prng = new PRNG(this.prng.startingSeed);
	}

	setWeather(status, source, sourceEffect) {
		status = this.getEffect(status);
		if (sourceEffect === undefined && this.effect) sourceEffect = this.effect;
		if (source === undefined && this.event && this.event.target) source = this.event.target;

		if (this.weather === status.id) {
			if (sourceEffect && sourceEffect.effectType === 'Ability') {
				if (this.gen > 5 || this.weatherData.duration === 0) {
					return false;
				}
			} else if (this.gen > 2 || status.id === 'sandstorm') {
				return false;
			}
		}
		if (status.id) {
			let result = this.runEvent('SetWeather', source, source, status);
			if (!result) {
				if (result === false) {
					if (sourceEffect && sourceEffect.weather) {
						this.add('-fail', source, sourceEffect, '[from]: ' + this.weather);
					} else if (sourceEffect && sourceEffect.effectType === 'Ability') {
						this.add('-ability', source, sourceEffect, '[from] ' + this.weather, '[fail]');
					}
				}
				return null;
			}
		}
		if (this.weather && !status.id) {
			let oldstatus = this.getWeather();
			this.singleEvent('End', oldstatus, this.weatherData, this);
		}
		let prevWeather = this.weather;
		let prevWeatherData = this.weatherData;
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
			this.weatherData.duration = status.durationCallback.call(this, source, sourceEffect);
		}
		if (!this.singleEvent('Start', status, this.weatherData, this, source, sourceEffect)) {
			this.weather = prevWeather;
			this.weatherData = prevWeatherData;
			return false;
		}
		return true;
	}
	clearWeather() {
		return this.setWeather('');
	}
	effectiveWeather(target) {
		if (this.event) {
			if (!target) target = this.event.target;
		}
		if (this.suppressingWeather()) return '';
		return this.weather;
	}
	isWeather(weather, target) {
		let ourWeather = this.effectiveWeather(target);
		if (!Array.isArray(weather)) {
			return ourWeather === toId(weather);
		}
		return weather.map(toId).includes(ourWeather);
	}
	getWeather() {
		return this.getEffect(this.weather);
	}

	setTerrain(status, source, sourceEffect) {
		status = this.getEffect(status);
		if (sourceEffect === undefined && this.effect) sourceEffect = this.effect;
		if (source === undefined && this.event && this.event.target) source = this.event.target;

		if (this.terrain === status.id) return false;
		if (this.terrain && !status.id) {
			let oldstatus = this.getTerrain();
			this.singleEvent('End', oldstatus, this.terrainData, this);
		}
		let prevTerrain = this.terrain;
		let prevTerrainData = this.terrainData;
		this.terrain = status.id;
		this.terrainData = {id: status.id};
		if (source) {
			this.terrainData.source = source;
			this.terrainData.sourcePosition = source.position;
		}
		if (status.duration) {
			this.terrainData.duration = status.duration;
		}
		if (status.durationCallback) {
			this.terrainData.duration = status.durationCallback.call(this, source, sourceEffect);
		}
		if (!this.singleEvent('Start', status, this.terrainData, this, source, sourceEffect)) {
			this.terrain = prevTerrain;
			this.terrainData = prevTerrainData;
			return false;
		}
		return true;
	}
	clearTerrain() {
		return this.setTerrain('');
	}
	effectiveTerrain(target) {
		if (this.event) {
			if (!target) target = this.event.target;
		}
		if (!this.runEvent('TryTerrain', target)) return '';
		return this.terrain;
	}
	isTerrain(terrain, target) {
		let ourTerrain = this.effectiveTerrain(target);
		if (!Array.isArray(terrain)) {
			return ourTerrain === toId(terrain);
		}
		return terrain.map(toId).includes(ourTerrain);
	}
	getTerrain() {
		return this.getEffect(this.terrain);
	}

	getFormat(format) {
		return super.getFormat(format || this.format);
	}
	addPseudoWeather(status, source, sourceEffect) {
		status = this.getEffect(status);
		if (this.pseudoWeather[status.id]) {
			if (!status.onRestart) return false;
			return this.singleEvent('Restart', status, this.pseudoWeather[status.id], this, source, sourceEffect);
		}
		this.pseudoWeather[status.id] = {id: status.id};
		if (source) {
			this.pseudoWeather[status.id].source = source;
			this.pseudoWeather[status.id].sourcePosition = source.position;
		}
		if (status.duration) {
			this.pseudoWeather[status.id].duration = status.duration;
		}
		if (status.durationCallback) {
			this.pseudoWeather[status.id].duration = status.durationCallback.call(this, source, sourceEffect);
		}
		if (!this.singleEvent('Start', status, this.pseudoWeather[status.id], this, source, sourceEffect)) {
			delete this.pseudoWeather[status.id];
			return false;
		}
		return true;
	}
	getPseudoWeather(status) {
		status = this.getEffect(status);
		if (!this.pseudoWeather[status.id]) return null;
		return status;
	}
	removePseudoWeather(status) {
		status = this.getEffect(status);
		if (!this.pseudoWeather[status.id]) return false;
		this.singleEvent('End', status, this.pseudoWeather[status.id], this);
		delete this.pseudoWeather[status.id];
		return true;
	}
	suppressingAttackEvents() {
		return this.activePokemon && this.activePokemon.isActive && this.activeMove && this.activeMove.ignoreAbility;
	}
	suppressingWeather() {
		let pokemon;
		for (let i = 0; i < this.sides.length; i++) {
			for (let j = 0; j < this.sides[i].active.length; j++) {
				pokemon = this.sides[i].active[j];
				if (pokemon && !pokemon.ignoringAbility() && pokemon.getAbility().suppressWeather) {
					return true;
				}
			}
		}
		return false;
	}
	setActiveMove(move, pokemon, target) {
		if (!move) move = null;
		if (!pokemon) pokemon = null;
		if (!target) target = pokemon;
		this.activeMove = move;
		this.activePokemon = pokemon;
		this.activeTarget = target;
	}
	clearActiveMove(failed) {
		if (this.activeMove) {
			if (!failed) {
				this.lastMove = this.activeMove.id;
			}
			this.activeMove = null;
			this.activePokemon = null;
			this.activeTarget = null;
		}
	}

	updateSpeed() {
		let actives = this.p1.active;
		for (let i = 0; i < actives.length; i++) {
			if (actives[i]) actives[i].updateSpeed();
		}
		actives = this.p2.active;
		for (let i = 0; i < actives.length; i++) {
			if (actives[i]) actives[i].updateSpeed();
		}
	}

	static comparePriority(a, b) {
		a.priority = a.priority || 0;
		a.subPriority = a.subPriority || 0;
		a.speed = a.speed || 0;
		b.priority = b.priority || 0;
		b.subPriority = b.subPriority || 0;
		b.speed = b.speed || 0;
		if ((typeof a.order === 'number' || typeof b.order === 'number') && a.order !== b.order) {
			if (typeof a.order !== 'number') {
				return -1;
			}
			if (typeof b.order !== 'number') {
				return 1;
			}
			if (b.order - a.order) {
				return -(b.order - a.order);
			}
		}
		if (b.priority - a.priority) {
			return b.priority - a.priority;
		}
		if (b.speed - a.speed) {
			return b.speed - a.speed;
		}
		if (b.subOrder - a.subOrder) {
			return -(b.subOrder - a.subOrder);
		}
		return Math.random() - 0.5;
	}
	static compareRedirectOrder(a, b) {
		a.priority = a.priority || 0;
		a.speed = a.speed || 0;
		b.priority = b.priority || 0;
		b.speed = b.speed || 0;
		if (b.priority - a.priority) {
			return b.priority - a.priority;
		}
		if (b.speed - a.speed) {
			return b.speed - a.speed;
		}
		if (b.thing.abilityOrder - a.thing.abilityOrder) {
			return -(b.thing.abilityOrder - a.thing.abilityOrder);
		}
		return 0;
	}
	getResidualStatuses(thing, callbackType) {
		let statuses = this.getRelevantEffectsInner(thing || this, callbackType || 'residualCallback', null, null, false, true, 'duration');
		statuses.sort(Battle.comparePriority);
		//if (statuses[0]) this.debug('match ' + (callbackType || 'residualCallback') + ': ' + statuses[0].status.id);
		return statuses;
	}
	eachEvent(eventid, effect, relayVar) {
		let actives = [];
		if (!effect && this.effect) effect = this.effect;
		for (let i = 0; i < this.sides.length; i++) {
			let side = this.sides[i];
			for (let j = 0; j < side.active.length; j++) {
				if (side.active[j]) actives.push(side.active[j]);
			}
		}
		actives.sort((a, b) => {
			if (b.speed - a.speed) {
				return b.speed - a.speed;
			}
			return Math.random() - 0.5;
		});
		for (let i = 0; i < actives.length; i++) {
			this.runEvent(eventid, actives[i], null, effect, relayVar);
		}
	}
	residualEvent(eventid, relayVar) {
		let statuses = this.getRelevantEffectsInner(this, 'on' + eventid, null, null, false, true, 'duration');
		statuses.sort(Battle.comparePriority);
		while (statuses.length) {
			let statusObj = statuses.shift();
			let status = statusObj.status;
			if (statusObj.thing.fainted) continue;
			if (statusObj.statusData && statusObj.statusData.duration) {
				statusObj.statusData.duration--;
				if (!statusObj.statusData.duration) {
					statusObj.end.call(statusObj.thing, status.id);
					continue;
				}
			}
			this.singleEvent(eventid, status, statusObj.statusData, statusObj.thing, relayVar);
		}
	}
	// The entire event system revolves around this function
	// (and its helper functions, getRelevant * )
	singleEvent(eventid, effect, effectData, target, source, sourceEffect, relayVar) {
		if (this.eventDepth >= 8) {
			// oh fuck
			this.add('message', 'STACK LIMIT EXCEEDED');
			this.add('message', 'PLEASE REPORT IN BUG THREAD');
			this.add('message', 'Event: ' + eventid);
			this.add('message', 'Parent event: ' + this.event.id);
			throw new Error("Stack overflow");
		}
		//this.add('Event: ' + eventid + ' (depth ' + this.eventDepth + ')');
		effect = this.getEffect(effect);
		let hasRelayVar = true;
		if (relayVar === undefined) {
			relayVar = true;
			hasRelayVar = false;
		}

		if (effect.effectType === 'Status' && target.status !== effect.id) {
			// it's changed; call it off
			return relayVar;
		}
		if (eventid !== 'Start' && eventid !== 'TakeItem' && eventid !== 'Primal' && effect.effectType === 'Item' && (target instanceof Sim.Pokemon) && target.ignoringItem()) {
			this.debug(eventid + ' handler suppressed by Embargo, Klutz or Magic Room');
			return relayVar;
		}
		if (eventid !== 'End' && effect.effectType === 'Ability' && (target instanceof Sim.Pokemon) && target.ignoringAbility()) {
			this.debug(eventid + ' handler suppressed by Gastro Acid');
			return relayVar;
		}
		if (effect.effectType === 'Weather' && eventid !== 'Start' && eventid !== 'Residual' && eventid !== 'End' && this.suppressingWeather()) {
			this.debug(eventid + ' handler suppressed by Air Lock');
			return relayVar;
		}

		if (effect['on' + eventid] === undefined) return relayVar;
		let parentEffect = this.effect;
		let parentEffectData = this.effectData;
		let parentEvent = this.event;
		this.effect = effect;
		this.effectData = effectData;
		this.event = {id: eventid, target: target, source: source, effect: sourceEffect};
		this.eventDepth++;
		let args = [target, source, sourceEffect];
		if (hasRelayVar) args.unshift(relayVar);
		let returnVal;
		if (typeof effect['on' + eventid] === 'function') {
			returnVal = effect['on' + eventid].apply(this, args);
		} else {
			returnVal = effect['on' + eventid];
		}
		this.eventDepth--;
		this.effect = parentEffect;
		this.effectData = parentEffectData;
		this.event = parentEvent;
		if (returnVal === undefined) return relayVar;
		return returnVal;
	}
	/**
	 * runEvent is the core of Pokemon Showdown's event system.
	 *
	 * Basic usage
	 * ===========
	 *
	 *   this.runEvent('Blah')
	 * will trigger any onBlah global event handlers.
	 *
	 *   this.runEvent('Blah', target)
	 * will additionally trigger any onBlah handlers on the target, onAllyBlah
	 * handlers on any active pokemon on the target's team, and onFoeBlah
	 * handlers on any active pokemon on the target's foe's team
	 *
	 *   this.runEvent('Blah', target, source)
	 * will additionally trigger any onSourceBlah handlers on the source
	 *
	 *   this.runEvent('Blah', target, source, effect)
	 * will additionally pass the effect onto all event handlers triggered
	 *
	 *   this.runEvent('Blah', target, source, effect, relayVar)
	 * will additionally pass the relayVar as the first argument along all event
	 * handlers
	 *
	 * You may leave any of these null. For instance, if you have a relayVar but
	 * no source or effect:
	 *   this.runEvent('Damage', target, null, null, 50)
	 *
	 * Event handlers
	 * ==============
	 *
	 * Items, abilities, statuses, and other effects like SR, confusion, weather,
	 * or Trick Room can have event handlers. Event handlers are functions that
	 * can modify what happens during an event.
	 *
	 * event handlers are passed:
	 *   function (target, source, effect)
	 * although some of these can be blank.
	 *
	 * certain events have a relay variable, in which case they're passed:
	 *   function (relayVar, target, source, effect)
	 *
	 * Relay variables are variables that give additional information about the
	 * event. For instance, the damage event has a relayVar which is the amount
	 * of damage dealt.
	 *
	 * If a relay variable isn't passed to runEvent, there will still be a secret
	 * relayVar defaulting to `true`, but it won't get passed to any event
	 * handlers.
	 *
	 * After an event handler is run, its return value helps determine what
	 * happens next:
	 * 1. If the return value isn't `undefined`, relayVar is set to the return
	 *	value
	 * 2. If relayVar is falsy, no more event handlers are run
	 * 3. Otherwise, if there are more event handlers, the next one is run and
	 *	we go back to step 1.
	 * 4. Once all event handlers are run (or one of them results in a falsy
	 *	relayVar), relayVar is returned by runEvent
	 *
	 * As a shortcut, an event handler that isn't a function will be interpreted
	 * as a function that returns that value.
	 *
	 * You can have return values mean whatever you like, but in general, we
	 * follow the convention that returning `false` or `null` means
	 * stopping or interrupting the event.
	 *
	 * For instance, returning `false` from a TrySetStatus handler means that
	 * the pokemon doesn't get statused.
	 *
	 * If a failed event usually results in a message like "But it failed!"
	 * or "It had no effect!", returning `null` will suppress that message and
	 * returning `false` will display it. Returning `null` is useful if your
	 * event handler already gave its own custom failure message.
	 *
	 * Returning `undefined` means "don't change anything" or "keep going".
	 * A function that does nothing but return `undefined` is the equivalent
	 * of not having an event handler at all.
	 *
	 * Returning a value means that that value is the new `relayVar`. For
	 * instance, if a Damage event handler returns 50, the damage event
	 * will deal 50 damage instead of whatever it was going to deal before.
	 *
	 * Useful values
	 * =============
	 *
	 * In addition to all the methods and attributes of Dex, Battle, and
	 * Scripts, event handlers have some additional values they can access:
	 *
	 * this.effect:
	 *   the Effect having the event handler
	 * this.effectData:
	 *   the data store associated with the above Effect. This is a plain Object
	 *   and you can use it to store data for later event handlers.
	 * this.effectData.target:
	 *   the Pokemon, Side, or Battle that the event handler's effect was
	 *   attached to.
	 * this.event.id:
	 *   the event ID
	 * this.event.target, this.event.source, this.event.effect:
	 *   the target, source, and effect of the event. These are the same
	 *   variables that are passed as arguments to the event handler, but
	 *   they're useful for functions called by the event handler.
	 */
	runEvent(eventid, target, source, effect, relayVar, onEffect, fastExit) {
		// if (Battle.eventCounter) {
		// 	if (!Battle.eventCounter[eventid]) Battle.eventCounter[eventid] = 0;
		// 	Battle.eventCounter[eventid]++;
		// }
		if (this.eventDepth >= 8) {
			// oh fuck
			this.add('message', 'STACK LIMIT EXCEEDED');
			this.add('message', 'PLEASE REPORT IN BUG THREAD');
			this.add('message', 'Event: ' + eventid);
			this.add('message', 'Parent event: ' + this.event.id);
			throw new Error("Stack overflow");
		}
		if (!target) target = this;
		let statuses = this.getRelevantEffects(target, 'on' + eventid, 'onSource' + eventid, source);
		if (fastExit) {
			statuses.sort(Battle.compareRedirectOrder);
		} else {
			statuses.sort(Battle.comparePriority);
		}
		let hasRelayVar = true;
		effect = this.getEffect(effect);
		let args = [target, source, effect];
		//console.log('Event: ' + eventid + ' (depth ' + this.eventDepth + ') t:' + target.id + ' s:' + (!source || source.id) + ' e:' + effect.id);
		if (relayVar === undefined || relayVar === null) {
			relayVar = true;
			hasRelayVar = false;
		} else {
			args.unshift(relayVar);
		}

		let parentEvent = this.event;
		this.event = {id: eventid, target: target, source: source, effect: effect, modifier: 1};
		this.eventDepth++;

		if (onEffect && 'on' + eventid in effect) {
			statuses.unshift({status: effect, callback: effect['on' + eventid], statusData: {}, end: null, thing: target});
		}
		for (let i = 0; i < statuses.length; i++) {
			let status = statuses[i].status;
			let thing = statuses[i].thing;
			//this.debug('match ' + eventid + ': ' + status.id + ' ' + status.effectType);
			if (status.effectType === 'Status' && thing.status !== status.id) {
				// it's changed; call it off
				continue;
			}
			if (status.effectType === 'Ability' && !status.isUnbreakable && this.suppressingAttackEvents() && this.activePokemon !== thing) {
				// ignore attacking events
				let AttackingEvents = {
					BeforeMove: 1,
					BasePower: 1,
					Immunity: 1,
					RedirectTarget: 1,
					Heal: 1,
					SetStatus: 1,
					CriticalHit: 1,
					ModifyAtk: 1, ModifyDef: 1, ModifySpA: 1, ModifySpD: 1, ModifySpe: 1, ModifyAccuracy: 1,
					ModifyBoost: 1,
					ModifyDamage: 1,
					ModifySecondaries: 1,
					ModifyWeight: 1,
					TryAddVolatile: 1,
					TryHit: 1,
					TryHitSide: 1,
					TryMove: 1,
					Boost: 1,
					DragOut: 1,
					Effectiveness: 1,
				};
				if (eventid in AttackingEvents) {
					this.debug(eventid + ' handler suppressed by Mold Breaker');
					continue;
				} else if (eventid === 'Damage' && effect && effect.effectType === 'Move') {
					this.debug(eventid + ' handler suppressed by Mold Breaker');
					continue;
				}
			}
			if (eventid !== 'Start' && eventid !== 'SwitchIn' && eventid !== 'TakeItem' && status.effectType === 'Item' && (thing instanceof Sim.Pokemon) && thing.ignoringItem()) {
				if (eventid !== 'Update') {
					this.debug(eventid + ' handler suppressed by Embargo, Klutz or Magic Room');
				}
				continue;
			} else if (eventid !== 'End' && status.effectType === 'Ability' && (thing instanceof Sim.Pokemon) && thing.ignoringAbility()) {
				if (eventid !== 'Update') {
					this.debug(eventid + ' handler suppressed by Gastro Acid');
				}
				continue;
			}
			if ((status.effectType === 'Weather' || eventid === 'Weather') && eventid !== 'Residual' && eventid !== 'End' && this.suppressingWeather()) {
				this.debug(eventid + ' handler suppressed by Air Lock');
				continue;
			}
			let returnVal;
			if (typeof statuses[i].callback === 'function') {
				let parentEffect = this.effect;
				let parentEffectData = this.effectData;
				this.effect = statuses[i].status;
				this.effectData = statuses[i].statusData;
				this.effectData.target = thing;

				returnVal = statuses[i].callback.apply(this, args);

				this.effect = parentEffect;
				this.effectData = parentEffectData;
			} else {
				returnVal = statuses[i].callback;
			}

			if (returnVal !== undefined) {
				relayVar = returnVal;
				if (!relayVar || fastExit) break;
				if (hasRelayVar) {
					args[0] = relayVar;
				}
			}
		}

		this.eventDepth--;
		if (this.event.modifier !== 1 && typeof relayVar === 'number') {
			// this.debug(eventid + ' modifier: 0x' + ('0000' + (this.event.modifier * 4096).toString(16)).slice(-4).toUpperCase());
			relayVar = this.modify(relayVar, this.event.modifier);
		}
		this.event = parentEvent;

		return relayVar;
	}
	/**
	 * priorityEvent works just like runEvent, except it exits and returns
	 * on the first non-undefined value instead of only on null/false.
	 */
	priorityEvent(eventid, target, source, effect, relayVar, onEffect) {
		return this.runEvent(eventid, target, source, effect, relayVar, onEffect, true);
	}
	resolveLastPriority(statuses, callbackType) {
		let order = false;
		let priority = 0;
		let subOrder = 0;
		let status = statuses[statuses.length - 1];
		if (status.status[callbackType + 'Order']) {
			order = status.status[callbackType + 'Order'];
		}
		if (status.status[callbackType + 'Priority']) {
			priority = status.status[callbackType + 'Priority'];
		} else if (status.status[callbackType + 'SubOrder']) {
			subOrder = status.status[callbackType + 'SubOrder'];
		}

		status.order = order;
		status.priority = priority;
		status.subOrder = subOrder;
		if (status.thing && status.thing.getStat) status.speed = status.thing.speed;
	}
	// bubbles up to parents
	getRelevantEffects(thing, callbackType, foeCallbackType, foeThing) {
		let statuses = this.getRelevantEffectsInner(thing, callbackType, foeCallbackType, foeThing, true, false);
		//if (statuses[0]) this.debug('match ' + callbackType + ': ' + statuses[0].status.id);
		return statuses;
	}
	getRelevantEffectsInner(thing, callbackType, foeCallbackType, foeThing, bubbleUp, bubbleDown, getAll) {
		if (!callbackType || !thing) return [];
		let statuses = [];
		let status;

		if (thing.sides) {
			for (let i in this.pseudoWeather) {
				status = this.getPseudoWeather(i);
				if (status[callbackType] !== undefined || (getAll && thing.pseudoWeather[i][getAll])) {
					statuses.push({status: status, callback: status[callbackType], statusData: this.pseudoWeather[i], end: this.removePseudoWeather, thing: thing});
					this.resolveLastPriority(statuses, callbackType);
				}
			}
			status = this.getWeather();
			if (status[callbackType] !== undefined || (getAll && thing.weatherData[getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: this.weatherData, end: this.clearWeather, thing: thing, priority: status[callbackType + 'Priority'] || 0});
				this.resolveLastPriority(statuses, callbackType);
			}
			status = this.getTerrain();
			if (status[callbackType] !== undefined || (getAll && thing.terrainData[getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: this.terrainData, end: this.clearTerrain, thing: thing, priority: status[callbackType + 'Priority'] || 0});
				this.resolveLastPriority(statuses, callbackType);
			}
			status = this.getFormat();
			if (status[callbackType] !== undefined || (getAll && thing.formatData[getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: this.formatData, end: function () {}, thing: thing, priority: status[callbackType + 'Priority'] || 0});
				this.resolveLastPriority(statuses, callbackType);
			}
			if (this.events && this.events[callbackType] !== undefined) {
				for (let i = 0; i < this.events[callbackType].length; i++) {
					let handler = this.events[callbackType][i];
					let statusData;
					switch (handler.target.effectType) {
					case 'Format':
						statusData = this.formatData;
					}
					statuses.push({status: handler.target, callback: handler.callback, statusData: statusData, end: function () {}, thing: thing, priority: handler.priority, order: handler.order, subOrder: handler.subOrder});
				}
			}
			if (bubbleDown) {
				statuses = statuses.concat(this.getRelevantEffectsInner(this.p1, callbackType, null, null, false, true, getAll));
				statuses = statuses.concat(this.getRelevantEffectsInner(this.p2, callbackType, null, null, false, true, getAll));
			}
			return statuses;
		}

		if (thing.pokemon) {
			for (let i in thing.sideConditions) {
				status = thing.getSideCondition(i);
				if (status[callbackType] !== undefined || (getAll && thing.sideConditions[i][getAll])) {
					statuses.push({status: status, callback: status[callbackType], statusData: thing.sideConditions[i], end: thing.removeSideCondition, thing: thing});
					this.resolveLastPriority(statuses, callbackType);
				}
			}
			if (foeCallbackType) {
				statuses = statuses.concat(this.getRelevantEffectsInner(thing.foe, foeCallbackType, null, null, false, false, getAll));
				if (foeCallbackType.substr(0, 5) === 'onFoe') {
					let eventName = foeCallbackType.substr(5);
					statuses = statuses.concat(this.getRelevantEffectsInner(thing.foe, 'onAny' + eventName, null, null, false, false, getAll));
					statuses = statuses.concat(this.getRelevantEffectsInner(thing, 'onAny' + eventName, null, null, false, false, getAll));
				}
			}
			if (bubbleUp) {
				statuses = statuses.concat(this.getRelevantEffectsInner(this, callbackType, null, null, true, false, getAll));
			}
			if (bubbleDown) {
				for (let i = 0; i < thing.active.length; i++) {
					statuses = statuses.concat(this.getRelevantEffectsInner(thing.active[i], callbackType, null, null, false, true, getAll));
				}
			}
			return statuses;
		}

		if (!thing.getStatus) {
			//this.debug(JSON.stringify(thing));
			return statuses;
		}
		status = thing.getStatus();
		if (status[callbackType] !== undefined || (getAll && thing.statusData[getAll])) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.statusData, end: thing.clearStatus, thing: thing});
			this.resolveLastPriority(statuses, callbackType);
		}
		for (let i in thing.volatiles) {
			status = thing.getVolatile(i);
			if (status[callbackType] !== undefined || (getAll && thing.volatiles[i][getAll])) {
				statuses.push({status: status, callback: status[callbackType], statusData: thing.volatiles[i], end: thing.removeVolatile, thing: thing});
				this.resolveLastPriority(statuses, callbackType);
			}
		}
		status = thing.getAbility();
		if (status[callbackType] !== undefined || (getAll && thing.abilityData[getAll])) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.abilityData, end: thing.clearAbility, thing: thing});
			this.resolveLastPriority(statuses, callbackType);
		}
		status = thing.getItem();
		if (status[callbackType] !== undefined || (getAll && thing.itemData[getAll])) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.itemData, end: thing.clearItem, thing: thing});
			this.resolveLastPriority(statuses, callbackType);
		}
		status = this.getEffect(thing.template.baseSpecies);
		if (status[callbackType] !== undefined) {
			statuses.push({status: status, callback: status[callbackType], statusData: thing.speciesData, end: function () {}, thing: thing});
			this.resolveLastPriority(statuses, callbackType);
		}

		if (foeThing && foeCallbackType && foeCallbackType.substr(0, 8) !== 'onSource') {
			statuses = statuses.concat(this.getRelevantEffectsInner(foeThing, foeCallbackType, null, null, false, false, getAll));
		} else if (foeCallbackType) {
			let foeActive = thing.side.foe.active;
			let allyActive = thing.side.active;
			let eventName = '';
			if (foeCallbackType.substr(0, 8) === 'onSource') {
				eventName = foeCallbackType.substr(8);
				if (foeThing) {
					statuses = statuses.concat(this.getRelevantEffectsInner(foeThing, foeCallbackType, null, null, false, false, getAll));
				}
				foeCallbackType = 'onFoe' + eventName;
				foeThing = null;
			}
			if (foeCallbackType.substr(0, 5) === 'onFoe') {
				eventName = foeCallbackType.substr(5);
				for (let i = 0; i < allyActive.length; i++) {
					if (!allyActive[i] || allyActive[i].fainted) continue;
					statuses = statuses.concat(this.getRelevantEffectsInner(allyActive[i], 'onAlly' + eventName, null, null, false, false, getAll));
					statuses = statuses.concat(this.getRelevantEffectsInner(allyActive[i], 'onAny' + eventName, null, null, false, false, getAll));
				}
				for (let i = 0; i < foeActive.length; i++) {
					if (!foeActive[i] || foeActive[i].fainted) continue;
					statuses = statuses.concat(this.getRelevantEffectsInner(foeActive[i], 'onAny' + eventName, null, null, false, false, getAll));
				}
			}
			for (let i = 0; i < foeActive.length; i++) {
				if (!foeActive[i] || foeActive[i].fainted) continue;
				statuses = statuses.concat(this.getRelevantEffectsInner(foeActive[i], foeCallbackType, null, null, false, false, getAll));
			}
		}
		if (bubbleUp) {
			statuses = statuses.concat(this.getRelevantEffectsInner(thing.side, callbackType, foeCallbackType, null, true, false, getAll));
		}
		return statuses;
	}
	/**
	 * Use this function to attach custom event handlers to a battle. See Battle#runEvent for
	 * more information on how to write callbacks for event handlers.
	 *
	 * Try to use this sparingly. Most event handlers can be simply placed in a format instead.
	 *
	 *     this.onEvent(eventid, target, callback)
	 * will set the callback as an event handler for the target when eventid is called with the
	 * default priority. Currently only valid formats are supported as targets but this will
	 * eventually be expanded to support other target types.
	 *
	 *     this.onEvent(eventid, target, priority, callback)
	 * will set the callback as an event handler for the target when eventid is called with the
	 * provided priority. Priority can either be a number or an object that contains the priority,
	 * order, and subOrder for the evend handler as needed (undefined keys will use default values)
	 */
	onEvent(eventid, target, ...rest) { // rest = [priority, callback]
		if (!eventid) throw new TypeError("Event handlers must have an event to listen to");
		if (!target) throw new TypeError("Event handlers must have a target");
		if (!rest.length) throw new TypeError("Event handlers must have a callback");

		if (target.effectType !== 'Format') {
			throw new TypeError(`${target.name} is a ${target.effectType} but only Format targets are supported right now`);
		}

		let callback, priority, order, subOrder, data;
		if (rest.length === 1) {
			[callback] = rest;
			priority = 0;
			order = false;
			subOrder = 0;
		} else {
			[data, callback] = rest;
			if (typeof data === 'object') {
				priority = data['priority'] || 0;
				order = data['order'] || false;
				subOrder = data['subOrder'] || 0;
			} else {
				priority = data || 0;
				order = false;
				subOrder = 0;
			}
		}

		let eventHandler = {callback, target, priority, order, subOrder};

		let callbackType = `on${eventid}`;
		if (!this.events) this.events = {};
		if (this.events[callbackType] === undefined) {
			this.events[callbackType] = [eventHandler];
		} else {
			this.events[callbackType].push(eventHandler);
		}
	}
	getPokemon(id) {
		if (typeof id !== 'string') id = id.id;
		for (let i = 0; i < this.p1.pokemon.length; i++) {
			let pokemon = this.p1.pokemon[i];
			if (pokemon.id === id) return pokemon;
		}
		for (let i = 0; i < this.p2.pokemon.length; i++) {
			let pokemon = this.p2.pokemon[i];
			if (pokemon.id === id) return pokemon;
		}
		return null;
	}
	makeRequest(type) {
		if (type) {
			this.currentRequest = type;
			this.p1.clearChoice();
			this.p2.clearChoice();
		} else {
			type = this.currentRequest;
		}

		// default to no request
		/** @type {any} */
		let p1request = null;
		/** @type {any} */
		let p2request = null;
		this.p1.currentRequest = '';
		this.p2.currentRequest = '';
		let switchTable = [];

		switch (type) {
		case 'switch': {
			for (let i = 0, l = this.p1.active.length; i < l; i++) {
				let active = this.p1.active[i];
				switchTable.push(!!(active && active.switchFlag));
			}
			if (switchTable.some(flag => flag === true)) {
				this.p1.currentRequest = 'switch';
				p1request = {forceSwitch: switchTable, side: this.p1.getData()};
			}
			switchTable = [];
			for (let i = 0, l = this.p2.active.length; i < l; i++) {
				let active = this.p2.active[i];
				switchTable.push(!!(active && active.switchFlag));
			}
			if (switchTable.some(flag => flag === true)) {
				this.p2.currentRequest = 'switch';
				p2request = {forceSwitch: switchTable, side: this.p2.getData()};
			}
			break;
		}

		case 'teampreview':
			let maxTeamSize = 6;
			let teamLengthData = this.getFormat().teamLength;
			if (teamLengthData && teamLengthData.battle) maxTeamSize = teamLengthData.battle;
			this.p1.maxTeamSize = maxTeamSize;
			this.p2.maxTeamSize = maxTeamSize;
			this.add('teampreview' + (maxTeamSize !== 6 ? '|' + maxTeamSize : ''));
			this.p1.currentRequest = 'teampreview';
			p1request = {teamPreview: true, maxTeamSize: maxTeamSize, side: this.p1.getData()};
			this.p2.currentRequest = 'teampreview';
			p2request = {teamPreview: true, maxTeamSize: maxTeamSize, side: this.p2.getData()};
			break;

		default: {
			this.p1.currentRequest = 'move';
			let activeData = this.p1.active.map(pokemon => pokemon && pokemon.getRequestData());
			p1request = {active: activeData, side: this.p1.getData()};

			this.p2.currentRequest = 'move';
			activeData = this.p2.active.map(pokemon => pokemon && pokemon.getRequestData());
			p2request = {active: activeData, side: this.p2.getData()};
			break;
		}
		}

		if (p1request) {
			if (!this.supportCancel || !p2request) p1request.noCancel = true;
			this.p1.emitRequest(p1request);
		} else {
			this.p1.emitRequest({wait: true, side: this.p1.getData()});
		}

		if (p2request) {
			if (!this.supportCancel || !p1request) p2request.noCancel = true;
			this.p2.emitRequest(p2request);
		} else {
			this.p2.emitRequest({wait: true, side: this.p2.getData()});
		}

		if (this.p1.isChoiceDone() && this.p2.isChoiceDone()) {
			throw new Error(`Choices are done immediately after a request`);
		}
	}
	tie() {
		this.win();
	}
	win(side) {
		if (this.ended) {
			return false;
		}
		if (side === 'p1' || side === 'p2') {
			side = this[side];
		} else if (side !== this.p1 && side !== this.p2) {
			side = null;
		}
		this.winner = side ? side.name : '';

		this.add('');
		if (side) {
			this.add('win', side.name);
		} else {
			this.add('tie');
		}
		this.ended = true;
		this.active = false;
		this.currentRequest = '';
		for (let side of this.sides) {
			side.currentRequest = '';
		}
		return true;
	}
	switchIn(pokemon, pos) {
		if (!pokemon || pokemon.isActive) return false;
		if (!pos) pos = 0;
		let side = pokemon.side;
		if (pos >= side.active.length) {
			throw new Error("Invalid switch position");
		}
		if (side.active[pos]) {
			let oldActive = side.active[pos];
			if (this.cancelMove(oldActive)) {
				for (let i = 0; i < side.foe.active.length; i++) {
					if (side.foe.active[i].isStale >= 2) {
						oldActive.isStaleCon++;
						oldActive.isStaleSource = 'drag';
						break;
					}
				}
			}
			if (oldActive.switchCopyFlag === 'copyvolatile') {
				delete oldActive.switchCopyFlag;
				pokemon.copyVolatileFrom(oldActive);
			}
		}
		pokemon.isActive = true;
		this.runEvent('BeforeSwitchIn', pokemon);
		if (side.active[pos]) {
			let oldActive = side.active[pos];
			oldActive.isActive = false;
			oldActive.isStarted = false;
			oldActive.usedItemThisTurn = false;
			oldActive.position = pokemon.position;
			pokemon.position = pos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
			this.cancelMove(oldActive);
			oldActive.clearVolatile();
		}
		side.active[pos] = pokemon;
		pokemon.activeTurns = 0;
		for (let m in pokemon.moveset) {
			pokemon.moveset[m].used = false;
		}
		this.add('switch', pokemon, pokemon.getDetails);
		this.insertQueue({pokemon: pokemon, choice: 'runUnnerve'});
		this.insertQueue({pokemon: pokemon, choice: 'runSwitch'});
	}
	canSwitch(side) {
		let canSwitchIn = [];
		for (let i = side.active.length; i < side.pokemon.length; i++) {
			let pokemon = side.pokemon[i];
			if (!pokemon.fainted) {
				canSwitchIn.push(pokemon);
			}
		}
		return canSwitchIn.length;
	}
	getRandomSwitchable(side) {
		let canSwitchIn = [];
		for (let i = side.active.length; i < side.pokemon.length; i++) {
			let pokemon = side.pokemon[i];
			if (!pokemon.fainted) {
				canSwitchIn.push(pokemon);
			}
		}
		if (!canSwitchIn.length) {
			return null;
		}
		return canSwitchIn[this.random(canSwitchIn.length)];
	}
	dragIn(side, pos) {
		if (pos >= side.active.length) return false;
		let pokemon = this.getRandomSwitchable(side);
		if (!pos) pos = 0;
		if (!pokemon || pokemon.isActive) return false;
		this.runEvent('BeforeSwitchIn', pokemon);
		if (side.active[pos]) {
			let oldActive = side.active[pos];
			if (!oldActive.hp) {
				return false;
			}
			if (!this.runEvent('DragOut', oldActive)) {
				return false;
			}
			this.runEvent('SwitchOut', oldActive);
			oldActive.illusion = null;
			this.singleEvent('End', this.getAbility(oldActive.ability), oldActive.abilityData, oldActive);
			oldActive.isActive = false;
			oldActive.isStarted = false;
			oldActive.usedItemThisTurn = false;
			oldActive.position = pokemon.position;
			pokemon.position = pos;
			side.pokemon[pokemon.position] = pokemon;
			side.pokemon[oldActive.position] = oldActive;
			if (this.cancelMove(oldActive)) {
				for (let i = 0; i < side.foe.active.length; i++) {
					if (side.foe.active[i].isStale >= 2) {
						oldActive.isStaleCon++;
						oldActive.isStaleSource = 'drag';
						break;
					}
				}
			}
			oldActive.clearVolatile();
		}
		side.active[pos] = pokemon;
		pokemon.isActive = true;
		pokemon.activeTurns = 0;
		if (this.gen === 2) pokemon.draggedIn = this.turn;
		for (let m in pokemon.moveset) {
			pokemon.moveset[m].used = false;
		}
		this.add('drag', pokemon, pokemon.getDetails);
		if (this.gen >= 5) {
			this.singleEvent('PreStart', pokemon.getAbility(), pokemon.abilityData, pokemon);
			this.runEvent('SwitchIn', pokemon);
			if (!pokemon.hp) return true;
			pokemon.isStarted = true;
			if (!pokemon.fainted) {
				this.singleEvent('Start', pokemon.getAbility(), pokemon.abilityData, pokemon);
				this.singleEvent('Start', pokemon.getItem(), pokemon.itemData, pokemon);
			}
		} else {
			this.insertQueue({pokemon: pokemon, choice: 'runSwitch'});
		}
		return true;
	}
	swapPosition(pokemon, slot, attributes) {
		if (slot >= pokemon.side.active.length) {
			throw new Error("Invalid swap position");
		}
		let target = pokemon.side.active[slot];
		if (slot !== 1 && (!target || target.fainted)) return false;

		this.add('swap', pokemon, slot, attributes || '');

		let side = pokemon.side;
		side.pokemon[pokemon.position] = target;
		side.pokemon[slot] = pokemon;
		side.active[pokemon.position] = side.pokemon[pokemon.position];
		side.active[slot] = side.pokemon[slot];
		if (target) target.position = pokemon.position;
		pokemon.position = slot;
		return true;
	}
	faint(pokemon, source, effect) {
		pokemon.faint(source, effect);
	}
	nextTurn() {
		this.turn++;
		let allStale = true;
		/** @type {Sim.Pokemon} */
		let oneStale;
		for (let i = 0; i < this.sides.length; i++) {
			for (let j = 0; j < this.sides[i].active.length; j++) {
				let pokemon = this.sides[i].active[j];
				if (!pokemon) continue;
				pokemon.moveThisTurn = '';
				pokemon.usedItemThisTurn = false;
				pokemon.newlySwitched = false;

				pokemon.maybeDisabled = false;
				for (let entry of pokemon.moveset) {
					entry.disabled = false;
					entry.disabledSource = '';
				}
				this.runEvent('DisableMove', pokemon);
				if (!pokemon.ateBerry) pokemon.disableMove('belch');

				if (pokemon.lastAttackedBy) {
					if (pokemon.lastAttackedBy.pokemon.isActive) {
						pokemon.lastAttackedBy.thisTurn = false;
					} else {
						pokemon.lastAttackedBy = null;
					}
				}

				pokemon.trapped = pokemon.maybeTrapped = false;
				this.runEvent('TrapPokemon', pokemon);
				if (!pokemon.knownType || this.getImmunity('trapped', pokemon)) {
					this.runEvent('MaybeTrapPokemon', pokemon);
				}
				// Disable the faculty to cancel switches if a foe may have a trapping ability
				let foeSide = pokemon.side.foe;
				for (let k = 0; k < foeSide.active.length; ++k) {
					let source = foeSide.active[k];
					if (!source || source.fainted) continue;
					let template = (source.illusion || source).template;
					if (!template.abilities) continue;
					for (let abilitySlot in template.abilities) {
						let abilityName = template.abilities[abilitySlot];
						if (abilityName === source.ability) {
							// pokemon event was already run above so we don't need
							// to run it again.
							continue;
						}
						const ruleTable = this.getRuleTable(this.getFormat());
						if (!ruleTable.has('-illegal') && !this.getFormat().team) {
							// hackmons format
							continue;
						} else if (abilitySlot === 'H' && template.unreleasedHidden) {
							// unreleased hidden ability
							continue;
						}
						let ability = this.getAbility(abilityName);
						if (ruleTable.has('-' + ability.id)) continue;
						if (pokemon.knownType && !this.getImmunity('trapped', pokemon)) continue;
						this.singleEvent('FoeMaybeTrapPokemon',
							ability, {}, pokemon, source);
					}
				}

				if (pokemon.fainted) continue;
				if (pokemon.isStale < 2) {
					if (pokemon.isStaleCon >= 2) {
						if (pokemon.hp >= pokemon.isStaleHP - pokemon.maxhp / 100) {
							pokemon.isStale++;
							if (this.firstStaleWarned && pokemon.isStale < 2) {
								switch (pokemon.isStaleSource) {
								case 'struggle':
									this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(pokemon.name) + ' isn\'t losing HP from Struggle. If this continues, it will be classified as being in an endless loop.</div>');
									break;
								case 'drag':
									this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(pokemon.name) + ' isn\'t losing PP or HP from being forced to switch. If this continues, it will be classified as being in an endless loop.</div>');
									break;
								case 'switch':
									this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(pokemon.name) + ' isn\'t losing PP or HP from repeatedly switching. If this continues, it will be classified as being in an endless loop.</div>');
									break;
								}
							}
						}
						pokemon.isStaleCon = 0;
						pokemon.isStalePPTurns = 0;
						pokemon.isStaleHP = pokemon.hp;
					}
					if (pokemon.isStalePPTurns >= 5) {
						if (pokemon.hp >= pokemon.isStaleHP - pokemon.maxhp / 100) {
							pokemon.isStale++;
							pokemon.isStaleSource = 'ppstall';
							if (this.firstStaleWarned && pokemon.isStale < 2) {
								this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(pokemon.name) + ' isn\'t losing PP or HP. If it keeps on not losing PP or HP, it will be classified as being in an endless loop.</div>');
							}
						}
						pokemon.isStaleCon = 0;
						pokemon.isStalePPTurns = 0;
						pokemon.isStaleHP = pokemon.hp;
					}
				}
				if (pokemon.getMoves().length === 0) {
					pokemon.isStaleCon++;
					pokemon.isStaleSource = 'struggle';
				}
				if (pokemon.isStale < 2) {
					allStale = false;
				} else if (pokemon.isStale && !pokemon.staleWarned) {
					oneStale = pokemon;
				}
				if (!pokemon.isStalePPTurns) {
					pokemon.isStaleHP = pokemon.hp;
					if (pokemon.activeTurns) pokemon.isStaleCon = 0;
				}
				if (pokemon.activeTurns) {
					pokemon.isStalePPTurns++;
				}
				pokemon.activeTurns++;
			}
			this.sides[i].faintedLastTurn = this.sides[i].faintedThisTurn;
			this.sides[i].faintedThisTurn = false;
		}
		const ruleTable = this.getRuleTable(this.getFormat());
		if (ruleTable.has('endlessbattleclause')) {
			if (oneStale) {
				let activationWarning = '<br />If all active Pok&eacute;mon go in an endless loop, Endless Battle Clause will activate.';
				if (allStale) activationWarning = '';
				let loopReason = '';
				switch (oneStale.isStaleSource) {
				case 'struggle':
					loopReason = ": it isn't losing HP from Struggle";
					break;
				case 'drag':
					loopReason = ": it isn't losing PP or HP from being forced to switch";
					break;
				case 'switch':
					loopReason = ": it isn't losing PP or HP from repeatedly switching";
					break;
				case 'getleppa':
					loopReason = ": it got a Leppa Berry it didn't start with";
					break;
				case 'useleppa':
					loopReason = ": it used a Leppa Berry it didn't start with";
					break;
				case 'ppstall':
					loopReason = ": it isn't losing PP or HP";
					break;
				case 'ppoverflow':
					loopReason = ": its PP overflowed";
					break;
				}
				this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(oneStale.name) + ' is in an endless loop' + loopReason + '.' + activationWarning + '</div>');
				oneStale.staleWarned = true;
				this.firstStaleWarned = true;
			}
			if (allStale) {
				this.add('message', "All active Pok\u00e9mon are in an endless loop. Endless Battle Clause activated!");
				let leppaPokemon = null;
				for (let i = 0; i < this.sides.length; i++) {
					for (let j = 0; j < this.sides[i].pokemon.length; j++) {
						let pokemon = this.sides[i].pokemon[j];
						if (toId(pokemon.set.item) === 'leppaberry') {
							if (leppaPokemon) {
								leppaPokemon = null; // both sides have Leppa
								this.add('-message', "Both sides started with a Leppa Berry.");
							} else {
								leppaPokemon = pokemon;
							}
							break;
						}
					}
				}
				if (leppaPokemon) {
					this.add('-message', "" + leppaPokemon.side.name + "'s " + leppaPokemon.name + " started with a Leppa Berry and loses.");
					this.win(leppaPokemon.side.foe);
					return;
				}
				this.win();
				return;
			}
		} else {
			if (allStale && !this.staleWarned) {
				this.staleWarned = true;
				this.add('html', '<div class="broadcast-red">If this format had Endless Battle Clause, it would have activated.</div>');
			} else if (oneStale) {
				this.add('html', '<div class="broadcast-red">' + Chat.escapeHTML(oneStale.name) + ' is in an endless loop.</div>');
				oneStale.staleWarned = true;
			}
		}

		if (this.gameType === 'triples' && !this.sides.filter(side => side.pokemonLeft > 1).length) {
			// If both sides have one Pokemon left in triples and they are not adjacent, they are both moved to the center.
			let actives = [];
			for (let i = 0; i < this.sides.length; i++) {
				for (let j = 0; j < this.sides[i].active.length; j++) {
					if (!this.sides[i].active[j] || this.sides[i].active[j].fainted) continue;
					actives.push(this.sides[i].active[j]);
				}
			}
			if (actives.length > 1 && !this.isAdjacent(actives[0], actives[1])) {
				this.swapPosition(actives[0], 1, '[silent]');
				this.swapPosition(actives[1], 1, '[silent]');
				this.add('-center');
			}
		}

		this.add('turn', this.turn);

		this.makeRequest('move');
	}
	start() {
		if (this.active) return;

		if (!this.p1 || !this.p2) {
			// need two players to start
			return;
		}

		if (this.started) {
			return;
		}
		this.activeTurns = 0;
		this.started = true;
		this.p2.foe = this.p1;
		this.p1.foe = this.p2;

		this.add('gametype', this.gameType);
		this.add('gen', this.gen);

		let format = this.getFormat();

		this.add('tier', format.name);
		if (this.rated) {
			this.add('rated');
		}
		this.add('seed', side => Battle.logReplay(this.prngSeed.join(','), side));

		if (format.onBegin) {
			format.onBegin.call(this);
		}
		this.getRuleTable(this.getFormat()).forEach((v, rule) => {
			if (rule.startsWith('+') || rule.startsWith('-') || rule.startsWith('!')) return;
			if (this.getFormat(rule).exists) this.addPseudoWeather(rule);
		});

		if (!this.p1.pokemon[0] || !this.p2.pokemon[0]) {
			throw new Error('Battle not started: A player has an empty team.');
		}

		this.residualEvent('TeamPreview');

		this.addQueue({choice: 'start'});
		this.midTurn = true;
		if (!this.currentRequest) this.go();
	}
	boost(boost, target, source, effect, isSecondary, isSelf) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		if (!target.isActive) return false;
		if (this.gen > 5 && !target.side.foe.pokemonLeft) return false;
		effect = this.getEffect(effect);
		boost = this.runEvent('Boost', target, source, effect, Object.assign({}, boost));
		let success = null;
		let boosted = false;
		for (let i in boost) {
			let currentBoost = {};
			currentBoost[i] = boost[i];
			let boostBy = target.boostBy(currentBoost);
			let msg = '-boost';
			if (boost[i] < 0) {
				msg = '-unboost';
				boostBy = -boostBy;
			}
			if (boostBy) {
				success = true;
				switch (effect.id) {
				case 'bellydrum':
					this.add('-setboost', target, 'atk', target.boosts['atk'], '[from] move: Belly Drum');
					break;
				case 'bellydrum2':
					this.add(msg, target, i, boostBy, '[silent]');
					this.add('-hint', "In Gen 2, Belly Drum boosts by 2 when it fails.");
					break;
				case 'intimidate': case 'gooey': case 'tanglinghair':
					this.add(msg, target, i, boostBy);
					break;
				case 'zpower':
					this.add(msg, target, i, boostBy, '[zeffect]');
					break;
				default:
					if (effect.effectType === 'Move') {
						this.add(msg, target, i, boostBy);
					} else {
						if (effect.effectType === 'Ability' && !boosted) {
							this.add('-ability', target, effect.name, 'boost');
							boosted = true;
						}
						this.add(msg, target, i, boostBy);
					}
					break;
				}
				this.runEvent('AfterEachBoost', target, source, effect, currentBoost);
			} else if (effect.effectType === 'Ability') {
				if (isSecondary) this.add(msg, target, i, boostBy);
			} else if (!isSecondary && !isSelf) {
				this.add(msg, target, i, boostBy);
			}
		}
		this.runEvent('AfterBoost', target, source, effect, boost);
		return success;
	}
	damage(damage, target, source, effect, instafaint) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		if (!target.isActive) return false;
		effect = this.getEffect(effect);
		if (!(damage || damage === 0)) return damage;
		if (damage !== 0) damage = this.clampIntRange(damage, 1);

		if (effect.id !== 'struggle-recoil') { // Struggle recoil is not affected by effects
			if (effect.effectType === 'Weather' && !target.runStatusImmunity(effect.id)) {
				this.debug('weather immunity');
				return 0;
			}
			damage = this.runEvent('Damage', target, source, effect, damage);
			if (!(damage || damage === 0)) {
				this.debug('damage event failed');
				return damage;
			}
		}
		if (damage !== 0) damage = this.clampIntRange(damage, 1);
		damage = target.damage(damage, source, effect);
		if (source) source.lastDamage = damage;
		let name = effect.fullname;
		if (name === 'tox') name = 'psn';
		switch (effect.id) {
		case 'partiallytrapped':
			this.add('-damage', target, target.getHealth, '[from] ' + this.effectData.sourceEffect.fullname, '[partiallytrapped]');
			break;
		case 'powder':
			this.add('-damage', target, target.getHealth, '[silent]');
			break;
		case 'confused':
			this.add('-damage', target, target.getHealth, '[from] confusion');
			break;
		default:
			if (effect.effectType === 'Move' || !name) {
				this.add('-damage', target, target.getHealth);
			} else if (source && (source !== target || effect.effectType === 'Ability')) {
				this.add('-damage', target, target.getHealth, '[from] ' + name, '[of] ' + source);
			} else {
				this.add('-damage', target, target.getHealth, '[from] ' + name);
			}
			break;
		}

		if (effect.drain && source) {
			this.heal(Math.ceil(damage * effect.drain[0] / effect.drain[1]), source, target, 'drain');
		}

		if (!effect.flags) effect.flags = {};

		if (instafaint && !target.hp) {
			this.debug('instafaint: ' + this.faintQueue.map(entry => entry.target).map(pokemon => pokemon.name));
			this.faintMessages(true);
		} else {
			damage = this.runEvent('AfterDamage', target, source, effect, damage);
		}

		return damage;
	}
	directDamage(damage, target, source, effect) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		if (!target || !target.hp) return 0;
		if (!damage) return 0;
		damage = this.clampIntRange(damage, 1);

		damage = target.damage(damage, source, effect);
		switch (effect.id) {
		case 'strugglerecoil':
			this.add('-damage', target, target.getHealth, '[from] recoil');
			break;
		case 'confusion':
			this.add('-damage', target, target.getHealth, '[from] confusion');
			break;
		default:
			this.add('-damage', target, target.getHealth);
			break;
		}
		if (target.fainted) this.faint(target);
		return damage;
	}
	heal(damage, target, source, effect) {
		if (this.event) {
			if (!target) target = this.event.target;
			if (!source) source = this.event.source;
			if (!effect) effect = this.effect;
		}
		effect = this.getEffect(effect);
		if (damage && damage <= 1) damage = 1;
		damage = Math.floor(damage);
		// for things like Liquid Ooze, the Heal event still happens when nothing is healed.
		damage = this.runEvent('TryHeal', target, source, effect, damage);
		if (!damage) return 0;
		if (!target || !target.hp) return 0;
		if (!target.isActive) return false;
		if (target.hp >= target.maxhp) return 0;
		damage = target.heal(damage, source, effect);
		switch (effect.id) {
		case 'leechseed':
		case 'rest':
			this.add('-heal', target, target.getHealth, '[silent]');
			break;
		case 'drain':
			this.add('-heal', target, target.getHealth, '[from] drain', '[of] ' + source);
			break;
		case 'wish':
			break;
		case 'zpower':
			this.add('-heal', target, target.getHealth, '[zeffect]');
			break;
		default:
			if (effect.effectType === 'Move') {
				this.add('-heal', target, target.getHealth);
			} else if (source && source !== target) {
				this.add('-heal', target, target.getHealth, '[from] ' + effect.fullname, '[of] ' + source);
			} else {
				this.add('-heal', target, target.getHealth, '[from] ' + effect.fullname);
			}
			break;
		}
		this.runEvent('Heal', target, source, effect, damage);
		return damage;
	}
	chain(previousMod, nextMod) {
		// previousMod or nextMod can be either a number or an array [numerator, denominator]
		if (previousMod.length) {
			previousMod = Math.floor(previousMod[0] * 4096 / previousMod[1]);
		} else {
			previousMod = Math.floor(previousMod * 4096);
		}

		if (nextMod.length) {
			nextMod = Math.floor(nextMod[0] * 4096 / nextMod[1]);
		} else {
			nextMod = Math.floor(nextMod * 4096);
		}
		return ((previousMod * nextMod + 2048) >> 12) / 4096; // M'' = ((M * M') + 0x800) >> 12
	}
	chainModify(numerator, denominator) {
		let previousMod = Math.floor(this.event.modifier * 4096);

		if (numerator.length) {
			denominator = numerator[1];
			numerator = numerator[0];
		}
		let nextMod = 0;
		if (this.event.ceilModifier) {
			nextMod = Math.ceil(numerator * 4096 / (denominator || 1));
		} else {
			nextMod = Math.floor(numerator * 4096 / (denominator || 1));
		}

		this.event.modifier = ((previousMod * nextMod + 2048) >> 12) / 4096;
	}
	modify(value, numerator, denominator) {
		// You can also use:
		// modify(value, [numerator, denominator])
		// modify(value, fraction) - assuming you trust JavaScript's floating-point handler
		if (!denominator) denominator = 1;
		if (numerator && numerator.length) {
			denominator = numerator[1];
			numerator = numerator[0];
		}
		let modifier = Math.floor(numerator * 4096 / denominator);
		return Math.floor((value * modifier + 2048 - 1) / 4096);
	}
	getCategory(move) {
		move = this.getMove(move);
		return move.category || 'Physical';
	}
	getDamage(pokemon, target, move, suppressMessages) {
		if (typeof move === 'string') move = this.getMove(move);

		if (typeof move === 'number') {
			move = {
				basePower: move,
				type: '???',
				category: 'Physical',
				willCrit: false,
				flags: {},
			};
		}

		if (!move.ignoreImmunity || (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type])) {
			if (!target.runImmunity(move.type, !suppressMessages)) {
				return false;
			}
		}

		if (move.ohko) {
			return target.maxhp;
		}

		if (move.damageCallback) {
			return move.damageCallback.call(this, pokemon, target);
		}
		if (move.damage === 'level') {
			return pokemon.level;
		}
		if (move.damage) {
			return move.damage;
		}

		if (!move) {
			move = {};
		}

		let category = this.getCategory(move);
		let defensiveCategory = move.defensiveCategory || category;

		let basePower = move.basePower;
		if (move.basePowerCallback) {
			basePower = move.basePowerCallback.call(this, pokemon, target, move);
		}
		if (!basePower) {
			if (basePower === 0) return; // returning undefined means not dealing damage
			return basePower;
		}
		basePower = this.clampIntRange(basePower, 1);

		let critMult;
		let critRatio = this.runEvent('ModifyCritRatio', pokemon, target, move, move.critRatio || 0);
		if (this.gen <= 5) {
			critRatio = this.clampIntRange(critRatio, 0, 5);
			critMult = [0, 16, 8, 4, 3, 2];
		} else {
			critRatio = this.clampIntRange(critRatio, 0, 4);
			critMult = [0, 16, 8, 2, 1];
		}

		move.crit = move.willCrit || false;
		if (move.willCrit === undefined) {
			if (critRatio) {
				move.crit = (this.random(critMult[critRatio]) === 0);
			}
		}

		if (move.crit) {
			move.crit = this.runEvent('CriticalHit', target, null, move);
		}

		// happens after crit calculation
		basePower = this.runEvent('BasePower', pokemon, target, move, basePower, true);

		if (!basePower) return 0;
		basePower = this.clampIntRange(basePower, 1);

		let level = pokemon.level;

		let attacker = pokemon;
		let defender = target;
		let attackStat = category === 'Physical' ? 'atk' : 'spa';
		let defenseStat = defensiveCategory === 'Physical' ? 'def' : 'spd';
		let statTable = {atk:'Atk', def:'Def', spa:'SpA', spd:'SpD', spe:'Spe'};
		let attack;
		let defense;

		let atkBoosts = move.useTargetOffensive ? defender.boosts[attackStat] : attacker.boosts[attackStat];
		let defBoosts = move.useSourceDefensive ? attacker.boosts[defenseStat] : defender.boosts[defenseStat];

		let ignoreNegativeOffensive = !!move.ignoreNegativeOffensive;
		let ignorePositiveDefensive = !!move.ignorePositiveDefensive;

		if (move.crit) {
			ignoreNegativeOffensive = true;
			ignorePositiveDefensive = true;
		}
		let ignoreOffensive = !!(move.ignoreOffensive || (ignoreNegativeOffensive && atkBoosts < 0));
		let ignoreDefensive = !!(move.ignoreDefensive || (ignorePositiveDefensive && defBoosts > 0));

		if (ignoreOffensive) {
			this.debug('Negating (sp)atk boost/penalty.');
			atkBoosts = 0;
		}
		if (ignoreDefensive) {
			this.debug('Negating (sp)def boost/penalty.');
			defBoosts = 0;
		}

		if (move.useTargetOffensive) {
			attack = defender.calculateStat(attackStat, atkBoosts);
		} else {
			attack = attacker.calculateStat(attackStat, atkBoosts);
		}

		if (move.useSourceDefensive) {
			defense = attacker.calculateStat(defenseStat, defBoosts);
		} else {
			defense = defender.calculateStat(defenseStat, defBoosts);
		}

		// Apply Stat Modifiers
		attack = this.runEvent('Modify' + statTable[attackStat], attacker, defender, move, attack);
		defense = this.runEvent('Modify' + statTable[defenseStat], defender, attacker, move, defense);

		//int(int(int(2 * L / 5 + 2) * A * P / D) / 50);
		let baseDamage = Math.floor(Math.floor(Math.floor(2 * level / 5 + 2) * basePower * attack / defense) / 50);

		// Calculate damage modifiers separately (order differs between generations)
		return this.modifyDamage(baseDamage, pokemon, target, move, suppressMessages);
	}
	modifyDamage(baseDamage, pokemon, target, move, suppressMessages) {
		if (!move.type) move.type = '???';
		let type = move.type;

		baseDamage += 2;

		// multi-target modifier (doubles only)
		if (move.spreadHit) {
			let spreadModifier = move.spreadModifier || 0.75;
			this.debug('Spread modifier: ' + spreadModifier);
			baseDamage = this.modify(baseDamage, spreadModifier);
		}

		// weather modifier
		baseDamage = this.runEvent('WeatherModifyDamage', pokemon, target, move, baseDamage);

		// crit
		if (move.crit) {
			baseDamage = this.modify(baseDamage, move.critModifier || (this.gen >= 6 ? 1.5 : 2));
		}

		// this is not a modifier
		baseDamage = this.randomizer(baseDamage);

		// STAB
		if (move.hasSTAB || type !== '???' && pokemon.hasType(type)) {
			// The "???" type never gets STAB
			// Not even if you Roost in Gen 4 and somehow manage to use
			// Struggle in the same turn.
			// (On second thought, it might be easier to get a Missingno.)
			baseDamage = this.modify(baseDamage, move.stab || 1.5);
		}
		// types
		move.typeMod = target.runEffectiveness(move);

		move.typeMod = this.clampIntRange(move.typeMod, -6, 6);
		if (move.typeMod > 0) {
			if (!suppressMessages) this.add('-supereffective', target);

			for (let i = 0; i < move.typeMod; i++) {
				baseDamage *= 2;
			}
		}
		if (move.typeMod < 0) {
			if (!suppressMessages) this.add('-resisted', target);

			for (let i = 0; i > move.typeMod; i--) {
				baseDamage = Math.floor(baseDamage / 2);
			}
		}

		if (move.crit && !suppressMessages) this.add('-crit', target);

		if (pokemon.status === 'brn' && move.category === 'Physical' && !pokemon.hasAbility('guts')) {
			if (this.gen < 6 || move.id !== 'facade') {
				baseDamage = this.modify(baseDamage, 0.5);
			}
		}

		// Generation 5 sets damage to 1 before the final damage modifiers only
		if (this.gen === 5 && !Math.floor(baseDamage)) {
			baseDamage = 1;
		}

		// Final modifier. Modifiers that modify damage after min damage check, such as Life Orb.
		baseDamage = this.runEvent('ModifyDamage', pokemon, target, move, baseDamage);

		// TODO: Find out where this actually goes in the damage calculation
		if (move.isZ && move.zBrokeProtect) {
			baseDamage = this.modify(baseDamage, 0.25);
			this.add('-message', target.name + " couldn't fully protect itself and got hurt! (placeholder)");
		}

		if (this.gen !== 5 && !Math.floor(baseDamage)) {
			return 1;
		}

		return Math.floor(baseDamage);
	}
	randomizer(baseDamage) {
		return Math.floor(baseDamage * (100 - this.random(16)) / 100);
	}
	/**
	 * Returns whether a proposed target for a move is valid.
	 */
	validTargetLoc(targetLoc, source, targetType) {
		if (targetLoc === 0) return true;
		let numSlots = source.side.active.length;
		if (!Math.abs(targetLoc) && Math.abs(targetLoc) > numSlots) return false;

		let sourceLoc = -(source.position + 1);
		let isFoe = (targetLoc > 0);
		let isAdjacent = (isFoe ? Math.abs(-(numSlots + 1 - targetLoc) - sourceLoc) <= 1 : Math.abs(targetLoc - sourceLoc) === 1);
		let isSelf = (sourceLoc === targetLoc);

		switch (targetType) {
		case 'randomNormal':
		case 'normal':
			return isAdjacent;
		case 'adjacentAlly':
			return isAdjacent && !isFoe;
		case 'adjacentAllyOrSelf':
			return isAdjacent && !isFoe || isSelf;
		case 'adjacentFoe':
			return isAdjacent && isFoe;
		case 'any':
			return !isSelf;
		}
		return false;
	}
	getTargetLoc(target, source) {
		if (target.side === source.side) {
			return -(target.position + 1);
		} else {
			return target.position + 1;
		}
	}
	validTarget(target, source, targetType) {
		return this.validTargetLoc(this.getTargetLoc(target, source), source, targetType);
	}
	getTarget(pokemon, move, targetLoc) {
		move = this.getMove(move);
		let target;
		if ((move.target !== 'randomNormal') &&
				this.validTargetLoc(targetLoc, pokemon, move.target)) {
			if (targetLoc > 0) {
				target = pokemon.side.foe.active[targetLoc - 1];
			} else {
				target = pokemon.side.active[-targetLoc - 1];
			}
			if (target) {
				if (!target.fainted) {
					// target exists and is not fainted
					return target;
				} else if (target.side === pokemon.side) {
					// fainted allied targets don't retarget
					return false;
				}
			}
			// chosen target not valid, retarget randomly with resolveTarget
		}
		return this.resolveTarget(pokemon, move);
	}
	resolveTarget(pokemon, move) {
		// A move was used without a chosen target

		// For instance: Metronome chooses Ice Beam. Since the user didn't
		// choose a target when choosing Metronome, Ice Beam's target must
		// be chosen randomly.

		// The target is chosen randomly from possible targets, EXCEPT that
		// moves that can target either allies or foes will only target foes
		// when used without an explicit target.

		move = this.getMove(move);
		if (move.target === 'adjacentAlly') {
			let allyActives = pokemon.side.active;
			let adjacentAllies = [allyActives[pokemon.position - 1], allyActives[pokemon.position + 1]];
			adjacentAllies = adjacentAllies.filter(active => active && !active.fainted);
			if (adjacentAllies.length) return adjacentAllies[Math.floor(Math.random() * adjacentAllies.length)];
			return pokemon;
		}
		if (move.target === 'self' || move.target === 'all' || move.target === 'allySide' || move.target === 'allyTeam' || move.target === 'adjacentAllyOrSelf') {
			return pokemon;
		}
		if (pokemon.side.active.length > 2) {
			if (move.target === 'adjacentFoe' || move.target === 'normal' || move.target === 'randomNormal') {
				let foeActives = pokemon.side.foe.active;
				let frontPosition = foeActives.length - 1 - pokemon.position;
				let adjacentFoes = foeActives.slice(frontPosition < 1 ? 0 : frontPosition - 1, frontPosition + 2);
				adjacentFoes = adjacentFoes.filter(active => active && !active.fainted);
				if (adjacentFoes.length) return adjacentFoes[Math.floor(Math.random() * adjacentFoes.length)];
				// no valid target at all, return a foe for any possible redirection
			}
		}
		return pokemon.side.foe.randomActive() || pokemon.side.foe.active[0];
	}
	checkFainted() {
		for (let i = 0; i < this.p1.active.length; i++) {
			let pokemon = this.p1.active[i];
			if (pokemon.fainted) {
				pokemon.status = 'fnt';
				pokemon.switchFlag = true;
			}
		}
		for (let i = 0; i < this.p2.active.length; i++) {
			let pokemon = this.p2.active[i];
			if (pokemon.fainted) {
				pokemon.status = 'fnt';
				pokemon.switchFlag = true;
			}
		}
	}
	faintMessages(lastFirst) {
		if (this.ended) return;
		if (!this.faintQueue.length) return false;
		if (lastFirst) {
			this.faintQueue.unshift(this.faintQueue.pop());
		}
		let faintData;
		while (this.faintQueue.length) {
			faintData = this.faintQueue.shift();
			if (!faintData.target.fainted) {
				this.runEvent('BeforeFaint', faintData.target, faintData.source, faintData.effect);
				this.add('faint', faintData.target);
				faintData.target.side.pokemonLeft--;
				this.runEvent('Faint', faintData.target, faintData.source, faintData.effect);
				this.singleEvent('End', this.getAbility(faintData.target.ability), faintData.target.abilityData, faintData.target);
				faintData.target.fainted = true;
				faintData.target.isActive = false;
				faintData.target.isStarted = false;
				faintData.target.side.faintedThisTurn = true;
			}
		}

		if (this.gen <= 1) {
			// in gen 1, fainting skips the rest of the turn, including residuals
			this.queue = [];
		} else if (this.gen <= 3 && this.gameType === 'singles') {
			// in gen 3 or earlier, fainting in singles skips to residuals
			for (let i = 0; i < this.p1.active.length; i++) {
				this.cancelMove(this.p1.active[i]);
				// Stop Pursuit from running
				this.p1.active[i].moveThisTurn = true;
			}
			for (let i = 0; i < this.p2.active.length; i++) {
				this.cancelMove(this.p2.active[i]);
				// Stop Pursuit from running
				this.p2.active[i].moveThisTurn = true;
			}
		}

		if (!this.p1.pokemonLeft && !this.p2.pokemonLeft) {
			this.win(faintData && faintData.target.side);
			return true;
		}
		if (!this.p1.pokemonLeft) {
			this.win(this.p2);
			return true;
		}
		if (!this.p2.pokemonLeft) {
			this.win(this.p1);
			return true;
		}
		return false;
	}
	resolvePriority(decision, midTurn) {
		if (!decision) return;

		if (!decision.side && decision.pokemon) decision.side = decision.pokemon.side;
		if (!decision.choice && decision.move) decision.choice = 'move';
		if (!decision.priority && decision.priority !== 0) {
			let priorities = {
				'beforeTurn': 100,
				'beforeTurnMove': 99,
				'switch': 7,
				'runUnnerve': 7.3,
				'runSwitch': 7.2,
				'runPrimal': 7.1,
				'instaswitch': 101,
				'megaEvo': 6.9,
				'residual': -100,
				'team': 102,
				'start': 101,
			};
			if (decision.choice in priorities) {
				decision.priority = priorities[decision.choice];
			}
		}
		if (!midTurn) {
			if (decision.choice === 'move') {
				if (!decision.zmove && this.getMove(decision.move).beforeTurnCallback) {
					this.addQueue({choice: 'beforeTurnMove', pokemon: decision.pokemon, move: decision.move, targetLoc: decision.targetLoc});
				}
				if (decision.mega) {
					// TODO: Check that the Pokémon is not affected by Sky Drop.
					// (This is currently being done in `runMegaEvo`).
					this.addQueue({
						choice: 'megaEvo',
						pokemon: decision.pokemon,
					});
				}
			} else if (decision.choice === 'switch' || decision.choice === 'instaswitch') {
				if (decision.pokemon.switchFlag && decision.pokemon.switchFlag !== true) {
					decision.pokemon.switchCopyFlag = decision.pokemon.switchFlag;
				}
				decision.pokemon.switchFlag = false;
				if (!decision.speed && decision.pokemon && decision.pokemon.isActive) decision.speed = decision.pokemon.getDecisionSpeed();
			}
		}

		let deferPriority = this.gen >= 7 && decision.mega && !decision.pokemon.template.isMega;
		if (decision.move) {
			let target;

			if (!decision.targetLoc) {
				target = this.resolveTarget(decision.pokemon, decision.move);
				decision.targetLoc = this.getTargetLoc(target, decision.pokemon);
			}

			decision.move = this.getMoveCopy(decision.move);
			if (!decision.priority && !deferPriority) {
				let move = decision.move;
				if (decision.zmove) {
					let zMoveName = this.getZMove(decision.move, decision.pokemon, true);
					let zMove = this.getMove(zMoveName);
					if (zMove.exists) {
						move = zMove;
					}
				}
				let priority = this.runEvent('ModifyPriority', decision.pokemon, target, move, move.priority);
				decision.priority = priority;
				// In Gen 6, Quick Guard blocks moves with artificially enhanced priority.
				if (this.gen > 5) decision.move.priority = priority;
			}
		}
		if (!decision.pokemon && !decision.speed) decision.speed = 1;
		if (!decision.speed && (decision.choice === 'switch' || decision.choice === 'instaswitch') && decision.target) decision.speed = decision.target.getDecisionSpeed();
		if (!decision.speed && !deferPriority) decision.speed = decision.pokemon.getDecisionSpeed();
	}
	addQueue(action) {
		if (Array.isArray(action)) {
			for (let i = 0; i < action.length; i++) {
				this.addQueue(action[i]);
			}
			return;
		}

		if (action.choice === 'pass') return;
		this.resolvePriority(action);
		this.queue.push(action);
	}
	sortQueue() {
		this.queue.sort(Battle.comparePriority);
	}
	insertQueue(decision, midTurn) {
		if (Array.isArray(decision)) {
			for (let i = 0; i < decision.length; i++) {
				this.insertQueue(decision[i]);
			}
			return;
		}

		if (decision.pokemon) decision.pokemon.updateSpeed();
		this.resolvePriority(decision, midTurn);
		for (let i = 0; i < this.queue.length; i++) {
			if (Battle.comparePriority(decision, this.queue[i]) < 0) {
				this.queue.splice(i, 0, decision);
				return;
			}
		}
		this.queue.push(decision);
	}
	prioritizeQueue(decision, source, sourceEffect) {
		if (this.event) {
			if (!source) source = this.event.source;
			if (!sourceEffect) sourceEffect = this.effect;
		}
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i] === decision) {
				this.queue.splice(i, 1);
				break;
			}
		}
		decision.sourceEffect = sourceEffect;
		this.queue.unshift(decision);
	}
	willAct() {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' || this.queue[i].choice === 'switch' || this.queue[i].choice === 'instaswitch' || this.queue[i].choice === 'shift') {
				return this.queue[i];
			}
		}
		return null;
	}
	willMove(pokemon) {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' && this.queue[i].pokemon === pokemon) {
				return this.queue[i];
			}
		}
		return null;
	}
	cancelDecision(pokemon) {
		let success = false;
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].pokemon === pokemon) {
				this.queue.splice(i, 1);
				i--;
				success = true;
			}
		}
		return success;
	}
	cancelMove(pokemon) {
		for (let i = 0; i < this.queue.length; i++) {
			if (this.queue[i].choice === 'move' && this.queue[i].pokemon === pokemon) {
				this.queue.splice(i, 1);
				return true;
			}
		}
		return false;
	}
	willSwitch(pokemon) {
		for (let i = 0; i < this.queue.length; i++) {
			if ((this.queue[i].choice === 'switch' || this.queue[i].choice === 'instaswitch') && this.queue[i].pokemon === pokemon) {
				return this.queue[i];
			}
		}
		return false;
	}
	runDecision(decision) {
		// returns whether or not we ended in a callback
		switch (decision.choice) {
		case 'start': {
			// I GIVE UP, WILL WRESTLE WITH EVENT SYSTEM LATER
			let format = this.getFormat();

			// Remove Pokémon duplicates remaining after `team` decisions.
			this.p1.pokemon = this.p1.pokemon.slice(0, this.p1.pokemonLeft);
			this.p2.pokemon = this.p2.pokemon.slice(0, this.p2.pokemonLeft);

			if (format.teamLength && format.teamLength.battle) {
				// Trim the team: not all of the Pokémon brought to Preview will battle.
				this.p1.pokemon = this.p1.pokemon.slice(0, format.teamLength.battle);
				this.p1.pokemonLeft = this.p1.pokemon.length;
				this.p2.pokemon = this.p2.pokemon.slice(0, format.teamLength.battle);
				this.p2.pokemonLeft = this.p2.pokemon.length;
			}

			this.add('start');
			for (let pos = 0; pos < this.p1.active.length; pos++) {
				this.switchIn(this.p1.pokemon[pos], pos);
			}
			for (let pos = 0; pos < this.p2.active.length; pos++) {
				this.switchIn(this.p2.pokemon[pos], pos);
			}
			for (let pos = 0; pos < this.p1.pokemon.length; pos++) {
				let pokemon = this.p1.pokemon[pos];
				this.singleEvent('Start', this.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			for (let pos = 0; pos < this.p2.pokemon.length; pos++) {
				let pokemon = this.p2.pokemon[pos];
				this.singleEvent('Start', this.getEffect(pokemon.species), pokemon.speciesData, pokemon);
			}
			this.midTurn = true;
			break;
		}

		case 'move':
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.runMove(decision.move, decision.pokemon, decision.targetLoc, decision.sourceEffect, decision.zmove);
			break;
		case 'megaEvo':
			this.runMegaEvo(decision.pokemon);
			break;
		case 'beforeTurnMove': {
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			this.debug('before turn callback: ' + decision.move.id);
			let target = this.getTarget(decision.pokemon, decision.move, decision.targetLoc);
			if (!target) return false;
			decision.move.beforeTurnCallback.call(this, decision.pokemon, target);
			break;
		}

		case 'event':
			this.runEvent(decision.event, decision.pokemon);
			break;
		case 'team': {
			decision.side.pokemon.splice(decision.index, 0, decision.pokemon);
			decision.pokemon.position = decision.index;
			// we return here because the update event would crash since there are no active pokemon yet
			return;
		}

		case 'pass':
			if (!decision.priority || decision.priority <= 101) return;
			if (decision.pokemon) {
				decision.pokemon.switchFlag = false;
			}
			break;
		case 'instaswitch':
		case 'switch':
			if (decision.choice === 'switch' && decision.pokemon.status && this.data.Abilities.naturalcure) {
				this.singleEvent('CheckShow', this.data.Abilities.naturalcure, null, decision.pokemon);
			}
			if (decision.pokemon.hp) {
				decision.pokemon.beingCalledBack = true;
				let lastMove = this.getMove(decision.pokemon.lastMove);
				if (lastMove.selfSwitch !== 'copyvolatile') {
					this.runEvent('BeforeSwitchOut', decision.pokemon);
					if (this.gen >= 5) {
						this.eachEvent('Update');
					}
				}
				if (!this.runEvent('SwitchOut', decision.pokemon)) {
					// Warning: DO NOT interrupt a switch-out
					// if you just want to trap a pokemon.
					// To trap a pokemon and prevent it from switching out,
					// (e.g. Mean Look, Magnet Pull) use the 'trapped' flag
					// instead.

					// Note: Nothing in BW or earlier interrupts
					// a switch-out.
					break;
				}
			}
			decision.pokemon.illusion = null;
			this.singleEvent('End', this.getAbility(decision.pokemon.ability), decision.pokemon.abilityData, decision.pokemon);
			if (!decision.pokemon.hp && !decision.pokemon.fainted) {
				// a pokemon fainted from Pursuit before it could switch
				if (this.gen <= 4) {
					// in gen 2-4, the switch still happens
					decision.priority = -101;
					this.queue.unshift(decision);
					this.add('-hint', 'Pursuit target fainted, switch continues in gen 2-4');
					break;
				}
				// in gen 5+, the switch is cancelled
				this.debug('A Pokemon can\'t switch between when it runs out of HP and when it faints');
				break;
			}
			if (decision.target.isActive) {
				this.add('-hint', 'Switch failed; switch target is already active');
				break;
			}
			if (decision.choice === 'switch' && decision.pokemon.activeTurns === 1) {
				let foeActive = decision.pokemon.side.foe.active;
				for (let i = 0; i < foeActive.length; i++) {
					if (foeActive[i].isStale >= 2) {
						decision.pokemon.isStaleCon++;
						decision.pokemon.isStaleSource = 'switch';
						break;
					}
				}
			}

			this.switchIn(decision.target, decision.pokemon.position);
			break;
		case 'runUnnerve':
			this.singleEvent('PreStart', decision.pokemon.getAbility(), decision.pokemon.abilityData, decision.pokemon);
			break;
		case 'runSwitch':
			this.runEvent('SwitchIn', decision.pokemon);
			if (this.gen <= 2 && !decision.pokemon.side.faintedThisTurn && decision.pokemon.draggedIn !== this.turn) this.runEvent('AfterSwitchInSelf', decision.pokemon);
			if (!decision.pokemon.hp) break;
			decision.pokemon.isStarted = true;
			if (!decision.pokemon.fainted) {
				this.singleEvent('Start', decision.pokemon.getAbility(), decision.pokemon.abilityData, decision.pokemon);
				decision.pokemon.abilityOrder = this.abilityOrder++;
				this.singleEvent('Start', decision.pokemon.getItem(), decision.pokemon.itemData, decision.pokemon);
			}
			delete decision.pokemon.draggedIn;
			break;
		case 'runPrimal':
			if (!decision.pokemon.transformed) this.singleEvent('Primal', decision.pokemon.getItem(), decision.pokemon.itemData, decision.pokemon);
			break;
		case 'shift': {
			if (!decision.pokemon.isActive) return false;
			if (decision.pokemon.fainted) return false;
			decision.pokemon.activeTurns--;
			this.swapPosition(decision.pokemon, 1);
			let foeActive = decision.pokemon.side.foe.active;
			for (let i = 0; i < foeActive.length; i++) {
				if (foeActive[i].isStale >= 2) {
					decision.pokemon.isStaleCon++;
					decision.pokemon.isStaleSource = 'switch';
					break;
				}
			}
			break;
		}

		case 'beforeTurn':
			this.eachEvent('BeforeTurn');
			break;
		case 'residual':
			this.add('');
			this.clearActiveMove(true);
			this.updateSpeed();
			this.residualEvent('Residual');
			this.add('upkeep');
			break;

		case 'skip':
			throw new Error("Decision illegally skipped!");
		}

		// phazing (Roar, etc)
		for (let i = 0; i < this.p1.active.length; i++) {
			let pokemon = this.p1.active[i];
			if (pokemon.forceSwitchFlag) {
				if (pokemon.hp) this.dragIn(pokemon.side, pokemon.position);
				pokemon.forceSwitchFlag = false;
			}
		}
		for (let i = 0; i < this.p2.active.length; i++) {
			let pokemon = this.p2.active[i];
			if (pokemon.forceSwitchFlag) {
				if (pokemon.hp) this.dragIn(pokemon.side, pokemon.position);
				pokemon.forceSwitchFlag = false;
			}
		}

		this.clearActiveMove();

		// fainting

		this.faintMessages();
		if (this.ended) return true;

		// switching (fainted pokemon, U-turn, Baton Pass, etc)

		if (!this.queue.length || (this.gen <= 3 && this.queue[0].choice in {move:1, residual:1})) {
			// in gen 3 or earlier, switching in fainted pokemon is done after
			// every move, rather than only at the end of the turn.
			this.checkFainted();
		} else if (decision.choice === 'pass') {
			this.eachEvent('Update');
			return false;
		} else if (decision.choice === 'megaEvo' && this.gen >= 7) {
			this.eachEvent('Update');
			// In Gen 7, the decision order is recalculated for a Pokémon that mega evolves.
			const moveIndex = this.queue.findIndex(queuedDecision => queuedDecision.pokemon === decision.pokemon && queuedDecision.choice === 'move');
			if (moveIndex >= 0) {
				const moveDecision = this.queue.splice(moveIndex, 1)[0];
				this.insertQueue(moveDecision, true);
			}
			return false;
		} else if (this.queue.length && this.queue[0].choice === 'instaswitch') {
			return false;
		}

		let p1switch = this.p1.active.some(mon => mon && mon.switchFlag);
		let p2switch = this.p2.active.some(mon => mon && mon.switchFlag);

		if (p1switch && !this.canSwitch(this.p1)) {
			for (let i = 0; i < this.p1.active.length; i++) {
				this.p1.active[i].switchFlag = false;
			}
			p1switch = false;
		}
		if (p2switch && !this.canSwitch(this.p2)) {
			for (let i = 0; i < this.p2.active.length; i++) {
				this.p2.active[i].switchFlag = false;
			}
			p2switch = false;
		}

		if (p1switch || p2switch) {
			if (this.gen >= 5) {
				this.eachEvent('Update');
			}
			this.makeRequest('switch');
			return true;
		}

		this.eachEvent('Update');

		return false;
	}
	go() {
		this.add('');
		if (this.currentRequest) {
			this.currentRequest = '';
		}

		if (!this.midTurn) {
			this.queue.push({choice: 'residual', priority: -100});
			this.queue.unshift({choice: 'beforeTurn', priority: 100});
			this.midTurn = true;
		}

		while (this.queue.length) {
			let decision = this.queue.shift();

			this.runDecision(decision);

			if (this.currentRequest) {
				return;
			}

			if (this.ended) return;
		}

		this.nextTurn();
		this.midTurn = false;
		this.queue = [];
	}
	/**
	 * Changes a pokemon's decision, and inserts its new decision
	 * in priority order.
	 *
	 * You'd normally want the OverrideDecision event (which doesn't
	 * change priority order).
	 */
	changeDecision(pokemon, decision) {
		this.cancelDecision(pokemon);
		if (!decision.pokemon) decision.pokemon = pokemon;
		this.insertQueue(decision);
	}
	/**
	 * Takes a choice string passed from the client. Starts the next
	 * turn if all required choices have been made.
	 */
	choose(sideid, input) {
		let side = null;
		if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
		if (!side) throw new Error(`Invalid side ${sideid}`);

		if (!side.choose(input)) return false;

		this.checkDecisions();
		return true;
	}

	commitDecisions() {
		this.updateSpeed();

		let oldQueue = this.queue;
		this.queue = [];
		let oldFlag = this.LEGACY_API_DO_NOT_USE;
		this.LEGACY_API_DO_NOT_USE = false;
		for (const side of this.sides) {
			side.autoChoose();
		}
		this.LEGACY_API_DO_NOT_USE = oldFlag;
		this.add('choice', this.p1.getChoice, this.p2.getChoice);
		for (const side of this.sides) {
			this.addQueue(side.choice.actions);
		}

		this.sortQueue();
		Array.prototype.push.apply(this.queue, oldQueue);

		this.currentRequest = '';
		this.p1.currentRequest = '';
		this.p2.currentRequest = '';

		this.go();
	}
	undoChoice(sideid) {
		let side = null;
		if (sideid === 'p1' || sideid === 'p2') side = this[sideid];
		if (!side) throw new Error(`Invalid side ${sideid}`);
		if (!side.currentRequest) return;

		if (side.choice.cantUndo) {
			side.emitChoiceError(`Can't undo: A trapping/disabling effect would cause undo to leak information`);
			return;
		}

		side.clearChoice();
	}
	/**
	 * @return true if both decisions are complete
	 */
	checkDecisions() {
		let totalDecisions = 0;
		if (this.p1.isChoiceDone()) {
			if (!this.supportCancel) this.p1.choice.cantUndo = true;
			totalDecisions++;
		}
		if (this.p2.isChoiceDone()) {
			if (!this.supportCancel) this.p2.choice.cantUndo = true;
			totalDecisions++;
		}
		if (totalDecisions >= this.sides.length) {
			this.commitDecisions();
			return true;
		}
		return false;
	}

	add(...parts) {
		if (!parts.some(part => typeof part === 'function')) {
			this.log.push(`|${parts.join('|')}`);
			return;
		}
		this.log.push('|split');
		let sides = [null, this.sides[0], this.sides[1], true];
		for (let i = 0; i < sides.length; ++i) {
			let sideUpdate = '|' + parts.map(part => {
				if (typeof part !== 'function') return part;
				return part(sides[i]);
			}).join('|');
			this.log.push(sideUpdate);
		}
	}
	addMove(...args) {
		this.lastMoveLine = this.log.length;
		this.log.push(`|${args.join('|')}`);
	}
	attrLastMove(...args) {
		this.log[this.lastMoveLine] += `|${args.join('|')}`;
	}
	retargetLastMove(newTarget) {
		let parts = this.log[this.lastMoveLine].split('|');
		parts[4] = newTarget;
		this.log[this.lastMoveLine] = parts.join('|');
	}
	debug(activity) {
		if (this.getFormat().debug) {
			this.add('debug', activity);
		}
	}
	debugError(activity) {
		this.add('debug', activity);
	}

	// players

	getTeam(team) {
		const format = this.getFormat();
		if (!format.team && team) return team;

		if (!this.teamGenerator) {
			this.teamGenerator = this.getTeamGenerator(format);
		} else {
			this.teamGenerator.prng = new PRNG();
		}
		team = this.teamGenerator.generateTeam();
		this.prngSeed.push(...this.teamGenerator.prng.startingSeed);

		return team;
	}
	join(slot, name, avatar, team) {
		if (this.p1 && this.p2) return false;
		if ((this.p1 && this.p1.name === name) || (this.p2 && this.p2.name === name)) return false;

		let player = null;
		if (slot !== 'p1' && slot !== 'p2') slot = (this.p1 ? 'p2' : 'p1');
		let slotNum = (slot === 'p2' ? 1 : 0);
		if (this.started) {
			this[slot].name = name;
		} else {
			//console.log("NEW SIDE: " + name);
			team = this.getTeam(team);
			this[slot] = new Sim.Side(name, this, slotNum, team);
			this.sides[slotNum] = this[slot];
		}
		player = this[slot];

		if (avatar) player.avatar = avatar;
		this.add('player', player.id, player.name, avatar);
		if (!this.started) this.add('teamsize', player.id, player.pokemon.length);

		this.start();
		return player;
	}

	// This function is called by this process's 'message' event.
	receive(data, more) {
		this.messageLog.push(data.join(' '));
		let logPos = this.log.length;
		let alreadyEnded = this.ended;
		switch (data[1]) {
		case 'join': {
			let team;
			if (more) team = Dex.fastUnpackTeam(more);
			this.join(data[2], data[3], data[4], team);
			break;
		}

		case 'win':
		case 'tie':
			this.win(data[2]);
			break;

		case 'choose':
			this.choose(data[2], data[3]);
			break;

		case 'undo':
			this.undoChoice(data[2]);
			break;

		case 'eval': {
			/* eslint-disable no-eval, no-unused-vars */
			let battle = this;
			let p1 = this.p1;
			let p2 = this.p2;
			let p1active = p1 ? p1.active[0] : null;
			let p2active = p2 ? p2.active[0] : null;
			let target = data.slice(2).join('|').replace(/\f/g, '\n');
			this.add('', '>>> ' + target);
			try {
				this.add('', '<<< ' + eval(target));
			} catch (e) {
				this.add('', '<<< error: ' + e.message);
			}
			/* eslint-enable no-eval, no-unused-vars */
			break;
		}

		default:
		// unhandled
		}

		this.sendUpdates(logPos, alreadyEnded);
	}
	sendUpdates(logPos, alreadyEnded) {
		if (this.log.length > logPos) {
			if (alreadyEnded !== undefined && this.ended && !alreadyEnded) {
				if (this.rated || Config.logchallenges) {
					let log = {
						seed: this.prngSeed,
						turns: this.turn,
						p1: this.p1.name,
						p2: this.p2.name,
						p1team: this.p1.team,
						p2team: this.p2.team,
						log: this.log,
					};
					this.send('log', JSON.stringify(log));
				}
				this.send('score', [this.p1.pokemonLeft, this.p2.pokemonLeft]);
				this.send('winupdate', [this.winner].concat(this.log.slice(logPos)));
			} else {
				this.send('update', this.log.slice(logPos));
			}
		}
	}

	destroy() {
		// deallocate ourself

		// deallocate children and get rid of references to them
		for (let i = 0; i < this.sides.length; i++) {
			if (this.sides[i]) this.sides[i].destroy();
			this.sides[i] = null;
		}
		this.p1 = null;
		this.p2 = null;
		for (let i = 0; i < this.queue.length; i++) {
			delete this.queue[i].pokemon;
			delete this.queue[i].side;
			this.queue[i] = null;
		}
		this.queue = null;

		// in case the garbage collector really sucks, at least deallocate the log
		this.log = null;
	}
}

module.exports = Battle;
