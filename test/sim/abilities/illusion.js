'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Illusion', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not instantly wear off before Dynamaxing`, function () {
		battle = common.gen(8).createBattle([[
			{species: "Zoroark", ability: 'illusion', moves: ['sleeptalk']},
			{species: "Diglett", moves: ['sleeptalk']},
		], [
			{species: "Wynaut", moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move sleeptalk dynamax', 'auto');
		assert(battle.log.every(line => !line.includes('|-end|p1a: Zoroark|Illusion')));
	});

	it(`should prevent the user from Dynamaxed when Illusioning as a Pokemon that cannot Dynamax`, function () {
		battle = common.gen(8).createBattle([[
			{species: "Zoroark", ability: 'illusion', moves: ['sleeptalk']},
			{species: "Eternatus", moves: ['sleeptalk']},
		], [
			{species: "Wynaut", moves: ['sleeptalk']},
		]]);

		assert.cantMove(() => battle.choose('p1', 'move sleeptalk dynamax'));
	});

	it(`should be able to wear off normally while Dynamaxed`, function () {
		battle = common.gen(8).createBattle([[
			{species: "Zoroark", ability: 'illusion', moves: ['machpunch']},
			{species: "Diglett", moves: ['sleeptalk']},
		], [
			{species: "Wynaut", moves: ['thunderbolt']},
		]]);

		battle.makeChoices('move machpunch dynamax', 'auto');
		assert(battle.log.some(line => line.includes('|-end|p1a: Zoroark|Illusion')));
	});

	it(`should Illusion as the regular Dynamax version of G-Max Pokemon while Dynamaxed`, function () {
		battle = common.gen(8).createBattle([[
			{species: "Zoroark", ability: 'illusion', moves: ['sleeptalk']},
			{species: "Charizard", gigantamax: true, moves: ['ember', 'sleeptalk']},
		], [
			{species: "Wynaut", moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move sleeptalk dynamax', 'auto');
		assert(battle.log.every(line => !line.includes('Gmax')));
	});

	it(`should instantly wear off before using a Z-move`, function () {
		battle = common.gen(7).createBattle([[
			{species: "Zoroark", ability: 'illusion', item: 'fightiniumz', moves: ['machpunch', 'sleeptalk']},
			{species: "Octillery", moves: ['sleeptalk']},
		], [
			{species: "Wynaut", moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move machpunch zmove', 'auto');
		assert(battle.log.some(line => line.includes('|-end|p1a: Zoroark|Illusion')));
	});
});
