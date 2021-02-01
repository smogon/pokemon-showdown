/**
 * Library made to simplify accessing / connecting to postgres databases,
 * and to cleanly handle when the pg module isn't installed.
 * @author mia-pi-git
 */

import type {Pool} from 'pg';
import type {SQLStatement} from 'sql-template-strings';

const DEFAULT_CONFIG = 'Config' in global ? Config.usepostgres : null;

export class PostgresDatabase {
	private pool: Pool;
	constructor(config = DEFAULT_CONFIG) {
		this.pool = config ? new (require('pg').Pool)(config) : null!;
	}
	async query(statement: string | SQLStatement, values?: any[]) {
		if (!this.pool) {
			throw new Error(`Attempting to use postgres without 'pg' installed`);
		}
		const result = await this.pool.query(statement, values);
		return result?.rows;
	}
}
