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

// require cidr and dns separately for ease of hotpatching
var cidr = require('./cidr.js');
var rangeLeaseweb = cidr.checker('207.244.64.0/18');
var rangeLeaseweb2 = cidr.checker('209.58.128.0/18');
var rangeLeaseweb3 = cidr.checker('103.254.152.0/22');
var rangeVoxility = cidr.checker('5.254.64.0/20');

exports.reverse = function reverseDns(ip, callback) {
	if (ip) {
		if (ip.startsWith('106.76.') || ip.startsWith('106.77.') || ip.startsWith('106.78.') || ip.startsWith('106.79.') || ip.startsWith('112.110.') || ip.startsWith('27.97.') || ip.startsWith('49.15.') || ip.startsWith('49.14.') || ip.startsWith('1.187.')) {
			callback(null, ['ideacellular.nohost']);
			return;
		}
		if (ip.startsWith('172.56.') || ip.startsWith('149.254.')) {
			callback(null, ['tmobile.nohost']);
			return;
		}
		if (ip.startsWith('167.114.')) {
			callback(null, ['ovh.nohost']);
			return;
		}
		if (ip.startsWith('104.131.') || ip.startsWith('104.236.') || ip.startsWith('198.199.') || ip.startsWith('45.55.') || ip.startsWith('192.241.') || ip.startsWith('162.243.') || ip.startsWith('107.170.')) {
			callback(null, ['digitalocean.nohost']);
			return;
		}
		if (ip.startsWith('178.62.')) {
			callback(null, ['digitalocean.nohost']);
			return;
		}
		if (ip.startsWith('46.16.36.')) {
			callback(null, ['anchorfree.nohost']);
			return;
		}
		if (ip.startsWith('216.172.142.')) {
			callback(null, ['egihosting.nohost']);
			return;
		}
		if (rangeLeaseweb(ip) || rangeLeaseweb2(ip) || rangeLeaseweb3(ip) || rangeVoxility(ip)) {
			callback(null, ['zenmate.nohost']);
			return;
		}
	}
	return require('dns').reverse(ip, callback);
};
