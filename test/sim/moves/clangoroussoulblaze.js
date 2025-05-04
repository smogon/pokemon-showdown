'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Z-Moves', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should deal reduced damage to only protected targets`, () => {
		battle = common.createBattle({ gameType: 'doubles' });
		battle.setPlayer('p1', { team: [
			{ species: 'Kommo-o', ability: 'overcoat', item: 'kommoniumz', moves: ['clangingscales'] },
			{ species: 'Pachirisu', ability: 'voltabsorb', moves: ['protect'] },
		] });
		battle.setPlayer('p2', { team: [
			{ species: 'Turtonator', ability: 'shellarmor', moves: ['protect'] },
			{ species: 'Turtonator', ability: 'shellarmor', moves: ['sleeptalk'] },
		] });
		battle.makeChoices("move clangingscales zmove, move protect", "move protect, move sleeptalk");
		assert.false.fullHP(battle.p2.active[0]);
		assert.false.fainted(battle.p2.active[0]);
		assert.fainted(battle.p2.active[1]);
	});

	it(`should bypass Throat Chop's effect`, () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Kommo-o', ability: 'overcoat', item: 'kommoniumz', moves: ['clangingscales'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Regieleki', moves: ['throatchop'] }] });
		battle.makeChoices("move clangingscales zmove", "move throatchop");
		assert.fainted(battle.p2.active[0]);
	});

	it(`[Hackmons] should not bypass Throat Chop's effect if not boosted by a Z-crystal`, () => {
		battle = common.createBattle();
		battle.setPlayer('p1', { team: [{ species: 'Kommo-o', ability: 'overcoat', moves: ['clangoroussoulblaze'] }] });
		battle.setPlayer('p2', { team: [{ species: 'Regieleki', moves: ['throatchop'] }] });
		battle.makeChoices("move clangoroussoulblaze", "move throatchop");
		assert.equal(battle.p2.active[0].hp, battle.p2.active[0].maxhp);
	});
});
