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

// globally Rooms.RoomGamePlayer
export class RoomGamePlayer {
	num: number;
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
	 * we explicitly don't hold a direct reference to the user
	 */
	userid: ID;
	game: RoomGame;
	constructor(user: User | string | null, game: RoomGame, num = 0) {
		this.num = num;
		if (!user) user = num ? `Player ${num}` : `Player`;
		this.name = (typeof user === 'string' ? user : user.name);
		if (typeof user === 'string') user = null;
		this.userid = user ? user.userid : '';
		this.game = game;
		if (user) {
			user.games.add(this.game.id);
			user.updateSearch();
		}
	}
	unlinkUser() {
		if (!this.userid) return;
		const user = Users.getExact(this.userid);
		if (user) {
			user.games.delete(this.game.id);
			user.updateSearch();
		}
		this.userid = '';
	}
	destroy() {
		this.unlinkUser();
	}

	toString() {
		return this.userid;
	}
	send(data: string) {
		const user = Users.getExact(this.userid);
		if (user) user.send(data);
	}
	sendRoom(data: string) {
		const user = Users.getExact(this.userid);
		if (user) user.sendTo(this.game.id, data);
	}
}

/**
 * globally Rooms.RoomGame
 */
export class RoomGame {
	id: RoomID;
	room: ChatRoom | GameRoom;
	gameid: ID;
	title: string;
	allowRenames: boolean;
	/**
	 * userid:player table.
	 *
	 * Does not contain userless players: use playerList for the full list.
	 */
	playerTable: {[userid: string]: RoomGamePlayer};
	players: RoomGamePlayer[];
	playerCount: number;
	playerCap: number;
	ended: boolean;
	constructor(room: ChatRoom | GameRoom) {
		this.id = room.id;
		this.room = room;
		this.gameid = 'game' as ID;
		this.title = 'Game';
		this.allowRenames = false;
		this.playerTable = Object.create(null);
		this.players = [];
		this.playerCount = 0;
		this.playerCap = 0;
		this.ended = false;

		this.room.game = this as RoomGame;
	}

	destroy() {
		this.room.game = null;
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

	addPlayer(user: User | string | null = null, ...rest: any[]) {
		if (typeof user !== 'string' && user) {
			if (user.userid in this.playerTable) return null;
		}
		if (this.playerCap > 0 && this.playerCount >= this.playerCap) return null;
		const player = this.makePlayer(user, ...rest);
		if (!player) return null;
		if (typeof user === 'string') user = null;
		this.players.push(player);
		if (user) {
			this.playerTable[user.userid] = player;
			this.playerCount++;
		}
		return player;
	}

	updatePlayer(player: RoomGamePlayer, user: User | null) {
		if (!this.allowRenames) return;
		if (player.userid) {
			delete this.playerTable[player.userid];
		}
		if (user) {
			player.userid = user.userid;
			player.name = user.name;
			this.playerTable[player.userid] = player;
			if (!this.room.auth) {
				this.room.auth = {};
			}
			this.room.auth[player.userid] = Users.PLAYER_SYMBOL;
		} else {
			player.unlinkUser();
		}
	}

	makePlayer(user: User | string | null, ...rest: any[]) {
		const num = this.players.length ? this.players[this.players.length - 1].num : 1;
		return new RoomGamePlayer(user, this, num);
	}

	removePlayer(player: RoomGamePlayer | User) {
		if (player instanceof Users.User) {
			// API changed
			// TODO: deprecate
			player = this.playerTable[player.userid];
			if (!player) throw new Error("Player not found");
		}
		if (!this.allowRenames) return false;
		const playerIndex = this.players.indexOf(player);
		if (playerIndex < 0) return false;
		if (player.userid) delete this.playerTable[player.userid];
		this.players.splice(playerIndex, 1);
		player.destroy();
		this.playerCount--;
		return true;
	}

	renamePlayer(user: User, oldUserid: ID) {
		if (user.userid === oldUserid) {
			this.playerTable[user.userid].name = user.name;
		} else {
			this.playerTable[user.userid] = this.playerTable[oldUserid];
			this.playerTable[user.userid].userid = user.userid;
			this.playerTable[user.userid].name = user.name;
			delete this.playerTable[oldUserid];
		}
	}

	// Commands:

	// These are all optional to implement:

	// forfeit(user)
	//   Called when a user uses /forfeit
	//   Also planned to be used for some force-forfeit situations, such
	//   as when a user changes their name and .allowRenames === false
	//   This is strongly recommended to be supported, as the user is
	//   extremely unlikely to keep playing after this function is
	//   called.

	// choose(user, text)
	//   Called when a user uses /choose [text]
	//   If you have buttons, you are recommended to use this interface
	//   instead of making your own commands.

	// undo(user, text)
	//   Called when a user uses /undo [text]

	// joinGame(user, text)
	//   Called when a user uses /joingame [text]

	// leaveGame(user, text)
	//   Called when a user uses /leavegame [text]

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
	 * Called when a user is banned from the room this game is taking
	 * place in.
	 */
	removeBannedUser(user: User) {
		// @ts-ignore
		if (this.forfeit) this.forfeit(user);
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
			if (!(user.userid in this.playerTable)) {
				user.games.delete(this.id);
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
	 * Return an error message to prevent the message from being sent, or
	 * `false` to let it through.
	 */
	onChatMessage(message: string, user: User): string | false {
		return false;
	}

	/**
	 * Called for every message a user sends while this game is active.
	 * Unlike onChatMessage, this function runs after the message has been added to the room's log.
	 * Do not try to use this to block messages, use onChatMessage for that.
	 */
	onLogMessage(message: string, user: User) {}
}
