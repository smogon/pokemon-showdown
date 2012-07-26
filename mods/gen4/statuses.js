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
			// 2-7 turns
			this.effectData.time = this.random(3,9);
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
	}
};