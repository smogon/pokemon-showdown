CREATE TABLE modlog (
    modlog_id INTEGER NOT NULL PRIMARY KEY,
    -- UNIX timestamp
    timestamp INTEGER NOT NULL,
    --- roomid OR global-roomid
    roomid TEXT NOT NULL,
    action TEXT NOT NULL,
    visual_roomid TEXT,
    action_taker_userid TEXT,
    userid TEXT,
    autoconfirmed_userid TEXT,
    ip TEXT,
    note TEXT
);

CREATE TABLE alts (
    modlog_id INTEGER NOT NULL,
    userid TEXT NOT NULL,
    PRIMARY KEY (modlog_id, userid),
    FOREIGN KEY (modlog_id) REFERENCES modlog(modlog_id)
) WITHOUT ROWID;

PRAGMA journal_mode=WAL;
