'use strict';

/**@type {{[k: string]: ModdedEffectData}} */
let BattleStatuses = {
	brn: {
		name: 'brn',
		id: 'brn',
		num: 0,
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
		name: 'par',
		id: 'par',
		num: 0,
		inherit: true,
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon) {
			if (this.randomChance(1, 4)) {
				this.add('cant', pokemon, 'par');
				return false;
			}
		},
	},
	slp: {
		name: 'slp',
		id: 'slp',
		num: 0,
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'slp');
			// 1-6 turns
			this.effectData.time = this.random(2, 8);
		},
		onBeforeMovePriority: 10,
		onBeforeMove: function (pokemon, target, move) {
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		},
	},
	frz: {
		name: 'frz',
		id: 'frz',
		num: 0,
		inherit: true,
		onBeforeMove: function (pokemon, target, move) {
			if (move.flags['defrost']) return;
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onModifyMove: function () {},
		onHit: function () {},
		onAfterMoveSecondary: function (target, source, move) {
			if ((move.secondary && move.secondary !== true && move.secondary.status === 'brn') || move.statusRoll === 'brn') {
				target.cureStatus();
			}
		},
		onAfterMoveSecondarySelf: function (pokemon, target, move) {
			if (move.flags['defrost']) pokemon.cureStatus();
		},
		onResidual: function (pokemon) {
			if (this.randomChance(25, 256)) pokemon.cureStatus();
		},
	},
	psn: {
		name: 'psn',
		id: 'psn',
		num: 0,
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
		name: 'tox',
		id: 'tox',
		num: 0,
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
		onBeforeMove: function (pokemon, target, move) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.randomChance(1, 2)) {
				return;
			}
			// @ts-ignore
			move = {
				basePower: 40,
				type: '???',
				baseMoveType: move.type,
				category: 'Physical',
				willCrit: false,
				isSelfHit: true,
				noDamageVariance: true,
				flags: {},
			};
			this.directDamage(this.getDamage(pokemon, pokemon, move));
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
		name: 'lockedmove',
		id: 'lockedmove',
		num: 0,
		// Outrage, Thrash, Petal Dance...
		durationCallback: function () {
			return this.random(2, 4);
		},
		onResidual: function (target) {
			if ((target.lastMove && target.lastMove.id === 'struggle') || target.status === 'slp') {
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
		onMoveAborted: function (pokemon) {
			delete pokemon.volatiles['lockedmove'];
		},
		onBeforeTurn: function (pokemon) {
			let move = this.getMove(this.effectData.move);
			if (move.id) {
				this.debug('Forcing into ' + move.id);
				this.changeAction(pokemon, {move: move.id});
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
		name: 'stall',
		id: 'stall',
		num: 0,
		duration: 2,
		onStart: function () {
			this.effectData.counter = 127;
		},
		onStallMove: function () {
			let counter = Math.floor(this.effectData.counter) || 127;
			this.debug("Success chance: " + Math.round(counter * 1000 / 255) / 10 + "% (" + counter + "/255)");
			return this.randomChance(counter, 255);
		},
		onRestart: function () {
			this.effectData.counter /= 2;
			this.effectData.duration = 2;
		},
	},
};

exports.BattleStatuses = BattleStatuses;
