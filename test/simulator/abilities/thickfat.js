var assert = require('assert');
var battle;

describe('Thick Fat', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should halve damage from Fire- or Ice-type attacks', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Hariyama", ability: 'thickfat', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Nidoking", ability: 'sheerforce', moves: ['incinerate', 'icebeam']}]);
		var damage;
		var pokemon = battle.p1.active[0];
		battle.commitDecisions();
		damage = pokemon.maxhp - pokemon.hp;
		assert.ok(damage >= 29 && damage <= 35);
		pokemon.hp = pokemon.maxhp;
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		damage = pokemon.maxhp - pokemon.hp;
		assert.ok(damage >= 56 && damage <= 66);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Hariyama", ability: 'thickfat', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Nidoking", ability: 'moldbreaker', moves: ['incinerate', 'icebeam']}]);
		var damage;
		var pokemon = battle.p1.active[0];
		battle.commitDecisions();
		damage = pokemon.maxhp - pokemon.hp;
		assert.ok(damage >= 57 && damage <= 68);
		pokemon.hp = pokemon.maxhp;
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		damage = pokemon.maxhp - pokemon.hp;
		assert.ok(damage >= 85 && damage <= 101);
	});
});
