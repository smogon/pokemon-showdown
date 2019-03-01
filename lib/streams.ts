/**
 * Streams
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * The Node.js standard library's Streams are really hard to use. This
 * offers a better stream API.
 *
 * Documented in STREAMS.md.
 *
 * @license MIT
 */

const BUF_SIZE = 65536 * 4;

export class ReadStream {
	buf: Buffer;
	bufStart: number;
	bufEnd: number;
	bufCapacity: number;
	readSize: number;
	atEOF: boolean;
	encoding: string;
	isReadable: boolean;
	isWritable: boolean;
	nodeReadableStream: NodeJS.ReadableStream | null;
	nextPushResolver: (() => void) | null;
	nextPush: Promise<void>;
	awaitingPush: boolean;

	constructor(optionsOrStreamLike: {[k: string]: any} | NodeJS.ReadableStream | string | Buffer = {}) {
		this.buf = Buffer.allocUnsafe(BUF_SIZE);
		this.bufStart = 0;
		this.bufEnd = 0;
		this.bufCapacity = BUF_SIZE;
		this.readSize = 0;
		this.atEOF = false;
		this.encoding = 'utf8';
		this.isReadable = true;
		this.isWritable = false;
		this.nodeReadableStream = null;
		this.nextPushResolver = null;
		this.nextPush = new Promise(resolve => {
			this.nextPushResolver = resolve;
		});
		this.awaitingPush = false;

		let options;
		if (typeof optionsOrStreamLike === 'string') {
			options = {buffer: optionsOrStreamLike};
		} else if (optionsOrStreamLike instanceof Buffer) {
			options = {buffer: optionsOrStreamLike};
		} else if (typeof (optionsOrStreamLike as any)._readableState === 'object') {
			options = {nodeStream: optionsOrStreamLike as NodeJS.ReadableStream};
		} else {
			options = optionsOrStreamLike;
		}
		if (options.nodeStream) {
			const nodeStream: NodeJS.ReadableStream = options.nodeStream;
			this.nodeReadableStream = nodeStream;
			nodeStream.on('data', data => {
				this.push(data);
			});
			nodeStream.on('end', () => {
				this.push(null);
			});

			options.read = function (this: ReadStream, unusedBytes: number) {
				this.nodeReadableStream!.resume();
			};

			options.pause = function (this: ReadStream, unusedBytes: number) {
				this.nodeReadableStream!.pause();
			};
		}

		if (options.read) this._read = options.read;
		if (options.pause) this._pause = options.pause;
		if (options.destroy) this._destroy = options.read;
		if (options.encoding) this.encoding = options.encoding;
		if (options.buffer !== undefined) {
			this.push(options.buffer);
			this.push(null);
		}
	}

	get bufSize() {
		return this.bufEnd - this.bufStart;
	}

	moveBuf() {
		if (this.bufStart !== this.bufEnd) {
			this.buf.copy(this.buf, 0, this.bufStart, this.bufEnd);
		}
		this.bufEnd -= this.bufStart;
		this.bufStart = 0;
	}

	expandBuf(newCapacity = this.bufCapacity * 2) {
		const newBuf = Buffer.allocUnsafe(newCapacity);
		this.buf.copy(newBuf, 0, this.bufStart, this.bufEnd);
		this.bufEnd -= this.bufStart;
		this.bufStart = 0;
		this.buf = newBuf;
	}

	ensureCapacity(additionalCapacity: number) {
		if (this.bufEnd + additionalCapacity <= this.bufCapacity) return;
		const capacity = this.bufEnd - this.bufStart + additionalCapacity;
		if (capacity <= this.bufCapacity) {
			return this.moveBuf();
		}
		let newCapacity = this.bufCapacity * 2;
		while (newCapacity < capacity) newCapacity *= 2;
		this.expandBuf(newCapacity);
	}

