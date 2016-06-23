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

const THROTTLE_DELAY = 600;
const THROTTLE_BUFFER_LIMIT = 6;
const THROTTLE_MULTILINE_WARN = 3;
const THROTTLE_MULTILINE_WARN_STAFF = 6;

const PERMALOCK_CACHE_TIME = 30 * 24 * 60 * 60 * 1000;

const fs = require('fs');

let Users = module.exports = getUser;

// basic initialization
let users = Users.users = new Map();
let prevUsers = Users.prevUsers = new Map();
let numUsers = 0;

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
 */
function getUser(name, exactName) {
	if (!name || name === '!') return null;
	if (name && name.userid) return name;
	let userid = toId(name);
	let i = 0;
	if (!exactName) {
		while (userid && !users.has(userid) && i < 1000) {
			userid = prevUsers.get(userid);
			i++;
		}
	}
	return users.get(userid);
}
Users.get = getUser;

/**
 * Get a user by their exact username.
 *
 * Usage:
 *   Users.getExact(userid or username)
 *
 * Like Users.get, but won't track across username changes.
 *
 * You can also pass a boolean as Users.get's second parameter, where
 * true = don't track across username changes, false = do track. This
 * is not recommended since it's less readable.
 */
let getExactUser = Users.getExact = function (name) {
	return getUser(name, true);
};

/*********************************************************
 * User groups
 *********************************************************/

let usergroups = Users.usergroups = Object.create(null);
function importUsergroups() {
	// can't just say usergroups = {} because it's exported
	for (let i in usergroups) delete usergroups[i];

	fs.readFile('config/usergroups.csv', (err, data) => {
		if (err) return;
		data = ('' + data).split("\n");
		for (let i = 0; i < data.length; i++) {
			if (!data[i]) continue;
			let row = data[i].split(",");
			usergroups[toId(row[0])] = (row[1] || Config.groupsranking[0]) + row[0];
		}
	});
}
function exportUsergroups() {
	let buffer = '';
	for (let i in usergroups) {
		buffer += usergroups[i].substr(1).replace(/,/g, '') + ',' + usergroups[i].charAt(0) + "\n";
	}
	fs.writeFile('config/usergroups.csv', buffer);
}
importUsergroups();

function cacheGroupData() {
	if (Config.groups) {
		// Support for old config groups format.
		// Should be removed soon.
		console.log(
			"You are using a deprecated version of user group specification in config.\n" +
			"Support for this will be removed soon.\n" +
			"Please ensure that you update your config.js to the new format (see config-example.js, line 220)\n"
		);
	} else {
		Config.groups = Object.create(null);
		Config.groupsranking = [];
	}
	let groups = Config.groups;
	let cachedGroups = {};

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
			groupData.rank = numGroups - i - 1;
			groups[groupData.symbol] = groupData;
			Config.groupsranking.unshift(groupData.symbol);
		}
	}

	for (let sym in groups) {
		let groupData = groups[sym];
		cacheGroup(sym, groupData);
	}
}
cacheGroupData();

Users.setOfflineGroup = function (name, group, forceConfirmed) {
	if (!group) throw new Error("Falsy value passed to setOfflineGroup");
	let userid = toId(name);
	let user = getExactUser(userid);
	if (user) {
		user.setGroup(group, forceConfirmed);
		return true;
	}
	if (group === Config.groupsranking[0] && !forceConfirmed) {
		delete usergroups[userid];
	} else {
		let usergroup = usergroups[userid];
		name = usergroup ? usergroup.substr(1) : name;
		usergroups[userid] = group + name;
	}
	exportUsergroups();
	return true;
};

Users.isUsernameKnown = function (name) {
	let userid = toId(name);
	if (Users(userid)) return true;
	if (userid in usergroups) return true;
	for (let i = 0; i < Rooms.global.chatRooms.length; i++) {
		let curRoom = Rooms.global.chatRooms[i];
		if (!curRoom.auth) continue;
		if (userid in curRoom.auth) return true;
	}
	return false;
};

Users.importUsergroups = importUsergroups;
Users.cacheGroupData = cacheGroupData;

/*********************************************************
 * User and Connection classes
 *********************************************************/

let connections = Users.connections = new Map();

class Connection {
	constructor(id, worker, socketid, user, ip) {
		this.id = id;
		this.socketid = socketid;
		this.worker = worker;
		this.rooms = {};

		this.user = user;

		this.ip = ip || '';

		this.autojoin = '';
	}

	sendTo(roomid, data) {
		if (roomid && roomid.id) roomid = roomid.id;
		if (roomid && roomid !== 'lobby') data = '>' + roomid + '\n' + data;
		Sockets.socketSend(this.worker, this.socketid, data);
		Monitor.countNetworkUse(data.length);
	}

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
		this.user = null;
	}

	popup(message) {
		this.send('|popup|' + message.replace(/\n/g, '||'));
	}

	joinRoom(room) {
		if (room.id in this.rooms) return;
		this.rooms[room.id] = room;
		Sockets.channelAdd(this.worker, room.id, this.socketid);
	}
	leaveRoom(room) {
		if (room.id in this.rooms) {
			delete this.rooms[room.id];
			Sockets.channelRemove(this.worker, room.id, this.socketid);
		}
	}
}

