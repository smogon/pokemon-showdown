'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	standard: {
		inherit: true,
		ruleset: ['Obtainable', 'Team Preview', 'Sleep Clause Mod', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		minSourceGen: 0, // auto
	},
	standarddoubles: {
		inherit: true,
		ruleset: ['Obtainable', 'Team Preview', 'Species Clause', 'Nickname Clause', 'OHKO Clause', 'Moody Clause', 'Evasion Abilities Clause', 'Evasion Moves Clause', 'Endless Battle Clause', 'HP Percentage Mod', 'Cancel Mod'],
		minSourceGen: 0, // auto
	},
	obtainablemoves: {
		inherit: true,
		banlist: [
			// Leaf Blade: Gen 6+ Nuzleaf level-up
			// Sucker Punch: Gen 4 Shiftry tutor
			'Shiftry + Leaf Blade + Sucker Punch',
		],
	},
};

exports.BattleFormats = BattleFormats;
