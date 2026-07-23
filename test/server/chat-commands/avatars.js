'use strict';

const assert = require('assert').strict;

describe('Avatars', () => {
	let Avatars;

	before(() => {
		({ Avatars } = require('../../../dist/server/chat-commands/avatars'));
	});

	it('should validate local side-server avatar files without server registration', async () => {
		const avatar = 'custom-trainer-01-a.png';

		assert.equal(await Avatars.exists(avatar), true);
		assert.equal(await Avatars.validate(avatar), avatar);
	});
});
