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
 * @license MIT
 */

'use strict';

const FS = require('./lib/fs');

/** 5 seconds */
const TICK_TIME = 5;

// Timer constants: In seconds, should be multiple of TICK_TIME
const STARTING_TIME = 210;
const MAX_TURN_TIME = 150;
const STARTING_TIME_CHALLENGE = 280;
const MAX_TURN_TIME_CHALLENGE = 300;

const NOT_DISCONNECTED = 100;
const DISCONNECTION_TICKS = 13;

// time after a player disabling the timer before they can re-enable it
const TIMER_COOLDOWN = 20 * 1000;

class BattlePlayer {
	/**
	 * @param {User} user
	 * @param {Battle} game
	 * @param {PlayerSlot} slot
	 */
	constructor(user, game, slot) {
		this.userid = user.userid;
		this.name = user.name;
		this.game = game;
		user.games.add(this.game.id);
		user.updateSearch();

		this.slot = slot;
		this.slotNum = Number(slot.charAt(1)) - 1;
		this.active = true;

		for (const connection of user.connections) {
			if (connection.inRooms.has(game.id)) {
				Sockets.subchannelMove(connection.worker, this.game.id, this.slotNum + 1, connection.socketid);
			}
		}
	}
	destroy() {
		let user = Users(this.userid);
		if (user) {
			for (const connection of user.connections) {
				Sockets.subchannelMove(connection.worker, this.game.id, '0', connection.socketid);
			}
			user.games.delete(this.game.id);
			user.updateSearch();
		}
		this.game[this.slot] = null;
	}
	updateSubchannel(/** @type {User | Connection} */ user) {
		if (user instanceof Users.Connection) {
			// "user" is actually a connection
			Sockets.subchannelMove(user.worker, this.game.id, this.slotNum + 1, user.socketid);
			return;
		}
		for (const connection of user.connections) {
			Sockets.subchannelMove(connection.worker, this.game.id, this.slotNum + 1, connection.socketid);
		}
	}

	toString() {
		return this.userid;
	}
	send(/** @type {string} */ data) {
		let user = Users(this.userid);
		if (user) user.send(data);
	}
	sendRoom(/** @type {string} */ data) {
		let user = Users(this.userid);
		if (user) user.sendTo(this.game.id, data);
	}
}

