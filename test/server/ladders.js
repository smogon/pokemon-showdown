'use strict';

const assert = require('assert').strict;

global.Ladders = require('../../.server-dist/ladders').Ladders;
const {Connection, User} = require('../users-utils');

describe('Matchmaker', function () {
	const FORMATID = 'gen7ou';
	const addSearch = async (player, rating = 1000, formatid = FORMATID) => {
		let search = new Ladders.BattleReady(player.id, formatid, player.team, rating);
		await Ladders(formatid).addSearch(search, player);
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
		Users.users.set(this.p1.id, this.p1);

		this.p2 = new User(new Connection('0.0.0.0'));
		this.p2.forceRename('Mrofnet', true);
		this.p2.connected = true;
		this.p2.team = 'Gengar||||lick||252,252,4,,,|||||';
		Users.users.set(this.p2.id, this.p2);
	});

	afterEach(function () {
		this.p1 = destroyPlayer(this.p1);
		this.p2 = destroyPlayer(this.p2);
	});

	it('should add a search', async function () {
		let s1 = await addSearch(this.p1);
		assert.ok(Ladders.searches.has(FORMATID));

		let formatSearches = Ladders.searches.get(FORMATID);
		assert.ok(formatSearches instanceof Map);
		assert.equal(formatSearches.size, 1);
		assert.equal(s1.userid, this.p1.id);
		assert.equal(s1.team, this.p1.team);
		assert.equal(s1.rating, 1000);
	});

	it('should matchmake users when appropriate', async function () {
		await addSearch(this.p1);
		await addSearch(this.p2);
		assert.equal(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should matchmake users within a reasonable rating range', async function () {
		await addSearch(this.p1);
		await addSearch(this.p2, 2000);
		assert.equal(Ladders.searches.get(FORMATID).size, 2);
	});

	it('should cancel searches', async function () {
		await addSearch(this.p1);
		Ladders(FORMATID).cancelSearch(this.p1);
		Ladders.cancelSearches(this.p2);
		assert.equal(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should periodically matchmake users when appropriate', async function () {
		await addSearch(this.p1);
		let s2 = await addSearch(this.p2, 2000);
		assert.equal(Ladders.searches.get(FORMATID).size, 2);

		s2.rating = 1000;
		Ladders.Ladder.periodicMatch();
		assert.equal(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should create a new battle room after matchmaking', async function () {
		assert.equal(this.p1.games.size, 0);
		await addSearch(this.p1);
		await addSearch(this.p2);
		assert.equal(this.p1.games.size, 1);
		for (const roomid of this.p1.games) {
			assert.ok(Rooms.get(roomid).battle);
		}
	});

	it('should cancel search on disconnect', async function () {
		await addSearch(this.p1);
		this.p1.onDisconnect(this.p1.connections[0]);
		assert.equal(Ladders.searches.get(FORMATID).size, 0);
	});

	it('should cancel search on merge', async function () {
		await addSearch(this.p1);
		this.p2.merge(this.p1);
		assert.equal(Ladders.searches.get(FORMATID).size, 0);
	});

	describe('#startBattle', function () {
		beforeEach(async function () {
			this.s1 = await addSearch(this.p1);
			this.s2 = await addSearch(this.p2);
		});

		afterEach(function () {
			this.s1 = null;
			this.s2 = null;
		});

		it('should prevent battles from starting if both players are identical', async function () {
			Object.assign(this.s2, this.s1);
			let room;
			try {
				room = await Rooms.createBattle(FORMATID, {p1: this.p1, p2: this.p1, p1team: this.s1.team, p2team: this.s2.team, rated: 1000});
			} catch (e) {}
			assert.equal(room, undefined);
		});

		before(function () {
			this.lockdown = Rooms.global.lockdown;
			Rooms.global.lockdown = true;
		});

		after(function () {
			Rooms.global.lockdown = this.lockdown;
			this.lockdown = null;
		});

		it('should prevent battles from starting if the server is in lockdown', async function () {
			let room = await Rooms.createBattle(FORMATID, {p1: this.p1, p2: this.p2, p1team: this.s1.team, p2team: this.s2.team, rated: 1000});
			assert.equal(room, undefined);
		});
	});
});
