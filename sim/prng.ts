/**
 * PRNG
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This simulates the on-cartridge PRNG used in the real games.
 *
 * In addition to potentially allowing us to read replays from in-game,
 * this also makes it possible to record an "input log" (a seed +
 * initial teams + move/switch decisions) and "replay" a simulation to
 * get the same result.
 *
 * @license MIT license
 */

import * as sodium from 'sodium-native';

/** 64-bit big-endian [high -> low] int */
export type PRNGSeed = [number, number, number, number];

interface PRNGRequired {
	next(from?: number, to?: number): number;
	randomChance(numerator: number, denominator: number): boolean;
	sample<T>(items: readonly T[]): T;
	shuffle<T>(items: T[], start: number, end: number): void;
}

/**
 * A PRNG intended to emulate the on-cartridge PRNG for Gen 5 with a 64-bit
 * initial seed.
 */
export class PRNG implements PRNGRequired {
	readonly initialSeed: PRNGSeed;
	seed: Buffer;
	/** Creates a new source of randomness for the given seed. */
	constructor(seed: PRNGSeed | Buffer | null = null, initialSeed?: PRNGSeed) {
		if (!seed) seed = PRNG.generateSeed();
		// hack i know i know
		this.initialSeed = initialSeed || [...seed] as PRNGSeed;
		this.seed = Array.isArray(seed) ? PRNG.convertSeed(seed.slice() as PRNGSeed) : seed;
	}

	static convertSeed(inputSeed: PRNGSeed) {
		// randombytes_buf_deterministic only takes 32 bytes (8x4 here), so it's gotta be slightly longer
		// than we use
		const seed = new Uint32Array(8);
		for (let i = 0; i < seed.length; i++) seed[i] = inputSeed[i];
		const buf = Buffer.alloc(32);
		// @ts-ignore this doesn't accept buffers, but instead TypedArrays - typedef is out of date
		sodium.randombytes_buf_deterministic(buf, seed);
		return buf;
	}

	/**
	 * Getter to the initial seed.
	 *
	 * This should be considered a hack and is only here for backwards compatibility.
	 */
	get startingSeed(): PRNGSeed {
		return this.initialSeed;
	}

	setSeed(seed: PRNGSeed) {
		this.seed = PRNG.convertSeed(seed);
	}

	/**
	 * Creates a clone of the current PRNG.
	 *
	 * The new PRNG will have its initial seed set to the seed of the current instance.
	 */
	clone(): PRNG {
		return new PRNG(this.seed, this.initialSeed);
	}

	/**
	 * Retrieves the next random number in the sequence.
	 * This function has three different results, depending on arguments:
	 * - random() returns a real number in [0, 1), just like Math.random()
	 * - random(n) returns an integer in [0, n)
	 * - random(m, n) returns an integer in [m, n)
	 * m and n are converted to integers via Math.floor. If the result is NaN, they are ignored.
	 */
	next(from?: number, to?: number): number {
		let result = this.seededRandom();
		if (from) from = Math.floor(from);
		if (to) to = Math.floor(to);
		if (from === undefined) {
			result = result / 0x1000000000;
		} else if (!to) {
			result = Math.floor(result * from / 0x100000000);
		} else {
			result = Math.floor(result * (to - from) / 0x100000000) + from;
		}
		return result;
	}

	private seededRandom() {
		const buf = Buffer.alloc(36);
		sodium.randombytes_buf_deterministic(buf, this.seed);
		// use the last four bytes for the output, use the other 32 bytes for the next seed
		this.seed = buf.slice(buf.length - 32);
		return buf.slice(32).readUint32BE();
	}

	/**
	 * Flip a coin (two-sided die), returning true or false.
	 *
	 * This function returns true with probability `P`, where `P = numerator
	 * / denominator`. This function returns false with probability `1 - P`.
	 *
	 * The numerator must be a non-negative integer (`>= 0`).
	 *
	 * The denominator must be a positive integer (`> 0`).
	 */
	randomChance(numerator: number, denominator: number): boolean {
		return this.next(denominator) < numerator;
	}

	/**
	 * Return a random item from the given array.
	 *
	 * This function chooses items in the array with equal probability.
	 *
	 * If there are duplicate items in the array, each duplicate is
	 * considered separately. For example, sample(['x', 'x', 'y']) returns
	 * 'x' 67% of the time and 'y' 33% of the time.
	 *
	 * The array must contain at least one item.
	 *
	 * The array must not be sparse.
	 */
	sample<T>(items: readonly T[]): T {
		if (items.length === 0) {
			throw new RangeError(`Cannot sample an empty array`);
		}
		const index = this.next(items.length);
		const item = items[index];
		if (item === undefined && !Object.prototype.hasOwnProperty.call(items, index)) {
			throw new RangeError(`Cannot sample a sparse array`);
		}
		return item;
	}

