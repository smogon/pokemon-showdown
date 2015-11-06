'use strict';

exports.BattleMovedex = {
	rapidspin: {
		inherit: true,
		self: {
			onHit: function (pokemon) {
				if (pokemon.hp && pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
				let sideConditions = {spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1};
				for (let i in sideConditions) {
					if (i === 'stealthrock' && pokemon.side.sideConditions[i] && pokemon.side.sideConditions[i].type === 'Ghost') continue;
					if (pokemon.hp && pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.hp && pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			}
		}
	},
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
					let typeMod = this.clampIntRange(this.getEffectiveness(this.effectData.type, pokemon), -6, 6);
					this.damage(pokemon.maxhp * Math.pow(2, typeMod) / 8);
				}
			}
		}
	}
};