	push(buf: Buffer | string | null, encoding: string = this.encoding) {
		let size;
		if (this.atEOF) return;
		if (buf === null) {
			this.atEOF = true;
			this.resolvePush();
			return;
		} else if (typeof buf === 'string') {
			size = Buffer.byteLength(buf, encoding);
			this.ensureCapacity(size);
			this.buf.write(buf, this.bufEnd);
		} else {
			size = buf.length;
			this.ensureCapacity(size);
			buf.copy(this.buf, this.bufEnd);
		}
		this.bufEnd += size;
		if (this.bufSize > this.readSize && size * 2 < this.bufSize) this._pause();
		this.resolvePush();
	}

	resolvePush() {
		if (!this.nextPushResolver) throw new Error(`Push after end of read stream`);
		this.nextPushResolver();
		if (this.atEOF) {
			this.nextPushResolver = null;
			return;
		}
		this.nextPush = new Promise(resolve => {
			this.nextPushResolver = resolve;
		});
	}

	_read(size: number = 0): void | Promise<void> {
		throw new Error(`ReadStream needs to be subclassed and the _read function needs to be implemented.`);
	}

	_destroy() {}
	_pause() {}

	async loadIntoBuffer(byteCount: number | null = null) {
		if (byteCount === 0) return;
		this.readSize = Math.max(byteCount || (this.bufSize + 1), this.readSize);
		let bytes: number | null = this.readSize - this.bufSize;
		if (bytes === Infinity || byteCount === null) bytes = null;
		while (!this.atEOF && this.bufSize < this.readSize) {
			if (bytes) this._read(bytes);
			else this._read();
			await this.nextPush;
		}
	}

	async peek(byteCount: number | null = null, encoding: string = this.encoding) {
		if (byteCount === null && this.bufSize) return this.buf.toString(encoding, this.bufStart, this.bufEnd);
		await this.loadIntoBuffer(byteCount);
		if (byteCount === null) return this.buf.toString(encoding, this.bufStart, this.bufEnd);
		if (byteCount > this.bufSize) byteCount = this.bufSize;
		if (!this.bufSize) return null;
		return this.buf.toString(encoding, this.bufStart, this.bufStart + byteCount);
	}

	async peekBuffer(byteCount: number | null = null) {
		if (byteCount === null && this.bufSize) return this.buf.slice(this.bufStart, this.bufEnd);
		await this.loadIntoBuffer(byteCount);
		if (byteCount === null) return this.buf.slice(this.bufStart, this.bufEnd);
		if (byteCount > this.bufSize) byteCount = this.bufSize;
		if (!this.bufSize) return null;
		return this.buf.slice(this.bufStart, this.bufStart + byteCount);
	}

	async read(byteCount: number | string | null = null, encoding = this.encoding) {
		if (typeof byteCount === 'string') {
			encoding = byteCount;
			byteCount = null;
		}
		const out = await this.peek(byteCount, encoding);
		if (byteCount === null || byteCount >= this.bufSize) {
			this.bufStart = 0;
			this.bufEnd = 0;
		} else {
			this.bufStart += byteCount;
		}
		return out;
	}

	async readBuffer(byteCount: number | null = null) {
		const out = await this.peekBuffer(byteCount);
		if (byteCount === null || byteCount >= this.bufSize) {
			this.bufStart = 0;
			this.bufEnd = 0;
		} else {
			this.bufStart += byteCount;
		}
		return out;
	}

	async indexOf(symbol: string, encoding: string = this.encoding) {
		let idx = this.buf.indexOf(symbol, this.bufStart, encoding);
		while (!this.atEOF && (idx >= this.bufEnd || idx < 0)) {
			await this.loadIntoBuffer();
			idx = this.buf.indexOf(symbol, this.bufStart, encoding);
		}
		if (idx >= this.bufEnd) return -1;
		return idx - this.bufStart;
	}

	async readAll(encoding = this.encoding) {
		return (await this.read(Infinity, encoding)) || '';
	}

	peekAll(encoding = this.encoding) {
		return this.peek(Infinity, encoding);
	}

