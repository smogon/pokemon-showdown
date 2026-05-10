'use strict';

const assert = require('assert').strict;
const common = require('./../../common');

let battle;

describe(`[Hackmons] Xerneas`, () => {
	it(`should change its ability to Fairy Aura`, () => {
		battle = common.createBattle([[
			{ species: 'xerneas', ability: 'intimidate', moves: ['rest'] },
		], [
			{ species: 'magikarp', moves: ['rest'] },
		]]);
		const xerneas = battle.p1.active[0];
		assert.equal(xerneas.ability, 'fairyaura');
	});

	it(`should not change the ability of Xerneas-Active`, () => {
		battle = common.createBattle([[
			{ species: 'xerneasactive', ability: 'intimidate', moves: ['rest'] },
		], [
			{ species: 'magikarp', moves: ['rest'] },
		]]);
		const xerneas = battle.p1.active[0];
		assert.equal(xerneas.ability, 'intimidate');
	});
});
