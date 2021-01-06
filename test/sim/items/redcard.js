'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Red Card', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should not trigger if the target should be KOed from Destiny Bond and also not crash the client`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Aggron", item: 'redcard', moves: ['rockslide']},
			{species: "Wynaut", ability: 'prankster', level: 1, moves: ['destinybond']},
		], [
			{species: "Conkeldurr", moves: ['sleeptalk']},
			{species: "Gardevoir", moves: ['strugglebug']},
			{species: "Corsola", moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.holdsItem(battle.p1.active[0]);
	});
});
