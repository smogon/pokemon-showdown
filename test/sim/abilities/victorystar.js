'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Victory Star", function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`can boost accuracy twice if both the user and ally have the ability`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Victini', ability: 'victorystar', moves: ['hypnosis']},
			{species: 'Wynaut', ability: 'victorystar', moves: ['poltergeist']},
		], [
			{species: 'Dratini', moves: ['poltergeist']},
			{species: 'Avalugg', moves: ['poltergeist']},
		]]);

		battle.onEvent('Accuracy', battle.format, function (accuracy) {
			assert.equal(accuracy, 73);
		});

		battle.makeChoices();
	});

	it(`should not boost the accuracy of opponents`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Victini', ability: 'victorystar', moves: ['sleeptalk']},
			{species: 'Wynaut', ability: 'victorystar', moves: ['sleeptalk']},
		], [
			{species: 'Dratini', moves: ['hypnosis']},
			{species: 'Avalugg', moves: ['sleeptalk']},
		]]);

		battle.onEvent('Accuracy', battle.format, function (accuracy) {
			assert.equal(accuracy, 60);
		});

		battle.makeChoices();
	});

	it(`should boost accuracy even when used against allies`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Victini', ability: 'victorystar', moves: ['sleeptalk']},
			{species: 'Wynaut', ability: 'victorystar', moves: ['irontail']},
		], [
			{species: 'Dratini', moves: ['sleeptalk']},
			{species: 'Avalugg', moves: ['sleeptalk']},
		]]);

		battle.onEvent('Accuracy', battle.format, function (accuracy) {
			assert.equal(accuracy, 91);
		});

		battle.makeChoices('move sleeptalk, move irontail -1', 'auto');
	});
});
