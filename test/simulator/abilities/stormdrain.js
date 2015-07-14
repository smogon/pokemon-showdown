var assert = require('assert');
var battle;

describe('Storm Drain', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should grant immunity to Water-type moves and boost Special Attack by 1 stage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.strictEqual(battle.p1.active[0].boosts['spa'], 1);
	});

	it('should redirect single-target Water-type attacks to the user if it is a valid target', function () {
		battle = BattleEngine.Battle.construct('battle-triples-stormdrain', 'triplescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['sleeptalk']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']},
			{species: 'Azumarill', ability: 'thickfat', moves: ['aquajet']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p1', 'move 1, move 1 1, move 1 1');
		battle.choose('p2', 'move 1 3, move 1 3, move 1 2');
		assert.strictEqual(battle.p1.active[0].boosts['spa'], 3);
		assert.notStrictEqual(battle.p1.active[2].hp, battle.p1.active[2].maxhp);
		assert.notStrictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});

	it('should have its Water-type immunity and its ability to redirect moves suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct('battle-moldbreaker-stormdrain', 'doublescustomgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Gastrodon', ability: 'stormdrain', moves: ['endure']},
			{species: 'Manaphy', ability: 'hydration', moves: ['tailglow']}
		]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Haxorus', ability: 'moldbreaker', moves: ['waterfall']},
			{species: 'Reshiram', ability: 'turboblaze', moves: ['waterpulse']}
		]);
		battle.commitDecisions(); // Team Preview
		battle.choose('p2', 'move 1 1, move 1 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		assert.notStrictEqual(battle.p1.active[1].hp, battle.p1.active[1].maxhp);
	});
});
