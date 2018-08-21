'use strict';

/**@type {{[k: string]: ModdedTemplateData}} */
let BattlePokedex = {
	/*
	// Example
	speciesid: {
		inherit: true, // Always use this, makes the pokemon inherit its default values from the parent mod (gen7)
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, // the base stats for the pokemon
	},
	*/
	// deg
	gengarmega: {
		inherit: true,
		abilities: {0: "Bad Dreams"},
	},
	// E4 Flint
	steelixmega: {
		inherit: true,
		abilities: {0: 'Stark Mountain'},
		types: ['Steel', 'Ground', 'Fire'],
	},
	// MacChaeger
	mantyke: {
		inherit: true,
		baseStats: {hp: 90, atk: 40, def: 100, spa: 120, spd: 240, spe: 100},
	},
	// martha
	dianciemega: {
		inherit: true,
		abilities: {0: 'Pixilate'},
	},
};

exports.BattlePokedex = BattlePokedex;
