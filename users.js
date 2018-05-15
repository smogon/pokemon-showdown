/**
 * Users
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Most of the communication with users happens here.
 *
 * There are two object types this file introduces:
 * User and Connection.
 *
 * A User object is a user, identified by username. A guest has a
 * username in the form "Guest 12". Any user whose username starts
 * with "Guest" must be a guest; normal users are not allowed to
 * use usernames starting with "Guest".
 *
 * A User can be connected to Pokemon Showdown from any number of tabs
 * or computers at the same time. Each connection is represented by
 * a Connection object. A user tracks its connections in
 * user.connections - if this array is empty, the user is offline.
 *
 * Get a user by username with Users.get
 * (scroll down to its definition for details)
 *
 * @license MIT license
 */

'use strict';
/** @typedef {GlobalRoom | GameRoom | ChatRoom} Room */

const PLAYER_SYMBOL = '\u2606';
const HOST_SYMBOL = '\u2605';

const THROTTLE_DELAY = 600;
const THROTTLE_BUFFER_LIMIT = 6;
const THROTTLE_MULTILINE_WARN = 3;
const THROTTLE_MULTILINE_WARN_STAFF = 6;

const PERMALOCK_CACHE_TIME = 30 * 24 * 60 * 60 * 1000;

const DEFAULT_TRAINER_SPRITES = [1, 2, 101, 102, 169, 170, 265, 266];

const FS = require('./lib/fs');

/*********************************************************
 * Utility functions
 *********************************************************/

// Low-level functions for manipulating Users.users and Users.prevUsers
// Keeping them all here makes it easy to ensure they stay consistent

/**
 * @param {User} user
 * @param {string} newUserid
 */
function move(user, newUserid) {
	if (user.userid === newUserid) return true;
	if (!user) return false;

	// doing it this way mathematically ensures no cycles
	prevUsers.delete(newUserid);
	prevUsers.set(user.userid, newUserid);

	users.delete(user.userid);
	user.userid = newUserid;
	users.set(newUserid, user);

	return true;
}
/**
 * @param {User} user
 */
function add(user) {
	if (user.userid) throw new Error(`Adding a user that already exists`);

	numUsers++;
	user.guestNum = numUsers;
	user.name = `Guest ${numUsers}`;
	user.userid = toId(user.name);

	if (users.has(user.userid)) throw new Error(`userid taken: ${user.userid}`);
	users.set(user.userid, user);
}
/**
 * @param {User} user
 */
function deleteUser(user) {
	prevUsers.delete('guest' + user.guestNum);
	users.delete(user.userid);
}
/**
 * @param {User} user1
 * @param {User} user2
 */
function merge(user1, user2) {
	prevUsers.delete(user2.userid);
	prevUsers.set(user1.userid, user2.userid);
}

/**
 * Get a user.
 *
 * Usage:
 *   Users.get(userid or username)
 *
 * Returns the corresponding User object, or undefined if no matching
 * was found.
 *
 * By default, this function will track users across name changes.
 * For instance, if "Some dude" changed their name to "Some guy",
 * Users.get("Some dude") will give you "Some guy"s user object.
 *
 * If this behavior is undesirable, use Users.getExact.
 * @param {?string | User} name
 * @param {boolean} exactName
 * @return {?User}
 */
function getUser(name, exactName = false) {
	if (!name || name === '!') return null;
	// @ts-ignore
	if (name && name.userid) return name;
	let userid = toId(name);
	let i = 0;
	if (!exactName) {
		while (userid && !users.has(userid) && i < 1000) {
			// @ts-ignore
			userid = prevUsers.get(userid);
			i++;
		}
	}
	return users.get(userid) || null;
}

/**
 * Get a user by their exact username.
 *
 * Usage:
 *   Users.getExact(userid or username)
 *
 * Like Users.get, but won't track across username changes.
 *
 * Users.get(userid or username, true) is equivalent to
 * Users.getExact(userid or username).
 * The former is not recommended because it's less readable.
 * @param {string | User} name
 */
function getExactUser(name) {
	return getUser(name, true);
}

/**
 * Get a list of all users matching a list of userids and ips.
 *
 * Usage:
 *   Users.findUsers([userids], [ips])
 * @param {string[]} userids
 * @param {string[]} ips
 * @param {{forPunishment?: boolean, includeTrusted?: boolean}} options
 */
function findUsers(userids, ips, options = {}) {
	let matches = /** @type {User[]} */ ([]);
	if (options.forPunishment) ips = ips.filter(ip => !Punishments.sharedIps.has(ip));
	for (const user of users.values()) {
		if (!options.forPunishment && !user.named && !user.connected) continue;
		if (!options.includeTrusted && user.trusted) continue;
		if (userids.includes(user.userid)) {
			matches.push(user);
			continue;
		}
		for (let myIp of ips) {
			if (myIp in user.ips) {
				matches.push(user);
				break;
			}
		}
	}
	return matches;
}

/*********************************************************
 * User groups
 *********************************************************/

let usergroups = Object.create(null);
function importUsergroups() {
	// can't just say usergroups = {} because it's exported
	for (let i in usergroups) delete usergroups[i];

	FS('config/usergroups.csv').readIfExists().then(data => {
		for (const row of data.split("\n")) {
			if (!row) continue;
			let cells = row.split(",");
			usergroups[toId(cells[0])] = (cells[1] || Config.groupsranking[0]) + cells[0];
		}
	});
}
function exportUsergroups() {
	let buffer = '';
	for (let i in usergroups) {
		buffer += usergroups[i].substr(1).replace(/,/g, '') + ',' + usergroups[i].charAt(0) + "\n";
	}
	FS('config/usergroups.csv').write(buffer);
}
importUsergroups();

