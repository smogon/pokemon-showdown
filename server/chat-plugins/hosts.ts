/**
 * Chat plugin to help manage hosts, proxies, and datacenters
 * Written by Annika
 * Original /adddatacenters command written by Zarel
 */

import {Utils} from "../../lib/utils";
import {Datacenter} from "../ip-tools";

const IP_REGEX = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
const HOST_REGEX = /^.+\..{2,}$/;

function ipSort(a: string, b: string) {
	let i = 0;
	let diff = 0;
	const aParts = a.split('.');
	const bParts = b.split('.');
	while (diff === 0) {
		diff = (parseInt(aParts[i]) || 0) - (parseInt(bParts[i]) || 0);
		i++;
	}
	return diff;
}


export const pages: PageTable = {
	datacenters() {
		this.title = "Datacenters";
		if (!this.can('globalban')) return 'Permission denied.';
		let html = `<div class="ladder pad"><h2>Datacenters:</h2><table>`;
		html += `<tr><th>Lowest IP address</th><th>Highest IP address</th><th>Name</th><th>Host</th></tr>`;
		const sortedDatacenters = IPTools.datacenters;
		sortedDatacenters.sort((a, b) => a.minIP - a.minIP);
		for (const datacenter of sortedDatacenters) {
			html += `<tr>`;
			html += `<td>${IPTools.numberToIP(datacenter.minIP)}</td>`;
			html += `<td>${IPTools.numberToIP(datacenter.maxIP)}</td>`;
			html += Utils.html`<td>${datacenter.name}</td>`;
			html += Utils.html`<td>${datacenter.host}</td>`;
			html += `</tr>`;
		}
		html += `</table></div>`;
		return html;
	},

	hosts(query) {
		this.title = "Hosts";
		if (!this.can('globalban')) return 'Permission denied.';
		const type = toID(query[0]) || 'all';

		const openProxies = ['all', 'proxyips', 'proxies'].includes(type) ? [...IPTools.singleIPOpenProxies] : [];
		const proxyHosts = ['all', 'proxyhosts', 'proxies'].includes(type) ? [...IPTools.proxyHosts] : [];
		const mobileHosts = ['all', 'mobile'].includes(type) ? [...IPTools.mobileHosts] : [];
		const residentialHosts = ['all', 'residential', 'res'].includes(type) ? [...IPTools.residentialHosts] : [];

		openProxies.sort(ipSort);
		proxyHosts.sort();
		mobileHosts.sort();
		residentialHosts.sort();

		let html = `<div class="ladder pad"><h2>Hosts:</h2><table>`;
		html += `<tr><th>Host</th><th>Type</th></tr>`;

		for (const proxyIP of openProxies) {
			html += `<tr><td>${proxyIP}</td><td>Single IP open proxy</td></tr>`;
		}
		for (const proxyHost of proxyHosts) {
			html += `<tr><td>${proxyHost}</td><td>Proxy host</td></tr>`;
		}
		for (const mobileHost of mobileHosts) {
			html += `<tr><td>${mobileHost}</td><td>Mobile host</td></tr>`;
		}
		for (const resHost of residentialHosts) {
			html += `<tr><td>${resHost}</td><td>Residential host</td></tr>`;
		}
		html += `</table></div>`;
		return html;
	},
};

