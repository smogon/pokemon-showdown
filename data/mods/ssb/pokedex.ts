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

	// Mia
	mewtwomegax: {
		inherit: true,
		abilities: {0: 'Hacking'},
	},
};