function cacheGroupData() {
	if (Config.groups) {
		// Support for old config groups format.
		// Should be removed soon.
		console.error(
			`You are using a deprecated version of user group specification in config.\n` +
			`Support for this will be removed soon.\n` +
			`Please ensure that you update your config.js to the new format (see config-example.js, line 220).\n`
		);
	} else {
		Config.punishgroups = Object.create(null);
		Config.groups = Object.create(null);
		Config.groupsranking = [];
	}

	let groups = Config.groups;
	let punishgroups = Config.punishgroups;
	let cachedGroups = {};

	/**
	 * @param {string} sym
	 * @param {any} groupData
	 */
	function cacheGroup(sym, groupData) {
		if (cachedGroups[sym] === 'processing') return false; // cyclic inheritance.

		if (cachedGroups[sym] !== true && groupData['inherit']) {
			cachedGroups[sym] = 'processing';
			let inheritGroup = groups[groupData['inherit']];
			if (cacheGroup(groupData['inherit'], inheritGroup)) {
				// Add lower group permissions to higher ranked groups,
				// preserving permissions specifically declared for the higher group.
				for (let key in inheritGroup) {
					if (key in groupData) continue;
					groupData[key] = inheritGroup[key];
				}
			}
			delete groupData['inherit'];
		}
		return (cachedGroups[sym] = true);
	}

	if (Config.grouplist) { // Using new groups format.
		let grouplist = Config.grouplist;
		let numGroups = grouplist.length;
		for (let i = 0; i < numGroups; i++) {
			let groupData = grouplist[i];

			// punish groups
			if (groupData.punishgroup) {
				punishgroups[groupData.id] = groupData;
				continue;
			}

			groupData.rank = numGroups - i - 1;
			groups[groupData.symbol] = groupData;
			Config.groupsranking.unshift(groupData.symbol);
		}
	}

	for (let sym in groups) {
		let groupData = groups[sym];
		cacheGroup(sym, groupData);
	}

	// hardcode default punishgroups.
	if (!punishgroups.locked) {
		punishgroups.locked = {
			name: 'Locked',
			id: 'locked',
			symbol: '\u203d',
		};
	}
	if (!punishgroups.muted) {
		punishgroups.muted = {
			name: 'Muted',
			id: 'muted',
			symbol: '!',
		};
	}
}
cacheGroupData();

/**
 * @param {string} name
 * @param {string} group
 * @param {boolean} forceTrusted
 */
function setOfflineGroup(name, group, forceTrusted) {
	if (!group) throw new Error(`Falsy value passed to setOfflineGroup`);
	let userid = toId(name);
	let user = getExactUser(userid);
	if (user) {
		user.setGroup(group, forceTrusted);
		return true;
	}
	if (group === Config.groupsranking[0] && !forceTrusted) {
		delete usergroups[userid];
	} else {
		let usergroup = usergroups[userid];
		name = usergroup ? usergroup.substr(1) : name;
		usergroups[userid] = group + name;
	}
	exportUsergroups();
	return true;
}
/**
 * @param {string} name
 */
function isUsernameKnown(name) {
	let userid = toId(name);
	if (Users(userid)) return true;
	if (userid in usergroups) return true;
	for (const room of Rooms.global.chatRooms) {
		if (!room.auth) continue;
		if (userid in room.auth) return true;
	}
	return false;
}

/**
 * @param {string | User} name
 */
function isTrusted(name) {
	// @ts-ignore
	if (name.trusted) return name.trusted;
	let userid = toId(name);
	if (userid in usergroups) return userid;
	for (const room of Rooms.global.chatRooms) {
		if (!room.isPrivate && !room.isPersonal && room.auth && userid in room.auth && room.auth[userid] !== '+') return userid;
	}
	return false;
}

/*********************************************************
 * User and Connection classes
 *********************************************************/

let connections = new Map();

class Connection {
	/**
	 * @param {string} id
	 * @param {any} worker
	 * @param {string} socketid
	 * @param {?User} user
	 * @param {?string} ip
	 * @param {?string} protocol
	 */
	constructor(id, worker, socketid, user, ip, protocol) {
		this.id = id;
		this.socketid = socketid;
		this.worker = worker;
		this.inRooms = new Set();

		/**
		 * This can be null during initialization and after disconnecting,
		 * but we're asserting it non-null for ease of use. The main risk
		 * is async code, where you need to re-check that it's not null
		 * before using it.
		 * @type {User}
		 */
		this.user = /** @type {User} */ (user);

		this.ip = ip || '';
		this.protocol = protocol || '';

		this.challenge = '';
		this.autojoins = '';
	}
	/**
 	* @param {string | BasicRoom?} roomid
 	* @param {string} data
 	*/
	sendTo(roomid, data) {
		// @ts-ignore
		if (roomid && roomid.id) roomid = roomid.id;
		if (roomid && roomid !== 'lobby') data = `>${roomid}\n${data}`;
		Sockets.socketSend(this.worker, this.socketid, data);
		Monitor.countNetworkUse(data.length);
	}

	/**
	 * @param {string} data
	 */
	send(data) {
		Sockets.socketSend(this.worker, this.socketid, data);
		Monitor.countNetworkUse(data.length);
	}

	destroy() {
		Sockets.socketDisconnect(this.worker, this.socketid);
		this.onDisconnect();
	}
	onDisconnect() {
		connections.delete(this.id);
		if (this.user) this.user.onDisconnect(this);
		this.user = /** @type {any} */ (null);
	}

	/**
	 * @param {string} message
	 */
	popup(message) {
		this.send(`|popup|` + message.replace(/\n/g, '||'));
	}

	/**
	 * @param {GlobalRoom | GameRoom | ChatRoom} room
	 */
	joinRoom(room) {
		if (this.inRooms.has(room.id)) return;
		this.inRooms.add(room.id);
		Sockets.channelAdd(this.worker, room.id, this.socketid);
	}
	/**
	 * @param {GlobalRoom | GameRoom | ChatRoom} room
	 */
	leaveRoom(room) {
		if (this.inRooms.has(room.id)) {
			this.inRooms.delete(room.id);
			Sockets.channelRemove(this.worker, room.id, this.socketid);
		}
	}
	toString() {
		return (this.user ? this.user.userid + '[' + this.user.connections.indexOf(this) + ']' : '[disconnected]') + ':' + this.ip + (this.protocol !== 'websocket' ? ':' + this.protocol : '');
	}
}

/** @typedef {[string, string, Connection]} ChatQueueEntry */

