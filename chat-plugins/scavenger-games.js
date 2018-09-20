/**
 * Scavengers Games Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This plugin stores the different possible game modes and twists that take place in scavengers room
 *
 * @license MIT license
 */

'use strict';

class Leaderboard {
	constructor(game) {
		this.game = game;
		this.data = {};
	}

	addPoints(name, aspect, points, noUpdate) {
		let userid = toId(name);

		if (!userid || userid === 'constructor' || !points) return this;
		if (!this.data[userid]) this.data[userid] = {name: name};

		if (!this.data[userid][aspect]) this.data[userid][aspect] = 0;
		this.data[userid][aspect] += points;

		if (!noUpdate) this.data[userid].name = name; // always keep the last used name

		return this; // allow chaining
	}

	visualize(sortBy, userid) {
		// return a promise for async sorting - make this less exploitable
		return new Promise((resolve, reject) => {
			let lowestScore = Infinity;
			let lastPlacement = 1;

			let ladder = Object.keys(this.data)
				.filter(k => sortBy in this.data[k])
				.sort((a, b) => this.data[b][sortBy] - this.data[a][sortBy])
				.map((u, i) => {
					u = this.data[u];
					if (u[sortBy] !== lowestScore) {
						lowestScore = u[sortBy];
						lastPlacement = i + 1;
					}
					return Object.assign(
						{rank: lastPlacement},
						u
					);
				}); // identify ties
			if (userid) {
				let rank = ladder.find(entry => toId(entry.name) === userid);
				resolve(rank);
			} else {
				resolve(ladder);
			}
		});
	}

	htmlLadder() {
		return new Promise((resolve, reject) => {
			this.visualize('points').then(data => {
				let display = `<div class="ladder" style="overflow-y: scroll; max-height: 170px;"><table style="width: 100%">` +
					`<tr><th>Rank</th><th>Name</th><th>Points</th></tr>` +
					data.map(line => `<tr><td>${line.rank}</td><td>${line.name}</td><td>${line.points}</td></tr>`).join('') +
					`</table></div>`;
				resolve(display);
			});
		});
	}
}

