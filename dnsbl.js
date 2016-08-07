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
let fs = require('fs');
let path = require('path');

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
			return callback(blocklist);
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
 */
Dnsbl.query = function queryDnsbl(ip, callback) {
	if (dnsblCache.has(ip)) {
		callback(dnsblCache.get(ip));
		return;
	}
	let reversedIpDot = ip.split('.').reverse().join('.') + '.';
	queryDnsblLoop(ip, callback, reversedIpDot, 0);
};

Dnsbl.ipToNumber = function (ip) {
	let number = 0;
	for (let digit of ip.split('.')) {
		number = number * 256 + parseInt(digit);
	}
	return number;
};
Dnsbl.urlToHost = function (url) {
	if (url.startsWith('http://')) url = url.slice(7);
	if (url.startsWith('https://')) url = url.slice(8);
	if (url.startsWith('www.')) url = url.slice(4);
	let slashIndex = url.indexOf('/');
	if (slashIndex > 0) url = url.slice(0, slashIndex);
	return url;
};

Dnsbl.datacenters = [];
Dnsbl.loadDatacenters = function () {
	fs.readFile(path.resolve(__dirname, 'config/datacenters.csv'), (err, data) => {
		if (err) return;
		data = ('' + data).split("\n");
		let datacenters = [];
		for (let row of data) {
			if (!row) continue;
			let rowSplit = row.split(',');
			let rowData = [
				Dnsbl.ipToNumber(rowSplit[0]),
				Dnsbl.ipToNumber(rowSplit[1]),
				Dnsbl.urlToHost(rowSplit[3]),
			];
			datacenters.push(rowData);
		}
		Dnsbl.datacenters = datacenters;
	});
};

let cidr = require('./cidr.js');
let rangeTmobile = cidr.checker('172.32.0.0/11');
let rangeCenet = cidr.checker('27.111.64.0/21');
let rangeQlded = cidr.checker('203.104.0.0/20');
let rangeCathednet = cidr.checker('180.95.40.0/21');
let rangeTelefonica = cidr.checker('181.64.0.0/14');
let rangeStarhub = cidr.checker(['27.125.128.0/18', '101.127.0.0/17', '116.88.0.0/17', '122.11.192.0/18', '182.19.128.0/17', '182.55.0.0/16', '183.90.0.0/17', '203.116.122.0/23']);
let rangeTelstra = cidr.checker('101.160.0.0/11');

/**
 * Returns a Promise(host: string)
 *
 * Will not reject; IPs with no RDNS entry will resolve to
 * '[byte1].[byte2].unknown-nohost'.
 */
Dnsbl.reverse = function reverseDns(ip, callback) {
	return new Promise((resolve, reject) => {
		if (!ip) {
			resolve('');
			return;
		}
		let ipNumber = Dnsbl.ipToNumber(ip);
		for (let row of Dnsbl.datacenters) {
			if (ipNumber >= row[0] && ipNumber <= row[1]) {
				resolve(row[2] + '.proxy-nohost');
				return;
			}
		}
		if (ip.startsWith('106.76.') || ip.startsWith('106.77.') || ip.startsWith('106.78.') || ip.startsWith('106.79.') || ip.startsWith('112.110.') || ip.startsWith('27.97.') || ip.startsWith('49.15.') || ip.startsWith('49.14.') || ip.startsWith('1.187.')) {
			resolve('ideacellular.mobile-nohost');
			return;
		}
		if (rangeTmobile(ip) || ip.startsWith('149.254.')) {
			resolve('tmobile.mobile-nohost');
			return;
		}
		if (rangeCenet(ip) || rangeQlded(ip) || ip.startsWith('153.107.') || rangeCathednet(ip)) {
			resolve('edu.au.res-nohost');
			return;
		}
		if (ip.startsWith('179.7.')) {
			resolve('claro.com.pe.mobile-nohost');
			return;
		}
		if (ip.startsWith('190.') || rangeTelefonica(ip)) {
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
		if (rangeStarhub(ip)) {
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
		require('dns').reverse(ip, (err, hosts) => {
			if (err) {
				resolve('' + ip.split('.').slice(0, 2).join('.') + '.unknown-nohost');
				return;
			}
			if (!hosts || !hosts[0]) {
				if (ip.startsWith('50.')) {
					resolve('comcast.net.res-nohost');
				} else if (rangeTelstra(ip)) {
					resolve('telstra.net.res-nohost');
				} else {
					resolve('' + ip.split('.').slice(0, 2).join('.') + '.unknown-nohost');
				}
			}
			resolve(hosts[0]);
		});
	});
};

Dnsbl.loadDatacenters();
