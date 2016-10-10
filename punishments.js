'use strict';

/**
 * Punishments
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles the punishing of users on PS.
 *
 * There are four types of punishments on PS. Locks, bans, namelocks and rangelocks.
 * This file contains the lists of users that have been punished (both IPs and usernames),
 * as well as the functions that handle the execution of said punishments.
 *
 * @license MIT license
 */

let Punishments = module.exports;

const fs = require('fs');
const path = require('path');

const PUNISHMENT_FILE = path.resolve(__dirname, 'config/punishments.tsv');
const ROOM_PUNISHMENT_FILE = path.resolve(__dirname, 'config/room-punishments.tsv');

const RANGELOCK_DURATION = 60 * 60 * 1000; // 1 hour
const LOCK_DURATION = 37 * 60 * 60 * 1000; // 37 hours
const BAN_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week

const ROOMBAN_DURATION = 48 * 60 * 60 * 1000; // 48 hours
const BLACKLIST_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year

/**
 * a punishment is an array: [punishType, userid, expireTime, reason]
 * @typedef {[string, string, number, string]} Punishment
 */

class PunishmentMap extends Map/*:: <string, Punishment> */ {
	get(k) {
		const punishment = super.get(k);
		if (punishment) {
			if (Date.now() < punishment[2]) return punishment;
			this.delete(k);
		}
		return undefined;
	}
	has(k) {
		return !!this.get(k);
	}
	forEach(callback) {
		super.forEach((punishment, k) => {
			if (Date.now() < punishment[2]) return callback(punishment, k);
			this.delete(k);
		});
	}
}

/**
 * ips is an ip:punishment Map
 */
Punishments.ips = new PunishmentMap();

/**
 * userids is a userid:punishment Map
 */
Punishments.userids = new PunishmentMap();

class NestedPunishmentMap extends Map/*:: <string, Map<string, Punishment>> */ {
	nestedSet(k1, k2, value) {
		if (!this.get(k1)) {
			this.set(k1, new Map());
		}
		this.get(k1).set(k2, value);
	}
	nestedGet(k1, k2) {
		const subMap = this.get(k1);
		if (!subMap) return subMap;
		const punishment = subMap.get(k2);
		if (punishment) {
			if (Date.now() < punishment[2]) return punishment;
			this.nestedDelete(k1, k2);
		}
		return undefined;
	}
	nestedHas(k1, k2) {
		return !!this.nestedGet(k1, k2);
	}
	nestedDelete(k1, k2) {
		const subMap = this.get(k1);
		if (!subMap) return;
		subMap.delete(k2);
		if (!subMap.size) this.delete(k1);
	}
	nestedForEach(callback) {
		this.forEach((subMap, k1) => {
			subMap.forEach((punishment, k2) => {
				if (Date.now() < punishment[2]) return callback(punishment, k1, k2);
				this.nestedDelete(k1, k2);
			});
		});
	}
}

/**
 * roomUserids is a roomid:userid:punishment nested Map
 */
Punishments.roomUserids = new NestedPunishmentMap();

/**
 * roomIps is a roomid:ip:punishment Map
 */
Punishments.roomIps = new NestedPunishmentMap();


/*********************************************************
 * Persistence
 *********************************************************/

// punishType is an allcaps string, for global punishments they can be one of the following:
//   'LOCK'
//   'BAN'
//   'NAMELOCK'

// For room punishments, they can be anything in the roomPunishmentTypes map.
// This map can be extended with custom punishments by chat plugins.
// Keys in the map correspond to punishTypes, values signify the way they should be displayed in /alt
// By default, this includes:
//   'ROOMBAN'
//   'BLACKLIST'

Punishments.roomPunishmentTypes = new Map([
	['ROOMBAN', 'banned'],
	['BLACKLIST', 'blacklisted'],
]);

// punishments.tsv is in the format:
// punishType, userid, ips/usernames, expiration time
// room-punishments.tsv is in the format:
// punishType, roomid:userid, ips/usernames, expiration time


