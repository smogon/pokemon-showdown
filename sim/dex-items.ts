/**
 * =========================================================
 * KONIVRER ITEM DOCTRINE SYSTEM
 * (REPLACES SHOWDOWN DEX-ITEMS)
 * =========================================================
 *
 * Removes:
 * - runtime item hooks
 * - battle event integration
 * - lifecycle-triggered effects
 *
 * Replaces with:
 * - static deterministic modifiers only
 */

export interface Item {
	id: string;
	name: string;

	/**
	 * Passive combat modifiers applied during phase resolution
	 */
	modifiers?: {
		damageMultiplier?: number;
		defenseMultiplier?: number;
		speedMultiplier?: number;
		healingMultiplier?: number;
	};

	/**
	 * Phase activation windows (NOT triggers)
	 */
	phaseTags?: {
		guard?: boolean;
		shift?: boolean;
		strike?: boolean;
		surge?: boolean;
	};

	/**
	 * Structural constraints (non-runtime)
	 */
	constraints?: {
		consumable?: boolean;
		unique?: boolean;
		onePerTeam?: boolean;
	};
}

/**
 * =========================================================
 * ITEM REGISTRY
 * =========================================================
 */

export const Items: Record<string, Item> = {

	choice_band: {
		id: "choice_band",
		name: "Choice Band",
		modifiers: {
			damageMultiplier: 1.5,
		},
	},

	leftovers: {
		id: "leftovers",
		name: "Leftovers",
		modifiers: {
			healingMultiplier: 0.05,
		},
		phaseTags: {
			surge: true,
		},
	},

	life_orb: {
		id: "life_orb",
		name: "Life Orb",
		modifiers: {
			damageMultiplier: 1.3,
		},
	},

	heavy_duty_boots: {
		id: "heavy_duty_boots",
		name: "Heavy-Duty Boots",
		constraints: {
			unique: true,
		},
	},
};

/**
 * =========================================================
 * PURE LOOKUP LAYER
 * =========================================================
 */

export function getItem(id: string): Item | null {
	return Items[id] ?? null;
}
