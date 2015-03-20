/**
 * Trivia plugin. Only works in a room with the id 'trivia'
 * Trivia games are started with the specified mode, category, and length,
 * and end once a user's score has surpassed the score cap
 */

var fs = require('fs');

const MODES = {first: 'First', timer: 'Timer', number: 'Number'};
const CATEGORIES = {
	animemanga: 'Anime/Manga',
	geography: 'Geography',
	history: 'History',
	humanities: 'Humanities',
	miscellaneous: 'Miscellaneous',
	music: 'Music',
	pokemon: 'Pokemon',
	rpm: 'Religion, Philosophy, and Myth',
	science: 'Science',
	sports: 'Sports',
	tvmovies: 'TV/Movies',
	videogames: 'Video Games',
	random: 'Random'
};
const CAPS = {short: 20, medium: 35, long: 50};

var triviaData = {};
try {
	triviaData = require('../config/chat-plugins/triviadata.json');
} catch (e) {} // file doesn't exist or contains invalid JSON
if (!Object.isObject(triviaData)) triviaData = {};
if (!Object.isObject(triviaData.leaderboard)) triviaData.leaderboard = {};
if (!Array.isArray(triviaData.questions)) triviaData.questions = [];
if (!Array.isArray(triviaData.submissions)) triviaData.submissions = [];

