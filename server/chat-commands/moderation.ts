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
import { Utils } from '../../lib';
import { type RoomSection, RoomSections } from './room-settings';

/* eslint no-else-return: "error" */

const MAX_REASON_LENGTH = 600;
const MUTE_LENGTH = 7 * 60 * 1000;
const HOURMUTE_LENGTH = 60 * 60 * 1000;
const DAY = 24 * 60 * 60 * 1000;

/** Require reasons for punishment commands */
const REQUIRE_REASONS = true;

/**
 * Promotes a user within a room. Returns a User object if a popup should be shown to the user,
 * and null otherwise. Throws a Chat.ErrorMessage on an error.
 *
 * @param promoter the User object of the user who is promoting
 * @param room the Room in which the promotion is happening
 * @param userid the ID of the user to promote
 * @param symbol the GroupSymbol to promote to
 * @param username the username of the user to promote
 * @param force whether or not to forcibly promote
 */
export function runPromote(
	promoter: User,
	room: Room,
	userid: ID,
	symbol: GroupSymbol,
	username?: string,
	force?: boolean
) {
	const targetUser = Users.getExact(userid);
	username = username || userid;
	if (!username) return;

	if (userid.length > 18) {
		throw new Chat.ErrorMessage(`User '${username}' does not exist (the username is too long).`);
	}
	if (!targetUser && !Users.isUsernameKnown(userid) && !force) {
		throw new Chat.ErrorMessage(`User '${username}' is offline and unrecognized, and so can't be promoted.`);
	}
	if (targetUser && !targetUser.registered) {
		throw new Chat.ErrorMessage(`User '${username}' is unregistered, and so can't be promoted.`);
	}

	let currentSymbol: GroupSymbol | 'whitelist' = room.auth.getDirect(userid);
	if (room.auth.has(userid) && currentSymbol === Users.Auth.defaultSymbol()) {
		currentSymbol = 'whitelist';
	}
	const currentGroup = Users.Auth.getGroup(currentSymbol);
	const currentGroupName = currentGroup.name || "regular user";

	const nextGroup = Config.groups[symbol];

	if (currentSymbol === symbol) {
		throw new Chat.ErrorMessage(`User '${username}' is already a ${nextGroup?.name || symbol || 'regular user'} in this room.`);
	}
	if (!promoter.can('makeroom')) {
		if (currentGroup.id && !promoter.can(`room${currentGroup.id || 'voice'}` as 'roomvoice', null, room)) {
			throw new Chat.ErrorMessage(`Access denied for promoting/demoting ${username} from ${currentGroupName}.`);
		}
		if (symbol !== ' ' && !promoter.can(`room${nextGroup.id || 'voice'}` as 'roomvoice', null, room)) {
			throw new Chat.ErrorMessage(`Access denied for promoting/demoting ${username} to ${nextGroup.name}.`);
		}
	}
	if (targetUser?.locked && room.persist && room.settings.isPrivate !== true && nextGroup.rank > 2) {
		throw new Chat.ErrorMessage(`${username} is locked and can't be promoted.`);
	}

	if (symbol === Users.Auth.defaultSymbol()) {
		room.auth.delete(userid);
	} else {
		room.auth.set(userid, symbol);
	}

	if (targetUser) {
		targetUser.updateIdentity(room.roomid);
		if (room.subRooms) {
			for (const subRoom of room.subRooms.values()) {
				targetUser.updateIdentity(subRoom.roomid);
			}
		}
	}

	// Only show popup if: user is online and in the room, the room is public, and not a groupchat or a battle.
	if (targetUser && room.users[targetUser.id] && room.persist && room.settings.isPrivate !== true) {
		return targetUser;
	}
	return null;
}

export function runCrisisDemote(userid: ID) {
	const from = [];
	const section = Users.globalAuth.sectionLeaders.get(userid);
	if (section) {
		from.push(`Section Leader (${RoomSections.sectionNames[section] || section})`);
		Users.globalAuth.deleteSection(userid);
	}
	const globalGroup = Users.globalAuth.get(userid);
	if (globalGroup && globalGroup !== ' ') {
		from.push(globalGroup);
		Users.globalAuth.delete(userid);
	}
	for (const room of Rooms.global.chatRooms) {
		if (!room.settings.isPrivate && room.auth.isStaff(userid)) {
			let oldGroup: string = room.auth.getDirect(userid);
			if (oldGroup === ' ') {
				oldGroup = 'whitelist in ';
			} else {
				room.auth.set(userid, '+');
			}
			from.push(`${oldGroup}${room.roomid}`);
		}
	}
	return from;
}

Punishments.addPunishmentType({
	type: 'YEARLOCK',
	desc: "Locked for a year",
	onActivate: (user, punishment) => {
		user.locked = user.id;
		Chat.punishmentfilter(user, punishment);
	},
});

