'use strict';

const BACKGROUND_COLOR = "#0000FF";
const HEIGHT = 40;
const MAX_CATEGORY_COUNT = 5;
const MAX_QUESTION_COUNT = 5;

class Jeopardy extends Rooms.RoomGame {
	constructor(room, user, categoryCount, questionCount) {
		super(room);
		if (room.gameNumber) {
			room.gameNumber++;
		} else {
			room.gameNumber = 1;
		}
		this.host = user;
		this.allowRenames = true;
		this.state = "signups";
		this.gameid = 'jeopardy';
		this.title = 'Jeopardy';
		this.questions = [];
		this.started = false;
		this.categoryCount = categoryCount;
		this.questionCount = questionCount;
		this.round = 1;
		this.points = new Map();
		this.wagers = new Map();
		this.playerCap = 3;
		this.canBuzz = false;
		this.answers = new Map();
		this.numUpdates = 0;
		this.buzzedEarly = new Set();
		this.finalCategory = "";
		this.answeringTime = 10;
		this.finalsAnsweringTime = 30;
		this.setupGrid();
	}

	destroy() {
		clearTimeout(this.timeout);
		super.destroy();
	}

	makePlayer(user) {
		return new JeopardyGamePlayer(user, this);
	}

	setupGrid() {
		this.categories = [];
		for (let j = 0; j < this.categoryCount; j++) {
			this.categories.push("");
		}
		this.questions = [];
		for (let i = 0; i < this.questionCount; i++) {
			this.questions.push([]);
			for (let j = 0; j < this.categoryCount; j++) {
				this.questions[i].push({points: 200 * this.round * (i + 1), answered: false, dd: false});
			}
		}
		this.finalQuestion = {};
		this.roundstarted = false;
		this.question = null;
		if (this.round === 1) {
			this.display();
		} else {
			this.update();
		}
	}

	start() {
		if (this.roundstarted) return "The game has already been started.";
		if (this.playerCount < 2) return "The game needs at least two players to start.";
		let noquestions = [];
		for (let i = 0; i < this.categoryCount; i++) {
			for (let j = 0; j < this.questionCount; j++) {
				if (!this.questions[j][i].question) {
					noquestions.push(`(${(i + 1)}, ${(j + 1)})`);
				}
			}
		}
		let badstr = noquestions.join(", ");
		if (!this.finalQuestion.question && this.round === 2) {
			badstr += `${(badstr ? ", " : "")} final`;
		}
		if (badstr) {
			return `The follow questions still need questions and answers: ${badstr}`;
		}
		this.roundstarted = true;
		if (this.round === 1) {
			for (let userID in this.players) {
				let player = this.players[userID];
				this.points.set(player, 0);
			}
		}
		this.state = 'selecting';
		let lowest = [];
		let minpoints;
		for (let userID in this.players) {
			let points = this.players[userID].points;
			if (!minpoints) {
				lowest.push(userID);
				minpoints = points;
			} else if (points < minpoints) {
				lowest = [userID];
				minpoints = points;
			} else if (points === minpoints) {
				lowest.push(userID);
			}
		}
		this.curPlayer = this.players[lowest[Math.floor(lowest.length * Math.random())]];
		this.prevPlayer = this.curPlayer;
		this.update();
		this.nextPlayer();
	}

	nextPlayer() {
		this.room.addRaw(`${this.curPlayer.name} you're up!`);
	}

