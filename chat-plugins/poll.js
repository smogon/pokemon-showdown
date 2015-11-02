/*
* Poll chat plugin
* By bumbadadabum and Zarel.
*/

var permission = 'broadcast';

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
		this.timeout = null;
		this.timeoutMins = 0;

		this.options = new Map();
		for (var i = 0; i < options.length; i++) {
			this.options.set(i + 1, {name: options[i], votes: 0});
		}
	}

	Poll.prototype.blankvote = function (user, option) {
		if (this.voters.has(user.latestIp)) {
			return user.sendTo(this.room, "You're already looking at the results.");
		} else {
			this.voters.add(user.latestIp);
		}

		this.update();
	};

	Poll.prototype.generateVotes = function () {
		var output = '<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Poll</span> <strong style="font-size:11pt">' + Tools.escapeHTML(this.question) + '</strong></p>';
		this.options.forEach(function (option, number) {
			output += '<div style="margin-top: 3px"><button value="/poll vote ' + number + '" name="send" title="Vote for ' + number + '. ' + Tools.escapeHTML(option.name) + '">' + number + '. <strong>' + Tools.escapeHTML(option.name) + '</strong></button></div>';
		});
		output += '</div>';

		return output;
	};

	Poll.prototype.generateResults = function (ended) {
		var icon = '<span style="border:1px solid #' + (ended ? '777;color:#555' : '6A6;color:#484') + ';border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> ' + (ended ? "Poll ended" : "Poll") + '</span>';
		var totalVotes = '<p align="left">[Total Votes: ' + this.totalVotes + ']</p>';
		var output = '<div class="infobox"><p style="margin: 2px 0 5px 0">' + icon + ' <strong style="font-size:11pt">' + Tools.escapeHTML(this.question) + '</strong></p>' + totalVotes;
		var iter = this.options.entries();

		var i = iter.next();
		var c = 0;
		var colors = ['#79A', '#8A8', '#88B'];
		while (!i.done) {
			var percentage = Math.round((i.value[1].votes * 100) / (this.totalVotes || 1));
			output += '<div style="margin-top: 3px"><span>' + i.value[0] + '. <strong>' + Tools.escapeHTML(i.value[1].name) + '</strong></span> <small style="font-size:8pt;padding-left:6px"> | ' + percentage + '% (' + i.value[1].votes + ' vote' + (i.value[1].votes === 1 ? '' : 's') + ')</small><br /><span style="background:' + colors[c % 3] + ';padding-right:' + (percentage * 3) + 'px"></span></div>';
			i = iter.next();
			c++;
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
		var results = this.generateResults(true);

		this.room.send('|uhtmlchange|poll' + this.room.pollNumber +  '|<div class="infobox">(The poll has ended &ndash; scroll down to see the results)</div>');
		this.room.send('|html|' + results);
	};

	return Poll;
})();

