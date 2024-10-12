/**
 * Room games
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Room games are an abstract representation of an activity that a room
 * can be focused on, such as a battle, tournament, or chat game like
 * Hangman. Rooms are limited to one roomgame at a time.
 *
 * Room games can keep track of designated players. If a user is a player,
 * they will not be allowed to change name until their games are complete.
 *
 * The player system is optional: Some games, like Hangman, don't designate
 * players and just allow any user in the room to play.
 *
 * @license MIT
 */

/**
 * Available globally as `Rooms.RoomGamePlayer`.
 *
 * Players are an abstraction for the people playing a `RoomGame`. They
 * may or may not be associated with a user. If they are, the game will
 * appear on the user's games list.
 *
 * Either way, they give a level of abstraction to players, allowing you
 * to easily sub out users or otherwise associate/dissociate users.
 *
 * You should mostly only be adding/removing players with functions like
 * `addPlayer`, `removePlayer`, etc, and changing the associated user
 * with `setPlayerUser` or `setEnded`.
 *
 * Do not modify `playerTable` or `player.id` yourself, it will make
 * users' games lists get out of sync.
 */
export class RoomGamePlayer<GameClass extends RoomGame = SimpleRoomGame> {
	readonly num: number;
	readonly game: GameClass;
	/**
	 * Will be the username of the user playing, but with some exceptions:
	 *
	 * - Creating a game with no users will initialize player names to
	 *   "Player 1", "Player 2", etc.
	 * - Players will retain the name of the last active user, even if that
	 *   user abandons the game.
	 */
	name: string;
	/**
	 * This will be '' if there's no user associated with the player.
	 *
	 * After the game ends, this will still be the user's ID, but it
	 * won't be in the user's game list anymore.
	 *
	 * We intentionally don't hold a direct reference to the user.
	 *
	 * Do not modify directly. You usually want `game.updatePlayer`
	 * (respects allowRenames) or `game.setPlayerUser` (overrides
	 * allowRenames) or `game.renamePlayer` (overrides allowRenames
	 * and also skips gamelist updates if the change was a simple
	 * user rename).
	 *
	 * If force-modifying: remember to sync `this.game.playerTable` and
	 * `this.getUser().games`.
	 */
	readonly id: ID;
	completed?: boolean;
	constructor(user: User | string | null, game: GameClass, num = 0) {
		this.num = num;
		if (!user) user = num ? `Player ${num}` : `Player`;
		this.game = game;
		this.name = (typeof user === 'string' ? user : user.name);
		if (typeof user === 'string') user = null;
		this.id = user ? user.id : '';
		if (user && !this.game.isSubGame) {
			user.games.add(this.game.roomid);
			user.updateSearch();
		}
	}
	destroy() {
		(this.game as any) = null;
	}

	toString() {
		return this.id;
	}
	getUser() {
		return this.id ? Users.getExact(this.id) : null;
	}
	send(data: string) {
		this.getUser()?.send(data);
	}
	sendRoom(data: string) {
		this.getUser()?.sendTo(this.game.roomid, data);
	}
}

/**
 * globally Rooms.RoomGame
 *
 * If you don't want to define your own player class, you should extend SimpleRoomGame.
 */
export abstract class RoomGame<PlayerClass extends RoomGamePlayer = RoomGamePlayer> {
	abstract gameid: ID;
	roomid: RoomID;
	/**
	 * The room this roomgame is in. Rooms can have two RoomGames at a time,
	 * which are available as `this.room.game === this` and `this.room.subGame === this`.
	 */
	room: Room;
	title = 'Game';
	allowRenames = false;
	isSubGame: boolean;
	/**
	 * userid:player table.
	 *
	 * Does not contain userless players: use this.players for the full list.
	 *
	 * Do not iterate. You usually want to iterate `game.players` instead.
	 *
	 * Do not modify directly. You usually want `game.addPlayer` or
	 * `game.removePlayer` instead.
	 *
	 * Not a source of truth. Should be kept in sync with
	 * `Object.fromEntries(this.players.filter(p => p.id).map(p => [p.id, p]))`
	 */
	playerTable: {[userid: string]: PlayerClass} = Object.create(null);
	players: PlayerClass[] = [];
	playerCount = 0;
	playerCap = 0;
	/** should only be set by setEnded */
	readonly ended: boolean = false;
	/** Does `/guess` or `/choose` require the user to be able to talk? */
	checkChat = false;
	/**
	 * We should really resolve this collision at _some_ point, but it will have
	 * to be later. The /timer command is written to be resilient to this.
	 */
	timer?: {timerRequesters?: Set<ID>, start: (force?: User) => void, stop: (force?: User) => void} | NodeJS.Timer | null;
	constructor(room: Room, isSubGame = false) {
		this.roomid = room.roomid;
		this.room = room;
		this.isSubGame = isSubGame;

		if (this.isSubGame) {
			this.room.subGame = this;
		} else {
			this.room.game = this;
		}
	}

