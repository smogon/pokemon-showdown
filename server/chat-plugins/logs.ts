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
		const listing = await FS(`logs/chat/${this.roomid}`).readdir();
		return listing.filter(file => /^[0-9][0-9][0-9][0-9]-[0-9][0-9]$/.test(file));
	}

	async listDays(month: string) {
		const listing = await FS(`logs/chat/${this.roomid}/${month}`).readdir();
		return listing.filter(file => /\.txt$/.test(file)).map(file => file.slice(0, -4));
	}

	getLog(day: string) {
		const month = LogReader.getMonth(day);
		return FS(`logs/chat/${this.roomid}/${month}/${day}.txt`).createReadStream();
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
		return listing.filter(file => /^[a-z0-9-]+$/.test(file));
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
	async day(roomid: RoomID, day: string) {
		const roomLog = await LogReader.get(roomid);
		if (!roomLog) {
			return `<div class="pad">Room "${roomid}" doesn't exist</div>`;
		}
		const month = LogReader.getMonth(day);
		let buf = `<div class="pad"><p>` +
			`<a href="/view-log">← All logs</a> / ` +
			`<a href="/view-log-${roomid}">${roomid}</a> /  ` +
			`<a href="/view-log-${roomid}--${month}">${month}</a> / ` +
			`<strong>${day}</strong></p>`;
		const stream = roomLog.getLog(day);
		let line;
		while ((line = await stream.readLine()) !== null) {
			buf += Chat.escapeHTML(line) + `<br />`;
		}
		buf += `</div>`;
		return buf;
	}
	async month(roomid: RoomID, month: string) {
		const roomLog = await LogReader.get(roomid);
		if (!roomLog) {
			return `<div class="pad">Room "${roomid}" doesn't exist</div>`;
		}
		let buf = `<div class="pad"><p>` +
			`<a href="/view-log">← All logs</a> / ` +
			`<a href="/view-log-${roomid}">${roomid}</a> / ` +
			`<strong>${month}</strong></p>`;
		const days = await roomLog.listDays(month);
		for (const day of days) {
			buf += `<p>- <a href="/view-log-${roomid}--${day}">${day}</a></p>`;
		}
		buf += `</div>`;
		return buf;
	}
	room(roomid: RoomID) {
		let buf = `<div class="pad"><p>` +
			`<a href="/view-log">← All logs</a> / ` +
			`<strong>${roomid}</strong></p>`;
		buf += `Unimplemented.`;
		buf += `</div>`;
		return buf;
	}
	list() {
		return `<div class="pad">Unimplemented.</div>`;
	}
};

export const pages: PageTable = {
	async log(args, user, connection) {
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		// TODO: permissions
		if (!this.can('rangeban')) return;

		const [roomid, date] = args.join('-').split('--') as [RoomID, string | undefined, string | undefined];
		if (!roomid) {
			this.title = '[Logs]';
			return LogViewer.list();
		}
		this.title = '[Logs] ' + roomid;
		const roomLog = await LogReader.get(roomid);
		if (!roomLog) {
			return `<div class="pad">Room "${roomid}" doesn't exist</div>`;
		}
		if (date && date.length === 10) {
			return LogViewer.day(roomid, date);
		}
		if (date) {
			return LogViewer.month(roomid, date);
		}
		return LogViewer.room(roomid);
	},
};
