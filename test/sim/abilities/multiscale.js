'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Multiscale', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should halve damage when it is at full health`, function () {
		battle = common.createBattle([[
			{species: 'Dragonite', ability: 'multiscale', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', moves: ['wickedblow']},
		]]);

		battle.makeChoices();
		const dnite = battle.p1.active[0];
		const damage = dnite.maxhp - dnite.hp;
		assert.bounded(damage, [15, 18], `Multiscale should reduce damage`);

		battle.makeChoices();
		assert.bounded(dnite.maxhp - dnite.hp - damage, [30, 36], `Multiscale should not reduce damage, because Dragonite was damaged`);
	});

	it('should be suppressed by Mold Breaker', function () {
		battle = common.createBattle([[
			{species: 'Dragonite', ability: 'multiscale', moves: ['sleeptalk']},
		], [
			{species: 'Wynaut', ability: 'moldbreaker', moves: ['wickedblow']},
		]]);

		battle.makeChoices();
		const dnite = battle.p1.active[0];
		const damage = dnite.maxhp - dnite.hp;
		assert.bounded(damage, [30, 36]);
	});
});
