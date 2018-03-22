'use strict';

const assert = require('assert');

const {User} = require('./../../dev-tools/users-utils');

describe('Simulator abstraction layer features', function () {
	describe('Battle', function () {
		describe('player identifiers', function () {
			let p1, p2, room;
			afterEach(function () {
				if (p1) {
					p1.disconnectAll();
					p1.destroy();
				}
				if (p2) {
					p2.disconnectAll();
					p2.destroy();
				}
				if (room) room.destroy();
			});

			it('should not get players out of sync in rated battles on rename', function () {
				// Regression test for 47263c8749
				let packedTeam = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';
				p1 = new User();
				p2 = new User();
				p1.forceRename("Missingno."); // Don't do this at home
				room = Rooms.createBattle('', {p1, p2, p1team: packedTeam, p2team: packedTeam, allowRenames: false});
				p1.resetName();
				for (const [i, playerName] of room.battle.playerNames.entries()) {
					const player = room.battle['p' + (i + 1)];
					assert.strictEqual(player.name, playerName);
					assert.strictEqual(player, room.battle.players[toId(playerName)]);
				}
			});
		});
	});
});
