'use strict';

const fs = require('fs');
const path = require('path');

const ROOMFAQ_FILE = path.resolve(__dirname, '../config/chat-plugins/faqs.json');
const ALLOWED_HTML = ['a', 'font', 'i', 'u', 'b', 'strong', 'em', 'small', 'sub', 'sup', 'ins', 'del', 'code'];

let roomFaqs = {};
try {
	roomFaqs = require(ROOMFAQ_FILE);
} catch (e) {
	if (e.code !== 'MODULE_NOT_FOUND') throw e;
}
if (!roomFaqs || typeof roomFaqs !== 'object') roomFaqs = {};

function saveRoomFaqs() {
	fs.writeFileSync(ROOMFAQ_FILE, JSON.stringify(roomFaqs));
}

// Aliases are implemented as a "regular" FAQ entry starting with a >. EX: {a: "text", b: ">a"}
// This is done to allow easy checking whether a key is associated with a value or alias as well as preserve backwards compatibility.
function getAlias(roomid, key) {
	if (!roomFaqs[roomid]) return false;
	let value = roomFaqs[roomid][key];
	if (value && value[0] === '>') return value.substr(1);
	return false;
}

exports.commands = {
	addfaq: function (target, room, user) {
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (!this.can('declare', null, room)) return false;
		if (!room.chatRoomData) return this.errorReply("This command is unavailable in temporary rooms.");
		let [topic, ...text] = target.split(',');

		topic = toId(topic);
		if (!(topic && text.length)) return this.parse('/help roomfaq');
		text = text.join(',').trim();
		if (topic.length > 25) return this.errorReply("FAQ topics should not exceed 25 characters.");
		if (text.length > 500) return this.errorReply("FAQ entries should not exceed 500 characters.");

		text = text.replace(/^>/, '&gt;');

		let htmltags = text.toLowerCase().match(/<\/?(\w+)\b/g);
		if (htmltags && htmltags.some(val => !ALLOWED_HTML.includes(toId(val)))) {
			let tagList = ALLOWED_HTML.map(tag => `<${tag}>`).join(', ');
			return this.errorReply(`Disallowed HTML tags found. Allowed html tags: ${tagList}`);
		}

		text = this.canHTML(text);
		if (!text) return;

		if (!roomFaqs[room.id]) roomFaqs[room.id] = {};
		roomFaqs[room.id][topic] = text;
		saveRoomFaqs();
		this.sendReplyBox(text);
		this.privateModCommand(`(${user.name} added a FAQ for '${topic}')`);
	},
	removefaq: function (target, room, user) {
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
		this.privateModCommand(`(${user.name} removed the FAQ for '${topic}')`);
	},
	addalias: function (target, room, user) {
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
		this.privateModCommand(`(${user.name} added an alias for '${topic}': ${alias})`);
	},
	rfaq: 'roomfaq',
	roomfaq: function (target, room, user) {
		if (!roomFaqs[room.id]) return this.errorReply("This room has no FAQ topics.");
		let topic = toId(target);
		if (topic === 'constructor') return false;
		if (!topic) return this.sendReplyBox(`List of topics in this room: ${Object.keys(roomFaqs[room.id]).filter(val => !getAlias(room.id, val)).sort((a, b) => a.localeCompare(b)).join(', ')}`);
		if (!roomFaqs[room.id][topic]) return this.errorReply("Invalid topic.");
		topic = getAlias(room.id, topic) || topic;

		if (!this.runBroadcast()) return;
		this.sendReplyBox(roomFaqs[room.id][topic]);
		if (!this.broadcasting && user.can('declare', null, room)) this.sendReplyBox('<code>/addfaq ' + topic + ', ' + Chat.escapeHTML(roomFaqs[room.id][topic]) + '</code>');
	},
	roomfaqhelp: [
		"/roomfaq - Shows the list of all available FAQ topics",
		"/roomfaq <topic> - Shows the FAQ for <topic>.",
		"/addfaq <topic>, <text> - Adds an entry for <topic> in this room or updates it. Requires: # & ~",
		"/addalias <alias>, <topic> - Adds <alias> as an alias for <topic>, displaying it when users use /roomfaq <alias>. Requires: # & ~",
		"/removefaq <topic> - Removes the entry for <topic> in this room. If used on an alias, removes the alias. Requires: # & ~",
	],
};
