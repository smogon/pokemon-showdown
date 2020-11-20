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

import * as fs from 'fs';
import * as pathModule from 'path';
import {ReadStream, WriteStream} from './streams';

const ROOT_PATH = pathModule.resolve(__dirname, '..');

interface PendingUpdate {
	isWriting: boolean; // true: waiting on a call to FS.write, false: waiting on a throttle
	pendingDataFetcher: (() => string | Buffer) | null;
	pendingOptions: AnyObject | null;
	throttleTime: number; // throttling until time (0 for no throttle)
	throttleTimer: NodeJS.Timer | null;
}

const pendingUpdates = new Map<string, PendingUpdate>();

export class FSPath {
	path: string;

	constructor(path: string) {
		this.path = pathModule.resolve(ROOT_PATH, path);
	}

	parentDir() {
		return new FSPath(pathModule.dirname(this.path));
	}

	read(options: AnyObject | string = 'utf8'): Promise<string> {
		if (typeof options !== 'string' && options.encoding === undefined) {
			options.encoding = 'utf8';
		}
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, options, (err, data) => {
				err ? reject(err) : resolve(data as string);
			});
		});
	}

	readSync(options: AnyObject | string = 'utf8'): string {
		if (typeof options !== 'string' && options.encoding === undefined) {
			options.encoding = 'utf8';
		}
		return fs.readFileSync(this.path, options as {encoding: 'utf8'});
	}

	readBuffer(options: AnyObject | string = {}): Promise<Buffer> {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, options, (err, data) => {
				err ? reject(err) : resolve(data as Buffer);
			});
		});
	}

	readBufferSync(options: AnyObject | string = {}) {
		return fs.readFileSync(this.path, options as {encoding: null});
	}

	exists(): Promise<boolean> {
		return new Promise(resolve => {
			fs.exists(this.path, exists => {
				resolve(exists);
			});
		});
	}

	existsSync() {
		return fs.existsSync(this.path);
	}

	readIfExists(): Promise<string> {
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

	write(data: string | Buffer, options: AnyObject = {}) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise<void>((resolve, reject) => {
			fs.writeFile(this.path, data, options, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	writeSync(data: string | Buffer, options: AnyObject = {}) {
		if (Config.nofswriting) return;
		return fs.writeFileSync(this.path, data, options);
	}

	/**
	 * Writes to a new file before renaming to replace an old file. If
	 * the process crashes while writing, the old file won't be lost.
	 * Does not protect against simultaneous writing; use writeUpdate
	 * for that.
	 */
	async safeWrite(data: string | Buffer, options: AnyObject = {}) {
		await FS(this.path + '.NEW').write(data, options);
		await FS(this.path + '.NEW').rename(this.path);
	}

	safeWriteSync(data: string | Buffer, options: AnyObject = {}) {
		FS(this.path + '.NEW').writeSync(data, options);
		FS(this.path + '.NEW').renameSync(this.path);
	}

	waitUntil(time: number): Promise<void> {
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
	 */
	writeUpdate(dataFetcher: () => string | Buffer, options: AnyObject = {}) {
		if (Config.nofswriting) return;
		const pendingUpdate: PendingUpdate | undefined = pendingUpdates.get(this.path);

		// @ts-ignore
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

	writeUpdateNow(dataFetcher: () => string | Buffer, options: AnyObject) {
		// @ts-ignore
		const throttleTime = options.throttle ? Date.now() + options.throttle : 0;
		const update = {
			isWriting: true,
			pendingDataFetcher: null,
			pendingOptions: null,
			throttleTime,
			throttleTimer: null,
		};
		pendingUpdates.set(this.path, update);
		void this.safeWrite(dataFetcher(), options).then(() => this.finishUpdate());
	}
	checkNextUpdate() {
		const pendingUpdate = pendingUpdates.get(this.path);
		if (!pendingUpdate) throw new Error(`FS: Pending update not found`);
		if (pendingUpdate.isWriting) throw new Error(`FS: Conflicting update`);

		const {pendingDataFetcher: dataFetcher, pendingOptions: options} = pendingUpdate;
		if (!dataFetcher || !options) {
			// no pending update
			pendingUpdates.delete(this.path);
			return;
		}

		this.writeUpdateNow(dataFetcher, options);
	}
	finishUpdate() {
		const pendingUpdate = pendingUpdates.get(this.path);
		if (!pendingUpdate) throw new Error(`FS: Pending update not found`);
		if (!pendingUpdate.isWriting) throw new Error(`FS: Conflicting update`);

		pendingUpdate.isWriting = false;
		const throttleTime = pendingUpdate.throttleTime;
		if (!throttleTime || throttleTime < Date.now()) {
			this.checkNextUpdate();
			return;
		}

		pendingUpdate.throttleTimer = setTimeout(() => this.checkNextUpdate(), throttleTime - Date.now());
	}

	append(data: string | Buffer, options: AnyObject = {}) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise<void>((resolve, reject) => {
			fs.appendFile(this.path, data, options, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	appendSync(data: string | Buffer, options: AnyObject = {}) {
		if (Config.nofswriting) return;
		return fs.appendFileSync(this.path, data, options);
	}

	symlinkTo(target: string) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise<void>((resolve, reject) => {
			fs.symlink(target, this.path, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	symlinkToSync(target: string) {
		if (Config.nofswriting) return;
		return fs.symlinkSync(target, this.path);
	}

	copyFile(dest: string) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise<void>((resolve, reject) => {
			fs.copyFile(this.path, dest, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	rename(target: string) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise<void>((resolve, reject) => {
			fs.rename(this.path, target, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	renameSync(target: string) {
		if (Config.nofswriting) return;
		return fs.renameSync(this.path, target);
	}

	readdir(): Promise<string[]> {
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

	createWriteStream(options = {}): WriteStream {
		if (Config.nofswriting) {
			// @ts-ignore
			return new WriteStream({write() {}});
		}
		// @ts-ignore
		return new WriteStream(fs.createWriteStream(this.path, options));
	}

	createAppendStream(options = {}): WriteStream {
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
		return new Promise<void>((resolve, reject) => {
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

	async rmdir(recursive?: boolean) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise<void>((resolve, reject) => {
			fs.rmdir(this.path, {recursive}, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	rmdirSync(recursive?: boolean) {
		if (Config.nofswriting) return;
		return fs.rmdirSync(this.path, {recursive});
	}

	mkdir(mode: string | number = 0o755) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(this.path, mode, err => {
				err ? reject(err) : resolve();
			});
		});
	}

	mkdirSync(mode: string | number = 0o755) {
		if (Config.nofswriting) return;
		return fs.mkdirSync(this.path, mode);
	}

	mkdirIfNonexistent(mode: string | number = 0o755) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise<void>((resolve, reject) => {
			fs.mkdir(this.path, mode, err => {
				if (err && err.code === 'EEXIST') return resolve();
				err ? reject(err) : resolve();
			});
		});
	}

	mkdirIfNonexistentSync(mode: string | number = 0o755) {
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
	 */
	async mkdirp(mode: string | number = 0o755) {
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
	 */
	mkdirpSync(mode: string | number = 0o755) {
		try {
			this.mkdirIfNonexistentSync(mode);
		} catch (err) {
			if (err.code !== 'ENOENT') throw err;
			this.parentDir().mkdirpSync(mode);
			this.mkdirIfNonexistentSync(mode);
		}
	}

	/** Calls the callback if the file is modified. */
	onModify(callback: () => void) {
		fs.watchFile(this.path, (curr, prev) => {
			if (curr.mtime > prev.mtime) return callback();
		});
	}

	/** Clears callbacks added with onModify(). */
	unwatch() {
		fs.unwatchFile(this.path);
	}

	async isFile() {
		return new Promise<boolean>((resolve, reject) => {
			fs.stat(this.path, (err, stats) => {
				err ? reject(err) : resolve(stats.isFile());
			});
		});
	}

	isFileSync() {
		return fs.statSync(this.path).isFile();
	}

	async isDirectory() {
		return new Promise<boolean>((resolve, reject) => {
			fs.stat(this.path, (err, stats) => {
				err ? reject(err) : resolve(stats.isDirectory());
			});
		});
	}

	isDirectorySync() {
		return fs.statSync(this.path).isDirectory();
	}

	async realpath() {
		return new Promise<string>((resolve, reject) => {
			fs.realpath(this.path, (err, path) => {
				err ? reject(err) : resolve(path);
			});
		});
	}

	realpathSync() {
		return fs.realpathSync(this.path);
	}
}

class FileReadStream extends ReadStream {
	fd: Promise<number>;

	constructor(file: string) {
		super();
		this.fd = new Promise((resolve, reject) => {
			fs.open(file, 'r', (err, fd) => err ? reject(err) : resolve(fd));
		});
		this.atEOF = false;
	}

	_read(size = 16384): Promise<void> {
		return new Promise<void>((resolve, reject) => {
			if (this.atEOF) return resolve();
			this.ensureCapacity(size);
			void this.fd.then(fd => {
				fs.read(fd, this.buf, this.bufEnd, size, null, (err, bytesRead, buf) => {
					if (err) return reject(err);
					if (!bytesRead) {
						this.atEOF = true;
						this.resolvePush();
						return resolve();
					}
					this.bufEnd += bytesRead;
					// throw new Error([...this.buf].map(x => x.toString(16)).join(' '));
					this.resolvePush();
					resolve();
				});
			});
		});
	}

	_destroy() {
		return new Promise<void>(resolve => {
			void this.fd.then(fd => {
				fs.close(fd, () => resolve());
			});
		});
	}
}

function getFs(path: string) {
	return new FSPath(path);
}

export const FS = Object.assign(getFs, {
	FileReadStream,
});

