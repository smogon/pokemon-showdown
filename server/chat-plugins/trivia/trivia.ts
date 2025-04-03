/*
 * Trivia plugin
 * Written by Morfent
 */

import { Utils } from '../../../lib';
import { type Leaderboard, LEADERBOARD_ENUM, type TriviaDatabase, TriviaSQLiteDatabase } from './database';

const MAIN_CATEGORIES: { [k: string]: string } = {
	ae: 'Arts and Entertainment',
	pokemon: 'Pok\u00E9mon',
	sg: 'Science and Geography',
	sh: 'Society and Humanities',
};

const SPECIAL_CATEGORIES: { [k: string]: string } = {
	misc: 'Miscellaneous',
	event: 'Event',
	eventused: 'Event (used)',
	subcat: 'Sub-Category 1',
	subcat2: 'Sub-Category 2',
	subcat3: 'Sub-Category 3',
	subcat4: 'Sub-Category 4',
	subcat5: 'Sub-Category 5',
	oldae: 'Old Arts and Entertainment',
	oldsg: 'Old Science and Geography',
	oldsh: 'Old Society and Humanities',
	oldpoke: 'Old Pok\u00E9mon',
};

const ALL_CATEGORIES: { [k: string]: string } = { ...SPECIAL_CATEGORIES, ...MAIN_CATEGORIES };

/**
 * Aliases for keys in the ALL_CATEGORIES object.
 */
const CATEGORY_ALIASES: { [k: string]: ID } = {
	poke: 'pokemon' as ID,
	subcat1: 'subcat' as ID,
};

const MODES: { [k: string]: string } = {
	first: 'First',
	number: 'Number',
	timer: 'Timer',
	triumvirate: 'Triumvirate',
};

