/**
 * REPL
 *
 * Documented in logs/repl/README.md
 * https://github.com/smogon/pokemon-showdown/blob/master/logs/repl/README.md
 *
 * @author kota
 * @license MIT
 */

import * as fs from 'fs';
import * as net from 'net';
import * as path from 'path';
import * as repl from 'repl';
import { crashlogger } from './crashlogger';
import { FS } from './fs';
declare const Config: any;

const MAX_CONCURRENT_CLEANUP_SOCKETS = 8;

async function isSocket(pathname: string) {
	try {
		const stat = await fs.promises.stat(pathname);
		return stat.isSocket();
	} catch {
		return false;
	}
}

async function runParallelWithLimit(items: string[], max: number, fn: (item: string) => Promise<void>) {
	const results: Promise<void>[] = [];
	const runningPromises = new Map<Promise<void>, Promise<boolean>>();

	for (const item of items) {
		const p = fn(item);
		results.push(p);
		runningPromises.set(p, p.then(
			() => runningPromises.delete(p),
			() => runningPromises.delete(p)
		));

		if (max <= runningPromises.size) {
			await Promise.race(runningPromises.values());
		}
	}

	return Promise.all(results);
}

export type EvalType = (script: string) => unknown;

export const Repl = new class {
	/**
	 * Contains the pathnames of all active REPL sockets.
	 */
	socketPathnames = new Set<string>();

	listenersSetup = false;

	setupListeners(filename: string) {
		if (Repl.listenersSetup) return;
		Repl.listenersSetup = true;
		// Clean up REPL sockets and child processes on forced exit.
		process.once('exit', code => {
			for (const s of Repl.socketPathnames) {
				try {
					fs.unlinkSync(s);
				} catch {}
			}
			if (code === 129 || code === 130) {
				process.exitCode = 0;
			}
		});
		if (!process.listeners('SIGHUP').length) {
			process.once('SIGHUP', () => process.exit(128 + 1));
		}
		if (!process.listeners('SIGINT').length) {
			process.once('SIGINT', () => process.exit(128 + 2));
		}
		(global as any).heapdump = (targetPath?: string) => {
			if (!targetPath) targetPath = `${filename}-${new Date().toISOString()}`;
			let handler;
			try {
				handler = require('node-oom-heapdump')();
			} catch (e: any) {
				if (e.code !== 'MODULE_NOT_FOUND') throw e;
				throw new Error(`node-oom-heapdump is not installed. Run \`npm install --no-save node-oom-heapdump\` and try again.`);
			}
			return handler.createHeapSnapshot(targetPath);
		};
	}

	/**
	 * Delete old sockets in the REPL directory (presumably from a crashed
	 * previous launch of PS).
	 */
	async cleanup() {
		const config = typeof Config !== 'undefined' ? Config : {};
		if (!config.repl) return;

		// Clean up old REPL sockets.
		const directory = path.dirname(
			path.resolve(FS.ROOT_PATH, config.replsocketprefix || 'logs/repl', 'app')
		);
		const files = await fs.promises.readdir(directory);
		await runParallelWithLimit(files, MAX_CONCURRENT_CLEANUP_SOCKETS, async (file: string) => {
			const pathname = path.resolve(directory, file);
			if (!(await isSocket(pathname))) return;
			await new Promise((resolve, reject) => {
				const socket = net.connect(pathname, () => {
					socket.end();
					socket.destroy();
					resolve(null);
				}).on('error', () => {
					resolve(fs.promises.unlink(pathname).catch(err => null));
				});
			});
		});
	}

	/**
	 * Starts a REPL server, using a UNIX socket for IPC. The eval function
	 * parameter is passed in because there is no other way to access a file's
	 * non-global context.
	 */
	start(filename: string, evalFunction: EvalType) {
		const config = typeof Config !== 'undefined' ? Config : {};
		if (!config.repl) return;
		// eslint-disable-next-line no-eval
		if (evalFunction === eval) {
			// Direct eval is most useful for debugging, but
			// nothing prevents consumers from wrapping indirect eval if required (see startGlobal).
			throw new TypeError(`Expected 'evalFunction' to be a wrapper around direct eval.`);
		}

		// TODO: Windows does support the REPL when using named pipes. For now,
		// this only supports UNIX sockets.

		Repl.setupListeners(filename);

		const server = net.createServer(socket => {
			repl.start({
				input: socket,
				output: socket,
				eval(cmd, context, unusedFilename, callback) {
					try {
						return callback(null, evalFunction(cmd));
					} catch (e: any) {
						return callback(e, undefined);
					}
				},
			}).on('exit', () => socket.end());
			socket.on('error', () => socket.destroy());
		});

		const pathname = path.resolve(FS.ROOT_PATH, Config.replsocketprefix || 'logs/repl', filename);
		try {
			server.listen(pathname, () => {
				fs.chmodSync(pathname, Config.replsocketmode || 0o600);
				Repl.socketPathnames.add(pathname);
			});

			server.once('error', (err: NodeJS.ErrnoException) => {
				server.close();
				if (err.code === "EADDRINUSE") {
					fs.unlink(pathname, _err => {
						if (_err && _err.code !== "ENOENT") {
							crashlogger(_err, `REPL: ${filename}`);
						}
					});
				} else if (err.code === "EACCES") {
					if (process.platform !== 'win32') {
						console.error(`Could not start REPL server "${filename}": Your filesystem doesn't support Unix sockets (everything else will still work)`);
					}
				} else {
					crashlogger(err, `REPL: ${filename}`);
				}
			});

			server.once('close', () => {
				Repl.socketPathnames.delete(pathname);
			});
		} catch (err) {
			console.error(`Could not start REPL server "${filename}": ${err}`);
		}
	}

	startGlobal(filename: string) {
		/* eslint-disable @typescript-eslint/no-implied-eval */
		return this.start(filename, new Function(`script`, `return eval(script);`) as EvalType);
		/* eslint-enable @typescript-eslint/no-implied-eval */
	}
};
