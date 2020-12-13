/**
 * Tests for the chat monitor (word filters).
 *
 * @author Annika
 */
'use strict';

const assert = require('assert').strict;
const {User, Connection} = require('../../users-utils');

const chatMonitor = require('../../../.server-dist/chat-plugins/chat-monitor');

describe('Chat monitor', () => {
	describe('regex generator', () => {
		it('should generate case-insensitive regexes', () => {
			const regex = chatMonitor.generateRegex('slur');
			assert(regex.flags.includes('i'));
		});

		it('should use word boundaries for URL shortener regexes', () => {
			const regex = chatMonitor.generateRegex('bit.ly/', false, true);
			assert(String(regex).startsWith('/\\b'));
		});

		describe('evasion regexes', () => {
			before(() => {
				this.evasionRegex = chatMonitor.generateRegex('slur', true);
			});

			it('should account for stretching', () => {
				assert(this.evasionRegex.test('slur'));
				assert(this.evasionRegex.test('slurrrr'));
				assert(this.evasionRegex.test('sssllluurrrr'));
			});

			it('should account for non-English characters', () => {
				assert(this.evasionRegex.test('sⱠür'));
				assert(this.evasionRegex.test('s𝓵𝓾r'));
			});

			it('should account for periods', () => {
				assert(this.evasionRegex.test('s.l.u.r'));
			});
		});
	});

	describe('in-room tests', () => {
		before(() => {
			this.room = Rooms.get('lobby');
			this.connection = Connection('127.0.0.1');
			this.user = User(this.connection);
			this.user.forceRename("Unit Tester", true);
			this.user.joinRoom(this.room.roomid, this.connection);

			this.parse = async function (message) {
				Chat.loadPlugins();
				const context = new Chat.CommandContext({
					message,
					room: this.room,
					user: this.user,
					connection: this.connection,
				});
				return context.parse();
			};
		});

		beforeEach(() => Punishments.unlock(this.user.id));

		it('should lock users who use autolock phrases', async () => {
			assert(!this.user.locked);
			chatMonitor.addFilter({
				word: 'autolock',
				list: 'autolock',
			});

			await this.parse("haha autolock me pls");

			assert(this.user.locked);
			assert.notEqual(this.room.log.log.pop(), "haha autolock me pls");
		});

		it('should lock users who evade evasion phrases', async () => {
			assert(!this.user.locked);
			chatMonitor.addFilter({
				word: 'slur',
				list: 'evasion',
			});

			await this.parse("sl ur");
			assert(this.user.locked);
			assert.notEqual(this.room.log.log.pop(), "sl ur");
		});

		it('should replace words filtered to other words', async () => {
			assert(!this.user.locked);
			chatMonitor.addFilter({
				word: 'replace me',
				list: 'wordfilter',
				replacement: 'i got replaced',
			});

			await this.parse("Hello! replace me pls! thanks, and remember to replace me.");
			assert.equal(
				this.room.log.log.pop().replace(/^\|c:\|[0-9]+\| Unit Tester\|/, ''),
				"Hello! i got replaced pls! thanks, and remember to i got replaced."
			);
		});

		it('should prevent filtered words from being said', async () => {
			assert(!this.user.locked);
			chatMonitor.addFilter({
				word: 'mild slur',
				list: 'warn',
			});

			await this.parse("mild slur");
			assert.notEqual(this.room.log.log.pop(), "mild slur");
		});
	});
});
