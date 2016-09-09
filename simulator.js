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

global.Config = require('./config/config');

const ProcessManager = require('./process-manager');
const BattleEngine = require('./battle-engine').Battle;

class SimulatorManager extends ProcessManager {
	onMessageUpstream(message) {
		let lines = message.split('\n');
		let battle = this.pendingTasks.get(lines[0]);
		if (battle) battle.receive(lines);
	}

	eval(code) {
		for (let process of this.processes) {
			process.send('|eval|' + code);
		}
	}
}

const SimulatorProcess = new SimulatorManager({
	execFile: __filename,
	maxProcesses: global.Config ? Config.simulatorprocesses : 1,
	isChatBased: false,
});

let slice = Array.prototype.slice;

class BattlePlayer {
	constructor(user, game, slot) {
		this.userid = user.userid;
		this.name = user.name;
		this.game = game;
		user.games.add(this.game.id);
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
			user.games.delete(this.game.id);
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
		if (this.process.pendingTasks.has(room.id)) {
			throw new Error("Battle with ID " + room.id + " already exists.");
		}

		this.send('init', this.format, rated ? '1' : '');
		this.process.pendingTasks.set(room.id, this);
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

			if (rqid !== this.rqid) {
				this.rqid = rqid;
				this.inactiveQueued = true;
			}
			if (player) {
				const isNewRequest = !this.requests[player.slot] || +this.requests[player.slot][0] < +rqid;
				if (isNewRequest) {
					player.choiceIndex = 0;
				}
				this.requests[player.slot] = [rqid, lines[4]];
				player.sendRoom('|request|' + (player.choiceIndex ? player.choiceIndex + '|' + player.choiceData + '\n' : '') + lines[4]);
			}
			break;
		}

		case 'choice': {
			let player = this[lines[2]];
			let rqid = lines[3];
			let choiceIndex = +lines[4];
			let choiceData = lines[5];
			if (rqid === this.rqid && player) {
				player.choiceIndex = choiceIndex;
				player.choiceData = choiceData;
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
			(connection || user).sendTo(this.id, '|request|' + (player.choiceIndex ? player.choiceIndex + '|' + player.choiceData + '\n' : '') + request[1]);
		}
	}
	onUpdateConnection(user, connection) {
		this.onConnect(user, connection);
	}
	onRename(user, oldUserid) {
		if (user.userid === oldUserid) return;
		if (!this.players) {
			// !! should never happen but somehow still does
			user.games.delete(this.id);
			return;
		}
		if (!(oldUserid in this.players)) {
			if (user.userid in this.players) {
				// this handles a user renaming themselves into a user in the
				// battle (e.g. by using /nick)
				this.onConnect(user);
			}
			return;
		}
		if (!this.allowRenames) {
			let player = this.players[oldUserid];
			if (player) this.forfeit(null, " forfeited by changing their name.", player.slotNum);
			if (!(user.userid in this.players)) {
				user.games.delete(this.id);
			}
			return;
		}
		if (user.userid in this.players) return;
		let player = this.players[oldUserid];
		this.players[user.userid] = player;
		player.userid = user.userid;
		player.name = user.name;
		delete this.players[oldUserid];
		player.simSend('rename', user.name, user.avatar);
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
		if (this[ids[side]]) {
			name = this[ids[side]].name;
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
		this.process.pendingTasks.delete(this.id);
		this.process.release();
		this.process = null;
	}
}

exports.BattlePlayer = BattlePlayer;
exports.Battle = Battle;
exports.SimulatorManager = SimulatorManager;
exports.SimulatorProcess = SimulatorProcess;

exports.create = function (id, format, rated, room) {
	return new Battle(room, format, rated);
};

if (process.send && module === process.mainModule) {
	// This is a child process!

	global.Tools = require('./tools').includeMods();
	global.toId = Tools.getId;

	if (Config.crashguard) {
		// graceful crash - allow current battles to finish before restarting
		process.on('uncaughtException', err => {
			require('./crashlogger')(err, 'A simulator process');
		});
	}

	require('./repl').start('battle-engine-', process.pid, cmd => eval(cmd));

	let Battles = new Map();

	// Receive and process a message sent using Simulator.prototype.send in
	// another process.
	process.on('message', message => {
		//console.log('CHILD MESSAGE RECV: "' + message + '"');
		let nlIndex = message.indexOf("\n");
		let more = '';
		if (nlIndex > 0) {
			more = message.substr(nlIndex + 1);
			message = message.substr(0, nlIndex);
		}
		let data = message.split('|');
		if (data[1] === 'init') {
			const id = data[0];
			if (!Battles.has(id)) {
				try {
					Battles.set(id, BattleEngine.construct(id, data[2], data[3], sendBattleMessage));
				} catch (err) {
					if (require('./crashlogger')(err, 'A battle', {
						message: message,
					}) === 'lockdown') {
						let ministack = Tools.escapeHTML(err.stack).split("\n").slice(0, 2).join("<br />");
						process.send(id + '\nupdate\n|html|<div class="broadcast-red"><b>A BATTLE PROCESS HAS CRASHED:</b> ' + ministack + '</div>');
					} else {
						process.send(id + '\nupdate\n|html|<div class="broadcast-red"><b>The battle crashed!</b><br />Don\'t worry, we\'re working on fixing it.</div>');
					}
				}
			}
		} else if (data[1] === 'dealloc') {
			const id = data[0];
			if (Battles.has(id)) {
				Battles.get(id).destroy();

				// remove from battle list
				Battles.delete(id);
			} else {
				require('./crashlogger')(new Error("Invalid dealloc"), 'A battle', {
					message: message,
				});
			}
		} else {
			let battle = Battles.get(data[0]);
			if (battle) {
				let prevRequest = battle.currentRequest;
				let prevRequestDetails = battle.currentRequestDetails || '';
				try {
					battle.receive(data, more);
				} catch (err) {
					require('./crashlogger')(err, 'A battle', {
						message: message,
						currentRequest: prevRequest,
						log: '\n' + battle.log.join('\n').replace(/\n\|split\n[^\n]*\n[^\n]*\n[^\n]*\n/g, '\n'),
					});

					let logPos = battle.log.length;
					battle.add('html', '<div class="broadcast-red"><b>The battle crashed</b><br />You can keep playing but it might crash again.</div>');
					let nestedError;
					try {
						battle.makeRequest(prevRequest, prevRequestDetails);
					} catch (e) {
						nestedError = e;
					}
					battle.sendUpdates(logPos);
					if (nestedError) {
						throw nestedError;
					}
				}
			} else if (data[1] === 'eval') {
				try {
					eval(data[2]);
				} catch (e) {}
			}
		}
	});

	process.on('disconnect', () => {
		process.exit();
	});
} else {
	// Create the initial set of simulator processes.
	SimulatorProcess.spawn();
}

// Messages sent by this function are received and handled in
// Battle.prototype.receive in simulator.js (in another process).
function sendBattleMessage(type, data) {
	if (Array.isArray(data)) data = data.join("\n");
	process.send(this.id + "\n" + type + "\n" + data);
}
