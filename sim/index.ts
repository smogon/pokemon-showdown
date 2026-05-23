/**
 * =========================================================
 * KONIVRER SIMULATION ENGINE ENTRY POINT
 * (REPLACES SHOWDOWN SIM/INDEX)
 * =========================================================
 *
 * Removes:
 * - multi-engine exports
 * - format-based instantiation logic
 * - legacy compatibility shims
 *
 * Replaces with:
 * - single deterministic simulation entry point
 */

import { Battle } from "./battle";

/**
 * =========================================================
 * SINGLE ENGINE FACTORY
 * =========================================================
 */

export function createBattle() {
	return new Battle();
}

/**
 * =========================================================
 * CORE EXPORT
 * =========================================================
 */

export { Battle };

/**
 * =========================================================
 * OPTIONAL: TYPE RE-EXPORTS (SAFE ONLY)
 * =========================================================
 */

export type { BattleState, Action, Phase } from "./global-types";
