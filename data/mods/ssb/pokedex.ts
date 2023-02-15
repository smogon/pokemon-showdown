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
	// mia
	mewtwomegax: {
		inherit: true,
		abilities: {0: 'Hacking'},
	},
};
