import {FS} from '../../lib/fs';

interface RoomlogReader {
	readLogs: (roomid: RoomID, year: string, month: string, date: string) => string;
	months: (room: Room) => string[][];
}

class RoomlogReaderFS implements RoomlogReader {
	readLogs(roomid: RoomID, year: string, month: string, date: string) {
		let buf;
		try {
			buf = FS(`logs/chat/${roomid}/${year}-${month}/${year}-${month}-${date}.txt`).readIfExistsSync();
		} catch (e) {
			buf = '';
		}
		return buf;
	}
	months(room: Room) {
		const months: string[] = [];
		const days: string[] = [];
		for (const m of FS(`logs/chat/${room}/`).readdirSync()) {
			if (!FS(`logs/chat/${room}/${m}/`).isDirectorySync()) continue;
			months.push(m);
		}
		for (const month of months) {
			for (const day of FS(`logs/chat/${room}/${month}`).readdirSync()) {
				if (day.endsWith('.txt')) days.push(day.slice(0, -4));
			}
		}
		return [months, days];
	}
}

class RoomlogViewer<T extends RoomlogReader> {
	reader: T;
	constructor(reader: T) {
		this.reader = reader;
	}
	button(datestring: string, room: Room, nodate = false) {
		if (!nodate) {
			return `<button class="button" name="send" value="/join view-logs--${room}--${datestring}">${datestring}</button>`;
		} else {
			return `<button class="button" name="send" value="/join view-logs--${room}">${datestring}</button>`;
		}
	}
	structure(room: Room) {
		let buf = `<b>Logs for ${room}</b><br>`;
		const [months, days] = this.reader.months(room);
		for (const month of months) {
			buf += `<br><br><b>${month}</b><br>`;
			for (const day of days) {
				if (!day.includes(month)) continue;
				buf += this.button(day, room);
			}
		}
		return buf;
	}
	clean(content: string, showall = false) {
		const cleaned = [];
		for (let line of content.split('\n')) {
			line = line.trim();
			if (!line) continue;
			let [timestamp, protocol, rest] = line.split('|');
			const cp = ['c', 'c:'];
			timestamp = timestamp.trim();
			if (cp.includes(protocol)) {
				const [,, user, message] = line.split('|');
				line = `[${timestamp}] <b>${user}</b>: ${Chat.formatText(message.replace('/log', ''))}`;
				cleaned.push(`&nbsp;${line}`);
			} else if (protocol === 'html' || protocol === 'raw') {
				line = `[${timestamp}]: ${rest}`;
				cleaned.push(`&nbsp;${line}`);
			} else if (showall) {
				line = `[${timestamp}]: ${line.slice(timestamp.length)}`;
				cleaned.push(line);
			} else if (!protocol) {
				line = `[${timestamp}]: ${line.slice(timestamp.length)}`;
				cleaned.push(line);
			} else {
				const exceptions = ['N', 'J', 'L', 'userstats', 'j', 'l', 'n'];
				if (exceptions.includes(line.split('|')[1])) {
					continue;
				} else {
					cleaned.push(`&nbsp;[${timestamp}]: <code>${line}</code>`);
				}
			}
		}
		return cleaned;
	}
}

const viewer = new RoomlogViewer(new RoomlogReaderFS());

export const commands: ChatCommands = {
	viewlogs(target, room, user) {
		target = target.trim();
		if (target) {
			room = Rooms.get(target) as ChatRoom | GameRoom;
		} else {
			target = room.roomid;
		}
		if (!Rooms.search(target)) return this.errorReply(`Room ${target} does not exist.`);
		if (!this.can('mute', null, room)) return false;
		const today = Chat.toTimestamp(new Date()).split(' ')[0];
		const msg = `${viewer.button(today, room)}${viewer.button(`Main Directory for ${room.title}`, room, true)}`;
		return this.sendReplyBox(msg);
	},
	viewlogshelp: [`/viewlogs [room] - view logs of the specified room. Requires: % @ # & ~`],
};

export const pages: PageTable = {
	logs(query, user, connection) {
		let [, room, date, all] = this.pageid.split('--');
		if (!date) date = '';
		this.room = Rooms.get(room) as ChatRoom | GameRoom;
		if (!this.room) {
			return `<h2>Invalid Room</h2>`;
			// extractRoom() fails on -- id's
			// manually do what this.extractRoom() would if there's no room
		}
		if (!user.can('mute', null, this.room) || !user.can('lock')) return;
		const [Y, M, D] = date.split('-');
		this.title = `[Logs] ${date}`;
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		let content;
		if (D && M && Y) {
			content = viewer.reader.readLogs(this.room.roomid, Y, M, D);
		} else {
			content = null;
		}
		let buf = `<b><h2>Logs for ${Y}-${M}-${D} on ${this.room.title}:</h2></b>`;
		if (!content) {
			buf = `<h2>All logs for ${this.room.title}. <br> ${viewer.structure(this.room)}</h2>`;
			this.title = `[Logs] Main Directory`;
		} else {
			if (all) {
				buf += `<a href="/view-logs--${this.room.roomid}" target="_blank">Main Directory</a>`;
				buf += `<br><br>`;
				buf += viewer.clean(content, true).join('<br>&nbsp; ');
				buf += `<br>`;
				buf += `<center><a href="/view-logs--${this.room.roomid}" target="_blank">Main Directory</a><`;
				buf += `<br><a href="/view-logs--${this.room.roomid}--${Y}-${M}-${D}" target="_blank">Hide extra</a></center>`;
			} else {
				buf += `<a href="/view-logs--${this.room.roomid}" target="_blank">Main Directory</a>`;
				buf += `<br><br>`;
				buf += viewer.clean(content).join('<br>&nbsp; ');
				buf += `<br>`;
				buf += `<center><a href="/view-logs--${this.room.roomid}" target="_blank">Main Directory</a>`;
				buf += `<br><a href="/view-logs--${this.room.roomid}--${Y}-${M}-${D}--true" target="_blank">Show extra</a></center>`;
			}
		}
		return buf;
	},
};
