var assert = require('assert');
var battle;

describe('Cloud Nine', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should treat the weather as none for the purposes of formes, moves and abilities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['sunnyday']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cherrim', ability: 'flowergift', item: 'laggingtail', moves: ['solarbeam']}]);
		battle.commitDecisions();
		assert.ok(battle.isWeather('', battle.p2.active[0]));
		assert.strictEqual(battle.p2.active[0].template.species, 'Cherrim');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should negate the effects of Sun on Fire-type and Water-type attacks', function () {
		battle = BattleEngine.Battle.construct();
		var move, basePower;
		battle.join('p1', 'Guest 1', 1, [{species: 'Groudon', ability: 'drought', moves: ['rest']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]);
		battle.commitDecisions();
		move = Tools.getMove('firepledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
		move = Tools.getMove('waterpledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should negate the effects of Rain on Fire-type and Water-type attacks', function () {
		battle = BattleEngine.Battle.construct();
		var move, basePower;
		battle.join('p1', 'Guest 1', 1, [{species: 'Kyogre', ability: 'drizzle', moves: ['rest']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]);
		battle.commitDecisions();
		move = Tools.getMove('firepledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
		move = Tools.getMove('waterpledge');
		basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should negate the damage-dealing effects of Sandstorm', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Tyranitar', ability: 'sandstream', moves: ['dragondance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should negate the damage-dealing effects of Hail', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Abomasnow', ability: 'snowwarning', moves: ['rest']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should not negate Desolate Land\'s ability to prevent other weathers from activating', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Groudon', ability: 'desolateland', moves: ['sunnyday']}]);
		battle.commitDecisions();
		assert.ok(battle.weather, 'desolateland');
	});

	it('should not negate Primordial Sea\'s ability to prevent other weathers from activating', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Kyogre', ability: 'primordialsea', moves: ['sunnyday']}]);
		battle.commitDecisions();
		assert.ok(battle.weather, 'primordialsea');
	});

	it('should not negate Delta Stream\'s ability to prevent other weathers from activating', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['raindance']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Rayquaza', ability: 'deltastream', moves: ['sunnyday']}]);
		battle.commitDecisions();
		assert.ok(battle.weather, 'deltastream');
	});

	it('should still display status of the weather', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Golduck', ability: 'cloudnine', moves: ['calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sunkern', ability: 'solarpower', moves: ['sunnyday']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.log[battle.lastMoveLine + 1], '|-weather|SunnyDay');
		for (var i = 0; i < 4; i++) {
			assert.strictEqual(battle.log[battle.lastMoveLine + 3], '|-weather|SunnyDay|[upkeep]');
			battle.commitDecisions();
		}
		assert.strictEqual(battle.log[battle.lastMoveLine + 3], '|-weather|none');
	});
});
