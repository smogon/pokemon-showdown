"use strict";
const assert = require('assert').strict;
const { PGDatabase, SQL } = require('../../dist/lib/database');

const database = new PGDatabase();
const assertSQL = (sql, rawSql, args) => assert.deepEqual(
	database._resolveSQL(sql), [rawSql, args || []]
);

describe("Postgres library", () => {
	it("should support template strings", async () => {
		assertSQL(SQL`INSERT INTO test (col1, col2) VALUES (${'a'}, ${'b'})`,
			"INSERT INTO test (col1, col2) VALUES ($1, $2)", ["a", "b"]);
		assertSQL(SQL`INSERT INTO test (${{ col1: "a", col2: "b" }})`,
			`INSERT INTO test ("col1", "col2") VALUES ($1, $2)`, ["a", "b"]);
		assertSQL(SQL`SELECT * FROM test ${SQL`WHERE `}${SQL`a = 1`} LIMIT 1`,
			`SELECT * FROM test WHERE a = 1 LIMIT 1`);
		assertSQL(SQL`SELECT ${undefined}1+1`,
			`SELECT 1+1`);
		assertSQL(SQL`SELECT ${[]}2+2`,
			`SELECT 2+2`);

		const constructed = SQL`SELECT `;
		constructed.appendRaw(`3`);
		constructed.append(SQL` + `);
		constructed.append(3);
		assertSQL(constructed, `SELECT 3 + $1`, [3]);

		assertSQL(SQL`SELECT * FROM test ${[SQL`WHERE `, SQL`a = 2`]} LIMIT 1`,
			`SELECT * FROM test WHERE a = 2 LIMIT 1`);
	});

	// only run these if you already have postgres configured
	// TODO: update for new db

	it.skip("Should be able to connect to a database", async () => {
		this.database = new PGDatabase();
	});
	it.skip("Should be able to insert data", async () => {
		await assert.doesNotThrowAsync(async () => {
			await this.database.query(`CREATE TABLE test (col TEXT, col2 TEXT)`);
			await this.database.query(
				`INSERT INTO test (col, col2) VALUES ($1, $2)`,
				['foo', 'bar']
			);
		});
	});
	it.skip("Should be able to run multiple statements in transaction", async () => {
		await assert.doesNotThrowAsync(async () => {
			await this.database.transaction(async worker => {
				const tables = await worker.query(
					`SELECT tablename FROM pg_catalog.pg_tables ` +
					`WHERE tablename = 'test' LIMIT 1;`
				);
				for (const { tablename } of tables) {
					await worker.query(`DROP TABLE ` + tablename);
				}
			});
		});
	});
});