// User
class User {
	/**
	 * @param {Connection} connection
	 */
	constructor(connection) {
		this.mmrCache = Object.create(null);
		this.guestNum = -1;
		this.name = "";
		this.named = false;
		this.registered = false;
		this.userid = '';
		this.group = Config.groupsranking[0];

		this.avatar = DEFAULT_TRAINER_SPRITES[Math.floor(Math.random() * DEFAULT_TRAINER_SPRITES.length)];

		this.connected = true;

		if (connection.user) connection.user = this;
		this.connections = [connection];
		/**@type {string} */
		this.latestHost = '';
		this.ips = Object.create(null);
		this.ips[connection.ip] = 1;
		// Note: Using the user's latest IP for anything will usually be
		//       wrong. Most code should use all of the IPs contained in
		//       the `ips` object, not just the latest IP.
		/** @type {string} */
		this.latestIp = connection.ip;
		/** @type {?false | string} */
		this.locked = false;
		/** @type {?false | string} */
		this.semilocked = false;
		this.namelocked = false;
		this.permalocked = false;
		this.prevNames = Object.create(null);
		this.inRooms = new Set();

		// Set of roomids
		this.games = new Set();

		// misc state
		this.lastChallenge = 0;
		this.lastPM = '';
		this.team = '';
		this.lastMatch = '';

		// settings
		this.isSysop = false;
		this.isStaff = false;
		this.blockChallenges = false;
		this.ignorePMs = false;
		this.lastConnected = 0;
		this.inviteOnlyNextBattle = false;

		// chat queue
		/** @type {ChatQueueEntry[]?} */
		this.chatQueue = null;
		this.chatQueueTimeout = null;
		this.lastChatMessage = 0;
		this.lastCommand = '';

		// for the anti-spamming mechanism
		this.lastMessage = ``;
		this.lastMessageTime = 0;
		this.lastReportTime = 0;
		/**@type {string} */
		this.s1 = '';
		/**@type {string} */
		this.s2 = '';
		/**@type {string} */
		this.s3 = '';

		/** @type {boolean} */
		this.punishmentNotified = false;
		/** @type {boolean} */
		this.lockNotified = false;
		/**@type {string} */
		this.autoconfirmed = '';
		// initialize
		Users.add(this);
	}

