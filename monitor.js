/**
 * Monitor
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Various utility functions to make sure PS is running healthy.
 *
 * @license MIT license
 */

var fs = require('fs');
var path = require('path');

/* global Monitor: true */
var Monitor = module.exports = {

	/*********************************************************
	 * Logging
	 *********************************************************/

	log: function (text) {
		this.notice(text);
		if (Rooms.get('staff')) {
			Rooms.get('staff').add('|c|~|' + text).update();
		}
	},
	adminlog: function (text) {
		this.notice(text);
		if (Rooms.get('upperstaff')) {
			Rooms.get('upperstaff').add('|c|~|' + text).update();
		}
	},
	logHTML: function (text) {
		this.notice(text);
		if (Rooms.get('staff')) {
			Rooms.get('staff').add('|html|' + text).update();
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

	connections: {},
	connectionTimes: {},
	battles: {},
	battleTimes: {},
	battlePreps: {},
	battlePrepTimes: {},
	groupChats: {},
	groupChatTimes: {},
	networkUse: {},
	networkCount: {},
	cmds: {},
	cmdsTimes: {},
	cmdsTotal: {lastCleanup: Date.now(), count: 0},
	teamValidatorChanged: 0,
	teamValidatorUnchanged: 0,
	/**
	 * Counts a connection. Returns true if the connection should be terminated for abuse.
	 */
	countConnection: function (ip, name) {
		var now = Date.now();
		var duration = now - this.connectionTimes[ip];
		name = (name ? ': ' + name : '');
		if (ip in this.connections && duration < 30 * 60 * 1000) {
			this.connections[ip]++;
			if (this.connections[ip] === 500) {
				this.adminlog('[ResourceMonitor] IP ' + ip + ' has been banned for connection flooding (' + this.connections[ip] + ' times in the last ' + duration.duration() + name + ')');
				return true;
			} else if (this.connections[ip] > 500) {
				if (this.connections[ip] % 500 === 0) {
					var c = this.connections[ip] / 500;
					if (c < 5 || c % 2 === 0 && c < 10 || c % 5 === 0) {
						this.adminlog('[ResourceMonitor] Banned IP ' + ip + ' has connected ' + this.connections[ip] + ' times in the last ' + duration.duration() + name);
					}
				}
				return true;
			}
		} else {
			this.connections[ip] = 1;
			this.connectionTimes[ip] = now;
		}
	},
	/**
	 * Counts a battle. Returns true if the connection should be terminated for abuse.
	 */
	countBattle: function (ip, name) {
		var now = Date.now();
		var duration = now - this.battleTimes[ip];
		name = (name ? ': ' + name : '');
		if (ip in this.battles && duration < 30 * 60 * 1000) {
			this.battles[ip]++;
			if (duration < 5 * 60 * 1000 && this.battles[ip] % 15 === 0) {
				this.log('[ResourceMonitor] IP ' + ip + ' has battled ' + this.battles[ip] + ' times in the last ' + duration.duration() + name);
			} else if (this.battles[ip] % 75 === 0) {
				this.log('[ResourceMonitor] IP ' + ip + ' has battled ' + this.battles[ip] + ' times in the last ' + duration.duration() + name);
			}
		} else {
			this.battles[ip] = 1;
			this.battleTimes[ip] = now;
		}
	},
	/**
	 * Counts battle prep. Returns true if too much
	 */
	countPrepBattle: function (ip) {
		var now = Date.now();
		var duration = now - this.battlePrepTimes[ip];
		if (ip in this.battlePreps && duration < 3 * 60 * 1000) {
			this.battlePreps[ip]++;
			if (this.battlePreps[ip] > 6) {
				return true;
			}
		} else {
			this.battlePreps[ip] = 1;
			this.battlePrepTimes[ip] = now;
		}
	},
	/**
	 * Counts group chat creation. Returns true if too much.
	 */
	countGroupChat: function (ip) {
		var now = Date.now();
		var duration = now - this.groupChatTimes[ip];
		if (ip in this.groupChats && duration < 60 * 60 * 1000) {
			this.groupChats[ip]++;
			if (this.groupChats[ip] > 4) {
				return true;
			}
		} else {
			this.groupChats[ip] = 1;
			this.groupChatTimes[ip] = now;
		}
	},
	/**
	 * data
	 */
	countNetworkUse: function (size) {
		if (this.activeIp in this.networkUse) {
			this.networkUse[this.activeIp] += size;
			this.networkCount[this.activeIp]++;
		} else {
			this.networkUse[this.activeIp] = size;
			this.networkCount[this.activeIp] = 1;
		}
	},
	writeNetworkUse: function () {
		var buf = '';
		for (var i in this.networkUse) {
			buf += '' + this.networkUse[i] + '\t' + this.networkCount[i] + '\t' + i + '\n';
		}
		fs.writeFile(path.resolve(__dirname, 'logs/networkuse.tsv'), buf);
	},
	clearNetworkUse: function () {
		this.networkUse = {};
		this.networkCount = {};
	},
	/**
	 * Counts roughly the size of an object to have an idea of the server load.
	 */
	sizeOfObject: function (object) {
		var objectList = [];
		var stack = [object];
		var bytes = 0;

		while (stack.length) {
			var value = stack.pop();
			if (typeof value === 'boolean') {
				bytes += 4;
			} else if (typeof value === 'string') {
				bytes += value.length * 2;
			} else if (typeof value === 'number') {
				bytes += 8;
			} else if (typeof value === 'object' && objectList.indexOf(value) < 0) {
				objectList.push(value);
				for (var i in value) stack.push(value[i]);
			}
		}

		return bytes;
	},
	/**
	 * Controls the amount of times a cmd command is used
	 */
	countCmd: function (ip, name) {
		var now = Date.now();
		var duration = now - this.cmdsTimes[ip];
		name = (name ? ': ' + name : '');
		if (!this.cmdsTotal) this.cmdsTotal = {lastCleanup: 0, count: 0};
		if (now - this.cmdsTotal.lastCleanup > 60 * 1000) {
			this.cmdsTotal.count = 0;
			this.cmdsTotal.lastCleanup = now;
		}
		this.cmdsTotal.count++;
		if (ip in this.cmds && duration < 60 * 1000) {
			this.cmds[ip]++;
			if (duration < 60 * 1000 && this.cmds[ip] % 5 === 0) {
				if (this.cmds[ip] >= 3) {
					if (this.cmds[ip] % 30 === 0) this.log('CMD command from ' + ip + ' blocked for ' + this.cmds[ip] + 'th use in the last ' + duration.duration() + name);
					return true;
				}
				this.log('[ResourceMonitor] IP ' + ip + ' has used CMD command ' + this.cmds[ip] + ' times in the last ' + duration.duration() + name);
			} else if (this.cmds[ip] % 15 === 0) {
				this.log('CMD command from ' + ip + ' blocked for ' + this.cmds[ip] + 'th use in the last ' + duration.duration() + name);
				return true;
			}
		} else if (this.cmdsTotal.count > 8000) {
			// One CMD check per user per minute on average (to-do: make this better)
			this.log('CMD command for ' + ip + ' blocked because CMD has been used ' + this.cmdsTotal.count + ' times in the last minute.');
			return true;
		} else {
			this.cmds[ip] = 1;
			this.cmdsTimes[ip] = now;
		}
	}
};
