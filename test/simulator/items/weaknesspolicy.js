var assert = require('assert');
var battle;

describe('Weakness Policy', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should be triggered by super effective hits', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Lucario", ability: 'justified', moves: ['aurasphere']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blissey", ability: 'naturalcure', item: 'weaknesspolicy', moves: ['softboiled']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['atk'], 2);
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 2);
		assert.strictEqual(battle.p2.active[0].item, '');
	});

	it('should not be triggered by fixed damage moves', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Lucario", ability: 'justified', moves: ['seismictoss']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blissey", ability: 'naturalcure', item: 'weaknesspolicy', moves: ['softboiled']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].boosts['atk'], 0);
		assert.strictEqual(battle.p2.active[0].boosts['spa'], 0);
		assert.strictEqual(battle.p2.active[0].item, 'weaknesspolicy');
	});
});
