'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('G-Max Steelsurge', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should deal 2x damage to Eiscue and Mimikyu`, function () {
		battle = common.gen(8).createBattle([[
			{species: 'Pyukumuku', moves: ['uturn']},
			{species: 'Eiscue', ability: 'iceface', moves: ['splash']},
			{species: 'Mimikyu', ability: 'disguise', moves: ['splash']},
		], [
			{species: 'Copperajah', moves: ['ironhead', 'sleeptalk'], gigantamax: true},
		]]);
		battle.makeChoices('move uturn', 'move ironhead dynamax');
		battle.makeChoices('switch 2');
		const eiscue = battle.p1.active[0];
		const expectedPercent = Math.pow(0.5, 2);
		let expectedDamage = Math.floor(eiscue.maxhp * expectedPercent);
		assert.equal(eiscue.maxhp - eiscue.hp, expectedDamage, `Eiscue should take ${expectedPercent * 100}%`);

		battle.makeChoices('switch 3', 'move maxguard');
		const mimikyu = battle.p1.active[0];
		expectedDamage = Math.floor(mimikyu.maxhp * expectedPercent);
		assert.equal(mimikyu.maxhp - mimikyu.hp, expectedDamage, `Mimikyu should take ${expectedPercent * 100}%`);
	});
});
