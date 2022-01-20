/**
 * Friends chat-plugin database handler.
 * @author mia-pi-git
 */
// @ts-ignore in case it isn't installed
import type * as Database from 'better-sqlite3';
import {Utils, FS, ProcessManager, Repl} from '../lib';
import {Config} from './config-loader';
import * as path from 'path';

/** Max friends per user */
export const MAX_FRIENDS = 100;
/** Max friend requests. */
export const MAX_REQUESTS = 6;
export const DEFAULT_FILE = `${__dirname}/../databases/friends.db`;
const REQUEST_EXPIRY_TIME = 30 * 24 * 60 * 60 * 1000;
const PM_TIMEOUT = 30 * 60 * 1000;

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

export interface Friend {
	/** Always the same as Friend#friend. Use whichever you want. */
	userid: ID;
	/** Always the same as Friend#userid. Use whichever you want. */
	friend: ID;
	send_login_data: number;
	last_login: number;
	public_list: number;
	allowing_login: number;
}

/** Like Chat.ErrorMessage, but made for the subprocess so we can throw errors to the user not using errorMessage
 * because errorMessage crashes when imported (plus we have to spawn dex, etc, all unnecessary - this is easier)
 */
export class FailureMessage extends Error {
	constructor(message: string) {
		super(message);
		this.name = 'FailureMessage';
		Error.captureStackTrace(this, FailureMessage);
	}
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

function canPM(sender: User, receiver: User | null) {
	if (!receiver || !receiver.settings.blockPMs) return true;
	if (receiver.settings.blockPMs === true) return sender.can('lock');
	if (receiver.settings.blockPMs === 'friends') return false;
	return Users.globalAuth.atLeast(sender, receiver.settings.blockPMs);
}

export class FriendsDatabase {
	file: string;
	constructor(file: string = DEFAULT_FILE) {
		this.file = file === ':memory:' ? file : path.resolve(file);
	}
	async updateUserCache(user: User) {
		user.friends = new Set(); // we clear to account for users who may have been deleted
		const friends = await this.getFriends(user.id);
		for (const friend of friends) {
			user.friends.add(friend.userid);
		}
		return user.friends;
	}
	static setupDatabase(fileName?: string) {
		const file = fileName || process.env.filename || DEFAULT_FILE;
		const exists = FS(file).existsSync() || file === ':memory:';
		const database: Database.Database = new (require('better-sqlite3'))(file);
		if (!exists) {
			database.exec(FS('databases/schemas/friends.sql').readSync());
		} else {
			let val;
			try {
				val = database.prepare(`SELECT val FROM database_settings WHERE name = 'version'`).get().val;
			} catch {}
			const actualVersion = FS(`databases/migrations/friends`).readdirIfExistsSync().length;
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
			} catch (e: any) {
				throw new Error(`Friends DB statement crashed: ${ACTIONS[k as keyof typeof ACTIONS]} (${e.message})`);
			}
		}

		for (const k in TRANSACTIONS) {
			transactions[k] = database.transaction(TRANSACTIONS[k]);
		}

