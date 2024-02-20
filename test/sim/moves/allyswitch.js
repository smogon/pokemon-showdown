'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe(`Ally Switch`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should cause the Pokemon to switch sides in a double battle`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: 'Primeape', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['allyswitch']},
		], [
			{species: 'Dreepy', moves: ['sleeptalk']},
			{species: 'Pichu', moves: ['sleeptalk']},
		]]);

		let wynaut = battle.p1.active[1];
		assert.species(wynaut, 'Wynaut');
		battle.makeChoices();

		wynaut = battle.p1.active[0];
		assert.species(wynaut, 'Wynaut');
	});

	it(`should not work if the user is in the center of a Triple Battle`, function () {
		battle = common.gen(6).createBattle({gameType: 'triples'}, [[
			{species: 'Primeape', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['allyswitch']},
			{species: 'Shaymin', moves: ['sleeptalk']},
		], [
			{species: 'Murkrow', moves: ['sleeptalk']},
			{species: 'Pichu', moves: ['sleeptalk']},
			{species: 'Skrelp', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const wynaut = battle.p1.active[1];
		assert.species(wynaut, 'Wynaut');
	});

	it(`should swap Pokemon on the edges of a Triple Battle`, function () {
		battle = common.gen(6).createBattle({gameType: 'triples'}, [[
			{species: 'Wynaut', moves: ['allyswitch']},
			{species: 'Primeape', moves: ['sleeptalk']},
			{species: 'Shaymin', moves: ['sleeptalk']},
		], [
			{species: 'Murkrow', moves: ['sleeptalk']},
			{species: 'Pichu', moves: ['sleeptalk']},
			{species: 'Skrelp', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const wynaut = battle.p1.active[2];
		assert.species(wynaut, 'Wynaut');
	});

	it(`should not work in formats where you do not control allies`, function () {
		battle = common.createBattle([[
			{species: 'Wynaut', moves: ['allyswitch']},
		], [
			{species: 'Pichu', moves: ['swordsdance']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('|-fail|')), `It should fail in singles`);

		battle = common.createBattle({gameType: 'multi'}, [[
			{species: 'Wynaut', moves: ['allyswitch']},
		], [
			{species: 'Cubone', moves: ['swordsdance']},
		], [
			{species: 'Marowak', moves: ['swordsdance']},
		], [
			{species: 'Shaymin', moves: ['swordsdance']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('|-fail|')), `It should fail in multis`);

		battle = common.createBattle({gameType: 'freeforall'}, [[
			{species: 'wynaut', moves: ['allyswitch']},
		], [
			{species: 'scyther', moves: ['swordsdance']},
		], [
			{species: 'scizor', moves: ['swordsdance']},
		], [
			{species: 'shaymin', moves: ['swordsdance']},
		]]);

		battle.makeChoices();
		assert(battle.log.some(line => line.includes('|-fail|')), `It should fail in FFAs`);
	});

	it(`should have a chance to fail when used successively`, function () {
		battle = common.createBattle({gameType: 'doubles', forceRandomChance: false}, [[
			{species: 'Primeape', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['allyswitch']},
		], [
			{species: 'Dreepy', moves: ['sleeptalk']},
			{species: 'Pichu', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices();

		const wynaut = battle.p1.active[0];
		assert.species(wynaut, 'Wynaut');
	});

	it(`[Gen 8] should not have a chance to fail when used successively`, function () {
		battle = common.gen(8).createBattle({gameType: 'doubles', forceRandomChance: false}, [[
			{species: 'Primeape', moves: ['sleeptalk']},
			{species: 'Wynaut', moves: ['allyswitch']},
		], [
			{species: 'Dreepy', moves: ['sleeptalk']},
			{species: 'Pichu', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		battle.makeChoices();

		const wynaut = battle.p1.active[1];
		assert.species(wynaut, 'Wynaut');
	});

	it(`should not use the protection counter when determining if the move should fail`, function () {
		battle = common.createBattle({gameType: 'doubles', forceRandomChance: false}, [[
			{species: 'Primeape', moves: ['calmmind']},
			{species: 'Wynaut', moves: ['allyswitch', 'protect']},
		], [
			{species: 'Dreepy', moves: ['calmmind']},
			{species: 'Pichu', moves: ['calmmind']},
		]]);

		battle.makeChoices('move calmmind, move allyswitch', 'auto');
		battle.makeChoices('move protect, move calmmind', 'auto');
		battle.makeChoices('move allyswitch, move calmmind', 'auto');
		battle.makeChoices('move calmmind, move protect', 'auto');

		assert(battle.log.every(line => !line.startsWith('|-fail')));
	});
});
