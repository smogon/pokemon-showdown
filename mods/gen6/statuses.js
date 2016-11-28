'use strict';

exports.BattleStatuses = {
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
};
