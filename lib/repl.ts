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
import {crashlogger} from './crashlogger';

export const Repl = new class {
	/**
	 * Contains the pathnames of all active REPL sockets.
	 */
	socketPathnames: Set<string> = new Set();

	listenersSetup = false;

	setupListeners() {
		if (Repl.listenersSetup) return;
		Repl.listenersSetup = true;
		// Clean up REPL sockets and child processes on forced exit.
		process.once('exit', code => {
			for (const s of Repl.socketPathnames) {
				try {
					fs.unlinkSync(s);
				} catch (e) {}
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
	}

	/**
	 * Starts a REPL server, using a UNIX socket for IPC. The eval function
	 * parametre is passed in because there is no other way to access a file's
	 * non-global context.
	 */
	start(filename: string, evalFunction: (input: string) => any) {
		if ('repl' in Config && !Config.repl) return;

		// TODO: Windows does support the REPL when using named pipes. For now,
		// this only supports UNIX sockets.

		Repl.setupListeners();

		if (filename === 'app') {
			// Clean up old REPL sockets.
			const directory = path.dirname(path.resolve(__dirname, '..', Config.replsocketprefix || 'logs/repl', 'app'));
			for (const file of fs.readdirSync(directory)) {
				const pathname = path.resolve(directory, file);
				const stat = fs.statSync(pathname);
				if (!stat.isSocket()) continue;

				const socket = net.connect(pathname, () => {
					socket.end();
					socket.destroy();
				}).on('error', () => {
					fs.unlink(pathname, () => {});
				});
			}
		}

		const server = net.createServer(socket => {
			repl.start({
				input: socket,
				output: socket,
				eval(cmd, context, unusedFilename, callback) {
					try {
						return callback(null, evalFunction(cmd));
					} catch (e) {
						return callback(e, undefined);
					}
				},
			}).on('exit', () => socket.end());
			socket.on('error', () => socket.destroy());
		});

		const pathname = path.resolve(__dirname, '..', Config.replsocketprefix || 'logs/repl', filename);
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
};
