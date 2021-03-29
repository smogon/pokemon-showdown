'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Unnerve`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should allow Berry activation between switches of Unnerve`, function () {
		battle = common.createBattle([[
			{species: 'toxapex', ability: 'unnerve', moves: ['toxic']},
			{species: 'corviknight', ability: 'unnerve', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', item: 'lumberry', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'auto');
		assert.equal(battle.p2.active[0].status, '');
	});
});
