'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Filter', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should reduce super effective damage by 25%`, () => {
		battle = common.createBattle([[
			{ species: 'Raichu', ability: 'static', moves: ['thunderbolt'] },
		], [
			{ species: 'Lapras', ability: 'filter', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move thunderbolt', 'move sleeptalk');
		const filterDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		battle.destroy();

		battle = common.createBattle([[
			{ species: 'Raichu', ability: 'static', moves: ['thunderbolt'] },
		], [
			{ species: 'Lapras', ability: 'shellarmor', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move thunderbolt', 'move sleeptalk');
		const noFilterDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert.bounded(filterDamage / noFilterDamage, [0.70, 0.80]);
	});

	it(`should not reduce neutral damage`, () => {
		battle = common.createBattle([[
			{ species: 'Snorlax', ability: 'immunity', moves: ['tackle'] },
		], [
			{ species: 'Lapras', ability: 'filter', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move tackle', 'move sleeptalk');
		const filterDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		battle.destroy();

		battle = common.createBattle([[
			{ species: 'Snorlax', ability: 'immunity', moves: ['tackle'] },
		], [
			{ species: 'Lapras', ability: 'shellarmor', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move tackle', 'move sleeptalk');
		const noFilterDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert.equal(filterDamage, noFilterDamage);
	});

	it(`should be bypassed by Mold Breaker`, () => {
		battle = common.createBattle([[
			{ species: 'Rampardos', ability: 'moldbreaker', moves: ['thunderpunch'] },
		], [
			{ species: 'Lapras', ability: 'filter', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move thunderpunch', 'move sleeptalk');
		const moldBreakerDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		battle.destroy();

		battle = common.createBattle([[
			{ species: 'Rampardos', ability: 'rockhead', moves: ['thunderpunch'] },
		], [
			{ species: 'Lapras', ability: 'filter', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move thunderpunch', 'move sleeptalk');
		const filterDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert(moldBreakerDamage > filterDamage);
	});
});

describe('Solid Rock', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should reduce super effective damage by 25%`, () => {
		battle = common.createBattle([[
			{ species: 'Raichu', ability: 'static', moves: ['thunderbolt'] },
		], [
			{ species: 'Lapras', ability: 'solidrock', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move thunderbolt', 'move sleeptalk');
		const solidRockDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		battle.destroy();

		battle = common.createBattle([[
			{ species: 'Raichu', ability: 'static', moves: ['thunderbolt'] },
		], [
			{ species: 'Lapras', ability: 'shellarmor', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move thunderbolt', 'move sleeptalk');
		const noAbilityDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert.bounded(solidRockDamage / noAbilityDamage, [0.70, 0.80]);
	});
});

describe('Prism Armor', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should reduce super effective damage by 25% even against Mold Breaker`, () => {
		battle = common.createBattle([[
			{ species: 'Rampardos', ability: 'moldbreaker', moves: ['crunch'] },
		], [
			{ species: 'Necrozma-Dawn-Wings', ability: 'prismarmor', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move crunch', 'move sleeptalk');
		const prismArmorDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		battle.destroy();

		battle = common.createBattle([[
			{ species: 'Rampardos', ability: 'moldbreaker', moves: ['crunch'] },
		], [
			{ species: 'Necrozma-Dawn-Wings', ability: 'pressure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move crunch', 'move sleeptalk');
		const noAbilityDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert(prismArmorDamage < noAbilityDamage);
	});
});
