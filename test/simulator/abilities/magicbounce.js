var assert = require('assert');
var battle;

describe('Magic Bounce', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should bounce Growl', function () {
		// Sanity check: if this test fails, the remaining tests for Magic Bounce may not make sense.
		// Tests for specific moves belong to the respective moves' test suites.
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'overgrow', moves: ['growl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Espeon", ability: 'magicbounce', moves: ['futuresight']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
		assert.strictEqual(battle.p2.active[0].boosts['atk'], 0);
	});

	it('should bounce once when target and source share the ability', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Xatu", ability: 'magicbounce', moves: ['roost']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Espeon", ability: 'magicbounce', moves: ['growl']}]);
		assert.doesNotThrow(function () {battle.commitDecisions();});
		assert.strictEqual(battle.p1.active[0].boosts['atk'], 0);
		assert.strictEqual(battle.p2.active[0].boosts['atk'], -1);
	});

	it('should not cause a choice-lock', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Spoink", ability: 'thickfat', moves: ['bounce']}, {species: "Xatu", item: 'choicescarf', ability: 'magicbounce', moves: ['roost', 'growl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Espeon", ability: 'magicbounce', moves: ['growl', 'recover']}]);
		battle.choose('p1', 'switch 2');
		battle.commitDecisions();
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].lastMove, 'growl');
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Bulbasaur", ability: 'moldbreaker', moves: ['growl']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Espeon", ability: 'magicbounce', moves: ['futuresight']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['atk'], 0);
		assert.strictEqual(battle.p2.active[0].boosts['atk'], -1);
	});
});
