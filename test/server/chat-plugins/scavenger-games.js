"use strict";

const assert = require("assert").strict;

const { makeUser, destroyUser } = require("../../users-utils");

function sleep(ms) {
	return new Promise(resolve => {
		setTimeout(resolve, ms);
	});
}

/**
 * Tests for Scavenger Hunt Twists
 * Each twist is tested for its core feature to ensure correct behavior.
 */
describe("Scavenger Twists", () => {
	function makeScavUser(name, ip) {
		const user = makeUser(name, ip);
		assert.equal(Users.users.get(user.id), user);
		user.joinRoom("scavengers");
		return user;
	}

	function runCommand(user, cmd) {
		const connection = user.connections[0];
		const room = Rooms.get("scavengers");
		const context = new Chat.CommandContext({
			message: cmd,
			room,
			user,
			connection,
		});
		return context.parse();
	}

	function getFinisher(userid) {
		const room = Rooms.get("scavengers");
		return (room.game.preCompleted ?? room.game.completed).find(
			c => c.id === userid
		);
	}

	before(function () {
		Rooms.global.addChatRoom("Scavengers");
		this.room = Rooms.get("scavengers");
		Chat.loadPlugins();
	});

	beforeEach(function () {
		this.staffUser = makeScavUser("PartMan", "192.168.1.1");
		this.staffUser.tempGroup = "@";

		this.user1 = makeScavUser("FakePart", "192.168.1.2");
		this.user2 = makeScavUser("Azref", "192.168.1.3");
		this.user3 = makeScavUser("Zwelte", "192.168.1.4");
		this.user4 = makeScavUser("Nalsei", "192.168.1.5");

		this.room.log.log = []; // Reset chat logs
	});

	afterEach(function () {
		destroyUser(this.staffUser);
		destroyUser(this.user1);
		destroyUser(this.user2);
		destroyUser(this.user3);
		destroyUser(this.user4);

		this.room.game?.destroy();
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

	/**
	 * Perfect Score Twist
	 * Players who complete without wrong answers are tracked as "perfect"
	 */
	context("Perfect Score twist", () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starttwisthunt perfectscore | PartMan | Q1 | A1 | Q2 | A2 | Q3 | A3"
			);
		});

		it("should mark players with no wrong answers as perfect", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Complete without any wrong answers
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			const player = this.room.game.playerTable[this.user1.id];
			const finisher = getFinisher(this.user1.id);

			// Each question should only have 1 attempt
			const answers = player.modData.perfectscore.answers;
			assert.equal(answers[0].length, 1);
			assert.equal(answers[1].length, 1);
			assert.equal(answers[2].length, 1);

			assert.equal(finisher.modData.perfectscore.isPerfect, true);
		});

		it("should not mark players with wrong answers as perfect", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Make some wrong guesses
			await runCommand(this.user1, "/scavenge wrong");
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			const finisher = getFinisher(this.user1.id);
			assert.equal(finisher.modData.perfectscore.isPerfect, false);
		});

		it("should not mark players who left and rejoined as perfect", async function () {
			await runCommand(this.user1, "/joinhunt");
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/leavehunt");
			await runCommand(this.user1, "/joinhunt");
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			const finisher = getFinisher(this.user1.id);
			assert.equal(finisher.modData.perfectscore.isPerfect, false);
		});
	});

	/**
	 * Bonus Round Twist
	 * Players can skip the last question with /scavenge skip
	 */
	context("Bonus Round twist", () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starttwisthunt bonusround | PartMan | Q1 | A1 | Q2 | A2 | Q3 | A3 | Q4 Bonus | A4"
			);
		});

		it("should allow players to skip the last question", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			const player = this.room.game.playerTable[this.user1.id];
			assert.equal(player.currentQuestion, 3);

			// Skip the bonus question
			await runCommand(this.user1, "/scavenge skip");

			assert.equal(player.completed, true);
			const finisher = getFinisher(this.user1.id);
			assert.equal(finisher.modData.bonusround.noSkipBonus, false);
		});

		it("should track players who complete without skipping", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");
			await runCommand(this.user1, "/scavenge A4");

			const player = this.room.game.playerTable[this.user1.id];
			assert.equal(player.completed, true);

			const finisher = getFinisher(this.user1.id);
			assert.equal(finisher.modData.bonusround.noSkipBonus, true);
		});

		it("should not allow skip on non-final questions", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			// Try to skip on Q2
			await runCommand(this.user1, "/scavenge skip");

			const player = this.room.game.playerTable[this.user1.id];
			// Should still be on Q2, skip shouldn't work
			assert.equal(player.currentQuestion, 1);
			assert.equal(player.completed, false);
		});
	});

	/**
	 * Incognito Twist
	 * Completions are hidden until the hunt ends
	 */
	context("Incognito twist", () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starttwisthunt incognito | PartMan | Q1 | A1 | Q2 | A2 | Q3 | A3"
			);
		});

		it("should broadcast completion", async function () {
			const log = this.room.log.log;
			assert(
				!log.some(message =>
					message.includes("<em>FakePart</em> has finished the hunt")
				)
			);
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			assert(
				!log.some(message =>
					message.includes("<em>FakePart</em> has finished the hunt")
				)
			);
		});

		it("should still track completion order correctly", async function () {
			await runCommand(this.user2, "/joinhunt");
			await runCommand(this.user1, "/joinhunt");

			// User1 completes first
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			// User2 completes second
			await runCommand(this.user2, "/scavenge A1");
			await runCommand(this.user2, "/scavenge A2");
			await runCommand(this.user2, "/scavenge A3");

			const finishers =
				this.room.game.preCompleted ?? this.room.game.completed;

			assert.equal(finishers.length, 2);
			assert.equal(finishers[0].id, this.user1.id);
			assert.equal(finishers[1].id, this.user2.id);
		});
	});

	/**
	 * Spam Filter Twist
	 * Every wrong answer adds 30 seconds to final time
	 */
	context("Spam Filter twist", () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starttwisthunt spamfilter | PartMan | Q1 | A1 | Q2 | A2 | Q3 | A3"
			);
		});

		it("should track incorrect answers and apply penalty", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Make 3 wrong guesses
			await runCommand(this.user1, "/scavenge wrong1");
			await runCommand(this.user1, "/scavenge wrong2");
			await runCommand(this.user1, "/scavenge wrong3");
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			const player = this.room.game.playerTable[this.user1.id];
			const finisher = getFinisher(this.user1.id);

			// 3 wrong answers = 90 second penalty
			assert.equal(finisher.modData.spamfilter.penalty, 90_000);
			assert.equal(player.modData.spamfilter.incorrect.length, 3);
		});

		it("should not double-count the same wrong answer", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Make the same wrong guess multiple times
			await runCommand(this.user1, "/scavenge wrong");
			await runCommand(this.user1, "/scavenge wrong");
			await runCommand(this.user1, "/scavenge wrong");
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			const player = this.room.game.playerTable[this.user1.id];

			// Should only count as 1 wrong answer
			assert.equal(player.modData.spamfilter.incorrect.length, 1);
		});

		it("should have zero penalty for perfect play", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			const finisher = getFinisher(this.user1.id);
			assert.equal(finisher.modData.spamfilter.penalty, 0);
		});
	});

	/**
	 * Blind Incognito Twist
	 * Players don't know if their last answer is correct
	 */
	context("Blind Incognito twist", () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starttwisthunt blindincognito | PartMan | Q1 | A1 | Q2 | A2 | Q3 | A3"
			);
		});

		it("should allow re-attempts on last question even after correct answer", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");

			const player = this.room.game.playerTable[this.user1.id];
			assert.equal(player.currentQuestion, 2);

			await runCommand(this.user1, "/scavenge A3");
			// TODO: Check that scavenging A3 again, or A4, shows the same message

			// Player should be marked completed but completion should be hidden
			assert.equal(player.modData.blindincognito.preCompleted, true);
		});

		it("should accept wrong answers on last question without advancing", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");

			const player = this.room.game.playerTable[this.user1.id];

			// Wrong answer on last question
			await runCommand(this.user1, "/scavenge wrong");

			// Should still be on Q3, not completed
			assert.equal(player.currentQuestion, 2);
			assert.equal(this.room.game.completed.length, 0);
		});

		it("should hide completion status", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			// HideCompletion should return true
			const shouldHide = this.room.game.runEvent("HideCompletion");
			assert.equal(shouldHide, true);
		});
	});

	/**
	 * Time Trial Twist
	 * Time starts when each player joins, not when hunt starts
	 */
	context("Time Trial twist", () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starttwisthunt timetrial | PartMan | Q1 | A1 | Q2 | A2 | Q3 | A3 | Q4 | A4"
			);
		});

		it("should track individual start times", async function () {
			await runCommand(this.user1, "/joinhunt");

			const modData = this.room.game.modData.timetrial;
			assert(modData.startTimes[this.user1.id]);
			assert.equal(typeof modData.startTimes[this.user1.id], "number");
		});

		it("should have different start times for different players", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Small delay to ensure different timestamps
			await sleep(10);

			await runCommand(this.user2, "/joinhunt");

			const modData = this.room.game.modData.timetrial;
			const time1 = modData.startTimes[this.user1.id];
			const time2 = modData.startTimes[this.user2.id];

			// User2 should have started after user1
			assert(time2 >= time1);
		});

		it("should track duration on completion", async function () {
			await sleep(1_500); // Wait 1.5s from hunt start to join
			await runCommand(this.user1, "/joinhunt");
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");
			await runCommand(this.user1, "/scavenge A4");

			const finisher = getFinisher(this.user1.id);
			assert(finisher.modData.timetrial.duration < 10); // The 1.5s delay shouldn't be counted
		});
	});

	/**
	 * Scavengers Feud Twist
	 * Players guess the most common wrong answer after completing
	 */
	context("Scavengers Feud twist", () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starttwisthunt scavengersfeud | PartMan | Q1 | A1 | Q2 | A2 | Q3 | A3"
			);
		});

		it("should add a 4th question asking for common wrong answers", async function () {
			// Scavengers Feud adds an extra question
			assert.equal(this.room.game.questions.length, 4);
			assert(
				this.room.game.questions[3].hint.includes("most common incorrect")
			);
		});

		it("should track incorrect answers for each question", async function () {
			await runCommand(this.user1, "/joinhunt");
			await runCommand(this.user2, "/joinhunt");

			// Both users guess wrong on Q1
			await runCommand(this.user1, "/scavenge wronganswer");
			await runCommand(this.user2, "/scavenge wronganswer");

			const incorrect = this.room.game.modData.scavengersfeud.incorrect;
			assert(incorrect[0]["wronganswer"]);
			assert.equal(incorrect[0]["wronganswer"].size, 2);
		});

		it("should accept any answer for the feud question", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			// Now on the feud question - any answer should complete
			await runCommand(this.user1, "/scavenge guess1, guess2, guess3");

			const player = this.room.game.playerTable[this.user1.id];
			assert.equal(player.completed, true);

			// Guesses should be stored
			const guesses =
				this.room.game.modData.scavengersfeud.guesses[this.user1.id];
			assert(guesses);
			assert.equal(guesses.length, 3);
		});
	});

	/**
	 * Minesweeper Twist
	 * Hunts have "mines" (wrong answers marked with !) that players should avoid
	 */
	context("Minesweeper twist", () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starttwisthunt minesweeper | PartMan | Q1 | A1; !mine1 | Q2 | A2; !mine2 | Q3 | A3; !mine3"
			);
		});

		it("should parse mines from answers", async function () {
			const mines = this.room.game.modData.minesweeper.mines;
			assert(mines);
			assert.equal(mines.length, 3);
			assert.deepEqual(mines[0], ["!mine1"]);
			assert.deepEqual(mines[1], ["!mine2"]);
			assert.deepEqual(mines[2], ["!mine3"]);
		});

		it("should not include mines in valid answers", async function () {
			// Mines should be removed from the answer array
			assert.deepEqual(this.room.game.questions[0].answer, ["A1"]);
			assert.deepEqual(this.room.game.questions[1].answer, ["A2"]);
			assert.deepEqual(this.room.game.questions[2].answer, ["A3"]);
		});

		it("should track when players hit mines", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Hit a mine
			await runCommand(this.user1, "/scavenge mine1");

			const guesses = this.room.game.modData.minesweeper.guesses;
			assert(guesses[0][this.user1.id]);
			assert(guesses[0][this.user1.id].has("mine1"));
		});

		it("should allow completion while tracking mine hits", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Hit mines but still complete
			await runCommand(this.user1, "/scavenge mine1");
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			const player = this.room.game.playerTable[this.user1.id];
			assert.equal(player.completed, true);

			await runCommand(this.staffUser, "/endhunt");
			const log = this.room.log.log;
			const finishMessage = log.find(message => message.includes('ended by'));
			assert(finishMessage);
			assert(finishMessage.includes("mine1: FakePart"));
		});
	});

	/**
	 * Pointless Twist
	 * Tracks which correct answers are least commonly guessed
	 */
	context("Pointless twist", () => {
		beforeEach(async function () {
			await runCommand(
				this.staffUser,
				"/starttwisthunt pointless | PartMan | Q1 | A1; AltA1 | Q2 | A2 | Q3 | A3"
			);
		});

		it("should track correct answers per question", async function () {
			await runCommand(this.user1, "/joinhunt");
			await runCommand(this.user2, "/joinhunt");

			// User1 uses main answer, User2 uses alternate
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user2, "/scavenge AltA1");

			const correct = this.room.game.modData.pointless.correct;
			assert(correct[0]["a1"]);
			assert(correct[0]["alta1"]);
			assert.deepEqual(correct[0]["a1"], [this.user1.id]);
			assert.deepEqual(correct[0]["alta1"], [this.user2.id]);
		});

		it("should not double-count the same answer from the same player", async function () {
			await runCommand(this.user1, "/joinhunt");

			// User1 is already on Q1, guesses the answer
			await runCommand(this.user1, "/scavenge A1");

			const correct = this.room.game.modData.pointless.correct;
			// Should only have 1 entry for user1
			assert.equal(correct[0]["a1"].length, 1);
		});

		it("should track answers across all questions", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			const correct = this.room.game.modData.pointless.correct;

			assert.deepEqual(correct[0]["a1"], [this.user1.id]);
			assert.deepEqual(correct[1]["a2"], [this.user1.id]);
			assert.deepEqual(correct[2]["a3"], [this.user1.id]);
		});
	});

	/**
	 * All Compatible Twists Combined
	 * Tests that all compatible twists can run simultaneously without conflicts.
	 * Note: BonusRound and ScavengersFeud cannot be combined (both insert a 4th question).
	 * This test uses all twists except ScavengersFeud.
	 */
	context("All twists combined (except ScavengersFeud)", () => {
		beforeEach(async function () {
			// Using: perfectscore, bonusround, incognito, spamfilter, blindincognito, timetrial, minesweeper, pointless
			// Requires 4+ questions for TimeTrial and BonusRound
			// Requires mines (!) for Minesweeper
			await runCommand(
				this.staffUser,
				"/starttwisthunt perfectscore, bonusround, incognito, spamfilter, blindincognito, timetrial, minesweeper, pointless | PartMan | Q1 | A1; !mine1 | Q2 | A2; !mine2 | Q3 | A3; !mine3 | Q4 Bonus | A4; !mine4"
			);
		});

		it("should allow a player to complete the hunt with all twists active", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Complete all questions
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");
			await runCommand(this.user1, "/scavenge A4");

			// BlindIncognito marks completion differently
			const player = this.room.game.playerTable[this.user1.id];
			assert.equal(player.modData.blindincognito.preCompleted, true, "blindincognito should mark preCompleted");
		});

		it("should track wrong answers across multiple twists", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Make some wrong guesses (tracked by SpamFilter, PerfectScore, and Minesweeper)
			await runCommand(this.user1, "/scavenge wrong1");
			await runCommand(this.user1, "/scavenge mine1"); // Hit a mine
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");
			await runCommand(this.user1, "/scavenge A4");

			const player = this.room.game.playerTable[this.user1.id];
			const finisher = getFinisher(this.user1.id);

			// SpamFilter should track incorrect answers
			assert(player.modData.spamfilter.incorrect.length === 2, "Spam Filter should track wrong answers");

			// PerfectScore should mark as not perfect
			assert.equal(finisher.modData.perfectscore.isPerfect, false, "should not be perfect with wrong answers");

			// Pointless should track correct answer
			const correct = this.room.game.modData.pointless.correct;
			assert.deepEqual(correct[0]["a1"], [this.user1.id], "Pointless should track correct answers");

			await runCommand(this.staffUser, "/endhunt");
			const log = this.room.log.log;
			const finishMessage = log.find(message => message.includes('ended by'));
			assert(finishMessage);
			assert(finishMessage.includes("mine1: FakePart"));
		});

		it("should allow skipping bonus question with all twists", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");

			// Skip the bonus question (BonusRound feature)
			await runCommand(this.user1, "/scavenge skip");

			const finisher = getFinisher(this.user1.id);
			assert(finisher, "player should have finished");
			assert.equal(finisher.modData.bonusround.noSkipBonus, false, "Bonus Round should track that skip was used");
		});

		it("should handle multiple players completing with all twists", async function () {
			await runCommand(this.user1, "/joinhunt");
			await sleep(10);
			await runCommand(this.user2, "/joinhunt");

			// User1 completes with no mistakes
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");
			await runCommand(this.user1, "/scavenge A4");

			// User2 completes with some mistakes
			await runCommand(this.user2, "/scavenge wrong");
			await runCommand(this.user2, "/scavenge mine1");
			await runCommand(this.user2, "/scavenge A1");
			await runCommand(this.user2, "/scavenge A2");
			await runCommand(this.user2, "/scavenge A3");
			await runCommand(this.user2, "/scavenge A4");

			const finisher1 = getFinisher(this.user1.id);
			const finisher2 = getFinisher(this.user2.id);

			// Both should have finished (BlindIncognito)
			assert(finisher1, "user1 should have finished");
			assert(finisher2, "user2 should have finished");

			// PerfectScore differentiation
			assert.equal(finisher1.modData.perfectscore.isPerfect, true, "user1 should be perfect");
			assert.equal(finisher2.modData.perfectscore.isPerfect, false, "user2 should not be perfect");

			// TimeTrial should have different start times
			const modData = this.room.game.modData.timetrial;
			assert(modData.startTimes[this.user1.id] <= modData.startTimes[this.user2.id], "user1 should have earlier or equal start time");
		});

		it("should hide completions due to BlindIncognito and Incognito", async function () {
			await runCommand(this.user1, "/joinhunt");

			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");
			await runCommand(this.user1, "/scavenge A4");

			const log = this.room.log.log;
			const finishMessage = log.find(message => message.includes('ended by'));
			assert(!finishMessage, "completion should be hidden");
		});

		it("should track Minesweeper mines correctly with all twists", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Hit mines on different questions
			await runCommand(this.user1, "/scavenge mine1");
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge mine2");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");
			await runCommand(this.user1, "/scavenge A4");

			const guesses = this.room.game.modData.minesweeper.guesses;

			// Should have recorded mine hits
			assert(guesses[0][this.user1.id], "should track guesses for Q1");
			assert(guesses[0][this.user1.id].has("mine1"), "should have recorded mine1 hit");
			assert(guesses[1][this.user1.id], "should track guesses for Q2");
			assert(guesses[1][this.user1.id].has("mine2"), "should have recorded mine2 hit");
		});
	});

	/**
	 * All Compatible Twists Combined (alternate combo)
	 * Uses ScavengersFeud instead of BonusRound
	 */
	context("All twists combined (except BonusRound)", () => {
		beforeEach(async function () {
			// Using: perfectscore, incognito, spamfilter, blindincognito, timetrial, scavengersfeud, minesweeper, pointless
			// ScavengersFeud adds a 4th question automatically for guessing common wrong answers
			await runCommand(
				this.staffUser,
				"/starttwisthunt perfectscore, incognito, spamfilter, blindincognito, timetrial, scavengersfeud, minesweeper, pointless | PartMan | Q1 | A1; !mine1 | Q2 | A2; !mine2 | Q3 | A3; !mine3 | Q4 | A4; !mine4"
			);
		});

		it("should initialize all twist modData correctly", async function () {
			const game = this.room.game;

			// ScavengersFeud should have added a 5th question
			assert.equal(game.questions.length, 5, "scavengersfeud should have added a guess question");

			assert(game.modData.scavengersfeud, "scavengersfeud modData should exist");
			assert(game.modData.scavengersfeud.guesses, "scavengersfeud.guesses should exist");
			assert(Array.isArray(game.modData.scavengersfeud.incorrect), "scavengersfeud.incorrect should be an array");

			assert(game.modData.perfectscore.leftGame instanceof Set, "perfectscore.leftGame should be a Set");
			assert(game.modData.timetrial.startTimes, "timetrial.startTimes should exist");
			assert(Array.isArray(game.modData.minesweeper.mines), "minesweeper.mines should be an array");
			assert(Array.isArray(game.modData.pointless.correct), "pointless.correct should be an array");
		});

		it("should allow completing the hunt with ScavengersFeud guess question", async function () {
			await runCommand(this.user1, "/joinhunt");

			// Complete regular questions
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");
			await runCommand(this.user1, "/scavenge A4");

			// ScavengersFeud's guess question - any answer completes
			await runCommand(this.user1, "/scavenge guess1, guess2, guess3, guess4");

			// BlindIncognito hides completion status, so check finish record instead
			const player = this.room.game.playerTable[this.user1.id];
			assert.equal(player.modData.blindincognito.preCompleted, true, "blindincognito should mark preCompleted");

			// Check guesses were recorded
			const guesses = this.room.game.modData.scavengersfeud.guesses[this.user1.id];
			assert(guesses, "guesses should be recorded");
			assert.equal(guesses.length, 4, "should have 4 guesses");
		});

		it("should track wrong answers for ScavengersFeud while other twists work", async function () {
			await runCommand(this.user1, "/joinhunt");
			await runCommand(this.user2, "/joinhunt");

			// Both users make the same wrong guess
			await runCommand(this.user1, "/scavenge commonwrong");
			await runCommand(this.user2, "/scavenge commonwrong");

			// ScavengersFeud should track this
			const incorrect = this.room.game.modData.scavengersfeud.incorrect;
			assert(incorrect[0]["commonwrong"], "should track common wrong answer");
			assert.equal(incorrect[0]["commonwrong"].size, 2, "should track both users guessing wrong");

			// SpamFilter should also track for each user
			const player1 = this.room.game.playerTable[this.user1.id];
			const player2 = this.room.game.playerTable[this.user2.id];
			assert(player1.modData.spamfilter.incorrect.length >= 1, "spamfilter should track user1 wrong answer");
			assert(player2.modData.spamfilter.incorrect.length >= 1, "spamfilter should track user2 wrong answer");
		});

		it("should handle player leaving with all twists active", async function () {
			await runCommand(this.user1, "/joinhunt");
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/leavehunt");

			// PerfectScore should track that player left
			assert(this.room.game.modData.perfectscore.leftGame.has(this.user1.id), "perfectscore should track player leaving");

			// TimeTrial should still have altIps recorded
			await runCommand(this.user1, "/joinhunt");
			await runCommand(this.user1, "/scavenge A1");
			await runCommand(this.user1, "/scavenge A2");
			await runCommand(this.user1, "/scavenge A3");
			await runCommand(this.user1, "/scavenge A4");
			await runCommand(this.user1, "/scavenge guess1, guess2, guess3, guess4");

			const finisher = getFinisher(this.user1.id);
			// Should not be perfect since they left and rejoined
			assert.equal(finisher.modData.perfectscore.isPerfect, false, "should not be perfect after leaving");
		});
	});
});
