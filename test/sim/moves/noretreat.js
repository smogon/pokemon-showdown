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

	it(`should not trap the user if it is already trapped`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", moves: ['noretreat', 'splash'] },
			{ species: "Magikarp", moves: ['splash'] },
		], [
			{ species: "Caterpie", moves: ['block'] },
			{ species: "Weedle", moves: ['splash'] },
		]]);

		const wynaut = battle.p1.active[0];
		battle.makeChoices();
		battle.makeChoices();
		assert.statStage(wynaut, 'atk', 2);

		// Should not be trapped after caterpie switches out
		battle.makeChoices('move splash', 'switch 2');
		battle.makeChoices('switch 2', 'move splash');
	});
});
