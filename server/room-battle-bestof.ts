import { Utils } from '../lib';
import { RoomGamePlayer, RoomGame } from "./room-game";
import type { RoomBattlePlayerOptions, RoomBattleOptions } from './room-battle';
import type { PrivacySetting, RoomSettings } from './rooms';

const BEST_OF_IN_BETWEEN_TIME = 40;

export class BestOfPlayer extends RoomGamePlayer<BestOfGame> {
	wins = 0;
	ready: boolean | null = null;
	options: Omit<RoomBattlePlayerOptions, 'user'> & { user: null };
	dcAutoloseTime: number | null = null;
	constructor(user: User | null, game: BestOfGame, num: number, options: RoomBattlePlayerOptions) {
		super(user, game, num);
		this.options = { ...options, user: null };
	}
	avatar() {
		let avatar = Users.get(this.id)?.avatar;
		if (!avatar || typeof avatar === 'number') avatar = 'unknownf';
		const url = Chat.plugins.avatars?.Avatars.src(avatar) ||
			`https://${Config.routes.client}/sprites/trainers/${avatar}.png`;
		return url;
	}
	updateReadyButton() {
		const user = this.getUser();
		if (!user?.connected) return;

		this.dcAutoloseTime = null;
		const room = this.game.room;
		const battleRoom = this.game.games[this.game.games.length - 1]?.room as Room | undefined;
		const gameNum = this.game.games.length + 1;

		if (this.ready === false) {
			const notification = `|tempnotify|choice|Next game|It's time for game ${gameNum} in your best-of-${this.game.bestOf}!`;
			if (battleRoom && user.inRooms.has(battleRoom.roomid)) {
				battleRoom.send(notification);
			} else {
				this.sendRoom(notification);
			}
		} else {
			const notification = `|tempnotifyoff|choice`;
			battleRoom?.sendUser(user, notification);
			this.sendRoom(notification);
		}

		if (this.ready === null) {
			const button = `|c|~|/uhtml controls,`;
			this.sendRoom(button);
			battleRoom?.sendUser(user, button);
			return;
		}

		const cmd = `/msgroom ${room.roomid},/confirmready`;
		const button = `|c|~|/uhtml controls,<div class="infobox"><p style="margin:6px">Are you ready for game ${gameNum}, ${this.name}?</p><p style="margin:6px">` +
			(this.ready ?
				`<button class="button" disabled><i class="fa fa-check"></i> I'm ready!</button> &ndash; waiting for opponent...` :
				`<button class="button notifying" name="send" value="${cmd}">I'm ready!</button>`
			) +
			`</p></div>`;
		this.sendRoom(button);
		battleRoom?.sendUser(user, button);
	}
}

