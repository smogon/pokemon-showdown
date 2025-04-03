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
});
