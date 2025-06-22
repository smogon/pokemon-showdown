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

import { execSync } from "child_process";
import { Repl, ProcessManager, type Streams } from '../lib';
import { BattleStream } from "../sim/battle-stream";
import { RoomGamePlayer, RoomGame } from "./room-game";
import type { Tournament } from './tournaments/index';
import type { RoomSettings } from './rooms';
import type { BestOfGame } from './room-battle-bestof';
import type { GameTimerSettings } from '../sim/dex-formats';

type ChannelIndex = 0 | 1 | 2 | 3 | 4;
export type PlayerIndex = 1 | 2 | 3 | 4;
export type ChallengeType = 'rated' | 'unrated' | 'challenge' | 'tour';

interface BattleRequestTracker {
	rqid: number;
	request: string;
	/**
	 * - true = user has decided,
	 * - false = user has yet to decide,
	 * - 'cantUndo' = waiting on other user (U-turn, faint-switch) or uncancellable (trapping ability)
	 */
	isWait: 'cantUndo' | true | false;
	choice: string;
}

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
const LOCKDOWN_PERIOD = 30 * 60 * 1000; // 30 minutes

export class RoomBattlePlayer extends RoomGamePlayer<RoomBattle> {
	readonly slot: SideID;
	readonly channelIndex: ChannelIndex;
	request: BattleRequestTracker;
	wantsTie: boolean;
	wantsOpenTeamSheets: boolean | null;
	eliminated: boolean;
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
	 */
	secondsLeft: number;
	/**
	 * Current turn timer.
	 *
	 * Set equal to the player's overall timer, but capped at 150
	 * seconds in a ladder battle. Goes down by 5 every tick.
	 * Tracked separately from the overall timer, and the player also
	 * loses if this reaches 0 (except in VGC where the default choice
	 * is chosen if it reaches 0).
	 */
	turnSecondsLeft: number;
	/**
	 * Disconnect timer.
	 *
	 * Starts at 60 seconds. While the player is disconnected, this
	 * will go down by 5 every tick. Tracked separately from the
	 * overall timer, and the player also loses if this reaches 0.
	 *
	 * Mostly exists so impatient players don't have to wait the full
	 * 150 seconds against a disconnected opponent.
 	*/
	dcSecondsLeft: number;
	/**
	 * Is the user actually in the room?
	 */
	active: boolean;
	/**
	 * Used to track a user's last known connection status, and display
	 * the proper message when it changes.
	 *
	 * `.active` is set right when the user joins/leaves, but `.knownActive`
	 * is only set after the timer knows about it.
	 */
	knownActive: boolean;
	invite: ID;
	/**
	 * Has the simulator received this player's team yet?
	 * Basically always yes except when creating a 4-player battle,
	 * in which case players will need to bring their own team.
	 */
	hasTeam: boolean;
	constructor(user: User | string | null, game: RoomBattle, num: PlayerIndex) {
		super(user, game, num);
		if (typeof user === 'string') user = null;

		this.slot = `p${num}` as SideID;
		this.channelIndex = (game.gameType === 'multi' && num > 2 ? num - 2 : num) as ChannelIndex;

		this.request = { rqid: 0, request: '', isWait: 'cantUndo', choice: '' };
		this.wantsTie = false;
		this.wantsOpenTeamSheets = null;
		this.active = !!user?.connected;
		this.eliminated = false;

		this.secondsLeft = 1;
		this.turnSecondsLeft = 1;
		this.dcSecondsLeft = 1;

		this.knownActive = true;
		this.invite = '';
		this.hasTeam = false;

		if (user) {
			user.games.add(this.game.roomid);
			user.updateSearch();
			for (const connection of user.connections) {
				if (connection.inRooms.has(game.roomid)) {
					Sockets.channelMove(connection.worker, this.game.roomid, this.channelIndex, connection.socketid);
				}
			}
		}
	}
	override destroy() {
		const user = this.getUser();
		if (user) {
			this.updateChannel(user, 0);
		}
		this.knownActive = false;
		this.active = false;
	}
	updateChannel(user: User | Connection, channel = this.channelIndex) {
		for (const connection of (user.connections || [user])) {
			Sockets.channelMove(connection.worker, this.game.roomid, channel, connection.socketid);
		}
	}
}

