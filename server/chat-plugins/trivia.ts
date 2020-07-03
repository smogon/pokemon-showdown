/*
 * Trivia plugin
 * Written by Morfent
 */

import {FS} from '../../lib/fs';
import {Utils} from '../../lib/utils';

const MAIN_CATEGORIES: {[k: string]: string} = {
	ae: 'Arts and Entertainment',
	pokemon: 'Pok\u00E9mon',
	sg: 'Science and Geography',
	sh: 'Society and Humanities',
};

const SPECIAL_CATEGORIES: {[k: string]: string} = {
	misc: 'Miscellaneous',
	subcat: 'Sub-Category',
};

const ALL_CATEGORIES: {[k: string]: string} = {
	ae: 'Arts and Entertainment',
	misc: 'Miscellaneous',
	pokemon: 'Pok\u00E9mon',
	sg: 'Science and Geography',
	sh: 'Society and Humanities',
	subcat: 'Sub-Category',
};

const MODES: {[k: string]: string} = {
	first: 'First',
	number: 'Number',
	timer: 'Timer',
	triumvirate: 'Triumvirate',
	tri: 'Triumvirate',
	triforce: 'Triumvirate',
};

const LENGTHS: {[k: string]: {cap: number, prizes: number[]}} = {
	short: {
		cap: 20,
		prizes: [3, 2, 1],
	},
	medium: {
		cap: 35,
		prizes: [4, 2, 1],
	},
	long: {
		cap: 50,
		prizes: [5, 3, 1],
	},
};

Object.setPrototypeOf(MAIN_CATEGORIES, null);
Object.setPrototypeOf(SPECIAL_CATEGORIES, null);
Object.setPrototypeOf(ALL_CATEGORIES, null);
Object.setPrototypeOf(MODES, null);
Object.setPrototypeOf(LENGTHS, null);

const SIGNUP_PHASE = 'signups';
const QUESTION_PHASE = 'question';
const INTERMISSION_PHASE = 'intermission';
const LIMBO_PHASE = 'limbo';

const MINIMUM_PLAYERS = 3;
const START_TIMEOUT = 30 * 1000;
const INTERMISSION_INTERVAL = 20 * 1000;

const MAX_QUESTION_LENGTH = 252;
const MAX_ANSWER_LENGTH = 32;

interface TriviaQuestion {
	question: string;
	category: string;
	answers: string[];
	user?: string;
	type?: string;
}

type TriviaRank = [number, number, number];

interface TriviaLeaderboard {
	[k: string]: TriviaRank;
}

interface TriviaGame {
	mode: string;
	length: string;
	category: string;
}

type TriviaLadder = TriviaRank[][];

interface TriviaData {
	questions?: TriviaQuestion[];
	submissions?: TriviaQuestion[];
	leaderboard?: TriviaLeaderboard;
	altLeaderboard?: TriviaLeaderboard;
	ladder?: TriviaLadder;
	history?: TriviaGame[];
}

interface TopPlayer {
	id: string;
	player: TriviaPlayer;
	name: string;
}

const PATH = 'config/chat-plugins/triviadata.json';

/**
 * TODO: move trivia database code to a separate file once relevant.
 */
let triviaData: TriviaData = {};
try {
	triviaData = JSON.parse(FS(PATH).readIfExistsSync() || "{}");
} catch (e) {} // file doesn't exist or contains invalid JSON

if (!triviaData || typeof triviaData !== 'object') triviaData = {};
if (typeof triviaData.leaderboard !== 'object') triviaData.leaderboard = {};
if (typeof triviaData.altLeaderboard !== 'object') triviaData.altLeaderboard = {};
if (!Array.isArray(triviaData.questions)) triviaData.questions = [];
if (!Array.isArray(triviaData.submissions)) triviaData.submissions = [];
if (triviaData.questions.some(q => !('type' in q))) {
	triviaData.questions = triviaData.questions.map(q => Object.assign(Object.create(null), q, {type: 'trivia'}));
}

function isTriviaRoom(room: Room) {
	if (room.roomid === 'trivia') return true;
	return false;
}

function getTriviaGame(context: CommandContext) {
	const room = context.room;
	if (!room) return false;
	const game = room.game;
	if (!game) {
		context.errorReply(`There is no game in progress.`);
		return false;
	}
	if (!game.constructor.name.endsWith('Trivia')) {
		context.errorReply(`The currently running game is not Trivia, it's ${game.title}.`);
		return false;
	}
	return game as Trivia;
}

function writeTriviaData() {
	FS(PATH).writeUpdate(() => (
		JSON.stringify(triviaData, null, 2)
	));
}

/**
 * Binary search for the index at which to splice in new questions in a category,
 * or the index at which to slice up to for a category's questions
 * TODO: why isn't this a map? Storing questions/submissions sorted by
 * category is pretty stupid when maps exist for that purpose.
 */
function findEndOfCategory(category: string, inSubmissions = false) {
	const questions = inSubmissions ? triviaData.submissions! : triviaData.questions!;
	let left = 0;
	let right = questions.length;
	let i = 0;
	let curCategory;
	while (left < right) {
		i = Math.floor((left + right) / 2);
		curCategory = questions[i].category;
		if (curCategory < category) {
			left = i + 1;
		} else if (curCategory > category) {
			right = i;
		} else {
			while (++i < questions.length) {
				if (questions[i].category !== category) break;
			}
			return i;
		}
	}

	return left;
}

function sliceCategory(category: string): TriviaQuestion[] {
	const questions = triviaData.questions;
	if (!questions?.length) return [];

	const sliceUpTo = findEndOfCategory(category, false);
	if (!sliceUpTo) return [];

	const categories = Object.keys(ALL_CATEGORIES);
	const categoryIdx = categories.indexOf(category);
	if (!categoryIdx) return questions.slice(0, sliceUpTo);

	// findEndOfCategory for the category prior to the specified one in
	// alphabetical order returns the index of the first question in it
	const sliceFrom = findEndOfCategory(categories[categoryIdx - 1], false);
	if (sliceFrom === sliceUpTo) return [];

	return questions.slice(sliceFrom, sliceUpTo);
}

class Ladder {
	leaderboard: TriviaLeaderboard;
	cache: {ladder: TriviaLadder, ranks: TriviaLeaderboard} | null;
	constructor(leaderboard: TriviaLeaderboard) {
		this.leaderboard = leaderboard;
		this.cache = null;
	}

	invalidateCache() {
		this.cache = null;
	}

	get() {
		if (this.cache) {
			return this.cache;
		}
		this.cache = this.computeCachedLadder();
		return this.cache;
	}

	computeCachedLadder() {
		const leaders = Object.keys(this.leaderboard);
		const ladder: TriviaLadder = [];
		const ranks: TriviaLeaderboard = {};
		for (const leader of leaders) {
			ranks[leader] = [0, 0, 0];
		}
		for (let i = 0; i < 3; i++) {
			leaders.sort((a, b) => this.leaderboard[b][i] - this.leaderboard[a][i]);

			let max = Infinity;
			let rank = -1;
			for (const leader of leaders) {
				const score = this.leaderboard[leader][i];
				if (max !== score) {
					rank++;
					max = score;
				}
				if (i === 0 && rank < 15) {
					if (!ladder[rank]) ladder[rank] = [];
					ladder[rank].push(leader as unknown as TriviaRank);
				}
				ranks[leader][i] = rank + 1;
			}
		}
		return {ladder, ranks};
	}
}

const cachedLadder = new Ladder(triviaData.leaderboard);
const cachedAltLadder = new Ladder(triviaData.altLeaderboard);

class TriviaPlayer extends Rooms.RoomGamePlayer {
	points: number;
	correctAnswers: number;
	answer: string;
	currentAnsweredAt: number[];
	lastQuestion: number;
	answeredAt: number[];
	isCorrect: boolean;
	isAbsent: boolean;

	constructor(user: User, game: RoomGame) {
		super(user, game);
		this.points = 0;
		this.correctAnswers = 0;
		this.answer = '';
		this.currentAnsweredAt = [];
		this.lastQuestion = 0;
		this.answeredAt = [];
		this.isCorrect = false;
		this.isAbsent = false;
	}

