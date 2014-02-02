exports.BattleMovedex = {
	spikes: {
		inherit: true,
		effect: {
			// this is a side condition
			onStart: function(side) {
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function(side) {
				if (this.effectData.layers >= 3) return false;
				this.add('-sidestart', side, 'Spikes');
				this.effectData.layers++;
			},
			onSwitchIn: function(pokemon) {
				var side = pokemon.side;
				if (!pokemon.runImmunity('Ground')) return;
				if (pokemon.hasType('Flying') && pokemon.item !== 'ironball' && !this.pseudoWeather.gravity && !pokemon.volatiles['ingrain']) return;
				var damageAmounts = [0,3,4,6]; // 1/8, 1/6, 1/4
				var damage = this.damage(damageAmounts[this.effectData.layers]*pokemon.maxhp/24);
			}
		}
	},
	stickyweb: {
		inherit: true,
		effect: {
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Sticky Web');
			},
			onSwitchIn: function(pokemon) {
				if (!pokemon.runImmunity('Ground')) return;
				if (pokemon.hasType('Flying') && pokemon.item !== 'ironball' && !this.pseudoWeather.gravity && !pokemon.volatiles['ingrain']) return;
				this.add('-activate', pokemon, 'move: Sticky Web');
				this.boost({spe: -1}, pokemon, pokemon.side.foe.active[0], this.getMove('stickyweb'));
			}
		}
	},
	toxicspikes: {
		inherit: true,
		effect: {
			onStart: function(side) {
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers = 1;
			},
			onRestart: function(side) {
				if (this.effectData.layers >= 2) return false;
				this.add('-sidestart', side, 'move: Toxic Spikes');
				this.effectData.layers++;
			},
			onSwitchIn: function(pokemon) {
				if (!pokemon.runImmunity('Ground')) return;
				if (!pokemon.runImmunity('Poison')) return;
				if (pokemon.hasType('Flying') && pokemon.item !== 'ironball' && !this.pseudoWeather.gravity && !pokemon.volatiles['ingrain']) return;
				if (pokemon.hasType('Poison')) {
					this.add('-sideend', pokemon.side, 'move: Toxic Spikes', '[of] '+pokemon);
					pokemon.side.removeSideCondition('toxicspikes');
				} else if (this.effectData.layers >= 2) {
					pokemon.trySetStatus('tox');
				} else {
					pokemon.trySetStatus('psn');
				}
			}
		}
	}
};
