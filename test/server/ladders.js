'use strict';

const assert = require('assert').strict;

global.Ladders = require('../../dist/server/ladders').Ladders;
const { makeUser } = require('../users-utils');

describe('Matchmaker', () => {
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

	before(() => {
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

	describe('#startBattle', () => {
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
						{ user: this.p1, team: this.s1.team },
						{ user: this.p1, team: this.s2.team },
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
				players: [{ user: this.p1, team: this.s1.team }, { user: this.p2, team: this.s2.team }],
				rated: 1000,
			});
			assert.equal(room, null);
		});
	});

	describe('with ladder bots (Config.ladderbots)', () => {
		let prevLadderbots;
		beforeEach(function () {
			prevLadderbots = Config.ladderbots;
			Config.ladderbots = ['SimBot'];
			this.bot = makeUser('SimBot', '192.168.0.9');
			this.bot.battleSettings.team = 'Gengar||||lick||252,252,4,,,|||||';
			Users.users.set(this.bot.id, this.bot);
		});

		afterEach(function () {
			Config.ladderbots = prevLadderbots;
			this.bot = destroyPlayer(this.bot);
		});

		it('should backfill a lone human with a waiting bot', function () {
			addSearch(this.bot);
			addSearch(this.p1);
			// a lone human + a waiting bot still match instantly (instant games preserved)
			assert.equal(Ladders.searches.get(FORMATID).searches.size, 0);
			assert.equal(this.p1.games.size, 1);
			const [roomid] = [...this.p1.games];
			Rooms.get(roomid).destroy();
		});

		it('should prefer a human opponent over a waiting bot (addSearch)', function () {
			// p1 just played the bot, so p1<->bot can't immediately rematch (lastMatch guard) —
			// this leaves the bot sitting idle in the queue alongside p1.
			this.p1.lastMatch = this.bot.id;
			this.bot.lastMatch = this.p1.id;

			addSearch(this.bot);
			addSearch(this.p1);
			assert.equal(Ladders.searches.get(FORMATID).searches.size, 2);

			addSearch(this.p2);
			const remaining = Ladders.searches.get(FORMATID).searches;
			assert.equal(remaining.size, 1, 'one searcher should be left waiting');
			assert(remaining.has(this.bot.id), 'the bot should be left waiting, not matched');
			assert.equal(this.p1.games.size, 1, 'p1 should have matched the human p2');
			assert.equal(this.p2.games.size, 1);
			const [roomid] = [...this.p1.games];
			Rooms.get(roomid).destroy();
		});

		it('should prefer a human opponent over a bot in periodicMatch', function () {
			// Queue order [p1 human (longest), bot, p2 human]; keep all three idle by searching
			// with out-of-range ratings, then normalize the search ratings and run periodicMatch.
			const sp1 = addSearch(this.p1, 3000);
			addSearch(this.bot, 1000);
			const sp2 = addSearch(this.p2, 5000);
			assert.equal(Ladders.searches.get(FORMATID).searches.size, 3);

			sp1.rating = 1000;
			sp2.rating = 1000;
			Ladders.Ladder.periodicMatch();

			const remaining = Ladders.searches.get(FORMATID).searches;
			assert.equal(remaining.size, 1, 'one searcher should be left waiting');
			assert(remaining.has(this.bot.id), 'the bot should be left waiting, not matched');
			assert.equal(this.p1.games.size, 1, 'the two humans should have matched');
			const [roomid] = [...this.p1.games];
			Rooms.get(roomid).destroy();
		});
	});
});
