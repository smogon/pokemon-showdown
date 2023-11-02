BEGIN TRANSACTION;

-- Logs of renames
CREATE TABLE alts_log (
	to_id TEXT NOT NULL,
	from_id TEXT NOT NULL,
	ip TEXT NOT NULL,
	PRIMARY KEY (to_id, from_id)
);

CREATE INDEX search_idx_alts on alts_log(from_id, to_id);
-- update database version
UPDATE db_info SET value = '7' WHERE key = 'version';
COMMIT;
