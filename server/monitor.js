/**
 * Monitor
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Various utility functions to make sure PS is running healthily.
 *
 * @license MIT license
 */
'use strict';

/** @type {typeof import('../lib/fs').FS} */
const FS = require(/** @type {any} */('../.lib-dist/fs')).FS;

const MONITOR_CLEAN_TIMEOUT = 2 * 60 * 60 * 1000;

/**
 * This counts the number of times an action has been committed, and tracks the
 * delta of time since the last time it was committed. Actions include
 * connecting to the server, starting a battle, validating a team, and
 * sending/receiving data over a connection's socket.
 * @augments {Map<string, [number, number]>}
 */
// @ts-ignore TypeScript bug
class TimedCounter extends Map {
	/**
	 * Increments the number of times an action has been committed by one, and
	 * updates the delta of time since it was last committed.
	 *
	 * @param {string} key
	 * @param {number} timeLimit
	 * @return {[number, number]} - [action count, time delta]
	 */
	increment(key, timeLimit) {
		let val = this.get(key);
		let now = Date.now();
		if (!val || now > val[1] + timeLimit) {
			this.set(key, [1, Date.now()]);
			return [1, 0];
		} else {
			val[0]++;
			return [val[0], now - val[1]];
		}
	}
}

// Config.loglevel is:
// 0 = everything
// 1 = debug (same as 0 for now)
// 2 = notice (default)
// 3 = warning
// (4 is currently unused)
// 5 = supposedly completely silent, but for now a lot of PS output doesn't respect loglevel
if (('Config' in global) &&
		(typeof Config.loglevel !== 'number' || Config.loglevel < 0 || Config.loglevel > 5)) {
	Config.loglevel = 2;
}

/** @type {typeof import('../lib/crashlogger')} */
let crashlogger = require(/** @type {any} */('../.lib-dist/crashlogger'));

