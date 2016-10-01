'use strict';

const assert = require('assert');

let userUtils = require('./../../dev-tools/users-utils');
let User = userUtils.User;

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
			it('should be a Map', function () {
				assert.ok(Rooms.rooms instanceof Map);
			});
		});
	});

	describe('BattleRoom', function () {
		const packedTeam = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';

		let room;
		afterEach(function () {
			if (room) room.expire();
		});

		it('should allow two users to join the battle', function () {
			let p1 = new User();
			let p2 = new User();
			let options = [{rated: false, tour: false}, {rated: false, tour: {onBattleWin() {}}}, {rated: true, tour: false}, {rated: true, tour: {onBattleWin() {}}}];
			for (let option of options) {
				room = Rooms.global.startBattle(p1, p2, 'customgame', packedTeam, packedTeam, option);
				assert.ok(room.battle.p1 && room.battle.p2); // Automatically joined
			}
		});

		it('should copy auth from tournament', function () {
			const p1 = new User();
			const p2 = new User();
			const options = {
				rated: false,
				auth: {},
				tour: {
					onBattleWin() {},
					room: {getAuth() {
						return '%';
					}},
				},
			};
			room = Rooms.global.startBattle(p1, p2, 'customgame', packedTeam, packedTeam, options);
			assert.strictEqual(room.getAuth(new User()), '%');
		});

		it('should prevent overriding tournament room auth by a tournament player', function () {
			const p1 = new User();
			const p2 = new User();
			const roomStaff = new User();
			roomStaff.forceRename("Room auth", true);
			const administrator = new User();
			administrator.group = '~';
			const options = {
				rated: false,
				auth: {},
				tour: {
					onBattleWin() {},
					room: {getAuth(user) {
						return '%';
					}},
				},
			};
			room = Rooms.global.startBattle(p1, p2, 'customgame', packedTeam, packedTeam, options);
			administrator.joinRoom(room);
			assert.strictEqual(room.getAuth(roomStaff), '%', 'before promotion attempt');
			Chat.parse("/roomvoice Room auth", room, p1, p1.connections[0]);
			assert.strictEqual(room.getAuth(roomStaff), '%', 'after promotion attempt');
			Chat.parse("/roomvoice Room auth", room, administrator, administrator.connections[0]);
			assert.strictEqual(room.getAuth(roomStaff), '+', 'after being promoted by an administrator');

			for (const user of [roomStaff, administrator]) {
				user.disconnectAll();
				user.destroy();
			}
		});
	});
});
