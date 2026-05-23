import { DoctrineKit } from "./learnsets";
import { Nature } from "./natures";
import { Item } from "./items";
import { DoctrineModifier } from "./abilities";
import { Element } from "./typechart";

/**
 * =========================================================
 * UNIT IDENTITY REGISTRY (REPLACES SHOWDOWN POKEDEX)
 * =========================================================
 *
 * This file no longer defines Pokémon as stat-based entities.
 * It defines deterministic combat units in KONIVRER.
 */

export type UnitRole = "Frontline" | "Backline" | "Flexible";

export interface Unit {
	id: string;
	name: string;

	/**
	 * Primary elemental identity (from your compressed system)
	 */
	elements: Element[];

	/**
	 * Fixed 4-action doctrine kit
	 */
	kit: DoctrineKit;

	/**
	 * Passive doctrine modifier (replaces abilities.ts usage)
	 */
	doctrine?: DoctrineModifier;

	/**
	 * Archetype bias (replaces nature stat system)
	 */
	nature?: Nature;

	/**
	 * Default equipment loadout (replaces items dependency layer)
	 */
	item?: Item;

	/**
	 * Tactical role in 4-unit core system
	 */
	role: UnitRole;

	/**
	 * Balance classification (from formats-data replacement)
	 */
	viability: "S" | "A" | "B" | "C";
}

/**
 * =========================================================
 * PRUNED NATDEX OU UNIT ROSTER
 * =========================================================
 */

export const Pokedex: Record<string, Unit> = {

	garchomp: {
		id: "garchomp",
		name: "Garchomp",
		elements: ["earth", "fire"],
		role: "Frontline",
		kit: {
			strike: "strike_earth",
			surge: "surge_pressure",
			shift: "shift_anchor",
			guard: "guard_core",
		},
		viability: "S",
	},

	dragapult: {
		id: "dragapult",
		name: "Dragapult",
		elements: ["air", "nether"],
		role: "Backline",
		kit: {
			strike: "strike_nether",
			surge: "surge_resonance",
			shift: "shift_void",
			guard: "guard_null",
		},
		viability: "S",
	},

	ironhands: {
		id: "ironhands",
		name: "Iron Hands",
		elements: ["earth", "aether"],
		role: "Frontline",
		kit: {
			strike: "strike_earth",
			surge: "surge_break",
			shift: "shift_anchor",
			guard: "guard_core",
		},
		viability: "A",
	},

	corviknight: {
		id: "corviknight",
		name: "Corviknight",
		elements: ["air", "earth"],
		role: "Frontline",
		kit: {
			strike: "strike_air",
			surge: "surge_resonance",
			shift: "shift_step",
			guard: "guard_core",
		},
		viability: "A",
	},

	gholdengo: {
		id: "gholdengo",
		name: "Gholdengo",
		elements: ["aether", "nether"],
		role: "Backline",
		kit: {
			strike: "strike_aether",
			surge: "surge_pressure",
			shift: "shift_void",
			guard: "guard_null",
		},
		viability: "S",
	},

	cinderace: {
		id: "cinderace",
		name: "Cinderace",
		elements: ["fire", "air"],
		role: "Backline",
		kit: {
			strike: "strike_fire",
			surge: "surge_flow",
			shift: "shift_step",
			guard: "guard_core",
		},
		viability: "A",
	},
};

/**
 * =========================================================
 * LOOKUP LAYER
 * =========================================================
 */

export function getUnit(id: string): Unit | null {
	return Pokedex[id] ?? null;
}

export function getElements(id: string): Element[] {
	return Pokedex[id]?.elements ?? [];
}

export function getKit(id: string): DoctrineKit | null {
	return Pokedex[id]?.kit ?? null;
}
