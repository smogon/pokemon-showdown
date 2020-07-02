/*
 * Poll chat plugin
 * By Asheviere and Zarel.
 */
import {Utils} from '../../lib/utils';

interface QuestionData {
	source: string; supportHTML: boolean;
}
interface Option {
	name: string; votes: number; correct?: boolean;
}

export class Poll {
	readonly activityId: 'poll';
	pollNumber: number;
	room: Room;
	question: string;
	supportHTML: boolean;
	multiPoll: boolean;
	pendingVotes: {[userid: string]: number[]};
	voters: {[k: string]: number[]};
	voterIps: {[k: string]: number[]};
	totalVotes: number;
	timeout: NodeJS.Timer | null;
	timeoutMins: number;
	isQuiz: boolean;
	options: Map<number, Option>;
	constructor(room: Room, questionData: QuestionData, options: string[], multi: boolean) {
		this.activityId = 'poll';
		this.pollNumber = room.nextGameNumber();
		this.room = room;
		this.question = questionData.source;
		this.supportHTML = questionData.supportHTML;
		this.multiPoll = multi;
		this.pendingVotes = {};
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

	select(user: User, option: number) {
		const userid = user.id;
		if (!this.multiPoll) {
			// vote immediately
			this.pendingVotes[userid] = [option];
			this.submit(user);
			return;
		}

		if (!this.pendingVotes[userid]) {
			this.pendingVotes[userid] = [];
		}
		this.pendingVotes[userid].push(option);
		this.updateFor(user);
	}
	deselect(user: User, option: number) {
		const userid = user.id;
		const pendingVote = this.pendingVotes[userid];
		if (!pendingVote || !pendingVote.includes(option)) {
			return user.sendTo(this.room, `That option is not selected.`);
		}
		pendingVote.splice(pendingVote.indexOf(option), 1);
		this.updateFor(user);
	}

	submit(user: User) {
		const ip = user.latestIp;
		const userid = user.id;

		if (userid in this.voters || ip in this.voterIps) {
			delete this.pendingVotes[userid];
			return user.sendTo(this.room, `You have already voted for this poll.`);
		}
		const selected = this.pendingVotes[userid];
		if (!selected) return user.sendTo(this.room, `No options selected.`);

		this.voters[userid] = selected;
		this.voterIps[ip] = selected;
		for (const option of selected) {
			this.options.get(option)!.votes++;
		}
		delete this.pendingVotes[userid];
		this.totalVotes++;

		this.update();
	}

	blankvote(user: User) {
		const ip = user.latestIp;
		const userid = user.id;

		if (!(userid in this.voters) || !(ip in this.voterIps)) {
			this.voters[userid] = [];
			this.voterIps[ip] = [];
		}

		this.updateTo(user);
	}

	generateVotes(user: User | null) {
		const iconText = this.isQuiz ? '<i class="fa fa-question"></i> Quiz' : '<i class="fa fa-bar-chart"></i> Poll';
		let output = `<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px">${iconText}</span> <strong style="font-size:11pt">${this.getQuestionMarkup()}</strong></p>`;

		if (this.multiPoll) {
			const empty = `<i class="fa fa-square-o" aria-hidden="true"></i>`;
			const chosen = `<i class="fa fa-check-square-o" aria-hidden="true"></i>`;

			const pendingVotes = (user && this.pendingVotes[user.id]) || [];
			for (const [num, option] of this.options) {
				const selected = pendingVotes.includes(num);
				output += `<div style="margin-top: 5px"><button style="text-align: left; border: none; background: none; color: inherit;" value="/poll ${selected ? 'de' : ''}select ${num}" name="send" title="${selected ? "Deselect" : "Select"} ${num}. ${Utils.escapeHTML(option.name)}">${selected ? "<strong>" : ''}${selected ? chosen : empty} ${num}. ${this.getOptionMarkup(option)}${selected ? "</strong>" : ''}</button></div>`;
			}
			// eslint-disable-next-line max-len
			const submitButton = pendingVotes.length ? `<button class="button" value="/poll submit" name="send" title="Submit your vote"><strong>Submit</strong></button>` : `<button class="button" value="/poll results" name="send" title="View results - you will not be able to vote after viewing results">(View results)</button`;
			output += `<div style="margin-top: 7px; padding-left: 12px">${submitButton}</div>`;
			output += `</div>`;
		} else {
			for (const [num, option] of this.options) {
				output += `<div style="margin-top: 5px"><button class="button" style="text-align: left" value="/poll vote ${num}" name="send" title="Vote for ${num}. ${Utils.escapeHTML(option.name)}">${num}. <strong>${this.getOptionMarkup(option)}</strong></button></div>`;
			}
			output += `<div style="margin-top: 7px; padding-left: 12px"><button value="/poll results" name="send" title="View results - you will not be able to vote after viewing results"><small>(View results)</small></button></div>`;
			output += `</div>`;
		}

		return output;
	}

	generateResults(ended = false, option: number[] | null = null) {
		const iconText = this.isQuiz ? '<i class="fa fa-question"></i> Quiz' : '<i class="fa fa-bar-chart"></i> Poll';
		const icon = `<span style="border:1px solid #${ended ? '777;color:#555' : '6A6;color:#484'};border-radius:4px;padding:0 3px">${iconText}${ended ? " ended" : ""}</span> <small>${this.totalVotes} vote${Chat.plural(this.totalVotes)}</small>`;
		let output = `<div class="infobox"><p style="margin: 2px 0 5px 0">${icon} <strong style="font-size:11pt">${this.getQuestionMarkup()}</strong></p>`;
		const iter = this.options.entries();

		let i = iter.next();
		let c = 0;
		const colors = ['#79A', '#8A8', '#88B'];
		while (!i.done) {
			const selected = option?.includes(i.value[0]);
			const percentage = Math.round((i.value[1].votes * 100) / (this.totalVotes || 1));
			const answerMarkup = this.isQuiz ?
				`<span style="color:${i.value[1].correct ? 'green' : 'red'};">${i.value[1].correct ? '' : '<s>'}${this.getOptionMarkup(i.value[1])}${i.value[1].correct ? '' : '</s>'}</span>` :
				this.getOptionMarkup(i.value[1]);
			output += `<div style="margin-top: 3px">${i.value[0]}. <strong>${selected ? '<em>' : ''}${answerMarkup}${selected ? '</em>' : ''}</strong> <small>(${i.value[1].votes} vote${i.value[1].votes === 1 ? '' : 's'})</small><br /><span style="font-size:7pt;background:${colors[c % 3]};padding-right:${percentage * 3}px"></span><small>&nbsp;${percentage}%</small></div>`;
			i = iter.next();
			c++;
		}
		if (!option && !ended) output += '<div><small>(You can\'t vote after viewing results)</small></div>';
		output += '</div>';

		return output;
	}

	getQuestionMarkup() {
		if (this.supportHTML) return this.question;
		return Utils.escapeHTML(this.question);
	}

	getOptionMarkup(option: Option) {
		if (this.supportHTML) return option.name;
		return Utils.escapeHTML(option.name);
	}

	update() {
		// Update the poll results for everyone that has voted
		const blankvote = this.generateResults(false);

		for (const id in this.room.users) {
			const user = this.room.users[id];
			const selection = this.voters[user.id] || this.voterIps[user.latestIp];
			if (selection) {
				if (selection.length) {
					user.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${this.generateResults(false, selection)}`);
				} else {
					user.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${blankvote}`);
				}
			}
		}
	}

