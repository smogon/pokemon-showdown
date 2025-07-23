import * as fs from 'fs';
import * as path from 'path';
import type * as http from 'http';
import * as url from 'url';
import { pipeline } from 'stream';

const mimeTypes: { [key: string]: string } = {
	'.html': 'text/html;charset=utf-8',
	'.htm': 'text/html;charset=utf-8',
	'.css': 'text/css;charset=utf-8',
	'.js': 'application/javascript;charset=utf-8',
	'.json': 'application/json;charset=utf-8',
	'.xml': 'application/xml;charset=utf-8',
	'.txt': 'text/plain;charset=utf-8',
	'.md': 'text/plain;charset=utf-8',
	'.ts': 'text/typescript;charset=utf-8',
	'.jsx': 'text/jsx;charset=utf-8',
	'.tsx': 'text/tsx;charset=utf-8',

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

export const additionalStaticFolders = new Map<string, string>();
export const allowSymlinks = false;

function isPathSafe(requestedPath: string, baseDir: string): boolean {
	const resolvedPath = path.resolve(baseDir, requestedPath);
	const resolvedBase = path.resolve(baseDir);
	return resolvedPath.startsWith(resolvedBase + path.sep) || resolvedPath === resolvedBase;
}

function sendError(res: http.ServerResponse, code: number): void {
	res.writeHead(code, { 'Content-Type': 'text/plain' });
	res.end(require('http').STATUS_CODES[code]);
}

function serveFile(
	res: http.ServerResponse,
	filePath: string,
	statusCode = 200,
	isHeadRequest = false
): void {
	fs.lstat(filePath, (err, stats) => {
		if (err || !stats.isFile() || (!allowSymlinks && stats.isSymbolicLink())) {
			const notFoundPath = path.resolve(__dirname, '../static/404.html');
			fs.lstat(notFoundPath, (notFoundErr, notFoundStats) => {
				if (notFoundErr || !notFoundStats.isFile() || (!allowSymlinks && notFoundStats.isSymbolicLink())) {
					res.writeHead(404, { 'Content-Type': 'text/html' });
					if (!isHeadRequest) {
						res.end('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>Not Found</h1></body></html>');
					} else {
						res.end();
					}
					return;
				}

				const notFoundExt = path.extname(notFoundPath);
				const notFoundMimeType = mimeTypes[notFoundExt] || 'text/html;charset=utf-8';
				res.writeHead(404, {
					'Content-Type': notFoundMimeType,
					'Content-Length': notFoundStats.size,
				});

				if (!isHeadRequest) {
					const readStream = fs.createReadStream(notFoundPath);
					readStream.on('error', readErr => {
						console.error('ReadStream error:', readErr);
						sendError(res, 500);
					});
					pipeline(readStream, res, pipeErr => {
						if (pipeErr) console.error('Pipeline error:', pipeErr);
					});
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
			const readStream = fs.createReadStream(filePath);
			readStream.on('error', readErr => {
				console.error('ReadStream error:', readErr);
				sendError(res, 500);
			});
			pipeline(readStream, res, pipeErr => {
				if (pipeErr) console.error('Pipeline error:', pipeErr);
			});
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
		sendError(res, 400);
		return;
	}

	if (req.url.includes('\0')) {
		sendError(res, 400);
		return;
	}

	const allowedMethods = ['GET', 'HEAD', 'OPTIONS'];
	if (!allowedMethods.includes(req.method || '')) {
		res.writeHead(405, { 'Allow': allowedMethods.join(', ') });
		res.end('Method Not Allowed');
		return;
	}

	if (req.method === 'OPTIONS') {
		res.writeHead(204, { 'Allow': allowedMethods.join(', ') });
		res.end();
		return;
	}

	const parsedUrl = url.parse(req.url);
	const pathname = parsedUrl.pathname || '/';
	const isHeadRequest = req.method === 'HEAD';

	if (process.platform === 'win32') {
		const pathParts = pathname.split('/');
		for (const part of pathParts) {
			const baseName = part.split('.')[0];
			if (/^(con|prn|aux|nul|com[0-9]|lpt[0-9])$/i.test(baseName)) {
				sendError(res, 403);
				return;
			}
		}
	}

	const roomidRegex = /^\/(?:[A-Za-z0-9][A-Za-z0-9-]*)\/?$/;

	if (pathname === '/custom.css') {
		const cssPath = path.resolve(__dirname, '../../config/custom.css');
		const configDir = path.resolve(__dirname, '../../config');
		if (isPathSafe('custom.css', configDir)) {
			serveFile(res, cssPath, 200, isHeadRequest);
		} else {
			sendError(res, 403);
		}
	} else if (pathname.startsWith('/avatars/')) {
		const avatarPath = pathname.substr(8);
		const avatarsDir = path.resolve(__dirname, '../../config/avatars');
		if (isPathSafe(avatarPath, avatarsDir)) {
			const fullAvatarPath = path.resolve(avatarsDir, avatarPath);
			res.setHeader('Cache-Control', 'public, no-transform, stale-if-error, max-age=7776000');
			serveFile(res, fullAvatarPath, 200, isHeadRequest);
		} else {
			sendError(res, 403);
		}
	} else {
		const staticFolderKeys = Array.from(additionalStaticFolders.keys());
		for (const prefix of staticFolderKeys) {
			if (pathname.startsWith(prefix)) {
				const dir = additionalStaticFolders.get(prefix)!;
				let staticPath = pathname.slice(prefix.length);
				if (!prefix.endsWith('/') && staticPath.startsWith('/')) staticPath = staticPath.slice(1);
				const staticDir = path.resolve(__dirname, dir);

				if (staticPath === '') {
					staticPath = 'index.html';
				}

				if (isPathSafe(staticPath, staticDir)) {
					const fullStaticPath = path.resolve(staticDir, staticPath);
					serveFile(res, fullStaticPath, 200, isHeadRequest);
					return;
				} else {
					sendError(res, 403);
					return;
				}
			}
		}

		if (roomidRegex.test(pathname)) {
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
				sendError(res, 403);
			}
		}
	}
}
