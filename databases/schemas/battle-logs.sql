CREATE TYPE end_types AS enum('forfeit', 'normal', 'forced', 'tie');

CREATE TABLE battle_identifiers (
	format TEXT NOT NULL,
	rowid SERIAL NOT NULL,
	PRIMARY KEY (rowid)
);

CREATE TABLE battle_logs (
   roomid INTEGER NOT NULL,
	date TIMESTAMP NOT NULL,
  	winner TEXT NOT NULL,
 	loser TEXT NOT NULL,
	p1id TEXT NOT NULL,
	p2id TEXT NOT NULL,
	p1 TEXT NOT NULL,
	p2 TEXT NOT NULL,
	p1team JSONB[] NOT NULL,
	p2team JSONB[] NOT NULL,
   log TEXT[] NOT NULL,
   inputLog TEXT[] NOT NULL,
   turns SMALLINT NOT NULL,
   endType end_types NOT NULL,
	ladderError BOOLEAN NOT NULL,
	seed INTEGER[4] NOT NULL,
	score SMALLINT[2] NOT NULL,
	p1rating INTEGER,
	p2rating INTEGER,
	format TEXT NOT NULL,
	battle_identifiers_id INTEGER NOT NULL REFERENCES battle_identifiers,
   PRIMARY KEY(roomid)
);

CREATE INDEX sharedbattles_index ON battle_logs(p1id, p2id);
CREATE INDEX battlesearch_index ON battle_logs(p1id, p2id);
