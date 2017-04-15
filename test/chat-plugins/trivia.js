'use strict';

const assert = require('assert');

const userUtils = require('../../dev-tools/users-utils');
const User = userUtils.User;
const Connection = userUtils.Connection;

let SCORE_CAPS;
let Trivia;
let FirstModeTrivia;
let TimerModeTrivia;
let NumberModeTrivia;

function makeUser(name, connection) {
	let user = new User(connection);
	user.forceRename(name, true);
	user.connected = true;
	Users.users.set(user.userid, user);
	user.joinRoom('trivia', connection);
	return user;
}

function destroyUser(user) {
	if (!user || !user.connected) return false;
	user.resetName();
	user.disconnectAll();
	user.destroy();
}

describe('Trivia', function () {
	before(function () {
		// The trivia module cannot be loaded outside of this scope because
		// it makes reference to global.Config in the modules outermost scope,
		// which makes the module fail to be loaded. Within the scope of thess
		// unit test blocks however, Config is defined.
		const trivia = require('../../chat-plugins/trivia');
		SCORE_CAPS = trivia.SCORE_CAPS;
		Trivia = trivia.Trivia;
		FirstModeTrivia = trivia.FirstModeTrivia;
		TimerModeTrivia = trivia.TimerModeTrivia;
		NumberModeTrivia = trivia.NumberModeTrivia;

		Rooms.global.addChatRoom('Trivia');
		this.room = Rooms('trivia');
	});

	beforeEach(function () {
		let questions = [{question: '', answers: ['answer'], category: 'ae'}];
		this.user = makeUser('Morfent', new Connection('127.0.0.1'));
		this.tarUser = makeUser('ReallyNotMorfent', new Connection('127.0.0.2'));
		this.game = this.room.game = new Trivia(this.room, 'first', 'ae', 'short', questions);
	});

	afterEach(function () {
		destroyUser(this.user);
		destroyUser(this.tarUser);
		if (this.room.game) this.room.game.destroy();
	});

	after(function () {
		this.user = null;
		this.tarUser = null;
		this.room.destroy();
		this.room = null;
	});

	it('should have each of its score caps divisible by 5', function () {
		for (let i in SCORE_CAPS) {
			assert.strictEqual(SCORE_CAPS[i] % 5, 0);
		}
	});

	it('should add new players', function () {
		this.game.addPlayer(this.user);
		assert.strictEqual(this.game.playerCount, 1);
	});

	it('should not add a player if they have already joined', function () {
		this.game.addPlayer(this.user);
		this.game.addPlayer(this.user);
		assert.strictEqual(this.game.playerCount, 1);
	});

	it('should not add a player if another one on the same IP has joined', function () {
		this.game.addPlayer(this.user);

		let user2 = makeUser('Not Morfent', new Connection('127.0.0.1'));
		this.game.addPlayer(user2);

		assert.strictEqual(this.game.playerCount, 1);
		destroyUser(user2);
	});

	it('should not add a player if another player had their username previously', function () {
		let userid = this.user.userid;
		let name = this.user.name;
		this.game.addPlayer(this.user);
		this.user.forceRename('Not Morfent', true);
		this.user.prevNames[userid] = name;

		let user2 = makeUser(name, new Connection('127.0.0.3'));
		this.game.addPlayer(user2);

		assert.strictEqual(this.game.playerCount, 1);
		destroyUser(user2);
	});

	it('should not add a player if they were kicked from the game', function () {
		this.game.kickedUsers.add(this.tarUser.userid);
		this.game.addPlayer(this.tarUser);
		assert.strictEqual(this.game.playerCount, 0);
	});

	it('should kick players from the game', function () {
		this.game.addPlayer(this.tarUser);
		this.game.kick(this.tarUser, this.user);
		assert.strictEqual(this.game.playerCount, 0);
	});

	it('should not kick players already kicked from the game', function () {
		this.game.addPlayer(this.tarUser);
		this.game.kick(this.tarUser, this.user);
		let res = this.game.kick(this.tarUser, this.user);
		assert.strictEqual(typeof res, 'string');
	});

	it('should not kick users who were kicked under another name', function () {
		this.game.addPlayer(this.tarUser);
		this.game.kick(this.tarUser, this.user);

		let userid = this.tarUser.userid;
		let name = this.tarUser.name;
		this.tarUser.forceRename('Not Morfent', true);
		this.tarUser.prevNames[userid] = name;
		this.game.addPlayer(this.tarUser);
		assert.strictEqual(this.game.playerCount, 0);
	});

	it('should not add users who were kicked under another IP', function () {
		this.game.addPlayer(this.tarUser);
		this.game.kick(this.tarUser, this.user);

		let name = this.tarUser.name;
		this.tarUser.resetName();

		let user2 = makeUser(name, new Connection('127.0.0.2'));
		this.game.addPlayer(user2);
		assert.strictEqual(this.game.playerCount, 0);
		destroyUser(user2);
	});

	it('should not kick users that aren\'t players in the game', function () {
		this.game.kick(this.tarUser, this.user);
		assert.strictEqual(this.game.playerCount, 0);
	});

	it('should make players leave the game', function () {
		this.game.leave(this.user);
		assert.strictEqual(this.game.players[this.user.userid], undefined);
	});

	it('should not make users who are not players leave the game', function () {
		this.game.leave(this.user);
		let res = this.game.leave(this.user);
		assert.strictEqual(typeof res, 'string');
	});

	it('should verify answers correctly', function () {
		this.game.askQuestion();
		assert.strictEqual(this.game.verifyAnswer('answer'), true);
		assert.strictEqual(this.game.verifyAnswer('anser'), true);
		assert.strictEqual(this.game.verifyAnswer('not the right answer'), false);
	});

	it('should not throw when attempting to broadcast after the game has ended', function () {
		this.game.destroy();
		assert.doesNotThrow(() => this.game.broadcast('ayy', 'lmao'));
	});

	context('first mode', function () {
		beforeEach(function () {
			let questions = [{question: '', answers: ['answer'], category: 'ae'}];
			let game = new FirstModeTrivia(this.room, 'first', 'ae', 'short', questions);

			this.user = makeUser('Morfent', new Connection('127.0.0.1'));
			this.user2 = makeUser('user2', new Connection('127.0.0.2'));
			this.user3 = makeUser('user3', new Connection('127.0.0.3'));

			game.addPlayer(this.user);
			game.addPlayer(this.user2);
			game.addPlayer(this.user3);
			game.start();
			game.askQuestion();

			this.game = this.room.game = game;
			this.player = game.players[this.user.userid];
		});

		afterEach(function () {
			if (this.room.game) this.game.destroy();
			destroyUser(this.user);
			destroyUser(this.user2);
			destroyUser(this.user3);
		});

		it('should calculate player points correctly', function () {
			let points = this.game.calculatePoints();
			assert.strictEqual(points, 5);
		});

		it('should allow users to answer questions correctly', function () {
			this.game.answerQuestion('answer', this.user);
			assert.strictEqual(this.player.correctAnswers, 1);
		});

		it('should mark players who answer incorrectly', function () {
			this.game.answerQuestion('not the right answer', this.user);
			assert.strictEqual(this.player.correctAnswers, 0);
		});

		it('should only reward a player points once per question', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.answerQuestion('answer', this.user);
			assert.strictEqual(this.player.correctAnswers, 1);
		});

		it('should clear player answers if none answer correctly', function () {
			this.game.answerQuestion('not the right answer', this.user);
			this.game.tallyAnswers();
			assert.strictEqual(this.player.answer, '');
		});

		it('should not give NaN points to correct responders', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.tallyAnswers();
			assert.ok(!isNaN(this.player.points));
		});
	});

	context('timer mode', function () {
		beforeEach(function () {
			let questions = [{question: '', answers: ['answer'], category: 'ae'}];
			let game = new TimerModeTrivia(this.room, 'first', 'ae', 'short', questions);

			this.user = makeUser('Morfent', new Connection('127.0.0.1'));
			this.user2 = makeUser('user2', new Connection('127.0.0.2'));
			this.user3 = makeUser('user3', new Connection('127.0.0.3'));

			game.addPlayer(this.user);
			game.addPlayer(this.user2);
			game.addPlayer(this.user3);
			game.start();
			game.askQuestion();

			this.game = this.room.game = game;
			this.player = game.players[this.user.userid];
		});

		afterEach(function () {
			if (this.room.game) this.game.destroy();
			destroyUser(this.user);
			destroyUser(this.user2);
			destroyUser(this.user3);
		});

		it('should calculate points correctly', function () {
			let totalDiff = 1e9;
			let diff = -1;
			for (let i = 6; i--;) {
				diff += totalDiff / 5;
				let points = this.game.calculatePoints(diff, totalDiff);
				assert.strictEqual(points, i);
			}
		});

		it('should set players as having answered correctly or incorrectly', function () {
			this.game.answerQuestion('not the right answer', this.user);
			assert.strictEqual(this.player.isCorrect, false);
			this.game.answerQuestion('answer', this.user);
			assert.strictEqual(this.player.isCorrect, true);
		});

		it('should give points for correct answers', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.tallyAnswers();
			assert.strictEqual(this.player.correctAnswers, 1);
		});

		it('should choose the quicker answerer on tie', function (done) {
			this.game.answerQuestion('answer', this.user);
			setImmediate(() => {
				this.game.answerQuestion('answer', this.user2);
				this.game.tallyAnswers();

				const hrtimeToNanoseconds = hrtime => hrtime[0] * 1e9 + hrtime[1];
				let playerNs = hrtimeToNanoseconds(this.player.answeredAt);
				let player2Ns = hrtimeToNanoseconds(this.game.players[this.user2.userid].answeredAt);
				assert.ok(playerNs <= player2Ns);

				done();
			});
		});

		it('should not give NaN points to correct responders', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.tallyAnswers();
			assert.ok(!isNaN(this.player.points));
		});
	});

	context('number mode', function () {
		beforeEach(function () {
			let questions = [{question: '', answers: ['answer'], category: 'ae'}];
			let game = new NumberModeTrivia(this.room, 'first', 'ae', 'short', questions);

			this.user = makeUser('Morfent', new Connection('127.0.0.1'));
			this.user2 = makeUser('user2', new Connection('127.0.0.2'));
			this.user3 = makeUser('user3', new Connection('127.0.0.3'));

			game.addPlayer(this.user);
			game.addPlayer(this.user2);
			game.addPlayer(this.user3);
			game.start();
			game.askQuestion();

			this.game = this.room.game = game;
			this.player = game.players[this.user.userid];
		});

		afterEach(function () {
			if (this.room.game) this.game.destroy();
			destroyUser(this.user);
			destroyUser(this.user2);
			destroyUser(this.user3);
		});

		it('should calculate points correctly', function () {
			this.game.playerCount = 5;
			for (let i = 1; i <= 5; i++) {
				assert.strictEqual(this.game.calculatePoints(i), 6 - i);
			}
		});

		// Number mode's answerQuestion prototype method is identical
		// to that of timer mode.

		it('should not give points for answering incorrectly', function () {
			this.game.answerQuestion('not the right answer', this.user);
			this.game.tallyAnswers();
			assert.strictEqual(this.player.correctAnswers, 0);
		});

		it('should give points for answering correctly', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.tallyAnswers();
			assert.strictEqual(this.player.correctAnswers, 1);
		});

		it('should not give NaN points to correct responders', function () {
			this.game.answerQuestion('answer', this.user);
			this.game.tallyAnswers();
			assert.ok(!isNaN(this.player.points));
		});
	});
});