export const commands: ChatCommands = {
	dc: 'datacenters',
	datacenter: 'datacenters',
	datacenters: {
		'': 'help',
		help() {
			return this.parse('/help datacenters');
		},

		show: 'view',
		view(target, room, user) {
			if (!this.can('globalban')) return;
			return this.parse('/join view-datacenters');
		},
		viewhelp: [
			`/datacenters view - View the list of datacenters. Requires: @ &`,
		],

		// Originally by Zarel
		widen: 'add',
		async add(target, room, user, connection, cmd) {
			if (!this.can('lockdown')) return false;
			if (!target) return this.parse('/help datacenters add');
			// should be in the format: IP, IP, name, URL
			const widen = (cmd === 'widendatacenters');

			const datacentersToAdd: Datacenter[] = [];
			for (const row of target.split('\n')) {
				const [start, end, name, url] = row.split(',').map(part => part.trim());
				if (!url || !IP_REGEX.test(start) || !IP_REGEX.test(end)) return this.errorReply(`Invalid data: ${row}`);
				const datacenter = {
					minIP: IPTools.ipToNumber(start),
					maxIP: IPTools.ipToNumber(end),
					name: name,
					host: IPTools.urlToHost(url),
				};
				datacentersToAdd.push(datacenter);
			}

			let successes = 0;
			let identicals = 0;
			let widenSuccesses = 0;
			for (const datacenter of datacentersToAdd) {
				if (datacenter.maxIP < datacenter.minIP) {
					this.errorReply(
						`Invalid datacenter data for datacenter ${IPTools.numberToIP(datacenter.minIP)}-${IPTools.numberToIP(datacenter.maxIP)} (${datacenter.host})`
					);
					continue;
				}

				let iMin = 0;
				let iMax = IPTools.datacenters.length;
				while (iMin < iMax) {
					const i = Math.floor((iMax + iMin) / 2);
					if (datacenter.minIP > IPTools.datacenters[i].minIP) {
						iMin = i + 1;
					} else {
						iMax = i;
					}
				}
				if (iMin < IPTools.datacenters.length) {
					const next = IPTools.datacenters[iMin];
					if (datacenter.minIP === next.minIP && datacenter.maxIP === next.maxIP) {
						identicals++;
						continue;
					}
					if (datacenter.minIP <= next.minIP && datacenter.maxIP >= next.maxIP) {
						if (widen === true) {
							widenSuccesses++;
							await IPTools.removeDatacenter(IPTools.datacenters[iMin].minIP, IPTools.datacenters[iMin].maxIP);
							void IPTools.addDatacenter(datacenter);
							continue;
						}
						this.errorReply(`Too wide: ${IPTools.numberToIP(datacenter.minIP)}-${IPTools.numberToIP(datacenter.maxIP)} (${datacenter.host})`);
						this.errorReply(
							`Intersects with: ${IPTools.numberToIP(next.minIP)}-${IPTools.numberToIP(next.maxIP)} (${next.host})`
						);
						continue;
					}
					if (datacenter.maxIP >= next.minIP) {
						this.errorReply(
							`Could not insert: ${IPTools.numberToIP(datacenter.minIP)}-${IPTools.numberToIP(datacenter.maxIP)} ${datacenter.host}`
						);
						this.errorReply(
							`Intersects with: ${IPTools.numberToIP(next.minIP)}-${IPTools.numberToIP(next.maxIP)} (${next.host})`
						);
						continue;
					}
				}
				if (iMin > 0) {
					const prev = IPTools.datacenters[iMin - 1];
					if (datacenter.minIP >= prev.minIP && datacenter.maxIP <= prev.maxIP) {
						this.errorReply(`Too narrow: ${IPTools.numberToIP(datacenter.minIP)}-${IPTools.numberToIP(datacenter.maxIP)} (${datacenter.host})`);
						this.errorReply(`Intersects with: ${IPTools.numberToIP(prev.minIP)}-${IPTools.numberToIP(prev.maxIP)} (${prev.host})`);
						continue;
					}
					if (datacenter.minIP <= prev.maxIP) {
						this.errorReply(`Could not insert: ${IPTools.numberToIP(datacenter.minIP)}-${IPTools.numberToIP(datacenter.maxIP)} (${datacenter.host})`);
						this.errorReply(`Intersects with: ${IPTools.numberToIP(prev.minIP)}-${IPTools.numberToIP(prev.maxIP)} (${prev.host})`);
						continue;
					}
				}
				successes++;
				void IPTools.addDatacenter(datacenter);
			}

			this.sendReply(`Done: ${successes} successes, ${identicals} unchanged.`);
			if (widenSuccesses) this.sendReply(`${widenSuccesses} widens.`);
		},
		addhelp: [
			`/datacenters add [low], [high], [name], [url] - Add datacenters (can be multiline). Requires: &`,
			`/datacenters widen [low], [high], [name], [url] - Add datacenters, allowing a new range to completely cover an old range. Requires: &`,
			`For example: /datacenters add 5.152.192.0, 5.152.223.255, Redstation Limited, http://redstation.com/`,
			`Get datacenter info from whois; [low], [high] are the range in the last inetnum.`,
		],

		remove(target, room, user) {
			if (!this.can('lockdown')) return false;
			if (!target) return this.parse('/help datacenters remove');
			let removed = 0;
			for (const row of target.split('\n')) {
				const [start, end] = row.split(',').map(ip => ip.trim());
				if (!end || !IP_REGEX.test(start) || !IP_REGEX.test(end)) return this.errorReply(`Invalid data: ${row}`);

				const minIP = IPTools.ipToNumber(start);
				const maxIP = IPTools.ipToNumber(end);
				if (!IPTools.getDatacenter(minIP, maxIP)) return this.errorReply(`No datacenter found at ${start}-${end}.`);

				void IPTools.removeDatacenter(minIP, maxIP);
				removed++;
			}
			return this.sendReply(`Removed ${removed} datacenters!`);
		},
		removehelp: [
			`/datacenters remove [low IP], [high IP] - Remove datacenter(s). Can be multiline. Requires: &`,
			`Example: /datacenters remove 5.152.192.0, 5.152.223.255`,
		],

		rename(target, room, user) {
			if (!this.can('lockdown')) return false;
			if (!target) return this.parse('/help datacenters rename');
			const [start, end, name, url] = target.split(',').map(part => part.trim());
			if (!(name || url) || !IP_REGEX.test(start) || !IP_REGEX.test(end)) return this.parse('/help renamedatacenter');
			const minIP = IPTools.ipToNumber(start);
			const maxIP = IPTools.ipToNumber(end);
			const toRename = IPTools.getDatacenter(minIP, maxIP);
			if (!toRename) return this.errorReply(`No datacenter found at ${start}-${end}`);

			const datacenter = {
				minIP: minIP,
				maxIP: maxIP,
				name: name || toRename.name,
				host: url ? IPTools.urlToHost(url) : toRename.host,
			};
			void IPTools.addDatacenter(datacenter);
			return this.sendReply(
				`Renamed the datacenter at ${datacenter.minIP}-${datacenter.maxIP} to ${datacenter.name} (${datacenter.host}).`
			);
		},
		renamehelp: [
			`/datacenters rename [low IP], [high IP], [name], [url] - Renames a datacenter. You may leave one of [name] or [url] blank. Requires: &`,
		],
	},

	datacentershelp() {
		const help = [
			`<code>/datacenters view</code>: view the list of datacenters. Requires: @ &`,
			`<code>/datacenters add [low IP], [high IP], [name], [url]</code>: add datacenters (can be multiline). Requires: &`,
			`<code>/datacenters widen [low IP], [high IP], [name], [url]</code>: add datacenters, allowing a new range to completely cover an old range. Requires: &`,
			`For example: <code>/datacenters add 5.152.192.0, 5.152.223.255, Redstation Limited, http://redstation.com/</code>.`,
			`Get datacenter info from <code>/whois</code>; <code>[low IP]</code>, <code>[high IP]</code> are the range in the last inetnum.`,
			`<code>/datacenters remove [low IP], [high IP]</code>: remove datacenter(s). Can be multiline. Requires: &`,
			`For example: <code>/datacenters remove 5.152.192.0, 5.152.223.255</code>.`,
			`<code>/datacenters rename [low IP], [high IP], [name], [url]</code>: renames a datacenter. You may leave one of [name] or [url] blank. Requires: &`,
		];
		return this.sendReply(`|html|<details class="readmore"><summary>Datacenter management commands:</summary>${help.join('<br />')}`);
	},

	viewhosts(target) {
		if (!this.can('globalban')) return false;
		const types = ['all', 'proxies', 'proxyips', 'proxyhosts', 'residential', 'mobile'];
		const type = target ? toID(target) : 'all';
		if (!types.includes(type)) {
			return this.errorReply(`'${type}' isn't a valid host type. Specify one of ${types.join(', ')}.`);
		}
		return this.parse(`/join view-hosts-${type}`);
	},
	viewhostshelp: [
		`/viewhosts - View the list of all hosts and proxies. Requires: @ &`,
		`/viewhosts [type] - View the list of a particular type of proxy. Requires: @ &`,
		`Proxy types are: 'all', 'proxies', 'proxyips', 'proxyhosts', 'residential', and 'mobile'.`,
	],

	removehost: 'addhosts',
	removehosts: 'addhosts',
	addhost: 'addhosts',
	addhosts(target, room, user, connection, cmd) {
		if (!this.can('lockdown')) return false;
		const removing = cmd.includes('remove');
		let [type, toAdd] = target.split('|');
		type = toID(type);
		if (!toAdd) return this.parse('/help addhosts');
		const hosts = toAdd.split(',').map(host => host.trim());
		if (!hosts.length) return this.parse('/help addhosts');

		switch (type) {
		case 'proxyip': case 'openproxy': case 'singleipopenproxy':
			for (const host of hosts) {
				if (!IP_REGEX.test(host)) return this.errorReply(`'${host}' is not a valid IP address.`);
				if (removing !== IPTools.singleIPOpenProxies.has(host)) {
					return this.errorReply(`'${host}' is ${removing ? 'not' : 'already'} in the list of proxy IPs.`);
				}
			}
			if (removing) {
				void IPTools.removeOpenProxies(hosts);
			} else {
				void IPTools.addOpenProxies(hosts);
			}
			break;
		case 'proxy':
			for (const host of hosts) {
				if (!HOST_REGEX.test(host)) return this.errorReply(`'${host}' is not a valid host.`);
				if (removing !== IPTools.proxyHosts.has(host)) {
					return this.errorReply(`'${host}' is ${removing ? 'not' : 'already'} in the list of proxy hosts.`);
				}
			}
			if (removing) {
				void IPTools.removeProxyHosts(hosts);
			} else {
				void IPTools.addProxyHosts(hosts);
			}
			break;
		case 'residential': case 'res':
			for (const host of hosts) {
				if (!HOST_REGEX.test(host)) return this.errorReply(`'${host}' is not a valid host.`);
				if (removing !== IPTools.residentialHosts.has(host)) {
					return this.errorReply(`'${host}' is ${removing ? 'not' : 'already'} in the list of residential hosts.`);
				}
			}
			if (removing) {
				void IPTools.removeResidentialHosts(hosts);
			} else {
				void IPTools.addResidentialHosts(hosts);
			}
			break;
		case 'mobile':
			for (const host of hosts) {
				if (!HOST_REGEX.test(host)) return this.errorReply(`'${host}' is not a valid host.`);
				if (removing !== IPTools.mobileHosts.has(host)) {
					return this.errorReply(`'${host}' is ${removing ? 'not' : 'already'} in the list of mobile hosts.`);
				}
			}
			if (removing) {
				void IPTools.removeMobileHosts(hosts);
			} else {
				void IPTools.addMobileHosts(hosts);
			}
			break;
		default:
			return this.errorReply(`'${type}' isn't one of 'openproxy', 'proxy', 'residential', or 'mobile'.`);
		}
		return this.sendReply(`${removing ? 'Removed' : 'Added'} ${hosts.length} hosts!`);
	},
	addhostshelp: [
		`/addhosts [category] | host1, host2, ... - Adds hosts to the given category. Requires: &`,
		`/removehosts [category] | host1, host2, ... - Removes hosts from the given category. Requires: &`,
		`Categories are: 'openproxy' (which takes IP addresses, not hosts), 'proxy', 'residential', and 'mobile'.`,
	],
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/(?:add|widen|remove)datacenter(s | )');
});
