'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Struggle', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should KO Shedinja in Gen 4 (and every other gen)`, () => {
		battle = common.gen(4).createBattle([[
			{ species: 'Shedinja', moves: ['sleeptalk'] },
		], [
			{ species: 'Salamence', moves: ['taunt'] },
		]]);

		battle.makeChoices();
		battle.makeChoices();
		assert.equal(battle.winner, 'Player 2');
	});
});
