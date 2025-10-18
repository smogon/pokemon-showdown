'use strict';

const { makeUser, destroyUser } = require('../../users-utils');
const assert = require('../../assert');

describe("Hangman", () => {
	let Hangman = null;

	before(function () {
		Hangman = require('../../../dist/server/chat-plugins/hangman').Hangman;
		this.creator = makeUser('dawoblefet');
		this.guesser = makeUser('mathy');
	});

	after(function () {
		destroyUser(this.creator);
		destroyUser(this.guesser);
	});

	function createHangman(creator, word, hint) {
		return new Hangman(Rooms.lobby, creator, word, hint);
	}

	it("should reject impossible guesses", function () {
		const game = createHangman(this.creator, "Wynaut", "Why write unit tests?");
		const errorRegex = /Your guess "[A-Za-z ]+" is invalid./;
		const testInvalidGuess = guess => {
			assert.throws(() => {
				game.choose(this.guesser, guess);
			}, errorRegex, `Guess should have been invalid: "${guess}"`);
		};

		testInvalidGuess('wobbuffet'); // wrong length

		game.choose(this.guesser, 'z');
		testInvalidGuess('zekrom'); // 'z' already guessed

		game.choose(this.guesser, 't');
		// _ _ _ _ _ t
		testInvalidGuess('beldum'); // wrong letters
		game.choose(this.guesser, 'furret'); // should be valid
		testInvalidGuess('chatot'); // only one 't'

		game.choose(this.guesser, 'a');
		game.choose(this.guesser, 'n');
		// _ _ n a _ t
		testInvalidGuess('durant'); // 'n' in wrong spot

		game.choose(this.guesser, 'wynaut'); // we did it!
	});
});
