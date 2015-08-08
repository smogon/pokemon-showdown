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

	it('should wait until all simultaneous switch ins at the beginning of a battle have completed before activating', function () {
		battle = BattleEngine.Battle.construct('battle-intimidate-order1', 'customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Arcanine", ability: 'intimidate', moves: ['morningsun']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gyarados", ability: 'intimidate', moves: ['dragondance']}]);
		var intimidateCount = 0;
		battle.on('Boost', battle.getFormat(), function (boost, target, source) {
			assert.strictEqual(source.template.speciesid, intimidateCount === 0 ? 'arcanine' : 'gyarados');
			intimidateCount++;
		});
		battle.commitDecisions(); // Finish Team Preview, switch both Pokemon in
		assert.strictEqual(intimidateCount, 2);
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
		assert.strictEqual(battle.p2.active[0].boosts['atk'], -1);

		// Do it again with the Pokemon in reverse order
		battle.destroy();
		battle = BattleEngine.Battle.construct('battle-intimidate-order2', 'customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Gyarados", ability: 'intimidate', moves: ['dragondance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Arcanine", ability: 'intimidate', moves: ['morningsun']}]);
		intimidateCount = 0;
		battle.on('Boost', battle.getFormat(), function (boost, target, source) {
			assert.strictEqual(source.template.speciesid, intimidateCount === 0 ? 'arcanine' : 'gyarados');
			intimidateCount++;
		});
		battle.commitDecisions(); // Finish Team Preview, switch both Pokemon in
		assert.strictEqual(intimidateCount, 2);
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
		assert.strictEqual(battle.p2.active[0].boosts['atk'], -1);
	});

	it('should wait until all simultaneous switch ins after double-KOs have completed before activating', function () {
		battle = BattleEngine.Battle.construct('battle-intimidate-ko1', 'customgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Blissey", ability: 'naturalcure', moves: ['healingwish']},
			{species: "Arcanine", ability: 'intimidate', moves: ['healingwish']},
			{species: "Gyarados", ability: 'intimidate', moves: ['healingwish']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Blissey", ability: 'naturalcure', moves: ['healingwish']},
			{species: "Gyarados", ability: 'intimidate', moves: ['healingwish']},
			{species: "Arcanine", ability: 'intimidate', moves: ['healingwish']}
		]);
		var intimidateCount = 0;
		battle.on('Boost', battle.getFormat(), function (boost, target, source) {
			assert.strictEqual(source.template.speciesid, intimidateCount % 2 === 0 ? 'arcanine' : 'gyarados');
			intimidateCount++;
		});
		battle.commitDecisions(); // Team Preview
		battle.commitDecisions();
		battle.choose('p1', 'switch 2');
		battle.choose('p2', 'switch 2');
		// Both Pokemon switched in at the same time
		assert.strictEqual(intimidateCount, 2);
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
		assert.strictEqual(battle.p2.active[0].boosts['atk'], -1);
		// Do it again with the Pokemon in reverse order
		battle.commitDecisions();
		battle.choose('p1', 'switch 3');
		battle.choose('p2', 'switch 3');
		assert.strictEqual(intimidateCount, 4);
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
		assert.strictEqual(battle.p2.active[0].boosts['atk'], -1);
	});
});
