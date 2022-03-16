'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe("Accuracy", function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should round half down when applying a modifier`, function () {
		battle = common.createBattle([
			[{species: 'Butterfree', ability: 'compoundeyes', moves: ['sleeppowder']}],
			[{species: 'Beldum', moves: ['poltergeist']}],
		]);

		battle.onEvent('Accuracy', battle.format, function (accuracy) {
			assert.equal(accuracy, 98, 'CompoundEyes Sleep Powder should be 98% accurate');
		});

		battle.makeChoices();

		battle = common.createBattle([
			[{species: 'Butterfree', ability: 'victorystar', moves: ['fireblast']}],
			[{species: 'Regirock', moves: ['sleeptalk']}],
		]);

		battle.onEvent('Accuracy', battle.format, function (accuracy) {
			assert.equal(accuracy, 94, 'Victory Star Fire Blast should be 94% accurate');
		});

		battle.makeChoices();

		battle = common.createBattle([
			[{species: 'Butterfree', item: 'widelens', moves: ['fireblast']}],
			[{species: 'Regirock', moves: ['sleeptalk']}],
		]);

		battle.onEvent('Accuracy', battle.format, function (accuracy) {
			assert.equal(accuracy, 93, 'Wide Lens Fire Blast should be 93% accurate');
		});

		battle.makeChoices();
	});

	it(`should chain modifiers in order of the Pokemon's raw speed`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Mewtwo', ability: 'victorystar', moves: ['gravity', 'sleeptalk', 'sandattack']},
			{species: 'Charizard', ability: 'compoundeyes', moves: ['sleeptalk', 'fireblast']},
		], [
			{species: 'Bonsly', ability: 'tangledfeet', moves: ['doubleteam', 'sleeptalk']},
			{species: 'Pyukumuku', ability: 'noguard', moves: ['confuseray', 'sandattack', 'sleeptalk']},
		]]);

		battle.makeChoices('move sandattack -2, move sleeptalk', 'move doubleteam, move sandattack 2');
		battle.makeChoices('auto', 'move sleeptalk, move confuseray -1');

		battle.onEvent('Accuracy', battle.format, function (accuracy, target, source, move) {
			if (move.id !== 'fireblast') return;
			assert.equal(accuracy, 51);
		});

		battle.makeChoices('move gravity, move fire blast 1', 'move sleeptalk, move sleeptalk');

		// Changing the Pokemon's Speeds around changes the chaining order, which affects the result
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Bonsly', ability: 'victorystar', moves: ['gravity', 'sleeptalk', 'sandattack']},
			{species: 'Charizard', ability: 'compoundeyes', moves: ['sleeptalk', 'fireblast']},
		], [
			{species: 'Mewtwo', ability: 'tangledfeet', moves: ['doubleteam', 'sleeptalk']},
			{species: 'Pyukumuku', ability: 'noguard', moves: ['confuseray', 'sandattack', 'sleeptalk']},
		]]);

		battle.makeChoices('move sandattack -2, move sleeptalk', 'move doubleteam, move sandattack 2');
		battle.makeChoices('auto', 'move sleeptalk, move confuseray -1');

		battle.onEvent('Accuracy', battle.format, function (accuracy, target, source, move) {
			if (move.id !== 'fireblast') return;
			assert.equal(accuracy, 50);
		});

		battle.makeChoices('move gravity, move fire blast 1', 'move sleeptalk, move sleeptalk');
	});
});
