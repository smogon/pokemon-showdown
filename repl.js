const REPL_ENABLED = false;

var fs = require('fs');
var path = require('path');
var net = require('net');

var sockets = [];

function cleanup() {
	for (var s = 0; s < sockets.length; ++s) {
		try {
			fs.unlinkSync(sockets[s]);
		} catch (e) {}
	}
}
process.on("exit", cleanup);

// exit handlers aren't called by the default handler
if (process.listeners('SIGHUP').length === 0) {
	process.on('SIGHUP', process.exit.bind(process, 128 + 1));
}
if (process.listeners('SIGINT').length === 0) {
	process.on('SIGINT', process.exit.bind(process, 128 + 2));
}

// The eval function is passed in because there is no other way to access a file's non-global context
exports.start = function (prefix, suffix, evalFunction) {
	if (!REPL_ENABLED) return;
	if (process.platform === 'win32') return; // Windows doesn't support sockets mounted in the filesystem

	var resolvedPrefix = path.resolve(__dirname, Config.replsocketprefix || 'logs/repl', prefix);
	if (!evalFunction) {
		evalFunction = suffix;
		suffix = "";
	}
	var name = resolvedPrefix + suffix;

	if (prefix === 'app') {
		// Clear out any old sockets
		var directory = path.dirname(resolvedPrefix);
		fs.readdirSync(directory).forEach(function (file) {
			var stat = fs.statSync(directory + '/' + file);
			if (!stat.isSocket()) {
				return;
			}

			var socket = net.connect(directory + '/' + file, function () {
				socket.end();
				socket.destroy();
			}).on('error', function () {
				try {
					fs.unlinkSync(directory + '/' + file);
				} catch (e) {}
			});
		});
	}

	net.createServer(function (socket) {
		require('repl').start({
			input: socket,
			output: socket,
			eval: function (cmd, context, filename, callback) {
				try {
					callback(null, evalFunction(cmd));
				} catch (e) {
					callback(e);
				}
			}
		}).on('exit', socket.end.bind(socket));
		socket.on('error', socket.destroy.bind(socket));
	}).listen(name, function () {
		fs.chmodSync(name, Config.replsocketmode || 0600);
		sockets.push(name);
	}).on('error', function (e) {
		if (e.code === "EADDRINUSE") {
			fs.unlinkSync(name);
			exports.start(prefix, suffix, evalFunction);
			return;
		}

		require('./crashlogger.js')(e, 'REPL: ' + name);
	});
};
