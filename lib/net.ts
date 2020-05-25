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

export class URIRequest {
	uri: string;
	statusCode?: number;
	constructor(uri: string) {
		this.uri = uri;
		this.statusCode = undefined;
	}
	/**
	 * Makes a basic http/https request to the URI.
	 * Returns the response data.
	 * @param opts request opts - headers, etc.
	 */
	async get(opts?: AnyObject): Promise<string | null> {
		if (Config.noURIRequests) return null;
		const protocol = url.parse(this.uri).protocol as string;
		const net = protocol.includes('https:') ? https : http;
		return new Promise((resolve) => {
			const req = net.get(opts ? opts : this.uri, res => {
				res.setEncoding('utf-8');
				this.statusCode = res.statusCode;
				void Streams.readAll(res).then(buffer => resolve(buffer));
			});
			req.on('error', (err) => {
				throw err;
			});
			req.end();
		});
	}
	/**
	 * Makes a http/https get request to the given link and returns the status, headers, and a stream.
	 * The request data itself can be read with ReadStream#read().
	 * @param opts request opts - headers, etc.
	 */
	async getFullResponse(opts?: AnyObject): Promise<{
		statusCode: number | undefined, statusMessage: string | undefined,
		headers: http.IncomingHttpHeaders | undefined, stream: Streams.ReadStream,
	} | null> {
		if (Config.noURIRequests) return null;
		return new Promise(resolve => {
			const protocol = url.parse(this.uri).protocol as string;
			const net = protocol.includes('https:') ? https : http;
			const req = net.get(opts ? opts : this.uri, response => {
				response.setEncoding('utf-8');
				const stream = new Streams.ReadStream({nodeStream: response});
				resolve({
					statusCode: response.statusCode,
					statusMessage: response.statusMessage,
					headers: response.headers,
					stream: stream,
				});
			});
			req.on('err', err => {
				throw err;
			});
		});
	}
	/**
	 * Makes a http/https request to the given link.
	 * @param opts request opts - headers, etc.
	 * @param chunk data to be written to request (mostly for loginserver.)
	 * @param timeout time to wait before cancelling request.
	 */
	async request(opts?: AnyObject, chunk?: string, timeout?: number): Promise<string> {
		return new Promise(resolve => {
			const protocol = url.parse(this.uri).protocol as string;
			const net = protocol.includes('https:') ? https : http;
			const req = net.request(opts ? opts : this.uri, res => {
				res.setEncoding('utf-8');
				this.statusCode = res.statusCode;
				void Streams.readAll(res).then(buffer => resolve(buffer));
			});
			req.on('err', err => {
				throw err;
			});
			if (chunk) req.write(chunk);
			if (timeout) req.setTimeout(timeout, () => req.abort());
		});
	}
}

export function Net(uri: string) {
	return new URIRequest(uri);
}
