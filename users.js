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
const THROTTLE_MULTILINE_WARN = 4;

const fs = require('fs');

let Users = module.exports = getUser;

let User, Connection;

// basic initialization
let users = Users.users = Object.create(null);
let prevUsers = Users.prevUsers = Object.create(null);
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
	while (!exactName && userid && !users[userid] && i < 1000) {
		userid = prevUsers[userid];
		i++;
	}
	return users[userid];
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
 * Locks and bans
 *********************************************************/

let bannedIps = Users.bannedIps = Object.create(null);
let bannedUsers = Users.bannedUsers = Object.create(null);
let lockedIps = Users.lockedIps = Object.create(null);
let lockedUsers = Users.lockedUsers = Object.create(null);
let lockedRanges = Users.lockedRanges = Object.create(null);
let rangelockedUsers = Users.rangeLockedUsers = Object.create(null);

/**
 * Searches for IP in table.
 *
 * For instance, if IP is '1.2.3.4', will return the value corresponding
 * to any of the keys in table match '1.2.3.4', '1.2.3.*', '1.2.*', or '1.*'
 */
function ipSearch(ip, table) {
	if (table[ip]) return table[ip];
	let dotIndex = ip.lastIndexOf('.');
	for (let i = 0; i < 4 && dotIndex > 0; i++) {
		ip = ip.substr(0, dotIndex);
		if (table[ip + '.*']) return table[ip + '.*'];
		dotIndex = ip.lastIndexOf('.');
	}
	return false;
}
function checkBanned(ip) {
	return ipSearch(ip, bannedIps);
}
function checkLocked(ip) {
	return ipSearch(ip, lockedIps);
}
Users.checkBanned = checkBanned;
Users.checkLocked = checkLocked;

// Defined in commands.js
Users.checkRangeBanned = function () {};

function unban(name) {
	let success;
	let userid = toId(name);
	for (let ip in bannedIps) {
		if (bannedIps[ip] === userid) {
			delete bannedIps[ip];
			success = true;
		}
	}
	for (let id in bannedUsers) {
		if (bannedUsers[id] === userid || id === userid) {
			delete bannedUsers[id];
			success = true;
		}
	}
	if (success) return name;
	return false;
}
function unlock(name, unlocked, noRecurse) {
	let userid = toId(name);
	let user = getUser(userid);
	let userips = null;
	if (user) {
		if (user.userid === userid) name = user.name;
		if (user.locked) {
			user.locked = false;
			user.updateIdentity();
			unlocked = unlocked || {};
			unlocked[name] = 1;
		}
		if (!noRecurse) userips = user.ips;
	}
	for (let ip in lockedIps) {
		if (userips && (ip in user.ips) && Users.lockedIps[ip] !== userid) {
			unlocked = unlock(Users.lockedIps[ip], unlocked, true); // avoid infinite recursion
		}
		if (Users.lockedIps[ip] === userid) {
			delete Users.lockedIps[ip];
			unlocked = unlocked || {};
			unlocked[name] = 1;
		}
	}
	for (let id in lockedUsers) {
		if (lockedUsers[id] === userid || id === userid) {
			delete lockedUsers[id];
			unlocked = unlocked || {};
			unlocked[name] = 1;
		}
	}
	return unlocked;
}
function lockRange(range, ip) {
	if (lockedRanges[range]) return;
	rangelockedUsers[range] = {};
	if (ip) {
		lockedIps[range] = range;
		ip = range.slice(0, -1);
	}
	for (let i in users) {
		let curUser = users[i];
		if (!curUser.named || curUser.locked || curUser.confirmed) continue;
		if (ip) {
			if (!curUser.latestIp.startsWith(ip)) continue;
		} else {
			if (range !== Users.shortenHost(curUser.latestHost)) continue;
		}
		rangelockedUsers[range][curUser.userid] = 1;
		curUser.locked = '#range';
		curUser.send("|popup|You are locked because someone on your ISP has spammed, and your ISP does not give us any way to tell you apart from them.");
		curUser.updateIdentity();
	}

	let time = 90 * 60 * 1000;
	lockedRanges[range] = setTimeout(function () {
		unlockRange(range);
	}, time);
}
function unlockRange(range) {
	if (!lockedRanges[range]) return;
	clearTimeout(lockedRanges[range]);
	for (let i in rangelockedUsers[range]) {
		let user = getUser(i);
		if (user) {
			user.locked = false;
			user.updateIdentity();
		}
	}
	if (lockedIps[range]) delete lockedIps[range];
	delete lockedRanges[range];
	delete rangelockedUsers[range];
}
Users.unban = unban;
Users.unlock = unlock;
Users.lockRange = lockRange;
Users.unlockRange = unlockRange;

/*********************************************************
 * Routing
 *********************************************************/

let connections = Users.connections = Object.create(null);

Users.shortenHost = function (host) {
	if (host.slice(-7) === '-nohost') return host;
	let dotLoc = host.lastIndexOf('.');
	let tld = host.substr(dotLoc);
	if (tld === '.uk' || tld === '.au' || tld === '.br') dotLoc = host.lastIndexOf('.', dotLoc - 1);
	dotLoc = host.lastIndexOf('.', dotLoc - 1);
	return host.substr(dotLoc + 1);
};

