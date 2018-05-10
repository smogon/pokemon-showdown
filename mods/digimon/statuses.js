'use strict';
exports.BattleStatuses = {
	panic: {
		// this is a volatile status
		onStart: function (target, source, sourceEffect) {
			this.add('-start', target, 'panic');
			this.effectData.time = 3;
		},
		onEnd: function (target) {
			this.add('-end', target, 'panic');
		},
		onBeforeMovePriority: 4,
		onBeforeMove: function (pokemon) {
			pokemon.volatiles.panic.time--;
			if (!pokemon.volatiles.panic.time) {
				pokemon.removeVolatile('panic');
				return;
			}
			this.add('-activate', pokemon, 'panic');
			let tar = this.p1.active.concat(this.p2.active);
			this.useMove('panicattack', pokemon, tar[this.random(tar.length)]);
			return false;
		},
	},
	dot: {
		// this is a volatile status
		onStart: function (target, source, sourceEffect) {
			this.add('-start', target, 'dot');
			this.effectData.time = 3;
		},
		onEnd: function (target) {
			this.add('-end', target, 'dot');
		},
		onBeforeMovePriority: 4,
		onBeforeMove: function (pokemon) {
			pokemon.volatiles.dot.time--;
			if (!pokemon.volatiles.dot.time) {
				pokemon.removeVolatile('dot');
				return;
			}
			this.add('-activate', pokemon, 'dot');
			this.useMove('dotbeam', pokemon);
			return false;
		},
	},
	bug: {
		// this is a volatile status
		onStart: function (target, source, sourceEffect) {
			this.add('-start', target, 'bug');
			this.effectData.time = 3;
		},
		onEnd: function (target) {
			this.add('-end', target, 'bug');
		},
		onBeforeMovePriority: 4,
		onBeforeMove: function (pokemon) {
			pokemon.volatiles.bug.time--;
			if (!pokemon.volatiles.bug.time) {
				pokemon.removeVolatile('bug');
				return;
			}
		},
		// Interaction coded in abilities.js
	},
	stall: {
	   inherit: true,
	   onStart: function (target) {
			if (target.side.sideConditions['sidestall']) {
				this.effectData.counter = target.side.sideConditions['sidestall'].counter * 3;
			} else {
				this.effectData.counter = 3;
			}
		},
	},
	sidestall: {
		//this is a side condition
		duration: 2,
		counterMax: 729,
		onStart: function (side) {
			let counter = 3;
			for (let pokemon of side.active) {
				if (pokemon && pokemon.volatiles['stall'] && pokemon.volatiles['stall'].counter >= counter) {
					counter = pokemon.volatiles['stall'].counter * 3;
				}
			}
			this.effectData.counter = counter;
		},
		onStallMove: function (target) {
			let counter = this.effectData.counter || 1;
			this.debug("Success chance: " + Math.round(100 / counter) + "%");
			return this.randomChance(1, counter);
		},
		onRestart: function () {
			if (this.effectData.counter < this.effect.counterMax) {
				this.effectData.counter *= 3;
			}
			this.effectData.duration = 2;
		},
	},

	raindance: {
		inherit: true,
		onWeatherModifyDamage: function (damage, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Aqua') {
				this.debug('rain water boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Fire' || move.type === 'Flame') {
				this.debug('rain fire suppress');
				return this.chainModify(0.5);
			}
		},
	},
	primordialsea: {
		inherit: true,
		onTryMove: function (target, source, effect) {
			if ((effect.type === 'Fire' || effect.type === 'Flame') && effect.category !== 'Status') {
				this.debug('Primordial Sea fire suppress');
				this.add('-fail', source, effect, '[from] Primordial Sea');
				return null;
			}
		},
		onWeatherModifyDamage: function (damage, attacker, defender, move) {
			if (move.type === 'Water' || move.type === 'Aqua') {
				this.debug('Rain water boost');
				return this.chainModify(1.5);
			}
		},
	},
	sunnyday: {
		inherit: true,
		onWeatherModifyDamage: function (damage, attacker, defender, move) {
			if (move.type === 'Fire' || move.type === 'Flame') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.5);
			}
			if (move.type === 'Water' || move.type === 'Aqua') {
				this.debug('Sunny Day water suppress');
				return this.chainModify(0.5);
			}
		},
	},
	desolateland: {
		inherit: true,
		onTryMove: function (target, source, effect) {
			if ((effect.type === 'Water' || effect.type === 'Aqua') && effect.category !== 'Status') {
				this.debug('Desolate Land water suppress');
				this.add('-fail', source, effect, '[from] Desolate Land');
				return null;
			}
		},
		onWeatherModifyDamage: function (damage, attacker, defender, move) {
			if (move.type === 'Fire' || move.type === 'Flame') {
				this.debug('Sunny Day fire boost');
				return this.chainModify(1.5);
			}
		},
	},
	deltastream: {
		inherit: true,
		onEffectiveness: function (typeMod, target, type, move) {
			if (move && move.effectType === 'Move' && (type === 'Flying' || type === 'Air') && typeMod > 0) {
				this.add('-activate', '', 'deltastream');
				return 0;
			}
		},
	},
};
