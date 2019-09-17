/**
 * IP Tools
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * IPTools file has various tools for IP parsing and IP-based blocking.
 *
 * These include DNSBLs: DNS-based blackhole lists, which list IPs known for
 * running proxies, spamming, or other abuse.
 *
 * We also maintain our own database of datacenter IP ranges (usually
 * proxies). These are taken from https://github.com/client9/ipcat
 * but include our own database as well.
 *
 * @license MIT
 */

'use strict';

const BLOCKLISTS = ['sbl.spamhaus.org', 'rbl.efnetrbl.org'];

import * as dns from 'dns';
import {FS} from '../lib/fs';

export const IPTools = new class {
	dnsblCache = new Map<string, string | null>([
		['127.0.0.1', null],
	]);

	proxyHosts = new Set([
		'alexhost.md',
		'amazonaws.com',
		'anchorfree.com',
		'aquanetworks.co.uk',
		'aruba.it',
		'arubacloud.com',
		'arubacloud.de',
		'arubacloud.fr',
		'as29550.net',
		'avenueoftor.com',
		'bitcoinwebhosting.net',
		'blazingfast.io',
		'bnewstoday.com',
		'brightnewfutures.net',
		'cd-n.net',
		'choopa.com',
		'choopa.net',
		'cloudhosting.lv',
		'cloudmosa.com',
		'clues.ro',
		'colocenter.nl',
		'colocrossing.com',
		'contaboserver.net',
		'cyberghost.ro',
		'cyberghostvpn.com',
		'darkweb.love',
		'dockerapp.io',
		'edis.at',
		'elostech.cz',
		'enahost.com',
		'ezzi.net',
		'fantastic-host.net',
		'forpsi.net',
		'freedome-vpn.net',
		'frootvpn.com',
		'galaxyhostplus.com',
		'gigenet.com',
		'h2dns.net',
		'hide.me',
		'hkserverworks.com',
		'hostnottingham.co.uk',
		'hostwindsdns.com',
		'hvvc.us',
		'hwng.net',
		'ihc.ru',
		'ipvanish.com',
		'linode.com',
		'ltt.ly',
		'lunanode.com',
		'm247.com',
		'mediateam.fi',
		'midphase.com',
		'mivocloud.com',
		'mixskilled.com',
		'netdive.xyz',
		'networktransit.net',
		'northamericancoax.com',
		'northghost.com',
		'novalayer.net',
		'nu-s.net',
		'op-net.com',
		'openvirtuals.com',
		'opera.com',
		'pacswitch.com',
		'poneytelecom.eu',
		'primegraf.com.br',
		'privacyfoundation.ch',
		'protectedgroup.com',
		'quadranet.com',
		'ra4wvpn.com',
		'redstation.co.uk',
		'redstation.net.uk',
		'samsnuk.info',
		'scaleway.com',
		'servercontrol.com.au',
		'serverprofi24.com',
		'shinyrimsinc.com',
		'shpv.eu',
		'sl-reverse.com',
		'smartwebbrands.com',
		'softlayer.com',
		'stephost.md',
		'terrahost.no',
		'time4vps.eu',
		'trance.fm',
		'tunnelbear.com',
		'ubiquityservers.com',
		'uaservers.net',
		'ukservers.com',
		'unmetered.zone',
		'upcloud.host',
		'vilayer.com',
		'voxility.com',
		'voxility.net',
		'vpnbook.com',
		'vultr.com',
		'worldstream.nl',
		'your-server.de',
		'zenmate.com',
	]);
	residentialHosts = new Set([
		'bell.ca',
		'bellmts.net',
		'bellsouth.net',
		'cgocable.net',
		'charter.com',
		'comcast.net',
		'comcast.net.res-nohost',
		'comcastbusiness.net',
		'cornell.edu',
		'cox.net',
		'embarqhsd.net',
		'frontiernet.net',
		'hargray.net',
		'itctel.com',
		'mlgc.com',
		'netins.net',
		'optonline.net',
		'odu.edu',
		'osu.edu',
		'qwest.net',
		'rogers.com',
		'rr.com',
		'sbcglobal.net',
		'shawcable.net',
		'sonic.net',
		'sourcecable.net',
		'unc.edu',
		'verizon.net',
		'videotron.ca',
		'virginmobile.ca',
		'vt.edu',
		'wayport.net',
		'windstream.net',
	]);
	mobileHosts = new Set([
		'myvzw.com',
		'mycingular.net',
		'spcsdns.net',
		'tmodns.net',
		'tmobile.mobile-nohost',
		'tele2.se',
		'ideacellular.mobile-nohost',
		'as13285.net',
		'att.net',
	]);
	connectionTestCache = new Map<string, boolean>();

	async lookup(ip: string) {
		const [dnsbl, host] = await Promise.all([
			IPTools.queryDnsbl(ip),
			IPTools.getHost(ip),
		]);
		const shortHost = this.shortenHost(host);
		const hostType = this.getHostType(shortHost, ip);
		return {dnsbl, host, shortHost, hostType};
	}

	queryDnsblLoop(ip: string, callback: (val: string | null) => void, reversedIpDot: string, index: number) {
		if (index >= BLOCKLISTS.length) {
			// not in any blocklist
			IPTools.dnsblCache.set(ip, null);
			callback(null);
			return;
		}
		const blocklist = BLOCKLISTS[index];
		dns.lookup(reversedIpDot + blocklist, 4, (err, res) => {
			if (!err) {
				// blocked
				IPTools.dnsblCache.set(ip, blocklist);
				callback(blocklist);
				return;
			}
			// not blocked, try next blocklist
			IPTools.queryDnsblLoop(ip, callback, reversedIpDot, index + 1);
		});
	}

	/**
	 * IPTools.queryDnsbl(ip, callback)
	 *
	 * Calls callb
	 * ack(blocklist), where blocklist is the blocklist domain
	 * if the passed IP is in a blocklist, or null if the IP is not in
	 * any blocklist.
	 *
	 * Return value matches isBlocked when treated as a boolean.
	 */
	queryDnsbl(ip: string) {
		if (!Config.dnsbl) return null;
		if (IPTools.dnsblCache.has(ip)) {
			return Promise.resolve<string | null>(IPTools.dnsblCache.get(ip) || null);
		}
		const reversedIpDot = ip.split('.').reverse().join('.') + '.';
		return new Promise<string | null>((resolve, reject) => {
			IPTools.queryDnsblLoop(ip, resolve, reversedIpDot, 0);
		});
	}

/*********************************************************
 * IP parsing
 *********************************************************/

	ipToNumber(ip: string) {
		if (ip.includes(':') && !ip.includes('.')) {
			// IPv6
			return -1;
		}
		if (ip.startsWith('::ffff:')) ip = ip.slice(7);
		else if (ip.startsWith('::')) ip = ip.slice(2);
		let num = 0;
		const parts = ip.split('.');
		for (const part of parts) {
			num *= 256;
			num += parseInt(part);
		}
		return num;
	}

	getCidrPattern(cidr: string): [number, number] | null {
		if (!cidr) return null;
		const index = cidr.indexOf('/');
		if (index <= 0) {
			return [IPTools.ipToNumber(cidr), IPTools.ipToNumber(cidr)];
		}
		const low = IPTools.ipToNumber(cidr.slice(0, index));
		const bits = parseInt(cidr.slice(index + 1));
		// fun fact: IPTools fails if bits <= 1 because JavaScript
		// does << with signed int32s.
		const high = low + (1 << (32 - bits)) - 1;
		return [low, high];
	}
	getRangePattern(range: string): [number, number] | null {
		if (!range) return null;
		const index = range.indexOf(' - ');
		if (index <= 0) {
			return [IPTools.ipToNumber(range), IPTools.ipToNumber(range)];
		}
		const low = IPTools.ipToNumber(range.slice(0, index));
		const high = IPTools.ipToNumber(range.slice(index + 3));
		return [low, high];
	}
	getPattern(str: string): [number, number] | null {
		if (!str) return null;
		if (str.indexOf(' - ') > 0) return IPTools.getRangePattern(str);
		return IPTools.getCidrPattern(str);
	}
	cidrToPattern(cidr: string | string[]): [number, number][] {
		if (!cidr || !cidr.length) {
			return [];
		}
		if (typeof cidr === 'string') {
			const pattern = IPTools.getCidrPattern(cidr);
			if (!pattern) return [];
			return [pattern];
		}
		return cidr.map(IPTools.getCidrPattern).filter(x => x) as [number, number][];
	}
	rangeToPattern(range: string | string[]): [number, number][] {
		if (!range || !range.length) {
			return [];
		}
		if (typeof range === 'string') {
			const pattern = IPTools.getRangePattern(range);
			if (!pattern) return [];
			return [pattern];
		}
		return range.map(IPTools.getRangePattern).filter(x => x) as [number, number][];
	}
	checkPattern(patterns: [number, number][], num: number) {
		for (const pattern of patterns) {
			if (num >= pattern[0] && num <= pattern[1]) {
				return true;
			}
		}
		return false;
	}

	/**
	 * Returns a checker function for the passed IP range or array of
	 * ranges. The checker function returns true if its passed IP is
	 * in the range.
	 */
	checker(ranges: string | string[]) {
		if (!ranges || !ranges.length) return () => false;
		let patterns: [number, number][] = [];
		if (typeof ranges === 'string') {
			const rangePatterns = IPTools.getPattern(ranges);
			if (rangePatterns) patterns = [rangePatterns];
		} else {
			patterns = ranges.map(IPTools.getPattern).filter(x => x) as [number, number][];
		}
		return (ip: string) => IPTools.checkPattern(patterns, IPTools.ipToNumber(ip));
	}

/*********************************************************
 * Datacenter parsing
 *********************************************************/

	urlToHost(url: string) {
		if (url.startsWith('http://')) url = url.slice(7);
		if (url.startsWith('https://')) url = url.slice(8);
		if (url.startsWith('www.')) url = url.slice(4);
		const slashIndex = url.indexOf('/');
		if (slashIndex > 0) url = url.slice(0, slashIndex);
		return url;
	}

	datacenters: [number, number, string][] = [];
	async loadDatacenters() {
		const data = await FS('config/datacenters.csv').readIfExists();
		const rows = data.split('\n');
		const datacenters: [number, number, string][] = [];
		for (const row of rows) {
			if (!row) continue;
			const rowSplit = row.split(',');
			const rowData: [number, number, string] = [
				IPTools.ipToNumber(rowSplit[0]),
				IPTools.ipToNumber(rowSplit[1]),
				IPTools.urlToHost(rowSplit[3]),
			];
			datacenters.push(rowData);
		}
		IPTools.datacenters = datacenters;
	}

	/**
	 * Will not reject; IPs with no RDNS entry will resolve to
	 * '[byte1].[byte2].unknown-nohost'.
	 */
	getHost(ip: string) {
		return new Promise<string>(resolve => {
			if (!ip) {
				resolve('');
				return;
			}

			const ipNumber = IPTools.ipToNumber(ip);
			if (IPTools.checkPattern(rangeOVHres, ipNumber)) {
				resolve('ovh.fr.res-nohost');
				return;
			}
			if (IPTools.checkPattern(rangeWindres, ipNumber)) {
				resolve('wind.it.res-nohost');
				return;
			}
			for (const row of IPTools.datacenters) {
				if (ipNumber >= row[0] && ipNumber <= row[1]) {
					resolve(row[2] + '.proxy-nohost');
					return;
				}
			}
			if (
				ip.startsWith('106.76.') || ip.startsWith('106.77.') || ip.startsWith('106.78.') ||
				ip.startsWith('106.79.') || ip.startsWith('112.110.') || ip.startsWith('27.97.') ||
				ip.startsWith('49.15.') || ip.startsWith('49.14.') || ip.startsWith('1.187.')
			) {
				resolve('ideacellular.mobile-nohost');
				return;
			}
			if (IPTools.checkPattern(rangeTmobile, ipNumber) || ip.startsWith('149.254.')) {
				resolve('tmobile.mobile-nohost');
				return;
			}
			if (
				IPTools.checkPattern(rangeCenet, ipNumber) || IPTools.checkPattern(rangeQlded, ipNumber) ||
				ip.startsWith('153.107.') || IPTools.checkPattern(rangeCathednet, ipNumber)
			) {
				resolve('edu.au.res-nohost');
				return;
			}
			if (ip.startsWith('179.7.')) {
				resolve('claro.com.pe.mobile-nohost');
				return;
			}
			if (ip.startsWith('190.') || IPTools.checkPattern(rangeTelefonica, ipNumber)) {
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
			if (IPTools.checkPattern(rangeStarhub, ipNumber)) {
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
			if (ip.startsWith('147.129.')) {
				resolve('ithaca.edu.res-nohost');
				return;
			}
			if (ip.startsWith('189.204.')) {
				resolve('bestel.com.mx.res-nohost');
				return;
			}
			if (IPTools.checkPattern(rangePsci, ipNumber)) {
				resolve('psci.net.res-nohost');
				return;
			}
			if (IPTools.checkPattern(rangeOcde, ipNumber)) {
				resolve('ocde.us.res-nohost');
				return;
			}
			if (IPTools.checkPattern(rangeIhet, ipNumber)) {
				resolve('iu.edu.res-nohost');
				return;
			}
			if (IPTools.checkPattern(rangeTimcelular, ipNumber)) {
				resolve('tim.com.br.mobile-nohost');
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
			if (
				ip.startsWith('198.144.104.') || ip.startsWith('198.47.115.') || ip.startsWith('199.255.215.') ||
				ip.startsWith('204.14.76.') || ip.startsWith('204.14.77.') || ip.startsWith('204.14.78.') ||
				ip.startsWith('204.14.79.') || ip.startsWith('205.164.32.') || ip.startsWith('209.73.132.') ||
				ip.startsWith('209.73.151.') || ip.startsWith('216.172.135.') || ip.startsWith('46.16.34.') ||
				ip.startsWith('46.16.35.') || ip.startsWith('50.117.45.') || ip.startsWith('63.141.198.') ||
				ip.startsWith('63.141.199.') || ip.startsWith('74.115.1.') || ip.startsWith('74.115.5.') ||
				ip.startsWith('85.237.197.') || ip.startsWith('85.237.222.')
			) {
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
					} else if (IPTools.checkPattern(rangeTelstra, ipNumber)) {
						resolve('telstra.net.res-nohost');
					} else {
						this.testConnection(ip, result => {
							if (result) {
								resolve('' + ip.split('.').slice(0, 2).join('.') + '.proxy-nohost');
							} else {
								resolve('' + ip.split('.').slice(0, 2).join('.') + '.unknown-nohost');
							}
						});
					}
				}
				resolve(hosts[0]);
			});
		});
	}

	/**
	 * Does this IP respond to port 80? In theory, proxies are likely to
	 * respond, while residential connections are likely to reject connections.
	 *
	 * Callback is guaranteed to be called exactly once, within a 1000ms
	 * timeout.
	 */
	testConnection(ip: string, callback: (result: boolean) => void) {
		const cachedValue = this.connectionTestCache.get(ip);
		if (cachedValue !== undefined) {
			return callback(cachedValue);
		}

		// Node.js's documentation does not make this easy to write. I discovered
		// this behavior by manual testing:

		// A successful connection emits 'connect', which you should react to
		// with socket.destroy(), which emits 'close'.

		// Some IPs instantly reject connections, emitting 'error' followed
		// immediately by 'close'.

		// Some IPs just never respond, leaving you to time out. Node will
		// emit the 'timeout' event, but not actually do anything else, leaving
		// you to manually use socket.destroy(), which emits 'close'

		let connected = false;
		const socket = require('net').createConnection({
			port: 80,
			host: ip,
			timeout: 1000,
		}, () => {
			connected = true;
			this.connectionTestCache.set(ip, true);
			callback(true);
			socket.destroy();
		});
		socket.on('error', () => {});
		socket.on('timeout', () => socket.destroy());
		socket.on('close', () => {
			if (!connected) {
				this.connectionTestCache.set(ip, false);
				callback(false);
			}
		});
	}

	shortenHost(host: string) {
		if (host.slice(-7) === '-nohost') return host;
		let dotLoc = host.lastIndexOf('.');
		const tld = host.slice(dotLoc);
		if (tld === '.uk' || tld === '.au' || tld === '.br') dotLoc = host.lastIndexOf('.', dotLoc - 1);
		dotLoc = host.lastIndexOf('.', dotLoc - 1);
		return host.slice(dotLoc + 1);
	}

	/**
	 * Host types:
	 * - 'res' - normal residential ISP
	 * - 'shared' - like res, but shared among many people: bans will have collateral damage
	 * - 'mobile' - like res, but unstable IP (IP bans don't work)
	 * - 'proxy' - datacenters, VPNs, proxy services, other untrustworthy sources
	 *   (note that bots will usually be hosted on these)
	 * - 'res?' - likely res, but host not specifically whitelisted
	 * - 'unknown' - no rdns entry, treat with suspicion
	 */
	getHostType(host: string, ip: string) {
		if (Punishments.sharedIps.has(ip)) {
			return 'shared';
		}
		if (host === 'he.net.proxy-nohost') {
			// Hurricane Electric has an annoying habit of having residential
			// internet and datacenters on the same IP ranges - we get a lot of
			// legitimate users as well as spammers on VPNs from HE.

			// This splits the difference and treats it like any other unknown IP.
			return 'unknown';
		}
		// There were previously special cases for
		// 'digitalocean.proxy-nohost', 'servihosting.es.proxy-nohost'
		// DO is commonly used to host bots; I don't know who whitelisted
		// servihosting but I assume for a similar reason. This isn't actually
		// tenable; any service that can host bots can and does also host proxies.
		if (this.proxyHosts.has(host) || host.endsWith('.proxy-nohost')) {
			return 'proxy';
		}
		if (this.residentialHosts.has(host) || host.endsWith('.res-nohost')) {
			return 'res';
		}
		if (this.mobileHosts.has(host) || host.endsWith('.mobile-nohost')) {
			return 'mobile';
		}
		if (/^ip-[0-9]+-[0-9]+-[0-9]+\.net$/.test(host) || /^ip-[0-9]+-[0-9]+-[0-9]+\.eu$/.test(host)) {
			// OVH
			return 'proxy';
		}
		if ([
			'114.161.93.156', '121.129.20.202', '122.45.113.125', '128.68.107.201', '150.31.37.122', '176.202.180.98',
			'184.22.240.178', '185.127.25.192', '185.234.219.117', '199.249.230.69', '39.111.5.170', '58.124.244.202',
			'59.8.242.27', '61.121.64.114', '78.85.106.214', '89.110.59.95', '38.132.116.198', '38.132.120.92',
			'113.197.177.61', '38.132.120.92', '126.227.135.176', '171.251.45.151', '111.105.163.211', '119.30.32.155',
			'176.124.96.196', '93.87.75.118', '87.247.111.222', '244.242.108.51', '72.252.4.161', '78.85.17.243',
			'80.250.14.236', '83.142.197.99', '89.147.80.2', '91.197.189.62', '103.78.54.180', '106.120.14.39',
			'109.122.80.234', '115.85.65.146', '118.97.55.65', '185.217.160.184', '200.35.43.89', '202.62.61.119',
			'203.83.183.11', '84.245.104.164', '158.195.148.169', '31.168.162.22', '62.12.114.142', '157.157.87.135',
			'40.71.227.101', '119.42.118.73', '202.40.183.234', '113.11.136.28', '222.72.38.46', '185.141.10.67',
			'24.52.170.119', '62.140.252.72', '94.236.198.160', '182.52.51.41', '187.38.170.94', '109.185.143.169',
			'84.41.29.225', '101.255.64.194', '210.16.84.182', '203.192.208.72', '201.182.146.14', '189.45.42.149',
			'89.135.51.39', '82.117.234.189', '109.105.195.250', '61.9.48.99', '91.103.31.45', '213.5.194.3',
			'185.121.202.51', '175.195.33.102', '59.120.229.102', '79.106.165.238', '217.210.157.135', '101.108.175.93',
			'181.210.16.130', '81.91.144.53', '200.89.174.102', '85.114.96.94', '85.10.56.233', '81.162.199.249',
			'91.210.59.145', '88.87.231.132', '109.238.220.130', '167.86.94.107', '104.244.78.55', '92.62.139.103',
		].includes(ip)) {
			// single-IP open proxies
			return 'proxy';
		}

		if (host.endsWith('.unknown-nohost')) {
			// rdns entry doesn't exist, and IP doesn't respond to a probe on port 80
			return 'unknown';
		}

		// rdns entry exists but is unrecognized
		return 'res?';
	}
};

