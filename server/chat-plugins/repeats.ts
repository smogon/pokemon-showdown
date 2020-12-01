/**
 * Chat plugin for repeating messages in chat
 * Based on bot functionality from Kid A and Expecto Botronum
 * @author Annika, Zarel
 */

import {roomFaqs, getAlias} from './room-faqs';

export interface RepeatedPhrase {
	/** Identifier for deleting */
	id: ID;
	phrase: string;
	/** interval in milliseconds */
	interval: number;
	faq?: boolean;
	isHTML?: boolean;
}

export const Repeats = new class {
	// keying to Room rather than RoomID will help us correctly handle room renames
	/** room:identifier:phrase:timeout map */
	repeats = new Map<BasicRoom, Map<ID, Map<string, NodeJS.Timeout>>>();

	constructor() {
		for (const room of Rooms.rooms.values()) {
			if (!room.settings?.repeats?.length) continue;
			for (const repeat of room.settings.repeats) {
				this.runRepeat(room, repeat);
			}
		}
	}

	hasRepeat(room: BasicRoom, id: ID) {
		return !!this.repeats.get(room)?.get(id);
	}

	addRepeat(room: BasicRoom, repeat: RepeatedPhrase) {
		this.runRepeat(room, repeat);
		if (!room.settings.repeats) room.settings.repeats = [];
		room.settings.repeats.push(repeat);
		room.saveSettings();
	}

	removeRepeat(room: BasicRoom, id: ID) {
		if (!room.settings.repeats) return;
		const phrase = room.settings.repeats.find(x => x.id === id)?.phrase;
		room.settings.repeats = room.settings.repeats.filter(repeat => repeat.id !== id);
		if (!room.settings.repeats.length) delete room.settings.repeats;
		room.saveSettings();

		const roomRepeats = this.repeats.get(room);
		if (!roomRepeats) return;
		const oldInterval = roomRepeats.get(id)?.get(phrase!);
		if (oldInterval) clearInterval(oldInterval);
		roomRepeats.delete(id);
	}

	clearRepeats(room: BasicRoom) {
		const roomRepeats = this.repeats.get(room);
		if (!roomRepeats) return;
		for (const ids of roomRepeats.values()) {
			for (const interval of ids.values()) {
				if (interval) clearInterval(interval);
			}
		}
		this.repeats.delete(room);
	}

	runRepeat(room: BasicRoom, repeat: RepeatedPhrase) {
		let roomRepeats = this.repeats.get(room);
		if (!roomRepeats) {
			roomRepeats = new Map();
			this.repeats.set(room, roomRepeats);
		}
		const {id, phrase, interval} = repeat;

		if (roomRepeats.has(id)) {
			throw new Error(`Repeat already exists`);
		}

		roomRepeats.set(id, new Map().set(phrase, setInterval(() => {
			if (room !== Rooms.get(room.roomid)) {
				// room was deleted
				this.clearRepeats(room);
				return;
			}
			const formattedText = repeat.faq ? Chat.formatText(roomFaqs[room.roomid][repeat.id], true) :
				repeat.isHTML ? repeat.phrase : Chat.formatText(repeat.phrase, false, true);
			room.add(`|html|<div class="infobox">${formattedText}</div>`);
			room.update();
		}, interval)));
	}

	destroy() {
		for (const roomRepeats of this.repeats.values()) {
			for (const ids of roomRepeats.values()) {
				for (const interval of ids.values()) {
					if (interval) clearInterval(interval);
				}
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
		this.title = `[Repeats]`;
		this.checkCan("mute", null, room);
		let html = `<div class="ladder pad">`;
		html += `<button class="button" name="send" value="/join view-repeats-${room.roomid}" style="float: right"><i class="fa fa-refresh"></i> ${this.tr`Refresh`}</button>`;
		if (!room.settings.repeats?.length) {
			return `${html}<h1>${this.tr`There are no repeated phrases in ${room.title}.`}</h1></div>`;
		}
		html += `<h2>${this.tr`Repeated phrases in ${room.title}`}</h2>`;
		html += `<table><tr><th>${this.tr`Identifier`}</th><th>${this.tr`Phrase`}</th><th>${this.tr`Raw text`}</th><th>${this.tr`Interval`}</th><th>${this.tr`Action`}</th>`;
		for (const repeat of room.settings.repeats) {
			const minutes = repeat.interval / (60 * 1000);
			if (!repeat.faq) {
				const phrase = repeat.isHTML ? repeat.phrase : Chat.formatText(repeat.phrase, false, true);
				html += `<tr><td>${repeat.id}</td><td>${phrase}</td><td>${Chat.getReadmoreCodeBlock(repeat.phrase)}</td><td>${this.tr`every ${minutes} minute(s)`}</td>`;
				html += `<td><button class="button" name="send" value="/removerepeat ${repeat.id},${room.roomid}">${this.tr`Remove`}</button></td>`;
			} else {
				const phrase = Chat.formatText(roomFaqs[room.roomid][repeat.id], true);
				html += `<tr><td>${repeat.id}</td><td>${phrase}</td><td>${Chat.getReadmoreCodeBlock(roomFaqs[room.roomid][repeat.id])}</td><td>${this.tr`every ${minutes} minute(s)`}</td>`;
				html += `<td><button class="button" name="send" value="/removerepeat ${repeat.id},${room.roomid}">${this.tr`Remove`}</button></td>`;
			}
		}
		html += `</table>`;
		if (user.can("editroom", null, room)) {
			html += `<br /><button class="button" name="send" value="/removeallrepeats ${room.roomid}">${this.tr`Remove all repeats`}</button>`;
		}
		html += `</div>`;
		return html;
	},
};

export const commands: ChatCommands = {
	repeathtml: 'repeat',
	repeat(target, room, user, connection, cmd) {
		const isHTML = cmd === 'repeathtml';
		room = this.requireRoom();
		this.checkCan(isHTML ? 'addhtml' : 'mute', null, room);
		const [intervalString, name, ...messageArray] = target.split(',');
		const id = toID(name);
		const phrase = messageArray.join(',').trim();
		const interval = parseInt(intervalString);
		if (isNaN(interval) || !/[0-9]{1,}/.test(intervalString) || interval < 1 || interval > 24 * 60) {
			throw new Chat.ErrorMessage(this.tr`You must specify an interval as a number of minutes between 1 and 1440.`);
		}

		if (Repeats.hasRepeat(room, id)) {
			throw new Chat.ErrorMessage(this.tr`The phrase labeled with "${id}" is already being repeated in this room.`);
		}

		if (isHTML) this.checkHTML(phrase);

		Repeats.addRepeat(room, {
			id,
			phrase,
			interval: interval * 60 * 1000, // convert to milliseconds
			isHTML,
		});

		this.modlog('REPEATPHRASE', null, `every ${interval} minute${Chat.plural(interval)}: "${phrase.replace(/\n/g, ' ')}"`);
		this.privateModAction(
			room.tr`${user.name} set the phrase labeled with "${id}" to be repeated every ${interval} minute(s).`
		);
	},
	repeathelp() {
		this.runBroadcast();
		this.sendReplyBox(
			`<code>/repeat [minutes], [id], [phrase]</code>: repeats a given phrase every [minutes] minutes.<br />` +
			`<code>/repeathtml [minutes], [id], [phrase]</code>: repeats a given phrase containing HTML every [minutes] minutes. Requires: # &<br />` +
			`<code>/repeatfaq [minutes], [FAQ name/alias]</code>: repeats a given Room FAQ every [minutes] minutes.<br />` +
			`<code>/removerepeat [id]</code>: removes a repeated phrase.<br />` +
			`<code>/viewrepeats [optional room]</code>: Displays all repeated phrases in a room.<br />` +
			`Phrases for <code>/repeat</code> can include normal chat formatting, but not commands. Requires: % @ # &`
		);
	},

	repeatfaq(target, room, user) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		let [intervalString, topic] = target.split(',');
		const interval = parseInt(intervalString);
		if (isNaN(interval) || !/[0-9]{1,}/.test(intervalString) || interval < 1 || interval > 24 * 60) {
			throw new Chat.ErrorMessage(this.tr`You must specify an interval as a number of minutes between 1 and 1440.`);
		}
		if (!roomFaqs[room.roomid]) {
			throw new Chat.ErrorMessage(`This room has no FAQs.`);
		}
		topic = toID(getAlias(room.roomid, topic) || topic);
		if (!roomFaqs[room.roomid][topic]) {
			throw new Chat.ErrorMessage(`Invalid topic.`);
		}

		if (Repeats.hasRepeat(room, topic as ID)) {
			throw new Chat.ErrorMessage(this.tr`The text for the Room FAQ "${topic}" is already being repeated.`);
		}

		Repeats.addRepeat(room, {
			id: topic as ID,
			phrase: roomFaqs[room.roomid][topic],
			interval: interval * 60 * 1000,
			faq: true,
		});

		this.modlog('REPEATPHRASE', null, `every ${interval} minute${Chat.plural(interval)}: the Room FAQ for "${topic}"`);
		this.privateModAction(
			room.tr`${user.name} set the Room FAQ "${topic}" to be repeated every ${interval} minute(s).`
		);
	},

	deleterepeat: 'removerepeat',
	removerepeat(target, room, user) {
		target = target.trim();
		const [name, roomid] = target.split(',');
		const id = toID(name);
		if (!id) {
			return this.parse(`/help repeat`);
		}
		const targetRoom = roomid ? Rooms.search(roomid) : room;
		if (!targetRoom) {
			return this.errorReply(`Invalid room.`);
		}
		this.room = targetRoom;
		this.checkCan('mute', null, targetRoom);
		if (!targetRoom.settings.repeats?.length) {
			return this.errorReply(this.tr`There are no repeated phrases in this room.`);
		}

		if (!Repeats.hasRepeat(targetRoom, id)) {
			return this.errorReply(this.tr`The phrase labeled with "${id}" is not being repeated in this room.`);
		}

		Repeats.removeRepeat(targetRoom, id);

		this.modlog('REMOVE REPEATPHRASE', null, `"${id}"`);
		this.privateModAction(targetRoom.tr`${user.name} removed the repeated phrase labeled with "${id}".`);
		if (roomid) this.parse(`/join view-repeats-${targetRoom.roomid}`);
	},

	removeallrepeats(target, room, user) {
		target = target.trim();
		const targetRoom = target ? Rooms.search(target) : room;
		if (!targetRoom) {
			return this.errorReply(this.tr`Invalid room.`);
		}
		this.room = targetRoom;
		this.checkCan('declare', null, targetRoom);
		if (!targetRoom.settings.repeats?.length) {
			return this.errorReply(this.tr`There are no repeated phrases in this room.`);
		}

		for (const {id} of targetRoom.settings.repeats) {
			Repeats.removeRepeat(targetRoom, id);
		}

		this.modlog('REMOVE REPEATPHRASE', null, 'all repeated phrases');
		this.privateModAction(targetRoom.tr`${user.name} removed all repeated phrases.`);
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
