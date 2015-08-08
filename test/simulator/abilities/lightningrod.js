var assert = require('assert');
var battle;

describe('Lightning Rod', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should grant immunity to Electric-type moves and boost Special Attack by 1 stage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Manectric', ability: 'lightningrod', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Jolteon', ability: 'static', moves: ['thunderbolt']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p1.active[0].boosts['spa'], 1);
	});

	it('should not boost Special Attack if the user is already immune to Electric-type moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Rhydon', ability: 'lightningrod', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Jolteon', ability: 'static', moves: ['thunderbolt']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts['spa'], 0);
	});

	it('should redirect single-target Electric-type attacks to the user if it is a valid target', function () {
		battle = BattleEngine.Battle.construct('battle-triples-lightningrod', 'triplescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Manectric', ability: 'lightningrod', moves: ['sleeptalk']},
			{species: 'Electrode', ability: 'static', moves: ['thunderbolt']},
			{species: 'Electrode', ability: 'static', moves: ['thunderbolt']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Electrode', ability: 'static', moves: ['thunderbolt']},
			{species: 'Electrode', ability: 'static', moves: ['thunderbolt']},
			{species: 'Electrode', ability: 'static', moves: ['thunderbolt']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1, move 1 1, move 1 1');
		battle.choose('p2', 'move 1 3, move 1 3, move 1 2');
		assert.strictEqual(battle.p1.active[0].boosts['spa'], 3);
		assert.notStrictEqual(battle.p1.active[2].hp, battle.p1.active[2].maxhp);
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should have its Electric-type immunity and its ability to redirect moves suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct('battle-moldbreaker-lightningrod', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Manectric', ability: 'lightningrod', moves: ['endure']},
			{species: 'Manaphy', ability: 'hydration', moves: ['tailglow']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Haxorus', ability: 'moldbreaker', moves: ['thunderpunch']},
			{species: 'Zekrom', ability: 'teravolt', moves: ['shockwave']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p2', 'move 1 1, move 1 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.notStrictEqual(battle.p1.active[1].hp, battle.p1.active[1].maxhp);
	});
});
