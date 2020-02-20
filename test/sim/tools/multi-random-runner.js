'use strict';

const assert = require('assert').strict;

const {MultiRandomRunner} = require('../../../.sim-dist/tools/multi-random-runner');

describe('MultiRandomRunner (slow)', async function () {
	it('should run successfully', async function () {
		this.timeout(0);
		const opts = {totalGames: 100, prng: [1, 2, 3, 4]};
		assert.equal(await (new MultiRandomRunner(opts).run()), 0);
	});
});
