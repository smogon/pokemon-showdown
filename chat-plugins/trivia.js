/**
 * Trivia plugin. Only works in a room with the id 'trivia'
 * Trivia games are started with the specified mode, category, and length,
 * and end once a user's score has surpassed the score cap
 */

'use strict';

const fs = require('fs');

const MODES = {
	first: 'First',
	timer: 'Timer',
	number: 'Number'
};

const CATEGORIES = {
	ae: 'Arts & Entertainment',
	pokemon: 'Pok\u00e9mon',
	sg: 'Science & Geography',
	sh: 'Society & Humanities',
	random: 'Random'
};

const SCORE_CAPS = {
	short: 20,
	medium: 35,
	long: 50
};

const QUESTION_PERIOD = 15 * 1000;

const INTERMISSION_PERIOD = 30 * 1000;

let triviaData = {};
try {
	triviaData = require('../config/chat-plugins/triviadata.json');
} catch (e) {} // file doesn't exist or contains invalid JSON
if (!Object.isObject(triviaData)) triviaData = {};
if (!Object.isObject(triviaData.leaderboard)) triviaData.leaderboard = {};
if (!Array.isArray(triviaData.ladder)) triviaData.ladder = [];
if (!Array.isArray(triviaData.questions)) triviaData.questions = [];
if (!Array.isArray(triviaData.submissions)) triviaData.submissions = [];

let writeTriviaData = (function () {
	let writing = false;
	let writePending = false; // whether or not a new write is pending

	let finishWriting = function () {
		writing = false;
		if (writePending) {
			writePending = false;
			writeTriviaData();
		}
	};
	return function () {
		if (writing) {
			writePending = true;
			return;
		}
		writing = true;
		let data = JSON.stringify(triviaData, null, 2);
		fs.writeFile('config/chat-plugins/triviadata.json.0', data, function () {
			// rename is atomic on POSIX, but will throw an error on Windows
			fs.rename('config/chat-plugins/triviadata.json.0', 'config/chat-plugins/triviadata.json', function (err) {
				if (err) {
					// This should only happen on Windows
					fs.writeFile('config/chat-plugins/triviadata.json', data, finishWriting);
					return;
				}
				finishWriting();
			});
		});
	};
})();

