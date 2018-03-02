'use strict';

exports.BattleScripts = {
	spreadModify: function (stats, set) {
		const modStats = {atk: 10, def: 10, spa: 10, spd: 10, spe: 10};
		let nature = this.getNature(set.nature);
		if (nature.plus) {
			let minusEVs = set.evs[nature.minus];
			let plusEVs = set.evs[nature.plus];
			let minusIVs = set.ivs[nature.minus];
			let plusIVs = set.ivs[nature.plus];
			set.evs[nature.minus] = plusEVs;
			set.evs[nature.plus] = minusEVs;
			set.ivs[nature.minus] = plusIVs;
			set.ivs[nature.plus] = minusIVs;
		}
		for (let statName in modStats) {
			let stat = stats[statName];
			modStats[statName] = Math.floor(Math.floor(2 * stat + set.ivs[statName] + Math.floor(set.evs[statName] / 4)) * set.level / 100 + 5);
		}
		if ('hp' in stats) {
			let stat = stats['hp'];
			modStats['hp'] = Math.floor(Math.floor(2 * stat + set.ivs['hp'] + Math.floor(set.evs['hp'] / 4) + 100) * set.level / 100 + 10);
		}
		return this.natureModify(modStats, set.nature);
	},
	natureModify: function (stats, nature) {
		nature = this.getNature(nature);
		if (nature.plus) {
			let stat = stats[nature.minus];
			stats[nature.minus] = stats[nature.plus];
			stats[nature.plus] = Math.floor(stat * 1.1);
		}
		return stats;
	},
};
