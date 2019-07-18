'use strict';

const assert = require('assert');
const common = require('./../../common');

const unimportantPokemon = {species: 'magikarp', moves: ['splash']};

describe(`[Hackmons] Arceus`, function () {
	it(`in untyped forme should change its type to match the plate held`, function () {
		const battle = common.gen(4).createBattle([
			[{species: 'arceus', ability: 'multitype', item: 'flameplate', moves: ['rest']}],
			[unimportantPokemon],
		]);
		assert.deepStrictEqual(battle.p1.active[0].getTypes(), ["Fire"]);
	});

	it(`in Steel forme should should be Water-typed to match the held Splash Plate`, function () {
		const battle = common.gen(4).createBattle([
			[{species: 'arceussteel', ability: 'multitype', item: 'splashplate', moves: ['rest']}],
			[unimportantPokemon],
		]);
		assert.deepStrictEqual(battle.p1.active[0].getTypes(), ["Water"]);
	});

	it(`in a typed forme should be Normal-typed if no plate is held`, function () {
		const battle = common.gen(4).createBattle([
			[{species: 'Arceusfire', ability: 'multitype', item: 'leftovers', moves: ['rest']}],
			[unimportantPokemon],
		]);
		assert.deepStrictEqual(battle.p1.active[0].getTypes(), ["Normal"]);
	});

	it(`in a typed forme should be Normal-typed despite holding a plate if Arceus does not have the Multitype ability`, function () {
		const battle = common.gen(4).createBattle([
			[{species: 'arceusfire', ability: 'truant', item: 'flameplate', moves: ['rest']}],
			[unimportantPokemon],
		]);
		assert.deepStrictEqual(battle.p1.active[0].getTypes(), ["Normal"]);
	});
});
