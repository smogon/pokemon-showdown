var assert = require('assert');
var battle;

describe('Thunder Wave', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict paralysis on its target', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Jolteon", ability: 'quickfeet', moves: ['thunderwave']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Vaporeon", ability: 'hydration', moves: ['aquaring']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'par');
	});

	it('should not ignore natural type immunities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Jolteon", ability: 'quickfeet', moves: ['thunderwave']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Hippowdon", ability: 'sandforce', moves: ['slackoff']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, '');
	});
});
