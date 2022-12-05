'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Protosynthesis', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should boost the user's highest stat except HP while Sunny Day is active`, function () {
		battle = common.createBattle([[
			{species: 'Scream Tail', ability: 'protosynthesis', moves: ['raindance']},
		], [
			{species: 'Torkoal', ability: 'drought', moves: ['sleeptalk']},
		]]);

		const tail = battle.p1.active[0];
		assert.equal(tail.volatiles['protosynthesis'].bestStat, 'spd');
		battle.makeChoices();
		assert(!tail.volatiles['protosynthesis'], `Scream Tail's SpD should stop being boosted when Sun ends`);
	});

	it(`should take stat stages and no other modifiers into account when determining the best stat`, function () {
		battle = common.createBattle([[
			{species: 'Roaring Moon', ability: 'protosynthesis', evs: {'atk': 252, 'spd': 252}, moves: ['tailwind']},
		], [
			{species: 'Salamence', ability: 'intimidate', moves: ['sunnyday']},
		]]);

		battle.makeChoices();
		const moon = battle.p1.active[0];
		assert.equal(moon.boosts.atk, -1);
		assert.equal(moon.volatiles['protosynthesis'].bestStat, 'spd');
	});

	it(`should not activate while Desolate Land is active`, function () {
		battle = common.createBattle([[
			{species: 'Roaring Moon', ability: 'protosynthesis', moves: ['sleeptalk']},
		], [
			{species: 'Groudon-Primal', ability: 'desolateland', moves: ['sleeptalk']},
		]]);

		const moon = battle.p1.active[0];
		assert(!moon.volatiles['protosynthesis']);
	});

	it(`should be activated by Booster Energy when Sunny Day is not active`, function () {
		battle = common.createBattle([[
			{species: 'Scream Tail', ability: 'protosynthesis', item: 'boosterenergy', moves: ['raindance', 'sunnyday']},
		], [
			{species: 'Torkoal', ability: 'drought', moves: ['sleeptalk']},
		]]);

		const tail = battle.p1.active[0];
		assert.equal(tail.volatiles['protosynthesis'].bestStat, 'spd', `Scream Tail's SpD should have been boosted by Protosynthesis in Sun`);
		assert.equal(tail.volatiles['protosynthesis'].fromBooster, undefined, `Scream Tail's Protosynthesis should not have been activated by Booster Energy in Sun`);
		// change to rain
		battle.makeChoices();
		assert(tail.volatiles['protosynthesis'].fromBooster, `Scream Tail's Protosynthesis should have been activated by Booster Energy in Rain`);
		// change to sun and back
		battle.makeChoices('move sunnyday', 'auto');
		battle.makeChoices();
		assert(!!tail.volatiles['protosynthesis'], `Scream Tail's Protosynthesis activated by Booster Energy should still be active when Sun ends`);
	});

	// test passes, but is based on an assumption. skipped until research confirms one way or the other
	it.skip(`should be prevented from activating if the user holds Utility Umbrella`, function () {
		battle = common.createBattle([[
			{species: 'Scream Tail', ability: 'protosynthesis', item: 'utilityumbrella', moves: ['trick', 'fling']},
		], [
			{species: 'Torkoal', ability: 'drought', moves: ['sleeptalk']},
		]]);

		const tail = battle.p1.active[0];
		assert(!tail.volatiles['protosynthesis'], `Scream Tail's SpD should not have been boosted by Protosynthesis in Sun while holding Utility Umbrella`);
		battle.makeChoices();
		assert.equal(tail.volatiles['protosynthesis'].bestStat, 'spd');
		battle.makeChoices();
		assert(!tail.volatiles['protosynthesis'], `Scream Tail's SpD should not have been boosted by Protosynthesis in Sun after obtaining Utility Umbrella`);
		battle.makeChoices('move fling', 'auto');
		assert.equal(tail.volatiles['protosynthesis'].bestStat, 'spd', `Scream Tail's SpD should have been boosted by Protosynthesis in Sun after flinging Utility Umbrella`);
	});
});
