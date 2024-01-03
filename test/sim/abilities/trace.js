'use strict';

const assert = require('./../../assert');
const common = require('./../../common');

let battle;

describe('Trace', function () {
	afterEach(function () {
		battle.destroy();
	});

	it(`should copy the opponent's Ability`, function () {
		battle = common.createBattle([[
			{species: "Ralts", ability: 'trace', moves: ['sleeptalk']},
		], [
			{species: "Wynaut", ability: 'shadowtag', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const ralts = battle.p1.active[0];
		assert.equal(ralts.ability, 'shadowtag');
	});

	it(`should delay copying the opponent's Ability if the initial Abilities could not be copied by Trace`, function () {
		battle = common.createBattle([[
			{species: "Ralts", ability: 'trace', moves: ['sleeptalk']},
		], [
			{species: "Arceus", ability: 'multitype', moves: ['sleeptalk']},
			{species: "Aegislash", ability: 'stancechange', moves: ['sleeptalk']},
			{species: "Wynaut", ability: 'shadowtag', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		const ralts = battle.p1.active[0];
		assert.equal(ralts.ability, 'trace');

		battle.makeChoices('auto', 'switch 2');
		assert.equal(ralts.ability, 'trace');

		battle.makeChoices('auto', 'switch 3');
		assert.equal(ralts.ability, 'shadowtag');
	});

	// see research: https://www.smogon.com/forums/threads/pokemon-sun-moon-battle-mechanics-research.3586701/post-7790209
	it(`should interact properly with Ability index 0 'No Ability'`, function () {
		// Trace stops working if it initially finds 'No Ability'
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Ralts", ability: 'trace', moves: ['sleeptalk']},
			{species: "Bouffalant", ability: 'sapsipper', moves: ['sleeptalk']},
		], [
			{species: "Wynaut", ability: 'noability', moves: ['sleeptalk']},
			{species: "Wynaut", ability: 'unburden', moves: ['sleeptalk']},
			{species: "Wynaut", ability: 'triage', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		let ralts = battle.p1.active[0];
		assert.equal(ralts.ability, 'trace');

		battle.makeChoices('auto', 'switch 3, move sleeptalk');
		assert.equal(ralts.ability, 'trace');

		// Trace will continue if it checks later on if it can take 'No Ability'
		battle = common.createBattle({gameType: 'doubles'}, [[
			{species: "Ralts", ability: 'trace', moves: ['sleeptalk']},
			{species: "Bouffalant", ability: 'sapsipper', moves: ['sleeptalk']},
		], [
			{species: "Wynaut", ability: 'stancechange', moves: ['sleeptalk']},
			{species: "Wynaut", ability: 'stancechange', moves: ['sleeptalk']},
			{species: "Wynaut", ability: 'noability', moves: ['sleeptalk']},
			{species: "Wynaut", ability: 'unburden', moves: ['sleeptalk']},
		]]);

		battle.makeChoices();
		ralts = battle.p1.active[0];
		assert.equal(ralts.ability, 'trace');

		battle.makeChoices('auto', 'switch 3, move sleeptalk');
		assert.equal(ralts.ability, 'trace');

		battle.makeChoices('auto', 'switch 4, move sleeptalk');
		assert.equal(ralts.ability, 'unburden');
	});
});
