'use strict';

const assert = require('assert');

global.Ladders = require('../../server/ladders');
const {Connection, User} = require('../users-utils');

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

	before(function () {
		clearInterval(Ladders.periodicMatchInterval);
		Ladders.periodicMatchInterval = null;
	});

	beforeEach(function () {
		this.p1 = new User(new Connection('127.0.0.1'));
		this.p1.forceRename('Morfent', true);
		this.p1.connected = true;
		this.p1.team = 'Gengar||||lick||252,252,4,,,|||||';
		Users.users.set(this.p1.userid, this.p1);

		this.p2 = new User(new Connection('0.0.0.0'));
		this.p2.forceRename('Mrofnet', true);
		this.p2.connected = true;
		this.p2.team = 'Gengar||||lick||252,252,4,,,|||||';
		Users.users.set(this.p2.userid, this.p2);
	});

	afterEach(function () {
		this.p1 = destroyPlayer(this.p1);
		this.p2 = destroyPlayer(this.p2);
	});

	it('should add a search', function () {
		let s1 = addSearch(this.p1);
		assert.ok(Ladders.searches.has(FORMATID));

		let formatSearches = Ladders.searches.get(FORMATID);
		assert.ok(formatSearches instanceof Map);
		assert.strictEqual(formatSearches.size, 1);
		assert.strictEqual(s1.userid, this.p1.userid);
		assert.strictEqual(s1.team, this.p1.team);
		assert.strictEqual(s1.rating, 1000);
	});

	it('should matchmake users when appropriate', function () {
		addSearch(this.p1);
		addSearch(this.p2);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should matchmake users within a reasonable rating range', function () {
		addSearch(this.p1);
		addSearch(this.p2, 2000);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 2);
	});

	it('should cancel searches', function () {
		addSearch(this.p1);
		Ladders(FORMATID).cancelSearch(this.p1);
		Ladders.cancelSearches(this.p2);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should periodically matchmake users when appropriate', function () {
		addSearch(this.p1);
		let s2 = addSearch(this.p2, 2000);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 2);

		s2.rating = 1000;
		Ladders.Ladder.periodicMatch();
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should create a new battle room after matchmaking', function () {
		assert.strictEqual(this.p1.games.size, 0);
		addSearch(this.p1);
		addSearch(this.p2);
		assert.strictEqual(this.p1.games.size, 1);
		for (const roomid of this.p1.games) {
			assert.ok(Rooms(roomid).battle);
		}
	});

	it('should cancel search on disconnect', function () {
		addSearch(this.p1);
		this.p1.onDisconnect(this.p1.connections[0]);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should cancel search on merge', function () {
		addSearch(this.p1);
		this.p2.merge(this.p1);
		assert.strictEqual(Ladders.searches.get(FORMATID).size, 0);
	});

	describe('#startBattle', function () {
		beforeEach(function () {
			this.s1 = addSearch(this.p1);
			this.s2 = addSearch(this.p2);
		});

		afterEach(function () {
			this.s1 = null;
			this.s2 = null;
		});

		it('should prevent battles from starting if both players are identical', function () {
			Object.assign(this.s2, this.s1);
			let room;
			try {
				room = Rooms.createBattle(FORMATID, {p1: this.p1, p2: this.p1, p1team: this.s1.team, p2team: this.s2.team, rated: 1000});
			} catch (e) {}
			assert.strictEqual(room, undefined);
		});

		before(function () {
			this.lockdown = Rooms.global.lockdown;
			Rooms.global.lockdown = true;
		});

		after(function () {
			Rooms.global.lockdown = this.lockdown;
			this.lockdown = null;
		});

		it('should prevent battles from starting if the server is in lockdown', function () {
			let room = Rooms.createBattle(FORMATID, {p1: this.p1, p2: this.p2, p1team: this.s1.team, p2team: this.s2.team, rated: 1000});
			assert.strictEqual(room, undefined);
		});
	});
});
