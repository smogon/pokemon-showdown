var assert = require('assert');
var battle;

describe('Flame Orb', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not trigger when entering battle', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Magikarp', ability: 'swiftswim', item: 'focussash', moves: ['splash']},
			{species: 'Ursaring', ability: 'guts', item: 'flameorb', moves: ['protect']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Breloom', ability: 'technician', moves: ['bulletseed']}
		]);
		battle.commitDecisions();
		battle.choose('p1', 'switch 2');
		assert.notStrictEqual(battle.p1.active[0].status, 'brn');
	});

	it('should trigger after one turn', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Ursaring', ability: 'guts', item: 'flameorb', moves: ['protect']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, 'brn');
	});
});

