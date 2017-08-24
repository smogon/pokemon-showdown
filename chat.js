/**
 * Chat
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This handles chat and chat commands sent from users to chatrooms
 * and PMs. The main function you're lookoing for is Chat.parse
 * (scroll down to its definition for details)
 *
 * Individual commands are put in:
 *   chat-commands.js - "core" commands that shouldn't be modified
 *   chat-plugins/ - other commands that can be safely modified
 *
 * The command API is (mostly) documented in chat-plugins/COMMANDS.md
 *
 * @license MIT license
 */

/*

To reload chat commands:

/hotpatch chat

*/

'use strict';

const MAX_MESSAGE_LENGTH = 300;

const BROADCAST_COOLDOWN = 20 * 1000;
const MESSAGE_COOLDOWN = 5 * 60 * 1000;

const MAX_PARSE_RECURSION = 10;

const VALID_COMMAND_TOKENS = '/!';
const BROADCAST_TOKEN = '!';

const FS = require('./fs');

let Chat = module.exports;

// Regex copied from the client
const domainRegex = '[a-z0-9\\-]+(?:[.][a-z0-9\\-]+)*';
const parenthesisRegex = '[(](?:[^\\s()<>&]|&amp;)*[)]';
const linkRegex = new RegExp(
	'(?:' +
		'(?:' +
			// When using www. or http://, allow any-length TLD (like .museum)
			'(?:https?://|\\bwww[.])' + domainRegex +
			'|\\b' + domainRegex + '[.]' +
				// Allow a common TLD, or any 2-3 letter TLD followed by : or /
				'(?:com?|org|net|edu|info|us|jp|[a-z]{2,3}(?=[:/]))' +
		')' +
		'(?:[:][0-9]+)?' +
		'\\b' +
		'(?:' +
			'/' +
			'(?:' +
				'(?:' +
					'[^\\s()&<>]|&amp;|&quot;' +
					'|' + parenthesisRegex +
				')*' +
				// URLs usually don't end with punctuation, so don't allow
				// punctuation symbols that probably aren't related to URL.
				'(?:' +
					'[^\\s`()\\[\\]{}\'".,!?;:&<>*_`^~\\\\]' +
					'|' + parenthesisRegex +
				')' +
			')?' +
		')?' +
		'|[a-z0-9.]+\\b@' + domainRegex + '[.][a-z]{2,3}' +
	')' +
	'(?!.*&gt;)',
	'ig'
);
const hyperlinkRegex = new RegExp(`(.+)&lt;(.+)&gt;`, 'i');
// Matches U+FE0F and all Emoji_Presentation characters. More details on
// http://www.unicode.org/Public/emoji/5.0/emoji-data.txt
const emojiRegex = /[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55\uFE0F\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E6}-\u{1F1FF}\u{1F201}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F236}\u{1F238}-\u{1F23A}\u{1F250}\u{1F251}\u{1F300}-\u{1F320}\u{1F32D}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F37E}-\u{1F393}\u{1F3A0}-\u{1F3CA}\u{1F3CF}-\u{1F3D3}\u{1F3E0}-\u{1F3F0}\u{1F3F4}\u{1F3F8}-\u{1F43E}\u{1F440}\u{1F442}-\u{1F4FC}\u{1F4FF}-\u{1F53D}\u{1F54B}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F57A}\u{1F595}\u{1F596}\u{1F5A4}\u{1F5FB}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CC}\u{1F6D0}-\u{1F6D2}\u{1F6EB}\u{1F6EC}\u{1F6F4}-\u{1F6F8}\u{1F910}-\u{1F93A}\u{1F93C}-\u{1F93E}\u{1F940}-\u{1F945}\u{1F947}-\u{1F94C}\u{1F950}-\u{1F96B}\u{1F980}-\u{1F997}\u{1F9C0}\u{1F9D0}-\u{1F9E6}]/u;

const formattingResolvers = [
	{token: "**", resolver: str => `<b>${str}</b>`},
	{token: "__", resolver: str => `<i>${str}</i>`},
	{token: "``", resolver: str => `<code>${str}</code>`},
	{token: "~~", resolver: str => `<s>${str}</s>`},
	{token: "^^", resolver: str => `<sup>${str}</sup>`},
	{token: "\\", resolver: str => `<sub>${str}</sub>`},
	{token: "&lt;&lt;", endToken: "&gt;&gt;", resolver: str => str.replace(/[a-z0-9-]/g, '').length ? false : `&laquo;<a href="${str}" target="_blank">${str}</a>&raquo;`},
	{token: "[[", endToken: "]]", resolver: str => {
		let hl = hyperlinkRegex.exec(str);
		if (hl) return `<a href="${hl[2].trim().replace(/^([a-z]*[^a-z:])/g, 'http://$1')}">${hl[1].trim()}</a>`;

		let query = str;
		let querystr = str;
		let split = str.split(':');
		if (split.length > 1) {
			let opt = toId(split[0]);
			query = split.slice(1).join(':').trim();

			switch (opt) {
			case 'wiki':
			case 'wikipedia':
				return `<a href="http://en.wikipedia.org/w/index.php?title=Special:Search&search=${encodeURIComponent(query)}" target="_blank">${querystr}</a>`;
			case 'yt':
			case 'youtube':
				query += " site:youtube.com";
				querystr = `yt: ${query}`;
				break;
			case 'pokemon':
			case 'item':
				return `<psicon title="${query}" ${opt}="${query}" />`;
			}
		}

		return `<a href="http://www.google.com/search?ie=UTF-8&btnI&q=${encodeURIComponent(query)}" target="_blank">${querystr}</a>`;
	}},
];

