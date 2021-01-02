'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Cursed Body`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should be able to trigger on Z-moves`, function () {
		battle = common.createBattle({seed: [1, 2, 3, 98]}, [[ // hardcoded seed to force Cursed Body
			{species: 'gengar', ability: 'cursedbody', item: 'focussash', moves: ['sleeptalk']},
		], [
			{species: 'kommoo', item: 'kommoniumz', moves: ['clangingscales', 'sleeptalk']},
		]]);
		battle.makeChoices('move sleeptalk', 'move clangingscales zmove');
		assert.cantMove(() => battle.makeChoices('auto', 'move clangingscales'), 'Kommo-o', 'Clanging Scales');
	});
});
