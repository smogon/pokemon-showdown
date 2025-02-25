'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('No Retreat', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not allow usage multiple times in a row normally`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", moves: ['noretreat'] },
		], [
			{ species: "Caterpie", moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();

		const wynaut = battle.p1.active[0];
		assert.statStage(wynaut, 'atk', 1);
	});

	it(`should allow usage multiple times in a row normally if it has the trapped volatile`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", moves: ['noretreat'] },
		], [
			{ species: "Caterpie", moves: ['block'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();

		const wynaut = battle.p1.active[0];
		assert.statStage(wynaut, 'atk', 2);
	});
});
