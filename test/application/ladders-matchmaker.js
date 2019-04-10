'use strict';

const assert = require('assert');

global.Ladders = require('../../server/ladders');
const {Connection, User} = require('../../dev-tools/users-utils');

let p1, p2;
let s1, s2;

describe('Matchmaker', function () {
	const FORMATID = 'gen7ou';
	const addSearch = (player, rating = 1000, formatid = FORMATID) => {
		let search = new Ladders.BattleReady(player.userid, formatid, player.team, rating);
		Ladders(formatid).addSearch(search, player);
		return search;
	};
	const destroyPlayer = player => {
		player.resetName();
		player.disconnectAll();
		player.destroy();
		return null;
	};

	beforeAll(function () {
		clearInterval(Ladders.periodicMatchInterval);
		Ladders.periodicMatchInterval = null;
	});

	beforeEach(function () {
		p1 = new User(new Connection('127.0.0.1'));
		p1.forceRename('Morfent', true);
		p1.connected = true;
		p1.team = 'Gengar||||lick||252,252,4,,,|||||';
		Users.users.set(p1.userid, p1);

		p2 = new User(new Connection('0.0.0.0'));
		p2.forceRename('Mrofnet', true);
		p2.connected = true;
		p2.team = 'Gengar||||lick||252,252,4,,,|||||';
		Users.users.set(p2.userid, p2);
	});

	afterEach(function () {
		p1 = destroyPlayer(p1);
		p2 = destroyPlayer(p2);
	});

	it('should add a search', function () {
		let s1 = addSearch(p1);
		assert.ok(Ladders.searches.has(FORMATID));

		let formatSearches = Ladders.searches.get(FORMATID);
		assert.ok(formatSearches instanceof Map);
		assert.strictEqual(formatSearches.size, 1);
		assert.strictEqual(s1.userid, p1.userid);
		assert.strictEqual(s1.team, p1.team);
		assert.strictEqual(s1.rating, 1000);
	});

	it('should matchmake users when appropriate', function () {
		addSearch(p1);
		addSearch(p2);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should matchmake users within a reasonable rating range', function () {
		addSearch(p1);
		addSearch(p2, 2000);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 2);
	});

	it('should cancel searches', function () {
		addSearch(p1);
		Ladders(FORMATID).cancelSearch(p1);
		Ladders.cancelSearches(p2);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should periodically matchmake users when appropriate', function () {
		addSearch(p1);
		let s2 = addSearch(p2, 2000);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 2);

		s2.rating = 1000;
		Ladders.Ladder.periodicMatch();
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should create a new battle room after matchmaking', function () {
		assert.strictEqual(p1.games.size, 0);
		addSearch(p1);
		addSearch(p2);
		assert.strictEqual(p1.games.size, 1);
		for (const roomid of p1.games) {
			assert.ok(Rooms(roomid).battle);
		}
	});

	it('should cancel search on disconnect', function () {
		addSearch(p1);
		p1.onDisconnect(p1.connections[0]);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should cancel search on merge', function () {
		addSearch(p1);
		p2.merge(p1);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 0);
	});

	describe('#startBattle', function () {
		beforeEach(function () {
			s1 = addSearch(p1);
			s2 = addSearch(p2);
		});

		afterEach(function () {
			s1 = null;
			s2 = null;
		});

		it('should prevent battles from starting if both players are identical', function () {
			Object.assign(s2, s1);
			let room;
			try {
				room = Rooms.createBattle(FORMATID, {p1: p1, p2: p1, p1team: s1.team, p2team: s2.team, rated: 1000});
			} catch (e) {}
			assert.strictEqual(room, undefined);
		});

		beforeAll(function () {
			this.lockdown = Rooms.global.lockdown;
			Rooms.global.lockdown = true;
		});

		afterAll(function () {
			Rooms.global.lockdown = this.lockdown;
			this.lockdown = null;
		});

		it('should prevent battles from starting if the server is in lockdown', function () {
			let room = Rooms.createBattle(FORMATID, {p1: p1, p2: p2, p1team: s1.team, p2team: s2.team, rated: 1000});
			assert.strictEqual(room, undefined);
		});
	});
});
