/**
 * Command parser
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is the command parser. Call it with CommandParser.parse
 * (scroll down to its definition for details)
 *
 * Individual commands are put in:
 *   commands.js - "core" commands that shouldn't be modified
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

const fs = require('fs');
const path = require('path');

exports.Messages = require('./messages');

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
			if (/^[^ \^\$\?\|\(\)\[\]]+ $/.test(elem)) {
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

exports.multiLinePattern = new PatternTester();
exports.globalPattern = new PatternTester();

/*********************************************************
 * Load command files
 *********************************************************/

let baseCommands = exports.baseCommands = require('./commands').commands;
let commands = exports.commands = Object.assign({}, baseCommands);

// Install plug-in commands

// info always goes first so other plugins can shadow it
Object.assign(commands, require('./chat-plugins/info').commands);

for (let file of fs.readdirSync(path.resolve(__dirname, 'chat-plugins'))) {
	if (file.substr(-3) !== '.js' || file === 'info.js') continue;
	Object.assign(commands, require('./chat-plugins/' + file).commands);
}

/*********************************************************
 * Parser
 *********************************************************/

class CommandContext {
	constructor(options) {
		this.cmd = options.cmd || '';
		this.cmdToken = options.cmdToken || '';

		this.target = options.target || '';
		this.message = options.message || '';

		this.levelsDeep = options.levelsDeep || 0;
		this.namespaces = options.namespaces || null;

		this.room = options.room || null;
		this.user = options.user || null;
		this.connection = options.connection || null;

		this.targetUser = null;
		this.targetUsername = '';
		this.inputUsername = '';

		this.pmTarget = options.pmTarget;
		this.relatedRoom = options.relatedRoom;
	}