export class RoomBattleTimer {
	readonly battle: RoomBattle;
	readonly timerRequesters = new Set<ID>();
	timer: NodeJS.Timeout | null = null;
	isFirstRequest = true;
	turn: number | null = null;
	/**
	 * Last tick, as milliseconds since UNIX epoch.
	 * Represents the last time a tick happened.
	 */
	lastTick = 0;
	/** Debug mode; true to output detailed timer info every tick */
	debug = false;
	lastDisabledTime = 0;
	lastDisabledByUser: null | ID = null;
	settings: GameTimerSettings;
	constructor(battle: RoomBattle) {
		this.battle = battle;

		const format = Dex.formats.get(battle.format, true);
		const hasLongTurns = format.gameType !== 'singles';
		const isChallenge = (battle.challengeType === 'challenge');
		const ruleTable = Dex.formats.getRuleTable(format);
		const timerSettings = ruleTable.timer?.[0];

		// so that Object.assign doesn't overwrite anything with `undefined`
		for (const k in timerSettings) {
			// @ts-expect-error prop access
			if (timerSettings[k] === undefined) delete timerSettings[k];
		}

		this.settings = {
			dcTimer: !isChallenge,
			dcTimerBank: isChallenge,
			starting: isChallenge ? STARTING_TIME_CHALLENGE : STARTING_TIME,
			grace: STARTING_GRACE_TIME,
			addPerTurn: hasLongTurns ? 25 : 10,
			maxPerTurn: isChallenge ? MAX_TURN_TIME_CHALLENGE : MAX_TURN_TIME,
			maxFirstTurn: isChallenge ? MAX_TURN_TIME_CHALLENGE : MAX_TURN_TIME,
			timeoutAutoChoose: false,
			accelerate: !timerSettings && !isChallenge,
			...timerSettings,
		};
		if (this.settings.maxPerTurn <= 0) this.settings.maxPerTurn = Infinity;

		for (const player of this.battle.players) {
			player.secondsLeft = this.settings.starting + this.settings.grace;
			player.turnSecondsLeft = player.secondsLeft;
			player.dcSecondsLeft = this.settings.dcTimerBank ? DISCONNECTION_BANK_TIME : DISCONNECTION_TIME;
		}
	}
	start(requester?: User) {
		const userid = requester ? requester.id : 'staff' as ID;
		if (this.timerRequesters.has(userid)) return false;
		if (this.battle.ended) {
			requester?.sendTo(this.battle.roomid, `|inactiveoff|The timer can't be enabled after a battle has ended.`);
			return false;
		}
		if (this.timerRequesters.size) {
			this.battle.room.add(`|inactive|${requester ? requester.name : userid} also wants the timer to be on.`).update();
			this.timerRequesters.add(userid);
			return false;
		}
		if (requester && this.battle.playerTable[requester.id] && this.lastDisabledByUser === requester.id) {
			const remainingCooldownMs = (this.lastDisabledTime || 0) + TIMER_COOLDOWN - Date.now();
			if (remainingCooldownMs > 0) {
				this.battle.playerTable[requester.id].sendRoom(
					`|inactiveoff|The timer can't be re-enabled so soon after disabling it (${Math.ceil(remainingCooldownMs / SECONDS)} seconds remaining).`
				);
				return false;
			}
		}
		this.timerRequesters.add(userid);
		const requestedBy = requester ? ` (requested by ${requester.name})` : ``;
		this.battle.room.add(`|inactive|Battle timer is ON: inactive players will automatically lose when time's up.${requestedBy}`).update();

		this.checkActivity();
		for (const player of this.battle.players) this.nextRequest(player);
		return true;
	}
	stop(requester?: User) {
		if (requester) {
			if (!this.timerRequesters.has(requester.id)) return false;
			this.timerRequesters.delete(requester.id);
			this.lastDisabledByUser = requester.id;
			this.lastDisabledTime = Date.now();
		} else {
			this.timerRequesters.clear();
		}
		if (this.timerRequesters.size) {
			this.battle.room.add(`|inactive|${requester!.name} no longer wants the timer on, but the timer is staying on because ${[...this.timerRequesters].join(', ')} still does.`).update();
			return false;
		}
		if (this.end()) {
			this.battle.room.add(`|inactiveoff|Battle timer is now OFF.`).update();
			return true;
		}
		return false;
	}
	end() {
		this.timerRequesters.clear();
		if (!this.timer) return false;
		clearTimeout(this.timer);
		this.timer = null;
		return true;
	}
	updateTurn() {
		if (this.turn === null) {
			// first request since timer was turned on
			this.turn = this.battle.turn;
			return;
		}
		if (this.battle.turn <= this.turn) {
			if (this.battle.players.filter(p => !p.request.isWait).length <= 1) {
				// first request of a mid-turn request (U-turn or faint-switch)
				this.isFirstRequest = false;
				const addPerMidTurnRequest = Math.min(this.settings.addPerTurn, TICK_TIME);
				for (const curPlayer of this.battle.players) {
					curPlayer.secondsLeft += addPerMidTurnRequest;
				}
			} else {
				// second player of a request we've already updated the timer for
			}
			return;
		}

		// new turn
		this.turn = this.battle.turn;
		this.isFirstRequest = false;

		let addPerTurn = this.settings.addPerTurn;
		if (this.settings.accelerate && addPerTurn) {
			// after turn 100: 15s/turn -> 10s/turn
			if (this.turn > 100 && addPerTurn > TICK_TIME) {
				addPerTurn -= TICK_TIME;
			}
			// after turn 200: 10s/turn -> 7s/turn
			if (this.turn > 200 && Math.floor(this.battle.requestCount / 2) % 2) {
				addPerTurn = 0;
			}
		}

		for (const player of this.battle.players) {
			player.secondsLeft = Math.min(player.secondsLeft + addPerTurn, this.settings.starting);
		}
	}
	nextRequest(player: RoomBattlePlayer) {
		if (player.secondsLeft <= 0) return;
		if (player.request.isWait) return;

		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
		if (this.battle.ended || !this.timerRequesters.size) return;
		// if there's only 1 player left
		if (this.battle.players.filter(p => p.secondsLeft > 0).length <= 1) return;

		const room = this.battle.room;
		this.updateTurn();
		const maxTurnTime = (this.isFirstRequest ? this.settings.maxFirstTurn : 0) || this.settings.maxPerTurn;
		player.turnSecondsLeft = Math.min(player.secondsLeft, maxTurnTime);

		const secondsLeft = player.turnSecondsLeft;
		let grace = player.secondsLeft - this.settings.starting;
		if (grace < 0) grace = 0;
		player.sendRoom(`|inactive|Time left: ${secondsLeft} sec this turn | ${player.secondsLeft - grace} sec total` + (grace ? ` | ${grace} sec grace` : ``));
		if (secondsLeft <= 30 && secondsLeft < this.settings.starting) {
			room.add(`|inactive|${player.name} has ${secondsLeft} seconds left this turn.`);
		}
		if (this.debug) {
			room.add(`||${player.name} | Time left: ${secondsLeft} sec this turn | ${player.secondsLeft} sec total`);
		}
		room.update();
		this.lastTick = Date.now();
		this.timer = setTimeout(() => this.nextTick(), TICK_TIME * SECONDS);
	}
	nextTick() {
		if (this.timer) clearTimeout(this.timer);
		if (this.battle.ended || !this.timerRequesters.size) return;
		// if there are no active requests
		if (this.battle.players.every(p => p.request.isWait === 'cantUndo')) return;

		const room = this.battle.room;
		for (const player of this.battle.players) {
			if (player.request.isWait) continue;
			if (player.knownActive) {
				player.secondsLeft -= TICK_TIME;
				player.turnSecondsLeft -= TICK_TIME;
			} else {
				player.dcSecondsLeft -= TICK_TIME;
				if (!this.settings.dcTimerBank) {
					player.secondsLeft -= TICK_TIME;
					player.turnSecondsLeft -= TICK_TIME;
				}
			}

			const dcSecondsLeft = player.dcSecondsLeft;
			if (dcSecondsLeft <= 0) {
				player.turnSecondsLeft = 0;
			}
			const secondsLeft = player.turnSecondsLeft;
			if (!secondsLeft) continue;

			if (!player.knownActive && (dcSecondsLeft <= secondsLeft || this.settings.dcTimerBank)) {
				// dc timer is shown only if it's lower than turn timer or you're in timer bank mode
				if (dcSecondsLeft % 30 === 0 || dcSecondsLeft <= 20) {
					room.add(`|inactive|${player.name} has ${dcSecondsLeft} seconds to reconnect!`);
				}
			} else {
				// regular turn timer shown
				if (secondsLeft % 30 === 0 || secondsLeft <= 20) {
					room.add(`|inactive|${player.name} has ${secondsLeft} seconds left.`);
				}
			}
			if (this.debug) {
				room.add(`||[${player.name} has ${player.turnSecondsLeft}s this turn / ${player.secondsLeft}s total]`);
			}
		}
		room.update();
		if (!this.checkTimeout()) {
			this.timer = setTimeout(() => this.nextTick(), TICK_TIME * 1000);
		}
	}
	checkActivity() {
		if (this.battle.ended) return;
		for (const player of this.battle.players) {
			const isActive = !!player.active;

			if (isActive === player.knownActive) continue;

			if (!isActive) {
				// player has disconnected
				player.knownActive = false;
				if (!this.settings.dcTimerBank) {
					// don't wait longer than 6 ticks (1 minute)
					if (this.settings.dcTimer) {
						player.dcSecondsLeft = DISCONNECTION_TIME;
					} else {
						// arbitrary large number
						player.dcSecondsLeft = DISCONNECTION_TIME * 10;
					}
				}

				if (this.timerRequesters.size) {
					let msg = `!`;

					if (this.settings.dcTimer) {
						msg = ` and has a minute to reconnect!`;
					}
					if (this.settings.dcTimerBank) {
						if (player.dcSecondsLeft > 0) {
							msg = ` and has ${player.dcSecondsLeft} seconds to reconnect!`;
						} else {
							msg = ` and has no disconnection time left!`;
						}
					}
					this.battle.room.add(`|inactive|${player.name} disconnected${msg}`).update();
				}
			} else {
				// player has reconnected
				player.knownActive = true;
				if (this.timerRequesters.size) {
					let timeLeft = ``;
					if (!player.request.isWait) {
						timeLeft = ` and has ${player.turnSecondsLeft} seconds left`;
					}
					this.battle.room.add(`|inactive|${player.name} reconnected${timeLeft}.`).update();
				}
			}
		}
	}
	checkTimeout() {
		const players = this.battle.players;
		if (players.every(player => player.turnSecondsLeft <= 0)) {
			if (!this.settings.timeoutAutoChoose || players.every(player => player.secondsLeft <= 0)) {
				this.battle.room.add(`|-message|All players are inactive.`).update();
				this.battle.tie();
				return true;
			}
		}
		let didSomething = false;
		for (const player of players) {
			if (player.eliminated) continue;
			if (player.turnSecondsLeft > 0) continue;
			if (this.settings.timeoutAutoChoose && player.secondsLeft > 0 && player.knownActive) {
				void this.battle.stream.write(`>${player.slot} default`);
				didSomething = true;
			} else {
				this.battle.forfeitPlayer(player, ' lost due to inactivity.');
				didSomething = true;
			}
		}
		return didSomething;
	}
}