	getgrid() {
		let buffer = "<div class=\"infobox\"><html><body><table align=\"center\" border=\"2\" style=\"table-layout: fixed; width: 100%\"><tr>";
		for (let i = 0; i < this.categoryCount; i++) {
			buffer += `<td style="word-wrap: break-word" bgcolor="${BACKGROUND_COLOR}"; height="${HEIGHT}px"; width="30px" align="center"><font color="white">${Chat.escapeHTML(this.categories[i])}</font></td>`;
		}
		buffer += "</tr>";
		for (let i = 0; i < this.questionCount; i++) {
			buffer += "<tr>";
			for (let j = 0; j < this.categoryCount; j++) {
				buffer += `<td bgcolor="${BACKGROUND_COLOR}"; height="${HEIGHT}px"; align="center"><font color="black" size="6">${(this.questions[i][j].answered ? "" : this.questions[i][j].points)}</font></td>`;
			}
			buffer += "</tr>";
		}
		buffer += "</table><br />";
		if (this.question && !this.finals) {
			buffer += `<table align="left"><tr><td bgcolor="${this.canBuzz ? "00FF00" : "0000FF"}" height="30px" width="30px"></td></tr></table>`;
		}
		for (let userID in this.players) {
			let player = this.players[userID];
			buffer += `<center>${this.curPlayer && this.curPlayer.name === player.name ? "<b>" : ""}<font size=4>${Chat.escapeHTML(player.name)}(${(player.points || 0)})${this.curPlayer && this.curPlayer.name === player.name ? "</b>" : ""}</center><br />`;
		}
		buffer += "</body></html></div>";
		return buffer;
	}

	display() {
		this.room.add(`|uhtml|jeopardy${this.room.gameNumber}-${this.numUpdates}|${this.getgrid()}`);
	}

	update(dontMove) {
		if (dontMove) {
			this.room.add(`|uhtmlchange|jeopardy${this.room.gameNumber}-${this.numUpdates}|${this.getgrid()}`);
		} else {
			this.room.add(`|uhtmlchange|jeopardy${this.room.gameNumber}-${this.numUpdates}|`);
			this.numUpdates++;
			this.room.add(`|uhtml|jeopardy${this.room.gameNumber}-${this.numUpdates}|${this.getgrid()}`);
		}
	}

	dailyDouble() {
		clearTimeout(this.timeout);
		this.state = 'answering';
		if (!this.curPlayer.wager) this.curPlayer.wager = 0;
		this.askQuestion();
	}

	select(target, user) {
		if (this.state !== 'selecting') return "The game of Jeopardy is not in the selection phase.";
		let player = this.players[user.userid];
		if (!player) return "You are not in the game of Jeopardy.";
		if (!this.curPlayer || this.curPlayer.userid !== user.userid) return "It is not your turn to select.";
		let params = target.split(",");
		if (params.length < 2) return "You must specify a row and a column number.";
		let categoryNumber = parseInt(params[0]);
		if (!categoryNumber || categoryNumber < 1 || categoryNumber > this.categoryCount) return `The category must be a number between 1 and ${this.categoryCount}`;
		let questionNumber = parseInt(params[1]);
		if (!questionNumber || questionNumber < 1 || questionNumber > this.questionCount) return `The question must be a number between 1 and ${this.questionCount}`;
		let question = this.questions[questionNumber - 1][categoryNumber - 1];
		if (question.answered) return "That question has already been answered.";
		this.question = question;
		if (question.dd) {
			this.room.add(`That was a daily double! ${this.curPlayer.name}, how much would you like to wager?`);
			this.clearwagers();
			this.state = 'wagering';
			this.timeout = setTimeout(() => this.dailyDouble(), 30 * 1000);
		} else {
			this.state = 'buzzing';
			this.askQuestion();
		}
	}

	clearwagers() {
		for (let userID in this.players) {
			this.players[userID].wager = null;
		}
	}

	clearbuzzes() {
		for (let userID in this.players) {
			this.players[userID].buzzed = false;
		}
	}

	askQuestion() {
		if (!this.question.dd) {
			this.curPlayer = null;
		}
		this.clearbuzzes();
		this.room.addRaw(`<div class="broadcast-blue">Your question is: ${this.question.question}</div>`);
		if (!this.finals) {
			this.canBuzz = false;
			this.update(true);
			this.timeout = setTimeout(() => this.allowBuzzes(), this.question.question.length / 15 * 1000);
		}
	}

	allowBuzzes() {
		this.canBuzz = true;
		this.update(true);
		this.timeout = setTimeout(() => this.allowAllBuzzes(), 1000 * 1 / 3);
	}

