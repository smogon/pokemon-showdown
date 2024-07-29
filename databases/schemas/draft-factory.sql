CREATE TABLE IF NOT EXISTS draftfactory_sources (
	id TEXT PRIMARY KEY,
	source_url TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS gen9draftfactory (
	source TEXT NOT NULL,
	url1 TEXT NOT NULL,
	team1 TEXT NOT NULL,
	url2 TEXT NOT NULL,
	team2 TEXT NOT NULL,
	FOREIGN KEY (source) REFERENCES draftfactory_sources(id) ON DELETE CASCADE,
	UNIQUE (url1, url2)
);

DROP VIEW IF EXISTS draftfactory_sources_count;
CREATE VIEW draftfactory_sources_count AS SELECT source, COUNT(*) AS count FROM gen9draftfactory GROUP BY source;