export interface RoomBattlePlayerOptions {
	user: User;
	/** should be '' for random teams */
	team?: string;
	rating?: number;
	inviteOnly?: boolean;
	hidden?: boolean;
}

export interface RoomBattleOptions {
	format: string;
	/**
	 * length should be equal to the format's playerCount, except in two
	 * special cases:
	 * - `/importinputlog`, where it's empty (players have to be invited/restored)
	 * - challenge ffa/multi, where it's 2 (the rest have to be invited)
	 * - restoring saved battles after a restart (players should be manually restored)
	 * In all special cases, either `delayedStart` or `inputLog` must be set
	 */
	players: RoomBattlePlayerOptions[];
	delayedStart?: boolean | 'multi';
	challengeType?: ChallengeType;
	allowRenames?: boolean;
	rated?: number | boolean | null;
	tour?: Tournament | null;
	inputLog?: string;
	ratedMessage?: string;
	seed?: PRNGSeed;
	roomid?: RoomID;
	/** For battles restored after a restart */
	delayedTimer?: boolean;
	/**
	 * If false and the format is a best-of format, creates a best-of game
	 * rather than a battle.
	 */
	isBestOfSubBattle?: boolean;
}

export class RoomBattle extends RoomGame<RoomBattlePlayer> {
	override readonly gameid = 'battle' as ID;
	override readonly room!: GameRoom;
	override readonly title: string;
	override readonly allowRenames: boolean;
	readonly format: string;
	/** Will exist even if the game is unrated, in case it's later forced to be rated */
	readonly ladder: string;
	readonly gameType: string | undefined;
	readonly challengeType: ChallengeType;
	/**
	 * The lower player's rating, for searching purposes.
	 * 0 for unrated battles. 1 for unknown ratings.
	 */
	readonly rated: number;
	/**
	 * userid that requested extraction -> playerids that accepted the extraction
	 */
	readonly allowExtraction: { [k: string]: Set<ID> } = {};
	readonly stream: Streams.ObjectReadWriteStream<string>;
	override readonly timer: RoomBattleTimer;
	started = false;
	active = false;
	replaySaved: boolean | 'auto' = false;
	forcedSettings: { modchat?: string | null, privacy?: string | null } = {};
	p1: RoomBattlePlayer = null!;
	p2: RoomBattlePlayer = null!;
	p3: RoomBattlePlayer = null!;
	p4: RoomBattlePlayer = null!;
	inviteOnlySetter: ID | null = null;
	logData: AnyObject | null = null;
	endType: 'forfeit' | 'forced' | 'normal' = 'normal';
	/**
	 * If the battle is ended: an array of the number of Pokemon left for each side.
	 */
	score: number[] | null = null;
	inputLog: string[] | null = null;
	turn = 0;
	rqid = 1;
	requestCount = 0;
	options: RoomBattleOptions;
	frozen?: boolean;
	dataResolvers?: [((args: string[]) => void), ((error: Error) => void)][];
	constructor(room: GameRoom, options: RoomBattleOptions) {
		super(room);
		const format = Dex.formats.get(options.format, true);
		this.title = format.name;
		this.options = options;
		if (!this.title.endsWith(" Battle")) this.title += " Battle";
		this.allowRenames = options.allowRenames !== undefined ? !!options.allowRenames : (!options.rated && !options.tour);

		this.format = options.format;
		this.gameType = format.gameType;
		this.challengeType = options.challengeType || 'challenge';
		this.rated = options.rated === true ? 1 : options.rated || 0;
		this.ladder = typeof format.rated === 'string' ? toID(format.rated) : options.format;
		this.playerCap = format.playerCount;

		this.stream = PM.createStream();

		let ratedMessage = options.ratedMessage || '';
		if (this.rated) {
			ratedMessage = 'Rated battle';
		} else if (this.room.tour) {
			ratedMessage = 'Tournament battle';
		}

		this.room.battle = this;

		const battleOptions = {
			formatid: this.format,
			roomid: this.roomid,
			rated: ratedMessage,
			seed: options.seed,
		};
		if (options.inputLog) {
			void this.stream.write(options.inputLog);
		} else {
			void this.stream.write(`>start ` + JSON.stringify(battleOptions));
		}

		void this.listen();

		if (options.players.length > this.playerCap) {
			throw new Error(`${options.players.length} players passed to battle ${room.roomid} but ${this.playerCap} players expected`);
		}
		for (let i = 0; i < this.playerCap; i++) {
			const p = options.players[i];
			const player = this.addPlayer(p?.user || null, p || null);
			if (!player) throw new Error(`failed to create player ${i + 1} in ${room.roomid}`);
		}
		if (options.inputLog) {
			let scanIndex = 0;
			for (const player of this.players) {
				const nameIndex1 = options.inputLog.indexOf(`"name":"`, scanIndex);
				const nameIndex2 = options.inputLog.indexOf(`"`, nameIndex1 + 8);
				if (nameIndex1 < 0 || nameIndex2 < 0) break; // shouldn't happen. incomplete inputlog?
				scanIndex = nameIndex2 + 1;
				const name = options.inputLog.slice(nameIndex1 + 8, nameIndex2);
				player.name = name;
				player.hasTeam = true;
			}
		}
		this.timer = new RoomBattleTimer(this);
		if (Config.forcetimer || this.format.includes('blitz')) this.timer.start();
		this.start();
	}

