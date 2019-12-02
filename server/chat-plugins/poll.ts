/*
 * Poll chat plugin
 * By bumbadadabum and Zarel.
 */

'use strict';

interface QuestionData {
	source: string; supportHTML: boolean;
}
interface Option {
	name: string; votes: number; correct?: boolean;
}

export class Poll {
	readonly activityId: 'poll';
	pollNumber: number;
	room: ChatRoom | GameRoom;
	question: string;
	supportHTML: boolean;
	voters: {[k: string]: number};
	voterIps: {[k: string]: number};
	totalVotes: number;
	timeout: NodeJS.Timer | null;
	timeoutMins: number;
	isQuiz: boolean;
	options: Map<number, Option>;
	constructor(room: ChatRoom | GameRoom, questionData: QuestionData, options: string[]) {
		this.activityId = 'poll';
		this.pollNumber = ++room.gameNumber;
		this.room = room;
		this.question = questionData.source;
		this.supportHTML = questionData.supportHTML;
		this.voters = {};
		this.voterIps = {};
		this.totalVotes = 0;
		this.timeout = null;
		this.timeoutMins = 0;
		this.isQuiz = false;

		this.options = new Map();
		for (const [i, option] of options.entries()) {
			const info: Option = {name: option, votes: 0};
			if (option.startsWith('+')) {
				this.isQuiz = true;
				info.correct = true;
				info.name = info.name.slice(1);
			}
			this.options.set(i + 1, info);
		}
	}

	vote(user: User, option: number) {
		const ip = user.latestIp;
		const userid = user.id;

		if (userid in this.voters || ip in this.voterIps) {
			return user.sendTo(this.room, `You have already voted for this poll.`);
		}

		this.voters[userid] = option;
		this.voterIps[ip] = option;
		this.options.get(option)!.votes++;
		this.totalVotes++;

		this.update();
	}

	blankvote(user: User) {
		const ip = user.latestIp;
		const userid = user.id;

		if (!(userid in this.voters) || !(ip in this.voterIps)) {
			this.voters[userid] = 0;
			this.voterIps[ip] = 0;
		}

		this.updateTo(user);
	}

	generateVotes() {
		const iconText = this.isQuiz ? '<i class="fa fa-question"></i> Quiz' : '<i class="fa fa-bar-chart"></i> Poll';
		let output = `<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px">${iconText}</span> <strong style="font-size:11pt">${this.getQuestionMarkup()}</strong></p>`;
		for (const [num, option] of this.options) {
			output += `<div style="margin-top: 5px"><button class="button" style="text-align: left" value="/poll vote ${num}" name="send" title="Vote for ${num}. ${Chat.escapeHTML(option.name)}">${num}. <strong>${this.getOptionMarkup(option)}</strong></button></div>`;
		}
		output += `<div style="margin-top: 7px; padding-left: 12px"><button value="/poll results" name="send" title="View results - you will not be able to vote after viewing results"><small>(View results)</small></button></div>`;
		output += `</div>`;

		return output;
	}