var writeTriviaData = (function () {
	var writing = false;
	var writePending = false; // whether or not a new write is pending

	var finishWriting = function () {
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
		var data = JSON.stringify(triviaData, null, 2);
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

var trivia = {};

var Trivia = (function () {
	function Trivia(mode, category, cap, room) {
		this.room = room;
		this.mode = mode;
		this.category = category;
		this.cap = cap;
		this.prize = (cap - 5) / 15 + 2;
		this.phase = 'signup';
		this.participants = new Map();
		this.curQs = [];
		this.curA = [];
		this.sleep = null;

		if (mode !== 'first') {
			if (mode === 'timer') this.askedAt = 0;
			this.correctResponders = 0;
		}
	}

	Trivia.prototype.addParticipant = function (output, user) {
		if (this.phase !== 'signup') return output.sendReply('There is no trivia game in its signup phase.');
		if (this.participants.has(user.userid)) return output.sendReply('You have already signed up for this trivia game.');

		var latestIp = user.latestIp;
		for (var participant, participantsIterator = this.participants.keys(); !!(participant = participantsIterator.next().value);) { // replace with for-of loop once available
			var targetUser = Users.get(participant);
			if (targetUser && targetUser.ips[latestIp]) return output.sendReply('You have already signed up for this trivia game.');
		}

		var scoreData = {score: 0, correctAnswers: 0, answered: false};
		if (this.mode !== 'first') {
			if (this.mode === 'timer') scoreData.points = 0;
			scoreData.responderIndex = -1;
		}
		this.participants.set(user.userid, scoreData);
		output.sendReply('You have signed up for the next trivia game.');
	};

	Trivia.prototype.kickParticipant = function (output, target) {
		if (this.participants.size < 3) return output.sendReply('The trivia game requires at least three participants in order to run.');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		var name = this.targetUsername;
		var userid = toId(name);
		if (!userid || !targetUser) return output.sendReply('User "' + name + '" does not exist.');
		if (!this.participants.has(userid)) return output.sendReply('User "' + name + '" is not a participant in this trivia game.');

		this.participants.delete(userid);
		output.sendReply('User "' + name + '" has been disqualified from the trivia game.');
	};

	Trivia.prototype.startGame = function (output) {
		if (this.phase !== 'signup') return output.sendReply('There is no trivia game in its signup phase.');
		if (this.participants.size < 3) return output.sendReply('Not enough users have signed up yet! Trivia games require at least three participants to run.');

		if (this.category === 'random') {
			this.curQs = triviaData.questions.randomize();
		} else {
			var category = this.category;
			this.curQs = triviaData.questions.filter(function (question) {
				return question.category === category;
			}).randomize();
		}

		this.room.addRaw('<div class="broadcast-blue">Signups have ended and the game has begun!</div>');
		this.askQuestion();
	};

	Trivia.prototype.askQuestion = function () {
		if (!this.curQs.length) {
			this.room.addRaw('<div class="broadcast-blue">No questions are left!<br />' +
			                 '<strong>Since the game has reached a stalemate, nobody has gained any leaderboard points.</strong></div>');
			this.room.update();
			return this.updateLeaderboard();
		}

		var head = this.curQs.pop();
		this.curA = head.answers;
		this.phase = 'question';
		this.room.addRaw('<div class="broadcast-blue"><strong>Question: ' + head.question + '</strong><br />' +
		                 'Category: ' + CATEGORIES[head.category] + '</div>');
		this.room.update();

		switch (this.mode) {
			case 'first':
				this.sleep = setTimeout(this.noAnswer.bind(this), 15 * 1000);
				break;
			case 'timer':
				this.askedAt = Date.now();
				this.sleep = setTimeout(this.timerAnswers.bind(this), 15 * 1000);
				break;
			case 'number':
				this.sleep = setTimeout(this.numberAnswers.bind(this), 15 * 1000);
				break;
		}
	};

	Trivia.prototype.answerQuestion = function (output, target, user) {
		if (this.phase !== 'question') return output.sendReply('There is no question to answer.');
		if (!this.participants.has(user.userid)) return output.sendReply('You are not a participant in this trivia game.');

		var scoreData = this.participants.get(user.userid);
		if (scoreData.answered) return output.sendReply('You have already submitted an answer for the current question.');

		var answer = toId(target);
		if (!answer) return output.sendReply('"' + target.trim() + '" is not a valid answer.');

		scoreData.answered = true;
		if (this.curA.indexOf(answer) < 0) return output.sendReply('You have selected "' + target.trim() + '" as your answer.');
		if (this.mode === 'first') return this.firstAnswer(user);

		scoreData.responderIndex = this.correctResponders++;
		scoreData.correctAnswers++;
		if (this.mode === 'timer') {
			var points = 5 - ~~((Date.now() - this.askedAt) / (3 * 1000));
			if (points > 0) {
				scoreData.score += points;
				scoreData.points = points;
			}
		}
		output.sendReply('You have selected "' + target.trim() + '" as your answer.');
	};

	Trivia.prototype.noAnswer = function () {
		this.phase = 'intermission';

		for (var scoreData, participantsIterator = this.participants.values(); !!(scoreData = participantsIterator.next().value);) { // replace with for-of loop once available
			if (scoreData.answered) scoreData.answered = false;
		}

		this.room.addRaw('<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
				 'Correct: no one<br />' +
				 'Answer' + (this.curA.length > 1 ? 's: ' : ': ') + this.curA.join(', ') + '<br />' +
				 'Nobody gained any points.</div>');
		this.room.update();
		this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000);
	};

	Trivia.prototype.firstAnswer = function (user) {
		clearTimeout(this.sleep);
		this.phase = 'intermission';

		var scoreData = this.participants.get(user.userid);
		scoreData.score += 5;
		scoreData.correctAnswers++;

		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			     'Correct: ' + Tools.escapeHTML(user.name) + '<br />' +
			     'Answer' + (this.curA.length > 1 ? 's: ' : ': ') + this.curA.join(', ') + '<br />';
		if (scoreData.score < this.cap) {
			for (var participantsIterator = this.participants.values(); !!(scoreData = participantsIterator.next().value);) { // replace with for-of loop once available
				if (scoreData.answered) scoreData.answered = false;
			}

			buffer += 'They gained <strong>5</strong> points!</div>';
			this.room.addRaw(buffer);
			this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000);
			return false;
		}

		buffer += 'They won the game with a final score of <strong>' + scoreData.score + '</strong>, and their leaderboard score has increased by <strong>' + this.prize + '</strong> points!</div>';
		this.room.addRaw(buffer);
		this.updateLeaderboard(user.userid);
	};

	Trivia.prototype.timerAnswers = function () {
		if (!this.correctResponders) return this.noAnswer();

		this.phase = 'intermission';

		var winner = '';
		var winnerIndex = this.correctResponders;
		var score = this.cap - 1;
		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			     'Answer' + (this.curA.length > 1 ? 's: ' : ': ') + this.curA.join(', ') + '<br /><br />' +
			     '<table width="100%" bgcolor="#9CBEDF">' +
			     '<tr bgcolor="#6688AA"><th width="100px">Points Gained</th><th>Correct</th></tr>';
		var innerBuffer = {5:[], 4:[], 3:[], 2:[], 1:[]};

		for (var data, participantsIterator = this.participants.entries(); !!(data = participantsIterator.next().value);) { // replace with for-of loop once available
			data[1].answered = false;
			if (data[1].responderIndex < 0) continue;

			var scoreData = data[1];
			var participant = Users.get(data[0]);
			participant = participant ? participant.name : data[0];
			innerBuffer[scoreData.points].push(participant);

			if (scoreData.score > score && scoreData.responderIndex < winnerIndex) {
				winner = participant;
				winnerIndex = scoreData.responderIndex;
				score = scoreData.score;
			}
			scoreData.points = 0;
			scoreData.responderIndex = -1;
		}

		for (var i = 6; --i;) {
			if (innerBuffer[i].length) buffer += '<tr bgcolor="#6688AA"><td align="center">' + i + '</td><td>' + Tools.escapeHTML(innerBuffer[i].join(', ')) + '</td></tr>';
		}

		if (!winner) {
			buffer += '</table></div>';
			this.correctResponders = 0;
			this.room.addRaw(buffer);
			this.room.update();
			this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000);
			return false;
		}

		buffer += '</table><br />' +
			  Tools.escapeHTML(winner) + ' won the game with a final score of <strong>' + score + '</strong>, and their leaderboard score has increased by <strong>' + this.prize + '</strong> points!</div>';
		this.room.addRaw(buffer);
		this.room.update();
		this.updateLeaderboard(toId(winner));
	};

	Trivia.prototype.numberAnswers = function () {
		if (!this.correctResponders) return this.noAnswer();

		this.phase = 'intermission';

		var winner = '';
		var winnerIndex = this.correctResponders;
		var score = this.cap - 1;
		var points = ~~(5 - 4 * (this.correctResponders - 1) / (this.participants.size - 1 || 1));
		var innerBuffer = [];

		for (var data, participantsIterator = this.participants.entries(); !!(data = participantsIterator.next().value);) { // replace with for-of loop once available
			data[1].answered = false;
			if (data[1].responderIndex < 0) continue;

			var participant = Users.get(data[0]);
			participant = participant ? participant.name : data[0];
			innerBuffer.push(participant);

			var scoreData = data[1];
			scoreData.score += points;
			if (scoreData.score > score && scoreData.responderIndex < winnerIndex) {
				winner = participant;
				winnerIndex = scoreData.responderIndex;
				score = scoreData.score;
			}
			scoreData.responderIndex = -1;
		}

		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			     'Correct: ' + Tools.escapeHTML(innerBuffer.join(', ')) + '<br />' +
			     'Answer' + (this.curA.length > 1 ? 's: ' : ': ') + this.curA.join(', ') + '<br />';

		if (!winner) {
			buffer += (this.correctResponders > 1 ? 'Each of them' : 'They') + ' gained <strong>' + points + '</strong> point' + (points === 1 ? '!</div>' : 's!</div>');
			this.correctResponders = 0;
			this.room.addRaw(buffer);
			this.room.update();
			this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000);
			return false;
		}

		buffer += Tools.escapeHTML(winner) + ' won the game with a final score of <strong>' + score + '</strong>, and their leaderboard score has increased by <strong>' + this.prize + '</strong> points!</div>';
		this.room.addRaw(buffer);
		this.room.update();
		this.updateLeaderboard(toId(winner));
	};

	Trivia.prototype.updateLeaderboard = function (winnerid) {
		var leaderboard = triviaData.leaderboard;

		for (var data, participantsIterator = this.participants.entries(); !!(data = participantsIterator.next().value);) { // replace with for-of loop once available
			var scoreData = data[1];
			if (!scoreData.score) continue;

			var rank = leaderboard[data[0]];
			if (rank) {
				rank[1] += scoreData.score;
				rank[2] += scoreData.correctAnswers;
			} else {
				leaderboard[data[0]] = [0, scoreData.score, scoreData.correctAnswers];
			}
		}
		if (winnerid) leaderboard[winnerid][0] += this.prize;

		writeTriviaData();
		delete trivia[this.room.id];
	};

	Trivia.prototype.getStatus = function (output, user) {
		var buffer = 'There is a trivia game in progress, and it is in its ' + this.phase + ' phase.<br />' +
			     'Mode: ' + MODES[this.mode] + ' | Category: ' + CATEGORIES[this.category] + ' | Score cap: ' + this.cap;
		if (this.phase !== 'signup' && !output.broadcasting) {
			var scoreData = this.participants.get(user.userid);
			if (scoreData) buffer += '<br />Current score: ' + scoreData.score + ' | Correct answers: ' + scoreData.correctAnswers;
		}
		output.sendReplyBox(buffer);
	};

	Trivia.prototype.getParticipants = function (output) {
		var participantsLen = this.participants.size;
		if (!participantsLen) return output.sendReplyBox('There are no players in this trivia game.');

		var participants = [];
		var buffer = 'There ' + (participantsLen === 1 ? 'is <strong>' + participantsLen + '</strong> player' : 'are <strong>' + participantsLen + '</strong> players') + ' participating in this trivia game:<br />';
		this.participants.forEach(function (scoreData, participant) {
			var targetUser = Users.get(participant);
			participants.push(targetUser ? targetUser.name : participant);
		});
		buffer += Tools.escapeHTML(participants.join(', '));
		output.sendReplyBox(buffer);
	};

	Trivia.prototype.endGame = function (output, user) {
		if (this.phase !== 'signup') clearTimeout(this.sleep);
		this.room.addRaw('<div class="broadcast-blue">' + Tools.escapeHTML(user.name) + ' has forced the game to end.</div>');
		delete trivia[this.room.id];
	};

	return Trivia;
})();

