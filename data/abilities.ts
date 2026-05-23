import { Element } from "./typechart";

/**
 * =========================================================
 * DOCTRINE MODIFIERS (REPLACES ABILITY ENGINE)
 * =========================================================
 *
 * Abilities are no longer event-driven hooks.
 * They are deterministic modifiers applied at battle initialization.
 */

export interface DoctrineModifier {
	id: string;
	name: string;

	/**
	 * Primary elemental affinity scaling bias
	 */
	elementBias?: Partial<Record<Element, number>>;

	/**
	 * Alters action behavior globally
	 */
	actionModifiers?: {
		strike?: number;
		surge?: number;
		shift?: number;
		guard?: number;
	};

	/**
	 * Tempo influence replaces priority/turn order manipulation
	 */
	tempoModifier?: number;

	/**
	 * Defensive scaling modifier
	 */
	damageTakenMultiplier?: number;

	/**
	 * Offensive scaling modifier
	 */
	damageDealtMultiplier?: number;

	/**
	 * Strategic identity tag used for synergy systems
	 */
	tag?: "aggressive" | "defensive" | "control" | "adaptive";
}

/**
 * =========================================================
 * PRUNED COMPETITIVE DOCTRINES
 * (Derived from NatDex ability ecosystem)
 * =========================================================
 */

export const Abilities: Record<string, DoctrineModifier> = {

	// =========================
	// OFFENSIVE CORE
	// =========================

	protean_core: {
		id: "protean_core",
		name: "Adaptive Offense",
		damageDealtMultiplier: 1.1,
		tag: "adaptive",
	},

	strong_jaw_core: {
		id: "strong_jaw_core",
		name: "Crushing Force",
		damageDealtMultiplier: 1.15,
		tag: "aggressive",
	},

	// =========================
	// DEFENSIVE CORE
	// =========================

	intimidate_core: {
		id: "intimidate_core",
		name: "Pressure Aura",
		damageDealtMultiplier: 0.95,
		tag: "defensive",
	},

	levitate_core: {
		id: "levitate_core",
		name: "Aerial Suspension",
		elementBias: {
			earth: 0.5,
		},
		tag: "defensive",
	},

	// =========================
	// CONTROL / TEMPO
	// =========================

	speed_boost_core: {
		id: "speed_boost_core",
		name: "Escalation Engine",
		tempoModifier: 1,
		tag: "control",
	},

	regen_core: {
		id: "regen_core",
		name: "Sustain Loop",
		damageTakenMultiplier: 0.9,
		tag: "defensive",
	},

	// =========================
	// UTILITY / META DEFINING
	// =========================

	magic_guard_core: {
		id: "magic_guard_core",
		name: "Pure Barrier",
		damageTakenMultiplier: 0.85,
		tag: "defensive",
	},

	adaptability_core: {
		id: "adaptability_core",
		name: "Elemental Resonance",
		damageDealtMultiplier: 1.2,
		tag: "aggressive",
	},
};