Punishments.loadPunishments = function () {
	fs.readFile(PUNISHMENT_FILE, (err, data) => {
		if (err) return;
		data = String(data).split("\n");
		for (let i = 0; i < data.length; i++) {
			if (!data[i] || data[i] === '\r') continue;
			const [punishType, id, altKeys, expireTimeStr, ...rest] = data[i].trim().split("\t");
			const expireTime = Number(expireTimeStr);
			if (punishType === "Punishment") continue;
			const keys = altKeys.split(',').concat(id);

			const punishment = [punishType, id, expireTime].concat(rest);
			if (Date.now() >= expireTime) {
				continue;
			}
			for (let j = 0; j < keys.length; j++) {
				const key = keys[j];
				if (key.includes('.')) {
					Punishments.ips.set(key, punishment);
				} else {
					Punishments.userids.set(key, punishment);
				}
			}
		}
	});
};

Punishments.loadRoomPunishments = function () {
	fs.readFile(ROOM_PUNISHMENT_FILE, (err, data) => {
		if (err) return;
		data = ('' + data).split("\n");
		for (let i = 0; i < data.length; i++) {
			if (!data[i] || data[i] === '\r') continue;
			const [punishType, id, altKeys, expireTimeStr, ...rest] = data[i].trim().split("\t");
			const expireTime = Number(expireTimeStr);
			if (punishType === "Punishment") continue;
			const [roomid, userid] = id.split(':');
			if (!userid) continue; // invalid format
			const keys = altKeys.split(',').concat(userid);

			const punishment = [punishType, userid, expireTime].concat(rest);
			if (Date.now() >= expireTime) {
				continue;
			}
			for (let j = 0; j < keys.length; j++) {
				const key = keys[j];
				if (key.includes('.')) {
					Punishments.roomIps.nestedSet(roomid, key, punishment);
				} else {
					Punishments.roomUserids.nestedSet(roomid, key, punishment);
				}
			}
		}
	});
};

Punishments.savePunishments = function () {
	const saveTable = new Map();
	Punishments.ips.forEach((punishment, ip) => {
		const [punishType, id, ...rest] = punishment;
		if (id.charAt(0) === '#') return;
		let entry = saveTable.get(id);

		if (entry) {
			entry.keys.push(ip);
			return;
		}

		entry = {
			keys: [ip],
			punishType: punishType,
			rest: rest,
		};
		saveTable.set(id, entry);
	});
	Punishments.userids.forEach((punishment, userid) => {
		const [punishType, id, ...rest] = punishment;
		if (id.charAt(0) === '#') return;
		let entry = saveTable.get(id);

		if (!entry) {
			entry = {
				keys: [],
				punishType: punishType,
				rest: rest,
			};
			saveTable.set(id, entry);
		}

		if (userid !== id) entry.keys.push(userid);
	});

	let buf = 'Punishment\tUser ID\tIPs and alts\tExpires\r\n';
	saveTable.forEach((entry, id) => {
		buf += Punishments.renderEntry(entry, id);
	});

	fs.writeFile(PUNISHMENT_FILE, buf, () => {});
};

Punishments.saveRoomPunishments = function () {
	const saveTable = new Map();
	Punishments.roomIps.nestedForEach((punishment, roomid, ip) => {
		const [punishType, punishUserid, ...rest] = punishment;
		const id = roomid + ':' + punishUserid;
		if (id.charAt(0) === '#') return;
		let entry = saveTable.get(id);

		if (entry) {
			entry.keys.push(ip);
			return;
		}

		entry = {
			keys: [ip],
			punishType: punishType,
			rest: rest,
		};
		saveTable.set(id, entry);
	});
	Punishments.roomUserids.nestedForEach((punishment, roomid, userid) => {
		const [punishType, punishUserid, ...rest] = punishment;
		const id = roomid + ':' + punishUserid;
		let entry = saveTable.get(id);

		if (!entry) {
			entry = {
				keys: [],
				punishType: punishType,
				rest: rest,
			};
			saveTable.set(id, entry);
		}

		if (userid !== punishUserid) entry.keys.push(userid);
	});

	let buf = 'Punishment\tRoom ID:User ID\tIPs and alts\tExpires\r\n';
	saveTable.forEach((entry, id) => {
		buf += Punishments.renderEntry(entry, id);
	});

	fs.writeFile(ROOM_PUNISHMENT_FILE, buf, () => {});
};

/**
 * @param {Object} entry
 * @param {string} id
 */