var triviaRoom = Rooms.get('trivia');
if (triviaRoom) {
	if (triviaRoom.plugin) {
		triviaData = triviaRoom.plugin.data;
		if (!Object.isEmpty(triviaRoom.plugin.trivia)) trivia = triviaRoom.plugin.trivia;
	} else {
		triviaRoom.plugin = {
			data: triviaData,
			write: writeTriviaData,
			trivia: trivia
		};
		var questionWorkshop = Rooms.get('questionworkshop');
		if (questionWorkshop) questionWorkshop.plugin = triviaRoom.plugin;
	}
}

var commands = {
	// trivia game commands
	create: 'new',
	new: function (target, room) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room) || !target) return false;
		if (trivia[room.id]) return this.sendReply('There is already a trivia game in progress.');

		target = target.split(',');
		if (target.length !== 3) return this.sendReply('Invallid arguments specified. View /trivia help gcommands for more information.');

		var mode = toId(target[0]);
		if (!MODES[mode]) return this.sendReply('"' + target[0].trim() + '" is not a valid mode. View /trivia help ginfo for more information.');

		var category = toId(target[1]);
		if (!CATEGORIES[category]) return this.sendReply('"' + target[1].trim() + '" is not a valid category. View /trivia help ginfo for more information.');

		var cap = CAPS[toId(target[2])];
		if (!cap) return this.sendReply('"' + target[2].trim() + '" is not a valid score cap. View /trivia help ginfo for more information.');

		trivia[room.id] = new Trivia(mode, category, cap, room);
		room.addRaw('<div class="broadcast-blue"><strong>Signups for a new trivia game have begun! Enter /trivia join to join.</strong><br />' +
			    'Mode: ' + MODES[mode] + ' | Category: ' + CATEGORIES[category] + ' | Score cap: ' + cap + '</div>');
	},

	join: function (target, room, user) {
		if (room.id !== 'trivia') return false;
		var trivium = trivia[room.id];
		if (!trivium) return this.sendReply('There is no trivia game in progress.');
		trivium.addParticipant(this, user);
	},

	start: function (target, room) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room)) return false;
		var trivium = trivia[room.id];
		if (!trivium) return this.sendReply('There is no trivia game to start.');
		trivium.startGame(this);
	},

	kick: function (target, room) {
		if (room.id !== 'trivia' || !this.can('mute', null, room) || !target) return false;
		var trivium = trivia[room.id];
		if (!trivium) return this.sendReply('There is no trivia game in progress.');
		trivium.kickParticipant(this, target);
	},

	answer: function (target, room, user) {
		if (room.id !== 'trivia' || !target) return false;
		var trivium = trivia[room.id];
		if (!trivium) return this.sendReply('There is no trivia game in progress.');
		trivium.answerQuestion(this, target, user);
	},

	end: function (target, room, user) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room)) return false;
		var trivium = trivia[room.id];
		if (!trivium) return this.sendReply('There is no trivia game in progress.');
		trivium.endGame(this, user);
	},

	// question database modifying commands
	submit: 'add',
	add: function (target, room, user, connection, cmd) {
		if (room.id !== 'questionworkshop' || (cmd === 'add' && !this.can('mute', null, room)) || !target) return false;

		target = target.split('|');
		if (target.length !== 3) return this.sendReply('Invalid arguments specified. View /trivia help qcommands for more information.');

		var category = toId(target[0]);
		if (category === 'random') return false;
		if (!CATEGORIES[category]) return this.sendReply('"' + target[0].trim() + '" is not a valid category. View /trivia help ginfo for more information.');

		target[1] = target[1].trim();

		var question = Tools.escapeHTML(target[1]);
		if (!question) return this.sendReply('"' + target[1] + '" is not a valid question.');

		var answers = target[2].split(',');
		for (var i = answers.length; i--;) {
			var answer = toId(answers[i]);
			if (answer && answers.indexOf(answer) !== i) answers.splice(i, 1);
		}
		if (!answers.length) return this.sendReply('No valid answers were specified.');

		var submissions = triviaData.submissions;
		if (cmd === 'add') {
			triviaData.questions.push({category: category, question: question, answers: answers});
			writeTriviaData();
			return this.privateModCommand('(Question "' + target[1] + '" was added to the question database by ' + user.name + '.)');
		}

		var submissionIndex = -1;
		for (var i = 0, len = submissions.length; i < len; i++) {
			if (submissionIndex < 0 && submissions[i].category > category) {
				submissionIndex = i;
				break;
			}
		}

		if (submissionIndex < 0) {
			submissions.push({category: category, question: question, answers: answers});
		} else {
			submissions.splice(submissionIndex, 0, {category: category, question: question, answers: answers});
		}

		writeTriviaData();
		if (!user.can('mute', null, room)) this.sendReply('Question "' + target[1] + '" was submitted for review.');
		this.privateModCommand('(' + user.name + ' submitted question "' + target[1] + '" for review.)');
	},

	review: function (target, room) {
		if (room.id !== 'questionworkshop' || !this.can('mute', null, room)) return false;

		var submissions = triviaData.submissions;
		var submissionsLen = submissions.length;
		var buffer = '|raw|<div class="ladder"><table><tr>';
		if (!submissionsLen) {
			buffer += '<td>No questions await review.</td></tr></table></div>';
			return this.sendReply(buffer);
		}

		buffer += '<td colspan="4"><strong>' + submissionsLen + '</strong> questions await review:</td></tr>' +
			  '<tr><th>#</th><th>Category</th><th>Question</th><th>Answer(s)</th></tr>';

		for (var i = 0; i < submissionsLen; i++) {
			var entry = submissions[i];
			buffer += '<tr><td><strong>' + (i + 1) + '</strong></td><td>' + entry.category + '</td><td>' + entry.question + '</td><td>' + entry.answers.join(', ') + '</td></tr>';
		}
		buffer += '</table></div>';
		this.sendReply(buffer);
	},

	reject: 'accept',
	accept: function (target, room, user, connection, cmd) {
		if (room.id !== 'questionworkshop' || !this.can('mute', null, room) || !target) return false;

		var isAccepting = cmd === 'accept';
		var submissions = triviaData.submissions;

		if (toId(target) === 'all') {
			if (isAccepting) Array.prototype.push.apply(triviaData.questions, submissions);
			triviaData.submissions = [];

			writeTriviaData();
			return this.privateModCommand('(' + user.name + (isAccepting ? ' added ' : ' removed ') + 'all questions from the submission database.)');
		}

		if (/^\d+(?:-\d+)?(?:, ?\d+(?:-\d+)?)*$/.test(target)) {
			var indices = target.split(', ');
			var submissionsLen = submissions.length;

			for (var i = indices.length; i--;) {
				if (indices[i].indexOf('-') < 0) {
					var index = indices[i].trim() - 1;
					if (indices.indexOf(index) !== i || index < 0 || index > submissionsLen) indices.splice(i, 1);
				} else {
					var range = indices[i].split('-');
					var left = range[0].trim() - 1;
					var right = range[1] - 1; // if range[1] includes spaces, target can't be matched
					if (right < submissionsLen && left > -1) {
						do {
							if (indices.indexOf(right) < 0) indices.push(right);
						} while (right-- > left);
					}
				}
			}

			var indicesLen = indices.length;
			if (!indicesLen) return this.sendReply('"' + target.join(', ') + '" is not a valid argument. View /trivia review and /trivia help qcommands for more information.');

			indices = indices.sort(function (a, b) {
				return a - b;
			});

			if (isAccepting) {
				var accepted = [];
				for (var i = indicesLen; i--;) {
					var submission = submissions.splice(indices[i], 1)[0];
					accepted.unshift(submission);
				}
				Array.prototype.push.apply(triviaData.questions, accepted);
				writeTriviaData();
				return this.privateModCommand('(' + user.name + ' added submission numbers ' + target.join(', ') + ' to the question database.)');
			}

			for (var i = indicesLen; i--;) {
				submissions.splice(indices[i], 1);
			}
			writeTriviaData();
			this.privateModCommand('(' + user.name + ' removed submission numbers ' + target.join(', ') + ' from the submission database.)');
		}

		this.sendReply('"' + target + '" is an invalid argument. View /trivia help qcommands for more information.');
	},

	delete: function (target, room, user) {
		if (room.id !== 'questionworkshop' || !this.can('mute', null, room) || !target) return false;

		var question = Tools.escapeHTML(target).trim();
		if (!question) return this.sendReply('"' + target.trim() + '" is not a valid argument. View /trivia help qcommands for more information.');

		var questions = triviaData.questions;
		for (var i = questions.length; i--;) {
			if (questions[i].question !== question) continue;
			questions.splice(i, 1);
			writeTriviaData();
			return this.privateModCommand('(' + user.name + ' removed question "' + target.trim() + '" from the question database.)');
		}

		this.sendReply('Question "' + target.trim() + '" was not found in the question database.');
	},

	qs: function (target, room, user) {
		if (room.id !== 'questionworkshop') return false;
		if (!target) {
			if (!this.canBroadcast()) return false;

			var questions = triviaData.questions;
			var questionsLen = questions.length;
			if (!questionsLen) return this.sendReplyBox('No questions have been submitted yet.');

			var categoryTally = {animemanga: 0, geography: 0, history: 0, humanities: 0, miscellaneous: 0, music: 0, pokemon: 0, rpm: 0, science: 0, tvmovies: 0, videogames: 0};
			for (var i = questionsLen; i--;) {
				categoryTally[questions[i].category]++;
			}

			var categories = Object.keys(categoryTally);
			var buffer = '|raw|<div class="ladder"><table><tr><th>Category</th><th>Question Count</th></tr>';
			for (var i = 0; i < 11; i++) {
				var category = categories[i];
				var tally = categoryTally[category];
				buffer += '<tr><td>' + CATEGORIES[category] + '</td><td>' + tally + ' (' + (Math.round(((tally * 100) / questionsLen) * 100) / 100) + '%)</td></tr>';
			}
			buffer += '<tr><td><strong>Total</strong></td><td><strong>' + questionsLen + '</strong></td></table></div>';
			return this.sendReply(buffer);
		}

		if (!this.can('mute', null, room)) return false;

		var category = toId(target);
		if (category === 'random') return false;
		if (!CATEGORIES[category]) return this.sendReply('"' + target + '" is not a valid category. View /trivia help ginfo for more information.');

		var list = triviaData.questions.filter(function (question) {
			return question.category === category;
		});
		var listLen = list.length;
		var buffer = '|raw|<div class="ladder"><table><tr>';
		if (!listLen) {
			buffer += '<td>There are no questions in the ' + target + ' category.</td></table></div>';
			return this.sendReply(buffer);
		}

		if (user.can('declare', null, room)) {
			buffer += '<td colspan="3">There are <strong>' + listLen + '</strong> questions in the ' + target + ' category.</td></tr>' +
				  '<tr><th>#</th><th>Question</th><th>Answer(s)</th></tr>';
			for (var i = 0; i < listLen; i++) {
				var entry = list[i];
				buffer += '<tr><td><strong>' + (i + 1) + '</strong></td><td>' + entry.question + '</td><td>' + entry.answers.join(', ') + '</td><tr>';
			}
		} else {
			buffer += '<td colspan="2">There are <strong>' + listLen + '</strong> questions in the ' + target + ' category.</td></tr>' +
				  '<tr><th>#</th><th>Question</th></tr>';
			for (var i = 0; i < listLen; i++) {
				buffer += '<tr><td><strong>' + (i + 1) + '</strong></td><td>' + list[i].question + '</td></tr>';
			}
		}
		buffer += '</table></div>';
		this.sendReply(buffer);
	},

	// informational commands
	'': 'status',
	status: function (target, room, user) {
		if (room.id !== 'trivia' || !this.canBroadcast()) return false;
		var trivium = trivia[room.id];
		if (!trivium) return this.sendReplyBox('There is no trivia game in progress.');
		trivium.getStatus(this, user);
	},

	players: function (target, room) {
		if (room.id !== 'trivia' || !this.canBroadcast()) return false;
		var trivium = trivia[room.id];
		if (!trivium) return this.sendReplyBox('There is no trivia game in progress.');
		trivium.getParticipants(this);
	},

	ranking: 'rank',
	rank: function (target, room, user) {
		if (room.id !== 'trivia') return false;

		var name = '';
		var userid = '';
		if (!target) {
			name = Tools.escapeHTML(user.name);
			userid = user.userid;
		} else {
			target = this.splitTarget(target, true);
			name = this.targetUsername;
			userid = toId(name);
		}

		var score = triviaData.leaderboard[userid];
		if (!score) return this.sendReplyBox('User "' + name + '" has not played any trivia games yet.');

		this.sendReplyBox('User: <strong>' + name + '</strong><br />' +
		                  'Leaderboard score: <strong>' + score[0] + '</strong><br />' +
		                  'Total game points: <strong>' + score[1] + '</strong><br />' +
		                  'Total correct answers: <strong>' + score[2] + '</strong>');
	},

	help: function (target, room) {
		if ((room.id !== 'trivia' && room.id !== 'questionworkshop') || !this.canBroadcast()) return false;

		target = toId(target);
		switch (target) {
		case 'ginfo':
			this.sendReplyBox('Modes:<br />' +
			                  '- First: the first correct responder ains 5 points.<br />' +
			                  '- Timer: each correct responder gains up to 5 points based on how quickly they answer.<br />' +
			                  '- Number: each correct responder gains up to 5 points based on how many participants are correct<br /><br />' +
			                  'Categories:<br />' +
			                  '- Anime/Manga, Geography, History, Humanities, Miscellaneous, Music, Pokemon, RPM (Religion, Philosophy, and Myth), Science, Sports, TV/Movies, Video Games, and Random<br /><br />' +
			                  'Game lengths:<br />' +
			                  '- Short: 20 point score cap. The winner gains 3 leaderboard points.<br />' +
			                  '- Medium: 35 point score cap. The winner gains 4 leaderboard points.<br />' +
			                  '- Long: 50 point score cap. The winner gains 5 leaderboard points.');
			break;
		case 'gcommands':
			this.sendReplyBox('Game commands:<br />' +
			                  '- /trivia new OR create [mode], [category], [length] - Begin the signup phase of a new trivia game. Requires: + % @ # & ~<br />' +
			                  '- /trivia join - Join the game during the signup phase.<br />' +
			                  '- /trivia start - Begin the game once enough users have signed up. Requires: + % @ # & ~<br />' +
			                  '- /ta [answer] - Answer the current question.<br />' +
			                  '- /trivia kick [username] - Disqualify a player from the current trivia game. Requires: % @ # & ~<br />' +
			                  '- /trivia end - End a trivia game. Requires: + % @ # & ~');
			break;
		case 'qcommands':
			this.sendReplyBox('Question modifying commands:<br />' +
			                  '- /trivia submit [category] | [question] | [answer1], [answer2] ... [answern] - Add a question to the submission database for staff to review.<br />' +
			                  '- /trivia review - View the list of submitted questions. Requires: % @ # & ~<br />' +
			                  '- /trivia accept [index1], [index2], ... [indexn] OR all - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: % @ # & ~<br />' +
			                  '- /trivia reject [index1], [index2], ... [indexn] OR all - Remove questions from the submission database using their index numbers or ranges of them. Requires: % @ # & ~<br />' +
			                  '- /trivia add [category] | [question] | [answer1], [answer2], ... [answern] - Add a question to the question database. Requires: % @ # & ~<br />' +
			                  '- /trivia delete [question] - Delete a question from the trivia database. Requires: % @ # & ~<br />' +
					  '- /trivia qs - View the distribution of questions in the question database.<br />' +
			                  '- /trivia qs [category] - Return the list of questions in the specified category. Viewing their answers requires # & ~. Requires: % @ # & ~');
			break;
		case 'icommands':
			this.sendReplyBox('Informational commands:<br />' +
			                  '- /trivia status - View information about any ongoing trivia game.<br />' +
			                  '- /trivia players - View the list of the players in the current trivia game<.br />' +
			                  '- /trivia rank OR rank [username] - View the rank of the specified user. If none is given, view your own.');
			break;
		default:
			this.sendReplyBox('Help topics:<br />' +
			                  '- /trivia help ginfo - View trivia game modes, categories, and game lengths.<br />' +
			                  '- /trivia help gcommands - View commands used to play trivia games./<br />' +
			                  '- /trivia help qcommands - View commands pertaining to the question database.<br />' +
			                  '- /trivia help icommands - View informational commands');
			break;
		}
	}
};

exports.commands = {
	trivia: commands,
	ta: commands.answer
};