	allowAllBuzzes() {
		for (let userID in this.players) {
			this.players[userID].buzzedEarly = false;
		}
	}

	revealAnswer() {
		this.room.addRaw(`<div class="broadcast-blue">The answer was: ${Chat.escapeHTML(this.question.answer)}</div>`);
		this.question.answered = true;
	}

	buzz(user) {
		if (this.state !== 'buzzing') return "You cannot buzz in at this time.";
		let player = this.players[user.userid];
		if (!player) return "You are not in the game of Jeopardy.";
		if (player.buzzed) return "You have already buzzed in to the current question.";
		if (!this.canBuzz) {
			player.buzzedEarly = true;
			player.send("You buzzed early! You now have a delay before you will be able to buzz.");
			return;
		} else if (player.buzzedEarly) {
			return "Your buzzing cooldown has not yet ended.";
		}
		this.curPlayer = player;
		this.curPlayer.buzzed = true;
		this.room.add(`${user.name} has buzzed in!`);
		this.state = "answering";
		this.timeout = setTimeout(() => this.check(false), this.answeringTime * 1000);
	}

	hasRemainingQuestion() {
		for (let i = 0; i < this.questionCount; i++) {
			for (let j = 0; j < this.categoryCount; j++) {
				if (!this.questions[i][j].answered) return true;
			}
		}
		return false;
	}

	startFinals() {
		this.update();
		this.room.add("Time to begin finals! The category is: " + this.finalCategory + "! Please wager your amounts now.");
		this.finals = true;
		this.state = "wagering";
		this.clearwagers();
		this.timeout = setTimeout(() => this.finalWagers(), this.finalsAnsweringTime * 1000);
	}

	wager(amount, user) {
		if (this.state !== "wagering" && (!this.finals || this.curPlayer.id !== user.userid)) return "You cannot wager at this time.";
		let player = this.players[user.userid];
		if (!player) return "You are not in the game of Jeopardy.";
		amount = toId(amount);
		let wager = (amount === 'all' ? player.points : parseInt(amount));
		if (!wager) return "Your wager must be a number, or 'all'";
		if (wager < 0) return "You cannot wager a negative amount";
		if (wager > player.points && (wager > (this.round * 1000) || this.finals)) return "You cannot wager more than your current number of points";
		if (player.wager) return "You have already wagered";
		player.wager = wager;
		player.send(`You have wagered ${wager} points!`);
		if (!this.finals) {
			this.dailyDouble();
		} else {
			for (let userID in this.players) {
				let player = this.players[userID];
				if (!player.wager) return;
			}
			clearTimeout(this.timeout);
			this.finalWagers();
		}
	}
	finalWagers() {
		for (let userID in this.players) {
			let player = this.players[userID];
			if (!player.wager) player.wager = 0;
		}
		this.question = this.finalQuestion;
		this.state = "answering";
		this.askQuestion();
		this.timeout = setTimeout(() => this.doFinals(), this.finalsAnsweringTime * 1000);
	}

	doFinals() {
		this.order = Object.keys(this.players);
		this.doFinalPlayer();
	}

	doFinalPlayer() {
		if (this.order.length === 0) {
			this.revealAnswer();
			let highest = [];
			let maxpoints;
			for (let userID in this.players) {
				let player = this.players[userID];
				let points = player.points;
				if (!maxpoints) {
					highest.push(player.name);
					maxpoints = points;
				} else if (points > maxpoints) {
					highest = [player.name];
					maxpoints = points;
				} else if (points === maxpoints) {
					highest.push(player.name);
				}
			}
			this.room.add(`|raw|<div class=broadcast-green>Congratulations to ${highest.map(n => Chat.escapeHTML(n)).join(", ")} for winning the game of Jeopardy with ${maxpoints} points!`);
			this.destroy();
			return;
		} else {
			this.curPlayer = this.players[this.order.shift()];
			let answer = this.curPlayer.finalanswer;
			if (answer) {
				this.room.add(`${this.curPlayer.name} has answered ${Chat.escapeHTML(answer)}!`);
				this.state = "checking";
			} else {
				let wager = this.curPlayer.wager;
				this.room.add(`${this.curPlayer.name} did not answer the final Jeopardy and loses ${wager} points`);
				let points = this.curPlayer.points;
				points -= wager;
				this.curPlayer.points = points;
				this.timeout = setTimeout(() => this.doFinalPlayer(), 5 * 1000);
			}
		}
	}

