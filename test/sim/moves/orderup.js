'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Order Up', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost Dondozo's stat even if Sheer Force-boosted`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'wynaut', moves: ['sleeptalk'] },
			{ species: 'mew', ability: 'shellarmor', moves: ['sleeptalk'] },
		], [
			{ species: 'tatsugiristretchy', ability: 'commander', moves: ['sleeptalk'] },
			{ species: 'dondozo', ability: 'sheerforce', item: 'lifeorb', moves: ['orderup'] },
		]]);
		battle.makeChoices('auto', 'move orderup 2');
		const mew = battle.p1.active[1];
		const dondozo = battle.p2.active[1];
		const damage = mew.maxhp - mew.hp;
		assert.bounded(damage, [194, 229], `Order Up's base power should be increased by Sheer Force`);
		assert.statStage(dondozo, 'spe', 3);
		assert.fullHP(dondozo, `Life Orb recoil should not affect Dondozo`);
	});
});
