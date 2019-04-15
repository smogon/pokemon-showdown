'use strict';

const assert = require('assert');

let userUtils = require('../users-utils');
let Connection = userUtils.Connection;
let User = userUtils.User;

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
		describe('connections', function () {
			it('should be a Map', function () {
				assert.ok(Users.connections instanceof Map);
			});
		});
		describe('users', function () {
			it('should be a Map', function () {
				assert.ok(Users.users instanceof Map);
			});
		});
		describe('Connection', function () {
			describe('#onDisconnect', function () {
				beforeEach(function () {
					this.connection = new Connection('127.0.0.1');
				});

				it('should remove the connection from Users.connections', function () {
					let connectionid = this.connection.id;
					this.connection.destroy();
					assert.strictEqual(Users.connections.has(connectionid), false);
				});

				it('should destroy any user on the connection as well', function () {
					let user = new User(this.connection);
					let {userid} = user;
					user.disconnectAll();
					user.destroy();
					assert.strictEqual(Users.users.has(userid), false);
				});
			});

			describe('#joinRoom', function () {
				beforeEach(function () {
					this.connection = new Connection('127.0.0.1');
				});

				afterEach(function () {
					this.connection.destroy();
				});

				it('should join a room if not already present', function () {
					this.connection.joinRoom(Rooms.lobby);
					assert.ok(this.connection.inRooms.has('lobby'));
				});
			});

			describe('#leaveRoom', function () {
				it('should leave a room that is present', function () {
					this.connection = new Connection('127.0.0.1');
					this.connection.joinRoom(Rooms.lobby);
					this.connection.leaveRoom(Rooms.lobby);
					assert.ok(!this.connection.inRooms.has('lobby'));
				});
			});
		});
		describe('User', function () {
			describe('#disconnectAll', function () {
				for (let totalConnections of [1, 2]) {
					it('should drop all ' + totalConnections + ' connection(s) and mark as inactive', function () {
						let user = new User();
						let iterations = totalConnections;
						while (--iterations) user.mergeConnection(new Connection());

						user.disconnectAll();
						assert.strictEqual(user.connections.length, 0);
						assert.strictEqual(user.connected, false);
					});

					it('should unref all ' + totalConnections + ' connection(s)', function () {
						let user = new User();
						let iterations = totalConnections;
						while (--iterations) user.mergeConnection(new Connection());

						let connections = user.connections.slice();

						user.disconnectAll();
						for (let i = 0; i < totalConnections; i++) {
							assert.ok(!Users.connections.has(connections[i].id));
						}
					});

					it('should clear `user` property for all ' + totalConnections + ' connection(s)', function () {
						let user = new User();
						let iterations = totalConnections;
						while (--iterations) user.mergeConnection(new Connection());
						let connections = user.connections.slice();

						user.disconnectAll();
						for (let i = 0; i < totalConnections; i++) {
							assert.strictEqual(connections[i].user, null);
						}
					});
				}
			});
			describe('#ban', function () {
				afterEach(function () {
					for (let ip in Users.bannedIps) {
						delete Users.bannedIps[ip];
					}
				});

				it('should disconnect every user at that IP', function () {
					Punishments.sharedIps = new Map();
					let users = ['127.0.0.1', '127.0.0.1'].map(ip => new User(new Connection(ip)));
					Punishments.ban(users[0]);
					assert.strictEqual(users[0].connected, false);
					assert.strictEqual(users[1].connected, false);
				});

				it('should not disconnect users at other IPs', function () {
					let users = ['127.0.0.1', '127.0.0.2'].map(ip => new User(new Connection(ip)));
					Punishments.ban(users[0]);
					assert.strictEqual(users[1].connected, true);
				});

				it('should update IP count properly', function () {
					let user = new User();
					Punishments.ban(user);
					for (let ip in user.ips) {
						assert.strictEqual(user.ips[ip], 0);
					}
				});
			});
		});
	});
});
