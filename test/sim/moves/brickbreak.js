'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Brick Break', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should break Reflect', function () {
		battle = common.createBattle([[
			{species: "mew", moves: ['brickbreak', 'splash']},
		], [
			{species: "ninjask", moves: ['reflect', 'splash']},
		]]);

		battle.makeChoices('move splash', 'move reflect');
		assert(battle.p2.sideConditions['reflect']);

		battle.makeChoices('move brickbreak', 'move splash');
		assert.false(battle.p2.sideConditions['reflect']);
	});
});
