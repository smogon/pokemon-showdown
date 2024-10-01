/*
 * Poll chat plugin
 * By bumbadadabum and Zarel.
 */
import {Utils} from '../../lib';

const MINUTES = 60000;
const MAX_QUESTIONS = 10;

interface PollAnswer {
	name: string; votes: number; correct?: boolean;
}

export interface PollOptions {
	activityNumber?: number;
	question: string;
	supportHTML: boolean;
	multiPoll: boolean;
	pendingVotes?: {[userid: string]: number[]};
	voters?: {[k: string]: number[]};
	voterIps?: {[k: string]: number[]};
	maxVotes?: number;
	totalVotes?: number;
	timeoutMins?: number;
	timerEnd?: number;
	isQuiz?: boolean;
	answers: string[] | PollAnswer[];
}

export interface PollData extends PollOptions {
	readonly activityid: 'poll';
}

export class Poll extends Rooms.MinorActivity {
	readonly activityid = 'poll' as ID;
	name = "Poll";
	activityNumber: number;
	question: string;
	multiPoll: boolean;
	pendingVotes: {[userid: string]: number[]};
	voters: {[k: string]: number[]};
	voterIps: {[k: string]: number[]};
	totalVotes: number;
	isQuiz: boolean;
	/** Max votes of 0 means no vote cap */
	maxVotes: number;
	answers: Map<number, PollAnswer>;
	constructor(room: Room, options: PollOptions) {
		super(room);
		this.activityNumber = options.activityNumber || room.nextGameNumber();
		this.question = options.question;
		this.supportHTML = options.supportHTML;
		this.multiPoll = options.multiPoll;
		this.pendingVotes = options.pendingVotes || {};
		this.voters = options.voters || {};
		this.voterIps = options.voterIps || {};
		this.totalVotes = options.totalVotes || 0;
		this.maxVotes = options.maxVotes || 0;

		// backwards compatibility
		if (!options.answers) options.answers = (options as any).questions;

		this.answers = Poll.getAnswers(options.answers);
		this.isQuiz = options.isQuiz ?? [...this.answers.values()].some(answer => answer.correct);
		this.setTimer(options);
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
		if (this.pendingVotes[userid].includes(option)) {
			throw new Chat.ErrorMessage(this.room.tr`That option is already selected.`);
		}
		this.pendingVotes[userid].push(option);
		this.updateFor(user);
		this.save();
	}

	deselect(user: User, option: number) {
		const userid = user.id;
		const pendingVote = this.pendingVotes[userid];
		if (!pendingVote?.includes(option)) {
			throw new Chat.ErrorMessage(this.room.tr`That option is not selected.`);
		}
		pendingVote.splice(pendingVote.indexOf(option), 1);
		this.updateFor(user);
		this.save();
	}

	submit(user: User) {
		const ip = user.latestIp;
		const userid = user.id;

		if (userid in this.voters || (!Config.noipchecks && ip in this.voterIps)) {
			delete this.pendingVotes[userid];
			throw new Chat.ErrorMessage(this.room.tr`You have already voted for this poll.`);
		}
		const selected = this.pendingVotes[userid];
		if (!selected) throw new Chat.ErrorMessage(this.room.tr`No options selected.`);

		this.voters[userid] = selected;
		this.voterIps[ip] = selected;
		for (const option of selected) {
			this.answers.get(option)!.votes++;
		}
		delete this.pendingVotes[userid];
		this.totalVotes++;
		if (this.maxVotes && this.totalVotes >= this.maxVotes) {
			this.end(this.room);
			return this.room
				.add(`|c|~|/log The poll hit the max vote cap of ${this.maxVotes}, and has ended.`)
				.update();
		}

		this.update();
		this.save();
	}

	blankvote(user: User) {
		const ip = user.latestIp;
		const userid = user.id;

		if (!(userid in this.voters) || !(ip in this.voterIps)) {
			this.voters[userid] = [];
			this.voterIps[ip] = [];
		}

		this.updateTo(user);
		this.save();
	}

