var assert = require('assert');
var battle;

describe('Imprison', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent foes from using moves that the user knows', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Abra', ability: 'prankster', moves: ['imprison', 'calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Abra', ability: 'synchronize', moves: ['calmmind', 'confusion']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 0);
		assert.strictEqual(battle.p2.active[0].boosts['spd'], 0);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].lastMove, 'confusion');
	});
});
