'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('G-Max Chi Strike', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should boost the user and its ally's critical hit rate by 1 stage`, function () {
		battle = common.gen(8).createBattle({gameType: 'doubles'}, [[
			{species: 'Machamp', moves: ['rocksmash'], gigantamax: true},
			{species: 'Wynaut', moves: ['tackle']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);

		battle.onEvent('ModifyCritRatio', battle.format, function (critRatio, target, source, move) {
			if (move.id === 'tackle') {
				assert.equal(critRatio, 2, `Wynaut's crit rate should be boosted by G-Max Chi Strike`);
			}
		});

		battle.makeChoices('move rocksmash 1 dynamax, move tackle 2', 'auto');
	});

	it(`should provide a crit boost independent of Focus Energy`, function () {
		battle = common.gen(8).createBattle({gameType: 'doubles'}, [[
			{species: 'Machamp', moves: ['sleeptalk', 'rocksmash'], gigantamax: true},
			{species: 'Wynaut', moves: ['focusenergy', 'tackle']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);

		battle.onEvent('ModifyCritRatio', battle.format, function (critRatio, target, source, move) {
			if (move.id === 'tackle') {
				assert.equal(critRatio, 4, `Wynaut's crit rate should be boosted by both G-Max Chi Strike and Focus Energy`);
			}
		});

		battle.makeChoices();
		battle.makeChoices('move rocksmash 1 dynamax, move tackle 2', 'auto');
	});

	it(`should be copied by Psych Up`, function () {
		battle = common.gen(8).createBattle([[
			{species: 'Machamp', moves: ['rocksmash', 'sleeptalk'], gigantamax: true},
		], [
			{species: 'Wynaut', moves: ['psychup', 'tackle']},
		]]);

		battle.onEvent('ModifyCritRatio', battle.format, function (critRatio, target, source, move) {
			if (move.id === 'tackle') {
				assert.equal(critRatio, 2, `Wynaut's crit rate should be boosted by Psych Up'd G-Max Chi Strike`);
			}
		});

		battle.makeChoices('move rocksmash dynamax', 'move psychup');
		battle.makeChoices('move rocksmash', 'move tackle');
	});

	it(`should not be passed by Baton Pass`, function () {
		battle = common.gen(8).createBattle([[
			{species: 'Machamp', moves: ['rocksmash', 'batonpass'], gigantamax: true},
			{species: 'Magikarp', moves: ['tackle']},
		], [
			{species: 'Wynaut', moves: ['sleeptalk']},
		]]);

		battle.onEvent('ModifyCritRatio', battle.format, function (critRatio, target, source, move) {
			if (move.id === 'tackle') {
				assert.equal(critRatio, 1, `Magikarp's crit rate should not be boosted by Baton Passed G-Max Chi Strike`);
			}
		});

		battle.makeChoices('move rocksmash 1 dynamax', 'auto');
		battle.makeChoices('move maxguard', 'auto');
		battle.makeChoices('move maxguard', 'auto');

		battle.makeChoices('move batonpass', 'auto');
		battle.makeChoices('switch 2');
		battle.makeChoices('move tackle', 'auto');
	});
});
