/**
 * Storage handling for offline PMs.
 * By Mia.
 * @author mia-pi-git
 */
import {SQL, FS} from '../../lib';
import {EXPIRY_TIME, SEEN_EXPIRY_TIME, MAX_PENDING} from '.';

export const functions: {[k: string]: (...args: any) => any} = {
	should_expire: (time) => {
		const diff = Date.now() - time;
		if (diff > EXPIRY_TIME) {
			return 1;
		}
		return 0;
	},
	seen_duration: (seen) => {
		if (!seen) return 0;
		const diff = Date.now() - seen;
		if (diff >= SEEN_EXPIRY_TIME) {
			return 1;
		}
		return 0;
	},
};

export const statements: {[k: string]: string} = {
	send: 'INSERT INTO offline_pms (sender, receiver, message, time) VALUES (?, ?, ?, ?)',
	clear: 'DELETE FROM offline_pms WHERE receiver = ?',
	fetch: 'SELECT * FROM offline_pms WHERE receiver = ?',
	fetchNew: 'SELECT * FROM offline_pms WHERE receiver = ? AND seen IS NULL',
	clearDated: 'DELETE FROM offline_pms WHERE EXISTS (SELECT * FROM offline_pms WHERE should_expire(time) = 1)',
	checkSentCount: 'SELECT count(*) as count FROM offline_pms WHERE sender = ? AND receiver = ?',
	setSeen: 'UPDATE offline_pms SET seen = ? WHERE receiver = ?',
	clearSeen: 'DELETE FROM offline_pms WHERE seen_duration(seen) = 1',
	getSettings: 'SELECT * FROM pm_settings WHERE userid = ?',
	setBlock: 'REPLACE INTO pm_settings (userid, view_only) VALUES (?, ?)',
	deleteSettings: 'DELETE FROM pm_settings WHERE userid = ?',
};

class StatementMap {
	env: SQL.TransactionEnvironment;
	constructor(env: SQL.TransactionEnvironment) {
		this.env = env;
	}
	run(name: string, args: any[] | AnyObject) {
		return this.getStatement(name).run(args);
	}
	all(name: string, args: any[] | AnyObject) {
		return this.getStatement(name).all(args);
	}
	get(name: string, args: any[] | AnyObject) {
		return this.getStatement(name).get(args);
	}
	getStatement(name: string) {
		const source = statements[name];
		return this.env.statements.get(source)!;
	}
}

export const transactions: {
	[k: string]: (args: any[], env: SQL.TransactionEnvironment) => any,
} = {
	send: (args, env) => {
		const statementList = new StatementMap(env);
		const [sender, receiver, message] = args;
		const count = statementList.get('checkSentCount', [sender, receiver])?.count;
		if (count && count > MAX_PENDING) {
			return {error: `You have already sent the maximum ${MAX_PENDING} offline PMs to that user.`};
		}
		return statementList.run('send', [sender, receiver, message, Date.now()]);
	},
	listNew: (args, env) => {
		const list = new StatementMap(env);
		const [receiver] = args;
		const pms = list.all('fetchNew', [receiver]);
		list.run('setSeen', [Date.now(), receiver]);
		return pms;
	},
};

export function onDatabaseStart(database: import('better-sqlite3').Database) {
	let version;
	try {
		version = database.prepare('SELECT * FROM db_info').get().version;
	} catch {
		const schemaContent = FS('databases/schemas/pms.sql').readSync();
		database.exec(schemaContent);
	}
	const migrations = FS('databases/migrations/pms').readdirIfExistsSync();
	if (version !== migrations.length) {
		for (const migration of migrations) {
			const num = /(\d+)\.sql$/.exec(migration)?.[1];
			if (!num || version >= num) continue;
			database.exec('BEGIN TRANSACTION');
			try {
				database.exec(FS(`databases/migrations/pms/${migration}`).readSync());
			} catch (e: any) {
				console.log(`Error in PM migration ${migration} - ${e.message}`);
				console.log(e.stack);
				database.exec('ROLLBACK');
				continue;
			}
			database.exec('COMMIT');
		}
	}
}
