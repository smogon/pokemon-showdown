import {FS} from '../../lib/fs';

class RoomlogViewer {
	button(datestring: string, room: Room, nodate = false) {
		if (!nodate) {
			return `<button class="button" name="send" value="/join view-logs-${room}-${datestring}">${datestring}</button>`;
		} else {
			return `<button class="button" name="send" value="/join view-logs-${room}">${datestring}</button>`;
		}
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

const viewer = new RoomlogViewer();

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
		if (!this.can('mute', null, room) || !this.can('lock')) return false;
		const today = Chat.toTimestamp(new Date()).split(' ')[0];
		const msg = `${viewer.button(today, room)}${viewer.button(`Main Directory for ${room.title}`, room, true)}`;
		return this.sendReplyBox(msg);
	},
	viewlogshelp: [`/viewlogs [room] - view logs of the specified room. Requires: % @ & ~`],
};

export const pages: PageTable = {
	logs(query, user, connection) {
		const parts = this.pageid.split('-');
		const datestring = `${parts[3]}-${parts[4]}-${parts[5]}`;
		const monthstring = `${parts[3]}-${parts[4]}`;
		this.extractRoom();
		this.title = `[Logs] ${datestring}`;
		if (!user.named) return Rooms.RETRY_AFTER_LOGIN;
		let content = FS(`logs/chat/${this.room}/${monthstring}/${datestring}.txt`).readIfExistsSync();
		let buf = `<b><h2>Logs for ${datestring} on ${this.room}:</h2></b>`;
		if (!user.can('mute', null, this.room as ChatRoom | GameRoom)) return;
		if (!content) {
			buf = `<h2>All logs for ${this.room}. ${viewer.directory(this.room)}</h2>`;
			this.title = `[Logs] Main Directory`;
		} else {
			if (parts[6] && parts[6] === 'true') {
				buf += viewer.clean(content, true).join('<br>&nbsp; ');
				buf += viewer.button('Main Directory', this.room, true);
				buf += viewer.button(datestring, this.room);
			} else {
				buf += viewer.clean(content).join('<br>&nbsp; ');
				buf += viewer.button('Main Directory', this.room, true);
				buf += `<br><button class="button" name="send" value="/join view-logs-${this.room}-${datestring}-true">Show extra</button></center>`;
			}
		}
		return buf;
	},
};
