'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	obtainablemoves: {
		inherit: true,
		banlist: [
			// Shell Smash: Clamperl Gen 5+ level-up
			// Sucker Punch: Huntail Gen 4 tutor
			'Huntail + Shell Smash + Sucker Punch',
		],
	},
};

exports.BattleFormats = BattleFormats;
