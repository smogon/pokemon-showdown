/**
 * System commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are system commands - commands required for Pokemon Showdown
 * to run. A lot of these are sent by the client.
 *
 * System commands should not be modified, added, or removed. If you'd
 * like to modify or add commands, add or edit files in chat-plugins/
 *
 * For the API, see chat-plugins/COMMANDS.md
 *
 * @license MIT license
 */

'use strict';

/* eslint no-else-return: "error" */

const crypto = require('crypto');
const fs = require('fs');

const MAX_REASON_LENGTH = 300;
const MUTE_LENGTH = 7 * 60 * 1000;
const HOURMUTE_LENGTH = 60 * 60 * 1000;

exports.commands = {

	version: function (target, room, user) {
		if (!this.runBroadcast()) return;
		this.sendReplyBox("Server version: <b>" + CommandParser.package.version + "</b>");
	},

	auth: 'authority',
	stafflist: 'authority',
	globalauth: 'authority',
	authlist: 'authority',
	authority: function (target, room, user, connection) {
		if (target) {
			let targetRoom = Rooms.search(target);
			let unavailableRoom = targetRoom && (targetRoom !== room && (targetRoom.modjoin || targetRoom.staffRoom) && !user.can('makeroom'));
			if (targetRoom && !unavailableRoom) return this.parse('/roomauth1 ' + target);
			return this.parse('/userauth ' + target);
		}
		let rankLists = {};
		let ranks = Object.keys(Config.groups);
		for (let u in Users.usergroups) {
			let rank = Users.usergroups[u].charAt(0);
			if (rank === ' ' || rank === '+') continue;
			// In case the usergroups.csv file is not proper, we check for the server ranks.
			if (ranks.includes(rank)) {
				let name = Users.usergroups[u].substr(1);
				if (!rankLists[rank]) rankLists[rank] = [];
				if (name) rankLists[rank].push(name);
			}
		}

		let buffer = Object.keys(rankLists).sort((a, b) =>
			(Config.groups[b] || {rank: 0}).rank - (Config.groups[a] || {rank: 0}).rank
		).map(r =>
			(Config.groups[r] ? Config.groups[r].name + "s (" + r + ")" : r) + ":\n" + rankLists[r].sort((a, b) => toId(a).localeCompare(toId(b))).join(", ")
		);

		if (!buffer.length) return connection.popup("This server has no global authority.");
		connection.popup(buffer.join("\n\n"));
	},
	authhelp: ["/auth - Show global staff for the server.",
		"/auth [room] - Show what roomauth a room has.",
		"/auth [user] - Show what global and roomauth a user has."],

	me: function (target, room, user, connection) {
		// By default, /me allows a blank message
		if (!target) target = '';
		target = this.canTalk('/me ' + target);
		if (!target) return;

		return target;
	},

	mee: function (target, room, user, connection) {
		// By default, /mee allows a blank message
		if (!target) target = '';
		target = target.trim();
		if (/[A-Za-z0-9]/.test(target.charAt(0))) {
			return this.errorReply("To prevent confusion, /mee can't start with a letter or number.");
		}
		target = this.canTalk('/mee ' + target);
		if (!target) return;

		return target;
	},

	avatar: function (target, room, user) {
		if (!target) return this.parse('/avatars');
		let parts = target.split(',');
		let avatar = parseInt(parts[0]);
		if (parts[0] === '#bw2elesa' || parts[0] === '#teamrocket' || parts[0] === '#yellow' || parts[0] === '#zinnia') {
			avatar = parts[0];
		}
		if (typeof avatar === 'number' && (!avatar || avatar > 294 || avatar < 1)) {
			if (!parts[1]) {
				this.errorReply("Invalid avatar.");
			}
			return false;
		}

		user.avatar = avatar;
		if (!parts[1]) {
			this.sendReply("Avatar changed to:\n" +
				'|raw|<img src="//play.pokemonshowdown.com/sprites/trainers/' + (typeof avatar === 'string' ? avatar.substr(1) : avatar) + '.png" alt="" width="80" height="80" />');
		}
	},
	avatarhelp: ["/avatar [avatar number 1 to 293] - Change your trainer sprite."],

	signout: 'logout',
	logout: function (target, room, user) {
		user.resetName();
	},

	requesthelp: 'report',
	report: function (target, room, user) {
		if (room.id === 'help') {
			this.sendReply("Ask one of the Moderators (@) in the Help room.");
		} else {
			this.parse('/join help');
		}
	},

	r: 'reply',
	reply: function (target, room, user) {
		if (!target) return this.parse('/help reply');
		if (!user.lastPM) {
			return this.errorReply("No one has PMed you yet.");
		}
		return this.parse('/msg ' + (user.lastPM || '') + ', ' + target);
	},
	replyhelp: ["/reply OR /r [message] - Send a private message to the last person you received a message from, or sent a message to."],

	pm: 'msg',
	whisper: 'msg',
	w: 'msg',
	msg: function (target, room, user, connection) {
		if (!target) return this.parse('/help msg');
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!target) {
			this.errorReply("You forgot the comma.");
			return this.parse('/help msg');
		}
		this.pmTarget = (targetUser || this.targetUsername);
		if (!targetUser) {
			this.errorReply("User " + this.targetUsername + " not found. Did you misspell their name?");
			return this.parse('/help msg');
		}
		if (!targetUser.connected) {
			return this.errorReply("User " + this.targetUsername + " is offline.");
		}

		if (Config.pmmodchat) {
			let userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				let groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
				this.errorReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to PM users.");
				return false;
			}
		}

		if (user.locked && !targetUser.can('lock')) {
			return this.errorReply("You can only private message members of the moderation team (users marked by %, @, &, or ~) when locked.");
		}
		if (targetUser.locked && !user.can('lock')) {
			return this.errorReply("This user is locked and cannot PM.");
		}
		if (targetUser.ignorePMs && targetUser.ignorePMs !== user.group && !user.can('lock')) {
			if (!targetUser.can('lock')) {
				return this.errorReply("This user is blocking private messages right now.");
			} else if (targetUser.can('bypassall')) {
				return this.errorReply("This admin is too busy to answer private messages right now. Please contact a different staff member.");
			}
		}
		if (user.ignorePMs && user.ignorePMs !== targetUser.group && !targetUser.can('lock')) {
			return this.errorReply("You are blocking private messages right now.");
		}

		target = this.canTalk(target, null, targetUser);
		if (!target) return false;

		let message;
		if (target.charAt(0) === '/' && target.charAt(1) !== '/') {
			// PM command
			let innerCmdIndex = target.indexOf(' ');
			let innerCmd = (innerCmdIndex >= 0 ? target.slice(1, innerCmdIndex) : target.slice(1));
			let innerTarget = (innerCmdIndex >= 0 ? target.slice(innerCmdIndex + 1) : '');
			switch (innerCmd) {
			case 'me':
			case 'mee':
			case 'announce':
				break;
			case 'ME':
			case 'MEE':
				message = '|pm|' + user.getIdentity().toUpperCase() + '|' + targetUser.getIdentity() + '|/' + innerCmd.toLowerCase() + ' ' + innerTarget;
				break;
			case 'invite':
			case 'inv': {
				let targetRoom = Rooms.search(innerTarget);
				if (!targetRoom || targetRoom === Rooms.global) return this.errorReply('The room "' + innerTarget + '" does not exist.');
				if (targetRoom.staffRoom && !targetUser.isStaff) return this.errorReply('User "' + this.targetUsername + '" requires global auth to join room "' + targetRoom.id + '".');
				if (targetRoom.modjoin) {
					if (targetRoom.auth && (targetRoom.isPrivate === true || targetUser.group === ' ') && !(targetUser.userid in targetRoom.auth)) {
						this.parse('/roomvoice ' + targetUser.name, false, targetRoom);
						if (!(targetUser.userid in targetRoom.auth)) {
							return;
						}
					}
				}
				if (targetRoom.isPrivate === true && targetRoom.modjoin && targetRoom.auth) {
					if (!(user.userid in targetRoom.auth)) {
						return this.errorReply('The room "' + innerTarget + '" does not exist.');
					}
					if (Config.groupsranking.indexOf(targetRoom.auth[targetUser.userid] || ' ') < Config.groupsranking.indexOf(targetRoom.modjoin) && !targetUser.can('bypassall')) {
						return this.errorReply('The user "' + targetUser.name + '" does not have permission to join "' + innerTarget + '".');
					}
				}
				if (targetRoom.auth && targetRoom.isPrivate && !(user.userid in targetRoom.auth) && !user.can('makeroom')) {
					return this.errorReply('You do not have permission to invite people to this room.');
				}

				target = '/invite ' + targetRoom.id;
				break;
			}
			default:
				return this.errorReply("The command '/" + innerCmd + "' was unrecognized or unavailable in private messages. To send a message starting with '/" + innerCmd + "', type '//" + innerCmd + "'.");
			}
		}

		if (!message) message = '|pm|' + user.getIdentity() + '|' + targetUser.getIdentity() + '|' + target;
		user.send(message);
		if (targetUser !== user) targetUser.send(message);
		targetUser.lastPM = user.userid;
		user.lastPM = targetUser.userid;
	},
	msghelp: ["/msg OR /whisper OR /w [username], [message] - Send a private message."],

	blockpm: 'ignorepms',
	blockpms: 'ignorepms',
	ignorepm: 'ignorepms',
	ignorepms: function (target, room, user) {
		if (user.ignorePMs === (target || true)) return this.errorReply("You are already blocking private messages! To unblock, use /unblockpms");
		if (user.can('lock') && !user.can('bypassall')) return this.errorReply("You are not allowed to block private messages.");
		user.ignorePMs = true;
		if (target in Config.groups) {
			user.ignorePMs = target;
			return this.sendReply("You are now blocking private messages, except from staff and " + target + ".");
		}
		return this.sendReply("You are now blocking private messages, except from staff.");
	},
	ignorepmshelp: ["/blockpms - Blocks private messages. Unblock them with /unignorepms."],

	unblockpm: 'unignorepms',
	unblockpms: 'unignorepms',
	unignorepm: 'unignorepms',
	unignorepms: function (target, room, user) {
		if (!user.ignorePMs) return this.errorReply("You are not blocking private messages! To block, use /blockpms");
		user.ignorePMs = false;
		return this.sendReply("You are no longer blocking private messages.");
	},
	unignorepmshelp: ["/unblockpms - Unblocks private messages. Block them with /blockpms."],

	idle: 'away',
	afk: 'away',
	away: function (target, room, user) {
		this.parse('/blockchallenges');
		this.parse('/blockpms ' + target);
	},
	awayhelp: ["/away - Blocks challenges and private messages. Unblock them with /back."],

	unaway: 'back',
	unafk: 'back',
	back: function () {
		this.parse('/unblockpms');
		this.parse('/unblockchallenges');
	},
	backhelp: ["/back - Unblocks challenges and/or private messages, if either are blocked."],

	rank: function (target, room, user) {
		if (!target) target = user.name;

		Ladders.visualizeAll(target).then(values => {
			let buffer = '<div class="ladder"><table>';
			buffer += '<tr><td colspan="8">User: <strong>' + Tools.escapeHTML(target) + '</strong></td></tr>';

			let ratings = values.join('');
			if (!ratings) {
				buffer += '<tr><td colspan="8"><em>This user has not played any ladder games yet.</em></td></tr>';
			} else {
				buffer += '<tr><th>Format</th><th><abbr title="Elo rating">Elo</abbr></th><th>W</th><th>L</th><th>Total</th>';
				buffer += ratings;
			}
			buffer += '</table></div>';

			this.sendReply('|raw|' + buffer);
		});
	},

	makeprivatechatroom: 'makechatroom',
	makechatroom: function (target, room, user, connection, cmd) {
		if (!this.can('makeroom')) return;

		// `,` is a delimiter used by a lot of /commands
		// `|` and `[` are delimiters used by the protocol
		// `-` has special meaning in roomids
		if (target.includes(',') || target.includes('|') || target.includes('[') || target.includes('-')) {
			return this.errorReply("Room titles can't contain any of: ,|[-");
		}

		let id = toId(target);
		if (!id) return this.parse('/help makechatroom');
		// Check if the name already exists as a room or alias
		if (Rooms.search(id)) return this.errorReply("The room '" + target + "' already exists.");
		if (!Rooms.global.addChatRoom(target)) return this.errorReply("An error occurred while trying to create the room '" + target + "'.");

		if (cmd === 'makeprivatechatroom') {
			let targetRoom = Rooms.search(target);
			targetRoom.isPrivate = true;
			targetRoom.chatRoomData.isPrivate = true;
			Rooms.global.writeChatRoomData();
			if (Rooms.get('upperstaff')) {
				Rooms.get('upperstaff').add('|raw|<div class="broadcast-green">Private chat room created: <b>' + Tools.escapeHTML(target) + '</b></div>').update();
			}
			this.sendReply("The private chat room '" + target + "' was created.");
		} else {
			if (Rooms.get('staff')) {
				Rooms.get('staff').add('|raw|<div class="broadcast-green">Public chat room created: <b>' + Tools.escapeHTML(target) + '</b></div>').update();
			}
			if (Rooms.get('upperstaff')) {
				Rooms.get('upperstaff').add('|raw|<div class="broadcast-green">Public chat room created: <b>' + Tools.escapeHTML(target) + '</b></div>').update();
			}
			this.sendReply("The chat room '" + target + "' was created.");
		}
	},
	makechatroomhelp: ["/makechatroom [roomname] - Creates a new room named [roomname]. Requires: & ~"],

	makegroupchat: function (target, room, user, connection, cmd) {
		if (!user.autoconfirmed) {
			return this.errorReply("You must be autoconfirmed to make a groupchat.");
		}
		if (!user.confirmed) {
			return this.errorReply("You must be global voice or roomdriver+ in some public room to make a groupchat.");
		}
		// if (!this.can('makegroupchat')) return false;
		if (target.length > 64) return this.errorReply("Title must be under 32 characters long.");
		let targets = target.split(',', 2);

		// Title defaults to a random 8-digit number.
		let title = targets[0].trim();
		if (title.length >= 32) {
			return this.errorReply("Title must be under 32 characters long.");
		} else if (!title) {
			title = ('' + Math.floor(Math.random() * 100000000));
		} else if (Config.chatfilter) {
			let filterResult = Config.chatfilter.call(this, title, user, null, connection);
			if (!filterResult) return;
			if (title !== filterResult) {
				return this.errorReply("Invalid title.");
			}
		}
		// `,` is a delimiter used by a lot of /commands
		// `|` and `[` are delimiters used by the protocol
		// `-` has special meaning in roomids
		if (title.includes(',') || title.includes('|') || title.includes('[') || title.includes('-')) {
			return this.errorReply("Room titles can't contain any of: ,|[-");
		}

		// Even though they're different namespaces, to cut down on confusion, you
		// can't share names with registered chatrooms.
		let existingRoom = Rooms.search(toId(title));
		if (existingRoom && !existingRoom.modjoin) return this.errorReply("The room '" + title + "' already exists.");
		// Room IDs for groupchats are groupchat-TITLEID
		let titleid = toId(title);
		if (!titleid) {
			titleid = '' + Math.floor(Math.random() * 100000000);
		}
		let roomid = 'groupchat-' + user.userid + '-' + titleid;
		// Titles must be unique.
		if (Rooms.search(roomid)) return this.errorReply("A group chat named '" + title + "' already exists.");
		// Tab title is prefixed with '[G]' to distinguish groupchats from
		// registered chatrooms

		if (Monitor.countGroupChat(connection.ip)) {
			this.errorReply("Due to high load, you are limited to creating 4 group chats every hour.");
			return;
		}

		// Privacy settings, default to hidden.
		let privacy = (toId(targets[1]) === 'private') ? true : 'hidden';

		let groupChatLink = '<code>&lt;&lt;' + roomid + '>></code>';
		let groupChatURL = '';
		if (Config.serverid) {
			groupChatURL = 'http://' + (Config.serverid === 'showdown' ? 'psim.us' : Config.serverid + '.psim.us') + '/' + roomid;
			groupChatLink = '<a href="' + groupChatURL + '">' + groupChatLink + '</a>';
		}
		let titleHTML = '';
		if (/^[0-9]+$/.test(title)) {
			titleHTML = groupChatLink;
		} else {
			titleHTML = Tools.escapeHTML(title) + ' <small style="font-weight:normal;font-size:9pt">' + groupChatLink + '</small>';
		}
		let targetRoom = Rooms.createChatRoom(roomid, '[G] ' + title, {
			isPersonal: true,
			isPrivate: privacy,
			auth: {},
			introMessage: '<h2 style="margin-top:0">' + titleHTML + '</h2><p>There are several ways to invite people:<br />- in this chat: <code>/invite USERNAME</code><br />- anywhere in PS: link to <code>&lt;&lt;' + roomid + '>></code>' + (groupChatURL ? '<br />- outside of PS: link to <a href="' + groupChatURL + '">' + groupChatURL + '</a>' : '') + '</p><p>This room will expire after 40 minutes of inactivity or when the server is restarted.</p><p style="margin-bottom:0"><button name="send" value="/roomhelp">Room management</button>',
		});
		if (targetRoom) {
			// The creator is RO.
			targetRoom.auth[user.userid] = '#';
			// Join after creating room. No other response is given.
			user.joinRoom(targetRoom.id);
			return;
		}
		return this.errorReply("An unknown error occurred while trying to create the room '" + title + "'.");
	},
	makegroupchathelp: ["/makegroupchat [roomname], [hidden|private] - Creates a group chat named [roomname]. Leave off privacy to default to hidden. Requires global voice or roomdriver+ in a public room to make a groupchat."],

	deregisterchatroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		this.errorReply("NOTE: You probably want to use `/deleteroom` now that it exists.");
		let id = toId(target);
		if (!id) return this.parse('/help deregisterchatroom');
		let targetRoom = Rooms.search(id);
		if (!targetRoom) return this.errorReply("The room '" + target + "' doesn't exist.");
		target = targetRoom.title || targetRoom.id;
		if (Rooms.global.deregisterChatRoom(id)) {
			this.sendReply("The room '" + target + "' was deregistered.");
			this.sendReply("It will be deleted as of the next server restart.");
			return;
		}
		return this.errorReply("The room '" + target + "' isn't registered.");
	},
	deregisterchatroomhelp: ["/deregisterchatroom [roomname] - Deletes room [roomname] after the next server restart. Requires: & ~"],

	deletechatroom: 'deleteroom',
	deletegroupchat: 'deleteroom',
	deleteroom: function (target, room, user) {
		if (room.isPersonal) {
			if (!this.can('editroom', null, room)) return;
		} else {
			if (!this.can('makeroom')) return;
		}
		let roomid = target.trim();
		if (!roomid) return this.parse('/help deleteroom');
		let targetRoom = Rooms.search(roomid);
		if (!targetRoom) return this.errorReply("The room '" + target + "' doesn't exist.");
		target = targetRoom.title || targetRoom.id;

		if (targetRoom.id === 'global') {
			return this.errorReply("This room can't be deleted.");
		}

		if (targetRoom.chatRoomData) {
			if (targetRoom.isPrivate) {
				if (Rooms.get('upperstaff')) {
					Rooms.get('upperstaff').add('|raw|<div class="broadcast-red">Private chat room deleted: <b>' + Tools.escapeHTML(target) + '</b></div>').update();
				}
			} else {
				if (Rooms.get('staff')) {
					Rooms.get('staff').add('|raw|<div class="broadcast-red">Public chat room deleted: <b>' + Tools.escapeHTML(target) + '</b></div>').update();
				}
				if (Rooms.get('upperstaff')) {
					Rooms.get('upperstaff').add('|raw|<div class="broadcast-red">Public chat room deleted: <b>' + Tools.escapeHTML(target) + '</b></div>').update();
				}
			}
		}

		targetRoom.add("|raw|<div class=\"broadcast-red\"><b>This room has been deleted.</b></div>");
		targetRoom.update(); // |expire| needs to be its own message
		targetRoom.add("|expire|This room has been deleted.");
		this.sendReply("The room '" + target + "' was deleted.");
		targetRoom.update();
		targetRoom.destroy();
	},
	deleteroomhelp: ["/deleteroom [roomname] - Deletes room [roomname]. Requires: & ~"],

	hideroom: 'privateroom',
	hiddenroom: 'privateroom',
	secretroom: 'privateroom',
	publicroom: 'privateroom',
	privateroom: function (target, room, user, connection, cmd) {
		if (room.battle || room.isPersonal) {
			if (!this.can('editroom', null, room)) return;
		} else {
			// registered chatrooms show up on the room list and so require
			// higher permissions to modify privacy settings
			if (!this.can('makeroom')) return;
		}
		let setting;
		switch (cmd) {
		case 'privateroom':
			return this.parse('/help privateroom');
		case 'publicroom':
			setting = false;
			break;
		case 'secretroom':
			setting = true;
			break;
		default:
			if (room.isPrivate === true && target !== 'force') {
				return this.sendReply("This room is a secret room. Use `/publicroom` to make it public, or `/hiddenroom force` to force hidden.");
			}
			setting = 'hidden';
			break;
		}

		if ((setting === true || room.isPrivate === true) && !room.isPersonal) {
			if (!this.can('makeroom')) return;
		}

		if (target === 'off' || !setting) {
			if (room.isPersonal) return this.errorReply("This room can't be made public.");
			delete room.isPrivate;
			this.addModCommand("" + user.name + " made this room public.");
			if (room.chatRoomData) {
				delete room.chatRoomData.isPrivate;
				Rooms.global.writeChatRoomData();
			}
		} else {
			if (room.isPrivate === setting) {
				return this.errorReply("This room is already " + (setting === true ? 'secret' : setting) + ".");
			}
			room.isPrivate = setting;
			this.addModCommand("" + user.name + " made this room " + (setting === true ? 'secret' : setting) + ".");
			if (room.chatRoomData) {
				room.chatRoomData.isPrivate = setting;
				Rooms.global.writeChatRoomData();
			}
		}
	},
	privateroomhelp: ["/secretroom - Makes a room secret. Secret rooms are visible to & and up. Requires: & ~",
		"/hiddenroom [on/off] - Makes a room hidden. Hidden rooms are visible to % and up, and inherit global ranks. Requires: \u2605 & ~",
		"/publicroom - Makes a room public. Requires: \u2605 & ~"],

	modjoin: function (target, room, user) {
		if (room.battle || room.isPersonal) {
			if (!this.can('editroom', null, room)) return;
		} else {
			if (!this.can('makeroom')) return;
		}
		if (room.tour && !room.tour.modjoin) return this.errorReply("You can't do this in tournaments where modjoin is prohibited.");
		if (target === 'off' || target === 'false') {
			delete room.modjoin;
			this.addModCommand("" + user.name + " turned off modjoin.");
			if (room.chatRoomData) {
				delete room.chatRoomData.modjoin;
				Rooms.global.writeChatRoomData();
			}
		} else {
			if (target === 'on' || target === 'true' || !target) {
				room.modjoin = true;
				this.addModCommand("" + user.name + " turned on modjoin.");
			} else if (target in Config.groups) {
				if (room.battle && !this.can('makeroom')) return;
				if (room.isPersonal && !user.can('makeroom') && target !== '+') return this.errorReply("/modjoin - Access denied from setting modjoin past + in group chats.");
				room.modjoin = target;
				this.addModCommand("" + user.name + " set modjoin to " + target + ".");
			} else {
				this.errorReply("Unrecognized modjoin setting.");
				return false;
			}
			if (room.chatRoomData) {
				room.chatRoomData.modjoin = room.modjoin;
				Rooms.global.writeChatRoomData();
			}
			if (!room.modchat) this.parse('/modchat ' + Config.groupsranking[1]);
			if (!room.isPrivate) this.parse('/hiddenroom');
		}
	},

	officialchatroom: 'officialroom',
	officialroom: function (target, room, user) {
		if (!this.can('makeroom')) return;
		if (!room.chatRoomData) {
			return this.errorReply("/officialroom - This room can't be made official");
		}
		if (target === 'off') {
			if (!room.isOfficial) return this.errorReply("This chat room is already unofficial.");
			delete room.isOfficial;
			this.addModCommand("" + user.name + " made this chat room unofficial.");
			delete room.chatRoomData.isOfficial;
			Rooms.global.writeChatRoomData();
		} else {
			if (room.isOfficial) return this.errorReply("This chat room is already official.");
			room.isOfficial = true;
			this.addModCommand("" + user.name + " made this chat room official.");
			room.chatRoomData.isOfficial = true;
			Rooms.global.writeChatRoomData();
		}
	},

	roomdesc: function (target, room, user) {
		if (!target) {
			if (!this.runBroadcast()) return;
			if (!room.desc) return this.sendReply("This room does not have a description set.");
			this.sendReplyBox("The room description is: " + Tools.escapeHTML(room.desc));
			return;
		}
		if (!this.can('declare')) return false;
		if (target.length > 80) return this.errorReply("Error: Room description is too long (must be at most 80 characters).");
		let normalizedTarget = ' ' + target.toLowerCase().replace('[^a-zA-Z0-9]+', ' ').trim() + ' ';

		if (normalizedTarget.includes(' welcome ')) {
			return this.errorReply("Error: Room description must not contain the word 'welcome'.");
		}
		if (normalizedTarget.slice(0, 9) === ' discuss ') {
			return this.errorReply("Error: Room description must not start with the word 'discuss'.");
		}
		if (normalizedTarget.slice(0, 12) === ' talk about ' || normalizedTarget.slice(0, 17) === ' talk here about ') {
			return this.errorReply("Error: Room description must not start with the phrase 'talk about'.");
		}

		room.desc = target;
		this.sendReply("(The room description is now: " + target + ")");

		this.privateModCommand("(" + user.name + " changed the roomdesc to: \"" + target + "\".)");

		if (room.chatRoomData) {
			room.chatRoomData.desc = room.desc;
			Rooms.global.writeChatRoomData();
		}
	},

	topic: 'roomintro',
	roomintro: function (target, room, user) {
		if (!target) {
			if (!this.runBroadcast()) return;
			if (!room.introMessage) return this.sendReply("This room does not have an introduction set.");
			this.sendReply('|raw|<div class="infobox infobox-limited">' + room.introMessage.replace(/\n/g, '') + '</div>');
			if (!this.broadcasting && user.can('declare', null, room)) {
				this.sendReply('Source:');
				this.sendReplyBox(
					'<code>/roomintro ' + Tools.escapeHTML(room.introMessage).split('\n').map(line => {
						return line.replace(/^(\t+)/, (match, $1) => '&nbsp;'.repeat(4 * $1.length)).replace(/^(\s+)/, (match, $1) => '&nbsp;'.repeat($1.length));
					}).join('<br />') + '</code>'
				);
			}
			return;
		}
		if (!this.can('declare', null, room)) return false;
		target = this.canHTML(target);
		if (!target) return;
		if (!/</.test(target)) {
			// not HTML, do some simple URL linking
			let re = /(https?:\/\/(([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?))/g;
			target = target.replace(re, '<a href="$1">$1</a>');
		}
		if (target.substr(0, 11) === '/roomintro ') target = target.substr(11);

		room.introMessage = target.replace(/\r/g, '');
		this.sendReply("(The room introduction has been changed to:)");
		this.sendReply('|raw|<div class="infobox infobox-limited">' + room.introMessage.replace(/\n/g, '') + '</div>');

		this.privateModCommand("(" + user.name + " changed the roomintro.)");
		this.logEntry(room.introMessage.replace(/\n/g, ''));

		if (room.chatRoomData) {
			room.chatRoomData.introMessage = room.introMessage;
			Rooms.global.writeChatRoomData();
		}
	},
	deletetopic: 'deleteroomintro',
	deleteroomintro: function (target, room, user) {
		if (!this.can('declare', null, room)) return false;
		if (!room.introMessage) return this.errorReply("This room does not have a introduction set.");

		this.privateModCommand("(" + user.name + " deleted the roomintro.)");
		this.logEntry(target);

		delete room.introMessage;
		if (room.chatRoomData) {
			delete room.chatRoomData.introMessage;
			Rooms.global.writeChatRoomData();
		}
	},

	stafftopic: 'staffintro',
	staffintro: function (target, room, user) {
		if (!target) {
			if (!this.can('mute', null, room)) return false;
			if (!room.staffMessage) return this.sendReply("This room does not have a staff introduction set.");
			this.sendReply('|raw|<div class="infobox">' + room.staffMessage.replace(/\n/g, '') + '</div>');
			if (user.can('ban', null, room)) {
				this.sendReply('Source:');
				this.sendReplyBox(
					'<code>/staffintro ' + Tools.escapeHTML(room.staffMessage).split('\n').map(line => {
						return line.replace(/^(\t+)/, (match, $1) => '&nbsp;'.repeat(4 * $1.length)).replace(/^(\s+)/, (match, $1) => '&nbsp;'.repeat($1.length));
					}).join('<br />') + '</code>'
				);
			}
			return;
		}
		if (!this.can('ban', null, room)) return false;
		target = this.canHTML(target);
		if (!target) return;
		if (!/</.test(target)) {
			// not HTML, do some simple URL linking
			let re = /(https?:\/\/(([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?))/g;
			target = target.replace(re, '<a href="$1">$1</a>');
		}
		if (target.substr(0, 12) === '/staffintro ') target = target.substr(12);

		room.staffMessage = target.replace(/\r/g, '');
		this.sendReply("(The staff introduction has been changed to:)");
		this.sendReply('|raw|<div class="infobox">' + target.replace(/\n/g, '') + '</div>');

		this.privateModCommand("(" + user.name + " changed the staffintro.)");
		this.logEntry(room.staffMessage.replace(/\n/g, ''));

		if (room.chatRoomData) {
			room.chatRoomData.staffMessage = room.staffMessage;
			Rooms.global.writeChatRoomData();
		}
	},
	deletestafftopic: 'deletestaffintro',
	deletestaffintro: function (target, room, user) {
		if (!this.can('ban', null, room)) return false;
		if (!room.staffMessage) return this.errorReply("This room does not have a staff introduction set.");

		this.privateModCommand("(" + user.name + " deleted the staffintro.)");
		this.logEntry(target);

		delete room.staffMessage;
		if (room.chatRoomData) {
			delete room.chatRoomData.staffMessage;
			Rooms.global.writeChatRoomData();
		}
	},

	roomalias: function (target, room, user) {
		if (!target) {
			if (!this.runBroadcast()) return;
			if (!room.aliases || !room.aliases.length) return this.sendReplyBox("This room does not have any aliases.");
			return this.sendReplyBox("This room has the following aliases: " + room.aliases.join(", ") + "");
		}
		if (!this.can('makeroom')) return false;
		let alias = toId(target);
		if (!alias.length) return this.errorReply("Only alphanumeric characters are valid in an alias.");
		if (Rooms.get(alias) || Rooms.aliases[alias]) return this.errorReply("You cannot set an alias to an existing room or alias.");
		if (room.isPersonal) return this.errorReply("Personal rooms can't have aliases.");

		Rooms.aliases[alias] = room.id;
		this.privateModCommand("(" + user.name + " added the room alias '" + target + "'.)");

		if (!room.aliases) room.aliases = [];
		room.aliases.push(alias);
		if (room.chatRoomData) {
			room.chatRoomData.aliases = room.aliases;
			Rooms.global.writeChatRoomData();
		}
	},

	removeroomalias: function (target, room, user) {
		if (!room.aliases) return this.sendReply("This room does not have any aliases.");
		if (!this.can('makeroom')) return false;
		let alias = toId(target);
		if (!alias.length || !Rooms.aliases[alias]) return this.errorReply("Please specify an existing alias.");
		if (Rooms.aliases[alias] !== room.id) return this.errorReply("You may only remove an alias from the current room.");

		this.privateModCommand("(" + user.name + " removed the room alias '" + target + "'.)");

		let aliasIndex = room.aliases.indexOf(alias);
		if (aliasIndex >= 0) {
			room.aliases.splice(aliasIndex, 1);
			delete Rooms.aliases[alias];
			Rooms.global.writeChatRoomData();
		}
	},

	roomowner: function (target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		if (!target) return this.parse('/help roomowner');
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		let userid = toId(name);

		if (!Users.isUsernameKnown(userid)) {
			return this.errorReply("User '" + this.targetUsername + "' is offline and unrecognized, and so can't be promoted.");
		}

		if (!this.can('makeroom')) return false;

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		room.auth[userid] = '#';
		this.addModCommand("" + name + " was appointed Room Owner by " + user.name + ".");
		if (targetUser) {
			targetUser.popup("You were appointed Room Owner by " + user.name + " in " + room.id + ".");
			room.onUpdateIdentity(targetUser);
		}
		Rooms.global.writeChatRoomData();
	},
	roomownerhelp: ["/roomowner [username] - Appoints [username] as a room owner. Requires: & ~"],

	roomdemote: 'roompromote',
	roompromote: function (target, room, user, connection, cmd) {
		if (!room.auth) {
			this.sendReply("/roompromote - This room isn't designed for per-room moderation");
			return this.sendReply("Before setting room mods, you need to set it up with /roomowner");
		}
		if (!target) return this.parse('/help roompromote');

		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let userid = toId(this.targetUsername);
		let name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) return this.parse('/help roompromote');
		if (!targetUser && !Users.isUsernameKnown(userid)) {
			return this.errorReply("User '" + name + "' is offline and unrecognized, and so can't be promoted.");
		}
		if (targetUser && !targetUser.registered) {
			return this.errorReply("User '" + name + "' is unregistered, and so can't be promoted.");
		}

		let currentGroup = ((room.auth && room.auth[userid]) || (room.isPrivate !== true && Users.usergroups[userid]) || ' ');
		let nextGroup = target;
		if (target === 'deauth') nextGroup = Config.groupsranking[0];
		if (!nextGroup) {
			return this.errorReply("Please specify a group such as /roomvoice or /roomdeauth");
		}
		if (!Config.groups[nextGroup]) {
			return this.errorReply("Group '" + nextGroup + "' does not exist.");
		}

		if (Config.groups[nextGroup].globalonly || (Config.groups[nextGroup].battleonly && !room.battle)) {
			return this.errorReply("Group 'room" + Config.groups[nextGroup].id + "' does not exist as a room rank.");
		}

		let groupName = Config.groups[nextGroup].name || "regular user";
		if ((room.auth[userid] || Config.groupsranking[0]) === nextGroup) {
			return this.errorReply("User '" + name + "' is already a " + groupName + " in this room.");
		}
		if (!user.can('makeroom')) {
			if (currentGroup !== ' ' && !user.can('room' + (Config.groups[currentGroup] ? Config.groups[currentGroup].id : 'voice'), null, room)) {
				return this.errorReply("/" + cmd + " - Access denied for promoting/demoting from " + (Config.groups[currentGroup] ? Config.groups[currentGroup].name : "an undefined group") + ".");
			}
			if (nextGroup !== ' ' && !user.can('room' + Config.groups[nextGroup].id, null, room)) {
				return this.errorReply("/" + cmd + " - Access denied for promoting/demoting to " + Config.groups[nextGroup].name + ".");
			}
		}
		if (targetUser && targetUser.locked && !room.isPrivate && !room.battle && !room.isPersonal && (nextGroup === '%' || nextGroup === '@')) {
			return this.errorReply("Locked users can't be promoted.");
		}

		if (nextGroup === ' ') {
			delete room.auth[userid];
		} else {
			room.auth[userid] = nextGroup;
		}

		// Only show popup if: user is online and in the room, the room is public, and not a groupchat or a battle.
		let needsPopup = targetUser && room.users[targetUser.userid] && !room.isPrivate && !room.isPersonal && !room.battle;

		if (nextGroup in Config.groups && currentGroup in Config.groups && Config.groups[nextGroup].rank < Config.groups[currentGroup].rank) {
			if (targetUser && room.users[targetUser.userid] && !Config.groups[nextGroup].modlog) {
				// if the user can't see the demotion message (i.e. rank < %), it is shown in the chat
				targetUser.send(">" + room.id + "\n(You were demoted to Room " + groupName + " by " + user.name + ".)");
			}
			this.privateModCommand("(" + name + " was demoted to Room " + groupName + " by " + user.name + ".)");
			if (needsPopup) targetUser.popup("You were demoted to Room " + groupName + " by " + user.name + " in " + room.id + ".");
		} else if (nextGroup === '#') {
			this.addModCommand("" + name + " was promoted to " + groupName + " by " + user.name + ".");
			if (needsPopup) targetUser.popup("You were promoted to " + groupName + " by " + user.name + " in " + room.id + ".");
		} else {
			this.addModCommand("" + name + " was promoted to Room " + groupName + " by " + user.name + ".");
			if (needsPopup) targetUser.popup("You were promoted to Room " + groupName + " by " + user.name + " in " + room.id + ".");
		}

		if (targetUser) targetUser.updateIdentity(room.id);
		if (room.chatRoomData) Rooms.global.writeChatRoomData();
	},
	roompromotehelp: ["/roompromote OR /roomdemote [username], [group symbol] - Promotes/demotes the user to the specified room rank. Requires: @ # & ~",
		"/room[group] [username] - Promotes/demotes the user to the specified room rank. Requires: @ # & ~",
		"/roomdeauth [username] - Removes all room rank from the user. Requires: @ # & ~"],

	roomstaff: 'roomauth',
	roomauth1: 'roomauth',
	roomauth: function (target, room, user, connection, cmd) {
		let userLookup = '';
		if (cmd === 'roomauth1') userLookup = '\n\nTo look up auth for a user, use /userauth ' + target;
		let targetRoom = room;
		if (target) targetRoom = Rooms.search(target);
		let unavailableRoom = targetRoom && (targetRoom !== room && (targetRoom.modjoin || targetRoom.staffRoom) && !user.can('makeroom'));
		if (!targetRoom || unavailableRoom) return this.errorReply("The room '" + target + "' does not exist.");
		if (!targetRoom.auth) return this.sendReply("/roomauth - The room '" + (targetRoom.title ? targetRoom.title : target) + "' isn't designed for per-room moderation and therefore has no auth list." + userLookup);

		let rankLists = {};
		for (let u in targetRoom.auth) {
			if (!rankLists[targetRoom.auth[u]]) rankLists[targetRoom.auth[u]] = [];
			rankLists[targetRoom.auth[u]].push(u);
		}

		let buffer = Object.keys(rankLists).sort((a, b) =>
			(Config.groups[b] || {rank:0}).rank - (Config.groups[a] || {rank:0}).rank
		).map(r => {
			let roomRankList = rankLists[r].sort();
			roomRankList = roomRankList.map(s => s in targetRoom.users ? "**" + s + "**" : s);
			return (Config.groups[r] ? Config.groups[r].name + "s (" + r + ")" : r) + ":\n" + roomRankList.join(", ");
		});

		if (!buffer.length) {
			connection.popup("The room '" + targetRoom.title + "' has no auth." + userLookup);
			return;
		}
		if (targetRoom !== room) buffer.unshift("" + targetRoom.title + " room auth:");
		connection.popup(buffer.join("\n\n") + userLookup);
	},

	userauth: function (target, room, user, connection) {
		let targetId = toId(target) || user.userid;
		let targetUser = Users.getExact(targetId);
		let targetUsername = (targetUser ? targetUser.name : target);

		let buffer = [];
		let innerBuffer = [];
		let group = Users.usergroups[targetId];
		if (group) {
			buffer.push('Global auth: ' + group.charAt(0));
		}
		for (let id in Rooms.rooms) {
			let curRoom = Rooms.rooms[id];
			if (!curRoom.auth || curRoom.isPrivate) continue;
			group = curRoom.auth[targetId];
			if (!group) continue;
			innerBuffer.push(group + id);
		}
		if (innerBuffer.length) {
			buffer.push('Room auth: ' + innerBuffer.join(', '));
		}
		if (targetId === user.userid || user.can('lock')) {
			innerBuffer = [];
			for (let id in Rooms.rooms) {
				let curRoom = Rooms.rooms[id];
				if (!curRoom.auth || !curRoom.isPrivate) continue;
				if (curRoom.isPrivate === true) continue;
				let auth = curRoom.auth[targetId];
				if (!auth) continue;
				innerBuffer.push(auth + id);
			}
			if (innerBuffer.length) {
				buffer.push('Hidden room auth: ' + innerBuffer.join(', '));
			}
		}
		if (targetId === user.userid || user.can('makeroom')) {
			innerBuffer = [];
			for (let i = 0; i < Rooms.global.chatRooms.length; i++) {
				let curRoom = Rooms.global.chatRooms[i];
				if (!curRoom.auth || !curRoom.isPrivate) continue;
				if (curRoom.isPrivate !== true) continue;
				let auth = curRoom.auth[targetId];
				if (!auth) continue;
				innerBuffer.push(auth + curRoom.id);
			}
			if (innerBuffer.length) {
				buffer.push('Private room auth: ' + innerBuffer.join(', '));
			}
		}
		if (!buffer.length) {
			buffer.push("No global or room auth.");
		}

		buffer.unshift("" + targetUsername + " user auth:");
		connection.popup(buffer.join("\n\n"));
	},

	rb: 'roomban',
	roomban: function (target, room, user, connection) {
		if (!target) return this.parse('/help roomban');
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		let userid = toId(name);

		if (!userid || !targetUser) return this.errorReply("User '" + name + "' not found.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('ban', targetUser, room)) return false;
		if (!room.bannedUsers || !room.bannedIps) {
			return this.errorReply("Room bans are not meant to be used in room " + room.id + ".");
		}
		if (room.bannedUsers[userid] && room.bannedIps[targetUser.latestIp]) return this.sendReply("User " + targetUser.name + " is already banned from room " + room.id + ".");
		if (targetUser in room.users || user.can('lock')) {
			targetUser.popup(
				"|html|<p>" + Tools.escapeHTML(user.name) + " has banned you from the room " + room.id + ".</p>" + (target ? "<p>Reason: " + Tools.escapeHTML(target) + "</p>" : "") +
				"<p>To appeal the ban, PM the staff member that banned you" + (room.auth ? " or a room owner. </p><p><button name=\"send\" value=\"/roomauth " + room.id + "\">List Room Staff</button></p>" : ".</p>")
			);
		}
		this.addModCommand("" + targetUser.name + " was banned from room " + room.id + " by " + user.name + "." + (target ? " (" + target + ")" : ""));
		let acAccount = (targetUser.autoconfirmed !== targetUser.userid && targetUser.autoconfirmed);
		let alts = room.roomBan(targetUser);
		if (!(room.isPersonal || room.isPrivate === true) || user.can('alts', targetUser)) {
			if (alts.length) {
				this.privateModCommand("(" + targetUser.name + "'s " + (acAccount ? " ac account: " + acAccount + ", " : "") + "roombanned alts: " + alts.join(", ") + ")");
				for (let i = 0; i < alts.length; ++i) {
					this.add('|unlink|' + toId(alts[i]));
				}
			} else if (acAccount) {
				this.privateModCommand("(" + targetUser.name + "'s ac account: " + acAccount + ")");
			}
		}
		if (targetUser.confirmed && room.chatRoomData && !room.isPrivate) {
			Monitor.log("[CrisisMonitor] Confirmed user " + targetUser.name + (targetUser.confirmed !== targetUser.userid ? " (" + targetUser.confirmed + ")" : "") + " was roombanned from " + room.id + " by " + user.name + ", and should probably be demoted.");
		}
		let lastid = targetUser.getLastId();
		this.add('|unlink|roomhide|' + lastid);
		if (lastid !== toId(this.inputUsername)) this.add('|unlink|roomhide|' + toId(this.inputUsername));
	},
	roombanhelp: ["/roomban [username] - Bans the user from the room you are in. Requires: @ # & ~"],

	unroomban: 'roomunban',
	roomunban: function (target, room, user, connection) {
		if (!target) return this.parse('/help roomunban');
		if (!room.bannedUsers || !room.bannedIps) {
			return this.errorReply("Room bans are not meant to be used in room " + room.id + ".");
		}
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

		this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let userid = room.isRoomBanned(targetUser) || toId(target);

		if (!userid) return this.errorReply("User '" + target + "' is an invalid username.");
		if (targetUser && !this.can('ban', targetUser, room)) return false;
		let unbannedUserid = room.unRoomBan(userid);
		if (!unbannedUserid) return this.errorReply("User " + userid + " is not banned from room " + room.id + ".");

		this.addModCommand("" + unbannedUserid + " was unbanned from room " + room.id + " by " + user.name + ".");
	},
	roomunbanhelp: ["/roomunban [username] - Unbans the user from the room you are in. Requires: @ # & ~"],

	autojoin: function (target, room, user, connection) {
		Rooms.global.autojoinRooms(user, connection);
		let targets = target.split(',');
		let autojoins = [];
		if (targets.length > 11 || Object.keys(connection.rooms).length > 1) return;
		for (let i = 0; i < targets.length; i++) {
			if (user.tryJoinRoom(targets[i], connection) === null) {
				autojoins.push(targets[i]);
			}
		}
		connection.autojoins = autojoins.join(',');
	},

	joim: 'join',
	j: 'join',
	join: function (target, room, user, connection) {
		if (!target) return false;
		if (user.tryJoinRoom(target, connection) === null) {
			connection.sendTo(target, "|noinit|namerequired|The room '" + target + "' does not exist or requires a login to join.");
		}
	},

	leave: 'part',
	part: function (target, room, user, connection) {
		if (room.id === 'global') return false;
		let targetRoom = Rooms.search(target);
		if (target && !targetRoom) {
			return this.errorReply("The room '" + target + "' does not exist.");
		}
		user.leaveRoom(targetRoom || room, connection);
	},

	/*********************************************************
	 * Moderating: Punishments
	 *********************************************************/

	kick: 'warn',
	k: 'warn',
	warn: function (target, room, user) {
		if (!target) return this.parse('/help warn');
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (room.isPersonal && !user.can('warn')) return this.errorReply("Warning is unavailable in group chats.");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.errorReply("User '" + this.targetUsername + "' not found.");
		if (!(targetUser in room.users)) {
			return this.errorReply("User " + this.targetUsername + " is not in the room " + room.id + ".");
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('warn', targetUser, room)) return false;

		this.addModCommand("" + targetUser.name + " was warned by " + user.name + "." + (target ? " (" + target + ")" : ""));
		targetUser.send('|c|~|/warn ' + target);
		let userid = targetUser.getLastId();
		this.add('|unlink|' + userid);
		if (userid !== toId(this.inputUsername)) this.add('|unlink|' + toId(this.inputUsername));
	},
	warnhelp: ["/warn OR /k [username], [reason] - Warns a user showing them the Pok\u00e9mon Showdown Rules and [reason] in an overlay. Requires: % @ # & ~"],

	redirect: 'redir',
	redir: function (target, room, user, connection) {
		if (!target) return this.parse('/help redirect');
		if (room.isPrivate || room.isPersonal) return this.errorReply("Users cannot be redirected from private or personal rooms.");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		let targetRoom = Rooms.search(target);
		if (!targetRoom || targetRoom.modjoin) {
			return this.errorReply("The room '" + target + "' does not exist.");
		}
		if (!this.can('warn', targetUser, room) || !this.can('warn', targetUser, targetRoom)) return false;
		if (!targetUser || !targetUser.connected) {
			return this.errorReply("User " + this.targetUsername + " not found.");
		}
		if (targetRoom.id === "global") return this.errorReply("Users cannot be redirected to the global room.");
		if (targetRoom.isPrivate || targetRoom.isPersonal) {
			return this.parse('/msg ' + this.targetUsername + ', /invite ' + targetRoom.id);
		}
		if (Rooms.rooms[targetRoom.id].users[targetUser.userid]) {
			return this.errorReply("User " + targetUser.name + " is already in the room " + targetRoom.title + "!");
		}
		if (!Rooms.rooms[room.id].users[targetUser.userid]) {
			return this.errorReply("User " + this.targetUsername + " is not in the room " + room.id + ".");
		}
		if (targetUser.joinRoom(targetRoom.id) === false) return this.errorReply("User " + targetUser.name + " could not be joined to room " + targetRoom.title + ". They could be banned from the room.");
		this.addModCommand("" + targetUser.name + " was redirected to room " + targetRoom.title + " by " + user.name + ".");
		targetUser.leaveRoom(room);
	},
	redirhelp: ["/redirect OR /redir [username], [roomname] - Attempts to redirect the user [username] to the room [roomname]. Requires: % @ & ~"],

	m: 'mute',
	mute: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help mute');
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User '" + this.targetUsername + "' not found.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}

		let muteDuration = ((cmd === 'hm' || cmd === 'hourmute') ? HOURMUTE_LENGTH : MUTE_LENGTH);
		if (!this.can('mute', targetUser, room)) return false;
		let canBeMutedFurther = ((room.getMuteTime(targetUser) || 0) <= (muteDuration * 5 / 6));
		if (targetUser.locked || (room.isMuted(targetUser) && !canBeMutedFurther) || room.isRoomBanned(targetUser)) {
			let problem = " but was already " + (targetUser.locked ? "locked" : room.isMuted(targetUser) ? "muted" : "room banned");
			if (!target) {
				return this.privateModCommand("(" + targetUser.name + " would be muted by " + user.name + problem + ".)");
			}
			return this.addModCommand("" + targetUser.name + " would be muted by " + user.name + problem + "." + (target ? " (" + target + ")" : ""));
		}

		if (targetUser in room.users) targetUser.popup("|modal|" + user.name + " has muted you in " + room.id + " for " + Tools.toDurationString(muteDuration) + ". " + target);
		this.addModCommand("" + targetUser.name + " was muted by " + user.name + " for " + Tools.toDurationString(muteDuration) + "." + (target ? " (" + target + ")" : ""));
		if (targetUser.autoconfirmed && targetUser.autoconfirmed !== targetUser.userid) this.privateModCommand("(" + targetUser.name + "'s ac account: " + targetUser.autoconfirmed + ")");
		let userid = targetUser.getLastId();
		this.add('|unlink|' + userid);
		if (userid !== toId(this.inputUsername)) this.add('|unlink|' + toId(this.inputUsername));

		room.mute(targetUser, muteDuration, false);
	},
	mutehelp: ["/mute OR /m [username], [reason] - Mutes a user with reason for 7 minutes. Requires: % @ # & ~"],

	hm: 'hourmute',
	hourmute: function (target) {
		if (!target) return this.parse('/help hourmute');
		this.run('mute');
	},
	hourmutehelp: ["/hourmute OR /hm [username], [reason] - Mutes a user with reason for an hour. Requires: % @ # & ~"],

	um: 'unmute',
	unmute: function (target, room, user) {
		if (!target) return this.parse('/help unmute');
		target = this.splitTarget(target);
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (!this.can('mute', null, room)) return false;

		let targetUser = this.targetUser;
		let successfullyUnmuted = room.unmute(targetUser ? targetUser.userid : this.targetUsername, "Your mute in '" + room.title + "' has been lifted.");

		if (successfullyUnmuted) {
			this.addModCommand("" + (targetUser ? targetUser.name : successfullyUnmuted) + " was unmuted by " + user.name + ".");
		} else {
			this.errorReply("" + (targetUser ? targetUser.name : this.targetUsername) + " is not muted.");
		}
	},
	unmutehelp: ["/unmute [username] - Removes mute from user. Requires: % @ # & ~"],

	forcelock: 'lock',
	l: 'lock',
	ipmute: 'lock',
	lock: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help lock');

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User '" + this.targetUsername + "' not found.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('lock', targetUser)) return false;
		let name = targetUser.getLastName();
		let userid = targetUser.getLastId();

		if (targetUser.locked && !target) {
			let problem = " but was already locked";
			return this.privateModCommand("(" + name + " would be locked by " + user.name + problem + ".)");
		}

		if (targetUser.confirmed) {
			if (cmd === 'forcelock') {
				let from = targetUser.deconfirm();
				Monitor.log("[CrisisMonitor] " + name + " was locked by " + user.name + " and demoted from " + from.join(", ") + ".");
				this.globalModlog("CRISISDEMOTE", targetUser, " from " + from.join(", "));
			} else {
				return this.sendReply("" + name + " is a confirmed user. If you are sure you would like to lock them use /forcelock.");
			}
		} else if (cmd === 'forcelock') {
			return this.errorReply("Use /lock; " + name + " is not a confirmed user.");
		}

		// Destroy personal rooms of the locked user.
		for (let i in targetUser.roomCount) {
			if (i === 'global') continue;
			let targetRoom = Rooms.get(i);
			if (targetRoom.isPersonal && targetRoom.auth[userid] && targetRoom.auth[userid] === '#') {
				targetRoom.destroy();
			}
		}

		targetUser.popup("|modal|" + user.name + " has locked you from talking in chats, battles, and PMing regular users." + (target ? "\n\nReason: " + target : "") + "\n\nIf you feel that your lock was unjustified, you can still PM staff members (%, @, &, and ~) to discuss it" + (Config.appealurl ? " or you can appeal:\n" + Config.appealurl : ".") + "\n\nYour lock will expire in a few days.");

		this.addModCommand("" + name + " was locked from talking by " + user.name + "." + (target ? " (" + target + ")" : ""), " (" + targetUser.latestIp + ")");
		let alts = targetUser.getAlts();
		let acAccount = (targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
		if (alts.length) {
			this.privateModCommand("(" + name + "'s " + (acAccount ? " ac account: " + acAccount + ", " : "") + "locked alts: " + alts.join(", ") + ")");
		} else if (acAccount) {
			this.privateModCommand("(" + name + "'s ac account: " + acAccount + ")");
		}
		this.add('|unlink|hide|' + userid);
		if (userid !== toId(this.inputUsername)) this.add('|unlink|hide|' + toId(this.inputUsername));

		this.globalModlog("LOCK", targetUser, " by " + user.name + (target ? ": " + target : ""));
		Punishments.lock(targetUser, null, null, target);
		return true;
	},
	lockhelp: ["/lock OR /l [username], [reason] - Locks the user from talking in all chats. Requires: % @ & ~"],

	wl: 'weeklock',
	weeklock: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help weeklock');

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User '" + this.targetUsername + "' not found.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('lock', targetUser)) return false;
		let name = targetUser.getLastName();
		let userid = targetUser.getLastId();

		if (targetUser.locked && !target) {
			let problem = " but was already locked";
			return this.privateModCommand("(" + name + " would be locked by " + user.name + problem + ".)");
		}

		if (targetUser.confirmed) {
			if (cmd === 'forcelock') {
				let from = targetUser.deconfirm();
				Monitor.log("[CrisisMonitor] " + name + " was locked by " + user.name + " and demoted from " + from.join(", ") + ".");
				this.globalModlog("CRISISDEMOTE", targetUser, " from " + from.join(", "));
			} else {
				return this.sendReply("" + name + " is a confirmed user. If you are sure you would like to lock them use /forcelock.");
			}
		} else if (cmd === 'forcelock') {
			return this.errorReply("Use /lock; " + name + " is not a confirmed user.");
		}

		// Destroy personal rooms of the locked user.
		for (let i in targetUser.roomCount) {
			if (i === 'global') continue;
			let targetRoom = Rooms.get(i);
			if (targetRoom.isPersonal && targetRoom.auth[userid] && targetRoom.auth[userid] === '#') {
				targetRoom.destroy();
			}
		}

		targetUser.popup("|modal|" + user.name + " has locked you from talking in chats, battles, and PMing regular users for a week." + (target ? "\n\nReason: " + target : "") + "\n\nIf you feel that your lock was unjustified, you can still PM staff members (%, @, &, and ~) to discuss it" + (Config.appealurl ? " or you can appeal:\n" + Config.appealurl : ".") + "\n\nYour lock will expire in a few days.");

		this.addModCommand("" + name + " was locked from talking for a week by " + user.name + "." + (target ? " (" + target + ")" : ""), " (" + targetUser.latestIp + ")");
		let alts = targetUser.getAlts();
		let acAccount = (targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
		if (alts.length) {
			this.privateModCommand("(" + name + "'s " + (acAccount ? " ac account: " + acAccount + ", " : "") + "locked alts: " + alts.join(", ") + ")");
		} else if (acAccount) {
			this.privateModCommand("(" + name + "'s ac account: " + acAccount + ")");
		}
		this.add('|unlink|hide|' + userid);
		if (userid !== toId(this.inputUsername)) this.add('|unlink|hide|' + toId(this.inputUsername));

		this.globalModlog("WEEKLOCK", targetUser, " by " + user.name + (target ? ": " + target : ""));
		Punishments.lock(targetUser, Date.now() + 7 * 24 * 60 * 60 * 1000, null, target);
		return true;
	},
	weeklockhelp: ["/weeklock OR /wl [username], [reason] - Locks the user from talking in all chats for one week. Requires: % @ & ~"],

	unlock: function (target, room, user) {
		if (!target) return this.parse('/help unlock');
		if (!this.can('lock')) return false;

		let targetUser = Users.get(target);
		let reason = '';
		if (targetUser && targetUser.locked && targetUser.locked.charAt(0) === '#') {
			reason = ' (' + targetUser.locked + ')';
		}

		let unlocked = Punishments.unlock(target);

		if (unlocked) {
			this.addModCommand(unlocked.join(", ") + " " + ((unlocked.length > 1) ? "were" : "was") +
				" unlocked by " + user.name + "." + reason);
			if (!reason) this.globalModlog("UNLOCK", target, " by " + user.name);
			if (targetUser) targetUser.popup("" + user.name + " has unlocked you.");
		} else {
			this.errorReply("User '" + target + "' is not locked.");
		}
	},
	unlockhelp: ["/unlock [username] - Unlocks the user. Requires: % @ & ~"],

	forceban: 'ban',
	b: 'ban',
	ban: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help ban');

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("User '" + this.targetUsername + "' not found.");
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply("The reason is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('ban', targetUser)) return false;
		let name = targetUser.getLastName();
		let userid = targetUser.getLastId();

		if (Punishments.getPunishType(userid) === 'BANNED' && !target && !targetUser.connected) {
			let problem = " but was already banned";
			return this.privateModCommand("(" + name + " would be banned by " + user.name + problem + ".)");
		}

		if (targetUser.confirmed) {
			if (cmd === 'forceban') {
				let from = targetUser.deconfirm();
				Monitor.log("[CrisisMonitor] " + name + " was banned by " + user.name + " and demoted from " + from.join(", ") + ".");
				this.globalModlog("CRISISDEMOTE", targetUser, " from " + from.join(", "));
			} else {
				return this.sendReply("" + name + " is a confirmed user. If you are sure you would like to ban them use /forceban.");
			}
		} else if (cmd === 'forceban') {
			return this.errorReply("Use /ban; " + name + " is not a confirmed user.");
		}

		// Destroy personal rooms of the banned user.
		for (let i in targetUser.roomCount) {
			if (i === 'global') continue;
			let targetRoom = Rooms.get(i);
			if (targetRoom.isPersonal && targetRoom.auth[userid] && targetRoom.auth[userid] === '#') {
				targetRoom.destroy();
			}
		}

		targetUser.popup("|modal|" + user.name + " has banned you." + (target ? "\n\nReason: " + target : "") + (Config.appealurl ? "\n\nIf you feel that your ban was unjustified, you can appeal:\n" + Config.appealurl : "") + "\n\nYour ban will expire in a few days.");

		this.addModCommand("" + name + " was banned by " + user.name + "." + (target ? " (" + target + ")" : ""), " (" + targetUser.latestIp + ")");
		let alts = targetUser.getAlts();
		let acAccount = (targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
		if (alts.length) {
			let guests = alts.length;
			alts = alts.filter(alt => alt.substr(0, 6) !== 'Guest ');
			guests -= alts.length;
			this.privateModCommand("(" + name + "'s " + (acAccount ? " ac account: " + acAccount + ", " : "") + "banned alts: " + alts.join(", ") + (guests ? " [" + guests + " guests]" : "") + ")");
			for (let i = 0; i < alts.length; ++i) {
				this.add('|unlink|' + toId(alts[i]));
			}
		} else if (acAccount) {
			this.privateModCommand("(" + name + "'s ac account: " + acAccount + ")");
		}

		this.add('|unlink|hide|' + userid);
		if (userid !== toId(this.inputUsername)) this.add('|unlink|hide|' + toId(this.inputUsername));
		Punishments.ban(targetUser, null, null, target);
		this.globalModlog("BAN", targetUser, " by " + user.name + (target ? ": " + target : ""));
		return true;
	},
	banhelp: ["/ban OR /b [username], [reason] - Kick user from all rooms and ban user's IP address with reason. Requires: @ & ~"],

	unban: function (target, room, user) {
		if (!target) return this.parse('/help unban');
		if (!this.can('ban')) return false;

		let name = Punishments.unban(target);

		if (name) {
			this.addModCommand("" + name + " was unbanned by " + user.name + ".");
			this.globalModlog("UNBAN", name, " by " + user.name);
		} else {
			this.errorReply("User '" + target + "' is not banned.");
		}
	},
	unbanhelp: ["/unban [username] - Unban a user. Requires: @ & ~"],

	unbanall: function (target, room, user) {
		if (!this.can('rangeban')) return false;
		if (!target) {
			user.lastCommand = '/unbanall';
			this.errorReply("THIS WILL UNBAN AND UNLOCK ALL USERS.");
			this.errorReply("To confirm, use: /unbanall confirm");
			return;
		}
		if (user.lastCommand !== '/unbanall' || target !== 'confirm') {
			return this.parse('/help unbanall');
		}
		// we have to do this the hard way since it's no longer a global
		let punishKeys = ['bannedIps', 'bannedUsers', 'lockedIps', 'lockedUsers', 'lockedRanges', 'rangeLockedUsers'];
		for (let i = 0; i < punishKeys.length; i++) {
			let dict = Punishments[punishKeys[i]];
			for (let entry in dict) delete dict[entry];
		}
		this.addModCommand("All bans and locks have been lifted by " + user.name + ".");
	},
	unbanallhelp: ["/unbanall - Unban all IP addresses. Requires: & ~"],

	deroomvoiceall: function (target, room, user) {
		if (!this.can('editroom', null, room)) return false;
		if (!room.auth) return this.errorReply("Room does not have roomauth.");
		if (!target) {
			user.lastCommand = '/deroomvoiceall';
			this.errorReply("THIS WILL DEROOMVOICE ALL ROOMVOICED USERS.");
			this.errorReply("To confirm, use: /deroomvoiceall confirm");
			return;
		}
		if (user.lastCommand !== '/deroomvoiceall' || target !== 'confirm') {
			return this.parse('/help deroomvoiceall');
		}
		let count = 0;
		for (let userid in room.auth) {
			if (room.auth[userid] === '+') {
				delete room.auth[userid];
				if (userid in room.users) room.users[userid].updateIdentity(room.id);
				count++;
			}
		}
		if (!count) {
			return this.sendReply("(This room has zero roomvoices)");
		}
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
		this.addModCommand("All " + count + " roomvoices have been cleared by " + user.name + ".");
	},
	deroomvoiceallhelp: ["/deroomvoiceall - Devoice all roomvoiced users. Requires: # & ~"],

	banip: function (target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help banip');
		}
		if (!this.can('rangeban')) return false;
		if (Punishments.bannedIps[target] === '#ipban') return this.sendReply("The IP " + (target.charAt(target.length - 1) === '*' ? "range " : "") + target + " has already been temporarily banned.");

		Punishments.bannedIps[target] = '#ipban';
		this.addModCommand("" + user.name + " temporarily banned the " + (target.charAt(target.length - 1) === '*' ? "IP range" : "IP") + ": " + target);
	},
	baniphelp: ["/banip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~"],

	unbanip: function (target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help unbanip');
		}
		if (!this.can('rangeban')) return false;
		if (!Punishments.bannedIps[target]) {
			return this.errorReply("" + target + " is not a banned IP or IP range.");
		}
		delete Punishments.bannedIps[target];
		this.addModCommand("" + user.name + " unbanned the " + (target.charAt(target.length - 1) === '*' ? "IP range" : "IP") + ": " + target);
	},
	unbaniphelp: ["/unbanip [ip] - Kick users on this IP or IP range from all rooms and bans it. Accepts wildcards to ban ranges. Requires: & ~"],

	rangelock: function (target, room, user) {
		if (!target) return this.errorReply("Please specify a range to lock.");
		if (!this.can('rangeban')) return false;

		let isIp = (target.slice(-1) === '*');
		let range = (isIp ? target : Punishments.shortenHost(target));
		if (Punishments.lockedRanges[range]) return this.errorReply("The range " + range + " has already been temporarily locked.");

		Punishments.lockRange(range, isIp);
		this.addModCommand("" + user.name + " temporarily locked the range: " + range);
	},

	unrangelock: 'rangeunlock',
	rangeunlock: function (target, room, user) {
		if (!target) return this.errorReply("Please specify a range to unlock.");
		if (!this.can('rangeban')) return false;

		let range = (target.slice(-1) === '*' ? target : Punishments.shortenHost(target));
		if (!Punishments.lockedRanges[range]) return this.errorReply("The range " + range + " is not locked.");

		Punishments.unlockRange(range);
		this.addModCommand("" + user.name + " unlocked the range " + range + ".");
	},

	/*********************************************************
	 * Moderating: Other
	 *********************************************************/

	mn: 'modnote',
	modnote: function (target, room, user, connection) {
		if (!target) return this.parse('/help modnote');
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");

		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply("The note is too long. It cannot exceed " + MAX_REASON_LENGTH + " characters.");
		}
		if (!this.can('receiveauthmessages', null, room)) return false;
		return this.privateModCommand("(" + user.name + " notes: " + target + ")");
	},
	modnotehelp: ["/modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ # & ~"],

	globalpromote: 'promote',
	promote: function (target, room, user, connection, cmd) {
		if (!target) return this.parse('/help promote');

		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let userid = toId(this.targetUsername);
		let name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) return this.parse('/help promote');

		let currentGroup = ((targetUser && targetUser.group) || Users.usergroups[userid] || ' ')[0];
		let nextGroup = target;
		if (target === 'deauth') nextGroup = Config.groupsranking[0];
		if (!nextGroup) {
			return this.errorReply("Please specify a group such as /globalvoice or /globaldeauth");
		}
		if (!Config.groups[nextGroup]) {
			return this.errorReply("Group '" + nextGroup + "' does not exist.");
		}
		if (!cmd.startsWith('global')) {
			let groupid = Config.groups[nextGroup].id;
			if (!groupid && nextGroup === Config.groupsranking[0]) groupid = 'deauth';
			if (Config.groups[nextGroup].globalonly) return this.errorReply('Did you mean /global' + groupid + '"?');
			return this.errorReply('Did you mean "/room' + groupid + '" or "/global' + groupid + '"?');
		}
		if (Config.groups[nextGroup].roomonly || Config.groups[nextGroup].battleonly) {
			return this.errorReply("Group '" + nextGroup + "' does not exist as a global rank.");
		}

		let groupName = Config.groups[nextGroup].name || "regular user";
		if (currentGroup === nextGroup) {
			return this.errorReply("User '" + name + "' is already a " + groupName);
		}
		if (!user.canPromote(currentGroup, nextGroup)) {
			return this.errorReply("/" + cmd + " - Access denied.");
		}

		if (!Users.isUsernameKnown(userid)) {
			return this.errorReply("/globalpromote - WARNING: '" + name + "' is offline and unrecognized. The username might be misspelled (either by you or the person or told you) or unregistered. Use /forcepromote if you're sure you want to risk it.");
		}
		if (targetUser && !targetUser.registered) {
			return this.errorReply("User '" + name + "' is unregistered, and so can't be promoted.");
		}
		Users.setOfflineGroup(name, nextGroup);
		if (Config.groups[nextGroup].rank < Config.groups[currentGroup].rank) {
			this.privateModCommand("(" + name + " was demoted to " + groupName + " by " + user.name + ".)");
			if (targetUser) targetUser.popup("You were demoted to " + groupName + " by " + user.name + ".");
		} else {
			this.addModCommand("" + name + " was promoted to " + groupName + " by " + user.name + ".");
			if (targetUser) targetUser.popup("You were promoted to " + groupName + " by " + user.name + ".");
		}

		if (targetUser) targetUser.updateIdentity();
	},
	promotehelp: ["/promote [username], [group] - Promotes the user to the specified group. Requires: & ~"],

	confirmuser: function (target) {
		if (!target) return this.parse('/help confirmuser');
		if (!this.can('promote')) return;

		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let userid = toId(this.targetUsername);
		let name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) return this.parse('/help confirmuser');
		if (!targetUser) return this.errorReply("User '" + name + "' is not online.");

		if (targetUser.confirmed) return this.errorReply("User '" + name + "' is already confirmed.");

		targetUser.setGroup(' ', true);
		this.sendReply("User '" + name + "' is now confirmed.");
	},
	confirmuserhelp: ["/confirmuser [username] - Confirms the user (makes them immune to locks). Requires: & ~"],

	globaldemote: 'demote',
	demote: function (target) {
		if (!target) return this.parse('/help demote');
		this.run('promote');
	},
	demotehelp: ["/demote [username], [group] - Demotes the user to the specified group. Requires: & ~"],

	forcepromote: function (target, room, user) {
		// warning: never document this command in /help
		if (!this.can('forcepromote')) return false;
		target = this.splitTarget(target, true);
		let name = this.targetUsername;
		let nextGroup = target;
		if (!Config.groups[nextGroup]) return this.errorReply("Group '" + nextGroup + "' does not exist.");

		if (Users.isUsernameKnown(name)) {
			return this.errorReply("/forcepromote - Don't forcepromote unless you have to.");
		}
		Users.setOfflineGroup(name, nextGroup);

		this.addModCommand("" + name + " was promoted to " + (Config.groups[nextGroup].name || "regular user") + " by " + user.name + ".");
	},

	devoice: 'deauth',
	deauth: function (target, room, user) {
		return this.parse('/demote ' + target + ', deauth');
	},

	deglobalvoice: 'globaldeauth',
	deglobalauth: 'globaldeauth',
	globaldevoice: 'globaldeauth',
	globaldeauth: function (target, room, user) {
		return this.parse('/globaldemote ' + target + ', deauth');
	},

	deroomvoice: 'roomdeauth',
	roomdevoice: 'roomdeauth',
	deroomauth: 'roomdeauth',
	roomdeauth: function (target, room, user) {
		return this.parse('/roomdemote ' + target + ', deauth');
	},

	modchat: function (target, room, user) {
		if (!target) return this.sendReply("Moderated chat is currently set to: " + room.modchat);
		if (!this.canTalk()) return this.errorReply("You cannot do this while unable to talk.");
		if (!this.can('modchat', null, room)) return false;

		if (room.modchat && room.modchat.length <= 1 && Config.groupsranking.indexOf(room.modchat) > 1 && !user.can('modchatall', null, room)) {
			return this.errorReply("/modchat - Access denied for removing a setting higher than " + Config.groupsranking[1] + ".");
		}
		if (room.requestModchat) {
			let error = room.requestModchat(user);
			if (error) return this.errorReply(error);
		}

		target = target.toLowerCase().trim();
		let currentModchat = room.modchat;
		switch (target) {
		case 'off':
		case 'false':
		case 'no':
			room.modchat = false;
			break;
		case 'ac':
		case 'autoconfirmed':
			room.modchat = 'autoconfirmed';
			break;
		case '*':
		case 'player':
			target = '\u2605';
			/* falls through */
		default: {
			if (!Config.groups[target]) {
				this.errorReply("The rank '" + target + '" was unrecognized as a modchat level.');
				return this.parse('/help modchat');
			}
			if (Config.groupsranking.indexOf(target) > 1 && !user.can('modchatall', null, room)) {
				return this.errorReply("/modchat - Access denied for setting higher than " + Config.groupsranking[1] + ".");
			}
			let roomGroup = (room.auth && room.isPrivate === true ? ' ' : user.group);
			if (room.auth && user.userid in room.auth) roomGroup = room.auth[user.userid];
			if (Config.groupsranking.indexOf(target) > Math.max(1, Config.groupsranking.indexOf(roomGroup)) && !user.can('makeroom')) {
				return this.errorReply("/modchat - Access denied for setting higher than " + Config.groupsranking[1] + ".");
			}
			room.modchat = target;
			break;
		}}
		if (currentModchat === room.modchat) {
			return this.errorReply("Modchat is already set to " + currentModchat + ".");
		}
		if (!room.modchat) {
			this.add("|raw|<div class=\"broadcast-blue\"><b>Moderated chat was disabled!</b><br />Anyone may talk now.</div>");
		} else {
			let modchat = Tools.escapeHTML(room.modchat);
			this.add("|raw|<div class=\"broadcast-red\"><b>Moderated chat was set to " + modchat + "!</b><br />Only users of rank " + modchat + " and higher can talk.</div>");
		}
		if (room.battle && !room.modchat && !user.can('modchat')) room.requestModchat(null);
		this.privateModCommand("(" + user.name + " set modchat to " + room.modchat + ")");

		if (room.chatRoomData) {
			room.chatRoomData.modchat = room.modchat;
			Rooms.global.writeChatRoomData();
		}
	},
	modchathelp: ["/modchat [off/autoconfirmed/+/%/@/#/&/~] - Set the level of moderated chat. Requires: @ for off/autoconfirmed/+ options, # & ~ for all the options"],

	declare: function (target, room, user) {
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if (!this.canTalk()) return;

		this.add('|raw|<div class="broadcast-blue"><b>' + Tools.escapeHTML(target) + '</b></div>');
		this.logModCommand(user.name + " declared " + target);
	},
	declarehelp: ["/declare [message] - Anonymously announces a message. Requires: # & ~"],

	htmldeclare: function (target, room, user) {
		if (!target) return this.parse('/help htmldeclare');
		if (!this.can('gdeclare', null, room)) return false;
		if (!this.canTalk()) return;
		target = this.canHTML(target);
		if (!target) return;

		this.add('|raw|<div class="broadcast-blue"><b>' + target + '</b></div>');
		this.logModCommand(user.name + " declared " + target);
	},
	htmldeclarehelp: ["/htmldeclare [message] - Anonymously announces a message using safe HTML. Requires: ~"],

	gdeclare: 'globaldeclare',
	globaldeclare: function (target, room, user) {
		if (!target) return this.parse('/help globaldeclare');
		if (!this.can('gdeclare')) return false;
		target = this.canHTML(target);
		if (!target) return;

		for (let id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>' + target + '</b></div>');
		}
		this.logModCommand(user.name + " globally declared " + target);
	},
	globaldeclarehelp: ["/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: ~"],

	cdeclare: 'chatdeclare',
	chatdeclare: function (target, room, user) {
		if (!target) return this.parse('/help chatdeclare');
		if (!this.can('gdeclare')) return false;
		target = this.canHTML(target);
		if (!target) return;

		for (let id in Rooms.rooms) {
			if (id !== 'global') if (Rooms.rooms[id].type !== 'battle') Rooms.rooms[id].addRaw('<div class="broadcast-blue"><b>' + target + '</b></div>');
		}
		this.logModCommand(user.name + " globally declared (chat level) " + target);
	},
	chatdeclarehelp: ["/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~"],

	wall: 'announce',
	announce: function (target, room, user) {
		if (!target) return this.parse('/help announce');

		if (!this.can('announce', null, room)) return false;

		target = this.canTalk(target);
		if (!target) return;

		return '/announce ' + target;
	},
	announcehelp: ["/announce OR /wall [message] - Makes an announcement. Requires: % @ # & ~"],

	fr: 'forcerename',
	forcerename: function (target, room, user) {
		if (!target) return this.parse('/help forcerename');

		let reason = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		if (!targetUser) {
			this.splitTarget(target);
			if (this.targetUser) {
				return this.errorReply("User has already changed their name to '" + this.targetUser.name + "'.");
			}
			return this.errorReply("User '" + target + "' not found.");
		}
		if (!this.can('forcerename', targetUser)) return false;

		let entry = targetUser.name + " was forced to choose a new name by " + user.name + (reason ? ": " + reason : "");
		this.privateModCommand("(" + entry + ")");
		Rooms.global.cancelSearch(targetUser);
		targetUser.resetName();
		targetUser.send("|nametaken||" + user.name + " considers your name inappropriate" + (reason ? ": " + reason : "."));
		return true;
	},
	forcerenamehelp: ["/forcerename OR /fr [username], [reason] - Forcibly change a user's name and shows them the [reason]. Requires: % @ & ~"],

	nl: 'namelock',
	namelock: function (target, room, user) {
		if (!target) return this.parse('/help namelock');

		let reason = this.splitTarget(target, true);
		let targetUser = this.targetUser;

		if (!targetUser) {
			return this.errorReply("User '" + this.targetUsername + "' not found.");
		}
		if (!this.can('forcerename', targetUser)) return false;

		this.addModCommand("" + targetUser.name + " was namelocked by " + user.name + "." + (reason ? " (" + reason + ")" : ""));
		this.globalModlog("NAMELOCK", targetUser, " by " + user.name + (reason ? ": " + reason : ""));
		Rooms.global.cancelSearch(targetUser);
		Punishments.namelock(targetUser, null, null, reason);
		targetUser.popup("|modal|" + user.name + " has locked your name and you can't change names anymore" + (reason ? ": " + reason : "."));
		return true;
	},
	namelockhelp: ["/namelock OR /nl [username], [reason] - Name locks a user and shows them the [reason]. Requires: % @ & ~"],

	unl: 'unnamelock',
	unnamelock: function (target, room, user) {
		if (!target) return this.parse('/help unnamelock');
		if (!this.can('forcerename')) return false;

		let targetUser = Users.get(target);
		let reason = '';
		if (targetUser && targetUser.namelocked) {
			reason = ' (' + targetUser.namelocked + ')';
		}

		let unlocked = Punishments.unnamelock(target);

		if (unlocked) {
			this.addModCommand(unlocked + " was unnamelocked by " + user.name + "." + reason);
			if (!reason) this.globalModlog("UNNAMELOCK", target, " by " + user.name);
			if (targetUser) targetUser.popup("" + user.name + " has unnamelocked you.");
		} else {
			this.errorReply("User '" + target + "' is not namelocked.");
		}
	},
	unnamelockhelp: ["/unnamelock [username] - Unnamelocks the user. Requires: % @ & ~"],

	hidetext: function (target, room, user) {
		if (!target) return this.parse('/help hidetext');

		this.splitTarget(target);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		if (!targetUser) return this.errorReply("User '" + name + "' not found.");
		let userid = targetUser.getLastId();
		let hidetype = '';
		if (!user.can('lock', targetUser) && !user.can('ban', targetUser, room)) {
			this.errorReply("/hidetext - Access denied.");
			return false;
		}

		if (targetUser.locked) {
			hidetype = 'hide|';
		} else if ((room.bannedUsers[toId(name)] && room.bannedIps[targetUser.latestIp]) || user.can('rangeban')) {
			hidetype = 'roomhide|';
		} else {
			return this.errorReply("User '" + name + "' is not banned from this room or locked.");
		}

		this.addModCommand("" + targetUser.name + "'s messages were cleared from room " + room.id + " by " + user.name + ".");
		this.add('|unlink|' + hidetype + userid);
		if (userid !== toId(this.inputUsername)) this.add('|unlink|' + hidetype + toId(this.inputUsername));
	},
	hidetexthelp: ["/hidetext [username] - Removes a locked or banned user's messages from chat (includes users banned from the room). Requires: % (global only), @ # & ~"],

	banwords: 'banword',
	banword: {
		add: function (target, room, user) {
			if (!target) return this.parse('/help banword');
			if (!user.can('declare', null, room)) return;

			if (!room.banwords) room.banwords = [];

			// Most of the regex code is copied from the client. TODO: unify them?
			let words = target.match(/[^,]+(,\d*}[^,]*)?/g).map(word => word.replace(/\n/g, '').trim());

			for (let i = 0; i < words.length; i++) {
				if (/[\\^$*+?()|{}[\]]/.test(words[i])) {
					if (!user.can('makechatroom')) return this.errorReply("Regex banwords are only allowed for leaders or above.");

					try {
						let test = new RegExp(words[i]); // eslint-disable-line no-unused-vars
					} catch (e) {
						return this.errorReply(e.message.substr(0, 28) === 'Invalid regular expression: ' ? e.message : 'Invalid regular expression: /' + words[i] + '/: ' + e.message);
					}
				}
				if (room.banwords.indexOf(words[i]) > -1) {
					return this.errorReply(words[i] + ' is already a banned phrase.');
				}
			}

			room.banwords = room.banwords.concat(words);
			room.banwordRegex = null;
			if (words.length > 1) {
				this.privateModCommand("(The banwords '" + words.join(', ') + "' were added by " + user.name + ".)");
				this.sendReply("Banned phrases succesfully added. The list is currently: " + room.banwords.join(', '));
			} else {
				this.privateModCommand("(The banword '" + words[0] + "' was added by " + user.name + ".)");
				this.sendReply("Banned phrase succesfully added. The list is currently: " + room.banwords.join(', '));
			}

			if (room.chatRoomData) {
				room.chatRoomData.banwords = room.banwords;
				Rooms.global.writeChatRoomData();
			}
		},

		delete: function (target, room, user) {
			if (!target) return this.parse('/help banword');
			if (!user.can('declare', null, room)) return;

			if (!room.banwords) return this.errorReply("This room has no banned phrases.");

			let words = target.match(/[^,]+(,\d*}[^,]*)?/g).map(word => word.replace(/\n/g, '').trim());

			for (let i = 0; i < words.length; i++) {
				let index = room.banwords.indexOf(words[i]);

				if (index < 0) return this.errorReply(words[i] + " is not a banned phrase in this room.");

				room.banwords.splice(index, 1);
			}

			room.banwordRegex = null;
			if (words.length > 1) {
				this.privateModCommand("(The banwords '" + words.join(', ') + "' were removed by " + user.name + ".)");
				this.sendReply("Banned phrases succesfully deleted. The list is currently: " + room.banwords.join(', '));
			} else {
				this.privateModCommand("(The banword '" + words[0] + "' was removed by " + user.name + ".)");
				this.sendReply("Banned phrase succesfully deleted. The list is currently: " + room.banwords.join(', '));
			}

			if (room.chatRoomData) {
				room.chatRoomData.banwords = room.banwords;
				Rooms.global.writeChatRoomData();
			}
		},

		list: function (target, room, user) {
			if (!user.can('ban', null, room)) return;

			if (!room.banwords) return this.sendReply("This room has no banned phrases.");

			return this.sendReply("Banned phrases in room " + room.id + ": " + room.banwords.join(', '));
		},

		"": function (target, room, user) {
			return this.parse("/help banword");
		},
	},
	banwordhelp: ["/banword add [words] - Adds the comma-separated list of phrases (& or ~ can also input regex) to the banword list of the current room. Requires: # & ~",
					"/banword delete [words] - Removes the comma-separated list of phrases from the banword list. Requires: # & ~",
					"/banword list - Shows the list of banned words in the current room. Requires: @ # & ~"],

	modlog: function (target, room, user, connection) {
		let lines = 0;
		// Specific case for modlog command. Room can be indicated with a comma, lines go after the comma.
		// Otherwise, the text is defaulted to text search in current room's modlog.
		let roomId = (room.id === 'staff' ? 'global' : room.id);
		let hideIps = !user.can('lock');
		let path = require('path');
		let isWin = process.platform === 'win32';
		let logPath = 'logs/modlog/';

		if (target.includes(',')) {
			let targets = target.split(',');
			target = targets[1].trim();
			roomId = toId(targets[0]) || room.id;
		}

		// Let's check the number of lines to retrieve or if it's a word instead
		if (!target.match('[^0-9]')) {
			lines = parseInt(target || 20);
			if (lines > 100) lines = 100;
		}
		let wordSearch = (!lines || lines < 0);

		// Control if we really, really want to check all modlogs for a word.
		let roomNames = '';
		let filename = '';
		let command = '';
		if (roomId === 'all' && wordSearch) {
			if (!this.can('modlog')) return;
			roomNames = "all rooms";
			// Get a list of all the rooms
			let fileList = fs.readdirSync('logs/modlog');
			for (let i = 0; i < fileList.length; ++i) {
				filename += path.normalize(__dirname + '/' + logPath + fileList[i]) + ' ';
			}
		} else if (roomId.startsWith('battle-') || roomId.startsWith('groupchat-')) {
			return this.errorReply("Battles and groupchats do not have modlogs.");
		} else {
			if (!this.can('modlog', null, Rooms.get(roomId))) return;
			roomNames = "the room " + roomId;
			filename = path.normalize(__dirname + '/' + logPath + 'modlog_' + roomId + '.txt');
		}

		// Seek for all input rooms for the lines or text
		if (isWin) {
			command = path.normalize(__dirname + '/lib/winmodlog') + ' tail ' + lines + ' ' + filename;
		} else {
			command = 'tail -' + lines + ' ' + filename + ' | tac';
		}
		let grepLimit = 100;
		let strictMatch = false;
		if (wordSearch) { // searching for a word instead
			let searchString = target;
			strictMatch = true; // search for a 1:1 match?

			if (searchString.match(/^["'].+["']$/)) {
				searchString = searchString.substring(1, searchString.length - 1);
			} else if (searchString.includes('_')) {
				// do an exact search, the approximate search fails for underscores
			} else if (isWin) {  // ID search with RegEx isn't implemented for windows yet (feel free to add it to winmodlog.cmd)
				target = '"' + target + '"';  // add quotes to target so the caller knows they are getting a strict match
			} else {
				// search for ID: allow any number of non-word characters (\W*) in between the letters we have to match.
				// i.e. if searching for "myUsername", also match on "My User-Name".
				// note that this doesn't really add a lot of unwanted results, since we use \b..\b
				target = toId(target);
				searchString = '\\b' + target.split('').join('\\W*') + '\\b';
				strictMatch = false;
			}

			if (isWin) {
				if (strictMatch) {
					command = path.normalize(__dirname + '/lib/winmodlog') + ' ws ' + grepLimit + ' "' + searchString.replace(/%/g, "%%").replace(/([\^"&<>\|])/g, "^$1") + '" ' + filename;
				} else {
					// doesn't happen. ID search with RegEx isn't implemented for windows yet (feel free to add it to winmodlog.cmd and call it from here)
				}
			} else {
				if (strictMatch) {
					command = "awk '{print NR,$0}' " + filename + " | sort -nr | cut -d' ' -f2- | grep -m" + grepLimit + " -i '" + searchString.replace(/\\/g, '\\\\\\\\').replace(/["'`]/g, '\'\\$&\'').replace(/[\{\}\[\]\(\)\$\^\.\?\+\-\*]/g, '[$&]') + "'";
				} else {
					command = "awk '{print NR,$0}' " + filename + " | sort -nr | cut -d' ' -f2- | grep -m" + grepLimit + " -Ei '" + searchString + "'";
				}
			}
		}

		// Execute the file search to see modlog
		require('child_process').exec(command, (error, stdout, stderr) => {
			if (error && stderr) {
				connection.popup("/modlog empty on " + roomNames + " or erred");
				console.log("/modlog error: " + error);
				return false;
			}
			if (stdout && hideIps) {
				stdout = stdout.replace(/\([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+\)/g, '');
			}
			stdout = stdout.split('\n').map(line => {
				let bracketIndex = line.indexOf(']');
				let parenIndex = line.indexOf(')');
				if (bracketIndex < 0) return Tools.escapeHTML(line);
				const time = line.slice(1, bracketIndex);
				let timestamp = Tools.toTimeStamp(new Date(time), {hour12: true});
				parenIndex = line.indexOf(')');
				let roomid = line.slice(bracketIndex + 3, parenIndex);
				if (!hideIps && Config.modloglink) {
					let url = Config.modloglink(time, roomid);
					if (url) timestamp = '<a href="' + url + '">' + timestamp + '</a>';
				}
				return '<small>[' + timestamp + '] (' + roomid + ')</small>' + Tools.escapeHTML(line.slice(parenIndex + 1));
			}).join('<br />');
			if (lines) {
				if (!stdout) {
					connection.popup("The modlog is empty. (Weird.)");
				} else {
					connection.popup("|wide||html|<p>The last " + lines + " lines of the Moderator Log of " + roomNames + ":</p>" + stdout);
				}
			} else {
				if (!stdout) {
					connection.popup("No moderator actions containing " + target + " were found on " + roomNames + "." +
					                 (strictMatch ? "" : " Add quotes to the search parameter to search for a phrase, rather than a user."));
				} else {
					connection.popup("|wide||html|<p>The last " + grepLimit + " logged actions containing " + target + " on " + roomNames + "." +
					                 (strictMatch ? "" : " Add quotes to the search parameter to search for a phrase, rather than a user.") + "</p>" + stdout);
				}
			}
		});
	},
	modloghelp: ["/modlog [roomid|all], [n] - Roomid defaults to current room.",
		"If n is a number or omitted, display the last n lines of the moderator log. Defaults to 15.",
		"If n is not a number, search the moderator log for 'n' on room's log [roomid]. If you set [all] as [roomid], searches for 'n' on all rooms's logs. Requires: % @ # & ~"],

	/*********************************************************
	 * Server management commands
	 *********************************************************/

	hotpatch: function (target, room, user) {
		if (!target) return this.parse('/help hotpatch');
		if (!this.can('hotpatch')) return false;
		if (Monitor.hotpatchLock) return this.errorReply("Hotpatch is currently been disabled. (" + Monitor.hotpatchLock + ")");

		let staff = Rooms('staff');
		if (staff) staff.add("(" + user.name + " used /hotpatch " + target + ")").update();

		if (target === 'chat' || target === 'commands') {
			if (Monitor.hotpatchLockChat) return this.errorReply("Hotpatch has been disabled for chat. (" + Monitor.hotpatchLockChat + ")");
			try {
				const ProcessManagers = require('./process-manager').cache;
				for (let PM of ProcessManagers.keys()) {
					if (PM.isChatBased) {
						PM.unspawn();
						ProcessManagers.delete(PM);
					}
				}

				CommandParser.uncacheTree('./command-parser.js');
				delete require.cache[require.resolve('./commands.js')];
				delete require.cache[require.resolve('./chat-plugins/info.js')];
				global.CommandParser = require('./command-parser.js');

				let runningTournaments = Tournaments.tournaments;
				CommandParser.uncacheTree('./tournaments');
				global.Tournaments = require('./tournaments');
				Tournaments.tournaments = runningTournaments;

				return this.sendReply("Chat commands have been hot-patched.");
			} catch (e) {
				return this.errorReply("Something failed while trying to hotpatch chat: \n" + e.stack);
			}
		} else if (target === 'tournaments') {
			try {
				let runningTournaments = Tournaments.tournaments;
				CommandParser.uncacheTree('./tournaments');
				global.Tournaments = require('./tournaments');
				Tournaments.tournaments = runningTournaments;
				return this.sendReply("Tournaments have been hot-patched.");
			} catch (e) {
				return this.errorReply("Something failed while trying to hotpatch tournaments: \n" + e.stack);
			}
		} else if (target === 'battles') {
			Simulator.SimulatorProcess.respawn();
			return this.sendReply("Battles have been hotpatched. Any battles started after now will use the new code; however, in-progress battles will continue to use the old code.");
		} else if (target === 'formats') {
			try {
				let toolsLoaded = !!Tools.isLoaded;
				// uncache the tools.js dependency tree
				CommandParser.uncacheTree('./tools.js');
				// reload tools.js
				global.Tools = require('./tools.js')[toolsLoaded ? 'includeData' : 'includeFormats'](); // note: this will lock up the server for a few seconds
				// rebuild the formats list
				Rooms.global.formatListText = Rooms.global.getFormatListText();
				// respawn validator processes
				TeamValidator.PM.respawn();
				// respawn simulator processes
				Simulator.SimulatorProcess.respawn();
				// broadcast the new formats list to clients
				Rooms.global.send(Rooms.global.formatListText);

				return this.sendReply("Formats have been hotpatched.");
			} catch (e) {
				return this.errorReply("Something failed while trying to hotpatch formats: \n" + e.stack);
			}
		} else if (target === 'loginserver') {
			fs.unwatchFile('./config/custom.css');
			CommandParser.uncacheTree('./loginserver.js');
			global.LoginServer = require('./loginserver.js');
			return this.sendReply("The login server has been hotpatched. New login server requests will use the new code.");
		} else if (target === 'learnsets' || target === 'validator') {
			TeamValidator.PM.respawn();
			return this.sendReply("The team validator has been hotpatched. Any battles started after now will have teams be validated according to the new code.");
		} else if (target === 'punishments') {
			delete require.cache[require.resolve('./punishments.js')];
			global.Punishments = require('./punishments.js');
			return this.sendReply("Punishments have been hotpatched.");
		} else if (target.startsWith('disablechat')) {
			if (Monitor.hotpatchLockChat) return this.errorReply("Hotpatch is already disabled.");
			let reason = target.split(', ')[1];
			if (!reason) return this.errorReply("Usage: /hotpatch disablechat, [reason]");
			Monitor.hotpatchLockChat = reason;
			return this.sendReply("You have disabled hotpatch until the next server restart.");
		} else if (target.startsWith('disable')) {
			let reason = target.split(', ')[1];
			if (!reason) return this.errorReply("Usage: /hotpatch disable, [reason]");
			Monitor.hotpatchLock = reason;
			return this.sendReply("You have disabled hotpatch until the next server restart.");
		}
		this.errorReply("Your hot-patch command was unrecognized.");
	},
	hotpatchhelp: ["Hot-patching the game engine allows you to update parts of Showdown without interrupting currently-running battles. Requires: ~",
		"Hot-patching has greater memory requirements than restarting.",
		"/hotpatch chat - reload commands.js and the chat-plugins",
		"/hotpatch battles - spawn new simulator processes",
		"/hotpatch validator - spawn new team validator processes",
		"/hotpatch formats - reload the tools.js tree, rebuild and rebroad the formats list, and spawn new simulator and team validator processes",
		"/hotpatch disable, [reason] - disables the use of hotpatch until the next server restart"],

	savelearnsets: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		fs.writeFile('data/learnsets.js', 'exports.BattleLearnsets = ' + JSON.stringify(Tools.data.Learnsets) + ";\n");
		this.sendReply("learnsets.js saved.");
	},

	disableladder: function (target, room, user) {
		if (!this.can('disableladder')) return false;
		if (LoginServer.disabled) {
			return this.errorReply("/disableladder - Ladder is already disabled.");
		}
		LoginServer.disabled = true;
		this.logModCommand("The ladder was disabled by " + user.name + ".");
		this.add("|raw|<div class=\"broadcast-red\"><b>Due to high server load, the ladder has been temporarily disabled</b><br />Rated games will no longer update the ladder. It will be back momentarily.</div>");
	},

	enableladder: function (target, room, user) {
		if (!this.can('disableladder')) return false;
		if (!LoginServer.disabled) {
			return this.errorReply("/enable - Ladder is already enabled.");
		}
		LoginServer.disabled = false;
		this.logModCommand("The ladder was enabled by " + user.name + ".");
		this.add("|raw|<div class=\"broadcast-green\"><b>The ladder is now back.</b><br />Rated games will update the ladder now.</div>");
	},

	lockdown: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		Rooms.global.lockdown = true;
		for (let id in Rooms.rooms) {
			if (id === 'global') continue;
			let curRoom = Rooms.rooms[id];
			curRoom.addRaw("<div class=\"broadcast-red\"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>");
			if (curRoom.requestKickInactive && !curRoom.battle.ended) {
				curRoom.requestKickInactive(user, true);
				if (curRoom.modchat !== '+') {
					curRoom.modchat = '+';
					curRoom.addRaw("<div class=\"broadcast-red\"><b>Moderated chat was set to +!</b><br />Only users of rank + and higher can talk.</div>");
				}
			}
		}

		this.logEntry(user.name + " used /lockdown");
	},
	lockdownhelp: ["/lockdown - locks down the server, which prevents new battles from starting so that the server can eventually be restarted. Requires: ~"],

	prelockdown: function (target, room, user) {
		if (!this.can('lockdown')) return false;
		Rooms.global.lockdown = 'pre';
		this.sendReply("Tournaments have been disabled in preparation for the server restart.");
		this.logEntry(user.name + " used /prelockdown");
	},

	slowlockdown: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		Rooms.global.lockdown = true;
		for (let id in Rooms.rooms) {
			if (id === 'global') continue;
			let curRoom = Rooms.rooms[id];
			if (curRoom.battle) continue;
			curRoom.addRaw("<div class=\"broadcast-red\"><b>The server is restarting soon.</b><br />Please finish your battles quickly. No new battles can be started until the server resets in a few minutes.</div>");
		}

		this.logEntry(user.name + " used /slowlockdown");
	},

	endlockdown: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Rooms.global.lockdown) {
			return this.errorReply("We're not under lockdown right now.");
		}
		if (Rooms.global.lockdown === true) {
			for (let id in Rooms.rooms) {
				if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-green\"><b>The server restart was canceled.</b></div>");
			}
		} else {
			this.sendReply("Preparation for the server shutdown was canceled.");
		}
		Rooms.global.lockdown = false;

		this.logEntry(user.name + " used /endlockdown");
	},

	emergency: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (Config.emergency) {
			return this.errorReply("We're already in emergency mode.");
		}
		Config.emergency = true;
		for (let id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-red\">The server has entered emergency mode. Some features might be disabled or limited.</div>");
		}

		this.logEntry(user.name + " used /emergency");
	},

	endemergency: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (!Config.emergency) {
			return this.errorReply("We're not in emergency mode.");
		}
		Config.emergency = false;
		for (let id in Rooms.rooms) {
			if (id !== 'global') Rooms.rooms[id].addRaw("<div class=\"broadcast-green\"><b>The server is no longer in emergency mode.</b></div>");
		}

		this.logEntry(user.name + " used /endemergency");
	},

	kill: function (target, room, user) {
		if (!this.can('lockdown')) return false;

		if (Rooms.global.lockdown !== true) {
			return this.errorReply("For safety reasons, /kill can only be used during lockdown.");
		}

		if (CommandParser.updateServerLock) {
			return this.errorReply("Wait for /updateserver to finish before using /kill.");
		}

		for (let i in Sockets.workers) {
			Sockets.workers[i].kill();
		}

		if (!room.destroyLog) {
			process.exit();
			return;
		}
		room.destroyLog(() => {
			room.logEntry(user.name + " used /kill");
		}, () => {
			process.exit();
		});

		// Just in the case the above never terminates, kill the process
		// after 10 seconds.
		setTimeout(() => {
			process.exit();
		}, 10000);
	},
	killhelp: ["/kill - kills the server. Can't be done unless the server is in lockdown state. Requires: ~"],

	loadbanlist: function (target, room, user, connection) {
		if (!this.can('hotpatch')) return false;

		connection.sendTo(room, "Loading ipbans.txt...");
		Punishments.loadBanlist().then(
			() => connection.sendTo(room, "ipbans.txt has been reloaded."),
			error => connection.sendTo(room, "Something went wrong while loading ipbans.txt: " + error)
		);
	},
	loadbanlisthelp: ["/loadbanlist - Loads the bans located at ipbans.txt. The command is executed automatically at startup. Requires: ~"],

	refreshpage: function (target, room, user) {
		if (!this.can('hotpatch')) return false;
		Rooms.global.send('|refresh|');
		this.logEntry(user.name + " used /refreshpage");
	},

	updateserver: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/updateserver - Access denied.");
		}

		if (CommandParser.updateServerLock) {
			return this.errorReply("/updateserver - Another update is already in progress.");
		}

		CommandParser.updateServerLock = true;

		let logQueue = [];
		logQueue.push(user.name + " used /updateserver");

		connection.sendTo(room, "updating...");

		let exec = require('child_process').exec;
		exec('git diff-index --quiet HEAD --', error => {
			let cmd = 'git pull --rebase';
			if (error) {
				if (error.code === 1) {
					// The working directory or index have local changes.
					cmd = 'git stash && ' + cmd + ' && git stash pop';
				} else {
					// The most likely case here is that the user does not have
					// `git` on the PATH (which would be error.code === 127).
					connection.sendTo(room, "" + error);
					logQueue.push("" + error);
					for (let line of logQueue) {
						room.logEntry(line);
					}
					CommandParser.updateServerLock = false;
					return;
				}
			}
			let entry = "Running `" + cmd + "`";
			connection.sendTo(room, entry);
			logQueue.push(entry);
			exec(cmd, (error, stdout, stderr) => {
				for (let s of ("" + stdout + stderr).split("\n")) {
					connection.sendTo(room, s);
					logQueue.push(s);
				}
				for (let line of logQueue) {
					room.logEntry(line);
				}
				CommandParser.updateServerLock = false;
			});
		});
	},

	crashfixed: function (target, room, user) {
		if (Rooms.global.lockdown !== true) {
			return this.errorReply('/crashfixed - There is no active crash.');
		}
		if (!this.can('hotpatch')) return false;

		Rooms.global.lockdown = false;
		if (Rooms.lobby) {
			Rooms.lobby.modchat = false;
			Rooms.lobby.addRaw("<div class=\"broadcast-green\"><b>We fixed the crash without restarting the server!</b><br />You may resume talking in the lobby and starting new battles.</div>");
		}
		this.logEntry(user.name + " used /crashfixed");
	},
	crashfixedhelp: ["/crashfixed - Ends the active lockdown caused by a crash without the need of a restart. Requires: ~"],

	'memusage': 'memoryusage',
	memoryusage: function (target) {
		if (!this.can('hotpatch')) return false;
		let memUsage = process.memoryUsage();
		let results = [memUsage.rss, memUsage.heapUsed, memUsage.heapTotal];
		let units = ["B", "KiB", "MiB", "GiB", "TiB"];
		for (let i = 0; i < results.length; i++) {
			let unitIndex = Math.floor(Math.log2(results[i]) / 10); // 2^10 base log
			results[i] = "" + (results[i] / Math.pow(2, 10 * unitIndex)).toFixed(2) + " " + units[unitIndex];
		}
		this.sendReply("Main process. RSS: " + results[0] + ". Heap: " + results[1] + " / " + results[2] + ".");
	},

	bash: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/bash - Access denied.");
		}

		connection.sendTo(room, "$ " + target);
		let exec = require('child_process').exec;
		exec(target, (error, stdout, stderr) => {
			connection.sendTo(room, ("" + stdout + stderr));
		});
	},

	eval: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/eval - Access denied.");
		}
		if (!this.runBroadcast()) return;

		if (!this.broadcasting) this.sendReply('||>> ' + target);
		try {
			/* eslint-disable no-unused-vars */
			let battle = room.battle;
			let me = user;
			this.sendReply('||<< ' + eval(target));
			/* eslint-enable no-unused-vars */
		} catch (e) {
			this.sendReply('|| << ' + ('' + e.stack).replace(/\n *at CommandContext\.exports\.commands(\.[a-z0-9]+)*\.eval [\s\S]*/m, '').replace(/\n/g, '\n||'));
		}
	},

	evalbattle: function (target, room, user, connection) {
		if (!user.hasConsoleAccess(connection)) {
			return this.errorReply("/evalbattle - Access denied.");
		}
		if (!this.runBroadcast()) return;
		if (!room.battle) {
			return this.errorReply("/evalbattle - This isn't a battle room.");
		}

		room.battle.send('eval', target.replace(/\n/g, '\f'));
	},

	ebat: 'editbattle',
	editbattle: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!target) return this.parse('/help editbattle');
		if (!room.battle) {
			this.errorReply("/editbattle - This is not a battle room.");
			return false;
		}
		let cmd;
		let spaceIndex = target.indexOf(' ');
		if (spaceIndex > 0) {
			cmd = target.substr(0, spaceIndex).toLowerCase();
			target = target.substr(spaceIndex + 1);
		} else {
			cmd = target.toLowerCase();
			target = '';
		}
		if (cmd.charAt(cmd.length - 1) === ',') cmd = cmd.slice(0, -1);
		let targets = target.split(',');
		function getPlayer(input) {
			let player = room.battle.players[toId(input)];
			if (player) return player.slot;
			if (input.includes('1')) return 'p1';
			if (input.includes('2')) return 'p2';
			return 'p3';
		}
		function getPokemon(input) {
			if (/^[0-9]+$/.test(input)) {
				return '.pokemon[' + (parseInt(input) - 1) + ']';
			}
			return ".pokemon.find(p => p.speciesid==='" + toId(targets[1]) + "')";
		}
		switch (cmd) {
		case 'hp':
		case 'h':
			room.battle.send('eval', "let p=" + getPlayer(targets[0]) + getPokemon(targets[1]) + ";p.sethp(" + parseInt(targets[2]) + ");if (p.isActive)battle.add('-damage',p,p.getHealth);");
			break;
		case 'status':
		case 's':
			room.battle.send('eval', "let pl=" + getPlayer(targets[0]) + ";let p=pl" + getPokemon(targets[1]) + ";p.setStatus('" + toId(targets[2]) + "');if (!p.isActive){battle.add('','please ignore the above');battle.add('-status',pl.active[0],pl.active[0].status,'[silent]');}");
			break;
		case 'pp':
			room.battle.send('eval', "let pl=" + getPlayer(targets[0]) + ";let p=pl" + getPokemon(targets[1]) + ";p.moveset[p.moves.indexOf('" + toId(targets[2]) + "')].pp = " + parseInt(targets[3]));
			break;
		case 'boost':
		case 'b':
			room.battle.send('eval', "let p=" + getPlayer(targets[0]) + getPokemon(targets[1]) + ";battle.boost({" + toId(targets[2]) + ":" + parseInt(targets[3]) + "},p)");
			break;
		case 'volatile':
		case 'v':
			room.battle.send('eval', "let p=" + getPlayer(targets[0]) + getPokemon(targets[1]) + ";p.addVolatile('" + toId(targets[2]) + "')");
			break;
		case 'sidecondition':
		case 'sc':
			room.battle.send('eval', "let p=" + getPlayer(targets[0]) + ".addSideCondition('" + toId(targets[1]) + "')");
			break;
		case 'fieldcondition': case 'pseudoweather':
		case 'fc':
			room.battle.send('eval', "battle.addPseudoWeather('" + toId(targets[0]) + "')");
			break;
		case 'weather':
		case 'w':
			room.battle.send('eval', "battle.setWeather('" + toId(targets[0]) + "')");
			break;
		case 'terrain':
		case 't':
			room.battle.send('eval', "battle.setTerrain('" + toId(targets[0]) + "')");
			break;
		default:
			this.errorReply("Unknown editbattle command: " + cmd);
			break;
		}
	},
	editbattlehelp: ["/editbattle hp [player], [pokemon], [hp]",
		"/editbattle status [player], [pokemon], [status]",
		"/editbattle pp [player], [pokemon], [move], [pp]",
		"/editbattle boost [player], [pokemon], [stat], [amount]",
		"/editbattle volatile [player], [pokemon], [volatile]",
		"/editbattle sidecondition [player], [sidecondition]",
		"/editbattle fieldcondition [fieldcondition]",
		"/editbattle weather [weather]",
		"/editbattle terrain [terrain]",
		"Short forms: /ebat h OR s OR pp OR b OR v OR sc OR fc OR w OR t",
		"[player] must be a username or number, [pokemon] must be species name or number (not nickname), [move] must be move name"],

	/*********************************************************
	 * Battle commands
	 *********************************************************/

	forfeit: function (target, room, user) {
		if (!room.game) return this.errorReply("This room doesn't have an active game.");
		if (!room.game.forfeit) {
			return this.errorReply("This kind of game can't be forfeited.");
		}
		if (!room.game.forfeit(user)) {
			return this.errorReply("Forfeit failed.");
		}
	},

	choose: function (target, room, user) {
		if (!room.game) return this.errorReply("This room doesn't have an active game.");
		if (!room.game.choose) return this.errorReply("This game doesn't support /choose");

		room.game.choose(user, target);
	},

	mv: 'move',
	attack: 'move',
	move: function (target, room, user) {
		if (!room.game) return this.errorReply("This room doesn't have an active game.");
		if (!room.game.choose) return this.errorReply("This game doesn't support /choose");

		room.game.choose(user, 'move ' + target);
	},

	sw: 'switch',
	switch: function (target, room, user) {
		if (!room.game) return this.errorReply("This room doesn't have an active game.");
		if (!room.game.choose) return this.errorReply("This game doesn't support /choose");

		room.game.choose(user, 'switch ' + parseInt(target));
	},

	team: function (target, room, user) {
		if (!room.game) return this.errorReply("This room doesn't have an active game.");
		if (!room.game.choose) return this.errorReply("This game doesn't support /choose");

		room.game.choose(user, 'team ' + target);
	},

	undo: function (target, room, user) {
		if (!room.game) return this.errorReply("This room doesn't have an active game.");
		if (!room.game.undo) return this.errorReply("This game doesn't support /undo");

		room.game.undo(user, target);
	},

	savereplay: function (target, room, user, connection) {
		if (!room || !room.battle) return;
		let logidx = Tools.getFormat(room.battle.format).team ? 3 : 0; // retrieve spectator log (0) if there are set privacy concerns
		let data = room.getLog(logidx).join("\n");
		let datahash = crypto.createHash('md5').update(data.replace(/[^(\x20-\x7F)]+/g, '')).digest('hex');
		let players = room.battle.playerNames;
		LoginServer.request('prepreplay', {
			id: room.id.substr(7),
			loghash: datahash,
			p1: players[0],
			p2: players[1],
			format: room.format,
		}, success => {
			if (success && success.errorip) {
				connection.popup("This server's request IP " + success.errorip + " is not a registered server.");
				return;
			}
			connection.send('|queryresponse|savereplay|' + JSON.stringify({
				log: data,
				id: room.id.substr(7),
			}));
		});
	},

	addplayer: function (target, room, user) {
		if (!target) return this.parse('/help addplayer');
		if (!room.battle) return this.errorReply("You can only do this in battle rooms.");
		if (room.rated) return this.errorReply("You can only add a Player to unrated battles.");

		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let name = this.targetUsername;

		if (!targetUser) return this.errorReply("User " + name + " not found.");
		if (targetUser.can('joinbattle', null, room)) {
			return this.sendReply("" + name + " can already join battles as a Player.");
		}
		if (!this.can('joinbattle', null, room)) return;

		room.auth[targetUser.userid] = '\u2605';
		this.addModCommand("" + name + " was promoted to Player by " + user.name + ".");
	},
	addplayerhelp: ["/addplayer [username] - Allow the specified user to join the battle as a player."],

	joinbattle: 'joingame',
	joingame: function (target, room, user) {
		if (!room.game) return this.errorReply("This room doesn't have an active game.");
		if (!room.game.joinGame) return this.errorReply("This game doesn't support /joingame");

		room.game.joinGame(user);
	},

	leavebattle: 'leavegame',
	partbattle: 'leavegame',
	leavegame: function (target, room, user) {
		if (!room.game) return this.errorReply("This room doesn't have an active game.");
		if (!room.game.leaveGame) return this.errorReply("This game doesn't support /leavegame");

		room.game.leaveGame(user);
	},

	kickbattle: 'kickgame',
	kickgame: function (target, room, user) {
		if (!room.battle) return this.errorReply("You can only do this in battle rooms.");
		if (room.battle.tour || room.battle.rated) return this.errorReply("You can only do this in unrated non-tour battles.");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.errorReply("User " + this.targetUsername + " not found.");
		}
		if (!this.can('kick', targetUser)) return false;

		if (room.game.leaveGame(targetUser)) {
			this.addModCommand("" + targetUser.name + " was kicked from a battle by " + user.name + (target ? " (" + target + ")" : ""));
		} else {
			this.sendReply("/kickbattle - User isn't in battle.");
		}
	},
	kickbattlehelp: ["/kickbattle [username], [reason] - Kicks a user from a battle with reason. Requires: % @ & ~"],

	kickinactive: function (target, room, user) {
		if (room.requestKickInactive) {
			room.requestKickInactive(user);
		} else {
			this.errorReply("You can only kick inactive players from inside a room.");
		}
	},

	timer: function (target, room, user) {
		target = toId(target);
		if (room.requestKickInactive) {
			if (target === 'off' || target === 'false' || target === 'stop') {
				let canForceTimer = user.can('timer', null, room);
				if (room.resetTimer) {
					room.stopKickInactive(user, canForceTimer);
					if (canForceTimer) room.send('|inactiveoff|Timer was turned off by staff. Please do not turn it back on until our staff say it\'s okay');
				}
			} else if (target === 'on' || target === 'true' || !target) {
				room.requestKickInactive(user, user.can('timer'));
			} else {
				this.errorReply("'" + target + "' is not a recognized timer state.");
			}
		} else {
			this.sendReply("You can only set the timer from inside a battle room.");
		}
	},

	autotimer: 'forcetimer',
	forcetimer: function (target, room, user) {
		target = toId(target);
		if (!this.can('autotimer')) return;
		if (target === 'off' || target === 'false' || target === 'stop') {
			Config.forcetimer = false;
			this.addModCommand("Forcetimer is now OFF: The timer is now opt-in. (set by " + user.name + ")");
		} else if (target === 'on' || target === 'true' || !target) {
			Config.forcetimer = true;
			this.addModCommand("Forcetimer is now ON: All battles will be timed. (set by " + user.name + ")");
		} else {
			this.errorReply("'" + target + "' is not a recognized forcetimer setting.");
		}
	},

	forcetie: 'forcewin',
	forcewin: function (target, room, user) {
		if (!this.can('forcewin')) return false;
		if (!room.battle) {
			this.errorReply("/forcewin - This is not a battle room.");
			return false;
		}

		room.battle.endType = 'forced';
		if (!target) {
			room.battle.tie();
			this.logModCommand(user.name + " forced a tie.");
			return false;
		}
		let targetUser = Users.getExact(target);
		if (!targetUser) return this.errorReply("User '" + target + "' not found.");

		target = targetUser ? targetUser.userid : '';

		if (target) {
			room.battle.win(targetUser);
			this.logModCommand(user.name + " forced a win for " + target + ".");
		}
	},
	forcewinhelp: ["/forcetie - Forces the current match to end in a tie. Requires: & ~",
		"/forcewin [user] - Forces the current match to end in a win for a user. Requires: & ~"],

	/*********************************************************
	 * Challenging and searching commands
	 *********************************************************/

	cancelsearch: 'search',
	search: function (target, room, user) {
		if (target) {
			if (Config.pmmodchat) {
				let userGroup = user.group;
				if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
					let groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
					this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to search for a battle.");
					return false;
				}
			}
			Rooms.global.searchBattle(user, target);
		} else {
			Rooms.global.cancelSearch(user);
		}
	},

	chall: 'challenge',
	challenge: function (target, room, user, connection) {
		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			return this.popupReply("The user '" + this.targetUsername + "' was not found.");
		}
		if (targetUser.blockChallenges && !user.can('bypassblocks', targetUser)) {
			return this.popupReply("The user '" + this.targetUsername + "' is not accepting challenges right now.");
		}
		if (user.challengeTo) {
			return this.popupReply("You're already challenging '" + user.challengeTo.to + "'. Cancel that challenge before challenging someone else.");
		}
		if (Config.pmmodchat) {
			let userGroup = user.group;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(Config.pmmodchat)) {
				let groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
				this.popupReply("Because moderated chat is set, you must be of rank " + groupName + " or higher to challenge users.");
				return false;
			}
		}
		user.prepBattle(Tools.getFormat(target).id, 'challenge', connection).then(result => {
			if (result) user.makeChallenge(targetUser, target);
		});
	},

	bch: 'blockchallenges',
	blockchall: 'blockchallenges',
	blockchalls: 'blockchallenges',
	blockchallenges: function (target, room, user) {
		if (user.blockChallenges) return this.errorReply("You are already blocking challenges!");
		user.blockChallenges = true;
		this.sendReply("You are now blocking all incoming challenge requests.");
	},
	blockchallengeshelp: ["/blockchallenges - Blocks challenges so no one can challenge you. Unblock them with /unblockchallenges."],

	unbch: 'allowchallenges',
	unblockchall: 'allowchallenges',
	unblockchalls: 'allowchallenges',
	unblockchallenges: 'allowchallenges',
	allowchallenges: function (target, room, user) {
		if (!user.blockChallenges) return this.errorReply("You are already available for challenges!");
		user.blockChallenges = false;
		this.sendReply("You are available for challenges from now on.");
	},
	allowchallengeshelp: ["/unblockchallenges - Unblocks challenges so you can be challenged again. Block them with /blockchallenges."],

	cchall: 'cancelChallenge',
	cancelchallenge: function (target, room, user) {
		user.cancelChallengeTo(target);
	},

	accept: function (target, room, user, connection) {
		let userid = toId(target);
		let format = '';
		if (user.challengesFrom[userid]) format = user.challengesFrom[userid].format;
		if (!format) {
			this.popupReply(target + " cancelled their challenge before you could accept it.");
			return false;
		}
		user.prepBattle(Tools.getFormat(format).id, 'challenge', connection).then(result => {
			if (result) user.acceptChallengeFrom(userid);
		});
	},

	reject: function (target, room, user) {
		user.rejectChallengeFrom(toId(target));
	},

	saveteam: 'useteam',
	utm: 'useteam',
	useteam: function (target, room, user) {
		user.team = target;
	},

	vtm: function (target, room, user, connection) {
		if (Monitor.countPrepBattle(connection.ip, user.name)) {
			connection.popup("Due to high load, you are limited to 6 team validations every 3 minutes.");
			return;
		}
		if (!target) return this.errorReply("Provide a valid format.");
		let originalFormat = Tools.getFormat(target);
		let format = originalFormat.effectType === 'Format' ? originalFormat : Tools.getFormat('Anything Goes');
		if (format.effectType !== 'Format') return this.popupReply("Please provide a valid format.");

		TeamValidator(format.id).prepTeam(user.team).then(result => {
			let matchMessage = (originalFormat === format ? "" : "The format '" + originalFormat.name + "' was not found.");
			if (result.charAt(0) === '1') {
				connection.popup("" + (matchMessage ? matchMessage + "\n\n" : "") + "Your team is valid for " + format.name + ".");
			} else {
				connection.popup("" + (matchMessage ? matchMessage + "\n\n" : "") + "Your team was rejected for the following reasons:\n\n- " + result.slice(1).replace(/\n/g, '\n- '));
			}
		});
	},

	/*********************************************************
	 * Low-level
	 *********************************************************/

	cmd: 'query',
	query: function (target, room, user, connection) {
		// Avoid guest users to use the cmd errors to ease the app-layer attacks in emergency mode
		let trustable = (!Config.emergency || (user.named && user.registered));
		if (Config.emergency && Monitor.countCmd(connection.ip, user.name)) return false;
		let spaceIndex = target.indexOf(' ');
		let cmd = target;
		if (spaceIndex > 0) {
			cmd = target.substr(0, spaceIndex);
			target = target.substr(spaceIndex + 1);
		} else {
			target = '';
		}
		if (cmd === 'userdetails') {
			let targetUser = Users.get(target);
			if (!trustable || !targetUser) {
				connection.send('|queryresponse|userdetails|' + JSON.stringify({
					userid: toId(target),
					rooms: false,
				}));
				return false;
			}
			let roomList = {};
			for (let i in targetUser.roomCount) {
				if (i === 'global') continue;
				let targetRoom = Rooms.get(i);
				if (!targetRoom) continue; // shouldn't happen
				let roomData = {};
				if (targetRoom.isPrivate) {
					if (!(i in user.roomCount) && !(i in user.games)) continue;
					roomData.isPrivate = true;
				}
				if (targetRoom.battle) {
					let battle = targetRoom.battle;
					roomData.p1 = battle.p1 ? ' ' + battle.p1.name : '';
					roomData.p2 = battle.p2 ? ' ' + battle.p2.name : '';
				}
				roomList[i] = roomData;
			}
			if (!targetUser.roomCount['global']) roomList = false;
			let userdetails = {
				userid: targetUser.userid,
				avatar: targetUser.avatar,
				group: targetUser.group,
				rooms: roomList,
			};
			connection.send('|queryresponse|userdetails|' + JSON.stringify(userdetails));
		} else if (cmd === 'roomlist') {
			if (!trustable) return false;
			connection.send('|queryresponse|roomlist|' + JSON.stringify({
				rooms: Rooms.global.getRoomList(target),
			}));
		} else if (cmd === 'rooms') {
			if (!trustable) return false;
			connection.send('|queryresponse|rooms|' + JSON.stringify(
				Rooms.global.getRooms(user)
			));
		} else if (cmd === 'laddertop') {
			if (!trustable) return false;
			Ladders(target).getTop().then(result => {
				connection.send('|queryresponse|laddertop|' + JSON.stringify(result));
			});
		} else {
			// default to sending null
			if (!trustable) return false;
			connection.send('|queryresponse|' + cmd + '|null');
		}
	},

	trn: function (target, room, user, connection) {
		let commaIndex = target.indexOf(',');
		let targetName = target;
		let targetRegistered = false;
		let targetToken = '';
		if (commaIndex >= 0) {
			targetName = target.substr(0, commaIndex);
			target = target.substr(commaIndex + 1);
			commaIndex = target.indexOf(',');
			targetRegistered = target;
			if (commaIndex >= 0) {
				targetRegistered = !!parseInt(target.substr(0, commaIndex));
				targetToken = target.substr(commaIndex + 1);
			}
		}
		user.rename(targetName, targetToken, targetRegistered, connection);
	},

	a: function (target, room, user) {
		if (!this.can('rawpacket')) return false;
		// secret sysop command
		room.add(target);
	},

	/*********************************************************
	 * Help commands
	 *********************************************************/

	commands: 'help',
	h: 'help',
	'?': 'help',
	help: function (target, room, user) {
		target = target.toLowerCase();

		// overall
		if (target === 'help' || target === 'h' || target === '?' || target === 'commands') {
			this.sendReply("/help OR /h OR /? - Gives you help.");
		} else if (!target) {
			this.sendReply("COMMANDS: /nick, /avatar, /rating, /whois, /msg, /reply, /ignore, /away, /back, /timestamps, /highlight");
			this.sendReply("INFORMATIONAL COMMANDS: /data, /dexsearch, /movesearch, /groups, /faq, /rules, /intro, /formatshelp, /othermetas, /learn, /analysis, /calc (replace / with ! to broadcast. Broadcasting requires: + % @ # & ~)");
			if (user.group !== Config.groupsranking[0]) {
				this.sendReply("DRIVER COMMANDS: /warn, /mute, /hourmute, /unmute, /alts, /forcerename, /modlog, /modnote, /lock, /unlock, /announce, /redirect");
				this.sendReply("MODERATOR COMMANDS: /ban, /unban, /ip, /modchat");
				this.sendReply("LEADER COMMANDS: /declare, /forcetie, /forcewin, /promote, /demote, /banip, /host, /unbanall");
			}
			this.sendReply("For an overview of room commands, use /roomhelp");
			this.sendReply("For details of a specific command, use something like: /help data");
		} else {
			let altCommandHelp;
			let helpCmd;
			let targets = target.split(' ');
			let allCommands = CommandParser.commands;
			if (typeof allCommands[target] === 'string') {
				// If a function changes with command name, help for that command name will be searched first.
				altCommandHelp = target + 'help';
				if (altCommandHelp in allCommands) {
					helpCmd = altCommandHelp;
				} else {
					helpCmd = allCommands[target] + 'help';
				}
			} else if (targets.length > 1 && typeof allCommands[targets[0]] === 'object') {
				// Handle internal namespace commands
				let helpCmd = targets[targets.length - 1] + 'help';
				let namespace = allCommands[targets[0]];
				for (let i = 1; i < targets.length - 1; i++) {
					if (!namespace[targets[i]]) return this.errorReply("Help for the command '" + target + "' was not found. Try /help for general help");
					namespace = namespace[targets[i]];
				}
				if (typeof namespace[helpCmd] === 'object') return this.sendReply(namespace[helpCmd].join('\n'));
				if (typeof namespace[helpCmd] === 'function') return this.parse('/' + targets.slice(0, targets.length - 1).concat(helpCmd).join(' '));
				return this.errorReply("Help for the command '" + target + "' was not found. Try /help for general help");
			} else {
				helpCmd = target + 'help';
			}
			if (helpCmd in allCommands) {
				if (typeof allCommands[helpCmd] === 'function') {
					// If the help command is a function, parse it instead
					this.parse('/' + helpCmd);
				} else if (Array.isArray(allCommands[helpCmd])) {
					this.sendReply(allCommands[helpCmd].join('\n'));
				}
			} else {
				this.errorReply("Help for the command '" + target + "' was not found. Try /help for general help");
			}
		}
	},

};

process.nextTick(() => {
	CommandParser.multiLinePattern.register('>>>? ');
	CommandParser.multiLinePattern.register('/(room|staff)(topic|intro) ');
});
