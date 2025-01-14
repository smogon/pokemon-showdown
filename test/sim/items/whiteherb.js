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
			{species: 'wynaut', ability: 'grimneigh', item: 'whiteherb', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();
		const wynaut = battle.p2.active[0];
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', 0);
		assert.statStage(wynaut, 'spa', 0);
	});

	it('should activate after Abilities that boost SPA on KOs', function () {
		//Soul-Heart
		battle = common.createBattle([[
			{species: 'litten', level: 1, ability: 'noguard', moves: ['sleeptalk']},
			{species: 'torracat', moves: ['partingshot']},
		], [
			{species: 'wynaut', item: 'whiteherb', ability: 'soulheart', moves: ['dracometeor']},
		]]);
		battle.makeChoices('move sleeptalk', 'move dracometeor');
		const wynaut2 = battle.p2.active[0];
		battle.makeChoices('switch 2');
		assert.false.holdsItem(wynaut2);
		assert.statStage(wynaut2, 'spa', 0);
	});

	it('should activate after Abilities that boost ATK on KOs', function () {
		//Moxie
		battle = common.createBattle([[
			{species: 'litten', level: 1, ability: 'noguard', moves: ['sleeptalk']},
			{species: 'torracat', moves: ['partingshot']},
		], [
			{species: 'wynaut', item: 'whiteherb', ability: 'moxie', moves: ['superpower']},
		]]);
		battle.makeChoices();
		const wynaut = battle.p2.active[0];
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', 0);
		assert.statStage(wynaut, 'def', 0);
	});

	it('should activate after two Intimidate switch in at the same time', function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'litten', ability: 'intimidate', moves: ['sleeptalk']},
			{species: 'torracat', ability: 'intimidate', moves: ['sleeptalk', 'finalgambit', 'growl']},
			{species: 'litten', ability: 'intimidate', moves: ['sleeptalk']},
			{species: 'landorustherian', ability: 'intimidate', moves: ['sleeptalk']},
		], [
			{species: 'wynaut', ability: 'grimneigh', item: 'whiteherb', moves: ['sleeptalk', 'recycle']},
			{species: 'fraxure', moves: ['sleeptalk']},
		]]);

		// Leads
		battle.makeChoices();
		const wynaut = battle.p2.active[0];
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', 0);
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move recycle, move sleeptalk');

		// After a single switch-in Intimidate + Growl
		battle.makeChoices('switch 3, move growl', 'move sleeptalk, move sleeptalk');
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', -1);
		battle.makeChoices('move sleeptalk, move sleeptalk', 'move recycle, move sleeptalk');

		// After a double KO
		battle.makeChoices('move sleeptalk, move finalgambit -1', 'move recycle, move sleeptalk');
		battle.makeChoices('switch 3, switch 4');
		assert.false.holdsItem(wynaut);
		assert.statStage(wynaut, 'atk', 0);
	});
});
