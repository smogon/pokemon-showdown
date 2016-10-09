/*
 * Trivia plugin
 * Written by Morfent
 */

'use strict';

const fs = require('fs');

const CATEGORIES = {
	ae: 'Arts and Entertainment',
	pokemon: 'Pok\u00E9mon',
	sg: 'Science and Geography',
	sh: 'Society and Humanities',
};

const MODES = {
	first: 'First',
	number: 'Number',
	timer: 'Timer',
};

// NOTE: trivia code depends on this object's values being divisible by 5.
const SCORE_CAPS = {
	short: 20,
	medium: 35,
	long: 50,
};

Object.setPrototypeOf(CATEGORIES, null);
Object.setPrototypeOf(MODES, null);
Object.setPrototypeOf(SCORE_CAPS, null);

const SIGNUP_PHASE = 'signups';
const QUESTION_PHASE = 'question';
const INTERMISSION_PHASE = 'intermission';

const MINIMUM_PLAYERS = 3;

const START_TIMEOUT = 30 * 1000;
const QUESTION_INTERVAL = 12 * 1000 + 500;
const INTERMISSION_INTERVAL = 30 * 1000;

const MAX_QUESTION_LENGTH = 252;
const MAX_ANSWER_LENGTH = 32;

// TODO: move trivia database code to a separate file once relevant.
let triviaData = {};
try {
	triviaData = require('../config/chat-plugins/triviadata.json');
} catch (e) {} // file doesn't exist or contains invalid JSON
if (!triviaData || typeof triviaData !== 'object') triviaData = {};
if (!triviaData || typeof triviaData.leaderboard !== 'object') triviaData.leaderboard = {};
if (!Array.isArray(triviaData.ladder)) triviaData.ladder = [];
if (!Array.isArray(triviaData.questions)) triviaData.questions = [];
if (!Array.isArray(triviaData.submissions)) triviaData.submissions = [];

const writeTriviaData = (() => {
	let writing = false;
	let writePending = false;
	return () => {
		if (writing) {
			writePending = true;
			return;
		}
		writing = true;

		let data = JSON.stringify(triviaData, null, 2);
		let path = 'config/chat-plugins/triviadata.json';
		let tempPath = `${path}.0`;

		fs.writeFile(tempPath, data, () => {
			fs.rename(tempPath, path, () => {
				writing = false;
				if (writePending) {
					writePending = false;
					process.nextTick(() => writeTriviaData());
				}
			});
		});
	};
})();

// Binary search for the index at which to splice in new questions in a category,
// or the index at which to slice up to for a category's questions
// TODO: why isn't this a map? Storing questions/submissions sorted by
// category is pretty stupid when maps exist for that purpose.
function findEndOfCategory(category, inSubmissions) {
	let questions = inSubmissions ? triviaData.submissions : triviaData.questions;
	let left = 0;
	let right = questions.length;
	let i = 0;
	let curCategory;
	while (left < right) {
		i = (left + right) / 2 | 0;
		curCategory = questions[i].category;
		if (curCategory < category) {
			left = i + 1;
		} else if (curCategory > category) {
			right = i;
		} else {
			while (++i < questions.length) {
				if (questions[i].category !== category) break;
			}
			return i;
		}
	}

	return left;
}

function sliceCategory(category) {
	let questions = triviaData.questions;
	if (!questions.length) return [];

	let sliceUpTo = findEndOfCategory(category, false);
	if (!sliceUpTo) return [];

	let categories = Object.keys(CATEGORIES);
	let categoryIdx = categories.indexOf(category);
	if (!categoryIdx) return questions.slice(0, sliceUpTo);

	// findEndOfCategory for the category prior to the specified one in
	// alphabetical order returns the index of the first question in it
	let sliceFrom = findEndOfCategory(categories[categoryIdx - 1], false);
	if (sliceFrom === sliceUpTo) return [];

	return questions.slice(sliceFrom, sliceUpTo);
}

class TriviaPlayer extends Rooms.RoomGamePlayer {
	constructor(user, game) {
		super(user, game);

		this.points = 0;
		this.correctAnswers = 0;

		this.answer = '';
		this.answeredAt = [];
		this.isCorrect = false;
	}

	setAnswer(answer, isCorrect) {
		this.answer = answer;
		this.answeredAt = process.hrtime();
		this.isCorrect = !!isCorrect;
	}

	incrementPoints(points) {
		this.points += points;
		this.correctAnswers++;
	}

	clearAnswer() {
		this.answer = '';
		this.isCorrect = false;
	}
}

class Trivia extends Rooms.RoomGame {
	constructor(room, mode, category, length, questions) {
		super(room);
		this.gameid = 'trivia';
		this.title = 'Trivia';
		this.allowRenames = true;
		this.playerCap = Number.MAX_SAFE_INTEGER;

		this.mode = MODES[mode];
		this.cap = SCORE_CAPS[length];
		if (category === 'all') {
			this.category = 'All';
		} else if (category === 'random') {
			this.category = 'Random (' + CATEGORIES[questions[0].category] + ')';
		} else {
			this.category = CATEGORIES[category];
		}

		// Awards 3 leaderboard points to the winner of short games, 4 for
		// medium ones, and 5 for long ones.
		this.prize = (this.cap - 5) / 15 + 2;

		this.phase = SIGNUP_PHASE;
		this.questions = questions;
		this.curQuestion = '';
		this.curAnswers = [];
		this.askedAt = [];

		this.kickedUsers = new Set();

		this.broadcast(
			'Signups for a new trivia game have begun!',
			'Mode: ' + this.mode + ' | Category: ' + this.category + ' | Score cap: ' + this.cap + '<br />' +
			'Enter /trivia join to sign up for the trivia game.'
		);
	}

