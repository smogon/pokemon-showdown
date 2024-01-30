'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Court Change`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should swap certain side conditions to the opponent's side and vice versa`, function () {
		battle = common.createBattle([[
			{species: 'wynaut', moves: ['sleeptalk', 'stealthrock', 'lightscreen']},
		], [
			{species: 'cinderace', moves: ['courtchange', 'tailwind', 'safeguard']},
		]]);
		battle.makeChoices('move stealthrock', 'move tailwind');
		battle.makeChoices('move lightscreen', 'move safeguard');
		battle.makeChoices('move sleeptalk', 'move courtchange');

		assert(!!battle.p1.sideConditions['tailwind']);
		assert(!!battle.p1.sideConditions['safeguard']);
		assert(!!battle.p1.sideConditions['stealthrock']);
		assert(!!battle.p2.sideConditions['lightscreen']);
	});

	it(`should allow Sticky Web to trigger Defiant when set by the Defiant user's team`, function () {
		battle = common.createBattle([[
			{species: 'cinderace', moves: ['courtchange', 'stickyweb', 'sleeptalk']},
			{species: 'pawniard', ability: 'defiant', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move stickyweb', 'auto');
		battle.makeChoices('move courtchange', 'auto');
		battle.makeChoices('switch 2', 'auto');

		assert(!!battle.p1.sideConditions['stickyweb']);
		assert.statStage(battle.p1.active[0], 'atk', 2);
	});

	it(`[Gen 8] should not allow Sticky Web to trigger Defiant when set by the Defiant user's team`, function () {
		battle = common.gen(8).createBattle([[
			{species: 'cinderace', moves: ['courtchange', 'stickyweb', 'sleeptalk']},
			{species: 'pawniard', ability: 'defiant', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', moves: ['sleeptalk']},
		]]);
		battle.makeChoices('move stickyweb', 'auto');
		battle.makeChoices('move courtchange', 'auto');
		battle.makeChoices('switch 2', 'auto');

		assert(!!battle.p1.sideConditions['stickyweb']);
		assert.statStage(battle.p1.active[0], 'atk', 0);
	});
});
