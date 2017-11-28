/**
 * IP-based blocking
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file has various tools for IP parsing and IP-based blocking.
 *
 * These include DNSBLs: DNS-based blackhole lists, which list IPs known for
 * running proxies, spamming, or other abuse.
 *
 * We also maintain our own database of datacenter IP ranges (usually
 * proxies). These are taken from https://github.com/client9/ipcat
 * but include our own database as well.
 *
 * @license MIT license
 */

'use strict';

const BLOCKLISTS = ['sbl.spamhaus.org', 'rbl.efnetrbl.org'];

const dns = require('dns');
const FS = require('./fs');

let Dnsbl = module.exports;

/** @type {Map<string, string?>} */
let dnsblCache = Dnsbl.cache = new Map();
dnsblCache.set('127.0.0.1', null);

/**
 * @param {string} ip
 * @param {function(string?): void} callback
 * @param {string} reversedIpDot
 * @param {number} index
 */
function queryDnsblLoop(ip, callback, reversedIpDot, index) {
	if (index >= BLOCKLISTS.length) {
		// not in any blocklist
		dnsblCache.set(ip, null);
		callback(null);
		return;
	}
	let blocklist = BLOCKLISTS[index];
	dns.resolve4(reversedIpDot + blocklist, (err, addresses) => {
		if (!err) {
			// blocked
			dnsblCache.set(ip, blocklist);
			callback(blocklist);
			return;
		}
		// not blocked, try next blocklist
		queryDnsblLoop(ip, callback, reversedIpDot, index + 1);
	});
}

/**
 * Dnsbl.query(ip, callback)
 *
 * Calls callback(blocklist), where blocklist is the blocklist domain
 * if the passed IP is in a blocklist, or boolean false if the IP is
 * not in any blocklist.
 *
 * @param {string} ip
 * @return {Promise<string?>}
 */
Dnsbl.query = function queryDnsbl(ip) {
	if (dnsblCache.has(ip)) {
		return Promise.resolve(dnsblCache.get(ip) || null);
	}
	let reversedIpDot = ip.split('.').reverse().join('.') + '.';
	return new Promise((resolve, reject) => {
		queryDnsblLoop(ip, resolve, reversedIpDot, 0);
	});
};

/*********************************************************
 * IP parsing
 *********************************************************/

/**
 * @param {string} ip
 * @return {number}
 */
Dnsbl.ipToNumber = function (ip) {
	let num = 0;
	let parts = ip.split('.');
	for (const part of parts) {
		num *= 256;
		num += parseInt(part);
	}
	return num;
};

/**
 * @param {string} cidr
 * @return {?[number, number]}
 */
Dnsbl.getCidrPattern = function (cidr) {
	if (!cidr) return null;
	let index = cidr.indexOf('/');
	if (index <= 0) {
		return [Dnsbl.ipToNumber(cidr), Dnsbl.ipToNumber(cidr)];
	}
	let low = Dnsbl.ipToNumber(cidr.slice(0, index));
	let bits = parseInt(cidr.slice(index + 1));
	// fun fact: this fails if bits <= 1 because JavaScript
	// does << with signed int32s.
	let high = low + (1 << (32 - bits)) - 1;
	return [low, high];
};
/**
 * @param {string} range
 * @return {?[number, number]}
 */
Dnsbl.getRangePattern = function (range) {
	if (!range) return null;
	let index = range.indexOf(' - ');
	if (index <= 0) {
		return [Dnsbl.ipToNumber(range), Dnsbl.ipToNumber(range)];
	}
	let low = Dnsbl.ipToNumber(range.slice(0, index));
	let high = Dnsbl.ipToNumber(range.slice(index + 3));
	return [low, high];
};
/**
 * @param {string} str
 * @return {?[number, number]}
 */
Dnsbl.getPattern = function (str) {
	if (!str) return null;
	if (str.indexOf(' - ') > 0) return Dnsbl.getRangePattern(str);
	return Dnsbl.getCidrPattern(str);
};
/**
 * @param {string | string[]} cidr
 * @return {[number, number][]}
 */
Dnsbl.cidrToPattern = function (cidr) {
	if (!cidr || !cidr.length) {
		return [];
	}
	if (typeof cidr === 'string') {
		let pattern = Dnsbl.getCidrPattern(cidr);
		if (!pattern) return [];
		return [pattern];
	}
	// $FlowFixMe: flow doesn't understand filter
	return cidr.map(Dnsbl.getCidrPattern).filter(x => x);
};
/**
 * @param {string | string[]} range
 * @return {[number, number][]}
 */
