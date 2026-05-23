import { Unit } from "./pokedex";

/**
 * =========================================================
 * FORMATS DATA (REDEFINED)
 * =========================================================
 *
 * In this system, formats-data is NOT usage statistics.
 * It is competitive pruning + doctrine balancing metadata.
 */

export interface FormatMeta {
	/**
	 * Competitive viability tiering (system-level, not ladder-based)
	 */
	tier: "OU" | "UU" | "BL" | "Uber";

	/**
	 * System balance weight used for matchmaking + core building
	 */
	viability: "S" | "A" | "B" | "C";

	/**
	 * Recommended role bias in formation systems
	 */
	roleBias: "Frontline" | "Backline" | "Flexible";

	/**
	 * Doctrine affinity override (used to stabilize synergy curves)
	 */
	doctrineAffinity?: "infernal" | "tempest" | "bulwark" | "void";

	/**
	 * Indicates whether unit is allowed in pruned competitive pool
	 */
	legal: boolean;

	/**
	 * Optional restriction flags for balancing
	 */
	flags?: {
		/**
		 * Prevents stacking multiple copies in core systems
		 */
		unique?: boolean;

		/**
		 * Indicates high-swing balance unit (needs tuning caution)
		 */
		volatile?: boolean;
	};
}

/**
 * =========================================================
 * PRUNED NATDEX OU META LAYER
 * =========================================================
 *
 * This replaces usage stats with deterministic balance tags.
 */

export const FormatsData: Record<string, FormatMeta> = {
	garchomp: {
		tier: "OU",
		viability: "S",
		roleBias: "Frontline",
		doctrineAffinity: "infernal",
		legal: true,
		flags: {
			volatile: true,
		},
	},

	dragapult: {
		tier: "OU",
		viability: "S",
		roleBias: "Backline",
		doctrineAffinity: "tempest",
		legal: true,
		flags: {
			volatile: true,
		},
	},

	ironhands: {
		tier: "OU",
		viability: "A",
		roleBias: "Frontline",
		doctrineAffinity: "bulwark",
		legal: true,
	},

	corviknight: {
		tier: "OU",
		viability: "A",
		roleBias: "Frontline",
		doctrineAffinity: "bulwark",
		legal: true,
	},

	gholdengo: {
		tier: "OU",
		viability: "S",
		roleBias: "Backline",
		doctrineAffinity: "void",
		legal: true,
		flags: {
			volatile: true,
		},
	},

	cinderace: {
		tier: "OU",
		viability: "A",
		roleBias: "Backline",
		doctrineAffinity: "tempest",
		legal: true,
	},
};

/**
 * =========================================================
 * ROSTER FILTER FUNCTION
 * =========================================================
 *
 * Used by your buildNatDexOU pipeline to enforce pruning.
 */

export function isLegalUnit(name: string): boolean {
	const meta = FormatsData[name];
	return meta?.legal === true;
}

/**
 * =========================================================
 * BALANCE QUERY LAYER
 * =========================================================
 */

export function getViability(name: string): FormatMeta["viability"] {
	return FormatsData[name]?.viability ?? "C";
}

export function getDoctrineAffinity(name: string) {
	return FormatsData[name]?.doctrineAffinity ?? "tempest";
}
