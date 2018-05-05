'use strict';

/**@type {{[k: string]: ModdedTypeData}} */
let BattleTypeChart = {
	"Dark": {
		inherit: true,
		damageTaken: {
			"Bug": 1,
			"Dark": 2,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 1,
			"Fighting": 1,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 2,
			"Grass": 0,
			"Ground": 0,
			"Ice": 0,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 3,
			"Rock": 0,
			"Steel": 0,
			"Water": 0,
		},
	},
};

exports.BattleTypeChart = BattleTypeChart;
