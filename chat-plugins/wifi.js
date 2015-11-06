/**
* Wi-Fi chat-plugin. Only works in a room with id 'wifi'
* Handles giveaways in the formats: question, lottery
* Credits: Codelegend, SilverTactic, DanielCranham
**/

'use strict';

// checks whether any alt of the user is present in list.
function checkAllAlts(user, list) {
	for (let prevName in user.prevNames) {
		if (prevName === user.userid) continue;
		if (prevName in list) return 'previous name ' + prevName;
	}
	let ip = user.latestIp;
	for (let id in list) {
		let matchUser = Users.get(id);
		if (matchUser.latestIp === ip && matchUser.userid !== user.userid) return 'alt ' + matchUser.name;
	}
	return false;
}

let giveaways = {};
let wifiRoom = Rooms.get('wifi');

// import giveaways if stored in room
if (wifiRoom) {
	if (wifiRoom.giveaways) {
		giveaways = wifiRoom.giveaways;
	} else {
		wifiRoom.giveaways = giveaways;
	}
}

let QuestionGiveAway = (function () {
	function QuestionGiveAway(host, giver, room, options) {
		this.host = host;
		this.giver = giver;
		this.room = room;
		this.phase = 'pending';

		this.prize = options.prize;
		this.question = options.question;
		this.answers = options.answers;
		this.answered = {}; // userid: number of guesses

		this.room.addRaw("<center><div class='broadcast-blue'><font size='3'><b>It's giveaway time!</b></font><br/>" +
			"<font size='1'>Question Giveaway started by " + Tools.escapeHTML(host.name) + "</font><br/><br/>" +
			"<b>" + Tools.escapeHTML(giver.name) + "</b> will be giving away a <b>" + Tools.escapeHTML(this.prize) + "!</b><br/>" +
			"The question will be displayed in one minute!"
		).update();
		this.startTimer = setTimeout(this.start.bind(this), 1000 * 60);

		this.excluded = {};
		this.excluded[host.userid] = 1;
		this.excluded[giver.userid] = 1;
	}
	QuestionGiveAway.prototype.type = 'question';

	QuestionGiveAway.prototype.guessAnswer = function (user, guess, output) {
		if (this.phase !== 'started') return output.sendReply("The giveaway has not started yet.");

		let joinError = checkAllAlts(user, this.answered);
		if (joinError) return output.sendReply("You have already joined the giveaway under the " + joinError + ". Use that alt/account to continue.");
		joinError = checkAllAlts(user, this.excluded) || (user.userid in this.excluded);
		if (joinError) return output.sendReply("You are the host/giver of the giveaway, and cannot guess.");

		let userid = user.userid;
		if (!this.answered[userid]) this.answered[userid] = 0;
		if (this.answered[userid] >= 3) return output.sendReply("You have already guessed three times. You cannot guess anymore in this giveaway.");

		if (toId(guess) in this.answers) {
			this.winner = user;
			return this.onEnd();
		}

		this.answered[userid]++;
		if (this.answered[userid] >= 3) {
			output.sendReply("Your guess '" + guess + "' is wrong. You have used up all of your guesses. Better luck next time!");
		} else {
			output.sendReply("Your guess '" + guess + "' is wrong. Try again!");
		}
	};

	QuestionGiveAway.prototype.change = function (key, value, user, output) {
		if (user.userid !== this.host.userid) return this.sendReply("Only the host can edit the giveaway.");
		if (this.phase !== 'pending') return output.sendReply("You cannot change the question or answer once the giveaway has started.");
		if (key === 'question') {
			this.question = value;
			output.sendReply("The question has been changed to " + value + ".");
		} else {
			let ans = QuestionGiveAway.sanitizeAnswers(value);
			let len = Object.keys(ans).length;
			if (!len) return output.sendReply("You must specify at least one answer and it must not contain any special characters.");
			this.answers = ans;
			output.sendReply("The answer" + (len > 1 ? "s have" : " has") + " been changed to " + value + ".");
		}
	};
	QuestionGiveAway.prototype.start = function () {
		this.phase = 'started';
		this.room.addRaw(
			"<div class='broadcast-blue'>Giveaway Question: <b>" + this.question + "</b><br/>" +
			"use /ga to guess."
		).update();
		this.endTimer = setTimeout(this.onEnd.bind(this), 1000 * 60 * 10);
	};
	QuestionGiveAway.prototype.onEnd = function (force) {
		if (force) {
			if (this.phase === 'ended') return;
			clearTimeout(this.startTimer);
			clearTimeout(this.endTimer);
			this.room.addRaw("<b>The giveaway was forcibly ended.</b>");
		} else {
			this.phase = 'ended';
			clearTimeout(this.endTimer);
			if (!this.winner) {
				this.room.addRaw("<b>The giveaway has been forcibly ended as no one has answered the question.</b>");
			} else {
				let ans = [];
				for (let i in this.answers) {
					ans.push(this.answers[i]);
				}
				this.room.addRaw("<div class='broadcast-blue'><b>" + Tools.escapeHTML(this.winner.name) + "</b> guessed the correct answer.</b> Congratulations!<br/>" +
					"Correct answer(s): " + ans.join(','));
				if (this.winner.connected) this.winner.popup('You have won the giveaway. PM **' + Tools.escapeHTML(this.giver.name) + '** to claim your prize!');
			}
		}
		this.room.update();
		delete giveaways[this.room.id];
	};

	QuestionGiveAway.sanitizeAnswers = function (target) {
		let ret = {};
		target.split("/").forEach(function (ans) {
			ans = ans.replace(/[^a-z0-9 ]+/ig, "").trim();
			if (!toId(ans)) return;
			ret[toId(ans)] = ans.toLowerCase();
		});
		return ret;
	};

	return QuestionGiveAway;
})();

