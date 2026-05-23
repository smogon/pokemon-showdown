/**
 * =========================================================
 * STATIC CLASSIFICATION LABEL SYSTEM
 * (REPLACES SHOWDOWN TAGS.TS)
 * =========================================================
 *
 * Tags are no longer runtime metadata or cross-system hooks.
 * They are compile-time classification labels only.
 */

export type UnitTag =
	| "starter_archetype"
	| "legendary_tier"
	| "pseudo_legendary"
	| "speed_core"
	| "tank_core"
	| "tempo_core"
	| "breaker_core"
	| "control_core"
	| "aether_attuned"
	| "nether_attuned";

/**
 * =========================================================
 * TAG REGISTRY (STATIC ONLY)
 * =========================================================
 */

export const Tags: Record<string, UnitTag[]> = {

	garchomp: ["pseudo_legendary", "breaker_core", "earth_attuned"],

	dragapult: ["pseudo_legendary", "speed_core", "nether_attuned"],

	ironhands: ["tank_core", "control_core", "earth_attuned"],

	corviknight: ["tank_core", "control_core", "air_attuned"],

	gholdengo: ["control_core", "aether_attuned"],

	cinderace: ["speed_core", "breaker_core", "fire_attuned"],

};

/**
 * =========================================================
 * QUERY HELPERS (NO RUNTIME COUPLING)
 * =========================================================
 */

export function getTags(unitId: string): UnitTag[] {
	return Tags[unitId] ?? [];
}

export function hasTag(unitId: string, tag: UnitTag): boolean {
	return (Tags[unitId] ?? []).includes(tag);
}
