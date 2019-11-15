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
	aegislash: {
		inherit: true,
		baseStats: {hp: 60, atk: 50, def: 150, spa: 50, spd: 150, spe: 60},
	},
	aegislashblade: {
		inherit: true,
		baseStats: {hp: 60, atk: 150, def: 50, spa: 150, spd: 50, spe: 60},
	},
	vikavolt: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "near a special magnetic field",
	},
};

exports.BattlePokedex = BattlePokedex;
