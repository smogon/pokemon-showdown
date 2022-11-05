'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Cursed Body`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should be able to disable Z-moves (not the base of Z-moves)`, function () {
		battle = common.createBattle({seed: [1, 2, 3, 5]}, [[ // hardcoded seed to force Cursed Body
			{species: 'gengar', ability: 'cursedbody', item: 'focussash', moves: ['sleeptalk']},
		], [
			{species: 'kommoo', item: 'kommoniumz', moves: ['clangingscales', 'sleeptalk']},
		]]);
		battle.makeChoices('move sleeptalk', 'move clangingscales zmove');
		const log = battle.getDebugLog();
		const cursedBodyIndex = log.indexOf('|Clangorous Soulblaze|[from] ability: Cursed Body|[of] p1a: Gengar');
		assert.false.equal(cursedBodyIndex, -1, 'Cursed Body should be able to disable Z-moves.');
	});
});