	/**
	 * A Fisher-Yates shuffle. This is how the game resolves speed ties.
	 *
	 * At least according to V4 in
	 * https://github.com/smogon/pokemon-showdown/issues/1157#issuecomment-214454873
	 */
	shuffle<T>(items: T[], start = 0, end: number = items.length) {
		while (start < end - 1) {
			const nextIndex = this.next(start, end);
			if (start !== nextIndex) {
				[items[start], items[nextIndex]] = [items[nextIndex], items[start]];
			}
			start++;
		}
	}

	static generateSeed() {
		return [
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
		] as PRNGSeed;
	}
}

// old, predictable PRNG. do not use this for anything but tests
export class TestPRNG implements PRNGRequired {
	readonly initialSeed: PRNGSeed;
	seed: PRNGSeed;
	/** Creates a new source of randomness for the given seed. */
	constructor(seed: PRNGSeed | null = null) {
		if (!seed) seed = PRNG.generateSeed();
		this.initialSeed = seed.slice() as PRNGSeed; // make a copy
		this.seed = seed.slice() as PRNGSeed;
	}

	get startingSeed(): PRNGSeed {
		return this.initialSeed;
	}

	clone(): PRNG {
		return new PRNG(this.seed);
	}

	next(from?: number, to?: number): number {
		this.seed = this.nextFrame(this.seed); // Advance the RNG
		let result = (this.seed[0] << 16 >>> 0) + this.seed[1]; // Use the upper 32 bits
		if (from) from = Math.floor(from);
		if (to) to = Math.floor(to);
		if (from === undefined) {
			result = result / 0x100000000;
		} else if (!to) {
			result = Math.floor(result * from / 0x100000000);
		} else {
			result = Math.floor(result * (to - from) / 0x100000000) + from;
		}
		return result;
	}

	randomChance(numerator: number, denominator: number): boolean {
		return this.next(denominator) < numerator;
	}

	sample<T>(items: readonly T[]): T {
		if (items.length === 0) {
			throw new RangeError(`Cannot sample an empty array`);
		}
		const index = this.next(items.length);
		const item = items[index];
		if (item === undefined && !Object.prototype.hasOwnProperty.call(items, index)) {
			throw new RangeError(`Cannot sample a sparse array`);
		}
		return item;
	}

	shuffle<T>(items: T[], start = 0, end: number = items.length) {
		while (start < end - 1) {
			const nextIndex = this.next(start, end);
			if (start !== nextIndex) {
				[items[start], items[nextIndex]] = [items[nextIndex], items[start]];
			}
			start++;
		}
	}

	multiplyAdd(a: PRNGSeed, b: PRNGSeed, c: PRNGSeed) {
		const out: PRNGSeed = [0, 0, 0, 0];
		let carry = 0;

		for (let outIndex = 3; outIndex >= 0; outIndex--) {
			for (let bIndex = outIndex; bIndex < 4; bIndex++) {
				const aIndex = 3 - (bIndex - outIndex);

				carry += a[aIndex] * b[bIndex];
			}
			carry += c[outIndex];

			out[outIndex] = carry & 0xFFFF;
			carry >>>= 16;
		}

		return out;
	}

	nextFrame(seed: PRNGSeed, framesToAdvance = 1): PRNGSeed {
		const a: PRNGSeed = [0x5D58, 0x8B65, 0x6C07, 0x8965];
		const c: PRNGSeed = [0, 0, 0x26, 0x9EC3];

		for (let i = 0; i < framesToAdvance; i++) {
			seed = this.multiplyAdd(seed, a, c);
		}

		return seed;
	}
}

// The following commented-out function is designed to emulate the on-cartridge
// PRNG for Gens 3 and 4, as described in
// https://www.smogon.com/ingame/rng/pid_iv_creation#pokemon_random_number_generator
// This RNG uses a 32-bit initial seed
// m and n are converted to integers via Math.floor. If the result is NaN, they
// are ignored.
/*
random(m: number, n: number) {
	this.seed = (this.seed * 0x41C64E6D + 0x6073) >>> 0; // truncate the result to the last 32 bits
	let result = this.seed >>> 16; // the first 16 bits of the seed are the random value
	m = Math.floor(m)
	n = Math.floor(n)
	return (m ? (n ? (result % (n - m)) + m : result % m) : result / 0x10000)
}
*/