Users.socketConnect = function (worker, workerid, socketid, ip) {
	let id = '' + workerid + '-' + socketid;
	let connection = connections[id] = new Connection(id, worker, socketid, null, ip);

	if (Monitor.countConnection(ip)) {
		connection.destroy();
		bannedIps[ip] = '#cflood';
		return;
	}
	let checkResult = Users.checkBanned(ip);
	if (!checkResult && Users.checkRangeBanned(ip)) {
		checkResult = '#ipban';
	}
	if (checkResult) {
		if (!Config.quietConsole) console.log('CONNECT BLOCKED - IP BANNED: ' + ip + ' (' + checkResult + ')');
		if (checkResult === '#ipban') {
			connection.send("|popup||modal|Your IP (" + ip + ") is not allowed to connect to PS, because it has been used to spam, hack, or otherwise attack our server.||Make sure you are not using any proxies to connect to PS.");
		} else if (checkResult === '#cflood') {
			connection.send("|popup||modal|PS is under heavy load and cannot accommodate your connection right now.");
		} else {
			connection.send("|popup||modal|Your IP (" + ip + ") was banned while using the username '" + checkResult + "'. Your ban will expire in a few days.||" + (Config.appealUri ? " Or you can appeal at:\n" + Config.appealUri : ""));
		}
		return connection.destroy();
	}
	// Emergency mode connections logging
	if (Config.emergency) {
		fs.appendFile('logs/cons.emergency.log', '[' + ip + ']\n', function (err) {
			if (err) {
				console.log('!! Error in emergency conns log !!');
				throw err;
			}
		});
	}

	let user = new User(connection);
	connection.user = user;
	// Generate 1024-bit challenge string.
	require('crypto').randomBytes(128, function (ex, buffer) {
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
			let keyid = Config.loginServer.publicKeyId || 0;
			connection.sendTo(null, '|challstr|' + keyid + '|' + connection.challenge);
		}
	});

	Dnsbl.reverse(ip, function (err, hosts) {
		if (hosts && hosts[0]) {
			user.latestHost = hosts[0];
			if (Config.hostFilter) Config.hostFilter(hosts[0], user, connection);
			if (user.named && !user.locked && user.group === Config.groups.default.global) {
				let shortHost = Users.shortenHost(hosts[0]);
				if (lockedRanges[shortHost]) {
					user.send("|popup|You are locked because someone on your ISP has spammed, and your ISP does not give us any way to tell you apart from them.");
					rangelockedUsers[shortHost][user.userid] = 1;
					user.locked = '#range';
					user.updateIdentity();
				}
			}
		} else {
			if (Config.hostFilter) Config.hostFilter('', user, connection);
		}
	});

	Dnsbl.query(connection.ip, function (isBlocked) {
		if (isBlocked) {
			if (connection.user && !connection.user.locked && !connection.user.autoconfirmed) {
				connection.user.semilocked = '#dnsbl';
			}
		}
	});

	user.joinRoom('global', connection);
};

Users.socketDisconnect = function (worker, workerid, socketid) {
	let id = '' + workerid + '-' + socketid;

	let connection = connections[id];
	if (!connection) return;
	connection.onDisconnect();
};

