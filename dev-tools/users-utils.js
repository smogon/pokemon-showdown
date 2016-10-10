'use strict';

function createConnection(ip, workerid, socketid) {
	if (!workerid) {
		Sockets.spawnMockWorker();
		workerid = 1;
	}

	if (!socketid) {
		socketid = 1;
		while (Users.connections.has('' + workerid + '-' + socketid)) {
			socketid++;
		}
	}

	let connectionid = '' + workerid + '-' + socketid;
	let connection = new Users.Connection(connectionid, workerid, socketid, null, ip || '127.0.0.1');
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