	generateVotes(user: User | null) {
		const iconText = this.isQuiz ?
			`<i class="fa fa-question"></i> ${this.room.tr`Quiz`}` :
			`<i class="fa fa-bar-chart"></i> ${this.room.tr`Poll`}`;
		let output = `<div class="infobox"><p style="margin: 2px 0 5px 0"><span style="border:1px solid #6A6;color:#484;border-radius:4px;padding:0 3px">${iconText}</span>`;
		output += ` <strong style="font-size:11pt">${Poll.getQuestionMarkup(this.question, this.supportHTML)}</strong></p>`;

		if (this.multiPoll) {
			const empty = `<i class="fa fa-square-o" aria-hidden="true"></i>`;
			const chosen = `<i class="fa fa-check-square-o" aria-hidden="true"></i>`;

			const pendingVotes = (user && this.pendingVotes[user.id]) || [];
			for (const [num, answer] of this.answers) {
				const selected = pendingVotes.includes(num);
				output += `<div style="margin-top: 5px"><button style="text-align: left; border: none; background: none; color: inherit;" value="/poll ${selected ? 'de' : ''}select ${num}" name="send" title="${selected ? "Deselect" : "Select"} ${num}. ${Utils.escapeHTML(answer.name)}">${selected ? "<strong>" : ''}${selected ? chosen : empty} ${num}. `;
				output += `${Poll.getAnswerMarkup(answer, this.supportHTML)}${selected ? "</strong>" : ''}</button></div>`;
			}
			const submitButton = pendingVotes.length ? (
				`<button class="button" value="/poll submit" name="send" title="${this.room.tr`Submit your vote`}"><strong>${this.room.tr`Submit`}</strong></button>`
			) : (
				`<button class="button" value="/poll results" name="send" title="${this.room.tr`View results`} - ${this.room.tr`you will not be able to vote after viewing results`}">(${this.room.tr`View results`})</button>`
			);
			output += `<div style="margin-top: 7px; padding-left: 12px">${submitButton}</div>`;
			output += `</div>`;
		} else {
			for (const [num, answer] of this.answers) {
				output += `<div style="margin-top: 5px"><button class="button" style="text-align: left" value="/poll vote ${num}" name="send" title="${this.room.tr`Vote for ${num}`}. ${Utils.escapeHTML(answer.name)}">${num}.`;
				output += ` <strong>${Poll.getAnswerMarkup(answer, this.supportHTML)}</strong></button></div>`;
			}
			output += `<div style="margin-top: 7px; padding-left: 12px"><button value="/poll results" name="send" title="${this.room.tr`View results`} - ${this.room.tr`you will not be able to vote after viewing results`}"><small>(${this.room.tr`View results`})</small></button></div>`;
			output += `</div>`;
		}

		return output;
	}

	static generateResults(
		options: Rooms.MinorActivityData, room: Room,
		ended = false, choice: number[] | null = null
	) {
		const iconText = options.isQuiz ?
			`<i class="fa fa-question"></i> ${room.tr`Quiz`}` :
			`<i class="fa fa-bar-chart"></i> ${room.tr`Poll`}`;
		const icon = `<span style="border:1px solid #${ended ? '777;color:#555' : '6A6;color:#484'};border-radius:4px;padding:0 3px">${iconText}${ended ? ' ' + room.tr`ended` : ""}</span> <small>${options.totalVotes || 0} ${room.tr`votes`}</small>`;
		let output = `<div class="infobox"><p style="margin: 2px 0 5px 0">${icon} <strong style="font-size:11pt">${this.getQuestionMarkup(options.question, options.supportHTML)}</strong></p>`;
		const answers = Poll.getAnswers(options.answers);

		// indigo, blue, green
		// nums start at 1 so the actual order is 1. blue, 2. green, 3. indigo, 4. blue
		const colors = ['#88B', '#79A', '#8A8'];
		for (const [num, answer] of answers) {
			const chosen = choice?.includes(num);
			const percentage = Math.round((answer.votes * 100) / (options.totalVotes || 1));
			const answerMarkup = options.isQuiz ?
				`<span style="color:${answer.correct ? 'green' : 'red'};">${answer.correct ? '' : '<s>'}${this.getAnswerMarkup(answer, options.supportHTML)}${answer.correct ? '' : '</s>'}</span>` :
				this.getAnswerMarkup(answer, options.supportHTML);
			output += `<div style="margin-top: 3px">${num}. <strong>${chosen ? '<em>' : ''}${answerMarkup}${chosen ? '</em>' : ''}</strong> <small>(${answer.votes} vote${answer.votes === 1 ? '' : 's'})</small><br /><span style="font-size:7pt;background:${colors[num % 3]};padding-right:${percentage * 3}px"></span><small>&nbsp;${percentage}%</small></div>`;
		}
		if (!choice && !ended) {
			output += `<div><small>(${room.tr`You can't vote after viewing results`})</small></div>`;
		}
		output += '</div>';

		return output;
	}

