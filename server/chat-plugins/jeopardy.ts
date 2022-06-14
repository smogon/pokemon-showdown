import {Utils} from '../../lib';

const BACKGROUND_COLOR = "#0000FF";
const HEIGHT = 40;
const MAX_CATEGORY_COUNT = 5;
const MAX_QUESTION_COUNT = 5;
const BUZZ_COOLDOWN = 500; // 0.5 seconds

interface Question {
	question: string;
	answer: string;
	points: number;
	answered: boolean;
	dd: boolean;
}

type JeopardyState = 'signups' | 'selecting' | 'answering' | 'wagering' | 'buzzing' | 'checking' | 'round2';

export class Jeopardy extends Rooms.RoomGame<JeopardyGamePlayer> {
	host: User;
	state: JeopardyState;
	gameid: ID;
	categories: string[];
	question: Question;
	questions: Question[][];
	finalQuestion: Question;
	started: boolean;
	categoryCount: number;
	questionCount: number;
	round: number;
	canBuzz: boolean;
	numUpdates: number;
	finalCategory: string;
	answeringTime: number;
	finalAnsweringTime: number;
	timeout: NodeJS.Timer | null;
	roundStarted: boolean;
	// FIXME: this type should be `JeopardyGamePlayer | null`
	curPlayer: JeopardyGamePlayer;
	prevPlayer: JeopardyGamePlayer;
	order: string[];
	points: Map<JeopardyGamePlayer, number>;
	finals: boolean;
	gameNumber: number;

	constructor(room: Room, user: User, categoryCount: number, questionCount: number, playerCap: number) {
		super(room);
		this.gameNumber = room.nextGameNumber();
		this.host = user;
		this.allowRenames = true;
		this.state = "signups";
		this.gameid = 'jeopardy' as ID;
		this.title = 'Jeopardy';
		this.categories = [];
		this.question = Object.create(null);
		this.questions = [];
		this.finalQuestion = Object.create(null);
		this.started = false;
		this.categoryCount = categoryCount;
		this.questionCount = questionCount;
		this.round = 1;
		this.points = new Map();
		this.playerCap = playerCap;
		this.canBuzz = false;
		this.numUpdates = 0;
		this.finalCategory = "";
		this.answeringTime = 10;
		this.finalAnsweringTime = 30;
		this.timeout = null;
		this.roundStarted = false;
		this.curPlayer = new JeopardyGamePlayer(user, this);
		this.prevPlayer = new JeopardyGamePlayer(user, this);
		this.order = [];
		this.finals = false;
		this.setupGrid();
	}

	destroy() {
		if (this.timeout) clearTimeout(this.timeout);
		super.destroy();
	}