let LotteryGiveAway = (function () {
	function LotteryGiveAway(host, giver, room, options) {
		this.host = host;
		this.giver = giver;
		this.room = room;
		this.phase = 'joining';

		this.prize = options.prize;
		this.maxwinners = options.maxwinners;
		this.joined = {}; // userid: 1

		this.reminder = '<center><div class="broadcast-blue"><font size="3"><b>It\'s giveaway time!</b></font><br/>' +
			'<font size="1">Giveaway started by ' + Tools.escapeHTML(host.name) + '</font><br/><br/>' +
			'<b>' + Tools.escapeHTML(giver.name) + '</b> will be giving away: <b>' + Tools.escapeHTML(this.prize) + '</b>!<br/>' +
			'The lottery drawing will occur in 2 minutes, and with ' + this.maxwinners + ' winner' + (this.maxwinners > 1 ? 's' : '') + '!<br/>' +
			'<button name="send" value="/giveaway joinlottery"><font size="1"><b>Join</b></font></button> <button name="send" value="/giveaway leavelottery"><font size="1"><b>Leave</b></font></button><br/>' +
			'<font size="1"><b><u>Note:</u> Please do not join if you don\'t have a 3DS and a copy of Pok&eacute;mon XY or ORAS';
		this.room.addRaw(this.reminder).update();

		this.drawTimer = setTimeout(this.drawLottery.bind(this), 1000 * 60 * 2);

		this.excluded = {};
		this.excluded[host.userid] = 1;
		this.excluded[giver.userid] = 1;
	}
	LotteryGiveAway.prototype.type = 'lottery';

	LotteryGiveAway.prototype.addUser = function (user, output) {
		if (this.phase !== 'joining') return output.sendReply("The join phase of the lottery giveaway has ended.");

		if (!user.named) return output.sendReply("You need to choose a name before joining a lottery giveaway.");
		let joinError = checkAllAlts(user, this.joined);
		if (joinError) return output.sendReply("You have already joined the giveaway under the " + joinError + ". Use that alt/account to continue.");
		joinError = checkAllAlts(user, this.excluded) || (user.userid in this.excluded);
		if (joinError) return output.sendReply("You are the host/giver of the giveaway, and cannot join.");

		this.joined[user.userid] = 1;
		output.sendReply("You have successfully joined the lottery giveaway.");
	};
	LotteryGiveAway.prototype.removeUser = function (user, output) {
		if (this.phase !== 'joining') return output.sendReply("The join phase of the lottery giveaway has ended.");
		if (!(user.userid in this.joined)) return output.sendReply("You have not joined the lottery giveaway.");
		delete this.joined[user.userid];
		output.sendReply("You have left the lottery giveaway.");
	};

	LotteryGiveAway.prototype.drawLottery = function () {
		this.phase = 'drawing';
		clearTimeout(this.drawTimer);

		let userlist = Object.keys(this.joined);
		this.totalusers = userlist.length;
		if (this.totalusers < this.maxwinners) return this.onEnd(true);

		this.winners = {};
		while (this.maxwinners) {
			let index = Math.floor(Math.random() * this.totalusers);
			if (!(userlist[index] in this.winners)) {
				this.winners[userlist[index]] = Users.get(userlist[index]);
				this.maxwinners--;
			}
		}
		this.onEnd();
	};
	LotteryGiveAway.prototype.onEnd = function (force) {
		if (force) {
			if (this.phase === 'ended') return;
			clearTimeout(this.drawTimer);
			this.room.addRaw("<b>The giveaway was forcibly ended as not enough users participated.</b>").update();
		} else {
			this.phase = 'ended';
			let finallist = [];
			for (let id in this.winners) {
				finallist.push(this.winners[id].name);
			}
			let multiWin = finallist.length > 1;
			finallist = finallist.join(', ');
			this.room.addRaw(
				"<div class='broadcast-blue'><font size='2'><b>Lottery Draw: </b></font>" + this.totalusers + " users have joined the lottery.<br/>" +
				"Our lucky winner" + (multiWin ? "s" : "") + ": <b>" + Tools.escapeHTML(finallist) + "!</b> Congratulations!"
			).update();

			for (let id in this.winners) {
				let targetUser = this.winners[id];
				if (targetUser.connected) targetUser.popup("You have won the lottery giveaway! PM **" + this.giver.name + "** to claim your prize!");
			}
			if (this.giver.connected) this.giver.popup("The following users have won your lottery giveaway:\n" + finallist);
		}
		delete giveaways[this.room.id];
	};
	return LotteryGiveAway;
})();

