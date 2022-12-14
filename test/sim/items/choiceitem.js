'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Choice Items", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should restore the same Choice lock after dynamax ends", function () {
		battle = common.gen(8).createBattle([[
			{species: 'gyarados', moves: ['sleeptalk', 'splash'], item: 'choicescarf'},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move 1', 'auto');
		battle.makeChoices('move 1 dynamax', 'auto');
		battle.makeChoices();
		battle.makeChoices('move 2', 'auto');
		assert.throws(() => battle.choose('p1', 'move 2'),
			"Gyarados shouldn't be allowed to select a different move");
	});
});
