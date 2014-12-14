/**
 * Trivia plugin. Only works in a room with the id 'trivia'
 * Trivia games are started with the specified mode, category, and length,
 * and end once a user's score has surpassed the score cap
 */

var fs = require('fs');

const MODES = ['timer', 'number', 'first'];
const CATEGORIES = ['animemanga', 'geography', 'history', 'humanities', 'miscellaneous', 'music', 'pokemon', 'rpm', 'science', 'sports', 'tvmovies', 'videogames', 'random'];
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

var participants = {};

var updateLeaderboard = function (winnerid, prize) {
	var leaderboard = triviaData.leaderboard;
	for (var participant in participants) {
		var score = participants[participant];
		if (!score[1]) continue;
		if (Array.isArray(leaderboard[participant])) {
			var rank = leaderboard[participant];
			rank[1] += score[0];
			rank[2] += score[1];
		} else {
			score.unshift(0);
			leaderboard[participant] = score;
		}
	}
	if (winnerid) leaderboard[winnerid][0] += prize;
	participants = {};
	writeTriviaData();
};

var Trivia = {
	phase: false,
	mode: null,
	category: null,
	cap: null,
	curQs: [],
	curA: [],
	responders: {},
	askedAt: null,
	sleep: null,
	startSignups: function (mode, category, cap) {
		this.mode = mode;
		this.category = category;
		this.cap = cap;
		this.phase = 'signup';
	},
	startGame: function (room) {
		var category = this.category;
		if (category === 'random') {
			this.curQs = triviaData.questions.randomize();
		} else {
			this.curQs = triviaData.questions.filter(function (question) {
				return question.category === category;
			}).randomize();
		}
		room.addRaw('<div class="broadcast-blue"><strong>Signups have ended, and the game has begun!</strong></div>');
		this.askQuestion(room);
	},
	answer: function (room, user, answer) {
		if (this.mode === 'first') {
			if (this.curA.indexOf(answer) < 0) return false;
			this.firstAnswer(room, user);
			return true;
		}
		var userid = user.userid;
		if (userid in this.responders) delete this.responders[userid];
		if (this.curA.indexOf(answer) < 0) return false;
		if (this.mode === 'number') {
			this.responders[userid] = true;
		} else {
			var score = 5 - Math.floor((Date.now() - this.askedAt) / (3 * 1000));
			if (score > 0) this.responders[userid] = score;
		}
	},
	endGame: function () {
		if (this.phase === 'signup') {
			participants = {};
		} else {
			clearTimeout(this.sleep);
			this.sleep = null;
			updateLeaderboard();
		}
		this.phase = false;
	},
	getStatus: function () {
		return 'There is a trivia game in progress, and it is in its ' + this.phase + ' phase.<br />' +
		       'Mode: ' + this.mode + ' | Category: ' + this.category + ' | Score cap: ' + this.cap;
	},

	askQuestion: function (room) {
		if (!this.curQs.length) {
			room.addRaw('<div class="broadcast-blue">No questions are left!<br />' +
				    '<strong>Since the game has reached a stalemate, nobody has gained any leaderboard points.</strong></div>');
			room.update();
			this.phase = false;
			clearTimeout(this.sleep);
			this.sleep = null;
			return updateLeaderboard();
		}
		var head = this.curQs.pop();
		this.curA = head.answers;
		this.phase = 'question';
		room.addRaw('<div class="broadcast-blue"><strong>Question: ' + head.question + '</strong><br />' +
			    'Category: ' + head.category + '</div>');
		room.update();
		switch (this.mode) {
		case 'first':
			this.sleep = setTimeout(this.noAnswer.bind(this), 15 * 1000, room);
			break;
		case 'timer':
			this.askedAt = Date.now();
			this.sleep = setTimeout(this.timeAnswers.bind(this), 15 * 1000, room);
			break;
		case 'number':
			this.sleep = setTimeout(this.tallyAnswers.bind(this), 10 * 1000, room);
			break;
		}
	},
	noAnswer: function (room) {
		this.phase = 'intermission';
		room.addRaw('<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			    'Correct: no one<br />' +
			    'Answer(s): ' + this.curA.join(', ') + '<br />' +
			    'Nobody gained any points.</div>');
		room.update();
		this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000, room);
	},
	firstAnswer: function (room, user) {
		clearTimeout(this.sleep);
		this.phase = 'intermission';
		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			     'Correct: ' + Tools.escapeHTML(user.name) + '<br />' +
			     'Answer(s): ' + this.curA.join(', ') + '<br />';
		var winnerid = user.userid;
		var score = participants[winnerid];
		score[0] += 5;
		score[1]++;
		if (score[0] < this.cap) {
			buffer += 'They gained <strong>5</strong> points!</div>';
			room.addRaw(buffer);
			this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000, room);
			return false;
		}

		this.sleep = null;
		this.phase = false;
		var prize = (this.cap - 5) / 15 + 2;
		buffer += 'They won the game with a final score of <strong>' + score[0] + '</strong>, and their leaderboard score has increased by <strong>' + prize + '</strong> points!</div>';
		room.addRaw(buffer);
		updateLeaderboard(winnerid, prize);
	},
	timeAnswers: function (room) {
		if (Object.isEmpty(this.responders)) return this.noAnswer(room);
		this.phase = 'intermission';
		var winnerid = null;
		var score = this.cap - 1;
		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			     'Answer(s): ' + this.curA.join(', ') + '<br /><br />' +
			     '<table width="100%" bgcolor="#9CBEDF">' +
			     '<tr bgcolor="6688AA"><th width="100px">Points Gained</th><th>Correct</th></tr>';
		var innerBuffer = [[], [], [], [], []];

		for (var responderid in this.responders) {
			var points = this.responders[responderid];
			var responder = Users.get(responderid);
			innerBuffer[points - 1].push(responder ? responder.name : responderid);

			var responderRank = participants[responderid];
			responderRank[1]++;

			if ((responderRank[0] += points) > score) {
				winnerid = responderid;
				score = responderRank[0];
			}
		}
		for (var i = 5; i--;) {
			if (!innerBuffer[i].length) continue;
			buffer += '<tr bgcolor="6688AA"><td align="center">' + (i + 1) + '</td><td>' + Tools.escapeHTML(innerBuffer[i].join(', ')) + '</td></tr>';
		}

		this.responders = {};
		if (!winnerid) {
			buffer += '</table></div>';
			room.addRaw(buffer);
			room.update();
			this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000, room);
			return false;
		}

		clearTimeout(this.sleep);
		this.sleep = null;
		this.phase = false;
		var winner = Users.get(winnerid);
		var prize = (this.cap - 5) / 15 + 2;
		buffer += '</table><br />' +
			  (winner ? Tools.escapeHTML(winner.name) : winnerid) + ' won the game with a final score of <strong>' + score + '</strong>, and their leaderboard score has increased by <strong>' + prize + '</strong> points!</div>';
		room.addRaw(buffer);
		room.update();
		updateLeaderboard(winnerid, prize);
	},
	tallyAnswers: function (room) {
		if (Object.isEmpty(this.responders)) return this.noAnswer(room);
		this.phase = 'intermission';
		var respondersLen = Object.keys(this.responders).length;
		var points = Math.round(5 - 4 * (respondersLen - 1) / (Object.keys(participants).length - 1));
		var winnerid = null;
		var score = this.cap - 1;
		var innerBuffer = [];

		for (var responderid in this.responders) {
			var responder = Users.get(responderid);
			innerBuffer.push(responder ? responder.name : responderid);

			var responderRank = participants[responderid];
			responderRank[1]++;

			if ((responderRank[0] += points) > score) {
				winnerid = responderid;
				score = responderRank[0];
			}
		}

		this.responders = {};
		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
		             'Correct: ' + Tools.escapeHTML(innerBuffer.join(', ')) + '<br />' +
		             'Answer(s): ' + this.curA.join(', ') + '<br />';
		if (!winnerid) {
			buffer += (respondersLen > 1 ? 'Each of them' : 'They') + ' gained <strong>' + points + '</strong> points!</div>';
			room.addRaw(buffer);
			room.update();
			this.sleep = setTimeout(this.askQuestion.bind(this), 30 * 1000, room);
			return false;
		}

		if (this.sleep) clearTimeout(this.sleep);
		this.sleep = null;
		this.phase = false;
		var winner = Users.get(winnerid);
		var prize = (this.cap - 15) / 15 + 2;
		buffer += (winner ? Tools.escapeHTML(winner.name) : winnerid) + ' won the game with a final score of <strong>' + score + '</strong>, and their leaderboard score has increased by <strong>' + prize + '</strong> points!</div>';
		room.addRaw(buffer);
		room.update();
		updateLeaderboard(winnerid, prize);
	}
};

