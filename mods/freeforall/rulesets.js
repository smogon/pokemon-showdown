'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
		onChangeSet: function (set, format) {
			let allowAVs = !!(format && this.getRuleTable(format).has('allowavs'));
			let allowCAP = !!(format && this.getRuleTable(format).has('allowcap'));

	allowavs: {
		effectType: 'ValidatorRule',
		name: 'Allow AVs',
		desc: "Tells formats with the 'letsgo' mod to take Awakening Values into consideration when calculating stats",
		onChangeSet: function (set, format) {
			/**@type {string[]} */
			let problems = ([]);
			let avs = this.getAwakeningValues(set);
			if (set.evs) {
				for (let k in set.evs) {
					// @ts-ignore
					avs[k] = set.evs[k];
					// @ts-ignore
					if (typeof avs[k] !== 'number' || avs[k] < 0) {
						// @ts-ignore
						avs[k] = 0;
					}
				}
			}
	},
};

exports.BattleFormats = BattleFormats;
