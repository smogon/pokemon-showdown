'use strict';

/**@type {ModdedBattleScriptsData} */
let BattleScripts = {
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
			modStats[statName] = Math.floor(Math.floor(2 * stat + set.ivs[statName] + Math.floor(set.evs[statName] / 4)) * set.level / 100 + 5);
			if (set.happiness && set.happiness >= 255) {
				modStats[statName] *= 1.1;
			}
			for (let pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				if (pokemon.id !== toId(set.species)) continue;
				// @ts-ignore
				modStats[statName] += pokemon.getAwakeningValues()[statName];
			}
		}
		if ('hp' in baseStats) {
			let stat = baseStats['hp'];
			modStats['hp'] = Math.floor(Math.floor(2 * stat + set.ivs['hp'] + Math.floor(set.evs['hp'] / 4) + 100) * set.level / 100 + 10);
			for (let pokemon of this.p1.pokemon.concat(this.p2.pokemon)) {
				if (pokemon.id !== toId(set.species)) continue;
				modStats['hp'] += pokemon.getAwakeningValues()['hp'];
			}
		}
		return this.natureModify(modStats, set.nature);
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
