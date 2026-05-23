/**
 * =========================================================
 * KONIVRER UNIT IDENTITY SYSTEM
 * (REPLACES SHOWDOWN DEX-SPECIES)
 * =========================================================
 *
 * Removes:
 * - forme system
 * - evolution mutation logic
 * - runtime identity switching
 *
 * Replaces with:
 * - fixed deterministic unit definitions only
 */

export interface Species {
	id: string;
	name: string;

	/**
	 * Fixed elemental identity (NO form switching)
	 */
	types: string[];

	/**
	 * Base combat stats (immutable)
	 */
	baseStats: {
		hp: number;
		atk: number;
		def: number;
		spa: number;
		spd: number;
		spe: number;
	};

	/**
	 * Loadout constraints (not runtime behavior)
	 */
	loadout?: {
		abilitySlots?: string[];
		itemSlots?: string[];
		moveCapacity?: number;
	};

	/**
	 * Strategic classification only
	 */
	archetype?: "bruiser" | "support" | "assassin" | "tank" | "control";
}

/**
 * =========================================================
 * SPECIES REGISTRY
 * =========================================================
 */

export const SpeciesDex: Record<string, Species> = {

	incineroar: {
		id: "incineroar",
		name: "Incineroar",
		types: ["Fire", "Dark"],
		baseStats: {
			hp: 95,
			atk: 115,
			def: 90,
			spa: 80,
			spd: 90,
			spe: 60,
		},
		archetype: "control",
	},

	pikachu: {
		id: "pikachu",
		name: "Pikachu",
		types: ["Electric"],
		baseStats: {
			hp: 35,
			atk: 55,
			def: 40,
			spa: 50,
			spd: 50,
			spe: 90,
		},
		archetype: "assassin",
	},

	kleavor: {
		id: "kleavor",
		name: "Kleavor",
		types: ["Bug", "Rock"],
		baseStats: {
			hp: 70,
			atk: 135,
			def: 95,
			spa: 45,
			spd: 70,
			spe: 85,
		},
		archetype: "bruiser",
	},
};

/**
 * =========================================================
 * PURE LOOKUP LAYER
 * =========================================================
 */

export function getSpecies(id: string): Species | null {
	return SpeciesDex[id] ?? null;
}
