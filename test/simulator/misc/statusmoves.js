var assert = require('assert');
var battle;

describe('Most status moves', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should ignore type immunities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", ability: 'prankster', item: 'leftovers', moves: ['gastroacid', 'glare', 'confuseray', 'sandattack']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Klefki", ability: 'magician', happiness: 0, moves: ['return']},
			{species: "Dusknoir", ability: 'frisk', moves: ['shadowpunch']},
			{species: "Slaking", ability: 'truant', moves: ['shadowclaw']},
			{species: "Tornadus", ability: 'prankster', moves: ['tailwind']},
			{species: "Unown", ability: 'levitate', moves: ['hiddenpower']}
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, '');
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'switch 2');
		assert.strictEqual(battle.p2.active[0].status, 'par');
		battle.choose('p1', 'move 3');
		battle.choose('p2', 'switch 3');
		assert.ok(battle.p2.active[0].volatiles['confusion']);
		battle.choose('p1', 'move 4');
		battle.choose('p2', 'switch 4');
		assert.strictEqual(battle.p2.active[0].boosts['accuracy'], -1);
		battle.choose('p1', 'move 4');
		battle.choose('p2', 'switch 5');
		assert.strictEqual(battle.p2.active[0].boosts['accuracy'], -1);
	});
});

