/**
 * Connections
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Abstraction layer for multi-process SockJS connections.
 *
 * This file handles all the communications between the users'
 * browsers, the networking processes, and users.js in the
 * main process.
 *
 * @license MIT license
 */

var cluster = require('cluster');
var Config = require('./config/config');

if (cluster.isMaster) {

	cluster.setupMaster({
		exec: 'sockets.js'
	});

	var workers = exports.workers = {};

	var spawnWorker = exports.spawnWorker = function () {
		var worker = cluster.fork({PSPORT: Config.port});
		var id = worker.id;
		workers[id] = worker;
		worker.on('message', function (data) {
			// console.log('master received: ' + data);
			switch (data.charAt(0)) {
			case '*': // *socketid, ip
				// connect
				var nlPos = data.indexOf('\n');
				Users.socketConnect(worker, id, data.substr(1, nlPos - 1), data.substr(nlPos + 1));
				break;

			case '!': // !socketid
				// disconnect
				Users.socketDisconnect(worker, id, data.substr(1));
				break;

			case '<': // <socketid, message
				// message
				var nlPos = data.indexOf('\n');
				Users.socketReceive(worker, id, data.substr(1, nlPos - 1), data.substr(nlPos + 1));
				break;
			}
		});
	};

	var workerCount = Config.workers || 1;
	for (var i = 0; i < workerCount; i++) {
		spawnWorker();
	}

	var killWorker = exports.killWorker = function (worker) {
		var idd = worker.id + '-';
		var count = 0;
		for (var connectionid in Users.connections) {
			if (connectionid.substr(idd.length) === idd) {
				var connection = Users.connections[connectionid];
				Users.socketDisconnect(worker, worker.id, connection.socketid);
				count++;
			}
		}
		try {
			worker.kill();
		} catch (e) {}
		delete workers[worker.id];
		return count;
	};

	var killPid = exports.killPid = function (pid) {
		pid = '' + pid;
		for (var id in workers) {
			var worker = workers[id];
			if (pid === '' + worker.process.pid) {
				return killWorker(worker);
			}
		}
		return false;
	};

	exports.socketSend = function (worker, socketid, message) {
		worker.send('>' + socketid + '\n' + message);
	};
	exports.socketDisconnect = function (worker, socketid) {
		worker.send('!' + socketid);
	};

	exports.channelBroadcast = function (channelid, message) {
		for (var workerid in workers) {
			workers[workerid].send('#' + channelid + '\n' + message);
		}
	};
	exports.channelSend = function (worker, channelid, message) {
		worker.send('#' + channelid + '\n' + message);
	};
	exports.channelAdd = function (worker, channelid, socketid) {
		worker.send('+' + channelid + '\n' + socketid);
	};
	exports.channelRemove = function (worker, channelid, socketid) {
		worker.send('-' + channelid + '\n' + socketid);
	};

} else {
	// is worker

	if (process.env.PSPORT) Config.port = +process.env.PSPORT;

	// ofe is optional
	// if installed, it will heap dump if the process runs out of memory
	try {
		require('ofe').call();
	} catch (e) {}

	// Static HTTP server

	// This handles the custom CSS and custom avatar features, and also
	// redirects yourserver:8001 to yourserver-8001.psim.us

	// It's optional if you don't need these features.

	var Cidr = require('./cidr');

	if (Config.crashguard) {
		// graceful crash
		process.on('uncaughtException', function (err) {
			require('./crashlogger.js')(err, 'Socket process ' + cluster.worker.id + ' (' + process.pid + ')');
		});
	}

	var app = require('http').createServer();
	var appssl;
	if (Config.ssl) {
		appssl = require('https').createServer(Config.ssl.options);
	}
	try {
		(function () {
			var nodestatic = require('node-static');
			var cssserver = new nodestatic.Server('./config');
			var avatarserver = new nodestatic.Server('./config/avatars');
			var staticserver = new nodestatic.Server('./static');
			var staticRequestHandler = function (request, response) {
				request.resume();
				request.addListener('end', function () {
					if (Config.customhttpresponse &&
							Config.customhttpresponse(request, response)) {
						return;
					}
					var server;
					if (request.url === '/custom.css') {
						server = cssserver;
					} else if (request.url.substr(0, 9) === '/avatars/') {
						request.url = request.url.substr(8);
						server = avatarserver;
					} else {
						if (/^\/([A-Za-z0-9][A-Za-z0-9-]*)\/?$/.test(request.url)) {
							request.url = '/';
						}
						server = staticserver;
					}
					server.serve(request, response, function (e, res) {
						if (e && (e.status === 404)) {
							staticserver.serveFile('404.html', 404, {}, request, response);
						}
					});
				});
			};
			app.on('request', staticRequestHandler);
			if (appssl) {
				appssl.on('request', staticRequestHandler);
			}
		})();
	} catch (e) {
		console.log('Could not start node-static - try `npm install` if you want to use it');
	}

	// SockJS server

	// This is the main server that handles users connecting to our server
	// and doing things on our server.

	var sockjs = require('sockjs');

	var server = sockjs.createServer({
		sockjs_url: "//play.pokemonshowdown.com/js/lib/sockjs-0.3.min.js",
		log: function (severity, message) {
			if (severity === 'error') console.log('ERROR: ' + message);
		},
		prefix: '/showdown',
		websocket: !Config.disablewebsocket
	});

	var sockets = {};
	var channels = {};

	// Deal with phantom connections.
	var sweepClosedSockets = function () {
		for (var s in sockets) {
			if (sockets[s].protocol === 'xhr-streaming' &&
				sockets[s]._session &&
				sockets[s]._session.recv) {
				sockets[s]._session.recv.didClose();
			}

			// A ghost connection's `_session.to_tref._idlePrev` (and `_idleNext`) property is `null` while
			// it is an object for normal users. Under normal circumstances, those properties should only be
			// `null` when the timeout has already been called, but somehow it's not happening for some connections.
			// Simply calling `_session.timeout_cb` (the function bound to the aformentioned timeout) manually
			// on those connections kills those connections. For a bit of background, this timeout is the timeout
			// that sockjs sets to wait for users to reconnect within that time to continue their session.
			if (sockets[s]._session &&
				sockets[s]._session.to_tref &&
				!sockets[s]._session.to_tref._idlePrev) {
				sockets[s]._session.timeout_cb();
			}
		}
	};
	var interval;
	if (!Config.herokuhack) {
		interval = setInterval(sweepClosedSockets, 1000 * 60 * 10);
	}

	process.on('message', function (data) {
		// console.log('worker received: ' + data);
		var socket = null;
		var socketid = null;
		var channelid = null;
		switch (data.charAt(0)) {
		case '!': // !socketid
			// destroy
			socketid = data.substr(1);
			socket = sockets[socketid];
			if (!socket) return;
			socket.end();
			// After sending the FIN packet, we make sure the I/O is totally blocked for this socket
			socket.destroy();
			delete sockets[socketid];
			for (channelid in channels) {
				delete channels[channelid][socketid];
			}
			break;

		case '>': // >socketid, message
			// message
			var nlLoc = data.indexOf('\n');
			socket = sockets[data.substr(1, nlLoc - 1)];
			if (!socket) return;
			socket.write(data.substr(nlLoc + 1));
			break;

		case '#': // #channelid, message
			// message to channel
			var nlLoc = data.indexOf('\n');
			channel = channels[data.substr(1, nlLoc - 1)];
			var message = data.substr(nlLoc + 1);
			for (socketid in channel) {
				channel[socketid].write(message);
			}
			break;

		case '+': // +channelid, socketid
			// add to channel
			var nlLoc = data.indexOf('\n');
			socketid = data.substr(nlLoc + 1);
			socket = sockets[socketid];
			if (!socket) return;
			channelid = data.substr(1, nlLoc - 1);
			var channel = channels[channelid];
			if (!channel) channel = channels[channelid] = {};
			channel[socketid] = socket;
			break;

		case '-': // -channelid, socketid
			// remove from channel
			var nlLoc = data.indexOf('\n');
			var channelid = data.substr(1, nlLoc - 1);
			var channel = channels[channelid];
			if (!channel) return;
			delete channel[data.substr(nlLoc + 1)];
			var isEmpty = true;
			for (var socketid in channel) {
				isEmpty = false;
				break;
			}
			if (isEmpty) delete channels[channelid];
			break;
		}
	});

	// this is global so it can be hotpatched if necessary
	var isTrustedProxyIp = Cidr.checker(Config.proxyip);
	var socketCounter = 0;
	server.on('connection', function (socket) {
		if (!socket) {
			// For reasons that are not entirely clear, SockJS sometimes triggers
			// this event with a null `socket` argument.
			return;
		} else if (!socket.remoteAddress) {
			// This condition occurs several times per day. It may be a SockJS bug.
			try {
				socket.end();
			} catch (e) {}
			return;
		}
		var socketid = socket.id = (++socketCounter);

		sockets[socket.id] = socket;

		if (isTrustedProxyIp(socket.remoteAddress)) {
			var ips = (socket.headers['x-forwarded-for'] || '').split(',');
			var ip;
			while (ip = ips.pop()) {
				ip = ip.trim();
				if (!isTrustedProxyIp(ip)) {
					socket.remoteAddress = ip;
					break;
				}
			}
		}

		process.send('*' + socketid + '\n' + socket.remoteAddress);

		// console.log('CONNECT: ' + socket.remoteAddress + ' [' + socket.id + ']');
		var interval;
		if (Config.herokuhack) {
			// see https://github.com/sockjs/sockjs-node/issues/57#issuecomment-5242187
			interval = setInterval(function () {
				try {
					socket._session.recv.didClose();
				} catch (e) {}
			}, 15000);
		}

		socket.on('data', function (message) {
			// drop empty messages (DDoS?)
			if (!message) return;
			// drop blank messages (DDoS?)
			var pipeIndex = message.indexOf('|');
			if (pipeIndex < 0 || pipeIndex === message.length - 1) return;
			// drop legacy JSON messages
			if (message.charAt(0) === '{') return;
			process.send('<' + socketid + '\n' + message);
		});

		socket.on('close', function () {
			if (interval) {
				clearInterval(interval);
			}
			process.send('!' + socketid);

			delete sockets[socketid];
			for (var channelid in channels) {
				delete channels[channelid][socketid];
			}
		});
	});
	server.installHandlers(app, {});
	app.listen(Config.port);
	console.log('Worker ' + cluster.worker.id + ' now listening on port ' + Config.port);

	if (appssl) {
		server.installHandlers(appssl, {});
		appssl.listen(Config.ssl.port);
		console.log('Worker ' + cluster.worker.id + ' now listening for SSL on port ' + Config.ssl.port);
	}

	console.log('Test your server at http://localhost:' + Config.port);

}
