'use strict';

/**@type {{[k: string]: ModdedTemplateData}} */
let BattlePokedex = {
	charizard: {
		inherit: true,
		otherFormes: ["charizardmegax", "charizardmegay"],
	},
	butterfree: {
		inherit: true,
		otherFormes: undefined,
	},
	pikachu: {
		inherit: true,
		otherFormes: ["pikachucosplay", "pikachurockstar", "pikachubelle", "pikachupopstar", "pikachuphd", "pikachulibre", "pikachuoriginal", "pikachuhoenn", "pikachusinnoh", "pikachuunova", "pikachukalos", "pikachualola", "pikachupartner", "pikachustarter"],
	},
	pikachuoriginal: {
		inherit: true,
		abilities: {0: "Static"},
	},
	pikachuhoenn: {
		inherit: true,
		abilities: {0: "Static"},
	},
	pikachusinnoh: {
		inherit: true,
		abilities: {0: "Static"},
	},
	pikachuunova: {
		inherit: true,
		abilities: {0: "Static"},
	},
	pikachukalos: {
		inherit: true,
		abilities: {0: "Static"},
	},
	pikachualola: {
		inherit: true,
		abilities: {0: "Static"},
	},
	pikachupartner: {
		inherit: true,
		abilities: {0: "Static"},
	},
	meowth: {
		inherit: true,
		otherFormes: ["meowthalola"],
	},
	machamp: {
		inherit: true,
		otherFormes: undefined,
	},
	gengar: {
		inherit: true,
		otherFormes: ['gengarmega'],
	},
	kingler: {
		inherit: true,
		otherFormes: undefined,
	},
	koffing: {
		inherit: true,
		abilities: {0: "Levitate"},
	},
	weezing: {
		inherit: true,
		abilities: {0: "Levitate"},
	},
	lapras: {
		inherit: true,
		otherFormes: undefined,
	},
	eevee: {
		inherit: true,
		otherFormes: ['eeveestarter'],
	},
	snorlax: {
		inherit: true,
		otherFormes: undefined,
	},
	ralts: {
		inherit: true,
		eggGroups: ["Amorphous"],
	},
	kirlia: {
		inherit: true,
		eggGroups: ["Amorphous"],
	},
	gardevoir: {
		inherit: true,
		eggGroups: ["Amorphous"],
	},
	trapinch: {
		inherit: true,
		eggGroups: ["Bug"],
	},
	vibrava: {
		inherit: true,
		eggGroups: ["Bug"],
	},
	flygon: {
		inherit: true,
		eggGroups: ["Bug"],
	},
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
	gallade: {
		inherit: true,
		eggGroups: ["Amorphous"],
	},
	heatran: {
		inherit: true,
		abilities: {0: "Flash Fire"},
	},
	garbodor: {
		inherit: true,
		otherFormes: undefined,
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
	hawlucha: {
		inherit: true,
		eggGroups: ["Human-Like"],
	},
	bergmite: {
		inherit: true,
		eggGroups: ["Monster"],
	},
	avalugg: {
		inherit: true,
		eggGroups: ["Monster"],
	},
	noibat: {
		inherit: true,
		eggGroups: ["Flying"],
	},
	noivern: {
		inherit: true,
		eggGroups: ["Flying"],
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
	melmetal: {
		inherit: true,
		otherFormes: undefined,
	},
};

exports.BattlePokedex = BattlePokedex;
