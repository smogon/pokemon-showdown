/**
 * Pokemon Showdown log viewer
 *
 * by Zarel
 * @license MIT
 */

import { Utils, FS, Dashycode, ProcessManager, Net, Streams } from '../../lib';
import { SQL } from '../../lib/database';
import { roomlogTable } from '../roomlogs';

const DAY = 24 * 60 * 60 * 1000;
const MAX_MEMORY = 67108864; // 64MB
const MAX_TOPUSERS = 100;

const UPPER_STAFF_ROOMS = ['upperstaff', 'adminlog', 'slowlog'];

interface ChatlogSearch {
	raw?: boolean;
	search: string;
	room: RoomID;
	date: string;
	limit?: number | null;
	args?: string[];
}

interface RoomStats {
	/**
	 * Lines per user.
	 */
	lines: { [k: string]: number };
	// guessed from |J| (number of joins)
	users: { [k: string]: number };
	days: number;
	/**
	 * Average wait time between each line ("dead")
	 */
	deadTime: number;
	/**
	 * Average percent of the day that it's inactive
	 */
	deadPercent: number;
	/**
	 * Average lines per user.
	 */
	linesPerUser: number;
	totalLines: number;
	/**
	 * Average user count present at any given time (from |userstats|)
	 */
	averagePresent: number;
}

export class LogReaderRoom {
	roomid: RoomID;
	constructor(roomid: RoomID) {
		this.roomid = roomid;
	}

	async listMonths() {
		if (roomlogTable) {
			const dates = await roomlogTable.query<any>()`SELECT DISTINCT month FROM roomlog_dates WHERE roomid = ${this.roomid}`;
			return dates.map(x => x.month);
		}
		try {
			const listing = await Monitor.logPath(`chat/${this.roomid}`).readdir();
			return listing.filter(file => /^[0-9][0-9][0-9][0-9]-[0-9][0-9]$/.test(file));
		} catch {
			return [];
		}
	}

	async listDays(month: string) {
		if (roomlogTable) {
			const dates = await (
				roomlogTable.query<any>()`SELECT DISTINCT date FROM roomlog_dates WHERE roomid = ${this.roomid} AND month = ${month}`
			);
			return dates.map(x => x.date);
		}
		try {
			const listing = await Monitor.logPath(`chat/${this.roomid}/${month}`).readdir();
			return listing.filter(file => file.endsWith(".txt")).map(file => file.slice(0, -4));
		} catch {
			return [];
		}
	}

	async getLog(day: string) {
		if (roomlogTable) {
			const [dayStart, dayEnd] = LogReader.dayToRange(day);
			const logs = await roomlogTable.selectAll(
				['log', 'time']
			)`WHERE roomid = ${this.roomid} AND time BETWEEN ${dayStart}::int::timestamp AND ${dayEnd}::int::timestamp`;
			return new Streams.ObjectReadStream<string>({
				read(this: Streams.ObjectReadStream<string>) {
					for (const { log, time } of logs) {
						this.buf.push(`${Chat.toTimestamp(time).split(' ')[1]} ${log}`);
					}
					this.pushEnd();
				},
			});
		}
		const month = LogReader.getMonth(day);
		const log = Monitor.logPath(`chat/${this.roomid}/${month}/${day}.txt`);
		if (!await log.exists()) return null;
		return log.createReadStream().byLine();
	}
}

export const LogReader = new class {
	async get(roomid: RoomID) {
		if (roomlogTable) {
			if (!(await roomlogTable.selectOne()`WHERE roomid = ${roomid}`)) return null;
		} else {
			if (!await Monitor.logPath(`chat/${roomid}`).exists()) return null;
		}
		return new LogReaderRoom(roomid);
	}

	async list() {
		if (roomlogTable) {
			const roomids = await roomlogTable.query()`SELECT DISTINCT roomid FROM roomlogs`;
			return roomids.map(x => x.roomid) as RoomID[];
		}
		const listing = await Monitor.logPath(`chat`).readdir();
		return listing.filter(file => /^[a-z0-9-]+$/.test(file)) as RoomID[];
	}

	async listCategorized(user: User, opts?: string) {
		const list = await this.list();
		const isUpperStaff = user.can('rangeban');
		const isStaff = user.can('lock');

		const official = [];
		const normal = [];
		const hidden = [];
		const secret = [];
		const deleted = [];
		const personal: RoomID[] = [];
		const deletedPersonal: RoomID[] = [];
		let atLeastOne = false;

		for (const roomid of list) {
			const room = Rooms.get(roomid);
			const forceShow = room && (
				// you are authed in the room
				(room.auth.has(user.id) && user.can('mute', null, room)) ||
				// you are staff and currently in the room
				(isStaff && user.inRooms.has(room.roomid))
			);
			if (!isUpperStaff && !forceShow) {
				if (!isStaff) continue;
				if (!room) continue;
				if (!room.checkModjoin(user)) continue;
				if (room.settings.isPrivate === true) continue;
			}

			atLeastOne = true;
			if (roomid.includes('-')) {
				const matchesOpts = opts && roomid.startsWith(`${opts}-`);
				if (matchesOpts || opts === 'all' || forceShow) {
					(room ? personal : deletedPersonal).push(roomid);
				}
			} else if (!room) {
				if (opts === 'all' || opts === 'deleted') deleted.push(roomid);
			} else if (room.settings.section === 'official') {
				official.push(roomid);
			} else if (!room.settings.isPrivate) {
				normal.push(roomid);
			} else if (room.settings.isPrivate === 'hidden') {
				hidden.push(roomid);
			} else {
				secret.push(roomid);
			}
		}

		if (!atLeastOne) return null;
		return { official, normal, hidden, secret, deleted, personal, deletedPersonal };
	}

	/** @returns [dayStart, dayEnd] as seconds (NOT milliseconds) since Unix epoch */
	dayToRange(day: string): [number, number] {
		const nextDay = LogReader.nextDay(day);
		return [
			Math.trunc(new Date(day).getTime() / 1000),
			Math.trunc(new Date(nextDay).getTime() / 1000),
		];
	}
	/** @returns [monthStart, monthEnd] as seconds (NOT milliseconds) since Unix epoch */
	monthToRange(month: string): [number, number] {
		const nextMonth = LogReader.nextMonth(month);
		return [
			Math.trunc(new Date(`${month}-01`).getTime() / 1000),
			Math.trunc(new Date(`${nextMonth}-01`).getTime() / 1000),
		];
	}

	getMonth(day?: string) {
		if (!day) day = Chat.toTimestamp(new Date()).split(' ')[0];
		return day.slice(0, 7);
	}
	nextDay(day: string) {
		const nextDay = new Date(new Date(day).getTime() + DAY);
		return nextDay.toISOString().slice(0, 10);
	}
	prevDay(day: string) {
		const prevDay = new Date(new Date(day).getTime() - DAY);
		return prevDay.toISOString().slice(0, 10);
	}
	nextMonth(month: string) {
		const nextMonth = new Date(new Date(`${month}-15`).getTime() + 30 * DAY);
		return nextMonth.toISOString().slice(0, 7);
	}
	prevMonth(month: string) {
		const prevMonth = new Date(new Date(`${month}-15`).getTime() - 30 * DAY);
		return prevMonth.toISOString().slice(0, 7);
	}
	today() {
		return Chat.toTimestamp(new Date()).slice(0, 10);
	}
	isMonth(text: string) {
		return /^[0-9]{4}-(?:0[0-9]|1[0-2])$/.test(text);
	}
	isDay(text: string) {
		// yes, this exactly matches JavaScript's built-in validation for `new Date`
		// 02-31? oh yeah that's just the 3rd of March
		// 02-32? invalid date
		// which makes this a pretty useful function for validating that `nextDay`
		// won't crash on the input text.
		return /^[0-9]{4}-(?:0[0-9]|1[0-2])-(?:[0-2][0-9]|3[0-1])$/.test(text);
	}
};

