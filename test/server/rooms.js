'use strict';

const assert = require('assert').strict;

const { makeUser } = require('../users-utils');

describe('Rooms features', () => {
	describe('Rooms', () => {
		describe('Rooms.get', () => {
			it('should be a function', () => {
				assert.equal(typeof Rooms.get, 'function');
			});
		});
		describe('Rooms.rooms', () => {
			it('should be a Map', () => {
				assert(Rooms.rooms instanceof Map);
			});
		});
	});

	describe('BasicRoom', () => {
		describe('getGame', () => {
			it('should return the game only when the gameids match', () => {
				const Hangman = require('../../dist/server/chat-plugins/hangman').Hangman;
				const UNO = require('../../dist/server/chat-plugins/uno').UNO;
				const room = Rooms.createChatRoom('r/relationshipadvice');
				const game = new Hangman(room, makeUser(), 'There\'s a lot of red flags here');
				room.game = game;
				assert.equal(room.getGame(Hangman), game);
				assert.equal(room.getGame(UNO), null);
			});
		});
	});

	describe('GameRoom', () => {
		const packedTeam = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';

		let room;
		let parent;
		afterEach(() => {
			for (const user of Users.users.values()) {
				user.disconnectAll();
				user.destroy();
			}
			if (room) room.destroy();
			if (parent) parent.destroy();
		});

		it('should allow two users to join the battle', () => {
			const p1 = makeUser();
			const p2 = makeUser();
			const options = [
				{ rated: false, tour: false },
				{ rated: false, tour: { onBattleWin() {} } },
				{ rated: true, tour: false },
				{ rated: true, tour: { onBattleWin() {} } },
			];
			for (const option of options) {
				room = Rooms.createBattle({
					format: 'customgame',
					players: [
						{ user: p1, team: packedTeam },
						{ user: p2, team: packedTeam },
					],
					...option,
				});
				assert(room.battle.p1 && room.battle.p2); // Automatically joined
			}
		});

		it('should copy auth from tournament', () => {
			parent = Rooms.createChatRoom('parentroom');
			parent.auth.get = () => '%';
			const p1 = makeUser();
			const p2 = makeUser();
			room = Rooms.createBattle({
				format: 'customgame',
				players: [
					{ user: p1, team: packedTeam },
					{ user: p2, team: packedTeam },
				],
				rated: false,
				auth: {},
				tour: {
					onBattleWin() {},
					room: parent,
				},
			});
			assert.equal(room.auth.get(makeUser().id), '%');
		});

		it('should prevent overriding tournament room auth by a tournament player', () => {
			parent = Rooms.createChatRoom('parentroom2');
			parent.auth.get = () => '%';
			const p1 = makeUser();
			const p2 = makeUser();
			const roomStaff = makeUser("Room auth");
			const administrator = makeUser("Admin");
			administrator.tempGroup = '~';
			room = Rooms.createBattle({
				format: 'customgame',
				players: [
					{ user: p1, team: packedTeam },
					{ user: p2, team: packedTeam },
				],
				rated: false,
				auth: {},
				tour: {
					onBattleWin() {},
					room: parent,
				},
			});
			roomStaff.joinRoom(room);
			administrator.joinRoom(room);
			assert.equal(room.auth.get(roomStaff), '%', 'before promotion attempt');
			Chat.parse("/roomvoice Room auth", room, p1, p1.connections[0]);
			assert.equal(room.auth.get(roomStaff), '%', 'after promotion attempt');
			Chat.parse("/roomvoice Room auth", room, administrator, administrator.connections[0]);
			assert.equal(room.auth.get(roomStaff), '%', 'after being promoted by an administrator');
		});
	});

	describe("ChatRoom", () => {
		describe("#rename", () => {
			let room;
			let parent;
			let subroom;
			afterEach(() => {
				for (const user of Users.users.values()) {
					user.disconnectAll();
					user.destroy();
				}
				const rooms = [room, parent, subroom];
				for (const room of rooms) {
					if (room) {
						room.destroy();
					}
				}
			});
			it("should rename its roomid and title", async () => {
				room = Rooms.createChatRoom("test", "Test");
				await room.rename("Test2");
				assert.equal(room.roomid, "test2");
				assert.equal(room.title, "Test2");
			});

			it("should rename its key in Rooms.rooms", async () => {
				room = Rooms.createChatRoom("test", "Test");
				await room.rename("Test2");
				assert.equal(Rooms.rooms.has("test"), false);
				assert.equal(Rooms.rooms.has("test2"), true);
			});

			it("should move the users and their connections", async () => {
				room = Rooms.createChatRoom("test", "Test");
				const user = makeUser();
				user.joinRoom(room);
				await room.rename("Test2");
				assert.equal(user.inRooms.has("test"), false);
				assert.equal(user.inRooms.has("test2"), true);
				assert.equal(user.connections[0].inRooms.has("test"), false);
				assert.equal(user.connections[0].inRooms.has("test2"), true);
			});

			it("should rename their parents subroom reference", async () => {
				parent = Rooms.createChatRoom("parent", "Parent");
				subroom = Rooms.createChatRoom("subroom", "Subroom", { parentid: "parent" });
				await subroom.rename("TheSubroom");
				assert.equal(parent.subRooms.has("subroom"), false);
				assert.equal(parent.subRooms.has("thesubroom"), true);
			});

			it("should rename their subrooms parent reference", async () => {
				parent = Rooms.createChatRoom("parent", "Parent");
				subroom = Rooms.createChatRoom("subroom", "Subroom", { parentid: "parent" });
				await parent.rename("TheParent");
				assert.equal(subroom.parent, parent);
			});
		});
	});
});
