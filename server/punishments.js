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

/** @type {typeof import('../lib/fs').FS} */
const FS = require(/** @type {any} */('../.lib-dist/fs')).FS;

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

/**@type {{[k: string]: number}} */
const PUNISHMENT_POINT_VALUES = {MUTE: 2, BLACKLIST: 3, BATTLEBAN: 4, ROOMBAN: 4};
const AUTOLOCK_POINT_THRESHOLD = 8;

/**
 * A punishment is an array: [punishType, userid, expireTime, reason]
 * @typedef {[string, string, number, string]} Punishment
 */

/**
 * @typedef {object} PunishmentEntry
 * @property {string[]} keys
 * @property {string} punishType
 * @property {[number, string]} rest
 */

/**
 * @augments {Map<string, Punishment>}
 */
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
		for (const [k, punishment] of super.entries()) {
			if (Date.now() < punishment[2]) {
				// eslint-disable-next-line callback-return
				callback(punishment, k, this);
				continue;
			}
			this.delete(k);
		}
	}
}

/**
 * @augments {Map<string, Map<string, Punishment>>}
 */
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
		for (const [k1, subMap] of this.entries()) {
			for (const [k2, punishment] of subMap.entries()) {
				if (Date.now() < punishment[2]) {
					// eslint-disable-next-line callback-return
					callback(punishment, k1, k2);
					continue;
				}
				this.nestedDelete(k1, k2);
			}
		}
	}
}


/*********************************************************
 * Persistence
 *********************************************************/

