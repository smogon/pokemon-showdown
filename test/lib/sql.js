"use strict";
const {SQL} = require('../../lib/sql');
const assert = require('../assert').strict;
const common = require('../common');

const database = SQL(module, {file: `:memory:`, processes: 1});

const test = (common.hasModule('better-sqlite3') ? describe : describe.skip);
test(`SQLite worker wrapper`, async function () {
	// prepare statements and set up table
	before(async () => {
		await database.exec(`CREATE TABLE IF NOT EXISTS test (col TEXT, col2 TEXT)`);
		this.select = await database.prepare(`SELECT * FROM test`); // 0
		this.insert = await database.prepare(`INSERT INTO test (col, col2) VALUES (?, ?)`); // 1
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
