'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sap Sipper', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should absorb an attack boost from Aromatherapy`, () => {
		battle = common.createBattle({ gameType: 'doubles' }, [[
			{ species: "Comfey", moves: ['aromatherapy'] },
			{ species: "Bouffalant", ability: 'sapsipper', moves: ['sleeptalk'] },
		], [
			{ species: "Wynaut", moves: ['sleeptalk'] },
			{ species: "Wynaut", moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		assert.statStage(battle.p1.active[1], 'atk', 1);
	});
});
