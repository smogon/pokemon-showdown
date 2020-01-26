/**
 * Moderation commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are commands for staff.
 *
 * For the API, see chat-plugins/COMMANDS.md
 *
 * @license MIT
 */

'use strict';

/* eslint no-else-return: "error" */

const MAX_REASON_LENGTH = 300;
const MUTE_LENGTH = 7 * 60 * 1000;
const HOURMUTE_LENGTH = 60 * 60 * 1000;

/** Require reasons for punishment commands */
const REQUIRE_REASONS = true;

exports.commands = {

	roomowner(target, room, user) {
		if (!room.chatRoomData) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		if (!target) return this.parse('/help roomowner');
		target = this.splitTarget(target, true);
		if (target) return this.errorReply(`This command does not support specifying a reason.`);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		let userid = toID(name);

		if (!Users.isUsernameKnown(userid)) {
			return this.errorReply(`User '${this.targetUsername}' is offline and unrecognized, and so can't be promoted.`);
		}

		if (!this.can('makeroom')) return false;

		if (!room.auth) room.auth = room.chatRoomData.auth = {};

		room.auth[userid] = '#';
		this.addModAction(`${name} was appointed Room Owner by ${user.name}.`);
		this.modlog('ROOMOWNER', userid);
		if (targetUser) {
			targetUser.popup(`You were appointed Room Owner by ${user.name} in ${room.roomid}.`);
			room.onUpdateIdentity(targetUser);
			if (room.subRooms) {
				for (const subRoom of room.subRooms.values()) {
					subRoom.onUpdateIdentity(targetUser);
				}
			}
		}
		Rooms.global.writeChatRoomData();
	},
	roomownerhelp: [`/roomowner [username] - Appoints [username] as a room owner. Requires: & ~`],

	'!roompromote': true,
	roomdemote: 'roompromote',
	roompromote(target, room, user, connection, cmd) {
		if (!room) {
			// this command isn't marked as room-only because it's usable in PMs through /invite
			return this.errorReply("This command is only available in rooms");
		}
		if (!room.auth) {
			this.sendReply("/roompromote - This room isn't designed for per-room moderation.");
			return this.sendReply("Before setting room staff, you need to set a room owner with /roomowner");
		}
		if (!this.canTalk()) return;
		if (!target) return this.parse('/help roompromote');

		const force = target.startsWith('!!!');
		if (force) target = target.slice(3);
		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let userid = toID(this.targetUsername);
		let name = targetUser ? targetUser.name : this.filter(this.targetUsername);
		if (!name) return;
		name = name.slice(0, 18);

		if (!userid) return this.parse('/help roompromote');
		if (!targetUser && !Users.isUsernameKnown(userid) && !force) {
			return this.errorReply(`User '${name}' is offline and unrecognized, and so can't be promoted.`);
		}
		if (targetUser && !targetUser.registered) {
			return this.errorReply(`User '${name}' is unregistered, and so can't be promoted.`);
		}

		let currentGroup = room.getAuth({id: userid, group: (Users.usergroups[userid] || ' ').charAt(0)});
		let nextGroup = target;
		if (target === 'deauth') nextGroup = Config.groupsranking[0];
		if (!nextGroup) {
			return this.errorReply("Please specify a group such as /roomvoice or /roomdeauth");
		}
		if (!Config.groups[nextGroup]) {
			return this.errorReply(`Group '${nextGroup}' does not exist.`);
		}

		if (Config.groups[nextGroup].globalonly || (Config.groups[nextGroup].battleonly && !room.battle)) {
			return this.errorReply(`Group 'room${Config.groups[nextGroup].id}' does not exist as a room rank.`);
		}

		let groupName = Config.groups[nextGroup].name || "regular user";
		if ((room.auth[userid] || Config.groupsranking[0]) === nextGroup) {
			return this.errorReply(`User '${name}' is already a ${groupName} in this room.`);
		}
		if (!user.can('makeroom')) {
			if (currentGroup !== ' ' && !user.can('room' + (Config.groups[currentGroup] ? Config.groups[currentGroup].id : 'voice'), null, room)) {
				return this.errorReply(`/${cmd} - Access denied for promoting/demoting from ${(Config.groups[currentGroup] ? Config.groups[currentGroup].name : "an undefined group")}.`);
			}
			if (nextGroup !== ' ' && !user.can('room' + Config.groups[nextGroup].id, null, room)) {
				return this.errorReply(`/${cmd} - Access denied for promoting/demoting to ${Config.groups[nextGroup].name}.`);
			}
		}
		let nextGroupIndex = Config.groupsranking.indexOf(nextGroup) || 1; // assume voice if not defined (although it should be by now)
		if (targetUser && targetUser.locked && !room.isPrivate && !room.battle && !room.isPersonal && nextGroupIndex >= 2) {
			return this.errorReply("Locked users can't be promoted.");
		}

		if (nextGroup === Config.groupsranking[0]) {
			delete room.auth[userid];
		} else {
			room.auth[userid] = nextGroup;
		}

		// Only show popup if: user is online and in the room, the room is public, and not a groupchat or a battle.
		let needsPopup = targetUser && room.users[targetUser.id] && !room.isPrivate && !room.isPersonal && !room.battle;

		if (this.pmTarget && targetUser) {
			const text = `${targetUser.name} was invited (and promoted to Room ${groupName}) by ${user.name}.`;
			room.add(`|c|${user.getIdentity(room)}|/log ${text}`).update();
			this.modlog('INVITE', targetUser, null, {noip: 1, noalts: 1});
		} else if (nextGroup in Config.groups && currentGroup in Config.groups && Config.groups[nextGroup].rank < Config.groups[currentGroup].rank) {
			if (targetUser && room.users[targetUser.id] && !Config.groups[nextGroup].modlog) {
				// if the user can't see the demotion message (i.e. rank < %), it is shown in the chat
				targetUser.send(`>${room.roomid}\n(You were demoted to Room ${groupName} by ${user.name}.)`);
			}
			this.privateModAction(`(${name} was demoted to Room ${groupName} by ${user.name}.)`);
			this.modlog(`ROOM${groupName.toUpperCase()}`, userid, '(demote)');
			if (needsPopup) targetUser.popup(`You were demoted to Room ${groupName} by ${user.name} in ${room.roomid}.`);
		} else if (nextGroup === '#') {
			this.addModAction(`${'' + name} was promoted to ${groupName} by ${user.name}.`);
			this.modlog('ROOM OWNER', userid);
			if (needsPopup) targetUser.popup(`You were promoted to ${groupName} by ${user.name} in ${room.roomid}.`);
		} else {
			this.addModAction(`${'' + name} was promoted to Room ${groupName} by ${user.name}.`);
			this.modlog(`ROOM${groupName.toUpperCase()}`, userid);
			if (needsPopup) targetUser.popup(`You were promoted to Room ${groupName} by ${user.name} in ${room.roomid}.`);
		}

		if (targetUser) {
			targetUser.updateIdentity(room.roomid);
			if (room.subRooms) {
				for (const subRoom of room.subRooms.values()) {
					targetUser.updateIdentity(subRoom.roomid);
				}
			}
		}
		if (room.chatRoomData) Rooms.global.writeChatRoomData();
	},
	roompromotehelp: [
		`/roompromote OR /roomdemote [username], [group symbol] - Promotes/demotes the user to the specified room rank. Requires: @ # & ~`,
		`/room[group] [username] - Promotes/demotes the user to the specified room rank. Requires: @ # & ~`,
		`/roomdeauth [username] - Removes all room rank from the user. Requires: @ # & ~`,
	],

	'!roomauth': true,
	roomstaff: 'roomauth',
	roomauth1: 'roomauth',
	roomauth(target, room, user, connection, cmd) {
		let userLookup = '';
		if (cmd === 'roomauth1') userLookup = `\n\nTo look up auth for a user, use /userauth ${target}`;
		let targetRoom = room;
		if (target) targetRoom = Rooms.search(target);
		if (!targetRoom || targetRoom.roomid === 'global' || !targetRoom.checkModjoin(user)) return this.errorReply(`The room "${target}" does not exist.`);
		if (!targetRoom.auth) return this.sendReply(`/roomauth - The room '${targetRoom.title || target}' isn't designed for per-room moderation and therefore has no auth list.${userLookup}`);

		let rankLists = {};
		for (let u in targetRoom.auth) {
			if (!rankLists[targetRoom.auth[u]]) rankLists[targetRoom.auth[u]] = [];
			rankLists[targetRoom.auth[u]].push(u);
		}

		let buffer = Object.keys(rankLists).sort((a, b) =>
			(Config.groups[b] || {rank: 0}).rank - (Config.groups[a] || {rank: 0}).rank
		).map(r => {
			let roomRankList = rankLists[r].sort();
			roomRankList = roomRankList.map(s => {
				const u = Users.get(s);
				const isAway = u && u.statusType !== 'online';
				return s in targetRoom.users && !isAway ? `**${s}**` : s;
			});
			return `${Config.groups[r] ? `${Config.groups[r].name}s (${r})` : r}:\n${roomRankList.join(", ")}`;
		});

		let curRoom = targetRoom;
		while (curRoom.parent) {
			const modjoinSetting = curRoom.modjoin === true ? curRoom.modchat : curRoom.modjoin;
			const roomType = (modjoinSetting ? `modjoin ${modjoinSetting} ` : '');
			const inheritedUserType = (modjoinSetting ? ` of rank ${modjoinSetting} and above` : '');
			if (curRoom.parent) {
				const also = buffer.length === 0 ? `` : ` also`;
				buffer.push(`${curRoom.title} is a ${roomType}subroom of ${curRoom.parent.title}, so ${curRoom.parent.title} users${inheritedUserType}${also} have authority in this room.`);
			}
			curRoom = curRoom.parent;
		}
		if (!buffer.length) {
			connection.popup(`The room '${targetRoom.title}' has no auth. ${userLookup}`);
			return;
		}
		if (!curRoom.isPrivate) {
			buffer.push(`${curRoom.title} is a public room, so global auth with no relevant roomauth will have authority in this room.`);
		} else if (curRoom.isPrivate === 'hidden' || curRoom.isPrivate === 'voice') {
			buffer.push(`${curRoom.title} is a hidden room, so global auth with no relevant roomauth will have authority in this room.`);
		}
		if (targetRoom !== room) buffer.unshift(`${targetRoom.title} room auth:`);
		connection.popup(`${buffer.join("\n\n")}${userLookup}`);
	},

	'!userauth': true,
	userauth(target, room, user, connection) {
		let targetId = toID(target) || user.id;
		let targetUser = Users.getExact(targetId);
		let targetUsername = (targetUser ? targetUser.name : target);

		let buffer = [];
		let innerBuffer = [];
		let group = Users.usergroups[targetId];
		if (group) {
			group = group.charAt(0);
			if (group === ' ') group = 'trusted';
			buffer.push(`Global auth: ${group}`);
		}
		for (const curRoom of Rooms.rooms.values()) {
			if (!curRoom.auth || curRoom.isPrivate) continue;
			group = curRoom.auth[targetId];
			if (!group) continue;
			innerBuffer.push(group + curRoom.roomid);
		}
		if (innerBuffer.length) {
			buffer.push(`Room auth: ${innerBuffer.join(', ')}`);
		}
		if (targetId === user.id || user.can('lock')) {
			innerBuffer = [];
			for (const curRoom of Rooms.rooms.values()) {
				if (!curRoom.auth || !curRoom.isPrivate) continue;
				if (curRoom.isPrivate === true) continue;
				let auth = curRoom.auth[targetId];
				if (!auth) continue;
				innerBuffer.push(auth + curRoom.roomid);
			}
			if (innerBuffer.length) {
				buffer.push(`Hidden room auth: ${innerBuffer.join(', ')}`);
			}
		}
		if (targetId === user.id || user.can('makeroom')) {
			innerBuffer = [];
			for (const chatRoom of Rooms.global.chatRooms) {
				if (!chatRoom.auth || !chatRoom.isPrivate) continue;
				if (chatRoom.isPrivate !== true) continue;
				let auth = chatRoom.auth[targetId];
				if (!auth) continue;
				innerBuffer.push(auth + chatRoom.roomid);
			}
			if (innerBuffer.length) {
				buffer.push(`Private room auth: ${innerBuffer.join(', ')}`);
			}
		}
		if (!buffer.length) {
			buffer.push("No global or room auth.");
		}

		buffer.unshift(`${targetUsername} user auth:`);
		connection.popup(buffer.join("\n\n"));
	},

	'!autojoin': true,
	autojoin(target, room, user, connection) {
		let targets = target.split(',');
		if (targets.length > 11 || connection.inRooms.size > 1) return;
		Rooms.global.autojoinRooms(user, connection);
		let autojoins = [];

		const promises = targets.map(target =>
			user.tryJoinRoom(target, connection).then(ret => {
				if (ret === Rooms.RETRY_AFTER_LOGIN) {
					autojoins.push(target);
				}
			})
		);

		Promise.all(promises).then(() => {
			connection.autojoins = autojoins.join(',');
		});
	},

	'!join': true,
	joim: 'join',
	j: 'join',
	join(target, room, user, connection) {
		if (!target) return this.parse('/help join');
		if (target.startsWith('http://')) target = target.slice(7);
		if (target.startsWith('https://')) target = target.slice(8);
		if (target.startsWith(`${Config.routes.client}/`)) target = target.slice(Config.routes.client.length + 1);
		if (target.startsWith('psim.us/')) target = target.slice(8);
		user.tryJoinRoom(target, connection).then(ret => {
			if (ret === Rooms.RETRY_AFTER_LOGIN) {
				connection.sendTo(target, `|noinit|namerequired|The room '${target}' does not exist or requires a login to join.`);
			}
		});
	},
	joinhelp: [`/join [roomname] - Attempt to join the room [roomname].`],

	'!part': true,
	leave: 'part',
	part(target, room, user, connection) {
		let targetRoom = target ? Rooms.search(target) : room;
		if (!targetRoom || targetRoom === Rooms.global) {
			if (target.startsWith('view-')) return;
			return this.errorReply(`The room '${target}' does not exist.`);
		}
		user.leaveRoom(targetRoom, connection);
	},

	/*********************************************************
	 * Moderating: Punishments
	 *********************************************************/

	kick: 'warn',
	k: 'warn',
	warn(target, room, user) {
		if (!target) return this.parse('/help warn');
		if (!this.canTalk()) return;
		if (room.isPersonal && !user.can('warn')) return this.errorReply("Warning is unavailable in group chats.");
		// If used in staff, help tickets or battles, log the warn to the global modlog.
		const globalWarn = room.roomid === 'staff' || room.roomid.startsWith('help-') || (room.battle && !room.parent);

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) {
			if (!targetUser || !globalWarn) return this.errorReply(`User '${this.targetUsername}' not found.`);
			if (!this.can('warn')) return false;

			this.addModAction(`${targetUser.name} would be warned by ${user.name} but is offline.${(target ? ` (${target})` : ``)}`);
			this.globalModlog('WARN OFFLINE', targetUser, ` by ${user.id}${(target ? `: ${target}` : ``)}`);
			return;
		}
		if (!(targetUser in room.users) && !globalWarn) {
			return this.errorReply(`User ${this.targetUsername} is not in the room ${room.roomid}.`);
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		if (!this.can('warn', targetUser, room)) return false;
		if (targetUser.can('makeroom')) return this.errorReply("You are not allowed to warn upper staff members.");

		const now = Date.now();
		const timeout = now - targetUser.lastWarnedAt;
		if (timeout < 15 * 1000) {
			const remainder = (15 - (timeout / 1000)).toFixed(2);
			return this.errorReply(`You must wait ${remainder} more seconds before you can warn ${targetUser.name} again.`);
		}

		this.addModAction(`${targetUser.name} was warned by ${user.name}.${(target ? ` (${target})` : ``)}`);
		if (globalWarn) {
			this.globalModlog('WARN', targetUser, ` by ${user.id}${(target ? `: ${target}` : ``)}`);
		} else {
			this.modlog('WARN', targetUser, target, {noalts: 1});
		}
		targetUser.send(`|c|~|/warn ${target}`);

		const userid = targetUser.getLastId();
		this.add(`|unlink|${userid}`);
		if (userid !== toID(this.inputUsername)) this.add(`|unlink|${toID(this.inputUsername)}`);

		targetUser.lastWarnedAt = now;

		// Automatically upload replays as evidence/reference to the punishment
		if (globalWarn && room.battle) this.parse('/savereplay forpunishment');
	},
	warnhelp: [`/warn OR /k [username], [reason] - Warns a user showing them the Pok\u00e9mon Showdown Rules and [reason] in an overlay. Requires: % @ # & ~`],

	redirect: 'redir',
	redir(target, room, user, connection) {
		if (!target) return this.parse('/help redirect');
		if (room.isPrivate || room.isPersonal) return this.errorReply("Users cannot be redirected from private or personal rooms.");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		let targetRoom = Rooms.search(target);
		if (!targetRoom || targetRoom.modjoin || targetRoom.staffRoom) {
			return this.errorReply(`The room "${target}" does not exist.`);
		}
		if (!this.can('warn', targetUser, room) || !this.can('warn', targetUser, targetRoom)) return false;

		if (!this.can('rangeban', targetUser)) {
			this.errorReply(`Redirects have been deprecated. Instead of /redirect, use <<room links>> or /invite to guide users to the correct room, and punish if users don't cooperate.`);
			return;
		}

		if (!targetUser || !targetUser.connected) {
			return this.errorReply(`User ${this.targetUsername} not found.`);
		}
		if (targetRoom.roomid === "global") return this.errorReply(`Users cannot be redirected to the global room.`);
		if (targetRoom.isPrivate || targetRoom.isPersonal) {
			return this.errorReply(`The room "${target}" is not public.`);
		}
		if (targetUser.inRooms.has(targetRoom.roomid)) {
			return this.errorReply(`User ${targetUser.name} is already in the room ${targetRoom.title}!`);
		}
		if (!targetUser.inRooms.has(room.roomid)) {
			return this.errorReply(`User ${this.targetUsername} is not in the room ${room.roomid}.`);
		}
		targetUser.leaveRoom(room.roomid);
		targetUser.popup(`You are in the wrong room; please go to <<${targetRoom.roomid}>> instead`);
		this.addModAction(`${targetUser.name} was redirected to room ${targetRoom.title} by ${user.name}.`);
		this.modlog('REDIRECT', targetUser, `to ${targetRoom.title}`, {noip: 1, noalts: 1});
		targetUser.leaveRoom(room);
	},
	redirhelp: [`/redirect OR /redir [username], [roomname] - [DEPRECATED] Attempts to redirect the user [username] to the room [roomname]. Requires: & ~`],

	m: 'mute',
	mute(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help mute');
		if (!this.canTalk()) return;

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply(`User '${this.targetUsername}' not found.`);
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}

		let muteDuration = ((cmd === 'hm' || cmd === 'hourmute') ? HOURMUTE_LENGTH : MUTE_LENGTH);
		if (!this.can('mute', targetUser, room)) return false;
		if (targetUser.can('makeroom')) return this.errorReply("You are not allowed to mute upper staff members.");
		let canBeMutedFurther = ((room.getMuteTime(targetUser) || 0) <= (muteDuration * 5 / 6));
		if (targetUser.locked || (room.isMuted(targetUser) && !canBeMutedFurther) || Punishments.isRoomBanned(targetUser, room.roomid)) {
			let problem = ` but was already ${(targetUser.locked ? "locked" : room.isMuted(targetUser) ? "muted" : "room banned")}`;
			if (!target) {
				return this.privateModAction(`(${targetUser.name} would be muted by ${user.name} ${problem}.)`);
			}
			return this.addModAction(`${targetUser.name} would be muted by ${user.name} ${problem}. (${target})`);
		}

		if (targetUser in room.users) targetUser.popup(`|modal|${user.name} has muted you in ${room.roomid} for ${Chat.toDurationString(muteDuration)}. ${target}`);
		this.addModAction(`${targetUser.name} was muted by ${user.name} for ${Chat.toDurationString(muteDuration)}.${(target ? ` (${target})` : ``)}`);
		this.modlog(`${cmd.includes('h') ? 'HOUR' : ''}MUTE`, targetUser, target);
		if (targetUser.autoconfirmed && targetUser.autoconfirmed !== targetUser.id) {
			let displayMessage = `(${targetUser.name}'s ac account: ${targetUser.autoconfirmed})`;
			this.privateModAction(displayMessage);
		}
		let userid = targetUser.getLastId();
		this.add(`|unlink|${userid}`);
		if (userid !== toID(this.inputUsername)) this.add(`|unlink|${toID(this.inputUsername)}`);

		room.mute(targetUser, muteDuration, false);
	},
	mutehelp: [`/mute OR /m [username], [reason] - Mutes a user with reason for 7 minutes. Requires: % @ # & ~`],

	hm: 'hourmute',
	hourmute(target) {
		if (!target) return this.parse('/help hourmute');
		this.run('mute');
	},
	hourmutehelp: [`/hourmute OR /hm [username], [reason] - Mutes a user with reason for an hour. Requires: % @ # & ~`],

	um: 'unmute',
	unmute(target, room, user) {
		if (!target) return this.parse('/help unmute');
		target = this.splitTarget(target);
		if (target) return this.errorReply(`This command does not support specifying a reason.`);
		if (!this.canTalk()) return;
		if (!this.can('mute', null, room)) return false;

		let targetUser = this.targetUser;
		let successfullyUnmuted = room.unmute(targetUser ? targetUser.id : toID(this.targetUsername), `Your mute in '${room.title}' has been lifted.`);

		if (successfullyUnmuted) {
			this.addModAction(`${(targetUser ? targetUser.name : successfullyUnmuted)} was unmuted by ${user.name}.`);
			this.modlog('UNMUTE', (targetUser || successfullyUnmuted), null, {noip: 1, noalts: 1});
		} else {
			this.errorReply(`${(targetUser ? targetUser.name : this.targetUsername)} is not muted.`);
		}
	},
	unmutehelp: [`/unmute [username] - Removes mute from user. Requires: % @ # & ~`],

	rb: 'ban',
	roomban: 'ban',
	b: 'ban',
	ban(target, room, user, connection) {
		if (!target) return this.parse('/help ban');
		if (!this.canTalk()) return;

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply(`User '${this.targetUsername}' not found.`);
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		if (!this.can('ban', targetUser, room)) return false;
		if (targetUser.can('makeroom')) return this.errorReply("You are not allowed to ban upper staff members.");
		if (Punishments.getRoomPunishType(room, this.targetUsername) === 'BLACKLIST') return this.errorReply(`This user is already blacklisted from ${room.roomid}.`);
		let name = targetUser.getLastName();
		let userid = targetUser.getLastId();

		if (Punishments.isRoomBanned(targetUser, room.roomid) && !target) {
			let problem = " but was already banned";
			return this.privateModAction(`(${name} would be banned by ${user.name} ${problem}.)`);
		}

		if (targetUser.trusted && room.isPrivate !== true && !room.isPersonal) {
			Monitor.log(`[CrisisMonitor] Trusted user ${targetUser.name} ${(targetUser.trusted !== targetUser.id ? ` (${targetUser.trusted})` : ``)} was roombanned from ${room.roomid} by ${user.name}, and should probably be demoted.`);
		}

		if (targetUser in room.users || user.can('lock')) {
			targetUser.popup(
				`|modal||html|<p>${Chat.escapeHTML(user.name)} has banned you from the room ${room.roomid} ${(room.subRooms ? ` and its subrooms` : ``)}.</p>${(target ? `<p>Reason: ${Chat.escapeHTML(target)}</p>` : ``)}<p>To appeal the ban, PM the staff member that banned you${(!room.battle && room.auth ? ` or a room owner. </p><p><button name="send" value="/roomauth ${room.roomid}">List Room Staff</button></p>` : `.</p>`)}`
			);
		}

		const reason = (target ? ` (${target})` : ``);
		this.addModAction(`${name} was banned from ${room.title} by ${user.name}.${reason}`);

		let affected = Punishments.roomBan(room, targetUser, null, null, target);

		if (!room.isPrivate && room.chatRoomData) {
			let acAccount = (targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
			let displayMessage = '';
			if (affected.length > 1) {
				displayMessage = `(${name}'s ${(acAccount ? ` ac account: ${acAccount}, ` : ``)} banned alts: ${affected.slice(1).map(user => user.getLastName()).join(", ")})`;
				this.privateModAction(displayMessage);
			} else if (acAccount) {
				displayMessage = `(${name}'s ac account: ${acAccount})`;
				this.privateModAction(displayMessage);
			}
		}
		room.hideText([userid, toID(this.inputUsername)]);

		if (room.isPrivate !== true && room.chatRoomData) {
			this.globalModlog("ROOMBAN", targetUser, ` by ${user.id}${(target ? `: ${target}` : ``)}`);
		} else {
			this.modlog("ROOMBAN", targetUser, ` by ${user.id}${(target ? `: ${target}` : ``)}`);
		}
		return true;
	},
	banhelp: [`/ban [username], [reason] - Bans the user from the room you are in. Requires: @ # & ~`],

	unroomban: 'unban',
	roomunban: 'unban',
	unban(target, room, user, connection) {
		if (!target) return this.parse('/help unban');
		if (!this.can('ban', null, room)) return false;

		let name = Punishments.roomUnban(room, target);

		if (name) {
			this.addModAction(`${name} was unbanned from ${room.title} by ${user.name}.`);
			if (room.isPrivate !== true && room.chatRoomData) {
				this.globalModlog("UNROOMBAN", name, ` by ${user.id}`);
			}
		} else {
			this.errorReply(`User '${target}' is not banned from this room.`);
		}
	},
	unbanhelp: [`/unban [username] - Unbans the user from the room you are in. Requires: @ # & ~`],

	forcelock: 'lock',
	l: 'lock',
	ipmute: 'lock',
	wl: 'lock',
	weeklock: 'lock',
	lock(target, room, user, connection, cmd) {
		let week = cmd === 'wl' || cmd === 'weeklock';

		if (!target) {
			if (week) return this.parse('/help weeklock');
			return this.parse('/help lock');
		}

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser && !Punishments.search(toID(this.targetUsername)).length) {
			return this.errorReply(`User '${this.targetUsername}' not found.`);
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		if (!this.can('lock', targetUser)) return false;

		let name, userid;

		if (targetUser) {
			name = targetUser.getLastName();
			userid = targetUser.getLastId();

			if (targetUser.locked && !week) {
				return this.privateModAction(`(${name} would be locked by ${user.name} but was already locked.)`);
			}

			if (targetUser.trusted) {
				if (cmd === 'forcelock') {
					let from = targetUser.distrust();
					Monitor.log(`[CrisisMonitor] ${name} was locked by ${user.name} and demoted from ${from.join(", ")}.`);
					this.globalModlog("CRISISDEMOTE", targetUser, ` from ${from.join(", ")}`);
				} else {
					return this.sendReply(`${name} is a trusted user. If you are sure you would like to lock them use /forcelock.`);
				}
			} else if (cmd === 'forcelock') {
				return this.errorReply(`Use /lock; ${name} is not a trusted user.`);
			}
		} else {
			name = this.targetUsername;
			userid = toID(this.targetUsername);
		}

		let proof = '';
		let userReason = target;
		let targetLowercase = target.toLowerCase();
		if (target && (targetLowercase.includes('spoiler:') || targetLowercase.includes('spoilers:'))) {
			let proofIndex = (targetLowercase.includes('spoilers:') ? targetLowercase.indexOf('spoilers:') : targetLowercase.indexOf('spoiler:'));
			let bump = (targetLowercase.includes('spoilers:') ? 9 : 8);
			proof = `(PROOF: ${target.substr(proofIndex + bump, target.length).trim()}) `;
			userReason = target.substr(0, proofIndex).trim();
		}


		// Use default time for locks.
		let duration = week ? Date.now() + 7 * 24 * 60 * 60 * 1000 : null;
		let affected = [];

		if (targetUser) {
			const ignoreAlts = Punishments.sharedIps.has(targetUser.latestIP);
			affected = Punishments.lock(targetUser, duration, targetUser.locked, ignoreAlts, userReason);
		} else {
			affected = Punishments.lock(null, duration, userid, false, userReason);
		}

		const globalReason = (target ? `: ${userReason} ${proof}` : '');
		this.globalModlog((week ? "WEEKLOCK" : "LOCK"), targetUser || userid, ` by ${user.id}${globalReason}`);

		let weekMsg = week ? ' for a week' : '';
		let lockMessage = `${name} was locked from talking${weekMsg} by ${user.name}.` + (userReason ? ` (${userReason})` : "");
		this.addModAction(lockMessage);
		// Notify staff room when a user is locked outside of it.
		if (room.roomid !== 'staff' && Rooms.get('staff')) {
			Rooms.get('staff').addByUser(user, `<<${room.roomid}>> ${lockMessage}`);
		}

		room.hideText([userid, toID(this.inputUsername)]);
		let acAccount = (targetUser && targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
		let displayMessage = '';
		if (affected.length > 1) {
			displayMessage = `(${name}'s ${(acAccount ? ` ac account: ${acAccount}, ` : "")} locked alts: ${affected.slice(1).map(user => user.getLastName()).join(", ")})`;
			this.privateModAction(displayMessage);
		} else if (acAccount) {
			displayMessage = `(${name}'s ac account: ${acAccount})`;
			this.privateModAction(displayMessage);
		}

		if (targetUser) {
			let message = `|popup||html|${user.name} has locked you from talking in chats, battles, and PMing regular users${weekMsg}`;
			if (userReason) message += `\n\nReason: ${userReason}`;

			let appeal = '';
			if (Chat.pages.help) {
				appeal += `<a href="view-help-request--appeal"><button class="button"><strong>Appeal your punishment</strong></button></a>`;
			} else if (Config.appealurl) {
				appeal += `appeal: <a href="${Config.appealurl}">${Config.appealurl}</a>`;
			}

			if (appeal) message += `\n\nIf you feel that your lock was unjustified, you can ${appeal}.`;
			message += `\n\nYour lock will expire in a few days.`;
			targetUser.send(message);

			const roomauth = Rooms.global.destroyPersonalRooms(userid);
			if (roomauth.length) Monitor.log(`[CrisisMonitor] Locked user ${name} has public roomauth (${roomauth.join(', ')}), and should probably be demoted.`);
		}

		// Automatically upload replays as evidence/reference to the punishment
		if (room.battle) this.parse('/savereplay forpunishment');
		return true;
	},
	lockhelp: [
		`/lock OR /l [username], [reason] - Locks the user from talking in all chats. Requires: % @ & ~`,
		`/weeklock OR /wl [username], [reason] - Same as /lock, but locks users for a week.`,
		`/lock OR /l [username], [reason] spoiler: [proof] - Marks proof in modlog only.`,
	],

	unlock(target, room, user) {
		if (!target) return this.parse('/help unlock');
		if (!this.can('lock')) return false;

		let targetUser = Users.get(target);
		if (targetUser && targetUser.namelocked) {
			return this.errorReply(`User ${targetUser.name} is namelocked, not locked. Use /unnamelock to unnamelock them.`);
		}
		let reason = '';
		if (targetUser && targetUser.locked && targetUser.locked.charAt(0) === '#') {
			reason = ` (${targetUser.locked})`;
		}

		let unlocked = Punishments.unlock(target);

		if (unlocked) {
			const unlockMessage = `${unlocked.join(", ")} ${((unlocked.length > 1) ? "were" : "was")} unlocked by ${user.name}.${reason}`;
			this.addModAction(unlockMessage);
			// Notify staff room when a user is unlocked outside of it.
			if (!reason && room.roomid !== 'staff' && Rooms.get('staff')) {
				Rooms.get('staff').addByUser(user, `<<${room.roomid}>> ${unlockMessage}`);
			}
			if (!reason) this.globalModlog("UNLOCK", toID(target), ` by ${user.id}`);
			if (targetUser) targetUser.popup(`${user.name} has unlocked you.`);
		} else {
			this.errorReply(`User '${target}' is not locked.`);
		}
	},
	unlockname(target, room, user) {
		if (!target) return this.parse('/help unlock');
		if (!this.can('lock')) return false;

		const userid = toID(target);
		const punishment = Punishments.userids.get(userid);
		if (!punishment) return this.errorReply("This name isn't locked.");
		if (punishment[1] === userid) return this.errorReply(`"${userid}" was specifically locked by a staff member (check the global modlog). Use /unlock if you really want to unlock this name.`);

		Punishments.userids.delete(userid);
		Punishments.savePunishments();

		for (const curUser of Users.findUsers([userid], [])) {
			if (curUser.locked && !curUser.locked.startsWith('#') && !Punishments.getPunishType(curUser.id)) {
				curUser.locked = false;
				curUser.namelocked = false;
				curUser.updateIdentity();
			}
		}
		this.globalModlog("UNLOCKNAME", userid, ` by ${user.name}`);

		const unlockMessage = `The name '${target}' was unlocked by ${user.name}.`;

		this.addModAction(unlockMessage);
		if (room.roomid !== 'staff' && Rooms.get('staff')) {
			Rooms.get('staff').addByUser(user, `<<${room.roomid}>> ${unlockMessage}`);
		}
	},
	unlockip(target, room, user) {
		target = target.trim();
		if (!target) return this.parse('/help unlock');
		if (!this.can('ban')) return false;
		const range = target.charAt(target.length - 1) === '*';
		if (range && !this.can('rangeban')) return false;

		if (!/^[0-9.*]+$/.test(target)) return this.errorReply("Please enter a valid IP address.");

		const punishment = Punishments.ips.get(target);
		if (!punishment) return this.errorReply(`${target} is not a locked/banned IP or IP range.`);

		Punishments.ips.delete(target);
		Punishments.savePunishments();

		for (const curUser of Users.findUsers([], [target])) {
			if (curUser.locked && !curUser.locked.startsWith('#') && !Punishments.getPunishType(curUser.id)) {
				curUser.locked = false;
				curUser.namelocked = false;
				curUser.updateIdentity();
			}
		}
		this.globalModlog(`UNLOCK${range ? 'RANGE' : 'IP'}`, target, ` by ${user.name}`);

		const broadcastRoom = Rooms.get('staff') || room;
		broadcastRoom.addByUser(user, `${user.name} unlocked the ${range ? "IP range" : "IP"}: ${target}`);
	},
	unlockiphelp: [`/unlockip [ip] - Unlocks a punished ip while leaving the original punishment intact. Requires: @ & ~`],
	unlocknamehelp: [`/unlockname [username] - Unlocks a punished alt while leaving the original punishment intact. Requires: % @ & ~`],
	unlockhelp: [
		`/unlock [username] - Unlocks the user. Requires: % @ & ~`,
		`/unlockname [username] - Unlocks a punished alt while leaving the original punishment intact. Requires: % @ & ~`,
		`/unlockip [ip] - Unlocks a punished ip while leaving the original punishment intact. Requires: @ & ~`,
	],

	forceglobalban: 'globalban',
	gban: 'globalban',
	globalban(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help globalban');

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply(`User '${this.targetUsername}' not found.`);
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		if (!target && REQUIRE_REASONS) {
			return this.errorReply("Global bans require a reason.");
		}
		if (!this.can('ban', targetUser)) return false;
		let name = targetUser.getLastName();
		let userid = targetUser.getLastId();

		if (targetUser.trusted) {
			if (cmd === 'forceglobalban') {
				let from = targetUser.distrust();
				Monitor.log(`[CrisisMonitor] ${name} was globally banned by ${user.name} and demoted from ${from.join(", ")}.`);
				this.globalModlog("CRISISDEMOTE", targetUser, ` from ${from.join(", ")}`);
			} else {
				return this.sendReply(`${name} is a trusted user. If you are sure you would like to ban them use /forceglobalban.`);
			}
		} else if (cmd === 'forceglobalban') {
			return this.errorReply(`Use /globalban; ${name} is not a trusted user.`);
		}

		const roomauth = Rooms.global.destroyPersonalRooms(userid);
		if (roomauth.length) Monitor.log(`[CrisisMonitor] Globally banned user ${name} has public roomauth (${roomauth.join(', ')}), and should probably be demoted.`);

		let proof = '';
		let userReason = target;
		let targetLowercase = target.toLowerCase();
		if (target && (targetLowercase.includes('spoiler:') || targetLowercase.includes('spoilers:'))) {
			let proofIndex = (targetLowercase.includes('spoilers:') ? targetLowercase.indexOf('spoilers:') : targetLowercase.indexOf('spoiler:'));
			let bump = (targetLowercase.includes('spoilers:') ? 9 : 8);
			proof = `(PROOF: ${target.substr(proofIndex + bump, target.length).trim()}) `;
			userReason = target.substr(0, proofIndex).trim();
		}

		targetUser.popup(`|modal|${user.name} has globally banned you.${(userReason ? `\n\nReason: ${userReason}` : ``)} ${(Config.appealurl ? `\n\nIf you feel that your ban was unjustified, you can appeal:\n${Config.appealurl}` : ``)}\n\nYour ban will expire in a few days.`);

		let banMessage = `${name} was globally banned by ${user.name}.${(userReason ? ` (${userReason})` : ``)}`;
		this.addModAction(banMessage);

		// Notify staff room when a user is banned outside of it.
		if (room.roomid !== 'staff' && Rooms.get('staff')) {
			Rooms.get('staff').addByUser(user, `<<${room.roomid}>> ${banMessage}`);
		}

		let affected = Punishments.ban(targetUser, null, null, false, userReason);
		let acAccount = (targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
		let displayMessage = '';
		if (affected.length > 1) {
			let guests = affected.length - 1;
			affected = affected.slice(1).map(user => user.getLastName()).filter(alt => alt.substr(0, 7) !== '[Guest ');
			guests -= affected.length;
			displayMessage = `(${name}'s ${(acAccount ? `ac account: ${acAccount}, ` : ``)} banned alts: ${affected.join(", ")} ${(guests ? ` [${guests} guests]` : ``)})`;
			this.privateModAction(displayMessage);
			for (const user of affected) {
				this.add(`|unlink|${toID(user)}`);
			}
		} else if (acAccount) {
			displayMessage = `(${name}'s ac account: ${acAccount})`;
			this.privateModAction(displayMessage);
		}

		room.hideText([userid, toID(this.inputUsername)]);

		const globalReason = (target ? `: ${userReason} ${proof}` : '');
		this.globalModlog("BAN", targetUser, ` by ${user.id}${globalReason}`);
		return true;
	},
	globalbanhelp: [
		`/globalban OR /gban [username], [reason] - Kick user from all rooms and ban user's IP address with reason. Requires: @ & ~`,
		`/globalban OR /gban [username], [reason] spoiler: [proof] - Marks proof in modlog only.`,
	],

	globalunban: 'unglobalban',
	unglobalban(target, room, user) {
		if (!target) return this.parse(`/help unglobalban`);
		if (!this.can('ban')) return false;

		let name = Punishments.unban(target);

		let unbanMessage = `${name} was globally unbanned by ${user.name}.`;

		if (name) {
			this.addModAction(unbanMessage);
			// Notify staff room when a user is unbanned outside of it.
			if (room.roomid !== 'staff' && Rooms.get('staff')) {
				Rooms.get('staff').addByUser(user, `<<${room.roomid}>> ${unbanMessage}`);
			}
			this.globalModlog("UNBAN", name, ` by ${user.id}`);
		} else {
			this.errorReply(`User '${target}' is not globally banned.`);
		}
	},
	unglobalbanhelp: [`/unglobalban [username] - Unban a user. Requires: @ & ~`],

	unbanall(target, room, user) {
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
		user.lastCommand = '';
		Punishments.userids.clear();
		Punishments.ips.clear();
		Punishments.savePunishments();
		this.addModAction(`All bans and locks have been lifted by ${user.name}.`);
		this.modlog('UNBANALL');
	},
	unbanallhelp: [`/unbanall - Unban all IP addresses. Requires: & ~`],

	deroomvoiceall(target, room, user) {
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
		user.lastCommand = '';
		let count = 0;
		for (let userid in room.auth) {
			if (room.auth[userid] === '+') {
				delete room.auth[userid];
				if (userid in room.users) room.users[userid].updateIdentity(room.roomid);
				count++;
			}
		}
		if (!count) {
			return this.sendReply("(This room has zero roomvoices)");
		}
		if (room.chatRoomData) {
			Rooms.global.writeChatRoomData();
		}
		this.addModAction(`All ${count} roomvoices have been cleared by ${user.name}.`);
		this.modlog('DEROOMVOICEALL');
	},
	deroomvoiceallhelp: [`/deroomvoiceall - Devoice all roomvoiced users. Requires: # & ~`],

	rangeban: 'banip',
	banip(target, room, user) {
		const [ip, reason] = this.splitOne(target);
		if (!ip || !/^[0-9.]+(?:\.\*)?$/.test(ip)) return this.parse('/help banip');
		if (!reason) return this.errorReply("/banip requires a ban reason");

		if (!this.can('rangeban')) return false;
		const ipDesc = `IP ${(ip.endsWith('*') ? `range ` : ``)}${ip}`;

		const curPunishment = Punishments.ipSearch(ip);
		if (curPunishment && curPunishment[0] === 'BAN') {
			return this.errorReply(`The ${ipDesc} is already temporarily banned.`);
		}
		Punishments.banRange(ip, reason);
		this.addModAction(`${user.name} hour-banned the ${ipDesc}: ${reason}`);
		this.modlog('RANGEBAN', null, reason);
	},
	baniphelp: [`/banip [ip] - Globally bans this IP or IP range for an hour. Accepts wildcards to ban ranges. Existing users on the IP will not be banned. Requires: & ~`],

	unrangeban: 'unbanip',
	unbanip(target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help unbanip');
		}
		if (!this.can('rangeban')) return false;
		if (!Punishments.ips.has(target)) {
			return this.errorReply(`${target} is not a locked/banned IP or IP range.`);
		}
		Punishments.ips.delete(target);
		this.addModAction(`${user.name} unbanned the ${(target.charAt(target.length - 1) === '*' ? "IP range" : "IP")}: ${target}`);
		this.modlog('UNRANGEBAN', null, target);
	},
	unbaniphelp: [`/unbanip [ip] - Unbans. Accepts wildcards to ban ranges. Requires: & ~`],

	rangelock: 'lockip',
	lockip(target, room, user) {
		const [ip, reason] = this.splitOne(target);
		if (!ip || !/^[0-9.]+(?:\.\*)?$/.test(ip)) return this.parse('/help lockip');
		if (!reason) return this.errorReply("/lockip requires a lock reason");

		if (!this.can('rangeban')) return false;
		const ipDesc = `IP ${(ip.endsWith('*') ? `range ` : ``)}${ip}`;

		const curPunishment = Punishments.ipSearch(ip);
		if (curPunishment && (curPunishment[0] === 'BAN' || curPunishment[0] === 'LOCK')) {
			const punishDesc = curPunishment[0] === 'BAN' ? `temporarily banned` : `temporarily locked`;
			return this.errorReply(`The ${ipDesc} is already ${punishDesc}.`);
		}

		Punishments.lockRange(ip, reason);
		this.addModAction(`${user.name} hour-locked the ${ipDesc}: ${reason}`);
		this.modlog('RANGELOCK', null, reason);
	},
	lockiphelp: [`/lockip [ip] - Globally locks this IP or IP range for an hour. Accepts wildcards to ban ranges. Existing users on the IP will not be banned. Requires: & ~`],

	unrangelock: 'unlockip',
	rangeunlock: 'unlockip',

	/*********************************************************
	 * Moderating: Other
	 *********************************************************/

	mn: 'modnote',
	modnote(target, room, user, connection) {
		if (!target) return this.parse('/help modnote');
		if (!this.canTalk()) return;

		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The note is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		if (!this.can('receiveauthmessages', null, room)) return false;
		target = target.replace(/\n/g, "; ");
		if (room.roomid === 'staff' || room.roomid === 'upperstaff') {
			this.globalModlog('NOTE', null, ` by ${user.id}: ${target}`);
		} else {
			this.modlog('NOTE', null, target);
		}

		return this.privateModAction(`(${user.name} notes: ${target})`);
	},
	modnotehelp: [`/modnote [note] - Adds a moderator note that can be read through modlog. Requires: % @ # & ~`],

	globalpromote: 'promote',
	promote(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help promote');

		target = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		let userid = toID(this.targetUsername);
		let name = targetUser ? targetUser.name : this.targetUsername;

		if (!userid) return this.parse('/help promote');

		let currentGroup = ((targetUser && targetUser.group) || Users.usergroups[userid] || ' ')[0];
		let nextGroup = target;
		if (target === 'deauth') nextGroup = Config.groupsranking[0];
		if (!nextGroup) {
			return this.errorReply("Please specify a group such as /globalvoice or /globaldeauth");
		}
		if (!Config.groups[nextGroup]) {
			return this.errorReply(`Group '${nextGroup}' does not exist.`);
		}
		if (!cmd.startsWith('global')) {
			let groupid = Config.groups[nextGroup].id;
			if (!groupid && nextGroup === Config.groupsranking[0]) groupid = 'deauth';
			if (Config.groups[nextGroup].globalonly) return this.errorReply(`Did you mean "/global${groupid}"?`);
			if (Config.groups[nextGroup].roomonly) return this.errorReply(`Did you mean "/room${groupid}"?`);
			return this.errorReply(`Did you mean "/room${groupid}" or "/global${groupid}"?`);
		}
		if (Config.groups[nextGroup].roomonly || Config.groups[nextGroup].battleonly) {
			return this.errorReply(`Group '${nextGroup}' does not exist as a global rank.`);
		}

		let groupName = Config.groups[nextGroup].name || "regular user";
		if (currentGroup === nextGroup) {
			return this.errorReply(`User '${name}' is already a ${groupName}`);
		}
		if (!user.canPromote(currentGroup, nextGroup)) {
			return this.errorReply(`/${cmd} - Access denied.`);
		}

		if (!Users.isUsernameKnown(userid)) {
			return this.errorReply(`/globalpromote - WARNING: '${name}' is offline and unrecognized. The username might be misspelled (either by you or the person who told you) or unregistered. Use /forcepromote if you're sure you want to risk it.`);
		}
		if (targetUser && !targetUser.registered) {
			return this.errorReply(`User '${name}' is unregistered, and so can't be promoted.`);
		}
		Users.setOfflineGroup(name, nextGroup);
		if (Config.groups[nextGroup].rank < Config.groups[currentGroup].rank) {
			this.privateModAction(`(${name} was demoted to ${groupName} by ${user.name}.)`);
			this.modlog(`GLOBAL ${groupName.toUpperCase()}`, userid, '(demote)');
			if (targetUser) targetUser.popup(`You were demoted to ${groupName} by ${user.name}.`);
		} else {
			this.addModAction(`${name} was promoted to ${groupName} by ${user.name}.`);
			this.modlog(`GLOBAL ${groupName.toUpperCase()}`, userid);
			if (targetUser) targetUser.popup(`You were promoted to ${groupName} by ${user.name}.`);
		}

		if (targetUser) targetUser.updateIdentity();
	},
	promotehelp: [`/promote [username], [group] - Promotes the user to the specified group. Requires: & ~`],

	untrustuser: 'trustuser',
	unconfirmuser: 'trustuser',
	confirmuser: 'trustuser',
	forceconfirmuser: 'trustuser',
	forcetrustuser: 'trustuser',
	trustuser(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help trustuser');
		if (!this.can('promote')) return;

		const force = cmd.includes('force');
		const untrust = cmd.includes('un');
		target = this.splitTarget(target, true);
		if (target) return this.errorReply(`This command does not support specifying a reason.`);
		let targetUser = this.targetUser;
		let userid = toID(this.targetUsername);
		let name = targetUser ? targetUser.name : this.targetUsername;

		let currentGroup = Users.usergroups[userid];
		currentGroup = currentGroup ? currentGroup.charAt(0) : '';

		if (untrust) {
			if (currentGroup !== Config.groupsranking[0]) return this.errorReply(`User '${name}' is not trusted.`);

			Users.setOfflineGroup(userid, Config.groupsranking[0]);
			this.sendReply(`User '${name}' is no longer trusted.`);
			this.privateModAction(`${name} was set to no longer be a trusted user by ${user.name}.`);
			this.modlog('UNTRUSTUSER', userid);
		} else {
			if (!targetUser && !force) return this.errorReply(`User '${name}' is offline. Use /force${cmd} if you're sure.`);
			if (currentGroup) {
				if (currentGroup === Config.groupsranking[0]) return this.errorReply(`User '${name}' is already trusted.`);
				return this.errorReply(`User '${name}' has a global rank higher than trusted.`);
			}

			Users.setOfflineGroup(userid, Config.groupsranking[0], true);
			this.sendReply(`User '${name}' is now trusted.`);
			this.privateModAction(`${name} was set as a trusted user by ${user.name}.`);
			this.modlog('TRUSTUSER', userid);
		}
	},
	trustuserhelp: [
		`/trustuser [username] - Trusts the user (makes them immune to locks). Requires: & ~`,
		`/untrustuser [username] - Removes the trusted user status from the user. Requires: & ~`,
	],

	globaldemote: 'demote',
	demote(target) {
		if (!target) return this.parse('/help demote');
		this.run('promote');
	},
	demotehelp: [`/demote [username], [group] - Demotes the user to the specified group. Requires: & ~`],

	forcepromote(target, room, user, connection) {
		// warning: never document this command in /help
		if (!this.can('forcepromote')) return false;
		target = this.splitTarget(target, true);
		let name = this.filter(this.targetUsername);
		if (!name) return;
		name = name.slice(0, 18);
		let nextGroup = target;
		if (!Config.groups[nextGroup]) return this.errorReply(`Group '${nextGroup}' does not exist.`);
		if (Config.groups[nextGroup].roomonly || Config.groups[nextGroup].battleonly) return this.errorReply(`Group '${nextGroup}' does not exist as a global rank.`);

		if (Users.isUsernameKnown(name)) {
			return this.errorReply("/forcepromote - Don't forcepromote unless you have to.");
		}
		Users.setOfflineGroup(name, nextGroup);

		this.addModAction(`${name} was promoted to ${(Config.groups[nextGroup].name || "regular user")} by ${user.name}.`);
		this.modlog(`GLOBAL${(Config.groups[nextGroup].name || "regular").toUpperCase()}`, toID(name));
	},

	devoice: 'deauth',
	deauth(target, room, user) {
		return this.parse(`/demote ${target}, deauth`);
	},

	deglobalvoice: 'globaldeauth',
	deglobalauth: 'globaldeauth',
	globaldevoice: 'globaldeauth',
	globaldeauth(target, room, user) {
		return this.parse(`/globaldemote ${target}, deauth`);
	},

	deroomvoice: 'roomdeauth',
	roomdevoice: 'roomdeauth',
	deroomauth: 'roomdeauth',
	roomdeauth(target, room, user) {
		return this.parse(`/roomdemote ${target}, deauth`);
	},

	declare(target, room, user) {
		target = target.trim();
		if (!target) return this.parse('/help declare');
		if (!this.can('declare', null, room)) return false;
		if (!this.canTalk()) return;
		if (target.length > 2000) return this.errorReply("Declares should not exceed 2000 characters.");

		for (let u in room.users) {
			if (Users.get(u).connected) Users.get(u).sendTo(room, `|notify|${room.title} announcement!|${target}`);
		}
		this.add(Chat.html`|raw|<div class="broadcast-blue"><b>${target}</b></div>`);
		this.modlog('DECLARE', null, target);
	},
	declarehelp: [`/declare [message] - Anonymously announces a message. Requires: # * & ~`],

	htmldeclare(target, room, user) {
		if (!target) return this.parse('/help htmldeclare');
		if (!this.can('gdeclare', null, room)) return false;
		if (!this.canTalk()) return;
		target = this.canHTML(target);
		if (!target) return;

		for (let u in room.users) {
			if (Users.get(u).connected) Users.get(u).sendTo(room, `|notify|${room.title} announcement!|${Chat.stripHTML(target)}`);
		}
		this.add(`|raw|<div class="broadcast-blue"><b>${target}</b></div>`);
		this.modlog(`HTMLDECLARE`, null, target);
	},
	htmldeclarehelp: [`/htmldeclare [message] - Anonymously announces a message using safe HTML. Requires: ~`],

	gdeclare: 'globaldeclare',
	globaldeclare(target, room, user) {
		if (!target) return this.parse('/help globaldeclare');
		if (!this.can('gdeclare')) return false;
		target = this.canHTML(target);
		if (!target) return;

		for (const u of Users.users.values()) {
			if (u.connected) u.send(`|pm|~|${u.group}${u.name}|/raw <div class="broadcast-blue"><b>${target}</b></div>`);
		}
		this.modlog(`GLOBALDECLARE`, null, target);
	},
	globaldeclarehelp: [`/globaldeclare [message] - Anonymously announces a message to every room on the server. Requires: ~`],

	cdeclare: 'chatdeclare',
	chatdeclare(target, room, user) {
		if (!target) return this.parse('/help chatdeclare');
		if (!this.can('gdeclare')) return false;
		target = this.canHTML(target);
		if (!target) return;

		for (const curRoom of Rooms.rooms.values()) {
			if (curRoom.roomid !== 'global' && curRoom.type !== 'battle') {
				curRoom.addRaw(`<div class="broadcast-blue"><b>${target}</b></div>`).update();
			}
		}
		this.modlog(`CHATDECLARE`, null, target);
	},
	chatdeclarehelp: [`/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~`],

	'!announce': true,
	wall: 'announce',
	announce(target, room, user) {
		if (!target) return this.parse('/help announce');

		if (room && !this.can('announce', null, room)) return false;

		target = this.canTalk(target);
		if (!target) return;

		return `/announce ${target}`;
	},
	announcehelp: [`/announce OR /wall [message] - Makes an announcement. Requires: % @ # & ~`],

	notifyoffrank: 'notifyrank',
	notifyrank(target, room, user, connection, cmd) {
		if (!target) return this.parse(`/help notifyrank`);
		if (!this.can('addhtml', null, room)) return false;
		if (!this.canTalk()) return;
		let [rank, titleNotification] = this.splitOne(target);
		if (rank === 'all') rank = ` `;
		if (!(rank in Config.groups)) return this.errorReply(`Group '${rank}' does not exist.`);
		const id = `${room.roomid}-rank-${(Config.groups[rank].id || `all`)}`;
		if (cmd === 'notifyoffrank') {
			if (rank === ' ') {
				room.send(`|tempnotifyoff|${id}`);
			} else {
				room.sendRankedUsers(`|tempnotifyoff|${id}`, rank);
			}
		} else {
			let [title, notificationHighlight] = this.splitOne(titleNotification);
			if (!title) title = `${room.title} ${(Config.groups[rank].name ? `${Config.groups[rank].name}+ ` : ``)}message!`;
			if (!user.can('addhtml')) {
				title += ` (notification from ${user.name})`;
			}
			const [notification, highlight] = this.splitOne(notificationHighlight);
			if (notification.length > 300) return this.errorReply(`Notifications should not exceed 300 characters.`);
			const message = `|tempnotify|${id}|${title}|${notification}${(highlight ? `|${highlight}` : ``)}`;
			if (rank === ' ') {
				room.send(message);
			} else {
				room.sendRankedUsers(message, rank);
			}
			this.modlog(`NOTIFYRANK`, null, target);
		}
	},
	notifyrankhelp: [
		`/notifyrank [rank], [title], [message], [highlight] - Sends a notification to users who are [rank] or higher (and highlight on [highlight], if specified). Requires: # * & ~`,
		`/notifyoffrank [rank] - Closes the notification previously sent with /notifyrank [rank]. Requires: # * & ~`,
	],

	fr: 'forcerename',
	forcerename(target, room, user) {
		if (!target) return this.parse('/help forcerename');

		let reason = this.splitTarget(target, true);
		let targetUser = this.targetUser;
		if (!targetUser) {
			this.splitTarget(target);
			if (this.targetUser) {
				return this.errorReply(`User has already changed their name to '${this.targetUser.name}'.`);
			}
			return this.errorReply(`User '${target}' not found.`);
		}
		if (!this.can('forcerename', targetUser)) return false;

		let forceRenameMessage;
		if (targetUser.connected) {
			forceRenameMessage = `was forced to choose a new name by ${user.name}${(reason ? `: ${reason}` : ``)}`;
			this.globalModlog('FORCERENAME', targetUser, ` by ${user.name}${(reason ? `: ${reason}` : ``)}`);
			Chat.forceRenames.set(targetUser.id, (Chat.forceRenames.get(targetUser.id) || 0) + 1);
			Ladders.cancelSearches(targetUser);
			targetUser.send(`|nametaken||${user.name} considers your name inappropriate${(reason ? `: ${reason}` : ".")}`);
		} else {
			forceRenameMessage = `would be forced to choose a new name by ${user.name} but is offline${(reason ? `: ${reason}` : ``)}`;
			this.globalModlog('FORCERENAME OFFLINE', targetUser, ` by ${user.name}${(reason ? `: ${reason}` : ``)}`);
			if (!Chat.forceRenames.has(targetUser.id)) Chat.forceRenames.set(targetUser.id, 0);
		}

		if (room.roomid !== 'staff') this.privateModAction(`(${targetUser.name} ${forceRenameMessage})`);
		const roomMessage = room.roomid !== 'staff' ? `«<a href="/${room.roomid}" target="_blank">${room.roomid}</a>» ` : '';
		const rankMessage = targetUser.getAccountStatusString();
		Rooms.global.notifyRooms(['staff'], `|html|${roomMessage}` + Chat.html`<span class="username">${targetUser.name}</span> ${rankMessage} ${forceRenameMessage}`);

		targetUser.resetName(true);
		return true;
	},
	forcerenamehelp: [
		`/forcerename OR /fr [username], [reason] - Forcibly change a user's name and shows them the [reason]. Requires: % @ & ~`,
		`/allowname [username] - Unmarks a forcerenamed username, stopping staff from being notified when it is used. Requires % @ & ~`,
	],

	nl: 'namelock',
	forcenamelock: 'namelock',
	namelock(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help namelock');

		let reason = this.splitTarget(target);
		let targetUser = this.targetUser;

		if (!targetUser) {
			return this.errorReply(`User '${this.targetUsername}' not found.`);
		}
		if (targetUser.id !== toID(this.inputUsername) && cmd !== 'forcenamelock') {
			return this.errorReply(`${this.inputUsername} has already changed their name to ${targetUser.name}. To namelock anyway, use /forcenamelock.`);
		}
		if (!this.can('forcerename', targetUser)) return false;
		if (targetUser.namelocked) return this.errorReply(`User '${targetUser.name}' is already namelocked.`);

		const reasonText = reason ? ` (${reason})` : `.`;
		const lockMessage = `${targetUser.name} was namelocked by ${user.name}${reasonText}`;
		this.privateModAction(`(${lockMessage})`);

		// Notify staff room when a user is locked outside of it.
		if (room.roomid !== 'staff' && Rooms.get('staff')) {
			Rooms.get('staff').addByUser(user, `<<${room.roomid}>> ${lockMessage}`);
		}

		const roomauth = Rooms.global.destroyPersonalRooms(targetUser.id);
		if (roomauth.length) Monitor.log(`[CrisisMonitor] Namelocked user ${targetUser.name} has public roomauth (${roomauth.join(', ')}), and should probably be demoted.`);

		this.globalModlog("NAMELOCK", targetUser, ` by ${user.id}${reasonText}`);
		Ladders.cancelSearches(targetUser);
		Punishments.namelock(targetUser, null, null, false, reason);
		targetUser.popup(`|modal|${user.name} has locked your name and you can't change names anymore${reasonText}`);
		// Automatically upload replays as evidence/reference to the punishment
		if (room.battle) this.parse('/savereplay forpunishment');

		return true;
	},
	namelockhelp: [`/namelock OR /nl [username], [reason] - Name locks a user and shows them the [reason]. Requires: % @ & ~`],

	unl: 'unnamelock',
	unnamelock(target, room, user) {
		if (!target) return this.parse('/help unnamelock');
		if (!this.can('forcerename')) return false;

		let targetUser = Users.get(target);
		let reason = '';
		if (targetUser && targetUser.namelocked) {
			reason = ` (${targetUser.namelocked})`;
		}

		let unlocked = Punishments.unnamelock(target);

		if (unlocked) {
			this.addModAction(`${unlocked} was unnamelocked by ${user.name}.${reason}`);
			if (!reason) this.globalModlog("UNNAMELOCK", toID(target), ` by ${user.id}`);
			if (targetUser) targetUser.popup(`${user.name} has unnamelocked you.`);
		} else {
			this.errorReply(`User '${target}' is not namelocked.`);
		}
	},
	unnamelockhelp: [`/unnamelock [username] - Unnamelocks the user. Requires: % @ & ~`],

	hidetextalts: 'hidetext',
	hidealttext: 'hidetext',
	hidealtstext: 'hidetext',
	htext: 'hidetext',
	forcehidetext: 'hidetext',
	forcehtext: 'hidetext',
	hidetext(target, room, user, connection, cmd) {
		if (!target) return this.parse(`/help hidetext`);

		this.splitTarget(target);
		let targetUser = this.targetUser;
		let name = this.targetUsername;
		if (!targetUser && !room.log.hasUsername(target)) return this.errorReply(`User ${target} not found or has no roomlogs.`);
		let userid = toID(this.inputUsername);

		if (!this.can('mute', null, room)) return;
		if (targetUser && targetUser.trusted && targetUser !== user && !cmd.includes('force')) {
			return this.errorReply(`${target} is a trusted user, are you sure you want to hide their messages? Use /forcehidetext if you're sure.`);
		}

		if (targetUser && cmd.includes('alt')) {
			room.send(`|c|~|${name}'s alts messages were cleared from ${room.title} by ${user.name}.`);
			this.modlog('HIDEALTSTEXT', targetUser, null, {noip: 1});
			room.hideText([
				userid,
				...Object.keys(targetUser.prevNames),
				...targetUser.getAltUsers(true).map(user => user.getLastId()),
			]);
		} else {
			room.send(`|c|~|${name}'s messages were cleared from ${room.title} by ${user.name}.`);
			this.modlog('HIDETEXT', targetUser || userid, null, {noip: 1, noalts: 1});
			room.hideText([userid]);
		}
	},
	hidetexthelp: [
		`/hidetext [username] - Removes a user's messages from chat. Requires: % @ # & ~`,
		`/hidealtstext [username] - Removes a user's messages, and their alternate account's messages from the chat.  Requires: % @ # & ~`,
	],

	ab: 'blacklist',
	blacklist(target, room, user) {
		if (!target) return this.parse('/help blacklist');
		if (!this.canTalk()) return;
		if (toID(target) === 'show') return this.errorReply(`You're looking for /showbl`);

		target = this.splitTarget(target);
		const targetUser = this.targetUser;
		if (!targetUser) {
			this.errorReply(`User ${this.targetUsername} not found.`);
			return this.errorReply(`If you want to blacklist an offline account by name (not IP), consider /blacklistname`);
		}
		if (!this.can('editroom', targetUser, room)) return false;
		if (!room.chatRoomData) {
			return this.errorReply(`This room is not going to last long enough for a blacklist to matter - just ban the user`);
		}
		let punishment = Punishments.isRoomBanned(targetUser, room.roomid);
		if (punishment && punishment[0] === 'BLACKLIST') {
			return this.errorReply(`This user is already blacklisted from this room.`);
		}

		if (!target && REQUIRE_REASONS) {
			return this.errorReply(`Blacklists require a reason.`);
		}
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		const name = targetUser.getLastName();
		const userid = targetUser.getLastId();

		if (targetUser.trusted && room.isPrivate !== true) {
			Monitor.log(`[CrisisMonitor] Trusted user ${targetUser.name}${(targetUser.trusted !== targetUser.id ? ` (${targetUser.trusted})` : '')} was blacklisted from ${room.roomid} by ${user.name}, and should probably be demoted.`);
		}

		if (targetUser in room.users || user.can('lock')) {
			targetUser.popup(
				`|modal||html|<p>${Chat.escapeHTML(user.name)} has blacklisted you from the room ${room.roomid}${(room.subRooms ? ` and its subrooms` : '')}. Reason: ${Chat.escapeHTML(target)}</p>` +
				`<p>To appeal the ban, PM the staff member that blacklisted you${(!room.battle && room.auth ? ` or a room owner. </p><p><button name="send" value="/roomauth ${room.roomid}">List Room Staff</button></p>` : `.</p>`)}`
			);
		}

		this.privateModAction(`(${name} was blacklisted from ${room.title} by ${user.name}. ${(target ? ` (${target})` : '')})`);

		let affected = Punishments.roomBlacklist(room, targetUser, null, null, target);

		if (!room.isPrivate && room.chatRoomData) {
			let acAccount = (targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
			let displayMessage = '';
			if (affected.length > 1) {
				displayMessage = `(${name}'s ${(acAccount ? ` ac account: ${acAccount},` : '')} blacklisted alts: ${affected.slice(1).map(user => user.getLastName()).join(", ")})`;
				this.privateModAction(displayMessage);
			} else if (acAccount) {
				displayMessage = `(${name}'s ac account: ${acAccount})`;
				this.privateModAction(displayMessage);
			}
		}

		if (!room.isPrivate && room.chatRoomData) {
			this.globalModlog("BLACKLIST", targetUser, ` by ${user.id}${(target ? `: ${target}` : '')}`);
		} else {
			// Room modlog only
			this.modlog("BLACKLIST", targetUser, ` by ${user.id}${(target ? `: ${target}` : '')}`);
		}
		return true;
	},
	blacklisthelp: [
		`/blacklist [username], [reason] - Blacklists the user from the room you are in for a year. Requires: # & ~`,
		`/unblacklist [username] - Unblacklists the user from the room you are in. Requires: # & ~`,
		`/showblacklist OR /showbl - show a list of blacklisted users in the room. Requires: % @ # & ~`,
		`/expiringblacklists OR /expiringbls - show a list of blacklisted users from the room whose blacklists are expiring in 3 months or less. Requires: % @ # & ~`,
	],

	forcebattleban: 'battleban',
	battleban(target, room, user, connection, cmd) {
		if (!target) return this.parse(`/help battleban`);

		const reason = this.splitTarget(target);
		const targetUser = this.targetUser;
		if (!targetUser) return this.errorReply(`User ${this.targetUsername} not found.`);
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		if (!reason) {
			return this.errorReply(`Battle bans require a reason.`);
		}
		const includesUrl = reason.includes(`.${Config.routes.root}/`); // lgtm [js/incomplete-url-substring-sanitization]
		if (!room.battle && !includesUrl && cmd !== 'forcebattleban') {
			 return this.errorReply(`Battle bans require a battle replay if used outside of a battle; if the battle has expired, use /forcebattleban.`);
		}
		if (!this.can('rangeban', targetUser)) {
			this.errorReply(`Battlebans have been deprecated. Alternatives:`);
			this.errorReply(`- timerstalling and bragging about it: lock`);
			this.errorReply(`- other timerstalling: they're not timerstalling, leave them alone`);
			this.errorReply(`- bad nicknames: lock, locks prevent nicknames from appearing; you should always have been locking for this`);
			this.errorReply(`- ladder cheating: gban, get a moderator if necessary`);
			this.errorReply(`- serious ladder cheating: permaban, get a leader`);
			this.errorReply(`- other: get a leader`);
			return;
		}
		if (Punishments.isBattleBanned(targetUser)) return this.errorReply(`User '${targetUser.name}' is already banned from battling.`);

		const reasonText = reason ? ` (${reason})` : `.`;
		const battlebanMessage = `${targetUser.name} was banned from starting new battles by ${user.name}${reasonText}`;
		this.privateModAction(`(${battlebanMessage})`);

		// Notify staff room when a user is banned from battling outside of it.
		if (room.roomid !== 'staff' && Rooms.get('staff')) {
			Rooms.get('staff').addByUser(user, `<<${room.roomid}>> ${battlebanMessage}`);
		}
		if (targetUser.trusted) {
			Monitor.log(`[CrisisMonitor] Trusted user ${targetUser.name} was banned from battling by ${user.name}, and should probably be demoted.`);
		}

		this.globalModlog("BATTLEBAN", targetUser, ` by ${user.id}${reasonText}`);
		Ladders.cancelSearches(targetUser);
		Punishments.battleban(targetUser, null, null, reason);
		targetUser.popup(`|modal|${user.name} has prevented you from starting new battles for 2 days${reasonText}`);

		// Automatically upload replays as evidence/reference to the punishment
		if (room.battle) this.parse('/savereplay forpunishment');
		return true;
	},
	battlebanhelp: [`/battleban [username], [reason] - [DEPRECATED] Prevents the user from starting new battles for 2 days and shows them the [reason]. Requires: & ~`],

	unbattleban(target, room, user) {
		if (!target) return this.parse('/help unbattleban');
		if (!this.can('lock')) return;

		const targetUser = Users.get(target);
		const unbanned = Punishments.unbattleban(target);

		if (unbanned) {
			this.addModAction(`${unbanned} was allowed to battle again by ${user.name}.`);
			this.globalModlog("UNBATTLEBAN", toID(target), ` by ${user.name}`);
			if (targetUser) targetUser.popup(`${user.name} has allowed you to battle again.`);
		} else {
			this.errorReply(`User ${target} is not banned from battling.`);
		}
	},
	unbattlebanhelp: [`/unbattleban [username] - [DEPRECATED] Allows a user to battle again. Requires: % @ & ~`],

	nameblacklist: 'blacklistname',
	blacklistname(target, room, user) {
		if (!target) return this.parse('/help blacklistname');
		if (!this.canTalk()) return;
		if (!this.can('editroom', null, room)) return false;
		if (!room.chatRoomData) {
			return this.errorReply("This room is not going to last long enough for a blacklist to matter - just ban the user");
		}

		let [targetStr, reason] = target.split('|').map(val => val.trim());
		if (!targetStr || (!reason && REQUIRE_REASONS)) {
			return this.errorReply("Usage: /blacklistname name1, name2, ... | reason");
		}

		let targets = targetStr.split(',').map(s => toID(s));

		let duplicates = targets.filter(userid => {
			let punishment = Punishments.roomUserids.nestedGet(room.roomid, userid);
			return punishment && punishment[0] === 'BLACKLIST';
		});
		if (duplicates.length) {
			return this.errorReply(`[${duplicates.join(', ')}] ${Chat.plural(duplicates, "are", "is")} already blacklisted.`);
		}

		const userRank = Config.groupsranking.indexOf(room.getAuth(user));
		for (const userid of targets) {
			if (!userid) return this.errorReply(`User '${userid}' is not a valid userid.`);
			const targetRank = Config.groupsranking.indexOf(room.getAuth({id: userid}));
			if (targetRank >= userRank) return this.errorReply(`/blacklistname - Access denied: ${userid} is of equal or higher authority than you.`);

			Punishments.roomBlacklist(room, null, null, userid, reason);

			const trusted = Users.isTrusted(userid);
			if (trusted && room.isPrivate !== true) {
				Monitor.log(`[CrisisMonitor] Trusted user ${userid}${(trusted !== userid ? ` (${trusted})` : ``)} was nameblacklisted from ${room.roomid} by ${user.name}, and should probably be demoted.`);
			}
			if (!room.isPrivate && room.chatRoomData) {
				this.globalModlog("NAMEBLACKLIST", userid, ` by ${user.id}${(reason ? `: ${reason}` : '')}`);
			}
		}

		this.privateModAction(`(${targets.join(', ')}${Chat.plural(targets, " were", " was")} nameblacklisted from ${room.title} by ${user.name}.)`);
		return true;
	},
	blacklistnamehelp: [`/blacklistname OR /nameblacklist [username1, username2, etc.] | reason - Blacklists the given username(s) from the room you are in for a year. Requires: # & ~`],

	unab: 'unblacklist',
	unblacklist(target, room, user) {
		if (!target) return this.parse('/help unblacklist');
		if (!this.can('editroom', null, room)) return false;

		const name = Punishments.roomUnblacklist(room, target);

		if (name) {
			this.privateModAction(`(${name} was unblacklisted by ${user.name}.)`);
			if (!room.isPrivate && room.chatRoomData) {
				this.globalModlog("UNBLACKLIST", name, ` by ${user.id}`);
			}
		} else {
			this.errorReply(`User '${target}' is not blacklisted.`);
		}
	},
	unblacklisthelp: [`/unblacklist [username] - Unblacklists the user from the room you are in. Requires: # & ~`],

	unblacklistall(target, room, user) {
		if (!this.can('editroom', null, room)) return false;

		if (!target) {
			user.lastCommand = '/unblacklistall';
			this.errorReply("THIS WILL UNBLACKLIST ALL BLACKLISTED USERS IN THIS ROOM.");
			this.errorReply("To confirm, use: /unblacklistall confirm");
			return;
		}
		if (user.lastCommand !== '/unblacklistall' || target !== 'confirm') {
			return this.parse('/help unblacklistall');
		}
		user.lastCommand = '';
		let unblacklisted = Punishments.roomUnblacklistAll(room);
		if (!unblacklisted) return this.errorReply("No users are currently blacklisted in this room to unblacklist.");
		this.addModAction(`All blacklists in this room have been lifted by ${user.name}.`);
		this.modlog('UNBLACKLISTALL');
		this.roomlog(`Unblacklisted users: ${unblacklisted.join(', ')}`);
	},
	unblacklistallhelp: [`/unblacklistall - Unblacklists all blacklisted users in the current room. Requires #, &, ~`],

	expiringbls: 'showblacklist',
	expiringblacklists: 'showblacklist',
	blacklists: 'showblacklist',
	showbl: 'showblacklist',
	showblacklist(target, room, user, connection, cmd) {
		if (target) room = Rooms.search(target);
		if (!room) return this.errorReply(`The room "${target}" was not found.`);
		if (!this.can('mute', null, room)) return false;
		const SOON_EXPIRING_TIME = 3 * 30 * 24 * 60 * 60 * 1000; // 3 months

		if (!room.chatRoomData) return this.errorReply("This room does not support blacklists.");

		const subMap = Punishments.roomUserids.get(room.roomid);
		if (!subMap || subMap.size === 0) {
			return this.sendReply("This room has no blacklisted users.");
		}
		let blMap = new Map();
		let ips = '';

		for (const [userid, punishment] of subMap) {
			const [punishType, id, expireTime] = punishment;
			if (punishType === 'BLACKLIST') {
				if (!blMap.has(id)) blMap.set(id, [expireTime]);
				if (id !== userid) blMap.get(id).push(userid);
			}
		}

		if (user.can('ban')) {
			const subMap = Punishments.roomIps.get(room.roomid);

			if (subMap) {
				ips = '/ips';
				for (const [ip, punishment] of subMap) {
					const [punishType, id] = punishment;
					if (punishType === 'BLACKLIST') {
						if (!blMap.has(id)) blMap.set(id, []);
						blMap.get(id).push(ip);
					}
				}
			}
		}

		let soonExpiring = (cmd === 'expiringblacklists' || cmd === 'expiringbls');
		let buf = Chat.html`Blacklist for ${room.title}${soonExpiring ? ` (expiring within 3 months)` : ''}:<br />`;

		for (const [userid, data] of blMap) {
			const [expireTime, ...alts] = data;
			if (soonExpiring && expireTime > Date.now() + SOON_EXPIRING_TIME) continue;
			const expiresIn = new Date(expireTime).getTime() - Date.now();
			const expiresDays = Math.round(expiresIn / 1000 / 60 / 60 / 24);
			buf += `- <strong>${userid}</strong>, for ${Chat.count(expiresDays, "days")}`;
			if (alts.length) buf += `, alts${ips}: ${alts.join(', ')}`;
			buf += `<br />`;
		}

		this.sendReplyBox(buf);
	},
	showblacklisthelp: [
		`/showblacklist OR /showbl - show a list of blacklisted users in the room. Requires: % @ # & ~`,
		`/expiringblacklists OR /expiringbls - show a list of blacklisted users from the room whose blacklists are expiring in 3 months or less. Requires: % @ # & ~`,
	],

	markshared(target, room, user) {
		if (!target) return this.parse('/help markshared');
		if (!this.can('ban')) return false;
		let [ip, note] = this.splitOne(target);
		if (!/^[0-9.*]+$/.test(ip)) return this.errorReply("Please enter a valid IP address.");

		if (Punishments.sharedIps.has(ip)) return this.errorReply("This IP is already marked as shared.");
		if (!note) {
			this.errorReply(`You must specify who owns this shared IP.`);
			this.parse(`/help markshared`);
			return;
		}

		Punishments.addSharedIp(ip, note);
		note = ` (${note})`;
		this.globalModlog('SHAREDIP', ip, ` by ${user.name}${note}`);

		const message = `The IP '${ip}' was marked as shared by ${user.name}.${note}`;
		const staffRoom = Rooms.get('staff');
		if (staffRoom) return staffRoom.addByUser(user, message);

		return this.addModAction(message);
	},
	marksharedhelp: [`/markshared [IP], [owner/organization of IP] - Marks an IP address as shared. Note: the owner/organization (i.e., University of Minnesota) of the shared IP is required. Requires @, &, ~`],

	unmarkshared(target, room, user) {
		if (!target) return this.parse('/help unmarkshared');
		if (!this.can('ban')) return false;
		if (!/^[0-9.*]+$/.test(target)) return this.errorReply("Please enter a valid IP address.");

		if (!Punishments.sharedIps.has(target)) return this.errorReply("This IP isn't marked as shared.");

		Punishments.removeSharedIp(target);
		this.globalModlog('UNSHAREIP', target, ` by ${user.name}`);
		return this.addModAction(`The IP '${target}' was unmarked as shared by ${user.name}.`);
	},
	unmarksharedhelp: [`/unmarkshared [ip] - Unmarks a shared IP address. Requires @, &, ~`],

};
