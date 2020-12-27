/**
 * Friends chat-plugin database handler.
 * @author mia-pi-git
 */
import * as Database from 'better-sqlite3';
import {Utils} from '../lib/utils';
import {FS} from '../lib/fs';
import {ProcessManager, ProcessWrapper, ChildProcess} from '../lib/process-manager';
import * as child_process from 'child_process';
import {Config} from './config-loader';
import {Cache} from '../lib/cache';
import * as path from 'path';

/** Max friends per user */
export const MAX_FRIENDS = 100;
/** Max friend requests. */
export const MAX_REQUESTS = 6;
export const DEFAULT_FILE = `${__dirname}/../databases/friends.db`;
const REQUEST_EXPIRY_TIME = 30 * 24 * 60 * 60 * 1000;

export interface DatabaseRequest {
	statement: string;
	type: 'all' | 'get' | 'run' | 'transaction';
	data: AnyObject | any[];
}

export interface DatabaseResult {
	/** Specify this to return an error message to the user */
	error?: string;
	result?: any;
}

export function sendPM(message: string, to: string, from = '&') {
	const senderID = toID(to);
	const receiverID = toID(from);
	const sendingUser = Users.get(senderID);
	const receivingUser = Users.get(receiverID);
	const fromIdentity = sendingUser ? sendingUser.getIdentity() : ` ${senderID}`;
	const toIdentity = receivingUser ? receivingUser.getIdentity() : ` ${receiverID}`;

	if (from === '&') {
		return sendingUser?.send(`|pm|&|${toIdentity}|${message}`);
	}
	if (sendingUser) {
		sendingUser.send(`|pm|${fromIdentity}|${toIdentity}|${message}`);
	}
	if (receivingUser) {
		receivingUser.send(`|pm|${fromIdentity}|${toIdentity}|${message}`);
	}
}

