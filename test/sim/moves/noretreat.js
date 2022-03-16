'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('No Retreat', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not allow usage multiple times in a row normally`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", moves: ['noretreat']},
		], [
			{species: "Caterpie", moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices();

		const wynaut = battle.p1.active[0];
		assert.statStage(wynaut, 'atk', 1);
	});

	it(`should allow usage multiple times in a row normally if it has the trapped volatile`, function () {
		battle = common.createBattle([[
			{species: "Wynaut", moves: ['noretreat']},
		], [
			{species: "Caterpie", moves: ['block']},
		]]);

		battle.makeChoices();
		battle.makeChoices();

		const wynaut = battle.p1.active[0];
		assert.statStage(wynaut, 'atk', 2);
	});
});
