/**
 * User preferences database handler.
 * Stores per-user client preferences server-side so they persist across
 * devices and browsers instead of relying solely on localStorage.
 * @author Pokemon Showdown contributors
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore in case it isn't installed
import type * as Database from 'better-sqlite3';
import { FS, ProcessManager } from '../lib';
import * as ConfigLoader from './config-loader';
import * as path from 'path';

export const DEFAULT_FILE = FS('databases/user-preferences.db').path;
/** Matches the friends system timeout — long enough to tolerate slow disks. */
const PM_TIMEOUT = 30 * 60 * 1000;

/** Maximum character length for a preference value. */
export const MAX_PREFERENCE_VALUE_LENGTH = 2000;

/** Keys that clients are permitted to store. */
export const ALLOWED_PREFERENCE_KEYS = new Set([
	'autojoin', 'closedrightnav', 'customcss', 'dark', 'disableladdermod', 'fpsbattle',
	'hideavatars', 'hidechallenges', 'hidejoinleave', 'hidelobbychat', 'hidenews',
	'ignorebots', 'incognito', 'language', 'logchat', 'logchatbackground', 'noanim',
	'nofx', 'nointro', 'noselfhighlight', 'nounban', 'nouserstats', 'bwgfx',
	'oras', 'recentbattles', 'rightpanelbp', 'showjoins', 'showdexlink',
	'sfxvolume', 'sound', 'theme', 'tournatify', 'volume', 'sr',
]);

export interface DatabaseRequest {
	statement: string;
	type: 'all' | 'get' | 'run';
	data: AnyObject | any[];
}

export interface DatabaseResult {
	error?: string;
	result?: any;
}

export class UserPreferencesDatabase {
	file: string;
	constructor(file: string = DEFAULT_FILE) {
		this.file = file === ':memory:' ? file : path.resolve(file);
	}

	static setupDatabase(fileName?: string) {
		const file = fileName || process.env.filename || DEFAULT_FILE;
		const exists = FS(file).existsSync() || file === ':memory:';
		const database: Database.Database = new (require('better-sqlite3'))(file);
		if (!exists) {
			database.exec(FS('databases/schemas/user-preferences.sql').readSync());
		} else {
			let version: string | undefined;
			try {
				version = (database
					.prepare(`SELECT value FROM db_info WHERE key = 'version'`)
					.get() as AnyObject)?.value;
			} catch {}
			const actualVersion = FS('databases/migrations/user-preferences').readdirIfExistsSync().length;
			if (version === undefined) {
				database.exec(FS('databases/schemas/user-preferences.sql').readSync());
			} else if (Number(version) !== actualVersion) {
				throw new Error(
					`User preferences DB is at version ${version}, but the server expects version ${actualVersion}. ` +
					`Please run the migration scripts in databases/migrations/user-preferences/.`
				);
			}
		}

		for (const k in ACTIONS) {
			try {
				statements[k] = database.prepare(ACTIONS[k as keyof typeof ACTIONS]);
			} catch (e: any) {
				throw new Error(
					`User preferences DB statement crashed: ${ACTIONS[k as keyof typeof ACTIONS]} (${e.message})`
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
	get(statement: string, data: any[] | AnyObject): Promise<AnyObject | null> {
		return this.query({ statement, data, type: 'get' });
	}

	/** Load all preferences for a user. */
	async load(userid: string): Promise<Record<string, string>> {
		const rows = await this.all('getAll', [userid]) || [];
		const out: Record<string, string> = {};
		for (const row of rows) out[row.key] = row.value;
		return out;
	}

	/** Upsert a single preference. Written immediately. */
	set(userid: string, key: string, value: string): Promise<{ changes: number }> {
		return this.run('upsert', [userid, key, value, Date.now()]);
	}

	/** Remove a single preference key. */
	delete(userid: string, key: string): Promise<{ changes: number }> {
		return this.run('deleteOne', [userid, key]);
	}

	/** Remove all preferences for a user (GDPR erasure). */
	deleteAll(userid: string): Promise<{ changes: number }> {
		return this.run('deleteAll', [userid]);
	}
}

const statements: { [k: string]: Database.Statement } = {};

const ACTIONS = {
	getAll: `SELECT key, value FROM user_preferences WHERE userid = ?`,
	upsert: (
		`INSERT INTO user_preferences (userid, key, value, updated_at) VALUES (?, ?, ?, ?) ` +
		`ON CONFLICT (userid, key) DO UPDATE SET value = excluded.value, updated_at = excluded.updated_at`
	),
	deleteOne: `DELETE FROM user_preferences WHERE userid = ? AND key = ?`,
	deleteAll: `DELETE FROM user_preferences WHERE userid = ?`,
};

/** Process manager for main-process use. */
export const PM = new ProcessManager.QueryProcessManager<DatabaseRequest, DatabaseResult>(
	'user-preferences',
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
			Monitor.crashlog(e, 'A user-preferences database process', query);
			return result;
		}
		const delta = Date.now() - startTime;
		if (delta > 1000) Monitor.slow(`[Slow user-preferences query] ${JSON.stringify(query)}`);
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
		UserPreferencesDatabase.setupDatabase();
	}
	global.Monitor = {
		crashlog(error: Error, source = 'A user-preferences database process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
		slow(message: string) {
			process.send!(`CALLBACK\nSLOW\n${message}`);
		},
	} as any;
	process.on('uncaughtException', err => {
		if (Config.crashguard) Monitor.crashlog(err, 'A user-preferences child process');
	});
	// eslint-disable-next-line no-eval
	PM.startRepl(cmd => eval(cmd));
}

export function start(processCount: ConfigLoader.SubProcessesConfig) {
	PM.spawn(processCount['userprefs'] ?? 1);
}

export function destroy() {
	void PM.destroy();
}
