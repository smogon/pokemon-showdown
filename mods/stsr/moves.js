exports.BattleMovedex = {
	stealthrock: {
		inherit: true,
		effect: {
			onStart: function (side, source) {
				this.add('-sidestart', side, 'move: Stealth Rock');
				this.effectData.type = source.getTypes()[0];
				this.add('-message', '(' + this.effectData.type + '-type)');
			},
			onSwitchIn: function (pokemon) {
				if (pokemon.hasAbility('voltabsorb') && this.effectData.type === 'Electric') {
					pokemon.side.removeSideCondition('stealthrock');
					this.add('-sideend', pokemon.side, 'move: Stealth Rock', '[of] ' + pokemon);
				} else if (pokemon.hasAbility('waterabsorb') && this.effectData.type === 'Water') {
					pokemon.side.removeSideCondition('stealthrock');
					this.add('-sideend', pokemon.side, 'move: Stealth Rock', '[of] ' + pokemon);
				} else if (pokemon.runImmunity(this.effectData.type)) {
					var typeMod = this.clampIntRange(this.getEffectiveness(this.effectData.type, pokemon), -6, 6);
					this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
				}
			}
		}
	}
};