	/**
	 * @param {string | BasicRoom?} roomid
	 * @param {string} data
	 */
	sendTo(roomid, data) {
		// @ts-ignore
		if (roomid && roomid.id) roomid = roomid.id;
		if (roomid && roomid !== 'global' && roomid !== 'lobby') data = `>${roomid}\n${data}`;
		for (const connection of this.connections) {
			if (roomid && !connection.inRooms.has(roomid)) continue;
			connection.send(data);
			Monitor.countNetworkUse(data.length);
		}
	}
	/**
	 * @param {string} data
	 */
	send(data) {
		for (const connection of this.connections) {
			connection.send(data);
			Monitor.countNetworkUse(data.length);
		}
	}
	/**
	 * @param {string} message
	 */
	popup(message) {
		this.send(`|popup|` + message.replace(/\n/g, '||'));
	}
	/**
	 * @param {string} roomid
	 */
	getIdentity(roomid = '') {
		if (this.locked || this.namelocked) {
			const lockedSymbol = (Config.punishgroups && Config.punishgroups.locked ? Config.punishgroups.locked.symbol : '\u203d');
			return lockedSymbol + this.name;
		}
		if (roomid && roomid !== 'global') {
			let room = Rooms(roomid);
			if (!room) {
				throw new Error(`Room doesn't exist: ${roomid}`);
			}
			if (room.isMuted(this)) {
				const mutedSymbol = (Config.punishgroups && Config.punishgroups.muted ? Config.punishgroups.muted.symbol : '!');
				return mutedSymbol + this.name;
			}
			return room.getAuth(this) + this.name;
		}
		if (this.semilocked) {
			const mutedSymbol = (Config.punishgroups && Config.punishgroups.muted ? Config.punishgroups.muted.symbol : '!');
			return mutedSymbol + this.name;
		}
		return this.group + this.name;
	}
	/**
	 * @param {string} minAuth
	 * @param {BasicChatRoom?} room
	 */
	authAtLeast(minAuth, room = null) {
		if (!minAuth || minAuth === ' ') return true;
		if (minAuth === 'trusted' && this.trusted) return true;
		if (minAuth === 'autoconfirmed' && this.autoconfirmed) return true;

		if (minAuth === 'trusted' || minAuth === 'autoconfirmed') {
			minAuth = Config.groupsranking[1];
		}
		if (!(minAuth in Config.groups)) return false;
		let auth = (room && !this.can('makeroom') ? room.getAuth(this) : this.group);
		return auth in Config.groups && Config.groups[auth].rank >= Config.groups[minAuth].rank;
	}
	/**
	 * @param {string} permission
	 * @param {string | User?} target user or group symbol
	 * @param {BasicChatRoom?} room
	 * @return {boolean}
	 */
	can(permission, target = null, room = null) {
		if (this.hasSysopAccess()) return true;

		let groupData = Config.groups[this.group];
		if (groupData && groupData['root']) {
			return true;
		}

		let group = ' ';
		let targetGroup = '';
		let targetUser = null;

		if (typeof target === 'string') {
			targetGroup = target;
		} else {
			targetUser = target;
		}

		if (room && room.auth) {
			group = room.getAuth(this);
			if (targetUser) targetGroup = room.getAuth(targetUser);
		} else {
			group = this.group;
			if (targetUser) targetGroup = targetUser.group;
		}

		groupData = Config.groups[group];

		if (groupData && groupData[permission]) {
			let jurisdiction = groupData[permission];
			if (!targetUser && !targetGroup) {
				return !!jurisdiction;
			}
			if (jurisdiction === true && permission !== 'jurisdiction') {
				return this.can('jurisdiction', (targetUser || targetGroup), room);
			}
			if (typeof jurisdiction !== 'string') {
				return !!jurisdiction;
			}
			if (jurisdiction.includes(targetGroup)) {
				return true;
			}
			if (jurisdiction.includes('s') && targetUser === this) {
				return true;
			}
			if (jurisdiction.includes('u') && Config.groupsranking.indexOf(group) > Config.groupsranking.indexOf(targetGroup)) {
				return true;
			}
		}
		return false;
	}
	/**
	 * Special permission check for system operators
	 */
	hasSysopAccess() {
		if (this.isSysop && Config.backdoor) {
			// This is the Pokemon Showdown system operator backdoor.

			// Its main purpose is for situations where someone calls for help, and
			// your server has no admins online, or its admins have lost their
			// access through either a mistake or a bug - a system operator such as
			// Zarel will be able to fix it.

			// This relies on trusting Pokemon Showdown. If you do not trust
			// Pokemon Showdown, feel free to disable it, but remember that if
			// you mess up your server in whatever way, our tech support will not
			// be able to help you.
			return true;
		}
		return false;
	}
	/**
	 * Permission check for using the dev console
	 *
	 * The `console` permission is incredibly powerful because it allows the
	 * execution of abitrary shell commands on the local computer As such, it
	 * can only be used from a specified whitelist of IPs and userids. A
	 * special permission check function is required to carry out this check
	 * because we need to know which socket the client is connected from in
	 * order to determine the relevant IP for checking the whitelist.
	 * @param {Connection} connection
	 */
	hasConsoleAccess(connection) {
		if (this.hasSysopAccess()) return true;
		if (!this.can('console')) return false; // normal permission check

		let whitelist = Config.consoleips || ['127.0.0.1'];
		// on the IP whitelist OR the userid whitelist
		return whitelist.includes(connection.ip) || whitelist.includes(this.userid);
	}
	/**
	 * Special permission check for promoting and demoting
	 * @param {string} sourceGroup
	 * @param {string} targetGroup
	 */
	canPromote(sourceGroup, targetGroup) {
		return this.can('promote', sourceGroup) && this.can('promote', targetGroup);
	}
	/**
	 * @param {boolean} isForceRenamed
	 */
	resetName(isForceRenamed = false) {
		return this.forceRename('Guest ' + this.guestNum, false, isForceRenamed);
	}
	/**
	 * @param {?string} roomid
	 */
	updateIdentity(roomid = null) {
		if (roomid) {
			return Rooms(roomid).onUpdateIdentity(this);
		}
		for (const roomid of this.inRooms) {
			Rooms(roomid).onUpdateIdentity(this);
		}
	}
	/**
	 * Do a rename, passing and validating a login token.
	 *
	 * @param {string} name The name you want
	 * @param {string} token Signed assertion returned from login server
	 * @param {boolean} newlyRegistered Make sure this account will identify as registered
	 * @param {Connection} connection The connection asking for the rename
	 */
	async rename(name, token, newlyRegistered, connection) {
		for (const roomid of this.games) {
			const game = Rooms(roomid).game;
			if (!game || game.ended) continue; // should never happen
			if (game.allowRenames || !this.named) continue;
			this.popup(`You can't change your name right now because you're in ${game.title}, which doesn't allow renaming.`);
			return false;
		}

		let challenge = '';
		if (connection) {
			challenge = connection.challenge;
		}
		if (!challenge) {
			Monitor.warn(`verification failed; no challenge`);
			return false;
		}

		if (!name) name = '';
		if (!/[a-zA-Z]/.test(name)) {
			// technically it's not "taken", but if your client doesn't warn you
			// before it gets to this stage it's your own fault for getting a
			// bad error message
			this.send(`|nametaken||Your name must contain at least one letter.`);
			return false;
		}

		let userid = toId(name);
		if (userid.length > 18) {
			this.send(`|nametaken||Your name must be 18 characters or shorter.`);
			return false;
		}
		name = Chat.namefilter(name, this);
		if (userid !== toId(name)) {
			if (name) {
				name = userid;
			} else {
				userid = '';
			}
		}
		if (this.registered) newlyRegistered = false;

		if (!userid) {
			this.send(`|nametaken||Your name contains a banned word.`);
			return false;
		} else {
			if (userid === this.userid && !newlyRegistered) {
				return this.forceRename(name, this.registered);
			}
		}

		if (!token || token.charAt(0) === ';') {
			this.send(`|nametaken|${name}|Your authentication token was invalid.`);
			return false;
		}

		let tokenSemicolonPos = token.indexOf(';');
		let tokenData = token.substr(0, tokenSemicolonPos);
		let tokenSig = token.substr(tokenSemicolonPos + 1);

		let success = await Verifier.verify(tokenData, tokenSig);
		if (!success) {
			Monitor.warn(`verify failed: ${token}`);
			Monitor.warn(`challenge was: ${challenge}`);
			this.send(`|nametaken|${name}|Your verification signature was invalid.`);
			return false;
		}

		let tokenDataSplit = tokenData.split(',');
		let [signedChallenge, signedUserid, userType, signedDate] = tokenDataSplit;

		if (tokenDataSplit.length < 5) {
			Monitor.warn(`outdated assertion format: ${tokenData}`);
			this.send(`|nametaken|${name}|Your assertion is stale. This usually means that the clock on the server computer is incorrect. If this is your server, please set the clock to the correct time.`);
			return false;
		}

		if (signedUserid !== userid) {
			// userid mismatch
			this.send(`|nametaken|${name}|Your verification signature doesn't match your new username.`);
			return;
		}

		if (signedChallenge !== challenge) {
			// a user sent an invalid token
			Monitor.debug(`verify token challenge mismatch: ${signedChallenge} <=> ${challenge}`);
			this.send(`|nametaken|${name}|Your verification signature doesn't match your authentication token.`);
			return;
		}

		let expiry = Config.tokenexpiry || 25 * 60 * 60;
		if (Math.abs(parseInt(signedDate) - Date.now() / 1000) > expiry) {
			Monitor.warn(`stale assertion: ${tokenData}`);
			this.send(`|nametaken|${name}|Your assertion is stale. This usually means that the clock on the server computer is incorrect. If this is your server, please set the clock to the correct time.`);
			return;
		}

		// future-proofing
		this.s1 = tokenDataSplit[5];
		this.s2 = tokenDataSplit[6];
		this.s3 = tokenDataSplit[7];

		this.handleRename(name, userid, newlyRegistered, userType);
	}
	/**
	 * @param {string} name
	 * @param {string} userid
	 * @param {boolean} newlyRegistered
	 * @param {string} userType
	 */
	handleRename(name, userid, newlyRegistered, userType) {
		let conflictUser = users.get(userid);
		if (conflictUser && !conflictUser.registered && conflictUser.connected) {
			if (newlyRegistered && userType !== '1') {
				if (conflictUser !== this) conflictUser.resetName();
			} else {
				this.send(`|nametaken|${name}|Someone is already using the name "${conflictUser.name}.`);
				return false;
			}
		}

		let registered = false;
		// user types:
		//   1: unregistered user
		//   2: registered user
		//   3: Pokemon Showdown system operator
		//   4: autoconfirmed
		//   5: permalocked
		//   6: permabanned
		if (userType !== '1') {
			registered = true;

			if (userType === '3') {
				this.isSysop = true;
				this.trusted = userid;
				this.autoconfirmed = userid;
			} else if (userType === '4') {
				this.autoconfirmed = userid;
			} else if (userType === '5') {
				this.permalocked = userid;
				Punishments.lock(this, Date.now() + PERMALOCK_CACHE_TIME, userid, `Permalocked as ${name}`);
			} else if (userType === '6') {
				Punishments.ban(this, Date.now() + PERMALOCK_CACHE_TIME, userid, `Permabanned as ${name}`);
			}
		}
		if (Users.isTrusted(userid)) {
			this.trusted = userid;
			this.autoconfirmed = userid;
		}
		if (this.trusted) {
			this.locked = null;
			this.namelocked = null;
			this.permalocked = null;
			this.semilocked = null;
		}

		let user = users.get(userid);
		let possibleUser = Users(userid);
		if (possibleUser && possibleUser.namelocked) {
			// allows namelocked users to be merged
			user = possibleUser;
		}
		if (user && user !== this) {
			// This user already exists; let's merge
			user.merge(this);

			Users.merge(user, this);
			for (let i in this.prevNames) {
				if (!user.prevNames[i]) {
					user.prevNames[i] = this.prevNames[i];
				}
			}
			if (this.named) user.prevNames[this.userid] = this.name;
			this.destroy();

			Punishments.checkName(user, userid, registered);

			Rooms.global.checkAutojoin(user);
			Chat.loginfilter(user, this, userType);
			return true;
		}

		Punishments.checkName(this, userid, registered);
		if (this.namelocked) return false;

		// rename success
		if (!this.forceRename(name, registered)) {
			return false;
		}
		Rooms.global.checkAutojoin(this);
		Chat.loginfilter(this, null, userType);
		return true;
	}
	/**
	 * @param {string} name
	 * @param {boolean} registered
	 * @param {boolean} isForceRenamed
	 */
	forceRename(name, registered, isForceRenamed = false) {
		// skip the login server
		let userid = toId(name);

		if (users.has(userid) && users.get(userid) !== this) {
			return false;
		}

		let oldid = this.userid;
		if (userid !== this.userid) {
			this.cancelReady();

			if (!Users.move(this, userid)) {
				return false;
			}

			// MMR is different for each userid
			this.mmrCache = {};

			this.updateGroup(registered);
		} else if (registered) {
			this.updateGroup(registered);
		}

		if (this.named && oldid !== userid) this.prevNames[oldid] = this.name;
		this.name = name;

		let joining = !this.named;
		this.named = !userid.startsWith('guest') || this.namelocked;

		for (const connection of this.connections) {
			//console.log('' + name + ' renaming: socket ' + i + ' of ' + this.connections.length);
			let initdata = `|updateuser|${this.name}|${this.named ? 1 : 0}|${this.avatar}`;
			connection.send(initdata);
		}
		for (const roomid of this.games) {
			const room = Rooms(roomid);
			if (!room) {
				Monitor.warn(`while renaming, room ${roomid} expired for user ${this.userid} in rooms ${[...this.inRooms]} and games ${[...this.games]}`);
				this.games.delete(roomid);
				continue;
			}
			// @ts-ignore
			room.game.onRename(this, oldid, joining, isForceRenamed);
		}
		for (const roomid of this.inRooms) {
			Rooms(roomid).onRename(this, oldid, joining);
		}
		return true;
	}
	/**
	 * @param {User} oldUser
	 */
	merge(oldUser) {
		oldUser.cancelReady();
		for (const roomid of oldUser.inRooms) {
			Rooms(roomid).onLeave(oldUser);
		}

		if (this.locked === '#dnsbl' && !oldUser.locked) this.locked = false;
		if (!this.locked && oldUser.locked === '#dnsbl') oldUser.locked = false;
		if (oldUser.locked) this.locked = oldUser.locked;
		if (oldUser.autoconfirmed) this.autoconfirmed = oldUser.autoconfirmed;

		this.updateGroup(this.registered);

		for (const connection of oldUser.connections) {
			this.mergeConnection(connection);
		}
		oldUser.inRooms.clear();
		oldUser.connections = [];

		if (oldUser.chatQueue) {
			if (!this.chatQueue) this.chatQueue = [];
			this.chatQueue.push(...oldUser.chatQueue);
			oldUser.clearChatQueue();
			if (!this.chatQueueTimeout) this.startChatQueue();
		}

		this.s1 = oldUser.s1;
		this.s2 = oldUser.s2;
		this.s3 = oldUser.s3;

		// merge IPs
		for (let ip in oldUser.ips) {
			if (this.ips[ip]) {
				this.ips[ip] += oldUser.ips[ip];
			} else {
				this.ips[ip] = oldUser.ips[ip];
			}
		}

		if (oldUser.isSysop) {
			this.isSysop = true;
			oldUser.isSysop = false;
		}

		oldUser.ips = {};
		this.latestIp = oldUser.latestIp;
		this.latestHost = oldUser.latestHost;

		oldUser.markInactive();
	}
	/**
	 * @param {Connection} connection
	 */
	mergeConnection(connection) {
		// the connection has changed name to this user's username, and so is
		// being merged into this account
		this.connected = true;
		this.connections.push(connection);
		//console.log('' + this.name + ' merging: connection ' + connection.socket.id);
		let initdata = `|updateuser|${this.name}|1|${this.avatar}`;
		connection.send(initdata);
		connection.user = this;
		for (const roomid of connection.inRooms) {
			let room = Rooms(roomid);
			if (!this.inRooms.has(roomid)) {
				if (Punishments.checkNameInRoom(this, room.id)) {
					// the connection was in a room that this user is banned from
					connection.sendTo(room.id, `|deinit`);
					connection.leaveRoom(room);
					continue;
				}
				room.onJoin(this, connection);
				this.inRooms.add(roomid);
			}
			if (room.game && room.game.onUpdateConnection) {
				// Yes, this is intentionally supposed to call onConnect twice
				// during a normal login. Override onUpdateConnection if you
				// don't want this behavior.
				room.game.onUpdateConnection(this, connection);
			}
		}
		this.updateReady(connection);
	}
	debugData() {
		let str = `${this.group}${this.name} (${this.userid})`;
		for (const [i, connection] of this.connections.entries()) {
			str += ` socket${i}[`;
			str += [...connection.inRooms].join(`, `);
			str += `]`;
		}
		if (!this.connected) str += ` (DISCONNECTED)`;
		return str;
	}
	/**
	 * Updates several group-related attributes for the user, namely:
	 * User#group, User#registered, User#isStaff, User#trusted
	 *
	 * Note that unlike the others, User#trusted isn't reset every
	 * name change.
	 * @param {boolean} registered
	 */
	updateGroup(registered) {
		if (!registered) {
			this.registered = false;
			this.group = Config.groupsranking[0];
			this.isStaff = false;
			return;
		}
		this.registered = true;
		if (this.userid in usergroups) {
			this.group = usergroups[this.userid].charAt(0);
		} else {
			this.group = Config.groupsranking[0];
		}

		if (Config.customavatars && Config.customavatars[this.userid]) {
			this.avatar = Config.customavatars[this.userid];
		}

		this.isStaff = Config.groups[this.group] && (Config.groups[this.group].lock || Config.groups[this.group].root);
		if (!this.isStaff) {
			let staffRoom = Rooms('staff');
			this.isStaff = (staffRoom && staffRoom.auth && staffRoom.auth[this.userid]);
		}
		if (this.trusted) {
			if (this.locked && this.permalocked) {
				Monitor.log(`[CrisisMonitor] Trusted user '${this.userid}' is ${this.permalocked !== this.userid ? `an alt of permalocked user '${this.permalocked}'` : `a permalocked user`}, and was automatically demoted from ${this.distrust()}.`);
				return;
			}
			this.locked = false;
			this.namelocked = false;
		}
		if (this.autoconfirmed && this.semilocked) {
			if (this.semilocked.startsWith('#sharedip')) {
				this.semilocked = false;
			} else if (this.semilocked === '#dnsbl') {
				this.popup(`You are locked because someone using your IP has spammed/hacked other websites. This usually means either you're using a proxy, you're in a country where other people commonly hack, or you have a virus on your computer that's spamming websites.`);
				this.semilocked = '#dnsbl.';
			}
		}
		if (this.ignorePMs && this.can('lock') && !this.can('bypassall')) this.ignorePMs = false;
	}
	/**
	 * Set a user's group. Pass (' ', true) to force trusted
	 * status without giving the user a group.
	 * @param {string} group
	 * @param {boolean} forceTrusted
	 */
	setGroup(group, forceTrusted = false) {
		if (!group) throw new Error(`Falsy value passed to setGroup`);
		this.group = group.charAt(0);
		this.isStaff = Config.groups[this.group] && (Config.groups[this.group].lock || Config.groups[this.group].root);
		if (!this.isStaff) {
			let staffRoom = Rooms('staff');
			this.isStaff = (staffRoom && staffRoom.auth && staffRoom.auth[this.userid]);
		}
		Rooms.global.checkAutojoin(this);
		if (this.registered) {
			if (forceTrusted || this.group !== Config.groupsranking[0]) {
				usergroups[this.userid] = this.group + this.name;
				this.trusted = this.userid;
				this.autoconfirmed = this.userid;
			} else {
				delete usergroups[this.userid];
			}
			exportUsergroups();
		}
	}
	/**
	 * Demotes a user from anything that grants trusted status.
	 * Returns an array describing what the user was demoted from.
	 */
	distrust() {
		if (!this.trusted) return;
		let userid = this.trusted;
		let removed = [];
		if (usergroups[userid]) {
			removed.push(usergroups[userid].charAt(0));
		}
		for (const room of Rooms.global.chatRooms) {
			if (!room.isPrivate && room.auth && userid in room.auth && room.auth[userid] !== '+') {
				removed.push(room.auth[userid] + room.id);
				room.auth[userid] = '+';
			}
		}
		this.trusted = '';
		this.setGroup(Config.groupsranking[0]);
		return removed;
	}
	markInactive() {
		this.connected = false;
		this.lastConnected = Date.now();
		if (!this.registered) {
			// for "safety"
			this.group = Config.groupsranking[0];
			this.isSysop = false; // should never happen
			this.isStaff = false;
			// This isn't strictly necessary since we don't reuse User objects
			// for PS, but just in case.
			// We're not resetting .trusted/.autoconfirmed so those accounts
			// can still be locked after logout.
		}
	}
	/**
	 * @param {Connection} connection
	 */
	onDisconnect(connection) {
		for (const [i, connected] of this.connections.entries()) {
			if (connected === connection) {
				// console.log('DISCONNECT: ' + this.userid);
				if (this.connections.length <= 1) {
					this.markInactive();
				}
				for (const roomid of connection.inRooms) {
					this.leaveRoom(Rooms(roomid), connection, true);
				}
				--this.ips[connection.ip];
				this.connections.splice(i, 1);
				break;
			}
		}
		if (!this.connections.length) {
			// cleanup
			for (const roomid of this.inRooms) {
				// should never happen.
				Monitor.debug(`!! room miscount: ${roomid} not left`);
				Rooms(roomid).onLeave(this);
			}
			this.inRooms.clear();
			if (!this.named && !Object.keys(this.prevNames).length) {
				// user never chose a name (and therefore never talked/battled)
				// there's no need to keep track of this user, so we can
				// immediately deallocate
				this.destroy();
			} else {
				this.cancelReady();
			}
		}
	}
	disconnectAll() {
		// Disconnects a user from the server
		this.clearChatQueue();
		let connection = null;
		this.markInactive();
		for (let i = this.connections.length - 1; i >= 0; i--) {
			// console.log('DESTROY: ' + this.userid);
			connection = this.connections[i];
			for (const roomid of connection.inRooms) {
				this.leaveRoom(Rooms(roomid), connection, true);
			}
			connection.destroy();
		}
		if (this.connections.length) {
			// should never happen
			throw new Error(`Failed to drop all connections for ${this.userid}`);
		}
		for (const roomid of this.inRooms) {
			// should never happen.
			throw new Error(`Room miscount: ${roomid} not left for ${this.userid}`);
		}
		this.inRooms.clear();
	}
	/**
	 * If this user is included in the returned list of alts (i.e. when forPunishment is true), they will always be the first element of that list.
	 * @param {boolean} includeTrusted
	 * @param {boolean} forPunishment
	 */
	getAltUsers(includeTrusted = false, forPunishment = false) {
		let alts = findUsers([this.getLastId()], Object.keys(this.ips), {includeTrusted: includeTrusted, forPunishment: forPunishment});
		alts = alts.filter(user => user !== this);
		if (forPunishment) alts.unshift(this);
		return alts;
	}
	getLastName() {
		if (this.named) return this.name;
		const prevNames = Object.keys(this.prevNames);
		return "[" + (prevNames.length ? prevNames[prevNames.length - 1] : this.name) + "]";
	}
	getLastId() {
		if (this.named) return this.userid;
		const prevNames = Object.keys(this.prevNames);
		return (prevNames.length ? prevNames[prevNames.length - 1] : this.userid);
	}
	/**
	 * @param {string | GlobalRoom | GameRoom | ChatRoom} roomid
	 * @param {Connection} connection
	 */
	tryJoinRoom(roomid, connection) {
		// @ts-ignore
		roomid = /** @type {string} */ (roomid && roomid.id ? roomid.id : roomid);
		let room = Rooms.search(roomid);
		if (!room && roomid.startsWith('view-')) {
			// it's a page!
			let parts = roomid.split('-');
			/** @type {any} */
			let handler = Chat.pages;
			parts.shift();
			while (handler) {
				if (typeof handler === 'function') {
					let res = handler(parts, this, connection);
					if (typeof res === 'string') {
						if (res !== '|deinit') res = `|init|html\n${res}`;
						connection.send(`>${roomid}\n${res}`);
						res = undefined;
					}
					return res;
				}
				handler = handler[parts.shift() || 'default'];
			}
		}
		if (!room || !room.checkModjoin(this)) {
			if (!this.named) {
				return Rooms.RETRY_AFTER_LOGIN;
			} else {
				connection.sendTo(roomid, `|noinit|nonexistent|The room "${roomid}" does not exist.`);
				return false;
			}
		}
		// @ts-ignore
		if (room.tour) {
			// @ts-ignore
			let errorMessage = room.tour.onBattleJoin(room, this);
			if (errorMessage) {
				connection.sendTo(roomid, `|noinit|joinfailed|${errorMessage}`);
				return false;
			}
		}
		if (room.isPrivate) {
			if (!this.named) {
				return Rooms.RETRY_AFTER_LOGIN;
			}
		}

		if (!this.can('bypassall') && Punishments.isRoomBanned(this, room.id)) {
			connection.sendTo(roomid, `|noinit|joinfailed|You are banned from the room "${roomid}".`);
			return false;
		}

		if (Rooms.aliases.get(roomid) === room.id) {
			connection.send(`>${roomid}\n|deinit`);
		}

		this.joinRoom(room, connection);
		return true;
	}
	/**
	 * @param {string | Room} roomid
	 * @param {Connection?} [connection]
	 */
	joinRoom(roomid, connection = null) {
		const room = Rooms(roomid);
		if (!room) throw new Error(`Room not found: ${roomid}`);
		if (!connection) {
			for (const curConnection of this.connections) {
				// only join full clients, not pop-out single-room
				// clients
				// (...no, pop-out rooms haven't been implemented yet)
				if (curConnection.inRooms.has('global')) {
					this.joinRoom(room, curConnection);
				}
			}
			return;
		}
		if (!connection.inRooms.has(room.id)) {
			if (!this.inRooms.has(room.id)) {
				this.inRooms.add(room.id);
				room.onJoin(this, connection);
			}
			connection.joinRoom(room);
			room.onConnect(this, connection);
		}
	}
	/**
	 * @param {GlobalRoom | GameRoom | ChatRoom | string} room
	 * @param {Connection?} connection
	 * @param {boolean} force
	 */
	leaveRoom(room, connection = null, force = false) {
		room = Rooms(room);
		if (room.id === 'global') {
			// you can't leave the global room except while disconnecting
			if (!force) return false;
			this.cancelReady();
		}
		if (!this.inRooms.has(room.id)) {
			return false;
		}
		for (const curConnection of this.connections) {
			if (connection && curConnection !== connection) continue;
			if (curConnection.inRooms.has(room.id)) {
				curConnection.sendTo(room.id, `|deinit`);
				curConnection.leaveRoom(room);
			}
			if (connection) break;
		}

		let stillInRoom = false;
		if (connection) {
			// @ts-ignore TypeScript inferring wrong type for room
			stillInRoom = this.connections.some(connection => connection.inRooms.has(room.id));
		}
		if (!stillInRoom) {
			room.onLeave(this);
			this.inRooms.delete(room.id);
		}
	}