	setAnswer(answer: string, isCorrect?: boolean) {
		this.answer = answer;
		this.currentAnsweredAt = process.hrtime();
		this.isCorrect = !!isCorrect;
	}

	incrementPoints(points = 0, lastQuestion = 0) {
		this.points += points;
		this.answeredAt = this.currentAnsweredAt;
		this.lastQuestion = lastQuestion;
		this.correctAnswers++;
	}

	clearAnswer() {
		this.answer = '';
		this.isCorrect = false;
	}

	toggleAbsence() {
		this.isAbsent = !this.isAbsent;
	}

	reset() {
		this.points = 0;
		this.correctAnswers = 0;
		this.answer = '';
		this.answeredAt = [];
		this.isCorrect = false;
	}
}

class Trivia extends Rooms.RoomGame {
	playerTable: {[k: string]: TriviaPlayer};
	gameid: ID;
	minPlayers: number;
	kickedUsers: Set<string>;
	canLateJoin: boolean;
	game: TriviaGame;
	questions: TriviaQuestion[];
	phase: string;
	phaseTimeout: NodeJS.Timer | null;
	questionNumber: number;
	curQuestion: string;
	curAnswers: string[];
	askedAt: number[];
	constructor(
		room: Room, mode: string, category: string,
		length: string, questions: TriviaQuestion[], isRandomMode = false
	) {
		super(room);
		this.playerTable = {};
		this.gameid = 'trivia' as ID;
		this.title = 'Trivia';
		this.allowRenames = true;
		this.playerCap = Number.MAX_SAFE_INTEGER;

		this.minPlayers = MINIMUM_PLAYERS;
		this.kickedUsers = new Set();
		this.canLateJoin = true;

		switch (category) {
		case 'all':
			category = 'All'; break;
		case 'random':
			category = `Random (${ALL_CATEGORIES[questions[0].category]})`; break;
		default:
			category = ALL_CATEGORIES[category];
		}

		this.game = {
			mode: (isRandomMode ? `Random (${MODES[mode]})` : MODES[mode]),
			length: length,
			category: category,
		};

		this.questions = questions;

		this.phase = SIGNUP_PHASE;
		this.phaseTimeout = null;

		this.questionNumber = 0;
		this.curQuestion = '';
		this.curAnswers = [];
		this.askedAt = [];

		this.init();
	}

	setPhaseTimeout(callback: (...args: any[]) => void, timeout: number) {
		if (this.phaseTimeout) {
			clearTimeout(this.phaseTimeout);
		}
		this.phaseTimeout = setTimeout(callback, timeout);
	}

	getCap() {
		return LENGTHS[this.game.length].cap;
	}

	/**
	 * How long the players should have to answer a question.
	 */
	getRoundLength() {
		return 12 * 1000 + 500;
	}

	addTriviaPlayer(user: User) {
		if (this.playerTable[user.id]) return 'You have already signed up for this game.';
		for (const id in user.prevNames) {
			if (this.playerTable[id]) return 'You have already signed up for this game.';
		}
		if (this.kickedUsers.has(user.id)) {
			return 'You were kicked from the game and thus cannot join it again.';
		}
		for (const id in user.prevNames) {
			if (this.playerTable[id]) return 'You have already signed up for this game.';
			if (this.kickedUsers.has(id)) return 'You were kicked from the game and cannot join until the next game.';
		}

		for (const id in this.playerTable) {
			const tarUser = Users.get(id);
			if (tarUser) {
				if (tarUser.prevNames[user.id]) return 'You have already signed up for this game.';

				const tarPrevNames = Object.keys(tarUser.prevNames);
				const prevNameMatch = tarPrevNames.some(tarId => (tarId in user.prevNames));
				if (prevNameMatch) return 'You have already signed up for this game.';

				const tarIps = Object.keys(tarUser.ips);
				const ipMatch = tarIps.some(ip => (ip in user.ips));
				if (ipMatch) return 'You have already signed up for this game.';
			}
		}
		if (this.phase !== SIGNUP_PHASE && !this.canLateJoin) return "This game does not allow latejoins.";
		this.addPlayer(user);
	}

	makePlayer(user: User): TriviaPlayer {
		return new TriviaPlayer(user, this);
	}

	destroy() {
		if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
		this.phaseTimeout = null;
		this.kickedUsers.clear();
		super.destroy();
	}

	onConnect(user: User) {
		const player = this.playerTable[user.id];
		if (!player || !player.isAbsent) return false;

		player.toggleAbsence();
		if (++this.playerCount < MINIMUM_PLAYERS) return false;
		if (this.phase !== LIMBO_PHASE) return false;

		for (const i in this.playerTable) {
			this.playerTable[i].clearAnswer();
		}

		this.broadcast(
			'Enough players have returned to continue the game!',
			'The game will continue with the next question.'
		);
		this.askQuestion();
		return true;
	}

	onLeave(user: User, oldUserID: ID) {
		// The user cannot participate, but their score should be kept
		// regardless in cases of disconnects.
		const player = this.playerTable[oldUserID || user.id];
		if (!player || player.isAbsent) return false;

		player.toggleAbsence();
		if (--this.playerCount >= MINIMUM_PLAYERS) return false;

		// At least let the game start first!!
		if (this.phase === SIGNUP_PHASE) return false;

		if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
		this.phaseTimeout = null;
		this.phase = LIMBO_PHASE;
		this.broadcast(
			'Not enough players are participating to continue the game!',
			`Until there are ${MINIMUM_PLAYERS} players participating and present, the game will be paused.`
		);
		return true;
	}

	/**
	 * Handles setup that shouldn't be done from the constructor.
	 */
	init() {
		this.broadcast(
			'Signups for a new trivia game have begun!',
			`Mode: ${this.game.mode} | Category: ${this.game.category} | Score cap: ${this.getCap()}<br />` +
			'Enter /trivia join to sign up for the trivia game.'
		);
	}

	/**
	 * Generates and broadcasts the HTML for a generic announcement containing
	 * a title and an optional message.
	 */
	broadcast(title: string, message?: string) {
		let buffer = `<div class="broadcast-blue"><strong>${title}</strong>`;
		if (message) buffer += `<br />${message}`;
		buffer += '</div>';

		if (!this.room) return null;
		return this.room.addRaw(buffer).update();
	}

	getDescription() {
		return `Mode: ${this.game.mode} | Category: ${this.game.category} | Score cap: ${this.getCap()}`;
	}

	/**
	 * Formats the player list for display when using /trivia players.
	 */
	formatPlayerList(settings: {max: number | null, requirePoints?: boolean}) {
		return this.getTopPlayers(settings).map(player => {
			const buf = Utils.html`${player.name} (${player.player.points || "0"})`;
			return player.player.isAbsent ? `<span style="color: #444444">${buf}</span>` : buf;
		}).join(', ');
	}

	/**
	 * Kicks a player from the game, preventing them from joining it again
	 * until the next game begins.
	 */
	kick(tarUser: User) {
		if (!this.playerTable[tarUser.id]) {
			if (this.kickedUsers.has(tarUser.id)) return `User ${tarUser.name} has already been kicked from the game.`;

			for (const id in tarUser.prevNames) {
				if (this.kickedUsers.has(id)) return `User ${tarUser.name} has already been kicked from the game.`;
			}

			for (const kickedUserid of this.kickedUsers) {
				const kickedUser = Users.get(kickedUserid);
				if (kickedUser) {
					if (kickedUser.prevNames[tarUser.id]) {
						return `User ${tarUser.name} has already been kicked from the game.`;
					}

					const prevNames = Object.keys(kickedUser.prevNames);
					const nameMatch = prevNames.some(id => tarUser.prevNames[id]);
					if (nameMatch) return `User ${tarUser.name} has already been kicked from the game.`;

					const ips = Object.keys(kickedUser.ips);
					const ipMatch = ips.some(ip => tarUser.ips[ip]);
					if (ipMatch) return `User ${tarUser.name} has already been kicked from the game.`;
				}
			}

			return `User ${tarUser.name} is not a player in the game.`;
		}

		this.kickedUsers.add(tarUser.id);
		for (const id in tarUser.prevNames) {
			this.kickedUsers.add(id);
		}

		super.removePlayer(tarUser);
	}

