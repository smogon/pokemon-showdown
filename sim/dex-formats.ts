/**
 * =========================================================
 * KONIVRER MATCH SCHEMA REGISTRY
 * (REPLACES SHOWDOWN DEX-FORMATS)
 * =========================================================
 *
 * Removes:
 * - clause system enforcement engine
 * - format-based rule injection
 * - engine behavior switching
 *
 * Replaces with:
 * - static match definitions only
 * - no gameplay mutation authority
 */

export interface MatchSchema {
	id: string;
	name: string;

	/**
	 * Pure structural constraints only (NOT rules engine)
	 */
	structure: {
		teamSize: number;
	};

	/**
	 * Metadata only (NO enforcement logic)
	 */
	tags?: string[];
}

/**
 * =========================================================
 * MATCH SCHEMAS (STATIC ONLY)
 * =========================================================
 *
 * These do NOT alter engine behavior.
 * They are descriptive configuration profiles only.
 */

export const Formats: Record<string, MatchSchema> = {

	standard_4v4: {
		id: "standard_4v4",
		name: "Standard Doctrine Match",
		structure: {
			teamSize: 4,
		},
		tags: ["ranked", "competitive"],
	},

	chaos_4v4: {
		id: "chaos_4v4",
		name: "Entropy Protocol",
		structure: {
			teamSize: 4,
		},
		tags: ["experimental"],
	},

	objective_4v4: {
		id: "objective_4v4",
		name: "Convergence War",
		structure: {
			teamSize: 4,
		},
		tags: ["objective", "strategic"],
	},
};

/**
 * =========================================================
 * PURE LOOKUP ONLY
 * =========================================================
 */

export function getFormat(id: string): MatchSchema | null {
	return Formats[id] ?? null;
}
