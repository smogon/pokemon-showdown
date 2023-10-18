'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Booster Energy', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not activate before Sticky Web when switching in`, function () {
		battle = common.createBattle([[
			{species: 'Abra', ability: 'synchronize', moves: ['teleport']},
			{species: 'Iron Bundle', ability: 'quarkdrive', item: 'boosterenergy', moves: ['sleeptalk']},
		], [
			{species: 'Ribombee', ability: 'shielddust', moves: ['stickyweb']},
		]]);

		battle.makeChoices();
		battle.makeChoices('switch 2');
		const bundle = battle.p1.active[0];
		assert.equal(bundle.volatiles['quarkdrive'].bestStat, 'spa',
			`Iron Bundle's Speed should have been lowered before Booster Energy activated, boosting its SpA instead.`);
	});
});
