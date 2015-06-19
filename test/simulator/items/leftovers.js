var assert = require('assert');
var battle;

describe('Leftovers [Gen 2]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should heal after switch', function () {
		battle = BattleEngine.Battle.construct('battle-leftovers-gsc', 'gen2customgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Blissey', item: 'leftovers', moves: ['healbell']},
			{species: 'Magikarp', level: 1, moves: ['splash']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Miltank", moves: ['seismictoss']}
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, 591);

		battle.choose('p1', 'switch 2');
		battle.commitDecisions();

		battle.choose('p1', 'switch 2');
		assert.strictEqual(battle.p1.active[0].hp, 631);
	});
});
