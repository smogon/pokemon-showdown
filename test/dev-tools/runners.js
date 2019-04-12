'use strict';

const assert = require('assert');

const {MultiRandomRunner, ExhaustiveRunner} = require('./../../.dev-tools-dist/runners');

describe('Runners (slow)', async function () {
	describe('MultiRandomRunner', async function () {
		it('should run successfully', async function () {
			this.timeout(0);
			const opts = {totalGames: 100, prng: [1, 2, 3, 4]};
			assert.strictEqual(await (new MultiRandomRunner(opts).run()), 0);
		});
	});
	describe('ExhaustiveRunner', async function () {
		it('should run successfully', async function () {
			this.timeout(0);
			const opts = {prng: [1, 2, 3, 4]};
			for (let format of ExhaustiveRunner.FORMATS) {
				opts.format = format;
				assert.strictEqual(await (new ExhaustiveRunner(opts).run()), 0);
			}
		});
	});
});
