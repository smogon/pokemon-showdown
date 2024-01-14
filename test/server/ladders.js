'use strict';

const assert = require('assert').strict;

global.Ladders = require('../../dist/server/ladders').Ladders;
const {makeUser} = require('../users-utils');

describe('Matchmaker', function () {
	const FORMATID = 'gen7ou';
	const addSearch = (player, rating = 1000, formatid = FORMATID) => {
		const search = new Ladders.BattleReady(player.id, formatid, player.battleSettings, rating);
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
		this.p1 = makeUser('Morfent', '192.168.0.1');
		this.p1.battleSettings.team = 'Gengar||||lick||252,252,4,,,|||||';
		Users.users.set(this.p1.id, this.p1);

		this.p2 = makeUser('Mrofnet', '192.168.0.2');
		this.p2.battleSettings.team = 'Gengar||||lick||252,252,4,,,|||||';
		Users.users.set(this.p2.id, this.p2);
	});

	afterEach(function () {
		this.p1 = destroyPlayer(this.p1);
		this.p2 = destroyPlayer(this.p2);
	});

	it('should add a search', function () {
		const s1 = addSearch(this.p1);
		assert(Ladders.searches.has(FORMATID));

		const formatSearches = Ladders.searches.get(FORMATID).searches;
		assert(formatSearches instanceof Map);
		assert.equal(formatSearches.size, 1);
		assert.equal(s1.userid, this.p1.id);
		assert.equal(s1.settings.team, this.p1.battleSettings.team);
		assert.equal(s1.rating, 1000);
	});

	it('should matchmake users when appropriate', function () {
		addSearch(this.p1);
		addSearch(this.p2);
		assert.equal(Ladders.searches.get(FORMATID).searches.size, 0);

		const [roomid] = [...this.p1.games];
		Rooms.get(roomid).destroy();
	});

	it('should matchmake users within a reasonable rating range', function () {
		addSearch(this.p1);
		addSearch(this.p2, 2000);
		assert.equal(Ladders.searches.get(FORMATID).searches.size, 2);
	});

	it('should cancel searches', function () {
		addSearch(this.p1);
		Ladders(FORMATID).cancelSearch(this.p1);
		Ladders.cancelSearches(this.p2);
		assert.equal(Ladders.searches.get(FORMATID).searches.size, 0);
	});

	it('should periodically matchmake users when appropriate', function () {
		addSearch(this.p1);
		const s2 = addSearch(this.p2, 2000);
		assert.equal(Ladders.searches.get(FORMATID).searches.size, 2);

		s2.rating = 1000;
		Ladders.Ladder.periodicMatch();
		assert.equal(Ladders.searches.get(FORMATID).searches.size, 0);

		const [roomid] = [...this.p1.games];
		Rooms.get(roomid).destroy();
	});

	it('should create a new battle room after matchmaking', function () {
		assert.equal(this.p1.games.size, 0);
		addSearch(this.p1);
		addSearch(this.p2);
		assert.equal(this.p1.games.size, 1);
		for (const roomid of this.p1.games) {
			assert(Rooms.get(roomid).battle);
		}
	});

	it('should cancel search on disconnect', function () {
		addSearch(this.p1);
		this.p1.onDisconnect(this.p1.connections[0]);
		assert.equal(Ladders.searches.get(FORMATID).searches.size, 0);
	});

	it('should cancel search on merge', function () {
		addSearch(this.p1);
		this.p2.merge(this.p1);
		assert.equal(Ladders.searches.get(FORMATID).searches.size, 0);
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
				room = Rooms.createBattle({
					format: FORMATID,
					players: [
						{user: this.p1, team: this.s1.team},
						{user: this.p1, team: this.s2.team},
					],
					rated: 1000,
				});
			} catch {}
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

		it('should prevent battles from starting if the server is in lockdown', function () {
			const room = Rooms.createBattle({
				format: FORMATID,
				players: [{user: this.p1, team: this.s1.team}, {user: this.p2, team: this.s2.team}],
				rated: 1000,
			});
			assert.equal(room, null);
		});
	});
});
