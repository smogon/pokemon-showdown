/**
 * Connections
 * Pokemon Showdown - http://pokemonshowdown.com/
 *
 * Abstraction layer for multi-process SockJS connections.
 *
 * This file handles all the communications between the networking processes
 * and users.js.
 *
 * @license MIT license
 */

'use strict';

const child_process = require('child_process');
const cluster = require('cluster');
const EventEmitter = require('events');
const path = require('path');

if (cluster.isMaster) {
	cluster.setupMaster({
		exec: path.resolve(__dirname, 'sockets-workers'),
	});
}

/**
 * IPC delimiter byte. This byte must stringify as a hexadeimal
 * escape code when stringified as JSON to prevent messages from being able to
 * contain the byte itself.
 *
 * @type {string}
 */
const DELIM = '\x03';

/**
 * Map of worker IDs to worker wrappers.
 * 
 * @type {Map<number, any>}
 */
const workers = new Map();

/**
 * A wrapper class for native Node.js Worker and GoWorker
 * instances. This parses upstream messages from both types of workers and
 * cleans up when workers crash or get killed before respawning them. In other
 * words this listens for events emitted from both types of workers and handles
 * them accordingly.
 */
class WorkerWrapper {
	/**
	 * @param {any} worker
	 * @param {number} id
	 */
	constructor(worker, id) {
		/** @type {any} */
		this.worker = worker;
		/** @type {number} */
		this.id = id;
		/** @type {function(string): boolean} */
		this.isTrustedProxyIp = Dnsbl.checker(Config.proxyip);
		/** @type {?Error} */
		this.error = null;

		worker.once('listening', () => this.onListen());
		worker.on('message', /** @param {string} data */ data => this.onMessage(data));
		worker.once('error', /** @param {?Error} err */ err => this.onError(err));
		worker.once('exit',
			/**
			 * @param {any} worker
			 * @param {?number} code
			 * @param {?string} status
			 */
			(worker, code, status) => this.onExit(worker, code, status)
		);
	}

	/**
	 * Worker process getter
	 *
	 * @return {any}
	 */
	get process() {
		return this.worker.process;
	}

	/**
	 * Worker exitedAfterDisconnect getter
	 *
	 * @return {boolean | void}
	 */
	get exitedAfterDisconnect() {
		return this.worker.exitedAfterDisconnect;
	}

	/**
	 * Worker suicide getter
	 *
	 * @return {boolean | void}
	 */
	get suicide() {
		return this.worker.exitedAfterDisconnect;
	}

	/**
	 * Worker#disconnect wrapper
	 *
	 */
	disconnect() {
		return this.worker.disconnect();
	}

	/**
	 * Worker#kill wrapper
	 *
	 * @param {string=} signal
	 */
	kill(signal) {
		return this.worker.kill(signal);
	}

	/**
	 * Worker#destroy wrapper
	 *
	 * @param {string=} signal
	 */
	destroy(signal) {
		return this.worker.kill(signal);
	}

	/**
	 * Worker#send wrapper
	 *
	 * @param {string} message
	 * @return {boolean}
	 */
	send(message) {
		return this.worker.send(message);
	}

	/**
	 * Worker#isConnected wrapper
	 *
	 * @return {boolean}
	 */
	isConnected() {
		return this.worker.isConnected();
	}

	/**
	 * Worker#isDead wrapper
	 *
	 * @return {boolean}
	 */
	isDead() {
		return this.worker.isDead();
	}

	/**
	 * 'listening' event handler for the worker. Logs which
	 * hostname and worker ID is listening to console.
	 */
	onListen() {
		console.log(`Worker ${this.id} now listening on ${Config.bindaddress}:${Config.port}`);
		if (Config.ssl) console.log(`Worker ${this.id} now listening for SSL on port ${Config.ssl.port}`);
		console.log(`Test your server at http://${Config.bindaddress === '0.0.0.0' ? 'localhost' : Config.bindaddress}:${Config.port}`);
	}

	/**
	 * 'message' event handler for the worker. Parses which type
	 * of command the incoming IPC message is calling, then passes its
	 * parametres to the appropriate method to handle.
	 *
	 * @param {string} data
	 */
	onMessage(data) {
		// console.log(`master received: ${data}`);
		let token = data.charAt(0);
		let params = data.substr(1);
		switch (token) {
		case '*':
			this.onSocketConnect(params);
			break;
		case '!':
			this.onSocketDisconnect(params);
			break;
		case '<':
			this.onSocketReceive(params);
			break;
		default:
			console.error(`Sockets: received unknown IPC message with token ${token}: ${params}`);
			break;
		}
	}

