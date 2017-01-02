'use strict';

exports.BattleScripts = {
	init: function () {
		for (let i in this.data.Pokedex) {
			if (Object.values(this.data.Pokedex[i].baseStats).reduce((x, y) => x + y) <= 350) {
				for (let j in this.data.Pokedex[i].baseStats) {
					this.modData('Pokedex', i).baseStats[j] = this.data.Pokedex[i].baseStats[j] * 2;
				}
			}
		}
		this.modData('Pokedex', 'shedinja').baseStats['hp'] = 1;
	},
};
