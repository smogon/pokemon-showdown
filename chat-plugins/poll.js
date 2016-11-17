/*
* Poll chat plugin
* By bumbadadabum and Zarel.
*/

'use strict';

class Poll {
	constructor(room, questionData, options) {
		if (room.pollNumber) {
			room.pollNumber++;
		} else {
			room.pollNumber = 1;
		}
		this.room = room;
		this.question = questionData.source;
		this.supportHTML = questionData.supportHTML;
		this.voters = {};
		this.voterIps = {};
		this.totalVotes = 0;
		this.timeout = null;
		this.timeoutMins = 0;

		this.options = new Map();
		for (let i = 0; i < options.length; i++) {
			this.options.set(i + 1, {name: options[i], votes: 0});
		}
	}

	vote(user, option) {
		let ip = user.latestIp;
		let userid = user.userid;

		if (userid in this.voters || ip in this.voterIps) {
			return user.sendTo(this.room, "You have already voted for this poll.");
		}

		this.voters[userid] = option;
		this.voterIps[ip] = option;
		this.options.get(option).votes++;
		this.totalVotes++;

		this.update();
	}

	blankvote(user, option) {
		let ip = user.latestIp;
		let userid = user.userid;

		if (userid in this.voters || ip in this.voterIps) {
			user.sendTo(this.room, "You're already looking at the results.");
		} else {
			this.voters[userid] = 0;
			this.voterIps[ip] = 0;
		}

		this.updateTo(user);
	}

	generateVotes() {
		let output = '<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> Poll</span> <strong style="font-size:11pt">' + this.getQuestionMarkup() + '</strong></p>';
		this.options.forEach((option, number) => {
			output += '<div style="margin-top: 5px"><button class="button" value="/poll vote ' + number + '" name="send" title="Vote for ' + number + '. ' + Chat.escapeHTML(option.name) + '">' + number + '. <strong>' + this.getOptionMarkup(option) + '</strong></button></div>';
		});
		output += '<div style="margin-top: 7px; padding-left: 12px"><button value="/poll results" name="send" title="View results - you will not be able to vote after viewing results"><small>(View results)</small></button></div>';
		output += '</div>';

		return output;
	}

	generateResults(ended, option) {
		let icon = '<span style="border:1px solid #' + (ended ? '777;color:#555' : '6A6;color:#484') + ';border-radius:4px;padding:0 3px"><i class="fa fa-bar-chart"></i> ' + (ended ? "Poll ended" : "Poll") + '</span>';
		let output = '<div class="infobox"><p style="margin: 2px 0 5px 0">' + icon + ' <strong style="font-size:11pt">' + this.getQuestionMarkup() + '</strong></p>';
		let iter = this.options.entries();

		let i = iter.next();
		let c = 0;
		let colors = ['#79A', '#8A8', '#88B'];
		while (!i.done) {
			let percentage = Math.round((i.value[1].votes * 100) / (this.totalVotes || 1));
			output += '<div style="margin-top: 3px">' + i.value[0] + '. <strong>' + (i.value[0] === option ? '<em>' : '') + this.getOptionMarkup(i.value[1]) + (i.value[0] === option ? '</em>' : '') + '</strong> <small>(' + i.value[1].votes + ' vote' + (i.value[1].votes === 1 ? '' : 's') + ')</small><br /><span style="font-size:7pt;background:' + colors[c % 3] + ';padding-right:' + (percentage * 3) + 'px"></span><small>&nbsp;' + percentage + '%</small></div>';
			i = iter.next();
			c++;
		}
		if (option === 0 && !ended) output += '<div><small>(You can\'t vote after viewing results)</small></div>';
		output += '</div>';

		return output;
	}

	getQuestionMarkup() {
		if (this.supportHTML) return this.question;
		return Chat.escapeHTML(this.question);
	}

	getOptionMarkup(option) {
		if (this.supportHTML) return option.name;
		return Chat.escapeHTML(option.name);
	}

