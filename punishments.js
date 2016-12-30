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
const SHAREDIPS_FILE = path.resolve(__dirname, 'config/sharedips.tsv');

const RANGELOCK_DURATION = 60 * 60 * 1000; // 1 hour
const LOCK_DURATION = 48 * 60 * 60 * 1000; // 48 hours
const BAN_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week

const ROOMBAN_DURATION = 48 * 60 * 60 * 1000; // 48 hours
const BLACKLIST_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year

const USERID_REGEX = /^[a-z0-9]+$/;
const PUNISH_TRUSTED = false;

const PUNISHMENT_POINT_VALUES = {MUTE: 2, BLACKLIST: 3, ROOMBAN: 4};

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

/**
 * sharedIps is an ip:note Map
 */
Punishments.sharedIps = new Map();


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
//   'MUTE' (used by getRoomPunishments)

Punishments.roomPunishmentTypes = new Map([
	['ROOMBAN', 'banned'],
	['BLACKLIST', 'blacklisted'],
	['MUTE', 'muted'],
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
				if (!USERID_REGEX.test(key)) {
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
				if (!USERID_REGEX.test(key)) {
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

// sharedips.tsv is in the format:
// IP, type (in this case always SHARED), note

Punishments.loadSharedIps = function () {
	fs.readFile(SHAREDIPS_FILE, (err, data) => {
		if (err) return;
		data = String(data).split("\n");
		for (let i = 0; i < data.length; i++) {
			if (!data[i] || data[i] === '\r') continue;
			const [ip, type, note] = data[i].trim().split("\t");
			if (!ip.includes('.')) continue;
			if (type !== 'SHARED') continue;

			Punishments.sharedIps.set(ip, note);
		}
	});
};

/**
 * @param {string} ip
 * @param {string} note
 */
Punishments.appendSharedIp = function (ip, note) {
	let buf = `${ip}\tSHARED\t${note}\r\n`;
	fs.appendFile(SHAREDIPS_FILE, buf, () => {});
};

Punishments.saveSharedIps = function () {
	let buf = 'IP\tType\tNote\r\n';
	Punishments.sharedIps.forEach((note, ip) => {
		buf += `${ip}\tSHARED\t${note}\r\n`;
	});

	fs.writeFile(SHAREDIPS_FILE, buf, () => {});
};

setImmediate(() => {
	Punishments.loadPunishments();
	Punishments.loadRoomPunishments();
	Punishments.loadBanlist();
	Punishments.loadSharedIps();
});

/*********************************************************
 * Adding and removing
 *********************************************************/

/**
 * @param {User} user
 * @param {Punishment} punishment
 * @param {?Set<string>} recursionKeys
 */
Punishments.punish = function (user, punishment, recursionKeys) {
	let keys = recursionKeys || new Set();

	if (!recursionKeys) {
		let affected = user.getAltUsers(PUNISH_TRUSTED, true);
		for (let curUser of affected) {
			this.punish(curUser, punishment, keys);
		}
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
	if (!recursionKeys) {
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
 * @param {?Set<string>} recursionKeys
 */
Punishments.roomPunish = function (room, user, punishment, recursionKeys) {
	let keys = recursionKeys || new Set();

	if (!recursionKeys) {
		let affected = user.getAltUsers(PUNISH_TRUSTED, true);
		for (let curUser of affected) {
			this.roomPunish(room, curUser, punishment, keys);
		}
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
		Punishments.roomUserids.nestedSet(room.id, user.trusted, punishment);
		keys.add(user.trusted);
	}
	if (!recursionKeys) {
		const [punishType, id, ...rest] = punishment;
		keys.delete(id);
		Punishments.appendPunishment({
			keys: Array.from(keys),
			punishType: punishType,
			rest: rest,
		}, room.id + ':' + id, ROOM_PUNISHMENT_FILE);

		if (!(room.isPrivate === true || room.isPersonal || room.battle)) Punishments.monitorRoomPunishments(user);
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

	if (!(room.isPrivate === true || room.isPersonal || room.battle)) Punishments.monitorRoomPunishments(userid);
};

/**
 * @param {Room} room
 * @param {string} userid
 * @param {string} punishType
 * @param {boolean} ignoreWrite Flag to skip persistent storage.
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
 * @param {...string} [reason]
 */
Punishments.ban = function (user, expireTime, id, ...reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + BAN_DURATION;
	let punishment = ['BAN', id, expireTime, ...reason];
	Punishments.punish(user, punishment);

	let affected = user.getAltUsers(PUNISH_TRUSTED, true);
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
 * @param {...string} [reason]
 */
Punishments.lock = function (user, expireTime, id, ...reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
	let punishment = ['LOCK', id, expireTime, ...reason];
	Punishments.punish(user, punishment);

	let affected = user.getAltUsers(PUNISH_TRUSTED, true);
	for (let curUser of affected) {
		curUser.locked = id;
		curUser.updateIdentity();
	}
};
/**
 * @param {User} user
 * @param {Room} room
 * @param {string} source
 * @param {string} reason
 * @param {?string} message
 * @param {?boolean} week
 */
Punishments.autolock = function (user, room, source, reason, message, week) {
	if (!message) message = reason;

	let punishment = `LOCKED`;
	let expires = null;
	if (week) {
		expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
		punishment = `WEEKLOCKED`;
	}
	Punishments.lock(user, expires, user.userid, `Autolock: ${user.name}: ${reason}`);
	Monitor.log(`[${source}] ${punishment}: ${message}`);
	Rooms.global.modlog(`(${toId(room)}) AUTOLOCK: [${user.userid}]: ${reason}`);
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
 * @param {...string} [reason]
 */
Punishments.namelock = function (user, expireTime, id, ...reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
	let punishment = ['NAMELOCK', id, expireTime, ...reason];
	Punishments.punish(user, punishment);

	let affected = user.getAltUsers(PUNISH_TRUSTED, true);
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
 * @param {number} expireTime
 * @param {string} userId
 * @param {...string} [reason]
 */
Punishments.roomBan = function (room, user, expireTime, userId, ...reason) {
	if (!userId) userId = user.getLastId();

	if (!expireTime) expireTime = Date.now() + ROOMBAN_DURATION;
	let punishment = ['ROOMBAN', userId, expireTime].concat(reason);
	Punishments.roomPunish(room, user, punishment);

	let affected = user.getAltUsers(PUNISH_TRUSTED, true);
	for (let curUser of affected) {
		if (room.game && room.game.removeBannedUser) {
			room.game.removeBannedUser(curUser);
		}
		curUser.leaveRoom(room.id);
	}
};

/**
 * @param {Room} room
 * @param {User} user
 * @param {number} expireTime
 * @param {string} userId
 * @param {...string} [reason]
 */
Punishments.roomBlacklist = function (room, user, expireTime, userId, ...reason) {
	if (!userId && user) userId = user.getLastId();
	if (!user) user = Users(userId);

	if (!expireTime) expireTime = Date.now() + BLACKLIST_DURATION;
	let punishment = ['BLACKLIST', userId, expireTime].concat(reason);

	if (!user || userId && userId !== user.userid) {
		Punishments.roomPunishName(room, userId, punishment);
	}

	if (user) {
		Punishments.roomPunish(room, user, punishment);

		let affected = user.getAltUsers(PUNISH_TRUSTED, true);
		for (let curUser of affected) {
			if (room.game && room.game.removeBannedUser) {
				room.game.removeBannedUser(curUser);
			}
			curUser.leaveRoom(room.id);
		}
	}
};

/**
 * @param {Room} room
 * @param {string} userid
 */
Punishments.roomUnban = function (room, userid) {
	const user = Users(userid);
	if (user) {
		let punishment = Punishments.isRoomBanned(user, room.id);
		if (punishment) userid = punishment[1];
	}
	return Punishments.roomUnpunish(room, userid, 'ROOMBAN');
};

/**
 * @param {Room} room
 * @param {string} userid
 * @param {boolean} ignoreWrite Flag to skip persistent storage.
 */
Punishments.roomUnblacklist = function (room, userid, ignoreWrite) {
	const user = Users(userid);
	if (user) {
		let punishment = Punishments.isRoomBanned(user, room.id);
		if (punishment) userid = punishment[1];
	}
	return Punishments.roomUnpunish(room, userid, 'BLACKLIST', ignoreWrite);
};

/**
 * @param {Room} room
 */
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

/**
 * @param {string} ip
 * @param {string} note
 */
Punishments.addSharedIp = function (ip, note) {
	Punishments.sharedIps.set(ip, note);
	Punishments.appendSharedIp(ip, note);

	Users.users.forEach(user => {
		if (user.locked && user.locked !== user.userid && ip in user.ips) {
			if (!user.autoconfirmed) {
				user.semilocked = `#sharedip ${user.locked}`;
			}
			user.locked = false;

			user.updateIdentity();
		}
	});
};

/**
 * @param {string} ip
 */
Punishments.removeSharedIp = function (ip) {
	Punishments.sharedIps.delete(ip);
	Punishments.saveSharedIps();
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

/**
 * @param {Room} room
 * @param {string} name
 */
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
		user.send(`|popup|You are namelocked and can't have a username${bannedUnder}. Your namelock will expire in a few days.${reason}${appeal}`);
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
		if (Punishments.sharedIps.has(user.latestIp)) {
			if (connection.user && !connection.user.locked && !connection.user.autoconfirmed) {
				connection.user.semilocked = `#sharedip ${punishment[1]}`;
			}
		} else {
			user.locked = punishment[1];
			if (punishment[0] === 'NAMELOCK') {
				user.namelocked = punishment[1];
			}
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

	if (Punishments.sharedIps.has(ip)) return false;

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

/**
 * @param {User} user
 * @param {string} roomid
 * @return {boolean}
 */
Punishments.checkNameInRoom = function (user, roomid) {
	let punishment = Punishments.roomUserids.nestedGet(roomid, user.userid);
	if (!punishment && user.autoconfirmed) {
		punishment = Punishments.roomUserids.nestedGet(roomid, user.autoconfirmed);
	}
	if (!punishment) return false;
	if (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST') {
		return true;
	}
};

/**
 * @param {User} user
 * @param {string} userid The name into which the user is renamed.
 * @param {string} roomid
 */
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

/**
 * @param {string} userid
 * @return {string} Descriptive text for the remaining time until the punishment expires, if any.
 */
Punishments.checkLockExpiration = function (userid) {
	const punishment = Punishments.userids.get(userid);

	if (punishment) {
		let expiresIn = new Date(punishment[2]).getTime() - Date.now();
		let expiresDays = Math.round(expiresIn / 1000 / 60 / 60 / 24);
		if (expiresIn > 1) return ` (expires in around ${expiresDays} day${Chat.plural(expiresDays)})`;
	}

	return ``;
};

/**
 * @param {User} user
 * @param {string} roomid
 * @return {?Punishment}
 */
Punishments.isRoomBanned = function (user, roomid) {
	if (!user) throw new Error(`Trying to check if a non-existent user is room banned.`);

	let punishment = Punishments.roomUserids.nestedGet(roomid, user.userid);
	if (punishment && (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST')) return punishment;

	if (user.autoconfirmed) {
		punishment = Punishments.roomUserids.nestedGet(roomid, user.autoconfirmed);
		if (punishment && (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST')) return punishment;
	}

	for (let ip in user.ips) {
		punishment = Punishments.roomIps.nestedGet(roomid, ip);
		if (punishment) {
			 if (punishment[0] === 'ROOMBAN') {
				return punishment;
			 } else if (punishment[0] === 'BLACKLIST') {
				if (Punishments.sharedIps.has(ip) && user.autoconfirmed) return;

				return punishment;
			 }
		}
	}
};

/**
 * Returns an array of all room punishments associated with a user.
 *
 * options.publicOnly will make this only return public room punishments.
 * options.checkIps will also check the IP of the user for IP-based punishments.
 *
 * @param {User} user
 * @param {?Object} options
 * @return {Array}
 */
Punishments.getRoomPunishments = function (user, options) {
	if (!user) return;
	let userid = toId(user);
	let checkMutes = typeof user !== 'string';

	let punishments = [];

	for (let i = 0; i < Rooms.global.chatRooms.length; i++) {
		const curRoom = Rooms.global.chatRooms[i];
		if (!curRoom || curRoom.isPrivate === true || ((options && options.publicOnly) && (curRoom.isPersonal || curRoom.battle))) continue;
		let punishment = Punishments.roomUserids.nestedGet(curRoom.id, userid);
		if (punishment) {
			punishments.push([curRoom, punishment]);
			continue;
		} else if (options && options.checkIps) {
			for (let ip in user.ips) {
				punishment = Punishments.roomIps.nestedGet(curRoom.id, ip);
				if (punishment) {
					punishments.push([curRoom, punishment]);
					continue;
				}
			}
		}
		if (checkMutes && curRoom.muteQueue) {
			for (let i = 0; i < curRoom.muteQueue.length; i++) {
				let entry = curRoom.muteQueue[i];
				if (userid === entry.userid ||
					user.guestNum === entry.guestNum ||
					(user.autoconfirmed && user.autoconfirmed === entry.autoconfirmed)) {
					punishments.push([curRoom, ['MUTE', entry.userid, curRoom.muteQueue[i].time]]);
				}
			}
		}
	}

	return punishments;
};

/**
 * Notifies staff if a user has three or more room punishments.
 *
 * @param {User} user
 */
Punishments.monitorRoomPunishments = function (user) {
	if (user.locked) return;

	const minPunishments = (typeof Config.monitorminpunishments === 'number' ? Config.monitorminpunishments : 3); // Default to 3 if the Config option is not defined or valid
	if (!minPunishments) return;

	let punishments = Punishments.getRoomPunishments(user, {publicOnly: true});

	if (punishments.length >= minPunishments) {
		let points = 0;

		let punishmentText = punishments.map(([room, punishment]) => {
			const [punishType, punishUserid, , reason] = punishment;
			if (punishType in PUNISHMENT_POINT_VALUES) points += PUNISHMENT_POINT_VALUES[punishType];
			let punishDesc = Punishments.roomPunishmentTypes.get(punishType);
			if (!punishDesc) punishDesc = `punished`;
			if (punishUserid !== user.userid) punishDesc += ` as ${punishUserid}`;

			if (reason) punishDesc += `: ${reason}`;
			return `<<${room}>> (${punishDesc})`;
		}).join(', ');

		if (Config.punishmentautolock && points >= 10) {
			let rooms = punishments.map(([room]) => room).join(', ');
			let reason = `Autolocked for having punishments in ${punishments.length} rooms: ${rooms}`;
			let message = `${user.name} was locked for having punishments in ${punishments.length} rooms: ${punishmentText}`;

			Punishments.autolock(user, 'staff', 'PunishmentMonitor', reason, message);
			user.popup("|modal|You've been locked for breaking the rules in multiple chatrooms.\n\nIf you feel that your lock was unjustified, you can still PM staff members (%, @, &, and ~) to discuss it" + (Config.appealurl ? " or you can appeal:\n" + Config.appealurl : ".") + "\n\nYour lock will expire in a few days.");
		} else {
			Monitor.log(`[PunishmentMonitor] ${user.name} currently has punishments in ${punishments.length} rooms: ${punishmentText}`);
		}
	}
};
