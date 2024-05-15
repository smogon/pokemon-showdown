CREATE TABLE public.roomlogs (
	type STRING NOT NULL,
	roomid STRING NOT NULL,
	userid STRING NULL,
	time INT NOT NULL,
	log STRING NOT NULL,
	INDEX linecount (userid, roomid, time),
	INDEX month (roomid, time),
	INDEX type (roomid, type, time),
);
-- computed columns have to be added after apparently
ALTER TABLE roomlogs ADD COLUMN content TSVECTOR AS (to_tsvector('english', log)) STORED;
