/**
 * Roomlogs
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This handles data storage for rooms.
 *
 * @license MIT
 */

import { FS, Utils, type Streams } from '../lib';
import { PGDatabase, SQL, type SQLStatement } from '../lib/database';
import type { PartialModlogEntry } from './modlog';

interface RoomlogOptions {
	isMultichannel?: boolean;
	noAutoTruncate?: boolean;
	noLogTimes?: boolean;
}

interface RoomlogRow {
	type: string;
	roomid: string;
	userid: string | null;
	time: Date;
	log: string;
	// tsvector, really don't use
	content: string | null;
}

export const roomlogDB = (() => {
	if (!global.Config || !Config.replaysdb || Config.disableroomlogdb) return null;
	return new PGDatabase(Config.replaysdb);
})();
export const roomlogTable = roomlogDB?.getTable<RoomlogRow>('roomlogs');

/**
 * Most rooms have three logs:
 * - scrollback
 * - roomlog
 * - modlog
 * This class keeps track of all three.
 *
 * The scrollback is stored in memory, and is the log you get when you
 * join the room. It does not get moderator messages.
 *
 * The modlog is stored in
 * `logs/modlog/modlog_<ROOMID>.txt`
 * It contains moderator messages, formatted for ease of search.
 * Direct modlog access is handled in server/modlog/; this file is just
 * a wrapper to make other code more readable.
 *
 * The roomlog is stored in
 * `logs/chat/<ROOMID>/<YEAR>-<MONTH>/<YEAR>-<MONTH>-<DAY>.txt`
 * It contains (nearly) everything.
 */
export class Roomlog {
	/**
	 * Battle rooms are multichannel, which means their logs are split
	 * into four channels, public, p1, p2, full.
	 */
	readonly isMultichannel: boolean;
	/**
	 * Chat rooms auto-truncate, which means it only stores the recent
	 * messages, if there are more.
	 */
	readonly noAutoTruncate: boolean;
	/**
	 * Chat rooms include timestamps.
	 */
	readonly noLogTimes: boolean;
	roomid: RoomID;
	/**
	 * Scrollback log
	 */
	log: string[];
	visibleMessageCount = 0;
	broadcastBuffer: string[];
	/**
	 * undefined = uninitialized,
	 * null = disabled
	 */
	roomlogStream?: Streams.WriteStream | null;
	/**
	 * Takes precedence over roomlogStream if it exists.
	 */
	roomlogTable: typeof roomlogTable;
	roomlogFilename: string;

