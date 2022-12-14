'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("White Herb", function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should activate after Parting Shot drops both stats, but before the switch is resolved', function () {
		battle = common.createBattle([[
			{species: 'torracat', moves: ['partingshot']},
			{species: 'litten', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', item: 'whiteherb', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const wynaut = battle.p2.active[0];
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', 0);
		assert.statStage(wynaut, 'spa', 0);
	});

	it.skip('should activate after Abilities that boost stats on KOs', function () {
		battle = common.createBattle([[
			{species: 'litten', level: 1, ability: 'noguard', moves: ['sleeptalk']},
			{species: 'torracat', moves: ['partingshot']},
		], [
			{species: 'wynaut', item: 'whiteherb', ability: 'grimneigh', moves: ['dracometeor']},
		]]);
		battle.makeChoices();
		const wynaut = battle.p2.active[0];
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'spa', 0);
	});

	it.skip('should activate after two Intimidate switch in at the same time', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'litten', ability: 'intimidate', moves: ['sleeptalk']},
			{species: 'torracat', ability: 'intimidate', moves: ['sleeptalk', 'finalgambit']},
			{species: 'litten', ability: 'intimidate', moves: ['sleeptalk']},
			{species: 'landorustherian', ability: 'intimidate', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', item: 'whiteherb', moves: ['sleeptalk', 'recycle']},
			{species: 'fraxure', moves: ['sleeptalk']},
		]]);

		// Leads
		battle.makeChoices();
		const wynaut = battle.p2.active[0];
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', 0);

		// After a double KO
		battle.makeChoices('move sleeptalk, move finalgambit -1', 'move recycle, move sleeptalk');
		battle.makeChoices('switch 3, switch 4');
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', 0);
	});
});
