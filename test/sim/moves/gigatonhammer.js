'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Gigaton Hammer', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not be able to be selected if it was the last move used`, function () {
		battle = common.createBattle([[
			{species: 'Tinkaton', moves: ['helpinghand', 'gigatonhammer']},
		], [
			{species: 'Brute Bonnet', moves: ['spore']},
		]]);
		battle.makeChoices('move gigatonhammer', 'auto');
		assert.cantMove(() => battle.p1.chooseMove('gigatonhammer'), 'Tinkaton', 'Gigaton Hammer', true);
		battle.makeChoices();
		// Tinkaton wasn't able to use a different move last turn so Gigaton Hammer should still be disabled
		assert.cantMove(() => battle.p1.chooseMove('gigatonhammer'), 'Tinkaton', 'Gigaton Hammer', true);
	});

	it(`should be able to be used twice in one turn`, function () {
		battle = common.createBattle([[
			{species: 'Tinkaton', moves: ['gigatonhammer']},
		], [
			{species: 'Oranguru', moves: ['instruct']},
		]]);
		const oranguru = battle.p2.active[0];
		battle.makeChoices();
		assert.fainted(oranguru);
	});
});
