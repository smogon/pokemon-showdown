var assert = require('assert');
var battle;

describe('Flower Gift', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should boost allies\' physical attacks', function () {
		battle = BattleEngine.Battle.construct('battle-flowergift-boost', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: "Cherrim", ability: 'flowergift', moves: ['aromatherapy']},
			{species: "Snorlax", ability: 'immunity', moves: ['tackle']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Blissey", ability: 'serenegrace', moves: ['aromatherapy']},
			{species: "Blissey", ability: 'serenegrace', moves: ['aromatherapy']}
		]);
		battle.commitDecisions();

		var blissey = battle.p2.active[0];

		battle.choose('p1', 'move 1, move 1 1');
		battle.choose('p2', 'move 1, move 1');

		var damage = blissey.maxhp - blissey.hp;

		// Restart the battle but with sun
		blissey.heal(blissey.maxhp);
		battle.setWeather('sunnyday');
		battle.seed = battle.startingSeed.slice();
		battle.choose('p1', 'move 1, move 1 1');
		battle.choose('p2', 'move 1, move 1');

		var sunDamage = blissey.maxhp - blissey.hp;
		assert.strictEqual(sunDamage, battle.modify(damage, 1.5));
	});
});