class PatternTester {
	// This class sounds like a RegExp
	// In fact, one could in theory implement it as a RegExp subclass
	// However, ES2016 RegExp subclassing is a can of worms, and it wouldn't allow us
	// to tailor the test method for fast command parsing.
	constructor() {
		this.elements = [];
		this.fastElements = new Set();
		this.regexp = null;
	}
	fastNormalize(elem) {
		return elem.slice(0, -1);
	}
	update() {
		const slowElements = this.elements.filter(elem => !this.fastElements.has(this.fastNormalize(elem)));
		if (slowElements.length) {
			this.regexp = new RegExp('^(' + slowElements.map(elem => '(?:' + elem + ')').join('|') + ')', 'i');
		}
	}
	register(...elems) {
		for (let elem of elems) {
			this.elements.push(elem);
			if (/^[^ ^$?|()[\]]+ $/.test(elem)) {
				this.fastElements.add(this.fastNormalize(elem));
			}
		}
		this.update();
	}
	test(text) {
		const spaceIndex = text.indexOf(' ');
		if (this.fastElements.has(spaceIndex >= 0 ? text.slice(0, spaceIndex) : text)) {
			return true;
		}
		if (!this.regexp) return false;
		return this.regexp.test(text);
	}
}

Chat.multiLinePattern = new PatternTester();

/*********************************************************
 * Load command files
 *********************************************************/

Chat.baseCommands = undefined;
Chat.commands = undefined;

/*********************************************************
 * Parser
 *********************************************************/

class CommandContext {
	constructor(options) {
		this.message = options.message || ``;
		this.recursionDepth = 0;

		// message context
		this.room = options.room;
		this.user = options.user;
		this.connection = options.connection;
		this.pmTarget = options.pmTarget;

		// command context
		this.cmd = options.cmd || '';
		this.cmdToken = options.cmdToken || '';
		this.target = options.target || ``;
		this.fullCmd = options.fullCmd || '';

		// target user
		this.targetUser = null;
		this.targetUsername = "";
		this.inputUsername = "";
	}

	parse(message) {
		if (message) {
			// spawn subcontext
			let subcontext = new CommandContext(this);
			subcontext.recursionDepth++;
			if (subcontext.recursionDepth > MAX_PARSE_RECURSION) {
				throw new Error("Too much command recursion");
			}
			subcontext.message = message;
			return subcontext.parse();
		}
		message = this.message;

		let originalRoom = this.room;
		if (this.room && !(this.user.userid in this.room.users)) {
			this.room = Rooms.global;
		}

		let commandHandler = this.splitCommand(message);

		if (typeof commandHandler === 'function') {
			message = this.run(commandHandler);
		} else {
			if (commandHandler === '!') {
				if (originalRoom === Rooms.global) {
					return this.popupReply(`You tried use "${message}" as a global command, but it is not a global command.`);
				} else if (originalRoom) {
					return this.popupReply(`You tried to send "${message}" to the room "${originalRoom.id}" but it failed because you were not in that room.`);
				}
				return this.errorReply(`The command "${this.cmdToken}${this.fullCmd}" is unavailable in private messages. To send a message starting with "${this.cmdToken}${this.fullCmd}", type "${this.cmdToken}${this.cmdToken}${this.fullCmd}".`);
			}
			if (this.cmdToken) {
				// To guard against command typos, show an error message
				if (this.cmdToken === BROADCAST_TOKEN) {
					if (/[a-z0-9]/.test(this.cmd.charAt(0))) {
						return this.errorReply(`The command "${this.cmdToken}${this.fullCmd}" does not exist.`);
					}
				} else {
					return this.errorReply(`The command "${this.cmdToken}${this.fullCmd}" does not exist. To send a message starting with "${this.cmdToken}${this.fullCmd}", type "${this.cmdToken}${this.cmdToken}${this.fullCmd}".`);
				}
			} else if (!VALID_COMMAND_TOKENS.includes(message.charAt(0)) && VALID_COMMAND_TOKENS.includes(message.trim().charAt(0))) {
				message = message.trim();
				if (message.charAt(0) !== BROADCAST_TOKEN) {
					message = message.charAt(0) + message;
				}
			}

			message = this.canTalk(message);
		}

		// Output the message

		if (message && message !== true && typeof message.then !== 'function') {
			if (this.pmTarget) {
				let buf = `|pm|${this.user.getIdentity()}|${this.pmTarget.getIdentity()}|${message}`;
				this.user.send(buf);
				if (this.pmTarget !== this.user) this.pmTarget.send(buf);

				this.pmTarget.lastPM = this.user.userid;
				this.user.lastPM = this.pmTarget.userid;
			} else {
				this.room.add(`|c|${this.user.getIdentity(this.room.id)}|${message}`);
			}
		}

		this.update();

		return message;
	}
	splitCommand(message = this.message, recursing) {
		this.cmd = '';
		this.cmdToken = '';
		this.target = '';
		if (!message || !message.trim().length) return;

		// hardcoded commands
		if (message.startsWith(`>> `)) {
			message = `/eval ${message.slice(3)}`;
		} else if (message.startsWith(`>>> `)) {
			message = `/evalbattle ${message.slice(4)}`;
		} else if (message.startsWith(`/me`) && /[^A-Za-z0-9 ]/.test(message.charAt(3))) {
			message = `/mee ${message.slice(3)}`;
		} else if (message.startsWith(`/ME`) && /[^A-Za-z0-9 ]/.test(message.charAt(3))) {
			message = `/MEE ${message.slice(3)}`;
		}

		let cmdToken = message.charAt(0);
		if (!VALID_COMMAND_TOKENS.includes(cmdToken)) return;
		if (cmdToken === message.charAt(1)) return;
		if (cmdToken === BROADCAST_TOKEN && /[^A-Za-z0-9]/.test(message.charAt(1))) return;

		let cmd = '', target = '';

		let spaceIndex = message.indexOf(' ');
		if (spaceIndex > 0) {
			cmd = message.slice(1, spaceIndex).toLowerCase();
			target = message.slice(spaceIndex + 1);
		} else {
			cmd = message.slice(1).toLowerCase();
			target = '';
		}

		let curCommands = Chat.commands;
		let commandHandler;
		let fullCmd = cmd;

		do {
			if (curCommands.hasOwnProperty(cmd)) {
				commandHandler = curCommands[cmd];
			} else {
				commandHandler = undefined;
			}
			if (typeof commandHandler === 'string') {
				// in case someone messed up, don't loop
				commandHandler = curCommands[commandHandler];
			} else if (Array.isArray(commandHandler) && !recursing) {
				return this.splitCommand(cmdToken + 'help ' + fullCmd.slice(0, -4), true);
			}
			if (commandHandler && typeof commandHandler === 'object') {
				let spaceIndex = target.indexOf(' ');
				if (spaceIndex > 0) {
					cmd = target.substr(0, spaceIndex).toLowerCase();
					target = target.substr(spaceIndex + 1);
				} else {
					cmd = target.toLowerCase();
					target = '';
				}

				fullCmd += ' ' + cmd;
				curCommands = commandHandler;
			}
		} while (commandHandler && typeof commandHandler === 'object');

		if (!commandHandler && curCommands.default) {
			commandHandler = curCommands.default;
			if (typeof commandHandler === 'string') {
				commandHandler = curCommands[commandHandler];
			}
		}

		if (!commandHandler && !recursing) {
			for (let g in Config.groups) {
				let groupid = Config.groups[g].id;
				target = toId(target);
				if (cmd === groupid) {
					return this.splitCommand(`/promote ${target}, ${g}`, true);
				} else if (cmd === 'global' + groupid) {
					return this.splitCommand(`/globalpromote ${target}, ${g}`, true);
				} else if (cmd === 'de' + groupid || cmd === 'un' + groupid || cmd === 'globalde' + groupid || cmd === 'deglobal' + groupid) {
					return this.splitCommand(`/demote ${target}`, true);
				} else if (cmd === 'room' + groupid) {
					return this.splitCommand(`/roompromote ${target}, ${g}`, true);
				} else if (cmd === 'roomde' + groupid || cmd === 'deroom' + groupid || cmd === 'roomun' + groupid) {
					return this.splitCommand(`/roomdemote ${target}`, true);
				}
			}
		}

		this.cmd = cmd;
		this.cmdToken = cmdToken;
		this.target = target;
		this.fullCmd = fullCmd;

		if (typeof commandHandler === 'function' && (this.pmTarget || this.room === Rooms.global)) {
			if (!curCommands['!' + (typeof curCommands[cmd] === 'string' ? curCommands[cmd] : cmd)]) {
				return '!';
			}
		}

		return commandHandler;
	}
	run(commandHandler) {
		if (typeof commandHandler === 'string') commandHandler = Chat.commands[commandHandler];
		let result;
		try {
			result = commandHandler.call(this, this.target, this.room, this.user, this.connection, this.cmd, this.message);
		} catch (err) {
			require('./crashlogger')(err, 'A chat command', {
				user: this.user.name,
				room: this.room && this.room.id,
				pmTarget: this.pmTarget && this.pmTarget.name,
				message: this.message,
			});
			Rooms.global.reportCrash(err);
			this.sendReply(`|html|<div class="broadcast-red"><b>Pokemon Showdown crashed!</b><br />Don't worry, we're working on fixing it.</div>`);
		}
		if (result === undefined) result = false;

		return result;
	}

