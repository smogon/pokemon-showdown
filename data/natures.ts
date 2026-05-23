import { Element } from "./typechart";

export type RoleBias = "Frontline" | "Backline" | "Balanced";

/**
 * =========================================================
 * ARCHETYPE NATURE SYSTEM (REPLACES STAT MODIFIERS)
 * =========================================================
 *
 * Natures no longer modify stats.
 * They define deterministic combat identity bias.
 */

export interface Nature {
	id: string;
	name: string;

	/**
	 * Preferred tactical role in formation systems
	 */
	roleBias: RoleBias;

	/**
	 * Elemental affinity drift (soft weighting, not damage scaling)
	 */
	elementAffinity?: Partial<Record<Element, number>>;

	/**
	 * Action preference bias (influences AI or auto-selection systems)
	 */
	actionBias?: {
		strike?: number;
		surge?: number;
		shift?: number;
		guard?: number;
	};

	/**
	 * Tempo inclination (initiative-style behavior modifier)
	 */
	tempoBias?: "aggressive" | "reactive" | "adaptive";
}

/**
 * =========================================================
 * PRUNED NATURE ARCHETYPES
 * =========================================================
 */

export const Natures: Record<string, Nature> = {

	adamant: {
		id: "adamant",
		name: "Adamant Will",
		roleBias: "Frontline",
		actionBias: {
			strike: 1.2,
			guard: 1.0,
		},
		tempoBias: "aggressive",
	},

	modest: {
		id: "modest",
		name: "Measured Focus",
		roleBias: "Backline",
		actionBias: {
			surge: 1.15,
		},
		tempoBias: "adaptive",
	},

	jolly: {
		id: "jolly",
		name: "Swift Instinct",
		roleBias: "Backline",
		actionBias: {
			shift: 1.2,
		},
		tempoBias: "aggressive",
	},

	impish: {
		id: "impish",
		name: "Defensive Instinct",
		roleBias: "Frontline",
		actionBias: {
			guard: 1.2,
		},
		tempoBias: "reactive",
	},

	calm: {
		id: "calm",
		name: "Balanced Resolve",
		roleBias: "Balanced",
		actionBias: {
			guard: 1.1,
			surge: 1.05,
		},
		tempoBias: "reactive",
	},

	timid: {
		id: "timid",
		name: "Fractured Tempo",
		roleBias: "Backline",
		actionBias: {
			shift: 1.15,
			strike: 1.05,
		},
		tempoBias: "aggressive",
	},
};
