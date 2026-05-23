/**
 * =========================================================
 * KONIVRER CORE DATA REGISTRY
 * (REPLACES SHOWDOWN DEX.TS)
 * =========================================================
 *
 * Removes:
 * - ModdedDex system (multi-context engine instances)
 * - format-based data mutation
 * - runtime data graph switching
 *
 * Replaces with:
 * - single deterministic registry layer
 */

import { SpeciesDex, getSpecies } from "./dex-species";
import { Moves, getMove } from "./dex-moves";
import { Abilities, getAbility } from "./dex-abilities";
import { Items, getItem } from "./dex-items";
import { Conditions, getCondition } from "./dex-conditions";

/**
 * =========================================================
 * SINGLE SOURCE OF TRUTH REGISTRY
 * =========================================================
 */

export const Dex = {
	species: {
		all: SpeciesDex,
		get: getSpecies,
	},

	moves: {
		all: Moves,
		get: getMove,
	},

	abilities: {
		all: Abilities,
		get: getAbility,
	},

	items: {
		all: Items,
		get: getItem,
	},

	conditions: {
		all: Conditions,
		get: getCondition,
	},
} as const;

/**
 * =========================================================
 * PURE LOOKUP INTERFACE
 * =========================================================
 */

export function getDex() {
	return Dex;
}