	checkActive() {
		const active = (this.started && !this.ended && this.players.every(p => p.active));
		Rooms.global.battleCount += (active ? 1 : 0) - (this.active ? 1 : 0);
		this.room.active = active;
		this.active = active;
		if (Rooms.global.battleCount === 0) Rooms.global.automaticKillRequest();
	}
	override choose(user: User, data: string) {
		if (this.frozen) {
			user.popup(`Your battle is currently paused, so you cannot move right now.`);
			return;
		}
		const player = this.playerTable[user.id];
		const [choice, rqid] = data.split('|', 2);
		if (!player) return;
		const request = player.request;
		if (request.isWait !== false && request.isWait !== true) {
			player.sendRoom(`|error|[Invalid choice] There's nothing to choose`);
			return;
		}
		const allPlayersWait = this.players.every(p => !!p.request.isWait);
		if (allPlayersWait || // too late
			(rqid && rqid !== `${request.rqid}`)) { // WAY too late
			player.sendRoom(`|error|[Invalid choice] Sorry, too late to make a different move; the next turn has already started`);
			return;
		}
		request.isWait = true;
		request.choice = choice;

		void this.stream.write(`>${player.slot} ${choice}`);
	}
	override undo(user: User, data: string) {
		const player = this.playerTable[user.id];
		const [, rqid] = data.split('|', 2);
		if (!player) return;
		const request = player.request;
		if (request.isWait !== true) {
			player.sendRoom(`|error|[Invalid choice] There's nothing to cancel`);
			return;
		}
		const allPlayersWait = this.players.every(p => !!p.request.isWait);
		if (allPlayersWait || // too late
			(rqid && rqid !== `${request.rqid}`)) { // WAY too late
			player.sendRoom(`|error|[Invalid choice] Sorry, too late to cancel; the next turn has already started`);
			return;
		}
		request.isWait = false;

		void this.stream.write(`>${player.slot} undo`);
	}
	override joinGame(user: User, slot?: SideID, playerOpts?: { team?: string }) {
		if (user.id in this.playerTable) {
			user.popup(`You have already joined this battle.`);
			return false;
		}

		const validSlots = this.players.filter(player => !player.id).map(player => player.slot);

		if (slot && !validSlots.includes(slot)) {
			user.popup(`This battle already has a user in slot ${slot}.`);
			return false;
		}

		if (!validSlots.length) {
			user.popup(`This battle already has ${this.playerCap} players.`);
			return false;
		}

		slot ??= this.players.find(player => player.invite === user.id)?.slot;
		if (!slot && validSlots.length > 1) {
			user.popup(`Which slot would you like to join into? Use something like \`/joingame ${validSlots[0]}\``);
			return false;
		}
		slot ??= validSlots[0];

		if (this[slot].invite === user.id) {
			this.room.auth.set(user.id, Users.PLAYER_SYMBOL);
		} else if (!user.can('joinbattle', null, this.room)) {
			user.popup(`You must be set as a player to join a battle you didn't start. Ask a player to use /addplayer on you to join this battle.`);
			return false;
		}

		this.setPlayerUser(this[slot], user, playerOpts);
		if (validSlots.length - 1 <= 0) {
			// all players have joined, start the battle
			// onCreateBattleRoom crashes if some users are unavailable at start of battle
			// what do we do??? no clue but I guess just exclude them from the array for now
			const users = this.players.map(player => player.getUser()).filter(Boolean) as User[];
			Rooms.global.onCreateBattleRoom(users, this.room, { rated: this.rated });
			this.started = true;
			this.room.add(`|uhtmlchange|invites|`);
		} else if (!this.started && this.invitesFull()) {
			this.sendInviteForm(true);
		}
		if (user.inRooms.has(this.roomid)) this.onConnect(user);
		this.room.update();
		return true;
	}
	override leaveGame(user: User) {
		if (!user) return false; // ...
		if (this.room.rated || this.room.tour) {
			user.popup(`Players can't be swapped out in a ${this.room.tour ? "tournament" : "rated"} battle.`);
			return false;
		}
		const player = this.playerTable[user.id];
		if (!player) {
			user.popup(`Failed to leave battle - you're not a player.`);
			return false;
		}
		Chat.runHandlers('onBattleLeave', user, this.room);

		this.updatePlayer(player, null);
		this.room.update();
		return true;
	}

