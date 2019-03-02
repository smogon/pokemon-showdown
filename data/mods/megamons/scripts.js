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
					if (this.modData('Pokedex', i).species === 'Crucibelle-Mega') break;
					this.modData('FormatsData', i).isMega = true;
					this.modData('FormatsData', i).battleOnly = false;
					this.modData('FormatsData', i).requiredItem = undefined;
				}
			}
		}
	},
};

exports.BattleScripts = BattleScripts;
