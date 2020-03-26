'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	standardpetmod: {
		inherit: true,
		ruleset: ['[Gen 7] OU', '!Species Clause'],
		banlist: ['All Pokemon'],
		onBegin() {
			// The only validator rule this currently modifies is Species Clause, so the added rule is just this
			this.add('rule', 'Clean Slate: Limit one of each Pokémon');
		},
		onValidateTeam(team, format) {
			/**@type {{[k: string]: true}} */
			let speciesTable = {};
			for (const set of team) {
				let species = this.dex.getSpecies(set.species);
				if (speciesTable[species.name]) {
					return ["You are limited to one of each Pokémon by Clean Slate.", "(You have more than one " + species.name + ")"];
				}
				speciesTable[species.name] = true;
			}
		},
	},
};

exports.BattleFormats = BattleFormats;