	checkFormat(room, user, message) {
		if (!room) return true;
		if (!room.filterStretching && !room.filterCaps && !room.filterEmojis) return true;
		if (user.can('bypassall')) return true;

		if (room.filterStretching && user.name.match(/(.+?)\1{5,}/i)) {
			return this.errorReply(`Your username contains too much stretching, which this room doesn't allow.`);
		}
		if (room.filterCaps && user.name.match(/[A-Z\s]{6,}/)) {
			return this.errorReply(`Your username contains too many capital letters, which this room doesn't allow.`);
		}
		if (room.filterEmojis && user.name.match(emojiRegex)) {
			return this.errorReply(`Your username contains emojis, which this room doesn't allow.`);
		}
		// Removes extra spaces and null characters
		message = message.trim().replace(/[ \u0000\u200B-\u200F]+/g, ' ');

		if (room.filterStretching && message.match(/(.+?)\1{7,}/i)) {
			return this.errorReply(`Your message contains too much stretching, which this room doesn't allow.`);
		}
		if (room.filterCaps && message.match(/[A-Z\s]{18,}/)) {
			return this.errorReply(`Your message contains too many capital letters, which this room doesn't allow.`);
		}
		if (room.filterEmojis && message.match(emojiRegex)) {
			return this.errorReply(`Your message contains emojis, which this room doesn't allow.`);
		}

		return true;
	}

	checkSlowchat(room, user) {
		if (!room || !room.slowchat) return true;
		let lastActiveSeconds = (Date.now() - user.lastMessageTime) / 1000;
		if (lastActiveSeconds < room.slowchat) return false;
		return true;
	}

