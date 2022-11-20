'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Shed Tail', () => {
	it("should make the user switch out and pass a Substitute", () => {
		battle = common.createBattle([[
			{species: 'Cyclizar', ability: 'shedskin', moves: ['shedtail']},
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
		], [
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
		]]);
		battle.makeChoices();
		assert.equal(battle.requestState, 'switch');
		battle.choose('p1', 'switch 2');
		assert(battle.p1.active[0].volatiles['substitute']);
	});

	it("should fail (and not set Substitute) if the user has no teammates", () => {
		battle = common.createBattle([[
			{species: 'Cyclizar', ability: 'shedskin', moves: ['shedtail']},
		], [
			{species: 'Magikarp', ability: 'swiftswim', moves: ['splash']},
		]]);
		battle.makeChoices();
		assert.false(battle.p1.active[0].volatiles['substitute']);
	});
});