	makePlayer(user: User) {
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
				this.questions[i].push({question: '', answer: '', points: 200 * this.round * (i + 1), answered: false, dd: false});
			}
		}
		this.finalQuestion = Object.create(null);
		this.roundStarted = false;
		this.question = Object.create(null);
		if (this.round === 1) {
			this.display();
		} else {
			this.update();
		}
	}

	start() {
		if (this.roundStarted) throw new Chat.ErrorMessage("The game has already been started.");
		if (this.playerCount < 2) throw new Chat.ErrorMessage("The game needs at least two players to start.");
		const noquestions = [];
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
			throw new Chat.ErrorMessage(`The following questions still need questions and answers: ${badstr}.`);
		}
		this.roundStarted = true;
		if (this.round === 1) {
			for (const userID in this.playerTable) {
				const player = this.playerTable[userID];
				this.points.set(player, 0);
			}
		}
		this.state = 'selecting';
		let lowest: string[] = [];
		let minpoints;
		for (const userID in this.playerTable) {
			const points = this.playerTable[userID].points;
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
		this.curPlayer = this.playerTable[lowest[Math.floor(lowest.length * Math.random())]];
		this.prevPlayer = this.curPlayer;
		this.update();
		this.nextPlayer();
	}

	nextPlayer() {
		this.room.addRaw(`${this.curPlayer.name}, you're up!`);
	}

	getGrid() {
		let buffer = `<div class="infobox"><html><body><table align="center" border="2" style="table-layout: fixed; width: 100%"><tr>`;
		for (let i = 0; i < this.categoryCount; i++) {
			buffer += `<td style="word-wrap: break-word" bgcolor="${BACKGROUND_COLOR}"; height="${HEIGHT}px"; width="30px" align="center"><font color="white">${Utils.escapeHTML(this.categories[i])}</font></td>`;
		}
		buffer += `</tr>`;
		for (let i = 0; i < this.questionCount; i++) {
			buffer += `<tr>`;
			for (let j = 0; j < this.categoryCount; j++) {
				buffer += `<td bgcolor="${BACKGROUND_COLOR}"; height="${HEIGHT}px"; align="center"><font color="black" size="6">${(this.questions[i][j].answered ? "" : this.questions[i][j].points)}</font></td>`;
			}
			buffer += `</tr>`;
		}
		buffer += `</table><br />`;
		for (const userID in this.playerTable) {
			const player = this.playerTable[userID];
			const bold = this.curPlayer?.name === player.name;
			buffer += `${bold ? "<b>" : ""}<font size=2>${Utils.escapeHTML(player.name)} (${(player.points || 0)})${bold ? "</b>" : ""}<br />`;
		}
		buffer += `</body></html></div>`;
		return buffer;
	}

	display() {
		this.room.add(`|uhtml|jeopardy${this.gameNumber}-${this.numUpdates}|${this.getGrid()}`);
	}

	update(dontMove = false) {
		if (dontMove) {
			this.room.add(`|uhtmlchange|jeopardy${this.gameNumber}-${this.numUpdates}|${this.getGrid()}`);
		} else {
			this.room.add(`|uhtmlchange|jeopardy${this.gameNumber}-${this.numUpdates}|`);
			this.numUpdates++;
			this.room.add(`|uhtml|jeopardy${this.gameNumber}-${this.numUpdates}|${this.getGrid()}`);
		}
	}

	dailyDouble() {
		if (this.timeout) clearTimeout(this.timeout);
		this.state = 'answering';
		if (!this.curPlayer.wager) this.curPlayer.wager = 0;
		this.askQuestion();
	}

	select(target: string) {
		if (this.state !== 'selecting') throw new Chat.ErrorMessage("The game of Jeopardy is not in the selection phase.");

		const params = target.split(",");
		if (params.length < 2) throw new Chat.ErrorMessage("You must specify a row and a column number.");
		const categoryNumber = parseInt(params[0]);
		if (!categoryNumber || categoryNumber < 1 || categoryNumber > this.categoryCount) {
			throw new Chat.ErrorMessage(`The category must be a number between 1 and ${this.categoryCount}.`);
		}
		const questionNumber = parseInt(params[1]);
		if (!questionNumber || questionNumber < 1 || questionNumber > this.questionCount) {
			throw new Chat.ErrorMessage(`The question must be a number between 1 and ${this.questionCount}.`);
		}
		const question = this.questions[questionNumber - 1][categoryNumber - 1];
		if (question.answered) throw new Chat.ErrorMessage("That question has already been answered.");
		this.question = question;
		if (question.dd) {
			this.room.add(`That was a daily double! ${this.curPlayer.name}, how much would you like to wager?`);
			this.clearWagers();
			this.state = 'wagering';
			this.timeout = setTimeout(() => this.dailyDouble(), 30 * 1000);
		} else {
			this.state = 'buzzing';
			this.askQuestion();
		}
	}

	clearWagers() {
		for (const userID in this.playerTable) {
			this.playerTable[userID].wager = 0;
		}
	}

	clearBuzzes() {
		for (const userID in this.playerTable) {
			this.playerTable[userID].buzzed = false;
		}
	}

	askQuestion() {
		if (!this.question.dd) {
			this.curPlayer = null!;
		}
		this.clearBuzzes();
		this.room.addRaw(`<div class="broadcast-blue">Your question is: ${this.question.question}</div>`);
		if (!this.finals) {
			this.canBuzz = false;
			this.update(true);
			this.timeout = setTimeout(() => this.allowBuzzes(), this.question.question.length / 15 * 1000);
		}
	}

	allowBuzzes() {
		this.canBuzz = true;
		this.room.add(`You may now buzz in for the Jeopardy game!`);
		this.update(true);
		this.timeout = setTimeout(() => this.allowAllBuzzes(), BUZZ_COOLDOWN);
	}

	allowAllBuzzes() {
		for (const userID in this.playerTable) {
			this.playerTable[userID].buzzedEarly = false;
		}
	}

	revealAnswer() {
		this.room.addRaw(`<div class="broadcast-blue">The answer was: ${Utils.escapeHTML(this.question.answer)}</div>`);
		this.question.answered = true;
	}

	buzz(user: User) {
		if (this.state !== 'buzzing') throw new Chat.ErrorMessage("You cannot buzz in at this time.");
		const player = this.playerTable[user.id];
		if (!player) throw new Chat.ErrorMessage("You are not in the game of Jeopardy.");
		if (player.buzzed) throw new Chat.ErrorMessage("You have already buzzed in to the current question.");
		if (!this.canBuzz) {
			player.buzzedEarly = true;
			player.send("You buzzed early! You now have a delay before you will be able to buzz.");
			return;
		} else if (player.buzzedEarly) {
			throw new Chat.ErrorMessage("Your buzzing cooldown has not yet ended.");
		}
		this.curPlayer = player;
		this.curPlayer.buzzed = true;
		this.room.add(`${user.name} has buzzed in!`);
		this.state = "answering";
		this.timeout = setTimeout(() => this.check({correct: false, isBuzzTimeout: true}), this.answeringTime * 1000);
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
		this.clearWagers();
		this.timeout = setTimeout(() => this.finalWagers(), this.finalAnsweringTime * 1000);
	}

	wager(amount: string | number, user: User) {
		if (this.state !== "wagering" && (!this.finals || this.curPlayer?.id !== user.id)) {
			throw new Chat.ErrorMessage("You cannot wager at this time.");
		}
		const player = this.playerTable[user.id];
		if (!player) throw new Chat.ErrorMessage("You are not in the game of Jeopardy.");
		amount = toID(amount);
		const wager = (amount === 'all' ? player.points : parseInt(amount));
		if (!wager || isNaN(wager)) throw new Chat.ErrorMessage("Your wager must be a number, or 'all'.");
		if (wager < 0) throw new Chat.ErrorMessage("You cannot wager a negative amount.");
		if (wager > player.points && (wager > (this.round * 1000) || this.finals)) {
			throw new Chat.ErrorMessage("You cannot wager more than your current number of points.");
		}
		if (player.wager) throw new Chat.ErrorMessage("You have already wagered.");
		player.wager = wager;
		player.send(`You have wagered ${wager} points!`);
		if (!this.finals) {
			this.dailyDouble();
		} else {
			for (const userID in this.playerTable) {
				if (!this.playerTable[userID].wager) return;
			}
			if (this.timeout) clearTimeout(this.timeout);
			this.finalWagers();
		}
	}
	finalWagers() {
		for (const userID in this.playerTable) {
			const player = this.playerTable[userID];
			if (!player.wager) player.wager = 0;
		}
		this.question = this.finalQuestion;
		this.state = "answering";
		this.askQuestion();
		this.timeout = setTimeout(() => this.doFinals(), this.finalAnsweringTime * 1000);
	}

	doFinals() {
		if (!this.playerTable) return this.room?.add(`Could not play finals because the player table does not exist.`);
		this.order = Object.keys(this.playerTable);
		this.doFinalPlayer();
	}

	doFinalPlayer() {
		if (this.order.length === 0) {
			this.revealAnswer();
			let highest: string[] = [];
			let maxpoints;
			for (const userID in this.playerTable) {
				const player = this.playerTable[userID];
				const points = player.points;
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
			this.room.add(`|raw|<div class=broadcast-green>Congratulations to ${highest.map(n => Utils.escapeHTML(n)).join(", ")} for winning the game of Jeopardy with ${maxpoints} points!`);
			this.destroy();
			return;
		} else {
			const index = this.order.shift() || 0;
			this.curPlayer = this.playerTable[index];
			const answer = this.curPlayer.finalAnswer;
			if (answer) {
				this.room.add(`${this.curPlayer.name} has answered ${Utils.escapeHTML(answer)}!`);
				this.state = "checking";
			} else {
				const wager = this.curPlayer.wager;
				this.room.add(`${this.curPlayer.name} did not answer the final Jeopardy and loses ${wager} points`);
				let points = this.curPlayer.points;
				points -= wager;
				this.curPlayer.points = points;
				this.timeout = setTimeout(() => this.doFinalPlayer(), 5 * 1000);
			}
		}
	}

	answer(target: string, user: User) {
		if (this.state !== 'answering') throw new Chat.ErrorMessage("You cannot answer the question at this time.");
		const player = this.playerTable[user.id];
		if (!player) throw new Chat.ErrorMessage("You are not in the game of Jeopardy.");
		if (this.finals) {
			if (player.finalAnswer) throw new Chat.ErrorMessage("You have already answered the Final Jeopardy");
			player.answer = Utils.escapeHTML(target);
			player.send(`You have selected your answer as ${Utils.escapeHTML(target)}.`);
		} else {
			if (this.timeout) clearTimeout(this.timeout);
			if (!this.curPlayer || this.curPlayer.id !== user.id) throw new Chat.ErrorMessage("It is not your turn to answer.");
			this.state = "checking";
			this.room.add(`${user.name} has answered ${Utils.escapeHTML(target)}!`);
		}
	}

	mark(correct: boolean) {
		if (this.state !== 'checking') throw new Chat.ErrorMessage("There is no answer to currently check.");
		this.check({correct});
	}

	check(info: {correct: boolean, isBuzzTimeout?: boolean}) {
		if (info.correct) {
			const gainpoints = ((this.question.dd || this.finals) ? this.curPlayer.wager : this.question.points);
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
				this.question = Object.create(null);
				this.update();
			}
		} else {
			const losspoints = ((this.question.dd || this.finals) ? this.curPlayer.wager : this.question.points);
			const action = info.isBuzzTimeout ? 'failed to answer in time' : 'answered incorrectly';
			this.room.add(`${this.curPlayer.name} ${action} and loses ${losspoints} points!`);
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
		for (const userID in this.playerTable) {
			if (!this.playerTable[userID].buzzed) return false;
		}
		return true;
	}
	setCategory(categoryNumber: string | number, category: string) {
		if (typeof categoryNumber === 'string') {
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
			this.question = Object.create(null);
			this.update();
		}
	}

	setCategories(categories: string[]) {
		if (this.state !== "signups" && this.state !== "round2") return false;
		for (const [i, category] of categories.entries()) {
			this.categories[i] = category;
		}
		this.update();
	}

	getQuestion(categoryNumber: number, questionNumber: number) {
		const question = this.questions[questionNumber][categoryNumber];
		if (question.question) {
			return `<strong>Question: </strong>${Utils.escapeHTML(question.question)}<br><strong>Answer: </strong>${Utils.escapeHTML(question.answer)}`;
		} else {
			return "That question has not yet been imported.";
		}
	}

	setDailyDouble(categoryNumber: number, questionNumber: number) {
		const question = this.questions[questionNumber][categoryNumber];
		if (question.dd) throw new Chat.ErrorMessage("That question is already a daily double.");
		question.dd = true;
	}

	importQuestions(questions: string[], questionStart: number, categoryStart: string | number) {
		if (typeof categoryStart === 'string') {
			const split = questions[0].split("|");
			if (split.length !== 2) throw new Chat.ErrorMessage("Final question was unable to be imported.");
			this.finalQuestion.question = split[0].trim();
			this.finalQuestion.answer = split[1].trim();
		} else {
			for (let i = categoryStart; i < this.categoryCount; i++) {
				for (let j = (i === categoryStart ? questionStart : 0); j < this.questionCount; j++) {
					if (questions.length === 0) {
						return;
					}
					const split = questions[0].split("|");
					if (split.length !== 2) {
						throw new Chat.ErrorMessage(`Questions before ${questions[0]} imported successfully, but ${questions[0]} did not have a question and one answer.`);
					}
					this.questions[j][i].question = split[0].trim();
					this.questions[j][i].answer = split[1].trim();
					questions.shift();
				}
			}
			if (questions.length > 0) {
				const split = questions[0].split("|");
				if (split.length !== 2) {
					throw new Chat.ErrorMessage(`Questions before ${questions[0]} imported successfully, but ${questions[0]} did not have a question and one answer.`);
				}
				this.finalQuestion.question = split[0].trim();
				this.finalQuestion.answer = split[1].trim();
			}
		}
	}

	givePoints(user: User | ID, n: number) {
		const id = toID(user);
		if (!(id in this.playerTable)) throw new Chat.ErrorMessage(`'${id}' is not a player in the game of Jeopardy.`);
		this.playerTable[id].points += n;
	}

	substitute(original: User, substitute: User) {
		const originalPlayer = this.playerTable[original.id];
		if (!originalPlayer) throw new Chat.ErrorMessage(`${original.name} is not a player in the game of Jeopardy.`);

		delete this.playerTable[original.id];
		this.addPlayer(substitute);

		this.playerTable[substitute.id].answer = originalPlayer.answer;
		this.playerTable[substitute.id].points = originalPlayer.points;
		this.playerTable[substitute.id].wager = originalPlayer.wager;
		this.playerTable[substitute.id].buzzedEarly = originalPlayer.buzzedEarly;
		this.playerTable[substitute.id].finalAnswer = originalPlayer.finalAnswer;
		this.playerTable[substitute.id].buzzed = originalPlayer.buzzed;

		this.room.add(`${substitute.name} subbed in for ${original.name}!`);
	}
}

