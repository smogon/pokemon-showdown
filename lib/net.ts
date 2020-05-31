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
import { resolve } from 'dns';

export interface NetRequestOptions extends https.RequestOptions {
	body?: string;
	query?: {[k: string]: string | number};
}

export class NetStream extends Streams.ReadWriteStream {
	statusCode?: number;
	headers?: http.IncomingHttpHeaders;
	opts?: NetRequestOptions;
	uri: string;
	request: http.ClientRequest | null;
	responseStream: Streams.ReadStream | null;
	constructor(uri: string, opts?: NetRequestOptions | null) {
		super();
		this.statusCode = 0;
		this.headers = {};
		this.opts = opts ? opts : undefined;
		this.uri = uri
		this.responseStream = null;
		// make request
		this.request = null;
		this.makeRequest();
	}
	makeRequest() {
		const protocol = url.parse(this.uri).protocol as string;
		const net = protocol.includes('https:') ? https : http;
		return new Promise(resolve => {
			 this.request = net.get(this.opts ? this.opts : this.uri, response => {
				  response.setEncoding('utf-8');
				  const stream = new Streams.ReadStream({nodeStream: response});
				  resolve({
						stream: stream,
						headers: response.headers,
						statusCode: response.statusCode
				  });
			 });
		});
  }
	encodeQuery(data: AnyObject) {
		let out = '';
		for (const key in data) {
			if (out) out += `&`;
			out += `${key}=${encodeURIComponent('' + data[key])}`;
		}
		return out;
	}
	write(body: string) {
		if (!this.request) throw new Error(`Writing to a request that doesn't exist.`);
		const opts = this.opts;
		if (opts?.body) {
			if (body) throw new Error(`must not pass both body and opts.body`);
			body = opts.body;
		}

		if (body && typeof body !== 'string') {
			if (!opts?.headers) opts!.headers = {};
			if (!opts?.headers['Content-Type']) {
				opts!.headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}
			body = this.encodeQuery(body);
		}

		if (opts?.query) {
			this.uri += (this.uri.includes('?') ? '&' : '?') + this.encodeQuery(opts.query);
		}

		const postBody = body;
		if (postBody) {
			if (!opts!.headers) opts!.headers = {};
			if (!opts!.headers['Content-Length']) {
				opts!.headers['Content-Length'] = Buffer.byteLength(postBody);
			}
		}
		if (postBody) {
			this.request.write(postBody);
		}
		if (opts?.timeout) {
			this.request.setTimeout(opts.timeout, () => {
				this.request!.abort();
			});
		}
	}
	read() {
		return this.responseStream!.read();
	}
}
export class NetRequest {
	uri: string;
	statusCode?: number;
	constructor(uri: string) {
		this.uri = uri;
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
		const stream = new NetStream(this.uri);
		this.statusCode = stream.statusCode;
		return stream;
	}

	/**
	 * Makes a basic http/https request to the URI.
	 * Returns the response data.
	 * @param opts request opts - headers, etc.
	 */
	async get(opts: AnyObject = {}): Promise<string | null> {
		return this.getStream(opts).read();
	}

	/**
	 * Makes a http/https POST request to the given link.
	 * @param opts request opts - headers, etc.
	 * @param body POST body
	 */
	post(opts: AnyObject = {}, body: AnyObject) {
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
