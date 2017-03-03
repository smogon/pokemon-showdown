'use strict';

exports.BattleStatuses = {
	confusion: {
		inherit: true,
		onBeforeMovePriority: 3,
		onBeforeMove: function (pokemon) {
			pokemon.volatiles.confusion.time--;
			if (!pokemon.volatiles.confusion.time) {
				pokemon.removeVolatile('confusion');
				return;
			}
			this.add('-activate', pokemon, 'confusion');
			if (this.random(3) > 0) {
				return;
			}
			this.damage(this.getDamage(pokemon, pokemon, {
				basePower: 40,
				type: '???',
				category: 'Physical',
				willCrit: false,
				flags: {},
				id: 'confusion',
			}), pokemon, pokemon, {
				id: 'confused',
				effectType: 'Move',
				type: '???',
			});
			return false;
		},
	},
};
