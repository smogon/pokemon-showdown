/**
 * Professional Wrestling Room Plugin
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This handles submitting questions for the podcast that the room runs periodically,
 * instead of having to use another source to ask questions.
 *
 * @license MIT license
 */
'use strict';

const FS = require('../fs');

const PW_DATA_PATH = 'config/chat-plugins/prowrestling-questions.json';
const MAX_QUESTION_LENGTH = 500;

class ProWrestling {
	constructor() {
		this.pwData = Object.create(null);
		try {
			this.pwData = require(`../${PW_DATA_PATH}`);
		} catch (error) {
			if (error.code !== 'MODULE_NOT_FOUND') throw error;
		}

		this.saveQuestions = (() => {
			let writing = false;
			let writePending = false;
			return async () => {
				if (writing) {
					writePending = true;
					return;
				}
				writing = true;

				await FS(`${PW_DATA_PATH}.0`).write(JSON.stringify(this.pwData));
				await FS(`${PW_DATA_PATH}.0`).rename(PW_DATA_PATH);

				writing = false;
				if (writePending) {
					writePending = false;
					setImmediate(() => this.saveQuestions());
				}
			};
		})();
	}
	askQuestion(question, user) {
		const num = Object.keys(this.pwData).length + 1;
		this.pwData[num] = {
			askedBy: user.name,
			question: question,
			askedAt: Date.now(),
			num: num,
		};
		this.saveQuestions();
	}
	deleteQuestion(user, room, number) {
		if (number === 'constructor') return;
		if (!this.pwData[number]) return false;
		delete this.pwData[number];
		this.saveQuestions();
		const canDelete = user.can('editroom', null, room);
		this.displayQuestions(user, canDelete, room, true);
		return true;
	}
	deleteAllQuestions() {
		this.pwData = {};
		this.saveQuestions();
	}
	clearSpam(user) {
		const userid = toId(user);
		let matches = 0;
		for (let i in this.pwData) {
			if (toId(this.pwData[i].askedBy) === userid) {
				matches++;
				delete this.pwData[i];
			}
		}
		this.saveQuestions();
		return matches;
	}
	showQuestionList(user, room, message, update) {
		user.sendTo(room.id, `|uhtml${update ? `change` : ``}|pw-questions|<div class="infobox infobox-limited">${message}</div>`);
	}
	displayQuestions(user, canDelete, room, update) {
		if (Object.keys(this.pwData).length < 1) return this.showQuestionList(user, room, `(no questions have been asked yet)`, update);
		let buff = `<table border="1" cellspacing="0" cellpadding="3">`;
		buff += `<tr><td></td><td>Asked By:</td><td>Question:</td><td>Asked:</td>${canDelete ? `<td></td>` : ``}</tr>`;
		let num = 1;

		if (!canDelete) {
			for (let i in this.pwData) {
				const curQuestion = this.pwData[i];
				if (toId(curQuestion.askedBy) === user.userid) {
					buff += Chat.html`<tr><td>${num}.</td><td>${curQuestion.askedBy}</td><td>${curQuestion.question}</td><td>${Chat.toDurationString(Date.now() - curQuestion.askedAt)} ago</td></tr>`;
					num++;
				}
			}
			return this.showQuestionList(user, room, buff, update);
		} else {
			for (let i in this.pwData) {
				const curQuestion = this.pwData[i];
				buff += Chat.html`<tr><td>${num}.</td><td>${curQuestion.askedBy}</td><td>${curQuestion.question}</td><td>${Chat.toDurationString(Date.now() - curQuestion.askedAt)} ago</td><td><button class="button" name="send" value="/prowrestling delete ${curQuestion.num}">Delete Question</button></td></tr>`;
				num++;
			}
			buff += `</table>`;
			return this.showQuestionList(user, room, buff, update);
		}
	}
}
const PW = new ProWrestling();

