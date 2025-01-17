CREATE TABLE teams (
	teamid SERIAL PRIMARY KEY,
	ownerid TEXT NOT NULL,
	team TEXT NOT NULL,
	date TIMESTAMP NOT NULL,
	format TEXT NOT NULL,
	views INTEGER NOT NULL,
	title TEXT,
	private TEXT
);

CREATE INDEX owner_idx ON teams(ownerid);
CREATE INDEX format_idx ON teams(format);
CREATE INDEX owner_fmt_idx ON teams(ownerid, format);
