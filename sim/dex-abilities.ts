/**
 * =========================================================
 * KONIVRER DOCTRINE ABILITY REGISTRY
 * (REPLACES SHOWDOWN DEX-ABILITIES)
 * =========================================================
 *
 * Removes all runtime hooks.
 * Converts abilities into deterministic modifiers only.
 */

export interface DoctrineAbility {
	id: string;
	name: string;

	/**
	 * Passive combat modifiers applied at resolution time
	 */
	modifiers?: {
		damageMultiplier?: number;
		defenseMultiplier?: number;
		speedModifier?: number;
		elementBias?: Partial<Record<string, number>>;
	};

	/**
	 * Phase gating effects (NOT event triggers)
	 */
	phaseEffects?: {
		guard?: boolean;
		shift?: boolean;
		strike?: boolean;
		surge?: boolean;
	};

	/**
	 * Static battlefield rules this ability enforces
	 */
	fieldRules?: {
		preventTargeting?: boolean;
		damageReduction?: number;
	};
}

/**
 * =========================================================
 * ABILITY REGISTRY
 * =========================================================
 */

export const Abilities: Record<string, DoctrineAbility> = {

	intimidate: {
		id: "intimidate",
		name: "Intimidate",
		modifiers: {
			damageMultiplier: 0.9,
		},
	},

	levitate: {
		id: "levitate",
		name: "Levitate",
		fieldRules: {
			preventTargeting: true,
		},
	},

	adaptability: {
		id: "adaptability",
		name: "Adaptability",
		modifiers: {
			damageMultiplier: 1.2,
		},
	},

	regenerator: {
		id: "regenerator",
		name: "Regenerator",
		phaseEffects: {
			shift: true, // interpreted as end-phase recovery window
		},
	},
};

/**
 * =========================================================
 * RESOLUTION LAYER (PURE FUNCTIONAL)
 * =========================================================
 */

export function getAbility(id: string): DoctrineAbility | null {
	return Abilities[id] ?? null;
}
