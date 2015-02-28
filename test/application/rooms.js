var assert = require('assert');
var room;

describe('Rooms features', function () {
	describe('Rooms', function () {
		describe('Rooms.get', function () {
			it('should be a function', function () {
				assert.strictEqual(typeof Rooms.get, 'function');
			});

			it('should be equal to `Rooms`', function () {
				assert.strictEqual(Rooms.get, Rooms);
			});
		});
		describe('Rooms.rooms', function () {
			it('should have null prototype', function () {
				assert.strictEqual(Object.getPrototypeOf(Rooms.rooms), null);
			});

			it('should not have a native `constructor`', function () {
				assert.ok(Rooms.rooms.constructor === undefined || Rooms.rooms.constructor instanceof Rooms.Room);
			});
		});
	});
});