Users.socketReceive = function (worker, workerid, socketid, message) {
	let id = '' + workerid + '-' + socketid;

	let connection = connections[id];
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
	let room = Rooms.get(roomid);
	if (!room) room = Rooms.lobby || Rooms.global;
	let user = connection.user;
	if (!user) return;
	if (lines.substr(0, 3) === '>> ' || lines.substr(0, 4) === '>>> ') {
		user.chat(lines, room, connection);
		return;
	}
	lines = lines.split('\n');
	if (lines.length >= THROTTLE_MULTILINE_WARN) {
		connection.popup("You're sending too many lines at once. Try using a paste service like [[Pastebin]].");
		return;
	}
	// Emergency logging
	if (Config.emergency) {
		fs.appendFile('logs/emergency.log', '[' + user + ' (' + connection.ip + ')] ' + message + '\n', function (err) {
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
	if (deltaTime > 500) {
		Monitor.warn("[slow] " + deltaTime + "ms - " + user.name + " <" + connection.ip + ">: " + message);
	}
};

/*********************************************************
 * User groups
 *********************************************************/

let usergroups = Users.usergroups = Object.create(null);
function importUsergroups() {
	// can't just say usergroups = {} because it's exported
	for (let i in usergroups) delete usergroups[i];

	fs.readFile('config/usergroups.csv', function (err, data) {
		if (err) return;
		data = ('' + data).split("\n");
		for (let i = 0; i < data.length; i++) {
			if (!data[i]) continue;
			let row = data[i].split(",");
			usergroups[toId(row[0])] = (row[1] || Config.groups.default.global) + row[0];
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
	let groups = Config.groups.bySymbol;
	let cachedGroups = {};

	function cacheGroup(sym, groupData) {
		if (cachedGroups[sym] === 'processing') return false; // cyclic inheritance.

		if (cachedGroups[sym] !== true && groupData['inherit']) {
			cachedGroups[sym] = 'processing';
			let inheritGroup = groups[groupData['inherit']];
			if (cacheGroup(groupData['inherit'], inheritGroup)) {
				Object.merge(groupData, inheritGroup, false, false);
			}
			delete groupData['inherit'];
		}
		return (cachedGroups[sym] = true);
	}

	for (let sym in groups) {
		cacheGroup(sym, groups[sym]);
	}
	for (let sym in groups) {
		if (Config.groups.globalByRank[groups[sym].globalRank] !== sym) delete groups[sym].globalRank;
		if (Config.groups.chatRoomByRank[groups[sym].chatRoomRank] !== sym) delete groups[sym].chatRoomRank;
		if (Config.groups.battleRoomByRank[groups[sym].battleRoomRank] !== sym) delete groups[sym].battleRoomRank;
	}
}
cacheGroupData();

Users.can = function (group, permission, targetGroup, room, isSelf) {
	let groupData = Config.groups.bySymbol[group];
	if (!groupData) return false;

	if (groupData['root']) {
		return true;
	}

	if (permission in groupData) {
		let jurisdiction = groupData[permission];
		if (!targetGroup) {
			return !!jurisdiction;
		}
		if (jurisdiction === true && permission !== 'jurisdiction') {
			return Users.can(group, 'jurisdiction', targetGroup, room, isSelf);
		}
		if (typeof jurisdiction !== 'string') {
			return !!jurisdiction;
		}
		if (jurisdiction.indexOf(targetGroup) >= 0) {
			return true;
		}
		if (jurisdiction.indexOf('s') >= 0 && isSelf) {
			return true;
		}
		if (jurisdiction.indexOf('u') >= 0 && groupData.rank > Config.groups.bySymbol[targetGroup].rank) {
			return true;
		}
	}

	return false;
};

Users.getGroupsThatCan = function (permission, targetGroup, room, isSelf) {
	let groupsByRank = Config.groups.globalByRank;

	if (targetGroup && typeof targetGroup === 'object') {
		if (targetGroup.group) {
			targetGroup = targetGroup.group;
		} else {
			isSelf = room;
			room = targetGroup;
			targetGroup = null;
		}
	}
	if (room && room.auth) groupsByRank = Config.groups[room.type + 'RoomByRank'];

	return groupsByRank.filter(function (group) {
		return Users.can(group, permission, targetGroup, room, isSelf);
	});
};

Users.setOfflineGroup = function (name, group, force) {
	let userid = toId(name);
	let user = getExactUser(userid);
	if (force && (user || usergroups[userid])) return false;
	if (user) {
		user.setGroup(group);
		return true;
	}
	if (!group || group === Config.groups.default.global) {
		delete usergroups[userid];
	} else {
		let usergroup = usergroups[userid];
		if (!usergroup && !force) return false;
		name = usergroup ? usergroup.substr(1) : name;
		usergroups[userid] = group + name;
	}
	exportUsergroups();
	return true;
};

Users.importUsergroups = importUsergroups;
Users.cacheGroupData = cacheGroupData;

/*********************************************************
 * User and Connection classes
 *********************************************************/

// User
User = (function () {
	function User(connection) {
		numUsers++;
		this.mmrCache = Object.create(null);
		this.guestNum = numUsers;
		this.name = 'Guest ' + numUsers;
		this.named = false;
		this.registered = false;
		this.userid = toId(this.name);
		this.group = Config.groups.default.global;

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

		this.locked = Users.checkLocked(connection.ip);
		this.prevNames = Object.create(null);
		this.roomCount = Object.create(null);

		// Table of roomid:game
		this.games = Object.create(null);

		// searches and challenges
		this.searching = Object.create(null);
		this.challengesFrom = {};
		this.challengeTo = null;
		this.lastChallenge = 0;

		// initialize
		users[this.userid] = this;
	}

	User.prototype.isSysop = false;

	// for the anti-spamming mechanism
	User.prototype.lastMessage = '';
	User.prototype.lastMessageTime = 0;
	User.prototype.lastReportTime = 0;
	User.prototype.s1 = '';
	User.prototype.s2 = '';
	User.prototype.s3 = '';

	User.prototype.blockChallenges = false;
	User.prototype.ignorePMs = false;
	User.prototype.lastConnected = 0;

	User.prototype.sendTo = function (roomid, data) {
		if (roomid && roomid.id) roomid = roomid.id;
		if (roomid && roomid !== 'global' && roomid !== 'lobby') data = '>' + roomid + '\n' + data;
		for (let i = 0; i < this.connections.length; i++) {
			if (roomid && !this.connections[i].rooms[roomid]) continue;
			this.connections[i].send(data);
			Monitor.countNetworkUse(data.length);
		}
	};
	User.prototype.send = function (data) {
		for (let i = 0; i < this.connections.length; i++) {
			this.connections[i].send(data);
			Monitor.countNetworkUse(data.length);
		}
	};
	User.prototype.popup = function (message) {
		this.send('|popup|' + message.replace(/\n/g, '||'));
	};
	User.prototype.getIdentity = function (roomid) {
		if (this.locked) {
			return Config.lockedSymbol + this.name;
		}
		if (roomid) {
			let room = Rooms.rooms[roomid];
			if (room.isMuted(this)) {
				return Config.mutedSymbol + this.name;
			}
			if (room && room.auth) {
				if (room.auth[this.userid]) {
					return room.auth[this.userid] + this.name;
				}
				if (room.isPrivate === true) return Config.groups.default[room.type + 'Room'] + this.name;
			}
		}
		return this.group + this.name;
	};
	User.prototype.can = function (permission, target, room) {
		if (this.hasSysopAccess()) return true;

		let group = this.group;
		let targetGroup = null;
		if (target && typeof target === 'object') {
			if (target.group) {
				targetGroup = target.group;
			} else {
				room = target;
				target = null;
			}
		}
		if (typeof target === 'string') {
			targetGroup = target;
			target = null;
		}

		if (room && room.auth) {
			if (room.auth[this.userid]) {
				group = room.auth[this.userid];
			} else if (room.isPrivate === true) {
				group = Config.groups.default[room.type + 'Room'];
			}

			if (target) {
				if (room.auth[target.userid]) {
					targetGroup = room.auth[target.userid];
				} else if (room.isPrivate === true) {
					targetGroup = Config.groups.default[room.type + 'Room'];
				}
			}
		}

		return Users.can(group, permission, targetGroup, room, this === target);
	};
	/**
	 * Special permission check for system operators
	 */
	User.prototype.hasSysopAccess = function () {
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
	};
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
	User.prototype.hasConsoleAccess = function (connection) {
		if (this.hasSysopAccess()) return true;
		if (!this.can('console')) return false; // normal permission check

		let whitelist = Config.consoleIps || [];
		if (whitelist.indexOf(connection.ip) >= 0) {
			return true; // on the IP whitelist
		}
		if (whitelist.indexOf(this.userid) >= 0) {
			return true; // on the userid whitelist
		}

		return false;
	};
	User.prototype.resetName = function () {
		let name = 'Guest ' + this.guestNum;
		let userid = toId(name);
		if (this.userid === userid) return;

		let i = 0;
		while (users[userid] && users[userid] !== this) {
			this.guestNum++;
			name = 'Guest ' + this.guestNum;
			userid = toId(name);
			if (i > 1000) return false;
		}

		// MMR is different for each userid
		this.mmrCache = {};
		Rooms.global.cancelSearch(this);

		if (this.named) this.prevNames[this.userid] = this.name;
		delete prevUsers[userid];
		prevUsers[this.userid] = userid;

		this.name = name;
		let oldid = this.userid;
		delete users[oldid];
		this.userid = userid;
		users[this.userid] = this;
		this.registered = false;
		this.group = Config.groups.default.global;
		this.isSysop = false;

		for (let i = 0; i < this.connections.length; i++) {
			// console.log('' + name + ' renaming: connection ' + i + ' of ' + this.connections.length);
			let initdata = '|updateuser|' + this.name + '|' + (false ? '1' : '0') + '|' + this.avatar;
			this.connections[i].send(initdata);
		}
		this.named = false;
		for (let i in this.roomCount) {
			Rooms.get(i, 'lobby').onRename(this, oldid, false);
		}
		return true;
	};
	User.prototype.updateIdentity = function (roomid) {
		if (roomid) {
			return Rooms.get(roomid, 'lobby').onUpdateIdentity(this);
		}
		for (let i in this.roomCount) {
			Rooms.get(i, 'lobby').onUpdateIdentity(this);
		}
	};
	User.prototype.filterName = function (name) {
		name = name.substr(0, 30);
		if (Config.nameFilter) {
			name = Config.nameFilter(name, this);
		}
		name = Tools.getName(name);
		name = name.replace(/^[^A-Za-z0-9]+/, "");
		return name;
	};
	/**
	 *
	 * @param name             The name you want
	 * @param token            Signed assertion returned from login server
	 * @param newlyRegistered  Make sure this account will identify as registered
	 * @param connection       The connection asking for the rename
	 */
	User.prototype.rename = function (name, token, newlyRegistered, connection) {
		for (let i in this.roomCount) {
			let room = Rooms.get(i);
			if (room && room.rated && (this.userid === room.rated.p1 || this.userid === room.rated.p2)) {
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

		name = this.filterName(name);
		let userid = toId(name);
		if (this.registered) newlyRegistered = false;

		if (!userid) {
			this.send('|nametaken|' + "|Your name contains a banned word.");
			return false;
		} else {
			if (userid === this.userid && !newlyRegistered) {
				return this.forceRename(name, this.registered);
			}
		}
		if (users[userid] && !users[userid].registered && users[userid].connected && !newlyRegistered) {
			this.send('|nametaken|' + name + "|Someone is already using the name \"" + users[userid].name + "\".");
			return false;
		}

		if (token && token.charAt(0) !== ';') {
			let tokenSemicolonPos = token.indexOf(';');
			let tokenData = token.substr(0, tokenSemicolonPos);
			let tokenSig = token.substr(tokenSemicolonPos + 1);

			let self = this;
			Verifier.verify(tokenData, tokenSig, function (success, tokenData) {
				if (!success) {
					console.log('verify failed: ' + token);
					console.log('challenge was: ' + challenge);
					return;
				}
				self.validateRename(name, tokenData, newlyRegistered, challenge);
			});
		} else {
			this.send('|nametaken|' + name + "|Your authentication token was invalid.");
		}

		return false;
	};
	User.prototype.validateRename = function (name, tokenData, newlyRegistered, challenge) {
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

		let expiry = Config.tokenExpiry || 25 * 60 * 60;
		if (Math.abs(parseInt(tokenDataSplit[3], 10) - Date.now() / 1000) > expiry) {
			console.log('stale assertion: ' + tokenData);
			this.send('|nametaken|' + name + "|Your assertion is stale. This usually means that the clock on the server computer is incorrect. If this is your server, please set the clock to the correct time.");
			return;
		}

		if (Config.tokenHosts) {
			let host = tokenDataSplit[4];
			if (Config.tokenHosts.length === 0) {
				Config.tokenHosts.push(host);
				console.log('Added ' + host + ' to valid tokenhosts');
				require('dns').lookup(host, function (err, address) {
					if (err || (address === host)) return;
					Config.tokenHosts.push(address);
					console.log('Added ' + address + ' to valid tokenhosts');
				});
			} else if (Config.tokenHosts.indexOf(host) < 0) {
				console.log('invalid hostname in token: ' + tokenData);
				this.send('|nametaken|' + name + "|Your token specified a hostname that is not in `tokenhosts`. If this is your server, please read the documentation in config/config.js for help. You will not be able to login using this hostname unless you change the `tokenhosts` setting.");
				return;
			}
		}

		// future-proofing
		this.s1 = tokenDataSplit[5];
		this.s2 = tokenDataSplit[6];
		this.s3 = tokenDataSplit[7];

		this.handleRename(name, userid, newlyRegistered, tokenDataSplit[2]);
	};
	User.prototype.handleRename = function (name, userid, newlyRegistered, userType) {
		if (users[userid] && !users[userid].registered && users[userid].connected) {
			if (newlyRegistered) {
				if (users[userid] !== this) users[userid].resetName();
			} else {
				this.send('|nametaken|' + name + "|Someone is already using the name \"" + users[userid].name + "\".");
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
				this.lock(false, userid + '#permalock');
			} else if (userType === '6') {
				this.ban(false, userid);
			}
		}
		if (users[userid] && users[userid] !== this) {
			// This user already exists; let's merge
			let user = users[userid];
			if (this === user) {
				// !!!
				return false;
			}
			user.merge(this);

			user.updateGroup(registered);

			if (userid !== this.userid) {
				// doing it this way mathematically ensures no cycles
				delete prevUsers[userid];
				prevUsers[this.userid] = userid;
			}
			for (let i in this.prevNames) {
				if (!user.prevNames[i]) {
					user.prevNames[i] = this.prevNames[i];
				}
			}
			if (this.named) user.prevNames[this.userid] = this.name;
			this.destroy();
			Rooms.global.checkAutojoin(user);
			if (Config.loginFilter) Config.loginFilter(user, this, userType);
			return true;
		}

		// rename success
		if (this.forceRename(name, registered)) {
			Rooms.global.checkAutojoin(this);
			if (Config.loginFilter) Config.loginFilter(this, null, userType);
			return true;
		}
		return false;
	};
	User.prototype.forceRename = function (name, registered) {
		// skip the login server
		let userid = toId(name);

		if (users[userid] && users[userid] !== this) {
			return false;
		}

		if (this.named) this.prevNames[this.userid] = this.name;
		this.name = name;

		let oldid = this.userid;
		if (userid !== this.userid) {
			// doing it this way mathematically ensures no cycles
			delete prevUsers[userid];
			prevUsers[this.userid] = userid;

			// MMR is different for each userid
			this.mmrCache = {};
			Rooms.global.cancelSearch(this);

			delete users[oldid];
			this.userid = userid;
			users[userid] = this;

			this.updateGroup(registered);
		} else if (registered) {
			this.updateGroup(registered);
		}

		if (registered && userid in bannedUsers) {
			let bannedUnder = '';
			if (bannedUsers[userid] !== userid) bannedUnder = ' because of rule-breaking by your alt account ' + bannedUsers[userid];
			this.send("|popup|Your username (" + name + ") is banned" + bannedUnder + "'. Your ban will expire in a few days." + (Config.appealUri ? " Or you can appeal at:\n" + Config.appealUri : ""));
			this.ban(true, userid);
			return;
		}
		if (registered && userid in lockedUsers) {
			let bannedUnder = '';
			if (lockedUsers[userid] !== userid) bannedUnder = ' because of rule-breaking by your alt account ' + lockedUsers[userid];
			this.send("|popup|Your username (" + name + ") is locked" + bannedUnder + "'. Your lock will expire in a few days." + (Config.appealUri ? " Or you can appeal at:\n" + Config.appealUri : ""));
			this.lock(true, userid);
		}
		if (this.group === Config.groups.default.global) {
			let range = this.locked || Users.shortenHost(this.latestHost);
			if (lockedRanges[range]) {
				this.send("|popup|You are in a range that has been temporarily locked from talking in chats and PMing regular users.");
				rangelockedUsers[range][this.userid] = 1;
				this.locked = '#range';
			}
		} else if (this.locked && (this.locked === '#range' || lockedRanges[this.locked])) {
			this.locked = false;
		}

		for (let i = 0; i < this.connections.length; i++) {
			//console.log('' + name + ' renaming: socket ' + i + ' of ' + this.connections.length);
			let initdata = '|updateuser|' + this.name + '|' + (true ? '1' : '0') + '|' + this.avatar;
			this.connections[i].send(initdata);
		}
		let joining = !this.named;
		this.named = (this.userid.substr(0, 5) !== 'guest');
		for (let i in this.roomCount) {
			Rooms.get(i, 'lobby').onRename(this, oldid, joining);
		}
		return true;
	};
	User.prototype.merge = function (oldUser) {
		for (let i in oldUser.roomCount) {
			Rooms.get(i, 'lobby').onLeave(oldUser);
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
	};
	User.prototype.mergeConnection = function (connection) {
		// the connection has changed name to this user's username, and so is
		// being merged into this account
		this.connected = true;
		this.connections.push(connection);
		//console.log('' + this.name + ' merging: connection ' + connection.socket.id);
		let initdata = '|updateuser|' + this.name + '|' + (true ? '1' : '0') + '|' + this.avatar;
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
				room.onJoin(this, connection, true);
				this.roomCount[i] = 0;
			}
			this.roomCount[i]++;
			if (room.game && room.game.onUpdateConnection) {
				room.game.onUpdateConnection(this, connection);
			}
		}
	};
	User.prototype.debugData = function () {
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
	};
	/**
	 * Updates several group-related attributes for the user, namely:
	 * User#group, User#registered, User#confirmed
	 *
	 * Note that unlike the others, User#confirmed isn't reset every
	 * name change.
	 */
	User.prototype.updateGroup = function (registered) {
		if (!registered) {
			this.registered = false;
			this.group = Config.groups.default.global;
			return;
		}
		this.registered = true;
		if (this.userid in usergroups) {
			this.group = usergroups[this.userid].charAt(0);
			this.confirmed = this.userid;
			this.autoconfirmed = this.userid;
		} else {
			this.group = Config.groups.default.global;
			for (let i = 0; i < Rooms.global.chatRooms.length; i++) {
				let room = Rooms.global.chatRooms[i];
				if (!room.isPrivate && room.auth && this.userid in room.auth && Config.groups.bySymbol[room.auth[this.userid]].chatRoomRank > 1) {
					this.confirmed = this.userid;
					this.autoconfirmed = this.userid;
					break;
				}
			}
		}

		if (Config.customAvatars && Config.customAvatars[this.userid]) {
			this.avatar = Config.customAvatars[this.userid];
		}

		if (this.confirmed) {
			this.autoconfirmed = this.confirmed;
			this.locked = false;
		}
		if (this.autoconfirmed && this.semilocked) {
			if (this.semilocked === '#dnsbl') {
				this.popup("You are locked because someone using your IP has spammed/hacked other websites. This usually means you're using a proxy, in a country where other people commonly hack, or have a virus on your computer that's spamming websites.");
				this.semilocked = '#dnsbl.';
			}
		}
		if (this.ignorePMs && this.can('lock') && !this.can('bypassall')) this.ignorePMs = false;
	};
	/**
	 * Set a user's group. Pass (' ', true) to force confirmed
	 * status without giving the user a group.
	 */
	User.prototype.setGroup = function (group, forceConfirmed) {
		this.group = group.charAt(0);
		Rooms.global.checkAutojoin(this);
		if (this.registered) {
			if (forceConfirmed || this.group !== Config.groups.default.global) {
				usergroups[this.userid] = this.group + this.name;
			} else {
				delete usergroups[this.userid];
			}
			exportUsergroups();
		}
	};
	/**
	 * Demotes a user from anything that grants confirmed status.
	 * Returns an array describing what the user was demoted from.
	 */
	User.prototype.deconfirm = function () {
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
			if (!room.isPrivate && room.auth && userid in room.auth && Config.groups.bySymbol[room.auth[userid]].chatRoomRank > 1) {
				removed.push(room.auth[userid] + room.id);
				room.auth[userid] = Config.groups.chatRoomByRank[1];
			}
		}
		this.confirmed = '';
		return removed;
	};
	User.prototype.markInactive = function () {
		this.connected = false;
		this.lastConnected = Date.now();
		if (!this.registered) {
			this.group = Config.groups.default.global;
			this.isSysop = false; // should never happen
			this.autoconfirmed = '';
			this.confirmed = '';
		}
	};
	User.prototype.onDisconnect = function (connection) {
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
					Rooms.get(i, 'lobby').onLeave(this);
				}
			}
			this.roomCount = {};
			if (!this.named && Object.isEmpty(this.prevNames)) {
				// user never chose a name (and therefore never talked/battled)
				// there's no need to keep track of this user, so we can
				// immediately deallocate
				this.destroy();
			}
		}
	};
	User.prototype.disconnectAll = function () {
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
	};
	User.prototype.getAlts = function (getAll) {
		let alts = [];
		for (let i in users) {
			if (users[i] === this) continue;
			if (!users[i].named && !users[i].connected) continue;
			if (!getAll && users[i].confirmed) continue;
			for (let myIp in this.ips) {
				if (myIp in users[i].ips) {
					alts.push(users[i].name);
					break;
				}
			}
		}
		return alts;
	};
	User.prototype.ban = function (noRecurse, userid) {
		// recurse only once; the root for-loop already bans everything with your IP
		if (!userid) userid = this.userid;
		if (!noRecurse) {
			for (let i in users) {
				if (users[i] === this || users[i].confirmed) continue;
				for (let myIp in this.ips) {
					if (myIp in users[i].ips) {
						users[i].ban(true, userid);
						break;
					}
				}
			}
			lockedUsers[userid] = userid;
		}

		for (let ip in this.ips) {
			bannedIps[ip] = userid;
		}
		if (this.autoconfirmed) bannedUsers[this.autoconfirmed] = userid;
		if (this.registered) {
			bannedUsers[this.userid] = userid;
			this.autoconfirmed = '';
		}
		this.locked = userid; // in case of merging into a recently banned account
		lockedUsers[this.userid] = userid;
		this.disconnectAll();
	};
	User.prototype.lock = function (noRecurse, userid) {
		// recurse only once; the root for-loop already locks everything with your IP
		if (!userid) userid = this.userid;
		if (!noRecurse) {
			for (let i in users) {
				if (users[i] === this || users[i].confirmed) continue;
				for (let myIp in this.ips) {
					if (myIp in users[i].ips) {
						users[i].lock(true, userid);
						break;
					}
				}
			}
			lockedUsers[userid] = userid;
		}

		for (let ip in this.ips) {
			lockedIps[ip] = userid;
		}
		if (this.autoconfirmed) lockedUsers[this.autoconfirmed] = userid;
		lockedUsers[this.userid] = userid;
		this.locked = userid;
		this.autoconfirmed = '';
		this.updateIdentity();
	};
	User.prototype.tryJoinRoom = function (room, connection) {
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
			let tour = room.tour.tour;
			let errorMessage = tour.onBattleJoin(room, this);
			if (errorMessage) {
				connection.sendTo(roomid, "|noinit|joinfailed|" + errorMessage);
				return false;
			}
		}
		if (room.modjoin) {
			let userGroup = this.group;
			if (room.auth && !makeRoom) {
				if (room.isPrivate === true) {
					userGroup = Config.groups.default[room.type + 'Room'];
				}
				userGroup = room.auth[this.userid] || userGroup;
			}
			let modjoinLevel = room.modjoin !== true ? room.modjoin : room.modchat;
			if (modjoinLevel && Config.groups.bySymbol[modjoinLevel] && Config.groups.bySymbol[userGroup].rank < Config.groups.bySymbol[modjoinLevel].rank) {
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
	};
	User.prototype.joinRoom = function (room, connection) {
		room = Rooms.get(room);
		if (!room) return false;
		if (!this.can('bypassall')) {
			// check if user has permission to join
			if (room.staffRoom && !this.can('staff')) return false;
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
	};
	User.prototype.leaveRoom = function (room, connection, force) {
		room = Rooms.get(room);
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
						fs.createWriteStream('logs/errors.txt', {'flags': 'a'}).on("open", function (fd) {
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
		if (!connection && this.roomCount[room.id]) {
			// should also never happen
			console.log('!! room miscount: ' + room.id + ' not left for ' + this.userid);
			room.onLeave(this);
			delete this.roomCount[room.id];
		}
	};
	User.prototype.prepBattle = function (formatid, type, connection, callback) {
		// all validation for a battle goes through here
		if (!connection) connection = this;
		if (!type) type = 'challenge';

		if (Rooms.global.lockdown && Rooms.global.lockdown !== 'pre') {
			let message = "The server is restarting. Battles will be available again in a few minutes.";
			if (Rooms.global.lockdown === 'ddos') {
				message = "The server is under attack. Battles cannot be started at this time.";
			}
			connection.popup(message);
			setImmediate(callback.bind(null, false));
			return;
		}
		if (Monitor.countPrepBattle(connection.ip || connection.latestIp, this.name)) {
			connection.popup("Due to high load, you are limited to 6 battles every 3 minutes.");
			setImmediate(callback.bind(null, false));
			return;
		}

		let format = Tools.getFormat(formatid);
		if (!format['' + type + 'Show']) {
			connection.popup("That format is not available.");
			setImmediate(callback.bind(null, false));
			return;
		}
		if (type === 'search' && this.searching[formatid]) {
			connection.popup("You are already searching a battle in that format.");
			setImmediate(callback.bind(null, false));
			return;
		}
		TeamValidator.validateTeam(formatid, this.team, this.finishPrepBattle.bind(this, connection, callback));
	};
	User.prototype.finishPrepBattle = function (connection, callback, success, details) {
		if (!success) {
			connection.popup("Your team was rejected for the following reasons:\n\n- " + details.replace(/\n/g, '\n- '));
			callback(false);
		} else {
			if (details) {
				this.team = details;
				Monitor.teamValidatorChanged++;
			} else {
				Monitor.teamValidatorUnchanged++;
			}
			callback(this === users[this.userid]);
		}
	};
	User.prototype.updateChallenges = function () {
		let challengeTo = this.challengeTo;
		if (challengeTo) {
			challengeTo = {
				to: challengeTo.to,
				format: challengeTo.format
			};
		}
		this.send('|updatechallenges|' + JSON.stringify({
			challengesFrom: Object.map(this.challengesFrom, 'format'),
			challengeTo: challengeTo
		}));
	};
	User.prototype.makeChallenge = function (user, format/*, isPrivate*/) {
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
			team: this.team
		};
		this.lastChallenge = time;
		this.challengeTo = challenge;
		user.challengesFrom[this.userid] = challenge;
		this.updateChallenges();
		user.updateChallenges();
	};
	User.prototype.cancelChallengeTo = function () {
		if (!this.challengeTo) return true;
		let user = getUser(this.challengeTo.to);
		if (user) delete user.challengesFrom[this.userid];
		this.challengeTo = null;
		this.updateChallenges();
		if (user) user.updateChallenges();
	};
	User.prototype.rejectChallengeFrom = function (user) {
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
	};
	User.prototype.acceptChallengeFrom = function (user) {
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
	};
	// chatQueue should be an array, but you know about mutables in prototypes...
	// P.S. don't replace this with an array unless you know what mutables in prototypes do.
	User.prototype.chatQueue = null;
	User.prototype.chatQueueTimeout = null;
	User.prototype.lastChatMessage = 0;
	/**
	 * The user says message in room.
	 * Returns false if the rest of the user's messages should be discarded.
	 */
	User.prototype.chat = function (message, room, connection) {
		let now = new Date().getTime();

		if (message.substr(0, 16) === '/cmd userdetails') {
			// certain commands are exempt from the queue
			Monitor.activeIp = connection.ip;
			room.chat(this, message, connection);
			Monitor.activeIp = null;
			return false; // but end the loop here
		}

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
		} else if (now < this.lastChatMessage + THROTTLE_DELAY) {
			this.chatQueue = [[message, room, connection]];
			this.chatQueueTimeout = setTimeout(
				this.processChatQueue.bind(this),
				THROTTLE_DELAY - (now - this.lastChatMessage));
		} else {
			this.lastChatMessage = now;
			Monitor.activeIp = connection.ip;
			room.chat(this, message, connection);
			Monitor.activeIp = null;
		}
	};
	User.prototype.clearChatQueue = function () {
		this.chatQueue = null;
		if (this.chatQueueTimeout) {
			clearTimeout(this.chatQueueTimeout);
			this.chatQueueTimeout = null;
		}
	};
	User.prototype.processChatQueue = function () {
		if (!this.chatQueue) return; // this should never happen
		let toChat = this.chatQueue.shift();

		Monitor.activeIp = toChat[2].ip;
		toChat[1].chat(this, toChat[0], toChat[2]);
		Monitor.activeIp = null;

		if (this.chatQueue && this.chatQueue.length) {
			this.chatQueueTimeout = setTimeout(
				this.processChatQueue.bind(this), THROTTLE_DELAY);
		} else {
			this.chatQueue = null;
			this.chatQueueTimeout = null;
		}
	};
	User.prototype.destroy = function () {
		// deallocate user
		this.clearChatQueue();
		delete users[this.userid];
	};
	User.prototype.toString = function () {
		return this.userid;
	};
	// "static" function
	User.pruneInactive = function (threshold) {
		let now = Date.now();
		for (let i in users) {
			let user = users[i];
			if (user.connected) continue;
			if ((now - user.lastConnected) > threshold) {
				users[i].destroy();
			}
		}
	};
	return User;
})();

Connection = (function () {
	function Connection(id, worker, socketid, user, ip) {
		this.id = id;
		this.socketid = socketid;
		this.worker = worker;
		this.rooms = {};

		this.user = user;

		this.ip = ip || '';
	}
	Connection.prototype.autojoin = '';

	Connection.prototype.sendTo = function (roomid, data) {
		if (roomid && roomid.id) roomid = roomid.id;
		if (roomid && roomid !== 'lobby') data = '>' + roomid + '\n' + data;
		Sockets.socketSend(this.worker, this.socketid, data);
		Monitor.countNetworkUse(data.length);
	};

	Connection.prototype.send = function (data) {
		Sockets.socketSend(this.worker, this.socketid, data);
		Monitor.countNetworkUse(data.length);
	};

	Connection.prototype.destroy = function () {
		Sockets.socketDisconnect(this.worker, this.socketid);
		this.onDisconnect();
	};
	Connection.prototype.onDisconnect = function () {
		delete connections[this.id];
		if (this.user) this.user.onDisconnect(this);
		this.user = null;
	};

	Connection.prototype.popup = function (message) {
		this.send('|popup|' + message.replace(/\n/g, '||'));
	};

	Connection.prototype.joinRoom = function (room) {
		if (room.id in this.rooms) return;
		this.rooms[room.id] = room;
		Sockets.channelAdd(this.worker, room.id, this.socketid);
	};
	Connection.prototype.leaveRoom = function (room) {
		if (room.id in this.rooms) {
			delete this.rooms[room.id];
			Sockets.channelRemove(this.worker, room.id, this.socketid);
		}
	};

	return Connection;
})();

Users.User = User;
Users.Connection = Connection;

/*********************************************************
 * Inactive user pruning
 *********************************************************/

Users.pruneInactive = User.pruneInactive;
Users.pruneInactiveTimer = setInterval(
	User.pruneInactive,
	1000 * 60 * 30,
	Config.inactiveUserThreshold || 1000 * 60 * 60
);
