'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Throat Spray', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not activate if the last opponent fainted`, () => {
		battle = common.createBattle([[
			{ species: 'kommoo', item: 'throatspray', moves: ['clangingscales'] },
		], [
			{ species: 'roggenrola', level: 1, moves: ['sleeptalk'] },
		]]);
		battle.makeChoices();
		assert.false(battle.getDebugLog().includes('-enditem'));
	});
});
