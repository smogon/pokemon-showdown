exports.BattleStatuses = {
	brn: {
		inherit: true,
		onBasePower: function(basePower, attacker, defender, move) {
			if (move && move.category === 'Physical' && attacker && attacker.ability !== 'guts') {
				return this.chainModify(0.5); // This should really take place directly in the damage function but it's here for now
			}
		}
	},
	slp: {
		inherit: true,
		onSwitchIn: function(target) {
			this.effectData.time = this.effectData.startTime;
		}
	},
	partiallytrapped: {
		inherit: true,
		onResidual: function(pokemon) {
			if (this.effectData.source && (!this.effectData.source.isActive || this.effectData.source.hp <= 0)) {
				pokemon.removeVolatile('partiallytrapped');
				return;
			}
			if (this.effectData.source.item === 'bindingband') {
				this.damage(pokemon.maxhp/8);
			} else {
				this.damage(pokemon.maxhp/16);
			}
		}
	},
	stall: {
		// Protect, Detect, Endure counter
		duration: 2,
		counterMax: 256,
		onStart: function() {
			this.effectData.counter = 2;
		},
		onStallMove: function() {
			// this.effectData.counter should never be undefined here.
			// However, just in case, use 1 if it is undefined.
			var counter = this.effectData.counter || 1;
			if (counter >= 256) {
				// 2^32 - special-cased because Battle.random(n) can't handle n > 2^16 - 1
				return (this.random()*4294967296 < 1);
			}
			this.debug("Success chance: "+Math.round(100/counter)+"%");
			return (this.random(counter) === 0);
		},
		onRestart: function() {
			if (this.effectData.counter < this.effect.counterMax) {
				this.effectData.counter *= 2;
			}
			this.effectData.duration = 2;
		}
	},
	gem: {
		duration: 1,
		onBasePower: function(basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify(1.5);
		}
	}
};
