/**
 * Database abstraction layer that's vaguely ORM-like.
 * Modern (Promises, strict types, tagged template literals), but ORMs
 * are a bit _too_ magical for me, so none of that magic here.
 *
 * @author Zarel
 */

import * as mysql from 'mysql2';
import * as pg from 'pg';

export type BasicSQLValue = string | number | null;
// eslint-disable-next-line
export type SQLRow = {[k: string]: BasicSQLValue};
export type SQLValue = BasicSQLValue | SQLStatement | PartialOrSQL<SQLRow> | BasicSQLValue[] | undefined;

export class SQLStatement {
	sql: string[];
	values: BasicSQLValue[];
	constructor(strings: TemplateStringsArray, values: SQLValue[]) {
		this.sql = [strings[0]];
		this.values = [];
		for (let i = 0; i < strings.length; i++) {
			this.append(values[i], strings[i + 1]);
		}
	}
	append(value: SQLValue, nextString = ''): this {
		if (value instanceof SQLStatement) {
			if (!value.sql.length) return this;
			const oldLength = this.sql.length;
			this.sql = this.sql.concat(value.sql.slice(1));
			this.sql[oldLength - 1] += value.sql[0];
			this.values = this.values.concat(value.values);
			if (nextString) this.sql[this.sql.length - 1] += nextString;
		} else if (typeof value === 'string' || typeof value === 'number' || value === null) {
			this.values.push(value);
			this.sql.push(nextString);
		} else if (value === undefined) {
			this.sql[this.sql.length - 1] += nextString;
		} else if (Array.isArray(value)) {
			if ('"`'.includes(this.sql[this.sql.length - 1].slice(-1))) {
				// "`a`, `b`" syntax
				const quoteChar = this.sql[this.sql.length - 1].slice(-1);
				for (const col of value) {
					this.append(col, `${quoteChar}, ${quoteChar}`);
				}
				this.sql[this.sql.length - 1] = this.sql[this.sql.length - 1].slice(0, -4) + nextString;
			} else {
				// "1, 2" syntax
				for (const val of value) {
					this.append(val, `, `);
				}
				this.sql[this.sql.length - 1] = this.sql[this.sql.length - 1].slice(0, -2) + nextString;
			}
		} else if (this.sql[this.sql.length - 1].endsWith('(')) {
			// "(`a`, `b`) VALUES (1, 2)" syntax
			this.sql[this.sql.length - 1] += `"`;
			for (const col in value) {
				this.append(col, `", "`);
			}
			this.sql[this.sql.length - 1] = this.sql[this.sql.length - 1].slice(0, -4) + `") VALUES (`;
			for (const col in value) {
				this.append(value[col], `, `);
			}
			this.sql[this.sql.length - 1] = this.sql[this.sql.length - 1].slice(0, -2) + nextString;
		} else if (this.sql[this.sql.length - 1].toUpperCase().endsWith(' SET ')) {
			// "`a` = 1, `b` = 2" syntax
			this.sql[this.sql.length - 1] += `"`;
			for (const col in value) {
				this.append(col, `" = `);
				this.append(value[col], `, "`);
			}
			this.sql[this.sql.length - 1] = this.sql[this.sql.length - 1].slice(0, -3) + nextString;
		} else {
			throw new Error(
				`Objects can only appear in (obj) or after SET; ` +
				`unrecognized: ${this.sql[this.sql.length - 1]}[obj]${nextString}`
			);
		}
		return this;
	}
}

/**
 * Tag function for SQL, with some magic.
 *
 * * `` SQL`UPDATE table SET a = ${'hello"'}` ``
 *   * `` `UPDATE table SET a = 'hello'` ``
 *
 * Values surrounded by `"` or `` ` `` become identifiers:
 *
 * * ``` SQL`SELECT * FROM "${'table'}"` ```
 *   * `` `SELECT * FROM "table"` ``
 *
 * (Make sure to use `"` for Postgres and `` ` `` for MySQL.)
 *
 * Objects preceded by SET become setters:
 *
 * * `` SQL`UPDATE table SET ${{a: 1, b: 2}}` ``
 *   * `` `UPDATE table SET "a" = 1, "b" = 2` ``
 *
 * Objects surrounded by `()` become keys and values:
 *
 * * `` SQL`INSERT INTO table (${{a: 1, b: 2}})` ``
 *   * `` `INSERT INTO table ("a", "b") VALUES (1, 2)` ``
 *
 * Arrays become lists; surrounding by `"` or `` ` `` turns them into lists of names:
 *
 * * `` SQL`INSERT INTO table ("${['a', 'b']}") VALUES (${[1, 2]})` ``
 *   * `` `INSERT INTO table ("a", "b") VALUES (1, 2)` ``
 */
