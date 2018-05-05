'use strict';

/**@type {{[k: string]: ModdedTemplateData}} */
let BattlePokedex = {
	genesectdouse: {
		inherit: true,
		types: ["Bug", "Water"],
	},
	genesectshock: {
		inherit: true,
		types: ["Bug", "Electric"],
	},
	genesectburn: {
		inherit: true,
		types: ["Bug", "Fire"],
	},
	genesectchill: {
		inherit: true,
		types: ["Bug", "Ice"],
	},
};

exports.BattlePokedex = BattlePokedex;
