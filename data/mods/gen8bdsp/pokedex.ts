export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
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
	arceusbug: {
		inherit: true,
		requiredItems: ["Insect Plate"],
	},
	arceusdark: {
		inherit: true,
		requiredItems: ["Dread Plate"],
	},
	arceusdragon: {
		inherit: true,
		requiredItems: ["Draco Plate"],
	},
	arceuselectric: {
		inherit: true,
		requiredItems: ["Zap Plate"],
	},
	arceusfairy: {
		inherit: true,
		requiredItems: ["Pixie Plate"],
		gen: 4,
	},
	arceusfighting: {
		inherit: true,
		requiredItems: ["Fist Plate"],
	},
	arceusfire: {
		inherit: true,
		requiredItems: ["Flame Plate"],
	},
	arceusflying: {
		inherit: true,
		requiredItems: ["Sky Plate"],
	},
	arceusghost: {
		inherit: true,
		requiredItems: ["Spooky Plate"],
	},
	arceusgrass: {
		inherit: true,
		requiredItems: ["Meadow Plate"],
	},
	arceusground: {
		inherit: true,
		requiredItems: ["Earth Plate"],
	},
	arceusice: {
		inherit: true,
		requiredItems: ["Icicle Plate"],
	},
	arceuspoison: {
		inherit: true,
		requiredItems: ["Toxic Plate"],
	},
	arceuspsychic: {
		inherit: true,
		requiredItems: ["Mind Plate"],
	},
	arceusrock: {
		inherit: true,
		requiredItems: ["Stone Plate"],
	},
	arceussteel: {
		inherit: true,
		requiredItems: ["Iron Plate"],
	},
	arceuswater: {
		inherit: true,
		requiredItems: ["Splash Plate"],
	},
};
