-- Creates tables for Trivia.
BEGIN TRANSACTION;

-- Question/Answer storage

-- questions to be used in officials
CREATE TABLE trivia_questions (
	question_id INTEGER NOT NULL PRIMARY KEY,
	question TEXT NOT NULL,
	category TEXT NOT NULL,
	-- unix timestamp in milliseconds
	added_at INTEGER NOT NULL,
	userid TEXT NOT NULL,
	is_submission TINYINT(1) NOT NULL,
	UNIQUE(question, category)
);
CREATE TABLE trivia_answers (
	question_id INTEGER NOT NULL,
	answer TEXT NOT NULL,
	PRIMARY KEY (question_id, answer),
	FOREIGN KEY (question_id) REFERENCES trivia_questions(question_id) ON DELETE CASCADE
);

CREATE INDEX questions_by_category ON trivia_questions(category, is_submission);
CREATE INDEX questions_by_category_with_time ON trivia_questions(category, added_at, is_submission);
CREATE INDEX answers_by_question ON trivia_answers(question_id);

-- leaderboard for Trivia games

-- the existing Trivia code isn't well documented:
-- 		triviaData.altLeaderboard is the all-time leaderboard
-- 		triviaData.leaderboard is the non-all-time leaderboard (I think????)
-- 		this might be wrong — see #bot-and-script-and-website
-- 		TriviaScores = [score, total_points, total_correct_answers]
CREATE TABLE trivia_leaderboard (
	userid TEXT NOT NULL,
	score INTEGER NOT NULL,
	total_points INTEGER NOT NULL,
	total_correct_answers INTEGER NOT NULL,
	-- indicates if this row is all time
	is_all_time TINYINT(1) NOT NULL,
	PRIMARY KEY (userid, is_all_time)
);

CREATE INDEX leaderboard_index ON trivia_leaderboard(userid, is_all_time);

-- Trivia game history
CREATE TABLE trivia_game_history (
	game_id INTEGER NOT NULL PRIMARY KEY,
	mode TEXT NOT NULL,
	-- either a length name ('long' etc) or a score cap
	length TEXT NOT NULL,
	category TEXT NOT NULL,
	-- unix timestamp in milliseconds
	time INTEGER NOT NULL,
	creator TEXT,
	gives_points TINYINT(1)
);
CREATE TABLE trivia_game_scores (
	game_id INTEGER NOT NULL,
	userid TEXT NOT NULL,
	score INTEGER NOT NULL,
	PRIMARY KEY (game_id, userid),
	FOREIGN KEY (game_id) REFERENCES trivia_game_history(game_id) ON DELETE CASCADE
);

CREATE INDEX game_history_index ON trivia_game_history(time);
CREATE INDEX score_history ON trivia_game_scores(game_id);

-- Settings
-- this is really just for moveEventQuestions
CREATE TABLE trivia_settings (
	key TEXT NOT NULL PRIMARY KEY,
	value TINYINT(1) NOT NULL
);

-- update database version
UPDATE db_info SET value = '2' WHERE key = 'version';
COMMIT;
