var assert = require('assert');
var battle;

describe('Gravity', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should ground Flying-type Pokemon and remove their Ground immunity', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Aerodactyl', ability: 'pressure', moves: ['gravity']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Aron', ability: 'sturdy', moves: ['earthpower']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should ground Pokemon with Levitate and remove their Ground immunity', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Rotom', ability: 'levitate', moves: ['gravity']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Aron', ability: 'sturdy', moves: ['earthpower']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should interrupt and disable the use of airborne moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Spiritomb', ability: 'pressure', moves: ['gravity']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Aerodactyl', ability: 'pressure', moves: ['fly']}]);
		battle.commitDecisions();
		assert.ok(!battle.p2.active[0].volatiles['twoturnmove']);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].lastMove, 'struggle');
	});
});
