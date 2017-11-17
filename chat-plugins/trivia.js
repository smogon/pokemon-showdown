/*
 * Trivia plugin
 * Written by Morfent
 */

'use strict';

const FS = require('../fs');

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
	wl: "Weakest Link",
	weakestlink: "Weakest Link",
};

const TYPES = {
	trivia: 'Trivia',
	weakestlink: 'Weakest Link',
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
const LIMBO_PHASE = 'limbo';

const MINIMUM_PLAYERS = 3;
const START_TIMEOUT = 30 * 1000;
const INTERMISSION_INTERVAL = 30 * 1000;

const MAX_QUESTION_LENGTH = 252;
const MAX_ANSWER_LENGTH = 32;

const BANK_AMOUNTS = [1000, 2500, 5000, 10000, 25000, 50000, 75000, 125000];
const NUM_FINALS_QUESTIONS = 5;

/**
 * @typedef {{question: string, category: string, answers: string[], user?: string, type?: string}} TriviaQuestion
 * @typedef {[number, number, number]} TriviaRank
 * @typedef {TriviaQuestion[]} TriviaQuestions
 * @typedef {{[k: string]: TriviaRank}} TriviaLeaderboard
 * @typedef {TriviaRank[][]} TriviaLadder
 * @typedef {{[k: string]: number}} TriviaUGM
 * @typedef {{questions?: TriviaQuestions, submissions?: TriviaQuestions, leaderboard?: TriviaLeaderboard, ladder?: TriviaLadder, ugm?: TriviaUGM, wlquestions?: TriviaQuestions, wlsubmissions?: TriviaQuestions}} TriviaData
 */

/**
 * TODO: move trivia database code to a separate file once relevant.
 * @type {TriviaData}
 */
let triviaData = {};
try {
	triviaData = require('../config/chat-plugins/triviadata.json');
} catch (e) {} // file doesn't exist or contains invalid JSON

if (!triviaData || typeof triviaData !== 'object') triviaData = {};
if (typeof triviaData.leaderboard !== 'object') triviaData.leaderboard = {};
if (!Array.isArray(triviaData.ladder)) triviaData.ladder = [];
if (!Array.isArray(triviaData.questions)) triviaData.questions = [];
if (!Array.isArray(triviaData.submissions)) triviaData.submissions = [];
if (triviaData.ugm) {
	CATEGORIES.ugm = 'Ultimate Gaming Month';
	if (typeof triviaData.ugm !== 'object') triviaData.ugm = {};
}
if (triviaData.questions.some(q => !('type' in q))) {
	triviaData.questions = triviaData.questions.map(q => Object.assign(Object.create(null), q, {type: 'trivia'}));
}
if (triviaData.wlquestions) delete triviaData.wlquestions;
if (triviaData.wlsubmissions) delete triviaData.wlsubmissions;

function writeTriviaData() {
	FS('config/chat-plugins/triviadata.json').writeUpdate(() => (
		JSON.stringify(triviaData, null, 2)
	));
}

/**
 * Binary search for the index at which to splice in new questions in a category,
 * or the index at which to slice up to for a category's questions
 * TODO: why isn't this a map? Storing questions/submissions sorted by
 * category is pretty stupid when maps exist for that purpose.
 * @param {string} category
 * @param {boolean?} isSubmissions
 * @return {number}
 */
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

/**
 * @param {string} category
 * @return {TriviaQuestion[]}
 */
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

		/** @type {number} */
		this.points = 0;
		/** @type {number} */
		this.correctAnswers = 0;

		/** @type {string} */
		this.answer = '';
		/** @type {number[]} */
		this.answeredAt = [];
		/** @type {boolean} */
		this.isCorrect = false;
		/** @type {boolean} */
		this.isAbsent = false;
	}

	/**
	 * @param {string} answer
	 * @param {boolean?} isCorrect
	 */
	setAnswer(answer, isCorrect) {
		this.answer = answer;
		this.answeredAt = process.hrtime();
		this.isCorrect = !!isCorrect;
	}

	/**
	 * @param {number?} [points = 0]
	 */
	incrementPoints(points = 0) {
		this.points += points;
		this.correctAnswers++;
	}

	clearAnswer() {
		this.answer = '';
		this.isCorrect = false;
	}

	toggleAbsence() {
		this.isAbsent = !this.isAbsent;
	}

	reset() {
		this.points = 0;
		this.correctAnswers = 0;
		this.answer = '';
		this.answeredAt = [];
		this.isCorrect = false;
	}
}

class Trivia extends Rooms.RoomGame {
	/**
	 * @param {ChatRoom} room
	 * @param {string} mode
	 * @param {string} category
	 * @param {number} length
	 * @param {TriviaQuestion[]} questions
	 */
	constructor(room, mode, category, length, questions) {
		super(room);
		this.gameid = 'trivia';
		this.title = 'Trivia';
		this.allowRenames = true;
		this.playerCap = Number.MAX_SAFE_INTEGER;

		/** @type {number} */
		this.minPlayers = MINIMUM_PLAYERS;
		/** @type {Set<string>} */
		this.kickedUsers = new Set();
		/** @type {boolean} */
		this.canLateJoin = true;
		/** @type {string} */
		this.mode = MODES[mode];
		/** @type {number} */
		this.cap = SCORE_CAPS[length];
		/** @type {string} */
		this.category = '';
		if (category === 'all') {
			this.category = 'All';
		} else if (category === 'random') {
			this.category = `Random (${CATEGORIES[questions[0].category]})`;
		} else {
			this.category = CATEGORIES[category];
		}
		/** @type {TriviaQuestions} */
		this.questions = questions;

		/** @type {string} */
		this.phase = SIGNUP_PHASE;
		/** @type {Timer?} */
		this.phaseTimeout = null;

		/** @type {TriviaQuestions} */
		this.questions = questions;
		/** @type {string} */
		this.curQuestion = '';
		/** @type {string[]} */
		this.curAnswers = [];
		/** @type {number[]} */
		this.askedAt = [];

		this.init();
	}

	/**
	 * How long the players should have to answer a question.
	 * @return {number}
	 */
	getRoundLength() {
		return 12 * 1000 + 500;
	}

