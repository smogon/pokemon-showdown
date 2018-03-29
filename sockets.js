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

'use strict';

const cluster = require('cluster');
const fs = require('fs');

if (cluster.isMaster) {
	cluster.setupMaster({
		exec: require('path').resolve(__dirname, 'sockets'),
	});

	const workers = exports.workers = new Map();

	const spawnWorker = exports.spawnWorker = function () {
		let worker = cluster.fork({PSPORT: Config.port, PSBINDADDR: Config.bindaddress || '0.0.0.0', PSNOSSL: Config.ssl ? 0 : 1});
		let id = worker.id;
		workers.set(id, worker);
		worker.on('message', data => {
			// console.log('master received: ' + data);
			switch (data.charAt(0)) {
			case '*': {
				// *socketid, ip, protocol
				// connect
				let nlPos = data.indexOf('\n');
				let nlPos2 = data.indexOf('\n', nlPos + 1);
				Users.socketConnect(worker, id, data.slice(1, nlPos), data.slice(nlPos + 1, nlPos2), data.slice(nlPos2 + 1));
				break;
			}

			case '!': {
				// !socketid
				// disconnect
				Users.socketDisconnect(worker, id, data.substr(1));
				break;
			}

			case '<': {
				// <socketid, message
				// message
				let nlPos = data.indexOf('\n');
				Users.socketReceive(worker, id, data.substr(1, nlPos - 1), data.substr(nlPos + 1));
				break;
			}

			default:
			// unhandled
			}
		});

		return worker;
	};

	cluster.on('exit', (worker, code, signal) => {
		if (code === null && signal !== null) {
			// Worker was killed by Sockets.killWorker or Sockets.killPid, probably.
			console.log(`Worker ${worker.id} was forcibly killed with status ${signal}.`);
			workers.delete(worker.id);
		} else if (code === 0 && signal === null) {
			// Happens when killing PS with ^C
			console.log(`Worker ${worker.id} died, but returned a successful exit code.`);
			workers.delete(worker.id);
		} else if (code > 0) {
			// Worker was killed abnormally, likely because of a crash.
			require('./lib/crashlogger')(new Error(`Worker ${worker.id} abruptly died with code ${code} and signal ${signal}`), "The main process");
			// Don't delete the worker so it can be inspected if need be.
		}

		if (worker.isConnected()) worker.disconnect();
		// FIXME: this is a bad hack to get around a race condition in
		// Connection#onDisconnect sending room deinit messages after already
		// having removed the sockets from their channels.
		worker.send = () => {};

		let count = 0;
		Users.connections.forEach(connection => {
			if (connection.worker === worker) {
				Users.socketDisconnect(worker, worker.id, connection.socketid);
				count++;
			}
		});
		console.log(`${count} connections were lost.`);

		// Attempt to recover.
		spawnWorker();
	});

	exports.listen = function (port, bindAddress, workerCount) {
		if (port !== undefined && !isNaN(port)) {
			Config.port = port;
			Config.ssl = null;
		} else {
			port = Config.port;

			// Autoconfigure when running in cloud environments.
			try {
				const cloudenv = require('cloud-env');
				bindAddress = cloudenv.get('IP', bindAddress);
				port = cloudenv.get('PORT', port);
			} catch (e) {}
		}
		if (bindAddress !== undefined) {
			Config.bindaddress = bindAddress;
		}
		if (workerCount === undefined) {
			workerCount = (Config.workers !== undefined ? Config.workers : 1);
		}
		for (let i = 0; i < workerCount; i++) {
			spawnWorker();
		}
	};

	exports.killWorker = function (worker) {
		let count = 0;
		Users.connections.forEach(connection => {
			if (connection.worker === worker) {
				Users.socketDisconnect(worker, worker.id, connection.socketid);
				count++;
			}
		});
		console.log(`${count} connections were lost.`);

		try {
			worker.kill('SIGTERM');
		} catch (e) {}

		return count;
	};

	exports.killPid = function (pid) {
		for (const worker of workers.values()) {
			if (pid === worker.process.pid) {
				return this.killWorker(worker);
			}
		}
		return false;
	};

	exports.socketSend = function (worker, socketid, message) {
		worker.send(`>${socketid}\n${message}`);
	};
	exports.socketDisconnect = function (worker, socketid) {
		worker.send(`!${socketid}`);
	};

	exports.channelBroadcast = function (channelid, message) {
		workers.forEach(worker => {
			worker.send(`#${channelid}\n${message}`);
		});
	};
	exports.channelSend = function (worker, channelid, message) {
		worker.send(`#${channelid}\n${message}`);
	};
	exports.channelAdd = function (worker, channelid, socketid) {
		worker.send(`+${channelid}\n${socketid}`);
	};
	exports.channelRemove = function (worker, channelid, socketid) {
		worker.send(`-${channelid}\n${socketid}`);
	};

	exports.subchannelBroadcast = function (channelid, message) {
		workers.forEach(worker => {
			worker.send(`:${channelid}\n${message}`);
		});
	};
	exports.subchannelMove = function (worker, channelid, subchannelid, socketid) {
		worker.send(`.${channelid}\n${subchannelid}\n${socketid}`);
	};
} else {
	// is worker
	global.Config = require('./config/config');

	if (process.env.PSPORT) Config.port = +process.env.PSPORT;
	if (process.env.PSBINDADDR) Config.bindaddress = process.env.PSBINDADDR;
	if (+process.env.PSNOSSL) Config.ssl = null;

	if (Config.ofe) {
		try {
			require.resolve('node-oom-heapdump');
		} catch (e) {
			if (e.code !== 'MODULE_NOT_FOUND') throw e; // should never happen
			throw new Error(
				'node-oom-heapdump is not installed, but it is a required dependency if Config.ofe is set to true! ' +
				'Run npm install node-oom-heapdump and restart the server.'
			);
		}

		// Create a heapdump if the process runs out of memory.
		require('node-oom-heapdump')({
			addTimestamp: true,
		});
	}

	// Static HTTP server

	// This handles the custom CSS and custom avatar features, and also
	// redirects yourserver:8001 to yourserver-8001.psim.us

	// It's optional if you don't need these features.

	global.Dnsbl = require('./dnsbl');

	if (Config.crashguard) {
		// graceful crash
		process.on('uncaughtException', err => {
			require('./lib/crashlogger')(err, `Socket process ${cluster.worker.id} (${process.pid})`, true);
		});
	}

	let app = require('http').createServer();
	let appssl = null;
	if (Config.ssl) {
		let key;
		try {
			key = require('path').resolve(__dirname, Config.ssl.options.key);
			if (!fs.lstatSync(key).isFile()) throw new Error();
			try {
				key = fs.readFileSync(key);
			} catch (e) {
				require('./lib/crashlogger')(new Error(`Failed to read the configured SSL private key PEM file:\n${e.stack}`), `Socket process ${cluster.worker.id} (${process.pid})`, true);
			}
		} catch (e) {
			console.warn('SSL private key config values will not support HTTPS server option values in the future. Please set it to use the absolute path of its PEM file.');
			key = Config.ssl.options.key;
		}

		let cert;
		try {
			cert = require('path').resolve(__dirname, Config.ssl.options.cert);
			if (!fs.lstatSync(cert).isFile()) throw new Error();
			try {
				cert = fs.readFileSync(cert);
			} catch (e) {
				require('./lib/crashlogger')(new Error(`Failed to read the configured SSL certificate PEM file:\n${e.stack}`), `Socket process ${cluster.worker.id} (${process.pid})`, true);
			}
		} catch (e) {
			console.warn('SSL certificate config values will not support HTTPS server option values in the future. Please set it to use the absolute path of its PEM file.');
			cert = Config.ssl.options.cert;
		}

		if (key && cert) {
			try {
				// In case there are additional SSL config settings besides the key and cert...
				appssl = require('https').createServer(Object.assign({}, Config.ssl.options, {key, cert}));
			} catch (e) {
				require('./lib/crashlogger')(`The SSL settings are misconfigured:\n${e.stack}`, `Socket process ${cluster.worker.id} (${process.pid})`, true);
			}
		}
	}

	// Static server
	const StaticServer = require('node-static').Server;
	const roomidRegex = /^\/(?:[A-Za-z0-9][A-Za-z0-9-]*)\/?$/;
	const cssServer = new StaticServer('./config');
	const avatarServer = new StaticServer('./config/avatars');
	const staticServer = new StaticServer('./static');
	const staticRequestHandler = (req, res) => {
		// console.log(`static rq: ${req.socket.remoteAddress}:${req.socket.remotePort} -> ${req.socket.localAddress}:${req.socket.localPort} - ${req.method} ${req.url} ${req.httpVersion} - ${req.rawHeaders.join('|')}`);
		req.resume();
		req.addListener('end', () => {
			if (Config.customhttpresponse &&
					Config.customhttpresponse(req, res)) {
				return;
			}

			let server = staticServer;
			if (req.url === '/custom.css') {
				server = cssServer;
			} else if (req.url.startsWith('/avatars/')) {
				req.url = req.url.substr(8);
				server = avatarServer;
			} else if (roomidRegex.test(req.url)) {
				req.url = '/';
			}

			server.serve(req, res, e => {
				if (e && (e.status === 404)) {
					staticServer.serveFile('404.html', 404, {}, req, res);
				}
			});
		});
	};

	app.on('request', staticRequestHandler);
	if (appssl) appssl.on('request', staticRequestHandler);

	// SockJS server

	// This is the main server that handles users connecting to our server
	// and doing things on our server.

	const sockjs = require('sockjs');
	const options = {
		sockjs_url: "//play.pokemonshowdown.com/js/lib/sockjs-1.1.1-nwjsfix.min.js",
		prefix: '/showdown',
		log(severity, message) {
			if (severity === 'error') console.log(`ERROR: ${message}`);
		},
	};

	if (Config.wsdeflate) {
		try {
			const deflate = require('permessage-deflate').configure(Config.wsdeflate);
			options.faye_server_options = {extensions: [deflate]};
		} catch (e) {
			require('./lib/crashlogger')(new Error("Dependency permessage-deflate is not installed or is otherwise unaccessable. No message compression will take place until server restart."), "Sockets");
		}
	}

	const server = sockjs.createServer(options);
	const sockets = new Map();
	const channels = new Map();
	const subchannels = new Map();

	// Deal with phantom connections.
	const sweepSocketInterval = setInterval(() => {
		sockets.forEach(socket => {
			if (socket.protocol === 'xhr-streaming' &&
				socket._session &&
				socket._session.recv) {
				socket._session.recv.didClose();
			}

			// A ghost connection's `_session.to_tref._idlePrev` (and `_idleNext`) property is `null` while
			// it is an object for normal users. Under normal circumstances, those properties should only be
			// `null` when the timeout has already been called, but somehow it's not happening for some connections.
			// Simply calling `_session.timeout_cb` (the function bound to the aformentioned timeout) manually
			// on those connections kills those connections. For a bit of background, this timeout is the timeout
			// that sockjs sets to wait for users to reconnect within that time to continue their session.
			if (socket._session &&
				socket._session.to_tref &&
				!socket._session.to_tref._idlePrev) {
				socket._session.timeout_cb();
			}
		});
	}, 1000 * 60 * 10);

	process.on('message', data => {
		// console.log('worker received: ' + data);
		let socket = null;
		let socketid = '';
		let channel = null;
		let channelid = '';
		let subchannel = null;
		let subchannelid = '';
		let nlLoc = -1;
		let message = '';

		switch (data.charAt(0)) {
		case '$': // $code
			eval(data.substr(1));
			break;

		case '!': // !socketid
			// destroy
			socketid = data.substr(1);
			socket = sockets.get(socketid);
			if (!socket) return;
			socket.destroy();
			sockets.delete(socketid);
			channels.forEach(channel => channel.delete(socketid));
			break;

		case '>':
			// >socketid, message
			// message
			nlLoc = data.indexOf('\n');
			socketid = data.substr(1, nlLoc - 1);
			socket = sockets.get(socketid);
			if (!socket) return;
			message = data.substr(nlLoc + 1);
			socket.write(message);
			break;

		case '#':
			// #channelid, message
			// message to channel
			nlLoc = data.indexOf('\n');
			channelid = data.substr(1, nlLoc - 1);
			channel = channels.get(channelid);
			if (!channel) return;
			message = data.substr(nlLoc + 1);
			channel.forEach(socket => socket.write(message));
			break;

		case '+':
			// +channelid, socketid
			// add to channel
			nlLoc = data.indexOf('\n');
			socketid = data.substr(nlLoc + 1);
			socket = sockets.get(socketid);
			if (!socket) return;
			channelid = data.substr(1, nlLoc - 1);
			channel = channels.get(channelid);
			if (!channel) {
				channel = new Map();
				channels.set(channelid, channel);
			}
			channel.set(socketid, socket);
			break;

		case '-':
			// -channelid, socketid
			// remove from channel
			nlLoc = data.indexOf('\n');
			channelid = data.slice(1, nlLoc);
			channel = channels.get(channelid);
			if (!channel) return;
			socketid = data.slice(nlLoc + 1);
			channel.delete(socketid);
			subchannel = subchannels.get(channelid);
			if (subchannel) subchannel.delete(socketid);
			if (!channel.size) {
				channels.delete(channelid);
				if (subchannel) subchannels.delete(channelid);
			}
			break;

		case '.':
			// .channelid, subchannelid, socketid
			// move subchannel
			nlLoc = data.indexOf('\n');
			channelid = data.slice(1, nlLoc);
			let nlLoc2 = data.indexOf('\n', nlLoc + 1);
			subchannelid = data.slice(nlLoc + 1, nlLoc2);
			socketid = data.slice(nlLoc2 + 1);

			subchannel = subchannels.get(channelid);
			if (!subchannel) {
				subchannel = new Map();
				subchannels.set(channelid, subchannel);
			}
			if (subchannelid === '0') {
				subchannel.delete(socketid);
			} else {
				subchannel.set(socketid, subchannelid);
			}
			break;

		case ':':
			// :channelid, message
			// message to subchannel
			nlLoc = data.indexOf('\n');
			channelid = data.slice(1, nlLoc);
			channel = channels.get(channelid);
			if (!channel) return;

			let messages = [null, null, null];
			message = data.substr(nlLoc + 1);
			subchannel = subchannels.get(channelid);
			channel.forEach((socket, socketid) => {
				switch (subchannel ? subchannel.get(socketid) : '0') {
				case '1':
					if (!messages[1]) {
						messages[1] = message.replace(/\n\|split\n[^\n]*\n([^\n]*)\n[^\n]*\n[^\n]*/g, '\n$1');
					}
					socket.write(messages[1]);
					break;
				case '2':
					if (!messages[2]) {
						messages[2] = message.replace(/\n\|split\n[^\n]*\n[^\n]*\n([^\n]*)\n[^\n]*/g, '\n$1');
					}
					socket.write(messages[2]);
					break;
				default:
					if (!messages[0]) {
						messages[0] = message.replace(/\n\|split\n([^\n]*)\n[^\n]*\n[^\n]*\n[^\n]*/g, '\n$1');
					}
					socket.write(messages[0]);
					break;
				}
			});
			break;
		}
	});

	// Clean up any remaining connections on disconnect. If this isn't done,
	// the process will not exit until any remaining connections have been destroyed.
	// Afterwards, the worker process will die on its own.
	process.once('disconnect', () => {
		clearInterval(sweepSocketInterval);

		sockets.forEach(socket => {
			try {
				socket.destroy();
			} catch (e) {}
		});
		sockets.clear();
		channels.clear();
		subchannels.clear();

		app.close();
		if (appssl) appssl.close();

		// Let the server(s) finish closing.
		setImmediate(() => process.exit(0));
	});

	// this is global so it can be hotpatched if necessary
	let isTrustedProxyIp = Dnsbl.checker(Config.proxyip);
	let socketCounter = 0;
	server.on('connection', socket => {
		// For reasons that are not entirely clear, SockJS sometimes triggers
		// this event with a null `socket` argument.
		if (!socket) return;

		if (!socket.remoteAddress) {
			// SockJS sometimes fails to be able to cache the IP, port, and
			// address from connection request headers.
			try {
				socket.destroy();
			} catch (e) {}
			return;
		}

		let socketid = '' + (++socketCounter);
		sockets.set(socketid, socket);

		let socketip = socket.remoteAddress;
		if (isTrustedProxyIp(socketip)) {
			let ips = (socket.headers['x-forwarded-for'] || '')
				.split(',')
				.reverse();
			for (let ip of ips) {
				let proxy = ip.trim();
				if (!isTrustedProxyIp(proxy)) {
					socketip = proxy;
					break;
				}
			}
		}

		process.send(`*${socketid}\n${socketip}\n${socket.protocol}`);

		socket.on('data', message => {
			// drop empty messages (DDoS?)
			if (!message) return;
			// drop messages over 100KB
			if (message.length > (100 * 1024)) {
				console.log(`Dropping client message ${message.length / 1024} KB...`);
				console.log(message.slice(0, 160));
				return;
			}
			// drop legacy JSON messages
			if (typeof message !== 'string' || message.startsWith('{')) return;
			// drop blank messages (DDoS?)
			let pipeIndex = message.indexOf('|');
			if (pipeIndex < 0 || pipeIndex === message.length - 1) return;

			process.send(`<${socketid}\n${message}`);
		});

		socket.once('close', () => {
			process.send(`!${socketid}`);
			sockets.delete(socketid);
			channels.forEach(channel => channel.delete(socketid));
		});
	});
	server.installHandlers(app, {});
	app.listen(Config.port, Config.bindaddress);
	console.log(`Worker ${cluster.worker.id} now listening on ${Config.bindaddress}:${Config.port}`);

	if (appssl) {
		server.installHandlers(appssl, {});
		appssl.listen(Config.ssl.port, Config.bindaddress);
		console.log(`Worker ${cluster.worker.id} now listening for SSL on port ${Config.ssl.port}`);
	}

	console.log(`Test your server at http://${Config.bindaddress === '0.0.0.0' ? 'localhost' : Config.bindaddress}:${Config.port}`);

	require('./lib/repl').start(`sockets-${cluster.worker.id}-${process.pid}`, cmd => eval(cmd));
}
