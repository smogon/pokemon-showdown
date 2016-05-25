/*
Emoticon plugin
This plugin allows you to use emoticons in both chat rooms (as long as they are enabled in the room) and private messages.
*/
'use strict';

const fs = require('fs');
let emoticons = {'feelsbd': 'http://i.imgur.com/TZvJ1lI.png'};
let emoteRegex = new RegExp('feelsbd', 'g');

function loadEmoticons() {
	try {
		emoticons = JSON.parse(fs.readFileSync('config/emoticons.json', 'utf8'));
		emoteRegex = [];
		for (let emote in emoticons) {
			emoteRegex.push(escapeRegExp(emote));
		}
		emoteRegex = new RegExp('(' + emoteRegex.join('|') + ')', 'g');
	} catch (e) {}
}
loadEmoticons();

function saveEmoticons() {
	fs.writeFileSync('config/emoticons.json', JSON.stringify(emoticons));
	emoteRegex = [];
	for (let emote in emoticons) {
		emoteRegex.push(emote);
	}
	emoteRegex = new RegExp('(' + emoteRegex.join('|') + ')', 'g');
}

function parseEmoticons(user, message) {
	let html = user.charAt(0) + '<button style="border:none;background:none;padding:0;font-family:Verdana,sans-serif;font-size:12px;" name="parseCommand" value="/user ' + toId(user) + '">' + '<b><font color="' + Wisp.hashColor(toId(user)) + '">' + Tools.escapeHTML(user.substr(1)) + ':</font></b></button> ';
	if (emoteRegex.test(message)) {
		message = Tools.escapeHTML(message).replace(emoteRegex, function (match) {
			return '<img src="' + emoticons[match] + '" title="' + emoticons[match] + '" height="32" width="32">';
		});
		return html + message;
	}
	return false;
}
Wisp.parseEmoticons = parseEmoticons;


exports.commands = {
	emoticons: 'emoticon',
	emote: 'emoticon',
	emotes: 'emoticon',
	emoticon: function (target, room, user) {
		if (!target) target = 'help';
		let parts = target.split(',');
		for (let u in parts) parts[u] = parts[u].trim();

		switch (parts[0]) {
		case 'add':
			if (!this.can('emoticons')) return false;
			if (!parts[2]) return this.sendReply("Usage: /emoticon add, [name], [url] - Remember to resize the image first! (recommended 30x30)");
			if (emoticons[parts[1]]) return this.sendReply("\"" + parts[1] + "\" is already an emoticon.");
			emoticons[parts[1]] = parts[2];
			saveEmoticons();
			this.sendReply('|raw|The emoticon "' + Tools.escapeHTML(parts[1]) + '" has been added: <img src="' + parts[2] + '">');
			break;

		case 'delete':
		case 'remove':
		case 'rem':
		case 'del':
			if (!this.can('emoticons')) return false;
			if (!parts[1]) return this.sendReply("Usage: /emoticon del, [name]");
			if (!emoticons[parts[1]]) return this.sendReply("The emoticon \"" + parts[1] + "\" does not exist.");
			delete emoticons[parts[1]];
			saveEmoticons();
			this.sendReply("The emoticon \"" + parts[1] + "\" has been removed.");
			break;

		case 'on':
		case 'enable':
		case 'disable':
		case 'off':
			if (!this.can('roommod', null, room)) return this.sendReply('Access denied.');
			let status = ((parts[0] === 'enable' || parts[0] === 'on') ? true : false);
			if (room.disableEmoticons === status) return this.sendReply("Emoticons are already " + (status ? "enabled" : "disabled") + " in this room.");
			room.disableEmoticons = status;
			room.chatRoomData.disableEmoticons = status;
			Rooms.global.writeChatRoomData();
			this.privateModCommand('(' + user.name + ' ' + (status ? ' enabled ' : ' disabled ') + 'emoticons in this room.)');
			break;

		case 'view':
		case 'list':
			if (!this.runBroadcast()) return;
			let reply = "<b><u>Emoticons (" + Object.keys(emoticons).length + ")</u></b><br />";
			for (let emote in emoticons) reply += "(" + emote + " <img src=\"" + emoticons[emote] + "\" height=\"32\" width=\"32\">) ";
			this.sendReplyBox(reply);
			break;

		default:
		case 'help':
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				"Emoticon Commands:<br />" +
				"<small>/emoticon may be substituted with /emoticons, /emotes, or /emote</small><br />" +
				"/emoticon add, [name], [url] - Adds an emoticon.<br />" +
				"/emoticon del/delete/remove/rem, [name] - Removes an emoticon.<br />" +
				"/emoticon enable/on/disable/off - Enables or disables emoticons in the current room.<br />" +
				"/emoticon view/list - Displays the list of emoticons.<br />" +
				"/emoticon help - Displays this help command.<br />" +
				"<a href=\"https://gist.github.com/jd4564/ef66ecc47c58b3bb06ec\">Emoticon Plugin by: jd</a>"
			);
			break;
		}
	},
};

function escapeRegExp(str) {
	return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