	checkBanwords(room, message) {
		if (!room) return true;
		if (!room.banwordRegex) {
			if (room.banwords && room.banwords.length) {
				room.banwordRegex = new RegExp('(?:\\b|(?!\\w))(?:' + room.banwords.join('|') + ')(?:\\b|\\B(?!\\w))', 'i');
			} else {
				room.banwordRegex = true;
			}
		}
		if (!message) return true;
		if (room.banwordRegex !== true && room.banwordRegex.test(message)) {
			return false;
		}
		return true;
	}
	checkGameFilter() {
		if (!this.room || !this.room.game || !this.room.game.onChatMessage) return false;
		return this.room.game.onChatMessage(this.message);
	}
	pmTransform(message) {
		let prefix = `|pm|${this.user.getIdentity()}|${this.pmTarget.getIdentity()}|`;
		return message.split('\n').map(message => {
			if (message.startsWith('||')) {
				return prefix + '/text ' + message.slice(2);
			} else if (message.startsWith('|html|')) {
				return prefix + '/raw ' + message.slice(6);
			} else if (message.startsWith('|raw|')) {
				return prefix + '/raw ' + message.slice(5);
			} else if (message.startsWith('|c~|')) {
				return prefix + message.slice(4);
			} else if (message.startsWith('|c|~|/')) {
				return prefix + message.slice(5);
			}
			return prefix + '/text ' + message;
		}).join('\n');
	}
	sendReply(data) {
		if (this.broadcasting) {
			// broadcasting
			if (this.pmTarget) {
				data = this.pmTransform(data);
				this.user.send(data);
				if (this.pmTarget !== this.user) this.pmTarget.send(data);
			} else {
				this.room.add(data);
			}
		} else {
			// not broadcasting
			if (this.pmTarget) {
				data = this.pmTransform(data);
				this.connection.send(data);
			} else {
				this.connection.sendTo(this.room, data);
			}
		}
	}
	errorReply(message) {
		if (this.pmTarget) {
			let prefix = '|pm|' + this.user.getIdentity() + '|' + this.pmTarget.getIdentity() + '|/error ';
			this.connection.send(prefix + message.replace(/\n/g, prefix));
		} else {
			this.sendReply('|html|<div class="message-error">' + Chat.escapeHTML(message).replace(/\n/g, '<br />') + '</div>');
		}
	}
	addBox(html) {
		this.add('|html|<div class="infobox">' + html + '</div>');
	}
	sendReplyBox(html) {
		this.sendReply('|html|<div class="infobox">' + html + '</div>');
	}
	popupReply(message) {
		this.connection.popup(message);
	}
	add(data) {
		if (this.pmTarget) {
			data = this.pmTransform(data);
			this.user.send(data);
			if (this.pmTarget !== this.user) this.pmTarget.send(data);
			return;
		}
		this.room.add(data);
	}
	send(data) {
		if (this.pmTarget) {
			data = this.pmTransform(data);
			this.user.send(data);
			if (this.pmTarget !== this.user) this.pmTarget.send(data);
			return;
		}
		this.room.send(data);
	}
	sendModCommand(data) {
		this.room.sendModCommand(data);
	}
	privateModCommand(data) {
		this.room.sendModCommand(data);
		this.logEntry(data);
		this.room.modlog(data);
	}
	globalModlog(action, user, text) {
		let buf = "(" + this.room.id + ") " + action + ": ";
		if (typeof user === 'string') {
			buf += "[" + toId(user) + "]";
		} else {
			let userid = user.getLastId();
			buf += "[" + userid + "]";
			if (user.autoconfirmed && user.autoconfirmed !== userid) buf += " ac:[" + user.autoconfirmed + "]";
		}
		buf += text;
		Rooms.global.modlog(buf);
	}
	logEntry(data) {
		if (this.pmTarget) return;
		this.room.logEntry(data);
	}
	addModCommand(text, logOnlyText) {
		this.room.addLogMessage(this.user, text);
		this.room.modlog(text + (logOnlyText || ""));
	}
	logModCommand(text) {
		this.room.modlog(text);
	}
	update() {
		if (this.room) this.room.update();
	}
	can(permission, target, room) {
		if (!this.user.can(permission, target, room)) {
			this.errorReply(this.cmdToken + this.fullCmd + " - Access denied.");
			return false;
		}
		return true;
	}
	canBroadcast(suppressMessage) {
		if (!this.broadcasting && this.cmdToken === BROADCAST_TOKEN) {
			let message = this.canTalk(suppressMessage || this.message);
			if (!message) return false;
			if (!this.pmTarget && !this.user.can('broadcast', null, this.room)) {
				this.errorReply("You need to be voiced to broadcast this command's information.");
				this.errorReply("To see it for yourself, use: /" + this.message.substr(1));
				return false;
			}

			// broadcast cooldown
			let broadcastMessage = message.toLowerCase().replace(/[^a-z0-9\s!,]/g, '');

			if (this.room && this.room.lastBroadcast === this.broadcastMessage &&
					this.room.lastBroadcastTime >= Date.now() - BROADCAST_COOLDOWN) {
				this.errorReply("You can't broadcast this because it was just broadcasted.");
				return false;
			}

			this.message = message;
			this.broadcastMessage = broadcastMessage;
		}
		return true;
	}
	runBroadcast(suppressMessage) {
		if (this.broadcasting || this.cmdToken !== BROADCAST_TOKEN) {
			// Already being broadcast, or the user doesn't intend to broadcast.
			return true;
		}

		if (!this.broadcastMessage) {
			// Permission hasn't been checked yet. Do it now.
			if (!this.canBroadcast(suppressMessage)) return false;
		}

		if (this.pmTarget) {
			this.add('|c~|' + (suppressMessage || this.message));
		} else {
			this.add('|c|' + this.user.getIdentity(this.room.id) + '|' + (suppressMessage || this.message));
		}
		if (!this.pmTarget) {
			this.room.lastBroadcast = this.broadcastMessage;
			this.room.lastBroadcastTime = Date.now();
		}

		this.broadcasting = true;

		return true;
	}
	canTalk(message, room, targetUser) {
		if (room === undefined) room = this.room;
		if (targetUser === undefined && this.pmTarget) {
			room = undefined;
			targetUser = this.pmTarget;
		}
		let user = this.user;
		let connection = this.connection;

		if (room && room.id === 'global') {
			// should never happen
			// console.log(`Command tried to write to global: ${user.name}: ${message}`);
			return false;
		}
		if (!user.named) {
			connection.popup(`You must choose a name before you can talk.`);
			return false;
		}
		if (!user.can('bypassall')) {
			let lockType = (user.namelocked ? `namelocked` : user.locked ? `locked` : ``);
			let lockExpiration = Punishments.checkLockExpiration(user.namelocked || user.locked);
			if (room) {
				if (lockType) {
					this.errorReply(`You are ${lockType} and can't talk in chat. ${lockExpiration}`);
					return false;
				}
				if (room.isMuted(user)) {
					this.errorReply(`You are muted and cannot talk in this room.`);
					return false;
				}
				if (room.modchat && !user.authAtLeast(room.modchat, room)) {
					if (room.modchat === 'autoconfirmed') {
						this.errorReply(`Because moderated chat is set, your account must be at least one week old and you must have won at least one ladder game to speak in this room.`);
						return false;
					}
					const groupName = Config.groups[room.modchat] && Config.groups[room.modchat].name || room.modchat;
					this.errorReply(`Because moderated chat is set, you must be of rank ${groupName} or higher to speak in this room.`);
					return false;
				}
				if (!(user.userid in room.users)) {
					connection.popup("You can't send a message to this room without being in it.");
					return false;
				}
			}
			if (targetUser) {
				if (lockType && !targetUser.can('lock')) {
					return this.errorReply(`You are ${lockType} and can only private message members of the global moderation team (users marked by @ or above in the Help room). ${lockExpiration}`);
				}
				if (targetUser.locked && !user.can('lock')) {
					return this.errorReply(`The user "${targetUser.name}" is locked and cannot be PMed.`);
				}
				if (Config.pmmodchat && !user.authAtLeast(Config.pmmodchat) && !targetUser.canPromote(user.group, Config.pmmodchat)) {
					let groupName = Config.groups[Config.pmmodchat] && Config.groups[Config.pmmodchat].name || Config.pmmodchat;
					return this.errorReply(`On this server, you must be of rank ${groupName} or higher to PM users.`);
				}
				if (targetUser.ignorePMs && targetUser.ignorePMs !== user.group && !user.can('lock')) {
					if (!targetUser.can('lock')) {
						return this.errorReply(`This user is blocking private messages right now.`);
					} else if (targetUser.can('bypassall')) {
						return this.errorReply(`This admin is too busy to answer private messages right now. Please contact a different staff member.`);
					}
				}
				if (user.ignorePMs && user.ignorePMs !== targetUser.group && !targetUser.can('lock')) {
					return this.errorReply(`You are blocking private messages right now.`);
				}
			}
		}

		if (typeof message === 'string') {
			if (!message) {
				connection.popup("Your message can't be blank.");
				return false;
			}
			let length = message.length;
			length += 10 * message.replace(/[^\ufdfd]*/g, '').length;
			if (length > MAX_MESSAGE_LENGTH && !user.can('ignorelimits')) {
				this.errorReply("Your message is too long: " + message);
				return false;
			}

			// remove zalgo
			message = message.replace(/[\u0300-\u036f\u0483-\u0489\u0610-\u0615\u064B-\u065F\u0670\u06D6-\u06DC\u06DF-\u06ED\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g, '');
			if (/[\u239b-\u23b9]/.test(message)) {
				this.errorReply("Your message contains banned characters.");
				return false;
			}

			if (!this.checkFormat(room, user, message)) {
				return false;
			}

			if (!this.checkSlowchat(room, user) && !user.can('mute', null, room)) {
				this.errorReply("This room has slow-chat enabled. You can only talk once every " + room.slowchat + " seconds.");
				return false;
			}

			if (!this.checkBanwords(room, user.name) && !user.can('bypassall')) {
				this.errorReply(`Your username contains a phrase banned by this room.`);
				return false;
			}
			if (!this.checkBanwords(room, message) && !user.can('mute', null, room)) {
				this.errorReply("Your message contained banned words.");
				return false;
			}

			let gameFilter = this.checkGameFilter();
			if (gameFilter && !user.can('bypassall')) {
				this.errorReply(gameFilter);
				return false;
			}

			if (room) {
				let normalized = message.trim();
				if ((room.id === 'lobby' || room.id === 'help') && (normalized === user.lastMessage) &&
						((Date.now() - user.lastMessageTime) < MESSAGE_COOLDOWN)) {
					this.errorReply("You can't send the same message again so soon.");
					return false;
				}
				user.lastMessage = message;
				user.lastMessageTime = Date.now();
			}

			if (Config.chatfilter) {
				return Config.chatfilter.call(this, message, user, room, connection, targetUser);
			}
			return message;
		}

		return true;
	}
	canEmbedURI(uri, isRelative) {
		if (uri.startsWith('https://')) return uri;
		if (uri.startsWith('//')) return uri;
		if (uri.startsWith('data:')) return uri;
		if (!uri.startsWith('http://')) {
			if (/^[a-z]+:\/\//.test(uri) || isRelative) {
				return this.errorReply("URIs must begin with 'https://' or 'http://' or 'data:'");
			}
		} else {
			uri = uri.slice(7);
		}
		let slashIndex = uri.indexOf('/');
		let domain = (slashIndex >= 0 ? uri.slice(0, slashIndex) : uri);

		// heuristic that works for all the domains we care about
		let secondLastDotIndex = domain.lastIndexOf('.', domain.length - 5);
		if (secondLastDotIndex >= 0) domain = domain.slice(secondLastDotIndex + 1);

		let approvedDomains = {
			'imgur.com': 1,
			'gyazo.com': 1,
			'puu.sh': 1,
			'rotmgtool.com': 1,
			'pokemonshowdown.com': 1,
			'nocookie.net': 1,
			'blogspot.com': 1,
			'imageshack.us': 1,
			'deviantart.net': 1,
			'd.pr': 1,
			'pokefans.net': 1,
		};
		if (domain in approvedDomains) {
			return '//' + uri;
		}
		if (domain === 'bit.ly') {
			return this.errorReply("Please don't use URL shorteners.");
		}
		// unknown URI, allow HTTP to be safe
		return 'http://' + uri;
	}
	canHTML(html) {
		html = ('' + (html || '')).trim();
		if (!html) return '';
		let images = /<img\b[^<>]*/ig;
		let match;
		while ((match = images.exec(html))) {
			if (this.room.isPersonal && !this.user.can('announce')) {
				this.errorReply("Images are not allowed in personal rooms.");
				return false;
			}
			if (!/width=([0-9]+|"[0-9]+")/i.test(match[0]) || !/height=([0-9]+|"[0-9]+")/i.test(match[0])) {
				// Width and height are required because most browsers insert the
				// <img> element before width and height are known, and when the
				// image is loaded, this changes the height of the chat area, which
				// messes up autoscrolling.
				this.errorReply('All images must have a width and height attribute');
				return false;
			}
			let srcMatch = /src\s*=\s*"?([^ "]+)(\s*")?/i.exec(match[0]);
			if (srcMatch) {
				let uri = this.canEmbedURI(srcMatch[1], true);
				if (!uri) return false;
				html = html.slice(0, match.index + srcMatch.index) + 'src="' + uri + '"' + html.slice(match.index + srcMatch.index + srcMatch[0].length);
				// lastIndex is inaccurate since html was changed
				images.lastIndex = match.index + 11;
			}
		}
		if ((this.room.isPersonal || this.room.isPrivate === true) && !this.user.can('lock') && html.replace(/\s*style\s*=\s*"?[^"]*"\s*>/g, '>').match(/<button[^>]/)) {
			this.errorReply('You do not have permission to use scripted buttons in HTML.');
			this.errorReply('If you just want to link to a room, you can do this: <a href="/roomid"><button>button contents</button></a>');
			return false;
		}
		if (/>here.?</i.test(html) || /click here/i.test(html)) {
			this.errorReply('Do not use "click here"');
			return false;
		}

		// check for mismatched tags
		let tags = html.toLowerCase().match(/<\/?(div|a|button|b|strong|em|i|u|center|font|marquee|blink|details|summary|code|table|td|tr)\b/g);
		if (tags) {
			let stack = [];
			for (let i = 0; i < tags.length; i++) {
				let tag = tags[i];
				if (tag.charAt(1) === '/') {
					if (!stack.length) {
						this.errorReply("Extraneous </" + tag.substr(2) + "> without an opening tag.");
						return false;
					}
					if (tag.substr(2) !== stack.pop()) {
						this.errorReply("Missing </" + tag.substr(2) + "> or it's in the wrong place.");
						return false;
					}
				} else {
					stack.push(tag.substr(1));
				}
			}
			if (stack.length) {
				this.errorReply("Missing </" + stack.pop() + ">.");
				return false;
			}
		}

		return html;
	}
	targetUserOrSelf(target, exactName) {
		if (!target) {
			this.targetUsername = this.user.name;
			this.inputUsername = this.user.name;
			return this.user;
		}
		this.splitTarget(target, exactName);
		return this.targetUser;
	}
	splitOne(target) {
		let commaIndex = target.indexOf(',');
		if (commaIndex < 0) {
			return [target, ''];
		}
		return [target.substr(0, commaIndex), target.substr(commaIndex + 1).trim()];
	}
	splitTarget(target, exactName) {
		let [name, rest] = this.splitOne(target);

		this.targetUser = Users.get(name, exactName);
		this.inputUsername = name.trim();
		this.targetUsername = this.targetUser ? this.targetUser.name : this.inputUsername;
		return rest;
	}
	splitTargetText(target) {
		let [first, rest] = this.splitOne(target);

		this.targetUsername = first.trim();
		return rest.trim();
	}
}
Chat.CommandContext = CommandContext;