	async readDelimitedBy(symbol: string, encoding: string = this.encoding) {
		if (this.atEOF && !this.bufSize) return null;
		const idx = await this.indexOf(symbol, encoding);
		if (idx < 0) {
			return this.readAll(encoding);
		} else {
			const out = await this.read(idx, encoding);
			this.bufStart += Buffer.byteLength(symbol, 'utf8');
			return out;
		}
	}

	async readLine(encoding = this.encoding) {
		if (!encoding) throw new Error(`readLine must have an encoding`);
		let line = await this.readDelimitedBy('\n', encoding);
		if (line && line.endsWith('\r')) line = line.slice(0, -1);
		return line;
	}

	async destroy() {
		this.atEOF = true;
		this.bufStart = 0;
		this.bufEnd = 0;
		if (this.nextPushResolver) this.resolvePush();
		return this._destroy();
	}

	async next(byteCount: string | number | null = null) {
		const value = await this.read(byteCount);
		return {value, done: value === null};
	}

	async pipeTo(outStream: WriteStream, options: {noEnd?: boolean} = {}) {
		/* tslint:disable */
		let value, done;
		while (({value, done} = await this.next(), !done)) {
			await outStream.write(value);
		}
		/* tslint:enable */
		if (!options.noEnd) outStream.end();
	}
}

interface WriteStreamOptions {
	writableState?: any;
	nodeStream?: NodeJS.ReadableStream;
	write?: (this: WriteStream, data: string | Buffer) => (Promise<any> | undefined);
	end?: () => Promise<any>;
}

export class WriteStream {
	isReadable: boolean;
	isWritable: true;
	encoding: string;
	nodeWritableStream: NodeJS.ReadableStream | null;
	drainListeners: (() => void)[];

	constructor(options: WriteStreamOptions = {}) {
		this.isReadable = false;
		this.isWritable = true;
		this.encoding = 'utf8';
		this.nodeWritableStream = null;
		this.drainListeners = [];

		if ((options as any)._writableState) {
			// @ts-ignore
			options = {nodeStream: options};
		}
		if (options.nodeStream) {
			const nodeStream: NodeJS.ReadableStream = options.nodeStream;
			this.nodeWritableStream = nodeStream;
			options.write = function (this: WriteStream, data: string | Buffer) {
				// @ts-ignore
				const result = this.nodeWritableStream.write(data);
				if (result !== false) return undefined;
				if (!this.drainListeners.length) {
					// @ts-ignore
					this.nodeWritableStream.once('drain', () => {
						for (const listener of this.drainListeners) listener();
						this.drainListeners = [];
					});
				}
				return new Promise(resolve => {
					this.drainListeners.push(resolve);
				});
			};
			options.end = function () {
				return new Promise(resolve => {
					// @ts-ignore
					this.nodeWritableStream.end(() => resolve());
				});
			};
		}

		if (options.write) this._write = options.write;
		if (options.end) this._end = options.end;
	}

	async write(chunk: Buffer | string | null): Promise<boolean> {
		if (chunk === null) {
			await this.end();
			return false;
		}
		await this._write(chunk);
		return true;
	}

	async writeLine(chunk: string | null): Promise<boolean> {
		if (chunk === null) {
			await this.end();
			return false;
		}
		return this.write(chunk + '\n');
	}

	_write(chunk: Buffer | string): void | Promise<void> {
		throw new Error(`WriteStream needs to be subclassed and the _write function needs to be implemented.`);
	}

	_end(): void | Promise<void> {}

	async end(chunk: string | null = null): Promise<void> {
		if (chunk) {
			await this.write(chunk);
		}
		return this._end();
	}
}

export class ReadWriteStream extends ReadStream {
	constructor(options = {}) {
		super(options);
		this.isReadable = true;
		this.isWritable = true;
	}

	write(chunk: Buffer | string): Promise<void> | void {
		return this._write(chunk);
	}

