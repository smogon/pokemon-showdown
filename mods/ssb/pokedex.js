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
	// Andy
	absolmega: {
		inherit: true,
		abilities: {0: "Adaptability"},
	},
	// Arrested
	blastoisemega: {
		inherit: true,
		abilities: {0: "Shell Shocker"},
	},
	// Bhris Brown
	swampertmega: {
		inherit: true,
		abilities: {0: "Stimulated Pride"},
	},
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
	// eternally
	ducklett: {
		inherit: true,
		// Doubled spa and spe
		baseStats: {hp: 62, atk: 44, def: 50, spa: 88, spd: 50, spe: 110},
	},
	// grimAuxiliatrix
	aggronmega: {
		inherit: true,
		abilities: {0: 'Intimidate'},
	},
	// Kaiju Bunny
	gliscor: {
		inherit: true,
		abilities: {0: 'Poison Heal'}, 	// Ability change is permanent
	},
	// Level 51
	porygon2: {
		inherit: true,
		abilities: {0: 'Stamina'},
	},
	// Lionyx
	gardevoirmega: {
		inherit: true,
		abilities: {0: 'Frozen Skin'},
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
	// Morfent
	banettemega: {
		inherit: true,
		abilities: {0: 'Comatose'},
	},
	// Psynergy
	blazikenmega: {
		inherit: true,
		abilities: {0: 'Wrath'},
	},
	// Saburo
	metagrossmega: {
		inherit: true,
		abilities: {0: 'Levitate'},
	},
	// Teclis
	gallademega: {
		inherit: true,
		abilities: {0: 'Natural Cure'},
	},
};

exports.BattlePokedex = BattlePokedex;
