var assert = require('assert');
var battle;

describe('Mail', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not be stolen by most moves or abilities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Blissey', ability: 'naturalcure', item: 'mail', moves: ['softboiled']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Fennekin', ability: 'magician', moves: ['grassknot']},
			{species: 'Abra', ability: 'synchronize', moves: ['trick']},
			{species: 'Lopunny', ability: 'klutz', moves: ['switcheroo']}
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'mail');
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'mail');
		battle.choose('p2', 'switch 3');
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'mail');
	});

	it('should not be removed by Fling', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pangoro', ability: 'ironfist', moves: ['swordsdance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', item: 'mail', moves: ['fling']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, 'mail');
	});

	it('should be removed by Knock Off', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pangoro', ability: 'ironfist', item: 'mail', moves: ['swordsdance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', moves: ['knockoff']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].item, 'mail');
	});

	it('should be stolen by Thief', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pangoro', ability: 'ironfist', item: 'mail', moves: ['swordsdance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', moves: ['thief']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].item, 'mail');
	});
});
