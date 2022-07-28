-- Adds `rated` and `timer` cols to the Postgres `stored_battles` table.
-- Also adds a version tracker

-- Battle rating
ALTER TABLE stored_battles ADD COLUMN rated INTEGER NOT NULL;
-- JSON blob of timer settings, deserialized on load
ALTER TABLE stored_battles ADD COLUMN timer JSON NOT NULL;

CREATE TABLE battle_db_info (
    key TEXT NOT NULL,
    value TEXT NOT NULL
);
INSERT INTO battle_db_info VALUES ('version', '2');

