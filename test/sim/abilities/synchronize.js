'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Synchronize', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should complete before Lum Berry can trigger`, function () {
		battle = common.createBattle({seed: [1, 2, 3, 4]}, [[ // Currently determined by RNG; it should not
			{species: 'alakazam', ability: 'synchronize', item: 'lumberry', moves: ['sleeptalk']},
		], [
			{species: 'ralts', ability: 'synchronize', item: 'lumberry', moves: ['thunderwave']},
		]]);
		battle.makeChoices();
		const alakazam = battle.p1.active[0];
		const ralts = battle.p2.active[0];
		assert.false.holdsItem(alakazam);
		assert.false.holdsItem(ralts);
		assert.notEqual(alakazam.status, 'par');
		assert.notEqual(ralts.status, 'par');
	});
});
