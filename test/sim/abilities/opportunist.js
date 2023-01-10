'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Opportunist", () => {
	it("should not cause an infinite loop with itself", () => {
		battle = common.createBattle([[
			{species: 'Espathra', ability: 'Opportunist', moves: ['calmmind']},
		], [
			{species: 'Espathra', ability: 'Opportunist', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		assert.equal(battle.p1.active[0].boosts.spa, 1);
		assert.equal(battle.p2.active[0].boosts.spa, 1);
	});
});