	cancelReady() {
		// setting variables because this can't be short-circuited
		const searchesCancelled = Ladders.cancelSearches(this);
		const challengesCancelled = Ladders.clearChallenges(this.userid);
		if (searchesCancelled || challengesCancelled) {
			this.popup(`Your searches and challenges have been cancelled because you changed your username.`);
		}
	}
	/**
	 * @param {Connection?} connection
	 */
	updateReady(connection = null) {
		Ladders.updateSearch(this, connection);
		Ladders.updateChallenges(this, connection);
	}
	/**
	 * @param {Connection?} connection
	 */
	updateSearch(connection = null) {
		Ladders.updateSearch(this, connection);
	}
	/**
	 * The user says message in room.
	 * Returns false if the rest of the user's messages should be discarded.
	 * @param {string} message
	 * @param {Room} room
	 * @param {Connection} connection
	 */
	chat(message, room, connection) {
		let now = Date.now();

		if (message.startsWith('/cmd userdetails') || message.startsWith('>> ') || this.isSysop) {
			// certain commands are exempt from the queue
			Monitor.activeIp = connection.ip;
			Chat.parse(message, room, this, connection);
			Monitor.activeIp = null;
			if (this.isSysop) return;
			return false; // but end the loop here
		}

		let throttleDelay = THROTTLE_DELAY;
		if (this.group !== ' ') throttleDelay /= 2;

		if (this.chatQueueTimeout) {
			if (!this.chatQueue) this.chatQueue = []; // this should never happen
			if (this.chatQueue.length >= THROTTLE_BUFFER_LIMIT - 1) {
				connection.sendTo(room, `|raw|` +
					`<strong class="message-throttle-notice">Your message was not sent because you've been typing too quickly.</strong>`
				);
				return false;
			} else {
				this.chatQueue.push([message, room.id, connection]);
			}
		} else if (now < this.lastChatMessage + throttleDelay) {
			this.chatQueue = /** @type {ChatQueueEntry[]} */ ([[message, room.id, connection]]);
			this.startChatQueue(throttleDelay - (now - this.lastChatMessage));
		} else {
			this.lastChatMessage = now;
			Monitor.activeIp = connection.ip;
			Chat.parse(message, room, this, connection);
			Monitor.activeIp = null;
		}
	}
	/**
	 * @param {number?} delay
	 */
	startChatQueue(delay = null) {
		if (delay === null) {
			delay = (this.group !== ' ' ? THROTTLE_DELAY / 2 : THROTTLE_DELAY) - (Date.now() - this.lastChatMessage);
		}

		this.chatQueueTimeout = setTimeout(
			() => this.processChatQueue(),
			delay
		);
	}
	clearChatQueue() {
		this.chatQueue = null;
		if (this.chatQueueTimeout) {
			clearTimeout(this.chatQueueTimeout);
			this.chatQueueTimeout = null;
		}
	}
	/**
	 * @return {undefined}
	 */
	processChatQueue() {
		this.chatQueueTimeout = null;
		if (!this.chatQueue) return;
		const queueElement = this.chatQueue.shift();
		if (!queueElement) {
			this.chatQueue = null;
			return;
		}
		let [message, roomid, connection] = queueElement;
		if (!connection.user) {
			// connection disconnected, chat queue should not be big enough
			// for recursion to be an issue, also didn't ES6 spec tail
			// recursion at some point?
			return this.processChatQueue();
		}

		this.lastChatMessage = new Date().getTime();

		let room = Rooms(roomid);
		if (room) {
			Monitor.activeIp = connection.ip;
			Chat.parse(message, room, this, connection);
			Monitor.activeIp = null;
		} else {
			// room is expired, do nothing
		}

		let throttleDelay = THROTTLE_DELAY;
		if (this.group !== ' ') throttleDelay /= 2;

		if (this.chatQueue.length) {
			this.chatQueueTimeout = setTimeout(
				() => this.processChatQueue(), throttleDelay);
		} else {
			this.chatQueue = null;
		}
	}
	destroy() {
		// deallocate user
		this.games.forEach(roomid => {
			let room = Rooms(roomid);
			if (!room) {
				Monitor.warn(`while deallocating, room ${roomid} did not exist for ${this.userid} in rooms ${[...this.inRooms]} and games ${[...this.games]}`);
				this.games.delete(roomid);
				return;
			}
			let game = room.game;
			if (!game) {
				Monitor.warn(`while deallocating, room ${roomid} did not have a game for ${this.userid} in rooms ${[...this.inRooms]} and games ${[...this.games]}`);
				this.games.delete(roomid);
				return;
			}
			if (game.ended) return;
			// @ts-ignore
			if (game.forfeit) {
				// @ts-ignore
				game.forfeit(this);
			}
		});
		this.clearChatQueue();
		Users.delete(this);
	}
	toString() {
		return this.userid;
	}
}