function spawnGiveaway(type, host, giver, room, options) {
	if (type === 'question') {
		giveaways[room.id] = new QuestionGiveAway(host, giver, room, options);
	} else {
		giveaways[room.id] = new LotteryGiveAway(host, giver, room, options);
	}
}

let commands = {
	// question giveaway.
	quiz: 'question',
	qg: 'question',
	question: function (target, room, user) {
		if (room.id !== 'wifi' || !this.can('warn', null, room) || !target) return false;
		if (giveaways[room.id]) return this.sendReply("There is already a giveaway going on!");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.sendReply("User '" + this.targetUsername + "' is not online.");

		target = target.split(',').map(function (val) { return val.trim(); });
		if (target.length !== 3) return this.sendReply("Invalid arguments specified - /question giver, prize, question, answer(s)");
		let options = {
			prize: target[0],
			question: target[1],
			answers: QuestionGiveAway.sanitizeAnswers(target[2])
		};
		if (!Object.keys(options.answers).length) return this.sendReply("You must specify at least one answer and it cannot contain any special characters.");

		spawnGiveaway('question', user, targetUser, room, options);
		this.privateModCommand("(" + user.name + " started a question giveaway for " + this.targetUsername + ")");
	},
	changeanswer: 'changequestion',
	changequestion: function (target, room, user, conn, cmd) {
		if (room.id !== 'wifi') return false;
		if (!giveaways[room.id]) return this.sendReply("There is no giveaway going on at the moment.");
		if (giveaways[room.id].type !== 'question') return this.sendReply("This is not a question giveaway.");

		target = target.trim();
		if (!target) return this.sendReply("You must include a question or an answer.");
		giveaways[room.id].change(cmd.substr(6), target, user, this);
	},
	showanswer: 'viewanswer',
	viewanswer: function (target, room, user) {
		if (room.id !== 'wifi') return false;
		let giveaway = giveaways[room.id];
		if (!giveaway) return this.sendReply("There is no giveaway going on at the moment.");
		if (giveaway.type !== 'question') return this.sendReply("This is not a question giveaway.");
		if (user.userid !== giveaway.host.userid && user.userid !== giveaway.giver.userid) return;

		let answers = [];
		for (let i in giveaway.answers) {
			answers.push(giveaway.answers[i]);
		}
		let anstext = (answers.length === 1) ? 'answer is ' : 'answers are ';
		this.sendReply("The giveaway question is " + giveaway.question + ".\n" +
			"The " + anstext + answers.join('/') + ".");
	},
	guessanswer: 'guess',
	guess: function (target, room, user) {
		if (room.id !== 'wifi') return this.sendReply("This command can only be used in the Wi-Fi room.");
		if (!giveaways[room.id]) return this.sendReply("There is no giveaway going on at the moment.");
		if (giveaways[room.id].type !== 'question') return this.sendReply("This is not a question giveaway.");
		giveaways[room.id].guessAnswer(user, target, this);
	},

	// lottery giveaway.
	lg: 'lottery',
	lotto: 'lottery',
	lottery: function (target, room, user) {
		if (room.id !== 'wifi' || !this.can('warn', null, room) || !target) return false;
		if (giveaways[room.id]) return this.sendReply("There is already a giveaway going on!");

		target = this.splitTarget(target);
		let targetUser = this.targetUser;
		if (!targetUser || !targetUser.connected) return this.sendReply("User '" + this.targetUsername + "' is not online.");

		target = target.split(',').map(function (val) { return val.trim(); });
		if (target.length !== 2) return this.sendReply("Invalid arguments specified - /lottery giver, prize, max winners");
		let options = {
			prize: target[0],
			maxwinners: parseInt(target[1])
		};
		if (options.maxwinners > 10 || options.maxwinners < 1 || isNaN(options.maxwinners)) return this.sendReply("The lottery giveaway can have a minimum of 1 and a maximum of 10 winners.");

		spawnGiveaway('lottery', user, targetUser, room, options);
		this.privateModCommand("(" + user.name + " started a lottery giveaway for " + this.targetUsername + ")");
	},
	leavelotto: 'join',
	leavelottery: 'join',
	leave: 'join',
	joinlotto: 'join',
	joinlottery: 'join',
	join: function (target, room, user, conn, cmd) {
		if (room.id !== 'wifi') return this.sendReply("This command can only be used in the Wi-Fi room.");
		let giveaway = giveaways[room.id];
		if (!giveaway) return this.sendReply("There is no giveaway going on at the moment.");
		if (giveaway.type !== 'lottery') return this.sendReply("This is not a lottery giveaway.");

		switch (cmd) {
		case 'joinlottery':
		case 'join':
		case 'joinlotto':
			giveaway.addUser(user, this);
			break;
		case 'leavelottery':
		case 'leave':
		case 'leavelotto':
			giveaway.removeUser(user, this);
			break;
		}
	},
	// general.
	stop: 'end',
	end: function (target, room, user) {
		if (room.id !== 'wifi') return this.sendReply("This command can only be used in the Wi-Fi room.");
		if (!giveaways[room.id]) return this.sendReply("There is no giveaway going on at the moment.");
		if (!this.can('warn', null, room) && user.userid !== giveaways[room.id].host.userid) return false;

		giveaways[room.id].onEnd(true);
	},
	rm: 'remind',
	remind: function (target, room, user) {
		if (room.id !== 'wifi') return this.sendReply("This command can only be used in the Wi-Fi room.");
		let giveaway = giveaways[room.id];
		if (!giveaway) return this.sendReply("There is no giveaway going on at the moment.");
		if (!this.canBroadcast()) return;
		if (giveaway.type === 'question') {
			if (giveaway.phase !== 'started') return this.sendReply("The giveaway has not started yet.");
			this.sendReply("|html|<div class='broadcast-blue'><font size='1'>Question Giveaway started by " + Tools.escapeHTML(giveaway.host.name) + "</font><br/>" +
				"<b>" + Tools.escapeHTML(giveaway.giver.name) + "</b> will be giving away a <b>" + Tools.escapeHTML(giveaway.prize) + "</b>!<br/>" +
				"Question: <b>" + Tools.escapeHTML(giveaway.question) + "</b>");
		} else {
			this.sendReply('|raw|' + giveaway.reminder);
		}
	},
	'': 'help',
	help: function (target, room, user) {
		if (room.id !== 'wifi') return this.sendReply("This command can only be used in the Wi-Fi room.");

		let reply = '';
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
			'- help user - shows list of participation commands<br />' +
			'- help staff - shows giveaway staff commands (Requires: % @ # & ~)';
		}
		this.sendReplyBox(reply);
	}
};

exports.commands = {
	'giveaway': commands,
	'ga': commands.guess,
	'gh': commands.help,
	'qg': commands.question,
	'lg': commands.lottery
};
