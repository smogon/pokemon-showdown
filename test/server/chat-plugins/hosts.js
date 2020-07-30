/**
 * Tests for the Hosts chat plugin
 * Written by Annika
 */

'use strict';

const assert = require('assert').strict;
let hosts;

describe("Hosts plugin", () => {
	before(() => {
		hosts = require('../../../.server-dist/chat-plugins/hosts');
	});

	it('should properly visualize an empty list of ranges', () => {
		assert.strictEqual(
			hosts.visualizeRangeList([]),
			`<tr><th>Lowest IP address</th><th>Highest IP address</th><th>Host</th></tr>`
		);
	});
});
