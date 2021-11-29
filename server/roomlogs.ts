/**
 * Roomlogs
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This handles data storage for rooms.
 *
 * @license MIT
 */

import {FS, Utils} from '../lib';
import type {PartialModlogEntry} from './modlog';

interface RoomlogOptions {
	isMultichannel?: boolean;
	noAutoTruncate?: boolean;
	noLogTimes?: boolean;
}

export interface Scrollback {
	room: BasicRoom;
	get(): Promise<string[]>;
	add(entry: string): Promise<void>;
	truncate(): Promise<number> | number;
	destroy(): Promise<void>;
	clear(): void | Promise<void>;
	/** return false to delete the entry, string to change it, or undefined to keep it unchanged*/
	modify(
		cb: (log: string, index: number) => boolean | string | void | undefined,
		desc?: boolean
	): Promise<number[]> | number[];
}

export class MemoryScrollback implements Scrollback {
	room: BasicRoom;
	private log: string[] = [];
	constructor(room: BasicRoom) {
		this.room = room;
	}
	get() {
		return Promise.resolve(this.log);
	}
	add(message: string) {
		this.log.push(message);
		return Promise.resolve();
	}
	truncate() {
		if (this.room.log.noAutoTruncate) return 0;
		if (this.log.length > 100) {
			const truncationLength = this.log.length - 100;
			this.log.splice(0, truncationLength);
			return truncationLength;
		}
		return 0;
	}
	destroy() { return Promise.resolve(); }
	clear() {
		this.log = [];
	}
	modify(
		cb: (log: string, index: number) => boolean | string | void | undefined,
		desc = false
	) {
		const modified = [];
		if (desc) {
			this.log.reverse();
		}
		for (let i = 0; i < this.log.length; i++) {
			const result = cb(this.log[i], i);
			if (result === false) {
				this.log.splice(i, 1);
				modified.push(i);
				i--;
			} else if (typeof result === 'string') {
				this.log[i] = result;
				modified.push(i);
			}
		}
		// undo the reverse, since this is in place
		if (desc) {
			this.log.reverse();
		}
		return modified;
	}
}

