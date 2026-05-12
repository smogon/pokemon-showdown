'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Pledge moves', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should work`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: 'Ninjask', ability: 'noability', moves: ['waterpledge'] },
			{ species: 'Incineroar', ability: 'noability', moves: ['grasspledge'] },
		], [
			{ species: 'Garchomp', ability: 'noability', moves: ['waterpledge'] },
			{ species: 'Mew', ability: 'noability', moves: ['firepledge'] },
		]]);
		battle.makeChoices('move 1 1, move 1 1', 'move 1 1, move 1 2');

		// Incineroar should start Grass Pledge first, then faint to Water Pledge
		assert(battle.p2.sideConditions['waterpledge']);
		assert(battle.p2.sideConditions['grasspledge']);
		assert.fainted(battle.p1.active[1]);
	});
});
