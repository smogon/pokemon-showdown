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

export class NetRequest {
	uri: string;
	statusCode?: number;
	constructor(uri: string) {
		this.uri = uri;
		this.statusCode = undefined;
	}
	encodeQuery(data: PostData) {
		let out = '';
		for (const key in data) {
			if (out) out += `&`;
			out += `${key}=${encodeURIComponent('' + data[key])}`;
		}
		return out;
	}
	/**
	 * Makes a http/https get request to the given link and returns the status, headers, and a stream.
	 * The request data itself can be read with ReadStream#read().
	 * @param opts request opts - headers, etc.
	 * @param body POST body
	 */
	getFullResponse(opts: NetRequestOptions = {}, body?: string | PostData): Promise<{
		statusCode: number | undefined,
		statusMessage: string | undefined,
		headers: http.IncomingHttpHeaders | undefined,
		stream: Streams.ReadStream,
	}> {
		if (opts.body) {
			if (body) throw new Error(`must not pass both body and opts.body`);
			body = opts.body;
		}

		if (body && typeof body !== 'string') {
			if (!opts.headers) opts.headers = {};
			if (!opts.headers['Content-Type']) {
				opts.headers['Content-Type'] = 'application/x-www-form-urlencoded';
			}
			body = this.encodeQuery(body);
		}

		if (opts.query) {
			this.uri += (this.uri.includes('?') ? '&' : '?') + this.encodeQuery(opts.query);
		}

		const postBody = body;
		if (postBody) {
			if (!opts.headers) opts.headers = {};
			if (!opts.headers['Content-Length']) {
				opts.headers['Content-Length'] = Buffer.byteLength(postBody);
			}
		}

		return new Promise((resolve, reject) => {
			if (Config.noNetRequests) return reject(new Error(`Net requests are disabled.`));

			const protocol = url.parse(this.uri).protocol as string;
			const net = protocol.includes('https:') ? https : http;
			const req = net.request(opts ? opts : this.uri, response => {
				const stream = new Streams.ReadStream({nodeStream: response});
				resolve({
					statusCode: response.statusCode,
					statusMessage: response.statusMessage,
					headers: response.headers,
					stream: stream,
				});
			});
			req.on('err', err => {
				reject(err);
			});
			if (postBody) {
				req.write(postBody);
			}
			if (opts.timeout) req.setTimeout(opts.timeout, () => req.abort());
		});
	}

	/**
	 * Makes a basic http/https request to the URI.
	 * Returns the response data.
	 * @param opts request opts - headers, etc.
	 */
	async get(opts: NetRequestOptions = {}): Promise<string> {
		const response = await this.getFullResponse(opts);
		return response.stream.readAll();
	}

	/**
	 * Makes a http/https POST request to the given link.
	 * @param opts request opts - headers, etc.
	 * @param body POST body
	 */
	post(body: PostData, opts: Omit<NetRequestOptions, 'method' | 'body'> = {}): Promise<string> {
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
