/**
 * DNSBL support [OPTIONAL]
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file controls support for DNSBLs. It's optional, so it can be
 * removed entirely safely.
 *
 * DNSBLs are DNS-based blackhole lists, which list IPs known for
 * running proxies, spamming, or other abuse. By default, PS will lock
 * users using these IPs.
 *
 * @license MIT license
 */

const BLOCKLISTS = ['sbl.spamhaus.org', 'rbl.efnetrbl.org'];

var dns = require('dns');

var dnsblCache = exports.cache = {
	'127.0.0.1': false
};

function queryDnsblLoop(ip, callback, reversedIpDot, index) {
	if (index >= BLOCKLISTS.length) {
		// not in any blocklist
		callback(dnsblCache[ip] = false);
		return;
	}
	var blocklist = BLOCKLISTS[index];
	dns.resolve4(reversedIpDot + blocklist, function (err, addresses) {
		if (!err) {
			// blocked
			callback(dnsblCache[ip] = blocklist);
		} else {
			// not blocked, try next blocklist
			queryDnsblLoop(ip, callback, reversedIpDot, index + 1);
		}
	});
}

/**
 * Dnsbl.query(ip, callback)
 *
 * Calls callback(blocklist), where blocklist is the blocklist domain
 * if the passed IP is in a blocklist, or boolean false if the IP is
 * not in any blocklist.
 */
exports.query = function queryDnsbl(ip, callback) {
	if (ip in dnsblCache) {
		callback(dnsblCache[ip]);
		return;
	}
	var reversedIpDot = ip.split('.').reverse().join('.') + '.';
	queryDnsblLoop(ip, callback, reversedIpDot, 0);
};