// User
class User {
	constructor(connection) {
		numUsers++;
		this.mmrCache = Object.create(null);
		this.guestNum = numUsers;
		this.name = 'Guest ' + numUsers;
		this.named = !!this.namelocked;
		this.registered = false;
		this.userid = toId(this.name);
		this.group = Config.groupsranking[0];

		let trainersprites = [1, 2, 101, 102, 169, 170, 265, 266];
		this.avatar = trainersprites[Math.floor(Math.random() * trainersprites.length)];

		this.connected = true;

		if (connection.user) connection.user = this;
		this.connections = [connection];
		this.latestHost = '';
		this.ips = Object.create(null);
		this.ips[connection.ip] = 1;
		// Note: Using the user's latest IP for anything will usually be
		//       wrong. Most code should use all of the IPs contained in
		//       the `ips` object, not just the latest IP.
		this.latestIp = connection.ip;
		this.locked = false;
		this.namelocked = false;
		this.prevNames = Object.create(null);
		this.roomCount = Object.create(null);

		// Table of roomid:game
		this.games = Object.create(null);

		// searches and challenges
		this.searching = Object.create(null);
		this.challengesFrom = {};
		this.challengeTo = null;
		this.lastChallenge = 0;

		// settings
		this.isSysop = false;
		this.isStaff = false;
		this.blockChallenges = false;
		this.ignorePMs = false;
		this.lastConnected = 0;

		// chat queue
		this.chatQueue = null;
		this.chatQueueTimeout = null;
		this.lastChatMessage = 0;
		this.broadcasting = false;

		// for the anti-spamming mechanism
		this.lastMessage = '';
		this.lastMessageTime = 0;
		this.lastReportTime = 0;
		this.s1 = '';
		this.s2 = '';
		this.s3 = '';

		// initialize
		users.set(this.userid, this);
	}

