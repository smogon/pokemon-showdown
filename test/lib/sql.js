"use strict";
const {SQL} = require('../../lib/sql');
const assert = require('../assert').strict;

const database = SQL(module, {file: `:memory:`, processes: 1});

const test = (common.hasModule('better-sqlite3') ? describe : describe.skip);
test(`SQLite worker wrapper`, () => {
	// prepare statements and set up table
	let select, insert;
	before(async () => {
		await database.exec(`CREATE TABLE IF NOT EXISTS test (col TEXT, col2 TEXT)`);
		select = await database.prepare(`SELECT * FROM test`);
		insert = await database.prepare(`INSERT INTO test (col, col2) VALUES (?, ?)`);
	});
	it(`should require you to prepare a statement before running`, async () => {
		database.get('SELECT col FROM test').then(() => {
			assert(false, 'expected error');
		}).catch(() => {
			assert(true, 'received error');
		});
	});
	it(`should support both statement strings and corresponding statement classes`, async () => {
		await database.run(`INSERT INTO test (col, col2) VALUES (?, ?)`, ['a', 'b']);
		await database.run(this.insert, ['a', 'b']);
	});
	it(`should support both inline and object params`, async () => {
		await database.run(this.insert, ['a', 'b']);
		await database.run(`INSERT INTO test (col, col2) VALUES($col, $col2)`, {col: 'a', col2: 'b'});
	});
	it(`should retrieve one line from Database.get`, async () => {
		assert(!!await database.get(this.select), 1);
	});
});
