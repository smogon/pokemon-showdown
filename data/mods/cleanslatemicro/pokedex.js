'use strict';

/**@type {{[k: string]: ModdedTemplateData}} */
let BattlePokedex = {
	typenull: {
		inherit: true,
		types: ["Normal", "Steel"],
		abilities: {0: "Battle Armor", 1: "Tinted Lens"},
		baseStats: {hp: 70, atk: 120, def: 80, spa: 70, spd: 60, spe: 85},
		evos: undefined,
	},
	crobat: {
		inherit: true,
		types: ["Poison", "Fighting"],
		abilities: {0: "Big Pecks", 1: "Magic Guard"},
		baseStats: {hp: 110, atk: 70, def: 100, spa: 60, spd: 65, spe: 80},
	},
	galvantula: {
		inherit: true,
		abilities: {0: "Static", 1: "Quick Feet", H: "Fluffy"},
		baseStats: {hp: 60, atk: 50, def: 65, spa: 104, spd: 79, spe: 107},
	},
	dugtrioalola: {
		inherit: true,
		abilities: {0: "Sand Force", H: "Intimidate"},
		baseStats: {hp: 55, atk: 90, def: 95, spa: 38, spd: 61, spe: 126},
	},
	rotom: {
		inherit: true,
		abilities: {0: "Prankster", 1: "Levitate", H: "Speed Boost"},
	},
	torterra: {
		inherit: true,
		types: ["Grass", "Dragon"],
		abilities: {0: "Rock Head", H: "Drought"},
		baseStats: {hp: 95, atk: 87, def: 125, spa: 78, spd: 50, spe: 45},
	},
	dragalge: {
		inherit: true,
		abilities: {0: "Poison Point", 1: "Poison Touch", H: "Hydration"},
		baseStats: {hp: 71, atk: 85, def: 90, spa: 87, spd: 123, spe: 44},
	},
	ninetales: {
		inherit: true,
		types: ["Fire", "Fairy"],
		abilities: {0: "Flash Fire", 1: "Limber", H: "Flower Gift"},
		baseStats: {hp: 80, atk: 75, def: 65, spa: 100, spd: 85, spe: 100},
	},
	pupitar: {
		inherit: true,
		abilities: {0: "Shed Skin", H: "Battle Armor"},
		baseStats: {hp: 90, atk: 110, def: 100, spa: 50, spd: 60, spe: 60},
	},
	farfetchd: {
		inherit: true,
		types: ["Fighting", "Flying"],
		abilities: {0: "Defiant", 1: "Sniper", H: "Sap Sipper"},
		baseStats: {hp: 75, atk: 115, def: 85, spa: 45, spd: 55, spe: 95},
	},
	purugly: {
		inherit: true,
		types: ["Dark", "Fairy"],
		abilities: {0: "Cute Charm", H: "Regenerator"},
		baseStats: {hp: 74, atk: 80, def: 84, spa: 59, spd: 84, spe: 119},
	},
	kyurem: {
		inherit: true,
		types: ["Ice"],
		baseStats: {hp: 95, atk: 80, def: 90, spa: 110, spd: 90, spe: 85},
	},
	rotomwash: {
		inherit: true,
		types: ["Water", "Ghost"],
		abilities: {0: "Water Absorb", 1: "Rain Dish", H: "Cursed Body"},
		baseStats: {hp: 50, atk: 50, def: 127, spa: 105, spd: 97, spe: 76},
		inheritsFrom: undefined,
	},
	umbreon: {
		inherit: true,
		types: ["Dark", "Ghost"],
		abilities: {0: "Infiltrator", 1: "Poison Touch", H: "Merciless"},
		baseStats: {hp: 85, atk: 65, def: 75, spa: 75, spd: 115, spe: 65},
	},
	heracross: {
		inherit: true,
		types: ["Bug", "Ghost"],
		abilities: {0: "Poison Heal", 1: "Cursed Body"},
		baseStats: {hp: 75, atk: 95, def: 105, spa: 44, spd: 73, spe: 75},
	},
	magearna: {
		inherit: true,
		abilities: {0: "Clear Body", 1: "Triage", H: "Pure Power"},
		baseStats: {hp: 80, atk: 60, def: 90, spa: 85, spd: 100, spe: 50},
	},
	rotommow: {
		inherit: true,
		types: ["Grass", "Psychic"],
		abilities: {0: "Rough Skin", 1: "Chlorophyll", H: "Steelworker"},
		baseStats: {hp: 50, atk: 105, def: 107, spa: 50, spd: 107, spe: 86},
		inheritsFrom: undefined,
	},
	malamar: {
		inherit: true,
		types: ["Steel", "Psychic"],
		abilities: {0: "Contrary", 1: "Suction Cups", H: "Analytic"},
		baseStats: {hp: 86, atk: 60, def: 78, spa: 100, spd: 75, spe: 73},
	},
	wailord: {
		inherit: true,
		types: ["Water", "Flying"],
		abilities: {0: "Oblivious", 1: "Pressure"},
		baseStats: {hp: 140, atk: 65, def: 70, spa: 88, spd: 82, spe: 55},
	},
};

exports.BattlePokedex = BattlePokedex;
