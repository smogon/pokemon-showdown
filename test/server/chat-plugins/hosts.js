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

	it('should correctly sort a list of IP addresses', () => {
		const ipList = ['2.3.4.5', '100.1.1.1', '2.3.5.4', '150.255.255.255', '240.0.0.0'];
		ipList.sort(hosts.ipSort);
		assert.deepStrictEqual(ipList, ['2.3.4.5', '2.3.5.4', '100.1.1.1', '150.255.255.255', '240.0.0.0']);
	});

	it('should properly visualize an empty list of ranges', () => {
		assert.strictEqual(
			hosts.visualizeRangeList([]),
			`<tr><th>Lowest IP address</th><th>Highest IP address</th><th>Host</th></tr>`
		);
	});

	it('should not allow inserting a range where maxIP < minIP', () => {
		assert.throws(() => hosts.checkRangeConflicts({maxIP: 1000, minIP: 9999}, []));
	});

	it('should respect the widen parameter', () => {
		const ranges = [{
			minIP: 100,
			maxIP: 200,
		}];

		// Widen the minimum IP
		assert.throws(() => hosts.checkRangeConflicts({minIP: 99, maxIP: 200}, ranges, false));
		assert.doesNotThrow(() => hosts.checkRangeConflicts({minIP: 99, maxIP: 200}, ranges, true));

		// Widen the maximum IP
		assert.throws(() => hosts.checkRangeConflicts({minIP: 100, maxIP: 201}, ranges, false));
		assert.doesNotThrow(() => hosts.checkRangeConflicts({minIP: 100, maxIP: 201}, ranges, true));

		// Widen both IPs
		assert.throws(() => hosts.checkRangeConflicts({minIP: 99, maxIP: 201}, ranges, false));
		assert.doesNotThrow(() => hosts.checkRangeConflicts({minIP: 99, maxIP: 201}, ranges, true));

		// Don't widen at all
		assert.doesNotThrow(() => hosts.checkRangeConflicts({minIP: 98, maxIP: 99}, ranges, false));
		assert.doesNotThrow(() => hosts.checkRangeConflicts({minIP: 98, maxIP: 99}, ranges, true));
	});
});
