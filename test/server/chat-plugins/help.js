/**
 * Tests for the Help room auto-answerer.
 * Written by mia-pi.
 */

'use strict';
const assert = require('assert').strict;
const Responder = require('../../../.server-dist/chat-plugins/help').HelpResponder;
const Help = new Responder({
	stats: {},
	pairs: {},
	disabled: false,
	queue: [],
});

describe('Help', function () {
	it('should only return true on added regexes', function () {
		Help.data.pairs.catra = [];
		Help.data.pairs.catra.push(Help.stringRegex(`Hey & Adora`));
		assert.ok(Help.match('Hey, Adora', 'catra'));
		assert.ok(!Help.match('Hello, Adora', 'catra'));
	});

	it('should produce valid regexes', function () {
		const regexString = Help.stringRegex(`uwu & awa`);
		assert.strictEqual(regexString, "(?=.*?(uwu))(?=.*?(awa))");
		const regex = new RegExp(regexString);
		assert.ok(regex.test('uwu awa'));
	});
	it('should handle |, &, and ! correctly', function () {
		const and = new RegExp(Help.stringRegex(`Horde & Prime`));
		assert.ok(and.test('Horde Prime'));
		assert.ok(!and.test('Horde'));

		const or = new RegExp(Help.stringRegex(`she-ra|sea-ra`));
		assert.ok(or.test('sea-ra'));
		assert.ok(or.test(`she-ra`));
		assert.ok(!or.test('ADVENTURE'));

		const ignore = new RegExp(Help.stringRegex(`!Hordak`));
		assert.ok(ignore.test(`FOR THE HONOR OF GREYSKULL`));
		assert.ok(!ignore.test('Hordak'));
	});
});
