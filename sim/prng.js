/**
 * PRNG
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file handles the random number generator for battles.
 *
 * @license MIT license
 */
'use strict';

/**
 * 64-bit, [high -> low]
 * @typedef {[number, number, number, number]} PRNGSeed
 */

/**
 * A PRNG intended to emulate the on-cartridge PRNG for Gen 5 with a 64-bit
 * initial seed.
 */
class PRNG {
	/**
	 * Creates a new source of randomness for the given seed.
	 *
	 * @param {PRNGSeed} [seed]
	 */
	constructor(seed = PRNG.generateSeed()) {
		/** @type {PRNGSeed} */
		// @ts-ignore TypeScript bug
		this.initialSeed = seed.slice(); // make a copy
		/** @type {PRNGSeed} */
		// @ts-ignore TypeScript bug
		this.seed = seed.slice();
	}

	/**
	 * Getter to the initial seed.
	 *
	 * This should be considered a hack and is only here for backwards compatibility.
	 * @return {PRNGSeed}
	 */
	get startingSeed() {
		return this.initialSeed;
	}

	/**
	 * Creates a clone of the current PRNG.
	 *
	 * The new PRNG will have its initial seed set to the seed of the current instance.
	 *
	 * @return {PRNG} - clone
	 */
	clone() {
		return new PRNG(this.seed);
	}

	/**
	 * Retrieves the next random number in the sequence.
	 * This function has three different results, depending on arguments:
	 * - random() returns a real number in [0, 1), just like Math.random()
	 * - random(n) returns an integer in [0, n)
	 * - random(m, n) returns an integer in [m, n)
	 * m and n are converted to integers via Math.floor. If the result is NaN, they are ignored.
	 *
	 * @param {number} [from]
	 * @param {number} [to]
	 * @return {number} - a real number in [0, 1) if no arguments are specified, an integer in [0, from) if from is specified, an integer in [from, to) if from and to are specified
	 */
	next(from, to) {
		this.seed = this.nextFrame(this.seed); // Advance the RNG
		let result = (this.seed[0] << 16 >>> 0) + this.seed[1]; // Use the upper 32 bits
		from = Math.floor(from);
		to = Math.floor(to);
		if (!from) {
			result = result / 0x100000000;
		} else if (!to) {
			result = Math.floor(result * from / 0x100000000);
		} else {
			result = Math.floor(result * (to - from) / 0x100000000) + from;
		}
		return result;
	}

	/**
		The RNG is a Linear Congruential Generator (LCG) in the form: `x_{n + 1} = (a x_n + c) % m`

		Where: `x_0` is the seed, `x_n` is the random number after n iterations,

		````
		a = 0x5D588B656C078965
		c = 0x00269EC3
		m = 2^64
		````

		Javascript doesnt handle such large numbers properly, so this function does it in 16-bit parts.
		````
		x_{n + 1} = (x_n * a) + c
		````

		Let any 64 bit number:
		````
		n = (n[0] << 48) + (n[1] << 32) + (n[2] << 16) + n[3]
		````

		Then:
		````
		x_{n + 1} =
			((a[3] x_n[0] + a[2] x_n[1] + a[1] x_n[2] + a[0] x_n[3] + c[0]) << 48) +
			((a[3] x_n[1] + a[2] x_n[2] + a[1] x_n[3] + c[1]) << 32) +
			((a[3] x_n[2] + a[2] x_n[3] + c[2]) << 16) +
			a[3] x_n[3] + c[3]
		````

		Which can be generalised where b is the number of 16 bit words in the number:
		````
		((a[b-1] + x_n[b-1] + c[b-1]) << (16 * 0)) +
		((a[b-1] x_n[b-2] + a[b-2] x_n[b-1] + c[b-2]) << (16 * 1)) +
		((a[b-1] x_n[b-3] + a[b-2] x_n[b-2] + a[b-3] x_n[b-1] + c[b-3]) << (16 * 2)) +
		...
		((a[b-1] x_n[1] + a[b-2] x_n[2] + ... + a[2] x_n[b-2] + a[1] + x_n[b-1] + c[1]) << (16 * (b-2))) +
		((a[b-1] x_n[0] + a[b-2] x_n[1] + ... + a[1] x_n[b-2] + a[0] + x_n[b-1] + c[0]) << (16 * (b-1)))
		````

		Which produces this equation:
		````
		\sum_{l=0}^{b-1}\left(\sum_{m=b-l-1}^{b-1}\left\{a[2b-m-l-2] x_n[m]\right\}+c[b-l-1]\ll16l\right)
		````

		Notice how the `a[]` word starts at `b-1`, and decrements every time it appears again on the line;
		`x_n[]` starts at `b-<line#>-1` and increments to b-1 at the end of the line per line, limiting the length of the line;
		`c[]` is at `b-<line#>-1` for each line and the left shift is `16 * <line#>`)

		This is all ignoring overflow/carry because that cannot be shown in a pseudo-mathematical equation.
		The below code implements a optimised version of that equation while also checking for overflow/carry.

		@param {PRNGSeed} initialSeed
		@param {number} [framesToAdvance = 1]
		@return {PRNGSeed} the new seed
	*/
	nextFrame(initialSeed, framesToAdvance = 1) {
		// Use Slice so we don't actually alter the original seed.
		/** @type {PRNGSeed} */
		// @ts-ignore TypeScript bug
		let seed = initialSeed.slice();
		for (let frame = 0; frame < framesToAdvance; ++frame) {
			const a = [0x5D58, 0x8B65, 0x6C07, 0x8965];
			const c = [0, 0, 0x26, 0x9EC3];

			/** @type {PRNGSeed} */
			const nextSeed = [0, 0, 0, 0];
			let carry = 0;

			for (let cN = seed.length - 1; cN >= 0; --cN) {
				nextSeed[cN] = carry;
				carry = 0;

				let aN = seed.length - 1;
				for (let seedN = cN; seedN < seed.length; --aN, ++seedN) {
					let nextWord = a[aN] * seed[seedN];
					carry += nextWord >>> 16;
					nextSeed[cN] += nextWord & 0xFFFF;
				}
				nextSeed[cN] += c[cN];
				carry += nextSeed[cN] >>> 16;
				nextSeed[cN] &= 0xFFFF;
			}

			seed = nextSeed;
		}
		return seed;
	}

	/**
	 * @return {PRNGSeed}
	 */
	static generateSeed() {
		return [
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
			Math.floor(Math.random() * 0x10000),
		];
	}
}

// The following commented-out function is designed to emulate the on-cartridge
// PRNG for Gens 3 and 4, as described in
// http://www.smogon.com/ingame/rng/pid_iv_creation#pokemon_random_number_generator
// This RNG uses a 32-bit initial seed
// m and n are converted to integers via Math.floor. If the result is NaN, they
// are ignored.
/*
random(m, n) {
	this.seed = (this.seed * 0x41C64E6D + 0x6073) >>> 0; // truncate the result to the last 32 bits
	let result = this.seed >>> 16; // the first 16 bits of the seed are the random value
	m = Math.floor(m)
	n = Math.floor(n)
	return (m ? (n ? (result % (n - m)) + m : result % m) : result / 0x10000)
}
*/

module.exports = PRNG;
