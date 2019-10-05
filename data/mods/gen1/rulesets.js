'use strict';

/**@type {{[k: string]: ModdedFormatsData}} */
let BattleFormats = {
	validatemoves: {
		inherit: true,
		banlist: [
			// https://www.smogon.com/forums/threads/implementing-all-old-gens-in-ps-testers-required.3483261/post-5420130
			// confirmed by Marty
			'Kakuna + Poison Sting + Harden', 'Kakuna + String Shot + Harden',
			'Beedrill + Poison Sting + Harden', 'Beedrill + String Shot + Harden',

			// https://www.smogon.com/forums/threads/rby-and-gsc-illegal-movesets.78638/
			'Nidoking + Fury Attack + Thrash',
			'Exeggutor + Poison Powder + Stomp', 'Exeggutor + Sleep Powder + Stomp', 'Exeggutor + Stun Spore + Stomp',
			'Eevee + Tackle + Growl',
			'Vaporeon + Tackle + Growl',
			'Jolteon + Tackle + Growl', 'Jolteon + Focus Energy + Thunder Shock',
			'Flareon + Tackle + Growl', 'Flareon + Focus Energy + Ember',
		],
	},
	standard: {
		effectType: 'ValidatorRule',
		name: 'Standard',
		ruleset: ['Sleep Clause Mod', 'Freeze Clause Mod', 'Species Clause', 'OHKO Clause', 'Evasion Moves Clause', 'HP Percentage Mod', 'Cancel Mod'],
		banlist: ['Dig', 'Fly'],
	},
};

exports.BattleFormats = BattleFormats;
