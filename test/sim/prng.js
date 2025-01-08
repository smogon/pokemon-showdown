'use strict';

const assert = require('./../assert');
const {PRNG} = require('../../dist/sim');

describe('CSPRNG', function () {
	it("should always generate the same results off the same seed", function () {
		const results = [];
		const seed = PRNG.generateSeed();
		let testAgainst = new PRNG(seed);
		for (let i = 0; i < 100; i++) {
			results.push(testAgainst.next());
		}
		for (let i = 0; i < 10; i++) {
			const cur = new PRNG(seed);
			for (let j = 0; j < 100; j++) {
				const n = cur.next();
				assert(results[j] === n, `generation ${j} for seed ${seed} did not match (expected: ${results[j]}, got ${n})`);
			}
		}
	});
});
