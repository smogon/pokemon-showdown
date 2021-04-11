/**
 * Library made to simplify accessing / connecting to postgres databases,
 * and to cleanly handle when the pg module isn't installed.
 * @author mia-pi-git
 */

// @ts-ignore in case module doesn't exist
import type * as PG from 'pg';
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
			// postgres won't give accurate stacks unless we do this
			throw new Error(e.message);
		}
		return result?.rows || [];
	}
	static getConfig() {
		let config: AnyObject = {};
		try {
			config = require('../config/config').usepostgres;
			if (!config) throw new Error('Missing config for pg database');
		} catch (e) {}
		return config;
	}
	async transaction(callback: (conn: PG.PoolClient) => any, depth = 0): Promise<any> {
		const conn = await this.pool.connect();
		await conn.query(`BEGIN;`);
		let result;
		try {
			// eslint-disable-next-line callback-return
			result = await callback(conn);
		} catch (e) {
			await conn.query(`ROLLBACK;`);
			const code = parseInt(e?.code);
			// two concurrent transactions conflicted, try again
			if (code === 40001 && depth <= 10) {
				result = await this.transaction(callback, depth++);
			// There is a bug in Postgres that causes some
			// serialization failures to be reported as failed
			// unique constraint checks. Only retrying once since
			// it could be our fault (thanks chaos for this info / the first half of this comment)
			} else if (code === 23505 && !depth) {
				result = await this.transaction(callback, depth++);
			} else {
				throw e;
			}
		}
		await conn.query(`COMMIT;`);
		return result;
	}
}
