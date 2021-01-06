import {FS} from '../../lib/fs';
import {Utils} from '../../lib/utils';

export const ROOMFAQ_FILE = 'config/chat-plugins/faqs.json';
const MAX_ROOMFAQ_LENGTH = 8192;

export const roomFaqs: {[k: string]: {[k: string]: string}} = JSON.parse(FS(ROOMFAQ_FILE).readIfExistsSync() || "{}");

function saveRoomFaqs() {
	FS(ROOMFAQ_FILE).writeUpdate(() => JSON.stringify(roomFaqs));
}

/**
 * Aliases are implemented as a "regular" FAQ entry starting with a >. EX: {a: "text", b: ">a"}
 * This is done to allow easy checking whether a key is associated with
 * a value or alias as well as preserve backwards compatibility.
 */
export function getAlias(roomid: RoomID, key: string) {
	if (!roomFaqs[roomid]) return false;
	const value = roomFaqs[roomid][key];
	if (value && value.startsWith('>')) return value.substr(1);
	return false;
}

export const commands: ChatCommands = {
	addfaq(target, room, user, connection) {
		room = this.requireRoom();
		this.checkCan('ban', null, room);
		if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
		if (!target) return this.parse('/help roomfaq');

		target = target.trim();
		const input = this.filter(target);
		if (target !== input) return this.errorReply("You are not allowed to use fitered words in roomfaq entries.");
		let [topic, ...rest] = input.split(',');

		topic = toID(topic);
		if (!(topic && rest.length)) return this.parse('/help roomfaq');
		let text = rest.join(',').trim();
		if (topic.length > 25) return this.errorReply("FAQ topics should not exceed 25 characters.");
		if (Chat.stripFormatting(text).length > MAX_ROOMFAQ_LENGTH) {
			return this.errorReply(`FAQ entries should not exceed ${MAX_ROOMFAQ_LENGTH} characters.`);
		}

		text = text.replace(/^>/, '&gt;');

		if (!roomFaqs[room.roomid]) roomFaqs[room.roomid] = {};
		roomFaqs[room.roomid][topic] = text;
		saveRoomFaqs();
		this.sendReplyBox(Chat.formatText(text, true));
		this.privateModAction(`${user.name} added a FAQ for '${topic}'`);
		this.modlog('RFAQ', null, `added '${topic}'`);
	},
	removefaq(target, room, user) {
		target = target.trim();
		let [topic, roomid] = Utils.splitFirst(target, ',');
		const targetRoom = roomid ? Rooms.search(roomid) : room;
		if (!targetRoom) return this.errorReply(`Invalid room.`);
		if (!targetRoom.persist) {
			return this.errorReply("This command is unavailable in temporary rooms.");
		}
		this.room = targetRoom;
		this.checkChat();
		this.checkCan('ban', null, targetRoom);
		topic = toID(topic);
		if (!topic) return this.parse('/help roomfaq');

		if (!(roomFaqs[targetRoom.roomid] && roomFaqs[targetRoom.roomid][topic])) return this.errorReply("Invalid topic.");
		if (
			targetRoom.settings.repeats?.length &&
			targetRoom.settings.repeats.filter(x => x.faq && x.id === (getAlias(targetRoom.roomid, topic) || topic)).length
		) {
			this.parse(`/removerepeat ${getAlias(targetRoom.roomid, topic) || topic},${targetRoom.roomid}`);
		}
		delete roomFaqs[targetRoom.roomid][topic];
		Object.keys(roomFaqs[targetRoom.roomid]).filter(
			val => getAlias(targetRoom.roomid, val) === topic
		).map(
			val => delete roomFaqs[targetRoom.roomid][val]
		);
		if (!Object.keys(roomFaqs[targetRoom.roomid]).length) delete roomFaqs[targetRoom.roomid];
		saveRoomFaqs();
		this.privateModAction(`${user.name} removed the FAQ for '${topic}'`);
		this.modlog('ROOMFAQ', null, `removed ${topic}`);
		if (roomid) this.parse(`/join view-roomfaqs-${targetRoom.roomid}`);
	},
	addalias(target, room, user) {
		room = this.requireRoom();
		this.checkChat();
		this.checkCan('ban', null, room);
		if (!room.persist) return this.errorReply("This command is unavailable in temporary rooms.");
		const [alias, topic] = target.split(',').map(val => toID(val));

		if (!(alias && topic)) return this.parse('/help roomfaq');
		if (alias.length > 25) return this.errorReply("FAQ topics should not exceed 25 characters.");

		if (!(roomFaqs[room.roomid] && topic in roomFaqs[room.roomid])) {
			return this.errorReply(`The topic ${topic} was not found in this room's faq list.`);
		}
		if (getAlias(room.roomid, topic)) {
			return this.errorReply(`You cannot make an alias of an alias. Use /addalias ${alias}, ${getAlias(room.roomid, topic)} instead.`);
		}
		roomFaqs[room.roomid][alias] = `>${topic}`;
		saveRoomFaqs();
		this.privateModAction(`${user.name} added an alias for '${topic}': ${alias}`);
		this.modlog('ROOMFAQ', null, `alias for '${topic}' - ${alias}`);
	},
	viewfaq: 'roomfaq',
	rfaq: 'roomfaq',
	roomfaq(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!roomFaqs[room.roomid]) return this.errorReply("This room has no FAQ topics.");
		let topic: string = toID(target);
		if (topic === 'constructor') return false;
		if (!topic) {
			return this.parse(`/join view-roomfaqs-${room.roomid}`);
		}
		if (!roomFaqs[room.roomid][topic]) return this.errorReply("Invalid topic.");
		topic = getAlias(room.roomid, topic) || topic;

		if (!this.runBroadcast()) return;
		this.sendReplyBox(Chat.formatText(roomFaqs[room.roomid][topic], true));
	},
	roomfaqhelp: [
		`/roomfaq - Shows the list of all available FAQ topics`,
		`/roomfaq <topic> - Shows the FAQ for <topic>.`,
		`/addfaq <topic>, <text> - Adds an entry for <topic> in this room or updates it. Requires: @ # &`,
		`/addalias <alias>, <topic> - Adds <alias> as an alias for <topic>, displaying it when users use /roomfaq <alias>. Requires: @ # &`,
		`/removefaq <topic> - Removes the entry for <topic> in this room. If used on an alias, removes the alias. Requires: @ # &`,
	],
};

