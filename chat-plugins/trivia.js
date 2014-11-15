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

var Trivia = (function () {
	function Trivia() {
		this.phase = '';
		this.mode = '';
		this.category = '';
		this.cap = 0;
		this.prize = 0;

		this.participants = {};
		this.responders = [];
		this.askedAt = '';
		this.askedBy = '';

		this.curQs = [];
		this.curQ = '';
		this.curA = [];
		this.sleep = {};
	}

	Trivia.prototype.askQuestion = function (room) {
		if (!this.curQs.length) {
			room.addRaw('<div class="broadcast-blue">No questions are left!<br />' +
				    '<strong>Since the game has reached a stalemate, nobody has gained any leaderboard points.</strong></div>');
			room.update();
			return this.updateLeaderboard();
		}
		var head = this.curQs.pop();
		this.curQ = head.question;
		this.curA = head.answers;
		this.phase = 'question';
		if (this.mode === 'timer') this.askedAt = Date.now();
		room.addRaw('<div class="broadcast-blue"><strong>Question: ' + this.curQ + '</strong><br />' +
			    'Category: ' + head.category + '</div>');
		room.update();
		var self = this;
		if (this.mode === 'number') {
			this.sleep = setTimeout(function () { self.tallyAnswers(room); }, 10 * 1000);
		} else {
			this.sleep = setTimeout(function () { self.noAnswer(room); }, 15 * 1000);
		}
	};

	Trivia.prototype.noAnswer = function (room) {
		this.phase = 'intermission';
		room.addRaw('<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			    'Correct: no one<br />' +
			    'Answer(s): ' + this.curA.join(', ') + '<br />' +
			    'Nobody gained any points.</div>');
		room.update();
		var self = this;
		this.sleep = setTimeout(function () { self.askQuestion(room); }, 30 * 1000);
	};

	Trivia.prototype.tallyAnswers = function (room) {
		var respondersLen = this.responders.length;
		if (!respondersLen) return this.noAnswer(room);
		this.phase = 'intermission';
		var points = Math.round(5 - 4 * (respondersLen - 1) / (Object.keys(this.participants).length - 1));
		var winner = '';
		var score = 0;
		var innerBuffer = [];

		for (var i = 0; i < respondersLen; i++) {
			var responder = this.responders[i];
			var responderRank = this.participants[responder];
			var responderScore = responderRank[0] += points;
			responderRank[1]++;
			if (responderScore > (this.cap && score)) winner = responder;

			var targetUser = Users.getExact(responder);
			innerBuffer.push(targetUser ? targetUser.name : responder);
		}

		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
			     'Correct: ' + Tools.escapeHTML(innerBuffer.join(', ')) + '<br />' +
		             'Answer(s): ' + this.curA.join(', ') + '<br />';
		if (!winner) {
			this.responders = [];
			buffer += (respondersLen > 1 ? 'Each of them' : 'They') + ' gained <strong>' + points + '</strong> points!</div>';
			room.addRaw(buffer);
			room.update();
			var self = this;
			this.sleep = setTimeout(function () { self.askQuestion(room); }, 30 * 1000);
			return false;
		}
		var targetUser = Users.getExact(winner);
		buffer += (targetUser ? Tools.escapeHTML(targetUser.name) : winner) + ' won the game with a total of <strong>' + score + '</strong> points, and their leaderboard score has increased by <strong>' + this.prize + '</strong>!</div>';
		room.addRaw(buffer);
		room.update();
		this.updateLeaderboard(winner);
	};

	Trivia.prototype.updateLeaderboard = function (winner) {
		this.phase = '';

		if (this.mode === 'custom') {
			if (!winner) return false;
			var leaderboard = triviaData.leaderboard;
			var score = leaderboard[winner] ? leaderboard[winner] : [];
			if (score) {
				score[0]++;
				score[1]++;
			} else {
				leaderboard[winner] = [1, 0, 1];
			}
			return writeTriviaData();
		}

		var leaderboard = triviaData.leaderboard;
		var players = Object.keys(this.participants);
		if (winner) leaderboard[winner][0] += this.prize;
		for (var i = players.length; i--;) {
			var player = players[i];
			var score = this.participants[player];
			if (!score[1]) continue;
			var rank = leaderboard[player];
			if (player in leaderboard) {
				rank[1] += score[0];
				rank[2] += score[1];
			} else {
				leaderboard[player] = [0, score[0], score[1]];
			}
		}
		if (this.mode === 'number') this.responders = [];
		this.participants = {};
		writeTriviaData();
	};

	return Trivia;
})();
var trivia = new Trivia();

