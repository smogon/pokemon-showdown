'use strict';

const PRNG = require('../../../dist/sim/prng').PRNG;
const assert = require('../../assert');

const testSeed = 'sodium,00000001000000020000000300000004';

describe(`PRNG`, () => {
	it("should always generate the same results off the same seed", () => {
		const results = [];
		const testAgainst = new PRNG(testSeed);
		for (let i = 0; i < 100; i++) {
			results.push(testAgainst.random());
		}
		for (let i = 0; i < 10; i++) {
			const cur = new PRNG(testSeed);
			for (let j = 0; j < results.length; j++) {
				const n = cur.random();
				assert(results[j] === n, `generation ${j} for seed ${testSeed} did not match (expected: ${results[j]}, got ${n})`);
			}
		}
	});

	describe(`randomChance(numerator=0, denominator=1)`, () => {
		it(`should always return false`, () => {
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				assert.equal(prng.randomChance(0, 1), false);
			}
		});
	});
	describe(`randomChance(numerator=1, denominator=1)`, () => {
		it(`should always return true`, () => {
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				assert.equal(prng.randomChance(1, 1), true);
			}
		});
	});
	describe(`randomChance(numerator=256, denominator=256)`, () => {
		it(`should always return true`, () => {
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				assert.equal(prng.randomChance(256, 256), true);
			}
		});
	});
	describe(`randomChance(numerator=1, denominator=2)`, () => {
		it(`should return true 45-55% of the time`, () => {
			const prng = new PRNG(testSeed);
			let trueCount = 0;
			for (let i = 0; i < 100; ++i) {
				if (prng.randomChance(1, 2)) {
					trueCount += 1;
				}
			}
			assert.bounded(trueCount, [45, 55]);
		});
		it(`should be identical to (random(2) == 0)`, () => {
			// This invariant is important for battle logs.
			const coinPRNG = new PRNG(testSeed);
			const numberPRNG = new PRNG(testSeed);
			for (let i = 0; i < 10; ++i) {
				assert.equal(numberPRNG.random(2) === 0, coinPRNG.randomChance(1, 2));
			}
		});
	});
	describe(`randomChance(numerator=217, denominator=256)`, () => {
		it(`should return true 80%-90% of the time`, () => {
			const prng = new PRNG(testSeed);
			let trueCount = 0;
			for (let i = 0; i < 100; ++i) {
				if (prng.randomChance(217, 256)) {
					trueCount += 1;
				}
			}
			assert.bounded(trueCount, [80, 90]);
		});
		it(`should be identical to (random(256) < 217)`, () => {
			// This invariant is important for battle logs.
			const coinPRNG = new PRNG(testSeed);
			const numberPRNG = new PRNG(testSeed);
			for (let i = 0; i < 10; ++i) {
				assert.equal(numberPRNG.random(256) < 217, coinPRNG.randomChance(217, 256));
			}
		});
	});
	describe(`sample`, () => {
		it(`should throw for a zero-item array`, () => {
			const prng = new PRNG(testSeed);
			const items = [];
			assert.throws(() => prng.sample(items), RangeError);
		});
		it(`should eventually throw for a very sparse array`, () => {
			const prng = new PRNG(testSeed);
			const items = [];
			items[30] = 'hello!';
			assert.throws(() => {
				for (let i = 0; i < 100; ++i) {
					prng.sample(items);
				}
			});
		});
		it(`should eventually throw for a somewhat sparse array`, () => {
			const prng = new PRNG(testSeed);
			const items = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K'];
			delete items[9];
			assert.throws(() => {
				for (let i = 0; i < 100; ++i) {
					prng.sample(items);
				}
			});
		});
		it(`should return the only item in a single-item array`, () => {
			const item = {};
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 10; ++i) {
				const sample = prng.sample([item]);
				assert.equal(sample, item);
			}
		});
		it(`should return items with equal probability for a five-item array`, () => {
			const items = ['a', 'b', 'c', 'd', 'e'];
			const occurrences = { a: 0, b: 0, c: 0, d: 0, e: 0 };
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 1000; ++i) {
				const sample = prng.sample(items);
				occurrences[sample] += 1;
			}
			assert.bounded(occurrences.a, [170, 230]);
			assert.bounded(occurrences.b, [170, 230]);
			assert.bounded(occurrences.c, [170, 230]);
			assert.bounded(occurrences.d, [170, 230]);
			assert.bounded(occurrences.e, [170, 230]);
		});
		it(`should return items with weighted probability for a three-item array with duplicates`, () => {
			const items = ['x', 'x', 'y'];
			const occurrences = { x: 0, y: 0 };
			const prng = new PRNG(testSeed);
			for (let i = 0; i < 100; ++i) {
				const sample = prng.sample(items);
				occurrences[sample] += 1;
			}
			assert.bounded(occurrences.x, [63, 71]);
			assert.bounded(occurrences.y, [29, 37]);
		});
		it(`should be identical to array[random(array.length)]`, () => {
			// This invariant is important for battle logs.
			const items = [{}, {}, {}, {}, {}, {}, {}, {}];
			const samplePRNG = new PRNG(testSeed);
			const randomIntegerPRNG = new PRNG(testSeed);
			for (let i = 0; i < 10; ++i) {
				assert.equal(items[randomIntegerPRNG.random(items.length)], samplePRNG.sample(items));
			}
		});
	});
});
