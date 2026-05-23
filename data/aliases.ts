/**
 * =========================================================
 * INPUT NORMALIZATION LAYER (REPLACES SHOWDOWN ALIASES)
 * =========================================================
 *
 * Purpose:
 * - resolve shorthand user input
 * - normalize external UI/API commands
 *
 * NOT part of battle simulation logic.
 */

export const Aliases: Record<string, string> = {
	// =========================
	// CORE ACTION SHORTCUTS
	// =========================

	fb: "strike_fire",
	tb: "strike_water",
	gb: "strike_air",
	sb: "strike_earth",

	vb: "strike_nether",
	rb: "strike_aether",

	// =========================
	// SURGE SHORTCUTS
	// =========================

	sp: "surge_pressure",
	sr: "surge_resonance",
	sbk: "surge_break",
	sf: "surge_flow",

	// =========================
	// SHIFT SHORTCUTS
	// =========================

	ss: "shift_step",
	sa: "shift_anchor",
	sv: "shift_void",

	// =========================
	// GUARD SHORTCUTS
	// =========================

	gc: "guard_core",
	gn: "guard_null",
	gf: "guard_flow",

	// =========================
	// ELEMENT INPUT NORMALIZATION
	// =========================

	fire: "fire",
	water: "water",
	air: "air",
	earth: "earth",
	aether: "aether",
	nether: "nether",
};

/**
 * Resolve alias → canonical action id
 */
export function resolveAlias(input: string): string {
	return Aliases[input] ?? input;
}

/**
 * Strict validation gate for combat system
 */
export function isValidCanonical(input: string): boolean {
	return Object.values(Aliases).includes(input);
}
