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
		let userid = toID(name);

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
				let rank = ladder.find(entry => toID(entry.name) === userid);
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

const TWISTS = {
	'perfectscore': {
		name: 'Perfect Score',
		id: 'perfectscore',
		desc: "Players who finish the hunt without submitting a single wrong answer get a shoutout!",

		onLeave(player) {
			if (!this.leftGame) this.leftGame = [];
			this.leftGame.push(player.id);
		},

		onSubmitPriority: 1,
		onSubmit(player, value) {
			let currentQuestion = player.currentQuestion;

			if (!player.answers) player.answers = {};
			if (!player.answers[currentQuestion]) player.answers[currentQuestion] = [];

			if (player.answers[currentQuestion].includes(value)) return;

			player.answers[currentQuestion].push(value);
		},

		onComplete(player, time, blitz) {
			let isPerfect = Object.keys(player.answers).map(q => player.answers[q].length).every(attempts => attempts <= 1);
			return {name: player.name, time, blitz, isPerfect};
		},

		onAfterEndPriority: 1,
		onAfterEnd() {
			let perfect = this.completed.filter(entry => entry.isPerfect).map(entry => entry.name);
			if (perfect.length) this.announce(Chat.html`${Chat.toListString(perfect)} ${perfect.length > 1 ? 'have' : 'has'} completed the hunt without a single wrong answer!`);
		},
	},

	'incognito': {
		name: 'Incognito',
		id: 'incognito',
		desc: "Upon answering the last question correctly, the player's finishing time will not be announced in the room!  Results will only be known at the end of the hunt.",

		onCorrectAnswer(player, value) {
			if (player.currentQuestion + 1 >= this.questions.length) {
				this.runEvent('PreComplete', player);

				player.sendRoom(`Congratulations! You have gotten the correct answer.`);
				player.sendRoom(`This is a special style where finishes aren't announced! To see your placement, wait for the hunt to end. Until then, it's your secret that you finished!`);
				return false;
			}
		},

		onPreComplete(player) {
			let now = Date.now();
			let time = Chat.toDurationString(now - this.startTime, {hhmmss: true});

			let blitz = (((this.room.blitzPoints && this.room.blitzPoints[this.gameType]) || this.gameType === 'official') && now - this.startTime <= 60000);

			let result = this.runEvent('Complete', player, time, blitz) || {name: player.name, time, blitz};

			this.preCompleted = this.preCompleted ? [...this.preCompleted, result] : [result];
			player.completed = true;
			player.destroy();
		},

		onEnd() {
			this.completed = this.preCompleted || [];
		},
	},

	'blindincognito': {
		name: 'Blind Incognito',
		id: 'blindincognito',
		desc: "Upon completing the last question, neither you nor other players will know if the last question is correct!  You may be in for a nasty surprise when the hunt ends!",

		onAnySubmit(player, value) {
			if (player.completed) {
				player.sendRoom(`That may or may not be the right answer - if you aren't confident, you can try again!`);
				return true;
			}
		},

		onCorrectAnswer(player, value) {
			if (player.currentQuestion + 1 >= this.questions.length) {
				this.runEvent('PreComplete', player);

				player.sendRoom(`That may or may not be the right answer - if you aren't confident, you can try again!`);
				return false;
			}
		},

		onIncorrectAnswer(player, value) {
			if (player.currentQuestion + 2 >= this.questions.length) {
				player.sendRoom(`That may or may not be the right answer - if you aren't confident, you can try again!`);
				return false;
			}
		},

		onPreComplete(player) {
			let now = Date.now();
			let time = Chat.toDurationString(now - this.startTime, {hhmmss: true});

			let blitz = (((this.room.blitzPoints && this.room.blitzPoints[this.gameType]) || this.gameType === 'official') && now - this.startTime <= 60000);

			let result = this.runEvent('Complete', player, time, blitz) || {name: player.name, time, blitz};

			this.preCompleted = this.preCompleted ? [...this.preCompleted, result] : [result];
			player.completed = true;
		},

		onEnd() {
			this.completed = this.preCompleted || [];
		},
	},
};

