/**
 * Tests for the username-prefixes chat plugin.
 * @author Annika
 */
'use strict';

const assert = require('assert').strict;
const {PrefixManager} = require('../../../server/chat-plugins/username-prefixes');

describe('PrefixManager', function () {
	beforeEach(() => {
		this.prefixManager = new PrefixManager();
		Config.forcedprefixes = {privacy: [], modchat: []};
	});

	it('Config.forcedprefixes should reflect prefix additions and removals', () => {
		this.prefixManager.addPrefix('forcedpublic', 'privacy');
		this.prefixManager.addPrefix('nomodchat', 'modchat');

		assert(Config.forcedprefixes.privacy.includes('forcedpublic'));
		assert(Config.forcedprefixes.modchat.includes('nomodchat'));

		this.prefixManager.removePrefix('forcedpublic', 'privacy');
		this.prefixManager.removePrefix('nomodchat', 'modchat');

		assert(!Config.forcedprefixes.privacy.includes('forcedpublic'));
		assert(!Config.forcedprefixes.modchat.includes('nomodchat'));
	});

	it('should not overwrite manually specified prefixes', () => {
		Config.forcedprefixes.modchat = ['manual'];
		this.prefixManager.addPrefix('nomodchat', 'modchat');

		assert.deepEqual(Config.forcedprefixes.modchat, ['manual', 'nomodchat']);
	});

	it('should correctly validate prefix types', () => {
		assert.doesNotThrow(() => this.prefixManager.validateType('privacy'));
		assert.doesNotThrow(() => this.prefixManager.validateType('modchat'));

		assert.throws(() => this.prefixManager.validateType('gibberish'));
		assert.throws(() => this.prefixManager.validateType(''));
	});
});
