var assert = require('assert');
var battle;

describe('Clear Body', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should negate stat drops from opposing effects', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tentacruel', ability: 'clearbody', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Arbok', ability: 'intimidate', moves: ['acidspray', 'leer', 'icywind', 'charm', 'confide']}]);
		var stats = Object.keys(battle.p1.active[0].boosts);
		for (var i = 1; i <= 5; i++) {
			battle.choose('p2', 'move ' + i);
			battle.commitDecisions();
			for (var j = 0; j < stats.length; j++) {
				assert.strictEqual(battle.p1.active[0].boosts[stats[j]], 0);
			}
		}
	});

	it('should not negate stat drops from the user\'s moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tentacruel', ability: 'clearbody', moves: ['superpower']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Arbok', ability: 'unnerve', moves: ['coil']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
		assert.strictEqual(battle.p1.active[0].boosts['def'], -1);
	});

	it('should not negate stat boosts from opposing moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tentacruel', ability: 'clearbody', moves: ['shadowsneak']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Arbok', ability: 'unnerve', moves: ['swagger']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['atk'], 2);
	});

	it('should not negate absolute stat changes', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tentacruel', ability: 'clearbody', moves: ['coil']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Arbok', ability: 'unnerve', moves: ['topsyturvy']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
		assert.strictEqual(battle.p1.active[0].boosts['def'], -1);
		assert.strictEqual(battle.p1.active[0].boosts['accuracy'], -1);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tentacruel', ability: 'clearbody', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['growl']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['atk'], -1);
	});

	it('should be suppressed by Mold Breaker if it is forced out by a move', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Metagross', ability: 'clearbody', moves: ['sleeptalk']},
			{species: 'Metagross', ability: 'clearbody', moves: ['sleeptalk']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['roar', 'stickyweb']}]);
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['spe'], -1);
	});
});
