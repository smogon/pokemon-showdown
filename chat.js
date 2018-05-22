/**
 * Chat
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This handles chat and chat commands sent from users to chatrooms
 * and PMs. The main function you're looking for is Chat.parse
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
/** @typedef {GlobalRoom | GameRoom | ChatRoom} Room */

const LINK_WHITELIST = ['*.pokemonshowdown.com', 'psim.us', 'smogtours.psim.us', '*.smogon.com', '*.pastebin.com', '*.hastebin.com'];

const MAX_MESSAGE_LENGTH = 300;

const BROADCAST_COOLDOWN = 20 * 1000;
const MESSAGE_COOLDOWN = 5 * 60 * 1000;

const MAX_PARSE_RECURSION = 10;

const VALID_COMMAND_TOKENS = '/!';
const BROADCAST_TOKEN = '!';

const FS = require('./lib/fs');

let Chat = module.exports;

// Matches U+FE0F and all Emoji_Presentation characters. More details on
// http://www.unicode.org/Public/emoji/5.0/emoji-data.txt
const emojiRegex = /[\u231A\u231B\u23E9-\u23EC\u23F0\u23F3\u25FD\u25FE\u2614\u2615\u2648-\u2653\u267F\u2693\u26A1\u26AA\u26AB\u26BD\u26BE\u26C4\u26C5\u26CE\u26D4\u26EA\u26F2\u26F3\u26F5\u26FA\u26FD\u2705\u270A\u270B\u2728\u274C\u274E\u2753-\u2755\u2757\u2795-\u2797\u27B0\u27BF\u2B1B\u2B1C\u2B50\u2B55\uFE0F\u{1F004}\u{1F0CF}\u{1F18E}\u{1F191}-\u{1F19A}\u{1F1E6}-\u{1F1FF}\u{1F201}\u{1F21A}\u{1F22F}\u{1F232}-\u{1F236}\u{1F238}-\u{1F23A}\u{1F250}\u{1F251}\u{1F300}-\u{1F320}\u{1F32D}-\u{1F335}\u{1F337}-\u{1F37C}\u{1F37E}-\u{1F393}\u{1F3A0}-\u{1F3CA}\u{1F3CF}-\u{1F3D3}\u{1F3E0}-\u{1F3F0}\u{1F3F4}\u{1F3F8}-\u{1F43E}\u{1F440}\u{1F442}-\u{1F4FC}\u{1F4FF}-\u{1F53D}\u{1F54B}-\u{1F54E}\u{1F550}-\u{1F567}\u{1F57A}\u{1F595}\u{1F596}\u{1F5A4}\u{1F5FB}-\u{1F64F}\u{1F680}-\u{1F6C5}\u{1F6CC}\u{1F6D0}-\u{1F6D2}\u{1F6EB}\u{1F6EC}\u{1F6F4}-\u{1F6F8}\u{1F910}-\u{1F93A}\u{1F93C}-\u{1F93E}\u{1F940}-\u{1F945}\u{1F947}-\u{1F94C}\u{1F950}-\u{1F96B}\u{1F980}-\u{1F997}\u{1F9C0}\u{1F9D0}-\u{1F9E6}]/u;

