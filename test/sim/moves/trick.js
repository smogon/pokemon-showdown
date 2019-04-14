'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Trick', function () {
	afterEach(() => battle.destroy());

	it("should exchange the items of the user and target", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', item: 'leftovers', moves: ['trick']}]});
		battle.setPlayer('p2', {team: [{species: "Purugly", ability: 'defiant', item: 'sitrusberry', moves: ['rest']}]});
		battle.makeChoices('move trick', 'move rest');
		assert.strictEqual(battle.p1.active[0].item, 'sitrusberry');
		assert.strictEqual(battle.p2.active[0].item, 'leftovers');
	});

	it('should not take plates from Arceus', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['trick']}]});
		battle.setPlayer('p2', {team: [{species: "Arceus", ability: 'download', item: 'flameplate', moves: ['swordsdance']}]});
		battle.makeChoices('move trick', 'move swordsdance');
		assert.strictEqual(battle.p2.active[0].item, 'flameplate');
	});

	it('should not cause Arceus to gain a plate', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', item: 'fistplate', moves: ['trick']}]});
		battle.setPlayer('p2', {team: [{species: "Arceus", ability: 'download', moves: ['swordsdance']}]});
		battle.makeChoices('move trick', 'move swordsdance');
		assert.strictEqual(battle.p2.active[0].item, '');
	});

	it('should not remove drives from Genesect', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['trick']}]});
		battle.setPlayer('p2', {team: [{species: "Genesect", ability: 'download', item: 'dousedrive', moves: ['shiftgear']}]});
		battle.makeChoices('move trick', 'move shiftgear');
		assert.strictEqual(battle.p2.active[0].item, 'dousedrive');
	});

	it('should not cause Genesect to gain a drive', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', item: 'shockdrive', moves: ['trick']}]});
		battle.setPlayer('p2', {team: [{species: "Genesect", ability: 'download', moves: ['shiftgear']}]});
		battle.makeChoices('move trick', 'move shiftgear');
		assert.strictEqual(battle.p2.active[0].item, '');
	});

	it('should not remove correctly held mega stones', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['trick']}]});
		battle.setPlayer('p2', {team: [{species: "Scizor", ability: 'technician', item: 'scizorite', moves: ['swordsdance']}]});
		battle.makeChoices('move trick', 'move swordsdance');
		assert.strictEqual(battle.p2.active[0].item, 'scizorite');
	});

	it('should remove wrong mega stones', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['trick']}]});
		battle.setPlayer('p2', {team: [{species: "Scizor", ability: 'technician', item: 'audinite', moves: ['swordsdance']}]});
		battle.makeChoices('move trick', 'move swordsdance');
		assert.strictEqual(battle.p1.active[0].item, 'audinite');
	});
});

describe('Z-Trick', function () {
	afterEach(() => battle.destroy());

	it("boost the user's Speed by 2 stages, but should fail to exchange the items", function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', item: 'psychiumz', moves: ['trick']}]});
		battle.setPlayer('p2', {team: [{species: "Rattata", ability: 'guts', item: 'leftovers', moves: ['quickattack']}]});
		const [user, nonTarget] = [battle.p1.active[0], battle.p2.active[0]];
		battle.makeChoices('move trick zmove', 'move quickattack');
		assert.statStage(user, 'spe', 2);
		assert.strictEqual(user.item, 'psychiumz');
		assert.strictEqual(nonTarget.item, 'leftovers');
	});
});
