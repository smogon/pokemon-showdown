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
	constructor(uri: string) {
		this.uri = uri;
	}
	/**
	 * Makes a basic http/https request to the URI.
	 * Returns the response data.
	 * @param opts request opts - headers, etc.
	 * @param chunk data to be written to request (mostly for loginserver.)
	 * @param timeout time to wait before cancelling request.
	 */
	async get(opts?: AnyObject, chunk?: string, timeout?: number): Promise<string | null> {
		if (Config.noURIRequests) return null;
		const protocol = url.parse(this.uri).protocol as string;
		const net = protocol!.includes('https:') ? https : http;
		return new Promise((resolve) => {
			const req = net.get(opts ? opts : this.uri, res => {
				void Streams.readAll(res).then(buffer => {
					resolve(buffer);
				});
			});
			if (chunk) req.write(chunk);
			if (timeout) if (timeout) req.setTimeout(timeout, () => req.abort());
			req.on('error', (err) => {
				throw err;
			});
			req.end();
		});
	}
	/**
	 * Makes a http/https request to the given link and returns the status, headers, and a stream.
	 * The request data itself can be read with ReadStream#read().
	 * @param opts request opts - headers, etc.
	 * @param chunk data to be written to request (mostly for loginserver)
	 * @param timeout time to wait before cancelling request.
	 */
	async getFullResponse(opts?: AnyObject, chunk?: string, timeout?: number): Promise<{
		statusCode: number | undefined, statusMessage: string | undefined,
		headers: http.IncomingHttpHeaders | undefined, stream: Streams.ReadStream,
	} | null> {
		if (Config.noURIRequests) return null;
		return new Promise(resolve => {
			const protocol = url.parse(this.uri).protocol as string;
			const net = protocol.includes('https:') ? https : http;
			const req = net.get(opts? opts : this.uri, response => {
				response.setEncoding('utf-8');
				const stream = new Streams.ReadStream({nodeStream: response});
				resolve({
					statusCode: response.statusCode,
					statusMessage: response.statusMessage,
					headers: response.headers,
					stream: stream,
				});
			});
			if (chunk) req.write(chunk);
			if (timeout) req.setTimeout(timeout, () => req.abort());
		});
	}
}

export function Net(uri: string) {
	return new URIRequest(uri);
}
