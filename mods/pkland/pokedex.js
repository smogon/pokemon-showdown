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
	// Static
	pikachu: {
		inherit: true,
        baseStats: {hp: 90, atk: 120, def: 90, spa: 120, spd: 90, spe: 140},
	},
// Erika
	eevee: {
		inherit: true,
        baseStats: {hp: 100, atk: 130, def: 100, spa: 130, spd: 100, spe: 130},
	}, 
  	// Aqua
	mew: {
		inherit: true,
   		types: ['Water'],
	},
  	// Mizzy
	wigglytuff: {
		inherit: true,
		types: ['Fairy', 'Psychic'],
        baseStats: {hp: 120, atk: 100, def: 70, spa: 130, spd: 180, spe: 50},
	},
	// Felix
	meowthalola: {
		inherit: true,
        baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	// Abby
	altariamega: {
		inherit: true,
		types: ['Dragon', 'Fairy', 'Water'],
		abilities: {0: 'Liquid Voice'},
        baseStats: {hp: 90, atk: 100, def: 100, spa: 180, spd: 180, spe: 90},
	},
  	// Sedna
	marill: {
		inherit: true,
        baseStats: {hp: 95, atk: 140, def: 110, spa: 140, spd: 110, spe: 140},
	},
	// Sheka
	silvally: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
	},
	arceus: {
		inherit: true,
		abilities: {0: 'Multitype'},
        baseStats: {hp: 130, atk: 130, def: 130, spa: 130, spd: 130, spe: 130},
	},
	// Anabelle
	starmie: {
		inherit: true,
		types: ['Water', 'Psychic', 'Fairy'],
		baseStats: {hp: 130, atk: 85, def: 85, spa: 150, spd: 130, spe: 110},
	},
	// Crystal
	suicune: {
		inherit: true,
		types: ['Water', 'Ice'],
		baseStats: {hp: 150, atk: 100, def: 100, spa: 130, spd: 100, spe: 130},
	},
	// Speedy
	jolteon: {
		inherit: true,
		baseStats: {hp: 95, atk: 170, def: 110, spa: 120, spd: 110, spe: 170},
	},
 	// Gold Ho-Oh
	hooh: {
		inherit: true,
		baseStats: {hp: 100, atk: 150, def: 154, spa: 113, spd: 120, spe: 85},
	},
  	// Zatch
	necrozmaultra: {
		inherit: true,
    abilities: {0: 'Wonder Guard'},
		baseStats: {hp: 240, atk: 240, def: 240, spa: 240, spd: 240, spe: 240},
	},
};

exports.BattlePokedex = BattlePokedex;
