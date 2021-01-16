'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Perish Song', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should KO all Pokemon that heard it in 3 turns`, function () {
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Primarina", moves: ['perishsong', 'moonblast']},
			{species: "Magikarp", moves: ['splash']},
		], [
			{species: "Magikarp", moves: ['splash']},
			{species: "Magikarp", moves: ['splash']},
		]]);
		battle.makeChoices('move perishsong, move splash', 'auto');
		// We've had a crash related to fainted Pokemon and Perish Song
		battle.makeChoices('move moonblast 1, move splash', 'auto');
		battle.makeChoices();
		battle.makeChoices();
		for (const active of battle.getAllActive()) {
			assert.fainted(active);
		}
	});

	it(`should cause Pokemon to faint by order of Speed`, function () {
		battle = common.createBattle([[
			{species: 'Weavile', moves: ['perishsong']},
		], [
			{species: 'Slowpoke', moves: ['sleeptalk']},
		]]);

		for (let i = 0; i < 4; i++) { battle.makeChoices(); }
		assert.equal(battle.winner, 'Player 2');
	});

	it(`should not affect other Pokemon with the ability Soundproof`, function () {
		battle = common.createBattle([[
			{species: 'Weavile', ability: 'soundproof', moves: ['perishsong']},
		], [
			{species: 'Slowpoke', ability: 'soundproof', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert(battle.p1.active[0].volatiles['perishsong'], 'Weavile should have been affected by its own Perish Song');
		assert.false(battle.p2.active[0].volatiles['perishsong'], 'Slowpoke should not have been affected by Perish Song');
	});

	it(`should not affect any Pokemon with the ability Soundproof in Gen 7`, function () {
		battle = common.gen(7).createBattle([[
			{species: 'Weavile', ability: 'soundproof', moves: ['perishsong']},
		], [
			{species: 'Slowpoke', ability: 'soundproof', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		assert.false(battle.p1.active[0].volatiles['perishsong'], 'Weavile should not have been affected by Perish Song');
		assert.false(battle.p2.active[0].volatiles['perishsong'], 'Slowpoke should not have been affected by Perish Song');
	});
});
