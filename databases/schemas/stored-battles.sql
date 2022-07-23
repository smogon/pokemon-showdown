CREATE TABLE stored_battles (
	roomid TEXT NOT NULL PRIMARY KEY, -- can store both the num and the formatid
	input_log TEXT NOT NULL,
	players TEXT[] NOT NULL,
	title TEXT NOT NULL
);
