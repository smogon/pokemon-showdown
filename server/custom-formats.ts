/**
 * Custom formats database handler.
 * Stores server-wide custom formats in SQLite so they persist across restarts
 * and are available to all users. Format rules are frozen at creation time.
 * @author Pokemon Showdown contributors
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore in case it isn't installed
import type * as Database from 'better-sqlite3';
import { FS, ProcessManager } from '../lib';
import * as ConfigLoader from './config-loader';
import * as path from 'path';

export const DEFAULT_FILE = FS('databases/custom-formats.db').path;
/** Matches the friends system timeout — long enough to tolerate slow disks. */
const PM_TIMEOUT = 30 * 60 * 1000;

export const CUSTOM_FORMAT_PREFIX = '[Custom] ';
export const MAX_NAME_LENGTH = 50;
export const MIN_NAME_LENGTH = 3;
export const DEFAULT_SECTION = 'Custom Formats';

export interface CustomFormatRow {
	id: string;
	display_name: string;
	base_format: string;
	section: string;
	owner: string;
	created_at: number;
	is_active: number;
}

export interface CustomFormatRule {
	format_id: string;
	rule: string;
	rule_type: string;
}

export interface BaseSnapshot {
	ruleset: string[];
	banlist: string[];
	unbanlist: string[];
	restricted: string[];
}

export interface DatabaseRequest {
	statement: string;
	type: 'all' | 'get' | 'run' | 'transaction';
	data: AnyObject | any[];
}

export interface DatabaseResult {
	error?: string;
	result?: any;
}

export class CustomFormatsDatabase {
	file: string;
	constructor(file: string = DEFAULT_FILE) {
		this.file = file === ':memory:' ? file : path.resolve(file);
	}

	static setupDatabase(fileName?: string) {
		const file = fileName || process.env.filename || DEFAULT_FILE;
		const exists = FS(file).existsSync() || file === ':memory:';
		const database: Database.Database = new (require('better-sqlite3'))(file);
		if (!exists) {
			database.exec(FS('databases/schemas/custom-formats.sql').readSync());
		} else {
			let version: string | undefined;
			try {
				version = (database
					.prepare(`SELECT value FROM db_info WHERE key = 'version'`)
					.get() as AnyObject)?.value;
			} catch {}
			const actualVersion = FS('databases/migrations/custom-formats').readdirIfExistsSync().length;
			if (version === undefined) {
				database.exec(FS('databases/schemas/custom-formats.sql').readSync());
			} else if (Number(version) !== actualVersion) {
				throw new Error(
					`Custom formats DB is at version ${version}, but the server expects version ${actualVersion}. ` +
					`Please run the migration scripts in databases/migrations/custom-formats/.`
				);
			}
		}
		for (const k in ACTIONS) {
			try {
				statements[k] = database.prepare(ACTIONS[k as keyof typeof ACTIONS]);
			} catch (e: any) {
				throw new Error(
					`Custom formats DB statement crashed: ${ACTIONS[k as keyof typeof ACTIONS]} (${e.message})`
				);
			}
		}
		return { database, statements };
	}

	private async query(input: DatabaseRequest) {
		const process = PM.acquire();
		if (!process || !Config.usesqlite) return null;
		const result = await process.query(input);
		if (result.error) throw new Chat.ErrorMessage(result.error);
		return result.result;
	}

	all(statement: string, data: any[] | AnyObject): Promise<any[] | null> {
		return this.query({ type: 'all', data, statement });
	}
	run(statement: string, data: any[] | AnyObject): Promise<{ changes: number }> {
		return this.query({ statement, data, type: 'run' });
	}
	getRow(statement: string, data: any[] | AnyObject): Promise<AnyObject | null> {
		return this.query({ statement, data, type: 'get' });
	}

