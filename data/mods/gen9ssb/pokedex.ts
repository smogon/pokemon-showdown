export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	/*
	// Example
	id: {
		inherit: true, // Always use this, makes the pokemon inherit its default values from the parent mod (gen7)
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, // the base stats for the pokemon
	},
	*/
	lunala: {
		inherit: true,
		types: ['Psychic', 'Dark'],
		abilities: {0: "Regenerator"},
	},
	butterfreegmax: {
		inherit: true,
		types: ['Flying'],
		baseStats: {hp: 95, atk: 45, def: 50, spa: 90, spd: 80, spe: 100},
		abilities: {0: "Woven Together, Cohere Forever"},
	},
	meltan: {
		inherit: true,
		abilities: {0: "Augment the Giants"},
	},
	melmetal: {
		inherit: true,
		abilities: {0: "Augment the Giants"},
	},
	gimmighoulroaming: {
		inherit: true,
		types: ['Ghost', 'Electric'],
		baseStats: {hp: 45, atk: 50, def: 45, spa: 75, spd: 45, spe: 80},
		abilities: {0: "Head-On Battery"},
	},
	mismagius: {
		inherit: true,
		types: ['Ghost', 'Dark'],
		abilities: {0: "Vengeful Spirit"},
	},
	yveltal: {
		inherit: true,
		types: ['Dark', 'Fairy'],
		abilities: {0: "Angel of Death"},
	},
};
