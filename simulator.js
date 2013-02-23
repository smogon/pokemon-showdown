
var simulators = {};
var processes = (function(fork, num) {
	var ret = [];
	for (var i = 0; i < num; ++i) {
		ret.push((function() {
			var process = fork('battles.js');
			process.on('message', function(message) {
				var lines = message.split('\n');
				var sim = simulators[lines[0]];
				if (sim) {
					sim.receive(lines);
				}
			});
			return {
				load: 0,
				send: function(data) {
					process.send(data);
				}
			};
		})());
		console.log('NEW SIMULATOR PROCESS: ' + i);
	}
	return ret;
})(require('child_process').fork, config.simulatorprocesses || 1);

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

		this.process = (function() {
			var process = processes[0];
			for (var i = 1; i < processes.length; ++i) {
				if (processes[i].load < process.load) {
					process = processes[i];
				}
			}
			++process.load;
			return process;
		})();

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
	Simulator.prototype.send = function() {
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

		case 'request':
			var player = this.getPlayer(lines[2]);
			var rqid = lines[3];
			if (player) {
				this.requests[player.userid] = lines[4];
				player.emit('update', JSON.parse(lines[4]));
			}
			if (rqid !== this.rqid) {
				this.rqid = rqid;
				this.inactiveQueued = true;
			}
			break;

		case 'resendrequest':
			var player = this.getPlayer(lines[2]);
			this.resendRequest(player);
			break;

		case 'log':
			this.logData = JSON.parse(lines[2]);
			break;

		case 'inactiveside':
			this.inactiveSide = parseInt(lines[2], 10);
			break;
		}
	};

	Simulator.prototype.resendRequest = function(user) {
		// The !user condition can occur. Do not remove this check.
		if (!user) return;
		user.emit('update', JSON.parse(this.requests[user.userid]));
		user.sendTo(this.id, '|callback|decision');
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

	Simulator.prototype.setPlayer = function(user, slot) {
		if (this.players[slot]) {
			delete this.players[slot].battles[this.id];
		}
		if (user) {
			user.battles[this.id] = true;
		}
		this.players[slot] = (user || null);
		this.playerids[slot] = (user ? user.userid : null);
		this.playerTable = {};
		this.requests = {};
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
		console.log('joining: '+user.name+' '+slot);
		if (this.players[slot] || slot >= this.players.length) return false;

		this.setPlayer(user, slot);

		var teamMessage = '';
		if (!this.started) {
			teamMessage = "\n"+JSON.stringify(team);
		}
		if (this.p1 && this.p2) this.started = true;
		this.sendFor(user, 'join', user.name, user.avatar+teamMessage);
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
		--this.process.load;
		delete simulators[this.id];
	};

	return Simulator;
})();

exports.Simulator = Simulator;
exports.simulators = simulators;
// `processes` is not used outside this file, but it might be useful to be
// able to access it using the dev console.
exports.processes = processes;

exports.create = function(id, format, rated, room) {
	if (simulators[id]) return simulators[id];
	return new Simulator(id, format, rated, room);
}

// Evaluate code in every simulator process.
exports.eval = function(code) {
	processes.forEach(function(process) {
		process.send('|eval|' + code);
	});
}
