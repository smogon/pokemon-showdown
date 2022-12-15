'use strict';

const assert = require('../../assert');
const common = require('../../common');

let battle;

describe('Copycat', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should be able to copy called moves', function () {
		battle = common.createBattle([[
			{species: 'riolu', ability: 'steadfast', moves: ['copycat']},
		], [
			{species: 'luxray', moves: ['eerieimpulse', 'roar']},
		]]);

		battle.makeChoices();
		battle.makeChoices('auto', 'move roar');
		assert.equal(battle.p2.active[0].boosts.spa, -4);
	});
});
