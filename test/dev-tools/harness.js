'use strict';

const assert = require('assert');

const {MultiRunner} = require('./../../dev-tools/harness');

describe.skip('MultiRunner', async () => {
	it('should run successfully', async () => {
		const opts = {totalGames: 1, prng: [1, 2, 3, 4]};
		assert.strictEqual(await (new MultiRunner(opts).run()), 0);
	});
});