	checkFormat(room, message) {
		if (!room) return false;
		if (!room.filterStretching && !room.filterCaps) return false;
		let formatError = [];
		// Removes extra spaces and null characters
		message = message.trim().replace(/[ \u0000\u200B-\u200F]+/g, ' ');

		let stretchMatch = room.filterStretching && message.match(/(.+?)\1{7,}/i);
		let capsMatch = room.filterCaps && message.match(/[A-Z\s]{18,}/);

		if (stretchMatch) {
			formatError.push("too much stretching");
		}
		if (capsMatch) {
			formatError.push("too many capital letters");
		}
		if (formatError.length > 0) {
			return formatError.join(' and ') + ".";
		}
		return false;
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
	pmTransform(message) {
		let prefix = `|pm|${this.user.getIdentity()}|${this.pmTarget.getIdentity ? this.pmTarget.getIdentity() : ' ' + this.pmTarget}|`;
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
				if (this.pmTarget.send) this.pmTarget.send(data);
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
			let prefix = '|pm|' + this.user.getIdentity() + '|' + (this.pmTarget.getIdentity ? this.pmTarget.getIdentity() : ' ' + this.pmTarget) + '|/error ';
			this.connection.send(prefix + message.replace(/\n/g, prefix));
		} else {
			this.sendReply('|html|<div class="message-error">' + Tools.escapeHTML(message).replace(/\n/g, '<br />') + '</div>');
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
			if (this.pmTarget.send) this.pmTarget.send(data);
			return;
		}
		this.room.add(data);
	}
	send(data) {
		if (this.pmTarget) {
			data = this.pmTransform(data);
			this.user.send(data);
			if (this.pmTarget.send) this.pmTarget.send(data);
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
		this.add('|c|' + this.user.getIdentity(this.room) + '|/log ' + text);
		this.room.modlog(text + (logOnlyText || ""));
	}
	logModCommand(text) {
		this.room.modlog(text);
	}
	can(permission, target, room) {
		if (!this.user.can(permission, target, room)) {
			this.errorReply(this.cmdToken + this.namespaces.concat(this.cmd).join(" ") + " - Access denied.");
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

			if (this.room.lastBroadcast === this.broadcastMessage &&
					this.room.lastBroadcastTime >= Date.now() - BROADCAST_COOLDOWN) {
				this.errorReply("You can't broadcast this because it was just broadcast.");
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
	parse(message, inNamespace, room) {
		if (inNamespace && this.cmdToken) {
			message = this.cmdToken + this.namespaces.concat(message.slice(1)).join(" ");
		}
		return CommandParser.parse(message, room || this.room, this.user, this.connection, this.pmTarget, this.levelsDeep + 1);
	}
	run(targetCmd, inNamespace) {
		if (targetCmd === 'constructor') return this.sendReply("Access denied.");
		let commandHandler;
		if (typeof targetCmd === 'function') {
			commandHandler = targetCmd;
		} else if (inNamespace) {
			commandHandler = commands;
			for (let i = 0; i < this.namespaces.length; i++) {
				commandHandler = commandHandler[this.namespaces[i]];
			}
			commandHandler = commandHandler[targetCmd];
		} else {
			commandHandler = commands[targetCmd];
		}

		let result;
		try {
			result = commandHandler.call(this, this.target, this.room, this.user, this.connection, this.cmd, this.message);
		} catch (err) {
			if (require('./crashlogger')(err, 'A chat command', {
				user: this.user.name,
				room: this.room.id,
				message: this.message,
			}) === 'lockdown') {
				let ministack = Tools.escapeHTML(err.stack).split("\n").slice(0, 2).join("<br />");
				if (Rooms.lobby) Rooms.lobby.send('|html|<div class="broadcast-red"><b>POKEMON SHOWDOWN HAS CRASHED:</b> ' + ministack + '</div>');
			} else {
				this.sendReply('|html|<div class="broadcast-red"><b>Pokemon Showdown crashed!</b><br />Don\'t worry, we\'re working on fixing it.</div>');
			}
		}
		if (result === undefined) result = false;

		return result;
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
			console.log(`Command tried to write to global: ${user.name}: ${message}`);
			return false;
		}
		if (!user.named) {
			connection.popup("You must choose a name before you can talk.");
			return false;
		}
		if (!user.can('bypassall')) {
			if (room && user.locked) {
				this.errorReply("You are locked from talking in chat.");
				return false;
			}
			if (room && room.isMuted(user)) {
				this.errorReply("You are muted and cannot talk in this room.");
				return false;
			}
			if ((!room || !room.battle) && (!targetUser || " +".includes(targetUser.group))) {
				// in a chat room, or PMing non-staff
				if (user.namelocked) {
					this.errorReply("You are namelocked and cannot talk except in battles and to global staff.");
					return false;
				}
			}
			if (room && room.modchat) {
				let userGroup = user.group;
				if (!user.can('makeroom')) {
					userGroup = room.getAuth(user);
				}
				if (room.modchat === 'autoconfirmed') {
					if (!user.autoconfirmed && userGroup === ' ') {
						this.errorReply("Because moderated chat is set, your account must be at least one week old and you must have won at least one ladder game to speak in this room.");
						return false;
					}
				} else if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(room.modchat)) {
					let groupName = Config.groups[room.modchat].name || room.modchat;
					this.errorReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to speak in this room.");
					return false;
				}
			}
			if (room && !(user.userid in room.users)) {
				connection.popup("You can't send a message to this room without being in it.");
				return false;
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

			if (this.checkFormat(room, message) && !user.can('mute', null, room)) {
				this.errorReply("Your message was not sent because it contained " + this.checkFormat(room, message));
				return false;
			}

			if (!this.checkSlowchat(room, user) && !user.can('mute', null, room)) {
				this.errorReply("This room has slow-chat enabled. You can only talk once every " + room.slowchat + " seconds.");
				return false;
			}

			if (!this.checkBanwords(room, message) && !user.can('mute', null, room)) {
				this.errorReply("Your message contained banned words.");
				return false;
			}

			if (room) {
				let normalized = message.trim();
				if (room.id === 'lobby' && (normalized === user.lastMessage) &&
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
			if (/^[a-z]+\:\/\//.test(uri) || isRelative) {
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
			let srcMatch = /src\s*\=\s*"?([^ "]+)(\s*")?/i.exec(match[0]);
			if (srcMatch) {
				let uri = this.canEmbedURI(srcMatch[1], true);
				if (!uri) return false;
				html = html.slice(0, match.index + srcMatch.index) + 'src="' + uri + '"' + html.slice(match.index + srcMatch.index + srcMatch[0].length);
				// lastIndex is inaccurate since html was changed
				images.lastIndex = match.index + 11;
			}
		}
		if ((this.room.isPersonal || this.room.isPrivate === true) && !this.user.can('lock') && html.replace(/\s*style\s*=\s*\"?[^\"]*\"\s*>/g, '>').match(/<button[^>]/)) {
			this.errorReply('You do not have permission to use scripted buttons in HTML.');
			this.errorReply('If you just want to link to a room, you can do this: <a href="/roomid"><button>button contents</button></a>');
			return false;
		}
		if (/>here.?</i.test(html) || /click here/i.test(html)) {
			this.errorReply('Do not use "click here"');
			return false;
		}

		// check for mismatched tags
		let tags = html.toLowerCase().match(/<\/?(div|a|button|b|i|u|center|font)\b/g);
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
	splitTarget(target, exactName) {
		let commaIndex = target.indexOf(',');
		if (commaIndex < 0) {
			let targetUser = Users.get(target, exactName);
			this.targetUser = targetUser;
			this.inputUsername = target.trim();
			this.targetUsername = targetUser ? targetUser.name : target;
			return '';
		}
		this.inputUsername = target.substr(0, commaIndex);
		let targetUser = Users.get(this.inputUsername, exactName);
		if (targetUser) {
			this.targetUser = targetUser;
			this.targetUsername = targetUser.name;
		} else {
			this.targetUser = null;
			this.targetUsername = this.inputUsername;
		}
		return target.substr(commaIndex + 1).trim();
	}
	splitTargetText(target) {
		let commaIndex = target.indexOf(',');
		if (commaIndex < 0) {
			this.targetUsername = target;
			return '';
		}
		this.targetUsername = target.substr(0, commaIndex);
		return target.substr(commaIndex + 1).trim();
	}
}
exports.CommandContext = CommandContext;

/**
 * Command parser
 *
 * Usage:
 *   CommandParser.parse(message, room, user, connection)
 *
 * Parses the message. If it's a command, the commnad is executed, if
 * not, it's displayed directly in the room.
 *
 * Examples:
 *   CommandParser.parse("/join lobby", room, user, connection)
 *     will make the user join the lobby.
 *
 *   CommandParser.parse("Hi, guys!", room, user, connection)
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
 * @param {User?} pmTarget - the PM the user wants to send the message to
 */
let parse = exports.parse = function (message, room, user, connection, pmTarget, levelsDeep = 0) {
	let cmd = '', target = '', cmdToken = '';

	if (!message || !message.trim().length) return;

	if (levelsDeep > MAX_PARSE_RECURSION) {
		throw new Error("Too much command recursion");
	}

	let relatedRoom = null;
	if (!user.inRooms.has(room.id) || room === Rooms.global) {
		if (!CommandParser.globalPattern.test(message)) return;
		relatedRoom = room;
	}
	if (relatedRoom) room = Rooms.global;

	if (message.slice(0, 3) === '>> ') {
		// multiline eval
		message = '/eval ' + message.slice(3);
	} else if (message.slice(0, 4) === '>>> ') {
		// multiline eval
		message = '/evalbattle ' + message.slice(4);
	} else if (message.slice(0, 3) === '/me' && /[^A-Za-z0-9 ]/.test(message.charAt(3))) {
		message = '/mee ' + message.slice(3);
	}

	if (VALID_COMMAND_TOKENS.includes(message.charAt(0)) && message.charAt(1) !== message.charAt(0)) {
		cmdToken = message.charAt(0);
		let spaceIndex = message.indexOf(' ');
		if (spaceIndex > 0) {
			cmd = message.substr(1, spaceIndex - 1).toLowerCase();
			target = message.substr(spaceIndex + 1);
		} else {
			cmd = message.substr(1).toLowerCase();
			target = '';
		}
	}

	let namespaces = [];
	let currentCommands = commands;
	let commandHandler;

	do {
		if (toId(cmd) === 'constructor') {
			return connection.sendTo(room, "Error: Access denied.");
		}
		commandHandler = currentCommands[cmd];
		if (typeof commandHandler === 'string') {
			// in case someone messed up, don't loop
			commandHandler = currentCommands[commandHandler];
		} else if (Array.isArray(commandHandler)) {
			return parse(cmdToken + 'help ' + cmd.slice(0, -4), room, user, connection, undefined, levelsDeep + 1);
		}
		if (commandHandler && typeof commandHandler === 'object') {
			namespaces.push(cmd);

			let spaceIndex = target.indexOf(' ');
			if (spaceIndex > 0) {
				cmd = target.substr(0, spaceIndex).toLowerCase();
				target = target.substr(spaceIndex + 1);
			} else {
				cmd = target.toLowerCase();
				target = '';
			}

			currentCommands = commandHandler;
		}
	} while (commandHandler && typeof commandHandler === 'object');
	if (!commandHandler && currentCommands.default) {
		commandHandler = currentCommands.default;
		if (typeof commandHandler === 'string') {
			commandHandler = currentCommands[commandHandler];
		}
	}
	let fullCmd = namespaces.concat(cmd).join(' ');

	let context = new CommandContext({target, room, user, connection, cmd, message, namespaces, cmdToken, levelsDeep, pmTarget, relatedRoom});

	if (typeof commandHandler === 'function') {
		message = context.run(commandHandler);
	} else {
		// Check for mod/demod/admin/deadmin/etc depending on the group ids
		for (let g in Config.groups) {
			let groupid = Config.groups[g].id;
			if (cmd === groupid) {
				return parse('/promote ' + toId(target) + ', ' + g, room, user, connection, undefined, levelsDeep + 1);
			} else if (cmd === 'global' + groupid) {
				return parse('/globalpromote ' + toId(target) + ', ' + g, room, user, connection, undefined, levelsDeep + 1);
			} else if (cmd === 'de' + groupid || cmd === 'un' + groupid || cmd === 'globalde' + groupid || cmd === 'deglobal' + groupid) {
				return parse('/demote ' + toId(target), room, user, connection, undefined, levelsDeep + 1);
			} else if (cmd === 'room' + groupid) {
				return parse('/roompromote ' + toId(target) + ', ' + g, room, user, connection, undefined, levelsDeep + 1);
			} else if (cmd === 'roomde' + groupid || cmd === 'deroom' + groupid || cmd === 'roomun' + groupid) {
				return parse('/roomdemote ' + toId(target), room, user, connection, undefined, levelsDeep + 1);
			}
		}

		if (cmdToken && fullCmd) {
			// To guard against command typos, we now emit an error message
			if (cmdToken === BROADCAST_TOKEN) {
				if (/[a-z0-9]/.test(cmd.charAt(0))) {
					return context.errorReply("The command '" + cmdToken + fullCmd + "' was unrecognized.");
				}
			} else {
				return context.errorReply("The command '" + cmdToken + fullCmd + "' was unrecognized. To send a message starting with '" + cmdToken + fullCmd + "', type '" + cmdToken.repeat(2) + fullCmd + "'.");
			}
		} else if (!VALID_COMMAND_TOKENS.includes(message.charAt(0)) && VALID_COMMAND_TOKENS.includes(message.trim().charAt(0))) {
			message = message.trim();
			if (message.charAt(0) !== BROADCAST_TOKEN) {
				message = message.charAt(0) + message;
			}
		}

		message = context.canTalk(message);
	}

	// Output the message to the room

	if (message && message !== true && typeof message.then !== 'function') {
		room.add('|c|' + user.getIdentity(room.id) + '|' + message);
	}

	room.update();

	return message;
};

exports.package = {};
fs.readFile(path.resolve(__dirname, 'package.json'), (err, data) => {
	if (err) return;
	exports.package = JSON.parse(data);
});

exports.uncacheTree = function (root) {
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
