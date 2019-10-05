'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	allowavs: {
		effectType: 'ValidatorRule',
		name: 'Allow AVs',
		desc: "Tells formats with the 'letsgo' mod to take Awakening Values into consideration when calculating stats",
		// implemented in TeamValidator#validateStats
	},
};

exports.BattleFormats = BattleFormats;
