/**
 * Roomlogs
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This handles data storage for rooms.
 *
 * @license MIT
 */

import {FS} from '../lib/fs';

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
	readonly autoTruncate: boolean;
	/**
	 * Chat rooms include timestamps.
	 */
	readonly logTimes: boolean;
	roomid: RoomID;
	/**
	 * Scrollback log
	 */
	log: string[];
	broadcastBuffer: string;
	/**
	 * undefined = uninitialized,
	 * null = disabled
	 */
	modlogStream?: Streams.WriteStream | null;
	/**
	 * undefined = uninitialized,
	 * null = disabled
	 */
	roomlogStream?: Streams.WriteStream | null;
	sharedModlog: boolean;
	roomlogFilename: string;
	constructor(room: BasicChatRoom, options: {isMultichannel?: any, autoTruncate?: any, logTimes?: any} = {}) {
		this.roomid = room.roomid;

		this.isMultichannel = !!options.isMultichannel;
		this.autoTruncate = !!options.autoTruncate;
		this.logTimes = !!options.logTimes;

		this.log = [];
		this.broadcastBuffer = '';

		this.modlogStream = undefined;
		this.roomlogStream = undefined;

		// modlog/roomlog state
		this.sharedModlog = false;

		this.roomlogFilename = '';

		this.setupModlogStream();
		void this.setupRoomlogStream(true);
	}
	getScrollback(channel = 0) {
		let log = this.log;
		if (this.logTimes) log = [`|:|${~~(Date.now() / 1000)}`].concat(log);
		if (!this.isMultichannel) {
			return log.join('\n') + '\n';
		}
		log = [];
		for (let i = 0; i < this.log.length; ++i) {
			const line = this.log[i];
			const split = /\|split\|p(\d)/g.exec(line);
			if (split) {
				const canSeePrivileged = (channel === Number(split[0]) || channel === -1);
				const ownLine = this.log[i + (canSeePrivileged ? 1 : 2)];
				if (ownLine) log.push(ownLine);
				i += 2;
			} else {
				log.push(line);
			}
		}
		return log.join('\n') + '\n';
	}
	setupModlogStream() {
		if (this.modlogStream !== undefined) return;
		if (!this.roomid.includes('-')) {
			this.modlogStream = FS(`logs/modlog/modlog_${this.roomid}.txt`).createAppendStream();
			return;
		}
		const sharedStreamId = this.roomid.split('-')[0];
		let stream = Roomlogs.sharedModlogs.get(sharedStreamId);
		if (!stream) {
			stream = FS(`logs/modlog/modlog_${sharedStreamId}.txt`).createAppendStream();
			Roomlogs.sharedModlogs.set(sharedStreamId, stream);
		}
		this.modlogStream = stream;
		this.sharedModlog = true;
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
		if (this.roomlogStream) void this.roomlogStream.end();
		this.roomlogStream = FS(basepath + relpath).createAppendStream();
		// Create a symlink to today's lobby log.
		// These operations need to be synchronous, but it's okay
		// because this code is only executed once every 24 hours.
		const link0 = basepath + 'today.txt.0';
		FS(link0).unlinkIfExistsSync();
		try {
			FS(link0).symlinkToSync(relpath); // intentionally a relative link
			FS(link0).renameSync(basepath + 'today.txt');
		} catch (e) {} // OS might not support symlinks or atomic rename
		if (!Roomlogs.rollLogTimer) void Roomlogs.rollLogs();
	}
	add(message: string) {
		if (message.startsWith('|uhtmlchange|')) return this.uhtmlchange(message);
		this.roomlog(message);
		if (this.logTimes && message.startsWith('|c|')) {
			message = '|c:|' + (~~(Date.now() / 1000)) + '|' + message.substr(3);
		}
		this.log.push(message);
		this.broadcastBuffer += message + '\n';
		return this;
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
		const messageStart = this.logTimes ? '|c:|' : '|c|';
		const section = this.logTimes ? 4 : 3; // ['', 'c' timestamp?, author, message]
		const cleared: ID[] = [];
		const clearAll = (lineCount === 0);
		this.log = this.log.reverse().filter(line => {
			if (line.startsWith(messageStart)) {
				const parts = Chat.splitFirst(line, '|', section);
				const userid = toID(parts[section - 1]);
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
		}).reverse();
		return cleared;
	}
	uhtmlchange(message: string) {
		const thirdPipe = message.indexOf('|', 13);
		const originalStart = '|uhtml|' + message.slice(13, thirdPipe + 1);
		for (const [i, line] of this.log.entries()) {
			if (line.startsWith(originalStart)) {
				this.log[i] = originalStart + message.slice(thirdPipe + 1);
				break;
			}
		}
		this.broadcastBuffer += message + '\n';
		return this;
	}
	roomlog(message: string, date = new Date()) {
		if (!this.roomlogStream) return;
		const timestamp = Chat.toTimestamp(date).split(' ')[1] + ' ';
		message = message.replace(/<img[^>]* src="data:image\/png;base64,[^">]+"[^>]*>/g, '');
		void this.roomlogStream.write(timestamp + message + '\n');
	}
	modlog(message: string) {
		if (!this.modlogStream) return;
		void this.modlogStream.write('[' + (new Date().toJSON()) + '] ' + message + '\n');
	}
	async rename(newID: RoomID): Promise<true> {
		const modlogPath = `logs/modlog`;
		const roomlogPath = `logs/chat`;
		const modlogStreamExisted = this.modlogStream !== null;
		const roomlogStreamExisted = this.roomlogStream !== null;
		await this.destroy();
		await Promise.all([
			FS(modlogPath + `/modlog_${this.roomid}.txt`).exists(),
			FS(roomlogPath + `/${this.roomid}`).exists(),
			FS(modlogPath + `/modlog_${newID}.txt`).exists(),
			FS(roomlogPath + `/${newID}`).exists(),
		]).then(([modlogExists, roomlogExists, newModlogExists, newRoomlogExists]) => {
			return Promise.all([
				modlogExists && !newModlogExists ?
					FS(modlogPath + `/modlog_${this.roomid}.txt`).rename(modlogPath + `/modlog_${newID}.txt`) :
					undefined,
				roomlogExists && !newRoomlogExists ?
					FS(roomlogPath + `/${this.roomid}`).rename(roomlogPath + `/${newID}`) :
					undefined,
			]);
		});
		this.roomid = newID;
		Roomlogs.roomlogs.set(newID, this);
		if (modlogStreamExisted) {
			// set modlogStream to undefined (uninitialized) instead of null (disabled)
			this.modlogStream = undefined;
			this.setupModlogStream();
		}
		if (roomlogStreamExisted) {
			this.roomlogStream = undefined;
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
	truncate() {
		if (!this.autoTruncate) return;
		if (this.log.length > 100) {
			this.log.splice(0, this.log.length - 100);
		}
	}

	destroy() {
		const promises = [];
		if (this.sharedModlog) {
			this.modlogStream = null;
		}
		if (this.modlogStream) {
			promises.push(this.modlogStream.end());
			this.modlogStream = null;
		}
		if (this.roomlogStream) {
			promises.push(this.roomlogStream.end());
			this.roomlogStream = null;
		}
		Roomlogs.roomlogs.delete(this.roomid);
		return Promise.all(promises);
	}
}

const sharedModlogs = new Map<string, Streams.WriteStream>();

const roomlogs = new Map<string, Roomlog>();

function createRoomlog(room: BasicChatRoom, options = {}) {
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
	sharedModlogs,

	rollLogs: Roomlog.rollLogs,

	rollLogTimer: null as NodeJS.Timeout | true | null,
};
