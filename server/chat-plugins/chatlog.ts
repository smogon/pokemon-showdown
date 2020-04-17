/**
 * Pokemon Showdown log viewer
 *
 * by Zarel
 * @license MIT
 */

import {FS} from "../../lib/fs";
import * as child_process from 'child_process';
import * as path from 'path';
import * as util from 'util';


const execFile = util.promisify(child_process.execFile);
const DAY = 24 * 60 * 60 * 1000;

class LogReaderRoom {
	roomid: RoomID;
	constructor(roomid: RoomID) {
		this.roomid = roomid;
	}

	async listMonths() {
		try {
			const listing = await FS(`logs/chat/${this.roomid}`).readdir();
			return listing.filter(file => /^[0-9][0-9][0-9][0-9]-[0-9][0-9]$/.test(file));
		} catch (err) {
			return [];
		}
	}

	async listDays(month: string) {
		try {
			const listing = await FS(`logs/chat/${this.roomid}/${month}`).readdir();
			return listing.filter(file => /\.txt$/.test(file)).map(file => file.slice(0, -4));
		} catch (err) {
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

const LogReader = new class {
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
				(room.auth && user.id in room.auth && user.can('mute', null, room)) ||
				// you are staff and currently in the room
				(isStaff && user.inRooms.has(room.roomid))
			);
			if (!isUpperStaff && !forceShow) {
				if (!isStaff) continue;
				if (!room) continue;
				if (!room.checkModjoin(user)) continue;
				if (room.isPrivate === true) continue;
			}

			atLeastOne = true;
			if (roomid.includes('-')) {
				const matchesOpts = opts && roomid.startsWith(`${opts}-`);
				if (matchesOpts || opts === 'all' || forceShow) {
					(room ? personal : deletedPersonal).push(roomid);
				}
			} else if (!room) {
				if (opts === 'all' || opts === 'deleted') deleted.push(roomid);
			} else if (room.isOfficial) {
				official.push(roomid);
			} else if (!room.isPrivate) {
				normal.push(roomid);
			} else if (room.isPrivate === 'hidden') {
				hidden.push(roomid);
			} else {
				secret.push(roomid);
			}
		}

		if (!atLeastOne) return null;
		return {official, normal, hidden, secret, deleted, personal, deletedPersonal};
	}

	async read(roomid: RoomID, day: string) {
		const month = day.slice(0, -3);
		const log = FS(`logs/chat/${roomid}/${month}/${day}.txt`);
		if (!await log.exists()) return null;
		const text = await log.read();
		return text;
	}