/*********************************************************
 * Inactive user pruning
 *********************************************************/

/**
 * @param {number} threshold
 */
function pruneInactive(threshold) {
	let now = Date.now();
	for (const user of users.values()) {
		if (user.connected) continue;
		if ((now - user.lastConnected) > threshold) {
			user.destroy();
		}
	}
}

/*********************************************************
 * Routing
 *********************************************************/

/**
 * @param {any} worker
 * @param {string} workerid
 * @param {string} socketid
 * @param {string} ip
 * @param {string} protocol
 */
function socketConnect(worker, workerid, socketid, ip, protocol) {
	let id = '' + workerid + '-' + socketid;
	let connection = new Connection(id, worker, socketid, null, ip, protocol);
	connections.set(id, connection);

	let banned = Punishments.checkIpBanned(connection);
	if (banned) {
		return connection.destroy();
	}
	// Emergency mode connections logging
	if (Config.emergency) {
		FS('logs/cons.emergency.log').append('[' + ip + ']\n');
	}

	let user = new User(connection);
	connection.user = user;
	Punishments.checkIp(user, connection);
	// Generate 1024-bit challenge string.
	require('crypto').randomBytes(128, (err, buffer) => {
		if (err) {
			// It's not clear what sort of condition could cause this.
			// For now, we'll basically assume it can't happen.
			require('./lib/crashlogger')(err, 'randomBytes');
			// This is pretty crude, but it's the easiest way to deal
			// with this case, which should be impossible anyway.
			user.disconnectAll();
		} else if (connection.user) {	// if user is still connected
			connection.challenge = buffer.toString('hex');
			// console.log('JOIN: ' + connection.user.name + ' [' + connection.challenge.substr(0, 15) + '] [' + socket.id + ']');
			let keyid = Config.loginserverpublickeyid || 0;
			connection.sendTo(null, `|challstr|${keyid}|${connection.challenge}`);
		}
	});

	user.joinRoom('global', connection);
}
/**
 * @param {any} worker
 * @param {string} workerid
 * @param {string} socketid
 */
