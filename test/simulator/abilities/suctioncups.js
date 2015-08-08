var assert = require('assert');
var battle;

describe('Suction Cups', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent the user from being forced out', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Shuckle', ability: 'suctioncups', moves: ['rapidspin']},
			{species: 'Forretress', ability: 'sturdy', moves: ['rapidspin']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Smeargle', ability: 'noguard', item: 'redcard', moves: ['healpulse', 'dragontail', 'circlethrow', 'roar']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, ''); // If Red Card is not working properly, this will fail
		assert.strictEqual(battle.p1.active[0].template.speciesid, 'shuckle');
		for (var i = 2; i <= 4; i++) {
			battle.choose('p2', 'move ' + i);
			battle.commitDecisions();
			assert.strictEqual(battle.p1.active[0].template.speciesid, 'shuckle');
		}
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Pangoro', ability: 'moldbreaker', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Shuckle', ability: 'suctioncups', item: 'ironball', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, '');
	});
});
