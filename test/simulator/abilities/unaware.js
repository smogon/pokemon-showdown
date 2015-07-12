var assert = require('assert');
var battle;

describe('Unaware', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should ignore attack stage changes when Pokemon with it are attacked', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Clefable', ability: 'unaware', moves: ['softboiled']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Hariyama', ability: 'thickfat', moves: ['vitalthrow', 'bellydrum']}]);
		battle.commitDecisions();
		var pokemon = battle.p1.active[0];
		var damage = pokemon.maxhp - pokemon.hp;
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		battle.seed = battle.startingSeed.slice();
		battle.commitDecisions();
		assert.strictEqual(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should not ignore attack stage changes when Pokemon with it attack', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Clefable', ability: 'unaware', moves: ['moonblast', 'nastyplot']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Registeel', ability: 'prankster', moves: ['splash']}]);
		battle.commitDecisions();
		var pokemon = battle.p2.active[0];
		var damage = pokemon.maxhp - pokemon.hp;
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		pokemon.hp = pokemon.maxhp;
		battle.seed = battle.startingSeed.slice();
		battle.commitDecisions();
		assert.notStrictEqual(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should ignore defense stage changes when Pokemon with it attack', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Clefable', ability: 'unaware', moves: ['moonblast']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Hariyama', ability: 'thickfat', item: 'laggingtail', moves: ['amnesia']}]);
		battle.commitDecisions();
		var pokemon = battle.p2.active[0];
		var damage = pokemon.maxhp - pokemon.hp;
		pokemon.hp = pokemon.maxhp;
		battle.seed = battle.startingSeed.slice();
		battle.commitDecisions();
		assert.strictEqual(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should not ignore defense stage changes when Pokemon with it are attacked', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Clefable', ability: 'unaware', moves: ['irondefense']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Registeel', ability: 'clearbody', moves: ['shadowsneak']}]);
		battle.commitDecisions();
		var pokemon = battle.p1.active[0];
		var damage = pokemon.maxhp - pokemon.hp;
		pokemon.hp = pokemon.maxhp;
		battle.seed = battle.startingSeed.slice();
		battle.commitDecisions();
		assert.notStrictEqual(pokemon.maxhp - pokemon.hp, damage);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Clefable', ability: 'unaware', moves: ['splash']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['shadowsneak']}]);
		battle.commitDecisions();
		var pokemon = battle.p1.active[0];
		var damage = pokemon.maxhp - pokemon.hp;
		battle.boost({atk: 2}, battle.p2.active[0]);
		pokemon.hp = pokemon.maxhp;
		battle.seed = battle.startingSeed.slice();
		battle.commitDecisions();
		assert.notStrictEqual(pokemon.maxhp - pokemon.hp, damage);
	});
});
