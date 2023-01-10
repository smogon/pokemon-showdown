/**
 * Tests for the IPTools class
 * Written by Annika
 */

'use strict';

const assert = require('assert').strict;
const IPTools = require('../../dist/server/ip-tools').IPTools;
const Utils = require('../../dist/lib/utils').Utils;

describe("IP tools", () => {
	it('should resolve 127.0.0.1 to localhost', async () => {
		const lookup = await IPTools.lookup('127.0.0.1');
		assert.equal(lookup.host, 'localhost');
	});

	it('should resolve unknown IPs correctly', async () => {
		const lookup = await IPTools.lookup('255.255.255.255');
		assert.equal(lookup.host, '255.255?/unknown');
		assert.equal(lookup.hostType, 'unknown');
	});

	it('should parse CIDR ranges', () => {
		const range = IPTools.getCidrRange('42.42.0.0/18');
		assert.equal(range.minIP, IPTools.ipToNumber('42.42.0.0'));
		assert.equal(range.maxIP, IPTools.ipToNumber('42.42.63.255'));
	});

	it('should guess whether a range is CIDR or hyphen', () => {
		const cidrRange = IPTools.stringToRange('42.42.0.0/18');
		const stringRange = IPTools.stringToRange('42.42.0.0 - 42.42.63.255');
		assert.deepEqual(cidrRange, stringRange);
	});

	it('should not parse invalid ranges', () => {
		assert.equal(IPTools.isValidRange('42.42.10.0 - 42.42.5.0'), false);
		assert.equal(IPTools.isValidRange('250.0.0.0 - 260.0.0.0'), false);
		assert.equal(IPTools.isValidRange('250.0.0.0/43'), false);
		assert.equal(IPTools.isValidRange('250.0.0.0/16x'), false);
		assert.equal(IPTools.isValidRange('250.0.0.0.1/24'), false);
		assert.equal(IPTools.isValidRange('250.0.0.0.1 - 250.0.0.2'), false);
		assert.equal(IPTools.isValidRange('250.0.0.0.*'), false);
	});

	it('should reject invalid IPs', () => {
		assert.equal(IPTools.ipToNumber('256.0.0.0'), null);
		assert.equal(IPTools.ipToNumber('42.0.0.1111'), null);
		assert.equal(IPTools.ipToNumber('42.0.hi.0'), null);
		assert.equal(IPTools.ipToNumber('256.0.0.0.1'), null);
		assert.equal(IPTools.ipToNumber('256.0.0hi.1'), null);
		assert.equal(IPTools.ipToNumber('256.0.1'), null);

		assert.equal(IPTools.numberToIP(-1), null);
	});

	it('should be able to convert IPs in both directions', () => {
		assert.equal(IPTools.ipToNumber(IPTools.numberToIP(0)), 0);
		assert.equal(IPTools.numberToIP(IPTools.ipToNumber('0.0.0.1')), '0.0.0.1');
		assert.equal(IPTools.ipToNumber(IPTools.numberToIP(56468451)), 56468451);
	});

	it('should check if an IP is in a range', () => {
		const range = IPTools.stringToRange('1.1.1.1 - 1.1.1.3');

		// Checks that beginning, middle, and end match
		assert(IPTools.checkPattern([range], IPTools.ipToNumber('1.1.1.1')));
		assert(IPTools.checkPattern([range], IPTools.ipToNumber('1.1.1.2')));
		assert(IPTools.checkPattern([range], IPTools.ipToNumber('1.1.1.3')));

		// Checks for off-by-one errors
		assert(!IPTools.checkPattern([range], IPTools.ipToNumber('1.1.1.0')));
		assert(!IPTools.checkPattern([range], IPTools.ipToNumber('1.1.1.4')));

		// Checks that a random IP does not match
		assert(!IPTools.checkPattern([range], IPTools.ipToNumber('42.42.42.42')));
	});

	it('should handle wildcards in string ranges', () => {
		assert.deepEqual(
			IPTools.stringToRange('1.*'),
			{minIP: IPTools.ipToNumber('1.0.0.0'), maxIP: IPTools.ipToNumber('1.255.255.255')}
		);
		assert.deepEqual(
			IPTools.stringToRange('1.1.*'),
			{minIP: IPTools.ipToNumber('1.1.0.0'), maxIP: IPTools.ipToNumber('1.1.255.255')}
		);
		assert.deepEqual(
			IPTools.stringToRange('1.1.1.*'),
			{minIP: IPTools.ipToNumber('1.1.1.0'), maxIP: IPTools.ipToNumber('1.1.1.255')}
		);
	});

	it('should handle single IPs as string ranges', () => {
		assert.deepEqual(
			IPTools.stringToRange('1.1.1.1'),
			{minIP: IPTools.ipToNumber('1.1.1.1'), maxIP: IPTools.ipToNumber('1.1.1.1')}
		);
	});
});

