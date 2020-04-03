/**
 * Pokemon Showdown log viewer
 *
 * by Zarel
 */

import {FS} from "../../lib/fs";

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

const DAY = 24 * 60 * 60 * 1000;

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
		return new Date().toISOString().slice(0, 10);
	}
};

const LogViewer = new class {
	async day(roomid: RoomID, day: string, opts?: string) {
		if (day === 'today') day = LogReader.today();
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

	async search(roomid: RoomID, month: string, search: string) {
		if (month.length < 7) month = month.slice(0, -3);
		let query = '';
		const searches = search.split('-').length;
		if (searches > 1) {
			query = search.split('-').join('", "');
		}
		const files = await FS(`logs/chat/${roomid}/${month}`).readdir();
		let buf = `<div class="pad"<strong>Results for search ${Chat.plural(searches, 'queries', 'query')}: "${query ? query : search}" on ${roomid}: </strong><hr>`;
		for (let day of files) {
			const matches = await this.searchDay(roomid, day, search);
			day = day.slice(0, -4);
			buf += `<details><summary>Matches on ${day}: (${matches.length})</summary><br><hr>`;
			buf += `<p>${matches.join('<hr>')}</p>`;
			buf += `</details><hr>`;
		}
		buf += `</div>`;
		return buf;
	}

	async searchDay(roomid: RoomID, day: string, search: string) {
		const month = day.slice(0, -7);
		const text = await FS(`logs/chat/${roomid}/${month}/${day}`).read();
		const lines = text.split('\n');
		const matches: string[] = [];
		const searches: string[] = search.split('-');
		const searchInputs = (phrase: string, terms: string[]) => (
			terms.every((word) => {
				return new RegExp(word, "i").exec(phrase);
			})
		);
		for (const line of lines) {
			if (searchInputs(line, searches)) {
				const lineNum: number = lines.indexOf(line);
				const up = this.renderLine(`${lines[lineNum + 1]}`);
				const upTwo = this.renderLine(`${lines[lineNum + 2]}`);
				const down = this.renderLine(`${lines[lineNum - 1]}`);
				const downTwo = this.renderLine(`${lines[lineNum - 2]}`);
				matches.push(
					`${down ? down : ''} ${downTwo ? downTwo : ''}` +
					`<div class="chat chatmessage highlighted">${this.renderLine(line)}</div>` +
					`${up ? up : ''} ${upTwo ? upTwo : ''}`
				);
			}
		}
		return matches;
	}

	renderLine(fullLine: string, opts?: string) {
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

const accessLog = FS(`logs/chatlog-access.txt`).createAppendStream();

export const pages: PageTable = {
	async chatlog(args, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		if (!user.trusted) {
			return LogViewer.error("Access denied");
		}

		const [roomid, date, opts] = args.join('-').split('--') as [RoomID, string | undefined, string | undefined];

		if (!roomid || roomid.startsWith('-')) {
			this.title = '[Logs]';
			return LogViewer.list(user, roomid?.slice(1));
		}

		// permission check
		const room = Rooms.get(roomid);
		if (roomid.startsWith('spl') && roomid !== 'splatoon' && !user.can('rangeban')) {
			return LogViewer.error("SPL team discussions are super secret.");
		}
		if (roomid.startsWith('wcop') && !user.can('rangeban')) {
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
		if (date && date.length === 10 || date === 'today') {
			return LogViewer.day(roomid, date, opts);
		}
		if (date && !opts?.includes('search-')) {
			return LogViewer.month(roomid, date);
		} else if (opts?.includes('search-') && date) {
			if (date === 'today') {
				const today = Chat.toTimestamp(new Date()).split(' ')[0].slice(0, -3);
				return LogViewer.search(roomid, today, opts.slice(7));
			} else {
				return LogViewer.search(roomid, date, opts.slice(7));
			}
		} else {
			return LogViewer.room(roomid);
		}
	},
};

export const commands: ChatCommands = {
	chatlog(target, room, user) {
		return this.parse(`/join view-chatlog-${room.roomid}--today`);
	},

	searchlogs(target, room, user) {
		target = target.trim();
		const [search, date] = target.split('|');
		if (!target) return this.parse('/help searchlogs');
		if (!search) return this.errorReply('Specify a query to search the logs for.');
		if (!FS(`logs/chat/${room.roomid}/${date}`).existsSync() && date) {
			return this.errorReply(`No logs on for date "${date}" - check to be sure you didn't mistype?.`);
		}
		const currentMonth = Chat.toTimestamp(new Date()).split(' ')[0].slice(0, -3);
		const input = search.includes(',') ? search.split(',').map(item => item.trim()).join('-') : search;
		return this.parse(`/join view-chatlog-${room.roomid}--${date ? date : currentMonth}--search-${input}`);
	},

	searchlogshelp: [
		"/searchlogs [search] | [date] - searches [month]'s logs in the current room for [search].",
		"| can be used to search for multiple words in a single line - in the format 'arg, arg2, etc.",
		"If no [month] is given, defaults to current. Requires: % @ & ~",
	],
};