export class RedisScrollback implements Scrollback {
	room: BasicRoom;
	// @ts-ignore in case not installed
	redis: import('ioredis').Redis;
	gettingLog: Promise<string[]> | null = null;
	logsWhileGetting: string[] | null = null;
	constructor(room: BasicRoom) {
		this.room = room;
		this.redis = require('ioredis').createClient(Config.redis || Config.redislogs);
	}
	async add(message: string) {
		await this.redis.lpush(`scrollback:${this.room.roomid}`, message);
	}
	private getLength() {
		return this.redis.llen(`scrollback:${this.room.roomid}`);
	}
	async truncate() {
		const start = await this.getLength();
		if (start < 100) return 0;
		await this.redis.ltrim(`scrollback:${this.room.roomid}`, 0, 99);
		return start - await this.getLength();
	}
	async get() {
		if (this.gettingLog) return this.gettingLog;
		this.logsWhileGetting = [];
		this.gettingLog = (async () => {
			const fetched = await this.redis.lrange(`scrollback:${this.room.roomid}`, 0, 99);
			const logs = fetched.reverse().concat(this.logsWhileGetting || []);
			this.gettingLog = this.logsWhileGetting = null;
			return logs;
		})();
		return this.gettingLog;
	}
	async destroy() {
		await this.clear();
		this.redis.disconnect();
	}
	async clear() {
		await this.redis.del(`scrollback:${this.room.roomid}`);
	}
	async modify(
		cb: (log: string, index: number) => boolean | string | void | undefined,
		desc = false
	) {
		const logs = await this.get();
		if (desc) logs.reverse();
		const modified = [];
		for (const [i, log] of logs.entries()) {
			const redisIdx = i + 1;
			const result = cb(log, i);
			if (result === false) {
				await this.redis.lrem(`scrollback:${this.room.roomid}`, 1, log);
				modified.push(i);
			} else if (typeof result === 'string') {
				logs[i] = result;
				await this.redis.lset(`scrollback:${this.room.roomid}`, redisIdx, result);
				modified.push(i);
			}
		}
		return modified;
	}
}
/**
 * Most rooms have three logs:
 * - scrollback
 * - roomlog
 * - modlog
 * This class keeps track of all three.
 *
 * The scrollback is stored in Redis (if enabled, else memory), and is the log you get when you
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
	scrollback: Scrollback;
	logLength = 0;
	visibleMessageCount = 0;
	broadcastBuffer: string[];
	/**
	 * undefined = uninitialized,
	 * null = disabled
	 */
	roomlogStream?: Streams.WriteStream | null;
	roomlogFilename: string;

	numTruncatedLines: number;
	constructor(room: BasicRoom, options: RoomlogOptions = {}) {
		this.roomid = room.roomid;

		this.isMultichannel = !!options.isMultichannel;
		this.noAutoTruncate = !!options.noAutoTruncate;
		this.noLogTimes = !!options.noLogTimes;

		this.broadcastBuffer = [];

		this.roomlogStream = undefined;
		this.roomlogFilename = '';

		this.numTruncatedLines = 0;
		this.scrollback = Config.redis || Config.redislogs ? new RedisScrollback(room) : new MemoryScrollback(room);

		void this.setupRoomlogStream(true);
	}
	async getScrollback(channel = 0) {
		let log = await this.scrollback.get();
		if (!this.noLogTimes) log = [`|:|${~~(Date.now() / 1000)}`].concat(log);
		if (!this.isMultichannel) {
			return log.join('\n') + '\n';
		}
		const sanitized = [];
		for (let i = 0; i < log.length; ++i) {
			const line = log[i];
			const split = /\|split\|p(\d)/g.exec(line);
			if (split) {
				const canSeePrivileged = (channel === Number(split[0]) || channel === -1);
				const ownLine = log[i + (canSeePrivileged ? 1 : 2)];
				if (ownLine) sanitized.push(ownLine);
				i += 2;
			} else {
				sanitized.push(line);
			}
		}
		return sanitized.join('\n') + '\n';
	}
	async setupRoomlogStream(sync = false) {
		if (this.roomlogStream === null) return;
		if (!Config.logchat) {
			this.roomlogStream = null;
			return;
		}
		if (this.roomid.startsWith('battle-')) {
			this.roomlogStream = null;
			return;
		}
		const date = new Date();
		const dateString = Chat.toTimestamp(date).split(' ')[0];
		const monthString = dateString.split('-', 2).join('-');
		const basepath = `logs/chat/${this.roomid}/`;
		const relpath = `${monthString}/${dateString}.txt`;

		if (relpath === this.roomlogFilename) return;

		if (sync) {
			FS(basepath + monthString).mkdirpSync();
		} else {
			await FS(basepath + monthString).mkdirp();
			if (this.roomlogStream === null) return;
		}
		this.roomlogFilename = relpath;
		if (this.roomlogStream) void this.roomlogStream.writeEnd();
		this.roomlogStream = FS(basepath + relpath).createAppendStream();
		// Create a symlink to today's lobby log.
		// These operations need to be synchronous, but it's okay
		// because this code is only executed once every 24 hours.
		const link0 = basepath + 'today.txt.0';
		FS(link0).unlinkIfExistsSync();
		try {
			FS(link0).symlinkToSync(relpath); // intentionally a relative link
			FS(link0).renameSync(basepath + 'today.txt');
		} catch {} // OS might not support symlinks or atomic rename
		if (!Roomlogs.rollLogTimer) void Roomlogs.rollLogs();
	}
	add(message: string) {
		this.roomlog(message);
		// |uhtml gets both uhtml and uhtmlchange
		// which are visible and so should be counted
		if (['|c|', '|c:|', '|raw|', '|html|', '|uhtml'].some(k => message.startsWith(k))) {
			this.visibleMessageCount++;
		}
		message = this.withTimestamp(message);
		void Promise.resolve(this.scrollback.add(message)).then(() => this.logLength++);
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
	async hasUsername(username: string) {
		const userid = toID(username);
		for (const line of await this.scrollback.get()) {
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
	async truncate() {
		const count = await this.scrollback.truncate();
		this.logLength -= count;
		this.numTruncatedLines += count;
	}
	async clearText(userids: ID[], lineCount = 0) {
		const cleared: ID[] = [];
		const clearAll = (lineCount === 0);
		await this.scrollback.modify((line) => {
			const parsed = this.parseChatLine(line);
			if (parsed) {
				const userid = toID(parsed.user);
				if (userids.includes(userid)) {
					if (!cleared.includes(userid)) cleared.push(userid);
					if (this.roomid.startsWith('battle-')) return true; // Don't remove messages in battle rooms to preserve evidence
					if (clearAll) return false;
					if (lineCount > 0) {
						lineCount--;
						return false;
					}
					return true;
				}
			}
			return true;
		}, true);
		return cleared;
	}
	async uhtmlchange(name: string, message: string) {
		const originalStart = '|uhtml|' + name + '|';
		const fullMessage = originalStart + message;
		await this.scrollback.modify(line => {
			if (line.startsWith(originalStart)) {
				return fullMessage;
			}
		});
		this.broadcastBuffer.push(fullMessage);
	}
	async attributedUhtmlchange(user: User, name: string, message: string) {
		const start = `/uhtmlchange ${name},`;
		const fullMessage = this.withTimestamp(`|c|${user.getIdentity()}|${start}${message}`);
		await this.scrollback.modify(line => {
			if (this.parseChatLine(line)?.message.startsWith(start)) {
				return fullMessage;
			}
		});
		this.broadcastBuffer.push(fullMessage);
	}
	parseChatLine(line: string) {
		const messageStart = !this.noLogTimes ? '|c:|' : '|c|';
		const section = !this.noLogTimes ? 4 : 3; // ['', 'c' timestamp?, author, message]
		if (line.startsWith(messageStart)) {
			const parts = Utils.splitFirst(line, '|', section);
			return {user: parts[section - 1], message: parts[section]};
		}
	}
	roomlog(message: string, date = new Date()) {
		if (!this.roomlogStream) return;
		const timestamp = Chat.toTimestamp(date).split(' ')[1] + ' ';
		message = message.replace(/<img[^>]* src="data:image\/png;base64,[^">]+"[^>]*>/g, '');
		void this.roomlogStream.write(timestamp + message + '\n');
	}
	modlog(entry: PartialModlogEntry, overrideID?: string) {
		void Rooms.Modlog.write(this.roomid, entry, overrideID);
	}
	async rename(newID: RoomID): Promise<true> {
		const roomlogPath = `logs/chat`;
		const roomlogStreamExisted = this.roomlogStream !== null;
		await this.destroy();
		const [roomlogExists, newRoomlogExists] = await Promise.all([
			FS(roomlogPath + `/${this.roomid}`).exists(),
			FS(roomlogPath + `/${newID}`).exists(),
		]);
		if (roomlogExists && !newRoomlogExists) {
			await FS(roomlogPath + `/${this.roomid}`).rename(roomlogPath + `/${newID}`);
		}
		await Rooms.Modlog.rename(this.roomid, newID);
		this.roomid = newID;
		Roomlogs.roomlogs.set(newID, this);
		if (roomlogStreamExisted) {
			this.roomlogStream = undefined;
			this.roomlogFilename = "";
			await this.setupRoomlogStream(true);
		}
		return true;
	}
	static async rollLogs() {
		if (Roomlogs.rollLogTimer === true) return;
		if (Roomlogs.rollLogTimer) {
			clearTimeout(Roomlogs.rollLogTimer);
		}
		Roomlogs.rollLogTimer = true;
		for (const log of Roomlogs.roomlogs.values()) {
			await log.setupRoomlogStream();
		}
		const time = Date.now();
		const nextMidnight = new Date(time + 24 * 60 * 60 * 1000);
		nextMidnight.setHours(0, 0, 1);
		Roomlogs.rollLogTimer = setTimeout(() => void Roomlog.rollLogs(), nextMidnight.getTime() - time);
	}
	/**
	 * Returns the total number of lines in the roomlog, including truncated lines.
	 */
	getLineCount(onlyVisible = true) {
		return (onlyVisible ? this.visibleMessageCount : this.logLength) + this.numTruncatedLines;
	}

	destroy() {
		const promises = [];
		if (this.roomlogStream) {
			promises.push(this.roomlogStream.writeEnd());
			this.roomlogStream = null;
		}
		promises.push(this.scrollback.destroy());
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

	rollLogs: Roomlog.rollLogs,

	rollLogTimer: null as NodeJS.Timeout | true | null,
};
