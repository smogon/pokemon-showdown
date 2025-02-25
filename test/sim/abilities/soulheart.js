'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Soul-Heart', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should activate on each individual KO`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Toxapex', moves: ['sleeptalk']},
			{species: 'Victini', moves: ['finalgambit']},
		], [
			{species: 'Magearna', ability: 'soulheart', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);

		const magearna = battle.p2.active[0];
		battle.makeChoices('move sleeptalk, move finalgambit 2', 'auto');
		assert.statStage(magearna, 'spa', 2);

		const log = battle.getDebugLog();
		const soulHeartFirstIndex = log.indexOf('|Soul-Heart');
		const soulHeartSecondIndex = log.lastIndexOf('|Soul-Heart');
		assert.notEqual(soulHeartFirstIndex, soulHeartSecondIndex, 'Soul-Heart should have activated twice.');
	});

	it(`should not activate if two Soul-Hearts are KOed on the same side`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Gengar', moves: ['astralbarrage']},
			{species: 'Aron', moves: ['sleeptalk']},
		], [
			{species: 'Magearna', ability: 'soulheart', level: 1, moves: ['sleeptalk']},
			{species: 'Wynaut', ability: 'soulheart', level: 1, moves: ['sleeptalk']},
			{species: 'Roggenrola', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();

		const log = battle.getDebugLog();
		const soulHeartIndex = log.indexOf('|Soul-Heart');
		assert.equal(soulHeartIndex, -1, 'Soul-Heart should not have activated.');
	});

	it.skip(`should activate an opposing Soul-Heart if the attacker's ally was first KOed in a spread move`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Landorus', moves: ['earthquake']},
			{species: 'Aron', moves: ['sleeptalk']},
		], [
			{species: 'Magearna', ability: 'soulheart', level: 1, moves: ['sleeptalk']},
			{species: 'Lugia', moves: ['sleeptalk']},
		]]);
		battle.makeChoices();

		const log = battle.getDebugLog();
		const soulHeartIndex = log.indexOf('|Soul-Heart');
		assert.notEqual(soulHeartIndex, -1, 'Soul-Heart should have activated, despite being KOed right after.');
	});
});
