'use strict';

exports.BattleScripts = {
	spreadModify: function (stats, set) {
		const modStats = {atk: 10, def: 10, spa: 10, spd: 10, spe: 10};
		let nature = this.getNature(set.nature);
		for (let statName in modStats) {
			let stat = stats[statName];
			modStats[statName] = Math.floor(Math.floor(2 * stat + (nature.plus && statName === nature.minus ? set.ivs[nature.plus] : set.ivs[statName]) + Math.floor((nature.plus && statName === nature.minus ? set.evs[nature.plus] : set.evs[statName]) / 4)) * set.level / 100 + 5);
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
