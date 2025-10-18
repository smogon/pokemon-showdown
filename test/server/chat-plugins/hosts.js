/**
 * Tests for the Hosts chat plugin
 * Written by Annika
 */

'use strict';

const assert = require('assert').strict;

describe("Hosts plugin", () => {
	let hosts = null;

	before(() => {
		hosts = require('../../../dist/server/chat-plugins/hosts');
	});

	it('should properly visualize an empty list of ranges', () => {
		assert.equal(
			hosts.visualizeRangeList([]),
			`<tr><th>Lowest IP address</th><th>Highest IP address</th><th>Host</th></tr>`
		);
	});
});
