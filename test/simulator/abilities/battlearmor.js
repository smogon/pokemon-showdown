var assert = require('assert');
var battle;

describe('Battle Armor', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent moves from dealing critical hits', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Slowbro', ability: 'battlearmor', moves: ['quickattack']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cyrogonal', ability: 'noguard', moves: ['frostbreath']}]);
		battle.commitDecisions();
		assert.ok(!battle.log[battle.lastMoveLine + 1].startsWith('|-crit'));
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Slowbro', ability: 'battlearmor', moves: ['quickattack']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cyrogonal', ability: 'moldbreaker', item: 'zoomlens', moves: ['frostbreath']}]);
		battle.commitDecisions();
		assert.ok(battle.log[battle.lastMoveLine + 1].startsWith('|-crit'));
	});
});