		statements.expire.run();
		return database;
	}
	async getFriends(userid: ID): Promise<Friend[]> {
		return (await this.all('get', [userid, MAX_FRIENDS])) || [];
	}
	async getRequests(user: User) {
		const sent: Set<string> = new Set();
		const received: Set<string> = new Set();
		if (user.settings.blockFriendRequests) {
			// delete any pending requests that may have been sent to them while offline
			// we used to return but we will not since you can send requests while blocking
			await this.run('deleteReceivedRequests', [user.id]);
		}
		const sentResults = await this.all('getSent', [user.id]);
		if (sentResults === null) return {sent, received};
		for (const request of sentResults) {
			sent.add(request.receiver);
		}
		const receivedResults = await this.all('getReceived', [user.id]) || [];
		if (!Array.isArray(receivedResults)) {
			Monitor.crashlog(new Error("Malformed results received"), 'A friends process', {
				user: user.id,
				result: JSON.stringify(receivedResults),
			});
			return {received, sent};
		}
		for (const request of receivedResults) {
			received.add(request.sender);
		}
		return {sent, received};
	}
	all(statement: string, data: any[] | AnyObject) {
		return this.query({type: 'all', data, statement});
	}
	transaction(statement: string, data: any[] | AnyObject) {
		return this.query({data, statement, type: 'transaction'});
	}
	run(statement: string, data: any[] | AnyObject) {
		return this.query({statement, data, type: 'run'});
	}
	get(statement: string, data: any[] | AnyObject) {
		return this.query({statement, data, type: 'get'});
	}
	private async query(input: DatabaseRequest) {
		const process = PM.acquire();
		if (!process || !Config.usesqlite) {
			return {result: null};
		}
		const result = await process.query(input);
		if (result.error) {
			throw new Chat.ErrorMessage(result.error);
		}
		return result.result;
	}
	async request(user: User, receiverID: ID) {
		const receiver = Users.getExact(receiverID);
		if (receiverID === user.id || receiver?.previousIDs.includes(user.id)) {
			throw new Chat.ErrorMessage(`You can't friend yourself.`);
		}
		if (receiver?.settings.blockFriendRequests) {
			throw new Chat.ErrorMessage(`${receiver.name} is blocking friend requests.`);
		}
		let buf = Utils.html`/uhtml sent-${user.id},<button class="button" name="send" value="/friends accept ${user.id}">Accept</button> | `;
		buf += Utils.html`<button class="button" name="send" value="/friends reject ${user.id}">Deny</button><br /> `;
		buf += `<small>(You can also stop this user from sending you friend requests with <code>/ignore</code>)</small>`;
		const disclaimer = (
			`/raw <small>Note: If this request is accepted, your friend will be notified when you come online, ` +
			`and you will be notified when they do, unless you opt out of receiving them.</small>`
		);
		if (receiver?.settings.blockFriendRequests) {
			throw new Chat.ErrorMessage(`This user is blocking friend requests.`);
		}
		if (!canPM(user, receiver)) {
			throw new Chat.ErrorMessage(`This user is blocking PMs, and cannot be friended right now.`);
		}

		const result = await this.transaction('send', [user.id, receiverID]);
		if (receiver) {
			sendPM(`/raw <span class="username">${user.name}</span> sent you a friend request!`, receiver.id);
			sendPM(buf, receiver.id);
			sendPM(disclaimer, receiver.id);
		}
		sendPM(
			`/nonotify You sent a friend request to ${receiver?.connected ? receiver.name : receiverID}!`,
			user.name
		);
		sendPM(
			`/uhtml undo-${receiverID},<button class="button" name="send" value="/friends undorequest ${Utils.escapeHTML(receiverID)}">` +
			`<i class="fa fa-undo"></i> Undo</button>`, user.name
		);
		sendPM(disclaimer, user.id);
		return result;
	}
	async removeRequest(receiverID: ID, senderID: ID) {
		if (!senderID) throw new Chat.ErrorMessage(`Invalid sender username.`);
		if (!receiverID) throw new Chat.ErrorMessage(`Invalid receiver username.`);

		return this.run('deleteRequest', [senderID, receiverID]);
	}
	async approveRequest(receiverID: ID, senderID: ID) {
		return this.transaction('accept', [senderID, receiverID]);
	}
	async removeFriend(userid: ID, friendID: ID) {
		if (!friendID || !userid) throw new Chat.ErrorMessage(`Invalid usernames supplied.`);

		const result = await this.run('delete', {user1: userid, user2: friendID});
		if (result.changes < 1) {
			throw new Chat.ErrorMessage(`You do not have ${friendID} friended.`);
		}
	}
	writeLogin(user: ID) {
		return this.run('login', [user, Date.now(), Date.now()]);
	}
	hideLoginData(id: ID) {
		return this.run('hideLogin', [id, Date.now()]);
	}
	allowLoginData(id: ID) {
		return this.run('showLogin', [id]);
	}
	async getLastLogin(userid: ID) {
		const result = await this.get('checkLastLogin', [userid]);
		return parseInt(result?.['last_login']) || null;
	}
	async getSettings(userid: ID) {
		return (await this.get('getSettings', [userid])) || {};
	}
	setHideList(userid: ID, setting: boolean) {
		const num = setting ? 1 : 0;
		// name, send_login_data, last_login, public_list
		return this.run('toggleList', [userid, num, num]);
	}
}

const statements: {[k: string]: Database.Statement} = {};
const transactions: {[k: string]: Database.Transaction} = {};

