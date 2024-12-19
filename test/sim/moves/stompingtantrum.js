'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Stomping Tantrum', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should double its Base Power if the last move used on the previous turn failed`, function () {
		battle = common.createBattle([[
			{species: 'Marowak', moves: ['attract', 'spore', 'stompingtantrum']},
		], [
			{species: 'Manaphy', moves: ['rest']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower) {
			assert.equal(basePower, 150);
		});

		battle.makeChoices('move attract', 'move rest'); // Manaphy is genderless, so Attract fails
		battle.makeChoices('move stompingtantrum', 'move rest');
		battle.makeChoices('move spore', 'move rest'); // Manaphy is now asleep, so Spore fails
		battle.makeChoices('move stompingtantrum', 'move rest');
	});

	it(`should not double its Base Power if the last move used on the previous turn hit Protect`, function () {
		battle = common.createBattle([[
			{species: 'Marowak', moves: ['stompingtantrum']},
		], [
			{species: 'Manaphy', moves: ['protect', 'sleeptalk']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower) {
			assert.equal(basePower, 75);
		});

		battle.makeChoices('move stompingtantrum', 'move protect');
		battle.makeChoices('move stompingtantrum', 'move sleeptalk');
	});

	it(`should double its Base Power if the last move used was a spread move that partially hit Protect and otherwise failed`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Cresselia', moves: ['sunnyday']},
			{species: 'Groudon', ability: 'noguard', moves: ['stompingtantrum', 'precipiceblades']},
		], [
			{species: 'Tapu Lele', moves: ['protect', 'calmmind']},
			{species: 'Ho-Oh', moves: ['recover']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower, attacker, defender, move) {
			if (move.id === 'stompingtantrum') assert.equal(basePower, 150);
		});

		battle.makeChoices('move sunnyday, move precipiceblades', 'move protect, move recover');
		battle.makeChoices('move sunnyday, move stompingtantrum 1', 'move calmmind, move recover');
	});

	it(`should not double its Base Power if the last move used on the previous turn was a successful Celebrate`, function () {
		battle = common.createBattle([[
			{species: 'Snorlax', moves: ['celebrate', 'stompingtantrum']},
		], [
			{species: 'Manaphy', moves: ['sleeptalk']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower) {
			assert.equal(basePower, 75);
		});

		battle.makeChoices('move celebrate', 'auto');
		battle.makeChoices('move stompingtantrum', 'auto');
	});

	it(`should not double its Base Power if the last "move" used on the previous turn was a recharge`, function () {
		battle = common.createBattle([[
			{species: 'Marowak-Alola', ability: 'noguard', moves: ['stompingtantrum', 'hyperbeam']},
		], [
			{species: 'Lycanroc-Midnight', moves: ['sleeptalk']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower, pokemon, target, move) {
			if (move.id === 'stompingtantrum') assert.equal(basePower, 75);
		});

		battle.makeChoices('move hyperbeam', 'auto');
		battle.makeChoices('move recharge', 'auto');
		battle.makeChoices('move stompingtantrum', 'auto');
	});

	it.skip(`should not double its Base Power if the user dropped mid-Fly due to Smack Down`, function () {
		battle = common.createBattle([[
			{species: 'Magikarp', moves: ['fly', 'stompingtantrum']},
		], [
			{species: 'Wynaut', moves: ['smackdown']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower, pokemon, target, move) {
			if (move.id === 'stompingtantrum') assert.equal(basePower, 75);
		});

		battle.makeChoices();
		battle.makeChoices('move stompingtantrum', 'auto');
	});

	it(`should double its Base Power if a two-turn move fails for a different reason`, function () {
		battle = common.createBattle([[
			{species: 'Magikarp', moves: ['dive', 'stompingtantrum']},
		], [
			{species: 'Wynaut', ability: 'waterabsorb', moves: ['splash']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower, pokemon, target, move) {
			if (move.id === 'stompingtantrum') assert.equal(basePower, 150);
		});

		battle.makeChoices();
		battle.makeChoices();
		battle.makeChoices('move stompingtantrum', 'auto');
	});

	it(`should double its Base Power on some failure conditions of Rest`, function () {
		battle = common.createBattle([[
			{species: 'Magikarp', ability: 'comatose', moves: ['rest', 'stompingtantrum']},
			{species: 'Feebas', ability: 'insomnia', moves: ['rest', 'stompingtantrum']},
		], [
			{species: 'Accelgor', moves: ['sleeptalk', 'nightshade']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower, pokemon, target, move) {
			if (move.id === 'stompingtantrum') assert.equal(basePower, 150);
		});

		battle.makeChoices('move rest', 'auto'); // Rest while user already asleep or Comatose
		battle.makeChoices('move stompingtantrum', 'auto');

		battle.makeChoices('switch 2', 'auto');
		battle.makeChoices('move rest', 'auto'); // Rest while user at full HP
		battle.makeChoices('move stompingtantrum', 'auto');

		battle.makeChoices('move rest', 'move nightshade'); // Rest while has Insomnia
		battle.makeChoices('move stompingtantrum', 'auto');
	});

	it.skip(`should not double its Base Power on other failure conditions of Rest`, function () {
		battle = common.createBattle([[
			{species: 'Magikarp', moves: ['rest', 'stompingtantrum', 'defog']},
		], [
			{species: 'Accelgor', moves: ['sleeptalk', 'nightshade', 'electricterrain', 'mistyterrain']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower, pokemon, target, move) {
			if (move.id === 'stompingtantrum') assert.equal(basePower, 75);
		});

		battle.makeChoices('move rest', 'move electricterrain');
		battle.makeChoices('move rest', 'move nightshade'); // Rest in Electric Terrain
		battle.makeChoices('move stompingtantrum', 'auto');

		battle.makeChoices('move rest', 'move mistyterrain'); // Rest in Misty Terrain
		battle.makeChoices('move stompingtantrum', 'auto');

		battle.makeChoices('move defog', 'auto');
		battle.makeChoices('move rest', 'move uproar'); // Rest in Uproar
		battle.makeChoices('move stompingtantrum', 'auto');
	});

	it.skip(`should not double its Base Power on most failed healing effects`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Magikarp', moves: ['roost', 'lifedew', 'healpulse', 'stompingtantrum']},
			{species: 'Feebas', moves: ['shoreup', 'junglehealing', 'pollenpuff', 'stompingtantrum']},
		], [
			{species: 'Accelgor', moves: ['sleeptalk']},
			{species: 'Accelgor', moves: ['sleeptalk']},
		]]);

		battle.onEvent('BasePower', battle.format, function (basePower, pokemon, target, move) {
			if (move.id === 'stompingtantrum') assert.equal(basePower, 75);
		});

		battle.makeChoices('move roost, move shoreup', 'auto');
		battle.makeChoices('move stompingtantrum 1, move stompingtantrum 1', 'auto');

		battle.makeChoices('move lifedew, move junglehealing', 'auto');
		battle.makeChoices('move stompingtantrum 1, move stompingtantrum 1', 'auto');

		battle.makeChoices('move healpulse -2, move pollenpuff -1', 'auto');
		battle.makeChoices('move stompingtantrum 1, move stompingtantrum 1', 'auto');
	});

	it(`should cause Gravity-negated moves to double in BP, even Z-moves`, function () {
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
