var assert = require('assert');
var battle;

describe('Weather damage calculation', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should multiply the damage (not the basePower) in favorable weather', function () {
		battle = BattleEngine.Battle.construct();
		battle.randomizer = function (damage) {return damage;}; // max damage
		battle.join('p1', 'Guest 1', 1, [{species: 'Ninetales', ability: 'drought', moves: ['incinerate']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cryogonal', ability: 'levitate', moves: ['splash']}]);
		battle.commitDecisions();
		var pokemon = battle.p2.active[0];
		assert.strictEqual(pokemon.maxhp - pokemon.hp, 152);
	});

	it('should reduce the damage (not the basePower) in unfavorable weather', function () {
		battle = BattleEngine.Battle.construct();
		battle.randomizer = function (damage) {return damage;}; // max damage
		battle.join('p1', 'Guest 1', 1, [{species: 'Ninetales', ability: 'drizzle', moves: ['incinerate']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Cryogonal', ability: 'levitate', moves: ['splash']}]);
		battle.commitDecisions();
		var pokemon = battle.p2.active[0];
		assert.strictEqual(pokemon.maxhp - pokemon.hp, 50);
	});
});
