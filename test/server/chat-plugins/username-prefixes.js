/**
 * Tests for the username-prefixes chat plugin.
 * @author Annika
 */
'use strict';

const assert = require('assert').strict;
const {PrefixManager} = require('../../../dist/server/chat-plugins/username-prefixes');
const PREFIX_DURATION = 10 * 24 * 60 * 60 * 1000;

describe('PrefixManager', function () {
	beforeEach(() => {
		this.prefixManager = new PrefixManager();
		Config.forcedprefixes = [];
	});

	it('Config.forcedprefixes should reflect prefix additions and removals', () => {
		this.prefixManager.addPrefix('forcedpublic', 'privacy');
		this.prefixManager.addPrefix('nomodchat', 'modchat');

		assert(Config.forcedprefixes.find(x => x.prefix === 'forcedpublic' && x.type === 'privacy'));
		assert(Config.forcedprefixes.find(x => x.prefix === 'nomodchat' && x.type === 'modchat'));

		this.prefixManager.removePrefix('forcedpublic', 'privacy');
		this.prefixManager.removePrefix('nomodchat', 'modchat');

		assert(!Config.forcedprefixes.find(x => x.prefix === 'forcedpublic' && x.type === 'privacy'));
		assert(!Config.forcedprefixes.find(x => x.prefix === 'nomodchat' && x.type === 'modchat'));
	});

	it('should not overwrite manually specified prefixes', () => {
		const time = Date.now() + PREFIX_DURATION;
		Config.forcedprefixes = [{prefix: 'manual', type: 'modchat', expireAt: time}];
		this.prefixManager.addPrefix('nomodchat', 'modchat');

		assert.deepEqual(Config.forcedprefixes, [
			{prefix: 'manual', type: 'modchat', expireAt: time},
			{prefix: 'nomodchat', type: 'modchat', expireAt: Config.forcedprefixes.find(x => x.prefix === 'nomodchat').expireAt},
		]);
	});

	it('should correctly validate prefix types', () => {
		assert.doesNotThrow(() => this.prefixManager.validateType('privacy'));
		assert.doesNotThrow(() => this.prefixManager.validateType('modchat'));

		assert.throws(() => this.prefixManager.validateType('gibberish'));
		assert.throws(() => this.prefixManager.validateType(''));
	});
});
