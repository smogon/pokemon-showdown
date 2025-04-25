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
const HOSTS_FILE = 'config/hosts.csv';
const PROXIES_FILE = 'config/proxies.csv';

import * as dns from 'dns';
import { FS, Net, Utils } from '../lib';

export interface AddressRange {
	minIP: number;
	maxIP: number;
	host?: string;
}

function removeNohost(hostname: string) {
	// Convert from old domain.tld.type-nohost format to new domain.tld?/type format
	if (hostname?.includes('-nohost')) {
		const parts = hostname.split('.');
		const suffix = parts.pop();
		return `${parts.join('.')}?/${suffix?.replace('-nohost', '')}`;
	}
	return hostname;
}

export const IPTools = new class {
	readonly dnsblCache = new Map<string, string | null>([
		['127.0.0.1', null],
	]);

	readonly connectionTestCache = new Map<string, boolean>();

	readonly ipRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])$/;
	readonly ipRangeRegex = /^(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9])(\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]|\*)){0,2}\.(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9]?[0-9]|\*)$/;
	readonly hostRegex = /^.+\..{2,}$/;

	async lookup(ip: string) {
		const [dnsbl, host] = await Promise.all([
			IPTools.queryDnsbl(ip),
			IPTools.getHost(ip),
		]);
		const shortHost = this.shortenHost(host);
		const hostType = this.getHostType(shortHost, ip);
		return { dnsbl, host, shortHost, hostType };
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
		ip = ip.trim();
		if (ip.includes(':') && !ip.includes('.')) {
			// IPv6, which PS does not support
			return null;
		}
		if (ip.startsWith('::ffff:')) ip = ip.slice(7);
		else if (ip.startsWith('::')) ip = ip.slice(2);
		let num = 0;
		const parts = ip.split('.');
		if (parts.length !== 4) return null;
		for (const part of parts) {
			num *= 256;

			const partAsInt = Utils.parseExactInt(part);
			if (isNaN(partAsInt) || partAsInt < 0 || partAsInt > 255) return null;
			num += partAsInt;
		}
		return num;
	}

	numberToIP(num: number) {
		const ipParts: string[] = [];
		if (num < 0 || num >= 256 ** 4 || num !== Math.trunc(num)) return null;
		while (num) {
			const part = num % 256;
			num = (num - part) / 256;
			ipParts.unshift(part.toString());
		}
		while (ipParts.length < 4) ipParts.unshift('0');
		if (ipParts.length !== 4) return null;
		return ipParts.join('.');
	}

	getCidrRange(cidr: string): AddressRange | null {
		if (!cidr) return null;
		const index = cidr.indexOf('/');
		if (index <= 0) {
			const ip = IPTools.ipToNumber(cidr);
			if (ip === null) return null;
			return { minIP: ip, maxIP: ip };
		}
		const low = IPTools.ipToNumber(cidr.slice(0, index));
		const bits = Utils.parseExactInt(cidr.slice(index + 1));
		// fun fact: IPTools fails if bits <= 1 because JavaScript
		// does << with signed int32s.
		if (low === null || !bits || bits < 2 || bits > 32) return null;
		const high = low + (1 << (32 - bits)) - 1;
		return { minIP: low, maxIP: high };
	}
	/** Is this an IP range supported by `stringToRange`? Note that exact IPs are also valid IP ranges. */
	isValidRange(range: string): boolean {
		return IPTools.stringToRange(range) !== null;
	}
	stringToRange(this: void, range: string | null): AddressRange | null {
		if (!range) return null;
		if (range.endsWith('*')) {
			const parts = range.replace('.*', '').split('.');
			if (parts.length > 3) return null;
			const [a, b, c] = parts;
			const minIP = IPTools.ipToNumber(`${a || '0'}.${b || '0'}.${c || '0'}.0`);
			const maxIP = IPTools.ipToNumber(`${a || '255'}.${b || '255'}.${c || '255'}.255`);
			if (minIP === null || maxIP === null) return null;
			return { minIP, maxIP };
		}
		const index = range.indexOf('-');
		if (index <= 0) {
			if (range.includes('/')) return IPTools.getCidrRange(range);
			const ip = IPTools.ipToNumber(range);
			if (ip === null) return null;

			return { maxIP: ip, minIP: ip };
		}
		const minIP = IPTools.ipToNumber(range.slice(0, index));
		const maxIP = IPTools.ipToNumber(range.slice(index + 1));

		if (minIP === null || maxIP === null || maxIP < minIP) return null;
		return { minIP, maxIP };
	}
	rangeToString(range: AddressRange, sep = '-') {
		return `${this.numberToIP(range.minIP)}${sep}${this.numberToIP(range.maxIP)}`;
	}

	/******************************
	 * Range management functions *
	 ******************************/

	checkPattern(patterns: AddressRange[], num: number | null) {
		if (num === null) return false;
		for (const pattern of patterns) {
			if (num >= pattern.minIP && num <= pattern.maxIP) {
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
	checker(rangeString: string | string[]): (ip: string) => boolean {
		if (!rangeString?.length) return () => false;
		let ranges: AddressRange[] = [];
		if (typeof rangeString === 'string') {
			const rangePatterns = IPTools.stringToRange(rangeString);
			if (rangePatterns) ranges = [rangePatterns];
		} else {
			ranges = rangeString.map(IPTools.stringToRange).filter(x => x) as AddressRange[];
		}
		return (ip: string) => {
			const ipNumber = IPTools.ipToNumber(ip);
			return IPTools.checkPattern(ranges, ipNumber);
		};
	}

	/**
	 * Proxy and host management functions
	 */
	ranges: (AddressRange & { host: string })[] = [];
	singleIPOpenProxies = new Set<string>();
	torProxyIps = new Set<string>();
	proxyHosts = new Set<string>();
	residentialHosts = new Set<string>();
	mobileHosts = new Set<string>();
	async loadHostsAndRanges() {
		const data = await FS(HOSTS_FILE).readIfExists() + await FS(PROXIES_FILE).readIfExists();
		// Strip carriage returns for Windows compatibility
		const rows = data.split('\n').map(row => row.replace('\r', ''));
		const ranges = [];
		for (const row of rows) {
			if (!row) continue;
			let [type, hostOrLowIP, highIP, host] = row.split(',');
			if (!hostOrLowIP) continue;
			// Handle legacy data format
			host = removeNohost(host);
			hostOrLowIP = removeNohost(hostOrLowIP);

			switch (type) {
			case 'IP':
				IPTools.singleIPOpenProxies.add(hostOrLowIP);
				break;
			case 'HOST':
				IPTools.proxyHosts.add(hostOrLowIP);
				break;
			case 'RESIDENTIAL':
				IPTools.residentialHosts.add(hostOrLowIP);
				break;
			case 'MOBILE':
				IPTools.mobileHosts.add(hostOrLowIP);
				break;
			case 'RANGE':
				if (!host) continue;

				const minIP = IPTools.ipToNumber(hostOrLowIP);
				if (minIP === null) {
					Monitor.error(`Bad IP address in host or proxy file: '${hostOrLowIP}'`);
					continue;
				}
				const maxIP = IPTools.ipToNumber(highIP);
				if (maxIP === null) {
					Monitor.error(`Bad IP address in host or proxy file: '${highIP}'`);
					continue;
				}

				const range = { host: IPTools.urlToHost(host), maxIP, minIP };
				if (range.maxIP < range.minIP) throw new Error(`Bad range at ${hostOrLowIP}.`);
				ranges.push(range);
				break;
			}
		}
		IPTools.ranges = ranges;
		IPTools.sortRanges();
	}

	saveHostsAndRanges() {
		let hostsData = '';
		let proxiesData = '';
		for (const ip of IPTools.singleIPOpenProxies) {
			proxiesData += `IP,${ip}\n`;
		}
		for (const host of IPTools.proxyHosts) {
			proxiesData += `HOST,${host}\n`;
		}
		for (const host of IPTools.residentialHosts) {
			hostsData += `RESIDENTIAL,${host}\n`;
		}
		for (const host of IPTools.mobileHosts) {
			hostsData += `MOBILE,${host}\n`;
		}
		IPTools.sortRanges();
		for (const range of IPTools.ranges) {
			const data = `RANGE,${IPTools.rangeToString(range, ',')}${range.host ? `,${range.host}` : ``}\n`;
			if (range.host?.endsWith('/proxy')) {
				proxiesData += data;
			} else {
				hostsData += data;
			}
		}
		void FS(HOSTS_FILE).write(hostsData);
		void FS(PROXIES_FILE).write(proxiesData);
	}

	addOpenProxies(ips: string[]) {
		for (const ip of ips) {
			IPTools.singleIPOpenProxies.add(ip);
		}
		return IPTools.saveHostsAndRanges();
	}

	addProxyHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.proxyHosts.add(host);
		}
		return IPTools.saveHostsAndRanges();
	}

	addMobileHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.mobileHosts.add(host);
		}
		return IPTools.saveHostsAndRanges();
	}

	addResidentialHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.residentialHosts.add(host);
		}
		return IPTools.saveHostsAndRanges();
	}

	removeOpenProxies(ips: string[]) {
		for (const ip of ips) {
			IPTools.singleIPOpenProxies.delete(ip);
		}
		return IPTools.saveHostsAndRanges();
	}

	removeResidentialHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.residentialHosts.delete(host);
		}
		return IPTools.saveHostsAndRanges();
	}

	removeProxyHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.proxyHosts.delete(host);
		}
		return IPTools.saveHostsAndRanges();
	}

	removeMobileHosts(hosts: string[]) {
		for (const host of hosts) {
			IPTools.mobileHosts.delete(host);
		}
		return IPTools.saveHostsAndRanges();
	}

	rangeIntersects(a: AddressRange, b: AddressRange) {
		try {
			this.checkRangeConflicts(a, [b]);
		} catch {
			return true;
		}
		return false;
	}

	checkRangeConflicts(insertion: AddressRange, sortedRanges: AddressRange[], widen?: boolean) {
		if (insertion.maxIP < insertion.minIP) {
			throw new Error(
				`Invalid data for address range ${IPTools.rangeToString(insertion)} (${insertion.host})`
			);
		}

		let iMin = 0;
		let iMax = sortedRanges.length;
		while (iMin < iMax) {
			const i = Math.floor((iMax + iMin) / 2);
			if (insertion.minIP > sortedRanges[i].minIP) {
				iMin = i + 1;
			} else {
				iMax = i;
			}
		}
		if (iMin < sortedRanges.length) {
			const next = sortedRanges[iMin];
			if (insertion.minIP === next.minIP && insertion.maxIP === next.maxIP) {
				throw new Error(`The address range ${IPTools.rangeToString(insertion)} (${insertion.host}) already exists`);
			}
			if (insertion.minIP <= next.minIP && insertion.maxIP >= next.maxIP) {
				if (widen) {
					if (sortedRanges[iMin + 1]?.minIP <= insertion.maxIP) {
						throw new Error("You can only widen one address range at a time.");
					}
					return iMin;
				}
				throw new Error(
					`Too wide: ${IPTools.rangeToString(insertion)} (${insertion.host})\n` +
					`Intersects with: ${IPTools.rangeToString(next)} (${next.host})`
				);
			}
			if (insertion.maxIP >= next.minIP) {
				throw new Error(
					`Could not insert: ${IPTools.rangeToString(insertion)} ${insertion.host}\n` +
					`Intersects with: ${IPTools.rangeToString(next)} (${next.host})`
				);
			}
		}
		if (iMin > 0) {
			const prev = sortedRanges[iMin - 1];
			if (insertion.minIP >= prev.minIP && insertion.maxIP <= prev.maxIP) {
				throw new Error(
					`Too narrow: ${IPTools.rangeToString(insertion)} (${insertion.host})\n` +
					`Intersects with: ${IPTools.rangeToString(prev)} (${prev.host})`
				);
			}
			if (insertion.minIP <= prev.maxIP) {
				throw new Error(
					`Could not insert: ${IPTools.rangeToString(insertion)} (${insertion.host})\n` +
					`Intersects with: ${IPTools.rangeToString(prev)} (${prev.host})`
				);
			}
		}
	}

	/*********************************************************
	 * Range handling functions
	 *********************************************************/

	urlToHost(url: string) {
		if (url.startsWith('http://')) url = url.slice(7);
		if (url.startsWith('https://')) url = url.slice(8);
		if (url.startsWith('www.')) url = url.slice(4);
		const slashIndex = url.indexOf('/');
		if (slashIndex > 0 && url[slashIndex - 1] !== '?') url = url.slice(0, slashIndex);
		return url;
	}

	sortRanges() {
		Utils.sortBy(IPTools.ranges, range => range.minIP);
	}

	getRange(minIP: number, maxIP: number) {
		for (const range of IPTools.ranges) {
			if (range.minIP === minIP && range.maxIP === maxIP) return range;
		}
	}

	addRange(range: AddressRange & { host: string }) {
		if (IPTools.getRange(range.minIP, range.maxIP)) {
			IPTools.removeRange(range.minIP, range.maxIP);
		}
		IPTools.ranges.push(range);
		return IPTools.saveHostsAndRanges();
	}

	removeRange(minIP: number, maxIP: number) {
		IPTools.ranges = IPTools.ranges.filter(dc => dc.minIP !== minIP || dc.maxIP !== maxIP);
		return IPTools.saveHostsAndRanges();
	}

	/**
	 * Will not reject; IPs with no RDNS entry will resolve to
	 * '[byte1].[byte2]?/unknown'.
	 */
	getHost(ip: string) {
		return new Promise<string>(resolve => {
			if (!ip) {
				resolve('');
				return;
			}

			const ipNumber = IPTools.ipToNumber(ip);
			if (ipNumber === null) throw new Error(`Bad IP address: '${ip}'`);
			for (const range of IPTools.ranges) {
				if (ipNumber >= range.minIP && ipNumber <= range.maxIP) {
					resolve(range.host);
					return;
				}
			}
			dns.reverse(ip, (err, hosts) => {
				if (err) {
					resolve(`${ip.split('.').slice(0, 2).join('.')}?/unknown`);
					return;
				}
				if (!hosts?.[0]) {
					if (ip.startsWith('50.')) {
						resolve('comcast.net?/res');
					} else if (ipNumber >= telstraRange.minIP && ipNumber <= telstraRange.maxIP) {
						resolve(telstraRange.host);
					} else {
						this.testConnection(ip, result => {
							if (result) {
								resolve(`${ip.split('.').slice(0, 2).join('.')}?/proxy`);
							} else {
								resolve(`${ip.split('.').slice(0, 2).join('.')}?/unknown`);
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
		if (host.split('.').pop()?.includes('/')) return host; // It has a suffix, e.g. leaseweb.com?/proxy
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
		if (Punishments.isSharedIp(ip)) {
			return 'shared';
		}
		if (this.singleIPOpenProxies.has(ip) || this.torProxyIps.has(ip)) {
			// single-IP open proxies
			return 'proxy';
		}

		if (/^he\.net(\?|)\/proxy$/.test(host)) {
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
		if (this.proxyHosts.has(host) || host.endsWith('/proxy')) {
			return 'proxy';
		}
		if (this.residentialHosts.has(host) || host.endsWith('/res')) {
			return 'res';
		}
		if (this.mobileHosts.has(host) || host.endsWith('/mobile')) {
			return 'mobile';
		}
		if (/^ip-[0-9]+-[0-9]+-[0-9]+\.net$/.test(host) || /^ip-[0-9]+-[0-9]+-[0-9]+\.eu$/.test(host)) {
			// OVH
			return 'proxy';
		}

		if (host.endsWith('/unknown')) {
			// rdns entry doesn't exist, and IP doesn't respond to a probe on port 80
			return 'unknown';
		}

		// rdns entry exists but is unrecognized
		return 'res?';
	}
	async updateTorRanges() {
		try {
			const raw = await Net('https://check.torproject.org/torbulkexitlist').get();
			const torIps = raw.split('\n');
			for (const ip of torIps) {
				if (this.ipRegex.test(ip)) {
					this.torProxyIps.add(ip);
				}
			}
		} catch {}
	}
};

const telstraRange: AddressRange & { host: string } = {
	minIP: IPTools.ipToNumber("101.160.0.0")!,
	maxIP: IPTools.ipToNumber("101.191.255.255")!,
	host: 'telstra.net?/res',
};

export default IPTools;

void IPTools.updateTorRanges();
