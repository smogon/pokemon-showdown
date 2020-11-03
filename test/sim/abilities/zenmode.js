'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Zen Mode', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`can't be overriden in Gen 7 or later`, function () {
		battle = common.createBattle([[
			{species: "Darmanitan", ability: 'zenmode', moves: ['entrainment']},
		], [
			{species: "Wynaut", ability: 'swiftswim', moves: ['skillswap', 'entrainment']},
		]]);

		const darm = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(darm.ability, 'zenmode');

		battle.makeChoices('auto', 'move entrainment');
		assert.equal(darm.ability, 'zenmode');
	});

	it(`can be overriden in Gen 6 and earlier`, function () {
		battle = common.gen(6).createBattle([[
			{species: "Darmanitan", ability: 'zenmode', moves: ['entrainment', 'sleeptalk']},
		], [
			{species: "Wynaut", ability: 'swiftswim', moves: ['skillswap', 'entrainment']},
		]]);

		const darm = battle.p1.active[0];
		battle.makeChoices();
		assert.equal(darm.ability, 'swiftswim');

		battle.makeChoices('move sleeptalk', 'move skillswap');
		battle.makeChoices('move entrainment', 'move entrainment');
		assert.equal(darm.ability, 'swiftswim');
	});
});
