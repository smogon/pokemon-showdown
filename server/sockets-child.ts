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
 * @license MIT
 */

'use strict';

import * as cluster from 'cluster';
import * as fs from 'fs';
import * as http from 'http';
import * as https from 'https';
import * as path from 'path';

import * as SockJS from 'sockjs';

import {crashlogger} from '../lib/crashlogger';
import {Repl} from '../lib/repl';
import {Config} from './config-loader';
import {IPTools} from './ip-tools';

// Create a heapdump if the process runs out of memory.
if (Config.ofe) {
	// @ts-ignore
	import('node-oom-heapdump').then(heapdump => (
		heapdump({addTimeStamp: true})
	)).catch(err => {
		Monitor.crashlog(
			new Error(`Failed to set up heapdumping:\n${err.stack}`),
			`Socket process ${cluster.worker.id} (${process.pid})`
		);
	});
}

global.Config = Config;
global.IPTools = IPTools;

const Monitor = {crashlog: crashlogger};

if (process.env.PSBINDADDR !== undefined) {
	Config.bindaddress = process.env.PSBINDADDR;
}
if (process.env.PSPORT !== undefined) {
	const port = parseInt(process.env.PSPORT);
	if (!isNaN(port)) Config.port = port;
}
if (process.env.PSNOSSL !== undefined && parseInt(process.env.PSNOSSL)) {
	Config.ssl = null;
}

process.on('uncaughtException', err => {
	if (Config.crashguard) {
		Monitor.crashlog(err, `Socket process ${cluster.worker.id} (${process.pid})`);
	}
});

const app: http.Server = http.createServer();
let appssl: https.Server | null = null;
if (Config.ssl) {
	let key = '';
	try {
		key = path.resolve(__dirname, Config.ssl.options.key);
		if (!fs.statSync(key).isFile()) throw new Error();

		try {
			key = fs.readFileSync(key, 'utf8');
		} catch (err) {
			Monitor.crashlog(
				new Error(`Failed to read the configured SSL private key PEM File:\n${err.stack}`),
				`Socket process ${cluster.worker.id} (${process.pid})`
			);
		}
	} catch (e) {
		console.warn('SSL private key config values will not support HTTPS server option values in the future. Please set it to use the absolute path of its PEM file.');
		key = Config.ssl.options.key;
	}

	let cert = '';
	try {
		cert = path.resolve(__dirname, Config.ssl.options.cert);
		if (!fs.statSync(cert).isFile()) throw new Error();

		try {
			cert = fs.readFileSync(cert, 'utf8');
		} catch (err) {
			Monitor.crashlog(
				new Error(`Failed to read the configured SSL certificate PEM File:\n${err.stack}`),
				`Socket process ${cluster.worker.id} (${process.pid})`
			);
		}
	} catch (e) {
		console.warn('SSL certificate config values will not support HTTPS server option values in the future. Please set it to use the absolute path of its PEM file.');
		cert = Config.ssl.options.cert;
	}

	if (key && cert) {
		try {
			// In case there are additional SSL config settings besides the
			// private key and certificate...
			appssl = https.createServer({...Config.ssl.options, key, cert});
		} catch (err) {
			Monitor.crashlog(
				new Error(`The SSL settings are misconfigured:\n${err.stack}`),
				`Socket process ${cluster.worker.id} (${process.pid})`
			);
		}
	}
}

// Static HTTP server
//
// This handles the custom CSS and custom avatar features, as well as
// redirecting $host:$port to $host-$port.psim.us.
//
// This is optional if you don't need these features.
if (Config.disablenodestatic) {
	console.log('node-static is disabled.');
} else {
	// @ts-ignore
	import('node-static').then(({Server: StaticServer}) => {
		const roomidRegex = /^\/(?:[A-Za-z0-9][A-Za-z0-9-]*)\/?$/;
		const cssServer = new StaticServer('./config');
		const avatarServer = new StaticServer('./config/avatars');
		const staticServer = new StaticServer('./server/static');
		const staticRequestHandler = (req: http.IncomingMessage, res: http.ServerResponse) => {
			// console.log(`static rq: ${req.socket.remoteAddress}:${req.socket.remotePort} -> ${req.socket.localAddress}:${req.socket.localPort} - ${req.method} ${req.url} ${req.httpVersion} - ${req.rawHeaders.join('|')}`);
			req.resume();
			req.addListener('end', () => {
				if (Config.customhttpresponse && Config.customhttpresponse(req, res)) {
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
					if (e && res.statusCode === 404) {
						staticServer.serveFile('404.html', 404, {}, req, res);
					}
				});
			});
		};

		app.on('request', staticRequestHandler);
		if (appssl !== null) {
			appssl.on('request', staticRequestHandler);
		}
	}).catch(err => {
		Monitor.crashlog(
			new Error(`Failed to start the static server:\n${err.stack}`),
			`Socket process ${cluster.worker.id} (${process.pid})`
		);
	});
}