	numTruncatedLines: number;
	constructor(room: BasicRoom, options: RoomlogOptions = {}) {
		this.roomid = room.roomid;

		this.isMultichannel = !!options.isMultichannel;
		this.noAutoTruncate = !!options.noAutoTruncate;
		this.noLogTimes = !!options.noLogTimes;

		this.log = [];
		this.broadcastBuffer = [];

		this.roomlogStream = undefined;
		this.roomlogFilename = '';

		this.numTruncatedLines = 0;

		this.setupRoomlogStream();
	}
	getScrollback(channel = 0) {
		let log = this.log;
		if (!this.noLogTimes) log = [`|:|${~~(Date.now() / 1000)}`].concat(log);
		if (!this.isMultichannel) {
			return log.join('\n') + '\n';
		}
		log = [];
		for (let i = 0; i < this.log.length; ++i) {
			const line = this.log[i];
			const split = /\|split\|p(\d)/g.exec(line);
			if (split) {
				const canSeePrivileged = (channel === Number(split[1]) || channel === -1);
				const ownLine = this.log[i + (canSeePrivileged ? 1 : 2)];
				if (ownLine) log.push(ownLine);
				i += 2;
			} else {
				log.push(line);
			}
		}
		return log.join('\n') + '\n';
	}
	setupRoomlogStream() {
		if (this.roomlogStream === null) return;
		if (!Config.logchat || this.roomid.startsWith('battle-') || this.roomid.startsWith('game-')) {
			this.roomlogStream = null;
			return;
		}
		if (roomlogTable) {
			this.roomlogTable = roomlogTable;
			this.roomlogStream = null;
			return;
		}
		const date = new Date();
		const dateString = Chat.toTimestamp(date).split(' ')[0];
		const monthString = dateString.split('-', 2).join('-');
		const basepath = `chat/${this.roomid}/`;
		const relpath = `${monthString}/${dateString}.txt`;

		if (relpath === this.roomlogFilename) return;

		Monitor.logPath(basepath + monthString).mkdirpSync();
		this.roomlogFilename = relpath;
		if (this.roomlogStream) void this.roomlogStream.writeEnd();
		this.roomlogStream = Monitor.logPath(basepath + relpath).createAppendStream();
		// Create a symlink to today's lobby log.
		// These operations need to be synchronous, but it's okay
		// because this code is only executed once every 24 hours.
		const link0 = basepath + 'today.txt.0';
		Monitor.logPath(link0).unlinkIfExistsSync();
		try {
			Monitor.logPath(link0).symlinkToSync(relpath); // intentionally a relative link
			Monitor.logPath(link0).renameSync(basepath + 'today.txt');
		} catch {} // OS might not support symlinks or atomic rename
		if (!Roomlogs.rollLogTimer) Roomlogs.rollLogs();
	}
	add(message: string) {
		this.roomlog(message);
		// |uhtml gets both uhtml and uhtmlchange
		// which are visible and so should be counted
		if (['|c|', '|c:|', '|raw|', '|html|', '|uhtml'].some(k => message.startsWith(k))) {
			this.visibleMessageCount++;
		}
		message = this.withTimestamp(message);
		this.log.push(message);
		this.broadcastBuffer.push(message);
		return this;
	}
	private withTimestamp(message: string) {
		if (!this.noLogTimes && message.startsWith('|c|')) {
			return `|c:|${Math.trunc(Date.now() / 1000)}|${message.slice(3)}`;
		} else {
			return message;
		}
	}
	hasUsername(username: string) {
		const userid = toID(username);
		for (const line of this.log) {
			if (line.startsWith('|c:|')) {
				const curUserid = toID(line.split('|', 4)[3]);
				if (curUserid === userid) return true;
			} else if (line.startsWith('|c|')) {
				const curUserid = toID(line.split('|', 3)[2]);
				if (curUserid === userid) return true;
			}
		}
		return false;
	}
	clearText(userids: ID[], lineCount = 0) {
		const cleared: ID[] = [];
		const clearAll = (lineCount === 0);
		this.log = this.log.reverse().filter(line => {
			const parsed = this.parseChatLine(line);
			if (parsed) {
				const userid = toID(parsed.user);
				if (userids.includes(userid)) {
					if (!cleared.includes(userid)) cleared.push(userid);
					// Don't remove messages in battle rooms to preserve evidence
					if (!this.roomlogStream && !this.roomlogTable) return true;
					if (clearAll) return false;
					if (lineCount > 0) {
						lineCount--;
						return false;
					}
					return true;
				}
			}
			return true;
		}).reverse();
		return cleared;
	}
	uhtmlchange(name: string, message: string) {
		const originalStart = '|uhtml|' + name + '|';
		const fullMessage = originalStart + message;
		for (const [i, line] of this.log.entries()) {
			if (line.startsWith(originalStart)) {
				this.log[i] = fullMessage;
				break;
			}
		}
		this.broadcastBuffer.push(fullMessage);
	}
	attributedUhtmlchange(user: User, name: string, message: string) {
		const start = `/uhtmlchange ${name},`;
		const fullMessage = this.withTimestamp(`|c|${user.getIdentity()}|${start}${message}`);
		let matched = false;
		for (const [i, line] of this.log.entries()) {
			if (this.parseChatLine(line)?.message.startsWith(start)) {
				this.log[i] = fullMessage;
				matched = true;
				break;
			}
		}
		if (!matched) this.log.push(fullMessage);
		this.broadcastBuffer.push(fullMessage);
	}
	parseChatLine(line: string) {
		const prefixes: [string, number][] = [['|c:|', 4], ['|c|', 3]];
		for (const [messageStart, section] of prefixes) {
			// const messageStart = !this.noLogTimes ? '|c:|' : '|c|';
			// const section = !this.noLogTimes ? 4 : 3; // ['', 'c' timestamp?, author, message]
			if (line.startsWith(messageStart)) {
				const parts = Utils.splitFirst(line, '|', section);
				return { user: parts[section - 1], message: parts[section] };
			}
		}
	}
	roomlog(message: string, date = new Date()) {
		if (!Config.logchat) return;
		message = message.replace(/<img[^>]* src="data:image\/png;base64,[^">]+"[^>]*>/g, '[img]');
		if (this.roomlogTable) {
			const chatData = this.parseChatLine(message);
			const type = message.split('|')[1] || "";
			void this.insertLog(SQL`INSERT INTO roomlogs (${{
				type,
				roomid: this.roomid,
				userid: toID(chatData?.user) || null,
				time: SQL`now()`,
				log: message,
			}})`);

			const dateStr = Chat.toTimestamp(date).split(' ')[0];
			void this.insertLog(SQL`INSERT INTO roomlog_dates (${{
				roomid: this.roomid,
				month: dateStr.slice(0, -3),
				date: dateStr,
			}}) ON CONFLICT (roomid, date) DO NOTHING;`);
		} else if (this.roomlogStream) {
			const timestamp = Chat.toTimestamp(date).split(' ')[1] + ' ';
			void this.roomlogStream.write(timestamp + message + '\n');
		}
	}
	private async insertLog(query: SQLStatement, ignoreFailure = false, retries = 3): Promise<void> {
		try {
			await this.roomlogTable?.query(query);
		} catch (e: any) {
			if (e?.code === '42P01') { // table not found
				await roomlogDB!._query(FS('databases/schemas/roomlogs.sql').readSync(), []);
				return this.insertLog(query, ignoreFailure, retries);
			}
			// connection terminated / transient errors
			if (
				!ignoreFailure &&
				retries > 0 &&
				e.message?.includes('Connection terminated unexpectedly')
			) {
				// delay before retrying
				await new Promise(resolve => { setTimeout(resolve, 2000); });
				return this.insertLog(query, ignoreFailure, retries - 1);
			}
			// crashlog for all other errors
			const [q, vals] = roomlogDB!._resolveSQL(query);
			Monitor.crashlog(e, 'a roomlog database query', {
				query: q, values: vals,
			});
		}
	}
	modlog(entry: PartialModlogEntry, overrideID?: string) {
		void Rooms.Modlog.write(this.roomid, entry, overrideID);
	}
	async rename(newID: RoomID): Promise<true> {
		await Rooms.Modlog.rename(this.roomid, newID);
		const roomlogStreamExisted = this.roomlogStream !== null;
		await this.destroy();
		if (this.roomlogTable) {
			await this.roomlogTable.updateAll({ roomid: newID })`WHERE roomid = ${this.roomid}`;
		} else {
			const roomlogPath = `chat`;
			const [roomlogExists, newRoomlogExists] = await Promise.all([
				Monitor.logPath(roomlogPath + `/${this.roomid}`).exists(),
				Monitor.logPath(roomlogPath + `/${newID}`).exists(),
			]);
			if (roomlogExists && !newRoomlogExists) {
				await Monitor.logPath(roomlogPath + `/${this.roomid}`).rename(Monitor.logPath(roomlogPath + `/${newID}`).path);
			}
			if (roomlogStreamExisted) {
				this.roomlogStream = undefined;
				this.roomlogFilename = "";
				this.setupRoomlogStream();
			}
		}
		Roomlogs.roomlogs.set(newID, this);
		this.roomid = newID;
		return true;
	}
	static rollLogs(this: void) {
		if (Roomlogs.rollLogTimer === true) return;
		if (Roomlogs.rollLogTimer) {
			clearTimeout(Roomlogs.rollLogTimer);
		}
		Roomlogs.rollLogTimer = true;
		for (const log of Roomlogs.roomlogs.values()) {
			log.setupRoomlogStream();
		}
		const time = Date.now();
		const nextMidnight = new Date();
		nextMidnight.setHours(24, 0, 0, 0);
		Roomlogs.rollLogTimer = setTimeout(() => Roomlog.rollLogs(), nextMidnight.getTime() - time);
	}
	truncate() {
		if (this.noAutoTruncate) return;
		if (this.log.length > 100) {
			const truncationLength = this.log.length - 100;
			this.log.splice(0, truncationLength);
			this.numTruncatedLines += truncationLength;
		}
	}
	/**
	 * Returns the total number of lines in the roomlog, including truncated lines.
	 */
	getLineCount(onlyVisible = true) {
		return (onlyVisible ? this.visibleMessageCount : this.log.length) + this.numTruncatedLines;
	}

	destroy() {
		const promises = [];
		if (this.roomlogStream) {
			promises.push(this.roomlogStream.writeEnd());
			this.roomlogStream = null;
		}
		Roomlogs.roomlogs.delete(this.roomid);
		return Promise.all(promises);
	}
}

const roomlogs = new Map<string, Roomlog>();

function createRoomlog(room: BasicRoom, options = {}) {
	let roomlog = Roomlogs.roomlogs.get(room.roomid);
	if (roomlog) throw new Error(`Roomlog ${room.roomid} already exists`);

	roomlog = new Roomlog(room, options);
	Roomlogs.roomlogs.set(room.roomid, roomlog);
	return roomlog;
}

export const Roomlogs = {
	create: createRoomlog,
	Roomlog,
	roomlogs,
	db: roomlogDB,
	table: roomlogTable,

	rollLogs: Roomlog.rollLogs,

	rollLogTimer: null as NodeJS.Timeout | true | null,
};