class PatternTester {
	// This class sounds like a RegExp
	// In fact, one could in theory implement it as a RegExp subclass
	// However, ES2016 RegExp subclassing is a can of worms, and it wouldn't allow us
	// to tailor the test method for fast command parsing.
	constructor() {
		/** @type {string[]} */
		this.elements = [];
		/** @type {Set<string>} */
		this.fastElements = new Set();
		/** @type {?RegExp} */
		this.regexp = null;
	}
	/**
	 * @param {string} elem
	 */
	fastNormalize(elem) {
		return elem.slice(0, -1);
	}
	update() {
		const slowElements = this.elements.filter(elem => !this.fastElements.has(this.fastNormalize(elem)));
		if (slowElements.length) {
			this.regexp = new RegExp('^(' + slowElements.map(elem => '(?:' + elem + ')').join('|') + ')', 'i');
		}
	}
	/**
	 * @param {string[]} elems
	 */
	register(...elems) {
		for (const elem of elems) {
			this.elements.push(elem);
			if (/^[^ ^$?|()[\]]+ $/.test(elem)) {
				this.fastElements.add(this.fastNormalize(elem));
			}
		}
		this.update();
	}
	/**
	 * @param {string} text
	 */
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
Chat.pages = undefined;

/*********************************************************
 * Load chat filters
 *********************************************************/
Chat.filters = [];
/**
 * @param {string} message
 * @param {User} user
 * @param {ChatRoom} room
 * @param {Connection} connection
 * @param {User?} [targetUser]
 */
Chat.filter = function (message, user, room, connection, targetUser = null) {
	// Chat filters can choose to:
	// 1. return false OR null - to not send a user's message
	// 2. return an altered string - to alter a user's message
	// 3. return undefined to send the original message through
	const originalMessage = message;
	for (const filter of Chat.filters) {
		const output = filter.call(this, message, user, room, connection, targetUser, originalMessage);
		if (output !== undefined) message = output;
		if (!message) return message;
	}

	return message;
};
Chat.namefilters = [];
/**
 * @param {string} name
 * @param {User} user
 */
Chat.namefilter = function (name, user) {
	if (!Config.disablebasicnamefilter) {
		// whitelist
		// \u00A1-\u00BF\u00D7\u00F7  Latin punctuation/symbols
		// \u02B9-\u0362              basic combining accents
		// \u2012-\u2027\u2030-\u205E Latin punctuation/symbols extended
		// \u2050-\u205F              fractions extended
		// \u2190-\u23FA\u2500-\u2BD1 misc symbols
		// \u2E80-\u32FF              CJK symbols
		// \u3400-\u9FFF              CJK
		// \uF900-\uFAFF\uFE00-\uFE6F CJK extended
		name = name.replace(/[^a-zA-Z0-9 /\\.~()<>^*%&=+$@#_'?!"\u00A1-\u00BF\u00D7\u00F7\u02B9-\u0362\u2012-\u2027\u2030-\u205E\u2050-\u205F\u2190-\u23FA\u2500-\u2BD1\u2E80-\u32FF\u3400-\u9FFF\uF900-\uFAFF\uFE00-\uFE6F-]+/g, '');

		// blacklist
		// \u00a1 upside-down exclamation mark (i)
		// \u2580-\u2590 black bars
		// \u25A0\u25Ac\u25AE\u25B0 black bars
		// \u534d\u5350 swastika
		// \u2a0d crossed integral (f)
		name = name.replace(/[\u00a1\u2580-\u2590\u25A0\u25Ac\u25AE\u25B0\u2a0d\u534d\u5350]/g, '');
		// e-mail address
		if (name.includes('@') && name.includes('.')) return '';
	}
	name = name.replace(/^[^A-Za-z0-9]+/, ""); // remove symbols from start

	// cut name length down to 18 chars
	if (/[A-Za-z0-9]/.test(name.slice(18))) {
		name = name.replace(/[^A-Za-z0-9]+/g, "");
	} else {
		name = name.slice(0, 18);
	}

	name = Dex.getName(name);
	for (const filter of Chat.namefilters) {
		name = filter(name, user);
		if (!name) return '';
	}
	return name;
};
Chat.hostfilters = [];
/**
 * @param {string} host
 * @param {User} user
 * @param {Connection} connection
 */
Chat.hostfilter = function (host, user, connection) {
	for (const filter of Chat.hostfilters) {
		filter(host, user, connection);
	}
};
Chat.loginfilters = [];
/**
 * @param {User} user
 * @param {User?} oldUser
 * @param {string} usertype
 */
Chat.loginfilter = function (user, oldUser, usertype) {
	for (const filter of Chat.loginfilters) {
		filter(user, oldUser, usertype);
	}
};

/*********************************************************
 * Parser
 *********************************************************/

class CommandContext {
	/**
	 * @param {{message: string, room: Room, user: User, connection: Connection, pmTarget?: User, cmd?: string, cmdToken?: string, target?: string, fullCmd?: string}} options
	 */
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

		// broadcast context
		this.broadcasting = false;
		this.broadcastToRoom = true;

		// target user
		this.targetUser = null;
		this.targetUsername = "";
		this.inputUsername = "";
	}

	/**
	 * @param {any} [message]
	 * @return {any}
	 */
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
				Chat.sendPM(message, this.user, this.pmTarget);
			} else {
				this.room.add(`|c|${this.user.getIdentity(this.room.id)}|${message}`);
			}
		}

		this.update();

