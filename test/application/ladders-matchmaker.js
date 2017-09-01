'use strict';

const assert = require('assert');

const {matchmaker, Matchmaker, Search} = require('../../ladders-matchmaker');
const {Connection, User} = require('../../dev-tools/users-utils');

describe('Matchmaker', function () {
	const FORMATID = 'gen7ou';
	const addSearch = (player, rating = 1000, formatid = FORMATID) => {
		let search = new Search(player.userid, player.team, rating);
		matchmaker.addSearch(search, player, formatid);
		return search;
	};
	const destroyPlayer = player => {
		player.resetName();
		player.disconnectAll();
		player.destroy();
		return player;
	};

	before(function () {
		Rooms.global.ladderIpLog.end();
		clearInterval(matchmaker.periodicMatchInterval);
		matchmaker.periodicMatchInterval = null;
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

	after(function () {
		Object.assign(matchmaker, new Matchmaker());
	});

	it('should add a search', function () {
		let s1 = addSearch(this.p1);
		assert.ok(matchmaker.searches.has(FORMATID));

		let formatSearches = matchmaker.searches.get(FORMATID);
		assert.ok(formatSearches instanceof Set);
		assert.strictEqual(formatSearches.size, 1);
		assert.strictEqual(s1.userid, this.p1.userid);
		assert.strictEqual(s1.team, this.p1.team);
		assert.strictEqual(s1.rating, 1000);
	});

	it('should matchmake users when appropriate', function () {
		addSearch(this.p1);
		addSearch(this.p2);
		assert.strictEqual(matchmaker.searches.get(FORMATID).size, 0);
	});

	it('should matchmake users within a reasonable rating range', function () {
		let {startBattle} = matchmaker;
		matchmaker.startBattle = () => {
			matchmaker.startBattle = startBattle;
			assert.strictEqual(matchmaker.searches.get(FORMATID).size, 2);
		};

		addSearch(this.p1);
		addSearch(this.p2, 2000);
		matchmaker.startBattle();
	});

	it('should cancel searches', function () {
		addSearch(this.p1);
		matchmaker.cancelSearch(this.p1, FORMATID);
		assert.strictEqual(matchmaker.searches.get(FORMATID).size, 0);
	});

	it('should periodically matchmake users when appropriate', function () {
		let {startBattle} = matchmaker;
		matchmaker.startBattle = () => {
			matchmaker.startBattle = startBattle;
		};

		addSearch(this.p1);
		let s2 = addSearch(this.p2, 2000);
		assert.strictEqual(matchmaker.searches.get(FORMATID).size, 2);

		s2.rating = 1000;
		matchmaker.periodicMatch();
		assert.strictEqual(matchmaker.searches.get(FORMATID).size, 0);
	});

	// FIXME: a race condition in battles and sockets breaks this test
	it.skip('should create a new battle room after matchmaking', function () {
		let {startBattle} = matchmaker;
		matchmaker.startBattle = (...args) => {
			matchmaker.startBattle = startBattle;
			let room = matchmaker.startBattle(...args);
			assert.ok(room instanceof Rooms.BattleRoom);
		};

		addSearch(this.p1);
		addSearch(this.p2);
	});

	it('should cancel search on disconnect', function () {
		addSearch(this.p1);
		this.p1.onDisconnect(this.p1.connections[0]);
		assert.strictEqual(matchmaker.searches.get(FORMATID).size, 0);
	});

	it('should cancel search on leaving the global room', function () {
		addSearch(this.p1);
		this.p1.leaveRoom(Rooms.global, this.p1.connections[0], true);
		assert.strictEqual(matchmaker.searches.get(FORMATID).size, 0);
	});

	it('should cancel search on merge', function () {
		addSearch(this.p1);
		this.p2.merge(this.p1);
		assert.strictEqual(matchmaker.searches.get(FORMATID).size, 0);
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
