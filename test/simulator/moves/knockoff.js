'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Knock Off', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should remove most items', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Blissey", ability: 'naturalcure', item: 'shedshell', moves: ['softboiled']}]);
		battle.makeChoices('move knockoff', 'move softboiled');
		assert.strictEqual(battle.p2.active[0].item, '');
	});

	it('should not remove plates from Arceus', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Arceus", ability: 'download', item: 'flameplate', moves: ['swordsdance']}]);
		battle.makeChoices('move knockoff', 'move swordsdance');
		assert.strictEqual(battle.p2.active[0].item, 'flameplate');
	});

	it('should not remove drives from Genesect', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Genesect", ability: 'download', item: 'dousedrive', moves: ['shiftgear']}]);
		battle.makeChoices('move knockoff', 'move shiftgear');
		assert.strictEqual(battle.p2.active[0].item, 'dousedrive');
	});

	it('should not remove correctly held mega stones', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Scizor", ability: 'technician', item: 'scizorite', moves: ['swordsdance']}]);
		battle.makeChoices('move knockoff', 'move swordsdance');
		assert.strictEqual(battle.p2.active[0].item, 'scizorite');
	});

	it('should remove wrong mega stones', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Scizor", ability: 'technician', item: 'audinite', moves: ['swordsdance']}]);
		battle.makeChoices('move knockoff', 'move swordsdance');
		assert.strictEqual(battle.p2.active[0].item, '');
	});

	it('should not remove items if the user faints mid-move', function () {
		battle = common.createBattle();
		battle.join('p1', 'Guest 1', 1, [{species: "Shedinja", ability: 'wonderguard', moves: ['knockoff']}]);
		battle.join('p2', 'Guest 2', 1, [{species: "Ferrothorn", ability: 'ironbarbs', item: 'rockyhelmet', moves: ['curse']}]);
		battle.makeChoices('move knockoff', 'move curse');
		assert.strictEqual(battle.p2.active[0].item, 'rockyhelmet');
	});
});
