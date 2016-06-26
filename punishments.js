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
let fs = require('fs');
let path = require('path');

const PUNISHMENT_FILE = path.resolve(__dirname, 'config/punishments.tsv');

const RANGELOCK_DURATION = 60 * 60 * 1000; // 1 hour
const LOCK_DURATION = 37 * 60 * 60 * 1000; // 37 hours
const BAN_DURATION = 7 * 24 * 60 * 60 * 1000; // 1 week

// a punishment is an array: [punishType, userid, expireTime, reason]

// ips is an ip:punishment Map
Punishments.ips = new Map();

// userids is a userid:punishment Map
Punishments.userids = new Map();

/*********************************************************
 * Persistence
 *********************************************************/

// punishType is an allcaps string, one of:
//   'LOCK'
//   'BAN'
//   'NAMELOCK'

// punishments.tsv is in the format:
// punishType, userid, ips/usernames, expiration time

Punishments.loadPunishments = function () {
	fs.readFile(PUNISHMENT_FILE, (err, data) => {
		if (err) return;
		data = ('' + data).split("\n");
		for (let i = 0; i < data.length; i++) {
			if (!data[i] || data[i] === '\r') continue;
			let row = data[i].trim().split("\t");
			if (row[0] === "Punishment") continue;
			let keys = row[2].split(',').concat(row[1]);

			let punishment = [row[0], row[1], Number(row[3])].concat(row.slice(4));
			if (Date.now() >= punishment[2]) {
				continue;
			}
			for (let j = 0; j < keys.length; j++) {
				let key = keys[j];
				if (key.includes('.')) {
					Punishments.ips.set(key, punishment);
				} else {
					Punishments.userids.set(key, punishment);
				}
			}
		}
	});
};

