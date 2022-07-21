-- Migration for Trivia leaderboards

BEGIN TRANSACTION;

-- 0 = non-all-time, 1 = all-time, 2 = 'cycle leaderboard'
ALTER TABLE trivia_leaderboard RENAME COLUMN is_all_time TO leaderboard;
UPDATE db_info SET value = '4' WHERE key = 'version';

COMMIT;
