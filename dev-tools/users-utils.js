'use strict';

let EventEmitter = require('events').EventEmitter;

function createWorker() {
	let fakeWorker = new EventEmitter();
	fakeWorker.id = 1;
	fakeWorker.send = function () {};
	fakeWorker.process = {connected: true};
	Sockets.workers[fakeWorker.id] = fakeWorker;
	return fakeWorker;
}

function createConnection(ip, workerid, socketid) {
	let worker;
	if (workerid) {
		worker = Sockets.workers[workerid];
	} else {
		worker = createWorker();
		workerid = worker.id;
	}

	if (!socketid) {
		socketid = 1;
		while (Users.connections.has('' + workerid + '-' + socketid)) {
			socketid++;
		}
	}

	let connectionid = '' + workerid + '-' + socketid;
	let connection = new Users.Connection(connectionid, worker, socketid, null, ip || '127.0.0.1');
	Users.connections.set(connectionid, connection);

	return connection;
}

function createUser(connection) {
	if (!connection) connection = createConnection();

	let user = new Users.User(connection);
	user.joinRoom('global', connection);
	connection.user = user;

	return user;
}

exports.Connection = createConnection;
exports.User = createUser;