Dnsbl.rangeToPattern = function (range) {
	if (!range || !range.length) {
		return [];
	}
	if (typeof range === 'string') {
		let pattern = Dnsbl.getRangePattern(range);
		if (!pattern) return [];
		return [pattern];
	}
	// $FlowFixMe: flow doesn't understand filter
	return range.map(Dnsbl.getRangePattern).filter(x => x);
};
/**
 * @param {number[][]} patterns
 * @param {number} num
 * @return {boolean}
 */
Dnsbl.checkPattern = function (patterns, num) {
	for (const pattern of patterns) {
		if (num >= pattern[0] && num <= pattern[1]) {
			return true;
		}
	}
	return false;
};

/**
 * Returns a checker function for the passed IP range or array of
 * ranges. The checker function returns true if its passed IP is
 * in the range.
 *
 * @param {string | string[]} ranges
 * @return {function(string): boolean}
 */
Dnsbl.checker = function (ranges) {
	if (!ranges || !ranges.length) return () => false;
	/** @type {[number, number][]} */
	let patterns;
	if (typeof ranges === 'string') {
		patterns = [Dnsbl.getPattern(ranges)];
	} else {
		patterns = ranges.map(Dnsbl.getPattern).filter(x => x);
	}
	return ip => Dnsbl.checkPattern(patterns, Dnsbl.ipToNumber(ip));
};

/*********************************************************
 * Datacenter parsing
 *********************************************************/

/**
 * @param {string} url
 * @return {string}
 */
Dnsbl.urlToHost = function (url) {
	if (url.startsWith('http://')) url = url.slice(7);
	if (url.startsWith('https://')) url = url.slice(8);
	if (url.startsWith('www.')) url = url.slice(4);
	let slashIndex = url.indexOf('/');
	if (slashIndex > 0) url = url.slice(0, slashIndex);
	return url;
};

Dnsbl.datacenters = [];
Dnsbl.loadDatacenters = async function () {
	const data = await FS('config/datacenters.csv').readTextIfExists();
	const rows = data.split('\n');
	let datacenters = [];
	for (const row of rows) {
		if (!row) continue;
		const rowSplit = row.split(',');
		const rowData = [
			Dnsbl.ipToNumber(rowSplit[0]),
			Dnsbl.ipToNumber(rowSplit[1]),
			Dnsbl.urlToHost(rowSplit[3]),
		];
		datacenters.push(rowData);
	}
	Dnsbl.datacenters = datacenters;
};

let rangeTmobile = Dnsbl.cidrToPattern('172.32.0.0/11');
let rangeCenet = Dnsbl.cidrToPattern('27.111.64.0/21');
let rangeQlded = Dnsbl.cidrToPattern('203.104.0.0/20');
let rangeCathednet = Dnsbl.cidrToPattern('180.95.40.0/21');
let rangeTelefonica = Dnsbl.cidrToPattern('181.64.0.0/14');
let rangeStarhub = Dnsbl.cidrToPattern(['27.125.128.0/18', '101.127.0.0/17', '116.88.0.0/17', '122.11.192.0/18', '182.19.128.0/17', '182.55.0.0/16', '183.90.0.0/17', '203.116.122.0/23']);
let rangeTelstra = Dnsbl.cidrToPattern('101.160.0.0/11');

let rangeOVHres = Dnsbl.rangeToPattern(['109.190.0.0 - 109.190.63.255', '109.190.64.0 - 109.190.127.255', '109.190.128.0 - 109.190.191.255', '109.190.192.0 - 109.190.255.255', '151.80.228.0 - 151.80.228.255', '178.32.37.0 - 178.32.37.255', '178.33.101.0 - 178.33.101.255', '185.15.68.0 - 185.15.69.255', '185.15.70.0 - 185.15.71.255']);

/**
 * Will not reject; IPs with no RDNS entry will resolve to
 * '[byte1].[byte2].unknown-nohost'.
 *
 * @param {string} ip
 * @return {Promise<string>}
 */