	answer(target, user) {
		if (this.state !== 'answering') return "You cannot answer the question at this time.";
		let player = this.players[user.userid];
		if (!player) return "You are not in the game of Jeopardy.";
		if (this.finals) {
			if (player.finalanswer) return "You have already answered the final jeopardy";
			player.answer = Chat.escapeHTML(target);
			player.send(`You have selected your answer as ${Chat.escapeHTML(target)}`);
		} else {
			clearTimeout(this.timeout);
			if (!this.curPlayer || this.curPlayer.userid !== user.userid) return "It is not your turn to answer.";
			this.state = "checking";
			this.room.add(`${user.name} has answered ${Chat.escapeHTML(target)}!`);
		}
	}

	mark(correct) {
		if (this.state !== 'checking') return "There is no answer to currently check.";
		this.check(correct);
	}

	check(correct) {
		if (correct) {
			let gainpoints = ((this.question.dd || this.finals) ? this.curPlayer.wager : this.question.points);
			let points = this.curPlayer.points;
			points += gainpoints;
			this.curPlayer.points = points;
			this.room.add(`${this.curPlayer.name} has answered the question correctly and gained ${gainpoints} points!`);
			if (!this.finals) {
				this.revealAnswer();
			}
			if (this.finals) {
				this.doFinalPlayer();
			} else if (!this.hasRemainingQuestion()) {
				if (this.round === 1) {
					this.round++;
					this.setupGrid();
					this.state = "round2";
				} else {
					this.startFinals();
				}
			} else {
				this.prevPlayer = this.curPlayer;
				this.state = 'selecting';
				this.question = null;
				this.update();
			}
		} else {
			let losspoints = ((this.question.dd || this.finals) ? this.curPlayer.wager : this.question.points);
			this.room.add(`${this.curPlayer.name} answered incorrectly and loses ${losspoints} points!`);
			let points = this.curPlayer.points;
			points -= losspoints;
			this.curPlayer.points = points;
			if (this.finals) {
				this.doFinalPlayer();
			} else if (this.everyBuzzed() || this.question.dd) {
				this.nextQuestion();
			} else {
				this.state = 'buzzing';
			}
		}
	}

	everyBuzzed() {
		for (let userID in this.players) {
			if (!this.players[userID].buzzed) return false;
		}
		return true;
	}
	setCategory(categoryNumber, category) {
		if (categoryNumber === "final") {
			this.finalCategory = category.trim();
		} else {
			this.categories[categoryNumber] = category.trim();
			this.update();
		}
	}

	nextQuestion() {
		this.revealAnswer();
		if (!this.hasRemainingQuestion()) {
			if (this.round === 1) {
				this.round++;
				this.setupGrid();
				this.state = "round2";
			} else {
				this.startFinals();
			}
		} else {
			this.curPlayer = this.prevPlayer;
			this.state = "selecting";
			this.question = null;
			this.update();
		}
	}

	setCategories(categories) {
		if (this.state !== "signups" && this.state !== "round2") return;
		for (const [i, category] of categories.entries()) {
			this.categories[i] = category;
		}
		this.update();
	}

	getQuestion(categoryNumber, questionNumber) {
		let question = this.questions[questionNumber][categoryNumber];
		if (question.question) {
			return `<strong>Question: </strong>${Chat.escapeHTML(question.question)}<br><strong>Answer: </strong>${Chat.escapeHTML(question.answer)}`;
		} else {
			return "That question has not yet been imported.";
		}
	}

	setDailyDouble(categoryNumber, questionNumber) {
		let question = this.questions[questionNumber][categoryNumber];
		if (question.dd) return "That question is already a daily double.";
		question.dd = true;
	}