const MODES = {
	'scav': 'scavengergames',
	'scavgames': 'scavengergames',
	scavengergames: {
		name: 'Scavenger Games',
		id: 'scavengergames',

		mod: {
			name: 'Scavenger Games',
			id: 'scavengergames',

			onLoad() {
				this.allowRenames = false; // don't let people change their name in the middle of the hunt.
			},

			onJoin(user) {
				if (this.room.scavgame.playerlist && !this.room.scavgame.playerlist.includes(user.id)) {
					user.sendTo(this.room, 'You are not allowed to join this scavenger hunt.');
					return true;
				}
			},

			onAfterEnd() {
				if (!this.completed.length) {
					this.announce('No one has completd the hunt - the round has been void.');
					return;
				}

				this.room.scavgame.round++;

				// elimination
				if (!this.room.scavgame.playerlist) {
					this.room.scavgame.playerlist = this.completed.map(entry => toID(entry.name));
					this.announce(`Round ${this.room.scavgame.round} - ${Chat.toListString(this.players.map(p => `<em>${p.name}</em>`))} have successfully completed the last hunt and have moved on to the next round!`);
				} else {
					let eliminated = [];
					let completed = this.completed.map(entry => toID(entry.name));
					if (completed.length === this.room.scavgame.playerlist.length) {
						eliminated.push(completed.pop()); // eliminate one
						this.room.scavgame.playerlist = this.room.scavgame.playerlist.filter(userid => completed.includes(userid));
					} else {
						eliminated = this.room.scavgame.playerlist.filter(userid => !completed.includes(userid));
						for (const username of eliminated) {
							let userid = toID(username);
							this.room.scavgame.playerlist = this.room.scavgame.playerlist.filter(pid => pid !== userid);
						}
					}

					this.announce(`Round ${this.room.scavgame.round} - ${Chat.toListString(eliminated.map(n => `<em>${n}</em>`))} ${Chat.plural(eliminated, 'have', 'has')} been eliminated! ${Chat.toListString(this.room.scavgame.playerlist.map(p => `<em>${this.playerTable[p].name}</em>`))} have successfully completed the last hunt and have moved on to the next round!`);
				}

				// process end of game
				if (this.room.scavgame.playerlist.length === 1) {
					let winner = Users.get(this.room.scavgame.playerlist[0]);
					winner = winner ? winner.name : this.room.scavgame.playerlist[0];

					this.announce(`Congratulations to the winner - ${winner}!`);
					this.room.scavgame.destroy();
				} else if (!this.room.scavgame.playerlist.length) {
					this.announce('Everyone has been eliminated!  Better luck next time!');
					this.room.scavgame.destroy();
				}
			},
		},

		round: 0,
		playerlist: null,
	},

	'ko': 'kogames',
	kogames: {
		name: 'KO Games',
		id: 'kogames',

		mod: {
			name: 'KO Games',
			id: 'kogames',

			onLoad() {
				this.allowRenames = false; // don't let people change their name in the middle of the hunt.
				this.setTimer(1);
			},

			onJoin(user) {
				if (this.room.scavgame.playerlist && !this.room.scavgame.playerlist.includes(user.id)) {
					user.sendTo(this.room, 'You are not allowed to join this scavenger hunt.');
					return true;
				}
			},

			onAfterEnd() {
				if (!this.completed.length) {
					this.announce('No one has completed the hunt - the round has been void.');
					return;
				}
				this.room.scavgame.round++;

				let eliminated = [];
				if (!this.room.scavgame.playerlist) {
					this.room.scavgame.playerlist = this.completed.map(entry => toID(entry.name));
				} else {
					let completed = this.completed.map(entry => toID(entry.name));
					eliminated = this.room.scavgame.playerlist.filter(userid => !completed.includes(userid));
					for (const username of eliminated) {
						let userid = toID(username);
						this.room.scavgame.playerlist = this.room.scavgame.playerlist.filter(pid => pid !== userid);
					}
				}

				this.announce(`Round ${this.room.scavgame.round} - ${Chat.toListString(eliminated.map(n => `<em>${n}</em>`))} ${eliminated.length ? `${Chat.plural(eliminated, 'have', 'has')} been eliminated!` : ''} ${Chat.toListString(this.room.scavgame.playerlist.map(p => `<em>${this.playerTable[p].name}</em>`))} have successfully completed the last hunt and have moved on to the next round!`);

				// process end of game
				if (this.room.scavgame.playerlist.length === 1) {
					let winner = Users.get(this.room.scavgame.playerlist[0]);
					winner = winner ? winner.name : this.room.scavgame.playerlist[0];

					this.announce(`Congratulations to the winner - ${winner}!`);
					this.room.scavgame.destroy();
				} else if (!this.room.scavgame.playerlist.length) {
					this.announce('Everyone has been eliminated!  Better luck next time!');
					this.room.scavgame.destroy();
				}
			},
		},

		round: 0,
		playerlist: null,
	},

	pointrally: {
		name: 'Point Rally',
		id: 'pointrally',

		pointDistribution: [50, 40, 32, 25, 20, 15, 10],

		mod: {
			name: 'Point Rally',
			id: 'pointrally',

			onLoad() {
				this.announce(`Round ${++this.room.scavgame.round}`);
			},

			onAfterEnd() {
				for (const [i, completed] of this.completed.map(e => e.name).entries()) {
					let points = this.room.scavgame.pointDistribution[i] || this.room.scavgame.pointDistribution[this.room.scavgame.pointDistribution.length - 1];
					this.room.scavgame.leaderboard.addPoints(completed, 'points', points);
				}
				// post leaderboard
				let room = this.room;
				this.room.scavgame.leaderboard.htmlLadder().then(html => {
					room.add(`|raw|${html}`).update();
					room = null;
				});
			},
		},
		round: 0,
		leaderboard: true,
	},
};

class GameTemplate {
	constructor(room) {
		this.room = room;
		this.playerlist = null;
	}

	destroy(force) {
		if (this.timer) clearTimeout(this.timer);
		if (force && this.room.game && this.room.game.gameid === 'scavengerhunt') this.room.game.onEnd(null);
		delete this.room.scavgame;
	}

	eliminate(userid) {
		if (!this.playerlist || !this.playerlist.includes(userid)) return false;
		this.playerlist = this.playerlist.filter(pid => pid !== userid);

		if (this.leaderboard) delete this.leaderboard.data[userid];
		return true;
	}

	announce(msg) {
		this.room.add(`|raw|<div class="broadcast-blue"><strong>${msg}</strong></div>`).update();
	}
}

const LoadGame = function (room, gameid) {
	let game = MODES[gameid];
	if (!game) return false; // invalid id
	if (typeof game === 'string') game = MODES[game];

	let base = new GameTemplate(room);

	let scavgame = Object.assign(base, game);

	// initialize leaderboard if required
	if (scavgame.leaderboard) {
		scavgame.leaderboard = new Leaderboard();
	}
	return scavgame;
};

module.exports = {
	LoadGame,
	twists: TWISTS,
	modes: MODES,
};
