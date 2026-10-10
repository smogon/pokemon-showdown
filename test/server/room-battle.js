'use strict';

const assert = require('assert').strict;

const { makeUser } = require('../users-utils');

describe('Simulator abstraction layer features', () => {
	describe('Battle', () => {
		let p1, p2, room;
		afterEach(() => {
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

		it('should not get players out of sync in rated battles on rename', () => {
			// Regression test for 47263c8749
			const packedTeam = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';
			p1 = makeUser("MissingNo.");
			p2 = makeUser();
			room = Rooms.createBattle({
				format: '',
				players: [{ user: p1, team: packedTeam }, { user: p2, team: packedTeam }],
				allowRenames: false,
			});
			assert(room.battle);
			p1.resetName();
			for (const player of room.battle.players) {
				assert.equal(player, room.battle.playerTable[toID(player.name)]);
			}
		});
	});

	describe('Free-for-all player replacement', () => {
		let players, replacement, room, battle;
		beforeEach(() => {
			const packedTeam = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';
			players = [1, 2, 3, 4].map(num => makeUser(`FFA Player ${num}`));
			replacement = makeUser('FFA Replacement');
			room = Rooms.createBattle({
				format: 'gen9freeforall',
				players: players.map(user => ({ user, team: packedTeam })),
			});
			battle = room.battle;
			assert(battle.forfeit(players[0]));
			assert(battle.p1.eliminated);
			assert.equal(battle.p1.id, '');
			assert.equal(battle.ended, false);
		});
		afterEach(() => {
			for (const challenge of [...Ladders.challenges.get(replacement.id) || []]) {
				Ladders.challenges.remove(challenge);
			}
			room.destroy();
			for (const user of [...players, replacement]) {
				user.disconnectAll();
				user.destroy();
			}
		});

		for (const slot of ['p1', undefined]) {
			it(`should reject joining an eliminated slot ${slot ? 'explicitly' : 'automatically'}`, () => {
				room.auth.set(replacement.id, Users.PLAYER_SYMBOL);
				assert.equal(battle.joinGame(replacement, slot), false);
				assert.equal(battle.p1.id, '');
				assert.equal(battle.p1.name, players[0].name);
				assert.equal(battle.playerTable[replacement.id], undefined);
				assert.equal(replacement.games.has(room.roomid), false);
			});
		}

		for (const inRoom of [false, true]) {
			it(`should reject /addplayer into an eliminated slot for a user ${inRoom ? 'inside' : 'outside'} the room`, async () => {
				if (inRoom) replacement.joinRoom(room);
				await Chat.parse(`/addplayer ${replacement.name}, p1`, room, players[1], players[1].connections[0]);
				assert.equal(battle.p1.invite, '');
				assert.equal(Ladders.challenges.search(players[1].id, replacement.id), null);
				assert.equal(battle.p1.id, '');
				assert.equal(battle.p1.name, players[0].name);
				assert.equal(battle.playerTable[replacement.id], undefined);
				assert.notEqual(room.auth.get(replacement.id), Users.PLAYER_SYMBOL);
			});
		}

		for (const slot of ['p2', undefined]) {
			it(`should still replace a player who left ${slot ? 'explicitly' : 'automatically'}`, () => {
				assert(battle.leaveGame(players[1]));
				room.auth.set(replacement.id, Users.PLAYER_SYMBOL);
				assert.equal(battle.joinGame(replacement, slot), true);
				assert.equal(battle.playerTable[replacement.id]?.slot, 'p2');
				assert.equal(battle.p1.id, '');
				assert.equal(battle.p2.eliminated, false);
			});
		}

		it('should ignore stale invitations to eliminated slots when choosing a slot', () => {
			assert(battle.leaveGame(players[1]));
			battle.p1.invite = replacement.id;
			room.auth.set(replacement.id, Users.PLAYER_SYMBOL);
			assert.equal(battle.joinGame(replacement), true);
			assert.equal(battle.playerTable[replacement.id]?.slot, 'p2');
			assert.equal(battle.p1.id, '');
		});

		it('should still invite a replacement for a player who left', async () => {
			assert(battle.leaveGame(players[1]));
			await Chat.parse(`/addplayer ${replacement.name}, p2`, room, players[2], players[2].connections[0]);
			assert.equal(battle.p2.invite, replacement.id);
			assert(Ladders.challenges.search(players[2].id, replacement.id));
			await Chat.parse(`/acceptbattle ${players[2].id}`, null, replacement, replacement.connections[0]);
			assert.equal(battle.playerTable[replacement.id]?.slot, 'p2');
			assert.equal(battle.p2.invite, '');
			assert.equal(Ladders.challenges.search(players[2].id, replacement.id), null);
			assert.equal(battle.p1.id, '');
		});
	});

	describe('BattleStream', () => {
		it('should work (slow)', async () => {
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
			assert((await stream.read()).includes('|switch|'));
			assert((await stream.read()).startsWith('sideupdate\np1\n|request|'));
			assert((await stream.read()).startsWith('sideupdate\np2\n|request|'));
			stream.write(
				'>p1 move 1\n' +
				'>p2 move 1\n'
			);
			assert((await stream.read()).includes('|move|'));
			assert((await stream.read()).startsWith('sideupdate\np1\n|request|'));
			assert((await stream.read()).startsWith('sideupdate\np2\n|request|'));
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