Punishments.savePunishments = function () {
	let saveTable = new Map();
	Punishments.ips.forEach((punishment, ip) => {
		if (Date.now() >= punishment[2]) {
			Punishments.ips.delete(ip);
			return;
		}
		let id = punishment[1];
		if (id.charAt(0) === '#') return;
		let entry = saveTable.get(id);

		if (entry) {
			entry.keys.push(ip);
			return;
		}

		entry = {
			keys: [ip],
			punishType: punishment[0],
			rest: punishment.slice(2),
		};
		saveTable.set(id, entry);
	});
	Punishments.userids.forEach((punishment, userid) => {
		if (Date.now() >= punishment[2]) {
			Punishments.userids.delete(userid);
			return;
		}
		let id = punishment[1];
		let entry = saveTable.get(id);

		if (!entry) {
			entry = {
				keys: [],
				punishType: punishment[0],
				rest: punishment.slice(2),
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

Punishments.appendPunishment = function (entry, id) {
	if (id.charAt(0) === '#') return;
	let buf = Punishments.renderEntry(entry, id);
	fs.appendFile(PUNISHMENT_FILE, buf, () => {});
};

Punishments.renderEntry = function (entry, id) {
	let row = [entry.punishType, id, entry.keys.join(',')].concat(entry.rest);
	return row.join('\t') + '\r\n';
};

Punishments.loadBanlist = function () {
	return new Promise(function (resolve, reject) {
		fs.readFile(path.resolve(__dirname, 'config/ipbans.txt'), (err, data) => {
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
			Punishments.checkRangeBanned = Cidr.checker(rangebans);
			resolve();
		});
	});
};

setImmediate(() => {
	Punishments.loadPunishments();
	Punishments.loadBanlist().catch(err => {
		if (err.code === 'ENOENT') return;
		throw err;
	});
});

/*********************************************************
 * Adding and removing
 *********************************************************/

Punishments.punish = function (user, punishment, noRecurse) {
	let keys = noRecurse;
	if (!keys) {
		keys = new Set();
	}
	if (!noRecurse) {
		Users.users.forEach(curUser => {
			if (user === curUser || curUser.confirmed) return;
			for (let myIp in curUser.ips) {
				if (myIp in user.ips) {
					this.punish(curUser, punishment, keys);
					return;
				}
			}
		});
		Punishments.userids.set(user.userid, punishment);
	}

	for (let ip in user.ips) {
		Punishments.ips.set(ip, punishment);
		keys.add(ip);
	}
	if (user.autoconfirmed) {
		Punishments.userids.set(user.autoconfirmed, punishment);
		keys.add(user.autoconfirmed);
	}
	if (user.confirmed) {
		Punishments.userids.set(user.confirmed, punishment);
		keys.add(user.confirmed);
	}
	if (!noRecurse) {
		keys.delete(punishment[1]);
		Punishments.appendPunishment({
			keys: Array.from(keys),
			punishType: punishment[0],
			rest: punishment.slice(2),
		}, punishment[1]);
	}
};
Punishments.unpunish = function (id, punishType, noRecurse) {
	id = toId(id);
	let punishment = Punishments.useridSearch(id);
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

Punishments.ban = function (user, expireTime, id, reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + BAN_DURATION;
	let punishment = ['BAN', id, expireTime].concat(Array.prototype.slice.call(arguments, 3));
	Punishments.punish(user, punishment);

	let affected = user.getAltUsers(false, true);
	for (let curUser of affected) {
		curUser.locked = id;
		curUser.disconnectAll();
	}
};
Punishments.unban = function (name) {
	let success = Punishments.unpunish(name, 'BAN');
	return success;
};
Punishments.lock = function (user, expireTime, id, reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
	let punishment = ['LOCK', id, expireTime].concat(Array.prototype.slice.call(arguments, 3));
	Punishments.punish(user, punishment);

	let affected = user.getAltUsers(false, true);
	for (let curUser of affected) {
		curUser.locked = id;
		curUser.updateIdentity();
	}
};
Punishments.unlock = function (name) {
	let user = Users(name);
	let id = toId(name);
	let success = [];
	if (user && user.locked) {
		id = user.locked;
		user.locked = false;
		user.updateIdentity();
		success.push(user.getLastName());
		if (id.charAt(0) !== '#') {
			Users.users.forEach(curUser => {
				if (curUser.locked === id) {
					curUser.locked = false;
					curUser.updateIdentity();
					success.push(curUser.getLastName());
				}
			});
		}
	}
	if (Punishments.unpunish(name, 'LOCK')) {
		if (!success.length) success.push(name);
	}
	if (!success.length) return false;
	if (!success.some(v => toId(v) === id)) {
		success.push(id);
	}
	return success;
};
Punishments.namelock = function (user, expireTime, id, reason) {
	if (!id) id = user.getLastId();

	if (!expireTime) expireTime = Date.now() + LOCK_DURATION;
	let punishment = ['NAMELOCK', id, expireTime].concat(Array.prototype.slice.call(arguments, 3));
	Punishments.punish(user, punishment);

	let affected = user.getAltUsers(false, true);
	for (let curUser of affected) {
		curUser.locked = id;
		curUser.namelocked = id;
		curUser.resetName();
		curUser.updateIdentity();
	}
};
Punishments.unnamelock = function (name) {
	let user = Users(name);
	let id = toId(name);
	let success = [];
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
	if (Punishments.unpunish(name, 'NAMELOCK')) {
		if (!success.length) success.push(name);
	}
	if (!success.length) return false;
	if (!success.some(v => toId(v) === id)) {
		success.push(id);
	}
	return success;
};

Punishments.lockRange = function (range, reason) {
	let punishment = ['LOCK', '#rangelock', Date.now() + RANGELOCK_DURATION, reason];
	Punishments.ips.set(range, punishment);
};
Punishments.banRange = function (range, reason) {
	let punishment = ['BAN', '#rangelock', Date.now() + RANGELOCK_DURATION, reason];
	Punishments.ips.set(range, punishment);
};

/*********************************************************
 * Checking
 *********************************************************/

Punishments.getPunishType = function (name) {
	let punishment = Punishments.useridSearch(toId(name));
	if (punishment) return punishment[0];
	let user = Users.get(name);
	if (!user) return;
	punishment = Punishments.ipSearch(user.latestIp);
	if (punishment) return punishment[0];
	return '';
};

/**
 * Searches for IP in Punishments.ips
 *
 * For instance, if IP is '1.2.3.4', will return the value corresponding
 * to any of the keys in table match '1.2.3.4', '1.2.3.*', '1.2.*', or '1.*'
 */
Punishments.ipSearch = function (ip) {
	let punishment = Punishments.ips.get(ip);
	if (punishment) {
		if (Date.now() < punishment[2]) return punishment;
		Punishments.ips.delete(ip);
	}
	let dotIndex = ip.lastIndexOf('.');
	for (let i = 0; i < 4 && dotIndex > 0; i++) {
		ip = ip.substr(0, dotIndex);
		punishment = Punishments.ips.get(ip + '.*');
		if (punishment) {
			if (Date.now() < punishment[2]) return punishment;
			Punishments.ips.delete(ip + '.*');
		}
		dotIndex = ip.lastIndexOf('.');
	}
	return false;
};

Punishments.useridSearch = function (userid) {
	let punishment = Punishments.userids.get(userid);
	if (punishment) {
		if (Date.now() < punishment[2]) return punishment;
		Punishments.userids.delete(userid);
	}
	return false;
};

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

Punishments.checkName = function (user, registered) {
	let userid = user.userid;
	let punishment = Punishments.useridSearch(userid);
	if (!punishment && user.namelocked) {
		punishment = Punishments.useridSearch(user.namelocked);
		if (!punishment) punishment = ['NAMELOCK', user.namelocked, 0];
	}
	if (!punishment) return;

	let id = punishment[0];
	let punishUserid = punishment[1];

	if (registered && id === 'BAN') {
		let bannedUnder = '';
		if (punishUserid !== userid) bannedUnder = ' because it has the same IP as banned user: ' + punishUserid;
		user.send("|popup|Your username (" + user.name + ") is banned" + bannedUnder + "'. Your ban will expire in a few days." + (Config.appealurl ? " Or you can appeal at:\n" + Config.appealurl : ""));
		Punishments.punish(user, punishment);
		user.disconnectAll();
		return;
	}
	if (id === 'NAMELOCK' || user.namelocked) {
		let bannedUnder = '';
		if (punishUserid !== userid) bannedUnder = ' because it has the same IP as banned user: ' + punishUserid;
		user.send("|popup|You are namelocked" + bannedUnder + "'. Your namelock will expire in a few days.");
		if (punishment[2]) Punishments.punish(user, punishment);
		user.locked = punishUserid;
		user.namelocked = punishUserid;
		user.resetName();
		user.updateIdentity();
	} else {
		let bannedUnder = '';
		if (punishUserid !== userid) bannedUnder = ' because it has the same IP as banned user: ' + punishUserid;
		user.send("|popup|Your username (" + user.name + ") is locked" + bannedUnder + "'. Your lock will expire in a few days." + (Config.appealurl ? " Or you can appeal at:\n" + Config.appealurl : ""));
		Punishments.punish(user, punishment);
		user.locked = punishUserid;
		user.updateIdentity();
	}
	if (user.namelocked) {
		user.popup("You can't change your name because you're namelocked.");
		user.resetName();
		user.updateIdentity();
	}
};

Punishments.checkIp = function (user, connection) {
	let ip = connection.ip;
	let punishment = Punishments.ipSearch(ip);

	if (punishment) {
		user.locked = punishment[1];
		if (punishment[0] === 'NAMELOCK') {
			user.namelocked = punishment[1];
		}
	}

	Dnsbl.reverse(ip, (err, hosts) => {
		if (hosts && hosts[0]) {
			user.latestHost = hosts[0];
			if (Config.hostfilter) Config.hostfilter(hosts[0], user, connection);
		} else {
			if (Config.hostfilter) Config.hostfilter('', user, connection);
		}
	});

	Dnsbl.query(connection.ip, isBlocked => {
		if (isBlocked) {
			if (connection.user && !connection.user.locked && !connection.user.autoconfirmed) {
				connection.user.semilocked = '#dnsbl';
			}
		}
	});
};

// Connection flood table. Separate table from IP bans.
let cfloods = new Set();

/**
 * IP bans need to be checked separately since we don't even want to
 * make a User object if an IP is banned.
 */
Punishments.checkIpBanned = function (connection) {
	let ip = connection.ip;
	if (cfloods.has(ip) || (Monitor.countConnection(ip) && cfloods.add(ip))) {
		connection.send("|popup||modal|PS is under heavy load and cannot accommodate your connection right now.");
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
		connection.send("|popup||modal|Your IP (" + ip + ") is not allowed to connect to PS, because it has been used to spam, hack, or otherwise attack our server.||Make sure you are not using any proxies to connect to PS.");
	} else {
		connection.send("|popup||modal|You are banned because you have the same IP (" + ip + ") as banned user '" + banned + "'. Your ban will expire in a few days.||" + (Config.appealurl ? " Or you can appeal at:\n" + Config.appealurl : ""));
	}
	if (!Config.quietconsole) console.log('CONNECT BLOCKED - IP BANNED: ' + ip + ' (' + banned + ')');

	return banned;
};
