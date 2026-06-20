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

	it(`If trapped, No Retreat should not also trap`, () => {
		battle = common.createBattle([[
			{ species: "Wynaut", moves: ['noretreat', 'splash'] },
			{ species: "Magikarp", moves: ['splash'] },
		], [
			{ species: "Caterpie", moves: ['block'] },
			{ species: "Weedle", moves: ['splash'] },
		]]);

		battle.makeChoices();

		const wynaut = battle.p1.active[0];
		assert.statStage(wynaut, 'atk', 1);

		// Should not be trapped after caterpie switches out
		battle.makeChoices('move splash', 'switch 2');
		battle.makeChoices('switch 2', 'move splash');
		assert.equal(battle.p1.active[0].name, 'Magikarp');
	});

	it(`Champions: should not allow usage multiple times in a row`, () => {
		battle = common.createBattle({ formatid: 'gen9championscustomgame' }, [[
			{ species: "Wynaut", moves: ['noretreat'] },
		], [
			{ species: "Caterpie", moves: ['block'] },
		]]);

		battle.makeChoices(); // Team Preview
		battle.makeChoices(); // Wynaut uses No Retreat

		let wynaut = battle.p1.active[0];
		assert.statStage(wynaut, 'atk', 1);

		battle.makeChoices(); // Wynaut fails No Retreat

		wynaut = battle.p1.active[0];
		assert.statStage(wynaut, 'atk', 1);
	});
});
