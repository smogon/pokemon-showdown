'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init: function () {
		for (let pokemon in this.data.FormatsData) {
			let pokeData = this.modData('FormatsData', pokemon);
			if (pokeData.eventPokemon) {
				for (const event of pokeData.eventPokemon) {
					event.shiny = 1;
				}
			}
		}
	},
};

exports.BattleScripts = BattleScripts;
