'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	pokemon: {
		inherit: true,
		onValidateSet: function (set, format) {
			if (!format || !this.getRuleTable(format).has('-illegal')) return;
			let template = this.getTemplate(set.species);
			let item = this.getItem(set.item);
			if (item && item.id === 'griseousorb' && template.num !== 487) {
				return ['Griseous Orb can only be held by Giratina in Generation 4.'];
			}
			if (template.num === 493 && set.evs) {
				for (let stat in set.evs) {
					// @ts-ignore
					if (set.evs[stat] > 100) return ["Arceus may not have more than 100 of any EVs in Generation 4."];
				}
			}
		},
	},
	evasionabilitiesclause: {
		inherit: true,
		banlist: ['Diglett + Sand Veil', 'Dugtrio + Sand Veil', 'Gligar + Sand Veil', 'Gliscor + Sand Veil',
			'Swinub + Snow Cloak', 'Piloswine + Snow Cloak', 'Mamoswine + Snow Cloak',
		],
	},
};

exports.BattleFormats = BattleFormats;

