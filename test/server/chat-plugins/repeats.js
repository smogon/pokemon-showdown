/**
 * Tests for the Repeats chat plugin
 * @author Annika
 */

'use strict';

const assert = require('assert').strict;
const Repeats = require('../../../.server-dist/chat-plugins/repeats').Repeats;

describe("Repeats plugin", () => {
	before(() => {
		this.room = Rooms.createChatRoom('repeatstest');
	});

	it('should add repeats correctly', () => {
		assert.ok(!Repeats.repeats.has(this.room));

		Repeats.addRepeat(this.room, {id: 'happyface', phrase: "^_^", interval: 1});

		assert.ok(Repeats.repeats.has(this.room));

		assert.ok(Repeats.repeats.get(this.room).has('happyface'));

		assert.ok(Repeats.repeats.get(this.room).get('happyface').has("^_^"));

		assert.ok(this.room.settings.repeats);
		assert.ok(this.room.settings.repeats.some(repeat => repeat.phrase === "^_^"));
	});

	it('should remove repeats correctly', () => {
		Repeats.addRepeat(this.room, {id: 'weirdface', phrase: "^_-", interval: 1});
		assert.ok(Repeats.repeats.get(this.room).get('weirdface').has("^_-"));
		assert.ok(this.room.settings.repeats.some(repeat => repeat.phrase === "^_-"));

		Repeats.removeRepeat(this.room, 'weirdface');
		assert.equal(Repeats.repeats.get(this.room).get('weirdface'), undefined);
		assert.ok(!this.room.settings.repeats.some(repeat => repeat.phrase === "^_-"));
	});

	it('should be able to tell if a repeat exists or not', () => {
		assert.ok(!Repeats.hasRepeat(this.room, 'annoyedface'));

		Repeats.addRepeat(this.room, {id: 'annoyedface', phrase: "-_-", interval: 1});
		assert.ok(Repeats.hasRepeat(this.room, 'annoyedface'));

		Repeats.removeRepeat(this.room, 'annoyedface');
		assert.ok(!Repeats.hasRepeat(this.room, 'annoyedface'));
	});
});
