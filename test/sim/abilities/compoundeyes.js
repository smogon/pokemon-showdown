'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Compound Eyes', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost move accuracy by 1.3x`, () => {
		// forceRandomChance=false makes all random checks fail, but Swift (bypass accuracy) should still hit
		battle = common.createBattle({ forceRandomChance: false }, [[
			{ species: 'Butterfree', ability: 'compoundeyes', moves: ['swift'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.false.fullHP(battle.p2.active[0]);
	});
});

describe('Hustle', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should boost Attack by 1.5x`, () => {
		battle = common.createBattle([[
			{ species: 'Togekiss', ability: 'hustle', moves: ['bodyslam'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move bodyslam', 'move sleeptalk');
		const hustleDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		battle.destroy();

		battle = common.createBattle([[
			{ species: 'Togekiss', ability: 'serenegrace', moves: ['bodyslam'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.randomizer = dmg => dmg;
		battle.makeChoices('move bodyslam', 'move sleeptalk');
		const normalDamage = battle.p2.active[0].maxhp - battle.p2.active[0].hp;

		assert.bounded(hustleDamage / normalDamage, [1.45, 1.55]);
	});

	it(`should reduce the accuracy of physical moves`, () => {
		battle = common.createBattle([[
			{ species: 'Togekiss', ability: 'hustle', moves: ['bodyslam'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.onEvent('Accuracy', battle.format, accuracy => {
			assert.equal(accuracy, 80); // hustle reduces physical move accuracy to 0.8x (100 * 0.8)
		});
		battle.makeChoices('move bodyslam', 'move sleeptalk');
	});

	it(`should not reduce the accuracy of special moves`, () => {
		battle = common.createBattle([[
			{ species: 'Togekiss', ability: 'hustle', moves: ['airslash'] },
		], [
			{ species: 'Blissey', ability: 'naturalcure', moves: ['sleeptalk'] },
		]]);
		battle.onEvent('Accuracy', battle.format, accuracy => {
			assert.equal(accuracy, 95); // hustle only reduces physical move accuracy
		});
		battle.makeChoices('move airslash', 'move sleeptalk');
	});
});