exports.commands = {
	pw: 'prowrestling',
	professionalwrestling: 'prowrestling',
	prowrestling: {
		ask: 'submit',
		submit: function (target, room, user) {
			if (room.id !== 'prowrestling') return this.errorReply("This command can only be used in Pro Wrestling.");
			if (!target || toId(target).length < 1) return this.parse('/help prowrestling');
			if (!this.canTalk(target, room, null)) return; // run questions thru filters
			if (room.pwQuestionsDisabled) return this.errorReply("Podcast question submissions are currently closed right now.");
			if (target.length > MAX_QUESTION_LENGTH) return this.errorReply(`Your question cannot be longer than ${MAX_QUESTION_LENGTH} characters.`);

			PW.askQuestion(target, user);
			this.sendReply("Your question has been submitted.");
			const submission = `(${user.name} has submitted a PW podcast question.)`;
			room.sendModCommand(submission);
			this.logEntry(submission);
		},
		'': 'questions',
		list: 'questions',
		display: 'questions',
		questions: function (target, room, user) {
			if (room.id !== 'prowrestling') return this.errorReply("This command can only be used in Pro Wrestling.");
			const canDelete = user.can('editroom', null, room);
			PW.displayQuestions(user, canDelete, room, null);
		},
		delete: function (target, room, user) {
			if (room.id !== 'prowrestling') return this.errorReply("This command can only be used in Pro Wrestling.");
			if (!this.can('editroom', null, room)) return;

			const success = PW.deleteQuestion(user, room, target);
			if (success) {
				this.privateModCommand(`(${user.name} has deleted question #${target} from the podcast questions list.)`);
				return;
			}
		},
		deleteall: function (target, room, user) {
			if (room.id !== 'prowrestling') return this.errorReply("This command can only be used in Pro Wrestling.");
			if (!this.can('editroom', null, room)) return;
			if (!user.lastCommand || user.lastCommand !== 'prowrestling deleteall') {
				this.errorReply("WARNING: This command will delete all podcast questions asked.");
				this.errorReply("To continue, do this command again.");
				user.lastCommand = 'prowrestling deleteall';
				return;
			}
			PW.deleteAllQuestions();
			this.privateModCommand(`(${user.name} has forcefully deleted all podcast questions.)`);
			user.lastCommand = '';
		},
		clearspam: function (target, room, user) {
			if (room.id !== 'prowrestling') return this.errorReply("This command can only be used in Pro Wrestling.");
			if (!this.can('editroom', null, room)) return;
			if (!target) return this.parse('/help prowrestling');
			const matches = PW.clearSpam(target);
			if (matches < 1) return this.errorReply(`No users with userid '${target}' have submitted any questions. Check spelling?`);
			this.privateModCommand(`(${user.name} has deleted ${matches} question${Chat.plural(matches)} asked by ${target})`);
		},
		help: function (target, room, user) {
			return this.parse('/help professionalwrestling');
		},
		close: 'disable',
		disable: function (target, room, user) {
			if (room.id !== 'prowrestling') return this.errorReply("This command can only be used in Pro Wrestling.");
			if (!this.can('editroom', null, room)) return;
			if (room.pwQuestionsDisabled) return this.errorReply("Question submissions are already disabled.");
			room.pwQuestionsDisabled = true;
			this.privateModCommand(`(${user.name} has disabled podcast question submissions.)`);

			if (room.chatRoomData) {
				room.chatRoomData.pwQuestionsDisabled = room.pwQuestionsDisabled;
				Rooms.global.writeChatRoomData();
			}
		},
		open: 'enable',
		enable: function (target, room, user) {
			if (room.id !== 'prowrestling') return this.errorReply("This command can only be used in Pro Wrestling.");
			if (!this.can('editroom', null, room)) return;
			if (!room.pwQuestionsDisabled) return this.errorReply("Question submissions are already enabled.");
			room.pwQuestionsDisabled = false;
			this.privateModCommand(`(${user.name} has enabled podcast question submissions.)`);

			if (room.chatRoomData) {
				room.chatRoomData.pwQuestionsDisabled = room.pwQuestionsDisabled;
				Rooms.global.writeChatRoomData();
			}
		},
	},
	prowrestlinghelp: [
		"/prowrestling ask [question] - Submits a question to be asked for the next upcoming podcast",
		"/prowrestling deleteall - Deletes all podcast questions. Requires: # & ~",
		"/prowrestling disable - Disables allowing users to submit new podcast questions. Requires: # & ~",
		"/prowrestling enable - Enables allowing users to submit new podcast questions. Requires: # & ~",
		"/prowrestling clearspam [user] - Deletes all questions submitted by [user]. Requires: # & ~",
		"/prowrestling - Shows a list of all podcast questions asked thus far with an option to delete them. Requires: # & ~",
		"/prowrestling - Shows a list of all podcast questions that you've asked thus far.",
	],
};
