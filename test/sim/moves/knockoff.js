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

describe('Knock Off [Gen 4]', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should only make the held item unusable, not actually remove it', function () {
		battle = common.gen(4).createBattle([[
			{species: 'Wynaut', moves: ['knockoff']},
		], [
			{species: 'Aggron', item: 'leftovers', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.holdsItem(battle.p2.active[0]);
		assert.false.fullHP(battle.p2.active[0], 'Aggron should not have been healed by Leftovers.');
	});

	it('should make the target unable to gain a new item', function () {
		battle = common.gen(4).createBattle([[
			{species: 'Wynaut', item: 'pokeball', moves: ['knockoff', 'trick']},
		], [
			{species: 'Blissey', item: 'leftovers', moves: ['sleeptalk', 'thief']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, 'pokeball');
		assert.equal(battle.p2.active[0].item, 'leftovers');
		battle.makeChoices('move trick', 'move thief');
		assert.equal(battle.p1.active[0].item, 'pokeball');
		assert.equal(battle.p2.active[0].item, 'leftovers');
	});

	it(`should not knock off the target's item if the target's ability is Sticky Hold or Multitype`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'Wynaut', moves: ['knockoff']},
		], [
			{species: 'Aggron', ability: 'stickyhold', item: 'leftovers', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.holdsItem(battle.p2.active[0]);
		assert.fullHP(battle.p2.active[0], 'Aggron should have been healed by Leftovers.');

		battle.destroy();
		battle = common.gen(4).createBattle([[
			{species: 'Wynaut', moves: ['knockoff']},
		], [
			{species: 'Arceus', ability: 'multitype', item: 'leftovers', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.holdsItem(battle.p2.active[0]);
		assert.fullHP(battle.p2.active[0], 'Arceus should have been healed by Leftovers.');
	});
});
