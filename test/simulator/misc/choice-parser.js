var assert = require('assert');
var battle;

describe('Choice parser', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should force Struggle usage on move attempt for no valid moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['sketch']}]);

		// First turn
		battle.choose('p1', 'move 1');
		battle.choose('p2', 'move 1');

		// Second turn
		battle.choose('p1', 'move recover');
		battle.choose('p2', 'move sketch');

		// Implementation-dependent paths
		if (battle.turn === 3) {
			assert.strictEqual(battle.p2.active[0].lastMove, 'struggle');
		} else {
			battle.choose('p2', 'move 1');
			assert.strictEqual(battle.turn, 3);
			assert.strictEqual(battle.p2.active[0].lastMove, 'struggle');
		}
	});

	it('should not force Struggle usage on move attempt for valid moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['recover']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Rhydon", ability: 'prankster', moves: ['struggle', 'surf']}]);

		// First turn
		battle.choose('p1', 'move 1');
		battle.choose('p2', 'move 2');

		assert.strictEqual(battle.turn, 2);
		assert.notStrictEqual(battle.p2.active[0].lastMove, 'struggle');
	});
});
