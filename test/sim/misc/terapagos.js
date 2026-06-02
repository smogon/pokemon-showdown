'use strict';

const assert = require('assert').strict;
const common = require('./../../common');

let battle;

describe(`Terapagos`, () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`[Hackmons] should not cause Terapagos-Terastal to become Terapagos-Stellar if the user is Transformed`, () => {
		battle = common.gen(9).createBattle([[
			{ species: 'terapagos', ability: 'terashift', moves: ['transform'], teraType: 'Stellar' },
			{ species: 'pikachu', moves: ['sleeptalk'] },
		], [
			{ species: 'silicobra', moves: ['sleeptalk'] },
		]]);

		battle.makeChoices();
		battle.makeChoices('move sleeptalk terastallize', 'auto');
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'auto');
		const terapagos = battle.p1.active[0];
		assert.species(terapagos, 'Terapagos-Terastal');
	});
});
