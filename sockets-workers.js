/**
 * Connections
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Abstraction layer for multi-process SockJS connections.
 *
 * This file handles all the communications between the users' browsers and
 * the main process.
 *
 * @license MIT license
 */

'use strict';

const cluster = require('cluster');
const fs = require('fs');
const path = require('path');

// IPC command tokens
const EVAL = '$';
const SOCKET_CONNECT = '*';
const SOCKET_DISCONNECT = '!';
const SOCKET_RECEIVE = '<';
const SOCKET_SEND = '>';
const CHANNEL_ADD = '+';
const CHANNEL_REMOVE = '-';
const CHANNEL_BROADCAST = '#';
const SUBCHANNEL_MOVE = '.';
const SUBCHANNEL_BROADCAST = ':';

// Subchannel IDs
const DEFAULT_SUBCHANNEL_ID = '0';
const P1_SUBCHANNEL_ID = '1';
const P2_SUBCHANNEL_ID = '2';

// Regex for splitting subchannel broadcasts between subchannels.
const SUBCHANNEL_MESSAGE_REGEX = /\|split\n([^\n]*)\n([^\n]*)\n([^\n]*)\n[^\n]*/g;

/**
 * Manages the worker's state for sockets, channels, and
 * subchannels. This is responsible for parsing all outgoing and incoming
 * messages.
 */
class Multiplexer {
	constructor() {
		/** @type {number} */
		this.socketCounter = 0;
		/** @type {Map<string, any>} */
		this.sockets = new Map();
		/** @type {Map<string, Map<string, string>>} */
		this.channels = new Map();
		/** @type {?NodeJS.Timer} */
		this.cleanupInterval = setInterval(() => this.sweepClosedSockets(), 10 * 60 * 1000);
	}

