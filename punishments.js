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

let Punishments = module.exports = {
	// ips is an ip:punishment Map
	ips: new PunishmentMap(),

	// userids is a userid:punishment Map
	userids: new PunishmentMap(),

	// roomUserids is a roomid:userid:punishment nested Map
	roomUserids: new NestedPunishmentMap(),

	// roomIps is a roomid:ip:punishment Map
	roomIps: new NestedPunishmentMap(),

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

	roomPunishmentTypes: new Map([
		['ROOMBAN', 'banned'],
		['BLACKLIST', 'blacklisted'],
	]),

	// punishments.tsv is in the format:
	// punishType, userid, ips/usernames, expiration time
	// room-punishments.tsv is in the format:
	// punishType, roomid:userid, ips/usernames, expiration time

	loadPunishments: function () {
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
						this.ips.set(key, punishment);
					} else {
						this.userids.set(key, punishment);
					}
				}
			}
		});
	},

	loadRoomPunishments: function () {
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
						this.roomIps.nestedSet(roomid, key, punishment);
					} else {
						this.roomUserids.nestedSet(roomid, key, punishment);
					}
				}
			}
		});
	},

	savePunishments: function () {
		const saveTable = new Map();
		this.ips.forEach((punishment, ip) => {
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
		this.userids.forEach((punishment, userid) => {
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
			buf += this.renderEntry(entry, id);
		});

		fs.writeFile(PUNISHMENT_FILE, buf, () => {});
	},

	saveRoomPunishments: function () {
		const saveTable = new Map();
		this.roomIps.nestedForEach((punishment, roomid, ip) => {
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
		this.roomUserids.nestedForEach((punishment, roomid, userid) => {
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
			buf += this.renderEntry(entry, id);
		});

		fs.writeFile(ROOM_PUNISHMENT_FILE, buf, () => {});
	},

	/**
	 * @param {Object} entry
	 * @param {string} id
	 */
	appendPunishment: function (entry, id, filename) {
		if (id.charAt(0) === '#') return;
		let buf = this.renderEntry(entry, id);
		fs.appendFile(filename, buf, () => {});
	},

	/**
	 * @param {Object} entry
	 * @param {string} id
	 * @return {string}
	 */
	renderEntry: function (entry, id) {
		let row = [entry.punishType, id, entry.keys.join(',')].concat(entry.rest);
		return row.join('\t') + '\r\n';
	},

	/**
	 * @return {Promise}
	 */
	loadBanlist: function () {
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
					} else if (!this.ips.has(data[i])) {
						this.ips.set(data[i], ['BAN', '#ipban', Infinity]);
					}
				}
				this.checkRangeBanned = Dnsbl.checker(rangebans);
				resolve();
			});
		});
	},

	/*********************************************************
	 * Adding and removing
	 *********************************************************/

	/**
	 * @param {User} user
	 * @param {Punishment} punishment
	 * @param {?Set<string>} noRecurse
	 */
	punish: function (user, punishment, noRecurse) {
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
			this.ips.set(ip, punishment);
			keys.add(ip);
		}
		if (!user.userid.startsWith('guest')) {
			this.userids.set(user.userid, punishment);
		}
		if (user.autoconfirmed) {
			this.userids.set(user.autoconfirmed, punishment);
			keys.add(user.autoconfirmed);
		}
		if (user.trusted) {
			this.userids.set(user.trusted, punishment);
			keys.add(user.trusted);
		}
		if (!noRecurse) {
			const [punishType, id, ...rest] = punishment;
			keys.delete(id);
			this.appendPunishment({
				keys: Array.from(keys),
				punishType: punishType,
				rest: rest,
			}, id, PUNISHMENT_FILE);
		}
	},

	/**
	 * @param {string} id
	 * @param {string} punishType
	 */
	unpunish: function (id, punishType) {
		id = toId(id);
		let punishment = this.userids.get(id);
		if (punishment) {
			id = punishment[1];
		}
		// in theory we can stop here if punishment doesn't exist, but
		// in case of inconsistent state, we'll try anyway

		let success = false;
		this.ips.forEach((punishment, key) => {
			if (punishment[1] === id && punishment[0] === punishType) {
				this.ips.delete(key);
				success = id;
			}
		});
		this.userids.forEach((punishment, key) => {
			if (punishment[1] === id && punishment[0] === punishType) {
				this.userids.delete(key);
				success = id;
			}
		});
		if (success) {
			this.savePunishments();
		}
		return success;
	},

	/**
	 * @param {User} user
	 * @param {Punishment} punishment
	 * @param {?Set<string>} noRecurse
	 */
	roomPunish: function (room, user, punishment, noRecurse) {
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
			this.roomIps.nestedSet(room.id, ip, punishment);
			keys.add(ip);
		}
		if (!user.userid.startsWith('guest')) {
			this.roomUserids.nestedSet(room.id, user.userid, punishment);
		}
		if (user.autoconfirmed) {
			this.roomUserids.nestedSet(room.id, user.autoconfirmed, punishment);
			keys.add(user.autoconfirmed);
		}
		if (user.trusted) {
			this.roomUserids.nestedSet(room.id, user.confirmed, punishment);
			keys.add(user.trusted);
		}
		if (!noRecurse) {
			const [punishType, id, ...rest] = punishment;
			keys.delete(id);
			this.appendPunishment({
				keys: Array.from(keys),
				punishType: punishType,
				rest: rest,
			}, room.id + ':' + id, ROOM_PUNISHMENT_FILE);
		}
	},

	roomPunishName: function (room, userid, punishment) {
		this.roomUserids.nestedSet(room.id, userid, punishment);
		const [punishType, id, ...rest] = punishment;
		this.appendPunishment({
			keys: [userid],
			punishType: punishType,
			rest: rest,
		}, room.id + ':' + id, ROOM_PUNISHMENT_FILE);
	},

	/**
	 * @param {string} id
	 * @param {string} punishType
	 */
	roomUnpunish: function (room, id, punishType) {
		id = toId(id);
		let punishment = this.roomUserids.nestedGet(room, id);
		if (punishment) {
			id = punishment[1];
		}
		// in theory we can stop here if punishment doesn't exist, but
		// in case of inconsistent state, we'll try anyway

		let success;
		const ipSubMap = this.roomIps.get(room.id);
		if (ipSubMap) {
			ipSubMap.forEach((punishment, key) => {
				if (punishment[1] === id && punishment[0] === punishType) {
					ipSubMap.delete(key);
					success = id;
				}
			});
		}
		const useridSubMap = this.roomUserids.get(room.id);
		if (useridSubMap) {
			useridSubMap.forEach((punishment, key) => {
				if (punishment[1] === id && punishment[0] === punishType) {
					useridSubMap.delete(key);
					success = id;
				}
			});
		}
		if (success) {
			this.saveRoomPunishments();
		}
		return success;
	},

	/*********************************************************
	 * Specific punishments
	 *********************************************************/

	/**
	 * @param {User} user
	 * @param {number} expireTime
	 * @param {string} id
	 * @param {?string} reason
	 */
	ban: function (user, expireTime, id, reason) {
		if (!id) id = user.getLastId();

		if (!expireTime) expireTime = Date.now() + BAN_DURATION;
		let punishment = ['BAN', id, expireTime].concat(Array.prototype.slice.call(arguments, 3));
		this.punish(user, punishment);

		let affected = user.getAltUsers(false, true);
		for (let curUser of affected) {
			curUser.locked = id;
			curUser.disconnectAll();
		}
	},

	/**
	 * @param {string} name
	 */
	unban: function (name) {
		return this.unpunish(name, 'BAN');
	},

	/**
	 * @param {User} user
	 * @param {number} expireTime
	 * @param {string} id
	 * @param {?string} reason
	 */
	lock: function (user, expireTime, id, reason) {
		if (!id) id = user.getLastId();

		if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
		let punishment = ['LOCK', id, expireTime].concat(Array.prototype.slice.call(arguments, 3));
		this.punish(user, punishment);

		let affected = user.getAltUsers(false, true);
		for (let curUser of affected) {
			curUser.locked = id;
			curUser.updateIdentity();
		}
	},

	/**
	 * @param {string} name
	 */
	unlock: function (name) {
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
		if (this.unpunish(name, 'LOCK')) {
			if (!success.length) success.push(name);
		}
		if (!success.length) return undefined;
		if (!success.some(v => toId(v) === id)) {
			success.push(id);
		}
		return success;
	},

	/**
	 * @param {User} user
	 * @param {number} expireTime
	 * @param {string} id
	 * @param {?string} reason
	 */
	namelock: function (user, expireTime, id, reason) {
		if (!id) id = user.getLastId();

		if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
		let punishment = ['NAMELOCK', id, expireTime].concat(Array.prototype.slice.call(arguments, 3));
		this.punish(user, punishment);

		let affected = user.getAltUsers(false, true);
		for (let curUser of affected) {
			curUser.locked = id;
			curUser.namelocked = id;
			curUser.resetName();
			curUser.updateIdentity();
		}
	},

	/**
	 * @param {string} name
	 */
	unnamelock: function (name) {
		let user = Users(name);
		let id = toId(name);
		let success = [];
		let unpunished = this.unpunish(name, 'NAMELOCK');
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
	},

	/**
	 * @param {string} range
	 * @param {string} reason
	 */
	lockRange: function (range, reason) {
		let punishment = ['LOCK', '#rangelock', Date.now() + RANGELOCK_DURATION, reason];
		this.ips.set(range, punishment);
	},

	/**
	 * @param {string} range
	 * @param {string} reason
	 */

	banRange: function (range, reason) {
		let punishment = ['BAN', '#rangelock', Date.now() + RANGELOCK_DURATION, reason];
		this.ips.set(range, punishment);
	},

	/**
	 * @param {Room} room
	 * @param {User} user
	 * @param {boolean} noRecurse
	 * @param {string} userid
	 */
	roomBan: function (room, user, expireTime, id, ...rest) {
		if (!id) id = user.getLastId();

		if (!expireTime) expireTime = Date.now() + ROOMBAN_DURATION;
		let punishment = ['ROOMBAN', id, expireTime].concat(rest);
		this.roomPunish(room, user, punishment);

		let affected = user.getAltUsers(false, true);
		for (let curUser of affected) {
			if (room.game && room.game.removeBannedUser) {
				room.game.removeBannedUser(curUser);
			}
			curUser.leaveRoom(room.id);
		}
	},

	roomBlacklist: function (room, user, expireTime, id, ...rest) {
		if (!id && user) id = user.getLastId();
		if (!user) user = Users(id);

		if (!expireTime) expireTime = Date.now() + BLACKLIST_DURATION;
		let punishment = ['BLACKLIST', id, expireTime].concat(rest);
		if (user) {
			this.roomPunish(room, user, punishment);

			let affected = user.getAltUsers(false, true);
			for (let curUser of affected) {
				if (room.game && room.game.removeBannedUser) {
					room.game.removeBannedUser(curUser);
				}
				curUser.leaveRoom(room.id);
			}
		} else {
			this.roomPunishName(room, id, punishment);
		}
	},

	/**
	 * @param {Room} room
	 * @param {string} userid
	 * @param {boolean} noRecurse
	 */
	roomUnban: function (room, userid) {
		const user = Users(userid);
		if (user) {
			let punishment = this.isRoomBanned(user, room.id);
			if (punishment) userid = punishment[1];
		}
		return this.roomUnpunish(room, userid, 'ROOMBAN');
	},

	roomUnblacklist: function (room, userid) {
		const user = Users(userid);
		if (user) {
			let punishment = this.isRoomBanned(user, room.id);
			if (punishment) userid = punishment[1];
		}
		return this.roomUnpunish(room, userid, 'BLACKLIST');
	},

	roomUnblacklistAll: function (room) {
		const roombans = this.roomUserids.get(room.id);
		if (!roombans) return false;

		let unblacklisted = [];

		roombans.forEach((punishment, userid) => {
			if (punishment[0] === 'BLACKLIST') {
				this.roomUnblacklist(room, userid);
				unblacklisted.push(userid);
			}
		});
		if (unblacklisted.length === 0) return false;
		this.savePunishments();
		return unblacklisted;
	},

	/*********************************************************
	 * Checking
	 *********************************************************/

	/**
	 * @param {string} name
	 */
	getPunishType: function (name) {
		let punishment = this.userids.get(toId(name));
		if (punishment) return punishment[0];
		let user = Users.get(name);
		if (!user) return;
		punishment = this.ipSearch(user.latestIp);
		if (punishment) return punishment[0];
		return '';
	},

	getRoomPunishType: function (room, name) {
		let punishment = this.roomUserids.nestedGet(room.id, toId(name));
		if (punishment) return punishment[0];
		let user = Users.get(name);
		if (!user) return;
		punishment = this.roomIps.nestedGet(room.id, user.latestIp);
		if (punishment) return punishment[0];
		return '';
	},

	/**
	 * Searches for IP in Punishments.ips
	 *
	 * For instance, if IP is '1.2.3.4', will return the value corresponding
	 * to any of the keys in table match '1.2.3.4', '1.2.3.*', '1.2.*', or '1.*'
	 *
	 * @param {string} ip
	 * @return {?Array}
	 */
	ipSearch: function (ip) {
		let punishment = this.ips.get(ip);
		if (punishment) return punishment;
		let dotIndex = ip.lastIndexOf('.');
		for (let i = 0; i < 4 && dotIndex > 0; i++) {
			ip = ip.substr(0, dotIndex);
			punishment = this.ips.get(ip + '.*');
			if (punishment) return punishment;
			dotIndex = ip.lastIndexOf('.');
		}
		return undefined;
	},

	/**
	 * @param {string} userid
	 * @return {?Array}
	 */
	shortenHost: function (host) {
		if (host.slice(-7) === '-nohost') return host;
		let dotLoc = host.lastIndexOf('.');
		let tld = host.substr(dotLoc);
		if (tld === '.uk' || tld === '.au' || tld === '.br') dotLoc = host.lastIndexOf('.', dotLoc - 1);
		dotLoc = host.lastIndexOf('.', dotLoc - 1);
		return host.substr(dotLoc + 1);
	},

	// Defined in Punishments.loadBanlist
	checkRangeBanned: function () {},

	/**
	 * @param {User} user
	 * @param {boolean} registered
	 */
	checkName: function (user, registered) {
		let userid = user.userid;
		let punishment = this.userids.get(userid);
		if (!punishment && user.namelocked) {
			punishment = this.userids.get(user.namelocked);
			if (!punishment) punishment = ['NAMELOCK', user.namelocked, 0];
		}
		if (!punishment && user.locked) {
			punishment = this.userids.get(user.locked);
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
			this.punish(user, punishment);
			user.disconnectAll();
			return;
		}
		if (id === 'NAMELOCK' || user.namelocked) {
			user.send(`|popup|You are namelocked and can't have a username${bannedUnder}'. Your namelock will expire in a few days.${reason}${appeal}`);
			if (punishment[2]) this.punish(user, punishment);
			user.locked = punishUserid;
			user.namelocked = punishUserid;
			user.resetName();
			user.updateIdentity();
		} else {
			if (!user.lockNotified) {
				user.send(`|popup|You are locked${bannedUnder}. Your lock will expire in a few days.${reason}${appeal}`);
				user.lockNotified = true;
			}
			this.punish(user, punishment);
			user.locked = punishUserid;
			user.updateIdentity();
		}
	},

	/**
	 * @param {User} user
	 * @param {Connection} connection
	 */
	checkIp: function (user, connection) {
		let ip = connection.ip;
		let punishment = this.ipSearch(ip);

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
	},

	/**
	 * Connection flood table. Separate table from IP bans.
	 * @type Set<string>
	 */
	cfloods: new Set(),

	/**
	 * IP bans need to be checked separately since we don't even want to
	 * make a User object if an IP is banned.
	 *
	 * @param {Connection} connection
	 * @return {?string}
	 */
	checkIpBanned: function (connection) {
		let ip = connection.ip;
		if (this.cfloods.has(ip) || (Monitor.countConnection(ip) && this.cfloods.add(ip))) {
			connection.send(`|popup||modal|PS is under heavy load and cannot accommodate your connection right now.`);
			return '#cflood';
		}

		let banned = false;
		let punishment = this.ipSearch(ip);
		if (punishment && punishment[0] === 'BAN') {
			banned = punishment[1];
		} else if (this.checkRangeBanned(ip)) {
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
	},

	checkNameInRoom: function (user, roomid) {
		let punishment = this.roomUserids.nestedGet(roomid, user.userid);
		if (!punishment && user.autoconfirmed) {
			punishment = this.roomUserids.nestedGet(roomid, user.autoconfirmed);
		}
		if (!punishment) return;
		if (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST') {
			return true;
		}
	},

	checkNewNameInRoom: function (user, userid, roomid) {
		const punishment = this.roomUserids.nestedGet(roomid, userid);
		if (punishment) {
			if (punishment[0] !== 'ROOMBAN' && punishment[0] !== 'BLACKLIST') return;
			const room = Rooms(roomid);
			if (room.game && room.game.removeBannedUser) {
				room.game.removeBannedUser(user);
			}
			user.leaveRoom(room.id);
		}
	},

	isRoomBanned: function (user, roomid) {
		if (!user) return;

		let punishment = this.roomUserids.nestedGet(roomid, user.userid);
		if (punishment && (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST')) return punishment;

		if (user.autoconfirmed) {
			punishment = this.roomUserids.nestedGet(roomid, user.autoconfirmed);
			if (punishment && (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST')) return punishment;
		}

		for (let ip in user.ips) {
			punishment = this.roomIps.nestedGet(roomid, ip);
			if (punishment && (punishment[0] === 'ROOMBAN' || punishment[0] === 'BLACKLIST')) return punishment;
		}
	},
};

setImmediate(() => {
	Punishments.loadPunishments();
	Punishments.loadRoomPunishments();
	Punishments.loadBanlist();
});