	override startTimer() {
		this.timer.start();
	}

	async listen() {
		let disconnected = false;
		try {
			for await (const next of this.stream) {
				if (!this.room) return; // room deleted in the middle of simulation
				this.receive(next.split('\n'));
			}
		} catch (err: any) {
			// Disconnected processes are already crashlogged when they happen;
			// also logging every battle room would overwhelm the crashlogger
			if (err.message.includes('Process disconnected')) {
				disconnected = true;
			} else {
				Monitor.crashlog(err, 'A sim stream');
			}
		}
		if (!this.ended) {
			this.room.add(`|bigerror|The simulator process crashed. We've been notified and will fix this ASAP.`);
			if (!disconnected) Monitor.crashlog(new Error(`Sim stream interrupted`), `A sim stream`);
			this.setEnded();
		}
	}
	override setEnded() {
		this.started = true;
		for (const player of this.players) {
			player.request = { rqid: 0, request: '', isWait: 'cantUndo', choice: '' };
		}
		super.setEnded();
		this.timer.end();
		this.checkActive();
	}
	receive(lines: string[]) {
		for (const player of this.players) player.wantsTie = false;

		switch (lines[0]) {
		case 'requesteddata':
			lines = lines.slice(1);
			const [resolver] = this.dataResolvers!.shift()!;
			resolver(lines);
			break;

		case 'update':
			for (const line of lines.slice(1)) {
				if (line.startsWith('|turn|')) {
					this.turn = parseInt(line.slice(6));
				}
				this.room.add(line);
				if (line.startsWith(`|bigerror|You will auto-tie if `) && Config.allowrequestingties && !this.room.tour) {
					this.room.add(`|-hint|If you want to tie earlier, consider using \`/offertie\`.`);
				}
			}
			this.room.update();
			this.checkActive();
			break;

		case 'sideupdate': {
			const slot = lines[1] as SideID;
			const player = this[slot];
			if (lines[2].startsWith(`|error|[Invalid choice] Can't do anything`)) {
				// ... should not happen
			} else if (lines[2].startsWith(`|error|[Invalid choice]`)) {
				const undoFailed = lines[2].includes(`Can't undo`);
				const request = this[slot].request;
				request.isWait = undoFailed ? 'cantUndo' : false;
				request.choice = '';
			} else if (lines[2].startsWith(`|request|`)) {
				this.rqid++;
				const request = JSON.parse(lines[2].slice(9));
				request.rqid = this.rqid;
				const requestJSON = JSON.stringify(request);
				this[slot].request = {
					rqid: this.rqid,
					request: requestJSON,
					isWait: request.wait ? 'cantUndo' : false,
					choice: '',
				};
				this.requestCount++;
				player?.sendRoom(`|request|${requestJSON}`);
				this.timer.nextRequest(player);
				break;
			}
			player?.sendRoom(lines[2]);
			break;
		}

		case 'error': {
			if (process.uptime() * 1000 < LOCKDOWN_PERIOD) {
				const error = new Error();
				error.stack = lines.slice(1).join('\n');
				// lock down the server
				Rooms.global.startLockdown(error);
			}
			break;
		}

		case 'end':
			this.logData = JSON.parse(lines[1]);
			this.score = this.logData!.score;
			this.inputLog = this.logData!.inputLog;
			this.started = true;
			void this.end(this.logData!.winner);
			break;
		}
	}
	end(winnerName: unknown) {
		if (this.ended) return;
		this.setEnded();
		// Declare variables here in case we need them for non-rated battles logging.
		let p1score = 0.5;
		const winnerid = toID(winnerName);

		// Check if the battle was rated to update the ladder, return its response, and log the battle.
		if (winnerid === this.p1.id) {
			p1score = 1;
		} else if (winnerid === this.p2.id) {
			p1score = 0;
		}
		Chat.runHandlers('onBattleEnd', this, winnerid, this.players.map(p => p.id));
		if (this.room.rated && !this.options.isBestOfSubBattle) {
			void this.updateLadder(p1score, winnerid);
		} else if (Config.logchallenges) {
			void this.logBattle(p1score);
		} else if (!this.options.isBestOfSubBattle) {
			this.logData = null;
		}
		this.room.parent?.game?.onBattleWin?.(this.room, winnerid);
		// If the room's replay was hidden, don't let users join after the game is over
		if (this.room.hideReplay) {
			this.room.settings.modjoin = '%';
			this.room.setPrivate('hidden');
		}
		this.room.update();

		// so it stops showing up in the users' games list
		for (const player of this.players) {
			player.getUser()?.games.delete(this.roomid);
		}

		// If a replay was saved at any point or we were configured to autosavereplays,
		// reupload when the battle is over to overwrite the partial data (and potentially
		// reflect any changes that may have been made to the replay's hidden status).
		if (this.replaySaved || Config.autosavereplays) {
			const options = Config.autosavereplays === 'private' ? undefined : 'silent';
			return this.room.uploadReplay(undefined, undefined, options);
		}
	}
	async updateLadder(p1score: number, winnerid: ID) {
		this.room.rated = 0;
		const winner = Users.get(winnerid);
		if (winner && !winner.registered) {
			this.room.sendUser(winner, '|askreg|' + winner.id);
		}
		const [score, p1rating, p2rating] = await Ladders(this.ladder).updateRating(
			this.p1.name, this.p2.name, p1score, this.room
		);
		void this.logBattle(score, p1rating, p2rating);
		Chat.runHandlers('onBattleRanked', this, winnerid, [p1rating, p2rating], [this.p1.id, this.p2.id]);
	}
	async logBattle(
		p1score: number, p1rating: AnyObject | null = null, p2rating: AnyObject | null = null,
		p3rating: AnyObject | null = null, p4rating: AnyObject | null = null
	) {
		if (Dex.formats.get(this.format, true).noLog) return;
		const logData = this.logData;
		if (!logData) return;
		this.logData = null; // deallocate to save space
		logData.log = this.room.getLog(-1).split('\n'); // replay log (exact damage)

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
		if (this.replaySaved) logData.replaySaved = this.replaySaved;
		logData.p2rating = p2rating;
		if (this.playerCap > 2) {
			logData.p3rating = p3rating;
			logData.p4rating = p4rating;
		}
		logData.endType = this.endType;
		if (!p1rating) logData.ladderError = true;
		const date = new Date();
		logData.timestamp = `${date}`;
		logData.roomid = this.room.roomid;
		logData.format = this.room.format;

		const logsubfolder = Chat.toTimestamp(date).split(' ')[0];
		const logfolder = logsubfolder.split('-', 2).join('-');
		const tier = Dex.formats.get(this.room.format).id;
		const logpath = `${logfolder}/${tier}/${logsubfolder}/`;

		await Monitor.logPath(logpath).mkdirp();
		await Monitor.logPath(`${logpath}${this.room.getReplayData().id}.log.json`).write(JSON.stringify(logData));
		// console.log(JSON.stringify(logData));
	}
	override onConnect(user: User, connection: Connection | null = null) {
		if (this.ended && this.room.parent?.game?.constructor.name === 'BestOfGame') {
			const parentGame = this.room.parent.game as BestOfGame;
			parentGame.playerTable[user.id]?.updateReadyButton();
		}
		// this handles joining a battle in which a user is a participant,
		// where the user has already identified before attempting to join
		// the battle
		const player = this.playerTable[user.id];
		if (!player) return;
		player.updateChannel(connection || user);
		const request = player.request;
		if (request.request) {
			let data = `|request|${request.request}`;
			if (request.choice) data += `\n|sentchoice|${request.choice}`;
			(connection || user).sendTo(this.roomid, data);
		}
		if (!this.started) {
			this.sendInviteForm(connection || user);
		}
		if (!player.active) this.onJoin(user);
	}
	override onRename(user: User, oldUserid: ID, isJoining: boolean, isForceRenamed: boolean) {
		if (user.id === oldUserid) return;
		if (!this.playerTable) {
			// !! should never happen but somehow still does
			user.games.delete(this.roomid);
			return;
		}
		if (!(oldUserid in this.playerTable)) {
			if (user.id in this.playerTable) {
				// this handles a user renaming themselves into a user in the
				// battle (e.g. by using /nick)
				this.onConnect(user);
			}
			return;
		}
		if (!this.allowRenames) {
			const player = this.playerTable[oldUserid];
			if (player) {
				const message = isForceRenamed ? " lost by having an inappropriate name." : " forfeited by changing their name.";
				this.forfeitPlayer(player, message);
			}
			if (!(user.id in this.playerTable)) {
				user.games.delete(this.roomid);
			}
			return;
		}
		if (!user.named) {
			this.onLeave(user, oldUserid);
			return;
		}
		if (user.id in this.playerTable) return;
		const player = this.playerTable[oldUserid];
		if (player) {
			this.updatePlayer(player, user);
		}
		const options = {
			name: user.name,
			avatar: user.avatar,
		};
		void this.stream.write(`>player ${player.slot} ` + JSON.stringify(options));
	}
	override onJoin(user: User) {
		const player = this.playerTable[user.id];
		if (player && !player.active) {
			player.active = true;
			this.timer.checkActivity();
			this.room.add(`|player|${player.slot}|${user.name}|${user.avatar}|`);
			Chat.runHandlers('onBattleJoin', player.slot, user, this);
		}
	}
	override onLeave(user: User, oldUserid?: ID) {
		const player = this.playerTable[oldUserid || user.id];
		if (player?.active) {
			player.sendRoom(`|request|null`);
			player.active = false;
			this.timer.checkActivity();
			this.room.add(`|player|${player.slot}|`);
		}
	}