	/**
	 * Socket connection message handler.
	 *
	 * @param {string} params
	 */
	onSocketConnect(params) {
		let [socketid, ip, header, protocol] = params.split('\n');

		if (this.isTrustedProxyIp(ip)) {
			let ips = header.split(',');
			for (let i = ips.length; i--;) {
				let proxy = ips[i].trim();
				if (proxy && !this.isTrustedProxyIp(proxy)) {
					ip = proxy;
					break;
				}
			}
		}

		Users.socketConnect(this, this.id, socketid, ip, protocol);
	}

	/**
	 * Socket disconnect handler.
	 *
	 * @param {string} socketid
	 */
	onSocketDisconnect(socketid) {
		Users.socketDisconnect(this, this.id, socketid);
	}

	/**
	 * Socket message receive handler.
	 *
	 * @param {string} params
	 */
	onSocketReceive(params) {
		let idx = params.indexOf('\n');
		let socketid = params.substr(0, idx);
		let message = params.substr(idx + 1);
		Users.socketReceive(this, this.id, socketid, message);
	}

	/**
	 * Worker 'error' event handler.
	 *
	 * @param {?Error} err
	 */
	onError(err) {
		this.error = err;
	}

	/**
	 * Worker 'exit' event handler.
	 *
	 * @param {any} worker
	 * @param {?number} code
	 * @param {?string} signal
	 */
	onExit(worker, code, signal) {
		if (code === null && signal !== null) {
			// Worker was killed by Sockets.killWorker or Sockets.killPid.
			console.warn(`Worker ${this.id} was forcibly killed with the signal ${signal}`);
			workers.delete(worker.id);
		} else if (code === 0 && signal === null) {
			console.warn(`Worker ${this.id} died, but returned a successful exit code.`);
			workers.delete(worker.id);
		} else if (code !== null && code > 0) {
			// Worker crashed.
			if (this.error) {
				require('./crashlogger')(new Error(`Worker ${this.id} abruptly died with the following stack trace: ${this.error.stack}`), 'The main process');
			} else {
				require('./crashlogger')(new Error(`Worker ${this.id} abruptly died`), 'The main process');
			}
			// Don't delete the worker - keep it for inspection.
		}

		if (this.isConnected()) this.disconnect();
		// FIXME: this is a bad hack to get around a race condition in
		// Connection#onDiscconnect sending room deinit messages after already
		// having removed the sockets from their channels.
		// @ts-ignore
		this.send = () => {};

		let count = Users.socketDisconnectAll(this);
		console.log(`${count} connections were lost.`);

		spawnWorker();
	}
}

/**
 * A mock Worker class for Go child processes. Similarly to
 * Node.js workers, it uses a TCP net server to perform IPC. After launching
 * the server, it will spawn the Go child process and wait for it to make a
 * connection to the worker's server before performing IPC with it.
 */
class GoWorker extends EventEmitter {
	/**
	 * @param {number} id
	 */
	constructor(id) {
		super();

		/** @type {number} */
		this.id = id;
		/** @type {boolean | void} */
		this.exitedAfterDisconnect = undefined;

		/** @type {string} */
		this.ibuf = '';
		/** @type {?Error} */
		this.error = null;

		/** @type {any} */
		this.process = null;
		/** @type {any} */
		this.connection = null;
		/** @type {any} */
		this.server = require('net').createServer();
		this.server.once('connection', /** @param {any} connection */ connection => this.onChildConnect(connection));
		this.server.on('error', () => {});
		this.server.listen(() => process.nextTick(() => this.spawnChild()));
	}

	/**
	 * Worker#disconnect mock
	 */
	disconnect() {
		if (this.isConnected()) this.connection.destroy();
	}

	/**
	 * Worker#kill mock
	 *
	 * @param {string} [signal = 'SIGTERM']
	 */
	kill(signal = 'SIGTERM') {
		if (this.process) this.process.kill(signal);
	}

	/**
	 * Worker#destroy mock
	 *
	 * @param {string=} signal
	 */
	destroy(signal) {
		return this.kill(signal);
	}

	/**
	 * Worker#send mock
	 *
	 * @param {string} message
	 * @return {boolean}
	 */
	send(message) {
		if (!this.isConnected()) return false;
		return this.connection.write(JSON.stringify(message) + DELIM);
	}

	/**
	 * Worker#isConnected mock
	 *
	 * @return {boolean}
	 */
	isConnected() {
		return this.connection && !this.connection.destroyed;
	}

	/**
	 * Worker#isDead mock
	 *
	 * @return {boolean}
	 */
	isDead() {
		return this.process && (this.process.exitCode !== null || this.process.statusCode !== null);
	}

