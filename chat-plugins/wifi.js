/**
* Wi-Fi chat-plugin. Only works in a room with id 'wifi'
* Handles giveaways in the formats: question, lottery
* Credits: DanielCranham, codelegend
**/

// checks whether any alt of the user is present in list.
function checkAllAlts(user, list) {
	for (var prevName in user.prevNames) {
		if (prevName in list) return 'previous name ' + prevName;
	}
	var alts = user.getAlts().map(toId);
	for (var i = 0; i < alts.length; i++) {
		if (alts[i] in list) return 'alt ' + alts[i];
	}
	return false;
}

var giveaway = exports.giveaway = null;

var QuestionGiveAway = (function () {
	function QuestionGiveAway(host, giver, room, options) {
		this.host = host;
		this.giver = giver;
		this.room = room;
		this.phase = 'pending';

		this.prize = options.prize;
		this.question = options.question;
		this.answers = options.answers;
		this.answered = {}; // userid: number of guesses

		this.room.addRaw('<center><div class = "broadcast-blue"><font size = 3><b>It\'s giveaway time!</b></font><br/>' +
			'<font size = 1>Question Giveaway started by ' + Tools.escapeHTML(host.name) + '</font><br/><br/>' +
			'<b>' + Tools.escapeHTML(giver.name) + '</b> will be giving away a <b>' + Tools.escapeHTML(this.prize) + '!</b><br/>' +
			'The question will be displayed in a minute!');
		this.room.update();
		this.startTimer = setTimeout(this.start.bind(this), 1000 * 60);

		this.excluded = {};
		this.excluded[host.userid] = 1;
		this.excluded[giver.userid] = 1;
	}
	QuestionGiveAway.prototype.type = 'question';

	QuestionGiveAway.prototype.guessAnswer = function (user, guess, output) {
		if (this.phase !== 'started') return output.sendReply("The giveaway has not started yet.");

		var joinError = checkAllAlts(user, this.answered);
		if (joinError) return output.sendReply("You have already joined the giveaway under the " + joinError + ". Use that alt/account to continue.");
		joinError = checkAllAlts(user, this.excluded) || (user.userid in this.excluded);
		if (joinError) return output.sendReply("You are the host/giver of the giveaway, and cannot guess.");

		var userid = user.userid;
		if (!this.answered[userid]) this.answered[userid] = 0;
		if (this.answered[userid] >= 3) {
			return output.sendReply("You have already guessed three times. You cannot guess anymore in this giveaway.");
		}

		if (toId(guess) in this.answers) {
			this.winner = user;
			return this.onEnd();
		}

		this.answered[userid]++;
		if (this.answered[userid] >= 3) {
			output.sendReply("Your guess " + guess + " is wrong. You have used up all your guesses. Better luck next time.");
		} else {
			output.sendReply("Your guess " + guess + " is wrong. Try again.");
		}
		return;
	};

	QuestionGiveAway.prototype.change = function (key, value, user, output) {
		if (user.userid !== this.host.userid) return this.sendReply("You cannot edit this giveaway. Only the host/starter can edit.");
		if (this.phase !== 'pending') return output.sendReply("The giveaway has started, and the question/answer cannot be changed.");

		switch (key) {
		case 'question':
			this.question = value;
			output.sendReply("The question has been changed to " + value + ".");
			break;
		case 'answer':
			var ans = this.sanitizeAnswers(value);
			if (Object.keys(ans).length <= 0) return output.sendReply("You must specify at least one answer. Note: answers can be utmost 3 words long, and cannot contain any special characters.");

			this.answers = ans;
			output.sendReply("The answers have been changed to " + value + ".");
			break;
		}
		return;
	};
	QuestionGiveAway.prototype.start = function () {
		this.phase = 'started';
		clearTimeout(this.startTimer); // just in case it was a force start.
		this.room.addRaw('<div class = "broadcast-blue">Giveaway Question: <b>' + this.question + '</b><br/>' +
			'use /ga to guess.');
		this.room.update();
		this.endTimer = setTimeout(this.onEnd.bind(this), 1000 * 60 * 10);
	};
	QuestionGiveAway.prototype.onEnd = function (force) {
		if (force) {
			if (this.phase === 'ended') return;
			clearTimeout(this.startTimer);
			clearTimeout(this.endTimer);
			this.room.addRaw('<b>The giveaway was forcibly ended.</b>');
			this.room.update();
			giveaway = null;
			return;
		}
		this.phase = 'ended';
		clearTimeout(this.endTimer);
		if (!this.winner) {
			this.room.addRaw('<b>The giveaway has been forcibly ended, as no one has answered the question</b>');
		} else {
			var ans = [];
			for (var i in this.answers) {
				ans.push(this.answers[i]);
			}
			this.room.addRaw('<div class = "broadcast-blue"><b>' + Tools.escapeHTML(this.winner.name) + '</b> guessed the correct answer.</b> Congratulations!<br/>' +
				"Correct answer(s) : " + ans.join(','));
			if (this.winner.connected) this.winner.popup('You have won the giveaway. PM **' + Tools.escapeHTML(this.giver.name) + '** to claim your reward!');
		}
		this.room.update();
		giveaway = null;
		return;
	};

	QuestionGiveAway.sanitizeAnswers = function (target) {
		var ret = {};
		target.split("/").forEach(function (ans) {
			ans = ans.replace(/[^a-z0-9 ]+/ig, "").trim();
			if (!toId(ans)) return;
			if (ans.split(' ').length > 3) return;
			ret[toId(ans)] = ans.toLowerCase();
		});
		return ret;
	};

	return QuestionGiveAway;
})();