exports.commands = {
	// trivia game commands
	trivianew: function (target, room, user) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room) || !target) return false;
		if (trivia.phase) return this.sendReply('There is already a trivia game in progress.');
		target = target.split(',');
		if (target.length !== 3) return this.sendReply('Invalid number of arguments given. View /triviahelp gcommands for more information.');

		var newMode = toId(target[0]);
		if (MODES.indexOf(newMode) < 0) return this.sendReply('"' + target[0].trim() + '" is not a valid mode. View /triviahelp ginfo for more information.');
		var newCategory = toId(target[1]);
		if (CATEGORIES.indexOf(newCategory) < 0) return this.sendReply('"' + target[1].trim() + '" is not a valid category. View /triviahelp ginfo for more information.');
		var newCap = CAPS[toId(target[2])];
		if (!newCap) return this.sendReply('"' + target[2].trim() + '" is not a valid game length. View /triviahelp ginfo for more information.');

		trivia.mode = newMode;
		trivia.category = newCategory;
		trivia.cap = newCap;
		trivia.phase = 'signup';
		room.addRaw('<div class="broadcast-blue"><strong>Signups for a new trivia game have begun! Enter /triviajoin to join.</strong><br />' +
		            'Mode: ' + newMode + ' | Category: ' + newCategory + ' | Score cap: ' + newCap + '</div>');
		room.update();
	},
	triviajoin: function (target, room, user) {
		if (room.id !== 'trivia') return false;
		if (!trivia.phase) return this.sendReply('There is no trivia game to join.');
		if (trivia.phase !== 'signup') return this.sendReply('Trivia games can only be joined during their signup phase.');

		var userid = user.userid;
		var participants = trivia.participants;
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
	triviastart: function (target, room, user) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room)) return false;
		if (!trivia.phase) return this.sendReply('There is no trivia game to start.');
		if (trivia.phase !== 'signup') return this.sendReply('There is already a trivia game in progress.');
		if (Object.keys(trivia.participants).length < 3) return this.sendReply('Not enough users have signed up! There must be at least three participants before the trivia game can start.');

		trivia.prize = (trivia.cap - 5) / 15 + 2;
		if (trivia.category === 'random') {
			trivia.curQs = triviaData.questions.randomize();
		} else {
			trivia.curQs = triviaData.questions.filter(function (question) { return question.category === trivia.category; }).randomize();
		}
		room.addRaw('<div class="broadcast-blue"><strong>Signups have ended, and the game has begun!</strong></div>');
		room.update();
		trivia.askQuestion(room);
	},
	triviakick: function (target, room, user) {
		if (room.id !== 'trivia' || !this.can('mute', null, room) || !target) return false;
		if (!trivia.phase) return this.sendReply('There is no trivia game in progress.');
		if (trivia.phase === 'signup') return this.sendReply('Please wait until the game starts before disqualifying anyone.');
		if (trivia.mode === 'custom') return this.sendReply('Custom trivia games have no list of participants.');

		var participants = trivia.participants;
		if (Object.keys(participants).length === 3) return this.sendReply('There must be at least three participants in order for the trivia game to run. Use /triviaend instead.');

		target = toId(target);
		if (!target) return false;
		var targetUser = Users.getExact(target);
		if (!participants[target]) return this.sendReply('User "' + (targetUser ? targetUser.name : target) + '" is not a participant in this trivia game.');
		var responders = trivia.responders;
		if (trivia.mode === 'number' && responders.indexOf(target) > -1) responders.splice(responders.indexOf(target), 1);
		delete participants[target];
		return this.sendReply('User "' + (targetUser ? targetUser.name : target) + '" has been disqualified from the current trivia game.');
	},
	// trivia answer
	ta: function (target, room, user) {
		if (room.id !== 'trivia' || !target) return false;
		if (!trivia.phase) return this.sendReply('There is no trivia game in progress.');
		if (trivia.phase !== 'question') return this.sendReply('There is no question to answer.');

		var answer = toId(target);
		if (!answer) return this.sendReply('"' + target + '" is not a valid answer.');
		var userid = user.userid;
		var response = 'You have selected "' + answer + '" as your answer.';
		if (trivia.mode === 'custom') {
			var askedBy = trivia.askedBy;
			if (userid === askedBy || askedBy in user.prevNames) return this.sendReply('You can\'t answer your own question!');
			var alts = user.getAlts();
			for (var i = alts.length; i--;) {
				if (toId(alts[i]) === askedBy) return this.sendReply('You can\'t answer your own question!');
			}
		} else if (!(userid in trivia.participants)) {
			return this.sendReply('You are not a participant in this trivia game.');
		}
		if (trivia.mode === 'number') {
			var responders = trivia.responders;
			var index = responders.indexOf(userid);
			if (index > -1) responders.splice(index, 1);
			if (trivia.curA.indexOf(answer) > -1) responders.push(userid);
			return this.sendReply(response);
		}
		if (trivia.curA.indexOf(answer) < 0) return this.sendReply(response);

		// points can be rewarded through /ta when the game doesn't use number mode, since the first to answer ends the question phase otherwise
		clearTimeout(trivia.sleep);
		trivia.phase = 'intermission';
		var correct = Tools.escapeHTML(user.name);
		var buffer = '<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
		             'Correct: ' + correct + '<br />' +
			     'Answer(s): ' + trivia.curA.join(', ') + '<br />';
		switch (trivia.mode) {
		case 'first':
			var points = 5;
			break;
		case 'timer':
			var points = 5 - Math.floor((Date.now() - trivia.askedAt) / 3000);
			break;
		case 'custom':
			buffer += 'Their leaderboard score has increased by <strong>1</strong> point!';
			room.addRaw(buffer);
			room.update();
			return trivia.updateLeaderboard(userid);
		}
		var score = trivia.participants[userid];
		score[0] += points;
		score[1]++;
		if (score[0] < trivia.cap) {
			buffer += 'They gained <strong>' + points + '</strong> points!</div>';
			room.addRaw(buffer);
			room.update();
			trivia.sleep = setTimeout(function () { trivia.askQuestion(room); }, 30 * 1000);
			return false;
		}
		buffer += 'They won the game with a final score of <strong>' + score[0] + '</strong>, and their leaderboard score has increased by <strong>' + trivia.prize + '</strong> points!</div>';
		room.addRaw(buffer);
		room.update();
		trivia.updateLeaderboard(userid);
	},
	// trivia end question timeout
	teqt: function (target, room, user) {
		if (room.id !== 'trivia' || !this.can('mute', null, room)) return false;
		if (!trivia.phase) return this.sendReply('There is no trivia game in progress.');
		if (trivia.phase !== 'intermission') return this.sendReply('/teqt can only be used during the intermission phase.');
		clearTimeout(trivia.sleep);
		trivia.askQuestion(room);
	},
	triviaend: function (target, room, user) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room)) return false;
		if (!trivia.phase) return this.sendReply('There is no trivia game in progress.');
		if (trivia.phase === 'signup') {
			trivia.phase = '';
			trivia.participants = {};
		} else {
			clearTimeout(trivia.sleep);
			trivia.updateLeaderboard();
		}
		room.addRaw('<div class="broadcast-blue">' + Tools.escapeHTML(user.name) + ' has forced the game to end.</div>');
		room.update();
	},
	triviacustom: function (target, room, user) {
		if (room.id !== 'trivia' || !this.can('broadcast', null, room) || !target) return false;
		if (trivia.phase) return this.sendReply('There is already a trivia game in progress.');
		target = target.split('|');
		if (target.length !== 3) return this.sendReply('/triviacustom requires a category, a question, and at least one answer. View /triviahelp gcommands for more information.');

		var questionCategory = toId(target[0]);
		if (questionCategory === 'random') return false;
		if (CATEGORIES.indexOf(questionCategory) < 0) return this.sendReply('"' + target[0].trim() + '" is not a valid category. View /triviahelp ginfo for more information.');
		var question = Tools.escapeHTML(target[1]).trim();
		if (!question) return this.sendReply('"' + target[1].trim() + '" is not a valid question.');
		var temp = target[2].split(',');
		var answers = [];
		for (var i = 0, len = temp.length; i < len; i++) {
			var answer = toId(temp[i]);
			if (answer && answers.indexOf(answer) < 0) answers.push(answer);
		}
		if (!answers.length) return this.sendReply('No valid answers were specified.');

		trivia.phase = 'question';
		trivia.mode = 'custom';
		trivia.category = questionCategory;
		trivia.curQ = question;
		trivia.curA = answers;
		trivia.askedBy = user.userid;
		room.addRaw('<div class="broadcast-blue"><strong>Question: ' + question + '</strong><br />' +
		            'Category: ' + questionCategory + ' | Asked by ' + Tools.escapeHTML(user.name) + '</div>');
		room.update();

		trivia.sleep = setTimeout(function () {
			room.addRaw('<div class="broadcast-blue"><strong>The answering period has ended!</strong><br />' +
				    'Correct: no one<br />' +
				    'Answer(s): ' + trivia.curA.join(', ') + '<br />' +
				    'Nobody\'s leaderboard score changed.</div>');
			room.update();
			trivia.updateLeaderboard();
		}, 15 * 1000);
	},

	// question database modifying commands
	triviasubmit: 'triviaadd',
	triviaadd: function (target, room, user, connection, cmd) {
		if (room.id !== 'trivia' && room.id !== 'qstaff' || cmd === 'triviaadd' && !this.can('declare', null, room) || !target) return false;
		target = target.split('|');
		if (target.length !== 3) return this.sendReply('Invalid arguments specified. View /triviahelp qcommands for more information.');

		var questionCategory = toId(target[0]);
		if (questionCategory === 'random') return false;
		if (CATEGORIES.indexOf(questionCategory) < 0) return this.sendReply('"' + target[0] + '" is not a valid category. View /triviahelp ginfo for more information.');
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
		var submitted = false;
		if (cmd === 'triviaadd') {
			for (var i = submissions.length; i--;) {
				if (submissions[i].question === question) return this.sendReply('Question "' + target[1].trim() + '" has already been submitted.');
			}
			questions.push({category: questionCategory, question: question, answers: answers});
			writeTriviaData();
			return this.sendReply('Question "' + target[1].trim() + '" was added to the question database.');
		} else {
			for (var i = 0, len = submissions.length; i < len; i++) {
				if (submissions[i].question === question) return this.sendReply('Question "' + target[1].trim() + '" has already been submitted.');
				if (!submitted && submissions[i].category > questionCategory) {
					submissions.splice(i, 0, {category: questionCategory, question: question, answers: answers});
					submitted = true;
				}
			}
			if (!submitted) submissions.push({category: questionCategory, question: question, answers: answers});
			writeTriviaData();
			this.sendModCommand('Question "' + target[1].trim() + '" was submitted for review by ' + user.name + '.');
			this.sendReply('Question "' + target[1].trim() + '" was submitted for review.');
		}
	},
	triviareview: function (target, room, user) {
		if (room.id !== 'trivia' && room.id !== 'qstaff' || !this.can('declare', null, room)) return false;
		var submissions = triviaData.submissions;
		var submissionsLen = submissions.length;
		var buffer = '<div class="ladder"><table><tr>';
		if (!submissionsLen) {
			buffer += '<td>No questions await review.</td></tr></table></div>';
			return this.sendReplyBox(buffer);
		}

		buffer += '<td colspan="4"><strong>' + submissionsLen + '</strong> questions await review:</td></tr>' +
			  '<tr><th>#</th><th>Category</th><th>Question</th><th>Answer(s)</th></tr>';
		for (var i = 0; i < submissionsLen; i++) {
			var entry = submissions[i];
			buffer += '<tr><td><strong>' + (i + 1) + '</strong></td><td>' + entry.category + '</td><td>' + entry.question + '</td><td>' + entry.answers.join(', ') + '</td></tr>';
		}
		buffer += '</table></div>';
		this.sendReplyBox(buffer);
	},
	triviareject: 'triviaaccept',
	triviaaccept: function (target, room, user, connection, cmd) {
		if (room.id !== 'trivia' && room.id !== 'qstaff' || !this.can('declare', null, room) || !target) return false;
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
		if (/^\d+(?: ?, ?\d+)*$/.test(target)) {
			// indices here begin at 1 rather than 0 until the question database is modified
			target = target.replace(/ /g, '').replace(/,,+/g, ',').split(',');
			submissionsLen++;
			var indices = [];
			for (var i = target.length; i--;) {
				var index = parseInt(target[i]);
				if (index && indices.indexOf(index) < 0 && index < submissionsLen) indices.push(index);
			}
			var indicesLen = indices.length;
			if (!indicesLen) return this.sendReply('"' + target.join(', ') + '" is not a valid set of index numbers. View /triviareview and /triviahelp qcommands for more information.');
			indices = indices.sort(function (a, b) { return a - b; });
			if (isAdding) {
				for (var i = indicesLen; i--;) {
					var index = indices[i] - 1;
					questions.push(submissions[index]);
					submissions.splice(index, 1);
				}
				this.sendReply('Question numbers ' + indices.join(', ') + ' were added to the question database.');
			} else {
				for (var i = indicesLen; i--;) {
					submissions.splice((indices[i] - 1), 1);
				}
				this.sendReply('Question numbers ' + indices.join(', ') + ' were removed from the question database.');
			}
			return writeTriviaData();
		}
		this.sendReply('"' + target + '" is an invalid argument. View /triviahelp qcommands for more information.');
	},
	triviadelete: function (target, room, user) {
		if (room.id !== 'trivia' && room.id !== 'qstaff' || !this.can('declare', null, room) || !target) return false;
		var question = Tools.escapeHTML(target).trim();
		if (!question) return this.sendReply('"' + target.trim() + '" is not a valid question.');
		var questions = triviaData.questions;
		for (var i = questions.length; i--;) {
			if (questions[i].question !== question) continue;
			questions.splice(i, 1);
			writeTriviaData();
			return this.sendReply('Question "' + target + '" was removed from the question database.');
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
		var list = triviaData.questions.filter(function (question) { return question.category === category; });
		var listLen = list.length;
		var buffer = '<div class="ladder"><table><tr>';
		if (!listLen) {
			buffer += '<td>There are no questions in the ' + target + ' category.</td></table></div>';
			return this.sendReplyBox(buffer);
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
				var question = list[i].question;
				buffer += '<tr><td><strong>' + (i + 1) + '</strong></td><td>' + question + '</td></tr>';
			}
		}
		buffer += '</table></div>';
		this.sendReplyBox(buffer);
	},

	//informational commands
	triviaplayers: function (target, room, user) {
		if (room.id !== 'trivia' || !this.canBroadcast()) return false;
		if (!trivia.phase) return this.sendReplyBox('There is no trivia game in progress.');
		if (trivia.mode === 'custom') return this.sendReplyBox('Custom trivia games have no list of participants.');
		var players = Object.keys(trivia.participants);
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
	triviastatus: function (target, room, user) {
		if (room.id !== 'trivia' || !this.canBroadcast()) return false;
		if (!trivia.phase) return this.sendReplyBox('There is no trivia game in progress.');
		if (trivia.mode === 'custom') return this.sendReplyBox('There is a custom trivia game in progress.');

		var buffer = 'There is a trivia game in progress, and it is in its ' + trivia.phase + ' phase.<br />' +
		             'Mode: ' + trivia.mode + ' | Category: ' + trivia.category + ' | Score cap: ' + trivia.cap;
		var score = trivia.participants[user.userid];
		if (score) buffer += '<br />Current score: ' + score[0] + ' | Correct answers: ' + score[1];
		this.sendReplyBox(buffer);
	},
	triviahelp: function (target, room, user) {
		if (room.id !== 'trivia' || !this.canBroadcast()) return false;
		target = toId(target);
		switch (target) {
		case 'ginfo':
			this.sendReplyBox('<strong>Modes:</strong><br />' +
			                  '- First: the first to answer within 15 seconds gets 5 points<br />' +
			                  '- Timer: the first to answer within 15 seconds gets up to 5 points based on how quickly they answer<br />' +
			                  '- Number: all who answer correctly within 10 seconds get up to 5 points based on how many of them answered correctly compared to the total number of players<br />' +
			                  '- Custom: same as first mode, but only one question is asked, and the winner gains 1 point on the trivia leaderboard<br />' +
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
			                  '- /teqt - ends the 30 second intermission period between questions early and asks the next question. Requires: % @ # & ~<br />' +
			                  '- /triviakick - disqualifies a player from the current trivia game. Requires: % @ # & ~<br />' +
			                  '- /triviaend - forces a trivia game to end early. Requires: + % @ # & ~<br />' +
			                  '- /triviacustom category | question | answer1, answer2, ... answern - starts a custom trivia game. Requires: + % @ # & ~');
			break;
		case 'qcommands':
			this.sendReplyBox('<strong>Question modifying commands:</strong><br />' +
			                  '- /triviaadd category | question | answer1, answer2, ... answern - adds a question to the question database. Requires: # & ~<br />' +
			                  '- /triviadelete question - deletes a question from the trivia database. Requires: # & ~<br />' +
			                  '- /triviaqs category - returns the list of questions in the specified category. Viewing their answers requires # & ~. Requires: % @ # & ~<br /><br />' +
					  '<strong>Question submission commands</strong><br />' +
			                  '- /triviasubmit category | question | answer1, answer2 ... answern - adds a question to the submission list for staff to review before adding or rejecting it<br />' +
			                  '- /triviaaccept index1, index2, ... indexn OR all - adds the specified question(s) to the question database. Requires: # & ~<br />' +
			                  '- /triviareject index1, index2, ... indexn OR all - removes the specified question(s) from the submission list. Requires: # & ~<br />' +
			                  '- /triviareview - returns a list of all the questions on the submission list. Requires: # & ~');
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