describe("IP tools helper functions", () => {
	it("ipToNumber and numberToIp should be each other's inverses", () => {
		const numTests = 10;
		for (let i = 0; i < numTests; i++) {
			const testNumber = Math.floor(Math.random() * 4294967294) + 1;
			assert.equal(IPTools.ipToNumber(IPTools.numberToIP(testNumber)), testNumber);
		}
	});

	it("should produce sortable IP numbers", () => {
		const unsortedIPs = ['2.3.4.5', '100.1.1.1', '2.3.5.4', '150.255.255.255', '240.0.0.0'];
		const sortedIPs = ['2.3.4.5', '2.3.5.4', '100.1.1.1', '150.255.255.255', '240.0.0.0'];
		const sortedIPNumbers = unsortedIPs.map(ip => IPTools.ipToNumber(ip));
		Utils.sortBy(sortedIPNumbers);
		assert.deepEqual(sortedIPNumbers.map(ipnum => IPTools.numberToIP(ipnum)), sortedIPs);
	});

	it('should convert URLs to hosts', () => {
		assert.equal(IPTools.urlToHost('https://www.annika.codes/some/path'), 'annika.codes');
		assert.equal(IPTools.urlToHost('http://annika.codes/path'), 'annika.codes');
		assert.equal(IPTools.urlToHost('https://annika.codes/'), 'annika.codes');
	});

	it('should correctly sort a list of IP addresses', () => {
		const ipList = ['2.3.4.5', '100.1.1.1', '2.3.5.4', '150.255.255.255', '240.0.0.0'];
		Utils.sortBy(ipList, IPTools.ipToNumber);
		assert.deepEqual(ipList, ['2.3.4.5', '2.3.5.4', '100.1.1.1', '150.255.255.255', '240.0.0.0']);
	});
});

describe('IP range conflict checker', () => {
	it('should not allow inserting a range where maxIP < minIP', () => {
		assert.throws(() => IPTools.checkRangeConflicts({maxIP: 1000, minIP: 9999}, []));
	});

	it('should respect the widen parameter', () => {
		const ranges = [{
			minIP: 100,
			maxIP: 200,
		}];

		// Widen the minimum IP
		assert.throws(() => IPTools.checkRangeConflicts({minIP: 99, maxIP: 200}, ranges, false));
		assert.doesNotThrow(() => IPTools.checkRangeConflicts({minIP: 99, maxIP: 200}, ranges, true));

		// Widen the maximum IP
		assert.throws(() => IPTools.checkRangeConflicts({minIP: 100, maxIP: 201}, ranges, false));
		assert.doesNotThrow(() => IPTools.checkRangeConflicts({minIP: 100, maxIP: 201}, ranges, true));

		// Widen both IPs
		assert.throws(() => IPTools.checkRangeConflicts({minIP: 99, maxIP: 201}, ranges, false));
		assert.doesNotThrow(() => IPTools.checkRangeConflicts({minIP: 99, maxIP: 201}, ranges, true));

		// Don't widen at all
		assert.doesNotThrow(() => IPTools.checkRangeConflicts({minIP: 98, maxIP: 99}, ranges, false));
		assert.doesNotThrow(() => IPTools.checkRangeConflicts({minIP: 98, maxIP: 99}, ranges, true));
	});
});