export class FriendsDatabase {
	file: string;
	process: FriendsProcess;
	cache: Cache<Set<string>>;
	constructor(file: string = DEFAULT_FILE) {
		this.file = file === ':memory:' ? file : path.resolve(file);
		this.process = PM.createProcess(this.file);
		this.cache = new Cache<Set<string>>(async user => {
			const data = await this.getFriends(user as ID);
			return new Set(data.map(f => f.friend));
		});
	}
	getFriends(userid: ID): Promise<AnyObject[]> {
		const data = [userid, MAX_FRIENDS];
		return this.query({
			statement: 'get', type: 'all', data,
		});
	}
	async getRequests(user: User) {
		const sent: Set<string> = new Set();
		const received: Set<string> = new Set();
		if (user.settings.blockFriendRequests) {
			// delete any pending requests that may have been sent to them while offline and return
			await this.query({
				statement: 'deleteRequest', type: 'run', data: [user.id],
			});
			return {sent, received};
		}
		const sentResults = await this.query({
			statement: 'getSent', type: 'all', data: [user.id],
		});
		for (const request of sentResults) {
			sent.add(request.receiver);
		}
		const receivedResults = await this.query({
			statement: 'getReceived', data: [user.id], type: 'all',
		});
		for (const request of receivedResults) {
			received.add(request.sender);
		}
		return {sent, received};
	}
	private async query(input: DatabaseRequest) {
		const result = await this.process.query(input);
		if (result.error) {
			throw new Chat.ErrorMessage(result.error);
		}
		return result.result;
	}
	async request(user: User, receiverID: ID) {
		const receiver = Users.get(receiverID);
		if (receiver?.settings.blockFriendRequests) {
			throw new Chat.ErrorMessage(`${receiver.name} is blocking friend requests.`);
		}
		let buf = Utils.html`/raw <button class="button" name="send" value="/friends accept ${user.id}">Accept</button> | `;
		buf += Utils.html`<button class="button" name="send" value="/friends reject ${user.id}">Deny</button><br /> `;
		buf += `<small>(You can also stop this user from sending you friend requests with <code>/ignore</code>)</small>`;
		const disclaimer = (
			`/raw <small>Note: If this request is accepted, your friend will be notified when you come online, ` +
			`and you will be notified when they do, unless you opt out of receiving them.</small>`
		);
		if (receiver?.settings.blockFriendRequests) {
			throw new Chat.ErrorMessage(`This user is blocking friend requests.`);
		}
		if (receiver?.settings.blockPMs) {
			throw new Chat.ErrorMessage(`This user is blocking PMs, and cannot be friended right now.`);
		}

		const result = await this.query({type: 'transaction', data: [user.id, receiverID], statement: 'send'});
		if (receiver) {
			sendPM(`/text ${Utils.escapeHTML(user.name)} sent you a friend request!`, receiver.id);
			sendPM(buf, receiver.id);
			sendPM(disclaimer, receiver.id);
		}
		sendPM(`/nonotify You sent a friend request to ${receiver?.connected ? receiver.name : receiverID}!`, user.id);
		sendPM(
			`/raw <button class="button" name="send" value="/friends undorequest ${Utils.escapeHTML(receiverID)}">` +
			`<i class="fa fa-undo"></i> Undo</button>`, user.id
		);
		sendPM(disclaimer, user.id);
		return result;
	}
	async removeRequest(receiverID: ID, senderID: ID) {
		if (!senderID) throw new Chat.ErrorMessage(`Invalid sender username.`);
		if (!receiverID) throw new Chat.ErrorMessage(`Invalid receiver username.`);

		return this.query({
			statement: 'deleteRequest', data: [senderID, receiverID], type: 'run',
		});
	}
	async approveRequest(receiverID: ID, senderID: ID) {
		return this.query({type: 'transaction', data: [senderID, receiverID], statement: 'accept'});
	}
	async removeFriend(userid: ID, friendID: ID) {
		if (!friendID || !userid) throw new Chat.ErrorMessage(`Invalid usernames supplied.`);

		const result = await this.query({
			statement: 'delete', type: 'run', data: {user1: userid, user2: friendID},
		});
		if (result.changes < 1) {
			throw new Chat.ErrorMessage(`You do not have ${friendID} friended.`);
		}
	}
	writeLogin(user: ID) {
		return this.query({
			statement: 'login', type: 'run', data: [user, Date.now(), Date.now()],
		});
	}
	hideLoginData(id: ID) {
		return this.query({
			statement: 'hideLogin', type: 'run', data: [id, Date.now()],
		});
	}
	allowLoginData(id: ID) {
		return this.query({
			statement: 'showLogin', type: 'run', data: [id],
		});
	}
	async getLastLogin(userid: ID) {
		const result = await this.query({statement: 'checkLastLogin', type: 'get', data: [userid]});
		return parseInt(result['last_login']);
	}
	getSettings(userid: ID) {
		return this.query({statement: 'getSettings', type: 'get', data: [userid]});
	}
	setHideList(userid: ID, setting: boolean) {
		const num = setting ? 1 : 0;
		// name, send_login_data, last_login, public_list
		return this.query({statement: 'toggleList', type: 'run', data: [userid, num, num]});
	}
}

const statements: {[k: string]: Database.Statement} = {};
const transactions: {[k: string]: Database.Transaction} = {};

class FriendsProcess implements ProcessWrapper {
	filename: string;
	process: ChildProcess;
	requests: Map<number, (...args: any) => any>;
	constructor(filename: string) {
		this.filename = filename;
		this.process = child_process.fork(__filename, {env: {filename}});
		this.requests = new Map();
		this.process.on('message', (message: string) => {
			if (message.startsWith('THROW\n')) {
				const error = new Error();
				error.stack = message.slice(6);
				throw error;
			}
			const [task, raw] = message.split('\n');
			const result = JSON.parse(raw);
			const taskId = parseInt(task);
			const resolve = this.requests.get(taskId);
			if (resolve) {
				this.requests.delete(taskId);
				return resolve(result);
			}
			throw new Error(`Missing result resolver for task ${task}`);
		});
	}
	getLoad() {
		return this.requests.size;
	}
	getProcess() {
		return this.process;
	}
	release() {
		for (const task of this.requests.values()) {
			task({error: 'The database process was destroyed.'});
		}
		this.process.kill();
		return Promise.resolve();
	}
	query(input: DatabaseRequest) {
		const task = this.getLoad() + 1;
		return new Promise<DatabaseResult>(resolve => {
			this.process.send(`${task}\n${JSON.stringify(input)}`);
			this.requests.set(task, resolve);
		});
	}
}

