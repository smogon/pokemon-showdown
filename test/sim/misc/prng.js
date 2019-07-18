'use strict';

const PRNG = require('../../../.sim-dist/prng').PRNG;
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
	describe(`sample`, function () {
		it(`should throw for a zero-item array`, function () {
			const prng = new PRNG(testSeed);
			const items = [];
			assert.throws(() => prng.sample(items), RangeError);
		});
		it(`should eventually throw for a very sparse array`, function () {
			const prng = new PRNG(testSeed);
			const items = [];
			items[30] = 'hello!';
			assert.throws(() => {
				for (let i = 0; i < 100; ++i) {
					prng.sample(items);
				}
			});
		});
		it(`should eventually throw for a somewhat sparse array`, function () {
			const prng = new PRNG(testSeed);
			const items = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
			delete items[9];
			assert.throws(() => {
				for (let i = 0; i < 100; ++i) {
					prng.sample(items);
				}
			});
		});
		it(`should return the only item in a single-item array`, function () {
			const item = {};
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 10; ++i) {
				const sample = prng.sample([item]);
				assert.strictEqual(sample, item);
			}
		});
		it(`should return items with equal probability for a five-item array`, function () {
			const items = ['a', 'b', 'c', 'd', 'e'];
			const occurences = {a: 0, b: 0, c: 0, d: 0, e: 0};
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 1000; ++i) {
				const sample = prng.sample(items);
				occurences[sample] += 1;
			}
			assert.bounded(occurences.a, [170, 230]);
			assert.bounded(occurences.b, [170, 230]);
			assert.bounded(occurences.c, [170, 230]);
			assert.bounded(occurences.d, [170, 230]);
			assert.bounded(occurences.e, [170, 230]);
		});
		it(`should return items with weighted probability for a three-item array with duplicates`, function () {
			const items = ['x', 'x', 'y'];
			const occurences = {x: 0, y: 0};
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				const sample = prng.sample(items);
				occurences[sample] += 1;
			}
			assert.bounded(occurences.x, [63, 71]);
			assert.bounded(occurences.y, [29, 37]);
		});
		it(`should be identical to array[next(array.length)]`, function () {
			// This invariant is important for battle logs.
			const items = [{}, {}, {}, {}, {}, {}, {}, {}];
			const samplePRNG = new PRNG(testSeed);
			const randomIntegerPRNG = new PRNG(testSeed);
			for (let i = 0; i < 10; ++i) {
				assert.strictEqual(items[randomIntegerPRNG.next(items.length)], samplePRNG.sample(items));
			}
		});
	});
});
