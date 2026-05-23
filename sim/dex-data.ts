/**
 * =========================================================
 * KONIVRER STATIC ENTITY CORE SCHEMA
 * (REPLACES SHOWDOWN DEX-DATA)
 * =========================================================
 *
 * Removes:
 * - BasicEffect inheritance system
 * - runtime hook capability model
 * - polymorphic battle effect architecture
 *
 * Replaces with:
 * - static, deterministic entity definitions only
 */

export type EntityType =
	| "unit"
	| "action"
	| "modifier"
	| "condition";

/**
 * =========================================================
 * BASE ENTITY (PURE DATA CONTRACT)
 * =========================================================
 */

export interface Entity {
	id: string;
	name: string;
	type: EntityType;

	/**
	 * Pure descriptive layer only
	 */
	description?: string;

	/**
	 * Deterministic balance metadata (NO logic)
	 */
	balance?: {
		powerTier?: number;
		rarity?: number;
	};

	/**
	 * Phase influence flags (NOT runtime hooks)
	 */
	phaseTags?: {
		guard?: boolean;
		shift?: boolean;
		strike?: boolean;
		surge?: boolean;
	};
}

/**
 * =========================================================
 * ENTITY HELPERS
 * =========================================================
 */

export function toEntityID(name: string): string {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

/**
 * =========================================================
 * VALIDATION LAYER (STATIC ONLY)
 * =========================================================
 */

export function isEntity(obj: any): obj is Entity {
	return obj && typeof obj.id === "string" && typeof obj.type === "string";
}