	/**
	 * Returns all active custom formats as FormatData-compatible objects
	 * (without the section header wrappers — callers must add those).
	 */
	async getAll(): Promise<{ section: string, formats: import('../sim/dex-formats').FormatData[] }[]> {
		const formats = (await this.all('getActive', [])) as CustomFormatRow[] || [];
		const rules = (await this.all('getAllRules', [])) as CustomFormatRule[] || [];
		const snapshots = (await this.all('getAllSnapshots', [])) as { format_id: string, snapshot_json: string }[] || [];

		// Index for quick lookup
		const rulesByFormat = new Map<string, CustomFormatRule[]>();
		for (const rule of rules) {
			if (!rulesByFormat.has(rule.format_id)) rulesByFormat.set(rule.format_id, []);
			rulesByFormat.get(rule.format_id)!.push(rule);
		}
		const snapshotByFormat = new Map<string, BaseSnapshot>();
		for (const snap of snapshots) {
			try {
				snapshotByFormat.set(snap.format_id, JSON.parse(snap.snapshot_json));
			} catch (e: any) {
				Monitor.crashlog(new Error(`Corrupt snapshot JSON for custom format '${snap.format_id}': ${e.message}`), 'Custom formats DB');
			}
		}

		// Group by section
		const sections = new Map<string, import('../sim/dex-formats').FormatData[]>();
		for (const row of formats) {
			const snapshot = snapshotByFormat.get(row.id) || { ruleset: [], banlist: [], unbanlist: [], restricted: [] };
			const formatRules = rulesByFormat.get(row.id) || [];
			const additionalBans = formatRules.filter(r => r.rule_type === 'ban').map(r => r.rule);
			const additionalUnbans = formatRules.filter(r => r.rule_type === 'unban').map(r => r.rule);
			const additionalRestricted = formatRules.filter(r => r.rule_type === 'restrict').map(r => r.rule);
			const additionalRuleset = formatRules.filter(r => r.rule_type === 'ruleset').map(r => r.rule);

			const formatData: import('../sim/dex-formats').FormatData = {
				name: row.display_name,
				section: row.section,
				ruleset: [...snapshot.ruleset, ...additionalRuleset],
				banlist: [...snapshot.banlist, ...additionalBans],
				unbanlist: [...snapshot.unbanlist, ...additionalUnbans],
				restricted: [...snapshot.restricted, ...additionalRestricted],
				challengeShow: true,
				searchShow: true,
				tournamentShow: true,
			};
			if (!sections.has(row.section)) sections.set(row.section, []);
			sections.get(row.section)!.push(formatData);
		}

		const result: { section: string, formats: import('../sim/dex-formats').FormatData[] }[] = [];
		for (const [section, sectionFormats] of sections) {
			result.push({ section, formats: sectionFormats });
		}
		return result;
	}

	async get(id: string): Promise<{ format: CustomFormatRow, rules: CustomFormatRule[], snapshot: BaseSnapshot } | null> {
		const format = (await this.query({ type: 'get', statement: 'getOne', data: [id] })) as CustomFormatRow | null;
		if (!format) return null;
		const rules = (await this.all('getRules', [id])) as CustomFormatRule[] || [];
		const snapRow = (await this.query({ type: 'get', statement: 'getSnapshot', data: [id] })) as { snapshot_json: string } | null;
		let snapshot: BaseSnapshot = { ruleset: [], banlist: [], unbanlist: [], restricted: [] };
		if (snapRow) {
			try { snapshot = JSON.parse(snapRow.snapshot_json); } catch (e: any) {
				Monitor.crashlog(new Error(`Corrupt snapshot JSON for custom format '${id}': ${e.message}`), 'Custom formats DB');
			}
		}
		return { format, rules, snapshot };
	}

	/** Create a new custom format. Display name must NOT include the [Custom] prefix. */
	async create(
		displayName: string,
		baseFormatId: string,
		owner: string,
		snapshot: BaseSnapshot,
		section = DEFAULT_SECTION
	): Promise<string> {
		const fullName = CUSTOM_FORMAT_PREFIX + displayName;
		const id = toID(fullName);
		await this.run('insertFormat', [id, fullName, baseFormatId, section, owner, Date.now()]);
		await this.run('insertSnapshot', [id, JSON.stringify(snapshot)]);
		return id;
	}

