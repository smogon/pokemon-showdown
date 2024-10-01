/**
 * Modlog viewer
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Actually reading, writing, and searching modlog is handled in server/modlog/.
 *
 * @license MIT
 */

import {Dashycode, Utils} from '../../lib';
import {ModlogID, ModlogSearch, ModlogEntry} from '../modlog';

const MAX_QUERY_LENGTH = 2500;
const DEFAULT_RESULTS_LENGTH = 100;
const MORE_BUTTON_INCREMENTS = [200, 400, 800, 1600, 3200];
const LINES_SEPARATOR = 'lines=';
const MAX_RESULTS_LENGTH = MORE_BUTTON_INCREMENTS[MORE_BUTTON_INCREMENTS.length - 1];
const IPS_REGEX = /[([]?([0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3})[)\]]?/g;

const ALIASES: {[k: string]: string} = {
	'helpticket': 'help-rooms',
	'groupchat': 'groupchat-rooms',
	'battle': 'battle-rooms',
};

/*********************************************************
 * Modlog Functions
 *********************************************************/

function getMoreButton(
	roomid: ModlogID, searchCmd: string,
	lines: number, maxLines: number, onlyPunishments: boolean, onlyNotes: boolean,
) {
	let newLines = 0;
	for (const increase of MORE_BUTTON_INCREMENTS) {
		if (increase > lines) {
			newLines = increase;
			break;
		}
	}
	if (!newLines || lines < maxLines) {
		return ''; // don't show a button if no more pre-set increments are valid or if the amount of results is already below the max
	} else {
		let cmd = `/modlog`;
		if (onlyNotes) cmd = `/modnotes`;
		if (onlyPunishments) cmd = `/punishlog`;

		return Utils.html`<br /><div style="text-align:center"><button class="button" name="send" value="${cmd} room=${roomid}, ${searchCmd}, ${LINES_SEPARATOR}${newLines}" title="View more results">Older results<br />&#x25bc;</button></div>`;
	}
}

function getRoomID(id: string) {
	if (id in ALIASES) return ALIASES[id] as ModlogID;
	return id as ModlogID;
}

