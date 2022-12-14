CREATE TABLE friends (
	user1 TEXT NOT NULL,
	user2 TEXT NOT NULL,
	PRIMARY KEY (user1, user2)
) WITHOUT ROWID;

CREATE TABLE friend_requests (
	sender TEXT NOT NULL,
	receiver TEXT NOT NULL,
	sent_at INTEGER NOT NULL,
	PRIMARY KEY (sender, receiver)
) WITHOUT ROWID;

CREATE TABLE friend_settings (
	userid TEXT NOT NULL,
	send_login_data INTEGER NOT NULL,
	last_login INTEGER NOT NULL,
	public_list INTEGER NOT NULL,
	PRIMARY KEY (userid)
) WITHOUT ROWID;

CREATE TABLE database_settings (
	name TEXT NOT NULL,
	val TEXT NOT NULL,
	PRIMARY KEY (name, val)
) WITHOUT ROWID;

-- set version if not exists
INSERT INTO database_settings (name, val) VALUES ('version', 0);

CREATE INDEX list ON friends (user1, user2);
CREATE INDEX request_list ON friend_requests (sender, receiver);
