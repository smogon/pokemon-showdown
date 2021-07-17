"use strict";
const {SQL} = require('../../lib/sql');
const assert = require('../assert').strict;

const database = SQL(`:memory:`);

describe(`SQLite worker wrapper`, async () => {
	// prepare statements and set up table
	await database.exec(`CREATE TABLE IF NOT EXISTS test (col TEXT, col2 TEXT)`);
	const select = await database.prepare(`SELECT * FROM test`); // 0
	const insert = await database.prepare(`INSERT INTO test (col, col2) VALUES (?, ?)`); // 1
	it(`should require you to prepare a statement before running`, async () => {
		assert.throws(async () => {
			await database.get('SELECT col FROM test');
		}, /Prepare a statement before using another database function with SQLDatabase.prepare/);
	});
	it(`should retrieve one line from Database.get`, async () => {
		const result = await database.get(select);
		assert(result.length, 1);
	});
	it(`should support both statement strings and corresponding numbers`, async () => {
		await database.run(`INSERT INTO test (col, col2) VALUES(?, ?)`, ['a', 'b']);
		await database.run(insert, ['a', 'b']);
	});
	it(`should support both inline and object params`, async () => {
		const num = await database.prepare(`INSERT INTO test (col, col2) VALUES($col, $col2)`);
		await database.run(insert, ['a', 'b']);
		await database.run(num, {col: 'a', col1: 'b'});
	});
});