	/**
	 * @param {User} user
	 * @return {string | undefined}
	 */
	addPlayer(user) {
		if (this.players[user.userid]) return 'You have already signed up for this game.';
		for (let id in user.prevNames) {
			if (this.players[id]) return 'You have already signed up for this game.';
		}
		if (this.kickedUsers.has(user.userid)) {
			return 'You were kicked from the game and thus cannot join it again.';
		}
		for (let id in user.prevNames) {
			if (this.players[id]) return 'You have already signed up for this game.';
			if (this.kickedUsers.has(id)) return 'You were kicked from the game and cannot join until the next game.';
		}

		for (let id in this.players) {
			let tarUser = Users.get(id);
			if (tarUser) {
				if (tarUser.prevNames[user.userid]) return 'You have already signed up for this game.';

				let tarPrevNames = Object.keys(tarUser.prevNames);
				let prevNameMatch = tarPrevNames.some(tarId => (tarId in user.prevNames));
				if (prevNameMatch) return 'You have already signed up for this game.';

				let tarIps = Object.keys(tarUser.ips);
				let ipMatch = tarIps.some(ip => (ip in user.ips));
				if (ipMatch) return 'You have already signed up for this game.';
			}
		}
		if (this.phase !== SIGNUP_PHASE && !this.canLateJoin) return "This game does not allow latejoins.";
		let player = this.makePlayer(user);
		this.players[user.userid] = player;
		this.playerCount++;
	}

	/**
	 * @param {User} user
	 * @return {TriviaPlayer}
	 */
	makePlayer(user) {
		return new TriviaPlayer(user, this);
	}

	destroy() {
		this.kickedUsers.clear();
		super.destroy();
	}

	/**
	 * @param {User} user
	 * @return {boolean}
	 */
	onConnect(user) {
		let player = this.players[user.userid];
		if (!player || !player.isAbsent) return false;

		player.toggleAbsence();
		if (++this.playerCount < MINIMUM_PLAYERS) return false;
		if (this.phase !== LIMBO_PHASE) return false;

		// At least let the game start first!!
		if (this.phase === SIGNUP_PHASE) return false;

		for (let i in this.players) {
			this.players[i].clearAnswer();
		}

		this.broadcast(
			'Enough players have returned to continue the game!',
			'The game will continue with the next question.'
		);
		this.askQuestion();
		return true;
	}

	/**
	 * @param {User} user
	 * @return {boolean}
	 */
	onLeave(user) {
		// The user cannot participate, but their score should be kept
		// regardless in cases of disconnects.
		let player = this.players[user.userid];
		if (!player || player.isAbsent) return false;

		player.toggleAbsence();
		if (--this.playerCount >= MINIMUM_PLAYERS) return false;

		// At least let the game start first!!
		if (this.phase === SIGNUP_PHASE) return false;

		clearTimeout(this.phaseTimeout);
		this.phaseTimeout = null;
		this.phase = LIMBO_PHASE;
		this.broadcast(
			'Not enough players are participating to continue the game!',
			`Until there are ${MINIMUM_PLAYERS} players participating and present, the game will be paused.`
		);
		return true;
	}

	/**
	 * Handles setup that shouldn't be done from the constructor.
	 */
	init() {
		this.broadcast(
			'Signups for a new trivia game have begun!',
			`Mode: ${this.mode} | Category: ${this.category} | Score cap: ${this.cap}<br />` +
			'Enter /trivia join to sign up for the trivia game.'
		);
	}

	/**
	 * Generates and broadcasts the HTML for a generic announcement containing
	 * a title and an optional message.
	 * @param {string} title
	 * @param {string?} message
	 * @return {ChatRoom}
	 */
	broadcast(title, message) {
		let buffer = `<div class="broadcast-blue"><strong>${title}</strong>`;
		if (message) buffer += `<br />${message}`;
		buffer += '</div>';

		// This shouldn't happen, but sometimes this will fire after
		// Trivia#destroy has already set the instance's room to null.
		let tarRoom = this.room;
		if (!tarRoom) {
			for (let [roomid, room] of Rooms.rooms) { // eslint-disable-line no-unused-vars
				if (room.game === this)	{
					return room.addRaw(buffer).update();
				}
			}

			Monitor.debug(
				`${this.title} is FUBAR! Game instance tried to broadcast after having destroyed itself\n
				Mode: ${this.mode}\n
				Category: ${this.category}\n
				Length: ${SCORE_CAPS[this.cap]}\n
				UGM: ${triviaData.ugm ? 'enabled' : 'disabled'}`
			);

			return tarRoom;
		}

		return tarRoom.addRaw(buffer).update();
	}

	/**
	 * @return {string}
	 */
	getDescription() {
		return `Mode: ${this.mode} | Category: ${this.category} | Score cap: ${this.cap}`;
	}

	/**
	 * Formats the player list for display when using /trivia players.
	 * @param {number?} count
	 * @return {string}
	 */
	formatPlayerList(count) {
		let playerCount = Object.keys(this.players).length;
		let from = (!isNaN(count) && count >= 0 && count < playerCount) ? (playerCount - count) : 0;
		return Object.values(this.players)
			.sort((p1, p2) => p2.points - p1.points)
			.slice(from)
			.map(player => {
				const buf = Chat.html`${player.name} (${player.points})`;
				return player.isAbsent ? `<span style="color: #444444">${buf}</span>` : buf;
			})
			.join(', ');
	}

	/**
	 * Kicks a player from the game, preventing them from joining it again
	 * until the next game begins.
	 * @param {User} tarUser
	 * @param {User} user
	 * @return {string}
	 */
	kick(tarUser, user) {
		if (!this.players[tarUser.userid]) {
			if (this.kickedUsers.has(tarUser.userid)) return `User ${tarUser.name} has already been kicked from the game.`;

			for (let id in tarUser.prevNames) {
				if (this.kickedUsers.has(id)) return `User ${tarUser.name} has already been kicked from the game.`;
			}

			for (let kickedUserid of this.kickedUsers) {
				let kickedUser = Users.get(kickedUserid);
				if (kickedUser) {
					if (kickedUser.prevNames[tarUser.userid]) {
						return `User ${tarUser.name} has already been kicked from the game.`;
					}

					let prevNames = Object.keys(kickedUser.prevNames);
					let nameMatch = prevNames.some(id => tarUser.prevNames[id]);
					if (nameMatch) return `User ${tarUser.name} has already been kicked from the game.`;

					let ips = Object.keys(kickedUser.ips);
					let ipMatch = ips.some(ip => tarUser.ips[ip]);
					if (ipMatch) return `User ${tarUser.name} has already been kicked from the game.`;
				}
			}

			return `User ${tarUser.name} is not a player in the game.`;
		}

		this.kickedUsers.add(tarUser.userid);
		for (let id in tarUser.prevNames) {
			this.kickedUsers.add(id);
		}

		super.removePlayer(tarUser);
	}

	/**
	 * @param {User} user
	 * @return {string | undefined}
	 */
	leave(user) {
		if (!this.players[user.userid]) {
			return 'You are not a player in the current game.';
		}
		super.removePlayer(user);
	}

