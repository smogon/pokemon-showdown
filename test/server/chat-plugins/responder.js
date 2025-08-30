/**
 * Tests for the Help room auto-answerer.
 * Written by Mia.
 * @author mia-pi-git
 */

'use strict';
const assert = require('assert').strict;

describe('Autoresponder', () => {
	let Responder = null;
	let room = null;
	let Help = null;

	before(() => {
		Responder = require('../../../dist/server/chat-plugins/responder').AutoResponder;
		room = Rooms.createChatRoom('etheria');
		Help = new Responder(room);
	});

	it('should only return true on added regexes', () => {
		Help.data.pairs.catra = [];
		Help.data.pairs.catra.push(Help.stringRegex(`Hey & Adora`));
		assert(Help.test('Hey, Adora', 'catra'));
		assert(!Help.test('Hello, Adora', 'catra'));
	});

	it('should produce valid regexes', () => {
		const regexString = Help.stringRegex(`uwu & awa`);
		assert.equal(regexString, "(?=.*?(uwu))(?=.*?(awa))");
		const regex = new RegExp(regexString);
		assert(regex.test('uwu awa'));
	});
	it('should handle |, &, and ! correctly', () => {
		const and = new RegExp(Help.stringRegex(`Horde & Prime`));
		assert(and.test('Horde Prime'));
		assert(!and.test('Horde'));

		const or = new RegExp(Help.stringRegex(`she-ra|sea-ra`));
		assert(or.test('sea-ra'));
		assert(or.test(`she-ra`));
		assert(!or.test('ADVENTURE'));

		const ignore = new RegExp(Help.stringRegex(`!Hordak`));
		assert(ignore.test(`FOR THE HONOR OF GREYSKULL`));
		assert(!ignore.test('Hordak'));
	});
});
