'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Destiny Bond`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should have a chance to succeed on repeated usage`, function () {
		battle = common.createBattle([
			[{species: "Gastly", ability: 'levitate', moves: ['destinybond']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Metagross", ability: 'clearbody', moves: ['psychic', 'calmmind']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.p1.chooseMove('destinybond').foe.chooseMove('calmmind');
		battle.seed = common.minRollSeed;
		battle.p1.chooseMove('destinybond').foe.chooseMove('psychic');
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
	});

	it(`should have a chance to fail on repeated usage`, function () {
		battle = common.createBattle([
			[{species: "Gastly", ability: 'levitate', moves: ['destinybond']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Metagross", ability: 'clearbody', moves: ['psychic', 'calmmind']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		assert.equal(battle.turn, 1);
		battle.p1.chooseMove('destinybond').foe.chooseMove('calmmind');
		battle.seed = common.maxRollSeed;
		battle.p1.chooseMove('destinybond').foe.chooseMove('psychic');
		assert.fainted(battle.p1.active[0]);
		assert.false.fainted(battle.p2.active[0]);
	});

	it(`should not fail after Protect usage`, function () {
		battle = common.createBattle([
			[{species: "Gastly", ability: 'levitate', moves: ['destinybond', 'protect']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Metagross", ability: 'clearbody', moves: ['psychic', 'calmmind']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.p1.chooseMove('protect').foe.chooseMove('calmmind');
		battle.seed = common.maxRollSeed;
		battle.p1.chooseMove('destinybond').foe.chooseMove('psychic');
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
	});
});
