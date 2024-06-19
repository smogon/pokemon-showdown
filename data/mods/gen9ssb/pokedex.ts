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
	},
	miniorviolet: {
		inherit: true,
		types: ['Rock', 'Ghost'],
		abilities: {0: "Chimeraplex"},
		baseStats: {hp: 100, atk: 100, def: 60, spa: 100, spd: 60, spe: 120},
	},
	miniorindigo: {
		inherit: true,
		types: ['Rock', 'Water'],
		abilities: {0: "Chimeraplex"},
		baseStats: {hp: 120, atk: 80, def: 60, spa: 100, spd: 60, spe: 120},
	},
	miniorgreen: {
		inherit: true,
		types: ['Rock', 'Grass'],
		abilities: {0: "Chimeraplex"},
		baseStats: {hp: 100, atk: 80, def: 60, spa: 120, spd: 80, spe: 100},
	},
	miniorblue: {
		inherit: true,
		types: ['Rock', 'Ice'],
		abilities: {0: "Chimeraplex"},
		baseStats: {hp: 100, atk: 80, def: 80, spa: 100, spd: 60, spe: 120},
	},
	minioryellow: {
		inherit: true,
		types: ['Rock', 'Electric'],
		abilities: {0: "Chimeraplex"},
		baseStats: {hp: 80, atk: 100, def: 60, spa: 100, spd: 60, spe: 140},
	},
	miniororange: {
		inherit: true,
		types: ['Rock', 'Ground'],
		abilities: {0: "Chimeraplex"},
		baseStats: {hp: 100, atk: 100, def: 80, spa: 80, spd: 80, spe: 100},
	},
	miniorred: {
		inherit: true,
		types: ['Rock', 'Fire'],
		abilities: {0: "Chimeraplex"},
		baseStats: {hp: 100, atk: 120, def: 40, spa: 120, spd: 40, spe: 120},
	},
	miniormeteor: {
		inherit: true,
		abilities: {0: "Chimeraplex"},
	},
	minior: {
		inherit: true,
		abilities: {0: "Chimeraplex"},
	},
};