// Binary search for the index at which to splice in new questions in a category,
// or the index at which to slice up to for a category's questions
function findEndOfCategory(category, inSubmissions) {
	let questions = inSubmissions ? triviaData.submissions : triviaData.questions;
	let left = 0;
	let right = questions.length - 1;
	let i = 0;
	let curCategory;
	while (left <= right) {
		i = ~~((left + right) / 2);
		curCategory = questions[i].category;
		if (curCategory < category) {
			left = i + 1;
		} else if (curCategory > category) {
			right = i - 1;
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

let trivia = {};

let triviaRoom = Rooms.get('trivia');
if (triviaRoom) {
	if (triviaRoom.plugin) {
		triviaData = triviaRoom.plugin.data;
		trivia = triviaRoom.plugin.trivia;
	} else {
		triviaRoom.plugin = {
			data: triviaData,
			write: writeTriviaData,
			trivia: trivia
		};
		let questionWorkshop = Rooms.get('questionworkshop');
		if (questionWorkshop) questionWorkshop.plugin = triviaRoom.plugin;
	}
}

let Trivia = (function () {
	function Trivia(mode, category, scoreCap, room) {
		this.room = room;
		this.mode = mode;
		this.category = category;
		this.scoreCap = scoreCap;
		this.prize = (scoreCap - 5) / 15 + 2;
		this.phase = 'signup';
		this.participants = new Map();
		this.currentQuestions = [];
		this.currentAnswer = [];
		this.phaseTimeout = null;
		this.inactivityCounter = 0;

		if (mode !== 'first') {
			if (mode === 'timer') this.askedAt = 0;
			this.correctResponders = 0;
		}
	}

	Trivia.prototype.addParticipant = function (output, user) {
		if (this.participants.has(user.userid)) return output.sendReply("You have already signed up for this trivia game.");

		let latestIp = user.latestIp;
		for (let participantid, participantsIterator = this.participants.keys(); !!(participantid = participantsIterator.next().value);) { // replace with for-of loop once available
			let participant = Users.get(participantid);
			if (participant && participant.ips[latestIp]) return output.sendReply("You have already signed up for this trivia game.");
		}

		let scoreData = {
			score: 0,
			correctAnswers: 0,
			answered: false
		};
		if (this.mode !== 'first') {
			if (this.mode === 'timer') scoreData.points = 0;
			scoreData.responderIndex = -1;
		}
		this.participants.set(user.userid, scoreData);
		output.sendReply("You have signed up for the trivia game.");
	};

	Trivia.prototype.kickParticipant = function (output, target, user) {
		if (this.participants.size < 3) return output.sendReply("The trivia game requires at least three participants in order to run.");

		let userid = toId(target);
		if (!userid) return output.sendReply("User '" + target + "' does not exist.");
		if (!this.participants.has(userid)) return output.sendReply("User '" + target + "' is not a participant in this trivia game.");

		this.participants.delete(userid);
		output.send("User '" + target + "' has been disqualified from the trivia game by " + user + ".");
	};

	Trivia.prototype.startGame = function (output) {
		if (this.phase !== 'signup') return output.sendReply("There is no trivia game to start.");
		if (this.participants.size < 3) return output.sendReply("Not enough users have signed up yet! Trivia games require at least three participants to run.");

		if (this.category === 'random') {
			this.currentQuestions = triviaData.questions.randomize();
		} else {
			this.currentQuestions = sliceCategory(this.category).randomize();
		}

		if (!this.currentQuestions.length) {
			this.room.addRaw(
				"<div class=\"broadcast-blue\"><strong>There are no questions" + (this.category === 'random' ? "" : " in the " + CATEGORIES[this.category] + " category") + "!</strong><br />" +
				"Questions must be added in the Question Workshop room before a game using this category can be started.</div>"
			);
			delete trivia[this.room.id];
			return false;
		}

		this.room.addRaw("<div class=\"broadcast-blue\">The game has begun!</div>");
		this.askQuestion();
	};

	Trivia.prototype.askQuestion = function () {
		let head = this.currentQuestions.pop();
		this.currentAnswer = head.answers;
		this.phase = 'question';
		this.room.addRaw(
			"<div class=\"broadcast-blue\"><strong>Question: " + head.question + "</strong><br />" +
			"Category: " + CATEGORIES[head.category] + "</div>"
		).update();

		switch (this.mode) {
		case 'first':
			this.phaseTimeout = setTimeout(this.noAnswer.bind(this), QUESTION_PERIOD);
			break;
		case 'timer':
			this.askedAt = Date.now();
			this.phaseTimeout = setTimeout(this.timerAnswers.bind(this), QUESTION_PERIOD);
			break;
		case 'number':
			this.phaseTimeout = setTimeout(this.numberAnswers.bind(this), QUESTION_PERIOD);
			break;
		}
	};

	Trivia.prototype.answerQuestion = function (output, target, user) {
		if (this.phase !== 'question') return output.sendReply("There is no question to answer.");
		if (!this.participants.has(user.userid)) return output.sendReply("You are not a participant in this trivia game.");

		let scoreData = this.participants.get(user.userid);
		if (scoreData.answered && this.mode === 'first') return output.sendReply("You have already submitted an answer for the current question.");

		let correct = false;
		scoreData.answered = true;
		for (let i = 0; i < this.currentAnswer.length; i++) {
			let correctAnswer = this.currentAnswer[i];
			if (target === correctAnswer || correctAnswer.length > 5 && Tools.levenshtein(target, correctAnswer) < 3) {
				correct = true;
				break;
			}
		}

		if (this.mode === 'first') {
			if (correct) return this.firstAnswer(user);
			return output.sendReply("You have selected '" + target + "' as your answer.");
		}

		if (correct) {
			if (scoreData.responderIndex >= 0) return output.sendReply("You have selected '" + target + "' as your answer.");

			scoreData.responderIndex = this.correctResponders++;
			scoreData.correctAnswers++;
			if (this.mode === 'timer') {
				let points = 5 - ~~((Date.now() - this.askedAt) / (QUESTION_PERIOD / 5));
				if ([1, 2, 3, 4, 5].indexOf(points) >= 0) {
					scoreData.score += points;
					scoreData.points = points;
				}
			}
		} else {
			if (scoreData.responderIndex < 0) return output.sendReply("You have selected '" + target + "' as your answer.");

			this.correctResponders--;
			scoreData.responderIndex = -1;
			scoreData.correctAnswers--;
			if (this.mode === 'timer') {
				scoreData.score -= scoreData.points;
				scoreData.points = 0;
			}
		}

		output.sendReply("You have selected '" + target + "' as your answer.");
	};

	Trivia.prototype.noAnswer = function () {
		if (!this.currentQuestions.length) return this.stalemate();

		this.phase = 'intermission';

		let isActive = false;
		for (let scoreData, participantsIterator = this.participants.values(); !!(scoreData = participantsIterator.next().value);) { // replace with for-of loop once available
			if (scoreData.answered) {
				scoreData.answered = false;
				isActive = true;
			}
		}

		if (isActive) {
			this.inactivityCounter = 0;
		} else if (++this.inactivityCounter === 7) {
			this.room.addRaw("<div class=\"broadcast-blue\">The game has forced itself to end due to inactivity.</div>").update();
			return this.updateLeaderboard();
		}

		this.room.addRaw(
			"<div class=\"broadcast-blue\"><strong>The answering period has ended!</strong><br />" +
			"Correct: no one<br />" +
			"Answer" + (this.currentAnswer.length > 1 ? "s: " : ": ") + this.currentAnswer.join(", ") + "<br />" +
			"Nobody gained any points.</div>"
		).update();
		this.phaseTimeout = setTimeout(this.askQuestion.bind(this), INTERMISSION_PERIOD);
	};

	Trivia.prototype.firstAnswer = function (user) {
		clearTimeout(this.phaseTimeout);
		this.phase = 'intermission';

		let scoreData = this.participants.get(user.userid);
		scoreData.score += 5;
		scoreData.correctAnswers++;

		let buffer = "<div class=\"broadcast-blue\"><strong>The answering period has ended!</strong><br />" +
			"Correct: " + Tools.escapeHTML(user.name) + "<br />" +
			"Answer" + (this.currentAnswer.length > 1 ? "s: " : ": ") + this.currentAnswer.join(", ") + "<br />";

		if (scoreData.score >= this.scoreCap) {
			buffer += "They won the game with a final score of <strong>" + scoreData.score + "</strong>, and their leaderboard score has increased by <strong>" + this.prize + "</strong> points!</div>";
			this.room.addRaw(buffer);
			return this.updateLeaderboard(user.userid);
		}

		if (!this.currentQuestions.length) return this.stalemate();

		for (let participantsIterator = this.participants.values(); !!(scoreData = participantsIterator.next().value);) { // replace with for-of loop once available
			scoreData.answered = false;
		}

		if (this.inactivityCounter) this.inactivityCounter = 0;

		buffer += "They gained <strong>5</strong> points!</div>";
		this.room.addRaw(buffer);
		this.phaseTimeout = setTimeout(this.askQuestion.bind(this), INTERMISSION_PERIOD);
	};

	Trivia.prototype.timerAnswers = function () {
		if (!this.correctResponders) return this.noAnswer();

		this.phase = 'intermission';

		let winner = '';
		let winnerIndex = this.correctResponders;
		let score = this.scoreCap;
		let buffer = "<div class=\"broadcast-blue\"><strong>The answering period has ended!</strong><br />" +
			"Answer" + (this.currentAnswer.length > 1 ? "s: " : ": ") + this.currentAnswer.join(", ") + "<br />" +
			"<br />" +
			"<table width=\"100%\" bgcolor=\"#9CBEDF\">" +
			"<tr bgcolor=\"#6688AA\"><th width=\"100px\">Points gained</th><th>Correct</th></tr>";
		let innerBuffer = {5:[], 4:[], 3:[], 2:[], 1:[]};

		for (let data, participantsIterator = this.participants.entries(); !!(data = participantsIterator.next().value);) { // replace with for-of loop once available
			let scoreData = data[1];
			scoreData.answered = false;
			if (scoreData.responderIndex < 0) continue;

			let participant = Users.get(data[0]);
			participant = participant ? participant.name : data[0];
			innerBuffer[scoreData.points].push(participant);

			if (scoreData.score >= score && scoreData.responderIndex < winnerIndex) {
				winner = participant;
				winnerIndex = scoreData.responderIndex;
				score = scoreData.score;
			}
			scoreData.points = 0;
			scoreData.responderIndex = -1;
		}

		for (let i = 6; --i;) {
			if (innerBuffer[i].length) {
				buffer += "<tr bgcolor=\"#6688AA\"><td align=\"center\">" + i + "</td><td>" + Tools.escapeHTML(innerBuffer[i].join(", ")) + "</td></tr>";
			}
		}

		if (winner) {
			buffer += "</table><br />" +
				Tools.escapeHTML(winner) + " won the game with a final score of <strong>" + score + "</strong>, and their leaderboard score has increased by <strong>" + this.prize + "</strong> points!</div>";
			this.room.addRaw(buffer).update();
			return this.updateLeaderboard(toId(winner));
		}

		if (!this.currentQuestions.length) return this.stalemate();
		this.correctResponders = 0;
		this.inactivityCounter = 0;

		buffer += "</table></div>";
		this.room.addRaw(buffer).update();
		this.phaseTimeout = setTimeout(this.askQuestion.bind(this), INTERMISSION_PERIOD);
	};

	Trivia.prototype.numberAnswers = function () {
		if (!this.correctResponders) return this.noAnswer();

		this.phase = 'intermission';

		let winner = '';
		let winnerIndex = this.correctResponders;
		let score = this.scoreCap;
		let points = ~~(5 - 4 * (this.correctResponders - 1) / (this.participants.size - 1 || 1));
		let innerBuffer = [];

		for (let data, participantsIterator = this.participants.entries(); !!(data = participantsIterator.next().value);) { // replace with for-of loop once available
			let scoreData = data[1];
			scoreData.answered = false;
			if (scoreData.responderIndex < 0) continue;

			let participant = Users.get(data[0]);
			participant = participant ? participant.name : data[0];
			innerBuffer.push(participant);

			scoreData.score += points;
			if (scoreData.score >= score && scoreData.responderIndex < winnerIndex) {
				winner = participant;
				winnerIndex = scoreData.responderIndex;
				score = scoreData.score;
			}
			scoreData.responderIndex = -1;
		}

		let buffer = "<div class=\"broadcast-blue\"><strong>The answering period has ended!</strong><br />" +
			"Correct: " + Tools.escapeHTML(innerBuffer.join(", ")) + "<br />" +
			"Answer" + (this.currentAnswer.length > 1 ? "s: " : ": ") + this.currentAnswer.join(", ") + "<br />";

		if (winner) {
			buffer += Tools.escapeHTML(winner) + " won the game with a final score of <strong>" + score + "</strong>, and their leaderboard score has increased by <strong>" + this.prize + "</strong> points!</div>";
			this.room.addRaw(buffer).update();
			return this.updateLeaderboard(toId(winner));
		}

		if (!this.currentQuestions.length) return this.stalemate();
		this.inactivityCounter = 0;

		buffer += (this.correctResponders > 1 ? "Each of them" : "They") + " gained <strong>" + points + "</strong> point" + (points > 1 ? "s!</div>" : "!</div>");
		this.correctResponders = 0;
		this.room.addRaw(buffer).update();
		this.phaseTimeout = setTimeout(this.askQuestion.bind(this), INTERMISSION_PERIOD);
	};

	Trivia.prototype.stalemate = function () {
		this.room.addRaw(
			"<div class=\"broadcast-blue\">No questions are left!<br />" +
			"<strong>Since the game has reached a stalemate, nobody has gained any leaderboard points.</strong></div>"
		).update();
		this.updateLeaderboard();
	};

	Trivia.prototype.updateLeaderboard = function (winnerid) {
		let leaderboard = triviaData.leaderboard;

		// update leaderboard scores
		for (let data, participantsIterator = this.participants.entries(); !!(data = participantsIterator.next().value);) { // replace with for-of loop once available
			let scoreData = data[1];
			if (!scoreData.score) continue;

			let rank = leaderboard[data[0]];
			if (rank) {
				rank[1] += scoreData.score;
				rank[2] += scoreData.correctAnswers;
			} else {
				leaderboard[data[0]] = [0, scoreData.score, scoreData.correctAnswers];
			}
		}
		if (winnerid) leaderboard[winnerid][0] += this.prize;

		// update leaderboard ranks and rebuild the ladder
		let leaders = Object.keys(leaderboard);
		let ladder = triviaData.ladder = [];
		for (let i = 0; i < 3; i++) {
			leaders.sort(function (a, b) {
				return leaderboard[b][i] - leaderboard[a][i];
			});

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

		writeTriviaData();
		delete trivia[this.room.id];
	};

	Trivia.prototype.getStatus = function (output, user) {
		let buffer = "There is a trivia game in progress, and it is in its " + this.phase + " phase.<br />" +
			"Mode: " + MODES[this.mode] + " | Category: " + CATEGORIES[this.category] + " | Score cap: " + this.scoreCap;
		if (this.phase !== 'signup' && !output.broadcasting) {
			let scoreData = this.participants.get(user.userid);
			if (scoreData) {
				buffer += "<br />" +
					"Current score: " + scoreData.score + " | Correct answers: " + scoreData.correctAnswers;
			}
		}

		output.sendReplyBox(buffer);
	};

	Trivia.prototype.getParticipants = function (output) {
		let participantsLen = this.participants.size;
		if (!participantsLen) return output.sendReplyBox("There are no players in this trivia game.");

		let participants = [];
		let buffer = "There " + (participantsLen > 1 ? "are <strong>" + participantsLen + "</strong> players" : "is <strong>1</strong> player") + " participating in this trivia game:<br />";
		this.participants.forEach(function (scoreData, participantid) {
			let participant = Users.get(participantid);
			participants.push(participant ? participant.name : participantid);
		});
		buffer += Tools.escapeHTML(participants.join(", "));

		output.sendReplyBox(buffer);
	};

	Trivia.prototype.endGame = function (output, user) {
		if (this.phase !== 'signup') clearTimeout(this.phaseTimeout);
		this.room.addRaw("<div class=\"broadcast-blue\">" + Tools.escapeHTML(user.name) + " has forced the game to end.</div>");
		delete trivia[this.room.id];
	};

	return Trivia;
})();

let commands = {
	// trivia game commands
	new: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');
		if (!this.can('broadcast', null, room) || !target) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");
		if (trivia[room.id]) return this.errorReply("There is already a trivia game in progress.");

		target = target.split(',');
		if (target.length !== 3) return this.errorReply("Invalid arguments specified. View /help trivia for more information.");

		let mode = toId(target[0]);
		if (!MODES[mode]) return this.errorReply("'" + target[0].trim() + "' is not a valid mode. View /help trivia for more information.");

		let category = toId(target[1]);
		if (!CATEGORIES[category]) return this.errorReply("'" + target[1].trim() + "' is not a valid category. View /help trivia for more information.");

		let scoreCap = SCORE_CAPS[toId(target[2])];
		if (!scoreCap) return this.errorReply("'" + target[2].trim() + "' is not a valid score cap. View /help trivia for more information.");

		trivia[room.id] = new Trivia(mode, category, scoreCap, room);
		room.addRaw(
			"<div class=\"broadcast-blue\"><strong>Signups for a new trivia game have begun! Enter /trivia join to join.</strong><br />" +
			"Mode: " + MODES[mode] + " | Category: " + CATEGORIES[category] + " | Score cap: " + scoreCap + "</div>"
		);
	},
	newhelp: ["/trivia new OR create [mode], [category], [length] - Begin signups for a new trivia game. Requires: + % @ # & ~"],

	join: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');
		let trivium = trivia[room.id];
		if (!trivium) return this.errorReply("There is no trivia game in progress.");
		if (!this.canTalk()) return;
		trivium.addParticipant(this, user);
	},
	joinhelp: ["/trivia join - Join a trivia game during signups."],

	start: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');
		if (!this.can('broadcast', null, room)) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");
		let trivium = trivia[room.id];
		if (!trivium) return this.errorReply("There is no trivia game to start.");
		trivium.startGame(this);
	},
	starthelp: ["/trivia start - Begin the game once enough users have signed up. Requires: + % @ # & ~"],

	kick: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');
		if (!this.can('mute', null, room) || !target) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");
		let trivium = trivia[room.id];
		if (!trivium) return this.errorReply("There is no trivia game in progress.");
		this.parse('/m ' + target);
		trivium.kickParticipant(this, target, user);
	},
	kickhelp: ["/trivia kick [username] - Disqualify a participant from the current trivia game. Requires: % @ # & ~"],

	answer: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');

		target = toId(target);
		if (!target) return this.errorReply("No valid answer was specified.");

		let trivium = trivia[room.id];
		if (!trivium) return this.errorReply("There is no trivia game in progress.");
		trivium.answerQuestion(this, target, user);
	},
	answerhelp: ["/ta [answer] - Answer the current question."],

	end: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');
		if (!this.can('broadcast', null, room)) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");
		let trivium = trivia[room.id];
		if (!trivium) return this.errorReply("There is no trivia game in progress.");
		trivium.endGame(this, user);
	},
	endhelp: ["/trivia end - End a trivia game. Requires: + % @ # ~"],

	// question database modifying commands
	submit: 'add',
	add: function (target, room, user, connection, cmd) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (cmd === 'add' && !this.can('mute', null, room) || !target) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");

		target = target.split('|');
		if (target.length !== 3) return this.errorReply("Invalid arguments specified. View /help trivia for more information.");

		let category = toId(target[0]);
		if (category === 'random') return false;
		if (!CATEGORIES[category]) return this.errorReply("'" + target[0].trim() + "' is not a valid category. View /help trivia for more information.");

		target[1] = target[1].trim();

		let question = Tools.escapeHTML(target[1]);
		if (!question) return this.errorReply("'" + target[1] + "' is not a valid question.");

		let answers = target[2].split(',');
		let i;
		for (i = 0; i < answers.length; i++) {
			answers[i] = toId(answers[i]);
		}
		while (i--) {
			if (answers.indexOf(answers[i]) !== i) answers.splice(i, 1);
		}
		if (!answers.length) return this.errorReply("No valid answers were specified.");

		let submissions = triviaData.submissions;
		let submission = {
			category: category,
			question: question,
			answers: answers,
			user: user.userid
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
	addhelp: ["/trivia add [category] | [question] | [answer1], [answer2], ... [answern] - Add a question to the question database. Requires: % @ # & ~"],

	review: function (target, room) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('mute', null, room)) return false;

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
	reviewhelp: ["/trivia review - View the list of submitted questions. Requires: % @ # & ~"],

	reject: 'accept',
	accept: function (target, room, user, connection, cmd) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('mute', null, room)) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");

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

			indices = indices.sort(function (a, b) {
				return a - b;
			}).filter(function (entry, index) {
				return !index || indices[index - 1] !== entry;
			});

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
	accepthelp: ["/trivia accept [index1], [index2], ... [indexn] OR all - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: % @ # & ~"],
	rejecthelp: ["/trivia reject [index1], [index2], ... [indexn] OR all - Remove questions from the submission database using their index numbers or ranges of them. Requires: % @ # & ~"],

	delete: function (target, room, user) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('mute', null, room)) return false;
		if ((user.locked || room.isMuted(user)) && !user.can('bypassall')) return this.errorReply("You cannot do this while unable to talk.");

		target = target.trim();
		if (!target) return false;

		let question = Tools.escapeHTML(target);
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
	deletehelp: ["/trivia delete [question] - Delete a question from the trivia database. Requires: % @ # & ~"],

	qs: function (target, room, user) {
		if (room.id !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');

		let buffer = "|raw|<div class=\"ladder\"><table>";

		if (!target) {
			if (!this.canBroadcast()) return false;

			let questions = triviaData.questions;
			let questionsLen = questions.length;
			if (!questionsLen) return this.sendReplyBox("No questions have been submitted yet.");

			let categories = Object.keys(CATEGORIES);
			let lastCategoryIdx = 0;
			buffer += "<tr><th>Category</th><th>Question Count</th></tr>";
			for (let i = 0; i <= 11; i++) {
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
			buffer += "<tr><td>There are no questions in the " + target + " category.</td></table></div>";
			return this.sendReply(buffer);
		}

		if (user.can('declare', null, room)) {
			buffer += "<tr><td colspan=\"3\">There are <strong>" + listLen + "</strong> questions in the " + target + " category.</td></tr>" +
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
		"/trivia qs [category] - View the questions in the specified category. Requires: % @ # & ~"
	],

	// informational commands
	'': 'status',
	status: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');
		if (!this.canBroadcast()) return false;
		let trivium = trivia[room.id];
		if (!trivium) return this.errorReply("There is no trivia game in progress.");
		trivium.getStatus(this, user);
	},
	statushelp: ["/trivia status - View information about any ongoing trivia game."],

	players: function (target, room) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');
		if (!this.canBroadcast()) return false;
		let trivium = trivia[room.id];
		if (!trivium) return this.errorReply("There is no trivia game in progress.");
		trivium.getParticipants(this);
	},
	playershelp: ["/trivia players - View the list of the players in the current trivia game."],

	rank: function (target, room, user) {
		if (room.id !== 'trivia') return this.errorReply('This command can only be used in Trivia.');

		let name = '';
		let userid = '';
		if (!target) {
			name = Tools.escapeHTML(user.name);
			userid = user.userid;
		} else {
			target = this.splitTarget(target, true);
			name = Tools.escapeHTML(this.targetUsername);
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
		if (!this.canBroadcast()) return false;

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
				leader = leader ? Tools.escapeHTML(leader.name) : leaders[j];
				buffer += "<tr><td><strong>" + (i + 1) + "</strong></td><td>" + leader + "</td><td>" + rank[0] + "</td><td>" + rank[1] + "</td><td>" + rank[2] + "</td></tr>";
			}
		}
		buffer += "</table></div>";

		return this.sendReply(buffer);
	},
	ladderhelp: ["/trivia ladder - View information about the top 15 users on the trivia leaderboard."]
};

