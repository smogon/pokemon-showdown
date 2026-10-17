'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Electro Shot', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost special attack even if Sheer Force-boosted`, () => {
		battle = common.createBattle([[
			{ species: 'mew', ability: 'drizzle', moves: ['sleeptalk'] },
		], [
			{ species: 'archaludon', ability: 'sheerforce', item: 'lifeorb', moves: ['electroshot'] },
		]]);
		battle.makeChoices();
		const mew = battle.p1.active[0];
		const archaludon = battle.p2.active[0];
		const damage = mew.maxhp - mew.hp;
		assert.bounded(damage, [294, 346], `Electro Shot's base power should be increased by Sheer Force`);
		assert.statStage(archaludon, 'spa', 1);
		assert.fullHP(archaludon, `Life Orb recoil should not affect Archaludon`);
	});
});
