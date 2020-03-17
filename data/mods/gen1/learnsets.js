'use strict';

/** @type {{[k: string]: ModdedLearnsetsData}} */
let BattleLearnsets = {
	fearow: {
		inherit: true,
		eventData: [
			{"generation": 1, "level": 20, "moves": ["growl", "leer", "furyattack", "payday"]},
		],
	},
	pikachu: {
		inherit: true,
		eventData: [
			{"generation": 1, "level": 5, "moves": ["surf"]},
			{"generation": 1, "level": 5, "moves": ["fly"]},
			{"generation": 1, "level": 5, "moves": ["thundershock", "growl", "surf"]},
		],
	},
	psyduck: {
		inherit: true,
		eventData: [
			{"generation": 1, "level": 15, "moves": ["scratch", "amnesia"]},
		],
	},
	rapidash: {
		inherit: true,
		eventData: [
			{"generation": 1, "level": 40, "moves": ["ember", "firespin", "stomp", "payday"]},
		],
	},
	magikarp: {
		inherit: true,
		eventData: [
			{"generation": 1, "level": 5, "moves": ["dragonrage"]},
		],
	},
	mew: {
		inherit: true,
		eventData: [
			{"generation": 1, "level": 5, "moves": ["pound"]},
		],
		eventOnly: true,
	},
};

exports.BattleLearnsets = BattleLearnsets;
