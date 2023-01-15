'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Fling', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should consume the user's item after being flung`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'ironball', moves: ['fling']},
		], [
			{species: 'cleffa', moves: ['protect']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, '');
	});

	it(`should apply custom effects when certain items are flung`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'flameorb', moves: ['fling']},
		], [
			{species: 'cleffa', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p2.active[0].status, 'brn');
	});

	it(`should not be usuable in Magic Room`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'ironball', moves: ['fling']},
		], [
			{species: 'cleffa', moves: ['magicroom']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].item, 'ironball');
	});

	it(`should use its item to be flung in damage calculations`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', item: 'lifeorb', moves: ['fling']},
		], [
			{species: 'cleffa', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();

		// Fling's damage should be boosted by Life Orb
		const cleffa = battle.p2.active[0];
		const damage = cleffa.maxhp - cleffa.hp;
		assert.bounded(damage, [13, 16]);

		// Wynaut should not have taken Life Orb recoil
		assert.fullHP(battle.p1.active[0]);
	});

	it.skip(`should Fling, not consume Leppa Berry when using 1 PP Leppa Berry Fling`, function () {
		// Currently depends on RNG when it should not
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['fling']},
		], [
			{species: 'clefable', item: 'leppaberry', moves: ['trick']},
		]]);
		const wynaut = battle.p1.active[0];
		const cleffa = battle.p2.active[0];
		wynaut.getMoveData('fling').pp = 1;
		battle.makeChoices('move fling', 'move trick');

		assert.equal(wynaut.getMoveData('fling').pp, 0);
		assert.equal(cleffa.getMoveData('trick').pp, 16);
	});
});