	static getQuestionMarkup(question: string, supportHTML = false) {
		if (supportHTML) return question;
		return Chat.formatText(question);
	}

	static getAnswerMarkup(answer: PollAnswer, supportHTML = false) {
		if (supportHTML) return answer.name;
		return Chat.formatText(answer.name);
	}

	update() {
		const state = this.toJSON();
		// Update the poll results for everyone that has voted
		const blankvote = Poll.generateResults(state, this.room, false);

		for (const id in this.room.users) {
			const user = this.room.users[id];
			const selection = this.voters[user.id] || this.voterIps[user.latestIp];
			if (selection) {
				if (selection.length) {
					user.sendTo(
						this.room,
						`|uhtmlchange|poll${this.activityNumber}|${Poll.generateResults(state, this.room, false, selection)}`
					);
				} else {
					user.sendTo(this.room, `|uhtmlchange|poll${this.activityNumber}|${blankvote}`);
				}
			}
		}
	}

	updateTo(user: User, connection: Connection | null = null) {
		const state = this.toJSON();
		const recipient = connection || user;
		const selection = this.voters[user.id] || this.voterIps[user.latestIp];
		if (selection) {
			recipient.sendTo(
				this.room,
				`|uhtmlchange|poll${this.activityNumber}|${Poll.generateResults(state, this.room, false, selection)}`
			);
		} else {
			recipient.sendTo(this.room, `|uhtmlchange|poll${this.activityNumber}|${this.generateVotes(user)}`);
		}
	}

	updateFor(user: User) {
		const state = this.toJSON();
		if (user.id in this.voters) {
			user.sendTo(
				this.room,
				`|uhtmlchange|poll${this.activityNumber}|${Poll.generateResults(state, this.room, false, this.voters[user.id])}`
			);
		} else {
			user.sendTo(this.room, `|uhtmlchange|poll${this.activityNumber}|${this.generateVotes(user)}`);
		}
	}

	display() {
		const state = this.toJSON();
		const blankvote = Poll.generateResults(state, this.room, false);
		const blankquestions = this.generateVotes(null);

		for (const id in this.room.users) {
			const thisUser = this.room.users[id];
			const selection = this.voters[thisUser.id] || this.voterIps[thisUser.latestIp];
			if (selection) {
				if (selection.length) {
					thisUser.sendTo(this.room,
						`|uhtml|poll${this.activityNumber}|${Poll.generateResults(state, this.room, false, selection)}`);
				} else {
					thisUser.sendTo(this.room, `|uhtml|poll${this.activityNumber}|${blankvote}`);
				}
			} else {
				if (this.multiPoll && thisUser.id in this.pendingVotes) {
					thisUser.sendTo(this.room, `|uhtml|poll${this.activityNumber}|${this.generateVotes(thisUser)}`);
				} else {
					thisUser.sendTo(this.room, `|uhtml|poll${this.activityNumber}|${blankquestions}`);
				}
			}
		}
	}

	displayTo(user: User, connection: Connection | null = null) {
		const state = this.toJSON();
		const recipient = connection || user;
		if (user.id in this.voters) {
			recipient.sendTo(
				this.room,
				`|uhtml|poll${this.activityNumber}|${Poll.generateResults(state, this.room, false, this.voters[user.id])}`
			);
		} else if (user.latestIp in this.voterIps && !Config.noipchecks) {
			recipient.sendTo(this.room, `|uhtml|poll${this.activityNumber}|${Poll.generateResults(
				state, this.room, false, this.voterIps[user.latestIp]
			)}`);
		} else {
			recipient.sendTo(this.room, `|uhtml|poll${this.activityNumber}|${this.generateVotes(user)}`);
		}
	}

