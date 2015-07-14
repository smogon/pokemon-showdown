var assert = require('assert');
var battle;

describe('Dry Skin', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should take 1/8 max HP every turn that Sunny Day is active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Toxicroak', ability: 'dryskin', moves: ['bulkup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Ninetales', ability: 'flashfire', moves: ['sunnyday']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, Math.ceil(7 / 8 * battle.p1.active[0].maxhp));
	});

	it('should heal 1/8 max HP every turn that Rain Dance is active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Toxicroak', ability: 'dryskin', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Politoed', ability: 'damp', moves: ['raindance']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, Math.ceil(7 / 8 * battle.p1.active[0].maxhp));
	});

	it('should grant immunity to Water-type moves and heal 1/4 max HP', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Toxicroak', ability: 'dryskin', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Politoed', ability: 'damp', moves: ['watergun']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should cause the user to take 1.25x damage from Fire-type attacks', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Toxicroak', ability: 'dryskin', moves: ['bulkup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'unnerve', moves: ['incinerate']}]);
		battle.commitDecisions();
		var damage = battle.p1.active[0].maxhp - battle.p1.active[0].hp;
		assert.ok(damage >= 51 && damage <= 61);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Toxicroak', ability: 'dryskin', moves: ['bulkup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['incinerate', 'surf']}]);
		battle.commitDecisions();
		var pokemon = battle.p1.active[0];
		var damage = pokemon.maxhp - pokemon.hp;
		assert.ok(damage >= 41 && damage <= 49);
		pokemon.hp = pokemon.maxhp;
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.notStrictEqual(pokemon.hp, pokemon.maxhp);
	});
});