	win(user: User) {
		if (!user) {
			this.tie();
			return true;
		}
		const player = this.playerTable[user.id];
		if (!player) return false;
		void this.stream.write(`>forcewin ${player.slot}`);
	}
	tie() {
		void this.stream.write(`>forcetie`);
	}
	tiebreak() {
		void this.stream.write(`>tiebreak`);
	}
	override forfeit(user: User | string, message = '') {
		if (typeof user !== 'string') user = user.id;
		else user = toID(user);

		if (!(user in this.playerTable)) return false;
		return this.forfeitPlayer(this.playerTable[user], message);
	}

	forfeitPlayer(player: RoomBattlePlayer, message = '') {
		if (this.ended || !this.started || player.eliminated) return false;

		player.eliminated = true;
		this.room.add(`|-message|${player.name}${message || ' forfeited.'}`);
		this.endType = 'forfeit';
		if (this.playerCap > 2) {
			player.sendRoom(`|request|null`);
			this.setPlayerUser(player, null);
		}
		void this.stream.write(`>forcelose ${player.slot}`);
		return true;
	}

	/**
	 * playerOpts should be empty only if importing an inputlog
	 * (so the player isn't recreated)
	 */
	override addPlayer(user: User | string | null, playerOpts?: RoomBattlePlayerOptions | null) {
		const player = super.addPlayer(user);
		if (typeof user === 'string') user = null;
		if (!player) return null;
		const slot = player.slot;
		this[slot] = player;

		if (playerOpts) {
			const options = {
				name: player.name,
				avatar: user ? `${user.avatar}` : '',
				team: playerOpts.team || undefined,
				rating: Math.round(playerOpts.rating || 0),
			};
			void this.stream.write(`>player ${slot} ${JSON.stringify(options)}`);
			player.hasTeam = true;
		}

		if (user) {
			this.room.auth.set(player.id, Users.PLAYER_SYMBOL);
		}
		if (user?.inRooms.has(this.roomid)) this.onConnect(user);
		return player;
	}

