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

const BLOCKLISTS = ['sbl.spamhaus.org', 'rbl.efnetrbl.org'];
const DATACENTERS_FILE = 'config/datacenters.csv';
const HOSTS_FILE = 'config/hosts.csv';

import * as dns from 'dns';
import {FS} from '../lib/fs';

export interface Datacenter {
	minIP: number;
	maxIP: number;
	name: string;
	host: string;
}

export const IPTools = new class {
	readonly dnsblCache = new Map<string, string | null>([
		['127.0.0.1', null],
	]);

	readonly connectionTestCache = new Map<string, boolean>();

	async lookup(ip: string) {
		// known TypeScript bug
		// https://github.com/microsoft/TypeScript/issues/33752
		const [dnsbl, host] = await Promise.all<string | null, string>([
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
		if (!Config.dnsbl) return Promise.resolve(null);
		if (IPTools.dnsblCache.has(ip)) {
			return Promise.resolve(IPTools.dnsblCache.get(ip) || null);
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

	numberToIP(num: number) {
		const ipParts: string[] = [];
		while (num) {
			const part = num % 256;
			num = (num - part) / 256;
			ipParts.unshift(part.toString());
		}
		return ipParts.join('.');
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

	/**
	 * Proxy and host management functions
	 */
	singleIPOpenProxies: Set<string> = new Set();
	proxyHosts: Set<string> = new Set();
	residentialHosts: Set<string> = new Set();
	mobileHosts: Set<string> = new Set();
	async loadHosts() {
		const data = await FS(HOSTS_FILE).readIfExists();
		const rows = data.split('\n');
		for (const row of rows) {
			if (!row) continue;
			const [proxy, type] = row.split(',');
			switch (type) {
			case 'PROXYIP':
				IPTools.singleIPOpenProxies.add(proxy);
				break;
			case 'PROXY':
				IPTools.proxyHosts.add(proxy);
				break;
			case 'RESIDENTIAL':
				IPTools.residentialHosts.add(proxy);
				break;
			case 'MOBILE':
				IPTools.mobileHosts.add(proxy);
				break;
			}
		}
	}

	saveHosts() {
		let data = '';
		for (const ip of IPTools.singleIPOpenProxies) {
			data += `${ip},PROXYIP\n`;
		}
		for (const host of IPTools.proxyHosts) {
			data += `${host},PROXY\n`;
		}
		for (const host of IPTools.residentialHosts) {
			data += `${host},RESIDENTIAL\n`;
		}
		for (const host of IPTools.mobileHosts) {
			data += `${host},MOBILE\n`;
		}
		return FS(HOSTS_FILE).write(data);
	}

	addOpenProxies(ips: string[]) {
		for (const ip of ips) {
			IPTools.singleIPOpenProxies.add(ip);
		}
		return IPTools.saveHosts();
	}

	addProxyHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.proxyHosts.add(host);
		}
		return IPTools.saveHosts();
	}

	addMobileHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.mobileHosts.add(host);
		}
		return IPTools.saveHosts();
	}

	addResidentialHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.residentialHosts.add(host);
		}
		return IPTools.saveHosts();
	}

	removeOpenProxies(ips: string[]) {
		for (const ip of ips) {
			IPTools.singleIPOpenProxies.delete(ip);
		}
		return IPTools.saveHosts();
	}

	removeResidentialHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.residentialHosts.delete(host);
		}
		return IPTools.saveHosts();
	}

	removeProxyHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.proxyHosts.delete(host);
		}
		return IPTools.saveHosts();
	}

	removeMobileHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.mobileHosts.delete(host);
		}
		return IPTools.saveHosts();
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

	datacenters: Datacenter[] = [];

	sortDatacenters() {
		IPTools.datacenters.sort((a, b) => a.minIP - b.minIP);
	}

	async loadDatacenters() {
		const data = await FS(DATACENTERS_FILE).readIfExists();
		const rows = data.split('\n');
		const datacenters = [];
		for (const row of rows) {
			if (!row) continue;
			const rowSplit = row.split(',');
			const datacenter = {
				minIP: IPTools.ipToNumber(rowSplit[0]),
				maxIP: IPTools.ipToNumber(rowSplit[1]),
				name: rowSplit[2],
				host: IPTools.urlToHost(rowSplit[3]),
			};
			const prev = datacenters[datacenters.length - 1];
			if (prev && (datacenter.minIP <= prev.maxIP)) {
				throw new Error(`Datacenters out of order at ${rowSplit[0]}.`);
			}
			if (datacenter.maxIP < datacenter.minIP) throw new Error(`Bad datacenter range at ${rowSplit[0]}.`);
			datacenters.push(datacenter);
		}
		IPTools.datacenters = datacenters;
	}

	saveDatacenters() {
		IPTools.sortDatacenters();
		return FS(DATACENTERS_FILE).write(
			IPTools.datacenters
				.map(dc => `${IPTools.numberToIP(dc.minIP)},${IPTools.numberToIP(dc.maxIP)},${dc.name},${dc.host}`)
				.join('\n')
		);
	}

	getDatacenter(minIP: number, maxIP: number) {
		for (const datacenter of IPTools.datacenters) {
			if (datacenter.minIP === minIP && datacenter.maxIP === maxIP) return datacenter;
		}
	}

	async addDatacenter(datacenter: Datacenter) {
		if (IPTools.getDatacenter(datacenter.minIP, datacenter.maxIP)) {
			await IPTools.removeDatacenter(datacenter.minIP, datacenter.maxIP);
		}
		IPTools.datacenters.push(datacenter);
		return IPTools.saveDatacenters();
	}

	removeDatacenter(minIP: number, maxIP: number) {
		IPTools.datacenters = IPTools.datacenters.filter(dc => dc.minIP !== minIP || dc.maxIP !== maxIP);
		return IPTools.saveDatacenters();
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
			for (const datacenter of IPTools.datacenters) {
				if (ipNumber >= datacenter.minIP && ipNumber <= datacenter.maxIP) {
					resolve(`${datacenter.host}.proxy-nohost`);
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
			if (IPTools.checkPattern(rangeTelefonica, ipNumber)) {
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
			if (IPTools.checkPattern(rangeM1, ipNumber)) {
				resolve('m1.com.sg.mobile-nohost');
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
				} else {
					resolve(hosts[0]);
				}
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
			socket.destroy();
			return callback(true);
		});
		socket.on('error', () => {});
		socket.on('timeout', () => socket.destroy());
		socket.on('close', () => {
			if (!connected) {
				this.connectionTestCache.set(ip, false);
				return callback(false);
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
			// Known to only be VPN services
			if (['74.82.60.', '72.52.87.', '65.49.126.'].some(range => ip.startsWith(range))) {
				return 'proxy';
			}
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
		if (this.singleIPOpenProxies.has(ip)) {
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
const rangeTelefonica = IPTools.cidrToPattern([
	'181.64.0.0/15', '190.235.0.0/17', '200.10.75.128/26', '200.37.0.0/16', '200.48.0.0/16', '200.60.128.0/18',
]);
const rangeStarhub = IPTools.cidrToPattern([
	'27.125.128.0/18', '58.96.192.0/18', '101.127.0.0/17', '116.88.0.0/17', '122.11.192.0/18', '182.19.128.0/17', '182.55.0.0/16', '183.90.0.0/17', '203.116.122.0/23',
]);
const rangeTelstra = IPTools.cidrToPattern('101.160.0.0/11');
const rangePsci = IPTools.cidrToPattern(['96.31.192.0/20', '209.239.96.0/20', '216.49.96.0/19']);
const rangeOcde = IPTools.cidrToPattern(['104.249.64.0/18', '209.232.144.0/20', '216.100.88.0/21']);
const rangeIhet = IPTools.cidrToPattern('199.8.0.0/16');
const rangeTimcelular = IPTools.cidrToPattern('191.128.0.0/12');
const rangeM1 = IPTools.cidrToPattern('119.56.64.0/18');

const rangeOVHres = IPTools.rangeToPattern([
	'109.190.0.0 - 109.190.63.255', '109.190.64.0 - 109.190.127.255', '109.190.128.0 - 109.190.191.255', '109.190.192.0 - 109.190.255.255', '151.80.228.0 - 151.80.228.255', '178.32.37.0 - 178.32.37.255', '178.33.101.0 - 178.33.101.255', '185.15.68.0 - 185.15.69.255', '185.15.70.0 - 185.15.71.255',
]);
const rangeWindres = IPTools.rangeToPattern([
	'151.3.0.0 - 151.79.255.255', '151.81.0.0 - 151.84.255.255', '151.93.0.0 - 151.93.255.255', '151.95.0.0 - 151.95.255.255', '176.206.0.0 - 176.207.255.255',
]);

export default IPTools;
