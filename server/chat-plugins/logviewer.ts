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
			const part = line.split('|');
			const cp = ['c', 'c:'];
			if (cp.includes(part[1])) {
				line = `[${part[0].trim()}] ${part[2]}: ${part[3]}`;
				cleaned.push(`&nbsp;${line}`);
			} else if (part[1] === 'html') {
				line = `[${part[0].trim()}]: ${part[2]}`;
				cleaned.push(`&nbsp;${line}`);
			} else if (showall) {
				cleaned.push(`&nbsp;${line}`);
			} else {
				const exceptions = ['N', 'J', 'L', 'userstats'];
				if (!exceptions.includes(part[1])) cleaned.push(`&nbsp;${line}`);
			}
		}
		return cleaned;
	}
}

const viewer = new RoomlogViewer(new RoomlogReaderFS());

export const commands: ChatCommands = {
	viewlogs(target, room, user) {
		if (!room.chatRoomData || room.roomid.includes('-')) return this.errorReply("This room has no logs.");
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
		const [Y, M, D] = date.split('-');
		this.title = `[Logs] [${this.room.title}] ${date}`;
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		let content;
		if (D && M && Y) {
			content = viewer.reader.readLogs(this.room.roomid, Y, M, D);
		} else {
			content = null;
		}
		let buf = `<b><h2>Logs for ${Y}-${M}-${D} on ${this.room.title}:</h2></b>`;
		if (!user.can('mute', null, room) || !user.can('lock')) return;
		if (!content) {
			buf = `<h2>All logs for ${this.room.title}. <br> ${viewer.structure(this.room)}</h2>`;
			this.title = `[Logs] [${this.room.title}] Main Directory`;
		} else {
			if (all) {
				buf += viewer.clean(content, true).join('<br>&nbsp; ');
				buf += viewer.button('Main Directory', this.room, true);
				buf += viewer.button(`${Y}-${M}-${D}`, this.room);
			} else {
				buf += viewer.clean(content).join('<br>&nbsp; ');
				buf += viewer.button('Main Directory', this.room, true);
				buf += `<br><button class="button" name="send" value="/join view-logs-${this.room}-${Y}-${M}-${D}-true">Show extra</button></center>`;
			}
		}
		return buf;
	},
};
