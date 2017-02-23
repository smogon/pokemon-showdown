'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Trick', function () {
	afterEach(() => battle.destroy());

	it("should exchange the items of the user and target", function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', item: 'leftovers', moves: ['trick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Purugly", ability: 'defiant', item: 'sitrusberry', moves: ['rest']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'sitrusberry');
		assert.strictEqual(battle.p2.active[0].item, 'leftovers');
	});

	it('should not take plates from Arceus', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['trick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Arceus", ability: 'download', item: 'flameplate', moves: ['swordsdance']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, 'flameplate');
	});

	it('should not cause Arceus to gain a plate', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', item: 'fistplate', moves: ['trick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Arceus", ability: 'download', moves: ['swordsdance']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, '');
	});

	it('should not remove drives from Genesect', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['trick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Genesect", ability: 'download', item: 'dousedrive', moves: ['shiftgear']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, 'dousedrive');
	});

	it('should not cause Genesect to gain a drive', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', item: 'shockdrive', moves: ['trick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Genesect", ability: 'download', moves: ['shiftgear']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, '');
	});

	it('should not remove correctly held mega stones', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['trick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Scizor", ability: 'technician', item: 'scizorite', moves: ['swordsdance']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p2.active[0].item, 'scizorite');
	});

	it('should remove wrong mega stones', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['trick']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Scizor", ability: 'technician', item: 'audinite', moves: ['swordsdance']}]);
		battle.commitDecisions();
		assert.strictEqual(battle.p1.active[0].item, 'audinite');
	});
});

describe('Z-Trick', function () {
	afterEach(() => battle.destroy());

	it("boost the user's Speed by 2 stages, but should fail to exchange the items", function () {
		battle = common.createBattle();
		const p1 = battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', item: 'psychiumz', moves: ['trick']}]);
		const p2 = battle.join('p2', 'Guest 2', 1, [{species: "Rattata", ability: 'guts', item: 'leftovers', moves: ['quickattack']}]);
		p1.chooseMove('trick', 0, 'zmove').foe.chooseDefault();
		assert.statStage(p1.active[0], 'spe', 2);
		assert.strictEqual(p1.active[0].item, 'psychiumz');
		assert.strictEqual(p2.active[0].item, 'leftovers');
	});
});