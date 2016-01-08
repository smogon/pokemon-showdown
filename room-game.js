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
	constructor(user, game) {
		// we explicitly don't hold a reference to the user
		this.userid = user.userid;
		this.name = user.name;
		this.game = game;
		user.games[this.game.id] = this.game;
		user.updateSearch();
	}
	destroy() {
		let user = Users.getExact(this.userid);
		if (user) {
			delete user.games[this.game.id];
			user.updateSearch();
		}
	}

	toString() {
		return this.userid;
	}
	send(data) {
		let user = Users.getExact(this.userid);
		if (user) user.send(data);
	}
	sendRoom(data) {
		let user = Users.getExact(this.userid);
		if (user) user.sendTo(this.game.id, data);
	}
}

// globally Rooms.RoomGame
class RoomGame {
	constructor(room) {
		this.id = room.id;
		this.room = room;
		this.gameid = 'game';
		this.title = 'Game';
		this.allowRenames = false;
		this.players = Object.create(null);
		this.playerCount = 0;
		this.playerCap = 0;
	}

	destroy() {
		this.room = null;
		for (let i in this.players) {
			this.players[i].destroy();
		}
	}

	addPlayer(user) {
		if (user.userid in this.players) return false;
		if (this.playerCount >= this.playerCap) return false;
		let player = this.makePlayer.apply(this, arguments);
		if (!player) return false;
		this.players[user.userid] = player;
		this.playerCount++;
		return true;
	}

	makePlayer(user) {
		return new RoomGamePlayer(user);
	}

	removePlayer(user) {
		if (!this.allowRenames) return false;
		if (!(user.userid in this.players)) return false;
		this.players[user.userid].destroy();
		delete this.players[user.userid];
		this.playerCount--;
		return true;
	}

	// Events:

	// Note:
	// A user can have multiple connections. For instance, if you have
	// two tabs open and connected to PS, those tabs represent two
	// connections, but a single PS user. Each tab can be in separate
	// rooms.

	// onJoin(user)
	//   Called when a user joins a room. (i.e. when the user's first
	//   connection joins)

	// onRename(user, oldUserid, isJoining)
	//   Called when a user in the room is renamed. NOT called when a
	//   player outside the room is renamed. `isJoining` is true if the
	//   user was previously a guest, but now has a username. Check
	//   `!user.named` for the case where a user previously had a
	//   username but is now a guest.

	// onLeave(user)
	//   Called when a user leaves the room. (i.e. when the user's last
	//   connection leaves)

	// onConnect(user, connection)
	//   Called each time a connection joins a room (after onJoin if
	//   applicable).

	// onUpdateConnection(user, connection)
	//   Called for each connection in a room that changes users by
	//   merging into a different user. By default, runs the onConnect
	//   handler.

	// Player updates and an up-to-date report of what's going on in
	// the game should be sent during `onConnect`. You should rarely
	// need to handle the other events.

	onUpdateConnection(user, connection) {
		if (this.onConnect) this.onConnect(user, connection);
	}
}

// these exports are traditionally attached to rooms.js
exports.RoomGame = RoomGame;
exports.RoomGamePlayer = RoomGamePlayer;