const ACTIONS = {
	add: (
		`REPLACE INTO friends (user1, user2) VALUES ($user1, $user2) ON CONFLICT (user1, user2) ` +
		`DO UPDATE SET user1 = $user1, user2 = $user2`
	),
	get: (
		`SELECT * FROM friends_simplified f LEFT JOIN friend_settings fs ON f.friend = fs.userid WHERE f.userid = ? LIMIT ?`
	),
	delete: `DELETE FROM friends WHERE (user1 = $user1 AND user2 = $user2) OR (user1 = $user2 AND user2 = $user1)`,
	getSent: `SELECT receiver, sender FROM friend_requests WHERE sender = ?`,
	getReceived: `SELECT receiver, sender FROM friend_requests WHERE receiver = ?`,
	insertRequest: `INSERT INTO friend_requests(sender, receiver, sent_at) VALUES (?, ?, ?)`,
	deleteRequest: `DELETE FROM friend_requests WHERE sender = ? AND receiver = ?`,
	deleteReceivedRequests: `DELETE FROM friend_requests WHERE receiver = ?`,
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
	hideLogin: ( // this works since if the insert works, they have no data, which means no public_list
		`INSERT INTO friend_settings (userid, send_login_data, last_login, public_list) VALUES (?, 1, ?, 0) ` +
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
				throw new FailureMessage(`You are at the maximum number of friends.`);
			}
			const existingFriendship = statements.findFriendship.all({user1: senderID, user2: receiverID});
			if (existingFriendship.length) {
				throw new FailureMessage(`You are already friends with '${receiverID}'.`);
			}
			if (hasSentRequest) {
				throw new FailureMessage(`You have already sent a friend request to '${receiverID}'.`);
			}
			if (totalRequests >= MAX_REQUESTS) {
				throw new FailureMessage(
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
			const [senderID, receiverID] = request;
			const friends = statements.get.all(receiverID, 101);
			if (friends?.length >= MAX_FRIENDS) {
				throw new FailureMessage(`You are at the maximum number of friends.`);
			}
			const {result} = TRANSACTIONS.removeRequest([request]);
			if (!result.length) throw new FailureMessage(`You have no request pending from ${senderID}.`);
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

export const PM = new ProcessManager.QueryProcessManager<DatabaseRequest, DatabaseResult>(module, query => {
	const {type, statement, data} = query;
	const start = Date.now();
	const result: DatabaseResult = {};
	try {
		switch (type) {
		case 'run':
			result.result = statements[statement].run(data);
			break;
		case 'get':
			result.result = statements[statement].get(data);
			break;
		case 'transaction':
			result.result = transactions[statement]([data]);
			break;
		case 'all':
			result.result = statements[statement].all(data);
			break;
		}
	} catch (e: any) {
		if (!e.name.endsWith('FailureMessage')) {
			result.error = "Sorry! The database process crashed. We've been notified and will fix this.";
			Monitor.crashlog(e, "A friends database process", query);
		} else {
			result.error = e.message;
		}
		return result;
	}
	const delta = Date.now() - start;
	if (delta > 1000) {
		Monitor.slow(`[Slow friends list query] ${JSON.stringify(query)}`);
	}
	return result;
}, PM_TIMEOUT, message => {
	if (message.startsWith('SLOW\n')) {
		Monitor.slow(message.slice(5));
	}
});

if (!PM.isParentProcess) {
	global.Config = (require as any)('./config-loader').Config;
	if (Config.usesqlite) {
		FriendsDatabase.setupDatabase();
	}
	global.Monitor = {
		crashlog(error: Error, source = 'A friends database process', details: AnyObject | null = null) {
			const repr = JSON.stringify([error.name, error.message, source, details]);
			process.send!(`THROW\n@!!@${repr}\n${error.stack}`);
		},
		slow(message: string) {
			process.send!(`CALLBACK\nSLOW\n${message}`);
		},
	};
	process.on('uncaughtException', err => {
		if (Config.crashguard) {
			Monitor.crashlog(err, 'A friends child process');
		}
	});
	// eslint-disable-next-line no-eval
	Repl.start(`friends-${process.pid}`, cmd => eval(cmd));
} else {
	PM.spawn(Config.friendsprocesses || 1);
}
