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
	gem: {
		duration: 1,
		onBasePower: function(basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify(1.5);
		}
	}
};
