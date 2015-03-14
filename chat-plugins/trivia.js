/**
 * Trivia plugin. Only works in a room with the id 'trivia'
 * Trivia games are started with the specified mode, category, and length,
 * and end once a user's score has surpassed the score cap
 */

var fs = require('fs');

const MODES = {first: 1, timer: 1, number: 1};
const CATEGORIES = {animemanga: 1, geography: 1, history: 1, humanities: 1, miscellaneous: 1, music: 1, pokemon: 1, rpm: 1, science: 1, sports: 1, tvmovies: 1, videogames: 1, random: 1};
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
		this.participants = {};
		this.curQs = [];
		this.curA = [];
		this.sleep = null;

		switch (mode) {
		case 'timer':
			this.askedAt = 0;
			/* fall through */
		case 'number':
			this.responders = {};
			break;
		}
	}

	// trivia question/answer loop methods
	Trivia.prototype.askQuestion = function () {
		if (!this.curQs.length) {
			this.sleep = null;

			this.room.addRaw('<div class="broadcast-blue">No questions are left!<br />' +
			                 '<strong>Since the game has reached a stalemate, nobody has gained any leaderboard points.</strong></div>');
			this.room.update();
			return this.updateLeaderboard();
		}

		var head = this.curQs.pop();
		this.curA = head.answers;
		this.phase = 'question';
		this.room.addRaw('<div class="broadcast-blue"><strong>Question: ' + head.question + '</strong><br />' +
		                 'Category: ' + head.category + '</div>');
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
	Trivia.prototype.noAnswer = function () {
		this.phase = 'intermission';
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
		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			     'Correct: ' + Tools.escapeHTML(user.name) + '<br />' +
			     'Answer' + (this.curA.length > 1 ? 's: ' : ': ') + this.curA.join(', ') + '<br />';
		var winnerid = user.userid;
		var score = this.participants[winnerid];
		score[0] += 5;
		score[1]++;

		if (score[0] < this.cap) {
			buffer += 'They gained <strong>5</strong> points!</div>';
			this.room.addRaw(buffer);
			this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000);
			return false;
		}

		this.sleep = null;
		buffer += 'They won the game with a final score of <strong>' + score[0] + '</strong>, and their leaderboard score has increased by <strong>' + this.prize + '</strong> points!</div>';
		this.room.addRaw(buffer);
		this.updateLeaderboard(winnerid);
	};
	Trivia.prototype.timerAnswers = function () {
		if (Object.isEmpty(this.responders)) return this.noAnswer();

		this.phase = 'intermission';
		var winnerid = '';
		var score = this.cap - 1;
		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			     'Answer' + (this.curA.length > 1 ? 's: ' : ': ') + this.curA.join(', ') + '<br /><br />' +
			     '<table width="100%" bgcolor="#9CBEDF">' +
			     '<tr bgcolor="#6688AA"><th width="100px">Points Gained</th><th>Correct</th></tr>';
		var innerBuffer = {5:[], 4:[], 3:[], 2:[], 1:[]};

		for (var responderid in this.responders) {
			var points = this.responders[responderid];
			var responder = Users.get(responderid);
			innerBuffer[points].push(responder ? responder.name : responderid);

			var responderRank = this.participants[responderid];
			responderRank[1]++;

			if ((responderRank[0] += points) > score) {
				winnerid = responderid;
				score = responderRank[0];
			}
		}

		for (var i = 6; --i;) {
			if (!innerBuffer[i].length) continue;
			buffer += '<tr bgcolor="#6688AA"><td align="center">' + i + '</td><td>' + Tools.escapeHTML(innerBuffer[i].join(', ')) + '</td></tr>';
		}

		this.responders = {};

		if (!winnerid) {
			buffer += '</table></div>';
			this.room.addRaw(buffer);
			this.room.update();
			this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000);
			return false;
		}

		this.sleep = null;
		var winner = Users.get(winnerid);
		buffer += '</table><br />' +
			  (winner ? Tools.escapeHTML(winner.name) : winnerid) + ' won the game with a final score of <strong>' + score + '</strong>, and their leaderboard score has increased by <strong>' + this.prize + '</strong> points!</div>';
		this.room.addRaw(buffer);
		this.room.update();
		this.updateLeaderboard(winnerid);
	};
	Trivia.prototype.numberAnswers = function () {
		if (Object.isEmpty(this.responders)) return this.noAnswer();

		this.phase = 'intermission';
		var respondersLen = Object.keys(this.responders).length;
		var points = ~~(5 - 4 * (respondersLen - 1) / (Object.keys(this.participants).length - 1 || 1));
		var winnerid = '';
		var score = this.cap - 1;
		var innerBuffer = [];

		for (var responderid in this.responders) {
			var responder = Users.get(responderid);
			innerBuffer.push(responder ? responder.name : responder);

			var responderRank = this.participants[responderid];
			responderRank[1]++;

			if ((responderRank[0] += points) > score) {
				winnerid = responderid;
				score = responderRank[0];
			}
		}

		this.responders = {};
		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			     'Correct: ' + Tools.escapeHTML(innerBuffer.join(', ')) + '<br />' +
			     'Answer' + (this.curA.length > 1 ? 's: ' : ': ') + this.curA.join(', ') + '<br />';

		if (!winnerid) {
			buffer += (respondersLen > 1 ? 'Each of them' : 'They') + ' gained <strong>' + points + '</strong> points!</div>';
			this.room.addRaw(buffer);
			this.room.update();
			this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000);
			return false;
		}

		this.sleep = null;
		var winner = Users.get(winnerid);
		buffer += (winner ? Tools.escapeHTML(winner.name) : winnerid) + ' won the game with a final score of <strong>' + score + '</strong>, and their leaderboard score has increased by <strong>' + this.prize + '</strong> points!</div>';
		this.room.addRaw(buffer);
		this.room.update();
		this.updateLeaderboard(winnerid);
	};
	Trivia.prototype.updateLeaderboard = function (winnerid) {
		var leaderboard = triviaData.leaderboard;

		for (var participant in this.participants) {
			var score = this.participants[participant];
			if (!score[1]) continue;
			var rank = leaderboard[participant];
			if (rank) {
				rank[1] += score[0];
				rank[2] += score[1];
			} else {
				score.unshift(0);
				leaderboard[participant] = score;
			}
		}
		if (winnerid) leaderboard[winnerid][0] += this.prize;
		writeTriviaData();

		delete trivia[this.room.id];
	};

	// methods used by the trivia commands
	Trivia.prototype.getStatus = function (user, output) {
		var buffer = 'There is a trivia game in progress, and it is in its ' + this.phase + ' phase.<br />' +
			     'Mode: ' + this.mode + ' | Category: ' + this.category + ' | Score cap: ' + this.cap;
		if (this.phase !== 'signup' && !output.broadcasting) {
			var score = this.participants[user.userid];
			if (score) buffer += '<br />Current score: ' + score[0] + ' | Correct answers: ' + score[1];
		}
		return output.sendReplyBox(buffer);
	};
	Trivia.prototype.getParticipants = function (output) {
		var players = Object.keys(this.participants);
		var playersLen = players.length;
		if (!playersLen) return output.sendReplyBox('There are no players in this trivia game.');

		var buffer = 'There ' + (playersLen === 1 ? 'is <strong>' + playersLen + '</strong> player' : 'are <strong>' + playersLen + '</strong> players') + ' participating in this trivia game:<br />';
		for (var i = 0; i < playersLen; i++) {
			var player = Users.get(players[i]);
			if (player) players[i] = player.name;
		}
		buffer += Tools.escapeHTML(players.join(', '));
		output.sendReplyBox(buffer);
	};
	Trivia.prototype.addParticipant = function (user, output) {
		if (this.phase !== 'signup') return output.sendReply('There is no trivia game in its signup phase.');

		var userid = user.userid;
		if (this.participants[userid]) return output.sendReply('You have already signed up for this trivia game.');

		for (var prevName in user.prevNames) {
			if (this.participants[prevName]) return output.sendReply('You have already signed up for this trivia game under the username "' + user.prevNames[prevName] + '."');
		}

		this.participants[userid] = [0, 0];
		output.sendReply('You have signed up for the next trivia game!');
	};
	Trivia.prototype.kickParticipant = function (target, output) {
		if (Object.keys(this.participants).length < 3) return output.sendReply('The trivia game requires at least three participants in order to run.');

		var userid = toId(target);
		if (!userid) return false;

		var targetUser = Users.get(userid);
		if (!this.participants[userid]) return output.sendReply('User "' + (targetUser ? targetUser.name : userid) + '" is not a participant in this trivia game.');

		if (this.mode !== 'first' && this.responders[userid]) delete this.responders[userid];
		delete this.participants[userid];
		output.sendReply('User "' + (targetUser ? targetUser.name : userid) + '" has been disqualified from the trivia game.');
	};
	Trivia.prototype.startGame = function (output) {
		if (this.phase !== 'signup') return output.sendReply('There is no trivia game in its signup phase.');
		//if (Object.keys(this.participants).length < 3) return output.sendReply('Not enough users have signed up yet! Trivia games require at least three participants to run.');

		if (this.category === 'random') {
			this.curQs = triviaData.questions.randomize();
		} else {
			var category = this.category;
			this.curQs = triviaData.questions.filter(function (question) {
				return question.category === category;
			}).randomize();
		}

		this.room.addRaw('<div class="broadcast-blue">Signups have ended and the game has begun!');
		this.askQuestion();
	};
	Trivia.prototype.answerQuestion = function (target, user, output) {
		if (this.phase !== 'question') return output.sendReply('There is no question to answer.');

		var userid = user.userid;
		if (!this.participants[userid]) return output.sendReply('You are not a participant in this trivia game.');

		var answer = toId(target);
		if (!answer) return output.sendReply('"' + target.trim() + '" is not a valid answer.');

		if (this.mode === 'first') {
			if (this.curA.indexOf(answer) < 0) return output.sendReply('You have selected "' + target.trim() + '" as your answer.');
			return this.firstAnswer(user);
		}

		if (this.responders[userid]) delete this.responders[userid];
		if (this.curA.indexOf(answer) < 0) return output.sendReply('You have selected "' + target.trim() + '" as your answer.');
		if (this.mode === 'timer') {
			var points = 5 - ~~((Date.now() - this.askedAt) / (3 * 1000));
			if (points > 0) this.responders[userid] = points;
		} else {
			this.responders[userid] = true;
		}

		output.sendReply('You have selected "' + target.trim() + '" as your answer.');
	};
	Trivia.prototype.endGame = function (user, output) {
		if (this.phase !== 'signup') {
			clearTimeout(this.sleep);
			this.sleep = null;
		}

		this.room.addRaw('<div class="broadcast-blue">' + Tools.escapeHTML(user.name) + ' has forced the game to end.</div>');
		delete trivia[this.room.id];
	};

	return Trivia;
})();

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
			    'Mode: ' + mode + ' | Category: ' + category + ' | Score cap: ' + cap + '</div>');
	},
	join: function (target, room, user) {
		if (room.id !== 'trivia') return false;
		var trivium = trivia[room.id];
		if (!trivium) return this.sendReply('There is no trivia game in progress.');
		trivium.addParticipant(user, this);
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
		trivium.kickParticipant(target, this);
	},
	answer: function (target, room, user) {
		if (room.id !== 'trivia' || !target) return false;
		var trivium = trivia[room.id];
		if (!trivium) return this.sendReply('There is no trivia game in progress.');
		trivium.answerQuestion(target, user, this);
	},
	end: function (target, room, user) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room)) return false;
		var trivium = trivia[room.id];
		if (!trivium) return this.sendReply('There is no trivia game in progress.');
		trivium.endGame(user, this);
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

		var question = Tools.escapeHTML(target[1]).trim();
		if (!question) return this.sendReply('"' + target[1].trim() + '" is not a valid question.');

		var questions = triviaData.questions;
		for (var i = questions.length; i--;) {
			if (questions[i].question === question) return this.sendReply('Question "' + target[1].trim() + '" is already present in the question database.');
		}
		var temp = target[2].split(',');
		var answers = [];
		for (var i = 0, len = temp.length; i < len; i++) {
			var answer = toId(temp[i]);
			if (!answer) continue;
			if (answers.indexOf(answer) < 0) answers.push(answer);
		}
		if (!answers.length) return this.sendReply('No valid answers were specified.');

		var submissions = triviaData.submissions;
		if (cmd === 'add') {
			for (var i = submissions.length; i--;) {
				if (submissions[i].question === question) return this.sendReply('Question "' + target[1].trim() + '" has already been submitted.');
			}

			questions.push({category: category, question: question, answers: answers});
			writeTriviaData();
			this.sendReply('Question "' + target[1].trim() + '" was added to the question database.');
		} else {
			var submissionIndex = -1;
			for (var i = 0, len = submissions.length; i < len; i++) {
				if (submissions[i].question === question) return this.sendReply('Question "' + target[1].trim() + '" has already been submitted.');
				if (submissionIndex < 0 && submissions[i].category > category) submissionIndex = i;
			}

			if (submissionIndex < 0) {
				submissions.push({category: category, question: question, answers: answers});
			} else {
				submissions.splice(submissionIndex, 0, {category: category, question: question, answers: answers});
			}

			writeTriviaData();
			this.sendModCommand('(Question "' + target[1].trim() + '" was submitted by ' + user.name + ' for review.)');
			this.sendReply('Question "' + target[1].trim() + '" was submitted for review.');
		}
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
			return this.sendReply('All questions ' + (isAccepting ? 'added to ' : 'removed from ') + 'the submission database.');
		}

		if (/^\d+(?:-\d+)?(?:, ?\d+(?:-\d+)?)*$/.test(target)) {
			target = target.split(',');
			var indices = [];
			var submissionsLen = submissions.length;

			for (var i = target.length; i--;) {
				if (target[i].indexOf('-') < 0) {
					var index = target[i].trim() - 1;
					if (indices.indexOf(index) < 0 && index > -1 && index < submissionsLen) indices.push(index);
				} else {
					var range = target[i].split('-');
					var finish = range[0].trim() - 1;
					var start = range[1] - 1; // if range[1] includes spaces, target can't be matched
					if (start < submissionsLen && finish > -1) {
						do {
							if (indices.indexOf(start) < 0) indices.push(start);
						} while (start-- > finish);
					}
				}
			}

			var indicesLen = indices.length;
			if (!indicesLen) return this.sendReply('"' + target.join(', ') + '" is not a valid set of index numbers. View /trivia review and /trivia help qcommands for more information.');

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

				this.sendReply('Question numbers ' + target.join(', ') + ' were added to the question database.');
			} else {
				for (var i = indicesLen; i--;) {
					submissions.splice(indices[i], 1);
				}

				this.sendReply('Question numbers ' + target.join(', ') + ' were removed from the submission database.');
			}

			return writeTriviaData();
		}

		this.sendReply('"' + target + '" is an invalid argument. View /trivia help qcommands for more information.');
	},
	delete: function (target, room) {
		if (room.id !== 'questionworkshop' || !this.can('mute', null, room) || !target) return false;

		var question = Tools.escapeHTML(target).trim();
		if (!question) return this.sendReply('"' + target.trim() + '" is not a valid question.');

		var questions = triviaData.questions;
		for (var i = questions.length; i--;) {
			if (questions[i].question !== question) continue;
			questions.splice(i, 1);
			writeTriviaData();
			return this.sendReply('Question "' + target.trim() + '" was removed from the question database.');
		}

		this.sendReply('Question "' + target.trim() + '" was not found in the question database.');
	},
	qs: function (target, room, user) {
		if (room.id !== 'questionworkshop' || !this.can('mute', null, room)) return false;
		if (!target) return this.sendReply('/trivia qs requires a specified category. View /trivia help gamehelp for more information.');

		var category = toId(target);
		if (category === 'random') return false;
		if (!CATEGORIES[category]) return this.sendReply('"' + target + '" is not a valid option for /trivia qs. View /trivia help ginfo for more information.');

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
		trivium.getStatus(user, this);
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

		var userid = '';
		var username = '';
		if (!target) {
			userid = user.userid;
			username = Tools.escapeHTML(user.name);
		} else {
			userid = toId(target);
			var targetUser = Users.getExact(userid);
			username = Tools.escapeHTML(targetUser ? targetUser.name : target);
		}

		var score = triviaData.leaderboard[userid];
		if (!score) return this.sendReplyBox('User "' + username + '" has not played any trivia games yet.');

		this.sendReplyBox('User: <strong>' + username + '</strong><br />' +
		                  'Leaderboard score: <strong>' + score[0] + '</strong><br />' +
		                  'Total game points: <strong>' + score[1] + '</strong><br />' +
		                  'Total correct answers: <strong>' + score[2] + '</strong>');
	},
	help: function (target, room) {
		if (!this.canBroadcast()) return false;

		target = toId(target);
		if (room.id === 'trivia') {
			if (target === 'qcommands') target = '';
		} else {
			if (room.id !== 'questionworkshop') return false;
		}

		switch (target) {
		case 'ginfo':
			this.sendReplyBox('<strong>Modes:</strong><br />' +
			                  '- First: the first to answer within 15 seconds gets 5 points<br />' +
			                  '- Timer: all who answer correctly within 15 seconds gets up to 5 points based on how quickly they answered<br />' +
			                  '- Number: all who answer correctly within 15 seconds get up to 5 points based on how many of them answered correctly compared to the total number of players<br />' +
			                  '<strong>Categories:</strong><br />' +
			                  '- Anime/Manga, Geography, History, Humanities, Miscellaneous, Music, Pokemon, RPM (Religion, Philosophy, and Myth), Science, Sports, TV/Movies, Video Games, and Random<br />' +
			                  '<strong>Lengths:</strong><br />' +
			                  '- Short: whoever surpasses 20 points with the highest score wins the game and gains 3 points on the trivia leaderboard<br />' +
			                  '- Medium: whoever surpasses 35 points with the highest score wins the game and gains 4 points on the trivia leaderboard<br />' +
			                  '- Long: whoever surpasses 50 points with the highest score wins the game and gains 5 points on the trivia leaderboard');
			break;
		case 'gcommands':
			this.sendReplyBox('<strong>Game commands:</strong><br />' +
			                  '- /trivia new mode, category, length - begins the signup phase of a new trivia game. Requires: + % @ # & ~<br />' +
			                  '- /trivia join - enters you in the list of players during the signup phase<br />' +
			                  '- /trivia start - begins the game once enough users have signed up. Requires: + % @ # & ~<br />' +
			                  '- /ta - answers the current question<br />' +
			                  '- /trivia kick - disqualifies a player from the current trivia game. Requires: % @ # & ~<br />' +
			                  '- /trivia end - forces a trivia game to end early. Requires: + % @ # & ~');
			break;
		case 'qcommands':
			this.sendReplyBox('<strong>Question modifying commands:</strong><br />' +
			                  '- /trivia add category | question | answer1, answer2, ... answern - adds a question to the question database. Requires: % @ # & ~<br />' +
			                  '- /trivia delete question - deletes a question from the trivia database. Requires: % @ # & ~<br />' +
			                  '- /trivia qs category - returns the list of questions in the specified category. Viewing their answers requires # & ~. Requires: % @ # & ~<br />' +
					  '<strong>Question submission commands</strong><br />' +
			                  '- /trivia submit category | question | answer1, answer2 ... answern - adds a question to the submission list for staff to review before adding or rejecting it<br />' +
			                  '- /trivia review - returns a list of all the questions on the submission list. Requires: % @ # & ~<br />' +
			                  '- /trivia accept index1, index2, ... indexn OR all - adds the specified question(s) to the question database. Requires: % @ # & ~<br />' +
			                  '- /trivia reject index1, index2, ... indexn OR all - removes the specified question(s) from the submission list. Requires: % @ # & ~');
			break;
		case 'icommands':
			this.sendReplyBox('<strong>Informational commands:</strong><br />' +
			                  '- /trivia status - returns the status of the trivia game, including its phase, mode, category, score cap, current question, as well as your current score and number of correct answers<br />' +
			                  '- /trivia players - returns a list of the players in the current trivia game<br />' +
			                  '- /trivia rank - returns your trivia leaderboard score, total points earned in trivia games, and total correct answers<br />' +
			                  '- /trivia help category - you\'re looking at it right now');
			break;
		default:
			this.sendReplyBox('<strong>/triviahelp topics:</strong><br />' +
			                  '- /trivia help ginfo - information about trivia game modes, categories, and lengths<br />' +
			                  '- /trivia help gcommands - information about commands used to participate in trivia games<br />' +
			                  (room.id === 'trivia' ? '' : '- /trivia help qcommands - information about commands used for the question submission system<br />') +
			                  '- /trivia help icommands - information about informational commands, such as this one');
			break;
		}
	}
};

// Rooms should never be undefined, since the require for rooms.js, during
// which the rooms list is loaded from disk once rooms.global is constructed,
// is executed before the require for this plugin in command-parser.js
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

exports.commands = {
	trivia: commands,
	ta: commands.answer
};
