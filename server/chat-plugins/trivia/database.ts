/**
 * Manages the Trivia database.
 *
 * @author Annika
 */

import type {
	TriviaGame, TriviaHistory, TriviaLeaderboardData, TriviaLeaderboardScore, TriviaQuestion,
} from "./trivia";
import { FS } from "../../../lib";
import { formatSQLArray } from "../../../lib/utils";
import type { Statement } from "../../../lib/sql";

export type Leaderboard = 'alltime' | 'nonAlltime' | 'cycle';
/**
 * Keys are different Trivia leaderboards.
 * Values are the corresponding integer values of the SQLite `leaderboard` column.
 */
export const LEADERBOARD_ENUM: Record<Leaderboard, number> = {
	alltime: 1,
	nonAlltime: 0,
	cycle: 2,
};

type TriviaLeaderboards = Record<Leaderboard, TriviaLeaderboardData>;

export interface TriviaDatabase {
	updateLeaderboardForUser(
		userid: ID,
		additions: Record<Leaderboard, TriviaLeaderboardScore>
	): Promise<void> | void;
	addHistory(history: Iterable<TriviaHistory>): Promise<void> | void;
	addQuestions(questions: Iterable<TriviaQuestion>): Promise<void> | void;
	addQuestionSubmissions(questions: Iterable<TriviaQuestion>): Promise<void> | void;
	setShouldMoveEventQuestions(shouldMove: boolean): Promise<void> | void;
	mergeLeaderboardEntries(from: ID, to: ID): Promise<void> | void;

	shouldMoveEventQuestions(): Promise<boolean> | boolean;
	moveQuestionToCategory(question: string, newCategory: string): Promise<void> | void;
	migrateCategory(sourceCategory: string, targetCategory: string): Promise<number> | number;
	acceptSubmissions(submissions: string[]): Promise<void> | void;
	editQuestion(oldQuestionText: string, newQuestionText?: string, newAnswers?: string[]): Promise<void>;

	getHistory(numberOfLines: number): Promise<TriviaGame[]> | TriviaGame[];
	getScoresForLastGame(): Promise<{ [k: string]: number }> | { [k: string]: number };
	getQuestions(
		categories: string[] | 'all',
		limit: number,
		options: { order: 'newestfirst' | 'oldestfirst' | 'random' }
	): Promise<TriviaQuestion[]> | TriviaQuestion[];
	getLeaderboardEntry(
		id: ID,
		leaderboard: Leaderboard
	): Promise<TriviaLeaderboardScore | null> | TriviaLeaderboardScore | null;
	getLeaderboards(): Promise<TriviaLeaderboards> | TriviaLeaderboards;

	getQuestion(questionText: string): Promise<TriviaQuestion | null> | TriviaQuestion | null;
	ensureQuestionExists(questionText: string): Promise<TriviaQuestion> | TriviaQuestion;
	ensureQuestionDoesNotExist(questionText: string): Promise<void> | void;
	getSubmissions(): Promise<TriviaQuestion[]> | TriviaQuestion[];
	getQuestionCounts(): Promise<{ [k: string]: number, total: number }> | { [k: string]: number, total: number };
	searchQuestions(
		search: string,
		options: { searchSubmissions: boolean, caseSensitive?: boolean }
	): Promise<TriviaQuestion[]> | TriviaQuestion[];

	clearSubmissions(): Promise<void> | void;
	clearCategory(category: string): Promise<void> | void;
	clearCycleLeaderboard(): Promise<void> | void;
	deleteQuestion(questionText: string): Promise<void> | void;
	deleteLeaderboardEntry(userid: ID, leaderboard: Leaderboard): Promise<void> | void;
	deleteSubmissions(submissions: string[]): Promise<void> | void;
	start(): void;
}

export class TriviaSQLiteDatabase implements TriviaDatabase {
	readyPromise: Promise<void> | null;

	private legacyJSONPath?: string;

	// adding data
	private leaderboardInsertion: Statement | null;
	private questionInsertion: Statement | null;
	private answerInsertion: Statement | null;
	private gameHistoryInsertion: Statement | null;
	private scoreHistoryInsertion: Statement | null;
	private updateMoveEventQuestions: Statement | null;