function prettifyResults(
	resultArray: ModlogEntry[], roomid: ModlogID, search: ModlogSearch, searchCmd: string,
	addModlogLinks: boolean, hideIps: boolean, maxLines: number, onlyPunishments: boolean, onlyNotes: boolean
) {
	if (resultArray === null) {
		return "|popup|The modlog query crashed.";
	}
	let roomName;
	switch (roomid) {
	case 'all':
		roomName = "all rooms";
		break;
	case 'public':
		roomName = "all public rooms";
		break;
	default:
		roomName = `room ${roomid}`;
	}
	const scope = onlyPunishments ? 'punishment-related ' : '';
	let searchString = ``;
	const excludes = search.note.filter(s => s.isExclusion).map(s => s.search) || [];
	const includes = search.note.filter(s => !s.isExclusion).map(s => s.search) || [];
	if (includes.length) searchString += `with a note including any of: ${includes.join(', ')} `;
	if (excludes.length) searchString += `with a note that does not include any of: ${excludes.join(', ')} `;
	for (const u of search.user) searchString += `${u.isExclusion ? 'not ' : ''}taken against ${u.search} `;
	for (const ip of search.ip) {
		searchString += `${ip.isExclusion ? 'not ' : ''}taken against a user on the IP ${ip.search} `;
	}
	for (const action of search.action) searchString += `${action.isExclusion ? 'not ' : ''}of the type ${action.search} `;
	for (const actionTaker of search.actionTaker) {
		searchString += `${actionTaker.isExclusion ? 'not ' : ''}taken by ${actionTaker.search} `;
	}
	if (!resultArray.length) {
		return `|popup|No ${scope}moderator actions ${searchString}found on ${roomName}.`;
	}
	const title = `[${roomid}] ${searchCmd}`;
	const lines = resultArray.length;
	let curDate = '';
	const resultString = resultArray.map(result => {
		const date = new Date(result.time || Date.now());
		const entryRoom = result.visualRoomID || result.roomID || 'global';
		let [dateString, timestamp] = Chat.toTimestamp(date, {human: true}).split(' ');
		let line = `<small>[${timestamp}] (${entryRoom})</small> ${result.action}`;
		if (result.userid) {
			line += `: [${result.userid}]`;
			if (result.autoconfirmedID) line += ` ac: [${result.autoconfirmedID}]`;
			if (result.alts.length) line += ` alts: [${result.alts.join('], [')}]`;
			if (!hideIps && result.ip) line += ` [${result.ip}]`;
		}

		if (result.loggedBy) line += `: by ${result.loggedBy}`;
		if (result.note) line += `: ${result.note}`;

		if (dateString !== curDate) {
			curDate = dateString;
			dateString = `</p><p>[${dateString}]<br />`;
		} else {
			dateString = ``;
		}
		const thisRoomID = entryRoom?.split(' ')[0];
		if (addModlogLinks) {
			if (thisRoomID.startsWith('battle-')) {
				timestamp = `<a href="/${thisRoomID}">${timestamp}</a>`;
			} else {
				const [day, time] = Chat.toTimestamp(date).split(' ');
				timestamp = `<a href="/view-chatlog-${thisRoomID}--${day}--time-${toID(time)}">${timestamp}</a>`;
			}
		}
		line = Utils.escapeHTML(line.slice(line.indexOf(')') + ` </small>`.length));
		line = line.replace(
			IPS_REGEX,
			hideIps ? '' : `[<a href="https://whatismyipaddress.com/ip/$1" target="_blank">$1</a>]`
		);
		return `${dateString}<small>[${timestamp}] (${thisRoomID})</small>${line}`;
	}).join(`<br />`);
	const [dateString, timestamp] = Chat.toTimestamp(new Date(), {human: true}).split(' ');
	let preamble;
	const modlogid = roomid + (searchString ? '-' + Dashycode.encode(searchString) : '');
	if (searchString) {
		preamble = `>view-modlog-${modlogid}\n|init|html\n|title|[Modlog]${title}\n` +
			`|pagehtml|<div class="pad"><p>The last ${scope}${Chat.count(lines, "logged actions")} ${Utils.escapeHTML(searchString)} on ${roomName}.`;
	} else {
		preamble = `>view-modlog-${modlogid}\n|init|html\n|title|[Modlog]${title}\n` +
			`|pagehtml|<div class="pad"><p>The last ${Chat.count(lines, `${scope}lines`)} of the Moderator Log of ${roomName}.`;
	}
	preamble += `</p><p>[${dateString}]<br /><small>[${timestamp}] \u2190 current server time</small>`;
	const moreButton = getMoreButton(roomid, searchCmd, lines, maxLines, onlyPunishments, onlyNotes);
	return `${preamble}${resultString}${moreButton}</div>`;
}

