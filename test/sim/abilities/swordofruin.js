'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Sword of Ruin`, () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should lower the Defense of all other Pokemon`, () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'shellarmor', moves: ['sleeptalk'] },
		], [
			{ species: 'chienpao', ability: 'swordofruin', moves: ['aerialace'] },
		]]);
		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		const damage = wynaut.maxhp - wynaut.hp;
		assert.bounded(damage, [120, 142]);
	});

	it(`should not lower the Defense of other Pokemon with the Sword of Ruin Ability`, () => {
		battle = common.createBattle({ forceRandomChance: false }, [[
			{ species: 'wynaut', ability: 'swordofruin', moves: ['sleeptalk'] },
		], [
			{ species: 'chienpao', ability: 'swordofruin', moves: ['aerialace'] },
		]]);
		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		const damage = wynaut.maxhp - wynaut.hp;
		assert.bounded(damage, [90, 107]);
	});

	it(`should lose its effect if its ability is changed`, () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'shellarmor', moves: ['worryseed'] },
		], [
			{ species: 'chienpao', ability: 'swordofruin', moves: ['aerialace'] },
		]]);
		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		let hp = wynaut.hp;
		let damage = wynaut.maxhp - hp;
		assert.bounded(damage, [120, 142]);

		battle.makeChoices();
		damage = hp - wynaut.hp;
		assert.bounded(damage, [90, 107]);
	});

	it(`should not lose its effect if its ability is changed by a Mold Breaker move`, () => {
		battle = common.createBattle([[
			{ species: 'wynaut', ability: 'moldbreaker', moves: ['worryseed'] },
		], [
			{ species: 'chienpao', ability: 'swordofruin', moves: ['aerialace'] },
		]]);
		battle.makeChoices();
		const wynaut = battle.p1.active[0];
		let hp = wynaut.hp;
		let damage = wynaut.maxhp - hp;
		assert.bounded(damage, [120, 142]);

		battle.makeChoices();
		damage = hp - wynaut.hp;
		assert.bounded(damage, [120, 142]);
	});
});
