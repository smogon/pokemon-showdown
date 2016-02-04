'use strict';

let EventEmitter = require('events').EventEmitter;

function createWorker() {
	let fakeWorker = new EventEmitter();
	fakeWorker.send = function () {};
	fakeWorker.process = {connected: true};
	Sockets.workers[fakeWorker.id] = fakeWorker;
	return fakeWorker;
}

function createConnection(ip, workerid, socketid) {
	if (!workerid || !socketid) {
		workerid = Object.keys(Sockets.workers)[0];
		if (!workerid) workerid = createWorker().id;
		socketid = 1;
		while (Users.connections.has(workerid + '-' + socketid)) {
			socketid++;
		}
	}
	let connectionid = workerid + '-' + socketid;
	let connection = new Users.Connection(connectionid, Sockets.workers[workerid], socketid, null, ip || '127.0.0.1');
	Users.connections.set(connectionid, connection);
	return connection;
}

function createUser(connection) {
	if (!connection) connection = createConnection();
	let user = new Users.User(connection);
	connection.user = user;
	user.joinRoom('global', connection);
	return user;
}

exports.Connection = createConnection;
exports.User = createUser;
