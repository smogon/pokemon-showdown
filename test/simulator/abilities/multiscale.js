var assert = require('assert');
var battle;

describe('Multiscale', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should halve damage when it is at full health', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Dragonite", ability: 'multiscale', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gyarados", ability: 'moxie', moves: ['incinerate']}]);
		var damage, curhp;
		var pokemon = battle.p1.active[0];
		battle.commitDecisions();
		damage = pokemon.maxhp - pokemon.hp;
		curhp = pokemon.hp;
		battle.seed = battle.startingSeed.slice();
		battle.commitDecisions();
		assert.strictEqual(damage, battle.modify(curhp - pokemon.hp, 0.5));
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Dragonite", ability: 'multiscale', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gyarados", ability: 'moldbreaker', moves: ['incinerate']}]);
		var damage, curhp;
		var pokemon = battle.p1.active[0];
		battle.commitDecisions();
		damage = pokemon.maxhp - pokemon.hp;
		curhp = pokemon.hp;
		battle.seed = battle.startingSeed.slice();
		battle.commitDecisions();
		assert.strictEqual(curhp - pokemon.hp, damage);
	});
});
