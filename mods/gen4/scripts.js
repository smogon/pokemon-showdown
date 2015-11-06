'use strict';

exports.BattleScripts = {
	inherit: 'gen5',
	gen: 4,
	init: function () {
		for (let i in this.data.Pokedex) {
			delete this.data.Pokedex[i].abilities['H'];
		}
	}
};
