/**
 * Room Battle
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This file wraps the simulator in an implementation of the RoomGame
 * interface. It also abstracts away the multi-process nature of the
 * simulator.
 *
 * For the actual battle simulation, see sim/
 *
 * @license MIT license
 */

'use strict';

/** 10 seconds */
const TICK_TIME = 10 * 1000;

// Timer constants: In seconds, should be multiple of ten
const STARTING_TIME = 210;
const MAX_TURN_TIME = 150;
const STARTING_TIME_CHALLENGE = 280;
const MAX_TURN_TIME_CHALLENGE = 300;

const NOT_DISCONNECTED = 10;
const DISCONNECTION_TICKS = 7;

// time after a player disabling the timer before they can re-enable it
const TIMER_COOLDOWN = 20 * 1000;

global.Config = require('./config/config');

const ProcessManager = require('./process-manager');

class SimulatorManager extends ProcessManager {
	onMessageUpstream(message) {
		let lines = message.split('\n');
		let battle = this.pendingTasks.get(lines[0]);
		if (battle) battle.receive(lines);
	}

	eval(code) {
		for (let process of this.processes) {
			process.send(`|eval|${code}`);
		}
	}
}

const SimulatorProcess = new SimulatorManager({
	execFile: __filename,
	maxProcesses: global.Config ? Config.simulatorprocesses : 1,
	isChatBased: false,
});

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
			for (let j = 0; j < user.connections.length; j++) {
				let connection = user.connections[j];
				Sockets.subchannelMove(connection.worker, this.game.id, '0', connection.socketid);
			}
			user.games.delete(this.game.id);
			user.updateSearch();
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
	simSend(action, ...rest) {
		this.game.send(action, this.slot, ...rest);
	}
}

