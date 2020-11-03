'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Skill Swap', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should not be able to Skill Swap certain abilities', function () {
		battle = common.createBattle([[
			{species: 'wynaut', ability: 'moxie', moves: ['skillswap', 'sleeptalk']},
			{species: 'wynaut', ability: 'schooling', moves: ['skillswap']},
			{species: 'wynaut', ability: 'wonderguard', moves: ['skillswap']},
		], [
			{species: 'ferroseed', ability: 'overcoat', moves: ['skillswap', 'sleeptalk']},
			{species: 'ferroseed', ability: 'schooling', moves: ['skillswap']},
			{species: 'ferroseed', ability: 'wonderguard', moves: ['skillswap']},
		]]);

		let wynaut = battle.p1.active[0];
		let ferroseed = battle.p2.active[0];

		// user: Moxie; target: Overcoat; expected: success
		battle.makeChoices('move skillswap', 'move sleeptalk');
		assert.equal(wynaut.ability, 'overcoat');
		assert.equal(ferroseed.ability, 'moxie');

		// Skill Swap the abilities back
		battle.makeChoices('move skillswap', 'move sleeptalk');

		// user: Moxie; target: Schooling; expected: failure
		battle.makeChoices('move skillswap', 'switch 2');
		wynaut = battle.p1.active[0];
		ferroseed = battle.p2.active[0];
		assert.equal(wynaut.ability, 'moxie');
		assert.equal(ferroseed.ability, 'schooling');

		// user: Moxie; target: Wonder Guard; expected: failure
		battle.makeChoices('move skillswap', 'switch 3');
		wynaut = battle.p1.active[0];
		ferroseed = battle.p2.active[0];
		assert.equal(wynaut.ability, 'moxie');
		assert.equal(ferroseed.ability, 'wonderguard');

		// user: Wonder Guard; target: Moxie; expected: failure
		battle.makeChoices('move sleeptalk', 'move skillswap');
		wynaut = battle.p1.active[0];
		ferroseed = battle.p2.active[0];
		assert.equal(wynaut.ability, 'moxie');
		assert.equal(ferroseed.ability, 'wonderguard');

		// user: Schooling; target: Moxie; expected: failure
		battle.makeChoices('move sleeptalk', 'switch 3');
		battle.makeChoices('move sleeptalk', 'move skillswap');
		wynaut = battle.p1.active[0];
		ferroseed = battle.p2.active[0];
		assert.equal(wynaut.ability, 'moxie');
		assert.equal(ferroseed.ability, 'schooling');
	});
});
