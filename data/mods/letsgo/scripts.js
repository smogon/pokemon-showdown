'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
	inherit: 'gen7',
	init() {
		this.modData('Abilities', 'noability').isNonstandard = false;
		for (let i in this.data.Pokedex) {
			this.modData('Pokedex', i).abilities = {0: 'No Ability'};
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
			modStats[statName] = Math.floor((Math.floor(2 * stat + set.ivs[statName]) * set.level / 100 + 5));
		}
		if ('hp' in baseStats) {
			let stat = baseStats['hp'];
			modStats['hp'] = Math.floor(Math.floor(2 * stat + set.ivs['hp'] + 100) * set.level / 100 + 10);
		}
		return this.dex.natureModify(modStats, set);
	},

	/**
	 * @param {StatsTable} stats
	 * @param {PokemonSet} set
	 * @return {StatsTable}
	 */
	natureModify(stats, set) {
		let nature = this.dex.getNature(set.nature);
		// @ts-ignore
		if (nature.plus) stats[nature.plus] = Math.floor(stats[nature.plus] * 1.1);
		// @ts-ignore
		if (nature.minus) stats[nature.minus] = Math.floor(stats[nature.minus] * 0.9);
		set.happiness = 70;
		let friendshipValue = Math.floor((set.happiness / 255 / 10 + 1) * 100);
		for (const stat in stats) {
			if (stat !== 'hp') {
				// @ts-ignore
				stats[stat] = Math.floor(stats[stat] * friendshipValue / 100);
			}
			// @ts-ignore
			stats[stat] += this.getAwakeningValues(set, stat);
		}
		return stats;
	},

	pokemon: {
		getWeight() {
			let weighthg = this.battle.runEvent('ModifyWeight', this, null, null, this.weighthg);
			if (weighthg < 1) weighthg = 1;
			let weightModifierFinal = 20 * Math.random() * 0.01;
			return weighthg + (weighthg * (this.battle.random(2) === 1 ? 1 : -1) * weightModifierFinal);
		},
	},
};

exports.BattleScripts = BattleScripts;
