/**
 * Command parser
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is the command parser. Call it with CommandParser.parse
 * (scroll down to its definition for details)
 *
 * Individual commands are put in:
 *   commands.js - "core" commands that shouldn't be modified
 *   config/commands.js - other commands that can be safely modified
 *
 * The command API is (mostly) documented in config/commands.js
 *
 * @license MIT license
 */

/*

To reload chat commands:

/hotpatch chat

*/

const MAX_MESSAGE_LENGTH = 300;

const BROADCAST_COOLDOWN = 20 * 1000;

const MESSAGE_COOLDOWN = 5 * 60 * 1000;

const MAX_PARSE_RECURSION = 10;

var crypto = require('crypto');
var fs = require('fs');

var modlog = exports.modlog = {lobby: fs.createWriteStream('logs/modlog/modlog_lobby.txt', {flags:'a+'}), battle: fs.createWriteStream('logs/modlog/modlog_battle.txt', {flags:'a+'})};

/**
 * Command parser
 *
 * Usage:
 *   CommandParser.parse(message, room, user, connection)
 *
 * message - the message the user is trying to say
 * room - the room the user is trying to say it in
 * user - the user that sent the message
 * connection - the connection the user sent the message from
 *
 * Returns the message the user should say, or a falsy value which
 * means "don't say anything"
 *
 * Examples:
 *   CommandParser.parse("/join lobby", room, user, connection)
 *     will make the user join the lobby, and return false.
 *
 *   CommandParser.parse("Hi, guys!", room, user, connection)
 *     will return "Hi, guys!" if the user isn't muted, or
 *     if he's muted, will warn him that he's muted, and
 *     return false.
 */