class BattleTimer {
	constructor(battle) {
		/** @type {Battle} */
		this.battle = battle;

		/** @type {?NodeJS.Timer} */
		this.timer = undefined;
		/** @type {Set<string>} */
		this.timerRequesters = new Set();
		/**
		 * Overall timer.
		 * Starts at 21 per player (210 seconds) in a ladder battle. Goes
		 * down by 1 every tick (10 seconds). Goes up by 1 every request (2
		 * if below 15). The player loses if this reaches 0.
		 * @type {[number]}
		 */
		this.ticksLeft = [];
		/**
		 * Turn timer.
		 * Set equal to the player's overall timer, but capped at 15 in a
		 * ladder battle. Goes down by 1 every tick. Tracked separately from
		 * the overall timer, and the player also loses if this reaches 0.
		 * @type {[number]}
		 */
		this.turnTicksLeft = [];
		/**
		 * Disconnect timer.
		 * Normally 7 while the player is connected. If the player
		 * disconnects, this will go down by 1 every tick. If the player
		 * reconnects, this will reset to 7. Tracked separately from the
		 * overall timer, and the player also loses if this reaches 0.
		 * @type {[number]}
		 */
		this.dcTicksLeft = [];

		/**
		 * Last tick.
		 * Represents the last time a tick happened.
		 */
		this.lastTick = 0;

		this.lastDisabledTime = 0;
		this.lastDisabledByUser = null;

		const hasLongTurns = Dex.getFormat(battle.format).gameType !== 'singles';
		const isChallenge = (!battle.rated && !battle.room.tour);
		this.settings = Object.assign({}, Dex.getFormat(battle.format).timer);
		if (this.settings.perTurn === undefined) {
			this.settings.perTurn = hasLongTurns ? 20 : 10;
		}
		if (this.settings.starting === undefined) {
			this.settings.starting = isChallenge ? STARTING_TIME_CHALLENGE : STARTING_TIME;
		}
		if (this.settings.maxPerTurn === undefined) {
			this.settings.maxPerTurn = isChallenge ? MAX_TURN_TIME_CHALLENGE : MAX_TURN_TIME;
		}
		if (this.settings.maxPerTurn <= 0) this.settings.maxPerTurn = Infinity;
		this.settings.perTurnTicks = Math.floor(this.settings.perTurn / 10);
		this.settings.startingTicks = Math.ceil(this.settings.starting / 10);
		this.settings.maxPerTurnTicks = Math.ceil(this.settings.maxPerTurn / 10);
		this.settings.maxFirstTurnTicks = Math.ceil((this.settings.maxFirstTurn || 0) / 10);

		for (let slotNum = 0; slotNum < 2; slotNum++) {
			this.ticksLeft.push(this.settings.startingTicks);
			this.turnTicksLeft.push(-1);
			this.dcTicksLeft.push(10);
		}
	}
	start(requester) {
		let userid = requester ? requester.userid : 'staff';
		if (this.timerRequesters.has(userid)) return false;
		if (this.timer && requester) {
			this.battle.room.add(`|inactive|${requester.name} also wants the timer to be on.`).update();
			this.timerRequesters.add(userid);
			return false;
		}
		if (requester && this.battle.players[requester.userid] && this.lastDisabledByUser === requester.userid) {
			const remainingCooldownTime = (this.lastDisabledTime || 0) + TIMER_COOLDOWN - Date.now();
			if (remainingCooldownTime > 0) {
				this.battle.players[requester.userid].sendRoom(`|inactiveoff|The timer can't be re-enabled so soon after disabling it (${Math.ceil(remainingCooldownTime / 1000)} seconds remaining).`);
				return false;
			}
		}
		this.timerRequesters.add(userid);
		this.nextRequest(true);
		const requestedBy = requester ? ` (requested by ${requester.name})` : ``;
		this.battle.room.add(`|inactive|Battle timer is ON: inactive players will automatically lose when time's up.${requestedBy}`).update();
		return true;
	}
	stop(requester) {
		if (requester) {
			if (!this.timerRequesters.has(requester.userid)) return false;
			this.timerRequesters.delete(requester.userid);
			this.lastDisabledByUser = requester.userid;
			this.lastDisabledTime = Date.now();
		} else {
			this.timerRequesters.clear();
		}
		if (this.timerRequesters.size) {
			this.battle.room.add(`|inactive|${requester.name} no longer wants the timer on, but the timer is staying on because ${[...this.timerRequesters].join(', ')} still does.`).update();
			return false;
		}
		if (!this.timer) return false;
		clearTimeout(this.timer);
		this.timer = undefined;
		this.battle.room.add(`|inactiveoff|Battle timer is now OFF.`).update();
		return true;
	}
	waitingForChoice(slot) {
		return !this.battle.requests[slot][2];
	}
	nextRequest(isFirst) {
		if (this.timer) clearTimeout(this.timer);
		if (!this.timerRequesters.size) return;
		const maxTurnTicks = (isFirst ? this.settings.maxFirstTurnTicks : 0) || this.settings.maxPerTurnTicks;
		for (const slotNum of this.ticksLeft.keys()) {
			const slot = 'p' + (slotNum + 1);
			const player = this.battle[slot];

			this.ticksLeft[slotNum] += this.settings.perTurnTicks;
			this.turnTicksLeft[slotNum] = Math.min(this.ticksLeft[slotNum], maxTurnTicks);

			const ticksLeft = this.turnTicksLeft[slotNum];
			if (player) player.sendRoom(`|inactive|Time left: ${ticksLeft * 10} sec this turn | ${this.ticksLeft[slotNum] * 10} sec total`);
		}
		this.timer = setTimeout(() => this.nextTick(), TICK_TIME);
	}
	nextTick() {
		if (this.timer) clearTimeout(this.timer);
		if (this.battle.ended) return;
		for (const slotNum of this.ticksLeft.keys()) {
			const slot = 'p' + (slotNum + 1);

			if (!this.waitingForChoice(slot)) continue;
			this.ticksLeft[slotNum]--;
			this.turnTicksLeft[slotNum]--;

			if (this.dcTicksLeft[slotNum] !== NOT_DISCONNECTED) {
				this.dcTicksLeft[slotNum]--;
			}

			let dcTicksLeft = this.dcTicksLeft[slotNum];
			if (dcTicksLeft <= 0) this.turnTicksLeft[slotNum] = 0;
			const ticksLeft = this.turnTicksLeft[slotNum];
			if (!ticksLeft) continue;
			if (ticksLeft < dcTicksLeft) dcTicksLeft = NOT_DISCONNECTED; // turn timer supersedes dc timer

			if (dcTicksLeft <= 4) {
				this.battle.room.add(`|inactive|${this.battle.playerNames[slotNum]} has ${dcTicksLeft * 10} seconds to reconnect!`).update();
			}
			if (dcTicksLeft !== NOT_DISCONNECTED) continue;
			if (ticksLeft % 3 === 0 || ticksLeft <= 4) {
				this.battle.room.add(`|inactive|${this.battle.playerNames[slotNum]} has ${ticksLeft * 10} seconds left.`).update();
			}
		}
		if (!this.checkTimeout()) {
			this.timer = setTimeout(() => this.nextTick(), TICK_TIME);
		}
	}
	checkActivity() {
		for (const slotNum of this.ticksLeft.keys()) {
			const slot = 'p' + (slotNum + 1);
			const player = this.battle[slot];
			const isConnected = player && player.active;

			if (isConnected === (this.dcTicksLeft[slotNum] !== NOT_DISCONNECTED)) continue;

			if (!isConnected) {
				// player has disconnected: don't wait longer than 6 ticks (1 minute)
				this.dcTicksLeft[slotNum] = DISCONNECTION_TICKS;
				if (this.timerRequesters.size) {
					this.battle.room.add(`|inactive|${this.battle.playerNames[slotNum]} disconnected and has a minute to reconnect!`).update();
				}
			} else {
				// player has reconnected
				this.dcTicksLeft[slotNum] = NOT_DISCONNECTED;
				if (this.timerRequesters.size) {
					let timeLeft = ``;
					if (this.waitingForChoice(slot)) {
						const ticksLeft = this.turnTicksLeft[slotNum];
						timeLeft = ` and has ${ticksLeft * 10} seconds left`;
					}
					this.battle.room.add(`|inactive|${this.battle.playerNames[slotNum]} reconnected${timeLeft}.`).update();
				}
			}
		}
	}
	checkTimeout() {
		if (this.turnTicksLeft.every(c => !c)) {
			if (!this.settings.timeoutAutoChoose || this.ticksLeft.every(c => !c)) {
				this.battle.room.add(`|-message|All players are inactive.`).update();
				this.battle.tie();
				return true;
			}
		}
		let didSomething = false;
		for (const [slotNum, ticks] of this.turnTicksLeft.entries()) {
			if (ticks) continue;
			if (this.settings.timeoutAutoChoose && this.ticksLeft[slotNum]) {
				const slot = 'p' + (slotNum + 1);
				this.battle.send('choose', slot, 'default');
				didSomething = true;
			} else {
				this.battle.forfeit(null, ' lost due to inactivity.', slotNum);
				return true;
			}
		}
		return didSomething;
	}
}

