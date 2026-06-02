/**
 * Static server
 *
 * API resembles node-static, but with some differences:
 *
 * - `serve`'s callback needs to return `true` to suppress the default error page
 * - everything is Promises
 * - no customizing cache time by filename
 * - no index.json directory streaming (it was undocumented; you weren't using it)
 *
 * Forked from node-static @
 * https://github.com/cloudhead/node-static/blob/e49fbd728e93294c225f52103962e56aab86cb1a/lib/node-static.js
 *
 * @author Guangcong Luo <guangcongluo@gmail.com>, Alexis Sellier, Brett Zamir
 * @license MIT
 */

import fs from 'node:fs';
import fsP from 'node:fs/promises';
import http from 'node:http';
import path from 'node:path';

const DEBUG = false;
export const SERVER_INFO = 'node-static-vendored/1.0';

export type Headers = Record<string, string>;
export type Options = {
	/** Root directory to serve files from. */
	root?: string,
	/** Index file when serving a directory. */
	indexFile?: string,
	/** Default extension to append to files if not found. */
	defaultExtension?: string,
	/** Cache time in seconds. null = no cache header. undefined = default (3600). 0 = no cache. */
	cacheTime?: number | null,
	/** Serve `.gz` files if available. */
	gzip?: boolean | RegExp,
	/** Custom headers for success responses (not sent on errors). */
	headers?: Headers,
	/** Server header. `null` to disable. */
	serverInfo?: string | null,
};
export type Result = {
	status: number,
	headers: Record<string, string>,
	message: string | undefined,
	/** Have we already responded? */
	alreadySent: boolean,
};
/** Return true to suppress default error page */
export type ErrorCallback = (result: Result) => boolean | void;

export const mimeTypes: { [key: string]: string } = {
	'.html': 'text/html;charset=utf-8',
	'.htm': 'text/html;charset=utf-8',
	'.css': 'text/css;charset=utf-8',
	'.js': 'application/javascript;charset=utf-8',
	'.jsx': 'application/javascript;charset=utf-8',
	'.cjs': 'application/javascript;charset=utf-8',
	'.mjs': 'application/javascript;charset=utf-8',
	'.json': 'application/json;charset=utf-8',
	'.ts': 'application/typescript;charset=utf-8',
	'.xml': 'application/xml;charset=utf-8',
	'.txt': 'text/plain;charset=utf-8',
	'.md': 'text/markdown;charset=utf-8',

	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml;charset=utf-8',
	'.ico': 'image/x-icon',
	'.bmp': 'image/bmp',
	'.webp': 'image/webp',

	'.woff': 'font/woff',
	'.woff2': 'font/woff2',
	'.ttf': 'font/ttf',
	'.eot': 'application/vnd.ms-fontobject',

	'.zip': 'application/zip',
	'.tar': 'application/x-tar',
	'.gz': 'application/gzip',

	'.mp3': 'audio/mpeg',
	'.wav': 'audio/wav',
	'.ogg': 'audio/ogg',
	'.mp4': 'video/mp4',
	'.webm': 'video/webm',
};

export class StaticServer {
	root: string;
	options: Options;
	cacheTime: number | null = 3600;
	defaultHeaders: Headers = {};
	/** Contains the `.`, unlike options.defaultExtension */
	defaultExtension = '';
	constructor(root: string, options?: Options);
	constructor(options?: Options);
	constructor(root?: Options | string | null, options?: Options) {
		if (root && typeof root === 'object') {
			options = root;
			root = null;
		}

		// resolve() doesn't normalize (to lowercase) drive letters on Windows
		this.root = path.normalize(path.resolve(root || '.'));
		this.options = options || {};

		this.options.indexFile ||= 'index.html';

		if (this.options.cacheTime !== undefined) {
			this.cacheTime = this.options.cacheTime;
		}

		if (this.options.defaultExtension) {
			this.defaultExtension = `.${this.options.defaultExtension}`;
		}

		if (this.options.serverInfo !== null) {
			this.defaultHeaders['server'] = this.options.serverInfo || SERVER_INFO;
		}

		for (const k in this.options.headers) {
			this.defaultHeaders[k] = this.options.headers[k];
		}
	}

	async serveDir(
		pathname: string, req: http.IncomingMessage, res: http.ServerResponse
	): Promise<Result> {
		const htmlIndex = path.join(pathname, this.options.indexFile!);

		try {
			const stat = await fsP.stat(htmlIndex);
			const status = 200;
			const headers = {};
			const originalPathname = decodeURIComponent(new URL(req.url!, 'http://localhost').pathname);
			if (originalPathname.length && !originalPathname.endsWith('/')) {
				return this.getResult(301, { 'Location': originalPathname + '/' });
			} else {
				return this.respond(status, headers, htmlIndex, stat, req, res);
			}
		} catch {
			return this.getResult(404);
		}
	}

