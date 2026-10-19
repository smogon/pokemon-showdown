'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Eject Button', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should be suppressed by Sheer Force`, () => {
		battle = common.createBattle([[
			{ species: 'Mew', item: 'ejectbutton', moves: ['sleeptalk'] },
			{ species: 'Clefable', moves: ['sleeptalk'] },
		], [
			{ species: 'Wynaut', ability: 'sheerforce', moves: ['confusion'] },
		]]);

		battle.makeChoices();
		assert.holdsItem(battle.p1.active[0], 'ejectbutton');
		assert.equal(battle.requestState, 'move');
	});
});
