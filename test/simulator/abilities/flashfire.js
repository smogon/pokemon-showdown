var assert = require('assert');
var battle;

describe('Flash Fire', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should grant immunity to Fire-type moves and increase Fire-type attacks by 50% once activated', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Heatran', ability: 'flashfire', moves: ['incinerate']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Talonflame', ability: 'galewings', moves: ['flareblitz']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		var damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.ok(damage >= 82 && damage <= 97);
	});

	it('should grant Fire-type immunity even if the user is frozen', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Talonflame', ability: 'galewings', moves: ['flareblitz']}]);
		battle.p1.active[0].setStatus('frz');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should have its Fire-type immunity suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Heatran', ability: 'flashfire', moves: ['incinerate']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['firepunch']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should lose the Flash Fire boost if its ability is changed', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk', 'incinerate']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Talonflame', ability: 'galewings', moves: ['incinerate', 'worryseed']}]);
		battle.commitDecisions();
		battle.seed = battle.startingSeed.slice();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		var damage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;
		assert.ok(damage >= 54 && damage <= 65);
	});
});

describe('Flash Fire [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	// TODO: Check if this is actually a behavior in Gen 3-4
	it.skip('should grant Fire-type immunity even if the user is frozen', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Heatran', ability: 'flashfire', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Charizard', ability: 'blaze', moves: ['flamethrower']}]);
		battle.p1.active[0].setStatus('frz');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