	/**
	 * Spawns the Go child process. Once the process has started, it will make
	 * a connection to the worker's TCP server.
	 */
	spawnChild() {
		const GOPATH = child_process.execSync('go env GOPATH', {stdio: null, encoding: 'utf8'})
			.trim()
			.split(path.delimiter)[0]
			.replace(/^"(.*)"$/, '$1');

		this.process = child_process.spawn(
			path.resolve(GOPATH, 'bin/sockets'), [], {
				env: {
					PS_IPC_PORT: `:${this.server.address().port}`,
					PS_CONFIG: JSON.stringify({
						workers: Config.workers || 1,
						port: `:${Config.port || 8000}`,
						bindAddress: Config.bindaddress || '0.0.0.0',
						ssl: Config.ssl ? Object.assign({}, Config.ssl, {port: `:${Config.ssl.port}`}) : null,
					}),
				},
				stdio: ['inherit', 'inherit', 'pipe'],
			}
		);

		this.process.once('exit', /** @param {any[]} args */ (...args) => {
			// Clean up the IPC server.
			this.server.close(() => {
				// @ts-ignore
				if (this.server._eventsCount <= 2) {
					// The child process died before ever opening the IPC
					// connection and sending any messages over it. Let's avoid
					// getting trapped in an endless loop of respawns and crashes
					// if it crashed.
					if (this.error) throw this.error;
				}

				this.emit('exit', this, ...args);
			});
		});

		this.process.stderr.setEncoding('utf8');
		this.process.stderr.once('data', /** @param {string} data */ data => {
			this.error = new Error(data);
			this.emit('error', this.error);
		});
	}

	/**
	 * 'connection' event handler for the TCP server. Begins the parsing of
	 * incoming IPC messages.
	 * @param {any} connection
	 */
	onChildConnect(connection) {
		this.connection = connection;
		this.connection.setEncoding('utf8');
		this.connection.on('data', /** @param {string} data */ data => {
			let idx = data.lastIndexOf(DELIM);
			if (idx < 0) {
				this.ibuf += data;
				return;
			}

			let messages = '';
			if (this.ibuf) {
				messages += this.ibuf.slice(0);
				this.ibuf = '';
			}

			if (idx === data.length - 1) {
				messages += data.slice(0, -1);
			} else {
				messages += data.slice(0, idx);
				this.ibuf += data.slice(idx + 1);
			}

			for (let message of messages.split(DELIM)) {
				this.emit('message', JSON.parse(message));
			}
		});
		this.connection.on('error', () => {});

		process.nextTick(() => this.emit('listening'));
	}
}

/**
 * Worker ID counter. We don't use cluster's internal counter so
 * Config.golang can be freely changed while the server is still running.
 *
 * @type {number}
 */
let nextWorkerid = 1;

/**
 * Config.golang cache. Checked when spawning new workers to
 * ensure that Node and Go workers will not try to run at the same time.
 *
 * @type {boolean}
 */
let golangCache = !!Config.golang;

/**
 * Spawns a new worker.
 *
 * @return {WorkerWrapper}
 */
function spawnWorker() {
	if (golangCache === !Config.golang) {
		// Config settings were changed. Make sure none of the wrong kind of
		// worker is already listening.
		let workerType = Config.golang ? GoWorker : cluster.Worker;
		for (let [workerid, worker] of workers) {
			if (worker.isConnected() && !(worker.worker instanceof workerType)) {
				let oldType = golangCache ? 'Go' : 'Node';
				let newType = Config.golang ? 'Go' : 'Node';
				throw new Error(
					`Sockets: worker of ID ${workerid} is a ${oldType} worker, but config was changed to spawn ${newType} ones!
					Set Config.golang back to ${golangCache} or kill all active workers before attempting to spawn more.`
				);
			}
		}
		golangCache = !!Config.golang;
	} else if (golangCache) {
		// Prevent spawning multiple Go child processes by accident.
		for (let [workerid, worker] of workers) { // eslint-disable-line no-unused-vars
			if (worker.isConnected() && worker.worker instanceof GoWorker) {
				throw new Error('Sockets: multiple Go child processes cannot be spawned!');
			}
		}
	}

	let worker;
	if (golangCache) {
		worker = new GoWorker(nextWorkerid);
	} else {
		worker = cluster.fork({
			PSPORT: Config.port,
			PSBINDADDR: Config.bindaddress || '0.0.0.0',
			PSNOSSL: Config.ssl ? 0 : 1,
		});
	}

	let wrapper = new WorkerWrapper(worker, nextWorkerid++);
	workers.set(wrapper.id, wrapper);
	return wrapper;
}