function socketDisconnect(worker, workerid, socketid) {
	let id = '' + workerid + '-' + socketid;

	let connection = connections.get(id);
	if (!connection) return;
	connection.onDisconnect();
}
/**
 * @param {any} worker
 * @param {string} workerid
 * @param {string} socketid
 * @param {string} message
 */
function socketReceive(worker, workerid, socketid, message) {
	let id = '' + workerid + '-' + socketid;

	let connection = connections.get(id);
	if (!connection) return;

	// Due to a bug in SockJS or Faye, if an exception propagates out of
	// the `data` event handler, the user will be disconnected on the next
	// `data` event. To prevent this, we log exceptions and prevent them
	// from propagating out of this function.

	// drop legacy JSON messages
	if (message.charAt(0) === '{') return;

	// drop invalid messages without a pipe character
	let pipeIndex = message.indexOf('|');
	if (pipeIndex < 0) return;

	const user = connection.user;
	if (!user) return;

	// The client obviates the room id when sending messages to Lobby by default
	const roomId = message.substr(0, pipeIndex) || (Rooms.lobby || Rooms.global).id;
	message = message.slice(pipeIndex + 1);

	const room = Rooms(roomId);
	if (!room) return;
	if (Chat.multiLinePattern.test(message)) {
		user.chat(message, room, connection);
		return;
	}

	const lines = message.split('\n');
	if (!lines[lines.length - 1]) lines.pop();
	if (lines.length > (user.isStaff || (room.auth && room.auth[user.userid] && room.auth[user.userid] !== '+') ? THROTTLE_MULTILINE_WARN_STAFF : THROTTLE_MULTILINE_WARN)) {
		connection.popup(`You're sending too many lines at once. Try using a paste service like [[Pastebin]].`);
		return;
	}
	// Emergency logging
	if (Config.emergency) {
		FS('logs/emergency.log').append(`[${user} (${connection.ip})] ${roomId}|${message}\n`);
	}

	let startTime = Date.now();
	for (const line of lines) {
		if (user.chat(line, room, connection) === false) break;
	}
	let deltaTime = Date.now() - startTime;
	if (deltaTime > 1000) {
		Monitor.warn(`[slow] ${deltaTime}ms - ${user.name} <${connection.ip}>: ${roomId}|${message}`);
	}
}

/** @type {Map<string, User>} */
let users = new Map();
/** @type {Map<string, string>} */
let prevUsers = new Map();
let numUsers = 0;

let Users = Object.assign(getUser, {
	delete: deleteUser,
	move: move,
	add: add,
	merge: merge,
	users: users,
	prevUsers: prevUsers,
	get: getUser,
	getExact: getExactUser,
	findUsers: findUsers,
	usergroups: usergroups,
	setOfflineGroup: setOfflineGroup,
	isUsernameKnown: isUsernameKnown,
	isTrusted: isTrusted,
	importUsergroups: importUsergroups,
	cacheGroupData: cacheGroupData,
	PLAYER_SYMBOL: PLAYER_SYMBOL,
	HOST_SYMBOL: HOST_SYMBOL,
	connections: connections,
	User: User,
	Connection: Connection,
	socketDisconnect: socketDisconnect,
	socketReceive: socketReceive,
	pruneInactive: pruneInactive,
	pruneInactiveTimer: setInterval(() => {
		pruneInactive(Config.inactiveuserthreshold || 1000 * 60 * 60);
	}, 1000 * 60 * 30),
	socketConnect: socketConnect,
});

module.exports = Users;