	leave(user: User) {
		if (!this.playerTable[user.id]) {
			return 'You are not a player in the current game.';
		}
		super.removePlayer(user);
	}

	/**
	 * Starts the question loop for a trivia game in its signup phase.
	 */
	start() {
		if (this.phase !== SIGNUP_PHASE) return 'The game has already been started.';
		if (this.playerCount < this.minPlayers) {
			return `Not enough players have signed up yet! At least ${this.minPlayers} players to begin.`;
		}

		this.broadcast(`The game will begin in ${START_TIMEOUT / 1000} seconds...`);
		this.phase = INTERMISSION_PHASE;
		this.setPhaseTimeout(() => this.askQuestion(), START_TIMEOUT);
	}

	/**
	 * Broadcasts the next question on the questions list to the room and sets
	 * a timeout to tally the answers received.
	 */
	askQuestion() {
		if (!this.questions.length) {
			if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
			this.phaseTimeout = null;
			this.broadcast(
				'No questions are left!',
				'The game has reached a stalemate'
			);
			if (this.room) this.destroy();
			return;
		}

		this.phase = QUESTION_PHASE;
		this.askedAt = process.hrtime();

		const question = this.questions.pop()!;
		this.questionNumber++;
		this.curQuestion = question.question;
		this.curAnswers = question.answers;
		this.sendQuestion(question);

		this.setPhaseTimeout(() => this.tallyAnswers(), this.getRoundLength());
	}

	/**
	 * Broadcasts to the room what the next question is.
	 */
	sendQuestion(question: TriviaQuestion) {
		this.broadcast(
			`Question: ${question.question}`,
			`Category: ${ALL_CATEGORIES[question.category]}`
		);
	}

	/**
	 * This is a noop here since it'd defined properly by subclasses later on.
	 * All this is obligated to do is take a user and their answer as args;
	 * the behaviour of this method can be entirely arbitrary otherwise.
	 */
	answerQuestion(answer: string, user: User): string | void {}

	/**
	 * Verifies whether or not an answer is correct. In longer answers, small
	 * typos can be made and still have the answer be considered correct.
	 */
	verifyAnswer(targetAnswer: string) {
		return this.curAnswers.some(answer => {
			const mla = this.maxLevenshteinAllowed(answer.length);
			return (answer === targetAnswer) || (Utils.levenshtein(targetAnswer, answer, mla) <= mla);
		});
	}

	/**
	 * Return the maximum Levenshtein distance that is allowable for answers of the given length.
	 */
	maxLevenshteinAllowed(answerLength: number) {
		if (answerLength > 5) {
			return 2;
		}

		if (answerLength > 4) {
			return 1;
		}

		return 0;
	}
	/**
	 * This is a noop here since it'd defined properly by mode subclasses later
	 * on. This calculates the points a correct responder earns, which is
	 * typically between 1-5.
	 */
	calculatePoints(diff: number, totalDiff: number) {}

	/**
	 * This is a noop here since it's defined properly by mode subclasses later
	 * on. This is obligated to update the game phase, but it can be entirely
	 * arbitrary otherwise.
	 */
	tallyAnswers() {}

	/**
	 * Ends the game after a player's score has exceeded the score cap.
	 */
	win(buffer: string) {
		if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
		this.phaseTimeout = null;
		const winners = this.getTopPlayers({max: 3});
		buffer += '<br />' + this.getWinningMessage(winners);
		this.broadcast('The answering period has ended!', buffer);

		for (const userid in this.playerTable) {
			const player = this.playerTable[userid];
			if (!player.points) continue;

			for (const leaderboard of [triviaData.leaderboard!, triviaData.altLeaderboard!]) {
				if (!leaderboard[userid]) {
					leaderboard[userid] = [0, 0, 0];
				}
				const rank = leaderboard[userid];
				rank[1] += player.points;
				rank[2] += player.correctAnswers;
			}
		}

		const prizes = this.getPrizes();
		triviaData.leaderboard![winners[0].id][0] += prizes[0];
		for (let i = 0; i < winners.length; i++) {
			triviaData.altLeaderboard![winners[i].id][0] += prizes[i];
		}

		cachedLadder.invalidateCache();
		cachedAltLadder.invalidateCache();

		for (const i in this.playerTable) {
			const player = this.playerTable[i];
			const user = Users.get(player.id);
			if (!user) continue;
			user.sendTo(
				this.room.roomid,
				`You gained ${player.points} and answered ` +
				`${player.correctAnswers} questions correctly.`
			);
		}

		const buf = this.getStaffEndMessage(winners, winner => winner.player.name);
		const logbuf = this.getStaffEndMessage(winners, winner => winner.id);
		this.room.sendMods(buf);
		this.room.roomlog(buf);
		this.room.modlog(`(${this.room.roomid}) ${logbuf}`);

		if (!triviaData.history) triviaData.history = [];
		triviaData.history.push(this.game);
		if (triviaData.history.length > 10) triviaData.history.shift();

		writeTriviaData();
		this.destroy();
	}

	getPrizes() {
		return LENGTHS[this.game.length].prizes;
	}

	getTopPlayers(options: {max: number | null, requirePoints?: boolean} = {max: null, requirePoints: true}): TopPlayer[] {
		const ranks = [];
		for (const userid in this.playerTable) {
			const user = Users.get(userid);
			const player = this.playerTable[userid];
			if ((options.requirePoints && !player.points) || !user) continue;
			ranks.push({id: userid, player, name: user.name});
		}
		ranks.sort((a, b) => {
			return b.player.points - a.player.points ||
				a.player.lastQuestion - b.player.lastQuestion ||
				hrtimeToNanoseconds(a.player.answeredAt) - hrtimeToNanoseconds(b.player.answeredAt);
		});
		return options.max === null ? ranks : ranks.slice(0, options.max);
	}

	getWinningMessage(winners: TopPlayer[]) {
		const prizes = this.getPrizes();
		const [p1, p2, p3] = winners;
		const initialPart = Utils.html`${p1.name} won the game with a final score of <strong>${p1.player.points}</strong>, and `;
		switch (winners.length) {
		case 1:
			return `${initialPart}their leaderboard score has increased by <strong>${prizes[0]}</strong> points!`;
		case 2:
			return `${initialPart}their leaderboard score has increased by <strong>${prizes[0]}</strong> points! ` +
				Utils.html`${p2.name} was a runner-up and their leaderboard score has increased by <strong>${prizes[1]}</strong> points!`;
		case 3:
			return initialPart + Utils.html`${p2.name} and ${p3.name} were runners-up. ` +
				`Their leaderboard score has increased by ${prizes[0]}, ${prizes[1]}, and ${prizes[2]}, respectively!`;
		}
	}

	getStaffEndMessage(winners: TopPlayer[], mapper: (k: TopPlayer) => string) {
		let message = "";
		const winnerParts: ((k: TopPlayer) => string)[] = [
			winner => `User ${mapper(winner)} won the game of ${this.game.mode}` +
				` mode trivia under the ${this.game.category} category with a cap of ` +
				`${this.getCap()} points, with ${winner.player.points} points and ` +
				`${winner.player.correctAnswers} correct answers!`,
			winner => ` Second place: ${mapper(winner)} (${winner.player.points} points)`,
			winner => `, third place: ${mapper(winner)} (${winner.player.points} points)`,
		];
		for (let i = 0; i < winners.length; i++) {
			message += winnerParts[i](winners[i]);
		}
		return `(${message})`;
	}

	end(user: User) {
		this.broadcast(Utils.html`The game was forcibly ended by ${user.name}.`);
		this.destroy();
	}
}

/**
 * Helper function for timer and number modes. Milliseconds are not precise
 * enough to score players properly in rare cases.
 */
