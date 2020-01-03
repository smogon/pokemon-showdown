'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	standard: {
		inherit: true,
		ruleset: ['Obtainable', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
	},
	validatestats: {
		inherit: true,
		onValidateSet(set) {
			let template = this.dex.getTemplate(set.species);
			let item = this.dex.getItem(set.item);
			if (item && item.id === 'griseousorb' && template.num !== 487) {
				return ['Griseous Orb can only be held by Giratina in Generation 4.'];
			}
			if (template.num === 493 && set.evs && (set.moves.includes('roaroftime') || set.moves.includes('shadowforce') || set.moves.includes('spacialrend'))) {
				for (let stat in set.evs) {
					// @ts-ignore
					if (set.evs[stat] > 100) return ["Event Arceus may not have more than 100 of any EVs in Generation 4."];
				}
			}
		},
	},
};

exports.BattleFormats = BattleFormats;