Punishments.appendPunishment = function (entry, id, filename) {
	if (id.charAt(0) === '#') return;
	let buf = Punishments.renderEntry(entry, id);
	fs.appendFile(filename, buf, () => {});
};

/**
 * @param {Object} entry
 * @param {string} id
 * @return {string}
 */
Punishments.renderEntry = function (entry, id) {
	let row = [entry.punishType, id, entry.keys.join(',')].concat(entry.rest);
	return row.join('\t') + '\r\n';
};

/**
 * @return {Promise}
 */
Punishments.loadBanlist = function () {
	return new Promise((resolve, reject) => {
		fs.readFile(path.resolve(__dirname, 'config/ipbans.txt'), (err, data) => {
			if (err && err.code === 'ENOENT') return resolve();
			if (err) return reject(err);
			data = ('' + data).split("\n");
			let rangebans = [];
			for (let i = 0; i < data.length; i++) {
				data[i] = data[i].split('#')[0].trim();
				if (!data[i]) continue;
				if (data[i].includes('/')) {
					rangebans.push(data[i]);
				} else if (!Punishments.ips.has(data[i])) {
					Punishments.ips.set(data[i], ['BAN', '#ipban', Infinity]);
				}
			}
			Punishments.checkRangeBanned = Dnsbl.checker(rangebans);
			resolve();
		});
	});
};

setImmediate(() => {
	Punishments.loadPunishments();
	Punishments.loadRoomPunishments();
	Punishments.loadBanlist();
});

/*********************************************************
 * Adding and removing
 *********************************************************/

/**
 * @param {User} user
 * @param {Punishment} punishment
 * @param {?Set<string>} noRecurse
 */
Punishments.punish = function (user, punishment, noRecurse) {
	let keys = noRecurse;
	if (!keys) {
		keys = new Set();
	}
	if (!noRecurse) {
		Users.users.forEach(curUser => {
			if (user === curUser || curUser.trusted) return;
			for (let myIp in curUser.ips) {
				if (myIp in user.ips) {
					this.punish(curUser, punishment, keys);
					return;
				}
			}
		});
	}

	for (let ip in user.ips) {
		Punishments.ips.set(ip, punishment);
		keys.add(ip);
	}
	if (!user.userid.startsWith('guest')) {
		Punishments.userids.set(user.userid, punishment);
	}
	if (user.autoconfirmed) {
		Punishments.userids.set(user.autoconfirmed, punishment);
		keys.add(user.autoconfirmed);
	}
	if (user.trusted) {
		Punishments.userids.set(user.trusted, punishment);
		keys.add(user.trusted);
	}
	if (!noRecurse) {
		const [punishType, id, ...rest] = punishment;
		keys.delete(id);
		Punishments.appendPunishment({
			keys: Array.from(keys),
			punishType: punishType,
			rest: rest,
		}, id, PUNISHMENT_FILE);
	}
};
/**
 * @param {string} id
 * @param {string} punishType
 */
Punishments.unpunish = function (id, punishType) {
	id = toId(id);
	let punishment = Punishments.userids.get(id);
	if (punishment) {
		id = punishment[1];
	}
	// in theory we can stop here if punishment doesn't exist, but
	// in case of inconsistent state, we'll try anyway

	let success = false;
	Punishments.ips.forEach((punishment, key) => {
		if (punishment[1] === id && punishment[0] === punishType) {
			Punishments.ips.delete(key);
			success = id;
		}
	});
	Punishments.userids.forEach((punishment, key) => {
		if (punishment[1] === id && punishment[0] === punishType) {
			Punishments.userids.delete(key);
			success = id;
		}
	});
	if (success) {
		Punishments.savePunishments();
	}
	return success;
};

/**
 * @param {User} user
 * @param {Punishment} punishment
 * @param {?Set<string>} noRecurse
 */