export const commands: Chat.ChatCommands = {
	roomowner(target, room, user) {
		room = this.requireRoom();
		if (!room.persist) {
			return this.sendReply("/roomowner - This room isn't designed for per-room moderation to be added");
		}
		if (!target) return this.parse('/help roomowner');
		const { targetUser, targetUsername, rest } = this.splitUser(target, { exactName: true });
		if (rest) return this.errorReply(`This command does not support specifying a reason.`);
		const userid = toID(targetUsername);

		if (!Users.isUsernameKnown(userid)) {
			return this.errorReply(`User '${targetUsername}' is offline and unrecognized, and so can't be promoted.`);
		}

		this.checkCan('makeroom');
		if (room.auth.getDirect(userid) === '#') return this.errorReply(`${targetUsername} is already a room owner.`);

		room.auth.set(userid, '#');
		const message = `${targetUsername} was appointed Room Owner by ${user.name}.`;
		if (room.settings.isPrivate === true) {
			this.addModAction(message);
			Rooms.get(`upperstaff`)?.addByUser(user, `<<${room.roomid}>> ${message}`).update();
		} else {
			this.addGlobalModAction(message);
		}
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
		room.saveSettings();
	},
	roomownerhelp: [`/roomowner [username] - Appoints [username] as a room owner. Requires: ~`],

	roomdemote: 'roompromote',
	forceroompromote: 'roompromote',
	forceroomdemote: 'roompromote',
	roompromote(target, room, user, connection, cmd) {
		if (!room) {
			// this command isn't marked as room-only because it's usable in PMs through /invite
			return this.errorReply("This command is only available in rooms");
		}
		this.checkChat();
		if (!target) return this.parse('/help roompromote');

		const force = cmd.startsWith('force');
		const users = target.split(',').map(part => part.trim());
		let nextSymbol = users.pop() as GroupSymbol | 'deauth';
		if (nextSymbol === 'deauth') nextSymbol = Users.Auth.defaultSymbol();
		const nextGroup = Users.Auth.getGroup(nextSymbol);

		if (!nextSymbol) {
			return this.errorReply("Please specify a group such as /roomvoice or /roomdeauth");
		}
		if (!Config.groups[nextSymbol]) {
			if (!force || !user.can('bypassall')) {
				this.errorReply(`Group '${nextSymbol}' does not exist.`);
				if (user.can('bypassall')) {
					this.errorReply(`If you want to promote to a nonexistent group, use /forceroompromote`);
				}
				return;
			} else if (!Users.Auth.isValidSymbol(nextSymbol)) {
				// yes I know this excludes astral-plane characters and includes combining characters
				return this.errorReply(`Admins can forcepromote to nonexistent groups only if they are one character long`);
			}
		}

		if (!force && (nextGroup.globalonly || (nextGroup.battleonly && !room.battle))) {
			return this.errorReply(`Group 'room${nextGroup.id || nextSymbol}' does not exist as a room rank.`);
		}
		const nextGroupName = nextGroup.name || "regular user";

		for (const toPromote of users) {
			const userid = toID(toPromote);
			if (!userid) return this.parse('/help roompromote');

			// weird ts bug (?) - 7022
			// it implicitly is 'any' because it has no annotation and is "is referenced directly or indirectly in its own initializer."
			// dunno why this happens, but for now we can just cast over it.
			const oldSymbol: GroupSymbol = room.auth.getDirect(userid);
			let shouldPopup;
			try {
				shouldPopup = runPromote(user, room, userid, nextSymbol, toPromote, force);
			} catch (err: any) {
				if (err.name?.endsWith('ErrorMessage')) {
					this.errorReply(err.message);
					continue;
				}
				throw err;
			}
			const targetUser = Users.getExact(userid);
			const name = targetUser?.name || toPromote;

			if (this.pmTarget && targetUser) {
				const text = `${targetUser.name} was invited (and promoted to Room ${nextGroupName}) by ${user.name}.`;
				room.add(`|c|${user.getIdentity(room)}|/log ${text}`).update();
				this.modlog('INVITE', targetUser, null, { noip: 1, noalts: 1 });
			} else if (
				nextSymbol in Config.groups && oldSymbol in Config.groups &&
				nextGroup.rank < Config.groups[oldSymbol].rank
			) {
				if (targetUser && room.users[targetUser.id] && !nextGroup.modlog) {
					// if the user can't see the demotion message (i.e. rank < %), it is shown in the chat
					targetUser.send(`>${room.roomid}\n(You were demoted to Room ${nextGroupName} by ${user.name}.)`);
				}
				this.privateModAction(`${name} was demoted to Room ${nextGroupName} by ${user.name}.`);
				this.modlog(`ROOM${nextGroupName.toUpperCase()}`, userid, '(demote)');
				shouldPopup?.popup(`You were demoted to Room ${nextGroupName} by ${user.name} in ${room.roomid}.`);
			} else if (nextSymbol === '#') {
				this.addModAction(`${name} was promoted to ${nextGroupName} by ${user.name}.`);
				const logRoom = Rooms.get(room.settings.isPrivate === true ? 'upperstaff' : 'staff');
				logRoom?.addByUser(user, `<<${room.roomid}>> ${name} was appointed Room Owner by ${user.name}`);
				this.modlog('ROOM OWNER', userid);
				shouldPopup?.popup(`You were promoted to ${nextGroupName} by ${user.name} in ${room.roomid}.`);
			} else {
				this.addModAction(`${name} was promoted to Room ${nextGroupName} by ${user.name}.`);
				this.modlog(`ROOM${nextGroupName.toUpperCase()}`, userid);
				shouldPopup?.popup(`You were promoted to Room ${nextGroupName} by ${user.name} in ${room.roomid}.`);
			}

			if (targetUser) {
				targetUser.updateIdentity(room.roomid);
				if (room.subRooms) {
					for (const subRoom of room.subRooms.values()) {
						targetUser.updateIdentity(subRoom.roomid);
					}
				}
				if (targetUser.trusted && !Users.isTrusted(targetUser.id)) {
					targetUser.trusted = '';
				}
			}
		}
		room.saveSettings();
	},
	roompromotehelp: [
		`/roompromote OR /roomdemote [comma-separated usernames], [group symbol] - Promotes/demotes the user(s) to the specified room rank. Requires: @ # ~`,
		`/room[group] [comma-separated usernames] - Promotes/demotes the user(s) to the specified room rank. Requires: @ # ~`,
		`/roomdeauth [comma-separated usernames] - Removes all room rank from the user(s). Requires: @ # ~`,
	],

	auth: 'authority',
	stafflist: 'authority',
	globalauth: 'authority',
	authlist: 'authority',
	authority(target, room, user, connection) {
		if (target && target !== '+') {
			const targetRoom = Rooms.search(target);
			const availableRoom = targetRoom?.checkModjoin(user);
			if (targetRoom && availableRoom) return this.parse(`/roomauth1 ${target}`);
			return this.parse(`/userauth ${target}`);
		}
		const showAll = !!target;
		const rankLists: { [k: string]: string[] } = {};
		for (const [id, symbol] of Users.globalAuth) {
			if (symbol === ' ' || (symbol === '+' && !showAll)) continue;
			if (!rankLists[symbol]) rankLists[symbol] = [];
			rankLists[symbol].push(Users.globalAuth.usernames.get(id) || id);
		}

		const buffer = Utils.sortBy(
			Object.entries(rankLists) as [GroupSymbol, string[]][],
			([symbol]) => -Users.Auth.getGroup(symbol).rank
		).map(
			([symbol, names]) => (
				`${(Config.groups[symbol] ? `**${Config.groups[symbol].name}s** (${symbol})` : symbol)}:\n` +
				Utils.sortBy(names, name => toID(name)).join(", ")
			)
		);
		if (!showAll) buffer.push(`(Use \`\`/auth +\`\` to show global voice users.)`);

		if (!buffer.length) return connection.popup("This server has no global authority.");
		connection.popup(buffer.join("\n\n"));
	},
	authhelp: [
		`/auth - Show global staff for the server.`,
		`/auth + - Show global staff for the server, including voices.`,
		`/auth [room] - Show what roomauth a room has.`,
		`/auth [user] - Show what global and roomauth a user has.`,
	],

	roomstaff: 'roomauth',
	roomauth1: 'roomauth',
	roomauth(target, room, user, connection, cmd) {
		let userLookup = '';
		if (cmd === 'roomauth1') userLookup = `\n\nTo look up auth for a user, use /userauth ${target}`;
		let targetRoom = room;
		if (target) targetRoom = Rooms.search(target)!;
		if (!targetRoom?.checkModjoin(user)) {
			return this.errorReply(`The room "${target}" does not exist.`);
		}
		const showAll = user.can('mute', null, targetRoom);

		const rankLists: { [groupSymbol: string]: ID[] } = {};
		for (const [id, rank] of targetRoom.auth) {
			if (rank === ' ' && !showAll) continue;
			if (!rankLists[rank]) rankLists[rank] = [];
			rankLists[rank].push(id);
		}

		const buffer = Utils.sortBy(
			Object.entries(rankLists) as [GroupSymbol, ID[]][],
			([symbol]) => -Users.Auth.getGroup(symbol).rank
		).map(([symbol, names]) => {
			let group = Config.groups[symbol] ? `${Config.groups[symbol].name}s (${symbol})` : symbol;
			if (symbol === ' ') group = 'Whitelisted (this list is only visible to staff)';
			return `${group}:\n` +
				Utils.sortBy(names).map(userid => {
					const isOnline = Users.get(userid)?.statusType === 'online';
					// targetRoom guaranteed to exist above
					return userid in targetRoom.users && isOnline ? `**${userid}**` : userid;
				}).join(', ');
		});

		let curRoom = targetRoom;
		while (curRoom.parent) {
			const modjoinSetting = curRoom.settings.modjoin === true ? curRoom.settings.modchat : curRoom.settings.modjoin;
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
		if (!curRoom.settings.isPrivate) {
			buffer.push(`${curRoom.title} is a public room, so global auth with no relevant roomauth will have authority in this room.`);
		} else if (curRoom.settings.isPrivate === 'hidden' || curRoom.settings.isPrivate === 'voice') {
			buffer.push(`${curRoom.title} is a hidden room, so global auth with no relevant roomauth will have authority in this room.`);
		}
		buffer.push(`Names in **bold** are online.`);
		if (targetRoom !== room) buffer.unshift(`${targetRoom.title} room auth:`);
		connection.popup(`${buffer.join("\n\n")}${userLookup}`);
	},
	roomauthhelp: [
		`/roomauth [room] - Shows a list of the staff and authority in the given [room].`,
		`If no room is given, it defaults to the current room.`,
	],

	userauth(target, room, user, connection) {
		const targetId = toID(target) || user.id;
		const targetUser = Users.getExact(targetId);
		const targetUsername = targetUser?.name || target;

		const buffer = [];
		let innerBuffer = [];
		const group = Users.globalAuth.get(targetId);
		if (group !== ' ' || Users.isTrusted(targetId)) {
			buffer.push(`Global auth: ${group === ' ' ? 'trusted' : group}`);
		}
		const sectionLeader = Users.globalAuth.sectionLeaders.get(targetId);
		if (sectionLeader) {
			buffer.push(`Section leader: ${RoomSections.sectionNames[sectionLeader]}`);
		}
		for (const curRoom of Rooms.rooms.values()) {
			if (curRoom.settings.isPrivate) continue;
			if (!curRoom.auth.has(targetId)) continue;
			innerBuffer.push(curRoom.auth.getDirect(targetId).trim() + curRoom.roomid);
		}
		if (innerBuffer.length) {
			buffer.push(`Room auth: ${innerBuffer.join(', ')}`);
		}
		if (targetId === user.id || user.can('lock')) {
			innerBuffer = [];
			for (const curRoom of Rooms.rooms.values()) {
				if (!curRoom.settings.isPrivate) continue;
				if (curRoom.settings.isPrivate === true) continue;
				if (!curRoom.auth.has(targetId)) continue;
				innerBuffer.push(curRoom.auth.getDirect(targetId).trim() + curRoom.roomid);
			}
			if (innerBuffer.length) {
				buffer.push(`Hidden room auth: ${innerBuffer.join(', ')}`);
			}
		}
		if (targetId === user.id || user.can('makeroom')) {
			innerBuffer = [];
			for (const chatRoom of Rooms.global.chatRooms) {
				if (!chatRoom.settings.isPrivate) continue;
				if (chatRoom.settings.isPrivate !== true) continue;
				if (!chatRoom.auth.has(targetId)) continue;
				innerBuffer.push(chatRoom.auth.getDirect(targetId).trim() + chatRoom.roomid);
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
	userauthhelp: [
		`/userauth [username] - Shows all authority visible to the user for the given [username].`,
		`If no username is given, it defaults to the current user.`,
	],

	sectionleaders(target, room, user, connection) {
		const usernames = Users.globalAuth.usernames;
		const buffer = [];
		const sections: { [k in RoomSection]: Set<string> } = Object.create(null);
		for (const [id, username] of usernames) {
			const sectionid = Users.globalAuth.sectionLeaders.get(id);
			if (!sectionid) continue;
			if (!sections[sectionid]) sections[sectionid] = new Set();
			sections[sectionid].add(username);
		}
		let sectionid: RoomSection;
		for (sectionid in sections) {
			if (!sections[sectionid].size) continue;
			buffer.push(`**${RoomSections.sectionNames[sectionid]}**:\n` + Utils.sortBy([...sections[sectionid]]).join(', '));
		}
		if (!buffer.length) throw new Chat.ErrorMessage(`There are no Section Leaders currently.`);
		connection.popup(buffer.join(`\n\n`));
	},
	sectionleadershelp: [
		`/sectionleaders - Shows the current room sections and their section leaders.`,
	],

	async autojoin(target, room, user, connection) {
		const targets = target.split(',').filter(Boolean);
		if (targets.length > 16 || connection.inRooms.size > 1) {
			return connection.popup("To prevent DoS attacks, you can only use /autojoin for 16 or fewer rooms, when you haven't joined any rooms yet. Please use /join for each room separately.");
		}
		Rooms.global.autojoinRooms(user, connection);
		const autojoins: string[] = [];

		const promises = targets.map(
			roomid => user.tryJoinRoom(roomid as RoomID, connection).then(ret => {
				if (ret === Rooms.RETRY_AFTER_LOGIN) {
					autojoins.push(roomid);
				}
			})
		);

		await Promise.all(promises);
		// eslint-disable-next-line require-atomic-updates
		connection.autojoins = autojoins.join(',');
	},
	autojoinhelp: [`/autojoin [rooms] - Automatically joins all the given rooms.`],

	joim: 'join',
	j: 'join',
	async join(target, room, user, connection) {
		target = target.trim();
		if (!target) return this.parse('/help join');
		if (target.startsWith('http://')) target = target.slice(7);
		if (target.startsWith('https://')) target = target.slice(8);
		if (target.startsWith(`${Config.routes.client}/`)) target = target.slice(Config.routes.client.length + 1);
		if (target.startsWith(`${Config.routes.replays}/`)) target = `battle-${target.slice(Config.routes.replays.length + 1)}`;
		if (target.startsWith('psim.us/')) target = target.slice(8);
		// isn't in tryJoinRoom so you can still join your own battles / gameRooms etc
		const numRooms = [...Rooms.rooms.values()].filter(r => user.id in r.users).length;
		if (!user.can('altsself') && !target.startsWith('view-') && numRooms >= 50) {
			return connection.sendTo(target as RoomID, `|noinit||You can only join 50 rooms at a time.`);
		}
		const ret = await user.tryJoinRoom(target as RoomID, connection);
		if (ret === Rooms.RETRY_AFTER_LOGIN) {
			connection.sendTo(
				target as RoomID,
				`|noinit|namerequired|The room '${target}' does not exist or requires a login to join.`
			);
		}
	},
	joinhelp: [`/join [roomname] - Attempt to join the room [roomname].`],

	leave: 'part',
	part(target, room, user, connection) {
		const targetRoom = target ? Rooms.search(target) : room;
		if (!targetRoom) {
			if (target.startsWith('view-')) {
				connection.openPages?.delete(target.slice(5));
				if (!connection.openPages?.size) connection.openPages = null;
				Chat.handleRoomClose(target as RoomID, user, connection);
				return;
			}
			return this.errorReply(`The room '${target}' does not exist.`);
		}
		Chat.handleRoomClose(targetRoom.roomid, user, connection);
		user.leaveRoom(targetRoom, connection);
	},
	leavehelp: [`/leave - Leave the current room, or a given room.`],

	/*********************************************************
	 * Moderating: Punishments
	 *********************************************************/

	kick: 'warn',
	k: 'warn',
	warn(target, room, user) {
		if (!target) return this.parse('/help warn');
		this.checkChat();
		if (room?.settings.isPersonal && !user.can('warn' as any)) {
			return this.errorReply("Warning is unavailable in group chats.");
		}
		// If used in pms, staff, help tickets or battles, log the warn to the global modlog.
		const globalWarn = (
			!room || ['staff', 'adminlog'].includes(room.roomid) ||
			room.roomid.startsWith('help-') || (room.battle && (!room.parent || room.parent.type !== 'chat'))
		);

		const { targetUser, inputUsername, targetUsername, rest: reason } = this.splitUser(target);
		const targetID = toID(targetUsername);
		const { privateReason, publicReason } = this.parseSpoiler(reason);

		const saveReplay = globalWarn && room?.battle;
		if (!targetUser?.connected) {
			if (!globalWarn) return this.errorReply(`User '${targetUsername}' not found.`);
			if (room) {
				this.checkCan('warn', null, room);
			} else {
				this.checkCan('lock');
			}

			this.addGlobalModAction(
				`${targetID} was warned by ${user.name} while offline.${publicReason ? ` (${publicReason})` : ``}`
			);
			this.globalModlog('WARN OFFLINE', targetUser || targetID, privateReason);
			Punishments.offlineWarns.set(targetID, publicReason);
			if (saveReplay) this.parse('/savereplay forpunishment');
			return;
		}
		if (!globalWarn && !(targetUser.id in room.users)) {
			return this.errorReply(`User ${targetUsername} is not in the room ${room.roomid}.`);
		}
		if (publicReason.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		if (room) {
			this.checkCan('warn', targetUser, room);
		} else {
			this.checkCan('lock', targetUser);
		}
		if (targetUser.can('makeroom')) return this.errorReply("You are not allowed to warn upper staff members.");

		const now = Date.now();
		const timeout = now - targetUser.lastWarnedAt;
		if (timeout < 15 * 1000) {
			const remainder = (15 - (timeout / 1000)).toFixed(2);
			return this.errorReply(`You must wait ${remainder} more seconds before you can warn ${targetUser.name} again.`);
		}

		const logMessage = `${targetUser.name} was warned by ${user.name}.${(publicReason ? ` (${publicReason})` : ``)}`;
		if (globalWarn) {
			this.addGlobalModAction(logMessage);
			this.globalModlog('WARN', targetUser, privateReason);
		} else {
			this.addModAction(logMessage);
			this.modlog('WARN', targetUser, privateReason, { noalts: 1 });
		}
		targetUser.send(`|c|~|/warn ${publicReason}`);

		const userid = targetUser.getLastId();

		if (room) {
			this.add(`|hidelines|unlink|${userid}`);
			if (userid !== toID(inputUsername)) this.add(`|hidelines|unlink|${toID(inputUsername)}`);
		}

		targetUser.lastWarnedAt = now;

		// Automatically upload replays as evidence/reference to the punishment
		if (saveReplay) this.parse('/savereplay forpunishment');
		return true;
	},
	warnhelp: [
		`/warn OR /k [username], [reason] - Warns a user showing them the site rules and [reason] in an overlay.`,
		`/warn OR /k [username], [reason] spoiler: [private reason] - Warns a user, marking [private reason] only in the modlog.`,
		`Requires: % @ # ~`,
	],

	redirect: 'redir',
	redir(target, room, user, connection) {
		room = this.requireRoom();
		if (!target) return this.parse('/help redirect');
		if (room.settings.isPrivate || room.settings.isPersonal) {
			return this.errorReply("Users cannot be redirected from private or personal rooms.");
		}
		const { targetUser, targetUsername, rest: targetRoomid } = this.splitUser(target);
		const targetRoom = Rooms.search(targetRoomid);
		if (!targetRoom || targetRoom.settings.modjoin || targetRoom.settings.staffRoom) {
			return this.errorReply(`The room "${targetRoomid}" does not exist.`);
		}
		this.checkCan('warn', targetUser, room);
		this.checkCan('warn', targetUser, targetRoom);

		if (!user.can('rangeban', targetUser)) {
			this.errorReply(`Redirects have been deprecated. Instead of /redirect, use <<room links>> or /invite to guide users to the correct room, and punish if users don't cooperate.`);
			return;
		}

		if (!targetUser?.connected) {
			return this.errorReply(`User ${targetUsername} not found.`);
		}
		if (targetRoom.roomid === "global") return this.errorReply(`Users cannot be redirected to the global room.`);
		if (targetRoom.settings.isPrivate || targetRoom.settings.isPersonal) {
			return this.errorReply(`The room "${targetRoom.title}" is not public.`);
		}
		if (targetUser.inRooms.has(targetRoom.roomid)) {
			return this.errorReply(`User ${targetUser.name} is already in the room ${targetRoom.title}!`);
		}
		if (!targetUser.inRooms.has(room.roomid)) {
			return this.errorReply(`User ${targetUsername} is not in the room ${room.roomid}.`);
		}
		targetUser.leaveRoom(room.roomid);
		targetUser.popup(`You are in the wrong room; please go to <<${targetRoom.roomid}>> instead`);
		this.addModAction(`${targetUser.name} was redirected to room ${targetRoom.title} by ${user.name}.`);
		this.modlog('REDIRECT', targetUser, `to ${targetRoom.title}`, { noip: 1, noalts: 1 });
		targetUser.leaveRoom(room);
	},
	redirhelp: [
		`/redirect OR /redir [username], [roomname] - [DEPRECATED]`,
		`Attempts to redirect the [username] to the [roomname]. Requires: ~`,
	],

	m: 'mute',
	mute(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!target) return this.parse('/help mute');
		this.checkChat();

		const { targetUser, inputUsername, targetUsername, rest: reason } = this.splitUser(target);
		if (!targetUser) return this.errorReply(`User '${targetUsername}' not found.`);
		if (reason.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		const { publicReason, privateReason } = this.parseSpoiler(reason);

		const muteDuration = ((cmd === 'hm' || cmd === 'hourmute') ? HOURMUTE_LENGTH : MUTE_LENGTH);
		this.checkCan('mute', targetUser, room);
		if (targetUser.can('makeroom')) return this.errorReply("You are not allowed to mute upper staff members.");
		const canBeMutedFurther = ((room.getMuteTime(targetUser) || 0) <= (muteDuration * 5 / 6));
		if (targetUser.locked ||
			(room.isMuted(targetUser) && !canBeMutedFurther) ||
			Punishments.isRoomBanned(targetUser, room.roomid)) {
			const alreadyPunishment = targetUser.locked ? "locked" : room.isMuted(targetUser) ? "muted" : "room banned";
			const problem = ` but was already ${alreadyPunishment}`;
			if (!reason) {
				return this.privateModAction(`${targetUser.name} would be muted by ${user.name} ${problem}.`);
			}
			return this.addModAction(`${targetUser.name} would be muted by ${user.name} ${problem}. (${publicReason})`);
		}

		if (targetUser.id in room.users) {
			targetUser.popup(`|modal|${user.name} has muted you in ${room.roomid} for ${Chat.toDurationString(muteDuration)}. ${publicReason}`);
		}
		this.addModAction(`${targetUser.name} was muted by ${user.name} for ${Chat.toDurationString(muteDuration)}.${(publicReason ? ` (${publicReason})` : ``)}`);
		this.modlog(`${cmd.includes('h') ? 'HOUR' : ''}MUTE`, targetUser, privateReason);
		this.update(); // force an update so the (hide lines from x user) message is on the mod action above

		const ids = [targetUser.getLastId()];
		if (ids[0] !== toID(inputUsername)) {
			ids.push(toID(inputUsername));
		}
		room.hideText(ids);

		if (targetUser.autoconfirmed && targetUser.autoconfirmed !== targetUser.id) {
			const displayMessage = `${targetUser.name}'s ac account: ${targetUser.autoconfirmed}`;
			this.privateModAction(displayMessage);
		}

		Chat.runHandlers('onPunishUser', 'MUTE', user, room);
		room.mute(targetUser, muteDuration);
	},
	mutehelp: [`/mute OR /m [username], [reason] - Mutes a user with reason for 7 minutes. Requires: % @ # ~`],

	hm: 'hourmute',
	hourmute(target) {
		if (!target) return this.parse('/help hourmute');
		this.run('mute');
	},
	hourmutehelp: [`/hourmute OR /hm [username], [reason] - Mutes a user with reason for an hour. Requires: % @ # ~`],

	um: 'unmute',
	unmute(target, room, user) {
		room = this.requireRoom();
		if (!target) return this.parse('/help unmute');
		const { targetUser, targetUsername, rest } = this.splitUser(target);
		if (rest) return this.errorReply(`This command does not support specifying a reason.`);
		this.checkChat();
		this.checkCan('mute', null, room);

		const successfullyUnmuted = room.unmute(
			targetUser?.id || toID(targetUsername), `Your mute in '${room.title}' has been lifted.`
		);

		if (successfullyUnmuted) {
			this.addModAction(`${(targetUser ? targetUser.name : successfullyUnmuted)} was unmuted by ${user.name}.`);
			this.modlog('UNMUTE', (targetUser || successfullyUnmuted), null, { noip: 1, noalts: 1 });
		} else {
			this.errorReply(`${(targetUser ? targetUser.name : targetUsername)} is not muted.`);
		}
	},
	unmutehelp: [`/unmute [username] - Removes mute from user. Requires: % @ # ~`],

	rb: 'ban',
	weekban: 'ban',
	wb: 'ban',
	wrb: 'ban',
	forceroomban: 'ban',
	forceweekban: 'ban',
	weekroomban: 'ban',
	forcerb: 'ban',
	roomban: 'ban',
	b: 'ban',
	ban(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!target) return this.parse('/help ban');
		this.checkChat();
		const week = ['wrb', 'wb'].includes(cmd) || cmd.includes('week');

		const { targetUser, inputUsername, targetUsername, rest: reason } = this.splitUser(target);
		const { publicReason, privateReason } = this.parseSpoiler(reason);
		if (!targetUser) return this.errorReply(`User '${targetUsername}' not found.`);
		if (reason.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		this.checkCan('ban', targetUser, room);
		if (targetUser.can('makeroom')) return this.errorReply("You are not allowed to ban upper staff members.");
		if (Punishments.hasRoomPunishType(room, toID(targetUsername), 'BLACKLIST')) {
			return this.errorReply(`This user is already blacklisted from ${room.roomid}.`);
		}
		const name = targetUser.getLastName();
		const userid = targetUser.getLastId();
		const force = cmd.startsWith('force');
		if (targetUser.trusted) {
			if (!force) {
				return this.sendReply(
					`${name} is a trusted user. If you are sure you would like to ban them, use /force${week ? 'week' : 'room'}ban.`
				);
			}
		} else if (force) {
			return this.errorReply(`Use /${week ? 'week' : 'room'}ban; ${name} is not a trusted user.`);
		}
		if (!reason && !week && Punishments.isRoomBanned(targetUser, room.roomid)) {
			const problem = " but was already banned";
			return this.privateModAction(`${name} would be banned by ${user.name} ${problem}.`);
		}

		if (targetUser.trusted && room.settings.isPrivate !== true && !room.settings.isPersonal) {
			Monitor.log(`[CrisisMonitor] Trusted user ${targetUser.name} ${(targetUser.trusted !== targetUser.id ? ` (${targetUser.trusted})` : ``)} was roombanned from ${room.roomid} by ${user.name}, and should probably be demoted.`);
		}

		if (targetUser.id in room.users || user.can('lock')) {
			targetUser.popup(
				`|modal||html|<p>${Utils.escapeHTML(user.name)} has banned you from the room ${room.roomid} ` +
				`${(room.subRooms ? ` and its subrooms` : ``)}${week ? ' for a week' : ''}.` +
				`</p>${(publicReason ? `<p>Reason: ${Utils.escapeHTML(publicReason)}</p>` : ``)}` +
				`<p>To appeal the ban, PM the staff member that banned you${room.persist ? ` or a room owner. ` +
				`</p><p><button name="send" value="/roomauth ${room.roomid}">List Room Staff</button></p>` : `.</p>`}`
			);
		}

		this.addModAction(`${name} was banned${week ? ' for a week' : ''} from ${room.title} by ${user.name}.${publicReason ? ` (${publicReason})` : ``}`);

		const time = week ? Date.now() + 7 * 24 * 60 * 60 * 1000 : null;
		const affected = Punishments.roomBan(room, targetUser, time, null, privateReason);

		for (const u of affected) Chat.runHandlers('onPunishUser', 'ROOMBAN', u, room);
		if (!room.settings.isPrivate && room.persist) {
			const acAccount = (targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
			let displayMessage = '';
			if (affected.length > 1) {
				displayMessage = `${name}'s ${(acAccount ? ` ac account: ${acAccount}, ` : ``)} banned alts: ${affected.slice(1).map(curUser => curUser.getLastName()).join(", ")}`;
				this.privateModAction(displayMessage);
			} else if (acAccount) {
				displayMessage = `${name}'s ac account: ${acAccount}`;
				this.privateModAction(displayMessage);
			}
		}
		room.hideText([
			...affected.map(u => u.id),
			toID(inputUsername),
		]);

		if (room.settings.isPrivate !== true && room.persist) {
			this.globalModlog(`${week ? 'WEEK' : ''}ROOMBAN`, targetUser, privateReason);
		} else {
			this.modlog(`${week ? 'WEEK' : ''}ROOMBAN`, targetUser, privateReason);
		}
		return true;
	},
	banhelp: [
		`/ban [username], [reason] - Bans the user from the room you are in. Requires: @ # ~`,
		`/weekban [username], [reason] - Bans the user from the room you are in for a week. Requires: @ # ~`,
	],

	unroomban: 'unban',
	roomunban: 'unban',
	unban(target, room, user, connection) {
		room = this.requireRoom();
		if (!target) return this.parse('/help unban');
		this.checkCan('ban', null, room);

		const name = Punishments.roomUnban(room, target);

		if (name) {
			this.addModAction(`${name} was unbanned from ${room.title} by ${user.name}.`);
			if (room.settings.isPrivate !== true && room.persist) {
				this.globalModlog("UNROOMBAN", name);
			}
		} else {
			this.errorReply(`User '${target}' is not banned from this room.`);
		}
	},
	unbanhelp: [`/unban [username] - Unbans the user from the room you are in. Requires: @ # ~`],

	forcelock: 'lock',
	forceweeklock: 'lock',
	forcemonthlock: 'lock',
	l: 'lock',
	ipmute: 'lock',
	wl: 'lock',
	weeklock: 'lock',
	monthlock: 'lock',
	async lock(target, room, user, connection, cmd) {
		const week = cmd === 'wl' || cmd.includes('week');
		const month = cmd.includes('month');
		const force = cmd.includes('force');

		if (!target) {
			if (week) return this.parse('/help weeklock');
			return this.parse('/help lock');
		}

		const { targetUser, inputUsername, targetUsername, rest: reason } = this.splitUser(target);
		let userid: ID = toID(targetUsername);

		if (!targetUser && !Punishments.search(userid).length && !force) {
			return this.errorReply(
				`User '${targetUsername}' not found. Use \`\`/force${month ? 'month' : (week ? 'week' : '')}lock\`\` if you need to to lock them anyway.`
			);
		}
		if (reason.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		this.checkCan('lock', userid);
		if (month) this.checkCan('rangeban');

		let name;

		if (targetUser) {
			name = targetUser.getLastName();
			userid = targetUser.getLastId();

			if (targetUser.locked && !targetUser.locked.startsWith('#') && !week && !month) {
				return this.privateModAction(`${name} would be locked by ${user.name} but was already locked.`);
			}
		} else {
			name = targetUsername;
			userid = toID(targetUsername);
		}

		if (Users.isTrusted(userid)) {
			if (force) {
				const from = runCrisisDemote(userid);
				Monitor.log(`[CrisisMonitor] ${name} was locked by ${user.name} and demoted from ${from.join(", ")}.`);
				this.globalModlog("CRISISDEMOTE", targetUser, ` from ${from.join(", ")}`);
			} else {
				return this.sendReply(`${name} is a trusted user. If you are sure you would like to lock them use /force${month ? 'month' : (week ? 'week' : '')}lock.`);
			}
		} else if (force && targetUser) {
			return this.errorReply(`Use /lock; ${name} is not a trusted user and is online.`);
		}

		const { privateReason, publicReason } = this.parseSpoiler(reason);

		// Use default time for locks.
		const duration = week ? Date.now() + 7 * 24 * 60 * 60 * 1000 : (month ? Date.now() + 30 * 24 * 60 * 60 * 1000 : null);
		let affected = [];

		if (targetUser) {
			const ignoreAlts = Punishments.isSharedIp(targetUser.latestIp);
			affected = await Punishments.lock(targetUser, duration, null, ignoreAlts, publicReason);
		} else {
			affected = await Punishments.lock(userid, duration, null, false, publicReason);
		}

		for (const u of affected) Chat.runHandlers('onPunishUser', 'LOCK', u, room);
		this.globalModlog(
			(force ? `FORCE` : ``) + (week ? "WEEKLOCK" : (month ? "MONTHLOCK" : "LOCK")), targetUser || userid, privateReason
		);

		const durationMsg = week ? ' for a week' : (month ? ' for a month' : '');
		this.addGlobalModAction(`${name} was locked from talking${durationMsg} by ${user.name}.` + (publicReason ? ` (${publicReason})` : ""));

		if (room && !room.settings.isHelp) {
			room.hideText([
				...affected.map(u => u.id),
				toID(inputUsername),
			]);
		}

		const acAccount = (targetUser && targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
		let displayMessage = '';
		if (affected.length > 1) {
			displayMessage = `${name}'s ${(acAccount ? ` ac account: ${acAccount}, ` : "")} locked alts: ${affected.slice(1).map((curUser: User) => curUser.getLastName()).join(", ")}`;
			this.privateModAction(displayMessage);
		} else if (acAccount) {
			displayMessage = `${name}'s ac account: ${acAccount}`;
			this.privateModAction(displayMessage);
		}

		if (targetUser) {
			let message = `|popup||html|${user.name} has locked you from talking in chats, battles, and PMing regular users${durationMsg}`;
			if (publicReason) message += `\n\nReason: ${publicReason}`;

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
			if (roomauth.length) {
				Monitor.log(`[CrisisMonitor] Locked user ${name} has public roomauth (${roomauth.join(', ')}), and should probably be demoted.`);
			}
		}

		// Automatically upload replays as evidence/reference to the punishment
		if (room?.battle) this.parse('/savereplay forpunishment');
		return true;
	},
	lockhelp: [
		`/lock OR /l [username], [reason] - Locks the user from talking in all chats. Requires: % @ ~`,
		`/weeklock OR /wl [username], [reason] - Same as /lock, but locks users for a week.`,
		`/lock OR /l [username], [reason] spoiler: [private reason] - Marks [private reason] in modlog only.`,
	],

	unlock(target, room, user) {
		if (!target) return this.parse('/help unlock');
		this.checkCan('lock');

		const targetUser = Users.get(target);
		if (targetUser?.namelocked) {
			return this.errorReply(`User ${targetUser.name} is namelocked, not locked. Use /unnamelock to unnamelock them.`);
		}
		let reason = '';
		if (targetUser?.locked && targetUser.locked.startsWith('#')) {
			reason = ` (${targetUser.locked})`;
		}

		const unlocked = Punishments.unlock(target);

		if (unlocked) {
			this.addGlobalModAction(`${unlocked.join(", ")} ${((unlocked.length > 1) ? "were" : "was")} unlocked by ${user.name}.${reason}`);
			if (!reason) this.globalModlog("UNLOCK", toID(target));
			if (targetUser) targetUser.popup(`${user.name} has unlocked you.`);
		} else {
			this.errorReply(`User '${target}' is not locked.`);
		}
	},
	unlockname(target, room, user) {
		if (!target) return this.parse('/help unlock');
		this.checkCan('lock');

		const userid = toID(target);
		if (userid.startsWith('guest')) {
			return this.errorReply(`You cannot unlock the guest userid - provide their original username instead.`);
		}
		const punishment = Punishments.userids.getByType(userid, 'LOCK') || Punishments.userids.getByType(userid, 'NAMELOCK');
		if (!punishment) return this.errorReply("This name isn't locked.");
		if (punishment.id === userid || Users.get(userid)?.previousIDs.includes(punishment.id as ID)) {
			return this.errorReply(`"${userid}" was specifically locked by a staff member (check the global modlog). Use /unlock if you really want to unlock this name.`);
		}
		Punishments.userids.delete(userid);
		Punishments.savePunishments();

		for (const curUser of Users.findUsers([userid], [])) {
			const locked = Punishments.hasPunishType(curUser.id, ['LOCK', 'NAMELOCK'], curUser.latestIp);
			if (curUser.locked && !curUser.locked.startsWith('#') && !locked) {
				curUser.locked = null;
				curUser.namelocked = null;
				curUser.destroyPunishmentTimer();
				curUser.updateIdentity();
			}
		}

		this.addGlobalModAction(`The name '${target}' was unlocked by ${user.name}.`);
		this.globalModlog("UNLOCKNAME", userid);
	},
	unrangelock: 'unlockip',
	rangeunlock: 'unlockip',
	unlockip(target, room, user) {
		target = target.trim();
		if (!target) return this.parse('/help unlock');
		this.checkCan('globalban');
		const range = target.endsWith('*');
		if (range) this.checkCan('rangeban');

		if (!(range ? IPTools.ipRangeRegex : IPTools.ipRegex).test(target)) {
			return this.errorReply("Please enter a valid IP address.");
		}

		const punishment = Punishments.ips.get(target);
		if (!punishment) return this.errorReply(`${target} is not a locked/banned IP or IP range.`);

		Punishments.ips.delete(target);
		Punishments.savePunishments();

		for (const curUser of Users.findUsers([], [target])) {
			if (
				(range ? curUser.locked === '#rangelock' : !curUser.locked?.startsWith('#')) &&
				!Punishments.getPunishType(curUser.id)
			) {
				curUser.locked = null;
				if (curUser.namelocked) {
					curUser.namelocked = null;
					curUser.resetName();
				}
				curUser.destroyPunishmentTimer();
				curUser.updateIdentity();
			}
		}

		this.privateGlobalModAction(`${user.name} unlocked the ${range ? "IP range" : "IP"}: ${target}`);
		this.globalModlog(`UNLOCK${range ? 'RANGE' : 'IP'}`, null, null, target);
	},
	unlockiphelp: [`/unlockip [ip] - Unlocks a punished ip while leaving the original punishment intact. Requires: @ ~`],
	unlocknamehelp: [`/unlockname [name] - Unlocks a punished alt, leaving the original lock intact. Requires: % @ ~`],
	unlockhelp: [
		`/unlock [username] - Unlocks the user. Requires: % @ ~`,
		`/unlockname [username] - Unlocks a punished alt while leaving the original punishment intact. Requires: % @ ~`,
		`/unlockip [ip] - Unlocks a punished ip while leaving the original punishment intact. Requires: @ ~`,
	],

	forceglobalban: 'globalban',
	gban: 'globalban',
	async globalban(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help globalban');
		const force = cmd.includes('force');

		const { targetUser, inputUsername, targetUsername, rest: reason } = this.splitUser(target);
		let userid: ID = toID(targetUsername);

		if (!targetUser && !force) {
			return this.errorReply(`User '${targetUsername}' not found. Use /forceglobalban to ban them anyway.`);
		}
		if (reason.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		if (!reason && REQUIRE_REASONS) {
			return this.errorReply("Global bans require a reason.");
		}
		this.checkCan('globalban', targetUser);
		let name;

		if (targetUser) {
			name = targetUser.getLastName();
			userid = targetUser.getLastId();
		} else {
			name = targetUsername;
		}

		if (Users.isTrusted(userid)) {
			if (force) {
				const from = runCrisisDemote(userid);
				Monitor.log(`[CrisisMonitor] ${name} was globally banned by ${user.name} and demoted from ${from?.join(", ")}.`);
				this.globalModlog("CRISISDEMOTE", targetUser, ` from ${from?.join(", ")}`);
			} else {
				return this.sendReply(`${name} is a trusted user. If you are sure you would like to ban them use /forceglobalban.`);
			}
		}

		const roomauth = Rooms.global.destroyPersonalRooms(userid);
		if (roomauth.length) {
			Monitor.log(`[CrisisMonitor] Globally banned user ${name} has public roomauth (${roomauth.join(', ')}), and should probably be demoted.`);
		}
		const { privateReason, publicReason } = this.parseSpoiler(reason);
		targetUser?.popup(
			`|modal|${user.name} has globally banned you.${(publicReason ? `\n\nReason: ${publicReason}` : ``)} ` +
			`${(Config.appealurl ? `\n\nIf you feel that your ban was unjustified, you can appeal:\n${Config.appealurl}` : ``)}` +
			`\n\nYour ban will expire in a few days.`
		);

		this.addGlobalModAction(`${name} was globally banned by ${user.name}.${(publicReason ? ` (${publicReason})` : ``)}`);

		const affected = await Punishments.ban(userid, null, null, false, publicReason);
		for (const u of affected) Chat.runHandlers('onPunishUser', 'BAN', u, room);
		const acAccount = (targetUser && targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
		let displayMessage = '';
		if (affected.length > 1) {
			let guests = affected.length - 1;
			const affectedAlts = affected.slice(1)
				.map(curUser => curUser.getLastName())
				.filter(alt => !alt.startsWith('[Guest '));
			guests -= affectedAlts.length;
			displayMessage = `${name}'s ${(acAccount ? `ac account: ${acAccount}, ` : ``)} banned alts: ${affectedAlts.join(", ")} ${(guests ? ` [${guests} guests]` : ``)}`;
			this.privateModAction(displayMessage);
			for (const id of affectedAlts) {
				this.add(`|hidelines|unlink|${toID(id)}`);
			}
		} else if (acAccount) {
			displayMessage = `${name}'s ac account: ${acAccount}`;
			this.privateModAction(displayMessage);
		}

		room?.hideText([
			...affected.map(u => u.id),
			toID(inputUsername),
		]);

		this.globalModlog(`${force ? `FORCE` : ''}BAN`, targetUser, privateReason);
		return true;
	},
	globalbanhelp: [
		`/globalban OR /gban [username], [reason] - Kick user from all rooms and ban user's IP address with reason. Requires: @ ~`,
		`/globalban OR /gban [username], [reason] spoiler: [private reason] - Marks [private reason] in modlog only.`,
	],

	globalunban: 'unglobalban',
	unglobalban(target, room, user) {
		if (!target) return this.parse(`/help unglobalban`);
		this.checkCan('globalban');

		const name = Punishments.unban(target);

		if (!name) {
			return this.errorReply(`User '${target}' is not globally banned.`);
		}

		this.addGlobalModAction(`${name} was globally unbanned by ${user.name}.`);
		this.globalModlog("UNBAN", target);
	},
	unglobalbanhelp: [`/unglobalban [username] - Unban a user. Requires: @ ~`],

	deroomvoiceall(target, room, user) {
		room = this.requireRoom();
		this.checkCan('editroom', null, room);
		if (!room.auth.size) return this.errorReply("Room does not have roomauth.");
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
		for (const [userid, symbol] of room.auth) {
			if (symbol === '+') {
				room.auth.delete(userid);
				if (userid in room.users) room.users[userid].updateIdentity(room.roomid);
				count++;
			}
		}
		if (!count) {
			return this.sendReply("(This room has zero roomvoices)");
		}
		room.saveSettings();
		this.addModAction(`All ${count} roomvoices have been cleared by ${user.name}.`);
		this.modlog('DEROOMVOICEALL');
	},
	deroomvoiceallhelp: [`/deroomvoiceall - Devoice all roomvoiced users. Requires: # ~`],

	// this is a separate command for two reasons
	// a - yearticketban is preferred over /ht yearban
	// b - it would be messy to switch
	//   from both Punishments.punishRange and #punish in /ht ban
	//   since this takes ips / userids
	async yearticketban(target, room, user) {
		this.checkCan('rangeban');
		target = target.trim();
		let reason = '';
		[target, reason] = this.splitOne(target);
		let isIP = false;
		let descriptor = '';
		if (IPTools.ipRangeRegex.test(target)) {
			isIP = true;
			if (IPTools.ipRegex.test(target)) {
				descriptor = 'the IP ';
			} else {
				descriptor = 'the IP range ';
			}
		} else {
			target = toID(target);
		}
		if (!target) return this.parse(`/help yearticketban`);
		const expireTime = Date.now() + 365 * 24 * 60 * 60 * 1000;
		if (isIP) {
			Punishments.punishRange(target, reason, expireTime, 'TICKETBAN');
		} else {
			await Punishments.punish(target as ID, {
				type: 'TICKETBAN',
				id: target as ID,
				expireTime,
				reason,
				rest: [],
			}, true);
		}
		this.addGlobalModAction(
			`${user.name} banned ${descriptor}${target} from opening tickets for a year` +
			`${reason ? ` (${reason})` : ""}`
		);
		this.globalModlog(
			'YEARTICKETBAN',
			isIP ? null : target,
			reason,
			isIP ? target : undefined
		);
	},
	yearticketbanhelp: [
		`/yearticketban [IP/userid] - Ban an IP or a userid from opening tickets for a year. `,
		`Accepts wildcards to ban ranges. Requires: ~`,
	],

	rangeban: 'banip',
	yearbanip: 'banip',
	banip(target, room, user, connection, cmd) {
		const [ip, reason] = this.splitOne(target);
		if (!ip || !/^[0-9.]+(?:\.\*)?$/.test(ip)) return this.parse('/help banip');
		if (!reason) return this.errorReply("/banip requires a ban reason");

		this.checkCan('rangeban');
		const ipDesc = `IP ${(ip.endsWith('*') ? `range ` : ``)}${ip}`;

		const year = cmd.startsWith('year');
		const time = year ? Date.now() + 365 * 24 * 60 * 60 * 1000 : null;

		const curPunishment = Punishments.ipSearch(ip, 'BAN');
		if (curPunishment?.type === 'BAN' && !time) {
			return this.errorReply(`The ${ipDesc} is already temporarily banned.`);
		}
		Punishments.punishRange(ip, reason, time, 'BAN');

		const duration = year ? 'year' : 'hour';
		if (!this.room || this.room.roomid !== 'staff') {
			this.sendReply(`You ${duration}-banned the ${ipDesc}.`);
		}
		this.room = Rooms.get('staff') || null;
		this.addGlobalModAction(
			`${user.name} ${duration}-banned the ${ipDesc}: ${reason}`
		);
		this.globalModlog(
			`${year ? "YEAR" : ""}RANGEBAN`,
			null,
			`${ip.endsWith('*') ? ip : `[${ip}]`}: ${reason}`
		);
	},
	baniphelp: [
		`/banip [ip] OR /yearbanip [ip] - Globally bans this IP or IP range for an hour. Accepts wildcards to ban ranges.`,
		`Existing users on the IP will not be banned. Requires: ~`,
	],

	unrangeban: 'unbanip',
	unbanip(target, room, user) {
		target = target.trim();
		if (!target) {
			return this.parse('/help unbanip');
		}
		this.checkCan('rangeban');
		if (!Punishments.ips.has(target)) {
			return this.errorReply(`${target} is not a locked/banned IP or IP range.`);
		}
		Punishments.ips.delete(target);

		this.addGlobalModAction(`${user.name} unbanned the ${(target.endsWith('*') ? "IP range" : "IP")}: ${target}`);
		this.modlog('UNRANGEBAN', null, target);
	},
	unbaniphelp: [`/unbanip [ip] - Unbans. Accepts wildcards to ban ranges. Requires: ~`],

	forceyearlockname: 'yearlockname',
	yearlockid: 'yearlockname',
	forceyearlockid: 'yearlockname',
	yearlockuserid: 'yearlockname',
	forceyearlockuserid: 'yearlockname',
	yearlockname(target, room, user) {
		this.checkCan('rangeban');
		const [targetUsername, rest] = Utils.splitFirst(target, ',').map(k => k.trim());
		const targetUser = Users.get(targetUsername);
		const targetUserid = toID(targetUsername);
		if (!targetUserid || targetUserid.length > 18) {
			return this.errorReply(`Invalid userid.`);
		}
		const force = this.cmd.includes('force');
		if (targetUser?.registered && !force) {
			return this.errorReply(`That user is registered. Either permalock them normally or use /forceyearlockname.`);
		}
		const punishment = {
			type: 'YEARLOCK',
			id: targetUserid,
			expireTime: Date.now() + 365 * 24 * 60 * 60 * 1000,
			reason: rest || "",
		};
		Punishments.userids.add(targetUserid, punishment);
		Punishments.savePunishments();
		this.addGlobalModAction(`${user.name} locked the userid '${targetUserid}' for a year${rest ? ` (${rest})` : ''}.`);
		this.globalModlog(`${force ? `FORCE` : ''}YEARLOCKNAME`, targetUserid, rest);
		if (targetUser) {
			Chat.punishmentfilter(targetUser, punishment);
			targetUser.locked = targetUserid;
		}
	},
	rangelock: 'lockip',
	yearlockip: 'lockip',
	yearnamelockip: 'lockip',
	lockip(target, room, user, connection, cmd) {
		const [ip, reason] = this.splitOne(target);
		if (!ip || !/^[0-9.]+(?:\.\*)?$/.test(ip)) return this.parse('/help lockip');
		if (!reason) return this.errorReply("/lockip requires a lock reason");

		this.checkCan('rangeban');
		const ipDesc = ip.endsWith('*') ? `IP range ${ip}` : `IP ${ip}`;

		const year = cmd.startsWith('year');
		const curPunishment = Punishments.byWeight(Punishments.ipSearch(ip) || [])[0];
		if (!year && curPunishment && (curPunishment.type === 'BAN' || curPunishment.type === 'LOCK')) {
			const punishDesc = curPunishment.type === 'BAN' ? `temporarily banned` : `temporarily locked`;
			return this.errorReply(`The ${ipDesc} is already ${punishDesc}.`);
		}

		const time = year ? Date.now() + 365 * 24 * 60 * 60 * 1000 : null;
		const type = cmd.includes('name') ? 'NAMELOCK' : 'LOCK';
		Punishments.punishRange(ip, reason, time, type);

		this.addGlobalModAction(`${user.name} ${year ? 'year' : 'hour'}-${type.toLowerCase()}ed the ${ipDesc}: ${reason}`);
		this.globalModlog(
			`${year ? 'YEAR' : 'RANGE'}${type}`,
			null,
			`${ip.endsWith('*') ? ip : `[${ip}]`}: ${reason}`,
			ip.endsWith('*') ? `${ip.slice(0, -2)}` : ip
		);
	},
	lockiphelp: [
		`/lockip [ip] - Globally locks this IP or IP range for an hour. Accepts wildcards to ban ranges.`,
		`/yearlockip [ip] - Globally locks this IP or IP range for one year. Accepts wildcards to ban ranges.`,
		`/yearnamelockip [ip] - Namelocks this IP or IP range for one year. Accepts wildcards to ban ranges.`,
		`Existing users on the IP will not be banned. Requires: ~`,
	],

	/*********************************************************
	 * Moderating: Other
	 *********************************************************/

	mn: 'modnote',
	modnote(target, room, user, connection) {
		room = this.requireRoom();
		if (!target) return this.parse('/help modnote');
		this.checkChat();

		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The note is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		this.checkCan('receiveauthmessages', null, room);
		target = target.replace(/\n/g, "; ");
		let targeted = /\[([^\]]+)\]/.exec(target)?.[1] || null;
		if (!targeted) {
			// allow `name, note` and `name - note` syntax
			targeted = target.split(/[,-]/)[0]?.trim() || "";
			if (!targeted || !(
				Users.get(targeted) || Punishments.search(target).length || IPTools.ipRegex.test(targeted)
			) || toID(targeted) === toID(target)) {
				targeted = null;
			}
		}
		let targetUserid, targetIP;

		if (targeted) {
			if (IPTools.ipRegex.test(targeted)) {
				targetIP = targeted;
			} else {
				targetUserid = toID(targeted);
			}
		}
		if (
			['staff', 'upperstaff'].includes(room.roomid) ||
			(Rooms.Modlog.getSharedID(room.roomid) && user.can('modlog'))
		) {
			this.globalModlog('NOTE', targetUserid || null, target, targetIP);
		} else {
			this.modlog('NOTE', targetUserid || null, target);
		}

		this.privateModAction(`${user.name} notes: ${target}`);
	},
	modnotehelp: [
		`/modnote <note> - Adds a moderator note that can be read through modlog. Requires: % @ # ~`,
		`/modnote [<userid>] <note> - Adds a moderator note to a user's modlog that can be read through modlog. Requires: % @ # ~`,
	],

	globalpromote: 'promote',
	promote(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help promote');

		const { targetUser, targetUsername, rest: nextGroupName } = this.splitUser(target, { exactName: true });
		const userid = toID(targetUsername);
		const name = targetUser?.name || targetUsername;

		if (!userid) return this.parse('/help promote');

		const currentGroup = targetUser?.tempGroup || Users.globalAuth.get(userid);
		let nextGroup = nextGroupName as GroupSymbol;
		if (nextGroupName === 'deauth') nextGroup = Users.Auth.defaultSymbol();
		if (!nextGroup) {
			return this.errorReply("Please specify a group such as /globalvoice or /globaldeauth");
		}
		if (!Config.groups[nextGroup]) {
			return this.errorReply(`Group '${nextGroup}' does not exist.`);
		}
		if (!cmd.startsWith('global')) {
			let groupid = Config.groups[nextGroup].id;
			if (!groupid && nextGroup === Users.Auth.defaultSymbol()) groupid = 'deauth' as ID;
			if (Config.groups[nextGroup].globalonly) return this.errorReply(`Did you mean "/global${groupid}"?`);
			if (Config.groups[nextGroup].roomonly) return this.errorReply(`Did you mean "/room${groupid}"?`);
			return this.errorReply(`Did you mean "/room${groupid}" or "/global${groupid}"?`);
		}
		if (Config.groups[nextGroup].roomonly || Config.groups[nextGroup].battleonly) {
			return this.errorReply(`Group '${nextGroup}' does not exist as a global rank.`);
		}

		const groupName = Config.groups[nextGroup].name || "regular user";
		if (currentGroup === nextGroup) {
			return this.errorReply(`User '${name}' is already a ${groupName}`);
		}
		if (!Users.Auth.hasPermission(user, 'promote', currentGroup)) {
			this.errorReply(`/${cmd} - Access denied for promoting from ${currentGroup}`);
			this.errorReply(`You can only promote to/from: ${Users.Auth.listJurisdiction(user, 'promote')}`);
			return;
		}
		if (!Users.Auth.hasPermission(user, 'promote', nextGroup)) {
			this.errorReply(`/${cmd} - Access denied for promoting to ${groupName}`);
			this.errorReply(`You can only promote to/from: ${Users.Auth.listJurisdiction(user, 'promote')}`);
			return;
		}

		if (!Users.isUsernameKnown(userid)) {
			return this.errorReply(`/globalpromote - WARNING: '${name}' is offline and unrecognized. The username might be misspelled (either by you or the person who told you) or unregistered. Use /forcepromote if you're sure you want to risk it.`);
		}
		if (targetUser && !targetUser.registered) {
			return this.errorReply(`User '${name}' is unregistered, and so can't be promoted.`);
		}
		if (nextGroup === Users.Auth.defaultSymbol()) {
			Users.globalAuth.delete(targetUser ? targetUser.id : userid);
		} else {
			Users.globalAuth.set(targetUser ? targetUser.id : userid, nextGroup);
		}
		if (Users.Auth.getGroup(nextGroup).rank < Users.Auth.getGroup(currentGroup).rank) {
			this.privateGlobalModAction(`${name} was demoted to Global ${groupName} by ${user.name}.`);
			this.globalModlog(`GLOBAL ${groupName.toUpperCase()}`, userid, `(demote)`);
			if (targetUser) targetUser.popup(`You were demoted to Global ${groupName} by ${user.name}.`);
		} else {
			this.addGlobalModAction(`${name} was promoted to Global ${groupName} by ${user.name}.`);
			this.globalModlog(`GLOBAL ${groupName.toUpperCase()}`, userid);
			if (targetUser) targetUser.popup(`You were promoted to Global ${groupName} by ${user.name}.`);
		}

		if (targetUser) {
			targetUser.updateIdentity();
			Rooms.global.checkAutojoin(targetUser);
			if (targetUser.trusted && !Users.isTrusted(targetUser.id)) {
				targetUser.trusted = '';
			}
		}
	},
	promotehelp: [`/promote [username], [group] - Promotes the user to the specified group. Requires: ~`],

	untrustuser: 'trustuser',
	unconfirmuser: 'trustuser',
	confirmuser: 'trustuser',
	forceconfirmuser: 'trustuser',
	forcetrustuser: 'trustuser',
	trustuser(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help trustuser');
		this.checkCan('promote');

		const force = cmd.includes('force');
		const untrust = cmd.includes('un');
		const { targetUser, targetUsername, rest } = this.splitUser(target, { exactName: true });
		if (rest) return this.errorReply(`This command does not support specifying a reason.`);
		const userid = toID(targetUsername);
		const name = targetUser?.name || targetUsername;

		const currentGroup = Users.globalAuth.get(userid);

		if (untrust) {
			if (currentGroup !== Users.Auth.defaultSymbol()) {
				return this.errorReply(`User '${name}' is trusted indirectly through global rank ${currentGroup}. Demote them from that rank to remove trusted status.`);
			}
			const trustedSourceRooms = Rooms.global.chatRooms
				.filter(authRoom => authRoom.persist && authRoom.settings.isPrivate !== true && authRoom.auth.isStaff(userid))
				.map(authRoom => authRoom.auth.get(userid) + authRoom.roomid).join(' ');
			if (trustedSourceRooms.length && !Users.globalAuth.has(userid)) {
				return this.errorReply(`User '${name}' is trusted indirectly through room ranks ${trustedSourceRooms}. Demote them from those ranks to remove trusted status.`);
			}
			if (!Users.globalAuth.has(userid)) return this.errorReply(`User '${name}' is not trusted.`);

			if (targetUser) {
				targetUser.setGroup(Users.Auth.defaultSymbol());
			} else {
				Users.globalAuth.delete(userid);
			}

			this.privateGlobalModAction(`${name} was set to no longer be a trusted user by ${user.name}.`);
			this.globalModlog('UNTRUSTUSER', userid);
		} else {
			if (!targetUser && !force) return this.errorReply(`User '${name}' is offline. Use /force${cmd} if you're sure.`);
			if (currentGroup) {
				if (Users.globalAuth.has(userid)) {
					if (currentGroup === Users.Auth.defaultSymbol()) return this.errorReply(`User '${name}' is already trusted.`);
					return this.errorReply(`User '${name}' has a global rank higher than trusted.`);
				}
			}
			if (targetUser) {
				targetUser.setGroup(Users.Auth.defaultSymbol(), true);
			} else {
				Users.globalAuth.set(userid, Users.Auth.defaultSymbol());
			}

			this.privateGlobalModAction(`${name} was set as a trusted user by ${user.name}.`);
			this.globalModlog('TRUSTUSER', userid);
		}
	},
	trustuserhelp: [
		`/trustuser [username] - Trusts the user (makes them immune to locks). Requires: ~`,
		`/untrustuser [username] - Removes the trusted user status from the user. Requires: ~`,
	],

	desectionleader: 'sectionleader',
	sectionleader(target, room, user, connection, cmd) {
		this.checkCan('gdeclare');
		room = this.requireRoom();
		const demoting = cmd === 'desectionleader';
		if (!target || (target.split(',').length < 2 && !demoting)) return this.parse(`/help sectionleader`);

		const { targetUser, targetUsername, rest: sectionid } = this.splitUser(target, { exactName: true });
		const userid = toID(targetUsername);
		const section = demoting ? Users.globalAuth.sectionLeaders.get(userid)! : room.validateSection(sectionid);
		const name = targetUser ? targetUser.name : targetUsername;
		if (Users.globalAuth.sectionLeaders.has(targetUser?.id || userid) && !demoting) {
			throw new Chat.ErrorMessage(`${name} is already a Section Leader of ${RoomSections.sectionNames[section]}.`);
		} else if (!Users.globalAuth.sectionLeaders.has(targetUser?.id || userid) && demoting) {
			throw new Chat.ErrorMessage(`${name} is not a Section Leader.`);
		}
		if (!demoting) {
			Users.globalAuth.setSection(userid, section);
			this.addGlobalModAction(`${name} was appointed Section Leader of ${RoomSections.sectionNames[section]} by ${user.name}.`);
			this.globalModlog(`SECTION LEADER`, userid, section);
			targetUser?.popup(`You were appointed Section Leader of ${RoomSections.sectionNames[section]} by ${user.name}.`);
		} else {
			const group = Users.globalAuth.get(userid);
			Users.globalAuth.deleteSection(userid);
			this.privateGlobalModAction(`${name} was demoted from Section Leader of ${RoomSections.sectionNames[section]} by ${user.name}.`);
			if (group === ' ') this.sendReply(`They are also no longer manually trusted. If they should be, use '/trustuser'.`);
			this.globalModlog(`DESECTION LEADER`, userid, section);
			targetUser?.popup(`You were demoted from Section Leader of ${RoomSections.sectionNames[section]} by ${user.name}.`);
		}

		if (targetUser) {
			targetUser.updateIdentity();
			Rooms.global.checkAutojoin(targetUser);
			if (targetUser.trusted && !Users.isTrusted(targetUser.id)) {
				targetUser.trusted = '';
			}
		}
	},
	sectionleaderhelp: [
		`/sectionleader [target user], [sectionid] - Appoints [target user] Section Leader.`,
		`/desectionleader [target user] - Demotes [target user] from Section Leader.`,
		`Valid sections: ${RoomSections.sections.join(', ')}`,
		`If you want to change which section someone leads, demote them and then re-promote them in the desired section.`,
		`Requires: ~`,
	],

	globaldemote: 'demote',
	demote(target) {
		if (!target) return this.parse('/help demote');
		this.run('promote');
	},
	demotehelp: [`/demote [username], [group] - Demotes the user to the specified group. Requires: ~`],

	forcepromote(target, room, user, connection) {
		// warning: never document this command in /help
		this.checkCan('forcepromote');
		const { targetUsername, rest: nextGroupName } = this.splitUser(target, { exactName: true });
		let name = this.filter(targetUsername);
		if (!name) return;
		name = name.slice(0, 18);
		const nextGroup = nextGroupName as GroupSymbol;
		if (!Config.groups[nextGroup]) return this.errorReply(`Group '${nextGroup}' does not exist.`);
		if (Config.groups[nextGroup].roomonly || Config.groups[nextGroup].battleonly) {
			return this.errorReply(`Group '${nextGroup}' does not exist as a global rank.`);
		}

		if (Users.isUsernameKnown(name)) {
			return this.errorReply("/forcepromote - Don't forcepromote unless you have to.");
		}
		Users.globalAuth.set(name as ID, nextGroup);

		this.addGlobalModAction(`${name} was promoted to Global ${(Config.groups[nextGroup].name || "regular user")} by ${user.name}.`);
		this.globalModlog(`GLOBAL${(Config.groups[nextGroup].name || "regular").toUpperCase()}`, toID(name));
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
		room = this.requireRoom();
		this.checkCan('declare', null, room);
		this.checkChat();
		if (target.length > 2000) return this.errorReply("Declares should not exceed 2000 characters.");

		for (const id in room.users) {
			room.users[id].sendTo(room, `|notify|${room.title} announcement!|${target}`);
		}
		this.add(Utils.html`|raw|<div class="broadcast-blue"><b>${target}</b></div>`);
		this.modlog('DECLARE', null, target);
	},
	declarehelp: [`/declare [message] - Anonymously announces a message. Requires: # * ~`],

	htmldeclare(target, room, user) {
		if (!target) return this.parse('/help htmldeclare');
		room = this.requireRoom();
		this.checkCan('declare', null, room);
		this.checkChat();
		this.checkHTML(target);

		for (const u in room.users) {
			Users.get(u)?.sendTo(
				room,
				`|notify|${room.title} announcement!|${Utils.stripHTML(target)}`
			);
		}
		this.add(`|raw|<div class="broadcast-blue"><b>${target}</b></div>`);
		this.modlog(`HTMLDECLARE`, null, target);
	},
	htmldeclarehelp: [`/htmldeclare [message] - Anonymously announces a message using safe HTML. Requires: # * ~`],

	gdeclare: 'globaldeclare',
	globaldeclare(target, room, user) {
		if (!target) return this.parse('/help globaldeclare');
		this.checkCan('gdeclare');
		this.checkHTML(target);

		for (const u of Users.users.values()) {
			if (u.connected) u.send(`|pm|~|${u.tempGroup}${u.name}|/raw <div class="broadcast-blue"><b>${target}</b></div>`);
		}
		this.globalModlog(`GLOBALDECLARE`, null, target);
	},
	globaldeclarehelp: [`/globaldeclare [message] - Anonymously sends a private message to all the users on the site. Requires: ~`],

	cdeclare: 'chatdeclare',
	chatdeclare(target, room, user) {
		if (!target) return this.parse('/help chatdeclare');
		this.checkCan('gdeclare');
		this.checkHTML(target);

		for (const curRoom of Rooms.rooms.values()) {
			if (curRoom.type !== 'battle') {
				curRoom.addRaw(`<div class="broadcast-blue"><b>${target}</b></div>`).update();
			}
		}
		this.globalModlog(`CHATDECLARE`, null, target);
	},
	chatdeclarehelp: [`/cdeclare [message] - Anonymously announces a message to all chatrooms on the server. Requires: ~`],

	wall: 'announce',
	announce(target, room, user) {
		if (!target) return this.parse('/help announce');

		if (room) this.checkCan('announce', null, room);

		this.checkChat(target);

		return `/announce ${target}`;
	},
	announcehelp: [`/announce OR /wall [message] - Makes an announcement. Requires: % @ # ~`],

	notifyoffrank: 'notifyrank',
	notifyrank(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!target) return this.parse(`/help notifyrank`);
		this.checkCan('addhtml', null, room);
		this.checkChat();
		let [rank, titleNotification] = this.splitOne(target);
		if (rank === 'all') rank = ` `;
		if (!(rank in Config.groups)) return this.errorReply(`Group '${rank}' does not exist.`);
		const id = `${room.roomid}-rank-${(Config.groups[rank].id || `all`)}`;
		if (cmd === 'notifyoffrank') {
			if (rank === ' ') {
				room.send(`|tempnotifyoff|${id}`);
			} else {
				room.sendRankedUsers(`|tempnotifyoff|${id}`, rank as GroupSymbol);
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
				room.sendRankedUsers(message, rank as GroupSymbol);
			}
			this.modlog(`NOTIFYRANK`, null, target);
		}
	},
	notifyrankhelp: [
		`/notifyrank [rank], [title], [message], [highlight] - Sends a notification to users who are [rank] or higher (and highlight on [highlight], if specified). Requires: # * ~`,
		`/notifyoffrank [rank] - Closes the notification previously sent with /notifyrank [rank]. Requires: # * ~`,
	],

	notifyoffuser: 'notifyuser',
	notifyuser(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!target) return this.parse(`/help notifyuser`);
		this.checkCan('addhtml', null, room);
		this.checkChat();
		const { targetUser, targetUsername, rest: titleNotification } = this.splitUser(target);
		if (!targetUser?.connected) return this.errorReply(`User '${targetUsername}' not found.`);
		const id = `${room.roomid}-user-${toID(targetUsername)}`;
		if (cmd === 'notifyoffuser') {
			room.sendUser(targetUser, `|tempnotifyoff|${id}`);
			this.sendReply(`Closed the notification previously sent to ${targetUser.name}.`);
		} else {
			let [title, notification] = this.splitOne(titleNotification);
			if (!title) title = `${room.title} notification!`;
			if (!user.can('addhtml')) {
				title += ` (notification from ${user.name})`;
			}
			if (notification.length > 300) return this.errorReply(`Notifications should not exceed 300 characters.`);
			const message = `|tempnotify|${id}|${title}|${notification}`;
			room.sendUser(targetUser, message);
			this.sendReply(`Sent a notification to ${targetUser.name}.`);
		}
	},
	notifyuserhelp: [
		`/notifyuser [username], [title], [message] - Sends a notification to [user]. Requires: # * ~`,
		`/notifyoffuser [user] - Closes the notification previously sent with /notifyuser [user]. Requires: # * ~`,
	],

	fr: 'forcerename',
	ofr: 'forcerename',
	offlineforcerename: 'forcerename',
	forcerename(target, room, user) {
		if (!target) return this.parse('/help forcerename');

		const { targetUser, targetUsername, rest: reason } = this.splitUser(target, { exactName: true });
		const offline = this.cmd.startsWith('o');
		const targetID = targetUser?.id || toID(targetUsername);
		// && !offline because maybe we're trying to disallow the name after they namechanged
		if (!targetUser && !offline) {
			const { targetUser: targetUserInexact, inputUsername } = this.splitUser(target);
			if (targetUserInexact) {
				return this.errorReply(`User has already changed their name to '${targetUserInexact.name}'.`);
			}
			return this.errorReply(`User '${inputUsername}' not found. (use /offlineforcerename to rename anyway.)`);
		}
		if (Punishments.namefilterwhitelist.has(targetID)) {
			this.errorReply(`That name is blocked from being forcerenamed.`);
			if (user.can('bypassall')) {
				this.errorReply(`Use /noforcerename remove to remove it from the list if you wish to rename it.`);
			}
			return false;
		}
		this.checkCan('forcerename', targetID);
		const { publicReason, privateReason } = this.parseSpoiler(reason);

		Monitor.forceRenames.set(targetID, false);

		let forceRenameMessage;
		if (targetUser?.connected) {
			forceRenameMessage = `was forced to choose a new name by ${user.name}${(publicReason ? `: ${publicReason}` : ``)}`;
			this.globalModlog('FORCERENAME', targetUser, reason);
			Ladders.cancelSearches(targetUser);
			targetUser.send(`|nametaken||${user.name} considers your name inappropriate${(publicReason ? `: ${publicReason}` : ``)}`);
		} else {
			forceRenameMessage = `was forced to choose a new name by ${user.name} while offline${(publicReason ? `: ${publicReason}` : ``)}`;
			this.globalModlog('FORCERENAME OFFLINE', targetUser, privateReason);
		}
		Monitor.forceRenames.set(targetID, false);

		if (room?.roomid !== 'staff') {
			if (room?.roomid.startsWith('help-')) {
				this.addModAction(`${targetUser?.name || targetID} ${forceRenameMessage}`);
			} else {
				this.privateModAction(`${targetUser?.name || targetID} ${forceRenameMessage}`);
			}
		}
		const roomMessage = this.pmTarget ? `<PM:${this.pmTarget.id}>` :
			room && room.roomid !== 'staff' ? `«<a href="/${room.roomid}" target="_blank">${room.roomid}</a>» ` :
			'';
		const rankMessage = targetUser?.getAccountStatusString() || "";
		Rooms.global.notifyRooms(
			['staff'],
			`|html|${roomMessage}` + Utils.html`<span class="username">${targetUser?.name || targetID}</span> ${rankMessage} ${forceRenameMessage}`
		);

		targetUser?.resetName(true);
		return true;
	},
	forcerenamehelp: [
		`/forcerename OR /fr [username], [reason] - Forcibly change a user's name and shows them the [reason]. Requires: % @ ~`,
		`/allowname [username] - Unmarks a forcerenamed username, stopping staff from being notified when it is used. Requires % @ ~`,
	],

	nfr: 'noforcerename',
	noforcerename: {
		add(target, room, user) {
			const [targetUsername, rest] = Utils.splitFirst(target, ',').map(f => f.trim());
			const targetId = toID(targetUsername);
			if (!targetId) return this.parse('/help noforcerename');
			this.checkCan('bypassall');
			if (!Punishments.whitelistName(targetId, user.name)) {
				return this.errorReply(`${targetUsername} is already on the noforcerename list.`);
			}
			this.addGlobalModAction(`${user.name} added the name ${targetId} to the no forcerename list.${rest ? ` (${rest})` : ''}`);
			this.globalModlog('NOFORCERENAME', targetId, rest);
		},
		remove(target, room, user) {
			const { targetUsername, rest } = this.splitUser(target);
			const targetId = toID(targetUsername);
			if (!targetId) return this.parse('/help noforcerename');
			this.checkCan('bypassall');
			if (!Punishments.namefilterwhitelist.has(targetId)) {
				return this.errorReply(`${targetUsername} is not on the noforcerename list.`);
			}
			Punishments.unwhitelistName(targetId);
			this.addGlobalModAction(`${user.name} removed ${targetId} from the no forcerename list.${rest ? ` (${rest})` : ''}`);
			this.globalModlog('UNNOFORCERENAME', targetId, rest);
		},
	},
	noforcerenamehelp: [
		`/noforcerename add OR /nfr add [username] - Adds [username] to the list of users who can't be forcerenamed by staff.`,
		`/noforcerename remove OR /nfr remove [username] - Removes [username] from the list of users who can't be forcerenamed by staff.`,
	],

	forceclearstatus(target, room, user) {
		const { targetUser, rest: reason } = this.requireUser(target, { allowOffline: true });
		this.checkCan('forcerename', targetUser);

		if (!targetUser.userMessage) return this.errorReply(this.tr`${targetUser.name} does not have a status set.`);

		const displayReason = reason ? `: ${reason}` : ``;
		this.privateGlobalModAction(this.tr`${targetUser.name}'s status "${targetUser.userMessage}" was cleared by ${user.name}${displayReason}.`);
		this.globalModlog('CLEARSTATUS', targetUser, ` from "${targetUser.userMessage}"${displayReason}`);
		targetUser.clearStatus();
		targetUser.popup(`${user.name} has cleared your status message for being inappropriate${displayReason || '.'}`);
	},

	nl: 'namelock',
	forcenamelock: 'namelock',
	weeknamelock: 'namelock',
	wnl: 'namelock',
	fwnl: 'namelock',
	forceweeknamelock: 'namelock',
	async namelock(target, room, user, connection, cmd) {
		if (!target) return this.parse('/help namelock');
		const week = cmd.includes('w');
		const force = cmd.includes('f');

		const { targetUser, inputUsername, targetUsername, rest: reason } = this.splitUser(target);
		const userid = toID(targetUsername);

		if (!targetUser && !force) {
			return this.errorReply(
				`User '${targetUsername}' not found. Use \`\`/force${week ? 'week' : ''}namelock\`\` if you need to namelock them anyway.`
			);
		}
		if (targetUser && targetUser.id !== toID(inputUsername) && !force) {
			return this.errorReply(`${inputUsername} has already changed their name to ${targetUser.name}. To namelock anyway, use /force${week ? 'week' : ''}namelock.`);
		}
		this.checkCan('forcerename', userid);
		if (targetUser?.namelocked && !week) {
			return this.errorReply(`User '${targetUser.name}' is already namelocked.`);
		}
		if (!force && !week) {
			const existingPunishments = Punishments.search(userid);
			for (const [,, punishment] of existingPunishments) {
				if (punishment.type === 'LOCK' && (punishment.expireTime - Date.now()) > (2 * DAY)) {
					this.errorReply(`User '${userid}' is already normally locked for more than 2 days.`);
					this.errorReply(`Use /weeknamelock to namelock them instead, so you don't decrease the existing punishment.`);
					return this.errorReply(`If you really need to override this, use /forcenamelock.`);
				}
			}
		}
		const { privateReason, publicReason } = this.parseSpoiler(reason);
		const reasonText = publicReason ? ` (${publicReason})` : `.`;
		this.privateGlobalModAction(`${targetUser?.name || userid} was ${week ? 'week' : ''}namelocked by ${user.name}${reasonText}`);
		this.globalModlog(`${force ? `FORCE` : ``}${week ? 'WEEK' : ""}NAMELOCK`, targetUser || userid, privateReason);

		const roomauth = Rooms.global.destroyPersonalRooms(userid);
		if (roomauth.length) {
			Monitor.log(`[CrisisMonitor] Namelocked user ${userid} has public roomauth (${roomauth.join(', ')}), and should probably be demoted.`);
		}
		if (targetUser) {
			Ladders.cancelSearches(targetUser);
			targetUser.popup(`|modal|${user.name} has locked your name and you can't change names anymore${reasonText}`);
		}
		const duration = week ? 7 * 24 * 60 * 60 * 1000 : 48 * 60 * 60 * 1000;
		await Punishments.namelock(userid, Date.now() + duration, null, false, publicReason);
		if (targetUser) Chat.runHandlers('onPunishUser', 'NAMELOCK', targetUser, room);
		// Automatically upload replays as evidence/reference to the punishment
		if (room?.battle) this.parse('/savereplay forpunishment');
		Monitor.forceRenames.set(userid, false);
		if (connection.openPages) {
			// this hardcode is necessary because when /namelock and /uspage are send together in one button
			// the uspage output is sent before the user's name is reset
			// so it takes two clicks, which is bad behavior
			for (const page of connection.openPages) {
				if (page.includes('usersearch-')) {
					this.refreshPage(page);
				}
			}
		}

		return true;
	},
	namelockhelp: [`/namelock OR /nl [user], [reason] - Name locks a [user] and shows the [reason]. Requires: % @ ~`],

	unl: 'unnamelock',
	unnamelock(target, room, user) {
		if (!target) return this.parse('/help unnamelock');
		this.checkCan('forcerename');

		const targetUser = Users.get(target);
		let reason = '';
		if (targetUser?.namelocked) {
			reason = ` (${targetUser.namelocked})`;
		}

		const unlocked = Punishments.unnamelock(target);

		if (!unlocked) {
			return this.errorReply(`User '${target}' is not namelocked.`);
		}

		this.addGlobalModAction(`${unlocked} was unnamelocked by ${user.name}.${reason}`);
		this.globalModlog("UNNAMELOCK", toID(target));
		this.parse(`/allowname ${toID(target)}`);
		if (targetUser) targetUser.popup(`${user.name} has unnamelocked you.`);
	},
	unnamelockhelp: [`/unnamelock [username] - Unnamelocks the user. Requires: % @ ~`],

	hidetextalts: 'hidetext',
	hidealttext: 'hidetext',
	hidealtstext: 'hidetext',
	htext: 'hidetext',
	forcehidetext: 'hidetext',
	hidelines: 'hidetext',
	hlines: 'hidetext',
	cleartext: 'hidetext',
	ctext: 'hidetext',
	clearaltstext: 'hidetext',
	clearlines: 'hidetext',
	forcecleartext: 'hidetext',
	hidetext(target, room, user, connection, cmd) {
		if (!target) return this.parse(`/help hidetext`);
		room = this.requireRoom();
		const hasLineCount = cmd.includes('lines');
		const hideRevealButton = cmd.includes('clear') || cmd === 'ctext';
		let { targetUser, inputUsername, targetUsername: name, rest: reason } = this.splitUser(target);
		let lineCount = 0;
		if (/^[0-9]+\s*(,|$)/.test(reason)) {
			if (hasLineCount) {
				let lineCountString;
				[lineCountString, reason] = Utils.splitFirst(reason, ',').map(p => p.trim());
				lineCount = parseInt(lineCountString);
			} else if (!cmd.includes('force')) {
				return this.errorReply(`Your reason was a number; use /hidelines if you wanted to clear a specific number of lines, or /forcehidetext if you really wanted your reason to be a number.`);
			}
		}
		const showAlts = cmd.includes('alt');
		if (!lineCount && hasLineCount) {
			return this.errorReply(`You must specify a number of messages to clear. To clear all messages, use /hidetext.`);
		}
		if (reason.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}

		if (!targetUser && !room.log.hasUsername(name)) {
			return this.errorReply(`User ${name} not found or has no roomlogs.`);
		}
		if (lineCount && showAlts) {
			return this.errorReply(`You can't specify a line count when using /hidealtstext.`);
		}
		const userid = toID(inputUsername);

		this.checkCan('mute', null, room);

		// if the user hiding their own text, it would clear the "cleared" message,
		// so we can't attribute it in that case
		// and sending the message after `|unlink|` puts the "show lines" button in the wrong place
		const sender = user === targetUser ? null : user;

		let message = '';
		if (targetUser && showAlts) {
			message = `${name}'s alts messages were cleared from ${room.title} by ${user.name}.${(reason ? ` (${reason})` : ``)}`;
			room.sendByUser(sender, message);
			this.modlog('HIDEALTSTEXT', targetUser, reason, { noip: 1 });
			room.hideText([
				userid,
				...targetUser.previousIDs,
				...targetUser.getAltUsers(true).map((curUser: User) => curUser.getLastId()),
			] as ID[]);
		} else {
			if (lineCount > 0) {
				message = `${lineCount} of ${name}'s messages were cleared from ${room.title} by ${user.name}.${(reason ? ` (${reason})` : ``)}`;
				room.sendByUser(sender, message);
			} else {
				message = `${name}'s messages were cleared from ${room.title} by ${user.name}.${(reason ? ` (${reason})` : ``)}`;
				room.sendByUser(sender, message);
			}
			this.modlog('HIDETEXT', targetUser || userid, reason, { noip: 1, noalts: 1 });
			room.hideText([userid], lineCount, hideRevealButton);
			this.roomlog(`|c|${user.getIdentity()}|/log ${message}`);
		}
	},
	hidetexthelp: [
		`/hidetext [username], [optional reason] - Removes a user's messages from chat, with an optional reason. Requires: % @ # ~`,
		`/hidealtstext [username], [optional reason] - Removes a user's messages and their alternate accounts' messages from the chat, with an optional reason.  Requires: % @ # ~`,
		`/hidelines [username], [number], [optional reason] - Removes the [number] most recent messages from a user, with an optional reason. Requires: % @ # ~`,
		`Use /cleartext, /clearaltstext, and /clearlines to remove messages without displaying a button to reveal them.`,
	],

	ab: 'blacklist',
	bl: 'blacklist',
	forceblacklist: 'blacklist',
	forcebl: 'blacklist',
	permanentblacklist: 'blacklist',
	permablacklist: 'blacklist',
	permabl: 'blacklist',
	blacklist(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!target) return this.parse('/help blacklist');
		this.checkChat();
		if (toID(target) === 'show') return this.errorReply(`You're looking for /showbl`);

		const { targetUser, targetUsername, rest: reason } = this.splitUser(target);
		if (!targetUser) {
			this.errorReply(`User ${targetUsername} not found.`);
			return this.errorReply(`If you want to blacklist an offline account by name (not IP), consider /blacklistname`);
		}
		this.checkCan('editroom', targetUser, room);
		if (!room.persist) {
			return this.errorReply(`This room is not going to last long enough for a blacklist to matter - just ban the user`);
		}
		const punishment = Punishments.isRoomBanned(targetUser, room.roomid);
		if (punishment && punishment.type === 'BLACKLIST') {
			return this.errorReply(`This user is already blacklisted from this room.`);
		}
		const force = cmd === 'forceblacklist' || cmd === 'forcebl';
		if (targetUser.trusted) {
			if (!force) {
				return this.sendReply(
					`${targetUser.name} is a trusted user. If you are sure you would like to blacklist them use /forceblacklist.`
				);
			}
		} else if (force) {
			return this.errorReply(`Use /blacklist; ${targetUser.name} is not a trusted user.`);
		}
		if (!reason && REQUIRE_REASONS) {
			return this.errorReply(`Blacklists require a reason.`);
		}
		if (reason.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}
		const name = targetUser.getLastName();
		const userid = targetUser.getLastId();

		if (targetUser.trusted && room.settings.isPrivate !== true) {
			Monitor.log(`[CrisisMonitor] Trusted user ${targetUser.name}${targetUser.trusted !== targetUser.id ? ` (${targetUser.trusted})` : ''} was blacklisted from ${room.roomid} by ${user.name}, and should probably be demoted.`);
		}

		if (targetUser.id in room.users || user.can('lock')) {
			targetUser.popup(
				`|modal||html|<p>${Utils.escapeHTML(user.name)} has blacklisted you from the room ${room.roomid}${(room.subRooms ? ` and its subrooms` : '')}. Reason: ${Utils.escapeHTML(reason)}</p>` +
				`<p>To appeal the ban, PM the staff member that blacklisted you${room.persist ? ` or a room owner. </p><p><button name="send" value="/roomauth ${room.roomid}">List Room Staff</button></p>` : `.</p>`}`
			);
		}

		const expireTime = cmd.includes('perma') ? Date.now() + (10 * 365 * 24 * 60 * 60 * 1000) : null;
		const action = expireTime ? 'PERMABLACKLIST' : 'BLACKLIST';

		this.privateModAction(
			`${name} was blacklisted from ${room.title} by ${user.name}${expireTime ? ' for ten years' : ''}.` +
			`${reason ? ` (${reason})` : ''}`
		);

		const affected = Punishments.roomBlacklist(room, targetUser, expireTime, null, reason);

		for (const u of affected) Chat.runHandlers('onPunishUser', 'BLACKLIST', u, room);
		if (!room.settings.isPrivate && room.persist) {
			const acAccount = (targetUser.autoconfirmed !== userid && targetUser.autoconfirmed);
			let displayMessage = '';
			if (affected.length > 1) {
				displayMessage = `${name}'s ${(acAccount ? ` ac account: ${acAccount},` : '')} blacklisted alts: ${affected.slice(1).map(curUser => curUser.getLastName()).join(", ")}`;
				this.privateModAction(displayMessage);
			} else if (acAccount) {
				displayMessage = `${name}'s ac account: ${acAccount}`;
				this.privateModAction(displayMessage);
			}
		}

		if (!room.settings.isPrivate && room.persist) {
			this.globalModlog(action, targetUser, reason);
		} else {
			// Room modlog only
			this.modlog(action, targetUser, reason);
		}
		return true;
	},
	blacklisthelp: [
		`/blacklist [username], [reason] - Blacklists the user from the room you are in for a year. Requires: # ~`,
		`/permablacklist OR /permabl - blacklist a user for 10 years. Requires: # ~`,
		`/unblacklist [username] - Unblacklists the user from the room you are in. Requires: # ~`,
		`/showblacklist OR /showbl - show a list of blacklisted users in the room. Requires: % @ # ~`,
		`/expiringblacklists OR /expiringbls - show a list of blacklisted users from the room whose blacklists are expiring in 3 months or less. Requires: % @ # ~`,
	],

	forcebattleban: 'battleban',
	async battleban(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!target) return this.parse(`/help battleban`);

		const { targetUser, targetUsername, rest: reason } = this.splitUser(target);
		if (!targetUser) return this.errorReply(`User ${targetUsername} not found.`);
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
		if (!user.can('rangeban', targetUser)) {
			this.errorReply(`Battlebans have been deprecated. Alternatives:`);
			this.errorReply(`- timerstalling and bragging about it: lock`);
			this.errorReply(`- other timerstalling: they're not timerstalling, leave them alone`);
			this.errorReply(`- bad nicknames: lock, locks prevent nicknames from appearing; you should always have been locking for this`);
			this.errorReply(`- ladder cheating: gban, get a moderator if necessary`);
			this.errorReply(`- serious ladder cheating: permaban, get an administrator`);
			this.errorReply(`- other: get an administrator`);
			return;
		}
		if (Punishments.isBattleBanned(targetUser)) {
			return this.errorReply(`User '${targetUser.name}' is already banned from battling.`);
		}
		this.privateGlobalModAction(`${targetUser.name} was banned from starting new battles by ${user.name} (${reason})`);

		if (targetUser.trusted) {
			Monitor.log(`[CrisisMonitor] Trusted user ${targetUser.name} was banned from battling by ${user.name}, and should probably be demoted.`);
		}

		this.globalModlog("BATTLEBAN", targetUser, reason);
		Ladders.cancelSearches(targetUser);
		await Punishments.battleban(targetUser, null, null, reason);
		targetUser.popup(`|modal|${user.name} has prevented you from starting new battles for 2 days (${reason})`);

		// Automatically upload replays as evidence/reference to the punishment
		if (room.battle) this.parse('/savereplay forpunishment');
		return true;
	},
	battlebanhelp: [
		`/battleban [username], [reason] - [DEPRECATED]`,
		`Prevents the user from starting new battles for 2 days and shows them the [reason]. Requires: ~`,
	],

	unbattleban(target, room, user) {
		if (!target) return this.parse('/help unbattleban');
		this.checkCan('lock');

		const targetUser = Users.get(target);
		const unbanned = Punishments.unbattleban(target);

		if (unbanned) {
			this.addModAction(`${unbanned} was allowed to battle again by ${user.name}.`);
			this.globalModlog("UNBATTLEBAN", toID(target));
			if (targetUser) targetUser.popup(`${user.name} has allowed you to battle again.`);
		} else {
			this.errorReply(`User ${target} is not banned from battling.`);
		}
	},
	unbattlebanhelp: [`/unbattleban [username] - [DEPRECATED] Allows a user to battle again. Requires: % @ ~`],

	monthgroupchatban: 'groupchatban',
	monthgcban: 'groupchatban',
	gcban: 'groupchatban',
	async groupchatban(target, room, user, connection, cmd) {
		room = this.requireRoom();
		if (!target) return this.parse(`/help groupchatban`);
		if (!user.can('rangeban')) {
			return this.errorReply(
				`/groupchatban has been deprecated.\n` +
				`For future groupchat misuse, lock the creator, it will take away their trusted status and their ability to make groupchats.`
			);
		}

		const { targetUser, targetUsername, rest: reason } = this.splitUser(target);
		if (!targetUser) return this.errorReply(`User ${targetUsername} not found.`);
		if (target.length > MAX_REASON_LENGTH) {
			return this.errorReply(`The reason is too long. It cannot exceed ${MAX_REASON_LENGTH} characters.`);
		}

		const isMonth = cmd.startsWith('month');

		if (!isMonth && Punishments.isGroupchatBanned(targetUser)) {
			return this.errorReply(`User '${targetUser.name}' is already banned from using groupchats.`);
		}

		const reasonText = reason ? `: ${reason}` : ``;
		this.privateGlobalModAction(`${targetUser.name} was banned from using groupchats for a ${isMonth ? 'month' : 'week'} by ${user.name}${reasonText}.`);

		if (targetUser.trusted) {
			Monitor.log(`[CrisisMonitor] Trusted user ${targetUser.name} was banned from using groupchats by ${user.name}, and should probably be demoted.`);
		}

		const createdGroupchats = await Punishments.groupchatBan(
			targetUser, (isMonth ? Date.now() + 30 * DAY : null), null, reason
		);
		targetUser.popup(`|modal|${user.name} has banned you from using groupchats for a ${isMonth ? 'month' : 'week'}${reasonText}`);
		this.globalModlog("GROUPCHATBAN", targetUser, ` by ${user.id}${reasonText}`);

		for (const roomid of createdGroupchats) {
			const targetRoom = Rooms.get(roomid);
			if (!targetRoom) continue;
			const participants = targetRoom.warnParticipants?.(
				`This groupchat (${targetRoom.title}) has been deleted due to inappropriate conduct by its creator, ${targetUser.name}.` +
				` Do not attempt to recreate it, or you may be punished.${reason ? ` (reason: ${reason})` : ``}`
			);

			if (participants) {
				const modlogEntry = {
					action: 'NOTE',
					loggedBy: user.id,
					isGlobal: true,
					note: `participants in ${roomid} (creator: ${targetUser.id}): ${participants.join(', ')}`,
				};
				targetRoom.modlog(modlogEntry);
			}

			targetRoom.destroy();
		}
	},
	groupchatbanhelp: [
		`/groupchatban [user], [optional reason]`,
		`/monthgroupchatban [user], [optional reason]`,
		`Bans the user from joining or creating groupchats for a week (or month). Requires: % @ ~`,
	],

	ungcban: 'ungroupchatban',
	gcunban: 'ungroupchatban',
	groucphatunban: 'ungroupchatban',
	ungroupchatban(target, room, user) {
		if (!target) return this.parse('/help ungroupchatban');
		this.checkCan('lock');

		const targetUser = Users.get(target);
		const unbanned = Punishments.groupchatUnban(targetUser || toID(target));

		if (unbanned) {
			this.addGlobalModAction(`${unbanned} was ungroupchatbanned by ${user.name}.`);
			this.globalModlog("UNGROUPCHATBAN", toID(target), ` by ${user.id}`);
			if (targetUser) targetUser.popup(`${user.name} has allowed you to use groupchats again.`);
		} else {
			this.errorReply(`User ${target} is not banned from using groupchats.`);
		}
	},
	ungroupchatbanhelp: [`/ungroupchatban [user] - Allows a groupchatbanned user to use groupchats again. Requires: % @ ~`],

	nameblacklist: 'blacklistname',
	permablacklistname: 'blacklistname',
	blacklistname(target, room, user) {
		room = this.requireRoom();
		if (!target) return this.parse('/help blacklistname');
		this.checkChat();
		this.checkCan('editroom', null, room);
		if (!room.persist) {
			return this.errorReply("This room is not going to last long enough for a blacklist to matter - just ban the user");
		}

		const [targetStr, reason] = target.split('|').map(val => val.trim());
		if (!targetStr || (!reason && REQUIRE_REASONS)) {
			return this.errorReply("Usage: /blacklistname name1, name2, ... | reason");
		}

		const targets = targetStr.split(',').map(s => toID(s));

		const duplicates = targets.filter(userid => (
			// can be asserted, room should always exist
			Punishments.roomUserids.nestedGetByType(room.roomid, userid, 'BLACKLIST')
		));
		if (duplicates.length) {
			return this.errorReply(`[${duplicates.join(', ')}] ${Chat.plural(duplicates, "are", "is")} already blacklisted.`);
		}
		const expireTime = this.cmd.includes('perma') ? Date.now() + (10 * 365 * 24 * 60 * 60 * 1000) : null;
		const action = expireTime ? 'PERMANAMEBLACKLIST' : 'NAMEBLACKLIST';

		for (const userid of targets) {
			if (!userid) return this.errorReply(`User '${userid}' is not a valid userid.`);
			if (!Users.Auth.hasPermission(user, 'ban', room.auth.get(userid), room)) {
				return this.errorReply(`/blacklistname - Access denied: ${userid} is of equal or higher authority than you.`);
			}

			Punishments.roomBlacklist(room, userid, expireTime, null, reason);

			const trusted = Users.isTrusted(userid);
			if (trusted && room.settings.isPrivate !== true) {
				Monitor.log(`[CrisisMonitor] Trusted user ${userid}${(trusted !== userid ? ` (${trusted})` : ``)} was nameblacklisted from ${room.roomid} by ${user.name}, and should probably be demoted.`);
			}
			if (!room.settings.isPrivate && room.persist) {
				this.globalModlog(action, userid, reason);
			}
		}

		this.privateModAction(
			`${targets.join(', ')}${Chat.plural(targets, " were", " was")} nameblacklisted from ${room.title} by ${user.name}` +
			`${expireTime ? ' for ten years' : ''}.`
		);
		return true;
	},
	blacklistnamehelp: [
		`/blacklistname OR /nameblacklist [name1, name2, etc.] | reason - Blacklists all name(s) from the room you are in for a year. Requires: # ~`,
		`/permablacklistname [name1, name2, etc.] | reason - Blacklists all name(s) from the room you are in for 10 years. Requires: # ~`,
	],

	unab: 'unblacklist',
	unblacklist(target, room, user) {
		room = this.requireRoom();
		if (!target) return this.parse('/help unblacklist');
		this.checkCan('editroom', null, room);

		const name = Punishments.roomUnblacklist(room, target);

		if (name) {
			this.privateModAction(`${name} was unblacklisted by ${user.name}.`);
			if (!room.settings.isPrivate && room.persist) {
				this.globalModlog("UNBLACKLIST", name);
			}
		} else {
			this.errorReply(`User '${target}' is not blacklisted.`);
		}
	},
	unblacklisthelp: [`/unblacklist [username] - Unblacklists the user from the room you are in. Requires: # ~`],

	unblacklistall(target, room, user) {
		room = this.requireRoom();
		this.checkCan('editroom', null, room);

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
		const unblacklisted = Punishments.roomUnblacklistAll(room);
		if (!unblacklisted) return this.errorReply("No users are currently blacklisted in this room to unblacklist.");
		this.addModAction(`All blacklists in this room have been lifted by ${user.name}.`);
		this.modlog('UNBLACKLISTALL');
		this.roomlog(`Unblacklisted users: ${unblacklisted.join(', ')}`);
	},
	unblacklistallhelp: [`/unblacklistall - Unblacklists all blacklisted users in the current room. Requires: # ~`],

	expiringbls: 'showblacklist',
	expiringblacklists: 'showblacklist',
	blacklists: 'showblacklist',
	showbl: 'showblacklist',
	showblacklist(target, room, user, connection, cmd) {
		if (target) room = Rooms.search(target)!;
		if (!room) return this.errorReply(`The room "${target}" was not found.`);
		this.checkCan('mute', null, room);
		const SOON_EXPIRING_TIME = 3 * 30 * 24 * 60 * 60 * 1000; // 3 months

		if (!room.persist) return this.errorReply("This room does not support blacklists.");

		const roomUserids = Punishments.roomUserids.get(room.roomid);
		if (!roomUserids || roomUserids.size === 0) {
			return this.sendReply("This room has no blacklisted users.");
		}
		const blMap = new Map<ID | PunishType, any[]>();
		let ips = '';

		for (const [userid, punishmentList] of roomUserids) {
			for (const punishment of punishmentList) {
				const { type, id, expireTime } = punishment;
				if (type === 'BLACKLIST') {
					if (!blMap.has(id)) blMap.set(id, [expireTime]);
					if (id !== userid) blMap.get(id)!.push(userid);
				}
			}
		}

		if (user.can('ip')) {
			const roomIps = Punishments.roomIps.get(room.roomid);

			if (roomIps) {
				ips = '/ips';
				for (const [ip, punishments] of roomIps) {
					for (const punishment of punishments) {
						const { type, id } = punishment;
						if (type === 'BLACKLIST') {
							if (!blMap.has(id)) blMap.set(id, []);
							blMap.get(id)!.push(ip);
						}
					}
				}
			}
		}

		const soonExpiring = (cmd === 'expiringblacklists' || cmd === 'expiringbls');
		let buf = Utils.html`Blacklist for ${room.title}${soonExpiring ? ` (expiring within 3 months)` : ''}:<br />`;

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
		`/showblacklist OR /showbl - show a list of blacklisted users in the room. Requires: % @ # ~`,
		`/expiringblacklists OR /expiringbls - show a list of blacklisted users from the room whose blacklists are expiring in 3 months or less. Requires: % @ # ~`,
	],
};