	/**
	 * Starts the question loop for a trivia game in its signup phase.
	 * @return {string | undefined}
	 */
	start() {
		if (this.phase !== SIGNUP_PHASE) return 'The game has already been started.';
		if (this.playerCount < this.minPlayers) {
			return `Not enough players have signed up yet! At least ${this.minPlayers} players to begin.`;
		}

		this.broadcast(`The game will begin in ${START_TIMEOUT / 1000} seconds...`);
		this.phaseTimeout = setTimeout(() => this.askQuestion(), START_TIMEOUT);
	}

	/**
	 * Broadcasts the next question on the questions list to the room and sets
	 * a timeout to tally the answers received.
	 */
	askQuestion() {
		if (!this.questions.length) {
			clearTimeout(this.phaseTimeout);
			this.phaseTimeout = null;
			this.broadcast(
				'No questions are left!',
				'The game has reached a stalemate'
			);
			return this.destroy();
		}

		this.phase = QUESTION_PHASE;
		this.askedAt = process.hrtime();

		let question = this.questions.pop();
		this.curQuestion = question.question;
		this.curAnswers = question.answers;
		this.sendQuestion(question);

		this.phaseTimeout = setTimeout(() => this.tallyAnswers(), this.getRoundLength());
	}

	/**
	 * Broadcasts to the room what the next question is.
	 * @param {TriviaQuestion} question
	 */
	sendQuestion(question) {
		this.broadcast(
			`Question: ${question.question}`,
			`Category: ${CATEGORIES[question.category]}`
		);
	}

	/**
	 * This is a noop here since it'd defined properly by subclasses later on.
	 * All this is obligated to do is take a user and their answer as args;
	 * the behaviour of this method can be entirely arbitrary otherwise.
	 */
	answerQuestion() {}

	/**
	 * Verifies whether or not an answer is correct. In longer answers, small
	 * typos can be made and still have the answer be considered correct.
	 * @param {string} tarAnswer
	 * @return {boolean}
	 */
	verifyAnswer(tarAnswer) {
		return this.curAnswers.some(answer => (
			(answer === tarAnswer) || (answer.length > 5 && Dex.levenshtein(tarAnswer, answer) < 3)
		));
	}

	/**
	 * This is a noop here since it'd defined properly by mode subclasses later
	 * on. This calculates the points a correct responder earns, which is
	 * typically between 1-5.
	 */
	calculatePoints() {}

	/**
	 * This is a noop here since it's defined properly by mode subclasses later
	 * on. This is obligated to update the game phase, but it can be entirely
	 * arbitrary otherwise.
	 */
	tallyAnswers() {}

	/**
	 * Ends the game after a player's score has exceeded the score cap.
	 * FIXME: this class and trivia database logic don't belong in bed with
	 * each other! Abstract all that away from this method as soon as possible.
	 * @param {TriviaPlayer} winner
	 * @param {string} buffer
	 */
	win(winner, buffer) {
		clearTimeout(this.phaseTimeout);
		this.phaseTimeout = null;
		let prize = (this.cap - 5) / 15 + 2;
		buffer += Chat.html`${winner.name} won the game with a final score of <strong>${winner.points}</strong>, ` +
			`and their leaderboard score has increased by <strong>${prize}</strong> points!`;
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

			if (triviaData.ugm && this.category === 'Ultimate Gaming Month') {
				let ugmPoints = player.points / 5 | 0;
				if (winner && winner.userid === i) ugmPoints *= 2;
				triviaData.ugm[i] += ugmPoints;
			}
		}

		if (winner) leaderboard[winner.userid][0] += prize;

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
				`You gained ${player.points} and answered ` +
				`${player.correctAnswers} questions correctly.`
			);
		}

		let buf = `(User ${winner.name} won the game of ${this.mode}` +
			` mode trivia under the ${this.category} category with a cap of ` +
			`${this.cap} points, with ${winner.points} points and ` +
			`${winner.correctAnswers} correct answers!)`;
		this.room.sendModCommand(buf);
		this.room.logEntry(buf);
		this.room.modlog(buf);

		writeTriviaData();
		this.destroy();
	}

	/**
	 * @param {User} user
	 */
	end(user) {
		clearTimeout(this.phaseTimeout);
		this.phaseTimeout = null;
		this.broadcast(Chat.html`The game was forcibly ended by ${user.name}.`);
		this.destroy();
	}
}

/**
 * Helper function for timer and number modes. Milliseconds are not precise
 * enough to score players properly in rare cases.
 * @param {[number, number]} hrtime
 * @return {number}
 */
const hrtimeToNanoseconds = hrtime => hrtime[0] * 1e9 + hrtime[1];

/**
 * First mode rewards points to the first user to answer the question
 * correctly.
 */
class FirstModeTrivia extends Trivia {
	/**
	 * @param {string} answer
	 * @param {User} user
	 * @return {string | undefined}
	 */
	answerQuestion(answer, user) {
		let player = this.players[user.userid];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';
		if (player.answer) return 'You have already attempted to answer the current question.';
		if (!this.verifyAnswer(answer)) return;

		clearTimeout(this.phaseTimeout);
		this.phase = INTERMISSION_PHASE;

		let points = this.calculatePoints();
		player.setAnswer(answer);
		player.incrementPoints(points);

		let buffer = Chat.html`Correct: ${user.name}<br />` +
			`Answer(s): ${this.curAnswers.join(', ')}<br />` +
			'They gained <strong>5</strong> points!<br />' +
			`The top 5 players are: ${this.formatPlayerList(5)}`;
		if (player.points >= this.cap) {
			this.win(player, buffer);
			return;
		}

		for (let i in this.players) {
			this.players[i].clearAnswer();
		}

		this.broadcast('The answering period has ended!', buffer);
		this.phaseTimeout = setTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}

	/**
	 * @return {number}
	 */
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
			`Answers: ${this.curAnswers.join(', ')}<br />` +
			'Nobody gained any points.<br />' +
			`The top 5 players are: ${this.formatPlayerList(5)}`
		);

		this.phaseTimeout = setTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

/**
 * Timer mode rewards up to 5 points to all players who answer correctly
 * depending on how quickly they answer the question.
 */
class TimerModeTrivia extends Trivia {
	/**
	 * @param {string} answer
	 * @param {User} user
	 * @return {string | undefined}
	 */
	answerQuestion(answer, user) {
		let player = this.players[user.userid];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';

		let isCorrect = this.verifyAnswer(answer);
		player.setAnswer(answer, isCorrect);
	}

	/**
	 * @param {number} diff
	 * The difference between the time the player answered the question and
	 * when the question was asked, in nanoseconds.
	 * @param {number} totalDiff
	 * The difference between the time scoring began and the time the question
	 * was asked, in nanoseconds.
	 * @return {number}
	 */
	calculatePoints(diff, totalDiff) {
		return 6 - 5 * diff / totalDiff | 0;
	}

