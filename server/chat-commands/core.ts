/**
 * Core commands
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * These are core commands - basic commands required for Pokemon Showdown
 * to run. A lot of these are sent by the client.
 *
 * System commands should not be modified, added, or removed. If you'd
 * like to modify or add commands, add or edit files in chat-plugins/
 *
 * For the API, see chat-plugins/COMMANDS.md
 *
 * @license MIT
 */

/* eslint no-else-return: "error" */
import { Utils, ProcessManager } from '../../lib';
import type { UserSettings } from '../users';
import type { GlobalPermission, RoomPermission } from '../user-groups';

export const crqHandlers: { [k: string]: Chat.CRQHandler } = {
	userdetails(target, user, trustable) {
		if (target.length > 18) {
			return null;
		}

		const targetUser = Users.get(target);
		if (!trustable || !targetUser) {
			return {
				id: target,
				userid: toID(target),
				name: target,
				rooms: false,
			};
		}
		interface RoomData { p1?: string; p2?: string; isPrivate?: boolean | 'hidden' | 'voice' }
		let roomList: { [roomid: string]: RoomData } | false = {};
		for (const roomid of targetUser.inRooms) {
			const targetRoom = Rooms.get(roomid);
			if (!targetRoom) continue; // shouldn't happen
			const roomData: RoomData = {};
			if (targetRoom.settings.isPrivate) {
				if (!user.inRooms.has(roomid) && !user.games.has(roomid)) continue;
				roomData.isPrivate = true;
			}
			if (targetRoom.battle) {
				if (targetUser.settings.hideBattlesFromTrainerCard && user.id !== targetUser.id && !user.can('lock')) continue;
				const battle = targetRoom.battle;
				roomData.p1 = battle.p1 ? ' ' + battle.p1.name : '';
				roomData.p2 = battle.p2 ? ' ' + battle.p2.name : '';
			}
			let roomidWithAuth: string = roomid;
			if (targetRoom.auth.has(targetUser.id)) {
				roomidWithAuth = targetRoom.auth.getDirect(targetUser.id) + roomid;
			}
			roomList[roomidWithAuth] = roomData;
		}
		if (!targetUser.connected) roomList = false;
		let group = targetUser.tempGroup;
		if (targetUser.locked) group = Config.punishgroups?.locked?.symbol ?? '\u203d';
		if (targetUser.namelocked) group = Config.punishgroups?.namelocked?.symbol ?? '✖';
		const sectionleader = Users.globalAuth.sectionLeaders.has(targetUser.id);
		return {
			id: target,
			userid: targetUser.id,
			name: targetUser.name,
			avatar: targetUser.avatar,
			group,
			customgroup: sectionleader ? "Section Leader" : undefined,
			autoconfirmed: targetUser.autoconfirmed ? true : undefined,
			status: targetUser.getStatus() || undefined,
			rooms: roomList,
			friended: user.friends?.has(targetUser.id) || undefined,
		};
	},
	roomlist(target, user, trustable) {
		if (!trustable) return false;
		return { rooms: Rooms.global.getBattles(target) };
	},
	rooms(target, user, trustable) {
		if (!trustable) return false;
		return Rooms.global.getRooms(user);
	},
	laddertop(target, user, trustable) {
		if (!trustable) return false;
		const [format, prefix] = target.split(',').map(x => x.trim());
		return Ladders(toID(format)).getTop(prefix);
	},
	roominfo(target, user, trustable) {
		if (!trustable) return false;

		if (target.length > 225) {
			return null;
		}
		const targetRoom = Rooms.get(target);
		if (!targetRoom || (
			targetRoom.settings.isPrivate && !user.inRooms.has(targetRoom.roomid) && !user.games.has(targetRoom.roomid)
		)) {
			const roominfo = { id: target, error: 'not found or access denied' };
			return roominfo;
		}
		let visibility;
		if (targetRoom.settings.isPrivate) {
			visibility = (targetRoom.settings.isPrivate === 'hidden') ? 'hidden' : 'secret';
		} else {
			visibility = 'public';
		}

		const roominfo: AnyObject = {
			id: target,
			roomid: targetRoom.roomid,
			title: targetRoom.title,
			type: targetRoom.type,
			visibility,
			modchat: targetRoom.settings.modchat,
			modjoin: targetRoom.settings.modjoin,
			auth: {},
			users: [],
		};

		for (const [id, rank] of targetRoom.auth) {
			if (!roominfo.auth[rank]) roominfo.auth[rank] = [];
			roominfo.auth[rank].push(id);
		}

		for (const userid in targetRoom.users) {
			const curUser = targetRoom.users[userid];
			if (!curUser.named) continue;
			const userinfo = curUser.getIdentity(targetRoom);
			roominfo.users.push(userinfo);
		}
		return roominfo;
	},
	fullformat(target, user, trustable) {
		if (!trustable) return false;

		if (target.length > 225) {
			return null;
		}
		const targetRoom = Rooms.get(target);
		if (!targetRoom?.battle?.playerTable[user.id]) {
			return null;
		}

		return targetRoom.battle.format;
	},
	cmdsearch(target, user, trustable) {
		// in no world should this be a thing. our longest command name is 37 chars
		if (target.length > 40) return null;
		const cmdPrefix = target.charAt(0);
		if (!['/', '!'].includes(cmdPrefix)) return null;
		target = toID(target.slice(1));

		const results = [];
		for (const command of Chat.allCommands()) {
			if (cmdPrefix === '!' && !command.broadcastable) continue;
			const req = command.requiredPermission as GlobalPermission;
			if (!!req &&
				!(command.hasRoomPermissions ? !!this.room && user.can(req as RoomPermission, null, this.room) : user.can(req))
			) {
				continue;
			}
			const cmds = [
				command.fullCmd,
				...command.aliases.map(x => command.fullCmd.replace(command.cmd, `${x}`)),
			];
			for (const cmd of cmds) {
				if (toID(cmd).startsWith(target)) {
					results.push(cmdPrefix + cmd);
					break;
				}
			}
			// limit number of results to prevent spam
			if (results.length >= 20) break;
		}
		return results;
	},
};

