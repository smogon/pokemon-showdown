/**
 * =========================================================
 * KONIVRER DETERMINISTIC ENTROPY ENGINE
 * (REPLACES SHOWDOWN PRNG.TS)
 * =========================================================
 *
 * Removes:
 * - distributed RNG access
 * - implicit randomness inside subsystems
 *
 * Replaces with:
 * - centralized deterministic entropy service
 * - phase-scoped randomness only
 */

export class RNG {
	private seed: number;

	constructor(seed: number) {
		this.seed = seed;
	}

	/**
	 * Linear congruential generator (deterministic)
	 */
	next(): number {
		this.seed = (this.seed * 9301 + 49297) % 233280;
		return this.seed / 233280;
	}

	/**
	 * Phase-scoped probability check
	 */
	chance(probability: number): boolean {
		return this.next() < probability;
	}

	/**
	 * Integer roll (deterministic range)
	 */
	int(min: number, max: number): number {
		return Math.floor(this.next() * (max - min + 1)) + min;
	}
}

/**
 * =========================================================
 * SINGLE ENTROPY INSTANCE PER BATTLE
 * =========================================================
 */

export function createRNG(seed: number) {
	return new RNG(seed);
}
