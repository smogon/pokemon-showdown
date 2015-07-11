var fs = require('fs');
var path = require('path');

var clearedPrefixes = {};
// The eval function is passed in because there is no other way to access a file's non-global context
exports.start = function (prefix, suffix, evalFunction) {
	if (process.platform === 'win32') return; // Windows doesn't support sockets mounted in the filesystem

	prefix = path.resolve(__dirname, Config.replsocketprefix || 'logs/repl', prefix);
	if (!evalFunction) {
		evalFunction = suffix;
		suffix = "";
	}
	var name = prefix + suffix;

	if (!clearedPrefixes[prefix]) {
		// Clear out any old sockets
		var directory = path.dirname(prefix);
		var basename = path.basename(prefix);
		fs.readdirSync(directory).forEach(function (file) {
			if (file.indexOf(basename) !== 0) return;
			try {
				fs.unlinkSync(directory + '/' + file);
			} catch (e) {
				require('./crashlogger.js')(e, 'REPL: ' + prefix);
			}
		});
		clearedPrefixes[prefix] = true;
	}

	require('net').createServer(function (socket) {
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
	}).listen(name, fs.chmodSync.bind(fs, name, Config.replsocketmode || 0600));
};
