'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Red Card', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not trigger if the target should be KOed from Destiny Bond and also not crash the client`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Aggron", item: 'redcard', moves: ['rockslide']},
			{species: "Wynaut", ability: 'prankster', level: 1, moves: ['destinybond']},
		], [
			{species: "Conkeldurr", moves: ['sleeptalk']},
			{species: "Gardevoir", moves: ['strugglebug']},
			{species: "Corsola", moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.holdsItem(battle.p1.active[0], "Red Card should not be consumed");
		assert.fainted(battle.p1.pokemon[1], "Gardevoir should faint from Aggron's Destiny Bond");
	});

	it(`should trigger if the target is still in battle`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Aggron", item: 'redcard', moves: ['rockslide']},
			{species: "Wynaut", ability: 'prankster', level: 1, moves: ['sleeptalk']},
		], [
			{species: "Conkeldurr", moves: ['sleeptalk']},
			{species: "Gardevoir", moves: ['strugglebug']},
			{species: "Corsola", moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.false.holdsItem(battle.p1.active[0], "Red Card should be consumed.");
		assert.species(battle.p2.active[1], "Corsola", "Corsola should be dragged in by Red Card");
	});
});
