var assert = require('assert');
var battle;

describe('Haze - RBY', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should remove stat changes', function () {
		battle = BattleEngine.Battle.construct('battle-haze-rby', 'gen1customgame');
		battle.seed = [0, 0, 0, 0];
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", moves: ['agility', 'haze']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Mewtwo", moves: ['swordsdance', 'splash']}]);

		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].boosts.spe, 2);
		assert.strictEqual(battle.p2.active[0].boosts.atk, 2);

		battle.choose('p1', 'move 2');
		battle.choose('p2', 'move 2');
		assert.strictEqual(battle.p1.active[0].boosts.spe, 0);
		assert.strictEqual(battle.p2.active[0].boosts.atk, 0);
	});

	it('should remove opponent\'s status', function () {
		battle = BattleEngine.Battle.construct('battle-haze-rby', 'gen1customgame');
		battle.seed = [0, 0, 0, 0];
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", moves: ['thunderwave', 'haze']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Mewtwo", moves: ['splash']}]);

		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'par');

		battle.choose('p1', 'move 2');
		battle.commitDecisions();
		assert.notStrictEqual(battle.p2.active[0].status, 'par');
	});

	it('should not remove user\'s status', function () {
		battle = BattleEngine.Battle.construct('battle-haze-rby', 'gen1customgame');
		battle.seed = [0, 0, 0, 0];
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", moves: ['thunderwave']}]);

		battle.join('p2', 'Guest 2', 1, [{species: "Mewtwo", moves: ['haze']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'par');

		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'par');
	});
});
