'use strict';

const PRNG = require('../../../sim/prng');
const assert = require('../../assert');

const testSeed = [1, 2, 3, 4];

describe(`PRNG`, function () {
	describe(`randomChance(numerator=0, denominator=1)`, function () {
		it(`should always return false`, function () {
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				assert.strictEqual(prng.randomChance(0, 1), false);
			}
		});
	});
	describe(`randomChance(numerator=1, denominator=1)`, function () {
		it(`should always return true`, function () {
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				assert.strictEqual(prng.randomChance(1, 1), true);
			}
		});
	});
	describe(`randomChance(numerator=256, denominator=256)`, function () {
		it(`should always return true`, function () {
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				assert.strictEqual(prng.randomChance(256, 256), true);
			}
		});
	});
	describe(`randomChance(numerator=1, denominator=2)`, function () {
		it(`should return true 45-55% of the time`, function () {
			const prng = new PRNG(testSeed);
			let trueCount = 0;
			for (let i = 0; i < 100; ++i) {
				if (prng.randomChance(1, 2)) {
					trueCount += 1;
				}
			}
			assert.bounded(trueCount, [45, 55]);
		});
		it(`should be identical to (next(2) == 0)`, function () {
			// This invariant is important for battle logs.
			const coinPRNG = new PRNG(testSeed);
			const numberPRNG = new PRNG(testSeed);
			for (let i = 0; i < 10; ++i) {
				assert.strictEqual(numberPRNG.next(2) === 0, coinPRNG.randomChance(1, 2));
			}
		});
	});
	describe(`randomChance(numerator=217, denominator=256)`, function () {
		it(`should return true 80%-90% of the time`, function () {
			const prng = new PRNG(testSeed);
			let trueCount = 0;
			for (let i = 0; i < 100; ++i) {
				if (prng.randomChance(217, 256)) {
					trueCount += 1;
				}
			}
			assert.bounded(trueCount, [80, 90]);
		});
		it(`should be identical to (next(256) < 217)`, function () {
			// This invariant is important for battle logs.
			const coinPRNG = new PRNG(testSeed);
			const numberPRNG = new PRNG(testSeed);
			for (let i = 0; i < 10; ++i) {
				assert.strictEqual(numberPRNG.next(256) < 217, coinPRNG.randomChance(217, 256));
			}
		});
	});
});
