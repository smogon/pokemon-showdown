/**
 * =========================================================
 * KONIVRER STATE SNAPSHOT MODEL
 * (REPLACES SHOWDOWN STATE.TS)
 * =========================================================
 *
 * Removes:
 * - global mutable battle state
 * - shared memory graph
 * - implicit cross-system coupling
 *
 * Replaces with:
 * - deterministic state snapshots only
 * - no mutation authority
 */

import type { BattleState, SideInput, UnitState } from "./global-types";

/**
 * =========================================================
 * PURE STATE SNAPSHOT
 * =========================================================
 */

export interface StateSnapshot {
	turn: number;

	field: {
		weather?: string | null;
		terrain?: string | null;
	};

	sideA: SideInput;
	sideB: SideInput;
}

/**
 * =========================================================
 * STATE RESOLUTION (NO MUTATION)
 * =========================================================
 */

export function resolveState(input: StateSnapshot): StateSnapshot {
	return {
		turn: input.turn,
		field: input.field,
		sideA: input.sideA,
		sideB: input.sideB,
	};
}
