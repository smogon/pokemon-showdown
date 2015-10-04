/**
 * Simulator abstraction layer
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file abstracts away Pokemon Showdown's multi-process simulator
 * model. You can basically include this file, use its API, and pretend
 * Pokemon Showdown is just one big happy process.
 *
 * For the actual simulation, see battle-engine.js
 *
 * @license MIT license
 */

var battles = Object.create(null);

var SimulatorProcess = (function () {
	function SimulatorProcess() {
		this.process = require('child_process').fork('battle-engine.js', {cwd: __dirname});
		this.process.on('message', function (message) {
			var lines = message.split('\n');
			var battle = battles[lines[0]];
			if (battle) {
				battle.receive(lines);
			}
		});
		this.send = this.process.send.bind(this.process);
	}
	SimulatorProcess.prototype.load = 0;
	SimulatorProcess.prototype.active = true;
	SimulatorProcess.processes = [];
	SimulatorProcess.spawn = function (num) {
		if (!num) num = Config.simulatorprocesses || 1;
		for (var i = this.processes.length; i < num; ++i) {
			this.processes.push(new SimulatorProcess());
		}
	};
	SimulatorProcess.respawn = function () {
		this.processes.splice(0).forEach(function (process) {
			process.active = false;
			if (!process.load) process.process.disconnect();
		});
		this.spawn();
	};
	SimulatorProcess.acquire = function () {
		var process = this.processes[0];
		for (var i = 1; i < this.processes.length; ++i) {
			if (this.processes[i].load < process.load) {
				process = this.processes[i];
			}
		}
		process.load++;
		return process;
	};
	SimulatorProcess.release = function (process) {
		process.load--;
		if (!process.load && !process.active) {
			process.process.disconnect();
		}
	};
	SimulatorProcess.eval = function (code) {
		this.processes.forEach(function (process) {
			process.send('|eval|' + code);
		});
	};
	return SimulatorProcess;
})();

// Create the initial set of simulator processes.
SimulatorProcess.spawn();

var slice = Array.prototype.slice;

