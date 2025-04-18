/**
 * Emoticons Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Allows users to use emoticons in chat.
 * Originally by: JD, Insist, and Prince Sky
 * Updated for modern Pokemon Showdown by: impulseserver
 */

import {FS, Utils} from '../../lib';

interface Emoticons {
	[key: string]: string;
}

let emoticons: Emoticons = {"feelsbd": "http://i.imgur.com/TZvJ1lI.png"};
let emoteRegex = new RegExp("feelsbd", "g");

try {
	emoticons = JSON.parse(FS("config/emoticons.json").readIfExistsSync() || "{}");
	emoteRegex = new RegExp(
		`(${Object.keys(emoticons).map(escapeRegExp).join('|')})`,
		"g"
	);
} catch (e) {}

function escapeRegExp(str: string): string {
	return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function saveEmoticons(): void {
	FS("config/emoticons.json").writeUpdate(() => JSON.stringify(emoticons));
	emoteRegex = new RegExp(
		`(${Object.keys(emoticons).map(escapeRegExp).join('|')})`,
		"g"
	);
}

function parseEmoticons(message: string, room?: Room): string | false {
	if (!emoteRegex.test(message)) return false;
	
	let size = 50;
	const lobby = Rooms.get('lobby');
	if (lobby?.settings.emoteSize) size = lobby.settings.emoteSize;
	if (room?.settings.emoteSize) size = room.settings.emoteSize;

	// First handle any /html messages differently
	if (message.substr(0, 5) === "/html") {
		let htmlMessage = message.substr(5);
		return htmlMessage.replace(emoteRegex, match => (
			`<img src="${emoticons[match]}" title="${match}" height="${size}" width="${size}">`
		));
	}

	// Handle regular messages - we need to process emoticons before other formatting
	let parsedMessage = Utils.escapeHTML(message).replace(/&#x2f;/g, '/');
	parsedMessage = parsedMessage.replace(emoteRegex, match => (
		`<img src="${emoticons[match]}" title="${match}" height="${size}" width="${size}">`
	));

	// Apply standard message formatting after emoticons
	parsedMessage = parsedMessage.replace(/\_\_([^< ](?:[^<]*?[^< ])?)\\_\\_(?![^<]*?<\/a)/g, '<i>$1</i>'); // italics
	parsedMessage = parsedMessage.replace(/\*\*([^< ](?:[^<]*?[^< ])?)\*\*/g, '<b>$1</b>'); // bold
	parsedMessage = parsedMessage.replace(/\~\~([^< ](?:[^<]*?[^< ])?)\~\~/g, '<strike>$1</strike>'); // strikethrough
	parsedMessage = parsedMessage.replace(/&lt;&lt;([a-z0-9-]+)&gt;&gt;/g, '&laquo;<a href="/$1" target="_blank">$1</a>&raquo;'); // <<roomid>>
	
	
	return parsedMessage;
}

export const commands: Chat.ChatCommands = {
	emoticons: 'emoticon',
	emote: 'emoticon',
	emotes: 'emoticon',
	emoticon: {
		add(target, room, user) {
			this.checkCan('lock');
			if (!target) return this.parse('/help emoticon');

			const [emote, url] = target.split(',').map(part => part.trim());
			if (!emote || !url) return this.parse('/help emoticon');
			
			if (emote.length > 10) {
				throw new Chat.ErrorMessage("Emoticons may not be longer than 10 characters.");
			}
			if (emoticons[emote]) {
				throw new Chat.ErrorMessage("This emoticon already exists.");
			}

			emoticons[emote] = url;
			saveEmoticons();

			this.globalModlog(`EMOTICON ADD`, null, `${emote}: ${url}`);
			this.sendReply(`|raw|The emoticon ${Utils.escapeHTML(emote)} has been added: <img src="${url}" width="50" height="50">`);
		},

		delete: 'remove',
		remove(target, room, user) {
			this.checkCan('lock');
			if (!target) return this.parse('/help emoticon');
			
			const emote = target.trim();
			if (!emoticons[emote]) {
				throw new Chat.ErrorMessage("That emoticon does not exist.");
			}

			delete emoticons[emote];
			saveEmoticons();

			this.globalModlog(`EMOTICON REMOVE`, null, emote);
			this.sendReply(`The emoticon ${emote} has been removed.`);
		},

		toggle(target, room, user) {
			if (!room) return;
			this.checkCan('editroom', null, room);

			if (room.settings.emoteEnabled) {
				delete room.settings.emoteEnabled;
				this.modlog('EMOTICONS', null, 'OFF');
				this.privateModAction(`${user.name} turned off emoticons in this room.`);
			} else {
				room.settings.emoteEnabled = true;
				this.modlog('EMOTICONS', null, 'ON');
				this.privateModAction(`${user.name} turned on emoticons in this room.`);
			}
			room.saveSettings();
		},

		size(target, room, user) {
			if (!room) return;
			this.checkCan('editroom', null, room);
			
			const size = parseInt(target);
			if (isNaN(size) || size < 1 || size > 200) {
				throw new Chat.ErrorMessage("Size must be a number between 1 and 200.");
			}

			room.settings.emoteSize = size;
			room.saveSettings();
			this.modlog('EMOTICONS SIZE', null, '' + size);
			this.privateModAction(`${user.name} set emoticon size in this room to ${size} pixels.`);
		},

		view: 'list',
		list(target, room, user) {
			if (!this.runBroadcast()) return;
			
			let size = 50;
			if (room?.settings.emoteSize) size = room.settings.emoteSize;

			if (this.broadcasting) {
				if (Object.keys(emoticons).length < 1) return this.sendReply("There are no emoticons.");
				let reply = `<strong><u>Emoticons (${Object.keys(emoticons).length})</u></strong><br />`;
				reply += Object.entries(emoticons)
					.map(([emote, url]) => 
						`(${Utils.escapeHTML(emote)} <img src="${url}" height="${size}" width="${size}">)`
					)
					.join(' ');
				this.sendReplyBox(reply);
			} else {
				let reply = `|raw|<div class="infobox infobox-limited">`;
				reply += `<strong><u>Emoticons (${Object.keys(emoticons).length})</u></strong><br />`;
				reply += Object.entries(emoticons)
					.map(([emote, url]) => 
						`(${Utils.escapeHTML(emote)} <img src="${url}" height="${size}" width="${size}">)`
					)
					.join(' ');
				reply += `</div>`;
				this.sendReply(reply);
			}
		},

		'': 'help',
		help(target, room, user) {
			this.parse('/help emoticon');
		},
	},

	emoticonhelp: [
		`Emoticon Commands:`,
		`/emoticon add [name], [url] - Adds an emoticon. Requires: % @ # &`,
		`/emoticon remove [name] - Removes an emoticon. Requires: % @ # &`,
		`/emoticon toggle - Toggles emoticons on/off in the current room. Requires: # &`,
		`/emoticon size [number] - Sets the size of emoticons in the current room. Requires: # &`,
		`/emoticon list - Displays the list of emoticons.`,
		`/emoticon help - Displays this help command.`,
	],
};

// Create a message filter that runs before standard message processing
export const Chat = {
	parseMessage(message: string, room?: Room) {
		if (room?.settings.emoteEnabled === false) return message;
		return parseEmoticons(message, room) || message;
	},
};
