'use strict';

const assert = require('assert').strict;
const common = require('./../../common');

let battle;

describe(`Tera Starstorm`, function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should be a physical attack when terastallized with higher attack stat and the user is Terapagos-Stellar`, function () {
		battle = common.gen(9).createBattle([[
			{species: 'terapagos', evs: {atk: 252}, ability: 'terashift', moves: ['terastarstorm'], teraType: 'Stellar'},
		], [
			{species: 'regirock', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move terastarstorm terastallize', 'auto');
		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Physical');
	});

	it(`should be a spread move when the user is Terapagos-Stellar`, function () {
		battle = common.gen(9).createBattle({gameType: 'doubles'}, [[
			{species: 'terapagos', ability: 'terashift', moves: ['terastarstorm'], teraType: 'Stellar'},
			{species: 'pichu', moves: ['sleeptalk']},
		], [
			{species: 'regirock', moves: ['sleeptalk']},
			{species: 'registeel', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move terastarstorm -2 terastallize, move sleeptalk', 'auto');

		assert.fullHP(battle.p1.active[1]);
		assert.false.fullHP(battle.p2.active[0]);
		assert.false.fullHP(battle.p2.active[1]);
	});

	it(`should only get its unique properties while the user is Terapagos-Stellar`, function () {
		battle = common.gen(9).createBattle({gameType: 'doubles'}, [[
			{species: 'incineroar', moves: ['terastarstorm'], teraType: 'Stellar'},
			{species: 'pichu', moves: ['sleeptalk']},
		], [
			{species: 'mismagius', moves: ['sleeptalk']},
			{species: 'registeel', moves: ['sleeptalk']},
		]]);

		battle.makeChoices('move terastarstorm 1 terastallize, move sleeptalk', 'auto');

		assert.fullHP(battle.p2.active[0]);
		assert.fullHP(battle.p2.active[1]);
		assert.equal(battle.p1.pokemon[0].lastMove.category, 'Special');
	});
});
