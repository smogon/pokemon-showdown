// Vendored and TypeScripted from
// https://github.com/cloudhead/node-static/blob/e49fbd728e93294c225f52103962e56aab86cb1a/lib/node-static.js

import fs from 'node:fs';
import events from 'node:events';
import http from 'node:http';
import path from 'node:path';

type Headers = Record<string, string>;
type Options = Record<string, any>;
type FinishCallback = (status: number, headers: Headers) => void;
type Result = {
	status: number,
	headers: Record<string, string>,
	message: string | undefined,
};
type Stats = {
	size: number,
	mtime: Date,
	ino: number,
};

const mimeTypes: { [key: string]: string } = {
	'.html': 'text/html',
	'.htm': 'text/html',
	'.css': 'text/css',
	'.js': 'application/javascript',
	'.json': 'application/json',
	'.xml': 'application/xml',
	'.txt': 'text/plain',
	'.md': 'text/plain',

	'.png': 'image/png',
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.gif': 'image/gif',
	'.svg': 'image/svg+xml',
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

function mstat (dir: string, files: string[], callback: (err: Error | null, stats?: Stats) => void) {
	(function mstat(files: string[], stats: Stats[]) {
		const file = files.shift();

		if (file) {
			try {
				fs.stat(path.join(dir, file), function (e, stat) {
					if (e) {
						callback(e);
					} else {
						mstat(files, stats.concat([stat]));
					}
				});
			} catch (e) {
				callback(e as Error);
			}
		} else {
			callback(null, {
				size: stats.reduce((total, stat) => total + stat.size, 0),
				mtime: stats.reduce((latest, stat) => latest > stat.mtime ? latest : stat.mtime, new Date(0)),
				ino: stats.reduce((total, stat) => total + stat.ino, 0),
			});
		}
	})(files.slice(0), []);
}

const SERVER_INFO = 'node-static-vendored/1.0';

function tryStat(p: string, callback: (err: Error | null, stats?: fs.Stats) => void) {
	try {
		fs.stat(p, callback);
	} catch (e) {
		callback(e as Error);
	}
}

class StaticServer {
	root: string;
	options: Options;
	cacheTime = 3600;
	defaultHeaders: Headers;
	defaultExtension: string | null;
	constructor(root: string, options?: Options);
	constructor(options?: Options);
	constructor (root?: Options | string | null, options?: Options) {
		if (root && typeof root === 'object') {
			options = root;
			root = null;
		}

		// resolve() doesn't normalize (to lowercase) drive letters on Windows
		this.root = path.normalize(path.resolve(root || '.'));
		this.options = options || {};

		this.defaultHeaders  = {};
		this.options.headers = this.options.headers || {};

		this.options.indexFile = this.options.indexFile || 'index.html';

		if ('cacheTime' in this.options) {
			this.cacheTime = this.options.cacheTime;
		}

		if ('defaultExtension' in this.options) {
			this.defaultExtension =  '.' + this.options.defaultExtension;
		} else {
			this.defaultExtension = null;
		}

		if (this.options.serverInfo !== null) {
			this.defaultHeaders['server'] = SERVER_INFO;
		}

		for (const k in this.defaultHeaders) {
			this.options.headers[k] ||= this.defaultHeaders[k];
		}
	}

	serveDir (pathname: string, req: http.IncomingMessage, res: http.ServerResponse, finish: FinishCallback) {
		const htmlIndex = path.join(pathname, this.options.indexFile);

		const streamFiles = (files: string[]) => {
			mstat(pathname, files, (e, stat) => {
				if (e) { return finish(404, {}) }
				this.respond(pathname, 200, {}, files, stat!, req, res, finish);
			});
		};

		tryStat(htmlIndex, (e, stat) => {
			if (!e) {
				const status = 200;
				const headers = {};
				const originalPathname = decodeURIComponent(new URL(req.url!, 'http://localhost').pathname);
				if (originalPathname.length && originalPathname.charAt(originalPathname.length - 1) !== '/') {
					return finish(301, { 'Location': originalPathname + '/' });
				} else {
					this.respond(null, status, headers, [htmlIndex], stat!, req, res, finish);
				}
			} else {
				// Stream a directory of files as a single file.
				fs.readFile(path.join(pathname, 'index.json'), (e, contents) => {
					if (e) { return finish(404, {}) }
					const index = JSON.parse(`${contents}`);
					streamFiles(index.files);
				});
			}
		});
	}

	serveFile (pathname: string, status: number, headers: Headers, req: http.IncomingMessage, res: http.ServerResponse) {
		const promise = new events.EventEmitter();

		pathname = this.resolve(pathname);

		tryStat(pathname, (e, stat) => {
			if (e) {
				return promise.emit('error', e);
			}
			this.respond(null, status, headers, [pathname], stat!, req, res, (status, headers) => {
				this.finish(status, headers, req, res, promise);
			});
		});
		return promise;
	}

	finish (status: number, headers: Record<string, string>, req: http.IncomingMessage, res: http.ServerResponse, promise: events.EventEmitter, callback?: (err: Result | null, result?: Result) => void) {
		const result: Result = {
			status,
			headers,
			message: http.STATUS_CODES[status]
		};

		if (this.options.serverInfo !== null) {
			headers['server'] ||= SERVER_INFO;
		}

		if (!status || status >= 400) {
			if (callback) {
				callback(result);
			} else {
				if (promise.listeners('error').length > 0) {
					promise.emit('error', result);
				}
				else {
					res.writeHead(status, headers);
					res.end();
				}
			}
		} else {
			// Don't end the request here, if we're streaming;
			// it's taken care of in `prototype.stream`.
			if (status !== 200 || req.method !== 'GET') {
				res.writeHead(status, headers);
				res.end();
			}
			callback && callback(null, result);
			promise.emit('success', result);
		}
	}

	servePath (pathname: string, status: number, headers: Headers, req: http.IncomingMessage, res: http.ServerResponse, finish: FinishCallback) {
		const that = this,
			promise = new(events.EventEmitter);

		pathname = this.resolve(pathname);

		// Make sure we're not trying to access a
		// file outside of the root.
		if (pathname.startsWith(that.root)) {
			tryStat(pathname, function (e, stat) {
				if (e) {
					// possibly not found, check default extension
					if (that.defaultExtension) {
						tryStat(pathname + that.defaultExtension, function(e2, stat2) {
							if (e2) {
								// really not found
								finish(404, {});
							} else if (stat2!.isFile()) {
								that.respond(null, status, headers, [pathname+that.defaultExtension], stat2!, req, res, finish);
							} else {
								finish(400, {});
							}
						});
					} else {
						finish(404, {});
					}
				} else if (stat!.isFile()) {      // Stream a single file.
					that.respond(null, status, headers, [pathname], stat!, req, res, finish);
				} else if (stat!.isDirectory()) { // Stream a directory of files.
					that.serveDir(pathname, req, res, finish);
				} else {
					finish(400, {});
				}
			});
		} else {
			// Forbidden
			finish(403, {});
		}
		return promise;
	}

	resolve (pathname: string) {
		return path.resolve(path.join(this.root, pathname));
	}

	serve (req: http.IncomingMessage, res: http.ServerResponse, callback?: (err: Result | null, result?: Result) => void) {
		const promise = new(events.EventEmitter);
		let pathname;

		const finish = (status: number, headers: Headers) => {
			this.finish(status, headers, req, res, promise, callback);
		};

		try {
			pathname = decodeURIComponent(new URL(req.url!, 'http://localhost').pathname);
		}
		catch {
			return process.nextTick(() => {
				finish(400, {});
			});
		}

		process.nextTick(() => {
			this.servePath(pathname, 200, {}, req, res, finish).on('success', (result) => {
				promise.emit('success', result);
			}).on('error', (err) => {
				promise.emit('error');
			});
		});
		if (!callback) {
			return promise;
		}
	}

	/* Check if we should consider sending a gzip version of the file based on the
	 * file content type and client's Accept-Encoding header value.
	 */
	gzipOk(req: http.IncomingMessage, contentType: string) {
		const enable = this.options.gzip;
		if (
			enable &&
			(typeof enable === 'boolean' ||
				(contentType && (enable instanceof RegExp) && enable.test(contentType)))
		) {
			const acceptEncoding = req.headers['accept-encoding'];
			return acceptEncoding && acceptEncoding.includes('gzip');
		}
		return false;
	}

	/* Send a gzipped version of the file if the options and the client indicate gzip is enabled and
	 * we find a .gz file matching the static resource requested.
	 */
	respondGzip(pathname: string | null, status: number, contentType: string, _headers: Headers, files: string[], stat: Stats, req: http.IncomingMessage, res: http.ServerResponse, finish: FinishCallback) {
		if (files.length == 1 && this.gzipOk(req, contentType)) {
			const gzFile = files[0] + '.gz';
			tryStat(gzFile, (e, gzStat) => {
				if (!e && gzStat!.isFile()) {
					const vary = _headers['Vary'];
					_headers['Vary'] = (vary && vary != 'Accept-Encoding' ? vary + ', ' : '') + 'Accept-Encoding';
					_headers['Content-Encoding'] = 'gzip';
					stat.size = gzStat!.size;
					files = [gzFile];
				}
				this.respondNoGzip(pathname, status, contentType, _headers, files, stat, req, res, finish);
			});
		} else {
			// Client doesn't want gzip or we're sending multiple files
			this.respondNoGzip(pathname, status, contentType, _headers, files, stat, req, res, finish);
		}
	}

	parseByteRange (req: http.IncomingMessage, stat: Stats) {
		const byteRange = {
			from: 0,
			to: 0,
			valid: false
		};

		let rangeHeader = req.headers['range'];
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
					console.warn('Request contains invalid range header: ', splitRangeHeader);
				}
			} else {
				console.warn('Request contains unsupported range header: ', rangeHeader);
			}
		}
		return byteRange;
	}

	respondNoGzip (pathname: string | null, status: number, contentType: string, _headers: Headers, files: string[], stat: Stats, req: http.IncomingMessage, res: http.ServerResponse, finish: FinishCallback) {
		const mtime           = Date.parse(stat.mtime as any);
		const key             = pathname || files[0];
		const headers: Headers = {};
		const clientETag      = req.headers['if-none-match'];
		const clientMTime     = Date.parse(req.headers['if-modified-since']!);
		const byteRange       = this.parseByteRange(req, stat);
		let startByte       = 0,
			length          = stat.size;

		/* Handle byte ranges */
		if (files.length == 1 && byteRange.valid) {
			if (byteRange.to < length) {

				// Note: HTTP Range param is inclusive
				startByte = byteRange.from;
				length = byteRange.to - byteRange.from + 1;
				status = 206;

				// Set Content-Range response header (we advertise initial resource size on server here (stat.size))
				headers['Content-Range'] = 'bytes ' + byteRange.from + '-' + byteRange.to + '/' + stat.size;

			} else {
				byteRange.valid = false;
				console.warn('Range request exceeds file boundaries, goes until byte no', byteRange.to, 'against file size of', length, 'bytes');
			}
		}

		/* In any case, check for unhandled byte range headers */
		if (!byteRange.valid && req.headers['range']) {
			console.error(new Error('Range request present but invalid, might serve whole file instead'));
		}

		// Copy default headers
		for (const k in this.options.headers) {  headers[k] = this.options.headers[k]; }

		headers['Etag']          = JSON.stringify([stat.ino, stat.size, mtime].join('-'));
		headers['Date']          = new Date().toUTCString();
		headers['Last-Modified'] = new Date(stat.mtime).toUTCString();
		headers['Content-Type']   = contentType;
		headers['Content-Length'] = length as any;

		// Copy custom headers
		for (const k in _headers) { headers[k] = _headers[k]; }

		// Conditional GET
		// If the "If-Modified-Since" or "If-None-Match" headers
		// match the conditions, send a 304 Not Modified.
		if ((clientMTime  || clientETag) &&
			(!clientETag  || clientETag === headers['Etag']) &&
			(!clientMTime || clientMTime >= mtime)) {
			// 304 response should not contain entity headers
			['Content-Encoding',
				'Content-Language',
				'Content-Length',
				'Content-Location',
				'Content-MD5',
				'Content-Range',
				'Content-Type',
				'Expires',
				'Last-Modified'].forEach(function (entityHeader) {
				delete headers[entityHeader];
			});
			finish(304, headers);
		} else {
			res.writeHead(status, headers);

			this.stream(key, files, length, startByte, res, function (e) {
				if (e) { return finish(500, {}) }
				finish(status, headers);
			});
		}
	}

	respond (pathname: string | null, status: number, _headers: Headers, files: string[], stat: Stats, req: http.IncomingMessage, res: http.ServerResponse, finish: FinishCallback) {
		const contentType = _headers['Content-Type'] ||
			mimeTypes[path.extname(files[0])] ||
			'application/octet-stream';
		_headers = this.setCacheHeaders(_headers, req);

		if(this.options.gzip) {
			this.respondGzip(pathname, status, contentType, _headers, files, stat, req, res, finish);
		} else {
			this.respondNoGzip(pathname, status, contentType, _headers, files, stat, req, res, finish);
		}
	}

	stream (pathname: string, files: string[], length: number, startByte: number, res: http.ServerResponse, callback: (err: Error | null, offset?: number) => void) {

		(function streamFile(files, offset) {
			let file = files.shift();

			if (file) {
				file = path.resolve(file) === path.normalize(file)  ? file : path.join(pathname || '.', file);

				// Stream the file to the client
				fs.createReadStream(file, {
					flags: 'r',
					mode: 0o666,
					start: startByte,
					end: startByte + (length ? length - 1 : 0)
				}).on('data', (chunk) => {
					// Bounds check the incoming chunk and offset, as copying
					// a buffer from an invalid offset will throw an error and crash
					if (chunk.length && offset < length && offset >= 0) {
						offset += chunk.length;
					}
				}).on('close', () => {
					streamFile(files, offset);
				}).on('error', (err) => {
					callback(err);
					console.error(err);
				}).pipe(res, { end: false });
			} else {
				res.end();
				callback(null, offset);
			}
		})(files.slice(0), 0);
	}

	setCacheHeaders (_headers: Headers, req: http.IncomingMessage): Headers {
		if (typeof this.cacheTime === 'number') {
			_headers['cache-control'] = `max-age=${this.cacheTime}`;
		}
		return _headers;
	}
}

export { StaticServer };