export function SQL(strings: TemplateStringsArray, ...values: SQLValue[]) {
	return new SQLStatement(strings, values);
}

export interface ResultRow {[k: string]: BasicSQLValue}

export const connectedDatabases: Database[] = [];

export abstract class Database<Pool extends mysql.Pool | pg.Pool = mysql.Pool | pg.Pool, OkPacket = unknown> {
	connection: Pool;
	prefix: string;
	type = '';
	constructor(connection: Pool, prefix = '') {
		this.prefix = prefix;
		this.connection = connection;
		connectedDatabases.push(this);
	}
	abstract _resolveSQL(query: SQLStatement): [query: string, values: BasicSQLValue[]];
	abstract _query(sql: string, values: BasicSQLValue[]): Promise<any>;
	abstract _queryExec(sql: string, values: BasicSQLValue[]): Promise<OkPacket>;
	abstract escapeId(param: string): string;
	query<T = ResultRow>(sql: SQLStatement): Promise<T[]>;
	query<T = ResultRow>(): (strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<T[]>;
	query<T = ResultRow>(sql?: SQLStatement) {
		if (!sql) return (strings: any, ...rest: any) => this.query<T>(new SQLStatement(strings, rest));

		const [query, values] = this._resolveSQL(sql);
		return this._query(query, values);
	}
	queryOne<T = ResultRow>(sql: SQLStatement): Promise<T | undefined>;
	queryOne<T = ResultRow>(): (strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<T | undefined>;
	queryOne<T = ResultRow>(sql?: SQLStatement) {
		if (!sql) return (strings: any, ...rest: any) => this.queryOne<T>(new SQLStatement(strings, rest));

		return this.query<T>(sql).then(res => Array.isArray(res) ? res[0] : res);
	}
	queryExec(sql: SQLStatement): Promise<OkPacket>;
	queryExec(): (strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<OkPacket>;
	queryExec(sql?: SQLStatement) {
		if (!sql) return (strings: any, ...rest: any) => this.queryExec(new SQLStatement(strings, rest));

		const [query, values] = this._resolveSQL(sql);
		return this._queryExec(query, values);
	}
	getTable<Row>(name: string, primaryKeyName: keyof Row & string | null = null): DatabaseTable<Row, this> {
		return new DatabaseTable<Row, this>(this, name, primaryKeyName);
	}
	close() {
		void this.connection.end();
	}
}

type PartialOrSQL<T> = {
	[P in keyof T]?: T[P] | SQLStatement;
};

type OkPacketOf<DB extends Database> = DB extends Database<any, infer T> ? T : never;

// Row extends SQLRow but TS doesn't support closed types so we can't express this
export class DatabaseTable<Row, DB extends Database> {
	db: DB;
	name: string;
	primaryKeyName: keyof Row & string | null;
	constructor(
		db: DB,
		name: string,
		primaryKeyName: keyof Row & string | null = null
	) {
		this.db = db;
		this.name = db.prefix + name;
		this.primaryKeyName = primaryKeyName;
	}
	escapeId(param: string) {
		return this.db.escapeId(param);
	}

	// raw

	query<T = Row>(sql: SQLStatement): Promise<T[]>;
	query<T = Row>(): (strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<T[]>;
	query<T = Row>(sql?: SQLStatement) {
		return this.db.query<T>(sql as any) as any;
	}
	queryOne<T = Row>(sql: SQLStatement): Promise<T | undefined>;
	queryOne<T = Row>(): (strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<T | undefined>;
	queryOne<T = Row>(sql?: SQLStatement) {
		return this.db.queryOne<T>(sql as any) as any;
	}
	queryExec(sql: SQLStatement): Promise<OkPacketOf<DB>>;
	queryExec(): (strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<OkPacketOf<DB>>;
	queryExec(sql?: SQLStatement) {
		return this.db.queryExec(sql as any) as any;
	}

	// low-level

	selectAll<T = Row>(entries?: (keyof Row & string)[] | SQLStatement):
	(strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<T[]> {
		if (!entries) entries = SQL`*`;
		if (Array.isArray(entries)) entries = SQL`"${entries}"`;
		return (strings, ...rest) =>
			this.query<T>()`SELECT ${entries} FROM "${this.name}" ${new SQLStatement(strings, rest)}`;
	}
	selectOne<T = Row>(entries?: (keyof Row & string)[] | SQLStatement):
	(strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<T | undefined> {
		if (!entries) entries = SQL`*`;
		if (Array.isArray(entries)) entries = SQL`"${entries}"`;
		return (strings, ...rest) =>
			this.queryOne<T>()`SELECT ${entries} FROM "${this.name}" ${new SQLStatement(strings, rest)} LIMIT 1`;
	}
	updateAll(partialRow: PartialOrSQL<Row>):
	(strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<OkPacketOf<DB>> {
		return (strings, ...rest) =>
			this.queryExec()`UPDATE "${this.name}" SET ${partialRow as any} ${new SQLStatement(strings, rest)}`;
	}
	updateOne(partialRow: PartialOrSQL<Row>):
	(strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<OkPacketOf<DB>> {
		return (s, ...r) =>
			this.queryExec()`UPDATE "${this.name}" SET ${partialRow as any} ${new SQLStatement(s, r)} LIMIT 1`;
	}
	deleteAll():
	(strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<OkPacketOf<DB>> {
		return (strings, ...rest) =>
			this.queryExec()`DELETE FROM "${this.name}" ${new SQLStatement(strings, rest)}`;
	}
	deleteOne():
	(strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<OkPacketOf<DB>> {
		return (strings, ...rest) =>
			this.queryExec()`DELETE FROM "${this.name}" ${new SQLStatement(strings, rest)} LIMIT 1`;
	}
	eval<T>():
	(strings: TemplateStringsArray, ...rest: SQLValue[]) => Promise<T | undefined> {
		return (strings, ...rest) =>
			this.queryOne<{result: T}>(
			)`SELECT ${new SQLStatement(strings, rest)} AS result FROM "${this.name}" LIMIT 1`
				.then(row => row?.result);
	}

	// high-level

	insert(partialRow: PartialOrSQL<Row>, where?: SQLStatement) {
		return this.queryExec()`INSERT INTO "${this.name}" (${partialRow as SQLValue}) ${where}`;
	}
	insertIgnore(partialRow: PartialOrSQL<Row>, where?: SQLStatement) {
		return this.queryExec()`INSERT IGNORE INTO "${this.name}" (${partialRow as SQLValue}) ${where}`;
	}
	async tryInsert(partialRow: PartialOrSQL<Row>, where?: SQLStatement) {
		try {
			return await this.insert(partialRow, where);
		} catch (err: any) {
			if (err.code === 'ER_DUP_ENTRY') {
				return undefined;
			}
			throw err;
		}
	}
	upsert(partialRow: PartialOrSQL<Row>, partialUpdate = partialRow, where?: SQLStatement) {
		if (this.db.type === 'pg') {
			return this.queryExec(
			)`INSERT INTO "${this.name}" (${partialRow as any}) ON CONFLICT (${this.primaryKeyName
			}) DO UPDATE ${partialUpdate as any} ${where}`;
		}
		return this.queryExec(
		)`INSERT INTO "${this.name}" (${partialRow as any}) ON DUPLICATE KEY UPDATE ${partialUpdate as any} ${where}`;
	}
	set(primaryKey: BasicSQLValue, partialRow: PartialOrSQL<Row>, where?: SQLStatement) {
		if (!this.primaryKeyName) throw new Error(`Cannot set() without a single-column primary key`);
		partialRow[this.primaryKeyName] = primaryKey as any;
		return this.replace(partialRow, where);
	}
	replace(partialRow: PartialOrSQL<Row>, where?: SQLStatement) {
		return this.queryExec()`REPLACE INTO "${this.name}" (${partialRow as SQLValue}) ${where}`;
	}
	get(primaryKey: BasicSQLValue, entries?: (keyof Row & string)[] | SQLStatement) {
		if (!this.primaryKeyName) throw new Error(`Cannot get() without a single-column primary key`);
		return this.selectOne(entries)`WHERE "${this.primaryKeyName}" = ${primaryKey}`;
	}
	delete(primaryKey: BasicSQLValue) {
		if (!this.primaryKeyName) throw new Error(`Cannot delete() without a single-column primary key`);
		return this.deleteAll()`WHERE "${this.primaryKeyName}" = ${primaryKey} LIMIT 1`;
	}
	update(primaryKey: BasicSQLValue, data: PartialOrSQL<Row>) {
		if (!this.primaryKeyName) throw new Error(`Cannot update() without a single-column primary key`);
		return this.updateAll(data)`WHERE "${this.primaryKeyName}" = ${primaryKey} LIMIT 1`;
	}
}

export class MySQLDatabase extends Database<mysql.Pool, mysql.OkPacket> {
	override type = 'mysql' as const;
	constructor(config: mysql.PoolOptions & {prefix?: string}) {
		const prefix = config.prefix || "";
		if (config.prefix) {
			config = {...config};
			delete config.prefix;
		}
		super(mysql.createPool(config), prefix);
	}
	override _resolveSQL(query: SQLStatement): [query: string, values: BasicSQLValue[]] {
		let sql = query.sql[0];
		const values = [];
		for (let i = 0; i < query.values.length; i++) {
			const value = query.values[i];
			if (query.sql[i + 1].startsWith('`') || query.sql[i + 1].startsWith('"')) {
				sql = sql.slice(0, -1) + this.escapeId('' + value) + query.sql[i + 1].slice(1);
			} else {
				sql += '?' + query.sql[i + 1];
				values.push(value);
			}
		}
		return [sql, values];
	}
	override _query(query: string, values: BasicSQLValue[]): Promise<any> {
		return new Promise((resolve, reject) => {
			this.connection.query(query, values, (e, results: any) => {
				if (e) {
					return reject(new Error(`${e.message} (${query}) (${values}) [${e.code}]`));
				}
				if (Array.isArray(results)) {
					for (const row of results) {
						for (const col in row) {
							if (Buffer.isBuffer(row[col])) row[col] = row[col].toString();
						}
					}
				}
				return resolve(results);
			});
		});
	}
	override _queryExec(sql: string, values: BasicSQLValue[]): Promise<mysql.OkPacket> {
		return this._query(sql, values);
	}
	override escapeId(id: string) {
		return mysql.escapeId(id);
	}
}

export class PGDatabase extends Database<pg.Pool, {affectedRows: number | null}> {
	override type = 'pg' as const;
	constructor(config: pg.PoolConfig) {
		super(new pg.Pool(config));
	}
	override _resolveSQL(query: SQLStatement): [query: string, values: BasicSQLValue[]] {
		let sql = query.sql[0];
		const values = [];
		let paramCount = 0;
		for (let i = 0; i < query.values.length; i++) {
			const value = query.values[i];
			if (query.sql[i + 1].startsWith('`') || query.sql[i + 1].startsWith('"')) {
				sql = sql.slice(0, -1) + this.escapeId('' + value) + query.sql[i + 1].slice(1);
			} else {
				paramCount++;
				sql += `$${paramCount}` + query.sql[i + 1];
				values.push(value);
			}
		}
		return [sql, values];
	}
	override _query(query: string, values: BasicSQLValue[]) {
		return this.connection.query(query, values).then(res => res.rows);
	}
	override _queryExec(query: string, values: BasicSQLValue[]) {
		return this.connection.query<never>(query, values).then(res => ({affectedRows: res.rowCount}));
	}
	override escapeId(id: string) {
		// @ts-expect-error @types/pg really needs to be updated
		return pg.escapeIdentifier(id);
	}
}