	checkPrivacySettings(options: RoomBattleOptions & Partial<RoomSettings>) {
		let inviteOnly = false;
		const privacySetter = new Set<ID>([]);
		for (const p of options.players) {
			if (p.user) {
				if (p.inviteOnly) {
					inviteOnly = true;
					privacySetter.add(p.user.id);
				} else if (p.hidden) {
					privacySetter.add(p.user.id);
				}
				this.checkForcedUserSettings(p.user);
			}
		}

		if (privacySetter.size) {
			const room = this.room;
			if (this.forcedSettings.privacy) {
				room.setPrivate(false);
				room.settings.modjoin = null;
				room.add(`|raw|<div class="broadcast-blue"><strong>This battle is required to be public due to a player having a name starting with '${this.forcedSettings.privacy}'.</div>`);
			} else if (!options.tour || (room.tour?.allowModjoin)) {
				room.setPrivate('hidden');
				if (inviteOnly) room.settings.modjoin = '%';
				room.privacySetter = privacySetter;
				if (inviteOnly) {
					room.settings.modjoin = '%';
					room.add(`|raw|<div class="broadcast-red"><strong>This battle is invite-only!</strong><br />Users must be invited with <code>/invite</code> (or be staff) to join</div>`);
				}
			}
		}
	}

	checkForcedUserSettings(user: User) {
		this.forcedSettings = {
			modchat: this.forcedSettings.modchat || RoomBattle.battleForcedSetting(user, 'modchat'),
			privacy: !!this.options.rated && (this.forcedSettings.privacy || RoomBattle.battleForcedSetting(user, 'privacy')),
		};
		if (
			this.players.some(p => p.getUser()?.battleSettings.special) ||
			(this.rated && this.forcedSettings.modchat)
		) {
			this.room.settings.modchat = '\u2606';
		}
	}

	static battleForcedSetting(user: User, key: 'modchat' | 'privacy') {
		if (Config.forcedpublicprefixes) {
			for (const prefix of Config.forcedpublicprefixes) {
				Chat.plugins['username-prefixes']?.prefixManager.addPrefix(prefix, 'privacy');
			}
			delete Config.forcedpublicprefixes;
		}
		if (!Config.forcedprefixes) return null;
		for (const { type, prefix } of Config.forcedprefixes) {
			if (user.id.startsWith(toID(prefix)) && type === key) return prefix;
		}
		return null;
	}

	makePlayer(user: User) {
		const num = (this.players.length + 1) as PlayerIndex;
		return new RoomBattlePlayer(user, this, num);
	}

	override setPlayerUser(player: RoomBattlePlayer, user: User | null, playerOpts?: { team?: string }) {
		if (user === null && this.room.auth.get(player.id) === Users.PLAYER_SYMBOL) {
			this.room.auth.set(player.id, '+');
		}
		super.setPlayerUser(player, user);

		player.invite = '';
		const slot = player.slot;
		if (user) {
			player.active = user.inRooms.has(this.roomid);
			player.knownActive = true;
			const options = {
				name: player.name,
				avatar: user.avatar,
				team: playerOpts?.team,
			};
			void this.stream.write(`>player ${slot} ` + JSON.stringify(options));
			if (playerOpts) player.hasTeam = true;

			this.room.add(`|player|${slot}|${player.name}|${user.avatar}|`);
			Chat.runHandlers('onBattleJoin', slot as string, user, this);
		} else {
			player.active = false;
			player.knownActive = false;
			const options = {
				name: '',
			};
			void this.stream.write(`>player ${slot} ` + JSON.stringify(options));

			this.room.add(`|player|${slot}|`);
		}
	}

	start() {
		if (this.gameType === 'multi') {
			this.room.title = `Team ${this.p1.name} vs. Team ${this.p2.name}`;
		} else if (this.gameType === 'freeforall') {
			// p1 vs. p2 vs. p3 vs. p4 is too long of a title
			this.room.title = `${this.p1.name} and friends`;
		} else {
			this.room.title = `${this.p1.name} vs. ${this.p2.name}`;
		}
		this.room.send(`|title|${this.room.title}`);
		const suspectTest = Chat.plugins['suspect-tests']?.suspectTests[this.format] ||
			Chat.plugins['suspect-tests']?.suspectTests.suspects[this.format];
		if (suspectTest) {
			const format = Dex.formats.get(this.format);
			this.room.add(
				`|html|<div class="broadcast-blue"><strong>${format.name} is currently suspecting ${suspectTest.suspect}! ` +
				`For information on how to participate check out the <a href="${suspectTest.url}">suspect thread</a>.</strong></div>`
			).update();
		}

		// run onCreateBattleRoom handlers

		if (this.options.inputLog && this.players.every(player => player.hasTeam)) {
			// already started
			this.started = true;
		}
		const delayStart = this.options.delayedStart || !!this.options.inputLog;
		const users = this.players.map(player => {
			const user = player.getUser();
			if (!user && !delayStart) {
				throw new Error(`User ${player.id} not found on ${this.roomid} battle creation`);
			}
			return user;
		});
		if (!delayStart) {
			Rooms.global.onCreateBattleRoom(users as User[], this.room, { rated: this.rated });
			this.started = true;
		} else if (delayStart === 'multi') {
			this.room.add(`|uhtml|invites|<div class="broadcast broadcast-blue"><strong>This is a 4-player challenge battle</strong><br />The players will need to add more players before the battle can start.</div>`);
		}
	}