	// modifying data
	private categoryChangeQuery: Statement | null;
	private leaderboardChangeQuery: Statement | null;
	private migrateCategoryQuery: Statement | null;

	// fetching data
	private historyQuery: Statement | null;
	private historyScoresQuery: Statement | null;
	private allQuestionsRandomOrderQuery: Statement | null;
	private allQuestionsNewestFirstQuery: Statement | null;
	private allQuestionsOldestFirstQuery: Statement | null;
	private answersQuery: Statement | null;
	private submissionsQuery: Statement | null;
	private leaderboardQuery: Statement | null;
	private leaderboardByUserQuery: Statement | null;
	private scoreAndPointsByUser: Statement | null;
	private eventQuestionQuery: Statement | null;
	private categoriesQuery: Statement | null;
	private questionCountQuery: Statement | null;
	private categoryQuestionCountQuery: Statement | null;
	private questionSearchQuery: Statement | null;
	private questionExistsQuery: Statement | null;

	// deleting data
	private clearAllSubmissionsQuery: Statement | null;
	private clearCategoryQuery: Statement | null;
	private clearCycleLeaderboardQuery: Statement | null;
	private deleteQuestionQuery: Statement | null;
	private leaderboardDeletionQuery: Statement | null;

	constructor(legacyJSONPath?: string) {
		this.legacyJSONPath = legacyJSONPath;

		this.leaderboardInsertion = null;
		this.questionInsertion = null;
		this.answerInsertion = null;
		this.gameHistoryInsertion = null;
		this.scoreHistoryInsertion = null;
		this.updateMoveEventQuestions = null;

		this.categoryChangeQuery = null;
		this.leaderboardChangeQuery = null;
		this.migrateCategoryQuery = null;

		this.historyQuery = null;
		this.historyScoresQuery = null;
		this.allQuestionsRandomOrderQuery = null;
		this.allQuestionsNewestFirstQuery = null;
		this.allQuestionsOldestFirstQuery = null;
		this.answersQuery = null;
		this.submissionsQuery = null;
		this.leaderboardQuery = null;
		this.leaderboardByUserQuery = null;
		this.scoreAndPointsByUser = null;
		this.eventQuestionQuery = null;
		this.categoriesQuery = null;
		this.questionCountQuery = null;
		this.categoryQuestionCountQuery = null;
		this.questionSearchQuery = null;
		this.questionExistsQuery = null;

		this.clearAllSubmissionsQuery = null;
		this.clearCategoryQuery = null;
		this.clearCycleLeaderboardQuery = null;
		this.deleteQuestionQuery = null;
		this.leaderboardDeletionQuery = null;

		this.readyPromise = null;
	}

	start() {
		this.readyPromise = this.prepareStatements().then(() => {
			void this.convertLegacyJSON();
			this.readyPromise = null;
		});
	}

	/***************************
	 * Methods for adding data *
	 ***************************/
	async updateLeaderboardForUser(
		userid: ID,
		additions: Record<Leaderboard, TriviaLeaderboardScore>,
	): Promise<void> {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't update the leaderboard for ${userid} because SQLite is not enabled.`);
		}

