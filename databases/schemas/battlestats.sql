CREATE TABLE IF NOT EXISTS gen9computergeneratedteams (
	species_id TEXT PRIMARY KEY,
	wins NUMBER NOT NULL,
	losses NUMBER NOT NULL,
	level NUMBER NOT NULL
);

CREATE INDEX IF NOT EXISTS gen9computergeneratedteams_species_id_level ON gen9computergeneratedteams(species_id, level);

CREATE TABLE IF NOT EXISTS gen9_historical_levels (
	species_id TEXT NOT NULL,
	level NUMBER NOT NULL,
	timestamp NUMBER NOT NULL
);

CREATE TABLE IF NOT EXISTS db_info (
	key TEXT PRIMARY KEY,
	value TEXT NOT NULL
);

INSERT INTO db_info (key, value) VALUES ('version', '1') ON CONFLICT DO NOTHING;
PRAGMA journal_mode=WAL;
