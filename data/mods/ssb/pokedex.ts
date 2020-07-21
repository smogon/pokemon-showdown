export const BattlePokedex: {[k: string]: ModdedSpeciesData} = {
	/*
	// Example
	id: {
		inherit: true, // Always use this, makes the pokemon inherit its default values from the parent mod (gen7)
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, // the base stats for the pokemon
	},
	*/
	// Aeonic
	nosepass: {
		inherit: true,
		baseStats: {hp: 70, atk: 85, def: 135, spa: 45, spd: 90, spe: 70},
	},
	// Aethernum
	lotad: {
		inherit: true,
		baseStats: {hp: 40, atk: 70, def: 70, spa: 80, spd: 90, spe: 70},
	},
	// a random duck
	ducklett: {
		inherit: true,
		baseStats: {hp: 62, atk: 88, def: 100, spa: 44, spd: 100, spe: 110},
	},
	// Elgino
	celebi: {
		inherit: true,
		types: ['Grass', 'Fairy'],
	},
	// Felucia
	uxie: {
		inherit: true,
		types: ["Psychic", "Normal"],
	},
	// Frostyicelad
	frosmoth: {
		inherit: true,
		otherFormes: ["Frosmoth-Mega"],
		formeOrder: ["Frosmoth", "Frosmoth-Mega"],
	},
	frosmothmega: {
		num: 873,
		name: "Frosmoth-Mega",
		baseSpecies: "Frosmoth",
		forme: "Mega",
		types: ["Ice", "Bug"],
		baseStats: {hp: 70, atk: 75, def: 100, spa: 130, spd: 100, spe: 100},
		abilities: {0: "Punk Rock"},
		heightm: 1.3,
		weightkg: 42,
		color: "White",
		eggGroups: ["Bug"],
		requiredItem: "Ice Stone",
	},
	// Kaiju Bunny
	lopunnymega: {
		inherit: true,
		abilities: {0: 'Second Wind'},
		types: ['Normal', 'Fairy'],
	},
	// Kris
	unown: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100},
		// For reverting back to an Unown forme
		abilities: {0: 'Protean'},
	},
	// Morfent
	banette: {
		inherit: true,
		types: ["Ghost", "Normal"],
	},
	// OM~!
	magneton: {
		inherit: true,
		types: ['Electric', 'Steel', 'Flying'],
	},
	// Overneat
	absolmega: {
		inherit: true,
		abilities: {0: 'Darkest Wings'},
		types: ['Dark', 'Fairy'],
	},
	// Perish Song
	mismagius: {
		inherit: true,
		types: ["Ghost", "Ice"],
	},
	// quadrophenic
	porygon: {
		inherit: true,
		baseStats: {hp: 85, atk: 80, def: 90, spa: 105, spd: 95, spe: 60},
	},
	// Robb576
	necrozmadawnwings: {
		inherit: true,
		abilities: {0: "The Numbers Game"},
	},
	necrozmaduskmane: {
		inherit: true,
		abilities: {0: "The Numbers Game"},
	},
	necrozmaultra: {
		inherit: true,
		abilities: {0: "The Numbers Game"},
	},
	// Sunny
	charizardmegax: {
		inherit: true,
		abilities: {0: "One For All"},
	},
	// yuki
	pikachucosplay: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "Combat Training"},
	},
	pikachuphd: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "Triage"},
	},
	pikachulibre: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "White Smoke"},
	},
	pikachupopstar: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "Dancer"},
	},
	pikachurockstar: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "Punk Rock"},
	},
	pikachubelle: {
		inherit: true,
		baseStats: {hp: 60, atk: 85, def: 50, spa: 95, spd: 85, spe: 110},
		abilities: {0: "Tangled Feet"},
	},
	// Zalm
	weedle: {
		inherit: true,
		baseStats: {hp: 100, atk: 35, def: 100, spa: 90, spd: 90, spe: 100},
	},
	// Zarel
	meloetta: {
		inherit: true,
		abilities: {0: "Dancer"},
	},
	meloettapirouette: {
		inherit: true,
		abilities: {0: "Serene Grace"},
	},
};