// SockJS server.
const options = {
	sockjs_url: `//${Config.routes.client}/js/lib/sockjs-1.4.0-nwjsfix.min.js`,
	prefix: '/showdown',
	log(severity: string, message: string) {
		if (severity === 'error') {
			console.warn(`ERROR: ${message}`);
		}
	},
};

if (Config.wsdeflate !== null) {
	// @ts-ignore
	import('permessage-deflate').then(deflate => {
		deflate.configure(Config.wsdeflate);

		Object.defineProperty(options, 'faye_server_options', {
			writable: true,
			configurable: true,
			enumerable: true,
			value: {extensions: [deflate]},
		});
	}).catch(err => {
		Monitor.crashlog(
			new Error(`Failed to configure WebSocket permessage-deflate support:\n${err.stack}`),
			`Socket process ${cluster.worker.id} (${process.pid})`
		);
	});
}

const server = SockJS.createServer(options);
const sockets: Map<SocketID, SockJS.Connection> = new Map();
const rooms: Map<RoomID, Map<SocketID, SockJS.Connection>> = new Map();
const roomChannels: Map<RoomID, Map<SocketID, ChannelID>> = new Map();

function extractChannel(message: string, channelid: -1 | ChannelID) {
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
}

process.on('message', data => {
	// console.log('worker received: ' + data);

	switch (data.charAt(0)) {
		case '$': { // $code
			const query = data.substr(1);
			/* tslint:disable:no-eval */
			eval(data.substr(1));
			/* tslint:enable:no-eval */
			break;
		}

		case '!': { // !socketid
			// destroy
			const socketid = data.substr(1) as SocketID;
			const socket = sockets.get(socketid);
			if (!socket) return;
			socket.destroy();
			sockets.delete(socketid);
			for (const [rid, r] of rooms) {
				r.delete(socketid);

				const rc = roomChannels.get(rid);
				if (rc) rc.delete(socketid);
				if (!r.size) {
					rooms.delete(rid);
					roomChannels.delete(rid);
				}
			}
			break;
		}

		case '>': {
			// >socketid, message
			// message to single connection
			const nlLoc = data.indexOf('\n');
			const socketid = data.substr(1, nlLoc - 1) as SocketID;
			const socket = sockets.get(socketid);
			if (!socket) return;

			const message = data.substr(nlLoc + 1);
			socket.write(message);
			break;
		}

		case '#': {
			// #roomid, message
			// message to all connections in room
			const nlLoc = data.indexOf('\n');
			const roomid = data.substr(1, nlLoc - 1);
			const room = rooms.get(roomid);
			if (!room) return;

			const message = data.substr(nlLoc + 1);
			for (const s of room.values()) {
				s.write(message);
			}
			break;
		}

		case '+': {
			// +roomid, socketid
			// join room with connection
			const nlLoc = data.indexOf('\n');
			const socketid = data.substr(nlLoc + 1) as SocketID;
			const socket = sockets.get(socketid);
			if (!socket) return;

			const roomid = data.substr(1, nlLoc - 1) as RoomID;
			const room = rooms.has(roomid)
				? rooms.get(roomid)
				: rooms.set(roomid, new Map()).get(roomid);
			if (room) room.set(socketid, socket);
			break;
		}

		case '-': {
			// -roomid, socketid
			// leave room with connection
			const nlLoc = data.indexOf('\n');
			const roomid = data.slice(1, nlLoc) as RoomID;
			const room = rooms.get(roomid);
			if (!room) return;

			const socketid = data.slice(nlLoc + 1) as SocketID;
			room.delete(socketid);

			const roomChannel = roomChannels.get(roomid);
			if (roomChannel) roomChannel.delete(socketid);
			if (!room.size) {
				rooms.delete(roomid);
				roomChannels.delete(roomid);
			}
			break;
		}

		case '.': {
			// .roomid, channelid, socketid
			// move connection to different channel in room
			const nlLoc = data.indexOf('\n');
			const roomid = data.slice(1, nlLoc) as RoomID;
			const nlLoc2 = data.indexOf('\n', nlLoc + 1);
			const channelid = Number(data.slice(nlLoc + 1, nlLoc2)) as ChannelID;
			const socketid = data.slice(nlLoc2 + 1) as SocketID;
			const roomChannel = roomChannels.has(roomid)
				? roomChannels.get(roomid)
				: roomChannels.set(roomid, new Map()).get(roomid);

			if (channelid === 0) {
				if (roomChannel) roomChannel.delete(socketid);
			} else {
				if (roomChannel) roomChannel.set(socketid, channelid);
			}
			break;
		}

		case ':': {
			// :roomid, message
			// message to a room, splitting `|split` by channel
			const nlLoc = data.indexOf('\n');
			const roomid = data.slice(1, nlLoc) as RoomID;
			const room = rooms.get(roomid);
			if (!room) return;

			const messages: [string | null, string | null, string | null, string | null, string | null]
				= [null, null, null, null, null];
			const messagesStr = data.substr(nlLoc + 1);
			const roomChannel = roomChannels.get(roomid);
			for (const [sid, s] of room) {
				const channelid = (roomChannel && roomChannel.get(sid)) || 0;
				const message = messages[channelid] === null
					? extractChannel(messagesStr, channelid)
					: messages[channelid];
				if (message !== null) s.write(message);
			}
			break;
		}

		default:
			// Do nothing.
	}
});

