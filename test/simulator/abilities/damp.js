var assert = require('assert');
var battle;

describe('Damp', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent self-destruction moves from activating', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Politoed', ability: 'damp', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Electrode', ability: 'static', moves: ['explosion']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should prevent Aftermath from activating', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Poliwrath', ability: 'damp', moves: ['closecombat']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Aron', ability: 'aftermath', moves: ['leer']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p2.active[0].hp, 0);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Politoed', ability: 'damp', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Electrode', ability: 'moldbreaker', moves: ['explosion']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p2.active[0].hp, 0);
	});
});
