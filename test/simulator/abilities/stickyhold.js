var assert = require('assert');
var battle;

describe('Sticky Hold', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent held items from being stolen by most moves or abilities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shuckle', ability: 'stickyhold', item: 'razzberry', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Fennekin', ability: 'magician', moves: ['grassknot']},
			{species: 'Smeargle', ability: 'synchronize', moves: ['thief', 'knockoff', 'switcheroo', 'bugbite']}
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'razzberry');
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'razzberry');
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'razzberry');
		battle.choose('p2', 'move 3');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'razzberry');
		battle.choose('p2', 'move 4');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'razzberry');
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pangoro', ability: 'moldbreaker', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Shuckle', ability: 'stickyhold', item: 'ironball', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, '');
	});
});
