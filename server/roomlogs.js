/**
 * Roomlogs
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This handles data storage for rooms.
 *
 * @license MIT license
 */

'use strict';

/** @type {typeof import('../lib/fs').FS} */
const FS = require(/** @type {any} */('../.lib-dist/fs')).FS;

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
class Roomlog {
	/**
	 * @param {BasicChatRoom} room
	 * @param {{isMultichannel?: any, autoTruncate?: any, logTimes?: any}} [options]
	 */
	constructor(room, options = {}) {
		this.id = room.id;
		/**
		 * Scrollback log
		 * @type {string[]}
		 */
		this.log = [];
		this.broadcastBuffer = '';

		/**
		 * Battle rooms are multichannel, which means their logs are split
		 * into four channels, public, p1, p2, full.
		 */
		this.isMultichannel = !!options.isMultichannel;
		/**
		 * Chat rooms auto-truncate, which means it only stores the recent
		 * messages, if there are more.
		 */
		this.autoTruncate = !!options.autoTruncate;
		/**
		 * Chat rooms include timestamps.
		 */
		this.logTimes = !!options.logTimes;

		/**
		 * undefined = uninitialized,
		 * null = disabled
		 * @type {WriteStream? | undefined}
		 */
		this.modlogStream = undefined;
		/**
		 * undefined = uninitialized,
		 * null = disabled
		 * @type {WriteStream? | undefined}
		 */
		this.roomlogStream = undefined;

		// modlog/roomlog state
		this.sharedModlog = false;
		// TypeScript bug: can't infer
		/** @type {string} */
		this.roomlogFilename = '';

		this.setupModlogStream();
		this.setupRoomlogStream(true);
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
		if (!this.id.includes('-')) {
			this.modlogStream = FS(`logs/modlog/modlog_${this.id}.txt`).createAppendStream();
			return;
		}
		const sharedStreamId = this.id.split('-')[0];
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
		if (this.id.startsWith('battle-')) {
			this.roomlogStream = null;
			return;
		}
		const date = new Date();
		const dateString = Chat.toTimestamp(date).split(' ')[0];
		const monthString = dateString.split('-', 2).join('-');
		const basepath = `logs/chat/${this.id}/`;
		const relpath = `${monthString}/${dateString}.txt`;

		if (relpath === this.roomlogFilename) return;

		if (sync) {
			FS(basepath + monthString).mkdirpSync();
		} else {
			await FS(basepath + monthString).mkdirp();
			if (this.roomlogStream === null) return;
		}
		this.roomlogFilename = relpath;
		if (this.roomlogStream) this.roomlogStream.end();
		this.roomlogStream = FS(basepath + relpath).createAppendStream();
		// Create a symlink to today's lobby log.
		// These operations need to be synchronous, but it's okay
		// because this code is only executed once every 24 hours.
		let link0 = basepath + 'today.txt.0';
		FS(link0).unlinkIfExistsSync();
		try {
			FS(link0).symlinkToSync(relpath); // intentionally a relative link
			FS(link0).renameSync(basepath + 'today.txt');
		} catch (e) {} // OS might not support symlinks or atomic rename
		if (!Roomlogs.rollLogTimer) Roomlogs.rollLogs();
	}
	/**
	 * @param {string} message
	 */
	add(message) {
		if (message.startsWith('|uhtmlchange|')) return this.uhtmlchange(message);
		this.roomlog(message);
		if (this.logTimes && message.startsWith('|c|')) {
			message = '|c:|' + (~~(Date.now() / 1000)) + '|' + message.substr(3);
		}
		this.log.push(message);
		this.broadcastBuffer += message + '\n';
		return this;
	}
	/**
	 * @param {string} username
	 */
	hasUsername(username) {
		const userid = toId(username);
		for (const line of this.log) {
			if (line.startsWith('|c:|')) {
				const curUserid = toId(line.split('|', 4)[3]);
				if (curUserid === userid) return true;
			} else if (line.startsWith('|c|')) {
				const curUserid = toId(line.split('|', 3)[2]);
				if (curUserid === userid) return true;
			}
		}
		return false;
	}
	/**
	 * @param {string[]} userids
	 */
	clearText(userids) {
		const messageStart = this.logTimes ? '|c:|' : '|c|';
		const section = this.logTimes ? 4 : 3; // ['', 'c' timestamp?, author, message]
		/** @type {string[]} */
		let cleared = [];
		this.log = this.log.filter(line => {
			if (line.startsWith(messageStart)) {
				const parts = Chat.splitFirst(line, '|', section);
				const userid = toId(parts[section - 1]);
				if (userids.includes(userid)) {
					if (!cleared.includes(userid)) cleared.push(userid);
					if (this.id.startsWith('battle-')) return true; // Don't remove messages in battle rooms to preserve evidence
					return false;
				}
			}
			return true;
		});
		return cleared;
	}
	/**
	 * @param {string} message
	 */
	uhtmlchange(message) {
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
	/**
	 * @param {string} message
	 */
	roomlog(message, date = new Date()) {
		if (!this.roomlogStream) return;
		const timestamp = Chat.toTimestamp(date).split(' ')[1] + ' ';
		message = message.replace(/<img[^>]* src="data:image\/png;base64,[^">]+"[^>]*>/g, '');
		this.roomlogStream.write(timestamp + message + '\n');
	}
	/**
	 * @param {string} message
	 */
	modlog(message) {
		if (!this.modlogStream) return;
		this.modlogStream.write('[' + (new Date().toJSON()) + '] ' + message + '\n');
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
		Roomlogs.rollLogTimer = setTimeout(() => Roomlog.rollLogs(), nextMidnight.getTime() - time);
	}
	truncate() {
		if (!this.autoTruncate) return;
		if (this.log.length > 100) {
			this.log.splice(0, this.log.length - 100);
		}
	}

	destroy() {
		let promises = [];
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
		Roomlogs.roomlogs.delete(this.id);
		return Promise.all(promises);
	}
}

/** @type {Map<string, WriteStream>} */
const sharedModlogs = new Map();

/** @type {Map<string, Roomlog>} */
const roomlogs = new Map();

/**
 * @param {BasicChatRoom} room
 */
function createRoomlog(room, options = {}) {
	let roomlog = Roomlogs.roomlogs.get(room.id);
	if (roomlog) throw new Error(`Roomlog ${room.id} already exists`);

	roomlog = new Roomlog(room, options);
	Roomlogs.roomlogs.set(room.id, roomlog);
	return roomlog;
}
const Roomlogs = {
	create: createRoomlog,
	Roomlog,
	roomlogs,
	sharedModlogs,

	rollLogs: Roomlog.rollLogs,

	/** @type {NodeJS.Timer? | true} */
	rollLogTimer: null,
};

module.exports = Roomlogs;
