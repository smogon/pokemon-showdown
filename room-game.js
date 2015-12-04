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
	}
	destroy() {
		let user = Users.getExact(this.userid);
		if (user) delete user.games[this.game.id];
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

	// onConnect(user, connection)
	// onRename(user, oldid, joining)
	// onJoin(user)
	// onLeave(user)
}

// these exports are traditionally attached to rooms.js
exports.RoomGame = RoomGame;
exports.RoomGamePlayer = RoomGamePlayer;
