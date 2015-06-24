var assert = require('assert');
var battle;

describe('Taunt', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent the target from using Status moves and disable them', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Sableye', ability: 'prankster', moves: ['taunt']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Spiritomb', ability: 'pressure', moves: ['calmmind']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 0);
		assert.strictEqual(battle.p2.active[0].boosts['spd'], 0);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].lastMove, 'struggle');
	});
});
