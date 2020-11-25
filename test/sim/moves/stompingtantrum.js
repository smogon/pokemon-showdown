'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Stomping Tantrum', function () {
	afterEach(function () {
		battle.destroy();
	});

	it('should double its Base Power if the last move used on the previous turn failed', function () {
		battle = common.createBattle([
			[{species: 'Marowak', ability: 'rockhead', moves: ['attract', 'spore', 'stompingtantrum']}],
			[{species: 'Manaphy', ability: 'hydration', moves: ['rest']}],
		]);

		battle.onEvent('BasePower', battle.format, function (basePower) {
			assert.equal(basePower, 150);
		});

		battle.makeChoices('move attract', 'move rest');
		battle.makeChoices('move stompingtantrum', 'move rest');
		battle.makeChoices('move spore', 'move rest');
		battle.makeChoices('move stompingtantrum', 'move rest');
	});

	it('should not double its Base Power if the last move used on the previous turn hit protect', function () {
		battle = common.createBattle([
			[{species: 'Marowak', ability: 'rockhead', moves: ['stompingtantrum']}],
			[{species: 'Manaphy', ability: 'hydration', moves: ['protect', 'tailglow']}],
		]);

		battle.onEvent('BasePower', battle.format, function (basePower) {
			assert.equal(basePower, 75);
		});

		battle.makeChoices('move stompingtantrum', 'move protect');
		battle.makeChoices('move stompingtantrum', 'move tailglow');
	});

	it('should double its Base Power if the last move used was a spread move that partially hit protect and otherwise failed', function () {
		battle = common.createBattle({gameType: 'doubles'});
		battle.setPlayer('p1', {team: [
			{species: 'Cresselia', ability: 'levitate', moves: ['sunnyday']},
			{species: 'Groudon', ability: 'drought', moves: ['stompingtantrum', 'precipiceblades']},
		]});
		battle.setPlayer('p2', {team: [
			{species: 'Tapu lele', ability: 'psychicsurge', moves: ['protect', 'calmmind']},
			{species: 'Ho-Oh', ability: 'pressure', moves: ['recover']},
		]});

		battle.onEvent('BasePower', battle.format, function (basePower, attacker, defender, move) {
			if (move.id === 'stompingtantrum') assert.equal(basePower, 150);
		});

		battle.makeChoices('move sunnyday, move precipiceblades', 'move protect, move recover');
		battle.makeChoices('move sunnyday, move stompingtantrum 1', 'move calmmind, move recover');
	});

	it('should not double its Base Power if the last move used on the previous turn was a successful Celebrate', function () {
		battle = common.createBattle([
			[{species: 'Snorlax', ability: 'thickfat', moves: ['celebrate', 'stompingtantrum']}],
			[{species: 'Manaphy', ability: 'hydration', moves: ['rest']}],
		]);

		battle.onEvent('BasePower', battle.format, function (basePower) {
			assert.equal(basePower, 75);
		});

		battle.makeChoices('move celebrate', 'move rest');
		battle.makeChoices('move stompingtantrum', 'move rest');
	});

	it('should not double its Base Power if the last "move" used on the previous turn was a recharge', function () {
		battle = common.createBattle([
			[{species: 'Marowak-Alola', ability: 'rockhead', moves: ['stompingtantrum', 'hyperbeam']}],
			[{species: 'Lycanroc-Midnight', ability: 'noguard', moves: ['sleeptalk']}],
		]);

		battle.onEvent('BasePower', battle.format, function (basePower, pokemon, target, move) {
			if (move.id === 'stompingtantrum') assert.equal(basePower, 75);
		});

		battle.makeChoices('move hyperbeam', 'move sleeptalk');
		battle.makeChoices('move recharge', 'move sleeptalk');
		battle.makeChoices('move stompingtantrum', 'move sleeptalk');
	});

	it('should cause Gravity-negated moves to double in BP, even Z-moves', function () {
		battle = common.gen(7).createBattle([[
			{species: "Magikarp", item: 'normaliumz', moves: ['splash', 'stompingtantrum']},
		], [
			{species: "Accelgor", moves: ['gravity']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower, pokemon, target, move) {
			if (move.id === 'stompingtantrum') assert.equal(basePower, 150);
		});

		battle.makeChoices('move splash', 'move gravity');
		battle.makeChoices('move stomping tantrum', 'move gravity');

		battle.makeChoices('move splash zmove', 'move gravity');
		battle.makeChoices('move stomping tantrum', 'move gravity');
	});
});