	onConnect(user: User, connection: Connection | null = null) {
		this.displayTo(user, connection);
	}

	onRename(user: User, oldid: ID, joining: boolean) {
		if (user.id in this.voters) {
			this.updateFor(user);
		}
	}

	destroy() {
		const results = Poll.generateResults(this.toJSON(), this.room, true);
		this.room.send(`|uhtmlchange|poll${this.activityNumber}|<div class="infobox">(${this.room.tr`The poll has ended &ndash; scroll down to see the results`})</div>`);
		this.room.add(`|html|${results}`).update();
		this.room.setMinorActivity(null);
	}

	toJSON(): PollData {
		return {
			activityid: 'poll',
			activityNumber: this.activityNumber,
			question: this.question,
			supportHTML: this.supportHTML,
			multiPoll: this.multiPoll,
			pendingVotes: this.pendingVotes,
			voters: this.voters,
			voterIps: this.voterIps,
			totalVotes: this.totalVotes,
			timeoutMins: this.timeoutMins,
			timerEnd: this.timerEnd,
			isQuiz: this.isQuiz,
			answers: [...this.answers.values()],
		};
	}

	save() {
		this.room.settings.minorActivity = this.toJSON();
		this.room.saveSettings();
	}

	static getAnswers(answers: string[] | PollAnswer[]) {
		const out = new Map<number, PollAnswer>();
		if (answers.length && typeof answers[0] === 'string') {
			for (const [i, answer] of (answers as string[]).entries()) {
				out.set(i + 1, {
					name: answer.startsWith('+') ? answer.slice(1) : answer,
					votes: 0,
					correct: answer.startsWith('+'),
				});
			}
		} else {
			for (const [i, answer] of (answers as PollAnswer[]).entries()) {
				out.set(i + 1, answer);
			}
		}
		return out;
	}
}

