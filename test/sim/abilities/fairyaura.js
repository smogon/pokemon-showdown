'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Fairy Aura`, function () {
	afterEach(() => battle.destroy());

	it(`should activate if dragged in by a Mold Breaker Pokémon`, function () {
		battle = common.createBattle([[
			{species: "Charmander", ability: 'blaze', moves: ['sleeptalk']},
			{species: "Xerneas", ability: 'fairyaura', moves: ['sleeptalk']},
		], [
			{species: "Excadrill", ability: 'moldbreaker', moves: ['roar']},
		]]);
		battle.makeChoices();
		assert(battle.log.includes('|-ability|p1a: Xerneas|Fairy Aura'));
	});

	it(`[Gen 7] should not activate if dragged in by a Mold Breaker Pokémon`, function () {
		battle = common.gen(7).createBattle([[
			{species: "Charmander", ability: 'blaze', moves: ['sleeptalk']},
			{species: "Xerneas", ability: 'fairyaura', moves: ['sleeptalk']},
		], [
			{species: "Excadrill", ability: 'moldbreaker', moves: ['roar']},
		]]);
		battle.makeChoices();
		assert.false(battle.log.includes('|-ability|p1a: Xerneas|Fairy Aura'));
	});
});
