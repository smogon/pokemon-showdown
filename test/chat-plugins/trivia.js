'use strict';

const assert = require('assert');

const trivia = require('../../chat-plugins/trivia.js');
const userUtils = require('../../dev-tools/users-utils.js');

const SCORE_CAPS = trivia.SCORE_CAPS;
const Trivia = trivia.Trivia;
const FirstModeTrivia = trivia.FirstModeTrivia;
const TimerModeTrivia = trivia.TimerModeTrivia;
const NumberModeTrivia = trivia.NumberModeTrivia;
const User = userUtils.User;
const Connection = userUtils.Connection;

function makeUser(name, connection) {
	let user = new User(connection);
	user.userid = toId(name);
	user.name = name;
	return user;
}

describe('Trivia', function () {
	before(function () {
		Rooms.global.addChatRoom('Trivia');

		let room = Rooms('trivia');
		let connection = new Connection('127.0.0.1');
		let user = makeUser('Morfent', connection);
		user.joinRoom(room, connection);

		this.room = room;
		this.user = user;
	});

	beforeEach(function () {
		let questions = [{question: '', answers: ['answer'], category: 'ae'}];
		this.game = new Trivia(this.room, 'first', 'ae', 'short', questions);
	});

	afterEach(function () {
		if (this.room.game) this.room.game.destroy();
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
		// Creating new users makes this test fail (as far as I know),
		// but it passes if we clone another user.
		let user2 = Object.getPrototypeOf(Object.create(this.user));
		user2.name = 'Not Morfent';
		user2.userid = 'notmorfent';
		this.game.addPlayer(this.user);
		this.game.addPlayer(user2);
		assert.strictEqual(this.game.playerCount, 1);
	});

	it('should not add a player if another player had their username previously', function () {
		this.game.addPlayer(this.user);
		let user2 = makeUser('Not Morfent');
		user2.prevNames.morfent = 'Morfent';
		this.game.addPlayer(user2);
		assert.strictEqual(this.game.playerCount, 1);
	});

	it('should not add a player if they were kicked from the game', function () {
		this.game.kickedUsers.add(this.user.userid);
		this.game.addPlayer(this.user);
		assert.strictEqual(this.game.playerCount, 0);
	});

	it('should kick players from the game', function () {
		this.game.addPlayer(this.user);
		this.game.kick(this.user);
		assert.strictEqual(this.game.playerCount, 0);
	});

	it('should not kick players already kicked from the game', function () {
		this.game.addPlayer(this.user);
		this.game.kick(this.user);
		this.game.kick(this.user);
		assert.strictEqual(this.game.playerCount, 0);
	});

	it('should not kick users who were kicked under another name', function () {
		this.game.addPlayer(this.user);
		this.game.kick(this.user);
		this.user.handleRename('Not Morfent', 'notmorfent', false, 2);
		this.game.addPlayer(this.user);
		assert.strictEqual(this.game.playerCount, 0);
	});

	it('should not kick users who were kicked under another IP', function () {
		let user2 = Object.getPrototypeOf(Object.create(this.user));
		user2.name = 'Not Morfent';
		user2.userid = 'notmorfent';
		user2.ips = {'127.0.0.2': 1};
		this.game.addPlayer(this.user);
		this.game.kick(this.user);
		this.game.addPlayer(user2);
		assert.strictEqual(this.game.playerCount, 0);
	});

	it('should not kick users that aren\'t players in the game', function () {
		this.game.kick(this.user);
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

	context('first mode', function () {
		beforeEach(function () {
			let questions = [{question: '', answers: ['answer'], category: 'ae'}];
			let game = new FirstModeTrivia(this.room, 'first', 'ae', 'short', questions);

			game.addPlayer(this.user);
			game.addPlayer(makeUser('user2', new Connection('127.0.0.2')));
			game.addPlayer(makeUser('user3', new Connection('127.0.0.3')));

			game.start();
			game.askQuestion();

			this.game = game;
			this.player = game.players[this.user.userid];
		});

		afterEach(function () {
			if (this.room.game) this.game.destroy();
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
			let game = new TimerModeTrivia(this.room, 'timer', 'ae', 'short', questions);

			game.addPlayer(this.user);
			game.addPlayer(makeUser('user2', new Connection('127.0.0.2')));
			game.addPlayer(makeUser('user3', new Connection('127.0.0.3')));

			game.start();
			game.askQuestion();

			this.game = game;
			this.player = game.players[this.user.userid];
		});

		afterEach(function () {
			if (this.room.game) this.game.destroy();
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
			let player2 = this.game.players.user2;
			this.game.answerQuestion('answer', this.user);
			setImmediate(function () {
				player2.setAnswer('answer', true);
				this.game.tallyAnswers();

				const hrtimeToNanoseconds = hrtime => hrtime[0] * 1e9 + hrtime[1];
				assert.ok(hrtimeToNanoseconds(this.player.answeredAt) <=
					hrtimeToNanoseconds(player2.answeredAt));
				done();
			}.bind(this));
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
			let game = new NumberModeTrivia(this.room, 'number', 'ae', 'short', questions);

			game.addPlayer(this.user);
			game.addPlayer(makeUser('user2', new Connection('127.0.0.2')));
			game.addPlayer(makeUser('user3', new Connection('127.0.0.3')));

			game.start();
			game.askQuestion();

			this.game = game;
			this.player = game.players[this.user.userid];
		});

		afterEach(function () {
			if (this.room.game) this.game.destroy();
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
