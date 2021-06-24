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
		battle.makeChoices('move destinybond', 'move calmmind');
		battle.makeChoices('move destinybond', 'move psychic');
		assert.fainted(battle.p1.active[0]);
		assert.false.fainted(battle.p2.active[0]);

		battle.destroy();
		battle = common.createBattle([
			[{species: "Gastly", ability: 'levitate', moves: ['destinybond']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Metagross", ability: 'clearbody', moves: ['psychic', 'calmmind']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.makeChoices('move destinybond', 'move calmmind');
		battle.makeChoices('move destinybond', 'move psychic');
		assert.fainted(battle.p1.active[0]);
		assert.false.fainted(battle.p2.active[0]);
	});

	it(`should not fail after Protect usage`, function () {
		battle = common.createBattle([
			[{species: "Gastly", ability: 'levitate', moves: ['destinybond', 'protect']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Metagross", ability: 'clearbody', moves: ['psychic', 'calmmind']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.makeChoices('move protect', 'move calmmind');
		battle.makeChoices('move destinybond', 'move psychic');
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
	});

	it(`should be removed the next turn if a fast user is asleep`, function () {
		battle = common.createBattle([
			[{species: "Gastly", ability: 'levitate', item: '', moves: ['destinybond', 'spite']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Hypno", ability: 'insomnia', item: 'laggingtail', moves: ['psychic', 'hypnosis']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.makeChoices('move destinybond', 'move hypnosis');
		battle.makeChoices('move destinybond', 'move psychic');
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
		battle.makeChoices('move destinybond', 'move calmmind');
		battle.makeChoices('move destinybond', 'move psychic');
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);

		battle.destroy();
		battle = common.gen(6).createBattle([
			[{species: "Gastly", ability: 'levitate', moves: ['destinybond']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
			[{species: "Metagross", ability: 'clearbody', moves: ['psychic', 'calmmind']}, {species: "Clefable", ability: 'unaware', moves: ['calmmind']}],
		]);
		battle.makeChoices('move destinybond', 'move calmmind');
		battle.makeChoices('move destinybond', 'move psychic');
		assert.fainted(battle.p1.active[0]);
		assert.fainted(battle.p2.active[0]);
	});

	it(`should end the effect before the user switches out`, function () {
		battle = common.gen(6).createBattle([
			[{species: "Gastly", level: 50, moves: ['destinybond']}, {species: "Gengar", moves: ['sleeptalk']}],
			[{species: "Snorlax", moves: ['sleeptalk', 'pursuit']}],
		]);
		const gastly = battle.p1.pokemon[0];
		const snorlax = battle.p2.pokemon[0];
		battle.makeChoices('move destinybond', 'move sleeptalk');
		battle.makeChoices('switch 2', 'move pursuit');
		assert.fainted(gastly);
		assert.false.fainted(snorlax);
	});
});

describe(`Destiny Bond [Gen 4]`, function () {
	afterEach(() => battle.destroy());

	it(`should not end the effect before the user switches out`, function () {
		battle = common.gen(4).createBattle([
			[{species: "Gastly", level: 50, moves: ['destinybond']}, {species: "Gengar", moves: ['sleeptalk']}],
			[{species: "Snorlax", moves: ['sleeptalk', 'pursuit']}],
		]);
		const gastly = battle.p1.pokemon[0];
		const snorlax = battle.p2.pokemon[0];
		battle.makeChoices('move destinybond', 'move sleeptalk');
		battle.makeChoices('switch 2', 'move pursuit');
		assert.fainted(gastly);
		assert.fainted(snorlax);
	});
});

describe(`Destiny Bond [Gen 2]`, function () {
	afterEach(() => battle.destroy());

	it(`should end the effect before the user switches out if it is faster than the Pursuit user`, function () {
		battle = common.gen(2).createBattle([
			[{species: "Gastly", level: 50, moves: ['destinybond']}, {species: "Haunter", level: 30, moves: ['destinybond']}, {species: "Gengar", moves: ['sleeptalk']}],
			[{species: "Snorlax", moves: ['sleeptalk', 'pursuit']}],
		]);
		const gastly = battle.p1.pokemon[0];
		const haunter = battle.p1.pokemon[1];
		const snorlax = battle.p2.pokemon[0];
		battle.makeChoices('move destinybond', 'move sleeptalk');
		battle.makeChoices('switch 2', 'move pursuit');
		assert.fainted(gastly);
		assert.false.fainted(snorlax);
		battle.makeChoices('move destinybond', 'move sleeptalk');
		battle.makeChoices('switch 3', 'move pursuit');
		assert.fainted(haunter);
		assert.fainted(snorlax);
	});
});
