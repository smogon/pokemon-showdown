import {FS} from '../../lib/fs';

interface RoomlogReader {
	readLogs: (roomid: RoomID, year: string, month: string, date: string) => string;
	directory: (room: Room) => string;
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

	directory(room: Room) {
		let buf = "&nbsp;&nbsp;<h2><b>Select a date to view logs.</b></h2>";
		const months = FS(`logs/chat/${room}/`).readdirSync();
		for (const m of months) {
			if (!FS(`logs/chat/${room}/${m}`).isDirectorySync()) continue;
			buf += `<br><br><b><center>${m}</center></b><br>`;
			for (const file of FS(`logs/chat/${room}/${m}`).readdirSync()) {
				if (!file.endsWith('.txt')) continue;
				buf += `${this.button(file.slice(0, -4), room)}`;
			}
		}

		return buf;
	}

	month(month: string, room: Room) {
		let buf = "&nbsp;&nbsp;<h2><b>Select a date to view logs.</b></h2>";
		const days = FS(`logs/chat/${room}/${month}`).readdirSync();
		for (const file of days) {
			if (!file.endsWith('.txt')) continue;
			buf += `${this.button(file.slice(0, -4), room)}`;
		}

		return buf;
	}
	
	button(datestring: string, room: Room, nodate = false) {
		if (!nodate) {
			return `<button class="button" name="send" value="/join view-logs--${room}--${datestring}">${datestring}</button>`;
		} else {
			return `<button class="button" name="send" value="/join view-logs--${room}">${datestring}</button>`;
		}
	}
}
class RoomlogViewer<T extends RoomlogReader> {
    reader: T;
    constructor(reader: T) {
        this.reader = reader;
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
		const msg = `${viewer.reader.button(today, room)}${viewer.reader.button(`Main Directory for ${room.title}`, room, true)}`;
		return this.sendReplyBox(msg);
	},
	viewlogshelp: [`/viewlogs [room] - view logs of the specified room. Requires: % @ # & ~`],
};

export const pages: PageTable = {
	logs(query, user, connection) {
		let [_view, room, date, all] = this.pageid.split('--');
		this.extractRoom();
		if (!date) date = '';
		if (!room) room = this.room;
		let [Y, M, D] = date.split('-');
		this.title = `[Logs] ${date}`;
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		let content;
		if (D && M && Y) {
			content = viewer.reader.readLogs(room, Y, M, D)
		} else {
			content = null;
		}
		let buf = `<b><h2>Logs for ${Y}-${M}-${D} on ${room}:</h2></b>`;
		if (!user.can('mute', null, Rooms.get(room)) || !user.can('lock')) return;
		if (!content) {
			buf = `<h2>All logs for ${room}. ${viewer.reader.directory(room)}</h2>`;
			this.title = `[Logs] Main Directory`;
		} else if (!content && M && Y && !D) { 
				buf += viewer.reader.month(`${Y}-${M}`, room);
				buf += viewer.reader.button('Main Directory', room, true);
				this.title = `[Logs] ${Y}-${M}`;
		} else {
			if (all) {
				buf += viewer.clean(content, true).join('<br>&nbsp; ');
				buf += viewer.reader.button('Main Directory', room, true);
				buf += viewer.button(`${Y}-${M}-${D}`, room);
			} else {
				buf += viewer.clean(content).join('<br>&nbsp; ');
				buf += viewer.reader.button('Main Directory', room, true);
				buf += `<br><button class="button" name="send" value="/join view-logs-${room}-${Y}-${M}-${D}-true">Show extra</button></center>`;
			}
		}
		return buf;
	},
};
