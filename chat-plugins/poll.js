/*
* Poll chat plugin
* This plugin allows roomauth (default: driver and above) to run a poll in a room.
* Every room can have one poll, and every user can vote. The results are displayed for
* users that have voted, and are updated in real time. The poll can be closed with /endpoll.
* By bumbadadabum with (a lot of) help from Zarel.
*/

var permission = 'announce';

var Poll = (function () {
	function Poll(room, question, options) {
		if (room.pollNumber) {
			room.pollNumber++;
		} else {
			room.pollNumber = 1;
		}
		this.room = room;
		this.question = question;
		this.voters = new Set();
		this.totalVotes = 0;

		this.options = new Map();
		for (var i = 0; i < options.length; i++) {
			this.options.set(i + 1, {name: options[i], votes: 0});
		}
	}

	Poll.prototype.vote = function (user, option) {
		if (this.voters.has(user.latestIp)) {
			return user.sendTo(this.room, "You have already voted for this poll.");
		} else {
			this.voters.add(user.latestIp);
		}

		this.options.get(option).votes++;
		this.totalVotes++;

		this.update();
	};

	Poll.prototype.generateVotes = function () {
		var output = '<div class="infobox" style="text-align:center"><p style="font-weight:bold;font-size:14pt">' + Tools.escapeHTML(this.question) + '</p>';
		this.options.forEach(function (option, number) {
			output += '<button value="/poll vote ' + number + '" name="send">' + number + '. ' + Tools.escapeHTML(option.name) + '</button><br/>';
		});
		output += '</div>';

		return output;
	};

	Poll.prototype.generateResults = function () {
		var output = '<div class="infobox" style="text-align:center"><p style="font-weight:bold;font-size:14pt">' + Tools.escapeHTML(this.question) + '</p>';
		var iter = this.options.entries();

		var i = iter.next();
		while (!i.done) {
			output += '<span style="font-weight:bold;padding:2px">' + i.value[0] + '. ' + Tools.escapeHTML(i.value[1].name) + '</span><br/><span style="font-size:8pt;padding:0px">' + i.value[1].votes + ' votes' + (this.totalVotes ? '(' + Math.round((i.value[1].votes * 100) / this.totalVotes) + '% of total)' : '') + '.</span><br/>';
			i = iter.next();
		}
		output += '</div>';

		return output;
	};

	Poll.prototype.update = function () {
		var results = this.generateResults();

		// Update the poll results for everyone that has voted
		for (var i in this.room.users) {
			var user = this.room.users[i];
			if (this.voters.has(user.latestIp)) {
				user.sendTo(this.room, '|uhtmlchange|poll' + this.room.pollNumber +  '|' + results);
			}
		}
	};

	Poll.prototype.display = function (user, broadcast) {
		var votes = this.generateVotes();
		var results = this.generateResults();

		var target = {};

		if (broadcast) {
			target = this.room.users;
		} else {
			target[0] = user;
		}

		for (var i in target) {
			var thisUser = target[i];
			if (this.voters.has(thisUser.latestIp)) {
				thisUser.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber +  '|' + results);
			} else {
				thisUser.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber +  '|' + votes);
			}
		}
	};

	Poll.prototype.end = function () {
		var results = this.generateResults();

		this.room.send('|uhtml|poll' + this.room.pollNumber +  '|' + results);
		this.room.send('|uhtmlchange|poll' + this.room.pollNumber +  '|' + results);
	};

	return Poll;
})();

exports.commands = {
	poll: {
		new: function (target, room, user) {
			var params = target.split(target.includes('|') ? '|' : ',').map(function (param) { return param.trim(); });

			if (!this.can(permission, null, room)) return false;
			if (room.poll) return this.errorReply("There is already a poll in progress in this room.");

			if (params.length < 3) {
				return this.errorReply("Not enough arguments for /poll new.");
			}

			var options = [];

			for (var i = 1; i < params.length; i++) {
				options.push(params[i]);
			}

			if (options.length > 8) {
				return this.errorReply("Too many options for poll (maximum is 8).");
			}

			room.poll = new Poll(room, params[0], options);
			room.poll.display(user, true);
			return this.privateModCommand("(A poll was started by " + user.name + ".)");
		},
		newhelp: ["/poll new [name] | [options] - Starts a new poll. Requires: % @ # & ~"],

		vote: function (target, room, user) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");
			if (!target) return this.errorReply("Please specify an option.");

			var parsed = parseInt(target);
			if (isNaN(parsed)) return this.errorReply("To vote, specify the number of the option.");

			if (!room.poll.options.has(parsed)) return this.sendReply("Option not in poll.");

			room.poll.vote(user, parsed);
		},
		votehelp: ["/poll vote [number] - Votes for option [number] in the poll. This can also be done by clicking the option in the poll itself."],

		end: function (target, room, user) {
			if (!this.can(permission, null, room)) return false;
			if (!room.poll) return this.errorReply("There is no poll running in this room.");

			room.poll.end();
			delete room.poll;
			return this.privateModCommand("(The poll was ended by " + user.name + ".)");
		},
		endhelp: ["/poll end - Ends the poll and displays the results in chat. Requires: % @ # & ~"],

		'': function (target, room, user) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");
			if (!this.canBroadcast()) return;

			room.poll.display(user, this.broadcasting);
		}
	}
};