/**
 * Command parser
 *
 * Usage:
 *   Chat.parse(message, room, user, connection)
 *
 * Parses the message. If it's a command, the command is executed, if
 * not, it's displayed directly in the room.
 *
 * Examples:
 *   Chat.parse("/join lobby", room, user, connection)
 *     will make the user join the lobby.
 *
 *   Chat.parse("Hi, guys!", room, user, connection)
 *     will return "Hi, guys!" if the user isn't muted, or
 *     if he's muted, will warn him that he's muted.
 *
 * The return value is the return value of the command handler, if any,
 * or the message, if there wasn't a command. This value could be a success
 * or failure (few commands report these) or a Promise for when the command
 * is done executing, if it's not currently done.
 *
 * @param {string} message - the message the user is trying to say
 * @param {Room} room - the room the user is trying to say it in
 * @param {User} user - the user that sent the message
 * @param {Connection} connection - the connection the user sent the message from
 */
Chat.parse = function (message, room, user, connection) {
	Chat.loadCommands();
	let context = new CommandContext({message, room, user, connection});

	return context.parse();
};

Chat.package = {};

Chat.uncacheTree = function (root) {
	let uncache = [require.resolve(root)];
	do {
		let newuncache = [];
		for (let i = 0; i < uncache.length; ++i) {
			if (require.cache[uncache[i]]) {
				newuncache.push.apply(newuncache,
					require.cache[uncache[i]].children
						.filter(cachedModule => !cachedModule.id.endsWith('.node'))
						.map(cachedModule => cachedModule.id)
				);
				delete require.cache[uncache[i]];
			}
		}
		uncache = newuncache;
	} while (uncache.length > 0);
};

