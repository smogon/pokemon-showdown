var assert = require('assert');
var battle;

describe('Immunity', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should make the user immune to poison', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Snorlax', ability: 'immunity', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'infiltrator', moves: ['toxic']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, '');
	});

	it('should cure poison if a Pokemon receives the ability', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Snorlax', ability: 'thickfat', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'immunity', moves: ['toxic', 'skillswap']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, 'tox');
		battle.choose('p2', 'move 2');
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].status, '');
	});

	it('should have its immunity to poison temporarily suppressed by Mold Breaker, but should cure the status immediately afterwards', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: 'Snorlax', ability: 'immunity', moves: ['curse']}]);
		battle.join('p2', 'Guest 2', 1, [{species: 'Crobat', ability: 'moldbreaker', moves: ['toxic']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.log.filter(function (line) {return line.match(/-status\|.*\|tox/);}).length, 1);
		assert.strictEqual(battle.p1.active[0].status, '');
	});
});
