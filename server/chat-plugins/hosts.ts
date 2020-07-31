/**
 * Chat plugin to help manage hosts, proxies, and datacenters
 * Written by Annika
 * Original /adddatacenters command written by Zarel
 */

import {Utils} from "../../lib/utils";
import {AddressRange} from "../ip-tools";

const IP_REGEX = /^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$/;
const HOST_REGEX = /^.+\..{2,}$/;

const WHITELISTED_USERS = ['anubis'];

export function visualizeRangeList(ranges: AddressRange[]) {
	let html = `<tr><th>Lowest IP address</th><th>Highest IP address</th><th>Host</th></tr>`;
	for (const range of ranges) {
		html += `<tr>`;
		html += `<td>${IPTools.numberToIP(range.minIP)}</td>`;
		html += `<td>${IPTools.numberToIP(range.maxIP)}</td>`;
		html += Utils.html`<td>${range.host}</td>`;
		html += `</tr>`;
	}
	return html;
}

export const pages: PageTable = {
	proxies(query, user) {
		this.title = "Proxies";
		if (!(WHITELISTED_USERS.includes(user.id) || this.can('globalban'))) return 'Permission denied.';

		const openProxies = [...IPTools.singleIPOpenProxies];
		const proxyHosts = [...IPTools.proxyHosts];
		openProxies.sort(IPTools.ipSort);
		proxyHosts.sort();
		IPTools.sortRanges();

		let html = `<div class="ladder pad"><h2>Single IP proxies:</h2><table><tr><th>IP</th><th>Type</th></tr>`;
		for (const proxyIP of openProxies) {
			html += `<tr><td>${proxyIP}</td><td>Single IP open proxy</td></tr>`;
		}
		html += `</table></div>`;

		html += `<div class="ladder pad"><h2>Proxy hosts:</h2><table><tr><th>Host</th><th>Type</th></tr>`;
		for (const proxyHost of proxyHosts) {
			html += `<tr><td>${proxyHost}</td><td>Proxy host</td></tr>`;
		}
		html += `</table></div>`;

		html += `<div class="ladder pad"><h2>Proxy IP Ranges:</h2><table>`;
		html += visualizeRangeList(IPTools.ranges.filter(r => r.host?.endsWith('.proxy-nohost')));
		html += `</table></div>`;
		return html;
	},

	hosts(query, user) {
		this.title = "Hosts";
		if (!(WHITELISTED_USERS.includes(user.id) || this.can('globalban'))) return 'Permission denied.';
		const type = toID(query[0]) || 'all';

		IPTools.sortRanges();
		const mobileHosts = ['all', 'mobile'].includes(type) ? [...IPTools.mobileHosts] : [];
		const residentialHosts = ['all', 'residential', 'res'].includes(type) ? [...IPTools.residentialHosts] : [];
		const hostRanges = ['all', 'ranges', 'isps'].includes(type) ?
			IPTools.ranges.filter(r => r.host && !r.host.endsWith('.proxy-nohost')) :
			[];
		mobileHosts.sort();
		residentialHosts.sort();

		let html = `<div class="ladder pad"><h2>Mobile hosts:</h2><table><tr><th>Host</th><th>Type</th></tr>`;
		for (const mobileHost of mobileHosts) {
			html += `<tr><td>${mobileHost}</td><td>Mobile host</td></tr>`;
		}
		html += `</table></div>`;

		html += `<div class="ladder pad"><h2>Residential hosts:</h2><table><tr><th>Host</th><th>Type</th></tr>`;
		for (const resHost of residentialHosts) {
			html += `<tr><td>${resHost}</td><td>Residential host</td></tr>`;
		}
		html += `</table></div>`;

		html += `<div class="ladder pad"><h2>ISP IP Ranges:</h2><table>`;
		html += visualizeRangeList(hostRanges);
		html += `</table></div>`;
		return html;
	},

	ranges(query, user) {
		this.title = "IP Ranges";
		if (!(WHITELISTED_USERS.includes(user.id) || this.can('globalban'))) return 'Permission denied.';
		IPTools.sortRanges();

		let html = `<div class="ladder pad"><h2>IP Ranges:</h2><table>`;
		html += visualizeRangeList(IPTools.ranges);
		html += `</table></div>`;
		return html;
	},
};

