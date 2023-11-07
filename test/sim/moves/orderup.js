'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Order Up', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should boost Dondozo's stat even if Sheer Force-boosted`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['sleeptalk']},
			{species: 'mew', ability: 'shellarmor', moves: ['sleeptalk']},
		], [
			{species: 'tatsugiristretchy', ability: 'commander', moves: ['sleeptalk']},
			{species: 'dondozo', ability: 'sheerforce', moves: ['orderup']},
		]]);
		battle.makeChoices('auto', 'move orderup 2');
		const mew = battle.p1.active[1];
		const damage = mew.maxhp - mew.hp;
		assert.bounded(damage, [149, 176], `Order Up's base power should be increased by Sheer Force`);
		assert.statStage(battle.p2.active[1], 'spe', 3);
	});
});
