var assert = require('assert');
var battle;

describe('Focus Sash', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should be consumed and allow its user to survive an attack from full HP', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Paras', ability: 'dryskin', item: 'focussash', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Delphox', ability: 'magician', moves: ['incinerate']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, '');
		assert.strictEqual(battle.p1.active[0].hp, 1);
	});

	it('should be consumed and allow its user to survive a confusion damage hit from full HP', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shedinja', ability: 'wonderguard', item: 'focussash', moves: ['absorb']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, '');
		assert.strictEqual(battle.p1.active[0].hp, 1);
	});

	it('should not trigger on recoil damage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shedinja', ability: 'wonderguard', item: 'focussash', moves: ['doubleedge']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Klefki', ability: 'prankster', moves: ['reflect']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'focussash');
		assert.strictEqual(battle.p1.active[0].hp, 0);
	});

	it('should not trigger on residual damage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shedinja', ability: 'wonderguard', item: 'focussash', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'infiltrator', moves: ['toxic']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'focussash');
		assert.strictEqual(battle.p1.active[0].hp, 0);
	});
});
