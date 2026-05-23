/**
 * =========================================================
 * KONIVRER TEAM SCHEMA VALIDATOR
 * (REPLACES SHOWDOWN TEAM-VALIDATOR.TS)
 * =========================================================
 *
 * Removes:
 * - format-driven legality rules
 * - dynamic move/ability/item inference
 * - cross-system rule coupling
 *
 * Replaces with:
 * - strict schema validation only
 */

import type { UnitSnapshot } from "./pokemon";
import type { MoveID, AbilityID, ItemID } from "./global-types";

/**
 * =========================================================
 * STATIC VALIDATION RESULT
 * =========================================================
 */

export interface ValidationResult {
	valid: boolean;
	errors: string[];
}

/**
 * =========================================================
 * PURE LEGALITY SCHEMA (DECLARATIVE ONLY)
 * =========================================================
 */

export interface LegalSchema {
	allowedSpecies: Set<string>;
	allowedMoves: Set<MoveID>;
	allowedAbilities: Set<AbilityID>;
	allowedItems: Set<ItemID>;
}

/**
 * =========================================================
 * VALIDATION ENGINE (NO FORMAT LOGIC)
 * =========================================================
 */

export function validateTeam(
	team: UnitSnapshot[],
	schema: LegalSchema,
): ValidationResult {
	const errors: string[] = [];

	for (const unit of team) {
		if (!schema.allowedSpecies.has(unit.species)) {
			errors.push(`Illegal species: ${unit.species}`);
		}

		for (const move of unit.moves) {
			if (!schema.allowedMoves.has(move)) {
				errors.push(`Illegal move: ${move}`);
			}
		}

		if (unit.ability && !schema.allowedAbilities.has(unit.ability)) {
			errors.push(`Illegal ability: ${unit.ability}`);
		}

		if (unit.item && !schema.allowedItems.has(unit.item)) {
			errors.push(`Illegal item: ${unit.item}`);
		}
	}

	return {
		valid: errors.length === 0,
		errors,
	};
}
