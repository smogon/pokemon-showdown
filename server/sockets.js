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

const MINUTES = 60 * 1000;

const cluster = require('cluster');
const fs = require('fs');
/** @type {typeof import('../lib/fs').FS} */
const FS = require(/** @type {any} */('../.lib-dist/fs')).FS;

/** @typedef {0 | 1 | 2 | 3 | 4} ChannelID */

const Monitor = {
	crashlog: require(/** @type {any} */('../.lib-dist/crashlogger')),
};

if (cluster.isMaster) {
	cluster.setupMaster({
		exec: require('path').resolve(__dirname, 'sockets'),
	});

	/** @type {Map<number, cluster.Worker>} */
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
			Monitor.crashlog(new Error(`Worker ${worker.id} abruptly died with code ${code} and signal ${signal}`), "The main process");
			// Don't delete the worker so it can be inspected if need be.
		}

		if (worker.isConnected()) worker.disconnect();
		// FIXME: this is a bad hack to get around a race condition in
		// Connection#onDisconnect sending room deinit messages after already
		// having removed the sockets from their rooms.
		// @ts-ignore
		worker.send = () => {};

		let count = 0;
		for (const connection of Users.connections.values()) {
			if (connection.worker === worker) {
				Users.socketDisconnect(worker, worker.id, connection.socketid);
				count++;
			}
		}
		console.log(`${count} connections were lost.`);

		// Attempt to recover.
		spawnWorker();
	});

	/**
	 * @param {number} [port]
	 * @param {string} [bindAddress]
	 * @param {number} [workerCount]
	 */
	exports.listen = function (port, bindAddress, workerCount) {
		if (port !== undefined && !isNaN(port)) {
			Config.port = port;
			Config.ssl = null;
		} else {
			port = Config.port;

			// Autoconfigure when running in cloud environments.
			try {
				const cloudenv = require('cloud-env');
				// @ts-ignore
				bindAddress = cloudenv.get('IP', bindAddress);
				// @ts-ignore
				port = cloudenv.get('PORT', port);
			} catch (e) {}
		}
		if (bindAddress !== undefined) {
			Config.bindaddress = bindAddress;
		}
		if (port !== undefined) {
			Config.port = port;
		}
		if (workerCount === undefined) {
			workerCount = (Config.workers !== undefined ? Config.workers : 1);
		}
		// @ts-ignore - remove when Config is typed
		for (let i = 0; i < workerCount; i++) {
			spawnWorker();
		}
	};

	/**
	 * @param {cluster.Worker} worker
	 */
	exports.killWorker = function (worker) {
		let count = 0;
		for (const connection of Users.connections.values()) {
			if (connection.worker === worker) {
				Users.socketDisconnect(worker, worker.id, connection.socketid);
				count++;
			}
		}
		console.log(`${count} connections were lost.`);

		try {
			worker.kill('SIGTERM');
		} catch (e) {}

		return count;
	};

	/**
	 * @param {number} pid
	 */
	exports.killPid = function (pid) {
		for (const worker of workers.values()) {
			if (pid === worker.process.pid) {
				// @ts-ignore
				return this.killWorker(worker);
			}
		}
		return false;
	};

	/**
	 * @param {cluster.Worker} worker
	 * @param {string} socketid
	 * @param {string} message
	 */
	exports.socketSend = function (worker, socketid, message) {
		worker.send(`>${socketid}\n${message}`);
	};

	/**
	 * @param {cluster.Worker} worker
	 * @param {string} socketid
	 */
	exports.socketDisconnect = function (worker, socketid) {
		worker.send(`!${socketid}`);
	};

	/**
	 * @param {string} roomid
	 * @param {string} message
	 */
	exports.roomBroadcast = function (roomid, message) {
		for (const worker of workers.values()) {
			worker.send(`#${roomid}\n${message}`);
		}
	};

	/**
	 * @param {cluster.Worker} worker
	 * @param {string} roomid
	 * @param {string} socketid
	 */
	exports.roomAdd = function (worker, roomid, socketid) {
		worker.send(`+${roomid}\n${socketid}`);
	};

	/**
	 * @param {cluster.Worker} worker
	 * @param {string} roomid
	 * @param {string} socketid
	 */
	exports.roomRemove = function (worker, roomid, socketid) {
		worker.send(`-${roomid}\n${socketid}`);
	};

	/**
	 * @param {string} roomid
	 * @param {string} message
	 */
	exports.channelBroadcast = function (roomid, message) {
		for (const worker of workers.values()) {
			worker.send(`:${roomid}\n${message}`);
		}
	};

	/**
	 * @param {cluster.Worker} worker
	 * @param {string} roomid
	 * @param {ChannelID} channelid
	 * @param {string} socketid
	 */
	exports.channelMove = function (worker, roomid, channelid, socketid) {
		worker.send(`.${roomid}\n${channelid}\n${socketid}`);
	};

	/**
	 * @param {cluster.Worker} worker
	 * @param {string} query
	 */
	exports.eval = function (worker, query) {
		worker.send(`$${query}`);
	};
} else {
	// is worker
	// @ts-ignore This file doesn't exist on the repository, so Travis checks fail if this isn't ignored
	global.Config = require('../config/config');

	if (process.env.PSPORT) Config.port = +process.env.PSPORT;
	if (process.env.PSBINDADDR) Config.bindaddress = process.env.PSBINDADDR;
	if (process.env.PSNOSSL && parseInt(process.env.PSNOSSL)) Config.ssl = null;

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
		// @ts-ignore
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
			Monitor.crashlog(err, `Socket process ${cluster.worker.id} (${process.pid})`);
		});
	}

	let app = require('http').createServer();
	/** @type {?import('https').Server} */
	let appssl = null;
	if (Config.ssl) {
		let key;
		try {
			key = require('path').resolve(__dirname, Config.ssl.options.key);
			if (!fs.statSync(key).isFile()) throw new Error();
			try {
				key = fs.readFileSync(key);
			} catch (e) {
				Monitor.crashlog(new Error(`Failed to read the configured SSL private key PEM file:\n${e.stack}`), `Socket process ${cluster.worker.id} (${process.pid})`);
			}
		} catch (e) {
			console.warn('SSL private key config values will not support HTTPS server option values in the future. Please set it to use the absolute path of its PEM file.');
			key = Config.ssl.options.key;
		}

		let cert;
		try {
			cert = require('path').resolve(__dirname, Config.ssl.options.cert);
			if (!fs.statSync(cert).isFile()) throw new Error();
			try {
				cert = fs.readFileSync(cert);
			} catch (e) {
				Monitor.crashlog(new Error(`Failed to read the configured SSL certificate PEM file:\n${e.stack}`), `Socket process ${cluster.worker.id} (${process.pid})`);
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
				Monitor.crashlog(new Error(`The SSL settings are misconfigured:\n${e.stack}`), `Socket process ${cluster.worker.id} (${process.pid})`);
			}
		}
	}

	// Static server
	try {
		if (Config.disablenodestatic) throw new Error("disablenodestatic");
		const StaticServer = require('node-static').Server;
		const roomidRegex = /^\/(?:[A-Za-z0-9][A-Za-z0-9-]*)\/?$/;
		const cssServer = new StaticServer('./config');
		const avatarServer = new StaticServer('./config/avatars');
		const staticServer = new StaticServer('./server/static');
		/**
		 * @param {import('http').IncomingMessage} req
		 * @param {import('http').ServerResponse} res
		 */
		const staticRequestHandler = (req, res) => {
			// console.log(`static rq: ${req.socket.remoteAddress}:${req.socket.remotePort} -> ${req.socket.localAddress}:${req.socket.localPort} - ${req.method} ${req.url} ${req.httpVersion} - ${req.rawHeaders.join('|')}`);
			req.resume();
			req.addListener('end', () => {
				if (Config.customhttpresponse &&
						Config.customhttpresponse(req, res)) {
					return;
				}

				let server = staticServer;
				if (req.url) {
					if (req.url === '/custom.css') {
						server = cssServer;
					} else if (req.url.startsWith('/avatars/')) {
						req.url = req.url.substr(8);
						server = avatarServer;
					} else if (roomidRegex.test(req.url)) {
						req.url = '/';
					}
				}

				server.serve(req, res, e => {
					// @ts-ignore
					if (e && e.status === 404) {
						staticServer.serveFile('404.html', 404, {}, req, res);
					}
				});
			});
		};

		app.on('request', staticRequestHandler);
		if (appssl) appssl.on('request', staticRequestHandler);
	} catch (e) {
		if (e.message === 'disablenodestatic') {
			console.log('node-static is disabled');
		} else {
			console.log('Could not start node-static - try `npm install` if you want to use it');
		}
	}

	// SockJS server

	// This is the main server that handles users connecting to our server
	// and doing things on our server.

	const sockjs = require('sockjs');
	const options = {
		sockjs_url: "//play.pokemonshowdown.com/js/lib/sockjs-1.1.1-nwjsfix.min.js",
		prefix: '/showdown',
		/**
		 * @param {string} severity
		 * @param {string} message
		 */
		log(severity, message) {
			if (severity === 'error') console.log(`ERROR: ${message}`);
		},
	};

	if (Config.wsdeflate) {
		try {
			// @ts-ignore
			const deflate = require('permessage-deflate').configure(Config.wsdeflate);
			// @ts-ignore
			options.faye_server_options = {extensions: [deflate]};
		} catch (e) {
			Monitor.crashlog(new Error("Dependency permessage-deflate is not installed or is otherwise unaccessable. No message compression will take place until server restart."), "Sockets");
		}
	}

	const server = sockjs.createServer(options);
	/**
	 * socketid:Connection
	 * @type {Map<string, import('sockjs').Connection>}
	 */
	const sockets = new Map();
	/**
	 * roomid:socketid:Connection
	 * @type {Map<string, Map<string, import('sockjs').Connection>>}
	 */
	const rooms = new Map();
	/**
	 * roomid:socketid:channelid
	 * @type {Map<string, Map<string, ChannelID>>}
	 */
	const roomChannels = new Map();

	/** @type {WriteStream} */
	const logger = FS(`logs/sockets-${process.pid}`).createAppendStream();

	// Deal with phantom connections.
	const sweepSocketInterval = setInterval(() => {
		for (const socket of sockets.values()) {
			// @ts-ignore
			if (socket.protocol === 'xhr-streaming' && socket._session && socket._session.recv) {
				// @ts-ignore
				logger.write(`Found a ghost connection with protocol xhr-streaming and ready state ${socket._session.readyState}\n`);
				// @ts-ignore
				socket._session.recv.didClose();
			}
		}
	}, 10 * MINUTES);

	/**
	 * @param {string} message
	 * @param {-1 | ChannelID} channelid
	 */
	const extractChannel = (message, channelid) => {
		if (channelid === -1) {
			// Grab all privileged messages
			return message.replace(/\n\|split\|p[1234]\n([^\n]*)\n(?:[^\n]*)/g, '\n$1');
		}

		// Grab privileged messages channel has access to
		switch (channelid) {
		case 1: message = message.replace(/\n\|split\|p1\n([^\n]*)\n(?:[^\n]*)/g, '\n$1'); break;
		case 2: message = message.replace(/\n\|split\|p2\n([^\n]*)\n(?:[^\n]*)/g, '\n$1'); break;
		case 3: message = message.replace(/\n\|split\|p3\n([^\n]*)\n(?:[^\n]*)/g, '\n$1'); break;
		case 4: message = message.replace(/\n\|split\|p4\n([^\n]*)\n(?:[^\n]*)/g, '\n$1'); break;
		}

		// Discard remaining privileged messages
		// Note: the last \n? is for privileged messages that are empty when non-privileged
		return message.replace(/\n\|split\|(?:[^\n]*)\n(?:[^\n]*)\n\n?/g, '\n');
	};

	process.on('message', data => {
		// console.log('worker received: ' + data);
		/** @type {import('sockjs').Connection | undefined?} */
		let socket = null;
		let socketid = '';
		/** @type {Map<string, import('sockjs').Connection> | undefined?} */
		let room = null;
		let roomid = '';
		/** @type {Map<string, ChannelID> | undefined?} */
		let roomChannel = null;
		/** @type {ChannelID} */
		let channelid = 0;
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
			for (const [roomid, room] of rooms) {
				room.delete(socketid);
				roomChannel = roomChannels.get(roomid);
				if (roomChannel) roomChannel.delete(socketid);
				if (!room.size) {
					rooms.delete(roomid);
					if (roomChannel) roomChannels.delete(roomid);
				}
			}
			break;

		case '>':
			// >socketid, message
			// message to single connection
			nlLoc = data.indexOf('\n');
			socketid = data.substr(1, nlLoc - 1);
			socket = sockets.get(socketid);
			if (!socket) return;
			message = data.substr(nlLoc + 1);
			socket.write(message);
			break;

		case '#':
			// #roomid, message
			// message to all connections in room
			nlLoc = data.indexOf('\n');
			roomid = data.substr(1, nlLoc - 1);
			room = rooms.get(roomid);
			if (!room) return;
			message = data.substr(nlLoc + 1);
			for (const socket of room.values()) socket.write(message);
			break;

		case '+':
			// +roomid, socketid
			// join room with connection
			nlLoc = data.indexOf('\n');
			socketid = data.substr(nlLoc + 1);
			socket = sockets.get(socketid);
			if (!socket) return;
			roomid = data.substr(1, nlLoc - 1);
			room = rooms.get(roomid);
			if (!room) {
				room = new Map();
				rooms.set(roomid, room);
			}
			room.set(socketid, socket);
			break;

		case '-':
			// -roomid, socketid
			// leave room with connection
			nlLoc = data.indexOf('\n');
			roomid = data.slice(1, nlLoc);
			room = rooms.get(roomid);
			if (!room) return;
			socketid = data.slice(nlLoc + 1);
			room.delete(socketid);
			roomChannel = roomChannels.get(roomid);
			if (roomChannel) roomChannel.delete(socketid);
			if (!room.size) {
				rooms.delete(roomid);
				if (roomChannel) roomChannels.delete(roomid);
			}
			break;

		case '.':
			// .roomid, channelid, socketid
			// move connection to different channel in room
			nlLoc = data.indexOf('\n');
			roomid = data.slice(1, nlLoc);
			let nlLoc2 = data.indexOf('\n', nlLoc + 1);
			channelid = /** @type {ChannelID} */(Number(data.slice(nlLoc + 1, nlLoc2)));
			socketid = data.slice(nlLoc2 + 1);

			roomChannel = roomChannels.get(roomid);
			if (!roomChannel) {
				roomChannel = new Map();
				roomChannels.set(roomid, roomChannel);
			}
			if (channelid === 0) {
				roomChannel.delete(socketid);
			} else {
				roomChannel.set(socketid, channelid);
			}
			break;

		case ':':
			// :roomid, message
			// message to a room, splitting `|split` by channel
			nlLoc = data.indexOf('\n');
			roomid = data.slice(1, nlLoc);
			room = rooms.get(roomid);
			if (!room) return;

			/** @type {[string?, string?, string?, string?, string?]} */
			const messages = [null, null, null, null, null];
			message = data.substr(nlLoc + 1);
			roomChannel = roomChannels.get(roomid);
			for (const [socketid, socket] of room) {
				channelid = (roomChannel && roomChannel.get(socketid)) || 0;
				if (!messages[channelid]) messages[channelid] = extractChannel(message, channelid);
				socket.write(/** @type {string} */(messages[channelid]));
			}
			break;
		}
	});

	// Clean up any remaining connections on disconnect. If this isn't done,
	// the process will not exit until any remaining connections have been destroyed.
	// Afterwards, the worker process will die on its own.
	process.once('disconnect', () => {
		clearInterval(sweepSocketInterval);

		for (const socket of sockets.values()) {
			try {
				socket.destroy();
			} catch (e) {}
		}
		sockets.clear();
		rooms.clear();
		roomChannels.clear();

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

		// xhr-streamming connections sometimes end up becoming ghost
		// connections. Since it already has keepalive set, we set a timeout
		// instead and close the connection if it has been inactive for the
		// configured SockJS heartbeat interval plus an extra second to account
		// for any delay in receiving the SockJS heartbeat packet.
		if (socket.protocol === 'xhr-streaming') {
			// @ts-ignore
			socket._session.recv.thingy.setTimeout(
				// @ts-ignore
				socket._session.recv.options.heartbeat_delay + 1000,
				() => {
					// @ts-ignore
					if (socket._session.recv) socket._session.recv.didClose();
				}
			);
		}

		// @ts-ignore
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

			// @ts-ignore
			process.send(`<${socketid}\n${message}`);
		});

		socket.once('close', () => {
			// @ts-ignore
			process.send(`!${socketid}`);
			sockets.delete(socketid);
			for (const room of rooms.values()) room.delete(socketid);
		});
	});
	server.installHandlers(app, {});
	app.listen(Config.port, Config.bindaddress);
	console.log(`Worker ${cluster.worker.id} now listening on ${Config.bindaddress}:${Config.port}`);

	if (appssl) {
		// @ts-ignore
		server.installHandlers(appssl, {});
		appssl.listen(Config.ssl.port, Config.bindaddress);
		console.log(`Worker ${cluster.worker.id} now listening for SSL on port ${Config.ssl.port}`);
	}

	console.log(`Test your server at http://${Config.bindaddress === '0.0.0.0' ? 'localhost' : Config.bindaddress}:${Config.port}`);

	/** @type {typeof import('../lib/repl').Repl} */
	const Repl = require(/** @type {any} */('../.lib-dist/repl')).Repl;
	Repl.start(`sockets-${cluster.worker.id}-${process.pid}`, cmd => eval(cmd));
}
