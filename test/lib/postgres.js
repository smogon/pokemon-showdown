"use strict";
const assert = require('assert').strict;
const {PostgresDatabase} = require('../../lib');

function testMod(mod) {
	try {
		require(mod);
	} catch (e) {
		return it.skip;
	}
	return it;
}

// only run these if you already have postgres configured
describe.skip("Postgres features", () => {
	it("Should be able to connect to a database", async () => {
		this.database = new PostgresDatabase();
	});
	it("Should be able to insert data", async () => {
		await assert.doesNotThrowAsync(async () => {
			await this.database.query(`CREATE TABLE test (col TEXT, col2 TEXT)`);
			await this.database.query(
				`INSERT INTO test (col, col2) VALUES ($1, $2)`,
				['foo', 'bar'],
			);
		});
	});
	testMod('sql-template-strings')('Should support sql-template-strings', async () => {
		await assert.doesNotThrowAsync(async () => {
			const SQL = require('sql-template-strings');
			await this.database.query(SQL`INSERT INTO test (col1, col2) VALUES (${'a'}, ${'b'})`);
		});
	});
	it("Should be able to run multiple statements in transaction", async () => {
		await assert.doesNotThrowAsync(async () => {
			await this.database.transaction(async worker => {
				const tables = await worker.query(
					`SELECT tablename FROM pg_catalog.pg_tables ` +
					`WHERE tablename = 'test' LIMIT 1;`
				);
				for (const {tablename} of tables) {
					await worker.query(`DROP TABLE ` + tablename);
				}
			});
		});
	});
});
