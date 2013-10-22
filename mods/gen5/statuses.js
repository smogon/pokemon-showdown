exports.BattleStatuses = {
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
	}
};