	writeLine(chunk: string): Promise<void> | void {
		return this.write(chunk + '\n');
	}

	_write(chunk: Buffer | string): Promise<void> | void {
		throw new Error(`WriteStream needs to be subclassed and the _write function needs to be implemented.`);
	}

	/** In a ReadWriteStream, _read does not need to be implemented. */
	_read() {}

	_end(): void | Promise<void> {}

	async end() {
		return this._end();
	}
}

export class ObjectReadStream {
	buf: any[];
	readSize: number;
	atEOF: boolean;
	isReadable: boolean;
	isWritable: boolean;
	nodeReadableStream: NodeJS.ReadableStream | null;
	nextPushResolver: (() => void) | null;
	nextPush: Promise<void>;
	awaitingPush: boolean;

	constructor(optionsOrStreamLike: {[k: string]: any} | NodeJS.ReadableStream | any[] = {}) {
		this.buf = [];
		this.readSize = 0;
		this.atEOF = false;
		this.isReadable = true;
		this.isWritable = false;
		this.nodeReadableStream = null;
		this.nextPushResolver = null;
		this.nextPush = new Promise(resolve => {
			this.nextPushResolver = resolve;
		});
		this.awaitingPush = false;

		let options;
		if (Array.isArray(optionsOrStreamLike)) {
			options = {buffer: optionsOrStreamLike};
		} else if (typeof (optionsOrStreamLike as any)._readableState === 'object') {
			options = {nodeStream: optionsOrStreamLike as NodeJS.ReadableStream};
		} else {
			options = optionsOrStreamLike;
		}
		if (options.nodeStream) {
			const nodeStream: NodeJS.ReadableStream = options.nodeStream;
			this.nodeReadableStream = nodeStream;
			nodeStream.on('data', data => {
				this.push(data);
			});
			nodeStream.on('end', () => {
				this.push(null);
			});

			options.read = function (this: ReadStream, unusedBytes: number) {
				this.nodeReadableStream!.resume();
			};

			options.pause = function (this: ReadStream, unusedBytes: number) {
				this.nodeReadableStream!.pause();
			};
		}

		if (options.read) this._read = options.read;
		if (options.pause) this._pause = options.pause;
		if (options.destroy) this._destroy = options.read;
		if (options.buffer !== undefined) {
			this.buf = options.buffer.slice();
			this.push(null);
		}
	}

	push(elem: any) {
		if (this.atEOF) return;
		if (elem === null) {
			this.atEOF = true;
			this.resolvePush();
			return;
		} else {
			this.buf.push(elem);
		}
		if (this.buf.length > this.readSize && this.buf.length >= 16) this._pause();
		this.resolvePush();
	}

	resolvePush() {
		if (!this.nextPushResolver) throw new Error(`Push after end of read stream`);
		this.nextPushResolver();
		if (this.atEOF) {
			this.nextPushResolver = null;
			return;
		}
		this.nextPush = new Promise(resolve => {
			this.nextPushResolver = resolve;
		});
	}

	_read(size: number = 0): void | Promise<void> {
		throw new Error(`ReadStream needs to be subclassed and the _read function needs to be implemented.`);
	}

	_destroy() {}
	_pause() {}

	async loadIntoBuffer(count: number = 1) {
		if (this.buf.length >= count) return;
		this.readSize = Math.max(count, this.readSize);
		while (!this.atEOF && this.buf.length < this.readSize) {
			let readResult = this._read();
			// @ts-ignore
			if (readResult && readResult.then) {
				await readResult;
			} else {
				await this.nextPush;
			}
		}
	}

	async peek() {
		if (this.buf.length) return this.buf[0];
		await this.loadIntoBuffer();
		return this.buf[0];
	}

	async read() {
		if (this.buf.length) return this.buf.shift();
		await this.loadIntoBuffer();
		if (!this.buf.length) return null;
		return this.buf.shift();
	}

	async peekArray(count: number | null = null) {
		await this.loadIntoBuffer(count || 1);
		if (count === null || count === Infinity) {
			return this.buf.slice();
		}
		return this.buf.slice(0, count);
	}

