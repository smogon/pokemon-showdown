'use strict';

const assert = require('assert').strict;
const common = require('./../../common');

let battle;
const unimportantPokemon = {species: 'magikarp', moves: ['splash']};

describe(`[Hackmons] Arceus`, function () {
	it(`in untyped forme should change its type to match the plate held`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'arceus', ability: 'multitype', item: 'flameplate', moves: ['rest']},
		], [
			unimportantPokemon,
		]]);
		const arceus = battle.p1.active[0];
		assert(arceus.hasType('Fire'));
	});

	it(`in Steel forme should should be Water-typed to match the held Splash Plate`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'arceussteel', ability: 'multitype', item: 'splashplate', moves: ['rest']},
		], [
			unimportantPokemon,
		]]);
		const arceus = battle.p1.active[0];
		assert(arceus.hasType('Water'));
	});

	it(`in a typed forme should be Normal-typed if no plate is held`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'arceusfire', ability: 'multitype', item: 'leftovers', moves: ['rest']},
		], [
			unimportantPokemon,
		]]);
		const arceus = battle.p1.active[0];
		assert(arceus.hasType('Normal'));
	});

	it(`in a typed forme should be Normal-typed despite holding a plate if Arceus does not have the Multitype ability`, function () {
		battle = common.gen(4).createBattle([[
			{species: 'arceusfire', ability: 'truant', item: 'flameplate', moves: ['rest']},
		], [
			unimportantPokemon,
		]]);
		const arceus = battle.p1.active[0];
		assert(arceus.hasType('Normal'));
	});

	it(`should not be able to lose its typing`, function () {
		battle = common.createBattle([[
			{species: 'arceus', ability: 'multitype', item: 'flameplate', moves: ['burnup']},
		], [
			{species: 'reuniclus', moves: ['soak']},
		]]);
		battle.makeChoices();
		const arceus = battle.p1.active[0];
		assert(arceus.hasType('Fire'), 'Arceus should not change type.');
	});

	it(`should use Arceus's real type for Revelation Dance`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'arceusfire', ability: 'sandrush', moves: ['revelationdance']},
		], [
			{species: 'aggron', ability: 'colorchange', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const aggron = battle.p2.active[0];
		assert(aggron.hasType('Normal'), 'Aggron should become Normal-type.');
	});
});