Punishments.roomPunish = function (room, user, punishment, noRecurse) {
	let keys = noRecurse;
	if (!keys) {
		keys = new Set();
	}
	if (!noRecurse) {
		Users.users.forEach(curUser => {
			if (user === curUser || curUser.trusted) return;
			for (let myIp in curUser.ips) {
				if (myIp in user.ips) {
					this.roomPunish(room, curUser, punishment, keys);
					return;
				}
			}
		});
	}

	for (let ip in user.ips) {
		Punishments.roomIps.nestedSet(room.id, ip, punishment);
		keys.add(ip);
	}
	if (!user.userid.startsWith('guest')) {
		Punishments.roomUserids.nestedSet(room.id, user.userid, punishment);
	}
	if (user.autoconfirmed) {
		Punishments.roomUserids.nestedSet(room.id, user.autoconfirmed, punishment);
		keys.add(user.autoconfirmed);
	}
	if (user.trusted) {
		Punishments.roomUserids.nestedSet(room.id, user.confirmed, punishment);
		keys.add(user.trusted);
	}
	if (!noRecurse) {
		const [punishType, id, ...rest] = punishment;
		keys.delete(id);
		Punishments.appendPunishment({
			keys: Array.from(keys),
			punishType: punishType,
			rest: rest,
		}, room.id + ':' + id, ROOM_PUNISHMENT_FILE);
	}
};

Punishments.roomPunishName = function (room, userid, punishment) {
	Punishments.roomUserids.nestedSet(room.id, userid, punishment);
	const [punishType, id, ...rest] = punishment;
	Punishments.appendPunishment({
		keys: [userid],
		punishType: punishType,
		rest: rest,
	}, room.id + ':' + id, ROOM_PUNISHMENT_FILE);
};
/**
 * @param {string} id
 * @param {string} punishType
 */
Punishments.roomUnpunish = function (room, id, punishType, ignoreWrite) {
	id = toId(id);
	let punishment = Punishments.roomUserids.nestedGet(room, id);
	if (punishment) {
		id = punishment[1];
	}
	// in theory we can stop here if punishment doesn't exist, but
	// in case of inconsistent state, we'll try anyway

	let success;
	const ipSubMap = Punishments.roomIps.get(room.id);
	if (ipSubMap) {
		ipSubMap.forEach((punishment, key) => {
			if (punishment[1] === id && punishment[0] === punishType) {
				ipSubMap.delete(key);
				success = id;
			}
		});
	}
	const useridSubMap = Punishments.roomUserids.get(room.id);
	if (useridSubMap) {
		useridSubMap.forEach((punishment, key) => {
			if (punishment[1] === id && punishment[0] === punishType) {
				useridSubMap.delete(key);
				success = id;
			}
		});
	}
	if (success && !ignoreWrite) {
		Punishments.saveRoomPunishments();
	}
	return success;
};

/*********************************************************
 * Specific punishments
 *********************************************************/

/**
 * @param {User} user
 * @param {number} expireTime
 * @param {string} id
 * @param {?string} reason
 */
Punishments.ban = function (user, expireTime, id, ...reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + BAN_DURATION;
	let punishment = ['BAN', id, expireTime, ...reason];
	Punishments.punish(user, punishment);

	let affected = user.getAltUsers(false, true);
	for (let curUser of affected) {
		curUser.locked = id;
		curUser.disconnectAll();
	}
};
/**
 * @param {string} name
 */
Punishments.unban = function (name) {
	return Punishments.unpunish(name, 'BAN');
};
/**
 * @param {User} user
 * @param {number} expireTime
 * @param {string} id
 * @param {?string} reason
 */
Punishments.lock = function (user, expireTime, id, ...reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
	let punishment = ['LOCK', id, expireTime, ...reason];
	Punishments.punish(user, punishment);

	let affected = user.getAltUsers(false, true);
	for (let curUser of affected) {
		curUser.locked = id;
		curUser.updateIdentity();
	}
};
/**
 * @param {string} name
 */
Punishments.unlock = function (name) {
	let user = Users(name);
	let id = toId(name);
	let success = [];
	if (user && user.locked && !user.namelocked) {
		id = user.locked;
		user.locked = false;
		user.namelocked = false;
		user.updateIdentity();
		success.push(user.getLastName());
		if (id.charAt(0) !== '#') {
			Users.users.forEach(curUser => {
				if (curUser.locked === id) {
					curUser.locked = false;
					curUser.namelocked = false;
					curUser.updateIdentity();
					success.push(curUser.getLastName());
				}
			});
		}
	}
	if (Punishments.unpunish(name, 'LOCK')) {
		if (!success.length) success.push(name);
	}
	if (!success.length) return undefined;
	if (!success.some(v => toId(v) === id)) {
		success.push(id);
	}
	return success;
};
/**
 * @param {User} user
 * @param {number} expireTime
 * @param {string} id
 * @param {?string} reason
 */