export const commands: ChatCommands = {
	dc: 'ipranges',
	datacenter: 'ipranges',
	datacenters: 'ipranges',
	iprange: 'ipranges',
	ipranges: {
		'': 'help',
		help() {
			return this.parse('/help ipranges');
		},

		show: 'view',
		view(target, room, user) {
			if (!(WHITELISTED_USERS.includes(user.id) || this.can('globalban'))) return;
			return this.parse('/join view-ranges');
		},
		viewhelp: [
			`/ipranges view - View the list of all IP ranges. Requires: hosts manager @ &`,
		],

		// Originally by Zarel
		widen: 'add',
		add(target, room, user, connection, cmd) {
			if (!(WHITELISTED_USERS.includes(user.id) || this.can('lockdown'))) return false;
			if (!target) return this.parse('/help ipranges add');
			// should be in the format: IP, IP, name, URL
			const widen = cmd.includes('widen');

			const rangesToAdd: AddressRange[] = [];
			for (const row of target.split('\n')) {
				const [start, end, host] = row.split(',').map(part => part.trim());
				if (!host || !IP_REGEX.test(start) || !IP_REGEX.test(end) || !HOST_REGEX.test(host)) {
					return this.errorReply(`Invalid data: ${row}`);
				}
				const range = {
					minIP: IPTools.ipToNumber(start),
					maxIP: IPTools.ipToNumber(end),
					host: IPTools.urlToHost(host),
				};
				rangesToAdd.push(range);
			}

			let successes = 0;
			for (const range of rangesToAdd) {
				IPTools.sortRanges();
				try {
					IPTools.checkRangeConflicts(range, IPTools.ranges, widen);
				} catch (e) {
					return this.errorReply(e.message);
				}
				successes++;
				IPTools.addRange(range);
			}

			this.globalModlog('IPRANGE ADD', null, `by ${user.id}: added ${successes} IP ranges`);
			return this.sendReply(`Successfully added ${successes} IP ranges!`);
		},
		addhelp: [
			`/ipranges add [low], [high], [host] - Add IP ranges (can be multiline). Requires: hosts manager &`,
			`/ipranges widen [low], [high], [host] - Add IP ranges, allowing a new range to completely cover an old range. Requires: hosts manager &`,
			`For example: /ipranges add 5.152.192.0, 5.152.223.255, redstation.com.proxy-nohost`,
			`Get datacenter info from whois; [low], [high] are the range in the last inetnum.`,
		],

		remove(target, room, user) {
			if (!(WHITELISTED_USERS.includes(user.id) || this.can('lockdown'))) return false;
			if (!target) return this.parse('/help ipranges remove');
			let removed = 0;
			for (const row of target.split('\n')) {
				const [start, end] = row.split(',').map(ip => ip.trim());
				if (!end || !IP_REGEX.test(start) || !IP_REGEX.test(end)) return this.errorReply(`Invalid data: ${row}`);

				const minIP = IPTools.ipToNumber(start);
				const maxIP = IPTools.ipToNumber(end);
				if (!IPTools.getRange(minIP, maxIP)) return this.errorReply(`No IP range found at ${start}-${end}.`);

				void IPTools.removeRange(minIP, maxIP);
				removed++;
			}
			this.globalModlog('IPRANGE REMOVE', null, `by ${user.id}: ${removed} IP ranges`);
			return this.sendReply(`Removed ${removed} IP ranges!`);
		},
		removehelp: [
			`/ipranges remove [low IP], [high IP] - Remove IP range(s). Can be multiline. Requires: hosts manager &`,
			`Example: /ipranges remove 5.152.192.0, 5.152.223.255`,
		],

		rename(target, room, user) {
			if (!(WHITELISTED_USERS.includes(user.id) || this.can('lockdown'))) return false;
			if (!target) return this.parse('/help ipranges rename');
			const [start, end, url] = target.split(',').map(part => part.trim());
			if (!url || !IP_REGEX.test(start) || !IP_REGEX.test(end) || !HOST_REGEX.test(url)) {
				return this.parse('/help ipranges rename');
			}
			const minIP = IPTools.ipToNumber(start);
			const maxIP = IPTools.ipToNumber(end);
			const toRename = IPTools.getRange(minIP, maxIP);
			if (!toRename) return this.errorReply(`No IP range found at ${start}-${end}.`);

			const range = {
				minIP: minIP,
				maxIP: maxIP,
				host: IPTools.urlToHost(url),
			};
			void IPTools.addRange(range);
			const renameInfo = `IP range at ${start}-${end} to ${range.host}`;
			this.globalModlog('DATACENTER RENAME', null, `by ${user.id}: ${renameInfo}`);
			return this.sendReply(`Renamed the ${renameInfo}.`);
		},
		renamehelp: [
			`/ipranges rename [low IP], [high IP], [host] - Changes the host an IP range resolves to.  Requires: hosts manager &`,
		],
	},

	datacentershelp() {
		const help = [
			`<code>/ipranges view</code>: view the list of IP ranges. Requires: hosts manager @ &`,
			`<code>/ipranges add [low IP], [high IP], [host]</code>: add IP ranges (can be multiline). Requires: hosts manager &`,
			`<code>/ipranges widen [low IP], [high IP], [host]</code>: add IP ranges, allowing a new range to completely cover an old range. Requires: hosts manager &`,
			`For example: <code>/ipranges add 5.152.192.0, 5.152.223.255, redstation.com.proxy-nohost</code>.`,
			`Get datacenter info from <code>/whois</code>; <code>[low IP]</code>, <code>[high IP]</code> are the range in the last inetnum.`,
			`<code>/ipranges remove [low IP], [high IP]</code>: remove IP range(s). Can be multiline. Requires: hosts manager &`,
			`For example: <code>/ipranges remove 5.152.192.0, 5.152.223.255</code>.`,
			`<code>/ipranges rename [low IP], [high IP], [host]</code>: changes the host an IP range resolves to. Requires: hosts manager &`,
		];
		return this.sendReply(`|html|<details class="readmore"><summary>IP range management commands:</summary>${help.join('<br />')}`);
	},

	viewhosts(target, room, user) {
		if (!(WHITELISTED_USERS.includes(user.id) || this.can('globalban'))) return false;
		const types = ['all', 'residential', 'mobile', 'ranges'];
		const type = target ? toID(target) : 'all';
		if (!types.includes(type)) {
			return this.errorReply(`'${type}' isn't a valid host type. Specify one of ${types.join(', ')}.`);
		}
		return this.parse(`/join view-hosts-${type}`);
	},
	viewhostshelp: [
		`/viewhosts - View the list of hosts. Requires: hosts manager @ &`,
		`/viewhosts [type] - View the list of a particular type of host. Requires: hosts manager @ &`,
		`Host types are: 'all', 'residential', 'mobile', and 'ranges'.`,
	],

	removehost: 'addhosts',
	removehosts: 'addhosts',
	addhost: 'addhosts',
	addhosts(target, room, user, connection, cmd) {
		if (!(WHITELISTED_USERS.includes(user.id) || this.can('lockdown'))) return false;
		const removing = cmd.includes('remove');
		let [type, toAdd] = target.split('|');
		type = toID(type);
		if (!toAdd) return this.parse('/help addhosts');
		const hosts = toAdd.split(',').map(host => host.trim());
		if (!hosts.length) return this.parse('/help addhosts');

		switch (type) {
		case 'openproxy':
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
		case 'residential':
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
		this.globalModlog(
			removing ? 'REMOVEHOSTS' : 'ADDHOSTS',
			null,
			`by ${user.id}: ${hosts.length} hosts to category '${type}'`
		);
		return this.sendReply(`${removing ? 'Removed' : 'Added'} ${hosts.length} hosts!`);
	},
	addhostshelp: [
		`/addhosts [category] | host1, host2, ... - Adds hosts to the given category. Requires: hosts manager &`,
		`/removehosts [category] | host1, host2, ... - Removes hosts from the given category. Requires: hosts manager &`,
		`Categories are: 'openproxy' (which takes IP addresses, not hosts), 'proxy', 'residential', and 'mobile'.`,
	],

	viewproxies(target, room, user) {
		if (!(WHITELISTED_USERS.includes(user.id) || this.can('globalban'))) return false;
		return this.parse('/join view-proxies');
	},
	viewproxieshelp: [
		`/viewproxies - View the list of proxies. Requires: hosts manager @ &`,
	],
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/(datacenters|datacenter|dc|iprange|ipranges) (add|widen|remove)');
});