export const commands: Chat.ChatCommands = {
	async version(target, room, user) {
		if (!this.runBroadcast()) return;
		const version = Chat.packageData.version;
		let gitVersion;
		try {
			gitVersion = (await ProcessManager.exec(['git', 'rev-parse', '--short', 'HEAD'])).stdout.trim();
		} catch {}
		this.sendReplyBox(this.tr`Server version: <b>${version}${gitVersion ? ` (commit ${gitVersion})` : ''}</b>`);
	},
	versionhelp: [
		`/version - Get the current server version.`,
	],

	userlist(target, room, user) {
		room = this.requireRoom();
		const userList = [];

		for (const id in room.users) {
			const curUser = Users.get(room.users[id]);
			if (!curUser?.named) continue;
			userList.push(Utils.escapeHTML(curUser.getIdentity(room)));
		}

		let output = `There ${Chat.plural(userList, "are", "is")} <strong style="color:#24678d">${Chat.count(userList, "</strong> users")} in this room:<br />`;
		output += userList.join(`, `);

		this.sendReplyBox(output);
	},
	userlisthelp: [`/userlist - Displays a list of users who are currently in the room.`],

	mee: 'me',
	me(target, room, user) {
		if (this.cmd === 'mee' && /[A-Z-a-z0-9/]/.test(target.charAt(0))) {
			throw new Chat.ErrorMessage(this.tr`/mee - must not start with a letter or number`);
		}
		target = this.checkChat(`/${this.cmd} ${target || ''}`);

		if (this.message.startsWith(`/ME`)) {
			const uppercaseIdentity = user.getIdentity(room).toUpperCase();
			if (this.pmTarget) {
				const msg = `|pm|${uppercaseIdentity}|${this.pmTarget.getIdentity()}|${target}`;
				user.send(msg);
				if (this.pmTarget !== user) this.pmTarget.send(msg);
			} else {
				this.add(`|c|${uppercaseIdentity}|${target}`);
			}
			return;
		}

		return target;
	},
	mehelp: [`/me [action] - Adds the given [action] into chat, attributed to the user.`],

	shrug(target) {
		target = target ? ' ' + target + ' ' : '';
		if (target.startsWith(' /me')) target = target.slice(1);
		return this.checkChat(target + '¯\\_(ツ)_/¯');
	},
	shrughelp: ['/shrug [message] - Sends the given message, if any, appended with ¯\\_(ツ)_/¯'],

	tableflip(target) {
		target = target ? ' ' + target + ' ' : '';
		if (target.startsWith(' /me')) target = target.slice(1);
		return this.checkChat(target + '(╯°□°）╯︵ ┻━┻');
	},
	tablefliphelp: ['/tableflip [message] - Sends the given message, if any, appended with (╯°□°）╯︵ ┻━┻'],

	tableunflip(target) {
		target = target ? ' ' + target + ' ' : '';
		if (target.startsWith(' /me')) target = target.slice(1);
		return this.checkChat(target + '┬──┬◡ﾉ(° -°ﾉ)');
	},
	tableunfliphelp: ['/tableunflip [message] - Sends the given message, if any, appended with ┬──┬◡ﾉ(° -°ﾉ)'],

	'battle!': 'battle',
	battle(target, room, user, connection, cmd) {
		if (cmd === 'battle') {
			return this.sendReply(this.tr`What?! How are you not more excited to battle?! Try /battle! to show me you're ready.`);
		}
		if (!target) target = "randombattle";
		return this.parse(`/search ${target}`);
	},
	battlehelp: [
		`/battle! [format] - Starts a battle in the given [format].`,
		`If none is given, defaults to current generation random battle.`,
	],

	signout: 'logout',
	logout(target, room, user) {
		user.resetName();
	},
	logouthelp: [`/logout - Logs you out and ends your session.`],

	noreply(target, room, user) {
		if (!target.startsWith('/')) return this.parse('/help noreply');
		return this.parse(target, { isQuiet: true });
	},
	noreplyhelp: [`/noreply [command] - Runs the command without displaying the response.`],

	async linksmogon(target, room, user) {
		if (Config.smogonauth && !Users.globalAuth.atLeast(user, Config.smogonauth)) {
			throw new Chat.ErrorMessage("Access denied.");
		}
		if (!user.registered) {
			throw new Chat.ErrorMessage(
				"You must be registered in order to use this command. If you just registered, please refresh and try again."
			);
		}
		this.sendReply("Linking...");
		const response = await LoginServer.request("smogon/validate", {
			username: user.id,
		});
		const name = response[0]?.signed_username;
		if (response[1] || !name) {
			throw new Chat.ErrorMessage("Error while verifying username: " + (response[1]?.message || "malformed name received"));
		}
		const link = `https://www.smogon.com/tools/connect-ps-account/${user.id}/${name}`;
		user.send(`|openpage|${link}`);
		this.sendReply(`|html|If the page failed to open, you may link your Smogon and PS accounts by clicking <a href="${link}">this link</a>.`);
	},

	async msgroom(target, room, user, connection) {
		const [targetId, message] = Utils.splitFirst(target, ',').map(i => i.trim());
		if (!targetId || !message) {
			return this.parse(`/help msgroom`);
		}
		this.checkRecursion();

		const targetRoom = Rooms.search(targetId.trim());
		if (!targetRoom) throw new Chat.ErrorMessage(`Room not found.`);
		if (message.trim().startsWith('/msgroom ')) {
			throw new Chat.ErrorMessage(`Please do not nest /msgroom inside itself.`);
		}
		const subcontext = new Chat.CommandContext({ room: targetRoom, message, user, connection });
		await subcontext.parse();
	},
	msgroomhelp: [`/msgroom [room], [command] - Runs the [command] in the given [room].`],

	r: 'reply',
	reply(target, room, user) {
		if (!target) return this.parse('/help reply');
		if (!user.lastPM) {
			throw new Chat.ErrorMessage(this.tr`No one has PMed you yet.`);
		}
		return this.parse(`/msg ${user.lastPM || ''}, ${target}`);
	},
	replyhelp: [`/reply OR /r [message] - Send a message to the last user you got a message from, or sent a message to.`],

	dm: 'msg',
	pm: 'msg',
	whisper: 'msg',
	w: 'msg',
	msg(target, room, user, connection) {
		if (!target) return this.parse('/help msg');
		if (!target.includes(',')) {
			this.errorReply(this.tr`You forgot the comma.`);
			return this.parse('/help msg');
		}
		this.checkRecursion();

		const { targetUser, targetUsername, rest: message } = this.splitUser(target);
		if (targetUsername === '~') {
			this.pmTarget = null;
			this.room = null;
		} else if (!targetUser) {
			if (Chat.PrivateMessages.offlineIsEnabled) {
				if (user.lastCommand === 'pm') {
					// don't delete lastCommand so they can just keep sending pms
					return this.parse(`/offlinemsg ${targetUsername},${message}`);
				}
				user.lastCommand = 'pm';
				throw new Chat.ErrorMessage(
					this.tr`User ${targetUsername} is offline. Send the message again to confirm. If you are using /msg, use /offlinemsg instead.`
				);
			}
			let error = this.tr`User ${targetUsername} not found. Did you misspell their name?`;
			error = `|pm|${this.user.getIdentity()}| ${targetUsername}|/error ${error}`;
			connection.send(error);
			return;
		} else {
			this.pmTarget = targetUser;
			this.room = null;
		}

		if (targetUser && !targetUser.connected) {
			if (Chat.PrivateMessages.offlineIsEnabled) {
				if (user.lastCommand === 'pm') {
					// don't delete lastCommand so they can just keep sending pms
					return this.parse(`/offlinemsg ${targetUser.getLastId()},${message}`);
				}
				user.lastCommand = 'pm';
				throw new Chat.ErrorMessage(
					this.tr`User ${targetUsername} is offline. Send the message again to confirm. If you are using /msg, use /offlinemsg instead.`
				);
			}
			throw new Chat.ErrorMessage(`${targetUsername} is offline.`);
		}

		return this.parse(message);
	},
	msghelp: [`/msg OR /whisper OR /w [username], [message] - Send a private message.`],

	offlinepm: 'offlinemsg',
	opm: 'offlinemsg',
	offlinewhisper: 'offlinemsg',
	ofw: 'offlinemsg',
	async offlinemsg(target, room, user) {
		target = target.trim();
		if (!target) return this.parse('/help offlinemsg');
		if (!Chat.PrivateMessages.offlineIsEnabled) {
			throw new Chat.ErrorMessage(`Offline private messages have been disabled.`);
		}
		let [username, message] = Utils.splitFirst(target, ',').map(i => i.trim());
		const userid = toID(username);
		Chat.PrivateMessages.checkCanPM(user, userid);
		if (!userid || !message) {
			return this.parse('/help offlinemsg');
		}
		if (Chat.parseCommand(message)) {
			throw new Chat.ErrorMessage(`You cannot send commands in offline PMs.`);
		}
		if (userid === user.id) {
			throw new Chat.ErrorMessage(`You cannot send offline PMs to yourself.`);
		} else if (userid.startsWith('guest')) {
			throw new Chat.ErrorMessage('You cannot send offline PMs to guests.');
		}
		if (Users.get(userid)?.connected) {
			this.sendReply(`That user is online, so a normal PM is being sent.`);
			return this.parse(`/pm ${userid}, ${message}`);
		}
		if (userid.length > 18) {
			throw new Chat.ErrorMessage(`Invalid userid. Must be <=18 characters in length.`);
		}
		message = this.checkChat(message);
		if (!message) return;
		await Chat.PrivateMessages.sendOffline(userid, user, message, this);
	},
	offlinemsghelp: [
		`/offlinemsg [username], [message] - Sends a message to the offline [username], to be received when they log in.`,
	],

	receivedpms: 'offlinepms',
	offlinepms() {
		return this.parse(`/j view-receivedpms`);
	},
	offlinepmshelp: [
		`/offlinepms - View your recently received offline PMs.`,
	],

	inv: 'invite',
	invite(target, room, user) {
		if (!target) return this.parse('/help invite');

		const pmTarget = this.pmTarget; // not room means it's a PM
		if (!pmTarget) {
			const users = target.split(',').map(part => part.trim());
			let targetRoom;
			if (users.length > 1 && Rooms.search(users[users.length - 1])) {
				targetRoom = users.pop();
			} else {
				targetRoom = room;
			}
			if (users.length > 1 && !user.trusted) {
				throw new Chat.ErrorMessage("You do not have permission to mass-invite users.");
			}
			if (users.length > 10) {
				throw new Chat.ErrorMessage("You cannot invite more than 10 users at once.");
			}
			for (const toInvite of users) {
				this.parse(`/pm ${toInvite}, /invite ${targetRoom}`);
			}
			return;
		}

		const targetRoom = Rooms.search(target);
		if (!targetRoom) throw new Chat.ErrorMessage(this.tr`The room "${target}" was not found.`);

		const invitesBlocked = pmTarget.settings.blockInvites;
		if (invitesBlocked) {
			if (invitesBlocked === true ? !user.can('lock') : !Users.globalAuth.atLeast(user, invitesBlocked as GroupSymbol)) {
				Chat.maybeNotifyBlocked('invite', pmTarget, user);
				throw new Chat.ErrorMessage(`This user is currently blocking room invites.`);
			}
		}
		if (!targetRoom.checkModjoin(pmTarget)) {
			this.room = targetRoom;
			this.parse(`/roomvoice ${pmTarget.name}`);
			if (!targetRoom.checkModjoin(pmTarget)) {
				throw new Chat.ErrorMessage(this.tr`You do not have permission to invite people into this room.`);
			}
		}
		if (pmTarget.id in targetRoom.users) {
			throw new Chat.ErrorMessage(this.tr`This user is already in "${targetRoom.title}".`);
		}
		return this.checkChat(`/invite ${targetRoom.roomid}`);
	},
	invitehelp: [
		`/invite [username] - Invites the player [username] to join the room you sent the command to.`,
		`/invite [comma-separated usernames] - Invites multiple users to join the room you sent the command to. Requires trusted`,
		`/invite [username], [roomname] - Invites the player [username] to join the room [roomname].`,
		`(in a PM) /invite [roomname] - Invites the player you're PMing to join the room [roomname].`,
	],

	blockpm: 'blockpms',
	ignorepms: 'blockpms',
	ignorepm: 'blockpms',
	blockofflinepms: 'blockpms',
	async blockpms(target, room, user, connection, cmd) {
		target = target.toLowerCase().trim();
		if (target === 'ac') target = 'autoconfirmed';

		const isOffline = cmd.includes('offline');
		const msg = isOffline ? `offline ` : ``;
		if (!isOffline && user.settings.blockPMs === (target || true)) {
			throw new Chat.ErrorMessage(this.tr`You are already blocking ${msg}private messages! To unblock, use /unblockpms`);
		}
		if (Users.Auth.isAuthLevel(target)) {
			if (!isOffline) user.settings.blockPMs = target;
			this.sendReply(this.tr`You are now blocking ${msg}private messages, except from staff and ${target}.`);
		} else if (target === 'autoconfirmed' || target === 'trusted' || target === 'unlocked') {
			if (!isOffline) user.settings.blockPMs = target;
			target = this.tr(target);
			this.sendReply(this.tr`You are now blocking ${msg}private messages, except from staff and ${target} users.`);
		} else if (target === 'friends') {
			if (!isOffline) user.settings.blockPMs = target;
			this.sendReply(this.tr`You are now blocking ${msg}private messages, except from staff and friends.`);
		} else {
			if (!isOffline) user.settings.blockPMs = true;
			this.sendReply(this.tr`You are now blocking ${msg}private messages, except from staff.`);
		}
		if (isOffline) {
			let saveValue: string | null = target;
			if (!saveValue) saveValue = 'none';
			// todo: can we do this? atm. no.
			if (['unlocked', 'autoconfirmed'].includes(saveValue)) {
				saveValue = null;
			}
			await Chat.PrivateMessages.setViewOnly(user, saveValue);
		}
		user.update();
		return true;
	},
	blockpmshelp: [
		`/blockpms - Blocks private messages except from staff. Unblock them with /unblockpms.`,
		`/blockpms [unlocked/ac/trusted/+/friends] - Blocks private messages except from staff and the specified group.`,
	],

	unblockpm: 'unblockpms',
	unignorepms: 'unblockpms',
	unignorepm: 'unblockpms',
	unblockofflinepms: 'unblockpms',
	async unblockpms(target, room, user, connection, cmd) {
		const isOffline = cmd.includes('offline');
		const msg = isOffline ? 'offline ' : '';
		if (isOffline ? !(await Chat.PrivateMessages.getSettings(user.id)) : !user.settings.blockPMs) {
			throw new Chat.ErrorMessage(this.tr`You are not blocking ${msg}private messages! To block, use /blockpms`);
		}
		if (isOffline) {
			await Chat.PrivateMessages.deleteSettings(user.id);
		} else {
			// eslint-disable-next-line require-atomic-updates
			user.settings.blockPMs = false;
		}
		user.update();
		return this.sendReply(this.tr`You are no longer blocking ${msg}private messages.`);
	},
	unblockpmshelp: [
		`/unblockpms - Unblocks private messages. Block them with /blockpms.`,
		`/unblockofflinepms - Unblocks offline private messages. Block them with /blockofflinepms.`,
	],

	unblockinvites: 'blockinvites',
	blockinvites(target, room, user, connection, cmd) {
		const unblock = cmd.includes('unblock');
		if (unblock) {
			if (!user.settings.blockInvites) {
				throw new Chat.ErrorMessage(`You are not blocking room invites! To block, use /blockinvites.`);
			}
			user.settings.blockInvites = false;
			this.sendReply(`You are no longer blocking room invites.`);
		} else {
			if (toID(target) === 'ac') target = 'autoconfirmed';
			if (user.settings.blockInvites === (target || true)) {
				throw new Chat.ErrorMessage("You are already blocking room invites - to unblock, use /unblockinvites");
			}
			if (target in Config.groups) {
				user.settings.blockInvites = target as GroupSymbol;
				this.sendReply(this.tr`You are now blocking room invites, except from staff and ${target}.`);
			} else if (target === 'autoconfirmed' || target === 'trusted' || target === 'unlocked') {
				user.settings.blockInvites = target;
				this.sendReply(this.tr`You are now blocking room invites, except from staff and ${target} users.`);
			} else {
				user.settings.blockInvites = true;
				this.sendReply(this.tr`You are now blocking room invites, except from staff.`);
			}
		}
		return user.update();
	},
	blockinviteshelp: [
		`/blockinvites [rank] - Allows only users with the given [rank] to invite you to rooms.`,
		`Valid settings: autoconfirmed, trusted, unlocked, +, %, @, ~.`,
		`/unblockinvites - Allows anyone to invite you to rooms.`,
	],

	status(target, room, user, connection, cmd) {
		if (user.locked || user.semilocked) {
			throw new Chat.ErrorMessage(this.tr`Your status cannot be updated while you are locked or semilocked.`);
		}
		if (!target) return this.parse('/help status');

		const maxLength = 70;
		if (target.length > maxLength) {
			throw new Chat.ErrorMessage(this.tr`Your status is too long; it must be under ${maxLength} characters.`);
		}
		target = this.statusfilter(target);
		if (!target) throw new Chat.ErrorMessage(this.tr`Your status contains a banned word.`);

		user.setUserMessage(target);
		this.sendReply(this.tr`Your status has been set to: ${target}.`);
	},
	statushelp: [
		`/status [note] - Sets a short note as your status, visible when users click your username.`,
		`Use /clearstatus to clear your status message.`,
	],

	donotdisturb: 'busy',
	dnd: 'busy',
	busy(target, room, user, connection, cmd) {
		if (target) {
			this.errorReply(this.tr`Setting status messages in /busy is no longer supported. Set a status using /status.`);
		}
		user.setStatusType('busy');
		const isDND = ['dnd', 'donotdisturb'].includes(cmd);
		if (isDND) {
			this.parse('/blockpms +');
			this.parse('/blockchallenges');
			user.settings.doNotDisturb = true;
		}
		this.sendReply(this.tr`You are now marked as busy.`);
	},
	busyhelp: [
		`/busy OR /donotdisturb - Marks you as busy.`,
		`Use /donotdisturb to also block private messages and challenges.`,
		`Use /back to mark yourself as back.`,
	],

	idle: 'away',
	afk: 'away',
	brb: 'away',
	away(target, room, user, connection, cmd) {
		if (target) {
			this.errorReply(this.tr`Setting status messages in /away is no longer supported. Set a status using /status.`);
		}
		user.setStatusType('idle');
		this.sendReply(this.tr`You are now marked as away. Send a message or use /back to indicate you are back.`);
	},
	awayhelp: [`/away - Marks you as away. Send a message or use /back to indicate you are back.`],

	cs: 'clearstatus',
	clearstatus(target, room, user) {
		if (target) return this.parse(`/forceclearstatus ${target}`);

		if (!user.userMessage) return this.sendReply(this.tr`You don't have a status message set.`);
		user.setUserMessage('');

		return this.sendReply(this.tr`You have cleared your status message.`);
	},
	clearstatushelp: [
		`/clearstatus - Clears your status message.`,
		`/clearstatus user, reason - Clears another person's status message. Requires: % @ ~`,
	],

	unaway: 'back',
	unafk: 'back',
	back(target, room, user) {
		if (user.statusType === 'online') throw new Chat.ErrorMessage(this.tr`You are already marked as back.`);
		const statusType = user.statusType;
		user.setStatusType('online');

		if (user.settings.doNotDisturb) {
			this.parse('/unblockpms');
			this.parse('/unblockchallenges');
			user.settings.doNotDisturb = false;
		}

		if (statusType) {
			return this.sendReply(this.tr`You are no longer marked as busy.`);
		}

		return this.sendReply(this.tr`You have cleared your status message.`);
	},
	backhelp: [`/back - Marks you as back if you are away.`],

	async rank(target, room, user) {
		if (!target) target = user.name;

		const values = await Ladders.visualizeAll(target);
		let buffer = `<div class="ladder">`;
		buffer += Utils.html`<div>User: <strong>${target}</strong></div>`;
		buffer += `<div style="overflow-x: auto;"><table>`;
		const ratings = values.join(``);
		if (!ratings) {
			buffer += `<tr><td colspan="8"><em>${this.tr`This user has not played any ladder games yet.`}</em></td></tr>`;
		} else {
			buffer += `<tr><th>${this.tr`Format`}</th><th><abbr title="Elo rating">Elo</abbr></th><th>${this.tr`W`}</th><th>${this.tr`L`}</th><th>${this.tr`Total`}</th>`;
			buffer += ratings;
		}
		buffer += `</table></div></div>`;
		this.sendReply(`|raw|${buffer}`);
	},
	rankhelp: [
		`/rank [user] - Shows all ladder ranks for the given [user].`,
		`If no user is given, it defaults to the user of the command.`,
	],

	showrank: 'hiderank',
	hiderank(target, room, user, connection, cmd) {
		const userGroup = Users.Auth.getGroup(Users.globalAuth.get(user.id));
		if (!userGroup['hiderank'] || !user.registered) {
			throw new Chat.ErrorMessage(`/hiderank - Access denied.`);
		}

		const isShow = cmd === 'showrank';
		const group = (isShow ? Users.globalAuth.get(user.id) : (target.trim() || Users.Auth.defaultSymbol()) as GroupSymbol);
		if (user.tempGroup === group) {
			throw new Chat.ErrorMessage(this.tr`You already have the temporary symbol '${group}'.`);
		}
		if (!Users.Auth.isValidSymbol(group) || !(group in Config.groups)) {
			throw new Chat.ErrorMessage(this.tr`You must specify a valid group symbol.`);
		}
		if (!isShow && Config.groups[group].rank > Config.groups[user.tempGroup].rank) {
			throw new Chat.ErrorMessage(this.tr`You may only set a temporary symbol below your current rank.`);
		}
		user.tempGroup = group;
		user.updateIdentity();
		this.sendReply(`|c|~|${this.tr`Your temporary group symbol is now`} \`\`${user.tempGroup}\`\`.`);
	},
	showrankhelp: 'hiderankhelp',
	hiderankhelp: [
		`/hiderank [rank] - Displays your global rank as the given [rank].`,
		`/showrank - Displays your true global rank instead of the rank you're hidden as.`,
	],

	language(target, room, user) {
		if (!target) {
			const language = Chat.languages.get(user.language || 'english' as ID);
			return this.sendReply(this.tr`Currently, you're viewing Pokémon Showdown in ${language}.`);
		}
		const languageID = toID(target);
		if (!Chat.languages.has(languageID)) {
			const languages = [...Chat.languages.values()].join(', ');
			throw new Chat.ErrorMessage(this.tr`Valid languages are: ${languages}`);
		}
		user.language = languageID;
		user.update();
		const languageName = Chat.languages.get(languageID);
		const langRoom = Rooms.search(languageName || "");
		let language = languageName;
		if (langRoom) {
			language = `<a href="/${langRoom.roomid}">${languageName}</a>`;
		}
		return this.sendReply(
			`|html|` + this.tr`Pokémon Showdown will now be displayed in ${language} (except in language rooms).`
		);
	},
	languagehelp: [
		`/language - View your current language setting.`,
		`/language [language] - Changes the language Pokémon Showdown will be displayed to you in.`,
		`Note that rooms can set their own language, which will override this setting.`,
	],

	updatesettings(target, room, user) {
		const settings: Partial<UserSettings> = {};
		try {
			const raw = JSON.parse(target);
			if (typeof raw !== 'object' || Array.isArray(raw) || !raw) {
				this.errorReply(this.tr`/updatesettings expects JSON encoded object.`);
			}
			if (typeof raw.language === 'string') this.parse(`/noreply /language ${raw.language}`);
			for (const setting in user.settings) {
				if (setting in raw) {
					if (setting === 'blockPMs' &&
						Users.Auth.isAuthLevel(raw[setting])) {
						settings[setting] = raw[setting];
					} else {
						settings[setting as keyof UserSettings] = !!raw[setting];
					}
				}
			}
			Object.assign(user.settings, settings);
			user.update();
		} catch {
			this.errorReply(this.tr`Unable to parse settings in /updatesettings!`);
		}
	},
	updatesettingshelp: [
		`/updatesettings [settings] - Update your settings to match the given JSON settings blob.`,
	],

	/*********************************************************
	 * Battle management commands
	 *********************************************************/

	allowexportinputlog(target, room, user) {
		room = this.requireRoom();
		const battle = room.battle;
		if (!battle) {
			throw new Chat.ErrorMessage(this.tr`Must be in a battle.`);
		}
		const targetUser = Users.getExact(target);
		if (!targetUser) {
			throw new Chat.ErrorMessage(this.tr`User ${target} not found.`);
		}
		if (!battle.playerTable[user.id]) {
			throw new Chat.ErrorMessage(this.tr`Must be a player in this battle.`);
		}
		if (!battle.allowExtraction[targetUser.id]) {
			throw new Chat.ErrorMessage(this.tr`${targetUser.name} has not requested extraction.`);
		}
		if (battle.allowExtraction[targetUser.id].has(user.id)) {
			throw new Chat.ErrorMessage(this.tr`You have already consented to extraction with ${targetUser.name}.`);
		}
		battle.allowExtraction[targetUser.id].add(user.id);
		this.addModAction(room.tr`${user.name} consents to sharing battle team and choices with ${targetUser.name}.`);
		if (!battle.inputLog) throw new Chat.ErrorMessage(this.tr`No input log found.`);
		if (Object.keys(battle.playerTable).length === battle.allowExtraction[targetUser.id].size) {
			this.addModAction(room.tr`${targetUser.name} has extracted the battle input log.`);
			const inputLog = battle.inputLog.map(Utils.escapeHTML).join(`<br />`);
			targetUser.sendTo(
				room,
				`|html|<div class="chat"><code style="white-space: pre-wrap; overflow-wrap: break-word; display: block">${inputLog}</code></div>`,
			);
		}
	},
	allowexportinputloghelp: [
		`/allowexportinputlog [user] - Consents to sharing teams and choices from the current battle with the specified user.`,
	],

	requestinputlog: 'exportinputlog',
	exportinputlog(target, room, user) {
		room = this.requireRoom();
		const battle = room.battle;
		if (!battle) {
			throw new Chat.ErrorMessage(this.tr`This command only works in battle rooms.`);
		}
		if (!battle.inputLog) {
			this.errorReply(this.tr`This command only works when the battle has ended - if the battle has stalled, use /offertie.`);
			if (user.can('forcewin')) this.errorReply(this.tr`Alternatively, you can end the battle with /forcetie.`);
			return;
		}
		this.checkCan('exportinputlog', null, room);
		if (user.can('forcewin') || Dex.formats.get(battle.format).team) {
			if (!battle.inputLog) throw new Chat.ErrorMessage(this.tr`No input log found.`);
			this.addModAction(room.tr`${user.name} has extracted the battle input log.`);
			const inputLog = battle.inputLog.map(Utils.escapeHTML).join(`<br />`);
			user.sendTo(
				room,
				`|html|<div class="chat"><code style="white-space: pre-wrap; overflow-wrap: break-word; display: block">${inputLog}</code></div>`,
			);
		} else if (!battle.allowExtraction[user.id]) {
			battle.allowExtraction[user.id] = new Set();
			for (const id in battle.playerTable) {
				const playerUser = Users.get(id);
				if (!playerUser) continue;
				if (playerUser.id === user.id) {
					battle.allowExtraction[user.id].add(user.id);
				} else {
					playerUser.sendTo(
						room,
						Utils.html`|html|${user.name} wants to extract the battle input log. <button name="send" value="/allowexportinputlog ${user.id}">Share your team and choices with "${user.name}"</button>`
					);
				}
			}
			this.addModAction(room.tr`${user.name} wants to extract the battle input log.`);
		} else {
			// Re-request to make the buttons appear again for users who have not allowed extraction
			let logExported = true;
			for (const id in battle.playerTable) {
				const playerUser = Users.get(id);
				if (!playerUser || battle.allowExtraction[user.id].has(playerUser.id)) continue;
				logExported = false;
				playerUser.sendTo(
					room,
					Utils.html`|html|${user.name} wants to extract the battle input log. <button name="send" value="/allowexportinputlog ${user.id}">Share your team and choices with "${user.name}"</button>`
				);
			}
			if (logExported) throw new Chat.ErrorMessage(this.tr`You already extracted the battle input log.`);
			this.sendReply(this.tr`Battle input log re-requested.`);
		}
	},
	exportinputloghelp: [`/exportinputlog - Asks players in a battle for permission to export an inputlog. Requires: ~`],

	importinputlog(target, room, user, connection) {
		this.checkCan('importinputlog');
		const formatIndex = target.indexOf(`"formatid":"`);
		const nextQuoteIndex = target.indexOf(`"`, formatIndex + 12);
		if (formatIndex < 0 || nextQuoteIndex < 0) throw new Chat.ErrorMessage(this.tr`Invalid input log.`);
		target = target.replace(/\r/g, '');
		if ((`\n` + target).includes(`\n>eval `) && !user.hasConsoleAccess(connection)) {
			throw new Chat.ErrorMessage(this.tr`Your input log contains untrusted code - you must have console access to use it.`);
		}

		const formatid = target.slice(formatIndex + 12, nextQuoteIndex);
		const battleRoom = Rooms.createBattle({ format: formatid, players: [], inputLog: target });
		if (!battleRoom) return; // createBattle will inform the user if creating the battle failed

		battleRoom.auth.set(user.id, Users.HOST_SYMBOL);
		this.parse(`/join ${battleRoom.roomid}`);
		setTimeout(() => {
			// timer to make sure this goes under the battle
			battleRoom.add(`|uhtmlchange|invites|<div class="broadcast broadcast-blue"><strong>This is an imported replay</strong><br />Players will need to be manually added with <code>/invitebattle</code> or <code>/restoreplayers</code></div>`);
			battleRoom.add(`|uhtml|invites|`).update();
			battleRoom.battle!.sendInviteForm(user);
		}, 500);
	},
	importinputloghelp: [`/importinputlog [inputlog] - Starts a battle with a given inputlog. Requires: + % @ ~`],

	showteam: 'showset',
	async showset(target, room, user, connection, cmd) {
		this.checkChat();
		const showAll = cmd === 'showteam';
		const hideStats = toID(target) === 'hidestats';
		room = this.requireRoom();
		const battle = room.battle;
		if (!showAll && !target) return this.parse(`/help showset`);
		if (!battle) throw new Chat.ErrorMessage(this.tr`This command can only be used in a battle.`);
		let team = await battle.getTeam(user);
		if (!team) throw new Chat.ErrorMessage(this.tr`You are not a player and don't have a team.`);

		if (!showAll) {
			const parsed = parseInt(target);
			if (isNaN(parsed)) {
				const id = toID(target);
				const matchedSet = team.find(set => toID(set.name) === id || toID(set.species) === id);
				if (!matchedSet) throw new Chat.ErrorMessage(this.tr`You don't have a Pokémon matching "${target}" in your team.`);
				team = [matchedSet];
			} else {
				const setIndex = parsed - 1;
				const indexedSet = team[setIndex];
				if (!indexedSet) {
					throw new Chat.ErrorMessage(this.tr`You don't have a Pokémon #${parsed} on your team - your team only has ${team.length} Pokémon.`);
				}
				team = [indexedSet];
			}
		}

		let resultString = Utils.escapeHTML(Teams.export(team, { hideStats }));
		if (showAll) {
			resultString = `<details><summary>${this.tr`View team`}</summary>${resultString}</details>`;
		}
		this.runBroadcast(true);
		return this.sendReplyBox(resultString);
	},
	showsethelp: [
		`!showteam - show the team you're using in the current battle (must be used in a battle you're a player in).`,
		`!showteam hidestats - show the team you're using in the current battle, without displaying any stat-related information.`,
		`!showset [number] - shows the set of the pokemon corresponding to that number (in original Team Preview order, not necessarily current order)`,
	],

	confirmready(target, room, user) {
		const game = this.requireGame(Rooms.BestOfGame);
		game.confirmReady(user);
	},

	acceptopenteamsheets(target, room, user, connection, cmd) {
		room = this.requireRoom();
		const battle = room.battle;
		if (!battle) throw new Chat.ErrorMessage(this.tr`Must be in a battle room.`);
		const player = battle.playerTable[user.id];
		if (!player) {
			throw new Chat.ErrorMessage(this.tr`Must be a player to agree to open team sheets.`);
		}
		const format = Dex.formats.get(battle.options.format);
		if (!Dex.formats.getRuleTable(format).has('openteamsheets')) {
			throw new Chat.ErrorMessage(this.tr`This format does not allow requesting open team sheets. You can both manually agree to it by using !showteam hidestats.`);
		}
		if (battle.turn > 0) {
			throw new Chat.ErrorMessage(this.tr`You cannot agree to open team sheets after Team Preview. Each player can still show their own sheet by using this command: !showteam hidestats`);
		}
		if (battle.players.some(curPlayer => curPlayer.wantsOpenTeamSheets === false)) {
			throw new Chat.ErrorMessage(this.tr`An opponent has already rejected open team sheets.`);
		}
		if (player.wantsOpenTeamSheets !== null) {
			throw new Chat.ErrorMessage(this.tr`You have already made your decision about agreeing to open team sheets.`);
		}
		player.wantsOpenTeamSheets = true;
		player.sendRoom(Utils.html`|uhtmlchange|otsrequest|`);

		this.add(this.tr`${user.name} has agreed to open team sheets.`);
		if (battle.players.every(curPlayer => curPlayer.wantsOpenTeamSheets)) {
			void battle.stream.write('>show-openteamsheets');
		}
	},
	acceptopenteamsheetshelp: [`/acceptopenteamsheets - Agrees to an open team sheet opportunity during Team Preview, where all information on a team except stats is shared with the opponent. Requires: \u2606`],

	rejectopenteamsheets(target, room, user) {
		room = this.requireRoom();
		const battle = room.battle;
		if (!battle) throw new Chat.ErrorMessage(this.tr`Must be in a battle room.`);
		const player = battle.playerTable[user.id];
		if (!player) {
			throw new Chat.ErrorMessage(this.tr`Must be a player to reject open team sheets.`);
		}
		const format = Dex.formats.get(battle.options.format);
		if (!Dex.formats.getRuleTable(format).has('openteamsheets')) {
			throw new Chat.ErrorMessage(this.tr`This format does not allow requesting open team sheets.`);
		}
		if (battle.turn > 0) {
			throw new Chat.ErrorMessage(this.tr`You cannot reject open team sheets after Team Preview.`);
		}
		if (player.wantsOpenTeamSheets !== null) {
			throw new Chat.ErrorMessage(this.tr`You have already made your decision about agreeing to open team sheets.`);
		}
		player.wantsOpenTeamSheets = false;
		for (const otherPlayer of battle.players) {
			otherPlayer.sendRoom(Utils.html`|uhtmlchange|otsrequest|`);
		}
		return this.add(this.tr`${user.name} rejected open team sheets.`);
	},
	rejectopenteamsheetshelp: [`/rejectopenteamsheetshelp - Rejects an open team sheet opportunity during Team Preview, where all information on a team except stats is shared with the opponent. Requires: \u2606`],

	acceptdraw: 'offertie',
	accepttie: 'offertie',
	offerdraw: 'offertie',
	requesttie: 'offertie',
	offertie(target, room, user, connection, cmd) {
		room = this.requireRoom();
		const battle = room.battle;
		if (!battle) throw new Chat.ErrorMessage(this.tr`Must be in a battle room.`);
		if (!Config.allowrequestingties) {
			throw new Chat.ErrorMessage(this.tr`This server does not allow offering ties.`);
		}
		if (room.tour) {
			throw new Chat.ErrorMessage(this.tr`You can't offer ties in tournaments.`);
		}
		if (battle.turn < 100) {
			throw new Chat.ErrorMessage(this.tr`It's too early to tie, please play until turn 100.`);
		}
		this.checkCan('roomvoice', null, room);
		if (cmd === 'accepttie' && !battle.players.some(player => player.wantsTie)) {
			throw new Chat.ErrorMessage(this.tr`No other player is requesting a tie right now. It was probably canceled.`);
		}
		const player = battle.playerTable[user.id];
		if (!battle.players.some(curPlayer => curPlayer.wantsTie)) {
			this.add(this.tr`${user.name} is offering a tie.`);
			room.update();
			for (const otherPlayer of battle.players) {
				if (otherPlayer !== player) {
					otherPlayer.sendRoom(
						Utils.html`|uhtml|offertie|<button class="button" name="send" value="/accepttie"><strong>${this.tr`Accept tie`}</strong></button> <button class="button" name="send" value="/rejecttie">${this.tr`Reject`}</button>`
					);
				} else {
					player.wantsTie = true;
				}
			}
		} else {
			if (!player) {
				throw new Chat.ErrorMessage(this.tr`Must be a player to accept ties.`);
			}
			if (!player.wantsTie) {
				player.wantsTie = true;
			} else {
				throw new Chat.ErrorMessage(this.tr`You have already agreed to a tie.`);
			}
			player.sendRoom(Utils.html`|uhtmlchange|offertie|`);
			this.add(this.tr`${user.name} accepted the tie.`);
			if (battle.players.every(curPlayer => curPlayer.wantsTie)) {
				if (battle.players.length > 2) {
					this.add(this.tr`All players have accepted the tie.`);
				}
				battle.tie();
			}
		}
	},
	offertiehelp: [`/offertie - Offers a tie to all players in a battle; if all accept, it ties. Can only be used after 100+ turns have passed. Requires: \u2606 @ # ~`],

	rejectdraw: 'rejecttie',
	rejecttie(target, room, user) {
		room = this.requireRoom();
		const battle = room.battle;
		if (!battle) throw new Chat.ErrorMessage(this.tr`Must be in a battle room.`);
		const player = battle.playerTable[user.id];
		if (!player) {
			throw new Chat.ErrorMessage(this.tr`Must be a player to reject ties.`);
		}
		if (!battle.players.some(curPlayer => curPlayer.wantsTie)) {
			throw new Chat.ErrorMessage(this.tr`No other player is requesting a tie right now. It was probably canceled.`);
		}
		if (player.wantsTie) player.wantsTie = false;
		for (const otherPlayer of battle.players) {
			otherPlayer.sendRoom(Utils.html`|uhtmlchange|offertie|`);
		}
		return this.add(this.tr`${user.name} rejected the tie.`);
	},
	rejecttiehelp: [`/rejecttie - Rejects a tie offered by another player in a battle.`],

	inputlog() {
		this.parse(`/help exportinputlog`);
		this.parse(`/help importinputlog`);
	},

	/*********************************************************
	 * Battle commands
	 *********************************************************/

	forfeit(target, room, user) {
		room = this.requireRoom();
		if (!room.game) throw new Chat.ErrorMessage(this.tr`This room doesn't have an active game.`);
		if (!room.game.forfeit) {
			throw new Chat.ErrorMessage(this.tr`This kind of game can't be forfeited.`);
		}
		room.game.forfeit(user);
	},
	forfeithelp: [
		`/forfeit - Forfeits your currently active game, if it supports that.`,
	],

	guess: 'choose',
	choose(target, room, user) {
		room = this.requireRoom();
		if (!room.game) throw new Chat.ErrorMessage(this.tr`This room doesn't have an active game.`);
		if (!room.game.choose) throw new Chat.ErrorMessage(this.tr`This game doesn't support /choose`);
		if (room.game.checkChat) this.checkChat();
		room.game.choose(user, target);
	},
	choosehelp: [
		`/choose [text] - Make a choice for the currently active game.`,
	],

	mv: 'move',
	attack: 'move',
	move(target, room, user) {
		this.parse(`/choose move ${target}`);
	},
	movehelp: [
		`/move [move] - Make a move for the current game.`,
	],

	sw: 'switch',
	switch(target, room, user) {
		this.parse(`/choose switch ${target}`);
	},
	switchhelp: [
		`/switch [pokemon] - Make a switch for the current game.`,
	],

	team(target, room, user) {
		this.parse(`/choose team ${target}`);
	},
	teamhelp: [
		`/team [pokemon] - Change your team for the current game.`,
	],

	undo(target, room, user) {
		room = this.requireRoom();
		if (!room.game) throw new Chat.ErrorMessage(this.tr`This room doesn't have an active game.`);
		if (!room.game.undo) throw new Chat.ErrorMessage(this.tr`This game doesn't support /undo`);

		room.game.undo(user, target);
	},
	undohelp: [
		`/undo - Reverts the last move of the player in the current game, if it supports it.`,
	],

	uploadreplay: 'savereplay',
	async savereplay(target, room, user, connection) {
		if (!room?.battle) {
			throw new Chat.ErrorMessage(this.tr`You can only save replays for battles.`);
		}

		const options = (target === 'forpunishment' || target === 'silent') ? target : undefined;
		await room.uploadReplay(user, connection, options);
	},
	savereplayhelp: [`/savereplay - Saves the replay for the current battle.`],

	hidereplay(target, room, user, connection) {
		if (!room?.battle) throw new Chat.ErrorMessage(`Must be used in a battle.`);
		this.checkCan('joinbattle', null, room);
		if (room.tour?.forcePublic) {
			throw new Chat.ErrorMessage(this.tr`This battle can't have hidden replays, because the tournament is set to be forced public.`);
		}
		if (room.hideReplay) throw new Chat.ErrorMessage(this.tr`The replay for this battle is already set to hidden.`);
		room.hideReplay = true;
		// If a replay has already been saved, /savereplay again to update the uploaded replay's hidden status
		if (room.battle.replaySaved) this.parse('/savereplay');
		this.addModAction(room.tr`${user.name} hid the replay of this battle.`);
	},
	hidereplayhelp: [`/hidereplay - Hides the replay of the current battle. Requires: ${Users.PLAYER_SYMBOL} ~`],

	addplayer: 'invitebattle',
	invitebattle(target, room, user, connection) {
		room = this.requireRoom();
		if (!room.battle) throw new Chat.ErrorMessage(this.tr`You can only do this in battle rooms.`);
		if (room.rated) throw new Chat.ErrorMessage(this.tr`You can only add a Player to unrated battles.`);

		this.checkCan('joinbattle', null, room);

		const { targetUser, targetUsername: name, rest: slot } = this.splitUser(target, { exactName: true });
		if (slot !== 'p1' && slot !== 'p2' && slot !== 'p3' && slot !== 'p4') {
			this.errorReply(this.tr`Player must be set to "p1" or "p2", not "${slot}".`);
			return this.parse('/help addplayer');
		}

		const battle = room.battle;
		const player = battle[slot];

		if (!player) {
			throw new Chat.ErrorMessage(`This battle does not support having players in ${slot}`);
		}
		if (!targetUser) {
			battle.sendInviteForm(connection);
			throw new Chat.ErrorMessage(this.tr`User ${name} not found.`);
		}
		if (player.id) {
			battle.sendInviteForm(connection);
			throw new Chat.ErrorMessage(this.tr`This room already has a player in slot ${slot}.`);
		}
		if (player.invite) {
			battle.sendInviteForm(connection);
			throw new Chat.ErrorMessage(`Someone else (${player.invite}) has already been invited to be ${slot}!`);
		}
		if (targetUser.id in battle.playerTable) {
			battle.sendInviteForm(connection);
			throw new Chat.ErrorMessage(this.tr`${targetUser.name} is already a player in this battle.`);
		}

		if (targetUser.settings.blockChallenges && !user.can('bypassblocks', targetUser)) {
			battle.sendInviteForm(connection);
			Chat.maybeNotifyBlocked('challenge', targetUser, user);
			throw new Chat.ErrorMessage(this.tr`The user '${targetUser.name}' is not accepting challenges right now.`);
		}

		// INVITE

		if (!targetUser.inRooms.has(room.roomid) || !player.hasTeam) {
			player.invite = targetUser.id;
			const playerNames = battle.players.map(p => p.id && p.name).filter(Boolean).join(', ');
			const ready = player.hasTeam ? battle.format : new Ladders.BattleReady(user.id, battle.format, user.battleSettings);
			Ladders.challenges.add(
				new Ladders.BattleInvite(user.id, targetUser.id, ready, {
					acceptCommand: `/acceptbattle ${user.id}`,
					message: `You're invited to join a battle (with ${playerNames})`,
					roomid: room.roomid,
				})
			);
			battle.sendInviteForm(battle.invitesFull() ? true : connection);
			return this.add(`||Invite sent to ${targetUser.name}!`);
		}

		room.auth.set(targetUser.id, Users.PLAYER_SYMBOL);
		const success = battle.joinGame(targetUser, slot);
		if (!success) {
			room.auth.delete(targetUser.id);
			return;
		}
		if (!battle.started) battle.sendInviteForm(connection);
	},
	invitebattlehelp: [
		`/addplayer [username], [p1|p2|p3|p4] - Invites the player to join your current battle.`,
	],

	async acceptbattle(target, room, user, connection) {
		const chall = Ladders.challenges.resolveAcceptCommand(this);

		const targetRoom = Rooms.get(chall.roomid);
		if (!targetRoom) throw new Chat.ErrorMessage(`Room ${chall.roomid} not found`);
		const battle = targetRoom.battle!;
		const player = battle.players.find(maybe => maybe.invite === user.id);
		if (!player) {
			throw new Chat.ErrorMessage(`You haven't been invited to that battle.`);
		}
		const slot = player.slot;
		if (player.id) {
			throw new Error(`Player ${player.slot} in ${chall.roomid} should not have both 'id' and 'invite'`);
		}

		let playerOpts = undefined;
		if (!player.hasTeam) {
			const ladder = Ladders(battle.format);
			const ready = await ladder.prepBattle(connection, 'challenge');
			if (!ready) return;
			playerOpts = ready.settings;
		}

		const fromUser = Ladders.challenges.accept(this);

		this.pmTarget = fromUser;
		this.sendChatMessage(`/text You accepted the battle invite`);
		this.parse(`/join ${targetRoom.roomid}`);
		battle.joinGame(user, slot, playerOpts);
	},
	acceptbattlehelp: [`/acceptbattle - Accept an invite from someone to join a battle.`],

	uninvitebattle(target, room, user, connection) {
		room = this.requireRoom();
		this.checkCan('joinbattle', null, room);

		if (!room.battle) throw new Chat.ErrorMessage(this.tr`You can only do this in battle rooms.`);
		const invitesFull = room.battle.invitesFull();
		const challenges = Ladders.challenges.get(target as ID);

		if (!challenges) throw new Chat.ErrorMessage(`User ${target} is not currently invited to the battle`);
		for (const challenge of challenges) {
			if (challenge.to === target && challenge.roomid === room.roomid) {
				Ladders.challenges.remove(challenge);
				Ladders.challenges.send(challenge.from, target, `/text The battle invite was changed to someone else; sorry!`);
			}
		}

		room.battle.sendInviteForm(invitesFull ? true : connection);
	},
	uninvitebattlehelp: [
		`/uninvitebattle [username] - Revokes an invite from a user to join a battle.`,
		`Requires: ${Users.PLAYER_SYMBOL} ~`,
	],

	restoreplayers(target, room, user) {
		room = this.requireRoom();
		if (!room.battle) throw new Chat.ErrorMessage(this.tr`You can only do this in battle rooms.`);
		if (room.rated) throw new Chat.ErrorMessage(this.tr`You can only add a Player to unrated battles.`);

		let didSomething = false;
		for (const player of room.battle.players) {
			if (!player.id && player.name !== `Player ${player.num}`) {
				this.parse(`/invitebattle ${player.name}, ${player.slot}`);
				didSomething = true;
			}
		}

		if (!didSomething) {
			throw new Chat.ErrorMessage(this.tr`Players could not be restored (maybe this battle already has two players?).`);
		}
	},
	restoreplayershelp: [
		`/restoreplayers - Restore previous players in an imported input log.`,
	],

	joinbattle: 'joingame',
	joingame(target, room, user) {
		room = this.requireRoom();
		if (!room.game) throw new Chat.ErrorMessage(this.tr`This room doesn't have an active game.`);
		if (!room.game.joinGame) throw new Chat.ErrorMessage(this.tr`This game doesn't support /joingame`);

		room.game.joinGame(user, target);
	},
	joingamehelp: [`/joingame [username] - Join the game being played in the current room.`],

	leavebattle: 'leavegame',
	partbattle: 'leavegame',
	leavegame(target, room, user) {
		room = this.requireRoom();
		if (!room.game) throw new Chat.ErrorMessage(this.tr`This room doesn't have an active game.`);
		if (!room.game.leaveGame) throw new Chat.ErrorMessage(this.tr`This game doesn't support /leavegame`);

		room.game.leaveGame(user);
	},
	leavegamehelp: [`/leavegame - Leave the current game.`],

	kickbattle: 'kickgame',
	kickgame(target, room, user) {
		room = this.requireRoom();
		if (!room.battle) throw new Chat.ErrorMessage(this.tr`You can only do this in battle rooms.`);
		if (room.battle.challengeType === 'tour' || room.battle.rated) {
			throw new Chat.ErrorMessage(this.tr`You can only do this in unrated non-tour battles.`);
		}
		const { targetUser, rest: reason } = this.requireUser(target, { allowOffline: true });
		this.checkCan('kick', targetUser, room);
		if (room.battle.leaveGame(targetUser)) {
			const displayReason = reason ? ` (${reason})` : ``;
			this.addModAction(room.tr`${targetUser.name} was kicked from a battle by ${user.name}.${displayReason}`);
			this.modlog('KICKBATTLE', targetUser, reason, { noip: 1, noalts: 1 });
		} else {
			throw new Chat.ErrorMessage("/kickbattle - User isn't in battle.");
		}
	},
	kickbattlehelp: [`/kickbattle [username], [reason] - Kicks a user from a battle with reason. Requires: % @ ~`],

	kickinactive(target, room, user) {
		this.parse(`/timer on`);
	},
	kickinactivehelp: [
		`/kickinactive - Activates the inactive timer, if the game supports it.`,
	],

	timer(target, room, user) {
		target = toID(target);
		room = this.requireRoom();
		if (!room.game?.timer) {
			throw new Chat.ErrorMessage(this.tr`You can only set the timer from inside a battle room.`);
		}
		const timer = room.game.timer as any;
		if (!timer.timerRequesters) {
			return this.sendReply(this.tr`This game's timer is managed by a different command.`);
		}
		if (!target) {
			if (!timer.timerRequesters.size) {
				return this.sendReply(this.tr`The game timer is OFF.`);
			}
			const requester = [...timer.timerRequesters].join(', ');
			return this.sendReply(this.tr`The game timer is ON (requested by ${requester})`);
		}
		const force = user.can('timer', null, room);
		if (!force && !room.game.playerTable[user.id]) {
			throw new Chat.ErrorMessage(this.tr`Access denied.`);
		}
		if (this.meansNo(target) || target === 'stop') {
			if (timer.timerRequesters.size) {
				timer.stop(force ? undefined : user);
				if (force) {
					room.send(`|inactiveoff|${room.tr`Timer was turned off by staff. Please do not turn it back on until our staff say it's okay.`}`);
				}
			} else {
				throw new Chat.ErrorMessage(this.tr`The timer is already off.`);
			}
		} else if (this.meansYes(target) || target === 'start') {
			timer.start(user);
		} else {
			throw new Chat.ErrorMessage(this.tr`"${target}" is not a recognized timer state.`);
		}
	},
	timerhelp: [
		`/timer [start|stop] - Starts or stops the game timer. Requires: ${Users.PLAYER_SYMBOL} % @ ~`,
	],

	autotimer: 'forcetimer',
	forcetimer(target, room, user) {
		room = this.requireRoom();
		target = toID(target);
		this.checkCan('autotimer');
		if (this.meansNo(target) || target === 'stop') {
			Config.forcetimer = false;
			this.addModAction(room.tr`Forcetimer is now OFF: The timer is now opt-in. (set by ${user.name})`);
		} else if (this.meansYes(target) || target === 'start' || !target) {
			Config.forcetimer = true;
			this.addModAction(room.tr`Forcetimer is now ON: All battles will be timed. (set by ${user.name})`);
		} else {
			throw new Chat.ErrorMessage(this.tr`'${target}' is not a recognized forcetimer setting.`);
		}
	},
	forcetimerhelp: [
		`/forcetimer [start|stop] - Forces all battles to have the inactive timer enabled. Requires: ~`,
	],

	forcetie: 'forcewin',
	forcewin(target, room, user) {
		room = this.requireRoom();
		this.checkCan('forcewin');
		if (
			!room.battle &&
			!(room.game && typeof (room.game as any).tie === 'function' && typeof (room.game as any).win === 'function')
		) {
			throw new Chat.ErrorMessage("/forcewin - This is not a battle room.");
		}

		if (room.battle) room.battle.endType = 'forced';
		if (!target) {
			(room.game as any).tie();
			this.modlog('FORCETIE');
			return false;
		}
		const targetUser = Users.getExact(target);
		if (!targetUser) throw new Chat.ErrorMessage(this.tr`User '${target}' not found.`);

		(room.game as any).win(targetUser);
		this.modlog('FORCEWIN', targetUser.id);
	},
	forcewinhelp: [
		`/forcetie - Forces the current match to end in a tie. Requires: ~`,
		`/forcewin [user] - Forces the current match to end in a win for a user. Requires: ~`,
	],

	/*********************************************************
	 * Challenging and searching commands
	 *********************************************************/

	async search(target, room, user, connection) {
		if (target) {
			if (Config.laddermodchat && !Users.globalAuth.atLeast(user, Config.laddermodchat)) {
				const groupName = Config.groups[Config.laddermodchat].name || Config.laddermodchat;
				this.popupReply(this.tr`This server requires you to be rank ${groupName} or higher to search for a battle.`);
				return false;
			}
			const ladder = Ladders(target);
			if (!user.registered && Config.forceregisterelo && await ladder.getRating(user.id) >= Config.forceregisterelo) {
				user.send(
					Utils.html`|popup||html|${this.tr`Since you have reached ${Config.forceregisterelo} ELO in ${target}, you must register your account to continue playing that format on ladder.`}<p style="text-align: center"><button name="register" value="${user.id}"><b>${this.tr`Register`}</b></button></p>`
				);
				return false;
			}
			Chat.runHandlers('onLadderSearch', user, connection, ladder.formatid as ID);
			return ladder.searchBattle(user, connection);
		}
		return Ladders.cancelSearches(user);
	},
	searchhelp: [
		`/search [format] - Searches for a battle in the specified format.`,
	],

	cancelsearch(target, room, user) {
		if (target) {
			Ladders(toID(target)).cancelSearch(user);
		} else {
			Ladders.cancelSearches(user);
		}
	},
	cancelsearchhelp: [
		`/cancelsearch [format] - Cancels a search for a battle in the specified format.`,
		`If no format is given, cancels searches for all formats.`,
	],

	chall: 'challenge',
	challenge(target, room, user, connection) {
		const { targetUser, targetUsername, rest: formatName } = this.splitUser(target);
		if (!targetUser?.connected) {
			return this.popupReply(this.tr`The user '${targetUsername}' was not found.`);
		}
		if (user.locked && !targetUser.locked) {
			return this.popupReply(this.tr`You are locked and cannot challenge unlocked users. If this user is your friend, ask them to challenge you instead.`);
		}
		if (Punishments.isBattleBanned(user)) {
			return this.popupReply(this.tr`You are banned from battling and cannot challenge users.`);
		}
		if (!user.named) {
			return this.popupReply(this.tr`You must choose a username before you challenge someone.`);
		}
		if (Config.pmmodchat && !user.hasSysopAccess() && !Users.globalAuth.atLeast(user, Config.pmmodchat as GroupSymbol)) {
			const groupName = Config.groups[Config.pmmodchat].name || Config.pmmodchat;
			this.popupReply(this.tr`This server requires you to be rank ${groupName} or higher to challenge users.`);
			return false;
		}
		return Ladders(formatName).makeChallenge(connection, targetUser);
	},
	challengehelp: [
		`/challenge [user], [format] - Challenges the given [user] to a battle in the given [format].`,
	],

	bch: 'blockchallenges',
	blockchall: 'blockchallenges',
	blockchalls: 'blockchallenges',
	blockchallenges(target, room, user) {
		if (toID(target) === 'ac') target = 'autoconfirmed';
		if (user.settings.blockChallenges === (target || true)) {
			throw new Chat.ErrorMessage(this.tr`You are already blocking challenges!`);
		}
		if (Users.Auth.isAuthLevel(target)) {
			user.settings.blockChallenges = target;
			this.sendReply(this.tr`You are now blocking challenges, except from staff and ${target}.`);
		} else if (target === 'autoconfirmed' || target === 'trusted' || target === 'unlocked' || target === 'friends') {
			user.settings.blockChallenges = target;
			if (target === 'friends') target = 'friended';
			target = this.tr(target);
			this.sendReply(this.tr`You are now blocking challenges, except from staff and ${target} users.`);
		} else {
			user.settings.blockChallenges = true;
			this.sendReply(this.tr`You are now blocking all incoming challenge requests.`);
		}
		user.update();
	},
	blockchallengeshelp: [
		`/blockchallenges - Blocks challenges so no one can challenge you. Unblock them with /unblockchallenges.`,
	],

	unbch: 'allowchallenges',
	unblockchall: 'allowchallenges',
	unblockchalls: 'allowchallenges',
	unblockchallenges: 'allowchallenges',
	allowchallenges(target, room, user) {
		if (!user.settings.blockChallenges) throw new Chat.ErrorMessage(this.tr`You are already available for challenges!`);
		user.settings.blockChallenges = false;
		user.update();
		this.sendReply(this.tr`You are available for challenges from now on.`);
	},
	allowchallengeshelp: [
		`/unblockchallenges - Unblocks challenges so you can be challenged again. Block them with /blockchallenges.`,
	],
	cchall: 'cancelchallenge',
	cancelchallenge(target, room, user, connection) {
		const { targetUser, targetUsername, rest } = this.splitUser(target);
		if (rest) return this.popupReply(this.tr`This command does not support specifying multiple users`);
		this.pmTarget = targetUser || this.pmTarget;
		if (!this.pmTarget) return this.popupReply(this.tr`User "${targetUsername}" not found.`);

		const chall = Ladders.challenges.search(user.id, this.pmTarget.id);
		if (!chall || chall.from !== user.id) {
			connection.popup(`You are not challenging ${this.pmTarget.name}. Maybe they accepted/rejected before you cancelled?`);
			return false;
		}

		this.sendChatMessage(`/log ${user.name} cancelled the challenge.`);
		return Ladders.challenges.remove(chall);
	},
	cancelchallengehelp: [
		`/cancelchallenge [user] - Cancels a pending challenge to the given [user].`,
	],

	async accept(target, room, user, connection) {
		const { targetUser, targetUsername, rest } = this.splitUser(target);
		if (rest) return this.popupReply(this.tr`This command does not support specifying multiple users`);
		this.pmTarget = targetUser || this.pmTarget;
		if (!this.pmTarget) return this.popupReply(this.tr`User "${targetUsername}" not found.`);

		const chall = Ladders.challenges.search(user.id, this.pmTarget.id);
		if (!chall || chall.to !== user.id) {
			connection.popup(`${this.pmTarget.id} is not challenging you. Maybe they cancelled before you accepted?`);
			return false;
		}

		if (chall.acceptCommand) {
			return this.parse(chall.acceptCommand);
		}
		const gameRoom = await Ladders.acceptChallenge(connection, chall as Ladders.BattleChallenge);
		if (!gameRoom) return false;
		this.sendChatMessage(Utils.html`/nonotify ${user.name} accepted the challenge, starting &laquo;<a href="/${gameRoom.roomid}">${gameRoom.roomid}</a>&raquo;`);
		return true;
	},
	accepthelp: [`/accept [user] - Accepts a challenge from the given user.`],

	reject(target, room, user, connection) {
		const { targetUser, targetUsername, rest } = this.splitUser(target);
		if (rest) return this.popupReply(this.tr`This command does not support specifying multiple users`);
		this.pmTarget = targetUser || this.pmTarget;
		if (!this.pmTarget) return this.popupReply(this.tr`User "${targetUsername}" not found.`);

		const chall = Ladders.challenges.search(user.id, this.pmTarget.id);
		if (!chall || chall.to !== user.id) {
			connection.popup(`${this.pmTarget.id} is not challenging you. Maybe they cancelled before you rejected?`);
			return false;
		}

		this.sendChatMessage(`/nonotify ${user.name} rejected the challenge.`);
		return Ladders.challenges.remove(chall, false);
	},
	rejecthelp: [`/reject [user] - Rejects a challenge from the given user.`],

	saveteam: 'useteam',
	utm: 'useteam',
	useteam(target, room, user) {
		user.battleSettings.team = target;
	},
	useteamhelp: [`/useteam [packed team] - Sets your team for your next battles to the given [team].`],

	vtm(target, room, user, connection) {
		if (Monitor.countPrepBattle(connection.ip, connection)) {
			return;
		}
		if (!target) throw new Chat.ErrorMessage(this.tr`Provide a valid format.`);
		const originalFormat = Dex.formats.get(target);
		// Note: The default here of Anything Goes isn't normally hit; since the web client will send a default format
		const format = originalFormat.effectType === 'Format' ? originalFormat : Dex.formats.get('Anything Goes');
		if (format.effectType !== 'Format') return this.popupReply(this.tr`Please provide a valid format.`);

		return TeamValidatorAsync.get(format.id).validateTeam(user.battleSettings.team, { user: user.id }).then(result => {
			const matchMessage = (originalFormat === format ? "" : this.tr`The format '${originalFormat.name}' was not found.`);
			if (result.startsWith('1')) {
				connection.popup(`${(matchMessage ? matchMessage + "\n\n" : "")}${this.tr`Your team is valid for ${format.name}.`}`);
			} else {
				connection.popup(`${(matchMessage ? matchMessage + "\n\n" : "")}${this.tr`Your team was rejected for the following reasons:`}\n\n- ${result.slice(1).replace(/\n/g, '\n- ')}`);
			}
		});
	},
	vtmhelp: [`/vtm [format] - Validates your current team (set with /utm).`],

	hbtc: 'hidebattlesfromtrainercard',
	sbtc: 'hidebattlesfromtrainercard',
	showbattlesinusercard: 'hidebattlesfromtrainercard',
	hidebattlesfromusercard: 'hidebattlesfromtrainercard',
	showbattlesintrainercard: 'hidebattlesfromtrainercard',
	hidebattlesfromtrainercard(target, room, user, connection, cmd) {
		const shouldHide = cmd.includes('hide') || cmd === 'hbtc';
		user.settings.hideBattlesFromTrainerCard = shouldHide;
		user.update();
		if (shouldHide) {
			this.sendReply(this.tr`Battles are now hidden (except to staff) in your trainer card.`);
		} else {
			this.sendReply(this.tr`Battles are now visible in your trainer card.`);
		}
	},
	hidebattlesfromtrainercardhelp: [
		`/hidebattlesfromtrainercard OR /hbtc - Hides your battles in your trainer card.`,
		`/showbattlesintrainercard OR /sbtc - Displays your battles in your trainer card.`,
	],

	/*********************************************************
	 * Low-level
	 *********************************************************/

	cmd: 'crq',
	query: 'crq',
	async crq(target, room, user, connection) {
		// In emergency mode, clamp down on data returned from crq's
		const trustable = (!Config.emergency || (user.named && user.registered));
		let cmd;
		[cmd, target] = Utils.splitFirst(target, ' ');

		const handler = Chat.crqHandlers[cmd];
		if (!handler) return connection.send(`|queryresponse|${cmd}|null`);
		let data = handler.call(this, target, user, trustable);
		if (data?.then) data = await data;
		connection.send(`|queryresponse|${cmd}|${JSON.stringify(data)}`);
	},

	trn(target, room, user, connection) {
		if (target === user.name) return false;

		const [name, registeredString, token] = Utils.splitFirst(target, ',', 2);
		const registered = !!parseInt(registeredString);

		return user.rename(name, token || '', registered, connection);
	},
	trnhelp: [
		`/trn [username], [registered], [token] - Finishes a rename to the [username] with a given [token].`,
	],

	/*********************************************************
	 * Help commands
	 *********************************************************/

	commands: 'help',
	h: 'help',
	'?': 'help',
	man: 'help',
	help(target, room, user) {
		if (!this.runBroadcast()) return;
		target = target.toLowerCase().trim();
		if (target.startsWith('/') || target.startsWith('!')) target = target.slice(1);

		if (!target) {
			const broadcastMsg = this.tr`(replace / with ! to broadcast. Broadcasting requires: + % @ # ~)`;

			this.sendReply(`${this.tr`COMMANDS`}: /report, /msg, /reply, /logout, /challenge, /search, /rating, /whois, /user, /join, /leave, /userauth, /roomauth`);
			this.sendReply(`${this.tr`BATTLE ROOM COMMANDS`}: /savereplay, /hideroom, /inviteonly, /invite, /timer, /forfeit`);
			this.sendReply(`${this.tr`OPTION COMMANDS`}: /nick, /avatar, /ignore, /status, /away, /busy, /back, /timestamps, /highlight, /showjoins, /hidejoins, /blockchallenges, /blockpms`);
			this.sendReply(`${this.tr`INFORMATIONAL/RESOURCE COMMANDS`}: /groups, /faq, /rules, /intro, /formatshelp, /othermetas, /analysis, /punishments, /calc, /git, /cap, /roomhelp, /roomfaq ${broadcastMsg}`);
			this.sendReply(`${this.tr`DATA COMMANDS`}: /data, /dexsearch, /movesearch, /itemsearch, /learn, /statcalc, /effectiveness, /weakness, /coverage, /randommove, /randompokemon ${broadcastMsg}`);
			if (user.tempGroup !== Users.Auth.defaultSymbol()) {
				this.sendReply(`${this.tr`DRIVER COMMANDS`}: /warn, /mute, /hourmute, /unmute, /alts, /forcerename, /modlog, /modnote, /modchat, /lock, /weeklock, /unlock, /announce`);
				this.sendReply(`${this.tr`MODERATOR COMMANDS`}: /globalban, /unglobalban, /ip, /markshared, /unlockip`);
				this.sendReply(`${this.tr`ADMIN COMMANDS`}: /declare, /forcetie, /forcewin, /promote, /demote, /banip, /host, /ipsearch`);
			}
			this.sendReply(this.tr`For an overview of room commands, use /roomhelp`);
			this.sendReply(this.tr`For details of a specific command, use something like: /help data`);
			return;
		}

		const getHelp = (namespace: Chat.AnnotatedChatCommands, cmds: string[]): boolean => {
			const [cmd, ...subCmds] = cmds;

			if (subCmds.length) {
				// more specific help first
				const subNamespace = namespace[cmd];
				if (typeof subNamespace === 'object' && !Array.isArray(subNamespace)) {
					if (getHelp(subNamespace, subCmds)) {
						return true;
					}
				}
			}

			const curHandler = namespace[cmd] as Chat.AnnotatedChatHandler;
			let isPrivate = curHandler?.isPrivate;
			let requiredPerm = curHandler?.requiredPermission || 'lock';
			let help = namespace[`${cmd}help`];
			if (typeof help === 'string') {
				help = namespace[help];
			}
			if (!help && typeof namespace[cmd] === 'string') {
				help = namespace[`${namespace[cmd]}help`];
			}
			if (!help && namespace !== Chat.commands && namespace['help']) {
				help = namespace['help'];
			}

			const isNamespace = typeof Chat.commands[cmd] === 'object';
			if ((namespace !== Chat.commands || isNamespace) && !isPrivate) {
				if (isNamespace) namespace = Chat.commands[cmd] as Chat.AnnotatedChatCommands;
				for (const k in namespace) {
					const cur = namespace[k];
					if (typeof cur === 'function' && cur.isPrivate) {
						isPrivate = true;
						requiredPerm = (cur.requiredPermission || "lock");
					}
				}
			}

			if (isPrivate && !user.can(requiredPerm as GlobalPermission)) {
				throw new Chat.ErrorMessage(this.tr`The command '/${target}' does not exist.`);
			}

			if (typeof help === 'function') {
				// If the help command is a function, parse it instead
				this.run(help);
				return true;
			}
			if (Array.isArray(help)) {
				this.sendReply(help.map(line => this.tr(line)).join('\n'));
				return true;
			}

			if (!curHandler) {
				for (const g in Config.groups) {
					const groupid = Config.groups[g].id;
					if (new RegExp(`(global)?(un|de)?${groupid}`).test(cmd)) {
						return this.parse(`/help promote`);
					}
					if (new RegExp(`room(un|de)?${groupid}`).test(cmd)) {
						return this.parse(`/help roompromote`);
					}
				}
				throw new Chat.ErrorMessage(this.tr`The command '/${target}' does not exist.`);
			}

			if (cmd.endsWith('help')) {
				this.sendReply(this.tr`'/${target}' is a help command.`);
				return true;
			}

			return false;
		};

		if (!getHelp(Chat.commands, target.split(' '))) {
			throw new Chat.ErrorMessage(this.tr`Could not find help for '/${target}'. Try /help for general help.`);
		}
	},
	helphelp: [
		`/help OR /h OR /? - Gives you help.`,
		`/help [command] - Gives you help for a specific command.`,
	],
};

export const pages: Chat.PageTable = {
	receivedpms(query, user) {
		this.title = '[Received PMs]';
		if (!Chat.PrivateMessages.offlineIsEnabled) {
			throw new Chat.ErrorMessage(`Offline PMs are presently disabled.`);
		}
		return Chat.PrivateMessages.renderReceived(user);
	},
};

process.nextTick(() => {
	// We might want to migrate most of this to a JSON schema of command attributes.
	Chat.multiLinePattern.register(
		'>>>? ', '/(?:room|staff)intro ', '/(?:staff)?topic ', '/(?:add|widen)datacenters ', '/bash ', '!code ', '/code ', '/modnote ', '/mn ',
		'/eval', '!eval', '/evalbattle', '/evalsql', '>>sql',
		'/importinputlog '
	);
});

export const loginfilter: Chat.LoginFilter = user => {
	if (!Chat.PrivateMessages.checkCanUse(user, { isLogin: true, forceBool: true })) return;
	void Chat.PrivateMessages.sendReceived(user);
};
