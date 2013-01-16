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
			this.effectData.time = this.random(3,13);
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
	},
	sandstorm: {
		effectType: 'Weather',
		duration: 5,
		durationCallback: function(source, effect) {
			if (source && source.item === 'smoothrock') {
				return 8;
			}
			return 5;
		},
		onStart: function(battle, source, effect) {
			if (effect && effect.effectType === 'Ability') {
				this.effectData.duration = 0;
				this.add('-weather', 'Sandstorm', '[from] ability: '+effect, '[of] '+source);
			} else {
				this.add('-weather', 'Sandstorm');
			}
		},
		onResidualOrder: 1,
		onResidual: function() {
			this.add('-weather', 'Sandstorm', '[upkeep]');
			this.eachEvent('Weather');
		},
		onWeather: function(target) {
			this.damage(target.maxhp/16);
		},
		onEnd: function() {
			this.add('-weather', 'none');
		}
	},
	stall: {
		// In gen 3, the chance of protect succeeding does not fall below 1/8.
		// See http://upokecenter.dreamhosters.com/dex/?lang=en&move=182
		inherit: true,
		counterMax: 8
	}
};