		return message;
	}

	/**
	 * @param {string} message
	 * @param {boolean} recursing
	 * @return {string | undefined}
	 */
	splitCommand(message = this.message, recursing = false) {
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

		if (cmd.endsWith(',')) cmd = cmd.slice(0, -1);

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
				if (cmd === groupid) {
					return this.splitCommand(`/promote ${target}, ${g}`, true);
				} else if (cmd === 'global' + groupid) {
					return this.splitCommand(`/globalpromote ${target}, ${g}`, true);
				} else if (cmd === 'de' + groupid || cmd === 'un' + groupid || cmd === 'globalde' + groupid || cmd === 'deglobal' + groupid) {
					return this.splitCommand(`/demote ${target}`, true);
				} else if (cmd === 'room' + groupid) {
					return this.splitCommand(`/roompromote ${target}, ${g}`, true);
				} else if (cmd === 'forceroom' + groupid) {
					return this.splitCommand(`/roompromote !!!${target}, ${g}`, true);
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
	/**
	 * @param {string | {call: Function}} commandHandler
	 */
	run(commandHandler) {
		if (typeof commandHandler === 'string') commandHandler = Chat.commands[commandHandler];
		let result;
		try {
			// @ts-ignore
			result = commandHandler.call(this, this.target, this.room, this.user, this.connection, this.cmd, this.message);
		} catch (err) {
			require('./lib/crashlogger')(err, 'A chat command', {
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

	/**
	 * @param {BasicChatRoom?} room
	 * @param {User} user
	 * @param {string} message
	 */
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

	/**
	 * @param {BasicChatRoom?} room
	 * @param {User} user
	 */
	checkSlowchat(room, user) {
		if (!room || !room.slowchat) return true;
		let lastActiveSeconds = (Date.now() - user.lastMessageTime) / 1000;
		if (lastActiveSeconds < room.slowchat) return false;
		return true;
	}

	/**
	 * @param {BasicChatRoom?} room
	 * @param {string} message
	 */
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
		// @ts-ignore
		if (!this.room || !this.room.game || !this.room.game.onChatMessage) return false;
		// @ts-ignore
		return this.room.game.onChatMessage(this.message, this.user);
	}
	/**
	 * @param {string} message
	 */
	pmTransform(message) {
		if (!this.pmTarget) throw new Error(`Not a PM`);
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
	/**
	 * @param {string} data
	 */
	sendReply(data) {
		if (this.broadcasting && this.broadcastToRoom) {
			// broadcasting
			this.add(data);
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
	/**
	 * @param {string} message
	 */
	errorReply(message) {
		if (this.pmTarget) {
			let prefix = '|pm|' + this.user.getIdentity() + '|' + this.pmTarget.getIdentity() + '|/error ';
			this.connection.send(prefix + message.replace(/\n/g, prefix));
		} else {
			this.sendReply('|html|<div class="message-error">' + Chat.escapeHTML(message).replace(/\n/g, '<br />') + '</div>');
		}
	}
	/**
	 * @param {string} html
	 */
	addBox(html) {
		this.add('|html|<div class="infobox">' + html + '</div>');
	}
	/**
	 * @param {string} html
	 */
	sendReplyBox(html) {
		this.sendReply('|html|<div class="infobox">' + html + '</div>');
	}
	/**
	 * @param {string} message
	 */
	popupReply(message) {
		this.connection.popup(message);
	}
	/**
	 * @param {string} data
	 */
	add(data) {
		if (this.pmTarget) {
			data = this.pmTransform(data);
			this.user.send(data);
			if (this.pmTarget !== this.user) this.pmTarget.send(data);
			return;
		}
		this.room.add(data);
	}
	/**
	 * @param {string} data
	 */
	send(data) {
		if (this.pmTarget) {
			data = this.pmTransform(data);
			this.user.send(data);
			if (this.pmTarget !== this.user) this.pmTarget.send(data);
			return;
		}
		this.room.send(data);
	}
	/**
	 * @param {string} data
	 */
	sendModCommand(data) {
		this.room.sendModsByUser(this.user, data);
	}

	privateModCommand() {
		throw new Error(`this.privateModCommand has been renamed to this.privateModAction, which no longer writes to modlog.`);
	}
	/**
	 * @param {string} msg
	 */
	privateModAction(msg) {
		this.room.sendMods(msg);
		this.roomlog(msg);
	}
	/**
	 * @param {string} action
	 * @param {string | User} user
	 * @param {string} note
	 */
	globalModlog(action, user, note) {
		let buf = `(${this.room.id}) ${action}: `;
		if (typeof user === 'string') {
			buf += `[${user}]`;
		} else {
			let userid = user.getLastId();
			buf += `[${userid}]`;
			if (user.autoconfirmed && user.autoconfirmed !== userid) buf += ` ac:[${user.autoconfirmed}]`;
			const alts = user.getAltUsers(false, true).map(user => user.getLastId()).join('], [');
			if (alts.length) buf += ` alts:[${alts}]`;
			buf += ` [${user.latestIp}]`;
		}
		buf += note;

		Rooms.global.modlog(buf);
		this.room.modlog(buf);
	}
	/**
	 * @param {string} action
	 * @param {string | User?} user
	 * @param {string?} note
	 * @param {object} options
	 */
	modlog(action, user, note = null, options = {}) {
		let buf = `(${this.room.id}) ${action}: `;
		if (user) {
			if (typeof user === 'string') {
				buf += `[${toId(user)}]`;
			} else {
				let userid = user.getLastId();
				buf += `[${userid}]`;
				if (!options.noalts) {
					if (user.autoconfirmed && user.autoconfirmed !== userid) buf += ` ac:[${user.autoconfirmed}]`;
					const alts = user.getAltUsers(false, true).map(user => user.getLastId()).join('], [');
					if (alts.length) buf += ` alts:[${alts}]`;
				}
				if (!options.noip) buf += ` [${user.latestIp}]`;
			}
		}
		buf += ` by ${this.user.userid}`;
		if (note) buf += `: ${note}`;

		this.room.modlog(buf);
	}
	/**
	 * @param {string} data
	 */
	roomlog(data) {
		if (this.pmTarget) return;
		this.room.roomlog(data);
	}
	logEntry() {
		throw new Error(`this.logEntry has been renamed to this.roomlog.`);
	}
	addModCommand() {
		throw new Error(`this.addModCommand has been renamed to this.addModAction, which no longer writes to modlog.`);
	}
	/**
	 * @param {string} msg
	 */
	addModAction(msg) {
		this.room.addByUser(this.user, msg);
	}
	update() {
		if (this.room) this.room.update();
	}
	/**
	 * @param {string} permission
	 * @param {string | User?} target
	 * @param {BasicChatRoom?} room
	 */
	can(permission, target = null, room = null) {
		if (!this.user.can(permission, target, room)) {
			this.errorReply(this.cmdToken + this.fullCmd + " - Access denied.");
			return false;
		}
		return true;
	}
	/**
	 * @param {?boolean} ignoreCooldown
	 * @param {?string} suppressMessage
	 */
	canBroadcast(ignoreCooldown, suppressMessage) {
		if (!this.broadcasting && this.cmdToken === BROADCAST_TOKEN) {
			// @ts-ignore
			if (!this.pmTarget && !this.user.can('broadcast', null, this.room)) {
				this.errorReply("You need to be voiced to broadcast this command's information.");
				this.errorReply("To see it for yourself, use: /" + this.message.substr(1));
				return false;
			}

			// broadcast cooldown
			const broadcastMessage = (suppressMessage || this.message).toLowerCase().replace(/[^a-z0-9\s!,]/g, '');

			if (!ignoreCooldown && this.room && this.room.lastBroadcast === broadcastMessage &&
					this.room.lastBroadcastTime >= Date.now() - BROADCAST_COOLDOWN &&
					!this.user.can('bypassall')) {
				this.errorReply("You can't broadcast this because it was just broadcasted.");
				return false;
			}

			const message = this.canTalk(suppressMessage || this.message);
			if (!message) return false;

			this.message = message;
			this.broadcastMessage = broadcastMessage;
		}
		return true;
	}
	/**
	 * @param {boolean} [ignoreCooldown = false]
	 * @param {?string} [suppressMessage = null]
	 */
	runBroadcast(ignoreCooldown = false, suppressMessage = null) {
		if (this.broadcasting || this.cmdToken !== BROADCAST_TOKEN) {
			// Already being broadcast, or the user doesn't intend to broadcast.
			return true;
		}

		if (!this.broadcastMessage) {
			// Permission hasn't been checked yet. Do it now.
			if (!this.canBroadcast(ignoreCooldown, suppressMessage)) return false;
		}

		this.broadcasting = true;

		if (this.pmTarget) {
			this.sendReply('|c~|' + (suppressMessage || this.message));
		} else {
			this.sendReply('|c|' + this.user.getIdentity(this.room.id) + '|' + (suppressMessage || this.message));
		}
		if (!ignoreCooldown && !this.pmTarget) {
			this.room.lastBroadcast = this.broadcastMessage;
			this.room.lastBroadcastTime = Date.now();
		}

		return true;
	}
	/**
	 * @param {string} text
	 */
	meansYes(text) {
		switch (text.toLowerCase().trim()) {
		case 'on': case 'enable': case 'yes': case 'true':
			return true;
		}
		return false;
	}
	/**
	 * @param {string} text
	 */
	meansNo(text) {
		switch (text.toLowerCase().trim()) {
		case 'off': case 'disable': case 'no': case 'false':
			return true;
		}
		return false;
	}
	/**
	 * @param {string?} message
	 * @param {BasicChatRoom?} [room]
	 * @param {User?} [targetUser]
	 */
	canTalk(message = null, room = null, targetUser = null) {
		// @ts-ignore
		if (!room) room = this.room;
		if (!targetUser && this.pmTarget) {
			room = null;
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
				if (lockType && !room.isHelp) {
					this.errorReply(`You are ${lockType} and can't talk in chat. ${lockExpiration}`);
					this.sendReply(`|html|<a href="view-help-request--appeal" class="button">Get help with this</a>`);
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
					if (room.modchat === 'trusted') {
						this.errorReply(`Because moderated chat is set, your account must be staff in a public room or have a global rank to speak in this room.`);
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
					} else {
						this.errorReply(`This ${Config.groups[targetUser.group].name} is too busy to answer private messages right now. Please contact a different staff member.`);
						return this.sendReply(`|html|If you need help, try opening a <a href="view-help-request" class="button">help ticket</a>`);
					}
				}
				if (user.ignorePMs && user.ignorePMs !== targetUser.group && !targetUser.can('lock')) {
					return this.errorReply(`You are blocking private messages right now.`);
				}
			}
		}

		if (typeof message !== 'string') return true;

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
		if (/[\u115f\u1160\u239b-\u23b9]/.test(message)) {
			this.errorReply("Your message contains banned characters.");
			return false;
		}

		// If the corresponding config option is set, non-AC users cannot send links, except to staff.
		if (Config.restrictLinks && !user.autoconfirmed) {
			const links = message.match(Chat.linkRegex);
			const allLinksWhitelisted = !links || links.every(link => {
				link = link.toLowerCase();
				const domainMatches = /^(?:http:\/\/|https:\/\/)?(?:[^/]*\.)?([^/.]*\.[^/.]*)\.?($|\/|:)/.exec(link);
				const domain = domainMatches && domainMatches[1];
				const hostMatches = /^(?:http:\/\/|https:\/\/)?([^/]*[^/.])\.?($|\/|:)/.exec(link);
				let host = hostMatches && hostMatches[1];
				if (host && host.startsWith('www.')) host = host.slice(4);
				if (!domain || !host) return false;
				return LINK_WHITELIST.includes(host) || LINK_WHITELIST.includes(`*.${domain}`);
			});
			if (!allLinksWhitelisted && !(targetUser && targetUser.can('lock'))) {
				this.errorReply("Your account must be autoconfirmed to send links to other users, except for global staff.");
				return false;
			}
		}

		if (!this.checkFormat(room, user, message)) {
			return false;
		}

		if (!this.checkSlowchat(room, user) && !user.can('mute', null, room)) {
			// @ts-ignore
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
			if (!user.can('bypassall') && (room.id === 'lobby' || room.id === 'help') && (normalized === user.lastMessage) &&
					((Date.now() - user.lastMessageTime) < MESSAGE_COOLDOWN)) {
				this.errorReply("You can't send the same message again so soon.");
				return false;
			}
			user.lastMessage = message;
			user.lastMessageTime = Date.now();
		}

		if (Chat.filters.length) {
			return Chat.filter.call(this, message, user, room, connection, targetUser);
		}

		return message;
	}
	/**
	 * @param {string} uri
	 * @param {boolean} isRelative
	 */
	canEmbedURI(uri, isRelative = false) {
		if (uri.startsWith('https://')) return uri;
		if (uri.startsWith('//')) return uri;
		if (uri.startsWith('data:')) return uri;
		if (!uri.startsWith('http://')) {
			if (/^[a-z]+:\/\//.test(uri) || isRelative) {
				this.errorReply("URIs must begin with 'https://' or 'http://' or 'data:'");
				return null;
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
			this.errorReply("Please don't use URL shorteners.");
			return null;
		}
		// unknown URI, allow HTTP to be safe
		return 'http://' + uri;
	}
	/**
	 * @param {?string} html
	 */
	canHTML(html) {
		html = ('' + (html || '')).trim();
		if (!html) return '';
		let images = /<img\b[^<>]*/ig;
		let match;
		while ((match = images.exec(html))) {
			if (this.room.isPersonal && !this.user.can('announce')) {
				this.errorReply("Images are not allowed in personal rooms.");
				return null;
			}
			if (!/width=([0-9]+|"[0-9]+")/i.test(match[0]) || !/height=([0-9]+|"[0-9]+")/i.test(match[0])) {
				// Width and height are required because most browsers insert the
				// <img> element before width and height are known, and when the
				// image is loaded, this changes the height of the chat area, which
				// messes up autoscrolling.
				this.errorReply('All images must have a width and height attribute');
				return null;
			}
			let srcMatch = /src\s*=\s*"?([^ "]+)(\s*")?/i.exec(match[0]);
			if (srcMatch) {
				let uri = this.canEmbedURI(srcMatch[1], true);
				if (!uri) return null;
				html = html.slice(0, match.index + srcMatch.index) + 'src="' + uri + '"' + html.slice(match.index + srcMatch.index + srcMatch[0].length);
				// lastIndex is inaccurate since html was changed
				images.lastIndex = match.index + 11;
			}
		}
		if ((this.room.isPersonal || this.room.isPrivate === true) && !this.user.can('lock') && html.replace(/\s*style\s*=\s*"?[^"]*"\s*>/g, '>').match(/<button[^>]/)) {
			this.errorReply('You do not have permission to use scripted buttons in HTML.');
			this.errorReply('If you just want to link to a room, you can do this: <a href="/roomid"><button>button contents</button></a>');
			return null;
		}
		if (/>here.?</i.test(html) || /click here/i.test(html)) {
			this.errorReply('Do not use "click here"');
			return null;
		}

		// check for mismatched tags
		let tags = html.toLowerCase().match(/<\/?(div|a|button|b|strong|em|i|u|center|font|marquee|blink|details|summary|code|table|td|tr)\b/g);
		if (tags) {
			let stack = [];
			for (const tag of tags) {
				if (tag.charAt(1) === '/') {
					if (!stack.length) {
						this.errorReply("Extraneous </" + tag.substr(2) + "> without an opening tag.");
						return null;
					}
					if (tag.substr(2) !== stack.pop()) {
						this.errorReply("Missing </" + tag.substr(2) + "> or it's in the wrong place.");
						return null;
					}
				} else {
					stack.push(tag.substr(1));
				}
			}
			if (stack.length) {
				this.errorReply("Missing </" + stack.pop() + ">.");
				return null;
			}
		}

		return html;
	}
	/**
	 * @param {string} target
	 * @param {boolean} exactName
	 */
	targetUserOrSelf(target, exactName) {
		if (!target) {
			this.targetUsername = this.user.name;
			this.inputUsername = this.user.name;
			return this.user;
		}
		this.splitTarget(target, exactName);
		return this.targetUser;
	}
	/**
	 * @param {string} target
	 */
	splitOne(target) {
		let commaIndex = target.indexOf(',');
		if (commaIndex < 0) {
			return [target.trim(), ''];
		}
		return [target.substr(0, commaIndex).trim(), target.substr(commaIndex + 1).trim()];
	}
	/**
	 * Given a message in the form "USERNAME" or "USERNAME, MORE", splits
	 * it apart:
	 *
	 * - `this.targetUser` will be the User corresponding to USERNAME
	 *   (or null, if not found)
	 *
	 * - `this.inputUsername` will be the text of USERNAME, unmodified
	 *
	 * - `this.targetUsername` will be the username, if found, or
	 *   this.inputUsername otherwise
	 *
	 * - and the text of MORE will be returned (empty string, if the
	 *   message has no comma)
	 *
	 * @param {string} target
	 * @param {boolean} exactName
	 */
	splitTarget(target, exactName) {
		let [name, rest] = this.splitOne(target);

		this.targetUser = Users.get(name, exactName);
		this.inputUsername = name.trim();
		this.targetUsername = this.targetUser ? this.targetUser.name : this.inputUsername;
		return rest;
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
	Chat.loadPlugins();
	let context = new CommandContext({message, room, user, connection});

	return context.parse();
};
/**
 * @param {string} message
 * @param {User} user
 * @param {User} pmTarget
 * @param {?User} onlyRecipient
 */
Chat.sendPM = function (message, user, pmTarget, onlyRecipient = null) {
	let buf = `|pm|${user.getIdentity()}|${pmTarget.getIdentity()}|${message}`;
	if (onlyRecipient) return onlyRecipient.send(buf);
	user.send(buf);
	if (pmTarget !== user) pmTarget.send(buf);
	pmTarget.lastPM = user.userid;
	user.lastPM = pmTarget.userid;
};

Chat.package = {};

/**
 * @param {string} root
 */
Chat.uncacheTree = function (root) {
	let uncache = [require.resolve(root)];
	do {
		/** @type {string[]} */
		let newuncache = [];
		for (const target of uncache) {
			if (require.cache[target]) {
				newuncache.push.apply(newuncache,
					require.cache[target].children
						.filter(/** @param {{id: string}} cachedModule */ cachedModule => !cachedModule.id.endsWith('.node'))
						.map(/** @param {{id: string}} cachedModule */ cachedModule => cachedModule.id)
				);
				delete require.cache[target];
			}
		}
		uncache = newuncache;
	} while (uncache.length > 0);
};

/**
 * @param {string} root
 */
Chat.uncacheDir = function (root) {
	const absoluteRoot = FS(root).path;
	for (const key in require.cache) {
		if (key.startsWith(absoluteRoot)) {
			delete require.cache[key];
		}
	}
};

/**
 * @param {string} path
 */
Chat.uncache = function (path) {
	const absolutePath = require.resolve(path);
	delete require.cache[absolutePath];
};

Chat.loadPlugins = function () {
	if (Chat.commands) return;

	FS('package.json').readIfExists().then(data => {
		if (data) Chat.package = JSON.parse(data);
	});

	// prevent TypeScript from resolving
	const baseCommands = './chat-commands';
	Chat.baseCommands = require(baseCommands).commands;
	Chat.basePages = require(baseCommands).pages;
	let commands = Chat.commands = Object.assign({}, Chat.baseCommands);
	let pages = Chat.pages = Object.assign({}, Chat.basePages);

	if (Config.chatfilter) Chat.filters.push(Config.chatfilter);
	if (Config.namefilter) Chat.namefilters.push(Config.namefilter);
	if (Config.hostfilter) Chat.hostfilters.push(Config.hostfilter);
	if (Config.loginfilter) Chat.loginfilters.push(Config.loginfilter);

	// Install plug-in commands and chat filters

	// info always goes first so other plugins can shadow it
	let files = FS('chat-plugins/').readdirSync();
	files = files.filter(file => file !== 'info.js');
	files.unshift('info.js');

	for (const file of files) {
		if (file.substr(-3) !== '.js') continue;
		const plugin = require(`./chat-plugins/${file}`);

		Object.assign(commands, plugin.commands);
		Object.assign(pages, plugin.pages);

		if (plugin.chatfilter) Chat.filters.push(plugin.chatfilter);
		if (plugin.namefilter) Chat.namefilters.push(plugin.namefilter);
		if (plugin.hostfilter) Chat.hostfilters.push(plugin.hostfilter);
		if (plugin.loginfilter) Chat.loginfilters.push(plugin.loginfilter);
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
 * @param  {TemplateStringsArray} strings
 * @param  {...any} args
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
 * @param  {string} plural
 * @param  {string} singular
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
 * Counts the thing passed.
 *
 *     Chat.count(2, "days") === "2 days"
 *     Chat.count(1, "days") === "1 day"
 *     Chat.count(["foo"], "things are") === "1 thing is"
 *
 * @param  {any} num
 * @param  {string} singular
 * @param  {string} plural
 * @return {string}
 */
Chat.count = function (num, plural, singular = "") {
	if (num && typeof num.length === 'number') {
		num = num.length;
	} else if (num && typeof num.size === 'number') {
		num = num.size;
	} else {
		num = Number(num);
	}
	if (!singular) {
		if (plural.endsWith("s")) {
			singular = plural.slice(0, -1);
		} else if (plural.endsWith("s have")) {
			singular = plural.slice(0, -6) + " has";
		} else if (plural.endsWith("s were")) {
			singular = plural.slice(0, -6) + " was";
		}
	}
	const space = singular.startsWith('<') ? '' : ' ';
	return `${num}${space}${num > 1 ? plural : singular}`;
};

/**
 * Like string.split(delimiter), but only recognizes the first `limit`
 * delimiters (default 1).
 *
 * `"1 2 3 4".split(" ", 2) => ["1", "2"]`
 *
 * `Chat.splitFirst("1 2 3 4", " ", 1) => ["1", "2 3 4"]`
 *
 * Returns an array of length exactly limit + 1.
 *
 * @param {string} str
 * @param {string} delimiter
 * @param {number} [limit]
 */
Chat.splitFirst = function (str, delimiter, limit = 1) {
	let splitStr = /** @type {string[]} */ ([]);
	while (splitStr.length < limit) {
		let delimiterIndex = str.indexOf(delimiter);
		if (delimiterIndex >= 0) {
			splitStr.push(str.slice(0, delimiterIndex));
			str = str.slice(delimiterIndex + delimiter.length);
		} else {
			splitStr.push(str);
			str = '';
		}
	}
	splitStr.push(str);
	return splitStr;
};

/**
 * Returns a timestamp in the form {yyyy}-{MM}-{dd} {hh}:{mm}:{ss}.
 *
 * options.human = true will reports hours human-readable
 *
 * @param  {Date} date
 * @param  {AnyObject} options
 * @return {string}
 */
Chat.toTimestamp = function (date, options = {}) {
	const human = options && options.human;
	/** @type {any[]} */
	let parts = [date.getFullYear(), date.getMonth() + 1, date.getDate(), date.getHours(), date.getMinutes(), date.getSeconds()];
	if (human) {
		parts.push(parts[3] >= 12 ? 'pm' : 'am');
		parts[3] = parts[3] % 12 || 12;
	}
	parts = parts.map(val => val < 10 ? '0' + val : '' + val);
	return parts.slice(0, 3).join("-") + " " + parts.slice(3, human ? 5 : 6).join(":") + (human ? "" + parts[6] : "");
};

/**
 * Takes a number of milliseconds, and reports the duration in English: hours, minutes, etc.
 *
 * options.hhmmss = true will instead report the duration in 00:00:00 format
 *
 * @param  {number} number
 * @param  {AnyObject} options
 * @return {string}
 */
Chat.toDurationString = function (number, options = {}) {
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
/**
 * @param {Template} template
 * @param {number} gen
 */
Chat.getDataPokemonHTML = function (template, gen = 7, tier = '') {
	if (typeof template === 'string') template = Object.assign({}, Dex.getTemplate(template));
	let buf = '<li class="result">';
	buf += '<span class="col numcol">' + (tier || template.tier) + '</span> ';
	buf += `<span class="col iconcol"><psicon pokemon="${template.id}"/></span> `;
	buf += '<span class="col pokemonnamecol" style="white-space:nowrap"><a href="https://pokemonshowdown.com/dex/pokemon/' + template.id + '" target="_blank">' + template.species + '</a></span> ';
	buf += '<span class="col typecol">';
	if (template.types) {
		for (const type of template.types) {
			buf += `<img src="https://play.pokemonshowdown.com/sprites/types/${type}.png" alt="${type}" height="14" width="32">`;
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
		// @ts-ignore
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
/**
 * @param {Move} move
 */
Chat.getDataMoveHTML = function (move) {
	if (typeof move === 'string') move = Object.assign({}, Dex.getMove(move));
	let buf = `<ul class="utilichart"><li class="result">`;
	buf += `<span class="col movenamecol"><a href="https://pokemonshowdown.com/dex/moves/${move.id}">${move.name}</a></span> `;
	buf += `<span class="col typecol"><img src="//play.pokemonshowdown.com/sprites/types/${move.type}.png" alt="${move.type}" width="32" height="14">`;
	buf += `<img src="//play.pokemonshowdown.com/sprites/categories/${move.category}.png" alt="${move.category}" width="32" height="14"></span> `;
	if (move.basePower) buf += `<span class="col labelcol"><em>Power</em><br>${typeof move.basePower === 'number' ? move.basePower : '—'}</span> `;
	buf += `<span class="col widelabelcol"><em>Accuracy</em><br>${typeof move.accuracy === 'number' ? (move.accuracy + '%') : '—'}</span> `;
	const basePP = move.pp || 1;
	const pp = Math.floor(move.noPPBoosts ? basePP : basePP * 8 / 5);
	buf += `<span class="col pplabelcol"><em>PP</em><br>${pp}</span> `;
	buf += `<span class="col movedesccol">${move.shortDesc || move.desc}</span> `;
	buf += `</li><li style="clear:both"></li></ul>`;
	return buf;
};
/**
 * @param {Ability} ability
 */
Chat.getDataAbilityHTML = function (ability) {
	if (typeof ability === 'string') ability = Object.assign({}, Dex.getAbility(ability));
	let buf = `<ul class="utilichart"><li class="result">`;
	buf += `<span class="col namecol"><a href="https://pokemonshowdown.com/dex/abilities/${ability.id}">${ability.name}</a></span> `;
	buf += `<span class="col abilitydesccol">${ability.shortDesc || ability.desc}</span> `;
	buf += `</li><li style="clear:both"></li></ul>`;
	return buf;
};
/**
 * @param {string | Item} item
 */
Chat.getDataItemHTML = function (item) {
	if (typeof item === 'string') item = Object.assign({}, Dex.getItem(item));
	let buf = `<ul class="utilichart"><li class="result">`;
	buf += `<span class="col itemiconcol"><psicon item="${item.id}"></span> <span class="col namecol"><a href="https://pokemonshowdown.com/dex/items/${item.id}">${item.name}</a></span> `;
	buf += `<span class="col itemdesccol">${item.shortDesc || item.desc}</span> `;
	buf += `</li><li style="clear:both"></li></ul>`;
	return buf;
};

/**
 * Visualizes eval output in a slightly more readable form
 * @param {any} value
 */
Chat.stringify = function (value, depth = 0) {
	if (value === undefined) return `undefined`;
	if (value === null) return `null`;
	if (typeof value === 'number' || typeof value === 'boolean') {
		return `${value}`;
	}
	if (typeof value === 'string') {
		return `"${value}"`; // NOT ESCAPED
	}
	if (typeof value === 'symbol') {
		return value.toString();
	}
	if (Array.isArray(value)) {
		if (depth > 10) return `[array]`;
		return `[` + value.map(elem => Chat.stringify(elem, depth + 1)).join(`, `) + `]`;
	}
	if (value instanceof RegExp || value instanceof Date || value instanceof Function) {
		if (depth && value instanceof Function) return `Function`;
		return `${value}`;
	}
	let constructor = '';
	if (value.constructor && value.constructor.name && typeof value.constructor.name === 'string') {
		constructor = value.constructor.name;
		if (constructor === 'Object') constructor = '';
	} else {
		constructor = 'null';
	}
	if (value.toString) {
		try {
			const stringValue = value.toString();
			if (typeof stringValue === 'string' && stringValue !== '[object Object]' && stringValue !== `[object ${constructor}]`) {
				return `${constructor}(${stringValue})`;
			}
		} catch (e) {}
	}
	let buf = '';
	for (let k in value) {
		if (!Object.prototype.hasOwnProperty.call(value, k)) continue;
		if (depth > 2 || (depth && constructor)) {
			buf = '...';
			break;
		}
		if (buf) buf += `, `;
		if (!/^[A-Za-z0-9_$]+$/.test(k)) k = JSON.stringify(k);
		buf += `${k}: ` + Chat.stringify(value[k], depth + 1);
	}
	if (constructor && !buf && constructor !== 'null') return constructor;
	return `${constructor}{${buf}}`;
};

Chat.formatText = require('./chat-formatter').formatText;
Chat.linkRegex = require('./chat-formatter').linkRegex;
Chat.updateServerLock = false;
