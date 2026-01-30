'use strict';

const assert = require('assert').strict;

const { makeUser } = require('../users-utils');

describe('Groupchat activity tracking', () => {
	let room;
	let user;
	afterEach(() => {
		if (user) {
			user.disconnectAll();
			user.destroy();
		}
		if (room) room.destroy();
	});

	it('should update activity when commands produce room-visible output', async () => {
		room = Rooms.createChatRoom('groupchat-test-public', 'Test Public', { isPersonal: true });
		user = makeUser('TestUser');
		user.joinRoom(room);
		room.auth.set(user.id, '%');

		if (room.expireTimer) clearTimeout(room.expireTimer);
		room.expireTimer = null;

		await Chat.parse('/announcement new Test announcement', room, user, user.connections[0]);

		assert(room.expireTimer, 'Expire timer should be set after room-visible output');
	});

	it('should not update activity when commands only produce private responses', async () => {
		room = Rooms.createChatRoom('groupchat-test-private', 'Test Private', { isPersonal: true });
		user = makeUser('TestUser2');
		user.joinRoom(room);

		if (room.expireTimer) clearTimeout(room.expireTimer);
		room.expireTimer = null;

		await Chat.parse('/help', room, user, user.connections[0]);

		assert.equal(room.expireTimer, null, 'Expire timer should not be set after private-only response');
	});

	it('should update activity for poll commands', async () => {
		room = Rooms.createChatRoom('groupchat-test-poll', 'Test Poll', { isPersonal: true });
		user = makeUser('TestUser3');
		user.joinRoom(room);
		room.auth.set(user.id, '%');

		if (room.expireTimer) clearTimeout(room.expireTimer);
		room.expireTimer = null;

		await Chat.parse('/poll new Test poll?, option1, option2', room, user, user.connections[0]);

		assert(room.expireTimer, 'Expire timer should be set after poll creation');
	});

	it('should not affect non-personal rooms', async () => {
		room = Rooms.createChatRoom('test-regular-room', 'Test Regular', { isPersonal: false });
		room.persist = false;
		user = makeUser('TestUser4');
		user.joinRoom(room);

		assert.equal(room.expireTimer, null, 'Regular rooms should not have expire timers');

		await Chat.parse('/announce Test', room, user, user.connections[0]);

		assert.equal(room.expireTimer, null, 'Regular rooms should still not have expire timers');
	});
});
