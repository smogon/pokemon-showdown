/**
 * Chat plugin for repeating messages in chat
 * Based on bot functionality from Kid A and Expecto Botronum
 * @author Annika, Zarel
 */

export interface RepeatedPhrase {
	phrase: string;
	/** interval in milliseconds */
	interval: number;
}

export const Repeats = new class {
	// keying to Room rather than RoomID will help us correctly handle room renames
	/** room:phrase:timeout map */
	repeats = new Map<BasicRoom, Map<string, NodeJS.Timeout>>();

	constructor() {
		for (const room of Rooms.rooms.values()) {
			if (!room.settings?.repeats?.length) continue;
			for (const repeat of room.settings.repeats) {
				this.runRepeat(room, repeat);
			}
		}
	}

	hasRepeat(room: BasicRoom, phrase: string) {
		return !!this.repeats.get(room)?.get(phrase);
	}

	addRepeat(room: BasicRoom, repeat: RepeatedPhrase) {
		this.runRepeat(room, repeat);
		if (!room.settings.repeats) room.settings.repeats = [];
		room.settings.repeats.push(repeat);
		room.saveSettings();
	}

	removeRepeat(room: BasicRoom, phrase: string) {
		if (!room.settings.repeats) return;
		room.settings.repeats = room.settings.repeats.filter(repeat => repeat.phrase !== phrase);
		room.saveSettings();

		const roomRepeats = this.repeats.get(room);
		if (!roomRepeats) return;
		const oldInterval = roomRepeats.get(phrase);
		if (oldInterval) clearInterval(oldInterval);
		roomRepeats.delete(phrase);
	}

	clearRepeats(room: BasicRoom) {
		const roomRepeats = this.repeats.get(room);
		if (!roomRepeats) return;
		for (const interval of roomRepeats.values()) {
			if (interval) clearInterval(interval);
		}
		this.repeats.delete(room);
	}

	runRepeat(room: BasicRoom, repeat: RepeatedPhrase) {
		let roomRepeats = this.repeats.get(room);
		if (!roomRepeats) {
			roomRepeats = new Map();
			this.repeats.set(room, roomRepeats);
		}

		if (roomRepeats.has(repeat.phrase)) {
			throw new Error(`Repeat already exists`);
		}

		roomRepeats.set(
			repeat.phrase,
			setInterval(() => {
				if (room !== Rooms.get(room.roomid)) {
					// room was deleted
					this.clearRepeats(room);
					return;
				}
				room.add(`|html|<div class="infobox">${repeat.phrase}</div>`);
				room.update();
			}, repeat.interval)
		);
	}

	destroy() {
		for (const roomRepeats of this.repeats.values()) {
			for (const interval of roomRepeats.values()) {
				if (interval) clearInterval(interval);
			}
		}
	}
};

export function destroy() {
	Repeats.destroy();
}

export const pages: PageTable = {
	repeats(args, user) {
		const room = this.requireRoom();
		this.title = `Repeated phrases in ${room.roomid}`;
		this.checkCan("mute", null, room);
		if (!room.settings.repeats) return `<h1>${this.tr`There are no repeated phrases in ${room.roomid}.`}</h1>`;
		let html = `<div class="ladder pad"><h1>${this.tr`Repeated phrases in ${room.roomid}`}</h1>`;
		html += `<table><tr><th>${this.tr`Phrase`}</th><th>${this.tr`Interval`}</th><th>${this.tr`Action`}</th>`;
		html += `<button class="button" name="send" value="/join view-repeats-${room.roomid}" style="float: right">`;
		html += `<i class="fa fa-refresh"></i> ${this.tr`Refresh`}</button>`;
		for (const repeat of room.settings.repeats) {
			const minutes = repeat.interval / (60 * 1000);
			html += `<tr><td>${repeat.phrase}</td><td>${this.tr`every ${minutes} minute(s)`}</td>`;
			html += `<td><button class="button" name="send" value="/removerepeat ${repeat.phrase}">${this.tr`Remove`}</button></td>`;
		}
		html += `</table>`;
		if (user.can("editroom", null, room)) {
			html += `<br /><button class="button" name="send" value="/removeallrepeats">${this.tr`Remove all repeats`}</button>`;
		}
		html += `</div>`;
		return html;
	},
};

export const commands: ChatCommands = {
	repeat(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		const [intervalString, message] = this.splitOne(target);
		const interval = parseInt(intervalString);
		if (isNaN(interval) || !/[0-9]{1,}/.test(intervalString) || interval < 1) {
			return this.errorReply(this.tr`You must specify a numerical interval of at least 1 minute.`);
		}

		if (Repeats.hasRepeat(room, message)) {
			return this.errorReply(this.tr`The phrase "${message}" is already being repeated in this room.`);
		}

		Repeats.addRepeat(room, {
			phrase: Chat.formatText(message).replace(/\n/g, `<br />`),
			interval: interval * 60 * 1000, // convert to milliseconds
		});

		this.modlog('REPEATPHRASE', null, `every ${interval} minute${Chat.plural(interval)}: "${message}"`);
		this.privateModAction(
			room.tr`${user.name} set the phrase "${message}" to be repeated every ${interval} minute(s).`
		);
	},
	repeathelp() {
		this.runBroadcast();
		this.sendReplyBox(
			`<code>/repeat [minutes], [phrase]</code>: repeats a given phrase every [minutes] minutes.<br />` +
			`<code>/removerepeat [phrase]</code>: removes a repeated phrase.<br />` +
			`/viewrepeats [optional room] - Displays all repeated phrases in a room.<br />` +
			`Phrases for <code>/repeat</code> can include normal chat formatting, but not commands. Requires: % @ # &`
		);
	},

	deleterepeat: 'removerepeat',
	removerepeat(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);

		if (!target) return this.parse('/help repeat');
		target = target.trim();

		if (!Repeats.hasRepeat(room, target)) {
			return this.errorReply(this.tr`The phrase "${target}" is not being repeated in this room.`);
		}

		Repeats.removeRepeat(room, target);

		this.modlog('REMOVE REPEATPHRASE', null, `"${target}"`);
		this.privateModAction(room.tr`${user.name} removed the repeated phrase "${target}".`);
	},

	removeallrepeats(target, room, user) {
		room = this.requireRoom();
		this.checkCan('declare', null, room);
		if (!room.settings.repeats?.length) {
			return this.errorReply(this.tr`There are no repeated phrases in this room.`);
		}

		for (const repeat of room.settings.repeats) {
			Repeats.removeRepeat(room, repeat.phrase);
		}

		this.modlog('REMOVE REPEATPHRASE', null, 'all repeated phrases');
		this.privateModAction(room.tr`${user.name} removed all repeated phrases.`);
	},

	repeats: 'viewrepeats',
	viewrepeats(target, room, user) {
		const roomid = toID(target) || room?.roomid;
		if (!roomid) return this.errorReply(this.tr`You must specify a room when using this command in PMs.`);
		this.parse(`/j view-repeats-${roomid}`);
	},
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/repeat ');
});