export class FriendsProcessManager extends ProcessManager {
	processes: FriendsProcess[];
	constructor() {
		super(module);
		this.processes = [];
		this.listen();
	}
	createProcess(file: string) {
		const process = new FriendsProcess(file);
		this.processes.push(process);
		return process;
	}
	listen() {
		if (this.isParentProcess) return;
		// ignore the error here and let it be handled by Monitor
		process.on('error', () => {
			process.exit();
		});
		process.on('disconnect', () => {
			process.exit();
		});
	}
}

const ACTIONS = {
	add: (
		`REPLACE INTO friends (user1, user2) VALUES($user1, $user2) ON CONFLICT (user1, user2) ` +
		`DO UPDATE SET user1 = $user1, user2 = $user2`
	),
	get: (
		`SELECT * ` +
		`FROM friends_simplified LEFT JOIN friend_settings USING (userid) WHERE userid = ? LIMIT ?`
	),
	// may look duplicated, but you pass in [userid1, userid2, userid2, userid1]
	delete: `DELETE FROM friends WHERE (user1 = $user1 AND user2 = $user2) OR (user1 = $user2 AND user2 = $user1)`,
	getSent: `SELECT receiver, sender FROM friend_requests WHERE sender = ?`,
	getReceived: `SELECT receiver, sender FROM friend_requests WHERE receiver = ?`,
	insertRequest: `INSERT INTO friend_requests(sender, receiver, sent_at) VALUES(?, ?, ?)`,
	deleteRequest: `DELETE FROM friend_requests WHERE sender = ? AND receiver = ?`,
	findFriendship: `SELECT * FROM friends WHERE (user1 = $user1 AND user2 = $user2) OR (user2 = $user1 AND user1 = $user2)`,
	findRequest: (
		`SELECT count(*) as num FROM friend_requests WHERE ` +
		`(sender = $user1 AND receiver = $user2) OR (sender = $user2 AND receiver = $user1)`
	),
	countRequests: `SELECT count(*) as num FROM friend_requests WHERE (sender = ? OR receiver = ?)`,
	login: (
		`INSERT INTO friend_settings (userid, send_login_data, last_login, public_list) VALUES (?, 0, ?, 0) ` +
		`ON CONFLICT (userid) DO UPDATE SET last_login = ?`
	),
	checkLastLogin: `SELECT last_login FROM friend_settings WHERE userid = ?`,
	deleteLogin: `UPDATE friend_settings SET last_login = 0 WHERE userid = ?`,
	expire: (
		`DELETE FROM friend_requests WHERE EXISTS` +
		`(SELECT sent_at FROM friend_requests WHERE should_expire(sent_at) = 1)`
	),
	hideLogin: (
		`INSERT INTO friend_settings (userid, send_login_data, last_login, public_list) VALUES (?, 1, ?, ?) ` +
		`ON CONFLICT (userid) DO UPDATE SET send_login_data = 1`
	),
	showLogin: `DELETE FROM friend_settings WHERE userid = ? AND send_login_data = 1`,
	countFriends: `SELECT count(*) as num FROM friends WHERE (user1 = ? OR user2 = ?)`,
	getSettings: `SELECT * FROM friend_settings WHERE userid = ?`,
	toggleList: (
		`INSERT INTO friend_settings (userid, send_login_data, last_login, public_list) VALUES (?, 0, 0, ?) ` +
		`ON CONFLICT (userid) DO UPDATE SET public_list = ?`
	),
};

const FUNCTIONS: {[k: string]: (...input: any[]) => any} = {
	'should_expire': (sentTime: number) => {
		if (Date.now() - sentTime > REQUEST_EXPIRY_TIME) return 1;
		return 0;
	},
};