Punishments.namelock = function (user, expireTime, id, ...reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
	let punishment = ['NAMELOCK', id, expireTime, ...reason];
	Punishments.punish(user, punishment);

	let affected = user.getAltUsers(false, true);
	for (let curUser of affected) {
		curUser.locked = id;
		curUser.namelocked = id;
		curUser.resetName();
		curUser.updateIdentity();
	}
};
/**
 * @param {string} name
 */
Punishments.unnamelock = function (name) {
	let user = Users(name);
	let id = toId(name);
	let success = [];
	let unpunished = Punishments.unpunish(name, 'NAMELOCK');
	if (user && user.locked) {
		id = user.locked;
		user.locked = false;
		user.namelocked = false;
		user.resetName();
		success.push(user.getLastName());
		if (id.charAt(0) !== '#') {
			Users.users.forEach(curUser => {
				if (curUser.locked === id) {
					curUser.locked = false;
					curUser.namelocked = false;
					curUser.resetName();
					success.push(curUser.getLastName());
				}
			});
		}
	}
	if (unpunished && !success.length) success.push(name);
	if (!success.length) return false;
	if (!success.some(v => toId(v) === id)) {
		success.push(id);
	}
	return success;
};

/**
 * @param {string} range
 * @param {string} reason
 */
Punishments.lockRange = function (range, reason) {
	let punishment = ['LOCK', '#rangelock', Date.now() + RANGELOCK_DURATION, reason];
	Punishments.ips.set(range, punishment);
};
/**
 * @param {string} range
 * @param {string} reason
 */
Punishments.banRange = function (range, reason) {
	let punishment = ['BAN', '#rangelock', Date.now() + RANGELOCK_DURATION, reason];
	Punishments.ips.set(range, punishment);
};

/**
 * @param {Room} room
 * @param {User} user
 * @param {boolean} noRecurse
 * @param {string} userid
 */
Punishments.roomBan = function (room, user, expireTime, id, ...rest) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + ROOMBAN_DURATION;
	let punishment = ['ROOMBAN', id, expireTime].concat(rest);
	Punishments.roomPunish(room, user, punishment);

	let affected = user.getAltUsers(false, true);
	for (let curUser of affected) {
		if (room.game && room.game.removeBannedUser) {
			room.game.removeBannedUser(curUser);
		}
		curUser.leaveRoom(room.id);
	}
};

Punishments.roomBlacklist = function (room, user, expireTime, id, ...rest) {
	if (!id && user) id = user.getLastId();
	if (!user) user = Users(id);

	if (!expireTime) expireTime = Date.now() + BLACKLIST_DURATION;
	let punishment = ['BLACKLIST', id, expireTime].concat(rest);
	if (user) {
		Punishments.roomPunish(room, user, punishment);

		let affected = user.getAltUsers(false, true);
		for (let curUser of affected) {
			if (room.game && room.game.removeBannedUser) {
				room.game.removeBannedUser(curUser);
			}
			curUser.leaveRoom(room.id);
		}
	} else {
		Punishments.roomPunishName(room, id, punishment);
	}
};

/**
 * @param {Room} room
 * @param {string} userid
 * @param {boolean} noRecurse
 */
Punishments.roomUnban = function (room, userid) {
	const user = Users(userid);
	if (user) {
		let punishment = Punishments.isRoomBanned(user, room.id);
		if (punishment) userid = punishment[1];
	}
	return Punishments.roomUnpunish(room, userid, 'ROOMBAN');
};

Punishments.roomUnblacklist = function (room, userid, ignoreWrite) {
	const user = Users(userid);
	if (user) {
		let punishment = Punishments.isRoomBanned(user, room.id);
		if (punishment) userid = punishment[1];
	}
	return Punishments.roomUnpunish(room, userid, 'BLACKLIST', ignoreWrite);
};

Punishments.roomUnblacklistAll = function (room) {
	const roombans = Punishments.roomUserids.get(room.id);
	if (!roombans) return false;

	let unblacklisted = [];

	roombans.forEach((punishment, userid) => {
		if (punishment[0] === 'BLACKLIST') {
			Punishments.roomUnblacklist(room, userid, true);
			unblacklisted.push(userid);
		}
	});
	if (unblacklisted.length === 0) return false;
	Punishments.saveRoomPunishments();
	return unblacklisted;
};