	sendTo(roomid, data) {
		if (roomid && roomid.id) roomid = roomid.id;
		if (roomid && roomid !== 'global' && roomid !== 'lobby') data = '>' + roomid + '\n' + data;
		for (let i = 0; i < this.connections.length; i++) {
			if (roomid && !this.connections[i].rooms[roomid]) continue;
			this.connections[i].send(data);
			Monitor.countNetworkUse(data.length);
		}
	}
	send(data) {
		for (let i = 0; i < this.connections.length; i++) {
			this.connections[i].send(data);
			Monitor.countNetworkUse(data.length);
		}
	}
	popup(message) {
		this.send('|popup|' + message.replace(/\n/g, '||'));
	}
	getIdentity(roomid) {
		if (this.locked) {
			return '‽' + this.name;
		}
		if (this.namelocked) {
			return '‽' + this.name;
		}
		if (roomid) {
			let room = Rooms.rooms[roomid];
			if (!room) {
				throw new Error("Room doesn't exist: " + roomid);
			}
			if (room.isMuted(this)) {
				return '!' + this.name;
			}
			if (room && room.auth) {
				if (room.auth[this.userid]) {
					return room.auth[this.userid] + this.name;
				}
				if (room.isPrivate === true) return ' ' + this.name;
			}
		}
		return this.group + this.name;
	}
	can(permission, target, room) {
		if (this.hasSysopAccess()) return true;

		let group = this.group;
		let targetGroup = '';
		if (target) targetGroup = target.group;
		let groupData = Config.groups[group];

		if (groupData && groupData['root']) {
			return true;
		}

		if (room && room.auth) {
			if (room.auth[this.userid]) {
				group = room.auth[this.userid];
			} else if (room.isPrivate === true) {
				group = ' ';
			}
			groupData = Config.groups[group];
			if (target) {
				if (room.auth[target.userid]) {
					targetGroup = room.auth[target.userid];
				} else if (room.isPrivate === true) {
					targetGroup = ' ';
				}
			}
		}

		if (typeof target === 'string') targetGroup = target;

		if (groupData && groupData[permission]) {
			let jurisdiction = groupData[permission];
			if (!target) {
				return !!jurisdiction;
			}
			if (jurisdiction === true && permission !== 'jurisdiction') {
				return this.can('jurisdiction', target, room);
			}
			if (typeof jurisdiction !== 'string') {
				return !!jurisdiction;
			}
			if (jurisdiction.includes(targetGroup)) {
				return true;
			}
			if (jurisdiction.includes('s') && target === this) {
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
	 */
	hasConsoleAccess(connection) {
		if (this.hasSysopAccess()) return true;
		if (!this.can('console')) return false; // normal permission check

		let whitelist = Config.consoleips || ['127.0.0.1'];
		if (whitelist.includes(connection.ip)) {
			return true; // on the IP whitelist
		}
		if (whitelist.includes(this.userid)) {
			return true; // on the userid whitelist
		}

		return false;
	}
	/**
	 * Special permission check for promoting and demoting
	 */
	canPromote(sourceGroup, targetGroup) {
		return this.can('promote', {group:sourceGroup}) && this.can('promote', {group:targetGroup});
	}
	resetName() {
		let name = 'Guest ' + this.guestNum;
		let userid = toId(name);
		if (this.userid === userid && !(this.named && !this.namelocked)) return;

		let i = 0;
		while (users.has(userid) && users.get(userid) !== this) {
			this.guestNum++;
			name = 'Guest ' + this.guestNum;
			userid = toId(name);
			if (i > 1000) return false;
		}

		// MMR is different for each userid
		this.mmrCache = {};
		Rooms.global.cancelSearch(this);

		if (this.named) this.prevNames[this.userid] = this.name;
		prevUsers.delete(userid);
		prevUsers.set(this.userid, userid);

		this.name = name;
		let oldid = this.userid;
		users.delete(oldid);
		this.userid = userid;
		users.set(this.userid, this);
		this.registered = false;
		this.group = Config.groupsranking[0];
		this.isStaff = false;
		this.isSysop = false;

		this.named = !!this.namelocked;
		for (let i = 0; i < this.connections.length; i++) {
			// console.log('' + name + ' renaming: connection ' + i + ' of ' + this.connections.length);
			let initdata = '|updateuser|' + this.name + '|' + (this.named ? '1' : '0') + '|' + this.avatar;
			this.connections[i].send(initdata);
		}
		for (let i in this.games) {
			this.games[i].onRename(this, oldid, false);
		}
		for (let i in this.roomCount) {
			Rooms(i).onRename(this, oldid, false);
		}
		return true;
	}
	updateIdentity(roomid) {
		if (roomid) {
			return Rooms(roomid).onUpdateIdentity(this);
		}
		for (let i in this.roomCount) {
			Rooms(i).onUpdateIdentity(this);
		}
	}
	filterName(name) {
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
			name = name.replace(/[^a-zA-Z0-9 \/\\.~()<>^*%&=+$@#_'?!"\u00A1-\u00BF\u00D7\u00F7\u02B9-\u0362\u2012-\u2027\u2030-\u205E\u2050-\u205F\u2190-\u23FA\u2500-\u2BD1\u2E80-\u32FF\u3400-\u9FFF\uF900-\uFAFF\uFE00-\uFE6F-]+/g, '');

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

		name = Tools.getName(name);
		if (Config.namefilter) {
			name = Config.namefilter(name, this);
		}
		return name;
	}
	/**
	 *
	 * @param name             The name you want
	 * @param token            Signed assertion returned from login server
	 * @param newlyRegistered  Make sure this account will identify as registered
	 * @param connection       The connection asking for the rename
	 */
	rename(name, token, newlyRegistered, connection) {
		for (let i in this.roomCount) {
			let room = Rooms(i);
			if (room && room.rated && (this.userid in room.game.players)) {
				this.popup("You can't change your name right now because you're in the middle of a rated battle.");
				return false;
			}
		}

		let challenge = '';
		if (connection) {
			challenge = connection.challenge;
		}
		if (!challenge) {
			console.log('verification failed; no challenge');
			return false;
		}

		if (!name) name = '';
		if (!/[a-zA-Z]/.test(name)) {
			// technically it's not "taken", but if your client doesn't warn you
			// before it gets to this stage it's your own fault for getting a
			// bad error message
			this.send('|nametaken|' + "|Your name must contain at least one letter.");
			return false;
		}

		let userid = toId(name);
		if (userid.length > 18) {
			this.send('|nametaken|' + "|Your name must be 18 characters or shorter.");
			return false;
		}
		name = this.filterName(name);
		if (userid !== toId(name)) {
			name = userid;
		}
		if (this.registered) newlyRegistered = false;

		if (!userid) {
			this.send('|nametaken|' + "|Your name contains a banned word.");
			return false;
		} else {
			if (userid === this.userid && !newlyRegistered) {
				return this.forceRename(name, this.registered);
			}
		}
		let conflictUser = users.get(userid);
		if (conflictUser && !conflictUser.registered && conflictUser.connected && !newlyRegistered) {
			this.send('|nametaken|' + name + "|Someone is already using the name \"" + conflictUser.name + "\".");
			return false;
		}

		if (token && token.charAt(0) !== ';') {
			let tokenSemicolonPos = token.indexOf(';');
			let tokenData = token.substr(0, tokenSemicolonPos);
			let tokenSig = token.substr(tokenSemicolonPos + 1);

			Verifier.verify(tokenData, tokenSig).then(success => {
				if (!success) {
					console.log('verify failed: ' + token);
					console.log('challenge was: ' + challenge);
					return;
				}
				this.validateRename(name, tokenData, newlyRegistered, challenge);
			});
		} else {
			this.send('|nametaken|' + name + "|Your authentication token was invalid.");
		}

		return false;
	}
	validateRename(name, tokenData, newlyRegistered, challenge) {
		let userid = toId(name);

		let tokenDataSplit = tokenData.split(',');

		if (tokenDataSplit.length < 5) {
			console.log('outdated assertion format: ' + tokenData);
			this.send('|nametaken|' + name + "|Your assertion is stale. This usually means that the clock on the server computer is incorrect. If this is your server, please set the clock to the correct time.");
			return;
		}

		if (tokenDataSplit[1] !== userid) {
			// userid mismatch
			return;
		}

		if (tokenDataSplit[0] !== challenge) {
			// a user sent an invalid token
			if (tokenDataSplit[0] !== challenge) {
				Monitor.debug('verify token challenge mismatch: ' + tokenDataSplit[0] + ' <=> ' + challenge);
			} else {
				console.log('verify token mismatch: ' + tokenData);
			}
			return;
		}

		let expiry = Config.tokenexpiry || 25 * 60 * 60;
		if (Math.abs(parseInt(tokenDataSplit[3]) - Date.now() / 1000) > expiry) {
			console.log('stale assertion: ' + tokenData);
			this.send('|nametaken|' + name + "|Your assertion is stale. This usually means that the clock on the server computer is incorrect. If this is your server, please set the clock to the correct time.");
			return;
		}

		// future-proofing
		this.s1 = tokenDataSplit[5];
		this.s2 = tokenDataSplit[6];
		this.s3 = tokenDataSplit[7];

		this.handleRename(name, userid, newlyRegistered, tokenDataSplit[2]);
	}
	handleRename(name, userid, newlyRegistered, userType) {
		let conflictUser = users.get(userid);
		if (conflictUser && !conflictUser.registered && conflictUser.connected) {
			if (newlyRegistered && userType !== '1') {
				if (conflictUser !== this) conflictUser.resetName();
			} else {
				this.send('|nametaken|' + name + "|Someone is already using the name \"" + conflictUser.name + "\".");
				return this;
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
				this.confirmed = userid;
				this.autoconfirmed = userid;
			} else if (userType === '4') {
				this.autoconfirmed = userid;
			} else if (userType === '5') {
				Punishments.lock(this, Date.now() + PERMALOCK_CACHE_TIME, userid, "Permalocked as " + name);
			} else if (userType === '6') {
				Punishments.ban(this, Date.now() + PERMALOCK_CACHE_TIME, userid, "Permabanned as " + name);
			}
		}
		let user = users.get(userid);
		if (user && user !== this) {
			// This user already exists; let's merge
			if (this === user) {
				// !!!
				return false;
			}
			user.merge(this);

			user.updateGroup(registered);

			if (userid !== this.userid) {
				// doing it this way mathematically ensures no cycles
				prevUsers.delete(userid);
				prevUsers.set(this.userid, userid);
			}
			for (let i in this.prevNames) {
				if (!user.prevNames[i]) {
					user.prevNames[i] = this.prevNames[i];
				}
			}
			if (this.named) user.prevNames[this.userid] = this.name;
			this.destroy();
			Rooms.global.checkAutojoin(user);
			if (Config.loginfilter) Config.loginfilter(user, this, userType);
			return true;
		}

		// rename success
		if (this.forceRename(name, registered)) {
			Rooms.global.checkAutojoin(this);
			if (Config.loginfilter) Config.loginfilter(this, null, userType);
			return true;
		}
		return false;
	}
	forceRename(name, registered) {
		// skip the login server
		let userid = toId(name);

		if (users.has(userid) && users.get(userid) !== this) {
			return false;
		}

		if (this.named) this.prevNames[this.userid] = this.name;
		this.name = name;

		let oldid = this.userid;
		if (userid !== this.userid) {
			// doing it this way mathematically ensures no cycles
			prevUsers.delete(userid);
			prevUsers.set(this.userid, userid);

			// MMR is different for each userid
			this.mmrCache = {};
			Rooms.global.cancelSearch(this);

			users.delete(oldid);
			this.userid = userid;
			users.set(userid, this);

			this.updateGroup(registered);
		} else if (registered) {
			this.updateGroup(registered);
		}

		Punishments.checkName(this, registered);

		for (let i = 0; i < this.connections.length; i++) {
			//console.log('' + name + ' renaming: socket ' + i + ' of ' + this.connections.length);
			let initdata = '|updateuser|' + this.name + '|' + ('1' /* named */) + '|' + this.avatar;
			this.connections[i].send(initdata);
		}
		let joining = !this.named;
		this.named = (this.userid.substr(0, 5) !== 'guest');
		for (let i in this.games) {
			this.games[i].onRename(this, oldid, joining);
		}
		for (let i in this.roomCount) {
			Rooms(i).onRename(this, oldid, joining);
		}
		return true;
	}
	merge(oldUser) {
		for (let i in oldUser.roomCount) {
			Rooms(i).onLeave(oldUser);
		}

		if (this.locked === '#dnsbl' && !oldUser.locked) this.locked = false;
		if (!this.locked && oldUser.locked === '#dnsbl') oldUser.locked = false;
		if (oldUser.locked) this.locked = oldUser.locked;
		if (oldUser.autoconfirmed) this.autoconfirmed = oldUser.autoconfirmed;

		for (let i = 0; i < oldUser.connections.length; i++) {
			this.mergeConnection(oldUser.connections[i]);
		}
		oldUser.roomCount = {};
		oldUser.connections = [];

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
	mergeConnection(connection) {
		// the connection has changed name to this user's username, and so is
		// being merged into this account
		this.connected = true;
		this.connections.push(connection);
		//console.log('' + this.name + ' merging: connection ' + connection.socket.id);
		let initdata = '|updateuser|' + this.name + '|' + ('1' /* named */) + '|' + this.avatar;
		connection.send(initdata);
		connection.user = this;
		for (let i in connection.rooms) {
			let room = connection.rooms[i];
			if (!this.roomCount[i]) {
				if (room.bannedUsers && (this.userid in room.bannedUsers || this.autoconfirmed in room.bannedUsers)) {
					// the connection was in a room that this user is banned from
					room.bannedIps[connection.ip] = room.bannedUsers[this.userid];
					connection.sendTo(room.id, '|deinit');
					connection.leaveRoom(room);
					continue;
				}
				room.onJoin(this, connection);
				this.roomCount[i] = 0;
			}
			this.roomCount[i]++;
			if (room.game && room.game.onUpdateConnection) {
				room.game.onUpdateConnection(this, connection);
			}
		}
		this.updateSearch(true, connection);
	}
	debugData() {
		let str = '' + this.group + this.name + ' (' + this.userid + ')';
		for (let i = 0; i < this.connections.length; i++) {
			let connection = this.connections[i];
			str += ' socket' + i + '[';
			let first = true;
			for (let j in connection.rooms) {
				if (first) {
					first = false;
				} else {
					str += ', ';
				}
				str += j;
			}
			str += ']';
		}
		if (!this.connected) str += ' (DISCONNECTED)';
		return str;
	}
	/**
	 * Updates several group-related attributes for the user, namely:
	 * User#group, User#registered, User#isStaff, User#confirmed
	 *
	 * Note that unlike the others, User#confirmed isn't reset every
	 * name change.
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
			this.confirmed = this.userid;
			this.autoconfirmed = this.userid;
		} else {
			this.group = Config.groupsranking[0];
			for (let i = 0; i < Rooms.global.chatRooms.length; i++) {
				let room = Rooms.global.chatRooms[i];
				if (!room.isPrivate && !room.isPersonal && room.auth && this.userid in room.auth && room.auth[this.userid] !== '+') {
					this.confirmed = this.userid;
					this.autoconfirmed = this.userid;
					break;
				}
			}
		}

		if (Config.customavatars && Config.customavatars[this.userid]) {
			this.avatar = Config.customavatars[this.userid];
		}

		this.isStaff = (this.group in {'%':1, '@':1, '&':1, '~':1});
		if (!this.isStaff) {
			let staffRoom = Rooms('staff');
			this.isStaff = (staffRoom && staffRoom.auth && staffRoom.auth[this.userid]);
		}
		if (this.confirmed) {
			this.autoconfirmed = this.confirmed;
			this.locked = false;
			this.namelocked = false;
		}
		if (this.autoconfirmed && this.semilocked) {
			if (this.semilocked === '#dnsbl') {
				this.popup("You are locked because someone using your IP has spammed/hacked other websites. This usually means you're using a proxy, in a country where other people commonly hack, or have a virus on your computer that's spamming websites.");
				this.semilocked = '#dnsbl.';
			}
		}
		if (this.ignorePMs && this.can('lock') && !this.can('bypassall')) this.ignorePMs = false;
	}
	/**
	 * Set a user's group. Pass (' ', true) to force confirmed
	 * status without giving the user a group.
	 */
	setGroup(group, forceConfirmed) {
		if (!group) throw new Error("Falsy value passed to setGroup");
		this.group = group.charAt(0);
		this.isStaff = (this.group in {'%':1, '@':1, '&':1, '~':1});
		if (!this.isStaff) {
			let staffRoom = Rooms('staff');
			this.isStaff = (staffRoom && staffRoom.auth && staffRoom.auth[this.userid]);
		}
		Rooms.global.checkAutojoin(this);
		if (this.registered) {
			if (forceConfirmed || this.group !== Config.groupsranking[0]) {
				usergroups[this.userid] = this.group + this.name;
				this.confirmed = this.userid;
				this.autoconfirmed = this.userid;
			} else {
				delete usergroups[this.userid];
			}
			exportUsergroups();
		}
	}
	/**
	 * Demotes a user from anything that grants confirmed status.
	 * Returns an array describing what the user was demoted from.
	 */
	deconfirm() {
		if (!this.confirmed) return;
		let userid = this.confirmed;
		let removed = [];
		if (usergroups[userid]) {
			removed.push(usergroups[userid].charAt(0));
			delete usergroups[userid];
			exportUsergroups();
		}
		for (let i = 0; i < Rooms.global.chatRooms.length; i++) {
			let room = Rooms.global.chatRooms[i];
			if (!room.isPrivate && room.auth && userid in room.auth && room.auth[userid] !== '+') {
				removed.push(room.auth[userid] + room.id);
				room.auth[userid] = '+';
			}
		}
		this.confirmed = '';
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
			// We're not resetting .confirmed/.autoconfirmed so those accounts
			// can still be locked after logout.
		}
	}
	onDisconnect(connection) {
		for (let i = 0; i < this.connections.length; i++) {
			if (this.connections[i] === connection) {
				// console.log('DISCONNECT: ' + this.userid);
				if (this.connections.length <= 1) {
					this.markInactive();
				}
				for (let j in connection.rooms) {
					this.leaveRoom(connection.rooms[j], connection, true);
				}
				--this.ips[connection.ip];
				this.connections.splice(i, 1);
				break;
			}
		}
		if (!this.connections.length) {
			// cleanup
			for (let i in this.roomCount) {
				if (this.roomCount[i] > 0) {
					// should never happen.
					Monitor.debug('!! room miscount: ' + i + ' not left');
					Rooms(i).onLeave(this);
				}
			}
			this.roomCount = {};
			if (!this.named && !Object.keys(this.prevNames).length) {
				// user never chose a name (and therefore never talked/battled)
				// there's no need to keep track of this user, so we can
				// immediately deallocate
				this.destroy();
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
			for (let j in connection.rooms) {
				this.leaveRoom(connection.rooms[j], connection, true);
			}
			connection.destroy();
		}
		if (this.connections.length) {
			// should never happen
			throw new Error("Failed to drop all connections for " + this.userid);
		}
		for (let i in this.roomCount) {
			if (this.roomCount[i] > 0) {
				// should never happen.
				throw new Error("Room miscount: " + i + " not left for " + this.userid);
			}
		}
		this.roomCount = {};
	}
	getAlts(includeConfirmed, forPunishment) {
		return this.getAltUsers(includeConfirmed, forPunishment).map(user => user.getLastName());
	}
	getAltUsers(includeConfirmed, forPunishment) {
		let alts = [];
		if (forPunishment) alts.push(this);
		users.forEach(user => {
			if (user === this) return;
			if (!forPunishment && !user.named && !user.connected) return;
			if (!includeConfirmed && user.confirmed) return;
			for (let myIp in this.ips) {
				if (myIp in user.ips) {
					alts.push(user);
					return;
				}
			}
		});
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
	tryJoinRoom(room, connection) {
		let roomid = (room && room.id ? room.id : room);
		room = Rooms.search(room);
		if (!room) {
			if (!this.named) {
				return null;
			} else {
				connection.sendTo(roomid, "|noinit|nonexistent|The room '" + roomid + "' does not exist.");
				return false;
			}
		}
		let makeRoom = this.can('makeroom');
		if (room.tour && !makeRoom) {
			let errorMessage = room.tour.onBattleJoin(room, this);
			if (errorMessage) {
				connection.sendTo(roomid, "|noinit|joinfailed|" + errorMessage);
				return false;
			}
		}
		if (room.modjoin) {
			let userGroup = this.group;
			if (room.auth && !makeRoom) {
				if (room.isPrivate === true) {
					userGroup = ' ';
				}
				userGroup = room.auth[this.userid] || userGroup;
			}
			let modjoinGroup = room.modjoin !== true ? room.modjoin : room.modchat;
			if (Config.groupsranking.indexOf(userGroup) < Config.groupsranking.indexOf(modjoinGroup)) {
				if (!this.named) {
					return null;
				} else if (!this.can('bypassall')) {
					connection.sendTo(roomid, "|noinit|nonexistent|The room '" + roomid + "' does not exist.");
					return false;
				}
			}
		}
		if (room.isPrivate) {
			if (!this.named) {
				return null;
			}
		}

		if (Rooms.aliases[roomid] === room.id) {
			connection.send(">" + roomid + "\n|deinit");
		}

		let joinResult = this.joinRoom(room, connection);
		if (!joinResult) {
			if (joinResult === null) {
				connection.sendTo(roomid, "|noinit|joinfailed|You are banned from the room '" + roomid + "'.");
				return false;
			}
			connection.sendTo(roomid, "|noinit|joinfailed|You do not have permission to join '" + roomid + "'.");
			return false;
		}
		return true;
	}
	joinRoom(room, connection) {
		room = Rooms(room);
		if (!room) return false;
		if (!this.can('bypassall')) {
			// check if user has permission to join
			if (room.staffRoom && !this.isStaff) return false;
			if (room.checkBanned && !room.checkBanned(this)) {
				return null;
			}
		}
		if (!connection) {
			for (let i = 0; i < this.connections.length; i++) {
				// only join full clients, not pop-out single-room
				// clients
				if (this.connections[i].rooms['global']) {
					this.joinRoom(room, this.connections[i]);
				}
			}
			return true;
		}
		if (!connection.rooms[room.id]) {
			if (!this.roomCount[room.id]) {
				this.roomCount[room.id] = 1;
				room.onJoin(this, connection);
			} else {
				this.roomCount[room.id]++;
			}
			connection.joinRoom(room);
			room.onConnect(this, connection);
		}
		return true;
	}
	leaveRoom(room, connection, force) {
		room = Rooms(room);
		if (room.id === 'global' && !force) {
			// you can't leave the global room except while disconnecting
			return false;
		}
		for (let i = 0; i < this.connections.length; i++) {
			if (this.connections[i] === connection || !connection) {
				if (this.connections[i].rooms[room.id]) {
					if (this.roomCount[room.id]) {
						this.roomCount[room.id]--;
						if (!this.roomCount[room.id]) {
							room.onLeave(this);
							delete this.roomCount[room.id];
						}
					} else {
						// should never happen
						console.log('!! room miscount');
					}
					if (!this.connections[i]) {
						// race condition? This should never happen, but it does.
						fs.createWriteStream('logs/errors.txt', {'flags': 'a'}).on("open", fd => {
							this.write("\nconnections = " + JSON.stringify(this.connections) + "\ni = " + i + "\n\n");
							this.end();
						});
					} else {
						this.connections[i].sendTo(room.id, '|deinit');
						this.connections[i].leaveRoom(room);
					}
				}
				if (connection) {
					break;
				}
			}
		}
		if (!connection && room.id in this.roomCount) {
			// should also never happen
			console.log('!! room miscount: ' + room.id + ' not left for ' + this.userid);
			room.onLeave(this);
			delete this.roomCount[room.id];
		}
	}
	prepBattle(formatid, type, connection) {
		// all validation for a battle goes through here
		if (!connection) connection = this;
		if (!type) type = 'challenge';

		if (Rooms.global.lockdown && Rooms.global.lockdown !== 'pre') {
			let message = "The server is restarting. Battles will be available again in a few minutes.";
			if (Rooms.global.lockdown === 'ddos') {
				message = "The server is under attack. Battles cannot be started at this time.";
			}
			connection.popup(message);
			return Promise.resolve(false);
		}
		let gameCount = 0;
		for (let i in this.games) { // eslint-disable-line no-unused-vars
			gameCount++;
			if (gameCount > 4) {
				connection.popup("Due to high load, you are limited to 4 games at the same time.");
				return Promise.resolve(false);
			}
		}
		if (Monitor.countPrepBattle(connection.ip || connection.latestIp, this.name)) {
			connection.popup("Due to high load, you are limited to 6 battles every 3 minutes.");
			return Promise.resolve(false);
		}

		let format = Tools.getFormat(formatid);
		if (!format['' + type + 'Show']) {
			connection.popup("That format is not available.");
			return Promise.resolve(false);
		}
		if (type === 'search' && this.searching[formatid]) {
			connection.popup("You are already searching a battle in that format.");
			return Promise.resolve(false);
		}
		return TeamValidator(formatid).prepTeam(this.team).then(result => this.finishPrepBattle(connection, result));
	}
	finishPrepBattle(connection, result) {
		if (result.charAt(0) !== '1') {
			connection.popup("Your team was rejected for the following reasons:\n\n- " + result.slice(1).replace(/\n/g, '\n- '));
			return false;
		}

		if (result.length > 1) {
			this.team = result.slice(1);
			Monitor.teamValidatorChanged++;
		} else {
			Monitor.teamValidatorUnchanged++;
		}
		return (this === users.get(this.userid));
	}
	updateChallenges() {
		let challengeTo = this.challengeTo;
		if (challengeTo) {
			challengeTo = {
				to: challengeTo.to,
				format: challengeTo.format,
			};
		}
		let challengesFrom = {};
		for (let challenger in this.challengesFrom) {
			challengesFrom[challenger] = this.challengesFrom[challenger].format;
		}
		this.send('|updatechallenges|' + JSON.stringify({
			challengesFrom: challengesFrom,
			challengeTo: challengeTo,
		}));
	}
	updateSearch(onlyIfExists, connection) {
		let games = {};
		let atLeastOne = false;
		for (let roomid in this.games) {
			let game = this.games[roomid];
			games[roomid] = game.title + (game.allowRenames ? '' : '*');
			atLeastOne = true;
		}
		if (!atLeastOne) games = null;
		let searching = Object.keys(this.searching);
		if (onlyIfExists && !searching.length && !atLeastOne) return;
		(connection || this).send('|updatesearch|' + JSON.stringify({
			searching: searching,
			games: games,
		}));
	}
	makeChallenge(user, format/*, isPrivate*/) {
		user = getUser(user);
		if (!user || this.challengeTo) {
			return false;
		}
		if (user.blockChallenges && !this.can('bypassblocks', user)) {
			return false;
		}
		if (new Date().getTime() < this.lastChallenge + 10000) {
			// 10 seconds ago
			return false;
		}
		let time = new Date().getTime();
		let challenge = {
			time: time,
			from: this.userid,
			to: user.userid,
			format: '' + (format || ''),
			//isPrivate: !!isPrivate, // currently unused
			team: this.team,
		};
		this.lastChallenge = time;
		this.challengeTo = challenge;
		user.challengesFrom[this.userid] = challenge;
		this.updateChallenges();
		user.updateChallenges();
	}
	cancelChallengeTo() {
		if (!this.challengeTo) return true;
		let user = getUser(this.challengeTo.to);
		if (user) delete user.challengesFrom[this.userid];
		this.challengeTo = null;
		this.updateChallenges();
		if (user) user.updateChallenges();
	}
	rejectChallengeFrom(user) {
		let userid = toId(user);
		user = getUser(user);
		if (this.challengesFrom[userid]) {
			delete this.challengesFrom[userid];
		}
		if (user) {
			delete this.challengesFrom[user.userid];
			if (user.challengeTo && user.challengeTo.to === this.userid) {
				user.challengeTo = null;
				user.updateChallenges();
			}
		}
		this.updateChallenges();
	}
	acceptChallengeFrom(user) {
		let userid = toId(user);
		user = getUser(user);
		if (!user || !user.challengeTo || user.challengeTo.to !== this.userid || !this.connected || !user.connected) {
			if (this.challengesFrom[userid]) {
				delete this.challengesFrom[userid];
				this.updateChallenges();
			}
			return false;
		}
		Rooms.global.startBattle(this, user, user.challengeTo.format, this.team, user.challengeTo.team, {rated: false});
		delete this.challengesFrom[user.userid];
		user.challengeTo = null;
		this.updateChallenges();
		user.updateChallenges();
		return true;
	}
	/**
	 * The user says message in room.
	 * Returns false if the rest of the user's messages should be discarded.
	 */
	chat(message, room, connection) {
		let now = new Date().getTime();

		if (message.substr(0, 16) === '/cmd userdetails') {
			// certain commands are exempt from the queue
			Monitor.activeIp = connection.ip;
			room.chat(this, message, connection);
			Monitor.activeIp = null;
			return false; // but end the loop here
		}

		let throttleDelay = THROTTLE_DELAY;
		if (this.group !== ' ') throttleDelay /= 2;

		if (this.chatQueueTimeout) {
			if (!this.chatQueue) this.chatQueue = []; // this should never happen
			if (this.chatQueue.length >= THROTTLE_BUFFER_LIMIT - 1) {
				connection.sendTo(room, '|raw|' +
					"<strong class=\"message-throttle-notice\">Your message was not sent because you've been typing too quickly.</strong>"
				);
				return false;
			} else {
				this.chatQueue.push([message, room, connection]);
			}
		} else if (now < this.lastChatMessage + throttleDelay) {
			this.chatQueue = [[message, room, connection]];
			this.chatQueueTimeout = setTimeout(
				() => this.processChatQueue(),
				throttleDelay - (now - this.lastChatMessage));
		} else {
			this.lastChatMessage = now;
			Monitor.activeIp = connection.ip;
			room.chat(this, message, connection);
			Monitor.activeIp = null;
		}
	}
	clearChatQueue() {
		this.chatQueue = null;
		if (this.chatQueueTimeout) {
			clearTimeout(this.chatQueueTimeout);
			this.chatQueueTimeout = null;
		}
	}
	processChatQueue() {
		if (!this.chatQueue) return; // this should never happen
		let toChat = this.chatQueue.shift();

		this.lastChatMessage = new Date().getTime();

		if (toChat[1].users) {
			Monitor.activeIp = toChat[2].ip;
			toChat[1].chat(this, toChat[0], toChat[2]);
			Monitor.activeIp = null;
		} else {
			// room is expired, do nothing
		}

		let throttleDelay = THROTTLE_DELAY;
		if (this.group !== ' ') throttleDelay /= 2;

		if (this.chatQueue && this.chatQueue.length) {
			this.chatQueueTimeout = setTimeout(
				() => this.processChatQueue(), throttleDelay);
		} else {
			this.chatQueue = null;
			this.chatQueueTimeout = null;
		}
	}
	destroy() {
		// deallocate user
		this.clearChatQueue();
		users.delete(this.userid);
		prevUsers.delete('guest' + this.guestNum);
	}
	toString() {
		return this.userid;
	}
	static pruneInactive(threshold) {
		let now = Date.now();
		users.forEach(user => {
			if (user.connected) return;
			if ((now - user.lastConnected) > threshold) {
				user.destroy();
			}
		});
	}
}

Users.User = User;
Users.Connection = Connection;

/*********************************************************
 * Inactive user pruning
 *********************************************************/

Users.pruneInactive = User.pruneInactive;
Users.pruneInactiveTimer = setInterval(
	User.pruneInactive,
	1000 * 60 * 30,
	Config.inactiveuserthreshold || 1000 * 60 * 60
);

/*********************************************************
 * Routing
 *********************************************************/

Users.socketConnect = function (worker, workerid, socketid, ip) {
	let id = '' + workerid + '-' + socketid;
	let connection = new Connection(id, worker, socketid, null, ip);
	connections.set(id, connection);

	let banned = Punishments.checkIpBanned(connection);
	if (banned) {
		return connection.destroy();
	}
	// Emergency mode connections logging
	if (Config.emergency) {
		fs.appendFile('logs/cons.emergency.log', '[' + ip + ']\n', err => {
			if (err) {
				console.log('!! Error in emergency conns log !!');
				throw err;
			}
		});
	}

	let user = new User(connection);
	connection.user = user;
	Punishments.checkIp(user, connection);
	// Generate 1024-bit challenge string.
	require('crypto').randomBytes(128, (ex, buffer) => {
		if (ex) {
			// It's not clear what sort of condition could cause this.
			// For now, we'll basically assume it can't happen.
			console.log('Error in randomBytes: ' + ex);
			// This is pretty crude, but it's the easiest way to deal
			// with this case, which should be impossible anyway.
			user.disconnectAll();
		} else if (connection.user) {	// if user is still connected
			connection.challenge = buffer.toString('hex');
			// console.log('JOIN: ' + connection.user.name + ' [' + connection.challenge.substr(0, 15) + '] [' + socket.id + ']');
			let keyid = Config.loginserverpublickeyid || 0;
			connection.sendTo(null, '|challstr|' + keyid + '|' + connection.challenge);
		}
	});

	user.joinRoom('global', connection);
};

Users.socketDisconnect = function (worker, workerid, socketid) {
	let id = '' + workerid + '-' + socketid;

	let connection = connections.get(id);
	if (!connection) return;
	connection.onDisconnect();
};

Users.socketReceive = function (worker, workerid, socketid, message) {
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

	let roomid = message.substr(0, pipeIndex);
	let lines = message.substr(pipeIndex + 1);
	let room = Rooms(roomid);
	if (!room) room = Rooms.lobby || Rooms.global;
	let user = connection.user;
	if (!user) return;

	if (CommandParser.multiLinePattern.test(lines)) {
		user.chat(lines, room, connection);
		return;
	}
	lines = lines.split('\n');
	if (!lines[lines.length - 1]) lines.pop();
	if (lines.length > (user.isStaff ? THROTTLE_MULTILINE_WARN_STAFF : THROTTLE_MULTILINE_WARN)) {
		connection.popup("You're sending too many lines at once. Try using a paste service like [[Pastebin]].");
		return;
	}
	// Emergency logging
	if (Config.emergency) {
		fs.appendFile('logs/emergency.log', '[' + user + ' (' + connection.ip + ')] ' + message + '\n', err => {
			if (err) {
				console.log('!! Error in emergency log !!');
				throw err;
			}
		});
	}

	let startTime = Date.now();
	for (let i = 0; i < lines.length; i++) {
		if (user.chat(lines[i], room, connection) === false) break;
	}
	let deltaTime = Date.now() - startTime;
	if (deltaTime > 1000) {
		Monitor.warn("[slow] " + deltaTime + "ms - " + user.name + " <" + connection.ip + ">: " + message);
	}
};