var parse = exports.parse = function (message, room, user, connection, levelsDeep) {
	var cmd = '', target = '';
	if (!message || !message.trim().length) return;
	if (!levelsDeep) {
		levelsDeep = 0;
		// if (Config.emergencylog && (connection.ip === '62.195.195.62' || connection.ip === '86.141.154.222' || connection.ip === '189.134.175.221' || message.length > 2048 || message.length > 256 && message.substr(0, 5) !== '/utm ' && message.substr(0, 5) !== '/trn ')) {
		if (Config.emergencylog && (user.userid === 'pindapinda' || connection.ip === '62.195.195.62' || connection.ip === '86.141.154.222' || connection.ip === '189.134.175.221')) {
			Config.emergencylog.write('<' + user.name + '@' + connection.ip + '> ' + message + '\n');
		}
	}

	if (message.substr(0, 3) === '>> ') {
		// multiline eval
		message = '/eval ' + message.substr(3);
	} else if (message.substr(0, 4) === '>>> ') {
		// multiline eval
		message = '/evalbattle ' + message.substr(4);
	}

	if (message.substr(0, 2) !== '//' && message.substr(0, 1) === '/') {
		var spaceIndex = message.indexOf(' ');
		if (spaceIndex > 0) {
			cmd = message.substr(1, spaceIndex - 1);
			target = message.substr(spaceIndex + 1);
		} else {
			cmd = message.substr(1);
			target = '';
		}
	} else if (message.substr(0, 1) === '!') {
		var spaceIndex = message.indexOf(' ');
		if (spaceIndex > 0) {
			cmd = message.substr(0, spaceIndex);
			target = message.substr(spaceIndex + 1);
		} else {
			cmd = message;
			target = '';
		}
	}
	cmd = cmd.toLowerCase();
	var broadcast = false;
	if (cmd.charAt(0) === '!') {
		broadcast = true;
		cmd = cmd.substr(1);
	}

	var commandHandler = commands[cmd];
	if (typeof commandHandler === 'string') {
		// in case someone messed up, don't loop
		commandHandler = commands[commandHandler];
	}
	if (commandHandler) {
		var context = {
			sendReply: function (data) {
				if (this.broadcasting) {
					room.add(data, true);
				} else {
					connection.sendTo(room, data);
				}
			},
			sendReplyBox: function (html) {
				this.sendReply('|raw|<div class="infobox">' + html + '</div>');
			},
			popupReply: function (message) {
				connection.popup(message);
			},
			add: function (data) {
				room.add(data, true);
			},
			send: function (data) {
				room.send(data);
			},
			privateModCommand: function (data) {
				for (var i in room.users) {
					var user = room.users[i];
					// hardcoded for performance reasonss (this is an inner loop)
					if (user.isStaff || (room.auth && (room.auth[user.userid] || '+') !== '+')) {
						user.sendTo(room, data);
					}
				}
				this.logEntry(data);
				this.logModCommand(data);
			},
			logEntry: function (data) {
				room.logEntry(data);
			},
			addModCommand: function (text, logOnlyText) {
				this.add(text);
				this.logModCommand(text + (logOnlyText || ""));
			},
			logModCommand: function (result) {
				if (!modlog[room.id]) {
					if (room.battle) {
						modlog[room.id] = modlog['battle'];
					} else {
						modlog[room.id] = fs.createWriteStream('logs/modlog/modlog_' + room.id + '.txt', {flags:'a+'});
					}
				}
				modlog[room.id].write('[' + (new Date().toJSON()) + '] (' + room.id + ') ' + result + '\n');
			},
			can: function (permission, target, room) {
				if (!user.can(permission, target, room)) {
					this.sendReply("/" + cmd + " - Access denied.");
					return false;
				}
				return true;
			},
			canBroadcast: function (suppressMessage) {
				if (broadcast) {
					message = this.canTalk(message);
					if (!message) return false;
					if (!user.can('broadcast', null, room)) {
						connection.sendTo(room, "You need to be voiced to broadcast this command's information.");
						connection.sendTo(room, "To see it for yourself, use: /" + message.substr(1));
						return false;
					}

					// broadcast cooldown
					var normalized = toId(message);
					if (room.lastBroadcast === normalized &&
							room.lastBroadcastTime >= Date.now() - BROADCAST_COOLDOWN) {
						connection.sendTo(room, "You can't broadcast this because it was just broadcast.");
						return false;
					}
					this.add('|c|' + user.getIdentity(room.id) + '|' + (suppressMessage || message));
					room.lastBroadcast = normalized;
					room.lastBroadcastTime = Date.now();

					this.broadcasting = true;
				}
				return true;
			},
			parse: function (message) {
				if (levelsDeep > MAX_PARSE_RECURSION) {
					return this.sendReply("Error: Too much recursion");
				}
				return parse(message, room, user, connection, levelsDeep + 1);
			},
			canTalk: function (message, relevantRoom) {
				var innerRoom = (relevantRoom !== undefined) ? relevantRoom : room;
				return canTalk(user, innerRoom, connection, message);
			},
			canHTML: function (html) {
				html = ''+(html||'');
				var images = html.match(/<img\b[^<>]*/ig);
				if (!images) return true;
				for (var i = 0; i < images.length; i++) {
					if (!/width=([0-9]+|"[0-9]+")/i.test(images[i]) || !/height=([0-9]+|"[0-9]+")/i.test(images[i])) {
						this.sendReply('All images must have a width and height attribute');
						return false;
					}
				}
				return true;
			},
			targetUserOrSelf: function (target, exactName) {
				if (!target) {
					this.targetUsername = user.name;
					return user;
				}
				this.splitTarget(target, exactName);
				return this.targetUser;
			},
			getLastIdOf: function (user) {
				if (typeof user === 'string') user = Users.get(user);
				return (user.named ? user.userid : (Object.keys(user.prevNames).last() || user.userid));
			},
			splitTarget: splitTarget
		};

		var result = commandHandler.call(context, target, room, user, connection, cmd, message);
		if (result === undefined) result = false;

		return result;
	} else {
		// Check for mod/demod/admin/deadmin/etc depending on the group ids
		for (var g in Config.groups) {
			var groupid = Config.groups[g].id;
			if (cmd === groupid) {
				return parse('/promote ' + toId(target) + ', ' + g, room, user, connection);
			} else if (cmd === 'de' + groupid || cmd === 'un' + groupid) {
				return parse('/demote ' + toId(target), room, user, connection);
			} else if (cmd === 'room' + groupid) {
				return parse('/roompromote ' + toId(target) + ', ' + g, room, user, connection);
			} else if (cmd === 'roomde' + groupid || cmd === 'deroom' + groupid || cmd === 'roomun' + groupid) {
				return parse('/roomdemote ' + toId(target), room, user, connection);
			}
		}

		if (message.substr(0, 1) === '/' && cmd) {
			// To guard against command typos, we now emit an error message
			return connection.sendTo(room.id, "The command '/" + cmd + "' was unrecognized. To send a message starting with '/" + cmd + "', type '//" + cmd + "'.");
		}
	}

	message = canTalk(user, room, connection, message);
	if (!message) return false;

	return message;
};