	generateResults(ended = false, option: number | null = 0) {
		const iconText = this.isQuiz ? '<i class="fa fa-question"></i> Quiz' : '<i class="fa fa-bar-chart"></i> Poll';
		const icon = `<span style="border:1px solid #${ended ? '777;color:#555' : '6A6;color:#484'};border-radius:4px;padding:0 3px">${iconText}${ended ? " ended" : ""}</span>`;
		let output = `<div class="infobox"><p style="margin: 2px 0 5px 0">${icon} <strong style="font-size:11pt">${this.getQuestionMarkup()}</strong></p>`;
		const iter = this.options.entries();

		let i = iter.next();
		let c = 0;
		const colors = ['#79A', '#8A8', '#88B'];
		while (!i.done) {
			const percentage = Math.round((i.value[1].votes * 100) / (this.totalVotes || 1));
			const answerMarkup = this.isQuiz ? `<span style="color:${i.value[1].correct ? 'green' : 'red'};">${i.value[1].correct ? '' : '<s>'}${this.getOptionMarkup(i.value[1])}${i.value[1].correct ? '' : '</s>'}</span>` : this.getOptionMarkup(i.value[1]);
			output += `<div style="margin-top: 3px">${i.value[0]}. <strong>${i.value[0] === option ? '<em>' : ''}${answerMarkup}${i.value[0] === option ? '</em>' : ''}</strong> <small>(${i.value[1].votes} vote${i.value[1].votes === 1 ? '' : 's'})</small><br /><span style="font-size:7pt;background:${colors[c % 3]};padding-right:${percentage * 3}px"></span><small>&nbsp;${percentage}%</small></div>`;
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

	getOptionMarkup(option: Option) {
		if (this.supportHTML) return option.name;
		return Chat.escapeHTML(option.name);
	}

	update() {
		const results = [];

		for (let i = 0; i <= this.options.size; i++) {
			results.push(this.generateResults(false, i));
		}

		// Update the poll results for everyone that has voted
		for (const id in this.room.users) {
			const user = this.room.users[id];
			if (user.id in this.voters) {
				user.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${results[this.voters[user.id]]}`);
			} else if (user.latestIp in this.voterIps) {
				user.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${results[this.voterIps[user.latestIp]]}`);
			}
		}
	}

	updateTo(user: User, connection: Connection | null = null) {
		const recipient = connection || user;
		if (user.id in this.voters) {
			recipient.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${this.generateResults(false, this.voters[user.id])}`);
		} else if (user.latestIp in this.voterIps) {
			recipient.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${this.generateResults(false, this.voterIps[user.latestIp])}`);
		} else {
			recipient.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${this.generateVotes()}`);
		}
	}

	updateFor(user: User) {
		if (user.id in this.voters) {
			user.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${this.generateResults(false, this.voters[user.id])}`);
		}
	}

	display() {
		const votes = this.generateVotes();

		const results = [];

		for (let i = 0; i <= this.options.size; i++) {
			results.push(this.generateResults(false, i));
		}

		for (const id in this.room.users) {
			const thisUser = this.room.users[id];
			if (thisUser.id in this.voters) {
				thisUser.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${results[this.voters[thisUser.id]]}`);
			} else if (thisUser.latestIp in this.voterIps) {
				thisUser.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${results[this.voterIps[thisUser.latestIp]]}`);
			} else {
				thisUser.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${votes}`);
			}
		}
	}

	displayTo(user: User, connection: Connection | null = null) {
		const recipient = connection || user;
		if (user.id in this.voters) {
			recipient.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${this.generateResults(false, this.voters[user.id])}`);
		} else if (user.latestIp in this.voterIps) {
			recipient.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${this.generateResults(false, this.voterIps[user.latestIp])}`);
		} else {
			recipient.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${this.generateVotes()}`);
		}
	}

	onConnect(user: User, connection: Connection | null = null) {
		this.displayTo(user, connection);
	}

	end() {
		const results = this.generateResults(true);

		this.room.send(`|uhtmlchange|poll${this.pollNumber}|<div class="infobox">(The poll has ended &ndash; scroll down to see the results)</div>`);
		this.room.add(`|html|${results}`).update();
	}
}

