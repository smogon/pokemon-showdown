/**
 * =========================================================
 * KONIVRER BATTLEFIELD STATE VECTOR
 * (REPLACES SHOWDOWN FIELD.TS)
 * =========================================================
 *
 * Removes:
 * - runtime field mutation system
 * - event-driven field effects
 * - duration-based state machines
 *
 * Replaces with:
 * - deterministic field state snapshot
 * - phase-based evaluation only
 */

export interface FieldState {
	weather?: string | null;
	terrain?: string | null;

	/**
	 * Deterministic modifiers applied during phase resolution
	 */
	modifiers?: {
		damageMultiplier?: number;
		speedMultiplier?: number;
		healingMultiplier?: number;
	};

	/**
	 * Phase interaction flags
	 */
	phaseTags?: {
		guard?: boolean;
		shift?: boolean;
		strike?: boolean;
		surge?: boolean;
	};

	/**
	 * Environmental rule toggles (static per phase)
	 */
	rules?: {
		gravity?: boolean;
		trickRoom?: boolean;
	};
}

/**
 * =========================================================
 * PURE FIELD RESOLVER (NO MUTATION)
 * =========================================================
 */

export function resolveFieldState(input: Partial<FieldState>): FieldState {
	return {
		weather: input.weather ?? null,
		terrain: input.terrain ?? null,
		modifiers: input.modifiers ?? {},
		phaseTags: input.phaseTags ?? {},
		rules: input.rules ?? {},
	};
}

/**
 * =========================================================
 * STATIC FIELD EFFECT INTERPRETER
 * =========================================================
 */

export function applyFieldModifiers(state: FieldState) {
	const result = {
		damageMultiplier: 1,
		speedMultiplier: 1,
		healingMultiplier: 1,
	};

	if (state.weather === "sun") result.damageMultiplier *= 1.1;
	if (state.weather === "rain") result.damageMultiplier *= 1.1;
	if (state.terrain === "electric") result.damageMultiplier *= 1.1;

	if (state.rules?.trickRoom) {
		result.speedMultiplier *= -1; // inversion handled in resolver logic
	}

	return result;
}
