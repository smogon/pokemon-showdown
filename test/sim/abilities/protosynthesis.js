'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Protosynthesis', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost the user's highest stat except HP while Sunny Day is active`, () => {
		battle = common.createBattle([[
			{ species: 'Scream Tail', ability: 'protosynthesis', moves: ['raindance'] },
		], [
			{ species: 'Torkoal', ability: 'drought', moves: ['sleeptalk'] },
		]]);

		const tail = battle.p1.active[0];
		assert.equal(tail.abilityState.bestStat, 'spd');
		battle.makeChoices();
		assert(!tail.abilityState.bestStat, `Scream Tail's SpD should stop being boosted when Sun ends`);
	});

	it(`should take stat stages and no other modifiers into account when determining the best stat`, () => {
		battle = common.createBattle([[
			{ species: 'Roaring Moon', ability: 'protosynthesis', evs: { 'atk': 252, 'spd': 252 }, moves: ['tailwind'] },
		], [
			{ species: 'Salamence', ability: 'intimidate', moves: ['sunnyday'] },
		]]);

		battle.makeChoices();
		const moon = battle.p1.active[0];
		assert.equal(moon.boosts.atk, -1);
		assert.equal(moon.abilityState.bestStat, 'spd');
	});

	it(`should not activate while Desolate Land is active`, () => {
		battle = common.createBattle([[
			{ species: 'Roaring Moon', ability: 'protosynthesis', moves: ['sleeptalk'] },
		], [
			{ species: 'Groudon-Primal', ability: 'desolateland', moves: ['sleeptalk'] },
		]]);

		const moon = battle.p1.active[0];
		assert(!moon.abilityState.bestStat);
	});

	it(`should be activated by Booster Energy when Sunny Day is not active`, () => {
		battle = common.createBattle([[
			{ species: 'Scream Tail', ability: 'protosynthesis', item: 'boosterenergy', moves: ['raindance', 'sunnyday'] },
		], [
			{ species: 'Torkoal', ability: 'drought', moves: ['sleeptalk'] },
		]]);

		const tail = battle.p1.active[0];
		assert.equal(tail.abilityState.bestStat, 'spd', `Scream Tail's SpD should have been boosted by Protosynthesis in Sun`);
		assert.equal(tail.abilityState.fromBooster, undefined, `Scream Tail's Protosynthesis should not have been activated by Booster Energy in Sun`);
		// change to rain
		battle.makeChoices();
		assert(tail.abilityState.fromBooster, `Scream Tail's Protosynthesis should have been activated by Booster Energy in Rain`);
		// change to sun and back
		battle.makeChoices('move sunnyday', 'auto');
		battle.makeChoices();
		assert(!!tail.abilityState.bestStat, `Scream Tail's Protosynthesis activated by Booster Energy should still be active when Sun ends`);
	});

	it(`should not be prevented from activating if the user holds Utility Umbrella`, () => {
		battle = common.createBattle([[
			{ species: 'Scream Tail', ability: 'protosynthesis', item: 'utilityumbrella', moves: ['trick'] },
		], [
			{ species: 'Torkoal', ability: 'drought', moves: ['sleeptalk'] },
		]]);

		const tail = battle.p1.active[0];
		assert.equal(tail.abilityState.bestStat, 'spd', `Scream Tail's SpD should have been boosted by Protosynthesis in Sun while holding Utility Umbrella`);
	});

	it(`should be deactiviated by weather suppressing abilities`, () => {
		battle = common.createBattle([[
			{ species: 'Scream Tail', ability: 'protosynthesis', moves: ['splash'] },
		], [
			{ species: 'Torkoal', ability: 'drought', moves: ['splash'] },
			{ species: 'Psyduck', ability: 'cloudnine', moves: ['splash'] },
		]]);

		const tail = battle.p1.active[0];
		battle.makeChoices('move splash', 'switch 2');

		assert(!tail.abilityState.bestStat, `Scream Tail should not have remained boosted by Protosynthesis because a weather supressing ability started even though Sun was active`);
	});

	it(`should not activate if weather is suppressed`, () => {
		battle = common.createBattle([[
			{ species: 'Scream Tail', ability: 'protosynthesis', moves: ['splash'] },
		], [
			{ species: 'Psyduck', ability: 'cloudnine', moves: ['sunnyday'] },
		]]);

		const tail = battle.p1.active[0];
		battle.makeChoices('move splash', 'move sunnyday');

		assert.equal(tail.abilityState.bestStat, undefined, `Scream Tail should not have been boosted by Protosynthesis because a weather supressing ability was active when Sun started`);
	});

	it(`should activate when weather supression ends`, () => {
		battle = common.createBattle([[
			{ species: 'Scream Tail', ability: 'protosynthesis', moves: ['splash'] },
		], [
			{ species: 'Psyduck', ability: 'cloudnine', moves: ['sunnyday'] },
			{ species: 'Lotad', ability: 'swiftswim', moves: ['splash'] },
		]]);

		const tail = battle.p1.active[0];
		battle.makeChoices('move splash', 'move sunnyday');
		battle.makeChoices('move splash', 'switch 2');

		assert.equal(tail.abilityState.bestStat, 'spd', `Scream Tail should have been boosted by Protosynthesis because a weather supressing ability ended while Sun was active`);
	});

	it(`should have its boost nullified by Neutralizing Gas`, () => {
		battle = common.createBattle([[
			{ species: 'Scream Tail', ability: 'protosynthesis', item: 'boosterenergy', moves: ['luckychant', 'recover'] },
		], [
			{ species: 'Weezing', moves: ['venoshock'] },
			{ species: 'Weezing', ability: 'neutralizinggas', moves: ['venoshock'] },
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

	it(`should react to Sunny Day when Neutralizing Gas leaves the field`, () => {
		battle = common.createBattle([[
			{ species: 'Wynaut', moves: ['sleeptalk'] },
			{ species: 'Scream Tail', ability: 'protosynthesis', moves: ['sleeptalk'] },
		], [
			{ species: 'Torkoal', ability: 'drought', moves: ['sleeptalk'] },
			{ species: 'Weezing', ability: 'neutralizinggas', moves: ['sleeptalk'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('auto', 'switch 2');
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('auto', 'switch 3');
		assert(battle.p1.active[0].abilityState.bestStat);
	});

	it(`should not react to other weathers when Neutralizing Gas leaves the field`, () => {
		battle = common.createBattle([[
			{ species: 'Scream Tail', ability: 'protosynthesis', moves: ['sleeptalk'] },
		], [
			{ species: 'Torkoal', ability: 'drought', moves: ['sleeptalk'] },
			{ species: 'Weezing', ability: 'neutralizinggas', moves: ['raindance'] },
			{ species: 'Wynaut', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices('auto', 'switch 2');
		battle.makeChoices('auto', 'move raindance');
		battle.makeChoices('auto', 'switch 3');
		const tail = battle.p1.active[0];
		assert(tail.abilityState.bestStat);
		for (let i = 0; i < 3; i++) battle.makeChoices(); // Rain ends
		assert(!tail.abilityState.bestStat);
	});

	it(`should not activate while the user is Transformed`, () => {
		battle = common.createBattle([[
			{ species: 'Torkoal', ability: 'drought', moves: ['sleeptalk'] },
			{ species: 'Ditto', ability: 'imposter', moves: ['transform'] },
		], [
			{ species: 'Roaring Moon', ability: 'protosynthesis', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices('switch 2', 'auto');
		const dittoMoon = battle.p1.active[0];
		assert(!dittoMoon.abilityState.bestStat);
	});

	it(`should activate right after weather changes`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Ninetales-Alola', ability: 'snowwarning', moves: ['sleeptalk'] },
			{ species: 'Roaring Moon', item: 'boosterenergy', ability: 'protosynthesis', moves: ['sleeptalk'] },
		], [
			{ species: 'Incineroar', ability: 'intimidate', moves: ['sleeptalk'] },
			{ species: 'Torkoal', ability: 'drought', moves: ['sleeptalk'] },
		]]);

		const roaringMoon = battle.p1.active[1];
		assert(roaringMoon.abilityState.fromBooster);
		assert.equal(roaringMoon.abilityState.bestStat, 'atk');
		assert.equal(battle.field.weather, 'sunnyday');
	});
});
