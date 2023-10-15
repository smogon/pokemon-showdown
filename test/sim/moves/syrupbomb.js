'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Syrup Bomb', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should lower the opponent's Speed for 3 turns, but not remove its volatile until after 4 turns`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', ability: 'noguard', moves: ['syrupbomb']},
		], [
			{species: 'Applin', moves: ['sleeptalk']},
		]]);

		for (let i = 0; i < 3; i++) battle.makeChoices();
		const applin = battle.p2.active[0];
		assert.statStage(applin, 'spe', -3);
		assert(applin.volatiles['syrupbomb'], `Applin should have the Syrup Bomb volatile for another turn`);

		battle.makeChoices();
		assert.statStage(applin, 'spe', -3);
		assert.false(applin.volatiles['syrupbomb'], `Applin should no longer have the Syrup Bomb volatile`);
	});
});
