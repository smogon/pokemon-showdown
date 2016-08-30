'use strict';

const assert = require('assert');
let userUtils = require('./../../dev-tools/users-utils');
let User = userUtils.User;

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
				if (room) room.expire();
			});

			it('should not get players out of sync in rated battles on rename', function () {
				// Regression test for 47263c8749
				let packedTeam = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';
				p1 = new User();
				p2 = new User();
				p1.forceRename("Missingno."); // Don't do this at home
				room = Rooms.global.startBattle(p1, p2, '', packedTeam, packedTeam, {rated: true});
				p1.resetName();
				for (let i = 0; i < room.battle.playerNames.length; i++) {
					let playerName = room.battle.playerNames[i];
					let playerData = room.battle['p' + (i + 1)];
					assert.strictEqual(playerData.name, playerName);
					assert.strictEqual(playerData, room.battle.players[toId(playerName)]);
				}
			});
		});
	});
});