	/**
	 * Mitigates a potential bug in SockJS or Faye-Websocket where
	 * sockets fail to emit a 'close' event after having disconnected.
	 */
	sweepClosedSockets() {
		this.sockets.forEach(socket => {
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

		// Don't bother deleting the sockets from our map; their close event
		// handler will deal with it.
	}

	/**
	 * Sends an IPC message to the parent process.
	 *
	 * @param {string} token
	 * @param {string[]} params
	 */
	sendUpstream(token, ...params) {
		let message = `${token}${params.join('\n')}`;
		if (process.send) process.send(message);
	}

	/**
	 * Parses the params in a downstream message sent as a
	 * command.
	 *
	 * @param {string} params
	 * @param {number} count
	 * @return {string[]}
	 */
	parseParams(params, count) {
		let i = 0;
		let idx = 0;
		let ret = [];
		while (i++ < count) {
			let newIdx = params.indexOf('\n', idx);
			if (newIdx < 0) {
				// No remaining newlines; just use the rest of the string as
				// the last parametre.
				ret.push(params.slice(idx));
				break;
			}

			let param = params.slice(idx, newIdx);
			if (i === count) {
				// We reached the number of parametres needed, but there is
				// still some remaining string left. Glue it to the last one.
				param += `\n${params.slice(newIdx + 1)}`;
			} else {
				idx = newIdx + 1;
			}

			ret.push(param);
		}

		return ret;
	}

	/**
	 * Parses downstream messages.
	 *
	 * @param {string} data
	 * @return {boolean}
	 */
	receiveDownstream(data) {
		// console.log(`worker received: ${data}`);
		let token = data.charAt(0);
		let params = data.substr(1);
		switch (token) {
		case EVAL:
			return this.onEval(params);
		case SOCKET_DISCONNECT:
			return this.onSocketDisconnect(params);
		case SOCKET_SEND:
			// @ts-ignore
			return this.onSocketSend(...this.parseParams(params, 2));
		case CHANNEL_ADD:
			// @ts-ignore
			return this.onChannelAdd(...this.parseParams(params, 2));
		case CHANNEL_REMOVE:
			// @ts-ignore
			return this.onChannelRemove(...this.parseParams(params, 2));
		case CHANNEL_BROADCAST:
			// @ts-ignore
			return this.onChannelBroadcast(...this.parseParams(params, 2));
		case SUBCHANNEL_MOVE:
			// @ts-ignore
			return this.onSubchannelMove(...this.parseParams(params, 3));
		case SUBCHANNEL_BROADCAST:
			// @ts-ignore
			return this.onSubchannelBroadcast(...this.parseParams(params, 2));
		default:
			console.error(`Sockets: attempted to send unknown IPC message with token ${token}: ${params}`);
			return false;
		}
	}

	/**
	 * Safely tries to destroy a socket's connection.
	 *
	 * @param {any} socket
	 */
	tryDestroySocket(socket) {
		try {
			socket.destroy();
		} catch (e) {}
	}

	/**
	 * Eval handler for downstream messages.
	 *
	 * @param {string} expr
	 * @return {boolean}
	 */
	onEval(expr) {
		try {
			eval(expr);
			return true;
		} catch (e) {}
		return false;
	}

	/**
	 * Sockets.socketConnect message handler.
	 *
	 * @param {any} socket
	 * @return {boolean}
	 */
	onSocketConnect(socket) {
		if (!socket) return false;
		if (!socket.remoteAddress) {
			this.tryDestroySocket(socket);
			return false;
		}

		let socketid = '' + this.socketCounter++;
		let ip = socket.remoteAddress;
		let ips = socket.headers['x-forwarded-for'] || '';
		this.sockets.set(socketid, socket);
		this.sendUpstream(SOCKET_CONNECT, socketid, ip, ips, socket.protocol);

		socket.on('data', /** @param {string} message */ message => {
			this.onSocketReceive(socketid, message);
		});

		socket.on('close', () => {
			this.sendUpstream(SOCKET_DISCONNECT, socketid);
			this.sockets.delete(socketid);
			this.channels.forEach((channel, channelid) => {
				if (!channel || !channel.has(socketid)) return;
				channel.delete(socketid);
				if (!channel.size) this.channels.delete(channelid);
			});
		});

		return true;
	}

	/**
	 * Sockets.socketDisconnect message handler.
	 * @param {string} socketid
	 * @return {boolean}
	 */
	onSocketDisconnect(socketid) {
		let socket = this.sockets.get(socketid);
		if (!socket) return false;

		this.tryDestroySocket(socket);
		return true;
	}

	/**
	 * Sockets.socketSend message handler.
	 *
	 * @param {string} socketid
	 * @param {string} message
	 * @return {boolean}
	 */
	onSocketSend(socketid, message) {
		let socket = this.sockets.get(socketid);
		if (!socket) return false;

		socket.write(message);
		return true;
	}

	/**
	 * onmessage event handler for sockets. Passes the message
	 * upstream.
	 *
	 * @param {string} socketid
	 * @param {string} message
	 * @return {boolean}
	 */
	onSocketReceive(socketid, message) {
		// Drop empty messages (DDOS?).
		if (!message) return false;

		// Drop >100KB messages.
		if (message.length > 100 * 1024) {
			console.log(`Dropping client message ${message.length / 1024}KB...`);
			console.log(message.slice(0, 160));
			return false;
		}

		// Drop legacy JSON messages.
		if ((typeof message !== 'string') || message.startsWith('{')) return false;

		// Drop invalid messages (again, DDOS?).
		if (message.endsWith('|') || !message.includes('|')) return false;

		this.sendUpstream(SOCKET_RECEIVE, socketid, message);
		return true;
	}

	/**
	 * Sockets.channelAdd message handler.
	 *
	 * @param {string} channelid
	 * @param {string} socketid
	 * @return {boolean}
	 */
	onChannelAdd(channelid, socketid) {
		if (!this.sockets.has(socketid)) return false;

		if (this.channels.has(channelid)) {
			let channel = this.channels.get(channelid);
			if (!channel || channel.has(socketid)) return false;
			channel.set(socketid, DEFAULT_SUBCHANNEL_ID);
		} else {
			let channel = new Map([[socketid, DEFAULT_SUBCHANNEL_ID]]);
			this.channels.set(channelid, channel);
		}

		return true;
	}

	/**
	 * Sockets.channelRemove message handler.
	 *
	 * @param {string} channelid
	 * @param {string} socketid
	 * @return {boolean}
	 */
	onChannelRemove(channelid, socketid) {
		let channel = this.channels.get(channelid);
		if (!channel || !channel.has(socketid)) return false;

		channel.delete(socketid);
		if (!channel.size) this.channels.delete(channelid);
		return true;
	}

	/**
	 * Sockets.channelSend and Sockets.channelBroadcast message
	 * handler.
	 *
	 * @param {string} channelid
	 * @param {string} message
	 * @return {boolean}
	 */
	onChannelBroadcast(channelid, message) {
		let channel = this.channels.get(channelid);
		if (!channel) return false;

		channel.forEach(
			/**
			 * @param {string} subchannelid
			 * @param {string} socketid
			 */
			(subchannelid, socketid) => {
				let socket = this.sockets.get(socketid);
				socket.write(message);
			}
		);

		return true;
	}

	/**
	 * Sockets.subchannelMove message handler.
	 *
	 * @param {string} channelid
	 * @param {string} subchannelid
	 * @param {string} socketid
	 * @return {boolean}
	 */
	onSubchannelMove(channelid, subchannelid, socketid) {
		if (!this.sockets.has(socketid)) return false;

		if (this.channels.has(channelid)) {
			let channel = this.channels.get(channelid);
			if (channel) channel.set(socketid, subchannelid);
		} else {
			let channel = new Map([[socketid, subchannelid]]);
			this.channels.set(channelid, channel);
		}

		return true;
	}

	/**
	 * Sockets.subchannelBroadcast message handler.
	 *
	 * @param {string} channelid
	 * @param {string} message
	 * @return {boolean}
	 */
	onSubchannelBroadcast(channelid, message) {
		let channel = this.channels.get(channelid);
		if (!channel) return false;

		let msgs = {};
		channel.forEach(
			/**
			 * @param {string} subchannelid
			 * @param {string} socketid
			 */
			(subchannelid, socketid) => {
				let socket = this.sockets.get(socketid);
				if (!socket) return;

				if (!(subchannelid in msgs)) {
					switch (subchannelid) {
					case DEFAULT_SUBCHANNEL_ID:
						msgs[subchannelid] = message.replace(SUBCHANNEL_MESSAGE_REGEX, '$1');
						break;
					case P1_SUBCHANNEL_ID:
						msgs[subchannelid] = message.replace(SUBCHANNEL_MESSAGE_REGEX, '$2');
						break;
					case P2_SUBCHANNEL_ID:
						msgs[subchannelid] = message.replace(SUBCHANNEL_MESSAGE_REGEX, '$3');
						break;
					}
				}

				socket.write(msgs[subchannelid]);
			}
		);

		return true;
	}

	/**
	 * Cleans up the properties of the multiplexer once an internal message
	 * from the parent process dictates that the worker disconnect. We can't
	 * use the 'disconnect' handler for this because at that point the worker
	 * is already disconnected.
	 */
	destroy() {
		// @ts-ignore
		clearInterval(this.cleanupInterval);
		this.cleanupInterval = null;
		this.sockets.forEach(socket => this.tryDestroySocket(socket));
		this.sockets.clear();
		this.channels.clear();
	}
}

if (cluster.isWorker) {
	// @ts-ignore
	global.Config = require('./config/config');

	// @ts-ignore
	if (process.env.PSPORT) Config.port = +process.env.PSPORT;
	// @ts-ignore
	if (process.env.PSBINDADDR) Config.bindaddress = process.env.PSBINDADDR;
	// @ts-ignore
	if (+process.env.PSNOSSL) Config.ssl = null;

	if (Config.ofe) {
		try {
			require.resolve('ofe');
		} catch (e) {
			if (e.code !== 'MODULE_NOT_FOUND') throw e; // should never happen
			throw new Error(
				'ofe is not installed, but it is a required dependency if Config.ofe is set to true! ' +
				'Run npm install ofe and restart the server.'
			);
		}

		// Create a heapdump if the process runs out of memory.
		require('ofe').call();
	}

	// Graceful crash.
	process.on('uncaughtException', err => {
		if (Config.crashguard) require('./crashlogger')(err, `Socket process ${cluster.worker.id} (${process.pid})`, true);
	});

	let app = require('http').createServer();
	/** @type {?NodeJS.Server} */
	let appssl = null;
	if (Config.ssl) {
		let key;
		try {
			key = path.resolve(__dirname, Config.ssl.options.key);
			if (!fs.lstatSync(key).isFile()) throw new Error();
			try {
				key = fs.readFileSync(key);
			} catch (e) {
				require('./crashlogger')(new Error(`Failed to read the configured SSL private key PEM file:\n${e.stack}`), `Socket process ${cluster.worker.id} (${process.pid})`, true);
			}
		} catch (e) {
			console.warn('SSL private key config values will not support HTTPS server option values in the future. Please set it to use the absolute path of its PEM file.');
			key = Config.ssl.options.key;
		}

		let cert;
		try {
			cert = path.resolve(__dirname, Config.ssl.options.cert);
			if (!fs.lstatSync(cert).isFile()) throw new Error();
			try {
				cert = fs.readFileSync(cert);
			} catch (e) {
				require('./crashlogger')(new Error(`Failed to read the configured SSL certificate PEM file:\n${e.stack}`), `Socket process ${cluster.worker.id} (${process.pid})`, true);
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
				require('./crashlogger')(new Error(`The SSL settings are misconfigured:\n${e.stack}`), `Socket process ${cluster.worker.id} (${process.pid})`, true);
			}
		}
	}

	const StaticServer = require('node-static').Server;
	const roomidRegex = /^\/[A-Za-z0-9][A-Za-z0-9-]*\/?$/;
	const cssServer = new StaticServer('./config');
	const avatarServer = new StaticServer('./config/avatars');
	const staticServer = new StaticServer('./static');
	/**
	 * @param {any} req
	 * @param {any} res
	 */
	const staticRequestHandler = (req, res) => {
		// console.log(`static rq: ${req.socket.remoteAddress}:${req.socket.remotePort} -> ${req.socket.localAddress}:${req.socket.localPort} - ${req.method} ${req.url} ${request.httpVersion} - ${req.rawHeaders.join('|')}`);
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
				// @ts-ignore
				if (e && e.status === 404) {
					staticServer.serveFile('404.html', 404, {}, req, res);
				}
			});
		});
	};

	app.on('request', staticRequestHandler);
	if (appssl) appssl.on('request', staticRequestHandler);

	// Launch the SockJS server.
	const sockjs = require('sockjs');
	const server = sockjs.createServer({
		sockjs_url: '//play.pokemonshowdown.com/js/lib/sockjs-1.1.1-nwjsfix.min.js',
		log(severity, message) {
			if (severity === 'error') console.error(`Sockets worker SockJS error: ${message}`);
		},
		prefix: '/showdown',
	});

	// Instantiate SockJS' multiplexer. This takes messages received downstream
	// from the parent process and distributes them across the sockets they are
	// targeting, as well as handling user disconnects and passing user
	// messages upstream.
	const multiplexer = new Multiplexer();

	process.on('message', data => {
		multiplexer.receiveDownstream(data);
	});

	// Clean up any remaining connections on disconnect. If this isn't done,
	// the process will not exit until any remaining connections have been destroyed.
	// Afterwards, the worker process will die on its own.
	process.once('disconnect', () => {
		multiplexer.destroy();
		app.close();
		/** @type {?NodeJS.Server} */
		if (appssl) appssl.close();
	});

	server.on('connection', /** @param {any} socket */ socket => {
		multiplexer.onSocketConnect(socket);
	});

	server.installHandlers(app, {});
	app.listen(Config.port, Config.bindaddress);
	if (appssl) {
		// @ts-ignore
		server.installHandlers(appssl, {});
		appssl.listen(Config.ssl.port, Config.bindaddress);
	}

	require('./repl').start(
		`sockets-${cluster.worker.id}-${process.pid}`,
		/** @param {string} cmd */
		cmd => eval(cmd)
	);
}

module.exports = {
	SUBCHANNEL_MESSAGE_REGEX,
	Multiplexer,
};
