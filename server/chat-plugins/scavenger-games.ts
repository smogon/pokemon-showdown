/**
 * Scavengers Games Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This plugin stores the different possible game modes and twists that take place in scavengers room
 *
 * @license MIT license
 */

import {ScavengerHunt} from './scavengers';

export type TwistEvent = (
	this: ScavengerHunt,
	...args: any[]
) => void;
interface Twist {
	name: string;
	id: string;
	desc?: string;
	[eventid: string]: string | number | TwistEvent | undefined;
}
interface GameMode {
	name: string;
	id: string;
	mod: Twist;
	round?: number;
	leaderboard?: true;
	[k: string]: any;
}

class Leaderboard {
	data: AnyObject;

	constructor() {
		this.data = {};
	}

	addPoints(name: string, aspect: string, points: number, noUpdate?: boolean) {
		const userid: string = toID(name);

		if (!userid || userid === 'constructor' || !points) return this;
		if (!this.data[userid]) this.data[userid] = {name: name};

		if (!this.data[userid][aspect]) this.data[userid][aspect] = 0;
		this.data[userid][aspect] += points;

		if (!noUpdate) this.data[userid].name = name; // always keep the last used name

		return this; // allow chaining
	}

	visualize(sortBy: string, userid?: string) {
		// return a promise for async sorting - make this less exploitable
		return new Promise((resolve, reject) => {
			let lowestScore = Infinity;
			let lastPlacement = 1;

			const ladder = Object.keys(this.data)
				.filter(k => sortBy in this.data[k])
				.sort((a, b) => this.data[b][sortBy] - this.data[a][sortBy])
				.map((u, i) => {
					const bit = this.data[u];
					if (bit[sortBy] !== lowestScore) {
						lowestScore = bit[sortBy];
						lastPlacement = i + 1;
					}
					return Object.assign(
						{rank: lastPlacement},
						bit
					);
				}); // identify ties
			if (userid) {
				const rank = ladder.find(entry => toID(entry.name) === userid);
				resolve(rank);
			} else {
				resolve(ladder);
			}
		});
	}

	async htmlLadder(): Promise<string> {
		const data = await this.visualize('points') as AnyObject[];
		const display = `<div class="ladder" style="overflow-y: scroll; max-height: 170px;"><table style="width: 100%"><tr><th>Rank</th><th>Name</th><th>Points</th></tr>${data.map(line =>
			`<tr><td>${line.rank}</td><td>${line.name}</td><td>${line.points}</td></tr>`).join('')
		}</table></div>`;
		return display;
	}
}

const TWISTS: {[k: string]: Twist} = {
	perfectscore: {
		name: 'Perfect Score',
		id: 'perfectscore',
		desc: "Players who finish the hunt without submitting a single wrong answer get a shoutout!",

		onLeave(player) {
			if (!this.leftGame) this.leftGame = [];
			this.leftGame.push(player.id);
		},

		onSubmitPriority: 1,
		onSubmit(player, value) {
			const currentQuestion = player.currentQuestion;

			if (!player.answers) player.answers = {};
			if (!player.answers[currentQuestion]) player.answers[currentQuestion] = [];

			if (player.answers[currentQuestion].includes(value)) return;

			player.answers[currentQuestion].push(value);
		},

		onComplete(player, time, blitz) {
			const isPerfect = Object.keys(player.answers).map(q => player.answers[q].length).every(attempts => attempts <= 1);
			return {name: player.name, time, blitz, isPerfect};
		},

		onAfterEndPriority: 1,
		onAfterEnd() {
			const perfect = this.completed.filter(entry => entry.isPerfect).map(entry => entry.name);
			if (perfect.length) {
				this.announce(Chat.html`${Chat.toListString(perfect)} ${perfect.length > 1 ? 'have' : 'has'} completed the hunt without a single wrong answer!`);
			}
		},
	},

	incognito: {
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
			const now = Date.now();
			const time = Chat.toDurationString(now - this.startTime, {hhmmss: true});

			const blitz = now - this.startTime <= 60000 &&
				(this.room.scavSettings?.blitzPoints?.[this.gameType] || this.gameType === 'official');

			const result = this.runEvent('Complete', player, time, blitz) || {name: player.name, time, blitz};

			this.preCompleted = this.preCompleted ? [...this.preCompleted, result] : [result];
			player.completed = true;
			player.destroy();
		},

		onEnd() {
			this.completed = this.preCompleted || [];
		},
	},

	blindincognito: {
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
			const now = Date.now();
			const time = Chat.toDurationString(now - this.startTime, {hhmmss: true});

			const blitz = now - this.startTime <= 60000 &&
				(this.room.scavSettings?.blitzPoints?.[this.gameType] || this.gameType === 'official');

			const result = this.runEvent('Complete', player, time, blitz) || {name: player.name, time, blitz};

			this.preCompleted = this.preCompleted ? [...this.preCompleted, result] : [result];
			player.completed = true;
		},

		onEnd() {
			this.completed = this.preCompleted || [];
		},
	},
};

