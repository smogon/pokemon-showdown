'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Sunsteel Strike', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not ignore the user's own Ability`, function () {
		battle = common.createBattle([[
			{species: 'metagross', ability: 'clearbody', moves: ['sunsteelstrike']},
		], [
			{species: 'goodra', ability: 'gooey', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const metagross = battle.p1.active[0];
		assert.statStage(metagross, 'spe', 0);
	});

	it(`should ignore the user's own Ability (Gen 7)`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'metagross', ability: 'clearbody', moves: ['sunsteelstrike']},
		], [
			{species: 'goodra', ability: 'gooey', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const metagross = battle.p1.active[0];
		assert.statStage(metagross, 'spe', -1);
	});
});
