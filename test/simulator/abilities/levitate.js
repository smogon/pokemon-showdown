var assert = require('assert');
var battle;

describe('Levitate', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should give the user an immunity to Ground-type moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Rotom', ability: 'levitate', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Aggron', ability: 'sturdy', moves: ['earthquake']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should make the user airborne', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Unown', ability: 'levitate', moves: ['spore']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Espeon', ability: 'magicbounce', moves: ['electricterrain']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, 'slp');
	});

	it('should have its Ground immunity suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['earthquake']}]);
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should have its airborne property suppressed by Mold Breaker if it is forced out by a move', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']},
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['roar', 'spikes']}]);
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		battle.commitDecisions();
		assert.notStrictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not have its airborne property suppressed by Mold Breaker if it switches out via Eject Button', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Cresselia', ability: 'levitate', item: 'ejectbutton', moves: ['sleeptalk']},
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['tackle', 'spikes']}]);
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		battle.commitDecisions();
		battle.choose('p1', 'switch 2');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not have its airborne property suppressed by Mold Breaker if that Pokemon is no longer active', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Forretress', ability: 'levitate', item: 'redcard', moves: ['spikes']}]);
		battle.join('p2', 'Guest 2', 1, [
			{species: 'Haxorus', ability: 'moldbreaker', item: 'laggingtail', moves: ['tackle']},
			{species: 'Rotom', ability: 'levitate', moves: ['rest']}
		]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});
});

describe('Levitate [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not have its airborne property suppressed by Mold Breaker if it is forced out by a move', function () {
		battle = BattleEngine.Battle.construct('battle-dpp-levitate', 'gen4customgame');
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']},
			{species: 'Cresselia', ability: 'levitate', moves: ['sleeptalk']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Rampardos', ability: 'moldbreaker', moves: ['roar', 'spikes']}]);
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