function splitTarget(target, exactName) {
	var commaIndex = target.indexOf(',');
	if (commaIndex < 0) {
		targetUser = Users.get(target, exactName);
		this.targetUser = targetUser;
		this.targetUsername = targetUser ? targetUser.name : target;
		return '';
	}
	var targetUser = Users.get(target.substr(0, commaIndex), exactName);
	if (!targetUser) {
		targetUser = null;
	}
	this.targetUser = targetUser;
	this.targetUsername = targetUser ? targetUser.name : target.substr(0, commaIndex);
	return target.substr(commaIndex + 1).trim();
}

/**
 * Can this user talk?
 * Shows an error message if not.
 */
function canTalk(user, room, connection, message) {
	if (!user.named) {
		connection.popup("You must choose a name before you can talk.");
		return false;
	}
	if (room && user.locked) {
		connection.sendTo(room, "You are locked from talking in chat.");
		return false;
	}
	if (room && user.mutedRooms[room.id]) {
		connection.sendTo(room, "You are muted and cannot talk in this room.");
		return false;
	}
	if (room && room.modchat) {
		if (room.modchat === 'crash') {
			if (!user.can('ignorelimits')) {
				connection.sendTo(room, "Because the server has crashed, you cannot speak in lobby chat.");
				return false;
			}
		} else {
			var userGroup = user.group;
			if (room.auth) {
				if (room.auth[user.userid]) {
					userGroup = room.auth[user.userid];
				} else if (room.isPrivate) {
					userGroup = ' ';
				}
			}
			if (!user.autoconfirmed && (room.auth && room.auth[user.userid] || user.group) === ' ' && room.modchat === 'autoconfirmed') {
				connection.sendTo(room, "Because moderated chat is set, your account must be at least one week old and you must have won at least one ladder game to speak in this room.");
				return false;
			} else if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(room.modchat)) {
				var groupName = Config.groups[room.modchat].name || room.modchat;
				connection.sendTo(room, "Because moderated chat is set, you must be of rank " + groupName + " or higher to speak in this room.");
				return false;
			}
		}
	}
	if (room && !(user.userid in room.users)) {
		connection.popup("You can't send a message to this room without being in it.");
		return false;
	}

	if (typeof message === 'string') {
		if (!message) {
			connection.popup("Your message can't be blank.");
			return false;
		}
		if (message.length > MAX_MESSAGE_LENGTH && !user.can('ignorelimits')) {
			connection.popup("Your message is too long:\n\n" + message);
			return false;
		}

		// hardcoded low quality website
		if (/\bnimp\.org\b/i.test(message)) return false;

		// remove zalgo
		message = message.replace(/[\u0300-\u036f\u0E31\u0E34-\u0E3A\u0E47-\u0E4E]{3,}/g, '');

		if (room && room.id === 'lobby') {
			var normalized = message.trim();
			if ((normalized === user.lastMessage) &&
					((Date.now() - user.lastMessageTime) < MESSAGE_COOLDOWN)) {
				connection.popup("You can't send the same message again so soon.");
				return false;
			}
			user.lastMessage = message;
			user.lastMessageTime = Date.now();

			if (user.group === ' ') {
				if (message.toLowerCase().indexOf('spoiler:') >= 0 || message.toLowerCase().indexOf('spoilers:') >= 0) {
					connection.sendTo(room, "Due to spam, spoilers can't be sent to the lobby.");
					return false;
				}
			}
		}

		if (Config.chatfilter) {
			return Config.chatfilter(user, room, connection, message);
		}
		return message;
	}

	return true;
}

exports.package = {};
fs.readFile('package.json', function (err, data) {
	if (err) return;
	exports.package = JSON.parse(data);
});

exports.uncacheTree = function (root) {
	var uncache = [require.resolve(root)];
	do {
		var newuncache = [];
		for (var i = 0; i < uncache.length; ++i) {
			if (require.cache[uncache[i]]) {
				newuncache.push.apply(newuncache,
					require.cache[uncache[i]].children.map(function (module) {
						return module.filename;
					})
				);
				delete require.cache[uncache[i]];
			}
		}
		uncache = newuncache;
	} while (uncache.length > 0);
};

/*********************************************************
 * Commands
 *********************************************************/

var commands = exports.commands = require('./commands.js').commands;

var customCommands = require('./config/commands.js');
if (customCommands && customCommands.commands) {
	Object.merge(commands, customCommands.commands);
}

/*********************************************************
 * Install plug-in commands
 *********************************************************/
var plugins = require('./chat-plugins.js').plugins;
for (var p in plugins) {
	if (plugins[p].commands) Object.merge(commands, plugins[p].commands);
}
