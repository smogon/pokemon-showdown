'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Hyper Beam`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should always force a recharge turn`, function () {
		battle = common.createBattle([[
			{species: 'snorlax', moves: ['hyperbeam', 'tackle']},
		], [
			{species: 'alakazam', moves: ['substitute']},
		]]);
		battle.makeChoices();
		assert.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`[Gen 1] should not force a recharge turn after KOing a Pokemon`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'snorlax', moves: ['hyperbeam', 'tackle']},
		], [
			{species: 'abra', moves: ['swordsdance']},
			{species: 'exeggutor', moves: ['swordsdance']},
		]]);
		battle.makeChoices();
		battle.choose('p2', 'switch exeggutor');
		assert.false.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`[Gen 1] should not force a recharge turn after breaking a Substitute`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'snorlax', moves: ['hyperbeam', 'tackle']},
		], [
			{species: 'alakazam', moves: ['substitute']},
		]]);
		battle.makeChoices();
		assert.false.cantMove(() => battle.choose('p1', 'move tackle'));
	});

	it(`[Gen 1] should force a recharge turn after damaging, but not breaking a Substitute`, function () {
		battle = common.gen(1).createBattle([[
			{species: 'slowbro', moves: ['hyperbeam', 'tackle']},
		], [
			{species: 'rhydon', moves: ['substitute']},
		]]);
		battle.makeChoices();
		assert.cantMove(() => battle.choose('p1', 'move tackle'));
	});
});
