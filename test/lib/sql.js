"use strict";
const { SQL } = require('../../dist/lib/sql');
const assert = require('../assert').strict;
const common = require('../common');

const database = SQL('test', module, { file: `:memory:` });
database.spawn(1);

(common.hasModule('better-sqlite3') ? describe : describe.skip)(`SQLite worker wrapper`, () => {
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
		await database.run(insert, ['a', 'b']);
	});
	it(`should support both inline and object params`, async () => {
		const num = await database.prepare(`INSERT INTO test (col, col2) VALUES($col, $col2)`);
		await database.run(insert, ['a', 'b']);
		await database.run(num, { col: 'a', col2: 'b' });
	});
	it(`should retrieve one line from Database.get`, async () => {
		const result = await database.get(select);
		assert(!!result, 1);
	});
});
