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

	target = context.canTalk(target, null, targetUser);
	if (!target) return false;

	let buf;
	if ((target.charAt(0) === '/' && target.charAt(1) !== '/') || (target.charAt(0) === '!' && /[a-z0-9]/.test(target.charAt(1)))) {
		// PM command
		if (targetUser === user && target.charAt(0) === '!') {
			// Don't allow users to PM broadcast themselves commands
			target = target.replace('!', '/');
		}
		let innerCmdIndex = target.indexOf(' ');
		let innerCmd = (innerCmdIndex >= 0 ? target.slice(1, innerCmdIndex) : target.slice(1));
		let innerTarget = (innerCmdIndex >= 0 ? target.slice(innerCmdIndex + 1) : '');
		context.cmdToken = target.charAt(0);
		context.cmd = innerCmd;
		context.message = target;
		context.target = innerTarget;

		if (typeof CommandParser.commands[innerCmd] === 'string') {
			innerCmd = CommandParser.commands[innerCmd];
		}
		switch (innerCmd) {
		case 'me':
		case 'mee':
		case 'announce':
			break;
		case 'ME':
		case 'MEE':
			buf = '|pm|' + user.getIdentity().toUpperCase() + '|' + targetUser.getIdentity() + '|/' + innerCmd.toLowerCase() + ' ' + innerTarget;
			break;
		case 'ignore':
		case 'unignore':
			context.errorReply(`This command can only be used by itself to ignore the person you're talking to: "/${innerCmd}", not "/${innerCmd} ${innerTarget}"`);
			return;
		case 'invite': {
			let targetRoom = Rooms.search(innerTarget);
			if (!targetRoom || targetRoom === Rooms.global) return context.errorReply('The room "' + innerTarget + '" does not exist.');
			if (targetRoom.staffRoom && !targetUser.isStaff) return context.errorReply('User "' + context.targetUsername + '" requires global auth to join room "' + targetRoom.id + '".');
			if (targetRoom.modjoin) {
				if (targetRoom.auth && (targetRoom.isPrivate === true || targetUser.group === ' ') && !(targetUser.userid in targetRoom.auth)) {
					context.parse('/roomvoice ' + targetUser.name, false, targetRoom);
					if (!(targetUser.userid in targetRoom.auth)) {
						return;
					}
				}
			}
			if (targetRoom.isPrivate === true && targetRoom.modjoin && targetRoom.auth) {
				if (!(user.userid in targetRoom.auth)) {
					return context.errorReply('The room "' + innerTarget + '" does not exist.');
				}
				if (Config.groupsranking.indexOf(targetRoom.auth[targetUser.userid] || ' ') < Config.groupsranking.indexOf(targetRoom.modjoin) && !targetUser.can('bypassall')) {
					return context.errorReply('The user "' + targetUser.name + '" does not have permission to join "' + innerTarget + '".');
				}
			}
			if (targetRoom.auth && targetRoom.isPrivate && !(user.userid in targetRoom.auth) && !user.can('makeroom')) {
				return context.errorReply('You do not have permission to invite people to this room.');
			}

			target = '/invite ' + targetRoom.id;
			break;
		}
		default:
			if (CommandParser.commands['!' + innerCmd]) {
				target = CommandParser.commands[innerCmd].call(context, innerTarget, context.room, context.user, context.connection, context.cmd, target);
				if (!target || typeof target.then === 'function') return;
			} else {
				return context.errorReply(`The command "/${innerCmd}" does not exist or is unavailable in private messages. To send a message starting with "/${innerCmd}", type "//${innerCmd}".`);
			}
		}
	}

	if (!buf) buf = '|pm|' + user.getIdentity() + '|' + targetUser.getIdentity() + '|' + target;
	user.send(buf);
	if (targetUser !== user) targetUser.send(buf);
	targetUser.lastPM = user.userid;
	user.lastPM = targetUser.userid;
};
