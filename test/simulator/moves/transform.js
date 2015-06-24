var assert = require('assert');
var battle;

describe('Transform', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should copy the Pokemon\'s template', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Hoopa-Unbound", ability: 'magician', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
	});

	it('should copy all stats except HP', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Mewtwo", ability: 'pressure', moves: ['rest']}]);
		battle.commitDecisions();
		var p1poke = battle.p1.active[0];
		var p2poke = battle.p2.active[0];
		for (var stat in p1poke.stats) {
			assert.strictEqual(p1poke.stats[stat], p2poke.stats[stat]);
		}
		assert.notStrictEqual(p1poke.hp, p2poke.hp);
		assert.notStrictEqual(p1poke.maxhp, p2poke.maxhp);
	});

	it('should copy all stat changes', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', item: 'laggingtail', moves: ['calmmind', 'agility', 'transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Scolipede", ability: 'swarm', moves: ['honeclaws', 'irondefense', 'doubleteam']}]);
		for (var i = 1; i <= 3; i++) {
			battle.choose('p1', 'move ' + i);
			battle.choose('p2', 'move ' + i);
		}
		var p1poke = battle.p1.active[0];
		var p2poke = battle.p2.active[0];
		for (var stat in p1poke.boosts) {
			assert.strictEqual(p1poke.boosts[stat], p2poke.boosts[stat]);
		}
	});

	it('should copy the target\'s moves with 5 PP each', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Mew", ability: 'synchronize', moves: ['rest', 'psychic', 'energyball', 'hyperbeam']}]);
		var p1poke = battle.p1.active[0];
		var p2poke = battle.p2.active[0];
		battle.commitDecisions();
		assert.strictEqual(p1poke.moves.length, p2poke.moves.length);
		for (var i = 0; i < p1poke.moves.length; i++) {
			var move = p1poke.moves[i];
			assert.strictEqual(move, p2poke.moves[i]);
			move = battle.getMove(move);
			var movepp = p1poke.getMoveData(move);
			assert.strictEqual(movepp.pp, 5);
		}
	});

	it('should copy and activate the target\'s ability', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Arcanine", ability: 'intimidate', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['atk'], -1);
	});

	it('should not copy speed boosts from Unburden', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Hitmonlee", ability: 'unburden', item: 'normalgem', moves: ['feint']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].getStat('spe'), battle.p2.active[0].getStat('spe'));
	});

	it('should fail against Pokemon with a Substitute', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Mewtwo", ability: 'pressure', moves: ['substitute']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
	});

	it('should fail against Pokemon with Illusion active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Zoroark", ability: 'illusion', moves: ['rest']},
			{species: "Mewtwo", ability: 'pressure', moves: ['rest']}
		]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
	});

	it('should fail against tranformed Pokemon', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: "Magikarp", ability: 'rattled', moves: ['splash']},
			{species: "Mew", ability: 'synchronize', moves: ['transform']}
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
		battle.choose('p2', 'switch 2');
		battle.commitDecisions();
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
	});
});

describe('Transform [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should revert Pokemon transformed into Giratina-Origin to Giratina-Alternate if not holding a Griseous Orb', function () {
		battle = BattleEngine.Battle.construct('battle-transform-gira-a-dpp', 'gen4customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Giratina-Origin", ability: 'levitate', item: 'griseousorb', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].template.species, 'Giratina');
	});

	it('should cause Pokemon transformed into Giratina-Alternate to become Giratina-Origin if holding a Griseous Orb', function () {
		battle = BattleEngine.Battle.construct('battle-transform-gira-o-dpp', 'gen4customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', item: 'griseousorb', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Giratina", ability: 'pressure', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].template.species, 'Giratina-Origin');
	});

	it('should cause Pokemon transformed into Arceus to become an Arceus forme corresponding to its held Plate', function () {
		battle = BattleEngine.Battle.construct('battle-transform-arceus-dpp', 'gen4customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', item: 'flameplate', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Arceus-Steel", ability: 'multitype', item: 'ironplate', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].template.species, 'Arceus-Fire');
	});

	it('should succeed against a Substitute', function () {
		battle = BattleEngine.Battle.construct('battle-transform-substitute-dpp', 'gen4customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Ditto", ability: 'limber', moves: ['transform']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Mewtwo", ability: 'pressure', moves: ['substitute']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].template, battle.p2.active[0].template);
	});
});
