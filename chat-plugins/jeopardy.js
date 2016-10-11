'use strict';

const MAX_CATEGORY_COUNT = 5;
const MAX_QUESTION_COUNT = 5;
const BASE_POINTS = 200;

function calculatePoints(category, question) {
	return BASE_POINTS * (question + 1);
}

let jeopardies = {};

let JeopardyQuestions = (() => {
	function JeopardyQuestions(room, categoryCount, questionCount) {
		this.room = room;
		this.categoryCount = categoryCount;
		this.questionCount = questionCount;

		this.categories = this.readPersistentData('categories');
		if (!this.categories) this.categories = {};

		this.grid = this.readPersistentData('grid');
		this.revealedGrid = {};
		if (!this.grid) this.grid = {};
		for (let c = 0; c < categoryCount; ++c) {
			if (!this.grid[c]) this.grid[c] = {};
			this.revealedGrid[c] = {};
			for (let q = 0; q < questionCount; ++q) {
				if (!this.grid[c][q]) this.grid[c][q] = {};
				this.revealedGrid[c][q] = false;
			}
		}
		if (!this.grid.final) this.grid.final = [{}];
		this.revealedGrid.final = [false];
	}

	JeopardyQuestions.prototype.readPersistentData = function (key) {
		return this.room.jeopardyData ? this.room.jeopardyData[key] : undefined;
	};
	JeopardyQuestions.prototype.writePersistentData = function (key, value) {
		if (!this.room.jeopardyData) this.room.jeopardyData = {};
		if (this.room.chatRoomData && !this.room.chatRoomData.jeopardyData) this.room.chatRoomData.jeopardyData = {};
		this.room.jeopardyData[key] = value;
		if (this.room.chatRoomData) this.room.chatRoomData.jeopardyData[key] = value;
		Rooms.global.writeChatRoomData();
	};
	JeopardyQuestions.prototype.save = function () {
		this.writePersistentData('categories', this.categories);
		this.writePersistentData('grid', this.grid);
	};

	JeopardyQuestions.prototype.export = function (category, start, end) {
		let data = [];
		for (let q = start; q < end; ++q) {
			data.push(this.grid[category][q]);
		}
		return data;
	};
	JeopardyQuestions.prototype.import = function (category, start, end, data) {
		let q1 = start;
		let q2 = 0;
		for (; q1 < end && typeof data[q2] === 'object'; ++q1, ++q2) {
			if (typeof data[q2].value === 'string') this.grid[category][q1].value = data[q2].value;
			if (typeof data[q2].answer === 'string') this.grid[category][q1].answer = data[q2].answer;
			this.grid[category][q1].isDailyDouble = !!data[q2].isDailyDouble;
		}
		return q1 - start;
	};

	JeopardyQuestions.prototype.getCategory = function (category) {
		return this.categories[category];
	};
	JeopardyQuestions.prototype.setCategory = function (category, value) {
		this.categories[category] = value;
		this.save();
	};

	JeopardyQuestions.prototype.getQuestion = function (category, question) {
		return {
			value: this.grid[category][question].value,
			answer: this.grid[category][question].answer,
			points: calculatePoints(category, question),
			isDailyDouble: this.grid[category][question].isDailyDouble,
			isRevealed: this.revealedGrid[category][question],
		};
	};
	JeopardyQuestions.prototype.setQuestion = function (category, question, value) {
		this.grid[category][question].value = value;
		this.save();
	};
	JeopardyQuestions.prototype.setAnswer = function (category, question, value) {
		this.grid[category][question].answer = value;
		this.save();
	};
	JeopardyQuestions.prototype.setDailyDouble = function (category, question, isDailyDouble) {
		this.grid[category][question].isDailyDouble = isDailyDouble;
		this.save();
	};

	JeopardyQuestions.prototype.setRevealed = function (category, question, isRevealed) {
		this.revealedGrid[category][question] = isRevealed;
	};

	return JeopardyQuestions;
})();

