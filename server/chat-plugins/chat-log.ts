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

	async listCategorized(user: User, includePersonal?: boolean) {
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
			const room = Rooms.get(roomid) as BasicChatRoom;
			if (!isUpperStaff) {
				if (!room) continue;
				if (!room.checkModjoin(user)) continue;
				if (!isStaff && !user.can('mute', null, room)) continue;
			}

			atLeastOne = true;
			if (roomid.includes('-')) {
				if (includePersonal) {
					(room ? personal : deletedPersonal).push(roomid);
				}
			} else if (!room) {
				deleted.push(roomid);
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
};

const LogViewer = new class {
	async day(roomid: RoomID, day: string, opts?: string) {
		const month = LogReader.getMonth(day);
		let buf = `<div class="pad"><p>` +
			`<a roomid="view-chatlog">← All logs</a> / ` +
			`<a roomid="view-chatlog-${roomid}">${roomid}</a> /  ` +
			`<a roomid="view-chatlog-${roomid}--${month}">${month}</a> / ` +
			`<strong>${day}</strong></p>`;

		const roomLog = await LogReader.get(roomid);
		if (!roomLog) {
			buf += `<p class="message-error">Room "${roomid}" doesn't exist</p></div>`;
			return this.linkify(buf);
		}

		buf += `<p><a roomid="view-chatlog-${roomid}--${LogReader.prevDay(day)}">⬆️ Earlier</a></p><div>`;

		const stream = await roomLog.getLog(day);
		if (!stream) {
			buf += `<p class="message-error">Room "${roomid}" doesn't have logs for ${day}</p>`;
		} else {
			let line;
			while ((line = await stream.readLine()) !== null) {
				buf += this.renderLine(line, opts);
			}
		}

		buf += `</div><p><a roomid="view-chatlog-${roomid}--${LogReader.nextDay(day)}">⬇️ Later</a></p>`;

		buf += `</div>`;
		return this.linkify(buf);
	}
	renderLine(fullLine: string, opts?: string) {
		const timestamp = fullLine.slice(0, opts ? 8 : 5);
		const line = fullLine.charAt(9) === '|' ? fullLine.slice(10) : '|' + fullLine.slice(9);
		if (opts !== 'all' && (
			line.startsWith(`userstats|`) ||
			line.startsWith('J|') || line.startsWith('L|') || line.startsWith('N|')
		)) return ``;

		const cmd = line.slice(0, line.indexOf('|'));
		switch (cmd) {
		case 'c': {
			const [, name, message] = Chat.splitFirst(line, '|', 2);
			if (name.length <= 1) {
				return `<div class="chat"><small>[${timestamp}] </small><em>${Chat.formatText(message)}</em></div>`;
			}
			return `<div class="chat"><small>[${timestamp}] </small><strong><small>${name.charAt(0)}</small>${name.slice(1)}:</strong> <em>${Chat.formatText(message)}</em></div>`;
		}
		case 'html': {
			const [, html] = Chat.splitFirst(line, '|', 1);
			return `<div class="notice">${html}</div>`;
		}
		case '':
			return `<div class="chat"><small>[${timestamp}] </small>${Chat.escapeHTML(line.slice(1))}</div>`;
		default:
			return `<div class="chat"><small>[${timestamp}] </small>${'|' + Chat.escapeHTML(line)}</div>`;
		}
	}
	async month(roomid: RoomID, month: string) {
		let buf = `<div class="pad"><p>` +
			`<a roomid="view-chatlog">← All logs</a> / ` +
			`<a roomid="view-chatlog-${roomid}">${roomid}</a> / ` +
			`<strong>${month}</strong></p>`;

		const roomLog = await LogReader.get(roomid);
		if (!roomLog) {
			buf += `<p class="message-error">Room "${roomid}" doesn't exist</p></div>`;
			return this.linkify(buf);
		}

		buf += `<p><a roomid="view-chatlog-${roomid}--${LogReader.prevMonth(month)}">⬆️ Earlier</a></p>`;

		const days = await roomLog.listDays(month);
		if (!days.length) {
			buf += `<p class="message-error">Room "${roomid}" doesn't have logs in ${month}</p></div>`;
			return this.linkify(buf);
		} else {
			for (const day of days) {
				buf += `<p>- <a roomid="view-chatlog-${roomid}--${day}">${day}</a></p>`;
			}
		}

		buf += `<p><a roomid="view-chatlog-${roomid}--${LogReader.nextMonth(month)}">⬇️ Later</a></p>`;

		buf += `</div>`;
		return this.linkify(buf);
	}
	async room(roomid: RoomID) {
		let buf = `<div class="pad"><p>` +
			`<a roomid="view-chatlog">← All logs</a> / ` +
			`<strong>${roomid}</strong></p>`;

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
	async list(user: User, includePersonal?: boolean) {
		let buf = `<div class="pad"><p>` +
			`<strong>All logs</strong></p>`;

		const categories: {[k: string]: string} = {
			'official': "Official",
			'normal': "Public",
			'hidden': "Hidden",
			'secret': "Secret",
			'deleted': "Deleted",
			'personal': "Personal",
			'deletedPersonal': "Deleted Personal",
		};
		const list = await LogReader.listCategorized(user, includePersonal) as {[k: string]: RoomID[]};

		if (!list) {
			buf += `<p class="message-error">You must be a staff member of a room, to view logs</p></div>`;
			return buf;
		}

		for (const k in categories) {
			if (!includePersonal && user.can('rangeban') && k === 'personal') {
				buf += `<p>${categories[k]}</p>`;
				buf += `- <a roomid="view-chatlog--personal">(show)</a>`;
			}
			if (!list[k].length) continue;
			buf += `<p>${categories[k]}</p>`;
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

		if (!roomid || roomid === '-personal') {
			this.title = '[Logs]';
			return LogViewer.list(user, roomid === '-personal');
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
			if (!this.can('mute', null, room as BasicChatRoom)) return;
		} else {
			if (!this.can('lock')) return;
		}

		void accessLog.writeLine(`${user.id}: <${roomid}> ${date}`);

		this.title = '[Logs] ' + roomid;
		if (date && date.length === 10) {
			return LogViewer.day(roomid, date, opts);
		}
		if (date) {
			return LogViewer.month(roomid, date);
		}
		return LogViewer.room(roomid);
	},
};
