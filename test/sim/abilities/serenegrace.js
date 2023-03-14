'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Serene Grace`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should not stack with Pledge Rainbow for flinches`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', ability: 'serenegrace', moves: ['bite', 'waterpledge']},
			{species: 'wobbuffet', moves: ['sleeptalk', 'firepledge']},
		], [
			{species: 'pyukumuku', moves: ['sleeptalk']},
			{species: 'feebas', moves: ['sleeptalk']},
		]]);

		battle.onEvent('ModifyMove', battle.format, -99, function (move) {
			if (move.id === 'bite') {
				for (const secondary of move.secondaries) {
					assert.equal(secondary.chance, 60, `Bite should not have a quadrupled flinch chance`);
				}
			}
		});

		battle.makeChoices('move waterpledge 1, move firepledge 1', 'auto');
		battle.makeChoices('move bite 1, move sleeptalk', 'auto');
	});

	it(`[Gen 8] should overflow when quadrupling a stat drop effect with Pledge Rainbow`, function () {
		battle = common.gen(8).createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', ability: 'serenegrace', moves: ['poweruppunch', 'waterpledge']},
			{species: 'wobbuffet', ability: 'serenegrace', moves: ['acidspray', 'firepledge']},
		], [
			{species: 'magikarp', moves: ['sleeptalk']},
			{species: 'feebas', moves: ['sleeptalk']},
		]]);

		// Modding secondary chances so it will either always apply or never apply
		// (64 * 2 * 2) % 256 === 0
		battle.onEvent('ModifyMove', battle.format, 1, function (move) {
			if (move.secondaries) {
				for (const secondary of move.secondaries) {
					secondary.chance = 64;
				}
			}
		});

		battle.makeChoices('move waterpledge 1, move firepledge 1', 'auto');
		battle.makeChoices('move poweruppunch 1, move acidspray 2', 'auto');

		const wynaut = battle.p1.active[0];
		assert.statStage(wynaut, 'atk', 0);
		const feebas = battle.p2.active[1];
		assert.statStage(feebas, 'spd', 0);
	});

	it(`should not overflow when quadrupling a status effect with Pledge Rainbow`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'wynaut', ability: 'serenegrace', moves: ['nuzzle', 'waterpledge']},
			{species: 'wobbuffet', ability: 'serenegrace', moves: ['flamethrower', 'firepledge']},
		], [
			{species: 'magikarp', moves: ['sleeptalk']},
			{species: 'feebas', moves: ['sleeptalk']},
		]]);

		// Modding secondary chances so it will either always apply or never apply
		// (64 * 2 * 2) % 256 === 0
		battle.onEvent('ModifyMove', battle.format, 1, function (move) {
			if (move.secondaries) {
				for (const secondary of move.secondaries) {
					secondary.chance = 64;
				}
			}
		});

		battle.makeChoices('move waterpledge 1, move firepledge 1', 'auto');
		battle.makeChoices('move nuzzle 1, move flamethrower 2', 'auto');

		const magikarp = battle.p2.active[0];
		assert.equal(magikarp.status, 'par');
		const feebas = battle.p2.active[1];
		assert.equal(feebas.status, 'brn');
	});
});