	/** Add a rule to an existing custom format. rule_type: 'ban'|'unban'|'restrict'|'ruleset' */
	addRule(formatId: string, rule: string, ruleType: string): Promise<{ changes: number }> {
		return this.run('insertRule', [formatId, rule, ruleType]);
	}

	/** Remove a rule from a custom format. */
	removeRule(formatId: string, rule: string): Promise<{ changes: number }> {
		return this.run('deleteRule', [formatId, rule]);
	}

	/** Deactivate a custom format (soft delete). */
	deactivate(formatId: string): Promise<{ changes: number }> {
		return this.run('deactivate', [formatId]);
	}
}

const statements: { [k: string]: Database.Statement } = {};

const ACTIONS = {
	getActive: `SELECT * FROM custom_formats WHERE is_active = 1 ORDER BY created_at ASC`,
	getOne: `SELECT * FROM custom_formats WHERE id = ?`,
	getAllRules: `SELECT * FROM custom_format_rules`,
	getRules: `SELECT * FROM custom_format_rules WHERE format_id = ?`,
	getAllSnapshots: `SELECT format_id, snapshot_json FROM custom_format_base_snapshot`,
	getSnapshot: `SELECT snapshot_json FROM custom_format_base_snapshot WHERE format_id = ?`,
	insertFormat: (
		`INSERT INTO custom_formats (id, display_name, base_format, section, owner, created_at) ` +
		`VALUES (?, ?, ?, ?, ?, ?)`
	),
	insertSnapshot: `INSERT INTO custom_format_base_snapshot (format_id, snapshot_json) VALUES (?, ?)`,
	insertRule: (
		`INSERT INTO custom_format_rules (format_id, rule, rule_type) VALUES (?, ?, ?) ` +
		`ON CONFLICT (format_id, rule) DO UPDATE SET rule_type = excluded.rule_type`
	),
	deleteRule: `DELETE FROM custom_format_rules WHERE format_id = ? AND rule = ?`,
	deactivate: `UPDATE custom_formats SET is_active = 0 WHERE id = ?`,
};

/** Process manager for main-process use. */
export const PM = new ProcessManager.QueryProcessManager<DatabaseRequest, DatabaseResult>(
	'custom-formats',
	module,
	query => {
		const { type, statement, data } = query;
		const startTime = Date.now();
		const result: DatabaseResult = {};
		try {
			switch (type) {
			case 'run':
				result.result = statements[statement].run(data);
				break;
			case 'get':
				result.result = statements[statement].get(data);
				break;
			case 'all':
				result.result = statements[statement].all(data);
				break;
			}
		} catch (e: any) {
			result.error = "Sorry! The database process crashed. We've been notified and will fix this.";
			Monitor.crashlog(e, 'A custom-formats database process', query);
			return result;
		}
		const delta = Date.now() - startTime;
		if (delta > 1000) Monitor.slow(`[Slow custom-formats query] ${JSON.stringify(query)}`);
		return result;
	},
	PM_TIMEOUT,
	message => {
		if (message.startsWith('SLOW\n')) Monitor.slow(message.slice(5));
	}
);

if (!PM.isParentProcess) {
	ConfigLoader.ensureLoaded();
	if (Config.usesqlite) {
		CustomFormatsDatabase.setupDatabase();
	}
	global.Monitor = {
		crashlog(error: Error, source = 'A custom-formats database process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
		slow(message: string) {
			process.send!(`CALLBACK\nSLOW\n${message}`);
		},
	} as any;
	process.on('uncaughtException', err => {
		if (Config.crashguard) Monitor.crashlog(err, 'A custom-formats child process');
	});
	// eslint-disable-next-line no-eval
	PM.startRepl(cmd => eval(cmd));
}

export function start(processCount: ConfigLoader.SubProcessesConfig) {
	PM.spawn(processCount['customformats'] ?? 1);
}

export function destroy() {
	void PM.destroy();
}
