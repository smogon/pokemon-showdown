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

type BufferEncoding =
	'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'ucs2' | 'ucs-2' | 'base64' | 'latin1' | 'binary' | 'hex';

export class ReadStream {
	buf: Buffer;
	bufStart: number;
	bufEnd: number;
	bufCapacity: number;
	readSize: number;
	atEOF: boolean;
	errorBuf: Error[] | null;
	encoding: BufferEncoding;
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
		this.errorBuf = null;
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

	push(buf: Buffer | string | null, encoding: BufferEncoding = this.encoding) {
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

	pushError(err: Error) {
		if (!this.errorBuf) this.errorBuf = [];
		this.errorBuf.push(err);
		this.resolvePush();
	}

	readError() {
		if (this.errorBuf) {
			const err = this.errorBuf.shift();
			if (!this.errorBuf.length) this.errorBuf = null;
			throw err;
		}
	}

	peekError() {
		if (this.errorBuf) {
			throw this.errorBuf[0];
		}
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

	/**
	 * Reads until the internal buffer is non-empty. Does nothing if the
	 * internal buffer is already non-empty.
	 *
	 * If `byteCount` is a number, instead read until the internal buffer
	 * contains at least `byteCount` bytes.
	 *
	 * If `byteCount` is `true`, reads even if the internal buffer is
	 * non-empty.
	 */
	loadIntoBuffer(byteCount: number | null | true = null, readError?: boolean) {
		this[readError ? 'readError' : 'peekError']();
		if (byteCount === 0) return;
		this.readSize = Math.max(
			byteCount === true ? this.bufSize + 1 : byteCount === null ? 1 : byteCount,
			this.readSize
		);
		if (!this.errorBuf && !this.atEOF && this.bufSize < this.readSize) {
			let bytes: number | null = this.readSize - this.bufSize;
			if (bytes === Infinity || byteCount === null) bytes = null;
			return this.doLoad(bytes, readError);
		}
	}

	async doLoad(chunkSize?: number | null, readError?: boolean) {
		while (!this.errorBuf && !this.atEOF && this.bufSize < this.readSize) {
			if (chunkSize) this._read(chunkSize);
			else this._read();
			await this.nextPush;
			this[readError ? 'readError' : 'peekError']();
		}
	}

	peek(byteCount?: number | null, encoding?: BufferEncoding): string | null | Promise<string | null>;
	peek(encoding: BufferEncoding): string | null | Promise<string | null>;
	peek(byteCount: number | string | null = null, encoding: BufferEncoding = this.encoding) {
		if (typeof byteCount === 'string') {
			encoding = byteCount as BufferEncoding;
			byteCount = null;
		}
		const maybeLoad = this.loadIntoBuffer(byteCount);
		if (maybeLoad) return maybeLoad.then(() => this.peek(byteCount as number, encoding));

		if (!this.bufSize && byteCount !== 0) return null;
		if (byteCount === null) return this.buf.toString(encoding, this.bufStart, this.bufEnd);
		if (byteCount > this.bufSize) byteCount = this.bufSize;
		return this.buf.toString(encoding, this.bufStart, this.bufStart + byteCount);
	}

	peekBuffer(byteCount: number | null = null): Buffer | null | Promise<Buffer | null> {
		const maybeLoad = this.loadIntoBuffer(byteCount);
		if (maybeLoad) return maybeLoad.then(() => this.peekBuffer(byteCount));

		if (!this.bufSize && byteCount !== 0) return null;
		if (byteCount === null) return this.buf.slice(this.bufStart, this.bufEnd);
		if (byteCount > this.bufSize) byteCount = this.bufSize;
		return this.buf.slice(this.bufStart, this.bufStart + byteCount);
	}

	async read(byteCount?: number | null, encoding?: BufferEncoding): Promise<string | null>;
	async read(encoding: BufferEncoding): Promise<string | null>;
	async read(byteCount: number | string | null = null, encoding: BufferEncoding = this.encoding) {
		if (typeof byteCount === 'string') {
			encoding = byteCount as BufferEncoding;
			byteCount = null;
		}
		await this.loadIntoBuffer(byteCount, true);
		const out = this.peek(byteCount, encoding) as string | null;
		if (byteCount === null || byteCount >= this.bufSize) {
			this.bufStart = 0;
			this.bufEnd = 0;
		} else {
			this.bufStart += byteCount;
		}
		return out;
	}

	async readBuffer(byteCount: number | null = null) {
		await this.loadIntoBuffer(byteCount, true);
		const out = this.peek(byteCount) as Buffer | null;
		if (byteCount === null || byteCount >= this.bufSize) {
			this.bufStart = 0;
			this.bufEnd = 0;
		} else {
			this.bufStart += byteCount;
		}
		return out;
	}

	async indexOf(symbol: string, encoding: BufferEncoding = this.encoding) {
		let idx = this.buf.indexOf(symbol, this.bufStart, encoding);
		while (!this.atEOF && (idx >= this.bufEnd || idx < 0)) {
			await this.loadIntoBuffer(true);
			idx = this.buf.indexOf(symbol, this.bufStart, encoding);
		}
		if (idx >= this.bufEnd) return -1;
		return idx - this.bufStart;
	}

	async readAll(encoding: BufferEncoding = this.encoding) {
		return (await this.read(Infinity, encoding)) || '';
	}

	peekAll(encoding: BufferEncoding = this.encoding) {
		return this.peek(Infinity, encoding);
	}

	async readDelimitedBy(symbol: string, encoding: BufferEncoding = this.encoding) {
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

	async readLine(encoding: BufferEncoding = this.encoding) {
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

	async next(byteCount: number | null = null) {
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
		if (!options.noEnd) return outStream.end();
	}
}

interface WriteStreamOptions {
	nodeStream?: NodeJS.WritableStream;
	write?: (this: WriteStream, data: string | Buffer) => (Promise<undefined> | undefined);
	end?: (this: WriteStream) => Promise<any>;
}

export class WriteStream {
	isReadable: boolean;
	isWritable: true;
	encoding: BufferEncoding;
	nodeWritableStream: NodeJS.WritableStream | null;
	drainListeners: (() => void)[];

	constructor(optionsOrStream: WriteStreamOptions | NodeJS.WritableStream = {}) {
		this.isReadable = false;
		this.isWritable = true;
		this.encoding = 'utf8';
		this.nodeWritableStream = null;
		this.drainListeners = [];

		let options: WriteStreamOptions = optionsOrStream as any;
		if ((options as any)._writableState) {
			options = {nodeStream: optionsOrStream as NodeJS.WritableStream};
		}
		if (options.nodeStream) {
			const nodeStream: NodeJS.WritableStream = options.nodeStream;
			this.nodeWritableStream = nodeStream;
			options.write = function (data: string | Buffer) {
				const result = this.nodeWritableStream!.write(data);
				if (result !== false) return undefined;
				if (!this.drainListeners.length) {
					this.nodeWritableStream!.once('drain', () => {
						for (const listener of this.drainListeners) listener();
						this.drainListeners = [];
					});
				}
				return new Promise(resolve => {
					this.drainListeners.push(resolve);
				});
			};
			// Prior to Node v10.12.0, attempting to close STDOUT or STDERR will throw
			if (nodeStream !== process.stdout && nodeStream !== process.stderr) {
				options.end = function () {
					return new Promise(resolve => {
						this.nodeWritableStream!.end(() => resolve());
					});
				};
			}
		}

		if (options.write) this._write = options.write;
		if (options.end) this._end = options.end;
	}

	write(chunk: Buffer | string | null): void | Promise<void> {
		if (chunk === null) {
			return this.end();
		}
		return this._write(chunk);
	}

	writeLine(chunk: string | null): void | Promise<void> {
		if (chunk === null) {
			return this.end();
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

export class ReadWriteStream extends ReadStream implements WriteStream {
	isReadable: true;
	isWritable: true;
	nodeWritableStream: NodeJS.WritableStream | null;
	drainListeners: (() => void)[];

	constructor(options = {}) {
		super(options);
		this.isReadable = true;
		this.isWritable = true;
		this.nodeWritableStream = null;
		this.drainListeners = [];
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

	/**
	 * In a ReadWriteStream, `_read` does not need to be implemented,
	 * because it's valid for the read stream buffer to be filled only by
	 * `_write`.
	 */
	_read() {}

	_end(): void | Promise<void> {}

	async end() {
		return this._end();
	}
}

export class ObjectReadStream<T> {
	buf: T[];
	readSize: number;
	atEOF: boolean;
	errorBuf: Error[] | null;
	isReadable: boolean;
	isWritable: boolean;
	nodeReadableStream: NodeJS.ReadableStream | null;
	nextPushResolver: (() => void) | null;
	nextPush: Promise<void>;
	awaitingPush: boolean;

	constructor(optionsOrStreamLike: {[k: string]: any} | NodeJS.ReadableStream | T[] = {}) {
		this.buf = [];
		this.readSize = 0;
		this.atEOF = false;
		this.errorBuf = null;
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

	push(elem: T | null) {
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

	pushError(err: Error) {
		if (!this.errorBuf) this.errorBuf = [];
		this.errorBuf.push(err);
		this.resolvePush();
	}

	readError() {
		if (this.errorBuf) {
			const err = this.errorBuf.shift();
			if (!this.errorBuf.length) this.errorBuf = null;
			throw err;
		}
	}

	peekError() {
		if (this.errorBuf) {
			throw this.errorBuf[0];
		}
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

	async loadIntoBuffer(count: number | true = 1, readError?: boolean) {
		this[readError ? 'readError' : 'peekError']();
		if (count === true) count = this.buf.length + 1;
		if (this.buf.length >= count) return;
		this.readSize = Math.max(count, this.readSize);
		while (!this.errorBuf && !this.atEOF && this.buf.length < this.readSize) {
			const readResult = this._read();
			if (readResult && readResult.then) {
				await readResult;
			} else {
				await this.nextPush;
			}
			this[readError ? 'readError' : 'peekError']();
		}
	}

	async peek() {
		if (this.buf.length) return this.buf[0];
		await this.loadIntoBuffer();
		return this.buf[0];
	}

	async read() {
		if (this.buf.length) return this.buf.shift();
		await this.loadIntoBuffer(1, true);
		if (!this.buf.length) return null;
		return this.buf.shift()!;
	}

	async peekArray(count: number | null = null) {
		await this.loadIntoBuffer(count === null ? 1 : count);
		return this.buf.slice(0, count === null ? Infinity : count);
	}

	async readArray(count: number | null = null) {
		await this.loadIntoBuffer(count === null ? 1 : count, true);
		const out = this.buf.slice(0, count === null ? Infinity : count);
		this.buf = this.buf.slice(out.length);
		return out;
	}

	async readAll() {
		await this.loadIntoBuffer(Infinity, true);
		const out = this.buf;
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

	async pipeTo(outStream: ObjectWriteStream<T>, options: {noEnd?: boolean} = {}) {
		/* tslint:disable */
		let value, done;
		while (({value, done} = await this.next(), !done)) {
			await outStream.write(value!);
		}
		/* tslint:enable */
		if (!options.noEnd) return outStream.end();
	}
}

interface ObjectWriteStreamOptions<T> {
	_writableState?: any;
	nodeStream?: NodeJS.WritableStream;
	write?: (this: ObjectWriteStream<T>, data: T) => Promise<any> | undefined;
	end?: (this: ObjectWriteStream<T>) => Promise<any>;
}

export class ObjectWriteStream<T> {
	isReadable: boolean;
	isWritable: true;
	nodeWritableStream: NodeJS.WritableStream | null;

	constructor(optionsOrStream: ObjectWriteStreamOptions<T> | NodeJS.WritableStream = {}) {
		this.isReadable = false;
		this.isWritable = true;
		this.nodeWritableStream = null;

		let options: ObjectWriteStreamOptions<T> = optionsOrStream as any;
		if (options._writableState) {
			options = {nodeStream: optionsOrStream as NodeJS.WritableStream};
		}
		if (options.nodeStream) {
			const nodeStream: NodeJS.WritableStream = options.nodeStream;
			this.nodeWritableStream = nodeStream;

			options.write = function (data: T) {
				const result = this.nodeWritableStream!.write(data as unknown as string);
				if (result === false) {
					return new Promise(resolve => {
						this.nodeWritableStream!.once('drain', () => {
							resolve();
						});
					});
				}
			};

			// Prior to Node v10.12.0, attempting to close STDOUT or STDERR will throw
			if (nodeStream !== process.stdout && nodeStream !== process.stderr) {
				options.end = function () {
					return new Promise(resolve => {
						this.nodeWritableStream!.end(() => resolve());
					});
				};
			}
		}

		if (options.write) this._write = options.write;
		if (options.end) this._end = options.end;
	}

	write(elem: T | null): void | Promise<void> {
		if (elem === null) {
			return this.end();
		}
		return this._write(elem);
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

interface ObjectReadWriteStreamOptions<T> {
	write?: (this: ObjectWriteStream<T>, elem: T) => Promise<any> | undefined | void;
	end?: () => Promise<any> | undefined | void;
}

export class ObjectReadWriteStream<T> extends ObjectReadStream<T> implements ObjectWriteStream<T> {
	isReadable: true;
	isWritable: true;
	nodeWritableStream: NodeJS.WritableStream | null;

	constructor(options: ObjectReadWriteStreamOptions<T> = {}) {
		super(options);
		this.isReadable = true;
		this.isWritable = true;
		this.nodeWritableStream = null;
		if (options.write) this._write = options.write;
		if (options.end) this._end = options.end;
	}

	write(elem: T): void | Promise<void> {
		return this._write(elem);
	}

	_write(elem: T): void | Promise<void> {
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
