/********************************
* EZ-TC Plugin by jd            *
* Makes adding trainer cards EZ *
********************************/
'use strict';

const fs = require('fs');
const serialize = require('node-serialize');
let trainerCards = {};

function loadTrainerCards() {
	try {
		trainerCards = serialize.unserialize(fs.readFileSync('config/trainercards.json', 'utf8'));
		Object.assign(CommandParser.commands, trainerCards);
	} catch (e) {}
}

setTimeout(function load() {
	loadTrainerCards();
}, 1000);

function saveTrainerCards() {
	fs.writeFileSync('config/trainercards.json', serialize.serialize(trainerCards));
	Object.assign(CommandParser.commands, trainerCards);
}

exports.commands = {
	eztc: 'trainercard',
	trainercards: 'trainercard',
	tc: 'trainercard',
	trainercard: function (target, room, user) {
		if (!target) target = 'help';
		let parts = target.split(',');
		for (let u in parts) parts[u] = parts[u].trim();

		switch (parts[0]) {
		case 'add':
			if (!this.can('trainercard')) return false;
			if (!parts[2]) return this.sendReply("Usage: /trainercard add, [command name], [html]");
			let commandName = toId(parts[1]);
			if (CommandParser.commands[commandName]) return this.sendReply("/trainercards - The command \"" + commandName + "\" already exists.");
			let html = parts.splice(2, parts.length).join(',');
			trainerCards[commandName] = new Function('target', 'room', 'user', "if (!room.disableTrainerCards) if (!this.runBroadcast()) return; this.sendReplyBox('" + html.replace(/'/g, "\\'") + "');"); // eslint-disable-line no-new-func
			saveTrainerCards();
			this.sendReply("The trainer card \"" + commandName + "\" has been added.");
			this.logModCommand(user.name + " added the trainer card " + commandName);
			break;

		case 'rem':
		case 'del':
		case 'delete':
		case 'remove':
			if (!this.can('trainercard')) return false;
			if (!parts[1]) return this.sendReply("Usage: /trainercard remove, [command name]");
			let command = toId(parts[1]);
			if (!trainerCards[command]) return this.sendReply("/trainercards - The command \"" + command + "\" does not exist, or was added manually.");
			delete CommandParser.commands[command];
			delete trainerCards[command];
			saveTrainerCards();
			this.sendReply("The trainer card \"" + command + "\" has been removed.");
			this.logModCommand(user.name + " removed the trainer card " + command);
			break;

		case 'list':
			if (!this.can('trainercard')) return false;
			let output = "<b>There's a total of " + Object.keys(trainerCards).length + " trainer cards added with this command:</b><br />";
			for (let tc in trainerCards) {
				output += tc + "<br />";
			}
			this.sendReplyBox(output);
			break;

		case 'off':
			if (!this.can('roommod', null, room)) return false;
			if (room.disableTrainerCards) return this.sendReply("Broadcasting trainer cards is already disabled in this room.");
			room.disableTrainerCards = true;
			room.chatRoomData.disableTrainerCards = true;
			Rooms.global.writeChatRoomData();
			this.privateModCommand("(" + user.name + " has disabled broadcasting trainer cards in this room.)");
			break;

		case 'on':
			if (!this.can('roommod', null, room)) return false;
			if (!room.disableTrainerCards) return this.sendReply("Broadcasing trainer cards is already enabled in this room.");
			delete room.disableTrainerCards;
			delete room.chatRoomData.disableTrainerCards;
			Rooms.global.writeChatRoomData();
			this.privateModCommand("(" + user.name + " has enabled broadcasting trainer cards in this room.)");
			break;

		default:
		case 'info':
		case 'help':
			if (!this.runBroadcast()) return;
			this.sendReplyBox(
				"EZ-TC Commands:<br />" +
				"/trainercard add, [command name], [html] - Adds a trainer card.<br />" +
				"/trainercard remove, [command name] - Removes a trainer card.<br />" +
				"/trainercard list - Shows a list of all trainer cards added with this command.<br />" +
				"/trainercard off - Disables broadcasting trainer cards in the current room.<br />" +
				"/trainercard on - Enables broadcasting trainer cards in the current room.<br />" +
				"/trainercard help - Shows this help command.<br />" +
				"<a href=\"https://gist.github.com/jd4564/399934fce2e9a5ae29ad\">EZ-TC Plugin by jd</a>"
			);
		}
	},
};
