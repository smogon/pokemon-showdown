/**
 * Monitor
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Various utility functions to make sure PS is running healthy.
 *
 * @license MIT license
 */
'use strict';

const fs = require('fs');
const path = require('path');

class TimedCounter extends Map {
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

const Monitor = module.exports = {

	/*********************************************************
	 * Logging
	 *********************************************************/

	log: function (text) {
		this.notice(text);
		if (Rooms('staff')) {
			Rooms('staff').add('|c|~|' + text).update();
		}
	},
	adminlog: function (text) {
		this.notice(text);
		if (Rooms('upperstaff')) {
			Rooms('upperstaff').add('|c|~|' + text).update();
		}
	},
	logHTML: function (text) {
		this.notice(text);
		if (Rooms('staff')) {
			Rooms('staff').add('|html|' + text).update();
		}
	},
	debug: function (text) {
		// console.log(text);
	},
	warn: function (text) {
		console.log(text);
	},
	notice: function (text) {
		console.log(text);
	},

	/*********************************************************
	 * Resource Monitor
	 *********************************************************/

	clean: function () {
		Monitor.clearNetworkUse();
		Monitor.battlePreps.clear();
		Monitor.battles.clear();
		Monitor.connections.clear();
		Dnsbl.cache.clear();
	},
	connections: new TimedCounter(),
	battles: new TimedCounter(),
	battlePreps: new TimedCounter(),
	groupChats: new TimedCounter(),
	networkUse: {},
	networkCount: {},
	hotpatchLock: false,
	/**
	 * Counts a connection. Returns true if the connection should be terminated for abuse.
	 */
	countConnection: function (ip, name) {
		let val = this.connections.increment(ip, 30 * 60 * 1000);
		let count = val[0], duration = val[1];
		name = (name ? ': ' + name : '');
		if (count === 500) {
			this.adminlog('[ResourceMonitor] IP ' + ip + ' banned for cflooding (' + count + ' times in ' + Tools.toDurationString(duration) + name + ')');
			return true;
		} else if (count > 500) {
			if (count % 500 === 0) {
				let c = count / 500;
				if (c === 2 || c === 4 || c === 10 || c === 20 || c % 40 === 0) {
					this.adminlog('[ResourceMonitor] IP ' + ip + ' still cflooding (' + count + ' times in ' + Tools.toDurationString(duration) + name + ')');
				}
			}
			return true;
		}
	},
	/**
	 * Counts a battle. Returns true if the connection should be terminated for abuse.
	 */
	countBattle: function (ip, name) {
		let val = this.battles.increment(ip, 30 * 60 * 1000);
		let count = val[0], duration = val[1];
		name = (name ? ': ' + name : '');
		if (duration < 5 * 60 * 1000 && count % 15 === 0) {
			this.adminlog('[ResourceMonitor] IP ' + ip + ' has battled ' + count + ' times in the last ' + Tools.toDurationString(duration) + name);
		} else if (count % 75 === 0) {
			this.adminlog('[ResourceMonitor] IP ' + ip + ' has battled ' + count + ' times in the last ' + Tools.toDurationString(duration) + name);
		}
	},
	/**
	 * Counts battle prep. Returns true if too much
	 */
	countPrepBattle: function (ip) {
		let count = this.battlePreps.increment(ip, 3 * 60 * 1000)[0];
		if (count > 6) return true;
	},
	/**
	 * Counts group chat creation. Returns true if too much.
	 */
	countGroupChat: function (ip) {
		let count = this.groupChats.increment(ip, 60 * 60 * 1000)[0];
		if (count > 4) return true;
	},
	/**
	 * data
	 */
	countNetworkUse: function (size) {
		if (Config.emergency) {
			if (this.activeIp in this.networkUse) {
				this.networkUse[this.activeIp] += size;
				this.networkCount[this.activeIp]++;
			} else {
				this.networkUse[this.activeIp] = size;
				this.networkCount[this.activeIp] = 1;
			}
		}
	},
	writeNetworkUse: function () {
		let buf = '';
		for (let i in this.networkUse) {
			buf += '' + this.networkUse[i] + '\t' + this.networkCount[i] + '\t' + i + '\n';
		}
		fs.writeFile(path.resolve(__dirname, 'logs/networkuse.tsv'), buf);
	},
	clearNetworkUse: function () {
		if (Config.emergency) {
			this.networkUse = {};
			this.networkCount = {};
		}
	},
	/**
	 * Counts roughly the size of an object to have an idea of the server load.
	 */
	sizeOfObject: function (object) {
		let objectList = [];
		let stack = [object];
		let bytes = 0;

		while (stack.length) {
			let value = stack.pop();
			if (typeof value === 'boolean') {
				bytes += 4;
			} else if (typeof value === 'string') {
				bytes += value.length * 2;
			} else if (typeof value === 'number') {
				bytes += 8;
			} else if (typeof value === 'object' && !objectList.includes(value)) {
				objectList.push(value);
				for (let i in value) stack.push(value[i]);
			}
		}

		return bytes;
	},
};

Monitor.cleanInterval = setInterval(() => Monitor.clean(), 2 * 60 * 60 * 1000);
