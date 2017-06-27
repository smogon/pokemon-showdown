'use strict';

exports.BattleStatuses = {
	brn: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'brn');
		},
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf: function (pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
		onAfterSwitchInSelf: function (pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	par: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'par');
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon) {
			if (this.random(256) < 63) {
				this.add('cant', pokemon, 'par');
				pokemon.removeVolatile('bide');
				pokemon.removeVolatile('lockedmovee');
				pokemon.removeVolatile('twoturnmove');
				pokemon.removeVolatile('fly');
				pokemon.removeVolatile('dig');
				pokemon.removeVolatile('solarbeam');
				pokemon.removeVolatile('skullbash');
				pokemon.removeVolatile('partialtrappinglock');
				return false;
			}
		},
	},
	slp: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'slp');
			// 1-3 turns
			this.effectData.startTime = this.random(1, 4);
			this.effectData.time = this.effectData.startTime;
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon, target, move) {
			pokemon.statusData.time--;
			this.add('cant', pokemon, 'slp');
			pokemon.lastMove = '';
			return false;
		},
		onAfterMoveSelf: function (pokemon) {
			if (pokemon.statusData.time <= 0) pokemon.cureStatus();
		},
	},
	frz: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'frz');
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon, target, move) {
			this.add('cant', pokemon, 'frz');
			pokemon.lastMove = '';
			return false;
		},
		onHit: function (target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status') {
				target.cureStatus();
			}
		},
	},
	psn: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'psn');
		},
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf: function (pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
		onAfterSwitchInSelf: function (pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	tox: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'tox');
		},
		onAfterMoveSelfPriority: 2,
		onAfterMoveSelf: function (pokemon) {
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
		onAfterSwitchInSelf: function (pokemon) {
			// Regular poison status and damage after a switchout -> switchin.
			pokemon.setStatus('psn');
			pokemon.addVolatile('residualdmg');
			pokemon.volatiles['residualdmg'].counter = 1;
			this.damage(this.clampIntRange(Math.floor(pokemon.maxhp / 16), 1));
		},
	},
	partiallytrapped: {
		duration: 2,
		onBeforeMovePriority: 1,
		onStart: function (target, source, effect) {
			this.add('-activate', target, 'move: ' + effect, '[of] ' + source);
		},
		onBeforeMove: function (pokemon) {
			if (this.effectData.source && (!this.effectData.source.isActive || this.effectData.source.hp <= 0)) {
				pokemon.removeVolatile('partiallytrapped');
				return;
			}
			this.add('cant', pokemon, 'partiallytrapped');
			return false;
		},
		onEnd: function (pokemon) {
			this.add('-end', pokemon, this.effectData.sourceEffect, '[partiallytrapped]');
		},
	},
};
