CREATE TABLE public.roomlogs (
	type STRING NOT NULL,
	room STRING NOT NULL,
	userid STRING NULL,
	time INT NOT NULL,
	log STRING NOT NULL,
	INDEX linecount (userid, room, time),
	INDEX month (room, time),
	INDEX type (room, type, time),
);
-- computed columns have to be added after apparently
ALTER TABLE roomlogs ADD COLUMN content TSVECTOR AS (to_tsvector('english', log)) STORED;
