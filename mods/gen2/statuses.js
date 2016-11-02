'use strict';

exports.BattleStatuses = {
	brn: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'brn');
		},
		onAfterMoveSelfPriority: 3,
		onAfterMoveSelf: function (pokemon) {
			this.damage(pokemon.maxhp / 8);
		},
		onAfterSwitchInSelf: function (pokemon) {
			this.damage(pokemon.maxhp / 8);
		},
	},
	par: {
		inherit: true,
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon) {
			if (this.random(4) === 0) {
				this.add('cant', pokemon.id, 'par');
				return false;
			}
		},
	},
	slp: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target.id, 'slp');
			// 1-5 turns
			this.effectData.time = this.random(2, 6);
		},
		onBeforeMovePriority: 10,
		onBeforeMove: function (pokemon, target, move) {
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon.id, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
	},
	frz: {
		inherit: true,
		onBeforeMove: function (pokemon, target, move) {
			if (move.flags['defrost']) return;
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onModifyMove: function () {},
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			if (move.flags['defrost']) pokemon.cureStatus();
		},
		onResidual: function (pokemon) {
			if (this.random(256) < 25) pokemon.cureStatus();
		},
	},
	psn: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'psn');
		},
		onAfterMoveSelfPriority: 3,
		onAfterMoveSelf: function (pokemon) {
			this.damage(pokemon.maxhp / 8);
		},
		onAfterSwitchInSelf: function (pokemon) {
			this.damage(pokemon.maxhp / 8);
		},
	},
	tox: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'tox');
			this.effectData.stage = 0;
		},
		onAfterMoveSelfPriority: 3,
		onAfterMoveSelf: function (pokemon) {
			if (this.effectData.stage < 15) {
				this.effectData.stage++;
			}
			this.damage(this.clampIntRange(pokemon.maxhp / 16, 1) * this.effectData.stage);
		},
		onSwitchIn: function (pokemon) {
			// Regular poison status and damage after a switchout -> switchin.
			this.effectData.stage = 0;
			pokemon.setStatus('psn');
		},
		onAfterSwitchInSelf: function (pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	confusion: {
		inherit: true,
		onStart: function (target, source, sourceEffect) {
			if (sourceEffect && sourceEffect.id === 'lockedmove') {
				this.add('-start', target, 'confusion', '[silent]');
			} else {
				this.add('-start', target, 'confusion');
			}
			if (sourceEffect && sourceEffect.id === 'berserkgene') {
				this.effectData.time = 256;
			} else {
				this.effectData.time = this.random(2, 6);
			}
		},
		onBeforeMove: function (pokemon) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.random(2) === 0) {
				return;
			}
			this.directDamage(this.getDamage(pokemon, pokemon, 40));
			return false;
		},
	},
	partiallytrapped: {
		inherit: true,
		durationCallback: function (target, source) {
			return this.random(3, 6);
		},
	},
	lockedmove: {
		// Outrage, Thrash, Petal Dance...
		durationCallback: function () {
			return this.random(2, 4);
		},
		onResidual: function (target) {
			if (target.lastMove === 'struggle' || target.status === 'slp') {
				// don't lock, and bypass confusion for calming
				delete target.volatiles['lockedmove'];
			}
		},
		onStart: function (target, source, effect) {
			this.effectData.move = effect.id;
		},
		onEnd: function (target) {
			// Confusion begins even if already confused
			delete target.volatiles['confusion'];
			target.addVolatile('confusion');
		},
		onLockMove: function (pokemon) {
			return this.effectData.move;
		},
		onBeforeTurn: function (pokemon) {
			let move = this.getMove(this.effectData.move);
			if (move.id) {
				this.debug('Forcing into ' + move.id);
				this.changeDecision(pokemon, {move: move.id});
			}
		},
	},
	sandstorm: {
		inherit: true,
		onWeather: function (target) {
			this.damage(target.maxhp / 8);
		},
	},
	stall: {
		duration: 2,
		onStart: function () {
			this.effectData.counter = 127;
		},
		onStallMove: function () {
			// Gen 2 starts counting at x=255, x/256 and then halves x on every turn
			let counter = Math.floor(this.effectData.counter) || 127;
			this.debug("Success chance: " + Math.round(counter * 1000 / 256) / 10 + "% (" + counter + "/256)");
			return (this.random(256) < counter);
		},
		onRestart: function () {
			this.effectData.counter /= 2;
			this.effectData.duration = 2;
		},
	},
};
