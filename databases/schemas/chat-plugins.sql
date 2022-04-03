-- Database schema for chat plugins

-- As per the design outlined at https://gist.github.com/AnnikaCodes/afa36fc8b17791be812eebbb22182426,
-- each table should be prefixed by the plugin name.

CREATE TABLE db_info (
    key TEXT NOT NULL,
    value TEXT NOT NULL,
	PRIMARY KEY (key)
);
INSERT INTO db_info VALUES ('version', '1');
