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
		assert.strictEqual(battle.p1.active[0].hp, 262);
	});

	it('should eliminate secondary effects from moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tauros', ability: 'sheerforce', moves: ['zapcannon']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Machamp', ability: 'noguard', moves: ['bulkup']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, '');
	});

	it('should not eliminate Life Orb recoil if the ability is disabled/removed mid-attack', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tauros', ability: 'sheerforce', item: 'lifeorb', moves: ['lockon', 'dynamicpunch']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Scyther', ability: 'mummy', moves: ['irondefense']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.ok(!battle.p2.active[0].volatiles['confusion']);
		assert.strictEqual(battle.p1.active[0].hp, 262);
	});

	it('should eliminate Life Orb recoil in a move with secondary effects', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tauros', ability: 'sheerforce', item: 'lifeorb', moves: ['bodyslam']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Lapras', ability: 'shellarmor', item: 'laggingtail', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
