'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Synchronize', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should complete before Lum Berry can trigger`, function () {
		battle = common.createBattle([[
			{species: 'alakazam', ability: 'synchronize', item: 'lumberry', moves: ['sleeptalk']},
		], [
			{species: 'ralts', ability: 'synchronize', item: 'lumberry', moves: ['glare']},
		]]);
		battle.makeChoices();
		const alakazam = battle.p1.active[0];
		const ralts = battle.p2.active[0];
		assert.false.holdsItem(alakazam, `Alakazam should not be holding an item`);
		assert.false.holdsItem(ralts, `Ralts should not be holding an item`);
		assert.notEqual(alakazam.status, 'par', `Alakazam should not be paralyzed`);
		assert.notEqual(ralts.status, 'par', `Ralts should not be paralyzed`);
	});
});
