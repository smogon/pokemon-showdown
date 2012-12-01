exports.BattleStatuses = {
	par: {
		inherit: true,
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon) {
			if (pokemon.ability !== 'magicguard' && this.random(4) === 0) {
				this.add('cant', pokemon.id, 'par');
				return false;
			}
		}
	},
	slp: {
		effectType: 'Status',
		onStart: function(target) {
			this.add('-status', target.id, 'slp');
			// 1-4 turns
			this.effectData.time = this.random(2,6);
			if (target.getAbility().isHalfSleep) {
				this.effectData.time = Math.floor(this.effectData.time / 2);
			}
		},
		onBeforeMovePriority: 2,
		onBeforeMove: function(pokemon, target, move) {
			pokemon.statusData.time--;
			if (!pokemon.statusData.time) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon.id, 'slp');
			if (move.sleepUsable) {
				return;
			}
			return false;
		}
	},
	partiallytrapped: {
		inherit: true,
		durationCallback: function(target, source) {
			if (source.item === 'gripclaw') return 6;
			return this.random(3,7);
		}
	}
};