"use strict";

const assert = require("./../../assert");
const common = require("./../../common");

let battle;

describe(`Lock-On`, () => {
	afterEach(() => {
		battle.destroy();
	});

	it(`should not allow OHKO moves to hit a higher level in Gen 2`, () => {
		battle = common.gen(2).createBattle([[
			{ species: 'smeargle', level: 1, moves: ['lockon', 'guillotine'] },
		], [
			{ species: 'alakazam', level: 100, moves: ['curse'] },
		]]);
		battle.makeChoices('move lockon', 'move curse');
		const alakazam = battle.p2.active[0];
		battle.makeChoices('move guillotine', 'move curse');
		assert.false.fainted(alakazam);
	});
});
