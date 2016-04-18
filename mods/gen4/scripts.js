'use strict';

exports.BattleScripts = {
	inherit: 'gen5',
	gen: 4,
	init: function () {
		for (let i in this.data.Pokedex) {
			delete this.data.Pokedex[i].abilities['H'];
		}
	},

	calcRecoilDamage: function (damageDealt, move) {
		return this.clampIntRange(Math.floor(damageDealt * move.recoil[0] / move.recoil[1]), 1);
	},
};
