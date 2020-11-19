CREATE TABLE friends (
	user1 TEXT NOT NULL,
	user2 TEXT NOT NULL,
	PRIMARY KEY (userid, friend)
) WITHOUT ROWID;

CREATE TABLE friend_requests (
	sender TEXT NOT NULL,
	receiver TEXT NOT NULL,
	sent_at INTEGER,
	PRIMARY KEY (sender, receiver)
) WITHOUT ROWID;

CREATE TABLE friend_settings (
	name TEXT NOT NULL,
	send_login_data INTEGER,
	last_login INTEGER NOT NULL,
	public_list INTEGER,
	PRIMARY KEY (name)
) WITHOUT ROWID;
