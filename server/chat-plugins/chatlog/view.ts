/**
 * Pokemon Showdown log viewer
 *
 * by Zarel
 * @license MIT
 */

import {Utils, Net, FS, ProcessManager, Repl} from '../../../lib';
import {Config} from '../../config-loader';
import {Dex} from '../../../sim/dex';
import {Chat} from '../../chat';
import {searchMonth} from './search';

const DAY = 24 * 60 * 60 * 1000;
const MAX_PROCESSES = 1;
const MAX_TOPUSERS = 100;

const CHATLOG_PM_TIMEOUT = 1 * 60 * 60 * 1000; // 1 hour

const UPPER_STAFF_ROOMS = ['upperstaff', 'adminlog', 'slowlog'];

interface RoomStats {
	/**
	 * Lines per user.
	 */
	lines: {[k: string]: number};
	// guessed from |J| (number of joins)
	users: {[k: string]: number};
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
		try {
			const listing = await FS(`logs/chat/${this.roomid}`).readdir();
			return listing.filter(file => /^[0-9][0-9][0-9][0-9]-[0-9][0-9]$/.test(file));
		} catch {
			return [];
		}
	}

	async listDays(month: string) {
		try {
			const listing = await FS(`logs/chat/${this.roomid}/${month}`).readdir();
			return listing.filter(file => file.endsWith(".txt")).map(file => file.slice(0, -4));
		} catch {
			return [];
		}
	}

	async getLog(day: string) {
		const month = LogReader.getMonth(day);
		const log = FS(`logs/chat/${this.roomid}/${month}/${day}.txt`);
		if (!await log.exists()) return null;
		return log.createReadStream();
	}
}

