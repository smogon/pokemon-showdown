SELECT load_extension("native/fts_id_tokenizer.o");

CREATE VIRTUAL TABLE modlog_fts USING fts5(note, content=modlog, content_rowid=modlog_id, tokenize='id_tokenizer')
