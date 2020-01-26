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
					let userid = user.id;
					assert.strictEqual(Users.users.has(userid), true, 'before disconnecting');
					user.disconnectAll();
					user.destroy();
					assert.strictEqual(Users.users.has(userid), false, 'after disconnecting');
				});
			});

			describe('#joinRoom', function () {
				let room;
				beforeEach(function () {
					this.connection = new Connection('127.0.0.1');
				});

				afterEach(function () {
					this.connection.destroy();
					if (room) room.destroy();
				});

				it('should join a room if not already present', function () {
					room = Rooms.createChatRoom('test');
					this.connection.joinRoom(Rooms.get('test'));
					assert.ok(this.connection.inRooms.has('test'));
				});
			});

			describe('#leaveRoom', function () {
				let room;
				afterEach(function () {
					if (room) room.destroy();
				});
				it('should leave a room that is present', function () {
					this.connection = new Connection('127.0.0.1');
					room = Rooms.createChatRoom('test');
					this.connection.joinRoom(room);
					this.connection.leaveRoom(room);
					assert.ok(!this.connection.inRooms.has('test'));
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

			describe('#can', function () {
				let room;
				afterEach(function () {
					for (const user of Users.users.values()) {
						user.disconnectAll();
						user.destroy();
					}
					if (room) {
						if (room) room.destroy();
					}
				});
				it(`should allow 's' permissions only on self`, function () {
					const user = new User();
					user.group = '+';
					assert.strictEqual(user.can('alts', user), true, 'targeting self');

					const target = new User();
					target.group = ' ';
					assert.strictEqual(user.can('alts', target), false, 'targeting lower rank');
					target.group = '+';
					assert.strictEqual(user.can('alts', target), false, 'targeting same rank');
					target.group = '%';
					assert.strictEqual(user.can('alts', target), false, 'targeting higher rank');
				});
				it(`should allow 'u' permissions on lower ranked users`, function () {
					const user = new User();
					user.group = '&';
					assert.strictEqual(user.can('promote', user), false, 'targeting self');

					const target = new User();
					target.group = ' ';
					assert.strictEqual(user.can('promote', target), true, 'targeting lower rank');
					target.group = '&';
					assert.strictEqual(user.can('promote', target), false, 'targeting same rank');
					target.group = '~';
					assert.strictEqual(user.can('promote', target), false, 'targeting higher rank');
				});
				it(`should not allow users to demote themselves`, function () {
					room = Rooms.createChatRoom("test");
					if (!room.auth) room.auth = {};
					const user = new User();
					user.forceRename("User", true);
					user.joinRoom(room);
					for (const group of [' ', '+', '@']) {
						room.auth[user.id] = group;
						assert.strictEqual(room.getAuth(user), group, 'before demotion attempt');
						Chat.parse("/roomdeauth User", room, user, user.connections[0]);
						assert.strictEqual(room.getAuth(user), group, 'after demotion attempt');
					}
				});
			});
		});
	});
});
