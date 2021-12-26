BEGIN TRANSACTION;

-- Logs of each flag
CREATE TABLE perspective_flags (
	userid TEXT NOT NULL,
	score NUMBER NOT NULL,
	certainty NUMBER NOT NULL,
	type TEXT NOT NULL,
	roomid TEXT NOT NULL,
	time NUMBER NOT NULL
);

CREATE INDEX type_idx ON perspective_flags(type);
CREATE INDEX user_idx ON perspective_flags(userid);
-- update database version
UPDATE db_info SET value = '6' WHERE key = 'version';
COMMIT;