class Battle {
	constructor(room, formatid, rated) {
		let format = Dex.getFormat(formatid);
		this.id = room.id;
		this.room = room;
		this.title = format.name;
		if (!this.title.endsWith(" Battle")) this.title += " Battle";
		this.allowRenames = !rated;

		this.format = formatid;
		this.rated = rated;
		this.started = false;
		this.ended = false;
		this.active = false;

		this.players = Object.create(null);
		this.playerCount = 0;
		this.playerCap = 2;
		this.p1 = null;
		this.p2 = null;

		this.playerNames = ["Player 1", "Player 2"];
		/** {playerid: [rqid, request, isWait, choice]} */
		this.requests = {
			p1: [0, '', 'cantUndo', ''],
			p2: [0, '', 'cantUndo', ''],
		};
		this.timer = new BattleTimer(this);

		// data to be logged
		this.logData = null;
		this.endType = 'normal';

		this.rqid = 1;

		this.process = SimulatorProcess.acquire();
		if (this.process.pendingTasks.has(room.id)) {
			throw new Error(`Battle with ID ${room.id} already exists.`);
		}

		this.send('init', this.format, rated ? '1' : '');
		this.process.pendingTasks.set(room.id, this);
	}

	send(...args) {
		this.activeIp = Monitor.activeIp;
		this.process.send(`${this.id}|${args.join('|')}`);
	}
	sendFor(user, action, ...rest) {
		let player = this.players[user];
		if (!player) return;

		this.send(action, player.slot, ...rest);
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
		if (Rooms.global.battleCount === 0) Rooms.global.automaticKillRequest();
	}
	choose(user, data) {
		const player = this.players[user];
		const [choice, rqid] = data.split('|', 2);
		if (!player) return;
		let request = this.requests[player.slot];
		if (request[2] !== false && request[2] !== true) {
			player.sendRoom(`|error|[Invalid choice] There's nothing to choose`);
			return;
		}
		if ((this.requests.p1[2] && this.requests.p2[2]) || // too late
			(rqid && rqid !== '' + request[0])) { // WAY too late
			player.sendRoom(`|error|[Invalid choice] Sorry, too late to make a different move; the next turn has already started`);
			return;
		}
		request[2] = true;
		request[3] = choice;

		this.sendFor(user, 'choose', choice);
	}
	undo(user, data) {
		const player = this.players[user];
		const [, rqid] = data.split('|', 2);
		if (!player) return;
		let request = this.requests[player.slot];
		if (request[2] !== true) {
			player.sendRoom(`|error|[Invalid choice] There's nothing to cancel`);
			return;
		}
		if ((this.requests.p1[2] && this.requests.p2[2]) || // too late
			(rqid && rqid !== '' + request[0])) { // WAY too late
			player.sendRoom(`|error|[Invalid choice] Sorry, too late to cancel; the next turn has already started`);
			return;
		}
		request[2] = false;

		this.sendFor(user, 'undo');
	}
	joinGame(user, team) {
		if (this.playerCount >= 2) {
			user.popup(`This battle already has two players.`);
			return false;
		}
		if (!user.can('joinbattle', null, this.room)) {
			user.popup(`You must be a set as a player to join a battle you didn't start. Ask a player to use /addplayer on you to join this battle.`);
			return false;
		}

		if (!this.addPlayer(user, team)) {
			user.popup(`Failed to join battle.`);
			return false;
		}
		this.room.update();
		return true;
	}
	leaveGame(user) {
		if (!user) return false; // ...
		if (this.room.rated || this.room.tour) {
			user.popup(`Players can't be swapped out in a ${this.room.tour ? "tournament" : "rated"} battle.`);
			return false;
		}
		if (!this.removePlayer(user)) {
			user.popup(`Failed to leave battle.`);
			return false;
		}
		this.room.auth[user.userid] = '+';
		this.room.update();
		return true;
	}

