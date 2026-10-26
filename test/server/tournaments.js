'use strict';

const assert = require('assert').strict;
const { makeUser } = require('../users-utils');
let Tournament;
const { Elimination } = require('../../dist/server/tournaments/generator-elimination');
const { RoundRobin } = require('../../dist/server/tournaments/generator-round-robin');

describe('Tournament automatic pairing', () => {
	let tour, room, users, battles, replies, originalPrep, originalCreate;
	const context = user => ({ connection: user.connections[0], sendReply: msg => replies.push(msg), modlog() {} });
	const ready = player => tour.ready(Users.getExact(player.id), context(Users.getExact(player.id)));
	const getUpdate = user => {
		const messages = [];
		tour.updateFor(user, { sendTo: (target, message) => messages.push(message) });
		return Object.assign({}, ...messages.filter(m => m.startsWith('|tournament|update|'))
			.map(m => JSON.parse(m.slice('|tournament|update|'.length))));
	};
	const start = (generator = new RoundRobin('')) => {
		tour.setGenerator(generator, context(users[0]));
		tour.startTournament(context(users[0]));
	};

	before(() => {
		({ Tournament } = require('../../dist/server/tournaments'));
	});

	beforeEach(() => {
		replies = [];
		battles = [];
		room = Rooms.createChatRoom('tournamenttest', 'Tournament test', { isPrivate: true });
		tour = new Tournament(room, Dex.formats.get('gen9customgame'), new RoundRobin(''), '0', false);
		room.game = tour;
		users = [0, 1, 2].map(i => {
			const user = makeUser(`Tournament Player ${i}`, `127.0.0.${i + 1}`);
			user.battleSettings.team = 'Pikachu||||thunderbolt|||||||';
			user.joinRoom(room.roomid);
			tour.addUser(user, context(user));
			return user;
		});
		originalPrep = Ladders.Ladder.prototype.prepBattle;
		Ladders.Ladder.prototype.prepBattle = async function (connection) {
			return new Ladders.BattleReady(connection.user.id, this.formatid, { ...connection.user.battleSettings });
		};
		originalCreate = Rooms.createBattle;
		Rooms.createBattle = options => {
			const battle = {
				roomid: `battle-tournamenttest-${battles.length + 1}`,
				p1: options.players[0].user, p2: options.players[1].user,
				game: { score: [1, 0], startTimer() {} },
				setParent() {}, addRaw() { return this; }, update() {},
				options,
			};
			battles.push(battle);
			return battle;
		};
	});

	afterEach(() => {
		Ladders.Ladder.prototype.prepBattle = originalPrep;
		Rooms.createBattle = originalCreate;
		if (!tour.ended) tour.forceEnd();
		room.destroy();
		for (const battle of battles) battle.destroy?.();
		for (const user of users) {
			user.disconnectAll();
			user.destroy();
		}
	});

	it('commits available pairings before either player is ready', async () => {
		const fourth = makeUser('Tournament Player 3', '127.0.0.4');
		fourth.battleSettings.team = users[0].battleSettings.team;
		users.push(fourth);
		fourth.joinRoom(room.roomid);
		tour.addUser(fourth, context(fourth));
		start();
		const [p1, p2, p3, p4] = tour.players;
		const firstMatch = p1.pendingMatch;
		const secondMatch = p3.pendingMatch;
		assert(firstMatch.includes(p2));
		assert(secondMatch.includes(p4));
		await ready(p1);
		await ready(p3);
		assert.equal(battles.length, 0);
		tour.cancelReady(users[0], context(users[0]));
		assert.equal(p1.pendingMatch, firstMatch);
		assert.equal(p3.pendingMatch, secondMatch);
		await ready(p1);
		await ready(p2);
		await ready(p4);
		assert.equal(battles.length, 2);
	});

	it('offers a placeholder challenge while waiting and supports the old Ready and Cancel commands', async () => {
		start();
		const user = users[2];
		const player = tour.players[2];
		assert.equal(getUpdate(user).challenged, '(next available player)');
		await Chat.parse('/tour acceptchallenge', room, user, user.connections[0]);
		assert(player.ready);
		assert.equal(getUpdate(user).challenging, '(next available player)');
		assert.equal(getUpdate(user).challenged, null);
		await Chat.parse('/tour cancelchallenge', room, user, user.connections[0]);
		assert.equal(player.ready, null);
		assert.equal(getUpdate(user).challenged, '(next available player)');
		assert.equal(getUpdate(user).challenging, null);
	});

	it('updates both players when a disqualification makes a new pairing available', async () => {
		start();
		await ready(tour.players[1]);
		assert.equal(getUpdate(users[1]).challenging, users[0].name);
		tour.disqualifyUser(users[0].id);
		assert.equal(getUpdate(users[1]).challenging, users[2].name);
		assert.equal(getUpdate(users[2]).challenged, users[1].name);
		await ready(tour.players[2]);
		assert.equal(battles.length, 1);
	});

	it('does not disqualify an unpaired player waiting for a match', () => {
		start();
		tour.autoDisqualifyTimeout = 60000;
		const waiting = tour.players[2];
		waiting.lastActionTime = Date.now() - 120000;
		waiting.autoDisqualifyWarned = true;
		tour.runAutoDisqualify();
		assert.equal(waiting.isDisqualified, false);
		assert.equal(waiting.autoDisqualifyWarned, false);
	});

	it('gives an unready player a full AutoDQ window to choose a team after their opponent is known', async () => {
		start();
		tour.autoDisqualifyTimeout = 60000;
		const waiting = tour.players[2];
		const waitingUser = users[2];
		await ready(tour.players[0]);
		await ready(tour.players[1]);

		// Waiting for the previous battle must not use up the time to choose a team.
		waiting.lastActionTime = Date.now() - 120000;
		tour.runAutoDisqualify();
		assert.equal(waiting.pendingMatch, null);
		assert.equal(waiting.isDisqualified, false);
		assert.equal(waiting.autoDisqualifyWarned, false);

		const revealedAt = Date.now();
		tour.onBattleWin(battles[0], battles[0].p1.id);
		const opponent = waiting.pendingMatch.find(player => player !== waiting);
		assert.equal(getUpdate(waitingUser).challenged, opponent.name);
		assert(waiting.lastActionTime >= revealedAt);
		tour.runAutoDisqualify();
		assert.equal(waiting.isDisqualified, false);
		assert.equal(waiting.autoDisqualifyWarned, false);

		await ready(opponent);
		assert.equal(battles.length, 1);
		const team = 'Gengar||||shadowball|||||||';
		await Chat.parse(`/utm ${team}`, room, waitingUser, waitingUser.connections[0]);
		await ready(waiting);
		assert.equal(battles.length, 2);
		assert.equal(battles[1].options.players.find(player => player.user === waitingUser).team, team);
	});

	it('pairs ready players automatically in either bracket orientation', async () => {
		start();
		const [p1, p2] = tour.players;
		await ready(p1);
		assert(p1.ready);
		assert.equal(battles.length, 0);
		await ready(p2);
		assert.equal(battles.length, 1);
		assert.deepEqual(battles[0].options.players.map(p => p.user.id), [p2.id, p1.id]);
		assert.equal(p1.ready, null);
		assert.equal(p2.ready, null);
		assert(p1.isBusy && p2.isBusy);
		assert.equal(getUpdate(users[0]).challenged, null);
		assert.equal(getUpdate(users[0]).challenging, null);
		await ready(p1);
		assert.equal(battles.length, 1);
	});

	it('keeps a bye player ready until the next round becomes available', async () => {
		start(new Elimination('1'));
		const [pair] = tour.generator.getAvailableMatches();
		const waiting = tour.players.find(p => !pair.includes(p));
		assert.equal(waiting.pendingMatch, null);
		await ready(waiting);
		await ready(pair[0]);
		await ready(pair[1]);
		const battle = battles[0];
		tour.onBattleWin(battle, battle.p1.id);
		assert(waiting.ready);
		assert.equal(battles.length, 1);
		await ready(pair[0]);
		assert.equal(battles.length, 2);
		assert.equal(waiting.ready, null);
	});

	it('queues while eligible opponents are busy without choosing one', async () => {
		start();
		await ready(tour.players[0]);
		await ready(tour.players[1]);
		await ready(tour.players[2]);
		assert(tour.players[2].ready);
		assert.equal(tour.players[2].pendingMatch, null);
		tour.onBattleWin(battles[0], battles[0].p1.id);
		await ready(tour.players[0]);
		assert.equal(battles.length, 2);
		assert(battles[1].options.players.some(p => p.user === users[2]));
	});

	it('does not reuse readiness for another match in double round robin', async () => {
		start(new RoundRobin('2'));
		await ready(tour.players[0]);
		await ready(tour.players[1]);
		tour.onBattleWin(battles[0], battles[0].p1.id);
		assert.equal(battles.length, 1);
		assert.equal(tour.players[0].ready, null);
		assert.equal(tour.players[1].ready, null);
	});

	it('cancels readiness without affecting another waiting player', async () => {
		start();
		await ready(tour.players[0]);
		tour.cancelReady(users[0], context(users[0]));
		await ready(tour.players[1]);
		assert.equal(battles.length, 0);
		assert(tour.players[1].ready);
	});

	it('ignores cancelled validation and prevents duplicate submissions', async () => {
		start();
		let resolve, calls = 0;
		Ladders.Ladder.prototype.prepBattle = () => {
			calls++;
			return new Promise(res => { resolve = res; });
		};
		const pending = ready(tour.players[0]);
		await ready(tour.players[0]);
		assert.equal(calls, 1);
		tour.cancelReady(users[0], context(users[0]));
		resolve(new Ladders.BattleReady(users[0].id, tour.fullFormat, users[0].battleSettings));
		await pending;
		assert.equal(tour.players[0].ready, null);
	});

	it('clears readiness when a player leaves the room', async () => {
		start();
		await ready(tour.players[0]);
		users[0].leaveRoom(room.roomid);
		await ready(tour.players[1]);
		assert.equal(tour.players[0].ready, null);
		assert.equal(battles.length, 0);
	});

	it('does not start battles after a disqualification or tournament end during validation', async () => {
		for (const end of [false, true]) {
			if (!tour.isTournamentStarted) start();
			let resolve;
			Ladders.Ladder.prototype.prepBattle = () => new Promise(res => { resolve = res; });
			const player = tour.players[end ? 1 : 0];
			const pending = ready(player);
			if (end) tour.forceEnd();
			else tour.disqualifyUser(player.id);
			resolve(new Ladders.BattleReady(player.id, tour.fullFormat, users[0].battleSettings));
			await pending;
			assert.equal(player.ready, null);
			assert.equal(battles.length, 0);
		}
	});

	it('only disqualifies unready players, regardless of bracket orientation', async () => {
		start();
		tour.autoDisqualifyTimeout = 60000;
		await ready(tour.players[1]);
		for (const player of tour.players) {
			player.lastActionTime = Date.now() - 120000;
			player.autoDisqualifyWarned = true;
		}
		tour.runAutoDisqualify();
		assert(tour.players[0].isDisqualified);
		assert(!tour.players[1].isDisqualified);
	});

	for (const checkWhileReady of [false, true]) {
		it(`preserves AutoDQ after ready/cancel${checkWhileReady ? ' with a check while ready' : ''}`, async () => {
			start();
			tour.autoDisqualifyTimeout = 60000;
			const player = tour.players[0];
			const lastActionTime = Date.now() - 45000;
			player.lastActionTime = lastActionTime;
			tour.runAutoDisqualify();
			assert.equal(player.autoDisqualifyWarned, true);

			await ready(player);
			if (checkWhileReady) tour.runAutoDisqualify();
			assert.equal(player.isDisqualified, false);
			tour.cancelReady(users[0], context(users[0]));
			assert.equal(player.lastActionTime, lastActionTime);
			assert.equal(player.autoDisqualifyWarned, true);

			// Advance past the deadline without waiting for the real timer.
			player.lastActionTime = Date.now() - 65000;
			tour.runAutoDisqualify();
			assert.equal(player.isDisqualified, true);
		});
	}

	it('resets AutoDQ when a new opponent is assigned', async () => {
		start();
		tour.autoDisqualifyTimeout = 60000;
		const player = tour.players[0];
		const lastActionTime = Date.now() - 45000;
		player.lastActionTime = lastActionTime;
		tour.runAutoDisqualify();
		assert.equal(player.autoDisqualifyWarned, true);
		await ready(player);

		tour.disqualifyUser(users[1].id);
		assert(player.pendingMatch.includes(tour.players[2]));
		assert(player.lastActionTime > lastActionTime);
		assert.equal(player.autoDisqualifyWarned, false);
		tour.cancelReady(users[0], context(users[0]));
		tour.runAutoDisqualify();
		assert.equal(player.isDisqualified, false);
		assert.equal(player.autoDisqualifyWarned, false);
	});

	it('releases both players if battle creation fails', async () => {
		start();
		Rooms.createBattle = () => undefined;
		await ready(tour.players[0]);
		await ready(tour.players[1]);
		for (const player of tour.players.slice(0, 2)) {
			assert.equal(player.isBusy, false);
			assert.equal(player.ready, null);
		}
	});

	it('does not transfer pending validation to a replacement', async () => {
		start();
		const player = tour.players[0];
		let resolve;
		Ladders.Ladder.prototype.prepBattle = () => new Promise(res => { resolve = res; });
		const pending = ready(player);
		const replacement = makeUser('Tournament replacement', '127.0.0.4');
		users.push(replacement);
		replacement.joinRoom(room.roomid);
		tour.replaceUser(users[0], replacement, context(users[0]));
		resolve(new Ladders.BattleReady(users[0].id, tour.fullFormat, users[0].battleSettings));
		await pending;
		assert.equal(player.id, replacement.id);
		assert.equal(player.ready, null);
	});

	it('reports readiness on reconnect using the existing challenge protocol', async () => {
		start();
		await ready(tour.players[0]);
		const update = getUpdate(users[0]);
		assert.equal(update.challenged, null);
		assert.equal(update.challenging, users[1].name);
		assert.deepEqual(update.challenges, []);
		assert.deepEqual(update.challengeBys, []);
		for (const field of ['autoMatch', 'isReady', 'isBusy']) assert(!(field in update));
	});

	it('allows a corrected team to be submitted after validation fails', async () => {
		start();
		Ladders.Ladder.prototype.prepBattle = originalPrep;
		const user = users[0];
		const team = user.battleSettings.team;
		user.battleSettings.team = '';
		await ready(tour.players[0]);
		assert.equal(tour.players[0].ready, null);
		assert.equal(tour.players[0].readyRequest, null);
		user.battleSettings.team = team;
		await ready(tour.players[0]);
		assert(tour.players[0].ready);
	});

	it('starts a real tournament battle with the tournament room as its parent', async () => {
		start();
		Rooms.createBattle = options => {
			const battle = originalCreate.call(Rooms, options);
			battles.push(battle);
			return battle;
		};
		await ready(tour.players[0]);
		await ready(tour.players[1]);
		assert.equal(battles.length, 1);
		assert.equal(battles[0].tour, tour);
		assert.equal(battles[0].parent, room);
		assert.equal(tour.players[1].inProgressMatch.room, battles[0]);
	});

	it('validates teams before readying and keeps the submitted team and privacy settings', async () => {
		start();
		Ladders.Ladder.prototype.prepBattle = originalPrep;
		users[0].battleSettings.hidden = true;
		await ready(tour.players[0]);
		assert(tour.players[0].ready);
		const team = tour.players[0].ready.settings.team;
		users[0].battleSettings.team = '';
		await ready(tour.players[1]);
		const submitted = battles[0].options.players.find(p => p.user === users[0]);
		assert.equal(submitted.team, team);
		assert.equal(submitted.hidden, true);
	});
});