let Jeopardy = (() => {
	function Jeopardy(host, room, categoryCount, questionCount) {
		this.host = host;
		this.room = room;
		this.categoryCount = categoryCount;
		this.questionCount = questionCount;

		this.users = new Map();
		this.questions = new JeopardyQuestions(room, categoryCount, questionCount);

		this.isStarted = false;
		this.remainingQuestions = categoryCount * questionCount;

		this.currentUser = null;
		this.currentCategory = -1;
		this.currentQuestion = -1;
		this.currentAnswerer = null;
		this.currentAnswer = "";

		this.remainingFinalWagers = 0;
		this.remainingFinalAnswers = 0;

		this.room.add("A new Jeopardy match has been created by " + host.name);
	}

	Jeopardy.prototype.checkPermission = function (user, output, ...checks) {
		let currentCheck = '';
		while ((currentCheck = checks.pop())) {
			switch (currentCheck) {
			case 'started':
				if (this.isStarted) break;
				output.sendReply("The Jeopardy match has not started yet.");
				return false;

			case 'notstarted':
				if (!this.isStarted) break;
				output.sendReply("The Jeopardy match has already started.");
				return false;

			case 'host':
				if (user === this.host) break;
				output.sendReply("You are not the host.");
				return false;

			case 'user':
				if (this.users.has(user)) break;
				output.sendReply("You are not in the match.");
				return false;

			default:
				output.sendReply("Unknown check '" + currentCheck + "'.");
				return false;
			}
		}

		return true;
	};

	Jeopardy.prototype.addUser = function (user, targetUser, output) {
		if (!this.checkPermission(user, output, 'notstarted', 'host')) return;
		if (this.users.has(targetUser)) return output.sendReply("User " + targetUser.name + " is already participating.");

		this.users.set(targetUser, {
			isAnswered: false,
			points: 0,
			finalWager: -1,
			finalAnswer: "",
		});
		this.room.add("User " + targetUser.name + " has joined the Jeopardy match.");
	};
	Jeopardy.prototype.removeUser = function (user, targetUser, output) {
		if (!this.checkPermission(user, output, 'notstarted', 'host')) return;
		if (!this.users.has(targetUser)) return output.sendReply("User " + targetUser.name + " is not participating.");

		this.users.delete(targetUser);
		this.room.add("User " + targetUser.name + " has left the Jeopardy match.");
	};

	Jeopardy.prototype.start = function (user, output) {
		if (!this.checkPermission(user, output, 'notstarted', 'host')) return;
		if (this.users.size < 2) return output.sendReply("There are not enough users participating.");

		let isGridValid = true;
		for (let c = 0; c < this.categoryCount; ++c) {
			if (!this.questions.getCategory(c)) {
				output.sendReply("Category " + (c + 1) + " is missing its name.");
				isGridValid = false;
			}
			for (let q = 0; q < this.questionCount; ++q) {
				let question = this.questions.getQuestion(c, q);
				if (!question.value) {
					output.sendReply("Category " + (c + 1) + " Question " + (q + 1) + " is empty.");
					isGridValid = false;
				}
				if (!question.answer) {
					output.sendReply("Category " + (c + 1) + " Question " + (q + 1) + " has no answer.");
					isGridValid = false;
				}
			}
		}

		if (!this.questions.getCategory('final')) {
			output.sendReply("The final category is missing its name.");
			isGridValid = false;
		}
		let finalQuestion = this.questions.getQuestion('final', 0);
		if (!finalQuestion.value) {
			output.sendReply("The final question is empty.");
			isGridValid = false;
		}
		if (!finalQuestion.answer) {
			output.sendReply("The final question has no answer.");
			isGridValid = false;
		}

		if (!isGridValid) return;

		this.isStarted = true;
		let usersIterator = this.users.keys();
		for (let n = 0, u = Math.floor(Math.random() * this.users.size); n <= u; ++n) {
			this.currentUser = usersIterator.next().value;
		}
		this.room.add('|raw|<div class="infobox">' + renderGrid(this.questions) + '</div>');
		this.room.add("The Jeopardy match has started! " + this.currentUser.name + " selects the first question.");
	};

	Jeopardy.prototype.select = function (user, category, question, output) {
		if (!this.checkPermission(user, output, 'started', 'user')) return;
		if (user !== this.currentUser || this.currentCategory !== -1) return output.sendReply("You cannot select a question right now.");
		if (!(0 <= category && category < this.categoryCount && 0 <= question && question < this.questionCount)) return output.sendReply("Invalid question.");

		let data = this.questions.getQuestion(category, question);
		if (data.isRevealed) return output.sendReply("That question has already been revealed.");

		this.questions.setRevealed(category, question, true);
		--this.remainingQuestions;

		this.users.forEach(userData => {
			userData.isAnswered = false;
		});

		this.currentCategory = category;
		this.currentQuestion = question;
		this.currentAnswerer = null;
		this.currentAnswer = "";

		if (data.isDailyDouble) {
			this.remainingAnswers = 1;
			this.isDailyDouble = true;
			this.room.add("It's the Daily Double! " + this.currentUser.name + ", please make a wager.");
		} else {
			this.remainingAnswers = this.users.size;
			this.room.add("The question is: " + data.value);
		}
	};
	Jeopardy.prototype.wager = function (user, amount, output) {
		if (!this.checkPermission(user, output, 'started', 'user')) return;
		if (this.currentCategory === 'final') return this.finalWager(user, amount, output);
		if (!this.isDailyDouble || user !== this.currentUser) return output.sendReply("You cannot wager right now.");
		if (this.currentAnswerer) return output.sendReply("You have already wagered.");

		let userData = this.users.get(this.currentUser);
		if (amount === 'all') amount = userData.points;
		if (!(0 <= amount && amount <= (userData.points < 1000 ? 1000 : userData.points))) return output.sendReply("You cannot wager less than zero or more than your current amount of points.");
		userData.wager = Math.round(amount);
		this.room.add("" + this.currentUser.name + " has wagered " + userData.wager + " points.");

		this.currentAnswerer = this.currentUser;
		let data = this.questions.getQuestion(this.currentCategory, this.currentQuestion);
		this.room.add("The question is: " + data.value);
	};
	Jeopardy.prototype.answer = function (user, answer, output) {
		if (!this.checkPermission(user, output, 'started', 'user')) return;
		if (this.currentQuestion === 'final') return this.finalAnswer(user, answer, output);
		if (!answer) return output.sendReply("Please specify an answer.");
		if (this.currentAnswer || isNaN(this.currentCategory) || this.currentCategory < 0 || (this.isDailyDouble && user !== this.currentAnswerer)) return output.sendReply("You cannot answer right now.");
		if (this.users.get(user).isAnswered) return output.sendReply("You already have answered this question.");

		--this.remainingAnswers;
		this.currentAnswerer = user;
		this.currentAnswer = answer;
		this.users.get(user).isAnswered = true;
		this.room.add("" + user.name + " has answered '" + answer + "'.");

		if (answer.toLowerCase() === this.questions.getQuestion(this.currentCategory, this.currentQuestion).answer.toLowerCase()) {
			this.mark(this.host, true);
		}
	};
	Jeopardy.prototype.mark = function (user, isCorrect, output) {
		if (!this.checkPermission(user, output, 'started', 'host')) return;
		if (this.currentQuestion === 'final') return this.finalMark(user, isCorrect, output);
		if (!this.currentAnswer) return output.sendReply("There is no answer to mark right now.");

		let userData = this.users.get(this.currentAnswerer);
		let points = this.isDailyDouble ? userData.wager : this.questions.getQuestion(this.currentCategory, this.currentQuestion).points;
		if (isCorrect) {
			userData.points += points;
			this.room.add("The answer '" + this.currentAnswer + "' was correct! " + this.currentAnswerer.name + " gains " + points + " points to " + userData.points + "!");

			this.currentUser = this.currentAnswerer;
			this.currentCategory = -1;
			this.currentQuestion = -1;
			this.currentAnswerer = null;
			this.currentAnswer = "";
			this.isDailyDouble = false;

			if (this.remainingQuestions === 0) this.autostartFinalRound();
		} else {
			userData.points -= points;
			this.room.add("The answer '" + this.currentAnswer + "' was incorrect! " + this.currentAnswerer.name + " loses " + points + " points to " + userData.points + "!");

			this.currentAnswerer = null;
			this.currentAnswer = "";
			this.isDailyDouble = false;

			if (this.remainingAnswers === 0) this.skip(this.host);
		}
	};
	Jeopardy.prototype.skip = function (user, output) {
		if (!this.checkPermission(user, output, 'started', 'host')) return;
		if (isNaN(this.currentCategory) || this.currentCategory < 0) return output.sendReply("There is not question to skip.");
		if (this.currentAnswer) return output.sendReply("Please mark the current answer.");

		let answer = this.questions.getQuestion(this.currentCategory, this.currentQuestion).answer;
		this.room.add("The correct answer was '" + answer + "'.");

		if (this.isDailyDouble) {
			let userData = this.users.get(this.currentUser);
			userData.points -= userData.wager;
			this.room.add("" + this.currentUser.name + " loses " + userData.wager + " points to " + userData.points + "!");
			this.isDailyDouble = false;
		}

		this.currentCategory = -1;
		this.currentQuestion = -1;
		this.currentAnswerer = null;
		this.currentAnswer = "";

		if (this.remainingQuestions === 0) this.autostartFinalRound();
	};

	Jeopardy.prototype.autostartFinalRound = function () {
		this.currentUser = null;
		this.currentCategory = 'final';
		this.currentQuestion = -1;
		this.remainingFinalWagers = this.users.size;

		this.room.add("The final category is: '" + this.questions.getCategory('final') + "'. Please set your wagers.");
	};
	Jeopardy.prototype.finalWager = function (user, amount, output) {
		if (!this.checkPermission(user, output, 'started', 'user')) return;
		if (this.currentCategory !== 'final') return output.sendReply("It is not the final round yet.");
		if (this.remainingFinalWagers === 0) return output.sendReply("You cannot modify your wager after the question has been revealed.");

		let userData = this.users.get(user);
		if (amount === 'all') amount = userData.points;
		if (!(0 <= amount && amount <= (userData.points < 1000 ? 1000 : userData.points))) return output.sendReply("You cannot wager less than zero or more than your current amount of points.");

		let isAlreadyWagered = userData.finalWager >= 0;
		userData.finalWager = Math.round(amount);

		output.sendReply("You have wagered " + userData.finalWager + " points.");
		if (!isAlreadyWagered) {
			--this.remainingFinalWagers;
			this.room.add("User " + user.name + " has set their wager.");
		}

		if (this.remainingFinalWagers !== 0) return;

		this.currentQuestion = 'final';
		this.remainingFinalAnswers = this.users.size;

		this.room.add("The final question is: '" + this.questions.getQuestion('final', 0).value + "'. Please set your answers.");
		this.questions.setRevealed('final', 0, true);
	};
	Jeopardy.prototype.finalAnswer = function (user, answer, output) {
		if (!this.checkPermission(user, output, 'started', 'user')) return;
		if (this.currentCategory !== 'final') return output.sendReply("It is not the final round yet.");
		if (this.currentQuestion !== 'final') return output.sendReply("You cannot answer yet.");
		if (!answer) return output.sendReply("Please specify an answer.");
		if (this.remainingFinalAnswers === 0) return output.sendReply("You cannot modify your answer after marking has started.");

		let userData = this.users.get(user);
		let isAlreadyAnswered = !!userData.finalAnswer;
		userData.finalAnswer = answer;

		output.sendReply("You have answered '" + userData.finalAnswer + "'.");
		if (!isAlreadyAnswered) {
			--this.remainingFinalAnswers;
			this.room.add("User " + user.name + " has set their answer.");
		}

		if (this.remainingFinalAnswers === 0) this.automarkFinalAnswers();
	};
	Jeopardy.prototype.automarkFinalAnswers = function () {
		if (!this.finalMarkingIterator) this.finalMarkingIterator = this.users.entries();

		let data = this.finalMarkingData = this.finalMarkingIterator.next().value;
		if (!data) {
			this.end();
			return;
		}

		this.room.add("User " + data[0].name + " has answered '" + data[1].finalAnswer + "'.");

		if (data[1].finalAnswer.toLowerCase() === this.questions.getQuestion('final', 0).answer.toLowerCase()) {
			this.finalMark(this.host, true);
		}
	};
	Jeopardy.prototype.finalMark = function (user, isCorrect, output) {
		if (!this.checkPermission(user, output, 'started', 'host')) return;
		if (!this.finalMarkingIterator) return output.sendReply("There is no final answer to mark right now.");

		let data = this.finalMarkingData;
		if (isCorrect) {
			data[1].points += data[1].finalWager;
			this.room.add("The answer '" + data[1].finalAnswer + "' was correct! " + data[0].name + " gains " + data[1].finalWager + " points to " + data[1].points + "!");
		} else {
			data[1].points -= data[1].finalWager;
			this.room.add("The answer '" + data[1].finalAnswer + "' was incorrect! " + data[0].name + " loses " + data[1].finalWager + " points to " + data[1].points + "!");
		}

		this.automarkFinalAnswers();
	};

	Jeopardy.prototype.end = function () {
		let results = [];
		for (let data of this.users) {
			results.push({user: data[0], points: data[1].points});
		}
		results.sort((a, b) => b.points - a.points);

		let winner = results.shift();
		this.room.add("Congratulations to " + winner.user.name + " for winning the Jeopardy match with " + winner.points + " points!");
		this.room.add("Other participants:\n" + results.map(data => data.user.name + ": " + data.points).join("\n"));

		delete jeopardies[this.room.id];
	};

	return Jeopardy;
})();

