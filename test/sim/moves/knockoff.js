'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Knock Off', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should remove most items', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Mew", ability: 'synchronize', moves: ['knockoff'] }] });
		battle.setPlayer('p2', { team: [{ species: "Blissey", ability: 'naturalcure', item: 'shedshell', moves: ['softboiled'] }] });
		battle.makeChoices('move knockoff', 'move softboiled');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should not remove items when hitting Sub', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Mew", ability: 'noability', moves: ['knockoff'] }] });
		battle.setPlayer('p2', { team: [{ species: "Ninjask", ability: 'noability', item: 'shedshell', moves: ['substitute'] }] });
		battle.makeChoices();
		assert.equal(battle.p2.active[0].item, 'shedshell');
	});

	it('should not remove plates from Arceus', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Mew", ability: 'synchronize', moves: ['knockoff'] }] });
		battle.setPlayer('p2', { team: [{ species: "Arceus", ability: 'download', item: 'flameplate', moves: ['swordsdance'] }] });
		battle.makeChoices('move knockoff', 'move swordsdance');
		assert.equal(battle.p2.active[0].item, 'flameplate');
	});

	it('should not remove drives from Genesect', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Mew", ability: 'synchronize', moves: ['knockoff'] }] });
		battle.setPlayer('p2', { team: [{ species: "Genesect", ability: 'download', item: 'dousedrive', moves: ['shiftgear'] }] });
		battle.makeChoices('move knockoff', 'move shiftgear');
		assert.equal(battle.p2.active[0].item, 'dousedrive');
	});

	it('should not remove correctly held mega stones', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Mew", ability: 'synchronize', moves: ['knockoff'] }] });
		battle.setPlayer('p2', { team: [{ species: "Scizor", ability: 'technician', item: 'scizorite', moves: ['swordsdance'] }] });
		battle.makeChoices('move knockoff', 'move swordsdance');
		assert.equal(battle.p2.active[0].item, 'scizorite');
	});

	it('should remove wrong mega stones', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Mew", ability: 'synchronize', moves: ['knockoff'] }] });
		battle.setPlayer('p2', { team: [{ species: "Scizor", ability: 'technician', item: 'audinite', moves: ['swordsdance'] }] });
		battle.makeChoices('move knockoff', 'move swordsdance');
		assert.equal(battle.p2.active[0].item, '');
	});

	it('should not remove items if the user faints mid-move', () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: "Shedinja", ability: 'wonderguard', moves: ['knockoff'] }] });
		battle.setPlayer('p2', { team: [{ species: "Ferrothorn", ability: 'ironbarbs', item: 'rockyhelmet', moves: ['curse'] }] });
		battle.makeChoices('move knockoff', 'move curse');
		assert.equal(battle.p2.active[0].item, 'rockyhelmet');
	});
});

describe('Knock Off [Gen 4]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should make the target unable to gain a new item', () => {
		battle = common.gen(4).createBattle([[
			{ species: 'Wynaut', item: 'pokeball', moves: ['knockoff', 'trick'] },
		], [
			{ species: 'Blissey', item: 'leftovers', moves: ['sleeptalk', 'thief'] },
		]]);
		const wynaut = battle.p1.active[0];
		const blissey = battle.p2.active[0];

		battle.makeChoices();
		assert.equal(wynaut.item, 'pokeball');
		assert.equal(blissey.item, '');
		battle.makeChoices('move trick', 'move thief');
		assert.equal(wynaut.item, 'pokeball');
		assert.equal(blissey.item, '');
	});

	it('should be able to recycle an item that was used before having a new item knocked off', () => {
		battle = common.gen(4).createBattle([[
			{ species: 'Munchlax', item: 'sitrusberry', moves: ['bellydrum', 'recycle', 'sleeptalk'], evs: { hp: 4 } },
		], [
			{ species: 'Sableye', ability: 'stall', item: 'leftovers', moves: ['trick', 'knockoff'] },
		]]);
		const munchlax = battle.p1.active[0];
		const sableye = battle.p2.active[0];

		battle.makeChoices('move bellydrum', 'move trick');
		// Munchlax eats its Sitrus Berry and gets tricked Leftovers
		assert.equal(munchlax.item, 'leftovers');
		assert.equal(sableye.item, '');
		battle.makeChoices('move sleeptalk', 'move knockoff');
		// Munchlax has its Leftovers knocked off
		assert.equal(munchlax.item, '');
		battle.makeChoices('move recycle', 'move trick');
		// Munchlax recycles its Sitrus Berry and Trick fails because Munchlax is still considered to be knocked off
		assert.equal(munchlax.item, 'sitrusberry');
		assert.equal(sableye.item, '');
	});

	it(`should not knock off the target's item if the target's ability is Sticky Hold or Multitype`, () => {
		battle = common.gen(4).createBattle([[
			{ species: 'Wynaut', moves: ['knockoff'] },
		], [
			{ species: 'Aggron', ability: 'stickyhold', item: 'leftovers', moves: ['sleeptalk'] },
		]]);
		const aggron = battle.p2.active[0];

		battle.makeChoices();
		assert.holdsItem(aggron);
		assert.fullHP(aggron, 'Aggron should have been healed by Leftovers.');

		battle.destroy();
		battle = common.gen(4).createBattle([[
			{ species: 'Wynaut', moves: ['knockoff'] },
		], [
			{ species: 'Arceus', ability: 'multitype', item: 'leftovers', moves: ['sleeptalk'] },
		]]);
		const arceus = battle.p2.active[0];

		battle.makeChoices();
		assert.holdsItem(arceus);
		assert.fullHP(arceus, 'Arceus should have been healed by Leftovers.');
	});
});
