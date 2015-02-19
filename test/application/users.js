var assert = require('assert');
function createConnection (ip, workerid, socketid) {
	if (!workerid || !socketid) {
		workerid = Object.keys(Sockets.workers)[0];
		socketid = 1;
		while (Users.connections[workerid + '-' + socketid]) {
			socketid++;
		}
	}
	var connectionid = workerid + '-' + socketid;
	var connection = Users.connections[connectionid] = new Users.Connection(connectionid, Sockets.workers[workerid], socketid, null, ip || '127.0.0.1');
	return connection;
}

function createUser (connection) {
	if (!connection) connection = createConnection();
	var user = new Users.User(connection);
	connection.user = user;
	user.joinRoom('global', connection);
	return user;
}

describe('Users features', function () {
	describe('Users', function () {
		describe('get', function () {
			it('should be a function', function () {
				assert.strictEqual(typeof Users.get, 'function');
			});

			it('should be equal to `Users`', function () {
				assert.strictEqual(Users.get, Users);
			});
		});
		describe('users', function () {
			it('should have null prototype', function () {
				assert.strictEqual(Object.getPrototypeOf(Users.users), null);
			});

			it('should not have a native `constructor`', function () {
				assert.ok(Users.users.constructor === undefined || Users.users.constructor instanceof Users.User);
			});
		});
		describe('User', function () {
			describe('#disconnectAll', function () {
				[1, 2].forEach(function (totalConnections) {
					it('should drop all ' + totalConnections + ' connection(s) and mark as inactive', function () {
						var user = createUser();
						var iterations = totalConnections;
						while (--iterations) user.merge(createConnection());

						user.disconnectAll();
						assert.strictEqual(user.connections.length, 0);
						assert.strictEqual(user.connected, false);
					});

					it('should unref all ' + totalConnections + ' connection(s)', function () {
						var user = createUser();
						var iterations = totalConnections;
						while (--iterations) user.merge(createConnection());

						var connections = user.connections.slice();

						user.disconnectAll();
						for (var i = 0; i < totalConnections; i++) {
							assert.strictEqual(Users.connections[connections[i].id], undefined);
						}
					});

					it('should clear `user` property for all ' + totalConnections + ' connection(s)', function () {
						var user = createUser();
						var iterations = totalConnections;
						while (--iterations) user.merge(createConnection());
						var connections = user.connections.slice();

						user.disconnectAll();
						for (var i = 0; i < totalConnections; i++) {
							assert.strictEqual(connections[i].user, null);
						}
					});
				});
			});
			describe('#ban', function () {
				afterEach(function () {
					for (var ip in Users.bannedIps) {
						delete Users.bannedIps[ip];
					}
				});

				it('should disconnect every user at that IP', function () {
					var users = ['127.0.0.1', '127.0.0.1'].map(function (ip) {return createUser(createConnection(ip));});
					users[0].ban();
					assert.strictEqual(users[0].connected, false);
					assert.strictEqual(users[1].connected, false);
				});

				it('should not disconnect users at other IPs', function () {
					var users = ['127.0.0.1', '127.0.0.2'].map(function (ip) {return createUser(createConnection(ip));});
					users[0].ban();
					assert.strictEqual(users[1].connected, true);
				});

				it('should update IP count properly', function () {
					var user = createUser();
					user.ban();
					for (var ip in user.ips) {
						assert.strictEqual(user.ips[ip], 0);
					}
				});
			});
		});
	});
});
