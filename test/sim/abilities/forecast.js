'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Forecast', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should revert form if it loses its ability`, () => {
		battle = common.createBattle([[
			{ species: "Castform", ability: 'forecast', moves: ['sleeptalk'] },
		], [
			{ species: "Groudon", ability: 'drought', moves: ['skillswap'] },
		]]);
		assert.species(battle.p1.active[0], 'Castform-Sunny');
		battle.makeChoices();
		assert.species(battle.p1.active[0], 'Castform');
	});

	describe('[Gen 4]', () => {
		it(`should not revert form if it loses its ability`, () => {
			battle = common.gen(4).createBattle([[
				{ species: "Castform", ability: 'forecast', moves: ['sleeptalk'] },
			], [
				{ species: "Groudon", ability: 'drought', moves: ['skillswap'] },
			]]);
			assert.species(battle.p1.active[0], 'Castform-Sunny');
			battle.makeChoices();
			assert.species(battle.p1.active[0], 'Castform-Sunny');
		});
	});
});
