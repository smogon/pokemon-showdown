/**
 * Tests for the Repeats chat plugin
 * @author Annika
 */

'use strict';

const assert = require('assert').strict;
const repeats = require('../../../.server-dist/chat-plugins/repeats');

describe("Repeats plugin", () => {
	before(() => {
		this.room = Rooms.createChatRoom('repeatstest');
	});

	it('should add repeats correctly', () => {
		assert.ok(!repeats.repeats.has(this.room.roomid));
		repeats.addRepeat(this.room, {phrase: "^_^", interval: 1});

		assert.ok(repeats.repeats.has(this.room.roomid));

		assert.ok(repeats.repeats.get(this.room.roomid).has("^_^"));

		assert.ok(this.room.settings.repeats);
		assert.ok(this.room.settings.repeats.some(repeat => repeat.phrase === "^_^"));
	});

	it('should remove repeats correctly', () => {
		repeats.addRepeat(this.room, {phrase: "^_^", interval: 1});
		assert.ok(repeats.repeats.get(this.room.roomid).has("^_^"));
		assert.ok(this.room.settings.repeats.some(repeat => repeat.phrase === "^_^"));

		repeats.removeRepeat(this.room, "^_^");
		assert.strictEqual(repeats.repeats.get(this.room.roomid).get("^_^"), null);
		assert.ok(!this.room.settings.repeats.some(repeat => repeat.phrase === "^_^"));
	});

	it('should be able to tell if a repeat exists or not', () => {
		assert.ok(!repeats.hasRepeat(this.room, "-_-"));

		repeats.addRepeat(this.room, {phrase: "-_-", interval: 1});
		assert.ok(repeats.hasRepeat(this.room, "-_-"));

		repeats.removeRepeat(this.room, "-_-");
		assert.ok(!repeats.hasRepeat(this.room, "-_-"));
	});
});
