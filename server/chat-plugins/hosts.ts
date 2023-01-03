/**
 * Chat plugin to help manage hosts, proxies, and datacenters
 * Written by Annika
 * Original /adddatacenters command written by Zarel
 */

import {Utils} from "../../lib";
import {AddressRange} from "../ip-tools";
import {GlobalPermission} from "../user-groups";

const HOST_SUFFIXES = ['res', 'proxy', 'mobile'];
const SUFFIX_ALIASES: {[k: string]: string} = {
	residential: 'res',
};
const WHITELISTED_USERIDS: ID[] = [];

function checkCanPerform(
	context: Chat.PageContext | Chat.CommandContext, user: User, permission: GlobalPermission = 'lockdown'
) {
	if (!WHITELISTED_USERIDS.includes(user.id)) context.checkCan(permission);
}

function getHostType(type: string) {
	type = toID(type);
	if (HOST_SUFFIXES.includes(type)) return type;
	if (SUFFIX_ALIASES[type]) return SUFFIX_ALIASES[type];
	throw new Chat.ErrorMessage(`'${type}' is not a valid host type. Please specify one of ${HOST_SUFFIXES.join(', ')}.`);
}

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

function formatRange(range: AddressRange, includeModlogBrackets?: boolean) {
	const startBracket = includeModlogBrackets ? '[' : '';
	const endBracket = includeModlogBrackets ? ']' : '';

	let result = `${startBracket}${IPTools.numberToIP(range.minIP)}${endBracket}`;
	result += `-${startBracket}${IPTools.numberToIP(range.maxIP)}${endBracket}`;
	if (range.host) result += ` (${range.host})`;

	return result;
}

export const pages: Chat.PageTable = {
	proxies(query, user) {
		this.title = "[Proxies]";
		checkCanPerform(this, user, 'globalban');

		const openProxies = [...IPTools.singleIPOpenProxies];
		const proxyHosts = [...IPTools.proxyHosts];
		Utils.sortBy(openProxies, ip => {
			const number = IPTools.ipToNumber(ip);
			if (number === null) {
				Rooms.get('upperstaff')?.add(`|error|Invalid IP address in IPTools.singleIPOpenProxies: '${ip}'`);
				return -1;
			}
			return number;
		});
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
		html += visualizeRangeList(IPTools.ranges.filter(r => r.host?.endsWith('/proxy')));
		html += `</table></div>`;
		return html;
	},

	hosts(query, user) {
		this.title = "[Hosts]";
		checkCanPerform(this, user, 'globalban');
		const type = toID(query[0]) || 'all';

		IPTools.sortRanges();
		const mobileHosts = ['all', 'mobile'].includes(type) ? [...IPTools.mobileHosts] : [];
		const residentialHosts = ['all', 'residential', 'res'].includes(type) ? [...IPTools.residentialHosts] : [];
		const hostRanges = ['all', 'ranges', 'isps'].includes(type) ?
			IPTools.ranges.filter(r => r.host && !r.host.endsWith('/proxy')) :
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
		this.title = "[IP Ranges]";
		checkCanPerform(this, user, 'globalban');
		const type = toID(query[0]) || 'all';
		IPTools.sortRanges();

		let html = ``;
		if (['all', 'mobile'].includes(type)) {
			html += `<div class="ladder pad"><h2>Mobile IP Ranges:</h2><table>`;
			html += visualizeRangeList(IPTools.ranges.filter(range => range.host?.endsWith('/mobile')));
			html += `</table></div>`;
		}
		if (['all', 'res', 'residential'].includes(type)) {
			html += `<div class="ladder pad"><h2>Residential IP Ranges:</h2><table>`;
			html += visualizeRangeList(IPTools.ranges.filter(range => range.host?.endsWith('/res')));
			html += `</table></div>`;
		}
		if (['all', 'proxy', 'proxies'].includes(type)) {
			html += `<div class="ladder pad"><h2>Proxy IP Ranges:</h2><table>`;
			html += visualizeRangeList(IPTools.ranges.filter(range => range.host?.endsWith('/proxy')));
			html += `</table></div>`;
		}
		if (['all', 'openproxy'].includes(type)) {
			html += `<div class="ladder pad"><h2>Single-IP Open Proxies:</h2><table>`;
			for (const ip of IPTools.singleIPOpenProxies) {
				html += `<tr><td>${ip}</td></tr>`;
			}
			html += `</table></div>`;
		}
		return html;
	},

	sharedipblacklist(args, user, connection) {
		this.title = `[Shared IP Blacklist]`;
		checkCanPerform(this, user, 'lock');

		let buf = `<div class="pad"><h2>IPs blocked from being marked as shared</h2>`;
		if (!Punishments.sharedIpBlacklist.size) {
			buf += `<p>None currently.</p>`;
		} else {
			buf += `<div class="ladder"><table><tr><th>IP</th><th>Reason</th></tr>`;
			const sortedSharedIPBlacklist = [...Punishments.sharedIpBlacklist];
			Utils.sortBy(sortedSharedIPBlacklist, ([ipOrRange]) => {
				if (IPTools.ipRegex.test(ipOrRange)) {
					const number = IPTools.ipToNumber(ipOrRange);
					if (number === null) {
						Monitor.error(`Invalid blacklisted-from-markshared IP: '${ipOrRange}`);
						return -1;
					}
					return number;
				}
				return IPTools.stringToRange(ipOrRange)!.minIP;
			});
			for (const [ip, reason] of sortedSharedIPBlacklist) {
				buf += `<tr><td>${ip}</td><td>${reason}</td></tr>`;
			}
			buf += `</table></div>`;
		}
		buf += `</div>`;
		return buf;
	},

	sharedips(args, user, connection) {
		this.title = `[Shared IPs]`;
		checkCanPerform(this, user, 'globalban');

		let buf = `<div class="pad"><h2>IPs marked as shared</h2>`;
		if (!Punishments.sharedIps.size) {
			buf += `<p>None currently.</p>`;
		} else {
			buf += `<div class="ladder"><table><tr><th>IP</th><th>Location</th></tr>`;
			const sortedSharedIPs = [...Punishments.sharedIps];
			Utils.sortBy(sortedSharedIPs, ([ip]) => {
				const number = IPTools.ipToNumber(ip);
				if (number === null) {
					Monitor.error(`Invalid shared IP address: '${ip}'`);
					return -1;
				}
				return number;
			});

			for (const [ip, location] of sortedSharedIPs) {
				buf += `<tr><td>${ip}</td><td>${location}</td></tr>`;
			}
			buf += `</table></div>`;
		}
		buf += `</div>`;
		return buf;
	},
};

