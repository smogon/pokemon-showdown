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
import * as path from 'path';

cluster.setupMaster({
	exec: path.resolve(__dirname, 'sockets-child'),
});

export const workers: Map<number, cluster.Worker> = new Map();

export function spawnWorker(): cluster.Worker {
	const worker = cluster.fork({
		PSBINDADDR: Config.bindaddress || '0.0.0.0',
		PSPORT: Config.port,
		PSNOSSL: Config.ssl ? 0 : 1,
	});
	const id = worker.id;

	workers.set(id, worker);

	worker.on('message', data => {
		switch (data.charAt(0)) {
		case '*': {
			// *socketid, ip, protocol
			// connect
			const [socketid, ip, protocol] = data.substr(1).split('\n');
			Users.socketConnect(worker, id, socketid as SocketID, ip, protocol);
			break;
		}
		case '!': {
			// !socketid
			// disconnect
			const socketid = data.substr(1);
			Users.socketDisconnect(worker, id, socketid as SocketID);
			break;
		}
		case '<': {
			// <socketid, message
			// message
			const idx = data.indexOf('\n');
			const socketid = data.substr(1, idx - 1);
			const message = data.substr(idx + 1);
			Users.socketReceive(worker, id, socketid as SocketID, message);
			break;
		}
		default:
			// unhandled
		}
	});

	return worker;
}

cluster.on('exit', (worker, code, signal) => {
	if (code === null && signal !== null) {
		// Worker was killed by Sockets.killWorker or Sockets.killPid,
		// probably.
		console.log(`Worker ${worker.id} was forcibly killed with status ${signal}.`);
		workers.delete(worker.id);
		if (worker.isConnected()) {
			worker.disconnect();
		}
	} else if (code === 0 && signal === null) {
		// Happens when killing PS with ^C.
		workers.delete(worker.id);
		if (worker.isConnected()) {
			worker.disconnect();
		}
	} else {
		// Worker died abnormally, likely because of a crash.
		Monitor.crashlog(
			new Error(`Worker ${worker.id} abruptly died with code ${code} and signal ${signal}.`),
			"The main process"
		);
	}

	// FIXME: this is a bad hack to get around a race condition in
	// Connection#onDisconnect, where it would send room deinit messages
	// after already having removed the sockets from their rooms.
	worker.send = (
		message: any,
		sendHandle?: any,
		callback?: ((error: Error | null) => void) | undefined
	): boolean => false;

	const count = Array.from(Users.connections.values()).reduce((total, connection) => {
		if (connection.worker !== worker) {
			return total;
		}

		Users.socketDisconnect(worker, worker.id, connection.socketid);
		return total + 1;
	}, 0);
	console.log(`${count} connections were lost.`);

	// Attempt to recover.
	spawnWorker();
});

export function listen(
	port: number | undefined,
	bindAddress: string | undefined,
	workerCount: number | undefined
) {
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
	if (port !== undefined) {
		Config.port = port;
	}
	if (workerCount === undefined) {
		workerCount = Config.workers === undefined ? 1 : (Config.workers as number);
		workerCount = isNaN(workerCount) ? 0 : workerCount;
	}

	for (let i = 0; i < workerCount; i++) {
		spawnWorker();
	}
}

export function killWorker(worker: cluster.Worker): number {
	const count = Array.from(Users.connections.values()).reduce((total, connection) => {
		if (connection.worker !== worker) {
			return total;
		}

		Users.socketDisconnect(worker, worker.id, connection.socketid);
		return total + 1;
	}, 0);
	console.log(`${count} connections were lost.`);

	try {
		worker.kill();
	} catch (e) {}

	return count;
}

export function killPid(pid: number): number {
	for (const worker of workers.values()) {
		if (pid === worker.process.pid) {
			return killWorker(worker);
		}
	}

	return 0;
}

export function socketSend(worker: cluster.Worker, socketid: SocketID, message: string) {
	worker.send(`>${socketid}\n${message}`);
}

export function socketDisconnect(worker: cluster.Worker, socketid: SocketID) {
	worker.send(`!${socketid}`);
}

export function roomBroadcast(roomid: RoomID, message: string) {
	for (const worker of workers.values()) {
		worker.send(`#${roomid}\n${message}`);
	}
}

export function roomAdd(worker: cluster.Worker, roomid: RoomID, socketid: SocketID) {
	worker.send(`+${roomid}\n${socketid}`);
}

export function roomRemove(worker: cluster.Worker, roomid: RoomID, socketid: string) {
	worker.send(`-${roomid}\n${socketid}`);
}

export function channelBroadcast(roomid: RoomID, message: string) {
	for (const worker of workers.values()) {
		worker.send(`:${roomid}\n${message}`);
	}
}

export function channelMove(worker: cluster.Worker, roomid: RoomID, channelid: ChannelID, socketid: string) {
	worker.send(`.${roomid}\n${channelid}\n${socketid}`);
}

export function evalFromWorker(worker: cluster.Worker, query: string) {
	worker.send(`$${query}`);
}
