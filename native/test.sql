-- a really primitive test script
-- build the extension, and run sqlite3 ':memory:' < test.sql

.load ./fts_id_tokenizer.o

create virtual table foo using fts5(t, tokenize="id_tokenizer");
insert into foo values
("hello this is a test"),
("with 1 numbers 2"),
("Heizölrückstoßabdämpfung");

.print ** ids available: **
select * from foo;
.print

.print ** search for thisis: **
select * from foo where t match 'thisis';
.print

.print ** search for 1numbers2: **
select * from foo where t match '1numbers2';
.print

.print ** search for lrck: **
select * from foo where t match 'lrck';
