'use strict';

const assert = require('assert').strict;

const {User} = require('../users-utils');

describe('Rooms features', function () {
	describe('Rooms', function () {
		describe('Rooms.get', function () {
			it('should be a function', function () {
				assert.equal(typeof Rooms.get, 'function');
			});
		});
		describe('Rooms.rooms', function () {
			it('should be a Map', function () {
				assert.ok(Rooms.rooms instanceof Map);
			});
		});
	});

	describe('BasicRoom', function () {
		describe('getGame', function () {
			it('should return the game only when the gameids match', function () {
				const Hangman = require('../../.server-dist/chat-plugins/hangman').Hangman;
				const Uno = require('../../.server-dist/chat-plugins/uno').UnoGame;
				const room = Rooms.createChatRoom('r/relationshipadvice');
				const game = new Hangman(room, new User(), 'There\'s a lot of red flags here');
				room.game = game;
				assert.equal(room.getGame(Hangman), game);
				assert.equal(room.getGame(Uno), null);
			});
		});
	});

	describe('GameRoom', function () {
		const packedTeam = 'Weavile||lifeorb||swordsdance,knockoff,iceshard,iciclecrash|Jolly|,252,,,4,252|||||';

		let room;
		let parent;
		afterEach(function () {
			for (const user of Users.users.values()) {
				user.disconnectAll();
				user.destroy();
			}
			if (room) room.destroy();
			if (parent) parent.destroy();
		});

		it('should allow two users to join the battle', function () {
			let p1 = new User();
			let p2 = new User();
			let options = [{rated: false, tour: false}, {rated: false, tour: {onBattleWin() {}}}, {rated: true, tour: false}, {rated: true, tour: {onBattleWin() {}}}];
			for (let option of options) {
				room = Rooms.createBattle('customgame', Object.assign({
					p1,
					p2,
					p1team: packedTeam,
					p2team: packedTeam,
				}, option));
				assert.ok(room.battle.p1 && room.battle.p2); // Automatically joined
			}
		});

		it('should copy auth from tournament', function () {
			parent = Rooms.createChatRoom('parentroom', '', {});
			parent.getAuth = () => '%';
			const p1 = new User();
			const p2 = new User();
			const options = {
				p1,
				p2,
				p1team: packedTeam,
				p2team: packedTeam,
				rated: false,
				auth: {},
				tour: {
					onBattleWin() {},
					room: parent,
				},
			};
			room = Rooms.createBattle('customgame', options);
			assert.equal(room.getAuth(new User()), '%');
		});

		it('should prevent overriding tournament room auth by a tournament player', function () {
			parent = Rooms.createChatRoom('parentroom2', '', {});
			parent.getAuth = () => '%';
			const p1 = new User();
			const p2 = new User();
			const roomStaff = new User();
			roomStaff.forceRename("Room auth", true);
			const administrator = new User();
			administrator.forceRename("Admin", true);
			administrator.group = '~';
			const options = {
				p1,
				p2,
				p1team: packedTeam,
				p2team: packedTeam,
				rated: false,
				auth: {},
				tour: {
					onBattleWin() {},
					room: parent,
				},
			};
			room = Rooms.createBattle('customgame', options);
			roomStaff.joinRoom(room);
			administrator.joinRoom(room);
			assert.equal(room.getAuth(roomStaff), '%', 'before promotion attempt');
			Chat.parse("/roomvoice Room auth", room, p1, p1.connections[0]);
			assert.equal(room.getAuth(roomStaff), '%', 'after promotion attempt');
			Chat.parse("/roomvoice Room auth", room, administrator, administrator.connections[0]);
			assert.equal(room.getAuth(roomStaff), '+', 'after being promoted by an administrator');
		});
	});
});
