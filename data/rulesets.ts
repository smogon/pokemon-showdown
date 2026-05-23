import { Unit } from "./pokedex";

/**
 * =========================================================
 * BATTLE MODE CONFIGURATION LAYER
 * (REPLACES SHOWDOWN RULESETS COMPLETELY)
 * =========================================================
 *
 * This system no longer defines legality.
 * It defines deterministic match structure presets.
 */

export interface BattleMode {
	id: string;
	name: string;

	/**
	 * Core structural constraint
	 */
	teamSize: number;

	/**
	 * Max actions per unit (hard system rule)
	 */
	actionsPerUnit: number;

	/**
	 * Enables/disables system mechanics globally
	 */
	modifiers?: {
		doctrineEnabled?: boolean;
		fieldEffectsEnabled?: boolean;
		itemSystemEnabled?: boolean;
		natureBiasEnabled?: boolean;
	};

	/**
	 * Win condition type
	 */
	winCondition: "elimination" | "control" | "objective";

	/**
	 * Balance tuning profile
	 */
	balanceProfile: "standard" | "highVariance" | "tactical";
}

/**
 * =========================================================
 * KONIVRER CORE BATTLE MODES
 * =========================================================
 */

export const Rulesets: Record<string, BattleMode> = {

	/**
	 * =====================================================
	 * STANDARD COMPETITIVE MODE
	 * =====================================================
	 */
	standard_4v4: {
		id: "standard_4v4",
		name: "Standard Doctrine Battle",
		teamSize: 4,
		actionsPerUnit: 4,
		modifiers: {
			doctrineEnabled: true,
			fieldEffectsEnabled: true,
			itemSystemEnabled: true,
			natureBiasEnabled: true,
		},
		winCondition: "elimination",
		balanceProfile: "standard",
	},

	/**
	 * =====================================================
	 * HIGH VARIANCE MODE (CHAOS META TESTING)
	 * =====================================================
	 */
	chaos_4v4: {
		id: "chaos_4v4",
		name: "Entropy Protocol",
		teamSize: 4,
		actionsPerUnit: 4,
		modifiers: {
			doctrineEnabled: true,
			fieldEffectsEnabled: true,
			itemSystemEnabled: true,
			natureBiasEnabled: true,
		},
		winCondition: "elimination",
		balanceProfile: "highVariance",
	},

	/**
	 * =====================================================
	 * TACTICAL OBJECTIVE MODE
	 * =====================================================
	 */
	objective_4v4: {
		id: "objective_4v4",
		name: "Convergence War",
		teamSize: 4,
		actionsPerUnit: 4,
		modifiers: {
			doctrineEnabled: true,
			fieldEffectsEnabled: true,
			itemSystemEnabled: true,
			natureBiasEnabled: true,
		},
		winCondition: "objective",
		balanceProfile: "tactical",
	},
};

/**
 * =========================================================
 * MODE RESOLUTION HELPERS
 * =========================================================
 */

export function getMode(id: string): BattleMode | null {
	return Rulesets[id] ?? null;
}

export function validateTeamSize(mode: BattleMode, team: Unit[]): boolean {
	return team.length === mode.teamSize;
}
