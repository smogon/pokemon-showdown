'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Cursed Body`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should be able to disable Z-moves (not the base of Z-moves)`, function () {
		battle = common.createBattle({forceRandomChance: true}, [[
			{species: 'gengar', ability: 'cursedbody', item: 'focussash', moves: ['sleeptalk']},
		], [
			{species: 'kommoo', item: 'kommoniumz', moves: ['clangingscales', 'sleeptalk']},
		]]);
		battle.makeChoices('move sleeptalk', 'move clangingscales zmove');
		assert(battle.log.some(line => line.includes('Cursed Body')));
	});
});
