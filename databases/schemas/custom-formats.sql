CREATE TABLE custom_formats (
	id TEXT NOT NULL,
	display_name TEXT NOT NULL,
	base_format TEXT NOT NULL,
	section TEXT NOT NULL DEFAULT 'Custom Formats',
	owner TEXT NOT NULL,
	created_at INTEGER NOT NULL,
	is_active INTEGER NOT NULL DEFAULT 1,
	PRIMARY KEY (id)
) WITHOUT ROWID;

CREATE TABLE custom_format_rules (
	format_id TEXT NOT NULL,
	rule TEXT NOT NULL,
	rule_type TEXT NOT NULL,
	PRIMARY KEY (format_id, rule)
) WITHOUT ROWID;

CREATE TABLE custom_format_base_snapshot (
	format_id TEXT NOT NULL,
	snapshot_json TEXT NOT NULL,
	PRIMARY KEY (format_id)
) WITHOUT ROWID;

CREATE TABLE db_info (
	key TEXT NOT NULL,
	value TEXT NOT NULL,
	PRIMARY KEY (key)
) WITHOUT ROWID;

INSERT INTO db_info VALUES ('version', '1');
