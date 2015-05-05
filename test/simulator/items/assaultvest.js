var assert = require('assert');
var battle;

describe('Assault Vest', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should disable the use of Status moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Abra', ability: 'synchronize', moves: ['teleport']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', item: 'assaultvest', moves: ['teleport']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].lastMove, 'struggle');
	});

	it('should not prevent the use of Status moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Lopunny', ability: 'klutz', item: 'assaultvest', moves: ['trick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', item: 'ironball', moves: ['calmmind']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 1);
		assert.strictEqual(battle.p2.active[0].boosts['spd'], 1);
	});
});
