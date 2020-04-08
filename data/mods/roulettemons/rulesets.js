'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	standardpetmod: {
		inherit: true,
		ruleset: ['Standard NatDex', 'Dynamax Clause', 'Sleep Clause Mod', 'Species Clause', 'Moody Clause', 'Evasion Moves Clause', 'Swagger Clause', 'Baton Pass Clause', 'OHKO Clause'],
		banlist: ['All Pokemon'],
	},
};

exports.BattleFormats = BattleFormats;
