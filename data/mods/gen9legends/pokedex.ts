export const Pokedex: import('../../../sim/dex-species').ModdedSpeciesDataTable = {
	starmiemega: {
		inherit: true,
		baseStats: { hp: 60, atk: 140, def: 105, spa: 130, spd: 105, spe: 120 },
	},
	mawilemega: {
		inherit: true,
		baseStats: { hp: 50, atk: 147, def: 125, spa: 55, spd: 95, spe: 50 },
	},
	medichammega: {
		inherit: true,
		baseStats: { hp: 60, atk: 140, def: 85, spa: 80, spd: 85, spe: 100 },
	},
	runerigus: {
		inherit: true,
		evoType: "other",
		evoCondition: "Take 49+ damage w/o fainting and stand under a bridge at Coulant Waterway",
	},
	overqwil: {
		inherit: true,
		evoType: "other",
		evoCondition: "Land 20 hits with Barb Barrage",
	},
	annihilape: {
		inherit: true,
		evoLevel: undefined,
		evoType: "other",
		evoCondition: "Land 20 hits with Rage Fist",
	},
};