	async readArray(count: number | null = null) {
		let out = await this.peekArray(count);
		this.buf = this.buf.slice(out.length);
		return out;
	}

	async readAll() {
		await this.loadIntoBuffer(Infinity);
		let out = this.buf;
		this.buf = [];
		return out;
	}

	async peekAll() {
		await this.loadIntoBuffer(Infinity);
		return this.buf.slice();
	}

	async destroy() {
		this.atEOF = true;
		this.buf = [];
		this.resolvePush();
		return this._destroy();
	}

	async next() {
		const value = await this.read();
		return {value, done: value === null};
	}

	async pipeTo(outStream: WriteStream, options: {noEnd?: boolean} = {}) {
		/* tslint:disable */
		let value, done;
		while (({value, done} = await this.next(), !done)) {
			await outStream.write(value);
		}
		/* tslint:enable */
		if (!options.noEnd) outStream.end();
	}
}

interface ObjectWriteStreamOptions<T> {
	_writableState?: any;
	nodeStream?: NodeJS.ReadableStream;
	write?: (this: WriteStream, data: T) => Promise<any> | undefined;
	end?: () => Promise<any>;
}

export class ObjectWriteStream<T> {
	isReadable: boolean;
	isWritable: true;
	nodeWritableStream: NodeJS.ReadableStream | null;

	constructor(options: ObjectWriteStreamOptions<T> = {}) {
		this.isReadable = false;
		this.isWritable = true;
		this.nodeWritableStream = null;

		if (options._writableState) {
			// @ts-ignore
			options = {nodeStream: options};
		}
		if (options.nodeStream) {
			const nodeStream: NodeJS.ReadableStream = options.nodeStream;
			this.nodeWritableStream = nodeStream;

			options.write = function (this: WriteStream, data: T) {
				// @ts-ignore
				const result = this.nodeWritableStream!.write(data);
				if (result === false) {
					return new Promise(resolve => {
						// @ts-ignore
						this.nodeWritableStream.once('drain', () => {
							resolve();
						});
					});
				}
			};

			options.end = function () {
				return new Promise(resolve => {
					// @ts-ignore
					this.nodeWritableStream.end(() => resolve());
				});
			};
		}

		if (options.write) this._write = options.write;
		if (options.end) this._end = options.end;
	}

	async write(elem: T | null): Promise<boolean> {
		if (elem === null) {
			await this.end();
			return false;
		}
		await this._write(elem);
		return true;
	}

	_write(elem: T): void | Promise<void> {
		throw new Error(`WriteStream needs to be subclassed and the _write function needs to be implemented.`);
	}

	_end(): void | Promise<void> {}

	async end(elem: T | null = null): Promise<void> {
		if (elem) {
			await this.write(elem);
		}
		return this._end();
	}
}

interface ObjectReadWriteStreamOptions {
	write?: (this: WriteStream, data: string) => Promise<any> | undefined | void;
	end?: () => Promise<any> | undefined | void;
}

export class ObjectReadWriteStream extends ObjectReadStream {
	isReadable: true;
	isWritable: true;

	constructor(options: ObjectReadWriteStreamOptions = {}) {
		super(options);
		this.isReadable = true;
		this.isWritable = true;
		if (options.write) this._write = options.write;
		if (options.end) this._end = options.end;
	}

	write(elem: any): void | Promise<void> {
		return this._write(elem);
	}

	_write(elem: any): void | Promise<void> {
		throw new Error(`WriteStream needs to be subclassed and the _write function needs to be implemented.`);
	}
	/** In a ReadWriteStream, _read does not need to be implemented. */
	_read() {}

	_end(): void | Promise<void> {}

	async end() {
		return this._end();
	}
}

export function readAll(nodeStream: NodeJS.ReadableStream, encoding?: any) {
	return new ReadStream(nodeStream).readAll(encoding);
}
