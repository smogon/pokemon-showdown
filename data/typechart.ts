export type Element =
	| "fire"
	| "water"
	| "air"
	| "earth"
	| "aether"
	| "nether";

export type DamageRelation = 0 | 1;

export interface ElementData {
	damageTaken: Record<Element, DamageRelation>;
}

export const TypeChart: Record<Element, ElementData> = {
	fire: {
		damageTaken: {
			fire: 0,
			water: 1,
			air: 0,
			earth: 0,
			aether: 0,
			nether: 0,
		},
	},

	water: {
		damageTaken: {
			fire: 0,
			water: 0,
			air: 0,
			earth: 1,
			aether: 0,
			nether: 0,
		},
	},

	air: {
		damageTaken: {
			fire: 0,
			water: 0,
			air: 0,
			earth: 1,
			aether: 0,
			nether: 0,
		},
	},

	earth: {
		damageTaken: {
			fire: 1,
			water: 0,
			air: 0,
			earth: 0,
			aether: 0,
			nether: 0,
		},
	},

	aether: {
		damageTaken: {
			fire: 0,
			water: 0,
			air: 0,
			earth: 0,
			aether: 0,
			nether: 1,
		},
	},

	nether: {
		damageTaken: {
			fire: 0,
			water: 0,
			air: 0,
			earth: 0,
			aether: 1,
			nether: 0,
		},
	},
};
