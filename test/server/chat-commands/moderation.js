/**
 * Tests for moderation commands
 * @author Annika
 */

'use strict';

const assert = require('assert').strict;
const moderation = require('../../../.server-dist/chat-commands/moderation');

const userUtils = require('../../users-utils');
const User = userUtils.User;
const Connection = userUtils.Connection;

function makeUser(name, ip) {
	const user = new User(new Connection(ip));
	user.forceRename(name, true);
	Users.users.set(user.id, user);
	return user;
}

describe('room promotions', () => {
	before(() => {
		Rooms.global.addChatRoom('Promotion Testing');
		this.room = Rooms.get('promotiontesting');

		this.user = makeUser('Annika', '127.0.0.1');
		this.user.setGroup('&');

		this.targetUser = makeUser('Heart of Etheria', '127.0.0.1');
	});

	it('should not promote users with usernames >18 characters long', () => {
		assert.throws(() => moderation.runPromote(this.user, this.room, 'a'.repeat(19), '+', undefined, true));
		assert.doesNotThrow(() => moderation.runPromote(this.user, this.room, 'a'.repeat(18), '+', undefined, true));
	});

	it('should not promote offline users without the `force` option', () => {
		assert.throws(() => moderation.runPromote(this.user, this.room, 'some random reg', '+'));
		assert.doesNotThrow(() => moderation.runPromote(this.user, this.room, 'some random reg', '+', undefined, true));
	});

	it('should not promote unregistered users', () => {
		this.targetUser.registered = false;

		assert.throws(() => moderation.runPromote(this.user, this.room, this.targetUser.id, '+'));
		assert.throws(() => moderation.runPromote(this.user, this.room, this.targetUser.id, '+', undefined, true));

		this.targetUser.registered = true;
	});

	it(`should not allow "promoting" to a user's current rank`, () => {
		assert.doesNotThrow(() => moderation.runPromote(this.user, this.room, 'Heart of Etheria', '+', undefined, true));
		assert.throws(() => moderation.runPromote(this.user, this.room, 'Heart of Etheria', '+', undefined, true));
	});

	it('should not promote locked users', () => {
		assert.doesNotThrow(() => moderation.runPromote(this.user, this.room, this.targetUser.id, '+', undefined, true));
		this.targetUser.locked = true;
		assert.throws(() => moderation.runPromote(this.user, this.room, this.targetUser.id, '+', undefined, true));
		this.targetUser.locked = false;
	});

	it('should update Room#auth', () => {
		moderation.runPromote(this.user, this.room, this.targetUser.id, '#', undefined, true);
		assert.equal(this.room.auth.get(this.targetUser.id), '#');
	});
});
