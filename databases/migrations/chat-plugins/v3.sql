-- Creates tables for the Perspective moderation tool.
BEGIN TRANSACTION;

-- Logs of each action.
CREATE TABLE perspective_logs (
	userid TEXT NOT NULL,
	message TEXT NOT NULL,
	score NUMBER NOT NULL,
	flags TEXT NOT NULL,
	roomid TEXT NOT NULL,
	time NUMBER NOT NULL,
	-- boolean, was this time enough to push their score above the threshold?
	hit_threshold TINYINT(1) NOT NULL
);

CREATE INDEX userid_idx ON perspective_logs (userid);
CREATE INDEX roomid_idx ON perspective_logs (roomid);
CREATE INDEX score_idx ON perspective_logs (score);

-- update database version
UPDATE db_info SET value = '3' WHERE key = 'version';
COMMIT;
