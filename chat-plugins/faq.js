'use strict';

const fs = require('fs');
const path = require('path');

const ROOMFAQ_FILE = path.resolve(__dirname, '../config/chat-plugins/faqs.json');
const ALLOWED_HTML = ['a', 'font', 'i', 'u', 'b'];

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

		let htmltags = text.toLowerCase().match(/<\/?(\w+)\b/g);
		if (htmltags && htmltags.some(val => !ALLOWED_HTML.includes(toId(val)))) {
			let tagList = ALLOWED_HTML.map(tag => `<${tag}>`).join(', ');
			return this.errorReply(`Disallowed HTML tags found. Allowed html tags: ${tagList}`);
		}

		if (!roomFaqs[room.id]) roomFaqs[room.id] = {};
		roomFaqs[room.id][topic] = text;
		saveRoomFaqs();
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
		if (!Object.keys(roomFaqs[room.id]).length) delete roomFaqs[room.id];
		saveRoomFaqs();
		this.privateModCommand(`(${user.name} removed the FAQ for '${topic}')`);
	},
	roomfaq: function (target, room, user) {
		if (!roomFaqs[room.id]) return this.errorReply("This room has no FAQ topics.");
		let topic = toId(target);
		if (topic === 'constructor') return false;
		if (!topic) return this.sendReplyBox(`List of topics in this room: ${Object.keys(roomFaqs[room.id]).join(', ')}`);
		if (!roomFaqs[room.id][topic]) return this.errorReply("Invalid topic.");

		if (!this.runBroadcast()) return;
		return this.sendReplyBox(roomFaqs[room.id][topic]);
	},
	roomfaqhelp: ["/roomfaq - Shows the list of all available FAQ topics",
			  "/roomfaq <topic> - Shows the FAQ for <topic>.",
			  "/addfaq <topic>, <text> - Adds an entry for <topic> in this room or updates it. Requires: # & ~",
			  "/removefaq <topic> - Removes the entry for <topic> in this room. Requires: # & ~"],
};
