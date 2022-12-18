/**
* Tests for the friends list chat plugin. By Mia
* @author mia-pi-git
*/
'use strict';

const assert = require('../../assert');

describe.skip("Friends lists", () => {
	const {FriendsDatabase} = require('../../../server/friends');
	const {Config} = require('../../../server/config-loader');
	const test = (Config.usesqlite ? it : it.skip);
	test("Should properly setup database", () => {
		assert.doesNotThrow(() => FriendsDatabase.setupDatabase(':memory:'));
	});
});
