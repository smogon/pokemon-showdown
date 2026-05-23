/**
 * =========================================================
 * KONIVRER STATIC CONDITION SYSTEM
 * (REPLACES SHOWDOWN DEX-CONDITIONS)
 * =========================================================
 *
 * Removes:
 * - per-turn event triggers
 * - reactive status systems
 * - battlefield rule mutation
 *
 * Replaces with:
 * - deterministic condition flags
 * - phase-based evaluation modifiers
 */

export type ConditionType =
	| "status"
	| "field"
	| "volatile"
	| "environment";

export interface Condition {
	id: string;
	name: string;
	type: ConditionType;

	/**
	 * Deterministic modifiers applied during phase resolution
	 */
	modifiers?: {
		damageOverTime?: number;
		damageMultiplier?: number;
		speedMultiplier?: number;
		actionRestriction?: "skip" | "forceShift" | "none";
	};

	/**
	 * Phase-based effects (NOT runtime triggers)
	 */
	phaseEffects?: {
		guard?: boolean;
		shift?: boolean;
		strike?: boolean;
		surge?: boolean;
	};

	/**
	 * Static battlefield rule overrides (evaluated once per phase)
	 */
	fieldRules?: {
		invertSpeed?: boolean;
		disableActions?: boolean;
		blockTargeting?: boolean;
	};
}

/**
 * =========================================================
 * CORE CONDITION REGISTRY
 * =========================================================
 */

export const Conditions: Record<string, Condition> = {

	burn: {
		id: "burn",
		name: "Burn",
		type: "status",
		modifiers: {
			damageOverTime: 0.1,
			damageMultiplier: 0.5,
		},
	},

	poison: {
		id: "poison",
		name: "Poison",
		type: "status",
		modifiers: {
			damageOverTime: 0.12,
		},
	},

	paralysis: {
		id: "paralysis",
		name: "Paralysis",
		type: "status",
		modifiers: {
			speedMultiplier: 0.5,
		},
	},

	sleep: {
		id: "sleep",
		name: "Sleep",
		type: "volatile",
		modifiers: {
			actionRestriction: "skip",
		},
	},

	trick_room: {
		id: "trick_room",
		name: "Trick Room",
		type: "field",
		fieldRules: {
			invertSpeed: true,
		},
	},

	wonder_room: {
		id: "wonder_room",
		name: "Wonder Room",
		type: "field",
	},
};

/**
 * =========================================================
 * PURE RESOLUTION LAYER
 * =========================================================
 */

export function getCondition(id: string): Condition | null {
	return Conditions[id] ?? null;
}