export const commands: Chat.ChatCommands = {
	poll: {
		htmlcreate: 'new',
		create: 'new',
		createmulti: 'new',
		htmlcreatemulti: 'new',
		queue: 'new',
		queuehtml: 'new',
		htmlqueue: 'new',
		queuemulti: 'new',
		htmlqueuemulti: 'new',
		new(target, room, user, connection, cmd, message) {
			room = this.requireRoom();
			if (!target) return this.parse('/help poll new');
			target = target.trim();
			if (target.length > 1024) return this.errorReply(this.tr`Poll too long.`);
			if (room.battle) return this.errorReply(this.tr`Battles do not support polls.`);

			const text = this.filter(target);
			if (target !== text) return this.errorReply(this.tr`You are not allowed to use filtered words in polls.`);

			const supportHTML = cmd.includes('html');
			const multiPoll = cmd.includes('multi');
			const queue = cmd.includes('queue');

			let params = [];
			let separator = '';
			if (text.includes('\n')) {
				separator = '\n';
			} else if (text.includes('|')) {
				separator = '|';
			} else if (text.includes(',')) {
				separator = ',';
			} else {
				return this.errorReply(this.tr`Not enough arguments for /poll new.`);
			}

			let currentParam = "";
			for (let i = 0; i < text.length; ++i) {
				const currentCharacter = text[i];
				const nextCharacter = text[i + 1];

				// If the current character is an escape character, insert the next character
				// into the param and then skip over checking it in our loop.
				const isEscapeCharacter = currentCharacter === '\\';
				if (isEscapeCharacter) {
					if (nextCharacter) {
						currentParam += nextCharacter;
						i += 1;
					} else {
						return this.errorReply(this.tr`Extra escape character. To end a poll with '\\', enter it as '\\\\'`);
					}
					continue;
				}

				// At this point, we know this separator hasn't been escaped, so split here.
				const isSeparator = currentCharacter === separator;
				if (isSeparator) {
					params.push(currentParam);
					currentParam = "";
					continue;
				}

				// The current character hasn't been escaped and isn't a separator, so it can just be added to the param.
				currentParam += currentCharacter;
			}
			// Be sure to get the last param we constructed into the array.
			params.push(currentParam);
			params = params.map(param => param.trim());

			this.checkCan('minigame', null, room);
			if (supportHTML) this.checkCan('declare', null, room);
			this.checkChat();
			if (room.minorActivity && !queue) {
				return this.errorReply(this.tr`There is already a poll or announcement in progress in this room.`);
			}

			if (params.length < 3) return this.errorReply(this.tr`Not enough arguments for /poll new.`);

			// the function throws on failure, so no handling needs to be done anymore
			if (supportHTML) params = params.map(parameter => this.checkHTML(parameter));

			const questions = params.splice(1);
			if (questions.length > MAX_QUESTIONS) {
				return this.errorReply(this.tr`Too many options for poll (maximum is ${MAX_QUESTIONS}).`);
			}

			if (new Set(questions).size !== questions.length) {
				return this.errorReply(this.tr`There are duplicate options in the poll.`);
			}

			if (room.minorActivity) {
				room.queueMinorActivity({
					question: params[0], answers: questions, multiPoll, supportHTML, activityid: 'poll',
				});
				this.modlog('QUEUEPOLL');
				return this.privateModAction(room.tr`${user.name} queued a poll.`);
			}
			room.setMinorActivity(new Poll(room, {
				question: params[0], supportHTML, answers: questions, multiPoll,
			}));

			this.roomlog(`${user.name} used ${message}`);
			this.modlog('POLL');
			this.addModAction(room.tr`A poll was started by ${user.name}.`);
		},
		newhelp: [
			`/poll create [question], [option1], [option2], [...] - Creates a poll. Requires: % @ # ~`,
			`/poll createmulti [question], [option1], [option2], [...] - Creates a poll, allowing for multiple answers to be selected. Requires: % @ # ~`,
			`To queue a poll, use [queue], [queuemulti], [queuehtml], or [htmlqueuemulti].`,
			`Polls can be used as quiz questions. To do this, prepend all correct answers with a +.`,
		],

		viewqueue(target, room, user) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			this.parse(`/join view-pollqueue-${room.roomid}`);
		},
		viewqueuehelp: [`/viewqueue - view the queue of polls in the room. Requires: % @ # ~`],

		deletequeue(target, room, user) {
			room = this.requireRoom();
			if (!target) return this.parse('/help deletequeue');

			this.checkCan('mute', null, room);
			const queue = room.getMinorActivityQueue();
			if (!queue) {
				return this.errorReply(this.tr`The queue is already empty.`);
			}
			const slot = parseInt(target);
			if (isNaN(slot)) {
				return this.errorReply(this.tr`Can't delete poll at slot ${target} - "${target}" is not a number.`);
			}
			if (!queue[slot - 1]) return this.errorReply(this.tr`There is no poll in queue at slot ${slot}.`);

			room.clearMinorActivityQueue(slot - 1);

			room.modlog({
				action: 'DELETEQUEUE',
				loggedBy: user.id,
				note: slot.toString(),
			});
			room.sendMods(this.tr`(${user.name} deleted the queued poll in slot ${slot}.)`);
			room.update();
			this.refreshPage(`pollqueue-${room.roomid}`);
		},
		deletequeuehelp: [
			`/poll deletequeue [number] - deletes poll at the corresponding queue slot (1 = next, 2 = the one after that, etc). Requires: % @ # ~`,
		],
		clearqueue(target, room, user, connection, cmd) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			const queue = room.getMinorActivityQueue();
			if (!queue) {
				return this.errorReply(this.tr`The queue is already empty.`);
			}
			room.clearMinorActivityQueue();
			this.modlog('CLEARQUEUE');
			this.sendReply(this.tr`Cleared poll queue.`);
		},
		clearqueuehelp: [
			`/poll clearqueue - deletes the queue of polls. Requires: % @ # ~`,
		],

		deselect: 'select',
		vote: 'select',
		select(target, room, user, connection, cmd) {
			room = this.requireRoom();
			const poll = this.requireMinorActivity(Poll);
			if (!target) return this.parse('/help poll vote');

			const parsed = parseInt(target);
			if (isNaN(parsed)) return this.errorReply(this.tr`To vote, specify the number of the option.`);

			if (!poll.answers.has(parsed)) return this.sendReply(this.tr`Option not in poll.`);

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
			room = this.requireRoom();
			const poll = this.requireMinorActivity(Poll);

			poll.submit(user);
		},
		submithelp: [`/poll submit - Submits your vote.`],

		timer(target, room, user) {
			room = this.requireRoom();
			const poll = this.requireMinorActivity(Poll);

			if (target) {
				this.checkCan('minigame', null, room);
				if (target === 'clear') {
					if (!poll.endTimer()) return this.errorReply(this.tr("There is no timer to clear."));
					return this.add(this.tr`The poll timer was turned off.`);
				}
				const timeoutMins = parseFloat(target);
				if (isNaN(timeoutMins) || timeoutMins <= 0 || timeoutMins > 7 * 24 * 60) {
					return this.errorReply(this.tr`Time should be a number of minutes less than one week.`);
				}
				poll.setTimer({timeoutMins});
				room.add(this.tr`The poll timer was turned on: the poll will end in ${Chat.toDurationString(timeoutMins * MINUTES)}.`);
				this.modlog('POLL TIMER', null, `${timeoutMins} minutes`);
				return this.privateModAction(room.tr`The poll timer was set to ${timeoutMins} minute(s) by ${user.name}.`);
			} else {
				if (!this.runBroadcast()) return;
				if (poll.timeout) {
					return this.sendReply(this.tr`The poll timer is on and will end in ${Chat.toDurationString(poll.timeoutMins * MINUTES)}.`);
				} else {
					return this.sendReply(this.tr`The poll timer is off.`);
				}
			}
		},
		timerhelp: [
			`/poll timer [minutes] - Sets the poll to automatically end after [minutes] minutes. Requires: % @ # ~`,
			`/poll timer clear - Clears the poll's timer. Requires: % @ # ~`,
		],

		results(target, room, user) {
			room = this.requireRoom();
			const poll = this.requireMinorActivity(Poll);

			poll.blankvote(user);
		},
		resultshelp: [
			`/poll results - Shows the results of the poll without voting. NOTE: you can't go back and vote after using this.`,
		],

		close: 'end',
		stop: 'end',
		end(target, room, user) {
			room = this.requireRoom();
			this.checkCan('minigame', null, room);
			this.checkChat();
			const poll = this.requireMinorActivity(Poll);
			this.modlog('POLL END');
			this.privateModAction(room.tr`The poll was ended by ${user.name}.`);
			poll.end(room, Poll);
		},
		endhelp: [`/poll end - Ends a poll and displays the results. Requires: % @ # ~`],

		show: '',
		display: '',
		''(target, room, user, connection) {
			room = this.requireRoom();
			const poll = this.requireMinorActivity(Poll);
			if (!this.runBroadcast()) return;
			room.update();

			if (this.broadcasting) {
				poll.display();
			} else {
				poll.displayTo(user, connection);
			}
		},
		displayhelp: [`/poll display - Displays the poll`],

		mv: 'maxvotes',
		maxvotes(target, room, user) {
			room = this.requireRoom();
			this.checkCan('mute', null, room);
			const poll = this.requireMinorActivity(Poll);
			let num = parseInt(target);
			if (this.meansNo(target)) { // special case for convenience
				num = 0;
			}
			if (isNaN(num)) {
				return this.errorReply(`Invalid max vote cap: '${target}'`);
			}
			if (poll.maxVotes === num) {
				return this.errorReply(`The poll's vote cap is already set to ${num}.`);
			}
			poll.maxVotes = num;
			this.addModAction(`${user.name} set the poll's vote cap to ${num}.`);
			let ended = false;
			if (poll.totalVotes > poll.maxVotes) {
				poll.end(room);
				this.addModAction(`The poll has more votes than the maximum vote cap, and has ended.`);
				ended = true;
			}
			if (!ended) poll.save();
			this.modlog('POLL MAXVOTES', null, `${poll.maxVotes}${ended ? ` (ended poll)` : ""}`);
		},
	},
	pollhelp() {
		this.sendReply(
			`|html|<details class="readmore"><summary>/poll allows rooms to run their own polls (limit 1 at a time).<br />` +
			`Polls can be used as quiz questions, by putting <code>+</code> before correct answers.<br />` +
			`<code>/poll create [question], [option1], [option2], [...]</code> - Creates a poll. Requires: % @ # ~</summary>` +
			`<code>/poll createmulti [question], [option1], [option2], [...]</code> - Creates a poll, allowing for multiple answers to be selected. Requires: % @ # ~<br />` +
			`<code>/poll htmlcreate(multi) [question], [option1], [option2], [...]</code> - Creates a poll, with HTML allowed in the question and options. Requires: # ~<br />` +
			`<code>/poll vote [number]</code> - Votes for option [number].<br />` +
			`<code>/poll timer [minutes]</code> - Sets the poll to automatically end after [minutes]. Requires: % @ # ~.<br />` +
			`<code>/poll results</code> - Shows the results of the poll without voting. NOTE: you can't go back and vote after using this.<br />` +
			`<code>/poll display</code> - Displays the poll.<br />` +
			`<code>/poll end</code> - Ends a poll and displays the results. Requires: % @ # ~.<br />` +
			`<code>/poll queue [question], [option1], [option2], [...]</code> - Add a poll in queue. Requires: % @ # ~<br />` +
			`<code>/poll deletequeue [number]</code> - Deletes poll at the corresponding queue slot (1 = next, 2 = the one after that, etc).<br />` +
			`<code>/poll clearqueue</code> - Deletes the queue of polls. Requires: % @ # ~.<br />` +
			`<code>/poll viewqueue</code> - View the queue of polls in the room. Requires: % @ # ~<br />` +
			`<code>/poll maxvotes [number]</code> - Set the max poll votes to the given [number]. Requires: % @ # ~<br />` +
			`</details>`
		);
	},
};

