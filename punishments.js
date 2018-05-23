'use strict';
/** @typedef {GlobalRoom | GameRoom | ChatRoom} Room */
/**
 * Punishments
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Handles the punishing of users on PS.
 *
 * There are four types of global punishments on PS. Locks, bans, namelocks and rangelocks.
 * This file contains the lists of users that have been punished (both IPs and usernames),
 * as well as the functions that handle the execution of said punishments.
 *
 * @license MIT license
 */

let Punishments = module.exports;

const FS = require('./lib/fs');

const PUNISHMENT_FILE = 'config/punishments.tsv';
const ROOM_PUNISHMENT_FILE = 'config/room-punishments.tsv';
const SHAREDIPS_FILE = 'config/sharedips.tsv';

const RANGELOCK_DURATION = 60 * 60 * 1000; // 1 hour
const LOCK_DURATION = 48 * 60 * 60 * 1000; // 48 hours
const GLOBALBAN_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week
const BATTLEBAN_DURATION = 48 * 60 * 60 * 1000; // 48 hours

const ROOMBAN_DURATION = 48 * 60 * 60 * 1000; // 48 hours
const BLACKLIST_DURATION = 365 * 24 * 60 * 60 * 1000; // 1 year

const USERID_REGEX = /^[a-z0-9]+$/;
const PUNISH_TRUSTED = false;

const PUNISHMENT_POINT_VALUES = {MUTE: 2, BLACKLIST: 3, BATTLEBAN: 4, ROOMBAN: 4};
const AUTOLOCK_POINT_THRESHOLD = 8;

/**
 * a punishment is an array: [punishType, userid, expireTime, reason]
 * @typedef {[string, string, number, string]} Punishment
 */

/**
 * TODO: Properly Typescript this.
 * @typedef {any[]} PunishmentRow
 */

/**
 * @augments {Map<string, Punishment>}
 */
