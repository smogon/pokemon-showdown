var assert = require('assert');
var userUtils = require('./../../dev-tools/users-utils.js');
var User = userUtils.User;

describe('Simulator abstraction layer features', function () {
	describe('Battle', function () {
		describe('player identifiers', function () {
			var p1, p2, room;
			afterEach(function () {
				if (p1) {
					p1.disconnectAll();
					p1.destroy();
				}
				if (p2) {
					p2.disconnectAll();
					p2.destroy();
				}
				if (room) room.expire();
			});

			it('should not get out of sync in rated battles on rename', function () {
				var packedTeam = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';
				p1 = new User();
				p2 = new User();
				p1.forceRename("Missingno."); // Don't do this at home
				room = Rooms.global.startBattle(p1, p2, 'customgame', packedTeam, packedTeam, {rated: true});
				if (!room.active) {
					room.joinBattle(p1, packedTeam);
					room.joinBattle(p2, packedTeam);
				}
				p1.resetName();
				for (var i = 0; i < room.battle.playerids.length; i++) {
					var curId = room.battle.playerids[i];
					assert.strictEqual(room.battle.playerTable[curId], 'p' + (i + 1));
					if (!curId) {
						assert.ok(!room.battle.players[i]);
					} else {
						assert.strictEqual(curId, room.battle.players[i].userid);
					}
				}
			});
		});
	});
});
