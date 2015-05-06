var assert = require('assert');
var battle;

describe('Sheer Force', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not eliminate Life Orb recoil in a move with no secondary effects', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tauros', ability: 'sheerforce', item: 'lifeorb', moves: ['earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Lapras', ability: 'shellarmor', item: 'laggingtail', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, 281);
	});

	it('should eliminate Life Orb recoil in a move with secondary effects', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tauros', ability: 'sheerforce', moves: ['bodyslam']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Lapras', ability: 'shellarmor', item: 'laggingtail', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
