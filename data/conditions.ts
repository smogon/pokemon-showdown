import { Element } from "./typechart";

/**
 * =========================================================
 * FIELD & REACTION CONDITIONS (REPLACEMENT SYSTEM)
 * =========================================================
 *
 * This replaces Showdown-style volatile battle conditions.
 *
 * Key change:
 * - NO runtime state machine
 * - NO turn-based weather/terrain engine
 * - ONLY deterministic modifiers triggered by actions
 */

export type ConditionCategory =
	| "Field"
	| "Reaction"
	| "Momentum"
	| "Override";

export interface Condition {
	id: string;
	name: string;

	category: ConditionCategory;

	/**
	 * Elemental domain affected by this condition
	 */
	element?: Element;

	/**
	 * Static modifiers applied while condition is active
	 * (not stacked, not layered, always deterministic)
	 */
	modifiers?: {
		damageMultiplier?: number;
		speedModifier?: number;
		defenseModifier?: number;
		healingModifier?: number;
	};

	/**
	 * Trigger rule replaces Showdown event hooks
	 */
	trigger?: "onStrike" | "onSurge" | "onShift" | "onGuard";

	/**
	 * Duration in turns (0 = instantaneous effect only)
	 */
	duration?: number;

	/**
	 * Prevents stacking conditions of same category
	 */
	unique?: boolean;
}

/**
 * =========================================================
 * PRUNED SYSTEM CONDITIONS
 * (Derived from weather/terrain/status ecosystem)
 * =========================================================
 */

export const Conditions: Record<string, Condition> = {

	// =========================
	// FIELD CONDITIONS
	// =========================

	ember_field: {
		id: "ember_field",
		name: "Ember Field",
		category: "Field",
		element: "fire",
		modifiers: {
			damageMultiplier: 1.1,
		},
		trigger: "onStrike",
		duration: 3,
		unique: true,
	},

	tide_field: {
		id: "tide_field",
		name: "Tide Field",
		category: "Field",
		element: "water",
		modifiers: {
			healingModifier: 1.1,
		},
		trigger: "onSurge",
		duration: 3,
		unique: true,
	},

	storm_field: {
		id: "storm_field",
		name: "Storm Field",
		category: "Field",
		element: "air",
		modifiers: {
			speedModifier: 1.1,
		},
		trigger: "onShift",
		duration: 3,
		unique: true,
	},

	stonefield: {
		id: "stonefield",
		name: "Stonefield",
		category: "Field",
		element: "earth",
		modifiers: {
			defenseModifier: 1.15,
		},
		trigger: "onGuard",
		duration: 3,
		unique: true,
	},

	// =========================
	// REACTION CONDITIONS
	// =========================

	overload: {
		id: "overload",
		name: "Elemental Overload",
		category: "Reaction",
		element: "aether",
		modifiers: {
			damageMultiplier: 1.2,
		},
		trigger: "onStrike",
		duration: 0,
	},

	collapse: {
		id: "collapse",
		name: "Void Collapse",
		category: "Reaction",
		element: "nether",
		modifiers: {
			damageMultiplier: 1.15,
			speedModifier: 0.9,
		},
		trigger: "onStrike",
		duration: 0,
	},

	// =========================
	// MOMENTUM CONDITIONS
	// =========================

	rush_state: {
		id: "rush_state",
		name: "Rush State",
		category: "Momentum",
		modifiers: {
			speedModifier: 1.2,
		},
		trigger: "onShift",
		duration: 2,
	},

	bulwark_state: {
		id: "bulwark_state",
		name: "Bulwark State",
		category: "Momentum",
		modifiers: {
			defenseModifier: 1.2,
		},
		trigger: "onGuard",
		duration: 2,
	},
};