class ScavGame extends Rooms.RoomGame {
	constructor(room, gameType = "Scavenger Game") {
		super(room);

		this.title = gameType;
		this.gameid = toId(gameType);

		this.childGame = null;
		this.playerCap = Infinity;

		this.leaderboard = null;

		this.round = 0;

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
		if (this.timer) {
			clearTimeout(this.timer);
			this.timer = null;
		}
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
	setTimer(...args) {
		if (this.childGame && this.childGame.setTimer) return this.childGame.setTimer(...args);
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
	onUpdateConnection() {}

	/**
	 * Functions for the child hunt to call once a certain condition is met
	 * in the child roomgame
	 */
	onStartEvent() {
		this.round++;
	}
	onCompleteEvent(player) {}
	onEndEvent() {}
	onBeforeEndHunt() {}
	onAfterEndHunt() {}
	onDestroyEvent() {
		this.childGame = null;
	}

	/**
	 * General Game functions.
	 */
	createHunt(room, staffHost, host, gameType, questions) {
		if (this.childGame) return staffHost.sendTo(this.room, "There is already a scavenger hunt in progress.");
		this.onStartEvent();
		this.childGame = new Rooms.ScavengerHunt(room, staffHost, host, gameType, questions, this);
		return true;
	}

	announce(msg) {
		this.room.add(`|raw|<div class="broadcast-green"><strong>${msg}</strong></div>`).update();
	}

	eliminate(userid) {
		if (!(userid in this.players)) return false;
		let name = this.players[userid].name;

		this.players[userid].destroy();
		if (this.childGame && this.childGame.eliminate) this.childGame.eliminate(userid);

		delete this.players[userid];
		this.playerCount--;

		if (this.leaderboard) {
			delete this.leaderboard.data[userid]; // remove their points in the leaderboard
		}

		return name;
	}
}

/**
 * Knockout games - slowest user, or non finishers will be eliminated.
 */
class KOGame extends ScavGame {
	constructor(room) {
		super(room, "Knockout Games");
	}

	canJoinGame(user) {
		return this.round === 1 || (user.userid in this.players);
	}

	onStartEvent() {
		this.round++;
		if (this.round === 1) {
			this.announce(`Knockout Games - Round 1.  Everyone is welcome to join!`);
		} else {
			let participants = Object.keys(this.players).map(p => this.players[p].name);
			this.announce(`Knockout Games - Round ${this.round}. Only the following ${participants.length} players are allowed to join: ${participants.join(', ')}.`);
		}
	}

	onEndEvent() {
		let completed = this.childGame.completed.map(u => toId(u.name)); // list of userids
		if (!completed.length) {
			this.announce(`No one has completed the hunt! This round has been void!`);
			this.round--;

			return;
		}

		if (this.round === 1) {
			// prune the players that havent finished
			for (let i in this.players) {
				if (!(i in this.childGame.players) || !this.childGame.players[i].completed) this.eliminate(i); // user hasnt finished.
			}
			this.announce(`Congratulations to ${Chat.toListString(Object.keys(this.players).map(i => this.players[i].name))}! They have completed the first round, and have moved on to the next round!`);
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

		this.announce(`${Chat.toListString(eliminated.map(n => `<em>${n}</em>`))} ${Chat.plural(eliminated, 'have', 'has')} been eliminated! ${Chat.toListString(Object.keys(this.players).map(p => `<em>${this.players[p].name}</em>`))} have successfully completed the last hunt and have moved on to the next round!`);
	}
}

class ScavengerGames extends ScavGame {
	constructor(room) {
		super(room, "Scavenger Games");
	}

	canJoinGame(user) {
		return this.round === 1 || (user.userid in this.players);
	}

	onStartEvent() {
		this.round++;
		if (this.round === 1) {
			this.announce(`Scavenger Games - Round 1.  Everyone is welcome to join!`);
		} else {
			let participants = Object.keys(this.players).map(p => this.players[p].name);
			this.announce(`Scavenger Games - Round ${this.round}. Only the following ${participants.length} players are allowed to join: ${participants.join(', ')}. You have one minute to complete the hunt!`);
			setImmediate(() => this.childGame.setTimer(1));
		}
	}

	onEndEvent() {
		let completed = this.childGame.completed.map(u => toId(u.name)); // list of userids
		if (!completed.length) {
			this.announce(`No one has completed the hunt! This round has been voided!`);
			this.round--;

			return;
		}

		if (this.round === 1) {
			// prune the players that havent finished
			for (let i in this.players) {
				if (!(i in this.childGame.players) || !this.childGame.players[i].completed) this.eliminate(i); // user hasnt finished.
			}
			this.announce(`Congratulations to ${Chat.toListString(Object.keys(this.players).map(i => this.players[i].name))}! They have completed the first round, and have moved on to the next round!`);
			return;
		}

		let unfinished = Object.keys(this.players).filter(id => !completed.includes(id));

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

		this.announce(`${Chat.toListString(eliminated.map(n => `<em>${n}</em>`))} ${Chat.plural(eliminated, 'have', 'has')} been eliminated! ${Chat.toListString(Object.keys(this.players).map(p => `<em>${this.players[p].name}</em>`))} have successfully completed the last hunt and have moved on to the next round!`);
	}
}

class JumpStart extends ScavGame {
	constructor(room) {
		super(room, "Jump Start");

		// the place to store both hunts
		this.hunts = [];
		this.completed = [];
	}

	// alter the create hunt function so that both hunts are entered before the actual hunt starts
	createHunt(room, staffHost, host, gameType, questions) {
		if (this.hunts.length === 0) {
			this.hunts.push([room, staffHost, host, gameType, questions]);
			staffHost.sendTo(this.room, "The first hunt has been set. Please use /starthunt again to add the second hunt.");
		} else if (this.hunts.length === 1) {
			this.hunts.push([room, staffHost, host, gameType, questions]);
			staffHost.sendTo(this.room, "The second hunt has been set. Please use /scav game jumpstart set [seconds], [seconds]... to set how many seconds early the hints should be automatically given out.");
		} else {
			staffHost.sendTo(this.room, "There are already 2 hunts set for this scavenger game.");
		}
		return false;
	}

	setJumpStart(timesArray) {
		if (this.jumpStartTimes) return "The times for the jump start has already been set.";

		timesArray = timesArray.map(t => Number(t));
		this.jumpStartTimes = [];

		const MIN_WAIT_TIME = 60; // seconds
		let prevDiff;
		for (const diff of timesArray) {
			if (!diff || diff < 0) {
				delete this.jumpStartTimes;
				return "The times must be numbers greater than 0 in seconds.";
			}
			if (prevDiff) {
				this.jumpStartTimes.push(prevDiff - diff); // make the timer call itself as one runs out
			} else {
				this.jumpStartTimes.push(MIN_WAIT_TIME); // the first one is always 0 + the minimum wait
			}
			prevDiff = diff;
		}
		this.huntWait = prevDiff; // the last wait time

		if (this.jumpStartTimes.some(t => t < 0)) {
			this.jumpStartTimes = null;
			return "Invalid ordering of times.";
		}
		this.earlyTimes = timesArray;
		// start the hunt
		this.onStartEvent();
		this.childGame = new Rooms.ScavengerHunt(...this.hunts[0], this);
	}

	runJumpStartTimer() {
		if (this.jumpStartTimes.length) {
			let targetUserId = this.completed.shift();

			// if there are no more to distribute - set one timer with all of the remaining times together
			if (!targetUserId) {
				this.timer = setTimeout(() => {
					this.onStartEvent();
					this.childGame = new Rooms.ScavengerHunt(...this.hunts[1], this); // start it after the last hunt object has been destroyed
				}, this.huntWait * 1000 + (this.jumpStartTimes.reduce((a, b) => a + b) * 1000));
				return;
			}

			// set the (recursive) timer to give out hints.
			let duration = this.jumpStartTimes.shift() * 1000;
			this.timer = setTimeout(() => {
				let targetUser = Users(targetUserId);
				if (targetUser) {
					this.announce('sending hint to ' + targetUser.name + " " + new Date());
					targetUser.sendTo(this.room, `|raw|<strong>The first hint to the next hunt is:</strong> ${Chat.formatText(this.hunts[1][4][0])}`);
					targetUser.sendTo(this.room, `|notify|Early Hint|The first hint to the next hunt is: ${this.hunts[1][4][0]}`);
				}
				this.runJumpStartTimer();
			}, duration);
		} else {
			// there are no more slots for early delivery - start the new hunt
			this.timer = setTimeout(() => {
				this.announce('starting second hunt ' + new Date());
				this.onStartEvent();
				this.childGame = new Rooms.ScavengerHunt(...this.hunts[1], this);
				this.room.add(`|c|~|[ScavengerManager] A scavenger hunt by ${Chat.toListString(this.childGame.hosts.map(h => h.name))} has been automatically started.`).update(); // highlight the users with "hunt by"
			}, this.huntWait * 1000);
		}
	}

	onCompleteEvent(player) {
		if (this.round === 1 && this.completed.length < this.jumpStartTimes.length) {
			player.sendRoom(`You will receive your hint ${this.earlyTimes.shift()} seconds ahead of time!`);
			this.completed.push(player.userid);
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
			// prune the players that havent finished
			for (let i in this.players) {
				if (!(i in this.childGame.players) || !this.childGame.players[i].completed) this.eliminate(i); // user hasnt finished.
			}
			this.announce(`The early distribution of hints will start in one minute!`);

			if (this.hunts.length === 2) {
				this.runJumpStartTimer();
			} else {
				// technically should never happen
				this.announce("ERROR: The scavenger game has been abruptly ended due to the lack of a second game.");
				setImmediate(() => this.destroy());
			}
		} else {
			this.announce(`Congratulations to the winners of the Jump Start game!`);
			setImmediate(() => this.destroy());
		}
	}
}

class PointRally extends ScavGame {
	constructor(room) {
		super(room, "Point Rally");

		this.pointDistribution = [50, 40, 32, 25, 20, 15, 10];

		this.leaderboard = new Leaderboard(this);
	}

	getPoints(place) {
		return this.pointDistribution[place] || this.pointDistribution[this.pointDistribution.length - 1];
	}

	onStartEvent() {
		this.round++;
		this.announce(`Hunt #${this.round}`);
	}

	onEndEvent() {
		// give points
		for (const [i, completed] of this.childGame.completed.map(e => e.name).entries()) {
			this.leaderboard.addPoints(completed, 'points', this.getPoints(i));
		}

		// post leaderboard
		this.leaderboard.htmlLadder().then(html => {
			this.room.add(`|raw|${html}`).update();
		});
	}

	destroy() {
		if (this.childGame && this.childGame.destroy) this.childGame.destroy();
		this.room.game = null;
		this.room = null;
		for (let i in this.players) {
			this.players[i].destroy();
		}
	}
}

class Incognito extends ScavGame {
	constructor(room, blind, gameType, staffHost, hosts, hunt) {
		super(room, 'Incognito');

		this.blind = blind;
		this.hunt = hunt;
		this.gameType = gameType;

		this.announce(`A new ${blind ? 'Blind' : ''} Incognito game has been started!`);
		this.createHunt(room, staffHost, hosts, this.gameType, hunt);
		this.childGame.preCompleted = [];
	}

	onSubmit(user, value) {
		if (this.childGame && this.childGame.onSubmit) {
			// intercept handling of the last question
			if (user.userid in this.childGame.players && this.childGame.players[user.userid].currentQuestion + 1 >= this.childGame.questions.length) {
				let hunt = this.childGame;

				value = toId(value);

				let player = hunt.players[user.userid];
				if (player.completed) {
					if (!this.blind) return;
					return player.sendRoom(`That may or may not be the right answer - if you aren't confident, you can try again!`);
				}

				hunt.validatePlayer(player);

				if (player.verifyAnswer(value)) {
					this.markComplete(player);
					if (this.blind) return player.sendRoom(`That may or may not be the right answer - if you aren't confident, you can try again!`);
					player.sendRoom(`Congratulations! You have gotten the correct answer.`);
					player.sendRoom(`This is a special style where finishes aren't announced! To see your placement, wait for the hunt to end. Until then, it's your secret that you finished!`);
				} else {
					if (this.blind) return player.sendRoom(`That may or may not be the right answer - if you aren't confident, you can try again!`);
					player.sendRoom(`That is not the answer - try again!`);
				}
			} else {
				this.childGame.onSubmit(user, value);
			}
		}
	}

	markComplete(player) {
		if (player.completed) return false;

		if (this.childGame.preCompleted.find(p => toId(p.name) === player.userid)) return false;

		let now = Date.now();
		let time = Chat.toDurationString(now - this.childGame.startTime, {hhmmss: true});

		player.completed = true;
		this.childGame.preCompleted.push({name: player.name, time: time});
	}

	onBeforeEndHunt() {
		this.childGame.completed = this.childGame.preCompleted;
	}

	onAfterEndHunt() {
		setImmediate(() => this.destroy());
	}
}


module.exports = {
	KOGame,
	JumpStart,
	PointRally,
	ScavengerGames,
	Incognito,
};
