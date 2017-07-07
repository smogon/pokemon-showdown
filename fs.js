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
 * @license MIT license
 */

'use strict';

const pathModule = require('path');
const fs = require('fs');

/*eslint no-unused-expressions: ["error", { "allowTernary": true }]*/

class Path {
	/**
	 * @param {string} path
	 */
	constructor(path) {
		this.path = pathModule.resolve(__dirname, path);
	}
	parentDir() {
		return new Path(pathModule.dirname(this.path));
	}
	read(options = {}) {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, options, (err, data) => {
				err ? reject(err) : resolve(data);
			});
		});
	}
	readSync(options = {}) {
		return fs.readFileSync(this.path, options);
	}
	readTextIfExists() {
		return new Promise((resolve, reject) => {
			fs.readFile(this.path, 'utf8', (err, data) => {
				if (err && err.code === 'ENOENT') return resolve('');
				err ? reject(err) : resolve(data);
			});
		});
	}
	readTextIfExistsSync() {
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
			// @ts-ignore TypeScript bug
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
	createWriteStream(options = {}) {
		if (Config.nofswriting) {
			const Writable = require('stream').Writable;
			return new Writable({write: (chunk, encoding, callback) => callback()});
		}
		return fs.createWriteStream(this.path, options);
	}
	createAppendStream(options = {}) {
		if (Config.nofswriting) {
			const Writable = require('stream').Writable;
			return new Writable({write: (chunk, encoding, callback) => callback()});
		}
		options.flags = options.flags || 'a';
		return fs.createWriteStream(this.path, options);
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
			// @ts-ignore
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
		// @ts-ignore
		return fs.mkdirSync(this.path, mode);
	}
	/**
	 * @param {string | number} mode
	 */
	mkdirIfNonexistent(mode = 0o755) {
		if (Config.nofswriting) return Promise.resolve();
		return new Promise((resolve, reject) => {
			// @ts-ignore
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
			// @ts-ignore
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

/**
 * @param {string} path
 */
function getFs(path) {
	return new Path(path);
}

module.exports = getFs;
