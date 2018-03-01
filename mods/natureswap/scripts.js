'use strict';

exports.BattleScripts = {
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
