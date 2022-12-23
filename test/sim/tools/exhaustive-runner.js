'use strict';

const assert = require('assert').strict;

const {ExhaustiveRunner} = require('../../../dist/sim/tools/exhaustive-runner');

describe('ExhaustiveRunner (slow)', async function () {
	it('should run successfully', async function () {
		this.timeout(0);
		const opts = {prng: [1, 2, 3, 4]};
		for (const format of ExhaustiveRunner.FORMATS) {
			opts.format = format;
			assert.equal(await (new ExhaustiveRunner(opts).run()), 0);
		}
	});
});
