export const BattleMovedex: {[k: string]: ModdedMoveData} = {
	coppermines: {
		num: -1000,
		accuracy: true,
		basePower: 0,
		category: "Status",
		desc: "Sets up a hazard on the opposing side of the field, damaging each opposing Pokemon that switches in. Foes lose 1/32, 1/16, 1/8, 1/4, or 1/2 of their maximum HP, rounded down, based on their weakness to the Steel type; 0.25x, 0.5x, neutral, 2x, or 4x, respectively. Can be removed from the opposing side if any opposing Pokemon uses Rapid Spin or Defog successfully, or is hit by Defog.",
		shortDesc: "Hurts foes on switch-in. Factors Steel weakness.",
		name: "Copper Mines",
		pp: 20,
		priority: 0,
		flags: {reflectable: 1},
		sideCondition: 'gmaxsteelsurge',
		secondary: null,
		target: "foeSide",
		type: "Steel",
	},
	magmastorm: {
		inherit: true,
		isNonstandard: null,
	},
	pikapapow: {
		inherit: true,
		isNonstandard: null,
	},
	sappyseed: {
		inherit: true,
		isNonstandard: null,
	},
	sizzlyslide: {
		inherit: true,
		isNonstandard: null,
	},
	zippyzap: {
		inherit: true,
		isNonstandard: null,
	},
};