	// Overwrite some RoomGame prototype methods...
	addPlayer(user) {
		if (this.players[user.userid]) return 'You have already signed up for this trivia game.';
		if (this.kickedUsers.has(user.userid)) {
			return 'You were kicked from the trivia game and thus cannot join until the next one.';
		}

		for (let id in user.prevNames) {
			if (this.players[id]) return 'You have already signed up for this trivia game.';
			if (this.kickedUsers.has(id)) return 'You were kicked from the trivia game and cannot join until the next game.';
		}

		for (let id in this.players) {
			let tarUser = Users.get(id);
			if (tarUser) {
				if (tarUser.prevNames[user.userid]) return 'You have already signed up for this trivia game.';

				let tarPrevNames = Object.keys(tarUser.prevNames);
				let prevNameMatch = tarPrevNames.some(tarId => (tarId in user.prevNames));
				if (prevNameMatch) return 'You have already signed up for this trivia game.';

				let tarIps = Object.keys(tarUser.ips);
				let ipMatch = tarIps.some(ip => (ip in user.ips));
				if (ipMatch) return 'You have already signed up for this trivia game.';
			}
		}

		let player = this.makePlayer(user);
		this.players[user.userid] = player;
		this.playerCount++;

		return 'You have signed up for the game of trivia.';
	}

	makePlayer(user) {
		return new TriviaPlayer(user, this);
	}

	destroy() {
		clearTimeout(this.phaseTimeout);
		this.phaseTimeout = null;
		this.kickedUsers.clear();

		let room = this.room;
		this.room = null;
		for (let i in this.players) {
			this.players[i].destroy();
		}

		delete room.game;
	}

	// Generates and broadcasts the HTML for a generic announcement containing
	// a title and an optional message.
	broadcast(title, message) {
		let buffer = '<div class="broadcast-blue">' +
			'<strong>' + title + '</strong>';
		if (message) buffer += '<br />' + message;
		buffer += '</div>';

		this.room.addRaw(buffer);
		this.room.update();
	}

	// Kicks a player from the game, preventing them from joining it again
	// until the next game begins.
	kick(tarUser, user) {
		if (!this.players[tarUser.userid]) {
			if (this.kickedUsers.has(tarUser.userid)) return 'User ' + tarUser.name + ' has already been kicked from the trivia game.';

			for (let id in tarUser.prevNames) {
				if (this.kickedUsers.has(id)) return 'User ' + tarUser.name + ' has already been kicked from the trivia game.';
			}

			for (let kickedUserid of this.kickedUsers) {
				let kickedUser = Users.get(kickedUserid);
				if (kickedUser) {
					if (kickedUser.prevNames[tarUser.userid]) {
						return 'User ' + tarUser.name + ' has already been kicked from the trivia game.';
					}

					let prevNames = Object.keys(kickedUser.prevNames);
					let nameMatch = prevNames.some(id => tarUser.prevNames[id]);
					if (nameMatch) return 'User ' + tarUser.name + ' has already been kicked from the trivia game.';

					let ips = Object.keys(kickedUser.ips);
					let ipMatch = ips.some(ip => tarUser.ips[ip]);
					if (ipMatch) return 'User ' + tarUser.name + ' has already been kicked from the trivia game.';
				}
			}

			return 'User ' + tarUser.name + ' is not a player in the current trivia game.';
		}

		this.kickedUsers.add(tarUser.userid);
		for (let id in tarUser.prevNames) {
			this.kickedUsers.add(id);
		}

		super.removePlayer(tarUser);
	}

	leave(user) {
		if (!this.players[user.userid]) {
			return 'You are not a player in the current trivia game.';
		}

		super.removePlayer(user);
	}

	// Starts the question loop for a trivia game in its signup phase.
	start() {
		if (this.phase !== SIGNUP_PHASE) return 'The game has already been started.';
		if (this.playerCount < MINIMUM_PLAYERS) {
			return 'Not enough players have signed up yet! Trivia games require at least ' + MINIMUM_PLAYERS + ' players to begin.';
		}

		this.broadcast('The trivia game will begin in ' + (START_TIMEOUT / 1000) + ' seconds...');
		this.phaseTimeout = setTimeout(() => this.askQuestion(), START_TIMEOUT);
	}

	// Broadcasts the next question on the questions list to the room and sets
	// a timeout to tally the answers received.
	askQuestion() {
		if (!this.questions.length) {
			this.broadcast(
				'No questions are left!',
				'The game has reached a stalemate. Nobody gained any points on the leaderboard.'
			);
			return this.destroy();
		}

		this.phase = QUESTION_PHASE;
		this.askedAt = process.hrtime();

		let questionObj = this.questions.pop();
		this.curQuestion = questionObj.question;
		this.curAnswers = questionObj.answers;

		this.broadcast(
			'Question: ' + this.curQuestion,
			'Category: ' + CATEGORIES[questionObj.category]
		);

		this.phaseTimeout = setTimeout(() => this.tallyAnswers(), QUESTION_INTERVAL);
	}

	// This is a noop here since it'd defined properly by subclasses later on.
	// All this is obligated to do is take a user and their answer as args;
	// the behaviour of this method can be entirely arbitrary otherwise.
	answerQuestion() {}

