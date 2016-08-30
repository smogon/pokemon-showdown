'use strict';

const REPL_ENABLED = true;

const fs = require('fs');
const path = require('path');
const net = require('net');

let sockets = [];

function cleanup() {
	for (let s = 0; s < sockets.length; ++s) {
		try {
			fs.unlinkSync(sockets[s]);
		} catch (e) {}
	}
}
process.on("exit", cleanup);

// exit handlers aren't called by the default handler
if (process.listeners('SIGHUP').length === 0) {
	process.on('SIGHUP', () => process.exit(128 + 1));
}
if (process.listeners('SIGINT').length === 0) {
	process.on('SIGINT', () => process.exit(128 + 2));
}

// The eval function is passed in because there is no other way to access a file's non-global context
exports.start = function (prefix, suffix, evalFunction) {
	if (!REPL_ENABLED) return;
	if (process.platform === 'win32') return; // Windows doesn't support sockets mounted in the filesystem

	let resolvedPrefix = path.resolve(__dirname, Config.replsocketprefix || 'logs/repl', prefix);
	if (!evalFunction) {
		evalFunction = suffix;
		suffix = "";
	}
	let name = resolvedPrefix + suffix;

	if (prefix === 'app') {
		// Clear out any old sockets
		let directory = path.dirname(resolvedPrefix);
		for (let file of fs.readdirSync(directory)) {
			let stat = fs.statSync(directory + '/' + file);
			if (!stat.isSocket()) {
				continue;
			}

			let socket = net.connect(directory + '/' + file, () => {
				socket.end();
				socket.destroy();
			}).on('error', () => {
				fs.unlink(directory + '/' + file, () => {});
			});
		}
	}

	net.createServer(socket => {
		require('repl').start({
			input: socket,
			output: socket,
			eval: (cmd, context, filename, callback) => {
				try {
					return callback(null, evalFunction(cmd));
				} catch (e) {
					return callback(e);
				}
			},
		}).on('exit', () => socket.end());
		socket.on('error', () => socket.destroy());
	}).listen(name, () => {
		fs.chmodSync(name, Config.replsocketmode || 0o600);
		sockets.push(name);
	}).on('error', e => {
		if (e.code === "EADDRINUSE") {
			fs.unlink(name, e => {
				if (e && e.code !== "ENOENT") {
					require('./crashlogger')(e, 'REPL: ' + name);
					return;
				}

				exports.start(prefix, suffix, evalFunction);
			});
			return;
		}

		require('./crashlogger')(e, 'REPL: ' + name);
	});
};
