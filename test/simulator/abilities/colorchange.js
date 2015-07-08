var assert = require('assert');
var battle;

describe('Color Change', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should change the user\'s type when struck by a move', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kecleon", ability: 'colorchange', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Paras", ability: 'damp', moves: ['absorb']}]);
		battle.commitDecisions();
		assert.ok(battle.p1.active[0].hasType('Grass'));
	});

	it('should not change the user\'s type if it had a Substitute when hit', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kecleon", ability: 'colorchange', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Machamp", ability: 'purepower', item: 'laggingtail', moves: ['closecombat']}]);
		battle.commitDecisions();
		assert.ok(!battle.p1.active[0].hasType('Fighting'));
	});
});
