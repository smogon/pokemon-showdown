Pokemon Showdown uses mocha for its unit tests. To run, use `npm test` on the command line. Certain tests run more slowly (marked as `(slow)` in the test's title); you can use `npm run full-test` for those as well, but it will take longer and usually isn't necessary for most bugfixes. When submitting a pull request, GitHub Actions will automatically run full-test.

To run specific tests, you can change `it` or `describe` to `it.only` or `describe.only`. `npx mocha -g "text"` can let you run tests with "text" in its title (e.g. `npx mocha -g "Gen 1"` for all tests with the string "Gen 1").

## Creating tests
Check the test/ directory to see if a file already exists for the effect that you're writing a test. If not, create the file with the following boiler plate:

	'use strict';

	const assert = require('./../../assert');
	const common = require('./../../common');

	let battle;

	describe(`Name of effect you're testing`, function () {
		afterEach(function () {
			battle.destroy();
		});

		it(`test should start here`, function () {

		});
	}

To create the battle, use common.createBattle and pass in two arrays of teams. You can add additional flags as well:
- gameType: 'doubles', 'triples', 'multi', 'freeforall', etc (tests default to singles)
- forceRandomChance: true, false (any RNG calls that use Battle#randomChance will default to true or false instead of calling RNG)
  - Examples include accuracy, critical hits, secondary effects, being fully paralyzed, Abilities like Flame Body, and successive Protects.
  - It won't control things like random targeting, sampling from a list (e.g. Metronome), or rolling variable durations (e.g. number of sleep turns).
- seed: Array of 4 ints (used to force a specific RNG when the default seed isn't compatible. Avoid relying on RNG if possible)
- other custom rules, e.g. Inverse Mod: defined in test/common.js

Here are two examples of tests in the preferred style. Don't hesitate to copy tests similar to what you're trying to do!
```
it(`should restore 1/3 HP to the user after eating a Berry`, function () {
	battle = common.createBattle([[
		{species: 'wynaut', item: 'lumberry', ability: 'cheekpouch', moves: ['sleeptalk']},
	], [
		{species: 'pichu', moves: ['nuzzle']},
	]]);
	const wynaut = battle.p1.active[0];
	battle.makeChoices();
	assert.fullHP(wynaut);
});
```
```
it(`should boost Dondozo's stat even if Sheer Force-boosted`, function () {
	battle = common.createBattle({gameType: 'doubles'}, [[
		{species: 'wynaut', moves: ['sleeptalk']},
		{species: 'mew', ability: 'shellarmor', moves: ['sleeptalk']},
	], [
		{species: 'tatsugiristretchy', ability: 'commander', moves: ['sleeptalk']},
		{species: 'dondozo', ability: 'sheerforce', moves: ['orderup']},
	]]);
	battle.makeChoices('auto', 'move orderup 2');
	const mew = battle.p1.active[1];
	const damage = mew.maxhp - mew.hp;
	assert.bounded(damage, [149, 176], `Order Up's base power should be increased by Sheer Force`);
	assert.statStage(battle.p2.active[1], 'spe', 3);
});
```
Tests ideally should be:
- Specific. Don't cram too much into one unit test. Don't include Abilities/moves/items that aren't necessary for the test.
- Readable. If a test fails from some regression, it should not take very long to identify what the test was doing. Making liberal use of comments and assert() descriptions is great!
- RNG-independent (where possible). Use 100% accurate moves (or No Guard), use Shell Armor or Lucky Chant, don't use Pokemon that Speed tie, things like that.

You may see tests not in the preferred style, or that aren't ideal in other ways. Pokemon Showdown has thousands of unit tests, and it's unfortunately pretty time-consuming to convert them all. Please be sure to follow the preferred style!

## Using assert
``assert`` is used to validate some condition in your test is true. See test/assert.js for a complete list. Use ``assert.false`` to check the inverse of that condition.

Common functions:
- `assert.equal(oneThing, anotherThing)`: use this instead of `assert.equals()` or `assert(oneThing === anotherThing)`
- `assert.fullHP(pokemon)`: check that the Pokemon is at full HP
- `assert.bounded(damage, [lowerBound, upperBound])`: check if the damage dealt by a move falls within the possible range of damage
- `assert.statStage(pokemon, 'stat', value)`: check the stat stage of the current Pokemon

### Other tips
Here are some helpful tips for writing and debugging tests:
- `console.log(battle.getDebugLog())` is a helpful tool to quickly debug a test. It prints the entire battle log with omniscient details about the game.
- To save a replay for viewing, you can also do `common.saveReplay(battle)` and check the test/replays directory if you prefer to view it in replay form (e.g. to check client behavior). Open the html file it creates in any standard web browser to view.