const TRANSACTIONS: {[k: string]: (input: any[]) => DatabaseResult} = {
	send: requests => {
		for (const request of requests) {
			const [senderID, receiverID] = request;
			const hasSentRequest = statements.findRequest.get({user1: senderID, user2: receiverID})['num'];
			const friends = statements.countFriends.get(senderID, senderID)['num'];
			const totalRequests = statements.countRequests.get(senderID, senderID)['num'];
			if (friends >= MAX_FRIENDS) {
				throw new Chat.ErrorMessage(`You are at the maximum number of friends.`);
			}
			const existingFriendship = statements.findFriendship.all({user1: senderID, user2: receiverID});
			if (existingFriendship.length) {
				throw new Chat.ErrorMessage(`You are already friends with '${receiverID}'.`);
			}
			if (hasSentRequest) {
				throw new Chat.ErrorMessage(`You have already sent a friend request to '${receiverID}'.`);
			}
			if (totalRequests >= MAX_REQUESTS) {
				throw new Chat.ErrorMessage(
					`You already have ${MAX_REQUESTS} outgoing friend requests. Use "/friends view sent" to see your outgoing requests.`
				);
			}
			statements.insertRequest.run(senderID, receiverID, Date.now());
		}
		return {result: []};
	},
	add: requests => {
		for (const request of requests) {
			const [senderID, receiverID] = request;
			statements.add.run({user1: senderID, user2: receiverID});
		}
		return {result: []};
	},
	accept: requests => {
		for (const request of requests) {
			const [, receiverID] = request;
			const results = TRANSACTIONS.removeRequest([request]);
			if (!results) throw new Chat.ErrorMessage(`You have no request pending from ${receiverID}.`);
			TRANSACTIONS.add([request]);
		}
		return {result: []};
	},
	removeRequest: requests => {
		const result = [];
		for (const request of requests) {
			const [to, from] = request;
			const {changes} = statements.deleteRequest.run(to, from);
			if (changes) result.push(changes);
		}
		return {result};
	},
};

let database: Database.Database;
// if friends.database exists, Config.usesqlite is on.
if (process.send) {
	global.Config = (require as any)('./config-loader').Config;
	if (Config.usesqlite) {
		const file = process.env.filename as string || DEFAULT_FILE;
		const exists = FS(file).existsSync() || file === ':memory:';
		database = new Database(file);
		if (!exists) {
			database.exec(FS('databases/schemas/friends.sql').readSync());
		} else {
			let val;
			try {
				val = database.prepare(`SELECT val FROM database_settings WHERE name = 'version'`).get().val;
			} catch (e) {}
			const actualVersion = FS(`databases/migrations/`).readdirSync().length;
			if (val === undefined) {
				// hasn't been set up before, write new version.
				database.exec(FS('databases/schemas/friends.sql').readSync());
			}
			if (typeof val === 'number' && val !== actualVersion) {
				throw new Error(`Friends DB is out of date, please migrate to latest version.`);
			}
		}
		database.exec(FS(`databases/schemas/friends-startup.sql`).readSync());

		for (const k in FUNCTIONS) {
			database.function(k, FUNCTIONS[k]);
		}

		for (const k in ACTIONS) {
			try {
				statements[k] = database.prepare(ACTIONS[k as keyof typeof ACTIONS]);
			} catch (e) {
				throw new Error(`Friends DB statement crashed: ${ACTIONS[k as keyof typeof ACTIONS]} (${e.message})`);
			}
		}

		for (const k in TRANSACTIONS) {
			transactions[k] = database.transaction(TRANSACTIONS[k]);
		}

		statements.expire.run();
	}
	global.Monitor = {
		crashlog(error: Error, source = 'A friends database process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			// @ts-ignore please be silent
			process.send(`THROW\n@!!@${repr}\n${error.stack}`);
		},
	};
	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			Monitor.crashlog(err, 'A friends child process');
		}
	});

	const send = (task: string, res: any) => process.send!(`${task}\n${JSON.stringify(res)}`);

	process.on('message', (message: string) => {
		const [task, raw] = message.split('\n');
		if (!raw.startsWith('{')) return;
		const query = JSON.parse(raw);
		const {type, statement, data} = query;
		let result: any = '';
		const cached = statements[statement];
		try {
			switch (type) {
			case 'all':
				result = cached.all(data);
				break;
			case 'get':
				result = cached.get(data);
				break;
			case 'run':
				result = cached.run(data);
				break;
			case 'transaction':
				const transaction = transactions[statement];
				result = transaction([data]);
				break;
			}
		} catch (e) {
			if (!e.name.endsWith('ErrorMessage')) {
				Monitor.crashlog(e, 'A friends database process', query);
				return send(task, {error: `Sorry! The database crashed. We've been notified and will fix this.`});
			}
			return send(task, {error: e.message});
		}
		if (!result) result = {};
		if (result.result) result = result.result;
		return send(task, {result} || {error: 'Unknown error in database query.'});
	});
}

export const PM = new FriendsProcessManager();