/*********************************************************
 * Checking
 *********************************************************/

/**
 * @param {string} name
 */
Punishments.getPunishType = function (name) {
	let punishment = Punishments.userids.get(toId(name));
	if (punishment) return punishment[0];
	let user = Users.get(name);
	if (!user) return;
	punishment = Punishments.ipSearch(user.latestIp);
	if (punishment) return punishment[0];
	return '';
};

Punishments.getRoomPunishType = function (room, name) {
	let punishment = Punishments.roomUserids.nestedGet(room.id, toId(name));
	if (punishment) return punishment[0];
	let user = Users.get(name);
	if (!user) return;
	punishment = Punishments.roomIps.nestedGet(room.id, user.latestIp);
	if (punishment) return punishment[0];
	return '';
};

/**
 * Searches for IP in Punishments.ips
 *
 * For instance, if IP is '1.2.3.4', will return the value corresponding
 * to any of the keys in table match '1.2.3.4', '1.2.3.*', '1.2.*', or '1.*'
 *
 * @param {string} ip
 * @return {?Array}
 */
Punishments.ipSearch = function (ip) {
	let punishment = Punishments.ips.get(ip);
	if (punishment) return punishment;
	let dotIndex = ip.lastIndexOf('.');
	for (let i = 0; i < 4 && dotIndex > 0; i++) {
		ip = ip.substr(0, dotIndex);
		punishment = Punishments.ips.get(ip + '.*');
		if (punishment) return punishment;
		dotIndex = ip.lastIndexOf('.');
	}
	return undefined;
};

/**
 * @param {string} userid
 * @return {?Array}
 */
Punishments.shortenHost = function (host) {
	if (host.slice(-7) === '-nohost') return host;
	let dotLoc = host.lastIndexOf('.');
	let tld = host.substr(dotLoc);
	if (tld === '.uk' || tld === '.au' || tld === '.br') dotLoc = host.lastIndexOf('.', dotLoc - 1);
	dotLoc = host.lastIndexOf('.', dotLoc - 1);
	return host.substr(dotLoc + 1);
};

// Defined in Punishments.loadBanlist
Punishments.checkRangeBanned = function () {};

/**
 * @param {User} user
 * @param {boolean} registered
 */
Punishments.checkName = function (user, registered) {
	let userid = user.userid;
	let punishment = Punishments.userids.get(userid);
	if (!punishment && user.namelocked) {
		punishment = Punishments.userids.get(user.namelocked);
		if (!punishment) punishment = ['NAMELOCK', user.namelocked, 0];
	}
	if (!punishment && user.locked) {
		punishment = Punishments.userids.get(user.locked);
		if (!punishment) punishment = ['LOCK', user.locked, 0];
	}
	if (!punishment) return;

	let id = punishment[0];
	let punishUserid = punishment[1];
	let reason = ``;
	if (punishment[3]) reason = `||||Reason: ${punishment[3]}`;
	let appeal = ``;
	if (Config.appealurl) appeal = `||||Or you can appeal at: ${Config.appealurl}`;
	let bannedUnder = ``;
	if (punishUserid !== userid) bannedUnder = ` because you have the same IP as banned user: ${punishUserid}`;

	if (registered && id === 'BAN') {
		user.send(`|popup|Your username (${user.name}) is banned${bannedUnder}. Your ban will expire in a few days.${reason}${appeal}`);
		user.punishmentNotified = true;
		Punishments.punish(user, punishment);
		user.disconnectAll();
		return;
	}
	if (id === 'NAMELOCK' || user.namelocked) {
		user.send(`|popup|You are namelocked and can't have a username${bannedUnder}'. Your namelock will expire in a few days.${reason}${appeal}`);
		if (punishment[2]) Punishments.punish(user, punishment);
		user.locked = punishUserid;
		user.namelocked = punishUserid;
		user.resetName();
		user.updateIdentity();
	} else {
		if (!user.lockNotified) {
			user.send(`|popup|You are locked${bannedUnder}. Your lock will expire in a few days.${reason}${appeal}`);
			user.lockNotified = true;
		}
		Punishments.punish(user, punishment);
		user.locked = punishUserid;
		user.updateIdentity();
	}
};

