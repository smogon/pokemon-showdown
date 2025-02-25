'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Hunger Switch", function () {
	afterEach(function () {
		battle.destroy();
	});

	it("should alternate forms every turn", function () {
		battle = common.createBattle([[
			{species: 'Morpeko', ability: 'hungerswitch', moves: ['rest']},
		], [
			{species: 'Magikarp', ability: 'Swift Swim', moves: ['splash']},
		]]);
		const peko = battle.p1.active[0];
		assert.species(peko, 'Morpeko');
		battle.makeChoices();
		assert.species(peko, 'Morpeko-Hangry');
		battle.makeChoices();
		assert.species(peko, 'Morpeko');
	});

	it("should revert back to the base form when switched out", function () {
		battle = common.createBattle([[
			{species: 'Morpeko', ability: 'hungerswitch', moves: ['rest']},
			{species: 'Furret', ability: 'Run Away', moves: ['sleeptalk']},
		], [
			{species: 'Magikarp', ability: 'Swift Swim', moves: ['splash']},
			{species: 'Koffing', ability: 'neutralizinggas', moves: ['sleeptalk']},
		]]);
		const peko = battle.p1.active[0];
		battle.makeChoices();
		assert.species(peko, 'Morpeko-Hangry');
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'switch 2');
		assert.species(peko, 'Morpeko');
	});

	it("should stop activating when Morpeko Terastallizes", function () {
		battle = common.gen(9).createBattle([[
			{species: 'Morpeko', ability: 'hungerswitch', moves: ['rest']},
		], [
			{species: 'Magikarp', ability: 'Swift Swim', moves: ['splash']},
		]]);
		const peko = battle.p1.active[0];
		battle.makeChoices();
		assert.species(peko, 'Morpeko-Hangry');
		battle.makeChoices('move 1 terastallize', 'auto');
		assert.species(peko, 'Morpeko-Hangry');
	});

	it("should maintain its form when Terastallized, even when switched out", function () {
		battle = common.gen(9).createBattle([[
			{species: 'Morpeko', ability: 'hungerswitch', moves: ['rest']},
			{species: 'Furret', ability: 'Run Away', moves: ['sleeptalk']},
		], [
			{species: 'Magikarp', ability: 'Swift Swim', moves: ['splash']},
			{species: 'Koffing', ability: 'neutralizinggas', moves: ['sleeptalk']},
		]]);
		const peko = battle.p1.active[0];
		battle.makeChoices();
		battle.makeChoices('move 1 terastallize', 'auto');
		assert.species(peko, 'Morpeko-Hangry');
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'switch 2');
		assert.species(peko, 'Morpeko-Hangry');
	});
});
