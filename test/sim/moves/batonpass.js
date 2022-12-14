'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Baton Pass`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should switch the user out, passing with it a variety of effects`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['focusenergy', 'substitute', 'swordsdance', 'batonpass']},
			{species: 'wingull', moves: ['sleeptalk']},
		], [
			{species: 'pichu', ability: 'noguard', moves: ['leechseed']},
		]]);
		for (let i = 1; i < 5; i++) battle.makeChoices('move ' + i, 'auto');
		battle.makeChoices('switch wingull');
		const wingull = battle.p1.active[0];
		assert.species(wingull, 'Wingull');
		assert.statStage(wingull, 'atk', 2);
		assert('focusenergy' in wingull.volatiles);
		assert('substitute' in wingull.volatiles);
		assert('leechseed' in wingull.volatiles);
	});

	it(`should fail to switch the user out if no Pokemon can be switched in`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['batonpass']},
		], [
			{species: 'pichu', moves: ['swordsdance']},
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.startsWith('|-fail')));

		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', moves: ['batonpass']},
			{species: 'pichu', moves: ['swordsdance']},
		], [
			{species: 'pichu', moves: ['swordsdance']},
			{species: 'pichu', moves: ['swordsdance']},
		]]);
		battle.makeChoices();
		assert(battle.log.some(line => line.startsWith('|-fail')));
	});
});
