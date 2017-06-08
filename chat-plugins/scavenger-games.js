/**
 * Scavengers Games Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This plugin stores the different possible game modes and twists that take place in scavengers room
 *
 * @license MIT license
 */

'use strict';

function listString(array) {
	if (array.length === 1) return array[0];
	return `${array.slice(0, -1).join(", ")} and ${array.slice(-1)}`;
}

const ScavengerHunt = require("./scavengers").game;

class ScavGame extends Rooms.RoomGame {
	constructor(room, gameType = "Scavenger Game") {
		super(room);

		this.title = gameType;
		this.gameid = toId(gameType);

		this.childGame = null;
		this.playerCap = Infinity;

		// identify this as a scav game.
		this.scavParentGame = true;
		this.scavGame = true;
	}

	canJoinGame(user) {
		/**
		 * Placeholder function that checks whether or not a player can join the current round of a scavenger game
		 * Used in elimination based games, where players may not be able to join in subsequent rounds.
		 */
		return true;
	}

	joinGame(user) {
		if (!this.childGame) return user.sendTo(this.room, "There is no hunt to join yet.");
		if (!this.canJoinGame(user)) return user.sendTo(this.room, "You are not allowed to join this hunt.");
		if ((user.userid in this.players) || this._joinGame(user)) { // if user is already in this parent game, or if the user is able to join this parent game
			if (this.childGame && this.childGame.joinGame) return this.childGame.joinGame(user);
		}
	}

	// joining the parent game
	_joinGame(user) {
		let success = this.addPlayer(user);
		if (success) user.sendTo(this.room, `You have joined the Scavenger Game - ${this.title}.`);
		return success;
	}

	// renaming in the parent game
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
		if (this.childGame && this.childGame.onRename) this.childGame.onRename(user, oldUserid, isJoining, isForceRenamed);
	}

	// get rid of childgame
	destroy() {
		if (this.childGame && this.childGame.destroy) this.childGame.destroy();
		this.room.game = null;
		this.room = null;
		for (let i in this.players) {
			this.players[i].destroy();
		}
	}

	/**
	 * Carry forward roomgame properties of scavenger hunts
	 */
	onSubmit(...args) {
		if (this.childGame && this.childGame.onSubmit) this.childGame.onSubmit(...args);
	}
	onConnect(...args) {
		if (this.childGame && this.childGame.onConnect) this.childGame.onConnect(...args);
	}
	leaveGame(...args) {
		if (this.childGame && this.childGame.leaveGame) this.childGame.leaveGame(...args);
	}
	onEditQuestion(...args) {
		if (this.childGame && this.childGame.onEditQuestion) return this.childGame.onEditQuestion(...args);
	}
	setTimer(...args) {
		if (this.childGame && this.childGame.setTimer) this.childGame.setTimer(...args);
	}
	onSendQuestion(...args) {
		if (this.childGame && this.childGame.onSendQuestion) return this.childGame.onSendQuestion(...args);
	}
	onEnd(...args) {
		if (this.childGame && this.childGame.onEnd) this.childGame.onEnd(...args);
	}
	onChatMessage(msg) {
		if (this.childGame && this.childGame.onChatMessage) return this.childGame.onChatMessage(msg);
	}

	/**
	 * Functions for the child hunt to call once a certain condition is met
	 * in the child roomgame
	 */
	onStartEvent() {}
	onCompleteEvent(player) {}
	onEndEvent() {}
	onDestroyEvent() {
		this.childGame = null;
	}

	/**
	 * General Game functions.
	 */
	createHunt(room, staffHost, host, gameType, questions) {
		if (this.childGame) return host.sendTo(this.room, "There is already a scavenger hunt in progress.");
		this.onStartEvent();
		this.childGame = new ScavengerHunt(room, staffHost, host, gameType, questions, this);
		return true;
	}

	announce(msg) {
		this.room.add(`|raw|<div class="broadcast-green"><strong>${msg}</strong></div>`).update();
	}

	eliminate(userid) {
		if (!(userid in this.players)) return false;
		let name = this.players[userid].name;

		this.players[userid].destroy();
		if (this.childGame.eliminate) this.childGame.eliminate(userid);

		delete this.players[userid];
		this.playerCount--;

		return name;
	}
}

/**
 * Knockout games - slowest user, or non finishers will be eliminated.
 */
class KOGame extends ScavGame {
	constructor(room) {
		super(room, "Knockout Games");

		this.round = 0;
	}

	canJoinGame(user) {
		return this.round === 1 || (user.userid in this.players);
	}

	onStartEvent() {
		this.round++;
		if (this.round === 1) {
			this.announce(`Knockout Games - Round 1.  Everyone is welcome to join!`);
		} else {
			this.announce(`Knockout Games - Round ${this.round}. Only the following players are allowed to join: ${Object.keys(this.players).map(p => this.players[p].name).join(", ")}`);
		}
	}

	onEndEvent() {
		let completed = this.childGame.completed.map(u => toId(u.name)); // list of userids
		if (!completed.length) {
			this.announce(`No one has completed the hunt! Better luck next time!`);

			setImmediate(() => this.destroy());
			return;
		}

		if (this.round === 1) {
			this.announce(`Congratulations to ${listString(completed.map(p => this.players[p].name))}! They have completed the first round, and have moved on to the next round!`);

			// prune the players that havent finished
			for (let i in this.players) {
				if (!(i in this.childGame.players) || !this.childGame.players[i].completed) this.eliminate(i); // user hasnt finished.
			}
			return;
		}

		let unfinished = Object.keys(this.players).filter(id => !completed.includes(id));

		if (!unfinished.length) {
			unfinished = completed.slice(-1);
		}

		let eliminated = unfinished.map(id => this.eliminate(id)).filter(n => n); // this.eliminate() returns the players name.

		if (Object.keys(this.players).length <= 1) {
			// game over
			let winner = this.players[Object.keys(this.players)[0]];

			if (winner) {
				this.announce(`Congratulations to ${winner.name} for winning the Knockout Games!`);
			} else {
				this.announce(`Sorry, no winners this time!`); // a catch - this should not realistically happen.
			}
			setImmediate(() => this.destroy()); // destroy the parent game after the child game finishes running their destroy functions.
			return;
		}

		this.announce(`${listString(eliminated.map(n => `<em>${n}</em>`))} ${(eliminated.length > 1 ? 'have' : 'has')} been eliminated! ${listString(Object.keys(this.players).map(p => `<em>${this.players[p].name}</em>`))} have successfully completed the last hunt and have moved on to the next round!`);
	}
}

module.exports = {
	KOGame: KOGame,
};
