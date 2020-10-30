'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Berserk', function () {
	afterEach(function () {
		battle.destroy();
	});

	it.skip(`should activate prior to healing from Sitrus Berry`, function () {
		battle = common.createBattle([[
			{species: "Drampa", item: 'sitrusberry', ability: 'berserk', evs: {hp: 4}, moves: ['sleeptalk']},
		], [
			{species: "wynaut", ability: 'compoundeyes', moves: ['superfang']},
		]]);

		battle.makeChoices();
		const drampa = battle.p1.active[0];
		assert.statStage(drampa, 'spa', 1);
		assert.equal(drampa.hp, Math.floor(drampa.maxhp / 2) + Math.floor(drampa.maxhp / 4));
	});
});