var LotteryGiveAway = (function () {
	function LotteryGiveAway(host, giver, room, options) {
		this.host = host;
		this.giver = giver;
		this.room = room;
		this.phase = 'joining';

		this.prize = options.prize;
		this.maxwinners = options.maxwinners;
		this.joined = {}; // userid: 0

		this.reminder = '<center><div class = "broadcast-blue"><font size = 3><b>It\'s giveaway time!</b></font><br/>' +
			'<font size = 1>Giveaway started by ' + Tools.escapeHTML(host.name) + '</font><br/><br/>' +
			'<b>' + Tools.escapeHTML(giver.name) + '</b> will be giving away a <b>' + Tools.escapeHTML(this.prize) + '</b>!<br/>' +
			'The lottery drawing will occur in 2 minutes, with ' + this.maxwinners + ' winners!<br/>' +
			'<button name = "send" value = "/giveaway joinlottery"><font size = 1><b>Join</b></font></button> <button name = "send" value = "/giveaway leavelottery"><font size = 1><b>Leave</b></font></button><br/>' +
			'<font size = 1><b><u>Note:</u> Please do not join if you don\'t have a 3DS and a copy of Pokémon XY or ORAS';
		this.room.addRaw(this.reminder);
		this.room.update();

		this.drawTimer = setTimeout(this.drawLottery.bind(this), 1000 * 60 * 2);

		this.excluded = {};
		this.excluded[host.userid] = 1;
		this.excluded[giver.userid] = 1;
	}
	LotteryGiveAway.prototype.type = 'lottery';

	LotteryGiveAway.prototype.addUser = function (user, output) {
		if (this.phase !== 'joining') return output.sendReply("The join phase of the lottery giveaway has not started yet.");

		var joinError = checkAllAlts(user, this.joined);
		if (joinError) return output.sendReply("You have already joined the giveaway under the " + joinError + ". Use that alt/account to continue.");
		joinError = checkAllAlts(user, this.excluded) || (user.userid in this.excluded);
		if (joinError) return output.sendReply("You are the host/giver of the giveaway, and cannot join.");

		this.joined[user.userid] = 0;
		return output.sendReply("You have successfully joined the lottery giveaway.");
	};
	LotteryGiveAway.prototype.removeUser = function (user, output) {
		if (this.phase !== 'joining') return output.sendReply("The join phase of the lottery giveaway has not started yet.");
		if (!(user.userid in this.joined)) return output.sendReply("You have not joined the lottery giveaway.");
		delete this.joined[user.userid];
		return output.sendReply("You have left the lottery giveaway.");
	};

	LotteryGiveAway.prototype.drawLottery = function () {
		this.phase = 'drawing';
		clearTimeout(this.drawTimer);

		function randomIntinRange(max) {
			// very primitive in the current state.
			return Tools.clampIntRange(Math.random() * max, 0, max);
		}

		var userlist = Object.keys(this.joined),
			total = userlist.length,
			maxwin = this.maxwinners;
		if (total < maxwin) return this.onEnd(true);

		this.winners = {};

		while (maxwin) {
			var index = randomIntinRange(total);
			if (!(userlist[index] in this.winners)) {
				this.winners[userlist[index]] = Users.get(userlist[index]);
				maxwin--;
			}
		}
		this.onEnd();
	};
	LotteryGiveAway.prototype.onEnd = function (force) {
		if (force) {
			if (this.phase === 'ended') return;
			clearTimeout(this.drawTimer);
			this.room.addRaw('<b>The giveaway was forcibly ended, as enough users did not participate.</b>');
			this.room.update();
			giveaway = null;
			return;
		}
		this.phase = 'ended';
		var finallist = [];
		for (var id in this.winners) {
			finallist.push(this.winners[id].name);
		}
		finallist = finallist.join(', ');
		this.room.addRaw('<div class = "broadcast-blue"><font size = 2><b>Lottery Draw: </b></font>&nbsp;&nbsp;' + Object.keys(this.joined).length + ' users have joined the lottery.<br/>' +
			'Our lucky winner(s): <b>' + Tools.escapeHTML(finallist) + ' !</b> Congratulations!');
		this.room.update();

		for (var id in this.winners) {
			var targetUser = this.winners[id];
			if (targetUser && targetUser.connected) targetUser.popup('You have won the lottery giveaway! PM **' + this.giver.name + '** to claim your prize!');
		}
		if (this.giver && this.giver.connected) {
			this.giver.popup("The following users have won your lottery giveaway:\n" + finallist);
		}

		giveaway = null;
		return;
	};
	return LotteryGiveAway;
})();

