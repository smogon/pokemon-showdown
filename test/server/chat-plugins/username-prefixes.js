/**
 * Tests for the username-prefixes chat plugin.
 * @author Annika
 */
'use strict';

const assert = require('assert').strict;
const PREFIX_DURATION = 10 * 24 * 60 * 60 * 1000;

describe('PrefixManager', () => {
	let PrefixManager = null;
	let manager = null;
	before(() => {
		PrefixManager = require('../../../dist/server/chat-plugins/username-prefixes').PrefixManager;
	});

	beforeEach(() => {
		manager = new PrefixManager();
		Config.forcedprefixes = [];
	});

	it('Config.forcedprefixes should reflect prefix additions and removals', () => {
		manager.addPrefix('forcedpublic', 'privacy');
		manager.addPrefix('nomodchat', 'modchat');

		assert(Config.forcedprefixes.find(x => x.prefix === 'forcedpublic' && x.type === 'privacy'));
		assert(Config.forcedprefixes.find(x => x.prefix === 'nomodchat' && x.type === 'modchat'));

		manager.removePrefix('forcedpublic', 'privacy');
		manager.removePrefix('nomodchat', 'modchat');

		assert(!Config.forcedprefixes.find(x => x.prefix === 'forcedpublic' && x.type === 'privacy'));
		assert(!Config.forcedprefixes.find(x => x.prefix === 'nomodchat' && x.type === 'modchat'));
	});

	it('should not overwrite manually specified prefixes', () => {
		const time = Date.now() + PREFIX_DURATION;
		Config.forcedprefixes = [{ prefix: 'manual', type: 'modchat', expireAt: time }];
		manager.addPrefix('nomodchat', 'modchat');

		assert.deepEqual(Config.forcedprefixes, [
			{ prefix: 'manual', type: 'modchat', expireAt: time },
			{ prefix: 'nomodchat', type: 'modchat', expireAt: Config.forcedprefixes.find(x => x.prefix === 'nomodchat').expireAt },
		]);
	});

	it('should correctly validate prefix types', () => {
		assert.doesNotThrow(() => manager.validateType('privacy'));
		assert.doesNotThrow(() => manager.validateType('modchat'));

		assert.throws(() => manager.validateType('gibberish'));
		assert.throws(() => manager.validateType(''));
	});
});
