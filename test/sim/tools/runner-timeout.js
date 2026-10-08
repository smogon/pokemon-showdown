'use strict';

const assert = require('assert').strict;

const { Runner } = require('../../../dist/sim/tools/runner');

describe('Runner timeoutMs', () => {
	it('should reject with a timeout error when a battle exceeds the timeout', async () => {
		const originalError = console.error;
		const originalLog = console.log;
		console.error = () => {};
		console.log = () => {};

		let caught;
		try {
			await new Runner({
				format: 'gen9customgame',
				prng: [1, 2, 3, 4],
				error: true,
				timeoutMs: 1,
			}).run();
		} catch (err) {
			caught = err;
		} finally {
			// eslint-disable-next-line require-atomic-updates
			console.error = originalError;
			// eslint-disable-next-line require-atomic-updates
			console.log = originalLog;
		}

		assert(caught instanceof Error, 'expected runner.run() to reject');
		assert.equal(caught.message, 'Battle timed out after 1ms');
	});
});