Chat.loadCommands = function () {
	if (Chat.commands) return;

	FS('package.json').readTextIfExists().then(data => {
		if (data) Chat.package = JSON.parse(data);
	});

	let baseCommands = Chat.baseCommands = require('./chat-commands').commands;
	let commands = Chat.commands = Object.assign({}, baseCommands);

	// Install plug-in commands

	// info always goes first so other plugins can shadow it
	Object.assign(commands, require('./chat-plugins/info').commands);

	for (let file of FS('chat-plugins/').readdirSync()) {
		if (file.substr(-3) !== '.js' || file === 'info.js') continue;
		Object.assign(commands, require('./chat-plugins/' + file).commands);
	}
};

/**
 * Escapes HTML in a string.
 *
 * @param  {string} str
 * @return {string}
 */
Chat.escapeHTML = function (str) {
	if (!str) return '';
	return ('' + str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;').replace(/\//g, '&#x2f;');
};

/**
 * Strips HTML from a string.
 *
 * @param {string} html
 * @return {string}
 */
Chat.stripHTML = function (html) {
	if (!html) return '';
	return html.replace(/<[^>]*>/g, '');
};

/**
 * Template string tag function for escaping HTML
 *
 * @param  {string[]} strings
 * @param  {...any} values
 * @return {string}
 */
Chat.html = function (strings, ...args) {
	let buf = strings[0];
	let i = 0;
	while (i < args.length) {
		buf += Chat.escapeHTML(args[i]);
		buf += strings[++i];
	}
	return buf;
};

/**
 * Returns singular (defaulting to '') if num is 1, or plural
 * (defaulting to 's') otherwise. Helper function for pluralizing
 * words.
 *
 * @param  {any} num
 * @param  {?string} plural
 * @param  {?string} singular
 * @return {string}
 */
Chat.plural = function (num, plural = 's', singular = '') {
	if (num && typeof num.length === 'number') {
		num = num.length;
	} else if (num && typeof num.size === 'number') {
		num = num.size;
	} else {
		num = Number(num);
	}
	return (num !== 1 ? plural : singular);
};

/**
 * Returns a timestamp in the form {yyyy}-{MM}-{dd} {hh}:{mm}:{ss}.
 *
 * options.hour12 = true will reports hours in mod-12 format.
 *
 * @param  {Date} date
 * @param  {object} options
 * @return {string}
 */
Chat.toTimestamp = function (date, options) {
	const isHour12 = options && options.hour12;
	let parts = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
	if (isHour12) {
		parts.push(parts[3] >= 12 ? 'pm' : 'am');
		parts[3] = parts[3] % 12 || 12;
	}
	parts = parts.map(val => val < 10 ? '0' + val : '' + val);
	return parts.slice(0, 3).join("-") + " " + parts.slice(3, 6).join(":") + (isHour12 ? " " + parts[6] : "");
};

/**
 * Takes a number of milliseconds, and reports the duration in English: hours, minutes, etc.
 *
 * options.hhmmss = true will instead report the duration in 00:00:00 format
 *
 * @param  {number} number
 * @param  {object} options
 * @return {string}
 */
Chat.toDurationString = function (number, options) {
	// TODO: replace by Intl.DurationFormat or equivalent when it becomes available (ECMA-402)
	// https://github.com/tc39/ecma402/issues/47
	const date = new Date(+number);
	const parts = [date.getUTCFullYear() - 1970, date.getUTCMonth(), date.getUTCDate() - 1, date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds()];
	const roundingBoundaries = [6, 15, 12, 30, 30];
	const unitNames = ["second", "minute", "hour", "day", "month", "year"];
	const positiveIndex = parts.findIndex(elem => elem > 0);
	const precision = (options && options.precision ? options.precision : parts.length);
	if (options && options.hhmmss) {
		let string = parts.slice(positiveIndex).map(value => value < 10 ? "0" + value : "" + value).join(":");
		return string.length === 2 ? "00:" + string : string;
	}
	// round least significant displayed unit
	if (positiveIndex + precision < parts.length && precision > 0 && positiveIndex >= 0) {
		if (parts[positiveIndex + precision] >= roundingBoundaries[positiveIndex + precision - 1]) {
			parts[positiveIndex + precision - 1]++;
		}
	}
	return parts.slice(positiveIndex).reverse().map((value, index) => value ? value + " " + unitNames[index] + (value > 1 ? "s" : "") : "").reverse().slice(0, precision).join(" ").trim();
};

/**
 * Takes a string and converts it to HTML by replacing standard chat formatting with the appropriate HTML tags.
 *
 * @param  {string} str
 * @return {string}
 */
Chat.parseText = function (str) {
	str = Chat.escapeHTML(str).replace(/&#x2f;/g, '/').replace(linkRegex, uri => `<a href=${uri.replace(/^([a-z]*[^a-z:])/g, 'http://$1')}>${uri}</a>`);

	let output = [''];
	let stack = [];

	let parse = true;

	let i = 0;
	mainLoop: while (i < str.length) {
		let token = str[i];

		// Hardcoded parsing
		if (parse && token === '`' && str.substr(i, 2) === '``') {
			stack.push('``');
			output.push('');
			parse = false;
			i += 2;
			continue;
		}

		for (let f = 0; f < formattingResolvers.length; f++) {
			let start = formattingResolvers[f].token;
			let end = formattingResolvers[f].endToken || start;

			if (stack.length && end.startsWith(token) && str.substr(i, end.length) === end && output[stack.length].replace(token, '').length) {
				for (let j = stack.length - 1; j >= 0; j--) {
					if (stack[j] === start) {
						parse = true;

						while (stack.length > j + 1) {
							output[stack.length - 1] += stack.pop() + output.pop();
						}

						let str = output.pop();
						let outstr = formattingResolvers[f].resolver(str.trim());
						if (!outstr) outstr = `${start}${str}${end}`;
						output[stack.length - 1] += outstr;
						i += end.length;
						stack.pop();
						continue mainLoop;
					}
				}
			}

			if (parse && start.startsWith(token) && str.substr(i, start.length) === start) {
				stack.push(start);
				output.push('');
				i += start.length;
				continue mainLoop;
			}
		}

		output[stack.length] += token;
		i++;
	}

	while (stack.length) {
		output[stack.length - 1] += stack.pop() + output.pop();
	}

	let result = output[0];

	return result;
};

/**
 * Takes an array and turns it into a sentence string by adding commas and the word 'and' at the end
 *
 * @param  {array} array
 * @return {string}
 */
Chat.toListString = function (array) {
	if (!array.length) return '';
	if (array.length === 1) return array[0];
	return `${array.slice(0, -1).join(", ")} and ${array.slice(-1)}`;
};

Chat.getDataPokemonHTML = function (template, gen = 7) {
	if (typeof template === 'string') template = Object.assign({}, Dex.getTemplate(template));
	let buf = '<li class="result">';
	buf += '<span class="col numcol">' + (template.tier) + '</span> ';
	buf += `<span class="col iconcol"><psicon pokemon="${template.id}"/></span> `;
	buf += '<span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://pokemonshowdown.com/dex/pokemon/' + template.id + '" target="_blank">' + template.species + '</a></span> ';
	buf += '<span class="col typecol">';
	if (template.types) {
		for (let i = 0; i < template.types.length; i++) {
			buf += `<img src="https://play.pokemonshowdown.com/sprites/types/${template.types[i]}.png" alt="${template.types[i]}" height="14" width="32">`;
		}
	}
	buf += '</span> ';
	if (gen >= 3) {
		buf += '<span style="float:left;min-height:26px">';
		if (template.abilities['1'] && (gen >= 4 || Dex.getAbility(template.abilities['1']).gen === 3)) {
			buf += '<span class="col twoabilitycol">' + template.abilities['0'] + '<br />' + template.abilities['1'] + '</span>';
		} else {
			buf += '<span class="col abilitycol">' + template.abilities['0'] + '</span>';
		}
		if (template.abilities['S']) {
			buf += '<span class="col twoabilitycol' + (template.unreleasedHidden ? ' unreleasedhacol' : '') + '"><em>' + template.abilities['H'] + '<br />' + template.abilities['S'] + '</em></span>';
		} else if (template.abilities['H']) {
			buf += '<span class="col abilitycol' + (template.unreleasedHidden ? ' unreleasedhacol' : '') + '"><em>' + template.abilities['H'] + '</em></span>';
		} else {
			buf += '<span class="col abilitycol"></span>';
		}
		buf += '</span>';
	}
	let bst = 0;
	for (let i in template.baseStats) {
		bst += template.baseStats[i];
	}
	buf += '<span style="float:left;min-height:26px">';
	buf += '<span class="col statcol"><em>HP</em><br />' + template.baseStats.hp + '</span> ';
	buf += '<span class="col statcol"><em>Atk</em><br />' + template.baseStats.atk + '</span> ';
	buf += '<span class="col statcol"><em>Def</em><br />' + template.baseStats.def + '</span> ';
	if (gen <= 1) {
		bst -= template.baseStats.spd;
		buf += '<span class="col statcol"><em>Spc</em><br />' + template.baseStats.spa + '</span> ';
	} else {
		buf += '<span class="col statcol"><em>SpA</em><br />' + template.baseStats.spa + '</span> ';
		buf += '<span class="col statcol"><em>SpD</em><br />' + template.baseStats.spd + '</span> ';
	}
	buf += '<span class="col statcol"><em>Spe</em><br />' + template.baseStats.spe + '</span> ';
	buf += '<span class="col bstcol"><em>BST<br />' + bst + '</em></span> ';
	buf += '</span>';
	buf += '</li>';
	return `<div class="message"><ul class="utilichart">${buf}<li style="clear:both"></li></ul></div>`;
};

Chat.getDataMoveHTML = function (move) {
	if (typeof move === 'string') move = Object.assign({}, Dex.getMove(move));
	let buf = `<ul class="utilichart"><li class="result">`;
	buf += `<a data-entry="move|${move.name}"><span class="col movenamecol">${move.name}</span> `;
	buf += `<span class="col typecol"><img src="//play.pokemonshowdown.com/sprites/types/${move.type}.png" alt="${move.type}" width="32" height="14">`;
	buf += `<img src="//play.pokemonshowdown.com/sprites/categories/${move.category}.png" alt="${move.category}" width="32" height="14"></span> `;
	if (move.basePower) buf += `<span class="col labelcol"><em>Power</em><br>${typeof move.basePower === 'number' ? move.basePower : '—'}</span> `;
	buf += `<span class="col widelabelcol"><em>Accuracy</em><br>${typeof move.accuracy === 'number' ? (move.accuracy + '%') : '—'}</span> `;
	const basePP = move.pp || 1;
	const pp = Math.floor(move.noPPBoosts ? basePP : basePP * 8 / 5);
	buf += `<span class="col pplabelcol"><em>PP</em><br>${pp}</span> `;
	buf += `<span class="col movedesccol">${move.shortDesc || move.desc}</span> `;
	buf += `</a></li><li style="clear:both"></li></ul>`;
	return buf;
};

Chat.getDataAbilityHTML = function (ability) {
	if (typeof ability === 'string') ability = Object.assign({}, Dex.getAbility(ability));
	let buf = `<ul class="utilichart"><li class="result">`;
	buf += `<a data-entry="ability|${ability.name}"><span class="col namecol">${ability.name}</span> `;
	buf += `<span class="col abilitydesccol">${ability.shortDesc || ability.desc}</span> `;
	buf += `</a></li><li style="clear:both"></li></ul>`;
	return buf;
};

Chat.getDataItemHTML = function (item) {
	if (typeof item === 'string') item = Object.assign({}, Dex.getItem(item));
	let buf = `<ul class="utilichart"><li class="result">`;
	buf += `<a data-entry="item|${item.name}"><span class="col itemiconcol"><psicon item="${item.id}"></span> <span class="col namecol">${item.name}</span> `;
	buf += `<span class="col itemdesccol">${item.shortDesc || item.desc}</span> `;
	buf += `</a></li><li style="clear:both"></li></ul>`;
	return buf;
};
