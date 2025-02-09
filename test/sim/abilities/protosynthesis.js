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

	it(`should not be prevented from activating if the user holds Utility Umbrella`, function () {
		battle = common.createBattle([[
			{species: 'Scream Tail', ability: 'protosynthesis', item: 'utilityumbrella', moves: ['trick']},
		], [
			{species: 'Torkoal', ability: 'drought', moves: ['sleeptalk']},
		]]);

		const tail = battle.p1.active[0];
		assert.equal(tail.volatiles['protosynthesis'].bestStat, 'spd', `Scream Tail's SpD should have been boosted by Protosynthesis in Sun while holding Utility Umbrella`);
	});

	it(`should be deactiviated by weather suppressing abilities`, function () {
		battle = common.createBattle([[
			{species: 'Scream Tail', ability: 'protosynthesis', moves: ['splash']},
		], [
			{species: 'Torkoal', ability: 'drought', moves: ['splash']},
			{species: 'Psyduck', ability: 'cloudnine', moves: ['splash']},
		]]);

		const tail = battle.p1.active[0];
		battle.makeChoices('move splash', 'switch 2');

		assert(!tail.volatiles['protosynthesis'], `Scream Tail should not have remained boosted by Protosynthesis because a weather supressing ability started even though Sun was active`);
	});

	it(`should not activate if weather is suppressed`, function () {
		battle = common.createBattle([[
			{species: 'Scream Tail', ability: 'protosynthesis', moves: ['splash']},
		], [
			{species: 'Psyduck', ability: 'cloudnine', moves: ['sunnyday']},
		]]);

		const tail = battle.p1.active[0];
		battle.makeChoices('move splash', 'move sunnyday');

		assert.equal(tail.volatiles['protosynthesis'], undefined, `Scream Tail should not have been boosted by Protosynthesis because a weather supressing ability was active when Sun started`);
	});

	it(`should activate when weather supression ends`, function () {
		battle = common.createBattle([[
			{species: 'Scream Tail', ability: 'protosynthesis', moves: ['splash']},
		], [
			{species: 'Psyduck', ability: 'cloudnine', moves: ['sunnyday']},
			{species: 'Lotad', ability: 'swiftswim', moves: ['splash']},
		]]);

		const tail = battle.p1.active[0];
		battle.makeChoices('move splash', 'move sunnyday');
		battle.makeChoices('move splash', 'switch 2');

		assert.equal(tail.volatiles['protosynthesis'].bestStat, 'spd', `Scream Tail should have been boosted by Protosynthesis because a weather supressing ability ended while Sun was active`);
	});

	it(`should have its boost nullified by Neutralizing Gas`, function () {
		battle = common.createBattle([[
			{species: 'Scream Tail', ability: 'protosynthesis', item: 'boosterenergy', moves: ['luckychant', 'recover']},
		], [
			{species: 'Weezing', moves: ['venoshock']},
			{species: 'Weezing', ability: 'neutralizinggas', moves: ['venoshock']},
		]]);

		const tail = battle.p1.active[0];
		battle.makeChoices('move luckychant', 'move venoshock');
		assert.bounded(tail.maxhp - tail.hp, [84, 102]);
		battle.makeChoices('auto', 'switch 2');
		battle.makeChoices('move recover', 'move venoshock');
		assert.bounded(tail.maxhp - tail.hp, [110, 132]);
		// Ensure that the boost wasn't completely removed
		battle.makeChoices('auto', 'switch 2');
		battle.makeChoices('move recover', 'move venoshock');
		assert.bounded(tail.maxhp - tail.hp, [84, 102]);
	});

	it(`should not activate while the user is Transformed`, function () {
		battle = common.createBattle([[
			{species: 'Torkoal', ability: 'drought', moves: ['sleeptalk']},
			{species: 'Ditto', ability: 'imposter', moves: ['transform']},
		], [
			{species: 'Roaring Moon', ability: 'protosynthesis', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('switch 2', 'auto');
		const dittoMoon = battle.p1.active[0];
		assert(!dittoMoon.volatiles['protosynthesis']);
	});
});
