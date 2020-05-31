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

export interface PostData {
	[key: string]: string | number;
}
export interface NetRequestOptions extends https.RequestOptions {
	body?: string | PostData;
	query?: PostData;
}

export class NetStream extends Streams.ReadWriteStream {
	opts: NetRequestOptions | null;
	uri: string;
	request: http.ClientRequest;
	/** will be a Promise before the response is received, and the response itself after */
	response: Promise<http.IncomingMessage> | http.IncomingMessage;
	statusCode: number | null;
	/** response headers */
	headers: http.IncomingHttpHeaders | null;

	constructor(uri: string, opts: NetRequestOptions | null = null) {
		super();
		this.statusCode = null;
		this.headers = null;
		this.uri = uri;
		this.opts = opts;
		// make request
		this.response = null!;
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
		const net = protocol.includes('https:') ? https : http;

		let resolveResponse: (value: http.IncomingMessage) => void;
		this.response = new Promise(resolve => {
			resolveResponse = resolve;
		});

		const request = net.request(this.uri, opts, response => {
			response.setEncoding('utf-8');
			this.nodeReadableStream = response;
			this.response = response;
			resolveResponse(response);
			this.statusCode = response.statusCode || null;
			this.headers = response.headers;
			response.on('data', data => {
				this.push(data);
			});
			response.on('end', () => {
				this.push(null);
			});
		});
		request.on('error', error => {
			this.pushError(error);
		});
		if (body) {
			request.write(body);
		} else {
			this.nodeWritableStream = request;
		}
		if (opts.timeout) {
			request.setTimeout(opts.timeout, () => {
				request.abort();
			});
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
			throw new Error("`options.body` is what you would have written to a NetStream - you must choose one or the other");
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
	statusCode?: number;
	constructor(uri: string) {
		this.uri = uri;
		this.statusCode = undefined;
	}
	/**
	 * Makes a http/https get request to the given link and returns a stream.
	 * The request data itself can be read with ReadStream#read().
	 * The NetStream class also holds headers and statusCode as a property.
	 * @param opts request opts - headers, etc.
	 * @param body POST body
	 */
	getStream(opts: NetRequestOptions = {}) {
		if (Config.noNetRequests) throw new Error(`Net requests are disabled.`);
		const stream = new NetStream(this.uri, opts);
		return stream;
	}

	/**
	 * Makes a basic http/https request to the URI.
	 * Returns the response data.
	 * @param opts request opts - headers, etc.
	 */
	async get(opts: NetRequestOptions = {}): Promise<string | null> {
		return this.getStream(opts).readAll();
	}

	/**
	 * Makes a http/https POST request to the given link.
	 * @param opts request opts - headers, etc.
	 * @param body POST body
	 */
	post(opts: Omit<NetRequestOptions, 'body'>, body: PostData | string): Promise<string | null>;
	/**
	 * Makes a http/https POST request to the given link.
	 * @param opts request opts - headers, etc.
	 */
	post(opts?: NetRequestOptions): Promise<string | null>;
	post(opts: NetRequestOptions = {}, body?: PostData | string) {
		if (!body) body = opts.body;
		return this.get({
			...opts,
			method: 'POST',
			body,
		});
	}
}

export function Net(uri: string) {
	return new NetRequest(uri);
}