	async serveFile(
		pathname: string, status: number, headers: Headers, req: http.IncomingMessage, res: http.ServerResponse,
		errorCallback?: ErrorCallback
	): Promise<Result> {
		pathname = this.resolve(pathname);

		const stat = await fsP.stat(pathname);
		const result = await this.respond(status, headers, pathname, stat, req, res);
		return this.finish(result, req, res, errorCallback);
	}

	getResult(status: number, headers: Headers = {}, alreadySent = false): Result {
		if (this.defaultHeaders['server']) {
			headers['server'] ||= this.defaultHeaders['server'];
		}

		return {
			status,
			headers,
			message: http.STATUS_CODES[status],
			alreadySent,
		};
	}

	finish(
		result: Result, req: http.IncomingMessage, res: http.ServerResponse, errorCallback?: ErrorCallback
	): Result {
		// If `alreadySent`, it's been taken care of in `this.stream`.
		if (!result.alreadySent && !errorCallback?.(result)) {
			res.writeHead(result.status, result.headers);
			if (result.status >= 400 && req.method !== 'HEAD') {
				res.write(`${result.status} ${result.message}`);
			}
			res.end();
		}
		return result;
	}

	async servePath(
		pathname: string, status: number, headers: Headers, req: http.IncomingMessage, res: http.ServerResponse
	): Promise<Result> {
		pathname = this.resolve(pathname);

		// Make sure we're not trying to access a
		// file outside of the root.
		if (!pathname.startsWith(this.root)) {
			// Forbidden
			return this.getResult(403);
		}

		try {
			const stat = await fsP.stat(pathname);
			if (stat.isFile()) { // Stream a single file.
				return this.respond(status, headers, pathname, stat, req, res);
			} else if (stat.isDirectory()) { // Stream a directory of files.
				return this.serveDir(pathname, req, res);
			} else {
				return this.getResult(400);
			}
		} catch {
			// possibly not found, check default extension
			if (this.defaultExtension) {
				try {
					const stat = await fsP.stat(pathname + this.defaultExtension);
					if (stat.isFile()) {
						return this.respond(status, headers, pathname + this.defaultExtension, stat, req, res);
					} else {
						return this.getResult(400);
					}
				} catch {
					// really not found
					return this.getResult(404);
				}
			} else {
				return this.getResult(404);
			}
		}
	}

	resolve(pathname: string) {
		return path.resolve(path.join(this.root, pathname));
	}

	async serve(req: http.IncomingMessage, res: http.ServerResponse, errorCallback?: ErrorCallback): Promise<Result> {
		let pathname;
		try {
			pathname = decodeURIComponent(new URL(req.url!, 'http://localhost').pathname);
		} catch {
			return this.finish(this.getResult(400), req, res, errorCallback);
		}

		const result = await this.servePath(pathname, 200, {}, req, res);
		return this.finish(result, req, res, errorCallback);
	}

	/** Check if we should consider sending a gzip version of the file based on the
	  * file content type and client's Accept-Encoding header value. */
	gzipOk(req: http.IncomingMessage, contentType: string) {
		const enable = this.options.gzip;
		if (enable === true || ((enable instanceof RegExp) && enable.test(contentType))) {
			return req.headers['accept-encoding']?.includes('gzip');
		}
		return false;
	}

	/** Send a gzipped version of the file if the options and the client indicate gzip is enabled and
	  * we find a .gz file matching the static resource requested. */
	respondGzip(
		status: number, contentType: string, _headers: Headers, file: string, stat: fs.Stats,
		req: http.IncomingMessage, res: http.ServerResponse
	): Promise<Result> {
		if (!this.gzipOk(req, contentType)) {
			// Client doesn't want gzip
			return this.respondNoGzip(status, contentType, _headers, file, stat, req, res);
		}
		const gzFile = `${file}.gz`;
		return fsP.stat(gzFile).catch(() => null).then(gzStat => {
			if (gzStat?.isFile()) {
				const vary = _headers['Vary'];
				_headers['Vary'] = (vary && vary !== 'Accept-Encoding' ? `${vary}, ` : '') + 'Accept-Encoding';
				_headers['Content-Encoding'] = 'gzip';
				stat.size = gzStat.size;
				file = gzFile;
			}
			return this.respondNoGzip(status, contentType, _headers, file, stat, req, res);
		});
	}

	parseByteRange(req: http.IncomingMessage, stat: fs.Stats) {
		const byteRange = {
			from: 0,
			to: 0,
			valid: false,
		};

		const rangeHeader = req.headers['range'];
		const flavor = 'bytes=';

		if (rangeHeader) {
			if (rangeHeader.startsWith(flavor) && !rangeHeader.includes(',')) {
				/* Parse */
				const splitRangeHeader = rangeHeader.substr(flavor.length).split('-');
				byteRange.from = parseInt(splitRangeHeader[0]);
				byteRange.to = parseInt(splitRangeHeader[1]);

				/* Replace empty fields of differential requests by absolute values */
				if (isNaN(byteRange.from) && !isNaN(byteRange.to)) {
					byteRange.from = stat.size - byteRange.to;
					byteRange.to = stat.size ? stat.size - 1 : 0;
				} else if (!isNaN(byteRange.from) && isNaN(byteRange.to)) {
					byteRange.to = stat.size ? stat.size - 1 : 0;
				}

				/* General byte range validation */
				if (!isNaN(byteRange.from) && !isNaN(byteRange.to) && 0 <= byteRange.from && byteRange.from <= byteRange.to) {
					byteRange.valid = true;
				} else {
					if (DEBUG) console.warn('Request contains invalid range header: ', splitRangeHeader);
				}
			} else {
				if (DEBUG) console.warn('Request contains unsupported range header: ', rangeHeader);
			}
		}
		return byteRange;
	}

