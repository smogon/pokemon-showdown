/**
 * Types were different on Gen 1.
 * We had no steel nor dark types and there were a couple of important differences:
 * Bug and Poison were weak to eachother
 * Ice was neutral to fire
 * Psychic was immune to ghost
 */

'use strict';

/**@type {{[k: string]: ModdedTypeData | null}} */
let BattleTypeChart = {
	"Bug": {
		damageTaken: {
			"Bug": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fighting": 2,
			"Fire": 1,
			"Flying": 1,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 2,
			"Ice": 0,
			"Normal": 0,
			"Poison": 1,
			"Psychic": 0,
			"Rock": 1,
			"Water": 0,
		},
	},
	"Fire": {
		damageTaken: {
			"Bug": 2,
			"Dragon": 0,
			"Electric": 0,
			"Fighting": 0,
			"Fire": 2,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 1,
			"Ice": 0,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 1,
			"Water": 1,
		},
	},
	"Ghost": {
		damageTaken: {
			"Bug": 2,
			"Dragon": 0,
			"Electric": 0,
			"Fighting": 3,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 1,
			"Grass": 0,
			"Ground": 0,
			"Ice": 0,
			"Normal": 3,
			"Poison": 2,
			"Psychic": 0,
			"Rock": 0,
			"Water": 0,
		},
	},
	"Ice": {
		damageTaken: {
			"Bug": 0,
			"Dark": 0,
			"Dragon": 0,
			"Electric": 0,
			"Fairy": 0,
			"Fighting": 1,
			"Fire": 1,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 0,
			"Ground": 0,
			"Ice": 2,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 0,
			"Rock": 1,
			"Steel": 1,
			"Water": 0,
		},
	},
	"Poison": {
		damageTaken: {
			psn: 3,
			tox: 3,
			"Bug": 1,
			"Dragon": 0,
			"Electric": 0,
			"Fighting": 2,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 0,
			"Grass": 2,
			"Ground": 1,
			"Ice": 0,
			"Normal": 0,
			"Poison": 2,
			"Psychic": 1,
			"Rock": 0,
			"Water": 0,
		},
	},
	"Psychic": {
		damageTaken: {
			"Bug": 1,
			"Dragon": 0,
			"Electric": 0,
			"Fighting": 2,
			"Fire": 0,
			"Flying": 0,
			"Ghost": 3,
			"Grass": 0,
			"Ground": 0,
			"Ice": 0,
			"Normal": 0,
			"Poison": 0,
			"Psychic": 2,
			"Rock": 0,
			"Water": 0,
		},
	},
	"Dark": null,
	"Steel": null,
};

exports.BattleTypeChart = BattleTypeChart;
