'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Intrepid Sword', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should only increase the user's Attack stat once per game`, function () {
		battle = common.createBattle([[
			{species: 'Zacian', ability: 'intrepidsword', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Mew', moves: ['sleeptalk']},
		]]);

		const zacian = battle.p1.active[0];
		assert.statStage(zacian, 'atk', 1);
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'auto');
		assert.statStage(zacian, 'atk', 0);
	});

	it(`should use up its once-per-game boost if it switches in with +6 Attack`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['bellydrum', 'batonpass']},
			{species: 'Zacian', ability: 'intrepidsword', moves: ['sleeptalk']},
		], [
			{species: 'Mew', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move bellydrum', 'auto');
		battle.makeChoices('move batonpass', 'auto');
		battle.makeChoices('switch 2');
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'auto');
		const zacian = battle.p1.active[0];
		assert.statStage(zacian, 'atk', 0);
	});

	it(`should not use up its once-per-game boost if it switches in while its Ability is suppressed`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['batonpass']},
			{species: 'Zacian', ability: 'intrepidsword', moves: ['sleeptalk']},
		], [
			{species: 'Mew', moves: ['sleeptalk', 'gastroacid']},
		]]);

		battle.makeChoices('move batonpass', 'move gastroacid');
		battle.makeChoices('switch 2');
		const zacian = battle.p1.active[0];
		assert.statStage(zacian, 'atk', 0);

		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'auto');
		assert.statStage(zacian, 'atk', 1);
	});

	it(`should be able to increase the user's Attack stat multiple times per game [Gen 8]`, function () {
		battle = common.gen(8).createBattle([[
			{species: 'Zacian', ability: 'intrepidsword', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		], [
			{species: 'Mew', moves: ['sleeptalk']},
		]]);

		const zacian = battle.p1.active[0];
		assert.statStage(zacian, 'atk', 1);
		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('switch 2', 'auto');
		assert.statStage(zacian, 'atk', 1);
	});
});
