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

var simulators = {};

var SimulatorProcess = (function() {
	function SimulatorProcess() {
		this.process = require('child_process').fork('battle-engine.js');
		this.process.on('message', function(message) {
			var lines = message.split('\n');
			var sim = simulators[lines[0]];
			if (sim) {
				sim.receive(lines);
			}
		});
		this.send = this.process.send.bind(this.process);
	}
	SimulatorProcess.prototype.load = 0;
	SimulatorProcess.prototype.active = true;
	SimulatorProcess.processes = [];
	SimulatorProcess.spawn = function() {
		var num = config.simulatorprocesses || 1;
		for (var i = 0; i < num; ++i) {
			this.processes.push(new SimulatorProcess());
		}
	};
	SimulatorProcess.respawn = function() {
		this.processes.splice(0).forEach(function(process) {
			process.active = false;
			if (!process.load) process.process.disconnect();
		});
		this.spawn();
	};
	SimulatorProcess.acquire = function() {
		var process = this.processes[0];
		for (var i = 1; i < this.processes.length; ++i) {
			if (this.processes[i].load < process.load) {
				process = this.processes[i];
			}
		}
		++process.load;
		return process;
	};
	SimulatorProcess.release = function(process) {
		--process.load;
		if (!process.load && !process.active) {
			process.process.disconnect();
		}
	};
	SimulatorProcess.eval = function(code) {
		this.processes.forEach(function(process) {
			process.send('|eval|' + code);
		});
	};
	return SimulatorProcess;
})();

// Create the initial set of simulator processes.
SimulatorProcess.spawn();

var slice = Array.prototype.slice;

var Simulator = (function(){
	function Simulator(id, format, rated, room) {
		if (simulators[id]) {
			// ???
			return;
		}

		this.id = id;
		this.room = room;
		this.format = toId(format);
		this.players = [null, null];
		this.playerids = [null, null];
		this.playerTable = {};
		this.requests = {};

		this.process = SimulatorProcess.acquire();

		simulators[id] = this;

		this.send('init', this.format, rated?'1':'');
	}

	Simulator.prototype.id = '';

	Simulator.prototype.started = false;
	Simulator.prototype.ended = false;
	Simulator.prototype.active = true;
	Simulator.prototype.players = null;
	Simulator.prototype.playerids = null;
	Simulator.prototype.playerTable = null;
	Simulator.prototype.format = null;
	Simulator.prototype.room = null;

	Simulator.prototype.requests = null;

	// log information
	Simulator.prototype.logData = null;
	Simulator.prototype.endType = 'normal';

	Simulator.prototype.getFormat = function() {
		return Tools.getFormat(this.format);
	};
	Simulator.prototype.lastIp = null;
	Simulator.prototype.send = function() {
		this.activeIp = ResourceMonitor.activeIp;
		this.process.send(''+this.id+'|'+slice.call(arguments).join('|'));
	};
	Simulator.prototype.sendFor = function(user, action) {
		var player = this.playerTable[toUserid(user)];
		if (!player) {
			console.log('SENDFOR FAILED: Player doesn\'t exist: '+user.name)
			return;
		}

		this.send.apply(this, [action, player].concat(slice.call(arguments, 2)));
	};
	Simulator.prototype.sendForOther = function(user, action) {
		var opposite = {'p1':'p2', 'p2':'p1'}
		var player = this.playerTable[toUserid(user)];
		if (!player) return;

		this.send.apply(this, [action, opposite[player]].concat(slice.call(arguments, 2)));
	};

	Simulator.prototype.rqid = '';
	Simulator.prototype.inactiveQueued = false;
	Simulator.prototype.receive = function(lines) {
		ResourceMonitor.activeIp = this.activeIp;
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

		case 'callback':
			var player = this.getPlayer(lines[2]);
			if (player) {
				player.sendTo(this.id, '|callback|' + lines[3]);
			}
			break;

		case 'request':
			var player = this.getPlayer(lines[2]);
			var rqid = lines[3];
			if (player) {
				this.requests[player.userid] = lines[4];
				player.sendTo(this.id, '|request|'+lines[4]);
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
		}
		ResourceMonitor.activeIp = null;
	};

	Simulator.prototype.resendRequest = function(user) {
		if (this.requests[user.userid]) {
			user.sendTo(this.id, '|request|'+this.requests[user.userid]);
		}
	};
	Simulator.prototype.win = function(user) {
		if (!user) {
			this.tie();
			return;
		}
		this.sendFor(user, 'win');
	};
	Simulator.prototype.lose = function(user) {
		this.sendForOther(user, 'win');
	};
	Simulator.prototype.tie = function() {
		this.send('tie');
	};
	Simulator.prototype.chat = function(user, message) {
		this.send('chat', user.name+"\n"+message);
	};

	Simulator.prototype.isEmpty = function() {
		if (this.p1) return false;
		if (this.p2) return false;
		return true;
	};

	Simulator.prototype.isFull = function() {
		if (this.p1 && this.p2) return true;
		return false;
	};

	Simulator.prototype.setPlayer = function(user, slot) {
		if (this.players[slot]) {
			delete this.players[slot].battles[this.id];
		}
		if (user) {
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
		for (var i=0, len=this.players.length; i<len; i++) {
			var player = this.players[i];
			this['p'+(i+1)] = player?player.name:'';
			if (!player) {
				this.active = false;
				continue;
			}
			this.playerTable[player.userid] = 'p'+(i+1);
		}
	};
	Simulator.prototype.getPlayer = function(slot) {
		if (typeof slot === 'string') {
			if (slot.substr(0,1) === 'p') {
				slot = parseInt(slot.substr(1),10)-1;
			} else {
				slot = parseInt(slot, 10);
			}
		}
		return this.players[slot];
	};
	Simulator.prototype.getSlot = function(player) {
		return this.players.indexOf(player);
	};

	Simulator.prototype.join = function(user, slot, team) {
		if (slot === undefined) {
			slot = 0;
			while (this.players[slot]) slot++;
		}
		// console.log('joining: '+user.name+' '+slot);
		if (this.players[slot] || slot >= this.players.length) return false;

		this.setPlayer(user, slot);

		var message = ''+user.avatar;
		if (!this.started) {
			message += "\n"+team;
		}
		if (this.p1 && this.p2) this.started = true;
		this.sendFor(user, 'join', user.name, message);
		return true;
	};

	Simulator.prototype.rename = function() {
		for (var i=0, len=this.players.length; i<len; i++) {
			var player = this.players[i];
			var playerid = this.playerids[i];
			if (!player) continue;
			if (player.userid !== playerid) {
				this.setPlayer(player, i);
				this.sendFor(player, 'rename', player.name, player.avatar);
			}
		}
	};

	Simulator.prototype.leave = function(user) {
		for (var i=0, len=this.players.length; i<len; i++) {
			var player = this.players[i];
			if (player === user) {
				this.sendFor(user, 'leave');
				this.setPlayer(null, i);
				return true;
			}
		}
		return false;
	};

	Simulator.prototype.destroy = function() {
		this.send('dealloc');

		this.players = null;
		this.room = null;
		SimulatorProcess.release(this.process);
		this.process = null;
		delete simulators[this.id];
	};

	return Simulator;
})();

exports.Simulator = Simulator;
exports.simulators = simulators;
exports.SimulatorProcess = SimulatorProcess;

exports.create = function(id, format, rated, room) {
	if (simulators[id]) return simulators[id];
	return new Simulator(id, format, rated, room);
};
