-- Creates stats tables for the Perspective moderation tool.
BEGIN TRANSACTION;

CREATE TABLE perspective_stats (
	staff TEXT NOT NULL,
	roomid TEXT NOT NULL PRIMARY KEY,
	result TINYINT(1) NOT NULL,
	timestamp INTEGER NOT NULL
);

CREATE INDEX staff_idx ON perspective_stats(staff);
CREATE INDEX result_idx ON perspective_stats(result);
CREATE INDEX date_idx ON perspective_stats(date);

-- update database version
UPDATE db_info SET value = '5' WHERE key = 'version';
COMMIT;