	tallyAnswers() {
		this.phase = INTERMISSION_PHASE;

		let buffer = (
			`Answer(s): ${this.curAnswers.join(', ')}<br />` +
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
					`<td style="text-align: center">${pointValue}</td>` +
					`<td>${players.join(', ')}</td>` +
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

		buffer += '</table><br />' +
			`The top 5 players are: ${this.formatPlayerList(5)}`;
		this.broadcast('The answering period has ended!', buffer);
		this.phaseTimeout = setTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

/**
 * Number mode rewards up to 5 points to all players who answer correctly
 * depending on the ratio of correct players to total players (lower ratio is
 * better).
 */
class NumberModeTrivia extends Trivia {
	/**
	 * @param {string} answer
	 * @param {User} user
	 * @return {string | undefined}
	 */
	answerQuestion(answer, user) {
		let player = this.players[user.userid];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';

		let isCorrect = this.verifyAnswer(answer);
		player.setAnswer(answer, isCorrect);
	}

	/**
	 * @param {number} correctPlayers
	 * @return {number}
	 */
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

			buffer = `Correct: ${innerBuffer.map(arr => arr[0]).join(', ')}<br />` +
				`Answer(s): ${this.curAnswers.join(', ')}<br />`;

			if (winner) return this.win(winner, buffer);

			buffer += `${(innerBuffer.length > 1 ? 'Each of them' : 'They')} gained <strong>${points}</strong> point(s)!`;
		} else {
			for (let i in this.players) {
				let player = this.players[i];
				player.clearAnswer();
			}

			buffer = 'Correct: no one...<br />' +
				`Answer(s): ${this.curAnswers.join(', ')}<br />` +
				'Nobody gained any points.';
		}

		buffer += `<br />The top 5 players are: ${this.formatPlayerList(5)}.`;
		this.broadcast('The answering period has ended!', buffer);
		this.phaseTimeout = setTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

/**
 * This is based on the format of the Weakest Link game show.
 */
class WeakestLink extends Trivia {
	init() {
		this.bank = 0;
		this.bankindex = 0;
		this.title = "Weakest Link";
		this.playerindex = 0;
		this.broadcast(
			'Signups for a new Weakest Link game have begun!',
			`Category: ${this.category}<br />` +
			'Enter /trivia join to sign up for the game.'
		);
		this.minPlayers = 1;
		this.canLateJoin = false;
	}

	start() {
		super.start();
		this.curPlayer = this.players[Object.keys(this.players)[0]];
	}

	sendQuestion(question) {
		if (!this.roundstarted && !this.finals) {
			this.roundstarted = true;
			this.roundTimeout = setTimeout(() => this.askVotes(), 5 * 1 * 1000);
		}
		this.broadcast(
			`Question: ${question.question}`,
			Chat.html`Player: ${this.curPlayer.name}`
		);
	}

	onBank(user) {
		let player = this.players[user.userid];
		if (!player) return 'You are not a participant in the current game';
		if (this.phase !== 'banking') return 'You cannot bank at this time.';
		if (this.curPlayer.userid !== player.userid) return 'It is not your turn to bank.';
		if (this.bankindex === 0) return 'There is no money to bank at this time.';
		this.bankindex = 0;
		this.bank += this.amountToBank;
		player.points += this.amountToBank;
		this.amountToBank = 0;
		this.broadcast(`${player.name} has banked`);
	}

	answerQuestion(answer, user) {
		let player = this.players[user.userid];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';
		clearTimeout(this.phaseTimeout);
		if (player !== this.curPlayer) return 'It is not your turn to answer';
		let isCorrect = this.verifyAnswer(answer);
		if (isCorrect) {
			this.curPlayer.incrementPoints();
			if (this.bankindex === (BANK_AMOUNTS.length - 1)) {
				this.bank += BANK_AMOUNTS[this.bankindex];
				this.amountToBank = 0;
				this.bankindex = 0;
			} else if (!this.finals) {
				this.amountToBank = BANK_AMOUNTS[this.bankindex];
				this.bankindex++;
			}
		} else {
			this.amountToBank = 0;
			this.bankindex = 0;
		}
		this.broadcast(
			`${this.curPlayer.name} ${answer.length === 0 ? "did not answer" : "answered " + ((isCorrect ? "correctly" : "incorrectly") + " with " + answer)}`
		);
		this.playerindex++;
		if (this.playerindex === Object.keys(this.players).length) {
			this.playerindex = 0;
			if (this.finals) {
				this.numFinals++;
				if (this.numFinals >= NUM_FINALS_QUESTIONS) {
					let oplayer;
					for (let userID in this.players) {
						let player = this.players[userID];
						if (player !== this.curPlayer) {
							oplayer = player;
							break;
						}
					}
					if (oplayer.correctAnswers !== this.curPlayer.correctAnswers) {
						let winplayer, loseplayer;
						if (oplayer.correctAnswers > this.curPlayer.correctAnswers) {
							winplayer = oplayer;
							loseplayer = this.curPlayer;
						} else {
							winplayer = this.curPlayer;
							loseplayer = oplayer;
						}
						this.broadcast(`Congratulations to ${winplayer.name} for winning the game of the Weakest Link with a final score of ${winplayer.correctAnswers}-${loseplayer.correctAnswers}`);
						return this.destroy();
					}
				}
			}
		}
		this.curPlayer = this.players[Object.keys(this.players)[this.playerindex]];
		this.phase = 'banking';
		this.broadcast(
			`Players: ${Object.keys(this.players).map(p => (this.curPlayer.userid === p ? "<em>" + this.players[p].name + "</em>" : this.players[p].name) + (this.finals ? "(" + this.players[p].correctAnswers + ")" : "")).join(", ")}`,
			`Bank: ${this.bank}<br />Amount to bank: ${this.amountToBank}`
		);
		this.phaseTimeout = setTimeout(() => this.askQuestion(), 5 * 1000);
	}

	tallyAnswers() {
		return this.answerQuestion("", this.curPlayer);
	}

	askVotes() {
		clearTimeout(this.phaseTimeout);
		this.phase = "voting";
		this.broadcast(
			`Players: ${Object.keys(this.players).map(p => this.players[p].name).join(", ")}`,
			`Bank: ${this.bank}<br />Vote for who you would like to eliminate with /trivia vote [user]`
		);
	}

	vote(target, user) {
		let player = this.players[user.userid];
		if (!player) return 'You are not a participant in the current game.';
		if (this.phase !== "voting") return "You cannot vote at this time.";
		let targPlayer = this.players[toId(target)];
		if (!targPlayer) return `No player named '${target}' is currently in the game.`;
		if (targPlayer.userid === player.userid) return "You cannot vote to eliminate yourself.";
		player.vote = targPlayer;
		if (this.checkVotes()) {
			this.phaseTimeout = setTimeout(() => this.tallyVotes(), 5 * 1000);
		}
		return `You have voted for ${targPlayer.name} to be eliminated.`;
	}

	tallyVotes() {
		let votes = {};
		for (let userID in this.players) {
			let id = this.players[userID].vote.userid;
			if (!(id in votes)) votes[id] = 0;
			votes[id]++;
		}
		let maxNum = 0;
		let maxVotes = [];
		for (let userID in this.players) {
			let curPlayer = this.players[userID];
			let numVotes = votes[userID] || 0;
			if (numVotes > maxNum) {
				maxNum = numVotes;
				maxVotes = [curPlayer];
			} else if (numVotes === maxNum) {
				maxVotes.push(curPlayer);
			}
		}
		if (maxVotes.length === 1) {
			this.broadcast(`The votes are in, and ${maxVotes[0].name} is eliminated!`);
			super.removePlayer(maxVotes[0]);
			this.startRound();
		} else {
			this.curPlayer = this.strongestPlayer();
			this.broadcast(`The votes are in, and the result is a tie between ${maxVotes.map(pl => pl.name).join(", ")}. ${this.curPlayer.name} as the strongest player, who would you like to eliminate?`);
			this.phase = 'deciding';
			this.potentialElims = maxVotes;
		}
	}

	startRound() {
		this.phase = INTERMISSION_PHASE;
		if (Object.keys(this.players).length === 2) {
			this.finals = true;
			this.numFinals = 0;
		}
		this.roundstarted = false;
		if (this.finals) {
			this.curPlayer = this.players[Object.keys(this.players)[0]];
		} else {
			this.curPlayer = this.strongestPlayer();
		}
		for (let userID in this.players) {
			let player = this.players[userID];
			player.points = 0;
			player.correctAnswers = 0;
		}
		this.playerindex = Object.keys(this.players).indexOf(this.curPlayer.userid);
		this.broadcast(
			`Players: ${Object.keys(this.players).map(p => this.players[p].name).join(", ")}`,
			`Bank: ${this.bank}<br />The ${this.finals ? "next" : "final"} round will begin in 30 seconds, and it will be ${this.curPlayer.name}'s turn to answer.`
		);
		this.timeout = setTimeout(() => this.askQuestion(), 30 * 1000);
	}

	sendToRoom(msg) {
		this.room.add(msg).update();
	}

	strongestPlayer() {
		let maxAnswers = 0;
		let maxPlayer = [];
		for (let userID in this.players) {
			let player = this.players[userID];
			if (player.correctAnswers > maxAnswers) {
				maxPlayer = [player];
				maxAnswers = player.correctAnswers;
			} else if (player.correctAnswers === maxAnswers) {
				maxPlayer.push(player);
			}
		}
		if (maxPlayer.length > 1) {
			let mostBanked = 0;
			let bankPlayers = [];
			for (let i = 0, len = maxPlayer.length; i < len; i++) {
				let player = maxPlayer[i];
				if (player.points > mostBanked) {
					mostBanked = player.points;
					bankPlayers = [player];
				} else if (player.points === mostBanked) {
					bankPlayers.push(player);
				}
			}
			bankPlayers = Dex.shuffle(bankPlayers);
			return bankPlayers[0];
		} else {
			return maxPlayer[0];
		}
	}

	checkVotes() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.vote) return false;
		}
		return true;
	}

