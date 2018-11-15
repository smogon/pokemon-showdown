'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	init: function () {
		this.modData('Abilities', 'noability').isNonstandard = false;
		for (let i in this.data.Pokedex) {
			this.modData('Pokedex', i).abilities = {0: 'No Ability'};
		}
		for (let i in this.data.FormatsData) {
			if (this.data.FormatsData[i].requiredItem && this.data.Items[toId(this.data.FormatsData[i].requiredItem)].megaStone) {
				this.modData('FormatsData', i).requiredItem = undefined;
			}
		}
	},
	/**
	 * Given a table of base stats and a pokemon set, return the actual stats.
	 * @param {StatsTable} baseStats
	 * @param {PokemonSet} set
	 * @return {StatsTable}
	 */
	spreadModify(baseStats, set) {
		/** @type {any} */
		const modStats = {atk: 10, def: 10, spa: 10, spd: 10, spe: 10};
		for (let statName in modStats) {
			// @ts-ignore
			let stat = baseStats[statName];
			// @ts-ignore
			modStats[statName] = Math.floor((Math.floor(2 * stat + set.ivs[statName]) * set.level / 100 + 5) * Math.floor(set.happiness >= 255 ? 1.1 : 1));
		}
		if ('hp' in baseStats) {
			let stat = baseStats['hp'];
			modStats['hp'] = Math.floor(Math.floor(2 * stat + set.ivs['hp'] + 100) * set.level / 100 + 10);
		}
		return this.natureModify(modStats, set);
	},

	/**
	 * @param {StatsTable} stats
	 * @param {PokemonSet} set
	 * @return {StatsTable}
	 */
	natureModify(stats, set) {
		let nature = this.getNature(set.nature);
		// @ts-ignore
		if (nature.plus) stats[nature.plus] = Math.floor(stats[nature.plus] * 1.1);
		// @ts-ignore
		if (nature.minus) stats[nature.minus] = Math.floor(stats[nature.minus] * 0.9);
		for (const stat in stats) {
			// @ts-ignore
			stats[stat] += this.getAwakeningValues(stat, set);
		}
		return stats;
	},

	pokemon: {
		getWeight() {
			let weight = this.template.weightkg;
			weight = this.battle.runEvent('ModifyWeight', this, null, null, weight);
			if (weight < 0.1) weight = 0.1;
			let weightModifierFinal = 20 * Math.random() * 0.01;
			return weight + (weight * (this.battle.random(2) === 1 ? 1 : -1) * weightModifierFinal);
		},
	},
};

exports.BattleScripts = BattleScripts;
