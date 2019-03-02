'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init() {
		for (let i in this.data.Pokedex) {
			let pokemon = this.data.Pokedex[i];
			switch (pokemon.species) {
			case 'Blaziken-Mega':
			case 'Gengar-Mega':
			case 'Mewtwo-Mega-X':
			case 'Mewtwo-Mega-Y':
			case 'Rayquaza-Mega':
				break;
			default:
				switch (pokemon.forme) {
				case 'Mega':
				case 'Mega-X':
				case 'Mega-Y':
					this.modData('Pokedex', i).gen = 7;
					this.modData('Pokedex', i).isMega = true;
					this.modData('Pokedex', i).battleOnly = false;
					delete this.modData('FormatsData', i).requiredItem;
				}
			}
		}
	},
};

exports.BattleScripts = BattleScripts;
