CREATE TABLE friends (
	userid TEXT NOT NULL,
	friend TEXT NOT NULL,
	last_login INTEGER,
	PRIMARY KEY (userid, friend)
) WITHOUT ROWID;

CREATE TABLE friend_requests (
	sender TEXT NOT NULL,
	receiver TEXT NOT NULL,
	sent_at INTEGER NOT NULL,
	PRIMARY KEY (sender, receiver)
) WITHOUT ROWID;

CREATE TABLE friend_renames (
	original_name TEXT NOT NULL,
	new_name TEXT NOT NULL,
	change_date INTEGER NOT NULL,
	PRIMARY KEY (new_name)
) WITHOUT ROWID;
