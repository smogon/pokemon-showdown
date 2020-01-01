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
				let template = this.dex.getTemplate(set.species);
				if (speciesTable[template.species]) {
					return ["You are limited to one of each Pokémon by Clean Slate.", "(You have more than one " + template.species + ")"];
				}
				speciesTable[template.species] = true;
			}
		},
	},
};

exports.BattleFormats = BattleFormats;
