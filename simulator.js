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

'use strict';

let battles = Object.create(null);

let SimulatorProcess = (function () {
	function SimulatorProcess() {
		this.process = require('child_process').fork('battle-engine.js', {cwd: __dirname});
		this.process.on('message', function (message) {
			let lines = message.split('\n');
			let battle = battles[lines[0]];
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
		for (let i = this.processes.length; i < num; ++i) {
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
		let process = this.processes[0];
		for (let i = 1; i < this.processes.length; ++i) {
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

let slice = Array.prototype.slice;

class BattlePlayer {
	constructor(user, game, slot) {
		this.userid = user.userid;
		this.name = user.name;
		this.game = game;
		user.games[this.game.id] = this.game;
		user.updateSearch();

		this.slot = slot;
		this.slotNum = Number(slot.charAt(1)) - 1;
		this.active = true;

		for (let i = 0; i < user.connections.length; i++) {
			let connection = user.connections[i];
			Sockets.subchannelMove(connection.worker, this.game.id, this.slotNum + 1, connection.socketid);
		}
	}
	destroy() {
		if (this.active) this.simSend('leave');
		let user = Users(this.userid);
		if (user) {
			delete user.games[this.game.id];
			user.updateSearch();
			for (let j = 0; j < user.connections.length; j++) {
				let connection = user.connections[j];
				Sockets.subchannelMove(connection.worker, this.game.id, '0', connection.socketid);
			}
		}
		this.game[this.slot] = null;
	}
	updateSubchannel(user) {
		if (!user.connections) {
			// "user" is actually a connection
			Sockets.subchannelMove(user.worker, this.game.id, this.slotNum + 1, user.socketid);
			return;
		}
		for (let i = 0; i < user.connections.length; i++) {
			let connection = user.connections[i];
			Sockets.subchannelMove(connection.worker, this.game.id, this.slotNum + 1, connection.socketid);
		}
	}

	toString() {
		return this.userid;
	}
	send(data) {
		let user = Users(this.userid);
		if (user) user.send(data);
	}
	sendRoom(data) {
		let user = Users(this.userid);
		if (user) user.sendTo(this.game.id, data);
	}
	simSend(action) {
		this.game.send.apply(this.game, [action, this.slot].concat(slice.call(arguments, 1)));
	}
}

class Battle {
	constructor(room, format, rated) {
		if (battles[room.id]) {
			throw new Error("Battle with ID " + room.id + " already exists.");
		}

		this.id = room.id;
		this.room = room;
		this.title = Tools.getFormat(format).name;
		if (!this.title.endsWith(" Battle")) this.title += " Battle";
		this.allowRenames = !rated;

		this.format = toId(format);
		this.rated = rated;
		this.started = false;
		this.ended = false;
		this.active = false;

		this.players = Object.create(null);
		this.playerCount = 0;
		this.playerCap = 2;
		this.p1 = null;
		this.p2 = null;

		this.playerNames = [room.p1.name, room.p2.name];
		this.requests = {};

		// log information
		this.logData = null;
		this.endType = 'normal';

		this.rqid = '';
		this.inactiveQueued = false;

		this.process = SimulatorProcess.acquire();
		this.send('init', this.format, rated ? '1' : '');

		battles[room.id] = this;
	}

	send() {
		this.activeIp = Monitor.activeIp;
		this.process.send('' + this.id + '|' + slice.call(arguments).join('|'));
	}
	sendFor(user, action) {
		let player = this.players[user];
		if (!player) return;

		this.send.apply(this, [action, player.slot].concat(slice.call(arguments, 2)));
	}
	checkActive() {
		let active = true;
		if (this.ended || !this.started) {
			active = false;
		} else if (!this.p1 || !this.p1.active) {
			active = false;
		} else if (!this.p2 || !this.p2.active) {
			active = false;
		}
		Rooms.global.battleCount += (active ? 1 : 0) - (this.active ? 1 : 0);
		this.room.active = active;
		this.active = active;
	}
	choose(user, data) {
		this.sendFor(user, 'choose', data);
	}
	undo(user, data) {
		this.sendFor(user, 'undo', data);
	}
	joinGame(user, team) {
		if (this.playerCount >= 2) {
			user.popup("This battle already has two players.");
			return false;
		}
		if (!user.can('joinbattle', null, this.room)) {
			user.popup("You must be a set as a player to join a battle you didn't start. Ask a player to use /addplayer on you to join this battle.");
			return false;
		}

		if (!this.addPlayer(user, team)) {
			user.popup("Failed to join battle.");
			return false;
		}
		this.room.update();
		this.room.kickInactiveUpdate();
		return true;
	}
	leaveGame(user) {
		if (!user) return false; // ...
		if (this.room.rated || this.room.tour) {
			user.popup("Players can't be swapped out in a " + (this.room.tour ? "tournament" : "rated") + " battle.");
			return false;
		}
		if (!this.removePlayer(user)) {
			user.popup("Failed to leave battle.");
			return false;
		}
		this.room.auth[user.userid] = '+';
		this.room.update();
		this.room.kickInactiveUpdate();
		return true;
	}

	receive(lines) {
		Monitor.activeIp = this.activeIp;
		switch (lines[1]) {
		case 'update':
			this.checkActive();
			this.room.push(lines.slice(2));
			this.room.update();
			if (this.inactiveQueued) {
				this.room.nextInactive();
				this.inactiveQueued = false;
			}
			break;

		case 'winupdate':
			this.room.push(lines.slice(3));
			this.started = true;
			this.inactiveSide = -1;
			if (!this.ended) {
				this.ended = true;
				this.room.win(lines[2]);
				this.removeAllPlayers();
			}
			this.checkActive();
			break;

		case 'sideupdate': {
			let player = this[lines[2]];
			if (player) {
				player.sendRoom(lines[3]);
			}
			break;
		}

		case 'request': {
			let player = this[lines[2]];
			let rqid = lines[3];
			if (player) {
				this.requests[player.slot] = lines[4];
				player.sendRoom('|request|' + lines[4]);
			}
			if (rqid !== this.rqid) {
				this.rqid = rqid;
				this.inactiveQueued = true;
			}
			break;
		}

		case 'log':
			this.logData = JSON.parse(lines[2]);
			break;

		case 'inactiveside':
			this.inactiveSide = parseInt(lines[2]);
			break;

		case 'score':
			this.score = [parseInt(lines[2]), parseInt(lines[3])];
			break;
		}
		Monitor.activeIp = null;
	}

	onConnect(user, connection) {
		// this handles joining a battle in which a user is a participant,
		// where the user has already identified before attempting to join
		// the battle
		let player = this.players[user];
		if (!player) return;
		player.updateSubchannel(connection || user);
		let request = this.requests[player.slot];
		if (request) {
			(connection || user).sendTo(this.id, '|request|' + request);
		}
	}
	onUpdateConnection(user, connection) {
		this.onConnect(user, connection);
	}
	onRename(user, oldid) {
		if (user.userid === oldid) return;
		let player = this.players[oldid];
		if (player) {
			if (!this.allowRenames && user.userid !== oldid) {
				this.forfeit(user, " forfeited by changing their name.");
				return;
			}
			if (!this.players[user]) {
				this.players[user] = player;
				player.userid = user.userid;
				player.name = user.name;
				delete this.players[oldid];
				player.simSend('rename', user.name, user.avatar);
			}
		}
		if (!player && user in this.players) {
			// this handles a user renaming themselves into a user in the
			// battle (e.g. by using /nick)
			this.onConnect(user);
		}
	}
	onJoin(user) {
		let player = this.players[user];
		if (player && !player.active) {
			player.active = true;
			player.simSend('join', user.name, user.avatar);
		}
	}
	onLeave(user) {
		let player = this.players[user];
		if (player && player.active) {
			player.active = false;
			player.simSend('leave');
		}
	}

	win(user) {
		if (!user) {
			this.tie();
			return true;
		}
		let player = this.players[user];
		if (!player) return false;
		player.simSend('win');
	}
	tie() {
		this.send('tie');
	}
	forfeit(user, message, side) {
		if (this.ended || !this.started) return false;

		if (!message) message = ' forfeited.';

		if (side === undefined) {
			if (user in this.players) side = this.players[user].slotNum;
		}
		if (side === undefined) return false;

		let ids = ['p1', 'p2'];
		let otherids = ['p2', 'p1'];

		let name = 'Player ' + (side + 1);
		if (user) {
			name = user.name;
		} else if (this.rated) {
			name = this.rated[ids[side]];
		}

		this.room.add('|-message|' + name + message);
		this.endType = 'forfeit';
		this.send('win', otherids[side]);
		return true;
	}

	addPlayer(user, team) {
		if (user.userid in this.players) return false;
		if (this.playerCount >= this.playerCap) return false;
		let player = this.makePlayer(user, team);
		if (!player) return false;
		this.players[user.userid] = player;
		this.playerCount++;
		this.room.auth[user.userid] = '\u2605';
		if (this.playerCount >= 2) {
			this.room.title = "" + this.p1.name + " vs. " + this.p2.name;
			this.room.send('|title|' + this.room.title);
		}
		return true;
	}

	makePlayer(user, team) {
		let slotNum = 0;
		while (this['p' + (slotNum + 1)]) slotNum++;
		let slot = 'p' + (slotNum + 1);
		// console.log('joining: ' + user.name + ' ' + slot);

		let player = new BattlePlayer(user, this, slot);
		this[slot] = player;

		let message = '' + user.avatar;
		if (!this.started) {
			message += "\n" + team;
		}
		player.simSend('join', user.name, message);
		if (this.p1 && this.p2) this.started = true;
		return player;
	}

	removePlayer(user) {
		if (!this.allowRenames) return false;
		if (!(user.userid in this.players)) return false;
		this.players[user.userid].destroy();
		delete this.players[user.userid];
		this.playerCount--;
		return true;
	}

	removeAllPlayers() {
		for (let i in this.players) {
			this.players[i].destroy();
			delete this.players[i];
			this.playerCount--;
		}
	}

	destroy() {
		this.send('dealloc');
		if (this.active) {
			Rooms.global.battleCount += -1;
			this.active = false;
		}

		for (let i in this.players) {
			this.players[i].destroy();
		}
		this.players = null;
		this.room = null;
		SimulatorProcess.release(this.process);
		this.process = null;
		delete battles[this.id];
	}
}

exports.BattlePlayer = BattlePlayer;
exports.Battle = Battle;
exports.battles = battles;
exports.SimulatorProcess = SimulatorProcess;

exports.create = function (id, format, rated, room) {
	if (battles[id]) return battles[id];
	return new Battle(room, format, rated);
};