var Battle = (function () {
	function Battle(id, format, rated, room) {
		if (battles[id]) {
			throw new Error("Battle with ID " + id + " already exists.");
		}

		this.id = id;
		this.room = room;
		this.format = toId(format);
		this.players = [null, null];
		this.playerids = [null, null];
		this.lastPlayers = [room.p1.userid, room.p2.userid];
		this.playerTable = {};
		this.requests = {};

		this.process = SimulatorProcess.acquire();

		battles[id] = this;

		this.send('init', this.format, rated ? '1' : '');
	}

	Battle.prototype.id = '';

	Battle.prototype.started = false;
	Battle.prototype.ended = false;
	Battle.prototype.active = false;
	Battle.prototype.players = null;
	Battle.prototype.playerids = null;
	Battle.prototype.lastPlayers = null;
	Battle.prototype.playerTable = null;
	Battle.prototype.format = null;
	Battle.prototype.room = null;

	Battle.prototype.requests = null;

	// log information
	Battle.prototype.logData = null;
	Battle.prototype.endType = 'normal';

	Battle.prototype.getFormat = function () {
		return Tools.getFormat(this.format);
	};
	Battle.prototype.lastIp = null;
	Battle.prototype.send = function () {
		this.activeIp = Monitor.activeIp;
		this.process.send('' + this.id + '|' + slice.call(arguments).join('|'));
	};
	Battle.prototype.sendFor = function (user, action) {
		var player = this.playerTable[toId(user)];
		if (!player) {
			Monitor.debug('SENDFOR FAILED in ' + this.id + ': Player doesn\'t exist: ' + user.name);
			return;
		}

		this.send.apply(this, [action, player].concat(slice.call(arguments, 2)));
	};
	Battle.prototype.sendForOther = function (user, action) {
		var opposite = {'p1':'p2', 'p2':'p1'};
		var player = this.playerTable[toId(user)];
		if (!player) return;

		this.send.apply(this, [action, opposite[player]].concat(slice.call(arguments, 2)));
	};

	Battle.prototype.rqid = '';
	Battle.prototype.inactiveQueued = false;
	Battle.prototype.receive = function (lines) {
		var player;
		Monitor.activeIp = this.activeIp;
		switch (lines[1]) {
		case 'update':
			this.active = !this.ended && this.p1 && this.p2;
			this.room.push(lines.slice(2));
			this.room.update();
			if (this.inactiveQueued) {
				this.room.nextInactive();
				this.inactiveQueued = false;
			}
			break;

		case 'winupdate':
			this.started = true;
			this.ended = true;
			this.active = false;
			this.room.push(lines.slice(3));
			this.room.win(lines[2]);
			this.inactiveSide = -1;
			break;

		case 'sideupdate':
			player = this.getPlayer(lines[2]);
			if (player) {
				player.sendTo(this.id, lines[3]);
			}
			break;

		case 'callback':
			player = this.getPlayer(lines[2]);
			if (player) {
				player.sendTo(this.id, '|callback|' + lines[3]);
			}
			break;

		case 'request':
			player = this.getPlayer(lines[2]);
			var rqid = lines[3];
			if (player) {
				this.requests[player.userid] = lines[4];
				player.sendTo(this.id, '|request|' + lines[4]);
			}
			if (rqid !== this.rqid) {
				this.rqid = rqid;
				this.inactiveQueued = true;
			}
			break;

		case 'log':
			this.logData = JSON.parse(lines[2]);
			break;

		case 'inactiveside':
			this.inactiveSide = parseInt(lines[2], 10);
			break;

		case 'score':
			this.score = [parseInt(lines[2], 10), parseInt(lines[3], 10)];
			break;
		}
		Monitor.activeIp = null;
	};

	Battle.prototype.resendRequest = function (connection) {
		var request = this.requests[connection.user];
		if (request) {
			connection.sendTo(this.id, '|request|' + request);
		}
	};
	Battle.prototype.win = function (user) {
		if (!user) {
			this.tie();
			return;
		}
		this.sendFor(user, 'win');
	};
	Battle.prototype.lose = function (user) {
		this.sendForOther(user, 'win');
	};
	Battle.prototype.tie = function () {
		this.send('tie');
	};
	Battle.prototype.chat = function (user, message) {
		this.send('chat', user.name + "\n" + message);
	};

	Battle.prototype.isEmpty = function () {
		if (this.p1) return false;
		if (this.p2) return false;
		return true;
	};

	Battle.prototype.isFull = function () {
		if (this.p1 && this.p2) return true;
		return false;
	};

	Battle.prototype.setPlayer = function (user, slot) {
		if (this.players[slot]) {
			delete this.players[slot].battles[this.id];
		}
		if (user) {
			if (user.battles[this.id]) {
				return false;
			}
			user.battles[this.id] = true;
		}
		this.players[slot] = (user || null);
		var oldplayerid = this.playerids[slot];
		if (oldplayerid) {
			if (user) {
				this.requests[user.userid] = this.requests[oldplayerid];
			}
			delete this.requests[oldplayerid];
		}
		this.playerids[slot] = (user ? user.userid : null);
		this.playerTable = {};
		this.active = !this.ended;
		for (var i = 0, len = this.players.length; i < len; i++) {
			var player = this.players[i];
			this['p' + (i + 1)] = player ? player.name :    '';
			if (!player) {
				this.active = false;
				continue;
			}
			this.playerTable[player.userid] = 'p' + (i + 1);
		}
		if (this.active) this.lastPlayers = this.playerids.slice();
	};
	Battle.prototype.getPlayer = function (slot) {
		if (typeof slot === 'string') {
			if (slot.charAt(0) === 'p') {
				slot = parseInt(slot.substr(1), 10) - 1;
			} else {
				slot = parseInt(slot, 10);
			}
		}
		return this.players[slot];
	};
	Battle.prototype.getSlot = function (player) {
		return this.players.indexOf(player);
	};

	Battle.prototype.join = function (user, slot, team) {
		if (slot === undefined) {
			slot = 0;
			while (this.players[slot]) slot++;
		}
		// console.log('joining: ' + user.name + ' ' + slot);
		if (this.players[slot] || slot >= this.players.length) return false;
		if (user === this.players[0] || user === this.players[1]) return false;

		for (var i = 0; i < user.connections.length; i++) {
			var connection = user.connections[i];
			Sockets.subchannelMove(connection.worker, this.id, slot + 1, connection.socketid);
		}
		this.setPlayer(user, slot);

		var message = '' + user.avatar;
		if (!this.started) {
			message += "\n" + team;
		}
		if (this.p1 && this.p2) this.started = true;
		this.sendFor(user, 'join', user.name, message);
		return true;
	};

	Battle.prototype.rename = function () {
		for (var i = 0, len = this.players.length; i < len; i++) {
			var player = this.players[i];
			var playerid = this.playerids[i];
			if (!player) continue;
			if (player.userid !== playerid) {
				this.setPlayer(player, i);
				this.sendFor(player, 'rename', player.name, player.avatar);
			}
		}
	};

	Battle.prototype.leave = function (user) {
		for (var i = 0, len = this.players.length; i < len; i++) {
			var player = this.players[i];
			if (player === user) {
				this.sendFor(user, 'leave');
				for (var j = 0; j < user.connections.length; j++) {
					var connection = user.connections[j];
					Sockets.subchannelMove(connection.worker, this.id, '0', connection.socketid);
				}
				this.setPlayer(null, i);
				return true;
			}
		}
		return false;
	};

	Battle.prototype.destroy = function () {
		this.send('dealloc');

		this.players = null;
		this.room = null;
		SimulatorProcess.release(this.process);
		this.process = null;
		delete battles[this.id];
	};

	return Battle;
})();

exports.Battle = Battle;
exports.battles = battles;
exports.SimulatorProcess = SimulatorProcess;

exports.create = function (id, format, rated, room) {
	if (battles[id]) return battles[id];
	return new Battle(id, format, rated, room);
};