	importQuestions(questions, questionStart, categoryStart) {
		if (categoryStart === 'finals') {
			let split = questions[0].split("|");
			if (split.length !== 2) return "Final question was unable to be imported.";
			this.finalQuestion.question = split[0].trim();
			this.finalQuestion.answer = split[1].trim();
		} else {
			for (let i = categoryStart; i < this.categoryCount; i++) {
				for (let j = (i === categoryStart ? questionStart : 0); j < this.questionCount; j++) {
					if (questions.length === 0) {
						return;
					}
					let split = questions[0].split("|");
					if (split.length !== 2) return `Questions before ${questions[0]} imported successfully, but ${questions[0]} did not have a question and one answer.`;
					this.questions[j][i].question = split[0].trim();
					this.questions[j][i].answer = split[1].trim();
					questions.shift();
				}
			}
			if (questions.length > 0) {
				let split = questions[0].split("|");
				if (split.length !== 2) return `Questions before ${questions[0]} imported successfully, but ${questions[0]} did not have a question and one answer.`;
				this.finalQuestion.question = split[0].trim();
				this.finalQuestion.answer = split[1].trim();
			}
		}
	}
}

class JeopardyGamePlayer extends Rooms.RoomGamePlayer {
	constructor(user, game) {
		super(user, game);
		this.points = 0;
		this.wager = null;
		this.buzzedEarly = false;
		this.finalanswer = null;
		this.buzzed = false;
	}
}