		for (const [lb, discrim] of Object.entries(LEADERBOARD_ENUM) as [Leaderboard, number][]) {
			if (!additions[lb]) continue;
			await this.leaderboardChangeQuery!.run({
				score: additions[lb].score,
				totalPoints: additions[lb].totalPoints,
				totalCorrectAnswers: additions[lb].totalCorrectAnswers,
				userid,
				leaderboard: discrim,
			});
		}
	}

	async addHistory(history: Iterable<TriviaHistory>) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't add a Trivia game to the history because SQLite is not enabled.`);
		}

		const res = await Chat.database.transaction('addHistory', {
			history,
			gameHistoryInsertion: this.gameHistoryInsertion!.toString(),
			scoreHistoryInsertion: this.scoreHistoryInsertion!.toString(),
		});
		if (!res) throw new Error(`Error updating Trivia history.`);
	}

	async addQuestions(questions: Iterable<TriviaQuestion>) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't add a Trivia question because SQLite is not enabled.`);
		}

		const res = await Chat.database.transaction('addQuestions', {
			questions,
			questionInsertion: this.questionInsertion!.toString(),
			answerInsertion: this.answerInsertion!.toString(),
			isSubmission: false,
		});
		if (!res) throw new Chat.ErrorMessage(`Error adding Trivia questions.`);
	}

	async addQuestionSubmissions(questions: Iterable<TriviaQuestion>) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't submit a Trivia question for review because SQLite is not enabled.`);
		}

		const res = await Chat.database.transaction('addQuestions', {
			questions,
			questionInsertion: this.questionInsertion!.toString(),
			answerInsertion: this.answerInsertion!.toString(),
			isSubmission: true,
		});
		if (!res) throw new Chat.ErrorMessage(`Error adding Trivia questions for review.`);
	}

	async setShouldMoveEventQuestions(shouldMove: boolean) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't enable/disable moving event questions because SQLite is not enabled.`);
		}

		await this.updateMoveEventQuestions!.run([Number(shouldMove)]);
	}

	/******************************
	 * Methods for modifying data *
	 ******************************/
	async mergeLeaderboardEntries(from: ID, to: ID) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't merge ${from} and ${to}'s Trivia leaderboard entries because SQLite is not enabled.`);
		}

		for (const lbDiscrim of Object.values(LEADERBOARD_ENUM)) {
			const fromScores = await this.scoreAndPointsByUser!.get([from, lbDiscrim]) || {
				score: 0,
				totalCorrectAnswers: 0,
				totalPoints: 0,
			};
			const toScores = (await this.scoreAndPointsByUser!.get([to, lbDiscrim])) || {
				score: 0,
				totalCorrectAnswers: 0,
				totalPoints: 0,
			};

			toScores.score += fromScores.score;
			toScores.totalCorrectAnswers += fromScores.totalCorrectAnswers;
			toScores.totalPoints += fromScores.totalPoints;

			await Chat.database.run(
				this.leaderboardInsertion!,
				[to, toScores.score, toScores.totalPoints, toScores.totalCorrectAnswers, lbDiscrim]
			);
			await this.leaderboardDeletionQuery!.run([from, lbDiscrim]);
		}
	}

	async shouldMoveEventQuestions() {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't find out if we are moving event questions because SQLite is not enabled.`);
		}

		return (await this.eventQuestionQuery!.get([]) || { value: false }).value;
	}

	async moveQuestionToCategory(question: string, newCategory: string) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't move question category because SQLite is not enabled.`);
		}
		await this.categoryChangeQuery!.run([newCategory, question]);
	}

	async migrateCategory(sourceCategory: string, targetCategory: string) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't migrate categories because SQLite is not enabled.`);
		}

		const { changes } = await this.migrateCategoryQuery!.run([targetCategory, sourceCategory]);
		return changes;
	}

	async acceptSubmissions(submissions: string[]) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't accept Trivia question submissions because SQLite is not enabled.`);
		}

		await Chat.database.run(
			`UPDATE trivia_questions SET is_submission = 0 WHERE question IN (${formatSQLArray(submissions)})`,
			submissions
		);
	}

	async editQuestion(oldQuestionText: string, newQuestionText?: string, newAnswers?: string[]) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't edit Trivia question because SQLite is not enabled.`);
		}

		await Chat.database.transaction('editQuestion', {
			oldQuestionText,
			newQuestionText,
			newAnswers,
		});
	}

	/*****************************
	 * Methods for fetching data *
	 *****************************/
	async getHistory(numberOfLines = 10): Promise<TriviaGame[]> {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't get Trivia game history because SQLite is not enabled.`);
		}
		const rows = await this.historyQuery!.all([numberOfLines]);
		return rows.map((row: AnyObject): TriviaGame => ({
			mode: row.mode,
			length: /^d+$/.test(row.length) ? parseInt(row.length) || row.length : row.length,
			category: row.category,
			creator: row.creator || undefined,
			givesPoints: row.givesPoints !== 0,
			startTime: row.time,
		}));
	}

	async getScoresForLastGame(): Promise<{ [k: string]: number }> {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't get Trivia game scores because SQLite is not enabled.`);
		}
		const { game_id } = await this.historyQuery!.get([1]);

		const results: { [k: string]: number } = {};
		for (const row of await this.historyScoresQuery!.all([game_id])) {
			results[row.userid] = row.score;
		}
		return results;
	}

	async getQuestions(
		categories: string[] | 'all',
		limit: number,
		options: { order: 'newestfirst' | 'oldestfirst' | 'random' }
	): Promise<TriviaQuestion[]> {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) throw new Chat.ErrorMessage(`Can't get Trivia questions because SQLite is not enabled.`);

		let query;
		let args;
		if (categories === 'all') {
			if (options.order === 'newestfirst') {
				query = this.allQuestionsNewestFirstQuery!;
			} else if (options.order === 'oldestfirst') {
				query = this.allQuestionsOldestFirstQuery!;
			} else {
				query = this.allQuestionsRandomOrderQuery!;
			}
			args = [limit];
		} else {
			query = (
				`SELECT * FROM trivia_questions WHERE category IN (${formatSQLArray(categories)}) AND is_submission = 0 ORDER BY ${options.order === 'random' ? 'RANDOM()' : `added_at ${(options.order === 'oldestfirst' ? 'ASC' : 'DESC')}`} LIMIT ?`
			);
			args = [...categories, limit];
		}

		if (!query) throw new Error(`Couldn't prepare query`);
		const rows = await Chat.database.all(query, args);
		return Promise.all(rows.map((row: AnyObject) => this.rowToQuestion(row)));
	}

	async getLeaderboardEntry(id: ID, leaderboard: Leaderboard): Promise<TriviaLeaderboardScore | null> {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't find out if user ${id} has a Trivia leaderboard entry because SQLite is not enabled.`);
		}

		const row = await this.leaderboardByUserQuery!.get([id, LEADERBOARD_ENUM[leaderboard]]);
		if (!row) return null;
		return {
			score: row.score,
			totalPoints: row.total_points,
			totalCorrectAnswers: row.total_correct_answers,
		};
	}

	async getLeaderboards(): Promise<TriviaLeaderboards> {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't get the Trivia leaderboard scores because SQLite is not enabled.`);
		}

		const result: TriviaLeaderboards = {
			alltime: {},
			nonAlltime: {},
			cycle: {},
		};
		const rows = await this.leaderboardQuery!.all([]);
		for (const row of rows) {
			const entry = {
				score: row.score,
				totalPoints: row.total_points,
				totalCorrectAnswers: row.total_correct_answers,
			};

			let leaderboard: Leaderboard | null = null;
			for (const [lb, discrim] of Object.entries(LEADERBOARD_ENUM) as [Leaderboard, number][]) {
				if (discrim === row.leaderboard) leaderboard = lb;
			}
			if (leaderboard === null) throw new Error(`Invalid leaderboard value ${row.leaderboard}`);

			result[leaderboard][row.userid] = entry;
		}

		return result;
	}

	async getQuestion(questionText: string): Promise<TriviaQuestion | null> {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't check if a Trivia question already exists because SQLite is not enabled.`);
		}

		const row = await this.questionExistsQuery!.get([questionText]);
		if (!row) return null;
		return this.rowToQuestion(row);
	}

	async ensureQuestionExists(questionText: string): Promise<TriviaQuestion> {
		const question = await this.getQuestion(questionText);
		if (!question) {
			throw new Chat.ErrorMessage(`Question "${questionText}" is not in the question database.`);
		}
		return question;
	}

	async ensureQuestionDoesNotExist(questionText: string) {
		if (await this.getQuestion(questionText)) {
			throw new Chat.ErrorMessage(`Question "${questionText}" is already in the question database.`);
		}
	}

	async getSubmissions(): Promise<TriviaQuestion[]> {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't retrieve the Trivia question submissions because SQLite is not enabled.`);
		}

		const rows = await this.submissionsQuery!.all([]);
		return Promise.all(rows.map((row: AnyObject) => this.rowToQuestion(row)));
	}

	async getQuestionCounts(): Promise<{ [k: string]: number, total: number }> {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't retrieve the Trivia question counts because SQLite is not enabled.`);
		}

		const allCategories = (await this.categoriesQuery!.all([])).map((row: AnyObject) => row.category);
		const total = (await this.questionCountQuery!.get([])).count;

		const result: { [k: string]: number, total: number } = { total };
		for (const category of allCategories) {
			result[category] = (await this.categoryQuestionCountQuery!.get([category])).count;
		}
		return result;
	}

	async searchQuestions(
		search: string,
		options: { searchSubmissions: boolean, caseSensitive?: boolean }
	): Promise<TriviaQuestion[]> {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't search Trivia questions because SQLite is not enabled.`);
		}

		if (options.caseSensitive) await Chat.database.exec(`PRAGMA case_sensitive_like = true;`);
		const rows = await this.questionSearchQuery!.all([`%${search}%`, Number(options.searchSubmissions)]);
		if (options.caseSensitive) await Chat.database.exec(`PRAGMA case_sensitive_like = false;`);

		return Promise.all(rows.map((row: AnyObject) => this.rowToQuestion(row)));
	}

	/*****************************
	 * Methods for deleting data *
	 * ***************************/
	async clearSubmissions() {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't clear the Trivia question submissions because SQLite is not enabled.`);
		}

		await Chat.database.run(this.clearAllSubmissionsQuery!, []);
	}

	async clearCategory(category: string) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't clear the Trivia questions in category "${category}" because SQLite is not enabled.`);
		}

		await Chat.database.run(this.clearCategoryQuery!, [category]);
	}

	async clearCycleLeaderboard() {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't clear the cycle leaderboard because SQLite is not enabled.`);
		}

		await Chat.database.run(this.clearCycleLeaderboardQuery!);
	}

	async deleteQuestion(questionText: string) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't delete the Trivia question because SQLite is not enabled.`);
		}

		await Chat.database.run(this.deleteQuestionQuery!, [questionText]);
	}

	async deleteLeaderboardEntry(userid: ID, leaderboard: Leaderboard) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't delete leaderboard entries because SQLite is not enabled.`);
		}

		await this.leaderboardDeletionQuery!.run([userid, LEADERBOARD_ENUM[leaderboard]]);
	}

	async deleteSubmissions(submissions: string[]) {
		if (this.readyPromise) await this.readyPromise;
		if (!Config.usesqlite) {
			throw new Chat.ErrorMessage(`Can't delete Trivia question submissions because SQLite is not enabled.`);
		}

		const query = await Chat.database.prepare(
			`DELETE FROM trivia_questions WHERE is_submission = 1 AND question IN (${formatSQLArray(submissions)})`
		);
		await query?.run(submissions);
	}

	/****************************************
	 * Private helper methods	 			*
	 * These are not part of the public API *
	 ****************************************/
	private async prepareStatements() {
		if (!Config.usesqlite) return;
		if (Chat.databaseReadyPromise) await Chat.databaseReadyPromise;

		this.leaderboardInsertion = await Chat.database.prepare(
			`INSERT OR REPLACE INTO trivia_leaderboard (userid, score, total_points, total_correct_answers, leaderboard) VALUES (?, ?, ?, ?, ?) `
		);
		this.questionInsertion = await Chat.database.prepare(
			`INSERT OR IGNORE INTO trivia_questions (question, category, added_at, userid, is_submission) VALUES (?, ?, ?, ?, ?)`
		);
		this.answerInsertion = await Chat.database.prepare(
			`INSERT INTO trivia_answers (question_id, answer) VALUES (?, ?)`
		);
		this.gameHistoryInsertion = await Chat.database.prepare(
			`INSERT INTO trivia_game_history (mode, length, category, time, creator, gives_points) VALUES (?, ?, ?, ?, ?, ?)`
		);
		this.scoreHistoryInsertion = await Chat.database.prepare(
			`INSERT INTO trivia_game_scores (game_id, userid, score) VALUES (?, ?, ?)`
		);
		this.updateMoveEventQuestions = await Chat.database.prepare(
			`INSERT OR REPLACE INTO trivia_settings (key, value) VALUES ('moveEventQuestions', ?)`
		);

		this.categoryChangeQuery = await Chat.database.prepare(
			`UPDATE trivia_questions SET category = ? WHERE question = ?`
		);
		this.leaderboardChangeQuery = await Chat.database.prepare(
			`INSERT INTO trivia_leaderboard (userid, score, total_points, total_correct_answers, leaderboard) ` +
			`VALUES ($userid, $score, $totalPoints, $totalCorrectAnswers, $leaderboard) ON CONFLICT DO ` +
			`UPDATE SET score = score + $score, total_points = total_points + $totalPoints, total_correct_answers = total_correct_answers + $totalCorrectAnswers ` +
			`WHERE userid = $userid AND leaderboard = $leaderboard`
		);
		this.migrateCategoryQuery = await Chat.database.prepare(
			`UPDATE OR REPLACE trivia_questions SET category = ? WHERE category = ?`
		);

		this.historyQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_game_history ORDER BY time DESC LIMIT ?`
		);
		this.historyScoresQuery = await Chat.database.prepare(`SELECT userid, score FROM trivia_game_scores WHERE game_id = ?`);
		this.allQuestionsRandomOrderQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_questions WHERE category IN ('ae', 'pokemon', 'sg', 'sh') AND is_submission = 0 ORDER BY RANDOM() LIMIT ?`
		);
		this.allQuestionsNewestFirstQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_questions WHERE category IN ('ae', 'pokemon', 'sg', 'sh') AND is_submission = 0 ORDER BY added_at DESC LIMIT ?`
		);
		this.allQuestionsOldestFirstQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_questions WHERE category IN ('ae', 'pokemon', 'sg', 'sh') AND is_submission = 0 ORDER BY added_at ASC LIMIT ?`
		);
		this.answersQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_answers WHERE question_id = ?`
		);
		this.submissionsQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_questions WHERE is_submission = 1 ORDER BY category ASC`
		);
		this.leaderboardQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_leaderboard`
		);
		this.leaderboardByUserQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_leaderboard WHERE userid = ? AND leaderboard = ?`
		);
		this.scoreAndPointsByUser = await Chat.database.prepare(
			`SELECT score, total_points as totalPoints, total_correct_answers as totalCorrectAnswers FROM trivia_leaderboard WHERE userid = ? AND leaderboard = ?`
		);
		this.eventQuestionQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_settings WHERE key = 'moveEventQuestions'`
		);
		this.categoriesQuery = await Chat.database.prepare(
			`SELECT DISTINCT category FROM trivia_questions`
		);
		this.questionCountQuery = await Chat.database.prepare(
			`SELECT count(*) AS count FROM trivia_questions WHERE is_submission = 0`
		);
		this.categoryQuestionCountQuery = await Chat.database.prepare(
			`SELECT count(*) AS count FROM trivia_questions WHERE category = ? AND is_submission = 0`
		);
		this.questionSearchQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_questions WHERE question LIKE ? AND is_submission = ? ORDER BY added_at DESC`
		);
		this.questionExistsQuery = await Chat.database.prepare(
			`SELECT * FROM trivia_questions WHERE question = ?`
		);

		this.leaderboardDeletionQuery = await Chat.database.prepare(
			`DELETE FROM trivia_leaderboard WHERE userid = ? AND leaderboard = ?`
		);
		this.clearAllSubmissionsQuery = await Chat.database.prepare(
			`DELETE FROM trivia_questions WHERE is_submission = 1`
		);
		this.clearCategoryQuery = await Chat.database.prepare(
			`DELETE FROM trivia_questions WHERE category = ? AND is_submission = 0`
		);
		// The leaderboard is hardcoded, because we don't want to accidentally delete any other leaderboards.
		// If there is a need to reset other leaderboards in the future, this can be changed to accept a parameter.
		// Not a SQL injection vulnerability because LEADERBOARD_ENUM cannot be altered by the user.
		this.clearCycleLeaderboardQuery = await Chat.database.prepare(
			`DELETE FROM trivia_leaderboard WHERE leaderboard = ${LEADERBOARD_ENUM.cycle}`
		);
		this.deleteQuestionQuery = await Chat.database.prepare(
			`DELETE FROM trivia_questions WHERE question = ?`
		);

		await Chat.database.exec("PRAGMA foreign_keys = ON;");
		await Chat.database.loadExtension('server/chat-plugins/trivia/transactions.js');
	}

	private async convertLegacyJSON() {
		if (!Config.usesqlite || !this.legacyJSONPath) return;
		if (this.readyPromise) await this.readyPromise;
		let triviaData;
		try {
			triviaData = JSON.parse(FS(this.legacyJSONPath).readIfExistsSync() || "{}");
			if (!triviaData) throw new Error(`no JSON`);
		} catch {
			return;
		}

		// handle _old_ JSON format (just in case)
		if (Array.isArray(triviaData.submissions)) {
			const oldSubmissions = triviaData.submissions as TriviaQuestion[];
			triviaData.submissions = {};

			for (const question of oldSubmissions) {
				if (!(question.category in triviaData.submissions)) triviaData.submissions[question.category] = [];
				triviaData.submissions[question.category].push(question);
			}
		}
		if (Array.isArray(triviaData.questions)) {
			const oldSubmissions = triviaData.questions as TriviaQuestion[];
			triviaData.questions = {};

			for (const question of oldSubmissions) {
				if (!(question.category in triviaData.questions)) triviaData.questions[question.category] = [];
				triviaData.questions[question.category].push(question);
			}
		}

		// convert leaderboard
		if (typeof triviaData.leaderboard === 'object') {
			for (const userid in triviaData.leaderboard) {
				const [score, totalGamePoints, totalCorrectAnswers] = triviaData.leaderboard[userid];
				await Chat.database.run(
					this.leaderboardInsertion!,
					[userid, score, totalGamePoints, totalCorrectAnswers, Number(true)]
				);
			}
		}
		if (typeof triviaData.altLeaderboard === 'object') {
			for (const userid in triviaData.altLeaderboard) {
				const [score, totalGamePoints, totalCorrectAnswers] = triviaData.altLeaderboard[userid];
				await Chat.database.run(
					this.leaderboardInsertion!,
					[userid, score, totalGamePoints, totalCorrectAnswers, Number(false)]
				);
			}
		}

		// convert questions
		const addedAt = Date.now();
		if (typeof triviaData.questions === 'object') {
			for (const category in triviaData.questions) {
				for (const question of triviaData.questions[category]) {
					if (!question.addedAt) question.addedAt = addedAt;
					if (!question.user) question.user = 'unknown user';
					question.question = question.question.trim();
					await this.addQuestions([question]);
				}
			}
		}

		if (typeof triviaData.submissions === 'object') {
			for (const category in triviaData.submissions) {
				for (const question of triviaData.submissions[category]) {
					if (!question.addedAt) question.addedAt = addedAt;
					if (!question.user) question.user = 'unknown user';
					question.question = question.question.trim();
					await this.addQuestionSubmissions([question]);
				}
			}
		}

		if (Array.isArray(triviaData.history)) {
			const now = Date.now();
			for (const game of triviaData.history) {
				if (!game.startTime) game.startTime = now;
				await this.addHistory([game]);
			}
		}

		if (triviaData.moveEventQuestions) {
			await this.setShouldMoveEventQuestions(true);
		}

		// move legacy JSON file
		try {
			await FS(this.legacyJSONPath).rename(this.legacyJSONPath + '.converted');
		} catch {}
	}

	private rowToQuestion(row: AnyObject): Promise<TriviaQuestion> {
		return Chat.database.all(this.answersQuery!, [row.question_id]).then(answerRows => ({
			question: row.question,
			category: row.category,
			answers: answerRows.map((answerRow: AnyObject) => answerRow.answer),
			user: row.userid,
			addedAt: row.added_at,
		}));
	}
}
