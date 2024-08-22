export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	/*
	// Example
	id: {
		inherit: true, // Always use this, makes the pokemon inherit its default values from the parent mod (gen7)
		baseStats: {hp: 100, atk: 100, def: 100, spa: 100, spd: 100, spe: 100}, // the base stats for the pokemon
	},
	*/
	stonjourner: {
		inherit: true,
		abilities: {0: "Love of the Journey"},
		types: ['Rock', 'Grass'],
		baseStats: {hp: 100, atk: 125, def: 135, spa: 50, spd: 50, spe: 70},
	},
	venomicon: {
		inherit: true,
		abilities: {0: "Vociferous Codex"},
		types: ['Poison', 'Steel'],
	},
	aipom: {
		inherit: true,
		abilities: {0: "Nutcracker"},
		baseStats: {hp: 55, atk: 70, def: 80, spa: 40, spd: 80, spe: 110},
	},
	ironthorns: {
		inherit: true,
		types: ['Steel'],
		abilities: {0: "Auto Repair"},
		baseStats: {hp: 81, atk: 120, def: 75, spa: 120, spd: 75, spe: 99},
	},
	necrozmaultra: {
		inherit: true,
		types: ['Light'],
	},
	poliwhirl: {
		inherit: true,
		abilities: {0: "Lost and Found"},
		types: ['Water', 'Normal'],
	},
	pikachu: {
		inherit: true,
		abilities: {0: "Force of Will"},
	},
	pikachulibre: {
		inherit: true,
		types: ['Electric', 'Fighting'],
		abilities: {0: "Force of Will"},
	},
	zapdos: {
		inherit: true,
		abilities: {0: "Peal of Thunder"},
	},
	mimikyu: {
		inherit: true,
		baseStats: {hp: 75, atk: 90, def: 80, spa: 105, spd: 105, spe: 96},
		abilities: {0: "Dollkeeper"},
	},
	mimikyubusted: {
		inherit: true,
		baseStats: {hp: 75, atk: 90, def: 105, spa: 50, spd: 105, spe: 96},
		abilities: {0: "Dollkeeper"},
	},
	kecleon: {
		inherit: true,
		abilities: {0: "Quick Camo"},
	},
	smokomodo: {
		inherit: true,
		baseStats: {hp: 98, atk: 116, def: 77, spa: 88, spd: 78, spe: 97},
		abilities: {0: "Praetor's Grasp"},
	},
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
		baseStats: {hp: 45, atk: 75, def: 65, spa: 50, spd: 45, spe: 80},
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
