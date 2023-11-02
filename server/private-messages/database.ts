/**
 * Storage handling for offline PMs.
 * By Mia.
 * @author mia-pi-git
 */
import {SQL, FS} from '../../lib';
import {findFriendship} from '../friends';
import {EXPIRY_TIME, SEEN_EXPIRY_TIME, MAX_PENDING} from '.';
import {Config} from '../config-loader';
import {GlobalAuth, Auth} from '../user-groups';

if (!global.Config) global.Config = Config;
const globalAuth = new GlobalAuth(); // for blockpms

function authAtLeast(userid: ID, symbol: GroupSymbol) {
	return Auth.atLeast(globalAuth.get(userid), symbol);
}

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
		const settings = statementList.get('getSettings', [receiver]);
		const requirement = Config.usesqlitepms || settings?.view_only;
		if (requirement) {
			switch (requirement) {
			case 'friends':
				if (!findFriendship([sender, receiver])) {
					if (Config.usesqlitepms === 'friends') {
						return {error: `At this time, you may only send offline PMs to friends. ${receiver} is not friends with you.`};
					}
					return {error: `${receiver} is only accepting offline PMs from friends at this time.`};
				}
				break;
			case 'trusted':
				if (!globalAuth.has(toID(sender))) {
					return {error: `${receiver} is currently blocking offline PMs from non-trusted users.`};
				}
				break;
			case 'none':
				// drivers+ can override
				if (!authAtLeast(sender, '%')) {
					return {error: `${receiver} has indicated that they do not wish to receive offine PMs.`};
				}
				break;
			default:
				if (!authAtLeast(receiver, requirement)) {
					if (settings?.view_only) {
						return {error: `That user is not allowing offline PMs from your rank at this time.`};
					}
					return {error: 'You do not meet the rank requirement to send offline PMs at this time.'};
				}
				break;
			}
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
