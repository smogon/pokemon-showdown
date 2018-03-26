'use strict';

/**@type {{[k: string]: ModdedEffectData}} */
let BattleStatuses = {
	brn: {
		inherit: true,
		onResidual: function (pokemon) {
			this.damage(pokemon.maxhp / 8);
		},
	},
	par: {
		inherit: true,
		onModifySpe: function (spe, pokemon) {
			if (!pokemon.hasAbility('quickfeet')) {
				return this.chainModify(0.25);
			}
		},
	},
	confusion: {
		inherit: true,
		onBeforeMove: function (pokemon) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.randomChance(1, 2)) {
				return;
			}
			this.damage(this.getDamage(pokemon, pokemon, 40), pokemon, pokemon, {
				id: 'confused',
				effectType: 'Move',
				// @ts-ignore
				type: '???',
			});
			return false;
		},
	},
	choicelock: {
		inherit: true,
		onBeforeMove: function () {},
	},
};

exports.BattleStatuses = BattleStatuses;
