import { Element } from "./typechart";

export type ActionCategory = "Strike" | "Surge" | "Shift" | "Guard";

export interface Action {
	id: string;
	name: string;

	category: ActionCategory;

	element: Element;

	power?: number;
	tempo?: number;

	/**
	 * Simplified competitive tag system
	 * replaces all secondary-effect complexity
	 */
	tag?: "damage" | "heal" | "buff" | "debuff" | "control" | "reaction";
}

/**
 * =========================================================
 * CORE PRUNED COMPETITIVE ACTION SET
 * (Derived from NatDex OU move ecosystem)
 * =========================================================
 */

export const Actions: Record<string, Action> = {

	// =====================================================
	// STRIKE (PRIMARY DAMAGE VERBS)
	// =====================================================

	strike_fire: {
		id: "strike_fire",
		name: "Flame Burst",
		category: "Strike",
		element: "fire",
		power: 80,
		tag: "damage",
	},

	strike_water: {
		id: "strike_water",
		name: "Tidal Break",
		category: "Strike",
		element: "water",
		power: 80,
		tag: "damage",
	},

	strike_air: {
		id: "strike_air",
		name: "Gale Edge",
		category: "Strike",
		element: "air",
		power: 75,
		tag: "damage",
	},

	strike_earth: {
		id: "strike_earth",
		name: "Stone Pulse",
		category: "Strike",
		element: "earth",
		power: 90,
		tag: "damage",
	},

	strike_aether: {
		id: "strike_aether",
		name: "Radiant Burst",
		category: "Strike",
		element: "aether",
		power: 85,
		tag: "damage",
	},

	strike_nether: {
		id: "strike_nether",
		name: "Void Rend",
		category: "Strike",
		element: "nether",
		power: 85,
		tag: "damage",
	},

	// =====================================================
	// SURGE (BUFF / CONTROL / SYSTEM PRESSURE)
	// =====================================================

	surge_pressure: {
		id: "surge_pressure",
		name: "Pressure Surge",
		category: "Surge",
		element: "nether",
		tag: "debuff",
	},

	surge_resonance: {
		id: "surge_resonance",
		name: "Resonance Field",
		category: "Surge",
		element: "aether",
		tag: "buff",
	},

	surge_break: {
		id: "surge_break",
		name: "Stagger Break",
		category: "Surge",
		element: "earth",
		tag: "control",
	},

	surge_flow: {
		id: "surge_flow",
		name: "Flow State",
		category: "Surge",
		element: "water",
		tag: "buff",
	},

	// =====================================================
	// SHIFT (TEMPO / POSITION / INITIATIVE CONTROL)
	// =====================================================

	shift_step: {
		id: "shift_step",
		name: "Phase Step",
		category: "Shift",
		element: "air",
		tempo: 1,
		tag: "control",
	},

	shift_anchor: {
		id: "shift_anchor",
		name: "Ground Anchor",
		category: "Shift",
		element: "earth",
		tempo: -1,
		tag: "control",
	},

	shift_void: {
		id: "shift_void",
		name: "Void Drift",
		category: "Shift",
		element: "nether",
		tempo: 0,
		tag: "control",
	},

	// =====================================================
	// GUARD (DEFENSIVE / REACTION STRUCTURE)
	// =====================================================

	guard_core: {
		id: "guard_core",
		name: "Aegis Guard",
		category: "Guard",
		element: "aether",
		tag: "buff",
	},

	guard_null: {
		id: "guard_null",
		name: "Void Guard",
		category: "Guard",
		element: "nether",
		tag: "reaction",
	},

	guard_flow: {
		id: "guard_flow",
		name: "Adaptive Guard",
		category: "Guard",
		element: "water",
		tag: "buff",
	},
};
