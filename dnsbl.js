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

'use strict';

const BLOCKLISTS = ['sbl.spamhaus.org', 'rbl.efnetrbl.org'];

let dns = require('dns');

let Dnsbl = module.exports;

let dnsblCache = Dnsbl.cache = new Map();
dnsblCache.set('127.0.0.1', false);

function queryDnsblLoop(ip, callback, reversedIpDot, index) {
	if (index >= BLOCKLISTS.length) {
		// not in any blocklist
		dnsblCache.set(ip, false);
		callback(false);
		return;
	}
	let blocklist = BLOCKLISTS[index];
	dns.resolve4(reversedIpDot + blocklist, (err, addresses) => {
		if (!err) {
			// blocked
			dnsblCache.set(ip, blocklist);
			callback(blocklist);
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
Dnsbl.query = function queryDnsbl(ip, callback) {
	if (dnsblCache.has(ip)) {
		callback(dnsblCache.get(ip));
		return;
	}
	let reversedIpDot = ip.split('.').reverse().join('.') + '.';
	queryDnsblLoop(ip, callback, reversedIpDot, 0);
};

// require cidr and dns separately for ease of hotpatching
let cidr = require('./cidr.js');
let rangeLeaseweb = cidr.checker('207.244.64.0/18');
let rangeLeaseweb2 = cidr.checker('209.58.128.0/18');
let rangeLeaseweb3 = cidr.checker('103.254.152.0/22');
let rangeVoxility = cidr.checker('5.254.64.0/20');
let rangeCenet = cidr.checker('27.111.64.0/21');
let rangeQlded = cidr.checker('203.104.0.0/20');
let rangeCathednet = cidr.checker('180.95.40.0/21');
let rangeTelefonica = cidr.checker('181.64.0.0/14');
let rangeTelstra = cidr.checker('101.160.0.0/11');
let rangeStarhub = cidr.checker(['27.125.128.0/18', '101.127.0.0/17', '116.88.0.0/17', '122.11.192.0/18', '182.19.128.0/17', '182.55.0.0/16', '183.90.0.0/17', '203.116.122.0/23']);
let rangeUltrasurf = cidr.checker('65.49.0.0/17');

Dnsbl.reverse = function reverseDns(ip, callback) {
	if (ip) {
		if (ip.startsWith('106.76.') || ip.startsWith('106.77.') || ip.startsWith('106.78.') || ip.startsWith('106.79.') || ip.startsWith('112.110.') || ip.startsWith('27.97.') || ip.startsWith('49.15.') || ip.startsWith('49.14.') || ip.startsWith('1.187.')) {
			callback(null, ['ideacellular.mobile-nohost']);
			return;
		}
		if (ip.startsWith('172.56.') || ip.startsWith('149.254.')) {
			callback(null, ['tmobile.mobile-nohost']);
			return;
		}
		if (ip.startsWith('167.114.')) {
			callback(null, ['ovh.proxy-nohost']);
			return;
		}
		if (ip.startsWith('104.131.') || ip.startsWith('104.236.') || ip.startsWith('198.199.') || ip.startsWith('45.55.') || ip.startsWith('192.241.') || ip.startsWith('162.243.') || ip.startsWith('107.170.')) {
			callback(null, ['digitalocean.proxy-nohost']);
			return;
		}
		if (ip.startsWith('178.62.')) {
			callback(null, ['digitalocean.proxy-nohost']);
			return;
		}
		if (ip.startsWith('46.16.36.')) {
			callback(null, ['anchorfree.proxy-nohost']);
			return;
		}
		if (ip.startsWith('216.172.142.')) {
			callback(null, ['egihosting.proxy-nohost']);
			return;
		}
		if (ip.startsWith('217.78.0.')) {
			callback(null, ['dediserve.proxy-nohost']);
			return;
		}
		if (ip.startsWith('179.43.147.')) {
			callback(null, ['privatelayer.proxy-nohost']);
			return;
		}
		if (ip.startsWith('185.86.148.') || ip.startsWith('185.86.149.')) {
			callback(null, ['yourserver.se.proxy-nohost']);
			return;
		}
		if (rangeLeaseweb(ip) || rangeLeaseweb2(ip) || rangeLeaseweb3(ip) || rangeVoxility(ip)) {
			callback(null, ['zenmate.proxy-nohost']);
			return;
		}
		if (ip.startsWith('158.58.172.') || ip.startsWith('158.58.173.')) {
			callback(null, ['seflow.net.proxy-nohost']);
			return;
		}
		if (rangeCenet(ip) || rangeQlded(ip) || ip.startsWith('153.107.') || rangeCathednet(ip)) {
			callback(null, ['edu.au.res-nohost']);
			return;
		}
		if (ip.startsWith('179.7.')) {
			callback(null, ['claro.com.pe.mobile-nohost']);
			return;
		}
		if (ip.startsWith('190.') || rangeTelefonica(ip)) {
			callback(null, ['telefonica.net.pe.mobile-nohost']);
			return;
		}
		if (ip.startsWith('180.191.') || ip.startsWith('112.198.')) {
			callback(null, ['globe.com.ph.mobile-nohost']);
			return;
		}
		if (ip.startsWith('218.188.') || ip.startsWith('218.189.')) {
			callback(null, ['hgc.com.hk.mobile-nohost']);
			return;
		}
		if (ip.startsWith('172.242.') || ip.startsWith('172.243.')) {
			callback(null, ['viasat.com.mobile-nohost']);
			return;
		}
		if (ip.startsWith('201.141.')) {
			callback(null, ['cablevision.net.mx.mobile-nohost']);
			return;
		}
		if (rangeStarhub(ip)) {
			callback(null, ['starhub.com.mobile-nohost']);
			return;
		}
		if (ip.startsWith('202.12.94.') || ip.startsWith('202.12.95.')) {
			callback(null, ['nyp.edu.sg.res-nohost']);
			return;
		}
		if (ip.startsWith('64.150.')) {
			callback(null, ['illinois.net.res-nohost']);
			return;
		}
		if (ip.startsWith('189.204.')) {
			callback(null, ['bestel.com.mx.res-nohost']);
			return;
		}
		if (ip.startsWith('121.54.')) {
			callback(null, ['smart.com.ph.mobile-nohost']);
			return;
		}
		if (ip.startsWith('179.52.') || ip.startsWith('179.53.')) {
			callback(null, ['codetel.net.do.mobile-nohost']);
			return;
		}
		if (ip.startsWith('198.144.104.') || ip.startsWith('198.47.115.') || ip.startsWith('199.255.215.') || ip.startsWith('204.14.76.') || ip.startsWith('204.14.77.') || ip.startsWith('204.14.78.') || ip.startsWith('204.14.79.') || ip.startsWith('205.164.32.') || ip.startsWith('209.73.132.') || ip.startsWith('209.73.151.') || ip.startsWith('216.172.135.') || ip.startsWith('46.16.34.') || ip.startsWith('46.16.35.') || ip.startsWith('50.117.45.') || ip.startsWith('63.141.198.') || ip.startsWith('63.141.199.') || ip.startsWith('74.115.1.') || ip.startsWith('74.115.5.') || ip.startsWith('85.237.197.') || ip.startsWith('85.237.222.')) {
			callback(null, ['anchorfree.proxy-nohost']);
			return;
		}
		if (rangeUltrasurf(ip)) {
			callback(null, ['ultrasurf.proxy-nohost']);
			return;
		}
	}
	return require('dns').reverse(ip, (err, hosts) => {
		if (!hosts || !hosts[0]) {
			if (ip.startsWith('50.')) {
				hosts = ['comcast.net.res-nohost'];
			} else if (rangeTelstra(ip)) {
				hosts = ['telstra.net.res-nohost'];
			} else {
				hosts = ['' + ip.split('.').slice(0, 2).join('.') + '.unknown-nohost'];
			}
		}
		callback(err, hosts);
	});
};
