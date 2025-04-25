'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Stockpile', () => {
	afterEach(() => {
		battle.destroy();
	});

	it('should keep track of how many boosts to each defense stat were successful', () => {
		battle = common.createBattle([
			[{ species: 'Seviper', ability: 'shedskin', moves: ['stockpile', 'spitup'] }],
			[{ species: 'Zangoose', ability: 'immunity', moves: ['sleeptalk'] }],
		]);
		battle.boost({ def: 4, spd: 5 }, battle.p1.active[0]);

		battle.makeChoices('move stockpile', 'move sleeptalk');
		battle.makeChoices('move stockpile', 'move sleeptalk');
		battle.makeChoices('move spitup', 'move sleeptalk');

		assert.equal(battle.p1.active[0].boosts.def, 4);
		assert.equal(battle.p1.active[0].boosts.spd, 5);
	});
});
