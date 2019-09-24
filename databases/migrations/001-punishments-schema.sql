--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS punishments (
	punish_type TEXT NOT NULL,
	user_id TEXT NOT NULL,
	ips TEXT NOT NULL,
	user_ids TEXT NOT NULL,
	expire_time INTEGER NOT NULL,
	reason TEXT NOT NULL,
	PRIMARY KEY (punish_type, user_id)
);

CREATE TABLE IF NOT EXISTS room_punishments (
	punish_type TEXT NOT NULL,
	room_id TEXT NOT NULL,
	user_id TEXT NOT NULL,
	ips TEXT NOT NULL,
	user_ids TEXT NOT NULL,
	expire_time INTEGER NOT NULL,
	reason TEXT NOT NULL,
	PRIMARY KEY (punish_type, room_id, user_id)
);

CREATE TABLE IF NOT EXISTS shared_ips (
	ip TEXT NOT NULL,
	note TEXT NOT NULL,
	PRIMARY KEY (ip)
);

CREATE TABLE IF NOT EXISTS ip_banlist (
	ip TEXT NOT NULL,
	PRIMARY KEY (ip)
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE punishments;
DROP TABLE room_punishments;
DROP TABLE shared_ips;
DROP TABLE ip_banlist;