	getMonth(day: string) {
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
};

const LogViewer = new class {
	async day(roomid: RoomID, day: string, opts?: string) {
		const month = LogReader.getMonth(day);
		let buf = `<div class="pad"><p>` +
			`<a roomid="view-chatlog">◂ All logs</a> / ` +
			`<a roomid="view-chatlog-${roomid}">${roomid}</a> /  ` +
			`<a roomid="view-chatlog-${roomid}--${month}">${month}</a> / ` +
			`<strong>${day}</strong></p><hr />`;

		const roomLog = await LogReader.get(roomid);
		if (!roomLog) {
			buf += `<p class="message-error">Room "${roomid}" doesn't exist</p></div>`;
			return this.linkify(buf);
		}

		const prevDay = LogReader.prevDay(day);
		buf += `<p><a roomid="view-chatlog-${roomid}--${prevDay}" class="blocklink" style="text-align:center">▲<br />${prevDay}</a></p>` +
			`<div class="message-log" style="overflow-wrap: break-word">`;

		const stream = await roomLog.getLog(day);
		if (!stream) {
			buf += `<p class="message-error">Room "${roomid}" doesn't have logs for ${day}</p>`;
		} else {
			let line;
			while ((line = await stream.readLine()) !== null) {
				buf += this.renderLine(line, opts);
			}
		}

		buf += `</div>`;
		if (day !== LogReader.today()) {
			const nextDay = LogReader.nextDay(day);
			buf += `<p><a roomid="view-chatlog-${roomid}--${nextDay}" class="blocklink" style="text-align:center">${nextDay}<br />▼</a></p>`;
		}

		buf += `</div>`;
		return this.linkify(buf);
	}


	async searchDay(roomid: RoomID, day: string, search: string, cap?: number, prevResults?: string[]) {
		const text = await LogReader.read(roomid, day);
		if (!text) return [];
		const lines = text.split('\n');
		const matches: string[] = [];
		const all: string[] = [];
		const searches = search.split('-');

		if (prevResults) {
			// add previous results to all, to track all matches relative to the cap
			for (const p of prevResults) all.push(p);
		}

		const searchInputs = (phrase: string, terms: string[]) => (
			terms.every((word) => {
				return new RegExp(word, "i").test(phrase);
			})
		);

		for (const line of lines) {
			if (searchInputs(line, searches)) {
				const lineNum: number = lines.indexOf(line);
				const context = (up = true, num: number) => {
					if (up) {
						return this.renderLine(`${lines[lineNum + num]}`);
					} else {
						return this.renderLine(`${lines[lineNum - num]}`);
					}
				};
				const full = (
					`${context(false, 1)} ${context(false, 2)}` +
					`<div class="chat chatmessage highlighted">${this.renderLine(line)}</div>` +
					`${context(true, 1)} ${context(true, 2)}`
				);
				// there's a cap and the total has been met
				if (cap && all.push(full) > cap) break;
				// there's a cap and it is met with this push
				if (matches.push(full) === cap) break;
			}
		}
		return matches;
	}

	async searchMonth(roomid: RoomID, month: string, search: string, cap?: number | string, year = false) {
		const log = await LogReader.get(roomid);
		if (!log) return LogViewer.error(`No logs on ${roomid}.`);
		const days = await log.listDays(month);
		const results = [];
		const searches = search.split('-').length;

		if (typeof cap === 'string') cap = parseInt(cap);

		let buf = (
			`<br><div class="pad"><strong>Results for search (es) ` +
			`"${searches > 1 ? search.split('-').join(' ') : search}"` +
			` on ${roomid}: (${month}):</strong><hr>`
		);
		for (const day of days) {
			const matches: string[] = await this.searchDay(roomid, day, search, cap, results);
			for (const match of matches) results.push(match);
			buf += `<details><summary>Matches on ${day}: (${matches.length})</summary><br><hr>`;
			buf += `<p>${matches.join('<hr>')}</p>`;
			buf += `</details><hr>`;
			if (cap && results.length >= cap && !year) {
				// cap is met & is not being used in a year read
				buf += `<br/ ><strong>Max results reached, capped at ${cap}</strong>`;
				buf += `<br /><div style="text-align:center">`;
				buf += `<button class="button" name="send" value="/sl ${search}|${roomid}|${month}|${cap + 100}">View 100 more<br />&#x25bc;</button>`;
				buf += `<button class="button" name="send" value="/sl ${search}|${roomid}|${month}|all">View all<br />&#x25bc;</button></div>`;
				break;
			}
		}
		buf += `</div>`;
		return buf;
	}

	async searchYear(roomid: RoomID, year: string, search: string, alltime = false, cap?: string | number) {
		const log = await LogReader.get(roomid);
		if (!log) return LogViewer.error(`No matches found for ${search} on ${roomid}.`);
		let buf = '';
		if (!alltime) {
			buf += `<strong><br>Searching year: ${year}: </strong><hr>`;
		}	else {
			buf += `<strong><br>Searching all logs: </strong><hr>`;
		}
		if (typeof cap === 'string') cap = parseInt(cap);
		const months = await log.listMonths();
		for (const month of months) {
			if (buf.includes('capped')) {
				// cap has been met in a previous loop, add the buttons and break.
				buf += `<br /><div style="text-align:center">`;
				buf += `<button class="button" name="send" value="/sl ${search}|${roomid}|${year}|${cap! + 100}">View 100 more<br />&#x25bc;</button>`;
				buf += `<button class="button" name="send" value="/sl ${search}|${roomid}|${year}|all">View all<br />&#x25bc;</button></div>`;
				break;
			}
			if (!month.includes(year) && !alltime) continue;
			if (!FS(`logs/chat/${roomid}/${month}/`).isDirectorySync()) continue;
			buf += await this.searchMonth(roomid, month, search, cap, true);
			buf += '<br>';
		}
		return buf;
	}

	renderLine(fullLine: string, opts?: string) {
		if (!fullLine) return ``;
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
		switch (cmd) {
		case 'c': {
			const [, name, message] = Chat.splitFirst(line, '|', 2);
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
				return `<div class="notice">${message.slice(message.indexOf(',') + 1)}</div>`;
			}
			const group = name.charAt(0) !== ' ' ? `<small>${name.charAt(0)}</small>` : ``;
			return `<div class="chat"><small>[${timestamp}] </small><strong>${group}${name.slice(1)}:</strong> <q>${Chat.formatText(message)}</q></div>`;
		}
		case 'html': case 'raw': {
			const [, html] = Chat.splitFirst(line, '|', 1);
			return `<div class="notice">${html}</div>`;
		}
		case 'uhtml': case 'uhtmlchange': {
			const [, , html] = Chat.splitFirst(line, '|', 2);
			return `<div class="notice">${html}</div>`;
		}
		case '!NT':
			return `<div class="chat">${Chat.escapeHTML(fullLine)}</div>`;
		case '':
			return `<div class="chat"><small>[${timestamp}] </small>${Chat.escapeHTML(line.slice(1))}</div>`;
		default:
			return `<div class="chat"><small>[${timestamp}] </small><code>${'|' + Chat.escapeHTML(line)}</code></div>`;
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
				buf += `<p>- <a roomid="view-chatlog-${roomid}--${day}">${day}</a></p>`;
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
			buf += `<p class="message-error">You must be a staff member of a room, to view logs</p></div>`;
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

const LogSearcher = new class {
	fsSearch(roomid: RoomID, search: string, date: string, cap?: number | string) {
		const isAll = (date === 'all');
		const isYear = (date.length < 0 && date.length > 7);
		const isMonth = (date.length === 7);

		if (isAll) {
			return LogViewer.searchYear(roomid, date, search, true, cap);
		} else if (isYear) {
			date = date.substr(0, 4);
			return LogViewer.searchYear(roomid, date, search, false, cap);
		} else if (isMonth) {
			date = date.substr(0, 7);
			return LogViewer.searchMonth(roomid, date, search, cap);
		} else {
			return LogViewer.error("Invalid date.");
		}
	}

	render(results: string[], roomid: RoomID, search: string, cap?: number) {
		const matches = [];
		for (const chunk of results) {
			const rebuilt: string[] = [];
			const exacts = [];
			exacts.push(chunk.split('\n').filter((item: string) => new RegExp(search, "i").test(item)).map(item => {
				item = item.split(item.includes('.txt-') ? '.txt-' : '.txt:')[1];
				item = LogViewer.renderLine(item);
				return item;
			})[0]); // get exact match for display

			for (const line of chunk.split('\n')) {
				if (!toID(line)) continue;
				const sep = line.includes('.txt-') ? '.txt-' : '.txt:';
				const [dir, text] = line.split(sep);
				if (dir.includes('today')) continue; // get rid of duplicates
				const rendered = LogViewer.renderLine(text, 'all');
				if (!rendered) continue; // gets rid of some weird blank lines
				const matched = (
					new RegExp(search, "i")
						.test(rendered) ? `<div class="chat chatmessage highlighted">${rendered}</div>` : rendered
				);
				const date = dir.replace(`${__dirname}/../../logs/chat/${roomid}`, '').slice(9);
				if (!rebuilt.join(' ').includes(date)) {
					const link = `<a href ="view-chatlog-${roomid}--${date}">${date}</a>`;
					rebuilt.push(`<details><summary>Match on ${link}: ${exacts[exacts.length - 1]}</summary><br>`);
				}
				rebuilt.push(`${matched}`);
			}
			const isIn = matches.join(' ').includes(rebuilt.join(' '));
			if (cap && matches.push(rebuilt.join(' ')) >= cap) {
				break;
			} else {
				// `in` resolves a duplication bug
				if (isIn) matches.push(rebuilt.join(' '));
			}
		}
		let buf = `<div class="pad"><p><strong>Results on ${roomid} for ${search}:</strong>`;
		const total = matches.join('</details><hr/ >').split('<div class="chat chatmessage highlighted">').length;
		buf += ` ${total}`;
		if (cap) {
			buf += ` (capped at ${cap})<hr/ >`;
		} else {
			buf += `<hr/ >`;
		}
		buf += matches.join('</details><hr/ >');
		if (cap) {
			buf += `<hr/ ><strong>Capped at ${cap}.</strong><br>`;
			buf += `<button class="button" name="send" value="/sl ${search}, ${roomid},,${cap + 200}">View 200 more<br />&#x25bc;</button>`;
			buf += `<button class="button" name="send" value="/sl ${search},${roomid},,all">View all<br />&#x25bc;</button></div>`;
		}

		return buf;
	}

	async ripgrepSearch(roomid: RoomID, search: string, cap: number) {
		let output;
		try {
			const options = [
				search,
				`${__dirname}/../../logs/chat/${roomid}`,
				'-C', '2',
			];
			output = await execFile('rg', options, {cwd: path.normalize(`${__dirname}/../../`)});
		} catch (error) {
			return LogViewer.error(
				`There was an error in ripgrep search:<br>${error}<br>Please report this as a bug.`
			);
		}
		const matches = [];
		for (const result of output.stdout.split('--').reverse()) {
			matches.push(result);
		}
		return this.render(matches, roomid, search, cap);
	}

	async grepSearch(roomid: RoomID, search: string, cap?: number): Promise<string> {
		return new Promise((resolve, reject) => {
			child_process.exec(`grep -r '${search}' ${__dirname}/../../logs/chat/${roomid} --exclude=today.txt -C 2`, {
				cwd: __dirname,
			}, (error, stdout, stderr) => {
				const results = stdout.split('--\n--').reverse();
				const html = this.render(results, roomid, search, cap);
				resolve(html);
			});
		});
	}
};

const accessLog = FS(`logs/chatlog-access.txt`).createAppendStream();

export const pages: PageTable = {
	async chatlog(args, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		if (!user.trusted) {
			return LogViewer.error("Access denied");
		}

		const [roomid, date, opts, cap] = args
			.join('-')
			.split('--') as [RoomID, string | undefined, string | undefined, number];

		if (!roomid || roomid.startsWith('-')) {
			this.title = '[Logs]';
			return LogViewer.list(user, roomid?.slice(1));
		}

		// permission check
		const room = Rooms.get(roomid);
		if (roomid.startsWith('spl') && roomid !== 'splatoon' && !user.can('rangeban')) {
			return LogViewer.error("SPL team discussions are super secret.");
		}
		if (roomid.startsWith('wcop') &&	!user.can('rangeban')) {
			return LogViewer.error("WCOP team discussions are super secret.");
		}
		if (room) {
			if (!room.checkModjoin(user) && !user.can('bypassall')) {
				return LogViewer.error("Access denied");
			}
			if (!user.can('lock') && !this.can('mute', null, room)) return;
		} else {
			if (!this.can('lock')) return;
		}

		void accessLog.writeLine(`${user.id}: <${roomid}> ${date}`);
		this.title = '[Logs] ' + roomid;

		const hasSearch = opts?.includes('search-') || opts?.includes('csearch-');
		const context = opts?.includes('csearch-');
		const search = opts?.slice(7);
		const isAll = (toID(date) === 'all' || toID(date) === 'alltime');

		const parsedDate = new Date(date as string);
		// this is apparently the best way to tell if a date is invalid
		if (isNaN(parsedDate.getTime()) && !isAll && date !== 'today') {
			return LogViewer.error(`Invalid date.`);
		}

		if (date && !hasSearch) {
			if (date === 'today') {
				return LogViewer.day(roomid, LogReader.today(), opts);
			} else if (date.split('-').length === 3) {
				return LogViewer.day(roomid, parsedDate.toISOString().slice(0, 10), opts);
			} else {
				return LogViewer.month(roomid, parsedDate.toISOString().slice(0, 7));
			}
		} else if (date && hasSearch && search) {
			if (context) {
				return LogSearcher.fsSearch(roomid, search, date, toID(cap));
			} else {
				if (Config.ripgrepmodlog) {
					return LogSearcher.ripgrepSearch(roomid, search, cap);
				}
				return LogSearcher.grepSearch(roomid, search, cap);
			}
		} else {
			return LogViewer.room(roomid);
		}
	},
};

export const commands: ChatCommands = {
	chatlog(target, room, user) {
		const targetRoom = target ? Rooms.search(target) : room;
		const roomid = targetRoom ? targetRoom.roomid : target;
		this.parse(`/join view-chatlog-${roomid}--today`);
	},

	sl: 'searchlogs',
	searchlog: 'searchlogs',
	contextsearch: 'searchlogs',
	csl: 'searchlogs',
	searchlogs(target, room, user, connection, cmd) {
		target = target.trim();
		const [search, tarRoom, date, cap] = target.split(',') as [string, string, number, number];
		if (!target) return this.parse('/help searchlogs');
		if (!search) return this.errorReply('Specify a query to search the logs for.');
		if (cap && isNaN(cap) && toID(cap) !== 'all') return this.errorReply(`Cap must be a number or [all].`);
		const input = search.includes('|') ? search.split('|').map(item => item.trim()).join('-') : search;
		const currentMonth = Chat.toTimestamp(new Date()).split(' ')[0].slice(0, -3);
		const curRoom = tarRoom ? Rooms.search(tarRoom) : room;
		const limit = cap ? `--${cap}` : `--500`;
		if (cmd === 'contextsearch' || cmd === 'csl') {
			return this.parse(`/join view-chatlog-${curRoom}--${date ? date : currentMonth}--csearch-${input}${limit}`);
		} else {
			return this.parse(`/join view-chatlog-${curRoom}--${date ? date : currentMonth}--search-${input}${limit}`);
		}
	},

	searchlogshelp: [
		"/searchlogs [search] | [room] | [date] | [cap] - searches [date]'s logs in the current room for [search].",
		"A comma can be used to search for multiple words in a single line - in the format arg1, arg2, etc.",
		"If a [cap] is given, limits it to only that many lines. Defaults to 500.",
		"/csl or /contextsearch can be used to get context for lines, at a loss in performance.",
		"If no month, year, or 'all' param is given for the date, defaults to current month. Requires: % @ & ~",
	],
};
