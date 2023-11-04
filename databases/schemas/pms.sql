CREATE TABLE offline_pms (
	sender TEXT NOT NULL,
	receiver TEXT NOT NULL,
	time INTEGER NOT NULL,
	message TEXT NOT NULL,
	-- Has the user seen these pms? If so, set to the current date, delete within X hours (currently, 48 hours).
	seen NUMBER
);

CREATE TABLE pm_settings (
	userid TEXT NOT NULL,
	view_only TEXT,
	PRIMARY KEY (userid)
);

CREATE TABLE db_info (
	key TEXT NOT NULL,
	value TEXT NOT NULL
);

INSERT INTO db_info (key, value) VALUES ('version', '1');

CREATE INDEX list_idx ON offline_pms (sender, receiver);
CREATE INDEX sent_idx ON offline_pms (sender);
CREATE INDEX received_idx ON offline_pms (receiver);
CREATE INDEX setting_idx ON pm_settings (userid);