	// Verifies whether or not an answer is correct. In longer answers, small
	// typos can be made and still have the answer be considered correct.
	verifyAnswer(tarAnswer) {
		return this.curAnswers.some(answer => (
			(answer === tarAnswer) || (answer.length > 5 && Tools.levenshtein(tarAnswer, answer) < 3)
		));
	}

	// This is a noop here since it'd defined properly by mode subclasses later
	// on. This calculates the points a correct responder earns, which is
	// typically between 1-5.
	calculatePoints() {}

	// This is a noop here since it's defined properly by mode subclasses later
	// on. This is obligated to update the game phase, but it can be entirely
	// arbitrary otherwise.
	tallyAnswers() {}

	// Ends the game after a player's score has exceeded the score cap.
	// FIXME: this class and trivia database logic don't belong in bed with
	// each other! Abstract all that away from this method as soon as possible.
	win(winner, buffer) {
		buffer += Chat.escapeHTML(winner.name) + ' won the game with a final score of <strong>' + winner.points + '</strong>, ' +
			'and their leaderboard score has increased by <strong>' + this.prize + '</strong> points!';
		this.broadcast('The answering period has ended!', buffer);

		let leaderboard = triviaData.leaderboard;
		for (let i in this.players) {
			let player = this.players[i];
			if (!player.points) continue;

			if (leaderboard[i]) {
				let rank = leaderboard[i];
				rank[1] += player.points;
				rank[2] += player.correctAnswers;
			} else {
				leaderboard[i] = [0, player.points, player.correctAnswers];
			}
		}

		if (winner) leaderboard[winner.userid][0] += this.prize;

		let leaders = Object.keys(leaderboard);
		let ladder = triviaData.ladder = [];
		for (let i = 0; i < 3; i++) {
			leaders.sort((a, b) => leaderboard[b][i] - leaderboard[a][i]);

			let max = Infinity;
			let rank = 0;
			let rankIdx = i + 3;
			for (let j = 0; j < leaders.length; j++) {
				let leader = leaders[j];
				let score = leaderboard[leader][i];
				if (max !== score) {
					if (!i && rank < 15) {
						if (ladder[rank]) {
							ladder[rank].push(leader);
						} else {
							ladder[rank] = [leader];
						}
					}

					rank++;
					max = score;
				}
				leaderboard[leader][rankIdx] = rank;
			}
		}

		for (let i in this.players) {
			let player = this.players[i];
			let user = Users.get(player.userid);
			if (!user || user.userid === winner.userid) continue;
			user.sendTo(
				this.room.id,
				"You gained " + player.points + " and answered " +
				player.correctAnswers + " questions correctly."
			);
		}

		let buf = "(User " + winner.name + " won the game of " + this.mode +
			" mode trivia under the " + this.category + " category with a cap of " +
			this.cap + " points, with " + winner.points + " points and " +
			winner.correctAnswers + " correct answers!)";
		this.room.sendModCommand(buf);
		this.room.logEntry(buf);
		this.room.modlog(buf);

		writeTriviaData();
		this.destroy();
	}

	// Forcibly ends a trivia game.
	end(user) {
		this.broadcast('The trivia game was forcibly ended by ' + Chat.escapeHTML(user.name) + '.');
		this.destroy();
	}
}

// Helper function for timer and number modes. Milliseconds are not precise
// enough to score players properly in rare cases.
const hrtimeToNanoseconds = hrtime => hrtime[0] * 1e9 + hrtime[1];

// First mode rewards points to the first user to answer the question
// correctly.
class FirstModeTrivia extends Trivia {
	answerQuestion(answer, user) {
		let player = this.players[user.userid];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';
		if (player.answer) return 'You have already attempted to answer the current question.';

		player.setAnswer(answer);
		if (!this.verifyAnswer(answer)) return 'You have selected "' + answer + '" as your answer.';

		// The timeout for Trivia.prototype.tallyAnswers is still
		// going, remember?
		clearTimeout(this.phaseTimeout);
		this.phase = INTERMISSION_PHASE;

		let buffer = 'Correct: ' + Chat.escapeHTML(user.name) + '<br />' +
			'Answer(s): ' + this.curAnswers.join(', ') + '<br />';

		let points = this.calculatePoints();
		player.incrementPoints(points);
		if (player.points >= this.cap) return this.win(player, buffer);

		for (let i in this.players) {
			let player = this.players[i];
			player.clearAnswer();
		}

		buffer += 'They gained <strong>5</strong> points!';
		this.broadcast('The answering period has ended!', buffer);
		this.phaseTimeout = setTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}

	calculatePoints() {
		return 5;
	}