export const commands: ChatCommands = {
	poll: {
		htmlcreate: 'new',
		create: 'new',
		new(target, room, user, connection, cmd, message) {
			if (!target) return this.parse('/help poll new');
			target = target.trim();
			if (target.length > 1024) return this.errorReply("Poll too long.");
			if (room.battle) return this.errorReply("Battles do not support polls.");

			const text = this.filter(target);
			if (target !== text) return this.errorReply("You are not allowed to use filtered words in polls.");

			const supportHTML = cmd === 'htmlcreate';
			let separator = '';
			if (text.includes('\n')) {
				separator = '\n';
			} else if (text.includes('|')) {
				separator = '|';
			} else if (text.includes(',')) {
				separator = ',';
			} else {
				return this.errorReply("Not enough arguments for /poll new.");
			}

			let params = text.split(separator).map(param => param.trim());

			if (!this.can('minigame', null, room)) return false;
			if (supportHTML && !this.can('declare', null, room)) return false;
			if (!this.canTalk()) return;
			if (room.minorActivity) return this.errorReply("There is already a poll or announcement in progress in this room.");
			if (params.length < 3) return this.errorReply("Not enough arguments for /poll new.");

			// @ts-ignore In the case that any of these are null, the function is terminated, and the result never used.
			if (supportHTML) params = params.map(parameter => this.canHTML(parameter));
			if (params.some(parameter => !parameter)) return;

			const options = params.splice(1);
			if (options.length > 8) {
				return this.errorReply("Too many options for poll (maximum is 8).");
			}

			if (new Set(options).size !== options.length) {
				return this.errorReply("There are duplicate options in the poll.");
			}

			room.minorActivity = new Poll(room, {source: params[0], supportHTML}, options);
			room.minorActivity.display();

			this.roomlog(`${user.name} used ${message}`);
			this.modlog('POLL');
			return this.addModAction(`A poll was started by ${user.name}.`);
		},
		newhelp: [
			`/poll create [question], [option1], [option2], [...] - Creates a poll. Requires: % @ # & ~`,
			`Polls can be used as quiz questions. To do this, prepend all correct answers with a +.`,
		],

		vote(target, room, user) {
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') return this.errorReply("There is no poll running in this room.");
			if (!target) return this.parse('/help poll vote');
			const poll = room.minorActivity as Poll;
			if (target === 'blank') {
				poll.blankvote(user);
				return;
			}

			const parsed = parseInt(target);
			if (isNaN(parsed)) return this.errorReply("To vote, specify the number of the option.");

			if (!poll.options.has(parsed)) return this.sendReply("Option not in poll.");

			poll.vote(user, parsed);
		},
		votehelp: [`/poll vote [number] - Votes for option [number].`],

		timer(target, room, user) {
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') return this.errorReply("There is no poll running in this room.");
			const poll = room.minorActivity as Poll;

			if (target) {
				if (!this.can('minigame', null, room)) return false;
				if (target === 'clear') {
					if (!poll.timeout) return this.errorReply("There is no timer to clear.");
					clearTimeout(poll.timeout);
					poll.timeout = null;
					poll.timeoutMins = 0;
					return this.add("The poll timer was turned off.");
				}
				const timeout = parseFloat(target);
				if (isNaN(timeout) || timeout <= 0 || timeout > 0x7FFFFFFF) return this.errorReply("Invalid time given.");
				if (poll.timeout) clearTimeout(poll.timeout);
				poll.timeoutMins = timeout;
				poll.timeout = setTimeout(() => {
					if (poll) poll.end();
					room.minorActivity = null;
				}, timeout * 60000);
				room.add(`The poll timer was turned on: the poll will end in ${timeout} minute(s).`);
				this.modlog('POLL TIMER', null, `${timeout} minutes`);
				return this.privateModAction(`(The poll timer was set to ${timeout} minute(s) by ${user.name}.)`);
			} else {
				if (!this.runBroadcast()) return;
				if (poll.timeout) {
					return this.sendReply(`The poll timer is on and will end in ${poll.timeoutMins} minute(s).`);
				} else {
					return this.sendReply("The poll timer is off.");
				}
			}
		},
		timerhelp: [
			`/poll timer [minutes] - Sets the poll to automatically end after [minutes] minutes. Requires: % @ # & ~`,
			`/poll timer clear - Clears the poll's timer. Requires: % @ # & ~`,
		],

		results(target, room, user) {
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') return this.errorReply("There is no poll running in this room.");
			const poll = room.minorActivity as Poll;

			return poll.blankvote(user);
		},
		resultshelp: [`/poll results - Shows the results of the poll without voting. NOTE: you can't go back and vote after using this.`],

		close: 'end',
		stop: 'end',
		end(target, room, user) {
			if (!this.can('minigame', null, room)) return false;
			if (!this.canTalk()) return;
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') return this.errorReply("There is no poll running in this room.");
			const poll = room.minorActivity as Poll;
			if (poll.timeout) clearTimeout(poll.timeout);

			poll.end();
			room.minorActivity = null;
			this.modlog('POLL END');
			return this.privateModAction(`(The poll was ended by ${user.name}.)`);
		},
		endhelp: [`/poll end - Ends a poll and displays the results. Requires: % @ # & ~`],

		show: '',
		display: '',
		''(target, room, user, connection) {
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') return this.errorReply("There is no poll running in this room.");
			const poll = room.minorActivity as Poll;
			if (!this.runBroadcast()) return;
			room.update();

			if (this.broadcasting) {
				poll.display();
			} else {
				poll.displayTo(user, connection);
			}
		},
		displayhelp: [`/poll display - Displays the poll`],
	},
	pollhelp: [
		`/poll allows rooms to run their own polls. These polls are limited to one poll at a time per room.`,
		`Polls can be used as quiz questions. To do this, prepend all correct answers with a +.`,
		`Accepts the following commands:`,
		`/poll create [question], [option1], [option2], [...] - Creates a poll. Requires: % @ # & ~`,
		`/poll htmlcreate [question], [option1], [option2], [...] - Creates a poll, with HTML allowed in the question and options. Requires: # & ~`,
		`/poll vote [number] - Votes for option [number].`,
		`/poll timer [minutes] - Sets the poll to automatically end after [minutes]. Requires: % @ # & ~`,
		`/poll results - Shows the results of the poll without voting. NOTE: you can't go back and vote after using this.`,
		`/poll display - Displays the poll`,
		`/poll end - Ends a poll and displays the results. Requires: % @ # & ~`,
	],
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/poll (new|create|htmlcreate) ');
});
