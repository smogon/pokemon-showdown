'use strict';

const assert = require('assert');

const {SmokeRunner} = require('./../../dev-tools/smoke');

describe.skip('SmokeRunner', async () => {
	it('should run successfully', async () => {
		const opts = {format: 'gen7doublescustomgame', maxGames: 1, prng: [1, 2, 3, 4]};
		assert.strictEqual(await (new SmokeRunner(opts).run()), 0);
	});
});
