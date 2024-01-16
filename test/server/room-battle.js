'use strict';

const assert = require('assert').strict;

const {makeUser} = require('../users-utils');

describe('Simulator abstraction layer features', function () {
	describe('Battle', function () {
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
			const packedTeam = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';
			p1 = makeUser("MissingNo.");
			p2 = makeUser();
			room = Rooms.createBattle({
				format: '',
				players: [{user: p1, team: packedTeam}, {user: p2, team: packedTeam}],
				allowRenames: false,
			});
			assert(room.battle);
			p1.resetName();
			for (const player of room.battle.players) {
				assert.equal(player, room.battle.playerTable[toID(player.name)]);
			}
		});
	});

	describe('BattleStream', function () {
		it('should work (slow)', async function () {
			Config.simulatorprocesses = 1;
			const PM = require('../../dist/server/room-battle').PM;
			assert.equal(PM.processes.length, 0);
			PM.spawn(1, true);
			assert.equal(PM.processes[0].getLoad(), 0);

			const stream = PM.createStream();
			assert.equal(PM.processes[0].getLoad(), 1);
			stream.write(
				'>version a2393dfd2a2da5594148bf99eea514e72b136c2c\n' +
				'>start {"formatid":"gen8randombattle","seed":[9619,36790,28450,62465],"rated":"Rated battle"}\n' +
				'>player p1 {"name":"p1","avatar":"ethan","team":"","rating":1507,"seed":[59512,58581,51338,7861]}\n' +
				'>player p2 {"name":"p2","avatar":"dawn","team":"","rating":1447,"seed":[33758,53485,62378,29757]}\n'
			);
			assert((await stream.read()).startsWith('sideupdate\np1\n|request|'));
			assert((await stream.read()).startsWith('sideupdate\np2\n|request|'));
			assert((await stream.read()).includes('|switch|'));
			stream.write(
				'>p1 move 1\n' +
				'>p2 move 1\n'
			);
			assert((await stream.read()).startsWith('sideupdate\np1\n|request|'));
			assert((await stream.read()).startsWith('sideupdate\np2\n|request|'));
			assert((await stream.read()).includes('|move|'));
			stream.destroy();
			assert.equal(PM.processes[0].getLoad(), 0);

			const stream2 = PM.createStream();
			assert.equal(PM.processes[0].getLoad(), 1);
			stream2.write(
				'>version a2393dfd2a2da5594148bf99eea514e72b136c2c\n' +
				'>start {"formatid":"gen8randombattle","seed":[9619,36790,28450,62465],"rated":"Rated battle"}\n' +
				'>player p1 {"name":"p1","avatar":"ethan","team":"","rating":1507,"seed":[59512,58581,51338,7861]}\n' +
				'>player p2 {"name":"p2","avatar":"dawn","team":"","rating":1447,"seed":[33758,53485,62378,29757]}\n' +
				'>p1 move 1\n' +
				'>p2 move 1\n'
			);
			assert(await stream2.read());
			stream2.writeEnd();
			await stream2.readAll();
			assert.equal(PM.processes[0].getLoad(), 0);
			PM.unspawn();
		});
	});
});
