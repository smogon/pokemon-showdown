/**
 * Net - abstraction layer around Node's HTTP/S request system.
 * Advantages:
 * - easier acquiring of data
 * - mass disabling of outgoing requests via Config.
 */

import * as https from 'https';
import * as http from 'http';
import * as url from 'url';
import * as Streams from './streams';
declare const Config: any;

export interface PostData {
	[key: string]: string | number;
}
export interface NetRequestOptions extends https.RequestOptions {
	body?: string | PostData;
	writable?: boolean;
	query?: PostData;
}

export class HttpError extends Error {
	statusCode?: number;
	body: string;
	constructor(message: string, statusCode: number | undefined, body: string) {
		super(message);
		this.name = 'HttpError';
		this.statusCode = statusCode;
		this.body = body;
		Error.captureStackTrace(this, HttpError);
	}
}

export class NetStream extends Streams.ReadWriteStream {
	opts: NetRequestOptions | null;
	uri: string;
	request: http.ClientRequest;
	/** will be a Promise before the response is received, and the response itself after */
	response: Promise<http.IncomingMessage | null> | http.IncomingMessage | null;
	statusCode: number | null;
	/** response headers */
	headers: http.IncomingHttpHeaders | null;
	state: 'pending' | 'open' | 'timeout' | 'success' | 'error';

	constructor(uri: string, opts: NetRequestOptions | null = null) {
		super();
		this.statusCode = null;
		this.headers = null;
		this.uri = uri;
		this.opts = opts;
		// make request
		this.response = null;
		this.state = 'pending';
		this.request = this.makeRequest(opts);
	}
	makeRequest(opts: NetRequestOptions | null) {
		if (!opts) opts = {};
		let body = opts.body;
		if (body && typeof body !== 'string') {
			if (!opts.headers) opts.headers = {};
			if (!opts.headers['Content-Type']) {
				opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}
			body = NetStream.encodeQuery(body);
		}

		if (opts.query) {
			this.uri += (this.uri.includes('?') ? '&' : '?') + NetStream.encodeQuery(opts.query);
		}

		if (body) {
			if (!opts.headers) opts.headers = {};
			if (!opts.headers['Content-Length']) {
				opts.headers['Content-Length'] = Buffer.byteLength(body);
			}
		}

		const protocol = url.parse(this.uri).protocol as string;
		const net = protocol === 'https:' ? https : http;

		let resolveResponse: ((value: http.IncomingMessage | null) => void) | null;
		this.response = new Promise(resolve => {
			resolveResponse = resolve;
		});

		const request = net.request(this.uri, opts, response => {
			this.state = 'open';
			this.nodeReadableStream = response;
			this.response = response;
			this.statusCode = response.statusCode || null;
			this.headers = response.headers;

			response.setEncoding('utf-8');
			resolveResponse!(response);
			resolveResponse = null;

			response.on('data', data => {
				this.push(data);
			});
			response.on('end', () => {
				if (this.state === 'open') this.state = 'success';
				if (!this.atEOF) this.pushEnd();
			});
		});
		request.on('close', () => {
			if (!this.atEOF) {
				this.state = 'error';
				this.pushError(new Error("Unexpected connection close"));
			}
			if (resolveResponse) {
				this.response = null;
				resolveResponse(null);
				resolveResponse = null;
			}
		});
		request.on('error', error => {
			if (!this.atEOF) this.pushError(error, true);
		});
		if (opts.timeout || opts.timeout === undefined) {
			request.setTimeout(opts.timeout || 5000, () => {
				this.state = 'timeout';
				this.pushError(new Error("Request timeout"));
				request.abort();
			});
		}

		if (body) {
			request.write(body);
			request.end();
			if (opts.writable) {
				throw new Error(`options.body is what you would have written to a NetStream - you must choose one or the other`);
			}
		} else if (opts.writable) {
			this.nodeWritableStream = request;
		} else {
			request.end();
		}

		return request;
	}
	static encodeQuery(data: PostData) {
		let out = '';
		for (const key in data) {
			if (out) out += `&`;
			out += `${key}=${encodeURIComponent('' + data[key])}`;
		}
		return out;
	}
	_write(data: string | Buffer): Promise<void> | void {
		if (!this.nodeWritableStream) {
			throw new Error("You must specify opts.writable to write to a request.");
		}
		const result = this.nodeWritableStream.write(data);
		if (result !== false) return undefined;
		if (!this.drainListeners.length) {
			this.nodeWritableStream.once('drain', () => {
				for (const listener of this.drainListeners) listener();
				this.drainListeners = [];
			});
		}
		return new Promise(resolve => {
			this.drainListeners.push(resolve);
		});
	}
	_read() {
		this.nodeReadableStream?.resume();
	}
	_pause() {
		this.nodeReadableStream?.pause();
	}
}
export class NetRequest {
	uri: string;
	/** Response from last request, made so response stuff is available without being hacky */
	response?: http.IncomingMessage;
	constructor(uri: string) {
		this.uri = uri;
	}
	/**
	 * Makes a http/https get request to the given link and returns a stream.
	 * The request data itself can be read with ReadStream#readAll().
	 * The NetStream class also holds headers and statusCode as a property.
	 *
	 * @param opts request opts - headers, etc.
	 * @param body POST body
	 */
	getStream(opts: NetRequestOptions = {}) {
		if (typeof Config !== 'undefined' && Config.noNetRequests) {
			throw new Error(`Net requests are disabled.`);
		}
		const stream = new NetStream(this.uri, opts);
		return stream;
	}

	/**
	 * Makes a basic http/https request to the URI.
	 * Returns the response data.
	 *
	 * Will throw if the response code isn't 200 OK.
	 *
	 * @param opts request opts - headers, etc.
	 */
	async get(opts: NetRequestOptions = {}): Promise<string> {
		const stream = this.getStream(opts);
		const response = await stream.response;
		if (response) this.response = response;
		if (response && response.statusCode !== 200) {
			throw new HttpError(response.statusMessage || "Connection error", response.statusCode, await stream.readAll());
		}
		return stream.readAll();
	}

	/**
	 * Makes a http/https POST request to the given link.
	 * @param opts request opts - headers, etc.
	 * @param body POST body
	 */
	post(opts: Omit<NetRequestOptions, 'body'>, body: PostData | string): Promise<string>;
	/**
	 * Makes a http/https POST request to the given link.
	 * @param opts request opts - headers, etc.
	 */
	post(opts?: NetRequestOptions): Promise<string>;
	post(opts: NetRequestOptions = {}, body?: PostData | string) {
		if (!body) body = opts.body;
		return this.get({
			...opts,
			method: 'POST',
			body,
		});
	}
}

export const Net = Object.assign((path: string) => new NetRequest(path), {
	NetRequest, NetStream,
});
