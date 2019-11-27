'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	standard: {
		inherit: true,
		ruleset: ['Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
	},
	standarddoubles: {
		inherit: true,
		ruleset: ['Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Abilities Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
	},
};

exports.BattleFormats = BattleFormats;
