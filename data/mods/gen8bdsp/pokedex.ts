export const Pokedex: {[k: string]: ModdedSpeciesData} = {
	eevee: {
		inherit: true,
		evos: ["Vaporeon", "Jolteon", "Flareon", "Espeon", "Umbreon", "Leafeon", "Glaceon"],
	},
	milotic: {
		inherit: true,
		evoType: "other",
		evoCondition: "trade holding Prism Scale or level-up with high Beauty",
	},
	magnezone: {
		inherit: true,
		evoType: "other",
		evoCondition: "Thunder Stone or level-up in a special magnetic field",
	},
	leafeon: {
		inherit: true,
		evoType: "other",
		evoCondition: "Leaf Stone or level-up near a Moss Rock",
	},
	glaceon: {
		inherit: true,
		evoType: "levelExtra",
		evoCondition: "near an Ice Rock",
	},
};
