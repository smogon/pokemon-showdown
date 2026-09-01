// Custom Pokémon definitions.

export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	freddy: {
		num: -1,
		name: "Freddy",
		types: ["Ghost", "Ground"],
		baseStats: { hp: 100, atk: 130, def: 75, spa: 75, spd: 87, spe: 55 },
		abilities: { 0: "Unnerve", 1: "Cursed Body", H: "Soundproof" },
		weightkg: 150,
		eggGroups: ["Undiscovered"],
	},
	bonnie: {
		num: -2,
		name: "Bonnie",
		types: ["Ghost", "Normal"],
		baseStats: { hp: 87, atk: 75, def: 75, spa: 100, spd: 55, spe: 130 },
		abilities: { 0: "Unnerve", 1: "Cursed Body", H: "Early Bird" },
		weightkg: 150,
		eggGroups: ["Undiscovered"],
	},
	chica: {
		num: -3,
		name: "Chica",
		types: ["Ghost", "Flying"],
		baseStats: { hp: 55, atk: 75, def: 87, spa: 75, spd: 130, spe: 100 },
		abilities: { 0: "Unnerve", 1: "Cursed Body", H: "Parental Bond" },
		weightkg: 150,
		eggGroups: ["Undiscovered"],
	},
	foxy: {
		num: -4,
		name: "Foxy",
		types: ["Ghost", "Fighting"],
		baseStats: { hp: 130, atk: 100, def: 55, spa: 87, spd: 75, spe: 75 },
		abilities: { 0: "Unnerve", 1: "Cursed Body", H: "Speed Boost" },
		weightkg: 150,
		eggGroups: ["Undiscovered"],
	},
	goldenfreddy: {
		num: -5,
		name: "Golden Freddy",
		types: ["Ghost"],
		baseStats: { hp: 87, atk: 87, def: 87, spa: 87, spd: 87, spe: 87 },
		abilities: { 0: "Unnerve", 1: "Cursed Body", H: "Disguise" },
		weightkg: 20,
		eggGroups: ["Undiscovered"],
	},
};
