'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Ice Spinner`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should remove Terrains if the user is active and on the field`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['icespinner']},
		], [
			{species: 'registeel', ability: 'psychicsurge', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.false(battle.field.isTerrain('psychicterrain'));
	});

	it.skip(`should not remove Terrains if the user faints from Life Orb`, function () {
		battle = common.createBattle([[
			{species: 'shedinja', item: 'lifeorb', moves: ['icespinner']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'registeel', ability: 'psychicsurge', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert(battle.field.isTerrain('psychicterrain'));
	});

	it(`should not remove Terrains if the user faints from Rocky Helmet`, function () {
		battle = common.createBattle([[
			{species: 'shedinja', moves: ['icespinner']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'registeel', item: 'rockyhelmet', ability: 'psychicsurge', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert(battle.field.isTerrain('psychicterrain'));
	});

	it.skip(`should not remove Terrains if the user is forced out via Red Card`, function () {
		battle = common.createBattle([[
			{species: 'shedinja', moves: ['icespinner']},
			{species: 'wynaut', moves: ['sleeptalk']},
		], [
			{species: 'registeel', item: 'redcard', ability: 'psychicsurge', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert(battle.field.isTerrain('psychicterrain'));
	});
});