/**
 * Initializes the configured number of worker processes.
 *
 * @param {any} port
 * @param {any} bindAddress
 * @param {any} workerCount
 */
function listen(port, bindAddress, workerCount) {
	if (port !== undefined && !isNaN(port)) {
		Config.port = port;
		Config.ssl = null;
	} else {
		port = Config.port;
		// Autoconfigure the app when running in cloud hosting environments:
		try {
			const cloudenv = require('cloud-env');
			bindAddress = cloudenv.get('IP', bindAddress);
			port = cloudenv.get('PORT', port);
		} catch (e) {}
	}
	if (bindAddress !== undefined) {
		Config.bindaddress = bindAddress;
	}

	// Go only uses one child process since it does not share FD handles for
	// serving like Node.js workers do. Workers are instead used to limit the
	// number of concurrent requests that can be handled at once in the child
	// process.
	if (golangCache) {
		spawnWorker();
		return;
	}

	if (workerCount === undefined) {
		workerCount = (Config.workers !== undefined ? Config.workers : 1);
	}
	for (let i = 0; i < workerCount; i++) {
		spawnWorker();
	}
}

/**
 * Kills a worker process using the given worker object.
 *
 * @param {WorkerWrapper} worker
 * @return {number}
 */
function killWorker(worker) {
	let count = Users.socketDisconnectAll(worker);
	console.log(`${count} connections were lost.`);
	try {
		worker.kill('SIGTERM');
	} catch (e) {}
	workers.delete(worker.id);
	return count;
}

/**
 * Kills a worker process using the given worker PID.
 *
 * @param {number} pid
 * @return {number | false}
 */
function killPid(pid) {
	for (let [workerid, worker] of workers) { // eslint-disable-line no-unused-vars
		if (pid === worker.process.pid) {
			return killWorker(worker);
		}
	}
	return false;
}

/**
 * Sends a message to a socket in a given worker by ID.
 *
 * @param {WorkerWrapper} worker
 * @param {string} socketid
 * @param {string} message
 */
function socketSend(worker, socketid, message) {
	worker.send(`>${socketid}\n${message}`);
}

/**
 * Forcefully disconnects a socket in a given worker by ID.
 *
 * @param {WorkerWrapper} worker
 * @param {string} socketid
 */
function socketDisconnect(worker, socketid) {
	worker.send(`!${socketid}`);
}

/**
 * Broadcasts a message to all sockets in a given channel across
 * all workers.
 *
 * @param {string} channelid
 * @param {string} message
 */
function channelBroadcast(channelid, message) {
	workers.forEach(worker => {
		worker.send(`#${channelid}\n${message}`);
	});
}

/**
 * Broadcasts a message to all sockets in a given channel and a
 * given worker.
 *
 * @param {WorkerWrapper} worker
 * @param {string} channelid
 * @param {string} message
 */
function channelSend(worker, channelid, message) {
	worker.send(`#${channelid}\n${message}`);
}

/**
 * Adds a socket to a given channel in a given worker by ID.
 *
 * @param {WorkerWrapper} worker
 * @param {string} channelid
 * @param {string} socketid
 */
function channelAdd(worker, channelid, socketid) {
	worker.send(`+${channelid}\n${socketid}`);
}

/**
 * Removes a socket from a given channel in a given worker by ID.
 *
 * @param {WorkerWrapper} worker
 * @param {string} channelid
 * @param {string} socketid
 */
function channelRemove(worker, channelid, socketid) {
	worker.send(`-${channelid}\n${socketid}`);
}

/**
 * Broadcasts a message to be demuxed into three separate messages
 * across three subchannels in a given channel across all workers.
 *
 * @param {string} channelid
 * @param {string} message
 */
function subchannelBroadcast(channelid, message) {
	workers.forEach(worker => {
		worker.send(`:${channelid}\n${message}`);
	});
}

/**
 * Moves a given socket to a different subchannel in a channel by
 * ID in the given worker.
 *
 * @param {WorkerWrapper} worker
 * @param {string} channelid
 * @param {string} subchannelid
 * @param {string} socketid
 */
function subchannelMove(worker, channelid, subchannelid, socketid) {
	worker.send(`.${channelid}\n${subchannelid}\n${socketid}`);
}

module.exports = {
	WorkerWrapper,
	GoWorker,

	workers,
	spawnWorker,
	listen,
	killWorker,
	killPid,

	socketSend,
	socketDisconnect,
	channelBroadcast,
	channelSend,
	channelAdd,
	channelRemove,
	subchannelBroadcast,
	subchannelMove,
};