export const pages: Chat.PageTable = {
	pollqueue(args, user) {
		const room = this.requireRoom();

		let buf = `<div class="pad"><strong>${this.tr`Queued polls:`}</strong>`;
		buf += `<button class="button" name="send" value="/join view-pollqueue-${room.roomid}" style="float: right">`;
		buf += `<i class="fa fa-refresh"></i> ${this.tr`Refresh`}</button><br />`;
		const queue = room.getMinorActivityQueue()?.filter(activity => activity.activityid === 'poll');
		if (!queue) {
			buf += `<hr /><strong>${this.tr`No polls queued.`}</strong></div>`;
			return buf;
		}
		for (const [i, poll] of queue.entries()) {
			const number = i + 1; // for translation convienence
			const button = (
				`<strong>${this.tr`#${number} in queue`} </strong>` +
				`<button class="button" name="send" value="/msgroom ${room.roomid},/poll deletequeue ${i + 1}">` +
				`(${this.tr`delete`})</button>`
			);
			buf += `<hr />`;
			buf += `${button}<br />${Poll.generateResults(poll, room, false)}`;
		}
		buf += `<hr />`;
		return buf;
	},
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/poll (new|create|createmulti|htmlcreate|htmlcreatemulti|queue|queuemulti|htmlqueuemulti) ');
});

