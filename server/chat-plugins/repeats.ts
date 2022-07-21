/**
 * Chat plugin for repeating messages in chat
 * Based on bot functionality from Kid A and Expecto Botronum
 * @author Annika, Zarel
 */

import {roomFaqs, getAlias, visualizeFaq} from './room-faqs';
import type {MessageHandler} from '../rooms';

export interface RepeatedPhrase {
	/** Identifier for deleting */
	id: ID;
	phrase: string;
	/** interval in milliseconds */
	interval: number;
	faq?: boolean;
	isByMessages?: boolean;
	isHTML?: boolean;
}

export const Repeats = new class {
	// keying to Room rather than RoomID will help us correctly handle room renames
	/** room:identifier:phrase:timeout map */
	repeats = new Map<BasicRoom, Map<ID, Map<string, NodeJS.Timeout | MessageHandler>>>();

	constructor() {
		for (const room of Rooms.rooms.values()) {
			if (!room.settings?.repeats?.length) continue;
			for (const repeat of room.settings.repeats) {
				this.runRepeat(room, repeat);
			}
		}
	}

	removeRepeatHandler(room: BasicRoom, handler?: NodeJS.Timeout | MessageHandler) {
		if (typeof handler === 'function') {
			room.nthMessageHandlers.delete(handler);
		} else if (typeof handler === 'object') {
			clearInterval(handler);
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
		this.removeRepeatHandler(room, oldInterval);
		roomRepeats.delete(id);
	}

	clearRepeats(room: BasicRoom) {
		const roomRepeats = this.repeats.get(room);
		if (!roomRepeats) return;
		for (const ids of roomRepeats.values()) {
			for (const interval of ids.values()) {
				this.removeRepeatHandler(room, interval);
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
		const repeater = (targetRoom: BasicRoom) => {
			if (targetRoom !== Rooms.get(targetRoom.roomid)) {
				// room was deleted
				this.clearRepeats(targetRoom);
				return;
			}
			const repeatedPhrase = repeat.faq ?
				visualizeFaq(roomFaqs[targetRoom.roomid][repeat.id]) : Chat.formatText(phrase, true);
			const formattedText = repeat.isHTML ? phrase : repeatedPhrase;
			targetRoom.add(`|uhtml|repeat-${repeat.id}|<div class="infobox">${formattedText}</div>`);
			targetRoom.update();
		};

		if (repeat.isByMessages) {
			room.nthMessageHandlers.set(repeater, interval);
			roomRepeats.set(id, new Map().set(phrase, repeater));
		} else {
			roomRepeats.set(id, new Map().set(phrase, setInterval(repeater, interval, room)));
		}
	}

	destroy() {
		for (const [room, roomRepeats] of this.repeats) {
			for (const ids of roomRepeats.values()) {
				for (const interval of ids.values()) {
					this.removeRepeatHandler(room, interval);
				}
			}
		}
	}
};

export function destroy() {
	Repeats.destroy();
}

export const pages: Chat.PageTable = {
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
			const minutes = repeat.interval / (repeat.isByMessages ? 1 : 60 * 1000);
			const repeatText = repeat.faq ? roomFaqs[room.roomid][repeat.id].source : repeat.phrase;
			const phrase = repeat.faq ? visualizeFaq(roomFaqs[room.roomid][repeat.id]) :
				repeat.isHTML ? repeat.phrase : Chat.formatText(repeatText, true);
			html += `<tr><td>${repeat.id}</td><td>${phrase}</td><td>${Chat.getReadmoreCodeBlock(repeatText)}</td><td>${repeat.isByMessages ? this.tr`every ${minutes} chat message(s)` : this.tr`every ${minutes} minute(s)`}</td>`;
			html += `<td><button class="button" name="send" value="/msgroom ${room.roomid},/removerepeat ${repeat.id}">${this.tr`Remove`}</button></td>`;
		}
		html += `</table>`;
		if (user.can("editroom", null, room)) {
			html += `<br /><button class="button" name="send" value="/msgroom ${room.roomid},/removeallrepeats">${this.tr`Remove all repeats`}</button>`;
		}
		html += `</div>`;
		return html;
	},
};

export const commands: Chat.ChatCommands = {
	repeatbymessages: 'repeat',
	repeathtmlbymessages: 'repeat',
	repeathtml: 'repeat',
	repeat(target, room, user, connection, cmd) {
		const isHTML = cmd.includes('html');
		const isByMessages = cmd.includes('bymessages');
		room = this.requireRoom();
		this.checkCan(isHTML ? 'addhtml' : 'mute', null, room);
		const [intervalString, name, ...messageArray] = target.split(',');
		const id = toID(name);
		if (!id) throw new Chat.ErrorMessage(this.tr`Repeat names must include at least one alphanumeric character.`);

		const phrase = messageArray.join(',').trim();
		const interval = parseInt(intervalString);
		if (isNaN(interval) || !/[0-9]{1,}/.test(intervalString) || interval < 1 || interval > 24 * 60) {
			throw new Chat.ErrorMessage(this.tr`You must specify an interval as a number of minutes or chat messages between 1 and 1440.`);
		}

		if (Repeats.hasRepeat(room, id)) {
			throw new Chat.ErrorMessage(this.tr`The phrase labeled with "${id}" is already being repeated in this room.`);
		}

		if (isHTML) this.checkHTML(phrase);

		Repeats.addRepeat(room, {
			id,
			phrase,
			// convert to milliseconds for time-based repeats
			interval: interval * (isByMessages ? 1 : 60 * 1000),
			isHTML,
			isByMessages,
		});

		this.modlog('REPEATPHRASE', null, `every ${interval} ${isByMessages ? `chat messages` : `minute`}${Chat.plural(interval)}: "${phrase.replace(/\n/g, ' ')}"`);
		this.privateModAction(
			isByMessages ?
				room.tr`${user.name} set the phrase labeled with "${id}" to be repeated every ${interval} chat message(s).` :
				room.tr`${user.name} set the phrase labeled with "${id}" to be repeated every ${interval} minute(s).`
		);
	},
	repeathelp() {
		this.runBroadcast();
		this.sendReplyBox(
			`<code>/repeat [minutes], [id], [phrase]</code>: repeats a given phrase every [minutes] minutes. Requires: % @ # &<br />` +
			`<code>/repeathtml [minutes], [id], [phrase]</code>: repeats a given phrase containing HTML every [minutes] minutes. Requires: # &<br />` +
			`<code>/repeatfaq [minutes], [FAQ name/alias]</code>: repeats a given Room FAQ every [minutes] minutes. Requires: % @ # &<br />` +
			`<code>/removerepeat [id]</code>: removes a repeated phrase. Requires: % @ # &<br />` +
			`<code>/viewrepeats [optional room]</code>: Displays all repeated phrases in a room. Requires: % @ # &<br />` +
			`You can append <code>bymessages</code> to a <code>/repeat</code> command to repeat a phrase based on how many messages have been sent in chat. For example, <code>/repeatfaqbymessages ...</code><br />` +
			`Phrases for <code>/repeat</code> can include normal chat formatting, but not commands.`
		);
	},

	repeatfaqbymessages: 'repeatfaq',
	repeatfaq(target, room, user, connection, cmd) {
		room = this.requireRoom();
		this.checkCan('mute', null, room);
		const isByMessages = cmd.includes('bymessages');

		let [intervalString, topic] = target.split(',');
		const interval = parseInt(intervalString);
		if (isNaN(interval) || !/[0-9]{1,}/.test(intervalString) || interval < 1 || interval > 24 * 60) {
			throw new Chat.ErrorMessage(this.tr`You must specify an interval as a number of minutes or chat messages between 1 and 1440.`);
		}
		if (!roomFaqs[room.roomid]) {
			throw new Chat.ErrorMessage(`This room has no FAQs.`);
		}
		topic = toID(getAlias(room.roomid, topic) || topic);
		const faq = roomFaqs[room.roomid][topic];
		if (!faq) {
			throw new Chat.ErrorMessage(`Invalid topic.`);
		}

		if (Repeats.hasRepeat(room, topic as ID)) {
			throw new Chat.ErrorMessage(this.tr`The text for the Room FAQ "${topic}" is already being repeated.`);
		}

		Repeats.addRepeat(room, {
			id: topic as ID,
			phrase: faq.source,
			interval: interval * (isByMessages ? 1 : 60 * 1000),
			faq: true,
			isByMessages,
		});

		this.modlog('REPEATPHRASE', null, `every ${interval} ${isByMessages ? 'chat message' : 'minute'}${Chat.plural(interval)}: the Room FAQ for "${topic}"`);
		this.privateModAction(
			isByMessages ?
				room.tr`${user.name} set the Room FAQ "${topic}" to be repeated every ${interval} chat message(s).` :
				room.tr`${user.name} set the Room FAQ "${topic}" to be repeated every ${interval} minute(s).`
		);
	},

	deleterepeat: 'removerepeat',
	removerepeat(target, room, user) {
		room = this.requireRoom();
		const id = toID(target);
		if (!id) {
			return this.parse(`/help repeat`);
		}
		this.checkCan('mute', null, room);
		if (!room.settings.repeats?.length) {
			return this.errorReply(this.tr`There are no repeated phrases in this room.`);
		}

		if (!Repeats.hasRepeat(room, id)) {
			return this.errorReply(this.tr`The phrase labeled with "${id}" is not being repeated in this room.`);
		}

		Repeats.removeRepeat(room, id);

		this.modlog('REMOVE REPEATPHRASE', null, `"${id}"`);
		this.privateModAction(room.tr`${user.name} removed the repeated phrase labeled with "${id}".`);
		this.refreshPage(`repeats-${room.roomid}`);
	},

	removeallrepeats(target, room, user) {
		room = this.requireRoom();
		this.checkCan('declare', null, room);
		if (!room.settings.repeats?.length) {
			return this.errorReply(this.tr`There are no repeated phrases in this room.`);
		}

		for (const {id} of room.settings.repeats) {
			Repeats.removeRepeat(room, id);
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
	Chat.multiLinePattern.register('/repeat(html|faq)?(bymessages)? ');
});