	updateTo(user: User, connection: Connection | null = null) {
		const recipient = connection || user;
		const selection = this.voters[user.id] || this.voterIps[user.latestIp];
		if (selection) {
			recipient.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${this.generateResults(false, selection)}`);
		} else {
			recipient.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${this.generateVotes(user)}`);
		}
	}

	updateFor(user: User) {
		if (user.id in this.voters) {
			user.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${this.generateResults(false, this.voters[user.id])}`);
		} else {
			user.sendTo(this.room, `|uhtmlchange|poll${this.pollNumber}|${this.generateVotes(user)}`);
		}
	}

	display() {
		const blankvote = this.generateResults(false);
		const blankquestions = this.generateVotes(null);

		for (const id in this.room.users) {
			const thisUser = this.room.users[id];
			const selection = this.voters[thisUser.id] || this.voterIps[thisUser.latestIp];
			if (selection) {
				if (selection.length) {
					thisUser.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${this.generateResults(false, selection)}`);
				} else {
					thisUser.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${blankvote}`);
				}
			} else {
				if (this.multiPoll && thisUser.id in this.pendingVotes) {
					thisUser.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${this.generateVotes(thisUser)}`);
				} else {
					thisUser.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${blankquestions}`);
				}
			}
		}
	}

	displayTo(user: User, connection: Connection | null = null) {
		const recipient = connection || user;
		if (user.id in this.voters) {
			recipient.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${this.generateResults(false, this.voters[user.id])}`);
		} else if (user.latestIp in this.voterIps) {
			recipient.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${this.generateResults(
				false,
				this.voterIps[user.latestIp]
			)}`);
		} else {
			recipient.sendTo(this.room, `|uhtml|poll${this.pollNumber}|${this.generateVotes(user)}`);
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
		createmulti: 'new',
		htmlcreatemulti: 'new',
		queue: 'new',
		queuehtml: 'new',
		queuemulti: 'new',
		htmlqueuemulti: 'new',
		new(target, room, user, connection, cmd, message) {
			if (!target) return this.parse('/help poll new');
			target = target.trim();
			if (target.length > 1024) return this.errorReply("Poll too long.");
			if (room.battle) return this.errorReply("Battles do not support polls.");

			const text = this.filter(target);
			if (target !== text) return this.errorReply("You are not allowed to use filtered words in polls.");

			const supportHTML = cmd.includes('html');
			const multi = cmd.includes('multi');
			const queue = cmd.includes('queue');
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
			if (room.minorActivity && !queue) {
				return this.errorReply("There is already a poll or announcement in progress in this room.");
			}

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

			if (room.minorActivity) {
				if (!room.minorActivityQueue) room.minorActivityQueue = [];
				room.minorActivityQueue.push(new Poll(room, {source: params[0], supportHTML}, options, multi));
				this.modlog('QUEUEPOLL');
				return this.privateModAction(`${user.name} queued a poll.`);
			}
			room.minorActivity = new Poll(room, {source: params[0], supportHTML}, options, multi);
			room.minorActivity.display();

			this.roomlog(`${user.name} used ${message}`);
			this.modlog('POLL');
			return this.addModAction(`A poll was started by ${user.name}.`);
		},
		newhelp: [
			`/poll create [question], [option1], [option2], [...] - Creates a poll. Requires: % @ # &`,
			`/poll createmulti [question], [option1], [option2], [...] - Creates a poll, allowing for multiple answers to be selected. Requires: % @ # &`,
			`To queue a poll, use [queue], [queuemulti], or [htmlqueuemulti].`,
			`Polls can be used as quiz questions. To do this, prepend all correct answers with a +.`,
		],

		viewqueue(target, room, user) {
			if (!this.can('mute', null, room)) return false;
			this.parse(`/join view-pollqueue-${room.roomid}`);
		},
		viewqueuehelp: [`/viewqueue - view the queue of polls in the room. Requires: % @ # &`],

		clearqueue: 'deletequeue',
		deletequeue(target, room, user, connection, cmd) {
			if (!this.can('mute', null, room)) return false;
			if (!room.minorActivityQueue) {
				return this.errorReply("The queue is already empty.");
			}
			if (cmd === 'deletequeue' && room.minorActivityQueue.length !== 1 && !target) {
				return this.parse('/help deletequeue');
			}
			if (!target) {
				room.minorActivityQueue = null;
				this.modlog('CLEARQUEUE');
				this.sendReply(`Cleared poll queue.`);
			} else {
				const [slotString, roomid, update] = target.split(',');
				const slot = parseInt(slotString);
				const curRoom = roomid ? (Rooms.search(roomid) as ChatRoom | GameRoom) : room;
				if (!curRoom) return this.errorReply(`Room "${roomid}" not found.`);
				if (isNaN(slot)) return this.errorReply(`Can't delete poll at slot ${slotString} - "${slotString}" is not a number.`);
				if (!room.minorActivityQueue[slot - 1]) return this.errorReply(`There is no poll in queue at slot ${slot}.`);

				curRoom.minorActivityQueue!.splice(slot - 1, 1);
				if (!curRoom.minorActivityQueue?.length) curRoom.minorActivityQueue = null;

				curRoom.modlog(`(${curRoom.roomid}) DELETEQUEUE: by ${user}: ${slot}`);
				curRoom.sendMods(`(${user.name} deleted the queued poll in slot ${slot}.)`);
				curRoom.update();
				if (update) this.parse(`/j view-pollqueue-${curRoom}`);
			}
		},
		deletequeuehelp: [
			`/poll deletequeue [number] - deletes poll at the corresponding queue slot (1 = next, 2 = the one after that, etc). Requires: % @ # &`,
			`/poll clearqueue - deletes the queue of polls. Requires: % @ # &`,
		],

		deselect: 'select',
		vote: 'select',
		select(target, room, user, connection, cmd) {
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') {
				return this.errorReply("There is no poll running in this room.");
			}
			if (!target) return this.parse('/help poll vote');
			const poll = room.minorActivity;

			const parsed = parseInt(target);
			if (isNaN(parsed)) return this.errorReply("To vote, specify the number of the option.");

			if (!poll.options.has(parsed)) return this.sendReply("Option not in poll.");

			if (cmd === 'deselect') {
				poll.deselect(user, parsed);
			} else {
				poll.select(user, parsed);
			}
		},
		selecthelp: [
			`/poll select [number] - Select option [number].`,
			`/poll deselect [number] - Deselects option [number].`,
		],
		submit(target, room, user) {
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') {
				return this.errorReply("There is no poll running in this room.");
			}
			const poll = room.minorActivity;

			poll.submit(user);
		},
		submithelp: [`/poll submit - Submits your vote.`],

		timer(target, room, user) {
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') {
				return this.errorReply("There is no poll running in this room.");
			}
			const poll = room.minorActivity;

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
					if (room.minorActivityQueue?.length) {
						room.minorActivity = room.minorActivityQueue.shift()!;
						this.addModAction(`The queued poll was started.`);
						this.modlog(`POLL`, null, `queued`);
						room.minorActivity.display();
						if (!room.minorActivityQueue.length) room.minorActivityQueue = null;
					}
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
			`/poll timer [minutes] - Sets the poll to automatically end after [minutes] minutes. Requires: % @ # &`,
			`/poll timer clear - Clears the poll's timer. Requires: % @ # &`,
		],

		results(target, room, user) {
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') {
				return this.errorReply("There is no poll running in this room.");
			}
			const poll = room.minorActivity;

			return poll.blankvote(user);
		},
		resultshelp: [
			`/poll results - Shows the results of the poll without voting. NOTE: you can't go back and vote after using this.`,
		],

		close: 'end',
		stop: 'end',
		end(target, room, user) {
			if (!this.can('minigame', null, room)) return false;
			if (!this.canTalk()) return;
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') {
				return this.errorReply("There is no poll running in this room.");
			}
			const poll = room.minorActivity;
			if (poll.timeout) clearTimeout(poll.timeout);

			poll.end();
			room.minorActivity = null;
			if (room.minorActivityQueue?.length) {
				room.minorActivity = room.minorActivityQueue[0];
				room.minorActivityQueue.splice(0, 1);
				this.addModAction(`The queued poll was started.`);
				this.modlog(`POLL`, null, `queued`);
				room.minorActivity.display();
			}
			this.modlog('POLL END');
			return this.privateModAction(`(The poll was ended by ${user.name}.)`);
		},
		endhelp: [`/poll end - Ends a poll and displays the results. Requires: % @ # &`],

		show: '',
		display: '',
		''(target, room, user, connection) {
			if (!room.minorActivity || room.minorActivity.activityId !== 'poll') {
				return this.errorReply("There is no poll running in this room.");
			}
			const poll = room.minorActivity;
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
		`/poll create [question], [option1], [option2], [...] - Creates a poll. Requires: % @ # &`,
		`/poll createmulti [question], [option1], [option2], [...] - Creates a poll, allowing for multiple answers to be selected. Requires: % @ # &`,
		`/poll htmlcreate(multi) [question], [option1], [option2], [...] - Creates a poll, with HTML allowed in the question and options. Requires: # &`,
		`/poll vote [number] - Votes for option [number].`,
		`/poll timer [minutes] - Sets the poll to automatically end after [minutes]. Requires: % @ # &`,
		`/poll results - Shows the results of the poll without voting. NOTE: you can't go back and vote after using this.`,
		`/poll display - Displays the poll`,
		`/poll end - Ends a poll and displays the results. Requires: % @ # &`,
		`/poll deletequeue [number] - deletes poll at the corresponding queue slot (1 = next, 2 = the one after that, etc).`,
		`/poll clearqueue - deletes the queue of polls. Requires: % @ # &`,
		`/poll viewqueue - view the queue of polls in the room. Requires: % @ # &`,
	],
};

export const pages: PageTable = {
	pollqueue(args, user) {
		this.extractRoom();
		const room = Rooms.get(args[0]) as ChatRoom | GameRoom;
		let buf = `<div class = "pad"><strong>Queued polls:</strong>`;
		buf += `<button class="button" name="send" value="/join view-pollqueue-${room.roomid}" style="float: right">`;
		buf += `<i class="fa fa-refresh"></i> Refresh</button><br />`;
		if (!room.minorActivityQueue?.length) {
			buf += `<hr /><strong>No polls queued.</strong></div>`;
			return buf;
		}
		for (const [i, poll] of room.minorActivityQueue.entries()) {
			const button = (
				`<strong>#${i + 1} in queue </strong>` +
				`<button class="button" name="send" value="/poll deletequeue ${i + 1},${room.roomid},updatelist">` +
				`(delete)</button>`
			);
			buf += `<hr />`;
			buf += `${button}<br />${poll.generateResults()}`;
		}
		buf += `<hr />`;
		return buf;
	},
};
process.nextTick(() => {
	Chat.multiLinePattern.register('/poll (new|create|createmulti|htmlcreate|htmlcreatemulti|queue|queuemulti|htmlqueuemulti) ');
});
