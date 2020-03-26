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
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]});
		battle.setPlayer('p2', {team: [{species: "Blissey", ability: 'naturalcure', item: 'shedshell', moves: ['softboiled']}]});
		battle.makeChoices('move knockoff', 'move softboiled');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should not remove items when hitting Sub', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'noability', moves: ['knockoff']}]});
		battle.setPlayer('p2', {team: [{species: "Ninjask", ability: 'noability', item: 'shedshell', moves: ['substitute']}]});
		battle.makeChoices();
		assert.equal(battle.p2.active[0].item, 'shedshell');
	});

	it('should not remove plates from Arceus', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]});
		battle.setPlayer('p2', {team: [{species: "Arceus", ability: 'download', item: 'flameplate', moves: ['swordsdance']}]});
		battle.makeChoices('move knockoff', 'move swordsdance');
		assert.equal(battle.p2.active[0].item, 'flameplate');
	});

	it('should not remove drives from Genesect', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]});
		battle.setPlayer('p2', {team: [{species: "Genesect", ability: 'download', item: 'dousedrive', moves: ['shiftgear']}]});
		battle.makeChoices('move knockoff', 'move shiftgear');
		assert.equal(battle.p2.active[0].item, 'dousedrive');
	});

	it('should not remove correctly held mega stones', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]});
		battle.setPlayer('p2', {team: [{species: "Scizor", ability: 'technician', item: 'scizorite', moves: ['swordsdance']}]});
		battle.makeChoices('move knockoff', 'move swordsdance');
		assert.equal(battle.p2.active[0].item, 'scizorite');
	});

	it('should remove wrong mega stones', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Mew", ability: 'synchronize', moves: ['knockoff']}]});
		battle.setPlayer('p2', {team: [{species: "Scizor", ability: 'technician', item: 'audinite', moves: ['swordsdance']}]});
		battle.makeChoices('move knockoff', 'move swordsdance');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should not remove items if the user faints mid-move', function () {
		battle = common.createBattle();
		battle.setPlayer('p1', {team: [{species: "Shedinja", ability: 'wonderguard', moves: ['knockoff']}]});
		battle.setPlayer('p2', {team: [{species: "Ferrothorn", ability: 'ironbarbs', item: 'rockyhelmet', moves: ['curse']}]});
		battle.makeChoices('move knockoff', 'move curse');
		assert.equal(battle.p2.active[0].item, 'rockyhelmet');
	});
});
