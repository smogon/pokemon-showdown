/**
 * =========================================================
 * KONIVRER UNIT STATE SNAPSHOT MODEL
 * (REPLACES SHOWDOWN POKEMON.TS)
 * =========================================================
 *
 * Removes:
 * - all mutable battle logic
 * - internal state mutation methods
 * - embedded simulation behavior
 *
 * Replaces with:
 * - immutable per-unit state container
 */

import type { SpeciesID, ItemID, AbilityID, MoveID } from "./global-types";

export interface UnitSnapshot {
	id: string;

	species: SpeciesID;

	hp: number;

	maxHP: number;

	stats: {
		atk: number;
		def: number;
		spa: number;
		spd: number;
		spe: number;
	};

	boosts?: Partial<Record<"atk" | "def" | "spa" | "spd" | "spe", number>>;

	status?: string | null;

	item?: ItemID | null;

	ability?: AbilityID | null;

	moves: MoveID[];

	/**
	 * Non-persistent transient flags (resolved per phase)
	 */
	temporary?: {
		protect?: boolean;
		charged?: boolean;
		taunted?: boolean;
	};
}

/**
 * =========================================================
 * PURE FACTORY ONLY
 * =========================================================
 */

export function createUnitSnapshot(input: Partial<UnitSnapshot>): UnitSnapshot {
	return {
		id: input.id ?? "",
		species: input.species!,
		hp: input.hp ?? 1,
		maxHP: input.maxHP ?? 1,
		stats: input.stats ?? { atk: 0, def: 0, spa: 0, spd: 0, spe: 0 },
		boosts: input.boosts ?? {},
		status: input.status ?? null,
		item: input.item ?? null,
		ability: input.ability ?? null,
		moves: input.moves ?? [],
		temporary: input.temporary ?? {},
	};
}
