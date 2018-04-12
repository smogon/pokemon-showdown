'use strict';

/**@type {{[k: string]: ModdedEffectData}} */
let BattleStatuses = {
	slp: {
		name: 'slp',
		id: 'slp',
		num: 0,
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'slp');
			// 1-4 turns
			this.effectData.time = this.random(2, 6);
			// Turns spent using Sleep Talk/Snore immediately before switching out while asleep
			this.effectData.skippedTime = 0;
		},
		onSwitchIn: function (target) {
			this.effectData.time += this.effectData.skippedTime;
			this.effectData.skippedTime = 0;
		},
		onBeforeMovePriority: 10,
		onBeforeMove: function (pokemon, target, move) {
			if (pokemon.hasAbility('earlybird')) {
				pokemon.statusData.time--;
			}
			pokemon.statusData.time--;
			if (pokemon.statusData.time <= 0) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'slp');
			if (move.sleepUsable) {
				this.effectData.skippedTime++;
				return;
			}
			this.effectData.skippedTime = 0;
			return false;
		},
	},
	frz: {
		inherit: true,
		onHit: function (target, source, move) {
			if (move.thawsTarget || move.type === 'Fire' && move.category !== 'Status' && move.id !== 'hiddenpower' && move.id !== 'weatherball') {
				target.cureStatus();
			}
		},
	},
	sandstorm: {
		inherit: true,
		onModifySpD: function () { },
	},
};

exports.BattleStatuses = BattleStatuses;