export const LogReader = new class {
	async get(roomid: RoomID) {
		if (!await FS(`logs/chat/${roomid}`).exists()) return null;
		return new LogReaderRoom(roomid);
	}

	async list() {
		const listing = await FS(`logs/chat`).readdir();
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
		return {official, normal, hidden, secret, deleted, personal, deletedPersonal};
	}

	async read(roomid: RoomID, day: string, limit: number) {
		const roomLog = await LogReader.get(roomid);
		const stream = await roomLog!.getLog(day);
		let buf = '';
		let i = 0;
		if (!stream) {
			buf += `<p class="message-error">Room "${roomid}" doesn't have logs for ${day}</p>`;
		} else {
			for await (const line of stream.byLine()) {
				const rendered = LogViewer.renderLine(line);
				if (rendered) {
					buf += `${line}\n`;
					i++;
					if (i > limit) break;
				}
			}
		}
		return buf;
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
	async findBattleLog(tier: ID, number: number): Promise<string[] | null> {
		// binary search!
		const months = (await FS('logs').readdir()).filter(this.isMonth).sort();
		if (!months.length) return null;

		// find first day
		let firstDay!: string;
		while (months.length) {
			const month = months[0];
			try {
				const days = (await FS(`logs/${month}/${tier}/`).readdir()).filter(this.isDay).sort();
				firstDay = days[0];
				break;
			} catch {}
			months.shift();
		}
		if (!firstDay) return null;

		// find last day
		let lastDay!: string;
		while (months.length) {
			const month = months[months.length - 1];
			try {
				const days = (await FS(`logs/${month}/${tier}/`).readdir()).filter(this.isDay).sort();
				lastDay = days[days.length - 1];
				break;
			} catch {}
			months.pop();
		}
		if (!lastDay) throw new Error(`getBattleLog month range search for ${tier}`);

		const getBattleNum = (battleName: string) => Number(battleName.split('-')[1].slice(0, -9));

		const getDayRange = async (day: string) => {
			const month = day.slice(0, 7);

			try {
				const battles = (await FS(`logs/${month}/${tier}/${day}`).readdir()).filter(
					b => b.endsWith('.log.json')
				);
				Utils.sortBy(battles, getBattleNum);

				return [getBattleNum(battles[0]), getBattleNum(battles[battles.length - 1])];
			} catch {
				return null;
			}
		};

		const dayExists = (day: string) => FS(`logs/${day.slice(0, 7)}/${tier}/${day}`).exists();

		const nextExistingDay = async (day: string) => {
			for (let i = 0; i < 3650; i++) {
				day = this.nextDay(day);
				if (await dayExists(day)) return day;
				if (day === lastDay) return null;
			}
			return null;
		};

		const prevExistingDay = async (day: string) => {
			for (let i = 0; i < 3650; i++) {
				day = this.prevDay(day);
				if (await dayExists(day)) return day;
				if (day === firstDay) return null;
			}
			return null;
		};

		for (let i = 0; i < 100; i++) {
			const middleDay = new Date(
				(new Date(firstDay).getTime() + new Date(lastDay).getTime()) / 2
			).toISOString().slice(0, 10);

			let currentDay: string | null = middleDay;
			let dayRange = await getDayRange(middleDay);

			if (!dayRange) {
				currentDay = await nextExistingDay(middleDay);
				if (!currentDay) {
					const lastExistingDay = await prevExistingDay(middleDay);
					if (!lastExistingDay) throw new Error(`couldn't find existing day`);
					lastDay = lastExistingDay;
					continue;
				}
				dayRange = await getDayRange(currentDay);
				if (!dayRange) throw new Error(`existing day was a lie`);
			}

			const [lowest, highest] = dayRange;

			if (number < lowest) {
				// before currentDay
				if (firstDay === currentDay) return null;
				lastDay = this.prevDay(currentDay);
			} else if (number > highest) {
				// after currentDay
				if (lastDay === currentDay) return null;
				firstDay = this.nextDay(currentDay);
			} else {
				// during currentDay
				const month = currentDay.slice(0, 7);
				const path = FS(`logs/${month}/${tier}/${currentDay}/${tier}-${number}.log.json`);
				if (await path.exists()) {
					return JSON.parse(path.readSync()).log;
				}
				return null;
			}
		}

		// 100 iterations is enough to search 2**100 days, which is around 1e30 days
		// for comparison, a millennium is 365000 days
		throw new Error(`Infinite loop looking for ${tier}-${number}`);
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
			for await (const line of stream.byLine()) {
				buf += this.renderLine(line, opts);
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

	async battle(tier: string, number: number, context: Chat.PageContext) {
		if (number > Rooms.global.lastBattle) {
			throw new Chat.ErrorMessage(`That battle cannot exist, as the number has not been used.`);
		}
		const roomid = `battle-${tier}-${number}` as RoomID;
		context.setHTML(`<div class="pad"><h2>Locating battle logs for the battle ${tier}-${number}...</h2></div>`);
		const log = await PM.query({
			queryType: 'battlesearch', roomid: toID(tier), search: number,
		});
		if (!log) return context.setHTML(this.error("Logs not found."));
		const {connection} = context;
		context.close();
		connection.sendTo(
			roomid, `|init|battle\n|title|[Battle Log] ${tier}-${number}\n${log.join('\n')}`
		);
		connection.sendTo(roomid, `|expire|This is a battle log.`);
	}

	parseChatLine(line: string, day: string) {
		const [timestamp, type, ...rest] = line.split('|');
		if (type === 'c:') {
			const [time, username, ...message] = rest;
			return {time: new Date(time), username, message: message.join('|')};
		}
		return {time: new Date(timestamp + day), username: rest[0], message: rest.join('|')};
	}

	renderLine(fullLine: string, opts?: string) {
		if (!fullLine) return ``;
		if (opts === 'txt') return Utils.html`<div class="chat">${fullLine}</div>`;
		let timestamp = fullLine.slice(0, opts ? 8 : 5);
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

		const cmd = line.slice(0, line.indexOf('|'));
		if (opts?.includes('onlychat')) {
			if (cmd !== 'c') return '';
			if (opts.includes('txt')) return `<div class="chat">${Utils.escapeHTML(fullLine)}</div>`;
		}
		switch (cmd) {
		case 'c': {
			const [, name, message] = Utils.splitFirst(line, '|', 2);
			if (name.length <= 1) {
				return `<div class="chat"><small>[${timestamp}] </small><q>${Chat.formatText(message)}</q></div>`;
			}
			if (message.startsWith(`/log `)) {
				return `<div class="chat"><small>[${timestamp}] </small><q>${Chat.formatText(message.slice(5))}</q></div>`;
			}
			if (message.startsWith(`/raw `)) {
				return `<div class="notice">${message.slice(5)}</div>`;
			}
			if (message.startsWith(`/uhtml `) || message.startsWith(`/uhtmlchange `)) {
				if (message.startsWith(`/uhtmlchange `)) return ``;
				if (opts !== 'all') return `<div class="notice">[uhtml box hidden]</div>`;
				return `<div class="notice">${message.slice(message.indexOf(',') + 1)}</div>`;
			}
			const group = !name.startsWith(' ') ? name.charAt(0) : ``;
			return `<div class="chat">` +
				Utils.html`<small>[${timestamp}] ${group}</small><username>${name.slice(1)}:</username> ` +
				`<q>${Chat.formatText(message)}</q>` +
				`</div>`;
		}
		case 'html': case 'raw': {
			const [, html] = Utils.splitFirst(line, '|', 1);
			return `<div class="notice">${html}</div>`;
		}
		case 'uhtml': case 'uhtmlchange': {
			if (cmd !== 'uhtml') return ``;
			const [, , html] = Utils.splitFirst(line, '|', 2);
			return `<div class="notice">${html}</div>`;
		}
		case '!NT':
			return `<div class="chat">${Utils.escapeHTML(fullLine)}</div>`;
		case '':
			return `<div class="chat"><small>[${timestamp}] </small>${Utils.escapeHTML(line.slice(1))}</div>`;
		default:
			return `<div class="chat"><small>[${timestamp}] </small><code>${'|' + Utils.escapeHTML(line)}</code></div>`;
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

		const categories: {[k: string]: string} = {
			'official': "Official",
			'normal': "Public",
			'hidden': "Hidden",
			'secret': "Secret",
			'deleted': "Deleted",
			'personal': "Personal",
			'deletedPersonal': "Deleted Personal",
		};
		const list = await LogReader.listCategorized(user, opts) as {[k: string]: RoomID[]};

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
	checkPermissions(roomid: RoomID, context: Chat.PageContext | Chat.CommandContext) {
		const room = Rooms.get(roomid);
		const user = context.user;
		if (!user.trusted) {
			if (room) {
				context.checkCan('declare', null, room);
			} else {
				throw new Chat.ErrorMessage(`Access denied.`);
			}
		}

		if (!user.can('rangeban')) {
			// Some chatlogs can only be viewed by upper staff
			if (roomid.startsWith('spl') && roomid !== 'splatoon') {
				throw new Chat.ErrorMessage("SPL team discussions are super secret.");
			}
			if (roomid.startsWith('wcop')) {
				throw new Chat.ErrorMessage("WCOP team discussions are super secret.");
			}
			if (UPPER_STAFF_ROOMS.includes(roomid) && !user.inRooms.has(roomid)) {
				throw new Chat.ErrorMessage("Upper staff rooms are super secret.");
			}
		}
		if (room) {
			if (!user.can('lock') || room.settings.isPrivate === 'hidden' && !room.checkModjoin(user)) {
				if (!room.persist) throw new Chat.ErrorMessage(`Access denied.`);
				context.checkCan('mute', null, room);
			}
		} else {
			context.checkCan('lock');
		}
		return room;
	}
};

export const LogSearcher = new class Searcher {
	roomstatsCache = new Map<string, RoomStats>();
	constructUserRegex(user: string) {
		const id = toID(user);
		return `.${[...id].join('[^a-zA-Z0-9]*')}[^a-zA-Z0-9]*`;
	}
	renderLinecountResults(
		results: {[date: string]: {[userid: string]: number}} | null,
		roomid: RoomID, month: string, user?: ID
	) {
		let buf = Utils.html`<div class="pad"><h2>Linecounts on `;
		buf += `${roomid}${user ? ` for the user ${user}` : ` (top ${MAX_TOPUSERS})`}</h2>`;
		buf += `<strong>Total lines: {total}</strong><br />`;
		buf += `<strong>Month: ${month}:</strong><br />`;
		const nextMonth = LogReader.nextMonth(month);
		const prevMonth = LogReader.prevMonth(month);
		if (FS(`logs/chat/${roomid}/${prevMonth}`).existsSync()) {
			buf += `<small><a roomid="view-roomstats-${roomid}--${prevMonth}${user ? `--${user}` : ''}">Previous month</a></small>`;
		}
		if (FS(`logs/chat/${roomid}/${nextMonth}`).existsSync()) {
			buf += ` <small><a roomid="view-roomstats-${roomid}--${nextMonth}${user ? `--${user}` : ''}">Next month</a></small>`;
		}
		if (!results) {
			buf += '<hr />';
			buf += LogViewer.error(`Logs for month '${month}' do not exist on room ${roomid}.`);
			return buf;
		} else if (user) {
			let total = 0;
			for (const day in results) {
				if (isNaN(results[day][user])) continue;
				total += results[day][user];
			}
			buf += `<br />Total linecount: ${total}<hr />`;
			buf += '<ol>';
			const sortedDays = Utils.sortBy(Object.keys(results), day => ({reverse: day}));
			for (const day of sortedDays) {
				const dayResults = results[day][user];
				if (isNaN(dayResults)) continue;
				buf += `<li>[<a roomid="view-chatlog-${roomid}--${day}">${day}</a>]: `;
				buf += `${Chat.count(dayResults, 'lines')}</li>`;
			}
		} else {
			buf += '<hr /><ol>';
			// squish the results together
			const totalResults: {[k: string]: number} = {};
			for (const date in results) {
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
	async runSearch(
		context: Chat.PageContext, search: string, roomid: RoomID, date: string | null, limit: number | null
	) {
		context.title = `[Search] [${roomid}] ${search}`;
		if (!['ripgrep', 'fs'].includes(Config.chatlogreader)) {
			throw new Error(`Config.chatlogreader must be 'fs' or 'ripgrep'.`);
		}
		context.setHTML(
			`<div class="pad"><h2>Running a chatlog search for "${search}" on room ${roomid}` +
			(date ? date !== 'all' ? `, on the date "${date}"` : ', on all dates' : '') +
			`.</h2></div>`
		);
		const response = await PM.query({search, roomid, date, limit, queryType: 'search'});
		return context.setHTML(response);
	}
	async runLinecountSearch(context: Chat.PageContext, roomid: RoomID, month: string, user?: ID) {
		context.setHTML(
			`<div class="pad"><h2>Searching linecounts on room ${roomid}${user ? ` for the user ${user}` : ''}.</h2></div>`
		);
		const results = await PM.query({roomid, date: month, search: user, queryType: 'linecount'});
		context.setHTML(results);
	}
	async sharedBattles(userids: string[]) {
		let buf = `Logged shared battles between the users ${userids.join(', ')}`;
		const results: string[] = await PM.query({
			queryType: 'sharedsearch', search: userids,
		});
		if (!results.length) {
			buf += `:<br />None found.`;
			return buf;
		}
		buf += ` (${results.length}):<br />`;
		buf += results.map(id => `<a href="view-battlelog-${id}">${id}</a>`).join(', ');
		return buf;
	}
	// this would normally be abstract, but it's very difficult with ripgrep
	// so it's easier to just do it the same way for both.
	async roomStats(room: RoomID, month: string) {
		if (!FS(`logs/chat/${room}`).existsSync()) {
			return LogViewer.error(Utils.html`Room ${room} not found.`);
		}
		if (!FS(`logs/chat/${room}/${month}`).existsSync()) {
			return LogViewer.error(Utils.html`Room ${room} does not have logs for the month ${month}.`);
		}
		const stats = await PM.query({
			queryType: 'roomstats', search: month, roomid: room,
		});
		let buf = `<div class="pad"><h2>Room stats for ${room} [${month}]</h2><hr />`;
		buf += `<strong>Total days with logs: ${stats.average.days}</strong><br />`;
		const next = LogReader.nextMonth(month);
		const prev = LogReader.prevMonth(month);
		const prevExists = FS(`logs/chat/${room}/${prev}`).existsSync();
		const nextExists = FS(`logs/chat/${room}/${next}`).existsSync();
		if (prevExists) {
			buf += `<br /><a roomid="view-roominfo-${room}--${prev}">Previous month</a>`;
			buf += nextExists ? ` | ` : `<br />`;
		}
		if (nextExists) {
			buf += `${prevExists ? `` : `<br />`}<a roomid="view-roominfo-${room}--${next}">Next month</a><br />`;
		}
		buf += this.visualizeStats(stats.average);
		buf += `<hr />`;
		buf += `<details class="readmore"><summary><strong>Stats by day</strong></summary>`;
		for (const day of stats.days) {
			buf += `<div class="infobox"><strong><a roomid="view-chatlog-${room}--${day.day}">${day.day}</a></strong><br />`;
			buf += this.visualizeStats(day);
			buf += `</div>`;
		}
		buf += '</details>';
		return LogViewer.linkify(buf);
	}
	visualizeStats(stats: RoomStats) {
		const titles: {[k: string]: string} = {
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
				buf += Chat.toDurationString(stats.deadTime, {precision: 2});
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
	async activityStats(room: RoomID, month: string) {
		const days = (await FS(`logs/chat/${room}/${month}`).readdir()).map(f => f.slice(0, -4));
		const stats: RoomStats[] = [];
		for (const day of days) {
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

		return {average: collected, days: stats};
	}
	async dayStats(room: RoomID, day: string) {
		const cached = this.roomstatsCache.get(day);
		if (cached) return cached;
		const results: RoomStats & {day: string} = {
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
		const path = FS(`logs/chat/${room}/${LogReader.getMonth(day)}/${day}.txt`);
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
				const {time, username} = LogViewer.parseChatLine(line, day);
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
		results.averagePresent = results.averagePresent / userstatCount;

		// we don't cache the current day's stats because that could be inaccurate, whereas old days will always be the same
		if (day !== LogReader.today()) {
			this.roomstatsCache.set(day, results);
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
	async searchLinecounts(room: RoomID, month: string, user?: ID) {
		// don't need to check if logs exist since ripgrepSearchMonth does that
		const regexString = (
			user ? `\\|c\\|${this.constructUserRegex(user)}\\|` : `\\|c\\|([^|]+)\\|`
		) + `(?!\\/uhtml(change)?)`;
		const args: string[] = user ? ['--count'] : [];
		args.push(`--pcre2`);
		const results: {[k: string]: {[userid: string]: number}} = {};

		await searchMonth({
			room,
			search: regexString,
			date: month,
			args,
			handler: fullLine => {
				const [data, line] = fullLine.split('.txt:');
				const date = data.split('/').pop()!;
				if (!results[date]) results[date] = {};
				if (!toID(date)) return;
				if (user) {
					if (!results[date][user]) results[date][user] = 0;
					const parsed = parseInt(line);
					results[date][user] += isNaN(parsed) ? 0 : parsed;
				} else {
					const parts = line?.split('|').map(toID);
					if (!parts || parts[1] !== 'c') return;
					const id = parts[2];
					if (!id) return;
					if (!results[date][id]) results[date][id] = 0;
					results[date][id]++;
				}
			},
		});
		return this.renderLinecountResults(results, room, month, user);
	}
	async getSharedBattles(userids: string[]) {
		const regexString = userids.map(id => `(?=.*?("p(1|2)":"${[...id].join('[^a-zA-Z0-9]*')}[^a-zA-Z0-9]*"))`).join('');
		const results: string[] = [];
		try {
			const {stdout} = await ProcessManager.exec(['rg', '-e', regexString, '-i', '-tjson', 'logs/', '-P']);
			for (const line of stdout.split('\n')) {
				const [name] = line.split(':');
				const battleName = name.split('/').pop()!;
				results.push(battleName.slice(0, -9));
			}
		} catch (e: any) {
			if (e.code !== 1) throw e;
		}
		return results.filter(Boolean);
	}
};

export const PM = new ProcessManager.QueryProcessManager<AnyObject, any>(module, async data => {
	const start = Date.now();
	try {
		let result: any;
		const {date, search, roomid, queryType} = data;
		switch (queryType) {
		case 'linecount':
			result = await LogSearcher.searchLinecounts(roomid, date, search);
			break;
		case 'sharedsearch':
			result = await LogSearcher.getSharedBattles(search);
			break;
		case 'battlesearch':
			result = await LogReader.findBattleLog(roomid, search);
			break;
		case 'roomstats':
			result = await LogSearcher.activityStats(roomid, search);
			break;
		default:
			return LogViewer.error(`Config.chatlogreader is not configured.`);
		}
		const elapsedTime = Date.now() - start;
		if (elapsedTime > 3000) {
			Monitor.slow(`[Slow chatlog query]: ${elapsedTime}ms: ${JSON.stringify(data)}`);
		}
		return result;
	} catch (e: any) {
		if (e.name?.endsWith('ErrorMessage')) {
			return LogViewer.error(e.message);
		}
		Monitor.crashlog(e, 'A chatlog search query', data);
		return LogViewer.error(`Sorry! Your chatlog search crashed. We've been notified and will fix this.`);
	}
}, CHATLOG_PM_TIMEOUT, message => {
	if (message.startsWith(`SLOW\n`)) {
		Monitor.slow(message.slice(5));
	}
});

if (!PM.isParentProcess) {
	// This is a child process!
	global.Config = Config;
	global.Monitor = {
		crashlog(error: Error, source = 'A chatlog search process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
		slow(text: string) {
			process.send!(`CALLBACK\nSLOW\n${text}`);
		},
	};
	global.Dex = Dex;
	global.toID = Dex.toID;
	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			Monitor.crashlog(err, 'A chatlog search child process');
		}
	});
	// eslint-disable-next-line no-eval
	Repl.start('chatlog', cmd => eval(cmd));
} else {
	PM.spawn(MAX_PROCESSES);
}

const accessLog = FS(`logs/chatlog-access.txt`).createAppendStream();

export const pages: Chat.PageTable = {
	async chatlog(args, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		let [roomid, date, opts] = Utils.splitFirst(args.join('-'), '--', 2) as
			[RoomID, string | undefined, string | undefined];
		if (date) date = date.trim();
		if (!roomid || roomid.startsWith('-')) {
			this.title = '[Logs]';
			return LogViewer.list(user, roomid?.slice(1));
		}

		// permission check
		LogViewer.checkPermissions(roomid, this);

		void accessLog.writeLine(`${user.id}: <${roomid}> ${date}`);
		this.title = '[Logs] ' + roomid;

		const parsedDate = new Date(date as string);
		if (date && isNaN(parsedDate.getTime())) {
			return this.errorReply(`Invalid date.`);
		}

		if (date) {
			if (date === 'today') {
				return LogViewer.day(roomid, LogReader.today(), opts);
			} else if (date.split('-').length === 3) {
				return LogViewer.day(roomid, parsedDate.toISOString().slice(0, 10), opts);
			} else {
				return LogViewer.month(roomid, parsedDate.toISOString().slice(0, 7));
			}
		} else {
			return LogViewer.room(roomid);
		}
	},
	roomstats(args, user) {
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
	battlelog(args, user) {
		const [tierName, battleNum] = args;
		const tier = toID(tierName);
		const num = parseInt(battleNum);
		if (isNaN(num)) return this.errorReply(`Invalid battle number.`);
		void accessLog.writeLine(`${user.id}: battle-${tier}-${num}`);
		return LogViewer.battle(tier, num, this);
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
		const accessStream = FS(`logs/chatlog-access.txt`).createReadStream();
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
	chatlog(target, room, user) {
		const [tarRoom, ...opts] = target.split(',');
		const targetRoom = tarRoom ? Rooms.search(tarRoom) : room;
		const roomid = targetRoom ? targetRoom.roomid : target;
		return this.parse(`/join view-chatlog-${roomid}--today${opts ? `--${opts.join('--')}` : ''}`);
	},

	chatloghelp() {
		const strings = [
			`/chatlog [optional room], [opts] - View chatlogs from the given room. `,
			`If none is specified, shows logs from the room you're in. Requires: % @ * # &`,
			`Supported options:`,
			`<code>txt</code> - Do not render logs.`,
			`<code>txt-onlychat</code> - Show only chat lines, untransformed.`,
			`<code>onlychat</code> - Show only chat lines.`,
			`<code>all</code> - Show all lines, including userstats and join/leave messages.`,
		];
		this.runBroadcast();
		return this.sendReplyBox(strings.join('<br />'));
	},

	topusers: 'linecount',
	roomstats: 'linecount',
	linecount(target, room, user) {
		const params = target.split(',').map(f => f.trim());
		const search: Partial<{roomid: RoomID, date: string, user: string}> = {};
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
			`- <code>room</code> (aliases: <code>roomid</code>) - Select a room to search. If no room is given, defaults to current room.</br />` +
			`- <code>date</code> (aliases: <code>month</code>, <code>time</code>) - ` +
			`Select a month to search linecounts on (requires YYYY-MM format). Defaults to current month.<br />` +
			`- <code>user</code> (aliases: <code>id</code>, <code>userid</code>) - ` +
			`Searches for linecounts only from a given user. ` +
			`If this is not provided, /linecount instead shows line counts for all users from that month.</details>` +
			`Parameters may also be specified without a [key]. When using this, arguments are provided in the format ` +
			`<code>/linecount [room], [month], [user].</code>. This does not use any defaults.<br />`
		);
	},
	slb: 'sharedloggedbattles',
	async sharedloggedbattles(target, room, user) {
		this.checkCan('lock');
		if (Config.nobattlesearch) return this.errorReply(`/${this.cmd} has been temporarily disabled due to load issues.`);
		const targets = target.split(',').map(toID).filter(Boolean);
		if (targets.length < 2 || targets.length > 2) {
			return this.errorReply(`Specify two users.`);
		}
		const results = await LogSearcher.sharedBattles(targets);
		if (room?.settings.staffRoom || this.pmTarget?.isStaff) {
			this.runBroadcast();
		}
		return this.sendReplyBox(results);
	},
	sharedloggedbattleshelp: [
		`/sharedloggedbattles OR /slb [user1, user2] - View shared battle logs between user1 and user2`,
	],
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
		`Requires: % @ &`,
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
		const roomid = roomName.toLowerCase().replace(/[^a-z0-9-]+/g, '') as RoomID;
		if (!roomid) return this.parse('/help getbattlechat');
		const userid = toID(userName);
		if (userName && !userid) return this.errorReply(`Invalid username.`);
		if (!roomid.startsWith('battle-')) return this.errorReply(`You must specify a battle.`);
		const tarRoom = Rooms.get(roomid);

		let log: string[];
		if (tarRoom) {
			log = tarRoom.log.log;
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
		`Requires: % @ &`,
	],

	logsaccess(target, room, user) {
		this.checkCan('rangeban');
		const [type, userid] = target.split(',').map(toID);
		return this.parse(`/j view-logsaccess-${type || 'all'}${userid ? `-${userid}` : ''}`);
	},
	logsaccesshelp: [
		`/logsaccess [type], [user] - View chatlog access logs for the given [type] and [user].`,
		`If no arguments are given, shows the entire access log.`,
		`Requires: &`,
	],


	gcsearch: 'groupchatsearch',
	async groupchatsearch(target, room, user) {
		this.checkCan('lock');
		target = target.toLowerCase().replace(/[^a-z0-9-]+/g, '');
		if (!target) return this.parse(`/help groupchatsearch`);
		if (target.length < 3) {
			return this.errorReply(`Too short of a search term.`);
		}
		const files = await FS(`logs/chat`).readdir();
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
		`/groupchatsearch [target] - Searches for logs of groupchats with names containing the [target]. Requires: % @ &`,
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
		`/roomactibity [room][, date] - View room activity logs for the given room.`,
		`If a date is provided, it searches for logs from that date. Otherwise, it searches the current month.`,
		`Requires: &`,
	],
};
