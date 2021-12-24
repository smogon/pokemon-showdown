-- Creates stats tables for the Perspective moderation tool.
BEGIN TRANSACTION;

CREATE TABLE perspective_stats (
	staff TEXT NOT NULL,
	roomid TEXT NOT NULL PRIMARY KEY,
	result TINYINT(1) NOT NULL,
	timestamp INTEGER NOT NULL
);

CREATE INDEX timestamp_idx ON perspective_stats(timestamp);

-- update database version
UPDATE db_info SET value = '5' WHERE key = 'version';
COMMIT;


