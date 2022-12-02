'use strict';

const common = require('../../common');
const assert = require('../../assert');

let battle;

describe("Wind Rider", () => {
	afterEach(() => {
		battle.destroy();
	});

	it("should boost the Pokemon's Attack when Tailwind starts", () => {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Brambleghast', ability: 'windrider', moves: ['sleeptalk']},
			{species: 'Pelipper', ability: 'keeneye', moves: ['tailwind']},
		], [
			{species: 'Mareep', ability: 'static', moves: ['sleeptalk']},
			{species: 'Lechonk', ability: 'gluttony', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].boosts.atk, 1);
	});

	it("should boost the Pokemon's Attack when it switches into Tailwind", () => {
		battle = common.createBattle([[
			{species: 'Pelipper', ability: 'keeneye', moves: ['tailwind']},
			{species: 'Brambleghast', ability: 'windrider', moves: ['sleeptalk']},
		], [
			{species: 'Lechonk', ability: 'gluttony', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		battle.makeChoices('switch 2', 'auto');
		assert.equal(battle.p1.active[0].boosts.atk, 1);
	});
});
