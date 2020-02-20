'use strict';

const assert = require('assert').strict;
const common = require('./../../common');

const unimportantPokemon = {species: 'magikarp', moves: ['splash']};

describe(`[Hackmons] Silvally`, function () {
	it(`in untyped forme should change its type to match the memory held`, function () {
		const battle = common.createBattle([
			[{species: 'silvally', ability: 'rkssystem', item: 'firememory', moves: ['rest']}],
			[unimportantPokemon],
		]);
		assert.deepEqual(battle.p1.active[0].getTypes(), ["Fire"]);
	});

	it(`in Steel forme should should be Water-typed to match the held Water Memory`, function () {
		const battle = common.createBattle([
			[{species: 'silvallysteel', ability: 'rkssystem', item: 'watermemory', moves: ['rest']}],
			[unimportantPokemon],
		]);
		assert.deepEqual(battle.p1.active[0].getTypes(), ["Water"]);
	});

	it(`in a typed forme should be Normal-typed if no memory is held`, function () {
		const battle = common.createBattle([
			[{species: 'silvallyfire', ability: 'rkssystem', item: 'leftovers', moves: ['rest']}],
			[unimportantPokemon],
		]);
		assert.deepEqual(battle.p1.active[0].getTypes(), ["Normal"]);
	});

	it(`[Gen 7] in a typed forme should be Normal-typed despite holding a memory if Silvally does not have the RKS System ability`, function () {
		const battle = common.gen(7).createBattle([
			[{species: 'silvallyfire', ability: 'truant', item: 'firememory', moves: ['rest']}],
			[unimportantPokemon],
		]);
		assert.deepEqual(battle.p1.active[0].getTypes(), ["Normal"]);
	});
});
