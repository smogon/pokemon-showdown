var assert = require('assert');
var battle;

describe('Magic Guard', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should prevent all non-attack damage', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			{species: 'Clefable', ability: 'magicguard', item: 'lifeorb', moves: ['doubleedge']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'roughskin', moves: ['spikes', 'toxic']}]);
		battle.commitDecisions();
		battle.choose('p1', 'switch 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p1.active[0].status, 'tox');
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});

	it('should not be suppressed by Mold Breaker', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
			{species: 'Clefable', ability: 'magicguard', moves: ['doubleedge']}
		]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Haxorus', ability: 'moldbreaker', moves: ['stealthrock', 'roar']}]);
		battle.commitDecisions();
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, battle.p1.active[0].maxhp);
	});
});
