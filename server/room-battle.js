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

/** @type {typeof import('../sim/battle-stream').BattleStream} */
const BattleStream = require(/** @type {any} */ ('../.sim-dist/battle-stream')).BattleStream;
/** @type {typeof import('../lib/fs').FS} */
const FS = require(/** @type {any} */('../.lib-dist/fs')).FS;

/** 5 seconds */
const TICK_TIME = 5;
const SECONDS = 1000;

// Timer constants: In seconds, should be multiple of TICK_TIME
const STARTING_TIME = 150;
const MAX_TURN_TIME = 150;
const STARTING_TIME_CHALLENGE = 300;
const STARTING_GRACE_TIME = 60;
const MAX_TURN_TIME_CHALLENGE = 300;

const DISCONNECTION_TIME = 60;
const DISCONNECTION_BANK_TIME = 300;

// time after a player disabling the timer before they can re-enable it
const TIMER_COOLDOWN = 20 * SECONDS;

class RoomBattlePlayer {
	/**
	 * @param {User} user
	 * @param {RoomBattle} game
	 * @param {SideID} slot
	 */
	constructor(user, game, slot) {
		this.userid = user.userid;
		this.name = user.name;
		this.game = game;
		user.games.add(this.game.id);
		user.updateSearch();

		this.slot = slot;
		this.slotNum = Number(slot.charAt(1)) - 1;
		this.channelIndex = /** @type {0 | 1 | 2 | 3 | 4} */
			((game.gameType === 'multi' ? this.slotNum % 2 : this.slotNum) + 1);
		this.active = true;
		this.eliminated = false;

		for (const connection of user.connections) {
			if (connection.inRooms.has(game.id)) {
				Sockets.channelMove(connection.worker, this.game.id, this.channelIndex, connection.socketid);
			}
		}
	}
	destroy() {
		let user = Users(this.userid);
		if (user) {
			for (const connection of user.connections) {
				Sockets.channelMove(connection.worker, this.game.id, 0, connection.socketid);
			}
			user.games.delete(this.game.id);
			user.updateSearch();
		}
		this.game[this.slot] = null;
	}
	updateChannel(/** @type {User | Connection} */ user) {
		if (user instanceof Users.Connection) {
			// "user" is actually a connection
			Sockets.channelMove(user.worker, this.game.id, this.channelIndex, user.socketid);
			return;
		}
		for (const connection of user.connections) {
			Sockets.channelMove(connection.worker, this.game.id, this.channelIndex, connection.socketid);
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

class RoomBattleTimer {
	/**
	 * @param {RoomBattle} battle
	 */
	constructor(battle) {
		/** @type {RoomBattle} */
		this.battle = battle;

		/** @type {NodeJS.Timer?} */
		this.timer = null;
		/** @type {Set<string>} */
		this.timerRequesters = new Set();
		/**
		 * Total timer.
		 *
		 * Starts at 210 per player in a ladder battle. Goes down by 5
		 * every tick. Goes up by 10 every turn (with some complications -
		 * see `nextRequest`), capped at starting time. The player loses if
		 * this reaches 0.
		 *
		 * The equivalent of "Your Time" in VGC.
		 *
		 * @type {number[]}
		 */
		this.secondsLeft = [];
		/**
		 * Turn timer.
		 *
		 * Set equal to the player's overall timer, but capped at 150
		 * seconds in a ladder battle. Goes down by 5 every tick.
		 * Tracked separately from the overall timer, and the player also
		 * loses if this reaches 0.
		 *
		 * @type {number[]}
		 */
		this.turnSecondsLeft = [];
		/**
		 * Disconnect timer.
		 * Starts at 60 seconds. While the player is disconnected, this
		 * will go down by 5 every tick. Tracked separately from the
		 * overall timer, and the player also loses if this reaches 0.
		 *
		 * Mostly exists so impatient players don't have to wait the full
		 * 150 seconds against a disconnected opponent.
		 *
		 * @type {number[]}
		 */
		this.dcSecondsLeft = [];
		/**
		 * Used to track a user's last known connection status, and display
		 * the proper message when it changes.
		 * @type {boolean[]}
		 */
		this.connected = [];

		/**
		 * Last tick, as milliseconds since UNIX epoch.
		 * Represents the last time a tick happened.
		 */
		this.lastTick = 0;

		/** Debug mode; true to output detailed timer info every tick */
		this.debug = false;

		this.lastDisabledTime = 0;
		this.lastDisabledByUser = null;

		const hasLongTurns = Dex.getFormat(battle.format, true).gameType !== 'singles';
		const isChallenge = (!battle.rated && !battle.room.tour);
		const timerSettings = Dex.getFormat(battle.format, true).timer;

		// so that Object.assign doesn't overwrite anything with `undefined`
		for (const k in timerSettings) {
			// @ts-ignore
			if (timerSettings[k] === undefined) delete timerSettings[k];
		}

		/** @type {GameTimerSettings} */
		this.settings = Object.assign({
			dcTimer: !isChallenge,
			dcTimerBank: isChallenge,
			starting: isChallenge ? STARTING_TIME_CHALLENGE : STARTING_TIME,
			grace: STARTING_GRACE_TIME,
			addPerTurn: hasLongTurns ? 25 : 10,
			maxPerTurn: isChallenge ? MAX_TURN_TIME_CHALLENGE : MAX_TURN_TIME,
			maxFirstTurn: isChallenge ? MAX_TURN_TIME_CHALLENGE : MAX_TURN_TIME,
			timeoutAutoChoose: false,
			accelerate: !timerSettings,
		}, timerSettings);
		if (this.settings.maxPerTurn <= 0) this.settings.maxPerTurn = Infinity;

		for (let slotNum = 0; slotNum < this.battle.playerCap; slotNum++) {
			this.secondsLeft.push(this.settings.starting + this.settings.grace);
			this.turnSecondsLeft.push(-1);
			this.dcSecondsLeft.push(this.settings.dcTimerBank ? DISCONNECTION_BANK_TIME : DISCONNECTION_TIME);
			this.connected.push(true);
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
			const remainingCooldownMs = (this.lastDisabledTime || 0) + TIMER_COOLDOWN - Date.now();
			if (remainingCooldownMs > 0) {
				this.battle.players[requester.userid].sendRoom(`|inactiveoff|The timer can't be re-enabled so soon after disabling it (${Math.ceil(remainingCooldownMs / SECONDS)} seconds remaining).`);
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
	waitingForChoice(/** @type {SideID} */ slot) {
		return !this.battle.requests[slot].isWait;
	}
	nextRequest(isFirst = false) {
		if (this.timer) clearTimeout(this.timer);
		if (!this.timerRequesters.size) return;
		if (this.secondsLeft.some(t => t <= 0)) return;
		const maxTurnTime = (isFirst ? this.settings.maxFirstTurn : 0) || this.settings.maxPerTurn;

		let addPerTurn = isFirst ? 0 : this.settings.addPerTurn;
		if (this.settings.accelerate && addPerTurn) {
			// after turn 100ish: 15s/turn -> 10s/turn
			if (this.battle.requestCount > 200) {
				addPerTurn -= TICK_TIME;
			}
			// after turn 200ish: 10s/turn -> 7s/turn
			if (this.battle.requestCount > 400 && Math.floor(this.battle.requestCount / 2) % 2) {
				addPerTurn = 0;
			}
		}

		const room = this.battle.room;
		for (const slotNum of this.secondsLeft.keys()) {
			const slot = /** @type {SideID} */ ('p' + (slotNum + 1));
			const player = this.battle[slot];
			const playerName = this.battle.playerNames[slotNum];

			if (!isFirst) {
				this.secondsLeft[slotNum] = Math.min(this.secondsLeft[slotNum] + addPerTurn, this.settings.starting);
			}
			this.turnSecondsLeft[slotNum] = Math.min(this.secondsLeft[slotNum], maxTurnTime);

			const secondsLeft = this.turnSecondsLeft[slotNum];
			let grace = this.secondsLeft[slotNum] - this.settings.starting;
			if (grace < 0) grace = 0;
			if (player) player.sendRoom(`|inactive|Time left: ${secondsLeft} sec this turn | ${this.secondsLeft[slotNum] - grace} sec total` + (grace ? ` | ${grace} sec grace` : ``));
			if (secondsLeft <= 30) {
				room.add(`|inactive|${playerName} has ${secondsLeft} seconds left this turn.`);
			}
			if (this.debug) {
				room.add(`||${playerName} | Time left: ${secondsLeft} sec this turn | ${this.secondsLeft[slotNum]} sec total | +${addPerTurn} seconds`);
			}
		}
		room.update();
		this.lastTick = Date.now();
		this.timer = setTimeout(() => this.nextTick(), TICK_TIME * SECONDS);
	}
	nextTick() {
		if (this.timer) clearTimeout(this.timer);
		if (this.battle.ended) return;
		const room = this.battle.room;
		for (const slotNum of this.secondsLeft.keys()) {
			const slot = /** @type {SideID} */ ('p' + (slotNum + 1));
			const connected = this.connected[slotNum];

			if (!this.waitingForChoice(slot)) continue;
			if (connected) {
				this.secondsLeft[slotNum] -= TICK_TIME;
				this.turnSecondsLeft[slotNum] -= TICK_TIME;
			} else {
				this.dcSecondsLeft[slotNum] -= TICK_TIME;
				if (!this.settings.dcTimerBank) {
					this.secondsLeft[slotNum] -= TICK_TIME;
					this.turnSecondsLeft[slotNum] -= TICK_TIME;
				}
			}

			let dcSecondsLeft = this.dcSecondsLeft[slotNum];
			if (dcSecondsLeft <= 0) this.turnSecondsLeft[slotNum] = 0;
			const secondsLeft = this.turnSecondsLeft[slotNum];
			if (!secondsLeft) continue;

			if (!connected && (dcSecondsLeft <= secondsLeft || this.settings.dcTimerBank)) {
				// dc timer is shown only if it's lower than turn timer or you're in timer bank mode
				if (dcSecondsLeft % 30 === 0 || dcSecondsLeft <= 20) {
					room.add(`|inactive|${this.battle.playerNames[slotNum]} has ${dcSecondsLeft} seconds to reconnect!`);
				}
			} else {
				// regular turn timer shown
				if (secondsLeft % 30 === 0 || secondsLeft <= 20) {
					room.add(`|inactive|${this.battle.playerNames[slotNum]} has ${secondsLeft} seconds left.`);
				}
			}
		}
		if (this.debug) {
			room.add(`||[${this.battle.playerNames[0]} has ${this.turnSecondsLeft[0]}s this turn / ${this.secondsLeft[0]}s total]`);
			room.add(`||[${this.battle.playerNames[0]} has ${this.turnSecondsLeft[0]}s this turn / ${this.secondsLeft[0]}s total]`);
		}
		room.update();
		if (!this.checkTimeout()) {
			this.timer = setTimeout(() => this.nextTick(), TICK_TIME * 1000);
		}
	}
	checkActivity() {
		for (const slotNum of this.secondsLeft.keys()) {
			const slot = /** @type {SideID} */ ('p' + (slotNum + 1));
			const player = this.battle[slot];
			const isConnected = !!(player && player.active);

			if (isConnected === this.connected[slotNum]) continue;

			if (!isConnected) {
				// player has disconnected
				this.connected[slotNum] = false;
				if (!this.settings.dcTimerBank) {
					// don't wait longer than 6 ticks (1 minute)
					if (this.settings.dcTimer) {
						this.dcSecondsLeft[slotNum] = DISCONNECTION_TIME;
					} else {
						// arbitrary large number
						this.dcSecondsLeft[slotNum] = DISCONNECTION_TIME * 10;
					}
				}

				if (this.timerRequesters.size) {
					let msg = `!`;

					if (this.settings.dcTimer) {
						msg = ` and has a minute to reconnect!`;
					}
					if (this.settings.dcTimerBank) {
						if (this.dcSecondsLeft[slotNum] > 0) {
							msg = ` and has ${this.dcSecondsLeft[slotNum]} seconds to reconnect!`;
						} else {
							msg = ` and has no disconnection time left!`;
						}
					}
					this.battle.room.add(`|inactive|${this.battle.playerNames[slotNum]} disconnected${msg}`).update();
				}
			} else {
				// player has reconnected
				this.connected[slotNum] = true;
				if (this.timerRequesters.size) {
					let timeLeft = ``;
					if (this.waitingForChoice(slot)) {
						timeLeft = ` and has ${this.turnSecondsLeft[slotNum]} seconds left`;
					}
					this.battle.room.add(`|inactive|${this.battle.playerNames[slotNum]} reconnected${timeLeft}.`).update();
				}
			}
		}
	}
	checkTimeout() {
		if (this.turnSecondsLeft.every(t => t <= 0)) {
			if (!this.settings.timeoutAutoChoose || this.secondsLeft.every(t => t <= 0)) {
				this.battle.room.add(`|-message|All players are inactive.`).update();
				this.battle.tie();
				return true;
			}
		}
		let didSomething = false;
		for (const [slotNum, seconds] of this.turnSecondsLeft.entries()) {
			if (seconds) continue;
			if (this.settings.timeoutAutoChoose && this.secondsLeft[slotNum] > 0 && this.connected[slotNum]) {
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
 * @typedef {object} BattleRequestTracker
 * @property {number} rqid
 * @property {string} request
 * @property {'cantUndo' | true | false} isWait true = user has decided, false = user has yet to decide, 'cantUndo' = waiting on other user (U-turn, faint-switch) or uncancellable (trapping ability)
 * @property {string} choice
 */

class RoomBattle {
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
		this.gameType = format.gameType;
		/**
		 * The lower player's rating, for searching purposes.
		 * 0 for unrated battles. 1 for unknown ratings.
		 * @type {number}
		 */
		this.rated = options.rated || 0;
		this.started = false;
		this.ended = false;
		this.active = false;

		/** @type {{[userid: string]: RoomBattlePlayer}} */
		this.players = Object.create(null);
		this.playerCount = 0;
		this.playerCap = this.gameType === 'multi' || this.gameType === 'free-for-all' ? 4 : 2;
		/** @type {RoomBattlePlayer?} */
		this.p1 = null;
		/** @type {RoomBattlePlayer?} */
		this.p2 = null;
		/** @type {RoomBattlePlayer?} */
		this.p3 = null;
		/** @type {RoomBattlePlayer?} */
		this.p4 = null;

		/**
		 * p1 and p2 may be null in unrated games, but playerNames retains
		 * the most recent usernames in those slots, for use by various
		 * functions that need names for the slots.
		 */
		this.playerNames = ["Player 1", "Player 2", "Player 3", "Player 4"].slice(0, this.playerCap);
		this.requests = {
			p1: /** @type {BattleRequestTracker} */ ({rqid: 0, request: '', isWait: 'cantUndo', choice: ''}),
			p2: /** @type {BattleRequestTracker} */ ({rqid: 0, request: '', isWait: 'cantUndo', choice: ''}),
			p3: /** @type {BattleRequestTracker} */ ({rqid: 0, request: '', isWait: 'cantUndo', choice: ''}),
			p4: /** @type {BattleRequestTracker} */ ({rqid: 0, request: '', isWait: 'cantUndo', choice: ''}),
		};
		this.timer = new RoomBattleTimer(this);

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
		if (options.ratedMessage) {
			ratedMessage = options.ratedMessage;
		} if (this.rated) {
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
		if (options.p3) this.addPlayer(options.p3, 'p3', options.p3team, true);
		if (options.p4) this.addPlayer(options.p4, 'p4', options.p4team, true);
	}

	checkActive() {
		let active = true;
		if (this.ended || !this.started) {
			active = false;
		} else if (!this.p1 || !this.p1.active) {
			active = false;
		} else if (!this.p2 || !this.p2.active) {
			active = false;
		} else if (this.playerCap > 2) {
			if (!this.p3 || !this.p3.active) {
				active = false;
			} else if (!this.p4 || !this.p4.active) {
				active = false;
			}
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
		const allPlayersWait = (this.requests.p1.isWait && this.requests.p2.isWait) && (this.playerCap === 2 || this.requests.p3.isWait && this.requests.p4.isWait);
		if (allPlayersWait || // too late
			(rqid && rqid !== '' + request.rqid)) { // WAY too late
			player.sendRoom(`|error|[Invalid choice] Sorry, too late to make a different move; the next turn has already started`);
			return;
		}
		user.lastDecision = Date.now();
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
		const allPlayersWait = (this.requests.p1.isWait && this.requests.p2.isWait) && (this.playerCap === 2 || this.requests.p3.isWait && this.requests.p4.isWait);
		if (allPlayersWait || // too late
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
		if (!this.ended) {
			this.room.add(`|bigerror|The simulator process has crashed. We've been notified and will fix this ASAP.`);
			Monitor.crashlog(new Error(`Process disconnected`), `A battle`);
			this.started = true;
			this.ended = true;
			this.checkActive();
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
			let slot = /** @type {SideID} */ (lines[1]);
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
	 * @param {AnyObject?} p3rating
	 * @param {AnyObject?} p4rating
	 */
	async logBattle(p1score, p1rating = null, p2rating = null, p3rating = null, p4rating = null) {
		if (Dex.getFormat(this.format, true).noLog) return;
		let logData = this.logData;
		if (!logData) return;
		this.logData = null; // deallocate to save space
		logData.log = this.room.getLog(3).split('\n'); // replay log (exact damage)

		// delete some redundant data
		for (const rating of [p1rating, p2rating, p3rating, p4rating]) {
			if (rating) {
				delete rating.formatid;
				delete rating.username;
				delete rating.rpsigma;
				delete rating.sigma;
			}
		}

		logData.p1rating = p1rating;
		logData.p2rating = p2rating;
		if (this.playerCap > 2) {
			logData.p3rating = p3rating;
			logData.p4rating = p4rating;
		}
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
		player.updateChannel(connection || user);
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
	 * @param {SideID?} slot
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
		if (this.playerCount >= this.playerCap) {
			if (this.gameType === 'multi') {
				// @ts-ignore
				this.room.title = `Team ${this.p1.name} vs. Team ${this.p2.name}`;
			} else if (this.gameType === 'free-for-all') {
				// p1 vs. p2 vs. p3 vs. p4 is too long of a title
				// @ts-ignore
				this.room.title = `${this.p1.name} and friends`;
			} else {
				// @ts-ignore
				this.room.title = `${this.p1.name} vs. ${this.p2.name}`;
			}
			this.room.send(`|title|${this.room.title}`);
		}
		if (!initializing) {
			this.room.add(`|player|${player.slot}|${user.name}|${user.avatar}`);
		}
		return true;
	}

	/**
	 * @param {User} user
	 * @param {SideID?} slot
	 * @param {string} team
	 */
	makePlayer(user, slot = null, team = '') {
		if (!slot) {
			let slotNum = 0;
			while (this[/** @type {SideID} */ ('p' + (slotNum + 1))]) slotNum++;
			slot = /** @type {SideID} */ ('p' + (slotNum + 1));
		}
		// console.log('joining: ' + user.name + ' ' + slot);

		if (this[slot]) throw new Error(`Player already exists in ${slot} in ${this.id}`);
		let slotNum = parseInt(slot.charAt(1)) - 1;
		let player = new RoomBattlePlayer(user, this, slot);
		this[slot] = player;
		this.playerNames[slotNum] = player.name;

		/**@type {{name: string, avatar: string, team?: string}} */
		let options = {
			name: player.name,
			avatar: '' + user.avatar,
		};
		if (!this.started) {
			options.team = team;
		}
		this.stream.write(`>player ${slot} ` + JSON.stringify(options));
		if (this.started) this.onUpdateConnection(user);
		if (this.p1 && this.p2 && (this.playerCap <= 2 || this.p3 && this.p4)) {
			this.started = true;
			const users = this.playerNames.map(name => {
				const user = Users(name);
				if (!user) throw new Error(`User ${name} not found on ${this.id} battle creation`);
				return user;
			});
			Rooms.global.onCreateBattleRoom(users, this.room, {rated: this.rated});
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
		this.ended = true;
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

class RoomBattleStream extends BattleStream {
	constructor() {
		super({keepAlive: true});
		/** @type {Battle} */
		// @ts-ignore
		this.battle = null;
	}

	/** @param {string} chunk */
	_write(chunk) {
		const startTime = Date.now();
		try {
			this._writeLines(chunk);
		} catch (err) {
			const battle = this.battle;
			Monitor.crashlog(err, 'A battle', {
				chunk,
				inputLog: battle ? '\n' + battle.inputLog.join('\n') : '',
				log: battle ? '\n' + battle.getDebugLog() : '',
			});

			this.push(`update\n|html|<div class="broadcast-red"><b>The battle crashed</b><br />Don't worry, we're working on fixing it.</div>`);
			if (battle) {
				for (const side of battle.sides) {
					if (side && side.requestState) {
						this.push(`sideupdate\n${side.id}\n|error|[Invalid choice] The battle crashed`);
					}
				}
			}
		}
		if (this.battle) this.battle.sendUpdates();
		const deltaTime = Date.now() - startTime;
		if (deltaTime > 1000) {
			console.log(`[slow battle] ${deltaTime}ms - ${chunk}`);
		}
	}

	/**
	 * @param {string} type
	 * @param {string} message
	 */
	_writeLine(type, message) {
		switch (type) {
		case 'eval':
			/* eslint-disable no-eval, no-unused-vars */
			const battle = this.battle;
			const p1 = battle && battle.sides[0];
			const p2 = battle && battle.sides[1];
			const p3 = battle && battle.sides[2];
			const p4 = battle && battle.sides[3];
			const p1active = p1 && p1.active[0];
			const p2active = p2 && p2.active[0];
			const p3active = p3 && p3.active[0];
			const p4active = p4 && p4.active[0];
			battle.inputLog.push(`${type} ${message}`);
			message = message.replace(/\f/g, '\n');
			battle.add('', '>>> ' + message.replace(/\n/g, '\n||'));
			try {
				let result = eval(message);
				if (result && result.then) {
					result.then((/** @type {any} */ unwrappedResult) => {
						unwrappedResult = Chat.stringify(unwrappedResult);
						battle.add('', 'Promise -> ' + unwrappedResult);
						battle.sendUpdates();
					}, (/** @type {Error} */ error) => {
						battle.add('', '<<< error: ' + error.message);
						battle.sendUpdates();
					});
				} else {
					result = Chat.stringify(result);
					result = result.replace(/\n/g, '\n||');
					battle.add('', '<<< ' + result);
				}
			} catch (e) {
				battle.add('', '<<< error: ' + e.message);
			}
			/* eslint-enable no-eval, no-unused-vars */
			break;
		default: super._writeLine(type, message);
		}
	}
}

exports.RoomBattlePlayer = RoomBattlePlayer;
exports.RoomBattleTimer = RoomBattleTimer;
exports.RoomBattle = RoomBattle;
exports.RoomBattleStream = RoomBattleStream;

/*********************************************************
 * Process manager
 *********************************************************/

/** @type {typeof import('../lib/process-manager').StreamProcessManager} */
const StreamProcessManager = require(/** @type {any} */('../.lib-dist/process-manager')).StreamProcessManager;

const PM = new StreamProcessManager(module, () => {
	return new RoomBattleStream();
});

if (!PM.isParentProcess) {
	// This is a child process!
	// @ts-ignore This file doesn't exist on the repository, so Travis checks fail if this isn't ignored
	global.Config = require('../config/config');
	global.Chat = require('./chat');
	// @ts-ignore ???
	global.Monitor = {
		/**
		 * @param {Error} error
		 * @param {string} source
		 * @param {{}?} details
		 */
		crashlog(error, source = 'A simulator process', details = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			// @ts-ignore
			process.send(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	};
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
			Monitor.crashlog(err, 'A simulator process');
		});
		process.on('unhandledRejection', err => {
			if (err instanceof Error) {
				Monitor.crashlog(err, 'A simulator process Promise');
			}
		});
	}

	/** @type {typeof import('../lib/repl').Repl} */
	const Repl = require(/** @type {any} */('../.lib-dist/repl')).Repl;
	Repl.start(`sim-${process.pid}`, cmd => eval(cmd));
} else {
	PM.spawn(global.Config ? Config.simulatorprocesses : 1);
}

exports.PM = PM;
