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
 * @license MIT license
 */

'use strict';

// globally Rooms.RoomGamePlayer
class RoomGamePlayer {
	/**
	 * @param {User} user
	 * @param {RoomGame} game
	 */
	constructor(user, game) {
		// we explicitly don't hold a reference to the user
		this.userid = user.userid;
		this.name = user.name;
		this.game = game;
		user.games.add(this.game.id);
		user.updateSearch();
	}
	destroy() {
		let user = Users.getExact(this.userid);
		if (user) {
			user.games.delete(this.game.id);
			user.updateSearch();
		}
	}

	toString() {
		return this.userid;
	}
	/**
	 * @param {string} data
	 */
	send(data) {
		let user = Users.getExact(this.userid);
		if (user) user.send(data);
	}
	/**
	 * @param {string} data
	 */
	sendRoom(data) {
		let user = Users.getExact(this.userid);
		if (user) user.sendTo(this.game.id, data);
	}
}

// globally Rooms.RoomGame
class RoomGame {
	/**
	 * @param {ChatRoom | GameRoom} room
	 */
	constructor(room) {
		this.id = room.id;
		/** @type {ChatRoom | GameRoom} */
		this.room = room;
		this.gameid = 'game';
		this.title = 'Game';
		this.allowRenames = false;
		this.players = Object.create(null);
		this.playerCount = 0;
		this.playerCap = 0;
	}

	destroy() {
		this.room.game = null;
		this.room = /** @type {any} */ (null);
		for (let i in this.players) {
			this.players[i].destroy();
		}
	}

	/**
	 * @param {User} user
	 * @param {any[]} rest
	 */
	addPlayer(user, ...rest) {
		if (user.userid in this.players) return false;
		if (this.playerCount >= this.playerCap) return false;
		let player = this.makePlayer(user, ...rest);
		if (!player) return false;
		this.players[user.userid] = player;
		this.playerCount++;
		return true;
	}

	/**
	 * @param {User} user
	 */
	makePlayer(user) {
		return new RoomGamePlayer(user, this);
	}

	/**
	 * @param {User} user
	 */
	removePlayer(user) {
		if (!this.allowRenames) return false;
		if (!(user.userid in this.players)) return false;
		this.players[user.userid].destroy();
		delete this.players[user.userid];
		this.playerCount--;
		return true;
	}

	/**
	 * @param {User} user
	 * @param {string} oldUserid
	 */
	renamePlayer(user, oldUserid) {
		if (user.userid === oldUserid) {
			this.players[user.userid].name = user.name;
		} else {
			this.players[user.userid] = this.players[oldUserid];
			this.players[user.userid].userid = user.userid;
			this.players[user.userid].name = user.name;
			delete this.players[oldUserid];
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
	 * @param {User} user
	 * @param {Connection} connection
	 */
	onJoin(user, connection) {}

	/**
	 * Called when a user in the game is renamed. `isJoining` is true
	 * if the user was previously a guest, but now has a username.
	 * Check `!user.named` for the case where a user previously had a
	 * username but is now a guest. By default, updates a player's
	 * name as long as allowRenames is set to true.
	 * @param {User} user
	 * @param {string} oldUserid
	 * @param {boolean} isJoining
	 * @param {boolean} isForceRenamed
	 */
	onRename(user, oldUserid, isJoining, isForceRenamed) {
		if (!this.allowRenames || (!user.named && !isForceRenamed)) {
			if (!(user.userid in this.players)) {
				user.games.delete(this.id);
				user.updateSearch();
			}
			return;
		}
		if (!(oldUserid in this.players)) return;
		this.renamePlayer(user, oldUserid);
	}

	/**
	 * Called when a user leaves the room. (i.e. when the user's last
	 * connection leaves)
	 * @param {User} user
	 */
	onLeave(user) {}

	/**
	 * Called each time a connection joins a room (after onJoin if
	 * applicable). By default, this is also called when connection
	 * is updated in some way (such as by changing user or renaming).
	 * If you don't want this behavior, override onUpdateConnection
	 * and/or onRename.
	 * @param {User} user
	 * @param {Connection} connection
	 */
	onConnect(user, connection) {}

	/**
	 * Called for each connection in a room that changes users by
	 * merging into a different user. By default, runs the onConnect
	 * handler.
	 * Player updates and an up-to-date report of what's going on in
	 * the game should be sent during `onConnect`. You should rarely
	 * need to handle the other events.
	 * @param {User} user
	 * @param {Connection} connection
	 */
	onUpdateConnection(user, connection) {
		this.onConnect(user, connection);
	}
}

// these exports are traditionally attached to rooms.js
exports.RoomGame = RoomGame;
exports.RoomGamePlayer = RoomGamePlayer;
