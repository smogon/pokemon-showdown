/**
 * Storage handling for offline PMs.
 * By Mia.
 * @author mia-pi-git
 */
import { type SQL, FS } from '../../lib';
import { MAX_PENDING } from '.';

export const statements = {
	send: 'INSERT INTO offline_pms (sender, receiver, message, time) VALUES (?, ?, ?, ?)',
	clear: 'DELETE FROM offline_pms WHERE receiver = ?',
	fetch: 'SELECT * FROM offline_pms WHERE receiver = ?',
	fetchNew: 'SELECT * FROM offline_pms WHERE receiver = ? AND seen IS NULL',
	clearDated: 'DELETE FROM offline_pms WHERE ? - time >= ?',
	checkSentCount: 'SELECT count(*) as count FROM offline_pms WHERE sender = ? AND receiver = ?',
	setSeen: 'UPDATE offline_pms SET seen = ? WHERE receiver = ? AND seen IS NULL',
	clearSeen: 'DELETE FROM offline_pms WHERE ? - seen >= ?',
	getSettings: 'SELECT * FROM pm_settings WHERE userid = ?',
	setBlock: 'REPLACE INTO pm_settings (userid, view_only) VALUES (?, ?)',
	deleteSettings: 'DELETE FROM pm_settings WHERE userid = ?',
} as const;

type Statement = keyof typeof statements;

class StatementMap {
	env: SQL.TransactionEnvironment;
	constructor(env: SQL.TransactionEnvironment) {
		this.env = env;
	}
	run(name: Statement, args: any[] | AnyObject) {
		return this.getStatement(name).run(args);
	}
	all(name: Statement, args: any[] | AnyObject) {
		return this.getStatement(name).all(args);
	}
	get(name: Statement, args: any[] | AnyObject) {
		return this.getStatement(name).get(args);
	}
	getStatement(name: Statement) {
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
			return { error: `You have already sent the maximum ${MAX_PENDING} offline PMs to that user.` };
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
