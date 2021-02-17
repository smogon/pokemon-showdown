/**
 * Library made to simplify accessing / connecting to postgres databases,
 * and to cleanly handle when the pg module isn't installed.
 * @author mia-pi-git
 */

// @ts-ignore in case module doesn't exist
import type * as PG from 'pg'
import type {SQLStatement} from 'sql-template-strings';

export class PostgresDatabase {
	private pool: PG.Pool;
	constructor(config = PostgresDatabase.getConfig()) {
		this.pool = config ? new (require('pg').Pool)(config) : null!;
	}
	async query(statement: string | SQLStatement, values?: any[]) {
		if (!this.pool) {
			throw new Error(`Attempting to use postgres without 'pg' installed`);
		}
		let result;
		try {
			result = await this.pool.query(statement, values);
		} catch (e) {
			throw new Error(e.message);
		}
		return result?.rows || [];
	}
	static getConfig() {
		let config: AnyObject = {};
		try {
			config = require('../config/config').usepostgres;
			if (!config) throw new Error('');
		} catch (e) {}
		return config;
	}
	async transaction(callback: (conn: PG.PoolClient) => any) {
		const conn = await this.pool.connect();
		await conn.query(`BEGIN;`);
		try {
			await callback(conn);
		} catch (e) {
			await conn.query(`ROLLBACK;`);
			throw e;
		}
		await conn.query(`COMMIT;`);
	}
}