async function getModlog(
	connection: Connection, roomid: ModlogID = 'global', search: ModlogSearch,
	searchCmd: string, maxLines = 20, onlyPunishments = false, timed = false, onlyNotes = false,
) {
	const targetRoom = Rooms.search(roomid);
	const user = connection.user;
	roomid = getRoomID(roomid);

	// permission checking
	if (roomid === 'all' || roomid === 'public') {
		if (!user.can('modlog')) {
			return connection.popup("Access denied");
		}
	} else {
		if (!user.can('modlog', null, targetRoom) && !user.can('modlog')) {
			return connection.popup("Access denied");
		}
	}

	const hideIps = !user.can('lock');
	const addModlogLinks = !!(
		(user.tempGroup !== ' ' || (targetRoom && targetRoom.settings.isPrivate !== true))
	);
	if (hideIps && search.ip.length) {
		connection.popup(`You cannot search for IPs.`);
		return;
	}
	if (Object.values(search).join('').length > MAX_QUERY_LENGTH) {
		connection.popup(`Your search query is too long.`);
		return;
	}

	if (search.note?.length) {
		for (const [i, noteSearch] of search.note.entries()) {
			if (/^["'].+["']$/.test(noteSearch.search)) {
				search.note[i] = {...noteSearch, search: noteSearch.search.substring(1, noteSearch.search.length - 1)};
				search.note[i].isExact = true;
			}
		}
	}

	for (const [i, userSearch] of search.user.entries()) {
		if (/^["'].+["']$/.test(userSearch.search)) {
			userSearch.search = userSearch.search.substring(1, userSearch.search.length - 1);
			userSearch.isExact = true;
		}
		userSearch.search = toID(userSearch.search);

		search.user[i] = userSearch;
	}
	if (onlyNotes) search.action.push({search: 'NOTE'});

	const response = await Rooms.Modlog.search(roomid, search, maxLines, onlyPunishments);
	if (!response) return connection.popup(`The moderator log is currently disabled.`);

	connection.send(
		prettifyResults(
			response.results,
			roomid,
			search,
			searchCmd,
			addModlogLinks,
			hideIps,
			maxLines,
			onlyPunishments,
			onlyNotes,
		)
	);
	if (timed) connection.popup(`The modlog query took ${response.duration} ms to complete.`);
}

const shouldSearchGlobal = ['staff', 'adminlog'];

export const commands: Chat.ChatCommands = {
	ml: 'modlog',
	punishlog: 'modlog',
	pl: 'modlog',
	timedmodlog: 'modlog',
	mlid: 'modlog',
	mlip: 'modlog',
	plid: 'modlog',
	plip: 'modlog',
	modnotes: 'modlog',
	modlog(target, room, user, connection, cmd) {
		let roomid: ModlogID = (!room || shouldSearchGlobal.includes(room.roomid) ? 'global' : room.roomid);
		const onlyPunishments = cmd.startsWith('pl') || cmd.startsWith('punishlog');
		let lines;
		const possibleParam = cmd.slice(2);
		const targets = target.split(',').map(f => f.trim()).filter(Boolean);
		const search: ModlogSearch = {note: [], user: [], ip: [], action: [], actionTaker: []};

		switch (possibleParam) {
		case 'id':
			targets.unshift(`user='${targets.shift()}'`);
			break;
		case 'ip':
			targets.unshift(`ip=${targets.shift()}`);
			break;
		}

		for (const [i, option] of targets.entries()) {
			let [param, value] = option.split('=').map(part => part.trim());
			if (!value) {
				// If no specific parameter is specified, we should search all fields
				value = param.trim();
				if (i === 0 && value) {
					// they might mean a roomid, as per the old format of /modlog
					param = 'room';
					// if the room exists, they probably mean a roomid. otherwise, assume they're misusing it.
					// we except gdrivers+ from this because drivers can access deleted room modlogs
					if (!Rooms.search(toID(value)) && !user.can('lock')) {
						return this.parse(`/help modlog`);
					}
				} else {
					this.errorReply(`You must specify a search type and search value.`);
					return this.parse(`/help modlog`);
				}
			}
			const isExclusion = param.endsWith('!');
			param = toID(param);
			switch (param) {
			case 'note': case 'text':
				if (!search.note) search.note = [];
				search.note.push({search: value, isExclusion});
				break;
			case 'user': case 'name': case 'username': case 'userid':
				search.user.push({search: value});
				break;
			case 'ip': case 'ipaddress': case 'ipaddr':
				search.ip.push({search: value, isExclusion});
				break;
			case 'action': case 'punishment':
				search.action.push({search: value.toUpperCase(), isExclusion});
				break;
			case 'actiontaker': case 'moderator': case 'staff': case 'mod':
				search.actionTaker.push({search: toID(value), isExclusion});
				break;
			case 'room': case 'roomid':
				roomid = value.toLowerCase().replace(/[^a-z0-9-]+/g, '') as ModlogID;
				break;
			case 'lines': case 'maxlines':
				lines = parseInt(value);
				if (isNaN(lines) || lines < 1) return this.errorReply(`Invalid linecount: '${value}'.`);
				break;
			default:
				this.errorReply(`Invalid modlog parameter: '${param}'.`);
				return this.errorReply(`Please specify 'room', 'note', 'user', 'ip', 'action', 'staff', or 'lines'.`);
			}
		}

		const targetRoom = Rooms.search(roomid);
		// if a room alias was used, replace alias with actual id
		if (targetRoom) roomid = targetRoom.roomid;

		if (roomid.includes('-')) {
			if (user.can('modlog')) {
				// default to global modlog for staff convenience
				roomid = 'global';
			} else {
				return this.errorReply(`Only global staff may view battle and groupchat modlogs.`);
			}
		}

		if (!target && !lines) {
			lines = 20;
		}
		if (!lines) lines = DEFAULT_RESULTS_LENGTH;
		if (lines > MAX_RESULTS_LENGTH) lines = MAX_RESULTS_LENGTH;

		void getModlog(
			connection,
			roomid,
			search,
			target.replace(/^\s?([^,=]*),\s?/, '').replace(/,?\s*(room|lines)\s*=[^,]*,?/g, ''),
			lines,
			onlyPunishments,
			cmd === 'timedmodlog',
			cmd === 'modnotes',
		);
	},
	modloghelp() {
		this.sendReplyBox(
			`<code>/modlog [comma-separated list of parameters]</code>: searches the moderator log, defaulting to the current room unless specified otherwise.<br />` +
			`You can replace the <code>=</code> in a parameter with a <code>!=</code> to exclude entries that match that parameter.<br />` +
			`<details><summary><strong>Parameters</strong></summary>` +
			`<ul>` +
			`<li><code>room=[room]</code> - searches a room's modlog</li>` +
			`<li><code>userid=[user]</code> - searches for a username (or fragment of one)</li>` +
			`<li><code>note=[text]</code> - searches the contents of notes/reasons</li>` +
			`<li><code>ip=[IP address]</code> - searches for an IP address (or fragment of one)</li>` +
			`<li><code>staff=[user]</code> - searches for actions taken by a particular staff member</li>` +
			`<li><code>action=[type]</code> - searches for a particular type of action</li>` +
			`<li><code>lines=[number]</code> - displays the given number of lines</li>` +
			`</ul>` +
			`</details>` +
			`<details><summary><strong>Additional commands</strong></summary>` +
			`<ul>` +
			`<li><code>/mlid [user]</code> - searches for actions taken against a specific user</li>` +
			`<li><code>/mlip [IP address]</code> - searches for actions taken against a specific IP address</li>` +
			`<li><code>/punishlog</code>, <code>/pl</code>, <code>/plid</code>, <code>/plip</code> - like <code>/modlog</code>, but only displays punishments</li>` +
			`<li><code>/modnotes</code> - searches only modnotes</li>` +
			`</ul>` +
			`</details>`
		);
	},
	mls: 'modlogstats',
	modlogstats(target, room, user) {
		this.checkCan('lock');
		target = toID(target);
		if (!target) return this.parse(`/help modlogstats`);
		return this.parse(`/join view-modlogstats-${target}`);
	},
	modlogstatshelp: [`/modlogstats [userid] - Fetch all information on that [userid] from the modlog (IPs, alts, etc). Requires: @ ~`],
};

export const pages: Chat.PageTable = {
	async modlogstats(query, user) {
		this.checkCan('lock');
		const target = toID(query.shift());
		if (!target || target.length > 18) {
			return this.errorReply(`Invalid userid - must be between 1 and 18 characters long.`);
		}
		this.title = `[Modlog Stats] ${target}`;
		this.setHTML(`<div class="pad"><strong>Running modlog search...</strong></div>`);
		const entries = await Rooms.Modlog.search('global', {
			user: [{
				search: target,
				isExact: true,
			}], note: [], ip: [], action: [], actionTaker: [],
		}, 1000);
		if (!entries?.results.length) {
			return this.errorReply(`No data found.`);
		}
		const punishmentTable = new Utils.Multiset<string>();
		const punishmentsByIp = new Map<string, Utils.Multiset<string>>();
		const actionsWithIp = new Set<string>();
		const alts = new Set<string>();
		const autoconfirmed = new Set<string>();
		const ips = new Set<string>();
		for (const entry of entries.results) {
			if (entry.action !== 'NOTE') {
				punishmentTable.add(entry.action);
				if (entry.ip) {
					let ipTable = punishmentsByIp.get(entry.ip);
					if (!ipTable) {
						ipTable = new Utils.Multiset<string>();
						punishmentsByIp.set(entry.ip, ipTable);
					}
					ipTable.add(entry.action);
					actionsWithIp.add(entry.action);
				}
			}
			if (entry.alts) {
				for (const alt of entry.alts) alts.add(alt);
			}
			if (entry.autoconfirmedID) autoconfirmed.add(entry.autoconfirmedID);
			if (entry.ip) ips.add(entry.ip);
		}
		let buf = `<div class="pad"><h2>Modlog information for ${target}</h2><hr />`;
		if (alts.size) {
			buf += `<strong>Listed alts:</strong> `;
			buf += `<small>(These are userids sharing the same IP at the time of the punishment, they may not be direct alts)</small><br />`;
			buf += [...alts]
				.map(id => `<a href="https://${Config.routes.root}/users/${toID(id)}">${toID(id)}</a>`)
				.join(', ');
			buf += `<br /><br />`;
		}

		if (autoconfirmed.size) {
			buf += `<strong>Autoconfirmed alts:</strong>`;
			buf += ` (these are autoconfirmed accounts linked to their name, and are very likely them)<br />`;
			buf += [...autoconfirmed]
				.map(id => `<a href="https://${Config.routes.root}/users/${toID(id)}">${toID(id)}</a>`)
				.join(', ');
			buf += `<br /><br />`;
		}

		if (ips.size) {
			buf += `<strong>Known IPs:</strong><br />`;
			const mapped = await Promise.all([...ips].map(async ip => {
				const info = await IPTools.lookup(ip);
				return `<a href="https://whatismyipaddress.com/ip/${ip}">${ip}</a> [${info.hostType}]`;
			}));
			buf += mapped.join(', ');
			buf += `<br /><br />`;
		}

		if (punishmentTable.size) {
			buf += `<strong>Punishments:</strong><br />`;
			buf += `<div class="ladder pad"><table>`;
			buf += `<tr><th>Punishment type</th><th>Count</th></tr>`;
			for (const [punishment, number] of punishmentTable) {
				buf += `<tr><td>${punishment}</td><td>${number}</td></tr>`;
			}
			buf += `</table></div><br />`;
		}
		if (punishmentsByIp.size) {
			buf += `<strong>Punishments by IP:</strong><br />`;
			const keys = [...actionsWithIp];
			buf += `<div class="ladder pad"><table>`;
			buf += `<tr><th></th>${keys.map(k => `<th>${k}</th>`).join("")}</tr>`;
			for (const [ip, table] of punishmentsByIp) {
				buf += `<tr><td><a href="https://whatismyipaddress.com/ip/${ip}">${ip}</a></td>`;
				for (const key of keys) {
					buf += `<td>${table.get(key)}</td>`;
				}
				buf += `</tr>`;
			}
			buf += `</table></div>`;
		}

		buf += `<br /><br />`;
		return buf;
	},
};
