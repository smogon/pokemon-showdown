var assert = require('assert');
var battle;

describe('Thousand Arrows', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should hit Flying-type Pokemon and remove their Ground immunity', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Tropius", ability: 'harvest', moves: ['synthesis']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move earthquake');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should ignore type effectiveness on the first hit against Flying-type Pokemon', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Ho-Oh", ability: 'pressure', item: 'weaknesspolicy', moves: ['recover']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts.atk, 0);
		assert.strictEqual(battle.p2.active[0].boosts.spa, 0);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts.atk, 2);
		assert.strictEqual(battle.p2.active[0].boosts.spa, 2);
	});

	it('should hit Pokemon with Levitate and remove their Ground immunity', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Cresselia", ability: 'levitate', moves: ['recover']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move earthquake');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should hit non-Flying-type Pokemon with Levitate with standard type effectiveness', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Eelektross", ability: 'levitate', item: 'weaknesspolicy', moves: ['thunderwave']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts.atk, 2);
		assert.strictEqual(battle.p2.active[0].boosts.spa, 2);
	});

	it('should hit Pokemon with Air Balloon', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Donphan", ability: 'sturdy', item: 'airballoon', moves: ['stealthrock']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move earthquake');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not hit Ground-type Pokemon when affected by Electrify', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'aurabreak', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Stunfisk", ability: 'limber', moves: ['electrify']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not hit Ghost-type Pokemon when affected by Normalize', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Zygarde", ability: 'normalize', item: 'laggingtail', moves: ['thousandarrows', 'earthquake']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Dusknoir", ability: 'pressure', moves: ['haze']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});
});