	async respondNoGzip(
		status: number, contentType: string, _headers: Headers, file: string, stat: fs.Stats,
		req: http.IncomingMessage, res: http.ServerResponse
	): Promise<Result> {
		const mtime = Date.parse(stat.mtime as any);
		const headers: Headers = {};
		const clientETag = req.headers['if-none-match'];
		const clientMTime = Date.parse(req.headers['if-modified-since']!);
		const byteRange = this.parseByteRange(req, stat);
		let startByte = 0;
		let length = stat.size;

		/* Handle byte ranges */
		if (byteRange.valid) {
			if (byteRange.to < length) {
				// Note: HTTP Range param is inclusive
				startByte = byteRange.from;
				length = byteRange.to - byteRange.from + 1;
				status = 206;

				// Set Content-Range response header (we advertise initial resource size on server here (stat.size))
				headers['Content-Range'] = `bytes ${byteRange.from}-${byteRange.to}/${stat.size}`;
			} else {
				byteRange.valid = false;
				if (DEBUG) {
					console.warn('Range request exceeds file boundaries, goes until byte no', byteRange.to, 'against file size of', length, 'bytes');
				}
			}
		}

		/* In any case, check for unhandled byte range headers */
		if (!byteRange.valid && req.headers['range']) {
			if (DEBUG) console.error(new Error('Range request present but invalid, might serve whole file instead'));
		}

		// Copy default headers
		for (const k in this.defaultHeaders) headers[k] = this.defaultHeaders[k];

		headers['Etag'] = JSON.stringify([stat.ino, stat.size, mtime].join('-'));
		headers['Date'] = new Date().toUTCString();
		headers['Last-Modified'] = new Date(stat.mtime).toUTCString();
		headers['Content-Type'] = contentType;
		headers['Content-Length'] = length as any;

		// Copy custom headers
		for (const k in _headers) { headers[k] = _headers[k]; }

		// Conditional GET
		// If the "If-Modified-Since" or "If-None-Match" headers
		// match the conditions, send a 304 Not Modified.
		if ((clientMTime || clientETag) &&
			(!clientETag || clientETag === headers['Etag']) &&
			(!clientMTime || clientMTime >= mtime)) {
			// 304 response should not contain entity headers
			for (const entityHeader of [
				'Content-Encoding', 'Content-Language', 'Content-Length', 'Content-Location', 'Content-MD5', 'Content-Range', 'Content-Type', 'Expires', 'Last-Modified',
			]) {
				delete headers[entityHeader];
			}
			return this.getResult(304, headers);
		} else if (req.method === 'HEAD') {
			return this.getResult(status, headers);
		} else {
			res.writeHead(status, headers);

			try {
				await this.stream(file, length, startByte, res);
				return this.getResult(status, headers, true);
			} catch {
				// too late to actually send the 500 header
				return this.getResult(500, {}, true);
			}
		}
	}

	respond(
		status: number, _headers: Headers, file: string, stat: fs.Stats,
		req: http.IncomingMessage, res: http.ServerResponse
	): Promise<Result> {
		const contentType = _headers['Content-Type'] ||
			mimeTypes[path.extname(file)] ||
			'application/octet-stream';
		_headers = this.setCacheHeaders(_headers);

		if (this.options.gzip) {
			return this.respondGzip(status, contentType, _headers, file, stat, req, res);
		} else {
			return this.respondNoGzip(status, contentType, _headers, file, stat, req, res);
		}
	}

	stream(file: string, length: number, startByte: number, res: http.ServerResponse): Promise<number> {
		return new Promise<number>((resolve, reject) => {
			let offset = 0;

			// Stream the file to the client
			fs.createReadStream(file, {
				flags: 'r',
				mode: 0o666,
				start: startByte,
				end: startByte + (length ? length - 1 : 0),
			}).on('data', chunk => {
				// Bounds check the incoming chunk and offset, as copying
				// a buffer from an invalid offset will throw an error and crash
				if (chunk.length && offset < length && offset >= 0) {
					offset += chunk.length;
				}
			}).on('close', () => {
				res.end();
				resolve(offset);
			}).on('error', err => {
				reject(err);
				console.error(err);
			}).pipe(res, { end: false });
		});
	}

	setCacheHeaders(_headers: Headers): Headers {
		if (typeof this.cacheTime === 'number') {
			_headers['cache-control'] = `max-age=${this.cacheTime}`;
		}
		return _headers;
	}
}
