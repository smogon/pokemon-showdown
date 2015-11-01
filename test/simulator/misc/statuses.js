var assert = require('assert');
var battle;

describe('Burn', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict 1/8 of max HP at the end of the turn, rounded down', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Machamp', ability: 'noguard', moves: ['bulkup']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sableye', ability: 'prankster', moves: ['willowisp']}]);
		battle.commitDecisions();
		var pokemon = battle.p1.active[0];
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 8));
	});

	it('should halve damage from most Physical attacks', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Machamp', ability: 'noguard', moves: ['boneclub']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Sableye', ability: 'prankster', moves: ['splash', 'willowisp']}]);
		battle.commitDecisions();
		var pokemon = battle.p2.active[0];
		var damage = pokemon.maxhp - pokemon.hp;
		pokemon.hp = pokemon.maxhp;
		battle.seed = battle.startingSeed.slice();
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(pokemon.maxhp - pokemon.hp, battle.modify(damage, 0.5));
	});

	it('should not halve damage from moves with set damage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Machamp', ability: 'noguard', moves: ['seismictoss']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Talonflame', ability: 'galewings', moves: ['willowisp']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].maxhp - battle.p2.active[0].hp, 100);
	});
});

describe('Paralysis', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should reduce speed to 25% of its original value', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Vaporeon', ability: 'waterabsorb', moves: ['aquaring']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Jolteon', ability: 'voltabsorb', moves: ['thunderwave']}]);
		var speed = battle.p1.active[0].getStat('spe');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].getStat('spe'), battle.modify(speed, 0.25));
	});
});

describe('Toxic Poison', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict 1/16 of max HP rounded down, times the number of active turns with the status, at the end of the turn', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Chansey', ability: 'naturalcure', moves: ['softboiled']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Gengar', ability: 'levitate', moves: ['toxic']}]);
		var pokemon = battle.p1.active[0];
		for (var i = 1; i <= 8; i++) {
			battle.commitDecisions();
			assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16) * i);
		}
	});

	it('should reset the damage counter when the Pokemon switches out', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Chansey', ability: 'serenegrace', moves: ['counter']},
			{species: 'Snorlax', ability: 'immunity', moves: ['curse']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'infiltrator', moves: ['toxic', 'whirlwind']}]);
		for (var i = 0; i < 4; i++) {
			battle.commitDecisions();
		}
		var pokemon = battle.p1.active[0];
		pokemon.hp = pokemon.maxhp;
		battle.choose('p1', 'switch 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
	});
});

describe('Toxic Poison [Gen 1]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should affect Leech Seed damage counter', function () {
		battle = BattleEngine.Battle.construct('battle-rby-toxic-leechseed', 'gen1customgame');
		battle.join('p1', 'Guest 1', 1, [{species: 'Venusaur', moves: ['toxic', 'leechseed']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Chansey', moves: ['splash']}]);
		battle.commitDecisions();
		var pokemon = battle.p2.active[0];
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16));
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		// (1/16) + (2/16) + (3/16) = (6/16)
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 16) * 6);
	});
});