exports.commands = {
	// trivia game commands
	trivianew: function (target, room) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room) || !target) return false;
		if (Trivia.phase) return this.sendReply('There is already a trivia game in progress.');
		target = target.split(',');
		if (target.length !== 3) return this.sendReply('Invalid number of arguments given. View /triviahelp gcommands for more information.');

		var mode = toId(target[0]);
		if (MODES.indexOf(mode) < 0) return this.sendReply('"' + target[0].trim() + '" is not a valid mode. View /triviahelp ginfo for more information.');
		var category = toId(target[1]);
		if (CATEGORIES.indexOf(category) < 0) return this.sendReply('"' + target[1].trim() + '" is not a valid category. View /triviahelp ginfo for more information.');
		var cap = CAPS[toId(target[2])];
		if (!cap) return this.sendReply('"' + target[2].trim() + '" is not a valid game length. View /triviahelp ginfo for more information.');

		Trivia.startSignups(mode, category, cap);
		room.addRaw('<div class="broadcast-blue"><strong>Signups for a new trivia game have begun! Enter /triviajoin to join.</strong><br />' +
		            'Mode: ' + mode + ' | Category: ' + category + ' | Score cap: ' + cap + '</div>');
	},
	triviajoin: function (target, room, user) {
		if (room.id !== 'trivia') return false;
		if (Trivia.phase !== 'signup') return this.sendReply('There is no trivia game in its signup phase.');

		var userid = user.userid;
		if (userid in participants) return this.sendReply('You have already signed up for this trivia game.');
		for (var prevName in user.prevNames) {
			if (prevName in participants) return this.sendReply('You have already signed up for this trivia game under the previous username "' + prevName + '."');
		}
		var alts = user.getAlts();
		for (var i = alts.length; i--;) {
			if (toId(alts[i]) in participants) return this.sendReply('You have already signed up for this trivia game under the alt "' + alts[i] + '."');
		}

		participants[userid] = [0, 0]; // game points, correct answers
		this.sendReply('You have signed up for the next trivia game!');
	},
	triviastart: function (target, room) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room)) return false;
		if (Trivia.phase !== 'signup') return this.sendReply('There is no trivia game in its signup phase.');
		if (Object.keys(participants).length < 3) return this.sendReply('Not enough users have signed up! There must be at least three participants before the trivia game can start.');

		Trivia.startGame(room);
	},
	triviakick: function (target, room) {
		if (room.id !== 'trivia' || !this.can('mute', null, room) || !target) return false;
		if (!Trivia.phase) return this.sendReply('There is no trivia game in progress.');
		if (Object.keys(participants).length === 3) return this.sendReply('There must be at least three participants in order for the trivia game to run. Use /triviaend instead.');

		target = toId(target);
		if (!target) return false;
		var targetUser = Users.get(target);
		if (!(target in participants)) return this.sendReply('User "' + (targetUser ? targetUser.name : target) + '" is not a participant in this trivia game.');
		if (target in Trivia.responders) delete Trivia.responders[target];
		delete participants[target];
		return this.sendReply('User "' + (targetUser ? targetUser.name : target) + '" has been disqualified from the current trivia game.');
	},
	// trivia answer
	ta: function (target, room, user) {
		if (room.id !== 'trivia' || !target) return false;
		if (Trivia.phase !== 'question') return this.sendReply('There is no question to answer.');
		var answer = toId(target);
		if (!answer) return this.sendReply('"' + target + '" is not a valid answer.');

		var userid = user.userid;
		if (!(userid in participants)) return this.sendReply('You are not a participant in this trivia game.');
		if (!Trivia.answer(room, user, answer)) this.sendReply('You have selected "' + answer + '" as your answer.');
	},
	triviaend: function (target, room, user) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room)) return false;
		Trivia.endGame();
		room.addRaw('<div class="broadcast-blue">' + Tools.escapeHTML(user.name) + ' has forced the game to end.</div>');
	},

	// question database modifying commands
	triviasubmit: 'triviaadd',
	triviaadd: function (target, room, user, connection, cmd) {
		if (room.id !== 'trivia' && room.id !== 'qstaff' || cmd === 'triviaadd' && !this.can('mute', null, room) || !target) return false;
		target = target.split('|');
		if (target.length !== 3) return this.sendReply('Invalid arguments specified. View /triviahelp qcommands for more information.');

		var category = toId(target[0]);
		if (category === 'random') return false;
		if (CATEGORIES.indexOf(category) < 0) return this.sendReply('"' + target[0].trim() + '" is not a valid category. View /triviahelp ginfo for more information.');

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
		if (cmd === 'triviaadd') {
			for (var i = submissions.length; i--;) {
				if (submissions[i].question === question) return this.sendReply('Question "' + target[1].trim() + '" has already been submitted.');
			}
			questions.push({category: category, question: question, answers: answers});
			writeTriviaData();
			this.sendReply('Question "' + target[1].trim() + '" was added to the question database.');
		} else {
			var submitted = false;
			var submissionIndex = null;
			for (var i = 0, len = submissions.length; i < len; i++) {
				if (submissions[i].question === question) return this.sendReply('Question "' + target[1].trim() + '" has already been submitted.');
				if (!submitted && submissions[i].category > category) {
					submissionIndex = i;
					submitted = true;
				}
			}
			if (submitted) {
				submissions.splice(submissionIndex, 0, {category: category, question: question, answers: answers});
			} else {
				submissions.push({category: category, question: question, answers: answers});
			}
			writeTriviaData();
			this.sendModCommand('(Question "' + target[1].trim() + '" was submitted by ' + user.name + ' for review.)');
			this.sendReply('Question "' + target[1].trim() + '" was submitted for review.');
		}
	},
	triviareview: function (target, room) {
		if (room.id !== 'trivia' && room.id !== 'qstaff' || !this.can('mute', null, room)) return false;
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
	triviareject: 'triviaaccept',
	triviaaccept: function (target, room, user, connection, cmd) {
		if (room.id !== 'trivia' && room.id !== 'qstaff' || !this.can('mute', null, room) || !target) return false;
		var isAdding = (cmd === 'triviaaccept');
		var questions = triviaData.questions;
		var submissions = triviaData.submissions;
		var submissionsLen = submissions.length;
		if (toId(target) === 'all') {
			if (isAdding) triviaData.questions = questions.concat(submissions);
			submissions.splice(0, submissionsLen);
			writeTriviaData();
			return this.sendReply('All questions ' + (isAdding ? 'added to ' : 'removed from ') + 'the submission database.');
		}
		if (/^\d+(?:-\d+)?(?:, ?\d+(?:-\d+)?)*$/.test(target)) {
			target = target.replace(/ /g, '').split(',');
			var indices = [];
			for (var i = target.length; i--;) {
				target[i] = target[i].trim();
				if (/\d+-\d+/.test(target[i])) {
					var range = target[i].split('-');
					var start = parseInt(range[0]);
					var finish = parseInt(range[1]);
					if (isNaN(start) || isNaN(finish) || !start || start >= finish || finish > submissionsLen) continue;
					start -= 1;
					while (start < finish) {
						indices.push(start++);
					}
					continue;
				}
				var index = parseInt(target[i]);
				if (!isNaN(index) && index > 0 && index <= submissionsLen) indices.push(index - 1);
			}
			var indicesLen = indices.length;
			if (!indicesLen) return this.sendReply('"' + target.join(', ') + '" is not a valid set of index numbers. View /triviareview and /triviahelp qcommands for more information.');
			indices = indices.sort(function (a, b) {
				return a - b;
			}).filter(function (entry, index) {
				return indices.indexOf(entry) === index;
			});
			if (isAdding) {
				for (var i = indicesLen; i--;) {
					var index = indices[i];
					questions.push(submissions[index]);
					submissions.splice(index, 1);
				}
				this.sendReply('Question numbers ' + target.join(', ') + ' were added to the question database.');
			} else {
				for (var i = indicesLen; i--;) {
					submissions.splice(indices[i], 1);
				}
				this.sendReply('Question numbers ' + target.join(', ') + ' were removed from the submission database.');
			}
			return writeTriviaData();
		}
		this.sendReply('"' + target + '" is an invalid argument. View /triviahelp qcommands for more information.');
	},
	triviadelete: function (target, room) {
		if (room.id !== 'trivia' && room.id !== 'qstaff' || !this.can('mute', null, room) || !target) return false;
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
	triviaquestions: 'triviaqs',
	triviaqs: function (target, room, user) {
		if (room.id !== 'trivia' && room.id !== 'qstaff' || !this.can('mute', null, room)) return false;
		if (!target) return this.sendReply('/triviaqs requires a specified category. View /triviahelp gamehelp for more information.');

		var category = toId(target);
		if (category === 'random') return false;
		if (CATEGORIES.indexOf(category) < 0) return this.sendReply('"' + target + '" is not a valid option for /triviaqs. View /triviahelp ginfo for more information.');
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

	//informational commands
	triviaplayers: function (target, room) {
		if (room.id !== 'trivia' || !this.canBroadcast()) return false;
		if (!Trivia.phase) return this.sendReplyBox('There is no trivia game in progress.');
		var players = Object.keys(participants);
		var playersLen = players.length;
		var buffer = '<strong>' + playersLen + '</strong> players are participating in this trivia game:<br />';
		if (!playersLen) return this.sendReplyBox('There are no players in this trivia game.');
		for (var i = 0; i < playersLen; i++) {
			var player = Users.getExact(players[i]);
			if (player) players[i] = player.name;
		}
		buffer += Tools.escapeHTML(players.join(', '));
		this.sendReplyBox(buffer);
	},
	triviarank: function (target, room, user) {
		if (room.id !== 'trivia') return false;
		var userid = null;
		var username = null;
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
		if (!Array.isArray(score)) {
			delete triviaData.leaderboard[userid];
			writeTriviaData();
			return this.sendReplyBox('User "' + username + '" has not played any trivia games yet.');
		}
		this.sendReplyBox('User: <strong>' + username + '</strong><br />' +
		                  'Leaderboard score: <strong>' + score[0] + '</strong><br />' +
		                  'Total game points: <strong>' + score[1] + '</strong><br />' +
		                  'Total correct answers: <strong>' + score[2] + '</strong>');
	},
	triviastatus: function (target, room, user) {
		if (room.id !== 'trivia' || !this.canBroadcast()) return false;
		if (!Trivia.phase) return this.sendReplyBox('There is no trivia game in progress.');

		var buffer = Trivia.getStatus();
		if (!this.broadcasting) {
			var score = participants[user.userid];
			if (score) buffer += '<br />Current score: ' + score[0] + ' | Correct answers: ' + score[1];
		}
		this.sendReplyBox(buffer);
	},
	triviahelp: function (target, room) {
		if (room.id !== 'trivia' && room.id !== 'qstaff' || !this.canBroadcast()) return false;
		target = toId(target);
		switch (target) {
		case 'ginfo':
			this.sendReplyBox('<strong>Modes:</strong><br />' +
			                  '- First: the first to answer within 15 seconds gets 5 points<br />' +
			                  '- Timer: all who answer correctly within 15 seconds gets up to 5 points based on how quickly they answered<br />' +
			                  '- Number: all who answer correctly within 10 seconds get up to 5 points based on how many of them answered correctly compared to the total number of players<br />' +
			                  '<strong>Categories:</strong><br />' +
			                  '- Anime/Manga, Geography, History, Humanities, Miscellaneous, Music, Pokemon, RPM (Religion, Philosophy, and Myth), Science, Sports, TV/Movies, Video Games, and Random<br />' +
			                  '<strong>Lengths:</strong><br />' +
			                  '- Short: whoever surpasses 20 points with the highest score wins the game and gains 3 points on the trivia leaderboard<br />' +
			                  '- Medium: whoever surpasses 35 points with the highest score wins the game and gains 4 points on the trivia leaderboard<br />' +
			                  '- Long: whoever surpasses 50 points with the highest score wins the game and gains 5 points on the trivia leaderboard');
			break;
		case 'gcommands':
			this.sendReplyBox('<strong>Game commands:</strong><br />' +
			                  '- /trivianew mode, category, length - begins the signup phase of a new trivia game. Requires: + % @ # & ~<br />' +
			                  '- /triviajoin - enters you in the list of players during the signup phase<br />' +
			                  '- /triviastart - begins the game once enough users have signed up. Requires: + % @ # & ~<br />' +
			                  '- /ta - answers the current question<br />' +
			                  '- /triviakick - disqualifies a player from the current trivia game. Requires: % @ # & ~<br />' +
			                  '- /triviaend - forces a trivia game to end early. Requires: + % @ # & ~');
			break;
		case 'qcommands':
			this.sendReplyBox('<strong>Question modifying commands:</strong><br />' +
			                  '- /triviaadd category | question | answer1, answer2, ... answern - adds a question to the question database. Requires: % @ # & ~<br />' +
			                  '- /triviadelete question - deletes a question from the trivia database. Requires: % @ # & ~<br />' +
			                  '- /triviaqs category - returns the list of questions in the specified category. Viewing their answers requires # & ~. Requires: % @ # & ~<br />' +
					  '<strong>Question submission commands</strong><br />' +
			                  '- /triviasubmit category | question | answer1, answer2 ... answern - adds a question to the submission list for staff to review before adding or rejecting it<br />' +
			                  '- /triviareview - returns a list of all the questions on the submission list. Requires: % @ # & ~<br />' +
			                  '- /triviaaccept index1, index2, ... indexn OR all - adds the specified question(s) to the question database. Requires: % @ # & ~<br />' +
			                  '- /triviareject index1, index2, ... indexn OR all - removes the specified question(s) from the submission list. Requires: % @ # & ~');
			break;
		case 'icommands':
			this.sendReplyBox('<strong>Informational commands:</strong><br />' +
			                  '- /triviastatus - returns the status of the trivia game, including its phase, mode, category, score cap, current question, as well as your current score and number of correct answers<br />' +
			                  '- /triviaplayers - returns a list of the players in the current trivia game<br />' +
			                  '- /triviarank - returns your trivia leaderboard score, total points earned in trivia games, and total correct answers<br />' +
			                  '- /triviahelp category - you\'re looking at it right now');
			break;
		default:
			this.sendReplyBox('<strong>/triviahelp topics:</strong><br />' +
			                  '- /triviahelp ginfo - information about trivia game modes, categories, and lengths<br />' +
			                  '- /triviahelp gcommands - information about commands used to participate in trivia games<br />' +
			                  '- /triviahelp qcommands - information about commands used for the question submission system<br />' +
			                  '- /triviahelp icommands - information about informational commands, such as this one');
			break;
		}
	}
};
