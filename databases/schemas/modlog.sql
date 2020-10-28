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
);

CREATE VIRTUAL TABLE modlog_fts USING fts5(
    note, userid, autoconfirmed_userid, action_taker_userid,
    content=modlog, content_rowid=modlog_id, tokenize='%TOKENIZER%'
);
CREATE VIRTUAL TABLE alts_fts USING fts5(
    userid,
    content=alts, content_rowid=rowid, tokenize='%TOKENIZER%'
);

PRAGMA journal_mode=WAL;
