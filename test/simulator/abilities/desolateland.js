var assert = require('assert');
var battle;

describe('Desolate Land', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate the Desolate Land weather upon switch-in', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Abra", ability: 'magicguard', moves: ['teleport']}]);
		assert.ok(battle.isWeather('desolateland'));
	});

	it('should not increase the base power of Fire-type attacks', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charizard", ability: 'blaze', moves: ['firepledge']}]);
		battle.commitDecisions();
		var move = Tools.getMove('firepledge');
		var basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should cause Water-type attacks to fail', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blastoise", ability: 'torrent', moves: ['surf']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not cause Water-type Status moves to fail', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blastoise", ability: 'torrent', moves: ['soak']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].typesData.length, 1);
		assert.strictEqual(battle.p1.active[0].typesData[0].type, 'Water');
	});

	it('should prevent moves and abilities from setting the weather to Sunny Day, Rain Dance, Sandstorm, or Hail', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
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
			assert.ok(battle.isWeather('desolateland'));
			battle.commitDecisions();
			assert.ok(battle.isWeather('desolateland'));
		}
	});

	it('should be treated as Sunny Day for any forme, move or ability that requires it', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand', 'solarbeam']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Castform", ability: 'forecast', moves: ['weatherball']},
			{species: "Cherrim", ability: 'flowergift', moves: ['growth']},
			{species: "Charizard", ability: 'solarpower', moves: ['roost']},
			{species: "Venusaur", ability: 'chlorophyll', moves: ['growth']},
			{species: "Toxicroak", ability: 'dryskin', moves: ['bulkup']}
		]);
		battle.test = true;
		battle.p1.active[0].damage = function () {
			if (battle.activeMove.id === 'weatherball') {
				assert.strictEqual(battle.activeMove.type, 'Fire');
			}
			return BattleEngine.BattlePokemon.prototype.damage.apply(this, arguments);
		};
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'castformsunny');
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'cherrimsunshine');
		battle.choose('p2', 'switch 3');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'switch 4');
		assert.strictEqual(battle.p2.active[0].getStat('spe'), 2 * battle.p2.active[0].stats['spe']);
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
		battle.choose('p2', 'switch 5');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should cause the Desolate Land weather to fade if it switches out and no other Desolate Land Pokemon are active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['roost']}]);
		battle.choose('p1', 'switch 2');
		battle.commitDecisions();
		assert.ok(battle.isWeather(''));
	});

	it('should not cause the Desolate Land weather to fade if it switches out and another Desolate Land Pokemon is active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Groudon", ability: 'desolateland', moves: ['bulkup']}]);
		battle.choose('p1', 'switch 2');
		battle.commitDecisions();
		assert.ok(battle.isWeather('desolateland'));
	});

	it('should cause the Desolate Land weather to fade if its ability is suppressed and no other Desolate Land Pokemon are active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['gastroacid']}]);
		battle.commitDecisions();
		assert.ok(battle.isWeather(''));
	});

	it('should not cause the Desolate Land weather to fade if its ability is suppressed and another Desolate Land Pokemon is active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Groudon", ability: 'desolateland', moves: ['gastroacid']}]);
		battle.commitDecisions();
		assert.ok(battle.isWeather('desolateland'));
	});

	it('should cause the Desolate Land weather to fade if its ability is changed and no other Desolate Land Pokemon are active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Groudon", ability: 'desolateland', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['entrainment']}]);
		battle.commitDecisions();
		assert.ok(battle.isWeather(''));
	});
});
