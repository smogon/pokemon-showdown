/**
 * Persistence
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * This is an abstraction for code handling persistent data using JSON, CSV,
 * and TSV files.
 */

'use strict';

const path = require('path');

const FS = require('./fs');

/**
 * This is a rough approximation of how objects that are valid JSON are typed.
 * FIXME: there must be a better way to define this with generics...
 * @typedef {{[k: string]: any} | any[] | number | string | boolean | null} __JSONValue__
 * @typedef {{[k: string]: __JSONValue__} | __JSONValue__[] | __JSONValue__} JSONValue
 */

/**
 * This is a class that defines some generic methods to be used by its
 * subclasses for implementations pertaining to more specific file formats.
 */
class Writer {
	/**
	 * @param {string} filename
	 * @param {any} data
	 */
	constructor(filename, data) {
		if (!path.isAbsolute(filename)) {
			throw new Error(`Persistence: the given filename "${filename}" must be an absolute path!`);
		}

		/** @type {string} */
		this.filename = filename;
		/** @type {any} */
		this.data = data;
	}

	/**
	 * Stringifies file data before it gets written to disk.
	 * @param {any} data
	 * @return {string}
	 */
	stringify(data) {
		if (data === undefined) return 'undefined';
		if (data === null) return 'null';
		return data.toString();
	}

	/**
	 * Parses and returns file data on construct. The file's schema should be
	 * verified before returning to update older schemae and to decide what to
	 * do if the file's schema doesn't match what is expected. This returns a
	 * boolean depending on whether or not the read was successful.
	 * @return {Promise<boolean>}
	 */
	async read() {
		return false;
	}

	/**
	 * Synchronous version of Writer#read.
	 * @return {boolean}
	 */
	readSync() {
		return false;
	}

	/**
	 * Writes file data to disk. Returns a boolean indicating whether or not
	 * the write succeeded.
	 * @return {Promise<boolean>}
	 */
	async write() {
		return false;
	}

	/**
	 * Synchronous version of Writer#write.
	 * @return {boolean}
	 */
	writeSync() {
		return false;
	}
}

class JSONWriter extends Writer {
	/**
	 * @param {string} filename
	 * @param {JSONValue=} data
	 */
	constructor(filename, data) {
		if (!filename.toLowerCase().endsWith('.json')) {
			throw new Error(`Persistence: the given JSON filename "${filename}" must end with ".json".`);
		}

		super(filename, data);

		/** @type {JSONValue} */
		this.data = (data === undefined) ? null : data;

		/** @type {boolean} */
		this.canWrite = (data !== undefined);
		/** @type {boolean} */
		this.isWriting = false;
		/** @type {boolean} */
		this.hasPendingWrite = false;
	}

	/**
	 * @param {JSONValue | Buffer} data
	 * @param {((key: string, value: any) => any)=} replacer
	 * @param {(string | number)=} space
	 * @return {string}
	 */
	stringify(data, replacer, space) {
		let buf = Buffer.isBuffer(data) ? data.toString() : data;
		return JSON.stringify(buf, replacer, space);
	}

	async read() {
		/** @type {any} */
		let file = FS(this.filename);
		/** @type {JSONValue} */
		let data = null;
		/** @type {boolean} */
		let success = true;
		try {
			data = JSON.parse(await file.read());
			this.canWrite = true;
		} catch (e) {
			success = false;
			if (e.code === 'ENOENT') {
				this.canWrite = true;
			} else {
				throw new Error(`Persistence: JSON file "${this.filename}" could not be read. The file cannot be overwritten until the server is restarted.`);
			}
		} finally {
			this.data = data;
		}

		return success;
	}

	readSync() {
		/** @type {JSONValue} */
		let data = null;
		/** @type {boolean} */
		let success = true;
		try {
			data = require(this.filename);
			this.canWrite = true;
		} catch (e) {
			success = false;
			if (e.code === 'MODULE_NOT_FOUND') {
				this.canWrite = true;
			} else {
				throw new Error(`Persistence: JSON file "${this.filename}" could not be read. The file cannot be overwritten until the server is restarted.`);
			}
		} finally {
			this.data = data;
		}

		return success;
	}

	async write() {
		if (!this.canWrite) return false;
		if (this.isWriting) {
			this.hasPendingWrite = true;
			return false;
		}

		this.isWriting = true;

		/** @type {string} */
		let data = this.stringify(this.data);
		/** @type {any} */
		let file = FS(`${this.filename}.0`);
		/** @type {boolean} */
		let success = true;
		try {
			await file.write(data);
			await file.rename(this.filename);
		} catch (e) {
			success = false;
		}

		this.isWriting = false;
		if (this.hasPendingWrite) {
			this.hasPendingWrite = false;
			setImmediate(() => this.write());
		}

		return success;
	}

	writeSync() {
		if (!this.canWrite) return false;
		if (this.isWriting) {
			this.hasPendingWrite = true;
			return false;
		}

		this.isWriting = true;

		/** @type {string} */
		let data = this.stringify(this.data);
		/** @type {any} */
		let file = FS(`${this.filename}.0`);
		/** @type {boolean} */
		let success = true;
		try {
			file.writeSync(data);
			file.renameSync(this.filename);
		} catch (e) {
			success = false;
		}

		this.isWriting = false;
		if (this.hasPendingWrite) {
			this.hasPendingWrite = false;
			setImmediate(() => this.writeSync());
		}

		return success;
	}
}

class XSVWriter extends Writer {
	/**
	 * @param {string} filename
	 * @param {any[]} [data = []]
	 * @param {string} separator
	 */
	constructor(filename, data = [], separator) {
		if (!Array.isArray(data)) {
			throw new Error('Persistence: CSV/TSV file data must be an array!');
		}

		super(filename, data);

		/**
		 * TODO: remove once persistence.d.ts exists
		 * @type {any[]}
		 */
		this.data = data;

		/** @type {string} */
		this.separator = separator;
		/** @type {string[] | null} */
		this.columns = null;
	}

	// TODO
}

class CSVWriter extends XSVWriter {
	/**
	 * @param {string} filename
	 * @param {any[]} data
	 */
	constructor(filename, data) {
		if (!filename.toLowerCase().endsWith('.csv')) {
			throw new Error(`Persistence: the given filename "${filename}" must end with ".csv"!`);
		}

		super(filename, data, ',');
	}
}

class TSVWriter extends XSVWriter {
	/**
	 * @param {string} filename
	 * @param {any[]} data
	 */
	constructor(filename, data) {
		if (!filename.toLowerCase().endsWith('.tsv')) {
			throw new Error(`Persistence: the given filename "${filename}" must end with ".tsv"!`);
		}

		super(filename, data, '\t');
	}
}

module.exports = {
	JSONWriter,
	CSVWriter,
	TSVWriter,
};
