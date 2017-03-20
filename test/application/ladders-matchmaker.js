'use strict';

const assert = require('assert');

const {matchmaker, Matchmaker, Search} = require('../../ladders-matchmaker');
const {Connection, User} = require('../../dev-tools/users-utils');

describe('Matchmaker', function () {
	before(function () {
		matchmaker.ladderIpLog.end();
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
		this.p1.resetName();
		this.p1.disconnectAll();
		this.p1.destroy();

		this.p2.resetName();
		this.p2.disconnectAll();
		this.p2.destroy();
	});

	after(function () {
		Object.assign(matchmaker, new Matchmaker());
	});

	it('should add a search', function () {
		let formatid = 'gen7ou';
		let s1 = new Search(this.p1.userid, this.p1.team);
		matchmaker.addSearch(s1, this.p1, formatid);
		assert.ok(matchmaker.searches.has(formatid));

		let formatSearches = matchmaker.searches.get(formatid);
		assert.ok(formatSearches instanceof Set);
		assert.strictEqual(formatSearches.size, 1);
		assert.strictEqual(s1.userid, this.p1.userid);
		assert.strictEqual(s1.team, this.p1.team);
		assert.strictEqual(s1.rating, 1000);
	});

	it('should matchmake users when appropriate', function () {
		let formatid = 'gen7ou';
		let {startBattle} = matchmaker;
		matchmaker.startBattle = () => {
			matchmaker.startBattle = startBattle;
			assert.strictEqual(matchmaker.searches.get(formatid).size, 0);
		};

		let s1 = new Search(this.p1.userid, this.p1.team);
		let s2 = new Search(this.p2.userid, this.p2.team);
		matchmaker.addSearch(s1, this.p1, formatid);
		matchmaker.addSearch(s2, this.p2, formatid);
	});

	it('should matchmake users within a reasonable rating range', function () {
		let formatid = 'gen7ou';
		let {startBattle} = matchmaker;
		matchmaker.startBattle = () => {
			matchmaker.startBattle = startBattle;
			assert.strictEqual(matchmaker.searches.get(formatid).size, 2);
		};

		let s1 = new Search(this.p1.userid, this.p1.team);
		let s2 = new Search(this.p2.userid, this.p2.team, 2000);
		matchmaker.addSearch(s1, this.p1, formatid);
		matchmaker.addSearch(s2, this.p2, formatid);
		matchmaker.startBattle();
	});

	it('should cancel searches', function () {
		let formatid = 'gen7ou';
		let s1 = new Search(this.p1.userid, this.p1.team);
		matchmaker.addSearch(s1, this.p1, formatid);
		matchmaker.cancelSearch(this.p1);
		assert.strictEqual(matchmaker.searches.get(formatid).size, 0);
	});

	it('should periodically matchmake users when appropriate', function () {
		let formatid = 'gen7ou';
		let {startBattle} = matchmaker;
		matchmaker.startBattle = () => {
			matchmaker.startBattle = startBattle;
		};

		let s1 = new Search(this.p1.userid, this.p1.team);
		let s2 = new Search(this.p2.userid, this.p2.team, 2000);
		matchmaker.addSearch(s1, this.p1, formatid);
		matchmaker.addSearch(s2, this.p2, formatid);
		assert.strictEqual(matchmaker.searches.get(formatid).size, 2);

		s2.rating = 1000;
		matchmaker.periodicMatch();
		assert.strictEqual(matchmaker.searches.get(formatid).size, 0);
	});

	// FIXME: a race condition in battles and sockets breaks this test
	it.skip('should create a new battle room after matchmaking', function () {
		let formatid = 'gen7ou';
		let {startBattle} = matchmaker;
		matchmaker.startBattle = (...args) => {
			matchmaker.startBattle = startBattle;
			let room = matchmaker.startBattle(...args);
			assert.ok(room instanceof Rooms.BattleRoom);
		};

		let s1 = new Search(this.p1.userid, this.p1.team);
		let s2 = new Search(this.p1.userid, this.p2.team);
		matchmaker.addSearch(s1, this.p1, formatid);
		matchmaker.addSearch(s2, this.p2, formatid);
	});

	it('should cancel search on disconnect', function () {
		let formatid = 'gen7ou';
		let s1 = new Search(this.p1.userid, this.p1.team);
		matchmaker.addSearch(s1, this.p1, formatid);
		this.p1.onDisconnect(this.p1.connections[0]);
		assert.strictEqual(matchmaker.searches.get(formatid).size, 0);
	});

	it('should cancel search on leaving the global room', function () {
		let formatid = 'gen7ou';
		let s1 = new Search(this.p1.userid, this.p1.team);
		matchmaker.addSearch(s1, this.p1, formatid);
		this.p1.leaveRoom(Rooms.global, this.p1.connections[0], true);
		assert.strictEqual(matchmaker.searches.get(formatid).size, 0);
	});

	it('should cancel search on merge', function () {
		let formatid = 'gen7ou';
		let s1 = new Search(this.p1.userid, this.p1.team);
		matchmaker.addSearch(s1, this.p1, formatid);
		this.p2.merge(this.p1);
		assert.strictEqual(matchmaker.searches.get(formatid).size, 0);
	});
});