export const pages: PageTable = {
	roomfaqs(args, user) {
		const room = this.requireRoom();
		this.title = `[Room FAQs]`;
		// allow it for users if they can access the room
		if (!room.checkModjoin(user)) {
			throw new Chat.ErrorMessage(`<h2>Access denied.</h2>`);
		}
		let buf = `<div class="pad"><button style="float:right;" class="button" name="send" value="/join view-roomfaqs-${room.roomid}"><i class="fa fa-refresh"></i> Refresh</button>`;
		if (!roomFaqs[room.roomid]) {
			return `${buf}<h2>This room has no FAQs.</h2></div>`;
		}

		buf += `<h2>FAQs for ${room.title}:</h2>`;
		const keys = Object.keys(roomFaqs[room.roomid]);
		const sortedKeys = keys.filter(val => !getAlias(room.roomid, val)).sort((a, b) => a.localeCompare(b));
		for (const key of sortedKeys) {
			const topic = roomFaqs[room.roomid][key];
			buf += `<div class="infobox">`;
			buf += `<h3>${key}</h3>`;
			buf += `<hr />`;
			buf += Chat.formatText(topic, true);
			const aliases = keys.filter(val => getAlias(room.roomid, val) === key);
			if (aliases.length) {
				buf += `<hr /><strong>Aliases:</strong> ${aliases.join(', ')}`;
			}
			if (user.can('ban', null, room, 'addfaq')) {
				const src = Utils.escapeHTML(topic).replace(/\n/g, `<br />`);
				buf += `<hr /><details><summary>Raw text</summary>`;
				buf += `<code style="white-space: pre-wrap; display: table; tab-size: 3;">/addfaq ${key}, ${src}</code></details>`;
				buf += `<hr /><button class="button" name="send" value="/removefaq ${key},${room.roomid}">Delete FAQ</button>`;
			}
			buf += `</div>`;
		}
		buf += `</div>`;
		return buf;
	},
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/addfaq ');
});