exports.commands = {
	poll: {
		create: 'new',
		new: function (target, room, user) {
			if (room.type === 'battle') return false;
			if (target.length > 1024) return this.errorReply("Poll too long.");
			var params = target.split(target.includes('|') ? '|' : ',').map(function (param) { return param.trim(); });

			if (!this.can(permission, null, room)) return false;
			if (room.poll) return this.errorReply("There is already a poll in progress in this room.");

			if (params.length < 3) return this.errorReply("Not enough arguments for /poll new.");
			var options = [];

			for (var i = 1; i < params.length; i++) {
				options.push(params[i]);
			}

			if (options.length > 12) {
				return this.errorReply("Too many options for poll (maximum is 12).");
			}

			room.poll = new Poll(room, params[0], options);
			room.poll.display(user, true);
			return this.privateModCommand("(A poll was started by " + user.name + ".)");
		},
		newhelp: ["/poll create [question], [option1], [option2], [...] - Creates a poll. Requires: % @ # & ~"],

		vote: function (target, room, user) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");
			if (!target) return this.errorReply("Please specify an option.");

			if (target === 'blank') {
				room.poll.blankvote(user);
				return;
			}

			var parsed = parseInt(target);
			if (isNaN(parsed)) return this.errorReply("To vote, specify the number of the option.");

			if (!room.poll.options.has(parsed)) return this.sendReply("Option not in poll.");

			room.poll.vote(user, parsed);
		},
		votehelp: ["/poll vote [number] - Votes for option [number]."],

		timer: function (target, room, user) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");

			if (target) {
				if (!this.can(permission, null, room)) return false;
				if (target === 'clear') {
					if (room.poll.timeout) {
						clearTimeout(room.poll.timeout);
						room.poll.timeout = null;
						room.poll.timeoutMins = 0;
						return room.add("The timeout for the poll was cleared.");
					} else {
						return this.errorReply("No timer to clear.");
					}
				}
				var timeout = parseFloat(target);
				if (isNaN(timeout) || timeout <= 0) return this.errorReply("Invalid time given.");
				if (room.poll.timeout) clearTimeout(room.poll.timeout);
				room.poll.timeoutMins = timeout;
				room.poll.timeout = setTimeout((function () {
					room.poll.end();
					delete room.poll;
				}), (timeout * 60000));
				room.add("The timeout for the poll was set to " + timeout + " minutes.");
				return this.privateModCommand("(The poll timeout was set to " + timeout + " minutes by " + user.name + ".)");
			} else {
				if (!this.canBroadcast()) return;
				if (room.poll.timeout) {
					return this.sendReply("The timeout for the poll is " + room.poll.timeoutMins + " minutes.");
				} else {
					return this.sendReply("There's no timer for this poll.");
				}
			}
		},
		timerhelp: ["/poll timer [minutes] - Sets the poll to automatically end after [minutes] minutes. Requires: % @ # & ~", "/poll timer clear - Clears the poll's timer. Requires: % @ # & ~"],

		results: function (target, room, user) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");

			return room.poll.blankvote(user);
		},
		resultshelp: ["/poll results - Shows the results of the poll without voting. NOTE: you can't go back and vote after using this."],

		close: 'end',
		stop: 'end',
		end: function (target, room, user) {
			if (!this.can(permission, null, room)) return false;
			if (!room.poll) return this.errorReply("There is no poll running in this room.");
			if (room.poll.timeout) clearTimeout(room.poll.timeout);

			room.poll.end();
			delete room.poll;
			return this.privateModCommand("(The poll was ended by " + user.name + ".)");
		},
		endhelp: ["/poll end - Ends a poll and displays the results. Requires: % @ # & ~"],
		
		timer: function (target, room, user) {
			if (!this.can(permission, null, room)) return false;
			if (!room.poll) return this.errorReply("There is no poll running in this room.");

			var timeout = parseFloat(target);
			if (isNaN(timeout)) return this.errorReply("No time given.");
			if (room.poll.timeout) clearTimeout(room.poll.timeout);
			room.poll.timeout = setTimeout((function () {
				room.poll.end();
				delete room.poll;
			}), (timeout * 60000));
			return this.privateModCommand("(The poll timeout was set to " + timeout + " minutes by " + user.name + ".)");
		},
		timerhelp: ["/poll timer [minutes] - Sets the poll to automatically end after [minutes] minutes. Requires: % @ # & ~"],

		pr: 'display',
		pollremind: 'display',
		display: function (target, room, user) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");
			if (!this.canBroadcast()) return;
			room.update();

			room.poll.display(user, this.broadcasting);
		},
		displayhelp: ["/poll display - Displays the poll"],

		show: 'display',
		display: function (target, room, user) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");
			if (!this.canBroadcast()) return;
			room.update();

			room.poll.display(user, this.broadcasting);
		},
		displayhelp: ["/poll display - Displays the poll"],

		'': function (target, room, user) {
			this.parse('/pollhelp');
		},
	},
	pollhelp: function(target, room, user) {
		if (!this.canBroadcast()) return;
		return this.sendReplyBox(
			"/poll allows rooms to run their own polls. These polls are limited to one poll at a time per room.<br />" +
			"The poll status is displayed to the users and updated in real time.<br />" +
			"Accepts the following commands:<br />" +
			"/poll create [question], [option1], [option2], [...] - Creates a poll. Requires: + % @ # & ~<br />" +
			"/poll vote [number] - Votes for option [number] (or click the button).<br />" +
			"/poll timer [minutes] - Sets the poll to automatically end after [minutes]. Requires: + % @ # & ~<br />" +
			"/poll display - Displays the poll<br />" +
			"/poll end - Ends a poll and displays the results. Requires: + % @ # & ~"
		);
	},
	votes: function(target, room, user) {
		if (!room.poll) return this.errorReply("There is no poll running in this room.");
		if (!this.canBroadcast()) return;
		var votes = room.poll.totalVotes;
		var lbl = (votes > 1 ? ' VOTES' : ' VOTE');
		return this.sendReplyBox("TOTAL VOTES: " + votes + lbl);
	},
	ep: 'endpoll',
	endpoll: function(target, room, user) {
		this.parse('/poll end');
	},
	pr: 'pollremind',
	pollremind: function(target, room, user) {
		if (!room.poll) return this.errorReply("There is no poll running in this room.");
		if (!this.canBroadcast()) return;
		room.update();

		room.poll.display(user, this.broadcasting);	
	},
	tierpoll: 'tpoll',
	tpoll: function(target, room, user) {
		var tiers = ['Anything Goes', 'Challenge Cup 1v1', 'Monotype', 'OU', 'Random Battle', 'Random Monotype Battle', 'Tier Shift', 'UU'];
		this.parse('/poll new Next tournament tier?, ' + tiers.sort());
	},
	vote: function(target, room, user) {
		if (!target) return this.errorReply("Usage: /vote [poll option number] - votes for the [option] in the current poll.");
		this.parse('/poll vote ' + target);
	}
};