class JeopardyGamePlayer extends Rooms.RoomGamePlayer<Jeopardy> {
	answer: string;
	points: number;
	wager: number;
	buzzedEarly: boolean;
	finalAnswer: string;
	buzzed: boolean;

	constructor(user: User, game: Jeopardy) {
		super(user, game);
		this.answer = '';
		this.points = 0;
		this.wager = 0;
		this.buzzedEarly = false;
		this.finalAnswer = '';
		this.buzzed = false;
	}
}

export const commands: Chat.ChatCommands = {
	jp: 'jeopardy',
	jeopardy: {
		'': 'help',
		help() {
			return this.parse("/help jeopardy");
		},

		off: 'disable',
		disable(target, room, user) {
			room = this.requireRoom();
			this.checkCan('gamemanagement', null, room);
			if (room.settings.jeopardyDisabled) {
				return this.errorReply("Jeopardy is already disabled in this room.");
			}
			room.settings.jeopardyDisabled = true;
			room.saveSettings();
			return this.sendReply("Jeopardy has been disabled for this room.");
		},

		on: 'enable',
		enable(target, room, user) {
			room = this.requireRoom();
			this.checkCan('gamemanagement', null, room);
			if (!room.settings.jeopardyDisabled) {
				return this.errorReply("Jeopardy is already enabled in this room.");
			}
			delete room.settings.jeopardyDisabled;
			room.saveSettings();
			return this.sendReply("Jeopardy has been enabled for this room.");
		},

		create: 'new',
		new(target, room, user) {
			room = this.requireRoom();
			if (room.game) {
				return this.errorReply(`There is already a game of ${room.game.title} in progress in this room.`);
			}
			this.checkCan('minigame', null, room);
			const params = target.split(",");

			const playerCap = parseInt(params[0]);
			const categoryCount = parseInt(params[1]);
			const questionCount = parseInt(params[2]);
			if (isNaN(playerCap) || playerCap <= 1) {
				return this.errorReply(`The player cap must be a number above 1.`);
			}

			if (isNaN(categoryCount) || categoryCount <= 0) {
				return this.errorReply(`The category count must be a number above 0.`);
			}
			if (categoryCount > MAX_CATEGORY_COUNT) {
				return this.sendReply(`A match with more than ${MAX_CATEGORY_COUNT} categories cannot be created.`);
			}

			if (isNaN(questionCount) || questionCount <= 0) {
				return this.errorReply(`The question count must be a number above 0.`);
			}
			if (questionCount > MAX_QUESTION_COUNT) {
				return this.sendReply(
					`A match with more than ${MAX_QUESTION_COUNT} questions per category cannot be created.`
				);
			}
			room.game = new Jeopardy(room, user, categoryCount, questionCount, playerCap);
			this.privateModAction(`${user.name} started a new game of Jeopardy.`);
			this.modlog('JEOPARDY', null, `maximum of ${playerCap} players, ${categoryCount} categories, and ${questionCount} questions`);
		},

		categories(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			const params = target.split(",");
			if (params.length !== game.categoryCount) {
				return this.errorReply(`You must set exactly ${game.categoryCount} categories.`);
			}
			const reply = game.setCategories(params);
			if (reply) this.errorReply(reply);
		},

		category(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			const params = target.split(",");
			if (params.length !== 2) return this.errorReply("You must specify the category number and the category.");
			let categoryNumber: string | number;
			if (params[0] === "final") {
				categoryNumber = "final";
			} else {
				categoryNumber = parseInt(params[0]);
				if (!categoryNumber || categoryNumber < 1 || categoryNumber > game.categoryCount) {
					return this.errorReply(`The category number must be between 1 and ${game.categoryCount}.`);
				}
			}
			game.setCategory((typeof categoryNumber === 'string' ? categoryNumber : categoryNumber - 1), params[1]);
		},

		select(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			game.select(target);
		},

		buzz(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			game.buzz(user);
		},

		wager(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.lastCommand !== `/jeopardy wager ${target}`) {
				user.lastCommand = `/jeopardy wager ${target}`;
				return this.sendReply(`To confirm your wager of ${target}, type '${user.lastCommand}' again.`);
			}
			game.wager(target, user);
		},

		answer(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			game.answer(target, user);
		},

		import(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (!target) return this.errorReply("You must specify at least one question");
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			const params = target.split(",");
			let dataStart = 0;
			let catStart: string | number;
			let questionStart = 1;
			if (toID(params[0]) === 'final') {
				catStart = 'finals';
				params.splice(0, 1);
			} else {
				if (isNaN(Utils.parseExactInt(params[0])) || isNaN(Utils.parseExactInt(params[1]))) {
					return this.errorReply(`You must specify numeric values for Category Number Start and Question Number Start.`);
				}
				catStart = parseInt(params[0]);
				if (catStart) {
					if (catStart < 1 || catStart > game.categoryCount) {
						return this.errorReply(`The category must be a number between 1 and ${game.categoryCount}.`);
					}
					dataStart = 1;
					questionStart = parseInt(params[1]);
					if (questionStart) {
						if (questionStart < 1 || questionStart > game.questionCount) {
							return this.errorReply(`The question must be a number between 1 and ${game.questionCount}.`);
						}
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
			const numberOfQuestions = params.length;
			game.importQuestions(
				params, questionStart - 1, (typeof catStart === 'string' ? catStart : catStart - 1)
			);
			this.sendReply(`Imported ${numberOfQuestions} questions.`);
		},

		dd: 'dailydouble',
		dailydouble(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			const params = target.split(",");
			if (params.length !== 2) return this.errorReply("You must specify the category number and question number");
			const categoryNumber = parseInt(params[0]);
			if (!categoryNumber || categoryNumber < 1 || categoryNumber > game.categoryCount) {
				return this.errorReply(`The category must be a number between 1 and ${game.categoryCount}.`);
			}
			const questionNumber = parseInt(params[0]);
			if (!questionNumber || questionNumber < 1 || questionNumber > game.questionCount) {
				return this.errorReply(`The question must be a number between 1 and ${game.questionCount}.`);
			}
			game.setDailyDouble(categoryNumber - 1, questionNumber - 1);
			this.sendReply("Daily double has been added.");
		},
		dailydoublehelp: [
			`/jeopardy dailydouble [category number], [question number] - Set a question to be a daily double.`,
		],

		view(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			const params = target.split(",");
			if (params.length !== 2) return this.errorReply("You must specify the category number and question number");
			const categoryNumber = parseInt(params[0]);
			if (!categoryNumber || categoryNumber < 1 || categoryNumber > game.categoryCount) {
				return this.errorReply(`The category must be a number between 1 and ${game.categoryCount}.`);
			}
			const questionNumber = parseInt(params[1]);
			if (!questionNumber || questionNumber < 1 || questionNumber > game.questionCount) {
				return this.errorReply(`The question must be a number between 1 and ${game.questionCount}.`);
			}
			this.sendReplyBox(game.getQuestion(categoryNumber - 1, questionNumber - 1));
		},

		join(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (game.host.id === user.id) return this.errorReply("You are the host and therefore cannot join the game.");
			if (game.state !== 'signups') return this.errorReply("This Jeopardy game is not in its signups phase.");
			if (game.addPlayer(user)) {
				game.update();
			} else {
				this.errorReply("Unable to join the game.");
			}
		},

		incorrect: 'correct',
		correct(target, room, user, connection, cmd) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			game.mark(cmd === 'correct');
		},

		start(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			game.start();
		},

		kick: 'leave',
		leave(target, room, user, connection, cmd) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			const kicking = cmd.includes('kick');
			if (kicking && user.id !== game.host.id) return this.errorReply("Only the host can kick players.");
			const targetUser = kicking ? Users.get(target) : user;
			if (!targetUser) return this.errorReply(`User '${target}' not found.`);
			if (game.removePlayer(targetUser)) {
				game.update();
			} else {
				return this.errorReply(`Unable to remove '${targetUser.name}' from the game.`);
			}
		},

		subhost(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);

			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			const targetUser = Users.get(target);
			if (!targetUser) return this.errorReply(`User '${target}' not found.`);
			game.host = targetUser;
			this.sendReply(`${targetUser.name} has subbed in as the host.`);
		},

		subplayer(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");

			const split = target.split(',');
			if (split.length !== 2) return this.parse(`/help jeopardy`);
			const [toSubOut, toSubIn] = split.map(u => Users.get(u));
			if (!toSubOut) return this.errorReply(`User '${target[0]}' not found.`);
			if (!toSubIn) return this.errorReply(`User '${target[1]}' not found.`);

			game.substitute(toSubOut, toSubIn);
		},

		state(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			this.sendReply(`The game is currently in the ${game.state} state.`);
		},

		end(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			this.checkCan('minigame', null, room);
			game.destroy();
			this.privateModAction(`${user.name} ended the game of Jeopardy.`);
			this.modlog('JEOPARDY END');
		},

		pass(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			game.nextQuestion();
		},

		timer(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			const amount = parseInt(target);
			if (!amount || amount < 2 || amount > 120) return this.errorReply("The amount must be a number between 2 and 120.");

			game.answeringTime = amount;
			this.addModAction(`${user.name} has set the answering window for questions to ${amount} seconds`);
			this.modlog('JEOPARDY TIMER', null, `${amount} seconds`);
		},

		finaltimer(target, room, user) {
			room = this.requireRoom();
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");
			const amount = parseInt(target);
			if (!amount || amount < 2 || amount > 300) return this.errorReply("The amount must be a number between 2 and 300.");

			game.finalAnsweringTime = amount;
			this.addModAction(`${user.name} has set the answering window for the final question to ${amount} seconds`);
			this.modlog('JEOPARDY FINALTIMER', null, `${amount} seconds`);
		},

		removepoints: 'addpoints',
		addpoints(target, room, user, connection, cmd) {
			room = this.requireRoom();
			if (!target) return this.parse(`/help jeopardy`);
			const game = this.requireGame(Jeopardy);
			if (user.id !== game.host.id) return this.errorReply("This command can only be used by the host.");

			const [recipient, pointsString] = target.split(',');
			let points = parseInt(pointsString);
			if (points <= 0 || isNaN(points)) {
				return this.errorReply(`You must provide a positive number of points to add/remove.`);
			}
			if (cmd.includes('remove')) points *= -1;
			game.givePoints(toID(recipient), points);
		},
	},
	jeopardyhelp() {
		this.runBroadcast();
		return this.sendReply(
			`|html|<details class="readmore"><summary><code>/jp new [player cap], [number of categories], [number of questions]</code>: Host a new game of Jeopardy. Requires: % @ # &<br />` +
			`<code>/jp join</code>: Join the game of Jeopardy.<br />` +
			`<code>/jp leave</code>: Leave the game of Jeopardy.<br />` +
			`<code>/jp buzz</code>: Buzz into the current question.<br />` +
			`<code>/jp answer [answer]</code>: Attempt to answer the current question.</summary>` +
			`<code>/jp start</code>: Start the game of Jeopardy. Must be the host.<br />` +
			`<code>/jp correct/incorrect</code>: Mark an answer as correct or incorrect. Must be the host.<br />` +
			`<code>/jp categories [First Category], [Second Category], etc.</code>: Set the categories of the jeopardy game. Must be the host.<br />` +
			`<code>/jp category [Category Number], [Category Name]</code>: Set a specific category of the jeopardy game. Must be the host.<br />` +
			`<code>/jp select [Category Number], [Question Number]</code>: Select a question of the Jeopardy game.<br />` +
			`<code>/jp end</code>: End the current game of Jeopardy. Requires: % @ # &<br />` +
			`<code>/jp dailydouble [Category Number], [Question Number]</code>: Set a question to be a daily double. Must be the host.<br />` +
			`<code>/jp wager [amount]</code>: Wager some money for a daily double or finals. Must be a number or 'all'<br />` +
			`<code>/jp kick [User]</code>: Remove a user from the game of Jeopardy. Must be the host.<br />` +
			`<code>/jp view [Category Number], [Question Number]</code>: View a specific question and answer. Must be the host.<br />` +
			`<code>/jp subhost [User]</code>: Sub a new host into the game. Must be the host.<br />` +
			`<code>/jp subplayer [original], [substitute]</code>: Sub a new player into the game. Must be the host.<br />` +
			`<code>/jp import [Category Number Start], [Question Number Start], [Question 1 | Answer 1], [Question 2 | Answer 2], etc.</code>: Import questions into the current game of Jeopardy. Must be the host.<br />` +
			`<code>/jp pass</code>: Skip the current question of Jeopardy. Must be the host.<br />` +
			`<code>/jp state</code>: Check the state of the current Jeopardy game. Must be the host.<br />` +
			`<code>/jp timer [seconds]</code>: Set the answering window after buzzing for questions<br />` +
			`<code>/jp finaltimer [seconds]</code>: Set the answering window for answering the final question<br />` +
			`<code>/jp addpoints [user], [number of points]</code>: Give a player an arbitrary number of points. Must be the host.<br />` +
			`<code>/jp remove [user], [number of points]</code>: Subtract an arbitrary number of points from a player. Must be the host.</details>`
		);
	},
};

export const roomSettings: Chat.SettingsHandler = room => ({
	label: "Jeopardy",
	permission: 'editroom',
	options: [
		[`disabled`, room.settings.jeopardyDisabled || 'jeopardy disable'],
		[`enabled`, !room.settings.jeopardyDisabled || 'jeopardy enable'],
	],
});