Dnsbl.reverse = function reverseDns(ip) {
	return new Promise((resolve, reject) => {
		if (!ip) {
			resolve('');
			return;
		}

		let ipNumber = Dnsbl.ipToNumber(ip);
		if (Dnsbl.checkPattern(rangeOVHres, ipNumber)) {
			resolve('ovh.fr.res-nohost');
			return;
		}
		for (const row of Dnsbl.datacenters) {
			if (ipNumber >= row[0] && ipNumber <= row[1]) {
				resolve(row[2] + '.proxy-nohost');
				return;
			}
		}
		if (ip.startsWith('106.76.') || ip.startsWith('106.77.') || ip.startsWith('106.78.') || ip.startsWith('106.79.') || ip.startsWith('112.110.') || ip.startsWith('27.97.') || ip.startsWith('49.15.') || ip.startsWith('49.14.') || ip.startsWith('1.187.')) {
			resolve('ideacellular.mobile-nohost');
			return;
		}
		if (Dnsbl.checkPattern(rangeTmobile, ipNumber) || ip.startsWith('149.254.')) {
			resolve('tmobile.mobile-nohost');
			return;
		}
		if (Dnsbl.checkPattern(rangeCenet, ipNumber) || Dnsbl.checkPattern(rangeQlded, ipNumber) || ip.startsWith('153.107.') || Dnsbl.checkPattern(rangeCathednet, ipNumber)) {
			resolve('edu.au.res-nohost');
			return;
		}
		if (ip.startsWith('179.7.')) {
			resolve('claro.com.pe.mobile-nohost');
			return;
		}
		if (ip.startsWith('190.') || Dnsbl.checkPattern(rangeTelefonica, ipNumber)) {
			resolve('telefonica.net.pe.mobile-nohost');
			return;
		}
		if (ip.startsWith('180.191.') || ip.startsWith('112.198.')) {
			resolve('globe.com.ph.mobile-nohost');
			return;
		}
		if (ip.startsWith('218.188.') || ip.startsWith('218.189.')) {
			resolve('hgc.com.hk.mobile-nohost');
			return;
		}
		if (ip.startsWith('172.242.') || ip.startsWith('172.243.')) {
			resolve('viasat.com.mobile-nohost');
			return;
		}
		if (ip.startsWith('201.141.')) {
			resolve('cablevision.net.mx.mobile-nohost');
			return;
		}
		if (Dnsbl.checkPattern(rangeStarhub, ipNumber)) {
			resolve('starhub.com.mobile-nohost');
			return;
		}
		if (ip.startsWith('202.12.94.') || ip.startsWith('202.12.95.')) {
			resolve('nyp.edu.sg.res-nohost');
			return;
		}
		if (ip.startsWith('64.150.')) {
			resolve('illinois.net.res-nohost');
			return;
		}
		if (ip.startsWith('189.204.')) {
			resolve('bestel.com.mx.res-nohost');
			return;
		}
		if (ip.startsWith('121.54.')) {
			resolve('smart.com.ph.mobile-nohost');
			return;
		}
		if (ip.startsWith('179.52.') || ip.startsWith('179.53.')) {
			resolve('codetel.net.do.mobile-nohost');
			return;
		}
		if (ip.startsWith('46.16.36.')) {
			resolve('anchorfree.proxy-nohost');
			return;
		}
		if (ip.startsWith('198.144.104.') || ip.startsWith('198.47.115.') || ip.startsWith('199.255.215.') || ip.startsWith('204.14.76.') || ip.startsWith('204.14.77.') || ip.startsWith('204.14.78.') || ip.startsWith('204.14.79.') || ip.startsWith('205.164.32.') || ip.startsWith('209.73.132.') || ip.startsWith('209.73.151.') || ip.startsWith('216.172.135.') || ip.startsWith('46.16.34.') || ip.startsWith('46.16.35.') || ip.startsWith('50.117.45.') || ip.startsWith('63.141.198.') || ip.startsWith('63.141.199.') || ip.startsWith('74.115.1.') || ip.startsWith('74.115.5.') || ip.startsWith('85.237.197.') || ip.startsWith('85.237.222.')) {
			resolve('anchorfree.proxy-nohost');
			return;
		}
		if (ip === '127.0.0.1') {
			resolve('localhost');
			return;
		}
		dns.reverse(ip, (err, hosts) => {
			if (err) {
				resolve('' + ip.split('.').slice(0, 2).join('.') + '.unknown-nohost');
				return;
			}
			if (!hosts || !hosts[0]) {
				if (ip.startsWith('50.')) {
					resolve('comcast.net.res-nohost');
				} else if (Dnsbl.checkPattern(rangeTelstra, ipNumber)) {
					resolve('telstra.net.res-nohost');
				} else {
					resolve('' + ip.split('.').slice(0, 2).join('.') + '.unknown-nohost');
				}
			}
			resolve(hosts[0]);
		});
	});
};

