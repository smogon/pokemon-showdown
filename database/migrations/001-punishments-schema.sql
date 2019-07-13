--------------------------------------------------------------------------------
-- Up
--------------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS punishments (
	punishType TEXT,
	userid TEXT,
	ips TEXT,
	userids TEXT,
	expireTime INTEGER,
	reason TEXT,
	-- The column rest is used to make the punishments database extensible
	rest BLOB
);

CREATE TABLE IF NOT EXISTS room_punishments (
	punishType TEXT,
	-- roomid:userid
	id TEXT,
	ips TEXT,
	userids TEXT,
	expireTime INTEGER,
	reason TEXT,
	-- The column rest is used to make the punishments database extensible
	rest BLOB
);

CREATE TABLE IF NOT EXISTS shared_ips (
	ip TEXT PRIMARY KEY,
	-- type is always "SHARED", but we will store it anyway in case there are more types in the future
	type TEXT,
	note TEXT
);

CREATE TABLE IF NOT EXISTS ip_banlist (
	ip TEXT PRIMARY KEY
);

--------------------------------------------------------------------------------
-- Down
--------------------------------------------------------------------------------

DROP TABLE punishments;
DROP TABLE room_punishments;
DROP TABLE shared_ips;
DROP TABLE ip_banlist;
