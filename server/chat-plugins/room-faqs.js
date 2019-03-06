'use strict';

/** @type {typeof import('../../lib/fs').FS} */
const FS = require(/** @type {any} */('../../.lib-dist/fs')).FS;

const ROOMFAQ_FILE = 'config/chat-plugins/faqs.json';

/** @type {{[k: string]: {[k: string]: string}}} */
let roomFaqs = {};
try {
	roomFaqs = require(`../../${ROOMFAQ_FILE}`);
} catch (e) {
	if (e.code !== 'MODULE_NOT_FOUND' && e.code !== 'ENOENT') throw e;
}
if (!roomFaqs || typeof roomFaqs !== 'object') roomFaqs = {};

function saveRoomFaqs() {
	FS(ROOMFAQ_FILE).writeUpdate(() => JSON.stringify(roomFaqs));
}

/**
 * @param {string} roomid
 * @param {string} key
 *
 * Aliases are implemented as a "regular" FAQ entry starting with a >. EX: {a: "text", b: ">a"}
 * This is done to allow easy checking whether a key is associated with a value or alias as well as preserve backwards compatibility.
 */
function getAlias(roomid, key) {
	if (!roomFaqs[roomid]) return false;
	let value = roomFaqs[roomid][key];
	if (value && value[0] === '>') return value.substr(1);
	return false;
}

/** @type {ChatCommands} */
const commands = {
	addfaq(target, room, user, connection) {
		if (!this.can('declare', null, room)) return false;
		if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
		if (!target) return this.parse('/help roomfaq');

		target = target.trim();
		let input = Chat.filter(this, target, user, room, connection);
		if (target !== input) return this.errorReply("You are not allowed to use fitered words in roomfaq entries.");
		let [topic, ...rest] = input.split(',');

		topic = toId(topic);
		if (!(topic && rest.length)) return this.parse('/help roomfaq');
		let text = rest.join(',').trim();
		let filteredText = text.replace(/\[\[(?:([^<]+)\s<[^>]+>|([^\]]+))\]\]/g, (match, $1, $2) => $1 || $2);
		if (topic.length > 25) return this.errorReply("FAQ topics should not exceed 25 characters.");
		if (filteredText.length > 500) return this.errorReply("FAQ entries should not exceed 500 characters.");

		text = text.replace(/^>/, '&gt;');

		if (!roomFaqs[room.id]) roomFaqs[room.id] = {};
		roomFaqs[room.id][topic] = text;
		saveRoomFaqs();
		this.sendReplyBox(Chat.formatText(text, true));
		this.privateModAction(`(${user.name} added a FAQ for '${topic}')`);
		this.modlog('RFAQ', null, `added '${topic}'`);
	},
	removefaq(target, room, user) {
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (!this.can('declare', null, room)) return false;
		if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
		let topic = toId(target);
		if (!topic) return this.parse('/help roomfaq');

		if (!(roomFaqs[room.id] && roomFaqs[room.id][topic])) return this.errorReply("Invalid topic.");
		delete roomFaqs[room.id][topic];
		Object.keys(roomFaqs[room.id]).filter(val => getAlias(room.id, val) === topic).map(val => delete roomFaqs[room.id][val]);
		if (!Object.keys(roomFaqs[room.id]).length) delete roomFaqs[room.id];
		saveRoomFaqs();
		this.privateModAction(`(${user.name} removed the FAQ for '${topic}')`);
		this.modlog('ROOMFAQ', null, `removed ${topic}`);
	},
	addalias(target, room, user) {
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (!this.can('declare', null, room)) return false;
		if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
		let [alias, topic] = target.split(',').map(val => toId(val));

		if (!(alias && topic)) return this.parse('/help roomfaq');
		if (alias.length > 25) return this.errorReply("FAQ topics should not exceed 25 characters.");

		if (!(roomFaqs[room.id] && topic in roomFaqs[room.id])) return this.errorReply(`The topic ${topic} was not found in this room's faq list.`);
		if (getAlias(room.id, topic)) return this.errorReply(`You cannot make an alias of an alias. Use /addalias ${alias}, ${getAlias(room.id, topic)} instead.`);
		roomFaqs[room.id][alias] = `>${topic}`;
		saveRoomFaqs();
		this.privateModAction(`(${user.name} added an alias for '${topic}': ${alias})`);
		this.modlog('ROOMFAQ', null, `alias for '${topic}' - ${alias}`);
	},
	rfaq: 'roomfaq',
	roomfaq(target, room, user) {
		if (!roomFaqs[room.id]) return this.errorReply("This room has no FAQ topics.");
		let topic = toId(target);
		if (topic === 'constructor') return false;
		if (!topic) return this.sendReplyBox(`List of topics in this room: ${Object.keys(roomFaqs[room.id]).filter(val => !getAlias(room.id, val)).sort((a, b) => a.localeCompare(b)).join(', ')}`);
		if (!roomFaqs[room.id][topic]) return this.errorReply("Invalid topic.");
		topic = getAlias(room.id, topic) || topic;

		if (!this.runBroadcast()) return;
		this.sendReplyBox(Chat.formatText(roomFaqs[room.id][topic], true));
		if (!this.broadcasting && user.can('declare', null, room)) {
			const src = Chat.escapeHTML(roomFaqs[room.id][topic]).replace(/\n/g, `<br />`);
			let extra = `<code>/addfaq ${topic}, ${src}</code>`;
			const aliases = Object.keys(roomFaqs[room.id]).filter(val => getAlias(room.id, val) === topic);
			if (aliases.length) {
				extra += `<br /><br />Aliases: ${aliases.join(', ')}`;
			}
			this.sendReplyBox(extra);
		}
	},
	roomfaqhelp: [
		`/roomfaq - Shows the list of all available FAQ topics`,
		`/roomfaq <topic> - Shows the FAQ for <topic>.`,
		`/addfaq <topic>, <text> - Adds an entry for <topic> in this room or updates it. Requires: # & ~`,
		`/addalias <alias>, <topic> - Adds <alias> as an alias for <topic>, displaying it when users use /roomfaq <alias>. Requires: # & ~`,
		`/removefaq <topic> - Removes the entry for <topic> in this room. If used on an alias, removes the alias. Requires: # & ~`,
	],
};

exports.commands = commands;

process.nextTick(() => {
	Chat.multiLinePattern.register('/addfaq ');
});