export class BestOfGame extends RoomGame<BestOfPlayer> {
	override readonly gameid = 'bestof' as ID;
	override allowRenames = false;
	override room!: GameRoom;
	bestOf: number;
	format: Format;
	winThreshold: number;
	options: Omit<RoomBattleOptions, 'players'> & { parent: Room, players: null };
	forcedSettings: { modchat?: string | null, privacy?: string | null } = {};
	ties = 0;
	games: { room: GameRoom, winner: BestOfPlayer | null | undefined, rated: number }[] = [];
	playerNum = 0;
	/** null = tie, undefined = not ended */
	winner: BestOfPlayer | null | undefined = undefined;
	/** when waiting between battles, this is the just-ended battle room, the one with the |tempnotify| */
	waitingBattle: GameRoom | null = null;
	nextBattleTimerEnd: number | null = null;
	nextBattleTimer: NodeJS.Timeout | null = null;
	/** Does NOT control bestof's own timer, which is always-on. Controls timers in sub-battles. */
	needsTimer = false;
	score: number[] | null = null;
	constructor(room: GameRoom, options: RoomBattleOptions) {
		super(room);
		this.gameid = 'bestof' as ID;
		this.format = Dex.formats.get(options.format);
		this.bestOf = Number(Dex.formats.getRuleTable(this.format).valueRules.get('bestof'))!;
		this.winThreshold = Math.floor(this.bestOf / 2) + 1;
		this.title = this.format.name;
		if (!toID(this.title).includes('bestof')) {
			this.title += ` (Best-of-${this.bestOf})`;
		}
		this.room.bestOf = this;
		this.options = {
			...options,
			isBestOfSubBattle: true,
			parent: this.room,
			allowRenames: false,
			players: null,
		};
		for (const playerOpts of options.players) {
			this.addPlayer(playerOpts.user, playerOpts);
		}
		process.nextTick(() => this.nextGame());
	}
	override onConnect(user: User) {
		const player = this.playerTable[user.id];
		player?.sendRoom('|cantleave|');
		player?.updateReadyButton();
	}
	override makePlayer(user: User | null, options: RoomBattlePlayerOptions): BestOfPlayer {
		return new BestOfPlayer(user, this, ++this.playerNum, options);
	}
	override addPlayer(user: User, options: RoomBattlePlayerOptions) {
		const player = super.addPlayer(user, options);
		if (!player) throw new Error(`Failed to make player ${user} in ${this.roomid}`);
		this.room.auth.set(user.id, Users.PLAYER_SYMBOL);
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
				room.add(`|raw|<div class="broadcast-blue"><strong>This best-of set is required to be public due to a player having a name starting with '${this.forcedSettings.privacy}'.</div>`);
			} else if (!options.tour || (room.tour?.allowModjoin)) {
				room.setPrivate('hidden');
				if (inviteOnly) room.settings.modjoin = '%';
				room.privacySetter = privacySetter;
				if (inviteOnly) {
					room.settings.modjoin = '%';
					room.add(`|raw|<div class="broadcast-red"><strong>This best-of set is invite-only!</strong><br />Users must be invited with <code>/invite</code> (or be staff) to join</div>`);
				}
			}
		}
	}
	checkForcedUserSettings(user: User) {
		this.forcedSettings = {
			modchat: this.forcedSettings.modchat || Rooms.RoomBattle.battleForcedSetting(user, 'modchat'),
			privacy: this.forcedSettings.privacy || Rooms.RoomBattle.battleForcedSetting(user, 'privacy'),
		};
		if (
			this.players.some(p => p.getUser()?.battleSettings.special) ||
			(this.options.rated && this.forcedSettings.modchat)
		) {
			this.room.settings.modchat = '\u2606';
		}
	}
	setPrivacyOfGames(privacy: PrivacySetting) {
		for (let i = 0; i < this.games.length; i++) {
			const room = this.games[i].room;
			const prevRoom = this.games[i - 1]?.room;
			const gameNum = i + 1;

			room.setPrivate(privacy);
			this.room.add(`|uhtmlchange|game${gameNum}|<a href="/${room.roomid}">${room.title}</a>`);
			room.add(`|uhtmlchange|bestof|<h2><strong>Game ${gameNum}</strong> of <a href="/${this.roomid}">a best-of-${this.bestOf}</a></h2>`).update();
			if (prevRoom) {
				prevRoom.add(`|uhtmlchange|next|Next: <a href="/${room.roomid}"><strong>Game ${gameNum} of ${this.bestOf}</strong></a>`).update();
			}
		}
		this.updateDisplay();
	}
	clearWaiting() {
		this.waitingBattle = null;
		for (const player of this.players) {
			player.ready = null;
			player.updateReadyButton();
		}
		if (this.nextBattleTimer) {
			clearInterval(this.nextBattleTimer);
			this.nextBattleTimerEnd = null;
		}
		this.nextBattleTimerEnd = null;
		this.nextBattleTimer = null;
	}
	getOptions(): RoomBattleOptions | null {
		const players = this.players.map(player => ({
			...player.options,
			user: player.getUser()!,
		}));
		if (players.some(p => !p.user)) {
			return null;
		}
		return {
			...this.options,
			players,
		};
	}
	nextGame() {
		const prevBattleRoom = this.waitingBattle;
		if (!prevBattleRoom && this.games.length) return; // should never happen
		this.clearWaiting();

		const options = this.getOptions();
		if (!options) {
			for (const p of this.players) {
				if (!p.getUser()) {
					// tbc this isn't just being offline, it's changing name or being offline for 15 minutes
					this.forfeitPlayer(p, ` lost by being unavailable at the start of a game.`);
					return;
				}
			}
			throw new Error(`Failed to get options for ${this.roomid}`);
		}
		const battleRoom = Rooms.createBattle(options);
		// shouldn't happen even in lockdown
		if (!battleRoom) throw new Error("Failed to create battle for " + this.title);
		this.games.push({
			room: battleRoom,
			winner: undefined,
			rated: battleRoom.rated,
		});
		// the absolute result is what counts for rating
		battleRoom.rated = 0;
		if (this.needsTimer) {
			battleRoom.battle?.timer.start();
		}
		const gameNum = this.games.length;
		const p1 = this.players[0];
		const p2 = this.players[1];
		battleRoom.add(
			Utils.html`|html|<table width="100%"><tr><td align="left">${p1.name}</td><td align="right">${p2.name}</tr>` +
			`<tr><td align="left">${this.renderWins(p1)}</td><td align="right">${this.renderWins(p2)}</tr></table>`
		);
		battleRoom.add(
			`|uhtml|bestof|<h2><strong>Game ${gameNum}</strong> of <a href="/${this.roomid}">a best-of-${this.bestOf}</a></h2>`
		).update();

		this.room.add(`|html|<h2>Game ${gameNum}</h2>`);
		this.room.add(Utils.html`|uhtml|game${gameNum}|<a href="/${battleRoom.roomid}">${battleRoom.title}</a>`);
		this.updateDisplay();

		prevBattleRoom?.add(
			`|uhtml|next|Next: <a href="/${battleRoom.roomid}"><strong>Game ${gameNum} of ${this.bestOf}</strong></a>`
		).update();
	}
	renderWins(player: BestOfPlayer) {
		const wins = this.games.filter(game => game.winner === player).length;
		const winBuf = `<i class="fa fa-circle"></i> `.repeat(wins);
		const restBuf = `<i class="fa fa-circle-o"></i> `.repeat(this.winThreshold - wins);
		return player.num === 1 ? winBuf + restBuf : restBuf + winBuf;
	}
	updateDisplay() {
		const p1name = this.players[0].name;
		const p2name = this.players[1].name;
		let buf = Utils.html`<br /><strong>${p1name} and ${p2name}'s Best-of-${this.bestOf} progress:</strong><br />`;
		buf += '<table>';
		for (const p of this.players) {
			buf += Utils.html`<tr><td>${p.name}: </td><td>`;
			for (let i = 0; i < this.bestOf; i++) {
				if (this.games[i]?.winner === p) {
					buf += `<i class="fa fa-circle"></i>`;
				} else {
					buf += `<i class="fa fa-circle-o"></i>`;
				}
				if (i !== this.bestOf - 1) {
					buf += ` `;
				}
			}
			buf += `</td></tr>`;
		}
		buf += `</table><br /><br />`;
		buf += `<table><tr>`;

		for (const i of [0, null, 1]) {
			if (i === null) {
				buf += `<td></td>`;
				continue;
			}
			buf += Utils.html`<td><center><strong>${this.players[i].name}</strong></center></td>`;
		}

		buf += `</tr><tr>`;

		for (const i of [0, null, 1]) {
			if (i === null) {
				buf += `<td></td>`;
				continue;
			}
			const p = this.players[i];
			const mirrorLeftPlayer = !i ? ' style="transform: scaleX(-1)"' : "";
			buf += `<td><center>`;
			buf += `<img class="trainersprite"${mirrorLeftPlayer} src="${p.avatar()}" />`;
			buf += `</center></td>`;
		}

		buf += `</tr><tr>`;

		for (const i of [0, null, 1]) {
			if (i === null) {
				buf += `<td> vs </td>`;
				continue;
			}
			const team = Teams.unpack(this.players[i].options.team || "");
			if (!team || !Dex.formats.getRuleTable(this.format).has('teampreview')) {
				buf += `<td>`;
				buf += `<psicon pokemon="unknown" /> `.repeat(3);
				buf += `<br />`;
				buf += `<psicon pokemon="unknown" /> `.repeat(3);
				buf += `</td>`;
				continue;
			}
			const mirrorLeftPlayer = !i ? ' style="transform: scaleX(-1)"' : "";
			buf += `<td>`;
			for (const [j, set] of team.entries()) {
				if (j % 3 === 0 && j > 1) buf += `<br />`;
				buf += `<psicon pokemon="${set.species}"${mirrorLeftPlayer} />`;
			}
			buf += `</td>`;
		}
		buf += `</tr></table>`;
		this.room.add(`|fieldhtml|<center>${buf}</center>`);

		buf = this.games.map(({ room, winner }, index) => {
			let progress = `being played`;
			if (winner) progress = Utils.html`won by ${winner.name}`;
			if (winner === null) progress = `tied`;
			return Utils.html`<p>Game ${index + 1}: <a href="/${room.roomid}"><strong>${progress}</strong></a></p>`;
		}).join('');
		if (this.winner) {
			buf += Utils.html`<p>${this.winner.name} won!</p>`;
		} else if (this.winner === null) {
			buf += `<p>The battle was tied.</p>`;
		}
		this.room.add(`|controlshtml|<center>${buf}</center>`);
		this.room.update();
	}

	override startTimer() {
		this.needsTimer = true;
		for (const { room } of this.games) {
			room.battle?.timer.start();
		}
	}

	override onBattleWin(room: Room, winnerid: ID) {
		if (this.ended) return; // can happen if the bo3 is destroyed fsr

		const winner = winnerid ? this.playerTable[winnerid] : null;
		this.games[this.games.length - 1].winner = winner;
		if (winner) {
			winner.wins++;
			const loserPlayer = room.battle!.players.find(p => p.num !== winner.num);
			if (loserPlayer && loserPlayer.dcSecondsLeft <= 0) { // disconnection means opp wins the set
				return this.forfeit(loserPlayer.name, ` lost the series due to inactivity.`);
			}
			this.room.add(Utils.html`|html|${winner.name} won game ${this.games.length}!`).update();
			if (winner.wins >= this.winThreshold) {
				return this.end(winner.id);
			}
		} else {
			this.ties++;
			this.winThreshold = Math.floor((this.bestOf - this.ties) / 2) + 1;
			this.room.add(`|html|Game ${this.games.length} was a tie.`).update();
		}
		if (this.games.length >= this.bestOf) {
			return this.end(''); // overall tie
		}

		// no one has won, skip onwards
		this.promptNextGame(room);
	}
	promptNextGame(room: Room) {
		if (!room.battle || this.winner) return; // ???
		this.updateDisplay();
		this.waitingBattle = room;
		const now = Date.now();
		this.nextBattleTimerEnd = now + BEST_OF_IN_BETWEEN_TIME * 1000;
		for (const player of this.players) {
			player.ready = false;
			const dcAutoloseTime = now + room.battle.players[player.num - 1].dcSecondsLeft * 1000;
			if (dcAutoloseTime < this.nextBattleTimerEnd) {
				player.dcAutoloseTime = dcAutoloseTime;
			}
			player.updateReadyButton();
		}
		this.nextBattleTimer = setInterval(() => this.pokeNextBattleTimer(), 10000);
	}
	pokeNextBattleTimer() {
		if (!this.nextBattleTimerEnd || !this.nextBattleTimer) return; // ??
		if (Date.now() >= this.nextBattleTimerEnd) {
			return this.nextGame();
		}
		for (const p of this.players) {
			if (!p.ready) {
				const now = Date.now() - 100; // fudge to make rounding work better
				if (p.dcAutoloseTime && now > p.dcAutoloseTime) {
					return this.forfeit(p.name, ` lost the series due to inactivity.`);
				}
				const message = (p.dcAutoloseTime ?
					`|inactive|${p.name} has ${Chat.toDurationString(p.dcAutoloseTime - now)} to reconnect!` :
					`|inactive|${p.name} has ${Chat.toDurationString(this.nextBattleTimerEnd - now)} to confirm battle start!`
				);
				this.waitingBattle?.add(message);
				this.room.add(message);
			}
		}
		this.waitingBattle?.update();
		this.room.update();
	}
	confirmReady(user: User) {
		const player = this.playerTable[user.id];
		if (!player) {
			throw new Chat.ErrorMessage("You aren't a player in this best-of set.");
		}
		if (!this.waitingBattle) {
			throw new Chat.ErrorMessage("The battle is not currently waiting for ready confirmation.");
		}

		player.ready = true;
		player.updateReadyButton();
		const readyMsg = `||${player.name} is ready for game ${this.games.length + 1}.`;
		this.waitingBattle.add(readyMsg).update();
		this.room.add(readyMsg).update();
		if (this.players.every(p => p.ready)) {
			this.nextGame();
		}
	}
	override setEnded() {
		this.clearWaiting();
		super.setEnded();
	}
	end(winnerid: ID) {
		if (this.ended) return;
		this.setEnded();
		this.room.add(`|allowleave|`).update();
		const winner = winnerid ? this.playerTable[winnerid] : null;
		this.winner = winner;
		if (winner) {
			this.room.add(`|win|${winner.name}`);
		} else {
			this.room.add(`|tie`);
		}
		this.updateDisplay();
		this.room.update();
		const p1 = this.players[0];
		const p2 = this.players[1];
		this.score = this.players.map(p => p.wins);
		this.room.parent?.game?.onBattleWin?.(this.room, winnerid);
		// run elo stuff here
		let p1score = 0.5;
		if (winner === p1) {
			p1score = 1;
		} else if (winner === p2) {
			p1score = 0;
		}

		const { rated, room } = this.games[this.games.length - 1];
		if (rated) {
			void room.battle?.updateLadder(p1score, winnerid);
		}
	}
	override forfeit(user: User | string, message = '') {
		const userid = (typeof user !== 'string') ? user.id : toID(user);

		const loser = this.playerTable[userid];
		if (loser) this.forfeitPlayer(loser, message);
	}
	forfeitPlayer(loser: BestOfPlayer, message = '') {
		if (this.ended || this.winner) return false;

		this.winner = this.players.find(p => p !== loser)!;
		this.room.add(`||${loser.name}${message || ' forfeited.'}`);
		this.end(this.winner.id);

		const lastBattle = this.games[this.games.length - 1].room.battle;
		if (lastBattle && !lastBattle.ended) lastBattle.forfeit(loser.id, message);
		return true;
	}
	override destroy() {
		this.setEnded();
		for (const { room } of this.games) room.expire();
		this.games = [];
		for (const p of this.players) p.destroy();
		this.players = [];
		this.playerTable = {};
		this.winner = null;
	}
}
