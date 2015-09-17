var assert = require('assert');
var battle;

describe('Primordial Sea', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate the Primordial Sea weather upon switch-in', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Abra", ability: 'magicguard', moves: ['teleport']}]);
		assert.ok(battle.isWeather('primordialsea'));
	});

	it('should not increase the power of Water-type attacks', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blastoise", ability: 'torrent', moves: ['waterpledge']}]);
		battle.commitDecisions();
		var move = Tools.getMove('waterpledge');
		var basePower = battle.runEvent('BasePower', battle.p2.active[0], battle.p1.active[0], move, move.basePower, true);
		assert.strictEqual(basePower, move.basePower);
	});

	it('should cause Fire-type attacks to fail', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charizard", ability: 'blaze', moves: ['flamethrower']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not cause Fire-type Status moves to fail', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Charizard", ability: 'noguard', moves: ['willowisp']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, 'brn');
	});

	it('should prevent moves and abilities from setting the weather to Sunny Day, Rain Dance, Sandstorm, or Hail', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
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
			assert.ok(battle.isWeather('primordialsea'));
			battle.commitDecisions();
			assert.ok(battle.isWeather('primordialsea'));
		}
	});

	it('should be treated as Rain Dance for any forme, move or ability that requires it', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['sonicboom']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Castform", ability: 'forecast', moves: ['weatherball']},
			{species: "Kingdra", ability: 'swiftswim', moves: ['focusenergy']},
			{species: "Ludicolo", ability: 'raindish', moves: ['watersport']},
			{species: "Toxicroak", ability: 'dryskin', moves: ['bulkup']},
			{species: "Manaphy", ability: 'hydration', item: 'laggingtail', moves: ['rest']}
		]);
		battle.p1.active[0].damage = function () {
			if (battle.activeMove.id === 'weatherball') {
				assert.strictEqual(battle.activeMove.type, 'Water');
			}
			return BattleEngine.BattlePokemon.prototype.damage.apply(this, arguments);
		};
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].template.speciesid, 'castformrainy');
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].getStat('spe'), 2 * battle.p2.active[0].stats['spe']);
		battle.choose('p2', 'switch 3');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 20);
		battle.choose('p2', 'switch 4');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 20);
		battle.choose('p2', 'switch 5');
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, '');
	});

	it('should cause the Primordial Sea weather to fade if it switches out and no other Primordial Sea Pokemon are active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['roost']}]);
		battle.choose('p1', 'switch 2');
		battle.commitDecisions();
		assert.ok(battle.isWeather(''));
	});

	it('should not cause the Primordial Sea weather to fade if it switches out and another Primordial Sea Pokemon is active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']},
			{species: "Ho-Oh", ability: 'pressure', moves: ['roost']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['bulkup']}]);
		battle.choose('p1', 'switch 2');
		battle.commitDecisions();
		assert.ok(battle.isWeather('primordialsea'));
	});

	it('should cause the Primordial Sea weather to fade if its ability is suppressed and no other Primordial Sea Pokemon are active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['gastroacid']}]);
		battle.commitDecisions();
		assert.ok(battle.isWeather(''));
	});

	it('should not cause the Primordial Sea weather to fade if its ability is suppressed and another Primordial Sea Pokemon is active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['gastroacid']}]);
		battle.commitDecisions();
		assert.ok(battle.isWeather('primordialsea'));
	});

	it('should cause the Primordial Sea weather to fade if its ability is changed and no other Primordial Sea Pokemon are active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Kyogre", ability: 'primordialsea', moves: ['helpinghand']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Lugia", ability: 'pressure', moves: ['entrainment']}]);
		battle.commitDecisions();
		assert.ok(battle.isWeather(''));
	});
});
