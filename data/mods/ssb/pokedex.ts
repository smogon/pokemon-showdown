export const Pokedex: {[k: string]: ModdedSpeciesData} = {
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
		baseStats: {hp: 57, atk: 90, def: 95, spa: 75, spd: 103, spe: 29},
	},

	// A Quag To The Past
	quagsire: {
		inherit: true,
		baseStats: {hp: 130, atk: 100, def: 75, spa: 20, spd: 60, spe: 45},
		abilities: {0: "Quag of Ruin"},
	},
	clodsire: {
		inherit: true,
		baseStats: {hp: 130, atk: 60, def: 75, spa: 40, spd: 100, spe: 20},
		abilities: {0: "Clod of Ruin"},
	},

	// Kennedy
	cinderace: {
		inherit: true,
		otherFormes: ["Cinderace-Gmax"],
	},
	cinderacegmax: {
		inherit: true,
		types: ["Fire", "Ice"],
		baseStats: {hp: 84, atk: 119, def: 78, spa: 77, spd: 81, spe: 105},
		abilities: {0: "You'll Never Walk Alone"},
		weightkg: 103,
	},

	// Kolochu
	pikachu: {
		inherit: true,
		baseStats: {hp: 45, atk: 80, def: 50, spa: 75, spd: 60, spe: 120},
	},

	// Kris
	nymble: {
		inherit: true,
		baseStats: {hp: 110, atk: 200, def: 99, spa: 101, spd: 99, spe: 35},
		abilities: {0: "Cacophony"},
	},

	// Mia
	mewtwomegax: {
		inherit: true,
		abilities: {0: 'Hacking'},
	},

	// sharp_claw
	sneasel: {
		inherit: true,
		baseStats: {hp: 55, atk: 105, def: 95, spa: 35, spd: 95, spe: 135},
		abilities: {0: 'Rough and Tumble'},
	},
	sneaselhisui: {
		inherit: true,
		baseStats: {hp: 55, atk: 135, def: 75, spa: 35, spd: 85, spe: 135},
		abilities: {0: 'Rough and Tumble'},
	},
};