const LENGTHS: { [k: string]: { cap: number | false, prizes: number[] } } = {
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
	infinite: {
		cap: false,
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

const MASTERMIND_ROUNDS_PHASE = 'rounds';
const MASTERMIND_FINALS_PHASE = 'finals';

const MOVE_QUESTIONS_AFTER_USE_FROM_CATEGORY = 'event';
const MOVE_QUESTIONS_AFTER_USE_TO_CATEGORY = 'eventused';

const START_TIMEOUT = 30 * 1000;
const MASTERMIND_FINALS_START_TIMEOUT = 30 * 1000;
const INTERMISSION_INTERVAL = 20 * 1000;
const MASTERMIND_INTERMISSION_INTERVAL = 500; // 0.5 seconds
const PAUSE_INTERMISSION = 5 * 1000;

const MAX_QUESTION_LENGTH = 252;
const MAX_ANSWER_LENGTH = 32;

export interface TriviaQuestion {
	question: string;
	category: string;
	answers: string[];
	user?: string;
	/** UNIX timestamp in milliseconds */
	addedAt?: number;
}

export interface TriviaLeaderboardData {
	[userid: string]: TriviaLeaderboardScore;
}
export interface TriviaLeaderboardScore {
	score: number;
	totalPoints: number;
	totalCorrectAnswers: number;
}
export interface TriviaGame {
	mode: string;
	/** if number, question cap, else score cap */
	length: keyof typeof LENGTHS | number;
	category: string;
	startTime: number;
	creator?: string;
	givesPoints?: boolean;
}

type TriviaLadder = ID[][];
export type TriviaHistory = TriviaGame & { scores: { [k: string]: number } };

export interface TriviaData {
	/** category:questions */
	questions?: { [k: string]: TriviaQuestion[] };
	submissions?: { [k: string]: TriviaQuestion[] };
	leaderboard?: TriviaLeaderboardData;
	altLeaderboard?: TriviaLeaderboardData;
	/* `scores` key is a user ID */
	history?: TriviaHistory[];
	moveEventQuestions?: boolean;
}

interface TopPlayer {
	id: string;
	player: TriviaPlayer;
	name: string;
}

export const database: TriviaDatabase = new TriviaSQLiteDatabase('config/chat-plugins/triviadata.json');

/** from:to Map */
export const pendingAltMerges = new Map<ID, ID>();

function getTriviaGame(room: Room | null) {
	if (!room) {
		throw new Chat.ErrorMessage(`This command can only be used in the Trivia room.`);
	}
	const game = room.game;
	if (!game) {
		throw new Chat.ErrorMessage(room.tr`There is no game in progress.`);
	}
	if (game.gameid !== 'trivia') {
		throw new Chat.ErrorMessage(room.tr`The currently running game is not Trivia, it's ${game.title}.`);
	}
	return game as Trivia;
}

function getMastermindGame(room: Room | null) {
	if (!room) {
		throw new Chat.ErrorMessage(`This command can only be used in the Trivia room.`);
	}
	const game = room.game;
	if (!game) {
		throw new Chat.ErrorMessage(room.tr`There is no game in progress.`);
	}
	if (game.gameid !== 'mastermind') {
		throw new Chat.ErrorMessage(room.tr`The currently running game is not Mastermind, it's ${game.title}.`);
	}
	return game as Mastermind;
}

function getTriviaOrMastermindGame(room: Room | null) {
	try {
		return getMastermindGame(room);
	} catch {
		return getTriviaGame(room);
	}
}

/**
 * Generates and broadcasts the HTML for a generic announcement containing
 * a title and an optional message.
 */
function broadcast(room: BasicRoom, title: string, message?: string) {
	let buffer = `<div class="broadcast-blue"><strong>${title}</strong>`;
	if (message) buffer += `<br />${message}`;
	buffer += '</div>';

	return room.addRaw(buffer).update();
}

async function getQuestions(
	categories: ID[] | 'random',
	order: 'newestfirst' | 'oldestfirst' | 'random',
	limit = 1000
): Promise<TriviaQuestion[]> {
	if (categories === 'random') {
		const history = await database.getHistory(1);
		const lastCategoryID = toID(history?.[0].category).replace("random", "");
		const randCategory = Utils.randomElement(
			Object.keys(MAIN_CATEGORIES)
				.filter(cat => toID(MAIN_CATEGORIES[cat]) !== lastCategoryID)
		);
		return database.getQuestions([randCategory], limit, { order });
	} else {
		const questions = [];
		for (const category of categories) {
			if (category === 'all') {
				questions.push(...(await database.getQuestions('all', limit, { order })));
			} else if (!ALL_CATEGORIES[category]) {
				throw new Chat.ErrorMessage(`"${category}" is an invalid category.`);
			}
		}
		questions.push(...(await database.getQuestions(categories.filter(c => c !== 'all'), limit, { order })));
		return questions;
	}
}

/**
 * Records a pending alt merge
 */
export async function requestAltMerge(from: ID, to: ID) {
	if (from === to) throw new Chat.ErrorMessage(`You cannot merge leaderboard entries with yourself!`);
	if (!(await database.getLeaderboardEntry(from, 'alltime'))) {
		throw new Chat.ErrorMessage(`The user '${from}' does not have an entry in the Trivia leaderboard.`);
	}
	if (!(await database.getLeaderboardEntry(to, 'alltime'))) {
		throw new Chat.ErrorMessage(`The user '${to}' does not have an entry in the Trivia leaderboard.`);
	}
	pendingAltMerges.set(from, to);
}

/**
 * Checks that it has been approved by both users,
 * and merges two alts on the Trivia leaderboard.
 */
export async function mergeAlts(from: ID, to: ID) {
	if (pendingAltMerges.get(from) !== to) {
		throw new Chat.ErrorMessage(`Both '${from}' and '${to}' must use /trivia mergescore to approve the merge.`);
	}

	if (!(await database.getLeaderboardEntry(to, 'alltime'))) {
		throw new Chat.ErrorMessage(`The user '${to}' does not have an entry in the Trivia leaderboard.`);
	}
	if (!(await database.getLeaderboardEntry(from, 'alltime'))) {
		throw new Chat.ErrorMessage(`The user '${from}' does not have an entry in the Trivia leaderboard.`);
	}

	await database.mergeLeaderboardEntries(from, to);
	cachedLadder.invalidateCache();
}

// TODO: fix /trivia review
class Ladder {
	cache: Record<Leaderboard, { ladder: TriviaLadder, ranks: TriviaLeaderboardData } | null>;
	constructor() {
		this.cache = {
			alltime: null,
			nonAlltime: null,
			cycle: null,
		};
	}

	invalidateCache() {
		let k: keyof Ladder['cache'];
		for (k in this.cache) {
			this.cache[k] = null;
		}
	}

	async get(leaderboard: Leaderboard = 'alltime') {
		if (!this.cache[leaderboard]) await this.computeCachedLadder();
		return this.cache[leaderboard];
	}

	async computeCachedLadder() {
		const leaderboards = await database.getLeaderboards();
		for (const [lb, data] of Object.entries(leaderboards) as [Leaderboard, TriviaLeaderboardData][]) {
			const leaders = Object.entries(data);
			const ladder: TriviaLadder = [];
			const ranks: TriviaLeaderboardData = {};
			for (const [leader] of leaders) {
				ranks[leader] = { score: 0, totalPoints: 0, totalCorrectAnswers: 0 };
			}
			for (const key of ['score', 'totalPoints', 'totalCorrectAnswers'] as (keyof TriviaLeaderboardScore)[]) {
				Utils.sortBy(leaders, ([, scores]) => -scores[key]);

				let max = Infinity;
				let rank = -1;
				for (const [leader, scores] of leaders) {
					const score = scores[key];
					if (max !== score) {
						rank++;
						max = score;
					}
					if (key === 'score' && rank < 500) {
						if (!ladder[rank]) ladder[rank] = [];
						ladder[rank].push(leader as ID);
					}
					ranks[leader][key] = rank + 1;
				}
			}
			this.cache[lb] = { ladder, ranks };
		}
	}
}

export const cachedLadder = new Ladder();

class TriviaPlayer extends Rooms.RoomGamePlayer<Trivia> {
	points: number;
	correctAnswers: number;
	answer: string;
	currentAnsweredAt: number[];
	lastQuestion: number;
	answeredAt: number[];
	isCorrect: boolean;
	isAbsent: boolean;

	constructor(user: User, game: Trivia) {
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

export class Trivia extends Rooms.RoomGame<TriviaPlayer> {
	override readonly gameid = 'trivia' as ID;
	kickedUsers: Set<string>;
	canLateJoin: boolean;
	game: TriviaGame;
	questions: TriviaQuestion[];
	isPaused = false;
	phase: string;
	phaseTimeout: NodeJS.Timeout | null;
	questionNumber: number;
	curQuestion: string;
	curAnswers: string[];
	askedAt: number[];
	categories: ID[];
	constructor(
		room: Room, mode: string, categories: ID[], givesPoints: boolean,
		length: keyof typeof LENGTHS | number, questions: TriviaQuestion[], creator: string,
		isRandomMode = false, isSubGame = false, isRandomCategory = false,
	) {
		super(room, isSubGame);
		this.title = 'Trivia';
		this.allowRenames = true;
		this.playerCap = Number.MAX_SAFE_INTEGER;

		this.kickedUsers = new Set();
		this.canLateJoin = true;

		this.categories = categories;
		const uniqueCategories = new Set(this.categories
			.map(cat => {
				if (cat === 'all') return 'All';
				return ALL_CATEGORIES[CATEGORY_ALIASES[cat] || cat];
			}));
		let category = [...uniqueCategories].join(' + ');
		if (isRandomCategory) category = this.room.tr`Random (${category})`;

		this.game = {
			mode: (isRandomMode ? `Random (${MODES[mode]})` : MODES[mode]),
			length,
			category,
			creator,
			givesPoints,
			startTime: Date.now(),
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
		if (this.game.length in LENGTHS) return { points: LENGTHS[this.game.length].cap };
		if (typeof this.game.length === 'number') return { questions: this.game.length };
		throw new Error(`Couldn't determine cap for Trivia game with length ${this.game.length}`);
	}

	getDisplayableCap() {
		const cap = this.getCap();
		if (cap.questions) return `${cap.questions} questions`;
		if (cap.points) return `${cap.points} points`;
		return `Infinite`;
	}

	/**
	 * How long the players should have to answer a question.
	 */
	getRoundLength() {
		return 12 * 1000 + 500;
	}

	addTriviaPlayer(user: User) {
		if (this.playerTable[user.id]) {
			throw new Chat.ErrorMessage(this.room.tr`You have already signed up for this game.`);
		}
		for (const id of user.previousIDs) {
			if (this.playerTable[id]) throw new Chat.ErrorMessage(this.room.tr`You have already signed up for this game.`);
		}
		if (this.kickedUsers.has(user.id)) {
			throw new Chat.ErrorMessage(this.room.tr`You were kicked from the game and thus cannot join it again.`);
		}
		for (const id of user.previousIDs) {
			if (this.playerTable[id]) {
				throw new Chat.ErrorMessage(this.room.tr`You have already signed up for this game.`);
			}
			if (this.kickedUsers.has(id)) {
				throw new Chat.ErrorMessage(this.room.tr`You were kicked from the game and cannot join until the next game.`);
			}
		}

		for (const id in this.playerTable) {
			const targetUser = Users.get(id);
			if (targetUser) {
				const isSameUser = (
					targetUser.previousIDs.includes(user.id) ||
					targetUser.previousIDs.some(tarId => user.previousIDs.includes(tarId)) ||
					!Config.noipchecks && targetUser.ips.some(ip => user.ips.includes(ip))
				);
				if (isSameUser) throw new Chat.ErrorMessage(this.room.tr`You have already signed up for this game.`);
			}
		}
		if (this.phase !== SIGNUP_PHASE && !this.canLateJoin) {
			throw new Chat.ErrorMessage(this.room.tr`This game does not allow latejoins.`);
		}
		this.addPlayer(user);
	}

	makePlayer(user: User): TriviaPlayer {
		return new TriviaPlayer(user, this);
	}

	override destroy() {
		if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
		this.phaseTimeout = null;
		this.kickedUsers.clear();
		super.destroy();
	}

	override onConnect(user: User) {
		const player = this.playerTable[user.id];
		if (!player?.isAbsent) return false;

		player.toggleAbsence();
	}

	override onLeave(user: User, oldUserID: ID) {
		// The user cannot participate, but their score should be kept
		// regardless in cases of disconnects.
		const player = this.playerTable[oldUserID || user.id];
		if (!player || player.isAbsent) return false;

		player.toggleAbsence();
	}

	/**
	 * Handles setup that shouldn't be done from the constructor.
	 */
	init() {
		const signupsMessage = this.game.givesPoints ?
			`Signups for a new Trivia game have begun!` : `Signups for a new unranked Trivia game have begun!`;
		broadcast(
			this.room,
			this.room.tr(signupsMessage),
			this.room.tr`Mode: ${this.game.mode} | Category: ${this.game.category} | Cap: ${this.getDisplayableCap()}<br />` +
			`<button class="button" name="send" value="/trivia join">` + this.room.tr`Sign up for the Trivia game!` + `</button>` +
			this.room.tr` (You can also type <code>/trivia join</code> to sign up manually.)`
		);
	}

	getDescription() {
		return this.room.tr`Mode: ${this.game.mode} | Category: ${this.game.category} | Cap: ${this.getDisplayableCap()}`;
	}

	/**
	 * Formats the player list for display when using /trivia players.
	 */
	formatPlayerList(settings: { max: number | null, requirePoints?: boolean }) {
		return this.getTopPlayers(settings).map(player => {
			const buf = Utils.html`${player.name} (${player.player.points || "0"})`;
			return player.player.isAbsent ? `<span style="color: #444444">${buf}</span>` : buf;
		}).join(', ');
	}

	/**
	 * Kicks a player from the game, preventing them from joining it again
	 * until the next game begins.
	 */
	kick(user: User) {
		if (!this.playerTable[user.id]) {
			if (this.kickedUsers.has(user.id)) {
				throw new Chat.ErrorMessage(this.room.tr`User ${user.name} has already been kicked from the game.`);
			}

			for (const id of user.previousIDs) {
				if (this.kickedUsers.has(id)) {
					throw new Chat.ErrorMessage(this.room.tr`User ${user.name} has already been kicked from the game.`);
				}
			}

			for (const kickedUserid of this.kickedUsers) {
				const kickedUser = Users.get(kickedUserid);
				if (kickedUser) {
					const isSameUser = (
						kickedUser.previousIDs.includes(user.id) ||
						kickedUser.previousIDs.some(id => user.previousIDs.includes(id)) ||
						!Config.noipchecks && kickedUser.ips.some(ip => user.ips.includes(ip))
					);
					if (isSameUser) throw new Chat.ErrorMessage(this.room.tr`User ${user.name} has already been kicked from the game.`);
				}
			}

			throw new Chat.ErrorMessage(this.room.tr`User ${user.name} is not a player in the game.`);
		}

		this.kickedUsers.add(user.id);
		for (const id of user.previousIDs) {
			this.kickedUsers.add(id);
		}

		this.removePlayer(this.playerTable[user.id]);
	}

	leave(user: User) {
		if (!this.playerTable[user.id]) {
			throw new Chat.ErrorMessage(this.room.tr`You are not a player in the current game.`);
		}
		this.removePlayer(this.playerTable[user.id]);
	}

	/**
	 * Starts the question loop for a trivia game in its signup phase.
	 */
	start() {
		if (this.phase !== SIGNUP_PHASE) throw new Chat.ErrorMessage(this.room.tr`The game has already been started.`);

		broadcast(this.room, this.room.tr`The game will begin in ${START_TIMEOUT / 1000} seconds...`);
		this.phase = INTERMISSION_PHASE;
		this.setPhaseTimeout(() => void this.askQuestion(), START_TIMEOUT);
	}

	pause() {
		if (this.isPaused) throw new Chat.ErrorMessage(this.room.tr`The trivia game is already paused.`);
		if (this.phase === QUESTION_PHASE) {
			throw new Chat.ErrorMessage(this.room.tr`You cannot pause the trivia game during a question.`);
		}
		this.isPaused = true;
		broadcast(this.room, this.room.tr`The Trivia game has been paused.`);
	}

	resume() {
		if (!this.isPaused) throw new Chat.ErrorMessage(this.room.tr`The trivia game is not paused.`);
		this.isPaused = false;
		broadcast(this.room, this.room.tr`The Trivia game has been resumed.`);
		if (this.phase === INTERMISSION_PHASE) this.setPhaseTimeout(() => void this.askQuestion(), PAUSE_INTERMISSION);
	}

	/**
	 * Broadcasts the next question on the questions list to the room and sets
	 * a timeout to tally the answers received.
	 */
	async askQuestion() {
		if (this.isPaused) return;
		if (!this.questions.length) {
			const cap = this.getCap();
			if (!cap.questions && !cap.points) {
				if (this.game.length === 'infinite') {
					this.questions = await database.getQuestions(this.categories, 1000, {
						order: this.game.mode.startsWith('Random') ? 'random' : 'oldestfirst',
					});
				}
				// If there's no score cap, we declare a winner when we run out of questions,
				// instead of ending a game with a stalemate
				void this.win(`The game of Trivia has ended because there are no more questions!`);
				return;
			}
			if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
			this.phaseTimeout = null;
			broadcast(
				this.room,
				this.room.tr`No questions are left!`,
				this.room.tr`The game has reached a stalemate`
			);
			if (this.room) this.destroy();
			return;
		}

		this.phase = QUESTION_PHASE;
		this.askedAt = process.hrtime();

		const question = this.questions.shift()!;
		this.questionNumber++;
		this.curQuestion = question.question;
		this.curAnswers = question.answers;
		this.sendQuestion(question);
		this.setTallyTimeout();

		// Move question categories if needed
		if (question.category === MOVE_QUESTIONS_AFTER_USE_FROM_CATEGORY && await database.shouldMoveEventQuestions()) {
			await database.moveQuestionToCategory(question.question, MOVE_QUESTIONS_AFTER_USE_TO_CATEGORY);
		}
	}

	setTallyTimeout() {
		this.setPhaseTimeout(() => void this.tallyAnswers(), this.getRoundLength());
	}

	/**
	 * Broadcasts to the room what the next question is.
	 */
	sendQuestion(question: TriviaQuestion) {
		broadcast(
			this.room,
			this.room.tr`Question ${this.questionNumber}: ${question.question}`,
			this.room.tr`Category: ${ALL_CATEGORIES[question.category]}`
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
	tallyAnswers(): void | Promise<void> {}

	/**
	 * Ends the game after a player's score has exceeded the score cap.
	 */
	async win(buffer: string) {
		if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
		this.phaseTimeout = null;
		const winners = this.getTopPlayers({ max: 3, requirePoints: true });
		buffer += `<br />${this.getWinningMessage(winners)}`;
		broadcast(this.room, this.room.tr`The answering period has ended!`, buffer);

		for (const i in this.playerTable) {
			const player = this.playerTable[i];
			const user = Users.get(player.id);
			if (!user) continue;
			user.sendTo(
				this.room.roomid,
				(this.game.givesPoints ? this.room.tr`You gained ${player.points} points and answered ` : this.room.tr`You answered `) +
				this.room.tr`${player.correctAnswers} questions correctly.`
			);
		}

		const buf = this.getStaffEndMessage(winners, winner => winner.player.name);
		const logbuf = this.getStaffEndMessage(winners, winner => winner.id);
		this.room.sendMods(`(${buf}!)`);
		this.room.roomlog(buf);
		this.room.modlog({
			action: 'TRIVIAGAME',
			loggedBy: toID(this.game.creator),
			note: logbuf,
		});

		if (this.game.givesPoints) {
			const prizes = this.getPrizes();
			// these are for the non-all-time leaderboard
			// only the #1 player gets a prize on the all-time leaderboard
			const scores = new Map<ID, number>();
			for (let i = 0; i < winners.length; i++) {
				scores.set(winners[i].id as ID, prizes[i]);
			}

			for (const userid in this.playerTable) {
				const player = this.playerTable[userid];
				if (!player.points) continue;

				void database.updateLeaderboardForUser(userid as ID, {
					alltime: {
						score: userid === winners[0].id ? prizes[0] : 0,
						totalPoints: player.points,
						totalCorrectAnswers: player.correctAnswers,
					},
					nonAlltime: {
						score: scores.get(userid as ID) || 0,
						totalPoints: player.points,
						totalCorrectAnswers: player.correctAnswers,
					},
					cycle: {
						score: scores.get(userid as ID) || 0,
						totalPoints: player.points,
						totalCorrectAnswers: player.correctAnswers,
					},
				});
			}

			cachedLadder.invalidateCache();
		}

		if (typeof this.game.length === 'number') this.game.length = `${this.game.length} questions`;

		const scores = Object.fromEntries(this.getTopPlayers({ max: null })
			.map(player => [player.player.id, player.player.points]));
		if (this.game.givesPoints) {
			await database.addHistory([{
				...this.game,
				length: typeof this.game.length === 'number' ? `${this.game.length} questions` : this.game.length,
				scores,
			}]);
		}

		this.destroy();
	}

	getPrizes() {
		// Reward players more in longer infinite games
		const multiplier = this.game.length === 'infinite' ? Math.floor(this.questionNumber / 25) || 1 : 1;
		return (LENGTHS[this.game.length]?.prizes || [5, 3, 1]).map(prize => prize * multiplier);
	}

	getTopPlayers(
		options: { max: number | null, requirePoints?: boolean } = { max: null, requirePoints: true }
	): TopPlayer[] {
		const ranks = [];
		for (const userid in this.playerTable) {
			const user = Users.get(userid);
			const player = this.playerTable[userid];
			if ((options.requirePoints && !player.points) || !user) continue;
			ranks.push({ id: userid, player, name: user.name });
		}
		Utils.sortBy(ranks, ({ player }) => (
			[-player.points, player.lastQuestion, hrtimeToNanoseconds(player.answeredAt)]
		));
		return options.max === null ? ranks : ranks.slice(0, options.max);
	}

	getWinningMessage(winners: TopPlayer[]) {
		const prizes = this.getPrizes();
		const [p1, p2, p3] = winners;

		if (!p1) return `No winners this game!`;
		let initialPart = this.room.tr`${Utils.escapeHTML(p1.name)} won the game with a final score of <strong>${p1.player.points}</strong>`;
		if (!this.game.givesPoints) {
			return `${initialPart}.`;
		} else {
			initialPart += this.room.tr`, and `;
		}

		switch (winners.length) {
		case 1:
			return this.room.tr`${initialPart}their leaderboard score has increased by <strong>${prizes[0]}</strong> points!`;
		case 2:
			return this.room.tr`${initialPart}their leaderboard score has increased by <strong>${prizes[0]}</strong> points! ` +
				this.room.tr`${Utils.escapeHTML(p2.name)} was a runner-up and their leaderboard score has increased by <strong>${prizes[1]}</strong> points!`;
		case 3:
			return initialPart + Utils.html`${this.room.tr`${p2.name} and ${p3.name} were runners-up. `}` +
				this.room.tr`Their leaderboard score has increased by ${prizes[0]}, ${prizes[1]}, and ${prizes[2]}, respectively!`;
		}
	}

	getStaffEndMessage(winners: TopPlayer[], mapper: (k: TopPlayer) => string) {
		let message = "";
		if (winners.length) {
			const winnerParts: ((k: TopPlayer) => string)[] = [
				winner => this.room.tr`User ${mapper(winner)} won the game of ` +
					(this.game.givesPoints ? this.room.tr`ranked ` : this.room.tr`unranked `) +
					this.room.tr`${this.game.mode} mode trivia under the ${this.game.category} category with ` +
					this.room.tr`a cap of ${this.getDisplayableCap()} ` +
					this.room.tr`with ${winner.player.points} points and ` +
					this.room.tr`${winner.player.correctAnswers} correct answers`,
				winner => this.room.tr` Second place: ${mapper(winner)} (${winner.player.points} points)`,
				winner => this.room.tr`, third place: ${mapper(winner)} (${winner.player.points} points)`,
			];
			for (const [i, winner] of winners.entries()) {
				message += winnerParts[i](winner);
			}
		} else {
			message = `No participants in the game of ` +
				(this.game.givesPoints ? this.room.tr`ranked ` : this.room.tr`unranked `) +
				this.room.tr`${this.game.mode} mode trivia under the ${this.game.category} category with ` +
				this.room.tr`a cap of ${this.getDisplayableCap()}`;
		}
		return `${message}`;
	}

	end(user: User) {
		broadcast(this.room, Utils.html`${this.room.tr`The game was forcibly ended by ${user.name}.`}`);
		this.destroy();
	}
}

/**
 * Helper function for timer and number modes. Milliseconds are not precise
 * enough to score players properly in rare cases.
 */
const hrtimeToNanoseconds = (hrtime: number[]) => hrtime[0] * 1e9 + hrtime[1];

/**
 * First mode rewards points to the first user to answer the question
 * correctly.
 */
export class FirstModeTrivia extends Trivia {
	override answerQuestion(answer: string, user: User) {
		const player = this.playerTable[user.id];
		if (!player) throw new Chat.ErrorMessage(this.room.tr`You are not a player in the current trivia game.`);
		if (this.isPaused) throw new Chat.ErrorMessage(this.room.tr`The trivia game is paused.`);
		if (this.phase !== QUESTION_PHASE) throw new Chat.ErrorMessage(this.room.tr`There is no question to answer.`);
		if (player.answer) {
			throw new Chat.ErrorMessage(this.room.tr`You have already attempted to answer the current question.`);
		}
		if (!this.verifyAnswer(answer)) return;

		if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
		this.phase = INTERMISSION_PHASE;

		const points = this.calculatePoints();
		player.setAnswer(answer);
		player.incrementPoints(points, this.questionNumber);

		const players = user.name;
		const buffer = Utils.html`${this.room.tr`Correct: ${players}`}<br />` +
			this.room.tr`Answer(s): ${this.curAnswers.join(', ')}` + `<br />` +
			this.room.tr`They gained <strong>5</strong> points!` + `<br />` +
			this.room.tr`The top 5 players are: ${this.formatPlayerList({ max: 5 })}`;

		const cap = this.getCap();
		if ((cap.points && player.points >= cap.points) || (cap.questions && this.questionNumber >= cap.questions)) {
			void this.win(buffer);
			return;
		}

		for (const i in this.playerTable) {
			this.playerTable[i].clearAnswer();
		}

		broadcast(this.room, this.room.tr`The answering period has ended!`, buffer);
		this.setAskTimeout();
	}

	override calculatePoints() {
		return 5;
	}

	override tallyAnswers(): void {
		if (this.isPaused) return;
		this.phase = INTERMISSION_PHASE;

		for (const i in this.playerTable) {
			const player = this.playerTable[i];
			player.clearAnswer();
		}

		broadcast(
			this.room,
			this.room.tr`The answering period has ended!`,
			this.room.tr`Correct: no one...` + `<br />` +
			this.room.tr`Answers: ${this.curAnswers.join(', ')}` + `<br />` +
			this.room.tr`Nobody gained any points.` + `<br />` +
			this.room.tr`The top 5 players are: ${this.formatPlayerList({ max: 5 })}`
		);
		this.setAskTimeout();
	}

	setAskTimeout() {
		this.setPhaseTimeout(() => void this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

/**
 * Timer mode rewards up to 5 points to all players who answer correctly
 * depending on how quickly they answer the question.
 */
export class TimerModeTrivia extends Trivia {
	override answerQuestion(answer: string, user: User) {
		const player = this.playerTable[user.id];
		if (!player) throw new Chat.ErrorMessage(this.room.tr`You are not a player in the current trivia game.`);
		if (this.isPaused) throw new Chat.ErrorMessage(this.room.tr`The trivia game is paused.`);
		if (this.phase !== QUESTION_PHASE) throw new Chat.ErrorMessage(this.room.tr`There is no question to answer.`);

		const isCorrect = this.verifyAnswer(answer);
		player.setAnswer(answer, isCorrect);
	}

	/**
	 * The difference between the time the player answered the question and
	 * when the question was asked, in nanoseconds.
	 * The difference between the time scoring began and the time the question
	 * was asked, in nanoseconds.
	 */
	override calculatePoints(diff: number, totalDiff: number) {
		return Math.floor(6 - 5 * diff / totalDiff);
	}

	override tallyAnswers() {
		if (this.isPaused) return;
		this.phase = INTERMISSION_PHASE;

		let buffer = (
			this.room.tr`Answer(s): ${this.curAnswers.join(', ')}<br />` +
			`<table style="width: 100%; background-color: #9CBEDF; margin: 2px 0">` +
			`<tr style="background-color: #6688AA">` +
			`<th style="width: 100px">Points gained</th>` +
			`<th>${this.room.tr`Correct`}</th>` +
			`</tr>`
		);
		const innerBuffer = new Map<number, [string, number][]>([5, 4, 3, 2, 1].map(n => [n, []]));

		const now = hrtimeToNanoseconds(process.hrtime());
		const askedAt = hrtimeToNanoseconds(this.askedAt);
		const totalDiff = now - askedAt;
		const cap = this.getCap();

		let winner = cap.questions && this.questionNumber >= cap.questions;

		for (const userid in this.playerTable) {
			const player = this.playerTable[userid];
			if (!player.isCorrect) {
				player.clearAnswer();
				continue;
			}

			const playerAnsweredAt = hrtimeToNanoseconds(player.currentAnsweredAt);
			const diff = playerAnsweredAt - askedAt;
			const points = this.calculatePoints(diff, totalDiff);
			player.incrementPoints(points, this.questionNumber);

			const pointBuffer = innerBuffer.get(points) || [];
			pointBuffer.push([player.name, playerAnsweredAt]);

			if (cap.points && player.points >= cap.points) {
				winner = true;
			}

			player.clearAnswer();
		}

		let rowAdded = false;
		for (const [pointValue, players] of innerBuffer) {
			if (!players.length) continue;

			rowAdded = true;
			const playerNames = Utils.sortBy(players, ([name, answeredAt]) => answeredAt)
				.map(([name]) => name);
			buffer += (
				'<tr style="background-color: #6688AA">' +
				`<td style="text-align: center">${pointValue}</td>` +
				Utils.html`<td>${playerNames.join(', ')}</td>` +
				'</tr>'
			);
		}

		if (!rowAdded) {
			buffer += (
				'<tr style="background-color: #6688AA">' +
				'<td style="text-align: center">&#8212;</td>' +
				`<td>${this.room.tr`No one answered correctly...`}</td>` +
				'</tr>'
			);
		}

		buffer += '</table>';
		buffer += `<br />${this.room.tr`The top 5 players are: ${this.formatPlayerList({ max: 5 })}`}`;

		if (winner) {
			return this.win(buffer);
		} else {
			broadcast(this.room, this.room.tr`The answering period has ended!`, buffer);
		}
		this.setPhaseTimeout(() => void this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

/**
 * Number mode rewards up to 5 points to all players who answer correctly
 * depending on the ratio of correct players to total players (lower ratio is
 * better).
 */
export class NumberModeTrivia extends Trivia {
	override answerQuestion(answer: string, user: User) {
		const player = this.playerTable[user.id];
		if (!player) throw new Chat.ErrorMessage(this.room.tr`You are not a player in the current trivia game.`);
		if (this.isPaused) throw new Chat.ErrorMessage(this.room.tr`The trivia game is paused.`);
		if (this.phase !== QUESTION_PHASE) throw new Chat.ErrorMessage(this.room.tr`There is no question to answer.`);

		const isCorrect = this.verifyAnswer(answer);
		player.setAnswer(answer, isCorrect);
	}

	override calculatePoints(correctPlayers: number) {
		return correctPlayers && (6 - Math.floor(5 * correctPlayers / this.playerCount));
	}

	override getRoundLength() {
		return 6 * 1000;
	}

	override tallyAnswers() {
		if (this.isPaused) return;
		this.phase = INTERMISSION_PHASE;

		let buffer;
		const innerBuffer = Utils.sortBy(
			Object.values(this.playerTable)
				.filter(player => !!player.isCorrect)
				.map(player => [player.name, hrtimeToNanoseconds(player.currentAnsweredAt)]),
			([player, answeredAt]) => answeredAt
		);

		const points = this.calculatePoints(innerBuffer.length);
		const cap = this.getCap();
		let winner = cap.questions && this.questionNumber >= cap.questions;
		if (points) {
			for (const userid in this.playerTable) {
				const player = this.playerTable[userid];
				if (player.isCorrect) player.incrementPoints(points, this.questionNumber);

				if (cap.points && player.points >= cap.points) {
					winner = true;
				}

				player.clearAnswer();
			}

			const players = Utils.escapeHTML(innerBuffer.map(([playerName]) => playerName).join(', '));
			buffer = this.room.tr`Correct: ${players}` + `<br />` +
				this.room.tr`Answer(s): ${this.curAnswers.join(', ')}<br />` +
				`${Chat.plural(innerBuffer, this.room.tr`Each of them gained <strong>${points}</strong> point(s)!`, this.room.tr`They gained <strong>${points}</strong> point(s)!`)}`;
		} else {
			for (const userid in this.playerTable) {
				const player = this.playerTable[userid];
				player.clearAnswer();
			}

			buffer = this.room.tr`Correct: no one...` + `<br />` +
				this.room.tr`Answer(s): ${this.curAnswers.join(', ')}<br />` +
				this.room.tr`Nobody gained any points.`;
		}

		buffer += `<br />${this.room.tr`The top 5 players are: ${this.formatPlayerList({ max: 5 })}`}`;

		if (winner) {
			return this.win(buffer);
		} else {
			broadcast(this.room, this.room.tr`The answering period has ended!`, buffer);
		}
		this.setPhaseTimeout(() => void this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

/**
 * Triumvirate mode rewards points to the top three users to answer the question correctly.
 */
export class TriumvirateModeTrivia extends Trivia {
	override answerQuestion(answer: string, user: User) {
		const player = this.playerTable[user.id];
		if (!player) throw new Chat.ErrorMessage(this.room.tr`You are not a player in the current trivia game.`);
		if (this.isPaused) throw new Chat.ErrorMessage(this.room.tr`The trivia game is paused.`);
		if (this.phase !== QUESTION_PHASE) throw new Chat.ErrorMessage(this.room.tr`There is no question to answer.`);
		player.setAnswer(answer, this.verifyAnswer(answer));
		const correctAnswers = Object.keys(this.playerTable).filter(id => this.playerTable[id].isCorrect).length;
		if (correctAnswers === 3) {
			if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
			void this.tallyAnswers();
		}
	}

	override calculatePoints(answerNumber: number) {
		return 5 - answerNumber * 2; // 5 points to 1st, 3 points to 2nd, 1 point to 1st
	}

	override tallyAnswers() {
		if (this.isPaused) return;
		this.phase = INTERMISSION_PHASE;
		const correctPlayers = Object.values(this.playerTable).filter(p => p.isCorrect);
		Utils.sortBy(correctPlayers, p => hrtimeToNanoseconds(p.currentAnsweredAt));

		const cap = this.getCap();
		let winner = cap.questions && this.questionNumber >= cap.questions;
		const playersWithPoints = [];
		for (const player of correctPlayers) {
			const points = this.calculatePoints(correctPlayers.indexOf(player));
			player.incrementPoints(points, this.questionNumber);
			playersWithPoints.push(`${Utils.escapeHTML(player.name)} (${points})`);
			if (cap.points && player.points >= cap.points) {
				winner = true;
			}
		}
		for (const i in this.playerTable) {
			this.playerTable[i].clearAnswer();
		}

		let buffer = ``;
		if (playersWithPoints.length) {
			const players = playersWithPoints.join(", ");
			buffer = this.room.tr`Correct: ${players}<br />` +
				this.room.tr`Answers: ${this.curAnswers.join(', ')}<br />` +
				this.room.tr`The top 5 players are: ${this.formatPlayerList({ max: 5 })}`;
		} else {
			buffer = this.room.tr`Correct: no one...` + `<br />` +
				this.room.tr`Answers: ${this.curAnswers.join(', ')}<br />` +
				this.room.tr`Nobody gained any points.` + `<br />` +
				this.room.tr`The top 5 players are: ${this.formatPlayerList({ max: 5 })}`;
		}

		if (winner) return this.win(buffer);
		broadcast(this.room, this.room.tr`The answering period has ended!`, buffer);
		this.setPhaseTimeout(() => void this.askQuestion(), INTERMISSION_INTERVAL);
	}
}

/**
 * Mastermind is a separate, albeit similar, game from regular Trivia.
 *
 * In Mastermind, each player plays their own personal round of Trivia,
 * and the top n players from those personal rounds go on to the finals,
 * which is a game of First mode trivia that ends after a specified interval.
 */
export class Mastermind extends Rooms.SimpleRoomGame {
	override readonly gameid = 'mastermind' as ID;
	/** userid:score Map */
	leaderboard: Map<ID, { score: number, hasLeft?: boolean }>;
	phase: string;
	currentRound: MastermindRound | MastermindFinals | null;
	numFinalists: number;

	constructor(room: Room, numFinalists: number) {
		super(room);

		this.leaderboard = new Map();
		this.title = 'Mastermind';
		this.allowRenames = true;
		this.playerCap = Number.MAX_SAFE_INTEGER;
		this.phase = SIGNUP_PHASE;
		this.currentRound = null;
		this.numFinalists = numFinalists;
		this.init();
	}

	init() {
		broadcast(
			this.room,
			this.room.tr`Signups for a new Mastermind game have begun!`,
			this.room.tr`The top <strong>${this.numFinalists}</strong> players will advance to the finals!` + `<br />` +
			this.room.tr`Type <code>/mastermind join</code> to sign up for the game.`
		);
	}

	addTriviaPlayer(user: User) {
		if (user.previousIDs.concat(user.id).some(id => id in this.playerTable)) {
			throw new Chat.ErrorMessage(this.room.tr`You have already signed up for this game.`);
		}

		for (const targetUser of Object.keys(this.playerTable).map(id => Users.get(id))) {
			if (!targetUser) continue;
			const isSameUser = (
				targetUser.previousIDs.includes(user.id) ||
				targetUser.previousIDs.some(tarId => user.previousIDs.includes(tarId)) ||
				!Config.noipchecks && targetUser.ips.some(ip => user.ips.includes(ip))
			);
			if (isSameUser) throw new Chat.ErrorMessage(this.room.tr`You have already signed up for this game.`);
		}

		this.addPlayer(user);
	}

	formatPlayerList() {
		return Utils.sortBy(
			Object.values(this.playerTable),
			player => -(this.leaderboard.get(player.id)?.score || 0)
		).map(player => {
			const isFinalist = this.currentRound instanceof MastermindFinals && player.id in this.currentRound.playerTable;
			const name = isFinalist ? Utils.html`<strong>${player.name}</strong>` : Utils.escapeHTML(player.name);
			return `${name} (${this.leaderboard.get(player.id)?.score || "0"})`;
		}).join(', ');
	}

	/**
	 * Starts a new round for a particular player.
	 * @param playerID the user ID of the player
	 * @param category the category to ask questions in (e.g. Pokémon)
	 * @param questions an array of TriviaQuestions to be asked
	 * @param timeout the period of time to end the round after (in seconds)
	 */
	startRound(playerID: ID, category: ID, questions: TriviaQuestion[], timeout: number) {
		if (this.currentRound) {
			throw new Chat.ErrorMessage(this.room.tr`There is already a round of Mastermind in progress.`);
		}
		if (!(playerID in this.playerTable)) {
			throw new Chat.ErrorMessage(this.room.tr`That user is not signed up for Mastermind!`);
		}
		if (this.leaderboard.has(playerID)) {
			throw new Chat.ErrorMessage(this.room.tr`The user "${playerID}" has already played their round of Mastermind.`);
		}
		if (this.playerCount <= this.numFinalists) {
			throw new Chat.ErrorMessage(this.room.tr`You cannot start the game of Mastermind until there are more players than finals slots.`);
		}

		this.phase = MASTERMIND_ROUNDS_PHASE;

		this.currentRound = new MastermindRound(this.room, category, questions, playerID);
		setTimeout(() => {
			if (!this.currentRound) return;
			const points = this.currentRound.playerTable[playerID]?.points;
			const player = this.playerTable[playerID].name;
			broadcast(
				this.room,
				this.room.tr`The round of Mastermind has ended!`,
				points ? this.room.tr`${player} earned ${points} points!` : undefined
			);

			this.leaderboard.set(playerID, { score: points || 0 });
			this.currentRound.destroy();
			this.currentRound = null;
		}, timeout * 1000);
	}

	/**
	 * Starts the Mastermind finals.
	 * According the specification given by Trivia auth,
	 * Mastermind finals are always in the 'all' category.
	 * @param timeout timeout in seconds
	 */
	async startFinals(timeout: number) {
		if (this.currentRound) {
			throw new Chat.ErrorMessage(this.room.tr`There is already a round of Mastermind in progress.`);
		}
		for (const player in this.playerTable) {
			if (!this.leaderboard.has(toID(player))) {
				throw new Chat.ErrorMessage(this.room.tr`You cannot start finals until the user '${player}' has played a round.`);
			}
		}

		const questions = await getQuestions(['all' as ID], 'random');
		if (!questions.length) throw new Chat.ErrorMessage(this.room.tr`There are no questions in the Trivia database.`);

		this.currentRound = new MastermindFinals(this.room, 'all' as ID, questions, this.getTopPlayers(this.numFinalists));

		this.phase = MASTERMIND_FINALS_PHASE;
		setTimeout(() => {
			void (async () => {
				if (this.currentRound) {
					await this.currentRound.win();
					const [winner, second, third] = this.currentRound.getTopPlayers();
					this.currentRound.destroy();
					this.currentRound = null;

					let buf = this.room.tr`No one scored any points, so it's a tie!`;
					if (winner) {
						const winnerName = Utils.escapeHTML(winner.name);
						buf = this.room.tr`${winnerName} won the game of Mastermind with ${winner.player.points} points!`;
					}

					let smallBuf;
					if (second && third) {
						const secondPlace = Utils.escapeHTML(second.name);
						const thirdPlace = Utils.escapeHTML(third.name);
						smallBuf = `<br />${this.room.tr`${secondPlace} and ${thirdPlace} were runners-up with ${second.player.points} and ${third.player.points} points, respectively.`}`;
					} else if (second) {
						const secondPlace = Utils.escapeHTML(second.name);
						smallBuf = `<br />${this.room.tr`${secondPlace} was a runner up with ${second.player.points} points.`}`;
					}

					broadcast(this.room, buf, smallBuf);
				}
				this.destroy();
			})();
		}, timeout * 1000);
	}

	/**
	 * NOT guaranteed to return an array of length n.
	 *
	 * See the Trivia auth discord: https://discord.com/channels/280211330307194880/444675649731428352/788204647402831913
	 */
	getTopPlayers(n: number) {
		if (n < 0) return [];

		const sortedPlayerIDs = Utils.sortBy(
			[...this.leaderboard].filter(([, info]) => !info.hasLeft),
			([, info]) => -info.score
		).map(([userid]) => userid);

		if (sortedPlayerIDs.length <= n) return sortedPlayerIDs;

		/** The number of points required to be in the top n */
		const cutoff = this.leaderboard.get(sortedPlayerIDs[n - 1])!;
		while (n < sortedPlayerIDs.length && this.leaderboard.get(sortedPlayerIDs[n])! === cutoff) {
			n++;
		}
		return sortedPlayerIDs.slice(0, n);
	}

	end(user: User) {
		broadcast(this.room, this.room.tr`The game of Mastermind was forcibly ended by ${user.name}.`);
		if (this.currentRound) this.currentRound.destroy();
		this.destroy();
	}

	leave(user: User) {
		if (!this.playerTable[user.id]) {
			throw new Chat.ErrorMessage(this.room.tr`You are not a player in the current game.`);
		}
		const lbEntry = this.leaderboard.get(user.id);
		if (lbEntry) {
			this.leaderboard.set(user.id, { ...lbEntry, hasLeft: true });
		}
		this.removePlayer(this.playerTable[user.id]);
	}

	kick(toKick: User, kicker: User) {
		if (!this.playerTable[toKick.id]) {
			throw new Chat.ErrorMessage(this.room.tr`User ${toKick.name} is not a player in the game.`);
		}

		if (this.numFinalists > (this.players.length - 1)) {
			throw new Chat.ErrorMessage(
				this.room.tr`Kicking ${toKick.name} would leave this game of Mastermind without enough players to reach ${this.numFinalists} finalists.`
			);
		}

		this.leaderboard.delete(toKick.id);

		if (this.currentRound?.playerTable[toKick.id]) {
			if (this.currentRound instanceof MastermindFinals) {
				this.currentRound.kick(toKick);
			} else /* it's a regular round */ {
				this.currentRound.end(kicker);
			}
		}

		this.removePlayer(this.playerTable[toKick.id]);
	}
}

export class MastermindRound extends FirstModeTrivia {
	constructor(room: Room, category: ID, questions: TriviaQuestion[], playerID?: ID) {
		super(room, 'first', [category], false, 'infinite', questions, 'Automatically Created', false, true);

		this.playerCap = 1;
		if (playerID) {
			const player = Users.get(playerID);
			const targetUsername = playerID;
			if (!player) throw new Chat.ErrorMessage(this.room.tr`User "${targetUsername}" not found.`);
			this.addPlayer(player);
		}
		this.game.mode = 'Mastermind';
		this.start();
	}

	override init() {
	}
	override start() {
		const player = Object.values(this.playerTable)[0];
		const name = Utils.escapeHTML(player.name);
		broadcast(this.room, this.room.tr`A Mastermind round in the ${this.game.category} category for ${name} is starting!`);
		player.sendRoom(
			`|tempnotify|mastermind|Your Mastermind round is starting|Your round of Mastermind is starting in the Trivia room.`
		);

		this.phase = INTERMISSION_PHASE;
		this.setPhaseTimeout(() => void this.askQuestion(), MASTERMIND_INTERMISSION_INTERVAL);
	}

	override win(): Promise<void> {
		if (this.phaseTimeout) clearTimeout(this.phaseTimeout);
		this.phaseTimeout = null;
		return Promise.resolve();
	}

	override addTriviaPlayer(user: User): string | undefined {
		throw new Chat.ErrorMessage(`This is a round of Mastermind; to join the overall game of Mastermind, use /mm join`);
	}

	override setTallyTimeout() {
		// Players must use /mastermind pass to pass on a question
	}

	pass() {
		this.tallyAnswers();
	}

	override setAskTimeout() {
		this.setPhaseTimeout(() => void this.askQuestion(), MASTERMIND_INTERMISSION_INTERVAL);
	}

	override destroy() {
		super.destroy();
	}
}

export class MastermindFinals extends MastermindRound {
	constructor(room: Room, category: ID, questions: TriviaQuestion[], players: ID[]) {
		super(room, category, questions);
		this.playerCap = players.length;
		for (const id of players) {
			const player = Users.get(id);
			if (!player) continue;
			this.addPlayer(player);
		}
	}

	override start() {
		broadcast(this.room, this.room.tr`The Mastermind finals are starting!`);
		this.phase = INTERMISSION_PHASE;
		// Use the regular start timeout since there are many players
		this.setPhaseTimeout(() => void this.askQuestion(), MASTERMIND_FINALS_START_TIMEOUT);
	}

	override async win() {
		await super.win();
		const points = new Map<string, number>();
		for (const id in this.playerTable) {
			points.set(id, this.playerTable[id].points);
		}
	}

	override setTallyTimeout = FirstModeTrivia.prototype.setTallyTimeout;

	override pass() {
		throw new Chat.ErrorMessage(this.room.tr`You cannot pass in the finals.`);
	}
}

const triviaCommands: Chat.ChatCommands = {
	sortednew: 'new',
	newsorted: 'new',
	unrankednew: 'new',
	newunranked: 'new',
	async new(target, room, user, connection, cmd) {
		const randomizeQuestionOrder = !cmd.includes('sorted');
		const givesPoints = !cmd.includes('unranked');

		room = this.requireRoom('trivia' as RoomID);
		this.checkCan('show', null, room);
		this.checkChat();
		if (room.game) {
			return this.errorReply(this.tr`There is already a game of ${room.game.title} in progress.`);
		}

		const targets = (target ? target.split(',') : []);
		if (targets.length < 3) return this.errorReply("Usage: /trivia new [mode], [category], [length]");

		let mode: string = toID(targets[0]);
		if (['triforce', 'tri'].includes(mode)) mode = 'triumvirate';
		const isRandomMode = (mode === 'random');
		if (isRandomMode) {
			const acceptableModes = Object.keys(MODES).filter(curMode => curMode !== 'first');
			mode = Utils.shuffle(acceptableModes)[0];
		}
		if (!MODES[mode]) return this.errorReply(this.tr`"${mode}" is an invalid mode.`);

		let categories: ID[] | 'random' = targets[1]
			.split('+')
			.map(cat => {
				const id = toID(cat);
				return CATEGORY_ALIASES[id] || id;
			});
		if (categories[0] === 'random') {
			if (categories.length > 1) throw new Chat.ErrorMessage(`You cannot combine random with another category.`);
			categories = 'random';
		}

		const questions = await getQuestions(categories, randomizeQuestionOrder ? 'random' : 'oldestfirst');

		let length: ID | number = toID(targets[2]);
		if (!LENGTHS[length]) {
			length = parseInt(length);
			if (isNaN(length) || length < 1) return this.errorReply(this.tr`"${length}" is an invalid game length.`);
		}

		// Assume that infinite mode will last for at least 75 points
		const questionsNecessary = typeof length === 'string' ? (LENGTHS[length].cap || 75) / 5 : length;
		if (questions.length < questionsNecessary) {
			if (categories === 'random') {
				return this.errorReply(
					this.tr`There are not enough questions in the randomly chosen category to finish a trivia game.`
				);
			}
			if (categories.length === 1 && categories[0] === 'all') {
				return this.errorReply(
					this.tr`There are not enough questions in the trivia database to finish a trivia game.`
				);
			}
			return this.errorReply(
				this.tr`There are not enough questions under the specified categories to finish a trivia game.`
			);
		}

		let _Trivia;
		if (mode === 'first') {
			_Trivia = FirstModeTrivia;
		} else if (mode === 'number') {
			_Trivia = NumberModeTrivia;
		} else if (mode === 'triumvirate') {
			_Trivia = TriumvirateModeTrivia;
		} else {
			_Trivia = TimerModeTrivia;
		}

		const isRandomCategory = categories === 'random';
		categories = isRandomCategory ? [questions[0].category as ID] : categories as ID[];
		room.game = new _Trivia(
			room, mode, categories, givesPoints, length, questions,
			user.name, isRandomMode, false, isRandomCategory
		);
	},
	newhelp: [
		`/trivia new [mode], [categories], [length] - Begin a new Trivia game.`,
		`/trivia unrankednew [mode], [category], [length] - Begin a new Trivia game that does not award leaderboard points.`,
		`/trivia sortednew [mode], [category], [length] — Begin a new Trivia game in which the question order is not randomized.`,
		`Requires: + % @ # ~`,
	],

	join(target, room, user) {
		room = this.requireRoom();
		getTriviaGame(room).addTriviaPlayer(user);
		this.sendReply(this.tr`You are now signed up for this game!`);
	},
	joinhelp: [`/trivia join - Join the current game of Trivia or Mastermind.`],

	kick(target, room, user) {
		room = this.requireRoom();
		this.checkChat();
		this.checkCan('mute', null, room);

		const { targetUser } = this.requireUser(target, { allowOffline: true });
		getTriviaOrMastermindGame(room).kick(targetUser, user);
	},
	kickhelp: [`/trivia kick [username] - Kick players from a trivia game by username. Requires: % @ # ~`],

	leave(target, room, user) {
		getTriviaGame(room).leave(user);
		this.sendReply(this.tr`You have left the current game of Trivia.`);
	},
	leavehelp: [`/trivia leave - Makes the player leave the game.`],

	start(target, room) {
		room = this.requireRoom();
		this.checkCan('show', null, room);
		this.checkChat();

		getTriviaGame(room).start();
	},
	starthelp: [`/trivia start - Ends the signup phase of a trivia game and begins the game. Requires: + % @ # ~`],

	answer(target, room, user) {
		room = this.requireRoom();
		this.checkChat();
		let game: Trivia | MastermindRound | MastermindFinals;
		try {
			const mastermindRound = getMastermindGame(room).currentRound;
			if (!mastermindRound) throw new Error;
			game = mastermindRound;
		} catch {
			game = getTriviaGame(room);
		}

		const answer = toID(target);
		if (!answer) return this.errorReply(this.tr`No valid answer was entered.`);

		if (room.game?.gameid === 'trivia' && !Object.keys(game.playerTable).includes(user.id)) {
			game.addTriviaPlayer(user);
		}
		game.answerQuestion(answer, user);
		this.sendReply(this.tr`You have selected "${answer}" as your answer.`);
	},
	answerhelp: [`/trivia answer OR /ta [answer] - Answer a pending question.`],

	resume: 'pause',
	pause(target, room, user, connection, cmd) {
		room = this.requireRoom();
		this.checkCan('show', null, room);
		this.checkChat();
		if (cmd === 'pause') {
			getTriviaGame(room).pause();
		} else {
			getTriviaGame(room).resume();
		}
	},
	pausehelp: [`/trivia pause - Pauses a trivia game. Requires: + % @ # ~`],
	resumehelp: [`/trivia resume - Resumes a paused trivia game. Requires: + % @ # ~`],

	end(target, room, user) {
		room = this.requireRoom();
		this.checkCan('show', null, room);
		this.checkChat();

		getTriviaOrMastermindGame(room).end(user);
	},
	endhelp: [`/trivia end - Forcibly end a trivia game. Requires: + % @ # ~`],

	getwinners: 'win',
	async win(target, room, user) {
		room = this.requireRoom();
		this.checkCan('show', null, room);
		this.checkChat();

		const game = getTriviaGame(room);
		if (game.game.length !== 'infinite' && !user.can('editroom', null, room)) {
			return this.errorReply(
				this.tr`Only Room Owners and higher can force a Trivia game to end with winners in a non-infinite length.`
			);
		}
		await game.win(this.tr`${user.name} ended the game of Trivia!`);
	},
	winhelp: [`/trivia win - End a trivia game and tally the points to find winners. Requires: + % @ # ~ in Infinite length, else # ~`],

	'': 'status',
	players: 'status',
	status(target, room, user) {
		room = this.requireRoom();
		if (!this.runBroadcast()) return false;
		const game = getTriviaGame(room);

		const targetUser = this.getUserOrSelf(target);
		if (!targetUser) return this.errorReply(this.tr`User ${target} does not exist.`);
		let buffer = `${game.isPaused ? this.tr`There is a paused trivia game` : this.tr`There is a trivia game in progress`}, ` +
			this.tr`and it is in its ${game.phase} phase.` + `<br />` +
			this.tr`Mode: ${game.game.mode} | Category: ${game.game.category} | Cap: ${game.getDisplayableCap()}`;

		const player = game.playerTable[targetUser.id];
		if (player) {
			if (!this.broadcasting) {
				buffer += `<br />${this.tr`Current score: ${player.points} | Correct Answers: ${player.correctAnswers}`}`;
			}
		} else if (targetUser.id !== user.id) {
			return this.errorReply(this.tr`User ${targetUser.name} is not a player in the current trivia game.`);
		}
		buffer += `<br />${this.tr`Players: ${game.formatPlayerList({ max: null, requirePoints: false })}`}`;

		this.sendReplyBox(buffer);
	},
	statushelp: [`/trivia status [player] - lists the player's standings (your own if no player is specified) and the list of players in the current trivia game.`],

	submit: 'add',
	async add(target, room, user, connection, cmd) {
		room = this.requireRoom('questionworkshop' as RoomID);
		if (cmd === 'add') this.checkCan('mute', null, room);
		if (cmd === 'submit') this.checkCan('show', null, room);
		if (!target) return false;
		this.checkChat();

		const questions: TriviaQuestion[] = [];
		const params = target.split('\n').map(str => str.split('|'));
		for (const param of params) {
			if (param.length !== 3) {
				this.errorReply(this.tr`Invalid arguments specified in "${param}". View /trivia help for more information.`);
				continue;
			}

			const categoryID = toID(param[0]);
			const category = CATEGORY_ALIASES[categoryID] || categoryID;
			if (!ALL_CATEGORIES[category]) {
				this.errorReply(this.tr`'${param[0].trim()}' is not a valid category. View /trivia help for more information.`);
				continue;
			}
			if (cmd === 'submit' && !MAIN_CATEGORIES[category]) {
				this.errorReply(this.tr`You cannot submit questions in the '${ALL_CATEGORIES[category]}' category`);
				continue;
			}

			const question = Utils.escapeHTML(param[1].trim());
			if (!question) {
				this.errorReply(this.tr`'${param[1].trim()}' is not a valid question.`);
				continue;
			}
			if (question.length > MAX_QUESTION_LENGTH) {
				this.errorReply(
					this.tr`Question "${param[1].trim()}" is too long! It must remain under ${MAX_QUESTION_LENGTH} characters.`
				);
				continue;
			}

			await database.ensureQuestionDoesNotExist(question);
			const cache = new Set();
			const answers = param[2].split(',')
				.map(toID)
				.filter(answer => !cache.has(answer) && !!cache.add(answer));
			if (!answers.length) {
				this.errorReply(this.tr`No valid answers were specified for question '${param[1].trim()}'.`);
				continue;
			}
			if (answers.some(answer => answer.length > MAX_ANSWER_LENGTH)) {
				this.errorReply(
					this.tr`Some of the answers entered for question '${param[1].trim()}' were too long!\n` +
					`They must remain under ${MAX_ANSWER_LENGTH} characters.`
				);
				continue;
			}

			questions.push({
				category,
				question,
				answers,
				user: user.id,
				addedAt: Date.now(),
			});
		}

		let formattedQuestions = '';
		for (const [index, question] of questions.entries()) {
			formattedQuestions += `'${question.question}' in ${question.category}`;
			if (index !== questions.length - 1) formattedQuestions += ', ';
		}

		if (cmd === 'add') {
			await database.addQuestions(questions);
			this.modlog('TRIVIAQUESTION', null, `added ${formattedQuestions}`);
			this.privateModAction(`Questions ${formattedQuestions} were added to the question database by ${user.name}.`);
		} else {
			await database.addQuestionSubmissions(questions);
			if (!user.can('mute', null, room)) this.sendReply(`Questions '${formattedQuestions}' were submitted for review.`);
			this.modlog('TRIVIAQUESTION', null, `submitted ${formattedQuestions}`);
			this.privateModAction(`Questions ${formattedQuestions} were submitted to the submission database by ${user.name} for review.`);
		}
	},
	submithelp: [`/trivia submit [category] | [question] | [answer1], [answer2] ... [answern] - Adds question(s) to the submission database for staff to review. Requires: + % @ # ~`],
	addhelp: [`/trivia add [category] | [question] | [answer1], [answer2], ... [answern] - Adds question(s) to the question database. Requires: % @ # ~`],

	async review(target, room) {
		room = this.requireRoom('questionworkshop' as RoomID);
		this.checkCan('ban', null, room);

		const submissions = await database.getSubmissions();
		if (!submissions.length) return this.sendReply(this.tr`No questions await review.`);

		let innerBuffer = '';
		for (const [index, question] of submissions.entries()) {
			innerBuffer += `<tr><td><strong>${index + 1}</strong></td><td>${question.category}</td><td>${question.question}</td><td>${question.answers.join(", ")}</td><td>${question.user}</td></tr>`;
		}

		const buffer = `|raw|<div class="ladder"><table>` +
			`<tr><td colspan="6"><strong>${Chat.count(submissions.length, "</strong> questions")} awaiting review:</td></tr>` +
			`<tr><th>#</th><th>${this.tr`Category`}</th><th>${this.tr`Question`}</th><th>${this.tr`Answer(s)`}</th><th>${this.tr`Submitted By`}</th></tr>` +
			innerBuffer +
			`</table></div>`;

		this.sendReply(buffer);
	},
	reviewhelp: [`/trivia review - View the list of submitted questions. Requires: @ # ~`],

	reject: 'accept',
	async accept(target, room, user, connection, cmd) {
		room = this.requireRoom('questionworkshop' as RoomID);
		this.checkCan('ban', null, room);
		this.checkChat();

		target = target.trim();
		if (!target) return false;

		const isAccepting = cmd === 'accept';
		const submissions = await database.getSubmissions();

		if (toID(target) === 'all') {
			if (isAccepting) await database.addQuestions(submissions);
			await database.clearSubmissions();
			const questionText = submissions.map(q => `"${q.question}"`).join(', ');
			const message = `${(isAccepting ? "added" : "removed")} all questions (${questionText}) from the submission database.`;
			this.modlog(`TRIVIAQUESTION`, null, message);
			return this.privateModAction(`${user.name} ${message}`);
		}

		if (/\d+(?:-\d+)?(?:, ?\d+(?:-\d+)?)*$/.test(target)) {
			const indices = target.split(',');
			const questions: string[] = [];

			// Parse number ranges and add them to the list of indices,
			// then remove them in addition to entries that aren't valid index numbers
			for (let i = indices.length; i--;) {
				if (!indices[i].includes('-')) {
					const index = Number(indices[i]);
					if (Number.isInteger(index) && index > 0 && index <= submissions.length) {
						questions.push(submissions[index - 1].question);
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
					questions.push(submissions[right - 1].question);
				} while (--right >= left);

				indices.splice(i, 1);
			}

			const indicesLen = indices.length;
			if (!indicesLen) {
				return this.errorReply(
					this.tr`'${target}' is not a valid set of submission index numbers.\n` +
					this.tr`View /trivia review and /trivia help for more information.`
				);
			}

			if (isAccepting) {
				await database.acceptSubmissions(questions);
			} else {
				await database.deleteSubmissions(questions);
			}

			const questionText = questions.map(q => `"${q}"`).join(', ');
			const message = `${(isAccepting ? "added " : "removed ")}submission number${(indicesLen > 1 ? "s " : " ")}${target} (${questionText})`;
			this.modlog('TRIVIAQUESTION', null, message);
			return this.privateModAction(`${user.name} ${message} from the submission database.`);
		}

		this.errorReply(this.tr`'${target}' is an invalid argument. View /trivia help questions for more information.`);
	},
	accepthelp: [`/trivia accept [index1], [index2], ... [indexn] OR all - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: @ # ~`],
	rejecthelp: [`/trivia reject [index1], [index2], ... [indexn] OR all - Remove questions from the submission database using their index numbers or ranges of them. Requires: @ # ~`],

	async delete(target, room, user) {
		room = this.requireRoom('questionworkshop' as RoomID);
		this.checkCan('mute', null, room);
		this.checkChat();

		target = target.trim();
		if (!target) return this.parse(`/help trivia delete`);

		const question = Utils.escapeHTML(target).trim();
		if (!question) {
			return this.errorReply(this.tr`'${target}' is not a valid argument. View /trivia help questions for more information.`);
		}

		const { category } = await database.ensureQuestionExists(question);
		await database.deleteQuestion(question);

		this.modlog('TRIVIAQUESTION', null, `removed '${target}' from ${category}`);
		return this.privateModAction(room.tr`${user.name} removed question '${target}' (category: ${category}) from the question database.`);
	},
	deletehelp: [`/trivia delete [question] - Delete a question from the trivia database. Requires: % @ # ~`],

	async move(target, room, user) {
		room = this.requireRoom('questionworkshop' as RoomID);
		this.checkCan('mute', null, room);
		this.checkChat();

		target = target.trim();
		if (!target) return false;

		const params = target.split('\n').map(str => str.split('|'));
		for (const param of params) {
			if (param.length !== 2) {
				this.errorReply(this.tr`Invalid arguments specified in "${param}". View /trivia help for more information.`);
				continue;
			}

			const categoryID = toID(param[0]);
			const category = CATEGORY_ALIASES[categoryID] || categoryID;
			if (!ALL_CATEGORIES[category]) {
				this.errorReply(this.tr`'${param[0].trim()}' is not a valid category. View /trivia help for more information.`);
				continue;
			}

			const question = Utils.escapeHTML(param[1].trim());
			if (!question) {
				this.errorReply(this.tr`'${param[1].trim()}' is not a valid question.`);
				continue;
			}

			const { category: oldCat } = await database.ensureQuestionExists(question);
			await database.moveQuestionToCategory(question, category);
			this.modlog('TRIVIAQUESTION', null, `changed category for '${param[1].trim()}' from '${oldCat}' to '${param[0]}'`);
			return this.privateModAction(
				this.tr`${user.name} changed question category from '${oldCat}' to '${param[0]}' for '${param[1].trim()}' ` +
				this.tr`from the question database.`
			);
		}
	},
	movehelp: [
		`/trivia move [category] | [question] - Change the category of a question in the trivia database. Requires: % @ # ~`,
	],

	async migrate(target, room, user) {
		room = this.requireRoom('questionworkshop' as RoomID);
		this.checkCan('editroom', null, room);

		const [sourceCategory, destinationCategory] = target.split(',').map(toID);

		for (const category of [sourceCategory, destinationCategory]) {
			if (category in MAIN_CATEGORIES) {
				throw new Chat.ErrorMessage(`Main categories cannot be used with /trivia migrate. If you need to migrate to or from a main category, contact a technical Administrator.`);
			}
			if (!(category in ALL_CATEGORIES)) throw new Chat.ErrorMessage(`"${category}" is not a valid category`);
		}

		const sourceCategoryName = ALL_CATEGORIES[sourceCategory];
		const destinationCategoryName = ALL_CATEGORIES[destinationCategory];

		const command = `/trivia migrate ${sourceCategory}, ${destinationCategory}`;
		if (user.lastCommand !== command) {
			this.sendReply(`Are you SURE that you want to PERMANENTLY move all questions in the category ${sourceCategoryName} to ${destinationCategoryName}?`);
			this.sendReply(`This cannot be undone.`);
			this.sendReply(`Type the command again to confirm.`);

			user.lastCommand = command;
			return;
		}
		user.lastCommand = '';

		const numQs = await database.migrateCategory(sourceCategory, destinationCategory);
		this.modlog(`TRIVIAQUESTION MIGRATE`, null, `${sourceCategoryName} to ${destinationCategoryName}`);
		this.privateModAction(`${user.name} migrated all ${numQs} questions in the category ${sourceCategoryName} to ${destinationCategoryName}.`);
	},
	migratehelp: [
		`/trivia migrate [source category], [destination category] — Moves all questions in a category to another category. Requires: # ~`,
	],

	async edit(target, room, user) {
		room = this.requireRoom('questionworkshop' as RoomID);
		this.checkCan('mute', null, room);

		let isQuestionOnly = false;
		let isAnswersOnly = false;
		const args = target.split('|').map(arg => arg.trim());

		let oldQuestionText = args.shift();
		if (toID(oldQuestionText) === 'question') {
			isQuestionOnly = true;
			oldQuestionText = args.shift();
		} else if (toID(oldQuestionText) === 'answers') {
			isAnswersOnly = true;
			oldQuestionText = args.shift();
		}
		if (!oldQuestionText) return this.parse(`/help trivia edit`);

		const { category } = await database.ensureQuestionExists(Utils.escapeHTML(oldQuestionText));

		let newQuestionText: string | undefined;
		if (!isAnswersOnly) {
			newQuestionText = args.shift();
			if (!newQuestionText) {
				isAnswersOnly = true; // for modlog formatting
			} else {
				if (newQuestionText.length > MAX_QUESTION_LENGTH) {
					throw new Chat.ErrorMessage(`The new question text is too long. The limit is ${MAX_QUESTION_LENGTH} characters.`);
				}
			}
		}

		const answers: ID[] = [];
		if (!isQuestionOnly) {
			const answerArgs = args.shift();
			if (!answerArgs) {
				if (isAnswersOnly) throw new Chat.ErrorMessage(`You must specify new answers.`);
				isQuestionOnly = true; // for modlog formatting
			} else {
				for (const arg of answerArgs?.split(',') || []) {
					const answer = toID(arg);
					if (!answer) {
						throw new Chat.ErrorMessage(`Answers cannot be empty; double-check your syntax.`);
					}
					if (answer.length > MAX_ANSWER_LENGTH) {
						throw new Chat.ErrorMessage(`The answer '${answer}' is too long. The limit is ${MAX_ANSWER_LENGTH} characters.`);
					}
					if (answers.includes(answer)) {
						throw new Chat.ErrorMessage(`You may not specify duplicate answers.`);
					}
					answers.push(answer);
				}
			}
		}

		// We _could_ edit it in place but I think this isn't that much overhead and
		// it keeps the API simpler (we'd still have to SELECT from the questions table to get the ID,
		// and passing a SQLite ID around is an implementation detail).
		if (!isQuestionOnly && !answers.length) {
			throw new Chat.ErrorMessage(`You must specify at least one answer.`);
		}
		await database.editQuestion(
			Utils.escapeHTML(oldQuestionText),
			// Cast is safe because if `newQuestionText` is undefined, `isAnswersOnly` is true.
			isAnswersOnly ? undefined : Utils.escapeHTML(newQuestionText!),
			isQuestionOnly ? undefined : answers
		);

		let actionString = `edited question '${oldQuestionText}' in ${category}`;
		if (!isAnswersOnly) actionString += ` to '${newQuestionText}'`;
		if (answers.length) {
			actionString += ` and changed the answers to ${answers.join(', ')}`;
		}
		this.modlog('TRIVIAQUESTION EDIT', null, actionString);
		this.privateModAction(`${user.name} ${actionString}.`);
	},
	edithelp: [
		`/trivia edit <old question text> | <new question text> | <answer1, answer2, ...> - Edit a question in the trivia database, replacing answers if specified. Requires: % @ # ~`,
		`/trivia edit question | <old question text> | <new question text> - Alternative syntax for /trivia edit.`,
		`/trivia edit answers | <old question text> | <new answers> - Alternative syntax for /trivia edit.`,
	],

	async qs(target, room, user) {
		room = this.requireRoom('questionworkshop' as RoomID);

		let buffer = "|raw|<div class=\"ladder\" style=\"overflow-y: scroll; max-height: 300px;\"><table>";
		if (!target) {
			if (!this.runBroadcast()) return false;

			const counts = await database.getQuestionCounts();
			if (!counts.total) return this.sendReplyBox(this.tr`No questions have been submitted yet.`);

			buffer += `<tr><th>Category</th><th>${this.tr`Question Count`}</th></tr>`;
			// we want all the named categories and also all the categories in SQL, without duplication
			for (const category of new Set([...Object.keys(ALL_CATEGORIES), ...Object.keys(counts)])) {
				const name = ALL_CATEGORIES[category] || category;
				if (category === 'random' || category === 'total') continue;
				const tally = counts[category] || 0;
				buffer += `<tr><td>${name}</td><td>${tally} (${((tally * 100) / counts.total).toFixed(2)}%)</td></tr>`;
			}
			buffer += `<tr><td><strong>${this.tr`Total`}</strong></td><td><strong>${counts.total}</strong></td></table></div>`;

			return this.sendReply(buffer);
		}

		this.checkCan('mute', null, room);

		target = toID(target);
		const category = CATEGORY_ALIASES[target] || target;
		if (category === 'random') return false;
		if (!ALL_CATEGORIES[category]) {
			return this.errorReply(this.tr`'${target}' is not a valid category. View /help trivia for more information.`);
		}

		const list = await database.getQuestions([category], Number.MAX_SAFE_INTEGER, { order: 'oldestfirst' });
		if (!list.length) {
			buffer += `<tr><td>${this.tr`There are no questions in the ${ALL_CATEGORIES[category]} category.`}</td></table></div>`;
			return this.sendReply(buffer);
		}

		if (user.can('ban', null, room)) {
			const cat = ALL_CATEGORIES[category];
			buffer += `<tr><td colspan="3">${this.tr`There are <strong>${list.length}</strong> questions in the ${cat} category.`}</td></tr>` +
				`<tr><th>#</th><th>${this.tr`Question`}</th><th>${this.tr`Answer(s)`}</th></tr>`;
			for (const [i, entry] of list.entries()) {
				buffer += `<tr><td><strong>${(i + 1)}</strong></td><td>${entry.question}</td><td>${entry.answers.join(", ")}</td><tr>`;
			}
		} else {
			const cat = target;
			buffer += `<td colspan="2">${this.tr`There are <strong>${list.length}</strong> questions in the ${cat} category.`}</td></tr>` +
				`<tr><th>#</th><th>${this.tr`Question`}</th></tr>`;
			for (const [i, entry] of list.entries()) {
				buffer += `<tr><td><strong>${(i + 1)}</strong></td><td>${entry.question}</td></tr>`;
			}
		}
		buffer += "</table></div>";

		this.sendReply(buffer);
	},
	qshelp: [
		"/trivia qs - View the distribution of questions in the question database.",
		"/trivia qs [category] - View the questions in the specified category. Requires: % @ # ~",
	],

	cssearch: 'search',
	casesensitivesearch: 'search',
	doublespacesearch: 'search',
	async search(target, room, user, connection, cmd) {
		room = this.requireRoom('questionworkshop' as RoomID);
		this.checkCan('show', null, room);

		let type, query;
		if (cmd === 'doublespacesearch') {
			query = ['  '];
			type = target;
		} else {
			[type, ...query] = target.split(',');
			if (!target.includes(',')) return this.errorReply(this.tr`No valid search arguments entered.`);
		}

		type = toID(type);
		let options;

		if (/^q(?:uestion)?s?$/.test(type)) {
			options = { searchSubmissions: false, caseSensitive: cmd !== 'search' };
		} else if (/^sub(?:mission)?s?$/.test(type)) {
			options = { searchSubmissions: true, caseSensitive: cmd !== 'search' };
		} else {
			return this.sendReplyBox(
				this.tr`No valid search category was entered. Valid categories: submissions, subs, questions, qs`
			);
		}

		let queryString = query.join(',');
		if (cmd !== 'doublespacesearch') queryString = queryString.trim();
		if (!queryString) return this.errorReply(this.tr`No valid search query was entered.`);

		const results = await database.searchQuestions(queryString, options);
		if (!results.length) return this.sendReply(this.tr`No results found under the ${type} list.`);

		let buffer = `|raw|<div class="ladder"><table><tr><th>#</th><th>${this.tr`Category`}</th><th>${this.tr`Question`}</th></tr>` +
			`<tr><td colspan="3">${this.tr`There are <strong>${results.length}</strong> matches for your query:`}</td></tr>`;
		buffer += results.map(
			(q, i) => this.tr`<tr><td><strong>${i + 1}</strong></td><td>${q.category}</td><td>${q.question}</td></tr>`
		).join('');
		buffer += "</table></div>";

		this.sendReply(buffer);
	},
	searchhelp: [
		`/trivia search [type], [query] - Searches for questions based on their type and their query. This command is case-insensitive. Valid types: submissions, subs, questions, qs. Requires: + % @ * ~`,
		`/trivia casesensitivesearch [type], [query] - Like /trivia search, but is case sensitive (capital letters matter). Requires: + % @ * ~`,
		`/trivia doublespacesearch [type] — Searches for questions with back-to-back space characters. Requires: + % @ * ~`,
	],

	async moveusedevent(target, room, user) {
		room = this.requireRoom('questionworkshop' as RoomID);
		const fromCatName = ALL_CATEGORIES[MOVE_QUESTIONS_AFTER_USE_FROM_CATEGORY];
		const toCatName = ALL_CATEGORIES[MOVE_QUESTIONS_AFTER_USE_TO_CATEGORY];
		const currentSetting = await database.shouldMoveEventQuestions();

		if (target) {
			this.checkCan('editroom', null, room);

			const isEnabling = this.meansYes(target);
			if (isEnabling) {
				if (currentSetting) throw new Chat.ErrorMessage(`Moving used event questions is already enabled.`);
				await database.setShouldMoveEventQuestions(true);
			} else if (this.meansNo(target)) {
				if (!currentSetting) throw new Chat.ErrorMessage(`Moving used event questions is already disabled.`);
				await database.setShouldMoveEventQuestions(false);
			} else {
				return this.parse(`/help trivia moveusedevent`);
			}

			this.modlog(`TRIVIA MOVE USED EVENT QUESTIONS`, null, isEnabling ? 'ON' : 'OFF');
			this.sendReply(
				`Trivia questions in the ${fromCatName} category will ${isEnabling ? 'now' : 'no longer'} be moved to the ${toCatName} category after they are used.`
			);
		} else {
			this.sendReply(
				currentSetting ?
					`Trivia questions in the ${fromCatName} category will be moved to the ${toCatName} category after use.` :
					`Moving event questions after usage is currently disabled.`
			);
		}
	},
	moveusedeventhelp: [
		`/trivia moveusedevent - Tells you whether or not moving used event questions to a different category is enabled.`,
		`/trivia moveusedevent [on or off] - Toggles moving used event questions to a different category. Requires: # ~`,
	],

	async rank(target, room, user) {
		room = this.requireRoom('trivia' as RoomID);
		this.runBroadcast();

		let name;
		let userid;
		if (!target) {
			name = Utils.escapeHTML(user.name);
			userid = user.id;
		} else {
			name = Utils.escapeHTML(target);
			userid = toID(target);
		}

		const allTimeScore = await database.getLeaderboardEntry(userid, 'alltime');
		if (!allTimeScore) return this.sendReplyBox(this.tr`User '${name}' has not played any Trivia games yet.`);
		const score = (
			await database.getLeaderboardEntry(userid, 'nonAlltime') ||
			{ score: 0, totalPoints: 0, totalCorrectAnswers: 0 }
		);
		const cycleScore = await database.getLeaderboardEntry(userid, 'cycle');

		const ranks = (await cachedLadder.get('nonAlltime'))?.ranks[userid];
		const allTimeRanks = (await cachedLadder.get('alltime'))?.ranks[userid];
		const cycleRanks = (await cachedLadder.get('cycle'))?.ranks[userid];

		function display(
			scores: TriviaLeaderboardScore | null,
			ranking: TriviaLeaderboardScore | undefined,
			key: keyof TriviaLeaderboardScore,
		) {
			if (!scores?.[key]) return `<td>N/A</td>`;
			return Utils.html`<td>${scores[key]}${ranking?.[key] ? ` (rank ${ranking[key]})` : ``}</td>`;
		}

		this.sendReplyBox(
			`<div class="ladder"><table>` +
			`<tr><th>${name}</th><th>Cycle Ladder</th><th>All-time Score Ladder</th><th>All-time Wins Ladder</th></tr>` +
			`<tr><td>Leaderboard score</td>` +
			display(cycleScore, cycleRanks, 'score') +
			display(score, ranks, 'score') +
			display(allTimeScore, allTimeRanks, 'score') +
			`</tr>` +
			`<tr><td>Total game points</td>` +
			display(cycleScore, cycleRanks, 'totalPoints') +
			display(score, ranks, 'totalPoints') +
			display(allTimeScore, allTimeRanks, 'totalPoints') +
			`</tr>` +
			`<tr><td>Total correct answers</td>` +
			display(cycleScore, cycleRanks, 'totalCorrectAnswers') +
			display(score, ranks, 'totalCorrectAnswers') +
			display(allTimeScore, allTimeRanks, 'totalCorrectAnswers') +
			`</tr>` +
			`</table></div>`
		);
	},
	rankhelp: [`/trivia rank [username] - View the rank of the specified user. If no name is given, view your own.`],

	alltimescoreladder: 'ladder',
	scoreladder: 'ladder',
	winsladder: 'ladder',
	alltimewinsladder: 'ladder',
	async ladder(target, room, user, connection, cmd) {
		room = this.requireRoom('trivia' as RoomID);
		if (!this.runBroadcast()) return false;

		let leaderboard: Leaderboard = 'cycle';
		// TODO: rename leaderboards in the code once the naming scheme has been stable for a few months
		if (cmd.includes('wins')) leaderboard = 'alltime';
		if (cmd.includes('score')) leaderboard = 'nonAlltime';

		const ladder = (await cachedLadder.get(leaderboard))?.ladder;
		if (!ladder?.length) return this.errorReply(this.tr`No Trivia games have been played yet.`);

		let buffer = "|raw|<div class=\"ladder\" style=\"overflow-y: scroll; max-height: 300px;\"><table>" +
			`<tr><th>${this.tr`Rank`}</th><th>${this.tr`User`}</th><th>${this.tr`Leaderboard score`}</th><th>${this.tr`Total game points`}</th><th>${this.tr`Total correct answers`}</th></tr>`;
		let num = parseInt(target);
		if (!num || num < 0) num = 100;
		if (num > ladder.length) num = ladder.length;
		for (let i = Math.max(0, num - 100); i < num; i++) {
			const leaders = ladder[i];
			for (const leader of leaders) {
				const rank = await database.getLeaderboardEntry(leader, leaderboard);
				if (!rank) continue; // should never happen
				const leaderObj = Users.getExact(leader as unknown as string);
				const leaderid = leaderObj ? Utils.escapeHTML(leaderObj.name) : leader as unknown as string;
				buffer += `<tr><td><strong>${(i + 1)}</strong></td><td>${leaderid}</td><td>${rank.score}</td><td>${rank.totalPoints}</td><td>${rank.totalCorrectAnswers}</td></tr>`;
			}
		}
		buffer += "</table></div>";

		return this.sendReply(buffer);
	},
	ladderhelp: [
		`/trivia ladder [n] - Displays the top [n] users on the cycle-specific Trivia leaderboard. If [n] isn't specified, shows 100 users.`,
		`/trivia alltimewinsladder [n] - Like /trivia ladder, but displays the all-time Trivia leaderboard.`,
		`/trivia alltimescoreladder [n] - Like /trivia ladder, but displays the Trivia leaderboard which is neither all-time nor cycle-specific.`,
	],

	resetladder: 'resetcycleleaderboard',
	resetcycleladder: 'resetcycleleaderboard',
	async resetcycleleaderboard(target, room, user) {
		room = this.requireRoom('trivia' as RoomID);
		this.checkCan('editroom', null, room);

		if (user.lastCommand !== '/trivia resetcycleleaderboard') {
			user.lastCommand = '/trivia resetcycleleaderboard';
			this.errorReply(`Are you sure you want to reset the Trivia cycle-specific leaderboard? This action is IRREVERSIBLE.`);
			this.errorReply(`To confirm, retype the command.`);
			return;
		}
		user.lastCommand = '';

		await database.clearCycleLeaderboard();
		this.privateModAction(`${user.name} reset the cycle-specific Trivia leaderboard.`);
		this.modlog('TRIVIA LEADERBOARDRESET', null, 'cycle-specific leaderboard');
	},
	resetcycleleaderboardhelp: [`/trivia resetcycleleaderboard - Resets the cycle-specific Trivia leaderboard. Requires: # ~`],

	clearquestions: 'clearqs',
	async clearqs(target, room, user) {
		room = this.requireRoom('questionworkshop' as RoomID);
		this.checkCan('declare', null, room);
		target = toID(target);
		const category = CATEGORY_ALIASES[target] || target;
		if (ALL_CATEGORIES[category]) {
			if (SPECIAL_CATEGORIES[category]) {
				await database.clearCategory(category);
				this.modlog(`TRIVIA CATEGORY CLEAR`, null, SPECIAL_CATEGORIES[category]);
				return this.privateModAction(room.tr`${user.name} removed all questions of category '${category}'.`);
			} else {
				return this.errorReply(this.tr`You cannot clear the category '${ALL_CATEGORIES[category]}'.`);
			}
		} else {
			return this.errorReply(this.tr`'${category}' is an invalid category.`);
		}
	},
	clearqshelp: [`/trivia clearqs [category] - Remove all questions of the given category. Requires: # ~`],

	pastgames: 'history',
	async history(target, room, user) {
		room = this.requireRoom('trivia' as RoomID);
		if (!this.runBroadcast()) return false;

		let lines = 10;
		if (target) {
			lines = parseInt(target);
			if (lines < 1 || lines > 100 || isNaN(lines)) {
				throw new Chat.ErrorMessage(`You must specify a number of games to view the history of between 1 and 100.`);
			}
		}
		const games = await database.getHistory(lines);
		const buf = [];
		for (const [i, game] of games.entries()) {
			let gameInfo = Utils.html`<b>${i + 1}.</b> ${this.tr`${game.mode} mode, ${game.length} length Trivia game in the ${game.category} category`}`;
			if (game.creator) gameInfo += Utils.html` ${this.tr`hosted by ${game.creator}`}`;
			gameInfo += '.';
			buf.push(gameInfo);
		}

		return this.sendReplyBox(buf.join('<br />'));
	},
	historyhelp: [`/trivia history [n] - View a list of the n most recently played trivia games. Defaults to 10.`],

	async lastofficialscore(target, room, user) {
		room = this.requireRoom('trivia' as RoomID);
		this.runBroadcast();

		const scores = Object.entries(await database.getScoresForLastGame())
			.map(([userid, score]) => `${userid} (${score})`)
			.join(', ');
		this.sendReplyBox(`The scores for the last Trivia game are: ${scores}`);
	},
	lastofficialscorehelp: [`/trivia lastofficialscore - View the scores from the last Trivia game. Intended for bots.`],

	removepoints: 'addpoints',
	async addpoints(target, room, user, connection, cmd) {
		room = this.requireRoom('trivia' as RoomID);
		this.checkCan('editroom', null, room);

		const [userid, pointString] = this.splitOne(target).map(toID);

		const points = parseInt(pointString);
		if (isNaN(points)) return this.errorReply(`You must specify a number of points to add/remove.`);
		const isRemoval = cmd === 'removepoints';

		const change = { score: isRemoval ? -points : points, totalPoints: 0, totalCorrectAnswers: 0 };
		await database.updateLeaderboardForUser(userid, {
			alltime: change,
			nonAlltime: change,
			cycle: change,
		});
		cachedLadder.invalidateCache();

		this.modlog(`TRIVIAPOINTS ${isRemoval ? 'REMOVE' : 'ADD'}`, userid, `${points} points`);
		this.privateModAction(
			isRemoval ?
				`${user.name} removed ${points} points from ${userid}'s Trivia leaderboard score.` :
				`${user.name} added ${points} points to ${userid}'s Trivia leaderboard score.`
		);
	},
	addpointshelp: [
		`/trivia removepoints [user], [points] - Remove points from a given user's score on the Trivia leaderboard.`,
		`/trivia addpoints [user], [points] - Add points to a given user's score on the Trivia leaderboard.`,
		`Requires: # ~`,
	],

	async removeleaderboardentry(target, room, user) {
		room = this.requireRoom('trivia' as RoomID);
		this.checkCan('editroom', null, room);

		const userid = toID(target);
		if (!userid) return this.parse('/help trivia removeleaderboardentry');
		if (!(await database.getLeaderboardEntry(userid, 'alltime'))) {
			return this.errorReply(`The user '${userid}' has no Trivia leaderboard entry.`);
		}

		const command = `/trivia removeleaderboardentry ${userid}`;
		if (user.lastCommand !== command) {
			user.lastCommand = command;
			this.sendReply(`Are you sure you want to DELETE ALL LEADERBOARD SCORES FOR '${userid}'?`);
			this.sendReply(`If so, type ${command} to confirm.`);
			return;
		}
		user.lastCommand = '';

		await Promise.all(
			(Object.keys(LEADERBOARD_ENUM) as Leaderboard[])
				.map(lb => database.deleteLeaderboardEntry(userid, lb))
		);
		cachedLadder.invalidateCache();

		this.modlog(`TRIVIAPOINTS DELETE`, userid);
		this.privateModAction(`${user.name} removed ${userid}'s Trivia leaderboard entries.`);
	},
	removeleaderboardentryhelp: [
		`/trivia removeleaderboardentry [user] — Remove all leaderboard entries for a user. Requires: # ~`,
	],

	mergealt: 'mergescore',
	mergescores: 'mergescore',
	async mergescore(target, room, user) {
		const altid = toID(target);
		if (!altid) return this.parse('/help trivia mergescore');

		try {
			await mergeAlts(user.id, altid);
			return this.sendReply(`Your Trivia leaderboard score has been transferred to '${altid}'!`);
		} catch (err: any) {
			if (!err.message.includes('/trivia mergescore')) throw err;

			await requestAltMerge(altid, user.id);
			return this.sendReply(
				`A Trivia leaderboard score merge with ${altid} is now pending! ` +
				`To complete the merge, log in on the account '${altid}' and type /trivia mergescore ${user.id}`
			);
		}
	},
	mergescorehelp: [
		`/trivia mergescore [user] — Merge another user's Trivia leaderboard score with yours.`,
	],

	help(target, room, user) {
		return this.parse(`${this.cmdToken}help trivia`);
	},
	triviahelp() {
		this.sendReply(
			`|html|<div class="infobox">` +
			`<strong>Categories</strong>: <code>Arts &amp; Entertainment</code>, <code>Pok&eacute;mon</code>, <code>Science &amp; Geography</code>, <code>Society &amp; Humanities</code>, <code>Random</code>, and <code>All</code>.<br />` +
			`<details><summary><strong>Modes</strong></summary><ul>` +
			`	<li>First: the first correct responder gains 5 points.</li>` +
			`	<li>Timer: each correct responder gains up to 5 points based on how quickly they answer.</li>` +
			`	<li>Number: each correct responder gains up to 5 points based on how many participants are correct.</li>` +
			`	<li>Triumvirate: The first correct responder gains 5 points, the second 3 points, and the third 1 point.</li>` +
			`	<li>Random: randomly chooses one of First, Timer, Number, or Triumvirate.</li>` +
			`</ul></details>` +
			`<details><summary><strong>Game lengths</strong></summary><ul>` +
			`	<li>Short: 20 point score cap. The winner gains 3 leaderboard points.</li>` +
			`	<li>Medium: 35 point score cap. The winner gains 4 leaderboard points.</li>` +
			`	<li>Long: 50 point score cap. The winner gains 5 leaderboard points.</li>` +
			`	<li>Infinite: No score cap. The winner gains 5 leaderboard points, which increases the more questions they answer.</li>` +
			`	<li>You may also specify a number for length; in this case, the game will end after that number of questions have been asked.</li>` +
			`</ul></details>` +
			`<details><summary><strong>Game commands</strong></summary><ul>` +
			`	<li><code>/trivia new [mode], [categories], [length]</code> - Begin signups for a new Trivia game. <code>[categories]</code> can be either one category, or a <code>+</code>-separated list of categories. Requires: + % @ # ~</li>` +
			`	<li><code>/trivia unrankednew [mode], [category], [length]</code> - Begin a new Trivia game that does not award leaderboard points. Requires: + % @ # ~</li>` +
			`	<li><code>/trivia sortednew [mode], [category], [length]</code> — Begin a new Trivia game in which the question order is not randomized. Requires: + % @ # ~</li>` +
			`	<li><code>/trivia join</code> - Join a game of Trivia or Mastermind during signups.</li>` +
			`	<li><code>/trivia start</code> - Begin the game once enough users have signed up. Requires: + % @ # ~</li>` +
			`	<li><code>/ta [answer]</code> - Answer the current question.</li>` +
			`	<li><code>/trivia kick [username]</code> - Disqualify a participant from the current trivia game. Requires: % @ # ~</li>` +
			`	<li><code>/trivia leave</code> - Makes the player leave the game.</li>` +
			`	<li><code>/trivia end</code> - End a trivia game. Requires: + % @ # ~</li>` +
			`	<li><code>/trivia win</code> - End a trivia game and tally the points to find winners. Requires: + % @ # ~ in Infinite length, else # ~</li>` +
			`	<li><code>/trivia pause</code> - Pauses a trivia game. Requires: + % @ # ~</li>` +
			`	<li><code>/trivia resume</code> - Resumes a paused trivia game. Requires: + % @ # ~</li>` +
			`</ul></details>` +
			`	<details><summary><strong>Question-modifying commands</strong></summary><ul>` +
			`	<li><code>/trivia submit [category] | [question] | [answer1], [answer2] ... [answern]</code> - Adds question(s) to the submission database for staff to review. Requires: + % @ # ~</li>` +
			`	<li><code>/trivia review</code> - View the list of submitted questions. Requires: @ # ~</li>` +
			`	<li><code>/trivia accept [index1], [index2], ... [indexn] OR all</code> - Add questions from the submission database to the question database using their index numbers or ranges of them. Requires: @ # ~</li>` +
			`	<li><code>/trivia reject [index1], [index2], ... [indexn] OR all</code> - Remove questions from the submission database using their index numbers or ranges of them. Requires: @ # ~</li>` +
			`	<li><code>/trivia add [category] | [question] | [answer1], [answer2], ... [answern]</code> - Adds question(s) to the question database. Requires: % @ # ~</li>` +
			`	<li><code>/trivia delete [question]</code> - Delete a question from the trivia database. Requires: % @ # ~</li>` +
			`	<li><code>/trivia move [category] | [question]</code> - Change the category of question in the trivia database. Requires: % @ # ~</li>` +
			`	<li><code>/trivia migrate [source category], [destination category]</code> — Moves all questions in a category to another category. Requires: # ~</li>` +
			Utils.html`<li><code>${'/trivia edit <old question text> | <new question text> | <answer1, answer2, ...>'}</code>: Edit a question in the trivia database, replacing answers if specified. Requires: % @ # ~` +
			Utils.html`<li><code>${'/trivia edit answers | <old question text> | <new answers>'}</code>: Replaces the answers of a question. Requires: % @ # ~</li>` +
			Utils.html`<li><code>${'/trivia edit question | <old question text> | <new question text>'}</code>: Edits only the text of a question. Requires: % @ # ~</li>` +
			`	<li><code>/trivia qs</code> - View the distribution of questions in the question database.</li>` +
			`	<li><code>/trivia qs [category]</code> - View the questions in the specified category. Requires: % @ # ~</li>` +
			`	<li><code>/trivia clearqs [category]</code> - Clear all questions in the given category. Requires: # ~</li>` +
			`	<li><code>/trivia moveusedevent</code> - Tells you whether or not moving used event questions to a different category is enabled.</li>` +
			`	<li><code>/trivia moveusedevent [on or off]</code> - Toggles moving used event questions to a different category. Requires: # ~</li>` +
			`</ul></details>` +
			`<details><summary><strong>Informational commands</strong></summary><ul>` +
			`	<li><code>/trivia search [type], [query]</code> - Searches for questions based on their type and their query. Valid types: <code>submissions</code>, <code>subs</code>, <code>questions</code>, <code>qs</code>. Requires: + % @ # ~</li>` +
			`	<li><code>/trivia casesensitivesearch [type], [query]</code> - Like <code>/trivia search</code>, but is case sensitive (i.e., capitalization matters). Requires: + % @ * ~</li>` +
			`	<li><code>/trivia status [player]</code> - lists the player's standings (your own if no player is specified) and the list of players in the current trivia game.</li>` +
			`	<li><code>/trivia rank [username]</code> - View the rank of the specified user. If none is given, view your own.</li>` +
			`	<li><code>/trivia history</code> - View a list of the 10 most recently played trivia games.</li>` +
			`	<li><code>/trivia lastofficialscore</code> - View the scores from the last Trivia game. Intended for bots.</li>` +
			`</ul></details>` +
			`<details><summary><strong>Leaderboard commands</strong></summary><ul>` +
			`	<li><code>/trivia ladder [n]</code> - Displays the top <code>[n]</code> users on the cycle-specific Trivia leaderboard. If <code>[n]</code> isn't specified, shows 100 users.</li>` +
			`	<li><code>/trivia alltimewinsladder</code> - Like <code>/trivia ladder</code>, but displays the all-time wins Trivia leaderboard (formerly all-time).</li>` +
			`	<li><code>/trivia alltimescoreladder</code> - Like <code>/trivia ladder</code>, but displays the all-time score Trivia leaderboard (formerly non—all-time)</li>` +
			`	<li><code>/trivia resetcycleleaderboard</code> - Resets the cycle-specific Trivia leaderboard. Requires: # ~` +
			`	<li><code>/trivia mergescore [user]</code> — Merge another user's Trivia leaderboard score with yours.</li>` +
			`	<li><code>/trivia addpoints [user], [points]</code> - Add points to a given user's score on the Trivia leaderboard. Requires: # ~</li>` +
			`	<li><code>/trivia removepoints [user], [points]</code> - Remove points from a given user's score on the Trivia leaderboard. Requires: # ~</li>` +
			`	<li><code>/trivia removeleaderboardentry [user]</code> — Remove all Trivia leaderboard entries for a user. Requires: # ~</li>` +
			`</ul></details>`
		);
	},
};

const mastermindCommands: Chat.ChatCommands = {
	answer: triviaCommands.answer,
	end: triviaCommands.end,
	kick: triviaCommands.kick,

	new(target, room, user) {
		room = this.requireRoom('trivia' as RoomID);
		this.checkCan('show', null, room);

		const finalists = parseInt(target);
		if (isNaN(finalists) || finalists < 2) {
			return this.errorReply(this.tr`You must specify a number that is at least 2 for finalists.`);
		}

		room.game = new Mastermind(room, finalists);
	},
	newhelp: [
		`/mastermind new [number of finalists] — Starts a new game of Mastermind with the specified number of finalists. Requires: + % @ # ~`,
	],

	async start(target, room, user) {
		room = this.requireRoom();
		this.checkCan('show', null, room);
		this.checkChat();
		const game = getMastermindGame(room);

		let [category, timeoutString, player] = target.split(',').map(toID);
		if (!player) return this.parse(`/help mastermind start`);

		category = CATEGORY_ALIASES[category] || category;
		if (!(category in ALL_CATEGORIES)) {
			return this.errorReply(this.tr`${category} is not a valid category.`);
		}
		const categoryName = ALL_CATEGORIES[category];
		const timeout = parseInt(timeoutString);
		if (isNaN(timeout) || timeout < 1 || (timeout * 1000) > Chat.MAX_TIMEOUT_DURATION) {
			return this.errorReply(this.tr`You must specify a round length of at least 1 second.`);
		}

		const questions = await getQuestions([category], 'random');
		if (!questions.length) {
			return this.errorReply(this.tr`There are no questions in the ${categoryName} category.`);
		}

		game.startRound(player, category, questions, timeout);
	},
	starthelp: [
		`/mastermind start [category], [length in seconds], [player] — Starts a round of Mastermind for a player. Requires: + % @ # ~`,
	],

	async finals(target, room, user) {
		room = this.requireRoom();
		this.checkCan('show', null, room);
		this.checkChat();
		const game = getMastermindGame(room);
		if (!target) return this.parse(`/help mastermind finals`);

		const timeout = parseInt(target);
		if (isNaN(timeout) || timeout < 1 || (timeout * 1000) > Chat.MAX_TIMEOUT_DURATION) {
			return this.errorReply(this.tr`You must specify a length of at least 1 second.`);
		}

		await game.startFinals(timeout);
	},
	finalshelp: [`/mastermind finals [length in seconds] — Starts the Mastermind finals. Requires: + % @ # ~`],

	join(target, room, user) {
		room = this.requireRoom();
		getMastermindGame(room).addTriviaPlayer(user);
		this.sendReply(this.tr`You are now signed up for this game!`);
	},
	joinhelp: [`/mastermind join — Joins the current game of Mastermind.`],

	leave(target, room, user) {
		getMastermindGame(room).leave(user);
		this.sendReply(this.tr`You have left the current game of Mastermind.`);
	},
	leavehelp: [`/mastermind leave - Makes the player leave the game.`],

	pass(target, room, user) {
		room = this.requireRoom();
		const round = getMastermindGame(room).currentRound;
		if (!round) return this.errorReply(this.tr`No round of Mastermind is currently being played.`);
		if (!(user.id in round.playerTable)) {
			return this.errorReply(this.tr`You are not a player in the current round of Mastermind.`);
		}
		round.pass();
	},
	passhelp: [`/mastermind pass — Passes on the current question. Must be the player of the current round of Mastermind.`],

	'': 'players',
	players(target, room, user) {
		room = this.requireRoom();
		if (!this.runBroadcast()) return false;
		const game = getMastermindGame(room);

		let buf = this.tr`There is a Mastermind game in progress, and it is in its ${game.phase} phase.`;
		buf += `<br /><hr>${this.tr`Players`}: ${game.formatPlayerList()}`;

		this.sendReplyBox(buf);
	},

	help() {
		return this.parse(`${this.cmdToken}help mastermind`);
	},

	mastermindhelp() {
		if (!this.runBroadcast()) return;
		const commandHelp = [
			`<code>/mastermind new [number of finalists]</code>: starts a new game of Mastermind with the specified number of finalists. Requires: + % @ # ~`,
			`<code>/mastermind start [category], [length in seconds], [player]</code>: starts a round of Mastermind for a player. Requires: + % @ # ~`,
			`<code>/mastermind finals [length in seconds]</code>: starts the Mastermind finals. Requires: + % @ # ~`,
			`<code>/mastermind kick [user]</code>: kicks a user from the current game of Mastermind. Requires: % @ # ~`,
			`<code>/mastermind join</code>: joins the current game of Mastermind.`,
			`<code>/mastermind answer OR /mma [answer]</code>: answers a question in a round of Mastermind.`,
			`<code>/mastermind pass OR /mmp</code>: passes on the current question. Must be the player of the current round of Mastermind.`,
		];
		return this.sendReplyBox(
			`<strong>Mastermind</strong> is a game in which each player tries to score as many points as possible in a timed round where only they can answer, ` +
			`and the top X players advance to the finals, which is a timed game of Trivia in which only the first player to answer a question recieves points.` +
			`<details><summary><strong>Commands</strong></summary>${commandHelp.join('<br />')}</details>`
		);
	},
};

export const commands: Chat.ChatCommands = {
	mm: mastermindCommands,
	mastermind: mastermindCommands,
	mastermindhelp: mastermindCommands.mastermindhelp,
	mma: mastermindCommands.answer,
	mmp: mastermindCommands.pass,
	trivia: triviaCommands,
	ta: triviaCommands.answer,
	triviahelp: triviaCommands.triviahelp,
};

process.nextTick(() => {
	Chat.multiLinePattern.register('/trivia add ', '/trivia submit ', '/trivia move ');
});