	invitesFull() {
		return this.players.every(player => player.id || player.invite);
	}
	/** true = send to every player; falsy = send to no one */
	sendInviteForm(connection: Connection | User | null | boolean) {
		if (connection === true) {
			for (const player of this.players) this.sendInviteForm(player.getUser());
			return;
		}
		if (!connection) return;

		const playerForms = this.players.map(player => (
			player.id ? (
				`<form><label>Player ${player.num}: <strong>${player.name}</strong></label></form>`
			) : player.invite ? (
				`<form data-submitsend="/msgroom ${this.roomid},/uninvitebattle ${player.invite}"><label>Player ${player.num}: <strong>${player.invite}</strong> (invited) <button>Uninvite</button></label></form>`
			) : (
				`<form data-submitsend="/msgroom ${this.roomid},/invitebattle {username}, p${player.num}"><label>Player ${player.num}: <input name="username" class="textbox" placeholder="Username" /></label> <button class="button">Add Player</button></form>`
			)
		));
		if (this.gameType === 'multi') {
			[playerForms[1], playerForms[2]] = [playerForms[2], playerForms[1]];
			playerForms.splice(2, 0, '&mdash; vs &mdash;');
		}
		connection.sendTo(
			this.room,
			`|uhtmlchange|invites|<div class="broadcast broadcast-blue"><strong>This battle needs more players to start</strong><br /><br />${playerForms.join(``)}</div>`
		);
	}

	override destroy() {
		if (!this.ended) {
			this.setEnded();
			this.room.parent?.game?.onBattleWin?.(this.room, '');
		}
		for (const player of this.players) {
			player.destroy();
		}
		this.playerTable = {};
		this.players = [];
		this.p1 = null!;
		this.p2 = null!;
		this.p3 = null!;
		this.p4 = null!;

		void this.stream.destroy();
		if (this.active) {
			Rooms.global.battleCount += -1;
			this.active = false;
		}

		(this as any).room = null;
		if (this.dataResolvers) {
			for (const [, reject] of this.dataResolvers) {
				// reject the promise, make whatever function called it return undefined
				reject(new Error('Battle was destroyed.'));
			}
		}
	}
	async getTeam(user: User | string) {
		// toID extracts user.id
		const id = toID(user);
		const player = this.playerTable[id];
		if (!player) return;
		return this.getPlayerTeam(player);
	}
	async getPlayerTeam(player: RoomBattlePlayer) {
		void this.stream.write(`>requestteam ${player.slot}`);
		const teamDataPromise = new Promise<string[]>((resolve, reject) => {
			if (!this.dataResolvers) this.dataResolvers = [];
			this.dataResolvers.push([resolve, reject]);
		});
		const resultStrings = await teamDataPromise;
		if (!resultStrings) return;
		const result = Teams.unpack(resultStrings[0]);
		return result;
	}
	override onChatMessage(message: string, user: User) {
		const parts = message.split('\n');
		for (const line of parts) {
			void this.stream.write(`>chat-inputlogonly ${user.getIdentity(this.room)}|${line}`);
		}
	}
	async getLog(): Promise<string[] | void> {
		if (!this.logData) this.logData = {};
		void this.stream.write('>requestlog');
		const logPromise = new Promise<string[]>((resolve, reject) => {
			if (!this.dataResolvers) this.dataResolvers = [];
			this.dataResolvers.push([resolve, reject]);
		});
		const result = await logPromise;
		return result;
	}
}

export class RoomBattleStream extends BattleStream {
	override readonly battle: Battle;
	constructor() {
		super({ keepAlive: true });
		this.battle = null!;
	}

	override _write(chunk: string) {
		const startTime = Date.now();
		if (this.battle && Config.debugsimprocesses && process.send) {
			process.send('DEBUG\n' + this.battle.inputLog.join('\n') + '\n' + chunk);
		}
		try {
			this._writeLines(chunk);
		} catch (err: any) {
			const battle = this.battle;
			Monitor.crashlog(err, 'A battle', {
				chunk,
				inputLog: battle ? '\n' + battle.inputLog.join('\n') : '',
				log: battle ? '\n' + battle.getDebugLog() : '',
			});

			this.push(`update\n|html|<div class="broadcast-red"><b>The battle crashed</b><br />Don't worry, we're working on fixing it.</div>`);
			if (battle) {
				for (const side of battle.sides) {
					if (side?.requestState) {
						this.push(`sideupdate\n${side.id}\n|error|[Invalid choice] The battle crashed`);
					}
				}
			}
			// public crashlogs only have the stack anyways
			this.push(`error\n${err.stack}`);
		}
		if (this.battle) this.battle.sendUpdates();
		const deltaTime = Date.now() - startTime;
		if (deltaTime > 1000) {
			Monitor.slow(`[slow battle] ${deltaTime}ms - ${chunk.replace(/\n/ig, ' | ')}`);
		}
	}
}

/*********************************************************
 * Process manager
 *********************************************************/

export const PM = new ProcessManager.StreamProcessManager(module, () => new RoomBattleStream(), message => {
	if (message.startsWith(`SLOW\n`)) {
		Monitor.slow(message.slice(5));
	}
});

if (!PM.isParentProcess) {
	// This is a child process!
	require('source-map-support').install();
	global.Config = require('./config-loader').Config;
	global.Dex = require('../sim/dex').Dex;
	global.Monitor = {
		crashlog(error: Error, source = 'A simulator process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
		slow(text: string) {
			process.send!(`CALLBACK\nSLOW\n${text}`);
		},
	};
	global.__version = { head: '' };
	try {
		const head = execSync('git rev-parse HEAD', {
			stdio: ['ignore', 'pipe', 'ignore'],
		});
		const merge = execSync('git merge-base origin/master HEAD', {
			stdio: ['ignore', 'pipe', 'ignore'],
		});
		global.__version.head = `${head}`.trim();
		const origin = `${merge}`.trim();
		if (origin !== global.__version.head) global.__version.origin = origin;
	} catch {}

	if (Config.crashguard) {
		// graceful crash - allow current battles to finish before restarting
		process.on('uncaughtException', err => {
			Monitor.crashlog(err, 'A simulator process');
		});
		process.on('unhandledRejection', err => {
			Monitor.crashlog(err as any || {}, 'A simulator process Promise');
		});
	}

	// eslint-disable-next-line no-eval
	Repl.start(`sim-${process.pid}`, cmd => eval(cmd));
} else {
	PM.spawn(global.Config ? Config.simulatorprocesses : 1);
}
