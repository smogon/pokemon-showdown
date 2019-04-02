/**
 * Statuses worked way different.
 * Sleep lasted longer, had no reset on switch and took a whole turn to wake up.
 * Frozen only thaws when hit by fire or Haze.
 *
 * Secondary effects to status (-speed, -atk) worked differently, so they are
 * separated as volatile statuses that are applied on switch in, removed
 * under certain conditions and re-applied under other conditions.
 */

'use strict';

/**@type {{[k: string]: ModdedPureEffectData}} */
let BattleStatuses = {
	brn: {
		name: 'brn',
		id: 'brn',
		num: 0,
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'brn');
			target.addVolatile('brnattackdrop');
		},
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf(pokemon) {
			let toxicCounter = pokemon.volatiles['residualdmg'] ? pokemon.volatiles['residualdmg'].counter : 1;
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1) * toxicCounter, pokemon);
			if (pokemon.volatiles['residualdmg']) {
				this.hint("In Gen 1, Toxic's counter is retained after Rest and applies to PSN/BRN.", true);
			}
		},
		onSwitchIn(pokemon) {
			pokemon.addVolatile('brnattackdrop');
		},
		onAfterSwitchInSelf(pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	par: {
		name: 'par',
		id: 'par',
		num: 0,
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'par');
			target.addVolatile('parspeeddrop');
		},
		onBeforeMovePriority: 2,
		onBeforeMove(pokemon) {
			if (this.randomChance(63, 256)) {
				this.add('cant', pokemon, 'par');
				pokemon.removeVolatile('bide');
				pokemon.removeVolatile('twoturnmove');
				pokemon.removeVolatile('fly');
				pokemon.removeVolatile('dig');
				pokemon.removeVolatile('solarbeam');
				pokemon.removeVolatile('skullbash');
				pokemon.removeVolatile('partialtrappinglock');
				return false;
			}
		},
		onSwitchIn(pokemon) {
			pokemon.addVolatile('parspeeddrop');
		},
	},
	slp: {
		name: 'slp',
		id: 'slp',
		num: 0,
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'slp');
			// 1-7 turns
			this.effectData.startTime = this.random(1, 8);
			this.effectData.time = this.effectData.startTime;
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			pokemon.statusData.time--;
			if (pokemon.statusData.time > 0) {
				this.add('cant', pokemon, 'slp');
			}
			pokemon.lastMove = null;
			return false;
		},
		onAfterMoveSelf(pokemon) {
			if (pokemon.statusData.time <= 0) pokemon.cureStatus();
		},
	},
	frz: {
		name: 'frz',
		id: 'frz',
		num: 0,
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'frz');
		},
		onBeforeMovePriority: 10,
		onBeforeMove(pokemon, target, move) {
			this.add('cant', pokemon, 'frz');
			pokemon.lastMove = null;
			return false;
		},
		onAfterMoveSecondary(target, source, move) {
			if (move.secondary && move.secondary.status === 'brn') {
				target.cureStatus();
			}
		},
	},
	psn: {
		name: 'psn',
		id: 'psn',
		num: 0,
		effectType: 'Status',
		onStart(target) {
			this.add('-status', target, 'psn');
		},
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf(pokemon) {
			let toxicCounter = pokemon.volatiles['residualdmg'] ? pokemon.volatiles['residualdmg'].counter : 1;
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1) * toxicCounter, pokemon);
			if (pokemon.volatiles['residualdmg']) {
				this.hint("In Gen 1, Toxic's counter is retained after Rest and applies to PSN/BRN.", true);
			}
		},
		onAfterSwitchInSelf(pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	tox: {
		inherit: true,
		onAfterMoveSelfPriority: 2,
	},
	confusion: {
		name: 'confusion',
		id: 'confusion',
		num: 0,
		// this is a volatile status
		onStart(target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[silent]');
			} else {
				this.add('-start', target, 'confusion');
			}
			this.effectData.time = this.random(2, 6);
		},
		onEnd(target) {
			this.add('-end', target, 'confusion');
		},
		onBeforeMovePriority: 3,
		onBeforeMove(pokemon, target) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (!this.randomChance(128, 256)) {
				let damage = Math.floor(Math.floor(((Math.floor(2 * pokemon.level / 5) + 2) * pokemon.getStat('atk') * 40) / pokemon.getStat('def', false)) / 50) + 2;
				this.directDamage(damage, pokemon, target);
				pokemon.removeVolatile('bide');
				pokemon.removeVolatile('twoturnmove');
				pokemon.removeVolatile('fly');
				pokemon.removeVolatile('dig');
				pokemon.removeVolatile('solarbeam');
				pokemon.removeVolatile('skullbash');
				pokemon.removeVolatile('partialtrappinglock');
				return false;
			}
			return;
		},
	},
	flinch: {
		name: 'flinch',
		id: 'flinch',
		num: 0,
		duration: 1,
		onBeforeMovePriority: 4,
		onBeforeMove(pokemon) {
			if (!this.runEvent('Flinch', pokemon)) {
				return;
			}
			this.add('cant', pokemon, 'flinch');
			return false;
		},
	},
	trapped: {
		name: 'trapped',
		id: 'trapped',
		num: 0,
		noCopy: true,
		onTrapPokemon(pokemon) {
			if (!this.effectData.source || !this.effectData.source.isActive) {
				delete pokemon.volatiles['trapped'];
				return;
			}
			pokemon.trapped = true;
		},
	},
	partiallytrapped: {
		name: 'partiallytrapped',
		id: 'partiallytrapped',
		num: 0,
		duration: 2,
		onBeforeMovePriority: 4,
		onBeforeMove(pokemon) {
			this.add('cant', pokemon, 'partiallytrapped');
			return false;
		},
	},
	partialtrappinglock: {
		name: 'partialtrappinglock',
		id: 'partialtrappinglock',
		num: 0,
		durationCallback() {
			let duration = this.sample([2, 2, 2, 3, 3, 3, 4, 5]);
			return duration;
		},
		onResidual(target) {
			if (target.lastMove && target.lastMove.id === 'struggle' || target.status === 'slp') {
				delete target.volatiles['partialtrappinglock'];
			}
		},
		onStart(target, source, effect) {
			this.effectData.move = effect.id;
		},
		onDisableMove(pokemon) {
			if (!pokemon.hasMove(this.effectData.move)) {
				return;
			}
			for (const moveSlot of pokemon.moveSlots) {
				if (moveSlot.id !== this.effectData.move) {
					pokemon.disableMove(moveSlot.id);
				}
			}
		},
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		inherit: true,
		durationCallback() {
			return this.random(3, 5);
		},
	},
	stall: {
		name: 'stall',
		id: 'stall',
		num: 0,
		// Protect, Detect, Endure counter
		duration: 2,
		counterMax: 256,
		onStart() {
			this.effectData.counter = 2;
		},
		onStallMove() {
			// this.effectData.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			let counter = this.effectData.counter || 1;
			if (counter >= 256) {
				// 2^32 - special-cased because Battle.random(n) can't handle n > 2^16 - 1
				return (this.random() * 4294967296 < 1);
			}
			this.debug("Success chance: " + Math.round(100 / counter) + "%");
			return this.randomChance(1, counter);
		},
		onRestart() {
			// @ts-ignore
			if (this.effectData.counter < this.effect.counterMax) {
				this.effectData.counter *= 2;
			}
			this.effectData.duration = 2;
		},
	},
};

exports.BattleStatuses = BattleStatuses;
