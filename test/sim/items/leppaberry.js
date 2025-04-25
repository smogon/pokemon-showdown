'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Leppa Berry', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should restore PP to the first move with any PP missing when eaten forcibly', () => {
		battle = common.createBattle([
			[{ species: 'Gyarados', ability: 'moxie', item: '', moves: ['sleeptalk', 'splash'] }],
			[{ species: 'Geodude', ability: 'sturdy', item: 'leppaberry', moves: ['sleeptalk', 'fling'] }],
		]);

		const pokemon = battle.p1.active[0];

		battle.makeChoices('move sleeptalk', 'move sleeptalk');
		battle.makeChoices('move splash', 'move fling');

		assert.equal(pokemon.getMoveData('sleeptalk').pp, 16);
		assert.false.equal(pokemon.getMoveData('splash').pp, 64);
	});
});