	tallyAnswers() {
		this.phase = INTERMISSION_PHASE;

		for (let i in this.players) {
			let player = this.players[i];
			player.clearAnswer();
		}

		this.broadcast(
			'The answering period has ended!',
			'Correct: no one...<br />' +
			'Answers: ' + this.curAnswers.join(', ') + '<br />' +
			'Nobody gained any points.'
		);

		this.phaseTimeout = setTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

// Timer mode rewards up to 5 points to all players who answer correctly
// depending on how quickly they answer the question.
class TimerModeTrivia extends Trivia {
	answerQuestion(answer, user) {
		let player = this.players[user.userid];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';

		let isCorrect = this.verifyAnswer(answer);
		player.setAnswer(answer, isCorrect);
		return 'You have selected "' + answer + '" as your answer.';
	}

	// diff: the difference between the time the player answered the
	//    question and when the question was asked, in nanoseconds
	// totalDiff: the difference between the time scoring began and the
	//    time the question was asked, in nanoseconds
	calculatePoints(diff, totalDiff) {
		return 6 - 5 * diff / totalDiff | 0;
	}

	tallyAnswers() {
		this.phase = INTERMISSION_PHASE;

		let buffer = (
			'Answer(s): ' + this.curAnswers.join(', ') + '<br />' +
			'<table style="width: 100%; background-color: #9CBEDF; margin: 2px 0">' +
				'<tr style="background-color: #6688AA">' +
					'<th style="width: 100px">Points gained</th>' +
					'<th>Correct</th>' +
				'</tr>'
		);
		let innerBuffer = new Map([5, 4, 3, 2, 1].map(n => [n, []]));

		let winner;

		let now = hrtimeToNanoseconds(process.hrtime());
		let askedAt = hrtimeToNanoseconds(this.askedAt);
		let totalDiff = now - askedAt;
		for (let i in this.players) {
			let player = this.players[i];
			if (!player.isCorrect) {
				player.clearAnswer();
				continue;
			}

			let playerAnsweredAt = hrtimeToNanoseconds(player.answeredAt);
			let diff = playerAnsweredAt - askedAt;
			let points = this.calculatePoints(diff, totalDiff);
			player.incrementPoints(points);

			let pointBuffer = innerBuffer.get(points);
			pointBuffer.push([Chat.escapeHTML(player.name), playerAnsweredAt]);

			if (winner) {
				if (player.points > winner.points) {
					winner = player;
				} else if (winner.points === player.points) {
					let winnerAnsweredAt = hrtimeToNanoseconds(winner.answeredAt);
					if (playerAnsweredAt < winnerAnsweredAt) {
						winner = player;
					}
				}
			} else if (player.points >= this.cap) {
				winner = player;
			}

			player.clearAnswer();
		}

		let rowAdded = false;
		innerBuffer.forEach((players, pointValue) => {
			if (!players.length) return false;

			rowAdded = true;
			players = players
				.sort((a, b) => a[1] - b[1])
				.map(a => a[0]);
			buffer += (
				'<tr style="background-color: #6688AA">' +
					'<td style="text-align: center">' + pointValue + '</td>' +
					'<td>' + players.join(', ') + '</td>' +
				'</tr>'
			);
		});

		if (!rowAdded) {
			buffer += (
				'<tr style="background-color: #6688AA">' +
					'<td style="text-align: center">&#8212;</td>' +
					'<td>No one answered correctly...</td>' +
				'</tr>'
			);
		}

		if (winner) {
			buffer += '</table><br />';
			return this.win(winner, buffer);
		}

		buffer += '</table>';
		this.broadcast('The answering period has ended!', buffer);
		this.phaseTimeout = setTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

// Number mode rewards up to 5 points to all players who answer correctly
// depending on the ratio of correct players to total players (lower ratio is
// better).
class NumberModeTrivia extends Trivia {
	answerQuestion(answer, user) {
		let player = this.players[user.userid];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';

		let isCorrect = this.verifyAnswer(answer);
		player.setAnswer(answer, isCorrect);
		return 'You have selected "' + answer + '" as your answer.';
	}

	calculatePoints(correctPlayers) {
		return correctPlayers && (6 - (5 * correctPlayers / this.playerCount | 0));
	}

	tallyAnswers() {
		this.phase = INTERMISSION_PHASE;

		let buffer;
		let innerBuffer = Object.keys(this.players)
			.filter(id => this.players[id].isCorrect)
			.map(id => {
				let player = this.players[id];
				return [Chat.escapeHTML(player.name), hrtimeToNanoseconds(player.answeredAt)];
			})
			.sort((a, b) => a[1] - b[1]);

		let points = this.calculatePoints(innerBuffer.length);
		if (points) {
			let winner;
			for (let i in this.players) {
				let player = this.players[i];
				if (player.isCorrect) player.incrementPoints(points);

				if (winner) {
					if (player.points > winner.points) {
						winner = player;
					} else if (player.points === winner.points) {
						let playerAnsweredAt = hrtimeToNanoseconds(player.answeredAt);
						let winnerAnsweredAt = hrtimeToNanoseconds(winner.answeredAt);
						if (playerAnsweredAt < winnerAnsweredAt) {
							winner = player;
						}
					}
				} else if (player.points >= this.cap) {
					winner = player;
				}

				player.clearAnswer();
			}

			buffer = 'Correct: ' + innerBuffer.map(arr => arr[0]).join(', ') + '<br />' +
				'Answer(s): ' + this.curAnswers.join(', ') + '<br />';

			if (winner) return this.win(winner, buffer);

			buffer += (innerBuffer.length > 1 ? 'Each of them' : 'They') + ' gained <strong>' + points + '</strong> point(s)!';
		} else {
			for (let i in this.players) {
				let player = this.players[i];
				player.clearAnswer();
			}

			buffer = 'Correct: no one...<br />' +
				'Answer(s): ' + this.curAnswers.join(', ') + '<br />' +
				'Nobody gained any points.';
		}

		this.broadcast('The answering period has ended!', buffer);
		this.phaseTimeout = setTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

const commands = {
	new: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in the Trivia room.");
		if (!this.can('broadcast', null, room) || !target) return false;
		if (!this.canTalk()) return;
		if (room.game) {
			return this.errorReply("There is already a game of " + room.game.title + " in progress.");
		}

		let tars = target.split(',');
		if (tars.length !== 3) return this.errorReply("Invalid arguments specified.");

		let mode = toId(tars[0]);
		if (!MODES[mode]) return this.errorReply("\"" + mode + "\" is an invalid mode.");

		let category = toId(tars[1]);
		let isRandom = (category === 'random');
		let isAll = !isRandom && (category === 'all');
		if (!isRandom && !isAll && !CATEGORIES[category]) {
			return this.errorReply("\"" + category + "\" is an invalid category.");
		}

		let length = toId(tars[2]);
		if (!SCORE_CAPS[length]) return this.errorReply("\"" + length + "\" is an invalid game length.");

		let questions;
		if (isRandom) {
			let categories = Object.keys(CATEGORIES);
			let randCategory = categories[Math.random() * categories.length | 0];
			questions = sliceCategory(randCategory);
		} else if (isAll) {
			questions = triviaData.questions;
		} else {
			questions = sliceCategory(category);
		}

		if (questions.length < SCORE_CAPS[length] / 5) {
			if (isRandom) return this.errorReply("There are not enough questions in the randomly chosen category to finish a trivia game.");
			if (isAll) return this.errorReply("There are not enough questions in the trivia database to finish a trivia game.");
			return this.errorReply("There are not enough questions under the category \"" + CATEGORIES[category] + "\" to finish a trivia game.");
		}

		// This prevents trivia games from modifying the trivia database.
		questions = Object.assign([], questions);
		// Randomizes the order of the questions.
		questions = Tools.shuffle(questions);

		let _Trivia;
		if (mode === 'first') {
			_Trivia = FirstModeTrivia;
		} else if (mode === 'timer') {
			_Trivia = TimerModeTrivia;
		} else if (mode === 'number') {
			_Trivia = NumberModeTrivia;
		}

		room.game = new _Trivia(room, mode, category, length, questions);
	},
	newhelp: ["/trivia new [mode], [category], [length] - Begin a new trivia game. Requires: + % @ * # & ~"],

	join: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply("There is already a game of " + room.game.title + " in progress.");
		}

		let res = room.game.addPlayer(user);
		if (typeof res === 'string') this.sendReply(res);
	},
	joinhelp: ["/trivia join - Join the current trivia game."],

	kick: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply("There is already a game of " + room.game.title + " in progress.");
		}

		this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply("The user \"" + target + "\" does not exist.");

		let res = room.game.kick(targetUser, user);
		if (typeof res === 'string') this.sendReply(res);
	},
	kickhelp: ["/trivia kick [username] - Kick players from a trivia game by username. Requires: % @ * # & ~"],

	leave: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply("There is already a game of " + room.game.title + " in progress.");
		}

