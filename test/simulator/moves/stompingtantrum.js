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

		battle.onEvent('BasePower', battle.getFormat(), function (basePower) {
			assert.strictEqual(basePower, 150);
		});

		battle.makeChoices('move attract', 'move rest');
		battle.makeChoices('move stompingtantrum', 'move rest');
		battle.makeChoices('move spore', 'move rest');
		battle.makeChoices('move stompingtantrum', 'move rest');
	});

	it('should not double its Base Power if the last move used on the previous turn hit protect', function () {
		battle = common.createBattle([
			[{species: 'Marowak', ability: 'rockhead', moves: ['stompingtantrum']}],
			[{species: 'Manaphy', ability: 'hydration', moves: ['protect']}],
		]);

		battle.onEvent('BasePower', battle.getFormat(), function (basePower) {
			assert.strictEqual(basePower, 75);
		});

		battle.makeChoices('move stompingtantrum', 'move protect');
		battle.makeChoices('move stompingtantrum', 'move protect');
	});

	it('should not double its Base Power if the last move used on the previous turn was a successful Celebrate', function () {
		battle = common.createBattle([
			[{species: 'Snorlax', ability: 'thickfat', moves: ['celebrate', 'stompingtantrum']}],
			[{species: 'Manaphy', ability: 'hydration', moves: ['rest']}],
		]);

		battle.onEvent('BasePower', battle.getFormat(), function (basePower) {
			assert.strictEqual(basePower, 75);
		});

		battle.makeChoices('move celebrate', 'move rest');
		battle.makeChoices('move stompingtantrum', 'move rest');
	});

	it('should not double its Base Power if the last "move" used on the previous turn was a recharge', function () {
		battle = common.createBattle([
			[{species: 'Marowak-Alola', ability: 'rockhead', moves: ['stompingtantrum', 'hyperbeam']}],
			[{species: 'Lycanroc-Midnight', ability: 'noguard', moves: ['sleeptalk']}],
		]);

		battle.onEvent('BasePower', battle.getFormat(), function (basePower, pokemon, target, move) {
			if (move.id === 'stompingtantrum') assert.strictEqual(basePower, 75);
		});

		battle.makeChoices('move hyperbeam', 'move sleeptalk');
		battle.makeChoices('move recharge', 'move sleeptalk');
		battle.makeChoices('move stompingtantrum', 'move sleeptalk');
	});
});
