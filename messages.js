/**
 * Messages
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles sending private messages between users.
 *
 * @license MIT license
 */

'use strict';

let Messages = module.exports;

Messages.send = function (target, context) {
	let targetUser = context.targetUser;
	let user = context.user;

	if (!targetUser.connected) {
		return context.errorReply("User " + context.targetUsername + " is offline.");
	}

	if (Config.pmmodchat && !user.matchesRank(Config.pmmodchat)) {
		let groupName = Config.groups[Config.pmmodchat] && Config.groups[Config.pmmodchat].name || Config.pmmodchat;
		return context.errorReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to PM users.");
	}

	if (user.locked && !targetUser.can('lock')) {
		return context.errorReply("You can only private message members of the global moderation team (users marked by @ or above in the Help room) when locked.");
	}
	if (targetUser.locked && !user.can('lock')) {
		return context.errorReply("This user is locked and cannot PM.");
	}
	if (targetUser.ignorePMs && targetUser.ignorePMs !== user.group && !user.can('lock')) {
		if (!targetUser.can('lock')) {
			return context.errorReply("This user is blocking private messages right now.");
		} else if (targetUser.can('bypassall')) {
			return context.errorReply("This admin is too busy to answer private messages right now. Please contact a different staff member.");
		}
	}
	if (user.ignorePMs && user.ignorePMs !== targetUser.group && !targetUser.can('lock')) {
		return context.errorReply("You are blocking private messages right now.");
	}

	if (target.startsWith('/me') && /[^A-Za-z0-9 ]/.test(target.charAt(3))) {
		target = '/mee ' + target.slice(3);
	} else if (target.startsWith('/ME') && /[^A-Za-z0-9 ]/.test(target.charAt(3))) {
		target = '/MEE ' + target.slice(3);
	}

	let buf;
	if ((target.charAt(0) === '/' && target.charAt(1) !== '/') || (target.charAt(0) === '!' && /[a-z0-9]/.test(target.charAt(1)))) {
		// PM command
		let innerCmdIndex = target.indexOf(' ');
		let innerCmd = (innerCmdIndex >= 0 ? target.slice(1, innerCmdIndex) : target.slice(1)).toLowerCase();
		let innerTarget = (innerCmdIndex >= 0 ? target.slice(innerCmdIndex + 1) : '');
		let cmdToken = target.charAt(0);
		context.cmdToken = cmdToken;
		context.cmd = innerCmd;
		context.message = target;
		context.target = innerTarget;

		if (typeof CommandParser.commands[innerCmd] === 'string') {
			innerCmd = CommandParser.commands[innerCmd];
		}
		if (CommandParser.commands['!' + innerCmd]) {
			target = CommandParser.commands[innerCmd].call(context, innerTarget, undefined, context.user, context.connection, context.cmd, target);
		} else if (innerCmd) {
			return context.errorReply(`The command "/${innerCmd}" is unavailable in private messages. To send a message starting with "/${innerCmd}", type "//${innerCmd}".`);
		} else {
			if (cmdToken === '!') {
				if (/[a-z0-9]/.test(innerCmd.charAt(0))) {
					return context.errorReply(`The command "${cmdToken}${innerCmd}" does not exist.`);
				}
			} else {
				return context.errorReply(`The command "${cmdToken}${innerCmd}" does not exist. To send a message starting with "${cmdToken}${innerCmd}", type "${cmdToken}${cmdToken}${innerCmd}".`);
			}
		}
	} else {
		target = context.canTalk(target, null, targetUser);
	}

	if (!target || typeof target.then === 'function') return;
	if (!buf) buf = '|pm|' + user.getIdentity() + '|' + targetUser.getIdentity() + '|' + target;
	user.send(buf);
	if (targetUser !== user) targetUser.send(buf);
	targetUser.lastPM = user.userid;
	user.lastPM = targetUser.userid;
};