const rangeTmobile = IPTools.cidrToPattern('172.32.0.0/11');
const rangeCenet = IPTools.cidrToPattern('27.111.64.0/21');
const rangeQlded = IPTools.cidrToPattern('203.104.0.0/20');
const rangeCathednet = IPTools.cidrToPattern('180.95.40.0/21');
const rangeTelefonica = IPTools.cidrToPattern('181.64.0.0/14');
const rangeStarhub = IPTools.cidrToPattern([
	'27.125.128.0/18', '58.96.192.0/18', '101.127.0.0/17', '116.88.0.0/17', '122.11.192.0/18', '182.19.128.0/17', '182.55.0.0/16', '183.90.0.0/17', '203.116.122.0/23',
]);
const rangeTelstra = IPTools.cidrToPattern('101.160.0.0/11');
const rangePsci = IPTools.cidrToPattern(['96.31.192.0/20', '209.239.96.0/20', '216.49.96.0/19']);
const rangeOcde = IPTools.cidrToPattern(['104.249.64.0/18', '209.232.144.0/20', '216.100.88.0/21']);
const rangeIhet = IPTools.cidrToPattern('199.8.0.0/16');
const rangeTimcelular = IPTools.cidrToPattern('191.128.0.0/12');

const rangeOVHres = IPTools.rangeToPattern([
	'109.190.0.0 - 109.190.63.255', '109.190.64.0 - 109.190.127.255', '109.190.128.0 - 109.190.191.255', '109.190.192.0 - 109.190.255.255', '151.80.228.0 - 151.80.228.255', '178.32.37.0 - 178.32.37.255', '178.33.101.0 - 178.33.101.255', '185.15.68.0 - 185.15.69.255', '185.15.70.0 - 185.15.71.255',
]);
const rangeWindres = IPTools.rangeToPattern([
	'151.3.0.0 - 151.79.255.255', '151.81.0.0 - 151.84.255.255', '151.93.0.0 - 151.93.255.255', '151.95.0.0 - 151.95.255.255', '176.206.0.0 - 176.207.255.255',
]);

export default IPTools;
