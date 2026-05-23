/**
 * =========================================================
 * KONIVRER ACTION REGISTRY
 * (REPLACES SHOWDOWN DEX-MOVES)
 * =========================================================
 *
 * Removes:
 * - all embedded move logic
 * - lifecycle hooks
 * - event-driven behavior
 *
 * Replaces with:
 * - pure deterministic action definitions
 */

export type ActionType = "strike" | "surge" | "shift" | "guard";

export interface Move {
	id: string;
	name: string;

	/**
	 * Pure classification only (NO logic)
	 */
	type: ActionType;

	/**
	 * Deterministic balance values
	 */
	stats?: {
		power?: number;
		accuracy?: number;
		priority?: number;
		cooldown?: number;
	};

	/**
	 * Phase tagging ONLY (not execution logic)
	 */
	phaseTags?: {
		guard?: boolean;
		shift?: boolean;
		strike?: boolean;
		surge?: boolean;
	};

	/**
	 * Targeting schema (no execution behavior)
	 */
	targeting?: "single" | "multi" | "self" | "field";
}

/**
 * =========================================================
 * MOVE REGISTRY
 * =========================================================
 */

export const Moves: Record<string, Move> = {

	tackle: {
		id: "tackle",
		name: "Tackle",
		type: "strike",
		stats: {
			power: 40,
			accuracy: 100,
		},
	},

	swords_dance: {
		id: "swords_dance",
		name: "Swords Dance",
		type: "shift",
		stats: {
			priority: 1,
		},
	},

	quick_attack: {
		id: "quick_attack",
		name: "Quick Attack",
		type: "strike",
		stats: {
			power: 40,
			priority: 1,
		},
	},

	protect: {
		id: "protect",
		name: "Protect",
		type: "guard",
		stats: {
			priority: 4,
		},
	},

	earthquake: {
		id: "earthquake",
		name: "Earthquake",
		type: "strike",
		stats: {
			power: 100,
		},
		targeting: "multi",
	},
};

/**
 * =========================================================
 * PURE LOOKUP LAYER
 * =========================================================
 */

export function getMove(id: string): Move | null {
	return Moves[id] ?? null;
}
