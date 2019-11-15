'use strict';

const assert = require('assert');

const {ExhaustiveRunner} = require('../../../.sim-dist/tools/exhaustive-runner');

describe('ExhaustiveRunner (slow)', async function () {
	it('should run successfully', async function () {
		this.timeout(0);
		const opts = {prng: [1, 2, 3, 4]};
		for (let format of ExhaustiveRunner.FORMATS) {
			opts.format = format;
			assert.strictEqual(await (new ExhaustiveRunner(opts).run()), 0);
		}
	});
});
