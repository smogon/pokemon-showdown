'use strict';

const assert = require('assert').strict;

const { makeUser, destroyUser } = require('../../users-utils');

describe('Scavengers', () => {
	function makeScavUser(name, ip) {
		const user = makeUser(name, ip);
		assert.equal(Users.users.get(user.id), user);
		user.joinRoom('scavengers');
		return user;
	}

	function runCommand(user, cmd) {
		const connection = user.connections[0];
		const room = Rooms.get('scavengers');
		const context = new Chat.CommandContext({
			message: cmd,
			room,
			user,
			connection,
		});
		return context.parse();
	}

	before(function () {
		Rooms.global.addChatRoom('Scavengers');
		this.room = Rooms.get('scavengers');
		Chat.loadPlugins();
	});

	beforeEach(function () {
		this.staffUser = makeScavUser('PartMan', '192.168.1.1');
		this.staffUser.tempGroup = '@';

		this.user1 = makeScavUser('FakePart', '192.168.1.2');
		this.user2 = makeScavUser('Azref', '192.168.1.3');
		this.user3 = makeScavUser('Zwelte', '192.168.1.4');
		this.user4 = makeScavUser('Nalsei', '192.168.1.5');
	});

	afterEach(function () {
		destroyUser(this.staffUser);
		destroyUser(this.user1);
		destroyUser(this.user2);
		destroyUser(this.user3);
		destroyUser(this.user4);

		if (this.room.game) {
			if (this.room.game.timer) {
				clearTimeout(this.room.game.timer);
				this.room.game.timer = null;
			}
			this.room.game.destroy();
		}
	});

	after(function () {
		this.staffUser = null;
		this.user1 = null;
		this.user2 = null;
		this.user3 = null;
		this.user4 = null;
		this.room.destroy();
		this.room = null;
	});

	it('should create a new scavenger hunt', async function () {
		await runCommand(
			this.staffUser,
			"/starthunt PartMan | Question 1 | Answer 1 | Question 2 | Answer 2 | Question 3 | Answer 3; Answer 3 alt"
		);

		assert(this.room.game);
		assert.equal(this.room.game.gameid, 'scavengerhunt');
		assert.equal(this.room.game.questions.length, 3);
		assert.equal(this.room.game.gameType, 'regular');

		assert.equal(this.room.game.questions[0].hint, 'Question 1');
		assert.deepEqual(this.room.game.questions[0].answer, ['Answer 1']);
		assert.equal(this.room.game.questions[1].hint, 'Question 2');
		assert.deepEqual(this.room.game.questions[1].answer, ['Answer 2']);
		assert.equal(this.room.game.questions[2].hint, 'Question 3');
		assert.deepEqual(this.room.game.questions[2].answer, [
			'Answer 3',
			'Answer 3 alt',
		]);
	});

	context('joining a hunt', () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starthunt PartMan | Question 1 | Answer 1 | Question 2 | Answer 2 | Question 3 | Answer 3; Answer 3 alt"
			);
		});

		it('should allow users to join the hunt', async function () {
			await runCommand(this.user1, '/joinhunt');
			assert(this.room.game.playerTable[this.user1.id]);
			assert.equal(this.room.game.playerCount, 1);
		});

		it('should not allow the host to join their own hunt', async function () {
			await runCommand(this.staffUser, '/joinhunt');
			assert.equal(this.room.game.playerTable[this.staffUser.id], undefined);
			assert.equal(this.room.game.playerCount, 0);
		});

		it('should not allow users with the same IP to join', async function () {
			await runCommand(this.user1, '/joinhunt');
			const sameIpUser = makeScavUser('SameIPUser', '192.168.1.2');
			await runCommand(sameIpUser, '/joinhunt');
			assert.equal(this.room.game.playerCount, 1);
			destroyUser(sameIpUser);
		});

		it('should allow multiple different users to join', async function () {
			await runCommand(this.user1, '/joinhunt');
			await runCommand(this.user2, '/joinhunt');
			await runCommand(this.user3, '/joinhunt');
			await runCommand(this.user4, '/joinhunt');
			assert.equal(this.room.game.playerCount, 4);
		});

		it('should not allow the same user to join twice', async function () {
			await runCommand(this.user1, '/joinhunt');
			await runCommand(this.user1, '/joinhunt');
			// Player count should remain 1 (second join should be ignored)
			assert.equal(this.room.game.playerCount, 1);
		});
	});

	context('solving a hunt', () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starthunt PartMan | Question 1 | Answer 1 | Question 2 | Answer 2 | Question 3 | Answer 3; Answer 3 alt"
			);

			await runCommand(this.user1, '/joinhunt');
			await runCommand(this.user2, '/joinhunt');
			this.player1 = this.room.game.playerTable[this.user1.id];
			this.player2 = this.room.game.playerTable[this.user2.id];
		});

		it('should accept correct answers', async function () {
			assert.equal(this.player1.currentQuestion, 0);
			// Correct answer should work
			await runCommand(this.user1, '/scavenge Answer 1');
			assert.equal(this.player1.currentQuestion, 1);
			// Answer should be normalized before checking
			await runCommand(this.user1, '/scavenge a n s w é r 2');
			assert.equal(this.player1.currentQuestion, 2);
		});

		it('should reject incorrect answers', async function () {
			assert.equal(this.player1.currentQuestion, 0);
			// Wrong answer should not advance
			await runCommand(this.user1, '/scavenge Wrong');
			assert.equal(this.player1.currentQuestion, 0);
		});

		it('should accept alternative answers', async function () {
			await runCommand(this.user1, '/scavenge Answer 1');
			assert.equal(this.player1.currentQuestion, 1);

			await runCommand(this.user1, '/scavenge Answer 2');
			assert.equal(this.player1.currentQuestion, 2);

			// Question 3 accepts both 'Answer 3' and 'Answer 3 alt'
			await runCommand(this.user1, '/scavenge Answer 3 alt');
			assert.equal(this.player1.currentQuestion, 3);
			assert.equal(this.player1.completed, true);
		});

		it('should auto-join users who guess without joining first', async function () {
			const user4InGame = !!this.room.game.playerTable[this.user4.id];
			assert.equal(user4InGame, false);

			// Guessing should auto-join
			await runCommand(this.user4, '/scavenge Answer 1');
			assert(this.room.game.playerTable[this.user4.id]);
		});
	});

	context('finishing a hunt', () => {
		beforeEach(async function () {
			this.room.log.log = []; // Reset chat logs

			await runCommand(
				this.staffUser,
				"/starthunt PartMan | Question 1 | Answer 1 | Question 2 | Answer 2 | Question 3 | Answer 3; Answer 3 alt"
			);

			await runCommand(this.user1, '/joinhunt');
			await runCommand(this.user2, '/joinhunt');
			await runCommand(this.user3, '/joinhunt');
			await runCommand(this.user4, '/joinhunt');
		});

		it('should mark player as completed when all questions are answered', async function () {
			const player = this.room.game.playerTable[this.user1.id];
			assert.equal(player.completed, false);

			await runCommand(this.user1, '/scavenge Answer 1');
			assert.equal(player.completed, false);

			await runCommand(this.user1, '/scavenge Answer 2');
			assert.equal(player.completed, false);

			await runCommand(this.user1, '/scavenge Answer 3');
			assert.equal(player.completed, true);
		});

		it('should broadcast completion', async function () {
			const log = this.room.log.log;
			assert(!log.some(message => message.includes('<em>FakePart</em> has finished the hunt')));
			await runCommand(this.user1, '/scavenge Answer 1');
			await runCommand(this.user1, '/scavenge Answer 2');
			await runCommand(this.user1, '/scavenge Answer 3');

			assert(log.some(message => message.includes('<em>FakePart</em> has finished the hunt')));
		});

		it('should track completion order', async function () {
			// User1 finishes first
			await runCommand(this.user1, '/scavenge Answer 1');
			await runCommand(this.user1, '/scavenge Answer 2');
			await runCommand(this.user1, '/scavenge Answer 3');

			// User3 joins before User2 but will finish after
			await runCommand(this.user3, '/scavenge Answer 1');
			// User2 finishes second
			await runCommand(this.user2, '/scavenge Answer 1');
			await runCommand(this.user2, '/scavenge Answer 2');
			await runCommand(this.user2, '/scavenge Answer 3');

			// User3 finishes third
			await runCommand(this.user3, '/scavenge Answer 2');
			await runCommand(this.user3, '/scavenge Answer 3');

			assert.equal(this.room.game.completed.length, 3);
			assert.equal(this.room.game.completed[0].id, this.user1.id);
			assert.equal(this.room.game.completed[1].id, this.user2.id);
			assert.equal(this.room.game.completed[2].id, this.user3.id);
		});

		it('should not allow completed players to answer again', async function () {
			const player = this.room.game.playerTable[this.user1.id];

			await runCommand(this.user1, '/scavenge Answer 1');
			await runCommand(this.user1, '/scavenge Answer 2');
			await runCommand(this.user1, '/scavenge Answer 3');
			assert.equal(player.completed, true);

			// Completed player's question should stay at 3 (all done)
			await runCommand(this.user1, '/scavenge anything');
			assert.equal(player.currentQuestion, 3);
		});

		it('should properly end the hunt', async function () {
			// Have some users complete
			await runCommand(this.user1, '/scavenge Answer 1');
			await runCommand(this.user1, '/scavenge Answer 2');
			await runCommand(this.user1, '/scavenge Answer 3');
			await runCommand(this.user2, '/scavenge Answer 1');
			await runCommand(this.user2, '/scavenge Answer 2');
			await runCommand(this.user2, '/scavenge Answer 3');

			// End the hunt
			await runCommand(this.staffUser, '/endhunt');

			// Game should be destroyed
			assert.equal(this.room.game, null);
		});

		it('should allow resetting the hunt', async function () {
			await runCommand(this.user1, '/scavenge Answer 1');

			// Reset the hunt
			await runCommand(this.staffUser, '/resethunt');

			// Game should be destroyed
			assert.equal(this.room.game, null);
		});
	});

	context('leaving a hunt', () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starthunt PartMan | Question 1 | Answer 1 | Question 2 | Answer 2 | Question 3 | Answer 3; Answer 3 alt"
			);

			await runCommand(this.user1, '/joinhunt');
			await runCommand(this.user2, '/joinhunt');
		});

		it('should allow players to leave the hunt', async function () {
			assert.equal(this.room.game.playerCount, 2);
			await runCommand(this.user1, '/leavehunt');
			assert.equal(this.room.game.playerCount, 1);
			assert.equal(this.room.game.playerTable[this.user1.id], undefined);
		});

		it('should track users who left', async function () {
			await runCommand(this.user1, '/leavehunt');
			assert.equal(this.room.game.leftHunt[this.user1.id], 1);
		});

		it('should not allow completed players to leave', async function () {
			const player = this.room.game.playerTable[this.user1.id];

			await runCommand(this.user1, '/scavenge Answer 1');
			await runCommand(this.user1, '/scavenge Answer 2');
			await runCommand(this.user1, '/scavenge Answer 3');
			assert.equal(player.completed, true);

			// Completed players cannot leave
			await runCommand(this.user1, '/leavehunt');
			// Player should still be in the table (not removed)
			assert(this.room.game.playerTable[this.user1.id]);
		});
	});
});