function renderGrid(questions, mode) {
	let buffer = '<center><table>';

	buffer += '<tr>';
	for (let c = 0; c < questions.categoryCount; ++c) {
		buffer += '<th>' + (Chat.escapeHTML(questions.getCategory(c)) || '&nbsp;') + '</th>';
	}
	buffer += '</tr>';

	for (let q = 0; q < questions.questionCount; ++q) {
		buffer += '<tr>';
		for (let c = 0; c < questions.categoryCount; ++c) {
			let data = questions.getQuestion(c, q);

			let cellType = (mode === 'questions' || mode === 'answers') && data.isDailyDouble ? 'th' : 'td';
			buffer += '<' + cellType + '><center>';

			if (mode === 'questions') {
				buffer += data.value || '&nbsp;';
			} else if (mode === 'answers') {
				buffer += data.answer || '&nbsp;';
			} else if (data.isRevealed) {
				buffer += '&nbsp;';
			} else {
				buffer += data.points;
			}

			buffer += '</center></' + cellType + '>';
		}
		buffer += '</tr>';
	}

	buffer += '</table></center>';

	return buffer;
}

let commands = {
	help: function () {
		if (!this.runBroadcast()) return;

		this.sendReplyBox(
			"All commands are run under /jeopardy or /jp. For example, /jeopardy viewgrid.<br />" +
			"viewgrid { , questions, answers, final} - Shows the jeopardy grid<br />" +
			"edit - Edits the grid. Run this command by itself for more detailed help<br />" +
			"export [category number], [start], [end] - Exports data from the grid. start and end are optional<br />" +
			"import [category number], [start], [end], [data] - Imports data into the grid. start and end are optional<br />" +
			"create [categories], [questions per category] - Creates a jeopardy match. Parameters are optional, and default to maximum values. Requires: % @ * # & ~<br />" +
			"start - Starts the match. Requires: % @ * # & ~<br />" +
			"end - Forcibly ends the match. Requires: % @ * # & ~<br />" +
			"adduser [user] - Add a user to the match<br />" +
			"removeuser [user] - Remove a user from the match<br />" +
			"select [category number], [question number] - Select a question<br />" +
			"a/answer [answer] - Attempt to answer the question<br />" +
			"incorrect/correct - Marks the current answer as correct or not. Requires: % @ * # & ~<br />" +
			"skip - Skips the current question<br />" +
			"wager [amount] - Wager some amount of points. 'all' is also accepted"
		);
	},

	'': 'viewgrid',
	viewgrid: function (target, room, user) {
		if (!this.runBroadcast()) return;

		let jeopardy = jeopardies[room.id];
		let questions = null;

		if (!jeopardy) {
			if (!this.can('jeopardy', null, room)) return;
			questions = new JeopardyQuestions(room, MAX_CATEGORY_COUNT, MAX_QUESTION_COUNT);
		} else {
			if (target && !jeopardy.checkPermission(user, this, 'host')) return;
			questions = jeopardy.questions;
		}

		if (toId(target) === 'final') {
			this.sendReplyBox(
				"<strong>Final Category:</strong> " + Chat.escapeHTML(questions.getCategory('final') || "") + '<br />' +
				"<strong>Final Question:</strong> " + Chat.escapeHTML(questions.getQuestion('final', 0).value || "") + '<br />' +
				"<strong>Final Answer:</strong> " + Chat.escapeHTML(questions.getQuestion('final', 0).answer || "")
			);
		} else {
			this.sendReplyBox(renderGrid(questions, target));
		}
	},

	edit: function (target, room, user) {
		let params = target.split(',');

		let usage =
			"Usage:\n" +
			"edit category, [category number], [value]\n" +
			"edit {question,answer}, [category number], [question number], [value]\n" +
			"edit dailydouble, [category number], [question number], {true,false}\n" +
			"(Category number can be 'final')";

		let editType = toId(params[0]);
		if (!(editType in {category: 1, question: 1, answer: 1, dailydouble: 1})) return this.sendReply(usage);
		if (editType === 'category') {
			if (params.length < 3) return this.sendReply(usage);
		} else if (params.length < 4) {
			return this.sendReply(usage);
		}

		let jeopardy = jeopardies[room.id];
		let questions = null;

		if (!jeopardy) {
			if (!this.can('jeopardy', null, room)) return;
			questions = new JeopardyQuestions(room, MAX_CATEGORY_COUNT, MAX_QUESTION_COUNT);
		} else {
			if (!jeopardy.checkPermission(user, this, 'notstarted', 'host')) return;
			questions = jeopardy.questions;
		}

		let categoryNumber = parseInt(params[1]) || toId(params[1]);
		if (!(1 <= categoryNumber && categoryNumber <= questions.categoryCount || categoryNumber === 'final')) return this.sendReply("Please enter a valid category number.");
		if (categoryNumber === 'final') {
			categoryNumber = 'final';
		} else {
			--categoryNumber;
		}

		if (editType === 'category') {
			questions.setCategory(categoryNumber, params.slice(2).join(',').trim());
			this.sendReply("The category name has been updated.");
		} else {
			let questionNumber = parseInt(params[2]);
			if (!(1 <= questionNumber && questionNumber <= questions.questionCount || categoryNumber === 'final')) return this.sendReply("Please enter a valid question number.");
			if (categoryNumber === 'final') {
				questionNumber = 0;
			} else {
				--questionNumber;
			}

			let value = params.slice(3).join(',').trim();
			let isSet = false;
			switch (editType) {
			case 'question':
				questions.setQuestion(categoryNumber, questionNumber, value);
				this.sendReply("The question has been updated.");
				break;

			case 'answer':
				questions.setAnswer(categoryNumber, questionNumber, value);
				this.sendReply("The answer has been updated.");
				break;

			case 'dailydouble':
				isSet = toId(value) === 'true';
				questions.setDailyDouble(categoryNumber, questionNumber, isSet);
				this.sendReply("The daily double has been " + (isSet ? "set." : "unset."));
				break;
			}
		}
	},
	export: function (target, room, user) {
		let params = target.split(',');

		let jeopardy = jeopardies[room.id];
		let questions = null;

		if (!jeopardy) {
			if (!this.can('jeopardy', null, room)) return;
			questions = new JeopardyQuestions(room, MAX_CATEGORY_COUNT, MAX_QUESTION_COUNT);
		} else {
			if (!jeopardy.checkPermission(user, this, 'host')) return;
			questions = jeopardy.questions;
		}

		let categoryNumber = parseInt(params[0]);
		if (!(1 <= categoryNumber && categoryNumber <= questions.categoryCount)) return this.sendReply("Please enter a valid category number.");

		let start = params[1] ? parseInt(params[1]) : 1;
		let end = params[2] ? parseInt(params[2]) : questions.questionCount;
		if (!(1 <= start && start <= questions.questionCount)) return this.sendReply("Please enter a valid starting question number.");
		if (!(1 <= end && end <= questions.questionCount)) return this.sendReply("Please enter a valid ending question number.");

		this.sendReply('||' + JSON.stringify(questions.export(categoryNumber - 1, start - 1, end)));
	},
	import: function (target, room, user) {
		let params = target.split(',');
		if (params.length < 2) return this.sendReply("Usage: import [category number], [start], [end], [data]");

		let jeopardy = jeopardies[room.id];
		let questions = null;

		if (!jeopardy) {
			if (!this.can('jeopardy', null, room)) return;
			questions = new JeopardyQuestions(room, MAX_CATEGORY_COUNT, MAX_QUESTION_COUNT);
		} else {
			if (!jeopardy.checkPermission(user, this, 'notstarted', 'host')) return;
			questions = jeopardy.questions;
		}

		let categoryNumber = parseInt(params[0]);
		if (!(1 <= categoryNumber && categoryNumber <= questions.categoryCount)) return this.sendReply("Please enter a valid category number.");

		let dataStart = 1;
		let start = parseInt(params[1]);
		let end = parseInt(params[2]);
		if (!isNaN(start)) {
			++dataStart;
			if (!isNaN(end)) {
				++dataStart;
			}
		}
		if (dataStart <= 1) start = 1;
		if (dataStart <= 2) end = questions.questionCount;
		if (!(1 <= start && start <= questions.questionCount)) return this.sendReply("Please enter a valid starting question number.");
		if (!(1 <= end && end <= questions.questionCount)) return this.sendReply("Please enter a valid ending question number.");

		let data;
		try {
			data = JSON.parse(params.slice(dataStart).join(','));
		} catch (e) {
			return this.sendReply("Failed to parse the data. Please make sure it is correct.");
		}

		this.sendReply('||' + questions.import(categoryNumber - 1, start - 1, end, data) + " questions have been imported.");
	},

	create: function (target, room, user) {
		let params = target.split(',');

		if (jeopardies[room.id]) return this.sendReply("There is already a Jeopardy match in this room.");
		if (!this.can('jeopardy', null, room)) return;

		let categoryCount = parseInt(params[0]) || MAX_CATEGORY_COUNT;
		let questionCount = parseInt(params[1]) || MAX_QUESTION_COUNT;
		if (categoryCount > MAX_CATEGORY_COUNT) return this.sendReply("A match with more than " + MAX_CATEGORY_COUNT + " categories cannot be created.");
		if (questionCount > MAX_QUESTION_COUNT) return this.sendReply("A match with more than " + MAX_QUESTION_COUNT + " questions per category cannot be created.");

		jeopardies[room.id] = new Jeopardy(user, room, categoryCount, questionCount);
	},
	start: function (target, room, user) {
		let jeopardy = jeopardies[room.id];
		if (!jeopardy) return this.sendReply("There is no Jeopardy match currently in this room.");

		jeopardy.start(user, this);
	},
	end: function (target, room, user) {
		if (!jeopardies[room.id]) return this.sendReply("There is no Jeopardy match currently in this room.");
		if (!this.can('jeopardy', null, room)) return;

		delete jeopardies[room.id];
		room.add("The Jeopardy match was forcibly ended by " + user.name);
	},

	adduser: function (target, room, user) {
		let targetUser = Users.get(target);
		if (!targetUser) return this.sendReply("User '" + target + "' not found.");

		let jeopardy = jeopardies[room.id];
		if (!jeopardy) return this.sendReply("There is no Jeopardy match currently in this room.");

		jeopardy.addUser(user, targetUser, this);
	},
	removeuser: function (target, room, user) {
		let targetUser = Users.get(target);
		if (!targetUser) return this.sendReply("User '" + target + "' not found.");

		let jeopardy = jeopardies[room.id];
		if (!jeopardy) return this.sendReply("There is no Jeopardy match currently in this room.");

		jeopardy.removeUser(user, targetUser, this);
	},

	select: function (target, room, user) {
		let params = target.split(',');
		if (params.length < 2) return this.sendReply("Usage: select [category number], [question number]");

		let jeopardy = jeopardies[room.id];
		if (!jeopardy) return this.sendReply("There is no Jeopardy match currently in this room.");

		let category = parseInt(params[0]) - 1;
		let question = parseInt(params[1]) - 1;

		jeopardy.select(user, category, question, this);
	},
	a: 'answer',
	answer: function (target, room, user) {
		let jeopardy = jeopardies[room.id];
		if (!jeopardy) return this.sendReply("There is no Jeopardy match currently in this room.");

		jeopardy.answer(user, target, this);
	},
	incorrect: 'correct',
	correct: function (target, room, user, connection, cmd) {
		let jeopardy = jeopardies[room.id];
		if (!jeopardy) return this.sendReply("There is no Jeopardy match currently in this room.");

		jeopardy.mark(user, cmd === 'correct', this);
	},
	skip: function (target, room, user) {
		let jeopardy = jeopardies[room.id];
		if (!jeopardy) return this.sendReply("There is no Jeopardy match currently in this room.");

		jeopardy.skip(user, this);
	},

	wager: function (target, room, user) {
		let jeopardy = jeopardies[room.id];
		if (!jeopardy) return this.sendReply("There is no Jeopardy match currently in this room.");

		jeopardy.wager(user, target, this);
	},
};

let jeopardyRoom = Rooms.get('academics');
if (jeopardyRoom) {
	if (jeopardyRoom.plugin) {
		jeopardies = jeopardyRoom.plugin.jeopardies;
	} else {
		jeopardyRoom.plugin = {
			'jeopardies': jeopardies,
		};
	}
}

exports.commands = {
	'jp': 'jeopardy',
	'jeopardy': commands,
};
