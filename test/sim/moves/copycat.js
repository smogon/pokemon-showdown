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
		assert.statStage(battle.p2.active[0], 'spa', -4);
	});

	it('[Gen 4] should not be able to copy called moves', function () {
		battle = common.gen(4).createBattle([[
			{species: 'bonsly', ability: 'sturdy', moves: ['copycat']},
		], [
			{species: 'ampharos', ability: 'static', moves: ['growl', 'counter']},
		]]);
		battle.makeChoices();
		battle.makeChoices('auto', 'move counter');
		assert.statStage(battle.p2.active[0], 'atk', -1);
	});
});