	destroy() {
		this.setEnded();
		if (this.isSubGame) {
			this.room.subGame = null;
		} else {
			this.room.game = null;
		}
		// @ts-ignore
		this.room = null;
		for (const player of this.players) {
			player.destroy();
		}
		// @ts-ignore
		this.players = null;
		// @ts-ignore
		this.playerTable = null;
	}

	addPlayer(user: User | string | null = null, ...rest: any[]): PlayerClass | null {
		if (typeof user !== 'string' && user) {
			if (user.id in this.playerTable) return null;
		}
		if (this.playerCap > 0 && this.playerCount >= this.playerCap) return null;
		const player = this.makePlayer(user, ...rest);
		if (!player) return null;
		if (typeof user === 'string') user = null;
		this.players.push(player);
		if (user) {
			this.playerTable[user.id] = player;
			this.playerCount++;
		}
		return player;
	}

	updatePlayer(player: PlayerClass, userOrName: User | string | null) {
		if (!this.allowRenames) return;
		this.setPlayerUser(player, userOrName);
	}
	setPlayerUser(player: PlayerClass, userOrName: User | string | null) {
		if (this.ended) return;
		if (player.id === toID(userOrName)) return;
		if (player.id) {
			delete this.playerTable[player.id];
			const user = Users.getExact(player.id);
			if (user) {
				user.games.delete(this.roomid);
				user.updateSearch();
			}
		}
		if (userOrName) {
			const {name, id} = typeof userOrName === 'string' ? {name: userOrName, id: toID(userOrName)} : userOrName;
			(player.id as string) = id;
			player.name = name;
			this.playerTable[player.id] = player;
			if (this.room.roomid.startsWith('battle-') || this.room.roomid.startsWith('game-')) {
				this.room.auth.set(id, Users.PLAYER_SYMBOL);
			}

			const user = typeof userOrName === 'string' ? Users.getExact(id) : userOrName;
			if (user) {
				user.games.add(this.roomid);
				user.updateSearch();
			}
		} else {
			(player.id as string) = '';
		}
	}

	abstract makePlayer(user: User | string | null, ...rest: any[]): PlayerClass;

	removePlayer(player: PlayerClass) {
		this.setPlayerUser(player, null);
		const playerIndex = this.players.indexOf(player);
		if (playerIndex < 0) return false;
		this.players.splice(playerIndex, 1);
		player.destroy();
		this.playerCount--;
		return true;
	}

	/**
	 * Like `setPlayerUser`, but bypasses some unnecessary game list updates if
	 * the user renamed directly from the old userid.
	 *
	 * `this.playerTable[oldUserid]` must exist or this will crash.
	 */
	renamePlayer(user: User, oldUserid: ID) {
		if (user.id === oldUserid) {
			this.playerTable[user.id].name = user.name;
		} else {
			this.playerTable[user.id] = this.playerTable[oldUserid];
			(this.playerTable[user.id].id as string) = user.id;
			this.playerTable[user.id].name = user.name;
			delete this.playerTable[oldUserid];
		}
	}

	/**
	 * This is purely for cleanup, suitable for calling from `destroy()`.
	 * You should make a different function, call it `end` or something,
	 * to end a game properly. See BestOfGame for an example of an `end`
	 * function.
	 */
	setEnded() {
		if (this.ended) return;
		(this.ended as boolean) = true;
		if (this.isSubGame) return;
		for (const player of this.players) {
			const user = player.getUser();
			if (user) {
				user.games.delete(this.roomid);
				user.updateSearch();
			}
		}
	}

	renameRoom(roomid: RoomID) {
		for (const player of this.players) {
			const user = player.getUser();
			user?.games.delete(this.roomid);
			user?.games.add(roomid);
		}
		this.roomid = roomid;
	}

	// Commands:

	// These are all optional to implement:

	/**
	 * Called when a user uses /forfeit
	 * Also used for some force-forfeit situations, such
	 * as when a user changes their name and .allowRenames === false
	 * This is strongly recommended to be supported, as the user is
	 * extremely unlikely to keep playing after this function is
	 * called.
	 *
	 * @param user
	 * @param reason if a forced forfeit; should start with space
	 */
	forfeit?(user: User | string, reason?: string): void;

