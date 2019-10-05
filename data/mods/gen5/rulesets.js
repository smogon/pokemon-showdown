'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	validatemoves: {
		inherit: true,
		banlist: [
			'Chansey + Charm + Seismic Toss',
			'Blissey + Charm + Seismic Toss',
			'Huntail + Shell Smash + Sucker Punch',
		],
	},
};

exports.BattleFormats = BattleFormats;
