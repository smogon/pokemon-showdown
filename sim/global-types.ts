/**
 * =========================================================
 * KONIVRER STRICT SIMULATION TYPE SYSTEM
 * (REPLACES SHOWDOWN GLOBAL-TYPES)
 * =========================================================
 *
 * Removes:
 * - event-driven type contracts
 * - polymorphic effect interfaces
 * - hook-capable definitions
 *
 * Replaces with:
 * - strict deterministic data contracts
 */

export type ID = string;

/**
 * =========================================================
 * CORE IDENTITIES (STATIC ONLY)
 * =========================================================
 */

export type SpeciesID = ID;
export type MoveID = ID;
export type AbilityID = ID;
export type ItemID = ID;

/**
 * =========================================================
 * CORE UNIT STATE (IMMUTABLE MODEL)
 * =========================================================
 */

export interface UnitState {
	species: SpeciesID;

	stats: {
		hp: number;
		atk: number;
		def: number;
		spa: number;
		spd: number;
		spe: number;
	};

	types: string[];

	hpCurrent: number;

	status?: string | null;
}

/**
 * =========================================================
 * BATTLE STATE VECTOR (NO MUTATION MODEL)
 * =========================================================
 */

export interface BattleState {
	turn: number;

	field: {
		weather?: string | null;
		terrain?: string | null;
	};

	sides: {
		sideA: UnitState[];
		sideB: UnitState[];
	};
}

/**
 * =========================================================
 * ACTION RESOLUTION CONTRACT
 * =========================================================
 */

export interface Action {
	user: ID;
	move: MoveID;
	target?: ID;
	priority?: number;
}

/**
 * =========================================================
 * PHASE SYSTEM CONTRACT
 * =========================================================
 */

export type Phase = "guard" | "shift" | "strike" | "surge";
