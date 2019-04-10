'use strict';

const assert = require('assert');

const userUtils = require('../../dev-tools/users-utils');
const User = userUtils.User;
const Connection = userUtils.Connection;

let Trivia;
let FirstModeTrivia;
let TimerModeTrivia;
let NumberModeTrivia;

function makeUser(name, connection) {
	let user = new User(connection);
	user.forceRename(name, true);
	user.connected = true;
	Users.users.set(user.userid, user);
	user.joinRoom('global', connection);
	user.joinRoom('trivia', connection);
	return user;
}

function destroyUser(user) {
	if (!user || !user.connected) return false;
	user.resetName();
	user.disconnectAll();
	user.destroy();
}

let room, user, user2, user3, tarUser, game, player;

describe('Trivia', function () {
	beforeAll(function () {
		// The trivia module cannot be loaded outside of this scope because
		// it makes reference to global.Config in the modules outermost scope,
		// which makes the module fail to be loaded. Within the scope of thess
		// unit test blocks however, Config is defined.
		const trivia = require('../../server/chat-plugins/trivia');
		Trivia = trivia.Trivia;
		FirstModeTrivia = trivia.FirstModeTrivia;
		TimerModeTrivia = trivia.TimerModeTrivia;
		NumberModeTrivia = trivia.NumberModeTrivia;

		Rooms.global.addChatRoom('Trivia');
		room = Rooms('trivia');
	});

	beforeEach(function () {
		let questions = [{question: '', answers: ['answer'], category: 'ae'}];
		user = makeUser('Morfent', new Connection('127.0.0.1'));
		tarUser = makeUser('ReallyNotMorfent', new Connection('127.0.0.2'));
		game = room.game = new Trivia(room, 'first', 'ae', 'short', questions);
	});

	afterEach(function () {
		destroyUser(user);
		destroyUser(tarUser);
		if (room.game) {
			clearTimeout(room.game.phaseTimeout);
			room.game.phaseTimeout = null;
			room.game.destroy();
		}
	});

	afterAll(function () {
		user = null;
		tarUser = null;
		room.destroy();
		room = null;
	});

	it('should add new players', function () {
		game.addPlayer(user);
		assert.strictEqual(game.playerCount, 1);
	});

	it('should not add a player if they have already joined', function () {
		game.addPlayer(user);
		game.addPlayer(user);
		assert.strictEqual(game.playerCount, 1);
	});

	it('should not add a player if another one on the same IP has joined', function () {
		game.addPlayer(user);

		let user2 = makeUser('Not Morfent', new Connection('127.0.0.1'));
		game.addPlayer(user2);

		assert.strictEqual(game.playerCount, 1);
		destroyUser(user2);
	});

	it('should not add a player if another player had their username previously', function () {
		let userid = user.userid;
		let name = user.name;
		game.addPlayer(user);
		user.forceRename('Not Morfent', true);
		user.prevNames[userid] = name;

		let user2 = makeUser(name, new Connection('127.0.0.3'));
		game.addPlayer(user2);

		assert.strictEqual(game.playerCount, 1);
		destroyUser(user2);
	});

	it('should not add a player if they were kicked from the game', function () {
		game.kickedUsers.add(tarUser.userid);
		game.addPlayer(tarUser);
		assert.strictEqual(game.playerCount, 0);
	});

	it('should kick players from the game', function () {
		game.addPlayer(tarUser);
		game.kick(tarUser, user);
		assert.strictEqual(game.playerCount, 0);
	});

	it('should not kick players already kicked from the game', function () {
		game.addPlayer(tarUser);
		game.kick(tarUser, user);
		let res = game.kick(tarUser, user);
		assert.strictEqual(typeof res, 'string');
	});

	it('should not kick users who were kicked under another name', function () {
		game.addPlayer(tarUser);
		game.kick(tarUser, user);

		let userid = tarUser.userid;
		let name = tarUser.name;
		tarUser.forceRename('Not Morfent', true);
		tarUser.prevNames[userid] = name;
		game.addPlayer(tarUser);
		assert.strictEqual(game.playerCount, 0);
	});

	it('should not add users who were kicked under another IP', function () {
		game.addPlayer(tarUser);
		game.kick(tarUser, user);

		let name = tarUser.name;
		tarUser.resetName();

		let user2 = makeUser(name, new Connection('127.0.0.2'));
		game.addPlayer(user2);
		assert.strictEqual(game.playerCount, 0);
		destroyUser(user2);
	});

	it('should not kick users that aren\'t players in the game', function () {
		game.kick(tarUser, user);
		assert.strictEqual(game.playerCount, 0);
	});

	it('should make players leave the game', function () {
		game.leave(user);
		assert.strictEqual(game.players[user.userid], undefined);
	});

	it('should not make users who are not players leave the game', function () {
		game.leave(user);
		let res = game.leave(user);
		assert.strictEqual(typeof res, 'string');
	});

	it('should verify answers correctly', function () {
		game.askQuestion();
		assert.strictEqual(game.verifyAnswer('answer'), true);
		assert.strictEqual(game.verifyAnswer('anser'), true);
		assert.strictEqual(game.verifyAnswer('not the right answer'), false);
	});

	it('should not throw when attempting to broadcast after the game has ended', function () {
		game.destroy();
		assert.doesNotThrow(() => game.broadcast('ayy', 'lmao'));
	});

	describe('marking player absence', function () {
		beforeEach(function () {
			let questions = [null, null].fill({question: '', answers: ['answer'], category: 'ae'});
			let game = new FirstModeTrivia(room, 'first', 'ae', 'short', questions);

			user = makeUser('Morfent', new Connection('127.0.0.1'));
			user2 = makeUser('user2', new Connection('127.0.0.2'));
			user3 = makeUser('user3', new Connection('127.0.0.3'));

			user.joinRoom(room);
			game.addPlayer(user);
			user2.joinRoom(room);
			game.addPlayer(user2);
			user3.joinRoom(room);
			game.addPlayer(user3);
			game.start();
			game.askQuestion();
			clearTimeout(game.phaseTimeout);
			game.phaseTimeout = null;

			game = room.game = game;
			player = room.game.players[user.userid];
		});

		afterEach(function () {
			destroyUser(user);
			destroyUser(user2);
			destroyUser(user3);
			if (room.game) {
				clearTimeout(game.phaseTimeout);
				game.phaseTimeout = null;
				game.destroy();
			}
		});

		it('should mark a player absent on leave and pause the game', function () {
			user.leaveRoom(room);
			assert.strictEqual(player.isAbsent, true);
			assert.strictEqual(game.phase, 'limbo');
			assert.strictEqual(game.phaseTimeout, null);
		});

		it('should unpause the game once enough players have returned', function () {
			user.leaveRoom(room);
			user.joinRoom(room);
			assert.strictEqual(player.isAbsent, false);
			assert.strictEqual(game.phase, 'question');
			assert.ok(game.phaseTimeout);
		});
	});

	describe('first mode', function () {
		beforeEach(function () {
			let questions = [{question: '', answers: ['answer'], category: 'ae'}];
			let game = new FirstModeTrivia(room, 'first', 'ae', 'short', questions);

			user = makeUser('Morfent', new Connection('127.0.0.1'));
			user2 = makeUser('user2', new Connection('127.0.0.2'));
			user3 = makeUser('user3', new Connection('127.0.0.3'));

			game.addPlayer(user);
			game.addPlayer(user2);
			game.addPlayer(user3);
			game.start();
			game.askQuestion();

			game = room.game = game;
			player = game.players[user.userid];
		});

		afterEach(function () {
			destroyUser(user);
			destroyUser(user2);
			destroyUser(user3);
			if (room.game) {
				clearTimeout(game.phaseTimeout);
				game.phaseTimeout = null;
				game.destroy();
			}
		});

		it('should calculate player points correctly', function () {
			let points = game.calculatePoints();
			assert.strictEqual(points, 5);
		});

		it('should allow users to answer questions correctly', function () {
			game.answerQuestion('answer', user);
			assert.strictEqual(player.correctAnswers, 1);
		});

		it('should mark players who answer incorrectly', function () {
			game.answerQuestion('not the right answer', user);
			assert.strictEqual(player.correctAnswers, 0);
		});

		it('should only reward a player points once per question', function () {
			game.answerQuestion('answer', user);
			game.answerQuestion('answer', user);
			assert.strictEqual(player.correctAnswers, 1);
		});

		it('should clear player answers if none answer correctly', function () {
			game.answerQuestion('not the right answer', user);
			game.tallyAnswers();
			assert.strictEqual(player.answer, '');
		});

		it('should not give NaN points to correct responders', function () {
			game.answerQuestion('answer', user);
			game.tallyAnswers();
			assert.ok(!isNaN(player.points));
		});
	});

	describe('timer mode', function () {
		beforeEach(function () {
			let questions = [{question: '', answers: ['answer'], category: 'ae'}];
			let game = new TimerModeTrivia(room, 'first', 'ae', 'short', questions);

			user = makeUser('Morfent', new Connection('127.0.0.1'));
			user2 = makeUser('user2', new Connection('127.0.0.2'));
			user3 = makeUser('user3', new Connection('127.0.0.3'));

			game.addPlayer(user);
			game.addPlayer(user2);
			game.addPlayer(user3);
			game.start();
			game.askQuestion();

			game = room.game = game;
			player = game.players[user.userid];
		});

		afterEach(function () {
			destroyUser(user);
			destroyUser(user2);
			destroyUser(user3);
			if (room.game) {
				clearTimeout(game.phaseTimeout);
				game.phaseTimeout = null;
				game.destroy();
			}
		});

		it('should calculate points correctly', function () {
			let totalDiff = 1e9;
			let diff = -1;
			for (let i = 6; i--;) {
				diff += totalDiff / 5;
				let points = game.calculatePoints(diff, totalDiff);
				assert.strictEqual(points, i);
			}
		});

		it('should set players as having answered correctly or incorrectly', function () {
			game.answerQuestion('not the right answer', user);
			assert.strictEqual(player.isCorrect, false);
			game.answerQuestion('answer', user);
			assert.strictEqual(player.isCorrect, true);
		});

		it('should give points for correct answers', function () {
			game.answerQuestion('answer', user);
			game.tallyAnswers();
			assert.strictEqual(player.correctAnswers, 1);
		});

		it('should choose the quicker answerer on tie', function (done) {
			game.answerQuestion('answer', user);
			setImmediate(() => {
				game.answerQuestion('answer', user2);
				game.tallyAnswers();

				const hrtimeToNanoseconds = hrtime => hrtime[0] * 1e9 + hrtime[1];
				let playerNs = hrtimeToNanoseconds(player.answeredAt);
				let player2Ns = hrtimeToNanoseconds(game.players[user2.userid].answeredAt);
				assert.ok(playerNs <= player2Ns);

				done();
			});
		});

		it('should not give NaN points to correct responders', function () {
			game.answerQuestion('answer', user);
			game.tallyAnswers();
			assert.ok(!isNaN(player.points));
		});
	});

	describe('number mode', function () {
		beforeEach(function () {
			let questions = [{question: '', answers: ['answer'], category: 'ae'}];
			let game = new NumberModeTrivia(room, 'first', 'ae', 'short', questions);

			user = makeUser('Morfent', new Connection('127.0.0.1'));
			user2 = makeUser('user2', new Connection('127.0.0.2'));
			user3 = makeUser('user3', new Connection('127.0.0.3'));

			game.addPlayer(user);
			game.addPlayer(user2);
			game.addPlayer(user3);
			game.start();
			game.askQuestion();

			game = room.game = game;
			player = game.players[user.userid];
		});

		afterEach(function () {
			destroyUser(user);
			destroyUser(user2);
			destroyUser(user3);
			if (room.game) {
				clearTimeout(game.phaseTimeout);
				game.phaseTimeout = null;
				game.destroy();
			}
		});

		it('should calculate points correctly', function () {
			game.playerCount = 5;
			for (let i = 1; i <= 5; i++) {
				assert.strictEqual(game.calculatePoints(i), 6 - i);
			}
		});

		// Number mode's answerQuestion prototype method is identical
		// to that of timer mode.

		it('should not give points for answering incorrectly', function () {
			game.answerQuestion('not the right answer', user);
			game.tallyAnswers();
			assert.strictEqual(player.correctAnswers, 0);
		});

		it('should give points for answering correctly', function () {
			game.answerQuestion('answer', user);
			game.tallyAnswers();
			assert.strictEqual(player.correctAnswers, 1);
		});

		it('should not give NaN points to correct responders', function () {
			game.answerQuestion('answer', user);
			game.tallyAnswers();
			assert.ok(!isNaN(player.points));
		});
	});
});
