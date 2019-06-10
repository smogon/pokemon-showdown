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
	// ACakeWearingAHat
	dunsparce: {
		inherit: true,
		types: ['Normal', 'Ghost'],
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
		// Doubled def, spa, spd and spe
		baseStats: {hp: 62, atk: 44, def: 100, spa: 88, spd: 100, spe: 110},
	},
	// grimAuxiliatrix
	aggronmega: {
		inherit: true,
		abilities: {0: 'Intimidate'},
	},
	// guishark
	sharpedomega: {
		inherit: true,
		abilities: {0: 'gz guishark'},
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
	// OM
	flareon: {
		inherit: true,
		types: ['Fire', 'Fairy'],
	},
	// Overneat
	absolmega: {
		inherit: true,
		abilities: {0: 'Tough Claws'},
		types: ['Dark', 'Fairy'],
	},
	// PokemonDeadChannel
	charizardmegax: {
		inherit: true,
		abilities: {0: 'Moxie'},
	},
	charizardmegay: {
		inherit: true,
		abilities: {0: 'Soul Heart'},
	},
	// pre
	deoxys: {
		inherit: true,
		abilities: {0: 'Optimize'},
	},
	deoxysattack: {
		inherit: true,
		abilities: {0: 'Optimize'},
	},
	deoxysdefense: {
		inherit: true,
		abilities: {0: 'Optimize'},
	},
	deoxysspeed: {
		inherit: true,
		abilities: {0: 'Optimize'},
	},
	// Psynergy
	blazikenmega: {
		inherit: true,
		abilities: {0: 'Wrath'},
	},
	// Rach
	pikachulibre: {
		inherit: true,
		types: ['Electric', 'Fighting'],
	},
	// Saburo
	metagrossmega: {
		inherit: true,
		abilities: {0: 'Levitate'},
	},
	// Sunny
	sceptilemega: {
		inherit: true,
		abilities: {0: 'Contrary'},
	},
};

exports.BattlePokedex = BattlePokedex;