	decide(target, user) {
		let player = this.players[user.userid];
		if (!player) return 'You are not participating in the current game.';
		if (this.phase !== 'deciding') return 'You cannot decide who to eliminate at this time.';
		if (this.curPlayer !== player) return 'It is not your turn to decide who to eliminate';
		let targPlayer = this.players[toId(target)];
		if (!targPlayer) return 'That player is not in the game.';
		if (this.potentialElims.indexOf(targPlayer) === -1) return 'That player cannot be eliminated.';
		this.sendToRoom(`${this.curPlayer.name} has decided to eliminate ${targPlayer.name}!`);
		super.removePlayer(targPlayer);
		this.startRound();
	}

	getRoundLength() {
		return this.finals ? 7 * 1000 : 5 * 60 * 1000;
	}
}

const commands = {
	new: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in the Trivia room.");
		if (!this.can('broadcast', null, room) || !target) return false;
		if (!this.canTalk()) return;
		if (room.game) {
			return this.errorReply(`There is already a game of ${room.game.title} in progress.`);
		}

		let tars = target.split(',');
		if (tars.length < 2) return this.errorReply("Invalid arguments specified.");

		let mode = toId(tars[0]);
		if (!MODES[mode]) return this.errorReply(`"${mode}" is an invalid mode.`);

		let category = toId(tars[1]);
		let isRandom = (category === 'random');
		let isAll = (category === 'all');
		let questions;
		if (isRandom) {
			let categories = Object.keys(CATEGORIES);
			let randCategory = categories[Math.random() * categories.length | 0];
			if (triviaData.ugm && randCategory === 'ugm') {
				categories.splice(categories.indexOf('ugm'), 1);
				randCategory = categories[Math.random() * categories.length | 0];
			}
			questions = sliceCategory(randCategory);
		} else if (isAll) {
			questions = triviaData.questions.slice();
			if (triviaData.ugm) questions = questions.filter(q => q.category !== 'ugm');
		} else if (CATEGORIES[category]) {
			questions = sliceCategory(category);
		} else {
			return this.errorReply(`"${category}" is an invalid category.`);
		}

		// Randomizes the order of the questions.
		let length;
		if (MODES[mode] === 'Weakest Link') {
			questions = questions.filter(q => q.type === 'weakestlink');
		} else {
			length = toId(tars[2]);
			if (!SCORE_CAPS[length]) return this.errorReply(`"${length}" is an invalid game length.`);

			questions = questions.filter(q => q.type === 'trivia');
			if (questions.length < SCORE_CAPS[length] / 5) {
				if (isRandom) return this.errorReply("There are not enough questions in the randomly chosen category to finish a trivia game.");
				if (isAll) return this.errorReply("There are not enough questions in the trivia database to finish a trivia game.");
				return this.errorReply(`There are not enough questions under the category "${CATEGORIES[category]}" to finish a trivia game.`);
			}
		}

		let _Trivia;
		if (mode === 'first') {
			_Trivia = FirstModeTrivia;
		} else if (mode === 'timer') {
			_Trivia = TimerModeTrivia;
		} else if (mode === 'number') {
			_Trivia = NumberModeTrivia;
		} else {
			_Trivia = WeakestLink;
		}

		questions = Dex.shuffle(questions);
		room.game = new _Trivia(room, mode, category, length, questions);
	},
	newhelp: ["/trivia new [mode], [category], [length] - Begin a new trivia game. Requires: + % @ # & ~"],

	join: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply(`There is already a game of ${room.game.title} in progress.`);
		}
		let res = room.game.addPlayer(user);
		if (res) return this.errorReply(res);
		this.sendReply('You are now signed up for this game!');
	},
	joinhelp: ["/trivia join - Join the current trivia game."],

	kick: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply(`There is already a game of ${room.game.title} in progress.`);
		}

		this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser) return this.errorReply(`The user "${target}" does not exist.`);

		let res = room.game.kick(targetUser, user);
		if (res) return this.errorReply(res);
		// ...
	},
	kickhelp: ["/trivia kick [username] - Kick players from a trivia game by username. Requires: % @ # & ~"],

	leave: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply(`There is already a game of ${room.game.title} in progress.`);
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
			return this.errorReply(`There is already a game of ${room.game.title} in progress.`);
		}

		let res = room.game.start();
		if (res) return this.errorReply(res);
		// ...
	},
	starthelp: ["/trivia start - Ends the signup phase of a trivia game and begins the game. Requires: + % @ # & ~"],

	answer: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply(`There is already a game of ${room.game.title} in progress.`);
		}

		let answer = toId(target);
		if (!answer) return this.errorReply("No valid answer was entered.");

		let res = room.game.answerQuestion(answer, user);
		if (res) return this.errorReply(res);
		this.sendReply(`You have selected "${answer}" as your answer.`);
	},
	answerhelp: ["/trivia answer OR /ta [answer] - Answer a pending question."],

	end: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!this.can('broadcast', null, room)) return false;
		if (!this.canTalk()) return;
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia' && room.game.gameid !== 'weakestlink') {
			return this.errorReply(`There is already a game of ${room.game.title} in progress.`);
		}

		room.game.end(user);
	},
	endhelp: ["/trivia end - Forcibly end a trivia game. Requires: + % @ # & ~"],

	'': 'status',
	players: 'status',
	status: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!this.runBroadcast()) return false;
		if (!room.game) return this.errorReply("There is no game of trivia in progress.");
		if (room.game.gameid !== 'trivia') {
			return this.errorReply(`There is already a game of ${room.game.title} in progress.`);
		}

		let tarUser;
		if (target) {
			this.splitTarget(target);
			if (!this.targetUser) return this.errorReply(`User ${target} does not exist.`);
			tarUser = this.targetUser;
		} else {
			tarUser = user;
		}

		let game = room.game;
		let buffer = `There is a trivia game in progress, and it is in its ${game.phase} phase.<br />` +
			`Mode: ${game.mode} | Category: ${game.category} | Score cap: ${game.cap}`;

		let player = game.players[tarUser.userid];
		if (player) {
			if (!this.broadcasting) {
				buffer += `<br />Current score: ${player.points} | Correct Answers: ${player.correctAnswers}`;
			}
		} else if (tarUser.userid !== user.userid) {
			return this.errorReply(`User ${tarUser.name} is not a player in the current trivia game.`);
		}

		buffer += `<br />Players: ${room.game.formatPlayerList()}`;

		this.sendReplyBox(buffer);
	},
	statushelp: ["/trivia status [player] - lists the player's standings (your own if no player is specified) and the list of players in the current trivia game."],

	submit: 'add',
	add: function (target, room, user, connection, cmd) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if ((cmd === 'add' && !this.can('mute', null, room)) ||
			(cmd === 'submit' && !this.can('broadcast', null, room)) ||
			!target) return false;
		if (!this.canTalk()) return false;
		target = target.split('|');
		if (target.length !== 3) return this.errorReply("Invalid arguments specified. View /trivia help for more information.");

		let category = toId(target[0]);
		if (!CATEGORIES[category]) return this.errorReply(`'${target[0].trim()}' is not a valid category. View /trivia help for more information.`);
		if (this.message.startsWith("/wlink") && category === 'pokemon') return this.errorReply("Pokemon questions are not allowed for the Weakest Link");
		let question = Chat.escapeHTML(target[1].trim());
		if (!question) return this.errorReply(`'${target[1]}' is not a valid question.`);
		if (question.length > MAX_QUESTION_LENGTH) {
			return this.errorReply(`This question is too long! It must remain under ${MAX_QUESTION_LENGTH} characters.`);
		}
		if (triviaData.submissions.some(s => s.question === question) || triviaData.questions.some(q => q.question === question)) {
			return this.errorReply(`Question "${question}" is already in the trivia database.`);
		}

		let cache = new Set();
		let answers = target[2].split(',')
			.map(toId)
			.filter(answer => !cache.has(answer) && !!cache.add(answer));
		if (!answers.length) return this.errorReply("No valid answers were specified.");
		if (answers.some(answer => answer.length > MAX_ANSWER_LENGTH)) {
			return this.errorReply(`Some of the answers entered were too long! They must remain under ${MAX_ANSWER_LENGTH} characters.`);
		}
		let isWL = this.message.startsWith("/wlink");
		let submissions = triviaData.submissions;
		let submission = {
			category: category,
			question: question,
			answers: answers,
			user: user.userid,
			type: isWL ? "weakestlink" : "trivia",
		};

		if (cmd === 'add') {
			triviaData.questions.splice(findEndOfCategory(category, false), 0, submission);
			writeTriviaData();
			return this.privateModCommand(`(Question '${target[1]}' was added to the ${isWL ? "Weakest Link" : "Trivia"} question database by ${user.name}.)`);
		}

		submissions.splice(findEndOfCategory(category, true), 0, submission);
		writeTriviaData();
		if (!user.can('mute', null, room)) this.sendReply(`Question '${target[1]}' was submitted for review.`);
		this.privateModCommand(`(${user.name} submitted question '${target[1]}' for review.)`);
	},
	submithelp: ["/trivia submit [category] | [question] | [answer1], [answer2] ... [answern] - Add a question to the submission database for staff to review. Requires: + % @ # & ~"],
	addhelp: ["/trivia add [category] | [question] | [answer1], [answer2], ... [answern] - Add a question to the question database. Requires: % @ # & ~"],

	review: function (target, room) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('ban', null, room)) return false;

		let submissions = triviaData.submissions;
		let submissionsLen = submissions.length;
		if (!submissionsLen) return this.sendReply("No questions await review.");

		let buffer = "|raw|<div class=\"ladder\"><table>" +
			`<tr><td colspan="6"><strong>${submissionsLen}</strong> question${submissionsLen > 1 ? "s await" : " awaits"} review:</td></tr>` +
			"<tr><th>#</th><th>Category</th><th>Question</th><th>Answer(s)</th><th>Submitted By</th><th>Type</th></tr>";

		let i = 0;
		while (i < submissionsLen) {
			let entry = submissions[i];
			buffer += `<tr><td><strong>${(++i)}</strong></td><td>${entry.category}</td><td>${entry.question}</td><td>${entry.answers.join(", ")}</td><td>${entry.user}</td><td>${TYPES[entry.type]}</td></tr>`;
		}
		buffer += "</table></div>";

		this.sendReply(buffer);
	},
	reviewhelp: ["/trivia review - View the list of submitted questions. Requires: @ # & ~"],

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
			return this.privateModCommand(`(${user.name} ${(isAccepting ? " added " : " removed ")} all questions from the submission database.)`);
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
			if (!indicesLen) return this.errorReply(`'${target}' is not a valid set of submission index numbers. View /trivia review and /trivia help for more information.`);

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
			return this.privateModCommand(`(${user.name} ${(isAccepting ? "added " : "removed ")}submission number${(indicesLen > 1 ? "s " : " ")}${target} from the submission database.)`);
		}

		this.errorReply(`'${target}' is an invalid argument. View /trivia help questions for more information.`);
	},
	accepthelp: ["/trivia accept [index1], [index2], ... [indexn] OR all - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: @ # & ~"],
	rejecthelp: ["/trivia reject [index1], [index2], ... [indexn] OR all - Remove questions from the submission database using their index numbers or ranges of them. Requires: @ # & ~"],

	delete: function (target, room, user) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;

		target = target.trim();
		if (!target) return false;

		let question = Chat.escapeHTML(target);
		if (!question) return this.errorReply(`'${target}' is not a valid argument. View /trivia help questions for more information.`);

		let questions = triviaData.questions;
		let questionID = toId(question);
		for (let i = 0; i < questions.length; i++) {
			if (toId(questions[i].question) === questionID) {
				questions.splice(i, 1);
				writeTriviaData();
				return this.privateModCommand(`(${user.name} removed question '${target}' from the question database.)`);
			}
		}

		this.errorReply(`Question '${target}' was not found in the question database.`);
	},
	deletehelp: ["/trivia delete [question] - Delete a question from the trivia database. Requires: % @ # & ~"],

	qs: function (target, room, user) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');

		let buffer = "|raw|<div class=\"ladder\" style=\"overflow-y: scroll; max-height: 300px;\"><table>";
		let isWL = (this.message.startsWith("/wlink"));
		if (!target) {
			if (!this.runBroadcast()) return false;

			let questions = triviaData.questions;
			if (isWL) {
				questions = questions.filter(q => q.type === "weakestlink");
			} else {
				questions = questions.filter(q => q.type === "trivia");
			}
			let questionsLen = questions.length;
			if (!questionsLen) return this.sendReplyBox(`No questions have been submitted for ${isWL ? "Weakest Link" : "Trivia"} yet.`);

			let categories = Object.keys(CATEGORIES);
			let lastCategoryIdx = 0;
			buffer += "<tr><th>Category</th><th>Question Count</th></tr>";
			for (let i = 0; i < categories.length; i++) {
				if (categories[i] === 'random') continue;
				let tally = findEndOfCategory(categories[i], false) - lastCategoryIdx;
				lastCategoryIdx += tally;
				buffer += `<tr><td>${CATEGORIES[categories[i]]}</td><td>${tally} (${((tally * 100) / questionsLen).toFixed(2)}%)</td></tr>`;
			}
			buffer += `<tr><td><strong>Total</strong></td><td><strong>${questionsLen}</strong></td></table></div>`;

			return this.sendReply(buffer);
		}

		if (!this.can('mute', null, room)) return false;

		let category = toId(target);
		if (category === 'random') return false;
		if (!CATEGORIES[category]) return this.errorReply(`'${target}' is not a valid category. View /help trivia for more information.`);

		let list = sliceCategory(category);
		if (isWL) {
			list = list.filter(q => q.type === "weakestlink");
		} else {
			list = list.filter(q => q.type === "trivia");
		}
		let listLen = list.length;
		if (!listLen) {
			buffer += `<tr><td>There are no questions in the ${CATEGORIES[target]} category for ${isWL ? "Weakest Link" : "Trivia"}.</td></table></div>`;
			return this.sendReply(buffer);
		}

		if (user.can('ban', null, room)) {
			buffer += `<tr><td colspan="3">There are <strong>${listLen}</strong> questions in the ${CATEGORIES[target]} category for ${isWL ? "Weakest Link" : "Trivia"}.</td></tr>` +
				"<tr><th>#</th><th>Question</th><th>Answer(s)</th></tr>";
			for (let i = 0; i < listLen; i++) {
				let entry = list[i];
				buffer += `<tr><td><strong>${(i + 1)}</strong></td><td>${entry.question}</td><td>${entry.answers.join(", ")}</td><tr>`;
			}
		} else {
			buffer += `<td colspan="2">There are <strong>${listLen}</strong> questions in the ${target} category.</td></tr>` +
				"<tr><th>#</th><th>Question</th></tr>";
			for (let i = 0; i < listLen; i++) {
				buffer += `<tr><td><strong>${(i + 1)}</strong></td><td>${list[i].question}</td></tr>`;
			}
		}
		buffer += "</table></div>";

		this.sendReply(buffer);
	},
	qshelp: [
		"/trivia qs - View the distribution of questions in the question database.",
		"/trivia qs [category] - View the questions in the specified category. Requires: % @ # & ~",
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
	searchhelp: ["/trivia search [type], [query] - Searches for questions based on their type and their query. Valid types: submissions, subs, questions, qs. Requires: + % @ * & ~"],

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
		if (!score) return this.sendReplyBox(`User '${name}' has not played any trivia games yet.`);

		this.sendReplyBox(
			`User: <strong>${name}</strong><br />`	 +
			`Leaderboard score: <strong>${score[0]}</strong> (#${score[3]})<br />` +
			`Total game points: <strong>${score[1]}</strong> (#${score[4]})<br />` +
			`Total correct answers: <strong>${score[2]}</strong> (#${score[5]})` +
			(triviaData.ugm ? `<br />UGM points: <strong>${triviaData.ugm[userid]}</strong>` : "")
		);
	},
	rankhelp: ["/trivia rank [username] - View the rank of the specified user. If no name is given, view your own."],

	ladder: function (target, room) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');
		if (!this.runBroadcast()) return false;
		let ladder = triviaData.ladder;
		let leaderboard = triviaData.leaderboard;
		if (!ladder.length) return this.errorReply("No trivia games have been played yet.");

		let buffer = "|raw|<div class=\"ladder\" style=\"overflow-y: scroll; max-height: 300px;\"><table>" +
			"<tr><th>Rank</th><th>User</th><th>Leaderboard score</th><th>Total game points</th><th>Total correct answers</th></tr>";
		let num = parseInt(target);
		if (!num || num < 0) num = 100;
		if (num > ladder.length) num = ladder.length;
		for (let i = Math.max(0, num - 100); i < num; i++) {
			let leaders = ladder[i];
			for (let j = 0; j < leaders.length; j++) {
				let rank = leaderboard[leaders[j]];
				let leader = Users.getExact(leaders[j]);
				leader = leader ? Chat.escapeHTML(leader.name) : leaders[j];
				buffer += `<tr><td><strong>${(i + 1)}</strong></td><td>${leader}</td><td>${rank[0]}</td><td>${rank[1]}</td><td>${rank[2]}</td></tr>`;
			}
		}
		buffer += "</table></div>";

		return this.sendReply(buffer);
	},
	ladderhelp: ["/trivia ladder [num] - View information about 100 users on the trivia leaderboard."],

	ugm: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!this.can('broadcast', null, room)) return false;

		let command = toId(target);
		if (command === 'enable') {
			if (triviaData.ugm) return this.errorReply("UGM mode is already enabled.");
			triviaData.ugm = {};
			for (let i in triviaData.leaderboard) {
				triviaData.ugm[i] = 0;
			}
			CATEGORIES.ugm = 'Ultimate Gaming Month';
			writeTriviaData();
			return this.privateModCommand(`(${user.name} enabled UGM mode.)`);
		}
		if (command === 'disable') {
			if (!triviaData.ugm) return this.errorReply("UGM mode is already disabled.");
			triviaData.questions = triviaData.questions.filter(q => q.category !== 'ugm');
			delete triviaData.ugm;
			delete CATEGORIES.ugm;
			writeTriviaData();
			return this.privateModCommand(`(${user.name} disabled UGM mode.)`);
		}
		this.errorReply("Invalid target. Valid targets: enable, disable");
	},
	ugmhelp: ["/trivia ugm [setting] - Enable or disable UGM mode. Requires: # & ~"],

	bank: function (target, room, user) {
		if (!room.game || room.game.title !== 'Weakest Link') return this.errorReply("This command can only be used for games of the Weakest Link.");
		let res = room.game.onBank(user);
		if (res) return this.sendReply(res);
	},
	bankhelp: ["/trivia bank - Bank during a game of the Weakest Link."],

	decide: function (target, room, user) {
		if (!room.game || room.game.title !== 'Weakest Link') return this.errorReply("This command can only be used for games of the Weakest Link.");
		let res = room.game.decide(target, user);
		if (res) return this.sendReply(res);
	},
	decidehelp: ["/trivia decide [user] - If voting ends in a tie, this is used to break the tie by the strongest player."],

	vote: function (target, room, user) {
		if (!room.game || room.game.title !== 'Weakest Link') return this.errorReply("This command can only be used for games of the Weakest Link.");
		let res = room.game.vote(target, user);
		if (res) return this.sendReply(res);
	},
	votehelp: ["/trivia vote [user] - Choose your vote of who to eliminate in the Weakest link"],

	checkvotes: function (target, room, user) {
		if (!room.game || room.game.title !== 'Weakest Link') return this.errorReply("This command can only be used for games of the Weakest Link.");
		if (!this.can('broadcast', null, room)) return;
		if (!this.runBroadcast()) return;
		if (room.game.phase !== 'voting') return this.sendReplyBox("The game is not currently in the voting phase");
		return this.sendReplyBox(`The following players have yet to vote: ${Object.values(room.game.players).filter(pl => !pl.vote).map(pl => pl.name).join(", ")}`);
	},
	checkvoteshelp: ["/trivia checkvotes - Check which players have not yet voted."],

	help: function (target, room, user) {
		return this.parse("/help trivia");
	},
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
		wlink: commands,
		ta: commands.answer,
		triviahelp: [
			"Modes:",
			"- First: the first correct responder gains 5 points.",
			"- Timer: each correct responder gains up to 5 points based on how quickly they answer.",
			"- Number: each correct responder gains up to 5 points based on how many participants are correct.",
			"- Weakest Link: An elimination game, where every round, players vote off the 'Weakest Link'",
			"Categories: Arts & Entertainment, Pok\u00e9mon, Science & Geography, Society & Humanities, Random, and All.",
			"Game lengths:",
			"- Short: 20 point score cap. The winner gains 3 leaderboard points.",
			"- Medium: 35 point score cap. The winner gains 4 leaderboard points.",
			"- Long: 50 point score cap. The winner gains 5 leaderboard points.",
			"Game commands:",
			"- /trivia new [mode], [category], [length] - Begin signups for a new trivia game. Requires: + % @ # & ~",
			"- /trivia join - Join a trivia game during signups.",
			"- /trivia start - Begin the game once enough users have signed up. Requires: + % @ # & ~",
			"- /ta [answer] - Answer the current question.",
			"- /trivia kick [username] - Disqualify a participant from the current trivia game. Requires: % @ # & ~",
			"- /trivia leave - Makes the player leave the game.",
			"- /trivia end - End a trivia game. Requires: + % @ # ~",
			"Question modifying commands:",
			"- /trivia submit [category] | [question] | [answer1], [answer2] ... [answern] - Add a question to the submission database for staff to review.",
			"- /trivia review - View the list of submitted questions. Requires: @ # & ~",
			"- /trivia accept [index1], [index2], ... [indexn] OR all - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: @ # & ~",
			"- /trivia reject [index1], [index2], ... [indexn] OR all - Remove questions from the submission database using their index numbers or ranges of them. Requires: @ # & ~",
			"- /trivia add [category] | [question] | [answer1], [answer2], ... [answern] - Add a question to the question database. Requires: % @ # & ~",
			"- /trivia delete [question] - Delete a question from the trivia database. Requires: % @ # & ~",
			"- /trivia qs - View the distribution of questions in the question database.",
			"- /trivia qs [category] - View the questions in the specified category. Requires: % @ # & ~",
			"Informational commands:",
			"- /trivia search [type], [query] - Searches for questions based on their type and their query. Valid types: submissions, subs, questions, qs. Requires: + % @ # & ~",
			"- /trivia status [player] - lists the player's standings (your own if no player is specified) and the list of players in the current trivia game.",
			"- /trivia rank [username] - View the rank of the specified user. If none is given, view your own.",
			"- /trivia ladder - View information about the top 15 users on the trivia leaderboard.",
			"- /trivia ugm [setting] - Enable or disable UGM mode. Requires: # & ~",
			"Weakest Link Game commands:",
			"- /trivia bank - Bank when it is your turn.",
			"- /trivia vote [user] - Attempt to vote off a user during the voting phase.",
			"- /trivia decide [user] - If voting ends in a tie, the strongest player can decide who is eliminated.",
			"- /trivia checkvotes - Check who has not yet voted.",
		],
	},
};