		let res = room.game.leave(user);
		if (typeof res === 'string') return this.errorReply(res);
		this.sendReply("You have left the current game of trivia.");
	},
	leavehelp: ["/trivia leave - Makes the player leave the game."],

	start: function (target, room) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!this.can('broadcast', null, room)) return false;
		if (!this.canTalk()) return;
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply("There is already a game of " + room.game.title + " in progress.");
		}

		let res = room.game.start();
		if (typeof res === 'string') this.sendReply(res);
	},
	starthelp: ["/trivia start - Ends the signup phase of a trivia game and begins the game. Requires: + % @ * # & ~"],

	answer: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply("There is already a game of " + room.game.title + " in progress.");
		}

		let answer = toId(target);
		if (!answer) return this.errorReply("No valid answer was entered.");

		let res = room.game.answerQuestion(answer, user);
		if (typeof res === 'string') this.sendReply(res);
	},
	answerhelp: ["/trivia answer OR /ta [answer] - Answer a pending question."],

	end: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!this.can('broadcast', null, room)) return false;
		if (!this.canTalk()) return;
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply("There is already a game of " + room.game.title + " in progress.");
		}

		room.game.end(user);
	},
	endhelp: ["/trivia end - Forcibly end a trivia game. Requires: + % @ * # & ~"],

	'': 'status',
	players: 'status',
	status: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!this.runBroadcast()) return false;
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply("There is already a game of " + room.game.title + " in progress.");
		}

		let tarUser;
		if (target) {
			this.splitTarget(target);
			if (!this.targetUser) return this.errorReply("User " + target + " does not exist.");
			tarUser = this.targetUser;
		} else {
			tarUser = user;
		}

		let game = room.game;
		let buffer = 'There is a trivia game in progress, and it is in its ' + game.phase + ' phase.<br />' +
			'Mode: ' + game.mode + ' | Category: ' + game.category + ' | Score cap: ' + game.cap;

		let player = game.players[tarUser.userid];
		if (player) {
			if (!this.broadcasting) {
				buffer += '<br />Current score: ' + player.points + ' | Correct Answers: ' + player.correctAnswers;
			}
		} else if (tarUser.userid !== user.userid) {
			return this.errorReply("User " + tarUser.name + " is not a player in the current trivia game.");
		}

		buffer += '<br />Players: ' + Object.keys(game.players)
			.map(id => Chat.escapeHTML(game.players[id].name))
			.join(', ');

		this.sendReplyBox(buffer);
	},
	statushelp: ["/trivia status [player] - lists the player's standings (your own if no player is specified) and the list of players in the current trivia game."],

	submit: 'add',
	add: function (target, room, user, connection, cmd) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (cmd === 'add' && !this.can('mute', null, room) || !target) return false;
		if (!this.canTalk()) return;

		target = target.split('|');
		if (target.length !== 3) return this.errorReply("Invalid arguments specified. View /help trivia for more information.");

		let category = toId(target[0]);
		if (!CATEGORIES[category]) return this.errorReply("'" + target[0].trim() + "' is not a valid category. View /help trivia for more information.");

		let question = Chat.escapeHTML(target[1].trim());
		if (!question) return this.errorReply("'" + target[1] + "' is not a valid question.");
		if (question.length > MAX_QUESTION_LENGTH) {
			return this.errorReply("This question is too long! It must remain under " + MAX_QUESTION_LENGTH + " characters.");
		}
		if (triviaData.submissions.some(s => s.question === question) || triviaData.questions.some(q => q.question === question)) {
			return this.errorReply("Question \"" + question + "\" is already in the trivia database.");
		}

		let cache = new Set();
		let answers = target[2].split(',')
			.map(toId)
			.filter(answer => !cache.has(answer) && !!cache.add(answer));
		if (!answers.length) return this.errorReply("No valid answers were specified.");
		if (answers.some(answer => answer.length > MAX_ANSWER_LENGTH)) {
			return this.errorReply("Some of the answers entered were too long! They must remain under " + MAX_ANSWER_LENGTH + " characters.");
		}

		let submissions = triviaData.submissions;
		let submission = {
			category: category,
			question: question,
			answers: answers,
			user: user.userid,
		};

		if (cmd === 'add') {
			triviaData.questions.splice(findEndOfCategory(category, false), 0, submission);
			writeTriviaData();
			return this.privateModCommand("(Question '" + target[1] + "' was added to the question database by " + user.name + ".)");
		}

		submissions.splice(findEndOfCategory(category, true), 0, submission);
		writeTriviaData();
		if (!user.can('mute', null, room)) this.sendReply("Question '" + target[1] + "' was submitted for review.");
		this.privateModCommand("(" + user.name + " submitted question '" + target[1] + "' for review.)");
	},
	submithelp: ["/trivia submit [category] | [question] | [answer1], [answer2] ... [answern] - Add a question to the submission database for staff to review."],
	addhelp: ["/trivia add [category] | [question] | [answer1], [answer2], ... [answern] - Add a question to the question database. Requires: % @ * # & ~"],

	review: function (target, room) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('ban', null, room)) return false;

		let submissions = triviaData.submissions;
		let submissionsLen = submissions.length;
		if (!submissionsLen) return this.sendReply("No questions await review.");

		let buffer = "|raw|<div class=\"ladder\"><table>" +
			"<tr><td colspan=\"4\"><strong>" + submissionsLen + "</strong> questions await review:</td></tr>" +
			"<tr><th>#</th><th>Category</th><th>Question</th><th>Answer(s)</th><th>Submitted By</th></tr>";

		let i = 0;
		while (i < submissionsLen) {
			let entry = submissions[i];
			buffer += "<tr><td><strong>" + (++i) + "</strong></td><td>" + entry.category + "</td><td>" + entry.question + "</td><td>" + entry.answers.join(", ") + "</td><td>" + entry.user + "</td></tr>";
		}
		buffer += "</table></div>";

		this.sendReply(buffer);
	},
	reviewhelp: ["/trivia review - View the list of submitted questions. Requires: @ * # & ~"],

	reject: 'accept',
	accept: function (target, room, user, connection, cmd) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('ban', null, room)) return false;
		if (!this.canTalk()) return;

		target = target.trim();
		if (!target) return false;

		let isAccepting = cmd === 'accept';
		let questions = triviaData.questions;
		let submissions = triviaData.submissions;
		let submissionsLen = submissions.length;

		if (toId(target) === 'all') {
			if (isAccepting) {
				for (let i = 0; i < submissionsLen; i++) {
					let submission = submissions[i];
					questions.splice(findEndOfCategory(submission.category, false), 0, submission);
				}
			}

			triviaData.submissions = [];
			writeTriviaData();
			return this.privateModCommand("(" + user.name + (isAccepting ? " added " : " removed ") + "all questions from the submission database.)");
		}

		if (/^\d+(?:-\d+)?(?:, ?\d+(?:-\d+)?)*$/.test(target)) {
			let indices = target.split(',');

			// Parse number ranges and add them to the list of indices,
			// then remove them in addition to entries that aren't valid index numbers
			for (let i = indices.length; i--;) {
				if (!indices[i].includes('-')) {
					let index = Number(indices[i]);
					if (Number.isInteger(index) && index > 0 && index <= submissionsLen) {
						indices[i] = index;
					} else {
						indices.splice(i, 1);
					}
					continue;
				}

				let range = indices[i].split('-');
				let left = Number(range[0]);
				let right = Number(range[1]);
				if (!Number.isInteger(left) || !Number.isInteger(right) ||
						left < 1 || right > submissionsLen || left === right) {
					indices.splice(i, 1);
					continue;
				}

				do {
					indices.push(right);
				} while (--right >= left);

				indices.splice(i, 1);
			}

			indices.sort((a, b) => a - b);
			indices = indices.filter((entry, index) => !index || indices[index - 1] !== entry);

			let indicesLen = indices.length;
			if (!indicesLen) return this.errorReply("'" + target + "' is not a valid set of submission index numbers. View /trivia review and /help trivia for more information.");

			if (isAccepting) {
				for (let i = indicesLen; i--;) {
					let submission = submissions.splice(indices[i] - 1, 1)[0];
					questions.splice(findEndOfCategory(submission.category, false), 0, submission);
				}
			} else {
				for (let i = indicesLen; i--;) {
					submissions.splice(indices[i] - 1, 1);
				}
			}

			writeTriviaData();
			return this.privateModCommand("(" + user.name + " " + (isAccepting ? "added " : "removed ") + "submission number" + (indicesLen > 1 ? "s " : " ") + target + " from the submission database.)");
		}

		this.errorReply("'" + target + "' is an invalid argument. View /help trivia for more information.");
	},
	accepthelp: ["/trivia accept [index1], [index2], ... [indexn] OR all - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: @ * # & ~"],
	rejecthelp: ["/trivia reject [index1], [index2], ... [indexn] OR all - Remove questions from the submission database using their index numbers or ranges of them. Requires: @ * # & ~"],

	delete: function (target, room, user) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;

		target = target.trim();
		if (!target) return false;

		let question = Chat.escapeHTML(target);
		if (!question) return this.errorReply("'" + target + "' is not a valid argument. View /help trivia for more information.");

		let questions = triviaData.questions;
		for (let i = 0; i < questions.length; i++) {
			if (questions[i].question === question) {
				questions.splice(i, 1);
				writeTriviaData();
				return this.privateModCommand("(" + user.name + " removed question '" + target + "' from the question database.)");
			}
		}

		this.errorReply("Question '" + target + "' was not found in the question database.");
	},
	deletehelp: ["/trivia delete [question] - Delete a question from the trivia database. Requires: % @ * # & ~"],

	qs: function (target, room, user) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');

		let buffer = "|raw|<div class=\"ladder\"><table>";

		if (!target) {
			if (!this.runBroadcast()) return false;

			let questions = triviaData.questions;
			let questionsLen = questions.length;
			if (!questionsLen) return this.sendReplyBox("No questions have been submitted yet.");

			let categories = Object.keys(CATEGORIES);
			let lastCategoryIdx = 0;
			buffer += "<tr><th>Category</th><th>Question Count</th></tr>";
			for (let i = 0; i < categories.length; i++) {
				if (categories[i] === 'random') continue;
				let tally = findEndOfCategory(categories[i], false) - lastCategoryIdx;
				lastCategoryIdx += tally;
				buffer += "<tr><td>" + CATEGORIES[categories[i]] + "</td><td>" + tally + " (" + ((tally * 100) / questionsLen).toFixed(2) + "%)</td></tr>";
			}
			buffer += "<tr><td><strong>Total</strong></td><td><strong>" + questionsLen + "</strong></td></table></div>";

			return this.sendReply(buffer);
		}

		if (!this.can('mute', null, room)) return false;

		let category = toId(target);
		if (category === 'random') return false;
		if (!CATEGORIES[category]) return this.errorReply("'" + target + "' is not a valid category. View /help trivia for more information.");

		let list = sliceCategory(category);
		let listLen = list.length;
		if (!listLen) {
			buffer += "<tr><td>There are no questions in the " + CATEGORIES[target] + " category.</td></table></div>";
			return this.sendReply(buffer);
		}

		if (user.can('declare', null, room)) {
			buffer += "<tr><td colspan=\"3\">There are <strong>" + listLen + "</strong> questions in the " + CATEGORIES[target] + " category.</td></tr>" +
				"<tr><th>#</th><th>Question</th><th>Answer(s)</th></tr>";
			for (let i = 0; i < listLen; i++) {
				let entry = list[i];
				buffer += "<tr><td><strong>" + (i + 1) + "</strong></td><td>" + entry.question + "</td><td>" + entry.answers.join(", ") + "</td><tr>";
			}
		} else {
			buffer += "<td colspan=\"2\">There are <strong>" + listLen + "</strong> questions in the " + target + " category.</td></tr>" +
				"<tr><th>#</th><th>Question</th></tr>";
			for (let i = 0; i < listLen; i++) {
				buffer += "<tr><td><strong>" + (i + 1) + "</strong></td><td>" + list[i].question + "</td></tr>";
			}
		}
		buffer += "</table></div>";

		this.sendReply(buffer);
	},
	qshelp: [
		"/trivia qs - View the distribution of questions in the question database.",
		"/trivia qs [category] - View the questions in the specified category. Requires: % @ * # & ~",
	],

	search: function (target, room, user) {
		if (room.id !== 'questionworkshop') return this.errorReply("This command can only be used in Question Workshop.");
		if (!this.can('broadcast', null, room)) return false;
		if (!target.includes(',')) return this.errorReply("No valid search arguments entered.");

		let [type, ...query] = target.split(',');
		type = toId(type);
		if (/^q(?:uestion)?s?$/.test(type)) {
			type = 'questions';
		} else if (/^sub(?:mission)?s?$/.test(type)) {
			type = 'submissions';
		} else {
			return this.sendReplyBox("No valid search category was entered. Valid categories: submissions, subs, questions. qs");
		}

		query = query.join(',').trim();
		if (!query) return this.errorReply("No valid search query as entered.");

		let results = triviaData[type].filter(q => q.question.includes(query));
		if (!results.length) return this.sendReply(`No results found under the ${type} list.`);

		let buffer = "|raw|<div class=\"ladder\"><table><tr><th>#</th><th>Category</th><th>Question</th></tr>" +
			`<tr><td colspan="3">There are <strong>${results.length}</strong> matches for your query:</td></tr>`;
		buffer += results.map((q, i) => {
			return `<tr><td><strong>${i + 1}</strong></td><td>${q.category}</td><td>${q.question}</td></tr>`;
		}).join('');
		buffer += "</table></div>";

		this.sendReply(buffer);
	},
	searchhelp: ["/trivia search [type], [query] - Searches for questions based on their type and their query. Valid types: submissions, subs, questions, qs. Requires: + % @ # * & ~"],

	rank: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");

		let name;
		let userid;
		if (!target) {
			name = Chat.escapeHTML(user.name);
			userid = user.userid;
		} else {
			target = this.splitTarget(target, true);
			name = Chat.escapeHTML(this.targetUsername);
			userid = toId(name);
		}

		let score = triviaData.leaderboard[userid];
		if (!score) return this.sendReplyBox("User '" + name + "' has not played any trivia games yet.");

		this.sendReplyBox(
			"User: <strong>" + name + "</strong><br />" +
			"Leaderboard score: <strong>" + score[0] + "</strong> (#" + score[3] + ")<br />" +
			"Total game points: <strong>" + score[1] + "</strong> (#" + score[4] + ")<br />" +
			"Total correct answers: <strong>" + score[2] + "</strong> (#" + score[5] + ")"
		);
	},
	rankhelp: ["/trivia rank [username] - View the rank of the specified user. If none is given, view your own."],

	ladder: function (target, room) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');
		if (!this.runBroadcast()) return false;

		let ladder = triviaData.ladder;
		let leaderboard = triviaData.leaderboard;
		if (!ladder.length) return this.errorReply("No trivia games have been played yet.");

		let buffer = "|raw|<div class=\"ladder\"><table>" +
			"<tr><th>Rank</th><th>User</th><th>Leaderboard score</th><th>Total game points</th><th>Total correct answers</th></tr>";

		for (let i = 0; i < ladder.length; i++) {
			let leaders = ladder[i];
			for (let j = 0; j < leaders.length; j++) {
				let rank = leaderboard[leaders[j]];
				let leader = Users.getExact(leaders[j]);
				leader = leader ? Chat.escapeHTML(leader.name) : leaders[j];
				buffer += "<tr><td><strong>" + (i + 1) + "</strong></td><td>" + leader + "</td><td>" + rank[0] + "</td><td>" + rank[1] + "</td><td>" + rank[2] + "</td></tr>";
			}
		}
		buffer += "</table></div>";

		return this.sendReply(buffer);
	},
	ladderhelp: ["/trivia ladder - View information about the top 15 users on the trivia leaderboard."],
};