export const commands: Chat.ChatCommands = {
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
			checkCanPerform(this, user, 'globalban');
			const types = ['all', 'residential', 'res', 'mobile', 'proxy', 'openproxy'];
			const type = target ? toID(target) : 'all';
			if (!types.includes(type)) {
				return this.errorReply(`'${type}' isn't a valid host type. Specify one of ${types.join(', ')}.`);
			}
			return this.parse(`/join view-ranges-${type}`);
		},
		viewhelp: [
			`/ipranges view - View the list of all IP ranges. Requires: hosts manager @ &`,
			`/ipranges view [type] - View the list of a particular type of IP range ('residential', 'mobile', or 'proxy'). Requires: hosts manager @ &`,
		],

		// Originally by Zarel
		widen: 'add',
		add(target, room, user, connection, cmd) {
			checkCanPerform(this, user, 'globalban');
			if (!target) return this.parse('/help ipranges add');
			// should be in the format: IP, IP, name, URL
			const widen = cmd.includes('widen');

			const [typeString, stringRange, host] = target.split(',').map(part => part.trim());
			if (!host || !IPTools.hostRegex.test(host)) {
				return this.errorReply(`Invalid data: ${target}`);
			}
			const type = getHostType(typeString);
			const range = IPTools.stringToRange(stringRange);
			if (!range) return this.errorReply(`Couldn't parse IP range '${stringRange}'.`);
			range.host = `${IPTools.urlToHost(host)}?/${type}`;

			IPTools.sortRanges();
			let result;
			try {
				result = IPTools.checkRangeConflicts(range, IPTools.ranges, widen);
			} catch (e: any) {
				return this.errorReply(e.message);
			}
			if (typeof result === 'number') {
				// Remove the range that is being widened
				IPTools.removeRange(IPTools.ranges[result].minIP, IPTools.ranges[result].maxIP);
			}
			IPTools.addRange(range as AddressRange & {host: string});

			this.privateGlobalModAction(`${user.name} added the IP range ${formatRange(range)} to the list of ${type} ranges.`);
			this.globalModlog('IPRANGE ADD', null, formatRange(range, true));
		},
		addhelp: [
			`/ipranges add [type], [low]-[high], [host] - Adds an IP range. Requires: hosts manager &`,
			`/ipranges widen [type], [low]-[high], [host] - Adds an IP range, allowing a new range to completely cover an old range. Requires: hosts manager &`,
			`For example: /ipranges add proxy, 5.152.192.0 - 5.152.223.255, redstation.com`,
			`Get datacenter info from whois; [low], [high] are the range in the last inetnum; [type] is one of res, proxy, or mobile.`,
		],

		remove(target, room, user) {
			checkCanPerform(this, user);
			if (!target) return this.parse('/help ipranges remove');

			const range = IPTools.stringToRange(target);
			if (!range) return this.errorReply(`Couldn't parse the IP range '${target}'.`);
			if (!IPTools.getRange(range.minIP, range.maxIP)) return this.errorReply(`No IP range found at '${target}'.`);

			void IPTools.removeRange(range.minIP, range.maxIP);

			this.privateGlobalModAction(`${user.name} removed the IP range ${formatRange(range)}.`);
			this.globalModlog('IPRANGE REMOVE', null, formatRange(range, true));
		},
		removehelp: [
			`/ipranges remove [low IP]-[high IP] - Removes an IP range. Requires: hosts manager &`,
			`Example: /ipranges remove 5.152.192.0-5.152.223.255`,
		],

		rename(target, room, user) {
			checkCanPerform(this, user);
			if (!target) return this.parse('/help ipranges rename');
			const [type, rangeString, url] = target.split(',').map(part => part.trim());
			if (!url) {
				return this.parse('/help ipranges rename');
			}
			const toRename = IPTools.stringToRange(rangeString);
			if (!toRename) return this.errorReply(`Couldn't parse IP range '${rangeString}'.`);
			const exists = IPTools.getRange(toRename.minIP, toRename.maxIP);
			if (!exists) return this.errorReply(`No IP range found at '${rangeString}'.`);

			const range = {
				minIP: toRename.minIP,
				maxIP: toRename.maxIP,
				host: `${IPTools.urlToHost(url)}?/${type}`,
			};
			void IPTools.addRange(range);

			this.privateGlobalModAction(`${user.name} renamed the IP range ${formatRange(toRename)} to ${range.host}.`);
			this.globalModlog('IPRANGE RENAME', null, `IP range ${formatRange(toRename, true)} to ${range.host}`);
		},
		renamehelp: [
			`/ipranges rename [type], [low IP]-[high IP], [host] - Changes the host an IP range resolves to.  Requires: hosts manager &`,
		],
	},

	iprangeshelp() {
		const help = [
			`<code>/ipranges view [type]</code>: view the list of a particular type of IP range (<code>residential</code>, <code>mobile</code>, or <code>proxy</code>). Requires: hosts manager @ &`,
			`<code>/ipranges add [type], [low IP]-[high IP], [host]</code>: add IP ranges (can be multiline). Requires: hosts manager &</summary><code>/ipranges view</code>: view the list of all IP ranges. Requires: hosts manager @ &`,
			`<code>/ipranges widen [type], [low IP]-[high IP], [host]</code>: add IP ranges, allowing a new range to completely cover an old range. Requires: hosts manager &`,
			`For example: <code>/ipranges add proxy, 5.152.192.0-5.152.223.255, redstation.com</code>.`,
			`Get datacenter info from <code>/whois</code>; <code>[low IP]</code>, <code>[high IP]</code> are the range in the last inetnum.`,
			`<code>/ipranges remove [low IP]-[high IP]</code>: remove IP range(s). Can be multiline. Requires: hosts manager &`,
			`For example: <code>/ipranges remove 5.152.192.0, 5.152.223.255</code>.`,
			`<code>/ipranges rename [type], [low IP]-[high IP], [host]</code>: changes the host an IP range resolves to. Requires: hosts manager &`,
		];
		return this.sendReply(`|html|<details class="readmore"><summary>${help.join('<br />')}`);
	},
	viewhosts(target, room, user) {
		checkCanPerform(this, user, 'globalban');
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
		checkCanPerform(this, user);
		const removing = cmd.includes('remove');
		let [type, ...hosts] = target.split(',');
		type = toID(type);
		hosts = hosts.map(host => host.trim());
		if (!hosts.length) return this.parse('/help addhosts');

		switch (type) {
		case 'openproxy':
			for (const host of hosts) {
				if (!IPTools.ipRegex.test(host)) return this.errorReply(`'${host}' is not a valid IP address.`);
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
				if (!IPTools.hostRegex.test(host)) return this.errorReply(`'${host}' is not a valid host.`);
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
				if (!IPTools.hostRegex.test(host)) return this.errorReply(`'${host}' is not a valid host.`);
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
				if (!IPTools.hostRegex.test(host)) return this.errorReply(`'${host}' is not a valid host.`);
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
		this.privateGlobalModAction(
			`${user.name} ${removing ? 'removed' : 'added'} ${hosts.length} hosts (${hosts.join(', ')}) to the ${type} category!`
		);
		this.globalModlog(removing ? 'REMOVEHOSTS' : 'ADDHOSTS', null, `${type}: ${hosts.join(', ')}`);
	},
	addhostshelp: [
		`/addhosts [category], host1, host2, ... - Adds hosts to the given category. Requires: hosts manager &`,
		`/removehosts [category], host1, host2, ... - Removes hosts from the given category. Requires: hosts manager &`,
		`Categories are: 'openproxy' (which takes IP addresses, not hosts), 'proxy', 'residential', and 'mobile'.`,
	],

	viewproxies(target, room, user) {
		checkCanPerform(this, user, 'globalban');
		return this.parse('/join view-proxies');
	},
	viewproxieshelp: [
		`/viewproxies - View the list of proxies. Requires: hosts manager @ &`,
	],

	markshared(target, room, user) {
		if (!target) return this.parse('/help markshared');
		checkCanPerform(this, user, 'globalban');
		const [ip, note] = this.splitOne(target);
		if (!IPTools.ipRegex.test(ip)) {
			const pattern = IPTools.stringToRange(ip);
			if (!pattern) {
				return this.errorReply("Please enter a valid IP address.");
			}
			if (!user.can('rangeban')) {
				return this.errorReply('Only upper staff can markshare ranges.');
			}
			for (const range of Punishments.sharedRanges.keys()) {
				if (IPTools.rangeIntersects(range, pattern)) {
					return this.errorReply(
						`Range ${IPTools.rangeToString(pattern)} intersects with shared range ${IPTools.rangeToString(range)}`
					);
				}
			}
		}

		if (Punishments.isSharedIp(ip)) return this.errorReply("This IP is already marked as shared.");
		if (Punishments.isBlacklistedSharedIp(ip)) {
			return this.errorReply(`This IP is blacklisted from being marked as shared.`);
		}
		if (!note) {
			this.errorReply(`You must specify who owns this shared IP.`);
			this.parse(`/help markshared`);
			return;
		}

		Punishments.addSharedIp(ip, note);
		this.privateGlobalModAction(`The IP '${ip}' was marked as shared by ${user.name}. (${note})`);
		this.globalModlog('SHAREDIP', null, note, ip);
	},
	marksharedhelp: [
		`/markshared [IP], [owner/organization of IP] - Marks an IP address as shared.`,
		`Note: the owner/organization (i.e., University of Minnesota) of the shared IP is required. Requires @ &`,
	],

	unmarkshared(target, room, user) {
		if (!target) return this.parse('/help unmarkshared');
		checkCanPerform(this, user, 'globalban');
		target = target.trim();
		const pattern = IPTools.stringToRange(target);
		if (!pattern) return this.errorReply("Please enter a valid IP address.");
		if (pattern.minIP !== pattern.maxIP && !user.can('rangeban')) {
			return this.errorReply(`Only administrators can unmarkshare ranges.`);
		}

		let shared = false;
		if (pattern.minIP !== pattern.maxIP) {
			for (const range of Punishments.sharedRanges.keys()) {
				shared = range.minIP === pattern.minIP && range.maxIP === pattern.maxIP;
				if (shared) break;
			}
		} else {
			shared = Punishments.sharedIps.has(target);
		}

		if (!shared) return this.errorReply(`That IP/range isn't marked as shared.`);

		Punishments.removeSharedIp(target);

		this.privateGlobalModAction(`The IP '${target}' was unmarked as shared by ${user.name}.`);
		this.globalModlog('UNSHAREDIP', null, null, target);
	},
	unmarksharedhelp: [`/unmarkshared [IP] - Unmarks a shared IP address. Requires @ &`],

	marksharedblacklist: 'nomarkshared',
	marksharedbl: 'nomarkshared',
	nomarkshared: {
		add(target, room, user) {
			if (!target) return this.parse(`/help nomarkshared`);
			checkCanPerform(this, user, 'globalban');
			const [ip, ...reasonArr] = target.split(',');
			if (!IPTools.ipRangeRegex.test(ip)) return this.errorReply(`Please enter a valid IP address or range.`);
			if (!reasonArr?.length) {
				this.errorReply(`A reason is required.`);
				this.parse(`/help nomarkshared`);
				return;
			}
			if (Punishments.isBlacklistedSharedIp(ip)) {
				return this.errorReply(`This IP is already blacklisted from being marked as shared.`);
			}
			// this works because we test ipRangeRegex above, which works for both ranges AND single ips.
			// so we know here this is one of the two.
			// If it doesn't work as a single IP, it's a range.
			if (!IPTools.ipRegex.test(ip)) {
				// if it doesn't end with *, it doesn't function as a range in IPTools#stringToRange, only as a single IP.
				// that's valid behavior, but it's detrimental here.
				if (!ip.endsWith('*')) {
					this.errorReply(`That looks like a range, but it is invalid.`);
					this.errorReply(`Append * to the end of the range and try again.`);
					return;
				}
				if (!user.can('bypassall')) {
					return this.errorReply(`Only Administrators can add ranges.`);
				}
				const range = IPTools.stringToRange(ip);
				if (!range) return this.errorReply(`Invalid IP range.`);
				for (const sharedIp of Punishments.sharedIps.keys()) {
					const ipNum = IPTools.ipToNumber(sharedIp);
					if (IPTools.checkPattern([range], ipNum)) {
						this.parse(`/unmarkshared ${sharedIp}`);
					}
				}
			} else {
				if (Punishments.isSharedIp(ip)) this.parse(`/unmarkshared ${ip}`);
			}
			const reason = reasonArr.join(',');

			Punishments.addBlacklistedSharedIp(ip, reason);

			this.privateGlobalModAction(`The IP '${ip}' was blacklisted from being marked as shared by ${user.name}.`);
			this.globalModlog('SHAREDIP BLACKLIST', null, reason.trim(), ip);
		},
		remove(target, room, user) {
			if (!target) return this.parse(`/help nomarkshared`);
			checkCanPerform(this, user);
			if (!IPTools.ipRangeRegex.test(target)) return this.errorReply(`Please enter a valid IP address or range.`);
			if (!Punishments.sharedIpBlacklist.has(target)) {
				return this.errorReply(`This IP is not blacklisted from being marked as shared.`);
			}

			Punishments.removeBlacklistedSharedIp(target);

			this.privateGlobalModAction(`The IP '${target}' was unblacklisted from being marked as shared by ${user.name}.`);
			this.globalModlog('SHAREDIP UNBLACKLIST', null, null, target);
		},
		view() {
			return this.parse(`/join view-sharedipblacklist`);
		},
		help: '',
		''() {
			return this.parse(`/help nomarkshared`);
		},
	},
	nomarksharedhelp: [
		`/nomarkshared add [IP], [reason] - Prevents an IP from being marked as shared until it's removed from this list. Requires &`,
		`Note: Reasons are required.`,
		`/nomarkshared remove [IP] - Removes an IP from the nomarkshared list. Requires &`,
		`/nomarkshared view - Lists all IPs prevented from being marked as shared. Requires @ &`,
	],

	sharedips: 'viewsharedips',
	viewsharedips() {
		return this.parse('/join view-sharedips');
	},
	viewsharedipshelp: [
		`/viewsharedips — Lists IP addresses marked as shared. Requires: hosts manager @ &`,
	],
};
