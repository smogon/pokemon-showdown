'use strict';

/**@type {{[k: string]: ModdedTemplateData}} */
let BattlePokedex = {
	leafeon: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "near a Moss Rock",
	},
	glaceon: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "near an Ice Rock",
	},
	heatran: {
		inherit: true,
		abilities: {0: "Flash Fire"},
	},
	aegislash: {
		inherit: true,
		baseStats: {hp: 60, atk: 50, def: 150, spa: 50, spd: 150, spe: 60},
	},
	aegislashblade: {
		inherit: true,
		baseStats: {hp: 60, atk: 150, def: 50, spa: 150, spd: 50, spe: 60},
	},
	pumpkaboosmall: {
		inherit: true,
		abilities: {0: "Pickup", 1: "Frisk"},
	},
	pumpkaboolarge: {
		inherit: true,
		abilities: {0: "Pickup", 1: "Frisk"},
	},
	gourgeistsmall: {
		inherit: true,
		abilities: {0: "Pickup", 1: "Frisk"},
	},
	gourgeistlarge: {
		inherit: true,
		abilities: {0: "Pickup", 1: "Frisk"},
	},
	vikavolt: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "near a special magnetic field",
	},
	tapukoko: {
		inherit: true,
		abilities: {0: "Electric Surge"},
	},
	tapulele: {
		inherit: true,
		abilities: {0: "Psychic Surge"},
	},
	tapubulu: {
		inherit: true,
		abilities: {0: "Grassy Surge"},
	},
	tapufini: {
		inherit: true,
		abilities: {0: "Misty Surge"},
	},
};

exports.BattlePokedex = BattlePokedex;