export const LogViewer = new class {
	async day(roomid: RoomID, day: string, opts?: string) {
		const month = LogReader.getMonth(day);
		let buf = `<div class="pad"><p>` +
			`<a roomid="view-chatlog">◂ All logs</a> / ` +
			`<a roomid="view-chatlog-${roomid}">${roomid}</a> /  ` +
			`<a roomid="view-chatlog-${roomid}--${month}">${month}</a> / ` +
			`<strong>${day}</strong></p><small>${opts ? `Options in use: ${opts}` : ''}</small> <hr />`;

		const roomLog = await LogReader.get(roomid);
		if (!roomLog) {
			buf += `<p class="message-error">Room "${roomid}" doesn't exist</p></div>`;
			return this.linkify(buf);
		}

		const prevDay = LogReader.prevDay(day);
		const prevRoomid = `view-chatlog-${roomid}--${prevDay}${opts ? `--${opts}` : ''}`;
		buf += `<p><a roomid="${prevRoomid}" class="blocklink" style="text-align:center">▲<br />${prevDay}</a></p>` +
			`<div class="message-log" style="overflow-wrap: break-word">`;

		const stream = await roomLog.getLog(day);
		if (!stream) {
			buf += `<p class="message-error">Room "${roomid}" doesn't have logs for ${day}</p>`;
		} else {
			for await (const line of stream) {
				// sometimes there can be newlines in there. parse accordingly
				for (const part of line.split('\n')) {
					buf += this.renderLine(part, opts, { roomid, date: day });
				}
			}
		}
		buf += `</div>`;
		if (day !== LogReader.today()) {
			const nextDay = LogReader.nextDay(day);
			const nextRoomid = `view-chatlog-${roomid}--${nextDay}${opts ? `--${opts}` : ''}`;
			buf += `<p><a roomid="${nextRoomid}" class="blocklink" style="text-align:center">${nextDay}<br />▼</a></p>`;
		}

		buf += `</div>`;
		return this.linkify(buf);
	}

	parseChatLine(line: string, day: string) {
		const [timestamp, type, ...rest] = line.split('|');
		if (type === 'c:') {
			const [time, username, ...message] = rest;
			return { time: new Date(time), username, message: message.join('|') };
		}
		return { time: new Date(timestamp + day), username: rest[0], message: rest.join('|') };
	}

	renderLine(fullLine: string, opts?: string, data?: { roomid: RoomID, date: string }) {
		if (!fullLine) return ``;
		let timestamp = fullLine.slice(0, 8);
		let line;
		if (/^[0-9:]+$/.test(timestamp)) {
			line = fullLine.charAt(9) === '|' ? fullLine.slice(10) : '|' + fullLine.slice(9);
		} else {
			timestamp = '';
			line = '!NT|';
		}
		if (opts !== 'all' && (
			line.startsWith(`userstats|`) ||
			line.startsWith('J|') || line.startsWith('L|') || line.startsWith('N|')
		)) return ``;

		const getClass = (name: string) => {
			// we use the raw numbers because links don't support colons
			// so you'd need to put chatlog-roomid--day--time-200000 instead of
			// chatlog-roomid--day--time-20:00:00
			const stampNums = toID(timestamp);
			if (toID(opts) === stampNums) name += ` highlighted`;
			return `class="${name}" data-server="${stampNums}"`;
		};
		if (opts === 'txt') return Utils.html`<div ${getClass('chat')}>${fullLine}</div>`;

		const cmd = line.slice(0, line.indexOf('|'));
		if (opts?.includes('onlychat')) {
			if (cmd !== 'c') return '';
			if (opts.includes('txt')) return `<div ${getClass('chat')}>${Utils.escapeHTML(fullLine)}</div>`;
		}
		const timeLink = data ?
			`<a class="subtle" href="/view-chatlog-${data.roomid}--${data.date}--time-${timestamp}">${timestamp}</a>` :
			timestamp;
		switch (cmd) {
		case 'c': {
			const [, name, message] = Utils.splitFirst(line, '|', 2);
			if (name.length <= 1) {
				return `<div ${getClass('chat')}><small>[${timeLink}] </small><q>${Chat.formatText(message)}</q></div>`;
			}
			if (message.startsWith(`/log `)) {
				return `<div ${getClass('chat')}><small>[${timeLink}] </small><q>${Chat.formatText(message.slice(5))}</q></div>`;
			}
			if (message.startsWith(`/raw `)) {
				return `<div ${getClass('notice')}>${message.slice(5)}</div>`;
			}
			if (message.startsWith(`/uhtml `) || message.startsWith(`/uhtmlchange `)) {
				if (message.startsWith(`/uhtmlchange `)) return ``;
				if (opts !== 'all') return `<div ${getClass('notice')}>[uhtml box hidden]</div>`;
				return `<div ${getClass('notice')}>${message.slice(message.indexOf(',') + 1)}</div>`;
			}
			const group = !name.startsWith(' ') ? name.charAt(0) : ``;
			return `<div ${getClass('chat')}>` +
				`<small>[${timeLink}]` + Utils.html` ${group}</small><username>${name.slice(1)}:</username> ` +
				`<q>${Chat.formatText(message)}</q>` +
				`</div>`;
		}
		case 'html': case 'raw': {
			const [, html] = Utils.splitFirst(line, '|', 1);
			return `<div ${getClass('notice')}>${html}</div>`;
		}
		case 'uhtml': case 'uhtmlchange': {
			if (cmd !== 'uhtml') return ``;
			const [, , html] = Utils.splitFirst(line, '|', 2);
			return `<div ${getClass('notice')}>${html}</div>`;
		}
		case '!NT':
			return `<div ${getClass('chat')}>${Utils.escapeHTML(fullLine)}</div>`;
		case '':
			return `<div ${getClass('chat')}><small>[${timeLink}] </small>${Utils.escapeHTML(line.slice(1))}</div>`;
		default:
			return `<div ${getClass('chat')}><small>[${timeLink}] </small><code>${'|' + Utils.escapeHTML(line)}</code></div>`;
		}
	}

	async month(roomid: RoomID, month: string) {
		let buf = `<div class="pad"><p>` +
			`<a roomid="view-chatlog">◂ All logs</a> / ` +
			`<a roomid="view-chatlog-${roomid}">${roomid}</a> / ` +
			`<strong>${month}</strong></p><hr />`;

		const roomLog = await LogReader.get(roomid);
		if (!roomLog) {
			buf += `<p class="message-error">Room "${roomid}" doesn't exist</p></div>`;
			return this.linkify(buf);
		}

		const prevMonth = LogReader.prevMonth(month);
		buf += `<p><a roomid="view-chatlog-${roomid}--${prevMonth}" class="blocklink" style="text-align:center">▲<br />${prevMonth}</a></p><div>`;

		const days = await roomLog.listDays(month);
		if (!days.length) {
			buf += `<p class="message-error">Room "${roomid}" doesn't have logs in ${month}</p></div>`;
			return this.linkify(buf);
		} else {
			for (const day of days) {
				buf += `<p>- <a roomid="view-chatlog-${roomid}--${day}">${day}</a> <small>`;
				for (const opt of ['txt', 'onlychat', 'all', 'txt-onlychat']) {
					buf += ` (<a roomid="view-chatlog-${roomid}--${day}--${opt}">${opt}</a>) `;
				}
				buf += `</small></p>`;
			}
		}

		if (!LogReader.today().startsWith(month)) {
			const nextMonth = LogReader.nextMonth(month);
			buf += `<p><a roomid="view-chatlog-${roomid}--${nextMonth}" class="blocklink" style="text-align:center">${nextMonth}<br />▼</a></p>`;
		}

		buf += `</div>`;
		return this.linkify(buf);
	}
	async room(roomid: RoomID) {
		let buf = `<div class="pad"><p>` +
			`<a roomid="view-chatlog">◂ All logs</a> / ` +
			`<strong>${roomid}</strong></p><hr />`;

		const roomLog = await LogReader.get(roomid);
		if (!roomLog) {
			buf += `<p class="message-error">Room "${roomid}" doesn't exist</p></div>`;
			return this.linkify(buf);
		}

		const months = await roomLog.listMonths();
		if (!months.length) {
			buf += `<p class="message-error">Room "${roomid}" doesn't have logs</p></div>`;
			return this.linkify(buf);
		}

		for (const month of months) {
			buf += `<p>- <a roomid="view-chatlog-${roomid}--${month}">${month}</a></p>`;
		}
		buf += `</div>`;
		return this.linkify(buf);
	}
	async list(user: User, opts?: string) {
		let buf = `<div class="pad"><p>` +
			`<strong>All logs</strong></p><hr />`;

		const categories: { [k: string]: string } = {
			'official': "Official",
			'normal': "Public",
			'hidden': "Hidden",
			'secret': "Secret",
			'deleted': "Deleted",
			'personal': "Personal",
			'deletedPersonal': "Deleted Personal",
		};
		const list = await LogReader.listCategorized(user, opts) as { [k: string]: RoomID[] };

		if (!list) {
			buf += `<p class="message-error">You must be a staff member of a room to view its logs</p></div>`;
			return buf;
		}

		const showPersonalLink = opts !== 'all' && user.can('rangeban');
		for (const k in categories) {
			if (!list[k].length && !(['personal', 'deleted'].includes(k) && showPersonalLink)) {
				continue;
			}
			buf += `<p>${categories[k]}</p>`;
			if (k === 'personal' && showPersonalLink) {
				if (opts !== 'help') buf += `<p>- <a roomid="view-chatlog--help">(show all help)</a></p>`;
				if (opts !== 'groupchat') buf += `<p>- <a roomid="view-chatlog--groupchat">(show all groupchat)</a></p>`;
			}
			if (k === 'deleted' && showPersonalLink) {
				if (opts !== 'deleted') buf += `<p>- <a roomid="view-chatlog--deleted">(show deleted)</a></p>`;
			}
			for (const roomid of list[k]) {
				buf += `<p>- <a roomid="view-chatlog-${roomid}">${roomid}</a></p>`;
			}
		}
		buf += `</div>`;
		return this.linkify(buf);
	}
	error(message: string) {
		return `<div class="pad"><p class="message-error">${message}</p></div>`;
	}
	linkify(buf: string) {
		return buf.replace(/<a roomid="/g, `<a target="replace" href="/`);
	}
};

export abstract class Searcher {
	static checkEnabled() {
		if (global.Config.disableripgrep) {
			throw new Chat.ErrorMessage("Log searching functionality is currently disabled.");
		}
	}
	roomstatsCache = new Map<string, RoomStats>();
	constructUserRegex(user: string) {
		const id = toID(user);
		return `.${[...id].join('[^a-zA-Z0-9]*')}[^a-zA-Z0-9]*`;
	}
	abstract searchLinecounts(roomid: RoomID, month: string, user?: ID): Promise<string>;
	renderLinecountResults(
		results: { [date: string]: { [userid: string]: number } } | null,
		roomid: RoomID, month: string, user?: ID
	) {
		let buf = Utils.html`<div class="pad"><h2>Linecounts on `;
		buf += `${roomid}${user ? ` for the user ${user}` : ` (top ${MAX_TOPUSERS})`}</h2>`;
		buf += `<strong>Total lines: {total}</strong><br />`;
		buf += `<strong>Month: ${month}</strong><br />`;
		const nextMonth = LogReader.nextMonth(month);
		const prevMonth = LogReader.prevMonth(month);
		if (Monitor.logPath(`chat/${roomid}/${prevMonth}`).existsSync()) {
			buf += `<small><a roomid="view-roomstats-${roomid}--${prevMonth}${user ? `--${user}` : ''}">Previous month</a></small>`;
		}
		if (Monitor.logPath(`chat/${roomid}/${nextMonth}`).existsSync()) {
			buf += ` <small><a roomid="view-roomstats-${roomid}--${nextMonth}${user ? `--${user}` : ''}">Next month</a></small>`;
		}
		if (!results) {
			buf += '<hr />';
			buf += LogViewer.error(`Logs for month '${month}' do not exist on room ${roomid}.`);
			return buf;
		} else if (user) {
			buf += '<hr /><ol>';
			const sortedDays = Utils.sortBy(Object.keys(results));
			let total = 0;
			for (const day of sortedDays) {
				const dayResults = results[day][user];
				if (isNaN(dayResults)) continue;
				total += dayResults;
				buf += `<li>[<a roomid="view-chatlog-${roomid}--${day}">${day}</a>]: `;
				buf += `${Chat.count(dayResults, 'lines')}</li>`;
			}
			buf = buf.replace('{total}', `${total}`);
		} else {
			buf += '<hr /><ol>';
			// squish the results together
			const totalResults: { [k: string]: number } = {};
			for (const date of Utils.sortBy(Object.keys(results))) {
				for (const userid in results[date]) {
					if (!totalResults[userid]) totalResults[userid] = 0;
					totalResults[userid] += results[date][userid];
				}
			}
			const resultKeys = Object.keys(totalResults);
			const sortedResults = Utils.sortBy(resultKeys, userid => (
				-totalResults[userid]
			)).slice(0, MAX_TOPUSERS);
			let total = 0;
			for (const userid of sortedResults) {
				total += totalResults[userid];
				buf += `<li><span class="username"><username>${userid}</username></span>: `;
				buf += `${Chat.count(totalResults[userid], 'lines')}</li>`;
			}
			buf = buf.replace('{total}', `${total}`);
		}
		buf += `</div>`;
		return LogViewer.linkify(buf);
	}
	async runLinecountSearch(context: Chat.PageContext, roomid: RoomID, month: string, user?: ID) {
		context.setHTML(
			`<div class="pad"><h2>Searching linecounts on room ${roomid}${user ? ` for the user ${user}` : ''}.</h2></div>`
		);
		context.setHTML(await LogSearcher.searchLinecounts(roomid, month, user));
	}
	runSearch() {
		throw new Chat.ErrorMessage(`This functionality is currently disabled.`);
	}
	// this would normally be abstract, but it's very difficult with ripgrep
	// so it's easier to just do it the same way for both.
	async roomStats(room: RoomID, month: string) {
		if (!Monitor.logPath(`chat/${room}`).existsSync()) {
			return LogViewer.error(Utils.html`Room ${room} not found.`);
		}
		if (!Monitor.logPath(`chat/${room}/${month}`).existsSync()) {
			return LogViewer.error(Utils.html`Room ${room} does not have logs for the month ${month}.`);
		}
		const stats = await LogSearcher.activityStats(room, month);
		let buf = `<div class="pad"><h2>Room stats for ${room} [${month}]</h2><hr />`;
		buf += `<strong>Total days with logs: ${stats.average.days}</strong><br />`;
		/* if (prevExists) { TODO restore
			buf += `<br /><a roomid="view-roominfo-${room}--${prev}">Previous month</a>`;
			buf += nextExists ? ` | ` : `<br />`;
		}
		if (nextExists) {
			buf += `${prevExists ? `` : `<br />`}<a roomid="view-roominfo-${room}--${next}">Next month</a><br />`;
		} */
		buf += this.visualizeStats(stats.average);
		buf += `<hr />`;
		buf += `<details class="readmore"><summary><strong>Stats by day</strong></summary>`;
		for (const day of stats.days) {
			buf += `<div class="infobox"><strong><a roomid="view-chatlog-${room}--${(day as any).day}">${(day as any).day}</a></strong><br />`;
			buf += this.visualizeStats(day);
			buf += `</div>`;
		}
		buf += '</details>';
		return LogViewer.linkify(buf);
	}
	visualizeStats(stats: RoomStats) {
		const titles: { [k: string]: string } = {
			deadTime: 'Average time between lines',
			deadPercent: 'Average % of the day spent more than 5 minutes inactive',
			linesPerUser: 'Average lines per user',
			averagePresent: 'Average users present',
			totalLines: 'Average lines per day',
		};
		let buf = `<div class="ladder pad"><table><tr><th>`;
		buf += Object.values(titles).join('</th><th>');
		buf += `</th></tr><tr>`;
		for (const k in titles) {
			buf += `<td>`;
			switch (k) {
			case 'deadTime':
				buf += Chat.toDurationString(stats.deadTime, { precision: 2 });
				break;

			case 'linesPerUser': case 'totalLines': case 'averagePresent': case 'deadPercent':
				buf += (stats[k] || 0).toFixed(2);
				break;
			}
			buf += `</td>`;
		}
		buf += `</tr></table></div>`;
		return buf;
	}
	abstract activityStats(room: RoomID, month: string): Promise<{ average: RoomStats, days: RoomStats[] }>;
}

export class FSLogSearcher extends Searcher {
	results: number;
	constructor() {
		super();
		this.results = 0;
	}
	async searchLinecounts(roomid: RoomID, month: string, user?: ID) {
		const directory = Monitor.logPath(`chat/${roomid}/${month}`);
		if (!directory.existsSync()) {
			return this.renderLinecountResults(null, roomid, month, user);
		}
		const files = await directory.readdir();
		const results: { [date: string]: { [userid: string]: number } } = {};
		for (const file of files) {
			const day = file.slice(0, -4);
			const stream = Monitor.logPath(`chat/${roomid}/${month}/${file}`).createReadStream();
			for await (const line of stream.byLine()) {
				const parts = line.split('|').map(toID);
				const id = parts[2];
				if (!id) continue;
				if (parts[1] === 'c') {
					if (user && id !== user) continue;
					if (!results[day]) results[day] = {};
					if (!results[day][id]) results[day][id] = 0;
					results[day][id]++;
				}
			}
		}
		return this.renderLinecountResults(results, roomid, month, user);
	}
	async dayStats(room: RoomID, day: string) {
		const cached = this.roomstatsCache.get(room + '-' + day);
		if (cached) return cached;
		const results: RoomStats & { day: string } = {
			deadTime: 0,
			deadPercent: 0,
			lines: {},
			users: {},
			days: 1, // irrelevant
			linesPerUser: 0,
			totalLines: 0,
			averagePresent: 0,
			day,
		};
		const path = Monitor.logPath(`chat/${room}/${LogReader.getMonth(day)}/${day}.txt`);
		if (!path.existsSync()) return false;
		const stream = path.createReadStream();
		let lastTime = new Date(day).getTime(); // start at beginning of day to be sure
		let userstatCount = 0;
		const waitIncrements = [];
		for await (const line of stream.byLine()) {
			const [, type, ...rest] = line.split('|');
			switch (type) {
			// the actual info in this is unused, but it may be useful in the future (we use the keys later)
			case 'J': case 'j': {
				if (rest[0]?.startsWith('*')) continue; // ignore bots
				const userid = toID(rest[0]);
				if (!results.users[userid]) {
					results.users[userid] = 0;
				}
				results.users[userid]++;
				break;
			}
			case 'c:': case 'c': {
				const { time, username } = LogViewer.parseChatLine(line, day);
				const curTime = time.getTime();
				if (curTime - lastTime > 5 * 60 * 1000) { // more than 5 minutes
					waitIncrements.push(curTime - lastTime);
					lastTime = curTime;
				}
				const userid = toID(username);
				if (!results.lines[userid]) results.lines[userid] = 0;
				results.lines[userid]++;
				results.totalLines++;
				break;
			}
			case 'userstats': {
				const [rawTotal] = rest;
				const total = parseInt(rawTotal.split(':')[1]);
				results.averagePresent += total;
				userstatCount++;
				break;
			}
			}
		}
		results.deadTime = waitIncrements.length ? this.calculateDead(waitIncrements) : 0;
		results.deadPercent = !results.totalLines ? 100 : (waitIncrements.length / results.totalLines) * 100;
		results.linesPerUser = (results.totalLines / Object.keys(results.users).length) || 0;
		results.averagePresent /= userstatCount;

		// we don't cache the current day's stats because that could be inaccurate, whereas old days will always be the same
		if (day !== LogReader.today()) {
			this.roomstatsCache.set(room + '-' + day, results);
		}
		return results;
	}
	private calculateDead(waitIncrements: number[]) {
		let num = 0;
		for (const k of waitIncrements) {
			num += k;
		}
		return num / waitIncrements.length;
	}
	async activityStats(room: RoomID, month: string) {
		const days = (await Monitor.logPath(`chat/${room}/${month}`).readdir()).map(f => f.slice(0, -4));
		const stats: RoomStats[] = [];
		const today = Chat.toTimestamp(new Date()).split(' ')[0];
		for (const day of days) {
			if (day === today) { // if the day is not over: do not count it, it'll skew the numbers
				continue;
			}
			const curStats = await this.dayStats(room, day);
			if (!curStats) continue;
			stats.push(curStats);
		}
		// now, having collected the stats for each day, we need to merge them together
		const collected: RoomStats = {
			deadTime: 0,
			deadPercent: 0,
			lines: {},
			users: {},
			days: days.length,
			linesPerUser: 0,
			totalLines: 0,
			averagePresent: 0,
		};

		// merge
		for (const entry of stats) {
			for (const k of ['deadTime', 'deadPercent', 'linesPerUser', 'totalLines', 'averagePresent'] as const) {
				collected[k] += entry[k];
			}
			for (const type of ['lines'] as const) {
				for (const k in entry[type]) {
					if (!collected[type][k]) collected[type][k] = 0;
					collected[type][k] += entry[type][k];
				}
			}
		}

		// average
		for (const k of ['deadTime', 'deadPercent', 'linesPerUser', 'totalLines', 'averagePresent'] as const) {
			collected[k] /= stats.length;
		}

		return { average: collected, days: stats };
	}
}

export class RipgrepLogSearcher extends FSLogSearcher {
	async ripgrepSearchMonth(opts: ChatlogSearch) {
		const { search, room: roomid, date: month, args } = opts;
		let results: string[];
		let lineCount = 0;
		if (Config.disableripgrep) {
			return { lineCount: 0, results: [] };
		}
		const resultSep = args?.includes('-m') ? '--' : '\n';
		try {
			const options = [
				'-e', search,
				Monitor.logPath(`chat/${roomid}/${month}`).path,
				'-i',
			];
			if (args) {
				options.push(...args);
			}
			const { stdout } = await ProcessManager.exec(['rg', ...options], {
				maxBuffer: MAX_MEMORY,
				cwd: FS.ROOT_PATH,
			});
			results = stdout.split(resultSep);
		} catch (e: any) {
			if (e.code !== 1 && !e.message.includes('stdout maxBuffer') && !e.message.includes('No such file or directory')) {
				throw e; // 2 means an error in ripgrep
			}
			if (e.stdout) {
				results = e.stdout.split(resultSep);
			} else {
				results = [];
			}
		}
		lineCount += results.length;
		return { results, lineCount };
	}
	override async searchLinecounts(room: RoomID, month: string, user?: ID) {
		// don't need to check if logs exist since ripgrepSearchMonth does that
		const regexString = (
			user ? `\\|c\\|${this.constructUserRegex(user)}\\|` : `\\|c\\|([^|]+)\\|`
		) + `(?!\\/uhtml(change)?)`;
		const args: string[] = user ? ['--count'] : [];
		args.push(`--pcre2`);
		const { results: rawResults } = await this.ripgrepSearchMonth({
			search: regexString, raw: true, date: month, room, args,
		});
		const results: { [k: string]: { [userid: string]: number } } = {};
		for (const fullLine of rawResults) {
			const [data, line] = fullLine.split('.txt:');
			const date = data.split('/').pop()!;
			if (!results[date]) results[date] = {};
			if (!toID(date)) continue;
			if (user) {
				if (!results[date][user]) results[date][user] = 0;
				const parsed = parseInt(line);
				results[date][user] += isNaN(parsed) ? 0 : parsed;
			} else {
				const parts = line?.split('|').map(toID);
				if (!parts || parts[1] !== 'c') continue;
				const id = parts[2];
				if (!id) continue;
				if (!results[date][id]) results[date][id] = 0;
				results[date][id]++;
			}
		}
		return this.renderLinecountResults(results, room, month, user);
	}
}

export class DatabaseLogSearcher extends Searcher {
	async searchLinecounts(roomid: RoomID, month: string, user?: ID) {
		user = toID(user);
		if (!Rooms.Roomlogs.table) throw new Error(`Database search made while database is disabled.`);
		const results: { [date: string]: { [user: string]: number } } = {};
		const [monthStart, monthEnd] = LogReader.monthToRange(month);
		const rows = await Rooms.Roomlogs.table.selectAll()`
			WHERE ${user ? SQL`userid = ${user} AND ` : SQL``}roomid = ${roomid} AND
			time BETWEEN ${monthStart}::int::timestamp AND ${monthEnd}::int::timestamp AND
			type = ${'c'}
		`;

		for (const row of rows) {
			// 'c' rows should always have userids, so this should never be an issue.
			// this is just to appease TS.
			if (!row.userid) continue;
			const day = Chat.toTimestamp(row.time).split(' ')[0];
			if (!results[day]) results[day] = {};
			if (!results[day][row.userid]) results[day][row.userid] = 0;
			results[day][row.userid]++;
		}

		return this.renderLinecountResults(results, roomid, month, user);
	}
	activityStats(room: RoomID, month: string): Promise<{ average: RoomStats, days: RoomStats[] }> {
		throw new Chat.ErrorMessage('This is not yet implemented for the new logs database.');
	}
}

export const LogSearcher: Searcher = new (
	Rooms.Roomlogs.table ? DatabaseLogSearcher :
	// no db, determine fs reader type.
	Config.chatlogreader === 'ripgrep' ? RipgrepLogSearcher : FSLogSearcher
)();

const accessLog = Monitor.logPath(`chatlog-access.txt`).createAppendStream();

export const pages: Chat.PageTable = {
	async chatlog(args, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		let [roomid, date, opts] = Utils.splitFirst(args.join('-'), '--', 2) as
			[RoomID, string | undefined, string | undefined];
		if (!roomid || roomid.startsWith('-')) {
			this.title = '[Logs]';
			return LogViewer.list(user, roomid?.slice(1));
		}
		this.title = '[Logs] ' + roomid;

		// permission check
		const room = Rooms.get(roomid);
		if (!user.trusted) {
			if (room) {
				this.checkCan('declare', null, room);
			} else {
				return this.errorReply(`Access denied.`);
			}
		}

		if (!user.can('rangeban')) {
			// Some chatlogs can only be viewed by upper staff
			if (roomid.startsWith('spl') && roomid !== 'splatoon') {
				return this.errorReply("SPL team discussions are super secret.");
			}
			if (roomid.startsWith('wcop')) {
				return this.errorReply("WCOP team discussions are super secret.");
			}
			if (UPPER_STAFF_ROOMS.includes(roomid) && !user.inRooms.has(roomid)) {
				return this.errorReply("Upper staff rooms are super secret.");
			}
		}
		if (room) {
			if (!user.can('lock') || room.settings.isPrivate === 'hidden' && !room.checkModjoin(user)) {
				if (!room.persist) return this.errorReply(`Access denied.`);
				this.checkCan('mute', null, room);
			}
		} else {
			this.checkCan('lock');
		}

		void accessLog.writeLine(`${user.id}: <${roomid}> ${date}`);

		if (!date) {
			return LogViewer.room(roomid);
		}

		date = date.trim();
		let search;

		const parsedDate = new Date(date);
		const validDateStrings = ['all', 'alltime'];
		const validNonDateTerm = search ? validDateStrings.includes(date) : date === 'today';
		// this is apparently the best way to tell if a date is invalid
		if (isNaN(parsedDate.getTime()) && !validNonDateTerm) {
			return this.errorReply(`Invalid date.`);
		}

		const isTime = opts?.startsWith('time-');
		if (isTime && opts) opts = toID(opts.slice(5));

		if (search) {
			Searcher.checkEnabled();
			this.checkCan('bypassall');
			return LogSearcher.runSearch();
		} else {
			if (date === 'today') {
				this.setHTML(await LogViewer.day(roomid, LogReader.today(), opts));
				if (isTime) this.send(`|scroll|div[data-server="${opts}"]`);
			} else if (date.split('-').length === 3) {
				this.setHTML(await LogViewer.day(roomid, parsedDate.toISOString().slice(0, 10), opts));
				if (isTime) this.send(`|scroll|div[data-server="${opts}"]`);
			} else {
				return LogViewer.month(roomid, parsedDate.toISOString().slice(0, 7));
			}
		}
	},
	roomstats(args, user) {
		Searcher.checkEnabled();
		const room = this.extractRoom();
		if (room) {
			this.checkCan('mute', null, room);
		} else {
			if (!user.can('bypassall')) {
				return this.errorReply(`You cannot view logs for rooms that no longer exist.`);
			}
		}
		const [, date, target] = Utils.splitFirst(args.join('-'), '--', 3).map(item => item.trim());
		if (isNaN(new Date(date).getTime())) {
			return this.errorReply(`Invalid date.`);
		}
		if (!LogReader.isMonth(date)) {
			return this.errorReply(`You must specify an exact month - both a year and a month.`);
		}
		this.title = `[Log Stats] ${date}`;
		return LogSearcher.runLinecountSearch(this, room ? room.roomid : args[2] as RoomID, date, toID(target));
	},
	async logsaccess(query) {
		this.checkCan('rangeban');
		const type = toID(query.shift());
		if (type && !['chat', 'battle', 'all', 'battles'].includes(type)) {
			return this.errorReply(`Invalid log type.`);
		}
		let title = '';
		switch (type) {
		case 'battle': case 'battles':
			title = 'Battlelog access log';
			break;
		case 'chat':
			title = 'Chatlog access log';
			break;
		default:
			title = 'Logs access log';
			break;
		}
		const userid = toID(query.shift());
		let buf = `<div class="pad"><h2>${title}`;
		if (userid) buf += ` for ${userid}`;
		buf += `</h2><hr /><ol>`;
		const accessStream = Monitor.logPath(`chatlog-access.txt`).createReadStream();
		for await (const line of accessStream.byLine()) {
			const [id, rest] = Utils.splitFirst(line, ': ');
			if (userid && id !== userid) continue;
			if (type === 'battle' && !line.includes('battle-')) continue;
			if (userid) {
				buf += `<li>${rest}</li>`;
			} else {
				buf += `<li><username>${id}</username>: ${rest}</li>`;
			}
		}
		buf += `</ol>`;
		return buf;
	},
	roominfo(query, user) {
		this.checkCan('rangeban');
		const args = Utils.splitFirst(query.join('-'), '--', 2);
		const roomid = toID(args.shift()) as RoomID;
		if (!roomid) {
			return this.errorReply(`Specify a room.`);
		}
		const date = args.shift() || LogReader.getMonth();
		this.title = `[${roomid}] Activity Stats (${date})`;
		this.setHTML(`<div class="pad">Collecting stats for ${roomid} in ${date}...</div>`);
		return LogSearcher.roomStats(roomid, date);
	},
};

export const commands: Chat.ChatCommands = {
	chatlogs: 'chatlog',
	cl: 'chatlog',
	roomlog: 'chatlog',
	rl: 'chatlog',
	roomlogs: 'chatlog',
	chatlog(target, room, user) {
		const [tarRoom, ...opts] = target.split(',');
		const targetRoom = tarRoom ? Rooms.search(tarRoom) : room;
		const roomid = targetRoom ? targetRoom.roomid : target;
		return this.parse(`/join view-chatlog-${roomid}--today${opts ? `--${opts.map(toID).join('--')}` : ''}`);
	},

	chatloghelp() {
		const strings = [
			`/chatlog [optional room], [opts] - View chatlogs from the given room. `,
			`If none is specified, shows logs from the room you're in. Requires: % @ * # ~`,
			`Supported options:`,
			`<code>txt</code> - Do not render logs.`,
			`<code>txt-onlychat</code> - Show only chat lines, untransformed.`,
			`<code>onlychat</code> - Show only chat lines.`,
			`<code>all</code> - Show all lines, including userstats and join/leave messages.`,
		];
		this.runBroadcast();
		return this.sendReplyBox(strings.join('<br />'));
	},

	sl: 'searchlogs',
	logsearch: 'searchlogs',
	searchlog: 'searchlogs',
	searchlogs(target, room) {
		target = target.trim();
		const args = target.split(',').map(item => item.trim());
		if (!target) return this.parse('/help searchlogs');
		let date = 'all';
		const searches: string[] = [];
		let limit = '500';
		let targetRoom: RoomID | undefined = room?.roomid;
		for (const arg of args) {
			if (arg.startsWith('room=')) {
				targetRoom = arg.slice(5).trim().toLowerCase() as RoomID;
			} else if (arg.startsWith('limit=')) {
				limit = arg.slice(6);
			} else if (arg.startsWith('date=')) {
				date = arg.slice(5);
			} else if (arg.startsWith('user=')) {
				args.push(`user-${toID(arg.slice(5))}`);
			} else {
				searches.push(arg);
			}
		}
		if (!targetRoom) {
			return this.parse(`/help searchlogs`);
		}
		return this.parse(
			`/join view-chatlog-${targetRoom}--${date}--search-` +
			`${Dashycode.encode(searches.join('+'))}--limit-${limit}`
		);
	},
	searchlogshelp() {
		const buffer = `<details class="readmore"><summary><code>/searchlogs [arguments]</code>: ` +
			`searches logs in the current room using the <code>[arguments]</code>.</summary>` +
			`A room can be specified using the argument <code>room=[roomid]</code>. Defaults to the room it is used in.<br />` +
			`A limit can be specified using the argument <code>limit=[number less than or equal to 3000]</code>. Defaults to 500.<br />` +
			`A date can be specified in ISO (YYYY-MM-DD) format using the argument <code>date=[month]</code> (for example, <code>date: 2020-05</code>). Defaults to searching all logs.<br />` +
			`If you provide a user argument in the form <code>user=username</code>, it will search for messages (that match the other arguments) only from that user.<br />` +
			`All other arguments will be considered part of the search ` +
			`(if more than one argument is specified, it searches for lines containing all terms).<br />` +
			"Requires: ~</div>";
		return this.sendReplyBox(buffer);
	},
	topusers: 'linecount',
	roomstats: 'linecount',
	linecount(target, room, user) {
		const params = target.split(',').map(f => f.trim());
		const search: Partial<{ roomid: RoomID, date: string, user: string }> = {};
		for (const [i, param] of params.entries()) {
			let [key, val] = param.split('=');
			if (!val) {
				// backwards compatibility
				switch (i) {
				case 0:
					val = key;
					key = 'room';
					break;
				case 1:
					val = key;
					key = 'date';
					break;
				case 2:
					val = key;
					key = 'user';
					break;
				default:
					return this.parse(`/help linecount`);
				}
			}
			if (!toID(val)) continue; // unset, continue and allow defaults to apply

			key = key.toLowerCase().replace(/ /g, '');
			switch (key) {
			case 'room': case 'roomid':
				const tarRoom = Rooms.search(val);
				if (!tarRoom) {
					return this.errorReply(`Room '${val}' not found.`);
				}
				search.roomid = tarRoom.roomid;
				break;
			case 'user': case 'id': case 'userid':
				search.user = toID(val);
				break;
			case 'date': case 'month': case 'time':
				if (!LogReader.isMonth(val)) {
					return this.errorReply(`Invalid date.`);
				}
				search.date = val;
			}
		}
		if (!search.roomid) {
			if (!room) {
				return this.errorReply(`If you're not specifying a room, you must use this command in a room.`);
			}
			search.roomid = room.roomid;
		}
		if (!search.date) {
			search.date = LogReader.getMonth();
		}
		return this.parse(`/join view-roomstats-${search.roomid}--${search.date}${search.user ? `--${search.user}` : ''}`);
	},
	linecounthelp() {
		return this.sendReplyBox(
			`<code>/linecount OR /roomstats OR /topusers</code> [<code>key=value</code> formatted parameters] - ` +
			`Searches linecounts with the given parameters.<br />` +
			`<details class="readmore"><summary><strong>Parameters:</strong></summary>` +
			`- <code>room</code> (aliases: <code>roomid</code>) - Select a room to search. If no room is given, defaults to current room.<br />` +
			`- <code>date</code> (aliases: <code>month</code>, <code>time</code>) - ` +
			`Select a month to search linecounts on (requires YYYY-MM format). Defaults to current month.<br />` +
			`- <code>user</code> (aliases: <code>id</code>, <code>userid</code>) - ` +
			`Searches for linecounts only from a given user. ` +
			`If this is not provided, /linecount instead shows line counts for all users from that month.</details>` +
			`Parameters may also be specified without a [key]. When using this, arguments are provided in the format ` +
			`<code>/linecount [room], [month], [user].</code>. This does not use any defaults.<br />`
		);
	},
	battlelog(target, room, user) {
		this.checkCan('lock');
		target = target.trim();
		if (!target) return this.errorReply(`Specify a battle.`);
		if (target.startsWith('http://')) target = target.slice(7);
		if (target.startsWith('https://')) target = target.slice(8);
		if (target.startsWith(`${Config.routes.client}/`)) target = target.slice(Config.routes.client.length + 1);
		if (target.startsWith(`${Config.routes.replays}/`)) target = `battle-${target.slice(Config.routes.replays.length + 1)}`;
		if (target.startsWith('psim.us/')) target = target.slice(8);
		return this.parse(`/join view-battlelog-${target}`);
	},
	battleloghelp: [
		`/battlelog [battle link] - View the log of the given [battle link], even if the replay was not saved.`,
		`Requires: % @ ~`,
	],

	gbc: 'getbattlechat',
	async getbattlechat(target, room, user) {
		this.checkCan('lock');
		let [roomName, userName] = Utils.splitFirst(target, ',').map(f => f.trim());
		if (!roomName) {
			if (!room) {
				return this.errorReply(`If you are not specifying a room, use this command in a room.`);
			}
			roomName = room.roomid;
		}
		if (roomName.startsWith('http://')) roomName = roomName.slice(7);
		if (roomName.startsWith('https://')) roomName = roomName.slice(8);
		if (roomName.startsWith(`${Config.routes.client}/`)) {
			roomName = roomName.slice(Config.routes.client.length + 1);
		}
		if (roomName.startsWith(`${Config.routes.replays}/`)) {
			roomName = `battle-${roomName.slice(Config.routes.replays.length + 1)}`;
		}
		if (roomName.startsWith('psim.us/')) roomName = roomName.slice(8);
		const queryStringStart = roomName.indexOf('?');
		if (queryStringStart > -1) {
			roomName = roomName.slice(0, queryStringStart);
		}
		const roomid = roomName.toLowerCase().replace(/[^a-z0-9-]+/g, '') as RoomID;
		if (!roomid) return this.parse('/help getbattlechat');
		const userid = toID(userName);
		if (userName && !userid) return this.errorReply(`Invalid username.`);
		if (!roomid.startsWith('battle-')) return this.errorReply(`You must specify a battle.`);
		const tarRoom = Rooms.get(roomid);

		let log: string[];
		if (tarRoom) {
			log = tarRoom.log.log;
		} else if (Rooms.Replays.db) {
			let battleId = roomid.replace('battle-', '');
			if (battleId.endsWith('pw')) {
				battleId = battleId.slice(0, battleId.lastIndexOf("-", battleId.length - 2));
			}
			const replayData = await Rooms.Replays.get(battleId);
			if (!replayData) {
				return this.errorReply(`No room or replay found for that battle.`);
			}
			log = replayData.log.split('\n');
		} else {
			try {
				const raw = await Net(`https://${Config.routes.replays}/${roomid.slice('battle-'.length)}.json`).get();
				const data = JSON.parse(raw);
				log = data.log ? data.log.split('\n') : [];
			} catch {
				return this.errorReply(`No room or replay found for that battle.`);
			}
		}
		log = log.filter(l => l.startsWith('|c|'));

		let buf = '';
		let atLeastOne = false;
		let i = 0;
		for (const line of log) {
			const [,, username, message] = Utils.splitFirst(line, '|', 3);
			if (userid && toID(username) !== userid) continue;
			i++;
			buf += Utils.html`<div class="chat"><span class="username"><username>${username}:</username></span> ${message}</div>`;
			atLeastOne = true;
		}
		if (i > 20) buf = `<details class="readmore">${buf}</details>`;
		if (!atLeastOne) buf = `<br />None found.`;

		this.runBroadcast();

		return this.sendReplyBox(
			Utils.html`<strong>Chat messages in the battle '${roomid}'` +
			(userid ? `from the user '${userid}'` : "") + `</strong>` +
			buf
		);
	},
	getbattlechathelp: [
		`/getbattlechat [battle link][, username] - Gets all battle chat logs from the given [battle link].`,
		`If a [username] is given, searches only chat messages from the given username.`,
		`Requires: % @ ~`,
	],

	logsaccess(target, room, user) {
		this.checkCan('rangeban');
		const [type, userid] = target.split(',').map(toID);
		return this.parse(`/j view-logsaccess-${type || 'all'}${userid ? `-${userid}` : ''}`);
	},
	logsaccesshelp: [
		`/logsaccess [type], [user] - View chatlog access logs for the given [type] and [user].`,
		`If no arguments are given, shows the entire access log.`,
		`Requires: ~`,
	],

	gcsearch: 'groupchatsearch',
	async groupchatsearch(target, room, user) {
		this.checkCan('lock');
		target = target.toLowerCase().replace(/[^a-z0-9-]+/g, '');
		if (!target) return this.parse(`/help groupchatsearch`);
		if (target.length < 3) {
			return this.errorReply(`Too short of a search term.`);
		}
		const files = await Monitor.logPath(`chat`).readdir();
		const buffer = [];
		for (const roomid of files) {
			if (roomid.startsWith('groupchat-') && roomid.includes(target)) {
				buffer.push(roomid);
			}
		}
		Utils.sortBy(buffer, roomid => !!Rooms.get(roomid));
		return this.sendReplyBox(
			`Groupchats with a roomid matching '${target}': ` +
			(buffer.length ? buffer.map(id => `<a href="/view-chatlog-${id}">${id}</a>`).join('; ') : 'None found.')
		);
	},
	groupchatsearchhelp: [
		`/groupchatsearch [target] - Searches for logs of groupchats with names containing the [target]. Requires: % @ ~`,
	],

	roomact: 'roomactivity',
	roomactivity(target, room, user) {
		this.checkCan('bypassall');
		const [id, date] = target.split(',').map(i => i.trim());
		if (id) room = Rooms.search(toID(id)) as Room | null;
		if (!room) return this.errorReply(`Either use this command in the target room or specify a room.`);
		return this.parse(`/join view-roominfo-${room}${date ? `--${date}` : ''}`);
	},
	roomactivityhelp: [
		`/roomactivity [room][, date] - View room activity logs for the given room.`,
		`If a date is provided, it searches for logs from that date. Otherwise, it searches the current month.`,
		`Requires: ~`,
	],
};
