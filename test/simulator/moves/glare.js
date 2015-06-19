var assert = require('assert');
var battle;

describe('Glare', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should inflict paralysis on its target', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Arbok", ability: 'noguard', moves: ['glare']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Ekans", ability: 'sturdy', moves: ['bulkup']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'par');
	});

	it('should ignore natural type immunities', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Arbok", ability: 'noguard', moves: ['glare']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gengar", ability: 'blaze', moves: ['bulkup']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, 'par');
	});
});

describe('Glare [Gen 3]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not ignore natural type immunities', function () {
		battle = BattleEngine.Battle.construct('battle-rse-glare-ghosts', 'gen3customgame');
		battle.join('p1', 'Guest 1', 1, [{species: "Arbok", ability: 'noguard', moves: ['glare']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Gengar", ability: 'blaze', moves: ['bulkup']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].status, '');
	});
});