	receive(lines) {
		Monitor.activeIp = this.activeIp;
		switch (lines[1]) {
		case 'update':
			this.checkActive();
			this.room.push(lines.slice(2));
			this.room.update();
			this.timer.nextRequest();
			break;

		case 'winupdate':
			this.room.push(lines.slice(3));
			this.started = true;
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
				if (lines[3].startsWith(`|error|[Invalid choice] Can't do anything`)) {
					// ... should not happen
				} else if (lines[3].startsWith(`|error|[Invalid choice]`)) {
					let request = this.requests[player.slot];
					request[2] = false;
					request[3] = '';
				}
			}
			break;
		}

		case 'request': {
			let player = this[lines[2]];

			this.rqid++;
			if (player) {
				let request = JSON.parse(lines[3]);
				request.rqid = this.rqid;
				const requestJSON = JSON.stringify(request);
				this.requests[player.slot] = [this.rqid, requestJSON, request.wait ? 'cantUndo' : false, ''];
				player.sendRoom(`|request|${requestJSON}`);
			}
			break;
		}

		case 'log':
			this.logData = JSON.parse(lines[2]);
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
		const player = this.players[user];
		if (!player) return;
		player.updateSubchannel(connection || user);
		const request = this.requests[player.slot];
		if (request) {
			let data = `|request|${request[1]}`;
			if (request[3]) data += `\n|sentchoice|${request[3]}`;
			(connection || user).sendTo(this.id, data);
		}
	}
	onUpdateConnection(user, connection) {
		this.onConnect(user, connection);
	}
	onRename(user, oldUserid, isJoining, isForceRenamed) {
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
			if (player) {
				const message = isForceRenamed ? " lost by having an inappropriate name." : " forfeited by changing their name.";
				this.forfeit(null, message, player.slotNum);
			}
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
		player.simSend('join', user.name, user.avatar);
	}
	onJoin(user) {
		let player = this.players[user];
		if (player && !player.active) {
			player.active = true;
			this.timer.checkActivity();
			this.room.add(`|player|${player.slot}|${user.name}|${user.avatar}`);
		}
	}
	onLeave(user) {
		let player = this.players[user];
		if (player && player.active) {
			player.sendRoom(`|request|null`);
			player.active = false;
			this.timer.checkActivity();
			this.room.add(`|player|${player.slot}|`);
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
			if (!this.players) {
				// should never happen
				console.log("user is: " + user.name);
				console.log("  alts: " + Object.keys(user.prevNames));
				console.log("  battle: " + this.id);
				return false;
			}
			if (user in this.players) side = this.players[user].slotNum;
		}
		if (side === undefined) return false;

		let name = this.playerNames[side];

		this.room.add(`|-message|${name}${message}`);
		this.endType = 'forfeit';
		const otherids = ['p2', 'p1'];
		this.send('win', otherids[side]);
		return true;
	}

	addPlayer(user, team) {
		if (user.userid in this.players) return false;
		if (this.playerCount >= this.playerCap) return false;
		let player = this.makePlayer(user, team);
		if (!player) return false;
		this.players[user.userid] = player;
		this.playerNames[this.playerCount] = player.name;
		this.playerCount++;
		this.room.auth[user.userid] = '\u2606';
		if (this.playerCount >= 2) {
			this.room.title = `${this.p1.name} vs. ${this.p2.name}`;
			this.room.send(`|title|${this.room.title}`);
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
		let player = this.players[user.userid];
		if (!player) return false;
		if (player.active) {
			this.room.add(`|player|${player.slot}|`);
		}
		player.destroy();
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

exports.RoomBattlePlayer = BattlePlayer;
exports.RoomBattleTimer = BattleTimer;
exports.RoomBattle = Battle;
exports.SimulatorManager = SimulatorManager;
exports.SimulatorProcess = SimulatorProcess;

if (process.send && module === process.mainModule) {
	// This is a child process!

	global.Chat = require('./chat');
	const Sim = require('./sim');
	global.Dex = require('./sim/dex');
	global.toId = Dex.getId;

	if (Config.crashguard) {
		// graceful crash - allow current battles to finish before restarting
		process.on('uncaughtException', err => {
			require('./crashlogger')(err, 'A simulator process');
		});
	}

	require('./repl').start(`sim-${process.pid}`, cmd => eval(cmd));

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
					const battle = Sim.construct(data[2], data[3], sendBattleMessage);
					battle.id = id;
					Battles.set(id, battle);
				} catch (err) {
					if (require('./crashlogger')(err, 'A battle', {
						message: message,
					}) === 'lockdown') {
						let ministack = Chat.escapeHTML(err.stack).split("\n").slice(0, 2).join("<br />");
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
