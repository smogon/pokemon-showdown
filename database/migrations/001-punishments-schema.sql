--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS punishments (
	punishType TEXT NOT NULL,
	userid TEXT NOT NULL,
	ips TEXT NOT NULL,
	userids TEXT NOT NULL,
	expireTime INTEGER NOT NULL,
	reason TEXT NOT NULL,
	PRIMARY KEY (punishType, userid)
);

CREATE TABLE IF NOT EXISTS room_punishments (
	punishType TEXT NOT NULL,
	-- roomid:userid
	id TEXT NOT NULL,
	ips TEXT NOT NULL,
	userids TEXT NOT NULL,
	expireTime INTEGER NOT NULL,
	reason TEXT NOT NULL,
	PRIMARY KEY (punishType, id)
);

CREATE TABLE IF NOT EXISTS shared_ips (
	ip TEXT NOT NULL,
	-- type is always "SHARED", but we will store it anyway in case there are more types in the future
	type TEXT NOT NULL,
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