module.exports = {
	CATEGORIES,
	MODES,
	SCORE_CAPS,

	triviaData,
	writeTriviaData,

	Trivia,
	FirstModeTrivia,
	TimerModeTrivia,
	NumberModeTrivia,

	commands: {
		trivia: commands,
		ta: commands.answer,
		// TODO: this is ugly as all hell, split it into sections
		triviahelp: [
			"Modes:",
			"- First: the first correct responder gains 5 points.",
			"- Timer: each correct responder gains up to 5 points based on how quickly they answer.",
			"- Number: each correct responder gains up to 5 points based on how many participants are correct.",
			"Categories: Arts & Entertainment, Pok\u00e9mon, Science & Geography, Society & Humanities, Random, and All.",
			"Game lengths:",
			"- Short: 20 point score cap. The winner gains 3 leaderboard points.",
			"- Medium: 35 point score cap. The winner gains 4 leaderboard points.",
			"- Long: 50 point score cap. The winner gains 5 leaderboard points.",
			"Game commands:",
			"- /trivia new [mode], [category], [length] - Begin signups for a new trivia game. Requires: + % @ * # & ~",
			"- /trivia join - Join a trivia game during signups.",
			"- /trivia start - Begin the game once enough users have signed up. Requires: + % @ * # & ~",
			"- /ta [answer] - Answer the current question.",
			"- /trivia kick [username] - Disqualify a participant from the current trivia game. Requires: % @ * # & ~",
			"- /trivia leave - Makes the player leave the game.",
			"- /trivia end - End a trivia game. Requires: + % @ * # ~",
			"Question modifying commands:",
			"- /trivia submit [category] | [question] | [answer1], [answer2] ... [answern] - Add a question to the submission database for staff to review.",
			"- /trivia review - View the list of submitted questions. Requires: @ * # & ~",
			"- /trivia accept [index1], [index2], ... [indexn] OR all - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: @ * # & ~",
			"- /trivia reject [index1], [index2], ... [indexn] OR all - Remove questions from the submission database using their index numbers or ranges of them. Requires: @ * # & ~",
			"- /trivia add [category] | [question] | [answer1], [answer2], ... [answern] - Add a question to the question database. Requires: % @ * # & ~",
			"- /trivia delete [question] - Delete a question from the trivia database. Requires: % @ * # & ~",
			"- /trivia qs - View the distribution of questions in the question database.",
			"- /trivia qs [category] - View the questions in the specified category. Requires: % @ * # & ~",
			"Informational commands:",
			"- /trivia search [type], [query] - Searches for questions based on their type and their query. Valid types: submissions, subs, questions, qs. Requires: + % @ * # & ~",
			"- /trivia status [player] - lists the player's standings (your own if no player is specified) and the list of players in the current trivia game.",
			"- /trivia rank [username] - View the rank of the specified user. If none is given, view your own.",
			"- /trivia ladder - View information about the top 15 users on the trivia leaderboard.",
		],
	},
};
