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

/*********************************************************
 * Locks and bans
 *********************************************************/

let bannedIps = Punishments.bannedIps = Object.create(null);
let bannedUsers = Punishments.bannedUsers = Object.create(null);
let lockedIps = Punishments.lockedIps = Object.create(null);
let nameLockedIps = Punishments.nameLockedIps = Object.create(null);
let lockedUsers = Punishments.lockedUsers = Object.create(null);
let nameLockedUsers = Punishments.nameLockedUsers = Object.create(null);
let lockedRanges = Punishments.lockedRanges = Object.create(null);
let rangelockedUsers = Punishments.rangeLockedUsers = Object.create(null);

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
function checkNameLocked(ip) {
	return ipSearch(ip, nameLockedIps);
}
Punishments.checkBanned = checkBanned;
Punishments.checkLocked = checkLocked;
Punishments.checkNameLocked = checkNameLocked;

// Defined in commands.js
Punishments.checkRangeBanned = function () {};

function ban(user, noRecurse, name) {
	if (!name) name = user.userid;

	if (!noRecurse) {
		Users.users.forEach(thisUser => {
			if (user === thisUser || thisUser.confirmed) return;
			for (let myIp in thisUser.ips) {
				if (myIp in user.ips) {
					ban(thisUser, true, name);
					return;
				}
			}
		});
		lockedUsers[name] = name;
	}

	for (let ip in user.ips) {
		bannedIps[ip] = name;
	}
	if (user.autoconfirmed) bannedUsers[user.autoconfirmed] = name;
	if (user.registered) {
		bannedUsers[user.userid] = name;
		user.autoconfirmed = '';
	}
	user.locked = name; // in case of merging into a recently banned account
	lockedUsers[user.userid] = name;
	user.disconnectAll();
}
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
function lock(user, noRecurse, name) {
	if (!name) name = user.userid;

	if (!noRecurse) {
		Users.users.forEach(thisUser => {
			if (user === thisUser || thisUser.confirmed) return;
			for (let myIp in thisUser.ips) {
				if (myIp in user.ips) {
					ban(thisUser, true, name);
					return;
				}
			}
		});
		lockedUsers[name] = name;
	}

	for (let ip in user.ips) {
		lockedIps[ip] = name;
	}
	if (user.autoconfirmed) lockedUsers[user.autoconfirmed] = name;
	lockedUsers[user.userid] = name;
	user.locked = name;
	user.autoconfirmed = '';
	user.updateIdentity();
}
function unlock(name, unlocked, noRecurse) {
	let userid = toId(name);
	let user = Users(userid);
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
		if (userips && (ip in user.ips) && lockedIps[ip] !== userid) {
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
	Users.users.forEach(curUser => {
		if (!curUser.named || curUser.locked || curUser.confirmed) return;
		if (ip) {
			if (!curUser.latestIp.startsWith(ip)) return;
		} else {
			if (range !== Users.shortenHost(curUser.latestHost)) return;
		}
		rangelockedUsers[range][curUser.userid] = 1;
		curUser.locked = '#range';
		curUser.send("|popup|You are locked because someone on your ISP has spammed, and your ISP does not give us any way to tell you apart from them.");
		curUser.updateIdentity();
	});

	let time = 90 * 60 * 1000;
	lockedRanges[range] = setTimeout(() => {
		unlockRange(range);
	}, time);
}
function unlockRange(range) {
	if (!lockedRanges[range]) return;
	clearTimeout(lockedRanges[range]);
	for (let i in rangelockedUsers[range]) {
		let user = Users(i);
		if (user) {
			user.locked = false;
			user.updateIdentity();
		}
	}
	if (lockedIps[range]) delete lockedIps[range];
	delete lockedRanges[range];
	delete rangelockedUsers[range];
}
function lockName(user) {
	let userid = user.userid;
	for (let ip in user.ips) {
		nameLockedIps[ip] = userid;
	}
	if (user.autoconfirmed) nameLockedUsers[user.autoconfirmed] = userid;
	nameLockedUsers[user.userid] = userid;
	user.namelocked = userid;
	user.forceRename('Guest ' + user.guestNum, false);
	user.named = true;
	user.updateIdentity();

	return true;
}
function unnamelock(name) {
	let userid = toId(name);
	let user = Users(userid);
	let namelockedId = toId(user.namelocked);
	let unnamelocked = '';
	if (user) {
		if (user.userid === userid) name = user.name;
		if (user.namelocked) {
			user.namelocked = false;
			user.updateIdentity();
			unnamelocked = name;
		}
	}
	for (let ip in nameLockedIps) {
		if (ip in user.ips) {
			delete nameLockedIps[ip];
		}
	}
	// Delete from name locked users the original locked name, found in name.namelocked
	for (let id in nameLockedUsers) {
		if (nameLockedUsers[id] === namelockedId || id === namelockedId) {
			delete nameLockedUsers[id];
			unnamelocked = id;
		}
	}
	return unnamelocked;
}

Punishments.ban = ban;
Punishments.unban = unban;
Punishments.lock = lock;
Punishments.unlock = unlock;
Punishments.lockRange = lockRange;
Punishments.unlockRange = unlockRange;
Punishments.lockName = lockName;
Punishments.unnamelock = unnamelock;