const Monitor = module.exports = {
	/*********************************************************
	 * Logging
	 *********************************************************/

	/**
	 * @param {Error} error
	 * @param {string} source
	 * @param {{}?} details
	 */
	crashlog(error, source = 'The main process', details = null) {
		if ((error.stack || '').startsWith('@!!@')) {
			try {
				let stack = (error.stack || '');
				let nlIndex = stack.indexOf('\n');
				[error.name, error.message, source, details] = JSON.parse(stack.slice(4, nlIndex));
				error.stack = stack.slice(nlIndex + 1);
			} catch (e) {}
		}
		let crashType = crashlogger(error, source, details);
		Rooms.global.reportCrash(error, source);
		if (crashType === 'lockdown') {
			Rooms.global.startLockdown(error);
		}
	},

	/**
	 * @param {string} text
	 */
	log(text) {
		this.notice(text);
		if (Rooms('staff')) {
			Rooms('staff').add(`|c|~|${text}`).update();
		}
	},

	/**
	 * @param {string} text
	 */
	adminlog(text) {
		this.notice(text);
		if (Rooms('upperstaff')) {
			Rooms('upperstaff').add(`|c|~|${text}`).update();
		}
	},

	/**
	 * @param {string} text
	 */
	logHTML(text) {
		this.notice(text);
		if (Rooms('staff')) {
			Rooms('staff').add(`|html|${text}`).update();
		}
	},

	/**
	 * @param {string} text
	 */
	debug(text) {
		if (Config.loglevel <= 1) console.log(text);
	},

	/**
	 * @param {string} text
	 */
	warn(text) {
		if (Config.loglevel <= 3) console.log(text);
	},

	/**
	 * @param {string} text
	 */
	notice(text) {
		if (Config.loglevel <= 2) console.log(text);
	},

	/*********************************************************
	 * Resource Monitor
	 *********************************************************/

	clean() {
		this.clearNetworkUse();
		this.battlePreps.clear();
		this.battles.clear();
		this.connections.clear();
		Dnsbl.cache.clear();
	},

	connections: new TimedCounter(),
	battles: new TimedCounter(),
	battlePreps: new TimedCounter(),
	groupChats: new TimedCounter(),
	tickets: new TimedCounter(),

	/** @type {string | null} */
	activeIp: null,
	/** @type {{[k: string]: number}} */
	networkUse: {},
	/** @type {{[k: string]: number}} */
	networkCount: {},
	/** @type {{[k: string]: string}} */
	hotpatchLock: {},

	/**
	 * Counts a connection. Returns true if the connection should be terminated for abuse.
	 *
	 * @param {string} ip
	 * @param {string} [name = '']
	 * @return {boolean}
	 */
	countConnection(ip, name = '') {
		let [count, duration] = this.connections.increment(ip, 30 * 60 * 1000);
		if (count === 500) {
			this.adminlog(`[ResourceMonitor] IP ${ip} banned for cflooding (${count} times in ${Chat.toDurationString(duration)}${name ? ': ' + name : ''})`);
			return true;
		}

		if (count > 500) {
			if (count % 500 === 0) {
				let c = count / 500;
				if (c === 2 || c === 4 || c === 10 || c === 20 || c % 40 === 0) {
					this.adminlog(`[ResourceMonitor] IP ${ip} still cflooding (${count} times in ${Chat.toDurationString(duration)}${name ? ': ' + name : ''})`);
				}
			}
			return true;
		}

		return false;
	},

	/**
	 * Counts battles created. Returns true if the connection should be
	 * terminated for abuse.
	 *
	 * @param {string} ip
	 * @param {string} [name = '']
	 * @return {boolean}
	 */
	countBattle(ip, name = '') {
		let [count, duration] = this.battles.increment(ip, 30 * 60 * 1000);
		if (duration < 5 * 60 * 1000 && count % 30 === 0) {
			this.adminlog(`[ResourceMonitor] IP ${ip} has battled ${count} times in the last ${Chat.toDurationString(duration)}${name ? ': ' + name : ''})`);
			return true;
		}

		if (count % 150 === 0) {
			this.adminlog(`[ResourceMonitor] IP ${ip} has battled ${count} times in the last ${Chat.toDurationString(duration)}${name ? ': ' + name : ''}`);
			return true;
		}

		return false;
	},

	/**
	 * Counts team validations. Returns true if too many.
	 *
	 * @param {string} ip
	 * @param {Connection} connection
	 * @return {boolean}
	 */
	countPrepBattle(ip, connection) {
		let count = this.battlePreps.increment(ip, 3 * 60 * 1000)[0];
		if (count <= 12) return false;
		if (count < 120 && Punishments.sharedIps.has(ip)) return false;
		connection.popup('Due to high load, you are limited to 12 battles and team validations every 3 minutes.');
		return true;
	},

	/**
	 * Counts concurrent battles. Returns true if too many.
	 *
	 * @param {number} count
	 * @param {Connection} connection
	 * @return {boolean}
	 */
	countConcurrentBattle(count, connection) {
		if (count <= 5) return false;
		connection.popup(`Due to high load, you are limited to 5 games at the same time.`);
		return true;
	},
	/**
	 * Counts group chat creation. Returns true if too much.
	 *
	 * @param {string} ip
	 * @return {boolean}
	 */
	countGroupChat(ip) {
		let count = this.groupChats.increment(ip, 60 * 60 * 1000)[0];
		return count > 4;
	},

	/**
	 * Counts ticket creation. Returns true if too much.
	 *
	 * @param {string} ip
	 * @return {boolean}
	 */
	countTickets(ip) {
		let count = this.tickets.increment(ip, 60 * 60 * 1000)[0];
		if (Punishments.sharedIps.has(ip)) {
			return count >= 20;
		} else {
			return count >= 5;
		}
	},

	/**
	 * Counts the data length received by the last connection to send a
	 * message, as well as the data length in the server's response.
	 *
	 * @param {number} size
	 */
	countNetworkUse(size) {
		if (!Config.emergency || typeof this.activeIp !== 'string') return;
		if (this.activeIp in this.networkUse) {
			this.networkUse[this.activeIp] += size;
			this.networkCount[this.activeIp]++;
		} else {
			this.networkUse[this.activeIp] = size;
			this.networkCount[this.activeIp] = 1;
		}
	},

	writeNetworkUse() {
		let buf = '';
		for (let i in this.networkUse) {
			buf += `${this.networkUse[i]}\t${this.networkCount[i]}\t${i}\n`;
		}
		FS('logs/networkuse.tsv').write(buf);
	},

	clearNetworkUse() {
		if (Config.emergency) {
			this.networkUse = {};
			this.networkCount = {};
		}
	},

	/**
	 * Counts roughly the size of an object to have an idea of the server load.
	 *
	 * @param {any} object
	 * @return {number}
	 */
	sizeOfObject(object) {
		/** @type {Set<(Array | Object)>} */
		let objectCache = new Set();
		let stack = [object];
		let bytes = 0;

		while (stack.length) {
			let value = stack.pop();
			switch (typeof value) {
			case 'boolean':
				bytes += 4;
				break;
			case 'string':
				bytes += value.length * 2;
				break;
			case 'number':
				bytes += 8;
				break;
			case 'object':
				if (!objectCache.has(value)) objectCache.add(value);
				if (Array.isArray(value)) {
					for (let el of value) stack.push(el);
				} else {
					for (let i in value) stack.push(value[i]);
				}
				break;
			}
		}

		return bytes;
	},

	/** @type {{new(entries: [any, [number, number]]): TimedCounter}} */
	TimedCounter,
};

Monitor.cleanInterval = setInterval(() => Monitor.clean(), MONITOR_CLEAN_TIMEOUT);
