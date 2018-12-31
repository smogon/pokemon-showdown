/**
 * FS
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * An abstraction layer around Node's filesystem.
 *
 * Advantages:
 * - write() etc do nothing in unit tests
 * - paths are always relative to PS's base directory
 * - Promises (seriously wtf Node Core what are you thinking)
 * - PS-style API: FS("foo.txt").write("bar") for easier argument order
 * - mkdirp
 *
 * FS is used nearly everywhere, but exceptions include:
 * - crashlogger.js - in case the crash is in here
 * - repl.js - which use Unix sockets out of this file's scope
 * - launch script - happens before modules are loaded
 * - sim/ - intended to be self-contained
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>
 * @license MIT
 */

'use strict';

const pathModule = require('path');
const fs = require('fs');
const Streams = require('./streams');
const WriteStream = Streams.WriteStream;

const ROOT_PATH = pathModule.resolve(__dirname, '..');

/*eslint no-unused-expressions: ["error", { "allowTernary": true }]*/

class FSPath {
	/**
	 * @param {string} path
	 */
	constructor(path) {
		this.path = pathModule.resolve(ROOT_PATH, path);
	}
	parentDir() {
		return new FSPath(pathModule.dirname(this.path));
	}
	/**
	 * @param {AnyObject | string} [options]
	 * @return {Promise<string>}
	 */
	read(options = 'utf8') {
		if (typeof options !== 'string' && options.encoding === undefined) {
			options.encoding = 'utf8';
		}
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, options, (err, data) => {
				err ? reject(err) : resolve(/** @type {string} */ (data));
			});
		});
	}
	/**
	 * @param {AnyObject | string} [options]
	 * @return {string}
	 */
	readSync(/** @type {AnyObject | string} */ options = 'utf8') {
		if (typeof options !== 'string' && options.encoding === undefined) {
			options.encoding = 'utf8';
		}
		return /** @type {string} */ (fs.readFileSync(this.path, options));
	}
	/**
	 * @param {AnyObject | string} [options]
	 * @return {Promise<Buffer>}
	 */
	readBuffer(/** @type {AnyObject | string} */ options = {}) {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, options, (err, data) => {
				err ? reject(err) : resolve(/** @type {Buffer} */ (data));
			});
		});
	}
	/**
	 * @param {AnyObject | string} [options]
	 * @return {Buffer}
	 */
	readBufferSync(/** @type {AnyObject | string} */ options = {}) {
		return /** @type {Buffer} */ (fs.readFileSync(this.path, options));
	}
	/**
	 * @return {Promise<string>}
	 */
	readIfExists() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, 'utf8', (err, data) => {
				if (err && err.code === 'ENOENT') return resolve('');
				err ? reject(err) : resolve(data);
			});
		});
	}
	readIfExistsSync() {
		try {
			return fs.readFileSync(this.path, 'utf8');
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
		}
		return '';
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	write(data, options = {}) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.writeFile(this.path, data, options, err => {
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	writeSync(data, options = {}) {
		if (Config.nofswriting) return;
		return fs.writeFileSync(this.path, data, options);
	}
	/**
	 * Writes to a new file before renaming to replace an old file. If
	 * the process crashes while writing, the old file won't be lost.
	 * Does not protect against simultaneous writing; use writeUpdate
	 * for that.
	 *
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	async safeWrite(data, options = {}) {
		await FS(this.path + '.NEW').write(data, options);
		await FS(this.path + '.NEW').rename(this.path);
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	safeWriteSync(data, options = {}) {
		FS(this.path + '.NEW').writeSync(data, options);
		FS(this.path + '.NEW').renameSync(this.path);
	}
	/**
	 * @param {number} time
	 * @return {Promise<void>}
	 */
	waitUntil(time) {
		return new Promise(resolve => {
			setTimeout(() => resolve(), time - Date.now());
		});
	}
	/**
	 * Safest way to update a file with in-memory state. Pass a callback
	 * that fetches the data to be written. It will write an update,
	 * avoiding race conditions. The callback may not necessarily be
	 * called, if `writeUpdate` is called many times in a short period.
	 *
	 * `options.throttle`, if it exists, will make sure updates are not
	 * written more than once every `options.throttle` milliseconds.
	 *
	 * No synchronous version because there's no risk of race conditions
	 * with synchronous code; just use `safeWriteSync`.
	 *
	 * @param {() => string | Buffer} dataFetcher
	 * @param {Object} options
	 */
	writeUpdate(dataFetcher, options = {}) {
		if (Config.nofswriting) return;
		/** @type {PendingUpdate | undefined} */
		let pendingUpdate = FS.pendingUpdates.get(this.path);

		const throttleTime = options.throttle ? Date.now() + options.throttle : 0;

		if (pendingUpdate) {
			pendingUpdate.pendingDataFetcher = dataFetcher;
			pendingUpdate.pendingOptions = options;
			if (pendingUpdate.throttleTimer && throttleTime < pendingUpdate.throttleTime) {
				pendingUpdate.throttleTime = throttleTime;
				clearTimeout(pendingUpdate.throttleTimer);
				pendingUpdate.throttleTimer = setTimeout(() => this.checkNextUpdate(), throttleTime - Date.now());
			}
			return;
		}

		this.writeUpdateNow(dataFetcher, options);
	}
	/**
	 * @param {() => string | Buffer} dataFetcher
	 * @param {Object} options
	 */
	writeUpdateNow(dataFetcher, options) {
		const throttleTime = options.throttle ? Date.now() + options.throttle : 0;
		const update = {
			isWriting: true,
			pendingDataFetcher: null,
			pendingOptions: null,
			throttleTime: throttleTime,
			throttleTimer: null,
		};
		FS.pendingUpdates.set(this.path, update);
		this.safeWrite(dataFetcher(), options).then(() => this.finishUpdate());
	}
	checkNextUpdate() {
		let pendingUpdate = FS.pendingUpdates.get(this.path);
		if (!pendingUpdate) throw new Error(`FS: Pending update not found`);
		if (pendingUpdate.isWriting) throw new Error(`FS: Conflicting update`);

		const {pendingDataFetcher: dataFetcher, pendingOptions: options} = pendingUpdate;
		if (!dataFetcher || !options) {
			// no pending update
			FS.pendingUpdates.delete(this.path);
			return;
		}

		this.writeUpdateNow(dataFetcher, options);
	}
	finishUpdate() {
		let pendingUpdate = FS.pendingUpdates.get(this.path);
		if (!pendingUpdate) throw new Error(`FS: Pending update not found`);
		if (!pendingUpdate.isWriting) throw new Error(`FS: Conflictding update`);

		pendingUpdate.isWriting = false;
		const throttleTime = pendingUpdate.throttleTime;
		if (!throttleTime || throttleTime < Date.now()) {
			this.checkNextUpdate();
			return;
		}

		pendingUpdate.throttleTimer = setTimeout(() => this.checkNextUpdate(), throttleTime - Date.now());
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	append(data, options = {}) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.appendFile(this.path, data, options, err => {
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string | Buffer} data
	 * @param {Object} options
	 */
	appendSync(data, options = {}) {
		if (Config.nofswriting) return;
		return fs.appendFileSync(this.path, data, options);
	}
	/**
	 * @param {string} target
	 */
	symlinkTo(target) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.symlink(target, this.path, err => {
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string} target
	 */
	symlinkToSync(target) {
		if (Config.nofswriting) return;
		return fs.symlinkSync(target, this.path);
	}
	/**
	 * @param {string} target
	 */
	rename(target) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.rename(this.path, target, err => {
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string} target
	 */
	renameSync(target) {
		if (Config.nofswriting) return;
		return fs.renameSync(this.path, target);
	}
	readdir() {
		return new Promise((resolve, reject) => {
			fs.readdir(this.path, (err, data) => {
				err ? reject(err) : resolve(data);
			});
		});
	}
	readdirSync() {
		return fs.readdirSync(this.path);
	}
	createReadStream() {
		return new FileReadStream(this.path);
	}
	/**
	 * @return {WriteStream}
	 */
	createWriteStream(options = {}) {
		if (Config.nofswriting) {
			// @ts-ignore
			return new WriteStream({write() {}});
		}
		// @ts-ignore
		return new WriteStream(fs.createWriteStream(this.path, options));
	}
	/**
	 * @return {WriteStream}
	 */
	createAppendStream(options = {}) {
		if (Config.nofswriting) {
			// @ts-ignore
			return new WriteStream({write() {}});
		}
		// @ts-ignore
		options.flags = options.flags || 'a';
		// @ts-ignore
		return new WriteStream(fs.createWriteStream(this.path, options));
	}
	unlinkIfExists() {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.unlink(this.path, err => {
				if (err && err.code === 'ENOENT') return resolve();
				err ? reject(err) : resolve();
			});
		});
	}
	unlinkIfExistsSync() {
		if (Config.nofswriting) return;
		try {
			fs.unlinkSync(this.path);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
		}
	}
	/**
	 * @param {string | number} mode
	 */
	mkdir(mode = 0o755) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.mkdir(this.path, mode, err => {
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string | number} mode
	 */
	mkdirSync(mode = 0o755) {
		if (Config.nofswriting) return;
		return fs.mkdirSync(this.path, mode);
	}
	/**
	 * @param {string | number} mode
	 */
	mkdirIfNonexistent(mode = 0o755) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise((resolve, reject) => {
			fs.mkdir(this.path, mode, err => {
				if (err && err.code === 'EEXIST') return resolve();
				err ? reject(err) : resolve();
			});
		});
	}
	/**
	 * @param {string | number} mode
	 */
	mkdirIfNonexistentSync(mode = 0o755) {
		if (Config.nofswriting) return;
		try {
			fs.mkdirSync(this.path, mode);
		} catch (err) {
			if (err.code !== 'EEXIST') throw err;
		}
	}
	/**
	 * Creates the directory (and any parent directories if necessary).
	 * Does not throw if the directory already exists.
	 * @param {string | number} mode
	 */
	async mkdirp(mode = 0o755) {
		try {
			await this.mkdirIfNonexistent(mode);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
			await this.parentDir().mkdirp(mode);
			await this.mkdirIfNonexistent(mode);
		}
	}
	/**
	 * Creates the directory (and any parent directories if necessary).
	 * Does not throw if the directory already exists. Synchronous.
	 * @param {string | number} mode
	 */
	mkdirpSync(mode = 0o755) {
		try {
			this.mkdirIfNonexistentSync(mode);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
			this.parentDir().mkdirpSync(mode);
			this.mkdirIfNonexistentSync(mode);
		}
	}
	/**
	 * Calls the callback if the file is modified.
	 * @param {function (): void} callback
	 */
	onModify(callback) {
		fs.watchFile(this.path, (curr, prev) => {
			if (curr.mtime > prev.mtime) return callback();
		});
	}
	/**
	 * Clears callbacks added with onModify()
	 */
	unwatch() {
		fs.unwatchFile(this.path);
	}
}

class FileReadStream extends Streams.ReadStream {
	/**
	 * @param {string} file
	 */
	constructor(file) {
		super();
		/** @type {Promise<number>} */
		this.fd = new Promise((resolve, reject) => {
			fs.open(file, 'r', (err, fd) => err ? reject(err) : resolve(fd));
		});
		this.atEOF = false;
	}
	_read(size = 16384) {
		return new Promise((resolve, reject) => {
			if (this.atEOF) return resolve(false);
			this.ensureCapacity(size);
			this.fd.then(fd => {
				fs.read(fd, this.buf, this.bufEnd, size, null, (err, bytesRead, buf) => {
					if (err) return reject(err);
					if (!bytesRead) {
						this.atEOF = true;
						this.resolvePush();
						return resolve(false);
					}
					this.bufEnd += bytesRead;
					// throw new Error([...this.buf].map(x => x.toString(16)).join(' '));
					this.resolvePush();
					resolve(true);
				});
			});
		});
	}
	_destroy() {
		return /** @type {Promise<void>} */ (new Promise(resolve => {
			this.fd.then(fd => {
				fs.close(fd, () => resolve());
			});
		}));
	}
}

/**
 * @param {string} path
 */
function getFs(path) {
	return new FSPath(path);
}

/**
 * @typedef {object} PendingUpdate
 * @property {boolean} isWriting true: waiting on a call to FS.write, false: waiting on a throttle
 * @property {(() => string | Buffer)?} pendingDataFetcher
 * @property {Object?} pendingOptions
 * @property {number} throttleTime throttling until time (0 for no throttle)
 * @property {NodeJS.Timer?} throttleTimer
 */

const FS = Object.assign(getFs, {
	FileReadStream,

	/**
	 * @type {Map<string, PendingUpdate>}
	 */
	pendingUpdates: new Map(),
});

module.exports = FS;