class BattleTimer {
	/**
	 * @param {Battle} battle
	 */
	constructor(battle) {
		/** @type {Battle} */
		this.battle = battle;

		/** @type {NodeJS.Timer?} */
		this.timer = null;
		/** @type {Set<string>} */
		this.timerRequesters = new Set();
		/**
		 * Overall timer.
		 * Starts at 21 per player (210 seconds) in a ladder battle. Goes
		 * down by 1 every tick (10 seconds). Goes up by 1 every request (2
		 * if below 15). The player loses if this reaches 0.
		 * @type {number[]}
		 */
		this.ticksLeft = [];
		/**
		 * Turn timer.
		 * Set equal to the player's overall timer, but capped at 15 in a
		 * ladder battle. Goes down by 1 every tick. Tracked separately from
		 * the overall timer, and the player also loses if this reaches 0.
		 * @type {number[]}
		 */
		this.turnTicksLeft = [];
		/**
		 * Disconnect timer.
		 * Normally 7 while the player is connected. If the player
		 * disconnects, this will go down by 1 every tick. If the player
		 * reconnects, this will reset to 7. Tracked separately from the
		 * overall timer, and the player also loses if this reaches 0.
		 * @type {number[]}
		 */
		this.dcTicksLeft = [];

		/**
		 * Last tick.
		 * Represents the last time a tick happened.
		 */
		this.lastTick = 0;

		this.lastDisabledTime = 0;
		this.lastDisabledByUser = null;

		const hasLongTurns = Dex.getFormat(battle.format, true).gameType !== 'singles';
		const isChallenge = (!battle.rated && !battle.room.tour);
		const timerSettings = Dex.getFormat(battle.format, true).timer;
		/**@type {{perTurnTicks: number, startingTicks: number, maxPerTurnTicks: number, maxFirstTurnTicks: number, dcTimer: boolean, starting?: number, perTurn?: number, maxPerTurn?: number, maxFirstTurn?: number, timeoutAutoChoose?: boolean, accelerate?: boolean}} */
		// @ts-ignore
		this.settings = Object.assign({}, timerSettings);
		if (this.settings.perTurn === undefined) {
			this.settings.perTurn = hasLongTurns ? 25 : 10;
		}
		if (this.settings.starting === undefined) {
			this.settings.starting = isChallenge ? STARTING_TIME_CHALLENGE : STARTING_TIME;
		}
		if (this.settings.maxPerTurn === undefined) {
			this.settings.maxPerTurn = isChallenge ? MAX_TURN_TIME_CHALLENGE : MAX_TURN_TIME;
		}
		if (this.settings.maxPerTurn <= 0) this.settings.maxPerTurn = Infinity;
		this.settings.perTurnTicks = Math.floor(this.settings.perTurn / TICK_TIME);
		this.settings.startingTicks = Math.ceil(this.settings.starting / TICK_TIME);
		this.settings.maxPerTurnTicks = Math.ceil(this.settings.maxPerTurn / TICK_TIME);
		this.settings.maxFirstTurnTicks = Math.ceil((this.settings.maxFirstTurn || 0) / TICK_TIME);
		if (this.settings.accelerate === undefined) {
			this.settings.accelerate = !timerSettings;
		}
		this.settings.dcTimer = !isChallenge;

		for (let slotNum = 0; slotNum < 2; slotNum++) {
			this.ticksLeft.push(this.settings.startingTicks);
			this.turnTicksLeft.push(-1);
			this.dcTicksLeft.push(NOT_DISCONNECTED);
		}
	}
	start(/** @type {User} */ requester) {
		let userid = requester ? requester.userid : 'staff';
		if (this.timerRequesters.has(userid)) return false;
		if (this.timer) {
			this.battle.room.add(`|inactive|${requester ? requester.name : userid} also wants the timer to be on.`).update();
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
	stop(/** @type {User} */ requester) {
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
		this.timer = null;
		this.battle.room.add(`|inactiveoff|Battle timer is now OFF.`).update();
		return true;
	}
	waitingForChoice(/** @type {PlayerSlot} */ slot) {
		return !this.battle.requests[slot].isWait;
	}
	nextRequest(isFirst = false) {
		if (this.timer) clearTimeout(this.timer);
		if (!this.timerRequesters.size) return;
		const maxTurnTicks = (isFirst ? this.settings.maxFirstTurnTicks : 0) || this.settings.maxPerTurnTicks;
		for (const slotNum of this.ticksLeft.keys()) {
			const slot = /** @type {PlayerSlot} */ ('p' + (slotNum + 1));
			const player = this.battle[slot];

			let perTurnTicks = this.settings.perTurnTicks;
			if (this.settings.accelerate && perTurnTicks) {
				// after turn 100ish: 15s/turn -> 10s/turn
				if (this.battle.requestCount > 200) {
					perTurnTicks--;
				}
				// after turn 200ish: 10s/turn -> 7s/turn
				if (this.battle.requestCount > 400 && this.battle.requestCount % 2) {
					perTurnTicks = 0;
				}
				// after turn 400ish: 7s/turn -> 6s/turn
				if (this.battle.requestCount > 800 && this.battle.requestCount % 4) {
					perTurnTicks = 0;
				}
			}
			this.ticksLeft[slotNum] += this.settings.perTurnTicks;
			this.turnTicksLeft[slotNum] = Math.min(this.ticksLeft[slotNum], maxTurnTicks);

			const ticksLeft = this.turnTicksLeft[slotNum];
			if (player) player.sendRoom(`|inactive|Time left: ${ticksLeft * TICK_TIME} sec this turn | ${this.ticksLeft[slotNum] * TICK_TIME} sec total`);
		}
		this.timer = setTimeout(() => this.nextTick(), TICK_TIME * 1000);
	}
	nextTick() {
		if (this.timer) clearTimeout(this.timer);
		if (this.battle.ended) return;
		for (const slotNum of this.ticksLeft.keys()) {
			const slot = /** @type {PlayerSlot} */ ('p' + (slotNum + 1));

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
				this.battle.room.add(`|inactive|${this.battle.playerNames[slotNum]} has ${dcTicksLeft * TICK_TIME} seconds to reconnect!`).update();
			}
			if (dcTicksLeft !== NOT_DISCONNECTED) continue;
			if (ticksLeft % 3 === 0 || ticksLeft <= 4) {
				this.battle.room.add(`|inactive|${this.battle.playerNames[slotNum]} has ${ticksLeft * TICK_TIME} seconds left.`).update();
			}
		}
		if (!this.checkTimeout()) {
			this.timer = setTimeout(() => this.nextTick(), TICK_TIME * 1000);
		}
	}
	checkActivity() {
		for (const slotNum of this.ticksLeft.keys()) {
			const slot = /** @type {PlayerSlot} */ ('p' + (slotNum + 1));
			const player = this.battle[slot];
			const isConnected = player && player.active;

			if (!!isConnected === !!(this.dcTicksLeft[slotNum] === NOT_DISCONNECTED)) continue;

			if (!isConnected) {
				// player has disconnected: don't wait longer than 6 ticks (1 minute)
				if (this.settings.dcTimer) {
					this.dcTicksLeft[slotNum] = DISCONNECTION_TICKS;
				} else {
					this.dcTicksLeft[slotNum] = NOT_DISCONNECTED - 1;
				}
				if (this.timerRequesters.size) {
					if (this.settings.dcTimer) {
						this.battle.room.add(`|inactive|${this.battle.playerNames[slotNum]} disconnected and has a minute to reconnect!`).update();
					} else {
						this.battle.room.add(`|inactive|${this.battle.playerNames[slotNum]} disconnected!`).update();
					}
				}
			} else {
				// player has reconnected
				this.dcTicksLeft[slotNum] = NOT_DISCONNECTED;
				if (this.timerRequesters.size) {
					let timeLeft = ``;
					if (this.waitingForChoice(slot)) {
						const ticksLeft = this.turnTicksLeft[slotNum];
						timeLeft = ` and has ${ticksLeft * TICK_TIME} seconds left`;
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
			if (this.settings.timeoutAutoChoose && this.ticksLeft[slotNum] && this.dcTicksLeft[slotNum] === NOT_DISCONNECTED) {
				const slot = 'p' + (slotNum + 1);
				this.battle.stream.write(`>${slot} default`);
				didSomething = true;
			} else {
				this.battle.forfeitSlot(slotNum, ' lost due to inactivity.');
				return true;
			}
		}
		return didSomething;
	}
}

/**
 * @typedef {{rqid: number, request: string, isWait: 'cantUndo' | true | false, choice: string}} BattleRequestTracker
 */

class Battle {
	/**
	 * @param {GameRoom} room
	 * @param {string} formatid
	 * @param {AnyObject} options
	 */
	constructor(room, formatid, options) {
		let format = Dex.getFormat(formatid, true);
		this.gameid = 'battle';
		this.id = room.id;
		/** @type {GameRoom} */
		this.room = room;
		this.title = format.name;
		if (!this.title.endsWith(" Battle")) this.title += " Battle";
		this.allowRenames = options.allowRenames !== undefined ? !!options.allowRenames : (!options.rated && !options.tour);

		this.format = formatid;
		/**
		 * The lower player's rating, for searching purposes.
		 * 0 for unrated battles. 1 for unknown ratings.
		 * @type {number}
		 */
		this.rated = options.rated || 0;
		this.started = false;
		this.ended = false;
		this.active = false;

		/** @type {{[userid: string]: BattlePlayer}} */
		this.players = Object.create(null);
		this.playerCount = 0;
		this.playerCap = 2;
		/** @type {BattlePlayer?} */
		this.p1 = null;
		/** @type {BattlePlayer?} */
		this.p2 = null;

		/**
		 * p1 and p2 may be null in unrated games, but playerNames retains
		 * the most recent usernames in those slots, for use by various
		 * functions that need names for the slots.
		 */
		this.playerNames = ["Player 1", "Player 2"];
		/**
		 * @type {{p1: BattleRequestTracker, p2: BattleRequestTracker}}
		 */
		this.requests = {
			p1: /** @type {BattleRequestTracker} */ ({rqid: 0, request: '', isWait: 'cantUndo', choice: ''}),
			p2: /** @type {BattleRequestTracker} */ ({rqid: 0, request: '', isWait: 'cantUndo', choice: ''}),
		};
		this.timer = new BattleTimer(this);

		// data to be logged
		/**
		 * Has this player consented to input log export? If so, set this
		 * to the userid allowed to export.
		 * @type {[string, string]?}
		 */
		this.allowExtraction = null;

		this.logData = null;
		this.endType = 'normal';
		this.score = null;
		this.inputLog = null;

		this.rqid = 1;
		this.requestCount = 0;

		this.stream = PM.createStream();

		let ratedMessage = '';
		if (this.rated) {
			ratedMessage = 'Rated battle';
		} else if (this.room.tour) {
			ratedMessage = 'Tournament battle';
		}

		// @ts-ignore
		this.room.game = this;
		this.room.battle = this;

		let battleOptions = {
			formatid: this.format,
			id: this.id,
			rated: ratedMessage,
			seed: options.seed,
		};
		if (options.inputLog) {
			this.stream.write(options.inputLog);
		} else {
			this.stream.write(`>start ` + JSON.stringify(battleOptions));
		}
		if (Config.forcetimer) this.timer.start();

		this.listen();

		if (options.p1) this.addPlayer(options.p1, 'p1', options.p1team, true);
		if (options.p2) this.addPlayer(options.p2, 'p2', options.p2team, true);
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
	/**
	 * @param {User} user
	 * @param {string} data
	 */
	choose(user, data) {
		const player = this.players[user.userid];
		const [choice, rqid] = data.split('|', 2);
		if (!player) return;
		let request = this.requests[player.slot];
		if (request.isWait !== false && request.isWait !== true) {
			player.sendRoom(`|error|[Invalid choice] There's nothing to choose`);
			return;
		}
		if ((this.requests.p1.isWait && this.requests.p2.isWait) || // too late
			(rqid && rqid !== '' + request.rqid)) { // WAY too late
			player.sendRoom(`|error|[Invalid choice] Sorry, too late to make a different move; the next turn has already started`);
			return;
		}
		request.isWait = true;
		request.choice = choice;

		this.stream.write(`>${player.slot} ${choice}`);
	}
	/**
	 * @param {User} user
	 * @param {string} data
	 */
	undo(user, data) {
		const player = this.players[user.userid];
		const [, rqid] = data.split('|', 2);
		if (!player) return;
		let request = this.requests[player.slot];
		if (request.isWait !== true) {
			player.sendRoom(`|error|[Invalid choice] There's nothing to cancel`);
			return;
		}
		if ((this.requests.p1.isWait && this.requests.p2.isWait) || // too late
			(rqid && rqid !== '' + request.rqid)) { // WAY too late
			player.sendRoom(`|error|[Invalid choice] Sorry, too late to cancel; the next turn has already started`);
			return;
		}
		request.isWait = false;

		this.stream.write(`>${player.slot} undo`);
	}
	/**
	 * @param {User} user
	 */
	joinGame(user) {
		if (this.playerCount >= 2) {
			user.popup(`This battle already has two players.`);
			return false;
		}
		if (!user.can('joinbattle', null, this.room)) {
			user.popup(`You must be a set as a player to join a battle you didn't start. Ask a player to use /addplayer on you to join this battle.`);
			return false;
		}

		if (!this.addPlayer(user)) {
			user.popup(`Failed to join battle.`);
			return false;
		}
		this.room.update();
		return true;
	}
	/**
	 * @param {User} user
	 */
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

	async listen() {
		let next;
		while ((next = await this.stream.read())) {
			this.receive(next.split('\n'));
		}
	}
	receive(/** @type {string[]} */ lines) {
		switch (lines[0]) {
		case 'update':
			for (const line of lines.slice(1)) {
				this.room.add(line);
			}
			this.room.update();
			if (!this.ended) this.timer.nextRequest();
			this.checkActive();
			break;

		case 'sideupdate': {
			let slot = /** @type {PlayerSlot} */ (lines[1]);
			let player = this[slot];
			if (lines[2].startsWith(`|error|[Invalid choice] Can't do anything`)) {
				// ... should not happen
			} else if (lines[2].startsWith(`|error|[Invalid choice]`)) {
				let request = this.requests[slot];
				request.isWait = false;
				request.choice = '';
			} else if (lines[2].startsWith(`|request|`)) {
				this.rqid++;
				let request = JSON.parse(lines[2].slice(9));
				request.rqid = this.rqid;
				const requestJSON = JSON.stringify(request);
				this.requests[slot] = {
					rqid: this.rqid,
					request: requestJSON,
					isWait: request.wait ? 'cantUndo' : false,
					choice: '',
				};
				this.requestCount++;
				if (player) player.sendRoom(`|request|${requestJSON}`);
				break;
			}
			if (player) player.sendRoom(lines[2]);
			break;
		}

		case 'end':
			this.logData = JSON.parse(lines[1]);
			this.score = this.logData.score;
			this.inputLog = this.logData.inputLog;
			this.started = true;
			if (!this.ended) {
				this.ended = true;
				this.onEnd(this.logData.winner);
				this.removeAllPlayers();
			}
			this.checkActive();
			break;
		}
	}
	/**
	 * @param {any} winner
	 */
	async onEnd(winner) {
		// Declare variables here in case we need them for non-rated battles logging.
		let p1score = 0.5;
		const winnerid = toId(winner);

		// Check if the battle was rated to update the ladder, return its response, and log the battle.
		let p1name = this.playerNames[0];
		let p2name = this.playerNames[1];
		let p1id = toId(p1name);
		let p2id = toId(p2name);
		if (this.room.rated) {
			this.room.rated = 0;

			if (winnerid === p1id) {
				p1score = 1;
			} else if (winnerid === p2id) {
				p1score = 0;
			}

			winner = Users.get(winnerid);
			if (winner && !winner.registered) {
				this.room.sendUser(winner, '|askreg|' + winner.userid);
			}
			const [score, p1rating, p2rating] = await Ladders(this.format).updateRating(p1name, p2name, p1score, this.room);
			this.logBattle(score, p1rating, p2rating);
		} else if (Config.logchallenges) {
			if (winnerid === p1id) {
				p1score = 1;
			} else if (winnerid === p2id) {
				p1score = 0;
			}
			this.logBattle(p1score);
		} else {
			this.logData = null;
		}
		if (Config.autosavereplays) {
			let uploader = Users.get(winnerid || p1id);
			if (uploader && uploader.connections[0]) {
				Chat.parse('/savereplay', this.room, uploader, uploader.connections[0]);
			}
		}
		const parentGame = this.room.parent && this.room.parent.game;
		if (parentGame && parentGame.onBattleWin) {
			parentGame.onBattleWin(this.room, winnerid);
		}
		this.room.update();
	}
	/**
	 * @param {number} p1score
	 * @param {AnyObject?} p1rating
	 * @param {AnyObject?} p2rating
	 */
	async logBattle(p1score, p1rating = null, p2rating = null) {
		if (Dex.getFormat(this.format, true).noLog) return;
		let logData = this.logData;
		if (!logData) return;
		this.logData = null; // deallocate to save space
		logData.log = this.room.getLog(3).split('\n'); // replay log (exact damage)

		// delete some redundant data
		if (p1rating) {
			delete p1rating.formatid;
			delete p1rating.username;
			delete p1rating.rpsigma;
			delete p1rating.sigma;
		}
		if (p2rating) {
			delete p2rating.formatid;
			delete p2rating.username;
			delete p2rating.rpsigma;
			delete p2rating.sigma;
		}

		logData.p1rating = p1rating;
		logData.p2rating = p2rating;
		logData.endType = this.endType;
		if (!p1rating) logData.ladderError = true;
		const date = new Date();
		logData.timestamp = '' + date;
		logData.id = this.room.id;
		logData.format = this.room.format;

		const logsubfolder = Chat.toTimestamp(date).split(' ')[0];
		const logfolder = logsubfolder.split('-', 2).join('-');
		const tier = this.room.format.toLowerCase().replace(/[^a-z0-9]+/g, '');
		const logpath = `logs/${logfolder}/${tier}/${logsubfolder}/`;
		await FS(logpath).mkdirp();
		await FS(logpath + this.room.id + '.log.json').write(JSON.stringify(logData));
		//console.log(JSON.stringify(logData));
	}
	/**
	 * @param {User} user
	 * @param {Connection?} connection
	 */
	onConnect(user, connection = null) {
		// this handles joining a battle in which a user is a participant,
		// where the user has already identified before attempting to join
		// the battle
		const player = this.players[user.userid];
		if (!player) return;
		player.updateSubchannel(connection || user);
		const request = this.requests[player.slot];
		if (request) {
			let data = `|request|${request.request}`;
			if (request.choice) data += `\n|sentchoice|${request.choice}`;
			(connection || user).sendTo(this.id, data);
		}
		if (!player.active) this.onJoin(user);
	}
	/**
	 * @param {User} user
	 * @param {Connection?} connection
	 */
	onUpdateConnection(user, connection = null) {
		this.onConnect(user, connection);
	}
	/**
	 * @param {User} user
	 * @param {string} oldUserid
	 * @param {boolean} isJoining
	 * @param {boolean} isForceRenamed
	 */
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
				this.forfeitSlot(player.slotNum, message);
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
		const options = {
			name: user.name,
			avatar: user.avatar,
		};
		this.stream.write(`>player ${player.slot} ` + JSON.stringify(options));
	}
	/**
	 * @param {User} user
	 */
	onJoin(user) {
		let player = this.players[user.userid];
		if (player && !player.active) {
			player.active = true;
			this.timer.checkActivity();
			this.room.add(`|player|${player.slot}|${user.name}|${user.avatar}`);
		}
	}
	/**
	 * @param {User} user
	 */
	onLeave(user) {
		let player = this.players[user.userid];
		if (player && player.active) {
			player.sendRoom(`|request|null`);
			player.active = false;
			this.timer.checkActivity();
			this.room.add(`|player|${player.slot}|`);
		}
	}

	/**
	 * @param {User} user
	 */
	win(user) {
		if (!user) {
			this.tie();
			return true;
		}
		let player = this.players[user.userid];
		if (!player) return false;
		this.stream.write(`>forcewin ${player.slot}`);
	}
	tie() {
		this.stream.write(`>forcetie`);
	}
	tiebreak() {
		this.stream.write(`>tiebreak`);
	}
	/**
	 * @param {User} user
	 * @param {string} message
	 */
	forfeit(user, message = '') {
		if (!this.players) {
			// should never happen
			console.log("user is: " + user.name);
			console.log("  alts: " + Object.keys(user.prevNames));
			console.log("  battle: " + this.id);
			return false;
		}
		let slotNum = -1;
		if (user.userid in this.players) slotNum = this.players[user.userid].slotNum;
		if (slotNum === -1) return false;
		return this.forfeitSlot(slotNum, message);
	}

	/**
	 * @param {number} slotNum
	 * @param {string} message
	 */
	forfeitSlot(slotNum, message = '') {
		if (this.ended || !this.started) return false;

		let name = this.playerNames[slotNum];

		if (!message) message = ' forfeited.';
		this.room.add(`|-message|${name}${message}`);
		this.endType = 'forfeit';
		const otherids = ['p2', 'p1'];
		this.stream.write(`>forcewin ${otherids[slotNum]}`);
		return true;
	}

	/**
	 * @param {User} user
	 * @param {PlayerSlot?} slot
	 * @param {string} team
	 */
	addPlayer(user, slot = null, team = '', initializing = false) {
		if (user.userid in this.players) return false;
		if (this.playerCount >= this.playerCap) return false;
		let player = this.makePlayer(user, slot, team);
		if (!player) return false;
		this.players[user.userid] = player;
		this.playerCount++;
		this.room.auth[user.userid] = Users.PLAYER_SYMBOL;
		if (user.inRooms.has(this.id)) this.onConnect(user);
		if (this.playerCount >= 2) {
			// @ts-ignore
			this.room.title = `${this.p1.name} vs. ${this.p2.name}`;
			this.room.send(`|title|${this.room.title}`);
		}
		if (!initializing) {
			this.room.add(`|player|${player.slot}|${user.name}|${user.avatar}`);
		}
		return true;
	}

	/**
	 * @param {User} user
	 * @param {PlayerSlot?} slot
	 * @param {string} team
	 */
	makePlayer(user, slot = null, team = '') {
		if (!slot) {
			let slotNum = 0;
			while (this[/** @type {PlayerSlot} */ ('p' + (slotNum + 1))]) slotNum++;
			slot = /** @type {PlayerSlot} */ ('p' + (slotNum + 1));
		}
		// console.log('joining: ' + user.name + ' ' + slot);

		if (this[slot]) throw new Error(`Player already exists in ${slot} in ${this.id}`);
		let slotNum = parseInt(slot.charAt(1)) - 1;
		let player = new BattlePlayer(user, this, slot);
		this[slot] = player;
		this.playerNames[slotNum] = player.name;

		let options = {
			name: player.name,
			avatar: '' + user.avatar,
		};
		if (!this.started) {
			options.team = team;
		}
		this.stream.write(`>player ${slot} ` + JSON.stringify(options));
		if (this.started) this.onUpdateConnection(user);
		if (this.p1 && this.p2) {
			this.started = true;
			const user1 = Users(this.p1.userid);
			const user2 = Users(this.p2.userid);
			if (!user1) throw new Error(`User ${this.p1.userid} not found on ${this.id} battle creation`);
			if (!user2) throw new Error(`User ${this.p2.userid} not found on ${this.id} battle creation`);
			Rooms.global.onCreateBattleRoom(user1, user2, this.room, {rated: this.rated});
		}
		return player;
	}

	/**
	 * @param {User} user
	 */
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
		this.stream.destroy();
		if (this.active) {
			Rooms.global.battleCount += -1;
			this.active = false;
		}

		for (let i in this.players) {
			this.players[i].destroy();
		}
		// @ts-ignore
		this.players = null;
		// @ts-ignore
		this.room = null;
	}
}

exports.RoomBattlePlayer = BattlePlayer;
exports.RoomBattleTimer = BattleTimer;
exports.RoomBattle = Battle;

/*********************************************************
 * Process manager
 *********************************************************/

const StreamProcessManager = require('./lib/process-manager').StreamProcessManager;

const PM = new StreamProcessManager(module, () => {
	const BattleStream = require('./sim/battle-stream').BattleStream;
	return new BattleStream();
});

if (!PM.isParentProcess) {
	// This is a child process!
	// @ts-ignore
	global.Config = require('./config/config');
	global.Chat = require('./chat');
	global.__version = '';
	try {
		const execSync = require('child_process').execSync;
		const out = execSync('git merge-base master HEAD', {
			stdio: ['ignore', 'pipe', 'ignore'],
		});
		global.__version = ('' + out).trim();
	} catch (e) {}

	if (Config.crashguard) {
		// graceful crash - allow current battles to finish before restarting
		process.on('uncaughtException', err => {
			require('./lib/crashlogger')(err, 'A simulator process');
		});
		process.on('unhandledRejection', err => {
			require('./lib/crashlogger')(err, 'A simulator process Promise');
		});
	}

	require('./lib/repl').start(`sim-${process.pid}`, cmd => eval(cmd));
} else {
	PM.spawn(global.Config ? Config.simulatorprocesses : 1);
}

exports.PM = PM;