const hrtimeToNanoseconds = (hrtime: number[]) => {
	return hrtime[0] * 1e9 + hrtime[1];
};

/**
 * First mode rewards points to the first user to answer the question
 * correctly.
 */
class FirstModeTrivia extends Trivia {
	answerQuestion(answer: string, user: User) {
		const player = this.playerTable[user.id];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';
		if (player.answer) return 'You have already attempted to answer the current question.';
		if (!this.verifyAnswer(answer)) return;

		if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
		this.phase = INTERMISSION_PHASE;

		const points = this.calculatePoints();
		player.setAnswer(answer);
		player.incrementPoints(points, this.questionNumber);

		const buffer = Utils.html`Correct: ${user.name}<br />` +
			`Answer(s): ${this.curAnswers.join(', ')}<br />` +
			'They gained <strong>5</strong> points!<br />' +
			`The top 5 players are: ${this.formatPlayerList({max: 5})}`;
		if (player.points >= this.getCap()) {
			this.win(buffer);
			return;
		}

		for (const i in this.playerTable) {
			this.playerTable[i].clearAnswer();
		}

		this.broadcast('The answering period has ended!', buffer);
		this.setPhaseTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}

	calculatePoints() {
		return 5;
	}

	tallyAnswers() {
		this.phase = INTERMISSION_PHASE;

		for (const i in this.playerTable) {
			const player = this.playerTable[i];
			player.clearAnswer();
		}

		this.broadcast(
			'The answering period has ended!',
			'Correct: no one...<br />' +
			`Answers: ${this.curAnswers.join(', ')}<br />` +
			'Nobody gained any points.<br />' +
			`The top 5 players are: ${this.formatPlayerList({max: 5})}`
		);

		this.setPhaseTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

/**
 * Timer mode rewards up to 5 points to all players who answer correctly
 * depending on how quickly they answer the question.
 */
class TimerModeTrivia extends Trivia {
	answerQuestion(answer: string, user: User) {
		const player = this.playerTable[user.id];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';

		const isCorrect = this.verifyAnswer(answer);
		player.setAnswer(answer, isCorrect);
	}

	/**
	 * The difference between the time the player answered the question and
	 * when the question was asked, in nanoseconds.
	 * The difference between the time scoring began and the time the question
	 * was asked, in nanoseconds.
	 */
	calculatePoints(diff: number, totalDiff: number) {
		return Math.floor(6 - 5 * diff / totalDiff);
	}

	tallyAnswers() {
		this.phase = INTERMISSION_PHASE;

		let buffer = (
			`Answer(s): ${this.curAnswers.join(', ')}<br />` +
			'<table style="width: 100%; background-color: #9CBEDF; margin: 2px 0">' +
				'<tr style="background-color: #6688AA">' +
					'<th style="width: 100px">Points gained</th>' +
					'<th>Correct</th>' +
				'</tr>'
		);
		const innerBuffer: Map<number, [string, number][]> = new Map([5, 4, 3, 2, 1].map(n => [n, []]));

		let winner = false;

		const now = hrtimeToNanoseconds(process.hrtime());
		const askedAt = hrtimeToNanoseconds(this.askedAt);
		const totalDiff = now - askedAt;
		for (const i in this.playerTable) {
			const player = this.playerTable[i];
			if (!player.isCorrect) {
				player.clearAnswer();
				continue;
			}

			const playerAnsweredAt = hrtimeToNanoseconds(player.currentAnsweredAt);
			const diff = playerAnsweredAt - askedAt;
			const points = this.calculatePoints(diff, totalDiff);
			player.incrementPoints(points, this.questionNumber);

			const pointBuffer = innerBuffer.get(points) || [];
			pointBuffer.push([Utils.escapeHTML(player.name), playerAnsweredAt]);

			if (player.points >= this.getCap()) {
				winner = true;
			}

			player.clearAnswer();
		}

		let rowAdded = false;
		for (const [pointValue, players] of innerBuffer) {
			if (!players.length) continue;

			rowAdded = true;
			const sanitizedPlayerArray = players
				.sort((a, b) => a[1] - b[1])
				.map(a => a[0]);
			buffer += (
				'<tr style="background-color: #6688AA">' +
				`<td style="text-align: center">${pointValue}</td>` +
				`<td>${sanitizedPlayerArray.join(', ')}</td>` +
				'</tr>'
			);
		}

		if (!rowAdded) {
			buffer += (
				'<tr style="background-color: #6688AA">' +
				'<td style="text-align: center">&#8212;</td>' +
				'<td>No one answered correctly...</td>' +
				'</tr>'
			);
		}

		buffer += '</table>';

		if (winner) return this.win(buffer);

		buffer += `<br />The top 5 players are: ${this.formatPlayerList({max: 5})}`;
		this.broadcast('The answering period has ended!', buffer);
		this.setPhaseTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

/**
 * Number mode rewards up to 5 points to all players who answer correctly
 * depending on the ratio of correct players to total players (lower ratio is
 * better).
 */
class NumberModeTrivia extends Trivia {
	answerQuestion(answer: string, user: User) {
		const player = this.playerTable[user.id];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';

		const isCorrect = this.verifyAnswer(answer);
		player.setAnswer(answer, isCorrect);
	}

	calculatePoints(correctPlayers: number) {
		return correctPlayers && (6 - Math.floor(5 * correctPlayers / this.playerCount));
	}

	getRoundLength() {
		return 6 * 1000;
	}

	tallyAnswers() {
		this.phase = INTERMISSION_PHASE;

		let buffer;
		const innerBuffer = Object.keys(this.playerTable)
			.filter(id => !!this.playerTable[id].isCorrect)
			.map(id => {
				const player = this.playerTable[id];
				return [Utils.escapeHTML(player.name), hrtimeToNanoseconds(player.currentAnsweredAt)];
			})
			.sort((a, b) => (a[1] as number) - (b[1] as number));

		const points = this.calculatePoints(innerBuffer.length);
		if (points) {
			let winner = false;
			for (const i in this.playerTable) {
				const player = this.playerTable[i];
				if (player.isCorrect) player.incrementPoints(points, this.questionNumber);

				if (player.points >= this.getCap()) {
					winner = true;
				}

				player.clearAnswer();
			}

			buffer = `Correct: ${innerBuffer.map(arr => arr[0]).join(', ')}<br />` +
				`Answer(s): ${this.curAnswers.join(', ')}<br />` +
				`${Chat.plural(innerBuffer, "Each of them", "They")} gained <strong>${points}</strong> point(s)!`;

			if (winner) return this.win(buffer);
		} else {
			for (const i in this.playerTable) {
				const player = this.playerTable[i];
				player.clearAnswer();
			}

			buffer = 'Correct: no one...<br />' +
				`Answer(s): ${this.curAnswers.join(', ')}<br />` +
				'Nobody gained any points.';
		}

		buffer += `<br />The top 5 players are: ${this.formatPlayerList({max: 5})}.`;
		this.broadcast('The answering period has ended!', buffer);
		this.setPhaseTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

/**
 * Triumvirate mode rewards points to the top three users to answer the question correctly.
 */
class TriumvirateModeTrivia extends Trivia {
	answerQuestion(answer: string, user: User) {
		const player = this.playerTable[user.id];
		if (!player) return 'You are not a player in the current trivia game.';
		if (this.phase !== QUESTION_PHASE) return 'There is no question to answer.';
		player.setAnswer(answer, this.verifyAnswer(answer));
		const correctAnswers = Object.keys(this.playerTable).filter(id => this.playerTable[id].isCorrect).length;
		if (correctAnswers === 3) {
			if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
			this.tallyAnswers();
		}
	}

	calculatePoints(answerNumber: number) {
		return 5 - answerNumber * 2; // 5 points to 1st, 3 points to 2nd, 1 point to 1st
	}

	tallyAnswers() {
		this.phase = INTERMISSION_PHASE;
		const correctPlayers = Object.keys(this.playerTable)
			.filter(id => this.playerTable[id].isCorrect)
			.map(id => this.playerTable[id]);
		correctPlayers.sort((a, b) =>
			(hrtimeToNanoseconds(a.currentAnsweredAt) > hrtimeToNanoseconds(b.currentAnsweredAt) ? 1 : -1));

		let winner = false;
		const playersWithPoints = [];
		for (const player of correctPlayers) {
			const points = this.calculatePoints(correctPlayers.indexOf(player));
			player.incrementPoints(points, this.questionNumber);
			playersWithPoints.push(`${Utils.escapeHTML(player.name)} (${points})`);
			if (player.points >= this.getCap()) {
				winner = true;
			}
		}
		for (const i in this.playerTable) {
			this.playerTable[i].clearAnswer();
		}

		let buffer = ``;
		if (playersWithPoints.length) {
			buffer = `Correct: ${playersWithPoints.join(", ")}<br />` +
			`Answers: ${this.curAnswers.join(', ')}<br />` +
			`The top 5 players are: ${this.formatPlayerList({max: 5})}`;
		} else {
			buffer = 'Correct: no one...<br />' +
			`Answers: ${this.curAnswers.join(', ')}<br />` +
			'Nobody gained any points.<br />' +
			`The top 5 players are: ${this.formatPlayerList({max: 5})}`;
		}

		if (winner) return this.win(buffer);
		this.broadcast('The answering period has ended!', buffer);
		this.setPhaseTimeout(() => this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

const commands: ChatCommands = {
	new(target, room, user) {
		if (!isTriviaRoom(room)) return this.errorReply("This command can only be used in the Trivia room.");
		if (!this.can('show', null, room)) return false;
		if (!this.canTalk()) return;
		if (room.game) {
			return this.errorReply(`There is already a game of ${room.game.title} in progress.`);
		}

		const targets = (target ? target.split(',') : []);
		if (targets.length < 3) return this.errorReply("Usage: /trivia new [mode], [category], [length]");

		let mode: string = toID(targets[0]);
		const isRandomMode = (mode === 'random');
		if (isRandomMode) {
			mode = Utils.shuffle(['first', 'number', 'timer', 'triumvirate'])[0];
		}
		if (!MODES[mode]) return this.errorReply(`"${mode}" is an invalid mode.`);

		const category = toID(targets[1]);
		const isRandomCategory = (category === 'random');
		const isAll = (category === 'all');
		let questions;
		if (isRandomCategory) {
			const categories = Object.keys(MAIN_CATEGORIES);
			const randCategory = categories[Math.floor(Math.random() * categories.length)];
			questions = sliceCategory(randCategory);
		} else if (isAll) {
			questions = triviaData.questions!.slice();
			for (const categoryStr in SPECIAL_CATEGORIES) {
				questions = questions.filter(q => q.category !== categoryStr);
			}
		} else if (ALL_CATEGORIES[category]) {
			questions = sliceCategory(category);
		} else {
			return this.errorReply(`"${category}" is an invalid category.`);
		}

		// Randomizes the order of the questions.
		const length = toID(targets[2]);
		if (!LENGTHS[length]) return this.errorReply(`"${length}" is an invalid game length.`);
		if (questions.length < LENGTHS[length].cap / 5) {
			if (isRandomCategory) {
				return this.errorReply("There are not enough questions in the randomly chosen category to finish a trivia game.");
			}
			if (isAll) {
				return this.errorReply("There are not enough questions in the trivia database to finish a trivia game.");
			}
			return this.errorReply(`There are not enough questions under the category "${ALL_CATEGORIES[category]}" to finish a trivia game.`);
		}

		let _Trivia;
		if (mode === 'first') {
			_Trivia = FirstModeTrivia;
		} else if (mode === 'number') {
			_Trivia = NumberModeTrivia;
		} else if (mode === 'triumvirate' || mode === 'tri' || mode === 'triforce') {
			_Trivia = TriumvirateModeTrivia;
		} else {
			_Trivia = TimerModeTrivia;
		}

		questions = Utils.shuffle(questions);
		room.game = new _Trivia(room, mode, category, length, questions, isRandomMode);
	},
	newhelp: [`/trivia new [mode], [category], [length] - Begin a new trivia game. Requires: + % @ # &`],

	join(target, room, user) {
		if (!isTriviaRoom(room)) return this.errorReply("This command can only be used in Trivia.");
		const game = getTriviaGame(this);
		if (!game) return;
		const res = game.addTriviaPlayer(user);
		if (res) return this.errorReply(res);
		this.sendReply('You are now signed up for this game!');
	},
	joinhelp: [`/trivia join - Join the current trivia game.`],

	kick(target, room, user) {
		if (!isTriviaRoom(room)) return this.errorReply("This command can only be used in Trivia.");
		if (!this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;
		const game = getTriviaGame(this);
		if (!game) return;

		this.splitTarget(target);
		const targetUser = this.targetUser;
		if (!targetUser) return this.errorReply(`The user "${target}" does not exist.`);
		const res = game.kick(targetUser);
		if (res) return this.errorReply(res);
		// ...
	},
	kickhelp: [`/trivia kick [username] - Kick players from a trivia game by username. Requires: % @ # &`],

	leave(target, room, user) {
		if (!isTriviaRoom(room)) return this.errorReply("This command can only be used in Trivia.");
		const game = getTriviaGame(this);
		if (!game) return;
		const res = game.leave(user);
		if (res) return this.errorReply(res);
		this.sendReply("You have left the current game of trivia.");
	},
	leavehelp: [`/trivia leave - Makes the player leave the game.`],

	start(target, room) {
		if (!isTriviaRoom(room)) return this.errorReply("This command can only be used in Trivia.");
		if (!this.can('show', null, room)) return false;
		if (!this.canTalk()) return;
		const game = getTriviaGame(this);
		if (!game) return;
		const res = game.start();
		if (res) return this.errorReply(res);
		// ...
	},
	starthelp: [`/trivia start - Ends the signup phase of a trivia game and begins the game. Requires: + % @ # &`],

	answer(target, room, user) {
		if (!isTriviaRoom(room)) return this.errorReply("This command can only be used in Trivia.");
		const game = getTriviaGame(this);
		if (!game) return;

		const answer = toID(target);
		if (!answer) return this.errorReply("No valid answer was entered.");

		if (!Object.keys(game.playerTable).includes(user.id)) {
			const res = game.addTriviaPlayer(user);
			if (res) return this.errorReply(res);
		}
		const res = game.answerQuestion(answer, user);
		if (res) return this.errorReply(res);
		this.sendReply(`You have selected "${answer}" as your answer.`);
	},
	answerhelp: [`/trivia answer OR /ta [answer] - Answer a pending question.`],

	end(target, room, user) {
		if (!isTriviaRoom(room)) return this.errorReply("This command can only be used in Trivia.");
		if (!this.can('show', null, room)) return false;
		if (!this.canTalk()) return;
		const game = getTriviaGame(this);
		if (!game) return;
		game.end(user);
	},
	endhelp: [`/trivia end - Forcibly end a trivia game. Requires: + % @ # &`],

	'': 'status',
	players: 'status',
	status(target, room, user) {
		if (!isTriviaRoom(room)) return this.errorReply("This command can only be used in Trivia.");
		if (!this.runBroadcast()) return false;
		const game = getTriviaGame(this);
		if (!game) return;
		let tarUser;
		if (target) {
			this.splitTarget(target);
			if (!this.targetUser) return this.errorReply(`User ${target} does not exist.`);
			tarUser = this.targetUser;
		} else {
			tarUser = user;
		}
		let buffer = `There is a trivia game in progress, and it is in its ${game.phase} phase.<br />` +
			`Mode: ${game.game.mode} | Category: ${game.game.category} | Score cap: ${game.getCap()}`;

		const player = game.playerTable[tarUser.id];
		if (player) {
			if (!this.broadcasting) {
				buffer += `<br />Current score: ${player.points} | Correct Answers: ${player.correctAnswers}`;
			}
		} else if (tarUser.id !== user.id) {
			return this.errorReply(`User ${tarUser.name} is not a player in the current trivia game.`);
		}
		buffer += `<br />Players: ${game.formatPlayerList({max: null, requirePoints: false})}`;

		this.sendReplyBox(buffer);
	},
	statushelp: [`/trivia status [player] - lists the player's standings (your own if no player is specified) and the list of players in the current trivia game.`],

	submit: 'add',
	add(target, room, user, connection, cmd) {
		if (room.roomid !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (cmd === 'add' && !this.can('mute', null, room)) return false;
		if (cmd === 'submit' && !this.can('show', null, room)) return false;
		if (!target) return false;
		if (!this.canTalk()) return false;

		const params = target.split('\n').map(str => str.split('|'));
		for (const param of params) {
			if (param.length !== 3) {
				this.errorReply(`Invalid arguments specified in "${param}". View /trivia help for more information.`);
				continue;
			}

			const category = toID(param[0]);
			if (!ALL_CATEGORIES[category]) {
				this.errorReply(`'${param[0].trim()}' is not a valid category. View /trivia help for more information.`);
				continue;
			}
			if (cmd === 'submit' && !MAIN_CATEGORIES[category]) {
				this.errorReply(`You cannot submit questions in the '${ALL_CATEGORIES[category]}' category`);
				continue;
			}

			const question = Utils.escapeHTML(param[1].trim());
			if (!question) {
				this.errorReply(`'${param[1].trim()}' is not a valid question.`);
				continue;
			}
			if (question.length > MAX_QUESTION_LENGTH) {
				this.errorReply(`Question "${param[1].trim()}" is too long! It must remain under ${MAX_QUESTION_LENGTH} characters.`);
				continue;
			}
			const subs = triviaData.submissions;
			if (subs?.some(s => s.question === question) || subs?.some(q => q.question === question)) {
				this.errorReply(`Question "${question}" is already in the trivia database.`);
				continue;
			}

			const cache = new Set();
			const answers = param[2].split(',')
				.map(toID)
				.filter(answer => !cache.has(answer) && !!cache.add(answer));
			if (!answers.length) {
				this.errorReply(`No valid answers were specified for question '${param[1].trim()}'.`);
				continue;
			}
			if (answers.some(answer => answer.length > MAX_ANSWER_LENGTH)) {
				this.errorReply(`Some of the answers entered for question '${param[1].trim()}' were too long! They must remain under ${MAX_ANSWER_LENGTH} characters.`);
				continue;
			}

			const entry = {
				category: category,
				question: question,
				answers: answers,
				user: user.id,
			};

			if (cmd === 'add') {
				triviaData.questions!.splice(findEndOfCategory(category, false), 0, entry);
				writeTriviaData();
				this.modlog('TRIVIAQUESTION', null, `added '${param[1]}'`);
				this.privateModAction(`(Question '${param[1]}' was added to the question database by ${user.name}.)`);
			} else {
				triviaData.submissions!.splice(findEndOfCategory(category, true), 0, entry);
				writeTriviaData();
				if (!user.can('mute', null, room)) this.sendReply(`Question '${param[1]}' was submitted for review.`);
				this.modlog('TRIVIAQUESTION', null, `submitted '${param[1]}'`);
				this.privateModAction(`(Question '${param[1]}' was submitted to the submission database by ${user.name} for review.)`);
			}
		}
	},
	submithelp: [`/trivia submit [category] | [question] | [answer1], [answer2] ... [answern] - Adds question(s) to the submission database for staff to review. Requires: + % @ # &`],
	addhelp: [`/trivia add [category] | [question] | [answer1], [answer2], ... [answern] - Adds question(s) to the question database. Requires: % @ # &`],

	review(target, room) {
		if (room.roomid !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('ban', null, room)) return false;

		const submissions = triviaData.submissions;
		if (!submissions) return this.sendReply("No questions await review.");
		const submissionsLen = submissions.length;
		if (!submissionsLen) return this.sendReply("No questions await review.");

		let buffer = `|raw|<div class="ladder"><table>` +
			`<tr><td colspan="6"><strong>${Chat.count(submissionsLen, "</strong> questions")} awaiting review:</td></tr>` +
			"<tr><th>#</th><th>Category</th><th>Question</th><th>Answer(s)</th><th>Submitted By</th></tr>";

		let i = 0;
		while (i < submissionsLen) {
			const entry = submissions[i];
			buffer += `<tr><td><strong>${(++i)}</strong></td><td>${entry.category}</td><td>${entry.question}</td><td>${entry.answers.join(", ")}</td><td>${entry.user}</td></tr>`;
		}
		buffer += "</table></div>";

		this.sendReply(buffer);
	},
	reviewhelp: [`/trivia review - View the list of submitted questions. Requires: @ # &`],

	reject: 'accept',
	accept(target, room, user, connection, cmd) {
		if (room.roomid !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('ban', null, room)) return false;
		if (!this.canTalk()) return;

		target = target.trim();
		if (!target) return false;

		const isAccepting = cmd === 'accept';
		const questions = triviaData.questions!;
		const submissions = triviaData.submissions!;

		if (toID(target) === 'all') {
			if (isAccepting) {
				for (const submission of submissions) {
					questions.splice(findEndOfCategory(submission.category, false), 0, submission);
				}
			}

			triviaData.submissions = [];
			writeTriviaData();
			this.modlog(`TRIVIAQUESTION`, null, `${(isAccepting ? "added" : "removed")} all from submission database.`);
			return this.privateModAction(`(${user.name} ${(isAccepting ? " added " : " removed ")} all questions from the submission database.)`);
		}

		if (/^\d+(?:-\d+)?(?:, ?\d+(?:-\d+)?)*$/.test(target)) {
			let indices = target.split(',');

			// Parse number ranges and add them to the list of indices,
			// then remove them in addition to entries that aren't valid index numbers
			for (let i = indices.length; i--;) {
				if (!indices[i].includes('-')) {
					const index = Number(indices[i]);
					if (Number.isInteger(index) && index > 0 && index <= submissions.length) {
						indices[i] = String(index);
					} else {
						indices.splice(i, 1);
					}
					continue;
				}

				const range = indices[i].split('-');
				const left = Number(range[0]);
				let right = Number(range[1]);
				if (!Number.isInteger(left) || !Number.isInteger(right) ||
					left < 1 || right > submissions.length || left === right) {
					indices.splice(i, 1);
					continue;
				}

				do {
					indices.push(String(right));
				} while (--right >= left);

				indices.splice(i, 1);
			}

			indices.sort((a, b) => Number(a) - Number(b));
			indices = indices.filter((entry, index) => !index || indices[index - 1] !== entry);

			const indicesLen = indices.length;
			if (!indicesLen) {
				return this.errorReply(`'${target}' is not a valid set of submission index numbers. View /trivia review and /trivia help for more information.`);
			}

			if (isAccepting) {
				for (let i = indicesLen; i--;) {
					const submission = submissions.splice(Number(indices[i]) - 1, 1)[0];
					questions.splice(findEndOfCategory(submission.category, false), 0, submission);
				}
			} else {
				for (let i = indicesLen; i--;) {
					submissions.splice(Number(indices[i]) - 1, 1);
				}
			}

			writeTriviaData();
			this.modlog('TRIVIAQUESTION', null, `${(isAccepting ? "added " : "removed ")}submission number${(indicesLen > 1 ? "s " : " ")}${target}`);
			return this.privateModAction(`(${user.name} ${(isAccepting ? "added " : "removed ")}submission number${(indicesLen > 1 ? "s " : " ")}${target} from the submission database.)`);
		}

		this.errorReply(`'${target}' is an invalid argument. View /trivia help questions for more information.`);
	},
	accepthelp: [`/trivia accept [index1], [index2], ... [indexn] OR all - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: @ # &`],
	rejecthelp: [`/trivia reject [index1], [index2], ... [indexn] OR all - Remove questions from the submission database using their index numbers or ranges of them. Requires: @ # &`],

	delete(target, room, user) {
		if (room.roomid !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');
		if (!this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;

		target = target.trim();
		if (!target) return false;

		const question = Utils.escapeHTML(target);
		if (!question) {
			return this.errorReply(`'${target}' is not a valid argument. View /trivia help questions for more information.`);
		}

		const questions = triviaData.questions!;
		const questionID = toID(question);
		for (const [i, questionObj] of questions.entries()) {
			if (toID(questionObj.question) === questionID) {
				questions.splice(i, 1);
				writeTriviaData();
				this.modlog('TRIVIAQUESTION', null, `removed '${target}'`);
				return this.privateModAction(`(${user.name} removed question '${target}' from the question database.)`);
			}
		}

		this.errorReply(`Question '${target}' was not found in the question database.`);
	},
	deletehelp: [`/trivia delete [question] - Delete a question from the trivia database. Requires: % @ # &`],

	move(target, room, user) {
		if (room.roomid !== 'questionworkshop') {
			return this.errorReply('This command can only be used in Question Workshop.');
		}
		if (!this.can('mute', null, room)) return false;
		if (!this.canTalk()) return;

		target = target.trim();
		if (!target) return false;

		const params = target.split('\n').map(str => str.split('|'));
		for (const param of params) {
			if (param.length !== 2) {
				this.errorReply(`Invalid arguments specified in "${param}". View /trivia help for more information.`);
				continue;
			}

			const category = toID(param[0]);
			if (!ALL_CATEGORIES[category]) {
				this.errorReply(`'${param[0].trim()}' is not a valid category. View /trivia help for more information.`);
				continue;
			}

			const questionID = toID(Utils.escapeHTML(param[1].trim()));
			if (!questionID) {
				this.errorReply(`'${param[1].trim()}' is not a valid question.`);
				continue;
			}

			const questions = triviaData.questions!;

			for (const [i, question] of questions.entries()) {
				if (toID(question.question) === questionID) {
					if (question.category === category) {
						this.errorReply(`'${param[1].trim()}' is already in the category '${param[0].trim()}'.`);
						break;
					}
					questions.splice(i, 1);
					question.category = category;
					questions.splice(findEndOfCategory(category, false), 0, question);
					writeTriviaData();
					this.modlog('TRIVIAQUESTION', null, `changed category for '${param[1].trim()}' to '${param[0]}'`);
					return this.privateModAction(`(${user.name} changed question category to '${param[0]}' for '${param[1].trim()}' from the question database.)`);
				}
			}
		}
	},
	movehelp: [
		`/trivia move [category] | [question] - Change the category of question in the trivia databse. Requires: % @ # &`,
	],

	qs(target, room, user) {
		if (room.roomid !== 'questionworkshop') return this.errorReply('This command can only be used in Question Workshop.');

		let buffer = "|raw|<div class=\"ladder\" style=\"overflow-y: scroll; max-height: 300px;\"><table>";
		if (!target) {
			if (!this.runBroadcast()) return false;

			const questions = triviaData.questions!;
			const questionsLen = questions.length;
			if (!questionsLen) return this.sendReplyBox(`No questions have been submitted yet.`);

			let lastCategoryIdx = 0;
			buffer += "<tr><th>Category</th><th>Question Count</th></tr>";
			for (const category in ALL_CATEGORIES) {
				if (category === 'random') continue;
				const tally = findEndOfCategory(category, false) - lastCategoryIdx;
				lastCategoryIdx += tally;
				buffer += `<tr><td>${ALL_CATEGORIES[category]}</td><td>${tally} (${((tally * 100) / questionsLen).toFixed(2)}%)</td></tr>`;
			}
			buffer += `<tr><td><strong>Total</strong></td><td><strong>${questionsLen}</strong></td></table></div>`;

			return this.sendReply(buffer);
		}

		if (!this.can('mute', null, room)) return false;

		const category = toID(target);
		if (category === 'random') return false;
		if (!ALL_CATEGORIES[category]) {
			return this.errorReply(`'${target}' is not a valid category. View /help trivia for more information.`);
		}

		const list = sliceCategory(category);
		if (!list.length) {
			buffer += `<tr><td>There are no questions in the ${ALL_CATEGORIES[target]} category.</td></table></div>`;
			return this.sendReply(buffer);
		}

		if (user.can('ban', null, room)) {
			buffer += `<tr><td colspan="3">There are <strong>${list.length}</strong> questions in the ${ALL_CATEGORIES[target]} category.</td></tr>` +
				"<tr><th>#</th><th>Question</th><th>Answer(s)</th></tr>";
			for (const [i, entry] of list.entries()) {
				buffer += `<tr><td><strong>${(i + 1)}</strong></td><td>${entry.question}</td><td>${entry.answers.join(", ")}</td><tr>`;
			}
		} else {
			buffer += `<td colspan="2">There are <strong>${list.length}</strong> questions in the ${target} category.</td></tr>` +
				"<tr><th>#</th><th>Question</th></tr>";
			for (const [i, entry] of list.entries()) {
				buffer += `<tr><td><strong>${(i + 1)}</strong></td><td>${entry.question}</td></tr>`;
			}
		}
		buffer += "</table></div>";

		this.sendReply(buffer);
	},
	qshelp: [
		"/trivia qs - View the distribution of questions in the question database.",
		"/trivia qs [category] - View the questions in the specified category. Requires: % @ # &",
	],

	search(target, room, user) {
		if (room.roomid !== 'questionworkshop') return this.errorReply("This command can only be used in Question Workshop.");
		if (!this.can('show', null, room)) return false;
		if (!target.includes(',')) return this.errorReply("No valid search arguments entered.");

		let [type, ...query] = target.split(',');
		type = toID(type);
		if (/^q(?:uestion)?s?$/.test(type)) {
			type = 'questions';
		} else if (/^sub(?:mission)?s?$/.test(type)) {
			type = 'submissions';
		} else {
			return this.sendReplyBox("No valid search category was entered. Valid categories: submissions, subs, questions. qs");
		}

		const queryString = query.join(',').trim();
		if (!queryString) return this.errorReply("No valid search query as entered.");

		const results = (triviaData as any)[type]
			.filter((q: TriviaQuestion) => q.question.includes(queryString) && !SPECIAL_CATEGORIES[q.category]);
		if (!results.length) return this.sendReply(`No results found under the ${type} list.`);

		let buffer = "|raw|<div class=\"ladder\"><table><tr><th>#</th><th>Category</th><th>Question</th></tr>" +
			`<tr><td colspan="3">There are <strong>${results.length}</strong> matches for your query:</td></tr>`;
		buffer += results.map((q: TriviaQuestion, i: number) => {
			return `<tr><td><strong>${i + 1}</strong></td><td>${q.category}</td><td>${q.question}</td></tr>`;
		}).join('');
		buffer += "</table></div>";

		this.sendReply(buffer);
	},
	searchhelp: [`/trivia search [type], [query] - Searches for questions based on their type and their query. Valid types: submissions, subs, questions, qs. Requires: + % @ * &`],

	rank(target, room, user) {
		if (!isTriviaRoom(room)) return this.errorReply("This command can only be used in Trivia.");

		let name;
		let userid;
		if (!target) {
			name = Utils.escapeHTML(user.name);
			userid = user.id;
		} else {
			this.splitTarget(target, true);
			name = Utils.escapeHTML(this.targetUsername);
			userid = toID(name);
		}

		const allTimeScore = triviaData.leaderboard![userid];
		if (!allTimeScore) return this.sendReplyBox(`User '${name}' has not played any trivia games yet.`);
		const score = triviaData.altLeaderboard![userid] || [0, 0, 0];

		const ranks = cachedAltLadder.get().ranks[userid];
		const allTimeRanks = cachedLadder.get().ranks[userid];
		const row = (i: number) => `<strong>${score[i]}</strong>${ranks ? ` (#${ranks[i]})` : ""}, ` +
			`all time: <strong>${allTimeScore[i]}</strong> (#${allTimeRanks[i]})<br />`;
		this.sendReplyBox(
			`User: <strong>${name}</strong><br />` +
			`Leaderboard score: ${row(0)}` +
			`Total game points: ${row(1)}` +
			`Total correct answers: ${row(2)}`
		);
	},
	rankhelp: [`/trivia rank [username] - View the rank of the specified user. If no name is given, view your own.`],

	alltimeladder: 'ladder',
	ladder(target, room, user, connection, cmd) {
		if (!isTriviaRoom(room)) return this.errorReply('This command can only be used in Trivia.');
		if (!this.runBroadcast()) return false;
		const cache = cmd === 'ladder' ? cachedAltLadder : cachedLadder;
		const {ladder} = cache.get();
		const leaderboard = cache.leaderboard;
		if (!ladder.length) return this.errorReply("No trivia games have been played yet.");

		let buffer = "|raw|<div class=\"ladder\" style=\"overflow-y: scroll; max-height: 300px;\"><table>" +
			"<tr><th>Rank</th><th>User</th><th>Leaderboard score</th><th>Total game points</th><th>Total correct answers</th></tr>";
		let num = parseInt(target);
		if (!num || num < 0) num = 100;
		if (num > ladder.length) num = ladder.length;
		for (let i = Math.max(0, num - 100); i < num; i++) {
			const leaders = ladder[i];
			for (const leader of leaders) {
				const rank = leaderboard[leader as unknown as string];
				const leaderObj = Users.getExact(leader as unknown as string);
				const leaderid = leaderObj ? Utils.escapeHTML(leaderObj.name) : leader as unknown as string;
				buffer += `<tr><td><strong>${(i + 1)}</strong></td><td>${leaderid}</td><td>${rank[0]}</td><td>${rank[1]}</td><td>${rank[2]}</td></tr>`;
			}
		}
		buffer += "</table></div>";

		return this.sendReply(buffer);
	},
	ladderhelp: [`/trivia ladder [num] - View information about 15 users on the trivia leaderboard.`],
	alltimeladderhelp: [`/trivia ladder [num] - View information about 15 users on the all time trivia leaderboard.`],

	clearquestions: 'clearqs',
	clearqs(target, room, user) {
		if (room.roomid !== 'questionworkshop') return this.errorReply("This command can only be used in Question Workshop");
		if (!this.can('declare', null, room)) return false;
		const category = toID(target);
		if (ALL_CATEGORIES[category]) {
			if (SPECIAL_CATEGORIES[category]) {
				triviaData.questions = triviaData.questions!.filter(q => q.category !== category);
				writeTriviaData();
				return this.privateModAction(`(${user.name} removed all questions of category '${category}'.)`);
			} else {
				return this.errorReply(`You cannot clear the category '${ALL_CATEGORIES[category]}'.`);
			}
		} else {
			return this.errorReply(`'${category}' is an invalid category.`);
		}
	},
	clearqshelp: [`/trivia clears [category] - Remove all questions of the given category. Requires: # &`],

	pastgames: 'history',
	history(target, room, user) {
		if (room.roomid !== 'trivia') return this.errorReply("This command can only be used in Trivia.");
		if (!this.runBroadcast()) return false;
		if (!triviaData.history?.length) return this.sendReplyBox("There is no game history.");

		const games = [...triviaData.history].reverse();
		const buf = [];
		for (const [i, game] of games.entries()) {
			buf.push(Utils.html`<b>${i + 1}.</b> ${game.mode} mode, ${game.length} length Trivia game in the ${game.category} category.`);
		}

		return this.sendReplyBox(buf.join('<br />'));
	},
	historyhelp: [`/trivia history - View a list of the 10 most recently played trivia games.`],

	help(target, room, user) {
		return this.parse(`${this.cmdToken}help trivia`);
	},
	triviahelp() {
		this.sendReply('|html|<div class="infobox infobox-limited">' + [
			`<strong>Modes:</strong>`,
			`- First: the first correct responder gains 5 points.`,
			`- Timer: each correct responder gains up to 5 points based on how quickly they answer.`,
			`- Number: each correct responder gains up to 5 points based on how many participants are correct.`,
			`- Triumvirate: The first correct responder gains 5 points, the second 3 points, and the third 1 point.`,
			`- Random: randomly chooses one of First, Timer, Number, or Triumvirate.`,
			``,
			`<strong>Categories</strong>: <code>Arts &amp; Entertainment</code>, <code>Pok&eacute;mon</code>, <code>Science &amp; Geography</code>, <code>Society &amp; Humanities</code>, <code>Random</code>, and <code>All</code>.`,
			``,
			`<strong>Game lengths:</strong>`,
			`- Short: 20 point score cap. The winner gains 3 leaderboard points.`,
			`- Medium: 35 point score cap. The winner gains 4 leaderboard points.`,
			`- Long: 50 point score cap. The winner gains 5 leaderboard points.`,
			``,
			`<strong>Game commands:</strong>`,
			Utils.html`- <code>/trivia new [mode], [category], [length]</code> - Begin signups for a new trivia game. Requires: + % @ # &`,
			`- <code>/trivia join</code> - Join a trivia game during signups.`,
			Utils.html`- <code>/trivia start</code> - Begin the game once enough users have signed up. Requires: + % @ # &`,
			`- <code>/ta [answer]</code> - Answer the current question.`,
			Utils.html`- <code>/trivia kick [username]</code> - Disqualify a participant from the current trivia game. Requires: % @ # &`,
			`- <code>/trivia leave</code> - Makes the player leave the game.`,
			Utils.html`- <code>/trivia end</code> - End a trivia game. Requires: + % @ #`,
			``,
			`<strong>Question-modifying commands:</strong>`,
			Utils.html`- <code>/trivia submit [category] | [question] | [answer1], [answer2] ... [answern]</code> - Adds question(s) to the submission database for staff to review. Requires: + % @ # &`,
			Utils.html`- <code>/trivia review</code> - View the list of submitted questions. Requires: @ # &`,
			Utils.html`- <code>/trivia accept [index1], [index2], ... [indexn] OR all</code> - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: @ # &`,
			Utils.html`- <code>/trivia reject [index1], [index2], ... [indexn] OR all</code> - Remove questions from the submission database using their index numbers or ranges of them. Requires: @ # &`,
			Utils.html`- <code>/trivia add [category] | [question] | [answer1], [answer2], ... [answern]</code> - Adds question(s) to the question database. Requires: % @ # &`,
			Utils.html`- <code>/trivia delete [question]</code> - Delete a question from the trivia database. Requires: % @ # &`,
			`- <code>/trivia qs</code> - View the distribution of questions in the question database.`,
			Utils.html`- <code>/trivia qs [category]</code> - View the questions in the specified category. Requires: % @ # &`,
			Utils.html`- <code>/trivia clearqs [category]</code> - Clear all questions in the given category. Requires: # &`,
			``,
			`<strong>Informational commands:</strong>`,
			Utils.html`- <code>/trivia search [type], [query]</code> - Searches for questions based on their type and their query. Valid types: <code>submissions</code>, <code>subs</code>, <code>questions</code>, <code>qs</code>. Requires: + % @ # &`,
			`- <code>/trivia status [player]</code> - lists the player's standings (your own if no player is specified) and the list of players in the current trivia game.`,
			`- <code>/trivia rank [username]</code> - View the rank of the specified user. If none is given, view your own.`,
			`- <code>/trivia ladder</code> - View information about the top 15 users on the trivia leaderboard.`,
			`- <code>/trivia alltimeladder</code> - View information about the top 15 users on the all time trivia leaderboard`,
			`- <code>/trivia history</code> - View a list of the 10 most recently played trivia games.`,
		].join('<br />') + '</div>');
	},
};

module.exports = {
	ALL_CATEGORIES,
	MAIN_CATEGORIES,
	SPECIAL_CATEGORIES,
	MODES,
	LENGTHS,

	triviaData,
	writeTriviaData,

	Trivia,
	FirstModeTrivia,
	TimerModeTrivia,
	NumberModeTrivia,
	TriumvirateModeTrivia,

	commands: {
		trivia: commands,
		ta: commands.answer,
		triviahelp: commands.triviahelp,
	},
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/trivia add ', '/trivia submit ');
});
