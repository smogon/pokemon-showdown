var assert = require('assert');
var battle;

describe('Delta Stream', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate the Delta Stream weather upon switch-in', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['roost']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Abra", ability: 'magicguard', moves: ['teleport']}]);
		assert.ok(battle.isWeather('deltastream'));
	});

	it('should negate the type weaknesses of the Flying-type', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Tornadus", ability: 'deltastream', item: 'weaknesspolicy', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['thundershock', 'powdersnow', 'powergem']}]);
		for (var i = 0; i < 3; i++) {
			battle.choose('p2', 'move ' + i);
			battle.commitDecisions();
			assert.strictEqual(battle.p1.active[0].boosts.atk, 0);
			assert.strictEqual(battle.p1.active[0].boosts.spa, 0);
		}
	});

	it('should not negate the type weaknesses of any other type, even if the Pokemon is Flying-type', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', item: 'weaknesspolicy', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Smeargle", ability: 'owntempo', moves: ['dragonpulse']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts.atk, 2);
		assert.strictEqual(battle.p1.active[0].boosts.spa, 2);
	});

	it('should prevent moves and abilities from setting the weather to Sunny Day, Rain Dance, Sandstorm, or Hail', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Abra", ability: 'magicguard', moves: ['teleport']},
			{species: "Kyogre", ability: 'drizzle', moves: ['raindance']},
			{species: "Groudon", ability: 'drought', moves: ['sunnyday']},
			{species: "Tyranitar", ability: 'sandstream', moves: ['sandstorm']},
			{species: "Abomasnow", ability: 'snowwarning', moves: ['hail']}
		]);
		for (var i = 2; i <= 5; i++) {
			battle.choose('p1', 'switch ' + i);
			battle.commitDecisions();
			assert.ok(battle.isWeather('deltastream'));
			battle.commitDecisions();
			assert.ok(battle.isWeather('deltastream'));
		}
	});

	it('should cause the Delta Stream weather to fade if it switches out and no other Delta Stream Pokemon are active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['roost']}]);
		battle.choose('p1', 'switch 2');
		battle.commitDecisions();
		assert.ok(battle.isWeather(''));
	});

	it('should not cause the Delta Stream weather to fade if it switches out and another Delta Stream Pokemon is active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['bulkup']}]);
		battle.choose('p1', 'switch 2');
		battle.commitDecisions();
		assert.ok(battle.isWeather('deltastream'));
	});

	it('should cause the Delta Stream weather to fade if its ability is suppressed and no other Delta Stream Pokemon are active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['gastroacid']}]);
		battle.commitDecisions();
		assert.ok(battle.isWeather(''));
	});

	it('should not cause the Delta Stream weather to fade if its ability is suppressed and another Delta Stream Pokemon is active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['gastroacid']}]);
		battle.commitDecisions();
		assert.ok(battle.isWeather('deltastream'));
	});

	it('should cause the Delta Stream weather to fade if its ability is changed and no other Delta Stream Pokemon are active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Rayquaza", ability: 'deltastream', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['entrainment']}]);
		battle.commitDecisions();
		assert.ok(battle.isWeather(''));
	});
});