exports.commands = {
	trivia: commands,
	ta: commands.answer,
	triviahelp: [
		"Modes:",
		"- First: the first correct responder gains 5 points.",
		"- Timer: each correct responder gains up to 5 points based on how quickly they answer.",
		"- Number: each correct responder gains up to 5 points based on how many participants are correct.",
		"Categories: Arts & Entertainment, Pok\u00e9mon, Science & Geography, Society & Humanities, and Random.",
		"Game lengths:",
		"- Short: 20 point score cap. The winner gains 3 leaderboard points.",
		"- Medium: 35 point score cap. The winner gains 4 leaderboard points.",
		"- Long: 50 point score cap. The winner gains 5 leaderboard points.",
		"Game commands:",
		"- /trivia new OR create [mode], [category], [length] - Begin signups for a new trivia game. Requires: + % @ # & ~",
		"- /trivia join - Join a trivia game during signups.",
		"- /trivia start - Begin the game once enough users have signed up. Requires: + % @ # & ~",
		"- /ta [answer] - Answer the current question.",
		"- /trivia kick [username] - Disqualify a participant from the current trivia game. Requires: % @ # & ~",
		"- /trivia end - End a trivia game. Requires: + % @ # ~",
		"Question modifying commands:",
		"- /trivia submit [category] | [question] | [answer1], [answer2] ... [answern] - Add a question to the submission database for staff to review.",
		"- /trivia review - View the list of submitted questions. Requires: % @ # & ~",
		"- /trivia accept [index1], [index2], ... [indexn] OR all - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: % @ # & ~",
		"- /trivia reject [index1], [index2], ... [indexn] OR all - Remove questions from the submission database using their index numbers or ranges of them. Requires: % @ # & ~",
		"- /trivia add [category] | [question] | [answer1], [answer2], ... [answern] - Add a question to the question database. Requires: % @ # & ~",
		"- /trivia delete [question] - Delete a question from the trivia database. Requires: % @ # & ~",
		"- /trivia qs - View the distribution of questions in the question database.",
		"- /trivia qs [category] - View the questions in the specified category. Requires: % @ # & ~",
		"Informational commands:",
		"- /trivia status - View information about any ongoing trivia game.",
		"- /trivia players - View the list of the players in the current trivia game.",
		"- /trivia rank [username] - View the rank of the specified user. If none is given, view your own.",
		"- /trivia ladder - View information about the top 15 users on the trivia leaderboard."
	]
};
