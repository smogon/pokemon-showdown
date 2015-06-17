var assert = require('assert');
var battle;

describe('Knock Off', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should remove most items', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blissey", ability: 'naturalcure', item: 'shedshell', moves: ['softboiled']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, '');
	});

	it('should not remove plates from Arceus', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Arceus", ability: 'download', item: 'flameplate', moves: ['swordsdance']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, 'flameplate');
	});

	it('should not remove drives from Genesect', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Genesect", ability: 'download', item: 'dousedrive', moves: ['shiftgear']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, 'dousedrive');
	});

	it('should not remove correctly held mega stones', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Scizor", ability: 'technician', item: 'scizorite', moves: ['swordsdance']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, 'scizorite');
	});

	it('should remove wrong mega stones', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Scizor", ability: 'technician', item: 'audinite', moves: ['swordsdance']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, '');
	});

	it('should not remove items if the user faints mid-move', function () {
		battle = BattleEngine.Battle.construct();
		battle.join('p1', 'Guest 1', 1, [{species: "Shedinja", ability: 'wonderguard', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Ferrothorn", ability: 'ironbarbs', item: 'rockyhelmet', moves: ['curse']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, 'rockyhelmet');
	});
});