const MODES: {[k: string]: GameMode | string} = {
	ko: 'kogames',
	kogames: {
		name: 'KO Games',
		id: 'kogames',

		mod: {
			name: 'KO Games',
			id: 'KO Games',

			onLoad() {
				this.allowRenames = false; // don't let people change their name in the middle of the hunt.
			},

			onJoin(user: User) {
				const game = this.room.scavgame!;
				if (game.playerlist && !game.playerlist.includes(user.id)) {
					user.sendTo(this.room, 'You are not allowed to join this scavenger hunt.');
					return true;
				}
			},

			onAfterEnd() {
				const game = this.room.scavgame!;
				if (!this.completed.length) {
					this.announce('No one has completed the hunt - the round has been void.');
					return;
				}

				game.round++;

				// elimination
				if (!game.playerlist) {
					game.playerlist = this.completed.map(entry => toID(entry.name));
					this.announce(`Round ${game.round} - ${Chat.toListString(this.completed.map(p => `<em>${p.name}</em>`))} have successfully completed the last hunt and have moved on to the next round!`);
				} else {
					let eliminated = [];
					const completed = this.completed.map(entry => toID(entry.name)) as string[];
					if (completed.length === game.playerlist.length) {
						eliminated.push(completed.pop()); // eliminate one
						game.playerlist = game.playerlist.filter(userid => completed.includes(userid));
					} else {
						eliminated = game.playerlist.filter(userid => !completed.includes(userid));
						for (const username of eliminated) {
							const userid = toID(username);
							game.playerlist = game.playerlist.filter(pid => pid !== userid);
						}
					}

					this.announce(`Round ${game.round} - ${Chat.toListString(eliminated.map(n => `<em>${n}</em>`))} ${Chat.plural(eliminated, 'have', 'has')} been eliminated! ${Chat.toListString(game.playerlist.map(p => `<em>${this.playerTable[p].name}</em>`))} have successfully completed the last hunt and have moved on to the next round!`);
				}

				// process end of game
				if (game.playerlist.length === 1) {
					const winningUser = Users.get(game.playerlist[0]);
					const winner = winningUser ? winningUser.name : game.playerlist[0];

					this.announce(`Congratulations to the winner - ${winner}!`);
					game.destroy();
				} else if (!game.playerlist.length) {
					this.announce('Everyone has been eliminated!  Better luck next time!');
					game.destroy();
				}
			},
		},

		round: 0,
		playerlist: null,
	},

	scav: 'scavengergames',
	scavgames: 'scavengergames',
	scavengergames: {
		name: 'Scavenger Games',
		id: 'scavengergames',

		mod: {
			name: 'Scavenger Games',
			id: 'scavengergames',

			onLoad() {
				this.allowRenames = false; // don't let people change their name in the middle of the hunt.
				this.setTimer(1);
			},

			onJoin(user) {
				const game = this.room.scavgame!;
				if (game.playerlist && !game.playerlist.includes(user.id)) {
					user.sendTo(this.room, 'You are not allowed to join this scavenger hunt.');
					return true;
				}
			},

			onAfterEnd() {
				const game = this.room.scavgame!;
				if (!this.completed.length) {
					this.announce('No one has completed the hunt - the round has been void.');
					return;
				}
				game.round++;

				let eliminated: string[] = [];
				if (!game.playerlist) {
					game.playerlist = this.completed.map(entry => toID(entry.name) as string);
				} else {
					const completed = this.completed.map(entry => toID(entry.name) as string);
					eliminated = game.playerlist.filter(userid => !completed.includes(userid));
					for (const username of eliminated) {
						const userid = toID(username);
						game.playerlist = game.playerlist.filter(pid => pid !== userid);
					}
				}

				this.announce(`Round ${game.round} - ${Chat.toListString(eliminated.map(n => `<em>${n}</em>`))} ${eliminated.length ? `${Chat.plural(eliminated, 'have', 'has')} been eliminated!` : ''} ${Chat.toListString(game.playerlist.map(p => `<em>${this.playerTable[p].name}</em>`))} have successfully completed the last hunt and have moved on to the next round!`);

				// process end of game
				if (game.playerlist.length === 1) {
					const winningUser = Users.get(game.playerlist[0]);
					const winner = winningUser ? winningUser.name : game.playerlist[0];

					this.announce(`Congratulations to the winner - ${winner}!`);
					game.destroy();
				} else if (!game.playerlist.length) {
					this.announce('Everyone has been eliminated!  Better luck next time!');
					game.destroy();
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
				const game = this.room.scavgame!;
				this.announce(`Round ${++game.round}`);
			},

			async onAfterEnd() {
				const game = this.room.scavgame!;
				for (const [i, completed] of this.completed.map(e => e.name).entries()) {
					const points = (game.pointDistribution[i] ||
						game.pointDistribution[game.pointDistribution.length - 1]);
					game.leaderboard.addPoints(completed, 'points', points);
				}
				// post leaderboard
				const room = this.room;
				const html = await game.leaderboard.htmlLadder() as string;
				room.add(`|raw|${html}`).update();
			},
		},
		round: 0,
		leaderboard: true,
	},

	jumpstart: {
		name: 'Jump Start',
		id: 'jumpstart',

		jumpstart: [60, 40, 30, 20, 10],
		round: 0,
		mod: {
			name: 'Jump Start',
			id: 'jumpstart',

			onLoad() {
				const game = this.room.scavgame!;
				if (game.round === 0) return;
				const maxTime = (game.jumpstart as number[]).sort((a, b) => b - a)[0];

				this.jumpstartTimers = [];
				this.answerLock = true;

				for (const [i, time] of game.jumpstart.entries()) {
					if (!game.completed[i]) break;

					this.jumpstartTimers[i] = setTimeout(() => {
						const target = game.completed.shift();
						if (!target) return;

						const staffHost = Users.get(this.staffHostId);
						const targetUser = Users.get(target);

						if (targetUser) {
							if (staffHost) staffHost.sendTo(this.room, `${targetUser.name} has received their first hint early.`);
							targetUser.sendTo(
								this.room,
								`|raw|<strong>The first hint to the next hunt is:</strong> ${Chat.formatText(this.questions[0].hint)}`
							);
							targetUser.sendTo(
								this.room,
								`|notify|Early Hint|The first hint to the next hunt is: ${Chat.formatText(this.questions[0].hint)}`
							);
						}
					}, (maxTime - time) * 1000 + 5000);
				}

				// when the jump starts are all given to eligible players
				this.jumpstartTimers[this.jumpstartTimers.length] = setTimeout(() => {
					this.answerLock = false;
					const message = this.getCreationMessage(true);
					this.room.add(message).update();
					this.announce('You may start guessing!');
					this.startTime = Date.now();
				}, 1000 * (maxTime + 5));
			},

			onJoin(user) {
				if (this.answerLock) {
					user.sendTo(this.room, `The hunt is not open for guesses yet!`);
					return true;
				}
			},

			onViewHunt(user) {
				if (this.answerLock && !(this.hosts.some(h => h.id === user.id) || user.id === this.staffHostId)) {
					return true;
				}
			},

			onCreateCallback() {
				if (this.answerLock) {
					return `|raw|<div class="broadcast-blue"><strong>${['official', 'unrated'].includes(this.gameType) ? 'An' : 'A'} ${this.gameType} ` +
						`Scavenger Hunt by <em>${Chat.escapeHTML(Chat.toListString(this.hosts.map(h => h.name)))}</em> ` +
						`has been started${(this.hosts.some(h => h.id === this.staffHostId) ? '' : ` by <em>${Chat.escapeHTML(this.staffHostName)}</em>`)}.` +
						`<br />The first hint is currently being handed out to early finishers.`;
				}
			},

			onEnd(reset) {
				if (this.jumpstartTimers) {
					for (const timer of this.jumpstartTimers) {
						clearTimeout(timer);
					}
				}
				const game = this.room.scavgame!;
				if (!reset) {
					if (game.round === 0) {
						game.completed = this.completed.map(entry => toID(entry.name));
						game.round++;
					} else {
						game.destroy();
					}
				}
			},
		},
	},
};

export class ScavengerGameTemplate {
	room: ChatRoom | GameRoom;
	playerlist: null | string[];
	timer: NodeJS.Timer | null;

	[k: string]: any;
	constructor(room: GameRoom | ChatRoom) {
		this.room = room;
		this.playerlist = null;
		this.timer = null;
	}

	destroy(force?: boolean) {
		if (this.timer) clearTimeout(this.timer);
		const game = this.room.getGame(ScavengerHunt);
		if (force && game) game.onEnd(false);
		delete this.room.scavgame;
	}

	eliminate(userid: string) {
		if (!this.playerlist || !this.playerlist.includes(userid)) return false;
		this.playerlist = this.playerlist.filter(pid => pid !== userid);

		if (this.leaderboard) delete this.leaderboard.data[userid];
		return true;
	}

	announce(msg: string) {
		this.room.add(`|raw|<div class="broadcast-blue"><strong>${msg}</strong></div>`).update();
	}
}

const LoadGame = function (room: ChatRoom | GameRoom, gameid: string) {
	let game = MODES[gameid];
	if (!game) return false; // invalid id
	if (typeof game === 'string') game = MODES[game];

	const base = new ScavengerGameTemplate(room);

	const scavgame = Object.assign(base, game);

	// initialize leaderboard if required
	if (scavgame.leaderboard) {
		scavgame.leaderboard = new Leaderboard();
	}
	return scavgame;
};

export const ScavMods = {
	LoadGame,
	twists: TWISTS,
	modes: MODES,
};
