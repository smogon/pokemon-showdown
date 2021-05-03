'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Gluttony', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should activate Aguav Berry at 50% health`, function () {
		battle = common.createBattle([[
			{species: "Wobbuffet", ability: 'gluttony', item: 'aguavberry', evs: {hp: 4}, moves: ['sleeptalk']},
		], [
			{species: "wynaut", ability: 'compoundeyes', moves: ['superfang']},
		]]);

		battle.makeChoices();
		const wobbuffet = battle.p1.active[0];
		assert.equal(wobbuffet.hp, Math.floor(wobbuffet.maxhp / 2) + Math.floor(wobbuffet.maxhp * 0.33));
	});
});
