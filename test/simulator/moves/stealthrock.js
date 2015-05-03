var assert = require('assert');
var battle;

describe('Stealth Rock', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should succeed against Substitute', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Smeargle", moves: ['stealthrock']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Ninjask", moves: ['substitute']}]);
		battle.commitDecisions();
		assert(battle.p2.sideConditions['stealthrock']);
	});
});
