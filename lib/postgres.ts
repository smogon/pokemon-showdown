/**
 * Library made to simplify accessing / connecting to postgres databases,
 * and to cleanly handle when the pg module isn't installed.
 * @author mia-pi-git
 */

// @ts-ignore in case module doesn't exist
import type * as PG from 'pg';
import type {SQLStatement} from 'sql-template-strings';
import * as Streams from './streams';
import {FS} from './fs';
import * as Utils from './utils';

interface MigrationOptions {
	table: string;
	migrationsFolder: string;
	baseSchemaFile: string;
}

export class PostgresDatabase {
	private pool: PG.Pool;
	constructor(config = PostgresDatabase.getConfig()) {
		try {
			this.pool = new (require('pg').Pool)(config);
		} catch (e: any) {
			this.pool = null!;
		}
	}
	destroy() {
		return this.pool.end();
	}
	async query(statement: string | SQLStatement, values?: any[]) {
		if (!this.pool) {
			throw new Error(`Attempting to use postgres without 'pg' installed`);
		}
		let result;
		try {
			result = await this.pool.query(statement, values);
		} catch (e: any) {
			// postgres won't give accurate stacks unless we do this
			throw new Error(e.message);
		}
		return result?.rows || [];
	}
	static getConfig() {
		let config: AnyObject = {};
		try {
			config = require(FS.ROOT_PATH + '/config/config').usepostgres;
			if (!config) throw new Error('Missing config for pg database');
		} catch (e: any) {}
		return config;
	}
	async transaction(callback: (conn: PG.PoolClient) => any, depth = 0): Promise<any> {
		const conn = await this.pool.connect();
		await conn.query(`BEGIN`);
		let result;
		try {
			// eslint-disable-next-line callback-return
			result = await callback(conn);
		} catch (e: any) {
			await conn.query(`ROLLBACK`);
			// two concurrent transactions conflicted, try again
			if (e.code === '40001' && depth <= 10) {
				return this.transaction(callback, depth + 1);
				// There is a bug in Postgres that causes some
				// serialization failures to be reported as failed
				// unique constraint checks. Only retrying once since
				// it could be our fault (thanks chaos for this info / the first half of this comment)
			} else if (e.code === '23505' && !depth) {
				return this.transaction(callback, depth + 1);
			} else {
				throw e;
			}
		}
		await conn.query(`COMMIT`);
		return result;
	}
	stream<T = any>(query: string) {
		// eslint-disable-next-line @typescript-eslint/no-this-alias
		const db = this;
		return new Streams.ObjectReadStream<T>({
			async read(this: Streams.ObjectReadStream<T>) {
				const result = await db.query(query) as T[];
				if (!result.length) return this.pushEnd();
				// getting one row at a time means some slower queries
				// might help with performance
				this.buf.push(...result);
			},
		});
	}
	async ensureMigrated(opts: MigrationOptions) {
		let value;
		try {
			const stored = await this.query(
				`SELECT value FROM db_info WHERE key = 'version' AND name = $1`, [opts.table]
			);
			if (stored.length) {
				value = stored[0].value || "0";
			}
		} catch (e) {
			await this.query(`CREATE TABLE db_info (name TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL)`);
		}
		if (!value) { // means nothing inserted - create row
			value = "0";
			await this.query('INSERT INTO db_info (name, key, value) VALUES ($1, $2, $3)', [opts.table, 'version', value]);
		}
		value = Number(value);
		const files = FS(opts.migrationsFolder)
			.readdirSync()
			.filter(f => f.endsWith('.sql'))
			.map(f => Number(f.slice(1).split('.')[0]));
		Utils.sortBy(files, f => f);
		const curVer = files[files.length - 1] || 0;
		if (curVer !== value) {
			if (!value) {
				try {
					await this.query(`SELECT * FROM ${opts.table} LIMIT 1`);
				} catch {
					await this.query(FS(opts.baseSchemaFile).readSync());
				}
			}
			for (const n of files) {
				if (n <= value) continue;
				await this.query(FS(`${opts.migrationsFolder}/v${n}.sql`).readSync());
				await this.query(
					`UPDATE db_info SET value = $1 WHERE key = 'version' AND name = $2`, [`${n}`, opts.table]
				);
			}
		}
	}
}