exports.commands = {
	jp: 'jeopardy',
	jeopardy: {
		off: 'disable',
		disable: function (target, room, user) {
			if (!this.can('gamemanagement', null, room)) return;
			if (room.jeopDisabled) {
				return this.errorReply("Jeopardy is already disabled in this room.");
			}
			room.jeopDisabled = true;
			if (room.chatRoomData) {
				room.chatRoomData.jeopDisabled = true;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("Jeopardy has been disabled for this room.");
		},

		on: 'enable',
		enable: function (target, room, user) {
			if (!this.can('gamemanagement', null, room)) return;
			if (!room.jeopDisabled) {
				return this.errorReply("Jeopardy is already enabled in this room.");
			}
			delete room.jeopDisabled;
			if (room.chatRoomData) {
				delete room.chatRoomData.jeopDisabled;
				Rooms.global.writeChatRoomData();
			}
			return this.sendReply("Jeopardy has been enabled for this room.");
		},

		help: function (target, room, user) {
			return this.parse("/help jeopardy");
		},

		create: 'new',
		new: function (target, room, user) {
			if (room.game) return this.errorReply(`There is already a game of ${room.game.title} in progress in this room.`);
			if (!this.can('minigame', null, room)) return;
			let params = target.split(",");
			let categoryCount = parseInt(params[0]) || MAX_CATEGORY_COUNT;
			let questionCount = parseInt(params[1]) || MAX_QUESTION_COUNT;
			if (categoryCount > MAX_CATEGORY_COUNT) return this.sendReply(`A match with more than ${MAX_CATEGORY_COUNT} categories cannot be created.`);
			if (questionCount > MAX_QUESTION_COUNT) return this.sendReply(`A match with more than ${MAX_QUESTION_COUNT} questions per category cannot be created.`);
			room.game = new Jeopardy(room, user, categoryCount, questionCount);
			this.privateModAction(`A new game of Jeopardy was started by ${user.name}`);
			this.modlog('JEOPARDY');
		},

		categories: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let params = target.split(",");
			if (params.length !== room.game.categoryCount) return this.errorReply(`You must set exactly ${room.game.categoryCount} categories.`);
			let reply = room.game.setCategories(params);
			if (reply) this.errorReply(reply);
		},

		category: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let params = target.split(",");
			if (params.length !== 2) return this.errorReply("You must specify the category number and the category.");
			let categoryNumber;
			if (params[0] === "final") {
				categoryNumber = "final";
			} else {
				categoryNumber = parseInt(params[0]);
				if (!categoryNumber || categoryNumber < 1 || categoryNumber > room.game.categoryCount) return this.errorReply(`The category number must be between 1 and ${room.game.categoryCount}.`);
			}
			room.game.setCategory((categoryNumber === "final" ? categoryNumber : categoryNumber - 1), params[1]);
		},

		select: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			let reply = room.game.select(target, user);
			if (reply) this.errorReply(reply);
		},

		buzz: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			let reply = room.game.buzz(user);
			if (reply) this.errorReply(reply);
		},

		wager: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			let reply = room.game.wager(target, user);
			if (reply) this.errorReply(reply);
		},

		answer: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			let reply = room.game.answer(target, user);
			if (reply) this.errorReply(reply);
		},

		import: function (target, room, user) {
			if (!target) return this.errorReply("You must specify at least one question");
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let params = target.split(",");
			let dataStart = 0;
			let catStart, questionStart;
			if (toId(params[0]) === 'final') {
				catStart = 'finals';
				params.splice(0, 1);
			} else {
				catStart = parseInt(params[0]);
				if (catStart) {
					if (catStart < 1 || catStart > room.game.categoryCount) return this.errorReply(`The category must be a number between 1 and ${room.game.categoryCount}.`);
					dataStart = 1;
					questionStart = parseInt(params[1]);
					if (questionStart) {
						if (questionStart < 1 || questionStart > room.game.questionCount) return this.errorReply(`The question must be a number between 1 and "${room.game.questionCount}.`);
						dataStart = 2;
					} else {
						questionStart = 1;
					}
				} else {
					catStart = 1;
					questionStart = 1;
				}
				params.splice(0, dataStart);
			}
			let reply = room.game.importQuestions(params, questionStart - 1, (catStart === 'finals' ? catStart : catStart - 1));
			if (reply) {
				this.errorReply(reply);
			} else {
				this.sendReply("Questions have been imported.");
			}
		},

		dailydouble: 'dd',
		dd: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let params = target.split(",");
			if (params.length !== 2) return this.errorReply("You must specify the category number and question number");
			let categoryNumber = parseInt(params[0]);
			if (!categoryNumber || categoryNumber < 1 || categoryNumber > room.game.categoryCount) return this.errorReply(`The category must be a number between 1 and ${room.game.categoryCount}.`);
			let questionNumber = parseInt(params[0]);
			if (!questionNumber || questionNumber < 1 || questionNumber > room.game.questionCount) return this.errorReply(`The question must be a number between 1 and ${room.game.questionCount}.`);
			let reply = room.game.setDailyDouble(categoryNumber - 1, questionNumber - 1);
			if (reply) {
				this.errorReply(reply);
			} else {
				this.sendReply("Daily double has been added.");
			}
		},

		dailydoublehelp: [`/jeopardy dailydouble [category number], [question number] - Set a question to be a daily double.`],
		view: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let params = target.split(",");
			if (params.length !== 2) return this.errorReply("You must specify the category number and question number");
			let categoryNumber = parseInt(params[0]);
			if (!categoryNumber || categoryNumber < 1 || categoryNumber > room.game.categoryCount) return this.errorReply(`The category must be a number between 1 and ${room.game.categoryCount}.`);
			let questionNumber = parseInt(params[1]);
			if (!questionNumber || questionNumber < 1 || questionNumber > room.game.questionCount) return this.errorReply(`The question must be a number between 1 and ${room.game.questionCount}.`);
			this.sendReplyBox(room.game.getQuestion(categoryNumber - 1, questionNumber - 1));
		},

		addplayer: 'adduser',
		adduser: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let targetUser = Users.get(target);
			if (!targetUser) return this.errorReply("User '" + target + "' not found.");
			if (room.game.host.userid === targetUser.userid) return this.errorReply("You can't add yourself to the game.");
			if (room.game.addPlayer(targetUser)) {
				room.game.update();
			} else {
				this.errorReply("Unable to add '" + target + "' to the game.");
			}
		},

		incorrect: 'correct',
		correct: function (target, room, user, connection, cmd) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let reply = room.game.mark(cmd === 'correct');
			if (reply) this.errorReply(reply);
		},

		start: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let reply = room.game.start();
			if (reply) this.errorReply(reply);
		},
		removeplayer: 'removeuser',
		removeuser: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let targetUser = Users.get(target);
			if (!targetUser) return this.errorReply(`User '${target}' not found.`);
			if (room.game.removePlayer(targetUser)) {
				room.game.update();
			} else {
				return this.errorReply(`Unable to remove '${targetUser.name}' from the game.`);
			}
		},

		subhost: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let targetUser = Users.get(target);
			if (!targetUser) return this.errorReply(`User '${target}' not found.`);
			room.game.host = targetUser;
			this.sendReply(`${targetUser.name} has subbed in as the host.`);
		},

		state: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			this.sendReply(`The game is currently in the ${room.game.state} state.`);
		},

		end: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (!this.can('minigame', null, room)) return;
			room.game.destroy();
			this.privateModAction(`The game of Jeopardy was ended by ${user.name}`);
			this.modlog('JEOPARDY END');
		},

		pass: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			room.game.nextQuestion();
		},

		timer: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let amount = parseInt(target);
			if (!amount || amount < 2 || amount > 120) return this.errorReply("The amount must be a number between 2 and 120.");

			room.game.answeringTime = amount;
			this.addModAction(`${user.name} has set the answering window for questions to ${amount} seconds`);
			this.modlog('JEOPARDY TIMER', null, `${amount} seconds`);
		},

		finaltimer: function (target, room, user) {
			if (!room.game || room.game.gameid !== 'jeopardy') return this.errorReply("There is no game of Jeopardy going on in this room.");
			if (user.userid !== room.game.host.userid) return this.errorReply("This command can only be used by the host.");
			let amount = parseInt(target);
			if (!amount || amount < 2 || amount > 300) return this.errorReply("The amount must be a number between 2 and 300.");

			room.game.finalAnsweringTime = amount;
			this.addModAction(`${user.name} has set the answering window for the final question to ${amount} seconds`);
			this.modlog('JEOPARDY FINALTIMER', null, `${amount} seconds`);
		},
	},
	jeopardyhelp: [
		`/jp new [number of categories], [number of questions] - Create a new game of jeopardy as the host. Requires: % @ # & ~`,
		`/jp end - End the current game of Jeopardy. Requires: % @ # & ~`,
		`/jp start - Start the game of Jeopardy. Must be the host.`,
		`/jp categories [First Category], [Second Category], etc. - Set the categories of the jeopardy game. Must be the host.`,
		`/jp category [Category Number], [Category Name] - Set a specific category of the jeopardy game. Must be the host.`,
		`/jp select [Category Number], [Question Number] - Select a question of the Jeopardy game.`,
		`/jp buzz - Buzz into the current question.`,
		`/jp answer [answer] - Attempt to answer the current question.`,
		`/jp correct/incorrect - Mark an answer as correct or incorrect. Must be the host.`,
		`/jp dailydouble [Category Number], [Question Number] - Set a question to be a daily double. Must be the host.`,
		`/jp wager [amount] - Wager some money for a daily double or finals. Must be a number or 'all'`,
		`/jp adduser [User] - Add a user to the game of Jeopardy. Must be the host.`,
		`/jp removeuser [User] - Remove a user from the game of Jeopardy. Must be the host.`,
		`/jp view [Category Number], [Question Number] - View a specific question and answer. Must be the host.`,
		`/jp subhost [User] - Sub a new host into the game. Must be the host.`,
		`/jp import [Category Number Start], [Question Number Start], [Question 1 | Answer 1], [Question 2 | Answer 2], etc. - Import questions into the current game of Jeopardy. Must be the host.`,
		`/jp pass - Skip the current question of Jeopardy. Must be the host.`,
		`/jp state - Check the state of the current Jeopardy game. Must be the host`,
		`/jp timer [seconds] - Set the answering window after buzzing for questions`,
		`/jp finaltimer [seconds] - Set the answering window for answering the final question`,
	],
};
