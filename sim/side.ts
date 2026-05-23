/**
 * =========================================================
 * KONIVRER SIDE STATE SNAPSHOT MODEL
 * (REPLACES SHOWDOWN SIDE.TS)
 * =========================================================
 *
 * Removes:
 * - persistent mutable side state
 * - embedded decision storage
 * - side-based mutation authority
 *
 * Replaces with:
 * - per-turn immutable side snapshot
 */

import type { ID, UnitState, Action } from "./global-types";

/**
 * =========================================================
 * INPUT STATE (PRE-RESOLUTION)
 * =========================================================
 */

export interface SideInput {
	id: ID;

	active: UnitState;

	team: UnitState[];

	/**
	 * Actions declared for this turn (no execution here)
	 */
	actions: Action[];

	/**
	 * Static side modifiers applied during resolution
	 */
	modifiers?: {
		damageMultiplier?: number;
		defenseMultiplier?: number;
		speedMultiplier?: number;
	};

	/**
	 * Team-wide status flags (non-mutating)
	 */
	statusFlags?: {
		reflect?: boolean;
		lightScreen?: boolean;
	};
}

/**
 * =========================================================
 * OUTPUT STATE (POST-RESOLUTION)
 * =========================================================
 */

export interface SideOutput {
	active: UnitState;
	team: UnitState[];
}

/**
 * =========================================================
 * PURE SIDE TRANSFORM
 * =========================================================
 */

export function resolveSide(input: SideInput): SideOutput {
	return {
		active: input.active,
		team: input.team,
	};
}
