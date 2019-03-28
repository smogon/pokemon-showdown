'use strict';

/**@type {{[k: string]: ModdedItemData}} */
let BattleItems = {
	blueorb: {
		inherit: true,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && !pokemon.template.isPrimal) {
				this.insertQueue({pokemon: pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal(pokemon) {
			/**@type {Template} */
			// @ts-ignore
			let template = this.getMixedTemplate(pokemon.m.originalSpecies, 'Kyogre-Primal');
			if (pokemon.m.originalSpecies === 'Kyogre') {
				pokemon.formeChange(template, this.effect, true);
			} else {
				pokemon.formeChange(template, this.effect, true);
				pokemon.baseTemplate = template;
				this.add('-start', pokemon, 'Blue Orb', '[silent]');
			}
		},
		onTakeItem(item) {
			return false;
		},
	},
	redorb: {
		inherit: true,
		onSwitchIn(pokemon) {
			if (pokemon.isActive && !pokemon.template.isPrimal) {
				this.insertQueue({pokemon: pokemon, choice: 'runPrimal'});
			}
		},
		onPrimal(pokemon) {
			/**@type {Template} */
			// @ts-ignore
			let template = this.getMixedTemplate(pokemon.m.originalSpecies, 'Groudon-Primal');
			if (pokemon.m.originalSpecies === 'Groudon') {
				pokemon.formeChange(template, this.effect, true);
			} else {
				pokemon.formeChange(template, this.effect, true);
				pokemon.baseTemplate = template;
				this.add('-start', pokemon, 'Red Orb', '[silent]');
				let apparentSpecies = pokemon.illusion ? pokemon.illusion.template.species : pokemon.m.originalSpecies;
				let oTemplate = this.getTemplate(apparentSpecies);
				if (pokemon.illusion) {
					let types = oTemplate.types;
					if (types.length > 1 || types[types.length - 1] !== 'Fire') {
						this.add('-start', pokemon, 'typechange', (types[0] !== 'Fire' ? types[0] + '/' : '') + 'Fire', '[silent]');
					}
				} else if (oTemplate.types.length !== pokemon.template.types.length || oTemplate.types[1] !== pokemon.template.types[1]) {
					this.add('-start', pokemon, 'typechange', pokemon.template.types.join('/'), '[silent]');
				}
			}
		},
		onTakeItem(item) {
			return false;
		},
	},
};

exports.BattleItems = BattleItems;