	update() {
		let results = [];

		for (let i = 0; i <= this.options.size; i++) {
			results.push(this.generateResults(false, i));
		}

		// Update the poll results for everyone that has voted
		for (let i in this.room.users) {
			let user = this.room.users[i];
			if (user.userid in this.voters) {
				user.sendTo(this.room, '|uhtmlchange|poll' + this.room.pollNumber + '|' + results[this.voters[user.userid]]);
			} else if (user.latestIp in this.voterIps) {
				user.sendTo(this.room, '|uhtmlchange|poll' + this.room.pollNumber + '|' + results[this.voterIps[user.latestIp]]);
			}
		}
	}

	updateTo(user, connection) {
		if (!connection) connection = user;
		if (user.userid in this.voters) {
			connection.sendTo(this.room, '|uhtmlchange|poll' + this.room.pollNumber + '|' + this.generateResults(false, this.voters[user.userid]));
		} else if (user.latestIp in this.voterIps) {
			connection.sendTo(this.room, '|uhtmlchange|poll' + this.room.pollNumber + '|' + this.generateResults(false, this.voterIps[user.latestIp]));
		} else {
			connection.sendTo(this.room, '|uhtmlchange|poll' + this.room.pollNumber + '|' + this.generateVotes());
		}
	}

	updateFor(user) {
		if (user.userid in this.voters) {
			user.sendTo(this.room, '|uhtmlchange|poll' + this.room.pollNumber + '|' + this.generateResults(false, this.voters[user.userid]));
		}
	}

	display() {
		let votes = this.generateVotes();

		let results = [];

		for (let i = 0; i <= this.options.size; i++) {
			results.push(this.generateResults(false, i));
		}

		for (let i in this.room.users) {
			let thisUser = this.room.users[i];
			if (thisUser.userid in this.voters) {
				thisUser.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber + '|' + results[this.voters[thisUser.userid]]);
			} else if (thisUser.latestIp in this.voterIps) {
				thisUser.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber + '|' + results[this.voterIps[thisUser.latestIp]]);
			} else {
				thisUser.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber + '|' + votes);
			}
		}
	}

	displayTo(user, connection) {
		if (!connection) connection = user;
		if (user.userid in this.voters) {
			connection.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber + '|' + this.generateResults(false, this.voters[user.userid]));
		} else if (user.latestIp in this.voterIps) {
			connection.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber + '|' + this.generateResults(false, this.voterIps[user.latestIp]));
		} else {
			connection.sendTo(this.room, '|uhtml|poll' + this.room.pollNumber + '|' + this.generateVotes());
		}
	}

	onConnect(user, connection) {
		this.displayTo(user, connection);
	}

	end() {
		let results = this.generateResults(true);

		this.room.send('|uhtmlchange|poll' + this.room.pollNumber + '|<div class="infobox">(The poll has ended &ndash; scroll down to see the results)</div>');
		this.room.add('|html|' + results);
	}
}

exports.Poll = Poll;

