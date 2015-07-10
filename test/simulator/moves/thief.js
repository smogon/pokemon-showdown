var assert = require('assert');
var battle;

describe('Thief', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should steal most items', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['thief']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blissey", ability: 'naturalcure', item: 'shedshell', moves: ['softboiled']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'shedshell');
	});

	it('should not steal items if it is holding an item', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', item: 'focussash', moves: ['thief']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blissey", ability: 'naturalcure', item: 'shedshell', moves: ['softboiled']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, 'shedshell');
	});

	it('should take Life Orb damage from a stolen Life Orb', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['thief']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blissey", ability: 'naturalcure', item: 'lifeorb', moves: ['softboiled']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].hp, Math.ceil(9 / 10 * battle.p1.active[0].maxhp));
	});
});
