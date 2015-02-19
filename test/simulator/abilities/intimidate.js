var assert = require('assert');
var battle;

describe('Intimidate', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should decrease Atk by 1 level', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['sketch']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gyarados", ability: 'intimidate',  moves: ['splash']}]);
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
	});

	it('should be blocked by Substitute', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Escavalier", item: 'leftovers', ability: 'shellarmor', moves: ['substitute']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Greninja", item: 'laggingtail', ability: 'protean',  moves: ['uturn']},
			{species: "Gyarados", item: 'leftovers', ability: 'intimidate',  moves: ['splash']}
		]);
		battle.commitDecisions();
		battle.choose('p2', 'switch 2');
		assert.strictEqual(battle.p1.active[0].boosts['atk'], 0);
	});

	it('should affect adjacent foes only', function () {
		battle = BattleEngine.Battle.construct('battle-intimidate-adjacency', 'triplescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Bulbasaur", item: 'leftovers', ability: 'overgrow', moves: ['vinewhip']},
			{species: "Charmander", item: 'leftovers', ability: 'blaze', moves: ['ember']},
			{species: "Squirtle", item: 'leftovers', ability: 'torrent', moves: ['bubble']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Greninja", ability: 'protean',  moves: ['uturn']},
			{species: "Mew", ability: 'synchronize',  moves: ['softboiled']},
			{species: "Gyarados", ability: 'intimidate',  moves: ['splash']}
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
		assert.strictEqual(battle.p1.active[1].boosts['atk'], -1);
		assert.strictEqual(battle.p1.active[2].boosts['atk'], 0);
	});
});
