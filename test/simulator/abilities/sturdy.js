var assert = require('assert');
var battle;

describe('Sturdy', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should give the user an immunity to OHKO moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Aron', level: 1, ability: 'sturdy',  moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Kyogre', ability: 'noguard', moves: ['sheercold']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should allow its user to survive an attack from full HP', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Paras', ability: 'sturdy', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Charizard', ability: 'drought', moves: ['fusionflare']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, 1);
	});

	it('should allow its user to survive a confusion damage hit from full HP', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shedinja', ability: 'sturdy', moves: ['absorb']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Klefki', ability: 'prankster', moves: ['confuseray']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, 1);
	});

	it('should not trigger on recoil damage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shedinja', ability: 'sturdy', moves: ['doubleedge']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Klefki', ability: 'prankster', moves: ['reflect']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, 0);
	});

	it('should not trigger on residual damage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Shedinja', ability: 'sturdy', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'infiltrator', moves: ['toxic']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, 0);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Paras', ability: 'sturdy', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Reshiram', ability: 'turboblaze', moves: ['fusionflare']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, 0);
	});
});
