CREATE TABLE user_preferences (
	userid TEXT NOT NULL,
	key TEXT NOT NULL,
	value TEXT NOT NULL,
	updated_at INTEGER NOT NULL,
	PRIMARY KEY (userid, key)
) WITHOUT ROWID;

CREATE TABLE db_info (
	key TEXT NOT NULL,
	value TEXT NOT NULL,
	PRIMARY KEY (key)
) WITHOUT ROWID;

INSERT INTO db_info VALUES ('version', '1');
