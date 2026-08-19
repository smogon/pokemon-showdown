'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Griseous Orb [Gen 4]', () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should prevent changing the holder's ability`, () => {
		battle = common.gen(4).createBattle([[
			{ species: 'dhelmise', ability: 'pressure', item: 'griseousorb', moves: ['skillswap'] },
		], [
			{ species: 'wobbuffet', ability: 'flashfire', moves: ['worryseed'] },
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].ability, 'pressure');
	});
});