exports.commands = {
	poll: {
		htmlcreate: 'new',
		create: 'new',
		new: function (target, room, user, connection, cmd, message) {
			if (!target) return this.parse('/help poll new');
			if (target.length > 1024) return this.errorReply("Poll too long.");

			const supportHTML = cmd === 'htmlcreate';
			let separator = '';
			if (target.includes('\n')) {
				separator = '\n';
			} else if (target.includes('|')) {
				separator = '|';
			} else if (target.includes(',')) {
				separator = ',';
			} else {
				return this.errorReply("Not enough arguments for /poll new.");
			}

			let params = target.split(separator).map(param => param.trim());

			if (!this.can('minigame', null, room)) return false;
			if (supportHTML && !this.can('declare', null, room)) return false;
			if (!this.canTalk()) return;
			if (room.poll) return this.errorReply("There is already a poll in progress in this room.");
			if (params.length < 3) return this.errorReply("Not enough arguments for /poll new.");

			if (supportHTML) params = params.map(parameter => this.canHTML(parameter));
			if (params.some(parameter => !parameter)) return;

			const options = params.splice(1);
			if (options.length > 8) {
				return this.errorReply("Too many options for poll (maximum is 8).");
			}

			room.poll = new Poll(room, {source: params[0], supportHTML: supportHTML}, options);
			room.poll.display();

			this.logEntry("" + user.name + " used " + message);
			return this.privateModCommand("(A poll was started by " + user.name + ".)");
		},
		newhelp: ["/poll create [question], [option1], [option2], [...] - Creates a poll. Requires: % @ * # & ~"],

		vote: function (target, room, user) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");
			if (!target) return this.parse('/help poll vote');

			if (target === 'blank') {
				room.poll.blankvote(user);
				return;
			}

			let parsed = parseInt(target);
			if (isNaN(parsed)) return this.errorReply("To vote, specify the number of the option.");

			if (!room.poll.options.has(parsed)) return this.sendReply("Option not in poll.");

			room.poll.vote(user, parsed);
		},
		votehelp: ["/poll vote [number] - Votes for option [number]."],

		timer: function (target, room, user) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");

			if (target) {
				if (!this.can('minigame', null, room)) return false;
				if (target === 'clear') {
					if (!room.poll.timeout) return this.errorReply("There is no timer to clear.");
					clearTimeout(room.poll.timeout);
					room.poll.timeout = null;
					room.poll.timeoutMins = 0;
					return this.add("The poll timer was turned off.");
				}
				let timeout = parseFloat(target);
				if (isNaN(timeout) || timeout <= 0 || timeout > 0x7FFFFFFF) return this.errorReply("Invalid time given.");
				if (room.poll.timeout) clearTimeout(room.poll.timeout);
				room.poll.timeoutMins = timeout;
				room.poll.timeout = setTimeout(() => {
					room.poll.end();
					delete room.poll;
				}, (timeout * 60000));
				room.add("The poll timer was turned on: the poll will end in " + timeout + " minute(s).");
				return this.privateModCommand("(The poll timer was set to " + timeout + " minute(s) by " + user.name + ".)");
			} else {
				if (!this.runBroadcast()) return;
				if (room.poll.timeout) {
					return this.sendReply("The poll timer is on and will end in " + room.poll.timeoutMins + " minute(s).");
				} else {
					return this.sendReply("The poll timer is off.");
				}
			}
		},
		timerhelp: ["/poll timer [minutes] - Sets the poll to automatically end after [minutes] minutes. Requires: % @ * # & ~", "/poll timer clear - Clears the poll's timer. Requires: % @ * # & ~"],

		results: function (target, room, user) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");

			return room.poll.blankvote(user);
		},
		resultshelp: ["/poll results - Shows the results of the poll without voting. NOTE: you can't go back and vote after using this."],

		close: 'end',
		stop: 'end',
		end: function (target, room, user) {
			if (!this.can('minigame', null, room)) return false;
			if (!this.canTalk()) return;
			if (!room.poll) return this.errorReply("There is no poll running in this room.");
			if (room.poll.timeout) clearTimeout(room.poll.timeout);

			room.poll.end();
			delete room.poll;
			return this.privateModCommand("(The poll was ended by " + user.name + ".)");
		},
		endhelp: ["/poll end - Ends a poll and displays the results. Requires: % @ * # & ~"],

		show: 'display',
		display: function (target, room, user, connection) {
			if (!room.poll) return this.errorReply("There is no poll running in this room.");
			if (!this.runBroadcast()) return;
			room.update();

			if (this.broadcasting) {
				room.poll.display();
			} else {
				room.poll.displayTo(user, connection);
			}
		},
		displayhelp: ["/poll display - Displays the poll"],

		'': function (target, room, user) {
			this.parse('/help poll');
		},
	},
	pollhelp: [
		"/poll allows rooms to run their own polls. These polls are limited to one poll at a time per room.",
		"Accepts the following commands:",
		"/poll create [question], [option1], [option2], [...] - Creates a poll. Requires: % @ * # & ~",
		"/poll htmlcreate [question], [option1], [option2], [...] - Creates a poll, with HTML allowed in the question and options. Requires: # & ~",
		"/poll vote [number] - Votes for option [number].",
		"/poll timer [minutes] - Sets the poll to automatically end after [minutes]. Requires: % @ * # & ~",
		"/poll results - Shows the results of the poll without voting. NOTE: you can't go back and vote after using this.",
		"/poll display - Displays the poll",
		"/poll end - Ends a poll and displays the results. Requires: % @ * # & ~",
	],
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/poll (new|create|htmlcreate) ');
});