// @ts-ignore TODO: possible TypeScript bug
class PunishmentMap extends Map {
	get(/** @type {string} */ k) {
		const punishment = super.get(k);
		if (punishment) {
			if (Date.now() < punishment[2]) return punishment;
			this.delete(k);
		}
		return undefined;
	}
	has(/** @type {string} */ k) {
		return !!this.get(k);
	}
	/**
	 * @param {(punishment: Punishment, id: string, map: PunishmentMap) => void} callback
	 */
	forEach(callback) {
		super.forEach((punishment, k) => {
			if (Date.now() < punishment[2]) return callback(punishment, k, this);
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

/**
 * @augments {Map<string, Map<string, Punishment>>}
 */
// @ts-ignore TODO: possible TypeScript bug
class NestedPunishmentMap extends Map {
	/**
	 * @param {string} k1
	 * @param {string} k2
	 * @param {Punishment} value
	 */
	nestedSet(k1, k2, value) {
		if (!this.get(k1)) {
			this.set(k1, new Map());
		}
		// @ts-ignore
		this.get(k1).set(k2, value);
	}
	/**
	 * @param {string} k1
	 * @param {string} k2
	 */
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
	/**
	 * @param {string} k1
	 * @param {string} k2
	 */
	nestedHas(k1, k2) {
		return !!this.nestedGet(k1, k2);
	}
	/**
	 * @param {string} k1
	 * @param {string} k2
	 */
	nestedDelete(k1, k2) {
		const subMap = this.get(k1);
		if (!subMap) return;
		subMap.delete(k2);
		if (!subMap.size) this.delete(k1);
	}
	/**
	 * @param {(punishment: Punishment, roomid: string, userid: string) => void} callback
	 */
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

// punishType is an allcaps string, for global punishments they can be anything in the punishmentTypes map.
// This map can be extended with custom punishments by chat plugins.
// Keys in the map correspond to punishTypes, values signify the way they should be displayed in /alt

/** @type {Map<string, string>} */
Punishments.punishmentTypes = new Map([
	['LOCK', 'locked'],
	['BAN', 'globally banned'],
	['NAMELOCK', 'namelocked'],
]);

// For room punishments, they can be anything in the roomPunishmentTypes map.
// This map can be extended with custom punishments by chat plugins.
// Keys in the map correspond to punishTypes, values signify the way they should be displayed in /alt
// By default, this includes:
//   'ROOMBAN'
//   'BLACKLIST'
//   'BATTLEBAN'
//   'MUTE' (used by getRoomPunishments)

/** @type {Map<string, string>} */
Punishments.roomPunishmentTypes = new Map([
	['ROOMBAN', 'banned'],
	['BLACKLIST', 'blacklisted'],
	['BATTLEBAN', 'battlebanned'],
	['MUTE', 'muted'],
]);

// punishments.tsv is in the format:
// punishType, userid, ips/usernames, expiration time
// room-punishments.tsv is in the format:
// punishType, roomid:userid, ips/usernames, expiration time


Punishments.loadPunishments = async function () {
	const data = await FS(PUNISHMENT_FILE).readIfExists();
	if (!data) return;
	for (const row of data.split("\n")) {
		if (!row || row === '\r') continue;
		const [punishType, id, altKeys, expireTimeStr, ...rest] = row.trim().split("\t");
		const expireTime = Number(expireTimeStr);
		if (punishType === "Punishment") continue;
		const keys = altKeys.split(',').concat(id);

		const punishment = [punishType, id, expireTime].concat(rest);
		if (Date.now() >= expireTime) {
			continue;
		}
		for (const key of keys) {
			if (!USERID_REGEX.test(key)) {
				Punishments.ips.set(key, punishment);
			} else {
				Punishments.userids.set(key, punishment);
			}
		}
	}
};

Punishments.loadRoomPunishments = async function () {
	const data = await FS(ROOM_PUNISHMENT_FILE).readIfExists();
	if (!data) return;
	for (const row of data.split("\n")) {
		if (!row || row === '\r') continue;
		const [punishType, id, altKeys, expireTimeStr, ...rest] = row.trim().split("\t");
		const expireTime = Number(expireTimeStr);
		if (punishType === "Punishment") continue;
		const [roomid, userid] = id.split(':');
		if (!userid) continue; // invalid format
		const keys = altKeys.split(',').concat(userid);

		const punishment = [punishType, userid, expireTime].concat(rest);
		if (Date.now() >= expireTime) {
			continue;
		}
		for (const key of keys) {
			if (!USERID_REGEX.test(key)) {
				Punishments.roomIps.nestedSet(roomid, key, punishment);
			} else {
				Punishments.roomUserids.nestedSet(roomid, key, punishment);
			}
		}
	}
};

Punishments.savePunishments = function () {
	FS(PUNISHMENT_FILE).writeUpdate(() => {
		const saveTable = new Map();
		Punishments.ips.forEach((/** @type {Punishment} */ punishment, /** @type {string} */ ip) => {
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
		Punishments.userids.forEach((/** @type {Punishment} */ punishment, /** @type {string} */ userid) => {
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
		return buf;
	});
};

Punishments.saveRoomPunishments = function () {
	FS(ROOM_PUNISHMENT_FILE).writeUpdate(() => {
		const saveTable = new Map();
		Punishments.roomIps.nestedForEach((/** @type {Punishment} */ punishment, /** @type {string} */ roomid, /** @type {string} */ ip) => {
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
		Punishments.roomUserids.nestedForEach((/** @type {Punishment} */ punishment, /** @type {string} */ roomid, /** @type {string} */ userid) => {
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
		return buf;
	});
};

/**
 * @param {Object} entry
 * @param {string} id
 * @param {string} filename
 */
Punishments.appendPunishment = function (entry, id, filename) {
	if (id.charAt(0) === '#') return;
	let buf = Punishments.renderEntry(entry, id);
	FS(filename).append(buf);
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

Punishments.loadBanlist = async function () {
	const data = await FS('config/ipbans.txt').readIfExists();
	if (!data) return;
	let rangebans = [];
	for (const row of data.split("\n")) {
		const ip = row.split('#')[0].trim();
		if (!ip) continue;
		if (ip.includes('/')) {
			rangebans.push(ip);
		} else if (!Punishments.ips.has(ip)) {
			Punishments.ips.set(ip, ['BAN', '#ipban', Infinity]);
		}
	}
	Punishments.checkRangeBanned = Dnsbl.checker(rangebans);
};

// sharedips.tsv is in the format:
// IP, type (in this case always SHARED), note

Punishments.loadSharedIps = async function () {
	const data = await FS(SHAREDIPS_FILE).readIfExists();
	if (!data) return;
	for (const row of data.split("\n")) {
		if (!row || row === '\r') continue;
		const [ip, type, note] = row.trim().split("\t");
		if (!ip.includes('.')) continue;
		if (type !== 'SHARED') continue;

		Punishments.sharedIps.set(ip, note);
	}
};

/**
 * @param {string} ip
 * @param {string} note
 */
Punishments.appendSharedIp = function (ip, note) {
	let buf = `${ip}\tSHARED\t${note}\r\n`;
	FS(SHAREDIPS_FILE).append(buf);
};

Punishments.saveSharedIps = function () {
	let buf = 'IP\tType\tNote\r\n';
	Punishments.sharedIps.forEach((/** @type {string} */ note, /** @type {string} */ ip) => {
		buf += `${ip}\tSHARED\t${note}\r\n`;
	});

	FS(SHAREDIPS_FILE).write(buf);
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
 * @param {Set<string>?} recursionKeys
 * @return {PunishmentRow | undefined}
 */
Punishments.punish = function (user, punishment, recursionKeys) {
	let existingPunishment = Punishments.userids.get(toId(user.name));
	if (existingPunishment) {
		// don't reduce the duration of an existing punishment
		if (existingPunishment[2] > punishment[2]) {
			punishment[2] = existingPunishment[2];
		}

		// don't override stronger punishment types
		const types = ['LOCK', 'NAMELOCK', 'BAN'];
		if (types.indexOf(existingPunishment[0]) > types.indexOf(punishment[0])) {
			punishment[0] = existingPunishment[0];
		}
	}

	let keys = recursionKeys || new Set();
	let affected;

	if (!recursionKeys) {
		affected = user.getAltUsers(PUNISH_TRUSTED, true);
		for (let curUser of affected) {
			this.punish(curUser, punishment, keys);
		}
	}

	for (let ip in user.ips) {
		Punishments.ips.set(ip, punishment);
		keys.add(ip);
	}
	let lastUserId = user.getLastId();
	if (!lastUserId.startsWith('guest')) {
		Punishments.userids.set(lastUserId, punishment);
	}
	if (user.autoconfirmed) {
		Punishments.userids.set(user.autoconfirmed, punishment);
		keys.add(user.autoconfirmed);
	}
	if (user.trusted) {
		Punishments.userids.set(user.trusted, punishment);
		keys.add(user.trusted);
		// @ts-ignore TODO: investigate if this is a bug
		if (!PUNISH_TRUSTED && affected) affected.unshift(user);
	}
	if (!recursionKeys) {
		const [punishType, id, ...rest] = punishment;
		keys.delete(id);
		Punishments.appendPunishment({
			keys: Array.from(keys),
			punishType: punishType,
			rest: rest,
		}, id, PUNISHMENT_FILE);
		return affected;
	}
};

/**
 * @param {string} userid
 * @param {Punishment} punishment
 */
Punishments.punishName = function (userid, punishment) {
	let foundKeys = Punishments.search(userid)[0].map((/** @type {string} */ key) => key.split(':')[0]);
	let userids = new Set([userid]);
	let ips = new Set();
	for (let key of foundKeys) {
		if (key.includes('.')) {
			ips.add(key);
		} else {
			userids.add(key);
		}
	}
	userids.forEach(id => {
		Punishments.userids.set(id, punishment);
	});
	ips.forEach(ip => {
		Punishments.ips.set(ip, punishment);
	});
	const [punishType, id, ...rest] = punishment;
	let affected = Users.findUsers(Array.from(userids), Array.from(ips), {includeTrusted: PUNISH_TRUSTED, forPunishment: true});
	userids.delete(id);
	Punishments.appendPunishment({
		keys: Array.from(userids).concat(Array.from(ips)),
		punishType: punishType,
		rest: rest,
	}, id, PUNISHMENT_FILE);

	return affected;
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

	/** @type {false | string} */
	let success = false;
	Punishments.ips.forEach((/** @type {Punishment} */punishment, /** @type {string} */key) => {
		if (punishment[1] === id && punishment[0] === punishType) {
			Punishments.ips.delete(key);
			success = id;
		}
	});
	Punishments.userids.forEach((/** @type {Punishment} */punishment, /** @type {string} */key) => {
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
 * @param {Room} room
 * @param {User} user
 * @param {Punishment} punishment
 * @param {Set<string>?} recursionKeys
 * @return {PunishmentRow | undefined}
 */
Punishments.roomPunish = function (room, user, punishment, recursionKeys) {
	let roomid = typeof room === 'string' ? room : room.id;
	let keys = recursionKeys || new Set();
	/** @type {User[] | undefined} */
	let affected;

	if (!recursionKeys) {
		affected = user.getAltUsers(PUNISH_TRUSTED, true);
		for (let curUser of affected) {
			this.roomPunish(room, curUser, punishment, keys);
		}
	}

	for (let ip in user.ips) {
		Punishments.roomIps.nestedSet(roomid, ip, punishment);
		keys.add(ip);
	}
	if (!user.userid.startsWith('guest')) {
		Punishments.roomUserids.nestedSet(roomid, user.userid, punishment);
	}
	if (user.autoconfirmed) {
		Punishments.roomUserids.nestedSet(roomid, user.autoconfirmed, punishment);
		keys.add(user.autoconfirmed);
	}
	if (user.trusted) {
		Punishments.roomUserids.nestedSet(roomid, user.trusted, punishment);
		keys.add(user.trusted);
		if (!PUNISH_TRUSTED) {
			if (!affected) affected = [];
			affected.unshift(user);
		}
	}
	if (!recursionKeys) {
		const [punishType, id, ...rest] = punishment;
		keys.delete(id);
		Punishments.appendPunishment({
			keys: Array.from(keys),
			punishType: punishType,
			rest: rest,
		}, roomid + ':' + id, ROOM_PUNISHMENT_FILE);

		if (typeof roomid === 'string' || !(room.isPrivate === true || room.isPersonal || room.battle)) Punishments.monitorRoomPunishments(user);

		// @ts-ignore
		return affected;
	}
};

/**
 * @param {Room} room
 * @param {string} userid
 * @param {Punishment} punishment
 */
Punishments.roomPunishName = function (room, userid, punishment) {
	let foundKeys = Punishments.search(userid)[0].map((/** @type {string} */ key) => key.split(':')[0]);
	let userids = new Set([userid]);
	let ips = new Set();
	for (let key of foundKeys) {
		if (key.includes('.')) {
			ips.add(key);
		} else {
			userids.add(key);
		}
	}
	userids.forEach(id => {
		Punishments.roomUserids.nestedSet(room.id, id, punishment);
	});
	ips.forEach(ip => {
		Punishments.roomIps.nestedSet(room.id, ip, punishment);
	});
	const [punishType, id, ...rest] = punishment;
	let affected = Users.findUsers(Array.from(userids), Array.from(ips), {includeTrusted: PUNISH_TRUSTED, forPunishment: true});
	userids.delete(id);
	Punishments.appendPunishment({
		keys: Array.from(userids).concat(Array.from(ips)),
		punishType: punishType,
		rest: rest,
	}, room.id + ':' + id, ROOM_PUNISHMENT_FILE);

	if (!(room.isPrivate === true || room.isPersonal || room.battle)) Punishments.monitorRoomPunishments(userid);
	return affected;
};

/**
 * @param {Room} room
 * @param {string} id
 * @param {string} punishType
 * @param {boolean} ignoreWrite Flag to skip persistent storage.
 */
Punishments.roomUnpunish = function (room, id, punishType, ignoreWrite) {
	let roomid = typeof room === 'string' ? toId(room) : room.id;
	id = toId(id);
	let punishment = Punishments.roomUserids.nestedGet(roomid, id);
	if (punishment) {
		id = punishment[1];
	}
	// in theory we can stop here if punishment doesn't exist, but
	// in case of inconsistent state, we'll try anyway

	let success;
	const ipSubMap = Punishments.roomIps.get(roomid);
	if (ipSubMap) {
		ipSubMap.forEach((/** @type {Punishment} */punishment, /** @type {string} */key) => {
			if (punishment[1] === id && punishment[0] === punishType) {
				ipSubMap.delete(key);
				success = id;
			}
		});
	}
	const useridSubMap = Punishments.roomUserids.get(roomid);
	if (useridSubMap) {
		useridSubMap.forEach((/** @type {Punishment} */punishment, /** @type {string} */key) => {
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
 * @param {...string} reason
 * @return {PunishmentRow}
 */
Punishments.ban = function (user, expireTime, id, ...reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + GLOBALBAN_DURATION;
	let punishment = ['BAN', id, expireTime, ...reason];

	let affected = Punishments.punish(user, punishment);
	for (let curUser of affected) {
		curUser.locked = id;
		curUser.disconnectAll();
	}

	return affected;
};
/**
 * @param {string} name
 */
Punishments.unban = function (name) {
	return Punishments.unpunish(name, 'BAN');
};
/**
 * @param {User? | string} user
 * @param {number} expireTime
 * @param {string} id
 * @param {...string} reason
 * @return {PunishmentRow}
 */
Punishments.lock = function (user, expireTime, id, ...reason) {
	// @ts-ignore
	if (!id && user) id = user.getLastId();
	if (!user || typeof user === 'string') user = Users(id);

	if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
	let punishment = ['LOCK', id, expireTime, ...reason];

	let affected = [];

	if (user) {
		affected = Punishments.punish(user, punishment);
	} else {
		affected = Punishments.punishName(id, punishment);
	}

	for (let curUser of affected) {
		curUser.locked = id;
		curUser.updateIdentity();
	}

	return affected;
};
/**
 * @param {User} user
 * @param {Room} room
 * @param {string} source
 * @param {string} reason
 * @param {string?} message
 * @param {boolean?} week
 */
Punishments.autolock = function (user, room, source, reason, message, week) {
	if (!message) message = reason;

	let punishment = `LOCKED`;
	let expires = null;
	if (week) {
		expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
		punishment = `WEEKLOCKED`;
	}
	Punishments.lock(user, expires, toId(user), `Autolock: ${user.name || toId(user)}: ${reason}`);
	Monitor.log(`[${source}] ${punishment}: ${message}`);
	Rooms.global.modlog(`(${toId(room)}) AUTOLOCK: [${toId(user)}]: ${reason}`);
};
/**
 * @param {string} name
 */
Punishments.unlock = function (name) {
	let user = Users(name);
	let id = toId(name);
	/** @type {string[]} */
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
 * @param {...string} reason
 * @return {PunishmentRow}
 */
Punishments.namelock = function (user, expireTime, id, ...reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
	let punishment = ['NAMELOCK', id, expireTime, ...reason];

	let affected = Punishments.punish(user, punishment);
	for (let curUser of affected) {
		curUser.locked = id;
		curUser.namelocked = id;
		curUser.resetName();
		curUser.updateIdentity();
	}

	return affected;
};
/**
 * @param {string} name
 */
Punishments.unnamelock = function (name) {
	let user = Users(name);
	let id = toId(name);
	/** @type {string[]} */
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
 * @param {User} user
 * @param {number} expireTime
 * @param {string} id
 * @param {...string} reason
 * @return {PunishmentRow}
 */
Punishments.battleban = function (user, expireTime, id, ...reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + BATTLEBAN_DURATION;
	let punishment = ['BATTLEBAN', id, expireTime, ...reason];

	// Handle tournaments the user was in before being battle banned
	for (let games of user.games.keys()) {
		const gameRoom = Rooms(games).game;
		if (!gameRoom) continue; // this should never happen
		// @ts-ignore
		if (gameRoom.isTournament) {
			// @ts-ignore
			if (gameRoom.isTournamentStarted) {
				// @ts-ignore
				gameRoom.disqualifyUser(id, null, null);
				// @ts-ignore
			} else if (!gameRoom.isTournamentStarted) {
				// @ts-ignore
				gameRoom.removeUser(user);
			}
		}
	}

	return Punishments.roomPunish("battle", user, punishment);
};
/**
 * @param {string} userid
 */
Punishments.unbattleban = function (userid) {
	const user = Users(userid);
	if (user) {
		let punishment = Punishments.isBattleBanned(user);
		if (punishment) userid = punishment[1];
	}
	return Punishments.roomUnpunish("battle", userid, 'BATTLEBAN');
};
/**
 * @param {User} user
 * @return {Punishment | undefined}
 */
Punishments.isBattleBanned = function (user) {
	if (!user) throw new Error(`Trying to check if a non-existent user is battlebanned.`);

	let punishment = Punishments.roomUserids.nestedGet("battle", user.userid);
	if (punishment && punishment[0] === 'BATTLEBAN') return punishment;

	if (user.autoconfirmed) {
		punishment = Punishments.roomUserids.nestedGet("battle", user.autoconfirmed);
		if (punishment && punishment[0] === 'BATTLEBAN') return punishment;
	}

	for (let ip in user.ips) {
		punishment = Punishments.roomIps.nestedGet("battle", ip);
		if (punishment && punishment[0] === 'BATTLEBAN') {
			if (Punishments.sharedIps.has(ip) && user.autoconfirmed) return;
			return punishment;
		}
	}
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
 * @param {...string} reason
 * @return {PunishmentRow}
 */
Punishments.roomBan = function (room, user, expireTime, userId, ...reason) {
	if (!userId) userId = user.getLastId();

	if (!expireTime) expireTime = Date.now() + ROOMBAN_DURATION;
	let punishment = ['ROOMBAN', userId, expireTime].concat(reason);

	let affected = Punishments.roomPunish(room, user, punishment);
	for (let curUser of affected) {
		if (room.game && room.game.removeBannedUser) {
			room.game.removeBannedUser(curUser);
		}
		curUser.leaveRoom(room.id);
	}

	if (room.subRooms) {
		for (const subRoom of room.subRooms.values()) {
			for (const curUser of affected) {
				if (subRoom.game && subRoom.game.removeBannedUser) {
					subRoom.game.removeBannedUser(curUser);
				}
				curUser.leaveRoom(subRoom.id);
			}
		}
	}

	return affected;
};

/**
 * @param {Room} room
 * @param {User?} user
 * @param {number} expireTime
 * @param {string} userId
 * @param {...string} reason
 * @return {PunishmentRow}
 */
Punishments.roomBlacklist = function (room, user, expireTime, userId, ...reason) {
	if (!userId && user) userId = user.getLastId();
	if (!user) user = Users(userId);

	if (!expireTime) expireTime = Date.now() + BLACKLIST_DURATION;
	let punishment = ['BLACKLIST', userId, expireTime].concat(reason);

	let affected = [];

	if (!user || userId && userId !== user.userid) {
		affected = Punishments.roomPunishName(room, userId, punishment);
	}

	if (user) {
		affected = affected.concat(Punishments.roomPunish(room, user, punishment));
	}

	for (let curUser of affected) {
		if (room.game && room.game.removeBannedUser) {
			room.game.removeBannedUser(curUser);
		}
		curUser.leaveRoom(room.id);
	}

	if (room.subRooms) {
		for (const subRoom of room.subRooms.values()) {
			for (const curUser of affected) {
				if (subRoom.game && subRoom.game.removeBannedUser) {
					subRoom.game.removeBannedUser(curUser);
				}
				curUser.leaveRoom(subRoom.id);
			}
		}
	}

	return affected;
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

	/** @type {string[]} */
	let unblacklisted = [];

	roombans.forEach((/** @type {Punishment} */punishment, /** @type {string} */userid) => {
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
 * @param {string} searchId
 * @return {[string[], (string | number)[]?]}
 */
Punishments.search = function (searchId) {
	/** @type {string[]} */
	let foundKeys = [];
	let foundRest = null;
	Punishments.ips.forEach((/** @type {Punishment} */ punishment, /** @type {string} */ ip) => {
		const [, id, ...rest] = punishment;

		if (searchId === id || searchId === ip) {
			foundKeys.push(ip);
			foundRest = rest;
		}
	});
	Punishments.userids.forEach((/** @type {Punishment} */punishment, /** @type {string} */userid) => {
		const [, id, ...rest] = punishment;

		if (searchId === id || searchId === userid) {
			foundKeys.push(userid);
			foundRest = rest;
		}
	});
	Punishments.roomIps.nestedForEach((/** @type {Punishment} */punishment, /** @type {string} */roomid, /** @type {string} */ip) => {
		const [, punishUserid, ...rest] = punishment;

		if (searchId === punishUserid || searchId === ip) {
			foundKeys.push(ip + ':' + roomid);
			foundRest = rest;
		}
	});
	Punishments.roomUserids.nestedForEach((/** @type {Punishment} */punishment, /** @type {string} */roomid, /** @type {string} */userid) => {
		const [, punishUserid, ...rest] = punishment;

		if (searchId === punishUserid || searchId === userid) {
			foundKeys.push(userid + ':' + roomid);
			foundRest = rest;
		}
	});

	return [foundKeys, foundRest];
};

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
 * @return {PunishmentRow | undefined}
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
 * @param {string} host
 * @return {string}
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
 * @param {string} userid
 * @param {boolean} registered
 */
Punishments.checkName = function (user, userid, registered) {
	if (userid.startsWith('guest')) return;
	for (const roomid of user.inRooms) {
		Punishments.checkNewNameInRoom(user, userid, roomid);
	}
	let punishment = Punishments.userids.get(userid);
	let battleban = Punishments.isBattleBanned(user);
	if (!punishment && user.namelocked) {
		punishment = Punishments.userids.get(user.namelocked);
		if (!punishment) punishment = ['NAMELOCK', user.namelocked, 0];
	}
	if (!punishment && user.locked) {
		punishment = Punishments.userids.get(user.locked);
		if (!punishment) punishment = ['LOCK', user.locked, 0];
	}
	if (!battleban && Punishments.isBattleBanned(user)) {
		battleban = Punishments.roomUserids.get(Punishments.isBattleBanned(user));
		if (!battleban) battleban = ['BATTLEBAN', Punishments.isBattleBanned(user), 0];
	}
	if (battleban) {
		if (battleban[1] !== user.userid && Punishments.sharedIps.has(user.latestIp) && user.autoconfirmed) {
			Punishments.roomUnpunish("battle", userid, 'BATTLEBAN');
		} else {
			Punishments.roomPunish("battle", user, battleban);
			user.cancelReady();
			if (!punishment) {
				// Prioritize popups for other global punishments
				user.send(`|popup|You are banned from battling${battleban[1] !== userid ? ` because you have the same IP as banned user: ${battleban[1]}` : ''}. Your battle ban will expire in a few days.${battleban[3] ? `||||Reason: ${battleban[3]}` : ``}${Config.appealurl ? `||||Or you can appeal at: ${Config.appealurl}` : ``}`);
				user.punishmentNotified = true;
				return;
			}
		}
	}
	if (!punishment) return;

	let id = punishment[0];
	let punishUserid = punishment[1];
	let reason = ``;
	if (punishment[3]) reason = `\n\nReason: ${punishment[3]}`;
	let appeal = ``;
	if (Config.appealurl) appeal = `\n\nOr you can appeal at: ${Config.appealurl}`;
	let bannedUnder = ``;
	if (punishUserid !== userid) bannedUnder = ` because you have the same IP as banned user: ${punishUserid}`;

	if ((id === 'LOCK' || id === 'NAMELOCK') && punishUserid !== user.userid && Punishments.sharedIps.has(user.latestIp)) {
		if (!user.autoconfirmed) {
			user.semilocked = `#sharedip ${user.locked}`;
		}
		user.locked = false;

		user.updateIdentity();
		return;
	}
	if (registered && id === 'BAN') {
		user.popup(`Your username (${user.name}) is banned${bannedUnder}. Your ban will expire in a few days.${reason}${appeal}`);
		user.punishmentNotified = true;
		Punishments.punish(user, punishment);
		user.disconnectAll();
		return;
	}
	if (id === 'NAMELOCK' || user.namelocked) {
		user.popup(`You are namelocked and can't have a username${bannedUnder}. Your namelock will expire in a few days.${reason}${appeal}`);
		if (punishment[2]) Punishments.punish(user, punishment);
		user.locked = punishUserid;
		user.namelocked = punishUserid;
		user.resetName();
		user.updateIdentity();
	} else {
		if (punishUserid === '#hostfilter') {
			user.popup(`Due to spam, you can't chat using a proxy. (Your IP ${user.latestIp} appears to be a proxy.)`);
		} else if (!user.lockNotified) {
			user.popup(`You are locked${bannedUnder}. Your lock will expire in a few days.${reason}${appeal}`);
		}
		user.lockNotified = true;
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
			if (!user.locked && !user.autoconfirmed) {
				user.semilocked = `#sharedip ${punishment[1]}`;
			}
		} else {
			user.locked = punishment[1];
			if (punishment[0] === 'NAMELOCK') {
				user.namelocked = punishment[1];
			}
		}
	}

	Dnsbl.reverse(ip).catch((/** @type {Error} */ e) => {
		// If connection.user is reassigned before async tasks can run, user
		// may no longer be equal to it.
		user = connection.user || user;
		// @ts-ignore
		if (e.code === 'EINVAL') {
			if (!user.locked && !user.autoconfirmed) {
				user.semilocked = '#dnsbl';
			}
			return null;
		}
		throw e;
	}).then((/** @type {string} */ host) => {
		user = connection.user || user;
		if (host) user.latestHost = host;
		Chat.hostfilter(host, user, connection);
	});

	if (Config.dnsbl) {
		Dnsbl.query(connection.ip).then((/** @type {boolean} */ isBlocked) => {
			user = connection.user || user;
			if (isBlocked) {
				if (!user.locked && !user.autoconfirmed) {
					user.semilocked = '#dnsbl';
				}
			}
		});
	}
};

/**
 * Connection flood table. Separate table from IP bans.
 * @type {Set<string>}
 */
let cfloods = Punishments.cfloods = new Set();

/**
 * IP bans need to be checked separately since we don't even want to
 * make a User object if an IP is banned.
 *
 * @param {Connection} connection
 * @return {string? | false}
 */
Punishments.checkIpBanned = function (connection) {
	let ip = connection.ip;
	if (cfloods.has(ip) || (Monitor.countConnection(ip) && cfloods.add(ip))) {
		connection.send(`|popup||modal|PS is under heavy load and cannot accommodate your connection right now.`);
		return '#cflood';
	}

	if (Punishments.sharedIps.has(ip)) return false;

	/** @type {false | string} */
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
	Monitor.notice(`CONNECT BLOCKED - IP BANNED: ${ip} (${banned})`);

	return banned;
};

/**
 * @param {User} user
 * @param {string} roomid
 * @return {boolean | undefined}
 */
Punishments.checkNameInRoom = function (user, roomid) {
	let punishment = Punishments.roomUserids.nestedGet(roomid, user.userid);
	if (!punishment && user.autoconfirmed) {
		punishment = Punishments.roomUserids.nestedGet(roomid, user.autoconfirmed);
	}
	if (!punishment && Rooms(roomid).parent) punishment = Punishments.checkNameInRoom(user, Rooms(roomid).parent);
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
	let punishment = Punishments.roomUserids.nestedGet(roomid, userid);
	if (!punishment && Rooms(roomid).parent) punishment = Punishments.checkNewNameInRoom(user, userid, Rooms(roomid).parent);
	if (punishment) {
		if (punishment[0] !== 'ROOMBAN' && punishment[0] !== 'BLACKLIST') return;
		const room = Rooms(roomid);
		if (room.game && room.game.removeBannedUser) {
			room.game.removeBannedUser(user);
		}
		user.leaveRoom(room.id);
		return punishment;
	}
};

/**
 * @param {string? | boolean} userid
 * @return {string} Descriptive text for the remaining time until the punishment expires, if any.
 */
Punishments.checkLockExpiration = function (userid) {
	if (typeof userid === "boolean") return ``;
	const punishment = Punishments.userids.get(userid);

	if (punishment) {
		let user = Users(userid);
		if (user && user.permalocked) return ` (never expires; you are permalocked)`;
		let expiresIn = new Date(punishment[2]).getTime() - Date.now();
		let expiresDays = Math.round(expiresIn / 1000 / 60 / 60 / 24);
		let expiresText = '';
		if (expiresDays >= 1) {
			expiresText = `in around ${Chat.count(expiresDays, "days")}`;
		} else {
			expiresText = `soon`;
		}
		if (expiresIn > 1) return ` (expires ${expiresText})`;
	}

	return ``;
};

/**
 * @param {User} user
 * @param {string} roomid
 * @return {Punishment | undefined}
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

	const room = Rooms(roomid);
	if (!room) throw new Error(`Trying to ban a user from a nonexistent room: ${roomid}`);

	if (room.parent) return Punishments.isRoomBanned(user, room.parent.id);
};

/**
 * Returns an array of all room punishments associated with a user.
 *
 * options.publicOnly will make this only return public room punishments.
 * options.checkIps will also check the IP of the user for IP-based punishments.
 *
 * @param {User | string} user
 * @param {Object?} options
 * @return {Array}
 */
Punishments.getRoomPunishments = function (user, options) {
	if (!user) return [];
	let userid = toId(user);
	let checkMutes = typeof user !== 'string';

	let punishments = [];

	for (const curRoom of Rooms.global.chatRooms) {
		if (!curRoom || curRoom.isPrivate === true || ((options && options.publicOnly) && (curRoom.isPersonal || curRoom.battle))) continue;
		let punishment = Punishments.roomUserids.nestedGet(curRoom.id, userid);
		if (punishment) {
			punishments.push([curRoom, punishment]);
			continue;
		} else if (options && options.checkIps) {
			// @ts-ignore
			for (let ip in user.ips) {
				punishment = Punishments.roomIps.nestedGet(curRoom.id, ip);
				if (punishment) {
					punishments.push([curRoom, punishment]);
					continue;
				}
			}
		}
		if (checkMutes && curRoom.muteQueue) {
			for (const entry of curRoom.muteQueue) {
				if (userid === entry.userid ||
					// @ts-ignore
					user.guestNum === entry.guestNum ||
					// @ts-ignore
					(user.autoconfirmed && user.autoconfirmed === entry.autoconfirmed)) {
					punishments.push([curRoom, ['MUTE', entry.userid, entry.time]]);
				}
			}
		}
	}

	return punishments;
};

/**
 * Notifies staff if a user has three or more room punishments.
 *
 * @param {User | string} user
 */
Punishments.monitorRoomPunishments = function (user) {
	// @ts-ignore
	if (user.locked) return;
	const userid = toId(user);

	const minPunishments = (typeof Config.monitorminpunishments === 'number' ? Config.monitorminpunishments : 3); // Default to 3 if the Config option is not defined or valid
	if (!minPunishments) return;

	let punishments = Punishments.getRoomPunishments(user, {publicOnly: true});

	if (punishments.length >= minPunishments) {
		let points = 0;

		let punishmentText = punishments.map((/** @type {[string, Punishment]} */ [room, punishment]) => {
			const [punishType, punishUserid, , reason] = punishment;
			if (punishType in PUNISHMENT_POINT_VALUES) points += PUNISHMENT_POINT_VALUES[punishType];
			let punishDesc = Punishments.roomPunishmentTypes.get(punishType);
			if (!punishDesc) punishDesc = `punished`;
			if (punishUserid !== userid) punishDesc += ` as ${punishUserid}`;

			if (reason) punishDesc += `: ${reason}`;
			return `<<${room}>> (${punishDesc})`;
		}).join(', ');

		if (Config.punishmentautolock && points >= AUTOLOCK_POINT_THRESHOLD) {
			let rooms = punishments.map((/** @type {[string]} */ [room]) => room).join(', ');
			let reason = `Autolocked for having punishments in ${punishments.length} rooms: ${rooms}`;
			// @ts-ignore
			let message = `${user.name || userid} was locked for having punishments in ${punishments.length} rooms: ${punishmentText}`;

			Punishments.autolock(user, 'staff', 'PunishmentMonitor', reason, message);
			if (typeof user !== 'string') user.popup("|modal|You've been locked for breaking the rules in multiple chatrooms.\n\nIf you feel that your lock was unjustified, you can still PM staff members (%, @, &, and ~) to discuss it" + (Config.appealurl ? " or you can appeal:\n" + Config.appealurl : ".") + "\n\nYour lock will expire in a few days.");
		} else {
			// @ts-ignore
			Monitor.log(`[PunishmentMonitor] ${user.name || userid} currently has punishments in ${punishments.length} rooms: ${punishmentText}`);
		}
	}
};
