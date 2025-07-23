import * as fs from 'fs';
import * as path from 'path';
import type * as http from 'http';
import * as url from 'url';

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

function isPathSafe(requestedPath: string, baseDir: string): boolean {
	const resolvedPath = path.resolve(baseDir, requestedPath);
	const resolvedBase = path.resolve(baseDir);
	return resolvedPath.startsWith(resolvedBase + path.sep) || resolvedPath === resolvedBase;
}

function serveFile(
	res: http.ServerResponse,
	filePath: string,
	statusCode = 200,
	isHeadRequest = false
): void {
	fs.stat(filePath, (err, stats) => {
		if (err || !stats.isFile()) {
			const notFoundPath = path.resolve(__dirname, '../static/404.html');
			fs.stat(notFoundPath, (notFoundErr, notFoundStats) => {
				if (notFoundErr || !notFoundStats.isFile()) {
					res.writeHead(404, { 'Content-Type': 'text/html' });
					if (!isHeadRequest) {
						res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>Not Found</h1></body></html>');
					} else {
						res.end();
					}
					return;
				}

				const notFoundExt = path.extname(notFoundPath);
				const notFoundMimeType = mimeTypes[notFoundExt] || 'text/html';
				res.writeHead(404, {
					'Content-Type': notFoundMimeType,
					'Content-Length': notFoundStats.size,
				});

				if (!isHeadRequest) {
					fs.createReadStream(notFoundPath).pipe(res);
				} else {
					res.end();
				}
			});
			return;
		}

		const ext = path.extname(filePath);
		const mimeType = mimeTypes[ext] || 'application/octet-stream';

		res.writeHead(statusCode, {
			'Content-Type': mimeType,
			'Content-Length': stats.size,
		});

		if (!isHeadRequest) {
			fs.createReadStream(filePath).pipe(res);
		} else {
			res.end();
		}
	});
}

export function handleStaticRequest(
	req: http.IncomingMessage,
	res: http.ServerResponse,
): void {
	if (!req.url) {
		res.writeHead(400, { 'Content-Type': 'text/plain' });
		res.end('Bad Request');
		return;
	}

	const parsedUrl = url.parse(req.url);
	const pathname = parsedUrl.pathname || '/';
	const isHeadRequest = req.method === 'HEAD';

	const roomidRegex = /^\/(?:[A-Za-z0-9][A-Za-z0-9-]*)\/?$/;

	if (pathname === '/custom.css') {
		const cssPath = path.resolve(__dirname, '../../config/custom.css');
		const configDir = path.resolve(__dirname, '../../config');
		if (isPathSafe('custom.css', configDir)) {
			serveFile(res, cssPath, 200, isHeadRequest);
		} else {
			res.writeHead(403, { 'Content-Type': 'text/plain' });
			res.end('Forbidden');
		}
	} else if (pathname.startsWith('/avatars/')) {
		const avatarPath = pathname.substr(8);
		const avatarsDir = path.resolve(__dirname, '../../config/avatars');
		if (isPathSafe(avatarPath, avatarsDir)) {
			const fullAvatarPath = path.resolve(avatarsDir, avatarPath);
			serveFile(res, fullAvatarPath, 200, isHeadRequest);
		} else {
			res.writeHead(403, { 'Content-Type': 'text/plain' });
			res.end('Forbidden');
		}
	} else if (roomidRegex.test(pathname)) {
		const indexPath = path.resolve(__dirname, '../static/index.html');
		serveFile(res, indexPath, 200, isHeadRequest);
	} else {
		let staticPath = pathname.slice(1);
		const staticDir = path.resolve(__dirname, '../static');

		if (staticPath === '') {
			staticPath = 'index.html';
		}

		if (isPathSafe(staticPath, staticDir)) {
			const fullStaticPath = path.resolve(staticDir, staticPath);
			serveFile(res, fullStaticPath, 200, isHeadRequest);
		} else {
			res.writeHead(403, { 'Content-Type': 'text/plain' });
			res.end('Forbidden');
		}
	}
}