	/**
	 * Called when a user uses /choose [text]
	 * If you have buttons, you are recommended to use this interface
	 * instead of making your own commands.
	 */
	choose?(user: User, text: string): void;

	/**
	 * Called when a user uses /undo [text]
	 */
	undo?(user: User, text: string): void;

	/**
	 * Called when a user uses /joingame [text]
	 */
	joinGame?(user: User, text?: string): void;

	/**
	 * Called when a user uses /leavegame [text]
	 */
	leaveGame?(user: User, text?: string): void;

	// Events:

	// Note:
	// A user can have multiple connections. For instance, if you have
	// two tabs open and connected to PS, those tabs represent two
	// connections, but a single PS user. Each tab can be in separate
	// rooms.

	/**
	 * Called when a user joins a room. (i.e. when the user's first
	 * connection joins)
	 *
	 * While connection is passed, it should not usually be used:
	 * Any handling of connections should happen in onConnect.
	 */
	onJoin(user: User, connection: Connection) {}

	/**
	 * Called when a subroom game (battle or bestof) ends, on the
	 * parent game (bestof or tournament).
	 */
	onBattleWin?(room: GameRoom, winnerid: ID): void;

	/**
	 * Called when a user is banned from the room this game is taking
	 * place in.
	 */
	removeBannedUser(user: User) {
		this.forfeit?.(user, " lost by being banned.");
	}

	/**
	 * Called when a user in the game is renamed. `isJoining` is true
	 * if the user was previously a guest, but now has a username.
	 * Check `!user.named` for the case where a user previously had a
	 * username but is now a guest. By default, updates a player's
	 * name as long as allowRenames is set to true.
	 */
	onRename(user: User, oldUserid: ID, isJoining: boolean, isForceRenamed: boolean) {
		if (!this.allowRenames || (!user.named && !isForceRenamed)) {
			if (!(user.id in this.playerTable) && !this.isSubGame) {
				user.games.delete(this.roomid);
				user.updateSearch();
			}
			return;
		}
		if (!(oldUserid in this.playerTable)) return;
		if (!user.named) {
			return this.onLeave(user, oldUserid);
		}
		this.renamePlayer(user, oldUserid);
	}

	/**
	 * Called when a user leaves the room. (i.e. when the user's last
	 * connection leaves)
	 */
	onLeave(user: User, oldUserid?: ID) {}

	/**
	 * Called each time a connection joins a room (after onJoin if
	 * applicable). By default, this is also called when connection
	 * is updated in some way (such as by changing user or renaming).
	 * If you don't want this behavior, override onUpdateConnection
	 * and/or onRename.
	 *
	 * This means that by default, it's called twice: once when
	 * connected to the server (as guest1763 or whatever), and once
	 * when logged in.
	 */
	onConnect(user: User, connection: Connection) {}

	/**
	 * Called for each connection in a room that changes users by
	 * merging into a different user. By default, runs the onConnect
	 * handler.
	 *
	 * Player updates and an up-to-date report of what's going on in
	 * the game should be sent during `onConnect`. You should rarely
	 * need to handle the other events.
	 */
	onUpdateConnection(user: User, connection: Connection) {
		this.onConnect(user, connection);
	}

	/**
	 * Called for every message a user sends while this game is active.
	 * Return an error message to prevent the message from being sent,
	 * an empty string to prevent it with no error message, or
	 * `undefined` to let it through.
	 */
	onChatMessage(message: string, user: User): string | void {}

	/**
	 * Called for every message a user sends while this game is active.
	 * Unlike onChatMessage, this function runs after the message has been added to the room's log.
	 * Do not try to use this to block messages, use onChatMessage for that.
	 */
	onLogMessage(message: string, user: User) {}

	/**
	 * Called when a game's timer needs to be started. Used mainly for tours.
	 */
	startTimer() {}
}

/**
 * globally Rooms.SimpleRoomGame
 *
 * A RoomGame without a custom player class. Gives a default implementation for makePlayer.
 */
export abstract class SimpleRoomGame extends RoomGame<RoomGamePlayer> {
	makePlayer(user: User | string | null, ...rest: any[]): RoomGamePlayer {
		const num = this.players.length ? this.players[this.players.length - 1].num : 1;
		return new RoomGamePlayer(user, this, num);
	}
}
