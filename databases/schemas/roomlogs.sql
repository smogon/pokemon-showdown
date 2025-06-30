CREATE TABLE public.roomlogs (
	type STRING NOT NULL,
	roomid STRING NOT NULL,
	userid STRING NULL,
	time TIMESTAMP(6) NOT NULL,
	log STRING NOT NULL,
	INDEX linecount (userid, roomid, time),
	INDEX month (roomid, time),
	INDEX type (roomid, type, time),
	INDEX rename_idx (roomid)
);
-- computed columns have to be added after apparently
ALTER TABLE roomlogs ADD COLUMN content TSVECTOR AS (to_tsvector('english', log)) STORED;

CREATE TABLE public.roomlog_dates (
	roomid STRING NOT NULL,
	-- YYYY-MM
	month STRING NOT NULL,
	-- YYYY-MM-DD
	date STRING NOT NULL,
	PRIMARY KEY (roomid, date)
);