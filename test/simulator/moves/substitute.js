var assert = require('assert');
var battle;

describe('Substitute', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should deduct 25% of max HP, rounded down', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mewtwo', ability: 'pressure', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Mewtwo', ability: 'pressure', moves: ['recover']}]);
		battle.commitDecisions();
		var pokemon = battle.p1.active[0];
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 4));
	});

	it('should not block the user\'s own moves from targetting itself', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mewtwo', ability: 'pressure', moves: ['substitute', 'calmmind']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Mewtwo', ability: 'pressure', moves: ['recover']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['spa'], 1);
		assert.strictEqual(battle.p1.active[0].boosts['spd'], 1);
	});

	it('should block damage from most moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mewtwo', ability: 'pressure', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Mewtwo', ability: 'pressure', item: 'laggingtail', moves: ['psystrike']}]);
		battle.commitDecisions();
		var pokemon = battle.p1.active[0];
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 4));
	});

	it('should not block recoil damage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mewtwo', ability: 'pressure', moves: ['substitute', 'doubleedge']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Mewtwo', ability: 'pressure', moves: ['nastyplot']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		var pokemon = battle.p1.active[0];
		assert.notStrictEqual(pokemon.maxhp - pokemon.hp, Math.floor(pokemon.maxhp / 4));
	});

	it('should cause recoil damage from an opponent\'s moves to be based on damage dealt to the substitute', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mewtwo', ability: 'pressure', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Mewtwo', ability: 'noguard', moves: ['nastyplot', 'lightofruin']}]);
		battle.commitDecisions();
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		var pokemon = battle.p2.active[0];
		assert.strictEqual(pokemon.maxhp - pokemon.hp, Math.ceil(Math.floor(battle.p1.active[0].maxhp / 4) / 2));
	});

	it('should cause recovery from an opponent\'s draining moves to be based on damage dealt to the substitute', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Zangoose', ability: 'pressure', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Zangoose', ability: 'noguard', moves: ['bellydrum', 'drainpunch']}]);
		battle.commitDecisions();
		var hp = battle.p2.active[0].hp;
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp - hp, Math.ceil(Math.floor(battle.p1.active[0].maxhp / 4) / 2));
	});

	it('should block most status moves targetting the user', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Mewtwo', ability: 'noguard', moves: ['substitute']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Mewtwo', ability: 'pressure', item: 'laggingtail', moves: ['hypnosis', 'toxic', 'poisongas', 'thunderwave', 'willowisp']}]);
		for (var i = 1; i <= 5; i++) {
			battle.choose('p2', 'move ' + i);
			battle.commitDecisions();
			assert.strictEqual(battle.p1.active[0].status, '');
		}
	});

	it('should allow multi-hit moves to continue after the substitute fades', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Dragonite', ability: 'noguard', item: 'focussash', moves: ['substitute', 'roost']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Dragonite', ability: 'hugepower', item: 'laggingtail', moves: ['roost', 'dualchop']}]);
		battle.commitDecisions();
		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
