'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sap Sipper', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should absorb an attack boost from Aromatherapy`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Comfey", moves: ['aromatherapy']},
			{species: "Bouffalant", ability: 'sapsipper', moves: ['sleeptalk']},
		], [
			{species: "Wynaut", moves: ['sleeptalk']},
			{species: "Wynaut", moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.statStage(battle.p1.active[1], 'atk', 1);
	});
});