const cleanup = () => {
	for (const socket of sockets.values()) {
		try {
			socket.destroy();
		} catch (e) {}
	}
	sockets.clear();
	rooms.clear();
	roomChannels.clear();

	app.close();
	if (appssl !== null) {
		appssl.close();
	}

	// Let the server(s) finish closing.
	setImmediate(() => process.exit(0));
};

process.once('disconnect', cleanup);
process.once('exit', cleanup);

// This is global so it can be hotpatched if necessary.
const isTrustedProxyIp = IPTools.checker(Config.proxyip);
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

	const socketid = String(++socketCounter) as SocketID;
	sockets.set(socketid, socket);

	let socketip = socket.remoteAddress;
	if (isTrustedProxyIp(socketip)) {
		const ips = (socket.headers['x-forwarded-for'] || '')
			.split(',')
			.reverse();
		for (const ip of ips) {
			const proxy = ip.trim();
			if (!isTrustedProxyIp(proxy)) {
				socketip = proxy;
				break;
			}
		}
	}

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
		const pipeIndex = message.indexOf('|');
		if (pipeIndex < 0 || pipeIndex === message.length - 1) return;

		if (process.send) process.send(`<${socketid}\n${message}`);
	});

	socket.once('close', () => {
		if (process.send) process.send(`!${socketid}`);
		sockets.delete(socketid);
		for (const room of rooms.values()) room.delete(socketid);
	});

	if (process.send) process.send(`*${socketid}\n${socketip}\n${socket.protocol}`);
});

server.installHandlers(app, {});
app.listen(Config.port, Config.bindaddress);
console.log(`Worker ${cluster.worker.id} now listening on ${Config.bindaddress}:${Config.port}`);
if (appssl !== null) {
	server.installHandlers(appssl, {});
	appssl.listen(Config.ssl.port, Config.bindaddress);
	console.log(`Worker ${cluster.worker.id} now listening for SSL on port ${Config.ssl.port}`);
}
console.log(`Test your server at http://${Config.bindaddress === '0.0.0.0' ? 'localhost' : Config.bindaddress}:${Config.port}`);

/* tslint:disable:no-eval */
Repl.start(`sockets-${cluster.worker.id}-${process.pid}`, cmd => eval(cmd));
/* tslint:enable:no-eval */