/**
 * @param {User} user
 * @param {Connection} connection
 */
Punishments.checkIp = function (user, connection) {
	let ip = connection.ip;
	let punishment = Punishments.ipSearch(ip);

	if (punishment) {
		user.locked = punishment[1];
		if (punishment[0] === 'NAMELOCK') {
			user.namelocked = punishment[1];
		}
	}

	Dnsbl.reverse(ip).then(host => {
		if (host) user.latestHost = host;
		if (Config.hostfilter) Config.hostfilter(host, user, connection);
	});

	if (Config.dnsbl) {
		Dnsbl.query(connection.ip).then(isBlocked => {
			if (isBlocked) {
				if (connection.user && !connection.user.locked && !connection.user.autoconfirmed) {
					connection.user.semilocked = '#dnsbl';
				}
			}
		});
	}
};

/**
 * Connection flood table. Separate table from IP bans.
 * @type Set<string>
 */
let cfloods = Punishments.cfloods = new Set();

/**
 * IP bans need to be checked separately since we don't even want to
 * make a User object if an IP is banned.
 *
 * @param {Connection} connection
 * @return {?string}
 */
Punishments.checkIpBanned = function (connection) {
	let ip = connection.ip;
	if (cfloods.has(ip) || (Monitor.countConnection(ip) && cfloods.add(ip))) {
		connection.send(`|popup||modal|PS is under heavy load and cannot accommodate your connection right now.`);
		return '#cflood';
	}

	let banned = false;
	let punishment = Punishments.ipSearch(ip);
	if (punishment && punishment[0] === 'BAN') {
		banned = punishment[1];
	} else if (Punishments.checkRangeBanned(ip)) {
		banned = '#ipban';
	}
	if (!banned) return false;

	if (banned === '#ipban') {
		connection.send(`|popup||modal|Your IP (${ip}) is not allowed to connect to PS, because it has been used to spam, hack, or otherwise attack our server.||Make sure you are not using any proxies to connect to PS.`);
	} else {
		let appeal = (Config.appealurl ? `||||Or you can appeal at: ${Config.appealurl}` : ``);
		connection.send(`|popup||modal|You are banned because you have the same IP (${ip}) as banned user '${banned}'. Your ban will expire in a few days.${appeal}`);
	}
	if (!Config.quietconsole) console.log(`CONNECT BLOCKED - IP BANNED: ${ip} (${banned})`);

	return banned;
};

Punishments.checkNameInRoom = function (user, roomid) {
	let punishment = Punishments.roomUserids.nestedGet(roomid, user.userid);
	if (!punishment && user.autoconfirmed) {
		punishment = Punishments.roomUserids.nestedGet(roomid, user.autoconfirmed);
	}
	if (!punishment) return;
	if (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST') {
		return true;
	}
};

Punishments.checkNewNameInRoom = function (user, userid, roomid) {
	const punishment = Punishments.roomUserids.nestedGet(roomid, userid);
	if (punishment) {
		if (punishment[0] !== 'ROOMBAN' && punishment[0] !== 'BLACKLIST') return;
		const room = Rooms(roomid);
		if (room.game && room.game.removeBannedUser) {
			room.game.removeBannedUser(user);
		}
		user.leaveRoom(room.id);
	}
};

Punishments.checkLockExpiration = function (userid) {
	const punishment = Punishments.userids.get(userid);

	if (punishment) {
		let expiresIn = new Date(punishment[2]).getTime() - Date.now();
		let expiresDays = Math.round(expiresIn / 1000 / 60 / 60 / 24);
		if (expiresIn > 1) return ` (expires in around ${expiresDays} day${Chat.plural(expiresDays)})`;
	}

	return ``;
};

Punishments.isRoomBanned = function (user, roomid) {
	if (!user) return;

	let punishment = Punishments.roomUserids.nestedGet(roomid, user.userid);
	if (punishment && (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST')) return punishment;

	if (user.autoconfirmed) {
		punishment = Punishments.roomUserids.nestedGet(roomid, user.autoconfirmed);
		if (punishment && (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST')) return punishment;
	}

	for (let ip in user.ips) {
		punishment = Punishments.roomIps.nestedGet(roomid, ip);
		if (punishment && (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST')) return punishment;
	}
};
