'use strict';

const assert = require('assert').strict;

const { makeUser, makeConnection } = require('../users-utils');

describe('Users features', () => {
	describe('Users', () => {
		describe('get', () => {
			it('should be a function', () => {
				assert.equal(typeof Users.get, 'function');
			});
		});
		describe('connections', () => {
			it('should be a Map', () => {
				assert(Users.connections instanceof Map);
			});
		});
		describe('users', () => {
			it('should be a Map', () => {
				assert(Users.users instanceof Map);
			});
		});
		describe('Connection', () => {
			describe('#onDisconnect', () => {
				beforeEach(function () {
					this.connection = makeConnection('127.0.0.1');
				});

				it('should remove the connection from Users.connections', function () {
					const connectionid = this.connection.id;
					this.connection.destroy();
					assert.equal(Users.connections.has(connectionid), false);
				});

				it('should destroy any user on the connection as well', function () {
					const user = makeUser('', this.connection);
					const userid = user.id;
					assert.equal(Users.users.has(userid), true, 'before disconnecting');
					user.disconnectAll();
					user.destroy();
					assert.equal(Users.users.has(userid), false, 'after disconnecting');
				});
			});

			describe('#joinRoom', () => {
				let room, connection;
				beforeEach(() => {
					connection = makeConnection('127.0.0.1');
				});

				afterEach(() => {
					connection.destroy();
					if (room) room.destroy();
				});

				it('should join a room if not already present', () => {
					room = Rooms.createChatRoom('test');
					connection.joinRoom(Rooms.get('test'));
					assert(connection.inRooms.has('test'));
				});
			});

			describe('#leaveRoom', () => {
				let room;
				afterEach(() => {
					if (room) room.destroy();
				});
				it('should leave a room that is present', function () {
					this.connection = makeConnection('127.0.0.1');
					room = Rooms.createChatRoom('test');
					this.connection.joinRoom(room);
					this.connection.leaveRoom(room);
					assert(!this.connection.inRooms.has('test'));
				});
			});
		});
		describe('User', () => {
			it('should store IP addresses after disconnect', () => {
				const conn = makeConnection('127.0.0.1');
				const user = makeUser('', conn);
				assert.deepEqual(['127.0.0.1'], user.ips);
				user.onDisconnect(conn);
				assert.deepEqual(['127.0.0.1'], user.ips);
			});

			describe('#disconnectAll', () => {
				for (const totalConnections of [1, 2]) {
					it('should drop all ' + totalConnections + ' connection(s) and mark as inactive', () => {
						const user = makeUser();
						let iterations = totalConnections;
						while (--iterations) user.mergeConnection(makeConnection());

						user.disconnectAll();
						assert.equal(user.connections.length, 0);
						assert.equal(user.connected, false);
					});

					it('should unref all ' + totalConnections + ' connection(s)', () => {
						const user = makeUser();
						let iterations = totalConnections;
						while (--iterations) user.mergeConnection(makeConnection());

						const connections = user.connections.slice();

						user.disconnectAll();
						for (let i = 0; i < totalConnections; i++) {
							assert(!Users.connections.has(connections[i].id));
						}
					});

					it('should clear `user` property for all ' + totalConnections + ' connection(s)', () => {
						const user = makeUser();
						let iterations = totalConnections;
						while (--iterations) user.mergeConnection(makeConnection());
						const connections = user.connections.slice();

						user.disconnectAll();
						for (let i = 0; i < totalConnections; i++) {
							assert.equal(connections[i].user, null);
						}
					});
				}
			});
			describe('#ban (network) (slow)', () => {
				afterEach(() => {
					for (const ip in Users.bannedIps) {
						delete Users.bannedIps[ip];
					}
				});

				it('should disconnect every user at that IP', async () => {
					Punishments.sharedIps = new Map();
					const user1 = makeUser('', '192.168.1.1');
					const user2 = makeUser('', '192.168.1.1');
					await Punishments.ban(user1);
					assert.equal(user1.connected, false);
					assert.equal(user2.connected, false);
				});

				it('should not disconnect users at other IPs', async () => {
					const user1 = makeUser('', '192.168.1.1');
					const user2 = makeUser('', '192.168.1.2');
					await Punishments.ban(user1);
					assert.equal(user2.connected, true);
				});
			});

			describe('#can', () => {
				let room;
				afterEach(() => {
					for (const user of Users.users.values()) {
						user.disconnectAll();
						user.destroy();
					}
					if (room) {
						if (room) room.destroy();
					}
				});
				it(`should allow 'u' permissions on lower ranked users`, () => {
					const user = makeUser();
					user.tempGroup = '@';
					assert.equal(user.can('globalban', user), false, 'targeting self');

					const target = makeUser();
					target.tempGroup = ' ';
					assert.equal(user.can('globalban', target), true, 'targeting lower rank');
					target.tempGroup = '@';
					assert.equal(user.can('globalban', target), false, 'targeting same rank');
					target.tempGroup = '~';
					assert.equal(user.can('globalban', target), false, 'targeting higher rank');
				});
				it(`should not allow users to demote themselves`, () => {
					room = Rooms.createChatRoom("test");
					const user = makeUser("User");
					user.joinRoom(room);
					for (const group of [' ', '+', '@']) {
						room.auth.set(user.id, group);
						assert.equal(room.auth.get(user.id), group, 'before demotion attempt');
						Chat.parse("/roomdeauth User", room, user, user.connections[0]);
						assert.equal(room.auth.get(user.id), group, 'after demotion attempt');
					}
				});
			});
		});
	});
});