// should handle restarts and also hotpatches
for (const room of Rooms.rooms.values()) {
	if (room.getMinorActivityQueue(true)) {
		for (const poll of room.getMinorActivityQueue(true)!) {
			if (!poll.activityid) {
				// @ts-ignore
				poll.activityid = poll.activityId;
				// @ts-ignore
				delete poll.activityId;
			}
			if (!poll.activityNumber) {
				// @ts-ignore
				poll.activityNumber = poll.pollNumber;
				// @ts-ignore
				delete poll.pollNumber;
			}
			room.saveSettings();
		}
	}
	if (room.settings.minorActivity) {
		if (!room.settings.minorActivity.activityid) {
			// @ts-ignore
			room.settings.minorActivity.activityid = room.settings.minorActivity.activityId;
			// @ts-ignore
			delete room.settings.minorActivity.activityId;
		}
		if (typeof room.settings.minorActivity.activityNumber !== 'number') {
			// @ts-ignore
			room.settings.minorActivity.activityNumber = room.settings.minorActivity.pollNumber ||
				// @ts-ignore
				room.settings.minorActivity.announcementNumber;
		}
		room.saveSettings();
	}
	if (room.settings.minorActivity?.activityid === 'poll') {
		room.setMinorActivity(new Poll(room, room.settings.minorActivity), true);
	}
}
