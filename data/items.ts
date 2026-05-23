import { Element } from "./typechart";

/**
 * =========================================================
 * DOCTRINE EQUIPMENT SYSTEM (REPLACES SHOWDOWN ITEMS)
 * =========================================================
 *
 * Items are static modifiers applied at unit assembly.
 * No runtime hooks. No conditional triggers.
 */

export interface Item {
	id: string;
	name: string;

	/**
	 * Passive stat modifiers (flat system)
	 */
	stats?: {
		hp?: number;
		attack?: number;
		defense?: number;
		speed?: number;
	};

	/**
	 * Elemental bias reinforcement
	 */
	elementBias?: Partial<Record<Element, number>>;

	/**
	 * Action category amplification
	 */
	actionBoost?: {
		strike?: number;
		surge?: number;
		shift?: number;
		guard?: number;
	};

	/**
	 * Strategic classification
	 */
	tag?: "offensive" | "defensive" | "utility" | "tempo";
}

/**
 * =========================================================
 * PRUNED COMPETITIVE ITEM POOL
 * =========================================================
 */

export const Items: Record<string, Item> = {

	// =========================
	// OFFENSIVE ITEMS
	// =========================

	life_orb_core: {
		id: "life_orb_core",
		name: "Reactor Core",
		stats: {
			attack: 10,
			speed: 5,
		},
		actionBoost: {
			strike: 1.1,
		},
		tag: "offensive",
	},

	choice_band_core: {
		id: "choice_band_core",
		name: "Locked Arsenal Band",
		stats: {
			attack: 15,
		},
		actionBoost: {
			strike: 1.2,
		},
		tag: "offensive",
	},

	// =========================
	// DEFENSIVE ITEMS
	// =========================

	assault_vest_core: {
		id: "assault_vest_core",
		name: "Kinetic Barrier Vest",
		stats: {
			hp: 20,
			defense: 10,
		},
		actionBoost: {
			guard: 1.15,
		},
		tag: "defensive",
	},

	eviolite_core: {
		id: "eviolite_core",
		name: "Stabilization Matrix",
		stats: {
			defense: 20,
		},
		tag: "defensive",
	},

	// =========================
	// TEMPO ITEMS
	// =========================

	choice_scarf_core: {
		id: "choice_scarf_core",
		name: "Phase Accelerator Band",
		stats: {
			speed: 20,
		},
		actionBoost: {
			shift: 1.2,
		},
		tag: "tempo",
	},

	boots_core: {
		id: "boots_core",
		name: "Adaptive Mobility Rig",
		stats: {
			speed: 10,
		},
		tag: "tempo",
	},

	// =========================
	// UTILITY ITEMS
	// =========================

	leftovers_core: {
		id: "leftovers_core",
		name: "Regeneration Module",
		stats: {
			hp: 10,
		},
		actionBoost: {
			guard: 1.05,
		},
		tag: "utility",
	},
};
