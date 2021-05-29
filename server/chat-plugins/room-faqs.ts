import {FS, Utils} from '../../lib';

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

export const commands: Chat.ChatCommands = {
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

		const lengthWithoutFormatting = Chat.stripFormatting(text).length;
		if (lengthWithoutFormatting > MAX_ROOMFAQ_LENGTH) {
			return this.errorReply(`FAQ entries must not exceed ${MAX_ROOMFAQ_LENGTH} characters.`);
		} else if (lengthWithoutFormatting < 1) {
			return this.errorReply(`FAQ entries must include at least one character.`);
		}

		text = text.replace(/^>/, '&gt;');

		if (!roomFaqs[room.roomid]) roomFaqs[room.roomid] = {};
		const exists = topic in roomFaqs[room.roomid];
		roomFaqs[room.roomid][topic] = text;
		saveRoomFaqs();
		this.sendReplyBox(Chat.formatText(text, true));
		this.privateModAction(`${user.name} ${exists ? 'edited' : 'added'} an FAQ for '${topic}'`);
		this.modlog('RFAQ', null, `${exists ? 'edited' : 'added'} '${topic}'`);
	},
	removefaq(target, room, user) {
		room = this.requireRoom();
		this.checkChat();
		this.checkCan('ban', null, room);
		const topic = toID(target);
		if (!topic) return this.parse('/help roomfaq');

		if (!(roomFaqs[room.roomid] && roomFaqs[room.roomid][topic])) return this.errorReply("Invalid topic.");
		if (
			room.settings.repeats?.length &&
			room.settings.repeats.filter(x => x.faq && x.id === (getAlias(room!.roomid, topic) || topic)).length
		) {
			this.parse(`/msgroom ${room.roomid},/removerepeat ${getAlias(room.roomid, topic) || topic}`);
		}
		delete roomFaqs[room.roomid][topic];
		Object.keys(roomFaqs[room.roomid]).filter(
			val => getAlias(room!.roomid, val) === topic
		).map(
			val => delete roomFaqs[room!.roomid][val]
		);
		if (!Object.keys(roomFaqs[room.roomid]).length) delete roomFaqs[room.roomid];
		saveRoomFaqs();
		this.privateModAction(`${user.name} removed the FAQ for '${topic}'`);
		this.modlog('ROOMFAQ', null, `removed ${topic}`);
		this.refreshPage(`roomfaqs-${room.roomid}`);
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
		if (!this.broadcasting && user.can('ban', null, room, 'rfaq')) {
			const code = Utils.escapeHTML(roomFaqs[room.roomid][topic]).replace(/\n/g, '<br />');
			this.sendReplyBox(`<details><summary>Source</summary><code style="white-space: pre-wrap; display: table; tab-size: 3">/addfaq ${topic}, ${code}</code></details>`);
		}
	},
	roomfaqhelp: [
		`/roomfaq - Shows the list of all available FAQ topics`,
		`/roomfaq <topic> - Shows the FAQ for <topic>.`,
		`/addfaq <topic>, <text> - Adds an entry for <topic> in this room or updates it. Requires: @ # &`,
		`/addalias <alias>, <topic> - Adds <alias> as an alias for <topic>, displaying it when users use /roomfaq <alias>. Requires: @ # &`,
		`/removefaq <topic> - Removes the entry for <topic> in this room. If used on an alias, removes the alias. Requires: @ # &`,
	],
};

export const pages: Chat.PageTable = {
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
		const sortedKeys = Utils.sortBy(keys.filter(val => !getAlias(room.roomid, val)));
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
				buf += `<hr /><button class="button" name="send" value="/msgroom ${room.roomid},/removefaq ${key}">Delete FAQ</button>`;
			}
			buf += `</div>`;
		}
		buf += `</div>`;
		return buf;
	},
};

export const handlers: Chat.Handlers = {
	onRenameRoom(oldID, newID) {
		if (roomFaqs[oldID]) {
			if (!roomFaqs[newID]) roomFaqs[newID] = {};
			Object.assign(roomFaqs[newID], roomFaqs[oldID]);
			delete roomFaqs[oldID];
			saveRoomFaqs();
		}
	},
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/addfaq ');
});
