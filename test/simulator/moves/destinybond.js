'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Destiny Bond`, function () {
	afterEach(() => battle.destroy());

	it(`should fail if used consecutively`, function () {
		battle = common.createBattle([
			[{species: "Gastly", ability: 'levitate', moves: ['destinybond']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Metagross", ability: 'clearbody', moves: ['psychic', 'calmmind']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.p1.chooseMove('destinybond').foe.chooseMove('calmmind');
		battle.p1.chooseMove('destinybond').foe.chooseMove('psychic');
		assert.fainted(battle.p1.active[0]);
		assert.false.fainted(battle.p2.active[0]);

		battle.destroy();
		battle = common.createBattle([
			[{species: "Gastly", ability: 'levitate', moves: ['destinybond']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Metagross", ability: 'clearbody', moves: ['psychic', 'calmmind']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.p1.chooseMove('destinybond').foe.chooseMove('calmmind');
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
		battle.p1.chooseMove('destinybond').foe.chooseMove('psychic');
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
	});

	it(`should be removed the next turn if a fast user is asleep`, function () {
		battle = common.createBattle([
			[{species: "Gastly", ability: 'levitate', item: '', moves: ['destinybond', 'spite']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Hypno", ability: 'insomnia', item: 'laggingtail', moves: ['psychic', 'hypnosis']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.p1.chooseMove('destinybond').foe.chooseMove('hypnosis');
		battle.commitDecisions();
		assert.fainted(battle.p1.active[0]);
		assert.false.fainted(battle.p2.active[0]);
	});
});

describe(`Destiny Bond [Gen 6]`, function () {
	afterEach(() => battle.destroy());

	it(`should not fail if used consecutively`, function () {
		battle = common.gen(6).createBattle([
			[{species: "Gastly", ability: 'levitate', moves: ['destinybond']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Metagross", ability: 'clearbody', moves: ['psychic', 'calmmind']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.p1.chooseMove('destinybond').foe.chooseMove('calmmind');
		battle.p1.chooseMove('destinybond').foe.chooseMove('psychic');
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);

		battle.destroy();
		battle = common.gen(6).createBattle([
			[{species: "Gastly", ability: 'levitate', moves: ['destinybond']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Metagross", ability: 'clearbody', moves: ['psychic', 'calmmind']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.p1.chooseMove('destinybond').foe.chooseMove('calmmind');
		battle.p1.chooseMove('destinybond').foe.chooseMove('psychic');
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
	});
});
