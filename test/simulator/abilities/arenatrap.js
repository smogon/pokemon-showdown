var assert = require('assert');
var battle;

describe('Arena Trap', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent grounded Pokemon that are not immune to trapping from switching out normally', function () {
		this.timeout(0);
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Dugtrio", ability: 'arenatrap', moves: ['snore', 'telekinesis', 'gravity']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Tornadus", ability: 'defiant', moves: ['tailwind']},
			{species: "Heatran", ability: 'flashfire', item: 'airballoon', moves: ['roar']},
			{species: "Claydol", ability: 'levitate', moves: ['rest']},
			{species: "Dusknoir", ability: 'frisk', moves: ['rest']},
			{species: "Magnezone", ability: 'magnetpull', moves: ['magnetrise']},
			{species: "Vaporeon", ability: 'waterabsorb', moves: ['roar']}
		]);
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'heatran');
		battle.choose('p2', 'switch 3');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'claydol');
		battle.choose('p2', 'switch 4');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'dusknoir');
		battle.choose('p2', 'switch 5');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'magnezone');
		battle.choose('p2', 'switch 6');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'magnezone');
		battle.commitDecisions();
		battle.choose('p2', 'switch 6');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'vaporeon');
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'vaporeon');
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'tornadus');
		battle.choose('p1', 'move 3');
		battle.commitDecisions();
		battle.choose('p2', 'switch 4');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'tornadus');
	});
});
