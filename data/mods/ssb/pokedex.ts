export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	/*
	// Example
	id: {
		inherit: true, // Always use this, makes the pokemon inherit its default values from the parent mod (gen7)
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, // the base stats for the pokemon
	},
	*/
	// El Capitan
	zygarde10: {
		inherit: true,
		baseStats: {hp: 100, atk: 100, def: 80, spa: 80, spd: 70, spe: 115},
	},
	// Genwunner
	alakazam: {
		inherit: true,
		baseStats: {hp: 55, atk: 50, def: 45, spa: 135, spd: 135, spe: 120},
	},
	// Minimind
	clefable: {
		inherit: true,
		baseStats: {hp: 95, atk: 95, def: 73, spa: 95, spd: 90, spe: 60},
	},
};