var commands = {
	// question giveaway.
	quiz: 'qg',
	question: 'qg',
	qg: function (target, room, user) {
		if (room.id !== 'wifi') return false;
		if (!this.can('warn', null, room)) return false;
		if (!target || target.indexOf(',') === -1) return false;
		if (giveaway) return this.sendReply('There is already a giveaway going on!');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.sendReply('User \'' + this.targetUsername + '\' is not online.');

		target = target.split(',').map(function (val) { return val.trim(); });
		if (!target[0] || !target[1] || !target[2]) return this.sendReply('Too few parameters.');
		var options = {
			prize: target[0],
			question: target[1],
			answers: QuestionGiveAway.sanitizeAnswers(target[2])
		};
		if (Object.keys(options.answers).length <= 0) return this.sendReply("You must specify at least one answer. Note: answers can be utmost 3 words long, and cannot contain any special characters.");

		giveaway = new QuestionGiveAway(user, targetUser, room, options);
		this.privateModCommand("(" + user.name + " has started a question giveaway.)");
	},
	changeanswer: 'changequestion',
	changequestion: function (target, room, user, conn, cmd) {
		if (room.id !== 'wifi') return false;
		if (!giveaway) return this.sendReply('There is no giveaway going on at the moment.');
		if (giveaway.type !== 'question') return this.sendReply('This is not a question giveaway.');
		if (!target.trim()) return this.sendReply("You must mention a question/answer.");

		giveaway.change(cmd.substr(6), target.trim(), user, this);
	},
	showanswer: 'viewanswer',
	viewanswer: function (target, room, user) {
		if (room.id !== 'wifi') return false;
		if (!giveaway) return this.sendReply('There is no giveaway going on at the moment.');
		if (giveaway.type !== 'question') return this.sendReply('This is not a question giveaway.');
		if (user.userid !== giveaway.host.userid || user.userid !== giveaway.giver.userid) return;

		var answers = [];
		for (var i in giveaway.answers) {
			answers.push(giveaway.answers[i]);
		}
		this.sendReply("The giveaway question is " + giveaway.question + ".\n" +
			"The answer(s) for the giveaway question are : " + answers.join('/') + ".");
	},
	guessanswer: 'guess',
	guess: function (target, room, user) {
		if (room.id !== 'wifi') return this.sendReply("This command can only be used in the Wi-Fi room.");
		if (!giveaway) return this.sendReply('There is no giveaway going on at the moment.');
		if (giveaway.type !== 'question') return this.sendReply('This is not a question giveaway.');

		giveaway.guessAnswer(user, target, this);
	},

	// lottery giveaway.
	lg: 'lotto',
	lottery: 'lotto',
	lotto: function (target, room, user) {
		if (room.id !== 'wifi') return false;
		if (!this.can('warn', null, room)) return false;
		if (!target || target.indexOf(',') === -1) return false;
		if (giveaway) return this.sendReply('There is already a giveaway going on!');

		target = this.splitTarget(target);
		var targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.sendReply('User \'' + this.targetUsername + '\' is not online.');

		target = target.split(',').map(function (val) { return val.trim(); });
		if (!target[0] || !target[1]) return this.sendReply('Too few parameters.');
		var options = {
			prize: target[0],
			maxwinners: parseInt(target[1])
		};
		if (options.maxwinners > 5 || options.maxwinners < 1) return this.sendReply("The lottery giveaway can have a minimum of 1 and maximum of 5 winners.");

		giveaway = new LotteryGiveAway(user, targetUser, room, options);
		this.privateModCommand("(" + user.name + " has started a lottery giveaway.)");
	},
	leavelottery: 'join',
	leave: 'join',
	joinlottery: 'join',
	join: function (target, room, user, conn, cmd) {
		if (room.id !== 'wifi') return this.sendReply("This command can only be used in the Wi-Fi room.");
		if (!giveaway) return this.sendReply('There is no giveaway going on at the moment.');
		if (giveaway.type !== 'lottery') return this.sendReply('This is not a lottery giveaway.');

		switch (cmd) {
		case 'joinlottery':
		case 'join':
			giveaway.addUser(user, this);
			break;
		case 'leavelottery':
		case 'leave':
			giveaway.removeUser(user, this);
			break;
		}
	},
	// general.
	stop: 'end',
	end: function (target, room, user) {
		if (room.id !== 'wifi') return this.sendReply("This command can only be used in the Wi-Fi room.");
		if (!giveaway) return this.sendReply('There is no giveaway going on at the moment.');
		if (!this.can('warn', giveaway.host, room) && user.userid !== giveaway.host.userid) return false;

		giveaway.onEnd(true);
	},
	rm: 'remind',
	remind: function (target, room, user) {
		if (room.id !== 'wifi') return this.sendReply("This command can only be used in the Wi-Fi room.");
		if (!giveaway) return this.sendReply('There is no giveaway going on at the moment.');

		switch (giveaway.type) {
		case 'question':
			if (giveaway.phase !== 'started') return this.sendReply('The giveaway has not started yet.');
			if (!this.canBroadcast()) return;
			this.sendReply('|html|<div class = "broadcast-blue"><font size = 1>Question Giveaway started by ' + Tools.escapeHTML(giveaway.host.name) + '</font><br/>' +
				'<b>' + Tools.escapeHTML(giveaway.giver.name) + '</b> will be giving away a <b>' + Tools.escapeHTML(giveaway.prize) + '</b>!<br/>' +
				'Question: <b>' + Tools.escapeHTML(giveaway.question));
			break;
		case 'lottery':
			if (!this.canBroadcast()) return;
			this.sendReply('|raw|' + giveaway.reminder);
			break;
		}
	},
	'': 'help',
	help: function (target, room, user) {
		if (room.id !== 'wifi') return this.sendReply("This command can only be used in the Wi-Fi room.");

		var reply = '';
		switch (target) {
		case 'staff':
			if (!this.can('warn', null, room)) return;
			reply = '<strong>Staff commands:</strong><br />' +
			        '- question or qg <em>User, Prize, Question, Answer</em> - Start a new question giveaway (Requires: % @ # & ~)<br />' +
			        '- lottery or lg <em>User, Prize[, Number of Winners]</em> - Starts a lottery giveaway (Requires: % @ # & ~)<br />' +
			        '- changequestion - Changes the question of a question giveaway (Requires: giveaway host)<br />' +
			        '- changeanswer - Changes the answer of a question giveaway (Requires: giveaway host)<br />' +
					'- viewanswer - Shows the answer in a question giveaway (only to giveaway host/giver)<br />' +
			        '- end - Forcibly ends the current giveaway (Requires: % @ # & ~)<br />';
			break;
		case 'game':
		case 'giveaway':
		case 'user':
			if (!this.canBroadcast()) return;
			reply = '<strong>Giveaway participation commands: </strong> (start with /giveaway, except for /ga) <br />' +
			        '- guess or /ga <em>answer</em> - Guesses the answer for a question giveaway<br />' +
			        '- viewanswer - Shows the answer in a question giveaway (only to host/giver)<br />' +
			        '- remind - Shows the details of the current giveaway (can be broadcast)<br />' +
			        '- join or joinlottery - Joins a lottery giveaway<br />' +
			        '- leave or leavelottery - Leaves a lottery giveaway<br />';
			break;
		default:
			if (!this.canBroadcast()) return;
			reply = '<b>Wi-Fi room Giveaway help and info</b><br />' +
			'- help giveaway - shows list of participation commands<br />' +
			'- help staff - shows giveaway staff commands (Requires: % @ # & ~)';
		}
		this.sendReplyBox(reply);
	}
};

exports.commands = {
	'giveaway': commands,
	'ga': commands.guess,
	'gh': commands.help
};