const Punishments = new (class {
	constructor() {
		/**
		 * ips is an ip:punishment Map
		 */
		this.ips = new PunishmentMap();

		/**
		 * userids is a userid:punishment Map
		 */
		this.userids = new PunishmentMap();

		/**
		 * roomUserids is a roomid:userid:punishment nested Map
		 */
		this.roomUserids = new NestedPunishmentMap();

		/**
		 * roomIps is a roomid:ip:punishment Map
		 */
		this.roomIps = new NestedPunishmentMap();

		/**
		 * sharedIps is an ip:note Map
		 */
		this.sharedIps = new Map();

		/**
		 * Connection flood table. Separate table from IP bans.
		 * @type {Set<string>}
		 */
		this.cfloods = new Set();

		/**
		 * punishType is an allcaps string, for global punishments they can be
		 * anything in the punishmentTypes map.
		 *
		 * This map can be extended with custom punishments by chat plugins.
		 *
		 * Keys in the map correspond to punishTypes, values signify the way
		 * they should be displayed in /alt
		 *
		 * @type {Map<string, string>}
		 */
		this.punishmentTypes = new Map([
			['LOCK', 'locked'],
			['BAN', 'globally banned'],
			['NAMELOCK', 'namelocked'],
		]);

		/**
		 * For room punishments, they can be anything in the roomPunishmentTypes map.
		 *
		 * This map can be extended with custom punishments by chat plugins.
		 *
		 * Keys in the map correspond to punishTypes, values signify the way they
		 * should be displayed in /alt.
		 * By default, this includes:
		 * - 'ROOMBAN'
		 * - 'BLACKLIST'
		 * - 'BATTLEBAN'
		 * - 'MUTE' (used by getRoomPunishments)
		 *
		 * @type {Map<string, string>}
		 */
		this.roomPunishmentTypes = new Map([
			['ROOMBAN', 'banned'],
			['BLACKLIST', 'blacklisted'],
			['BATTLEBAN', 'battlebanned'],
			['MUTE', 'muted'],
		]);

		setImmediate(() => {
			Punishments.loadPunishments();
			Punishments.loadRoomPunishments();
			Punishments.loadBanlist();
			Punishments.loadSharedIps();
		});
	}

	// punishments.tsv is in the format:
	// punishType, userid, ips/usernames, expiration time
	// room-punishments.tsv is in the format:
	// punishType, roomid:userid, ips/usernames, expiration time
	async loadPunishments() {
		const data = await FS(PUNISHMENT_FILE).readIfExists();
		if (!data) return;
		for (const row of data.split("\n")) {
			if (!row || row === '\r') continue;
			const [punishType, id, altKeys, expireTimeStr, ...rest] = row.trim().split("\t");
			const expireTime = Number(expireTimeStr);
			if (punishType === "Punishment") continue;
			const keys = altKeys.split(',').concat(id);

			const punishment = /** @type {Punishment} */ ([punishType, id, expireTime, ...rest]);
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
	}

	async loadRoomPunishments() {
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

			const punishment = /** @type {Punishment} */ ([punishType, userid, expireTime, ...rest]);
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
	}

	savePunishments() {
		FS(PUNISHMENT_FILE).writeUpdate(() => {
			/** @type {Map<string, PunishmentEntry>} */
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
			for (const [id, entry] of saveTable) {
				buf += Punishments.renderEntry(entry, id);
			}
			return buf;
		});
	}

	saveRoomPunishments() {
		FS(ROOM_PUNISHMENT_FILE).writeUpdate(() => {
			/** @type {Map<string, PunishmentEntry>} */
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
			for (const [id, entry] of saveTable) {
				buf += Punishments.renderEntry(entry, id);
			}
			return buf;
		});
	}

	/**
	 * @param {PunishmentEntry} entry
	 * @param {string} id
	 * @param {string} filename
	 */
	appendPunishment(entry, id, filename) {
		if (id.charAt(0) === '#') return;
		let buf = Punishments.renderEntry(entry, id);
		FS(filename).append(buf);
	}

	/**
	 * @param {PunishmentEntry} entry
	 * @param {string} id
	 * @return {string}
	 */
	renderEntry(entry, id) {
		let row = [entry.punishType, id, entry.keys.join(','), ...entry.rest];
		return row.join('\t') + '\r\n';
	}

	async loadBanlist() {
		const data = await FS('config/ipbans.txt').readIfExists();
		if (!data) return;
		let rangebans = [];
		for (const row of data.split("\n")) {
			const ip = row.split('#')[0].trim();
			if (!ip) continue;
			if (ip.includes('/')) {
				rangebans.push(ip);
			} else if (!Punishments.ips.has(ip)) {
				Punishments.ips.set(ip, ['BAN', '#ipban', Infinity, '']);
			}
		}
		Punishments.checkRangeBanned = Dnsbl.checker(rangebans);
	}

	// sharedips.tsv is in the format:
	// IP, type (in this case always SHARED), note

	async loadSharedIps() {
		const data = await FS(SHAREDIPS_FILE).readIfExists();
		if (!data) return;
		for (const row of data.split("\n")) {
			if (!row || row === '\r') continue;
			const [ip, type, note] = row.trim().split("\t");
			if (!ip.includes('.')) continue;
			if (type !== 'SHARED') continue;

			Punishments.sharedIps.set(ip, note);
		}
	}

	/**
	 * @param {string} ip
	 * @param {string} note
	 */
	appendSharedIp(ip, note) {
		let buf = `${ip}\tSHARED\t${note}\r\n`;
		FS(SHAREDIPS_FILE).append(buf);
	}

	saveSharedIps() {
		let buf = 'IP\tType\tNote\r\n';
		Punishments.sharedIps.forEach((note, ip) => {
			buf += `${ip}\tSHARED\t${note}\r\n`;
		});

		FS(SHAREDIPS_FILE).write(buf);
	}


	/*********************************************************
	 * Adding and removing
	 *********************************************************/

	/**
	 * @param {User | string} user
	 * @param {Punishment} punishment
	 * @return {User[]}
	 */
	punish(user, punishment) {
		if (typeof user === 'string') return Punishments.punishName(user, punishment);

		/** @type {Set<string>} */
		const keys = new Set();
		const affected = user.getAltUsers(PUNISH_TRUSTED, true);
		for (const alt of affected) {
			this.punishInner(alt, punishment, keys);
		}

		const [punishType, id, ...rest] = punishment;
		keys.delete(id);
		Punishments.appendPunishment({
			keys: [...keys],
			punishType: punishType,
			rest: rest,
		}, id, PUNISHMENT_FILE);
		return affected;
	}

	/**
	 * @param {User} user
	 * @param {Punishment} punishment
	 * @param {Set<string>} keys
	 */
	punishInner(user, punishment, keys) {
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
		}
	}

	/**
	 * @param {string} userid
	 * @param {Punishment} punishment
	 */
	punishName(userid, punishment) {
		let foundKeys = Punishments.search(userid).map(([key]) => key);
		let userids = new Set([userid]);
		/** @type {Set<string>} */
		let ips = new Set();
		for (let key of foundKeys) {
			if (key.includes('.')) {
				ips.add(key);
			} else {
				userids.add(key);
			}
		}
		for (const id of userids) {
			Punishments.userids.set(id, punishment);
		}
		for (const ip of ips) {
			Punishments.ips.set(ip, punishment);
		}
		const [punishType, id, ...rest] = punishment;
		let affected = Users.findUsers([...userids], [...ips], {includeTrusted: PUNISH_TRUSTED, forPunishment: true});
		userids.delete(id);
		Punishments.appendPunishment({
			keys: [...userids, ...ips],
			punishType: punishType,
			rest: rest,
		}, id, PUNISHMENT_FILE);

		return affected;
	}

	/**
	 * @param {string} id
	 * @param {string} punishType
	 */
	unpunish(id, punishType) {
		id = toId(id);
		let punishment = Punishments.userids.get(id);
		if (punishment) {
			id = punishment[1];
		}
		// in theory we can stop here if punishment doesn't exist, but
		// in case of inconsistent state, we'll try anyway

		/** @type {false | string} */
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
	}

	/**
	 * @param {Room | string} room
	 * @param {User} user
	 * @param {Punishment} punishment
	 * @return {User[]}
	 */
	roomPunish(room, user, punishment) {
		let roomid = typeof room === 'string' ? room : room.id;
		/** @type {Set<string>} */
		let keys = new Set();
		/** @type {User[]} */
		let affected = user.getAltUsers(PUNISH_TRUSTED, true);
		for (let curUser of affected) {
			this.roomPunishInner(roomid, curUser, punishment, keys);
		}

		const [punishType, id, ...rest] = punishment;
		keys.delete(id);
		Punishments.appendPunishment({
			keys: [...keys],
			punishType: punishType,
			rest: rest,
		}, roomid + ':' + id, ROOM_PUNISHMENT_FILE);

		if (typeof room === 'string' || !(room.isPrivate === true || room.isPersonal || room.battle)) {
			Punishments.monitorRoomPunishments(user);
		}

		return affected;
	}

	/**
	 * @param {string} roomid
	 * @param {User} user
	 * @param {Punishment} punishment
	 * @param {Set<string>} keys
	 */
	roomPunishInner(roomid, user, punishment, keys) {
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
		}
	}

	/**
	 * @param {Room} room
	 * @param {string} userid
	 * @param {Punishment} punishment
	 */
	roomPunishName(room, userid, punishment) {
		let foundKeys = Punishments.search(userid).map(([key]) => key);
		let userids = new Set([userid]);
		/** @type {Set<string>} */
		let ips = new Set();
		for (let key of foundKeys) {
			if (key.includes('.')) {
				ips.add(key);
			} else {
				userids.add(key);
			}
		}
		for (const id of userids) {
			Punishments.roomUserids.nestedSet(room.id, id, punishment);
		}
		for (const ip of ips) {
			Punishments.roomIps.nestedSet(room.id, ip, punishment);
		}
		const [punishType, id, ...rest] = punishment;
		let affected = Users.findUsers([...userids], [...ips], {includeTrusted: PUNISH_TRUSTED, forPunishment: true});
		userids.delete(id);
		Punishments.appendPunishment({
			keys: [...userids, ...ips],
			punishType: punishType,
			rest: rest,
		}, room.id + ':' + id, ROOM_PUNISHMENT_FILE);

		if (!(room.isPrivate === true || room.isPersonal || room.battle)) Punishments.monitorRoomPunishments(userid);
		return affected;
	}

	/**
	 * @param {Room | string} room
	 * @param {string} id
	 * @param {string} punishType
	 * @param {boolean} [ignoreWrite] skip persistent storage
	 */
	roomUnpunish(room, id, punishType, ignoreWrite) {
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
			for (const [/** @type {string} */key, /** @type {Punishment} */punishment] of ipSubMap) {
				if (punishment[1] === id && punishment[0] === punishType) {
					ipSubMap.delete(key);
					success = id;
				}
			}
		}
		const useridSubMap = Punishments.roomUserids.get(roomid);
		if (useridSubMap) {
			for (const [/** @type {string} */key, /** @type {Punishment} */punishment] of useridSubMap) {
				if (punishment[1] === id && punishment[0] === punishType) {
					useridSubMap.delete(key);
					success = id;
				}
			}
		}
		if (success && !ignoreWrite) {
			Punishments.saveRoomPunishments();
		}
		return success;
	}

	/*********************************************************
	 * Specific punishments
	 *********************************************************/

	/**
	 * @param {User} user
	 * @param {number} expireTime
	 * @param {string} id
	 * @param {...string} reason
	 * @return {User[]?}
	 */
	ban(user, expireTime, id, ...reason) {
		if (!id) id = user.getLastId();

		if (!expireTime) expireTime = Date.now() + GLOBALBAN_DURATION;
		let punishment = /** @type {Punishment} */ (['BAN', id, expireTime, ...reason]);

		let affected = Punishments.punish(user, punishment);
		for (let curUser of affected) {
			curUser.locked = id;
			curUser.disconnectAll();
		}

		return affected;
	}
	/**
	 * @param {string} name
	 */
	unban(name) {
		return Punishments.unpunish(name, 'BAN');
	}
	/**
	 * @param {User | string} userOrUsername
	 * @param {number | null} expireTime
	 * @param {string} id
	 * @param {...string} reason
	 * @return {User[]}
	 */
	lock(userOrUsername, expireTime, id, ...reason) {
		let user = (typeof userOrUsername === 'string' ? Users(userOrUsername) : userOrUsername);
		if (!id) id = user ? user.getLastId() : toId(userOrUsername);

		if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
		let punishment = /** @type {Punishment} */ (['LOCK', id, expireTime, ...reason]);

		let affected;

		if (user) {
			affected = Punishments.punish(user, punishment);
		} else {
			affected = Punishments.punish(id, punishment);
		}

		for (let curUser of affected) {
			curUser.locked = id;
			curUser.updateIdentity();
		}

		return affected;
	}
	/**
	 * @param {User | string} user
	 * @param {Room | string} room
	 * @param {string} source
	 * @param {string} reason
	 * @param {string?} message
	 * @param {boolean} week
	 * @param {string?} [namelock]
	 */
	autolock(user, room, source, reason, message, week = false, namelock) {
		if (!message) message = reason;

		let punishment = `LOCKED`;
		let expires = null;
		if (week) {
			expires = Date.now() + 7 * 24 * 60 * 60 * 1000;
			punishment = `WEEKLOCKED`;
		}

		const userid = toId(user);
		const name = typeof user === 'string' ? user : user.name;
		if (namelock) {
			punishment = `NAMELOCKED`;
			Punishments.namelock(user, expires, toId(namelock), `Autonamelock: ${name}: ${reason}`);
		} else {
			Punishments.lock(user, expires, toId(user), `Autolock: ${name}: ${reason}`);
		}
		Monitor.log(`[${source}] ${punishment}: ${message}`);
		const ipStr = typeof user !== 'string' ? ` [${user.latestIp}]` : '';
		Rooms.global.modlog(`(${toId(room)}) AUTO${namelock ? `NAME` : ''}LOCK: [${userid}]${ipStr}: ${reason}`);
	}
	/**
	 * @param {string} name
	 */
	unlock(name) {
		let user = Users(name);
		let id = toId(name);
		/** @type {string[]} */
		let success = [];
		if (user && user.locked && !user.namelocked) {
			id = user.locked;
			user.locked = null;
			user.namelocked = null;
			user.updateIdentity();
			success.push(user.getLastName());
		}
		if (id.charAt(0) !== '#') {
			for (const curUser of Users.users.values()) {
				if (curUser.locked === id) {
					curUser.locked = null;
					curUser.namelocked = null;
					curUser.updateIdentity();
					success.push(curUser.getLastName());
				}
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
	}
	/**
	 * @param {User | string} user
	 * @param {number | null} expireTime
	 * @param {string} id
	 * @param {...string} reason
	 * @return {User[]}
	 */
	namelock(user, expireTime, id, ...reason) {
		if (!id) id = typeof user === 'string' ? toId(user) : user.getLastId();

		if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
		let punishment = /** @type {Punishment} */ (['NAMELOCK', id, expireTime, ...reason]);

		let affected = Punishments.punish(user, punishment);
		for (let curUser of affected) {
			curUser.locked = id;
			curUser.namelocked = id;
			curUser.resetName();
			curUser.updateIdentity();
		}

		return affected;
	}
	/**
	 * @param {string} name
	 */
	unnamelock(name) {
		let user = Users(name);
		let id = toId(name);
		/** @type {string[]} */
		let success = [];
		// @ts-ignore
		if (user && user.namelocked) name = user.namelocked;

		let unpunished = Punishments.unpunish(name, 'NAMELOCK');
		if (user && user.locked) {
			id = user.locked;
			user.locked = null;
			user.namelocked = null;
			user.resetName();
			success.push(user.getLastName());
		}
		if (id.charAt(0) !== '#') {
			for (const curUser of Users.users.values()) {
				if (curUser.locked === id) {
					curUser.locked = null;
					curUser.namelocked = null;
					curUser.resetName();
					success.push(curUser.getLastName());
				}
			}
		}
		if (unpunished && !success.length) success.push(name);
		if (!success.length) return false;
		if (!success.some(v => toId(v) === id)) {
			success.push(id);
		}
		return success;
	}
	/**
	 * @param {User} user
	 * @param {number} expireTime
	 * @param {string} id
	 * @param {...string} reason
	 * @return {User[]}
	 */
	battleban(user, expireTime, id, ...reason) {
		if (!id) id = user.getLastId();

		if (!expireTime) expireTime = Date.now() + BATTLEBAN_DURATION;
		let punishment = /** @type {Punishment} */ (['BATTLEBAN', id, expireTime, ...reason]);

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
	}
	/**
	 * @param {string} userid
	 */
	unbattleban(userid) {
		const user = Users(userid);
		if (user) {
			let punishment = Punishments.isBattleBanned(user);
			if (punishment) userid = punishment[1];
		}
		return Punishments.roomUnpunish("battle", userid, 'BATTLEBAN');
	}
	/**
	 * @param {User} user
	 * @return {Punishment | undefined}
	 */
	isBattleBanned(user) {
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
	}

	/**
	 * @param {string} range
	 * @param {string} reason
	 */
	lockRange(range, reason) {
		let punishment = /** @type {Punishment} */ (['LOCK', '#rangelock', Date.now() + RANGELOCK_DURATION, reason]);
		Punishments.ips.set(range, punishment);
	}
	/**
	 * @param {string} range
	 * @param {string} reason
	 */
	banRange(range, reason) {
		let punishment = /** @type {Punishment} */ (['BAN', '#rangelock', Date.now() + RANGELOCK_DURATION, reason]);
		Punishments.ips.set(range, punishment);
	}

	/**
	 * @param {Room} room
	 * @param {User} user
	 * @param {number} expireTime
	 * @param {string} userId
	 * @param {...string} reason
	 * @return {User[]}
	 */
	roomBan(room, user, expireTime, userId, ...reason) {
		if (!userId) userId = user.getLastId();

		if (!expireTime) expireTime = Date.now() + ROOMBAN_DURATION;
		let punishment = /** @type {Punishment} */ (['ROOMBAN', userId, expireTime, ...reason]);

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
	}

	/**
	 * @param {Room} room
	 * @param {User?} user
	 * @param {number} expireTime
	 * @param {string} userId
	 * @param {...string} reason
	 * @return {User[]}
	 */
	roomBlacklist(room, user, expireTime, userId, ...reason) {
		if (!userId && user) userId = user.getLastId();
		if (!user) user = Users(userId);

		if (!expireTime) expireTime = Date.now() + BLACKLIST_DURATION;
		let punishment = /** @type {Punishment} */ (['BLACKLIST', userId, expireTime, ...reason]);

		/** @type {User[]} */
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
	}

	/**
	 * @param {Room} room
	 * @param {string} userid
	 */
	roomUnban(room, userid) {
		const user = Users(userid);
		if (user) {
			let punishment = Punishments.isRoomBanned(user, room.id);
			if (punishment) userid = punishment[1];
		}
		return Punishments.roomUnpunish(room, userid, 'ROOMBAN');
	}

	/**
	 * @param {Room} room
	 * @param {string} userid
	 * @param {boolean} ignoreWrite Flag to skip persistent storage.
	 */
	roomUnblacklist(room, userid, ignoreWrite) {
		const user = Users(userid);
		if (user) {
			let punishment = Punishments.isRoomBanned(user, room.id);
			if (punishment) userid = punishment[1];
		}
		return Punishments.roomUnpunish(room, userid, 'BLACKLIST', ignoreWrite);
	}

	/**
	 * @param {Room} room
	 */
	roomUnblacklistAll(room) {
		const roombans = Punishments.roomUserids.get(room.id);
		if (!roombans) return false;

		/** @type {string[]} */
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
	}

	/**
	 * @param {string} ip
	 * @param {string} note
	 */
	addSharedIp(ip, note) {
		Punishments.sharedIps.set(ip, note);
		Punishments.appendSharedIp(ip, note);

		for (const user of Users.users.values()) {
			if (user.locked && user.locked !== user.userid && ip in user.ips) {
				if (!user.autoconfirmed) {
					user.semilocked = `#sharedip ${user.locked}`;
				}
				user.locked = null;
				user.namelocked = null;

				user.updateIdentity();
			}
		}
	}

	/**
	 * @param {string} ip
	 */
	removeSharedIp(ip) {
		Punishments.sharedIps.delete(ip);
		Punishments.saveSharedIps();
	}

	/*********************************************************
	 * Checking
	 *********************************************************/

	/**
	 * Returns an array of [key, roomid, punishment] pairs.
	 *
	 * @param {string} searchId userid or IP
	 * @return {[string, string, Punishment][]}
	 */
	search(searchId) {
		/** @type {[string, string, Punishment][]} */
		let results = [];
		Punishments.ips.forEach((punishment, ip) => {
			const [, id] = punishment;

			if (searchId === id || searchId === ip) {
				results.push([ip, '', punishment]);
			}
		});
		Punishments.userids.forEach((punishment, userid) => {
			const [, id] = punishment;

			if (searchId === id || searchId === userid) {
				results.push([userid, '', punishment]);
			}
		});
		Punishments.roomIps.nestedForEach((punishment, roomid, ip) => {
			const [, punishUserid] = punishment;

			if (searchId === punishUserid || searchId === ip) {
				results.push([ip, roomid, punishment]);
			}
		});
		Punishments.roomUserids.nestedForEach((punishment, roomid, userid) => {
			const [, punishUserid] = punishment;

			if (searchId === punishUserid || searchId === userid) {
				results.push([userid, roomid, punishment]);
			}
		});

		return results;
	}

	/**
	 * @param {string} name
	 */
	getPunishType(name) {
		let punishment = Punishments.userids.get(toId(name));
		if (punishment) return punishment[0];
		let user = Users.get(name);
		if (!user) return;
		punishment = Punishments.ipSearch(user.latestIp);
		if (punishment) return punishment[0];
		return '';
	}

	/**
	 * @param {Room} room
	 * @param {string} name
	 */
	getRoomPunishType(room, name) {
		let punishment = Punishments.roomUserids.nestedGet(room.id, toId(name));
		if (punishment) return punishment[0];
		let user = Users.get(name);
		if (!user) return;
		punishment = Punishments.roomIps.nestedGet(room.id, user.latestIp);
		if (punishment) return punishment[0];
		return '';
	}

	/**
	 * Searches for IP in Punishments.ips
	 *
	 * For instance, if IP is '1.2.3.4', will return the value corresponding
	 * to any of the keys in table match '1.2.3.4', '1.2.3.*', '1.2.*', or '1.*'
	 *
	 * @param {string} ip
	 * @return {Punishment | undefined}
	 */
	ipSearch(ip) {
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
	}

	/**
	 * @param {string} host
	 * @return {string}
	 */
	shortenHost(host) {
		if (host.slice(-7) === '-nohost') return host;
		let dotLoc = host.lastIndexOf('.');
		let tld = host.substr(dotLoc);
		if (tld === '.uk' || tld === '.au' || tld === '.br') dotLoc = host.lastIndexOf('.', dotLoc - 1);
		dotLoc = host.lastIndexOf('.', dotLoc - 1);
		return host.substr(dotLoc + 1);
	}

	/** Defined in Punishments.loadBanlist */
	checkRangeBanned(/** @type {string} */ ip) {
		return false;
	}

	/**
	 * @param {User} user
	 * @param {string} userid
	 * @param {boolean} registered
	 */
	checkName(user, userid, registered) {
		if (userid.startsWith('guest')) return;
		for (const roomid of user.inRooms) {
			Punishments.checkNewNameInRoom(user, userid, roomid);
		}
		let punishment = Punishments.userids.get(userid);
		let battleban = Punishments.isBattleBanned(user);
		if (!punishment && user.namelocked) {
			punishment = Punishments.userids.get(user.namelocked);
			if (!punishment) punishment = ['NAMELOCK', user.namelocked, 0, ''];
		}
		if (!punishment && user.locked) {
			punishment = Punishments.userids.get(user.locked);
			if (!punishment) punishment = ['LOCK', user.locked, 0, ''];
		}

		const ticket = Chat.pages.help ? `<a href="view-help-request--appeal"><button class="button"><strong>Appeal your punishment</strong></button></a>` : '';

		if (battleban) {
			if (battleban[1] !== user.userid && Punishments.sharedIps.has(user.latestIp) && user.autoconfirmed) {
				Punishments.roomUnpunish("battle", userid, 'BATTLEBAN');
			} else {
				Punishments.roomPunish("battle", user, battleban);
				user.cancelReady();
				if (!punishment) {
					let appealLink = ticket || (Config.appealurl ? `appeal at: ${Config.appealurl}` : ``);
					// Prioritize popups for other global punishments
					user.send(`|popup||html|You are banned from battling${battleban[1] !== userid ? ` because you have the same IP as banned user: ${battleban[1]}` : ''}. Your battle ban will expire in a few days.${battleban[3] ? Chat.html `\n\nReason: ${battleban[3]}` : ``}${appealLink ? `\n\nOr you can ${appealLink}.` : ``}`);
					user.punishmentNotified = true;
					return;
				}
			}
		}
		if (!punishment) return;

		let id = punishment[0];
		let punishUserid = punishment[1];
		let reason = ``;
		if (punishment[3]) reason = `\n\nReason: ${Chat.escapeHTML(punishment[3])}`;
		let appeal = ``;
		if (user.permalocked && Config.appealurl) {
			appeal += `\n\nPermanent punishments can be appealed: <a href="${Config.appealurl}">${Config.appealurl}</a>`;
		} else if (ticket) {
			appeal += `\n\nIf you feel you were unfairly punished or wish to otherwise appeal, you can ${ticket}.`;
		} else if (Config.appealurl) {
			appeal += `\n\nIf you wish to appeal your punishment, please use: <a href="${Config.appealurl}">${Config.appealurl}</a>`;
		}
		let bannedUnder = ``;
		if (punishUserid !== userid) bannedUnder = ` because you have the same IP as banned user: ${punishUserid}`;

		if ((id === 'LOCK' || id === 'NAMELOCK') && punishUserid !== userid && Punishments.sharedIps.has(user.latestIp)) {
			if (!user.autoconfirmed) {
				user.semilocked = `#sharedip ${user.locked}`;
			}
			user.locked = null;
			user.namelocked = null;

			user.updateIdentity();
			return;
		}
		if (registered && id === 'BAN') {
			user.popup(`Your username (${user.name}) is banned${bannedUnder}. Your ban will expire in a few days.${reason}${Config.appealurl ? `||||Or you can appeal at: ${Config.appealurl}` : ``}`);
			user.punishmentNotified = true;
			Punishments.punish(user, punishment);
			user.disconnectAll();
			return;
		}
		if (id === 'NAMELOCK' || user.namelocked) {
			user.send(`|popup||html|You are namelocked and can't have a username${bannedUnder}. Your namelock will expire in a few days.${reason}${appeal}`);
			user.locked = punishUserid;
			user.namelocked = punishUserid;
			user.resetName();
			user.updateIdentity();
		} else {
			if (punishUserid === '#hostfilter') {
				user.popup(`Due to spam, you can't chat using a proxy. (Your IP ${user.latestIp} appears to be a proxy.)`);
			} else if (!user.lockNotified) {
				user.send(`|popup||html|You are locked${bannedUnder}. ${user.permalocked ? `This lock is permanent.` : `Your lock will expire in a few days.`}${reason}${appeal}`);
			}
			user.lockNotified = true;
			user.locked = punishUserid;
			user.updateIdentity();
		}
	}

	/**
	 * @param {User} user
	 * @param {Connection} connection
	 */
	checkIp(user, connection) {
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
		}).then((/** @type {string | null} */ host) => {
			user = connection.user || user;
			if (host) user.latestHost = host;
			Chat.hostfilter(host || '', user, connection);
		});

		if (Config.dnsbl) {
			Dnsbl.query(connection.ip).then((/** @type {string | null} */ isBlocked) => {
				user = connection.user || user;
				if (isBlocked) {
					if (!user.locked && !user.autoconfirmed) {
						user.semilocked = '#dnsbl';
					}
				}
			});
		}
	}

	/**
	 * IP bans need to be checked separately since we don't even want to
	 * make a User object if an IP is banned.
	 *
	 * @param {Connection} connection
	 * @return {string? | false}
	 */
	checkIpBanned(connection) {
		let ip = connection.ip;
		if (Punishments.cfloods.has(ip) || (Monitor.countConnection(ip) && Punishments.cfloods.add(ip))) {
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
	}

	/**
	 * @param {User} user
	 * @param {string} roomid
	 * @return {boolean}
	 */
	checkNameInRoom(user, roomid) {
		let punishment = Punishments.roomUserids.nestedGet(roomid, user.userid);
		if (!punishment && user.autoconfirmed) {
			punishment = Punishments.roomUserids.nestedGet(roomid, user.autoconfirmed);
		}
		if (punishment && (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST')) {
			return true;
		}
		if (Rooms(roomid).parent) {
			return Punishments.checkNameInRoom(user, Rooms(roomid).parent);
		}
		return false;
	}

	/**
	 * @param {User} user
	 * @param {string} userid The name into which the user is renamed.
	 * @param {string} roomid
	 * @return {Punishment?}
	 */
	checkNewNameInRoom(user, userid, roomid) {
		/** @type {Punishment?} */
		let punishment = Punishments.roomUserids.nestedGet(roomid, userid) || null;
		if (!punishment && Rooms(roomid).parent) {
			punishment = Punishments.checkNewNameInRoom(user, userid, Rooms(roomid).parent);
		}
		if (punishment) {
			if (punishment[0] !== 'ROOMBAN' && punishment[0] !== 'BLACKLIST') return null;
			const room = Rooms(roomid);
			if (room.game && room.game.removeBannedUser) {
				room.game.removeBannedUser(user);
			}
			user.leaveRoom(room.id);
			return punishment;
		}
		return null;
	}

	/**
	 * @param {string?} userid
	 * @return {string} Descriptive text for the remaining time until the punishment expires, if any.
	 */
	checkLockExpiration(userid) {
		if (!userid) return ``;
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
	}

	/**
	 * @param {User} user
	 * @param {string} roomid
	 * @return {Punishment | undefined}
	 */
	isRoomBanned(user, roomid) {
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
	}

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
	getRoomPunishments(user, options) {
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
	}

	/** @param {Room} room */
	getPunishmentsOfRoom(room) {
		let output = [];
		/** @type {Map<Punishment, [Set<string>, Set<string>]>} */
		const store = new Map();

		let map = Punishments.roomUserids.get(room.id);
		if (map) {
			for (let [key, value] of map) {
				if (!store.has(value)) store.set(value, [new Set([]), new Set()]);
				// @ts-ignore
				store.get(value)[0].add(key);
			}
		}

		map = Punishments.roomIps.get(room.id);
		if (map) {
			for (let [key, value] of map) {
				if (!store.has(value)) store.set(value, [new Set([]), new Set()]);
				// @ts-ignore
				store.get(value)[1].add(key);
			}
		}

		for (const [punishment, data] of store) {
			let [punishType, id, expireTime, reason] = punishment;
			let expiresIn = new Date(expireTime).getTime() - Date.now();
			if (expiresIn < 1000) continue;
			let alts = [...data[0]].filter(user => user !== id);
			let ips = [...data[1]];
			output.push({"punishType": punishType, "id": id, "expiresIn": expiresIn, "reason": reason, "alts": alts, "ips": ips});
		}

		if (room.muteQueue) {
			for (const entry of room.muteQueue) {
				let expiresIn = new Date(entry.time).getTime() - Date.now();
				if (expiresIn < 1000) continue;
				output.push({"punishType": 'MUTE', "id": entry.userid, "expiresIn": expiresIn, "reason": '', "alts": [], "ips": []});
			}
		}
		return output;
	}
	/**
	 * Notifies staff if a user has three or more room punishments.
	 *
	 * @param {User | string} user
	 */
	monitorRoomPunishments(user) {
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
	}
})();

module.exports = Punishments;
